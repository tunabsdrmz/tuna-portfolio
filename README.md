# Tuna Bosdurmaz — Portfolio

Next.js 15 + Tailwind CSS 4 + Motion. Bento-grid portfolio with draggable,
swappable, flingable cards, a first-visit demo, an arrow field that follows the
cursor, light/dark theme and EN/TR.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Where to change things

| What | File |
| --- | --- |
| All text (EN + TR), roles, projects, stack, links | `src/lib/content.ts` |
| Which card sits where on each page | `src/lib/layouts.ts` |
| Colors, glow, fonts | `src/app/globals.css` (`@theme` and `:root[data-theme="light"]`) |
| CV PDF | `public/docs/Tuna-Bosdurmaz-CV.pdf` |

### Project screenshots
Put images in `public/images/work/` and list them in a project's `images`
array, e.g. `images: ["/images/work/preptest-01.webp", ...]`. They show as
the blurred card background and as the scrolling reel in the detail view.
Without images a typographic reel is shown instead.

### Contact form
By default the form opens the visitor's mail app. To send through EmailJS,
create `.env.local`:

```
NEXT_PUBLIC_EMAILJS_SERVICE_ID=...
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=...
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=...
```

## Keyboard
`1–4` switch pages · `← →` next/previous page (or project in detail view) · `Esc` close
