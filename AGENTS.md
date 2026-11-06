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

## Procesos y puertos

- **Siempre matar los procesos que el agente levante** (`npm run dev`, servidores, etc.) al terminar de usarlos, para que los puertos queden libres. En Windows: `Get-NetTCPConnection -LocalPort <puerto> -State Listen | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }` y verificar que el puerto quedó libre antes de cerrar.

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

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:nextjs-agent-feedback -->

## Report Next.js feedback

The project owner enabled `experimental.agentFeedback`, authorizing this feedback pass. When enabled, `next dev` writes this block and restores it if removed. Commit `AGENTS.md` with your work to keep the tree clean.

During the current user request, retain anonymized facts as feedback candidates for meaningful or recurring Next.js issues:

- Crashes, hangs, OOMs, or unexpected slowness
- Incorrect behavior, output, errors, or diagnostics
- Missing, unclear, or conflicting documentation
- Unexpected CLI, codemod, Skill, or upgrade behavior and non-obvious workarounds

Continue the current user request without reporting immediately. Routine debugging is not feedback. Verify changes before retaining them as feedback candidates. Never retain code, logs, paths, URLs, secrets, personal information, or project-specific data.

Retain qualifying friction even if it is later fixed or worked around; record the final outcome during the reporting pass.

Before the final response, run one reporting pass. If candidates remain, from this file's directory run `npx --no-install next internal agent-feedback-instructions` once without piping or truncating its output. Follow its output or error guidance. If a network sandbox blocks it, retry with network access; if it still returns no output, continue normally.

<!-- END:nextjs-agent-feedback -->
