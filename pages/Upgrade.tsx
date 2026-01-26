import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, Share2, Banknote, ExternalLink, Check, AlertTriangle, 
  Lock, Loader2, Copy 
} from 'lucide-react';
import { Button } from '../components/Button';
import { AdUnit } from '../components/AdUnit';

export const Upgrade: React.FC = () => {
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
          // Changed to 6 Hours
          return { ...u, proExpiry: Date.now() + (6 * 60 * 60 * 1000) }; 
        }
        return u;
      });
      localStorage.setItem('site_users', JSON.stringify(updatedUsers));
      
      // Redirect after success
      setTimeout(() => {
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
           <p className="text-sm text-slate-400">Redirecting to practice...</p>
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
    <div className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen bg-slate-50">
      
      {/* TOP AD SLOT */}
      <AdUnit placement="top" className="mb-8" />

      <div className="max-w-4xl mx-auto text-center mb-12">
        <div className="inline-flex items-center justify-center p-3 bg-red-100 rounded-full mb-6">
           <Lock className="h-8 w-8 text-red-600" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Daily Limit Reached</h1>
        <p className="text-lg text-slate-600">
           You've used your 2 free sessions for today. Choose an option below to continue practicing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
        
        {/* OPTION 1: PAY */}
        <div className="bg-white p-8 rounded-2xl border-2 border-indigo-100 shadow-xl relative overflow-hidden flex flex-col">
           <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
             INSTANT ACCESS
           </div>
           <div className="mb-6">
             <h3 className="text-2xl font-bold text-slate-900 mb-2">Pay & Unlock</h3>
             <p className="text-slate-500">Get 6 hours of unlimited unrestricted access.</p>
           </div>
           
           <div className="my-6">
             <span className="text-4xl font-extrabold text-slate-900">₹{price}</span>
             <span className="text-slate-400 font-medium"> / 6 hours</span>
           </div>

           <Button 
             fullWidth 
             onClick={handleSimulatePayment}
             className="py-4 text-lg font-bold shadow-indigo-200 shadow-lg mb-6 flex items-center justify-center gap-2"
           >
             <Banknote className="h-5 w-5" /> Pay ₹{price} for 6h Unlimited Access
           </Button>

           <div className="mt-auto bg-slate-50 p-4 rounded-xl border border-slate-100 text-left">
              <p className="text-xs text-slate-500 leading-relaxed">
                 <strong className="text-slate-700">Refund Policy:</strong> This ₹{price} fee is charged to cover AI maintenance costs. By paying, you agree to our terms. We show ads and charge this small fee for our service. If you find our service useful, please proceed; otherwise, do not pay. We reserve the right to increase the price in the future. Once paid, the amount is strictly non-refundable. Please review everything before making a payment.
              </p>
           </div>
        </div>

        {/* OPTION 2: SHARE */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
           <div className="mb-6">
             <h3 className="text-2xl font-bold text-slate-900 mb-2">Share to Unlock</h3>
             <p className="text-slate-500">Invite friends and earn free unlimited access.</p>
           </div>

           <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100 mb-8 flex-grow">
              <div className="flex items-start gap-3 mb-4">
                 <Shield className="h-6 w-6 text-emerald-600 mt-1" />
                 <div>
                    <h4 className="font-bold text-emerald-900">How it works:</h4>
                    <p className="text-sm text-emerald-800 mt-1">
                      1. Share your unique link below.<br/>
                      2. If a new user uses the app for 2 consecutive days via your link.<br/>
                      3. You automatically get <span className="font-bold">24H Unlimited Access</span>.
                    </p>
                 </div>
              </div>
           </div>

           <Button 
             variant="outline"
             fullWidth 
             onClick={handleShare}
             className="py-4 text-lg font-bold border-2 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 flex items-center justify-center gap-2"
           >
             <Share2 className="h-5 w-5" /> Share to Unlock
           </Button>
        </div>

      </div>

      {/* BOTTOM AD SLOT */}
      <AdUnit placement="bottom" className="mt-12" />
    </div>
  );
};