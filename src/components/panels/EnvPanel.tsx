import { useState } from 'react';
import { IconPlus, IconTrash, IconPencil } from '../common/Icons';

interface EnvVar {
  id: string;
  key: string;
  value: string;
  isSecret: boolean;
  env: 'development' | 'preview' | 'production';
}

const SAMPLE_VARS: EnvVar[] = [
  { id: '1', key: 'PUBLIC_API_URL', value: 'http://localhost:3000', isSecret: false, env: 'development' },
  { id: '2', key: 'DATABASE_URL', value: 'postgresql://localhost:5432/mydb', isSecret: true, env: 'development' },
  { id: '3', key: 'STRIPE_SECRET_KEY', value: 'sk_test_...', isSecret: true, env: 'development' },
  { id: '4', key: 'NEXT_PUBLIC_SITE_URL', value: 'http://localhost:3000', isSecret: false, env: 'development' },
];

export function EnvPanel() {
  const [vars, setVars] = useState<EnvVar[]>(SAMPLE_VARS);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [activeEnv, setActiveEnv] = useState<'development' | 'preview' | 'production'>('development');

  const toggle = (id: string) => {
    setRevealed(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filtered = vars.filter(v => v.env === activeEnv);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      {/* Environment selector */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        {(['development', 'preview', 'production'] as const).map(env => (
          <button
            key={env}
            className={`panel-tab${activeEnv === env ? ' active' : ''}`}
            onClick={() => setActiveEnv(env)}
            style={{ textTransform: 'capitalize' }}
          >
            {env}
          </button>
        ))}
        <div style={{ flex: 1 }}/>
        <button
          className="ide-btn"
          onClick={() => {
            const key = prompt('Variable name:');
            const value = prompt('Value:');
            if (key && value !== null) {
              setVars(v => [...v, {
                id: Date.now().toString(), key, value,
                isSecret: key.toLowerCase().includes('secret') || key.toLowerCase().includes('key') || key.toLowerCase().includes('password'),
                env: activeEnv,
              }]);
            }
          }}
          style={{ margin: '4px 8px', display: 'flex', alignItems: 'center', gap: 4, height: 26 }}
        >
          <IconPlus size={11}/> Add
        </button>
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ padding: '4px 0' }}>
          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-title">No variables</div>
              <div className="empty-state-text">Add environment variables for {activeEnv}</div>
            </div>
          ) : (
            filtered.map(v => (
              <div key={v.id} style={{
                display: 'flex',
                alignItems: 'center',
                padding: '6px 12px',
                gap: 12,
                borderBottom: '1px solid var(--border)',
                fontSize: 12,
              }}>
                <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--fg0)', minWidth: 180, flexShrink: 0 }}>
                  {v.key}
                </span>
                <span
                  style={{ fontFamily: 'monospace', color: 'var(--fg1)', flex: 1, cursor: v.isSecret ? 'pointer' : 'default' }}
                  onClick={() => v.isSecret && toggle(v.id)}
                >
                  {v.isSecret && !revealed.has(v.id)
                    ? '●●●●●●●●●●●'
                    : v.value
                  }
                </span>
                {v.isSecret && (
                  <span style={{ fontSize: 10, color: 'var(--accent)', background: 'var(--accent-muted)', padding: '1px 5px', borderRadius: 2 }}>
                    secret
                  </span>
                )}
                <div style={{ display: 'flex', gap: 4 }}>
                  <button className="sidebar-action-btn" onClick={() => {
                    const newVal = prompt('New value:', v.value);
                    if (newVal !== null) setVars(vars.map(x => x.id === v.id ? { ...x, value: newVal } : x));
                  }}>
                    <IconPencil size={12}/>
                  </button>
                  <button className="sidebar-action-btn" onClick={() => setVars(vars.filter(x => x.id !== v.id))}>
                    <IconTrash size={12}/>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
