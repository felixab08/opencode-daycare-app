# SPEC 02 — Tokens de color en la UI existente

> **Estado* :*Implementado
> **Depende de:** SPEC 01
> **Fecha:** 2026-11-01
> **Objetivo:** Migrar los hex arbitrarios de `feed` a los tokens de color definidos en `@theme` en `app/globals.css`, reinterpretando con tokens cercanos los colores que quedaron sin token.

---

## Alcance

**In:**

- Reemplazo de clases arbitrarias hex (`bg-[#FFFDF9]`, `text-[#3F362E]`, …) por utilidades de token (`bg-card`, `text-ink`, …) en `components/Sidebar.tsx`, `components/PostCard.tsx` y `app/page.tsx`.
- Token nuevo `--color-scrollbar: #e4d6c4` en `app/globals.css` (elección del usuario) y regla `::-webkit-scrollbar-thumb` usando `var(--color-scrollbar)`.
- Reestructuración de `badgeStyles` en `PostCard`: de colores hex en `style` inline a clases estáticas con tokens (exigido para que Tailwind compile las variantes con opacidad).
- Corazón de likes: pasar de `fill="#E0654A"` a `fill="currentColor"` con `text-accent`.

**Fuera del alcance (para specs futuras):**

- Nuevos tokens de paleta para colores que hoy no existen (salvo `--color-scrollbar`, pedido explícito).
- Cambiar los textos, labels de badges, sombras decorativas o medidas del mockup.
- Aplicar tokens a páginas nuevas (no existen aún); las próximas specs las escriben directo con tokens.
- Modo oscuro, tema claro/oscuro, generación de temas alternativos.

## Modelo de datos

Esta spec no introduce nuevas estructuras de datos: reutiliza `Publication` y `PublicationType` de SPEC 01. Lo que cambia es la forma de `badgeStyles`:

```ts
// before (SPEC 01): hex values consumed via style={{ backgroundColor: ... }}
// after (SPEC 02):  static Tailwind classes per token
const badgeStyles: Record<PublicationType, { badge: string; dot: string; label: string }> = {
  achievement:  { badge: "bg-parent-active text-achievement",     dot: "bg-achievement",  label: "LOGRO" },
  activity:     { badge: "bg-staff/20 text-staff",               dot: "bg-staff",        label: "ACTIVIDAD" },
  announcement: { badge: "bg-announcement/20 text-announcement", dot: "bg-announcement", label: "ANUNCIO" },
};
```

Tabla de mapeo completa (hex → token):

| Hex actual | Token / clase destino |
| --- | --- |
| `#F6ECDF` | `canvas` |
| `#3F362E` | `ink` |
| `#FFFDF9` | `card` |
| `#ECE0D0` | `line` |
| `#D9583C` | `accent` |
| `#F2937A` | `accent-soft` |
| `#EE8164` | `accent-warm` |
| `#2E89A6` | `staff` |
| `#1F7A93` | `staff-deep` |
| `#3E9B6C` | `achievement` |
| `#4E72C8` | `announcement` |
| `#A89A8B` | `muted` |
| `#FBE3D8` | `soft` |
| `#CFEBD8` | `parent-active` |
| `#6E6359`, `#94887B`, `#8A7C6D` | `muted` (unificación, elección del usuario) |
| `#E0654A` (likes, cámara, corazón) | `accent` |
| `#C5503A` (Editar) | `accent` |
| `#4A4038` (texto de posts) | `ink` |
| `#E7DAC8`, `#F0E6D8`, `#DBCDBA` | `line` |
| `#F4ECE1` (fondo placeholder foto) | `canvas-warm` |
| `#B0A290` (texto placeholder) | `muted` |
| `#A9D9E8` (avatar M) | `bg-staff/25` |
| `#C7E7F1` (fondo ACTIVIDAD) | `bg-staff/20` |
| `#CCD8F4` (fondo ANUNCIO y avatar megáfono) | `bg-announcement/20` |
| gradiente logo `#F8C3A8→#F2937A` | `accent-soft → accent-warm` |
| gradiente botón `#F4977E→#EE8164` | `accent-soft → accent-warm` |
| `#E4D6C4` (scrollbar) | `--color-scrollbar` (nuevo token) |

