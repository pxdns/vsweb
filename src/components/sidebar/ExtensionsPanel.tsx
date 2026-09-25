import { useState } from 'react';
import { IconSearch, IconPackage } from '../common/Icons';

interface Extension {
  id: string;
  name: string;
  description: string;
  publisher: string;
  version: string;
  category: string;
  enabled: boolean;
  installed: boolean;
  installs: string;
}

const BUILT_IN: Extension[] = [
  {
    id: 'typescript-language-features',
    name: 'TypeScript Language Features',
    description: 'Provides TypeScript IntelliSense, type checking, and language server integration.',
    publisher: 'VSWeb',
    version: '1.0.0',
    category: 'Language',
    enabled: true,
    installed: true,
    installs: 'built-in',
  },
  {
    id: 'eslint',
    name: 'ESLint',
    description: 'Integrates ESLint JavaScript into VSWeb.',
    publisher: 'Microsoft',
    version: '3.0.0',
    category: 'Linters',
    enabled: true,
    installed: true,
    installs: 'built-in',
  },
  {
    id: 'prettier',
    name: 'Prettier',
    description: 'Code formatter using prettier.',
    publisher: 'Prettier',
    version: '10.0.0',
    category: 'Formatters',
    enabled: false,
    installed: false,
    installs: '38.2M',
  },
  {
    id: 'tailwindcss',
    name: 'Tailwind CSS IntelliSense',
    description: 'Intelligent Tailwind CSS tooling for VS Code.',
    publisher: 'Tailwind Labs',
    version: '0.12.0',
    category: 'Language',
    enabled: false,
    installed: false,
    installs: '12.8M',
  },
  {
    id: 'github-copilot',
    name: 'GitHub Copilot',
    description: 'Your AI pair programmer.',
    publisher: 'GitHub',
    version: '1.200.0',
    category: 'AI',
    enabled: false,
    installed: false,
    installs: '10M+',
  },
  {
    id: 'gitlens',
    name: 'GitLens',
    description: 'Supercharge Git within VS Code.',
    publisher: 'GitKraken',
    version: '14.0.0',
    category: 'SCM',
    enabled: false,
    installed: false,
    installs: '26M',
  },
  {
    id: 'auto-rename-tag',
    name: 'Auto Rename Tag',
    description: 'Auto rename paired HTML/XML tag.',
    publisher: 'Jun Han',
    version: '0.1.10',
    category: 'Other',
    enabled: false,
    installed: false,
    installs: '18.2M',
  },
];

export function ExtensionsPanel() {
  const [query, setQuery] = useState('');
  const [extensions, setExtensions] = useState<Extension[]>(BUILT_IN);

  const filtered = extensions.filter(e =>
    e.name.toLowerCase().includes(query.toLowerCase()) ||
    e.description.toLowerCase().includes(query.toLowerCase()) ||
    e.publisher.toLowerCase().includes(query.toLowerCase())
  );

  const installed = filtered.filter(e => e.installed);
  const marketplace = filtered.filter(e => !e.installed);

  const toggle = (id: string) => {
    setExtensions(exts => exts.map(e => e.id === id ? { ...e, enabled: !e.enabled } : e));
  };

  const install = (id: string) => {
    setExtensions(exts => exts.map(e => e.id === id ? { ...e, installed: true, enabled: true } : e));
  };

  return (
    <>
      <div className="sidebar-header">
        <span className="sidebar-title">Extensions</span>
      </div>
      <div className="sidebar-content">
        {/* Search */}
        <div style={{ padding: '8px', borderBottom: '1px solid var(--border)' }}>
          <div className="search-input-row">
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search extensions..."
            />
          </div>
        </div>

        {/* Installed */}
        {installed.length > 0 && (
          <div>
            <div style={{ padding: '6px 12px 4px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--fg3)' }}>
              Installed
            </div>
            {installed.map(ext => (
              <ExtensionItem key={ext.id} ext={ext} onToggle={toggle} onInstall={install}/>
            ))}
          </div>
        )}

        {/* Marketplace */}
        {marketplace.length > 0 && (
          <div>
            <div style={{ padding: '6px 12px 4px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--fg3)' }}>
              Marketplace
            </div>
            {marketplace.map(ext => (
              <ExtensionItem key={ext.id} ext={ext} onToggle={toggle} onInstall={install}/>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function ExtensionItem({
  ext, onToggle, onInstall
}: {
  ext: Extension;
  onToggle: (id: string) => void;
  onInstall: (id: string) => void;
}) {
  return (
    <div style={{
      padding: '8px 12px',
      borderBottom: '1px solid var(--border)',
      cursor: 'pointer',
      transition: 'background 0.1s',
    }}
    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg3)')}
    onMouseLeave={e => (e.currentTarget.style.background = '')}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <div style={{
          width: 36,
          height: 36,
          background: 'var(--bg3)',
          borderRadius: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <IconPackage size={18} style={{ color: 'var(--accent)', opacity: 0.8 }}/>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg0)' }}>{ext.name}</span>
            <span style={{ fontSize: 10, color: 'var(--fg3)' }}>v{ext.version}</span>
            {ext.enabled && (
              <span style={{ fontSize: 9, padding: '1px 4px', borderRadius: 2, background: 'var(--success)', color: '#000', fontWeight: 700 }}>
                ON
              </span>
            )}
          </div>
          <div style={{ fontSize: 11, color: 'var(--fg2)', lineHeight: 1.4, marginBottom: 4 }}>
            {ext.description}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 10, color: 'var(--fg3)' }}>{ext.publisher}</span>
            <span style={{ fontSize: 10, color: 'var(--fg3)' }}>{ext.installs} installs</span>
            <div style={{ marginLeft: 'auto' }}>
              {ext.installed ? (
                <button
                  className="ide-btn"
                  style={{ height: 22, padding: '0 8px', fontSize: 10 }}
                  onClick={() => onToggle(ext.id)}
                >
                  {ext.enabled ? 'Disable' : 'Enable'}
                </button>
              ) : (
                <button
                  className="ide-btn primary"
                  style={{ height: 22, padding: '0 8px', fontSize: 10 }}
                  onClick={() => onInstall(ext.id)}
                >
                  Install
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
