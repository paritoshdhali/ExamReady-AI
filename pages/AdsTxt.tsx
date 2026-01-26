import React, { useEffect, useState } from 'react';

export const AdsTxt: React.FC = () => {
  const [content, setContent] = useState('');

  useEffect(() => {
    const settings = JSON.parse(localStorage.getItem('site_settings') || '{}');
    setContent(settings.adsTxt || 'google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0');
  }, []);

  return (
    <pre style={{ 
      wordWrap: 'break-word', 
      whiteSpace: 'pre-wrap', 
      fontFamily: 'monospace',
      padding: '1rem',
      margin: 0,
      backgroundColor: '#fff',
      color: '#000',
      minHeight: '100vh'
    }}>
      {content}
    </pre>
  );
};