import { useEditorStore } from '../../store/editor';
import { useSettingsStore } from '../../store/settings';
import { useWorkspaceStore } from '../../store/workspace';
import { useUIStore } from '../../store/ui';
import { IconGitBranch, IconError, IconWarning, IconSettings } from '../common/Icons';

export function StatusBar() {
  const { getActiveTab } = useEditorStore();
  const { settings, setTheme } = useSettingsStore();
  const { getActiveWorkspace } = useWorkspaceStore();
  const { setSettingsOpen, openBottomPanel, setSidebarPanel } = useUIStore();

  const activeTab = getActiveTab();
  const workspace = getActiveWorkspace();

  return (
    <div className="status-bar">
      <div className="status-bar-left">
        <div className="status-item" onClick={() => setSidebarPanel('git')} title="Source Control">
          <IconGitBranch size={12}/>
          <span>main</span>
        </div>
        {workspace && (
          <div className="status-item" style={{ opacity: 0.85 }}>
            {workspace.name}
          </div>
        )}
      </div>

      <div className="status-bar-right">
        {activeTab && (
          <>
            <div className="status-item">
              {activeTab.language}
            </div>
            <div className="status-item">
              Ln 1, Col 1
            </div>
            <div className="status-item">
              {settings.editor.insertSpaces ? `Spaces: ${settings.editor.tabSize}` : `Tab Size: ${settings.editor.tabSize}`}
            </div>
            <div className="status-item">
              UTF-8
            </div>
          </>
        )}
        <div className="status-item" onClick={() => setSettingsOpen(true)} title="Settings">
          <IconSettings size={12}/>
        </div>
        <div
          className="status-item"
          onClick={() => {
            const themes = ['dark', 'light', 'monokai', 'nord', 'solarized-dark', 'high-contrast-dark'] as const;
            const current = themes.indexOf(settings.appearance.theme as any);
            const next = themes[(current + 1) % themes.length];
            setTheme(next);
          }}
          title="Switch Theme"
          style={{ fontSize: 10, letterSpacing: '0.04em' }}
        >
          {settings.appearance.theme}
        </div>
      </div>
    </div>
  );
}
