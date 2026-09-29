"use client";

import { Info } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function AboutView() {
  const t = useTranslations('AboutView');

  return (
    <div className="flex flex-col h-full">
      <header className="p-4 border-b">
        <h1 className="text-2xl font-headline flex items-center gap-2">
          <Info className="w-6 h-6 text-accent" />
          {t('title')}
        </h1>
        <p className="text-muted-foreground">{t('description')}</p>
      </header>
      <div className="flex-1 p-4 overflow-auto">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>{t('cardTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('version')}</span>
              <span>1.0.0 (Alpha)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('builtWith')}</span>
              <span>Next.js & Firebase</span>
            </div>
            <p className="text-muted-foreground pt-4">{t('aboutText')}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
