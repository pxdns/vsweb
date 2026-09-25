import { useEffect, useRef, useCallback } from 'react';
import * as monaco from 'monaco-editor';
import { useEditorStore } from '../../store/editor';
import { useSettingsStore } from '../../store/settings';
import { fileSystem } from '../../services/filesystem';
import type { EditorTab } from '../../types';

// Monaco worker setup
self.MonacoEnvironment = {
  getWorkerUrl: function (_moduleId: string, label: string) {
    if (label === 'json') return '/monaco-editor/esm/vs/language/json/json.worker?worker';
    if (label === 'css' || label === 'scss' || label === 'less') return '/monaco-editor/esm/vs/language/css/css.worker?worker';
    if (label === 'html' || label === 'handlebars' || label === 'razor') return '/monaco-editor/esm/vs/language/html/html.worker?worker';
    if (label === 'typescript' || label === 'javascript') return '/monaco-editor/esm/vs/language/typescript/ts.worker?worker';
    return '/monaco-editor/esm/vs/editor/editor.worker?worker';
  },
};

interface Props {
  tab: EditorTab;
  splitId: string;
  isActive: boolean;
}

let monacoThemesRegistered = false;

function registerMonacoThemes() {
  if (monacoThemesRegistered) return;
  monacoThemesRegistered = true;

  monaco.editor.defineTheme('monokai', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: 'F92672', fontStyle: 'bold' },
      { token: 'string', foreground: 'E6DB74' },
      { token: 'comment', foreground: '75715E', fontStyle: 'italic' },
      { token: 'number', foreground: 'AE81FF' },
      { token: 'type', foreground: '66D9E8' },
      { token: 'function', foreground: 'A6E22E' },
      { token: 'variable', foreground: 'F8F8F2' },
    ],
    colors: {
      'editor.background': '#272822',
      'editor.foreground': '#F8F8F2',
      'editorLineNumber.foreground': '#5E5E5E',
      'editorCursor.foreground': '#F8F8F2',
      'editor.selectionBackground': '#49483E',
      'editor.lineHighlightBackground': '#2D2E27',
      'editorIndentGuide.background': '#3E3D32',
      'editor.findMatchBackground': '#805E0040',
      'editor.findMatchHighlightBackground': '#FFE79240',
    },
  });

  monaco.editor.defineTheme('nord', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: '81A1C1' },
      { token: 'string', foreground: 'A3BE8C' },
      { token: 'comment', foreground: '616E88', fontStyle: 'italic' },
      { token: 'number', foreground: 'B48EAD' },
      { token: 'type', foreground: '8FBCBB' },
      { token: 'function', foreground: '88C0D0' },
    ],
    colors: {
      'editor.background': '#2E3440',
      'editor.foreground': '#D8DEE9',
      'editorLineNumber.foreground': '#4C566A',
      'editor.selectionBackground': '#434C5E',
      'editor.lineHighlightBackground': '#3B4252',
    },
  });

  monaco.editor.defineTheme('solarized-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: '859900' },
      { token: 'string', foreground: '2AA198' },
      { token: 'comment', foreground: '586E75', fontStyle: 'italic' },
      { token: 'number', foreground: 'D33682' },
      { token: 'type', foreground: 'B58900' },
      { token: 'function', foreground: '268BD2' },
    ],
    colors: {
      'editor.background': '#002B36',
      'editor.foreground': '#839496',
      'editorLineNumber.foreground': '#586E75',
      'editor.selectionBackground': '#073642',
      'editor.lineHighlightBackground': '#073642',
    },
  });
}

