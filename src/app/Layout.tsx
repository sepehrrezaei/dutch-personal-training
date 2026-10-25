import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Icon } from '@/design/icons';
import { useToasts } from '@/design/fx';
import { dueCount } from '@/engine/srs';
import { liveStreak } from '@/engine/xp';
import { useStore } from '@/store/store';
import { ErrorBoundary } from './ErrorBoundary';

const NAV = [
  { to: '/', label: 'Vandaag', en: 'Today', icon: 'home' },
  { to: '/path', label: 'Pad', en: 'Course', icon: 'map' },
  { to: '/review', label: 'Herhalen', en: 'Review', icon: 'cards' },
  { to: '/gym', label: 'Oefenen', en: 'Practice', icon: 'dumbbell' },
  { to: '/exam', label: 'Examen', en: 'Exam', icon: 'medal' },
];
const MORE = [
  { to: '/tutor', label: 'Gesprek', en: 'AI tutor', icon: 'chat' },
  { to: '/progress', label: 'Voortgang', en: 'Progress', icon: 'chart' },
  { to: '/settings', label: 'Instellingen', en: 'Settings', icon: 'settings' },
];

/** Paths where time counts as study time. */
const ACTIVE = ['/session', '/lesson', '/review', '/gym', '/exam', '/tutor', '/practice'];

function useStudyTimer() {
  const { pathname } = useLocation();
  const addSeconds = useStore((s) => s.addSeconds);
  const lastInput = useRef(Date.now());
  useEffect(() => {
    const mark = () => (lastInput.current = Date.now());
    window.addEventListener('pointerdown', mark);
    window.addEventListener('keydown', mark);
    return () => {
      window.removeEventListener('pointerdown', mark);
      window.removeEventListener('keydown', mark);
    };
  }, []);
  useEffect(() => {
    if (!ACTIVE.some((p) => pathname.startsWith(p))) return;
    const t = setInterval(() => {
      if (document.visibilityState === 'visible' && Date.now() - lastInput.current < 120_000) addSeconds(10);
    }, 10_000);
    return () => clearInterval(t);
  }, [pathname, addSeconds]);
}

function Wordmark() {
  return (
    <NavLink to="/" className="flex items-center gap-2.5">
      <img src="/icon.svg" alt="" className="h-9 w-9" />
      <span className="font-display text-2xl tracking-tight">Tegel</span>
    </NavLink>
  );
}

function StatusChips() {
  const streak = useStore((s) => s.streak);
  const xp = useStore((s) => s.xp);
  const srs = useStore((s) => s.srs);
  const live = liveStreak(streak, new Date());
  const due = dueCount(srs);
  return (
    <div className="flex items-center gap-2">
      <span className={`chip ${live ? 'border-oranje/40 text-oranje' : ''}`} title="Day streak">
        <Icon name="flame" size={15} /> {live}
      </span>
      <span className="chip" title="Experience points">
        <Icon name="star" size={15} /> {xp}
      </span>
      {due > 0 && (
        <NavLink to="/review" className="chip border-cobalt/40 text-cobalt" title="Words to review">
          <Icon name="cards" size={15} /> {due}
        </NavLink>
      )}
    </div>
  );
}

function Toasts() {
  const toasts = useToasts((s) => s.toasts);
  const dismiss = useToasts((s) => s.dismiss);
  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-[60] flex flex-col items-center gap-2 px-4">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.button
            key={t.id}
            initial={{ y: -30, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -30, opacity: 0 }}
            onClick={() => dismiss(t.id)}
            className="card pointer-events-auto flex max-w-sm items-center gap-3 px-4 py-3 text-left"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-oranje text-white">
              <Icon name={t.icon} />
            </span>
            <span>
              <strong className="block">{t.title}</strong>
              {t.text && <span className="text-sm text-muted">{t.text}</span>}
            </span>
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function Layout() {
  useStudyTimer();
  const { pathname } = useLocation();
  const focus = pathname.startsWith('/session') || pathname.startsWith('/practice');
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-dvh">
      <Toasts />
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-line bg-paper/70 px-4 py-6 backdrop-blur md:flex">
        <div className="mb-8 px-2">
          <Wordmark />
        </div>
        <nav className="flex flex-col gap-1">
          {[...NAV, ...MORE].map((n, i) => (
            <div key={n.to}>
              {i === NAV.length && <div className="my-3 border-t border-line" />}
              <NavLink
                to={n.to}
                end={n.to === '/'}
                className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-3 py-2.5 font-semibold transition ${isActive ? 'bg-cobalt text-white shadow-press' : 'text-ink/80 hover:bg-line/50'}`}
              >
                <Icon name={n.icon} />
                <span>{n.label}</span>
                <span className="ml-auto text-xs font-normal opacity-60">{n.en}</span>
              </NavLink>
            </div>
          ))}
        </nav>
        <div className="mt-auto px-2">
          <StatusChips />
        </div>
      </aside>

      {/* Mobile top bar */}
      {!focus && (
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-glaze/85 px-4 py-2.5 backdrop-blur md:hidden">
          <Wordmark />
          <div className="flex items-center gap-1">
            <StatusChips />
            <NavLink to="/settings" className="rounded-full p-2 text-muted" aria-label="Settings">
              <Icon name="settings" size={20} />
            </NavLink>
          </div>
        </header>
      )}

      <main className={`overflow-x-clip px-4 pb-28 pt-5 md:ml-64 md:px-10 md:pb-12 md:pt-10 ${focus ? 'pt-4' : ''}`}>
        <div className="mx-auto max-w-5xl">
          <ErrorBoundary key={pathname}>
            <Outlet />
          </ErrorBoundary>
        </div>
      </main>

      {/* Mobile bottom nav */}
      {!focus && (
        <nav className="safe-bottom fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-line bg-paper/95 px-1 pt-1.5 backdrop-blur md:hidden">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.to === '/'} className={({ isActive }) => `flex flex-col items-center gap-0.5 rounded-xl py-1 text-[11px] font-semibold ${isActive ? 'text-cobalt' : 'text-muted'}`}>
              {({ isActive }) => (
                <>
                  <span className={`grid h-8 w-12 place-items-center rounded-full transition ${isActive ? 'bg-cobalt-soft' : ''}`}>
                    <Icon name={n.icon} size={21} />
                  </span>
                  {n.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      )}
    </div>
  );
}
