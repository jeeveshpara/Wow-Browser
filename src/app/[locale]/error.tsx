'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log all application runtime errors to console.error
    console.error('Application Error captured by Root ErrorBoundary:', error);
  }, [error]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center p-6 bg-background text-foreground text-center">
      <div className="rounded-full bg-destructive/10 p-4 mb-4">
        <AlertTriangle className="h-10 w-10 text-destructive" />
      </div>
      <h2 className="text-2xl font-bold font-headline mb-2">Something went wrong</h2>
      <p className="text-sm text-muted-foreground max-w-md mb-6">
        {error.message || 'An unexpected error occurred while running the browser window.'}
      </p>
      <Button onClick={() => reset()} className="gap-2">
        <RefreshCw className="h-4 w-4" /> Try again
      </Button>
    </div>
  );
}
