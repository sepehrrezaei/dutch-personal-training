import { useMemo, useState } from 'react';
import { vocabByCardId } from '@/content';
import { withArticle } from '@/content/dsl';
import { dueCards, isLeech } from '@/engine/srs';
import { Icon } from '@/design/icons';
import { SpeakButton } from '@/design/ui';
import { useStore } from '@/store/store';
import { ArticleChip } from '../lesson/steps/WordsStep';

/** Overview of "Mijn kaarten": start a round, see and manage marked words, add suggested hard words. */
export function FlashDeck({ onStart }: { onStart: () => void }) {
  const marked = useStore((s) => s.marked);
  const flash = useStore((s) => s.flash);
  const srs = useStore((s) => s.srs);
  const toggle = useStore((s) => s.toggleMark);
  const [query, setQuery] = useState('');
  const [showAll, setShowAll] = useState(false);

  // Count words, not cards: a round shows one direction of each word.
  const due = new Set(dueCards(flash).map((c) => c.id.split('|')[0])).size;
  const words = useMemo(
    () =>
      Object.entries(marked)
        .map(([id, m]) => ({ id, m, hit: vocabByCardId(id) }))
        .filter((x) => x.hit)
        .sort((a, b) => b.m.addedAt - a.m.addedAt),
    [marked],
  );
  // Words the normal review keeps getting wrong are good flashcard candidates.
  const suggestions = useMemo(
    () =>
      Object.values(srs)
        .filter((c) => !marked[c.id] && (isLeech(c) || c.lapses >= 2))
        .map((c) => ({ c, hit: vocabByCardId(c.id) }))
        .filter((x) => x.hit)
        .slice(0, 8),
    [srs, marked],
  );
  const q = query.trim().toLowerCase();
  const filtered = words.filter(({ hit }) => !q || hit!.item.nl.toLowerCase().includes(q) || hit!.item.en.toLowerCase().includes(q));
  const visible = showAll || q ? filtered : filtered.slice(0, 8);

  return (
    <section className="card mt-5 overflow-hidden">
      <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-oranje/15 text-oranje">
          <Icon name="star" size={28} fill="currentColor" />
        </span>
        <div className="flex-1">
          <h2 className="text-2xl">Mijn kaarten</h2>
          <p className="text-sm text-muted">
            Flashcards for words you marked as hard — both directions, with their lesson sentence and your own memory hook. They come back more often than
            normal reviews.
          </p>
        </div>
        <button className={due ? 'btn-orange shrink-0' : 'btn-ghost shrink-0'} disabled={!due} onClick={onStart}>
          <Icon name="play" size={18} /> {due ? `Practise ${due}` : 'Nothing due'}
        </button>
      </div>

      {suggestions.length > 0 && (
        <div className="border-t border-line px-6 py-4">
          <p className="mb-2 text-sm font-semibold">Words you often forget — add them?</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map(({ c, hit }) => (
              <button key={c.id} className="chip hover:border-oranje hover:text-oranje" onClick={() => toggle(c.id, hit!.lesson.n)}>
                <Icon name="star" size={13} /> {withArticle(hit!.item)}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-line px-6 py-4">
        {words.length === 0 ? (
          <p className="text-sm text-muted">
            No marked words yet. Tap the <Icon name="star" size={14} className="inline" /> star on a word card, in a review, in a lesson’s word list or on any
            word you tap in a text.
          </p>
        ) : (
          <>
            <div className="mb-3 flex items-center gap-3">
              <p className="text-sm font-semibold">{words.length} marked words</p>
              <input className="input ml-auto max-w-[200px] py-1.5 text-sm" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search…" />
            </div>
            <ul className="divide-y divide-line">
              {visible.map(({ id, m, hit }) => {
                const v = hit!.item;
                const cards = [flash[`${id}|nl`], flash[`${id}|en`]].filter(Boolean);
                const nextDue = Math.min(...cards.map((c) => c.due));
                const days = Math.max(0, Math.round((nextDue - Date.now()) / 864e5));
                return (
                  <li key={id} className="flex items-center gap-3 py-2">
                    <SpeakButton text={withArticle(v)} size="sm" />
                    <ArticleChip art={v.art} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold" lang="nl">
                        {v.nl} <span className="font-normal text-muted">— {v.en}</span>
                      </p>
                      {m.note && <p className="truncate text-xs text-oranje">{m.note}</p>}
                    </div>
                    <span className="hidden text-xs text-muted sm:inline">{nextDue <= Date.now() ? 'due now' : `in ${days || '<1'}d`}</span>
                    <button className="rounded-full p-1.5 text-muted hover:bg-line/60 hover:text-tulip" onClick={() => toggle(id, m.lesson)} aria-label={`Remove ${v.nl}`}>
                      <Icon name="x" size={16} />
                    </button>
                  </li>
                );
              })}
            </ul>
            {!q && filtered.length > 8 && (
              <button className="mt-2 text-sm font-semibold text-cobalt" onClick={() => setShowAll(!showAll)}>
                {showAll ? 'Show fewer' : `Show all ${filtered.length}`}
              </button>
            )}
          </>
        )}
      </div>
    </section>
  );
}
