import React, { useEffect, useState } from 'react';
import { Bot, Clock, Phone, MapPin } from 'lucide-react';

interface AIReceptionistCardProps {
  phoneNumber: string;
  businessName: string;
  businessAddress: string;
  state: string;
  country: string;
  agentId: string;
}

// Add window type declaration for TypeScript
declare global {
  interface Window {
    chatWidgetConfig?: any;
    polyCallAPI?: any;
  }
}

export function AIReceptionistCard({ phoneNumber, businessName, state, country, agentId }: AIReceptionistCardProps) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const getLocation = () => {
    return `${state}, ${country === 'United States' ? 'USA' : country}`;
  };

  // Initialize widget
  useEffect(() => {
    // Configure widget
    window.chatWidgetConfig = {
      staticUrl: 'https://una-call-js.polydom.ai/latest',
      callRecording: true,
      agentId: agentId,
      stage: true,
      contextData: {
        email: 'example@polydom.ai',
      },
      enableScreenLock: false,
      enableCallSound: true,
      language: 'en',
    };

    // Create and load script
    const script = document.createElement('script');
    script.type = 'module';
    script.async = true;
    script.src = window.chatWidgetConfig.staticUrl + '/js/init_script.js?' + new Date().getTime();

    script.onerror = () => {
      console.error('Failed to load init_script.js');
      setErrorMsg('Failed to load call functionalities. Please try again later.');
      setIsEnabled(false);
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Setup event listeners
  useEffect(() => {
    const handlePolyStatus = (event: CustomEvent) => {
      const { status, message } = event.detail;
      if (status === 'success') {
        setIsEnabled(true);
        setErrorMsg('');
      } else {
        setIsEnabled(false);
        setErrorMsg(message || 'Failed to initialize call system');
      }
    };

    const handleStartCall = () => {
      setIsCallActive(true);
    };

    const handleEndCall = () => {
      setIsCallActive(false);
    };

    const handleCallError = (event: CustomEvent) => {
      const message = event.detail.error || event.detail.message;
      setErrorMsg(message);
      setIsCallActive(false);
    };

    window.addEventListener('polyStatus', handlePolyStatus as EventListener);
    window.addEventListener('polyStartCall', handleStartCall);
    window.addEventListener('polyEndCall', handleEndCall);
    window.addEventListener('polyCallError', handleCallError as EventListener);

    return () => {
      window.removeEventListener('polyStatus', handlePolyStatus as EventListener);
      window.removeEventListener('polyStartCall', handleStartCall);
      window.removeEventListener('polyEndCall', handleEndCall);
      window.removeEventListener('polyCallError', handleCallError as EventListener);
    };
  }, []);

  const handleCall = () => {
    if (!isEnabled || !window.polyCallAPI) return;

    if (isCallActive) {
      window.polyCallAPI.endCall();
    } else {
      window.polyCallAPI.makeCall();
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex items-center justify-center gap-2 mb-2">
        <div className="w-6 h-6 flex-shrink-0">
          <MapPin className="w-full h-full text-green-500" />
        </div>
        <div className="text-base md:text-lg text-gray-600 truncate">
          {businessName} • {getLocation()}
        </div>
      </div>
      
      <h1 className="max-w-3xl text-4xl font-bold leading-tight lg:text-5xl mb-8">
        <span className="text-gray-900">Your AI Front Desk Employee</span>
        <br />
        <span className="block text-green-500">Is Ready</span>
      </h1>

      <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg px-8 pb-8">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Call Now to Start Conversation
        </h2>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center justify-center gap-3">
              <button 
                onClick={handleCall}
                disabled={!isEnabled}
                className={`relative flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300
                  ${!isEnabled 
                    ? 'bg-gray-400 cursor-not-allowed opacity-60' 
                    : isCallActive
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-green-500 hover:bg-green-600'
                  } text-white`}
              >
                <Phone className="w-5 h-5" />
                <span>{isCallActive ? 'End Call' : 'Call'}</span>
                {isEnabled && !isCallActive && (
                  <div className="absolute -inset-1 bg-green-500/20 rounded-lg animate-pulse" />
                )}
              </button>
            </div>
            
            {errorMsg && (
              <div className="text-red-600 font-medium text-center">
                {errorMsg}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}