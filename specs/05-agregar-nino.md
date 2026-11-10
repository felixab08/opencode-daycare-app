# SPEC 05 — Modal "Agregar niño" en `/kids`

> **Estado:** Aprovado
> **Depende de:** SPEC 02, SPEC 03
> **Fecha:** 2026-11-06
> **Objetivo:** Habilitar el botón "Agregar niño" de `/kids` para abrir, como ventana modal overlay, el formulario del mockup `agregar-nino.dc.html`, y que "Guardar" agregue al niño nuevo a la grilla en memoria.

---

## Alcance

**In:**

- `app/(app)/kids/page.tsx` (server): queda como shell fino que monta el nuevo componente client; el botón `id="add-kids-button"` se habilita (se quitan `disabled` y `cursor-default`, el resto de las clases queda intacto).
- `components/KidsDirectory.tsx` (client, nuevo): concentra el estado de la pantalla — lista de niños (inicializada con el array de `kids-data`) y visibilidad del modal. Renderiza el encabezado (título + botón), el divisor "SALA SOLES" con el contador **derivado de la lista dinámica** (así sube de 8 a 9 al agregar) y la grilla.
- `components/AddKidModal.tsx` (client, nuevo): modal overlay del mockup, sobre `/kids`:
  - Fondo oscurecido fijo a pantalla completa; tarjeta de 520px centrada con barra superior **Cancelar / Agregar niño / Guardar** y los cinco campos del mockup.
  - **Campos obligatorios** (elección del usuario): NOMBRE COMPLETO (`input`), FECHA DE NACIMIENTO (`input type="date"`, elección del usuario). SALA es un `select` con las opciones Soles / Lunas / Estrellas (enmienda del usuario de 2026-11-10: reemplaza el chip estático del mockup) y siempre viaja llena (inicial: "Soles").
  - **Campos opcionales**: ALERGIAS (input, etiquetas separadas por comas) y NOTAS MÉDICAS (textarea).
  - **Guardar** deshabilitado hasta que haya nombre y fecha; habilitado toma color `accent`.
  - Al guardar se construye un `Kid` y se agrega a la lista: la grilla se actualiza y el modal se cierra. **Sin persistencia**: al recargar la página el niño desaparece.
  - **Cerrar sin agregar:** "Cancelar", tecla `Esc` y click en el backdrop. Primer input con foco al abrir. `role="dialog"` + `aria-modal`.
- `components/KidsGrid.tsx`: recibe la lista por prop `kids` en lugar de importarla (mismo filtro en vivo por nombre y apellido, mismo estado vacío).
- `components/KidCard.tsx`: prop opcional `canOpenProfile` (default `true`) que cambia el `Link` por un `div` cuando es `false` — los niños agregados no tienen perfil (los 8 del array sí, ver `dynamicParams = false` de SPEC 03).
- Estilo con tokens de SPEC 02, responsive con el patrón del repo (modal usable a 390px).

**Fuera del alcance (para futuras specs):**

- Base de datos, API o persistencia (localStorage): el niño nuevo vive solo en memoria de la sesión.
- Perfil de niño para los agregados (`/kids/<slug>` sigue limitado a los 8 del array).
- Las pantallas `editar-nino`, `resumen-dia` y `vincular-padre` (sus botones siguen deshabilitados).
- Validación avanzada (formatos, duplicados de nombre, fechas futuras).
- Las demás pantallas del mockup (avisos, mi cuenta, crear publicación, detalle).
- Tokens nuevos de paleta y modo oscuro.

---

## Modelo de datos

Esta spec no introduce estructuras nuevas: reutiliza el tipo `Kid` de SPEC 03. El estado nuevo es local de UI:

```ts
// components/KidsDirectory.tsx (client)
const [kidsList, setKidsList] = useState(kids); // inicial: array estático de components/kids-data.ts
const [isAddModalOpen, setIsAddModalOpen] = useState(false);
```

```ts
// components/AddKidModal.tsx (client)
const [fullName, setFullName] = useState(""); // "Martina López" — obligatorio
const [birthDate, setBirthDate] = useState(""); // "2022-03-12" (ISO del input date) — obligatorio
const [allergiesText, setAllergiesText] = useState(""); // "Maní, Lactosa" — opcional
const [medicalNotes, setMedicalNotes] = useState(""); // opcional
```

**Derivación del `Kid` al guardar** (helper interno, niños nuevos = datos mínimos + lo opcional que se complete):

