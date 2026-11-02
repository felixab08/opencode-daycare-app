# SPEC 01 — Feed de guardería como home (`/`)

> **Estado:** Aprobado
> **Depende de:** ninguna
> **Fecha:** 2026-11-01
> **Objetivo:** Implementar el mockup `referencias/pantallas/feed.dc.html` como la ruta `/` de OpenDayCare con estilo idéntico — sin autenticación, sin base de datos y con datos hardcodeados — agregando comportamiento mobile (header con drawer) por debajo de 768px.

---

## Alcance

**In:**

- Rendición de la pantalla feed en `app/page.tsx`, reemplazando el boilerplate de create-next-app.
- Sidebar fija de escritorio (248px, `#FFFDF9`) con logo OpenDayCare, botón "Nueva publicación", navegación (Feed activo, Niños, Avisos, Mi cuenta) y bloque de usuaria (Caro Giménez, Maestra · Soles, botón salir).
- Contenedor principal: saludo ("GUARDERÍA · SALA SOLES" / "Buenas, Caro" / "12 niños · martes 17 jun") con títulos estáticos del mockup.
- Caja simulada de composer ("Compartí un momento…") que enlaza a `/crear-publicacion`.
- Sección "PUBLICADO HOY" con las 3 tarjetas de publicación del mockup (logro, actividad con foto placeholder, anuncio), cada una con avatar, badge de tipo, fecha/hora, texto, contador de me gusta y comentarios, link "Editar".
- Paleta y tipografía del mockup: fondo `#F6ECDF`, texto `#3F362E`, fuentes **Fredoka** (títulos) y **Nunito** (texto) cargadas con `next/font/google`.
- Estilo con **Tailwind v4 usando valores arbitrarios** (`bg-[#F6ECDF]`, `w-[248px]`, etc.) traducidos de los estilos inline del mockup sin alterar valores.
- Comportamiento **mobile**: debajo de 768px (`md`) la sidebar se oculta y aparece un header superior con logo + botón que abre la sidebar como drawer con overlay. Desktop (≥768px) se ve exactamente como el mockup.
- Componentes reutilizables: `components/Sidebar.tsx` y `components/PostCard.tsx`, pensados para reuso en futuras pantallas (Niños, Avisos, etc.).

**Fuera del alcance (para specs futuras):**

- Base de datos, API o datos reales — las publicaciones son un array estático.
- Autenticación y flujo de login/logout funcionales.
- Crear/editar publicaciones o ver detalle — las rutas destino no existen aún (darán 404).
- Las demás pantallas (`ninos`, `avisos`, `mi-cuenta`, `crear-publicacion`, `login`, etc.).
- Interactividad de me gusta/comentarios.

---

## Modelo de datos

```ts
// components/PostCard.tsx (exportado junto al componente)
type PublicationType = "achievement" | "activity" | "announcement";

interface Publication {
  type: PublicationType;   // defines badge colors and icon
  childName: string;       // "Mateo" | "Anuncio general" (texto visible, en español)
  initial: string;         // avatar letter ("M"); announcement uses megaphone icon
  time: string;            // "14:20"
  postedBy: string;        // "publicado por vos" (texto visible)
  recipients: string;      // "familia de Mateo" | "toda la sala" (texto visible)
  text: string;
  likes: number;
  comments: number;
  canEdit: boolean;        // true on the 3 mockup posts
  photoCaption?: string;   // activity only: text under the photo placeholder
}
```

Badge labels shown to the user stay in Spanish; code identifiers are English (new code rule in `AGENTS.md`). Card type colors per publication type (map in `PostCard`):

```ts
const badgeStyles: Record<PublicationType, { background: string; dot: string; label: string; labelColor: string }> = {
  achievement:  { background: "#CFEBD8", dot: "#3E9B6C", label: "LOGRO",     labelColor: "#3E9B6C" },
  activity:     { background: "#C7E7F1", dot: "#2E89A6", label: "ACTIVIDAD", labelColor: "#2E89A6" },
  announcement: { background: "#CCD8F4", dot: "#4E72C8", label: "ANUNCIO",   labelColor: "#4E72C8" },
};
```

