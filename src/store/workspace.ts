import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { nanoid } from 'nanoid';
import type { Workspace } from '../types';
import { fileSystem } from '../services/filesystem';
import { templates } from '../services/filesystem/templates';

interface WorkspaceStore {
  workspaces: Workspace[];
  activeWorkspaceId: string | null;
  // Actions
  createWorkspace: (name: string, templateId?: string) => Workspace;
  deleteWorkspace: (id: string) => void;
  renameWorkspace: (id: string, name: string) => void;
  switchWorkspace: (id: string) => void;
  getActiveWorkspace: () => Workspace | undefined;
}

export const useWorkspaceStore = create<WorkspaceStore>()(
  persist(
    immer((set, get) => ({
      workspaces: [],
      activeWorkspaceId: null,

      createWorkspace: (name, templateId) => {
        const id = nanoid();
        const workspace: Workspace = {
          id,
          name,
          rootPath: `/${id}`,
          createdAt: Date.now(),
          modifiedAt: Date.now(),
          template: templateId,
        };

        // Create the root directory in the filesystem
        fileSystem.createWorkspaceRoot(id, name);

        // Apply template if provided
        if (templateId) {
          const template = templates.find(t => t.id === templateId);
          if (template) {
            try {
              fileSystem.createFromTemplate(id, template.files);
            } catch (e) {
              console.error('Template application failed:', e);
            }
          }
        }

        set(state => {
          state.workspaces.push(workspace);
          state.activeWorkspaceId = id;
        });

        return workspace;
      },

      deleteWorkspace: (id) => {
        set(state => {
          state.workspaces = state.workspaces.filter(w => w.id !== id);
          if (state.activeWorkspaceId === id) {
            state.activeWorkspaceId = state.workspaces[0]?.id ?? null;
          }
        });
        // Also delete files
        const root = fileSystem.getWorkspaceRoot(id);
        if (root) fileSystem.delete(root.id);
      },

      renameWorkspace: (id, name) => {
        set(state => {
          const ws = state.workspaces.find(w => w.id === id);
          if (ws) {
            ws.name = name;
            ws.modifiedAt = Date.now();
          }
        });
      },

      switchWorkspace: (id) => {
        set(state => { state.activeWorkspaceId = id; });
      },

      getActiveWorkspace: () => {
        const { workspaces, activeWorkspaceId } = get();
        return workspaces.find(w => w.id === activeWorkspaceId);
      },
    })),
    {
      name: 'vsweb-workspaces',
      // Don't persist functions
      partialize: (state) => ({
        workspaces: state.workspaces,
        activeWorkspaceId: state.activeWorkspaceId,
      }),
    }
  )
);
