import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { Settings, ThemeId } from '../types';

const defaultSettings: Settings = {
  editor: {
    fontSize: 13,
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace",
    fontLigatures: true,
    tabSize: 2,
    insertSpaces: true,
    wordWrap: 'off',
    wordWrapColumn: 120,
    minimap: true,
    lineNumbers: 'on',
    renderWhitespace: 'selection',
    rulers: [],
    formatOnSave: false,
    formatOnPaste: false,
    autoSave: 'afterDelay',
    autoSaveDelay: 1000,
    scrollBeyondLastLine: true,
    smoothScrolling: true,
    cursorBlinking: 'blink',
    cursorStyle: 'line',
    cursorWidth: 2,
    stickyScroll: true,
    bracketPairColorization: true,
    guides: true,
    inlineSuggest: true,
    acceptSuggestionOnCommitCharacter: true,
    snippetSuggestions: 'bottom',
  },
  appearance: {
    theme: 'dark',
    activityBarPosition: 'left',
    statusBarVisible: true,
    breadcrumbsVisible: true,
    iconTheme: 'default',
  },
  terminal: {
    fontSize: 13,
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    shell: '/bin/bash',
    scrollback: 10000,
    cursorStyle: 'block',
  },
  typescript: {
    suggest: true,
    autoImports: true,
    validateOnType: true,
    inlayHints: true,
    strictMode: true,
  },
  git: {
    autofetch: true,
    confirmSync: true,
    enableSmartCommit: false,
    defaultBranch: 'main',
  },
  preview: {
    autoOpen: false,
    port: 5173,
    showConsole: true,
  },
};

interface SettingsStore {
  settings: Settings;
  updateEditor: (patch: Partial<Settings['editor']>) => void;
  updateAppearance: (patch: Partial<Settings['appearance']>) => void;
  updateTerminal: (patch: Partial<Settings['terminal']>) => void;
  updateTypescript: (patch: Partial<Settings['typescript']>) => void;
  updateGit: (patch: Partial<Settings['git']>) => void;
  updatePreview: (patch: Partial<Settings['preview']>) => void;
  setTheme: (theme: ThemeId) => void;
  reset: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    immer((set) => ({
      settings: defaultSettings,
      updateEditor: (patch) =>
        set(state => { Object.assign(state.settings.editor, patch); }),
      updateAppearance: (patch) =>
        set(state => { Object.assign(state.settings.appearance, patch); }),
      updateTerminal: (patch) =>
        set(state => { Object.assign(state.settings.terminal, patch); }),
      updateTypescript: (patch) =>
        set(state => { Object.assign(state.settings.typescript, patch); }),
      updateGit: (patch) =>
        set(state => { Object.assign(state.settings.git, patch); }),
      updatePreview: (patch) =>
        set(state => { Object.assign(state.settings.preview, patch); }),
      setTheme: (theme) =>
        set(state => { state.settings.appearance.theme = theme; }),
      reset: () => set(state => { state.settings = defaultSettings; }),
    })),
    { name: 'vsweb-settings' }
  )
);
