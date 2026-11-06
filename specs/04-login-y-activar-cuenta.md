# SPEC 04 — Login (`/login`) y activación de cuenta (`/activate`)

> **Estado:** Aprovado
> **Depende de:** SPEC 02, SPEC 03
> **Fecha:** 2026-11-06
> **Objetivo:** Implementar las pantallas `login.dc.html` en `/login` y `activar-cuenta.dc.html` en `/activate` con los tokens de SPEC 02, reutilizando los datos de Mateo de `kids-data.ts` y dejando fuera las opciones de rol Personal/Familia del mockup.

---

## Alcance

**In:**

- Rutas **fuera** del route group `(app)` (sin sidebar ni header móvil, como ya se dejó decidido en SPEC 03): `app/login/page.tsx` y `app/activate/page.tsx`.
- `app/login/page.tsx` (server): split de dos columnas del mockup.
  - Columna izquierda (branding): gradiente `accent-soft → accent-warm`, círculos decorativos translúcidos, fila logo + "OpenDayCare" en Fredoka, titular "El día de cada niño, compartido con su familia.", subtítulo y pie "🌿 Guardería Sala Soles". **Oculta debajo de 768px** (elección del usuario).
  - Columna derecha (formulario): título "Iniciar sesión", subtítulo "Ingresá para ver el día de hoy.", labels EMAIL y CONTRASEÑA, campo email `type="email"` prefijado con `caro@opendaycare.com` (valor por defecto del mockup, sin rol elegido), campo contraseña con **toggle mostrar/ocultar** (elección del usuario), link "¿Olvidaste tu contraseña?" **deshabilitado** (mismo criterio de links muertos de SPEC 03), botón "Iniciar sesión" que navega a `/` (elección del usuario, como un `<Link>`), y pie "¿Te invitó la guardería? Activá tu cuenta" con link a `/activate`.
  - **Sin el bloque "INGRESO COMO"** (botones Personal/Familia): pedido explícito del usuario.
- `components/ActivateForm.tsx` (client): formulario de activación con `useState` prefijado con los valores del mockup (`7K4P9`, `lucia.fernandez@gmail.com`, `contraseña`), todos editables; contraseña también con el toggle; checkbox de consentimiento de fotos **arrancando marcado y togglable** (elección del usuario).
- `app/activate/page.tsx` (server): tarjeta de invitación leyendo **a Mateo de `components/kids-data.ts`** (elección del usuario): avatar con su `avatar.background`/inicial `firstName[0]` y texto "Mateo · Sala Soles" derivado de los datos; campos CÓDIGO DE INVITACIÓN, EMAIL, CREAR CONTRASEÑA, caja de autorización y botón "Activar mi cuenta" que navega a `/`. Pie "¿Ya tenés cuenta? Iniciar sesión" → `/login`.
- `components/PasswordInput.tsx` (client): input de contraseña con ojo toggle `password/text`, **compartido por ambas pantallas**.
- `components/BrandMark.tsx`: el ícono sol de la marca como componente compartido, usado por las dos páginas nuevas y por `Sidebar` (size por prop) para no repetir el SVG.
- Estilo con tokens de SPEC 02; responsive solo con el patrón ya establecido del repo.

**Fuera del alcance (para futuras specs):**

- Autenticación real, validación de credenciales, redirección por rol o estados de error de login.
- Pantalla de "¿Olvidaste tu contraseña?" (queda con el estilo intacto sin navegación).
- La pantalla `familia-feed` — ambos botones de éxito navegan a `/` hasta que exista.
- Persistir el consentimiento, el código de invitación o los datos del formulario (solo estado de UI en memoria).
- Generar códigos de invitación ni verificar contra `kids-data.ts` que el email coincida con un padre.
- Las demás pantallas del mockup (avisos, mi-cuenta, crear-publicacion, detalle-publicacion).
- Base de datos, API o datos reales; modo oscuro; tokens nuevos de paleta.

---

## Modelo de datos

Esta spec no introduce estructuras nuevas: reutiliza `Kid` de SPEC 03 y agrega solo estado local de UI.

