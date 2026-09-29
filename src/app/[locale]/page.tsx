import { AppSidebar } from '@/components/layout/app-sidebar';
import { BrowserWindow } from '@/components/browser/browser-window';
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from '@/components/ui/sidebar';

export default function Home() {
  return (
    <SidebarProvider className="bg-sidebar">
      <Sidebar>
        <AppSidebar />
      </Sidebar>
      <SidebarInset>
        <BrowserWindow />
      </SidebarInset>
    </SidebarProvider>
  );
}
