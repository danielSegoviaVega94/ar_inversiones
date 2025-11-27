import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { FlowService } from './services/flowService';
import { verifyFlowSignature } from './utils/flowSignature';
import { TicketService } from './services/ticketService';
import { EmailService } from './services/emailService';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('📂 Current working directory:', process.cwd());
const envPath = path.resolve(process.cwd(), '.env');
console.log('🔎 Looking for .env at:', envPath);

if (fs.existsSync(envPath)) {
  console.log('✅ .env file found');
  const result = dotenv.config({ path: envPath });
  if (result.error) {
    console.error('❌ Error loading .env file:', result.error);
  } else {
    console.log('✅ .env file loaded successfully');
    console.log('   - FLOW_API_URL:', process.env.FLOW_API_URL);
    console.log('   - FLOW_API_KEY:', process.env.FLOW_API_KEY ? 'Set (Hidden)' : 'Not Set');
  }
} else {
  console.error('❌ .env file NOT found at', envPath);
  // Try fallback to __dirname
  const fallbackPath = path.join(__dirname, '..', '.env');
  console.log('🔎 Trying fallback path:', fallbackPath);
  dotenv.config({ path: fallbackPath });
}

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Flow service
const flowService = new FlowService({
  apiKey: process.env.FLOW_API_KEY || '',
  secretKey: process.env.FLOW_SECRET_KEY || '',
  apiUrl: process.env.FLOW_API_URL || 'https://sandbox.flow.cl/api'
});

// Initialize Ticket service
const ticketService = new TicketService();

// Initialize Email service
const emailService = new EmailService({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || ''
  },
  from: process.env.EMAIL_FROM || 'Osvaldo Inversiones <noreply@osvaldoinversiones.cl>'
});

// Store for tracking payments (in production, use a database)
const paymentStore = new Map<string, any>();

/**
 * Health check endpoint
 */
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'Flow Payment Integration' });
});

/**
 * Create payment endpoint
 * Called by frontend when user wants to pay
 */
app.post('/api/payment/create', async (req: Request, res: Response) => {
  try {
    const { amount, subject, email, payerName, rut, phone, productId } = req.body;

    // Validate required fields
    if (!amount || !subject || !email || !payerName) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['amount', 'subject', 'email', 'payerName']
      });
    }

    // Check if tickets are available
    const ticketsAvailable = await ticketService.areTicketsAvailable();
    if (!ticketsAvailable) {
      return res.status(400).json({
        error: 'No hay más tickets disponibles',
        message: 'Se han vendido todos los 10,000 tickets. ¡Gracias por tu interés!'
      });
    }

    // Generate unique commerce order ID
    const commerceOrder = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Reserve ticket
    const ticket = await ticketService.reserveTicket({
      commerceOrder,
      email,
      payerName,
      rut,
      phone
    });

    console.log(`🎫 Ticket #${ticket.ticketNumber} reserved for ${email}`);

    // Get the base URL from the request
    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    // Point urlReturn to backend to handle POST from Flow
    const urlReturn = `${baseUrl}/api/payment/result`;

    console.log('💳 Creating payment with URLs:');
    console.log('  - urlConfirmation:', `${baseUrl}/api/payment/confirm`);
    console.log('  - urlReturn:', urlReturn);
    console.log('  - FRONTEND_URL env:', process.env.FRONTEND_URL);

    // Create payment in Flow
    const paymentResponse = await flowService.createPayment({
      commerceOrder,
      subject,
      currency: 'CLP',
      amount,
      email,
      payerName,
      urlConfirmation: `${baseUrl}/api/payment/confirm`,
      urlReturn,
      optional: JSON.stringify({ rut, phone, productId, ticketNumber: ticket.ticketNumber }) // Store additional data
    });

    // Store payment info
    paymentStore.set(commerceOrder, {
      commerceOrder,
      amount,
      subject,
      email,
      payerName,
      rut,
      phone,
      productId,
      ticketNumber: ticket.ticketNumber,
      flowOrder: paymentResponse.flowOrder,
      token: paymentResponse.token,
      status: 'pending',
      createdAt: new Date().toISOString()
    });

    console.log(`Payment created: ${commerceOrder}`, paymentResponse);

    res.json({
      success: true,
      paymentUrl: paymentResponse.url,
      token: paymentResponse.token,
      flowOrder: paymentResponse.flowOrder,
      commerceOrder,
      ticketNumber: ticket.ticketNumber
    });

  } catch (error: any) {
    console.error('Error creating payment:', error);
    res.status(500).json({
      error: 'Failed to create payment',
      message: error.message
    });
  }
});

/**
 * Payment Result Handler (Proxy)
 * Handles the return from Flow (which might be POST) and redirects to Frontend (GET)
 */
