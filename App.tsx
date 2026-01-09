
import React, { useState, useEffect } from 'react';
import { useStore } from './store';
import { AppView } from './types';
import Dashboard from './screens/Dashboard';
import DailyLog from './screens/DailyLog';
import BillsView from './screens/BillsView';
import GoalsView from './screens/GoalsView';
import ProfileView from './screens/ProfileView';
import DebtSimulator from './screens/DebtSimulator';
import Onboarding from './screens/Onboarding';
import Navigation from './components/Navigation';
import { Shield, Mail, Moon, Sun, Lock, ShieldAlert } from 'lucide-react';

const Login: React.FC<{ onLogin: () => void }> = ({ onLogin }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col p-8 justify-center animate-in fade-in duration-700">
    <div className="flex flex-col items-center mb-12">
      <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl mb-4">
        <Shield className="text-white" size={40} />
      </div>
      <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">Missão Financeira</h1>
      <p className="text-sm text-gray-500 font-medium text-center">Assuma o controle total e conquiste sua liberdade</p>
    </div>

    <div className="space-y-4">
      <button 
        onClick={onLogin}
        className="w-full flex items-center justify-center gap-3 bg-white dark:bg-zinc-900 border-2 border-gray-100 dark:border-zinc-800 p-4 rounded-2xl font-bold text-gray-700 dark:text-zinc-200 hover:bg-gray-50 transition-colors"
      >
        <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
        Entrar com Google
      </button>
      <button 
        onClick={onLogin}
        className="w-full flex items-center justify-center gap-3 bg-blue-600 p-4 rounded-2xl font-bold text-white shadow-xl shadow-blue-500/20 active:scale-95 transition-transform"
      >
        <Mail size={20} />
        Entrar com E-mail
      </button>
    </div>
    
    <p className="mt-8 text-center text-[10px] text-gray-400 uppercase font-bold tracking-widest">
      Disciplina é o único caminho para a liberdade
    </p>
  </div>
);

const OfflineOverlay: React.FC<{ onGoToProfile: () => void }> = ({ onGoToProfile }) => (
  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6 animate-in zoom-in duration-500">
    <div className="w-32 h-32 bg-orange-100 dark:bg-orange-950/30 rounded-[3rem] flex items-center justify-center text-orange-600 dark:text-orange-500 shadow-2xl shadow-orange-500/20">
      <Lock size={64} />
    </div>
    <div className="space-y-2">
      <h2 className="text-3xl font-black tracking-tighter text-gray-900 dark:text-white">Modo Seguro Ativo</h2>
      <p className="text-sm text-gray-500 dark:text-zinc-500 font-medium max-w-[240px] mx-auto">
        Suas informações financeiras estão ocultas. Vá ao seu perfil para desativar.
      </p>
    </div>
    <button 
      onClick={onGoToProfile}
      className="px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all"
    >
      Acessar Perfil
    </button>
  </div>
);

const App: React.FC = () => {
  const store = useStore();
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('sentinela_auth') === 'true';
  });

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('sentinela_auth', 'true');
  };

  useEffect(() => {
    if (store.user.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [store.user.theme]);

  if (!isLoggedIn) return <Login onLogin={handleLogin} />;

  // Onboarding Logic
  if (!store.user.hasCompletedOnboarding) {
    return <Onboarding store={store} />;
  }

  const renderView = () => {
    // Se o modo offline estiver ativo e não estivermos na tela de perfil, mostramos o overlay
    if (store.user.offlineMode && currentView !== 'profile') {
      return <OfflineOverlay onGoToProfile={() => setCurrentView('profile')} />;
    }

    switch (currentView) {
      case 'dashboard': return <Dashboard store={store} onAdd={() => setCurrentView('log')} />;
      case 'log': return <DailyLog store={store} onBack={() => setCurrentView('dashboard')} />;
      case 'bills': return <BillsView store={store} />;
      case 'goals': return <GoalsView store={store} />;
      case 'debts': return <DebtSimulator store={store} />;
      case 'profile': return <ProfileView store={store} />;
      default: return <Dashboard store={store} onAdd={() => setCurrentView('log')} />;
    }
  };

  const toggleTheme = () => {
    store.setUser({ ...store.user, theme: store.user.theme === 'light' ? 'dark' : 'light' });
  };

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto shadow-2xl relative overflow-hidden transition-colors duration-300 bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 selection:bg-blue-100 dark:selection:bg-blue-900">
      <header className="p-4 flex justify-between items-center sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-zinc-900/80 border-b border-gray-100 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          {store.user.offlineMode ? (
            <ShieldAlert className="text-orange-500" />
          ) : (
            <Shield className="text-blue-600 dark:text-blue-400" />
          )}
          <h1 className="font-bold text-lg tracking-tight">
            {store.user.offlineMode ? 'Modo Seguro' : 'Missão Financeira'}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 transition-all hover:scale-110">
            {store.user.theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          {!store.user.offlineMode && (
            <div className="flex items-center gap-2 bg-black/5 dark:bg-white/5 rounded-full px-3 py-1">
              <span className="text-orange-500 font-bold">🔥 {store.user.streak}</span>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col overflow-y-auto pb-24 safe-bottom scroll-smooth">
        {renderView()}
      </main>

      <Navigation 
        currentView={currentView} 
        setView={setCurrentView} 
        theme={store.user.theme} 
        offlineMode={store.user.offlineMode}
      />
    </div>
  );
};

export default App;
