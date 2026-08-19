const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const cors = require('cors');

const app = express();


app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'info@merkatics.com',
    pass: 'mqvmputlscyjrggf' 
  }
});

app.post('/enviar-aplicacion', async (req, res) => {
  const data = req.body;
  //const file = req.file;

  console.log("Datos recibidos:", data);


  const mailUsuario = {
    from: '"Equipo Merkatics" <info@merkatics.com>',
    to: data.email, 
    bcc: 'info@merkatics.com',
    subject: 'Ser Empresario| Respuestas del Formulario',
    html: `      
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
        <h2 style="color: #da3a25;">¡Hola, ${data.nombre || 'Cliente'}!</h2>
        <p>Gracias por completar la evaluación. Aquí tienes un resumen de tus respuestas:</p>
        <hr>
        ${data.respuestasHtml || '<p>No se recibieron respuestas.</p>'}
      </div>
    `
  };

 
  try {    
    await transporter.sendMail(mailUsuario);
    
    return res.status(200).json({ message: "Éxito al enviar ambos correos" });

  } catch (error) {
    console.error("Error al enviar email:", error);
    if (!res.headersSent) {
      return res.status(500).json({ error: error.message });
    }
  }
    
});

app.post('/enviar-aplicacion-cita', async (req, res) => {
  const data = req.body;
  //const file = req.file;

  console.log("Datos recibidos:", data);
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

 
  try {    
    await transporter.sendMail(mailUsuario);
    
    return res.status(200).json({ message: "Éxito al enviar ambos correos" });

  } catch (error) {
    console.error("Error al enviar email:", error);
    if (!res.headersSent) {
      return res.status(500).json({ error: error.message });
    }
  }
    
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor Merkatics corriendo en puerto ${PORT}`));