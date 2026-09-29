
"use client";

import { useState } from 'react';
import type { HistoryItem } from '@/types';
import { History, Trash2, X } from 'lucide-react';
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
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { useTranslations } from 'next-intl';

interface HistoryViewProps {
  history: HistoryItem[];
  onClearHistory: () => void;
  onRemoveItems: (ids: string[]) => void;
  onNavigate: (url: string) => void;
  onClose: () => void;
}

export function HistoryView({ history, onClearHistory, onRemoveItems, onNavigate, onClose }: HistoryViewProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deletingItem, setDeletingItem] = useState<HistoryItem | null>(null);
  const [isClearingSelected, setIsClearingSelected] = useState(false);
  const t = useTranslations('HistoryView');

  const handleNavigate = (url: string) => {
    onNavigate(url);
    onClose();
  }

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(history.map(item => item.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const toggleSelect = (id: string, checked: boolean) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  };

  const numSelected = selectedIds.size;
  const allSelected = numSelected > 0 && numSelected === history.length;
  const isIndeterminate = numSelected > 0 && !allSelected;

  const handleDeleteSelected = () => {
    try {
      onRemoveItems(Array.from(selectedIds));
      setSelectedIds(new Set());
      setIsClearingSelected(false);
    } catch (err) {
      console.error('Error deleting selected history items:', err);
    }
  };

  const handleDeleteSingle = () => {
    if (deletingItem) {
      try {
        onRemoveItems([deletingItem.id]);
        setDeletingItem(null);
      } catch (err) {
        console.error('Error deleting single history item:', err);
      }
    }
  };

  const handleClearHistory = () => {
    try {
      onClearHistory();
    } catch (err) {
      console.error('Error clearing all history:', err);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <header className="p-4 border-b">
        <h1 className="text-2xl font-headline flex items-center gap-2">
          <History className="w-6 h-6 text-accent" />
          {t('title')}
        </h1>
        <p className="text-muted-foreground">
          {t('description')}
        </p>
      </header>
      <div className="flex-1 p-4 overflow-auto">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{t('cardTitle')}</CardTitle>
                <CardDescription>
                  {t('cardDescription', { total: history.length, selected: numSelected })}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                 <AlertDialog open={isClearingSelected} onOpenChange={setIsClearingSelected}>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" disabled={numSelected === 0}>
                      <Trash2 className="mr-2 h-4 w-4" /> {t('buttonDeleteSelected')}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t('deleteSelectedDialogTitle')}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t('deleteSelectedDialogDescription', { count: numSelected })}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setIsClearingSelected(false)}>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteSelected} className="bg-destructive hover:bg-destructive/90">
                        {t('buttonConfirmDelete')}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={history.length === 0}>
                      <Trash2 className="mr-2 h-4 w-4" /> {t('buttonClearHistory')}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t('clearAllDialogTitle')}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t('clearAllDialogDescription')}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleClearHistory} className="bg-destructive hover:bg-destructive/90">
                        {t('buttonConfirmClear')}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={isIndeterminate ? 'indeterminate' : allSelected}
                      onCheckedChange={(checked) => toggleSelectAll(Boolean(checked))}
                      aria-label={t('tableHeaderSelect')}
                    />
                  </TableHead>
                  <TableHead>{t('tableHeaderTitle')}</TableHead>
                  <TableHead>{t('tableHeaderUrl')}</TableHead>
                  <TableHead className="w-[180px] text-right">{t('tableHeaderDate')}</TableHead>
                  <TableHead className="w-12 text-right">{t('tableHeaderActions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.length > 0 ? (
                  history.map((item) => (
                    <TableRow key={item.id} data-state={selectedIds.has(item.id) && "selected"}>
                      <TableCell>
                        <Checkbox
                           checked={selectedIds.has(item.id)}
                           onCheckedChange={(checked) => toggleSelect(item.id, Boolean(checked))}
                           aria-label="Select row"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        <a href={item.url} onClick={(e) => { e.preventDefault(); handleNavigate(item.url); }} className="hover:underline text-accent">
                          {item.title}
                        </a>
                      </TableCell>
                      <TableCell className="text-muted-foreground truncate max-w-sm">{item.url}</TableCell>
                      <TableCell className="text-right text-muted-foreground text-xs">
                        {new Date(item.timestamp).toLocaleString()}
                      </TableCell>
                       <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDeletingItem(item)}>
                            <X className="h-4 w-4" />
                            <span className="sr-only">{t('tableRowDeleteTooltip')}</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                      {t('noHistory')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <AlertDialog open={!!deletingItem} onOpenChange={(isOpen) => !isOpen && setDeletingItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deleteSelectedDialogTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('deleteSingleDialogDescription', { title: deletingItem?.title })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSingle} className="bg-destructive hover:bg-destructive/90">
              {t('buttonConfirmDelete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
