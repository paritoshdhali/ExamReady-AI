import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Hexagon } from 'lucide-react';
import { NavItem } from '../types';
import { Button } from './Button';

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'Practice', path: '/practice' },
  { label: 'Leaderboard', path: '/leaderboard' },
  { label: 'Prime', path: '/prime' },
  { label: 'Login / Signup', path: '/auth', isButton: true },
];

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Handle scroll effect for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || isOpen ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Top-Left: Logo */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
            <NavLink to="/" className="flex items-center gap-2 group">
              <div className="bg-primary-600 p-1.5 rounded-lg group-hover:bg-primary-700 transition-colors">
                <Hexagon className="h-6 w-6 text-white" fill="currentColor" fillOpacity={0.2} />
              </div>
              <span className={`font-bold text-2xl tracking-tighter transition-colors ${scrolled || isOpen ? 'text-slate-900' : 'text-slate-900'}`}>
                ExamReady
              </span>
            </NavLink>
          </div>

          {/* Top-Right: Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {NAV_ITEMS.map((item) => (
              item.isButton ? (
                <NavLink key={item.path} to={item.path}>
                  <Button variant="primary">
                    {item.label}
                  </Button>
                </NavLink>
              ) : (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `
                    text-sm font-medium transition-colors hover:text-primary-600
                    ${isActive ? 'text-primary-600 font-semibold' : 'text-slate-600'}
                  `}
                >
                  {item.label}
                </NavLink>
              )
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div 
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-screen opacity-100 border-b border-slate-200 bg-white' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pt-2 pb-6 space-y-2">
          {NAV_ITEMS.map((item) => (
            item.isButton ? (
              <div key={item.path} className="pt-2">
                 <NavLink to={item.path} className="w-full">
                  <Button variant="primary" fullWidth>
                    {item.label}
                  </Button>
                </NavLink>
              </div>
            ) : (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  block px-3 py-3 rounded-md text-base font-medium transition-colors
                  ${isActive 
                    ? 'bg-primary-50 text-primary-700' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}
                `}
              >
                {item.label}
              </NavLink>
            )
          ))}
        </div>
      </div>
    </nav>
  );
};