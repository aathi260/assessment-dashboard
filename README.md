# Assessment Dashboard

Front-end implementation of **Dashboard Mockup v3** (5 slides): assessment overview, findings dialog and
sample detail. React 19 · TypeScript · Vite · Tailwind CSS v4 · Zod.

## Getting started

```bash
npm install
npm run dev            # http://localhost:5173
npm run build          # type-check + production build
npm run typecheck
npm run lint
npm run format         # Prettier
npm run validate:data  # schema + cross-record validation of the mock data
```

Requires Node ≥ 20.19.

### Routes (hash based, no router dependency)

| URL                                | Screen                                         |
| ---------------------------------- | ---------------------------------------------- |
| `#/assessments/asm-001`            | Overview, overall score **18 / 100** (slide 1) |
| `#/assessments/asm-002`            | Overview, overall score **N/A** (slide 2)      |
| `#/assessments/asm-001/samples/s1` | Sample detail (slides 4–5); also `s2`, `s3`    |

The findings dialog (slide 3) opens from "Summary & Key Findings". A small **Demo data** switcher (bottom right)
flips between the scored and N/A assessments.

## Deck analysis

| Slide | What it is                            | Treated as                                            |
| ----- | ------------------------------------- | ----------------------------------------------------- |
| 1     | Overview with score `18 / 100`        | `OverviewPage`, `overallScore.status = "scored"`      |
| 2     | Same layout, score `N/A`              | Same page, `status = "not_applicable"` (a state)      |
| 3     | Overview + modal                      | `FindingsDialog` (native `<dialog>`)                  |
| 4     | Sample detail at a smaller text scale | **Duplicate** of slide 5, used for the bottom section |
| 5     | Sample detail                         | `SamplePage`                                          |

Interactions not drawn in the deck but implemented: category selection filters the assessed inputs,
"View all inputs" expands the 4-of-6 list, input selection drives the comparison panel, test-sample rows open details.

## Design tokens

All colours, type sizes, radii, shadows and layout metrics live in `src/index.css` under `@theme`.
Components use token utilities (`bg-brand`, `text-slate`, `shadow-card`, `h-chart`) — no raw hex values in TSX.
Values were extracted from the slide XML and rendered pixels; the deck is 1005 pt ≙ 1340 px, so type sizes are pt × 1.333.

| Token                     | Value                                                   | Role                                |
| ------------------------- | ------------------------------------------------------- | ----------------------------------- |
| `coral`                   | `#FF6268`                                               | Negative deltas, links, accents     |
| `brand`                   | `#E53F3F`                                               | Primary button                      |
| `score-from` → `score-to` | `#A81818 → #C52323`                                     | Overall score gradient              |
| `ink` / `ink-strong`      | `#17171C` / `#000`                                      | Text                                |
| `slate`                   | `#6B788C`                                               | Secondary text, axis, table headers |
| `bar-1…4`                 | `#730D0D #9E1414 #C72424 #E53F3F`                       | Chart bars (by rank)                |
| `canvas`                  | `#FCFCFC`                                               | Page background                     |
| `positive`                | `#0F9A2D`                                               | Confidence improved                 |
| priority high/medium/low  | `#F8AEAE/#DA0707`, `#FFEBA1/#D19200`, `#BBF4B3/#1D6F17` | Pills                               |

### Fonts

Self-hosted (SIL OFL) in `src/assets/fonts`, downloaded from the official repositories
(`github/mona-sans`, `rsms/inter`). The deck's "Mona Sans Medium/SemiBold/…" families are weights of one family here.
**Mona Sans** (300–800): titles, KPI values, labels, table content. **Inter** (400–700): findings text, axis ticks, table-header
`#`, "View all findings" link.

### UI kit

No Tailwind Plus / Catalyst files were present in the authorised folder, so every component is custom
(`src/components/ui`). They can be swapped for Catalyst equivalents later without touching pages.

## Structure

```
src/
  schemas/      Zod schemas + inferred types (one file per domain)
  data/         mock/ (raw data), validate.ts (schema + cross-checks), dataset.ts, repository.ts (read API)
  lib/          pure helpers: format, metrics (aggregation, findings), route, report, cn
  components/   ui/ (primitives) · layout/ · overview/ · sample/ · icons/
  pages/        OverviewPage, SamplePage
  assets/       fonts, images (+ generated mock variants)
```

Data flows `mock → validate → dataset → repository → pages`. The UI never reads raw arrays, so a real API can replace
`repository.ts`. Sample-level numbers are **derived** from the variants (average / worst case), never hand-typed twice.

## Conflicts in the mockup and how they were resolved

| Mockup                                                                    | Resolution                                                                        |
| ------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Chart: Visual 42.4 %, Transformation 18.3 %; findings: 18.3 % and 12.7 %  | Chart is the source of truth; findings are generated from it (42.4 / 18.3)        |
| ADC 42.6 % vs chart 42.4 %                                                | Different metrics; kept as shown. CRS = 100 − ADC is enforced                     |
| S1 row says _Adversarial Manipulation_, S1 detail says it has _No change_ | S1 row now reports _Visual Perturbation_ (−18.3 pp), matching its detail          |
| V1: 0.942 → 0.761 shown as −18.3 pp                                       | 0.942 − 0.761 = −18.1 pp; shown value is calculated. Category average stays −18.3 |
| Slide 5: "Showing 4 of 6 inputs" vs 17 assessed inputs                    | 6 = variants in the selected category (Visual Perturbation); 17 = all categories  |
| Overall score 18/100 "strong resilience" vs 42.6 % degradation            | Kept verbatim from the deck; flag for the content owner                           |
| Slide 4/5 "pp" wrapping, "42.6 / %" wrapping, `Comparsion` typo           | Layout bugs fixed; typo corrected                                                 |

`npm run validate:data` fails if any of these relationships drift apart.

## Accessibility & responsiveness

Semantic landmarks, one `h1` per page, native `<dialog>` (focus trap, Esc), radio groups for selections (arrow keys),
text alternatives for colour-only deltas, visible focus rings. Desktop matches the deck; below `md` the rail becomes a
bottom bar, KPI cards reflow to 2 columns, the table becomes stacked rows, and comparison panels stack.
Known trade-off: priority pill text colours come from the deck and have low contrast on their tinted backgrounds.

## Verification status

Built and exercised in a headless browser (dialog, selection flows, report download, N/A state, widths 390–1440 px, no
horizontal overflow, no console errors) using Tailwind's compiler + esbuild on these exact sources. The sandbox that produced
this project could not reach the npm registry, so **`vite build`, `tsc -b` and `eslint` have not been run** — run
`npm install && npm run build && npm run lint` first and fix anything they report.
