import React from 'react';
import { Instagram } from 'lucide-react';
import { IMAGES } from '../constants';

const Hero: React.FC = () => {
  return (
    <div className="relative min-h-[80vh] bg-brand-dark overflow-hidden flex items-center pt-24 pb-12">
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <img 
          src={IMAGES.heroBg} 
          alt="Road Background" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/80 via-brand-dark/40 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-[1240px] mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          
          {/* Left Content */}
          <div className="w-full md:w-1/2 text-center md:text-left text-white animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl font-black uppercase leading-tight mb-6">
              BANDIDO ENTREGA <br />
              <span className="text-gray-200">UNA MOTO BMW</span>
            </h1>
            
            <p className="text-sm md:text-base font-bold uppercase tracking-wider mb-8 text-gray-300 max-w-lg mx-auto md:mx-0">
              LIVE – PUB ALCAZABA RETRO, 4 NORTE N°131 VIÑA<br />
              5 DE DICIEMBRE
            </p>

            <a 
              href="https://www.instagram.com/elbandidoosvaldo69/?hl=es" 
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-brand-blue hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-none text-sm tracking-widest transition-all uppercase"
            >
              <Instagram size={18} />
              Instagram Live
            </a>
          </div>

          {/* Right Image */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-end">
            <div className="relative max-w-sm md:max-w-md w-full">
              <img 
                src={IMAGES.heroMan} 
                alt="El Bandido" 
                className="w-full h-auto rounded-lg shadow-2xl transform md:rotate-2 hover:rotate-0 transition-transform duration-500"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Hero;