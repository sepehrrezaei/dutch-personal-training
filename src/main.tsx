import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import { PasswordGate } from './app/PasswordGate';
import { useStore } from './store/store';
import './index.css';

// Handy for debugging progress in the browser console during development.
if (import.meta.env.DEV) (window as unknown as { tegel: typeof useStore }).tegel = useStore;

createRoot(document.getElementById('root')!).render(
  <PasswordGate>
    <App />
  </PasswordGate>,
);
