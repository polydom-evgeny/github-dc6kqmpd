import React, { useState, useEffect } from 'react';
import { Bot } from 'lucide-react';
import { SETUP_MESSAGES } from '@/lib/constants';

interface FinalSetupLoaderProps {
  parsingProgress?: number;
  isParsingComplete?: boolean;
}

export function FinalSetupLoader({ parsingProgress = 0, isParsingComplete = false }: FinalSetupLoaderProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayedMessage, setDisplayedMessage] = useState(SETUP_MESSAGES[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentMessageIndex((prev) => {
          const nextIndex = prev === SETUP_MESSAGES.length - 1 ? 0 : prev + 1;
          setDisplayedMessage(SETUP_MESSAGES[nextIndex]);
          return nextIndex;
        });
        setIsTransitioning(false);
      }, 300); // Match the animation duration
    }, 5000); // Increased interval for better readability

    return () => clearInterval(interval);
  }, []);

  const progress = isParsingComplete ? 100 : Math.min(95, parsingProgress);

  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-8 bg-white rounded-lg shadow-lg">
      <div className="relative">
        <div className="absolute inset-0 animate-ping">
          <Bot className="w-12 h-12 text-green-500 opacity-75" />
        </div>
        <Bot className="w-12 h-12 text-green-500 relative" />
      </div>
      
      <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-green-500 transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <p className="text-lg font-medium text-gray-800 text-center max-w-md animate-fade-in">
        <span 
          key={currentMessageIndex}
          className={isTransitioning ? 'animate-fade-out' : 'animate-fade-in'}
        >
          {displayedMessage}
        </span>
      </p>
    </div>
  );
}