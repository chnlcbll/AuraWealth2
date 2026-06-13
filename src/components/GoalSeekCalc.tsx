import React, { useState } from 'react';
import { Target, TrendingUp, Wallet } from 'lucide-react';
import { cn } from '../utils/cn';
import { playSound } from '../utils/audio';

export const GoalSeekCalc = () => {
  const [targetAmount, setTargetAmount] = useState<number>(1000000);
  const [years, setYears] = useState<number>(5);
  const [instrument, setInstrument] = useState<'mp2' | 'tbond' | 'custom'>('mp2');
  const [annualRate, setAnnualRate] = useState<number>(6.5);
  
  // Future Value (FV) = PV * (1 + r)^n
  // -> PV = FV / (1 + r)^n
  const rateDec = annualRate / 100;
  const upfrontRequired = targetAmount / Math.pow(1 + rateDec, years);
  
  // FV of an annuity = P * [ ((1 + r)^n - 1) / r ]
  // (Assuming annual contributions for simplicity, but let's do monthly contributions):
  // Monthly rate = r/12, total periods = n*12
  const monthlyRateDec = rateDec / 12;
  const months = years * 12;
  const monthlyRequired = targetAmount / ( (Math.pow(1 + monthlyRateDec, months) - 1) / monthlyRateDec );

  const handleInstrumentChange = (mode: 'mp2' | 'tbond' | 'custom') => {
    setInstrument(mode);
    if (mode === 'mp2') setAnnualRate(6.5);
    if (mode === 'tbond') setAnnualRate(6.25);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Input Section */}
      <div className="flex-1 bg-white dark:bg-[#1a1a1e] rounded-3xl shadow-xl border border-gray-100 dark:border-white/5 p-6 space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Target className="text-fuchsia-500" /> Goal-Seek Calculator
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Reverse-engineer your investments for both MP2, Treasury Bonds, or any custom instrument. Tell us your target, and we'll tell you how much to deposit.
        </p>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold flex items-center justify-between">
            Instrument Type
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button 
              onMouseEnter={() => playSound('hover')}
              onClick={() => { playSound('click'); handleInstrumentChange('mp2'); }}
              className={cn("py-2 px-3 rounded-xl text-xs font-bold transition transform outline-none focus:ring-2 focus:ring-fuchsia-500 hover:scale-105 active:scale-95", instrument === 'mp2' ? "bg-fuchsia-100 dark:bg-fuchsia-500/20 text-fuchsia-700 dark:text-fuchsia-400 border border-fuchsia-200 dark:border-fuchsia-500/30 shadow-sm" : "bg-gray-50 dark:bg-white/5 text-gray-500 border border-transparent hover:bg-gray-100 dark:hover:bg-white/10")}
            >
              Pag-IBIG MP2
            </button>
            <button 
              onMouseEnter={() => playSound('hover')}
              onClick={() => { playSound('click'); handleInstrumentChange('tbond'); }}
              className={cn("py-2 px-3 rounded-xl text-xs font-bold transition transform outline-none focus:ring-2 focus:ring-fuchsia-500 hover:scale-105 active:scale-95", instrument === 'tbond' ? "bg-fuchsia-100 dark:bg-fuchsia-500/20 text-fuchsia-700 dark:text-fuchsia-400 border border-fuchsia-200 dark:border-fuchsia-500/30 shadow-sm" : "bg-gray-50 dark:bg-white/5 text-gray-500 border border-transparent hover:bg-gray-100 dark:hover:bg-white/10")}
            >
              Treasury Bond
            </button>
            <button 
              onMouseEnter={() => playSound('hover')}
              onClick={() => { playSound('click'); handleInstrumentChange('custom'); }}
              className={cn("py-2 px-3 rounded-xl text-xs font-bold transition transform outline-none focus:ring-2 focus:ring-fuchsia-500 hover:scale-105 active:scale-95", instrument === 'custom' ? "bg-fuchsia-100 dark:bg-fuchsia-500/20 text-fuchsia-700 dark:text-fuchsia-400 border border-fuchsia-200 dark:border-fuchsia-500/30 shadow-sm" : "bg-gray-50 dark:bg-white/5 text-gray-500 border border-transparent hover:bg-gray-100 dark:hover:bg-white/10")}
            >
              Custom
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold flex items-center justify-between">
            <span>Target Goal (PHP)</span>
            {targetAmount > 0 && <span className="text-fuchsia-500 font-mono text-xs ml-2">₱{targetAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>}
          </label>
          <input
            type="number"
            min="1000"
            className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 font-mono text-lg focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 outline-none transition"
            value={targetAmount || ''}
            onChange={(e) => setTargetAmount(Number(e.target.value))}
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold flex items-center justify-between">
            Time Horizon (Years)
          </label>
          <input
            type="range"
            min="1"
            max="30"
            value={years}
            onMouseEnter={() => playSound('hover')}
            onChange={(e) => { playSound('click'); setYears(Number(e.target.value)); }}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-fuchsia-500 hover:opacity-80 transition"
          />
          <div className="text-right font-mono font-medium text-fuchsia-600 dark:text-fuchsia-400">
            {years} Years
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold flex items-center justify-between">
            Expected Annual Return (%)
          </label>
          <input
            type="number"
            step="0.01"
            className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 font-mono text-lg focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 outline-none transition"
            value={annualRate || ''}
            onChange={(e) => {
              setAnnualRate(Number(e.target.value));
              setInstrument('custom');
            }}
          />
        </div>
      </div>

      {/* Output Section */}
      <div className="flex-1 space-y-6">
        <div className="bg-gradient-to-br from-fuchsia-500 to-rose-600 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
          
          <h3 className="text-sm font-medium opacity-90 uppercase tracking-widest mb-2 flex items-center gap-2">
            <Wallet size={16} /> One-Time Upfront Deposit
          </h3>
          <div className="text-5xl font-mono font-bold tracking-tight mb-2">
            ₱{upfrontRequired.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          <p className="text-sm opacity-80 leading-relaxed mb-6">
            Deposit this exact amount today at {annualRate}%, and don't touch it. In {years} years, it will grow to exactly ₱{targetAmount.toLocaleString()}.
          </p>
        </div>

        <div className="bg-white dark:bg-[#1a1a1e] rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-white/5">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 flex items-center gap-2">
            <TrendingUp size={16} /> Or regular Monthly Deposit
          </h3>
          <div className="text-4xl font-mono font-bold text-gray-800 dark:text-gray-100 mb-2">
            ₱{monthlyRequired.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            Contribute this amount faithfully every month for {years} years at {annualRate}% annual interest to reach ₱{targetAmount.toLocaleString()}.
          </p>
        </div>
      </div>
    </div>
  );
};
