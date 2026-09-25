import { useUIStore } from '../../store/ui';
import { ResizeHandle } from '../common/ResizeHandle';
import { TerminalPanel } from './TerminalPanel';
import { ProblemsPanel } from './ProblemsPanel';
import { OutputPanel } from './OutputPanel';
import { GitPanel } from './GitPanel';
import { PreviewPanel } from './PreviewPanel';
import { ApiPanel } from './ApiPanel';
import { PackagesPanel } from './PackagesPanel';
import { EnvPanel } from './EnvPanel';
import { IconClose } from '../common/Icons';

const PANELS = [
  { id: 'terminal', label: 'Terminal' },
  { id: 'problems', label: 'Problems' },
  { id: 'output', label: 'Output' },
  { id: 'preview', label: 'Preview' },
  { id: 'api', label: 'API' },
  { id: 'packages', label: 'Packages' },
  { id: 'env', label: 'Environment' },
] as const;

export function BottomPanel() {
  const {
    bottomPanelHeight,
    setBottomPanelHeight,
    activeBottomPanel,
    setBottomPanel,
    toggleBottomPanel,
  } = useUIStore();

  return (
    <div className="bottom-panel" style={{ height: bottomPanelHeight }}>
      <ResizeHandle
        direction="vertical"
        className="resize-handle-top"
        onResize={delta => setBottomPanelHeight(bottomPanelHeight - delta)}
      />
      <div className="bottom-panel-tabs">
        {PANELS.map(p => (
          <button
            key={p.id}
            className={`panel-tab${activeBottomPanel === p.id ? ' active' : ''}`}
            onClick={() => setBottomPanel(p.id as any)}
          >
            {p.label}
          </button>
        ))}
        <div className="panel-actions">
          <button className="sidebar-action-btn" onClick={toggleBottomPanel} title="Close Panel">
            <IconClose size={12}/>
          </button>
        </div>
      </div>
      <div className="bottom-panel-content">
        {activeBottomPanel === 'terminal' && <TerminalPanel/>}
        {activeBottomPanel === 'problems' && <ProblemsPanel/>}
        {activeBottomPanel === 'output' && <OutputPanel/>}
        {activeBottomPanel === ('git' as string) && <GitPanel/>}
        {activeBottomPanel === 'preview' && <PreviewPanel/>}
        {activeBottomPanel === 'api' && <ApiPanel/>}
        {activeBottomPanel === 'packages' && <PackagesPanel/>}
        {activeBottomPanel === 'env' && <EnvPanel/>}
      </div>
    </div>
  );
}
