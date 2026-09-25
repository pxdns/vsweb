import { useState, useEffect, useCallback } from 'react';
import * as monaco from 'monaco-editor';
import { useEditorStore } from '../../store/editor';
import { IconTypeScript, IconChevronRight } from '../common/Icons';

interface OutlineItem {
  name: string;
  detail?: string;
  kind: monaco.languages.SymbolKind;
  range: monaco.IRange;
  selectionRange: monaco.IRange;
  children: OutlineItem[];
}

async function getDocumentSymbols(model: monaco.editor.ITextModel): Promise<OutlineItem[]> {
  try {
    // Use Monaco's document symbol providers
    const providers = (monaco.languages as any)._registry?._entries ?? [];
    // Fallback: use the internal outline model approach
    const tokenizationSupport = (monaco.languages as any).DocumentSymbolProviderRegistry;
    if (tokenizationSupport) {
      const ordered = tokenizationSupport.ordered(model);
      if (ordered && ordered.length > 0) {
        const results = await Promise.all(
          ordered.map((p: any) => p.provideDocumentSymbols(model, new (monaco as any).CancellationTokenSource().token))
        );
        const symbols = results.flat().filter(Boolean) as any[];
        return symbols.map(mapSymbol);
      }
    }
  } catch {}
  return [];
}

function mapSymbol(s: any): OutlineItem {
  return {
    name: s.name,
    detail: s.detail,
    kind: s.kind,
    range: s.range,
    selectionRange: s.selectionRange ?? s.range,
    children: (s.children ?? []).map(mapSymbol),
  };
}

const KIND_INFO: Record<number, { label: string; color: string }> = {
  0: { label: 'file', color: 'var(--fg2)' },
  1: { label: 'mod', color: 'var(--syntax-keyword)' },
  2: { label: 'ns', color: 'var(--syntax-keyword)' },
  3: { label: 'pkg', color: 'var(--syntax-keyword)' },
  4: { label: 'cls', color: 'var(--syntax-type)' },
  5: { label: 'mth', color: 'var(--syntax-function)' },
  6: { label: 'prp', color: 'var(--syntax-variable)' },
  7: { label: 'fld', color: 'var(--syntax-variable)' },
  8: { label: 'ctr', color: 'var(--syntax-function)' },
  9: { label: 'enm', color: 'var(--syntax-type)' },
  10: { label: 'ifc', color: 'var(--syntax-type)' },
  11: { label: 'fn', color: 'var(--syntax-function)' },
  12: { label: 'var', color: 'var(--syntax-variable)' },
  13: { label: 'const', color: 'var(--syntax-variable)' },
  14: { label: 'str', color: 'var(--syntax-string)' },
  15: { label: 'num', color: 'var(--syntax-number)' },
  16: { label: 'bool', color: 'var(--syntax-keyword)' },
  17: { label: 'arr', color: 'var(--syntax-variable)' },
  18: { label: 'obj', color: 'var(--syntax-variable)' },
  19: { label: 'key', color: 'var(--syntax-variable)' },
  20: { label: 'null', color: 'var(--fg3)' },
  21: { label: 'emb', color: 'var(--accent)' },
  22: { label: 'strc', color: 'var(--syntax-type)' },
  23: { label: 'evt', color: 'var(--accent)' },
  24: { label: 'op', color: 'var(--syntax-function)' },
  25: { label: 'typ', color: 'var(--syntax-type)' },
};

