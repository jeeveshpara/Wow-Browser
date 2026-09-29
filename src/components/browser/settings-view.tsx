"use client";

import { useTheme } from "next-themes";
import { SlidersHorizontal, Trash2, Search, Palette, Home, Info, ShieldAlert, Languages, Laptop, AppWindow, ShieldQuestion, Camera, Mic, MapPin, Server } from "lucide-react";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "../locale-switcher";

interface SettingsViewProps {
  onClearHistory: () => void;
}

const DEFAULT_HOME_URL = 'wow://newtab';

export function SettingsView({ onClearHistory }: SettingsViewProps) {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const t = useTranslations('SettingsView');
  const [searchEngine, setSearchEngine] = useState("google");
  const [homepage, setHomepage] = useState("");
  const [desktopMode, setDesktopMode] = useState(false);
  const [vpnEnabled, setVpnEnabled] = useState(false);
  const [proxyEnabled, setProxyEnabled] = useState(false);
  const [proxyAddress, setProxyAddress] = useState("");

  useEffect(() => {
    try {
      const savedEngine = localStorage.getItem("searchEngine");
      if (savedEngine && ["google", "duckduckgo", "brave"].includes(savedEngine)) {
        setSearchEngine(savedEngine);
      }
      const savedHomepage = localStorage.getItem("homepage");
      setHomepage(savedHomepage || DEFAULT_HOME_URL);
      
      const savedDesktopMode = localStorage.getItem("desktopMode") === 'true';
      setDesktopMode(savedDesktopMode);
      
      const savedVpnEnabled = localStorage.getItem("vpnEnabled") === 'true';
      setVpnEnabled(savedVpnEnabled);
      
      const savedProxyEnabled = localStorage.getItem("proxyEnabled") === 'true';
      setProxyEnabled(savedProxyEnabled);
      const savedProxyAddress = localStorage.getItem("proxyAddress");
      setProxyAddress(savedProxyAddress || "");
    } catch (err) {
      console.error("Error loading settings from localStorage:", err);
    }
  }, []);

  const handleSearchEngineChange = (engine: string) => {
    setSearchEngine(engine);
    try {
      localStorage.setItem("searchEngine", engine);
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error("Error saving searchEngine to localStorage:", err);
    }
    toast({
      title: t('toastSearchUpdated'),
      description: t('toastSearchUpdatedDescription', { engine: engine.charAt(0).toUpperCase() + engine.slice(1) }),
    });
  };

  const handleHomepageSave = () => {
    const valueToSave = homepage.trim() === '' ? DEFAULT_HOME_URL : homepage;
    try {
      localStorage.setItem("homepage", valueToSave);
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error("Error saving homepage to localStorage:", err);
    }
    toast({
        title: t('toastHomepageUpdated'),
        description: t('toastHomepageUpdatedDescription'),
    });
  };

  const handleClearData = () => {
    try {
      onClearHistory();
      toast({
        title: t('toastDataCleared'),
        description: t('toastDataClearedDescription'),
      });
    } catch (err) {
      console.error("Error clearing browser data:", err);
    }
  };
  
  const handleDesktopModeChange = (checked: boolean) => {
    setDesktopMode(checked);
    try {
      localStorage.setItem("desktopMode", String(checked));
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error("Error saving desktopMode to localStorage:", err);
    }
  };

  const handleVpnToggle = (enabled: boolean) => {
    setVpnEnabled(enabled);
    try {
      localStorage.setItem("vpnEnabled", String(enabled));
    } catch (err) {
      console.error("Error saving vpnEnabled to localStorage:", err);
    }
    if (enabled) {
      toast({
        title: t('toastVpnEnabledTitle'),
        description: t('toastVpnEnabledDescription'),
      });
    } else {
      toast({
        title: t('toastVpnDisabledTitle'),
        description: t('toastVpnDisabledDescription'),
      });
    }
  };

  const handleProxyToggle = (enabled: boolean) => {
    setProxyEnabled(enabled);
    try {
      localStorage.setItem("proxyEnabled", String(enabled));
    } catch (err) {
      console.error("Error saving proxyEnabled to localStorage:", err);
    }
    if (enabled) {
      toast({
        title: t('toastProxyEnabledTitle'),
        description: t('toastProxyEnabledDescription'),
      });
    } else {
      toast({
        title: t('toastProxyDisabledTitle'),
        description: t('toastProxyDisabledDescription'),
      });
    }
  };

  const handleProxySave = () => {
    try {
      localStorage.setItem("proxyAddress", proxyAddress.trim());
    } catch (err) {
      console.error("Error saving proxyAddress to localStorage:", err);
    }
    toast({
        title: t('toastProxyUpdatedTitle'),
        description: t('toastProxyUpdatedDescription'),
    });
  };

  const handleSetAsDefault = () => {
    toast({
      title: t('toastDefaultBrowserTitle'),
      description: t('toastDefaultBrowserDescription'),
    });
  };

  return (
    <div className="flex flex-col h-full">
      <header className="p-4 sm:p-6 border-b">
        <h1 className="text-xl sm:text-2xl font-headline">{t('title')}</h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {t('description')}
        </p>
      </header>
      <div className="flex-1 p-4 sm:p-6 overflow-auto space-y-6">
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl"><Palette className="w-5 h-5" /> {t('appearanceTitle')}</CardTitle>
            <CardDescription className="text-xs sm:text-sm">{t('appearanceDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
            <div>
              <Label className="text-xs sm:text-sm">{t('themeLabel')}</Label>
              <RadioGroup
                value={theme}
                onValueChange={setTheme}
                className="grid grid-cols-3 gap-2 sm:gap-4 mt-2"
              >
                <Label htmlFor="light" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-transparent p-2 sm:p-4 hover:bg-accent hover:text-accent-foreground data-[state=checked]:border-primary cursor-pointer [&:has([data-state=checked])]:border-primary text-xs sm:text-sm">
                  <RadioGroupItem value="light" id="light" className="sr-only" />
                  {t('themeLight')}
                </Label>
                <Label htmlFor="dark" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-transparent p-2 sm:p-4 hover:bg-accent hover:text-accent-foreground data-[state=checked]:border-primary cursor-pointer [&:has([data-state=checked])]:border-primary text-xs sm:text-sm">
                  <RadioGroupItem value="dark" id="dark" className="sr-only" />
                  {t('themeDark')}
                </Label>
                <Label htmlFor="system" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-transparent p-2 sm:p-4 hover:bg-accent hover:text-accent-foreground data-[state=checked]:border-primary cursor-pointer [&:has([data-state=checked])]:border-primary text-xs sm:text-sm">
                  <RadioGroupItem value="system" id="system" className="sr-only" />
                  {t('themeSystem')}
                </Label>
              </RadioGroup>
            </div>
            <Separator />
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                    <Label className="flex items-center gap-2 text-xs sm:text-sm"><Languages className="w-4 h-4" /> {t('locale.label')}</Label>
                </div>
                 <LocaleSwitcher />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl"><ShieldAlert className="w-5 h-5" /> {t('privacyTitle')}</CardTitle>
            <CardDescription className="text-xs sm:text-sm">{t('privacyDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
            <div className="flex items-center justify-between rounded-lg border p-3 sm:p-4">
              <div className="space-y-0.5">
                  <Label className="text-sm sm:text-base flex items-center gap-2" htmlFor="vpn-switch"><ShieldAlert className="w-4 h-4 text-accent" /> {t('vpnLabel')}</Label>
                  <p className="text-[10px] sm:text-sm text-muted-foreground">{t('vpnDescription')}</p>
              </div>
              <Switch id="vpn-switch" checked={vpnEnabled} onCheckedChange={handleVpnToggle} />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3 sm:p-4">
              <div className="space-y-0.5">
                  <Label className="text-sm sm:text-base" htmlFor="ad-blocker-switch">{t('adBlockerLabel')}</Label>
                  <p className="text-[10px] sm:text-sm text-muted-foreground">{t('adBlockerDescription')}</p>
              </div>
              <Switch id="ad-blocker-switch" defaultChecked />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3 sm:p-4">
              <div className="space-y-0.5">
                <Label className="text-sm sm:text-base" htmlFor="dnt-switch">{t('dntLabel')}</Label>
                <p className="text-[10px] sm:text-sm text-muted-foreground">{t('dntDescription')}</p>
              </div>
              <Switch id="dnt-switch" />
            </div>
             <div className="flex items-center justify-between rounded-lg border p-3 sm:p-4">
              <div className="space-y-0.5">
                <Label className="text-sm sm:text-base flex items-center gap-2" htmlFor="desktop-mode-switch"><Laptop className="w-4 h-4 text-accent" /> {t('requestDesktopLabel')}</Label>
                <p className="text-[10px] sm:text-sm text-muted-foreground">{t('requestDesktopDescription')}</p>
              </div>
              <Switch id="desktop-mode-switch" checked={desktopMode} onCheckedChange={handleDesktopModeChange} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
                <div>
                    <Label className="text-sm sm:text-base">{t('clearDataLabel')}</Label>
                    <p className="text-[10px] sm:text-sm text-muted-foreground">{t('clearDataDescription')}</p>
                </div>
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                          <Trash2 className="mr-2 h-4 w-4" /> {t('buttonClearData')}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="w-[95vw] sm:max-w-lg rounded-xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('clearDataDialogTitle')}</AlertDialogTitle>
                        <AlertDialogDescription>
                        {t('clearDataDialogDescription')}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleClearData} className="bg-destructive hover:bg-destructive/90">
                          {t('buttonClearData')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl"><Server className="w-5 h-5" /> {t('proxyTitle')}</CardTitle>
            <CardDescription className="text-xs sm:text-sm">{t('proxyDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
            <div className="flex items-center justify-between rounded-lg border p-3 sm:p-4">
              <div className="space-y-0.5">
                  <Label className="text-sm sm:text-base" htmlFor="proxy-switch">{t('proxyEnableLabel')}</Label>
                  <p className="text-[10px] sm:text-sm text-muted-foreground">{t('proxyEnableDescription')}</p>
              </div>
              <Switch id="proxy-switch" checked={proxyEnabled} onCheckedChange={handleProxyToggle} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="proxy-input" className="text-xs sm:text-sm">{t('proxyAddressLabel')}</Label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <Input
                  id="proxy-input"
                  value={proxyAddress}
                  onChange={(e) => setProxyAddress(e.target.value)}
                  placeholder={t('proxyAddressPlaceholder')}
                  disabled={!proxyEnabled}
                  className="h-9 text-xs sm:text-sm"
                />
                <Button onClick={handleProxySave} disabled={!proxyEnabled} size="sm">{t('buttonSave')}</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl"><ShieldQuestion className="w-5 h-5" /> {t('permissionsTitle')}</CardTitle>
            <CardDescription className="text-xs sm:text-sm">{t('permissionsDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
            <div className="flex items-center justify-between rounded-lg border p-3 sm:p-4">
              <div className="space-y-0.5">
                  <Label className="text-sm sm:text-base flex items-center gap-2" htmlFor="camera-switch"><Camera className="w-4 h-4 text-accent" /> {t('cameraLabel')}</Label>
                  <p className="text-[10px] sm:text-sm text-muted-foreground">{t('cameraDescription')}</p>
              </div>
              <Switch id="camera-switch" defaultChecked />
            </div>
             <div className="flex items-center justify-between rounded-lg border p-3 sm:p-4">
              <div className="space-y-0.5">
                  <Label className="text-sm sm:text-base flex items-center gap-2" htmlFor="mic-switch"><Mic className="w-4 h-4 text-accent" /> {t('microphoneLabel')}</Label>
                  <p className="text-[10px] sm:text-sm text-muted-foreground">{t('microphoneDescription')}</p>
              </div>
              <Switch id="mic-switch" defaultChecked />
            </div>
             <div className="flex items-center justify-between rounded-lg border p-3 sm:p-4">
              <div className="space-y-0.5">
                  <Label className="text-sm sm:text-base flex items-center gap-2" htmlFor="location-switch"><MapPin className="w-4 h-4 text-accent" /> {t('locationLabel')}</Label>
                  <p className="text-[10px] sm:text-sm text-muted-foreground">{t('locationDescription')}</p>
              </div>
              <Switch id="location-switch" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl"><SlidersHorizontal className="w-5 h-5" /> {t('generalTitle')}</CardTitle>
            <CardDescription className="text-xs sm:text-sm">{t('generalDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-4 sm:p-6 pt-0">
            <div className="space-y-2">
                <h3 className="text-sm sm:text-base font-semibold flex items-center gap-2"><Search className="w-4 h-4 text-accent" />{t('searchEngineTitle')}</h3>
                <div className="sm:pl-6">
                    <p className="text-[10px] sm:text-sm text-muted-foreground mb-2">{t('searchEngineDescription')}</p>
                    <Select value={searchEngine} onValueChange={handleSearchEngineChange}>
                      <SelectTrigger className="w-full sm:w-[280px] h-9 text-xs sm:text-sm">
                        <SelectValue placeholder={t('searchEngineSelectPlaceholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="google">Google</SelectItem>
                        <SelectItem value="duckduckgo">DuckDuckGo</SelectItem>
                        <SelectItem value="brave">Brave Search</SelectItem>
                      </SelectContent>
                    </Select>
                </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <h3 className="text-sm sm:text-base font-semibold flex items-center gap-2"><Home className="w-4 h-4 text-accent" />{t('homepageTitle')}</h3>
              <div className="sm:pl-6">
                <p className="text-[10px] sm:text-sm text-muted-foreground mb-2">{t('homepageDescription')}</p>
                <Label htmlFor="homepage-input" className="text-xs sm:text-sm">{t('homepageUrlLabel')}</Label>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-2">
                      <Input
                          id="homepage-input"
                          value={homepage === DEFAULT_HOME_URL ? '' : homepage}
                          onChange={(e) => setHomepage(e.target.value)}
                          placeholder="https://example.com"
                          className="h-9 text-xs sm:text-sm"
                      />
                      <Button onClick={handleHomepageSave} size="sm">{t('buttonSave')}</Button>
                  </div>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <h3 className="text-sm sm:text-base font-semibold flex items-center gap-2"><AppWindow className="w-4 h-4 text-accent" />{t('defaultBrowserTitle')}</h3>
              <div className="sm:pl-6">
                  <p className="text-[10px] sm:text-sm text-muted-foreground mb-2">{t('defaultBrowserDescription')}</p>
                  <Button onClick={handleSetAsDefault} size="sm" variant="outline" className="w-full sm:w-auto">{t('buttonSetAsDefault')}</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}