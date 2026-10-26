import { motion } from 'framer-motion';
import { lessonOfVocab } from '@/content';
import type { VocabItem } from '@/content/schema';
import { vocabCardId } from '@/engine/srs';
import { Icon } from '@/design/icons';
import { sfx, toast } from '@/design/fx';
import { useStore } from '@/store/store';

/** Star a word to add it to "Mijn kaarten", the flashcard deck for hard words. */
export function MarkButton({ v, lesson, size = 'md', label = false }: { v: VocabItem; lesson?: number; size?: 'sm' | 'md'; label?: boolean }) {
  const n = lesson ?? lessonOfVocab(v);
  const id = n ? vocabCardId(n, v.nl) : '';
  const marked = useStore((s) => !!(id && s.marked[id]));
  const toggle = useStore((s) => s.toggleMark);
  if (!n) return null;
  const dims = size === 'sm' ? 'h-8 min-w-8' : 'h-10 min-w-10';
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.85 }}
      onClick={(e) => {
        e.stopPropagation();
        const added = toggle(id, n);
        sfx.tap();
        if (added) toast({ icon: 'star', title: 'Added to Mijn kaarten', text: `${v.art ? v.art + ' ' : ''}${v.nl} will come back as a flashcard.` });
      }}
      className={`inline-grid shrink-0 grid-flow-col place-items-center gap-1.5 rounded-full px-2 transition ${dims} ${
        marked ? 'bg-oranje/15 text-oranje' : 'text-muted hover:bg-line/50 hover:text-oranje'
      }`}
      aria-pressed={marked}
      aria-label={marked ? 'Remove from my flashcards' : 'Mark as hard: add to my flashcards'}
      title={marked ? 'In Mijn kaarten — tap to remove' : 'Hard word? Add to Mijn kaarten'}
    >
      <Icon name="star" size={size === 'sm' ? 16 : 20} fill={marked ? 'currentColor' : 'none'} />
      {label && <span className="text-xs font-semibold">{marked ? 'Marked' : 'Mark as hard'}</span>}
    </motion.button>
  );
}
