import { useState, useCallback, useRef, useEffect } from 'react';
import type { FileEntry } from '../../types';
import { fileSystem, detectLanguage } from '../../services/filesystem';
import { useEditorStore } from '../../store/editor';
import { useWorkspaceStore } from '../../store/workspace';
import {
  IconFolder, IconFolderOpen, IconFile, IconChevronRight,
  IconPlus, IconPencil, IconTrash, IconCopy, getFileIcon,
} from '../common/Icons';
import { ContextMenu, type ContextMenuEntry } from '../common/ContextMenu';

interface TreeNodeProps {
  entry: FileEntry;
  depth: number;
  expanded: Set<string>;
  selected: string | null;
  onToggle: (id: string) => void;
  onSelect: (id: string) => void;
  onRename: (id: string, newName: string) => void;
  onDelete: (id: string) => void;
  onCreate: (parentId: string, type: 'file' | 'directory') => void;
}

function TreeNode({
  entry, depth, expanded, selected,
  onToggle, onSelect, onRename, onDelete, onCreate,
}: TreeNodeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(entry.name);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const openFile = useEditorStore(s => s.openFile);

  const isDir = entry.type === 'directory';
  const isExpanded = expanded.has(entry.id);
  const children = isDir ? fileSystem.getChildren(entry.id) : [];

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      const dotIdx = editValue.lastIndexOf('.');
      inputRef.current.setSelectionRange(0, dotIdx > 0 ? dotIdx : editValue.length);
    }
  }, [isEditing, editValue]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(entry.id);
    if (isDir) {
      onToggle(entry.id);
    } else {
      openFile(entry.id);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const commitRename = () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== entry.name) {
      onRename(entry.id, trimmed);
    }
    setIsEditing(false);
    setEditValue(entry.name);
  };

  const contextItems: ContextMenuEntry[] = isDir
    ? [
        { id: 'new-file', label: 'New File', onClick: () => onCreate(entry.id, 'file') },
        { id: 'new-dir', label: 'New Folder', onClick: () => onCreate(entry.id, 'directory') },
        { id: 'sep1', separator: true },
        { id: 'rename', label: 'Rename', shortcut: 'F2', onClick: () => { setIsEditing(true); setEditValue(entry.name); } },
        { id: 'delete', label: 'Delete', danger: true, onClick: () => onDelete(entry.id) },
      ]
    : [
        { id: 'open', label: 'Open', onClick: () => openFile(entry.id) },
        { id: 'sep1', separator: true },
        { id: 'rename', label: 'Rename', shortcut: 'F2', onClick: () => { setIsEditing(true); setEditValue(entry.name); } },
        { id: 'duplicate', label: 'Duplicate', onClick: () => { fileSystem.duplicate(entry.id); } },
        { id: 'sep2', separator: true },
        { id: 'copy-path', label: 'Copy Path', onClick: () => navigator.clipboard.writeText(entry.path) },
        { id: 'sep3', separator: true },
        { id: 'delete', label: 'Delete', danger: true, onClick: () => onDelete(entry.id) },
      ];

  return (
    <>
      <div
        className={`tree-item${selected === entry.id ? ' selected' : ''}`}
        style={{ paddingLeft: depth * 12 + 4 }}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        title={entry.path}
      >
        {isDir ? (
          <span className={`tree-item-arrow${isExpanded ? ' expanded' : ''}`}>
            <IconChevronRight size={10}/>
          </span>
        ) : (
          <span style={{ width: 16, flexShrink: 0 }}/>
        )}
        <span className="tree-item-icon">
          {isDir
            ? (isExpanded ? <IconFolderOpen size={14} style={{ color: '#e8c07d' }}/> : <IconFolder size={14} style={{ color: '#e8c07d' }}/>)
            : getFileIcon(entry.name, false)
          }
        </span>
        {isEditing ? (
          <span className="tree-item-name editing">
            <input
              ref={inputRef}
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              onBlur={commitRename}
              onKeyDown={e => {
                if (e.key === 'Enter') commitRename();
                if (e.key === 'Escape') { setIsEditing(false); setEditValue(entry.name); }
                e.stopPropagation();
              }}
              onClick={e => e.stopPropagation()}
            />
          </span>
        ) : (
          <span className="tree-item-name">{entry.name}</span>
        )}
      </div>

      {isDir && isExpanded && children.map(child => (
        <TreeNode
          key={child.id}
          entry={child}
          depth={depth + 1}
          expanded={expanded}
          selected={selected}
          onToggle={onToggle}
          onSelect={onSelect}
          onRename={onRename}
          onDelete={onDelete}
          onCreate={onCreate}
        />
      ))}

      {contextMenu && (
        <ContextMenu
          items={contextItems}
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
        />
      )}
    </>
  );
}

