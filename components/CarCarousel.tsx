import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselImage {
  id: number;
  url: string;
  alt: string;
}

const carImages: CarouselImage[] = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1920&q=80&auto=format&fit=crop',
    alt: 'Porsche 911 - Rendimiento Superior'
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=1920&q=80&auto=format&fit=crop',
    alt: 'Mercedes-AMG - Lujo y Potencia'
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1920&q=80&auto=format&fit=crop',
    alt: 'BMW M Series - Ingeniería de Precisión'
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1920&q=80&auto=format&fit=crop',
    alt: 'Audi R8 - Tecnología Avanzada'
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=1920&q=80&auto=format&fit=crop',
    alt: 'Lamborghini - Exclusividad Italiana'
  }
];

const CarCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === carImages.length - 1 ? 0 : prevIndex + 1
    );
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? carImages.length - 1 : prevIndex - 1
    );
  }, []);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  const handlePrevClick = () => {
    setIsAutoPlaying(false);
    prevSlide();
  };

  const handleNextClick = () => {
    setIsAutoPlaying(false);
    nextSlide();
  };

  return (
    <section className="relative w-full bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 py-16 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 via-transparent to-amber-900/10 pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Vehículos <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-amber-400">Premium</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Descubre nuestra colección exclusiva de automóviles de lujo y alto rendimiento
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative group">
          {/* Main Image Container */}
          <div className="relative h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl">
            {/* Images */}
            <div className="relative h-full w-full">
              {carImages.map((image, index) => (
                <div
                  key={image.id}
                  className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                    index === currentIndex
                      ? 'opacity-100 scale-100'
                      : 'opacity-0 scale-105'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />

                  {/* Image Caption */}
                  <div className="absolute bottom-8 left-8 right-8 text-white">
                    <h3 className="text-2xl md:text-4xl font-bold mb-2 drop-shadow-lg">
                      {image.alt}
                    </h3>
                    <div className="h-1 w-24 bg-gradient-to-r from-blue-400 to-amber-400 rounded-full" />
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={handlePrevClick}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 border border-white/20"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={handleNextClick}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 border border-white/20"
              aria-label="Siguiente imagen"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Progress Bar */}
            {isAutoPlaying && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                <div
                  className="h-full bg-gradient-to-r from-blue-400 to-amber-400 transition-all duration-300"
                  style={{
                    width: '100%',
                    animation: 'progress 5s linear infinite'
                  }}
                />
              </div>
            )}
          </div>

          {/* Dot Indicators */}
          <div className="flex justify-center gap-3 mt-8">
            {carImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? 'w-12 h-3 bg-gradient-to-r from-blue-400 to-amber-400'
                    : 'w-3 h-3 bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Ir a imagen ${index + 1}`}
              />
            ))}
          </div>

          {/* Counter */}
          <div className="text-center mt-6">
            <span className="text-white/70 text-sm font-medium">
              {currentIndex + 1} / {carImages.length}
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes progress {
          from {
            transform: scaleX(0);
            transform-origin: left;
          }
          to {
            transform: scaleX(1);
            transform-origin: left;
          }
        }
      `}</style>
    </section>
  );
};

export default CarCarousel;
