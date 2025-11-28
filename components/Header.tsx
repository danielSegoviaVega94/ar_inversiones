import React, { useState, useEffect } from 'react';
import { Facebook, Instagram, ShoppingBag } from 'lucide-react';
import { IMAGES } from '../constants';

// Custom TikTok icon component since lucide might vary in version
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

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-brand-dark/95 backdrop-blur-sm shadow-lg py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-[1240px] mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="#">
              <img
                src={IMAGES.logo}
                alt="AR Inversiones"
                className="h-16 w-auto md:h-20 transition-all duration-300"
              />
            </a>
          </div>

          {/* Social Icons & Cart - Desktop/Mobile Unified based on ref */}
          {/* TODO: Actualizar con las redes sociales de AR Inversiones */}
          <div className="flex items-center space-x-4 md:space-x-6">
            <div className="hidden md:flex items-center space-x-4 text-white">
              <a href="https://www.facebook.com/osvaldo.fuentesfuentes" target="_blank" rel="noreferrer" className="hover:text-brand-blue transition-colors">
                <Facebook size={18} />
              </a>
              <a href="https://www.instagram.com/elbandidoosvaldo69" target="_blank" rel="noreferrer" className="hover:text-brand-blue transition-colors">
                <Instagram size={18} />
              </a>
              <a href="https://www.tiktok.com/@bandidoosvaldo.fuentes69" target="_blank" rel="noreferrer" className="hover:text-brand-blue transition-colors">
                <TikTokIcon size={18} />
              </a>
            </div>

            {/* Cart */}
            <div className="flex items-center">
               <a href="#" className="relative group flex items-center text-white hover:text-brand-blue transition-colors">
                 <span className="mr-2 text-sm font-bold hidden sm:block">$0</span>
                 <ShoppingBag size={22} />
                 <span className="absolute -top-1 -right-1 bg-brand-blue text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">0</span>
               </a>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;