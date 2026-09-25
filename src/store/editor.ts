import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { nanoid } from 'nanoid';
import type { EditorTab, EditorSplit, EditorLayout } from '../types';
import { fileSystem, detectLanguage } from '../services/filesystem';

const createSplit = (): EditorSplit => ({
  id: nanoid(),
  tabs: [],
  activeTabId: null,
});

interface EditorStore {
  layout: EditorLayout;
  pendingContent: Record<string, string>; // fileId -> unsaved content

  openFile: (fileId: string, splitId?: string) => void;
  closeTab: (tabId: string, splitId: string) => void;
  closeAllTabs: (splitId: string) => void;
  closeOtherTabs: (tabId: string, splitId: string) => void;
  setActiveTab: (tabId: string, splitId: string) => void;
  pinTab: (tabId: string, splitId: string) => void;
  unpinTab: (tabId: string, splitId: string) => void;
  splitEditor: (direction?: 'horizontal' | 'vertical') => void;
  closeSplit: (splitId: string) => void;
  setActiveSplit: (splitId: string) => void;
  markDirty: (tabId: string, content: string) => void;
  markClean: (tabId: string) => void;
  saveFile: (tabId: string) => void;
  updateViewState: (tabId: string, state: unknown) => void;
  getTabForFile: (fileId: string) => EditorTab | undefined;
  getActiveTab: () => EditorTab | undefined;
}

