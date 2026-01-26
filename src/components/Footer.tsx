import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <span className="font-bold text-xl text-slate-900 tracking-tight">ExamReady</span>
            <p className="text-slate-500 text-sm mt-4 leading-relaxed max-w-sm">
              Empowering students with AI-driven practice tests and personalized learning paths. Master your exams with confidence.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link to="/about" className="hover:text-primary-600 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-primary-600 transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link to="/privacy" className="hover:text-primary-600 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-primary-600 transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/refund-policy" className="hover:text-primary-600 transition-colors">Refund Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-200 pt-8 mt-8">
          <p className="text-xs text-slate-400 mb-4 text-justify">
            Disclaimer: This platform is powered by Artificial Intelligence. While we strive for accuracy, AI systems can occasionally make errors. 'ExamReady' does not assume responsibility for any inaccuracies or outcomes based on the provided content. Users are advised to cross-reference information.
          </p>
          <div className="flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
            <p>&copy; {new Date().getFullYear()} ExamReady. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};