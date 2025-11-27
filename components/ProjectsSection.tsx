import React from 'react';
import { TicketProduct } from '../types';
import { PRODUCTS } from '../constants';
import { Instagram } from 'lucide-react';

interface TicketSectionProps {
  onBuy: (product: TicketProduct) => void;
}

// Custom TikTok icon since it's not in standard lucide set consistently
const TikTokIcon = ({ size = 24, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const TicketSection: React.FC<TicketSectionProps> = ({ onBuy }) => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1240px] mx-auto px-4 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-brand-dark mb-4 uppercase">
            COMPRA TU TICKET
          </h2>
          <div className="h-1 w-24 bg-brand-dark mx-auto mb-4"></div>
          <p className="text-brand-gray text-lg">
            Su Tickets le llegara por email luego de realizar su compra.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {PRODUCTS.map((product) => (
            <div key={product.id} className="bg-gray-100 rounded-lg p-8 flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-shadow border border-transparent hover:border-gray-200">
              
              {/* Icon */}
              <div className="mb-6 text-brand-dark">
                 {product.id === 'economico' ? (
                   // Placeholder for custom icon in design, using Lucide for now
                   <div className="w-20 h-20 border-4 border-brand-dark rounded-full flex items-center justify-center">
                      <span className="text-4xl font-bold">1</span>
                   </div>
                 ) : (
                   <div className="w-20 h-20 border-4 border-brand-dark rounded-full flex items-center justify-center">
                      <span className="text-4xl font-bold">%</span>
                   </div>
                 )}
              </div>

              <h3 className="text-xl font-black text-brand-dark uppercase mb-2">
                {product.title}
              </h3>
              
              <p className="text-brand-blue font-bold text-lg mb-4">
                {product.subtitle}
              </p>

              <p className="text-brand-gray text-sm mb-6 max-w-xs">
                {product.description}
              </p>

              <div className="mb-6">
                {product.iconType === 'instagram' ? (
                  <Instagram className="text-pink-600 w-8 h-8" />
                ) : (
                  <TikTokIcon className="text-black w-8 h-8" />
                )}
              </div>

              <button 
                onClick={() => onBuy(product)}
                className="w-full bg-brand-blue hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition-colors uppercase tracking-wider"
              >
                LO QUIERO
              </button>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TicketSection;