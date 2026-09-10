import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import logo from '../assets/logitranslogo.png';
import { slides, courseInfo } from '../data/slides';
import { getUserData } from '../utils/userStorage';
import RegistrationGate from '../components/RegistrationGate';
import Narrator from '../components/Narrator';
import VideoModule from '../components/VideoModule';
import SlideVisual from '../components/SlideVisual';
import QuizFinal from '../components/QuizFinal';
import ProgressBar from '../components/ProgressBar';

const COURSE_ID = 'sarlaft-2026';
const TOTAL_STEPS = slides.length + 1; // + quiz final

function Training() {
  const navigate = useNavigate();

  // Datos del participante (nombre, cédula, cargo) — se piden antes de iniciar
  const [userData, setUserData] = useState(() => getUserData(COURSE_ID));
  // Siempre arrancamos mostrando la puerta de registro (pide o confirma los
  // datos); si ya hay datos guardados, RegistrationGate muestra un resumen
  // con un botón "Continuar" en vez de pedirlos de nuevo.
  const [gatePassed, setGatePassed] = useState(false);

  const [step, setStep] = useState(0); // 0..slides.length-1 = diapositivas, slides.length = quiz
  const [narrationDone, setNarrationDone] = useState(false);
  const [pollRevealed, setPollRevealed] = useState(false);

  if (!gatePassed) {
    return (
      <RegistrationGate
        courseId={COURSE_ID}
        existingData={userData}
        onComplete={(data) => {
          setUserData(data);
          setGatePassed(true);
        }}
      />
    );
  }

  const isQuiz = step === slides.length;
  const currentSlide = !isQuiz ? slides[step] : null;

  const goNext = () => {
    if (step < slides.length) {
      setStep((s) => s + 1);
      setNarrationDone(false);
      setPollRevealed(false);
    }
  };
  const goPrev = () => {
    if (step > 0) {
      setStep((s) => s - 1);
      setNarrationDone(false);
      setPollRevealed(false);
    }
  };

  const handleNarrationEnd = () => {
    setNarrationDone(true);
    if (currentSlide?.type === 'poll') setPollRevealed(true);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col">
      <header className="px-3 md:px-6 py-3">
        <div className="flex items-center justify-between bg-white/5 ring-1 ring-zinc-700 rounded-xl px-4 py-2.5">
          <div className="flex items-center gap-3">
            <div className="bg-white h-9 w-9 rounded-lg flex items-center justify-center p-1">
              <img src={logo} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <p className="text-sm md:text-lg font-bold text-zinc-100 leading-tight">{courseInfo.title}</p>
              <p className="text-xs text-zinc-500">
                {isQuiz ? 'Quiz de cierre' : `${currentSlide.kicker} · ${currentSlide.duration}`}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center"
            aria-label="Salir"
          >
            <X size={16} />
          </button>
        </div>
        <div className="mt-3 px-1">
          <ProgressBar current={step + 1} total={TOTAL_STEPS} />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-3 md:px-6 pb-6">
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            {isQuiz ? (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.3 }}
                className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 md:p-7 mt-2"
              >
                <QuizFinal courseId={COURSE_ID} userData={userData} onFinish={() => navigate('/')} />
              </motion.div>
            ) : (
              <motion.div
                key={currentSlide.id}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.3 }}
                className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 md:p-7 mt-2 space-y-6"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-zinc-100">{currentSlide.title}</h2>

                {currentSlide.videoClips && currentSlide.videoClips.length > 0 ? (
                  <VideoModule clips={currentSlide.videoClips} onEnded={handleNarrationEnd} />
                ) : (
                  <>
                    <SlideVisual slide={currentSlide} revealed={pollRevealed} />
                    <div className="border-t border-zinc-800 pt-4">
                      <Narrator
                        key={currentSlide.id}
                        text={currentSlide.narration}
                        autoPlay
                        onEnd={handleNarrationEnd}
                      />
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {!isQuiz && (
            <div className="flex items-center justify-between mt-5 gap-3">
              <button
                onClick={goPrev}
                disabled={step === 0}
                className={`flex items-center gap-1 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                  step === 0
                    ? 'border-zinc-800 text-zinc-600 cursor-not-allowed'
                    : 'border-zinc-700 text-zinc-200 hover:bg-zinc-800'
                }`}
              >
                <ChevronLeft size={16} /> Anterior
              </button>

              <button
                onClick={goNext}
                disabled={!narrationDone}
                className={`flex items-center gap-1 px-6 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  narrationDone
                    ? 'bg-zinc-100 text-zinc-900 hover:bg-white'
                    : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                }`}
              >
                {step === slides.length - 1 ? 'Ir al quiz' : 'Siguiente'} <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Training;
