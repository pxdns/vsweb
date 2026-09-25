import { useState } from 'react';
import { useWorkspaceStore } from '../store/workspace';
import { useUIStore } from '../store/ui';
import { templates, templateCategories } from '../services/filesystem/templates';
import { IconClose } from './common/Icons';

export function NewProjectDialog() {
  const [name, setName] = useState('my-project');
  const [selectedTemplate, setSelectedTemplate] = useState('react-ts');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { createWorkspace } = useWorkspaceStore();
  const { setNewProjectOpen, addNotification } = useUIStore();

  const filtered = selectedCategory
    ? templates.filter(t => t.category === selectedCategory)
    : templates;

  const handleCreate = () => {
    if (!name.trim()) return;
    try {
      createWorkspace(name.trim(), selectedTemplate || undefined);
      addNotification('success', `Project "${name}" created`);
      setNewProjectOpen(false);
    } catch (e: any) {
      addNotification('error', `Failed to create project: ${e.message}`);
    }
  };

  return (
    <div className="new-project-overlay" onClick={() => setNewProjectOpen(false)}>
      <div className="new-project-dialog" onClick={e => e.stopPropagation()}>
        <div className="new-project-header">
          <h2>New Project</h2>
          <button className="settings-close" onClick={() => setNewProjectOpen(false)}>
            <IconClose size={16}/>
          </button>
        </div>

        <div className="new-project-body">
          <div className="new-project-field">
            <label>Project Name</label>
            <input
              className="ide-input"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
              autoFocus
              style={{ width: '100%', fontSize: 13 }}
            />
          </div>

          <div className="new-project-field">
            <label>Template</label>

            {/* Category filter */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
              <button
                className={`ide-btn${selectedCategory === null ? ' primary' : ''}`}
                onClick={() => setSelectedCategory(null)}
              >
                All
              </button>
              {templateCategories.map(cat => (
                <button
                  key={cat}
                  className={`ide-btn${selectedCategory === cat ? ' primary' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="new-project-templates">
              {filtered.map(t => (
                <div
                  key={t.id}
                  className={`template-card${selectedTemplate === t.id ? ' selected' : ''}`}
                  onClick={() => setSelectedTemplate(t.id)}
                >
                  <div className="template-card-name">{t.name}</div>
                  <div className="template-card-desc">{t.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="new-project-footer">
          <button className="ide-btn" onClick={() => setNewProjectOpen(false)}>
            Cancel
          </button>
          <button
            className="ide-btn primary"
            onClick={handleCreate}
            disabled={!name.trim()}
          >
            Create Project
          </button>
        </div>
      </div>
    </div>
  );
}
