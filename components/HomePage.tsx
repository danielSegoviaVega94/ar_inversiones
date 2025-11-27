import React, { useState } from 'react';
import Header from './Header';
import Hero from './Hero';
import CarCarousel from './CarCarousel';
import TicketSection from './ProjectsSection';
import HelpSection from './Features';
import AboutSection from './AboutSection';
import Footer from './Footer';
import FlowModal from './FlowModal';
import { TicketProduct, PaymentState } from '../types';

const HomePage: React.FC = () => {
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
        <CarCarousel />
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

export default HomePage;
