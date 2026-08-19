import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER || 'info@merkatics.com',
    pass: process.env.EMAIL_PASS || 'mqvmputlscyjrggf'
  }
});

export const config = {
  api: {
    bodyParser: false, 
  },
};

export default async function handler(req, res) {
  // Configurar cabeceras CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Responder preflight OPTIONS de CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    // Al no deshabilitar bodyParser, Vercel parsea req.body como JSON automáticamente
    const data = req.body || {};

    const mailUsuario = {
      from: '"Equipo Merkatics" <info@merkatics.com>',
      to: data.email, 
      bcc: 'info@merkatics.com',
      subject: 'Ser Empresario | Descubrir el ángulo de mi historia',
      html: `      
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
          <h2 style="color: #da3a25;">¡Hola, ${data.nombre || 'Cliente'}!</h2>
          <p>Registramos tu solicitud. Nuestro equipo editorial te contactará por WhatsApp o correo para confirmar el horario de tu conversación.</p>
          <hr>
          ${data.respuestasHtml || '<p>No se recibieron respuestas.</p>'}
        </div>
      `
    };


    // Enviar el correo
    await transporter.sendMail(mailUsuario);
    
    return res.status(200).json({ message: "Correo enviado con éxito" });
  } catch (error) {
    console.error("Error al enviar email:", error);
    return res.status(500).json({ 
      error: "Error interno al enviar el correo", 
      details: error.message 
    });
  }
}