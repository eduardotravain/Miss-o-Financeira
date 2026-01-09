
import React, { useEffect } from 'react';
import { Transaction, FixedBill } from '../types';
import { TrendingUp, TrendingDown, AlertCircle, Calendar, DollarSign, BellRing, Rocket, Activity, Zap, Plus } from 'lucide-react';
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';

interface Props {
  store: any;
  onAdd: () => void;
}

const Dashboard: React.FC<Props> = ({ store, onAdd }) => {
  const { user, transactions, bills, goals } = store;
  const isDark = user.theme === 'dark';

  const totalProfileIncome = user.salary + user.extraIncome + user.benefits;
  const transactionIncome = transactions
    .filter((t: Transaction) => t.type === 'income')
    .reduce((acc: number, t: Transaction) => acc + t.amount, 0);
  const totalIncome = totalProfileIncome + transactionIncome;

  const fixedExpenses = bills.reduce((acc: number, bill: FixedBill) => acc + bill.amount, 0);
  const dailyExpenses = transactions
    .filter((t: Transaction) => t.type === 'expense')
    .reduce((acc: number, t: Transaction) => acc + t.amount, 0);
  
  const totalExpenses = fixedExpenses + dailyExpenses;
  const balance = totalIncome - totalExpenses;
  const commitmentRatio = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;

  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const remainingDays = daysInMonth - today.getDate() + 1;
  const dailyBudget = remainingDays > 0 ? Math.max(0, balance / remainingDays) : 0;

  const chartData = [
    { name: 'Comprometimento', value: Math.min(100, commitmentRatio) }
  ];

  return (
    <div className="p-4 space-y-6 relative min-h-full">
      {/* HUD Header */}
      <div className="flex items-center justify-between px-2 mb-2">
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-zinc-500">Sistema Online</span>
        </div>
        <div className="text-[10px] font-mono text-blue-500 dark:text-blue-400 font-bold uppercase tracking-widest">
           {new Date().toLocaleDateString('pt-BR')}
        </div>
      </div>

      {/* Main Futuristic Gauge Card */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-[2.5rem] blur opacity-20 dark:opacity-40 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative p-6 rounded-[2.3rem] glass dark:bg-zinc-900/80 border border-white/20 dark:border-zinc-800 shadow-2xl flex items-center justify-between overflow-hidden">
          
          {/* Decorative SVG elements for futuristic feel */}
          <div className="absolute -top-10 -right-10 opacity-5 pointer-events-none">
             <Zap size={200} />
          </div>

          <div className="flex-1 z-10">
            <div className="flex items-center gap-2 mb-2">
               <Zap size={14} className="text-blue-500 dark:text-blue-400" />
               <p className="text-[10px] uppercase font-black tracking-[0.2em] text-blue-600 dark:text-blue-400">Poder de Compra Diário</p>
            </div>
            <h3 className="text-5xl font-black tracking-tighter text-gray-900 dark:text-white neon-text-blue">
              <span className="text-xl font-bold mr-1 opacity-50">R$</span>
              {dailyBudget.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </h3>
            <div className="mt-4 flex items-center gap-3">
               <div className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-[10px] font-black text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 uppercase tracking-widest">
                  Estável
               </div>
               <span className="text-[10px] text-gray-400 dark:text-zinc-500 font-medium">Faltam {remainingDays} dias</span>
            </div>
          </div>

          <div className="w-32 h-32 relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart 
                innerRadius="75%" 
                outerRadius="100%" 
                data={chartData} 
                startAngle={90} 
                endAngle={450}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar
                  background={{ fill: isDark ? '#18181b' : '#f4f4f5' }}
                  dataKey="value"
                  cornerRadius={10}
                  fill={isDark ? '#3b82f6' : '#2563eb'}
                />
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-gray-900 dark:fill-white font-black text-[18px] font-mono"
                >
                  {Math.round(commitmentRatio)}%
                </text>
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 border-4 border-dashed border-blue-500/10 dark:border-blue-400/10 rounded-full animate-[spin_10s_linear_infinite]"></div>
          </div>
        </div>
      </div>

      {/* Action Alerts */}
      <div className="space-y-3">
         {commitmentRatio > 60 && (
            <div className="p-4 rounded-3xl bg-red-500/5 dark:bg-red-500/10 border border-red-500/20 flex items-center gap-3 animate-pulse">
               <div className="w-10 h-10 rounded-2xl bg-red-500 flex items-center justify-center text-white shadow-lg shadow-red-500/30">
                  <AlertCircle size={20} />
               </div>
               <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-red-500">Alerta de Gastos</p>
                  <p className="text-xs text-red-700 dark:text-red-400 font-medium">Consumo excedendo 60% da renda. Reduza a marcha.</p>
               </div>
            </div>
         )}
      </div>

      {/* Balance Hub */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-6 rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col justify-between h-48">
           <div className="space-y-1">
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 dark:text-zinc-600">Disponibilidade</p>
              <h4 className="text-2xl font-black dark:text-white">R$ {balance.toLocaleString('pt-BR')}</h4>
           </div>
           <div className="h-12 w-full bg-gray-50 dark:bg-zinc-800/50 rounded-2xl flex items-center justify-center">
              <Activity className="text-blue-500/40" size={32} />
           </div>
        </div>

        <div className="p-6 rounded-[2.5rem] bg-zinc-900 dark:bg-blue-600 text-white shadow-xl shadow-blue-500/10 flex flex-col justify-between h-48">
           <div className="space-y-1">
              <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Status da Missão</p>
              <h4 className="text-xl font-black leading-tight">Mês em Operação</h4>
           </div>
           <div className="flex items-center gap-2">
              <Rocket size={20} className="text-blue-400 dark:text-zinc-900" />
              <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                 <div className="h-full bg-white transition-all duration-1000" style={{ width: `${(today.getDate() / daysInMonth) * 100}%` }} />
              </div>
           </div>
        </div>
      </div>

      {/* Recent Activity HUD */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-zinc-600">Transações Recentes</h3>
          <Activity size={12} className="text-blue-500" />
        </div>
        
        {transactions.length === 0 ? (
          <div className="py-12 border-2 border-dashed border-gray-100 dark:border-zinc-900 rounded-[3rem] text-center">
             <p className="text-xs text-gray-400 dark:text-zinc-600 font-medium">Nenhuma atividade detectada.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.slice(0, 4).map(t => (
              <div key={t.id} className="p-5 rounded-[2rem] glass dark:bg-zinc-900/40 border border-gray-50 dark:border-zinc-800/50 flex items-center justify-between hover:border-blue-500/30 transition-all cursor-default">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center text-xl">
                    {t.category === 'Alimentação' && '🍔'}
                    {t.category === 'Transporte' && '🚗'}
                    {t.category === 'Lazer' && '🍿'}
                    {t.category === 'Saúde' && '🏥'}
                    {t.category === 'Educação' && '📚'}
                    {t.category === 'Dívida' && '💸'}
                    {t.category === 'Outros' && '📦'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-zinc-100">{t.description}</p>
                    <p className="text-[9px] font-black uppercase text-gray-400 dark:text-zinc-600 tracking-tighter">{t.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-base font-black ${t.type === 'expense' ? 'text-red-500' : 'text-green-500'}`}>
                    {t.type === 'expense' ? '-' : '+'} R$ {t.amount.toLocaleString('pt-BR')}
                  </p>
                  <p className="text-[9px] text-gray-400 font-medium uppercase">{new Date(t.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Persistent Floating Action Button */}
      <button
        onClick={onAdd}
        className="fixed bottom-24 right-6 w-16 h-16 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-blue-600/40 active:scale-90 transition-all z-40 border-4 border-white dark:border-zinc-900"
        aria-label="Registrar gasto"
      >
        <Plus size={32} />
      </button>
    </div>
  );
};

export default Dashboard;
