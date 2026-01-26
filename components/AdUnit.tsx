import React, { useEffect, useState } from 'react';

interface AdUnitProps {
  placement: 'top' | 'sidebar' | 'bottom' | 'chat';
  className?: string;
}

export const AdUnit: React.FC<AdUnitProps> = ({ placement, className = '' }) => {
  const [adCode, setAdCode] = useState('');

  useEffect(() => {
    try {
      const ads = JSON.parse(localStorage.getItem('site_ads') || '{}');
      if (ads && ads[placement]) {
        setAdCode(ads[placement]);
      }
    } catch (e) {
      console.error('Failed to load ads configuration', e);
    }
  }, [placement]);

  if (!adCode) return null;

  return (
    <div className={`w-full flex justify-center items-center my-6 overflow-hidden ${className}`}>
      {/* 
        Rendering raw HTML from admin. 
        Note: Script tags injected via innerHTML do not execute in React by default. 
        For standard Image/Iframe ads, this works. For AdSense, the script must be loaded in index.html head.
      */}
      <div 
        className="max-w-full"
        dangerouslySetInnerHTML={{ __html: adCode }} 
      />
    </div>
  );
};