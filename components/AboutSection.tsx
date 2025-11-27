import React from 'react';
import { IMAGES } from '../constants';
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

const AboutSection: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1240px] mx-auto px-4 lg:px-8">
        
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-dark">
            Osvaldo Fuentes
          </h2>
          <div className="h-px w-full max-w-xs bg-gray-200 mx-auto mt-4"></div>
        </div>

        <div className="flex flex-col md:flex-row gap-12 items-start">
          
          <div className="w-full md:w-1/2">
            <img 
              src={IMAGES.aboutOsvaldo} 
              alt="Osvaldo Fuentes" 
              className="w-full rounded-lg shadow-lg"
            />
          </div>

          <div className="w-full md:w-1/2 text-brand-gray space-y-6">
            <p>
              Osvaldo Fuentes es un destacado agente inmobiliario en Chile, reconocido por su profesionalismo y dedicación en el sector de bienes raíces. Además de su labor en el mercado inmobiliario, Osvaldo es un apasionado de las motocicletas y comparte regularmente contenido relacionado en sus redes sociales, donde ha construido una sólida comunidad de seguidores.
            </p>
            <p>
              Como influencer, utiliza plataformas como TikTok e Instagram para conectar con su audiencia, ofreciendo consejos sobre el mercado inmobiliario y compartiendo su amor por las motos. Su enfoque auténtico y cercano le ha permitido destacarse en ambos ámbitos, combinando su experiencia profesional con sus pasiones personales.
            </p>
            <p>
              Para conocer más sobre su trabajo y pasatiempos, puedes seguirlo en sus redes sociales:
            </p>

            <ul className="space-y-3 pt-4">
              <li className="flex items-center gap-3">
                <TikTokIcon size={20} className="text-black" />
                <a href="https://www.tiktok.com/@bandidoosvaldo.fuentes69" target="_blank" rel="noreferrer" className="hover:text-brand-blue">
                  @bandidoosvaldo.fuentes69
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Instagram size={20} className="text-pink-600" />
                <a href="https://www.instagram.com/elbandidoosvaldo69" target="_blank" rel="noreferrer" className="hover:text-brand-blue">
                  @elbandidoosvaldo69
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Facebook size={20} className="text-blue-700" />
                <a href="https://www.facebook.com/osvaldo.fuentesfuentes" target="_blank" rel="noreferrer" className="hover:text-brand-blue">
                  osvaldo.fuentesfuentes
                </a>
              </li>
            </ul>
          </div>

        </div>

      </div>
    </section>
  );
};

export default AboutSection;