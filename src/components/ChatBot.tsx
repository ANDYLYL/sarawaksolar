import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, MessageCircle } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Message {
  role: 'user' | 'bot';
  text: string;
}

export default function ChatBot() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([
    { role: 'bot', text: 'Hello! I am your Sarawak Solar assistant. How can I help you with the 2026 NEM subsidy today?' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userMsg = userInput;
    setUserInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ parts: [{ text: userMsg }] }],
        config: {
          systemInstruction: `You are a helpful solar energy consultant for SarawakSolar.com. You are helping a customer in Sarawak, Malaysia. 
          Context:
          - 2026 Sarawak Energy NEM Subsidy is active.
          - Subsidies: RM8k (2-3.5kW), RM10k (3.5-6kW), RM12k (6-50kW).
          - Benefits: 1:1 energy offset, 15-year SEB contract.
          - Requirements: SEB Registered Contractor, SET-P compliance.
          Answer the following question briefly and professionally. If you don't know the answer, suggest they contact us via WhatsApp at +60102841069.`
        },
      });

      setChatMessages(prev => [...prev, { role: 'bot', text: response.text || "I'm sorry, I couldn't generate a response." }]);
    } catch (error) {
      console.error("Chat error:", error);
      setChatMessages(prev => [...prev, { role: 'bot', text: "I'm sorry, I'm having trouble connecting. Please try again or contact us via WhatsApp!" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end">
      {isChatOpen && (
        <div className="bg-white w-[350px] h-[500px] rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden mb-4 animate-in slide-in-from-bottom-4 duration-300">
          {/* Chat Header */}
          <div className="bg-emerald-900 p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-800 flex items-center justify-center">
                <Bot className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <div className="text-white font-bold text-sm">Solar Assistant</div>
                <div className="text-emerald-300 text-xs flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  Online
                </div>
              </div>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="text-emerald-300 hover:text-white">
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  msg.role === 'user' 
                  ? 'bg-emerald-900 text-white rounded-tr-none' 
                  : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 rounded-tl-none flex gap-1">
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-100 flex gap-2">
            <input 
              type="text" 
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ask about subsidies..."
              className="flex-grow px-4 py-2 rounded-full bg-slate-100 border-none focus:ring-2 focus:ring-emerald-500 text-sm outline-none"
            />
            <button type="submit" className="bg-emerald-900 text-white p-2 rounded-full hover:bg-emerald-800 transition-colors">
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      )}

      <div className="flex gap-4">
        {/* WhatsApp Button */}
        <a 
          href="https://wa.me/60102841069" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center group"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="h-8 w-8" />
        </a>

        {/* Chat Toggle Button */}
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="bg-emerald-900 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center relative"
          aria-label="Open Chat"
        >
          {isChatOpen ? <X className="h-8 w-8" /> : <Bot className="h-8 w-8" />}
          {!isChatOpen && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-yellow-500 border-2 border-white"></span>
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
