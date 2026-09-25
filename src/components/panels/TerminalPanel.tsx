import { useEffect, useRef, useState } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { useSettingsStore } from '../../store/settings';
import { useUIStore } from '../../store/ui';
import { IconPlus, IconTrash } from '../common/Icons';
import '@xterm/xterm/css/xterm.css';

interface TermInstance {
  id: string;
  terminal: Terminal;
  fitAddon: FitAddon;
  container: HTMLDivElement | null;
  title: string;
}

let termCounter = 1;

function createTerminal(settings: ReturnType<typeof useSettingsStore.getState>['settings']): TermInstance {
  const terminal = new Terminal({
    cursorBlink: true,
    cursorStyle: settings.terminal.cursorStyle,
    fontSize: settings.terminal.fontSize,
    fontFamily: settings.terminal.fontFamily,
    scrollback: settings.terminal.scrollback,
    theme: {
      background: getComputedStyle(document.documentElement).getPropertyValue('--bg1').trim() || '#141414',
      foreground: getComputedStyle(document.documentElement).getPropertyValue('--fg0').trim() || '#e0e0e0',
      cursor: getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#4d9de0',
      selectionBackground: getComputedStyle(document.documentElement).getPropertyValue('--accent-muted').trim() || '#1e3a52',
      black: '#000000',
      red: getComputedStyle(document.documentElement).getPropertyValue('--error').trim() || '#f87171',
      green: getComputedStyle(document.documentElement).getPropertyValue('--success').trim() || '#4ade80',
      yellow: getComputedStyle(document.documentElement).getPropertyValue('--warning').trim() || '#fbbf24',
      blue: getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#4d9de0',
      magenta: '#c586c0',
      cyan: '#4ec9b0',
      white: '#e0e0e0',
      brightBlack: '#686868',
      brightRed: '#f87171',
      brightGreen: '#4ade80',
      brightYellow: '#fbbf24',
      brightBlue: '#60a5fa',
      brightMagenta: '#da70d6',
      brightCyan: '#4dc9b0',
      brightWhite: '#ffffff',
    },
    allowTransparency: true,
  });

  const fitAddon = new FitAddon();
  const webLinksAddon = new WebLinksAddon();
  terminal.loadAddon(fitAddon);
  terminal.loadAddon(webLinksAddon);

  // Simulate a basic interactive shell
  terminal.write('\r\n\x1b[1;32m$ \x1b[0m');

  let lineBuffer = '';
  terminal.onData(data => {
    if (data === '\r') {
      // Execute "command"
      const cmd = lineBuffer.trim();
      lineBuffer = '';
      terminal.write('\r\n');

      if (cmd) {
        if (cmd === 'clear' || cmd === 'cls') {
          terminal.clear();
        } else if (cmd === 'help') {
          terminal.write('Available commands: help, clear, echo, date, ls\r\n');
        } else if (cmd.startsWith('echo ')) {
          terminal.write(cmd.slice(5) + '\r\n');
        } else if (cmd === 'date') {
          terminal.write(new Date().toString() + '\r\n');
        } else if (cmd === 'ls') {
          terminal.write('src/  package.json  tsconfig.json  vite.config.ts\r\n');
        } else {
          terminal.write(`\x1b[33mNote: This is a simulated terminal.\x1b[0m Command not found: ${cmd}\r\n`);
          terminal.write('Real terminal functionality requires a backend server.\r\n');
        }
      }
      terminal.write('\x1b[1;32m$ \x1b[0m');
    } else if (data === '\x7f') {
      // Backspace
      if (lineBuffer.length > 0) {
        lineBuffer = lineBuffer.slice(0, -1);
        terminal.write('\b \b');
      }
    } else if (data === '\x03') {
      // Ctrl+C
      lineBuffer = '';
      terminal.write('^C\r\n\x1b[1;32m$ \x1b[0m');
    } else if (!data.startsWith('\x1b')) {
      lineBuffer += data;
      terminal.write(data);
    }
  });

  const id = `term-${termCounter++}`;
  return { id, terminal, fitAddon, container: null, title: `Terminal ${termCounter - 1}` };
}

export function TerminalPanel() {
  const { settings } = useSettingsStore();
  const [instances, setInstances] = useState<TermInstance[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const containerRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Create initial terminal
  useEffect(() => {
    const inst = createTerminal(settings);
    setInstances([inst]);
    setActiveId(inst.id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mount terminal when its container is available
  useEffect(() => {
    for (const inst of instances) {
      const container = containerRefs.current.get(inst.id);
      if (container && !inst.container) {
        inst.container = container;
        inst.terminal.open(container);
        setTimeout(() => {
          try { inst.fitAddon.fit(); } catch {}
        }, 50);
      }
    }
  }, [instances, activeId]);

  // Fit on resize
  useEffect(() => {
    const active = instances.find(i => i.id === activeId);
    if (!active) return;
    const ro = new ResizeObserver(() => {
      try { active.fitAddon.fit(); } catch {}
    });
    const container = containerRefs.current.get(active.id);
    if (container) ro.observe(container);
    return () => ro.disconnect();
  }, [instances, activeId]);

  const addTerminal = () => {
    const inst = createTerminal(settings);
    setInstances(prev => [...prev, inst]);
    setActiveId(inst.id);
  };

  const removeTerminal = (id: string) => {
    const inst = instances.find(i => i.id === id);
    if (inst) inst.terminal.dispose();
    setInstances(prev => {
      const next = prev.filter(i => i.id !== id);
      if (activeId === id && next.length > 0) setActiveId(next[next.length - 1].id);
      return next;
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      {/* Terminal tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: 'var(--bg0)',
        borderBottom: '1px solid var(--border)',
        height: 30,
        flexShrink: 0,
        overflow: 'hidden',
      }}>
        {instances.map(inst => (
          <div
            key={inst.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '0 10px',
              height: 30,
              cursor: 'pointer',
              borderRight: '1px solid var(--border)',
              background: inst.id === activeId ? 'var(--bg2)' : 'transparent',
              color: inst.id === activeId ? 'var(--fg0)' : 'var(--fg2)',
              fontSize: 12,
              flexShrink: 0,
            }}
            onClick={() => setActiveId(inst.id)}
          >
            {inst.title}
            {instances.length > 1 && (
              <span
                onClick={e => { e.stopPropagation(); removeTerminal(inst.id); }}
                style={{ fontSize: 11, color: 'var(--fg3)', cursor: 'pointer' }}
              >
                ×
              </span>
            )}
          </div>
        ))}
        <button
          style={{
            padding: '0 8px',
            height: 30,
            color: 'var(--fg2)',
            fontSize: 14,
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
          }}
          onClick={addTerminal}
          title="New Terminal"
        >
          <IconPlus size={12}/>
        </button>
      </div>

      {/* Terminal containers */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative', background: 'var(--bg1)' }}>
        {instances.map(inst => (
          <div
            key={inst.id}
            ref={el => {
              if (el) containerRefs.current.set(inst.id, el);
              else containerRefs.current.delete(inst.id);
            }}
            style={{
              position: 'absolute',
              inset: 0,
              padding: 8,
              display: inst.id === activeId ? 'block' : 'none',
            }}
          />
        ))}
      </div>
    </div>
  );
}
