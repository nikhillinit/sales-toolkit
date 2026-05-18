/**
 * Toast — Unified Signal OS
 * Fixed bottom-left notification for state changes.
 */
import { useAppState } from '@/contexts/AppState';
import { useEffect, useState } from 'react';

export default function Toast() {
  const { toastMessage } = useAppState();
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState('');

  useEffect(() => {
    if (toastMessage) {
      setText(toastMessage);
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [toastMessage]);

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: '80px',
        left: '16px',
        right: '16px',
        background: '#1A1D22',
        color: '#fff',
        padding: '10px 16px',
        borderRadius: '4px',
        fontSize: '13px',
        fontWeight: 600,
        fontFamily: "'Source Sans 3', sans-serif",
        zIndex: 1000,
        boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
        transition: 'opacity 0.25s ease-out, transform 0.25s ease-out',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(8px)',
        pointerEvents: visible ? 'auto' : 'none',
        maxWidth: '480px',
        margin: '0 auto',
      }}
    >
      {text}
    </div>
  );
}
