import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import '../globals.css';

export const metadata: Metadata = {
  title: 'Wow Browser',
  description: 'A privacy-focused web browser built with Next.js featuring ad blocking, bookmarks, and private browsing.',
  openGraph: {
    title: 'Wow Browser',
    description: 'A privacy-focused web browser built with Next.js featuring ad blocking, bookmarks, and private browsing.',
  },
};

export default async function LocaleLayout({
  children,
  params: {locale},
}: {
  children: React.ReactNode;
  params: {locale: string};
}) {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
        <Toaster />
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
