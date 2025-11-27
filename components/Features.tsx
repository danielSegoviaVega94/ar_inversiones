import React from 'react';
import { Phone } from 'lucide-react';
import { IMAGES } from '../constants';

const HelpSection: React.FC = () => {
  return (
    <section className="py-20 bg-brand-light">
      <div className="max-w-[1240px] mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-12">
          
          {/* Left: Moto Image */}
          <div className="w-full md:w-1/2">
            <img 
              src={IMAGES.helpMoto} 
              alt="BMW Motorcycle" 
              className="w-full h-auto object-contain drop-shadow-2xl"
            />
          </div>

          {/* Right: Content */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h4 className="text-lg font-bold text-brand-gray uppercase mb-2">
              ¿NECESITAS AYUDA?
            </h4>
            <h2 className="text-4xl md:text-5xl font-black text-brand-dark uppercase mb-8">
              EL BANDIDO TE AYUDA
            </h2>

            <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start">
              <a 
                href="https://wa.me/56961746935?text=Hola%20BANDIDO" 
                target="_blank"
                rel="noreferrer"
                className="bg-brand-blue hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-sm uppercase tracking-wider inline-flex items-center justify-center gap-2 transition-colors"
              >
                <Phone size={18} />
                CONTACTAME
              </a>

              <a 
                href="#"
                className="bg-brand-dark hover:bg-gray-800 text-white font-bold py-3 px-8 rounded-sm uppercase tracking-wider inline-flex items-center justify-center transition-colors"
              >
                Bases Moto
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HelpSection;