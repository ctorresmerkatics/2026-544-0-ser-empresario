import { useEffect, useState } from 'react';
import { useFunnel } from '../../hooks/useFunnel';
import { validateContact } from '../../lib/validators';
import { evaluateFunnel } from '../../lib/segment';
import { Button, ProgressBar } from '../ui';
import { QuestionRenderer } from './QuestionRenderer';
import { ContactStep } from './ContactStep';
import { QUESTIONS } from '../../data/questions';
import type { ContactInfo, FunnelState } from '../../types';

// 1. Definimos la función helper para estructurar el HTML del correo
function construirHtmlRespuestas(state: FunnelState): string {
  const { contact, answers, result } = state;

  let html = `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; padding: 24px; border-radius: 12px;">
  `;

  // 1. SECCIÓN DE RESULTADO Y CALIFICACIÓN (Si ya está calculado)
  if (result) {
    const { total, segment, categoryScores } = result;

    html += `
      <div style="text-align: center; background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
        <span style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 4px 12px; border-radius: 16px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">
          ${segment.badge}
        </span>
        
        <h1 style="font-size: 42px; margin: 16px 0 4px 0; color: #0f172a; font-weight: 800;">
          ${total} <span style="font-size: 18px; color: #64748b; font-weight: normal;">/ 100</span>
        </h1>
        
        <h2 style="color: #0f172a; font-size: 20px; margin-top: 12px; font-weight: 700;">
          ${segment.title}
        </h2>
        
        <p style="color: #475569; font-size: 14px; margin-top: 8px;">
          Hola ${contact.nombre.split(' ')[0] || ''}, ${segment.message}
        </p>
      </div>

      <!-- DESGLOSE POR CATEGORÍA -->
      <div style="margin-bottom: 24px;">
        <h4 style="color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">
          Desglose por categoría
        </h4>
        <ul style="list-style: none; padding: 0; margin: 0;">
    `;

    categoryScores.forEach((cat) => {
      html += `
        <li style="margin-bottom: 10px;">
          <div style="display: flex; justify-content: space-between; font-size: 14px; font-weight: bold; color: #1e293b; margin-bottom: 4px;">
            <span>${cat.label}</span>
            <span style="color: #64748b; font-size: 12px; font-weight: normal;">${Math.round(cat.weight * 100)}% del índice</span>
          </div>
          <div style="background-color: #e2e8f0; height: 8px; border-radius: 4px; overflow: hidden;">
            <div style="background-color: #0f172a; width: ${cat.score}%; height: 100%;"></div>
          </div>
        </li>
      `;
    });

    html += `
        </ul>
      </div>
    `;
  }

  // 2. SECCIÓN DE DATOS DE CONTACTO
  html += `
    <h3 style="color: #da3a25; border-bottom: 2px solid #da3a25; padding-bottom: 4px; margin-top: 24px;">
      Datos de Contacto
    </h3>
    <ul style="list-style: none; padding: 0; margin: 0 0 20px 0;">
      <li style="margin-bottom: 4px;"><strong>Nombre:</strong> ${contact.nombre || 'No proporcionado'}</li>
      <li style="margin-bottom: 4px;"><strong>Email:</strong> ${contact.email || 'No proporcionado'}</li>
      <li style="margin-bottom: 4px;"><strong>Teléfono:</strong> ${contact.telefono || 'No proporcionado'}</li>
      <li style="margin-bottom: 4px;"><strong>Empresa:</strong> ${contact.empresa || 'No proporcionado'}</li>
    </ul>

    <!-- 3. DETALLE DE PREGUNTAS Y RESPUESTAS -->
    <h3 style="color: #da3a25; border-bottom: 2px solid #da3a25; padding-bottom: 4px; margin-top: 24px;">
      Respuestas del Diagnóstico
    </h3>
    <ol style="padding-left: 20px; margin-top: 12px;">
  `;

  QUESTIONS.forEach((q) => {
    const rawValue = answers[q.id];
    let respuestaTexto = 'Sin respuesta';

    if (rawValue !== undefined && rawValue !== null && rawValue !== '') {
      if (q.kind === 'single-select') {
        const option = q.options.find((opt) => opt.value === rawValue);
        respuestaTexto = option ? option.label : String(rawValue);
      } else if (q.kind === 'boolean') {
        respuestaTexto = rawValue ? q.trueLabel : q.falseLabel;
      } else {
        respuestaTexto = String(rawValue);
      }
    }

    html += `
      <li style="margin-bottom: 12px;">
        <strong>${q.prompt}</strong><br>
        <span style="color: #334155; background-color: #f1f5f9; padding: 3px 8px; border-radius: 4px; display: inline-block; margin-top: 4px; font-size: 13px;">
          ${respuestaTexto}
        </span>
      </li>
    `;
  });

  html += `
      </ol>
    </div>
  `;
  console.log(html);
  return html;
}

