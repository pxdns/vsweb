export function GitPanel() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <div className="empty-state">
        <div className="empty-state-title">Git</div>
        <div className="empty-state-text">
          Git integration connects to a real git repository.<br/>
          Open the Git sidebar panel for full version control.
        </div>
      </div>
    </div>
  );
}
