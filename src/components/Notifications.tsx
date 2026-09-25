import { useEffect } from 'react';
import { useUIStore } from '../store/ui';
import { IconClose, IconInfo, IconSuccess, IconWarning, IconError } from './common/Icons';

const ICONS = {
  info: <IconInfo size={14} style={{ color: 'var(--info)' }}/>,
  success: <IconSuccess size={14} style={{ color: 'var(--success)' }}/>,
  warning: <IconWarning size={14} style={{ color: 'var(--warning)' }}/>,
  error: <IconError size={14} style={{ color: 'var(--error)' }}/>,
};

export function Notifications() {
  const { notifications, removeNotification } = useUIStore();

  return (
    <div className="notifications-container">
      {notifications.map(n => (
        <NotificationToast key={n.id} notification={n} onRemove={() => removeNotification(n.id)}/>
      ))}
    </div>
  );
}

function NotificationToast({ notification: n, onRemove }: {
  notification: ReturnType<typeof useUIStore.getState>['notifications'][0];
  onRemove: () => void;
}) {
  useEffect(() => {
    if (n.duration) {
      const t = setTimeout(onRemove, n.duration);
      return () => clearTimeout(t);
    }
  }, [n.id, n.duration, onRemove]);

  return (
    <div className={`notification-toast ${n.type}`}>
      <span className="notification-icon">{ICONS[n.type]}</span>
      <span className="notification-message">{n.message}</span>
      <button className="notification-close" onClick={onRemove}>
        <IconClose size={12}/>
      </button>
    </div>
  );
}
