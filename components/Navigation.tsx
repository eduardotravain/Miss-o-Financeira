
import React from 'react';
import { AppView } from '../types';
import { LayoutDashboard, PlusCircle, CreditCard, User, BarChart3, Lock } from 'lucide-react';

interface NavigationProps {
  currentView: AppView;
  setView: (v: AppView) => void;
  theme?: string;
  offlineMode?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setView, theme, offlineMode }) => {
  const isDark = theme === 'dark';
  
  const navItems: { view: AppView; label: string; icon: React.ReactNode }[] = [
    { view: 'dashboard', label: 'Radar', icon: <LayoutDashboard size={20} /> },
    { view: 'bills', label: 'Fixos', icon: <CreditCard size={20} /> },
    { view: 'log', label: 'Novo', icon: <PlusCircle size={28} className={offlineMode ? "text-orange-500" : "text-blue-600 dark:text-blue-400"} /> },
    { view: 'debts', label: 'Faturas', icon: <BarChart3 size={20} /> },
    { view: 'profile', label: 'Perfil', icon: <User size={20} /> },
  ];

  return (
    <nav className={`fixed bottom-0 left-0 right-0 max-w-md mx-auto border-t py-4 px-6 flex justify-between items-center z-50 safe-bottom shadow-[0_-10px_30px_rgba(0,0,0,0.05)] backdrop-blur-lg ${isDark ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white/90 border-gray-100'}`}>
      {navItems.map((item) => {
        const isActive = currentView === item.view;
        const isRestricted = offlineMode && item.view !== 'profile';
        
        return (
          <button
            key={item.view}
            onClick={() => setView(item.view)}
            className={`flex flex-col items-center gap-1 transition-all relative ${isActive ? (offlineMode ? 'text-orange-500' : 'text-blue-600 dark:text-blue-400') : 'text-gray-400 dark:text-zinc-600'} ${isActive ? 'scale-110' : ''}`}
          >
            {isRestricted ? <Lock size={20} className="opacity-40" /> : item.icon}
            <span className={`text-[9px] font-black uppercase tracking-tighter ${isActive ? 'opacity-100' : 'opacity-60'}`}>{item.label}</span>
            {isActive && <div className={`absolute -top-1 w-1 h-1 rounded-full animate-pulse ${offlineMode ? 'bg-orange-500' : 'bg-blue-600 dark:bg-blue-400'}`} />}
          </button>
        );
      })}
    </nav>
  );
};

export default Navigation;
