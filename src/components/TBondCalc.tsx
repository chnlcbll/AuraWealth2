import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TBondInput } from '../types';
import { calculateTBond } from '../utils/calculations';
import { Tooltip } from './Tooltip';
import { Info, Table as TableIcon } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

import { triggerFlyingDollars } from './FlyingIcons';

import { triggerFlyingDollars } from './FlyingIcons';

interface Props {
  input: TBondInput;
  setInput: React.Dispatch<React.SetStateAction<TBondInput>>;
}

export const TBondCalc: React.FC<Props> = ({ input, setInput }) => {
  const result = useMemo(() => calculateTBond(input), [input]);
  const [showTable, setShowTable] = useState(false);

  const handlePrincipalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({...input, principal: Number(e.target.value)});
    if (e.target.value.length % 2 === 0 || e.target.value.length > 5) {
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
        {/* Inputs */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold flex items-center justify-between">
            <span className="flex items-center gap-2">Principal Amount (PHP) <Tooltip content="The total investment amount" position="top-right"><span className="text-teal-500 cursor-help">?</span></Tooltip></span>
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

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold flex items-center justify-between">
            <span className="flex items-center gap-2">Annual Interest Rate (%) <Tooltip content="The coupon rate per year" position="top-right"><span className="text-teal-500 cursor-help">?</span></Tooltip></span>
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
            Term (Years)
          </label>
          <div className="flex bg-black/5 dark:bg-black/50 rounded-lg p-1 border border-black/10 dark:border-white/10">
            <button 
              onClick={() => setInput({...input, tenor: 5})}
              className={`flex-1 py-2 text-sm font-bold rounded-md transition ${input.tenor === 5 ? 'bg-white dark:bg-black text-blue-600 dark:text-teal-400 shadow-sm border border-black/5 dark:border-white/5' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
            >
              5 Years
            </button>
            <button 
              onClick={() => setInput({...input, tenor: 10})}
              className={`flex-1 py-2 text-sm font-bold rounded-md transition ${input.tenor === 10 ? 'bg-white dark:bg-black text-blue-600 dark:text-teal-400 shadow-sm border border-black/5 dark:border-white/5' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
            >
              10 Years
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold flex items-center justify-between">
            Withholding Tax (%) <Tooltip content="Standard is 20% in the Philippines" position="top-right"><span className="text-teal-500 cursor-help">?</span></Tooltip>
          </label>
          <div className="flex items-center gap-3">
            <input 
              type="range" min="0" max="30" step="1"
              value={input.taxRate}
              onChange={(e) => setInput({...input, taxRate: Number(e.target.value)})}
              className="flex-1 accent-blue-500 dark:accent-teal-500"
            />
            <input 
              type="number" value={input.taxRate || ''} onChange={(e) => setInput({...input, taxRate: Number(e.target.value)})}
              className="w-20 bg-black/5 dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-lg p-2 outline-none focus:border-blue-500 dark:focus:border-teal-500 text-center font-mono text-sm transition-colors"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold flex items-center justify-between">
            Bank Fee per Payout (PHP)
            <Tooltip content="Fees deducted by your bank per interest payout" position="top-right"><span className="text-teal-500 cursor-help">?</span></Tooltip>
          </label>
          <input 
            type="number" 
            value={input.bankFee}
            onChange={(e) => setInput({...input, bankFee: Number(e.target.value)})}
            className="w-full bg-black/5 dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-lg px-4 py-3 outline-none focus:border-blue-500 dark:focus:border-teal-500 font-mono transition-colors"
          />
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
      
      <div className="text-xs text-center text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-teal-500/10 p-3 rounded-lg border border-blue-100 dark:border-teal-500/20">
        <strong className="text-blue-700 dark:text-teal-400 font-bold">Note:</strong> RTB dividends are typically paid out <strong>quarterly</strong> straight to your settlement account.
      </div>

      <div className="bg-black/5 dark:bg-[#141417] p-6 rounded-2xl border border-black/10 dark:border-white/5" id="tour-rtb-metrics">
        <h3 className="text-lg font-medium mb-4">Financial Metrics</h3>
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-black/5 dark:border-white/5">
            <span className="text-gray-600 dark:text-gray-400">Principal Deposit</span>
            <span className="font-mono font-medium">₱{input.principal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-black/5 dark:border-white/5" id="tour-quarterly-payout">
            <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">Net Quarterly Payout <Tooltip content="This is what you actually receive every 3 months." position="top-right"><span className="text-teal-500 cursor-help">?</span></Tooltip></span>
            <span className="font-mono text-emerald-600 dark:text-teal-400 font-bold">₱{result.netQuarterly.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-black/5 dark:border-white/5">
            <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">Equivalent Monthly <Tooltip content="The monthly equivalent of your quarterly payout." position="top-right"><span className="text-teal-500 cursor-help">?</span></Tooltip></span>
            <span className="font-mono text-emerald-600/70 dark:text-teal-400/70 font-medium">₱{(result.netQuarterly / 3).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-black/5 dark:border-white/5">
            <span className="text-gray-600 dark:text-gray-400">Total Interest Earned ({input.tenor} Yrs)</span>
            <span className="font-mono font-medium text-blue-600 dark:text-blue-400">+₱{result.totalEarnings.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
          </div>
          <div className="flex justify-between py-2 pt-4">
            <span className="font-bold text-sm uppercase tracking-widest text-gray-500">Total Value After {input.tenor} Yrs</span>
            <span className="font-mono font-bold text-xl text-indigo-600 dark:text-indigo-400">₱{result.totalValue.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
          </div>
          {input.inflationEnabled && result.realTotalValue !== undefined && (
            <div className="flex justify-between py-2 items-center bg-purple-50 dark:bg-purple-500/10 p-3 rounded-xl border border-purple-100 dark:border-purple-500/20 mt-2">
              <span className="text-purple-700 dark:text-purple-400 font-bold text-sm tracking-tight flex items-center gap-1">Real Total Value <Tooltip content="The estimated purchasing power of your Final Total Value, adjusted for inflation over the term length." position="top-right"><span className="text-purple-700 dark:text-purple-400 cursor-help tracking-widest text-[10px]">INFO</span></Tooltip></span>
              <span className="font-mono font-bold text-purple-700 dark:text-purple-400">₱{result.realTotalValue.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
            </div>
          )}
        </div>
      </div>

      <div className="h-72 w-full pt-8 bg-black/5 dark:bg-[#141417] p-6 rounded-3xl border border-black/10 dark:border-white/5">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-semibold">Growth Projection</h3>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-teal-500"></div><span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Income</span></div>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={result.projection} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="year" tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(val) => `₱${(val/1000).toFixed(0)}k`} tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 'bold' }} width={60} axisLine={false} tickLine={false} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
              <RechartsTooltip 
                formatter={(value: number) => [`₱${value.toLocaleString(undefined, {minimumFractionDigits: 2})}`, 'Accumulated']}
                labelFormatter={(label) => `Year ${label}`}
                contentStyle={{ backgroundColor: 'rgba(20, 20, 23, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                itemStyle={{ color: '#14b8a6' }}
              />
              <Area type="monotone" dataKey="accumulatedIncome" stroke="#14b8a6" strokeWidth={2} fillOpacity={1} fill="url(#colorIncome)" />
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
                    <th className="px-4 py-4 whitespace-nowrap">Principal</th>
                    <th className="px-4 py-4 whitespace-nowrap">Accumulated Interest</th>
                    <th className="px-4 py-4 whitespace-nowrap text-right">Total Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/5 font-mono">
                  {result.projection.map((row, index) => (
                    <tr key={index} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 text-gray-800 dark:text-gray-300">
                        {row.year === 0 ? 'Start' : `Year ${row.year}`}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                        ₱{row.totalValue.toLocaleString(undefined, {minimumFractionDigits: 2})}
                      </td>
                      <td className="px-4 py-3 text-emerald-600 dark:text-teal-400 font-medium">
                        {row.accumulatedIncome > 0 ? '+' : ''}₱{row.accumulatedIncome.toLocaleString(undefined, {minimumFractionDigits: 2})}
                      </td>
                      <td className="px-4 py-3 font-bold text-gray-900 dark:text-white text-right">
                        ₱{(row.totalValue + row.accumulatedIncome).toLocaleString(undefined, {minimumFractionDigits: 2})}
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
