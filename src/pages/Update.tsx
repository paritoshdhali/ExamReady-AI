import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Share2, CheckCircle2, Loader2, Check } from 'lucide-react';
import { AdUnit } from '../components/AdUnit';

export const Prime: React.FC = () => {
  const navigate = useNavigate();
  const [price, setPrice] = useState('15');
  const [user, setUser] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const savedPayment = localStorage.getItem('site_payment_config');
    if (savedPayment) { const config = JSON.parse(savedPayment); setPrice(config.price || '15'); }
    const userStr = localStorage.getItem('current_user');
    if (userStr) { setUser(JSON.parse(userStr)); }
  }, []);

  const handleSimulatePayment = () => {
    if (!user) { navigate('/auth'); return; }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      const users = JSON.parse(localStorage.getItem('site_users') || '[]');
      const updatedUsers = users.map((u: any) => {
        if (u.email === user.email) { return { ...u, proExpiry: Date.now() + (6 * 60 * 60 * 1000) }; }
        return u;
      });
      localStorage.setItem('site_users', JSON.stringify(updatedUsers));
      setTimeout(() => { navigate('/'); }, 2000);
    }, 2500);
  };

  if (isSuccess) return <div className="pt-24 text-center"><h2>Payment Successful!</h2><p>Unlocked for 6 hours.</p></div>;
  if (isProcessing) return <div className="pt-24 text-center"><Loader2 className="animate-spin h-12 w-12 mx-auto" /><p>Redirecting...</p></div>;

  return (
    <div className="pt-24 max-w-7xl mx-auto px-4">
      <h1 className="text-4xl font-bold text-center mb-12">Prime Access</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div onClick={handleSimulatePayment} className="bg-white p-8 rounded-2xl border-2 border-amber-200 cursor-pointer text-center">
            <Crown className="h-12 w-12 text-amber-500 mx-auto mb-6" />
            <span className="text-5xl font-extrabold">₹{price}</span>
            <p className="mt-4 font-bold text-amber-600">6 Hours Unlimited</p>
        </div>
        <div className="bg-white p-8 rounded-2xl border-2 border-emerald-200 text-center">
            <Share2 className="h-12 w-12 text-emerald-600 mx-auto mb-6" />
            <span className="text-2xl font-bold">Share & Earn</span>
            <p className="mt-4 font-bold text-emerald-600">24 Hours Unlimited</p>
        </div>
      </div>
    </div>
  );
};