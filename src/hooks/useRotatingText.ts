import { useState, useEffect, useRef } from 'react';

export function useRotatingText(texts: string[], interval: number, isEnabled: boolean = true) {
  const [{ currentText, isVisible, direction }, setState] = useState({
    currentText: texts[0],
    isVisible: true,
    direction: 'up' as 'up' | 'down'
  });
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const indexRef = useRef(0);

  // Cleanup function to clear timeouts
  const cleanup = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  // Reset visibility when enabled state changes
  useEffect(() => {
    if (isEnabled) {
      setState({ currentText: texts[0], isVisible: true, direction: 'up' });
    } else {
      cleanup();
    }
  }, [isEnabled]);

  useEffect(() => {
    if (!isEnabled) return;
    
    const ANIMATION_DURATION = 600; // Total duration for fade out + fade in

    const rotate = () => {
      // Start fade out
      setState(prev => ({ ...prev, isVisible: false, direction: 'up' }));

      // After half the duration, change text and start fade in
      setTimeout(() => {
        indexRef.current = (indexRef.current + 1) % texts.length;
        setState({
          currentText: texts[indexRef.current],
          isVisible: true,
          direction: 'down'
        });
      }, ANIMATION_DURATION / 2);
    };

    timeoutRef.current = setInterval(rotate, interval);

    return cleanup;
  }, [texts, interval, isEnabled]);

  return { text: currentText, isVisible, direction };
}