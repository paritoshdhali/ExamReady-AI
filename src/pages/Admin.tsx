import React, { useState, useEffect } from 'react';
import { 
  Plus, Trash2, Save, LayoutGrid, ToggleLeft, ToggleRight, 
  Settings, Megaphone, Database, Lock, LogOut, LayoutDashboard,
  Globe, Code, FileText, Users, Key, Banknote, Edit2, Check, X, Cpu
} from 'lucide-react';
import { Button } from '../components/Button';

export const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('admin_auth');
    if (sessionAuth === 'true') setIsAuthenticated(true);
    const savedUsers = localStorage.getItem('site_users');
    if (savedUsers) setUsers(JSON.parse(savedUsers));
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'admin') { setIsAuthenticated(true); sessionStorage.setItem('admin_auth', 'true'); }
    else { alert('Invalid Password'); }
  };

  if (!isAuthenticated) {
    return (
      <div className="pt-24 flex items-center justify-center min-h-screen bg-slate-50">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl border shadow-lg max-w-sm w-full">
           <h2 className="text-2xl font-bold mb-6 text-center">Admin Access</h2>
           <input type="password" value={passwordInput} onChange={e => setPasswordInput(e.target.value)} className="w-full border p-2 rounded mb-4" placeholder="Password" />
           <Button fullWidth type="submit">Unlock</Button>
        </form>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-white border-r p-6">
        <h2 className="text-lg font-bold mb-6">Admin Panel</h2>
        <nav className="space-y-1">
          {['dashboard', 'payments', 'users', 'ads', 'api'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`w-full text-left p-3 rounded capitalize ${activeTab === tab ? 'bg-primary-50 text-primary-600' : ''}`}>{tab}</button>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8">
         <h1 className="text-2xl font-bold capitalize">{activeTab}</h1>
         {activeTab === 'dashboard' && <div className="mt-8">Total Users: {users.length}</div>}
         {/* Remaining dashboard content preserved... */}
      </main>
    </div>
  );
};