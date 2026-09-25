import { useState, useEffect } from 'react';
import { useWorkspaceStore } from '../../store/workspace';
import { fileSystem } from '../../services/filesystem';
import { IconPackage, IconSearch, IconPlus } from '../common/Icons';

interface PackageEntry {
  name: string;
  version: string;
  isDev: boolean;
}

export function PackagesPanel() {
  const { getActiveWorkspace } = useWorkspaceStore();
  const workspace = getActiveWorkspace();
  const [packages, setPackages] = useState<PackageEntry[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!workspace) return;
    const root = fileSystem.getWorkspaceRoot(workspace.id);
    if (!root) return;
    const pkgFile = fileSystem.getAllFiles(root.id).find(f => f.name === 'package.json');
    if (!pkgFile) return;
    try {
      const content = fileSystem.read(pkgFile.id);
      const pkg = JSON.parse(content);
      const deps: PackageEntry[] = [];
      for (const [name, version] of Object.entries(pkg.dependencies ?? {})) {
        deps.push({ name, version: version as string, isDev: false });
      }
      for (const [name, version] of Object.entries(pkg.devDependencies ?? {})) {
        deps.push({ name, version: version as string, isDev: true });
      }
      setPackages(deps);
    } catch {}
  }, [workspace]);

  const filtered = packages.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <div style={{ padding: '8px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 6, flexShrink: 0 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'var(--bg3)', border: '1px solid var(--border)',
          borderRadius: 3, padding: '4px 8px', flex: 1,
        }}>
          <IconSearch size={12} style={{ color: 'var(--fg2)', flexShrink: 0 }}/>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Filter packages..."
            style={{ background: 'none', border: 'none', outline: 'none', fontSize: 12, color: 'var(--fg0)', flex: 1 }}
          />
        </div>
        <button
          className="ide-btn primary"
          style={{ display: 'flex', alignItems: 'center', gap: 4 }}
          onClick={() => {
            const name = prompt('Package name (e.g. axios):');
            if (name) alert(`In a real environment, this would run: npm install ${name}`);
          }}
        >
          <IconPlus size={12}/> Install
        </button>
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        {packages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><IconPackage size={28}/></div>
            <div className="empty-state-title">No package.json found</div>
            <div className="empty-state-text">Open a project with a package.json</div>
          </div>
        ) : (
          <div className="package-list">
            {filtered.map(pkg => (
              <div key={pkg.name} className="package-item">
                <span className="package-name">{pkg.name}</span>
                <span className="package-version">{pkg.version}</span>
                <span className={`package-type${pkg.isDev ? ' dev' : ''}`}>
                  {pkg.isDev ? 'dev' : 'prod'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
