import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SavedCalculation } from '../types';
import { playSound } from '../utils/audio';
import { Tooltip } from './Tooltip';
import { X, Download, Upload, FileText, Trash2, Edit2, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  savedItems: SavedCalculation[];
  onLoad: (item: SavedCalculation) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, newName: string) => void;
  onExportAll: () => void;
  onImportAll: (data: SavedCalculation[]) => void;
  onExportPDF: (item: SavedCalculation) => void;
}

export const Sidebar: React.FC<Props> = ({ 
  isOpen, onClose, savedItems, onLoad, onDelete, onRename, onExportAll, onImportAll, onExportPDF 
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startEdit = (item: SavedCalculation) => {
    playSound('click');
    setEditingId(item.id);
    setEditName(item.name);
  };

  const saveEdit = (id: string) => {
    playSound('success');
    onRename(id, editName);
    setEditingId(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (Array.isArray(data)) {
          onImportAll(data);
          playSound('success');
        }
      } catch (err) {
        alert('Invalid backup file');
      }
    };
    reader.readAsText(file);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-black/50 z-40" 
            onClick={onClose} 
          />
          <motion.div 
            initial={{ x: '100%' }} 
            animate={{ x: 0 }} 
            exit={{ x: '100%' }} 
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-80 bg-white dark:bg-[#0e0e11] border-l border-black/10 dark:border-white/5 shadow-2xl z-50 flex flex-col"
          >
            <div className="p-4 border-b border-black/10 dark:border-white/5 flex items-center justify-between">
              <h2 className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Saved Snapshots</h2>
              <button onClick={() => { playSound(); onClose(); }} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
                <X size={16} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {savedItems.length === 0 ? (
                <div className="text-center text-gray-500 mt-10 text-xs">No saved calculations yet.</div>
              ) : (
                savedItems.map(item => (
                  <div key={item.id} className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5 group relative transition-all hover:border-black/20 dark:hover:border-teal-500/50">
                    <div className="flex items-center justify-between mb-2">
                      {editingId === item.id ? (
                        <div className="flex items-center gap-2 flex-1">
                          <input 
                            autoFocus
                            className="bg-white dark:bg-[#0a0a0c] border border-gray-300 dark:border-white/10 rounded px-2 py-1 text-sm flex-1 w-full outline-none focus:border-teal-500 transition-colors"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && saveEdit(item.id)}
                          />
                          <button onClick={() => saveEdit(item.id)} className="text-teal-500"><Check size={16}/></button>
                        </div>
                      ) : (
                        <div className="flex-1 cursor-pointer font-bold text-sm truncate" onClick={() => { onLoad(item); onClose(); }}>
                          {item.name}
                        </div>
                      )}
                      {editingId !== item.id && (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Tooltip content="Rename" position="top-right">
                            <button onClick={() => startEdit(item)} className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded"><Edit2 size={12}/></button>
                          </Tooltip>
                          <Tooltip content="Export to PDF" position="top-right">
                            <button onClick={() => onExportPDF(item)} className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded text-teal-400"><FileText size={12}/></button>
                          </Tooltip>
                          <Tooltip content="Delete Calculation" position="top-right">
                            <button onClick={() => { playSound(); onDelete(item.id); }} className="p-1.5 hover:bg-red-500/10 rounded text-red-500"><Trash2 size={12}/></button>
                          </Tooltip>
                        </div>
                      )}
                    </div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest flex justify-between">
                      <span>{
                        item.type === 'tbond' ? 'Treasury Bond' : 
                        item.type === 'mp2' ? 'Pag-IBIG MP2' :
                        item.type === 'goalseek' ? 'Goal Seek' :
                        item.type === 'fire' ? 'F.I.R.E. Targeter' :
                        item.type === 'compare' ? 'RTB vs MP2' : 'Unknown'
                      }</span>
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-black/10 dark:border-white/5 space-y-2">
              <button 
                id="tour-export-all-btn"
                onClick={() => { 
                  playSound(); 
                  if(savedItems.length) {
                    import('../utils/pdfExport').then(m => m.generateCombinedPDF(savedItems));
                  }
                }} 
                className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-teal-500/10 hover:bg-teal-500/20 text-teal-600 dark:text-teal-400 rounded-lg transition-colors text-[10px] uppercase font-bold tracking-widest"
              >
                <Download size={14} /> Export All to PDF
              </button>
              <button 
                onClick={() => { playSound(); onExportAll(); }} 
                className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg transition-colors text-[10px] uppercase font-bold tracking-widest text-gray-400 dark:hover:text-white"
              >
                <Download size={14} /> Export Backup
              </button>
              <button 
                onClick={() => { playSound(); fileInputRef.current?.click(); }} 
                className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg transition-colors text-[10px] uppercase font-bold tracking-widest text-gray-400 dark:hover:text-white"
              >
                <Upload size={14} /> Import Backup
              </button>
              <input type="file" accept=".json" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
