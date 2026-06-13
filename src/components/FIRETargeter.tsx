import React from 'react';
import { Flame, Compass, Coins } from 'lucide-react';
import { cn } from '../utils/cn';
import { playSound } from '../utils/audio';
import { FIREInput } from '../types';

interface FIRETargeterProps {
  input: FIREInput;
  setInput: (input: FIREInput) => void;
}

export const FIRETargeter = ({ input, setInput }: FIRETargeterProps) => {
  const { monthlyExpenses, instrument, annualRate } = input;

  const handleInstrumentChange = (mode: 'mp2' | 'tbond' | 'custom') => {
    let newRate = annualRate;
    if (mode === 'mp2') newRate = 6.5;
    // Note: RTB interest in PH is subject to 20% final withholding tax. 
    // Net yield = 6.25% * 0.8 = 5% for calculation purposes, or let's use gross or specify to the user.
    // We will use 5% net for RTB here.
    if (mode === 'tbond') newRate = 5.0; 
    setInput({ ...input, instrument: mode, annualRate: newRate });
  };

  const rateDec = annualRate / 100;
  const annualExpenses = monthlyExpenses * 12;
  const principalNeeded = rateDec > 0 ? annualExpenses / rateDec : 0;

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 bg-white dark:bg-[#1a1a1e] rounded-3xl shadow-xl border border-gray-100 dark:border-white/5 p-6 space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2 text-orange-500">
          <Flame /> F.I.R.E. Targeter
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Financial Independence, Retire Early. Tell us your monthly living expenses, and we'll calculate the exact principal you need invested so the dividends cover your life—forever.
        </p>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold flex items-center justify-between">
            <span>Target Monthly Expenses (PHP)</span>
            {monthlyExpenses > 0 && <span className="text-orange-500 font-mono text-xs ml-2">₱{monthlyExpenses.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>}
          </label>
          <input
            type="number"
            min="1000"
            className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 font-mono text-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition"
            value={monthlyExpenses || ''}
            onChange={(e) => setInput({ ...input, monthlyExpenses: Number(e.target.value) })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold flex items-center justify-between">
            Instrument Type
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button 
              onMouseEnter={() => playSound('hover')}
              onClick={() => { playSound('click'); handleInstrumentChange('mp2'); }}
              className={cn("py-2 px-3 rounded-xl text-xs font-bold transition transform outline-none focus:ring-2 focus:ring-orange-500 hover:scale-105 active:scale-95", instrument === 'mp2' ? "bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-500/30 shadow-sm" : "bg-gray-50 dark:bg-white/5 text-gray-500 border border-transparent hover:bg-gray-100 dark:hover:bg-white/10")}
            >
              MP2 (Tax-Free)
            </button>
            <button 
              onMouseEnter={() => playSound('hover')}
              onClick={() => { playSound('click'); handleInstrumentChange('tbond'); }}
              className={cn("py-2 px-3 rounded-xl text-xs font-bold transition transform outline-none focus:ring-2 focus:ring-orange-500 hover:scale-105 active:scale-95", instrument === 'tbond' ? "bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-500/30 shadow-sm" : "bg-gray-50 dark:bg-white/5 text-gray-500 border border-transparent hover:bg-gray-100 dark:hover:bg-white/10")}
            >
              RTB (Net Tax)
            </button>
            <button 
              onMouseEnter={() => playSound('hover')}
              onClick={() => { playSound('click'); handleInstrumentChange('custom'); }}
              className={cn("py-2 px-3 rounded-xl text-xs font-bold transition transform outline-none focus:ring-2 focus:ring-orange-500 hover:scale-105 active:scale-95", instrument === 'custom' ? "bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-500/30 shadow-sm" : "bg-gray-50 dark:bg-white/5 text-gray-500 border border-transparent hover:bg-gray-100 dark:hover:bg-white/10")}
            >
              Custom
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold flex items-center justify-between">
            Net Annual Return (%)
          </label>
          <input
            type="number"
            step="0.01"
            className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 font-mono text-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition"
            value={annualRate || ''}
            onChange={(e) => {
              setInput({ ...input, annualRate: Number(e.target.value), instrument: 'custom' });
            }}
          />
          {instrument === 'tbond' && (
            <p className="text-[10px] text-gray-400 mt-1">Assuming 6.25% gross minus 20% tax = 5.0% net yield.</p>
          )}
        </div>
      </div>

      <div className="flex-1 space-y-6">
        <div className="bg-gradient-to-br from-orange-500 to-rose-500 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
          
          <h3 className="text-sm font-medium opacity-90 uppercase tracking-widest mb-2 flex items-center gap-2">
            <Compass size={16} /> Financial Freedom Target
          </h3>
          <div className="text-5xl lg:text-5xl font-mono font-bold tracking-tight mb-2">
            ₱{(principalNeeded || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          <p className="text-sm opacity-90 leading-relaxed max-w-sm">
            Invest this amount once at a {annualRate}% net yield. You will generate exactly ₱{(annualExpenses || 0).toLocaleString()} a year—or ₱{(monthlyExpenses || 0).toLocaleString()} every single month—without ever touching your original principal again.
          </p>
        </div>
        
        <div className="bg-white dark:bg-[#1a1a1e] rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-white/5">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center text-orange-500">
              <Coins size={24} />
            </div>
            <div>
              <h4 className="font-bold text-gray-800 dark:text-gray-100">Live off the overflow</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">The principal remains yours.</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            By building a portfolio of this size, your money works for you. Whether you leave it permanently in MP2 or roll it over in Government Bonds, the yield covers your requested cost of living indefinitely.
          </p>
        </div>
      </div>
    </div>
  );
};
