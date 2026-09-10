// Contenido del curso "Capacitación SARLAFT 2026" — Formaciones 2027
// Tomado tal cual del guion original (Word SARLAFT 1.docx).
// Cada slide incluye:
//  - narration: texto que se lee con Text-to-Speech Y que sirve como guion
//    para generar un video con avatar en una plataforma externa (Synthesia, HeyGen, D-ID...)
//  - videoClips: rutas a las "tomas" de video reales generadas con IA (máx. 10s
//    cada una, ej: 'videos/escena1.mp4'), en el orden en que se deben reproducir.
//    Mientras el arreglo esté vacío, se usa la narración por voz del navegador.

export const slides = [
  {
    id: 'bienvenida',
    duration: '1 min',
    title: 'Bienvenida',
    kicker: 'Diapositiva 1',
    // Tomas de video (máx. 10s cada una) generadas con IA, en orden.
    // Agrega aquí más rutas ('videos/escenaN.mp4') a medida que generes las que faltan.
    videoClips: ['videos/escena1.mp4', 'videos/escena2.mp4'],
    type: 'poll',
    poll: {
      question: '¿Quién cree que el SARLAFT es responsabilidad únicamente del Oficial de Cumplimiento?',
      prompt: '🙋‍♂️ Levanten la mano...',
      reveal: 'La realidad es que todos hacemos parte del SARLAFT. Cada creación de un proveedor, transportador, vehículo o cada operación de transporte puede ayudarnos a prevenir riesgos.',
    },
    narration:
      'Bienvenidos a la capacitación SARLAFT 2026: todos somos la primera línea de defensa. ' +
      'Antes de comenzar, quiero hacerles una pregunta: ¿quién cree que el SARLAFT es responsabilidad únicamente del Oficial de Cumplimiento? ' +
      'Levanten la mano quienes piensen que sí. ' +
      'La realidad es que todos hacemos parte del SARLAFT. Cada creación de un proveedor, transportador, vehículo, o cada operación de transporte, puede ayudarnos a prevenir riesgos.',
  },
  {
    id: 'que-es-sarlaft',
    duration: '2 min',
    title: '¿Qué es el SARLAFT?',
    kicker: 'Diapositiva 2',
    videoClips: [], // agrega ['videos/escenaN.mp4', ...] cuando tengas las tomas de esta diapositiva
    type: 'checklist',
    definition:
      'SARLAFT es el Sistema de Administración del Riesgo de Lavado de Activos, Financiación del Terrorismo y Financiamiento de la Proliferación de Armas de Destrucción Masiva.',
    objective: 'Su objetivo es evitar que nuestra empresa sea utilizada para actividades ilegales.',
    note: 'No es un trámite. Es una herramienta para proteger:',
    items: ['La empresa', 'Nuestros clientes', 'Los colaboradores', 'Nuestra reputación'],
    narration:
      '¿Qué es el SARLAFT? SARLAFT es el Sistema de Administración del Riesgo de Lavado de Activos, Financiación del Terrorismo, y Financiamiento de la Proliferación de Armas de Destrucción Masiva. ' +
      'Su objetivo es evitar que nuestra empresa sea utilizada para actividades ilegales. ' +
      'No es un trámite. Es una herramienta para proteger: la empresa, nuestros clientes, los colaboradores, y nuestra reputación.',
  },
  {
    id: 'por-que-2026',
    duration: '2 min',
    title: '¿Por qué hablamos de esto en 2026?',
    kicker: 'Diapositiva 3',
    videoClips: [], // agrega ['videos/escenaN.mp4', ...] cuando tengas las tomas de esta diapositiva
    type: 'checklist',
    definition:
      'La Resolución 4607 de 2026 fortaleció los controles que debemos demostrar como empresa vigilada por la Superintendencia de Transporte.',
    note: 'Además:',
    items: [
      'Somos vigilados por la Superintendencia de Transporte.',
      'Reportamos información periódica a la UIAF.',
      'Debemos demostrar que nuestros controles realmente funcionan.',
    ],
    narration:
      '¿Por qué hablamos de esto en 2026? La Resolución 4607 de 2026 fortaleció los controles que debemos demostrar como empresa vigilada por la Superintendencia de Transporte. ' +
      'Además: somos vigilados por la Superintendencia de Transporte, reportamos información periódica a la U I A F, y debemos demostrar que nuestros controles realmente funcionan.',
  },
  {
    id: 'como-funciona-logitrans',
    duration: '3 min',
    title: 'Así funciona en Logitrans',
    kicker: 'Diapositiva 4',
    videoClips: [], // agrega ['videos/escenaN.mp4', ...] cuando tengas las tomas de esta diapositiva
    type: 'process',
    question: '¿Qué hacemos antes de crear un tercero?',
    steps: [
      { icon: 'truck', label: 'Transportador' },
      { icon: 'car', label: 'Vehículo' },
      { icon: 'building', label: 'Proveedor' },
    ],
    flow: [
      'Realizamos una validación LA/FT.',
      'Si encontramos una alerta, diligenciamos el formato de Debida Diligencia.',
      'El caso se analiza entre Tráfico y el Oficial de Cumplimiento.',
      'Finalmente se toma una decisión basada en el nivel de riesgo.',
    ],
    note: 'Una alerta NO significa automáticamente que exista un delito; significa que debemos conocer mejor al tercero antes de vincularlo.',
    narration:
      'Así funciona en Logitrans. ¿Qué hacemos antes de crear un tercero? Cuando vamos a crear un transportador, un vehículo, o un proveedor, realizamos una validación LA FT. ' +
      'Si encontramos una alerta, diligenciamos el formato de Debida Diligencia, y el caso se analiza entre Tráfico y el Oficial de Cumplimiento. ' +
      'Finalmente se toma una decisión basada en el nivel de riesgo. ' +
      'Una alerta no significa automáticamente que exista un delito; significa que debemos conocer mejor al tercero antes de vincularlo.',
  },
  {
    id: 'donde-riesgos',
    duration: '2 min',
    title: '¿Dónde están nuestros riesgos?',
    kicker: 'Diapositiva 5',
    videoClips: [], // agrega ['videos/escenaN.mp4', ...] cuando tengas las tomas de esta diapositiva
    type: 'riskmap',
    groups: [
      { icon: 'users', label: 'Las personas con las que hacemos negocios', items: ['Transportadores', 'Conductores', 'Proveedores'] },
      { icon: 'truck', label: 'El servicio de transporte de carga por carretera', items: [] },
      { icon: 'file', label: 'La documentación de la operación', items: [] },
      { icon: 'map', label: 'Las rutas y destinos', items: [] },
    ],
    note: 'Si algo no parece normal... 👉 Lo reportamos.',
    narration:
      '¿Dónde están nuestros riesgos? En Logitrans los riesgos pueden presentarse en: las personas con las que hacemos negocios, como transportadores, conductores y proveedores; ' +
      'el servicio de transporte de carga por carretera; la documentación de la operación; y las rutas y destinos. ' +
      'Si algo no parece normal, lo reportamos.',
  },
  {
    id: 'todos-responsables',
    duration: '2 min',
    title: 'Todos somos responsables',
    kicker: 'Diapositiva 6',
    videoClips: [], // agrega ['videos/escenaN.mp4', ...] cuando tengas las tomas de esta diapositiva
    type: 'tools',
    tools: [
      'Política de Administración del Riesgo LA/FT/FP',
      'Manual SARLAFT',
      'Código de Ética y Conducta',
      'Matriz de Riesgos LA/FT/FP',
    ],
    highlight: 'Pero la herramienta más importante eres tú.',
    steps: ['No investigues.', 'No la ignores.', 'Repórtala al área de Tráfico o al Oficial de Cumplimiento.'],
    narration:
      'Todos somos responsables. Contamos con herramientas para prevenir estos riesgos: la Política de Administración del Riesgo LA FT FP, el Manual SARLAFT, el Código de Ética y Conducta, y la Matriz de Riesgos LA FT FP. ' +
      'Pero la herramienta más importante eres tú. Si observas una situación inusual: no investigues, no la ignores, repórtala al área de Tráfico o al Oficial de Cumplimiento.',
  },
  {
    id: 'cierre',
    duration: '1 min',
    title: 'Cierre',
    kicker: 'Diapositiva 7',
    videoClips: [], // agrega ['videos/escenaN.mp4', ...] cuando tengas las tomas de esta diapositiva
    type: 'closing',
    message:
      'El SARLAFT no depende únicamente del Oficial de Cumplimiento. Cada colaborador contribuye a proteger a Logitrans, a nuestros clientes y a la operación de transporte de carga por carretera. Detectar y reportar una situación inusual puede evitar riesgos para toda la organización.',
    narration:
      'Para cerrar: el SARLAFT no depende únicamente del Oficial de Cumplimiento. Cada colaborador contribuye a proteger a Logitrans, a nuestros clientes, y a la operación de transporte de carga por carretera. ' +
      'Detectar y reportar una situación inusual puede evitar riesgos para toda la organización. A continuación, un pequeño quiz de cierre.',
  },
];

export const quiz = {
  duration: '2 min',
  title: 'Quiz de cierre',
  questions: [
    {
      question: '¿Qué hacemos si una validación genera una alerta?',
      options: [
        { text: 'La ignoramos.', correct: false },
        { text: 'Rechazamos automáticamente al tercero.', correct: false },
        { text: 'Realizamos Debida Diligencia y evaluamos el riesgo.', correct: true },
      ],
    },
    {
      question: '¿Quién participa en ese análisis?',
      options: [
        { text: 'Solo el Oficial de Cumplimiento.', correct: false },
        { text: 'Tráfico y el Oficial de Cumplimiento.', correct: true },
      ],
    },
    {
      question: '¿Qué entidad recibe nuestros reportes periódicos?',
      options: [
        { text: 'Cámara de Comercio.', correct: false },
        { text: 'UIAF.', correct: true },
      ],
    },
    {
      question: '¿Cuál es tu responsabilidad?',
      options: [
        { text: 'Investigar.', correct: false },
        { text: 'Reportar cualquier situación inusual.', correct: true },
      ],
    },
  ],
};

export const courseInfo = {
  title: 'Capacitación SARLAFT 2026',
  subtitle: 'Todos somos la primera línea de defensa',
  totalDuration: '15 minutos',
};
