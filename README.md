# Formaciones 2027 — Capacitación SARLAFT 2026

Proyecto independiente (React + Vite + Tailwind), hermano de `web_formaciones`, con el mismo
estilo visual (tema oscuro, tipografía y colores de Logitrans).

## Cómo funciona la narración

Cada diapositiva tiene su texto en `src/data/slides.js` (campo `narration`). Ese texto se
lee automáticamente con la voz del navegador (Web Speech API) usando el componente
`src/components/Narrator.jsx` — no depende de ningún servicio externo ni de archivos de
audio/video, y funciona apenas se abre la página.

## Cómo reemplazar la narración por un video real con avatar

1. Genera el video en la plataforma externa que elijas (Synthesia, HeyGen, D-ID, etc.),
   usando como guion el mismo texto que ya está en `narration` (o el archivo
   `guiones_narracion.md` en la raíz del proyecto, pensado para copiar y pegar).
2. Descarga el .mp4 resultante y colócalo en `src/assets/videos/` (crea la carpeta si no existe).
3. En `src/data/slides.js`, en la diapositiva correspondiente, cambia:
   ```js
   videoSrc: null,
   ```
   por:
   ```js
   videoSrc: '/videos/nombre-del-video.mp4',
   ```
   (y copia también el archivo a `public/videos/` para que Vite lo sirva).
4. Listo — esa diapositiva mostrará el video en vez de la narración por voz,
   sin tocar nada más del código.

## Comandos

```bash
npm install
npm run dev      # servidor local de desarrollo
npm run build    # genera la carpeta dist/ para publicar
npm run preview  # previsualiza el build de producción
```

## Estructura

```
src/
  data/slides.js        contenido del curso (7 diapositivas + quiz)
  components/
    Narrator.jsx         motor de narración por voz (TTS) con resaltado de texto
    VideoModule.jsx       reproductor para cuando exista un video real narrado
    SlideVisual.jsx        gráficos/animaciones de cada diapositiva
    QuizFinal.jsx          quiz de cierre con calificación
    ProgressBar.jsx        barra de progreso del curso
  pages/
    Home.jsx               portada con la tarjeta del curso
    Training.jsx            visor de diapositivas + navegación
```
