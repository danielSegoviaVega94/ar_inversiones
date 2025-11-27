import axios from 'axios';
import { signFlowParams, FlowParams } from '../utils/flowSignature';

export interface FlowConfig {
  apiKey: string;
  secretKey: string;
  apiUrl: string;
}

export interface CreatePaymentParams {
  commerceOrder: string;
  subject: string;
  currency: string;
  amount: number;
  email: string;
  payerName: string;
  urlConfirmation: string;
  urlReturn: string;
  optional?: string;
}

export interface PaymentResponse {
  url: string;
  token: string;
  flowOrder: number;
}

export interface PaymentStatus {
  flowOrder: number;
  commerceOrder: string;
  requestDate: string;
  status: number;
  subject: string;
  currency: string;
  amount: number;
  payer: string;
  optional?: string;
  pending_info?: {
    media: string;
    date: string;
  };
  paymentData?: {
    date: string;
    media: string;
    conversionDate: string;
    conversionRate: number;
    amount: number;
    currency: string;
    fee: number;
    balance: number;
    transferDate: string;
  };
}

export class FlowService {
  private config: FlowConfig;

  constructor(config: FlowConfig) {
    this.config = config;
  }

  /**
   * Creates a new payment in Flow
   * Returns URL and token to redirect user to Flow payment page
   */
  async createPayment(params: CreatePaymentParams): Promise<PaymentResponse> {
    const flowParams: FlowParams = {
      apiKey: this.config.apiKey,
      commerceOrder: params.commerceOrder,
      subject: params.subject,
      currency: params.currency,
      amount: params.amount,
      email: params.email,
      payerName: params.payerName,
      urlConfirmation: params.urlConfirmation,
      urlReturn: params.urlReturn,
    };

    // Add optional parameter if provided
    if (params.optional) {
      flowParams.optional = params.optional;
    }

    // Sign the parameters
    const signedParams = signFlowParams(flowParams, this.config.secretKey);

    try {
      const params = new URLSearchParams();
      Object.keys(signedParams).forEach(key => {
        params.append(key, String(signedParams[key]));
      });

      const response = await axios.post(
        `${this.config.apiUrl}/payment/create`,
        params,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Error creating Flow payment:', error.response?.data || error.message);
      throw new Error(`Failed to create payment: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Gets payment status by Flow token
   */
  async getPaymentStatus(token: string): Promise<PaymentStatus> {
    const flowParams: FlowParams = {
      apiKey: this.config.apiKey,
      token: token,
    };

    const signedParams = signFlowParams(flowParams, this.config.secretKey);

    try {
      const response = await axios.get(
        `${this.config.apiUrl}/payment/getStatus`,
        {
          params: signedParams
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Error getting Flow payment status:', error.response?.data || error.message);
      throw new Error(`Failed to get payment status: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Gets payment status by commerce order ID
   */
  async getPaymentStatusByCommerceId(commerceId: string): Promise<PaymentStatus> {
    const flowParams: FlowParams = {
      apiKey: this.config.apiKey,
      commerceId: commerceId,
    };

    const signedParams = signFlowParams(flowParams, this.config.secretKey);

    try {
      const response = await axios.get(
        `${this.config.apiUrl}/payment/getStatusByCommerceId`,
        {
          params: signedParams
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Error getting Flow payment status by commerce ID:', error.response?.data || error.message);
      throw new Error(`Failed to get payment status: ${error.response?.data?.message || error.message}`);
    }
  }
}
