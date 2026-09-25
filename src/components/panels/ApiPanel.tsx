import { useState } from 'react';
import { IconPlay } from '../common/Icons';

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

const METHOD_COLORS: Record<Method, string> = {
  GET: '#4ade80',
  POST: '#60a5fa',
  PUT: '#fbbf24',
  PATCH: '#a78bfa',
  DELETE: '#f87171',
};

interface ApiResponse {
  status: number;
  statusText: string;
  body: string;
  time: number;
  headers: Record<string, string>;
}

export function ApiPanel() {
  const [method, setMethod] = useState<Method>('GET');
  const [url, setUrl] = useState('http://localhost:3000/api/');
  const [body, setBody] = useState('');
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'body' | 'headers'>('body');

  const send = async () => {
    setLoading(true);
    const start = Date.now();
    try {
      const opts: RequestInit = {
        method,
        headers: { 'Content-Type': 'application/json' },
      };
      if (method !== 'GET' && method !== 'DELETE' && body) {
        opts.body = body;
      }
      const res = await fetch(url, opts);
      const text = await res.text();
      const headers: Record<string, string> = {};
      res.headers.forEach((v, k) => { headers[k] = v; });

      let pretty = text;
      try { pretty = JSON.stringify(JSON.parse(text), null, 2); } catch {}

      setResponse({
        status: res.status,
        statusText: res.statusText,
        body: pretty,
        time: Date.now() - start,
        headers,
      });
    } catch (e: any) {
      setResponse({
        status: 0,
        statusText: 'Error',
        body: e.message ?? 'Network error',
        time: Date.now() - start,
        headers: {},
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden', gap: 0 }}>
      {/* Request panel */}
      <div style={{ width: '50%', display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border)', overflow: 'hidden' }}>
        {/* URL bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '8px',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
        }}>
          <select
            className="ide-select"
            value={method}
            onChange={e => setMethod(e.target.value as Method)}
            style={{ width: 80, color: METHOD_COLORS[method], fontWeight: 700 }}
          >
            {(['GET','POST','PUT','PATCH','DELETE'] as Method[]).map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <input
            className="ide-input"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            style={{ flex: 1 }}
            placeholder="https://..."
          />
          <button
            className="ide-btn primary"
            onClick={send}
            disabled={loading}
            style={{ display: 'flex', alignItems: 'center', gap: 4 }}
          >
            <IconPlay size={12}/>
            {loading ? 'Sending…' : 'Send'}
          </button>
        </div>

        {/* Request body tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
          {(['body', 'headers'] as const).map(t => (
            <button
              key={t}
              className={`panel-tab${activeTab === t ? ' active' : ''}`}
              onClick={() => setActiveTab(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, overflow: 'hidden' }}>
          {activeTab === 'body' && (
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              style={{
                width: '100%',
                height: '100%',
                background: 'var(--bg1)',
                color: 'var(--fg0)',
                border: 'none',
                outline: 'none',
                padding: '8px',
                fontFamily: 'monospace',
                fontSize: 12,
                resize: 'none',
              }}
              placeholder='{"key": "value"}'
              spellCheck={false}
            />
          )}
          {activeTab === 'headers' && (
            <div style={{ padding: 8, fontSize: 12, color: 'var(--fg2)' }}>
              <div>Content-Type: application/json</div>
            </div>
          )}
        </div>
      </div>

      {/* Response panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {response ? (
          <>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '8px 12px',
              borderBottom: '1px solid var(--border)',
              flexShrink: 0,
            }}>
              <span style={{
                fontWeight: 700,
                color: response.status >= 200 && response.status < 300 ? 'var(--success)'
                  : response.status >= 400 ? 'var(--error)' : 'var(--warning)',
              }}>
                {response.status} {response.statusText}
              </span>
              <span style={{ fontSize: 11, color: 'var(--fg2)' }}>{response.time}ms</span>
            </div>
            <pre style={{
              flex: 1,
              overflow: 'auto',
              padding: '8px 12px',
              fontFamily: 'monospace',
              fontSize: 12,
              color: 'var(--fg0)',
              margin: 0,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
            }}>
              {response.body}
            </pre>
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-state-title">No response</div>
            <div className="empty-state-text">Send a request to see the response</div>
          </div>
        )}
      </div>
    </div>
  );
}
