// Core types for the IDE

export type FileType = 'file' | 'directory';

export interface FileEntry {
  id: string;
  name: string;
  path: string;
  type: FileType;
  content?: string;
  children?: FileEntry[];
  parentId?: string;
  createdAt: number;
  modifiedAt: number;
  language?: string;
}

export interface Workspace {
  id: string;
  name: string;
  rootPath: string;
  createdAt: number;
  modifiedAt: number;
  template?: string;
  settings?: Partial<WorkspaceSettings>;
}

export interface WorkspaceSettings {
  packageManager: 'npm' | 'pnpm' | 'yarn' | 'bun';
  nodeVersion?: string;
}

export interface EditorTab {
  id: string;
  fileId: string;
  path: string;
  name: string;
  language: string;
  isDirty: boolean;
  isPinned: boolean;
  viewState?: unknown; // Monaco view state
  scrollPosition?: number;
}

export interface EditorSplit {
  id: string;
  tabs: EditorTab[];
  activeTabId: string | null;
}

export interface EditorLayout {
  splits: EditorSplit[];
  activeSplitId: string;
}

export type PanelId = 'terminal' | 'problems' | 'output' | 'search' | 'git' | 'preview' | 'api' | 'database' | 'env' | 'extensions' | 'packages' | 'explorer' | 'typescript' | 'components' | 'outline';

export interface Panel {
  id: PanelId;
  title: string;
  icon: string;
  visible: boolean;
  position: 'sidebar' | 'bottom' | 'right';
}

export type ThemeId = 'dark' | 'light' | 'high-contrast-dark' | 'high-contrast-light' | 'monokai' | 'solarized-dark' | 'nord';

export interface Theme {
  id: ThemeId;
  name: string;
  type: 'dark' | 'light';
  colors: ThemeColors;
  monacoTheme: string;
}

export interface ThemeColors {
  // Background layers
  bg0: string;      // Deepest background (title bar, activity bar)
  bg1: string;      // Primary background (editor, panels)
  bg2: string;      // Secondary background (sidebars)
  bg3: string;      // Tertiary background (hover states, selections)
  bg4: string;      // Active/selected items

  // Text
  fg0: string;      // Primary text
  fg1: string;      // Secondary text (muted)
  fg2: string;      // Tertiary text (disabled)
  fg3: string;      // Placeholder text

  // Accent
  accent: string;      // Primary accent (focus, active)
  accentFg: string;    // Text on accent background
  accentMuted: string; // Muted accent

  // Status colors
  error: string;
  warning: string;
  info: string;
  success: string;

  // Chrome-specific backgrounds (optional, fall back to bg values)
  titlebarBg?: string;
  activitybarBg?: string;

  // Borders
  border: string;
  borderFocus: string;

  // Git colors
  gitAdded: string;
  gitModified: string;
  gitDeleted: string;
  gitIgnored: string;
  gitConflict: string;

  // Syntax (for non-Monaco elements)
  syntaxKeyword: string;
  syntaxString: string;
  syntaxComment: string;
  syntaxNumber: string;
  syntaxType: string;
  syntaxFunction: string;
  syntaxVariable: string;
}