interface NewItemState {
  parentId: string;
  type: 'file' | 'directory';
}

export function FileTree() {
  const { getActiveWorkspace } = useWorkspaceStore();
  const workspace = getActiveWorkspace();
  const [expanded, setExpanded] = useState<Set<string>>(() => {
    const root = workspace ? fileSystem.getWorkspaceRoot(workspace.id) : undefined;
    return root ? new Set([root.id]) : new Set<string>();
  });
  const [selected, setSelected] = useState<string | null>(null);
  const [newItem, setNewItem] = useState<NewItemState | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const newItemInputRef = useRef<HTMLInputElement>(null);
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    if (newItem && newItemInputRef.current) {
      newItemInputRef.current.focus();
    }
  }, [newItem]);

  const root = workspace ? fileSystem.getWorkspaceRoot(workspace.id) : undefined;

  const handleToggle = useCallback((id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleRename = useCallback((id: string, newName: string) => {
    fileSystem.rename(id, newName);
    forceUpdate(n => n + 1);
  }, []);

  const handleDelete = useCallback((id: string) => {
    if (confirm('Delete this item?')) {
      fileSystem.delete(id);
      forceUpdate(n => n + 1);
    }
  }, []);

  const handleCreate = useCallback((parentId: string, type: 'file' | 'directory') => {
    setExpanded(prev => new Set([...prev, parentId]));
    setNewItem({ parentId, type });
    setNewItemName('');
  }, []);

  const commitNewItem = () => {
    const name = newItemName.trim();
    if (name && newItem) {
      const entry = fileSystem.create(newItem.parentId, name, newItem.type, '');
      if (newItem.type === 'directory') {
        setExpanded(prev => new Set([...prev, entry.id]));
      }
      forceUpdate(n => n + 1);
    }
    setNewItem(null);
    setNewItemName('');
  };

  if (!workspace || !root) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon"><IconFile size={32}/></div>
        <div className="empty-state-title">No workspace open</div>
        <div className="empty-state-text">Create or open a project to get started</div>
      </div>
    );
  }

  const rootChildren = fileSystem.getChildren(root.id);

  return (
    <div className="explorer-tree">
      {/* Root label */}
      <div
        className="tree-item"
        style={{ paddingLeft: 4 }}
        onClick={() => handleToggle(root.id)}
      >
        <span className={`tree-item-arrow${expanded.has(root.id) ? ' expanded' : ''}`}>
          <IconChevronRight size={10}/>
        </span>
        <span className="tree-item-icon">
          {expanded.has(root.id)
            ? <IconFolderOpen size={14} style={{ color: '#e8c07d' }}/>
            : <IconFolder size={14} style={{ color: '#e8c07d' }}/>
          }
        </span>
        <span className="tree-item-name" style={{ fontWeight: 600, fontSize: 12 }}>
          {workspace.name.toUpperCase()}
        </span>
      </div>

      {expanded.has(root.id) && (
        <>
          {rootChildren.map(child => (
            <TreeNode
              key={child.id}
              entry={child}
              depth={1}
              expanded={expanded}
              selected={selected}
              onToggle={handleToggle}
              onSelect={setSelected}
              onRename={handleRename}
              onDelete={handleDelete}
              onCreate={handleCreate}
            />
          ))}

          {newItem && newItem.parentId === root.id && (
            <div className="tree-item" style={{ paddingLeft: 16 + 4 }}>
              <span style={{ width: 16 }}/>
              <span className="tree-item-icon">
                {newItem.type === 'directory'
                  ? <IconFolder size={14} style={{ color: '#e8c07d' }}/>
                  : <IconFile size={14} style={{ color: 'var(--fg2)' }}/>
                }
              </span>
              <span className="tree-item-name editing">
                <input
                  ref={newItemInputRef}
                  value={newItemName}
                  placeholder={newItem.type === 'file' ? 'filename.ts' : 'folder'}
                  onChange={e => setNewItemName(e.target.value)}
                  onBlur={commitNewItem}
                  onKeyDown={e => {
                    if (e.key === 'Enter') commitNewItem();
                    if (e.key === 'Escape') { setNewItem(null); setNewItemName(''); }
                    e.stopPropagation();
                  }}
                />
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
