import React, { useState, useRef, useEffect } from 'react';
import { Share2, Brain, Sparkles, ArrowDown, AlignJustify, X } from 'lucide-react';
import { useRotatingText } from '../hooks/useRotatingText';
import { trackSearch, trackShare, trackFullscreen, trackTopicClick, trackRandomSearch } from '../services/analytics';
import { getChatResponse } from '../services/chat';
import { processDocument } from '../services/documentProcessor';
import { SearchResults } from './SearchResults';
import { SearchInput } from './SearchInput';
import { TopicButtons } from './TopicButtons';
import { Footer } from './Footer';
import { ChangelogModal } from './ChangelogModal';
import { ViewportIndicator } from './ViewportIndicator';
import { ChainOfThoughtModal } from './ChainOfThoughtModal';
import ReactMarkdown from 'react-markdown';

export function SearchInterface() {
  const [isSearching, setIsSearching] = useState(false);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [reasoningContent, setReasoningContent] = useState<string | undefined>(undefined);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [currentTopics, setCurrentTopics] = useState<Array<{topic: string, prompt: string}>>([]);
  const [tabPressed, setTabPressed] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [resultsHeight, setResultsHeight] = useState<number>(400);
  const [isResizing, setIsResizing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isChangelogOpen, setIsChangelogOpen] = useState(false);
  const [isDeepThoughtEnabled, setIsDeepThoughtEnabled] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isStreamingCOT, setIsStreamingCOT] = useState(false);
  const [isChainOfThoughtOpen, setIsChainOfThoughtOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [randomPrompts] = useState([
    "Tell me some mind-bending shit about quantum mechanics that'll make my brain explode",
    "What's the most fucked up thing that happened in ancient Rome?",
    "Explain some crazy-ass animal adaptations that sound made up but aren't",
    "Give me the weirdest shit about human psychology that nobody talks about",
    "What's some mind-blowing space facts that'll make me question reality?",
    "Tell me about some ancient civilization shit that modern science still can't explain",
    "What's the most metal thing about deep sea creatures?",
    "Explain some mathematical concepts that'll make me say 'what the actual fuck'",
    "Tell me about some historical figures who were absolute mad lads",
    "What's the craziest chemical reaction that sounds like it shouldn't be possible?",
    "Give me some wild facts about the human body that'll freak me out",
    "What's the most insane engineering feat in ancient history?",
    "Tell me about some philosophical paradoxes that'll keep me up at night",
    "What's the weirdest shit about quantum entanglement?",
    "Explain some geological events that were absolutely catastrophic"
  ]);

  // Loading messages that will rotate
  const loadingMessages = [
    "Gathering all the good shit...",
    "Making this shit interesting...",
    "Converting boring-ass content...",
    "Removing unnecessary bullshit...",
    "Adding some flavor to this shit...",
    "Making sure this shit makes sense...",
    "Spicing up the boring parts...",
    "Translating to human language...",
    "Making it not suck...",
    "Adding the secret sauce..."
  ];

  // Deep thinking loading messages
  const deepThinkingMessages = [
    "Getting into some deep shit now...",
    "Thinking harder than your stoned roommate...",
    "Connecting dots like a conspiracy theorist...",
    "Doing big brain shit...",
    "Diving deeper than your ex's Instagram stalking...",
    "Firing more neurons than a freshman on finals day...",
    "Getting philosophical as fuck...",
    "Making connections like your desperate aunt at family reunions...",
    "Doing some serious mental gymnastics...",
    "Pondering this shit like Aristotle after a bong hit..."
  ];

  // Function to rotate loading messages
  useEffect(() => {
    if (!isLoading) return;
    
    let messageIndex = 0;
    const messages = isDeepThoughtEnabled ? 
      [...deepThinkingMessages, ...loadingMessages] : 
      loadingMessages;
    
    setLoadingMessage(loadingMessages[0]);

    const interval = setInterval(() => {
      messageIndex = (messageIndex + 1) % messages.length;
      setLoadingMessage(messages[messageIndex]);
    }, 2000);

    return () => clearInterval(interval);
  }, [isLoading, isDeepThoughtEnabled]);

  // All possible topic buttons
  const allTopics = [
    { topic: "quantum physics", prompt: "Tell me some mind-blowing shit about quantum physics" },
    { topic: "space", prompt: "What's the weirdest fucking thing about space?" },
    { topic: "human body", prompt: "Tell me some crazy shit about the human body" },
    { topic: "history", prompt: "What's the most fucked up historical fact?" },
    { topic: "cooking", prompt: "I need some easy-as-hell cooking shit for beginners." },
    { topic: "climate", prompt: "Give me the lowdown on that climate change shit—no BS." },
    { topic: "coding", prompt: "Lay out the essential shit I need to know to start coding." },
    { topic: "mythology", prompt: "Teach me the craziest shit about ancient mythologies." },
    { topic: "black holes", prompt: "I want some mind-bending shit about black holes." },
    { topic: "psychology", prompt: "Dish out some oddly satisfying shit about everyday psychology." },
    { topic: "ocean", prompt: "Why is the ocean so damn mysterious? Gimme that deep-sea shit." },
    { topic: "blockchain", prompt: "What the heck is blockchain, and why should I give a shit?" }
  ];

  // Function to get random topics
  const getRandomTopics = () => {
    const shuffled = [...allTopics].sort(() => Math.random() - 0.5);
    const width = window.innerWidth;
    let count = 5; // Desktop default
    
    if (width < 640) { // Mobile
      count = 3;
    } else if (width < 1024) { // Tablet
      count = 4;
    }
    
    return shuffled.slice(0, count);
  };

  // Update topics periodically
  useEffect(() => {
    if (isSearching) return;
    setCurrentTopics(getRandomTopics());

    const handleResize = () => setCurrentTopics(getRandomTopics());
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isSearching]);

  // Handle mouse move during resize
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      const container = document.getElementById('results-container');
      if (!container) return;
      
      const containerRect = container.getBoundingClientRect();
      const newHeight = Math.max(200, Math.min(800, e.clientY - containerRect.top));
      setResultsHeight(newHeight);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // Update Chain of Thought height when results height changes
  useEffect(() => {
    // This effect will sync the height of both panes when resultsHeight changes
    const cotContainer = document.querySelector('.bg-gradient-to-br.from-\\[\\#3c1f10\\].to-\\[\\#2a1208\\].rounded-3xl');
    if (cotContainer && !isFullscreen) {
      (cotContainer as HTMLElement).style.height = `${resultsHeight}px`;
    }
  }, [resultsHeight, isFullscreen]);

  const placeholderSuggestions = [
    "Tell me some mind-blowing shit about quantum physics",
    "What's the weirdest fucking thing about space?",
    "Explain that quantum entanglement shit so my brain doesn't implode.",
    "Break down the weird shit about the stock market.",
    "I need some easy-as-hell cooking shit for beginners.",
    "Give me the lowdown on that climate change shit—no BS.",
    "Lay out the essential shit I need to know to start coding.",
    "Teach me the craziest shit about ancient mythologies.",
    "I want some mind-bending shit about black holes.",
    "How do I handle my tax shit without going insane?",
    "What's the strangest possible shit about quantum computers?",
    "Dish out some oddly satisfying shit about everyday psychology.",
    "Why is the ocean so damn mysterious? Gimme that deep-sea shit.",
    "I need the simplest explainer for this data science shit.",
    "What the heck is blockchain, and why should I give a shit?",
    "Help me figure out my relationship shit before it blows up.",
    "I'm looking for mind-blowing astronomy shit—got any?",
    "Why is Shakespeare's shit still a big deal? Educate me.",
    "Give me some surprisingly badass shit about medieval history.",
    "How do I stop my plant shit from dying every time I try to grow something?"
  ];

  const { text: placeholderText, isVisible, direction } = useRotatingText(placeholderSuggestions, 4000, !isFocused);

  const toggleDeepThought = () => {
    setIsDeepThoughtEnabled(!isDeepThoughtEnabled);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const searchQuery = query.trim() || placeholderText.replace(/^"|"$/g, '');
    if (!searchQuery) return;
    
    setQuery(searchQuery);
    setIsSearching(true);
    setIsLoading(true);
    
    // Reset streaming state
    setIsStreamingCOT(false);
    setReasoningContent('');
    
    try {
      if (isDeepThoughtEnabled) {
        // Setup streaming callbacks for Deep Thought mode
        setIsStreamingCOT(true);
        // Automatically open the chain of thought when deep thought mode is enabled
        setIsChainOfThoughtOpen(true);
        
        const streamCallbacks = {
          onReasoningChunk: (chunk: string) => {
            setReasoningContent(prev => (prev || '') + chunk);
          },
          onContentChunk: (chunk: string) => {
            // We'll update the final content when complete
          }
        };
        
        const { content, reasoningContent } = await getChatResponse(
          searchQuery, 
          isDeepThoughtEnabled,
          streamCallbacks
        );
        
        setResponse(content);
        // reasoningContent is already being set via the streaming callback
        setIsStreamingCOT(false);
      } else {
        // Regular non-streaming mode
        const { content, reasoningContent } = await getChatResponse(searchQuery, isDeepThoughtEnabled);
        setResponse(content);
        setReasoningContent(reasoningContent);
      }
      
      trackSearch(searchQuery);
    } catch (error) {
      setResponse("Shit broke. Try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRandomSearch = () => {
    const randomTopic = randomPrompts[Math.floor(Math.random() * randomPrompts.length)];
    setQuery(randomTopic);
    setIsFocused(true);
    trackRandomSearch(randomTopic);
    setIsSearching(true);
    setIsLoading(true);
    setReasoningContent(undefined);
    
    getChatResponse(randomTopic, isDeepThoughtEnabled)
      .then(({ content, reasoningContent }) => {
        setResponse(content);
        setReasoningContent(reasoningContent);
        trackSearch(randomTopic);
      })
      .catch(error => {
        setResponse("Shit broke. Try again later.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleTopicClick = async ({ topic, prompt }: { topic: string, prompt: string }) => {
    setQuery(prompt);
    setIsSearching(true);
    setIsLoading(true);
    setReasoningContent(undefined);
    
    try {
      const { content, suggestions: newSuggestions, reasoningContent } = await getChatResponse(prompt, isDeepThoughtEnabled);
      setResponse(content);
      setSuggestions(newSuggestions);
      setReasoningContent(reasoningContent);
      trackTopicClick(topic, prompt);
    } catch (error) {
      setResponse("Shit broke. Try again later.");
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(response);
      setCopySuccess(true);
      trackShare('clipboard');
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        const shareTitle = 'ShittyDocs - Learn Some Shit';
        const shareDescription = 'Get straight to the point documentation without the bullshit. Learn programming concepts quickly and efficiently.';
        const shareImage = `${window.location.origin}/images/social-preview.png`;

        const shareData = {
          title: shareTitle,
          text: shareDescription,
          url: window.location.href
        };

        await navigator.share(shareData);
        trackShare('native');
      } catch (err) {
        if (!(err instanceof Error) || err.name !== 'AbortError') {
          console.error('Error sharing: ', err);
        }
      }
    } else {
      try {
        const shareText = `Check out ShittyDocs - Learn Some Shit\n\nGet straight to the point documentation without the bullshit. Learn programming concepts quickly and efficiently.\n\n${window.location.href}`;
        await navigator.clipboard.writeText(shareText);
        setCopySuccess(true);
        trackShare('clipboard');
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (err) {
        console.error('Failed to copy share text: ', err);
      }
    }
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    trackFullscreen(!isFullscreen);
  };

  const handleClose = () => {
    setIsSearching(false);
    setIsFullscreen(false);
    setIsLoading(false);
    setQuery('');
    setResponse('');
    setReasoningContent(undefined);
    setSuggestions([]);
    setIsAudioPlaying(false); // Reset audio playing state when closing
    setIsChainOfThoughtOpen(false); // Close the chain of thought modal when closing
  };
  
  // Handler for audio playing state
  const handleAudioPlayingChange = (isPlaying: boolean) => {
    setIsAudioPlaying(isPlaying);
  };
  
  // Handler for toggling the chain of thought modal
  const toggleChainOfThought = () => {
    setIsChainOfThoughtOpen(!isChainOfThoughtOpen);
  };

  // Event handler for resizing both panes together
  const handleResultsResize = () => {
    setIsResizing(true);
  };

  return (
    <div className="min-h-screen bg-[#6c412f] text-neutral-100 flex flex-col items-center p-4 min-w-full relative">
      <div className={`w-full max-w-6xl transition-all duration-500 ease-out mb-6 ${
        isSearching ? 'translate-y-[-2rem]' : 'scale-100'
      }`}>
        {!isSearching && (
          <div className="absolute top-4 right-4 z-50">
            {/* Viewport indicator above share button */}
            <div className="flex flex-col items-end gap-2">
              <ViewportIndicator className="mb-1 mr-1" />
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#3c1f10]/80 
                         hover:bg-[#3c1f10] transition-all duration-200
                         text-amber-200/90 hover:text-amber-200
                         border border-amber-900/20 shadow-inner text-sm"
              >
                <Share2 size={16} />
                <span>Share</span>
              </button>
            </div>
          </div>
        )}
        
        <div className="relative flex flex-col items-center gap-0 pt-4">
          <div className="flex flex-col items-center">
            {/* Conditionally render the main image based on different states */}
            {isAudioPlaying ? (
              /* PawPaw Jenkins Image when audio is playing */
              <div className="flex flex-col items-center">
                <img 
                  src="/images/pawpaw.png" 
                  alt="PawPaw Jenkins Reading Aloud" 
                  className="h-[300px] lg:h-[400px] mb-2 drop-shadow-[0_4px_3px_rgba(0,0,0,0.3)] transition-all duration-300"
                />
                <div className="w-full max-w-md bg-amber-600/20 border border-amber-600/30 rounded-xl p-4 mb-4 text-center">
                  <h3 className="text-amber-200 font-bold text-xl mb-2">PawPaw Jenkins is Reading!</h3>
                  <p className="text-amber-200/90">
                    Listen up as PawPaw breaks this shit down for you in his own unique style.
                  </p>
                </div>
              </div>
            ) : isDeepThoughtEnabled ? (
              /* Deep Shit Image when Deep Shit Mode is enabled */
              <div className="flex flex-col items-center">
                <img 
                  src="/images/smartshit-mini.png" 
                  alt="Deep Shit - Deep Thinking Mode" 
                  className="h-[260px] lg:h-[340px] mb-2 drop-shadow-[0_4px_3px_rgba(0,0,0,0.3)] transition-all duration-300"
                />
                <div className="w-full max-w-3xl bg-amber-500/20 border border-amber-500/30 rounded-xl p-4 mb-4">
                  <div className="text-center">
                    <h3 className="text-amber-200 font-bold text-xl mb-2">You're in Deep Shit <span className="text-[8px] align-text-top opacity-60">Mode</span> Now!</h3>
                    <p className="text-amber-200/90">
                      Advanced AI reasoning for deeper, more detailed responses. Prepare for some seriously profound shit!
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* Default ShittyDocs Image */
              <img 
                src="/images/sd2transparent.png" 
                alt="Shitty Docs Logo and Mascot" 
                className="h-[300px] lg:h-[400px] mb-2 drop-shadow-[0_4px_3px_rgba(0,0,0,0.3)] transition-all duration-300"
              />
            )}
            
            {!isSearching && (
              <TopicButtons
                topics={currentTopics}
                onTopicClick={handleTopicClick}
              />
            )}
            
            {isSearching && (
              <div className={`w-full ${isChainOfThoughtOpen && reasoningContent && !isFullscreen ? 'dual-pane-layout' : ''}`}>
                {/* When fullscreen, the results container should appear above everything else with higher z-index */}
                <div className={`${isFullscreen ? 'z-50' : ''}`}>
                  <SearchResults
                    query={query}
                    response={response}
                    reasoningContent={reasoningContent}
                    isFullscreen={isFullscreen}
                    resultsHeight={resultsHeight}
                    isLoading={isLoading}
                    loadingMessage={loadingMessage}
                    copySuccess={copySuccess}
                    onFullscreen={handleFullscreen}
                    onCopy={handleCopyToClipboard}
                    onShare={handleShare}
                    onClose={handleClose}
                    onResize={handleResultsResize}
                    onAudioPlayingChange={handleAudioPlayingChange}
                  />
                </div>
                
                {/* Chain of Thought container - ONLY rendered when NOT in fullscreen mode */}
                {isChainOfThoughtOpen && reasoningContent && !isFullscreen && (
                  <div className="w-full mb-6 px-4 sm:px-6 lg:px-0">
                    <ChainOfThoughtModal
                      isOpen={true}
                      onClose={() => setIsChainOfThoughtOpen(false)}
                      reasoningContent={reasoningContent}
                      isStreaming={isStreamingCOT}
                    />
                  </div>
                )}
              </div>
            )}
            
            <SearchInput
              query={query}
              isFocused={isFocused}
              placeholderText={placeholderText}
              direction={direction}
              isVisible={isVisible}
              isSearching={isSearching}
              onQueryChange={setQuery}
              onKeyDown={(e) => {
                if (e.key === 'Tab') {
                  setTabPressed(true);
                } else {
                  setTabPressed(false);
                }
                
                if (e.key === 'Enter' && tabPressed) {
                  e.preventDefault();
                  handleRandomSearch();
                }
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onSubmit={handleSearch}
              onRandom={handleRandomSearch}
              onDeepThought={toggleDeepThought}
              isDeepThoughtEnabled={isDeepThoughtEnabled}
            />
          </div>
        </div>
      </div>

      <Footer
        isSearching={isSearching}
        onChangelogClick={() => setIsChangelogOpen(true)}
      />
      
      <ChangelogModal
        isOpen={isChangelogOpen}
        onClose={() => setIsChangelogOpen(false)}
      />
    </div>
  );
}