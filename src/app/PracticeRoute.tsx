import { useNavigate, useSearchParams } from 'react-router-dom';
import type { Activity } from '@/store/types';
import { ActivityView } from '@/features/session/ActivityView';
import { celebrate } from '@/design/fx';
import { Icon } from '@/design/icons';

/** Activities without their own close button get a back link. */
const NEEDS_BACK: Activity['kind'][] = ['writing', 'mock', 'tutor'];

/**
 * Runs a single activity outside of the daily session, described in the query string:
 * /practice?a=<json Activity>&back=/exam
 */
export function PracticeRoute() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const back = params.get('back') ?? '/';
  let activity: Activity | null = null;
  try {
    activity = JSON.parse(params.get('a') ?? 'null');
  } catch {
    activity = null;
  }
  if (!activity) return null;
  return (
    <div className="mx-auto max-w-2xl">
      {NEEDS_BACK.includes(activity.kind) && (
        <button className="mb-4 flex items-center gap-1 text-sm font-semibold text-muted hover:text-cobalt" onClick={() => navigate(back)}>
          <Icon name="arrowLeft" size={16} /> Back
        </button>
      )}
      <ActivityView
        key={params.get('a')}
        activity={activity}
        onExit={() => navigate(back)}
        onDone={(r) => {
          if (r && r.total && r.correct / r.total >= 0.9) celebrate();
          navigate(back);
        }}
      />
    </div>
  );
}

export function practiceHref(a: Activity, back: string): string {
  return `/practice?a=${encodeURIComponent(JSON.stringify(a))}&back=${encodeURIComponent(back)}`;
}
