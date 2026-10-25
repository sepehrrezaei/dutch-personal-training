# Tegel — Dutch from zero to A2

A web app (installable PWA) for learning Dutch from beginner level up to the **Inburgeringsexamen A2**:
short weekday sessions (≤ 30 min) and longer exam-skills sessions at the weekend (60–120 min).

The course follows the syllabus of the *Delftse Methode — Nederlands voor anderstaligen* (42 lessons, 6 units):
the same lesson themes, vocabulary scope and grammar order. All texts, dialogues and exercises in the app are
written fresh for those themes, so it works alongside the book.

## What's inside

- **Today** — a daily plan built for you: SRS warm-up, the next lesson part, a drill. Fridays are review days;
  Saturdays practise Lezen, Luisteren and KNM; Sundays practise Schrijven and Spreken. Missed days never break the
  plan — catch-up moves to the weekend.
- **42 lessons** in the Delft 4-step method: words → read & listen → listen without pauses → repeat without text
  (speech recognition) → dictation → gap-fill → grammar → questions and speaking.
- **Spaced repetition** (FSRS) for every word you learn, with recognition, typing and listening cards.
- **Practice gym** — numbers, prices, the clock, verb forms, plurals, de/het, perfect tense, plus all 43 grammar topics.
- **Exam centre** — exam-format items for Lezen, Luisteren, Schrijven, Spreken, all 8 KNM themes, and 3 timed mock exams.
- **AI tutor (optional)** — role-play conversations and feedback on writing and speaking with your own Anthropic API key
  (Settings → AI tutor). The key stays in your browser.
- Streaks with a weekly freeze, XP and levels, CEFR estimate, badges, progress radar and study calendar.
- Works offline once loaded; progress is stored on the device (export/import JSON to move between devices).

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:5173. Speech uses your system's Dutch voices: on macOS/iOS add one under
*System Settings → Accessibility → Spoken Content → Manage voices → Dutch*. Speech recognition works in Chrome, Edge and Safari.

## Use it on your phone

A PWA must be served over HTTPS to install on a phone. Build and deploy the static `dist/` folder to any static host
(Netlify, Vercel, Cloudflare Pages — SPA rewrites are included in `public/_redirects` and `vercel.json`):

```bash
npm run build
```

Then open the site on your phone and choose *Add to Home Screen*. Use *Settings → Your data* to export progress from one
device and import it on another.

## Develop

```bash
npm test          # engines + content validation (every lesson, grammar topic, KNM theme and exam item)
npm run build     # typecheck + production build with service worker
```

- `src/content/` — lessons (`lessons/unitN.ts`), grammar (`grammar/gN.ts`), KNM, exam item banks, tutor scenarios
- `src/engine/` — scheduler, FSRS wrapper, answer checker, speech, XP/streaks, AI client (lazy-loaded)
- `src/features/` — screens: today, path, lesson player, review, gym, exam, tutor, progress, settings
- `tools/ocr-book.swift` — OCRs the scanned book into `tools/out/` for reference (git-ignored, never bundled)
