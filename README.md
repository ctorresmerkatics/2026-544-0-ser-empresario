# Selección Ser Empresario — Embudo de Adquisición y Calificación Editorial

Aplicación web que implementa el diagnóstico **"Índice de Relevancia Empresarial"** del plan de
embudo de Ser Empresario (Ciudad Juárez): un ScoreApp de 12 preguntas que califica a cada
candidato en cinco categorías ponderadas, lo segmenta en 4 resultados y, si califica, lo invita a
solicitar una entrevista editorial — en vez de mostrarle directamente el precio de una
publicación de dos páginas.

Construida con **Vite + React 19 + TypeScript + Tailwind CSS**.

## Estructura de carpetas

```
src/
├── types/
│   └── index.ts            # Todas las interfaces y tipos del proyecto
├── data/                    # Contenido/configuración (no es lógica de negocio)
│   ├── questions.ts          # Catálogo de las 12 preguntas + pesos por categoría
│   ├── segments.ts           # Los 4 resultados del diagnóstico
│   └── siteConfig.ts         # Cupos de la edición, claves de storage/URL
├── lib/                     # Lógica de negocio pura (sin JSX, testeable de forma aislada)
│   ├── scoring.ts             # Cálculo de puntuación por categoría y total
│   ├── segment.ts             # Determina el segmento a partir del puntaje
│   ├── storage.ts             # Envoltura segura sobre localStorage
│   └── validators.ts          # Validación del formulario de contacto
├── context/
│   └── FunnelContext.tsx     # Estado global (useReducer) + persistencia
├── hooks/
│   ├── useFunnel.ts           # Hook de conveniencia para las vistas del quiz
│   └── useCountUp.ts          # Animación de contadores con setInterval
├── components/
│   ├── ui/                    # Componentes de interfaz reutilizables y sin lógica de negocio
│   │   ├── Button.tsx, Spinner.tsx, ProgressBar.tsx, SelectableCard.tsx,
│   │   │   LikertScale.tsx, TextField.tsx, TextArea.tsx, Modal.tsx, Badge.tsx, ScoreGauge.tsx
│   ├── layout/                 # Header, Footer, Container
│   └── funnel/                 # Secciones del embudo (usan el contexto/estado global)
│       ├── LandingView.tsx, QuizView.tsx, QuestionRenderer.tsx, ContactStep.tsx,
│       │   AnalyzingView.tsx, ResultView.tsx, InterviewModal.tsx
├── pages/                    # Contenedores de página (una por fase del embudo)
│   ├── FunnelPage.tsx          # Cascarón compartido (header + footer)
│   ├── LandingPage.tsx, QuizPage.tsx, AnalyzingPage.tsx, ResultPage.tsx
├── App.tsx                   # Enrutador simple según `phase` del estado global
├── main.tsx
└── index.css                  # Directivas Tailwind + estilos globales (slider, animaciones)
```

## Cómo funciona el embudo

1. **Landing** (`/`) — "¿Tu historia merece ser publicada?" con CTA "Evaluar mi perfil".
2. **Quiz** (13 pasos) — 12 preguntas + 1 paso de contacto. Cada pregunta puede ser de opción
   única, sí/no, slider (Likert 1–5) o texto libre. El progreso se guarda en cada paso.
3. **Análisis** — pantalla animada (contador + mensajes rotativos) que calcula el puntaje.
4. **Resultado** — medidor circular animado, desglose por categoría y CTA según el segmento
   (`alto-potencial`, `consolidacion`, `posicionamiento` o `comunidad`).

### Persistencia

- El estado completo (respuestas, contacto, resultado) se guarda en `localStorage` en cada
  cambio, así que recargar la página no hace perder el progreso.
- El paso actual del quiz también se refleja en la URL (`?paso=n`), para poder compartir o
  retomar un enlace directamente en un paso específico.

### Datos que debes personalizar

- `src/data/siteConfig.ts` — nombre de la edición, cupos disponibles/totales (mantenlos reales,
  nunca los uses para simular escasez falsa).
- `src/data/questions.ts` — texto de las preguntas, opciones y su puntuación.
- `src/data/segments.ts` — mensajes, CTA y umbrales de los 4 resultados.
- El envío real del diagnóstico y de la solicitud de entrevista (`InterviewModal.tsx`,
  `ContactStep.tsx`) hoy solo actualiza el estado local; conecta ahí tu integración con
  ScoreApp/Merkatics o tu backend cuando quieras persistir los datos fuera del navegador.

## Cómo ejecutar el proyecto localmente

Requisitos: Node.js 18 o superior.

```bash
# 1. Instalar dependencias
npm install

# 2. Levantar el servidor de desarrollo (http://localhost:5173)
npm run dev

# 3. Compilar para producción (genera /dist)
npm run build

# 4. Previsualizar el build de producción
npm run preview
```

No se requiere backend ni variables de entorno: todo el estado vive en el navegador
(`localStorage` + React Context).
"# 2026-544-0-ser-empresario" 
