
import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Check, Wallet, Target, Sparkles, TrendingUp, Shield } from 'lucide-react';

interface Props {
  store: any;
}

const Onboarding: React.FC<Props> = ({ store }) => {
  const { setUser, addBill, addGoal } = store;
  const [step, setStep] = useState(1);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Form State
  const [incomeSource, setIncomeSource] = useState('');
  const [militaryMode, setMilitaryMode] = useState<boolean | null>(null);
  const [salary, setSalary] = useState('');
  const [extraIncome, setExtraIncome] = useState('');
  const [selectedBills, setSelectedBills] = useState<string[]>([]);
  const [mainObjective, setMainObjective] = useState('');
  const [buyTarget, setBuyTarget] = useState('');

  const totalSteps = 13;
  const progress = (step / totalSteps) * 100;

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => {
      setFeedback(null);
      setStep(s => Math.min(s + 1, totalSteps));
    }, 1500);
  };

  const nextStep = () => {
    setStep(s => Math.min(s + 1, totalSteps));
  };

  const billOptions = [
    { name: 'Aluguel', amount: 800 },
    { name: 'Luz', amount: 150 },
    { name: 'Água', amount: 80 },
    { name: 'Internet', amount: 100 },
    { name: 'Cartão de crédito', amount: 500 },
    { name: 'Empréstimos / Consignados', amount: 300 },
    { name: 'Escola', amount: 400 },
    { name: 'Outras', amount: 50 }
  ];

  const finish = () => {
    setUser((prev: any) => ({
      ...prev,
      salary: parseFloat(salary) || 0,
      extraIncome: parseFloat(extraIncome) || 0,
      militaryMode: !!militaryMode,
      hasCompletedOnboarding: true,
      name: incomeSource === 'Militar' || militaryMode ? 'Soldado das Finanças' : 'Guerreiro da Disciplina'
    }));

    selectedBills.forEach(billName => {
      const option = billOptions.find(o => o.name === billName);
      addBill({
        name: billName,
        amount: option?.amount || 0,
        dueDate: 10
      });
    });

    if (mainObjective) {
      addGoal({
        name: buyTarget || mainObjective,
        target: 1000,
        icon: buyTarget ? '🎁' : '💰'
      });
    }
  };

  const renderContent = () => {
    if (feedback) {
      return (
        <div className="flex flex-col items-center justify-center h-full animate-in fade-in zoom-in duration-500 text-center space-y-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600">
            <Check size={40} />
          </div>
          <h3 className="text-2xl font-black text-gray-800">{feedback}</h3>
        </div>
      );
    }

    switch (step) {
      case 1:
        return (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white leading-tight">Como você recebe seu dinheiro?</h2>
            <div className="grid gap-3">
              {['Salário (CLT)', 'Autônomo / MEI', 'Militar', 'Outro'].map(opt => (
                <button
                  key={opt}
                  onClick={() => { 
                    setIncomeSource(opt); 
                    if (opt === 'Militar') setMilitaryMode(true);
                    showFeedback('Boa escolha!'); 
                  }}
                  className="p-5 rounded-2xl border-2 border-gray-100 text-left font-bold text-gray-700 dark:text-zinc-200 hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all active:scale-95"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-in slide-in-from-right">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white">Com que frequência você recebe?</h2>
            <div className="grid gap-3">
              {['Mensal', 'Quinzenal', 'Semanal'].map(opt => (
                <button
                  key={opt}
                  onClick={() => { nextStep(); }}
                  className="p-5 rounded-2xl border-2 border-gray-100 text-left font-bold text-gray-700 dark:text-zinc-200 hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-in slide-in-from-right">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Shield size={32} />
            </div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white leading-tight">Você quer ativar o Modo Militar?</h2>
            <p className="text-sm text-gray-500 dark:text-zinc-500">Interface focada em disciplina, ordens diretas e alertas de missão.</p>
            <div className="grid gap-3 pt-4">
              <button
                onClick={() => { setMilitaryMode(true); showFeedback('Entendido, Senhor!'); }}
                className="p-5 rounded-2xl bg-green-600 text-white font-black uppercase tracking-widest shadow-lg shadow-green-500/30 active:scale-95 transition-all"
              >
                Sim, Ativar Missão
              </button>
              <button
                onClick={() => { setMilitaryMode(false); nextStep(); }}
                className="p-5 rounded-2xl border-2 border-gray-100 dark:border-zinc-800 font-bold text-gray-500 dark:text-zinc-400"
              >
                Não, prefiro o padrão
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 animate-in slide-in-from-right">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white leading-tight">Quanto você recebe por mês?</h2>
            <p className="text-sm text-gray-500 dark:text-zinc-500">Valor aproximado do seu salário ou pró-labore.</p>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-400 text-2xl">R$</span>
              <input
                type="number"
                placeholder="0,00"
                value={salary}
                onChange={e => setSalary(e.target.value)}
                className="w-full p-6 pl-16 rounded-2xl border-2 border-gray-100 dark:border-zinc-800 dark:bg-zinc-900 text-4xl font-black text-gray-900 dark:text-white outline-none focus:border-blue-500 transition-all"
                autoFocus
              />
            </div>
            <button
              onClick={nextStep}
              disabled={!salary}
              className="w-full bg-blue-600 text-white p-5 rounded-2xl font-bold disabled:opacity-30 disabled:grayscale"
            >
              Continuar
            </button>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6 animate-in slide-in-from-right">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white">Você tem renda extra?</h2>
            <div className="grid gap-4">
              <button onClick={() => { setExtraIncome('0'); nextStep(); }} className="p-5 rounded-2xl border-2 border-gray-100 dark:border-zinc-800 font-bold text-gray-500 dark:text-zinc-400 text-left">Não, apenas meu fixo</button>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-gray-400 dark:text-zinc-600 ml-2">Sim, valor médio:</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">R$</span>
                  <input
                    type="number"
                    placeholder="Valor extra mensal"
                    value={extraIncome}
                    onChange={e => setExtraIncome(e.target.value)}
                    className="w-full p-5 pl-12 rounded-2xl border-2 border-gray-100 dark:border-zinc-800 dark:bg-zinc-900 font-bold outline-none focus:border-blue-500 dark:text-white"
                  />
                </div>
              </div>
              {extraIncome && <button onClick={nextStep} className="w-full bg-blue-600 text-white p-5 rounded-2xl font-bold">Continuar</button>}
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-6 animate-in slide-in-from-right">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white">Quais contas você paga todo mês?</h2>
            <div className="grid grid-cols-2 gap-2 max-h-[50vh] overflow-y-auto pr-2 pb-4">
              {billOptions.map(opt => (
                <button
                  key={opt.name}
                  onClick={() => setSelectedBills(prev => prev.includes(opt.name) ? prev.filter(x => x !== opt.name) : [...prev, opt.name])}
                  className={`p-4 rounded-xl border-2 text-[11px] font-bold uppercase transition-all flex flex-col items-center gap-2 text-center ${selectedBills.includes(opt.name) ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' : 'border-gray-100 dark:border-zinc-800 text-gray-400'}`}
                >
                  <Check size={16} className={selectedBills.includes(opt.name) ? 'opacity-100' : 'opacity-0'} />
                  {opt.name}
                </button>
              ))}
            </div>
            <button onClick={() => { showFeedback('Entendido!'); }} className="w-full bg-blue-600 text-white p-5 rounded-2xl font-bold">Configurar estas contas</button>
          </div>
        );
      case 7:
        return (
          <div className="space-y-6 animate-in slide-in-from-right">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white leading-tight">Quanto do seu dinheiro você já tem comprometido?</h2>
            <div className="grid gap-3">
              {['Menos de 30%', 'Entre 30% e 50%', 'Mais de 50%', 'Não sei'].map(opt => (
                <button
                  key={opt}
                  onClick={() => { nextStep(); }}
                  className="p-5 rounded-2xl border-2 border-gray-100 dark:border-zinc-800 text-left font-bold text-gray-700 dark:text-zinc-300 hover:border-blue-600"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        );
      case 8:
        return (
          <div className="space-y-6 animate-in slide-in-from-right">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white">Fica sem dinheiro antes do fim do mês?</h2>
            <div className="grid gap-3">
              {['Sempre', 'Às vezes', 'Raramente', 'Nunca'].map(opt => (
                <button
                  key={opt}
                  onClick={() => { nextStep(); }}
                  className="p-5 rounded-2xl border-2 border-gray-100 dark:border-zinc-800 text-left font-bold text-gray-700 dark:text-zinc-300"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        );
      case 9:
        return (
          <div className="space-y-6 animate-in slide-in-from-right">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white">Qual é sua maior dificuldade hoje?</h2>
            <div className="grid gap-3">
              {['Organizar gastos', 'Pagar dívidas', 'Guardar dinheiro', 'Controlar cartão', 'Tudo isso'].map(opt => (
                <button
                  key={opt}
                  onClick={() => { showFeedback('Vamos te ajudar!'); }}
                  className="p-5 rounded-2xl border-2 border-gray-100 dark:border-zinc-800 text-left font-bold text-gray-700 dark:text-zinc-300"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        );
      case 10:
        return (
          <div className="space-y-6 animate-in slide-in-from-right">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white">O que você mais quer alcançar?</h2>
            <div className="grid gap-3">
              {['Sair do vermelho', 'Organizar o mês', 'Guardar dinheiro', 'Comprar algo específico'].map(opt => (
                <button
                  key={opt}
                  onClick={() => {
                    setMainObjective(opt);
                    if (opt === 'Comprar algo específico') nextStep();
                    else showFeedback('Isso é possível!');
                  }}
                  className="p-5 rounded-2xl border-2 border-gray-100 dark:border-zinc-800 text-left font-bold text-gray-700 dark:text-zinc-300"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        );
      case 11:
        return (
          <div className="space-y-6 animate-in slide-in-from-right">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white">O que você quer comprar?</h2>
            <input
              type="text"
              placeholder="Ex: Minha viagem, Moto nova..."
              value={buyTarget}
              onChange={e => setBuyTarget(e.target.value)}
              className="w-full p-6 rounded-2xl border-2 border-gray-100 dark:border-zinc-800 dark:bg-zinc-900 text-2xl font-bold outline-none focus:border-blue-500 dark:text-white"
              autoFocus
            />
            <button onClick={nextStep} disabled={!buyTarget} className="w-full bg-blue-600 text-white p-5 rounded-2xl font-bold disabled:opacity-30">Definir Meta</button>
          </div>
        );
      case 12:
        return (
          <div className="space-y-6 animate-in slide-in-from-right">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white">Quantos dias por semana abrirá o app?</h2>
            <div className="grid gap-3">
              {['1–2 dias', '3–4 dias', 'Todos os dias'].map(opt => (
                <button
                  key={opt}
                  onClick={() => { nextStep(); }}
                  className="p-5 rounded-2xl border-2 border-gray-100 dark:border-zinc-800 text-left font-bold text-gray-700 dark:text-zinc-300"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        );
      case 13:
        return (
          <div className="space-y-8 animate-in zoom-in duration-500">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-blue-600 rounded-3xl mx-auto flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                <Sparkles size={40} />
              </div>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white leading-tight">Plano Personalizado</h2>
              <p className="text-gray-500 font-medium">Com base nas suas respostas, criamos seu ambiente financeiro.</p>
            </div>

            <div className="bg-white dark:bg-zinc-900 border-2 border-gray-50 dark:border-zinc-800 rounded-3xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-green-50 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                  <Wallet size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black text-gray-400 dark:text-zinc-600">Renda Mensal</p>
                  <p className="font-bold dark:text-white">R$ {(parseFloat(salary) + (parseFloat(extraIncome) || 0)).toLocaleString('pt-BR')}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black text-gray-400 dark:text-zinc-600">Contas Mapeadas</p>
                  <p className="font-bold dark:text-white">{selectedBills.length} itens no checklist</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <Target size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black text-gray-400 dark:text-zinc-600">Objetivo</p>
                  <p className="font-bold dark:text-white">{buyTarget || mainObjective}</p>
                </div>
              </div>
            </div>

            <button
              onClick={finish}
              className="w-full bg-blue-600 text-white p-6 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-500/30 active:scale-95 transition-all"
            >
              Começar meu controle
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col max-w-md mx-auto relative overflow-hidden">
      <div className="h-2 w-full bg-gray-100 dark:bg-zinc-900">
        <div
          className="h-full bg-blue-600 transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="p-8 flex-1 flex flex-col justify-center overflow-y-auto">
        {renderContent()}
      </div>

      {!feedback && step < totalSteps && (
        <div className="p-8 flex justify-between items-center bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border-t border-gray-50 dark:border-zinc-800">
          <div className="flex items-center gap-4">
            {step > 1 && (
              <button
                onClick={() => setStep(s => Math.max(1, s - 1))}
                className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500 flex items-center gap-1 hover:opacity-70"
              >
                <ChevronLeft size={14} /> Voltar
              </button>
            )}
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500">
              Etapa {step} de {totalSteps}
            </span>
          </div>
          <button
            onClick={() => setStep(s => Math.min(s + 1, totalSteps))}
            className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:opacity-70"
          >
            Pular <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Onboarding;
