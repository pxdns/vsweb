import { useSettingsStore } from '../../store/settings';
import { getFileIcon } from '../common/Icons';
import type { EditorTab } from '../../types';

interface Props {
  tab: EditorTab;
}

export function Breadcrumbs({ tab }: Props) {
  const { settings } = useSettingsStore();

  if (!settings.appearance.breadcrumbsVisible) return null;

  // Split path into segments, skipping empty leading slash
  const segments = tab.path.split('/').filter(Boolean);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      height: 22,
      padding: '0 10px',
      fontSize: 11,
      color: 'var(--fg3)',
      background: 'var(--bg1)',
      borderBottom: '1px solid var(--border)',
      overflow: 'hidden',
      flexShrink: 0,
      gap: 0,
    }}>
      {segments.map((seg, i) => {
        const isLast = i === segments.length - 1;
        const isFile = isLast;
        return (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            {i > 0 && (
              <span style={{ color: 'var(--fg3)', padding: '0 2px', fontSize: 10 }}>›</span>
            )}
            {isFile && (
              <span style={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
                {getFileIcon(seg)}
              </span>
            )}
            <span style={{
              color: isLast ? 'var(--fg1)' : 'var(--fg3)',
              fontWeight: isLast ? 500 : 400,
              whiteSpace: 'nowrap',
            }}>
              {seg}
            </span>
          </span>
        );
      })}
    </div>
  );
}