```ts
// components/ActivateForm.tsx (client, valores iniciales del mockup)
const [code, setCode] = useState("7K4P9");
const [email, setEmail] = useState("lucia.fernandez@gmail.com");
const [password, setPassword] = useState("contraseña");
const [consented, setConsented] = useState(true);
```

La contraseña visible/oculta vive dentro de `PasswordInput` (su propio `show` local). El login no tiene estado salvo el del toggle (es un formulario sin lógica, `defaultValue` en email).

**Mapeo de colores a tokens (siguiendo la convención de reinterpretación de SPEC 02):**

| Elemento del mockup                                                    | Token / clase                                                                 |
| ---------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Fondo de página `#FBF4EC`                                              | `canvas-warm`                                                                 |
| Texto `#3F362E` / `#4A4038`                                            | `ink`                                                                         |
| Gradiente panel y botón (`#F6A98E→#F2937A→#EC7E62`, `#F4977E→#EE8164`) | `accent-soft → accent-warm` (delta documentado: el del panel es de 3 paradas) |
| Fondos blancos de inputs/tarjetas                                      | `card`                                                                        |
| Bordes `#EADFD0`                                                       | `line` (delta documentado)                                                    |
| Labels y grises `#94887B`, `#B6A99B` (placeholder), `#8A7234`          | `muted` (unificación ya decidida en SPEC 02)                                  |
| Links rojos `#C5503A`                                                  | `accent`                                                                      |
| Checkbox verde `#5FB97E`                                               | `achievement` (delta documentado)                                             |
| Caja de autorización `#FBF1D6`                                         | `canvas-warm` (delta documentado: el mockup es más amarilla)                  |
| Sombras `rgba(238,129,100,.x)`                                         | excepción rgba ya definida en SPEC 02                                         |

---

## Plan de implementación

1. **Marca compartida:** crear `components/BrandMark.tsx` (el SVG del sol, tamaño por prop) y usarlo en `Sidebar` reemplazando su SVG inline. Verificación: `/` se ve idéntica; `npm run lint` + `npx tsc --noEmit` pasan.
2. **Input de contraseña:** crear `components/PasswordInput.tsx` (client) con el ojo toggle `password/text`. Verificación: compila (`npx tsc --noEmit` limpio).
3. **Login:** crear `app/login/page.tsx` (server, split dos columnas, ocultando el branding `<768px`), con `PasswordInput`, link "Activá tu cuenta" → `/activate`, botón "Iniciar sesión" → `/` y "¿Olvidaste tu contraseña?" deshabilitado. Verificación manual en dev: se ve como el mockup, el toggle alterna, ambos links navegan.
4. **Activación:** crear `components/ActivateForm.tsx` (client con el estado prefijado del modelo de datos) y `app/activate/page.tsx` consumiendo a Mateo de `kids-data.ts`. Verificación manual: la tarjeta muestra los datos de Mateo; el checkbox y los campos son editables; el botón navega a `/`.
5. **Verificación final:** `npm run lint` + `npx tsc --noEmit`; screenshots con Playwright (1280×800 y 390×844, en `.playwright-mcp/`) de `/login` y `/activate` comparadas con los mockups; recorrido `/ → /login → /activate → /` completo.

---

## Criterios de aceptación

