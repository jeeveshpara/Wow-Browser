"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ShieldCheck, Loader2, ServerCrash, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import type { BlockAdsAndTrackersOutput } from '@/ai/flows/block-ads-and-trackers';
import { analyzeWebsiteAction } from '@/lib/actions';
import { Badge } from '../ui/badge';
import { useTranslations } from 'next-intl';

export function AdBlockerView() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<BlockAdsAndTrackersOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const t = useTranslations('AdBlockerView');

  const formSchema = z.object({
    url: z.string().url({ message: t('formUrlError') }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeWebsiteAction(values.url);

      if (result.success && result.data) {
        setAnalysisResult(result.data);
      } else {
        console.error('Website analysis returned error:', result.error);
        setError(result.error || 'An unknown error occurred.');
        toast({
          variant: 'destructive',
          title: t('toastErrorTitle'),
          description: result.error || t('toastErrorDescription'),
        });
      }
    } catch (err) {
      console.error('Unexpected error in AdBlockerView onSubmit:', err);
      setError('An unexpected error occurred while analyzing the website.');
      toast({
        variant: 'destructive',
        title: t('toastErrorTitle'),
        description: t('toastErrorDescription'),
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <header className="p-4 border-b">
        <h1 className="text-2xl font-headline flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-accent" />
          {t('title')}
        </h1>
        <p className="text-muted-foreground">
          {t('description')}
        </p>
      </header>
      <div className="flex-1 p-4 overflow-auto">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>{t('analyzeWebsite')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('formUrlLabel')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('formUrlPlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading ? t('buttonAnalyzing') : t('buttonAnalyze')}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {error && (
          <Card className="max-w-2xl mx-auto mt-4 border-destructive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <ServerCrash /> {t('errorTitle')}
              </CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
          </Card>
        )}

        {analysisResult && (
          <Card className="max-w-2xl mx-auto mt-4">
            <CardHeader>
              <CardTitle>{t('resultsTitle')}</CardTitle>
              <CardDescription>
                {t('resultsDescription', { adCount: analysisResult.blockedAds.length, trackerCount: analysisResult.blockedTrackers.length })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">{t('blockedAdsTitle', { count: analysisResult.blockedAds.length })}</h3>
                <ScrollArea className="h-32 rounded-md border p-2">
                  {analysisResult.blockedAds.length > 0 ? (
                     <ul className="space-y-1">
                      {analysisResult.blockedAds.map((ad, i) => <li key={i}><Badge variant="destructive">{ad}</Badge></li>)}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">{t('noAds')}</p>
                  )}
                </ScrollArea>
              </div>
               <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <KeyRound className="w-4 h-4" /> {t('blockedTrackersTitle', { count: analysisResult.blockedTrackers.length })}
                </h3>
                <ScrollArea className="h-32 rounded-md border p-2">
                   {analysisResult.blockedTrackers.length > 0 ? (
                    <ul className="space-y-1">
                      {analysisResult.blockedTrackers.map((tracker, i) => <li key={i}><Badge variant="secondary">{tracker}</Badge></li>)}
                    </ul>
                  ) : (
                     <p className="text-sm text-muted-foreground">{t('noTrackers')}</p>
                  )}
                </ScrollArea>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">{t('cleanHtmlTitle')}</h3>
                <ScrollArea className="h-64 rounded-md border p-2">
                  <pre className="text-xs font-code whitespace-pre-wrap">{analysisResult.cleanHtmlContent}</pre>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
