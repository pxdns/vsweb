import { useRef } from 'react';
import { useEditorStore } from '../../store/editor';
import { getFileIcon, IconClose, IconPin, IconSplitHorizontal } from '../common/Icons';
import { ContextMenu, type ContextMenuEntry } from '../common/ContextMenu';
import { useState } from 'react';
import type { EditorTab, EditorSplit } from '../../types';

interface Props {
  split: EditorSplit;
  isActiveSplit: boolean;
}

export function TabBar({ split, isActiveSplit }: Props) {
  const {
    closeTab, closeAllTabs, closeOtherTabs, setActiveTab, pinTab, unpinTab, splitEditor, setActiveSplit,
  } = useEditorStore();
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; tab: EditorTab } | null>(null);

  const handleTabClick = (tab: EditorTab, e: React.MouseEvent) => {
    if (e.button === 1) {
      // Middle click: close
      closeTab(tab.id, split.id);
      return;
    }
    setActiveSplit(split.id);
    setActiveTab(tab.id, split.id);
  };

  const handleTabClose = (tab: EditorTab, e: React.MouseEvent) => {
    e.stopPropagation();
    closeTab(tab.id, split.id);
  };

  const handleContextMenu = (tab: EditorTab, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, tab });
  };

  const getContextItems = (tab: EditorTab): ContextMenuEntry[] => [
    {
      id: 'close', label: 'Close', shortcut: 'Ctrl+W',
      onClick: () => closeTab(tab.id, split.id),
    },
    {
      id: 'close-others', label: 'Close Others',
      onClick: () => closeOtherTabs(tab.id, split.id),
    },
    {
      id: 'close-all', label: 'Close All',
      onClick: () => closeAllTabs(split.id),
    },
    { id: 'sep1', separator: true },
    tab.isPinned
      ? { id: 'unpin', label: 'Unpin Tab', onClick: () => unpinTab(tab.id, split.id) }
      : { id: 'pin', label: 'Pin Tab', onClick: () => pinTab(tab.id, split.id) },
    { id: 'sep2', separator: true },
    {
      id: 'copy-path', label: 'Copy Path',
      onClick: () => navigator.clipboard.writeText(tab.path),
    },
  ];

  return (
    <div
      className="tab-bar"
      onClick={() => setActiveSplit(split.id)}
    >
      {split.tabs.map(tab => {
        const isActive = tab.id === split.activeTabId && isActiveSplit;
        return (
          <div
            key={tab.id}
            className={`tab${isActive ? ' active' : ''}`}
            onClick={(e) => handleTabClick(tab, e)}
            onMouseDown={(e) => { if (e.button === 1) e.preventDefault(); }}
            onContextMenu={(e) => handleContextMenu(tab, e)}
            title={tab.path}
          >
            {tab.isPinned && (
              <span className="tab-pin-indicator">
                <IconPin size={8}/>
              </span>
            )}
            <span className="tab-icon">
              {getFileIcon(tab.name, false)}
            </span>
            <span className="tab-name">{tab.name}</span>
            {tab.isDirty ? (
              <span className="tab-dirty-dot" title="Unsaved changes" />
            ) : (
              <button
                className="tab-close"
                onClick={(e) => handleTabClose(tab, e)}
                title="Close"
              >
                <IconClose size={10}/>
              </button>
            )}
          </div>
        );
      })}

      <div style={{ flex: 1 }} onClick={() => setActiveSplit(split.id)}/>

      {split.tabs.length > 0 && (
        <button
          className="tab-bar-overflow-btn"
          onClick={() => splitEditor()}
          title="Split Editor"
        >
          <IconSplitHorizontal size={14}/>
        </button>
      )}

      {contextMenu && (
        <ContextMenu
          items={getContextItems(contextMenu.tab)}
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}
