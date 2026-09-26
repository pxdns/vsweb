import type { Theme, ThemeId } from '../types';

export const themes: Record<ThemeId, Theme> = {
  dark: {
    id: 'dark',
    name: 'Dark+ (Default)',
    type: 'dark',
    monacoTheme: 'vs-dark',
    colors: {
      // Exact VS Code Dark+ palette
      bg0: '#252526',    // sidebar / panel backgrounds
      bg1: '#1e1e1e',    // editor background / active tab
      bg2: '#2d2d30',    // tab bar / inactive areas
      bg3: '#37373d',    // hover states
      bg4: '#3e3e42',    // focused hover / active list
      fg0: '#cccccc',    // primary text
      fg1: '#9d9d9d',    // secondary text
      fg2: '#6b6b6b',    // muted / disabled text
      fg3: '#4d4d4d',    // placeholder text
      accent: '#007acc', // VS Code blue
      accentFg: '#ffffff',
      accentMuted: '#094771', // selection highlight
      error: '#f14c4c',
      warning: '#cca700',
      info: '#3794ff',
      success: '#4ec9b0',
      border: '#3c3c3c',
      borderFocus: '#007acc',
      titlebarBg: '#3c3c3c',
      activitybarBg: '#333333',
      gitAdded: '#81b88b',
      gitModified: '#e2c08d',
      gitDeleted: '#c74e39',
      gitIgnored: '#6b6b6b',
      gitConflict: '#e4676b',
      syntaxKeyword: '#569cd6',
      syntaxString: '#ce9178',
      syntaxComment: '#6a9955',
      syntaxNumber: '#b5cea8',
      syntaxType: '#4ec9b0',
      syntaxFunction: '#dcdcaa',
      syntaxVariable: '#9cdcfe',
    },
  },
  light: {
    id: 'light',
    name: 'Light',
    type: 'light',
    monacoTheme: 'vs',
    colors: {
      bg0: '#f0f0f0',
      bg1: '#ffffff',
      bg2: '#f5f5f5',
      bg3: '#e8e8e8',
      bg4: '#d8d8d8',
      fg0: '#1a1a1a',
      fg1: '#424242',
      fg2: '#767676',
      fg3: '#aaaaaa',
      accent: '#0066cc',
      accentFg: '#ffffff',
      accentMuted: '#dceeff',
      error: '#cc2222',
      warning: '#b35a00',
      info: '#0066cc',
      success: '#1a7a1a',
      border: '#d0d0d0',
      borderFocus: '#0066cc',
      gitAdded: '#1a7a1a',
      gitModified: '#b35a00',
      gitDeleted: '#cc2222',
      gitIgnored: '#aaaaaa',
      gitConflict: '#d4440a',
      syntaxKeyword: '#0000ff',
      syntaxString: '#a31515',
      syntaxComment: '#008000',
      syntaxNumber: '#098658',
      syntaxType: '#267f99',
      syntaxFunction: '#795e26',
      syntaxVariable: '#001080',
    },
  },
  'high-contrast-dark': {
    id: 'high-contrast-dark',
    name: 'High Contrast Dark',
    type: 'dark',
    monacoTheme: 'hc-black',
    colors: {
      bg0: '#000000',
      bg1: '#000000',
      bg2: '#0a0a0a',
      bg3: '#141414',
      bg4: '#1e1e1e',
      fg0: '#ffffff',
      fg1: '#e0e0e0',
      fg2: '#c0c0c0',
      fg3: '#808080',
      accent: '#00ffff',
      accentFg: '#000000',
      accentMuted: '#001a1a',
      error: '#ff6b6b',
      warning: '#ffdd00',
      info: '#00d4ff',
      success: '#00ff88',
      border: '#444444',
      borderFocus: '#00ffff',
      gitAdded: '#00ff88',
      gitModified: '#ffdd00',
      gitDeleted: '#ff6b6b',
      gitIgnored: '#808080',
      gitConflict: '#ff8800',
      syntaxKeyword: '#569cd6',
      syntaxString: '#ce9178',
      syntaxComment: '#6a9955',
      syntaxNumber: '#b5cea8',
      syntaxType: '#4ec9b0',
      syntaxFunction: '#dcdcaa',
      syntaxVariable: '#9cdcfe',
    },
  },
  'high-contrast-light': {
    id: 'high-contrast-light',
    name: 'High Contrast Light',
    type: 'light',
    monacoTheme: 'hc-light',
    colors: {
      bg0: '#ffffff',
      bg1: '#ffffff',
      bg2: '#f8f8f8',
      bg3: '#eeeeee',
      bg4: '#e0e0e0',
      fg0: '#000000',
      fg1: '#1a1a1a',
      fg2: '#3a3a3a',
      fg3: '#666666',
      accent: '#0000cc',
      accentFg: '#ffffff',
      accentMuted: '#e0e0ff',
      error: '#990000',
      warning: '#7a4400',
      info: '#0000cc',
      success: '#004400',
      border: '#767676',
      borderFocus: '#0000cc',
      gitAdded: '#004400',
      gitModified: '#7a4400',
      gitDeleted: '#990000',
      gitIgnored: '#666666',
      gitConflict: '#8a3500',
      syntaxKeyword: '#0000ff',
      syntaxString: '#a31515',
      syntaxComment: '#008000',
      syntaxNumber: '#098658',
      syntaxType: '#267f99',
      syntaxFunction: '#795e26',
      syntaxVariable: '#001080',
    },
  },
  monokai: {
    id: 'monokai',
    name: 'Monokai',
    type: 'dark',
    monacoTheme: 'monokai',
    colors: {
      bg0: '#1e1e1e',
      bg1: '#272822',
      bg2: '#2d2e27',
      bg3: '#3e3d32',
      bg4: '#4d4c40',
      fg0: '#f8f8f2',
      fg1: '#cfcfc2',
      fg2: '#8f908a',
      fg3: '#5e5e5e',
      accent: '#a6e22e',
      accentFg: '#000000',
      accentMuted: '#1a2a0a',
      error: '#f92672',
      warning: '#e6db74',
      info: '#66d9e8',
      success: '#a6e22e',
      border: '#3e3d32',
      borderFocus: '#a6e22e',
      gitAdded: '#a6e22e',
      gitModified: '#e6db74',
      gitDeleted: '#f92672',
      gitIgnored: '#8f908a',
      gitConflict: '#fd971f',
      syntaxKeyword: '#f92672',
      syntaxString: '#e6db74',
      syntaxComment: '#75715e',
      syntaxNumber: '#ae81ff',
      syntaxType: '#66d9e8',
      syntaxFunction: '#a6e22e',
      syntaxVariable: '#f8f8f2',
    },
  },
  'solarized-dark': {
    id: 'solarized-dark',
    name: 'Solarized Dark',
    type: 'dark',
    monacoTheme: 'solarized-dark',
    colors: {
      bg0: '#001c24',
      bg1: '#002b36',
      bg2: '#073642',
      bg3: '#0d4555',
      bg4: '#195060',
      fg0: '#fdf6e3',
      fg1: '#eee8d5',
      fg2: '#839496',
      fg3: '#586e75',
      accent: '#268bd2',
      accentFg: '#fdf6e3',
      accentMuted: '#0a2a40',
      error: '#dc322f',
      warning: '#b58900',
      info: '#268bd2',
      success: '#859900',
      border: '#073642',
      borderFocus: '#268bd2',
      gitAdded: '#859900',
      gitModified: '#b58900',
      gitDeleted: '#dc322f',
      gitIgnored: '#586e75',
      gitConflict: '#cb4b16',
      syntaxKeyword: '#859900',
      syntaxString: '#2aa198',
      syntaxComment: '#586e75',
      syntaxNumber: '#d33682',
      syntaxType: '#b58900',
      syntaxFunction: '#268bd2',
      syntaxVariable: '#fdf6e3',
    },
  },
  nord: {
    id: 'nord',
    name: 'Nord',
    type: 'dark',
    monacoTheme: 'nord',
    colors: {
      bg0: '#232831',
      bg1: '#2e3440',
      bg2: '#3b4252',
      bg3: '#434c5e',
      bg4: '#4c566a',
      fg0: '#eceff4',
      fg1: '#e5e9f0',
      fg2: '#d8dee9',
      fg3: '#adbac7',
      accent: '#88c0d0',
      accentFg: '#2e3440',
      accentMuted: '#1e3540',
      error: '#bf616a',
      warning: '#ebcb8b',
      info: '#81a1c1',
      success: '#a3be8c',
      border: '#3b4252',
      borderFocus: '#88c0d0',
      gitAdded: '#a3be8c',
      gitModified: '#ebcb8b',
      gitDeleted: '#bf616a',
      gitIgnored: '#616e88',
      gitConflict: '#d08770',
      syntaxKeyword: '#81a1c1',
      syntaxString: '#a3be8c',
      syntaxComment: '#616e88',
      syntaxNumber: '#b48ead',
      syntaxType: '#8fbcbb',
      syntaxFunction: '#88c0d0',
      syntaxVariable: '#d8dee9',
    },
  },
};

