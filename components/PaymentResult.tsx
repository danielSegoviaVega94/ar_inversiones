import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface PaymentData {
  status: 'approved' | 'pending' | 'rejected';
  paymentStatus?: any;
}

const PaymentResult: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError('Token de pago no encontrado');
      setLoading(false);
      return;
    }

    verifyPayment(token);
  }, [token]);

  const verifyPayment = async (paymentToken: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/payment/verify/${paymentToken}`);
      const data = await response.json();

      if (data.success) {
        setPaymentData(data);
      } else {
        setError('No se pudo verificar el pago');
      }
    } catch (err) {
      console.error('Error verifying payment:', err);
      setError('Ocurrió un error al verificar el pago');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-brand-blue mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Verificando pago...</h2>
          <p className="text-gray-600">Por favor espera mientras verificamos tu pago</p>
        </div>
      </div>
    );
  }

  if (error || !paymentData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error || 'Ocurrió un error inesperado'}</p>
          <Link
            to="/"
            className="inline-block bg-brand-dark text-white font-bold py-3 px-8 rounded-sm hover:bg-gray-800 transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  const { status, paymentStatus } = paymentData;

  if (status === 'approved') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">¡Pago Exitoso!</h2>
          <p className="text-gray-600 mb-6">
            Tu pago ha sido procesado correctamente. Recibirás un correo de confirmación en breve.
          </p>
          {paymentStatus?.payer && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-bold text-gray-700 mb-2">Detalles del pago:</h3>
              <p className="text-sm text-gray-600">
                <strong>Correo:</strong> {paymentStatus.payer}
              </p>
              {paymentStatus.subject && (
                <p className="text-sm text-gray-600">
                  <strong>Producto:</strong> {paymentStatus.subject}
                </p>
              )}
              {paymentStatus.amount && (
                <p className="text-sm text-gray-600">
                  <strong>Monto:</strong> {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(paymentStatus.amount)}
                </p>
              )}
            </div>
          )}
          <Link
            to="/"
            className="inline-block bg-brand-dark text-white font-bold py-3 px-8 rounded-sm hover:bg-gray-800 transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  if (status === 'rejected') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Pago Rechazado</h2>
          <p className="text-gray-600 mb-6">
            Tu pago no pudo ser procesado. Por favor intenta nuevamente o usa otro método de pago.
          </p>
          <Link
            to="/"
            className="inline-block bg-brand-dark text-white font-bold py-3 px-8 rounded-sm hover:bg-gray-800 transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <Loader2 className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Pago Pendiente</h2>
        <p className="text-gray-600 mb-6">
          Tu pago está siendo procesado. Te notificaremos cuando se complete.
        </p>
        <Link
          to="/"
          className="inline-block bg-brand-dark text-white font-bold py-3 px-8 rounded-sm hover:bg-gray-800 transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default PaymentResult;