export interface Settings {
  // Editor
  editor: {
    fontSize: number;
    fontFamily: string;
    fontLigatures: boolean;
    tabSize: number;
    insertSpaces: boolean;
    wordWrap: 'off' | 'on' | 'wordWrapColumn' | 'bounded';
    wordWrapColumn: number;
    minimap: boolean;
    lineNumbers: 'on' | 'off' | 'relative';
    renderWhitespace: 'none' | 'boundary' | 'selection' | 'trailing' | 'all';
    rulers: number[];
    formatOnSave: boolean;
    formatOnPaste: boolean;
    autoSave: 'off' | 'afterDelay' | 'onFocusChange' | 'onWindowChange';
    autoSaveDelay: number;
    scrollBeyondLastLine: boolean;
    smoothScrolling: boolean;
    cursorBlinking: 'blink' | 'smooth' | 'phase' | 'expand' | 'solid';
    cursorStyle: 'line' | 'block' | 'underline';
    cursorWidth: number;
    stickyScroll: boolean;
    bracketPairColorization: boolean;
    guides: boolean;
    inlineSuggest: boolean;
    acceptSuggestionOnCommitCharacter: boolean;
    snippetSuggestions: 'top' | 'bottom' | 'inline' | 'none';
  };
  // Appearance
  appearance: {
    theme: ThemeId;
    activityBarPosition: 'left' | 'right' | 'hidden';
    statusBarVisible: boolean;
    breadcrumbsVisible: boolean;
    iconTheme: string;
  };
  // Terminal
  terminal: {
    fontSize: number;
    fontFamily: string;
    shell: string;
    scrollback: number;
    cursorStyle: 'block' | 'underline' | 'bar';
  };
  // TypeScript
  typescript: {
    suggest: boolean;
    autoImports: boolean;
    validateOnType: boolean;
    inlayHints: boolean;
    strictMode: boolean;
  };
  // Git
  git: {
    autofetch: boolean;
    confirmSync: boolean;
    enableSmartCommit: boolean;
    defaultBranch: string;
  };
  // Preview
  preview: {
    autoOpen: boolean;
    port: number;
    showConsole: boolean;
  };
}

export type DiagnosticSeverity = 'error' | 'warning' | 'info' | 'hint';

export interface Diagnostic {
  id: string;
  fileId: string;
  filePath: string;
  line: number;
  column: number;
  endLine?: number;
  endColumn?: number;
  message: string;
  severity: DiagnosticSeverity;
  source: string;
  code?: string | number;
}

export interface GitStatus {
  branch: string;
  ahead: number;
  behind: number;
  staged: GitFile[];
  unstaged: GitFile[];
  untracked: GitFile[];
  conflicts: GitFile[];
}

export interface GitFile {
  path: string;
  status: 'A' | 'M' | 'D' | 'R' | 'C' | 'U' | '?';
  oldPath?: string;
}

export interface GitCommit {
  hash: string;
  shortHash: string;
  message: string;
  author: string;
  authorEmail: string;
  date: number;
  parents: string[];
  refs?: string[];
}

export interface Process {
  id: string;
  name: string;
  command: string;
  port?: number;
  status: 'starting' | 'running' | 'stopped' | 'error';
  pid?: number;
  startedAt?: number;
  logs: string[];
}

export interface ApiRequest {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';
  url: string;
  headers: Record<string, string>;
  params: Record<string, string>;
  body?: string;
  bodyType: 'none' | 'json' | 'form' | 'text';
  auth?: ApiAuth;
  collectionId?: string;
}

export interface ApiAuth {
  type: 'none' | 'bearer' | 'basic' | 'api-key';
  token?: string;
  username?: string;
  password?: string;
  key?: string;
  value?: string;
  addTo?: 'header' | 'query';
}

export interface ApiResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  time: number;
  size: number;
}

export interface ApiCollection {
  id: string;
  name: string;
  requestIds: string[];
}

export interface EnvVar {
  id: string;
  key: string;
  value: string;
  isSecret: boolean;
  environment: 'development' | 'preview' | 'production';
  workspaceId: string;
}

export interface DatabaseConnection {
  id: string;
  name: string;
  type: 'postgresql' | 'mysql' | 'sqlite' | 'mongodb';
  host?: string;
  port?: number;
  database?: string;
  username?: string;
  passwordRef?: string; // Reference to env var, never store directly
  ssl?: boolean;
}

export interface Extension {
  id: string;
  name: string;
  version: string;
  description: string;
  publisher: string;
  category: string[];
  enabled: boolean;
  installed: boolean;
  icon?: string;
  capabilities?: string[];
}

export interface CommandItem {
  id: string;
  title: string;
  category?: string;
  keybinding?: string;
  when?: string;
  handler: () => void;
}

export type NotificationType = 'info' | 'warning' | 'error' | 'success';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  actions?: Array<{ label: string; handler: () => void }>;
  duration?: number; // ms, undefined = persist
  timestamp: number;
}

export interface SearchResult {
  fileId: string;
  filePath: string;
  fileName: string;
  matches: SearchMatch[];
}

export interface SearchMatch {
  line: number;
  column: number;
  length: number;
  lineText: string;
  matchText: string;
}
