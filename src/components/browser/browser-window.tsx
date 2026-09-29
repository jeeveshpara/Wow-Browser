"use client";

import React, { useState, useCallback, useEffect } from 'react';
import {
  Plus, X, Lock, Star, RefreshCw, ArrowLeft, ArrowRight, Home, Bookmark, History, FileDown, Search, Loader2, Monitor, Languages, ExternalLink, ShieldAlert, Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Tab, Bookmark as BookmarkType, HistoryItem as HistoryItemType } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { SettingsView } from './settings-view';
import { Popover, PopoverContent, PopoverTrigger, PopoverAnchor } from '@/components/ui/popover';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { BookmarkManagerView } from './bookmark-manager-view';
import { HistoryView } from './history-view';
import { DownloadsView } from './downloads-view';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { HomepageView } from './homepage-view';
import { translateTextAction } from '@/lib/actions';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { AboutView } from './about-view';
import { ContactView } from './contact-view';
import { TermsView } from './terms-view';
import { AdBlockerView } from './ad-blocker-view';
import { IncognitoIcon } from '@/components/icons/incognito';
import { useIsMobile } from '@/hooks/use-mobile';

const MOCK_BOOKMARKS: BookmarkType[] = [
  { id: '1', url: 'https://google.com', title: 'Google' },
  { id: '2', url: 'https://github.com', title: 'GitHub' },
  { id: '3', url: 'https://vercel.com', title: 'Vercel' },
];

const SEARCH_ENGINES = {
  google: 'https://www.google.com/search?q=',
  duckduckgo: 'https://duckduckgo.com/?q=',
  brave: 'https://search.brave.com/search?q=',
};
type SearchEngine = keyof typeof SEARCH_ENGINES;

type ActiveView = 'browser' | 'bookmarks' | 'history' | 'downloads' | 'settings' | 'ad-blocker' | 'about' | 'contact' | 'terms';
const DEFAULT_HOME_URL = 'wow://newtab';

