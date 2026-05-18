/**
 * StorageWarningBanner — shown on app boot when storage is not persisted.
 *
 * - Checks navigator.storage.persisted() on mount (read-only, no user gesture).
 * - Shows a dismissible banner with a "Request Persistent Storage" button
 *   (the actual persist() call happens on user tap, satisfying the gesture req).
 * - On iOS Safari, adds an extra line warning about 7-day ITP eviction.
 * - On browsers where the StorageManager API is unavailable, shows a fallback
 *   export-only warning so users still get guidance about data safety.
 * - Includes a one-click "Export Now" escape hatch.
 * - Dismissed state is stored in sessionStorage so it reappears next session
 *   if storage is still not persisted.
 */
import { useEffect, useState } from 'react';
import { AlertTriangle, Download, ShieldCheck, X } from 'lucide-react';
import { exportAllData } from '@/lib/storage/exportData';
import { requestPersistentStorage } from '@/lib/storage/persistentStorage';

const DISMISSED_KEY = 'fk_storage_banner_dismissed';

function isIosSafari(): boolean {
  const ua = navigator.userAgent;
  const isIos = /iP(hone|ad|od)/.test(ua);
  const isWebkit = /WebKit/.test(ua);
  const isCriOS = /CriOS/.test(ua);
  const isFxiOS = /FxiOS/.test(ua);
  return isIos && isWebkit && !isCriOS && !isFxiOS;
}

type BannerMode = 'not-persisted' | 'api-unsupported' | 'hidden';

export default function StorageWarningBanner() {
  const [mode, setMode] = useState<BannerMode>('hidden');
  const [ios, setIos] = useState(false);
  const [granted, setGranted] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState(false);

  useEffect(() => {
    async function check() {
      if (sessionStorage.getItem(DISMISSED_KEY) === '1') return;

      if (!navigator.storage?.persisted) {
        setIos(isIosSafari());
        setMode('api-unsupported');
        return;
      }

      const persisted = await navigator.storage.persisted();
      if (persisted) return;

      setIos(isIosSafari());
      setMode('not-persisted');
    }
    void check();
  }, []);

  const handleRequestPersist = async () => {
    const result = await requestPersistentStorage();
    setGranted(result.persisted);
    if (result.persisted) {
      setTimeout(() => {
        setMode('hidden');
        sessionStorage.setItem(DISMISSED_KEY, '1');
      }, 1800);
    }
  };

  const handleDismiss = () => {
    setMode('hidden');
    sessionStorage.setItem(DISMISSED_KEY, '1');
  };

  const handleExport = async () => {
    setExporting(true);
    setExportError(false);
    try {
      await exportAllData();
    } catch {
      setExportError(true);
      setTimeout(() => setExportError(false), 3000);
    } finally {
      setExporting(false);
    }
  };

  if (mode === 'hidden') return null;

  const mono: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 700,
    letterSpacing: '0.05em',
  };

  const accentColor = granted ? '#2E7D32' : ios ? '#E65100' : '#B45309';
  const bgColor = granted ? '#E8F5E9' : ios ? '#FFF3E0' : '#FFF8E1';

  const message = granted
    ? 'PERSISTENT STORAGE GRANTED — YOUR DATA IS PROTECTED.'
    : mode === 'api-unsupported'
      ? ios
        ? 'IOS SAFARI: STORAGE MAY BE ERASED AFTER 7 DAYS OF INACTIVITY. EXPORT BACKUPS REGULARLY.'
        : 'THIS BROWSER CANNOT LOCK STORAGE — DATA MAY BE CLEARED. EXPORT BACKUPS REGULARLY.'
      : ios
        ? 'IOS SAFARI: DATA MAY BE ERASED AFTER 7 DAYS OF INACTIVITY. REQUEST PERSISTENT STORAGE OR EXPORT A BACKUP.'
        : 'STORAGE IS NOT PERSISTENT — DATA MAY BE CLEARED BY THE BROWSER.';

  return (
    <div
      role="alert"
      style={{
        background: bgColor,
        borderBottom: `2px solid ${accentColor}`,
        padding: '10px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        flexShrink: 0,
      }}
    >
      {/* Row 1: icon + message + dismiss */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
        {granted
          ? <ShieldCheck size={15} color="#2E7D32" style={{ flexShrink: 0, marginTop: '1px' }} aria-hidden="true" />
          : <AlertTriangle size={15} color={accentColor} style={{ flexShrink: 0, marginTop: '1px' }} aria-hidden="true" />
        }
        <div style={{ flex: 1, fontSize: '11px', color: '#1A1D22', ...mono }}>
          {ios && !granted && message.startsWith('IOS SAFARI')
            ? <>
                <span style={{ color: accentColor }}>IOS SAFARI:</span>
                {' '}{message.replace(/^IOS SAFARI:\s*/i, '')}
              </>
            : message
          }
        </div>
        {!granted && (
          <button
            onClick={handleDismiss}
            aria-label="Dismiss storage warning"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0',
              flexShrink: 0,
              color: '#4A5159',
              lineHeight: 1,
            }}
          >
            <X size={14} aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Row 2: action buttons */}
      {!granted && (
        <div style={{ display: 'flex', gap: '8px', paddingLeft: '23px' }}>
          {/* "Keep Data Safe" only when the API is available */}
          {mode === 'not-persisted' && (
            <button
              onClick={handleRequestPersist}
              style={{
                ...mono,
                fontSize: '10px',
                padding: '5px 10px',
                border: `1.5px solid ${accentColor}`,
                borderRadius: '3px',
                background: 'transparent',
                color: accentColor,
                cursor: 'pointer',
                textTransform: 'uppercase',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <ShieldCheck size={11} aria-hidden="true" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
              Keep Data Safe
            </button>
          )}

          <button
            onClick={handleExport}
            disabled={exporting}
            style={{
              ...mono,
              fontSize: '10px',
              padding: '5px 10px',
              border: `1.5px solid ${exportError ? '#A82820' : '#2E7D32'}`,
              borderRadius: '3px',
              background: 'transparent',
              color: exportError ? '#A82820' : '#2E7D32',
              cursor: exporting ? 'default' : 'pointer',
              textTransform: 'uppercase',
              WebkitTapHighlightColor: 'transparent',
              opacity: exporting ? 0.6 : 1,
            }}
          >
            <Download size={11} aria-hidden="true" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
            {exporting ? 'Exporting…' : exportError ? 'Export Failed' : 'Export Now'}
          </button>
        </div>
      )}
    </div>
  );
}
