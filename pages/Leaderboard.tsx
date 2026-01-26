import React, { useState, useEffect } from 'react';
import { Trophy, MapPin, Medal, User } from 'lucide-react';
import { AdUnit } from '../components/AdUnit';

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra & Nagar Haveli and Daman & Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

export const Leaderboard: React.FC = () => {
  const [selectedState, setSelectedState] = useState<string>('West Bengal');
  const [rankings, setRankings] = useState<any[]>([]);

  useEffect(() => {
    // Load users from local storage
    const usersStr = localStorage.getItem('site_users');
    if (usersStr) {
      try {
        const allUsers = JSON.parse(usersStr);
        if (Array.isArray(allUsers)) {
          // Filter by state and ensure they have a score
          const stateUsers = allUsers.filter((u: any) => 
            u.state === selectedState && (u.totalScore || 0) > 0
          );
          
          // Sort descending by score
          stateUsers.sort((a: any, b: any) => (b.totalScore || 0) - (a.totalScore || 0));
          
          setRankings(stateUsers);
        }
      } catch (e) {
        console.error("Error parsing users", e);
      }
    }
  }, [selectedState]);

  return (
    <div className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Top Ad */}
      <AdUnit placement="top" className="mb-8" />

      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4 flex items-center justify-center gap-3">
          <Trophy className="h-10 w-10 text-amber-500" />
          State Leaderboard
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          See who's topping the charts in your region. Keep practicing to improve your rank!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-24">
             <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
               <MapPin className="h-5 w-5 text-indigo-600" /> Select State
             </h3>
             <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {INDIAN_STATES.map(state => (
                  <button
                    key={state}
                    onClick={() => setSelectedState(state)}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedState === state 
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' 
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {state}
                  </button>
                ))}
             </div>
          </div>
        </div>

        {/* Leaderboard List */}
        <div className="lg:col-span-3">
           <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                 <h2 className="text-xl font-bold text-slate-900">Top Performers: {selectedState}</h2>
                 <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">
                    {rankings.length} Active Students
                 </span>
              </div>
              
              {rankings.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                   <div className="bg-slate-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="h-8 w-8 text-slate-400" />
                   </div>
                   <h3 className="text-lg font-semibold text-slate-900">No data yet</h3>
                   <p>Be the first to practice and top the leaderboard in {selectedState}!</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {rankings.map((user, index) => {
                    let rankIcon;
                    let rankClass = "text-slate-500 font-bold text-lg";
                    let bgClass = "bg-white hover:bg-slate-50";

                    if (index === 0) {
                      rankIcon = <Medal className="h-6 w-6 text-amber-500" />; // Gold
                      bgClass = "bg-amber-50/30 hover:bg-amber-50/50";
                    } else if (index === 1) {
                      rankIcon = <Medal className="h-6 w-6 text-slate-400" />; // Silver
                    } else if (index === 2) {
                      rankIcon = <Medal className="h-6 w-6 text-orange-600" />; // Bronze
                    }

                    return (
                      <div key={index} className={`p-6 flex items-center gap-4 transition-colors ${bgClass}`}>
                         <div className="w-12 flex justify-center">
                            {rankIcon || <span className={rankClass}>#{index + 1}</span>}
                         </div>
                         
                         <div className="flex-shrink-0">
                            <img 
                              src={user.picture || `https://ui-avatars.com/api/?name=${user.name}`} 
                              alt={user.name} 
                              className="h-12 w-12 rounded-full border border-slate-200"
                            />
                         </div>

                         <div className="flex-grow">
                            <h4 className="font-bold text-slate-900 text-lg">{user.name}</h4>
                            <p className="text-xs text-slate-500">{user.email ? user.email.replace(/@.*/, '***') : 'Student'}</p>
                         </div>

                         <div className="text-right">
                            <span className="block text-2xl font-extrabold text-indigo-600">{user.totalScore || 0}</span>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Score</span>
                         </div>
                      </div>
                    );
                  })}
                </div>
              )}
           </div>

           {/* Middle Ad */}
           <AdUnit placement="sidebar" className="mt-8" />
        </div>

      </div>
    </div>
  );
};