
"use client";

import { FileDown, File, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import type { DownloadItem } from '@/types';
import { useTranslations } from 'next-intl';

const MOCK_DOWNLOADS: DownloadItem[] = [
  { id: '1', filename: 'nextjs-docs.pdf', url: 'https://nextjs.org/docs/app', size: '2.5 MB', status: 'Completed', progress: 100 },
  { id: '2', filename: 'browser-icon.svg', url: 'https://github.com/logo.svg', size: '15 KB', status: 'Completed', progress: 100 },
  { id: '3', filename: 'large-dataset.zip', url: 'https://example.com/data.zip', size: '1.2 GB', status: 'In Progress', progress: 45 },
  { id: '4', filename: 'important-document.docx', url: 'https://example.com/doc.docx', size: '512 KB', status: 'Failed', progress: 0 },
];

export function DownloadsView() {
  const t = useTranslations('DownloadsView');

  const getStatusBadge = (status: DownloadItem['status']) => {
    switch (status) {
      case 'Completed': return <Badge variant="default" className="bg-chart-2 text-primary-foreground hover:bg-chart-2/80">{t('statusCompleted')}</Badge>;
      case 'In Progress': return <Badge variant="secondary">{t('statusInProgress')}</Badge>;
      case 'Failed': return <Badge variant="destructive">{t('statusFailed')}</Badge>;
    }
  }

  const getStatusIcon = (status: DownloadItem['status']) => {
     switch (status) {
      case 'Completed': return <File className="w-4 h-4 text-chart-2" />;
      case 'In Progress': return <FileDown className="w-4 h-4 text-accent animate-pulse" />;
      case 'Failed': return <AlertCircle className="w-4 h-4 text-destructive" />;
    }
  }

  return (
    <div className="flex flex-col h-full">
      <header className="p-4 border-b">
        <h1 className="text-2xl font-headline flex items-center gap-2">
          <FileDown className="w-6 h-6 text-accent" />
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
              {t('cardDescription', { count: MOCK_DOWNLOADS.length })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/2">{t('tableHeaderFilename')}</TableHead>
                  <TableHead>{t('tableHeaderSize')}</TableHead>
                  <TableHead>{t('tableHeaderStatus')}</TableHead>
                  <TableHead className="w-[200px]">{t('tableHeaderProgress')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_DOWNLOADS.length > 0 ? (
                  MOCK_DOWNLOADS.map((download) => (
                    <TableRow key={download.id}>
                      <TableCell className="font-medium flex items-center gap-2">
                        {getStatusIcon(download.status)}
                        <span className="truncate">{download.filename}</span>
                      </TableCell>
                      <TableCell>{download.size}</TableCell>
                      <TableCell>{getStatusBadge(download.status)}</TableCell>
                      <TableCell>
                        {download.status === 'In Progress' ? (
                          <Progress value={download.progress} className="h-2" />
                        ) : (
                          <div className="h-2" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                      {t('noDownloads')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
