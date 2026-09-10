import React, { useEffect, useRef, useState } from 'react';

/**
 * VideoModule
 * -----------
 * Reproduce las "tomas" de video reales generadas con IA para una diapositiva
 * (ver `videoClips` en `src/data/slides.js`). Como cada toma dura máx. 10s,
 * una diapositiva puede tener varias tomas: este componente las reproduce en
 * orden, una tras otra, como si fueran un solo video, y llama a `onEnded`
 * cuando termina la última.
 *
 * Para agregar un video nuevo: coloca el .mp4 en `public/videos/` y agrega su
 * ruta (ej. 'videos/escena3.mp4') al arreglo `videoClips` de la diapositiva
 * correspondiente en `src/data/slides.js`. Mientras una diapositiva no tenga
 * clips, se sigue usando la narración por voz del navegador.
 */
function VideoModule({ clips, onEnded }) {
  const [index, setIndex] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    setIndex(0);
  }, [clips]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [index]);

  const handleEnded = () => {
    if (index < clips.length - 1) {
      setIndex((i) => i + 1);
    } else if (onEnded) {
      onEnded();
    }
  };

  const base = import.meta.env.BASE_URL;

  return (
    <div>
      <video
        key={index}
        ref={videoRef}
        className="w-full rounded-2xl shadow-lg border border-zinc-700/50"
        controls
        autoPlay
        onEnded={handleEnded}
      >
        <source src={`${base}${clips[index]}`} type="video/mp4" />
        Tu navegador no soporta la reproducción de video.
      </video>
      {clips.length > 1 && (
        <p className="text-xs text-zinc-500 mt-2 text-center">
          Escena {index + 1} de {clips.length}
        </p>
      )}
    </div>
  );
}

export default VideoModule;
