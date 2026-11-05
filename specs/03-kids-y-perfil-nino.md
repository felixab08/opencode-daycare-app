# SPEC 03 — Pantalla Niños (`/kids`) y perfil de niño (`/kids/[slug]`)

> **Estado:** Aprovado
> **Depende de:** SPEC 01, SPEC 02
> **Fecha:** 2026-11-04
> **Objetivo:** Implementar el listado de niños (`ninos.dc.html`) en `/kids` y el perfil (`perfil-nino.dc.html`) en `/kids/[slug]` con datos hardcodeados, sidebar compartida vía route group `(app)`, buscador interactivo y badges generados desde los datos.

---

## Alcance

**In:**

- Route group nuevo `app/(app)/`: `layout.tsx` montando el shell (flex + `Sidebar` + `<main>`) y el feed movido ahí (`app/page.tsx` → `app/(app)/page.tsx`, sin tocar su contenido). Cierra la deuda pendiente de SPEC 01.
- `components/Sidebar.tsx`: link "Niños" apuntando a `/kids` y detección de activo por prefijo (`/kids/mateo-fernandez` también marca "Niños" activo).
- `components/kids-data.ts`: tipos `Kid`/`KidParent` y array con los **8 niños del mockup**, todos con perfil completo.
- `app/(app)/kids/page.tsx` (server): encabezado "GESTIÓN / Niños", buscador y grilla.
- `components/KidCard.tsx`: tarjeta del mockup con regla condicional de badges (alergia → badge de alergia; sin padres → VINCULAR; caso contrario → chevron).
- `components/KidsGrid.tsx` (client): buscador que **filtra en vivo** por nombre y estado vacío cuando no hay coincidencias.
- `app/(app)/kids/[slug]/page.tsx` (server): perfil de niño idéntico al mockup `perfil-nino.dc.html`, con `generateStaticParams` (8 slugs) y `dynamicParams = false` (slug desconocido → 404).
- Botones hacia pantallas inexistentes ("Agregar niño", "Editar", "Resumen del día", "Vincular otro padre") **deshabilitados** visualmente intactos pero sin navegación (decisión del usuario).
- Estilo con tokens de SPEC 02 (`bg-card`, `text-ink`, `bg-allergy-warm`, `bg-allergy-pink`, …) y Tailwind v4.
- Responsive con el patrón ya establecido (header + drawer <768px).

**Fuera del alcance (para futuras specs):**

- Base de datos, API o datos reales — los 8 niños y sus padres son un array estático en código.
- Las pantallas `agregar-nino`, `editar-nino`, `resumen-dia`, `vincular-padre` (sus botones quedan deshabilitados).
- Las demás pantallas del mockup (avisos, mi-cuenta, login, crear-publicacion, detalle-publicacion).
- Autenticación, sesión y el flujo de logout real.
- Tokens nuevos para colores que no existen en la paleta (los pastelados de avatares quedan como hex en los datos, documentado abajo).
- Modo oscuro.

---

## Modelo de datos

```ts
// components/kids-data.ts
interface KidParent {
  name: string; // "Lucía Fernández" (visible)
  relation: string; // "Mamá" | "Papá" (visible: "Mamá · activa")
  isActive: boolean; // true → badge ACTIVA, false → badge PENDIENTE
  avatarColor: string; // hex pastel del avatar (excepción: no hay token)
}

interface Kid {
  slug: string; // "mateo-fernandez" (ASCII, sin acentos)
  firstName: string; // "Mateo"
  lastName: string; // "Fernández"
  ageYears: number; // 3 → "3 años" (hardcodeado, decisión del usuario)
  birthDate: string; // "12 mar 2022" (texto visible)
  room: string; // "Soles"
  entryDate: string; // "feb 2025" (texto visible)
  allergies: string[]; // ["MANÍ"] — labels visibles tal como salen en el badge
  allergyNote?: string; // texto de la caja "Alergias y notas" del perfil
  avatar: { background: string; text: string }; // hex pastel identidad (excepción)
  parents: KidParent[]; // el conteo de "N padres vinculados" se deriva de acá
}
```

