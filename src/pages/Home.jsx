import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ShieldCheck } from 'lucide-react';
import logo from '../assets/logitranslogo.png';
import { courseInfo, slides } from '../data/slides';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#09090b] relative overflow-hidden">
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />

      <header className="relative px-4 md:px-8 pt-6">
        <div className="flex items-center gap-3 bg-white/5 ring-1 ring-zinc-700 rounded-xl px-4 py-3 w-fit">
          <div className="bg-white h-10 w-10 rounded-lg flex items-center justify-center p-1">
            <img src={logo} alt="Logo Logitrans" className="w-full h-full object-contain" />
          </div>
          <div>
            <p className="text-lg font-black tracking-tight bg-gradient-to-r from-white via-blue-100 to-emerald-100 bg-clip-text text-transparent">
              LOGITRANS
            </p>
            <p className="text-xs text-slate-400">Transformamos el presente, construimos el futuro.</p>
          </div>
        </div>
      </header>

      <main className="relative w-[92%] max-w-4xl mx-auto pt-14 pb-16">
        <p className="text-zinc-400 text-2xl md:text-4xl font-extralight mb-0">FORMACIONES</p>
        <p className="bg-gradient-to-br from-zinc-200 to-zinc-500 bg-clip-text text-5xl md:text-7xl font-bold tracking-tight text-transparent leading-none mb-8">
          2027
        </p>

        <div
          onClick={() => navigate('/curso/sarlaft-2026')}
          className="group cursor-pointer relative overflow-hidden rounded-3xl transition-transform duration-500 hover:scale-[1.01]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/80 via-zinc-900/60 to-zinc-950/80 backdrop-blur-sm" />
          <div className="absolute inset-0 rounded-3xl border border-zinc-700/50" />
          <div className="relative p-6 md:p-8 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-900/50 shrink-0">
                <ShieldCheck size={24} className="text-blue-300" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-zinc-100">{courseInfo.title}</h3>
                <p className="text-zinc-400 text-sm md:text-base">{courseInfo.subtitle}</p>
                <p className="text-zinc-500 text-xs mt-1">
                  {courseInfo.totalDuration} · {slides.length} diapositivas + quiz
                </p>
              </div>
            </div>
            <ChevronRight className="text-zinc-500 group-hover:text-white group-hover:translate-x-1 transition-all" size={22} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