app.all('/api/payment/result', (req: Request, res: Response) => {
  try {
    console.log('🔄 Received return from Flow:', { method: req.method, body: req.body, query: req.query });

    // Flow sends token in body (POST) or query (GET)
    const token = req.body.token || req.query.token;

    if (!token) {
      console.error('❌ No token received in return URL');
      return res.status(400).send('Token missing');
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const redirectUrl = `${frontendUrl}/payment/result?token=${token}`;

    console.log(`🔀 Redirecting to frontend: ${redirectUrl}`);
    res.redirect(redirectUrl);

  } catch (error) {
    console.error('Error handling payment result:', error);
    res.status(500).send('Error processing payment result');
  }
});

/**
 * Payment confirmation endpoint (Webhook)
 * Called by Flow when payment status changes
 */
app.post('/api/payment/confirm', async (req: Request, res: Response) => {
  try {
    const params = req.body;

    console.log('Payment confirmation received:', params);

    // Verify signature
    const isValid = verifyFlowSignature(params, process.env.FLOW_SECRET_KEY || '');

    if (!isValid) {
      console.error('Invalid signature received');
      return res.status(400).send('INVALID SIGNATURE');
    }

    // Get payment status from Flow
    const token = params.token;
    const paymentStatus = await flowService.getPaymentStatus(token);

    console.log('Payment status:', paymentStatus);

    // Update payment in store
    const payment = paymentStore.get(paymentStatus.commerceOrder);
    if (payment) {
      payment.status = paymentStatus.status === 2 ? 'approved' : 'rejected';
      payment.flowOrder = paymentStatus.flowOrder;
      payment.paymentData = paymentStatus.paymentData;
      payment.updatedAt = new Date().toISOString();
      paymentStore.set(paymentStatus.commerceOrder, payment);
    }

    // Flow expects "CONFIRMADO" response
    res.send('CONFIRMADO');

    // Process payment confirmation asynchronously
    if (paymentStatus.status === 2) {
      // Payment approved - confirm ticket and send email
      (async () => {
        try {
          // Confirm ticket
          const ticket = await ticketService.confirmTicket(paymentStatus.commerceOrder, paymentStatus.flowOrder);

          if (ticket) {
            console.log(`✅ Ticket #${ticket.ticketNumber} confirmed for order ${paymentStatus.commerceOrder}`);

            // Send confirmation email
            const emailSent = await emailService.sendTicketEmail(ticket);

            if (emailSent) {
              console.log(`📧 Confirmation email sent to ${ticket.email}`);
            } else {
              console.error(`❌ Failed to send email to ${ticket.email}`);
            }
          }
        } catch (error) {
          console.error('Error processing confirmation:', error);
        }
      })();
    } else {
      // Payment rejected - cancel ticket
      (async () => {
        try {
          await ticketService.cancelTicket(paymentStatus.commerceOrder);
          console.log(`❌ Ticket cancelled for order ${paymentStatus.commerceOrder}`);
        } catch (error) {
          console.error('Error cancelling ticket:', error);
        }
      })();
    }

  } catch (error: any) {
    console.error('Error confirming payment:', error);
    res.status(500).send('ERROR');
  }
});

/**
 * Get payment status endpoint
 * Called by frontend to check payment status
 */
app.get('/api/payment/status/:commerceOrder', async (req: Request, res: Response) => {
  try {
    const { commerceOrder } = req.params;

    const payment = paymentStore.get(commerceOrder);

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    // Try to get updated status from Flow
    try {
      const flowStatus = await flowService.getPaymentStatusByCommerceId(commerceOrder);
      payment.status = flowStatus.status === 2 ? 'approved' : flowStatus.status === 1 ? 'pending' : 'rejected';
      payment.flowStatus = flowStatus;
    } catch (error) {
      console.log('Could not fetch status from Flow, using stored status');
    }

    res.json(payment);

  } catch (error: any) {
    console.error('Error getting payment status:', error);
    res.status(500).json({
      error: 'Failed to get payment status',
      message: error.message
    });
  }
});

/**
 * Get payment by token endpoint
 * Called when user returns from Flow
 */
app.get('/api/payment/verify/:token', async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    const paymentStatus = await flowService.getPaymentStatus(token);

    res.json({
      success: true,
      status: paymentStatus.status === 2 ? 'approved' : paymentStatus.status === 1 ? 'pending' : 'rejected',
      paymentStatus
    });

  } catch (error: any) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      error: 'Failed to verify payment',
      message: error.message
    });
  }
});

/**
 * Get ticket statistics endpoint
 * Returns available tickets and sales stats
 */
app.get('/api/tickets/stats', async (req: Request, res: Response) => {
  try {
    const stats = await ticketService.getStats();
    res.json(stats);
  } catch (error: any) {
    console.error('Error getting ticket stats:', error);
    res.status(500).json({
      error: 'Failed to get ticket stats',
      message: error.message
    });
  }
});

/**
 * Get ticket by order endpoint
 * Returns ticket information for a specific order
 */
app.get('/api/tickets/order/:commerceOrder', async (req: Request, res: Response) => {
  try {
    const { commerceOrder } = req.params;
    const ticket = await ticketService.getTicketByOrder(commerceOrder);

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.json(ticket);
  } catch (error: any) {
    console.error('Error getting ticket:', error);
    res.status(500).json({
      error: 'Failed to get ticket',
      message: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Flow API URL: ${process.env.FLOW_API_URL}`);
  console.log(`🔑 Flow API Key: ${process.env.FLOW_API_KEY?.substring(0, 10)}...`);

  // Log ticket stats on startup
  ticketService.getStats().then(stats => {
    console.log(`🎫 Tickets: ${stats.confirmed} vendidos | ${stats.available} disponibles de ${stats.maxTickets}`);
  });
});

export default app;
