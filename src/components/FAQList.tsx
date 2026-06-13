import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Mail, UserInfo, Search } from 'lucide-react';
import { playSound } from '../utils/audio';

const investmentFaqs = [
  { question: "What are Retail Treasury Bonds (RTBs)?", answer: "RTBs are medium- to long-term debt securities issued by the Philippine government, designed for retail investors. They offer fixed quarterly interest payments." },
  { question: "What is Pag-IBIG MP2?", answer: "MP2 (Modified Pag-IBIG II) is a voluntary savings program over a 5-year lock-in period, featuring tax-free dividends that are historically higher than regular savings." },
  { question: "Are RTBs safe?", answer: "Yes, RTBs are virtually risk-free as they are guaranteed by the Republic of the Philippines." },
  { question: "Is Pag-IBIG MP2 safe?", answer: "Yes, MP2 is completely government-guaranteed. Your principal investment is safely secured." },
  { question: "How often do RTBs pay interest?", answer: "RTBs typically pay interest on a quarterly basis." },
  { question: "How does MP2 pay dividends?", answer: "You can choose between Annual Payout or Compounded (paid out at the end of the 5-year term)." },
  { question: "Are RTB earnings taxable?", answer: "Yes, interest earned from RTBs is subject to a 20% final withholding tax." },
  { question: "Are MP2 earnings taxable?", answer: "No, dividends earned from the Pag-IBIG MP2 program are completely tax-free." },
  { question: "What is the minimum investment for RTBs?", answer: "Historically, the minimum investment for RTBs is ₱5,000, with increments of ₱5,000." },
  { question: "What is the minimum investment for MP2?", answer: "The minimum contribution for MP2 is just ₱500 per remittance." },
  { question: "Can I pre-terminate my RTB?", answer: "RTBs can be sold in the secondary market before maturity, though prices fluctuate based on market interest rates." },
  { question: "Can I withdraw my MP2 early?", answer: "Pre-termination is allowed only for specific valid reasons (e.g., total disability, insanity, migration). Otherwise, only the principal (or 50% of dividends if already paid) may be returned." },
  { question: "What happens if I miss an MP2 contribution?", answer: "Missing a contribution has no penalty. You simply won't earn dividends on the missed months. You deposit whenever you can." },
  { question: "How is RTB interest calculated?", answer: "Interest is calculated based on the coupon rate applied to the principal amount, distributed quarterly, minus the 20% tax." },
  { question: "How are MP2 dividends calculated?", answer: "Dividends are computed based on the Average Monthly Daily Balance (AMDB). Consistent monthly contributions benefit greatly from this." },
  { question: "Can I have multiple MP2 accounts?", answer: "Yes! You can open multiple MP2 accounts for different financial goals with different tenors overlapping." },
  { question: "Where do I buy RTBs?", answer: "RTBs can be purchased through authorized selling banks or online via the Bureau of the Treasury’s portal or apps like Bonds.PH." },
  { question: "Where do I open an MP2 account?", answer: "You can open an MP2 account online via Virtual Pag-IBIG or at any Pag-IBIG branch." },
  { question: "Is there a maximum limit for MP2?", answer: "Yes. They recently added a ₱20,000,000 limit per person. No matter how many accounts that person has, the total combined MP2 savings should not exceed ₱20M. However, a one-time deposit exceeding ₱500,000 still requires payment via Manager's or Cashier's Check." },
  { question: "Is there a limit for RTB investments?", answer: "There's generally no maximum limit, subject to the availability of the bond issuance." },
  { question: "Are the rates guaranteed for MP2?", answer: "No, MP2 dividend rates are not fixed. They depend on Pag-IBIG's annual net income, though they historically perform well (around 6-7%)." },
  { question: "Are RTB rates guaranteed?", answer: "Yes, the coupon rate assigned during the offering schedule is fixed for the life of the bond." },
  { question: "Is MP2 better than RTBs?", answer: "It depends on your goal. MP2 is typically better for long-term compound growth (tax-free), while RTBs are better for predictable, fixed passive income." },
  { question: "Can overseas Filipinos invest in MP2?", answer: "Absolutely. OFWs can open MP2 accounts and remit contributions from abroad seamlessly through various channels." },
  { question: "When does the 5-year MP2 period start?", answer: "The 5-year maturation starts on the date of your very first contribution to that specific MP2 account number." }
];