**Excepción documentada — sombras decorativas:** `rgba(120,90,60,.4)`, `rgba(120,90,60,.5)` y `rgba(238,129,100,.75)` no tienen token en la paleta y quedan como valores arbitrarios en la clase de sombra. Son sombras, no colores de superficie.

---

## Plan de implementación

1. `app/globals.css`: agregar `--color-scrollbar: #e4d6c4;` al bloque `@theme` y cambiar la regla del thumb a `background: var(--color-scrollbar)` con el mismo borde/clip. Sistema andando con el token definido.
2. `components/Sidebar.tsx`: reemplazo de todos los hex según la tabla (gradientes → `bg-[linear-gradient(155deg,var(--color-accent-soft),var(--color-accent-warm))]`; sombras rgba quedan igual). Visual en `/` sin diferencias salvo las documentadas.
3. `components/PostCard.tsx`: nuevo `badgeStyles` con clases estáticas, componentes `TypeBadge`/`Avatar`/`PhotoPlaceholder` sin `style` inline de color, corazón `fill="currentColor"`. `npx tsc --noEmit` limpio.
4. `app/page.tsx`: saludo, composer y divisor con tokens. Verificación final: screenshots de comparación, `npm run lint` y `npx tsc --noEmit`.

## Criterios de aceptación

- [ ] `grep -E "#[0-9A-Fa-f]{6}|rgba\("` en `components/` y `app/page.tsx` devuelve únicamente sombras rgba y **cero** hex de color.
- [ ] `::-webkit-scrollbar-thumb` usa `var(--color-scrollbar)` y el token está definido en `@theme`.
- [ ] `badgeStyles` no contiene hex; los tres badges compilan con clases estáticas (`bg-parent-active`, `bg-staff/20`, `bg-announcement/20`).
- [ ] El corazón de likes se renderiza relleno con `text-accent` y `fill="currentColor"`.
- [ ] Comparación visual: sidebar, cards y feed se ven casi idénticos; las desviaciones permitidas son solo las documentadas (grises → `muted`, pastelados → tokens con opacidad, gradientes → `accent-soft→accent-warm`).
- [ ] `npm run lint` pasa sin errores.
- [ ] `npx tsc --noEmit` pasa sin errores.

## Decisiones

- **Sí:** reinterpretar los colores sin token con tokens cercanos (elección del usuario), en lugar del reemplazo 1:1 con hex remanentes.
- **No:** reemplazo 1:1 dejando hex para los faltantes — descartado por el usuario; quiere la UI tokenizada.
- **No:** agregar tokens nuevos para cada color faltante — descartado por el usuario; la paleta queda tal como la definió en `globals.css`.
- **Sí:** unificar los 3 grises marrones (`#6E6359`, `#94887B`, `#8A7C6D`) en `muted` (elección del usuario).
- **Sí:** aproximación de pastelados celestes con tokens + opacidad (`staff/20`, `staff/25`, `announcement/20`) (elección del usuario).
- **Sí:** token nuevo `--color-scrollbar` (elección del usuario en contra de la recomendación de dejar hex).
- **No:** tokens para las sombras rgba — son decorativas, cada una se usa una vez y nadie las reutiliza; quedan documentadas como excepción.
- **No:** tocar los valores de `@theme` existentes ni el bloque `@theme inline` de fuentes — el usuario ya los definió.

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| Los tokens con opacidad (`/20`, `/25`) desvían el look de los pastelados originales | Es la desviación aceptada por el usuario; verificar en la comparación visual del paso 4 |
| Las clases con opacidad requieren que Tailwed scanee el archivo: si `badgeStyles` sigue con `style` inline, se pierde el color | Se reestructura `badgeStyles` a clases estáticas (paso 3); verificado con el nodo del DOM |
| La sombra del botón pierde la transparencia si se usa `var(--color-accent-warm)` directo | Queda como excepción rgba documentada, sin cambio en esta spec |

## Qué **no** está en esta spec

- Paleta nueva o tokens adicionales (más allá de `--color-scrollbar`).
- Las demás pantallas del mockup (Niños, Avisos, Mi cuenta, crear-publicación, login).
- Modo oscuro o temas alternos.
- Base de datos, API o datos reales.
