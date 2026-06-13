import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { playSound } from '../utils/audio';

export interface VideoSlide {
  id: string;
  title: string;
  content: string;
  durationMs: number;
  Icon?: React.ElementType;
}

interface Props {
  slides: VideoSlide[];
  title: string;
  onComplete?: () => void;
}

export const SimulatedVideo: React.FC<Props> = ({ slides, title, onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(p => {
          const newProgress = p + (100 / (slides[currentSlide].durationMs / 50));
          if (newProgress >= 100) {
            if (currentSlide < slides.length - 1) {
              setCurrentSlide(c => c + 1);
              return 0; // Reset progress for next slide
            } else {
              setIsPlaying(false);
              setHasStarted(false);
              if (onComplete) onComplete();
              return 100; // Stay at 100 for the last slide
            }
          }
          return newProgress;
        });
      }, 50);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentSlide, slides, onComplete]);

  const togglePlay = () => {
    playSound('click');
    if (!hasStarted) setHasStarted(true);
    if (progress >= 100 && currentSlide === slides.length - 1) {
      // Replay
      setCurrentSlide(0);
      setProgress(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const jumpToSlide = (index: number) => {
    playSound('hover');
    setCurrentSlide(index);
    setProgress(0);
    setHasStarted(true);
    setIsPlaying(true);
  };

  const current = slides[currentSlide];

  return (
    <div className="bg-black rounded-2xl overflow-hidden relative shadow-lg group border border-white/10 flex flex-col">
      {/* Video Content Area */}
      <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-8">
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%2314b8a6\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
        
        <AnimatePresence mode="wait">
          {!hasStarted && !isPlaying && progress === 0 ? (
            <motion.div 
              key="start"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-10 cursor-pointer"
              onClick={togglePlay}
            >
              <div className="w-16 h-16 rounded-full bg-teal-500 flex items-center justify-center pl-1 shadow-[0_0_30px_rgba(20,184,166,0.5)] transform hover:scale-110 transition-transform">
                <Play className="text-white fill-white" size={32} />
              </div>
              <h3 className="text-white font-bold mt-4 tracking-widest uppercase text-sm">{title}</h3>
            </motion.div>
          ) : (
            <motion.div 
              key={current.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="relative z-10 flex flex-col items-center text-center max-w-lg"
            >
              {current.Icon && (
                <current.Icon className="text-teal-400 mb-6" size={48} />
              )}
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">{current.title}</h2>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">{current.content}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Video Controls */}
      <div className="bg-black/90 p-4 border-t border-white/10 flex flex-col gap-3">
        {/* Progress Bars */}
        <div className="flex gap-1">
          {slides.map((slide, idx) => (
            <div 
              key={slide.id} 
              className="h-1.5 flex-1 bg-white/20 rounded-full overflow-hidden cursor-pointer hover:h-2 transition-all"
              onClick={() => jumpToSlide(idx)}
            >
              <div 
                className="h-full bg-teal-500 rounded-full"
                style={{ 
                  width: idx < currentSlide ? '100%' : idx === currentSlide ? `${progress}%` : '0%',
                  transition: isPlaying && idx === currentSlide ? 'none' : 'width 0.3s' 
                }}
              />
            </div>
          ))}
        </div>

        {/* Play Pause */}
        <div className="flex items-center justify-between">
          <button onClick={togglePlay} className="text-white hover:text-teal-400 transition-colors p-1">
            {progress >= 100 && currentSlide === slides.length - 1 ? (
              <RotateCcw size={20} />
            ) : isPlaying ? (
              <Pause size={20} />
            ) : (
              <Play size={20} className="fill-current" />
            )}
          </button>
          
          <div className="text-xs font-mono text-gray-500 font-bold uppercase tracking-wider text-right pr-2">
            Slide {currentSlide + 1} / {slides.length}
          </div>
        </div>
      </div>
    </div>
  );
};
