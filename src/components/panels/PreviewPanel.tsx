import { useState, useRef } from 'react';
import { useSettingsStore } from '../../store/settings';
import { IconRefresh, IconExternalLink, IconPreview } from '../common/Icons';

export function PreviewPanel() {
  const { settings } = useSettingsStore();
  const [url, setUrl] = useState(`http://localhost:${settings.preview.port}`);
  const [inputUrl, setInputUrl] = useState(url);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const navigate = () => {
    setUrl(inputUrl);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 8px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg2)',
        flexShrink: 0,
      }}>
        <button
          style={{ color: 'var(--fg2)', display: 'flex', alignItems: 'center', padding: 4, borderRadius: 3, cursor: 'pointer' }}
          onClick={() => iframeRef.current?.contentWindow?.location.reload()}
          title="Refresh"
        >
          <IconRefresh size={14}/>
        </button>
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          background: 'var(--bg3)',
          border: '1px solid var(--border)',
          borderRadius: 3,
          padding: '2px 8px',
        }}>
          <input
            value={inputUrl}
            onChange={e => setInputUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && navigate()}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              outline: 'none',
              fontSize: 12,
              color: 'var(--fg0)',
              fontFamily: 'monospace',
            }}
          />
        </div>
        <button
          style={{ color: 'var(--fg2)', display: 'flex', alignItems: 'center', padding: 4, borderRadius: 3, cursor: 'pointer' }}
          onClick={() => window.open(url, '_blank')}
          title="Open in new tab"
        >
          <IconExternalLink size={14}/>
        </button>
      </div>

      {/* Preview iframe */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative', background: '#fff' }}>
        <iframe
          ref={iframeRef}
          src={url}
          style={{ width: '100%', height: '100%', border: 'none' }}
          title="Preview"
          sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups"
        />
      </div>
    </div>
  );
}