| Campo         | Valor                                                         |
| ------------- | ------------------------------------------------------------- |
| `slug`        | nombre completo → ASCII, minúsculas, espacios a guiones       |
| `firstName`   | primera palabra del nombre                                    |
| `lastName`    | el resto del nombre (vacío si es una sola palabra)            |
| `ageYears`    | año actual − año de `birthDate` (sin precisión de cumpleaños) |
| `birthDate`   | mismo texto visible que el array: `12 mar 2022`               |
| `room` | valor del select SALA: `"Soles"` (default), `"Lunas"` o `"Estrellas"` — enmienda del usuario de 2026-11-10 |
| `entryDate`   | mes corriente en el formato del array: `nov 2026`             |
| `allergies`   | `allergiesText` partido por comas y en MAYÚSCULAS             |
| `allergyNote` | `medicalNotes` (solo si viene texto)                          |
| `avatar`      | pastel **ciclando los 5 pares de SPEC 03** por índice         |
| `parents`     | `[]`                                                          |

**Mapeo de colores a tokens (convención de reinterpretación de SPEC 02):**

| Elemento del mockup                     | Token / clase                                                         |
| --------------------------------------- | --------------------------------------------------------------------- |
| Tarjeta `#FBF4EC`                       | `canvas-warm`                                                         |
| Borde `#ECE0D0` / `#EADFD0`             | `line` (delta ya documentado en SPEC 04)                              |
| Labels `#94887B`, placeholder `#B6A99B` | `muted`                                                               |
| Link "Guardar" `#D9583C`                | `accent`                                                              |
| Sombra de tarjeta `rgba(63,54,46,.35)`  | excepción rgba ya definida en SPEC 02 (es `ink`)                      |
| Backdrop del overlay                    | `bg-ink/40` — **no existe en el mockup** (es página): decisión propia |

---

## Plan de implementación

1. **`KidsGrid` desacoplado:** cambiar `KidsGrid` para recibir `kids: Kid[]` por prop (fuera el import directo). La página pasa el array igual que antes. Verificación: `/kids` filtra igual, `npm run lint` + `npx tsc --noEmit` pasan.
2. **`KidCard` sin navegación opcional:** agregar `canOpenProfile?: boolean` (default `true`); si es `false`, un `div` con los mismos estilos reemplaza al `Link` (sin `group`, sin hover). Verificación: las 8 tarjetas existentes siguen navegando.
3. **`AddKidModal` aislado:** crear el componente con el formulario, el backdrop, el cierre por `Esc`/backdrop/cancelar y el `onAddKid` disparado por Guardar (aún sin montar: la pantalla no cambia). Verificación: compila y el estado obligatorio activa/desactiva Guardar.
4. **`KidsDirectory`:** crear el componente client con la lista + modal, el encabezado (botón habilitado con `id="add-kids-button"`), el divisor con contador dinámico vía slot `children` de `KidsGrid`, y dejar `page.tsx` como shell server que lo monta. Verificación manual en dev: click abre el modal; Guardar con datos agrega la tarjeta (badge VINCULAR o de alergia según el caso, contador en 9); Cancelar/Esc/backdrop cierran sin agregar.
5. **Verificación final:** `npm run lint` + `npx tsc --noEmit`; screenshots con Playwright (1280×800 y 390×844, en `.playwright-mcp/`) del `/kids` base y del modal abierto, comparadas con `agregar-nino.dc.html`; flujo completo con búsqueda sobre la lista actualizada; recarga de la página confirma que el agregado no persiste.

---

## Criterios de aceptación

