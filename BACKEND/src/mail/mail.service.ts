import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import PDFDocument = require('pdfkit');

type EmailAttachment = {
  filename: string;
  content: Buffer;
  contentType?: string;
};

type OrderMailItem = {
  id?: string;
  title?: string;
  price?: number;
  quantity?: number;
  product?: {
    title?: string;
  };
};

type OrderMailAddress = {
  firstName?: string | null;
  lastName?: string | null;
  company?: string | null;
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  postalCode?: string | null;
  province?: string | null;
  country?: string | null;
  phone?: string | null;
};

type OrderMailDetails = {
  email?: string;
  subtotal?: number;
  tax?: number;
  shipping?: number;
  total?: number;
  createdAt?: string | Date;
  shippingAddress?: any;
  billingAddress?: any;
  items?: OrderMailItem[];
};

type NotifiableOrderStatus = 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED';

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

  async sendEmail(options: { to: string | string[]; subject: string; html: string; replyTo?: string; attachments?: EmailAttachment[] }) {
    const mailOptions = {
      from: this.getFromHeader(),
      to: options.to,
      subject: options.subject,
      html: options.html,
      ...(options.attachments?.length
        ? {
          attachments: options.attachments.map((attachment) => ({
            filename: attachment.filename,
            content: attachment.content,
            contentType: attachment.contentType,
          })),
        }
        : {}),
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
            ...(options.attachments?.length
              ? {
                attachments: options.attachments.map((attachment) => ({
                  filename: attachment.filename,
                  content: attachment.content.toString('base64'),
                  ...(attachment.contentType ? { content_type: attachment.contentType } : {}),
                })),
              }
              : {}),
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

  async sendPaymentConfirmation(email: string, orderNumber: string, orderDetails: OrderMailDetails) {
    const invoicePdf = await this.generateInvoicePdf(orderNumber, orderDetails);
    const mailOptions = {
      to: email,
      subject: `Paiement confirmé - ${orderNumber}`,
      html: this.getPaymentConfirmationTemplate(orderNumber, orderDetails),
      attachments: [
        {
          filename: `facture-${orderNumber}.pdf`,
          content: invoicePdf,
          contentType: 'application/pdf',
        },
      ],
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
    const invoicePdf = await this.generateInvoicePdf(orderNumber, orderDetails);
    const mailOptions = {
      to: recipient,
      subject: `Paiement confirmé - ${orderNumber}`,
      html: this.getAdminPaymentNotificationTemplate(orderNumber, orderDetails),
      attachments: [
        {
          filename: `facture-${orderNumber}.pdf`,
          content: invoicePdf,
          contentType: 'application/pdf',
        },
      ],
      replyTo: orderDetails?.email || undefined,
    };

    try {
      await this.sendEmail(mailOptions);
      console.log(`✅ Admin payment notification sent to ${recipient}`);
    } catch (error) {
      console.error('Failed to send admin payment notification email:', error);
    }
  }

  async sendOrderStatusUpdate(email: string, orderNumber: string, orderDetails: OrderMailDetails, status: NotifiableOrderStatus) {
    const mailOptions = {
      to: email,
      subject: this.getOrderStatusSubject(orderNumber, status),
      html: this.getOrderStatusUpdateTemplate(orderNumber, orderDetails, status),
    };

    try {
      await this.sendEmail(mailOptions);
      console.log(`✅ Order status update email sent to ${email} (${status})`);
    } catch (error) {
      console.error('Failed to send order status update email:', error);
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

  private formatPrice(amountInCents?: number | null) {
    const safeAmount = typeof amountInCents === 'number' ? amountInCents : 0;
    return (safeAmount / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
  }

  private getOrderDate(orderDetails: OrderMailDetails) {
    const date = orderDetails?.createdAt ? new Date(orderDetails.createdAt) : new Date();
    return date.toLocaleString('fr-FR');
  }

  private getOrderItems(orderDetails: OrderMailDetails) {
    return Array.isArray(orderDetails?.items) ? orderDetails.items : [];
  }

  private getCustomerName(address?: OrderMailAddress | null, fallback = 'Client') {
    const name = [address?.firstName, address?.lastName].filter(Boolean).join(' ').trim();
    return name || fallback;
  }

  private getAddressLines(address?: OrderMailAddress | null) {
    if (!address) {
      return ['-'];
    }

    const cityLine = [address.postalCode, address.city].filter(Boolean).join(' ');
    return [
      address.company || null,
      this.getCustomerName(address, ''),
      address.address1 || null,
      address.address2 || null,
      cityLine || null,
      address.province || null,
      address.country || null,
      address.phone ? `Tél : ${address.phone}` : null,
    ].filter(Boolean) as string[];
  }

  private getOrderItemsTableRows(orderDetails: OrderMailDetails) {
    return this.getOrderItems(orderDetails).map((item) => {
      const title = item?.title || item?.product?.title || 'Produit';
      const quantity = item?.quantity || 0;
      const unitPrice = this.formatPrice(item?.price);
      const lineTotal = this.formatPrice((item?.price || 0) * quantity);

      return `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">${title}</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; text-align: center;">${quantity}</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">${unitPrice}</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">${lineTotal}</td>
        </tr>
      `;
    }).join('');
  }

  private getOrderTotalsHtml(orderDetails: OrderMailDetails) {
    return `
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #52525b;">Sous-total</td>
          <td style="padding: 8px 0; text-align: right;">${this.formatPrice(orderDetails?.subtotal)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #52525b;">Livraison</td>
          <td style="padding: 8px 0; text-align: right;">${this.formatPrice(orderDetails?.shipping)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #52525b;">Taxes</td>
          <td style="padding: 8px 0; text-align: right;">${this.formatPrice(orderDetails?.tax)}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0 0; font-weight: 700;">Total</td>
          <td style="padding: 12px 0 0; text-align: right; font-weight: 700;">${this.formatPrice(orderDetails?.total)}</td>
        </tr>
      </table>
    `;
  }

  private getStatusPresentation(status: NotifiableOrderStatus) {
    switch (status) {
      case 'PAID':
        return {
          subject: 'Votre commande a été validée',
          title: 'Commande validée',
          intro: 'Bonne nouvelle : votre commande a bien été validée.',
          outro: 'Nous allons maintenant lancer la préparation de votre commande.',
          color: '#14532d',
        };
      case 'PROCESSING':
        return {
          subject: 'Votre commande est en préparation',
          title: 'Commande en préparation',
          intro: 'Votre commande est actuellement en cours de préparation par notre équipe.',
          outro: 'Nous vous préviendrons dès que votre colis sera expédié.',
          color: '#4338ca',
        };
      case 'SHIPPED':
        return {
          subject: 'Votre commande a été expédiée',
          title: 'Commande expédiée',
          intro: 'Votre commande a été expédiée.',
          outro: 'Votre colis est désormais en route.',
          color: '#7c3aed',
        };
      case 'DELIVERED':
        return {
          subject: 'Votre commande a été livrée',
          title: 'Commande livrée',
          intro: 'Votre commande a bien été livrée.',
          outro: 'Nous espérons que cette sélection vous plaira et sublimera vos prochaines créations.',
          color: '#0f766e',
        };
    }
  }

  private getOrderStatusSubject(orderNumber: string, status: NotifiableOrderStatus) {
    return `${this.getStatusPresentation(status).subject} - ${orderNumber}`;
  }

  private async generateInvoicePdf(orderNumber: string, orderDetails: OrderMailDetails) {
    const shippingAddress = orderDetails?.shippingAddress || null;
    const billingAddress = orderDetails?.billingAddress || shippingAddress;
    const items = this.getOrderItems(orderDetails);

    return new Promise<Buffer>((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 48 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      doc.fontSize(22).text(this.getFromName(), { align: 'left' });
      doc.moveDown(0.2);
      doc.fontSize(10).fillColor('#52525b').text(this.getFromEmail());
      doc.fillColor('#18181b');

      doc.moveDown(1.5);
      doc.fontSize(20).text('Facture');
      doc.moveDown(0.4);
      doc.fontSize(11).text(`Commande : ${orderNumber}`);
      doc.text(`Date : ${this.getOrderDate(orderDetails)}`);
      doc.text(`Client : ${this.getCustomerName(shippingAddress, orderDetails?.email || 'Client')}`);
      doc.text(`Email : ${orderDetails?.email || '-'}`);

      const billingTop = doc.y + 18;
      doc.moveDown(1.2);
      doc.fontSize(12).text('Adresse de facturation', 48, billingTop);
      doc.fontSize(10);
      this.getAddressLines(billingAddress).forEach((line, index) => {
        doc.text(line, 48, billingTop + 18 + index * 14);
      });

      doc.fontSize(12).text('Adresse de livraison', 320, billingTop);
      doc.fontSize(10);
      this.getAddressLines(shippingAddress).forEach((line, index) => {
        doc.text(line, 320, billingTop + 18 + index * 14);
      });

      let tableY = Math.max(doc.y, billingTop + 120);
      doc.moveTo(48, tableY).lineTo(547, tableY).stroke('#d4d4d8');
      tableY += 12;

      doc.fontSize(10).font('Helvetica-Bold');
      doc.text('Produit', 48, tableY);
      doc.text('Qté', 300, tableY, { width: 40, align: 'center' });
      doc.text('PU', 380, tableY, { width: 70, align: 'right' });
      doc.text('Total', 465, tableY, { width: 82, align: 'right' });
      doc.font('Helvetica');

      tableY += 18;
      items.forEach((item) => {
        const title = item?.title || item?.product?.title || 'Produit';
        const quantity = item?.quantity || 0;
        const unitPrice = this.formatPrice(item?.price);
        const lineTotal = this.formatPrice((item?.price || 0) * quantity);

        doc.text(title, 48, tableY, { width: 220 });
        doc.text(String(quantity), 300, tableY, { width: 40, align: 'center' });
        doc.text(unitPrice, 380, tableY, { width: 70, align: 'right' });
        doc.text(lineTotal, 465, tableY, { width: 82, align: 'right' });
        tableY += 18;
      });

      tableY += 8;
      doc.moveTo(48, tableY).lineTo(547, tableY).stroke('#d4d4d8');
      tableY += 16;

      const totalsX = 360;
      doc.font('Helvetica');
      doc.text('Sous-total', totalsX, tableY, { width: 100 });
      doc.text(this.formatPrice(orderDetails?.subtotal), 460, tableY, { width: 87, align: 'right' });
      tableY += 16;
      doc.text('Livraison', totalsX, tableY, { width: 100 });
      doc.text(this.formatPrice(orderDetails?.shipping), 460, tableY, { width: 87, align: 'right' });
      tableY += 16;
      doc.text('Taxes', totalsX, tableY, { width: 100 });
      doc.text(this.formatPrice(orderDetails?.tax), 460, tableY, { width: 87, align: 'right' });
      tableY += 22;
      doc.font('Helvetica-Bold');
      doc.text('Total', totalsX, tableY, { width: 100 });
      doc.text(this.formatPrice(orderDetails?.total), 460, tableY, { width: 87, align: 'right' });

      doc.moveDown(4);
      doc.font('Helvetica').fontSize(9).fillColor('#52525b');
      doc.text('Merci pour votre achat. Cette facture a été générée automatiquement.', 48, 760, {
        width: 499,
        align: 'center',
      });

      doc.end();
    });
  }

  private getOrderConfirmationTemplate(orderNumber: string, orderDetails: OrderMailDetails): string {
    const shippingAddress = orderDetails?.shippingAddress || null;
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #18181b; }
          .container { max-width: 680px; margin: 0 auto; padding: 20px; }
          .header { background: #14532d; color: white; padding: 24px; text-align: center; }
          .content { padding: 24px; background: #f9fafb; }
          .card { background: white; border: 1px solid #e5e7eb; border-radius: 10px; padding: 18px; margin-top: 18px; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          table { width: 100%; border-collapse: collapse; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Confirmation de commande</h1>
          </div>
          <div class="content">
            <p>Bonjour ${this.getCustomerName(shippingAddress)},</p>
            <p>Merci pour votre commande. Nous avons bien enregistré votre achat et préparons la suite.</p>
            <div class="card">
              <p><strong>Numéro de commande :</strong> ${orderNumber}</p>
              <p><strong>Date :</strong> ${this.getOrderDate(orderDetails)}</p>
              <p><strong>Email :</strong> ${orderDetails?.email || '-'}</p>
            </div>
            <div class="card">
              <h2 style="margin-top: 0;">Articles commandés</h2>
              <table>
                <thead>
                  <tr>
                    <th style="text-align: left; padding-bottom: 8px;">Produit</th>
                    <th style="text-align: center; padding-bottom: 8px;">Qté</th>
                    <th style="text-align: right; padding-bottom: 8px;">PU</th>
                    <th style="text-align: right; padding-bottom: 8px;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${this.getOrderItemsTableRows(orderDetails)}
                </tbody>
              </table>
            </div>
            <div class="card">
              <h2 style="margin-top: 0;">Récapitulatif</h2>
              ${this.getOrderTotalsHtml(orderDetails)}
            </div>
            <div class="card">
              <h2 style="margin-top: 0;">Adresse de livraison</h2>
              ${this.getAddressLines(shippingAddress).map((line) => `<p style="margin: 4px 0;">${line}</p>`).join('')}
            </div>
            <p>Nous vous enverrons un e-mail dès que le paiement sera confirmé et qu’une facture sera émise.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} M.S.V Nosy Be. Tous droits réservés.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getPaymentConfirmationTemplate(orderNumber: string, orderDetails: OrderMailDetails): string {
    const shippingAddress = orderDetails?.shippingAddress || null;
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #18181b; }
          .container { max-width: 680px; margin: 0 auto; padding: 20px; }
          .header { background: #1d4ed8; color: white; padding: 24px; text-align: center; }
          .content { padding: 24px; background: #f9fafb; }
          .card { background: white; border: 1px solid #e5e7eb; border-radius: 10px; padding: 18px; margin-top: 18px; }
          table { width: 100%; border-collapse: collapse; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Paiement confirmé</h1>
          </div>
          <div class="content">
            <p>Bonjour ${this.getCustomerName(shippingAddress)},</p>
            <p>Excellente nouvelle : votre paiement a bien été reçu. Vous trouverez votre facture en pièce jointe.</p>
            <div class="card">
              <p><strong>Numéro de commande :</strong> ${orderNumber}</p>
              <p><strong>Date :</strong> ${this.getOrderDate(orderDetails)}</p>
              <p><strong>Email :</strong> ${orderDetails?.email || '-'}</p>
            </div>
            <div class="card">
              <h2 style="margin-top: 0;">Articles commandés</h2>
              <table>
                <thead>
                  <tr>
                    <th style="text-align: left; padding-bottom: 8px;">Produit</th>
                    <th style="text-align: center; padding-bottom: 8px;">Qté</th>
                    <th style="text-align: right; padding-bottom: 8px;">PU</th>
                    <th style="text-align: right; padding-bottom: 8px;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${this.getOrderItemsTableRows(orderDetails)}
                </tbody>
              </table>
            </div>
            <div class="card">
              <h2 style="margin-top: 0;">Récapitulatif</h2>
              ${this.getOrderTotalsHtml(orderDetails)}
            </div>
            <p>Nous préparons désormais votre commande pour l’expédition.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getOrderStatusUpdateTemplate(orderNumber: string, orderDetails: OrderMailDetails, status: NotifiableOrderStatus): string {
    const shippingAddress = orderDetails?.shippingAddress || null;
    const presentation = this.getStatusPresentation(status);

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #18181b; }
          .container { max-width: 680px; margin: 0 auto; padding: 20px; }
          .header { background: ${presentation.color}; color: white; padding: 24px; text-align: center; }
          .content { padding: 24px; background: #f9fafb; }
          .card { background: white; border: 1px solid #e5e7eb; border-radius: 10px; padding: 18px; margin-top: 18px; }
          table { width: 100%; border-collapse: collapse; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${presentation.title}</h1>
          </div>
          <div class="content">
            <p>Bonjour ${this.getCustomerName(shippingAddress)},</p>
            <p>${presentation.intro}</p>
            <div class="card">
              <p><strong>Numéro de commande :</strong> ${orderNumber}</p>
              <p><strong>Date :</strong> ${this.getOrderDate(orderDetails)}</p>
              <p><strong>Email :</strong> ${orderDetails?.email || '-'}</p>
            </div>
            <div class="card">
              <h2 style="margin-top: 0;">Articles commandés</h2>
              <table>
                <thead>
                  <tr>
                    <th style="text-align: left; padding-bottom: 8px;">Produit</th>
                    <th style="text-align: center; padding-bottom: 8px;">Qté</th>
                    <th style="text-align: right; padding-bottom: 8px;">PU</th>
                    <th style="text-align: right; padding-bottom: 8px;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${this.getOrderItemsTableRows(orderDetails)}
                </tbody>
              </table>
            </div>
            <div class="card">
              <h2 style="margin-top: 0;">Récapitulatif</h2>
              ${this.getOrderTotalsHtml(orderDetails)}
            </div>
            <p>${presentation.outro}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getAdminOrderNotificationTemplate(orderNumber: string, orderDetails: OrderMailDetails): string {
    const shippingAddress = orderDetails?.shippingAddress || {};
    const customerName = this.getCustomerName(shippingAddress);

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
              <p><strong>Date :</strong> ${this.getOrderDate(orderDetails)}</p>
              <p><strong>Client :</strong> ${customerName}</p>
              <p><strong>Email :</strong> ${orderDetails?.email || '-'}</p>
              <p><strong>Téléphone :</strong> ${shippingAddress.phone || '-'}</p>
              <p><strong>Total :</strong> ${this.formatPrice(orderDetails?.total)}</p>
            </div>
            <div class="card">
              <h2 style="margin-top: 0;">Adresse de livraison</h2>
              ${this.getAddressLines(shippingAddress).map((line) => `<p style="margin: 4px 0;">${line}</p>`).join('')}
            </div>
            <div class="card">
              <h2 style="margin-top: 0;">Articles commandés</h2>
              <table>
                <thead>
                  <tr>
                    <th style="text-align: left; padding-bottom: 8px;">Produit</th>
                    <th style="text-align: center; padding-bottom: 8px;">Qté</th>
                    <th style="text-align: right; padding-bottom: 8px;">PU</th>
                    <th style="text-align: right; padding-bottom: 8px;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${this.getOrderItemsTableRows(orderDetails) || '<tr><td colspan="4" class="muted">Aucun article trouvé.</td></tr>'}
                </tbody>
              </table>
            </div>
            <div class="card">
              <h2 style="margin-top: 0;">Totaux</h2>
              ${this.getOrderTotalsHtml(orderDetails)}
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getAdminPaymentNotificationTemplate(orderNumber: string, orderDetails: OrderMailDetails): string {
    const shippingAddress = orderDetails?.shippingAddress || {};
    const customerName = this.getCustomerName(shippingAddress);

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
            <p>Le paiement d'une commande vient d'être confirmé. La facture PDF est jointe à cet e-mail.</p>
            <div class="card">
              <p><strong>Commande :</strong> ${orderNumber}</p>
              <p><strong>Date :</strong> ${this.getOrderDate(orderDetails)}</p>
              <p><strong>Client :</strong> ${customerName}</p>
              <p><strong>Email :</strong> ${orderDetails?.email || '-'}</p>
              <p><strong>Total :</strong> ${this.formatPrice(orderDetails?.total)}</p>
            </div>
            <div class="card">
              <h2 style="margin-top: 0;">Adresse de livraison</h2>
              ${this.getAddressLines(shippingAddress).map((line) => `<p style="margin: 4px 0;">${line}</p>`).join('')}
            </div>
            <div class="card">
              <h2 style="margin-top: 0;">Articles commandés</h2>
              <table>
                <thead>
                  <tr>
                    <th style="text-align: left; padding-bottom: 8px;">Produit</th>
                    <th style="text-align: center; padding-bottom: 8px;">Qté</th>
                    <th style="text-align: right; padding-bottom: 8px;">PU</th>
                    <th style="text-align: right; padding-bottom: 8px;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${this.getOrderItemsTableRows(orderDetails) || '<tr><td colspan="4">Aucun article trouvé.</td></tr>'}
                </tbody>
              </table>
            </div>
            <div class="card">
              <h2 style="margin-top: 0;">Totaux</h2>
              ${this.getOrderTotalsHtml(orderDetails)}
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
