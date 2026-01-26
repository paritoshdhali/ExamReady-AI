import React, { useState, useEffect } from 'react';
import { 
  Plus, Trash2, Save, LayoutGrid, ToggleLeft, ToggleRight, 
  Settings, Megaphone, Database, Lock, LogOut, LayoutDashboard,
  Globe, Code, FileText, BarChart, Users, Key, Banknote,
  Edit2, Check, X, Cpu
} from 'lucide-react';
import { Button } from '../components/Button';

// Default Seed Data (kept for fallback)
const DEFAULT_CATEGORIES = [
  { id: 'SCHOOL', label: 'School Test', icon: 'ClipboardList', color: 'text-blue-600', bg: 'bg-blue-50', desc: 'Class 1-12', hasChapters: true },
  { id: 'COLLEGE', label: 'College Test', icon: 'GraduationCap', color: 'text-indigo-600', bg: 'bg-indigo-50', desc: 'University Exams', hasChapters: true },
  { id: 'JEE', label: 'JEE (Main & Adv)', icon: 'Atom', color: 'text-orange-600', bg: 'bg-orange-50', desc: 'Engineering', hasChapters: false },
  { id: 'NEET', label: 'NEET (Medical)', icon: 'Stethoscope', color: 'text-emerald-600', bg: 'bg-emerald-50', desc: 'Medical', hasChapters: false },
  { id: 'UPSC', label: 'UPSC CSE', icon: 'Globe', color: 'text-blue-700', bg: 'bg-blue-50', desc: 'Civil Services', hasChapters: false },
];

const AI_PROVIDERS = [
  "Gemini AI",
  "OpenAI",
  "OpenRouter",
  "Anthropic (Claude)",
  "Groq"
];

type Tab = 'dashboard' | 'categories' | 'ads' | 'api' | 'site' | 'auth' | 'users' | 'payments';

