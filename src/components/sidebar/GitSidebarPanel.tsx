import { useState } from 'react';
import { IconGitBranch, IconRefresh, IconPlus } from '../common/Icons';

interface GitFile {
  path: string;
  status: 'M' | 'A' | 'D' | 'R' | '?';
}

// Stub data — real git would talk to a server-side git process
const UNSTAGED: GitFile[] = [];
const STAGED: GitFile[] = [];

const STATUS_LABELS: Record<string, string> = {
  M: 'Modified', A: 'Added', D: 'Deleted', R: 'Renamed', '?': 'Untracked',
};

export function GitSidebarPanel() {
  const [branch] = useState('main');
  const [commitMsg, setCommitMsg] = useState('');
  const [staged, setStaged] = useState<GitFile[]>(STAGED);
  const [unstaged, setUnstaged] = useState<GitFile[]>(UNSTAGED);

  return (
    <>
      <div className="sidebar-header">
        <span className="sidebar-title">Source Control</span>
        <div className="sidebar-actions">
          <button className="sidebar-action-btn" title="Refresh">
            <IconRefresh size={13}/>
          </button>
        </div>
      </div>
      <div className="sidebar-content">
        {/* Branch indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 12px',
          borderBottom: '1px solid var(--border)',
          fontSize: 12,
          color: 'var(--fg1)',
        }}>
          <IconGitBranch size={14}/>
          <span>{branch}</span>
          <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--fg2)' }}>0 ahead · 0 behind</span>
        </div>

        {/* Commit message */}
        <div style={{ padding: '8px' }}>
          <textarea
            value={commitMsg}
            onChange={e => setCommitMsg(e.target.value)}
            placeholder="Commit message..."
            style={{
              width: '100%',
              minHeight: 60,
              background: 'var(--bg3)',
              border: '1px solid var(--border)',
              borderRadius: 3,
              color: 'var(--fg0)',
              padding: '6px 8px',
              fontSize: 12,
              fontFamily: 'inherit',
              resize: 'vertical',
              outline: 'none',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--border-focus)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
          <button
            className="ide-btn primary"
            style={{ width: '100%', marginTop: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
            disabled={!commitMsg.trim()}
            onClick={() => {
              if (commitMsg.trim()) {
                alert(`Commit: ${commitMsg}\n(Git operations require backend integration)`);
                setCommitMsg('');
              }
            }}
          >
            <IconCheck size={12}/>
            Commit
          </button>
        </div>

        {/* Staged changes */}
        <div className="git-section">
          <div className="git-section-header">
            <span>Staged Changes</span>
            <span style={{ marginLeft: 'auto', color: 'var(--fg3)' }}>{staged.length}</span>
          </div>
          {staged.map(f => (
            <div key={f.path} className="git-file-item">
              <span className={`git-file-status ${f.status}`}>{f.status}</span>
              <span style={{ flex: 1, fontSize: 12, color: 'var(--fg1)' }}>
                {f.path.split('/').pop()}
              </span>
              <span style={{ fontSize: 10, color: 'var(--fg3)' }}>
                {STATUS_LABELS[f.status]}
              </span>
            </div>
          ))}
          {staged.length === 0 && (
            <div style={{ padding: '8px 24px', fontSize: 12, color: 'var(--fg3)' }}>
              No staged changes
            </div>
          )}
        </div>

        {/* Unstaged changes */}
        <div className="git-section">
          <div className="git-section-header">
            <span>Changes</span>
            <span style={{ marginLeft: 'auto', color: 'var(--fg3)' }}>{unstaged.length}</span>
          </div>
          {unstaged.map(f => (
            <div key={f.path} className="git-file-item">
              <span className={`git-file-status ${f.status}`}>{f.status}</span>
              <span style={{ flex: 1, fontSize: 12, color: 'var(--fg1)' }}>
                {f.path.split('/').pop()}
              </span>
            </div>
          ))}
          {unstaged.length === 0 && (
            <div style={{ padding: '8px 24px', fontSize: 12, color: 'var(--fg3)' }}>
              No changes — working tree clean
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Inline icon
function IconCheck({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
