import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter?: nodemailer.Transporter;
  private readonly resendApiKey: string | null;

  constructor(private configService: ConfigService) {
    const smtpHost = this.configService.get<string>('SMTP_HOST');
    const smtpPort = this.configService.get<number>('SMTP_PORT');
    const smtpUser = this.configService.get<string>('SMTP_USER');
    const smtpPass = this.configService.get<string>('SMTP_PASS');
    this.resendApiKey =
      this.configService.get<string>('RESEND_API_KEY') ||
      this.configService.get<string>('EMAIL_PROVIDER_KEY') ||
      null;

    if (smtpHost && smtpPort && smtpUser && smtpPass) {
      this.transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });
    }
  }

  private getFromEmail() {
    return this.configService.get<string>('SMTP_FROM_EMAIL') || this.configService.get<string>('EMAIL_FROM') || 'no-reply@orylis.fr';
  }

  private getFromName() {
    return this.configService.get<string>('SMTP_FROM_NAME') || 'MSV Nosy Be';
  }

  private getFromHeader() {
    return `${this.getFromName()} <${this.getFromEmail()}>`;
  }

  private getClientEmail() {
    return this.configService.get<string>('CLIENT_EMAIL') || this.getFromEmail();
  }

  async sendEmail(options: { to: string | string[]; subject: string; html: string; replyTo?: string }) {
    const mailOptions = {
      from: this.getFromHeader(),
      to: options.to,
      subject: options.subject,
      html: options.html,
      ...(options.replyTo ? { replyTo: options.replyTo } : {}),
    };

    try {
      if (this.resendApiKey) {
        const recipients = Array.isArray(options.to) ? options.to : [options.to];
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: this.getFromHeader(),
            to: recipients,
            subject: options.subject,
            html: options.html,
            ...(options.replyTo ? { reply_to: options.replyTo } : {}),
          }),
        });

        if (!response.ok) {
          const bodyText = await response.text();
          throw new Error(`Resend API error (${response.status}): ${bodyText}`);
        }
      } else if (this.transporter) {
        await this.transporter.sendMail(mailOptions);
      } else {
        throw new ServiceUnavailableException(
          'Email service is not configured. Set RESEND_API_KEY or SMTP_* variables.',
        );
      }

      console.log(`✅ Email sent to ${Array.isArray(options.to) ? options.to.join(', ') : options.to}`);
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }

  async sendOrderConfirmation(email: string, orderNumber: string, orderDetails: any) {
    const mailOptions = {
      to: email,
      subject: `Confirmation de commande - ${orderNumber}`,
      html: this.getOrderConfirmationTemplate(orderNumber, orderDetails),
    };

    try {
      await this.sendEmail(mailOptions);
      console.log(`✅ Order confirmation email sent to ${email}`);
    } catch (error) {
      console.error('Failed to send order confirmation email:', error);
    }
  }

  async sendAdminOrderNotification(orderNumber: string, orderDetails: any) {
    const recipient = this.getClientEmail();
    const mailOptions = {
      to: recipient,
      subject: `Nouvelle commande reçue - ${orderNumber}`,
      html: this.getAdminOrderNotificationTemplate(orderNumber, orderDetails),
      replyTo: orderDetails?.email || undefined,
    };

    try {
      await this.sendEmail(mailOptions);
      console.log(`✅ Admin order notification sent to ${recipient}`);
    } catch (error) {
      console.error('Failed to send admin order notification email:', error);
    }
  }

  async sendPaymentConfirmation(email: string, orderNumber: string) {
    const mailOptions = {
      to: email,
      subject: `Paiement confirmé - ${orderNumber}`,
      html: this.getPaymentConfirmationTemplate(orderNumber),
    };

    try {
      await this.sendEmail(mailOptions);
      console.log(`✅ Payment confirmation email sent to ${email}`);
    } catch (error) {
      console.error('Failed to send payment confirmation email:', error);
    }
  }

  async sendAdminPaymentNotification(orderNumber: string, orderDetails: any) {
    const recipient = this.getClientEmail();
    const mailOptions = {
      to: recipient,
      subject: `Paiement confirmé - ${orderNumber}`,
      html: this.getAdminPaymentNotificationTemplate(orderNumber, orderDetails),
      replyTo: orderDetails?.email || undefined,
    };

    try {
      await this.sendEmail(mailOptions);
      console.log(`✅ Admin payment notification sent to ${recipient}`);
    } catch (error) {
      console.error('Failed to send admin payment notification email:', error);
    }
  }

  async sendAbandonedCartReminder(email: string, cartId: string, cartItems: any[], daysAgo: number) {
    const subject = daysAgo === 1
      ? 'Vous avez oublié des articles dans votre panier !'
      : 'Dernière chance ! Votre panier vous attend';

    const mailOptions = {
      to: email,
      subject,
      html: this.getAbandonedCartTemplate(cartItems, daysAgo),
    };

    try {
      await this.sendEmail(mailOptions);
      console.log(`✅ Abandoned cart reminder sent to ${email} (Day +${daysAgo})`);
    } catch (error) {
      console.error('Failed to send abandoned cart email:', error);
    }
  }

  async sendContactMessage(payload: {
    name: string;
    email: string;
    message: string;
  }) {
    await this.sendEmail({
      to: this.getClientEmail(),
      subject: `Nouveau message contact - ${payload.name}`,
      replyTo: payload.email,
      html: `
        <h2>Nouveau message depuis le formulaire de contact</h2>
        <p><strong>Nom:</strong> ${payload.name}</p>
        <p><strong>Email:</strong> ${payload.email}</p>
        <p><strong>Message:</strong></p>
        <p>${payload.message.replace(/\n/g, '<br />')}</p>
      `,
    });

    await this.sendEmail({
      to: payload.email,
      subject: 'Nous avons bien reçu votre message',
      html: `
        <p>Bonjour ${payload.name},</p>
        <p>Merci pour votre message. Notre équipe vous répondra rapidement.</p>
        <p>Cordialement,<br/>${this.getFromName()}</p>
      `,
    });
  }

  async sendB2BLead(payload: {
    company: string;
    email: string;
    need: string;
  }) {
    await this.sendEmail({
      to: this.getClientEmail(),
      subject: `Nouveau lead B2B - ${payload.company}`,
      replyTo: payload.email,
      html: `
        <h2>Nouvelle demande B2B</h2>
        <p><strong>Entreprise:</strong> ${payload.company}</p>
        <p><strong>Email:</strong> ${payload.email}</p>
        <p><strong>Besoin:</strong></p>
        <p>${payload.need.replace(/\n/g, '<br />')}</p>
      `,
    });

    await this.sendEmail({
      to: payload.email,
      subject: 'Votre demande B2B a bien été reçue',
      html: `
        <p>Bonjour,</p>
        <p>Merci pour votre demande de devis. Notre équipe commerciale revient vers vous sous 24h ouvrées.</p>
        <p>Cordialement,<br/>${this.getFromName()}</p>
      `,
    });
  }

  async sendNewsletterSubscription(email: string) {
    await this.sendEmail({
      to: this.getClientEmail(),
      subject: 'Nouvelle inscription newsletter',
      replyTo: email,
      html: `
        <h2>Nouvelle inscription marketing</h2>
        <p><strong>Email:</strong> ${email}</p>
      `,
    });

    await this.sendEmail({
      to: email,
      subject: 'Bienvenue dans la newsletter MSV Nosy Be',
      html: `
        <p>Bonjour,</p>
        <p>Merci pour votre inscription. Vous recevrez nos offres et actualités en avant-première.</p>
        <p>À bientôt,<br/>${this.getFromName()}</p>
      `,
    });
  }

  private getOrderConfirmationTemplate(orderNumber: string, orderDetails: any): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Confirmation de commande</h1>
          </div>
          <div class="content">
            <p>Merci pour votre commande !</p>
            <p><strong>Numéro de commande :</strong> ${orderNumber}</p>
            <p>Nous vous enverrons un e-mail dès l'expédition de votre commande.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} M.S.V Nosy Be. Tous droits réservés.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getPaymentConfirmationTemplate(orderNumber: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2196F3; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Paiement confirmé</h1>
          </div>
          <div class="content">
            <p>Excellente nouvelle ! Votre paiement a bien été reçu.</p>
            <p><strong>Numéro de commande :</strong> ${orderNumber}</p>
            <p>Nous préparons actuellement votre commande pour l'expédition.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getAdminOrderNotificationTemplate(orderNumber: string, orderDetails: any): string {
    const shippingAddress = orderDetails?.shippingAddress || {};
    const customerName = [shippingAddress.firstName, shippingAddress.lastName].filter(Boolean).join(' ') || 'Client';
    const orderDate = orderDetails?.createdAt
      ? new Date(orderDetails.createdAt).toLocaleString('fr-FR')
      : new Date().toLocaleString('fr-FR');
    const items = Array.isArray(orderDetails?.items) ? orderDetails.items : [];
    const itemsRows = items.map((item: any) => {
      const title = item?.title || item?.product?.title || 'Produit';
      const quantity = item?.quantity || 0;
      const unitPrice = typeof item?.price === 'number'
        ? (item.price / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
        : '-';

      return `<tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${title}</td>
        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: center;">${quantity}</td>
        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">${unitPrice}</td>
      </tr>`;
    }).join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #18181b; }
          .container { max-width: 700px; margin: 0 auto; padding: 20px; }
          .header { background: #14532d; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .card { background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-top: 16px; }
          table { width: 100%; border-collapse: collapse; }
          .muted { color: #52525b; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Nouvelle commande reçue</h1>
          </div>
          <div class="content">
            <p>Une nouvelle commande vient d'être enregistrée sur la boutique.</p>
            <div class="card">
              <p><strong>Commande :</strong> ${orderNumber}</p>
              <p><strong>Date :</strong> ${orderDate}</p>
              <p><strong>Client :</strong> ${customerName}</p>
              <p><strong>Email :</strong> ${orderDetails?.email || '-'}</p>
              <p><strong>Téléphone :</strong> ${shippingAddress.phone || '-'}</p>
              <p><strong>Total :</strong> ${typeof orderDetails?.total === 'number' ? (orderDetails.total / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }) : '-'}</p>
            </div>
            <div class="card">
              <h2 style="margin-top: 0;">Adresse de livraison</h2>
              <p>${customerName}</p>
              <p>${shippingAddress.address1 || '-'}</p>
              ${shippingAddress.address2 ? `<p>${shippingAddress.address2}</p>` : ''}
              <p>${shippingAddress.postalCode || '-'} ${shippingAddress.city || ''}</p>
              ${shippingAddress.province ? `<p>${shippingAddress.province}</p>` : ''}
              <p>${shippingAddress.country || '-'}</p>
            </div>
            <div class="card">
              <h2 style="margin-top: 0;">Articles commandés</h2>
              <table>
                <thead>
                  <tr>
                    <th style="text-align: left; padding-bottom: 8px;">Produit</th>
                    <th style="text-align: center; padding-bottom: 8px;">Qté</th>
                    <th style="text-align: right; padding-bottom: 8px;">PU</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsRows || '<tr><td colspan="3" class="muted">Aucun article trouvé.</td></tr>'}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getAdminPaymentNotificationTemplate(orderNumber: string, orderDetails: any): string {
    const shippingAddress = orderDetails?.shippingAddress || {};
    const customerName = [shippingAddress.firstName, shippingAddress.lastName].filter(Boolean).join(' ') || 'Client';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #18181b; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1d4ed8; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .card { background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-top: 16px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Paiement confirmé</h1>
          </div>
          <div class="content">
            <p>Le paiement d'une commande vient d'être confirmé.</p>
            <div class="card">
              <p><strong>Commande :</strong> ${orderNumber}</p>
              <p><strong>Client :</strong> ${customerName}</p>
              <p><strong>Email :</strong> ${orderDetails?.email || '-'}</p>
              <p><strong>Total :</strong> ${typeof orderDetails?.total === 'number' ? (orderDetails.total / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }) : '-'}</p>
              <p><strong>Adresse :</strong> ${shippingAddress.address1 || '-'}, ${shippingAddress.postalCode || '-'} ${shippingAddress.city || ''}, ${shippingAddress.country || '-'}</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getAbandonedCartTemplate(cartItems: any[], daysAgo: number): string {
    const itemsList = cartItems.map(item => `<li>${item.product?.title || 'Produit'} (x${item.quantity})</li>`).join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #FF9800; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .cta { text-align: center; margin: 20px 0; }
          .button { background: #FF9800; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🛒 Votre panier vous attend !</h1>
          </div>
          <div class="content">
            <p>${daysAgo === 1 ? "Vous avez laissé quelques articles dans votre panier :" : "Dernière chance ! Ne passez pas à côté de ces articles :"}</p>
            <ul>${itemsList}</ul>
            <div class="cta">
              <a href="${this.configService.get('APP_URL')}/cart" class="button">Terminer mes achats</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