export function TypeScriptPanel() {
  const { getActiveTab, layout } = useEditorStore();
  const activeTab = getActiveTab();
  const [outlineItems, setOutlineItems] = useState<OutlineItem[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshOutline = useCallback(async () => {
    if (!activeTab || !['typescript', 'javascript', 'typescriptreact', 'javascriptreact'].includes(activeTab.language)) {
      setOutlineItems([]);
      return;
    }

    const modelUri = monaco.Uri.parse(`file://${activeTab.path}`);
    const model = monaco.editor.getModel(modelUri);
    if (!model) {
      setOutlineItems([]);
      return;
    }

    setLoading(true);
    try {
      const symbols = await getDocumentSymbols(model);
      setOutlineItems(symbols);
    } catch {
      setOutlineItems([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab?.id, activeTab?.language, activeTab?.path]);

  useEffect(() => {
    refreshOutline();

    if (!activeTab) return;
    const modelUri = monaco.Uri.parse(`file://${activeTab.path}`);
    const model = monaco.editor.getModel(modelUri);
    if (!model) return;

    // Debounced refresh on content change
    let timer: ReturnType<typeof setTimeout>;
    const disposable = model.onDidChangeContent(() => {
      clearTimeout(timer);
      timer = setTimeout(refreshOutline, 800);
    });
    return () => {
      disposable.dispose();
      clearTimeout(timer);
    };
  }, [activeTab?.id, refreshOutline]);

  if (!activeTab) {
    return (
      <>
        <div className="sidebar-header">
          <span className="sidebar-title">TypeScript</span>
        </div>
        <div className="empty-state">
          <div className="empty-state-title">No file open</div>
          <div className="empty-state-text">Open a TypeScript or JavaScript file to see its structure</div>
        </div>
      </>
    );
  }

  const isTs = ['typescript', 'javascript', 'typescriptreact', 'javascriptreact'].includes(activeTab.language);

  return (
    <>
      <div className="sidebar-header">
        <span className="sidebar-title">TypeScript</span>
      </div>
      <div className="sidebar-content">
        {/* Current file header */}
        <div style={{
          padding: '6px 12px',
          borderBottom: '1px solid var(--border)',
          fontSize: 11,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}>
          <IconTypeScript size={13}/>
          <span style={{ color: 'var(--fg1)', fontWeight: 500 }}>{activeTab.name}</span>
          {!isTs && <span style={{ color: 'var(--fg3)', fontSize: 10 }}>(not TypeScript)</span>}
        </div>

        {isTs && (
          <>
            {/* Outline section */}
            <div>
              <div style={{
                padding: '6px 12px 4px',
                fontSize: 10,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.07em',
                color: 'var(--fg3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <span>Outline</span>
                {loading && <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, fontSize: 10, color: 'var(--fg3)' }}>…</span>}
              </div>
              {outlineItems.length === 0 && !loading ? (
                <div style={{ padding: '6px 12px', fontSize: 11, color: 'var(--fg3)' }}>
                  No symbols found
                </div>
              ) : (
                <div>
                  {outlineItems.map((item, i) => (
                    <SymbolItem key={i} item={item} depth={0} path={activeTab.path}/>
                  ))}
                </div>
              )}
            </div>

            {/* Diagnostics summary */}
            <DiagnosticsSummary path={activeTab.path}/>
          </>
        )}
      </div>
    </>
  );
}

function DiagnosticsSummary({ path }: { path: string }) {
  const [counts, setCounts] = useState({ errors: 0, warnings: 0 });

  useEffect(() => {
    const update = () => {
      const modelUri = monaco.Uri.parse(`file://${path}`);
      const markers = monaco.editor.getModelMarkers({ resource: modelUri });
      setCounts({
        errors: markers.filter(m => m.severity === monaco.MarkerSeverity.Error).length,
        warnings: markers.filter(m => m.severity === monaco.MarkerSeverity.Warning).length,
      });
    };
    update();
    const d = monaco.editor.onDidChangeMarkers(() => update());
    return () => d.dispose();
  }, [path]);

  if (counts.errors === 0 && counts.warnings === 0) {
    return (
      <div style={{ padding: '8px 12px', borderTop: '1px solid var(--border)', fontSize: 11, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: 6 }}>
        <span>✓</span>
        <span>No problems</span>
      </div>
    );
  }

  return (
    <div style={{ padding: '8px 12px', borderTop: '1px solid var(--border)', fontSize: 11, display: 'flex', gap: 12 }}>
      {counts.errors > 0 && (
        <span style={{ color: 'var(--error)' }}>✗ {counts.errors} error{counts.errors !== 1 ? 's' : ''}</span>
      )}
      {counts.warnings > 0 && (
        <span style={{ color: 'var(--warning)' }}>⚠ {counts.warnings} warning{counts.warnings !== 1 ? 's' : ''}</span>
      )}
    </div>
  );
}

function SymbolItem({ item, depth, path }: { item: OutlineItem; depth: number; path: string }) {
  const [expanded, setExpanded] = useState(depth < 1);
  const kindInfo = KIND_INFO[item.kind as number] ?? { label: '??', color: 'var(--fg2)' };
  const hasChildren = item.children && item.children.length > 0;

  const navigate = () => {
    const modelUri = monaco.Uri.parse(`file://${path}`);
    const editors = monaco.editor.getEditors();
    for (const ed of editors) {
      if (ed.getModel()?.uri.toString() === modelUri.toString()) {
        ed.revealLineInCenter(item.selectionRange.startLineNumber);
        ed.setPosition({ lineNumber: item.selectionRange.startLineNumber, column: item.selectionRange.startColumn });
        ed.focus();
        break;
      }
    }
    if (hasChildren) setExpanded(e => !e);
  };

  return (
    <>
      <div
        className="tree-item"
        style={{ paddingLeft: depth * 12 + 8 }}
        onClick={navigate}
      >
        {hasChildren ? (
          <span className={`tree-item-arrow${expanded ? ' expanded' : ''}`}>
            <IconChevronRight size={10}/>
          </span>
        ) : (
          <span style={{ width: 16, flexShrink: 0 }}/>
        )}
        <span style={{
          fontSize: 9,
          padding: '1px 3px',
          borderRadius: 2,
          background: 'var(--bg3)',
          color: kindInfo.color,
          fontFamily: 'monospace',
          marginRight: 6,
          flexShrink: 0,
          minWidth: 22,
          textAlign: 'center',
          letterSpacing: '0.02em',
        }}>
          {kindInfo.label}
        </span>
        <span className="tree-item-name" style={{ color: kindInfo.color }}>
          {item.name}
        </span>
        {item.detail && (
          <span style={{ fontSize: 10, color: 'var(--fg3)', marginLeft: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
            {item.detail}
          </span>
        )}
        <span style={{ fontSize: 10, color: 'var(--fg3)', marginLeft: 'auto', paddingRight: 4, flexShrink: 0 }}>
          :{item.selectionRange.startLineNumber}
        </span>
      </div>
      {hasChildren && expanded && item.children.map((child, i) => (
        <SymbolItem key={i} item={child} depth={depth + 1} path={path}/>
      ))}
    </>
  );
}
