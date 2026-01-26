import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ClipboardList, ChevronRight, X, MapPin, ArrowLeft, BookOpen, 
  GraduationCap, School, Book, FileText, Plus, Layers, AlertCircle, 
  Loader2, CheckCircle, XCircle, University, Trophy, PlusCircle,
  Atom, Stethoscope, Globe, Briefcase, Building2, Cpu, BarChart3, 
  Shield, Train, PenTool, Languages, ChevronDown, Trash, Save,
  Lightbulb, Banknote, Share2, Lock, AlertTriangle, ExternalLink,
  Check, Star, Crown, Zap
} from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
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

// --- SCHOOL DATA ---
const BOARD_DATA: Record<string, string[]> = {
  "West Bengal": ["WBBSE (Madhyamik)", "WBCHSE (HS)", "CBSE", "ICSE", "ISC"],
  "Maharashtra": ["Maharashtra State Board (SSC)", "Maharashtra State Board (HSC)", "CBSE", "ICSE", "IB"],
  "Delhi": ["CBSE", "ICSE", "NIOS", "IB"],
  "Karnataka": ["KSEEB (SSLC)", "DPUE (PUC)", "CBSE", "ICSE"],
  "Tamil Nadu": ["TN State Board", "Matriculation", "CBSE", "ICSE"],
  "Uttar Pradesh": ["UPMSP (High School)", "UPMSP (Intermediate)", "CBSE", "ICSE"],
};
const DEFAULT_BOARDS = ["State Board", "CBSE", "ICSE", "NIOS", "International Board"];

const CLASSES_1_TO_10 = Array.from({ length: 10 }, (_, i) => `Class ${i + 1}`);
const STREAMS = ["Science", "Commerce", "Arts"];
const CLASSES_11 = STREAMS.map(s => `Class 11 (${s})`);
const CLASSES_12 = STREAMS.map(s => `Class 12 (${s})`);

const COLLEGE_SEMESTERS = Array.from({ length: 8 }, (_, i) => `Semester ${i + 1}`);
const COLLEGE_YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

const UNIVERSITY_DATA: Record<string, string[]> = {
  "West Bengal": ["Calcutta University", "Jadavpur University", "Burdwan University", "MAKAUT", "Presidency University"],
  "Maharashtra": ["Mumbai University", "Pune University (SPPU)", "Nagpur University", "IIT Bombay"],
  "Delhi": ["University of Delhi (DU)", "JNU", "IP University", "IIT Delhi", "DTU"],
  "Karnataka": ["Visvesvaraya Technological University (VTU)", "Bangalore University", "Manipal University"],
  "Tamil Nadu": ["Anna University", "University of Madras", "SRM University", "VIT"],
  "Uttar Pradesh": ["BHU", "AMU", "Lucknow University", "IIT Kanpur", "AKTU"],
};
const DEFAULT_UNIVERSITIES = ["State University", "Central University", "Private University", "Deemed University", "Autonomous College"];

const SUBJECTS_GENERAL = ["Mathematics", "Science", "Social Science", "English", "Second Language", "Computer Applications"];
const SUBJECTS_SCIENCE = ["Physics", "Chemistry", "Mathematics", "Biology", "English", "Computer Science"];
const SUBJECTS_COMMERCE = ["Accountancy", "Business Studies", "Economics", "Mathematics", "English", "Entrepreneurship"];
const SUBJECTS_ARTS = ["History", "Political Science", "Geography", "Sociology", "Psychology", "English"];
const SUBJECTS_COLLEGE = ["Computer Science", "Mechanical Engineering", "Civil Engineering", "Electrical Engineering", "Economics", "English Literature", "Political Science", "History", "Sociology", "Financial Accounting", "Corporate Law", "Business Economics", "Physics", "Chemistry", "Mathematics", "Botany", "Zoology"];

const EXAM_SUBJECTS_MAP: Record<string, string[]> = {
  'JEE': ["Physics", "Chemistry", "Mathematics"],
  'NEET': ["Physics", "Chemistry", "Biology (Botany)", "Biology (Zoology)"],
  'UPSC': ["History", "Geography", "Polity", "Economy", "General Science", "CSAT", "Current Affairs"],
  'SSC': ["General Intelligence & Reasoning", "General Awareness", "Quantitative Aptitude", "English Comprehension"],
  'BANKING': ["Reasoning Ability", "Quantitative Aptitude", "English Language", "General Awareness", "Computer Knowledge"],
  'GATE': ["Engineering Mathematics", "General Aptitude", "Computer Science", "Mechanical Eng", "Civil Eng", "Electrical Eng", "Electronics"],
  'CAT': ["Verbal Ability & Reading Comprehension (VARC)", "Data Interpretation & Logical Reasoning (DILR)", "Quantitative Ability (QA)"],
  'NDA': ["Mathematics", "General Ability Test (English)", "General Ability Test (GK)"],
};

