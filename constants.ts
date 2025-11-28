import { TicketProduct } from './types';

// TODO: Actualizar estos productos con los de AR Inversiones
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

// TODO: IMPORTANTE - Reemplazar estas URLs con las imágenes de AR Inversiones
// Estas imágenes actualmente apuntan al sitio de Osvaldo Inversiones (sitio de prueba)
// Sube tus propias imágenes a tu hosting o usa un servicio como Cloudinary/AWS S3
export const IMAGES = {
  logo: 'https://osvaldoinversiones.cl/wp-content/uploads/2025/04/Logo_final.png', // TODO: Logo de AR Inversiones
  heroMan: 'https://osvaldoinversiones.cl/wp-content/uploads/2025/10/WhatsApp-Image-2025-09-28-at-20.29.41-1-e1759449979433-600x813.jpeg', // TODO: Imagen hero
  heroBg: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2621&auto=format&fit=crop', // Dark road fallback
  helpMoto: 'https://osvaldoinversiones.cl/wp-content/uploads/2025/08/moto-e1755991036452.png', // TODO: Imagen de ayuda
  aboutOsvaldo: 'https://osvaldoinversiones.cl/wp-content/uploads/2025/04/osvaldo2.jpeg' // TODO: Imagen about/equipo
};