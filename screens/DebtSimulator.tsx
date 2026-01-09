
import React, { useState } from 'react';
import { Debt } from '../types';
import { ShieldAlert, Info, TrendingDown, Plus, X, Calculator, Check } from 'lucide-react';

interface Props { store: any; }

const DebtSimulator: React.FC<Props> = ({ store }) => {
  const { debts, user, addDebt } = store;
  const [isAdding, setIsAdding] = useState(false);
  const [simAmount, setSimAmount] = useState('');
  const [simRes, setSimRes] = useState<number | null>(null);

  // Form State for new debt
  const [newName, setNewName] = useState('');
  const [newTotal, setNewTotal] = useState('');
  const [newInst, setNewInst] = useState('');

  const totalDebt = debts.reduce((acc: number, d: Debt) => acc + d.remaining, 0);

  const handleSimulate = () => {
    const val = parseFloat(simAmount);
    if (!isNaN(val)) {
       const balance = (user.salary + user.extraIncome + user.benefits) - val;
       setSimRes(balance);
    }
  };

  const handleAddDebt = () => {
    if (newName && newTotal && newInst) {
      addDebt({
        name: newName,
        total: parseFloat(newTotal),
        remaining: parseFloat(newTotal),
        installments: parseInt(newInst),
        paidInstallments: 0
      });
      // Reset and close
      setNewName('');
      setNewTotal('');
      setNewInst('');
      setIsAdding(false);
    }
  };

  return (
    <div className="p-4 space-y-8 pb-24 animate-in fade-in duration-500">
      <header className="px-2">
        <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">Setor de Dívidas</h2>
        <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-black uppercase tracking-[0.2em] mt-1">Vigilância e Simulação de Ativos</p>
      </header>

      {/* Simulator HUD */}
      <div className="p-6 rounded-[2.5rem] glass dark:bg-zinc-900/80 border border-blue-100 dark:border-blue-900/30 shadow-xl shadow-blue-500/5">
        <h3 className="text-[10px] font-black uppercase mb-4 flex items-center gap-2 text-blue-600 dark:text-blue-400 tracking-widest">
           <Calculator size={14} /> Simulador de Impacto
        </h3>
        <div className="flex gap-2">
           <input 
              type="number" 
              placeholder="Gasto planejado" 
              value={simAmount}
              onChange={e => setSimAmount(e.target.value)}
              className="flex-1 bg-gray-50 dark:bg-zinc-800 rounded-2xl p-4 text-sm outline-none border border-transparent focus:border-blue-500 transition-all dark:text-white"
           />
           <button onClick={handleSimulate} className="px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-blue-600 text-white active:scale-95 transition-all shadow-lg shadow-blue-500/20">Analisar</button>
        </div>
        {simRes !== null && (
          <div className="mt-6 p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50 animate-in slide-in-from-top">
             <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Resultado Projetado</p>
             <p className="text-sm font-medium dark:text-zinc-200">Saldo residual: <span className={`font-black ${simRes < 0 ? 'text-red-500' : 'text-green-500'}`}>R$ {simRes.toLocaleString('pt-BR')}</span></p>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Total Debt HUD Card */}
        <div className="p-8 rounded-[3rem] flex flex-col items-center justify-center border-2 border-red-100 dark:border-red-900/30 bg-white dark:bg-zinc-950 shadow-lg relative overflow-hidden group">
          <div className="absolute -left-10 -bottom-10 text-red-500/5 group-hover:scale-110 transition-transform duration-1000">
             <TrendingDown size={180} />
          </div>
          <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] mb-2 relative z-10">Passivo Total em Aberto</span>
          <h4 className="text-4xl font-black text-red-500 neon-text-red relative z-10 tracking-tighter">R$ {totalDebt.toLocaleString('pt-BR')}</h4>
          <div className="mt-4 px-4 py-1 rounded-full bg-red-50 dark:bg-red-900/20 text-[9px] font-black text-red-600 dark:text-red-400 uppercase tracking-widest relative z-10">
             Radar: {debts.length} Alvos
          </div>
        </div>

        {/* Debt List */}
        <div className="space-y-3">
          {debts.map((debt: Debt) => {
            const progress = (debt.paidInstallments / debt.installments) * 100;
            return (
              <div key={debt.id} className="p-6 rounded-[2.5rem] glass dark:bg-zinc-900/40 border border-gray-100 dark:border-zinc-800 shadow-sm transition-all hover:scale-[1.02]">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h5 className="font-black text-sm uppercase tracking-tight text-gray-900 dark:text-zinc-100">{debt.name}</h5>
                    <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-widest">Saldo: R$ {debt.remaining.toLocaleString('pt-BR')}</p>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500 shadow-inner">
                     <ShieldAlert size={18} />
                  </div>
                </div>
                
                <div className="space-y-2">
                   <div className="flex justify-between text-[9px] font-black uppercase text-gray-400 dark:text-zinc-600 tracking-widest">
                      <span>{debt.paidInstallments}/{debt.installments} parcelas</span>
                      <span className="text-red-500">{progress.toFixed(0)}% Pago</span>
                   </div>
                   <div className="h-2 w-full bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-red-500 transition-all duration-1000 shadow-[0_0_10px_rgba(239,68,68,0.5)]" style={{ width: `${progress}%` }} />
                   </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {debts.length === 0 && !isAdding && (
          <div className="text-center py-16 px-8 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-zinc-900 bg-gray-50/50 dark:bg-zinc-900/20">
             <div className="w-16 h-16 rounded-3xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-500 mx-auto mb-4 animate-pulse">
                <ShieldAlert size={32} />
             </div>
             <p className="text-xs text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-widest italic leading-relaxed">Nenhum inimigo financeiro detectado.</p>
          </div>
        )}

        {!isAdding ? (
          <button 
            onClick={() => setIsAdding(true)}
            className="w-full border-2 border-dashed border-gray-200 dark:border-zinc-800 p-6 rounded-[2.5rem] text-[10px] font-black text-gray-400 dark:text-zinc-600 uppercase tracking-[0.3em] hover:bg-gray-50 dark:hover:bg-zinc-900 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={16} /> Adicionar Fatura / Dívida
          </button>
        ) : (
          <div className="p-8 rounded-[3rem] glass dark:bg-zinc-900 border-2 border-blue-600 dark:border-blue-500 shadow-[0_0_40px_rgba(37,99,235,0.15)] animate-in zoom-in slide-in-from-bottom duration-300 space-y-6">
            <div className="flex justify-between items-center mb-2">
               <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">Novo Registro de Passivo</h4>
               <button onClick={() => setIsAdding(false)} className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-gray-400 uppercase ml-2">Identificação da Fatura</label>
                <input 
                  placeholder="Ex: Empréstimo Caixa" 
                  className="w-full bg-transparent border-b-2 border-gray-100 dark:border-zinc-800 p-3 text-base outline-none focus:border-blue-500 dark:text-white font-bold transition-all" 
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase ml-2">Valor Total</label>
                  <input 
                    placeholder="R$ 0,00" 
                    type="number" 
                    className="w-full bg-transparent border-b-2 border-gray-100 dark:border-zinc-800 p-2 text-base outline-none focus:border-blue-500 dark:text-white transition-all font-mono" 
                    value={newTotal}
                    onChange={e => setNewTotal(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase ml-2">Parcelas</label>
                  <input 
                    placeholder="Ex: 12" 
                    type="number" 
                    className="w-full bg-transparent border-b-2 border-gray-100 dark:border-zinc-800 p-2 text-base outline-none focus:border-blue-500 dark:text-white transition-all font-mono" 
                    value={newInst}
                    onChange={e => setNewInst(e.target.value)}
                  />
                </div>
              </div>
              <button 
                onClick={handleAddDebt} 
                disabled={!newName || !newTotal || !newInst}
                className="w-full py-6 rounded-full text-[11px] font-black uppercase tracking-[0.25em] bg-blue-600 text-white shadow-2xl shadow-blue-600/30 hover:bg-blue-500 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale"
              >
                <Check size={18} />
                Ativar Rastreamento
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DebtSimulator;
