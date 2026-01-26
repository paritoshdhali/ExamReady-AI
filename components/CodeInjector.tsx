import React, { useEffect, useRef } from 'react';

export const CodeInjector: React.FC = () => {
  const injectedRef = useRef(false);

  useEffect(() => {
    if (injectedRef.current) return;
    injectedRef.current = true;

    try {
      const settings = JSON.parse(localStorage.getItem('site_settings') || '{}');

      // 1. Google Analytics Injection
      if (settings.gaId) {
        const scriptId = 'ga-script-src';
        if (!document.getElementById(scriptId)) {
          const script1 = document.createElement('script');
          script1.id = scriptId;
          script1.async = true;
          script1.src = `https://www.googletagmanager.com/gtag/js?id=${settings.gaId}`;
          document.head.appendChild(script1);

          const script2 = document.createElement('script');
          script2.id = 'ga-script-config';
          script2.innerHTML = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${settings.gaId}');
          `;
          document.head.appendChild(script2);
        }
      }

      // 2. Custom Header Code Injection
      if (settings.headerCode) {
        // We use createContextualFragment to ensure scripts execute
        const range = document.createRange();
        range.selectNode(document.head);
        const fragment = range.createContextualFragment(settings.headerCode);
        document.head.appendChild(fragment);
      }

      // 3. Custom Body Code Injection
      if (settings.bodyCode) {
        const range = document.createRange();
        range.selectNode(document.body);
        const fragment = range.createContextualFragment(settings.bodyCode);
        document.body.appendChild(fragment);
      }

    } catch (e) {
      console.error("Failed to inject custom site codes", e);
    }
  }, []);

  return null;
};