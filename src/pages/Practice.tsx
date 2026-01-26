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
  const [subject, setSubject] = useState('');
  const [isChatActive, setIsChatActive] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isChatActive]);

  const isProUser = () => {
    try {
      const userStr = localStorage.getItem('current_user');
      if (!userStr) return false;
      const user = JSON.parse(userStr);
      const users = JSON.parse(localStorage.getItem('site_users') || '[]');
      const currentUserData = users.find((u: any) => u.email === user.email);
      return currentUserData && currentUserData.proExpiry && currentUserData.proExpiry > Date.now();
    } catch (e) { return false; }
  };

  const handleStartChat = () => {
    if (!subject.trim()) { alert("Please enter a Subject Name to start."); return; }
    if (!isProUser()) { navigate('/prime'); return; }
    setIsChatActive(true);
    setMessages([{ role: 'model', text: `Hello! I am your personal AI Tutor for **${subject}**. What would you like to discuss?` }]);
  };

  const handleEndChat = () => {
    if (confirm("End this tutoring session?")) { setIsChatActive(false); setMessages([]); }
  };

  const callAIProvider = async (userText: string, currentHistory: {role: string, text: string}[]) => {
    const apiConfig = JSON.parse(localStorage.getItem('site_api_config') || '{}');
    const apiKey = apiConfig.apiKey || process.env.API_KEY;
    const systemPrompt = `You are an expert tutor in "${subject}". Use Markdown.`;
    const ai = new GoogleGenAI({ apiKey: apiKey });
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: { systemInstruction: systemPrompt },
      history: currentHistory.map(m => ({ role: m.role, parts: [{ text: m.text }] }))
    });
    const result = await chat.sendMessage({ message: userText });
    return result.text;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
    const userText = inputMessage.trim();
    setMessages([...messages, { role: 'user', text: userText }]);
    setInputMessage('');
    setIsLoading(true);
    try {
      const responseText = await callAIProvider(userText, messages);
setMessages(prev => [...prev, { role: 'model', text: responseText || "" }]);
    } catch (error) { console.error(error); }
    finally { setIsLoading(true); }
  };

  if (isChatActive) {
    return (
      <div className="pt-20 pb-12 max-w-5xl mx-auto px-4 h-screen flex flex-col">
        <div className="flex items-center justify-between mb-4 bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center gap-3"><Bot className="h-6 w-6 text-primary-600" /><h2 className="text-lg font-bold">AI Tutor: {subject}</h2></div>
          <Button variant="outline" onClick={handleEndChat}>End Session</Button>
        </div>
        <div className="flex-grow bg-slate-50 border border-slate-200 rounded-2xl overflow-y-auto p-4 space-y-4">
           {messages.map((msg, idx) => (
             <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-4 ${msg.role === 'user' ? 'bg-primary-600 text-white' : 'bg-white text-slate-700 shadow-sm'}`}>{msg.text}</div>
             </div>
           ))}
           <div ref={messagesEndRef} />
        </div>
        <div className="p-4 bg-white border-t flex gap-2">
           <input value={inputMessage} onChange={e => setInputMessage(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSendMessage()} className="flex-grow border rounded-xl px-4" />
           <Button onClick={handleSendMessage} disabled={isLoading || !inputMessage.trim()}>Send</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-12 max-w-7xl mx-auto px-4">
      <AdUnit placement="top" className="mb-8" />
      <div className="bg-white rounded-2xl p-8 border border-slate-200">
        <h1 className="text-3xl font-bold mb-8">Practice Area</h1>
        <div className="bg-indigo-50 p-8 rounded-2xl">
           <h3 className="text-xl font-bold mb-4">AI Personal Tutor</h3>
           <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject Name..." className="w-full px-4 py-3 border rounded-xl mb-4" />
           <Button onClick={handleStartChat}>Start AI Chat</Button>
        </div>
      </div>
    </div>
  );
};