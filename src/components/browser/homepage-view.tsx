"use client";

import { Star, History } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface HomepageViewProps {
  onNavigate: (url: string) => void;
  mostVisited: { id: string; url: string; title: string }[];
}

const POPULAR_SITES = [
  { title: 'Google', url: 'https://google.com' },
  { title: 'YouTube', url: 'https://youtube.com' },
  { title: 'Facebook', url: 'https://facebook.com' },
  { title: 'X (Twitter)', url: 'https://x.com' },
  { title: 'Instagram', url: 'https://instagram.com' },
  { title: 'LinkedIn', url: 'https://linkedin.com' },
  { title: 'Reddit', url: 'https://reddit.com' },
  { title: 'Wikipedia', url: 'https://wikipedia.org' },
];

export function HomepageView({ onNavigate, mostVisited }: HomepageViewProps) {
  const t = useTranslations('HomepageView');

  const SiteShortcut = ({ title, url }: { title: string; url: string; }) => (
    <div
      className="flex flex-col items-center justify-center gap-1.5 sm:gap-2 p-2 rounded-lg hover:bg-accent/20 cursor-pointer transition-colors"
      onClick={() => onNavigate(url)}
      title={title}
    >
      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-card rounded-lg flex items-center justify-center shadow-sm border overflow-hidden">
        <Image 
            src={`https://www.google.com/s2/favicons?sz=64&domain_url=${url}`} 
            alt={`${title} favicon`}
            width={32}
            height={32}
            className="rounded-sm w-6 h-6 sm:w-8 sm:h-8"
            unoptimized
        />
      </div>
      <span className="text-[10px] sm:text-xs font-medium truncate w-16 sm:w-20 text-center">{title}</span>
    </div>
  );

  return (
    <div className="flex flex-col items-center h-full p-4 sm:p-8 bg-background overflow-auto">
      <div className="w-full max-w-3xl space-y-8 sm:space-y-12 mt-8 sm:mt-16">
        <section>
          <h2 className="text-base sm:text-lg font-headline mb-4 flex items-center gap-2 text-muted-foreground">
            <Star className="w-4 h-4 sm:w-5 sm:h-5" /> {t('popularWebsites')}
          </h2>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 sm:gap-4">
            {POPULAR_SITES.map(site => <SiteShortcut key={site.url} {...site} />)}
          </div>
        </section>

        {mostVisited.length > 0 && (
          <section>
            <h2 className="text-base sm:text-lg font-headline mb-4 flex items-center gap-2 text-muted-foreground">
              <History className="w-4 h-4 sm:w-5 sm:h-5" /> {t('mostVisited')}
            </h2>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 sm:gap-4">
              {mostVisited.map(site => <SiteShortcut key={site.id} {...site} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}