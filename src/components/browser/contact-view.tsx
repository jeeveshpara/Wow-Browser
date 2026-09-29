"use client";

import { Mail } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function ContactView() {
  const t = useTranslations('ContactView');

  return (
    <div className="flex flex-col h-full">
      <header className="p-4 border-b">
        <h1 className="text-2xl font-headline flex items-center gap-2">
          <Mail className="w-6 h-6 text-accent" />
          {t('title')}
        </h1>
        <p className="text-muted-foreground">{t('description')}</p>
      </header>
      <div className="flex-1 p-4 overflow-auto">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>{t('cardTitle')}</CardTitle>
            <CardDescription>{t('cardDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              {t('emailLabel')}{' '}
              <a href={`mailto:${t('emailAddress')}`} className="text-accent hover:underline">
                {t('emailAddress')}
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
