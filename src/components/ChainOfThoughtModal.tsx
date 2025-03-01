import React, { useEffect, useRef } from 'react';
import { X, Brain, Sparkles, ArrowDown, AlignJustify, Code } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ChainOfThoughtModalProps {
  isOpen: boolean;
  onClose: () => void;
  reasoningContent: string;
  isStreaming?: boolean;
}

export function ChainOfThoughtModal({ isOpen, onClose, reasoningContent, isStreaming = false }: ChainOfThoughtModalProps) {
  if (!isOpen) return null;

  // Auto-scroll to bottom when content updates during streaming
  const contentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (isStreaming && contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [reasoningContent, isStreaming]);

  // Format the reasoning content for better presentation
  const formattedReasoning = reasoningContent.replace(/\n/g, '\n\n');

  // Determine if we're showing empty content or still waiting for content
  const isEmptyContent = !reasoningContent || reasoningContent.trim() === '';

  return (
    <div className="relative w-full h-full">      
      {/* Main modal container */}
      <div 
        className="bg-gradient-to-br from-[#3c1f10] to-[#2a1208] rounded-3xl 
                   w-full shadow-xl overflow-hidden 
                   border border-amber-900/40"
        style={{ height: '400px' }} // Set a fixed height to match results box
      >
        {/* Header with title and controls */}
        <div className="sticky top-0 left-0 right-0 px-6 py-4 bg-[#3c1f10] border-b border-amber-900/30 
                      flex items-center justify-between z-10 shadow-md">
          <h2 className="text-xl font-bold text-amber-200 flex items-center gap-2">
            <div className="relative flex items-center justify-center w-8 h-8">
              <Brain size={22} className="relative z-10 text-amber-200" />
              <Sparkles size={12} className="absolute -top-1 -right-1 text-amber-400 animate-pulse" />
            </div>
            <span className="whitespace-nowrap">Chain of Deep-Ass Thought</span>
          </h2>
          
          {isStreaming && (
            <div className="flex items-center gap-2 bg-amber-500/20 px-3 py-1 rounded-full">
              <div className="h-2 w-2 bg-amber-500 rounded-full animate-pulse"></div>
              <span className="text-amber-200/90 text-sm font-medium">Live Streaming</span>
            </div>
          )}
          
          <button
            onClick={onClose}
            className="p-2 rounded-full 
                      bg-amber-200/20 hover:bg-amber-200/30 active:bg-amber-200/40
                      text-amber-200/90 hover:text-amber-200
                      transition-all duration-200 transform hover:scale-110 active:scale-95
                      shadow-inner border border-amber-900/20
                      focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>
        
        {/* Content area - scrollable with fixed height */}
        <div 
          ref={contentRef}
          className="overflow-y-auto overflow-x-hidden px-6 pb-6"
          style={{ height: 'calc(100% - 112px)' }} // Account for header and footer more precisely
        >
          {isEmptyContent && isStreaming ? (
            <div className="flex flex-col items-center justify-center h-64 text-center p-4">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-amber-500/30 border-t-amber-500 mb-4"></div>
              <p className="text-amber-200 text-lg font-medium">Thinking deep as shit thoughts...</p>
              <p className="text-amber-200/70 text-sm mt-2">Deep Shit is breaking this down step-by-step.</p>
            </div>
          ) : (
            <div className="p-6">
              <div className="flex gap-3 mb-6">
                <div className="flex-shrink-0 w-6 h-6 mt-1 bg-amber-500/20 flex items-center justify-center rounded-full">
                  <AlignJustify size={12} className="text-amber-200" />
                </div>
                <div className="text-amber-200/90 text-sm">
                  <p className="font-medium mb-1">Here's how Deep Shit is thinking about this:</p>
                  <p className="opacity-80">This shows the AI's step-by-step reasoning process to create a more thoughtful response.</p>
                </div>
              </div>
              
              {/* The reasoning content with improved styling */}
              <div className="relative">
                {/* Side decoration to indicate a code/thought block */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400/50 via-amber-500/30 to-amber-600/50 rounded-full"></div>
                
                {/* Content with padding for the side decoration */}
                <div className="pl-6 prose prose-amber prose-lg max-w-none space-y-4
                              prose-headings:text-amber-200/90 prose-headings:font-bold 
                              prose-p:text-amber-200/80 prose-p:leading-relaxed
                              prose-strong:text-amber-400 prose-strong:font-bold
                              prose-em:text-amber-300/90 prose-em:italic
                              prose-code:text-amber-300 prose-code:bg-amber-900/30 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                              prose-ul:text-amber-200/80 prose-ul:list-disc prose-ul:pl-6
                              prose-ol:text-amber-200/80 prose-ol:list-decimal prose-ol:pl-6
                              prose-li:text-amber-200/80 prose-li:pl-2
                              prose-a:text-amber-400 prose-a:no-underline hover:prose-a:text-amber-300
                              [&>*:first-child]:mt-0">
                  <ReactMarkdown>
                    {formattedReasoning || 'No reasoning available for this response.'}
                  </ReactMarkdown>
                </div>
                
                {isStreaming && (
                  <div className="absolute bottom-0 right-0 animate-bounce text-amber-500">
                    <ArrowDown size={20} />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Footer with close button and info */}
        <div className="sticky bottom-0 left-0 right-0 p-3 border-t border-amber-900/30 
                       bg-gradient-to-b from-[#2a1208]/90 to-[#2a1208] text-center
                       flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-200/60 text-xs">
            <Code size={14} />
            <span>See the raw thought process that powers your response</span>
          </div>
          
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-amber-200/20 
                     hover:bg-amber-200/30 active:bg-amber-200/40
                     text-amber-200/90 hover:text-amber-200 text-sm
                     transition-all duration-200 transform hover:scale-105 active:scale-95
                     shadow-inner border border-amber-900/20"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}