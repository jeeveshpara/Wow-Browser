'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Critical Global Error:', error);
  }, [error]);

  return (
    <html>
      <body className="flex h-screen w-full flex-col items-center justify-center p-6 bg-slate-900 text-white text-center font-sans">
        <h2 className="text-2xl font-bold mb-4">Application Error</h2>
        <p className="text-sm text-slate-400 mb-6 max-w-md">
          {error.message || 'A critical error occurred.'}
        </p>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
