import {
    SidebarProvider,
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarInset,
  } from '@/components/ui/sidebar';
import { GameContainer } from './game-container';
import { AppLogo } from '@/components/icons';
  
  export function GameWrapper() {
    return (
      <SidebarProvider>
        <Sidebar>
            <GameContainer />
        </Sidebar>
        <SidebarInset />
      </SidebarProvider>
    );
  }
  