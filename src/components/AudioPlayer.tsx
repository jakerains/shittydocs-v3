import React, { useState, useEffect } from 'react';
import { Pause, Play, XCircle } from 'lucide-react';
import { useSpring, animated } from '@react-spring/web';

interface AudioPlayerProps {
  isPlaying: boolean;
  isLoading: boolean;
  isFullscreen?: boolean;
  loadingMessage?: string;
  isPaused: boolean;
  onPauseResume: () => void;
  onStop: () => void;
}

export function AudioPlayer({ 
  isPlaying, 
  isLoading, 
  loadingMessage, 
  isFullscreen,
  isPaused,
  onPauseResume, 
  onStop 
}: AudioPlayerProps) {
  const [position, setPosition] = useState({ x: 0, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const isMobile = window.innerWidth < 768;
  const playerWidth = isMobile ? window.innerWidth - 32 : 500;
  const playerHeight = 100;

  // Initialize position in the center
  useEffect(() => {
    const updatePosition = () => {
      const y = Math.max(16, Math.min(window.innerHeight - playerHeight - 16, 20));
      const x = 0; // Center position is handled by CSS transform
      setPosition({ x, y });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      const maxX = window.innerWidth - playerWidth;
      const maxY = window.innerHeight - playerHeight;
      
      // Calculate new position while keeping the player within viewport bounds
      const newX = Math.max(-playerWidth/2, Math.min(maxX/2, position.x + dx));
      const newY = Math.max(16, Math.min(maxY - 16, position.y + dy));
      
      setPosition({ x: newX, y: newY });
      setDragStart({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, position, playerWidth]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target instanceof HTMLButtonElement) return; // Don't start drag if clicking buttons
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: `${position.y}px`,
        left: '50%', 
        transform: `translate(calc(-50% + ${position.x}px))`,
        cursor: isDragging ? 'grabbing' : 'grab',
        width: playerWidth,
        zIndex: 50
      }}
      className={`
                bg-amber-100 rounded-full shadow-lg border border-amber-200
                flex items-center justify-between gap-2 md:gap-4 px-5 md:px-8 py-4
                ${isPlaying ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}
                transition-all duration-300 ease-out select-none
                hover:shadow-xl`}
      onMouseDown={handleMouseDown}
    >
      <div className="flex flex-col justify-center min-w-0 flex-1">
        <span className="text-amber-900 font-medium text-base md:text-lg truncate">PawPaw Jenkins</span>
        <span className="text-amber-800/70 text-xs md:text-sm truncate">
          {isLoading ? loadingMessage || 'Getting ready...' : isPaused ? 'Paused' : 'Reading aloud'}
        </span>
      </div>

      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={onPauseResume}
          className="p-1.5 md:p-2 lg:p-3 hover:bg-amber-200/50 rounded-full transition-colors duration-200 cursor-pointer"
          disabled={isLoading}
          type="button"
          onMouseDown={(e) => e.stopPropagation()}
          aria-label={isPaused ? "Play" : "Pause"}
        >
          {isPaused ? (
            <Play size={18} className="text-amber-900 md:w-5 md:h-5 lg:w-6 lg:h-6" />
          ) : (
            <Pause size={18} className="text-amber-900 md:w-5 md:h-5 lg:w-6 lg:h-6" />
          )}
        </button>
        <button
          onClick={onStop}
          className="p-1.5 md:p-2 lg:p-3 hover:bg-amber-200/50 rounded-full transition-colors duration-200 cursor-pointer"
          aria-label="Stop playback"
          type="button"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <XCircle size={18} className="text-amber-900 md:w-5 md:h-5 lg:w-6 lg:h-6" />
        </button>
      </div>
    </div>
  );
}