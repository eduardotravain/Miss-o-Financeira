
import React, { useState } from 'react';
import { Category } from '../types';
import { Check, X, Tag, DollarSign } from 'lucide-react';

interface Props {
  store: any;
  onBack: () => void;
}

const DailyLog: React.FC<Props> = ({ store, onBack }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('Alimentação');
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const isDark = store.user.theme === 'dark';

  const categories: Category[] = ['Alimentação', 'Transporte', 'Lazer', 'Saúde', 'Educação', 'Dívida', 'Outros'];

  const handleSave = () => {
    const numericAmount = parseFloat(amount.replace(',', '.'));
    if (!description || isNaN(numericAmount) || numericAmount <= 0) {
      alert("Por favor, preencha os valor e descrição.");
      return;
    }
    
    store.addTransaction({
      description,
      amount: numericAmount,
      category,
      type,
      date: new Date().toISOString()
    });
    onBack();
  };

  return (
    <div className="p-6 space-y-10 animate-in slide-in-from-bottom duration-500 min-h-full bg-white dark:bg-zinc-950">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white">Novo Registro</h2>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Radar de Gastos em Tempo Real</p>
        </div>
        <button onClick={onBack} className="p-3 bg-gray-50 dark:bg-zinc-900 rounded-2xl text-gray-400 dark:text-zinc-600 transition-colors">
          <X size={24} />
        </button>
      </div>

      <div className="space-y-8">
        <div className="flex gap-2 p-1 bg-gray-50 dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800">
          <button 
            onClick={() => setType('expense')}
            className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${type === 'expense' ? 'bg-white dark:bg-zinc-800 text-red-500 shadow-xl shadow-red-500/5' : 'text-gray-400'}`}
          >
            Saída
          </button>
          <button 
            onClick={() => setType('income')}
            className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${type === 'income' ? 'bg-white dark:bg-zinc-800 text-green-500 shadow-xl shadow-green-500/5' : 'text-gray-400'}`}
          >
            Entrada
          </button>
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-2 text-[10px] uppercase font-black text-gray-400 dark:text-zinc-600 tracking-widest ml-1">
            <DollarSign size={12} /> Qual o valor?
          </label>
          <div className="relative group">
             <span className="absolute left-6 top-1/2 -translate-y-1/2 text-4xl font-black text-gray-300 dark:text-zinc-700 group-focus-within:text-blue-500 transition-colors">R$</span>
             <input 
              type="number" 
              inputMode="decimal"
              placeholder="0,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-gray-50 dark:bg-zinc-900/50 rounded-[2.5rem] border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 text-5xl font-black pl-20 pr-6 py-10 outline-none transition-all dark:text-white"
              autoFocus
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-2 text-[10px] uppercase font-black text-gray-400 dark:text-zinc-600 tracking-widest ml-1">
            <Tag size={12} /> Descrição da Transação
          </label>
          <input 
            type="text" 
            placeholder="Ex: Almoço Executivo"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-6 rounded-[2rem] border-2 bg-gray-50 dark:bg-zinc-900/50 border-transparent dark:border-zinc-800 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-all text-gray-900 dark:text-white font-bold"
          />
        </div>

        <div className="space-y-4">
          <label className="text-[10px] uppercase font-black text-gray-400 dark:text-zinc-600 tracking-widest ml-1">Categoria do Setor</label>
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`p-4 text-[10px] font-black uppercase tracking-tight rounded-2xl border-2 transition-all text-center ${category === cat ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'border-gray-50 dark:border-zinc-800 text-gray-400 dark:text-zinc-600'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={handleSave}
          className="w-full py-6 rounded-[2.5rem] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-2xl shadow-blue-500/20 active:scale-95 transition-all mt-6 bg-blue-600 text-white"
        >
          <Check size={20} />
          Confirmar Missão
        </button>
      </div>
    </div>
  );
};

export default DailyLog;