**Badge derecho de la tarjeta — regla condicional (decisión del usuario):**
`allergies.length > 0` → un badge por alergia (`bg-allergy-warm`); si no, `parents.length === 0` → badge VINCULAR (`bg-allergy-pink`); si no → chevron `muted`.

**Mateo usa exactamente los datos del mockup** (`allergyNote: "Alergia al maní. Evitar frutos secos. Lleva inhalador en la mochila."`, padres Lucía Fernández · Mamá · ACTIVA, Diego Fernández · Papá · invitación enviada · PENDIENTE). Los otros 7 completamos los datos coherentes con su tarjeta del listado:

| Niño            | Edad | Nacimiento  | Ingreso  | Alergias | Padres                               |
| --------------- | ---- | ----------- | -------- | -------- | ------------------------------------ |
| Mateo Fernández | 3    | 12 mar 2022 | feb 2025 | MANÍ     | Lucía (ACTIVA), Diego (PENDIENTE)    |
| Sofía Méndez    | 2    | 4 oct 2024  | sep 2025 | —        | Marta Méndez · Mamá · ACTIVA         |
| Benjamín Ruiz   | 3    | 27 ago 2022 | mar 2025 | —        | Ana (ACTIVA), Pablo Ruiz (PENDIENTE) |
| Valentina Soto  | 2    | 19 nov 2023 | oct 2025 | —        | ninguna                              |
| Tomás Díaz      | 3    | 8 jul 2022  | feb 2025 | LACTOSA  | Carla Díaz · Mamá · ACTIVA           |
| Emma Castro     | 2    | 30 nov 2023 | sep 2025 | —        | Nicolás Castro · Papá · ACTIVA       |
| Lucas Romero    | 3    | 15 ene 2023 | abr 2025 | —        | Valeria Romero · Mamá · ACTIVA       |
| Olivia Vega     | 2    | 22 dic 2023 | oct 2025 | —        | Jazmín Vega · Mamá · ACTIVA          |

Pastelados de avatar por niño (del mockup, quedan como datos con hex): Mateo/Lucas `#A9D9E8`/#`1F7A93`, Sofía/Emma `#F4B8CC`/`#C44A7A`, Benjamín/Olivia `#B9DEC4`/`#3E8B62`, Valentina `#F4DC8E`/`#9A7B1E`, Tomás `#C9B6E8`/`#7B5FC0`; padres de Mateo `#C9B6E8` (Lucía) y `#A9C7E8` (Diego).

**Mapeo de colores a tokens:** fondos de superficie/links → tokens de SPEC 02 (`canvas`, `card`, `line`, `soft`, `muted`, `accent`, `achievement`); badges de alergia `bg-allergy-warm` y VINCULAR `bg-allergy-pink` (tokens **exactos**, `\#FBD8CC` / `\#F9D2DE`, ya presentes en `@theme`); ACTIVA `bg-parent-active` + `text-achievement`; PENDIENTE `bg-parent-pending`. Textos de labels sin token: `\#D9684A` (alergia) y `\#C56486` (VINCULAR) → `text-accent` (delta sutil documentado, siguiendo la preferencia de reinterpretación de SPEC 02); texto PENDIENTE `\#9A7B1E` → `text-[#9A7B1E]` (sin token, hex documentado). Caja de alerta del perfil: `bg-accent/15`, ícono `bg-accent`, textos en `accent`.

El contador del grupo sale de los datos: `${kids.length} niños`.

---

## Plan de implementación

