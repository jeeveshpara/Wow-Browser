"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Bookmark, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import type { Bookmark as BookmarkType } from '@/types';
import { useTranslations } from 'next-intl';

interface BookmarkManagerViewProps {
  bookmarks: BookmarkType[];
  onUpdateBookmark: (bookmark: BookmarkType) => void;
  onRemoveBookmark: (id: string) => void;
  onNavigate: (url: string) => void;
  onClose: () => void;
}

export function BookmarkManagerView({ bookmarks, onUpdateBookmark, onRemoveBookmark, onNavigate, onClose }: BookmarkManagerViewProps) {
  const { toast } = useToast();
  const [editingBookmark, setEditingBookmark] = useState<BookmarkType | null>(null);
  const [deletingBookmark, setDeletingBookmark] = useState<BookmarkType | null>(null);
  const t = useTranslations('BookmarkManagerView');

  const formSchema = z.object({
    id: z.string(),
    title: z.string().min(1, t('formTitleError')),
    url: z.string().url(t('formUrlError')),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (editingBookmark) {
      form.reset(editingBookmark);
    } else {
      form.reset({ id: '', title: '', url: '' });
    }
  }, [editingBookmark, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      onUpdateBookmark(values);
      setEditingBookmark(null);
      toast({ title: t('toastUpdateSuccess') });
    } catch (err) {
      console.error('Error updating bookmark:', err);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to update bookmark.' });
    }
  }

  function handleRemove() {
    if (deletingBookmark) {
      try {
        onRemoveBookmark(deletingBookmark.id);
        setDeletingBookmark(null);
        toast({ title: t('toastRemoveSuccess') });
      } catch (err) {
        console.error('Error removing bookmark:', err);
      }
    }
  }

  const handleNavigate = (url: string) => {
    onNavigate(url);
    onClose();
  }

  return (
    <div className="flex flex-col h-full">
      <header className="p-4 border-b">
        <h1 className="text-2xl font-headline flex items-center gap-2">
          <Bookmark className="w-6 h-6 text-accent" />
          {t('title')}
        </h1>
        <p className="text-muted-foreground">
          {t('description')}
        </p>
      </header>
      <div className="flex-1 p-4 overflow-auto">
        <Card>
          <CardHeader>
            <CardTitle>{t('cardTitle')}</CardTitle>
            <CardDescription>
              {t('cardDescription', { count: bookmarks.length })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('tableHeaderTitle')}</TableHead>
                  <TableHead>{t('tableHeaderUrl')}</TableHead>
                  <TableHead className="text-right w-20">{t('tableHeaderActions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookmarks.length > 0 ? (
                  bookmarks.map((bookmark) => (
                    <TableRow key={bookmark.id}>
                      <TableCell className="font-medium">
                        <a href={bookmark.url} onClick={(e) => { e.preventDefault(); handleNavigate(bookmark.url); }} className="hover:underline text-accent">
                          {bookmark.title}
                        </a>
                      </TableCell>
                      <TableCell className="text-muted-foreground truncate max-w-sm">{bookmark.url}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">{t('tableHeaderActions')}</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onSelect={() => setEditingBookmark(bookmark)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              <span>{t('editDialogTitle')}</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => setDeletingBookmark(bookmark)} className="text-destructive focus:text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>{t('buttonDelete')}</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">
                      {t('noBookmarks')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!editingBookmark} onOpenChange={(isOpen) => !isOpen && setEditingBookmark(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('editDialogTitle')}</DialogTitle>
          </DialogHeader>
          {editingBookmark && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('formTitleLabel')}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('formUrlLabel')}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <DialogFooter>
                   <Button type="button" variant="ghost" onClick={() => setEditingBookmark(null)}>{t('buttonCancel')}</Button>
                  <Button type="submit">{t('buttonSaveChanges')}</Button>
                </DialogFooter>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={!!deletingBookmark} onOpenChange={(isOpen) => !isOpen && setDeletingBookmark(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deleteDialogTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('deleteDialogDescription', { title: deletingBookmark?.title })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingBookmark(null)}>{t('buttonCancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemove} className="bg-destructive hover:bg-destructive/90">
              {t('buttonDelete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
