import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    const provider = this.configService.get<string>('EMAIL_PROVIDER', 'nodemailer');

    if (provider === 'nodemailer') {
      this.transporter = nodemailer.createTransport({
        host: this.configService.get<string>('SMTP_HOST'),
        port: this.configService.get<number>('SMTP_PORT'),
        auth: {
          user: this.configService.get<string>('SMTP_USER'),
          pass: this.configService.get<string>('SMTP_PASS'),
        },
      });
    }
  }

  async sendEmail(options: { to: string; subject: string; html: string }) {
    const mailOptions = {
      from: this.configService.get<string>('EMAIL_FROM'),
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Email sent to ${options.to}`);
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }

  async sendOrderConfirmation(email: string, orderNumber: string, orderDetails: any) {
    const mailOptions = {
      from: this.configService.get<string>('EMAIL_FROM'),
      to: email,
      subject: `Order Confirmation - ${orderNumber}`,
      html: this.getOrderConfirmationTemplate(orderNumber, orderDetails),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Order confirmation email sent to ${email}`);
    } catch (error) {
      console.error('Failed to send order confirmation email:', error);
    }
  }

  async sendPaymentConfirmation(email: string, orderNumber: string) {
    const mailOptions = {
      from: this.configService.get<string>('EMAIL_FROM'),
      to: email,
      subject: `Payment Confirmed - ${orderNumber}`,
      html: this.getPaymentConfirmationTemplate(orderNumber),
    };

    try {
      await this.transporter.sendMail(mailOptions);
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
      from: this.configService.get<string>('EMAIL_FROM'),
      to: email,
      subject,
      html: this.getAbandonedCartTemplate(cartItems, daysAgo),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Abandoned cart reminder sent to ${email} (Day +${daysAgo})`);
    } catch (error) {
      console.error('Failed to send abandoned cart email:', error);
    }
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
