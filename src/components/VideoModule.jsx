import React from 'react';

/**
 * VideoModule
 * -----------
 * Reproduce un video real narrado (ej. generado con avatar en Synthesia/HeyGen/D-ID)
 * cuando `src` está definido. Este componente queda listo desde ya: el día que tengas
 * el .mp4, colócalo en `src/assets/videos/` e indica su ruta en `src/data/slides.js`
 * (campo `videoSrc` de la diapositiva correspondiente) — SlideStage.jsx lo detecta
 * automáticamente y deja de usar la narración por voz para esa diapositiva.
 */
function VideoModule({ src, onEnded }) {
  return (
    <video
      className="w-full rounded-2xl shadow-lg border border-zinc-700/50"
      controls
      autoPlay
      onEnded={onEnded}
    >
      <source src={src} type="video/mp4" />
      Tu navegador no soporta la reproducción de video.
    </video>
  );
}

export default VideoModule;
