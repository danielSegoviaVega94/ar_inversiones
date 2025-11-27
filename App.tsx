import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import TicketSection from './components/ProjectsSection'; // Renamed conceptually in import
import HelpSection from './components/Features'; // Renamed conceptually
import AboutSection from './components/AboutSection';
import Footer from './components/Footer';
import FlowModal from './components/FlowModal';
import { TicketProduct, PaymentState } from './types';

const App: React.FC = () => {
  const [paymentState, setPaymentState] = useState<PaymentState>({
    isOpen: false,
    step: 'details',
    selectedProduct: null,
  });

  const handleBuyClick = (product: TicketProduct) => {
    setPaymentState({
      isOpen: true,
      step: 'details',
      selectedProduct: product
    });
  };

  const handleCloseModal = () => {
    setPaymentState(prev => ({ ...prev, isOpen: false }));
  };

  const handlePaymentSuccess = () => {
    setPaymentState(prev => ({ ...prev, isOpen: false, step: 'details', selectedProduct: null }));
  };

  return (
    <div className="min-h-screen font-sans bg-gray-50 text-gray-900">
      <Header />
      
      <main>
        <Hero />
        <TicketSection onBuy={handleBuyClick} />
        <HelpSection />
        <AboutSection />
      </main>

      <Footer />

      <FlowModal 
        paymentState={paymentState}
        onClose={handleCloseModal}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default App;