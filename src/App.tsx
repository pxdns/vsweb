import { useEffect, useCallback } from 'react';
import { useSettingsStore } from './store/settings';
import { useUIStore } from './store/ui';
import { useWorkspaceStore } from './store/workspace';
import { useEditorStore } from './store/editor';
import { themes, getThemeCssVars } from './themes';
import { configureTypeScript } from './services/typescript';

// Components
import { ActivityBar } from './components/ActivityBar';
import { Sidebar } from './components/Sidebar';
import { EditorArea } from './components/editor/EditorArea';
import { BottomPanel } from './components/panels/BottomPanel';
import { StatusBar } from './components/statusbar/StatusBar';
import { CommandPalette } from './components/commandpalette/CommandPalette';
import { SettingsPanel } from './components/settings/SettingsPanel';
import { NewProjectDialog } from './components/NewProjectDialog';
import { WorkspaceSwitcher } from './components/WorkspaceSwitcher';
import { Notifications } from './components/Notifications';
import { WelcomeScreen } from './components/WelcomeScreen';

function applyTheme(themeId: string) {
  const theme = themes[themeId as keyof typeof themes] ?? themes.dark;
  const vars = getThemeCssVars(theme);
  const root = document.documentElement;
  for (const [k, v] of Object.entries(vars)) {
    root.style.setProperty(k, v);
  }
  root.setAttribute('data-theme', theme.type);
}

export default function App() {
  const { settings } = useSettingsStore();
  const {
    sidebarVisible, bottomPanelVisible, commandPaletteOpen,
    settingsOpen, newProjectOpen, workspaceSwitcherOpen,
    setCommandPaletteOpen, setNewProjectOpen, toggleSidebar,
    toggleBottomPanel, openBottomPanel,
  } = useUIStore();
  const { workspaces } = useWorkspaceStore();
  const { saveFile, getActiveTab, splitEditor } = useEditorStore();

  // Apply theme CSS variables
  useEffect(() => {
    applyTheme(settings.appearance.theme);
  }, [settings.appearance.theme]);

  // Configure TypeScript language service
  useEffect(() => {
    configureTypeScript(settings.typescript);
  }, [settings.typescript]);

  // Global keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const ctrl = e.ctrlKey || e.metaKey;

    if (ctrl && e.shiftKey && e.key === 'P') {
      e.preventDefault();
      setCommandPaletteOpen(true);
      return;
    }
    if (ctrl && e.key === 'p') {
      e.preventDefault();
      setCommandPaletteOpen(true);
      return;
    }
    if (ctrl && e.key === 'b') {
      e.preventDefault();
      toggleSidebar();
      return;
    }
    if (ctrl && e.key === '`') {
      e.preventDefault();
      openBottomPanel('terminal');
      return;
    }
    if (ctrl && e.shiftKey && e.key === 'N') {
      e.preventDefault();
      setNewProjectOpen(true);
      return;
    }
    if (ctrl && e.key === '\\') {
      e.preventDefault();
      splitEditor();
      return;
    }
    if (ctrl && e.key === 'g') {
      e.preventDefault();
      // Trigger Go to Line on the active editor
      import('monaco-editor').then(monaco => {
        const editors = monaco.editor.getEditors();
        for (const ed of editors) {
          if (ed.hasTextFocus() || ed.getDomNode()?.contains(document.activeElement)) {
            ed.getAction('editor.action.gotoLine')?.run();
            return;
          }
        }
        editors[0]?.getAction('editor.action.gotoLine')?.run();
      });
      return;
    }
    if (ctrl && e.shiftKey && e.key === 'F') {
      e.preventDefault();
      // Focus search panel
      import('./store/ui').then(({ useUIStore }) => {
        useUIStore.getState().setSidebarPanel('search');
      });
      return;
    }
    if (e.key === 'Escape') {
      if (commandPaletteOpen) setCommandPaletteOpen(false);
    }
  }, [commandPaletteOpen, setCommandPaletteOpen, setNewProjectOpen, toggleSidebar, openBottomPanel, splitEditor]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const hasWorkspace = workspaces.length > 0;

  return (
    <div className="ide-root">
      {/* Title bar */}
      <TitleBar/>

      {/* Main body */}
      <div className="ide-body">
        <ActivityBar/>

        {sidebarVisible && <Sidebar/>}

        <div className="editor-area" style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          {!hasWorkspace ? (
            <WelcomeScreen/>
          ) : (
            <EditorArea/>
          )}

          {bottomPanelVisible && <BottomPanel/>}
        </div>
      </div>

      {settings.appearance.statusBarVisible && <StatusBar/>}

      {/* Overlays */}
      {commandPaletteOpen && <CommandPalette/>}
      {settingsOpen && <SettingsPanel/>}
      {newProjectOpen && <NewProjectDialog/>}
      {workspaceSwitcherOpen && <WorkspaceSwitcher/>}

      <Notifications/>
    </div>
  );
}

function TitleBar() {
  const { setCommandPaletteOpen, setNewProjectOpen, setWorkspaceSwitcherOpen, setSettingsOpen } = useUIStore();
  const { getActiveWorkspace } = useWorkspaceStore();
  const workspace = getActiveWorkspace();
  const activeTab = useEditorStore(s => s.getActiveTab());

  return (
    <div className="ide-titlebar">
      <div className="ide-titlebar-logo">
        <VSWebLogo/>
      </div>

      <div className="ide-titlebar-menu">
        {[
          { label: 'File', action: () => setNewProjectOpen(true) },
          { label: 'Edit', action: () => {} },
          { label: 'Selection', action: () => {} },
          { label: 'View', action: () => {} },
          { label: 'Go', action: () => {} },
          { label: 'Run', action: () => {} },
          { label: 'Terminal', action: () => {} },
          { label: 'Help', action: () => {} },
        ].map(item => (
          <button key={item.label} className="ide-titlebar-menu-item" onClick={item.action}>
            {item.label}
          </button>
        ))}
      </div>

      <div className="ide-titlebar-center">
        {/* Command palette trigger — VS Code style search bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 4,
            padding: '2px 10px',
            gap: 6,
            cursor: 'pointer',
            fontSize: 12,
            color: 'rgba(255,255,255,0.6)',
            minWidth: 300,
            maxWidth: 500,
            height: 22,
          }}
          onClick={() => setCommandPaletteOpen(true)}
        >
          <span style={{ fontSize: 11 }}>⌘</span>
          <span style={{ flex: 1, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {workspace ? (
              <>
                {workspace.name}
                {activeTab ? <> — <span style={{ color: 'rgba(255,255,255,0.8)' }}>{activeTab.name}</span></> : null}
              </>
            ) : (
              'VSWeb'
            )}
          </span>
          <span style={{ fontSize: 10, opacity: 0.7 }}>P</span>
        </div>
      </div>

      <div className="ide-titlebar-actions">
        <button
          className="ide-titlebar-action-btn"
          onClick={() => setWorkspaceSwitcherOpen(true)}
          title="Switch Workspace"
          style={{ fontSize: 16 }}
        >
          ⊞
        </button>
        <button
          className="ide-titlebar-action-btn"
          onClick={() => setSettingsOpen(true)}
          title="Settings"
          style={{ fontSize: 13 }}
        >
          ⚙
        </button>
      </div>
    </div>
  );
}

function VSWebLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect width="18" height="18" rx="3" fill="var(--accent)"/>
      <path d="M3 5l4 8 2-4 2 4 4-8" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
