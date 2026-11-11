# SPEC 06 — Modal "Vincular padre" en perfil de niño

> **Estado:** Aprovado
> **Depende de:** SPEC 02, SPEC 03, SPEC 05
> **Fecha:** 2026-11-10
> **Objetivo:** Habilitar el botón "Vincular otro padre" (`id="link-parent"`) del perfil de niño para abrir, como ventana modal overlay, el formulario del mockup `vincular-padre.dc.html`, y que "Enviar invitación" agregue el padre nuevo a la lista "PADRES VINCULADOS" en memoria.

---

## Alcance

**In:**

- `app/(app)/kids/[slug]/page.tsx` (server): queda como shell fino que monta el nuevo componente client; la tarjeta "PADRES VINCULADOS" sale del server y pasa a renderizarse dentro del client con los mismos estilos.
- `components/LinkedParentsCard.tsx` (client, nuevo): tarjeta "PADRES VINCULADOS" que recibe el `kid` por prop, concentra la lista de padres (inicializada con `kid.parents`) y la visibilidad del modal. Renderiza la lista tal como hoy (avatar pastel con inicial, nombre, "relation · activa|invitación enviada", badge ACTIVA/PENDIENTE) y el botón `id="link-parent"` **habilitado** (se quitan `disabled` y `cursor-default`, el resto de las clases queda intacto).
- `components/LinkParentModal.tsx` (client, nuevo): modal overlay del mockup, sobre el perfil:
  - Backdrop fijo `bg-ink/40` a pantalla completa; tarjeta de **480px** centrada (`canvas-warm`, borde `line`, radio 24px, sombra rgba exceptuada) con barra superior: "Vincular padre" (Fredoka) + "a {kid.firstName} {kid.lastName}" **derivado del kid** (no hardcodeado) y botón **X** de cierre a la derecha.
  - Aviso azul con ícono info y el texto del mockup: "Le enviaremos un correo con un código para que active su cuenta. Solo verá el feed de Mateo." — **"Mateo" derivado del `firstName` del kid**.
  - Campos: NOMBRE DEL PADRE/MADRE (`input`, placeholder "Ej. Diego Fernández") y EMAIL (`input type="email"`, placeholder "correo@ejemplo.com").
  - PARENTESCO: chips de selección única **Mamá / Papá / Tutor/a**, sin ninguna preseleccionada (elección del usuario).
  - Caja amarilla CÓDIGO DE INVITACIÓN: código **aleatorio de 5 caracteres A-Z0-9 generado cada vez que se abre el modal** (elección del usuario), en Fredoka con `letter-spacing`, y texto fijo "Vence en 7 días".
  - Botón "Enviar invitación" con gradiente `accent-soft → accent-warm` (como el mockup), **deshabilitado** hasta tener nombre + email + parentesco (elección del usuario, patrón Guardar de SPEC 05).
  - **Al enviar:** se construye un `KidParent` con `isActive: false` y se agrega a la lista: la tarjeta se actualiza (el padre nuevo aparece con badge PENDIENTE y "invitación enviada") y el modal se cierra. **Sin persistencia**: al recargar la página el padre desaparece.
  - **Cerrar sin enviar:** X, tecla `Esc` y click en el backdrop. Primer input con foco al abrir. `role="dialog"` + `aria-modal`.
- Estilo con tokens de SPEC 02, responsive con el patrón del repo (modal usable a 390px).

**Fuera del alcance (para futuras specs):**

- Base de datos, API o persistencia del padre vinculado (vive solo en memoria de la sesión).
- Envío real de correo, generación/verificación de códigos del lado server, cálculo real de vencimiento.
- El botón "Editar" y el botón "Resumen del día" del perfil siguen deshabilitados.
- Perfil editable para los niños agregados en SPEC 05 (el modal solo es alcanzable desde los 8 kids del array, que son los únicos con perfil).
- Validación avanzada (formato de email, duplicados de nombre/email).
- Las pantallas `editar-nino` y `resumen-dia` y las demás pantallas del mockup.
- Tokens nuevos de paleta y modo oscuro.

---

## Modelo de datos

Esta spec no introduce estructuras nuevas: reutiliza `Kid` y `KidParent` de SPEC 03. El estado nuevo es local de UI:

```ts
// components/LinkedParentsCard.tsx (client)
const [parentsList, setParentsList] = useState(kid.parents); // inicial: kid.parents de components/kids-data.ts
const [isModalOpen, setIsModalOpen] = useState(false);
```

```ts
// components/LinkParentModal.tsx (client)
const [parentName, setParentName] = useState(""); // "Diego Fernández" — obligatorio
const [parentEmail, setParentEmail] = useState(""); // "correo@ejemplo.com" — obligatorio
const [relation, setRelation] = useState<null | "Mamá" | "Papá" | "Tutor/a">(
  null,
); // selección única — obligatoria
const [inviteCode, setInviteCode] = useState(""); // 5 caracteres A-Z0-9, regenerado al abrir el modal
```

