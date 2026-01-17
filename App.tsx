
import React, { useState, useEffect, useRef } from 'react';
import { Message, UserLocation } from './types';
import { getGeminiResponse } from './services/gemini';
import { ChatMessage } from './components/ChatMessage';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initial greeting
  useEffect(() => {
    setMessages([
      {
        id: '1',
        role: 'model',
        content: "Hello! I'm GeoGuide AI, your expert in maps, geography, and locations. How can I help you navigate the world today?",
        timestamp: new Date(),
      },
    ]);

    // Attempt to get user location
    if (navigator.geolocation) {
      setIsLocationLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setIsLocationLoading(false);
        },
        (error) => {
          console.warn("Location access denied or unavailable", error);
          setIsLocationLoading(false);
        }
      );
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Map history for Gemini using correct roles (user/model)
      const history = messages.slice(-10).map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));

      const response = await getGeminiResponse(userMsg.content, location, history);

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: response.text,
        groundingChunks: response.groundingChunks,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: "I'm sorry, I encountered an error while retrieving that information. Please check your connection and try again.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#f8fafc]">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500 p-2 rounded-lg text-white shadow-lg shadow-emerald-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 brand-font">GeoGuide AI</h1>
            <div className="flex items-center gap-2">
              <span className="flex w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Map Expert System</p>
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-4">
          {location ? (
            <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
              <span className="text-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </span>
              <span className="text-xs font-semibold text-blue-700">Live Location Enabled</span>
            </div>
          ) : isLocationLoading ? (
            <div className="text-xs text-slate-400 font-medium">Determining location...</div>
          ) : (
            <button 
              onClick={() => {
                navigator.geolocation.getCurrentPosition(
                  (p) => setLocation({ latitude: p.coords.latitude, longitude: p.coords.longitude }),
                  () => alert("Please enable location services in your browser settings.")
                );
              }}
              className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
            >
              Enable Location
            </button>
          )}
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isLoading && (
            <div className="flex items-start gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-emerald-100">AI</div>
              <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="bg-white border-t border-slate-200 p-4 sticky bottom-0 z-10">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about a place, restaurant, or geographical fact..."
              disabled={isLoading}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-6 pr-16 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm shadow-inner disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-2 p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
          <div className="mt-2 flex items-center justify-between overflow-x-auto">
             <div className="flex gap-4 flex-nowrap whitespace-nowrap">
              <button 
                type="button" 
                onClick={() => setInput("What are some good Italian restaurants nearby?")}
                className="text-[10px] font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-tight"
              >
                Nearby Dining
              </button>
              <button 
                type="button" 
                onClick={() => setInput("Tell me about the geography of Japan.")}
                className="text-[10px] font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-tight"
              >
                World Geography
              </button>
              <button 
                type="button" 
                onClick={() => setInput("Show me a map of Central Park, NY.")}
                className="text-[10px] font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-tight"
              >
                Specific Places
              </button>
            </div>
            <p className="text-[10px] text-slate-400 text-right font-medium hidden sm:block">
              Powered by Gemini & Google Maps Grounding
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
