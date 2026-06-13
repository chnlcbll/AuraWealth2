import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { playSound } from '../utils/audio';

interface FlyingIcon {
  id: number;
  x: number;
  y: number;
  symbol: string;
}

export const FlyingIconsProvider = () => {
  const [icons, setIcons] = useState<FlyingIcon[]>([]);

  const triggerEffect = useCallback((e: CustomEvent<{ x: number, y: number }>) => {
    playSound('coin');
    const { x, y } = e.detail;
    
    // Spawn 1 to 3 icons
    const count = Math.floor(Math.random() * 3) + 1;
    const newIcons = Array.from({ length: count }).map(() => ({
      id: Date.now() + Math.random(),
      x: x + (Math.random() * 60 - 30),
      y: y + (Math.random() * 20 - 10),
      symbol: ['💸', '💰', '✨', '⚡️', '🪙'][Math.floor(Math.random() * 5)]
    }));

    setIcons((prev) => [...prev, ...newIcons]);

    setTimeout(() => {
      setIcons((prev) => prev.filter((i) => !newIcons.includes(i)));
    }, 1200);
  }, []);

  useEffect(() => {
    window.addEventListener('trigger-flying-dollars', triggerEffect as EventListener);
    return () => window.removeEventListener('trigger-flying-dollars', triggerEffect as EventListener);
  }, [triggerEffect]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {icons.map((icon) => (
          <motion.div
            key={icon.id}
            initial={{ opacity: 1, x: icon.x, y: icon.y, scale: 0.5 }}
            animate={{ opacity: 0, y: icon.y - 100, x: icon.x + (Math.random() * 40 - 20), scale: 1.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="absolute text-teal-500 font-bold text-xl drop-shadow-md"
          >
            {icon.symbol}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export const triggerFlyingDollars = (e: React.ChangeEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>) => {
  const target = e.target as HTMLElement;
  const rect = target.getBoundingClientRect();
  const event = new CustomEvent('trigger-flying-dollars', {
    detail: {
      x: rect.left + rect.width / 2,
      y: rect.top
    }
  });
  window.dispatchEvent(event);
};
