import dotenv from 'dotenv';
import path from 'path';
import { EmailService } from './services/emailService.js';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

console.log('🧪 Prueba de Configuración de Email\n');
console.log('================================\n');

// Show configuration (hiding password)
console.log('📧 Configuración:');
console.log(`   Host: ${process.env.EMAIL_HOST}`);
console.log(`   Port: ${process.env.EMAIL_PORT}`);
console.log(`   User: ${process.env.EMAIL_USER}`);
console.log(`   Pass: ${process.env.EMAIL_PASS ? '***' + process.env.EMAIL_PASS.slice(-4) : 'NO CONFIGURADO'}`);
console.log(`   From: ${process.env.EMAIL_FROM}\n`);

// Check if credentials are configured
if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'TU_EMAIL@gmail.com') {
  console.error('❌ ERROR: Debes configurar EMAIL_USER en el archivo .env');
  console.error('   Edita el archivo .env y reemplaza TU_EMAIL@gmail.com con tu email real\n');
  process.exit(1);
}

if (!process.env.EMAIL_PASS || process.env.EMAIL_PASS === 'TU_CONTRASEÑA_DE_APLICACION') {
  console.error('❌ ERROR: Debes configurar EMAIL_PASS en el archivo .env');
  console.error('   Necesitas una "Contraseña de Aplicación" de Gmail');
  console.error('   Sigue las instrucciones en GMAIL_SETUP.md\n');
  process.exit(1);
}

async function testEmailService() {
  try {
    console.log('🔧 Inicializando servicio de email...\n');

    const emailService = new EmailService({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER || '',
        pass: process.env.EMAIL_PASS || ''
      },
      from: process.env.EMAIL_FROM || 'Osvaldo Inversiones <noreply@osvaldoinversiones.cl>'
    });

    console.log('🔍 Verificando conexión con Gmail...\n');

    const isConnected = await emailService.testConnection();

    if (isConnected) {
      console.log('✅ ¡Conexión exitosa con Gmail!\n');
      console.log('📤 Enviando email de prueba...\n');

      // Send test email
      const testTicket = {
        ticketNumber: 1,
        commerceOrder: 'TEST-' + Date.now(),
        email: process.env.EMAIL_USER || '',
        payerName: 'Usuario de Prueba',
        rut: '12.345.678-9',
        phone: '+56912345678',
        purchaseDate: new Date().toISOString(),
        status: 'confirmed' as const,
        flowOrder: 999999
      };

      const emailSent = await emailService.sendTicketEmail(testTicket);

      if (emailSent) {
        console.log('✅ ¡Email de prueba enviado exitosamente!\n');
        console.log(`📬 Revisa tu bandeja de entrada en: ${process.env.EMAIL_USER}\n`);
        console.log('🎉 La configuración está correcta y funcionando.\n');
      } else {
        console.error('❌ Error al enviar el email de prueba\n');
        console.error('   Verifica los logs anteriores para más detalles\n');
        process.exit(1);
      }
    } else {
      console.error('❌ No se pudo conectar con Gmail\n');
      console.error('   Posibles causas:');
      console.error('   1. Email o contraseña incorrectos');
      console.error('   2. No has generado una "Contraseña de Aplicación"');
      console.error('   3. La verificación en 2 pasos no está activada');
      console.error('   4. Problemas de conexión a internet\n');
      console.error('   Consulta GMAIL_SETUP.md para instrucciones detalladas\n');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
    process.exit(1);
  }
}

testEmailService();
