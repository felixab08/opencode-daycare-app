export interface KidParent {
  name: string; // visible: "Lucía Fernández"
  relation: string; // visible: "Mamá"
  isActive: boolean; // true → ACTIVA, false → PENDIENTE
  avatarColor: string; // pastel hex for the avatar (identity data, no design token)
}

export interface Kid {
  slug: string; // "mateo-fernandez" (ASCII, no accents)
  firstName: string; // "Mateo"
  lastName: string; // "Fernández"
  ageYears: number; // hardcoded age matching the mockup
  birthDate: string; // visible text: "12 mar 2022"
  room: string; // "Soles"
  entryDate: string; // visible text: "feb 2025"
  allergies: string[]; // visible badge labels: ["MANÍ"]
  allergyNote?: string; // text for the profile "Alergias y notas" box
  avatar: { background: string; text: string }; // pastel hex identity data
  parents: KidParent[]; // linked-parent count derives from this
}

export const kids: Kid[] = [
  {
    slug: "mateo-fernandez",
    firstName: "Mateo",
    lastName: "Fernández",
    ageYears: 3,
    birthDate: "12 mar 2022",
    room: "Soles",
    entryDate: "feb 2025",
    allergies: ["MANÍ"],
    allergyNote: "Alergia al maní. Evitar frutos secos. Lleva inhalador en la mochila.",
    avatar: { background: "#A9D9E8", text: "#1F7A93" },
    parents: [
      { name: "Lucía Fernández", relation: "Mamá", isActive: true, avatarColor: "#C9B6E8" },
      { name: "Diego Fernández", relation: "Papá", isActive: false, avatarColor: "#A9C7E8" },
    ],
  },
  {
    slug: "sofia-mendez",
    firstName: "Sofía",
    lastName: "Méndez",
    ageYears: 2,
    birthDate: "4 oct 2024",
    room: "Soles",
    entryDate: "sep 2025",
    allergies: [],
    avatar: { background: "#F4B8CC", text: "#C44A7A" },
    parents: [
      { name: "Marta Méndez", relation: "Mamá", isActive: true, avatarColor: "#F4DC8E" },
    ],
  },
  {
    slug: "benjamin-ruiz",
    firstName: "Benjamín",
    lastName: "Ruiz",
    ageYears: 3,
    birthDate: "27 ago 2022",
    room: "Soles",
    entryDate: "mar 2025",
    allergies: [],
    avatar: { background: "#B9DEC4", text: "#3E8B62" },
    parents: [
      { name: "Ana Ruiz", relation: "Mamá", isActive: true, avatarColor: "#A9D9E8" },
      { name: "Pablo Ruiz", relation: "Papá", isActive: false, avatarColor: "#C9B6E8" },
    ],
  },
  {
    slug: "valentina-soto",
    firstName: "Valentina",
    lastName: "Soto",
    ageYears: 2,
    birthDate: "19 nov 2023",
    room: "Soles",
    entryDate: "oct 2025",
    allergies: [],
    avatar: { background: "#F4DC8E", text: "#9A7B1E" },
    parents: [],
  },
  {
    slug: "tomas-diaz",
    firstName: "Tomás",
    lastName: "Díaz",
    ageYears: 3,
    birthDate: "8 jul 2022",
    room: "Soles",
    entryDate: "feb 2025",
    allergies: ["LACTOSA"],
    allergyNote: "Intolerancia a la lactosa. Se le ofrece leche deslactosada en el desayuno.",
    avatar: { background: "#C9B6E8", text: "#7B5FC0" },
    parents: [
      { name: "Carla Díaz", relation: "Mamá", isActive: true, avatarColor: "#F4B8CC" },
    ],
  },
  {
    slug: "emma-castro",
    firstName: "Emma",
    lastName: "Castro",
    ageYears: 2,
    birthDate: "30 nov 2023",
    room: "Soles",
    entryDate: "sep 2025",
    allergies: [],
    avatar: { background: "#F4B8CC", text: "#C44A7A" },
    parents: [
      { name: "Nicolás Castro", relation: "Papá", isActive: true, avatarColor: "#B9DEC4" },
    ],
  },
  {
    slug: "lucas-romero",
    firstName: "Lucas",
    lastName: "Romero",
    ageYears: 3,
    birthDate: "15 ene 2023",
    room: "Soles",
    entryDate: "abr 2025",
    allergies: [],
    avatar: { background: "#A9D9E8", text: "#1F7A93" },
    parents: [
      { name: "Valeria Romero", relation: "Mamá", isActive: true, avatarColor: "#A9C7E8" },
    ],
  },
  {
    slug: "olivia-vega",
    firstName: "Olivia",
    lastName: "Vega",
    ageYears: 2,
    birthDate: "22 dic 2023",
    room: "Soles",
    entryDate: "oct 2025",
    allergies: [],
    avatar: { background: "#B9DEC4", text: "#3E8B62" },
    parents: [
      { name: "Jazmín Vega", relation: "Mamá", isActive: true, avatarColor: "#F4DC8E" },
    ],
  },
];
