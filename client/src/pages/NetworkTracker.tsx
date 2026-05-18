import { useEffect, useMemo, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useToastActions } from '@/contexts/AppState';
import {
  NETWORK_GEARS,
  getCurrentWeekLogs,
  getNetworkCounts,
  makeNetworkLogId,
  type NetworkGearId,
  type NetworkLog,
} from '@/lib/networkDiscipline';
import { idbGet, idbUpdate } from '@/lib/storage/idb';
import { STORAGE_KEYS } from '@/lib/storage/keys';

export default function NetworkTracker() {
  const { toast } = useToastActions();
  const [logs, setLogs] = useState<NetworkLog[]>([]);
  const [now, setNow] = useState(() => new Date());
  const [gear, setGear] = useState<NetworkGearId>(NETWORK_GEARS[0].id);
  const [contactName, setContactName] = useState('');
  const [community, setCommunity] = useState('');

  useEffect(() => {
    idbGet<NetworkLog[]>(STORAGE_KEYS.networkLogs, [])
      .then(stored => setLogs(stored))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const refreshNow = () => setNow(new Date());
    const intervalId = window.setInterval(refreshNow, 60 * 60 * 1000);

    document.addEventListener('visibilitychange', refreshNow);
    window.addEventListener('focus', refreshNow);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', refreshNow);
      window.removeEventListener('focus', refreshNow);
    };
  }, []);

  const weekLogs = useMemo(() => getCurrentWeekLogs(logs, now), [logs, now]);
  const counts = useMemo(() => getNetworkCounts(weekLogs), [weekLogs]);
  const totalLogged = weekLogs.length;
  const totalTarget = NETWORK_GEARS.reduce((sum, item) => sum + item.target, 0);

  const addLog = () => {
    const trimmedName = contactName.trim();
    const trimmedCommunity = community.trim();

    if (!trimmedName || !trimmedCommunity) {
      toast('Add a named human and community.');
      return;
    }

    const newEntry: NetworkLog = {
      id: makeNetworkLogId(),
      gear,
      contactName: trimmedName,
      community: trimmedCommunity,
      createdAt: new Date().toISOString(),
    };

    idbUpdate<NetworkLog[]>(STORAGE_KEYS.networkLogs, existing => [...(existing ?? []), newEntry]).catch(() => {});
    setLogs(prev => [...prev, newEntry]);
    setContactName('');
    setCommunity('');
    toast('Network contact logged.');
  };

  const removeLog = (id: string) => {
    idbUpdate<NetworkLog[]>(STORAGE_KEYS.networkLogs, existing => (existing ?? []).filter(l => l.id !== id)).catch(() => {});
    setLogs(prev => prev.filter(log => log.id !== id));
    toast('Network contact removed.');
  };

  return (
    <div style={{ padding: '16px', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
      <div className="os-kicker" style={{ marginBottom: '4px' }}>
        Tool 04
      </div>
      <h2 className="os-h1" style={{ marginBottom: '12px' }}>
        Network Discipline
      </h2>

      <div className="os-panel" style={{ marginBottom: '12px' }}>
        <div className="os-h2" style={{ marginTop: 0 }}>
          This Week
        </div>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '12px',
            color: '#4A5159',
            marginBottom: '10px',
          }}
        >
          {totalLogged}/{totalTarget} contacts logged
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px' }}>
          {NETWORK_GEARS.map(item => {
            const count = counts[item.id];
            const complete = count >= item.target;

            return (
              <div
                key={item.id}
                style={{
                  background: '#fff',
                  border: `1.5px solid ${complete ? '#2E7D32' : '#8A6A14'}`,
                  borderRadius: '3px',
                  padding: '10px',
                }}
              >
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '9px',
                    fontWeight: 700,
                    color: complete ? '#2E7D32' : '#8A6A14',
                  }}
                >
                  {item.day} - {count}/{item.target}
                </div>
                <div
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: '16px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}
                >
                  {item.label}
                </div>
                <div style={{ fontSize: '12px', color: '#4A5159', lineHeight: 1.35 }}>{item.prompt}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="os-panel" style={{ marginBottom: '12px' }}>
        <div className="os-h2" style={{ marginTop: 0 }}>
          Log Contact
        </div>

        <label className="os-label" htmlFor="network-gear">
          Gear
        </label>
        <select
          id="network-gear"
          value={gear}
          onChange={event => setGear(event.target.value as NetworkGearId)}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #C8CCD2',
            borderRadius: '3px',
            marginBottom: '10px',
            boxSizing: 'border-box',
          }}
        >
          {NETWORK_GEARS.map(item => (
            <option key={item.id} value={item.id}>
              {item.day} - {item.label}
            </option>
          ))}
        </select>

        <label className="os-label" htmlFor="network-contact">
          Named Human
        </label>
        <input
          id="network-contact"
          value={contactName}
          onChange={event => setContactName(event.target.value)}
          placeholder="Name"
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #C8CCD2',
            borderRadius: '3px',
            marginBottom: '10px',
            boxSizing: 'border-box',
          }}
        />

        <label className="os-label" htmlFor="network-community">
          Community / Room
        </label>
        <input
          id="network-community"
          value={community}
          onChange={event => setCommunity(event.target.value)}
          placeholder="Station, gym, unit, event..."
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #C8CCD2',
            borderRadius: '3px',
            marginBottom: '12px',
            boxSizing: 'border-box',
          }}
        />

        <button className="os-btn os-btn-primary" type="button" onClick={addLog} style={{ width: '100%' }}>
          Log Contact
        </button>
      </div>

      <div className="os-panel">
        <div className="os-h2" style={{ marginTop: 0 }}>
          Recent Logs
        </div>
        {weekLogs.length === 0 ? (
          <div style={{ fontSize: '13px', color: '#4A5159' }}>No contacts logged this week.</div>
        ) : (
          <div style={{ display: 'grid', gap: '8px' }}>
            {weekLogs.map(log => {
              const item = NETWORK_GEARS.find(candidate => candidate.id === log.gear);

              return (
                <div
                  key={log.id}
                  style={{
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'center',
                    background: '#fff',
                    border: '1px solid #C8CCD2',
                    borderRadius: '3px',
                    padding: '8px',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '9px',
                        fontWeight: 700,
                        color: '#A82820',
                      }}
                    >
                      {item?.day} - {item?.label}
                    </div>
                    <div style={{ fontWeight: 700 }}>{log.contactName}</div>
                    <div style={{ fontSize: '12px', color: '#4A5159' }}>{log.community}</div>
                  </div>
                  <button
                    type="button"
                    aria-label={`Remove ${log.contactName}`}
                    onClick={() => removeLog(log.id)}
                    style={{
                      border: '1px solid #C8CCD2',
                      background: '#FBF8F1',
                      borderRadius: '3px',
                      width: '34px',
                      height: '34px',
                      display: 'grid',
                      placeItems: 'center',
                      color: '#A82820',
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                  >
                    <Trash2 aria-hidden="true" size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
