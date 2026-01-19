
import React, { useState, useEffect, useMemo } from 'react';
import { StepType, QuizState, QuizStep } from './types';
import { QUIZ_STEPS } from './constants';
import { ChevronRight, Calendar, Lock, Sparkles, CheckCircle2, ShieldCheck, Waves, Quote } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<QuizState>({
    currentStepIndex: 0,
    answers: {},
    birthDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [selection, setSelection] = useState<string[]>([]);

  const currentStep = QUIZ_STEPS[state.currentStepIndex];

  const handleNext = () => {
    if (currentStep.type === StepType.LOADING_ANALYSIS) return;
    if (currentStep.type === StepType.QUESTION && !currentStep.multiple && selection.length === 0) return;
    if (currentStep.type === StepType.DATE_INPUT && !state.birthDate) return;

    const newAnswers = { ...state.answers, [currentStep.id]: currentStep.multiple ? selection : selection[0] };
    
    if (state.currentStepIndex < QUIZ_STEPS.length - 1) {
      setState(prev => ({
        ...prev,
        currentStepIndex: prev.currentStepIndex + 1,
        answers: newAnswers
      }));
      setSelection([]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOptionClick = (optionId: string) => {
    if (currentStep.multiple) {
      setSelection(prev => {
        if (prev.includes(optionId)) return prev.filter(id => id !== optionId);
        if (currentStep.maxSelections && prev.length >= currentStep.maxSelections) return prev;
        return [...prev, optionId];
      });
    } else {
      setSelection([optionId]);
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          currentStepIndex: prev.currentStepIndex + 1,
          answers: { ...prev.answers, [currentStep.id]: optionId }
        }));
        setSelection([]);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 400);
    }
  };

  useEffect(() => {
    if (currentStep.type === StepType.LOADING_ANALYSIS) {
      setLoading(true);
      const timer = setTimeout(() => {
        setLoading(false);
        setState(prev => ({ ...prev, currentStepIndex: prev.currentStepIndex + 1 }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentStep.type]);

  const progress = useMemo(() => {
    return ((state.currentStepIndex + 1) / QUIZ_STEPS.length) * 100;
  }, [state.currentStepIndex]);

  const renderIntro = (step: QuizStep) => (
    <div className="flex flex-col items-center text-center space-y-5 fade-in">
      <div className="w-20 h-20 md:w-24 md:h-24 bg-amber-900/20 rounded-full flex items-center justify-center border border-amber-500/30">
        <Sparkles className="text-amber-500 w-10 h-10 md:w-12 md:h-12" />
      </div>
      <h1 className="text-2xl md:text-4xl font-bold gold-text leading-tight">{step.title}</h1>
      <p className="text-base md:text-lg text-slate-300 whitespace-pre-line leading-relaxed">{step.text}</p>
      <button 
        onClick={handleNext}
        className="w-full md:w-auto mt-4 px-8 py-4 bg-amber-600 hover:bg-amber-500 text-white rounded-2xl font-bold text-lg md:text-xl transition-all shadow-lg flex items-center justify-center gap-2"
      >
        {step.buttonLabel}
        <ChevronRight size={22} />
      </button>
    </div>
  );

  const renderQuestion = (step: QuizStep) => (
    <div className="flex flex-col space-y-5 fade-in">
      <h2 className="text-xl md:text-3xl font-bold text-amber-50 leading-snug">{step.question}</h2>
      {step.multiple && <p className="text-amber-400 text-xs italic">Escolha até {step.maxSelections} áreas.</p>}
      <div className="grid grid-cols-1 gap-3">
        {step.options?.map(option => (
          <button
            key={option.id}
            onClick={() => handleOptionClick(option.id)}
            className={`p-4 md:p-5 text-left rounded-xl border-2 transition-all flex items-center gap-3 text-base md:text-lg
              ${selection.includes(option.id) 
                ? 'border-amber-500 bg-amber-900/30 text-white' 
                : 'border-slate-800 bg-slate-900/50 hover:border-slate-600 text-slate-300'}`}
          >
            <span className="text-xl md:text-2xl shrink-0">{option.label.split(' ')[0]}</span>
            <span className="leading-tight">{option.label.split(' ').slice(1).join(' ')}</span>
          </button>
        ))}
      </div>
      {step.multiple && (
        <button 
          onClick={handleNext}
          disabled={selection.length === 0}
          className="w-full py-4 bg-amber-600 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl font-bold text-lg transition-all shadow-md"
        >
          {step.buttonLabel || 'Continuar'}
        </button>
      )}
    </div>
  );

  const renderTransition = (step: QuizStep) => (
    <div className="flex flex-col space-y-5 fade-in">
      <div className="inline-block px-3 py-1 bg-amber-900/50 text-amber-400 text-[10px] font-bold uppercase tracking-widest rounded-full w-max">
        Sabedoria Ancestral
      </div>
      <h2 className="text-2xl md:text-3xl font-bold gold-text">{step.title}</h2>
      <div className="p-5 bg-slate-900/40 border-l-4 border-amber-500 italic text-slate-200 leading-relaxed text-base md:text-lg whitespace-pre-line">
        {step.text}
      </div>
      <button 
        onClick={handleNext}
        className="w-full md:w-auto px-8 py-4 bg-amber-700 hover:bg-amber-600 text-white rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2"
      >
        {step.buttonLabel}
        <ChevronRight size={20} />
      </button>
    </div>
  );

  const renderDateInput = (step: QuizStep) => (
    <div className="flex flex-col space-y-5 fade-in">
      <div className="flex justify-center">
        <Calendar className="w-14 h-14 text-amber-500" />
      </div>
      <h2 className="text-xl md:text-2xl font-bold text-center text-amber-50 leading-tight">{step.question}</h2>
      <p className="text-center text-slate-400 text-sm px-2">{step.subtitle}</p>
      <div className="w-full">
        <input 
          type="date"
          value={state.birthDate}
          onChange={(e) => setState(prev => ({ ...prev, birthDate: e.target.value }))}
          className="w-full p-4 bg-slate-900 border-2 border-slate-700 rounded-xl text-white text-lg text-center focus:border-amber-500 outline-none appearance-none"
        />
      </div>
      <button 
        onClick={handleNext}
        disabled={!state.birthDate}
        className="w-full py-4 bg-amber-600 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl font-bold text-lg transition-all"
      >
        {step.buttonLabel}
      </button>
    </div>
  );

  const renderLoading = (step: QuizStep) => (
    <div className="flex flex-col items-center justify-center space-y-10 py-6 md:py-10 fade-in text-center">
      <div className="relative w-40 h-40 md:w-48 md:h-48 flex items-center justify-center">
        <div className="absolute inset-0 border-2 border-dashed border-amber-500/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
        <div className="absolute inset-4 border border-amber-500/10 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
        <div className="absolute w-20 h-20 bg-amber-500/5 rounded-full animate-pulse blur-xl"></div>
        <div className="absolute inset-0 animate-[spin_4s_ease-in-out_infinite]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-7 bg-amber-100 rounded-[50%_50%_50%_50%_/_70%_70%_30%_30%] shadow-[0_0_15px_rgba(255,255,255,0.4)] border border-amber-200/50 rotate-45"></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-7 bg-amber-100 rounded-[50%_50%_50%_50%_/_70%_70%_30%_30%] shadow-[0_0_15px_rgba(255,255,255,0.4)] border border-amber-200/50 -rotate-135"></div>
        </div>
        <div className="z-10 bg-[#0d0d0f] p-3 rounded-full border border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
          <Waves className="w-8 h-8 md:w-10 md:h-10 text-amber-500 animate-pulse" />
        </div>
      </div>
      <div className="space-y-3 px-2">
        <h2 className="text-xl md:text-2xl font-bold gold-text animate-pulse">{step.title}</h2>
        <p className="text-slate-400 italic text-sm md:text-base leading-relaxed whitespace-pre-line">{step.text}</p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-[9px] text-amber-500/60 font-bold uppercase tracking-[0.2em]">Conexão estabelecida</span>
        <div className="flex gap-1">
          <div className="w-1 h-1 bg-amber-500 rounded-full animate-bounce"></div>
          <div className="w-1 h-1 bg-amber-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
          <div className="w-1 h-1 bg-amber-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
        </div>
      </div>
    </div>
  );

  const renderPreRevelation = () => (
    <div className="flex flex-col space-y-8 md:space-y-10 fade-in pb-8">
      <div className="text-center space-y-3">
        <div className="inline-block px-3 py-1 bg-amber-900/30 border border-amber-500/30 text-amber-500 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] rounded-full">
          Conclusão do Ritual Espiritual
        </div>
        <h2 className="text-2xl md:text-5xl font-bold gold-text leading-tight px-1">
          ✨ Finalize o Ritual e Descubra o Nome do Seu Orixá ✨
        </h2>
        <p className="text-slate-300 text-base md:text-lg px-2 max-w-lg mx-auto italic leading-relaxed">
          Seu padrão espiritual já foi identificado pela sua data de nascimento.
        </p>
      </div>

      <div className="bg-slate-900/60 p-5 md:p-8 rounded-3xl border border-amber-500/20 space-y-5">
        <p className="text-slate-100 font-semibold text-sm md:text-base">O Pai Tomé vai jogar os búzios para receber:</p>
        <div className="grid grid-cols-1 gap-3">
          {[
            { text: "O nome exato do seu Orixá regente", icon: <CheckCircle2 className="text-amber-500" /> },
            { text: "O ponto sagrado (cântico) que o(a) ativa", icon: <CheckCircle2 className="text-amber-500" /> },
            { text: "A orientação para prosperidade e proteção", icon: <CheckCircle2 className="text-amber-500" /> }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 bg-slate-950/40 p-3 md:p-4 rounded-xl border border-slate-800">
              <span className="shrink-0">{item.icon}</span>
              <span className="text-slate-200 text-xs md:text-sm font-semibold">{item.text}</span>
            </div>
          ))}
        </div>
        <p className="text-red-400 text-[10px] md:text-xs font-bold leading-tight">
          ⚠️ Isso não é revelado automaticamente. A resposta vem do jogo sagrado.
        </p>
      </div>

      <div className="space-y-4 text-slate-300 text-sm md:text-base leading-relaxed px-1">
        <h3 className="text-lg md:text-xl font-bold text-amber-50 underline decoration-amber-500/30 underline-offset-8">
          🔮 O QUE ACONTECE APÓS O PAGAMENTO
        </h3>
        <ul className="space-y-3 list-none italic text-xs md:text-sm">
          <li className="flex gap-2"><span>🧿</span> <strong>Pai Tomé senta diante dos búzios</strong></li>
          <li className="flex gap-2"><span>🕯️</span> Consulta os Orixás pelo seu nome e data</li>
          <li className="flex gap-2"><span>🎶</span> Identifica o seu ponto sagrado pessoal</li>
        </ul>
        <div className="bg-amber-900/20 border-l-4 border-amber-500 p-3 md:p-4 text-slate-200 text-xs md:text-sm italic">
          Ninguém prospera vivendo desalinhado do próprio Orixá. Dinheiro, amor e paz só fluem quando você caminha com quem te rege.
        </div>
      </div>

      <div className="bg-amber-950/20 border border-amber-600/30 p-6 md:p-8 rounded-3xl text-center space-y-4">
        <h3 className="text-base md:text-xl font-bold gold-text tracking-widest uppercase">🧿 LEI DA TROCA</h3>
        <p className="text-slate-300 text-xs md:text-sm leading-relaxed italic">
          No Candomblé, nenhuma revelação acontece sem troca energética.
        </p>
        <div className="py-3 border-y border-amber-900/50">
          <p className="text-xl md:text-2xl font-bold text-amber-500">💰 Contribuição de R$ 20</p>
          <p className="text-[9px] text-slate-500 mt-1 uppercase tracking-tighter italic">ou o valor que o seu coração mandar</p>
        </div>
        <p className="text-slate-400 text-xs font-medium">
          A intenção é o que fortalece o axé.
        </p>
      </div>

      <div className="space-y-5 px-1">
        <h3 className="text-base md:text-xl font-bold text-center text-amber-50 uppercase tracking-widest">🗣️ RELATOS REAIS</h3>
        <div className="grid grid-cols-1 gap-3">
          {[
            { name: "Rosane, SP", text: "Descobrir meu Orixá destravou tudo. Me sinto mais protegida e o dinheiro fluiu." },
            { name: "Marcelo, RJ", text: "Minha vida mudou completamente. Hoje sei como me conectar de verdade." }
          ].map((t, i) => (
            <div key={i} className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 relative">
              <Quote className="absolute top-2 right-2 text-amber-900 opacity-20" size={24} />
              <p className="text-slate-400 text-xs italic leading-relaxed">"{t.text}"</p>
              <p className="text-amber-600 font-bold text-[10px] uppercase mt-2">— {t.name}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full max-w-lg mx-auto space-y-5 px-1">
        <button 
          onClick={() => window.location.href = 'https://pay.hotmart.com/example'}
          className="w-full py-5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-2xl font-bold text-lg md:text-2xl transition-all shadow-xl flex flex-col items-center justify-center leading-tight active:scale-95"
        >
          <span>👉 Concluir o Ritual Agora</span>
          <span className="text-[9px] md:text-[10px] opacity-80 font-normal uppercase mt-1 tracking-widest">Revelação imediata após o jogo</span>
        </button>
        
        <div className="flex items-center justify-center gap-6 opacity-40 grayscale text-[9px] md:text-[10px]">
          <div className="flex items-center gap-1">
            <ShieldCheck size={14} />
            <span className="font-bold uppercase">Pagamento Seguro</span>
          </div>
          <div className="flex items-center gap-1">
            <Lock size={14} />
            <span className="font-bold uppercase">Privacidade Total</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center p-3 md:p-8">
      {/* Progress Bar Fixo/Topo no Mobile */}
      <div className="w-full max-w-xl mb-6 sticky top-0 z-20 py-2 ritual-bg md:relative md:top-auto">
        <div className="flex justify-between items-center mb-2 px-1">
          <div className="text-amber-600 font-bold tracking-widest uppercase text-[9px]">Pai Tomé • Búzios</div>
          <div className="text-slate-500 text-[9px] font-medium tracking-widest uppercase">Passo {state.currentStepIndex + 1} de {QUIZ_STEPS.length}</div>
        </div>
        <div className="w-full bg-slate-900/50 h-1 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-amber-700 via-amber-500 to-amber-700 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(245,158,11,0.5)]" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <main className="w-full max-w-xl bg-[#0d0d0f]/90 backdrop-blur-xl border border-slate-800/40 p-5 md:p-12 rounded-[2rem] md:rounded-[3rem] shadow-2xl relative overflow-visible">
        {currentStep.type === StepType.INTRO && renderIntro(currentStep)}
        {currentStep.type === StepType.QUESTION && renderQuestion(currentStep)}
        {currentStep.type === StepType.TRANSITION && renderTransition(currentStep)}
        {currentStep.type === StepType.DATE_INPUT && renderDateInput(currentStep)}
        {currentStep.type === StepType.LOADING_ANALYSIS && renderLoading(currentStep)}
        {currentStep.type === StepType.PRE_REVELATION && renderPreRevelation()}
      </main>

      <footer className="mt-8 mb-6 text-slate-600 text-[9px] font-bold tracking-[0.2em] flex items-center gap-2 opacity-40 uppercase">
        <div className="w-1 h-1 rounded-full bg-amber-700"></div>
        Tradição Babalorixá de Pai Tomé
        <div className="w-1 h-1 rounded-full bg-amber-700"></div>
      </footer>
    </div>
  );
};

export default App;
