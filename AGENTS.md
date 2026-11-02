# AGENTS.md

## Repo snapshot

- App "open-daycare": daycare app for parents/staff, UI in Spanish. **Not built yet** — `app/` is still create-next-app boilerplate.
- Next.js 16.4.3 + React 19.3 + TypeScript (strict), Tailwind CSS v4, no tests, no CI, no src/ directory.

## Developer commands

- `npm run dev` — dev server at localhost:3000 (Turbopack).
- `npm run lint` — ESLint 9 flat config (`eslint.config.mjs`), lints cwd by default.
- `npx tsc --noEmit` — typecheck (no `typecheck` script exists).
- Verify changes with lint + typecheck; there is no test suite.

## Design mockups (source of truth for UI)

- `referencias/pantallas/*.dc.html` — clickable mockups of every screen (feed, login, ninos, avisos, crear-publicacion, etc.). Open in a browser to view; they need `referencias/pantallas/support.js` next to them.
- `referencias/screenshots/*.png` — static PNG references of the same screens.
- Mockup fonts: Fredoka / Nunito, warm cream palette (`#f6ecdf` bg, `#3f362e` text) — not the default create-next-app Geist setup in `app/layout.tsx`.

## Gotchas

- Tailwind is wired through a Turbopack loader rule in `next.config.ts` (no `postcss.config.*`). Don't add PostCSS config.
- `next.config.ts` enables experimental `cacheComponents` + `partialPrefetching` — server components/caching behave per the Next 16 rules in `node_modules/next/dist/docs/`.
- Path alias `@/*` maps to the repo root (e.g. `@/app/...`).
- Playwright MCP is configured in `opencode.json`; all Playwright-related files/screenshots must go in `.playwright-mcp/` (gitignored).
- Managed `nextjs-agent-*` blocks below are rewritten by `next dev` — keep them, and commit this file with your work.

## Flujo de trabajo obligatorio (specs)

- Skills instaladas en `.agents/skills/` con lock en `skills-lock.json` (fuente: `klerith/fernando-skills`):
  - `/spec <descripción>` — diseña y guarda una spec. **Nunca escribe código.**
  - `/spec-impl <NN-slug>` — implementa una spec. Solo si su estado es `Aprobado`.
- Las specs viven en `specs/` con nombre `NN-slug.md` (numeración secuencial desde `01-`, slug kebab-case).
- Estados de spec: `Borrador` → `Aprobado` → `Implementado` (solo el usuario cambia el estado).
- `/spec-impl` crea una rama git `spec-NN-slug` (controlado por `specs/.spec-config.yml`, `AutoCreateBranch: true` por defecto) e implementa paso a paso con pausas; **nunca commitea por su cuenta**.
- Plantilla y reglas del documento: `.agents/skills/spec/template.md` (encabezado en blockquote, alcance In/Out, plan numerado con pasos que dejan el juego funcionando, criterios de aceptación verificables, decisiones tomadas/descartadas).
- No implementes nada sin una spec aprobada; si piden un cambio pequeño fuera del flujo, proporle crear una spec primero.

## Reglas de código

- usar código limpio. nombres, funciones y vvariables, etc en ingles.
- las variables declaradas deben tener un significado y ser coherentes con el nombre.
- No repetir código.