// 2. Definimos la función que envía la petición al backend
async function enviarFormulario(state: FunnelState) {
  const respuestasHtml = construirHtmlRespuestas(state);

  const payload = {
    nombre: state.contact.nombre,
    email: state.contact.email,
    telefono: state.contact.telefono,
    respuestasHtml: respuestasHtml,
  };

  try {
    const response = await fetch('http://localhost:3001/enviar-aplicacion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });


    const apiMerkaticsUrl = 'https://smartai.merkatics.com/api/p/ser-empresario/X6wwzE3ZZA-Ehm-v/';
    const apiMerkatics = fetch(apiMerkaticsUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Solo enviamos las propiedades del objeto `form`
      body: JSON.stringify({
        full_name: state.contact.nombre,
        name: state.contact.nombre,
        company: state.contact.empresa,
        email: state.contact.email,
        phone: state.contact.telefono,
        custom_fields: {
           respuestasHtml: respuestasHtml,
           linkedin: state.contact.linkedin || '',
        }

      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('Error del servidor:', data.error);
    }
  } catch (err) {
    console.error('Error de red al enviar el formulario:', err);
  }
}

export function QuizView() {
  const { state, dispatch, currentQuestion, isContactStep, canAdvance, progress, totalSteps, isFirstStep } =
    useFunnel();
  const [showValidation, setShowValidation] = useState(false);

  // Cada vez que cambia el paso, ocultamos los mensajes de validación del paso anterior.
  useEffect(() => {
    setShowValidation(false);
  }, [state.stepIndex]);

  const contactErrors = validateContact(state.contact);

  function handleBack() {
    if (isFirstStep) {
      dispatch({ type: 'HYDRATE', state: { phase: 'landing' } });
      return;
    }
    dispatch({ type: 'PREV_STEP' });
  }

  function handleNext() {
    if (!canAdvance) {
      setShowValidation(true);
      return;
    }
    if (isContactStep) {
      const result = evaluateFunnel(state.answers);
      dispatch({ type: 'BEGIN_ANALYSIS' });

      enviarFormulario({ ...state, result });
      return;
    }
    dispatch({ type: 'NEXT_STEP', totalSteps });
  }

  function handleContactChange(field: keyof ContactInfo, value: string) {
    dispatch({ type: 'UPDATE_CONTACT', field, value });
  }
  

  return (
    <div className="flex min-h-[70vh] flex-col justify-center py-10">
      <div className="mb-8">
        <ProgressBar
          value={progress}
          label={`Paso ${state.stepIndex + 1} de ${totalSteps}`}
          helperText="Índice de Relevancia Empresarial"
        />
      </div>

      <div className="rounded-3xl border border-brand-navy/10 bg-white/70 p-6 shadow-card sm:p-10">
        {currentQuestion && (
          <QuestionRenderer
            question={currentQuestion}
            value={state.answers[currentQuestion.id]}
            onChange={(value) => dispatch({ type: 'ANSWER_QUESTION', questionId: currentQuestion.id, value })}
            showValidation={showValidation}
          />
        )}

        {isContactStep && (
          <ContactStep
            contact={state.contact}
            errors={contactErrors}
            showValidation={showValidation}
            onChange={handleContactChange}
          />
        )}

        <div className="mt-8 flex items-center justify-between gap-3">
          <Button variant="ghost" onClick={handleBack}>
            ← Atrás
          </Button>
          <Button variant="primary" size="lg" onClick={handleNext}>
            {isContactStep ? 'Ver mi resultado' : 'Continuar'}
          </Button>
        </div>
      </div>
    </div>
  );
}