1. **Route group:** crear `app/(app)/layout.tsx` con el shell del feed (`flex min-h-screen bg-canvas` + `<Sidebar />` + `<main className="min-w-0 flex-1 pt-14 md:pt-0">{children}</main>`), mover `app/page.tsx` → `app/(app)/page.tsx` y quitarle la composición del `Sidebar` (queda solo el contenido). Actualizar `Sidebar` (`/ninos` → `/kids`, activo por `pathname === href || pathname.startsWith(href + "/")` con salvo para `/`). Verificación: `/` se ve idéntica a como estaba (comparación con el screenshot de SPEC 02) y `npm run lint` + `npx tsc --noEmit` pasan.
2. **Datos:** crear `components/kids-data.ts` con los tipos `Kid`/`KidParent` y los 8 niños de la tabla (identifiers en inglés, textos visibles en español, según la convención). Entregable tipado: `npx tsc --noEmit` pasa.
3. **Tarjeta:** crear `components/KidCard.tsx` — tarjeta del mockup (avatar circular con color de datos, nombre Fredoka 600, subtítulo edad + padres vinculados con singular/plural, badge condicional o chevron, link a `/kids/${slug}`, hover del mockup con clase `group`). `npx tsc --noEmit` pasa.
4. **Listado:** crear `components/KidsGrid.tsx` (client: `useState` para la búsqueda, filtra por nombre y apellido, estado vacío "No hay niños que coincidan con la búsqueda" en `muted`) y `app/(app)/kids/page.tsx` (server: encabezado "GESTIÓN / Niños", botón "Agregar niño" deshabilitado, divisor "SALA SOLES · N niños", grilla). `/kids` renderiza completa. Verificación manual en dev: escribe y filtra.
5. **Perfil:** crear `app/(app)/kids/[slug]/page.tsx` — `generateStaticParams` con los 8 slugs, `dynamicParams = false`, `await params`, `notFound()` hasta que aplique; layout de dos columnas del mockup: "Volver a Niños" (→ `/kids`, funcional), avatar grande, nombre, caja de alergias, tabla de datos (nacimiento/sala/ingreso), botón "Resumen del día" deshabilitado, caja "PADRES VINCULADOS" con badges ACTIVA/PENDIENTE y "Vincular otro padre" deshabilitado. Perfil completo visible y 404 en slug inventado.
6. **Verificación final:** `npm run lint` + `npx tsc --noEmit`; screenshots con Playwright (1280×800 y 390×844, en `.playwright-mcp/`) de `/kids` y `/kids/mateo-fernandez` comparadas lado a lado con los mockups; comportamiento del filtro; drawer móvil.

---

## Criterios de aceptación

- [x] `/kids` muestra la sidebar con "Niños" activo (`bg-soft` / `text-accent`), encabezado "GESTIÓN" + título "Niños" en Fredoka, buscador y divisor "SALA SOLES" con el contador "8 niños" derivado de los datos.
- [x] Las 8 tarjetas renderizan con textos exactos del mockup (nombres, edades, "N padres vinculados" con singular/plural y "sin padres vinculados" en Valentina).
- [x] Regla de badges: Mateo → MANÍ, Tomás → LACTOSA (`bg-allergy-warm`), Valentina → VINCULAR (`bg-allergy-pink`), los otros 5 → chevron; badges en labels en español.
- [x] Escribir en el buscador filtra la grilla en vivo por nombre; sin coincidencias se muestra el estado vacío plano (`muted`).
- [x] Cada tarjeta navega a `/kids/<slug>` y ese slug aparece en la URL.
- [x] `/kids/mateo-fernandez` replica el mockup: avatar 84px, nombre + "3 años · Sala Soles", botón "Editar" deshabilitado, caja de alergias con el texto exacto, tabla (12 mar 2022 / Soles / feb 2025), "Resumen del día" deshabilitado, PADRES VINCULADOS con Lucía ACTIVA y Diego PENDIENTE, "Vincular otro padre" deshabilitado.
- [x] "Volver a Niños" lleva a `/kids`.
- [x] Los otros 7 slugs renderizan el perfil con sus datos; navegación a un slug no listado da 404.
- [x] La sidebar marca "Niños" como activo también dentro de `/kids/[slug]`.
- [x] Debajo de 768px: header con hamburguesa + drawer funcionando en ambas pantallas, sin sidebar lateral.
- [x] `grep` de hex nuevos en el código nuevo devuelve solo las excepciones documentadas (pastelados de avatares y `\#9A7B1E`).
- [x] `npm run lint` y `npx tsc --noEmit` pasan.
- [x] El feed (`/`) se ve idéntico a la implementación previa tras el cambio de estructura.

