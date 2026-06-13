import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { SavedCalculation } from '../types';
import { calculateMP2, calculateTBond } from '../utils/calculations';
import { ArrowRight, Wallet, PieChart, Clock, PlusCircle, LayoutDashboard, Calculator, Landmark, PiggyBank } from 'lucide-react';
import { playSound } from '../utils/audio';
import { MOCK_MESSAGES } from '../data/messages';

interface Props {
  savedItems: SavedCalculation[];
  onNavigate: (view: 'tbond' | 'mp2' | 'goalseek' | 'fire' | 'compare') => void;
  onLoad: (item: SavedCalculation) => void;
  username: string;
}

export const Dashboard: React.FC<Props> = ({ savedItems, onNavigate, onLoad, username }) => {
  const [currentMessage, setCurrentMessage] = useState(MOCK_MESSAGES[0]);

  const [currentColor, setCurrentColor] = useState('text-teal-500');

  useEffect(() => {
    const messageInterval = setInterval(() => {
      const randomMsg = MOCK_MESSAGES[Math.floor(Math.random() * MOCK_MESSAGES.length)];
      setCurrentMessage(randomMsg);
    }, 5000);
    
    const colors = ['text-teal-500 text-shadow-sm', 'text-blue-500 text-shadow-sm', 'text-emerald-500 text-shadow-sm', 'text-indigo-500 text-shadow-sm', 'text-purple-500 text-shadow-sm'];
    let colorIndex = 0;
    const colorInterval = setInterval(() => {
      colorIndex = (colorIndex + 1) % colors.length;
      setCurrentColor(colors[colorIndex]);
    }, 3000);

    return () => {
      clearInterval(messageInterval);
      clearInterval(colorInterval);
    };
  }, []);
  const stats = useMemo(() => {
    let totalInvested = 0;
    let projReturns = 0;
    
    savedItems.forEach(item => {
      if (item.type === 'tbond' && item.tbondInput) {
        totalInvested += item.tbondInput.principal;
        const res = calculateTBond(item.tbondInput);
        projReturns += res.netAnnual * 10; // Simple 10yr estimate
      } else if (item.type === 'mp2' && item.mp2Input) {
        const res = calculateMP2(item.mp2Input);
        totalInvested += res.totalContribution;
        projReturns += res.totalDividends;
      }
    });

    return { totalInvested, projReturns, count: savedItems.length };
  }, [savedItems]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-12 relative z-10"
    >
      <div className="flex flex-col md:flex-row gap-8 items-start">
        
        <div className="flex-1 space-y-6 w-full">
          <div className="mb-4" id="tour-welcome">
            <h1 className="text-3xl font-bold mb-2">Portfolio Overview</h1>
            <p className="text-gray-500 dark:text-gray-400">Hi <span className={`transition-colors duration-1000 ${currentColor} font-bold`}>{username ? username : 'User'}</span>! <span className="text-teal-600 dark:text-teal-400 font-medium">{currentMessage}</span></p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-[#141417] p-6 rounded-3xl border border-gray-200 dark:border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all"></div>
              <div className="flex items-center gap-3 mb-4 text-gray-500 dark:text-gray-400">
                <Wallet size={18} className="text-blue-500"/>
                <h3 className="text-xs uppercase font-bold tracking-widest">Total Monitored</h3>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold font-mono text-gray-900 dark:text-white break-all">
                <span className="text-blue-500/50 mr-1">₱</span>
                {stats.totalInvested.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}
              </h2>
            </div>
            
            <div className="bg-white dark:bg-[#141417] p-6 rounded-3xl border border-gray-200 dark:border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 dark:bg-teal-500/5 rounded-full blur-3xl group-hover:bg-teal-500/20 transition-all"></div>
              <div className="flex items-center gap-3 mb-4 text-gray-500 dark:text-gray-400">
                <PieChart size={18} className="text-emerald-500 dark:text-teal-400"/>
                <h3 className="text-xs uppercase font-bold tracking-widest">Est. Returns</h3>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold font-mono text-gray-900 dark:text-white break-all text-emerald-600 dark:text-teal-400">
                <span className="opacity-50 mr-1">+₱</span>
                {stats.projReturns.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}
              </h2>
            </div>
          </div>

          <div className="bg-gray-100 dark:bg-[#1a1a1e] p-8 rounded-3xl border border-gray-200 dark:border-white/5 mt-8" id="tour-new-projection">
            <h3 className="font-bold mb-6 flex items-center gap-2 text-lg">
              <Calculator className="text-teal-500"/>
              Create New Projection
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button 
                id="tour-rtb-btn"
                onClick={() => { playSound(); onNavigate('tbond'); }}
                className="flex flex-col items-center justify-center p-6 bg-white dark:bg-[#141417] rounded-2xl hover:border-blue-500 dark:hover:border-teal-500 border border-transparent transition-all group shadow-sm dark:shadow-none"
              >
                <div className="w-16 h-16 bg-blue-50 dark:bg-black/40 border border-blue-100 dark:border-white/5 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner">
                  <Landmark className="text-blue-600 dark:text-blue-400" size={28} />
                </div>
                <h4 className="font-bold text-[13px] text-gray-900 dark:text-white">Treasury Bonds</h4>
                <p className="text-[10px] text-gray-500 mt-2 text-center uppercase tracking-widest font-bold">Quarterly Payouts</p>
              </button>
              <button 
                id="tour-mp2-btn"
                onClick={() => { playSound(); onNavigate('mp2'); }}
                className="flex flex-col items-center justify-center p-6 bg-white dark:bg-[#141417] rounded-2xl hover:border-emerald-500 dark:hover:border-teal-500 border border-transparent transition-all group shadow-sm dark:shadow-none"
              >
                <div className="w-16 h-16 bg-emerald-50 dark:bg-black/40 border border-emerald-100 dark:border-white/5 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner">
                  <PiggyBank className="text-emerald-600 dark:text-teal-400" size={28} />
                </div>
                <h4 className="font-bold text-[13px] text-gray-900 dark:text-white">Pag-IBIG MP2</h4>
                <p className="text-[10px] text-gray-500 mt-2 text-center uppercase tracking-widest font-bold">Tax-free Compound</p>
              </button>
              <button 
                onClick={() => { playSound(); onNavigate('compare'); }}
                className="flex flex-col items-center justify-center p-6 bg-white dark:bg-[#141417] rounded-2xl hover:border-indigo-500 dark:hover:border-indigo-500 border border-transparent transition-all group shadow-sm dark:shadow-none"
              >
                <div className="w-16 h-16 bg-indigo-50 dark:bg-black/40 border border-indigo-100 dark:border-white/5 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner">
                  <ArrowRight className="text-indigo-600 dark:text-indigo-400" size={24} />
                  <ArrowRight className="text-indigo-600 dark:text-indigo-400 rotate-180 -ml-2" size={24} />
                </div>
                <h4 className="font-bold text-[13px] text-gray-900 dark:text-white">RTB vs. MP2</h4>
                <p className="text-[10px] text-gray-500 mt-2 text-center uppercase tracking-widest font-bold">Visual Showdown</p>
              </button>
              <button 
                onClick={() => { playSound(); onNavigate('fire'); }}
                className="flex flex-col items-center justify-center p-6 bg-white dark:bg-[#141417] rounded-2xl hover:border-orange-500 dark:hover:border-orange-500 border border-transparent transition-all group shadow-sm dark:shadow-none"
              >
                <div className="w-16 h-16 bg-orange-50 dark:bg-black/40 border border-orange-100 dark:border-white/5 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner">
                  <PieChart className="text-orange-600 dark:text-orange-400" size={28} />
                </div>
                <h4 className="font-bold text-[13px] text-gray-900 dark:text-white">F.I.R.E. Targeter</h4>
                <p className="text-[10px] text-gray-500 mt-2 text-center uppercase tracking-widest font-bold">Live Off Dividends</p>
              </button>
            </div>
          </div>
        </div>

        <div className="w-full md:w-80 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/5 pb-4">
            <h3 className="font-bold text-sm uppercase tracking-widest text-gray-500 flex items-center gap-2">
              <Clock size={16}/> Recent Snapshots
            </h3>
            <span className="text-xs bg-gray-200 dark:bg-white/10 px-2 py-1 rounded-md text-gray-600 dark:text-gray-400 font-bold">{stats.count}</span>
          </div>
          
          {savedItems.length === 0 ? (
             <div className="text-center py-10 text-gray-500 border border-dashed border-gray-300 dark:border-white/10 rounded-2xl flex flex-col items-center">
               <div className="w-10 h-10 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-3">
                 <PlusCircle size={20} className="text-gray-400"/>
               </div>
               <p className="text-sm">No snapshots saved yet.</p>
               <p className="text-xs mt-1 text-gray-400">Go to a calculator to create one.</p>
             </div>
          ) : (
            <div className="space-y-3">
              {savedItems.slice(0, 5).map(item => (
                <div 
                  key={item.id} 
                  onClick={() => onLoad(item)}
                  className="p-4 bg-white dark:bg-[#141417] rounded-2xl border border-gray-100 dark:border-white/5 cursor-pointer hover:border-gray-300 dark:hover:border-teal-500/50 transition-colors group flex items-center justify-between shadow-sm dark:shadow-none"
                >
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate max-w-[180px]">{item.name}</h4>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">
                      {item.type === 'tbond' ? 'T-bond' : 'MP2'} • {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <ArrowRight size={16} className="text-gray-300 dark:text-gray-600 group-hover:text-teal-500 transition-colors transform group-hover:translate-x-1"/>
                </div>
              ))}
              {savedItems.length > 5 && (
                 <p className="text-xs text-center text-gray-500 pt-2">View all from the Saved tab</p>
              )}
            </div>
          )}
        </div>

      </div>
    </motion.div>
  );
};
