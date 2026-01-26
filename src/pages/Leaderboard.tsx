import React, { useState, useEffect } from 'react';
import { Trophy, MapPin, Medal, User } from 'lucide-react';
import { AdUnit } from '../components/AdUnit';

const INDIAN_STATES = ["West Bengal", "Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Uttar Pradesh"];

export const Leaderboard: React.FC = () => {
  const [selectedState, setSelectedState] = useState<string>('West Bengal');
  const [rankings, setRankings] = useState<any[]>([]);

  useEffect(() => {
    const usersStr = localStorage.getItem('site_users');
    if (usersStr) {
      const allUsers = JSON.parse(usersStr);
      if (Array.isArray(allUsers)) {
        const stateUsers = allUsers.filter((u: any) => u.state === selectedState && (u.totalScore || 0) > 0);
        stateUsers.sort((a: any, b: any) => (b.totalScore || 0) - (a.totalScore || 0));
        setRankings(stateUsers);
      }
    }
  }, [selectedState]);

  return (
    <div className="pt-24 max-w-7xl mx-auto px-4">
      <h1 className="text-4xl font-bold text-center mb-12 flex justify-center gap-3"><Trophy className="text-amber-500" /> State Leaderboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1 bg-white p-6 border rounded-2xl h-fit sticky top-24">
           <h3 className="font-bold mb-4">Select State</h3>
           {INDIAN_STATES.map(s => (
             <button key={s} onClick={() => setSelectedState(s)} className={`w-full text-left p-2 rounded ${selectedState === s ? 'bg-indigo-50 text-indigo-700 font-bold' : ''}`}>{s}</button>
           ))}
        </aside>
        <div className="lg:col-span-3 bg-white border rounded-2xl overflow-hidden">
           <div className="p-6 bg-slate-50 border-b font-bold">Top Performers: {selectedState}</div>
           {rankings.length === 0 ? <div className="p-12 text-center text-slate-500">No data yet.</div> : (
             <div className="divide-y">
               {rankings.map((u, i) => (
                 <div key={i} className="p-6 flex items-center gap-4">
                    <span className="w-8 font-bold text-slate-400">#{i+1}</span>
                    <img src={u.picture} className="h-10 w-10 rounded-full border" alt="" />
                    <div className="flex-grow font-bold">{u.name}</div>
                    <div className="text-indigo-600 font-extrabold text-xl">{u.totalScore || 0}</div>
                 </div>
               ))}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};