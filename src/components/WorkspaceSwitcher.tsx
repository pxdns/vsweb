import { useWorkspaceStore } from '../store/workspace';
import { useUIStore } from '../store/ui';
import { IconClose, IconPlus } from './common/Icons';

export function WorkspaceSwitcher() {
  const { workspaces, activeWorkspaceId, switchWorkspace, deleteWorkspace } = useWorkspaceStore();
  const { setWorkspaceSwitcherOpen, setNewProjectOpen } = useUIStore();

  return (
    <div className="workspace-switcher-overlay" onClick={() => setWorkspaceSwitcherOpen(false)}>
      <div className="workspace-switcher" onClick={e => e.stopPropagation()}>
        <div className="workspace-switcher-header">
          <span style={{ fontSize: 13, fontWeight: 600 }}>Switch Workspace</span>
          <button className="settings-close" onClick={() => setWorkspaceSwitcherOpen(false)}>
            <IconClose size={14}/>
          </button>
        </div>

        <div style={{ maxHeight: '60vh', overflow: 'auto' }}>
          {workspaces.map(ws => (
            <div
              key={ws.id}
              className={`workspace-item${ws.id === activeWorkspaceId ? ' active' : ''}`}
              onClick={() => { switchWorkspace(ws.id); setWorkspaceSwitcherOpen(false); }}
            >
              <div className="workspace-item-icon">
                {ws.name.slice(0, 1).toUpperCase()}
              </div>
              <div className="workspace-item-info">
                <div className="workspace-item-name">{ws.name}</div>
                <div className="workspace-item-meta">
                  {ws.template ?? 'custom'} &nbsp;·&nbsp;
                  {new Date(ws.createdAt).toLocaleDateString()}
                </div>
              </div>
              {ws.id !== activeWorkspaceId && (
                <button
                  className="sidebar-action-btn"
                  onClick={e => {
                    e.stopPropagation();
                    if (confirm(`Delete workspace "${ws.name}"?`)) {
                      deleteWorkspace(ws.id);
                    }
                  }}
                  title="Delete workspace"
                >
                  <IconClose size={12}/>
                </button>
              )}
            </div>
          ))}

          {workspaces.length === 0 && (
            <div className="empty-state" style={{ padding: 24 }}>
              <div className="empty-state-title">No workspaces</div>
              <div className="empty-state-text">Create your first project to get started</div>
            </div>
          )}
        </div>

        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)' }}>
          <button
            className="ide-btn primary"
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
            onClick={() => { setWorkspaceSwitcherOpen(false); setNewProjectOpen(true); }}
          >
            <IconPlus size={12}/> New Project
          </button>
        </div>
      </div>
    </div>
  );
}