export const Admin: React.FC = () => {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');

  // Dashboard State
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  
  // Category State
  const [categories, setCategories] = useState<any[]>([]);
  const [newCat, setNewCat] = useState({ label: '', id: '', desc: '', icon: 'BookOpen', hasChapters: false });

  // Ad State
  const [ads, setAds] = useState({ top: '', sidebar: '', bottom: '', chat: '' });

  // API State
  const [apiConfig, setApiConfig] = useState({ 
    apiKey: '', 
    baseUrl: '',
    provider: 'Gemini AI'
  });

  // Site & SEO State
  const [siteSettings, setSiteSettings] = useState({
    gaId: '',
    headerCode: '',
    bodyCode: '',
    adsTxt: ''
  });

  // Auth Settings State
  const [authConfig, setAuthConfig] = useState({ clientId: '', clientSecret: '' });

  // Payment Settings State
  const [paymentConfig, setPaymentConfig] = useState({ gatewayKey: '', price: '15' });

  // User Management State
  const [users, setUsers] = useState<any[]>([]);
  const [newUserEmail, setNewUserEmail] = useState('');
  
  // User Editing State
  const [editingUserEmail, setEditingUserEmail] = useState<string | null>(null);
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');

  // Load Data on Mount
  useEffect(() => {
    // Load Categories
    const savedCats = localStorage.getItem('app_categories');
    if (savedCats) {
      try {
        const parsed = JSON.parse(savedCats);
        if (Array.isArray(parsed)) {
            const mapped = parsed.map((cat: any) => ({
                ...cat,
                hasChapters: cat.hasChapters !== undefined ? cat.hasChapters : (cat.id === 'SCHOOL' || cat.id === 'COLLEGE')
            }));
            setCategories(mapped);
        } else {
            setCategories(DEFAULT_CATEGORIES);
        }
      } catch (e) {
        setCategories(DEFAULT_CATEGORIES);
      }
    } else {
      setCategories(DEFAULT_CATEGORIES);
    }

    // Load Ads
    const savedAds = localStorage.getItem('site_ads');
    if (savedAds) {
       try {
        const parsedAds = JSON.parse(savedAds);
        setAds({
            top: parsedAds.top || '',
            sidebar: parsedAds.sidebar || '',
            bottom: parsedAds.bottom || '',
            chat: parsedAds.chat || ''
        });
       } catch (e) {}
    }

    // Load API Config
    const savedApi = localStorage.getItem('site_api_config');
    if (savedApi) try { 
      const parsed = JSON.parse(savedApi);
      setApiConfig({
        apiKey: parsed.apiKey || '',
        baseUrl: parsed.baseUrl || '',
        provider: parsed.provider || 'Gemini AI'
      }); 
    } catch(e) {}
    
    // Load Site Settings
    const savedSite = localStorage.getItem('site_settings');
    if (savedSite) try { setSiteSettings(JSON.parse(savedSite)); } catch(e) {}

    // Load Auth Config
    const savedAuthConfig = localStorage.getItem('site_auth_config');
    if (savedAuthConfig) try { setAuthConfig(JSON.parse(savedAuthConfig)); } catch(e) {}

    // Load Payment Config
    const savedPaymentConfig = localStorage.getItem('site_payment_config');
    if (savedPaymentConfig) try { setPaymentConfig(JSON.parse(savedPaymentConfig)); } catch(e) {}

    // Load Users
    const savedUsers = localStorage.getItem('site_users');
    if (savedUsers) try {
        const parsedUsers = JSON.parse(savedUsers);
        if (Array.isArray(parsedUsers)) setUsers(parsedUsers);
    } catch(e) {}

    // Check Session Auth (Simple simulation)
    const sessionAuth = sessionStorage.getItem('admin_auth');
    if (sessionAuth === 'true') setIsAuthenticated(true);
  }, []);

  // --- Handlers ---

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple hardcoded check
    if (passwordInput === 'admin') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
    } else {
      alert('Invalid Password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_auth');
  };

  // Category Handlers
  const handleSaveCategories = () => {
    localStorage.setItem('app_categories', JSON.stringify(categories));
    alert('Category Settings Saved!');
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm('Delete this category?')) {
      const updated = categories.filter(c => c.id !== id);
      setCategories(updated);
      localStorage.setItem('app_categories', JSON.stringify(updated));
    }
  };

  const handleToggleChapters = (id: string) => {
    const updated = categories.map(cat => 
      cat.id === id ? { ...cat, hasChapters: !cat.hasChapters } : cat
    );
    setCategories(updated);
    localStorage.setItem('app_categories', JSON.stringify(updated));
  };

  const handleAddCategory = () => {
    if (!newCat.label || !newCat.id) return alert('Label and ID required');
    const cat = {
      ...newCat,
      id: newCat.id.toUpperCase().replace(/\s+/g, '_'),
      color: 'text-slate-700',
      bg: 'bg-slate-100'
    };
    const updated = [...categories, cat];
    setCategories(updated);
    localStorage.setItem('app_categories', JSON.stringify(updated));
    setNewCat({ label: '', id: '', desc: '', icon: 'BookOpen', hasChapters: false });
  };

  // Ad Handlers
  const handleSaveAds = () => {
    localStorage.setItem('site_ads', JSON.stringify(ads));
    alert('Ad Configurations Saved!');
  };

  // API Handlers
  const handleSaveApi = () => {
    localStorage.setItem('site_api_config', JSON.stringify(apiConfig));
    alert('AI Configuration Saved!');
  };

  // Site Settings Handler
  const handleSaveSiteSettings = () => {
    localStorage.setItem('site_settings', JSON.stringify(siteSettings));
    alert('Site & SEO Settings Saved! Refresh the page to see code injection changes.');
  };

  // Auth Settings Handler
  const handleSaveAuthConfig = () => {
    localStorage.setItem('site_auth_config', JSON.stringify(authConfig));
    alert('Google Auth Settings Saved! The login button will now be active on the frontend.');
  };

  // Payment Settings Handler
  const handleSavePaymentConfig = () => {
    localStorage.setItem('site_payment_config', JSON.stringify(paymentConfig));
    alert('Payment Settings Saved!');
  };

  // User Handlers
  const handleAddUser = () => {
    if (!newUserEmail) return alert("Please enter an email");
    const newUser = {
      name: "Manual User",
      email: newUserEmail,
      picture: `https://ui-avatars.com/api/?name=${newUserEmail.charAt(0)}&background=random`,
      proExpiry: 0
    };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('site_users', JSON.stringify(updatedUsers));
    setNewUserEmail('');
  };

  const handleDeleteUser = (email: string) => {
    if (confirm(`Remove user ${email}?`)) {
      const updatedUsers = users.filter(u => u.email !== email);
      setUsers(updatedUsers);
      localStorage.setItem('site_users', JSON.stringify(updatedUsers));
    }
  };

  // --- EDIT USER EXPIRY HANDLERS ---
  const handleEditUser = (user: any) => {
    setEditingUserEmail(user.email);
    if (user.proExpiry && user.proExpiry > 0) {
      const dateObj = new Date(user.proExpiry);
      // Format YYYY-MM-DD
      const dateStr = dateObj.getFullYear() + '-' + 
                      String(dateObj.getMonth() + 1).padStart(2, '0') + '-' + 
                      String(dateObj.getDate()).padStart(2, '0');
      // Format HH:mm
      const timeStr = String(dateObj.getHours()).padStart(2, '0') + ':' + 
                      String(dateObj.getMinutes()).padStart(2, '0');
      setEditDate(dateStr);
      setEditTime(timeStr);
    } else {
      setEditDate('');
      setEditTime('');
    }
  };

  const handleSaveUserExpiry = (email: string) => {
    if (!editDate || !editTime) {
      // If cleared, remove pro status
      const updatedUsers = users.map(u => {
        if (u.email === email) return { ...u, proExpiry: 0 };
        return u;
      });
      setUsers(updatedUsers);
      localStorage.setItem('site_users', JSON.stringify(updatedUsers));
      setEditingUserEmail(null);
      return;
    }

    const newExpiryTimestamp = new Date(`${editDate}T${editTime}`).getTime();
    
    const updatedUsers = users.map(u => {
      if (u.email === email) return { ...u, proExpiry: newExpiryTimestamp };
      return u;
    });
    setUsers(updatedUsers);
    localStorage.setItem('site_users', JSON.stringify(updatedUsers));
    setEditingUserEmail(null);
  };

  const isProUser = (timestamp: number) => {
    return timestamp > Date.now();
  };

  if (!isAuthenticated) {
    return (
      <div className="pt-24 pb-12 min-h-screen flex items-center justify-center px-4 bg-slate-50">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full border border-slate-200">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-slate-100 rounded-full">
              <Lock className="h-8 w-8 text-slate-700" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">Admin Access</h2>
          <p className="text-center text-slate-500 mb-6 text-sm">Please enter the password to continue.</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input 
                type="password" 
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" 
                placeholder="Password"
              />
            </div>
            <Button fullWidth type="submit">Unlock Dashboard</Button>
            <p className="text-xs text-center text-slate-400 mt-4">(Default: admin)</p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-slate-50 flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex-shrink-0 md:min-h-[calc(100vh-4rem)]">
        <div className="p-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary-600" />
            Admin Panel
          </h2>
        </div>
        <nav className="px-4 space-y-1">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <LayoutDashboard className="h-5 w-5" /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('payments')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'payments' ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Banknote className="h-5 w-5" /> Payment Settings
          </button>
          <button 
            onClick={() => setActiveTab('auth')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'auth' ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Key className="h-5 w-5" /> Auth Settings
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'users' ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Users className="h-5 w-5" /> User Management
          </button>
          <button 
            onClick={() => setActiveTab('categories')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'categories' ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <LayoutGrid className="h-5 w-5" /> Category Settings
          </button>
          <button 
            onClick={() => setActiveTab('site')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'site' ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Globe className="h-5 w-5" /> Site Management
          </button>
          <button 
            onClick={() => setActiveTab('ads')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'ads' ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Megaphone className="h-5 w-5" /> Ad Management
          </button>
          <button 
            onClick={() => setActiveTab('api')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'api' ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Database className="h-5 w-5" /> API Settings
          </button>
        </nav>
        <div className="p-4 mt-auto border-t border-slate-200 md:absolute md:bottom-0 md:w-64">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
            <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="text-slate-500 text-sm font-medium mb-1">Total Users</div>
                <div className="text-3xl font-bold text-slate-900">{users?.length || 0}</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="text-slate-500 text-sm font-medium mb-1">Total Categories</div>
                <div className="text-3xl font-bold text-indigo-600">{categories?.length || 0}</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                 <div className="text-slate-500 text-sm font-medium mb-1">Pro Users</div>
                 <div className="text-3xl font-bold text-emerald-600">
                    {users?.filter(u => isProUser(u.proExpiry || 0)).length || 0}
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* PAYMENT SETTINGS TAB */}
        {activeTab === 'payments' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-slate-900">Payment Settings</h1>
              <Button onClick={handleSavePaymentConfig} className="flex items-center gap-2">
                <Save className="h-4 w-4" /> Save Config
              </Button>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <p className="text-sm text-slate-500 mb-6">
                Configure your payment gateway credentials and pricing strategy.
              </p>
              <div className="grid grid-cols-1 gap-6 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">Payment Gateway API Key (Key ID)</label>
                  <input 
                    type="password"
                    value={paymentConfig.gatewayKey}
                    onChange={e => setPaymentConfig({...paymentConfig, gatewayKey: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="rzp_live_..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">Set Subscription Price (₹)</label>
                  <input 
                    type="number"
                    value={paymentConfig.price}
                    onChange={e => setPaymentConfig({...paymentConfig, price: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="15"
                  />
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100">
                 <h3 className="text-sm font-bold text-slate-900 mb-2">Active Refund Policy (Visible to Users)</h3>
                 <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs text-slate-600 leading-relaxed">
                    Refund Policy: This ₹{paymentConfig.price} fee is charged to cover AI maintenance costs. By paying, you agree to our terms. We show ads and charge this small fee for our service. If you find our service useful, please proceed; otherwise, do not pay. We reserve the right to increase the price in the future. Once paid, the amount is strictly non-refundable. Please review everything before making a payment.
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* AUTH SETTINGS TAB */}
        {activeTab === 'auth' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-slate-900">Auth Settings</h1>
              <Button onClick={handleSaveAuthConfig} className="flex items-center gap-2">
                <Save className="h-4 w-4" /> Save Config
              </Button>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <p className="text-sm text-slate-500 mb-6">
                Enable "Login with Google" by providing your Google Cloud OAuth Client credentials.
              </p>
              <div className="grid grid-cols-1 gap-6 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">Google Client ID</label>
                  <input 
                    type="text"
                    value={authConfig.clientId}
                    onChange={e => setAuthConfig({...authConfig, clientId: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="xxxxxxxx.apps.googleusercontent.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">Google Client Secret</label>
                  <input 
                    type="password"
                    value={authConfig.clientSecret}
                    onChange={e => setAuthConfig({...authConfig, clientSecret: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="GOCSPX-..."
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* USER MANAGEMENT TAB */}
        {activeTab === 'users' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
             <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
             </div>
             
             {/* Manual Add User */}
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex gap-4 items-end">
                <div className="flex-1">
                   <label className="block text-xs font-semibold text-slate-500 mb-1">Add Manual User (Gmail)</label>
                   <input 
                      type="email"
                      value={newUserEmail}
                      onChange={e => setNewUserEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm"
                      placeholder="user@gmail.com"
                   />
                </div>
                <Button onClick={handleAddUser} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" /> Add User
                </Button>
             </div>

             {/* User Table */}
             <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Expiry (Local)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {users?.map((user, idx) => {
                      const isPro = isProUser(user.proExpiry || 0);
                      const isEditing = editingUserEmail === user.email;

                      return (
                      <tr key={idx}>
                        <td className="px-6 py-4 whitespace-nowrap">
                           <div className="flex items-center gap-3">
                              <img src={user.picture} alt={user.name} className="h-10 w-10 rounded-full border border-slate-200" />
                              <div className="text-sm font-medium text-slate-900">{user.name}</div>
                           </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                           {isPro ? (
                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                               Pro (Active)
                             </span>
                           ) : (
                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                               Free
                             </span>
                           )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                           {isEditing ? (
                             <div className="flex flex-col gap-2">
                               <input 
                                 type="date" 
                                 value={editDate}
                                 onChange={(e) => setEditDate(e.target.value)}
                                 className="px-2 py-1 border rounded text-xs"
                               />
                               <input 
                                 type="time" 
                                 value={editTime}
                                 onChange={(e) => setEditTime(e.target.value)}
                                 className="px-2 py-1 border rounded text-xs"
                               />
                             </div>
                           ) : (
                             <div className="flex items-center gap-2">
                               <span>
                                 {isPro && user.proExpiry 
                                    ? new Date(user.proExpiry).toLocaleString([], { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                                    : '-'}
                               </span>
                             </div>
                           )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            {isEditing ? (
                                <>
                                  <button onClick={() => handleSaveUserExpiry(user.email)} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100">
                                    <Check className="h-4 w-4" />
                                  </button>
                                  <button onClick={() => setEditingUserEmail(null)} className="p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100">
                                    <X className="h-4 w-4" />
                                  </button>
                                </>
                            ) : (
                                <button onClick={() => handleEditUser(user)} className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100">
                                  <Edit2 className="h-4 w-4" />
                                </button>
                            )}
                            <button 
                              onClick={() => handleDeleteUser(user.email)}
                              className="text-red-600 hover:text-red-900 transition-colors p-2 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )})}
                    {(!users || users.length === 0) && (
                       <tr>
                          <td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-500">No users found.</td>
                       </tr>
                    )}
                  </tbody>
                </table>
             </div>
          </div>
        )}

        {/* CATEGORIES TAB */}
        {activeTab === 'categories' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
             <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">Category Settings</h1>
                <Button onClick={handleSaveCategories} className="flex items-center gap-2">
                  <Save className="h-4 w-4" /> Save Changes
                </Button>
             </div>
             
             {/* Add Form */}
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Add New Category</h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                  <div className="md:col-span-1">
                    <label className="block text-xs font-medium text-slate-500 mb-1">ID (Unique)</label>
                    <input 
                      type="text" 
                      value={newCat.id}
                      onChange={(e) => setNewCat({...newCat, id: e.target.value})}
                      placeholder="e.g. UPSC"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-xs font-medium text-slate-500 mb-1">Label</label>
                    <input 
                      type="text" 
                      value={newCat.label}
                      onChange={(e) => setNewCat({...newCat, label: e.target.value})}
                      placeholder="e.g. UPSC CSE"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-slate-500 mb-1">Description</label>
                    <input 
                      type="text" 
                      value={newCat.desc}
                      onChange={(e) => setNewCat({...newCat, desc: e.target.value})}
                      placeholder="Description"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <Button fullWidth onClick={handleAddCategory}>
                      <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                  </div>
                </div>
             </div>

             {/* List */}
             <div className="grid grid-cols-1 gap-4">
               {categories?.map(cat => (
                 <div key={cat.id} className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                       <div className={`p-3 rounded-lg ${cat.bg}`}>
                          <LayoutGrid className={`h-6 w-6 ${cat.color}`} />
                       </div>
                       <div>
                          <h4 className="font-bold text-slate-900">{cat.label}</h4>
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                             <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">{cat.id}</code>
                             <span>• {cat.desc}</span>
                          </div>
                       </div>
                    </div>
                    <div className="flex items-center gap-3">
                       <button 
                         onClick={() => handleToggleChapters(cat.id)}
                         className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${cat.hasChapters ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-50 text-slate-600'}`}
                       >
                          {cat.hasChapters ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                          {cat.hasChapters ? 'Chapters On' : 'Chapters Off'}
                       </button>
                       <button 
                         onClick={() => handleDeleteCategory(cat.id)}
                         className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                       >
                          <Trash2 className="h-5 w-5" />
                       </button>
                    </div>
                 </div>
               ))}
             </div>
          </div>
        )}

        {/* SITE MANAGEMENT TAB */}
        {activeTab === 'site' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
             <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">Site Management</h1>
                <Button onClick={handleSaveSiteSettings} className="flex items-center gap-2">
                  <Save className="h-4 w-4" /> Save Settings
                </Button>
             </div>

             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">Google Analytics ID</label>
                  <input 
                    type="text" 
                    value={siteSettings.gaId} 
                    onChange={e => setSiteSettings({...siteSettings, gaId: e.target.value})}
                    placeholder="G-XXXXXXXXXX"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2 flex items-center gap-2">
                    <Code className="h-4 w-4" /> Custom Header Code (Styles, Meta, Scripts)
                  </label>
                  <textarea 
                    rows={4}
                    value={siteSettings.headerCode}
                    onChange={e => setSiteSettings({...siteSettings, headerCode: e.target.value})}
                    placeholder="<script>...</script>"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2 flex items-center gap-2">
                    <Code className="h-4 w-4" /> Custom Body Code (Tracking pixels, Chat widgets)
                  </label>
                  <textarea 
                    rows={4}
                    value={siteSettings.bodyCode}
                    onChange={e => setSiteSettings({...siteSettings, bodyCode: e.target.value})}
                    placeholder="<noscript>...</noscript>"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4" /> ads.txt Content
                  </label>
                  <textarea 
                    rows={4}
                    value={siteSettings.adsTxt}
                    onChange={e => setSiteSettings({...siteSettings, adsTxt: e.target.value})}
                    placeholder="google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg font-mono text-sm"
                  />
                  <p className="text-xs text-slate-500 mt-1">Accessible at /ads.txt</p>
                </div>
             </div>
          </div>
        )}

        {/* ADS TAB */}
        {activeTab === 'ads' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
             <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">Ad Management</h1>
                <Button onClick={handleSaveAds} className="flex items-center gap-2">
                  <Save className="h-4 w-4" /> Save Ads
                </Button>
             </div>

             <div className="grid grid-cols-1 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <label className="block text-sm font-bold text-slate-900 mb-2">Top Banner Ad Code</label>
                  <textarea 
                    rows={3}
                    value={ads.top}
                    onChange={(e) => setAds({...ads, top: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg font-mono text-xs bg-slate-50 focus:bg-white transition-colors"
                    placeholder="<!-- Paste AdSense/HTML code here -->"
                  />
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <label className="block text-sm font-bold text-slate-900 mb-2">Sidebar/Middle Ad Code</label>
                  <textarea 
                    rows={3}
                    value={ads.sidebar}
                    onChange={(e) => setAds({...ads, sidebar: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg font-mono text-xs bg-slate-50 focus:bg-white transition-colors"
                    placeholder="<!-- Paste AdSense/HTML code here -->"
                  />
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <label className="block text-sm font-bold text-slate-900 mb-2">Bottom Banner Ad Code</label>
                  <textarea 
                    rows={3}
                    value={ads.bottom}
                    onChange={(e) => setAds({...ads, bottom: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg font-mono text-xs bg-slate-50 focus:bg-white transition-colors"
                    placeholder="<!-- Paste AdSense/HTML code here -->"
                  />
                </div>

                {/* NEW CHAT AD SLOT */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-200 ring-4 ring-indigo-50">
                  <div className="flex items-center gap-2 mb-2">
                     <label className="block text-sm font-bold text-indigo-900">Chat Interface Ad Code</label>
                     <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">PRIME FEATURE</span>
                  </div>
                  <p className="text-xs text-indigo-600 mb-3">
                     This ad will appear inside the Prime AI Chat interface, below every model response. Keep it small/responsive.
                  </p>
                  <textarea 
                    rows={3}
                    value={ads.chat}
                    onChange={(e) => setAds({...ads, chat: e.target.value})}
                    className="w-full px-4 py-3 border border-indigo-200 rounded-lg font-mono text-xs bg-indigo-50 focus:bg-white transition-colors focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="<!-- Paste AdSense/HTML code here -->"
                  />
                </div>
             </div>
          </div>
        )}

        {/* API TAB */}
        {activeTab === 'api' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
             <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">API Configuration</h1>
                <Button onClick={handleSaveApi} className="flex items-center gap-2">
                  <Save className="h-4 w-4" /> Save Configuration
                </Button>
             </div>

             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
                
                {/* AI Configuration Section */}
                <div className="pb-6 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                       <Cpu className="h-5 w-5 text-indigo-600" /> AI Provider Settings
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div>
                          <label className="block text-sm font-medium text-slate-900 mb-2">Select Provider</label>
                          <select 
                            value={apiConfig.provider}
                            onChange={(e) => setApiConfig({...apiConfig, provider: e.target.value})}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                          >
                             {AI_PROVIDERS.map(p => (
                               <option key={p} value={p}>{p}</option>
                             ))}
                          </select>
                          <p className="text-xs text-slate-500 mt-2">
                             This provider will be used for both Chat and MCQ generation.
                          </p>
                       </div>
                       <div>
                          <label className="block text-sm font-medium text-slate-900 mb-2">API Key</label>
                          <div className="relative">
                            <input 
                              type="password" 
                              value={apiConfig.apiKey}
                              onChange={(e) => setApiConfig({...apiConfig, apiKey: e.target.value})}
                              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                              placeholder="Key..."
                            />
                            <div className="absolute left-3 top-2.5 text-slate-400">
                              <Key className="h-5 w-5" />
                            </div>
                          </div>
                          <p className="text-xs text-slate-500 mt-2">
                             Enter the specific API Key for the selected provider.
                          </p>
                       </div>
                    </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">Custom Base URL (Optional)</label>
                  <input 
                    type="text" 
                    value={apiConfig.baseUrl}
                    onChange={(e) => setApiConfig({...apiConfig, baseUrl: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                    placeholder="https://api.openai.com/v1 (for OpenAI compatible)"
                  />
                  <p className="text-xs text-slate-500 mt-2">
                     Useful for OpenRouter or custom proxies. Leave empty for default.
                  </p>
                </div>
             </div>
          </div>
        )}

      </main>
    </div>
  );
};