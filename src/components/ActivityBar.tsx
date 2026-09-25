import { useUIStore } from '../store/ui';
import {
  IconFolder, IconSearch, IconGitBranch, IconExtensions,
  IconSettings, IconTypescript2, IconVSWeb,
} from './common/Icons';

const TOP_ITEMS = [
  { id: 'explorer', icon: <IconFolder size={20}/>, title: 'Explorer (Ctrl+Shift+E)' },
  { id: 'search', icon: <IconSearch size={20}/>, title: 'Search (Ctrl+Shift+F)' },
  { id: 'git', icon: <IconGitBranch size={20}/>, title: 'Source Control (Ctrl+Shift+G)' },
  { id: 'typescript', icon: <IconTypescript2 size={20}/>, title: 'TypeScript Explorer' },
  { id: 'extensions', icon: <IconExtensions size={20}/>, title: 'Extensions (Ctrl+Shift+X)' },
] as const;

export function ActivityBar() {
  const { activeSidebarPanel, setSidebarPanel, setSettingsOpen } = useUIStore();

  return (
    <div className="activity-bar">
      <div className="activity-bar-top">
        {TOP_ITEMS.map(item => (
          <button
            key={item.id}
            className={`activity-btn${activeSidebarPanel === item.id ? ' active' : ''}`}
            onClick={() => setSidebarPanel(item.id)}
            title={item.title}
          >
            {item.icon}
          </button>
        ))}
      </div>

      <div className="activity-bar-bottom">
        <button
          className="activity-btn"
          onClick={() => setSettingsOpen(true)}
          title="Settings"
        >
          <IconSettings size={20}/>
        </button>
      </div>
    </div>
  );
}
