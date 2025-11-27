import React, { useState } from 'react';
import { X, CheckCircle, CreditCard, Lock } from 'lucide-react';
import { TicketProduct, PaymentState, CheckoutForm } from '../types';

interface FlowModalProps {
  paymentState: PaymentState;
  onClose: () => void;
  onSuccess: () => void;
}

const FlowModal: React.FC<FlowModalProps> = ({ paymentState, onClose, onSuccess }) => {
  const [form, setForm] = useState<CheckoutForm>({ name: '', email: '', rut: '', phone: '' });
  const [step, setStep] = useState<'details' | 'flow_redirect' | 'success'>('details');

  if (!paymentState.isOpen || !paymentState.selectedProduct) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePayClick = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('flow_redirect');

    try {
      // Call our backend to create payment in Flow
      const response = await fetch('http://localhost:3001/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: paymentState.selectedProduct.price,
          subject: paymentState.selectedProduct.title,
          email: form.email,
          payerName: form.name,
          rut: form.rut,
          phone: form.phone,
          productId: paymentState.selectedProduct.id
        })
      });

      const data = await response.json();

      if (data.success && data.paymentUrl) {
        // Redirect to Flow payment page
        window.location.href = `${data.paymentUrl}?token=${data.token}`;
      } else {
        throw new Error('Failed to create payment');
      }
    } catch (error) {
      console.error('Error creating payment:', error);
      alert('Ocurrió un error al procesar el pago. Por favor intenta nuevamente.');
      setStep('details');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">
        
        {/* Header */}
        <div className="bg-brand-dark px-6 py-4 flex justify-between items-center border-b border-gray-800">
          <div className="flex items-center space-x-2">
            <span className="text-white font-bold text-lg">Checkout Seguro</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Step 1: User Details */}
        {step === 'details' && (
          <form onSubmit={handlePayClick} className="p-6">
            <div className="mb-6 bg-blue-50 p-4 rounded-md border border-blue-100">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Producto</h3>
              <p className="font-bold text-brand-dark text-lg">{paymentState.selectedProduct.title}</p>
              <p className="text-sm text-gray-600 mb-2">{paymentState.selectedProduct.subtitle}</p>
              <div className="flex justify-between items-center mt-2 border-t border-blue-200 pt-2">
                <span className="text-gray-700 font-medium">Total a pagar:</span>
                <span className="text-brand-blue font-black text-xl">{formatCurrency(paymentState.selectedProduct.price)}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nombre Completo</label>
                <input 
                  required type="text" name="name" value={form.name} onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-1 focus:ring-brand-blue focus:border-brand-blue outline-none transition-colors"
                  placeholder="Juan Pérez"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">RUT</label>
                  <input 
                    required type="text" name="rut" value={form.rut} onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-1 focus:ring-brand-blue outline-none transition-colors"
                    placeholder="12.345.678-9"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Teléfono</label>
                  <input 
                    required type="tel" name="phone" value={form.phone} onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-1 focus:ring-brand-blue outline-none transition-colors"
                    placeholder="+56 9 ..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email</label>
                <input 
                  required type="email" name="email" value={form.email} onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-1 focus:ring-brand-blue outline-none transition-colors"
                  placeholder="juan@ejemplo.com"
                />
                <p className="text-xs text-gray-500 mt-1">Los tickets llegarán a este correo.</p>
              </div>
            </div>

            <div className="mt-8">
              <button 
                type="submit"
                className="w-full bg-flow-primary hover:bg-blue-900 text-white font-bold py-3 px-4 rounded-sm shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                <CreditCard size={20} />
                <span>Pagar con Flow</span>
              </button>
              <div className="flex justify-center mt-3 items-center space-x-2 text-xs text-gray-400">
                <Lock size={12} />
                <span>Pago 100% seguro encriptado vía WebPay / Flow</span>
              </div>
            </div>
          </form>
        )}

        {/* Step 2: Simulated Flow Redirect/Loading */}
        {step === 'flow_redirect' && (
          <div className="p-12 flex flex-col items-center justify-center text-center h-[400px]">
            <div className="relative mb-6">
               <div className="w-16 h-16 border-4 border-flow-secondary/30 border-t-flow-secondary rounded-full animate-spin"></div>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Conectando con Flow...</h3>
            <p className="text-gray-500 text-sm">Por favor espere, no cierre esta ventana.</p>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 'success' && (
          <div className="p-12 flex flex-col items-center justify-center text-center bg-green-50 h-[400px]">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600 animate-bounce">
              <CheckCircle size={48} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">¡Compra Exitosa!</h3>
            <p className="text-gray-600 mb-6">Hemos enviado tus tickets al correo <strong>{form.email}</strong>. ¡Mucha suerte!</p>
            <button 
              onClick={onSuccess}
              className="px-8 py-3 bg-brand-dark text-white font-bold rounded-sm hover:bg-gray-800 transition-colors uppercase"
            >
              Cerrar
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default FlowModal;