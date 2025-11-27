import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import PaymentResult from './components/PaymentResult';

const App: React.FC = () => {
  return (
    <div className="min-h-screen font-sans bg-gray-50 text-gray-900">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/payment/result" element={<PaymentResult />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;