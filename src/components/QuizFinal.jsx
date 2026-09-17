import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Award, Download, RotateCcw, Loader2 } from 'lucide-react';
import { quiz } from '../data/slides';
import { downloadCertificate } from '../utils/certificate';
import { reportCompletion } from '../utils/completions';

const PASSING_PERCENTAGE = 75; // al menos 3 de 4 respuestas correctas

function QuizFinal({ courseId, userData, onFinish }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [certError, setCertError] = useState(false);
  const [reported, setReported] = useState(false);

  const selectAnswer = (qIndex, oIndex) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qIndex]: oIndex }));
  };

  const score = quiz.questions.reduce((acc, q, qi) => {
    const selected = answers[qi];
    if (selected !== undefined && q.options[selected]?.correct) return acc + 1;
    return acc;
  }, 0);

  const percentage = Math.round((score / quiz.questions.length) * 100);
  const passed = percentage >= PASSING_PERCENTAGE;
  const allAnswered = quiz.questions.every((_, qi) => answers[qi] !== undefined);

  const handleSubmit = () => {
    setSubmitted(true);
    if (passed && !reported) {
      setReported(true);
      // No bloquea la interfaz: se registra en segundo plano en GitHub. Si
      // falla (sin internet, etc.) el usuario sigue viendo su certificado
      // con normalidad, solo que no quedará marcado como completado.
      reportCompletion({ courseId, userData, score: percentage });
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setSubmitted(false);
    setCertError(false);
    setReported(false);
  };

  const handleDownload = async () => {
    setGenerating(true);
    setCertError(false);
    try {
      await downloadCertificate({ userData, courseId, score: `${percentage}%` });
    } catch (e) {
      setCertError(true);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl md:text-2xl font-bold text-zinc-100">{quiz.title}</h3>
        <span className="text-xs text-zinc-500">{quiz.duration}</span>
      </div>

      {quiz.questions.map((q, qi) => (
        <motion.div
          key={qi}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: qi * 0.08 }}
          className="bg-zinc-800/50 border border-zinc-700/40 rounded-xl p-4"
        >
          <p className="text-zinc-100 font-medium mb-3">{qi + 1}. {q.question}</p>
          <div className="space-y-2">
            {q.options.map((opt, oi) => {
              const isSelected = answers[qi] === oi;
              let stateClasses = 'border-zinc-700/50 hover:border-zinc-500 bg-zinc-900/40';
              if (submitted) {
                if (opt.correct) stateClasses = 'border-emerald-500/60 bg-emerald-900/20';
                else if (isSelected && !opt.correct) stateClasses = 'border-red-500/60 bg-red-900/20';
              } else if (isSelected) {
                stateClasses = 'border-blue-500/60 bg-blue-900/20';
              }
              return (
                <button
                  key={oi}
                  onClick={() => selectAnswer(qi, oi)}
                  disabled={submitted}
                  className={`w-full text-left flex items-center gap-2 rounded-lg px-3 py-2 border transition-colors text-sm md:text-base text-zinc-200 ${stateClasses}`}
                >
                  {submitted && opt.correct && <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />}
                  {submitted && isSelected && !opt.correct && <XCircle size={16} className="text-red-400 shrink-0" />}
                  <span>{opt.text}</span>
                </button>
              );
            })}
          </div>
        </motion.div>
      ))}

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={!allAnswered}
          className={`w-full md:w-auto px-6 py-3 rounded-xl font-medium transition-colors ${
            allAnswered ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
          }`}
        >
          Enviar respuestas
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`space-y-4 border rounded-xl p-5 ${
            passed ? 'bg-gradient-to-r from-emerald-900/30 to-blue-900/30 border-emerald-500/30' : 'bg-gradient-to-r from-orange-900/20 to-red-900/20 border-orange-500/30'
          }`}
        >
          <div className="flex items-center gap-3">
            <Award className={passed ? 'text-emerald-400' : 'text-orange-400'} size={28} />
            <div>
              <p className="text-zinc-100 font-semibold">Puntaje: {percentage}% ({score} / {quiz.questions.length})</p>
              <p className="text-zinc-400 text-sm">
                {passed
                  ? '¡Aprobaste! Ya puedes descargar tu certificado.'
                  : `Necesitas al menos ${PASSING_PERCENTAGE}% para aprobar. Puedes intentarlo de nuevo.`}
              </p>
            </div>
          </div>

          {passed ? (
            <div className="flex flex-col md:flex-row gap-3">
              <button
                onClick={handleDownload}
                disabled={generating}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors disabled:opacity-60"
              >
                {generating ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                {generating ? 'Generando certificado...' : 'Descargar certificado'}
              </button>
              <button
                onClick={onFinish}
                className="px-6 py-3 rounded-xl bg-zinc-100 text-zinc-900 font-medium hover:bg-white transition-colors"
              >
                Finalizar
              </button>
            </div>
          ) : (
            <button
              onClick={handleRetry}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium bg-orange-600 hover:bg-orange-500 text-white transition-colors"
            >
              <RotateCcw size={18} /> Intentar nuevamente
            </button>
          )}

          {certError && (
            <p className="text-sm text-red-400">
              Hubo un problema generando el certificado. Intenta de nuevo — si persiste, revisa la consola del navegador (F12).
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
}

export default QuizFinal;
