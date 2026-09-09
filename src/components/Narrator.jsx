import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';

/**
 * Narrator
 * --------
 * Motor de narración por voz (Web Speech API / SpeechSynthesis) para cada diapositiva.
 * - No requiere ningún servicio externo ni archivo de audio: se genera en el navegador.
 * - Resalta la palabra que se está narrando (útil como apoyo visual, similar a subtítulos).
 * - Expone controles de reproducción (play/pause/reiniciar) y silenciar.
 * - Avisa con onEnd() cuando termina la narración, para habilitar el botón "Siguiente".
 *
 * Si en el futuro se agrega un video real narrado (con avatar generado externamente),
 * este componente deja de usarse para esa diapositiva: basta con reproducir el .mp4
 * en su lugar (ver VideoModule.jsx) y seguir usando `resumen`/`narration` como guion.
 */
function Narrator({ text, autoPlay = true, onEnd, onWordChange }) {
  const words = React.useMemo(() => text.trim().split(/\s+/), [text]);
  const [activeWord, setActiveWord] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [supported, setSupported] = useState(true);
  const utteranceRef = useRef(null);
  const startedRef = useRef(false);

  const buildUtterance = useCallback(() => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-CO';
    utterance.rate = 0.98;
    utterance.pitch = 1;

    // Intentar elegir una voz en español si el navegador la ofrece
    const voices = window.speechSynthesis.getVoices();
    const esVoice = voices.find((v) => v.lang?.toLowerCase().startsWith('es'));
    if (esVoice) utterance.voice = esVoice;

    utterance.onboundary = (event) => {
      if (event.name === 'word' || event.charIndex !== undefined) {
        // Aproximar el índice de palabra a partir del índice de caracter
        const upTo = text.slice(0, event.charIndex);
        const idx = upTo.trim().length === 0 ? 0 : upTo.trim().split(/\s+/).length;
        setActiveWord(idx);
        onWordChange?.(idx);
      }
    };
    utterance.onend = () => {
      setIsPlaying(false);
      setActiveWord(-1);
      onEnd?.();
    };
    utterance.onerror = () => {
      setIsPlaying(false);
    };
    return utterance;
  }, [text, onEnd, onWordChange]);

  const play = useCallback(() => {
    if (!('speechSynthesis' in window)) {
      setSupported(false);
      // Si el navegador no soporta TTS, avisamos que terminó para no bloquear el avance
      onEnd?.();
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = buildUtterance();
    utterance.volume = isMuted ? 0 : 1;
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  }, [buildUtterance, isMuted, onEnd]);

  const pause = () => {
    window.speechSynthesis?.pause();
    setIsPlaying(false);
  };

  const resume = () => {
    window.speechSynthesis?.resume();
    setIsPlaying(true);
  };

  const restart = () => {
    play();
  };

  const toggleMute = () => {
    setIsMuted((m) => {
      if (utteranceRef.current) utteranceRef.current.volume = m ? 1 : 0;
      return !m;
    });
  };

  useEffect(() => {
    startedRef.current = false;
    setActiveWord(-1);
    // Pequeño delay para que las voces del navegador terminen de cargar
    const t = setTimeout(() => {
      if (autoPlay && !startedRef.current) {
        startedRef.current = true;
        play();
      }
    }, 350);
    return () => {
      clearTimeout(t);
      window.speechSynthesis?.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={() => {
            if (isPlaying) {
              pause();
            } else if (window.speechSynthesis?.paused) {
              resume();
            } else {
              play();
            }
          }}
          className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center transition-colors"
          aria-label={isPlaying ? 'Pausar narración' : 'Reproducir narración'}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
        </button>
        <button
          onClick={restart}
          className="w-9 h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors"
          aria-label="Reiniciar narración"
        >
          <RotateCcw size={15} />
        </button>
        <button
          onClick={toggleMute}
          className="w-9 h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors"
          aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
        >
          {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
        </button>
        {!supported && (
          <span className="text-xs text-orange-400 ml-2">
            Tu navegador no soporta narración por voz. Puedes leer el texto normalmente.
          </span>
        )}
      </div>

      <p className="text-zinc-300 text-sm md:text-base leading-relaxed">
        {words.map((w, i) => (
          <span key={i} className={`narration-word ${i === activeWord ? 'active' : ''}`}>
            {w}{' '}
          </span>
        ))}
      </p>
    </div>
  );
}

export default Narrator;
