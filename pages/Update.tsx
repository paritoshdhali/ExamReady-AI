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
    // Load Price
    const savedPayment = localStorage.getItem('site_payment_config');
    if (savedPayment) {
      const config = JSON.parse(savedPayment);
      if (config.price) setPrice(config.price);
    }

    // Load User
    const userStr = localStorage.getItem('current_user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  const handleSimulatePayment = () => {
    if (!user) {
      alert("Please login to upgrade.");
      navigate('/auth');
      return;
    }

    setIsProcessing(true);

    // Simulate Gateway Redirection Delay
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      // Automatic Activation Logic
      const users = JSON.parse(localStorage.getItem('site_users') || '[]');
      const updatedUsers = users.map((u: any) => {
        if (u.email === user.email) {
          // Changed to 6 Hours as per request
          return { ...u, proExpiry: Date.now() + (6 * 60 * 60 * 1000) }; 
        }
        return u;
      });
      localStorage.setItem('site_users', JSON.stringify(updatedUsers));
      
      // Redirect after success
      setTimeout(() => {
        setIsSuccess(false);
        navigate('/');
      }, 2000); 
      
    }, 2500); 
  };

  const handleShare = async () => {
    if (!user || !user.email) {
       alert("Please login to share.");
       navigate('/auth');
       return;
    }

    // Generate Custom Link: mydomain.com/[first-5-letters]/share
    const shortId = user.email.substring(0, 5);
    const shareUrl = `${window.location.origin}/#/${shortId}/share`;
    const shareText = `Practice MCQs for free on ExamReady! Use my link to unlock unlimited access: ${shareUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Unlock Unlimited ExamReady',
          text: shareText,
          url: shareUrl
        });
      } catch (err) {
        console.error('Share failed', err);
      }
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Link copied to clipboard: ' + shareUrl);
    }
  };

  if (isSuccess) {
    return (
      <div className="pt-24 pb-12 min-h-screen flex items-center justify-center px-4 bg-slate-50">
        <div className="text-center animate-in zoom-in-50 fade-in duration-300">
           <div className="bg-green-100 p-6 rounded-full mb-6 mx-auto w-24 h-24 flex items-center justify-center">
              <Check className="h-12 w-12 text-green-600" />
           </div>
           <h2 className="text-3xl font-bold text-slate-900 mb-2">Payment Successful!</h2>
           <p className="text-slate-600 text-lg mb-8">
              Your Unlimited Access has been unlocked for 6 hours.
           </p>
        </div>
      </div>
    );
  }

  if (isProcessing) {
     return (
      <div className="pt-24 pb-12 min-h-screen flex items-center justify-center px-4 bg-slate-50">
        <div className="text-center animate-in fade-in">
           <Loader2 className="h-16 w-16 text-indigo-600 animate-spin mb-6 mx-auto" />
           <h2 className="text-2xl font-bold text-slate-900 mb-2">Redirecting to Secure Gateway...</h2>
           <p className="text-slate-600">Please do not close this window.</p>
        </div>
      </div>
     );
  }

  return (
    <div className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* TOP AD SLOT */}
      <AdUnit placement="top" className="mb-8" />

      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">Prime Access</h1>
        <p className="text-lg text-slate-600">Unlock your potential with unrestricted learning.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
        
        {/* CARD 1: PAYMENT */}
        <div 
            onClick={handleSimulatePayment}
            className="group relative bg-white p-8 rounded-2xl border-2 border-amber-200 hover:border-amber-400 transition-all shadow-lg hover:shadow-amber-100 cursor-pointer flex flex-col items-center justify-center min-h-[300px]"
        >
            <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg shadow-sm">
                PREMIUM
            </div>
            
            <div className="bg-amber-50 p-6 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                <Crown className="h-12 w-12 text-amber-500" />
            </div>
            
            <div className="text-center mb-6">
                <span className="text-5xl font-extrabold text-slate-900 tracking-tight">₹{price}</span>
            </div>
            
            <div className="mt-auto pt-4 border-t border-amber-50 w-full text-center">
                <p className="text-sm font-bold text-amber-600 uppercase tracking-widest">6 Hours Unlimited</p>
            </div>
        </div>

        {/* CARD 2: SHARE */}
        <div 
            onClick={handleShare}
            className="group relative bg-white p-8 rounded-2xl border-2 border-emerald-200 hover:border-emerald-400 transition-all shadow-lg hover:shadow-emerald-100 cursor-pointer flex flex-col items-center justify-center min-h-[300px]"
        >
            <div className="absolute top-0 right-0 bg-gradient-to-r from-emerald-400 to-teal-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg shadow-sm">
                FREE UNLOCK
            </div>

            <div className="relative mb-6 group-hover:scale-110 transition-transform duration-300">
                 <div className="bg-emerald-50 p-6 rounded-full">
                    <Share2 className="h-12 w-12 text-emerald-600" />
                 </div>
                 <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                    <CheckCircle2 className="h-6 w-6 text-green-500 fill-green-50" />
                 </div>
            </div>
            
            <div className="text-center mb-6">
                <span className="text-2xl font-bold text-slate-900">Share & Earn</span>
            </div>
            
            <div className="mt-auto pt-4 border-t border-emerald-50 w-full text-center">
                <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest">24 Hours Unlimited</p>
            </div>
        </div>

      </div>
      
      {/* BOTTOM AD SLOT */}
      <AdUnit placement="bottom" className="mt-12" />
    </div>
  );
};