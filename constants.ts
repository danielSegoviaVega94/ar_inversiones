import { TicketProduct } from './types';

export const PRODUCTS: TicketProduct[] = [
  {
    id: 'ticket-unico',
    title: 'TICKET OFICIAL',
    subtitle: '1 TICKET X $10.000',
    price: 10000,
    description: 'Compra tu ticket y participa por increíbles premios. Recibirás tu número único por correo.',
    iconType: 'instagram',
    itemsCount: 1
  }
];

export const IMAGES = {
  logo: 'https://osvaldoinversiones.cl/wp-content/uploads/2025/04/Logo_final.png',
  heroMan: 'https://osvaldoinversiones.cl/wp-content/uploads/2025/10/WhatsApp-Image-2025-09-28-at-20.29.41-1-e1759449979433-600x813.jpeg',
  heroBg: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2621&auto=format&fit=crop', // Dark road fallback
  helpMoto: 'https://osvaldoinversiones.cl/wp-content/uploads/2025/08/moto-e1755991036452.png',
  aboutOsvaldo: 'https://osvaldoinversiones.cl/wp-content/uploads/2025/04/osvaldo2.jpeg'
};