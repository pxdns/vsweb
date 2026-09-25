import { useState, useCallback } from 'react';
import { FileTree } from './FileTree';
import { useWorkspaceStore } from '../../store/workspace';
import { fileSystem } from '../../services/filesystem';
import { IconPlus, IconFile, IconFolder } from '../common/Icons';

export function ExplorerPanel() {
  const { getActiveWorkspace } = useWorkspaceStore();
  const workspace = getActiveWorkspace();
  const [, forceUpdate] = useState(0);

  const handleNewFile = useCallback(() => {
    if (!workspace) return;
    const root = fileSystem.getWorkspaceRoot(workspace.id);
    if (!root) return;
    const name = prompt('File name:');
    if (name?.trim()) {
      fileSystem.create(root.id, name.trim(), 'file', '');
      forceUpdate(n => n + 1);
    }
  }, [workspace]);

  const handleNewFolder = useCallback(() => {
    if (!workspace) return;
    const root = fileSystem.getWorkspaceRoot(workspace.id);
    if (!root) return;
    const name = prompt('Folder name:');
    if (name?.trim()) {
      fileSystem.create(root.id, name.trim(), 'directory');
      forceUpdate(n => n + 1);
    }
  }, [workspace]);

  return (
    <>
      <div className="sidebar-header">
        <span className="sidebar-title">Explorer</span>
        {workspace && (
          <div className="sidebar-actions">
            <button className="sidebar-action-btn" onClick={handleNewFile} title="New File">
              <IconFile size={14}/>
            </button>
            <button className="sidebar-action-btn" onClick={handleNewFolder} title="New Folder">
              <IconFolder size={14}/>
            </button>
          </div>
        )}
      </div>
      <div className="sidebar-content">
        <FileTree key={workspace?.id}/>
      </div>
    </>
  );
}
