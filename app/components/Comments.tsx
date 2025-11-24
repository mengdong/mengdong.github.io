'use client';

import { ReactCusdis } from 'react-cusdis';
import { useEffect, useState } from 'react';

export default function Comments() {
  // Force re-render when theme changes to update Cusdis iframe
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Check if user prefers dark mode
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setTheme(mediaQuery.matches ? 'dark' : 'light');

    const handler = (e: MediaQueryListEvent) => setTheme(e.matches ? 'dark' : 'light');
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return (
    <div className="mt-10 pt-10 border-t border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">Comments</h2>
      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
        <ReactCusdis
          attrs={{
            host: 'https://cusdis.com',
            appId: '14383b51-a347-4a9a-9ad1-bcc3ed40d2b3',
            pageId: typeof window !== 'undefined' ? window.location.pathname : '',
            pageTitle: typeof document !== 'undefined' ? document.title : '',
            pageUrl: typeof window !== 'undefined' ? window.location.href : '',
            theme: theme
          }}
        />
      </div>
    </div>
  );
}
