import Link from "next/link";

export type PublicationType = "achievement" | "activity" | "announcement";

export interface Publication {
  type: PublicationType;
  childName: string;
  initial: string;
  time: string;
  postedBy: string;
  recipients: string;
  text: string;
  likes: number;
  comments: number;
  canEdit: boolean;
  photoCaption?: string;
}

const badgeStyles: Record<PublicationType, { badge: string; dot: string; label: string }> = {
  achievement: { badge: "bg-parent-active text-achievement", dot: "bg-achievement", label: "LOGRO" },
  activity: { badge: "bg-staff/20 text-staff", dot: "bg-staff", label: "ACTIVIDAD" },
  announcement: { badge: "bg-announcement/20 text-announcement", dot: "bg-announcement", label: "ANUNCIO" },
};

const avatarClasses = "flex-none flex h-[44px] w-[44px] items-center justify-center rounded-full";

function TypeBadge({ type }: { type: PublicationType }) {
  const badge = badgeStyles[type];
  return (
    <div className={`flex items-center gap-[7px] rounded-full px-3 py-1.5 ${badge.badge}`}>
      <span className={`h-2 w-2 rounded-full ${badge.dot}`} />
      <span className="font-extrabold text-[12px] tracking-[0.5px]">{badge.label}</span>
    </div>
  );
}

function Avatar({ publication }: { publication: Publication }) {
  if (publication.type === "announcement") {
    return (
      <div className={`${avatarClasses} bg-announcement/20 text-announcement`}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 18-5v12L3 14v-3zM11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>
      </div>
    );
  }
  return (
    <div className={`${avatarClasses} bg-staff/25 font-fredoka font-semibold text-[17px] text-staff-deep`}>
      {publication.initial}
    </div>
  );
}

function PhotoPlaceholder({ caption }: { caption: string }) {
  return (
    <Link
      href="/foto"
      className="mt-[14px] flex h-[200px] flex-col items-center justify-center gap-2 rounded-[16px] border-[1.5px] border-dashed border-line bg-canvas-warm text-muted"
    >
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.6-3.6a2 2 0 0 0-2.8 0L6 21"/></svg>
      <span className="text-[13.5px]">{caption}</span>
    </Link>
  );
}

interface PostCardProps {
  publication: Publication;
}

export default function PostCard({ publication }: PostCardProps) {
  return (
    <article className="rounded-[20px] border border-line bg-card px-[22px] py-5 shadow-[0_4px_16px_-12px_rgba(120,90,60,0.5)]">
      <div className="mb-[14px] flex items-center gap-3">
        <Avatar publication={publication} />
        <div className="flex-1">
          <div className="font-fredoka font-semibold text-[16.5px] text-ink">{publication.childName}</div>
          <div className="text-[12.5px] text-muted">{publication.time} · {publication.postedBy}</div>
        </div>
        <TypeBadge type={publication.type} />
      </div>
      <div className="mb-[10px] text-[12.5px] text-muted">Para: {publication.recipients}</div>
      <p className="text-[15.5px] leading-[1.55] text-ink">{publication.text}</p>
      {publication.type === "activity" && publication.photoCaption && (
        <PhotoPlaceholder caption={publication.photoCaption} />
      )}
      <div className="mt-4 flex items-center gap-[18px] border-t border-line pt-[14px]">
        <span className="flex items-center gap-[7px] font-bold text-[14px] text-accent">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
          {publication.likes}
        </span>
        <Link
          href="/detalle-publicacion"
          className="flex items-center gap-[7px] font-bold text-[14px] text-muted"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z"/></svg>
          {publication.comments}
        </Link>
        <span className="flex-1" />
        {publication.canEdit && (
          <Link href="/crear-publicacion" className="font-extrabold text-[14px] text-accent">
            Editar
          </Link>
        )}
      </div>
    </article>
  );
}