**Derivación del `KidParent` al enviar** (helper interno):

| Campo         | Valor                                                                                      |
| ------------- | ------------------------------------------------------------------------------------------ |
| `name`        | texto del input NOMBRE, tal como se escribe                                                |
| `relation`    | chip elegido: `"Mamá"`, `"Papá"` o `"Tutor/a"`                                             |
| `isActive`    | `false` (la invitación queda pendiente hasta que active su cuenta)                         |
| `avatarColor` | pastel **ciclando los 6 colores de `avatarColor` existentes en `kids-data.ts`** por índice |

**Generación del código:** 5 caracteres aleatorios del alfabeto `A-Z0-9`, generados en el cliente al abrir el modal y regenerados en cada apertura.

**Mapeo de colores a tokens (convención de reinterpretación de SPEC 02):**

| Elemento del mockup                                                 | Token / clase                                                                                                                |
| ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Tarjeta `#FBF4EC`                                                   | `canvas-warm`                                                                                                                |
| Borde `#ECE0D0` / `#EADFD0`                                         | `line` (delta ya documentado en SPEC 04/05)                                                                                  |
| Labels `#94887B`, placeholder `#B6A99B`                             | `muted`                                                                                                                      |
| Texto `#3F362E`                                                     | `ink`                                                                                                                        |
| Inputs fondo blanco                                                 | `card`                                                                                                                       |
| Aviso azul fondo `#E3ECFB`, texto `#3F5694`                         | sin token: el mockup usa azul (`#4E72C8`/`#3F5694`) — **excepción hex documentada** (no existe azul en la paleta de SPEC 02) |
| Caja amarilla `#FBF1D6`, borde `#E6D08A`, texto `#A88526`/`#8A7234` | `canvas-warm` + `muted` (delta ya documentado en SPEC 04: el mockup es más amarilla)                                         |
| Gradiente botón `#F4977E → #EE8164`                                 | `accent-soft → accent-warm` (patrón de SPEC 04)                                                                              |
| Sombra de tarjeta `rgba(63,54,46,.35)`                              | excepción rgba ya definida en SPEC 02 (es `ink`)                                                                             |
| Botón deshabilitado                                                 | opacidad reducida sobre el gradiente (misma mecánica de Guardar en SPEC 05)                                                  |
| Backdrop del overlay                                                | `bg-ink/40` — decisión propia ya tomada en SPEC 05                                                                           |

---

## Plan de implementación

1. **Tarjeta desacoplada:** crear `components/LinkedParentsCard.tsx` (client) que reciba `kid` por prop y renderice la lista "PADRES VINCULADOS" y el botón `id="link-parent"` exactamente como se ve hoy en `page.tsx` (aún deshabilitado); `page.tsx` lo monta en el mismo lugar. Verificación manual en dev: el perfil se ve idéntico; `npm run lint` + `npx tsc --noEmit` pasan.
2. **Modal aislado:** crear `components/LinkParentModal.tsx` (client) con el formulario completo del mockup, la generación del código al abrir, la validación del botón y el cierre por X/`Esc`/backdrop (aún sin montar: la pantalla no cambia). Verificación: compila y el estado obligatorio activa/desactiva "Enviar invitación".
3. **Conexión:** habilitar el botón en `LinkedParentsCard` (quitar `disabled`/`cursor-default`, mismo `id`), abrir el modal con `isModalOpen`, y que "Enviar invitación" agregue el `KidParent` derivado a `parentsList` y cierre el modal. Verificación manual en dev: click abre el modal; enviar con datos agrega el padre con badge PENDIENTE y "invitación enviada"; X/`Esc`/backdrop cierran sin agregar.
4. **Verificación final:** `npm run lint` + `npx tsc --noEmit`; screenshots con Playwright (1280×800 y 390×844, en `.playwright-mcp/`) del perfil base y del modal abierto, comparadas con `vincular-padre.dc.html`; verificar que el código de invitación cambia entre aperturas del modal; recarga de la página confirma que el padre agregado no persiste.

---

## Criterios de aceptación