export function MonacoEditor({ tab, splitId, isActive }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const modelRef = useRef<monaco.editor.ITextModel | null>(null);
  const { settings } = useSettingsStore();
  const { markDirty, markClean, saveFile, updateViewState, pendingContent } = useEditorStore();

  registerMonacoThemes();

  const getMonacoTheme = useCallback(() => {
    return settings.appearance.theme === 'dark' ? 'vs-dark'
      : settings.appearance.theme === 'light' ? 'vs'
      : settings.appearance.theme === 'high-contrast-dark' ? 'hc-black'
      : settings.appearance.theme === 'high-contrast-light' ? 'hc-light'
      : settings.appearance.theme; // custom themes already registered
  }, [settings.appearance.theme]);

  // Initialize editor
  useEffect(() => {
    if (!containerRef.current) return;

    const content = pendingContent[tab.fileId] ?? fileSystem.read(tab.fileId);
    const language = tab.language;

    // Create or reuse model
    const modelUri = monaco.Uri.parse(`file://${tab.path}`);
    let model = monaco.editor.getModel(modelUri);
    if (!model) {
      model = monaco.editor.createModel(content, language, modelUri);
    } else {
      // Update language if needed
      monaco.editor.setModelLanguage(model, language);
    }
    modelRef.current = model;

    const editor = monaco.editor.create(containerRef.current, {
      model,
      theme: getMonacoTheme(),
      fontSize: settings.editor.fontSize,
      fontFamily: settings.editor.fontFamily,
      fontLigatures: settings.editor.fontLigatures,
      tabSize: settings.editor.tabSize,
      insertSpaces: settings.editor.insertSpaces,
      wordWrap: settings.editor.wordWrap,
      minimap: { enabled: settings.editor.minimap },
      lineNumbers: settings.editor.lineNumbers,
      renderWhitespace: settings.editor.renderWhitespace,
      scrollBeyondLastLine: settings.editor.scrollBeyondLastLine,
      smoothScrolling: settings.editor.smoothScrolling,
      cursorBlinking: settings.editor.cursorBlinking,
      cursorStyle: settings.editor.cursorStyle,
      cursorWidth: settings.editor.cursorWidth,
      stickyScroll: { enabled: settings.editor.stickyScroll },
      bracketPairColorization: { enabled: settings.editor.bracketPairColorization },
      guides: {
        bracketPairs: settings.editor.guides,
        indentation: settings.editor.guides,
      },
      inlineSuggest: { enabled: settings.editor.inlineSuggest },
      snippetSuggestions: settings.editor.snippetSuggestions,
      acceptSuggestionOnCommitCharacter: settings.editor.acceptSuggestionOnCommitCharacter,
      automaticLayout: true,
      scrollbar: {
        verticalScrollbarSize: 8,
        horizontalScrollbarSize: 8,
      },
      overviewRulerLanes: 3,
      renderLineHighlight: 'line',
      quickSuggestions: { other: 'on', comments: 'on', strings: 'on' } as any,
      suggest: {
        insertMode: 'replace',
        filterGraceful: true,
        showMethods: true,
        showFunctions: true,
        showConstructors: true,
        showFields: true,
        showVariables: true,
        showClasses: true,
        showInterfaces: true,
        showModules: true,
        showProperties: true,
        showKeywords: true,
      },
      parameterHints: { enabled: true },
      hover: { enabled: true } as any,
      contextmenu: true,
      folding: true,
      showFoldingControls: 'mouseover',
      matchBrackets: 'always',
      multiCursorModifier: 'alt',
    });

    editorRef.current = editor;

    // Restore view state
    if (tab.viewState) {
      editor.restoreViewState(tab.viewState as monaco.editor.ICodeEditorViewState);
    }

    // Track changes
    const changeDisposable = model.onDidChangeContent(() => {
      const value = model!.getValue();
      markDirty(tab.id, value);

      // Auto-save
      if (settings.editor.autoSave === 'afterDelay') {
        clearTimeout((editor as any)._autoSaveTimer);
        (editor as any)._autoSaveTimer = setTimeout(() => {
          fileSystem.write(tab.fileId, value);
          markClean(tab.id);
        }, settings.editor.autoSaveDelay);
      }
    });

    // Save on Ctrl+S
    const saveAction = editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
      () => {
        saveFile(tab.id);
      }
    );

    return () => {
      // Save view state before unmounting
      if (editor && !(editor as any).isDisposed?.()) {
        const vs = editor.saveViewState();
        updateViewState(tab.id, vs);
      }
      changeDisposable.dispose();
      editor.dispose();
      editorRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab.id, tab.fileId, tab.language, tab.path]);

  // Update theme when it changes
  useEffect(() => {
    if (editorRef.current) {
      monaco.editor.setTheme(getMonacoTheme());
    }
  }, [getMonacoTheme]);

  // Update editor options when settings change
  useEffect(() => {
    if (!editorRef.current) return;
    editorRef.current.updateOptions({
      fontSize: settings.editor.fontSize,
      fontFamily: settings.editor.fontFamily,
      fontLigatures: settings.editor.fontLigatures,
      tabSize: settings.editor.tabSize,
      insertSpaces: settings.editor.insertSpaces,
      wordWrap: settings.editor.wordWrap,
      minimap: { enabled: settings.editor.minimap },
      lineNumbers: settings.editor.lineNumbers,
      inlayHints: { enabled: settings.typescript.inlayHints ? 'on' : 'off' } as any,
    });
  }, [settings.editor, settings.typescript.inlayHints]);

  // Focus when tab becomes active
  useEffect(() => {
    if (isActive && editorRef.current) {
      editorRef.current.focus();
    }
  }, [isActive]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
  );
}
