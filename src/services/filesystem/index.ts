// Virtual filesystem backed by localStorage with IndexedDB fallback
import { nanoid } from 'nanoid';
import type { FileEntry, FileType } from '../../types';

const FS_KEY = 'vsweb_filesystem';
const CONTENT_PREFIX = 'vsweb_content_';

function loadTree(): Record<string, FileEntry> {
  try {
    const raw = localStorage.getItem(FS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveTree(tree: Record<string, FileEntry>) {
  try {
    // Save without content to keep tree small
    const slim: Record<string, FileEntry> = {};
    for (const [k, v] of Object.entries(tree)) {
      slim[k] = { ...v, content: undefined };
    }
    localStorage.setItem(FS_KEY, JSON.stringify(slim));
  } catch (e) {
    console.error('FS save failed', e);
  }
}

function loadContent(fileId: string): string {
  return localStorage.getItem(CONTENT_PREFIX + fileId) ?? '';
}

function saveContent(fileId: string, content: string) {
  try {
    localStorage.setItem(CONTENT_PREFIX + fileId, content);
  } catch (e) {
    console.error('Content save failed', e);
  }
}

function deleteContent(fileId: string) {
  localStorage.removeItem(CONTENT_PREFIX + fileId);
}

export class FileSystem {
  private tree: Record<string, FileEntry>;

  constructor() {
    this.tree = loadTree();
  }

  private save() {
    saveTree(this.tree);
  }

  getEntry(id: string): FileEntry | undefined {
    return this.tree[id];
  }

  getByPath(path: string): FileEntry | undefined {
    return Object.values(this.tree).find(e => e.path === path);
  }

  getChildren(parentId: string | null): FileEntry[] {
    return Object.values(this.tree)
      .filter(e => e.parentId === (parentId ?? undefined))
      .sort((a, b) => {
        // Directories first, then alphabetical
        if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
  }

  getRoots(): FileEntry[] {
    return Object.values(this.tree)
      .filter(e => !e.parentId)
      .sort((a, b) => {
        if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
  }

  getWorkspaceRoot(workspaceId: string): FileEntry | undefined {
    return Object.values(this.tree).find(
      e => e.type === 'directory' && e.path === `/${workspaceId}` && !e.parentId
    );
  }

  createWorkspaceRoot(workspaceId: string, name: string): FileEntry {
    const existing = this.getWorkspaceRoot(workspaceId);
    if (existing) return existing;
    const entry: FileEntry = {
      id: workspaceId,
      name,
      path: `/${workspaceId}`,
      type: 'directory',
      createdAt: Date.now(),
      modifiedAt: Date.now(),
    };
    this.tree[entry.id] = entry;
    this.save();
    return entry;
  }

  create(
    parentId: string | null,
    name: string,
    type: FileType,
    content = ''
  ): FileEntry {
    const parent = parentId ? this.tree[parentId] : null;
    const path = parent ? `${parent.path}/${name}` : `/${name}`;
    const id = nanoid();
    const entry: FileEntry = {
      id,
      name,
      path,
      type,
      parentId: parentId ?? undefined,
      createdAt: Date.now(),
      modifiedAt: Date.now(),
      language: type === 'file' ? detectLanguage(name) : undefined,
    };
    this.tree[id] = entry;
    if (type === 'file') {
      saveContent(id, content);
    }
    this.save();
    return entry;
  }

  read(id: string): string {
    return loadContent(id);
  }

  write(id: string, content: string) {
    const entry = this.tree[id];
    if (!entry || entry.type !== 'file') return;
    entry.modifiedAt = Date.now();
    saveContent(id, content);
    this.save();
  }

  rename(id: string, newName: string) {
    const entry = this.tree[id];
    if (!entry) return;
    const oldName = entry.name;
    entry.name = newName;
    // Update paths for this entry and all descendants
    const oldPrefix = entry.path;
    const newPath = entry.path.replace(new RegExp(`${oldName}$`), newName);
    this.updatePaths(id, oldPrefix, newPath);
    this.save();
  }

  private updatePaths(id: string, oldPrefix: string, newPath: string) {
    const entry = this.tree[id];
    if (!entry) return;
    entry.path = newPath;
    if (entry.type === 'directory') {
      for (const child of this.getChildren(id)) {
        const childNewPath = child.path.replace(oldPrefix, newPath);
        this.updatePaths(child.id, child.path, childNewPath);
      }
    }
  }

  delete(id: string) {
    const entry = this.tree[id];
    if (!entry) return;
    // Delete children recursively
    if (entry.type === 'directory') {
      for (const child of this.getChildren(id)) {
        this.delete(child.id);
      }
    } else {
      deleteContent(id);
    }
    delete this.tree[id];
    this.save();
  }

  move(id: string, newParentId: string | null) {
    const entry = this.tree[id];
    if (!entry) return;
    const newParent = newParentId ? this.tree[newParentId] : null;
    const oldPrefix = entry.path;
    const newPath = newParent ? `${newParent.path}/${entry.name}` : `/${entry.name}`;
    entry.parentId = newParentId ?? undefined;
    this.updatePaths(id, oldPrefix, newPath);
    this.save();
  }

  duplicate(id: string): FileEntry | undefined {
    const entry = this.tree[id];
    if (!entry) return undefined;
    const baseName = entry.name;
    const ext = baseName.lastIndexOf('.');
    const nameWithoutExt = ext > 0 ? baseName.slice(0, ext) : baseName;
    const extension = ext > 0 ? baseName.slice(ext) : '';
    const newName = `${nameWithoutExt} copy${extension}`;
    const content = entry.type === 'file' ? this.read(id) : '';
    return this.create(entry.parentId ?? null, newName, entry.type, content);
  }

  getAllFiles(parentId?: string): FileEntry[] {
    const results: FileEntry[] = [];
    const collect = (pid: string | undefined) => {
      const children = pid
        ? this.getChildren(pid)
        : this.getRoots();
      for (const child of children) {
        results.push(child);
        if (child.type === 'directory') collect(child.id);
      }
    };
    collect(parentId);
    return results;
  }

  search(query: string, workspaceRootId?: string): FileEntry[] {
    const all = this.getAllFiles(workspaceRootId);
    const q = query.toLowerCase();
    return all.filter(e => e.name.toLowerCase().includes(q));
  }

  // Batch-create files (for project templates)
  createFromTemplate(
    workspaceRootId: string,
    files: Array<{ path: string; content: string }>
  ) {
    const root = this.tree[workspaceRootId];
    if (!root) throw new Error('Workspace root not found');

    const pathToId: Record<string, string> = { [root.path]: workspaceRootId };

    // Sort paths so parents come before children
    const sorted = [...files].sort((a, b) => a.path.split('/').length - b.path.split('/').length);

    for (const { path, content } of sorted) {
      const parts = path.split('/').filter(Boolean);
      let currentParentId = workspaceRootId;
      let currentPath = root.path;

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const entryPath = `${currentPath}/${part}`;
        const isLast = i === parts.length - 1;

        if (pathToId[entryPath]) {
          currentParentId = pathToId[entryPath];
          currentPath = entryPath;
          continue;
        }

        const type: FileType = isLast ? 'file' : 'directory';
        const entry = this.create(currentParentId, part, type, isLast ? content : '');
        pathToId[entryPath] = entry.id;
        currentParentId = entry.id;
        currentPath = entryPath;
      }
    }
  }
}

export function detectLanguage(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() ?? '';
  const map: Record<string, string> = {
    ts: 'typescript',
    tsx: 'typescript',
    js: 'javascript',
    jsx: 'javascript',
    mjs: 'javascript',
    cjs: 'javascript',
    json: 'json',
    jsonc: 'json',
    html: 'html',
    htm: 'html',
    css: 'css',
    scss: 'scss',
    sass: 'scss',
    less: 'less',
    md: 'markdown',
    mdx: 'markdown',
    yaml: 'yaml',
    yml: 'yaml',
    toml: 'ini',
    sh: 'shell',
    bash: 'shell',
    zsh: 'shell',
    py: 'python',
    rb: 'ruby',
    go: 'go',
    rs: 'rust',
    java: 'java',
    kt: 'kotlin',
    swift: 'swift',
    c: 'c',
    cpp: 'cpp',
    h: 'cpp',
    cs: 'csharp',
    php: 'php',
    sql: 'sql',
    graphql: 'graphql',
    gql: 'graphql',
    xml: 'xml',
    svg: 'xml',
    dockerfile: 'dockerfile',
    env: 'ini',
    gitignore: 'plaintext',
    lock: 'plaintext',
    txt: 'plaintext',
  };
  // Special case for files without extensions
  const basename = filename.toLowerCase();
  if (basename === 'dockerfile') return 'dockerfile';
  if (basename === 'makefile') return 'makefile';
  return map[ext] ?? 'plaintext';
}

export const fileSystem = new FileSystem();