- [ ] En el perfil de cualquier kid del array, el botón "Vincular otro padre" (id `link-parent`) está habilitado; click abre el modal overlay sobre la pantalla.
- [ ] El modal replica el mockup: tarjeta `canvas-warm` de 480px, encabezado "Vincular padre" + "a {nombre del kid}" derivado de los datos, botón X, aviso azul, dos campos, tres chips y caja amarilla con el código en Fredoka.
- [ ] El nombre del kid en encabezado y aviso viene de `kids-data.ts` (con otro kid dice "a {otro nombre}") — no hay "Mateo" hardcodeado en el componente.
- [ ] Los chips Mamá / Papá / Tutor/a son de selección única y llegan sin ninguna preseleccionada.
- [ ] El código de invitación tiene exactamente 5 caracteres A-Z0-9 y **cambia** entre una apertura del modal y la siguiente.
- [ ] "Enviar invitación" queda deshabilitado sin nombre, sin email o sin parentesco; al completar los tres queda activo con el gradiente `accent-soft → accent-warm`.
- [ ] Enviar cierra el modal y agrega la fila del padre: avatar pastel con inicial, nombre, `{relation} · invitación enviada` y badge PENDIENTE.
- [ ] X, `Esc` y click en el backdrop cierran el modal sin agregar nada.
- [ ] Al recargar la página el padre agregado desaparece (la lista vuelve a los padres del array).
- [ ] A 390px de ancho el modal es legible y usable (tarjeta a ancho completo con margen).
- [ ] `grep` de hex nuevos en el código nuevo devuelve solo los deltas documentados en el mapeo (azules del aviso como excepción documentada; rgba de sombra ya exceptuada).
- [ ] `npm run lint` y `npx tsc --noEmit` pasan.
- [ ] El perfil de niño no cambia visualmente tras extraer `LinkedParentsCard` (paso 1).

---

## Decisiones

- **Sí:** modal overlay sobre el perfil (elección del usuario, "ventana modal") contra la forma de la referencia, que es una página completa — mismo criterio que SPEC 05.
- **Sí:** "Enviar invitación" **agrega el padre a la lista en memoria** (elección del usuario): la tarjeta "PADRES VINCULADOS" se actualiza en la sesión; sin persistencia, en línea con SPEC 04/05 hasta que exista backend.
- **Sí:** botón deshabilitado hasta nombre + email + parentesco (elección del usuario): mismo patrón de validación mínima de Guardar en SPEC 05.
- **Sí:** código de invitación **aleatorio de 5 caracteres A-Z0-9 por apertura** (elección del usuario) contra el `7K4P9` fijo del mockup; "Vence en 7 días" queda fijo porque no hay cálculo real de vencimiento.
- **Sí:** chips sin preselección y parentesco obligatorio (elección del usuario); el mockup muestra "Mamá" activo pero es estado de demo.
- **Sí:** `LinkedParentsCard` (client) concentra lista + modal y `page.tsx` queda server como shell (patrón server + client con estado de todas las specs previas; la lista necesita estado para reflejar el alta).
- **Sí:** `relation` como texto literal `"Mamá" | "Papá" | "Tutor/a"` de los chips — es exactamente el formato que `KidParent.relation` ya muestra en la lista.
- **Sí:** `isActive: false` para el padre nuevo (badge PENDIENTE, texto "invitación enviada"): el mockup dice "Le enviaremos un correo… para que active su cuenta".
- **Sí:** `avatarColor` ciclando los 6 pasteles ya existentes en `kids-data.ts`: el mínimo inventado que la fila nueva necesita para verse, igual que el ciclo de avatares de SPEC 05.
- **Sí:** aviso azul con hex propios documentados como excepción: la paleta de SPEC 02 no tiene azul y el mockup lo usa con propósito informativo; reinterpretarlo con tokens existentes lo volvería ilegible.
- **No:** persistencia, localStorage, DB ni envío real de correo con el código.
- **No:** animaciones de entrada/salida del modal ni portal a nivel document (renderizado condicional dentro del árbol, como SPEC 05).
- **No:** toast de confirmación con el código tras enviar (descartado por el usuario: la confirmación es ver al padre en la lista).

---

## Riesgos

| Riesgo                                                                                      | Mitigación                                                                                                                |
| ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Mover la tarjeta "PADRES VINCULADOS" del server al client rompe el perfil                   | El paso 1 verifica el perfil contra el estado previo antes de habilitar nada                                              |
| El código aleatorio se regenera en cada render del modal y "salta" mientras el usuario mira | El código se genera una vez por apertura (al montar/al abrir), no en cada render                                          |
| El aviso azul introduce hex fuera de la paleta                                              | Delta documentado en el mapeo y verificado con `grep` en los criterios de aceptación                                      |
| Kid con `parents: []` (existe en el array): la lista sin padres podría quedar vacía         | El botón "Vincular otro padre" siempre se renderiza debajo de la lista, vacía o no — se verifica con ese kid en el paso 4 |

---

## Qué **no** está en esta spec

- Persistencia del padre vinculado y envío real de correo.
- Verificación de códigos o vencimiento real.
- "Editar" y "Resumen del día" del perfil de niño.
- `editar-nino`, `resumen-dia` y las demás pantallas del mockup.
- Validación avanzada de formulario, tokens nuevos y modo oscuro.

Cada uno de esos, si aterriza, va en su propia spec.