export function BrowserWindow() {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { toggleSidebar } = useSidebar();
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string>('');
  const [activeView, setActiveView] = useState<ActiveView>('browser');
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>(MOCK_BOOKMARKS);
  const [history, setHistory] = useState<HistoryItemType[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const t = useTranslations('BrowserWindow');
  const t_ui = useTranslations('BrowserWindow.UI');

  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<(BookmarkType | HistoryItemType)[]>([]);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [searchEngine, setSearchEngine] = useState<SearchEngine>('google');
  const [homeUrl, setHomeUrl] = useState(DEFAULT_HOME_URL);
  const [desktopMode, setDesktopMode] = useState(false);
  
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationResult, setTranslationResult] = useState<string | null>(null);
  const [targetLanguage, setTargetLanguage] = useState('French');
  const t_translate = useTranslations('BrowserWindow.TranslateView');

  const activeTab = tabs.find(t => t.id === activeTabId);

  useEffect(() => {
    try {
      const savedEngine = localStorage.getItem('searchEngine') as SearchEngine;
      if (savedEngine && SEARCH_ENGINES[savedEngine]) {
        setSearchEngine(savedEngine);
      }
      const savedHomepage = localStorage.getItem('homepage');
      const initialHome = savedHomepage || DEFAULT_HOME_URL;
      setHomeUrl(initialHome);
      
      const savedDesktopMode = localStorage.getItem('desktopMode') === 'true';
      setDesktopMode(savedDesktopMode);

      const newTab = { id: `tab-${Date.now()}`, url: initialHome, title: t('newTab'), history: [initialHome], historyIndex: 0, incognito: false };
      setTabs([newTab]);
      setActiveTabId(newTab.id);
    } catch (error) {
      console.error('Error initializing browser settings from localStorage:', error);
      const newTab = { id: `tab-${Date.now()}`, url: DEFAULT_HOME_URL, title: t('newTab'), history: [DEFAULT_HOME_URL], historyIndex: 0, incognito: false };
      setTabs([newTab]);
      setActiveTabId(newTab.id);
    }

    const handleStorageChange = () => {
      try {
        const savedEngine = localStorage.getItem('searchEngine') as SearchEngine;
        if (savedEngine && SEARCH_ENGINES[savedEngine]) {
          setSearchEngine(savedEngine);
        }
        const savedHomepage = localStorage.getItem('homepage');
        if (savedHomepage) {
            setHomeUrl(savedHomepage);
        }
        const savedDesktopMode = localStorage.getItem('desktopMode') === 'true';
        setDesktopMode(savedDesktopMode);
      } catch (error) {
        console.error('Error reading localStorage on storage event:', error);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [t]);

  useEffect(() => {
    if (activeTab) {
      setInputValue(activeTab.url === 'wow://newtab' ? '' : activeTab.url);
    }
  }, [activeTab]);

  const navigate = useCallback((url: string) => {
    if (!activeTab || !url) return;

    let newUrl = url.trim();

    if (newUrl !== 'wow://newtab' && !newUrl.startsWith('wow://')) {
      const isUrl = newUrl.includes('.') && !newUrl.includes(' ');
      const hasProtocol = newUrl.startsWith('http://') || newUrl.startsWith('https://');

      if (isUrl && !hasProtocol) {
        newUrl = 'https://' + newUrl;
      } else if (!isUrl) {
        newUrl = `${SEARCH_ENGINES[searchEngine]}${encodeURIComponent(newUrl)}`;
      }
    }
    
    if (!activeTab.incognito && newUrl !== 'wow://newtab') {
      const newHistoryItem: HistoryItemType = { id: `history-${Date.now()}`, url: newUrl, title: newUrl.split('/')[2]?.split('?')[0] || newUrl, timestamp: Date.now() };
      setHistory(prev => [newHistoryItem, ...prev]);
    }

    setTabs(tabs.map(t => {
      if (t.id === activeTabId) {
        const newTabHistory = t.history.slice(0, t.historyIndex + 1);
        newTabHistory.push(newUrl);
        return { ...t, url: newUrl, title: newUrl.split('/')[2]?.split('?')[0] || t('newTab'), history: newTabHistory, historyIndex: newTabHistory.length - 1 };
      }
      return t;
    }));
    setIsSuggestionsOpen(false);
  }, [activeTab, activeTabId, tabs, searchEngine, t]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (value.length > 0) {
      const allSuggestions = [...history, ...bookmarks];
      const filtered = allSuggestions.filter(item =>
        item.title.toLowerCase().includes(value.toLowerCase()) ||
        item.url.toLowerCase().includes(value.toLowerCase())
      );
      const uniqueUrls = new Set<string>();
      const uniqueSuggestions = filtered.filter(item => {
        if (!uniqueUrls.has(item.url)) {
            uniqueUrls.add(item.url);
            return true;
        }
        return false;
      });
      setSuggestions(uniqueSuggestions.slice(0, 5));
      setIsSuggestionsOpen(true);
    } else {
      setSuggestions([]);
      setIsSuggestionsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      navigate(e.currentTarget.value);
    }
  };

  const addTab = useCallback((options?: { incognito?: boolean }) => {
    const isIncognito = options?.incognito || false;
    const newTabUrl = isIncognito ? 'wow://newtab' : homeUrl;
    const newTab: Tab = {
      id: `tab-${Date.now()}`,
      url: newTabUrl,
      title: isIncognito ? t('incognitoTab') : (newTabUrl === 'wow://newtab' ? t('newTab') : newTabUrl.split('/')[2] || t('newTab')),
      history: [newTabUrl],
      historyIndex: 0,
      incognito: isIncognito,
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
    setActiveView('browser');
  }, [homeUrl, t]);

  const closeTab = useCallback((tabId: string) => {
    setTabs(prev => {
      const newTabs = prev.filter(t => t.id !== tabId);
      if (newTabs.length === 0) {
        const newTab: Tab = { id: `tab-${Date.now()}`, url: homeUrl, title: t('newTab'), history: [homeUrl], historyIndex: 0, incognito: false };
        setActiveTabId(newTab.id);
        setActiveView('browser');
        return [newTab];
      }
      if (activeTabId === tabId) {
        const currentTabIndex = prev.findIndex(t => t.id === tabId);
        setActiveTabId(newTabs[Math.max(0, currentTabIndex - 1)].id);
      }
      return newTabs;
    });
  }, [activeTabId, homeUrl, t]);

  const handleBack = () => {
    if (!activeTab || activeTab.historyIndex <= 0) return;
    const newHistoryIndex = activeTab.historyIndex - 1;
    const newUrl = activeTab.history[newHistoryIndex];
    setTabs(tabs.map(t => t.id === activeTabId ? { ...t, url: newUrl, historyIndex: newHistoryIndex } : t));
  };

  const handleForward = () => {
    if (!activeTab || activeTab.historyIndex >= activeTab.history.length - 1) return;
    const newHistoryIndex = activeTab.historyIndex + 1;
    const newUrl = activeTab.history[newHistoryIndex];
    setTabs(tabs.map(t => t.id === activeTabId ? { ...t, url: newUrl, historyIndex: newHistoryIndex } : t));
  };

  const handleRefresh = () => { setRefreshKey(key => key + 1); };
  const handleHome = () => { if (activeTab) navigate(homeUrl); };

  const addBookmark = () => {
    if (activeTab && activeTab.url !== 'wow://newtab') {
      if (bookmarks.some(b => b.url === activeTab.url)) {
        toast({ title: t('toastAlreadyBookmarkedTitle'), description: t('toastAlreadyBookmarkedDescription') });
        return;
      }
      const newBookmark: BookmarkType = { id: `bookmark-${Date.now()}`, url: activeTab.url, title: activeTab.title || activeTab.url };
      setBookmarks(prev => [newBookmark, ...prev]);
      toast({ title: t('toastBookmarkAddedTitle'), description: t('toastBookmarkAddedDescription', {title: activeTab.title || activeTab.url}) });
    }
  };

  const handleUpdateBookmark = (updatedBookmark: BookmarkType) => {
    setBookmarks(prev => prev.map(b => b.id === updatedBookmark.id ? updatedBookmark : b));
  };

  const handleRemoveBookmark = (bookmarkId: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== bookmarkId));
  };

  const handleRemoveHistoryItems = (idsToRemove: string[]) => {
    setHistory(prev => prev.filter(item => !idsToRemove.includes(item.id)));
    toast({ title: t('HistoryView.toastItemsRemoved', {count: idsToRemove.length}) });
  };

  const handleClearHistory = () => {
    setHistory([]);
    toast({ title: t('HistoryView.toastHistoryCleared'), description: t('HistoryView.toastHistoryClearedDescription') });
  };

  const getMostVisited = useCallback(() => {
    if (activeTab?.incognito) return [];

    const urlCounts: Record<string, number> = {};
    const siteData: Record<string, { title: string; url: string }> = {};

    history.forEach(item => {
        try {
            const url = new URL(item.url);
            if (url.protocol !== 'http:' && url.protocol !== 'https:') {
                return;
            }
            const domain = url.hostname.replace(/^www\./, '');
            urlCounts[domain] = (urlCounts[domain] || 0) + 1;
            if (!siteData[domain] || siteData[domain].title === domain) {
                siteData[domain] = { title: item.title, url: item.url };
            }
        } catch (e) {
            console.error('Error parsing URL in getMostVisited:', e);
        }
    });

    return Object.entries(urlCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 8)
        .map(([domain, count]) => ({
            id: domain,
            url: siteData[domain].url,
            title: siteData[domain].title || domain,
        }));
  }, [history, activeTab?.incognito]);

  const handleTranslate = async () => {
    if (!activeTab) return;
    setIsTranslating(true);
    setTranslationResult(null);

    const contentToTranslate = t_translate('mockContent');

    try {
      const result = await translateTextAction(contentToTranslate, targetLanguage);

      if (result.success && result.data) {
        setTranslationResult(result.data.translatedText);
      } else {
        console.error('Translation failed with error:', result.error);
        toast({
          variant: 'destructive',
          title: t_translate('errorTitle'),
          description: result.error || t_translate('errorDescription'),
        });
      }
    } catch (err) {
      console.error('Unexpected error in handleTranslate:', err);
      toast({
        variant: 'destructive',
        title: t_translate('errorTitle'),
        description: t_translate('errorDescription'),
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const isEmbeddable = (url: string) => {
    try {
      const hostname = new URL(url).hostname.toLowerCase();
      const blockers = ['google.com', 'youtube.com', 'facebook.com', 'instagram.com', 'linkedin.com', 'twitter.com', 'x.com', 'github.com', 'netflix.com'];
      return !blockers.some(b => hostname.includes(b));
    } catch (err) {
      console.error('Error evaluating isEmbeddable for URL:', url, err);
      return true;
    }
  };

  const renderActiveView = () => {
    const handleNavigateAndClose = (url: string) => {
      navigate(url);
      setActiveView('browser');
    };
    
    switch (activeView) {
      case 'browser':
        if (activeTab?.url === 'wow://newtab') {
          return <HomepageView onNavigate={navigate} mostVisited={getMostVisited()} />
        }
        
        if (activeTab) {
          const embeddable = isEmbeddable(activeTab.url);
          
          return (
            <div className="w-full h-full flex flex-col relative">
              {activeTab.incognito && (
                <div className="bg-card text-card-foreground p-2 text-center text-sm flex items-center justify-center gap-2 border-b">
                  <IncognitoIcon className="w-4 h-4" /> {t('incognitoWarning')}
                </div>
              )}
              
              {!embeddable && (
                <div className="absolute inset-0 bg-background/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6 sm:p-8 text-center space-y-4 sm:space-y-6">
                  <div className="bg-amber-100 dark:bg-amber-900/30 p-4 rounded-full">
                    <ShieldAlert className="w-10 h-10 sm:w-12 sm:h-12 text-amber-600" />
                  </div>
                  <div className="max-w-md space-y-2">
                    <h2 className="text-xl sm:text-2xl font-headline font-bold">{t_ui('connectionRestricted')}</h2>
                    <p className="text-sm sm:text-base text-muted-foreground">{t_ui('connectionRestrictedDesc')}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <Button
                      variant="default"
                      onClick={() => {
                        try {
                          window.open(activeTab.url, '_blank');
                        } catch (err) {
                          console.error('Error opening external URL:', err);
                        }
                      }}
                      className="gap-2 w-full sm:w-auto"
                    >
                      <ExternalLink className="w-4 h-4" /> {t_ui('openInNewTab')}
                    </Button>
                    <Button variant="outline" onClick={() => navigate(DEFAULT_HOME_URL)} className="w-full sm:w-auto">
                      {t_ui('backToHome')}
                    </Button>
                  </div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground italic max-w-sm">
                    {t_ui('prototypeNote')}
                  </p>
                </div>
              )}

              <iframe
                key={`${activeTab.id}-${refreshKey}`}
                src={activeTab.url}
                className={cn("w-full flex-1 border-0", !embeddable && "invisible")}
                title={activeTab.title}
                sandbox="allow-scripts allow-same-origin allow-forms"
              />
            </div>
          );
        }
        return <div className="w-full h-full flex items-center justify-center text-muted-foreground">No active tab</div>;
      case 'bookmarks': return (
        <BookmarkManagerView
          bookmarks={bookmarks}
          onUpdateBookmark={handleUpdateBookmark}
          onRemoveBookmark={handleRemoveBookmark}
          onNavigate={handleNavigateAndClose}
          onClose={() => setActiveView('browser')}
        />
      );
      case 'history': return (
        <HistoryView
            history={history}
            onClearHistory={handleClearHistory}
            onRemoveItems={handleRemoveHistoryItems}
            onNavigate={handleNavigateAndClose}
            onClose={() => setActiveView('browser')}
        />
      );
      case 'downloads': return <DownloadsView />;
      case 'settings': return <SettingsView onClearHistory={handleClearHistory} />;
      case 'ad-blocker': return <AdBlockerView />;
      case 'about': return <AboutView />;
      case 'contact': return <ContactView />;
      case 'terms': return <TermsView />;
      default: return null;
    }
  };

  const handleTabClick = (tabId: string) => {
    setActiveTabId(tabId);
    setActiveView('browser');
  }

  React.useEffect(() => {
    const handleViewChange = (event: Event) => {
      try {
        const customEvent = event as CustomEvent;
        if (customEvent.detail && customEvent.detail.view) {
          setActiveView(customEvent.detail.view);
        }
      } catch (err) {
        console.error('Error in setView event listener:', err);
      }
    };
    window.addEventListener('setView', handleViewChange);
    return () => window.removeEventListener('setView', handleViewChange);
  }, []);

  if (tabs.length === 0) {
    return (
        <div className="h-screen flex flex-col bg-background text-foreground rounded-xl shadow-2xl overflow-hidden">
            <div className="flex items-center bg-background/50 backdrop-blur-sm border-b border-border/50 h-[45px]"></div>
            <div className="flex items-center p-2 gap-2 bg-background/30 border-b h-[52px]"></div>
            <main className="flex-1 overflow-auto bg-background/80 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </main>
        </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background text-foreground shadow-2xl overflow-hidden md:rounded-xl">
      <div className="flex items-center bg-background/50 backdrop-blur-sm border-b border-border/50">
        <div className="flex-1 flex items-center overflow-x-auto no-scrollbar scroll-smooth">
          {tabs.map(tab => (
            <div
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 border-r cursor-pointer transition-colors duration-200 
                ${activeTabId === tab.id && activeView === 'browser' 
                  ? 'text-accent ' + (tab.incognito ? 'bg-primary/20' : 'bg-primary/10') 
                  : tab.incognito 
                    ? 'dark:bg-slate-800 bg-slate-200 hover:dark:bg-slate-700 hover:bg-slate-300' 
                    : 'hover:bg-primary/5'
                }`
              }
            >
              {tab.incognito ? <IncognitoIcon className={cn("h-[12px] w-[12px] sm:h-[14px] sm:w-[14px]", activeTabId === tab.id ? 'text-accent' : 'text-muted-foreground')} /> : <Lock size={isMobile ? 12 : 14} className={activeTabId === tab.id ? 'text-accent' : 'text-muted-foreground'} />}
              <span className="text-xs sm:text-sm whitespace-nowrap truncate max-w-[80px] sm:max-w-[120px]">{tab.title}</span>
              <Button variant="ghost" size="icon" className="w-5 h-5 sm:w-6 sm:h-6 ml-1 sm:ml-2" onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }}>
                <X size={isMobile ? 12 : 14} />
              </Button>
            </div>
          ))}
        </div>
        <div className="flex items-center pr-1">
          <Button variant="ghost" size="icon" onClick={() => addTab({ incognito: true })} className="w-8 h-8 sm:m-1" title={t('incognitoTab')}>
              <IncognitoIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => addTab()} className="w-8 h-8 sm:m-1" title={t('newTab')}><Plus size={isMobile ? 16 : 18} /></Button>
        </div>
      </div>

      <div className="flex items-center p-2 gap-1 sm:gap-2 bg-background/30 border-b">
        <Button variant="ghost" size="icon" onClick={() => toggleSidebar()} className="flex md:hidden h-8 w-8">
          <Menu size={18} />
        </Button>
        <div className="hidden md:flex items-center gap-1">
          <SidebarTrigger />
        </div>
        <div className="flex items-center gap-0.5 sm:gap-1">
          <Button variant="ghost" size="icon" onClick={handleBack} disabled={!activeTab || activeTab.historyIndex <= 0} className="w-8 h-8"><ArrowLeft size={18} /></Button>
          <Button variant="ghost" size="icon" onClick={handleForward} disabled={!activeTab || activeTab.historyIndex >= activeTab.history.length - 1} className="w-8 h-8 hidden sm:inline-flex"><ArrowRight size={18} /></Button>
          <Button variant="ghost" size="icon" onClick={handleRefresh} className="w-8 h-8"><RefreshCw size={18} /></Button>
          <Button variant="ghost" size="icon" onClick={handleHome} className="w-8 h-8 hidden sm:inline-flex"><Home size={18} /></Button>
        </div>
        <div className="flex-1">
            <Popover open={isSuggestionsOpen} onOpenChange={setIsSuggestionsOpen}>
                <PopoverAnchor>
                    <div className="relative flex items-center w-full">
                        {activeTab?.url.startsWith('https://') ?
                        <Lock size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-green-500" />
                        : <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        }
                        <Input
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        onFocus={() => inputValue.length > 0 && setIsSuggestionsOpen(true)}
                        className="w-full pl-8 pr-16 sm:pr-20 h-9 bg-primary/10 text-xs sm:text-sm"
                        placeholder={t('searchPlaceholder', {engine: searchEngine.charAt(0).toUpperCase() + searchEngine.slice(1)})}
                        />
                        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center">
                        {desktopMode && <Monitor size={14} className="text-accent mr-1 hidden sm:block" title={t('desktopModeActive')} />}
                        <Button variant="ghost" size="icon" className="w-7 h-7" onClick={addBookmark} disabled={activeTab?.url === 'wow://newtab'}>
                            <Star size={14} className={bookmarks.some(b => b.url === activeTab?.url) ? 'fill-amber-400 text-amber-400' : ''} />
                        </Button>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="ghost" size="icon" className="w-7 h-7">
                                    <Languages size={14} />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[calc(100vw-32px)] sm:w-80">
                                <div className="grid gap-4">
                                    <div className="space-y-2">
                                        <h4 className="font-medium leading-none">{t_translate('popoverTitle')}</h4>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="language-select">{t_translate('languageLabel')}</Label>
                                        <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                                            <SelectTrigger id="language-select" className="h-8">
                                                <SelectValue placeholder={t_translate('selectLanguagePlaceholder')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="English">{t_translate('locale.en')}</SelectItem>
                                                <SelectItem value="French">{t_translate('locale.fr')}</SelectItem>
                                                <SelectItem value="Hindi">{t_translate('locale.hi')}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Button onClick={handleTranslate} disabled={isTranslating} className="mt-2 h-8 text-xs">
                                            {isTranslating && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                                            {isTranslating ? t_translate('buttonTranslating') : t_translate('buttonTranslate')}
                                        </Button>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                        </div>
                    </div>
                </PopoverAnchor>
                <PopoverContent className="w-[var(--radix-popover-anchor-width)] p-0" onOpenAutoFocus={(e) => e.preventDefault()}>
                    <ul className="space-y-1 py-1">
                    {suggestions.map(item => (
                        <li key={item.id}
                        onClick={() => {
                            setInputValue(item.url);
                            navigate(item.url);
                        }}
                        className="px-4 py-2 text-xs sm:text-sm hover:bg-accent cursor-pointer flex items-center gap-2">
                        {'timestamp' in item ? <History size={12} /> : <Bookmark size={12} />}
                        <span className="truncate">{item.title} <span className="text-muted-foreground truncate hidden sm:inline">- {item.url}</span></span>
                        </li>
                    ))}
                    </ul>
                </PopoverContent>
            </Popover>
        </div>
      </div>

      <main className="flex-1 overflow-auto bg-background/80">
        {renderActiveView()}
      </main>

      <Dialog open={!!translationResult} onOpenChange={(isOpen) => !isOpen && setTranslationResult(null)}>
        <DialogContent className="w-[95vw] sm:max-w-lg rounded-xl">
            <DialogHeader>
                <DialogTitle>{t_translate('dialogTitle')}</DialogTitle>
            </DialogHeader>
            <div className="py-4">
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{translationResult}</p>
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}