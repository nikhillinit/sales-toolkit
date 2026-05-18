/**
 * StoryCardBuilder — Tool 10A
 * Interactive 5-C story authoring + searchable vault, with copy-ready
 * 15s and 45s pitch scripts. Pairs with Tool10StoryVault (framework reference).
 *
 * Design: matches NetworkTracker/ClaimScanner inline-style convention.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Copy, Edit2, Search, Trash2 } from 'lucide-react';
import { useToastActions } from '@/contexts/AppState';
import { useStoryVaultContext } from '@/contexts/StoryVaultContext';
import { generateScripts, type StoryCard } from '@/lib/storyVault';

type FormState = {
  title: string;
  character: string;
  context: string;
  conflict: string;
  climax: string;
  closure: string;
};

const BLANK_FORM: FormState = {
  title: '',
  character: '',
  context: '',
  conflict: '',
  climax: '',
  closure: '',
};

type FieldKey = keyof Omit<FormState, 'title'>;

const C_FIELDS: { id: FieldKey; label: string; desc: string; placeholder: string }[] = [
  { id: 'character', label: '1. Character', desc: 'Who is the human? Use role and world, not private details.', placeholder: 'e.g. Sgt. Ramirez, MWR coordinator at Fort Hood' },
  { id: 'context',   label: '2. Context',   desc: 'What was happening? Name the real use window.',              placeholder: 'e.g. crew hitting a wall on overnight shifts at 3am' },
  { id: 'conflict',  label: '3. Conflict',  desc: 'What made this difficult? Name the risk.',                   placeholder: 'e.g. the crew would mock anything labeled "wellness"' },
  { id: 'climax',    label: '4. Climax',    desc: 'What decision or moment changed?',                            placeholder: 'e.g. we reframed it as a passive station-table test, no pitch' },
  { id: 'closure',   label: '5. Closure',   desc: 'Why does this story matter? End with the principle.',         placeholder: 'e.g. crew choice beats top-down mandates every time' },
];

function safeCopy(text: string, toast: (msg: string) => void) {
  try {
    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      toast('Copy failed — long-press to copy manually');
      return;
    }
    navigator.clipboard.writeText(text)
      .then(() => toast('Copied to clipboard'))
      .catch(() => toast('Copy failed — long-press to copy manually'));
  } catch {
    toast('Copy failed — long-press to copy manually');
  }
}

function formatDate(ts: number): string {
  try {
    return new Date(ts).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
}

export default function StoryCardBuilder() {
  const { vault, addStory, updateStory, deleteStory } = useStoryVaultContext();
  const { toast } = useToastActions();

  const [activeTab, setActiveTab] = useState<'build' | 'vault'>('build');
  const [editingStory, setEditingStory] = useState<StoryCard | null>(null);
  const [form, setForm] = useState<FormState>(BLANK_FORM);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (editingStory) {
      setForm({
        title: editingStory.title,
        character: editingStory.character,
        context: editingStory.context,
        conflict: editingStory.conflict,
        climax: editingStory.climax,
        closure: editingStory.closure,
      });
    } else {
      setForm(BLANK_FORM);
    }
  }, [editingStory]);

  const scripts = useMemo(() => generateScripts(form), [form]);

  const hasAnyContent = Object.values(form).some(v => v.trim().length > 0);
  const canSave = form.title.trim().length > 0 && form.character.trim().length > 0;

  const handleClear = useCallback(() => {
    setEditingStory(null);
    setForm(BLANK_FORM);
  }, []);

  const handleSave = useCallback(() => {
    if (!canSave) {
      toast('Title and Character are required.');
      return;
    }
    if (editingStory) {
      updateStory(editingStory.id, { ...form, timestamp: Date.now() });
      toast('Story updated.');
    } else {
      addStory(form);
      toast('Story saved to vault.');
    }
    setEditingStory(null);
    setForm(BLANK_FORM);
    setActiveTab('vault');
  }, [addStory, canSave, editingStory, form, toast, updateStory]);

  const handleEdit = useCallback((story: StoryCard) => {
    setEditingStory(story);
    setActiveTab('build');
  }, []);

  const handleDelete = useCallback((id: string) => {
    if (typeof window === 'undefined' || !window.confirm('Delete this story permanently?')) return;
    deleteStory(id);
    if (editingStory?.id === id) setEditingStory(null);
    toast('Story deleted.');
  }, [deleteStory, editingStory, toast]);

  const filteredVault = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return vault;
    return vault.filter(s =>
      s.title.toLowerCase().includes(q) ||
      s.character.toLowerCase().includes(q) ||
      s.context.toLowerCase().includes(q)
    );
  }, [vault, search]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      {/* Header */}
      <div style={{ background: '#1A1D22', padding: '12px 16px', flexShrink: 0, borderBottom: '2px solid #A82820' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: '9px', color: '#A82820', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '2px' }}>
          Tool 10A · Story Capture
        </div>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '22px', color: '#fff', letterSpacing: '0.01em', lineHeight: 1.1 }}>
          Story Card <span style={{ color: '#A82820' }}>Builder</span>
        </div>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '3px' }}>
          Turn field interactions into 15s and 45s pitch assets.
        </div>
      </div>

      {/* Sub-tabs */}
      <div style={{ display: 'flex', background: '#fff', borderBottom: '1px solid #C8CCD2', flexShrink: 0 }}>
        {([
          { id: 'build' as const, label: editingStory ? 'Edit Story' : 'Build Story' },
          { id: 'vault' as const, label: `My Vault${vault.length ? ` · ${vault.length}` : ''}` },
        ]).map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              flex: 1, padding: '9px 4px', border: 'none',
              borderBottom: `2px solid ${activeTab === t.id ? '#A82820' : 'transparent'}`,
              background: activeTab === t.id ? '#FBF8F1' : 'transparent',
              fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.04em',
              color: activeTab === t.id ? '#A82820' : '#4A5159',
              cursor: 'pointer', transition: 'all 0.15s',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
        {activeTab === 'build' && (
          <div style={{ padding: '14px 16px', maxWidth: '600px', margin: '0 auto' }}>
            {editingStory && (
              <div style={{ background: '#FBF8F1', border: '1px solid #B45309', borderRadius: '3px', padding: '8px 10px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700, color: '#B45309', letterSpacing: '0.06em' }}>
                  EDITING · {editingStory.title}
                </span>
                <button
                  onClick={handleClear}
                  aria-label="Cancel edit"
                  style={{ background: 'transparent', border: 'none', color: '#4A5159', cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700 }}
                >
                  ✕ CANCEL
                </button>
              </div>
            )}

            {/* Form */}
            <div style={{ background: '#fff', border: '1px solid #C8CCD2', borderRadius: '4px', padding: '14px', marginBottom: '14px' }}>
              <div className="os-h2" style={{ marginTop: 0 }}>The 5-C Framework</div>

              <div style={{ marginBottom: '12px' }}>
                <label className="os-label" htmlFor="story-title">Story Title</label>
                <input
                  id="story-title"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. The Station-Table Pivot"
                  aria-label="Story Title"
                  style={{
                    width: '100%', padding: '10px', border: '1px solid #C8CCD2',
                    background: '#FBF8F1', fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: '14px', borderRadius: '3px', color: '#1A1D22',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {C_FIELDS.map(field => (
                <div key={field.id} style={{ marginBottom: '12px' }}>
                  <label className="os-label" htmlFor={`story-${field.id}`}>{field.label}</label>
                  <div style={{ fontSize: '12px', color: '#4A5159', marginBottom: '6px', lineHeight: 1.4 }}>
                    {field.desc}
                  </div>
                  <textarea
                    id={`story-${field.id}`}
                    value={form[field.id]}
                    onChange={e => setForm(f => ({ ...f, [field.id]: e.target.value }))}
                    placeholder={field.placeholder}
                    rows={2}
                    aria-label={field.label}
                    style={{
                      width: '100%', padding: '10px', border: '1px solid #C8CCD2',
                      background: '#FBF8F1', fontFamily: "'Source Sans 3', sans-serif",
                      fontSize: '14px', borderRadius: '3px', resize: 'vertical',
                      color: '#1A1D22', boxSizing: 'border-box', lineHeight: 1.5,
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Live Preview */}
            <div style={{ background: '#1A1D22', borderRadius: '4px', padding: '14px', marginBottom: '14px' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: '10px', color: '#A82820', letterSpacing: '0.08em', marginBottom: '12px' }}>
                LIVE SCRIPT PREVIEW
              </div>

              <div style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '13px', color: '#fff', letterSpacing: '0.04em' }}>
                    15-SECOND HOOK
                  </div>
                  <button
                    onClick={() => safeCopy(scripts.fifteen, toast)}
                    aria-label="Copy 15-second script"
                    style={{ background: 'transparent', border: '1px solid rgba(138,106,20,0.6)', color: '#E0B96A', cursor: 'pointer', padding: '4px 8px', borderRadius: '2px', fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Copy size={11} /> COPY
                  </button>
                </div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)', fontStyle: 'italic', background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '3px', borderLeft: '3px solid #8A6A14', lineHeight: 1.5 }}>
                  &ldquo;{scripts.fifteen}&rdquo;
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '13px', color: '#fff', letterSpacing: '0.04em' }}>
                    45-SECOND FULL ARC
                  </div>
                  <button
                    onClick={() => safeCopy(scripts.fortyFive, toast)}
                    aria-label="Copy 45-second script"
                    style={{ background: 'transparent', border: '1px solid rgba(46,125,50,0.6)', color: '#7FBF82', cursor: 'pointer', padding: '4px 8px', borderRadius: '2px', fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Copy size={11} /> COPY
                  </button>
                </div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)', fontStyle: 'italic', background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '3px', borderLeft: '3px solid #2E7D32', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                  &ldquo;{scripts.fortyFive}&rdquo;
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleClear}
                disabled={!hasAnyContent && !editingStory}
                style={{
                  flex: 1, padding: '12px', borderRadius: '3px',
                  border: '1px solid #C8CCD2',
                  background: 'transparent',
                  color: (!hasAnyContent && !editingStory) ? '#C8CCD2' : '#4A5159',
                  fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.04em',
                  cursor: (!hasAnyContent && !editingStory) ? 'not-allowed' : 'pointer',
                }}
              >
                Clear
              </button>
              <button
                onClick={handleSave}
                disabled={!canSave}
                style={{
                  flex: 2, padding: '12px', borderRadius: '3px', border: 'none',
                  background: canSave ? '#A82820' : '#C8CCD2',
                  color: '#fff',
                  fontFamily: "'Barlow Condensed', sans-serif", fontSize: '15px', fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.04em',
                  cursor: canSave ? 'pointer' : 'not-allowed',
                  transition: 'background 0.2s',
                }}
              >
                💾 {editingStory ? 'Update Story' : 'Save to Vault'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'vault' && (
          <div style={{ padding: '14px 16px', maxWidth: '600px', margin: '0 auto' }}>
            {vault.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>🗄️</div>
                <div className="os-h2" style={{ marginTop: 0 }}>Vault is Empty</div>
                <p style={{ fontSize: '13px', color: '#4A5159', maxWidth: '320px', margin: '6px auto 0', lineHeight: 1.5 }}>
                  Build your first story card to save it here. Saved cards are available in Roleplay and Lane Plan too.
                </p>
                <button
                  onClick={() => setActiveTab('build')}
                  style={{ marginTop: '14px', padding: '10px 18px', background: '#A82820', color: '#fff', border: 'none', borderRadius: '3px', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', cursor: 'pointer' }}
                >
                  ▶ Start a Story
                </button>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', border: '1px solid #C8CCD2', borderRadius: '3px', padding: '8px 10px', marginBottom: '12px' }}>
                  <Search size={14} style={{ color: '#4A5159' }} />
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search title, character, or context…"
                    aria-label="Search stories"
                    style={{ flex: 1, border: 'none', outline: 'none', fontFamily: "'Source Sans 3', sans-serif", fontSize: '13px', background: 'transparent', color: '#1A1D22' }}
                  />
                  {search && (
                    <button
                      onClick={() => setSearch('')}
                      aria-label="Clear search"
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#4A5159', fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700 }}
                    >
                      ✕
                    </button>
                  )}
                </div>

                {filteredVault.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '20px', fontSize: '13px', color: '#4A5159', fontStyle: 'italic' }}>
                    No stories match &ldquo;{search}&rdquo;.
                  </div>
                )}

                {filteredVault.map(story => {
                  const s = generateScripts(story);
                  return (
                    <div key={story.id} style={{ background: '#fff', border: '1px solid #C8CCD2', borderRadius: '4px', padding: '12px', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', gap: '8px' }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '15px', color: '#1A1D22', lineHeight: 1.2 }}>
                            {story.title}
                          </div>
                          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', color: '#4A5159', marginTop: '2px', letterSpacing: '0.04em' }}>
                            {formatDate(story.timestamp)} · {story.character}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                          <button
                            onClick={() => handleEdit(story)}
                            aria-label={`Edit ${story.title}`}
                            style={{ background: 'transparent', border: '1px solid #C8CCD2', borderRadius: '2px', color: '#4A5159', cursor: 'pointer', padding: '5px 7px', display: 'flex', alignItems: 'center' }}
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            onClick={() => handleDelete(story.id)}
                            aria-label={`Delete ${story.title}`}
                            style={{ background: 'transparent', border: '1px solid #C8CCD2', borderRadius: '2px', color: '#A82820', cursor: 'pointer', padding: '5px 7px', display: 'flex', alignItems: 'center' }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>

                      <div style={{ fontSize: '12px', color: '#4A5159', fontStyle: 'italic', background: '#FBF8F1', padding: '8px 10px', borderLeft: '3px solid #8A6A14', marginBottom: '10px', lineHeight: 1.5 }}>
                        <strong style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 700, color: '#8A6A14', letterSpacing: '0.06em', display: 'block', marginBottom: '3px' }}>15S HOOK</strong>
                        &ldquo;{s.fifteen}&rdquo;
                      </div>

                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          onClick={() => safeCopy(s.fifteen, toast)}
                          style={{ flex: 1, padding: '8px', background: 'transparent', border: '1px solid #8A6A14', color: '#8A6A14', borderRadius: '2px', fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700, letterSpacing: '0.04em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                        >
                          <Copy size={11} /> COPY 15S
                        </button>
                        <button
                          onClick={() => safeCopy(s.fortyFive, toast)}
                          style={{ flex: 1, padding: '8px', background: 'transparent', border: '1px solid #2E7D32', color: '#2E7D32', borderRadius: '2px', fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', fontWeight: 700, letterSpacing: '0.04em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                        >
                          <Copy size={11} /> COPY 45S
                        </button>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
