import { useNavigate, useSearchParams } from 'react-router-dom';
import type { Activity } from '@/store/types';
import { ActivityView } from '@/features/session/ActivityView';
import { celebrate } from '@/design/fx';

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