export const useEditorStore = create<EditorStore>()(
  immer((set, get) => {
    const initialSplit = createSplit();
    return {
      layout: {
        splits: [initialSplit],
        activeSplitId: initialSplit.id,
      },
      pendingContent: {},

      openFile: (fileId, splitId) => {
        const { layout } = get();
        const targetSplitId = splitId ?? layout.activeSplitId;
        const split = layout.splits.find(s => s.id === targetSplitId);
        if (!split) return;

        // Check if already open in this split
        const existing = split.tabs.find(t => t.fileId === fileId);
        if (existing) {
          set(state => {
            const s = state.layout.splits.find(s => s.id === targetSplitId)!;
            s.activeTabId = existing.id;
            state.layout.activeSplitId = targetSplitId;
          });
          return;
        }

        // Check if open in any other split
        for (const s of layout.splits) {
          const t = s.tabs.find(t => t.fileId === fileId);
          if (t) {
            set(state => {
              state.layout.activeSplitId = s.id;
              const sp = state.layout.splits.find(sp => sp.id === s.id)!;
              sp.activeTabId = t.id;
            });
            return;
          }
        }

        const entry = fileSystem.getEntry(fileId);
        if (!entry || entry.type !== 'file') return;

        const tab: EditorTab = {
          id: nanoid(),
          fileId,
          path: entry.path,
          name: entry.name,
          language: detectLanguage(entry.name),
          isDirty: false,
          isPinned: false,
        };

        set(state => {
          const s = state.layout.splits.find(s => s.id === targetSplitId)!;
          // Replace preview tab (unpinned single tab) or append
          const previewIdx = s.tabs.findIndex(t => !t.isPinned && !t.isDirty && s.tabs.length > 0);
          // Just append for now
          s.tabs.push(tab);
          s.activeTabId = tab.id;
          state.layout.activeSplitId = targetSplitId;
        });
      },

      closeTab: (tabId, splitId) => {
        set(state => {
          const split = state.layout.splits.find(s => s.id === splitId);
          if (!split) return;
          const idx = split.tabs.findIndex(t => t.id === tabId);
          if (idx === -1) return;

          // Remove pending content
          const tab = split.tabs[idx];
          delete state.pendingContent[tab.fileId];

          split.tabs.splice(idx, 1);
          if (split.activeTabId === tabId) {
            split.activeTabId = split.tabs[Math.max(0, idx - 1)]?.id ?? split.tabs[0]?.id ?? null;
          }
        });
      },

      closeAllTabs: (splitId) => {
        set(state => {
          const split = state.layout.splits.find(s => s.id === splitId);
          if (!split) return;
          for (const tab of split.tabs) {
            delete state.pendingContent[tab.fileId];
          }
          split.tabs = [];
          split.activeTabId = null;
        });
      },

      closeOtherTabs: (tabId, splitId) => {
        set(state => {
          const split = state.layout.splits.find(s => s.id === splitId);
          if (!split) return;
          const keep = split.tabs.find(t => t.id === tabId);
          for (const tab of split.tabs) {
            if (tab.id !== tabId) delete state.pendingContent[tab.fileId];
          }
          split.tabs = keep ? [keep] : [];
          split.activeTabId = keep?.id ?? null;
        });
      },

      setActiveTab: (tabId, splitId) => {
        set(state => {
          const split = state.layout.splits.find(s => s.id === splitId);
          if (split) split.activeTabId = tabId;
          state.layout.activeSplitId = splitId;
        });
      },

      pinTab: (tabId, splitId) => {
        set(state => {
          const split = state.layout.splits.find(s => s.id === splitId);
          const tab = split?.tabs.find(t => t.id === tabId);
          if (tab) tab.isPinned = true;
        });
      },

      unpinTab: (tabId, splitId) => {
        set(state => {
          const split = state.layout.splits.find(s => s.id === splitId);
          const tab = split?.tabs.find(t => t.id === tabId);
          if (tab) tab.isPinned = false;
        });
      },

      splitEditor: () => {
        set(state => {
          const newSplit = createSplit();
          state.layout.splits.push(newSplit);
          state.layout.activeSplitId = newSplit.id;
        });
      },

      closeSplit: (splitId) => {
        set(state => {
          if (state.layout.splits.length <= 1) return;
          const idx = state.layout.splits.findIndex(s => s.id === splitId);
          if (idx === -1) return;
          // Clean up pending content for tabs in this split
          const split = state.layout.splits[idx];
          for (const tab of split.tabs) {
            delete state.pendingContent[tab.fileId];
          }
          state.layout.splits.splice(idx, 1);
          if (state.layout.activeSplitId === splitId) {
            state.layout.activeSplitId = state.layout.splits[Math.max(0, idx - 1)].id;
          }
        });
      },

      setActiveSplit: (splitId) => {
        set(state => { state.layout.activeSplitId = splitId; });
      },

      markDirty: (tabId, content) => {
        set(state => {
          for (const split of state.layout.splits) {
            const tab = split.tabs.find(t => t.id === tabId);
            if (tab) {
              tab.isDirty = true;
              state.pendingContent[tab.fileId] = content;
              return;
            }
          }
        });
      },

      markClean: (tabId) => {
        set(state => {
          for (const split of state.layout.splits) {
            const tab = split.tabs.find(t => t.id === tabId);
            if (tab) {
              tab.isDirty = false;
              delete state.pendingContent[tab.fileId];
              return;
            }
          }
        });
      },

      saveFile: (tabId) => {
        const { pendingContent, layout } = get();
        let tab: EditorTab | undefined;
        for (const split of layout.splits) {
          tab = split.tabs.find(t => t.id === tabId);
          if (tab) break;
        }
        if (!tab) return;
        const content = pendingContent[tab.fileId];
        if (content !== undefined) {
          fileSystem.write(tab.fileId, content);
        }
        set(state => {
          for (const split of state.layout.splits) {
            const t = split.tabs.find(t => t.id === tabId);
            if (t) {
              t.isDirty = false;
              delete state.pendingContent[t.fileId];
              return;
            }
          }
        });
      },

      updateViewState: (tabId, viewState) => {
        set(state => {
          for (const split of state.layout.splits) {
            const tab = split.tabs.find(t => t.id === tabId);
            if (tab) { tab.viewState = viewState; return; }
          }
        });
      },

      getTabForFile: (fileId) => {
        const { layout } = get();
        for (const split of layout.splits) {
          const tab = split.tabs.find(t => t.fileId === fileId);
          if (tab) return tab;
        }
        return undefined;
      },

      getActiveTab: () => {
        const { layout } = get();
        const activeSplit = layout.splits.find(s => s.id === layout.activeSplitId);
        if (!activeSplit) return undefined;
        return activeSplit.tabs.find(t => t.id === activeSplit.activeTabId);
      },
    };
  })
);
