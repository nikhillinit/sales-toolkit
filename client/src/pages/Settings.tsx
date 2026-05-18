/**
 * Settings — Data management: export, import, clear, auto-backup status.
 *
 * Design: Unified Signal OS — Barlow Condensed, JetBrains Mono, brick red #A82820.
 */
import { useEffect, useRef, useState } from 'react';
import { Download, HardDrive, ShieldCheck, AlertTriangle, Trash2, Upload } from 'lucide-react';
import { idbSet } from '@/lib/storage/idb';
import { STORAGE_KEYS } from '@/lib/storage/keys';
import { parseExport } from '@/lib/exportSchema';
import { useToastActions } from '@/contexts/AppState';
import { exportAllData } from '@/lib/storage/exportData';
import { requestPersistentStorage, getStorageEstimate } from '@/lib/storage/persistentStorage';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatBytes(bytes: number | null): string {
  if (bytes === null) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Settings() {
  const { toast } = useToastActions();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [persisted, setPersisted] = useState<boolean | null>(null);
  const [requesting, setRequesting] = useState(false);
  const [quota, setQuota] = useState<{ quota: number | null; usage: number | null; percentUsed: number | null } | null>(null);

  useEffect(() => {
    async function checkStatus() {
      if (navigator.storage?.persisted) {
        const p = await navigator.storage.persisted();
        setPersisted(p);
      } else {
        setPersisted(false);
      }
      const estimate = await getStorageEstimate();
      setQuota(estimate);
    }
    void checkStatus();
  }, []);

  const handleRequestPersist = async () => {
    setRequesting(true);
    try {
      const result = await requestPersistentStorage();
      setPersisted(result.persisted);
      if (!result.supported) {
        toast('Persistent storage is not supported on this device.');
      } else if (result.persisted) {
        toast('Persistent storage granted — your data is protected.');
      } else {
        toast('Persistent storage not granted. Export backups regularly.');
      }
    } finally {
      setRequesting(false);
    }
  };

  const handleExport = async () => {
    try {
      await exportAllData();
      toast('Data exported.');
    } catch {
      toast('Export failed. Try again.');
    }
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
      const text = await file.text();
      const raw = JSON.parse(text);
      const result = parseExport(raw);
      if (!result.ok) {
        toast(`Import failed: ${result.error}`);
        return;
      }
      const { data } = result.data;
      await Promise.all([
        idbSet(STORAGE_KEYS.storyVault, data.storyVault),
        idbSet(STORAGE_KEYS.trials, data.trials),
        idbSet(STORAGE_KEYS.stats, data.stats),
        idbSet(STORAGE_KEYS.laneSelector, data.laneSelector),
        idbSet(STORAGE_KEYS.repCaptures, data.repCaptures),
        idbSet(STORAGE_KEYS.uiProgress, data.uiProgress),
        idbSet(STORAGE_KEYS.roleplayDebriefs, data.roleplayDebriefs),
      ]);
      toast('Data imported. Reload to apply.');
    } catch {
      toast('Import failed — invalid or corrupt file.');
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleClearAll = async () => {
    if (!confirm('Clear ALL FieldKit data? This cannot be undone.')) return;
    setClearing(true);
    try {
      await Promise.all(
        Object.values(STORAGE_KEYS).map(key => idbSet(key, null)),
      );
      toast('All data cleared. Reload to reset the app.');
    } catch {
      toast('Clear failed. Try again.');
    } finally {
      setClearing(false);
    }
  };

  const panelStyle: React.CSSProperties = {
    background: '#fff',
    border: '1px solid #C8CCD2',
    borderRadius: '4px',
    padding: '16px',
    marginBottom: '12px',
  };

  const btnStyle = (color: string, disabled = false): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    border: `1.5px solid ${color}`,
    background: 'transparent',
    color,
    borderRadius: '3px',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '11px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    cursor: disabled ? 'default' : 'pointer',
    width: '100%',
    justifyContent: 'center',
    marginBottom: '8px',
    WebkitTapHighlightColor: 'transparent',
    opacity: disabled ? 0.55 : 1,
  });

  const mono: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 700,
    letterSpacing: '0.05em',
  };

  return (
    <div style={{ padding: '16px', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
      <div className="os-kicker" style={{ marginBottom: '4px' }}>Tool 09</div>
      <h2 className="os-h1" style={{ marginBottom: '16px' }}>Data &amp; Settings</h2>

      {/* Export */}
      <div style={panelStyle}>
        <div className="os-h2" style={{ marginTop: 0 }}>Export Backup</div>
        <p style={{ fontSize: '13px', color: '#4A5159', marginBottom: '12px' }}>
          Downloads a <code>.json</code> file with all your FieldKit data — stories, trials, stats,
          lane plans, rep captures, and roleplay debriefs.
        </p>
        <button style={btnStyle('#2E7D32')} onClick={handleExport}>
          <Download size={14} aria-hidden="true" />
          Export All Data
        </button>
      </div>

      {/* Import */}
      <div style={panelStyle}>
        <div className="os-h2" style={{ marginTop: 0 }}>Import Backup</div>
        <p style={{ fontSize: '13px', color: '#4A5159', marginBottom: '12px' }}>
          Restore from a previously exported <code>.json</code> file. Existing data will be
          overwritten. The file is validated before any writes.
        </p>
        <button
          style={btnStyle('#1565C0', importing)}
          onClick={() => fileInputRef.current?.click()}
          disabled={importing}
        >
          <Upload size={14} aria-hidden="true" />
          {importing ? 'Importing…' : 'Import Backup File'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          style={{ display: 'none' }}
          onChange={handleImportFile}
        />
      </div>

      {/* Persistent storage */}
      <div style={panelStyle}>
        <div className="os-h2" style={{ marginTop: 0 }}>Persistent Storage</div>
        <p style={{ fontSize: '13px', color: '#4A5159', marginBottom: '12px' }}>
          Without persistent storage, the browser can silently delete your data under storage
          pressure — or on iOS Safari after 7 days of inactivity. Granting this prevents eviction.
        </p>

        {/* Status badge */}
        {persisted !== null && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            background: persisted ? '#E8F5E9' : '#FFF8E1',
            border: `1.5px solid ${persisted ? '#2E7D32' : '#B45309'}`,
            borderRadius: '3px',
            marginBottom: '8px',
            ...mono,
            fontSize: '10px',
            color: persisted ? '#2E7D32' : '#B45309',
          }}>
            {persisted
              ? <><ShieldCheck size={13} aria-hidden="true" /> PERSISTENT STORAGE ACTIVE — DATA IS PROTECTED</>
              : <><AlertTriangle size={13} aria-hidden="true" /> NOT GRANTED — DATA MAY BE EVICTED BY BROWSER</>
            }
          </div>
        )}

        {/* Storage quota */}
        {quota && (quota.quota !== null || quota.usage !== null) && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            background: '#F4F1EA',
            border: '1px solid #C8CCD2',
            borderRadius: '3px',
            marginBottom: '8px',
            ...mono,
            fontSize: '10px',
            color: '#4A5159',
          }}>
            <HardDrive size={13} aria-hidden="true" />
            <span>
              STORAGE:{' '}
              <span style={{ color: '#1A1D22' }}>{formatBytes(quota.usage)}</span>
              {quota.quota !== null && (
                <> used of <span style={{ color: '#1A1D22' }}>{formatBytes(quota.quota)}</span></>
              )}
              {quota.percentUsed !== null && (
                <> &mdash; <span style={{ color: quota.percentUsed > 80 ? '#A82820' : '#1A1D22' }}>{quota.percentUsed}%</span></>
              )}
            </span>
          </div>
        )}

        {/* Request button — only shown when not already persisted */}
        {persisted === false && (
          <button
            style={btnStyle('#4A5159', requesting)}
            onClick={handleRequestPersist}
            disabled={requesting}
          >
            <ShieldCheck size={14} aria-hidden="true" />
            {requesting ? 'Requesting…' : 'Request Persistent Storage'}
          </button>
        )}

        {persisted === null && (
          <p style={{ fontSize: '11px', color: '#4A5159', ...mono, margin: 0 }}>
            Checking storage status…
          </p>
        )}
      </div>

      {/* Clear all */}
      <div style={{ ...panelStyle, borderColor: '#FEECEC' }}>
        <div className="os-h2" style={{ marginTop: 0, color: '#A82820' }}>Danger Zone</div>
        <p style={{ fontSize: '13px', color: '#4A5159', marginBottom: '12px' }}>
          Permanently delete all FieldKit data from this device. Export a backup first.
        </p>
        <button style={btnStyle('#A82820', clearing)} onClick={handleClearAll} disabled={clearing}>
          <Trash2 size={14} aria-hidden="true" />
          {clearing ? 'Clearing…' : 'Clear All Data'}
        </button>
      </div>
    </div>
  );
}
