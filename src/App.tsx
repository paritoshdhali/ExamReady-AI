import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Practice } from './pages/Practice';
import { Prime } from './pages/Update'; // Importing Prime component from Update file
import { Admin } from './pages/Admin';
import { PrivacyPolicy, Terms, About, Contact, RefundPolicy } from './pages/Static';
import { AdsTxt } from './pages/AdsTxt';
import { Upgrade } from './pages/Upgrade';
import { Leaderboard } from './pages/Leaderboard';
import { Button } from './components/Button';
import { CodeInjector } from './components/CodeInjector';

// Auth Page with Google Login Integration
const Auth: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check for configured Google Client ID
    const authConfig = JSON.parse(localStorage.getItem('site_auth_config') || '{}');
    const clientId = authConfig.clientId;

    if (clientId) {
      // Helper function to decode JWT
      const parseJwt = (token: string) => {
        try {
          return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
          return null;
        }
      };

      // Load Google GIS Script dynamically if not present
      const scriptId = 'google-client-script';
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.id = scriptId;
        document.body.appendChild(script);
        
        script.onload = () => {
          initializeGoogleLogin(clientId, parseJwt);
        }
      } else {
        // Script already loaded, just initialize
        // @ts-ignore
        if (window.google) initializeGoogleLogin(clientId, parseJwt);
      }
    }

    function initializeGoogleLogin(clientId: string, decode: (t: string) => any) {
      // @ts-ignore
      if (window.google && window.google.accounts) {
        // @ts-ignore
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response: any) => {
            const userObject = decode(response.credential);
            if (userObject) {
              console.log("Logged in:", userObject);
              localStorage.setItem('current_user', JSON.stringify(userObject));
              
              // Add to site_users for Admin Panel if not exists
              const existingUsers = JSON.parse(localStorage.getItem('site_users') || '[]');
              const userIndex = existingUsers.findIndex((u: any) => u.email === userObject.email);
              
              if (userIndex === -1) {
                const newUser = {
                  name: userObject.name,
                  email: userObject.email,
                  picture: userObject.picture,
                  proExpiry: Date.now() + (12 * 60 * 60 * 1000), // 12 Hours Free Trial for New Users
                  totalScore: 0,
                  state: '' 
                };
                localStorage.setItem('site_users', JSON.stringify([...existingUsers, newUser]));
              }

              navigate('/');
            }
          }
        });
        
        // @ts-ignore
        window.google.accounts.id.renderButton(
          document.getElementById("google-sign-in-button"),
          { theme: "outline", size: "large", width: "100%" } 
        );
      }
    }
  }, [navigate]);

  return (
    <div className="pt-24 pb-12 flex items-center justify-center min-h-[80vh] px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full border border-slate-200">
        <h2 className="text-2xl font-bold text-center text-slate-900 mb-6">Welcome Back</h2>
        
        {/* Google Login Container */}
        <div id="google-sign-in-button" className="w-full flex justify-center mb-6 h-[40px]"></div>

        <div className="relative mb-6">
           <div className="absolute inset-0 flex items-center">
             <div className="w-full border-t border-slate-200"></div>
           </div>
           <div className="relative flex justify-center text-sm">
             <span className="px-2 bg-white text-slate-500">Or continue with email</span>
           </div>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input type="email" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input type="password" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder="••••••••" />
          </div>
          <Button fullWidth className="mt-4">Sign In</Button>
        </form>
        <p className="text-center text-sm text-slate-500 mt-6">
          Don't have an account? <span className="text-primary-600 font-medium cursor-pointer">Sign up</span>
        </p>
      </div>
    </div>
  );
};

// Layout Component to wrap standard pages with Navbar/Footer
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen flex flex-col bg-white selection:bg-primary-100 selection:text-primary-900">
    <Navbar />
    <main className="flex-grow">
      {children}
    </main>
    <Footer />
  </div>
);

// Referral Landing Component
const ReferralHandler: React.FC = () => {
  const { referralId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (referralId) {
      // Store the short ID (first 5 chars) or email as the referrer
      localStorage.setItem('referred_by', referralId);
      console.log('Referral captured:', referralId);
    }
    navigate('/');
  }, [referralId, navigate]);

  return null;
};

