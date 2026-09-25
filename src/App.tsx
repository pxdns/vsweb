import { useEffect, useCallback } from 'react';
import { useSettingsStore } from './store/settings';
import { useUIStore } from './store/ui';
import { useWorkspaceStore } from './store/workspace';
import { useEditorStore } from './store/editor';
import { themes, getThemeCssVars } from './themes';

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
        <span>VSWeb</span>
      </div>

      <div className="ide-titlebar-menu">
        {[
          { label: 'File', action: () => setNewProjectOpen(true) },
          { label: 'Edit', action: () => {} },
          { label: 'View', action: () => {} },
          { label: 'Go', action: () => {} },
          { label: 'Run', action: () => {} },
          { label: 'Terminal', action: () => {} },
        ].map(item => (
          <button key={item.label} className="ide-titlebar-menu-item" onClick={item.action}>
            {item.label}
          </button>
        ))}
      </div>

      <div className="ide-titlebar-center">
        {/* Breadcrumb / search trigger */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--bg3)',
            border: '1px solid var(--border)',
            borderRadius: 4,
            padding: '3px 10px',
            gap: 6,
            cursor: 'pointer',
            fontSize: 12,
            color: 'var(--fg2)',
            minWidth: 280,
            maxWidth: 480,
          }}
          onClick={() => setCommandPaletteOpen(true)}
        >
          <span>⌘</span>
          <span style={{ flex: 1, textAlign: 'center' }}>
            {workspace ? (
              <>
                {workspace.name}
                {activeTab ? <> / <span style={{ color: 'var(--fg1)' }}>{activeTab.name}</span></> : null}
              </>
            ) : (
              'Open or create a project...'
            )}
          </span>
          <span>P</span>
        </div>
      </div>

      <div className="ide-titlebar-actions">
        <button
          className="ide-titlebar-action-btn"
          onClick={() => setWorkspaceSwitcherOpen(true)}
          title="Switch Workspace"
        >
          ⊞
        </button>
        <button
          className="ide-titlebar-action-btn"
          onClick={() => setSettingsOpen(true)}
          title="Settings"
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
