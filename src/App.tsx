import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { TBondInput, MP2Input, SavedCalculation } from './types';
import { TBondCalc } from './components/TBondCalc';
import { MP2Calc } from './components/MP2Calc';
import { Sidebar } from './components/Sidebar';
import { Tooltip } from './components/Tooltip';
import { Dashboard } from './components/Dashboard';
import { FAQList } from './components/FAQList';
import { Login } from './components/Login';
import { IntroTour } from './components/IntroTour';
import { SimulatedVideo, VideoSlide } from './components/SimulatedVideo';
import { GoalSeekCalc } from './components/GoalSeekCalc';
import { FlyingIconsProvider } from './components/FlyingIcons';
import { generatePDF } from './utils/pdfExport';
import { playSound, toggleMute, getMuteState } from './utils/audio';
import { cn } from './utils/cn';
import { Moon, Sun, HelpCircle, Save, FolderOpen, X, Video, FileQuestion, TrendingUp, Info, LayoutDashboard, Calculator, User, LogOut, Volume2, VolumeX, Target } from 'lucide-react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useLocalStorage('is_authenticated', false);
  const [username, setUsername] = useLocalStorage('current_username', '');
  const [darkMode, setDarkMode] = useLocalStorage('theme_dark', true);
  const [isMuted, setIsMuted] = useState(getMuteState());
  const [introSeen, setIntroSeen] = useLocalStorage('intro_seen', false);
  const [savedItems, setSavedItems] = useLocalStorage<SavedCalculation[]>('saved_calculations', []);
  
  const [appView, setAppView] = useState<'dashboard' | 'calculator'>('dashboard');
  const [activeTab, setActiveTab] = useState<'tbond' | 'mp2' | 'goalseek'>('tbond');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [helpTab, setHelpTab] = useState<'faq' | 'video'>('faq');
  const [introOpen, setIntroOpen] = useState(!introSeen);
  const [isReady, setIsReady] = useState(false);

  // States for calculators
  const [tbondInput, setTbondInput] = useState<TBondInput>({
    principal: 100000,
    rate: 6.25,
    taxRate: 20,
    bankFee: 0,
    bankFeeFrequency: 4,
    inflationEnabled: false,
    inflationRate: 4
  });

  const [mp2Input, setMp2Input] = useState<MP2Input>({
    principal: 100000,
    rate: 6.5,
    payoutType: 'compounded',
    monthlyContribution: 5000,
    mode: 'one-time',
    tenor: 5,
    inflationEnabled: false,
    inflationRate: 4
  });

  useEffect(() => {
    setIsReady(true);
    if (!introSeen) {
        playSound('success');
    }
  }, [introSeen]);

  // Handle Theme
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  const handleSave = () => {
    playSound('save');
    const newSave: SavedCalculation = {
      id: crypto.randomUUID(),
      name: `Calculation ${savedItems.length + 1}`,
      type: activeTab,
      createdAt: new Date().toISOString(),
      ...(activeTab === 'tbond' ? { tbondInput } : { mp2Input })
    };
    setSavedItems([newSave, ...savedItems]);
    setSidebarOpen(true);
  };

  const handleLoad = (item: SavedCalculation) => {
    playSound('click');
    setAppView('calculator');
    setActiveTab(item.type);
    if (item.type === 'tbond' && item.tbondInput) setTbondInput(item.tbondInput);
    if (item.type === 'mp2' && item.mp2Input) setMp2Input(item.mp2Input);
  };

  const handleDelete = (id: string) => {
    setSavedItems(savedItems.filter(s => s.id !== id));
  };

  const handleRename = (id: string, newName: string) => {
    setSavedItems(savedItems.map(s => s.id === id ? { ...s, name: newName } : s));
  };

  const handleExportAll = () => {
    const dataStr = JSON.stringify(savedItems);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'calculations_backup.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const closeIntro = () => {
    playSound('click');
    setIntroSeen(true);
    setIntroOpen(false);
  };

  if (!isReady) return null;

  if (!isAuthenticated) {
    return <Login onLogin={(u) => {
      setUsername(u);
      setIsAuthenticated(true);
      setIntroOpen(true);
    }} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0c] text-gray-900 dark:text-gray-200 font-sans transition-colors duration-300">
      <FlyingIconsProvider />
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#0e0e11]/80 backdrop-blur-md border-b border-gray-200 dark:border-white/5 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
        <motion.div 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} 
          className="flex items-center gap-3 font-semibold text-lg cursor-pointer"
          onClick={() => setAppView('dashboard')}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-teal-700 flex items-center justify-center text-white dark:text-gray-100 shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" className="w-6 h-6"><path d="M25 75 L50 25 L75 75" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/><path d="M35 55 L65 55" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/></svg>
          </div>
          <span className="inline">Aura<span className="dark:text-teal-500">Wealth</span></span>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="flex bg-gray-200 dark:bg-white/5 p-1 rounded-full shadow-inner dark:shadow-none"
        >
          <button 
            onClick={() => { playSound('click'); setAppView('dashboard'); }}
            className={cn("px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all", appView === 'dashboard' ? 'bg-white dark:bg-teal-500 dark:text-black shadow' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white')}
          >
            <LayoutDashboard size={14}/> Dashboard
          </button>
          <button 
            onClick={() => { playSound('click'); setAppView('calculator'); }}
            className={cn("px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all", appView === 'calculator' ? 'bg-white dark:bg-teal-500 dark:text-black shadow' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white')}
          >
            <Calculator size={14}/> Analysis
          </button>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <Tooltip content="Mute Sounds" position="bottom-right">
            <button id="tour-mute-btn" onClick={() => { setIsMuted(toggleMute()); }} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/5 transition">
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          </Tooltip>
          <Tooltip content="Toggle Theme" position="bottom-right">
            <button id="tour-theme-btn" onClick={() => { playSound(); setDarkMode(!darkMode); }} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/5 transition">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </Tooltip>
          <Tooltip content="Help & Information" position="bottom-right">
            <button id="tour-help-btn" onClick={() => { playSound(); setHelpOpen(true); }} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/5 transition">
              <HelpCircle size={18} />
            </button>
          </Tooltip>
          <Tooltip content="Saved Calculations" position="bottom-right">
            <button id="tour-saved-btn" onClick={() => { playSound(); setSidebarOpen(true); }} className="px-3 py-1.5 flex items-center gap-2 text-sm font-medium rounded-full bg-blue-100 text-blue-700 dark:bg-teal-500/10 dark:text-teal-400 dark:border dark:border-teal-500/20 hover:bg-blue-200 dark:hover:bg-teal-500/20 transition">
              <FolderOpen size={16} /> <span className="hidden sm:inline">Saved</span>
            </button>
          </Tooltip>
          <Tooltip content="Logout" position="bottom-right">
            <button id="tour-logout-btn" onClick={() => { playSound(); setIsAuthenticated(false); }} className="p-2 rounded-full hover:bg-red-100 text-gray-500 hover:text-red-600 dark:hover:bg-red-500/20 dark:hover:text-red-400 transition">
              <LogOut size={18} />
            </button>
          </Tooltip>
        </motion.div>
      </header>

      {/* Main Content Area */}
      <div className="relative min-h-[calc(100vh-80px)] overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 dark:bg-teal-500/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 dark:bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
        
        <main className="max-w-6xl mx-auto px-4 py-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
          >
            {appView === 'dashboard' ? (
              <Dashboard 
                savedItems={savedItems} 
                onNavigate={(view) => { setAppView('calculator'); setActiveTab(view); }}
                onLoad={handleLoad}
                username={username}
              />
            ) : (
              <>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                  <div className="flex bg-gray-200 dark:bg-black/40 rounded-xl p-1 w-full sm:w-auto">
                    <button 
                      onClick={() => { playSound('hover'); setActiveTab('tbond'); }}
                      className={cn("flex-1 sm:flex-none px-6 py-2 rounded-lg text-xs uppercase tracking-widest font-bold transition", 
                        activeTab === 'tbond' ? "bg-white dark:bg-white/5 dark:text-teal-400 border dark:border-teal-500/30 shadow" : "hover:bg-white/50 dark:hover:bg-white/5 text-gray-500 border border-transparent"
                      )}
                    >
                      Retail Treasury Bonds (RTBs)
                    </button>
                    <button 
                      onClick={() => { playSound('hover'); setActiveTab('mp2'); }}
                      className={cn("flex-1 sm:flex-none px-6 py-2 rounded-lg text-xs uppercase tracking-widest font-bold transition", 
                        activeTab === 'mp2' ? "bg-white dark:bg-white/5 dark:text-teal-400 border dark:border-teal-500/30 shadow" : "hover:bg-white/50 dark:hover:bg-white/5 text-gray-500 border border-transparent"
                      )}
                    >
                      Pag-IBIG MP2
                    </button>
                    <button 
                      id="tour-goalseek-tab"
                      onClick={() => { playSound('hover'); setActiveTab('goalseek'); }}
                      className={cn("hidden lg:block sm:flex-none px-6 py-2 rounded-lg text-xs uppercase tracking-widest font-bold transition", 
                        activeTab === 'goalseek' ? "bg-white dark:bg-white/5 dark:text-purple-400 border dark:border-purple-500/30 shadow text-purple-600" : "hover:bg-white/50 dark:hover:bg-white/5 text-gray-500 border border-transparent"
                      )}
                    >
                      Goal Seek
                    </button>
                    <button 
                      onClick={() => { playSound('hover'); setActiveTab('goalseek'); }}
                      className={cn("lg:hidden flex-1 sm:flex-none px-6 py-2 rounded-lg text-xs uppercase tracking-widest font-bold transition", 
                        activeTab === 'goalseek' ? "bg-white dark:bg-white/5 dark:text-purple-400 border dark:border-purple-500/30 shadow text-purple-600" : "hover:bg-white/50 dark:hover:bg-white/5 text-gray-500 border border-transparent"
                      )}
                    >
                      Goals
                    </button>
                  </div>
                  
                  <button 
                    onClick={handleSave}
                    disabled={activeTab === 'goalseek'}
                    className={cn("w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-black dark:bg-teal-500 text-white dark:text-black rounded-xl text-sm font-bold shadow-lg transition transform", activeTab === 'goalseek' ? "opacity-50 cursor-not-allowed" : "hover:opacity-90 hover:scale-105 active:scale-95 dark:shadow-teal-500/10")}
                  >
                    <Save size={16} /> Save Snapshot
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {activeTab === 'tbond' ? (
                    <motion.div key="tbond" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                      <TBondCalc input={tbondInput} setInput={setTbondInput} />
                    </motion.div>
                  ) : activeTab === 'mp2' ? (
                    <motion.div key="mp2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                      <MP2Calc input={mp2Input} setInput={setMp2Input} />
                    </motion.div>
                  ) : (
                    <motion.div key="goalseek" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                      <GoalSeekCalc />
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </motion.div>
        </main>
      </div>

      {/* Footer Bar */}
      <footer className="h-8 bg-black/5 dark:bg-[#0e0e11]/80 backdrop-blur-sm flex items-center justify-between px-6 border-t border-black/10 dark:border-white/5 fixed bottom-0 w-full z-20">
        <div className="flex items-center gap-4 text-[9px] text-gray-500 dark:text-gray-600 uppercase font-bold tracking-widest">
          <span>Version 2.4.0</span>
          <span className="text-gray-400 dark:text-teal-900">•</span>
          <span>Secure Local Storage Active</span>
        </div>
        <div className="flex items-center gap-1.5 text-[9px] text-gray-500 uppercase font-bold tracking-widest">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
          <span>Ready</span>
        </div>
      </footer>

      {/* Sidebar for saved items */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        savedItems={savedItems}
        onLoad={handleLoad}
        onDelete={handleDelete}
        onRename={handleRename}
        onExportAll={handleExportAll}
        onImportAll={(data) => setSavedItems([...data, ...savedItems])}
        onExportPDF={generatePDF}
      />

      {/* Intro Modal / Tour */}
      <AnimatePresence>
        {introOpen && <IntroTour onClose={closeIntro} setAppView={setAppView} setActiveTab={setActiveTab} switchTheme={() => setDarkMode(!darkMode)} setHelpOpen={setHelpOpen} setSidebarOpen={setSidebarOpen} />}
      </AnimatePresence>

      {/* Help Modal */}
      <AnimatePresence>
        {helpOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setHelpOpen(false)} />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0 }} 
              className="relative bg-white dark:bg-[#1a1a1e] rounded-3xl shadow-2xl p-8 max-w-5xl w-full border border-gray-200 dark:border-white/10 max-h-[90vh] flex flex-col"
            >
              <button onClick={() => setHelpOpen(false)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full text-gray-500">
                <X size={20} />
              </button>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Info className="text-emerald-500 dark:text-teal-400"/> Info & Help</h2>

              <div id="tour-help-tabs" className="flex bg-gray-100 dark:bg-white/5 rounded-xl p-1 mb-6 shrink-0">
                <button 
                  onClick={() => setHelpTab('video')}
                  className={cn("flex-1 py-1.5 rounded-lg text-xs uppercase tracking-widest font-bold transition flex items-center justify-center gap-2", 
                    helpTab === 'video' ? "bg-white dark:bg-[#27272a] shadow text-emerald-600 dark:text-teal-400" : "hover:bg-white/50 text-gray-500"
                  )}
                >
                  <Video size={14}/> Video Guides
                </button>
                <button 
                  onClick={() => setHelpTab('faq')}
                  className={cn("flex-1 py-1.5 rounded-lg text-xs uppercase tracking-widest font-bold transition flex items-center justify-center gap-2", 
                    helpTab === 'faq' ? "bg-white dark:bg-[#27272a] shadow text-emerald-600 dark:text-teal-400" : "hover:bg-white/50 text-gray-500"
                  )}
                >
                  <FileQuestion size={14}/> FAQs
                </button>
              </div>
              
              <div className="overflow-y-auto flex-1 pr-2 custom-scrollbar">
                {helpTab === 'video' && (
                  <div className="space-y-6 pb-6">
                    <div className="mb-2 border-b border-black/5 dark:border-white/10 pb-4">
                      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">Video Guides & Tutorials</h3>
                      <p className="text-sm text-gray-500">Learn the mathematical principles of your investments through these structured walk-throughs.</p>
                    </div>

                    <SimulatedVideo 
                      title="Retail Treasury Bonds (RTBs) Made Easy"
                      slides={[
                        { id: '1', title: 'What are RTBs?', content: 'Retail Treasury Bonds are low-risk, medium-to-long term debt securities issued by the Philippine government.', durationMs: 4000 },
                        { id: '2', title: 'Fixed Quarterly Income', content: 'You receive regular interest payments every 3 months straight into your settlement account.', durationMs: 4000 },
                        { id: '3', title: 'Tax Consideration', content: 'Just remember: RTB interest has a 20% final withholding tax deduction before it hits your account.', durationMs: 4000 },
                      ]} 
                    />
                    
                    <SimulatedVideo 
                      title="Mastering Pag-IBIG MP2"
                      slides={[
                        { id: '1', title: 'Tax-Free Compounding', content: 'MP2 is a 5-year savings program where your dividends are 100% tax-free and historically higher than bank rates.', durationMs: 4000 },
                        { id: '2', title: 'Flexible Contributions', content: 'You can contribute as low as ₱500 per month, any time you want. Miss a month? No penalties!', durationMs: 4000 },
                        { id: '3', title: 'Lump Sum Strategy', content: 'A single, large deposit at the beginning of the 5 years maximizes the effect of compound interest.', durationMs: 4000 },
                      ]} 
                    />

                    <div className="bg-[#111113] rounded-2xl overflow-hidden shadow-lg border border-black/20">
                      <iframe src="https://drive.google.com/file/d/12nxAjoYtxwdqwfmNQmHq0RM7B32WHQIA/preview" className="w-full aspect-video bg-black object-contain border-0" allow="autoplay; fullscreen" />
                      <div className="p-4 bg-white dark:bg-[#1f1f23]">
                        <h4 className="text-gray-800 dark:text-gray-100 font-bold mb-1">Borrowing & Investing: Simple vs Compound</h4>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-teal-600 dark:text-teal-400">GEMATMW review</p>
                      </div>
                    </div>

                    <div className="bg-[#111113] rounded-2xl overflow-hidden shadow-lg border border-black/20">
                      <iframe src="https://drive.google.com/file/d/182whi4bTsNRIa8zMy9CfZET3TTtVPMUB/preview" className="w-full aspect-video bg-black object-contain border-0" allow="autoplay; fullscreen" />
                      <div className="p-4 bg-white dark:bg-[#1f1f23]">
                        <h4 className="text-gray-800 dark:text-gray-100 font-bold mb-1">Stocks vs. RTBs: The True Math</h4>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-teal-600 dark:text-teal-400">GEMATMW review</p>
                      </div>
                    </div>

                    <div className="bg-[#111113] rounded-2xl overflow-hidden shadow-lg border border-black/20">
                      <iframe src="https://drive.google.com/file/d/1GcIGpkJUHov9e9v1WrJHpkl6e5Qxn8GD/preview" className="w-full aspect-video bg-black object-contain border-0" allow="autoplay; fullscreen" />
                      <div className="p-4 bg-white dark:bg-[#1f1f23]">
                        <h4 className="text-gray-800 dark:text-gray-100 font-bold mb-1">The Dual Power of Interest</h4>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-teal-600 dark:text-teal-400">GEMATMW review</p>
                      </div>
                    </div>
                  </div>
                )}

                {helpTab === 'faq' && (
                  <FAQList />
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
