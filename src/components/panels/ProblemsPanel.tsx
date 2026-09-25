import { useState, useEffect, useCallback } from 'react';
import * as monaco from 'monaco-editor';
import { useEditorStore } from '../../store/editor';
import { IconError, IconWarning, IconInfo } from '../common/Icons';

interface Problem {
  uri: string;
  name: string;
  path: string;
  line: number;
  column: number;
  endLine: number;
  endColumn: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
  code?: string | number;
  source?: string;
}

function severityLabel(s: monaco.MarkerSeverity): 'error' | 'warning' | 'info' {
  if (s === monaco.MarkerSeverity.Error) return 'error';
  if (s === monaco.MarkerSeverity.Warning) return 'warning';
  return 'info';
}

export function ProblemsPanel() {
  const { layout } = useEditorStore();
  const [problems, setProblems] = useState<Problem[]>([]);

  const refresh = useCallback(() => {
    const markers = monaco.editor.getModelMarkers({});
    const next: Problem[] = markers.map(m => ({
      uri: m.resource.toString(),
      name: m.resource.path.split('/').pop() ?? m.resource.path,
      path: m.resource.path,
      line: m.startLineNumber,
      column: m.startColumn,
      endLine: m.endLineNumber,
      endColumn: m.endColumn,
      message: m.message,
      severity: severityLabel(m.severity),
      code: m.code as string | number | undefined,
      source: m.source,
    }));
    // Sort: errors first, then warnings, then info; within group by file then line
    next.sort((a, b) => {
      const sev = { error: 0, warning: 1, info: 2 };
      const sd = sev[a.severity] - sev[b.severity];
      if (sd !== 0) return sd;
      const pd = a.path.localeCompare(b.path);
      if (pd !== 0) return pd;
      return a.line - b.line;
    });
    setProblems(next);
  }, []);

  useEffect(() => {
    refresh();
    const disposable = monaco.editor.onDidChangeMarkers(() => refresh());
    return () => disposable.dispose();
  }, [refresh]);

  const openProblem = useCallback((p: Problem) => {
    // Find file in any open tab by path
    const allTabs = layout.splits.flatMap(s => s.tabs);
    const tab = allTabs.find(t => t.path === p.path);
    if (tab) {
      // Navigate existing editor to the line
      const modelUri = monaco.Uri.parse(`file://${p.path}`);
      const model = monaco.editor.getModel(modelUri);
      // Find the editor instance and reveal position
      const editors = monaco.editor.getEditors();
      for (const ed of editors) {
        if (ed.getModel()?.uri.toString() === modelUri.toString()) {
          ed.revealLineInCenter(p.line);
          ed.setPosition({ lineNumber: p.line, column: p.column });
          ed.focus();
          break;
        }
      }
    }
  }, [layout.splits]);

  const errors = problems.filter(p => p.severity === 'error');
  const warnings = problems.filter(p => p.severity === 'warning');
  const infos = problems.filter(p => p.severity === 'info');

  // Group by file
  const byFile = new Map<string, Problem[]>();
  for (const p of problems) {
    const key = p.path;
    if (!byFile.has(key)) byFile.set(key, []);
    byFile.get(key)!.push(p);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', height: '100%' }}>
      {/* Summary bar */}
      <div style={{
        padding: '5px 12px',
        borderBottom: '1px solid var(--border)',
        fontSize: 11,
        color: 'var(--fg2)',
        display: 'flex',
        gap: 16,
        flexShrink: 0,
        background: 'var(--bg1)',
      }}>
        <span style={{ color: errors.length > 0 ? 'var(--error)' : 'var(--fg3)', display: 'flex', alignItems: 'center', gap: 4 }}>
          <IconError size={12}/> {errors.length}
        </span>
        <span style={{ color: warnings.length > 0 ? 'var(--warning)' : 'var(--fg3)', display: 'flex', alignItems: 'center', gap: 4 }}>
          <IconWarning size={12}/> {warnings.length}
        </span>
        <span style={{ color: infos.length > 0 ? 'var(--info)' : 'var(--fg3)', display: 'flex', alignItems: 'center', gap: 4 }}>
          <IconInfo size={12}/> {infos.length}
        </span>
        <span style={{ marginLeft: 'auto', color: 'var(--fg3)', fontSize: 10 }}>
          {problems.length === 0 ? 'No problems' : `${problems.length} problem${problems.length !== 1 ? 's' : ''}`}
        </span>
      </div>

      {/* Problems list */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {problems.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-title">No problems detected</div>
            <div className="empty-state-text">TypeScript diagnostics for open files appear here</div>
          </div>
        ) : (
          Array.from(byFile.entries()).map(([path, fileProblems]) => (
            <div key={path}>
              {/* File header */}
              <div style={{
                padding: '4px 12px',
                fontSize: 11,
                color: 'var(--fg2)',
                background: 'var(--bg2)',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontWeight: 500,
              }}>
                <span style={{ color: 'var(--fg1)' }}>{path.split('/').pop()}</span>
                <span style={{ color: 'var(--fg3)', fontSize: 10 }}>{path}</span>
                <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--fg3)' }}>
                  {fileProblems.filter(p => p.severity === 'error').length > 0 && (
                    <span style={{ color: 'var(--error)', marginRight: 6 }}>
                      {fileProblems.filter(p => p.severity === 'error').length}E
                    </span>
                  )}
                  {fileProblems.filter(p => p.severity === 'warning').length > 0 && (
                    <span style={{ color: 'var(--warning)' }}>
                      {fileProblems.filter(p => p.severity === 'warning').length}W
                    </span>
                  )}
                </span>
              </div>
              {/* Problems in this file */}
              {fileProblems.map((p, i) => (
                <div
                  key={i}
                  className="problem-item"
                  onClick={() => openProblem(p)}
                  style={{ cursor: 'pointer' }}
                >
                  <span className={`problem-icon ${p.severity}`}>
                    {p.severity === 'error' ? <IconError size={13}/> : p.severity === 'warning' ? <IconWarning size={13}/> : <IconInfo size={13}/>}
                  </span>
                  <span className="problem-message">{p.message}</span>
                  <span className="problem-location">
                    {p.source ? `${p.source} ` : ''}
                    {p.code ? `(${p.code}) ` : ''}
                    [{p.line},{p.column}]
                  </span>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
