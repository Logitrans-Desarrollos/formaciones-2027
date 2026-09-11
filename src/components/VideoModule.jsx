import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

/**
 * VideoModule
 * -----------
 * Reproduce las "tomas" de video reales generadas con IA para una diapositiva
 * (ver `videoClips` en `src/data/slides.js`). Como cada toma dura máx. 10s,
 * una diapositiva puede tener varias tomas: este componente las reproduce en
 * orden, una tras otra, como si fueran un solo video, y llama a `onEnded`
 * cuando termina la última.
 *
 * A propósito NO tiene barra de progreso ni permite adelantar: solo se puede
 * reproducir/pausar o reiniciar desde el principio, para asegurar que el
 * participante vea el contenido completo (como un curso obligatorio).
 *
 * Para agregar un video nuevo: coloca el .mp4 en `public/videos/` y agrega su
 * ruta (ej. 'videos/escena3.mp4') al arreglo `videoClips` de la diapositiva
 * correspondiente en `src/data/slides.js`. Mientras una diapositiva no tenga
 * clips, se sigue usando la narración por voz del navegador.
 */
function VideoModule({ clips, onEnded }) {
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef(null);
  const maxTimeRef = useRef(0);

  useEffect(() => {
    setIndex(0);
  }, [clips]);

  useEffect(() => {
    maxTimeRef.current = 0;
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, [index]);

  const handleEnded = () => {
    if (index < clips.length - 1) {
      setIndex((i) => i + 1);
    } else {
      setIsPlaying(false);
      if (onEnded) onEnded();
    }
  };

  // Bloquea el adelantar: si el usuario intenta saltar hacia adelante
  // (arrastrando la barra nativa, atajos de teclado, etc.), lo devolvemos
  // al punto más avanzado que realmente ha visto.
  const handleSeeking = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.currentTime > maxTimeRef.current + 0.35) {
      video.currentTime = maxTimeRef.current;
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.currentTime > maxTimeRef.current) {
      maxTimeRef.current = video.currentTime;
    }
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const restart = () => {
    const video = videoRef.current;
    if (!video) return;
    maxTimeRef.current = 0;
    video.currentTime = 0;
    video.play();
    setIsPlaying(true);
  };

  const base = import.meta.env.BASE_URL;

  return (
    <div>
      <div className="relative group">
        <video
          key={index}
          ref={videoRef}
          className="w-full rounded-2xl shadow-lg border border-zinc-700/50"
          preload="auto"
          autoPlay
          playsInline
          controlsList="noplaybackrate nodownload nofullscreen"
          disablePictureInPicture
          onEnded={handleEnded}
          onSeeking={handleSeeking}
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onClick={togglePlay}
        >
          <source src={`${base}${clips[index]}`} type="video/mp4" />
          Tu navegador no soporta la reproducción de video.
        </video>

        {/* Controles propios: solo reproducir/pausar y reiniciar. Sin barra
            de progreso arrastrable, para que no se pueda adelantar. */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
          <button
            type="button"
            onClick={togglePlay}
            className="flex items-center gap-1.5 bg-black/60 hover:bg-black/75 text-white text-sm font-medium px-3 py-2 rounded-lg backdrop-blur-sm transition-colors"
            aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            {isPlaying ? 'Pausar' : 'Reproducir'}
          </button>
          <button
            type="button"
            onClick={restart}
            className="flex items-center gap-1.5 bg-black/60 hover:bg-black/75 text-white text-sm font-medium px-3 py-2 rounded-lg backdrop-blur-sm transition-colors"
            aria-label="Repetir desde el inicio"
          >
            <RotateCcw size={16} />
            Repetir
          </button>
        </div>
      </div>
      {clips.length > 1 && (
        <p className="text-xs text-zinc-500 mt-2 text-center">
          Escena {index + 1} de {clips.length}
        </p>
      )}
    </div>
  );
}

export default VideoModule;
