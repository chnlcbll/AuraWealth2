import { jsPDF } from 'jspdf';
import { SavedCalculation } from '../types';
import { calculateTBond, calculateMP2 } from './calculations';

export const generateCombinedPDF = (items: SavedCalculation[]) => {
  const doc = new jsPDF();
  
  items.forEach((item, index) => {
    if (index > 0) doc.addPage();
    
    doc.setFontSize(20);
    doc.text('Yield & Dividend Calculation Report', 14, 22);
    
    doc.setFontSize(12);
    doc.text(`Name: ${item.name}`, 14, 32);
    doc.text(`Type: ${item.type === 'tbond' ? 'Treasury Bond' : 'Pag-IBIG MP2'}`, 14, 38);
    doc.text(`Date: ${new Date(item.createdAt).toLocaleDateString()}`, 14, 44);

    if (item.type === 'tbond' && item.tbondInput) {
      const res = calculateTBond(item.tbondInput);
      doc.setFontSize(14);
      doc.text('Input Parameters', 14, 56);
      doc.setFontSize(11);
      doc.text(`Principal Amount: PHP ${item.tbondInput.principal.toLocaleString()}`, 14, 64);
      doc.text(`Annual Rate: ${item.tbondInput.rate}%`, 14, 70);
      doc.text(`Withholding Tax: ${item.tbondInput.taxRate}%`, 14, 76);
      
      doc.setFontSize(14);
      doc.text('Results', 14, 88);
      doc.setFontSize(11);
      doc.text(`Gross Annual: PHP ${res.grossAnnual.toLocaleString()}`, 14, 96);
      doc.text(`Net Annual: PHP ${res.netAnnual.toLocaleString()}`, 14, 102);
      doc.text(`Net Quarterly: PHP ${res.netQuarterly.toLocaleString()}`, 14, 108);
      doc.text(`Monthly Equivalent: PHP ${res.monthlyEquivalent.toLocaleString()}`, 14, 114);
    } else if (item.type === 'mp2' && item.mp2Input) {
      const res = calculateMP2(item.mp2Input);
      doc.setFontSize(14);
      doc.text('Input Parameters', 14, 56);
      doc.setFontSize(11);
      doc.text(`Mode: ${item.mp2Input.mode}`, 14, 64);
      if (item.mp2Input.mode === 'one-time') {
        doc.text(`Principal Amount: PHP ${item.mp2Input.principal.toLocaleString()}`, 14, 70);
      } else {
        doc.text(`Monthly Contribution: PHP ${item.mp2Input.monthlyContribution.toLocaleString()}`, 14, 70);
      }
      doc.text(`Dividend Rate: ${item.mp2Input.rate}%`, 14, 76);
      doc.text(`Payout: ${item.mp2Input.payoutType}`, 14, 82);

      doc.setFontSize(14);
      doc.text(`Results (${item.mp2Input.tenor}-Year Maturity)`, 14, 98);
      doc.setFontSize(11);
      doc.text(`Total Contribution: PHP ${res.totalContribution.toLocaleString()}`, 14, 106);
      doc.text(`Total Dividends: PHP ${res.totalDividends.toLocaleString()}`, 14, 112);
      doc.text(`Total Value: PHP ${res.totalValue.toLocaleString()}`, 14, 118);
    }
  });

  doc.save(`All_Calculations_Report.pdf`);
};

export const generatePDF = (item: SavedCalculation) => {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.text('Yield & Dividend Calculation Report', 14, 22);
  
  doc.setFontSize(12);
  doc.text(`Name: ${item.name}`, 14, 32);
  doc.text(`Type: ${item.type === 'tbond' ? 'Treasury Bond' : 'Pag-IBIG MP2'}`, 14, 38);
  doc.text(`Date: ${new Date(item.createdAt).toLocaleDateString()}`, 14, 44);

  if (item.type === 'tbond' && item.tbondInput) {
    const res = calculateTBond(item.tbondInput);
    doc.setFontSize(14);
    doc.text('Input Parameters', 14, 56);
    doc.setFontSize(11);
    doc.text(`Principal Amount: PHP ${item.tbondInput.principal.toLocaleString()}`, 14, 64);
    doc.text(`Annual Rate: ${item.tbondInput.rate}%`, 14, 70);
    doc.text(`Withholding Tax: ${item.tbondInput.taxRate}%`, 14, 76);
    
    doc.setFontSize(14);
    doc.text('Results', 14, 88);
    doc.setFontSize(11);
    doc.text(`Gross Annual: PHP ${res.grossAnnual.toLocaleString()}`, 14, 96);
    doc.text(`Net Annual: PHP ${res.netAnnual.toLocaleString()}`, 14, 102);
    doc.text(`Net Quarterly: PHP ${res.netQuarterly.toLocaleString()}`, 14, 108);
    doc.text(`Monthly Equivalent: PHP ${res.monthlyEquivalent.toLocaleString()}`, 14, 114);
  } else if (item.type === 'mp2' && item.mp2Input) {
    const res = calculateMP2(item.mp2Input);
    doc.setFontSize(14);
    doc.text('Input Parameters', 14, 56);
    doc.setFontSize(11);
    doc.text(`Mode: ${item.mp2Input.mode}`, 14, 64);
    if (item.mp2Input.mode === 'one-time') {
      doc.text(`Principal Amount: PHP ${item.mp2Input.principal.toLocaleString()}`, 14, 70);
    } else {
      doc.text(`Monthly Contribution: PHP ${item.mp2Input.monthlyContribution.toLocaleString()}`, 14, 70);
    }
    doc.text(`Dividend Rate: ${item.mp2Input.rate}%`, 14, 76);
    doc.text(`Payout: ${item.mp2Input.payoutType}`, 14, 82);

    doc.setFontSize(14);
    doc.text('Results (5-Year Maturity)', 14, 98);
    doc.setFontSize(11);
    doc.text(`Total Contribution: PHP ${res.totalContribution.toLocaleString()}`, 14, 106);
    doc.text(`Total Dividends: PHP ${res.totalDividends.toLocaleString()}`, 14, 112);
    doc.text(`Total Value: PHP ${res.totalValue.toLocaleString()}`, 14, 118);
  }

  doc.save(`${item.name.replace(/\s+/g, '_')}_Report.pdf`);
};
