import { useUIStore } from '../store/ui';
import { Codicon } from './common/Icons';

const TOP_ITEMS = [
  { id: 'explorer', icon: 'files', title: 'Explorer (Ctrl+Shift+E)' },
  { id: 'search', icon: 'search', title: 'Search (Ctrl+Shift+F)' },
  { id: 'git', icon: 'source-control', title: 'Source Control (Ctrl+Shift+G)' },
  { id: 'typescript', icon: 'symbol-namespace', title: 'TypeScript Explorer' },
  { id: 'extensions', icon: 'extensions', title: 'Extensions (Ctrl+Shift+X)' },
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
            <Codicon name={item.icon} size={24}/>
          </button>
        ))}
      </div>

      <div className="activity-bar-bottom">
        <button
          className="activity-btn"
          onClick={() => setSettingsOpen(true)}
          title="Settings"
        >
          <Codicon name="settings-gear" size={24}/>
        </button>
      </div>
    </div>
  );
}
