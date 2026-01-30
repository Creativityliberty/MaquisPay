import React, { useState } from 'react';
import { api } from '../services/mockDb';
import { User } from '../types';
import { Button } from '../components/Button';
import { Logo } from '../components/Logo';
import { LockKeyhole, User as UserIcon } from 'lucide-react';

interface Props {
  onLogin: (user: User) => void;
}

export const LoginView: React.FC<Props> = ({ onLogin }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 4) return;
    
    setLoading(true);
    setError('');
    
    // Simulate network delay for realism
    await new Promise(r => setTimeout(r, 600));
    
    const user = await api.login(pin);
    if (user) {
      onLogin(user);
    } else {
      setError('Code PIN incorrect. Réessayez.');
      setPin('');
    }
    setLoading(false);
  };

  const handleNumClick = (num: string) => {
    if (pin.length < 4) setPin(p => p + num);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F3F4F6] p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-violet-600 to-violet-500 rounded-b-[4rem] shadow-2xl z-0"></div>
      
      <div className="relative z-10 w-full max-w-sm">
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] p-8 pt-10 animate-in slide-in-from-bottom-8 duration-700">
          
          <div className="flex flex-col items-center mb-10">
            <Logo />
            <p className="text-gray-400 text-sm mt-4 font-medium">Connexion sécurisée au terminal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            {/* PIN Display */}
            <div className="flex justify-center gap-6 mb-6">
               {[0, 1, 2, 3].map(i => (
                 <div 
                  key={i} 
                  className={`w-4 h-4 rounded-full transition-all duration-300 transform ${i < pin.length ? 'bg-violet-600 scale-125' : 'bg-gray-200 scale-100'}`} 
                 />
               ))}
            </div>
            
            {error && (
              <div className="bg-red-50 text-red-500 text-sm p-3 rounded-2xl text-center font-bold animate-in fade-in">
                {error}
              </div>
            )}

            {/* Numpad */}
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <button 
                  type="button"
                  key={num}
                  onClick={() => handleNumClick(num.toString())}
                  className="h-16 rounded-2xl bg-gray-50 text-2xl font-bold text-gray-700 hover:bg-violet-50 hover:text-violet-600 transition-colors active:scale-90 shadow-sm border border-gray-100"
                >
                  {num}
                </button>
              ))}
              <div className="col-start-2">
                <button 
                  type="button"
                  onClick={() => handleNumClick('0')}
                  className="w-full h-16 rounded-2xl bg-gray-50 text-2xl font-bold text-gray-700 hover:bg-violet-50 hover:text-violet-600 transition-colors active:scale-90 shadow-sm border border-gray-100"
                >
                  0
                </button>
              </div>
              <div>
                 <button 
                  type="button" 
                  onClick={() => setPin(p => p.slice(0, -1))} 
                  className="w-full h-16 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all active:scale-90"
                 >
                   EFF
                 </button>
              </div>
            </div>

            <Button type="submit" fullWidth disabled={pin.length !== 4 || loading} className={loading ? 'opacity-80' : ''}>
              {loading ? 'Connexion...' : 'Accéder au système'}
            </Button>
          </form>
        </div>
        
        <div className="text-center mt-8 opacity-60 hover:opacity-100 transition-opacity">
           <div className="flex justify-center gap-4 text-xs font-mono text-gray-600">
             <span className="bg-white/50 px-3 py-1 rounded-full">Manager: 0000</span>
             <span className="bg-white/50 px-3 py-1 rounded-full">Vendeur: 1234</span>
           </div>
        </div>
      </div>
    </div>
  );
};