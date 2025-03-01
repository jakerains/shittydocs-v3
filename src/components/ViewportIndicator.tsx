import React, { useState, useEffect } from 'react';

interface ViewportIndicatorProps {
  className?: string;
}

// Match these breakpoints with the ones in SearchInput.tsx
const BREAKPOINTS = {
  mobile: 640,       // Max width for mobile devices
  tablet: 1024       // Max width for tablet devices
};

export function ViewportIndicator({ className = '' }: ViewportIndicatorProps) {
  // Current viewport
  const [viewport, setViewport] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  
  // Update viewport on resize
  useEffect(() => {
    const updateViewport = () => {
      const width = window.innerWidth;
      if (width <= BREAKPOINTS.mobile) {
        setViewport('mobile');
      } else if (width <= BREAKPOINTS.tablet) {
        setViewport('tablet');
      } else {
        setViewport('desktop');
      }
    };
    
    // Set initial viewport
    updateViewport();
    
    // Add resize listener
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  return (
    <div className={`flex items-center justify-center gap-1.5 ${className}`}>
      {/* Always render 3 bullets, but activate them based on viewport */}
      <div 
        className={`w-2 h-2 rounded-full 
                   ${viewport === 'desktop' || viewport === 'tablet' || viewport === 'mobile' 
                    ? 'bg-amber-200' : 'bg-amber-200/30'}`}
      ></div>
      <div 
        className={`w-2 h-2 rounded-full 
                   ${viewport === 'desktop' || viewport === 'tablet' 
                    ? 'bg-amber-200' : 'bg-amber-200/30'}`}
      ></div>
      <div 
        className={`w-2 h-2 rounded-full 
                   ${viewport === 'desktop' 
                    ? 'bg-amber-200' : 'bg-amber-200/30'}`}
      ></div>
    </div>
  );
}