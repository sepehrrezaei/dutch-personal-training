import { getLesson } from '@/content';
import type { Activity } from '@/store/types';
import { LessonPlayer } from '../lesson/LessonPlayer';
import { ReviewDeck } from '../review/ReviewDeck';
import type { RunResult } from '../practice/Run';
import { Drill } from '../gym/Drill';
import { LessonQuiz } from '../exam/LessonQuiz';
import { ReadingPractice } from '../exam/ReadingPractice';
import { ListeningPractice } from '../exam/ListeningPractice';
import { KnmQuiz } from '../exam/KnmQuiz';
import { WritingPractice } from '../exam/WritingPractice';
import { SpeakingPractice } from '../exam/SpeakingPractice';
import { Checkpoint } from '../exam/Checkpoint';
import { MockExam } from '../exam/MockExam';
import { TutorChat } from '../tutor/TutorChat';

/** Render one activity of a session; `onDone` is called with its score when finished. */
export function ActivityView({ activity: a, onDone, onExit }: { activity: Activity; onDone: (r?: RunResult) => void; onExit: () => void }) {
  switch (a.kind) {
    case 'srs':
      return <ReviewDeck limit={a.limit} onDone={onDone} onExit={onExit} />;
    case 'lesson': {
      const l = getLesson(a.lesson);
      if (!l) return <Missing onDone={onDone} what={`Lesson ${a.lesson}`} />;
      return <LessonPlayer lesson={l} steps={a.steps} onDone={() => onDone()} onExit={onExit} />;
    }
    case 'drill':
      return <Drill id={a.drill} onDone={onDone} onExit={onExit} />;
    case 'quiz':
      return <LessonQuiz lessons={a.lessons} onDone={onDone} onExit={onExit} />;
    case 'reading':
      return <ReadingPractice unit={a.unit} count={a.count} onDone={onDone} />;
    case 'listening':
      return <ListeningPractice unit={a.unit} count={a.count} onDone={onDone} />;
    case 'knm':
      return <KnmQuiz theme={a.theme} onDone={onDone} onExit={onExit} />;
    case 'writing':
      return <WritingPractice unit={a.unit} count={a.count} onDone={onDone} />;
    case 'speaking':
      return <SpeakingPractice unit={a.unit} count={a.count} onDone={onDone} />;
    case 'tutor':
      return <TutorChat scenario={a.scenario} onDone={() => onDone()} />;
    case 'checkpoint':
      return <Checkpoint unit={a.unit} onDone={onDone} onExit={onExit} />;
    case 'mock':
      return <MockExam n={a.mock} part={a.part} onDone={onDone} />;
  }
}

function Missing({ what, onDone }: { what: string; onDone: () => void }) {
  return (
    <div className="card p-8 text-center">
      <p className="mb-4">{what} is not available yet.</p>
      <button className="btn-primary" onClick={() => onDone()}>
        Skip
      </button>
    </div>
  );
}
