import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MP2Input, PayoutType } from '../types';
import { calculateMP2 } from '../utils/calculations';
import { Tooltip } from './Tooltip';
import { Info, Table as TableIcon } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

import { triggerFlyingDollars } from './FlyingIcons';

interface Props {
  input: MP2Input;
  setInput: React.Dispatch<React.SetStateAction<MP2Input>>;
}

export const MP2Calc: React.FC<Props> = ({ input, setInput }) => {
  const result = useMemo(() => calculateMP2(input), [input]);
  const [showTable, setShowTable] = useState(false);

  const handlePrincipalChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'principal' | 'monthlyContribution') => {
    setInput({...input, [field]: Number(e.target.value)});
    if (e.target.value.length % 2 === 0 || e.target.value.length > 3) {
        triggerFlyingDollars(e);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold flex items-center justify-between">
            Contribution Mode
            <Tooltip content="Choose how you fund your MP2" position="top-right"><span className="text-teal-500 cursor-help">?</span></Tooltip>
          </label>
          <select 
            value={input.mode}
            onChange={(e) => setInput({...input, mode: e.target.value as any})}
            className="w-full bg-black/5 dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-lg px-4 py-3 outline-none focus:border-blue-500 dark:focus:border-teal-500 transition-colors"
          >
            <option value="one-time">One-Time (Lump Sum)</option>
            <option value="monthly">Monthly Contribution</option>
          </select>
        </div>

        {input.mode === 'one-time' ? (
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold flex items-center justify-between">
              <span>Principal Amount (PHP)</span>
              {input.principal > 0 && <span className="text-teal-500 font-mono text-xs ml-2">₱{input.principal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>}
            </label>
            <input 
              type="number" 
              value={input.principal || ''}
              onChange={(e) => {
                setInput({...input, principal: Number(e.target.value)});
                if (Number(e.target.value) % 10 === 0) triggerFlyingDollars(e as any);
              }}
              className="w-full bg-black/5 dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-lg px-4 py-3 outline-none focus:border-blue-500 dark:focus:border-teal-500 font-mono transition-colors"
            />
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold flex items-center justify-between">
              <span>Monthly Contribution (PHP)</span>
              {input.monthly > 0 && <span className="text-teal-500 font-mono text-xs ml-2">₱{input.monthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>}
            </label>
            <input 
              type="number" 
              value={input.monthlyContribution || ''}
              onChange={(e) => {
                setInput({...input, monthlyContribution: Number(e.target.value)});
                if (Number(e.target.value) % 10 === 0) triggerFlyingDollars(e as any);
              }}
              className="w-full bg-black/5 dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-lg px-4 py-3 outline-none focus:border-blue-500 dark:focus:border-teal-500 font-mono transition-colors"
            />
          </div>
        )}
        <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-tight italic mt-1">Note: Pag-IBIG limits MP2 savings to ₱20,000,000 per person. Larger inputs are allowed here solely for exploratory and imaginary projections.</p>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold flex items-center justify-between">
            <span className="flex items-center gap-2">Expected Dividend Rate (%) <Tooltip content="Historically 6% - 7.5%" position="top-right"><span className="text-teal-500 cursor-help">?</span></Tooltip></span>
            <span className="font-mono text-teal-400">{input.rate}%</span>
          </label>
          <div className="flex items-center gap-3">
            <input 
              type="range" min="0" max="15" step="0.1"
              value={input.rate}
              onChange={(e) => setInput({...input, rate: Number(e.target.value)})}
              className="flex-1 accent-blue-500 dark:accent-teal-500"
            />
            <input 
              type="number" value={input.rate || ''} onChange={(e) => setInput({...input, rate: Number(e.target.value)})}
              className="w-20 bg-black/5 dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-lg p-2 outline-none focus:border-blue-500 dark:focus:border-teal-500 text-center font-mono text-sm transition-colors"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold flex items-center justify-between">
            Tenor (Lock-in Period)
            <Tooltip content="Standard MP2 is 5 years. You can optionally reinvest for another 5." position="top-right"><span className="text-teal-500 cursor-help">?</span></Tooltip>
          </label>
          <select 
            value={input.tenor || 5}
            onChange={(e) => setInput({...input, tenor: Number(e.target.value) as 5 | 10})}
            className="w-full bg-black/5 dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-lg px-4 py-3 outline-none focus:border-blue-500 dark:focus:border-teal-500 transition-colors"
          >
            <option value={5}>5 Years</option>
            <option value={10}>10 Years</option>
          </select>
          {input.tenor === 10 && (
            <p className="text-[10px] text-emerald-600 dark:text-teal-500 leading-tight italic mt-1">
              MP2 naturally matures after 5 years. Pag-IBIG allows you to roll over your funds for another 5 years. After 10 years total, you must open a new account.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold flex items-center justify-between">
            Payout Type
            <Tooltip content="Compounded earns more over 5 years" position="top-right"><span className="text-teal-500 cursor-help">?</span></Tooltip>
          </label>
          <select 
            value={input.payoutType}
            onChange={(e) => setInput({...input, payoutType: e.target.value as PayoutType})}
            className="w-full bg-black/5 dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-lg px-4 py-3 outline-none focus:border-blue-500 dark:focus:border-teal-500 transition-colors"
          >
            <option value="compounded">Compounded (End of {input.tenor || 5} Years)</option>
            <option value="annual">Annual Payout</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold flex items-center justify-between">
            Enable Inflation Adjuster
            <Tooltip content="Calculate the 'real return' minus inflation effects." position="top-right"><span className="text-teal-500 cursor-help">?</span></Tooltip>
          </label>
          <div className="flex h-12 items-center">
            <button 
              onClick={() => setInput({ ...input, inflationEnabled: !input.inflationEnabled })}
              className={`w-full py-3 rounded-lg text-sm font-bold border transition ${input.inflationEnabled ? 'bg-purple-100 border-purple-200 text-purple-700 dark:bg-purple-500/20 dark:border-purple-500/30 dark:text-purple-400' : 'bg-black/5 dark:bg-black/50 border-black/10 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
            >
              {input.inflationEnabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>

        {input.inflationEnabled && (
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold flex items-center justify-between">
              Avg. Inflation Rate (%)
            </label>
            <div className="flex items-center gap-3">
              <input 
                type="range" min="0" max="15" step="0.1"
                value={input.inflationRate || 4}
                onChange={(e) => setInput({...input, inflationRate: Number(e.target.value)})}
                className="flex-1 accent-purple-500"
              />
              <input 
                type="number" value={input.inflationRate || 4} onChange={(e) => setInput({...input, inflationRate: Number(e.target.value)})}
                className="w-20 bg-black/5 dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-lg p-2 outline-none focus:border-purple-500 text-center font-mono text-sm transition-colors"
              />
            </div>
          </div>
        )}
      </div>

      <div className="bg-black/5 dark:bg-[#141417] p-6 rounded-2xl border border-black/10 dark:border-white/5" id="tour-mp2-metrics">
        <h3 className="text-lg font-medium mb-4">{input.tenor || 5}-Year Summary {input.payoutType === 'annual' && '(Annual Payouts)'}</h3>
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-black/5 dark:border-white/5">
            <span className="text-gray-600 dark:text-gray-400">Total Principal Deposit</span>
            <span className="font-mono font-medium">₱{result.totalContribution.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-black/5 dark:border-white/5" id="tour-mp2-dividends">
            <span className="text-gray-600 dark:text-gray-400">Total Dividends Earned (Tax-Free)</span>
            <span className="font-mono text-emerald-600 dark:text-teal-400 font-medium">+₱{result.totalDividends.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
          </div>
          <div className="p-4 sm:p-5 bg-white/50 dark:bg-black/40 rounded-2xl border border-black/5 dark:border-white/5 flex flex-col items-center sm:flex-row sm:justify-between gap-4">
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Total Valuation</p>
              <h2 className="text-lg sm:text-2xl font-bold font-mono text-gray-900 dark:text-white break-all">₱{result.totalValue.toLocaleString(undefined, {minimumFractionDigits: 2})}</h2>
            </div>
            {input.inflationEnabled && result.realTotalValue !== undefined && (
              <div className="bg-purple-50 dark:bg-purple-500/10 p-3 rounded-xl border border-purple-100 dark:border-purple-500/20 text-right">
                <span className="text-purple-700 dark:text-purple-400 font-bold text-[10px] uppercase tracking-widest flex items-center justify-end gap-1 mb-1">
                  Real Value <Tooltip content="The estimated purchasing power of your Final Total Value, adjusted for inflation over the term length." position="top-right"><span className="text-purple-700 dark:text-purple-400 cursor-help tracking-widest text-[8px] bg-purple-200 dark:bg-purple-500/20 px-1 rounded">INFO</span></Tooltip>
                </span>
                <span className="font-mono font-bold text-base text-purple-700 dark:text-purple-400 block">₱{result.realTotalValue.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="h-72 w-full pt-8 bg-black/5 dark:bg-[#141417] p-6 rounded-3xl border border-black/10 dark:border-white/5">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-semibold">{input.tenor || 5}-Year Growth Projection</h3>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-teal-500"></div><span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Total Value</span></div>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={result.projection} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="year" tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(val) => `₱${(val/1000).toFixed(0)}k`} tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 'bold' }} width={60} axisLine={false} tickLine={false} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
              <RechartsTooltip 
                formatter={(value: number) => [`₱${value.toLocaleString(undefined, {minimumFractionDigits: 2})}`, 'Total Value']}
                labelFormatter={(label) => `Year ${label}`}
                contentStyle={{ backgroundColor: 'rgba(20, 20, 23, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                itemStyle={{ color: '#14b8a6' }}
              />
              <Area type="monotone" dataKey="totalValue" stroke="#14b8a6" strokeWidth={2} fillOpacity={1} fill="url(#colorTotal)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex justify-center pt-2">
        <button
          onClick={() => setShowTable(!showTable)}
          className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-teal-500 dark:text-gray-400 dark:hover:text-teal-400 transition-colors bg-white hover:bg-teal-50 dark:bg-[#1f1f23] dark:hover:bg-teal-500/10 px-4 py-2 rounded-xl border border-black/10 dark:border-white/10"
        >
          <TableIcon size={16} />
          {showTable ? 'Hide' : 'View'} Detailed Breakdown Table
        </button>
      </div>

      <AnimatePresence>
        {showTable && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="overflow-x-auto bg-white dark:bg-[#141417] border border-black/10 dark:border-white/10 rounded-2xl shadow-sm mt-4">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-black/10 dark:border-white/10 bg-black/5 dark:bg-black/40 text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                    <th className="px-4 py-4 whitespace-nowrap">Year</th>
                    <th className="px-4 py-4 whitespace-nowrap">Total Contributed</th>
                    <th className="px-4 py-4 whitespace-nowrap">Dividends Earned (Yr)</th>
                    <th className="px-4 py-4 whitespace-nowrap text-right">Year-End Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/5 font-mono">
                  {result.projection.map((row, index) => (
                    <tr key={index} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 text-gray-800 dark:text-gray-300">
                        {row.year === 0 ? 'Start' : `Year ${row.year}`}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                        ₱{row.contribution.toLocaleString(undefined, {minimumFractionDigits: 2})}
                      </td>
                      <td className="px-4 py-3 text-emerald-600 dark:text-teal-400 font-medium">
                        {row.dividend > 0 ? '+' : ''}₱{row.dividend.toLocaleString(undefined, {minimumFractionDigits: 2})}
                      </td>
                      <td className="px-4 py-3 font-bold text-gray-900 dark:text-white text-right">
                        ₱{row.totalValue.toLocaleString(undefined, {minimumFractionDigits: 2})}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
