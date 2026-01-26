import React from 'react';

export const PrivacyPolicy: React.FC = () => (
  <div className="pt-24 pb-12 max-w-4xl mx-auto px-4">
    <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
    <p>Last updated: {new Date().toLocaleDateString()}</p>
    <p>At ExamReady, we take your privacy seriously...</p>
  </div>
);

export const Terms: React.FC = () => (
  <div className="pt-24 pb-12 max-w-4xl mx-auto px-4">
    <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>
    <p>Refund Policy: This ₹15 fee is for AI maintenance costs. Strictly non-refundable.</p>
  </div>
);

export const RefundPolicy: React.FC = () => (
  <div className="pt-24 pb-12 max-w-4xl mx-auto px-4">
    <h1 className="text-3xl font-bold mb-6">Refund Policy</h1>
    <div className="bg-slate-50 p-6 rounded-xl border">
      Refund Policy: This ₹15 fee is for AI maintenance costs. Once paid, the amount is strictly non-refundable.
    </div>
  </div>
);

export const About: React.FC = () => (
  <div className="pt-24 pb-12 max-w-4xl mx-auto px-4 text-center">
    <h1 className="text-3xl font-bold mb-4">About ExamReady</h1>
    <p className="text-lg text-slate-700">Democratizing education with AI-powered tools.</p>
  </div>
);

export const Contact: React.FC = () => (
  <div className="pt-24 pb-12 max-w-4xl mx-auto px-4">
    <h1 className="text-3xl font-bold mb-8">Contact Us</h1>
    <p>Email: support@examready.com</p>
  </div>
);