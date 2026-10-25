import { motion } from 'framer-motion';
import { useState, type ReactNode } from 'react';
import { Icon } from '@/design/icons';

/*
 * A simple password screen for the hosted site. It keeps casual visitors and search engines out;
 * it is not real security (the check runs in the browser). The SHA-256 hash of the password is
 * injected at build time via VITE_PASSWORD_HASH; without it the gate is off (local development).
 */

const HASH = (import.meta.env.VITE_PASSWORD_HASH as string | undefined)?.trim().toLowerCase();
const KEY = 'tegel-unlocked';

export async function hashPassword(password: string): Promise<string> {
  const bytes = new TextEncoder().encode(`tegel:${password}`);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function isUnlocked(): boolean {
  try {
    return localStorage.getItem(KEY) === HASH;
  } catch {
    return false;
  }
}

export function PasswordGate({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(() => !HASH || isUnlocked());
  const [value, setValue] = useState('');
  const [wrong, setWrong] = useState(false);
  const [busy, setBusy] = useState(false);

  if (open) return <>{children}</>;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const ok = (await hashPassword(value)) === HASH;
    setBusy(false);
    if (!ok) {
      setWrong(true);
      return;
    }
    try {
      localStorage.setItem(KEY, HASH!);
    } catch {
      /* unlock lasts for this visit only */
    }
    setOpen(true);
  };

  return (
    <div className="grid min-h-dvh place-items-center px-4">
      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="card flex w-full max-w-sm flex-col items-center gap-5 p-8 text-center"
      >
        <img src={`${import.meta.env.BASE_URL}icon.svg`} alt="" className="h-20 w-20" />
        <div>
          <h1 className="text-4xl">Tegel</h1>
          <p className="text-muted">Dutch from zero to A2</p>
        </div>
        <motion.input
          key={wrong ? 'wrong' : 'ok'}
          animate={wrong ? { x: [0, -10, 10, -6, 6, 0] } : undefined}
          type="password"
          className={`input text-center ${wrong ? 'border-tulip' : ''}`}
          placeholder="Wachtwoord"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setWrong(false);
          }}
          autoFocus
          autoComplete="current-password"
          aria-label="Password"
        />
        {wrong && <p className="-mt-2 text-sm text-tulip">Wrong password.</p>}
        <button className="btn-primary w-full" disabled={!value || busy}>
          <Icon name="lock" size={18} /> Open
        </button>
      </motion.form>
    </div>
  );
}
