import { useState, useEffect } from 'react';
import * as monaco from 'monaco-editor';
import { useEditorStore } from '../../store/editor';
import { IconTypeScript, IconFile, IconChevronRight } from '../common/Icons';

interface TypeInfo {
  symbol: string;
  type: string;
  documentation?: string;
  location?: string;
}

export function TypeScriptPanel() {
  const { getActiveTab } = useEditorStore();
  const activeTab = getActiveTab();
  const [hoveredInfo, setHoveredInfo] = useState<TypeInfo | null>(null);
  const [outlineItems, setOutlineItems] = useState<OutlineItem[]>([]);

  // Get outline symbols from Monaco for the active file
  useEffect(() => {
    if (!activeTab || !['typescript', 'javascript'].includes(activeTab.language)) {
      setOutlineItems([]);
      return;
    }

    const modelUri = monaco.Uri.parse(`file://${activeTab.path}`);
    const model = monaco.editor.getModel(modelUri);
    if (!model) return;

    const updateOutline = async () => {
      try {
        // @ts-ignore - getOutlineModel is internal
        const symbols = await monaco.languages.getOutlineModel?.(model);
        if (symbols && (symbols as any)._groups) {
          const items = flattenSymbols((symbols as any)._groups);
          setOutlineItems(items);
        }
      } catch {
        setOutlineItems([]);
      }
    };

    updateOutline();
    const listener = model.onDidChangeContent(() => updateOutline());
    return () => listener.dispose();
  }, [activeTab?.id]);

  if (!activeTab) {
    return (
      <>
        <div className="sidebar-header">
          <span className="sidebar-title">TypeScript</span>
        </div>
        <div className="empty-state">
          <div className="empty-state-title">No file open</div>
          <div className="empty-state-text">Open a TypeScript file to explore its types</div>
        </div>
      </>
    );
  }

  const isTs = ['typescript', 'javascript'].includes(activeTab.language);

  return (
    <>
      <div className="sidebar-header">
        <span className="sidebar-title">TypeScript</span>
      </div>
      <div className="sidebar-content">
        {/* Current file info */}
        <div style={{
          padding: '8px 12px',
          borderBottom: '1px solid var(--border)',
          fontSize: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}>
          <IconTypeScript size={14}/>
          <span style={{ color: 'var(--fg1)' }}>{activeTab.name}</span>
          {!isTs && <span style={{ color: 'var(--fg3)', fontSize: 11 }}>(not TypeScript)</span>}
        </div>

        {isTs && (
          <>
            <OutlineSection items={outlineItems} fileId={activeTab.fileId} path={activeTab.path}/>

            {/* Type info panel */}
            <div style={{ padding: '8px 12px', borderTop: '1px solid var(--border)' }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--fg3)', marginBottom: 8 }}>
                Hover Info
              </div>
              <div style={{ fontSize: 11, color: 'var(--fg2)', lineHeight: 1.6 }}>
                Hover over a symbol in the editor to see type information here.
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

interface OutlineItem {
  name: string;
  kind: number;
  range: { startLineNumber: number };
  children?: OutlineItem[];
}

function flattenSymbols(groups: any[]): OutlineItem[] {
  const items: OutlineItem[] = [];
  for (const g of groups) {
    if (g.label) {
      items.push({
        name: g.label,
        kind: g.kind,
        range: g.range ?? { startLineNumber: 0 },
        children: g.children ? flattenSymbols(g.children) : [],
      });
    }
  }
  return items;
}

const SYMBOL_KINDS: Record<number, { label: string; color: string }> = {
  5: { label: 'class', color: 'var(--syntax-type)' },
  11: { label: 'interface', color: 'var(--syntax-type)' },
  12: { label: 'function', color: 'var(--syntax-function)' },
  13: { label: 'variable', color: 'var(--syntax-variable)' },
  8: { label: 'field', color: 'var(--syntax-variable)' },
  6: { label: 'method', color: 'var(--syntax-function)' },
  10: { label: 'enum', color: 'var(--syntax-type)' },
  1: { label: 'module', color: 'var(--syntax-keyword)' },
  2: { label: 'namespace', color: 'var(--syntax-keyword)' },
  14: { label: 'const', color: 'var(--syntax-variable)' },
  15: { label: 'enum member', color: 'var(--syntax-number)' },
  17: { label: 'property', color: 'var(--syntax-variable)' },
  18: { label: 'event', color: 'var(--accent)' },
  20: { label: 'type', color: 'var(--syntax-type)' },
  21: { label: 'alias', color: 'var(--syntax-type)' },
};

function OutlineSection({ items, fileId, path }: { items: OutlineItem[]; fileId: string; path: string }) {
  const openFile = useEditorStore(s => s.openFile);

  return (
    <div>
      <div style={{ padding: '6px 12px 2px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--fg3)' }}>
        Outline
      </div>
      {items.length === 0 ? (
        <div style={{ padding: '8px 12px', fontSize: 11, color: 'var(--fg3)' }}>
          No symbols found
        </div>
      ) : (
        <div>
          {items.map((item, i) => (
            <OutlineItem key={i} item={item} depth={0} onOpen={() => openFile(fileId)}/>
          ))}
        </div>
      )}
    </div>
  );
}

function OutlineItem({ item, depth, onOpen }: { item: OutlineItem; depth: number; onOpen: () => void }) {
  const [expanded, setExpanded] = useState(true);
  const kindInfo = SYMBOL_KINDS[item.kind] ?? { label: 'symbol', color: 'var(--fg2)' };
  const hasChildren = item.children && item.children.length > 0;

  return (
    <>
      <div
        className="tree-item"
        style={{ paddingLeft: depth * 12 + 8 }}
        onClick={() => {
          onOpen();
          if (hasChildren) setExpanded(!expanded);
        }}
      >
        {hasChildren ? (
          <span className={`tree-item-arrow${expanded ? ' expanded' : ''}`}>
            <IconChevronRight size={10}/>
          </span>
        ) : (
          <span style={{ width: 16, flexShrink: 0 }}/>
        )}
        <span style={{
          fontSize: 10,
          padding: '0 4px',
          borderRadius: 2,
          background: 'var(--bg3)',
          color: kindInfo.color,
          fontFamily: 'monospace',
          marginRight: 6,
          flexShrink: 0,
        }}>
          {kindInfo.label.slice(0, 2)}
        </span>
        <span className="tree-item-name" style={{ color: kindInfo.color }}>
          {item.name}
        </span>
        <span style={{ fontSize: 10, color: 'var(--fg3)', marginLeft: 'auto', paddingRight: 4 }}>
          :{item.range.startLineNumber}
        </span>
      </div>
      {hasChildren && expanded && item.children?.map((child, i) => (
        <OutlineItem key={i} item={child} depth={depth + 1} onOpen={onOpen}/>
      ))}
    </>
  );
}
