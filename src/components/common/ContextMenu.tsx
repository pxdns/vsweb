import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: ReactNode;
  shortcut?: string;
  danger?: boolean;
  disabled?: boolean;
  separator?: false;
  onClick: () => void;
}

export interface ContextMenuSeparator {
  id: string;
  separator: true;
}

export type ContextMenuEntry = ContextMenuItem | ContextMenuSeparator;

interface Props {
  items: ContextMenuEntry[];
  x: number;
  y: number;
  onClose: () => void;
}

export function ContextMenu({ items, x, y, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  // Adjust position to stay in viewport
  const menuWidth = 200;
  const menuHeight = items.length * 30;
  const adjustedX = Math.min(x, window.innerWidth - menuWidth - 8);
  const adjustedY = Math.min(y, window.innerHeight - menuHeight - 8);

  return (
    <div
      ref={ref}
      className="context-menu"
      style={{ left: adjustedX, top: adjustedY }}
      onContextMenu={e => e.preventDefault()}
    >
      {items.map(item =>
        item.separator ? (
          <div key={item.id} className="context-menu-separator" />
        ) : (
          <div
            key={item.id}
            className={`context-menu-item${item.danger ? ' danger' : ''}${item.disabled ? ' disabled' : ''}`}
            onClick={() => {
              if (!item.disabled) {
                item.onClick();
                onClose();
              }
            }}
          >
            {item.icon && <span className="context-menu-item-icon">{item.icon}</span>}
            <span>{item.label}</span>
            {item.shortcut && <span className="context-menu-shortcut">{item.shortcut}</span>}
          </div>
        )
      )}
    </div>
  );
}

export function useContextMenu() {
  const show = (items: ContextMenuEntry[], e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const event = new CustomEvent('show-context-menu', {
      detail: { items, x: e.clientX, y: e.clientY },
    });
    document.dispatchEvent(event);
  };
  return { show };
}