- [ ] `/login` replica el mockup (split, gradiente, círculos, titular, pie "Guardería Sala Soles") **sin** el bloque "INGRESO COMO" ni las palabras Personal/Familia.
- [ ] El campo email de `/login` llega prefijado con `caro@opendaycare.com`; la contraseña muestra puntos con placeholder "••••••••".
- [ ] El ojo de `PasswordInput` alterna de puntos a texto en `/login` y en `/activate`.
- [ ] Pulsar "Iniciar sesión" lleva a `/`; el link "Activá tu cuenta" lleva a `/activate`; "¿Olvidaste tu contraseña?" se ve pero no navega.
- [ ] `/activate` replica el mockup: tarjeta de invitación con avatar celeste `#A9D9E8` + `M` de Mateo y "Mateo · Sala Soles" leídos de `kids-data.ts` (no texto fijo en la página).
- [ ] Los tres campos de `/activate` llegan prefijados (`7K4P9`, `lucia.fernandez@gmail.com`, `contraseña`) y se pueden editar.
- [ ] El checkbox de autorización arranca marcado y se puede desmarcar/marcar.
- [ ] Pulsar "Activar mi cuenta" lleva a `/`; el pie "¿Ya tenés cuenta? Iniciar sesión" lleva a `/login`.
- [ ] Debajo de 768px: `/login` muestra solo el formulario a ancho completo (branding oculto); `/activate` es usable a 390px.
- [ ] `grep` de hex nuevos en el código nuevo devuelve solo los deltas documentados en el mapeo (sombras rgba; el gradiente de 3 paradas no introduce hex: se escribe con los tokens).
- [ ] `npm run lint` y `npx tsc --noEmit` pasan.
- [ ] `/` (feed + sidebar) no cambia visualmente tras extraer `BrandMark`.

---

## Decisiones

- **Sí:** rutas `/login` y `/activate` en inglés (elección del usuario, convención vigente desde SPEC 03: código en inglés, visible en español).
- **Sí:** quitar el selector "INGRESO COMO" Personal/Familia y con él el `role` del mockup (pedido explícito del usuario); sin rol no hay destino condicional — ambos éxitos navegan a `/` (elección del usuario).
- **Sí:** "¿Olvidaste tu contraseña?" deshabilitado con el estilo intacto (mismo criterio que los links muertos de SPEC 03) mientras no exista la pantalla.
- **Sí:** toggle mostrar/ocultar contraseña en ambas pantallas (elección del usuario, no está en el mockup) — es el único client-state del login, encapsulado en `PasswordInput`.
- **Sí:** formulario de activación **interactivo prefijado**: `useState` con los valores del mockup y checkbox marcado de fábrica (elección del usuario), no inputs muertos.
- **Sí:** tarjeta de invitación leyendo a Mateo de `kids-data.ts` (elección del usuario, DRI) en lugar de hardcodear: la sala se deriva como `Sala ${kid.room}` y la inicial como `firstName[0]`.
- **Sí:** páginas `server` + client solo en las piezas con estado (`PasswordInput`, `ActivateForm`), el patrón de todas las specs previas.
- **Sí:** `BrandMark.tsx` compartido e integrado también en `Sidebar`, contra la repetición del SVG del sol en tres lugares.
- **Sí:** gradiente de 3 paradas del panel reescrito como `accent-soft → accent-warm` (se pierden las paradas intermedia/exterior); queda como delta visual aceptado, igual que los gradientes ya tokenizados en SPEC 02.
- **No:** tokens nuevos para `#EADFD0`, `#5FB97E`, `#FBF1D6` (los deltas se reinterpretan con `line`, `achievement`, `canvas-warm`, según la preferencia de reinterpretación de SPEC 02).
- **No:** validación de campos, mensajes de error ni estados intermedios de "cargando" — el flujo navega directo por decisión del usuario (la validación es tema de la spec de auth real).

---

## Riesgos

| Riesgo                                                                        | Mitigación                                                                                                                                  |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| El gradiente de 3 paradas y `#FBF1D6` desvían el look del mockup al tokenizar | Comparación lado a lado obligatoria en el paso 5; deltas ya documentados en el mapeo                                                        |
| Tocar `Sidebar` para extraer `BrandMark` rompe el feed                        | Paso 1 verifica `/` contra el estado previo antes de seguir con las pantallas nuevas                                                        |
| El checkbox del mockup es un `<label>` estilizado sin mecánica                | Se implementa como checkbox accesible real (`input type="checkbox"` + estado) dentro de `ActivateForm`, no como div con estado visual falso |

---

## Qué **no** está en esta spec

- Autenticación, validación de credenciales o redirección por rol.
- Pantalla/flujo de recuperar contraseña.
- `familia-feed` y las pantallas del mockup restantes.
- Persistencia de formulario, consentimiento, sesiones ni códigos de invitación.
- Base de datos, API, tokens nuevos y modo oscuro.

Cada uno de esos, si aterriza, va en su propia spec.
