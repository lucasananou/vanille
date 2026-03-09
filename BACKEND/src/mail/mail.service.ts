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
      subject: `Order Confirmation - ${orderNumber}`,
      html: this.getOrderConfirmationTemplate(orderNumber, orderDetails),
    };

    try {
      await this.sendEmail(mailOptions);
      console.log(`✅ Order confirmation email sent to ${email}`);
    } catch (error) {
      console.error('Failed to send order confirmation email:', error);
    }
  }

  async sendPaymentConfirmation(email: string, orderNumber: string) {
    const mailOptions = {
      to: email,
      subject: `Payment Confirmed - ${orderNumber}`,
      html: this.getPaymentConfirmationTemplate(orderNumber),
    };

    try {
      await this.sendEmail(mailOptions);
      console.log(`✅ Payment confirmation email sent to ${email}`);
    } catch (error) {
      console.error('Failed to send payment confirmation email:', error);
    }
  }

  async sendAbandonedCartReminder(email: string, cartId: string, cartItems: any[], daysAgo: number) {
    const subject = daysAgo === 1
      ? 'You left items in your cart!'
      : 'Last chance! Your cart is waiting';

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
            <h1>Order Confirmation</h1>
          </div>
          <div class="content">
            <p>Thank you for your order!</p>
            <p><strong>Order Number:</strong> ${orderNumber}</p>
            <p>We'll send you another email when your order ships.</p>
          </div>
          <div class="footer">
            <p>© 2026 E-Commerce Store. All rights reserved.</p>
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
            <h1>✅ Payment Confirmed</h1>
          </div>
          <div class="content">
            <p>Great news! Your payment has been confirmed.</p>
            <p><strong>Order Number:</strong> ${orderNumber}</p>
            <p>We're preparing your order for shipment.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getAbandonedCartTemplate(cartItems: any[], daysAgo: number): string {
    const itemsList = cartItems.map(item => `<li>${item.product?.title || 'Product'} (x${item.quantity})</li>`).join('');

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
            <h1>🛒 Your Cart Awaits!</h1>
          </div>
          <div class="content">
            <p>${daysAgo === 1 ? "You left some items in your cart:" : "Last chance! Don't miss out on these items:"}</p>
            <ul>${itemsList}</ul>
            <div class="cta">
              <a href="${this.configService.get('APP_URL')}/cart" class="button">Complete Your Purchase</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
