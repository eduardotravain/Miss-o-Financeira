
import React, { useState } from 'react';
import { Target, Plus } from 'lucide-react';

interface Props {
  store: any;
}

const GoalsView: React.FC<Props> = ({ store }) => {
  const { goals, addGoal, setGoals } = store;
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');

  const icons = [
    { icon: '🚗', name: 'Carro' },
    { icon: '✈️', name: 'Viagem' },
    { icon: '🏠', name: 'Casa' },
    { icon: '🏍️', name: 'Moto' },
    { icon: '💰', name: 'Reserva' },
    { icon: '🎁', name: 'Outros' }
  ];
  const [selIcon, setSelIcon] = useState('💰');

  const handleAdd = () => {
    if(!name || !target) return;
    addGoal({ name, target: parseFloat(target), icon: selIcon });
    setName('');
    setTarget('');
    setShowAdd(false);
  };

  const updateGoal = (id: string, amount: number) => {
    setGoals((prev: any) => prev.map((g: any) => 
      g.id === id ? { ...g, current: Math.min(g.target, g.current + amount) } : g
    ));
  };

  return (
    <div className="p-4 space-y-6 pb-20">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Minhas Metas</h2>
          <p className="text-xs text-gray-500">Transformando economia em conquistas</p>
        </div>
        <button 
           onClick={() => setShowAdd(!showAdd)}
           className="p-2 rounded-full bg-blue-600 text-white"
        >
          <Plus size={20} />
        </button>
      </header>

      {showAdd && (
        <div className="p-4 rounded-2xl border-2 space-y-4 animate-in slide-in-from-top bg-white border-blue-100">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {icons.map(i => (
              <button 
                key={i.icon} 
                onClick={() => setSelIcon(i.icon)}
                className={`text-2xl p-2 rounded-lg border-2 transition-all ${selIcon === i.icon ? 'border-blue-500 bg-blue-50' : 'border-transparent'}`}
              >
                {i.icon}
              </button>
            ))}
          </div>
          <input placeholder="Nome da meta" value={name} onChange={e => setName(e.target.value)} className="w-full bg-transparent border-b p-2 outline-none text-sm" />
          <input placeholder="Valor Alvo R$" type="number" value={target} onChange={e => setTarget(e.target.value)} className="w-full bg-transparent border-b p-2 outline-none text-sm" />
          <button onClick={handleAdd} className="w-full py-2 rounded-lg font-bold text-sm bg-blue-600 text-white">CRIAR META</button>
        </div>
      )}

      <div className="space-y-4">
        {goals.length === 0 ? (
          <div className="text-center py-20 opacity-30 flex flex-col items-center">
             <Target size={48} className="mb-2" />
             <p className="text-sm italic">Nenhum alvo definido ainda.</p>
          </div>
        ) : (
          goals.map((goal: any) => {
            const perc = (goal.current / goal.target) * 100;
            return (
              <div key={goal.id} className="p-5 rounded-2xl border transition-all bg-white border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{goal.icon}</div>
                    <div>
                      <h4 className="font-bold text-sm uppercase">{goal.name}</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Objetivo: R$ {goal.target.toLocaleString('pt-BR')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                     <span className={`text-xs font-black ${perc === 100 ? 'text-green-500' : 'text-blue-500'}`}>{perc.toFixed(0)}%</span>
                  </div>
                </div>

                <div className="space-y-3">
                   <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${perc === 100 ? 'bg-green-500' : 'bg-blue-500'}`} 
                        style={{ width: `${perc}%` }} 
                      />
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-[10px] text-gray-500 font-bold uppercase">Guardado: R$ {goal.current.toLocaleString('pt-BR')}</span>
                      <button 
                        onClick={() => updateGoal(goal.id, 50)} 
                        className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest active:scale-90 transition-transform bg-blue-50 text-blue-600 border border-blue-200"
                      >
                         + R$ 50,00
                      </button>
                   </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default GoalsView;
