
import React from 'react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  const renderGrounding = () => {
    if (!message.groundingChunks || message.groundingChunks.length === 0) return null;

    const mapChunks = message.groundingChunks.filter(c => c.maps);
    const webChunks = message.groundingChunks.filter(c => c.web);

    return (
      <div className="mt-3 space-y-4 w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
        {mapChunks.length > 0 && (
          <div className="space-y-3">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 pl-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
              Verified Map Data
            </p>
            <div className="grid grid-cols-1 gap-3">
              {mapChunks.map((chunk, idx) => (
                <a
                  key={idx}
                  href={chunk.maps.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block p-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-emerald-400 transition-all duration-200 active:scale-[0.99]"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 p-2 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-[15px] text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {chunk.maps.title || "Explore on Google Maps"}
                        </span>
                        <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wide mt-0.5">
                          Open Location Details
                        </span>
                      </div>
                    </div>
                    <div className="p-1 text-slate-300 group-hover:text-emerald-500 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                  </div>
                  
                  {chunk.maps.placeAnswerSources?.reviewSnippets?.[0] && (
                    <div className="mt-3 py-2 px-3 bg-slate-50 rounded-xl border-l-4 border-emerald-400">
                      <p className="text-xs text-slate-600 italic leading-relaxed">
                        "{chunk.maps.placeAnswerSources.reviewSnippets[0]}"
                      </p>
                    </div>
                  )}
                </a>
              ))}
            </div>
          </div>
        )}

        {webChunks.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 pl-1">
              <span className="w-2 h-2 bg-indigo-400 rounded-full"></span>
              Research Sources
            </p>
            <div className="flex flex-wrap gap-2">
              {webChunks.map((chunk, idx) => (
                <a
                  key={idx}
                  href={chunk.web.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 rounded-full text-xs font-bold hover:bg-slate-50 transition-all border border-slate-200 shadow-sm hover:border-indigo-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                  </svg>
                  {chunk.web.title || "View Source"}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`flex w-full mb-10 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[94%] md:max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-3 md:gap-4 w-full`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center ${isUser ? 'bg-indigo-600 shadow-indigo-100' : 'bg-emerald-600 shadow-emerald-100'} text-white shadow-xl mt-1 border border-white/20`}>
          {isUser ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c.076 0 .152.002.228.006a6.002 6.002 0 014.128 3.018c.247.456.46 1.15.626 1.976H11V4.004A2.002 2.002 0 0110 4zm0 12c-.076 0-.152-.002-.228-.006a6.002 6.002 0 01-4.128-3.018 5.437 5.437 0 01-.626-1.976H9v4.996a2.002 2.002 0 011 0V16zm4.971-5H11v4.976a6.002 6.002 0 01-.837 4.118 6.004 6.004 0 005.154-4.118c-.166-.826-.379-1.52-.626-1.976zM4.083 11h1.946c.089 1.546.383 2.97.837 4.118A6.004 6.004 0 014.083 11z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        
        {/* Message Content Column */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} min-w-0 flex-1`}>
          {/* Main Bubble */}
          <div className={`px-5 py-4 rounded-[1.5rem] shadow-sm relative group ${
            isUser 
              ? 'bg-indigo-600 text-white rounded-tr-none' 
              : 'bg-white text-slate-900 rounded-tl-none border border-slate-200'
          }`}>
            <div className="whitespace-pre-wrap text-[15px] leading-relaxed font-medium break-words">
              {message.content || (isUser ? "" : "Searching for location data...")}
            </div>
            
            {/* Timestamp */}
            <span className={`absolute -bottom-6 ${isUser ? 'right-0' : 'left-0'} text-[9px] text-slate-400 uppercase tracking-[0.2em] font-black opacity-60 whitespace-nowrap`}>
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          {/* Grounding Content (Pulled out of bubble for full width alignment) */}
          {!isUser && renderGrounding()}
        </div>
      </div>
    </div>
  );
};
