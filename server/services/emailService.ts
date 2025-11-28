import nodemailer from 'nodemailer';
import { Ticket } from './ticketService';

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: string;
}

export class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private config: EmailConfig;

  constructor(config: EmailConfig) {
    this.config = config;
    this.initialize();
  }

  /**
   * Initialize email transporter
   */
  private initialize() {
    try {
      this.transporter = nodemailer.createTransport({
        host: this.config.host,
        port: this.config.port,
        secure: this.config.secure,
        auth: this.config.auth,
      });

      console.log('✅ Email service initialized');
    } catch (error) {
      console.error('❌ Error initializing email service:', error);
    }
  }

  /**
   * Send ticket confirmation email
   */
  async sendTicketEmail(ticket: Ticket): Promise<boolean> {
    if (!this.transporter) {
      console.error('❌ Email transporter not initialized');
      return false;
    }

    try {
      const htmlContent = this.generateTicketEmailHTML(ticket);

      const mailOptions = {
        from: this.config.from,
        to: ticket.email,
        subject: `🎫 Tu Ticket #${ticket.ticketNumber.toString().padStart(5, '0')} - AR Inversiones`,
        html: htmlContent,
        text: this.generateTicketEmailText(ticket)
      };

      await this.transporter.sendMail(mailOptions);

      console.log(`✅ Email sent to ${ticket.email} for ticket #${ticket.ticketNumber}`);

      return true;
    } catch (error) {
      console.error('❌ Error sending email:', error);
      return false;
    }
  }

  /**
   * Generate HTML content for ticket email
   */
  private generateTicketEmailHTML(ticket: Ticket): string {
    const ticketNumberFormatted = ticket.ticketNumber.toString().padStart(5, '0');

    return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tu Ticket</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f5f5f5;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 0;
    }
    .header {
      background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
      color: white;
      padding: 40px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 32px;
      font-weight: bold;
    }
    .content {
      padding: 40px 30px;
    }
    .ticket-box {
      background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
      border-radius: 12px;
      padding: 30px;
      text-align: center;
      margin: 30px 0;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .ticket-number {
      font-size: 64px;
      font-weight: bold;
      color: white;
      margin: 10px 0;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
    }
    .ticket-label {
      font-size: 18px;
      color: white;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 5px;
    }
    .info-section {
      background-color: #f9fafb;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .info-row:last-child {
      border-bottom: none;
    }
    .info-label {
      font-weight: 600;
      color: #6b7280;
    }
    .info-value {
      color: #111827;
      font-weight: 500;
    }
    .message {
      text-align: center;
      color: #4b5563;
      font-size: 16px;
      line-height: 1.8;
      margin: 30px 0;
    }
    .footer {
      background-color: #1f2937;
      color: #9ca3af;
      padding: 30px;
      text-align: center;
      font-size: 14px;
    }
    .footer a {
      color: #60a5fa;
      text-decoration: none;
    }
    .emoji {
      font-size: 48px;
      margin: 20px 0;
    }
    @media only screen and (max-width: 600px) {
      .content {
        padding: 20px;
      }
      .ticket-number {
        font-size: 48px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>🎉 ¡Compra Exitosa!</h1>
    </div>

    <!-- Content -->
    <div class="content">
      <p style="font-size: 18px; color: #111827;">Hola <strong>${ticket.payerName}</strong>,</p>

      <p style="color: #4b5563;">
        ¡Gracias por tu compra! Tu ticket ha sido confirmado exitosamente.
      </p>

      <!-- Ticket Box -->
      <div class="ticket-box">
        <div class="ticket-label">Tu Número de Ticket</div>
        <div class="ticket-number">#${ticketNumberFormatted}</div>
        <div style="color: white; margin-top: 10px; font-size: 14px;">
          ¡Guarda este número! Es tu participación oficial.
        </div>
      </div>

      <!-- Purchase Information -->
      <div class="info-section">
        <h3 style="margin-top: 0; color: #111827;">📋 Detalles de tu Compra</h3>
        <div class="info-row">
          <span class="info-label">Nombre:</span>
          <span class="info-value">${ticket.payerName}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Email:</span>
          <span class="info-value">${ticket.email}</span>
        </div>
        ${ticket.rut ? `
        <div class="info-row">
          <span class="info-label">RUT:</span>
          <span class="info-value">${ticket.rut}</span>
        </div>
        ` : ''}
        ${ticket.phone ? `
        <div class="info-row">
          <span class="info-label">Teléfono:</span>
          <span class="info-value">${ticket.phone}</span>
        </div>
        ` : ''}
        <div class="info-row">
          <span class="info-label">Fecha de Compra:</span>
          <span class="info-value">${new Date(ticket.purchaseDate).toLocaleString('es-CL')}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Orden:</span>
          <span class="info-value">${ticket.commerceOrder}</span>
        </div>
      </div>

      <!-- Message -->
      <div class="message">
        <div class="emoji">🍀</div>
        <p><strong>¡Mucha suerte!</strong></p>
        <p>
          Has adquirido el ticket <strong>#${ticketNumberFormatted}</strong> de un máximo de <strong>10,000</strong> tickets disponibles.
        </p>
        <p>
          Conserva este correo como comprobante de tu participación.
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p style="margin: 0 0 10px 0;"><strong>AR Inversiones</strong></p>
      <p style="margin: 0 0 10px 0;">
        ¿Preguntas? Contáctanos en <a href="mailto:contacto@arinversiones.cl">contacto@arinversiones.cl</a>
      </p>
      <p style="margin: 0; font-size: 12px; color: #6b7280;">
        Este es un correo automático, por favor no respondas a este mensaje.
      </p>
    </div>
  </div>
</body>
</html>
    `;
  }

  /**
   * Generate plain text content for ticket email
   */
  private generateTicketEmailText(ticket: Ticket): string {
    const ticketNumberFormatted = ticket.ticketNumber.toString().padStart(5, '0');

    return `
¡COMPRA EXITOSA!

Hola ${ticket.payerName},

¡Gracias por tu compra! Tu ticket ha sido confirmado exitosamente.

TU NÚMERO DE TICKET: #${ticketNumberFormatted}

DETALLES DE TU COMPRA:
- Nombre: ${ticket.payerName}
- Email: ${ticket.email}
${ticket.rut ? `- RUT: ${ticket.rut}` : ''}
${ticket.phone ? `- Teléfono: ${ticket.phone}` : ''}
- Fecha de Compra: ${new Date(ticket.purchaseDate).toLocaleString('es-CL')}
- Orden: ${ticket.commerceOrder}

¡Mucha suerte!

Has adquirido el ticket #${ticketNumberFormatted} de un máximo de 10,000 tickets disponibles.

Conserva este correo como comprobante de tu participación.

---
AR Inversiones
¿Preguntas? Contáctanos en contacto@arinversiones.cl
    `;
  }

  /**
   * Test email configuration
   */
  async testConnection(): Promise<boolean> {
    if (!this.transporter) {
      return false;
    }

    try {
      await this.transporter.verify();
      console.log('✅ Email service connection verified');
      return true;
    } catch (error) {
      console.error('❌ Email service connection failed:', error);
      return false;
    }
  }
}
