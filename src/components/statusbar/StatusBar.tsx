import { useState, useEffect } from 'react';
import * as monaco from 'monaco-editor';
import { useEditorStore } from '../../store/editor';
import { useSettingsStore } from '../../store/settings';
import { useWorkspaceStore } from '../../store/workspace';
import { useUIStore } from '../../store/ui';
import { IconGitBranch, IconError, IconWarning, IconSettings } from '../common/Icons';

function useDiagnosticCounts() {
  const [counts, setCounts] = useState({ errors: 0, warnings: 0 });

  useEffect(() => {
    const update = () => {
      const markers = monaco.editor.getModelMarkers({});
      setCounts({
        errors: markers.filter(m => m.severity === monaco.MarkerSeverity.Error).length,
        warnings: markers.filter(m => m.severity === monaco.MarkerSeverity.Warning).length,
      });
    };
    update();
    const d = monaco.editor.onDidChangeMarkers(() => update());
    return () => d.dispose();
  }, []);

  return counts;
}

function useCursorPosition() {
  const [pos, setPos] = useState({ line: 1, col: 1 });

  useEffect(() => {
    const updateFromEditor = () => {
      const editors = monaco.editor.getEditors();
      // Find the focused editor
      for (const ed of editors) {
        if (ed.hasTextFocus()) {
          const p = ed.getPosition();
          if (p) setPos({ line: p.lineNumber, col: p.column });
          return;
        }
      }
    };

    // Subscribe to cursor changes on all editors
    const disposables: monaco.IDisposable[] = [];

    const attachToEditor = (ed: monaco.editor.ICodeEditor) => {
      disposables.push(ed.onDidChangeCursorPosition(e => {
        setPos({ line: e.position.lineNumber, col: e.position.column });
      }));
    };

    // Attach to existing editors
    monaco.editor.getEditors().forEach(attachToEditor);

    // Attach to future editors
    const d = monaco.editor.onDidCreateEditor(attachToEditor);
    disposables.push(d);

    return () => disposables.forEach(d => d.dispose());
  }, []);

  return pos;
}

export function StatusBar() {
  const { getActiveTab } = useEditorStore();
  const { settings, setTheme } = useSettingsStore();
  const { getActiveWorkspace } = useWorkspaceStore();
  const { setSettingsOpen, openBottomPanel, setSidebarPanel } = useUIStore();

  const activeTab = getActiveTab();
  const workspace = getActiveWorkspace();
  const { errors, warnings } = useDiagnosticCounts();
  const cursorPos = useCursorPosition();

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
        {/* Diagnostics counts */}
        <div
          className="status-item"
          onClick={() => openBottomPanel('problems')}
          title="Problems"
          style={{ gap: 8 }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 3, color: errors > 0 ? 'var(--error)' : 'inherit' }}>
            <IconError size={12}/> {errors}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3, color: warnings > 0 ? 'var(--warning)' : 'inherit' }}>
            <IconWarning size={12}/> {warnings}
          </span>
        </div>
      </div>

      <div className="status-bar-right">
        {activeTab && (
          <>
            <div className="status-item">
              {activeTab.language}
            </div>
            <div className="status-item" title="Go to Line">
              Ln {cursorPos.line}, Col {cursorPos.col}
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
            const themeList = ['dark', 'light', 'monokai', 'nord', 'solarized-dark', 'high-contrast-dark'] as const;
            const current = themeList.indexOf(settings.appearance.theme as any);
            const next = themeList[(current + 1) % themeList.length];
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
