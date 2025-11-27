import { TicketProduct } from './types';

export const PRODUCTS: TicketProduct[] = [
  {
    id: 'economico',
    title: 'ECONOMICO',
    subtitle: '1 STICKER X $3.000',
    price: 3000,
    description: 'No pierdas esta oportunidad de tener tu Moto.',
    iconType: 'instagram',
    itemsCount: 1
  },
  {
    id: 'pack4',
    title: 'CUPÓN: PACK4',
    subtitle: '4 STICKER X $10.000',
    price: 10000,
    description: 'No pierdas esta oportunidad de tener tu Moto.',
    iconType: 'tiktok',
    itemsCount: 4
  }
];

export const IMAGES = {
  logo: 'https://osvaldoinversiones.cl/wp-content/uploads/2025/04/Logo_final.png',
  heroMan: 'https://osvaldoinversiones.cl/wp-content/uploads/2025/10/WhatsApp-Image-2025-09-28-at-20.29.41-1-e1759449979433-600x813.jpeg',
  heroBg: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2621&auto=format&fit=crop', // Dark road fallback
  helpMoto: 'https://osvaldoinversiones.cl/wp-content/uploads/2025/08/moto-e1755991036452.png',
  aboutOsvaldo: 'https://osvaldoinversiones.cl/wp-content/uploads/2025/04/osvaldo2.jpeg'
};