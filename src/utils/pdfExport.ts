import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SavedCalculation } from '../types';
import { calculateTBond, calculateMP2 } from './calculations';

const addHeader = (doc: jsPDF, title: string, subtitle: string) => {
  doc.setFontSize(22);
  doc.setTextColor(30, 30, 30);
  doc.text(title, 14, 22);
  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  doc.text(subtitle, 14, 30);
};

export const generateCombinedPDF = (items: SavedCalculation[]) => {
  const doc = new jsPDF();
  
  items.forEach((item, index) => {
    if (index > 0) doc.addPage();
    renderItem(doc, item);
  });

  doc.save(`AuraWealth_Calculations_Report.pdf`);
};

export const generatePDF = (item: SavedCalculation) => {
  const doc = new jsPDF();
  renderItem(doc, item);
  doc.save(`AuraWealth_${item.name.replace(/\s+/g, '_')}_Report.pdf`);
};

const renderItem = (doc: jsPDF, item: SavedCalculation) => {
  const dateStr = new Date(item.createdAt).toLocaleDateString();
  let typeStr = 'Report';
  if (item.type === 'tbond') typeStr = 'Retail Treasury Bond (RTB)';
  else if (item.type === 'mp2') typeStr = 'Pag-IBIG MP2';
  else if (item.type === 'compare') typeStr = 'RTB vs MP2 Comparison';
  else if (item.type === 'goalseek') typeStr = 'Goal Seek Calculator';
  else if (item.type === 'fire') typeStr = 'F.I.R.E. Targeter';
  
  addHeader(doc, item.name, `${typeStr} - Generated on ${dateStr}`);

  let yPos = 40;

  if (item.type === 'tbond' && item.tbondInput) {
    const res = calculateTBond(item.tbondInput);
    
    autoTable(doc, {
      startY: yPos,
      head: [['Input Parameter', 'Value']],
      body: [
        ['Principal Amount', `PHP ${item.tbondInput.principal.toLocaleString()}`],
        ['Annual Rate (Gross)', `${item.tbondInput.rate}%`],
        ['Withholding Tax', `${item.tbondInput.taxRate}%`],
        ['Tenor', `${item.tbondInput.tenor} Years`]
      ],
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] }
    });
    
    yPos = (doc as any).lastAutoTable.finalY + 10;
    
    autoTable(doc, {
      startY: yPos,
      head: [['Metric', 'Value']],
      body: [
        ['Gross Annual Interest', `PHP ${res.grossAnnual.toLocaleString()}`],
        ['Net Annual Interest', `PHP ${res.netAnnual.toLocaleString()}`],
        ['Net Quarterly Payout', `PHP ${res.netQuarterly.toLocaleString()}`],
        ['Monthly Equivalent', `PHP ${res.monthlyEquivalent.toLocaleString()}`],
        ['Total Earnings', `PHP ${res.totalEarnings.toLocaleString()}`]
      ],
      theme: 'grid',
      headStyles: { fillColor: [39, 174, 96] }
    });

    yPos = (doc as any).lastAutoTable.finalY + 10;

    autoTable(doc, {
      startY: yPos,
      head: [['Year', 'Accumulated Income', 'Total Value (Principal + Income)']],
      body: res.projection.map(p => [
        `Year ${p.year}`, 
        `PHP ${p.accumulatedIncome.toLocaleString()}`, 
        `PHP ${(p.totalValue + p.accumulatedIncome).toLocaleString()}`
      ]),
      theme: 'striped',
      headStyles: { fillColor: [52, 73, 94] }
    });
    
  } else if (item.type === 'mp2' && item.mp2Input) {
    const res = calculateMP2(item.mp2Input);
    
    autoTable(doc, {
      startY: yPos,
      head: [['Input Parameter', 'Value']],
      body: [
        ['Mode', item.mp2Input.mode === 'monthly' ? 'Monthly Contributions' : 'One-Time Lump Sum'],
        ['Principal / Initial', `PHP ${item.mp2Input.principal.toLocaleString()}`],
        ...(item.mp2Input.mode === 'monthly' ? [['Monthly Contribution', `PHP ${item.mp2Input.monthlyContribution.toLocaleString()}`]] : []),
        ['Dividend Rate', `${item.mp2Input.rate}%`],
        ['Payout Strategy', item.mp2Input.payoutType === 'compounded' ? 'Compounded Annually' : 'Annual Payout'],
        ['Tenor', `${item.mp2Input.tenor} Years`]
      ],
      theme: 'grid',
      headStyles: { fillColor: [22, 160, 133] }
    });
    
    yPos = (doc as any).lastAutoTable.finalY + 10;
    
    autoTable(doc, {
      startY: yPos,
      head: [['Metric', 'Value']],
      body: [
        ['Total Contributions', `PHP ${res.totalContribution.toLocaleString()}`],
        ['Total Dividends Earned', `PHP ${res.totalDividends.toLocaleString(undefined, { maximumFractionDigits: 2 })}`],
        ['Total Final Value', `PHP ${res.totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}`]
      ],
      theme: 'grid',
      headStyles: { fillColor: [39, 174, 96] }
    });

    yPos = (doc as any).lastAutoTable.finalY + 10;

    autoTable(doc, {
      startY: yPos,
      head: [['Year', 'Contributions (Cumulative)', 'Annual Dividend', 'Total Value']],
      body: res.projection.filter(p => p.year > 0).map(p => [
        `Year ${p.year}`, 
        `PHP ${p.contribution.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, 
        `PHP ${p.dividend.toLocaleString(undefined, { maximumFractionDigits: 2 })}`, 
        `PHP ${p.totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
      ]),
      theme: 'striped',
      headStyles: { fillColor: [52, 73, 94] }
    });

  } else if (item.type === 'compare' && item.compareInput) {
    autoTable(doc, {
      startY: yPos,
      head: [['Input Parameter', 'Value']],
      body: [
        ['Lump Sum Amount', `PHP ${item.compareInput.lumpSum.toLocaleString()}`],
        ['Time Horizon', `${item.compareInput.years} Years`],
        ['MP2 Dividend Rate', `${item.compareInput.mp2Rate}%`],
        ['RTB Gross Rate', `${item.compareInput.rtbGrossRate}% (Net ${item.compareInput.rtbGrossRate * 0.8}%)`]
      ],
      theme: 'grid',
      headStyles: { fillColor: [142, 68, 173] }
    });
  } else if (item.type === 'goalseek' && item.goalSeekInput) {
    autoTable(doc, {
      startY: yPos,
      head: [['Input Parameter', 'Value']],
      body: [
        ['Target Amount', `PHP ${item.goalSeekInput.targetAmount.toLocaleString()}`],
        ['Time Horizon', `${item.goalSeekInput.years} Years`],
        ['Instrument Mode', item.goalSeekInput.instrument.toUpperCase()],
        ['Assumed Annual Rate', `${item.goalSeekInput.annualRate}%`]
      ],
      theme: 'grid',
      headStyles: { fillColor: [230, 126, 34] }
    });
  } else if (item.type === 'fire' && item.fireInput) {
    autoTable(doc, {
      startY: yPos,
      head: [['Input Parameter', 'Value']],
      body: [
        ['Target Monthly Expenses', `PHP ${item.fireInput.monthlyExpenses.toLocaleString()}`],
        ['Instrument Mode', item.fireInput.instrument.toUpperCase()],
        ['Assumed Annual Yield', `${item.fireInput.annualRate}%`]
      ],
      theme: 'grid',
      headStyles: { fillColor: [231, 76, 60] }
    });
  }
};
