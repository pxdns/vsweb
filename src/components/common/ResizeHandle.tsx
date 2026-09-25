import { useRef, useCallback, useState } from 'react';

interface Props {
  direction: 'horizontal' | 'vertical';
  onResize: (delta: number) => void;
  className?: string;
}

export function ResizeHandle({ direction, onResize, className }: Props) {
  const [dragging, setDragging] = useState(false);
  const lastPos = useRef(0);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
    lastPos.current = direction === 'horizontal' ? e.clientX : e.clientY;

    const onMouseMove = (e: MouseEvent) => {
      const pos = direction === 'horizontal' ? e.clientX : e.clientY;
      const delta = pos - lastPos.current;
      lastPos.current = pos;
      onResize(delta);
    };

    const onMouseUp = () => {
      setDragging(false);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.body.style.cursor = direction === 'horizontal' ? 'col-resize' : 'row-resize';
    document.body.style.userSelect = 'none';
  }, [direction, onResize]);

  const cls = [
    'resize-handle',
    direction === 'horizontal' ? 'resize-handle-right' : 'resize-handle-bottom',
    dragging ? 'dragging' : '',
    className ?? '',
  ].filter(Boolean).join(' ');

  return <div className={cls} onMouseDown={onMouseDown} />;
}
