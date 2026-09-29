
export type Tab = {
  id: string;
  url: string;
  title: string;
  history: string[];
  historyIndex: number;
  incognito?: boolean;
};

export type Bookmark = {
  id: string;
  url: string;
  title: string;
  folder?: string;
};

export type HistoryItem = {
  id: string;
  url:string;
  title: string;
  timestamp: number;
};

export type DownloadItem = {
  id: string;
  filename: string;
  url: string;
  size: string;
  status: 'In Progress' | 'Completed' | 'Failed';
  progress: number; // 0-100
};
