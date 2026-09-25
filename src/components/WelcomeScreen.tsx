import { useUIStore } from '../store/ui';
import { useWorkspaceStore } from '../store/workspace';
import { IconFolder, IconPlus, IconSettings, IconGitBranch, IconCommand, IconVSWeb } from './common/Icons';

export function WelcomeScreen() {
  const { setNewProjectOpen, setCommandPaletteOpen, setWorkspaceSwitcherOpen, setSettingsOpen } = useUIStore();
  const { workspaces } = useWorkspaceStore();

  return (
    <div className="welcome-screen">
      <div className="welcome-header">
        <div className="welcome-logo">
          <IconVSWeb size={36}/>
          <h1>VS<span>Web</span></h1>
        </div>
        <p className="welcome-subtitle">
          A web-native IDE for TypeScript and modern web development
        </p>
      </div>

      <div className="welcome-sections">
        <div>
          <h3>Start</h3>
          <div className="welcome-actions">
            <div className="welcome-action" onClick={() => setNewProjectOpen(true)}>
              <span className="welcome-action-icon"><IconPlus size={16}/></span>
              <span>New Project</span>
              <span className="welcome-action-keybinding">Ctrl+Shift+N</span>
            </div>
            <div className="welcome-action" onClick={() => setWorkspaceSwitcherOpen(true)}>
              <span className="welcome-action-icon"><IconFolder size={16}/></span>
              <span>Open Project</span>
            </div>
            <div className="welcome-action" onClick={() => setCommandPaletteOpen(true)}>
              <span className="welcome-action-icon"><IconCommand size={16}/></span>
              <span>Command Palette</span>
              <span className="welcome-action-keybinding">Ctrl+Shift+P</span>
            </div>
          </div>
        </div>

        <div>
          <h3>Customize</h3>
          <div className="welcome-actions">
            <div className="welcome-action" onClick={() => setSettingsOpen(true)}>
              <span className="welcome-action-icon"><IconSettings size={16}/></span>
              <span>Settings</span>
              <span className="welcome-action-keybinding">Ctrl+,</span>
            </div>
            <div className="welcome-action" onClick={() => {
              setSettingsOpen(true);
            }}>
              <span className="welcome-action-icon">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="4" cy="8" r="2.5" fill="var(--accent)"/>
                  <circle cx="8" cy="5" r="2.5" fill="var(--syntax-string)"/>
                  <circle cx="12" cy="8" r="2.5" fill="var(--syntax-keyword)"/>
                </svg>
              </span>
              <span>Choose Theme</span>
            </div>
          </div>
        </div>

        {workspaces.length > 0 && (
          <div>
            <h3>Recent Projects</h3>
            <div className="welcome-recent-projects">
              {workspaces.slice(0, 5).map(ws => (
                <RecentProject key={ws.id} workspace={ws}/>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3>Learn</h3>
          <div className="welcome-actions">
            <div className="welcome-action">
              <span className="welcome-action-icon"><IconGitBranch size={16}/></span>
              <span>Git Integration</span>
            </div>
            <div className="welcome-action">
              <span className="welcome-action-icon">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 10V6M2 8h4M8 6v4M8 6c0 0 4 0 4 0M12 6v4" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </span>
              <span>TypeScript Features</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 40, fontSize: 11, color: 'var(--fg3)' }}>
        Phase 1: Foundation &nbsp;·&nbsp; Editor · Explorer · Command Palette · Settings · Themes
      </div>
    </div>
  );
}

function RecentProject({ workspace }: { workspace: { id: string; name: string; template?: string; createdAt: number } }) {
  const { switchWorkspace } = useWorkspaceStore();
  const { setWorkspaceSwitcherOpen } = useUIStore();

  return (
    <div
      className="welcome-project-item"
      onClick={() => {
        switchWorkspace(workspace.id);
        setWorkspaceSwitcherOpen(false);
      }}
    >
      <div className="welcome-project-name">{workspace.name}</div>
      <div className="welcome-project-meta">
        {workspace.template ?? 'custom'} &nbsp;·&nbsp; {new Date(workspace.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
}
