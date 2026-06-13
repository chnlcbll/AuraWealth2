import React, { useState } from 'react';
import { BarChart as BarChartIcon, Trophy, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { cn } from '../utils/cn';

export const ComparisonChart = () => {
  const [lumpSum, setLumpSum] = useState<number>(500000);
  const [years, setYears] = useState<number>(5);
  const [mp2Rate, setMp2Rate] = useState<number>(6.5);
  const [rtbGrossRate, setRtbGrossRate] = useState<number>(6.25);

  const rtbNetRate = rtbGrossRate * 0.8; // 20% withholding tax

  // Calculate MP2 over 5 years
  // Usually compound interest for MP2
  const generateChartData = () => {
    let currentMp2 = lumpSum;
    let currentRtbAccumulated = 0;
    
    // MP2 compounds annually. RTB pays quarterly, but let's compare simple annual totals for visualization
    const rtbAnnualPayout = lumpSum * (rtbNetRate / 100);

    const data = [];
    
    for (let i = 1; i <= years; i++) {
        const mp2Dividend = currentMp2 * (mp2Rate / 100);
        currentMp2 += mp2Dividend;
        currentRtbAccumulated += rtbAnnualPayout;

        data.push({
            year: `Year ${i}`,
            MP2: Math.round(currentMp2 - lumpSum),
            RTB: Math.round(currentRtbAccumulated),
        });
    }
    
    return data;
  };

  const chartData = generateChartData();
  const mp2TotalNet = chartData.length > 0 ? chartData[chartData.length - 1].MP2 : 0;
  const rtbTotalNet = chartData.length > 0 ? chartData[chartData.length - 1].RTB : 0;
  const rtbGrossTotal = lumpSum * (rtbGrossRate / 100) * years;
  const rtbTaxLost = rtbGrossTotal - rtbTotalNet;

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 bg-white dark:bg-[#1a1a1e] rounded-3xl shadow-xl border border-gray-100 dark:border-white/5 p-6 space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-500">
          <BarChartIcon /> Head-to-Head: RTB vs. MP2
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Have a lump sum? Compare exactly how much interest it will generate in Pag-IBIG MP2 vs Retail Treasury Bonds over {years} years.
        </p>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold flex items-center justify-between">
            <span>Lump Sum Investment (PHP)</span>
            {lumpSum > 0 && <span className="text-indigo-500 font-mono text-xs ml-2">₱{lumpSum.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>}
          </label>
          <input
            type="number"
            min="1000"
            className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 font-mono text-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
            value={lumpSum || ''}
            onChange={(e) => setLumpSum(Number(e.target.value))}
          />
        </div>

        <div className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-teal-600 dark:text-teal-400 font-bold justify-between">
                        MP2 Annual Rate (%)
                    </label>
                    <input
                        type="number"
                        step="0.1"
                        className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 font-mono text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition"
                        value={mp2Rate || ''}
                        onChange={(e) => setMp2Rate(Number(e.target.value))}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-blue-600 dark:text-blue-400 font-bold justify-between">
                        RTB Gross Rate (%)
                    </label>
                    <input
                        type="number"
                        step="0.1"
                        className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 font-mono text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                        value={rtbGrossRate || ''}
                        onChange={(e) => setRtbGrossRate(Number(e.target.value))}
                    />
                </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold flex items-center justify-between">
                Time Horizon (Years)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="text-right font-mono font-medium text-indigo-600 dark:text-indigo-400">
                {years} Years
              </div>
            </div>
        </div>

        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl p-4 flex gap-3 text-red-800 dark:text-red-300 text-sm">
            <AlertTriangle className="shrink-0" size={18} />
            <p>
                <strong>The 20% Tax Drag:</strong> RTB earnings are subject to a 20% final withholding tax. MP2 dividends are completely tax-free.
            </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col space-y-6">
        <div className="bg-white dark:bg-[#1a1a1e] rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-white/5 flex-1 flex flex-col">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
            <Trophy className="text-yellow-500" size={16} /> Total Net Interest Earned
          </h3>
          
          <div className="h-[250px] w-full sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-gray-200 dark:text-gray-800" />
                <XAxis dataKey="year" fontSize={12} tickLine={false} axisLine={false} stroke="gray" />
                <YAxis 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  stroke="gray" 
                  tickFormatter={(val) => `₱${(val / 1000).toFixed(0)}k`}
                />
                <RechartsTooltip 
                  cursor={{ fill: 'transparent' }}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white dark:bg-[#1a1a1e] p-3 rounded-xl shadow-lg border border-gray-100 dark:border-white/10 text-sm">
                          <p className="font-bold text-gray-800 dark:text-gray-100 mb-2">{label}</p>
                          {payload.map((entry, index) => (
                            <div key={index} className="flex justify-between gap-4 font-mono">
                              <span style={{ color: entry.color }}>{entry.name}:</span>
                              <span className="font-bold text-gray-900 dark:text-white">₱{Number(entry.value).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="MP2" name="MP2 Total Net" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="RTB" name="RTB Total Net" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div className="bg-teal-50 dark:bg-teal-500/10 rounded-2xl p-4 border border-teal-200 dark:border-teal-500/20">
                <p className="text-[10px] text-teal-600 dark:text-teal-400 font-bold uppercase tracking-widest">MP2 Total Net</p>
                <p className="font-mono text-xl font-bold dark:text-gray-100 mt-1">₱{mp2TotalNet.toLocaleString(undefined, {maximumFractionDigits:0})}</p>
                <div className="text-[10px] text-gray-500 mt-2">No tax deducted. Compound growth.</div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-500/10 rounded-2xl p-4 border border-blue-200 dark:border-blue-500/20">
                <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest">RTB Total Net</p>
                <p className="font-mono text-xl font-bold dark:text-gray-100 mt-1">₱{rtbTotalNet.toLocaleString(undefined, {maximumFractionDigits:0})}</p>
                <div className="text-[10px] text-red-500 mt-2 font-medium">Lost to tax: ₱{rtbTaxLost.toLocaleString(undefined, {maximumFractionDigits:0})}</div>
            </div>
        </div>

      </div>
    </div>
  );
};
