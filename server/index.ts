import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { FlowService } from './services/flowService';
import { verifyFlowSignature } from './utils/flowSignature';

// Load environment variables
dotenv.config({ path: '.env.local' });

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

    // Generate unique commerce order ID
    const commerceOrder = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Get the base URL from the request
    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;

    // Create payment in Flow
    const paymentResponse = await flowService.createPayment({
      commerceOrder,
      subject,
      currency: 'CLP',
      amount,
      email,
      payerName,
      urlConfirmation: `${baseUrl}/api/payment/confirm`,
      urlReturn: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/result`,
      optional: JSON.stringify({ rut, phone, productId }) // Store additional data
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
      commerceOrder
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

    // Here you would typically:
    // 1. Update your database
    // 2. Send confirmation email
    // 3. Grant access to purchased content
    // 4. etc.

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

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Flow API URL: ${process.env.FLOW_API_URL}`);
  console.log(`🔑 Flow API Key: ${process.env.FLOW_API_KEY?.substring(0, 10)}...`);
});

export default app;
