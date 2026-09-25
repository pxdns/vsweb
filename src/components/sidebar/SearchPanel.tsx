import { useState, useCallback, useRef } from 'react';
import { useWorkspaceStore } from '../../store/workspace';
import { useEditorStore } from '../../store/editor';
import { fileSystem } from '../../services/filesystem';
import { IconSearch, IconFile } from '../common/Icons';
import type { SearchResult } from '../../types';

export function SearchPanel() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [regex, setRegex] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { getActiveWorkspace } = useWorkspaceStore();
  const openFile = useEditorStore(s => s.openFile);

  const doSearch = useCallback((q: string) => {
    if (!q.trim()) { setResults([]); return; }
    const workspace = getActiveWorkspace();
    if (!workspace) return;
    const root = fileSystem.getWorkspaceRoot(workspace.id);
    if (!root) return;

    setSearching(true);
    try {
      const allFiles = fileSystem.getAllFiles(root.id).filter(f => f.type === 'file');
      const searchResults: SearchResult[] = [];

      let pattern: RegExp;
      try {
        if (regex) {
          pattern = new RegExp(q, caseSensitive ? 'g' : 'gi');
        } else {
          const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const wordBoundary = wholeWord ? `\\b${escaped}\\b` : escaped;
          pattern = new RegExp(wordBoundary, caseSensitive ? 'g' : 'gi');
        }
      } catch {
        setSearching(false);
        return;
      }

      for (const file of allFiles.slice(0, 100)) { // limit for performance
        const content = fileSystem.read(file.id);
        const lines = content.split('\n');
        const matches = [];

        for (let i = 0; i < lines.length; i++) {
          pattern.lastIndex = 0;
          let m;
          while ((m = pattern.exec(lines[i])) !== null) {
            matches.push({
              line: i + 1,
              column: m.index + 1,
              length: m[0].length,
              lineText: lines[i],
              matchText: m[0],
            });
            if (!pattern.global) break;
          }
        }

        if (matches.length > 0) {
          searchResults.push({
            fileId: file.id,
            filePath: file.path,
            fileName: file.name,
            matches,
          });
        }
      }

      setResults(searchResults);
    } finally {
      setSearching(false);
    }
  }, [caseSensitive, regex, wholeWord, getActiveWorkspace]);

  const handleQueryChange = (v: string) => {
    setQuery(v);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(v), 300);
  };

  const highlightMatch = (text: string, matchText: string) => {
    const idx = caseSensitive ? text.indexOf(matchText) : text.toLowerCase().indexOf(matchText.toLowerCase());
    if (idx === -1) return <>{text}</>;
    return (
      <>
        {text.slice(0, idx)}
        <mark>{text.slice(idx, idx + matchText.length)}</mark>
        {text.slice(idx + matchText.length)}
      </>
    );
  };

  const totalMatches = results.reduce((sum, r) => sum + r.matches.length, 0);

  return (
    <>
      <div className="sidebar-header">
        <span className="sidebar-title">Search</span>
      </div>
      <div className="search-panel">
        <div className="search-panel-inputs">
          <div className="search-input-row">
            <input
              value={query}
              onChange={e => handleQueryChange(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && doSearch(query)}
              placeholder="Search..."
              autoFocus
            />
            <div className="search-input-actions">
              <button
                className={`search-input-btn${caseSensitive ? ' active' : ''}`}
                title="Case Sensitive"
                onClick={() => { setCaseSensitive(!caseSensitive); doSearch(query); }}
              >
                Aa
              </button>
              <button
                className={`search-input-btn${wholeWord ? ' active' : ''}`}
                title="Whole Word"
                onClick={() => { setWholeWord(!wholeWord); doSearch(query); }}
              >
                ab
              </button>
              <button
                className={`search-input-btn${regex ? ' active' : ''}`}
                title="Use Regular Expression"
                onClick={() => { setRegex(!regex); doSearch(query); }}
              >
                .*
              </button>
            </div>
          </div>
        </div>

        {query && (
          <div style={{ padding: '4px 12px', fontSize: 11, color: 'var(--fg2)', flexShrink: 0 }}>
            {searching ? 'Searching…' : `${totalMatches} result${totalMatches !== 1 ? 's' : ''} in ${results.length} file${results.length !== 1 ? 's' : ''}`}
          </div>
        )}

        <div className="search-results">
          {results.map(r => (
            <div key={r.fileId} className="search-result-file">
              <div
                className="search-result-file-header"
                onClick={() => openFile(r.fileId)}
              >
                <IconFile size={13}/>
                <span style={{ fontWeight: 600 }}>{r.fileName}</span>
                <span style={{ fontSize: 10, color: 'var(--fg2)', marginLeft: 4 }}>{r.matches.length}</span>
              </div>
              {r.matches.slice(0, 10).map((m, i) => (
                <div
                  key={i}
                  className="search-result-match"
                  onClick={() => openFile(r.fileId)}
                  title={`Line ${m.line}`}
                >
                  <span style={{ color: 'var(--fg3)', marginRight: 8, userSelect: 'none' }}>{m.line}</span>
                  {highlightMatch(m.lineText.trim().slice(0, 80), m.matchText)}
                </div>
              ))}
              {r.matches.length > 10 && (
                <div style={{ padding: '2px 28px', fontSize: 11, color: 'var(--fg3)' }}>
                  +{r.matches.length - 10} more matches
                </div>
              )}
            </div>
          ))}
          {query && !searching && results.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-title">No results</div>
              <div className="empty-state-text">No files found for "{query}"</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
