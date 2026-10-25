import { motion } from 'framer-motion';
import { Icon } from './icons';

export type TileState = 'locked' | 'open' | 'current' | 'half' | 'done';

/** A corner ornament in the style of Delft "ossenkop" tiles; rotated for each corner. */
function Corner({ rotate, sketch }: { rotate: number; sketch: boolean }) {
  return (
    <g transform={`rotate(${rotate} 50 50)`}>
      <path
        d="M4 4 Q4 22 14 22 Q12 14 22 14 Q22 4 4 4Z"
        fill={sketch ? 'none' : 'currentColor'}
        stroke="currentColor"
        strokeWidth={sketch ? 1.2 : 0}
        strokeDasharray={sketch ? '2 2.5' : undefined}
      />
      <path d="M10 10 L17 17" stroke="currentColor" strokeWidth={1.2} strokeDasharray={sketch ? '2 2' : undefined} />
    </g>
  );
}

/**
 * A lesson tile. Locked tiles look pencil-sketched; finished tiles are "fired" into glazed cobalt.
 */
export function Tile({ icon, state, size = 84, label }: { icon: string; state: TileState; size?: number; label?: string }) {
  const sketch = state === 'locked';
  const glazed = state === 'done';
  const half = state === 'half';
  return (
    <motion.div
      className="relative"
      style={{ width: size, height: size }}
      whileHover={state === 'locked' ? undefined : { rotate: -2, scale: 1.04 }}
      whileTap={state === 'locked' ? undefined : { scale: 0.96 }}
    >
      {state === 'current' && (
        <motion.span
          className="absolute inset-[-8px] rounded-[26px] border-2 border-oranje/70"
          animate={{ opacity: [0.9, 0.2, 0.9], scale: [1, 1.06, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
      <svg viewBox="0 0 100 100" width={size} height={size} className={sketch ? 'text-muted/60' : glazed ? 'text-glaze' : 'text-cobalt'} aria-label={label}>
        <defs>
          <linearGradient id="glaze" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="rgb(var(--cobalt))" stopOpacity="0.92" />
            <stop offset="1" stopColor="rgb(var(--cobalt))" />
          </linearGradient>
          <clipPath id="tile-clip">
            <rect x="2" y="2" width="96" height="96" rx="16" />
          </clipPath>
        </defs>
        <rect x="2" y="2" width="96" height="96" rx="16" fill={sketch ? 'rgb(var(--glaze))' : 'rgb(var(--paper))'} stroke="currentColor" strokeWidth={sketch ? 1.5 : 2} strokeDasharray={sketch ? '4 3' : undefined} className={glazed ? 'text-cobalt' : undefined} />
        {(glazed || half) && (
          <g clipPath="url(#tile-clip)">
            <rect x="0" y={half ? 50 : 0} width="100" height={half ? 50 : 100} fill="url(#glaze)" />
            {glazed && <path d="M8 30 Q30 8 60 6" stroke="white" strokeOpacity="0.35" strokeWidth="5" fill="none" strokeLinecap="round" />}
          </g>
        )}
        <g className={half ? 'text-cobalt' : undefined}>
          {[0, 90, 180, 270].map((r) => (
            <Corner key={r} rotate={r} sketch={sketch} />
          ))}
        </g>
        <circle cx="50" cy="50" r="24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray={sketch ? '2 3' : '1 3'} className={half ? 'text-cobalt' : undefined} />
      </svg>
      <div className={`absolute inset-0 grid place-items-center ${sketch ? 'text-muted/70' : glazed ? 'text-white' : 'text-cobalt'}`}>
        {sketch ? <Icon name="lock" size={size * 0.26} /> : <Icon name={icon} size={size * 0.34} strokeWidth={1.7} />}
      </div>
    </motion.div>
  );
}
