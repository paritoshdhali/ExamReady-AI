import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Target, Sparkles, MessageSquare, 
  Send, Bot, ArrowLeft, Lock, Loader2 
} from 'lucide-react';
import { Button } from '../components/Button';
import { AdUnit } from '../components/AdUnit';
import { GoogleGenAI } from "@google/genai";

export const Practice: React.FC = () => {
  const navigate = useNavigate();
  
  // --- AI Chat State ---
  const [subject, setSubject] = useState('');
  const [isChatActive, setIsChatActive] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isChatActive]);

  // Helper to check Pro Status (Local Logic)
  const isProUser = () => {
    try {
      const userStr = localStorage.getItem('current_user');
      if (!userStr) return false;
      
      const user = JSON.parse(userStr);
      const users = JSON.parse(localStorage.getItem('site_users') || '[]');
      const currentUserData = users.find((u: any) => u.email === user.email);
      
      return currentUserData && currentUserData.proExpiry && currentUserData.proExpiry > Date.now();
    } catch (e) {
      return false;
    }
  };

  const handleStartChat = () => {
    if (!subject.trim()) {
      alert("Please enter a Subject Name to start.");
      return;
    }

    if (!isProUser()) {
      // Prime Lock: Redirect to Prime page immediately
      navigate('/prime');
      return;
    }

    setIsChatActive(true);
    setMessages([{
      role: 'model', 
      text: `Hello! I am your personal AI Tutor for **${subject}**. \n\nI can help you understand concepts, solve problems, or create study plans. What would you like to discuss?`
    }]);
  };

  const handleEndChat = () => {
    if (confirm("End this tutoring session? Chat history will be cleared.")) {
      setIsChatActive(false);
      setMessages([]);
      setInputMessage('');
    }
  };

  // --- DYNAMIC API CALLER ---
  const callAIProvider = async (userText: string, currentHistory: {role: string, text: string}[]) => {
    const apiConfig = JSON.parse(localStorage.getItem('site_api_config') || '{}');
    const provider = apiConfig.provider || 'Gemini AI';
    const apiKey = apiConfig.apiKey || process.env.API_KEY;
    const baseUrl = apiConfig.baseUrl || '';

    const systemPrompt = `You are an expert, patient, and clear AI Tutor specializing in "${subject}". 
          Your goal is to help the student learn. 
          - Explain complex concepts simply.
          - Provide examples.
          - If the user asks a question, answer it accurately.
          - Keep responses concise but informative.
          - Use Markdown for formatting (bold, lists, code blocks).`;

    // Provider: Gemini AI (Default SDK)
    if (provider === 'Gemini AI') {
       const ai = new GoogleGenAI({ apiKey: apiKey });
       const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: { systemInstruction: systemPrompt },
        history: currentHistory.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }))
      });
      const result = await chat.sendMessage({ message: userText });
      return result.text;
    }

    // Provider: Anthropic (Claude)
    if (provider === 'Anthropic (Claude)') {
       const anthropicMessages = currentHistory.map(m => ({
          role: m.role === 'model' ? 'assistant' : 'user',
          content: m.text
       }));
       anthropicMessages.push({ role: 'user', content: userText });

       const response = await fetch('https://api.anthropic.com/v1/messages', {
         method: 'POST',
         headers: {
           'x-api-key': apiKey,
           'anthropic-version': '2023-06-01',
           'content-type': 'application/json'
         },
         body: JSON.stringify({
           model: 'claude-3-haiku-20240307',
           max_tokens: 1000,
           system: systemPrompt,
           messages: anthropicMessages
         })
       });
       const data = await response.json();
       return data.content[0].text;
    }

    // Provider: OpenAI / OpenRouter / Groq (Compatible APIs)
    let url = 'https://api.openai.com/v1/chat/completions';
    let model = 'gpt-4o-mini';

    if (provider === 'OpenRouter') {
       url = baseUrl || 'https://openrouter.ai/api/v1/chat/completions';
       model = 'openai/gpt-3.5-turbo';
    } else if (provider === 'Groq') {
       url = 'https://api.groq.com/openai/v1/chat/completions';
       model = 'llama3-8b-8192';
    }

    const openAIMessages = [
       { role: 'system', content: systemPrompt },
       ...currentHistory.map(m => ({ role: m.role === 'model' ? 'assistant' : 'user', content: m.text })),
       { role: 'user', content: userText }
    ];

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        messages: openAIMessages
      })
    });
    
    const data = await response.json();
    return data.choices[0].message.content;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userText = inputMessage.trim();
    // Optimistic update
    const newMessages = [...messages, { role: 'user', text: userText }];
    // @ts-ignore
    setMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      const responseText = await callAIProvider(userText, messages);
      // @ts-ignore
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);

    } catch (error) {
      console.error("Chat Error:", error);
      // @ts-ignore
      setMessages(prev => [...prev, { role: 'model', text: "I'm having trouble connecting right now. Please check your connection or API settings." }]);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Main Render ---

  // 1. Chat Interface View (When Active)
  if (isChatActive) {
    return (
      <div className="pt-20 pb-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-screen flex flex-col">
        <div className="flex items-center justify-between mb-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
             <div className="bg-primary-100 p-2 rounded-lg">
                <Bot className="h-6 w-6 text-primary-600" />
             </div>
             <div>
               <h2 className="text-lg font-bold text-slate-900 leading-tight">AI Tutor: {subject}</h2>
               <p className="text-xs text-slate-500">Powered by AI</p>
             </div>
          </div>
          <Button variant="outline" onClick={handleEndChat} className="text-sm">
             <ArrowLeft className="h-4 w-4 mr-2" /> End Session
          </Button>
        </div>

        <div className="flex-grow bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden flex flex-col shadow-inner">
           <div className="flex-grow overflow-y-auto p-4 md:p-6 space-y-4">
              {messages.map((msg, idx) => (
                <React.Fragment key={idx}>
                  <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 ${
                      msg.role === 'user' 
                        ? 'bg-primary-600 text-white rounded-tr-none' 
                        : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'
                    }`}>
                       <div className="text-sm leading-relaxed whitespace-pre-wrap font-sans">
                          {msg.text}
                       </div>
                    </div>
                  </div>
                  {/* Inject Ad after model response */}
                  {msg.role === 'model' && (
                     <div className="w-full flex justify-start pl-0 md:pl-0">
                        <AdUnit placement="chat" className="max-w-[85%] md:max-w-[75%]" />
                     </div>
                  )}
                </React.Fragment>
              ))}
              {isLoading && (
                 <div className="flex justify-start">
                   <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                      <Loader2 className="h-4 w-4 text-primary-600 animate-spin" />
                      <span className="text-xs text-slate-400">Thinking...</span>
                   </div>
                 </div>
              )}
              <div ref={messagesEndRef} />
           </div>

           <div className="p-4 bg-white border-t border-slate-200">
              <div className="flex gap-2">
                 <input 
                   type="text" 
                   value={inputMessage}
                   onChange={(e) => setInputMessage(e.target.value)}
                   onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                   placeholder="Ask a question..."
                   className="flex-grow px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                   disabled={isLoading}
                 />
                 <button 
                   onClick={handleSendMessage}
                   disabled={isLoading || !inputMessage.trim()}
                   className="bg-primary-600 text-white p-3 rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                 >
                   <Send className="h-5 w-5" />
                 </button>
              </div>
           </div>
        </div>
      </div>
    );
  }

  // 2. Default Practice Area View
  return (
    <div className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* TOP AD SLOT */}
      <AdUnit placement="top" className="mb-8" />
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12 mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-primary-100 p-3 rounded-xl">
            <Target className="h-8 w-8 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Practice Area</h1>
        </div>
        
        <p className="text-lg text-slate-600 mb-8 max-w-2xl">
          Get personalized tutoring on any subject. Enter your topic below to start a session with our AI.
        </p>

        {/* --- AI TUTOR SECTION --- */}
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-6 md:p-8 mb-8 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles className="h-32 w-32 text-indigo-600" />
           </div>
           
           <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                 <div className="bg-white p-2 rounded-lg shadow-sm">
                    <MessageSquare className="h-5 w-5 text-indigo-600" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900">AI Personal Tutor</h3>
                 <span className="ml-2 bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                    <Lock className="h-3 w-3" /> PRIME
                 </span>
              </div>
              
              <p className="text-slate-600 mb-6 max-w-xl">
                 Need help with a specific topic? Enter a subject below and start a live chat session with our advanced AI tutor.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 max-w-xl">
                 <input 
                   type="text" 
                   value={subject}
                   onChange={(e) => setSubject(e.target.value)}
                   placeholder="Enter Subject Name (e.g. Thermodynamics)"
                   className="flex-grow px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white shadow-sm"
                 />
                 <button 
                   onClick={handleStartChat}
                   className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 shadow-md flex items-center justify-center gap-2 transition-all whitespace-nowrap"
                 >
                   <Sparkles className="h-4 w-4" /> Start AI Chat
                 </button>
              </div>
           </div>
        </div>

        {/* MIDDLE AD SLOT */}
        <AdUnit placement="sidebar" className="mb-0" />
      </div>
      
      {/* BOTTOM AD SLOT */}
      <AdUnit placement="bottom" className="mt-8" />
    </div>
  );
};