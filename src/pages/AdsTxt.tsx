import React, { useEffect, useState } from 'react';

export const AdsTxt: React.FC = () => {
  const [content, setContent] = useState('');
  useEffect(() => {
    const settings = JSON.parse(localStorage.getItem('site_settings') || '{}');
    setContent(settings.adsTxt || 'google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0');
  }, []);
  return <pre className="p-4 bg-white min-h-screen font-mono">{content}</pre>;
};