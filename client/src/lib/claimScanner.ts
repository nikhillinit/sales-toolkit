/**
 * Claim Scanner — Unified Signal OS
 * Detects banned marketing terms in rep-written copy.
 * Rule: label-first, evidence-first, no overclaim.
 */

export const BANNED_TERMS = [
  'clinically proven', 'proven', 'industry-leading', 'game-changing',
  'OPSS-approved', 'safe', 'prevents', 'OSHA-compliant', 'guaranteed',
  'crash-free', 'jitter-free', 'proves it works', 'premium', 'biohack',
  'wellness', 'innovative',
];

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export interface BannedMatch {
  term: string;
  start: number;
}

export function findBannedTerms(rawInput: string): BannedMatch[] {
  const input = rawInput.toLowerCase();
  const matches: BannedMatch[] = [];
  const ranges: [number, number][] = [];

  BANNED_TERMS
    .slice()
    .sort((a, b) => b.length - a.length)
    .forEach(term => {
      const re = new RegExp(
        '(^|[^a-z0-9])(' + escapeRegExp(term.toLowerCase()) + ')(?=$|[^a-z0-9])',
        'gi'
      );
      let match: RegExpExecArray | null;
      while ((match = re.exec(input)) !== null) {
        const start = match.index + match[1].length;
        const end = start + match[2].length;
        const overlap = ranges.some(([rs, re]) => start < re && end > rs);
        if (!overlap) {
          matches.push({ term, start });
          ranges.push([start, end]);
          break;
        }
      }
    });

  return matches.sort((a, b) => a.start - b.start);
}

export function highlightBannedTerms(text: string): string {
  const matches = findBannedTerms(text);
  if (matches.length === 0) return text;

  let result = '';
  let lastIndex = 0;
  const lowerText = text.toLowerCase();

  matches.forEach(({ term, start }) => {
    // Find the actual position in original text (case-insensitive)
    const actualStart = lowerText.indexOf(term.toLowerCase(), start > 2 ? start - 2 : 0);
    if (actualStart === -1) return;
    result += escapeHtml(text.slice(lastIndex, actualStart));
    result += `<span class="banned-highlight">${escapeHtml(text.slice(actualStart, actualStart + term.length))}</span>`;
    lastIndex = actualStart + term.length;
  });

  result += escapeHtml(text.slice(lastIndex));
  return result;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
