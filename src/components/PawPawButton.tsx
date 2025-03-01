import React from 'react';
import { Volume2 } from 'lucide-react';

interface PawPawButtonProps {
  onClick: () => void;
}

const introMessages = [
  "Let PawPaw Jenkins read you some shit",
  "PawPaw's putting on his reading glasses...",
  "Hold up while PawPaw gets comfortable...",
  "PawPaw's clearing his throat for ya...",
  "Let PawPaw enlighten you with this shit...",
  "Time for PawPaw's storytime...",
];

export function PawPawButton({ onClick }: PawPawButtonProps) {
  // Get a random intro message
  const message = introMessages[Math.floor(Math.random() * introMessages.length)];
  
  return (
    <button
      onClick={onClick}
      className="ml-auto px-4 py-2 rounded-lg bg-[#3c1f10]/80 
                hover:bg-[#3c1f10] transition-all duration-200
                text-amber-200/90 hover:text-amber-200
                border border-amber-900/20 shadow-inner
                flex items-center gap-2"
    >
      <Volume2 size={18} />
      <span>Have PawPaw Jenkins Read Aloud</span>
    </button>
  );
}