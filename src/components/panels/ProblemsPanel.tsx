import { useEditorStore } from '../../store/editor';
import { IconError, IconWarning, IconInfo } from '../common/Icons';

// In a real implementation, this would connect to Monaco's diagnostic services
// For now we show Monaco's markers for open files

export function ProblemsPanel() {
  const { layout } = useEditorStore();

  // Collect all open files across splits
  const openTabs = layout.splits.flatMap(s => s.tabs);

  if (openTabs.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-title">No problems</div>
        <div className="empty-state-text">Open a TypeScript file to see diagnostics</div>
      </div>
    );
  }

  // We'll show Monaco markers dynamically
  return <ProblemsFromMonaco tabs={openTabs}/>;
}

function ProblemsFromMonaco({ tabs }: { tabs: Array<{ fileId: string; path: string; name: string }> }) {
  // Import monaco lazily to get markers
  const [problems, setProblems] = useState<Array<{
    fileId: string; name: string; path: string;
    line: number; column: number; message: string; severity: string;
  }>>([]);

  useEffect(() => {
    const updateProblems = () => {
      try {
        const monaco = (window as any).__monaco__;
        if (!monaco) return;
        const markers = monaco.editor.getModelMarkers({});
        const newProblems = markers.map((m: any) => ({
          fileId: '',
          name: m.resource.path.split('/').pop() ?? '',
          path: m.resource.path,
          line: m.startLineNumber,
          column: m.startColumn,
          message: m.message,
          severity: m.severity === 8 ? 'error' : m.severity === 4 ? 'warning' : 'info',
        }));
        setProblems(newProblems);
      } catch {}
    };

    const interval = setInterval(updateProblems, 2000);
    updateProblems();
    return () => clearInterval(interval);
  }, []);

  const errors = problems.filter(p => p.severity === 'error');
  const warnings = problems.filter(p => p.severity === 'warning');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <div style={{
        padding: '6px 12px',
        borderBottom: '1px solid var(--border)',
        fontSize: 11,
        color: 'var(--fg2)',
        display: 'flex',
        gap: 12,
        flexShrink: 0,
      }}>
        <span style={{ color: 'var(--error)', display: 'flex', alignItems: 'center', gap: 4 }}>
          <IconError size={12}/> {errors.length} error{errors.length !== 1 ? 's' : ''}
        </span>
        <span style={{ color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: 4 }}>
          <IconWarning size={12}/> {warnings.length} warning{warnings.length !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="problems-list">
        {problems.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-title">No problems detected</div>
            <div className="empty-state-text">Problems from TypeScript and other tools will appear here</div>
          </div>
        ) : (
          problems.map((p, i) => (
            <div key={i} className="problem-item">
              <span className={`problem-icon ${p.severity}`}>
                {p.severity === 'error' ? <IconError size={13}/> : <IconWarning size={13}/>}
              </span>
              <span className="problem-message">{p.message}</span>
              <span className="problem-location">{p.name}:{p.line}:{p.column}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// eslint-disable-next-line react-hooks/rules-of-hooks
import { useState, useEffect } from 'react';
