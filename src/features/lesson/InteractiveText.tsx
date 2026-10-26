import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { lookupWord } from '@/content';
import { withArticle } from '@/content/dsl';
import type { VocabItem } from '@/content/schema';
import { tokenize } from '@/engine/checker';
import { speak } from '@/engine/speech';
import { MarkButton } from '../flash/MarkButton';

/** Guess dictionary forms for an inflected Dutch word: woont → wonen, kom → komen, dagen → dag. */
export function guessLemma(word: string): VocabItem | undefined {
  const w = word.toLowerCase().replace(/[’]/g, "'");
  const direct = lookupWord(w);
  if (direct) return direct;
  const stems = new Set<string>([w]);
  if (w.endsWith('t') && w.length > 3) stems.add(w.slice(0, -1));
  if (w.endsWith('de') || w.endsWith('te')) stems.add(w.slice(0, -2));
  if (w.endsWith('den') || w.endsWith('ten')) stems.add(w.slice(0, -3));
  const cands: string[] = [];
  for (const s of stems) {
    cands.push(s + 'en', s + 'n', s);
    // Long vowel written double in closed syllable: woon → wonen, maak → maken.
    const m = s.match(/^(.*?)([aeou])\2([^aeiou]+)$/);
    if (m) cands.push(`${m[1]}${m[2]}${m[3]}en`);
    // Short vowel: kom → komen? (single consonant) or zit → zitten (double consonant).
    const sh = s.match(/^(.*[^aeiou])([aeiou])([^aeiou])$/);
    if (sh) cands.push(`${s}${sh[3]}en`);
    if (s.endsWith('f')) cands.push(s.slice(0, -1) + 'ven');
    if (s.endsWith('s')) cands.push(s.slice(0, -1) + 'zen');
  }
  // Plurals back to singular.
  if (w.endsWith('en')) cands.push(w.slice(0, -2), w.slice(0, -3));
  if (w.endsWith('s')) cands.push(w.slice(0, -1));
  for (const c of cands) {
    const hit = lookupWord(c);
    if (hit) return hit;
  }
  return undefined;
}

/** A Dutch sentence where every known word can be tapped for its meaning. */
export function InteractiveText({ text, className = '' }: { text: string; className?: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const tokens = tokenize(text);
  return (
    <span className={className} lang="nl">
      {tokens.map((tok, i) => {
        const isWord = /[\p{L}]/u.test(tok);
        const space = i > 0 && !/^[.,!?;:)]$/.test(tok) && tokens[i - 1] !== '(' ? ' ' : '';
        if (!isWord) return <span key={i}>{space + tok}</span>;
        const v = guessLemma(tok);
        return (
          <span key={i} className="relative">
            {space}
            <span
              role={v ? 'button' : undefined}
              tabIndex={v ? 0 : undefined}
              className={v ? 'word underline' : undefined}
              onClick={(e) => {
                if (!v) return;
                e.stopPropagation();
                setOpen(open === i ? null : i);
                speak(tok);
              }}
              onKeyDown={(e) => e.key === 'Enter' && v && setOpen(open === i ? null : i)}
            >
              {tok}
            </span>
            <AnimatePresence>
              {open === i && v && (
                <motion.span
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute bottom-full left-1/2 z-30 mb-1 w-max max-w-[220px] -translate-x-1/2 rounded-xl bg-ink px-3 py-2 text-left font-sans text-sm leading-snug text-glaze shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen(null);
                  }}
                >
                  <span className="flex items-center gap-2">
                    <span>
                      <strong className="block">{withArticle(v)}</strong>
                      {v.en}
                      {v.pl && <span className="block text-xs opacity-70">plural: {v.pl}</span>}
                    </span>
                    <MarkButton v={v} size="sm" />
                  </span>
                </motion.span>
              )}
            </AnimatePresence>
          </span>
        );
      })}
    </span>
  );
}
