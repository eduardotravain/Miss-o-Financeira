
import React, { useState } from 'react';
import { FixedBill } from '../types';
import { Plus, CheckCircle2, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

interface Props {
  store: any;
}

const BillsView: React.FC<Props> = ({ store }) => {
  const { bills, addBill, setBills, user } = store;
  const isDark = user.theme === 'dark';
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newDay, setNewDay] = useState('10');

  const togglePaid = (id: string) => {
    setBills((prev: FixedBill[]) => prev.map(b => 
      b.id === id ? { ...b, status: b.status === 'paid' ? 'pending' : 'paid' } : b
    ));
  };

  const handleAdd = () => {
    if (!newName || !newAmount) return;
    addBill({
      name: newName,
      amount: parseFloat(newAmount),
      dueDate: parseInt(newDay)
    });
    setNewName('');
    setNewAmount('');
    setShowAdd(false);
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center px-2">
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">Gastos Recorrentes</h2>
          <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-widest">Sentinela de Faturas Fixas</p>
        </div>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="p-3 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/20 active:scale-90 transition-all"
        >
          <Plus size={24} />
        </button>
      </div>

      {showAdd && (
        <div className="p-6 rounded-3xl border-2 space-y-4 animate-in slide-in-from-top bg-white dark:bg-zinc-900 border-blue-100 dark:border-blue-900 shadow-xl">
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1">
               <label className="text-[9px] uppercase font-black text-gray-400">Nome</label>
               <input placeholder="Ex: Aluguel" value={newName} onChange={e => setNewName(e.target.value)} className="w-full bg-transparent border-b p-2 outline-none text-sm dark:text-white" />
             </div>
             <div className="space-y-1">
               <label className="text-[9px] uppercase font-black text-gray-400">Valor R$</label>
               <input placeholder="0,00" type="number" value={newAmount} onChange={e => setNewAmount(e.target.value)} className="w-full bg-transparent border-b p-2 outline-none text-sm dark:text-white" />
             </div>
          </div>
          <div className="flex items-center justify-between">
             <label className="text-xs font-bold text-gray-500">Dia de vencimento (1-31):</label>
             <input type="number" max="31" min="1" value={newDay} onChange={e => setNewDay(e.target.value)} className="w-16 bg-gray-50 dark:bg-zinc-800 rounded-lg p-2 text-center font-bold dark:text-white" />
          </div>
          <button onClick={handleAdd} className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest bg-blue-600 text-white shadow-xl shadow-blue-500/20 active:scale-95 transition-all">Registrar Despesa</button>
        </div>
      )}

      <div className="space-y-3">
        {bills.length === 0 ? (
          <div className="text-center py-20 rounded-[40px] border-2 border-dashed border-gray-100 dark:border-zinc-800 text-gray-400 dark:text-zinc-600 text-sm font-medium">Nenhuma fatura rastreada.</div>
        ) : (
          bills.sort((a: FixedBill, b: FixedBill) => a.dueDate - b.dueDate).map((bill: FixedBill) => (
            <div key={bill.id} className={`p-5 rounded-[2.5rem] flex items-center justify-between border-2 transition-all ${bill.status === 'paid' ? 'bg-green-50/50 dark:bg-green-950/10 border-green-100 dark:border-green-900/40' : 'bg-white dark:bg-zinc-900 border-gray-50 dark:border-zinc-800'} shadow-sm`}>
              <div className="flex items-center gap-4">
                 <button onClick={() => togglePaid(bill.id)} className={`transition-all hover:scale-110 ${bill.status === 'paid' ? 'text-green-500 dark:text-green-400' : 'text-gray-300 dark:text-zinc-700'}`}>
                    <CheckCircle2 size={32} />
                 </button>
                 <div>
                    <h4 className="font-black text-sm uppercase tracking-tight text-gray-900 dark:text-white">{bill.name}</h4>
                    <div className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-zinc-500 font-black uppercase">
                       <Clock size={10} /> Vence dia {bill.dueDate}
                    </div>
                 </div>
              </div>
              <div className="text-right">
                 <p className="text-lg font-black text-gray-900 dark:text-white">R$ {bill.amount.toLocaleString('pt-BR')}</p>
                 <div className={`flex items-center gap-1 justify-end text-[9px] font-black uppercase tracking-tighter ${bill.status === 'paid' ? 'text-green-500' : 'text-orange-400'}`}>
                    {bill.status === 'paid' && <ShieldCheck size={10} />}
                    {bill.status === 'paid' ? 'Liquidada' : 'Aguardando'}
                 </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-5 rounded-3xl border flex gap-4 bg-gray-50 dark:bg-zinc-900 border-gray-100 dark:border-zinc-800">
        <AlertTriangle className="text-orange-500 shrink-0" size={24} />
        <p className="text-[10px] text-gray-500 dark:text-zinc-400 font-medium leading-relaxed">
          <strong>Missão Financeira:</strong> Seus custos fixos são abatidos automaticamente do saldo disponível para garantir que você nunca gaste o dinheiro que já tem destino certo.
        </p>
      </div>
    </div>
  );
};

export default BillsView;
