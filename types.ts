export interface TicketProduct {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  description: string;
  iconType: 'instagram' | 'tiktok';
  itemsCount: number;
}

export interface PaymentState {
  isOpen: boolean;
  step: 'details' | 'processing' | 'success' | 'error';
  selectedProduct: TicketProduct | null;
}

export interface CheckoutForm {
  name: string;
  email: string;
  rut: string;
  phone: string;
}