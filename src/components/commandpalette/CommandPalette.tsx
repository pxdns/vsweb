import { useState, useEffect, useRef, useMemo } from 'react';
import { useUIStore } from '../../store/ui';
import { useWorkspaceStore } from '../../store/workspace';
import { useEditorStore } from '../../store/editor';
import { fileSystem } from '../../services/filesystem';
import { IconSearch, IconFile, IconCommand, IconSettings, IconGitBranch,
  IconTerminal, IconPreview, IconPackage, IconRefresh } from '../common/Icons';

interface CommandItem {
  id: string;
  title: string;
  category: string;
  icon?: React.ReactNode;
  keybinding?: string;
  action: () => void;
}

export function CommandPalette() {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const { setCommandPaletteOpen, setSettingsOpen, setNewProjectOpen,
    openBottomPanel, setSidebarPanel, addNotification } = useUIStore();
  const { getActiveWorkspace } = useWorkspaceStore();
  const { splitEditor, closeAllTabs } = useEditorStore();

  const workspace = getActiveWorkspace();

  useEffect(() => {
    inputRef.current?.focus();
    return () => setQuery('');
  }, []);

  const isFileSearch = query.startsWith('>') === false && query.length > 0;
  const cmdQuery = query.startsWith('>') ? query.slice(1).trim() : '';

  const fileResults = useMemo(() => {
    if (!isFileSearch || !workspace) return [];
    const root = fileSystem.getWorkspaceRoot(workspace.id);
    if (!root) return [];
    return fileSystem.search(query, root.id)
      .filter(e => e.type === 'file')
      .slice(0, 20);
  }, [query, isFileSearch, workspace]);

  const commands = useMemo((): CommandItem[] => [
    { id: 'new-project', title: 'New Project', category: 'File', icon: <IconFile size={14}/>,
      action: () => { setNewProjectOpen(true); setCommandPaletteOpen(false); } },
    { id: 'settings', title: 'Open Settings', category: 'Preferences', icon: <IconSettings size={14}/>, keybinding: 'Ctrl+,',
      action: () => { setSettingsOpen(true); setCommandPaletteOpen(false); } },
    { id: 'split-editor', title: 'Split Editor', category: 'View', icon: <IconFile size={14}/>,
      action: () => { splitEditor(); setCommandPaletteOpen(false); } },
    { id: 'close-all-tabs', title: 'Close All Editors', category: 'View',
      action: () => { closeAllTabs(useEditorStore.getState().layout.activeSplitId); setCommandPaletteOpen(false); } },
    { id: 'terminal', title: 'Open Terminal', category: 'Terminal', icon: <IconTerminal size={14}/>, keybinding: 'Ctrl+`',
      action: () => { openBottomPanel('terminal'); setCommandPaletteOpen(false); } },
    { id: 'problems', title: 'Show Problems', category: 'View', icon: <IconCommand size={14}/>,
      action: () => { openBottomPanel('problems'); setCommandPaletteOpen(false); } },
    { id: 'preview', title: 'Open Preview', category: 'View', icon: <IconPreview size={14}/>,
      action: () => { openBottomPanel('preview'); setCommandPaletteOpen(false); } },
    { id: 'git', title: 'Open Git Panel', category: 'Git', icon: <IconGitBranch size={14}/>,
      action: () => { setSidebarPanel('git'); setCommandPaletteOpen(false); } },
    { id: 'packages', title: 'Open Package Manager', category: 'Packages', icon: <IconPackage size={14}/>,
      action: () => { openBottomPanel('packages'); setCommandPaletteOpen(false); } },
    { id: 'explorer', title: 'Open Explorer', category: 'View',
      action: () => { setSidebarPanel('explorer'); setCommandPaletteOpen(false); } },
    { id: 'search-panel', title: 'Open Search', category: 'View', icon: <IconSearch size={14}/>,
      action: () => { setSidebarPanel('search'); setCommandPaletteOpen(false); } },
    { id: 'reload', title: 'Reload Window', category: 'Developer', icon: <IconRefresh size={14}/>,
      action: () => { window.location.reload(); } },
    { id: 'copy-path', title: 'Copy File Path', category: 'File',
      action: () => {
        const tab = useEditorStore.getState().getActiveTab();
        if (tab) { navigator.clipboard.writeText(tab.path); addNotification('info', 'Path copied'); }
        setCommandPaletteOpen(false);
      },
    },
  ], [setCommandPaletteOpen, setSettingsOpen, setNewProjectOpen, splitEditor, closeAllTabs, openBottomPanel, setSidebarPanel, addNotification]);

  const filteredCommands = useMemo(() => {
    if (isFileSearch) return [];
    const q = cmdQuery.toLowerCase();
    if (!q) return commands;
    return commands.filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
    );
  }, [cmdQuery, commands, isFileSearch]);

  const allItems = isFileSearch ? fileResults : filteredCommands;
  const totalCount = allItems.length;

  useEffect(() => { setFocused(0); }, [query]);

  const openFile = useEditorStore(s => s.openFile);

  const handleSelect = (idx: number) => {
    if (isFileSearch) {
      const file = fileResults[idx];
      if (file) {
        openFile(file.id);
        setCommandPaletteOpen(false);
      }
    } else {
      const cmd = filteredCommands[idx];
      if (cmd) cmd.action();
    }
  };

  useEffect(() => {
    const focused_item = listRef.current?.querySelector('.command-item.focused');
    focused_item?.scrollIntoView({ block: 'nearest' });
  }, [focused]);

  return (
    <div className="command-palette-overlay" onClick={() => setCommandPaletteOpen(false)}>
      <div className="command-palette" onClick={e => e.stopPropagation()}>
        <div className="command-palette-input-row">
          <span className="command-palette-input-icon">
            {isFileSearch ? <IconSearch size={14}/> : <IconCommand size={14}/>}
          </span>
          <input
            ref={inputRef}
            className="command-palette-input"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type '>' for commands, or search files…"
            onKeyDown={e => {
              if (e.key === 'ArrowDown') { e.preventDefault(); setFocused(f => Math.min(f + 1, totalCount - 1)); }
              if (e.key === 'ArrowUp') { e.preventDefault(); setFocused(f => Math.max(f - 1, 0)); }
              if (e.key === 'Enter') { e.preventDefault(); handleSelect(focused); }
              if (e.key === 'Escape') setCommandPaletteOpen(false);
            }}
          />
          <span style={{ fontSize: 11, color: 'var(--fg3)', flexShrink: 0 }}>
            {isFileSearch ? 'Open file' : 'Run command'}
          </span>
        </div>

        <div className="command-palette-results" ref={listRef}>
          {isFileSearch ? (
            fileResults.length === 0 ? (
              <div className="command-palette-empty">No files found for "{query}"</div>
            ) : (
              <div className="command-palette-section">
                <div className="command-palette-section-title">Files</div>
                {fileResults.map((file, idx) => (
                  <div
                    key={file.id}
                    className={`command-item${idx === focused ? ' focused' : ''}`}
                    onClick={() => handleSelect(idx)}
                  >
                    <span className="command-item-icon"><IconFile size={14}/></span>
                    <span className="command-item-text">
                      <div className="command-item-title">{file.name}</div>
                      <div className="command-item-category">{file.path}</div>
                    </span>
                  </div>
                ))}
              </div>
            )
          ) : (
            filteredCommands.length === 0 ? (
              <div className="command-palette-empty">No commands found</div>
            ) : (
              <div className="command-palette-section">
                {filteredCommands.map((cmd, idx) => (
                  <div
                    key={cmd.id}
                    className={`command-item${idx === focused ? ' focused' : ''}`}
                    onClick={() => handleSelect(idx)}
                  >
                    <span className="command-item-icon">{cmd.icon ?? <IconCommand size={14}/>}</span>
                    <span className="command-item-text">
                      <div className="command-item-title">{cmd.title}</div>
                      <div className="command-item-category">{cmd.category}</div>
                    </span>
                    {cmd.keybinding && (
                      <span className="command-item-keybinding">
                        <kbd>{cmd.keybinding}</kbd>
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
