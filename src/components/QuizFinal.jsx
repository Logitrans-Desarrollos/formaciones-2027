import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Award } from 'lucide-react';
import { quiz } from '../data/slides';

function QuizFinal({ onFinish }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const selectAnswer = (qIndex, oIndex) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qIndex]: oIndex }));
  };

  const score = quiz.questions.reduce((acc, q, qi) => {
    const selected = answers[qi];
    if (selected !== undefined && q.options[selected]?.correct) return acc + 1;
    return acc;
  }, 0);

  const allAnswered = quiz.questions.every((_, qi) => answers[qi] !== undefined);

  const handleSubmit = () => {
    setSubmitted(true);
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
          className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-r from-emerald-900/30 to-blue-900/30 border border-emerald-500/30 rounded-xl p-5"
        >
          <div className="flex items-center gap-3">
            <Award className="text-emerald-400" size={28} />
            <div>
              <p className="text-zinc-100 font-semibold">Puntaje: {score} / {quiz.questions.length}</p>
              <p className="text-zinc-400 text-sm">¡Gracias por completar la capacitación SARLAFT!</p>
            </div>
          </div>
          <button
            onClick={onFinish}
            className="px-6 py-3 rounded-xl bg-zinc-100 text-zinc-900 font-medium hover:bg-white transition-colors"
          >
            Finalizar
          </button>
        </motion.div>
      )}
    </div>
  );
}

export default QuizFinal;
