import React from 'react';

export const PrivacyPolicy: React.FC = () => (
  <div className="pt-24 pb-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <h1 className="text-3xl font-bold text-slate-900 mb-6">Privacy Policy</h1>
    <div className="prose prose-slate max-w-none text-slate-600 space-y-4">
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      <p>At ExamReady, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclosure, and safeguard your information when you visit our website.</p>
      <h3 className="text-xl font-semibold text-slate-800 mt-6">Information We Collect</h3>
      <p>We may collect information about you in a variety of ways. The information we may collect on the Site includes:</p>
      <ul className="list-disc pl-5 space-y-2">
        <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information, such as your age, gender, hometown, and interests, that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site.</li>
        <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.</li>
      </ul>
      <h3 className="text-xl font-semibold text-slate-800 mt-6">Use of Your Information</h3>
      <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. We may use information collected about you via the Site to:</p>
      <ul className="list-disc pl-5 space-y-2">
        <li>Create and manage your account.</li>
        <li>Email you regarding your account or order.</li>
        <li>Fulfill and manage purchases, orders, payments, and other transactions related to the Site.</li>
        <li>Generate a personal profile about you to make future visits to the Site more personalized.</li>
      </ul>
    </div>
  </div>
);

export const Terms: React.FC = () => (
  <div className="pt-24 pb-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <h1 className="text-3xl font-bold text-slate-900 mb-6">Terms & Conditions</h1>
    <div className="prose prose-slate max-w-none text-slate-600 space-y-4">
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      <p>Please read these Terms and Conditions ("Terms", "Terms and Conditions") carefully before using the ExamReady website operated by us.</p>
      <h3 className="text-xl font-semibold text-slate-800 mt-6">Conditions of Use</h3>
      <p>By using this website, you certify that you have read and reviewed this Agreement and that you agree to comply with its terms. If you do not want to be bound by the terms of this Agreement, you are advised to leave the website accordingly. ExamReady only grants use and access of this website, its products, and its services to those who have accepted its terms.</p>
      <h3 className="text-xl font-semibold text-slate-800 mt-6">Intellectual Property</h3>
      <p>You agree that all materials, products, and services provided on this website are the property of ExamReady, its affiliates, directors, officers, employees, agents, suppliers, or licensors including all copyrights, trade secrets, trademarks, patents, and other intellectual property. You also agree that you will not reproduce or redistribute the ExamReady’s intellectual property in any way, including electronic, digital, or new trademark registrations.</p>
      <h3 className="text-xl font-semibold text-slate-800 mt-6">User Accounts</h3>
      <p>As a user of this website, you may be asked to register with us and provide private information. You are responsible for ensuring the accuracy of this information, and you are responsible for maintaining the safety and security of your identifying information. You are also responsible for all activities that occur under your account or password.</p>
      
      <h3 className="text-xl font-semibold text-slate-800 mt-6">Refund Policy</h3>
      <p>This ₹15 fee is for AI maintenance costs. We show ads and also charge this small fee for our service. If you find our service useful, please proceed; otherwise, do not pay. We reserve the right to increase the price in the future. Once paid, the amount is strictly non-refundable. Please review everything before making a payment.</p>
    </div>
  </div>
);

export const RefundPolicy: React.FC = () => (
  <div className="pt-24 pb-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <h1 className="text-3xl font-bold text-slate-900 mb-6">Refund Policy</h1>
    <div className="prose prose-slate max-w-none text-slate-600 space-y-4">
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
        <p className="font-medium text-slate-800">
          Refund Policy: This ₹15 fee is for AI maintenance costs. We show ads and also charge this small fee for our service. If you find our service useful, please proceed; otherwise, do not pay. We reserve the right to increase the price in the future. Once paid, the amount is strictly non-refundable. Please review everything before making a payment.
        </p>
      </div>
    </div>
  </div>
);

export const About: React.FC = () => (
  <div className="pt-24 pb-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="bg-primary-50 rounded-2xl p-8 mb-8 text-center">
      <h1 className="text-3xl font-bold text-slate-900 mb-4">About ExamReady</h1>
      <p className="text-lg text-slate-700 max-w-2xl mx-auto">
        Our mission is to democratize education by providing high-quality, AI-powered practice tools for students across all disciplines.
      </p>
    </div>
    <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
      <p>
        ExamReady was founded with a simple goal: to make exam preparation smarter, more accessible, and more effective. We believe that every student deserves access to personalized learning resources that adapt to their needs.
      </p>
      <p>
        Leveraging cutting-edge Artificial Intelligence, we generate dynamic practice questions tailored to various competitive exams, school boards, and university curriculums. Whether you are preparing for JEE, NEET, UPSC, or your school finals, ExamReady is here to support your journey.
      </p>
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mt-8">
        <h4 className="font-bold text-amber-800 mb-2">AI Disclaimer</h4>
        <p className="text-sm text-amber-700">
          This platform is powered by Artificial Intelligence. While we strive for accuracy, AI systems can occasionally make errors. 'ExamReady' does not assume responsibility for any inaccuracies or outcomes based on the provided content. Users are advised to cross-reference information.
        </p>
      </div>
    </div>
  </div>
);

export const Contact: React.FC = () => (
  <div className="pt-24 pb-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <h1 className="text-3xl font-bold text-slate-900 mb-8">Contact Us</h1>
    <div className="grid md:grid-cols-2 gap-12">
      <div>
        <p className="text-slate-600 mb-6">
          Have questions, suggestions, or need support? We'd love to hear from you. Fill out the form or reach out to us directly.
        </p>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
             <div className="font-semibold text-slate-900">Email:</div>
             <div className="text-primary-600">support@examready.com</div>
          </div>
          <div className="flex items-start gap-3">
             <div className="font-semibold text-slate-900">Address:</div>
             <div className="text-slate-600">123 Education Lane, Tech City, India</div>
          </div>
        </div>
      </div>
      <form className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
          <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Your Name" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input type="email" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" placeholder="you@example.com" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
          <textarea rows={4} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" placeholder="How can we help?" />
        </div>
        <button className="w-full bg-primary-600 text-white py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors">Send Message</button>
      </form>
    </div>
  </div>
);