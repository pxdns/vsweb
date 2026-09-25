import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { PanelId, Notification, NotificationType } from '../types';
import { nanoid } from 'nanoid';

type SidebarPanel = 'explorer' | 'search' | 'git' | 'extensions' | 'typescript';
type BottomPanel = 'terminal' | 'problems' | 'output' | 'preview' | 'api' | 'database' | 'env' | 'packages';

interface UIStore {
  // Layout
  sidebarWidth: number;
  bottomPanelHeight: number;
  rightPanelWidth: number;
  sidebarVisible: boolean;
  bottomPanelVisible: boolean;
  rightPanelVisible: boolean;
  activityBarVisible: boolean;
  statusBarVisible: boolean;

  // Active panels
  activeSidebarPanel: SidebarPanel;
  activeBottomPanel: BottomPanel;
  activeRightPanel: string | null;

  // Modals/overlays
  commandPaletteOpen: boolean;
  settingsOpen: boolean;
  newProjectOpen: boolean;
  workspaceSwitcherOpen: boolean;
  keyboardShortcutsOpen: boolean;
  searchOpen: boolean;

  // Notifications
  notifications: Notification[];

  // Actions
  setSidebarWidth: (w: number) => void;
  setBottomPanelHeight: (h: number) => void;
  setRightPanelWidth: (w: number) => void;
  toggleSidebar: () => void;
  toggleBottomPanel: () => void;
  toggleRightPanel: () => void;
  setSidebarPanel: (panel: SidebarPanel) => void;
  setBottomPanel: (panel: BottomPanel) => void;
  openBottomPanel: (panel: BottomPanel) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setSettingsOpen: (open: boolean) => void;
  setNewProjectOpen: (open: boolean) => void;
  setWorkspaceSwitcherOpen: (open: boolean) => void;
  setKeyboardShortcutsOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  addNotification: (type: NotificationType, message: string, duration?: number) => string;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    immer((set) => ({
      sidebarWidth: 240,
      bottomPanelHeight: 200,
      rightPanelWidth: 320,
      sidebarVisible: true,
      bottomPanelVisible: false,
      rightPanelVisible: false,
      activityBarVisible: true,
      statusBarVisible: true,
      activeSidebarPanel: 'explorer',
      activeBottomPanel: 'terminal',
      activeRightPanel: null,
      commandPaletteOpen: false,
      settingsOpen: false,
      newProjectOpen: false,
      workspaceSwitcherOpen: false,
      keyboardShortcutsOpen: false,
      searchOpen: false,
      notifications: [],

      setSidebarWidth: (w) => set(state => { state.sidebarWidth = Math.max(150, Math.min(600, w)); }),
      setBottomPanelHeight: (h) => set(state => { state.bottomPanelHeight = Math.max(80, Math.min(600, h)); }),
      setRightPanelWidth: (w) => set(state => { state.rightPanelWidth = Math.max(200, Math.min(600, w)); }),
      toggleSidebar: () => set(state => { state.sidebarVisible = !state.sidebarVisible; }),
      toggleBottomPanel: () => set(state => { state.bottomPanelVisible = !state.bottomPanelVisible; }),
      toggleRightPanel: () => set(state => { state.rightPanelVisible = !state.rightPanelVisible; }),
      setSidebarPanel: (panel) => set(state => {
        if (state.activeSidebarPanel === panel && state.sidebarVisible) {
          state.sidebarVisible = false;
        } else {
          state.activeSidebarPanel = panel;
          state.sidebarVisible = true;
        }
      }),
      setBottomPanel: (panel) => set(state => { state.activeBottomPanel = panel; }),
      openBottomPanel: (panel) => set(state => {
        state.activeBottomPanel = panel;
        state.bottomPanelVisible = true;
      }),
      setCommandPaletteOpen: (open) => set(state => { state.commandPaletteOpen = open; }),
      setSettingsOpen: (open) => set(state => { state.settingsOpen = open; }),
      setNewProjectOpen: (open) => set(state => { state.newProjectOpen = open; }),
      setWorkspaceSwitcherOpen: (open) => set(state => { state.workspaceSwitcherOpen = open; }),
      setKeyboardShortcutsOpen: (open) => set(state => { state.keyboardShortcutsOpen = open; }),
      setSearchOpen: (open) => set(state => { state.searchOpen = open; }),

      addNotification: (type, message, duration = 5000) => {
        const id = nanoid();
        set(state => {
          state.notifications.push({ id, type, message, duration, timestamp: Date.now() });
          // Keep max 10
          if (state.notifications.length > 10) state.notifications.shift();
        });
        return id;
      },
      removeNotification: (id) => set(state => {
        state.notifications = state.notifications.filter(n => n.id !== id);
      }),
      clearNotifications: () => set(state => { state.notifications = []; }),
    })),
    {
      name: 'vsweb-ui',
      partialize: (state) => ({
        sidebarWidth: state.sidebarWidth,
        bottomPanelHeight: state.bottomPanelHeight,
        rightPanelWidth: state.rightPanelWidth,
        sidebarVisible: state.sidebarVisible,
        bottomPanelVisible: state.bottomPanelVisible,
        activeSidebarPanel: state.activeSidebarPanel,
        activeBottomPanel: state.activeBottomPanel,
      }),
    }
  )
);
