import { useState, useRef, useEffect } from 'react';

const INITIAL_OUTPUT = `[VSWeb] Workspace initialized
[VSWeb] TypeScript language service ready
[VSWeb] File watcher active
`;

export function OutputPanel() {
  const [output] = useState(INITIAL_OUTPUT);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output]);

  return (
    <div style={{ flex: 1, overflow: 'auto', fontFamily: 'monospace' }}>
      <pre className="output-content">{output}</pre>
      <div ref={bottomRef}/>
    </div>
  );
}
