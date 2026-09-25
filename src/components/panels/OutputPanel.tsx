import { useState, useRef, useEffect, useCallback } from 'react';
import * as monaco from 'monaco-editor';

interface LogLine {
  time: string;
  text: string;
  level: 'info' | 'warn' | 'error';
}

function timestamp() {
  return new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function initialLines(): LogLine[] {
  const t = timestamp();
  return [
    { time: t, text: '[VSWeb] IDE initialized', level: 'info' },
    { time: t, text: '[TypeScript] Language service starting…', level: 'info' },
  ];
}

export function OutputPanel() {
  const [lines, setLines] = useState<LogLine[]>(initialLines);
  const bottomRef = useRef<HTMLDivElement>(null);
  const markerCountRef = useRef(0);

  const append = useCallback((text: string, level: LogLine['level'] = 'info') => {
    setLines(prev => [...prev.slice(-500), { time: timestamp(), text, level }]);
  }, []);

  useEffect(() => {
    // Log marker changes (TypeScript errors) to Output
    const d = monaco.editor.onDidChangeMarkers((uris) => {
      for (const uri of uris) {
        const markers = monaco.editor.getModelMarkers({ resource: uri });
        const errors = markers.filter(m => m.severity === monaco.MarkerSeverity.Error).length;
        const warnings = markers.filter(m => m.severity === monaco.MarkerSeverity.Warning).length;
        const file = uri.path.split('/').pop() ?? uri.path;
        if (errors > 0) {
          append(`[TypeScript] ${file}: ${errors} error${errors !== 1 ? 's' : ''}, ${warnings} warning${warnings !== 1 ? 's' : ''}`, 'error');
        } else if (warnings > 0) {
          append(`[TypeScript] ${file}: ${warnings} warning${warnings !== 1 ? 's' : ''}`, 'warn');
        } else if (markers.length === 0 && markerCountRef.current > 0) {
          append(`[TypeScript] ${file}: No problems`, 'info');
        }
        markerCountRef.current = markers.length;
      }
    });

    // Log when models are created
    const d2 = monaco.editor.onDidCreateModel(model => {
      const file = model.uri.path.split('/').pop() ?? model.uri.path;
      append(`[VSWeb] Opened ${file}`);
    });

    return () => {
      d.dispose();
      d2.dispose();
    };
  }, [append]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'instant' });
  }, [lines]);

  const levelColor: Record<LogLine['level'], string> = {
    info: 'var(--fg2)',
    warn: 'var(--warning)',
    error: 'var(--error)',
  };

  return (
    <div style={{ flex: 1, overflow: 'auto', fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: 12 }}>
      <div style={{ padding: '4px 0' }}>
        {lines.map((line, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, padding: '1px 12px', lineHeight: 1.5 }}>
            <span style={{ color: 'var(--fg3)', flexShrink: 0, fontSize: 11 }}>{line.time}</span>
            <span style={{ color: levelColor[line.level] }}>{line.text}</span>
          </div>
        ))}
      </div>
      <div ref={bottomRef}/>
    </div>
  );
}
