import React from 'react';
import { BrainCircuit } from 'lucide-react';
import { Toggle, GooeyFilter } from './ui/liquid-toggle';
import { motion, AnimatePresence } from '@react-spring/web';

// Configuration for input width in different scenarios
// Adjust these values to fine-tune the input width
const INPUT_WIDTH_CONFIG = {
  // Width for desktop (px or % values)
  desktop: {
    normal: '800px',   // Normal mode on desktop
    deepShit: '820px'  // Deep Shit mode on desktop - slightly wider
  },
  // Width for tablets (px or % values) 
  tablet: {
    normal: '95%',     // Normal mode on tablet
    deepShit: '145%'   // Deep Shit mode on tablet - now 120% instead of 100%
  },
  // Width for mobile (px or % values)
  mobile: {
    normal: '95%',     // Normal mode on mobile - now 95% to allow for increase
    deepShit: '110%'   // Deep Shit mode on mobile - now 110% instead of 100%
  },
  // Breakpoints
  breakpoints: {
    mobile: 640,       // Max width for mobile devices
    tablet: 1024       // Max width for tablet devices
  },
  // Gradient border configuration
  gradientBorder: {
    size: '3px',       // Border thickness
    radius: '30px'     // Border radius
  }
};

interface SearchInputProps {
  query: string;
  isFocused: boolean;
  placeholderText: string;
  direction: 'up' | 'down';
  isVisible: boolean;
  isSearching: boolean;
  onQueryChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onFocus: () => void;
  onBlur: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onRandom: () => void;
  onDeepThought: () => void;
  isDeepThoughtEnabled: boolean;
}

export function SearchInput({
  query,
  isFocused,
  placeholderText,
  direction,
  isVisible,
  isSearching,
  onQueryChange,
  onKeyDown,
  onFocus,
  onBlur,
  onSubmit,
  onRandom,
  onDeepThought,
  isDeepThoughtEnabled
}: SearchInputProps) {
  // Determine the current device size
  const [windowWidth, setWindowWidth] = React.useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  React.useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Determine which width configuration to use based on screen size
  const getWidthConfig = () => {
    const { breakpoints, mobile, tablet, desktop } = INPUT_WIDTH_CONFIG;
    if (windowWidth <= breakpoints.mobile) {
      return mobile;
    } else if (windowWidth <= breakpoints.tablet) {
      return tablet;
    }
    return desktop;
  };

  // Get the appropriate width based on current mode and device
  const widthConfig = getWidthConfig();
  const currentWidth = isDeepThoughtEnabled ? widthConfig.deepShit : widthConfig.normal;

  // Base input classes
  const inputClasses = `px-6 sm:px-8 lg:px-10 py-3 sm:py-4 bg-amber-100/90 
                      text-base lg:text-lg text-[#6c412f] 
                      placeholder:text-[#6c412f]/70 outline-none shadow-lg search-input
                      text-center focus:text-left transition-all duration-300
                      placeholder:animation-duration-300 placeholder:will-change-transform
                      ${isSearching ? 'rounded-3xl' : 'rounded-full hover:shadow-xl'}`;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-0 flex flex-col items-center">
      <form onSubmit={onSubmit} className="relative w-full" style={{ maxWidth: currentWidth }}>
        <div className="relative flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
          <div className={`w-full relative`}>
            {/* Animated gradient border for Deep Shit Mode */}
            {isDeepThoughtEnabled && (
              <div 
                className="absolute gradient-border rounded-full -z-10" 
                style={{ 
                  top: `-${INPUT_WIDTH_CONFIG.gradientBorder.size}`,
                  left: `-${INPUT_WIDTH_CONFIG.gradientBorder.size}`,
                  right: `-${INPUT_WIDTH_CONFIG.gradientBorder.size}`,
                  bottom: `-${INPUT_WIDTH_CONFIG.gradientBorder.size}`,
                  borderRadius: INPUT_WIDTH_CONFIG.gradientBorder.radius
                }}
              ></div>
            )}
            <input
              type="text"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder={query || (isFocused ? "Ask me any shit..." : `"${placeholderText}"`)}
              style={{
                '--placeholder-animation': `${direction === 'up' ? 'fadeUpOut' : 'fadeUpIn'} ${isVisible ? '' : 'paused'}`,
              } as React.CSSProperties}
              onKeyDown={onKeyDown}
              onFocus={onFocus}
              onBlur={onBlur}
              className={`${inputClasses} w-full`}
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto flex-shrink-0 flex flex-col items-center justify-center
                     min-w-[120px] h-[50px] sm:h-[60px] px-4 lg:px-6 py-2 mt-2 sm:mt-0
                     bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700
                     text-white font-bold text-sm lg:text-base
                     rounded-2xl shadow-lg
                     hover:shadow-amber-600/30 hover:shadow-xl"
          >
            Learn Some Shit
          </button>
        </div>

        {/* Deep Shit Mode Toggle with Tooltip */}
        <div className="flex justify-start mt-3">
          <div className="group relative flex items-center gap-3 px-5 py-2.5 
                       bg-gradient-to-r from-[#3c1f10] to-[#5a331c] rounded-xl 
                       border border-amber-500/30 shadow-md
                       hover:shadow-amber-500/20 hover:shadow-lg transition-all duration-200 cursor-help
                       transform hover:scale-[1.02]">
            <GooeyFilter />
            <Toggle
              checked={isDeepThoughtEnabled}
              onCheckedChange={onDeepThought}
              variant="warning"
            />
            <span className="text-amber-200 font-semibold tracking-wide whitespace-nowrap text-sm sm:text-base">
              Deep Shit <span className="text-[8px] align-text-top opacity-60">Mode</span>
              {isDeepThoughtEnabled && <span className="ml-1 text-amber-400">Enabled</span>}
            </span>
            
            {/* Tooltip that appears BELOW on hover */}
            <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-2 w-72 sm:w-80 
                          invisible group-hover:visible opacity-0 group-hover:opacity-100 
                          translate-y-0 group-hover:translate-y-full
                          transition-all duration-200 z-10 pointer-events-none">
              <div className="mt-2 relative">
                {/* Triangle pointer */}
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 
                              w-0 h-0 border-l-8 border-r-8 border-b-8 
                              border-l-transparent border-r-transparent border-b-amber-100"></div>
                
                {/* Tooltip content */}
                <div className="bg-amber-100 text-amber-900 p-3 rounded-lg shadow-lg text-sm">
                  <p className="font-medium mb-1">The fuck is this?</p>
                  <p className="text-amber-800">Enable this shit to get deeper, more detailed responses with advanced reasoning. It's like the AI's diving deeper than your pyscho stalker ex-girlfriend on instagram to get a really great answer to your shitty question.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}