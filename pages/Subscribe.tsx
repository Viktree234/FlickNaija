
import React, { useState } from 'react';
import Header from '../components/Header';
import { ICONS, COLORS } from '../constants';

const Subscribe: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="px-6 py-12 max-w-lg mx-auto">
        <div className="text-center space-y-6">
          <div 
            className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl"
            style={{ backgroundColor: `${COLORS.primary}20`, border: `2px solid ${COLORS.primary}` }}
          >
            🔔
          </div>
          <h2 className="text-3xl font-black">Never Miss a <span className="text-green-400">Vibe</span>.</h2>
          <p className="text-gray-400 leading-relaxed">
            Get weekly alerts about new Afro films, cheapest streaming deals, and low-data releases in Nigeria.
          </p>

          {status === 'success' ? (
            <div className="p-8 rounded-3xl bg-green-500/10 border border-green-500/30 space-y-4 animate-in zoom-in duration-300">
              <div className="w-12 h-12 bg-green-500 text-black rounded-full flex items-center justify-center mx-auto">
                <ICONS.Check />
              </div>
              <p className="text-green-400 font-bold">Oshey! You're on the list.</p>
              <button 
                onClick={() => setStatus('idle')}
                className="text-xs font-bold text-gray-500 uppercase tracking-widest hover:text-white transition"
              >
                Subscribe another email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email o..."
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-400 text-center transition-all"
              />
              <button 
                disabled={status === 'loading'}
                className="w-full py-4 bg-green-500 text-black font-black rounded-2xl shadow-xl shadow-green-500/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
              >
                {status === 'loading' ? 'Joining the tribe...' : 'Alert Me!'}
              </button>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                No spam, only the best Nollywood & Global content.
              </p>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default Subscribe;
