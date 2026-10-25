import { Link } from 'react-router-dom';
import { TUTOR_SCENARIOS } from '@/content/tutor';
import { Icon } from '@/design/icons';
import { PageHeader } from '@/design/ui';
import { useStore } from '@/store/store';
import { practiceHref } from '@/app/PracticeRoute';

export function TutorPage() {
  const hasKey = !!useStore((s) => s.settings.apiKey);
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Gesprek · AI tutor" title="Praat Nederlands">
        Role-play real situations with an AI partner who speaks simple Dutch, corrects your sentences and gives feedback at the end.
      </PageHeader>
      {!hasKey && (
        <div className="card flex flex-col gap-3 border-oranje/40 p-5 sm:flex-row sm:items-center">
          <Icon name="sparkles" className="text-oranje" size={28} />
          <p className="flex-1 text-sm">
            The AI tutor uses your own Anthropic API key (it stays on this device). Without a key you can still open each scenario and practise its phrases.
          </p>
          <Link to="/settings" className="btn-primary py-2 text-sm">
            Add key
          </Link>
        </div>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        {TUTOR_SCENARIOS.map((s) => (
          <Link key={s.id} to={practiceHref({ kind: 'tutor', scenario: s.id, minutes: 12 }, '/tutor')} className="card flex gap-4 p-5 transition hover:-translate-y-0.5 hover:border-cobalt/50">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-oranje/15 text-oranje">
              <Icon name="chat" />
            </span>
            <span>
              <span className="text-xs font-bold text-muted">Unit {s.unit}</span>
              <span className="block font-display text-xl">{s.title}</span>
              <span className="block text-sm text-muted">{s.titleEn}</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
