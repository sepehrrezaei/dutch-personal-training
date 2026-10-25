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
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      const dark = theme === 'dark' || (theme === 'system' && mq.matches);
      document.documentElement.dataset.theme = dark ? 'dark' : 'light';
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#0e1324' : '#1d3f8f');
    };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [theme]);
}

function useSpeechConfig() {
  const { rate, voiceURI, voiceURI2 } = useStore((s) => s.settings);
  useEffect(() => {
    configureSpeech({ rate, voiceURI, voiceURI2 });
    return onVoicesChanged(() => configureSpeech({ rate, voiceURI, voiceURI2 }));
  }, [rate, voiceURI, voiceURI2]);
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
