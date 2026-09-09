import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck, Building2, Users, ScrollText,
  Truck, Car, FileText, MapPin, AlertTriangle, CheckCircle2,
  Search, EyeOff, Send, Megaphone,
} from 'lucide-react';

const iconMap = { truck: Truck, car: Car, building: Building2, users: Users, file: FileText, map: MapPin };

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.5, ease: 'easeOut' } }),
};

/**
 * SlideVisual
 * -----------
 * Representación gráfica animada de cada diapositiva (equivalente visual al video
 * narrado, generada 100% con código: iconos, listas y animaciones sincronizadas
 * con el avance de la narración).
 */
function SlideVisual({ slide, revealed }) {
  switch (slide.type) {
    case 'poll':
      return (
        <div className="space-y-5">
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}
            className="bg-zinc-800/60 border border-zinc-700/50 rounded-2xl p-5">
            <p className="text-lg md:text-xl font-semibold text-zinc-100">{slide.poll.question}</p>
            <p className="mt-2 text-2xl">{slide.poll.prompt}</p>
          </motion.div>
          {revealed && (
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1}
              className="bg-emerald-900/30 border border-emerald-500/30 rounded-2xl p-5">
              <p className="text-emerald-100 leading-relaxed">{slide.poll.reveal}</p>
            </motion.div>
          )}
        </div>
      );

    case 'checklist':
      return (
        <div className="space-y-4">
          <motion.p variants={fadeUp} initial="hidden" animate="show" custom={0} className="text-lg text-zinc-200 leading-relaxed">
            {slide.definition}
          </motion.p>
          {slide.objective && (
            <motion.p variants={fadeUp} initial="hidden" animate="show" custom={1} className="text-zinc-400">
              {slide.objective}
            </motion.p>
          )}
          {slide.note && (
            <motion.p variants={fadeUp} initial="hidden" animate="show" custom={2} className="text-zinc-300 font-medium">
              {slide.note}
            </motion.p>
          )}
          <div className="grid sm:grid-cols-2 gap-3">
            {slide.items.map((item, i) => (
              <motion.div key={item} variants={fadeUp} initial="hidden" animate="show" custom={3 + i}
                className="flex items-center gap-3 bg-zinc-800/50 border border-zinc-700/40 rounded-xl px-4 py-3">
                <CheckCircle2 className="text-emerald-400 shrink-0" size={20} />
                <span className="text-zinc-200 text-sm md:text-base">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      );

    case 'process':
      return (
        <div className="space-y-5">
          <motion.p variants={fadeUp} initial="hidden" animate="show" custom={0} className="text-lg font-semibold text-zinc-100">
            {slide.question}
          </motion.p>
          <div className="flex flex-wrap gap-3">
            {slide.steps.map((s, i) => {
              const Icon = iconMap[s.icon] || Truck;
              return (
                <motion.div key={s.label} variants={fadeUp} initial="hidden" animate="show" custom={1 + i}
                  className="flex items-center gap-2 bg-zinc-800/60 border border-zinc-700/50 rounded-xl px-4 py-3">
                  <Icon size={18} className="text-blue-400" />
                  <span className="text-zinc-200 text-sm">{s.label}</span>
                </motion.div>
              );
            })}
          </div>
          <div className="space-y-2">
            {slide.flow.map((f, i) => (
              <motion.div key={f} variants={fadeUp} initial="hidden" animate="show" custom={4 + i}
                className="flex items-start gap-3 bg-zinc-900/60 border border-zinc-700/30 rounded-xl px-4 py-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600/80 text-xs font-bold shrink-0">{i + 1}</span>
                <span className="text-zinc-300 text-sm md:text-base">{f}</span>
              </motion.div>
            ))}
          </div>
          {slide.note && (
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={8}
              className="flex items-start gap-3 bg-orange-900/20 border border-orange-500/30 rounded-xl px-4 py-3">
              <AlertTriangle className="text-orange-400 shrink-0 mt-0.5" size={18} />
              <span className="text-orange-100 text-sm">{slide.note}</span>
            </motion.div>
          )}
        </div>
      );

    case 'riskmap':
      return (
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            {slide.groups.map((g, i) => {
              const Icon = iconMap[g.icon] || FileText;
              return (
                <motion.div key={g.label} variants={fadeUp} initial="hidden" animate="show" custom={i}
                  className="bg-zinc-800/50 border border-zinc-700/40 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Icon size={18} className="text-blue-400" />
                    <span className="text-zinc-100 font-medium text-sm md:text-base">{g.label}</span>
                  </div>
                  {g.items.length > 0 && (
                    <ul className="text-zinc-400 text-sm list-disc list-inside pl-1">
                      {g.items.map((it) => <li key={it}>{it}</li>)}
                    </ul>
                  )}
                </motion.div>
              );
            })}
          </div>
          {slide.note && (
            <motion.p variants={fadeUp} initial="hidden" animate="show" custom={5}
              className="text-emerald-300 font-medium">{slide.note}</motion.p>
          )}
        </div>
      );

    case 'tools':
      return (
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            {slide.tools.map((t, i) => (
              <motion.div key={t} variants={fadeUp} initial="hidden" animate="show" custom={i}
                className="flex items-center gap-3 bg-zinc-800/50 border border-zinc-700/40 rounded-xl px-4 py-3">
                <ScrollText className="text-blue-400 shrink-0" size={18} />
                <span className="text-zinc-200 text-sm">{t}</span>
              </motion.div>
            ))}
          </div>
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4}
            className="flex items-center gap-3 bg-blue-900/30 border border-blue-500/30 rounded-xl px-4 py-3">
            <ShieldCheck className="text-blue-300" size={20} />
            <span className="text-blue-100 font-semibold">{slide.highlight}</span>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { icon: Search, text: slide.steps[0], negative: true },
              { icon: EyeOff, text: slide.steps[1], negative: true },
              { icon: Send, text: slide.steps[2], negative: false },
            ].map((s, i) => (
              <motion.div key={s.text} variants={fadeUp} initial="hidden" animate="show" custom={5 + i}
                className={`flex items-center gap-2 rounded-xl px-4 py-3 border ${s.negative ? 'bg-red-900/20 border-red-500/30' : 'bg-emerald-900/20 border-emerald-500/30'}`}>
                <s.icon size={16} className={s.negative ? 'text-red-400' : 'text-emerald-400'} />
                <span className={`text-sm ${s.negative ? 'text-red-100' : 'text-emerald-100'}`}>{s.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      );

    case 'closing':
      return (
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}
          className="flex flex-col items-center text-center gap-4 py-4">
          <Megaphone className="text-blue-400" size={40} />
          <p className="text-lg md:text-xl text-zinc-100 leading-relaxed max-w-2xl">{slide.message}</p>
        </motion.div>
      );

    default:
      return null;
  }
}

export default SlideVisual;
