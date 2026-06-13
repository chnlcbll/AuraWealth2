import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { playSound } from '../utils/audio';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'top-right' | 'bottom' | 'bottom-right';
}

export const Tooltip: React.FC<TooltipProps> = ({ children, content, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [xOffset, setXOffset] = useState(0);

  const handleMouseEnter = () => {
    playSound('hover');
    setIsVisible(true);
  };

  useEffect(() => {
    if (isVisible && tooltipRef.current) {
      const rect = tooltipRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      let newOffset = 0;
      
      if (rect.left < 10) {
        newOffset = 10 - rect.left;
      } else if (rect.right > viewportWidth - 10) {
        newOffset = (viewportWidth - 10) - rect.right;
      }
      setXOffset(newOffset);
    } else {
      setXOffset(0);
    }
  }, [isVisible, position, content]);

  const posClasses = {
    'top': 'bottom-full mb-2 left-1/2 -translate-x-1/2',
    'top-right': 'bottom-full mb-2 right-0',
    'bottom': 'top-full mt-2 left-1/2 -translate-x-1/2',
    'bottom-right': 'top-full mt-2 right-0'
  };

  const arrowClasses = {
    'top': 'top-full left-1/2 -ml-1 border-t-gray-800',
    'top-right': 'top-full right-2 -ml-1 border-t-gray-800',
    'bottom': 'bottom-full left-1/2 -ml-1 border-b-gray-800',
    'bottom-right': 'bottom-full right-2 -ml-1 border-b-gray-800'
  };

  return (
    <div 
      className="relative flex items-center justify-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={handleMouseEnter}
      onBlur={() => setIsVisible(false)}
      ref={containerRef}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, y: position.startsWith('top') ? 5 : -5 }}
            animate={{ opacity: 1, y: 0, x: xOffset }}
            exit={{ opacity: 0, y: position.startsWith('top') ? 5 : -5 }}
            transition={{ duration: 0.15 }}
            className={`absolute ${posClasses[position]} px-3 py-1.5 bg-gray-800 text-xs text-white rounded shadow-lg w-max max-w-[200px] sm:max-w-[250px] text-center z-50 pointer-events-none normal-case tracking-normal whitespace-normal break-words leading-tight`}
          >
            {content}
            <div 
              className={`absolute border-4 border-transparent ${arrowClasses[position]}`}
              style={{ transform: `translateX(${-xOffset}px)` }}
            ></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
