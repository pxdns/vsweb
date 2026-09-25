import { useState } from 'react';
import { useSettingsStore } from '../../store/settings';
import { useUIStore } from '../../store/ui';
import { themes } from '../../themes';
import { IconClose } from '../common/Icons';
import type { ThemeId } from '../../types';

type SettingsSection = 'editor' | 'appearance' | 'typescript' | 'terminal' | 'git' | 'preview' | 'keybindings';

interface ToggleProps {
  value: boolean;
  onChange: (v: boolean) => void;
}
function Toggle({ value, onChange }: ToggleProps) {
  return (
    <button
      className={`ide-toggle${value ? ' on' : ''}`}
      onClick={() => onChange(!value)}
      aria-checked={value}
      role="switch"
    />
  );
}

interface SelectProps {
  value: string;
  onChange: (v: string) => void;
  options: Array<{ label: string; value: string }>;
}
function Select({ value, onChange, options }: SelectProps) {
  return (
    <select className="ide-select" value={value} onChange={e => onChange(e.target.value)}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

interface NumberInputProps {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  style?: React.CSSProperties;
}
function NumberInput({ value, onChange, min, max, step = 1, style }: NumberInputProps) {
  return (
    <input
      type="number"
      className="ide-input"
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={e => onChange(Number(e.target.value))}
      style={{ width: 70, ...style }}
    />
  );
}

interface RowProps {
  name: string;
  description?: string;
  children: React.ReactNode;
}
function Row({ name, description, children }: RowProps) {
  return (
    <div className="setting-row">
      <div className="setting-info">
        <div className="setting-name">{name}</div>
        {description && <div className="setting-description">{description}</div>}
      </div>
      <div className="setting-control">{children}</div>
    </div>
  );
}

export function SettingsPanel() {
  const [section, setSection] = useState<SettingsSection>('editor');
  const { settings, updateEditor, updateAppearance, updateTerminal, updateTypescript, updateGit, updatePreview, setTheme, reset } = useSettingsStore();
  const { setSettingsOpen } = useUIStore();

  const navItems: Array<{ id: SettingsSection; label: string }> = [
    { id: 'editor', label: 'Editor' },
    { id: 'appearance', label: 'Appearance' },
    { id: 'typescript', label: 'TypeScript' },
    { id: 'terminal', label: 'Terminal' },
    { id: 'git', label: 'Git' },
    { id: 'preview', label: 'Preview' },
    { id: 'keybindings', label: 'Keybindings' },
  ];

  return (
    <div className="settings-overlay" onClick={e => e.stopPropagation()}>
      <div className="settings-header">
        <h2>Settings</h2>
        <button className="settings-close" onClick={() => setSettingsOpen(false)}>
          <IconClose size={16}/>
        </button>
      </div>
      <div className="settings-body">
        <div className="settings-nav">
          {navItems.map(item => (
            <div
              key={item.id}
              className={`settings-nav-item${section === item.id ? ' active' : ''}`}
              onClick={() => setSection(item.id)}
            >
              {item.label}
            </div>
          ))}
          <div style={{ marginTop: 'auto', padding: '16px' }}>
            <button className="ide-btn danger" onClick={() => { if (confirm('Reset all settings to defaults?')) reset(); }}>
              Reset to Defaults
            </button>
          </div>
        </div>

        <div className="settings-content">
          {section === 'editor' && (
            <div className="settings-section">
              <div className="settings-section-title">Editor</div>
              <Row name="Font Size" description="Controls the font size in pixels.">
                <NumberInput value={settings.editor.fontSize} onChange={v => updateEditor({ fontSize: v })} min={8} max={32}/>
              </Row>
              <Row name="Font Ligatures" description="Enables/disables font ligatures.">
                <Toggle value={settings.editor.fontLigatures} onChange={v => updateEditor({ fontLigatures: v })}/>
              </Row>
              <Row name="Tab Size" description="The number of spaces a tab is equal to.">
                <NumberInput value={settings.editor.tabSize} onChange={v => updateEditor({ tabSize: v })} min={1} max={8}/>
              </Row>
              <Row name="Insert Spaces" description="Insert spaces when pressing Tab.">
                <Toggle value={settings.editor.insertSpaces} onChange={v => updateEditor({ insertSpaces: v })}/>
              </Row>
              <Row name="Word Wrap" description="Controls how lines should wrap.">
                <Select
                  value={settings.editor.wordWrap}
                  onChange={v => updateEditor({ wordWrap: v as any })}
                  options={[
                    { value: 'off', label: 'Off' },
                    { value: 'on', label: 'On' },
                    { value: 'wordWrapColumn', label: 'Word Wrap Column' },
                    { value: 'bounded', label: 'Bounded' },
                  ]}
                />
              </Row>
              <Row name="Minimap" description="Controls whether the minimap is shown.">
                <Toggle value={settings.editor.minimap} onChange={v => updateEditor({ minimap: v })}/>
              </Row>
              <Row name="Line Numbers" description="Controls the display of line numbers.">
                <Select
                  value={settings.editor.lineNumbers}
                  onChange={v => updateEditor({ lineNumbers: v as any })}
                  options={[
                    { value: 'on', label: 'On' },
                    { value: 'off', label: 'Off' },
                    { value: 'relative', label: 'Relative' },
                  ]}
                />
              </Row>
              <Row name="Format On Save" description="Format a file on save.">
                <Toggle value={settings.editor.formatOnSave} onChange={v => updateEditor({ formatOnSave: v })}/>
              </Row>
              <Row name="Auto Save" description="Controls auto save of editors.">
                <Select
                  value={settings.editor.autoSave}
                  onChange={v => updateEditor({ autoSave: v as any })}
                  options={[
                    { value: 'off', label: 'Off' },
                    { value: 'afterDelay', label: 'After Delay' },
                    { value: 'onFocusChange', label: 'On Focus Change' },
                    { value: 'onWindowChange', label: 'On Window Change' },
                  ]}
                />
              </Row>
              {settings.editor.autoSave === 'afterDelay' && (
                <Row name="Auto Save Delay" description="Controls the delay in ms after which to auto save.">
                  <NumberInput value={settings.editor.autoSaveDelay} onChange={v => updateEditor({ autoSaveDelay: v })} min={100} max={10000} step={100}/>
                </Row>
              )}
              <Row name="Sticky Scroll" description="Shows the nesting structure of the current scope at the top.">
                <Toggle value={settings.editor.stickyScroll} onChange={v => updateEditor({ stickyScroll: v })}/>
              </Row>
              <Row name="Bracket Pair Colorization" description="Enables bracket pair colorization.">
                <Toggle value={settings.editor.bracketPairColorization} onChange={v => updateEditor({ bracketPairColorization: v })}/>
              </Row>
              <Row name="Smooth Scrolling" description="Controls whether the editor will scroll using an animation.">
                <Toggle value={settings.editor.smoothScrolling} onChange={v => updateEditor({ smoothScrolling: v })}/>
              </Row>
              <Row name="Cursor Style">
                <Select
                  value={settings.editor.cursorStyle}
                  onChange={v => updateEditor({ cursorStyle: v as any })}
                  options={[
                    { value: 'line', label: 'Line' },
                    { value: 'block', label: 'Block' },
                    { value: 'underline', label: 'Underline' },
                  ]}
                />
              </Row>
            </div>
          )}

          {section === 'appearance' && (
            <div className="settings-section">
              <div className="settings-section-title">Appearance</div>
              <Row name="Color Theme" description="Specifies the color theme used in the workbench.">
                <Select
                  value={settings.appearance.theme}
                  onChange={v => setTheme(v as ThemeId)}
                  options={Object.values(themes).map(t => ({ value: t.id, label: t.name }))}
                />
              </Row>
              <Row name="Status Bar" description="Controls the visibility of the status bar at the bottom of the workbench.">
                <Toggle value={settings.appearance.statusBarVisible} onChange={v => updateAppearance({ statusBarVisible: v })}/>
              </Row>
              <Row name="Breadcrumbs" description="Enable/disable navigation breadcrumbs.">
                <Toggle value={settings.appearance.breadcrumbsVisible} onChange={v => updateAppearance({ breadcrumbsVisible: v })}/>
              </Row>
              <div style={{ marginTop: 24 }}>
                <div className="settings-section-title">Theme Preview</div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 12 }}>
                  {Object.values(themes).map(t => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      style={{
                        background: t.colors.bg1,
                        border: `2px solid ${t.id === settings.appearance.theme ? t.colors.accent : t.colors.border}`,
                        borderRadius: 6,
                        padding: '8px 12px',
                        cursor: 'pointer',
                        minWidth: 80,
                        transition: 'border-color 0.15s',
                      }}
                    >
                      <div style={{ fontSize: 12, color: t.colors.fg0, fontWeight: 500 }}>{t.name}</div>
                      <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                        {[t.colors.syntaxKeyword, t.colors.syntaxString, t.colors.syntaxFunction, t.colors.accent].map((c, i) => (
                          <div key={i} style={{ width: 14, height: 14, borderRadius: 3, background: c }}/>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {section === 'typescript' && (
            <div className="settings-section">
              <div className="settings-section-title">TypeScript</div>
              <Row name="Suggestions" description="Enables TypeScript completions.">
                <Toggle value={settings.typescript.suggest} onChange={v => updateTypescript({ suggest: v })}/>
              </Row>
              <Row name="Auto Imports" description="Enable/disable auto import suggestions.">
                <Toggle value={settings.typescript.autoImports} onChange={v => updateTypescript({ autoImports: v })}/>
              </Row>
              <Row name="Validate On Type" description="Enable/disable TypeScript validation as you type.">
                <Toggle value={settings.typescript.validateOnType} onChange={v => updateTypescript({ validateOnType: v })}/>
              </Row>
              <Row name="Inlay Hints" description="Enable/disable inlay hints for parameter names and types.">
                <Toggle value={settings.typescript.inlayHints} onChange={v => updateTypescript({ inlayHints: v })}/>
              </Row>
              <Row name="Strict Mode" description="Enable all strict type-checking options.">
                <Toggle value={settings.typescript.strictMode} onChange={v => updateTypescript({ strictMode: v })}/>
              </Row>
            </div>
          )}

          {section === 'terminal' && (
            <div className="settings-section">
              <div className="settings-section-title">Terminal</div>
              <Row name="Font Size">
                <NumberInput value={settings.terminal.fontSize} onChange={v => updateTerminal({ fontSize: v })} min={8} max={24}/>
              </Row>
              <Row name="Scrollback" description="Controls the maximum number of lines the terminal keeps in its buffer.">
                <NumberInput value={settings.terminal.scrollback} onChange={v => updateTerminal({ scrollback: v })} min={1000} max={100000} step={1000}/>
              </Row>
              <Row name="Cursor Style">
                <Select
                  value={settings.terminal.cursorStyle}
                  onChange={v => updateTerminal({ cursorStyle: v as any })}
                  options={[
                    { value: 'block', label: 'Block' },
                    { value: 'underline', label: 'Underline' },
                    { value: 'bar', label: 'Bar' },
                  ]}
                />
              </Row>
            </div>
          )}

          {section === 'git' && (
            <div className="settings-section">
              <div className="settings-section-title">Git</div>
              <Row name="Auto Fetch" description="When enabled, commits a new push without staging.">
                <Toggle value={settings.git.autofetch} onChange={v => updateGit({ autofetch: v })}/>
              </Row>
              <Row name="Confirm Sync" description="Controls whether a notification is shown before syncing.">
                <Toggle value={settings.git.confirmSync} onChange={v => updateGit({ confirmSync: v })}/>
              </Row>
              <Row name="Default Branch Name" description="The default branch name when initializing a repository.">
                <input
                  className="ide-input"
                  value={settings.git.defaultBranch}
                  onChange={e => updateGit({ defaultBranch: e.target.value })}
                  style={{ width: 120 }}
                />
              </Row>
            </div>
          )}

          {section === 'preview' && (
            <div className="settings-section">
              <div className="settings-section-title">Preview</div>
              <Row name="Auto Open" description="Automatically open preview when starting dev server.">
                <Toggle value={settings.preview.autoOpen} onChange={v => updatePreview({ autoOpen: v })}/>
              </Row>
              <Row name="Default Port" description="The default port to use for the preview.">
                <NumberInput value={settings.preview.port} onChange={v => updatePreview({ port: v })} min={1024} max={65535}/>
              </Row>
              <Row name="Show Console" description="Show browser console in the preview panel.">
                <Toggle value={settings.preview.showConsole} onChange={v => updatePreview({ showConsole: v })}/>
              </Row>
            </div>
          )}

          {section === 'keybindings' && (
            <div className="settings-section">
              <div className="settings-section-title">Keyboard Shortcuts</div>
              {[
                ['Command Palette', 'Ctrl+Shift+P'],
                ['Quick Open File', 'Ctrl+P'],
                ['Save File', 'Ctrl+S'],
                ['Close Tab', 'Ctrl+W'],
                ['Split Editor', 'Ctrl+\\'],
                ['Toggle Terminal', 'Ctrl+`'],
                ['Go to Definition', 'F12'],
                ['Find References', 'Shift+F12'],
                ['Rename Symbol', 'F2'],
                ['Format Document', 'Shift+Alt+F'],
                ['Toggle Sidebar', 'Ctrl+B'],
                ['Open Settings', 'Ctrl+,'],
                ['New Project', 'Ctrl+Shift+N'],
                ['Find in Files', 'Ctrl+Shift+F'],
              ].map(([label, key]) => (
                <div key={label} className="shortcut-row" style={{ borderBottom: '1px solid var(--border)', padding: '6px 0' }}>
                  <span style={{ fontSize: 13, color: 'var(--fg0)' }}>{label}</span>
                  <span style={{ marginLeft: 'auto' }}><kbd>{key}</kbd></span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
