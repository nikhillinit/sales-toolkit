/**
 * Field Manual — Unified Signal OS
 * Iframe-based view of the v4.2 field manual HTML with:
 * - Left-side TOC that deep-links via postMessage scroll bridge
 * - URL-driven deep-linking: /manual/p19 scrolls to page p19 on load
 * - Searchable page list
 */
import { useEffect, useRef, useState } from 'react';
import { useRoute } from 'wouter';

const MANUAL_PAGES = [
  { id: 'p02', label: 'Overview · 15 Tools' },
  { id: 'p03', label: 'Tool 01 · Sale to Be Made' },
  { id: 'p04', label: 'Tool 02A · Vitamins & Painkillers' },
  { id: 'p05', label: 'Tool 02B · Call Router' },
  { id: 'p06', label: 'Tool 03 · Walk & Talk' },
  { id: 'p07', label: 'Tool 04 · Network Discipline' },
  { id: 'p08', label: 'Tool 05 · Bullseye Targets' },
  { id: 'p09', label: 'Tool 06 · Competitive Map' },
  { id: 'p10', label: 'Tool 07 · Personas' },
  { id: 'p11', label: 'Tool 08 · Prospecting Script' },
  { id: 'p12', label: 'Tool 09 · Written Outreach' },
  { id: 'p13', label: 'Appendix · Rep Rules' },
  { id: 'p14', label: 'Field Entry' },
  { id: 'p15', label: 'Trial Discipline' },
  { id: 'p16', label: 'Tool 10 · Story Vault' },
  { id: 'p17', label: 'Story Library' },
  { id: 'p18', label: 'Tool 11 · Ask & Listen' },
  { id: 'p19', label: 'Tool 12 · Objections Matrix' },
  { id: 'p20', label: 'Tool 13 · Visual Impact' },
  { id: 'p21', label: 'Tool 14 · Progress Report' },
  { id: 'p22', label: 'Tool 15 · Weekly Cadence' },
  { id: 'p23', label: 'Manager Coaching' },
  { id: 'p24', label: 'Visual Frameworks' },
  { id: 'p25', label: 'Clean Activation' },
  { id: 'p26', label: 'Operating Cards' },
  { id: 'p27', label: 'Objection Matrix' },
  { id: 'p28', label: 'Source · Claim · Evidence' },
  { id: 'p29', label: 'Healthcare · Label First' },
  { id: 'p30', label: 'Quick Reference & Close' },
] as const;

export default function FieldManual() {
  const [, params] = useRoute<{ pageId?: string }>('/manual/:pageId');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeReady, setIframeReady] = useState(false);
  const [activePageId, setActivePageId] = useState<string>(params?.pageId ?? 'p02');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (params?.pageId) setActivePageId(params.pageId);
  }, [params?.pageId]);

  useEffect(() => {
    if (!iframeReady || !activePageId) return;
    iframeRef.current?.contentWindow?.postMessage(
      { type: 'scrollToPage', pageId: activePageId },
      window.location.origin
    );
  }, [iframeReady, activePageId]);

  const scrollToPage = (pageId: string) => {
    setActivePageId(pageId);
    iframeRef.current?.contentWindow?.postMessage(
      { type: 'scrollToPage', pageId },
      window.location.origin
    );
  };

  const filteredPages = searchQuery.trim()
    ? MANUAL_PAGES.filter(p =>
        p.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.includes(searchQuery.toLowerCase())
      )
    : MANUAL_PAGES;

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* TOC sidebar */}
      <div
        style={{
          width: '160px',
          flexShrink: 0,
          borderRight: '1px solid #C8CCD2',
          background: '#fff',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '8px', borderBottom: '1px solid #EFEBE0', flexShrink: 0 }}>
          <input
            type="search"
            placeholder="Search…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            aria-label="Search field manual pages"
            style={{
              width: '100%',
              padding: '5px 7px',
              border: '1px solid #C8CCD2',
              borderRadius: '3px',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '10px',
              color: '#1A1D22',
              background: '#F4F1EA',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <div style={{ overflowY: 'auto', flex: 1, WebkitOverflowScrolling: 'touch' }}>
          {filteredPages.map(page => {
            const isActive = activePageId === page.id;
            return (
              <button
                key={page.id}
                onClick={() => scrollToPage(page.id)}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '7px 10px',
                  border: 'none',
                  borderLeft: `3px solid ${isActive ? '#A82820' : 'transparent'}`,
                  background: isActive ? '#FBF8F1' : 'transparent',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '9px',
                  fontWeight: isActive ? 700 : 400,
                  color: isActive ? '#A82820' : '#4A5159',
                  cursor: 'pointer',
                  lineHeight: 1.4,
                  WebkitTapHighlightColor: 'transparent',
                  transition: 'background 0.1s, color 0.1s',
                }}
              >
                {page.label}
              </button>
            );
          })}
          {filteredPages.length === 0 && (
            <div style={{ padding: '12px 10px', fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: '#9AA0A8' }}>
              No matches
            </div>
          )}
        </div>
      </div>

      {/* Iframe content area */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {!iframeReady && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#F4F1EA',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11px',
              color: '#4A5159',
              zIndex: 2,
            }}
          >
            Loading manual…
          </div>
        )}
        <iframe
          ref={iframeRef}
          src="/manual/v4_2.html"
          title="Restless Field Manual v4.2"
          onLoad={() => setIframeReady(true)}
          sandbox="allow-same-origin allow-scripts"
          style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
        />
      </div>
    </div>
  );
}
