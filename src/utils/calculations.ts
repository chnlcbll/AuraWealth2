import { TBondInput, MP2Input } from "../types";

export interface TBondResult {
  grossAnnual: number;
  tax: number;
  bankFeesAnnual: number;
  netAnnual: number;
  netQuarterly: number;
  monthlyEquivalent: number;
  totalEarnings: number;
  totalValue: number;
  realTotalValue?: number;
  projection: { year: number; totalValue: number; accumulatedIncome: number; }[];
}

export const calculateTBond = (input: TBondInput): TBondResult => {
  const grossAnnual = input.principal * (input.rate / 100);
  const tax = grossAnnual * (input.taxRate / 100);
  const bankFeesAnnual = input.bankFee * input.bankFeeFrequency;
  
  const netAnnual = grossAnnual - tax - bankFeesAnnual;
  const netQuarterly = netAnnual / 4;
  const monthlyEquivalent = netAnnual / 12;
  const years = input.tenor || 5;

  const totalEarnings = netAnnual * years;
  const totalValue = input.principal + totalEarnings;
  
  let realTotalValue = undefined;
  if (input.inflationEnabled && input.inflationRate !== undefined) {
     realTotalValue = totalValue / Math.pow(1 + (input.inflationRate / 100), years);
  }

  const projection = Array.from({ length: years + 1 }, (_, i) => ({
    year: i,
    totalValue: input.principal,
    accumulatedIncome: netAnnual * i,
  }));

  return { grossAnnual, tax, bankFeesAnnual, netAnnual, netQuarterly, monthlyEquivalent, totalEarnings, totalValue, realTotalValue, projection };
};

export interface MP2Result {
  totalContribution: number;
  totalDividends: number;
  totalValue: number;
  realTotalValue?: number;
  projection: { year: number; contribution: number; dividend: number; totalValue: number; }[];
}

export const calculateMP2 = (input: MP2Input): MP2Result => {
  let projection = [];
  const years = input.tenor || 5;
  const rate = input.rate / 100;
  
  if (input.payoutType === 'annual') {
    let totalContribution = input.principal;
    let currentPrincipal = input.principal;
    let accumulatedDividend = 0;
    
    projection.push({ year: 0, contribution: currentPrincipal, dividend: 0, totalValue: currentPrincipal });
    
    for (let yr = 1; yr <= years; yr++) {
      if (input.mode === 'monthly') {
        const annualContri = input.monthlyContribution * 12;
        currentPrincipal += annualContri;
        totalContribution += annualContri;
      }
      
      const dividend = currentPrincipal * rate; // Actually MP2 calculates based on average monthly balance but simple estimation:
      accumulatedDividend += dividend;
      projection.push({
        year: yr,
        contribution: totalContribution,
        dividend: dividend,
        totalValue: totalContribution // Principal isn't compounding
      });
    }
    
    let realTotalValue = undefined;
    if (input.inflationEnabled && input.inflationRate !== undefined) {
      realTotalValue = totalContribution / Math.pow(1 + (input.inflationRate / 100), years); // For payout type we just rough estimate
    }
    
    return {
      totalContribution,
      totalDividends: accumulatedDividend,
      totalValue: totalContribution, // Dividends paid out
      realTotalValue,
      projection
    };
  } else {
    // Compounded
    let currentBalance = input.principal;
    let totalContribution = input.principal;
    let accumulatedDividend = 0;
    
    projection.push({ year: 0, contribution: totalContribution, dividend: 0, totalValue: currentBalance });

    for (let yr = 1; yr <= years; yr++) {
      let annualContri = 0;
      let dividend = 0;
      
      if (input.mode === 'monthly') {
        annualContri = input.monthlyContribution * 12;
        totalContribution += annualContri;
        
        // Simplified: (Previous Balance + (Annual Contri / 2)) * Rate
        // Since contribution is spread across the year, only half earns full year dividend effectively
        // This is a rough estimation of pag-ibig formula
        const averageBalance = currentBalance + (annualContri / 2);
        dividend = averageBalance * rate;
        
        currentBalance += annualContri + dividend;
      } else {
        dividend = currentBalance * rate;
        currentBalance += dividend;
      }
      
      accumulatedDividend += dividend;
      
      projection.push({
        year: yr,
        contribution: totalContribution,
        dividend,
        totalValue: currentBalance
      });
    }

    let realTotalValue = undefined;
    if (input.inflationEnabled && input.inflationRate !== undefined) {
      realTotalValue = currentBalance / Math.pow(1 + (input.inflationRate / 100), years);
    }

    return {
      totalContribution,
      totalDividends: accumulatedDividend,
      totalValue: currentBalance,
      realTotalValue,
      projection
    };
  }
};
