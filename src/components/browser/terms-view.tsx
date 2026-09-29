"use client";

import { FileText } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function TermsView() {
  const t = useTranslations('TermsView');

  return (
    <div className="flex flex-col h-full">
      <header className="p-4 border-b">
        <h1 className="text-2xl font-headline flex items-center gap-2">
          <FileText className="w-6 h-6 text-accent" />
          {t('title')}
        </h1>
        <p className="text-muted-foreground">{t('description')}</p>
      </header>
      <div className="flex-1 p-4 overflow-auto">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>{t('cardTitle')}</CardTitle>
            <CardDescription>{t('lastUpdated')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <h2 className="font-semibold text-lg">1. {t('section1Title')}</h2>
            <p className="text-muted-foreground">{t('section1Content')}</p>
            <h2 className="font-semibold text-lg mt-4">2. {t('section2Title')}</h2>
            <p className="text-muted-foreground">{t('section2Content')}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
