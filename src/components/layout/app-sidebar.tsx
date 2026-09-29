"use client";

import {
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/icons/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { Home, Bookmark, History, FileDown, Settings, Info, Mail, FileText } from 'lucide-react';
import React from 'react';
import { useTranslations } from 'next-intl';

export function AppSidebar() {
  const setView = (view: string) => {
    try {
      window.dispatchEvent(new CustomEvent('setView', { detail: { view } }));
    } catch (err) {
      console.error('Error dispatching setView custom event:', err);
    }
  };
  
  const [activeItem, setActiveItem] = React.useState('browser');
  const t = useTranslations('AppSidebar');

  const handleMenuClick = (view: string) => {
    setActiveItem(view);
    setView(view);
  }

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Logo className="w-8 h-8 text-accent" />
          <span className="text-lg font-headline font-semibold group-data-[collapsible=icon]:hidden">
            {t('browserName')}
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => handleMenuClick('browser')} isActive={activeItem === 'browser'} tooltip={t('browser')}>
              <Home />
              <span>{t('browser')}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => handleMenuClick('bookmarks')} isActive={activeItem === 'bookmarks'} tooltip={t('bookmarks')}>
              <Bookmark />
              <span>{t('bookmarks')}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => handleMenuClick('history')} isActive={activeItem === 'history'} tooltip={t('history')}>
              <History />
              <span>{t('history')}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => handleMenuClick('downloads')} isActive={activeItem === 'downloads'} tooltip={t('downloads')}>
              <FileDown />
              <span>{t('downloads')}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => handleMenuClick('settings')} isActive={activeItem === 'settings'} tooltip={t('settings')}>
              <Settings />
              <span>{t('settings')}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarSeparator className="my-1" />
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => handleMenuClick('about')} isActive={activeItem === 'about'} tooltip={t('about')}>
              <Info />
              <span>{t('about')}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <SidebarMenuButton onClick={() => handleMenuClick('contact')} isActive={activeItem === 'contact'} tooltip={t('contact')}>
              <Mail />
              <span>{t('contact')}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <SidebarMenuButton onClick={() => handleMenuClick('terms')} isActive={activeItem === 'terms'} tooltip={t('terms')}>
              <FileText />
              <span>{t('terms')}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="group-data-[collapsible=icon]:justify-center">
        <ThemeToggle />
      </SidebarFooter>
    </>
  );
}
