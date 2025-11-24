'use client';

import { ReactCusdis } from 'react-cusdis';

export default function Comments() {
  return (
    <div className="mt-10 pt-10 border-t border-gray-200 dark:border-gray-800">
      <h2 className="text-2xl font-bold mb-8">Comments</h2>
      <ReactCusdis
        attrs={{
          host: 'https://cusdis.com',
          appId: '14383b51-a347-4a9a-9ad1-bcc3ed40d2b3', // TODO: Create a free account at https://cusdis.com to get your appId
          pageId: typeof window !== 'undefined' ? window.location.pathname : '',
          pageTitle: typeof document !== 'undefined' ? document.title : '',
          pageUrl: typeof window !== 'undefined' ? window.location.href : '',
          theme: 'auto'
        }}
      />
    </div>
  );
}
