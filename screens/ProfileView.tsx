
import React from 'react';
import { User, LogOut, Settings, Moon, Sun, ShieldCheck, Shield, EyeOff, Eye } from 'lucide-react';

interface Props {
  store: any;
}

const ProfileView: React.FC<Props> = ({ store }) => {
  const { user, setUser } = store;
  const isDark = user.theme === 'dark';
  const isMilitary = user.militaryMode;
  const isOffline = user.offlineMode;

  const handleUpdate = (key: string, val: any) => {
    setUser((prev: any) => ({ ...prev, [key]: val }));
  };

  const toggleTheme = () => {
    handleUpdate('theme', isDark ? 'light' : 'dark');
  };

  const toggleOffline = () => {
    handleUpdate('offlineMode', !isOffline);
  };

  return (
    <div className="p-4 space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="flex flex-col items-center gap-4 py-8 relative">
        <div className="absolute top-0 right-0 p-4">
           <div className={`p-2 rounded-xl border ${isDark ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
              <ShieldCheck size={18} />
           </div>
        </div>
        <div className={`w-28 h-28 rounded-full border-4 flex items-center justify-center overflow-hidden shadow-2xl transition-all ${isMilitary ? 'border-green-600 bg-gray-900' : 'border-white dark:border-zinc-800 bg-blue-100 dark:bg-blue-900/30'}`}>
           {isMilitary ? <Shield size={56} className="text-green-500" /> : <User size={56} className="text-blue-600 dark:text-blue-400" />}
        </div>
        <div className="text-center">
           <h2 className={`text-2xl font-black ${isMilitary ? 'uppercase tracking-tighter text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>{user.name}</h2>
           {user.rank && isMilitary && <p className="text-[10px] font-black uppercase text-green-500/60 tracking-[0.3em]">{user.rank}</p>}
           <p className="text-xs text-gray-400 dark:text-zinc-500 font-black uppercase tracking-widest">{user.email}</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500 px-2 flex items-center gap-2">
          <Settings size={12} /> Interface & Estilo
        </h3>
        
        <div className="space-y-3">
          <button 
            onClick={toggleTheme}
            className="w-full p-6 rounded-3xl border-2 bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 shadow-sm flex items-center justify-between active:scale-95 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-gray-50 text-gray-500'}`}>
                {isDark ? <Moon size={22} /> : <Sun size={22} />}
              </div>
              <div className="text-left">
                <p className="font-black text-sm text-gray-900 dark:text-white">Modo de Exibição</p>
                <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold uppercase">{isDark ? 'Escuro' : 'Claro'}</p>
              </div>
            </div>
            <div className={`w-14 h-8 rounded-full relative transition-colors p-1 ${isDark ? 'bg-blue-600' : 'bg-gray-200'}`}>
              <div className={`h-6 w-6 bg-white rounded-full shadow-lg transition-transform ${isDark ? 'translate-x-6' : 'translate-x-0'}`} />
            </div>
          </button>

          <button 
            onClick={toggleOffline}
            className={`w-full p-6 rounded-3xl border-2 shadow-sm flex items-center justify-between active:scale-95 transition-all ${isOffline ? 'bg-orange-50/50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900/50' : 'bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800'}`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isOffline ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'bg-gray-50 dark:bg-zinc-800 text-gray-400'}`}>
                {isOffline ? <EyeOff size={22} /> : <Eye size={22} />}
              </div>
              <div className="text-left">
                <p className="font-black text-sm text-gray-900 dark:text-white">Modo Seguro</p>
                <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold uppercase">{isOffline ? 'Ativado' : 'Desativado'}</p>
              </div>
            </div>
            <div className={`w-14 h-8 rounded-full relative transition-colors p-1 ${isOffline ? 'bg-orange-500' : 'bg-gray-200'}`}>
              <div className={`h-6 w-6 bg-white rounded-full shadow-lg transition-transform ${isOffline ? 'translate-x-6' : 'translate-x-0'}`} />
            </div>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500 px-2 flex items-center gap-2">
          <Settings size={12} /> Dados Financeiros
        </h3>
        
        <div className="p-8 rounded-[40px] border-2 bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 shadow-sm space-y-6">
          {[
            { key: 'salary', label: isMilitary ? 'Soldo / Salário Base' : 'Salário Base Mensal' },
            { key: 'extraIncome', label: 'Renda Extra Prevista' },
            { key: 'benefits', label: 'Benefícios Ativos' }
          ].map(field => {
            const val = user[field.key as keyof typeof user];
            return (
              <div key={field.key} className="space-y-1">
                <label className="text-[10px] uppercase font-black text-gray-400 dark:text-zinc-600 ml-1">{field.label}</label>
                <div className="flex items-center gap-3 group">
                   <span className="text-gray-400 dark:text-zinc-700 font-black text-xl">R$</span>
                   <input 
                     type="number" 
                     value={val === 0 ? '' : val} 
                     placeholder="0,00"
                     onChange={e => {
                       const inputVal = e.target.value;
                       handleUpdate(field.key, inputVal === '' ? 0 : parseFloat(inputVal));
                     }}
                     className="w-full bg-transparent border-b-2 border-gray-50 dark:border-zinc-800 outline-none font-black py-2 focus:border-blue-500 dark:focus:border-blue-400 transition-all text-2xl text-gray-900 dark:text-white" 
                   />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-6 pb-20">
        <button className="w-full flex items-center justify-center gap-3 py-6 text-red-500 dark:text-red-400 font-black text-[11px] uppercase tracking-[0.2em] opacity-80 hover:opacity-100 transition-opacity active:scale-95 bg-red-50 dark:bg-red-950/20 rounded-3xl border border-red-100 dark:border-red-900/30">
           <LogOut size={16} /> Encerrar Sessão Segura
        </button>
      </div>
    </div>
  );
};

export default ProfileView;