Los 3 posts y todos los textos se llenan exactamente con el contenido del mockup.

---

## Plan de implementación

1. `app/layout.tsx`: cargar `Fredoka` y `Nunito` con `next/font/google` exponiendo las variables `--font-fredoka` y `--font-nunito`; quitar Geist, setear `lang="es"` y metadata (`title: "OpenDayCare"`, `description` breve en español). Sistema andando (`/` renderiza con Tailwind importado) — verificado con `npm run dev`.
2. `app/globals.css`: registrar `--font-sans: var(--font-nunito)` y `--font-fredoka` en `@theme inline`; setear body (`background: #F6ECDF; color: #3F362E; font-family: var(--font-nunito)`), ancho del scrollbar (`#E4D6C4`) y **quitar** el override `prefers-color-scheme: dark` para que el fondo siempre sea crema. Página `/` (aún boilerplate) con fuentes y fondo correctos.
3. `components/Sidebar.tsx` (client): sidebar escritorio del mockup (logo, botón "Nueva publicación", nav con Feed activo, bloque de usuaria) + versión móvil (header superior con hamburguesa, drawer con overlay que cierra clicándolo). Links apuntan a `/`, `/ninos`, `/avisos`, `/mi-cuenta`, `/crear-publicacion`, `/login`. Montar en `app/page.tsx` para verla en dev antes de armar el contenido.
4. `components/PostCard.tsx`: tarjeta de publicación con modelo de datos de arriba, badges por tipo, placeholder de foto punteado para actividad, fila de acciones con links a `/detalle-publicacion` (comentarios) y `/crear-publicacion` (Editar). Sin montar aún (entregable tipado, verificado con `npx tsc --noEmit`).
5. `app/page.tsx`: composición final con `Sidebar`, bloque de saludo estático, caja composer (link a `/crear-publicacion` con avatar "C"), divisor "PUBLICADO HOY" y las 3 `Publicacion` del mockup en el array estático. Feed completo visible en `/`.

Verificación final: comparación lado a lado con el mockup, comportamiento mobile y `npm run lint` + `npx tsc --noEmit` — detallado en criterios de aceptación.

---

## Criterios de aceptación

- [ ] `/` muestra la sidebar escritorio idéntica al mockup: fondo `#FFFDF9`, ancho 248px, logo sun con gradiente `#F8C3A8→#F2937A`, botón "Nueva publicación" degradado, items "Feed" (activo, `#FBE3D8`/`#D9583C`), "Niños", "Avisos", "Mi cuenta", bloque "Caro Giménez · Maestra · Soles" con avatar "C" y botón salir.
- [ ] `document.fonts` en dev muestra Fredoka y Nunito cargadas (via `next/font`, self-hosted) y los títulos usan Fredoka.
- [ ] Comparación lado a lado (escritorio ≥768px) de `/` con `feed.dc.html`: colores, tipografías, tamaños, bordes/redondeos, sombras, espaciados y textos coinciden visualmente.
- [ ] El fondo del sitio es crema `#F6ECDF` también con el sistema en modo oscuro (no hay override `prefers-color-scheme` activo).
- [ ] Sidebar: "Nueva publicación" → `/crear-publicacion`; logo y "Feed" → `/`; "Niños" → `/ninos`; "Avisos" → `/avisos`; "Mi cuenta" → `/mi-cuenta`; logout → `/login`.
- [ ] Las 3 cards renderizan correctas: badges (LOGRO verde / ACTIVIDAD celeste / ANUNCIO azul), avatar "M" celeste en Mateo e icono megáfono en Anuncio general, textos exactos del mockup, likes 3/5/8 y comentarios 1/2/0.
- [ ] La card de actividad incluye el placeholder punteado de foto (200px, link a `/foto`).
- [ ] Cada card enlaza: comentarios → `/detalle-publicacion` y "Editar" → `/crear-publicacion`.
- [ ] Debajo de 768px no hay sidebar; aparece header superior con logo + hamburguesa que abre el drawer con overlay; clicar el overlay cierra el drawer.
- [ ] A 768px o más vuelve el layout de escritorio sin header móvil ni drawer visible.
- [ ] `npm run lint` pasa sin errores.
- [ ] `npx tsc --noEmit` pasa sin errores.