export const defaultTheme = themes.dark;

export function getThemeCssVars(theme: Theme): Record<string, string> {
  const vars: Record<string, string> = {};
  const c = theme.colors;
  vars['--bg0'] = c.bg0;
  vars['--bg1'] = c.bg1;
  vars['--bg2'] = c.bg2;
  vars['--bg3'] = c.bg3;
  vars['--bg4'] = c.bg4;
  vars['--fg0'] = c.fg0;
  vars['--fg1'] = c.fg1;
  vars['--fg2'] = c.fg2;
  vars['--fg3'] = c.fg3;
  vars['--accent'] = c.accent;
  vars['--accent-fg'] = c.accentFg;
  vars['--accent-muted'] = c.accentMuted;
  vars['--error'] = c.error;
  vars['--warning'] = c.warning;
  vars['--info'] = c.info;
  vars['--success'] = c.success;
  vars['--border'] = c.border;
  vars['--border-focus'] = c.borderFocus;
  vars['--titlebar-bg'] = c.titlebarBg ?? c.bg2;
  vars['--activitybar-bg'] = c.activitybarBg ?? c.bg0;
  vars['--git-added'] = c.gitAdded;
  vars['--git-modified'] = c.gitModified;
  vars['--git-deleted'] = c.gitDeleted;
  vars['--git-ignored'] = c.gitIgnored;
  vars['--git-conflict'] = c.gitConflict;
  vars['--syntax-keyword'] = c.syntaxKeyword;
  vars['--syntax-string'] = c.syntaxString;
  vars['--syntax-comment'] = c.syntaxComment;
  vars['--syntax-number'] = c.syntaxNumber;
  vars['--syntax-type'] = c.syntaxType;
  vars['--syntax-function'] = c.syntaxFunction;
  vars['--syntax-variable'] = c.syntaxVariable;
  return vars;
}
