
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { StepType, QuizState, QuizStep } from './types';
import { QUIZ_STEPS } from './constants';
import { ChevronRight, Calendar, Lock, CheckCircle2, ShieldCheck, Waves, Quote, Sparkles, Target, Zap } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<QuizState>({
    currentStepIndex: 0,
    answers: {},
    birthDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [selection, setSelection] = useState<string[]>([]);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Trilha sonora Zen constante
    audioRef.current = new Audio('https://assets.mixkit.co/music/preview/mixkit-deep-meditation-109.mp3'); 
    audioRef.current.loop = true;
    audioRef.current.volume = 0.15;

    // Som de clique suave
    clickSoundRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
    clickSoundRef.current.volume = 0.2;

    const startAudio = () => {
      audioRef.current?.play().catch(() => {});
      document.removeEventListener('click', startAudio);
    };
    document.addEventListener('click', startAudio);

    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
      document.removeEventListener('click', startAudio);
    };
  }, []);

  const playClick = () => {
    if (clickSoundRef.current) {
      clickSoundRef.current.currentTime = 0;
      clickSoundRef.current.play().catch(() => {});
    }
  };

  const currentStep = QUIZ_STEPS[state.currentStepIndex];

  const handleNext = () => {
    playClick();
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
    playClick();
    if (currentStep.multiple) {
      setSelection(prev => {
        if (prev.includes(optionId)) return prev.filter(id => id !== optionId);
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
      }, 300);
    }
  };

  useEffect(() => {
    if (currentStep.type === StepType.LOADING_ANALYSIS) {
      setLoading(true);
      const timer = setTimeout(() => {
        setLoading(false);
        setState(prev => ({ ...prev, currentStepIndex: prev.currentStepIndex + 1 }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [currentStep.type]);

  const progress = useMemo(() => ((state.currentStepIndex + 1) / QUIZ_STEPS.length) * 100, [state.currentStepIndex]);

  const renderIntro = (step: QuizStep) => (
    <div className="flex flex-col items-center text-center space-y-4 fade-in">
      <div className="space-y-1">
        <span className="text-amber-600 font-bold tracking-[0.3em] text-[8px] uppercase">Portal Sagrado</span>
        <h2 className="text-2xl md:text-4xl font-bold gold-text cinzel leading-tight">
          Os Orixás Guiam a Sua Vida!
        </h2>
      </div>
      <p className="text-sm md:text-lg text-slate-300 italic font-light max-w-sm mx-auto leading-relaxed">
        {step.text}
      </p>
      <button 
        onClick={handleNext}
        className="w-full md:w-auto px-8 py-3 bg-amber-600 text-white rounded-full font-bold text-base shadow-lg active:scale-95 flex items-center justify-center gap-2 mt-2"
      >
        <span>👉 Começar agora</span>
        <ChevronRight size={16} />
      </button>
    </div>
  );

  const renderQuestion = (step: QuizStep) => (
    <div className="flex flex-col space-y-4 fade-in">
      <h2 className="text-lg md:text-xl font-bold text-amber-50 leading-snug text-center cinzel">{step.question}</h2>
      <div className="grid grid-cols-1 gap-2 w-full">
        {step.options?.map(option => (
          <button
            key={option.id}
            onClick={() => handleOptionClick(option.id)}
            className={`p-3 md:p-4 text-left rounded-xl border transition-all flex items-center gap-3
              ${selection.includes(option.id) 
                ? 'border-amber-500 bg-amber-950/20 text-white' 
                : 'border-slate-800/50 bg-slate-900/40 text-slate-300'}`}
          >
            <span className="text-xl shrink-0">{option.label.split(' ')[0]}</span>
            <span className="text-sm md:text-base font-medium flex-1">{option.label.split(' ').slice(1).join(' ')}</span>
          </button>
        ))}
      </div>
      {step.multiple && (
        <button 
          onClick={handleNext}
          className="w-full py-4 bg-amber-600 text-white rounded-full font-bold text-base shadow-md active:scale-95 mt-2"
        >
          <span>Continuar ➡️</span>
        </button>
      )}
    </div>
  );

  const renderTransition = (step: QuizStep) => (
    <div className="flex flex-col space-y-4 fade-in items-center text-center">
      <h2 className="text-xl md:text-2xl font-bold gold-text cinzel">{step.title}</h2>
      <div className="p-4 bg-slate-900/40 border-l-2 border-amber-600 rounded-r-xl italic text-slate-200 text-sm md:text-base leading-relaxed">
        {step.text}
      </div>
      <button onClick={handleNext} className="w-full md:w-auto px-8 py-3 bg-amber-700 text-white rounded-full font-bold text-base shadow-md active:scale-95 mt-2">
        <span>Prosseguir ➡️</span>
      </button>
    </div>
  );

  const renderDateInput = (step: QuizStep) => (
    <div className="flex flex-col space-y-6 fade-in items-center">
      <Calendar className="w-10 h-10 text-amber-600 opacity-80" />
      <div className="space-y-2 text-center">
        <h2 className="text-lg md:text-xl font-bold text-amber-50 cinzel">{step.question}</h2>
        <p className="text-slate-400 text-xs italic">{step.subtitle}</p>
      </div>
      <input 
        type="date"
        value={state.birthDate}
        onChange={(e) => setState(prev => ({ ...prev, birthDate: e.target.value }))}
        className="w-full max-w-xs p-4 bg-slate-900/60 border border-slate-700 rounded-xl text-white text-lg text-center outline-none shadow-md"
      />
      <button onClick={handleNext} disabled={!state.birthDate} className="w-full md:w-auto px-10 py-4 bg-amber-600 disabled:bg-slate-800 text-white rounded-full font-bold text-base shadow-md">
        <span>Consultar Axé 🔮</span>
      </button>
    </div>
  );

  const renderLoading = (step: QuizStep) => (
    <div className="flex flex-col items-center justify-center space-y-6 py-8 fade-in text-center">
      <Waves className="w-12 h-12 text-amber-600 animate-pulse" />
      <div className="space-y-2">
        <h2 className="text-xl font-bold gold-text animate-pulse cinzel uppercase">{step.title}</h2>
        <p className="text-slate-400 italic text-sm max-w-xs mx-auto">{step.text}</p>
      </div>
    </div>
  );

  const renderPreRevelation = () => (
    <div className="flex flex-col space-y-8 fade-in pb-8">
      {/* HERO SECTION */}
      <div className="text-center space-y-4 pt-2">
        <h1 className="text-2xl md:text-4xl font-bold gold-text cinzel leading-tight">
          Revelação do Orixá Regente & Despertar da Prosperidade
        </h1>
        <div className="p-4 bg-amber-950/20 rounded-2xl border border-amber-900/30">
          <p className="text-slate-200 text-base md:text-lg leading-relaxed font-bold">
            **Seu caminho espiritual não está errado. Ele só está desalinhado.**
          </p>
        </div>
        <p className="text-slate-400 text-sm md:text-base leading-relaxed">
          O quiz identificou uma força específica que rege sua vida — enquanto não se conectar com ela, a prosperidade e a paz não fluirão.
        </p>
        <p className="text-amber-500 font-bold text-sm">
          👉 Agora é o momento de revelar quem caminha ao seu lado desde o nascimento.
        </p>
      </div>

      {/* ESPELHAMENTO */}
      <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-amber-100 font-bold text-sm uppercase tracking-widest text-center">Você se reconheceu aqui?</h3>
        <div className="grid grid-cols-1 gap-2">
          {[
            "Sente que sua vida anda, mas sempre trava",
            "Repete problemas mesmo mudando de atitude",
            "Tenta se conectar, mas sente que algo não responde",
            "Desconfia de um bloqueio espiritual invisível"
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 text-slate-300 text-sm">
              <Target size={14} className="text-amber-600 shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
        <p className="text-center text-amber-500 font-bold text-xs pt-2">⚠️ Isso não é fraqueza. É desalinhamento.</p>
      </div>

      {/* A VERDADE */}
      <div className="space-y-4 text-center">
        <h3 className="text-xl font-bold text-amber-50 cinzel">🧠 A VERDADE QUE NÃO TE CONTAM</h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          Pessoas esforçadas vivem abaixo do que poderiam porque pedem ajuda no escuro, conectando-se com forças que não são as suas.
        </p>
        <div className="p-4 bg-black/40 rounded-2xl border border-amber-900/20 italic text-amber-500 text-sm font-bold">
          👉 Quem não sabe quem o rege, sente que a vida nunca “encaixa”.
        </div>
      </div>

      {/* MECANISMO REAL */}
      <div className="bg-amber-950/10 p-6 rounded-3xl border border-amber-600/10 space-y-4">
        <h3 className="text-lg font-bold gold-text text-center cinzel">🔑 MECANISMO DA PROSPERIDADE</h3>
        <p className="text-slate-200 text-sm leading-relaxed">
          Ao descobrir seu Orixá e o ponto sagrado, você para de remar contra a maré e começa a fluir. Isso desperta a prosperidade real.
        </p>
      </div>

      {/* O QUE VAI ACONTECER */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-amber-50 text-center uppercase tracking-widest cinzel">🧿 O RITUAL DE CLAREZA</h3>
        <div className="grid grid-cols-1 gap-3">
          {[
            { icon: <Zap size={16}/>, t: "Jogo de búzios real com seu nome" },
            { icon: <Zap size={16}/>, t: "Nome exato do seu Orixá regente" },
            { icon: <Zap size={16}/>, t: "Revelação do seu Ponto Sagrado" },
            { icon: <Zap size={16}/>, t: "Primeiros passos para ativar a conexão" }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
              <div className="text-amber-500">{item.icon}</div>
              <span className="text-slate-100 text-sm">{item.t}</span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-center text-slate-500 italic">⚠️ Isso não é feito por sistema. A resposta vem do jogo real.</p>
      </div>

      {/* HISTORIAS CURTAS */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-center text-amber-50 cinzel pt-4">HISTÓRIAS DE AXÉ</h3>
        <div className="grid grid-cols-1 gap-3">
          {[
            { name: "Helena S.", text: "Minha vida estava travada. Ao descobrir meu Orixá, entendi meu erro. Na mesma semana, as portas se abriram.", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&q=80" },
            { name: "Carlos E.", text: "Sempre fui cético, mas o diagnóstico foi certeiro. Descobrir minha força regente me deu a direção certa.", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80" }
          ].map((t, i) => (
            <div key={i} className="bg-slate-900/40 p-4 rounded-2xl flex items-center gap-4 border border-slate-800/40">
              <img src={t.img} alt={t.name} className="w-12 h-12 rounded-full border border-amber-600/30 object-cover" />
              <div className="flex-1 text-left">
                <p className="text-slate-300 italic text-xs leading-snug">"{t.text}"</p>
                <p className="text-amber-600 font-bold text-[9px] uppercase tracking-widest">— {t.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LEI DA TROCA */}
      <div className="bg-amber-950/20 border border-amber-600/30 p-6 rounded-[2rem] text-center space-y-4">
        <h3 className="text-lg font-bold gold-text uppercase cinzel">🧿 LEI DA TROCA (AXÉ)</h3>
        <p className="text-slate-300 text-xs italic">
          Não existe revelação sem troca energética. Sua contribuição mantém o terreiro e os búzios consagrados vivos.
        </p>
        <div className="py-4 border-y border-amber-900/20">
          <p className="text-4xl font-bold text-amber-500">R$ 20,00</p>
          <p className="text-[9px] text-amber-400/50 uppercase mt-1 font-bold">Oferenda Única de Gratidão</p>
        </div>
      </div>

      {/* CTA FINAL */}
      <div className="w-full max-w-sm mx-auto space-y-4 text-center">
        <button 
          onClick={() => {
            playClick();
            window.location.href = 'https://pay.hotmart.com/example';
          }}
          className="w-full py-6 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-full font-bold text-lg shadow-xl active:scale-95 flex flex-col items-center justify-center"
        >
          <span>👉 Concluir Ritual e Receber Revelação</span>
          <span className="text-[9px] opacity-80 font-normal uppercase mt-1 tracking-widest">Ative sua prosperidade agora</span>
        </button>
        <p className="text-xs text-slate-500 font-light italic px-4">
          Você já chegou até aqui. Não deixe que o desalinhamento continue guiando seus passos.
        </p>
        <div className="flex items-center justify-center gap-6 opacity-40 text-[9px] font-bold uppercase pb-4">
          <div className="flex items-center gap-1"><ShieldCheck size={14} /><span>Seguro</span></div>
          <div className="flex items-center gap-1"><Lock size={14} /><span>Sigilo</span></div>
        </div>
      </div>

      {/* FECHAMENTO EMOCIONAL */}
      <div className="text-center space-y-2 border-t border-slate-900 pt-6">
        <p className="text-amber-100 text-sm italic font-light">"Você não nasceu para viver no escuro. Você nasceu para caminhar com a força que te rege."</p>
        <p className="gold-text font-bold text-xl cinzel tracking-widest">Axé.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center px-4 md:px-6 py-2">
      {/* PROGRESSO COMPACTO */}
      <div className="w-full max-w-xl mb-2 sticky top-0 z-20 py-2 ritual-bg">
        <div className="flex justify-between items-center mb-1 px-4">
          <div className="text-amber-800 font-bold tracking-widest uppercase text-[8px] cinzel">Pai Tomé</div>
          <div className="text-slate-600 text-[8px] font-bold uppercase">{state.currentStepIndex + 1}/{QUIZ_STEPS.length}</div>
        </div>
        <div className="w-full bg-slate-900/50 h-1 rounded-full overflow-hidden border border-slate-800/30">
          <div className="h-full bg-amber-500 transition-all duration-700 rounded-full" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <main className="w-full max-w-xl bg-[#09090b]/98 backdrop-blur-lg border border-slate-800/40 p-5 md:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden my-auto">
        {currentStep.type === StepType.INTRO && renderIntro(currentStep)}
        {currentStep.type === StepType.QUESTION && renderQuestion(currentStep)}
        {currentStep.type === StepType.TRANSITION && renderTransition(currentStep)}
        {currentStep.type === StepType.DATE_INPUT && renderDateInput(currentStep)}
        {currentStep.type === StepType.LOADING_ANALYSIS && renderLoading(currentStep)}
        {currentStep.type === StepType.PRE_REVELATION && renderPreRevelation()}
      </main>

      <footer className="mt-4 mb-4 text-slate-800 text-[8px] font-bold tracking-[0.4em] flex items-center gap-3 opacity-30 uppercase">
        <div className="w-1 h-1 rounded-full bg-amber-950"></div>
        Tradição Babalorixá
        <div className="w-1 h-1 rounded-full bg-amber-950"></div>
      </footer>
    </div>
  );
};

export default App;
