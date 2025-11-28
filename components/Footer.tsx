import React from 'react';
import { Facebook, Instagram } from 'lucide-react';

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

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-8">
      <div className="max-w-[1240px] mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">

          <div className="text-brand-gray text-sm text-center md:text-left">
            Copyright © {new Date().getFullYear()} AR Inversiones.
          </div>

          {/* TODO: Actualizar con las redes sociales de AR Inversiones */}
          <div className="flex items-center space-x-6">
            <a href="https://www.facebook.com/osvaldo.fuentesfuentes" target="_blank" rel="noreferrer" className="text-brand-gray hover:text-brand-blue transition-colors">
              <Facebook size={20} />
            </a>
            <a href="https://www.instagram.com/elbandidoosvaldo69" target="_blank" rel="noreferrer" className="text-brand-gray hover:text-pink-600 transition-colors">
              <Instagram size={20} />
            </a>
            <a href="https://www.tiktok.com/@bandidoosvaldo.fuentes69" target="_blank" rel="noreferrer" className="text-brand-gray hover:text-black transition-colors">
              <TikTokIcon size={20} />
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;