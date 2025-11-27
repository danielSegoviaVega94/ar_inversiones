import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import PaymentResult from './components/PaymentResult';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/payment/result" element={<PaymentResult />} />
    </Routes>
  );
};

export default App;