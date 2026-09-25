import { useUIStore } from '../store/ui';
import { ResizeHandle } from './common/ResizeHandle';
import { ExplorerPanel } from './explorer/ExplorerPanel';
import { SearchPanel } from './sidebar/SearchPanel';
import { GitSidebarPanel } from './sidebar/GitSidebarPanel';
import { ExtensionsPanel } from './sidebar/ExtensionsPanel';
import { TypeScriptPanel } from './sidebar/TypeScriptPanel';

export function Sidebar() {
  const { sidebarWidth, setSidebarWidth, activeSidebarPanel } = useUIStore();

  return (
    <div className="sidebar" style={{ width: sidebarWidth }}>
      {activeSidebarPanel === 'explorer' && <ExplorerPanel/>}
      {activeSidebarPanel === 'search' && <SearchPanel/>}
      {activeSidebarPanel === 'git' && <GitSidebarPanel/>}
      {activeSidebarPanel === 'extensions' && <ExtensionsPanel/>}
      {activeSidebarPanel === 'typescript' && <TypeScriptPanel/>}
      <ResizeHandle direction="horizontal" onResize={delta => setSidebarWidth(sidebarWidth + delta)}/>
    </div>
  );
}