const websiteFaqs = [
  { question: "What is AuraWealth?", answer: "AuraWealth is a premium companion app designed for Retail Treasury Bonds (RTBs) and MP2 investment planning." },
  { question: "Is this website free to use?", answer: "Yes, all features of the AuraWealth calculator are completely free for everyone to use." },
  { question: "Do you store my personal data?", answer: "No. All your calculations, names, and saved projections stay locally on your device/browser and are not sent to any server." },
  { question: "How can I toggle dark mode?", answer: "Simply click the sun/moon icon at the top right of the dashboard to switch between light and dark themes." },
  { question: "Can I save my calculations for later?", answer: "Absolutely! Just click on the 'Save Calculation' button when viewing your projection and it will be stored in your 'Saved' folder." },
  { question: "Is it possible to download my results?", answer: "Yes. From your 'Saved' folder, you can generate and download a clean PDF report of a specific projection, or use the 'Export All to PDF' button to download a single folio containing all your saved calculations." },
  { question: "What is Goal Seek capability?", answer: "Goal-Seek or Reverse Calculation allows you to determine exactly how much you need to deposit today, or continually deposit each month, to reach a target financial goal in the future." },
  { question: "What is the F.I.R.E. Targeter?", answer: "The F.I.R.E. (Financial Independence, Retire Early) Targeter takes your monthly living expenses and reverse-engineers the exact principal amount you need invested. It shows you the portfolio size required so you can live entirely off your dividends, without ever touching the original capital." },
  { question: "How does the RTB vs MP2 Comparison Chart work?", answer: "If you have a lump sum of cash, the Comparison Chart tab provides a head-to-head visual showdown. It calculates the compound interest of the MP2 alongside the simple interest payout of an RTB, while explicitly highlighting the exact monetary loss caused by the 20% RTB withholding tax." },
  { question: "What does the Inflation Adjuster do?", answer: "The optional Inflation Adjuster computes your 'Real Return'. It estimates the future purchasing power of your money by subtracting the effects of inflation from your total yield, so you can see if your investments are truly beating the rising costs of goods." },
  { question: "How accurate are the projected returns?", answer: "Our system uses standardized algorithms mimicking real-world computations. However, because actual rates or bank fees may fluctuate, treat these as highly accurate estimates rather than guarantees." },
  { question: "Is AuraWealth an official government site?", answer: "No, we are an independent tool created to assist retail investors and are not officially affiliated with Pag-IBIG or the Bureau of the Treasury." },
  { question: "How do I restart the interactive walkthrough?", answer: "The walkthrough runs on your first login. You can logout and login again to replay the walkthrough. Alternatively, you can always refer back to our Video Guides in this Help tab or click the small 'skip' button during the walkthrough to bypass it." },
  { question: "Can I mute the sound effects?", answer: "Yes, you can click the speaker icon next to the Theme toggle on the top right navigation bar to mute or unmute the interface sound effects." },
  { question: "Is it mobile friendly?", answer: "Yes! AuraWealth is designed to resize beautifully whether you're using a phone, tablet, or desktop monitor." },
  { question: "How does the Detailed Growth Table work?", answer: "The Detailed Growth Table breaks down your compound interest year-by-year. It shows your exact principal, dividends earned for that year, and the new ending balance so you can see the math step-by-step." },
  { question: "Can I export the Year-by-Year Growth Table?", answer: "Yes, when you save a calculation, the yearly breakdown is included in the underlying data and can be seen on the PDF report." }
];

export const FAQList: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleToggle = (id: string) => {
    playSound('click');
    setOpenIndex(openIndex === id ? null : id);
  };

  const filteredInvestmentFaqs = investmentFaqs.filter(
    faq => faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
           faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredWebsiteFaqs = websiteFaqs.filter(
    faq => faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
           faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderFaqSection = (faqs: {question: string, answer: string}[], prefix: string) => {
    if (faqs.length === 0) {
      return <div className="text-sm text-gray-500 py-4 italic">No matching questions found.</div>;
    }

    return (
      <div className="space-y-3 mt-4">
        {faqs.map((faq, index) => {
          const id = `${prefix}-${index}`;
          const isOpen = openIndex === id;
          return (
            <div 
              key={id} 
              className={`border rounded-xl transition-colors ${isOpen ? 'border-teal-500 bg-white/50 dark:bg-teal-500/5' : 'border-gray-200 dark:border-white/10 dark:bg-black/20'}`}
            >
              <button
                onClick={() => handleToggle(id)}
                className="w-full flex items-center justify-between p-4 text-left font-bold text-sm text-gray-800 dark:text-gray-200"
              >
                 <span>{faq.question}</span>
                 <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
                   <ChevronDown size={18} className={isOpen ? 'text-teal-500' : 'text-gray-400'} />
                 </motion.div>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 pt-0 text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-white/5 mt-2">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex-1">
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-[#141417] border border-gray-200 dark:border-white/10 rounded-2xl text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition shadow-sm"
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <h3 className="text-xl font-bold mb-2">RTBs & MP2 Investments FAQs</h3>
        <p className="text-sm text-gray-500 mb-4">Learn more about the fundamentals of these popular Philippine investments.</p>
        {renderFaqSection(filteredInvestmentFaqs, 'inv')}
        
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-2">Website & Usage FAQs</h3>
          <p className="text-sm text-gray-500 mb-4">Questions about how to use AuraWealth and your privacy.</p>
          {renderFaqSection(filteredWebsiteFaqs, 'web')}
        </div>
      </div>
      
      <div className="w-full lg:w-72 shrink-0">
        <div className="bg-blue-50 dark:bg-[#141417] border border-blue-100 dark:border-white/10 rounded-2xl p-6 sticky top-0">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Mail size={18} className="text-blue-500" />
            Contact Info
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
            Have questions, issues, or suggestions? Reach out to us directly via email.
          </p>
          <div className="bg-white dark:bg-black/40 rounded-xl p-3 border border-black/5 dark:border-white/5 mb-6">
            <a href="mailto:chanelcabellooo@gmail.com" className="text-sm font-medium text-blue-600 dark:text-blue-400 break-all select-all hover:underline">
              chanelcabellooo@gmail.com
            </a>
          </div>
          
          <div className="pt-6 border-t border-black/5 dark:border-white/10">
            <div className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-2">Developer</div>
            <p className="font-medium text-gray-800 dark:text-gray-200">Chanel Cabello</p>
            <p className="text-sm text-emerald-600 dark:text-teal-400 font-medium mt-1">For GEMATMW review</p>
          </div>
        </div>
      </div>
    </div>
  );
};

