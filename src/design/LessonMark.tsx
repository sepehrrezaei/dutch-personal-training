import { motion } from 'framer-motion';
import { useStore } from '@/store/store';
import { Icon } from './icons';
import { Tile, type TileState } from './Tile';

/**
 * Marker for a lesson: its number, with progress shown by fill.
 * open = not started, current = up next, half = part 1 done, done = finished.
 * The Delft style keeps its ornamental tiles.
 */
export function LessonMark({ n, icon, state, size = 48 }: { n: number; icon: string; state: TileState; size?: number }) {
  const style = useStore((s) => s.settings.style) ?? 'claude';
  if (style === 'delft') return <Tile icon={icon} state={state} size={size} />;

  const radius = Math.round(size * 0.3);
  const ring = 3;
  return (
    <span className="relative inline-grid shrink-0 place-items-center" style={{ width: size, height: size }}>
      {state === 'current' && (
        <motion.span
          className="absolute inset-[-5px] border-2 border-cobalt/50"
          style={{ borderRadius: radius + 5 }}
          animate={{ opacity: [0.9, 0.2, 0.9], scale: [1, 1.08, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
      <span
        className={`absolute inset-0 ${state === 'done' ? 'bg-cobalt' : state === 'current' ? 'border-2 border-cobalt bg-paper' : 'border border-line bg-paper'}`}
        style={{ borderRadius: radius }}
      />
      {state === 'half' && (
        // Half-filled from the bottom: part 1 of the lesson is done.
        <span className="absolute inset-0 overflow-hidden" style={{ borderRadius: radius, boxShadow: `inset 0 0 0 ${ring - 1}px rgb(var(--cobalt))` }}>
          <span className="absolute inset-x-0 bottom-0 h-1/2 bg-cobalt/25" />
        </span>
      )}
      <span
        className={`relative font-display tabular-nums ${state === 'done' ? 'text-onprimary' : state === 'open' || state === 'locked' ? 'text-muted' : 'text-cobalt'}`}
        style={{ fontSize: size * 0.4, lineHeight: 1 }}
      >
        {n}
      </span>
      {state === 'done' && (
        <span className="absolute -bottom-1 -right-1 grid place-items-center rounded-full border-2 border-paper bg-polder text-white" style={{ width: size * 0.38, height: size * 0.38 }}>
          <Icon name="check" size={size * 0.22} strokeWidth={3} />
        </span>
      )}
    </span>
  );
}