---

## Decisiones

- **Sí:** rutas en inglés (`/kids`, `/kids/[slug]`) — pedido explícito del usuario. Labels visibles siguen en español (convención de SPEC 01: código/datos en inglés, visible en español).
- **Sí:** actualizar `Sidebar` a `/kids` y activo por prefijo (elección del usuario); mantener los demás labels del nav en español.
- **Sí:** route group `(app)` para distribuir la sidebar — cierra la decisión pendiente de SPEC 01 y deja fuera del shell a futuras rutas sin sidebar (login).
- **Sí:** datos en `components/kids-data.ts` junto al componente (elección del usuario, contra la recomendación inicial de `lib/kids.ts`); array tipado hardcodeado como en SPEC 01.
- **Sí:** perfil completo para los 8 niños (elección del usuario); Mateo clavado al mockup, el resto inventado de forma coherente — a futuro con DB se reemplaza todo el array.
- **Sí:** edad hardcodeada en `ageYears` (elección del usuario): calcularla desde la fecha real divergiría del mockup ("3 años" para nacidos en 2022).
- **Sí:** badges como regla condicional generada desde `allergies` y `parents` (elección del usuario), no como campo fijo por niño.
- **Sí:** buscador **interactivo** (elección del usuario, contra la alternativa estática del mockup); el estado vacío no existe en el mockup — se define minimalista en la grilla `client`.
- **Sí:** grilla + buscador en un componente `client` (`KidsGrid`); pagina y perfil `server`, mismo patrón que la sidebar de SPEC 01.
- **Sí:** links muertos **deshabilitados** (elección del usuario, contra el criterio de SPEC 01): "Agregar niño", "Editar", "Resumen del día" y "Vincular otro padre" se muestran con su estilo intacto pero sin navegación; se restauran cuando existan las pantallas.
- **Sí:** reutilizar tokens existentes (SPEC 02); fondos de badges alergia/vincular exactos con `allergy-warm`/`allergy-pink`.
- **No:** tokens nuevos para los pastelados de avatares (SPEC 02 dejó los tokens fuera de alcance); quedan como hex dentro de los datos — son identidad del niño, no de la UI.
- **Sí:** `text-accent` para labels de badge sin token con delta documentado y hex puntual (`\#9A7B1E`) donde no hay familia de color cercana.
- **No:** `localStorage`, versionado ni persistencia — no corresponde a datos estáticos.

---

## Riesgos

| Riesgo                                                                                                                                                    | Mitigación                                                                                                                                                  |
| --------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Next 16 con `cacheComponents`: las APIs de rutas dinámicas tienen convenciones distintas (`params` es Promise, prerenderizado via `generateStaticParams`) | Leer la guía de `node_modules/next/dist/docs/` en el paso 5 antes de escribir el `[slug]`; el paso 5 deja el sistema andando antes de la verificación final |
| El cambio de estructura (route group) rompe el feed existente                                                                                             | Paso 1 verifica `/` contra el screenshot previo antes de avanzar; el feed no cambia de contenido                                                            |
| Tokens con opacidad (`bg-accent/15`, avatares de datos) desvían el look de los mockups                                                                    | Comparación lado a lado obligatoria en el paso 6; deltas documentados como en SPEC 01/02                                                                    |

---

## Qué **no** está en esta spec

- Base de datos, API, ni datos reales (todo hardcodeado en `components/kids-data.ts`).
- Las pantallas `agregar-nino`, `editar-nino`, `resumen-dia` y `vincular-padre` (sus botones quedan deshabilitados).
- Las demás pantallas del mockup (avisos, mi cuenta, login, crear publicación, detalle).
- Autenticación funcional o editar el perfil.
- Tokens nuevos de paleta o modo oscuro.