---

## Decisiones

- **Sí:** Tailwind v4 con valores arbitrarios (`bg-[#F6ECDF]`, `w-[248px]`) en lugar de copiar los estilos inline del mockup. Elección del usuario; mantiene la convención Tailwind del proyecto con los mismos valores exactos.
- **No:** copiar los estilos inline del mockup tal cual. Fidelidad garantizada igual con Tailwind, pero desviado de la convención del repo.
- **Sí:** `next/font/google` para Fredoka y Nunito reemplazando Geist. Self-hosted y sin layout shift, en vez de depender de los `<link>` de Google Fonts del mockup.
- **Sí:** links del sidebar a rutas futuras (`/ninos`, `/avisos`, `/mi-cuenta`, `/crear-publicacion`, `/login`, `/detalle-publicacion`, `/foto`) aunque den 404 hoy. Así las próximas pantallas andan al crearse sin retocar el feed.
- **No:** crear rutas placeholder vacías. Alarga esta spec; mejor a futuro directo.
- **Sí:** identifiers del código (tipos, campos, componentes) en inglés (`PublicationType`, `Publication`, `canEdit`); los textos visibles (contenido de posts, labels de badge) quedan en español. Rule of thumb: **código en inglés, datos visibles en español** (regla nueva de `AGENTS.md`; decisión tomada por el usuario durante la revisión).
- **Sí:** datos estáticos en un array tipado `Publication[]` (elección del usuario) — trivial de pagar por datos reales cuando llegue la base de datos.
- **No:** HTML estático asimilado. Impediría reuso y el cambio por datos de DB.
- **Sí:** responsive en esta misma spec (elección del usuario): **header con drawer** en móvil (decisión del usuario), breakpoint **md (768px)**, patrón no definido en el mockup, así que el diseño móvil es improvisación nuestra (header + drawer estilo estándar).
- **No:** bottom nav tab bar rompe más con el layout de escritorio y el usuario ya eligió drawer.
- **Sí:** componentes reutilizables: `Sidebar` y `PostCard` en `components/` (otra elección del usuario). Las futuras pantallas reutilizan la sidebar sin duplicar.
- **No:** distribuir la sidebar por route group/layout raíz. Su lugar: al momento de crear el layout de las demás pantallas.

---

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| La traducción de los estilos inline del mockup a clases Tailwind introduce pequeñas desviaciones (sombras, gradientes, bordes) | Criterio "comparación lado a lado" obligatoria en la Phase 5; verificar sombras/gradientes con las herramientas de dev del navegador |
| Fredoka es variable font con pesos 300–700: la config de `next/font` puede rendir pesos incorrectos | Especificar pesos 600/700 explícitos en la llamada de `next/font` para replicar los pesos del mockup |
| El drawer móvil introduce estado de React en una página que igual seguiría siendo estática server component | `Sidebar` es client component con `"use client"`; el resto de la página mantiene server-render |

---

## Qué **no** está en esta spec

- Base de datos, API, ni datos reales (los 3 posts son hardcodeados).
- Autenticación o cierre de sesión funcional.
- Crear/editar publicaciones, ver detalles, ni likes interactivos.
- Las demás pantallas (Niños, Avisos, Mi cuenta, crear-publicación, etc.).
- Fuera de la decisión de drawer de esta spec, el resto de las pantallas móviles.