const App: React.FC = () => {
  useEffect(() => {
    // 1. ALL-INDIA TOP 3 REWARD LOGIC (10:00 PM CHECK)
    const checkDailyReward = () => {
       const now = new Date();
       const hours = now.getHours();
       const minutes = now.getMinutes();
       
       // Check if it's 10:00 PM (22:00) or later, and reward hasn't been given today
       const todayDateStr = now.toDateString(); // e.g., "Tue Oct 10 2023"
       const lastRewardDate = localStorage.getItem('last_daily_reward_date');

       if (hours === 22 && minutes === 0 && lastRewardDate !== todayDateStr) {
          console.log("Running Daily Reward Logic...");
          
          try {
             const usersStr = localStorage.getItem('site_users');
             if (usersStr) {
                const users = JSON.parse(usersStr);
                if (Array.isArray(users)) {
                   // Sort all users by total score descending
                   const sortedUsers = [...users].sort((a: any) => (a.totalScore || 0)).reverse();
                   
                   // Top 3
                   const top3 = sortedUsers.slice(0, 3);
                   const top3Emails = top3.map((u: any) => u.email);

                   // Grant Prime (24 Hours for winners)
                   const updatedUsers = users.map((u: any) => {
                      if (top3Emails.includes(u.email)) {
                         const currentExpiry = u.proExpiry && u.proExpiry > Date.now() ? u.proExpiry : Date.now();
                         return { 
                           ...u, 
                           proExpiry: currentExpiry + (24 * 60 * 60 * 1000) // Add 24 hours
                         };
                      }
                      return u;
                   });
                   
                   localStorage.setItem('site_users', JSON.stringify(updatedUsers));
                   localStorage.setItem('last_daily_reward_date', todayDateStr);
                   console.log(`Daily Rewards given to: ${top3Emails.join(', ')}`);
                }
             }
          } catch (e) {
             console.error("Error running daily reward logic", e);
          }
       }
    };

    // Run check immediately and then every minute
    checkDailyReward();
    const intervalId = setInterval(checkDailyReward, 60000); 

    // 2. Consecutive Day Logic
    const today = new Date().toDateString();
    const lastVisit = localStorage.getItem('last_visit_date');
    let consecutiveDays = parseInt(localStorage.getItem('consecutive_days') || '1');
    const rewardGiven = localStorage.getItem('referral_reward_given');

    if (lastVisit !== today) {
      if (lastVisit) {
         const yesterday = new Date();
         yesterday.setDate(yesterday.getDate() - 1);
         if (lastVisit === yesterday.toDateString()) {
            consecutiveDays++;
         } else {
            consecutiveDays = 1;
         }
      }
      localStorage.setItem('consecutive_days', consecutiveDays.toString());
      localStorage.setItem('last_visit_date', today);

      // Check if referrer deserves reward
      if (consecutiveDays >= 2 && !rewardGiven) {
         const referrer = localStorage.getItem('referred_by');
         if (referrer) {
            // Give Reward to Referrer
            const users = JSON.parse(localStorage.getItem('site_users') || '[]');
            const updatedUsers = users.map((u: any) => {
               // Check if user email exactly matches or starts with the 5-char short ID
               if (u.email === referrer || (referrer.length === 5 && u.email.startsWith(referrer))) {
                  // Add 24 hours to existing expiry or now
                  const currentExpiry = u.proExpiry && u.proExpiry > Date.now() ? u.proExpiry : Date.now();
                  return { ...u, proExpiry: currentExpiry + (24 * 60 * 60 * 1000) };
               }
               return u;
            });
            localStorage.setItem('site_users', JSON.stringify(updatedUsers));
            localStorage.setItem('referral_reward_given', 'true');
            console.log(`Referral reward given to ${referrer}`);
         }
      }
    }
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Router>
      <CodeInjector />
      <Routes>
        {/* Standalone Route for ads.txt */}
        <Route path="/ads.txt" element={<AdsTxt />} />

        {/* Referral Route */}
        <Route path="/:referralId/share" element={<ReferralHandler />} />
        
        {/* Standard Pages */}
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/practice" element={<MainLayout><Practice /></MainLayout>} />
        <Route path="/prime" element={<MainLayout><Prime /></MainLayout>} />
        <Route path="/upgrade" element={<MainLayout><Upgrade /></MainLayout>} />
        <Route path="/leaderboard" element={<MainLayout><Leaderboard /></MainLayout>} />
        <Route path="/auth" element={<MainLayout><Auth /></MainLayout>} />
        <Route path="/admin" element={<MainLayout><Admin /></MainLayout>} />
        <Route path="/privacy" element={<MainLayout><PrivacyPolicy /></MainLayout>} />
        <Route path="/terms" element={<MainLayout><Terms /></MainLayout>} />
        <Route path="/about" element={<MainLayout><About /></MainLayout>} />
        <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
        <Route path="/refund-policy" element={<MainLayout><RefundPolicy /></MainLayout>} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;