const LANGUAGES = [
  { id: 'English', label: 'English', native: 'English' },
  { id: 'Hindi', label: 'Hindi', native: 'हिन्दी' },
  { id: 'Bengali', label: 'Bengali', native: 'বাংলা' },
  { id: 'Marathi', label: 'Marathi', native: 'मराठी' },
  { id: 'Tamil', label: 'Tamil', native: 'தமிழ்' },
  { id: 'Telugu', label: 'Telugu', native: 'తెలుగు' },
  { id: 'Gujarati', label: 'Gujarati', native: 'ગુજરાતી' },
  { id: 'Kannada', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { id: 'Malayalam', label: 'Malayalam', native: 'മലയാളം' },
  { id: 'Punjabi', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { id: 'Odia', label: 'Odia', native: 'ଓଡ଼ିଆ' },
  { id: 'Urdu', label: 'Urdu', native: 'اردو' },
];

const ICON_MAP: Record<string, any> = {
  ClipboardList, GraduationCap, Atom, Stethoscope, Globe, Briefcase, 
  Building2, Cpu, BarChart3, Shield, Train, PenTool, BookOpen, School, University
};

// Default Categories for seeding (Restored full list)
const DEFAULT_CATEGORIES = [
  { id: 'SCHOOL', label: 'School Test', icon: 'ClipboardList', color: 'text-blue-600', bg: 'bg-blue-50', desc: 'Class 1-12', hasChapters: true },
  { id: 'COLLEGE', label: 'College Test', icon: 'GraduationCap', color: 'text-indigo-600', bg: 'bg-indigo-50', desc: 'University Exams', hasChapters: true },
  { id: 'JEE', label: 'JEE (Main & Adv)', icon: 'Atom', color: 'text-orange-600', bg: 'bg-orange-50', desc: 'Engineering', hasChapters: false },
  { id: 'NEET', label: 'NEET (Medical)', icon: 'Stethoscope', color: 'text-emerald-600', bg: 'bg-emerald-50', desc: 'Medical', hasChapters: false },
  { id: 'UPSC', label: 'UPSC CSE', icon: 'Globe', color: 'text-blue-700', bg: 'bg-blue-50', desc: 'Civil Services', hasChapters: false },
  { id: 'SSC', label: 'SSC Exams', icon: 'Briefcase', color: 'text-teal-600', bg: 'bg-teal-50', desc: 'Govt. Jobs', hasChapters: false },
  { id: 'BANKING', label: 'Banking Exams', icon: 'Building2', color: 'text-cyan-600', bg: 'bg-cyan-50', desc: 'IBPS & SBI', hasChapters: false },
  { id: 'GATE', label: 'GATE', icon: 'Cpu', color: 'text-rose-600', bg: 'bg-rose-50', desc: 'Tech Masters', hasChapters: false },
  { id: 'CAT', label: 'CAT (MBA)', icon: 'BarChart3', color: 'text-purple-600', bg: 'bg-purple-50', desc: 'Management', hasChapters: false },
  { id: 'NDA', label: 'NDA', icon: 'Shield', color: 'text-green-700', bg: 'bg-green-50', desc: 'Defence', hasChapters: false },
];

// Mock Standard Chapters for Pre-defined subjects
const STANDARD_CHAPTERS = [
  "Syllabus Overview & Basics",
  "Unit 1: Fundamental Concepts",
  "Unit 2: Core Theory & Applications",
  "Unit 3: Advanced Topics",
  "Unit 4: Problem Solving & Analysis",
  "Previous Year Questions (PYQ)"
];

type Step = 'STATE' | 'BOARD' | 'CLASS' | 'CONTENT_MANAGER' | 'LANGUAGE' | 'MCQ' | 'SCORE_CARD';

interface UserChapter {
  id: string;
  name: string;
}

interface UserSubject {
  id: string;
  name: string;
  chapters: UserChapter[];
}

interface MCQ {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

// --- DAILY CHAMPIONS COMPONENT ---
const DailyChampions: React.FC = () => {
  const [champions, setChampions] = useState<any[]>([]);
  const [showChampions, setShowChampions] = useState(false);

  useEffect(() => {
    // Logic to show champions every 15 minutes or on load if overdue
    const checkShowTime = () => {
      const lastShow = localStorage.getItem('last_champion_show_time');
      const now = Date.now();
      const fifteenMinutes = 15 * 60 * 1000;

      if (!lastShow || now - parseInt(lastShow) > fifteenMinutes) {
        loadChampions();
        setShowChampions(true);
        localStorage.setItem('last_champion_show_time', now.toString());
      }
    };

    const loadChampions = () => {
      // Simulate getting All-India Top 3 from backend
      try {
        const usersStr = localStorage.getItem('site_users');
        if (usersStr) {
          const users = JSON.parse(usersStr);
          if (Array.isArray(users)) {
            // Sort by total score descending, regardless of state
            const topUsers = users
              .filter((u: any) => u.totalScore > 0)
              .sort((a: any, b: any) => b.totalScore - a.totalScore)
              .slice(0, 3);
            setChampions(topUsers);
          }
        }
      } catch (e) { console.error(e); }
    };

    checkShowTime();
    const interval = setInterval(checkShowTime, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  if (!showChampions || champions.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[50] animate-in slide-in-from-right duration-500">
      <div className="bg-white rounded-2xl shadow-2xl border-2 border-amber-200 overflow-hidden max-w-sm">
         <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-3 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
               <Trophy className="h-5 w-5 fill-yellow-200 text-yellow-100" />
               <h3 className="font-bold text-sm">Daily India Champions</h3>
            </div>
            <button onClick={() => setShowChampions(false)} className="hover:bg-white/20 rounded-full p-1">
               <X className="h-4 w-4" />
            </button>
         </div>
         <div className="p-4 bg-amber-50/50">
            <p className="text-xs text-amber-800 font-semibold mb-3 text-center">
              🎉 Winning 24 Hours Free Prime Access! 🎉
            </p>
            <div className="space-y-3">
               {champions.map((champ, idx) => (
                 <div key={idx} className="flex items-center gap-3 bg-white p-2 rounded-lg border border-amber-100 shadow-sm">
                    <div className="relative">
                       <img 
                         src={champ.picture || `https://ui-avatars.com/api/?name=${champ.name}`} 
                         alt={champ.name} 
                         className="h-8 w-8 rounded-full border border-amber-200"
                       />
                       {idx === 0 && <Crown className="h-3 w-3 absolute -top-1 -right-1 text-amber-500 fill-amber-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                       <p className="text-xs font-bold text-slate-900 truncate">{champ.name}</p>
                       <p className="text-[10px] text-slate-500 flex items-center gap-1">
                          <MapPin className="h-2 w-2" /> {champ.state || 'India'}
                       </p>
                    </div>
                    <div className="text-right">
                       <span className="block text-xs font-extrabold text-amber-600">{champ.totalScore}</span>
                       <span className="text-[9px] text-slate-400">Score</span>
                    </div>
                 </div>
               ))}
            </div>
            <p className="text-[10px] text-slate-400 text-center mt-3">
               Winners picked daily at 10:00 PM based on national rank.
            </p>
         </div>
      </div>
    </div>
  );
};

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [step, setStep] = useState<Step>('STATE');
  
  // Selection State
  const [selections, setSelections] = useState({
    state: '',
    board: '', 
    className: '', 
  });

  // User Content State (Subjects & Chapters)
  const [userSubjects, setUserSubjects] = useState<UserSubject[]>([]);
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  
  // Inputs for adding content
  const [newSubjectInput, setNewSubjectInput] = useState('');
  const [newChapterInput, setNewChapterInput] = useState('');

  // Flow State
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  // MCQ State
  const [mcqQuestions, setMcqQuestions] = useState<MCQ[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoadingMCQ, setIsLoadingMCQ] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);

  // Initialization
  useEffect(() => {
    const savedCats = localStorage.getItem('app_categories');
    if (savedCats) {
      try {
        const parsedData = JSON.parse(savedCats);
        if (Array.isArray(parsedData)) {
          // Ensure hasChapters exists
          const parsed = parsedData.map((cat: any) => ({
            ...cat,
            hasChapters: cat.hasChapters !== undefined ? cat.hasChapters : (cat.id === 'SCHOOL' || cat.id === 'COLLEGE')
          }));
          setCategories(parsed);
        } else {
           setCategories(DEFAULT_CATEGORIES);
        }
      } catch (e) {
        setCategories(DEFAULT_CATEGORIES);
      }
    } else {
      setCategories(DEFAULT_CATEGORIES);
      localStorage.setItem('app_categories', JSON.stringify(DEFAULT_CATEGORIES));
    }
  }, []);

  // Lock body scroll when modal is open to ensure "frozen" background
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  // Determine if current category has chapters enabled
  const currentCategoryObj = categories.find(c => c.id === selectedCategory);
  const hasChapters = currentCategoryObj ? currentCategoryObj.hasChapters : false;

  // Helper to get storage key based on current context
  const getStorageKey = () => {
    if (!selectedCategory) return '';
    const safeCat = selectedCategory.replace(/\s+/g, '_');
    const safeState = selections.state ? `_${selections.state.replace(/\s+/g, '')}` : '';
    const safeBoard = selections.board ? `_${selections.board.replace(/\s+/g, '')}` : '';
    const safeClass = selections.className ? `_${selections.className.replace(/\s+/g, '')}` : '';
    return `user_content_${safeCat}${safeState}${safeBoard}${safeClass}`;
  };

  const getCurrentUser = () => {
    try {
      const userStr = localStorage.getItem('current_user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (e) { return null; }
  };

  const isProUser = () => {
    const user = getCurrentUser();
    if (!user) return false;
    
    // Check against the master user list in local storage for up-to-date proExpiry
    try {
      const users = JSON.parse(localStorage.getItem('site_users') || '[]');
      const currentUserData = Array.isArray(users) ? users.find((u: any) => u.email === user.email) : null;
      
      if (currentUserData && currentUserData.proExpiry && currentUserData.proExpiry > Date.now()) {
        return true;
      }
    } catch(e) {}
    return false;
  };

  const checkUsageLimit = () => {
    if (isProUser()) return { allowed: true };

    const today = new Date().toDateString();
    const user = getCurrentUser();
    const email = user ? user.email : 'guest';
    const usageKey = `usage_limit_${email}_${today}`;
    
    try {
      const usage = JSON.parse(localStorage.getItem(usageKey) || '{"count": 0}');
      // Limit: 2 sessions of 10 MCQs = 20 MCQs total.
      if (usage.count >= 2) {
        return { allowed: false };
      }
      return { allowed: true, key: usageKey, currentCount: usage.count };
    } catch(e) {
      return { allowed: true, key: usageKey, currentCount: 0 };
    }
  };

  const incrementUsage = (key: string, currentCount: number) => {
    localStorage.setItem(key, JSON.stringify({ count: currentCount + 1 }));
  };

  // Helper to update user state for leaderboard logic
  const updateUserState = (state: string) => {
    const user = getCurrentUser();
    if (user) {
      try {
        const users = JSON.parse(localStorage.getItem('site_users') || '[]');
        const updatedUsers = users.map((u: any) => {
          if (u.email === user.email) {
            return { ...u, state: state };
          }
          return u;
        });
        localStorage.setItem('site_users', JSON.stringify(updatedUsers));
      } catch (e) {
        console.error("Error updating user state", e);
      }
    }
  };

  // Helper to accumulate score for leaderboard
  const updateUserScore = (sessionScore: number) => {
    const user = getCurrentUser();
    if (user && sessionScore > 0) {
      try {
        const users = JSON.parse(localStorage.getItem('site_users') || '[]');
        const updatedUsers = users.map((u: any) => {
          if (u.email === user.email) {
            const currentTotal = u.totalScore || 0;
            return { ...u, totalScore: currentTotal + sessionScore };
          }
          return u;
        });
        localStorage.setItem('site_users', JSON.stringify(updatedUsers));
      } catch (e) {
        console.error("Error updating user score", e);
      }
    }
  };

  // Load User Content when entering Content Manager
  useEffect(() => {
    if (step === 'CONTENT_MANAGER' && selectedCategory) {
      const key = getStorageKey();
      const savedContent = localStorage.getItem(key);
      if (savedContent) {
        try {
          const parsed = JSON.parse(savedContent);
          setUserSubjects(Array.isArray(parsed) ? parsed : []);
        } catch(e) {
          setUserSubjects([]);
        }
      } else {
        setUserSubjects([]);
      }
    }
  }, [step, selectedCategory, selections]);

  // Save User Content
  const saveUserContent = (updatedSubjects: UserSubject[]) => {
    const key = getStorageKey();
    localStorage.setItem(key, JSON.stringify(updatedSubjects));
    setUserSubjects(updatedSubjects);
  };

  const isSchool = selectedCategory === 'SCHOOL';
  const isCollege = selectedCategory === 'COLLEGE';
  const isDirectFlow = !isSchool && !isCollege;

  const handleOpenModal = (catId: string) => {
    setSelectedCategory(catId);
    setShowModal(true);
    if (catId === 'SCHOOL' || catId === 'COLLEGE') {
      setStep('STATE');
    } else {
      setStep('CONTENT_MANAGER');
    }
  };

  const handleClose = () => {
    setShowModal(false);
    
    setTimeout(() => {
      setStep('STATE');
      setSelectedCategory(null);
      setSelections({ state: '', board: '', className: '' });
      resetMCQState();
      setSelectedLanguage('English');
      setUserSubjects([]);
      setNewSubjectInput('');
      setNewChapterInput('');
    }, 300);
  };

  const resetMCQState = () => {
    setMcqQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setShowExplanation(false);
    setSelectedChapter('');
    setSelectedSubject('');
    setScore(0);
  };

  const handleBack = () => {
    if (step === 'MCQ' || step === 'SCORE_CARD') {
      resetMCQState();
      setStep('LANGUAGE');
      return;
    }
    if (step === 'LANGUAGE') {
      setStep('CONTENT_MANAGER');
      return;
    }
    if (step === 'CONTENT_MANAGER') {
      if (isDirectFlow) {
        handleClose();
      } else {
        setStep('CLASS');
      }
      return;
    }
    if (step === 'CLASS') setStep('BOARD');
    else if (step === 'BOARD') setStep('STATE');
    else if (step === 'STATE') handleClose();
  };

  const handleShare = () => {
    const user = getCurrentUser();
    if (!user) return alert("Login to share & earn!");
    
    const url = `${window.location.origin}${window.location.pathname}#/?ref=${user.email}`;
    navigator.clipboard.writeText(url);
    alert(`Link copied! Share this link.\n\nLogic: If a new user uses the app for 2 consecutive days via your link, you get 24H Pro access!`);
  };

  // --- CONTENT MANAGER LOGIC ---

  const handleManualSave = () => {
    const shouldRequireChapter = hasChapters;
    
    if (!newSubjectInput.trim()) {
      alert("Please enter a Subject Name.");
      return;
    }
    
    if (shouldRequireChapter && !newChapterInput.trim()) {
      alert("Please enter a Chapter Name.");
      return;
    }

    const subjectName = newSubjectInput.trim();
    // If chapters are disabled, we save a dummy chapter to maintain data structure consistency
    const chapterName = shouldRequireChapter ? newChapterInput.trim() : "Full Syllabus";

    const existingSubject = userSubjects.find(s => s.name.toLowerCase() === subjectName.toLowerCase());
    
    let updatedSubjects;
    if (existingSubject) {
      // Add chapter to existing subject
      updatedSubjects = userSubjects.map(sub => {
        if (sub.id === existingSubject.id) {
          return {
             ...sub,
             chapters: [...sub.chapters, { id: Date.now().toString(), name: chapterName }]
          };
        }
        return sub;
      });
    } else {
      // Create new subject with chapter
      const newSubject: UserSubject = {
        id: Date.now().toString(),
        name: subjectName,
        chapters: [{ id: Date.now().toString(), name: chapterName }]
      };
      updatedSubjects = [...userSubjects, newSubject];
    }
    
    saveUserContent(updatedSubjects);
    setNewSubjectInput('');
    setNewChapterInput('');
  };

  const handleDeleteSubject = (subId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this custom subject?')) {
      const updated = userSubjects.filter(s => s.id !== subId);
      saveUserContent(updated);
    }
  };

  // Standard flow click (Subject + Chapter)
  const handleChapterClick = (subjectName: string, chapterName: string) => {
    setSelectedSubject(subjectName);
    setSelectedChapter(chapterName);
    setStep('LANGUAGE');
  };

  // Direct flow click (Subject Only) - Used when hasChapters is false
  const handleSubjectOnlyClick = (subjectName: string) => {
    setSelectedSubject(subjectName);
    setSelectedChapter("Full Syllabus");
    setStep('LANGUAGE');
  };

  // Language & MCQ Logic
  const handleLanguageSelect = (lang: string) => {
    // Check usage limits before proceeding
    const usageCheck = checkUsageLimit();
    if (!usageCheck.allowed) {
      // Redirect to Upgrade Page
      navigate('/upgrade');
      return;
    }

    setSelectedLanguage(lang);
    generateMCQs(selectedChapter, lang, usageCheck);
  };

  // --- DYNAMIC API CALLER ---
  const callAIProvider = async (prompt: string, config: any) => {
    const provider = config.provider || 'Gemini AI';
    const apiKey = config.apiKey || process.env.API_KEY;
    const baseUrl = config.baseUrl || '';

    // Provider: Gemini AI (Default SDK)
    if (provider === 'Gemini AI') {
       const ai = new GoogleGenAI({ apiKey: apiKey });
       const response = await ai.models.generateContent({
         model: 'gemini-3-flash-preview',
         contents: prompt,
         config: { responseMimeType: 'application/json' }
       });
       return response.text;
    }

    // Provider: Anthropic (Claude)
    if (provider === 'Anthropic (Claude)') {
       // Note: CORS issues usually prevent browser calls to Anthropic directly without proxy.
       // Implementation provided as per request logic.
       const response = await fetch('https://api.anthropic.com/v1/messages', {
         method: 'POST',
         headers: {
           'x-api-key': apiKey,
           'anthropic-version': '2023-06-01',
           'content-type': 'application/json'
         },
         body: JSON.stringify({
           model: 'claude-3-haiku-20240307',
           max_tokens: 4096,
           messages: [{ role: 'user', content: prompt + " Respond strictly with valid JSON array." }]
         })
       });
       const data = await response.json();
       return data.content[0].text;
    }

    // Provider: OpenAI / OpenRouter / Groq (Compatible APIs)
    let url = 'https://api.openai.com/v1/chat/completions';
    let model = 'gpt-4o-mini';

    if (provider === 'OpenRouter') {
       url = baseUrl || 'https://openrouter.ai/api/v1/chat/completions';
       model = 'openai/gpt-3.5-turbo'; // Default fallback
    } else if (provider === 'Groq') {
       url = 'https://api.groq.com/openai/v1/chat/completions';
       model = 'llama3-8b-8192';
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: "user", content: prompt + " Respond strictly with valid JSON array." }],
        response_format: { type: "json_object" } 
      })
    });
    
    const data = await response.json();
    return data.choices[0].message.content;
  };

  const generateMCQs = async (chapterName: string, lang: string, usageCheck: any) => {
    setStep('MCQ');
    setIsLoadingMCQ(true);
    setMcqQuestions([]);
    setScore(0);

    try {
      const apiConfig = JSON.parse(localStorage.getItem('site_api_config') || '{}');
      
      let promptContext = "";
      let instructions = "";
      
      // If chapters are disabled, chapterName will be "Full Syllabus"
      const isFullSyllabus = chapterName === "Full Syllabus";
      const topicContext = isFullSyllabus 
        ? `Cover various important topics from the subject "${selectedSubject}"` 
        : `Focus on the chapter/topic "${chapterName}"`;

      if (isSchool || isCollege) {
        const categoryLabel = isCollege ? 'University' : 'School Board';
        promptContext = `
        - Category: ${selectedCategory}
        - State: ${selections.state}
        - ${categoryLabel}: ${selections.board}
        - Class/Year: ${selections.className}
        - User Selected Subject: ${selectedSubject}
        `;
        instructions = `Strictly adhere to the specific question pattern, marking style, and difficulty level of the ${selections.board} curriculum for ${selections.className}. 
        IMPORTANT: Ensure questions are strictly from the ${selections.className} syllabus only. Do not mix Class 11 and Class 12 topics.
        Even if the subject is manually added by the user, adapt the question style to this specific Board/University.`;
      } else {
        promptContext = `
        - Exam Category: ${selectedCategory}
        - User Selected Subject: ${selectedSubject}
        `;
        instructions = `Strictly follow the official question pattern, difficulty level, and style of the "${selectedCategory}" exam. Ensure questions are relevant to ${selectedCategory} aspirants.`;
      }

      // Generate a random seed to ensure uniqueness each time
      const randomSeed = Math.floor(Math.random() * 1000000);

      // UPDATED PROMPT: Request 10 MCQs
      const prompt = `Act as a strict examination setter. Generate a FRESH, UNIQUE, and RANDOMIZED set of 10 multiple choice questions (MCQs) for ${selectedSubject}.
      ${topicContext}.
      
      Context:
      ${promptContext}
      - Target Language: ${lang}
      - Unique Session ID: ${randomSeed} (Do not repeat common questions)
      
      Instructions:
      1. ${instructions}
      2. If target language is NOT English, translate the Question, Options, and Explanation accurately.
      3. Maintain technical terms in English brackets if needed.
      4. Provide a "Detailed Analysis" in the 'explanation' field. This must explain WHY the correct answer is right and concepts behind it, in the target language.
      5. Ensure questions are not repetitive from standard pools.
      
      Output JSON format only. The output must be a valid JSON array of objects with keys: id, question, options (array of strings), correctAnswer, explanation.`;

      const responseText = await callAIProvider(prompt, apiConfig);

      if (responseText) {
        // Simple heuristic parsing to handle markdown code blocks often returned by LLMs
        let cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        // Sometimes LLMs return an object wrapping the array
        const parsed = JSON.parse(cleanJson);
        const questions = Array.isArray(parsed) ? parsed : (parsed.questions || []);
        
        if (questions.length > 0) {
          setMcqQuestions(questions);
           // If not pro, increment usage
          if (usageCheck.key) {
             incrementUsage(usageCheck.key, usageCheck.currentCount);
          }
        } else {
           // Fallback or error state
           setMcqQuestions([]);
        }
      }
    } catch (error) {
      console.error("Failed to generate MCQs:", error);
    } finally {
      setIsLoadingMCQ(false);
    }
  };

  // MCQ Handlers
  const handleOptionClick = (optionIdx: number) => {
    if (selectedOptionIndex !== null) return; // Prevent double clicks
    
    setSelectedOptionIndex(optionIdx);
    setShowExplanation(true);
    
    // Check score
    const currentQ = mcqQuestions[currentQuestionIndex];
    if (currentQ && currentQ.options[optionIdx] === currentQ.correctAnswer) {
       setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < mcqQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOptionIndex(null);
      setShowExplanation(false);
    } else {
      // Finished all questions - Update User Cumulative Score
      updateUserScore(score);
      setStep('SCORE_CARD'); 
    }
  };

  const getScoreFeedback = (total: number, correct: number) => {
     const percentage = (correct / total) * 100;
     if (percentage >= 91) return { label: 'Excellent', color: 'text-emerald-600', bg: 'bg-emerald-100', icon: Trophy };
     if (percentage >= 76) return { label: 'Very Good', color: 'text-blue-600', bg: 'bg-blue-100', icon: Star };
     if (percentage >= 60) return { label: 'Good', color: 'text-amber-600', bg: 'bg-amber-100', icon: CheckCircle };
     return { label: 'Keep Practicing', color: 'text-orange-600', bg: 'bg-orange-100', icon: BookOpen };
  };

  const getCategoryLabel = (id: string | null) => {
    if (!id) return '';
    const cat = categories.find(c => c.id === id);
    return cat ? cat.label : id;
  };

  const getIcon = (iconName: string) => {
    const Icon = ICON_MAP[iconName] || BookOpen;
    return <Icon className="h-full w-full" />;
  };

  const getCurrentInstitutions = () => {
    if (isSchool) {
      if (selections.state && BOARD_DATA[selections.state]) return BOARD_DATA[selections.state];
      return DEFAULT_BOARDS;
    }
    if (isCollege) {
      if (selections.state && UNIVERSITY_DATA[selections.state]) return UNIVERSITY_DATA[selections.state];
      return DEFAULT_UNIVERSITIES;
    }
    return [];
  };

  const getOfficialSubjects = () => {
    if (selectedCategory && EXAM_SUBJECTS_MAP[selectedCategory]) {
      return EXAM_SUBJECTS_MAP[selectedCategory];
    }
    if (isCollege) return SUBJECTS_COLLEGE;
    if (isSchool) {
      if (selections.className && selections.className.includes("Science")) return SUBJECTS_SCIENCE;
      if (selections.className && selections.className.includes("Commerce")) return SUBJECTS_COMMERCE;
      if (selections.className && selections.className.includes("Arts")) return SUBJECTS_ARTS;
      return SUBJECTS_GENERAL;
    }
    return [];
  };

  return (
    <div className="pt-16 min-h-[calc(100vh-4rem)] pb-20 relative">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-50 rounded-full blur-3xl opacity-70 translate-x-1/3 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-50 rounded-full blur-3xl opacity-70 -translate-x-1/3 translate-y-1/4"></div>
      </div>

      {/* TOP AD SLOT */}
      <AdUnit placement="top" className="max-w-7xl mx-auto px-4" />
      
      {/* DAILY CHAMPIONS DISPLAY (Bottom Right) */}
      <DailyChampions />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
        <div className="text-center max-w-5xl mx-auto mb-20 sm:mb-24">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600">
              Master Your Future with Smarter Learning.
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Your all-in-one platform to practice skills, track progress, and stay updated with the latest educational trends.
          </p>
        </div>

        {/* MIDDLE AD SLOT */}
        <AdUnit placement="sidebar" className="mb-12" />

        <div className="w-full max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-2">
            <Trophy className="h-6 w-6 text-orange-600" />
            Explore Categories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories?.map((cat) => (
              <div 
                key={cat.id}
                onClick={() => handleOpenModal(cat.id)}
                className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 hover:border-slate-300 transition-all duration-300 cursor-pointer flex flex-col items-center relative"
              >
                <div className={`${cat.bg} p-4 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300 h-16 w-16 text-slate-700`}>
                  {getIcon(cat.icon)}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 text-center">{cat.label}</h3>
                <p className="text-sm text-slate-500 text-center leading-relaxed mb-2">
                  {cat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        {/* BOTTOM AD SLOT */}
        <AdUnit placement="bottom" className="mt-12" />

      </div>

      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
            onClick={handleClose}
          />
          
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200 border border-slate-100 overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-6 md:p-8 border-b border-slate-100 flex justify-between items-center bg-white rounded-t-3xl z-10 sticky top-0">
              <div className="flex items-center gap-4">
                  <button 
                    onClick={handleBack}
                    className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors group"
                  >
                    {step === 'STATE' || (step === 'CONTENT_MANAGER' && isDirectFlow) ? (
                      <X className="h-6 w-6" onClick={handleClose} />
                    ) : (
                      <ArrowLeft className="h-6 w-6 group-hover:-translate-x-1 transition-transform" />
                    )}
                  </button>

                <div>
                  <h3 className="text-2xl font-bold text-slate-900 flex items-center flex-wrap gap-2">
                      <>
                        {step === 'STATE' && "Select State"}
                        {step === 'BOARD' && (isCollege ? "Select University" : "Select Board")}
                        {step === 'CLASS' && (isCollege ? "Select Semester" : "Select Class")}
                        {step === 'CONTENT_MANAGER' && "Content Manager"}
                        {step === 'LANGUAGE' && "Select Language"}
                        {step === 'MCQ' && "Practice Mode"}
                        {step === 'SCORE_CARD' && "Session Results"}
                      </>
                    
                    {step !== 'STATE' && step !== 'SCORE_CARD' && (
                      <span className="hidden md:inline-flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mx-2"></span>
                        <span className="text-sm font-normal text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                           {getCategoryLabel(selectedCategory)}
                           {!isDirectFlow && selections.state && ` / ${selections.state}`}
                        </span>
                      </span>
                    )}
                  </h3>
                </div>
              </div>
              
                <button 
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-sm font-semibold hover:bg-indigo-100 transition-colors"
                >
                  <Share2 className="h-4 w-4" /> Share & Earn
                </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-8 overflow-y-auto bg-slate-50/50 rounded-b-3xl min-h-[400px]">
              
                {/* Steps: STATE, BOARD, CLASS - Same as before */}
                {step === 'STATE' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-left-4">
                    {INDIAN_STATES.map((state) => (
                    <button
                        key={state}
                        onClick={() => { 
                            setSelections(p => ({ ...p, state })); 
                            updateUserState(state); // Update User State Profile
                            setStep('BOARD'); 
                        }}
                        className="flex items-center p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-lg transition-all text-left group"
                    >
                        <MapPin className="h-5 w-5 text-blue-600 mr-3" />
                        <span className="text-sm font-semibold text-slate-700">{state}</span>
                        <ChevronRight className="h-4 w-4 ml-auto text-slate-300 group-hover:text-blue-500" />
                    </button>
                    ))}
                </div>
                )}

                {step === 'BOARD' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in fade-in slide-in-from-right-4">
                    {getCurrentInstitutions()?.map((item, idx) => (
                    <button
                        key={idx}
                        onClick={() => { setSelections(p => ({ ...p, board: item })); setStep('CLASS'); }}
                        className="flex items-center p-5 bg-white border border-slate-200 rounded-xl hover:border-indigo-400 hover:shadow-lg transition-all text-left"
                    >
                        <School className="h-6 w-6 text-indigo-600 mr-4" />
                        <span className="text-base font-bold text-slate-800">{item}</span>
                    </button>
                    ))}
                </div>
                )}

                {step === 'CLASS' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-in fade-in slide-in-from-right-4">
                    {(isSchool ? 
                        [...CLASSES_1_TO_10, ...CLASSES_11, ...CLASSES_12] 
                        : 
                        COLLEGE_SEMESTERS.concat(COLLEGE_YEARS)
                    ).map((cls, idx) => (
                    <button
                        key={idx}
                        onClick={() => { setSelections(p => ({ ...p, className: cls })); setStep('CONTENT_MANAGER'); }}
                        className="py-3 px-4 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium hover:border-blue-500 hover:text-blue-600 hover:shadow-md transition-all text-center"
                    >
                        {cls}
                    </button>
                    ))}
                </div>
                )}

                {/* STEP: CONTENT MANAGER (HYBRID) */}
                {step === 'CONTENT_MANAGER' && (
                <div className="animate-in fade-in slide-in-from-right-4 space-y-6">
                    
                    {/* SECTION 1: OFFICIAL SYLLABUS */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-indigo-600" />
                        Official Syllabus
                        <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full ml-auto">Pre-defined</span>
                        </h4>
                        <div className="space-y-2">
                        {getOfficialSubjects() && getOfficialSubjects().length > 0 ? getOfficialSubjects().map((sub, idx) => (
                            <div key={idx} className="border border-slate-100 rounded-xl overflow-hidden">
                            <div 
                                className="bg-slate-50 p-4 flex justify-between items-center cursor-pointer hover:bg-slate-100 transition-colors"
                                onClick={() => {
                                    if (hasChapters) {
                                    setExpandedSubject(expandedSubject === `OFFICIAL_${sub}` ? null : `OFFICIAL_${sub}`);
                                    } else {
                                    handleSubjectOnlyClick(sub);
                                    }
                                }}
                            >
                                <span className="font-semibold text-slate-800">{sub}</span>
                                {hasChapters ? (
                                    <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${expandedSubject === `OFFICIAL_${sub}` ? 'rotate-180' : ''}`} />
                                ) : (
                                    <ArrowLeft className="h-4 w-4 text-slate-400 rotate-180" />
                                )}
                            </div>
                            
                            {hasChapters && expandedSubject === `OFFICIAL_${sub}` && (
                                <div className="p-4 bg-white border-t border-slate-100">
                                    <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-3">Available Chapters</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {STANDARD_CHAPTERS.map((chap, cIdx) => (
                                        <div 
                                            key={cIdx}
                                            onClick={() => handleChapterClick(sub, chap)}
                                            className="p-3 border border-slate-100 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 cursor-pointer flex justify-between items-center group transition-all"
                                        >
                                            <span className="text-slate-700 font-medium text-sm">{chap}</span>
                                            <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-600" />
                                        </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            </div>
                        )) : (
                            <p className="text-slate-500 text-sm italic p-4 bg-slate-50 rounded-xl text-center">No official subjects listed for this selection.</p>
                        )}
                        </div>
                    </div>

                    {/* SECTION 2: CUSTOM CONTENT */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Layers className="h-5 w-5 text-emerald-600" />
                        My Custom Content
                        <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full ml-auto">User Added</span>
                        </h4>
                        
                        {!userSubjects || userSubjects.length === 0 ? (
                        <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-500 mb-6">
                            <p className="text-sm">You haven't added any custom subjects yet.</p>
                        </div>
                        ) : (
                        <div className="space-y-2 mb-6">
                            {userSubjects.map(sub => (
                                <div key={sub.id} className="border border-emerald-100 rounded-xl overflow-hidden">
                                <div 
                                    className="bg-emerald-50/50 p-4 flex justify-between items-center cursor-pointer hover:bg-emerald-50 transition-colors"
                                    onClick={() => {
                                        if (hasChapters) {
                                        setExpandedSubject(expandedSubject === sub.id ? null : sub.id);
                                        } else {
                                        handleSubjectOnlyClick(sub.name);
                                        }
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="font-semibold text-slate-800">{sub.name}</span>
                                        {hasChapters && <span className="text-xs bg-white border border-emerald-200 px-2 py-0.5 rounded-full text-emerald-600 font-medium">{sub.chapters.length} Chapters</span>}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={(e) => handleDeleteSubject(sub.id, e)} className="p-1 hover:bg-red-100 rounded text-slate-400 hover:text-red-500 transition-colors">
                                            <Trash className="h-4 w-4" />
                                        </button>
                                        {hasChapters ? (
                                        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${expandedSubject === sub.id ? 'rotate-180' : ''}`} />
                                        ) : (
                                        <ArrowLeft className="h-4 w-4 text-slate-400 rotate-180" />
                                        )}
                                    </div>
                                </div>
                                
                                {hasChapters && expandedSubject === sub.id && (
                                    <div className="p-4 bg-white border-t border-emerald-100">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {sub.chapters.length === 0 && <p className="text-slate-400 text-sm italic col-span-2">No chapters.</p>}
                                            {sub.chapters.map(chap => (
                                            <div 
                                                key={chap.id}
                                                onClick={() => handleChapterClick(sub.name, chap.name)}
                                                className="p-3 border border-slate-100 rounded-lg hover:border-emerald-400 hover:bg-emerald-50 cursor-pointer flex justify-between items-center group transition-all"
                                            >
                                                <span className="text-slate-700 font-medium text-sm">{chap.name}</span>
                                                <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-emerald-600" />
                                            </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                </div>
                            ))}
                        </div>
                        )}

                        {/* SECTION 3: ADD MANUAL FORM */}
                        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                        <h5 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                            <PlusCircle className="h-4 w-4" /> Add Manual Content
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className={`${hasChapters ? '' : 'md:col-span-2'}`}>
                                <label className="block text-xs font-semibold text-slate-500 mb-1">Subject Name</label>
                                <input 
                                type="text" 
                                value={newSubjectInput}
                                onChange={(e) => setNewSubjectInput(e.target.value)}
                                placeholder="e.g. Advanced Biology"
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                                />
                            </div>
                            {hasChapters && (
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1">Chapter Name</label>
                                <input 
                                    type="text" 
                                    value={newChapterInput}
                                    onChange={(e) => setNewChapterInput(e.target.value)}
                                    placeholder="e.g. Molecular Genetics"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                                />
                            </div>
                            )}
                        </div>
                        <button 
                            onClick={handleManualSave}
                            className="w-full sm:w-auto px-6 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 flex items-center justify-center gap-2 transition-colors"
                        >
                            <Save className="h-4 w-4" /> Save to My Content
                        </button>
                        </div>
                    </div>
                </div>
                )}

                {/* STEP: LANGUAGE */}
                {step === 'LANGUAGE' && (
                <div className="animate-in fade-in slide-in-from-right-4">
                    <p className="text-slate-600 text-sm mb-4">
                        Select language for: <span className="font-bold text-slate-800">{selectedSubject}</span>
                        {selectedChapter !== "Full Syllabus" && (
                        <span className="font-bold text-slate-800"> &gt; {selectedChapter}</span>
                        )}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {LANGUAGES.map((lang, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleLanguageSelect(lang.id)}
                            className="flex flex-col items-center justify-center p-5 bg-white border border-slate-200 rounded-xl hover:border-pink-500 hover:shadow-lg transition-all"
                        >
                            <span className="text-sm font-bold text-slate-900">{lang.native}</span>
                            <span className="text-xs text-slate-500">{lang.label}</span>
                        </button>
                        ))}
                    </div>
                </div>
                )}

                {/* STEP: MCQ */}
                {step === 'MCQ' && (
                <div className="animate-in fade-in slide-in-from-bottom-4">
                    {isLoadingMCQ ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">Generating Questions...</h3>
                        <p className="text-slate-500">
                        {selectedChapter === "Full Syllabus" 
                            ? `Creating practice set for ${selectedSubject}...` 
                            : `Creating practice set for ${selectedChapter}...`}
                        </p>
                    </div>
                    ) : mcqQuestions && mcqQuestions.length > 0 ? (
                    <div className="max-w-3xl mx-auto w-full">
                        <div className="w-full bg-slate-100 h-2 rounded-full mb-8 overflow-hidden">
                        <div 
                            className="bg-blue-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${((currentQuestionIndex + 1) / mcqQuestions.length) * 100}%` }}
                        />
                        </div>
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <span className="text-sm font-bold text-slate-400 uppercase mb-2 block">
                                    Question {currentQuestionIndex + 1} of {mcqQuestions.length}
                                </span>
                                <h2 className="text-xl md:text-2xl font-bold text-slate-900">{mcqQuestions[currentQuestionIndex].question}</h2>
                            </div>
                            <div className="bg-slate-100 px-3 py-1 rounded-full text-xs font-bold text-slate-600">
                                Score: {score}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        {mcqQuestions[currentQuestionIndex].options?.map((option, idx) => {
                            const isSelected = selectedOptionIndex === idx;
                            const isCorrect = option === mcqQuestions[currentQuestionIndex].correctAnswer;
                            const isWrong = isSelected && !isCorrect;
                            
                            let borderColor = 'border-slate-200 hover:border-blue-400';
                            let bgColor = 'bg-white';
                            
                            if (showExplanation) {
                            if (isCorrect) { 
                                // Always highlight correct answer in green when explanation is shown
                                borderColor = 'border-green-500'; 
                                bgColor = 'bg-green-50'; 
                            } 
                            else if (isWrong) { 
                                // Highlight wrong selection in red
                                borderColor = 'border-red-500'; 
                                bgColor = 'bg-red-50'; 
                            }
                            else { 
                                // Fade out other options
                                borderColor = 'opacity-50 border-slate-100'; 
                            }
                            }

                            return (
                            <button
                                key={idx}
                                onClick={() => handleOptionClick(idx)}
                                disabled={showExplanation}
                                className={`p-4 rounded-xl border-2 text-left transition-all flex items-start ${borderColor} ${bgColor}`}
                            >
                                <span className="inline-block w-6 h-6 rounded-full bg-white border border-current flex-shrink-0 mr-3 text-xs font-bold flex items-center justify-center">{String.fromCharCode(65 + idx)}</span>
                                <span className="font-medium text-slate-700">{option}</span>
                                {showExplanation && isCorrect && <CheckCircle className="h-5 w-5 text-green-600 ml-auto" />}
                                {showExplanation && isWrong && <XCircle className="h-5 w-5 text-red-600 ml-auto" />}
                            </button>
                            );
                        })}
                        </div>
                        {showExplanation && (
                        <div className="animate-in fade-in slide-in-from-bottom-2">
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6">
                                <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                                <Lightbulb className="h-4 w-4 text-amber-500" />
                                Detailed Analysis
                                </h4>
                                <p className="text-slate-600 text-sm leading-relaxed">{mcqQuestions[currentQuestionIndex].explanation}</p>
                            </div>
                            <div className="flex justify-end">
                                <button onClick={handleNextQuestion} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 flex items-center gap-2">
                                {currentQuestionIndex < mcqQuestions.length - 1 ? 'Next Question' : 'Finish Practice'} <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                        )}
                        
                        {/* AI DISCLAIMER */}
                        <div className="mt-12 pt-6 border-t border-slate-100 text-center">
                        <p className="text-xs text-slate-400 italic">
                            This platform is powered by Artificial Intelligence. While we strive for accuracy, AI systems can occasionally make errors. 'ExamReady' does not assume responsibility for any inaccuracies or outcomes based on the provided content. Users are advised to cross-reference information.
                        </p>
                        </div>
                    </div>
                    ) : (
                    <div className="text-center py-20 text-slate-500">
                        <p>No questions generated.</p>
                        <button onClick={handleBack} className="text-blue-600 hover:underline mt-2">Go Back</button>
                    </div>
                    )}
                </div>
                )}

                {/* STEP: SCORE CARD */}
                {step === 'SCORE_CARD' && (
                  <div className="animate-in zoom-in-50 fade-in duration-300 max-w-lg mx-auto text-center py-10">
                     {(() => {
                        const feedback = getScoreFeedback(mcqQuestions.length, score);
                        const FeedbackIcon = feedback.icon;
                        const percentage = Math.round((score / mcqQuestions.length) * 100);

                        return (
                          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl">
                             <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 ${feedback.bg}`}>
                                <FeedbackIcon className={`h-12 w-12 ${feedback.color}`} />
                             </div>
                             <h2 className="text-4xl font-extrabold text-slate-900 mb-2">{percentage}%</h2>
                             <h3 className={`text-2xl font-bold mb-6 ${feedback.color}`}>{feedback.label}</h3>
                             
                             <div className="bg-slate-50 rounded-xl p-4 mb-8">
                                <div className="flex justify-between items-center mb-2">
                                   <span className="text-slate-500 font-medium">Total Questions</span>
                                   <span className="text-slate-900 font-bold">{mcqQuestions.length}</span>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                   <span className="text-slate-500 font-medium">Correct Answers</span>
                                   <span className="text-slate-900 font-bold">{score}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                   <span className="text-slate-500 font-medium">Wrong Answers</span>
                                   <span className="text-slate-900 font-bold">{mcqQuestions.length - score}</span>
                                </div>
                             </div>

                             <button 
                               onClick={() => {
                                  resetMCQState();
                                  setStep('LANGUAGE'); // Or close modal, but usually people want to retry or change lang
                               }}
                               className="w-full py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors mb-3"
                             >
                               Practice Again
                             </button>
                             <button 
                               onClick={handleClose}
                               className="w-full py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                             >
                               Back to Categories
                             </button>
                          </div>
                        );
                     })()}
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};