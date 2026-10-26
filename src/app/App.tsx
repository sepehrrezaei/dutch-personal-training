import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { configureSpeech, onVoicesChanged } from '@/engine/speech';
import { useStore } from '@/store/store';
import { Layout } from './Layout';
import { TodayPage } from '@/features/today/TodayPage';
import { SessionRunner } from '@/features/session/SessionRunner';
import { PathPage } from '@/features/path/PathPage';
import { LessonPage } from '@/features/path/LessonPage';
import { ReviewPage } from '@/features/review/ReviewPage';
import { GymPage } from '@/features/gym/GymPage';
import { ExamPage } from '@/features/exam/ExamPage';
import { TutorPage } from '@/features/tutor/TutorPage';
import { ProgressPage } from '@/features/progress/ProgressPage';
import { SettingsPage } from '@/features/settings/SettingsPage';
import { PracticeRoute } from './PracticeRoute';

function useTheme() {
  const theme = useStore((s) => s.settings.theme);
  const style = useStore((s) => s.settings.style) ?? 'claude';
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      const dark = theme === 'dark' || (theme === 'system' && mq.matches);
      const root = document.documentElement;
      root.dataset.theme = dark ? 'dark' : 'light';
      root.dataset.style = style;
      try {
        localStorage.setItem('tegel-look', JSON.stringify({ style, theme }));
      } catch {
        /* not critical: only avoids a flash of the default look on start */
      }
      const bg = getComputedStyle(root).getPropertyValue('--glaze').trim().split(/\s+/).join(',');
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', `rgb(${bg})`);
    };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [theme, style]);
}

function useSpeechConfig() {
  const { rate, voiceURI, voiceURI2, ttsEngine, piperVoice, googleTtsKey, googleVoice, googleVoice2 } = useStore((s) => s.settings);
  useEffect(() => {
    const c = { rate, voiceURI, voiceURI2, engine: ttsEngine, piperVoice, googleKey: googleTtsKey, googleVoice, googleVoice2 };
    configureSpeech(c);
    return onVoicesChanged(() => configureSpeech(c));
  }, [rate, voiceURI, voiceURI2, ttsEngine, piperVoice, googleTtsKey, googleVoice, googleVoice2]);
}

export function App() {
  const hydrated = useStore((s) => s.hydrated);
  useTheme();
  useSpeechConfig();
  if (!hydrated) {
    return (
      <div className="grid min-h-dvh place-items-center">
        <div className="h-12 w-12 animate-spin rounded-xl border-4 border-cobalt/20 border-t-cobalt" />
      </div>
    );
  }
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<TodayPage />} />
          <Route path="/session" element={<SessionRunner />} />
          <Route path="/path" element={<PathPage />} />
          <Route path="/lesson/:n" element={<LessonPage />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/gym" element={<GymPage />} />
          <Route path="/exam" element={<ExamPage />} />
          <Route path="/tutor" element={<TutorPage />} />
          <Route path="/practice" element={<PracticeRoute />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<TodayPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
