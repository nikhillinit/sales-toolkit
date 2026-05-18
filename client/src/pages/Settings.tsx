/**
 * Settings — Data management: export, import, clear, auto-backup status.
 *
 * Design: Unified Signal OS — Barlow Condensed, JetBrains Mono, brick red #A82820.
 */
import { useRef, useState } from 'react';
import { Download, Upload, Trash2, ShieldCheck, AlertTriangle } from 'lucide-react';
import { idbGet, idbSet } from '@/lib/storage/idb';
import { STORAGE_KEYS } from '@/lib/storage/keys';
import { parseExport, EXPORT_SCHEMA_VERSION, type FieldKitExport } from '@/lib/exportSchema';
import { useToastActions } from '@/contexts/AppState';

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function gatherExportData(): Promise<FieldKitExport> {
  const [storyVault, trials, stats, laneSelector, repCaptures, uiProgress, roleplayDebriefs] =
    await Promise.all([
      idbGet(STORAGE_KEYS.storyVault, []),
      idbGet(STORAGE_KEYS.trials, []),
      idbGet(STORAGE_KEYS.stats, {}),
      idbGet(STORAGE_KEYS.laneSelector, null),
      idbGet(STORAGE_KEYS.repCaptures, []),
      idbGet(STORAGE_KEYS.uiProgress, {}),
      idbGet(STORAGE_KEYS.roleplayDebriefs, []),
    ]);

  return {
    schemaVersion: EXPORT_SCHEMA_VERSION as 1,
    exportedAt: new Date().toISOString(),
    appVersion: '2.0.0',
    data: {
      storyVault: storyVault as FieldKitExport['data']['storyVault'],
      trials: trials as FieldKitExport['data']['trials'],
      stats: stats as FieldKitExport['data']['stats'],
      laneSelector: laneSelector as FieldKitExport['data']['laneSelector'],
      repCaptures: repCaptures as FieldKitExport['data']['repCaptures'],
      networkLogs: [] as FieldKitExport['data']['networkLogs'],
      uiProgress: uiProgress as FieldKitExport['data']['uiProgress'],
      roleplayDebriefs: roleplayDebriefs as FieldKitExport['data']['roleplayDebriefs'],
    },
  };
}

function downloadJson(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Settings() {
  const { toast } = useToastActions();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [storageGranted, setStorageGranted] = useState<boolean | null>(null);

  // Check persistent storage status
  const checkStorage = async () => {
    if (!navigator.storage?.persisted) {
      setStorageGranted(false);
      return;
    }
    const persisted = await navigator.storage.persisted();
    if (persisted) {
      setStorageGranted(true);
      return;
    }
    const granted = await navigator.storage.persist();
    setStorageGranted(granted);
    toast(granted ? 'Persistent storage granted.' : 'Persistent storage not available on this device.');
  };

  const handleExport = async () => {
    try {
      const data = await gatherExportData();
      const date = new Date().toISOString().slice(0, 10);
      downloadJson(data, `fieldkit-backup-${date}.json`);
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

  const btnStyle = (color: string): React.CSSProperties => ({
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
    cursor: 'pointer',
    width: '100%',
    justifyContent: 'center',
    marginBottom: '8px',
    WebkitTapHighlightColor: 'transparent',
  });

  return (
    <div style={{ padding: '16px', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
      <div className="os-kicker" style={{ marginBottom: '4px' }}>Tool 09</div>
      <h2 className="os-h1" style={{ marginBottom: '16px' }}>Data &amp; Settings</h2>

      {/* Export */}
      <div style={panelStyle}>
        <div className="os-h2" style={{ marginTop: 0 }}>Export Backup</div>
        <p style={{ fontSize: '13px', color: '#4A5159', marginBottom: '12px' }}>
          Downloads a <code>.json</code> file with all your FieldKit data — stories, trials, stats,
          lane plans, network logs, and roleplay debriefs.
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
          style={btnStyle('#1565C0')}
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
          Request persistent storage to prevent the browser from evicting your data under
          storage pressure. Recommended for daily use.
        </p>
        {storageGranted !== null && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            background: storageGranted ? '#E8F5E9' : '#FFF8E1',
            border: `1.5px solid ${storageGranted ? '#2E7D32' : '#B45309'}`,
            borderRadius: '3px',
            marginBottom: '8px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '10px',
            fontWeight: 700,
            color: storageGranted ? '#2E7D32' : '#B45309',
          }}>
            {storageGranted
              ? <><ShieldCheck size={14} aria-hidden="true" /> PERSISTENT STORAGE ACTIVE</>
              : <><AlertTriangle size={14} aria-hidden="true" /> NOT GRANTED — DATA MAY BE EVICTED</>
            }
          </div>
        )}
        <button style={btnStyle('#4A5159')} onClick={checkStorage}>
          <ShieldCheck size={14} aria-hidden="true" />
          {storageGranted === null ? 'Check / Request Persistent Storage' : 'Re-check Storage Status'}
        </button>
      </div>

      {/* Clear all */}
      <div style={{ ...panelStyle, borderColor: '#FEECEC' }}>
        <div className="os-h2" style={{ marginTop: 0, color: '#A82820' }}>Danger Zone</div>
        <p style={{ fontSize: '13px', color: '#4A5159', marginBottom: '12px' }}>
          Permanently delete all FieldKit data from this device. Export a backup first.
        </p>
        <button style={btnStyle('#A82820')} onClick={handleClearAll} disabled={clearing}>
          <Trash2 size={14} aria-hidden="true" />
          {clearing ? 'Clearing…' : 'Clear All Data'}
        </button>
      </div>
    </div>
  );
}
