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


  const cuerpoCorreo = `
     NUEVA SOLICITUD DE PASANTÍA RECIBIDA
    -------------------------------------------
    DATOS PERSONALES
    - Nombre: ${data.nombre}
    - Email: ${data.email}
    - Teléfono: ${data.telefono}

    INFORMACIÓN ACADÉMICA
    - Universidad: ${data.universidad}
    - Carrera: ${data.carrera}
    - Periodo actual: ${data.periodo} (${data.tipoPeriodo})
   
    INFORMACIÓN PROFESIONAL
    - Área de interés: ${data.areaInteres === 'Otra' ? data.otraArea : data.areaInteres}
    - ¿Tiene experiencia previa?: ${data.experiencia}
    - Descripción breve: ${data.descripcion || 'No proporcionada'}

    MOTIVACIÓN
    - Por qué quiere la pasantía:
    ${data.motivacion}
    -------------------------------------------
    Nota: El CV se adjunta en este correo electrónico.
  `;



  // 2. Preparamos ambos correos 
  /*const mailOptionsInterno = {
    from: '"Reclutamiento Merkatics" <info@merkatics.com>',
    to: 'info@merkatics.com',
    subject: `Nueva aplicación: ${data.areaInteres} - ${data.nombre}`,
    text: cuerpoCorreo, 
    attachments: file ? [{ 
      filename: file.originalname, 
      content: file.buffer 
    }] : []
  };*/

  const mailUsuario = {
    from: '"Equipo Merkatics" <info@merkatics.com>',
    to: 'info@merkatics.com',
    subject: 'Merkatics | Onboarding del proyecto',
    html: `      
     <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
       <h2 style="color: #da3a25;">¡Hola, ${data.nombre}!</h2>
        <p>Tus respuestas nos permiten reemplazar los marcadores de posición del Plan de Embudo Comercial y de la Landing Page Dinámica por tu historia, tu especialización, tu audiencia real y tu marca.</p>
        <br>
        <hr>
        ${data.respuestasHtml}
      </div>
    `
  };

 
  try {
    //await transporter.sendMail(mailOptionsInterno);
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