- [ ] En `/kids` el botón "Agregar niño" (id `add-kids-button`) está habilitado; click abre el modal overlay sobre la pantalla.
- [ ] El modal replica el mockup: tarjeta `canvas-warm` de 520px, barra Cancelar / "Agregar niño" (Fredoka) / Guardar, y los cinco campos con sus labels exactos.
- [ ] FECHA DE NACIMIENTO es un `input type="date"`; SALA es un `select` con las opciones Soles / Lunas / Estrellas (enmienda del usuario de 2026-11-10).
- [ ] Guardar queda deshabilitado sin nombre o sin fecha; al completar ambos se ve en `accent` y queda activo.
- [ ] Guardar cierra el modal y agrega la tarjeta: avatar pastel, nombre, edad calculada, "sin padres vinculados", y badge VINCULAR (o badges de alergia si se cargaron etiquetas).
- [ ] El divisor pasa de "8 niños" a "9 niños" al agregar; el buscador filtra también al niño nuevo.
- [ ] La tarjeta del niño nuevo no navega a perfil; las 8 originales siguen navegando a `/kids/<slug>`.
- [ ] Cancelar, `Esc` y click en el backdrop cierran el modal sin agregar nada.
- [ ] Al recargar la página el niño agregado desaparece (el estado vuelve a los 8 del array).
- [ ] A 390px de ancho el modal es legible y usable (tarjeta a ancho completo con margen).
- [ ] `grep` de hex nuevos en el código nuevo devuelve solo los deltas documentados en el mapeo (backdrop via token `ink` con opacidad; rgba de sombra ya exceptuada).
- [ ] `npm run lint` y `npx tsc --noEmit` pasan.

---

## Decisiones

- **Sí:** modal overlay sobre `/kids` (elección del usuario) contra la forma de la referencia, que es una página completa — el pedido explícito fue "ventana modal".
- **Sí:** Guardar **agrega el niño en memoria** (elección del usuario): la grilla se actualiza en la sesión; sin persistencia, en línea con los formularios de SPEC 04 hasta que exista backend.
- **Sí:** tarjeta del niño nuevo con **datos mínimos** (elección del usuario): nombre, fecha y sala son obligatorios; alergias y notas son opcionales y tal como el array usa texto visible.
- **Sí:** `type="date"` (elección del usuario) en lugar del placeholder `"dd/mm/aaaa"` del mockup: entrada estructurada y edad calculable.
- **Sí:** solo nombre y fecha bloquean Guardar (sala siempre viaja `"Soles"`); sin más validación (la spec de auth real la traerá).
- **Sí:** tarjeta del niño nuevo **sin navegación** a perfil: `dynamicParams = false` daría 404; mismo criterio que los links muertos de SPEC 03/04, con `canOpenProfile` en `KidCard`.
- **Sí:** `KidsDirectory` (client) concentra estado y compone encabezado + grilla + modal, y `page.tsx` queda server como shell (patrón server + client con estado de todas las specs previas; el divisor con contador dinámico se movió dentro del client).
- **Sí:** `KidsGrid` pasa a recibir la lista por prop: la filtra y el estado deja de estar clavado al import.
- **Sí:** slug ASCII del nombre completo (convención de SPEC 03) y avatar pastel ciclando los 5 pares de SPEC 03: el mínimo inventado que la tarjeta necesita para verse.
- **Sí:** `ageYears` calculado por diferencia de años, sin ajuste de cumpleaños — el campo es display en tarjeta, no dato de perfil.
- **Enmienda (usuario, 2026-11-10):** dropdown real de SALA con `<select>` + opciones Soles / Lunas / Estrellas, y centrado absoluto del modal en pantallas grandes. Reemplaza las decisiones previas "No: dropdown real de sala" y el patrón de centrado inicial.
- **No:** animaciones de entrada/salida del modal ni portal a nivel document (el overlay va renderizado condicional dentro del árbol).
- **No:** persistencia, localStorage, DB ni perfil para los niños agregados.

---

## Riesgos

| Riesgo                                                                              | Mitigación                                                                                                          |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Tocar `KidsGrid` y `KidCard` rompe la pantalla existente                            | Pasos 1 y 2 verifican `/kids` contra el estado previo antes de montar nada nuevo                                    |
| El contador estático "SALA SOLES · 8 niños" queda desincronizado con la lista       | El divisor pasa a renderizarse dentro del client con `kidsList.length` (paso 4)                                     |
| Inputs `type="date"` se ven distinto entre navegadores y pueden divergir del mockup | Comparación lado a lado obligatoria en el paso 5; el placeholder se pierde, delta aceptado                          |
| Dos niños con igual nombre generan el mismo `slug`                                  | Sin impacto: el slug de los nuevos no navega ni se usa como key de datos (la key del render sigue siendo el `slug`) |

---

## Qué **no** está en esta spec

- Persistencia (localStorage, DB) de los niños agregados.
- Perfil `/kids/<slug>` para los niños nuevos.
- `editar-nino`, `resumen-dia`, `vincular-padre`.
- Validación avanzada de formulario.
- Las demás pantallas del mockup, tokens nuevos y modo oscuro.

Cada uno de esos, si aterriza, va en su propia spec.
