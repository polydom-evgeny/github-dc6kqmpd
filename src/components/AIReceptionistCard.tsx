import React from 'react';
import { Bot, Clock, Phone, MapPin } from 'lucide-react';

interface AIReceptionistCardProps {
  phoneNumber: string;
  businessName: string;
  businessAddress: string;
  state: string;
  country: string;
}

export function AIReceptionistCard({ phoneNumber, businessName, state, country }: AIReceptionistCardProps) {
  const getLocation = () => {
    return `${state}, ${country === 'United States' ? 'USA' : country}`;
  };

  const handleCall = () => {
    window.location.href = `tel:${phoneNumber}`;
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
        <h2 className="text-2xl font-bold text-center" style={{ color: 'rgb(35, 35, 35)' }}>
          Call Now to Start Conversation
        </h2>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center gap-3">
            <button 
              onClick={handleCall}
              className="relative group cursor-pointer bg-transparent border-0 p-0"
            >
              <Phone className="w-5 h-5 text-green-600 group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute -inset-2 bg-green-500/10 rounded-full animate-pulse"></div>
            </button>
            <span className="text-xl font-semibold text-gray-900">
              {phoneNumber}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}