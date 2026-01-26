import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Share2, Banknote, Check, Lock, Loader2 } from 'lucide-react';
import { Button } from '../components/Button';
import { AdUnit } from '../components/AdUnit';

export const Upgrade: React.FC = () => {
  const navigate = useNavigate();
  const [price, setPrice] = useState('15');
  const [user, setUser] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('site_payment_config');
    if (saved) { setPrice(JSON.parse(saved).price || '15'); }
    const userStr = localStorage.getItem('current_user');
    if (userStr) setUser(JSON.parse(userStr));
  }, []);

  const handleSimulatePayment = () => {
    if (!user) { navigate('/auth'); return; }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false); setIsSuccess(true);
      const users = JSON.parse(localStorage.getItem('site_users') || '[]');
      const updated = users.map((u: any) => u.email === user.email ? { ...u, proExpiry: Date.now() + (6 * 60 * 60 * 1000) } : u);
      localStorage.setItem('site_users', JSON.stringify(updated));
      setTimeout(() => navigate('/'), 2000);
    }, 2500);
  };

  if (isSuccess) return <div className="pt-24 text-center"><h2>Success!</h2><p>Unlocked for 6 hours.</p></div>;
  if (isProcessing) return <div className="pt-24 text-center"><Loader2 className="animate-spin h-12 w-12 mx-auto" /></div>;

  return (
    <div className="pt-24 max-w-7xl mx-auto px-4">
      <div className="text-center mb-12">
        <div className="p-3 bg-red-100 rounded-full inline-block mb-6"><Lock className="text-red-600 h-8 w-8" /></div>
        <h1 className="text-4xl font-bold">Daily Limit Reached</h1>
        <p>Unlocked 6 hours of unlimited access for ₹{price}.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
         <div className="bg-white p-8 rounded-2xl border-2 border-indigo-100 flex flex-col">
            <h3 className="text-2xl font-bold mb-4">Pay & Unlock</h3>
            <span className="text-4xl font-extrabold mb-8">₹{price} <span className="text-lg font-normal text-slate-400">/ 6 hours</span></span>
            <Button onClick={handleSimulatePayment} fullWidth>Pay ₹{price} for 6h Access</Button>
         </div>
         <div className="bg-white p-8 rounded-2xl border border-slate-200">
            <h3 className="text-2xl font-bold mb-4">Share & Unlock</h3>
            <Button variant="outline" fullWidth>Share to Unlock</Button>
         </div>
      </div>
    </div>
  );
};