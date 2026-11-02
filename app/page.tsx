import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import PostCard, { type Publication } from "@/components/PostCard";

const publications: Publication[] = [
  {
    type: "achievement",
    childName: "Mateo",
    initial: "M",
    time: "14:20",
    postedBy: "publicado por vos",
    recipients: "familia de Mateo",
    text: "¡Usó el orinal solito por primera vez! Estaba feliz de contárselo a todos. Un gran paso.",
    likes: 3,
    comments: 1,
    canEdit: true,
  },
  {
    type: "activity",
    childName: "Mateo",
    initial: "M",
    time: "09:40",
    postedBy: "publicado por vos",
    recipients: "familia de Mateo",
    text: "Pintamos con témperas esta mañana. Mateo eligió el azul para todo y se concentró un montón mezclando colores.",
    likes: 5,
    comments: 2,
    canEdit: true,
    photoCaption: "Foto · pintando con témperas",
  },
  {
    type: "announcement",
    childName: "Anuncio general",
    initial: "",
    time: "07:50",
    postedBy: "publicado por vos",
    recipients: "toda la sala",
    text: "El viernes salimos al parque por la mañana. Recuerden mandar gorra y una botellita de agua.",
    likes: 8,
    comments: 0,
    canEdit: true,
  },
];

export default function FeedPage() {
  return (
    <div className="flex min-h-screen bg-canvas md:flex-row flex-col">
      <Sidebar />
      <main className="min-w-0 flex-1 pt-14 md:pt-0">
        <div className="mx-auto w-full max-w-[760px] px-5 pt-[34px] pb-20 md:px-10">
          <div className="mb-6">
            <div className="font-extrabold text-[12.5px] tracking-[0.8px] text-accent mb-1">GUARDERÍA · SALA SOLES</div>
            <h1 className="font-fredoka font-semibold text-[30px] text-ink">Buenas, Caro</h1>
            <p className="mt-[5px] text-[14.5px] text-muted">12 niños · martes 17 jun</p>
          </div>

          <Link
            href="/crear-publicacion"
            className="mb-6 flex items-center gap-[14px] rounded-[18px] border border-line bg-card px-[18px] py-[14px] shadow-[0_4px_14px_-10px_rgba(120,90,60,0.4)]"
          >
            <div className="flex-none flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft font-fredoka font-semibold text-[16px] text-white">C</div>
            <span className="flex-1 text-[15px] text-muted">Compartí un momento…</span>
            <span className="flex h-[38px] w-[38px] items-center justify-center rounded-[12px] bg-soft text-accent">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            </span>
          </Link>

          <div className="mb-[14px] flex items-center gap-[14px]">
            <span className="font-extrabold text-[12.5px] tracking-[0.8px] text-muted">PUBLICADO HOY</span>
            <span className="h-px flex-1 bg-line" />
          </div>

          <div className="flex flex-col gap-4">
            {publications.map((publication, index) => (
              <PostCard key={`${publication.childName}-${publication.time}-${index}`} publication={publication} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
