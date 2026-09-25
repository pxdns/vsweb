import { useEditorStore } from '../../store/editor';
import { TabBar } from '../tabs/TabBar';
import { MonacoEditor } from './MonacoEditor';
import { Breadcrumbs } from './Breadcrumbs';
import { IconVSWeb } from '../common/Icons';

function WelcomePane() {
  return (
    <div className="editor-welcome">
      <IconVSWeb size={48}/>
      <h2>VSWeb IDE</h2>
      <p>Open a file from the explorer to start editing</p>
      <p style={{ fontSize: 11, marginTop: 8, color: 'var(--fg3)' }}>
        Press <kbd>Ctrl+P</kbd> to open a file &nbsp;&nbsp; <kbd>Ctrl+Shift+P</kbd> for commands
      </p>
    </div>
  );
}

export function EditorArea() {
  const { layout, closeSplit } = useEditorStore();

  return (
    <div className="editor-splits">
      {layout.splits.map((split, idx) => {
        const isActiveSplit = split.id === layout.activeSplitId;
        const activeTab = split.tabs.find(t => t.id === split.activeTabId);

        return (
          <div
            key={split.id}
            className={`editor-split${isActiveSplit ? ' active-split' : ''}`}
          >
            <TabBar split={split} isActiveSplit={isActiveSplit}/>
            {activeTab && <Breadcrumbs tab={activeTab}/>}
            <div className="editor-container">
              {split.tabs.length === 0 ? (
                <WelcomePane/>
              ) : (
                split.tabs.map(tab => (
                  <div
                    key={tab.id}
                    style={{
                      display: tab.id === split.activeTabId ? 'flex' : 'none',
                      width: '100%',
                      height: '100%',
                    }}
                  >
                    <MonacoEditor
                      tab={tab}
                      splitId={split.id}
                      isActive={tab.id === split.activeTabId && isActiveSplit}
                    />
                  </div>
                ))
              )}
            </div>
            {idx > 0 && (
              <button
                style={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  zIndex: 10,
                  width: 20,
                  height: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--bg3)',
                  borderRadius: 3,
                  color: 'var(--fg2)',
                  fontSize: 12,
                  cursor: 'pointer',
                  border: '1px solid var(--border)',
                }}
                onClick={() => closeSplit(split.id)}
                title="Close Split"
              >
                ×
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
