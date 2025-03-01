import React, { useState, useRef, useEffect } from 'react';
import { Copy, Share2, RotateCcw, Volume2, Brain, ArrowRight, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { playText } from '../services/tts';
import { AudioPlayer } from './AudioPlayer';

interface SearchResultsProps {
  query: string;
  response: string;
  reasoningContent?: string;
  isFullscreen: boolean;
  resultsHeight: number;
  isLoading: boolean;
  loadingMessage: string;
  copySuccess: boolean;
  onFullscreen: () => void;
  onCopy: () => void;
  onShare: () => void;
  onClose: () => void;
  onResize: () => void;
  onAudioPlayingChange?: (isPlaying: boolean) => void;
}

export function SearchResults({
  query,
  response,
  reasoningContent,
  isFullscreen,
  resultsHeight,
  isLoading,
  loadingMessage,
  copySuccess,
  onFullscreen,
  onCopy,
  onShare,
  onClose,
  onResize,
  onAudioPlayingChange
}: SearchResultsProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [audioLoadingMessage, setAudioLoadingMessage] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const audioControlsRef = useRef<{
    audio: HTMLAudioElement;
    stop: () => void;
  } | null>(null);
  const isProcessingRef = useRef(false);

  // Notify parent component when audio state changes
  useEffect(() => {
    if (onAudioPlayingChange) {
      onAudioPlayingChange(isPlaying);
    }
  }, [isPlaying, onAudioPlayingChange]);

  async function handlePlayAudio() {
    try {
      // Prevent multiple clicks while processing
      if (isProcessingRef.current && !isPlaying) return;

      // If already playing, stop current playback
      if (isPlaying && audioControlsRef.current) {
        audioControlsRef.current.stop();
        audioControlsRef.current = null;
        setIsPlaying(false);
        setIsAudioLoading(false);
        setIsPaused(false);
        return;
      }

      isProcessingRef.current = true;
      setAudioLoadingMessage('Warming up PawPaw\'s voice...');
      setIsAudioLoading(true);
      setIsPlaying(true);
      
      const { audio, stop } = await playText(response);
      isProcessingRef.current = false;
      audioControlsRef.current = { audio, stop };
      setAudioLoadingMessage('');
      setIsAudioLoading(false);
      setIsPaused(false);

      // Add ended event listener
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        setIsPaused(false);
        if (audioControlsRef.current) {
          audioControlsRef.current.stop();
          audioControlsRef.current = null;
        }
      });

    } catch (error) {
      console.error('Failed to play audio:', error);
      // Clean up on error
      if (audioControlsRef.current) {
        audioControlsRef.current.stop();
        audioControlsRef.current = null;
      }
      isProcessingRef.current = false;
      setIsPlaying(false);
      setIsAudioLoading(false);
      setIsPaused(false);
      alert(error instanceof Error ? error.message : 'Failed to play audio. Please try again.');
    }
  }

  const handlePauseResume = () => {
    if (!audioControlsRef.current?.audio) return;
    
    try {
      const audio = audioControlsRef.current.audio;
      if (audio.paused) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPaused(false))
            .catch(error => {
              console.error('Error resuming audio:', error);
              setIsPaused(true);
            });
        }
      } else {
        audio.pause();
        setIsPaused(true);
      }
    } catch (error) {
      console.error('Error toggling pause state:', error);
    }
  };

  // Clean up audio when component unmounts
  useEffect(() => {
    return () => {
      if (audioControlsRef.current) {
        audioControlsRef.current.stop();
        audioControlsRef.current = null;
      }
    };
  }, []);

  return (
    <div id="results-container" className={`${isFullscreen ? 'w-full' : 'w-full max-w-[800px]'} mb-3 px-4 sm:px-6 lg:px-0`}>
      <div className={`mb-4 p-4 bg-[#3c1f10]/80 rounded-xl border border-amber-900/20 shadow-inner ${isFullscreen ? 'max-w-[1200px] mx-auto' : ''}`}>
        <p className="text-amber-200/90 text-sm">
          <span className="text-amber-200/70">You asked:</span>{' '}
          <span className="text-amber-200">{query}</span>
        </p>
      </div>

      <div className={`flex flex-col sm:flex-row gap-2 mb-2 ${isFullscreen ? 'max-w-[1200px] mx-auto w-full' : ''}`}>
        <button
          onClick={onFullscreen}
          className="w-full sm:w-auto sm:mr-auto px-4 py-2 rounded-lg bg-[#3c1f10]/80 
                   hover:bg-[#3c1f10] transition-all duration-200
                   text-amber-200/90 hover:text-amber-200
                   border border-amber-900/20 shadow-inner
                   flex items-center gap-2"
        >
          {isFullscreen ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" 
                   stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3v3a2 2 0 0 1-2 2H3"></path>
                <path d="M21 8h-3a2 2 0 0 1-2-2V3"></path>
                <path d="M3 16h3a2 2 0 0 1 2 2v3"></path>
                <path d="M16 21v-3a2 2 0 0 1 2-2h3"></path>
              </svg>
              <span>Exit Fullscreen</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" 
                   stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 8V5a2 2 0 0 1 2-2h3"></path>
                <path d="M16 3h3a2 2 0 0 1 2 2v3"></path>
                <path d="M21 16v3a2 2 0 0 1-2 2h-3"></path>
                <path d="M8 21H5a2 2 0 0 1-2-2v-3"></path>
              </svg>
              <span>Fullscreen</span>
            </>
          )}
        </button>

        <div className="flex flex-col sm:flex-row gap-2 mt-2 sm:mt-0">
          {!isPlaying && !isAudioLoading ? (
            <button
              onClick={handlePlayAudio}
              className="w-full sm:w-auto sm:ml-auto px-4 py-2 rounded-lg bg-[#3c1f10]/80 
                       hover:bg-[#3c1f10] transition-all duration-200
                       text-amber-200/90 hover:text-amber-200
                       border border-amber-900/20 shadow-inner
                       flex items-center gap-2 justify-center"
            >
              <Volume2 size={18} />
              <span className="hidden sm:inline">Have PawPaw Jenkins read aloud</span>
              <span className="sm:hidden">Have PawPaw read aloud</span>
            </button>
          ) : (
            <div className="w-[180px] md:w-[250px]"></div>
          )}
        </div>
      </div>

      <div className="p-8 bg-amber-100/90 rounded-3xl
                    overflow-y-auto transition-all duration-500 ease-out
                    shadow-2xl hover:shadow-2xl relative
                    transform opacity-0 translate-y-4 animate-fadeIn
                    border border-amber-200/30
                    backdrop-blur-sm overflow-hidden
                    prose-headings:text-amber-900
                    prose-h1:text-2xl prose-h1:font-bold
                    prose-h2:text-xl prose-h2:font-semibold
                    prose-p:text-gray-800
                    prose-strong:text-amber-900 prose-strong:font-bold
                    prose-em:text-amber-800
                    prose-ul:list-disc prose-ul:pl-5
                    prose-ol:list-decimal prose-ol:pl-5
                    prose-li:text-gray-800
                    ${isFullscreen ? 'fixed inset-0 z-[9999] m-0 rounded-none overflow-x-hidden' : ''}"
        style={{ 
          height: isFullscreen ? '100vh' : `${resultsHeight}px`,
          width: isFullscreen ? '100vw' : undefined,
          margin: isFullscreen ? '0' : undefined,
          padding: isFullscreen ? '4rem 2rem 2rem' : undefined,
          background: isFullscreen ? 'rgba(254, 243, 199, 0.98)' : undefined,
          overflowY: 'auto',
          overflowX: isFullscreen ? 'hidden' : undefined
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-amber-200/20 hover:bg-amber-200/30 transition-colors duration-200 text-amber-900/70 hover:text-amber-900"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {isLoading && (
          <div className="absolute inset-0 bg-amber-100/95 flex items-center justify-center backdrop-blur-sm rounded-3xl">
            <div className="flex flex-col items-center gap-8">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-500/30 border-t-amber-500"></div>
              <div className="text-amber-800 font-medium animate-fadeIn text-center">
                <p className="mb-2">{loadingMessage}</p>
              </div>
            </div>
          </div>
        )}

        <AudioPlayer
          isPlaying={isPlaying}
          isLoading={isAudioLoading}
          isPaused={isPaused}
          loadingMessage={audioLoadingMessage}
          isFullscreen={isFullscreen}
          onPauseResume={handlePauseResume}
          onStop={handlePlayAudio}
        />

        <div className="prose prose-lg max-w-none prose-pre:bg-amber-200/20 prose-pre:p-4 prose-pre:rounded-xl relative">
          <div 
            className={`text-lg text-gray-800 chat-response ${
              isFullscreen ? 'max-w-[1200px] w-[90%] mx-auto px-4' : ''
            }`}
          >
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  return (
                    <code
                      className={`${className} ${inline ? 'bg-amber-200/50 px-1 py-0.5 rounded' : 'block bg-amber-200/30 p-4 rounded-lg'}`}
                      {...props}
                    >
                      {children}
                    </code>
                  )
                },
                h1: ({ children }) => (
                  <h1 className="text-2xl font-bold text-amber-900 mb-4">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-xl font-semibold text-amber-900 mb-3">{children}</h2>
                ),
                p: ({ children }) => (
                  <p className="text-gray-800 mb-4">{children}</p>
                ),
                strong: ({ children }) => (
                  <strong className="text-amber-900 font-bold">{children}</strong>
                ),
                em: ({ children }) => (
                  <em className="text-amber-800">{children}</em>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc pl-5 mb-4 text-gray-800">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal pl-5 mb-4 text-gray-800">{children}</ol>
                ),
                li: ({ children }) => (
                  <li className="text-gray-800 mb-2">{children}</li>
                )
              }}
            >
              {response || ''}
            </ReactMarkdown>
          </div>
        </div>

        <div
          className={`absolute bottom-0 left-0 right-0 h-4 cursor-ns-resize flex items-center justify-center
                   hover:bg-amber-200/20 transition-colors duration-200 -mb-2 rounded-b-3xl
                   ${isFullscreen ? 'hidden' : ''}`}
          onMouseDown={onResize}
        >
          <div className="w-20 h-1 bg-amber-300/30 rounded-full"></div>
        </div>
      </div>

      <div className={`flex flex-col sm:flex-row justify-center gap-4 mt-4 mb-6 ${isFullscreen ? 'max-w-[1200px] mx-auto' : ''}`}>
        <button
          onClick={onCopy}
          className="w-full sm:w-auto flex items-center gap-2 px-4 py-2 rounded-lg bg-[#3c1f10]/80 
                   hover:bg-[#3c1f10] transition-all duration-200
                   text-amber-200/90 hover:text-amber-200
                   border border-amber-900/20 shadow-inner justify-center"
        >
          <Copy size={18} />
          <span>{copySuccess ? 'Copied!' : 'Copy'}</span>
        </button>
        <button
          onClick={onShare}
          className="w-full sm:w-auto flex items-center gap-2 px-4 py-2 rounded-lg bg-[#3c1f10]/80 
                  hover:bg-[#3c1f10] transition-all duration-200
                  text-amber-200/90 hover:text-amber-200
                  border border-amber-900/20 shadow-inner justify-center"
        >
          <Share2 size={18} />
          <span>{copySuccess ? 'Copied!' : 'Share'}</span>
        </button>
        <button
          onClick={onClose}
          className="w-full sm:w-auto flex items-center gap-2 px-4 py-2 rounded-lg bg-[#3c1f10]/80 
                   hover:bg-[#3c1f10] transition-all duration-200
                   text-amber-200/90 hover:text-amber-200
                   border border-amber-900/20 shadow-inner justify-center"
        >
          <RotateCcw size={18} />
          <span>Start Over</span>
        </button>
      </div>
    </div>
  );
}