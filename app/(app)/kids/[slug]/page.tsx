import Link from "next/link";
import { notFound } from "next/navigation";
import { kids } from "@/components/kids-data";
import LinkedParentsCard from "@/components/LinkedParentsCard";

export async function generateStaticParams() {
  return kids.map((kid) => ({ slug: kid.slug }));
}

// Unknown slugs 404 via notFound() below: `dynamicParams` route-segment config
// is not compatible with `nextConfig.cacheComponents`.

// The entire page body depends on the slug, so there is no shared shell worth
// prefetching; this opts the segment out of the instant-navigation check.
export const instant = false;

export default async function KidProfilePage({ params }: PageProps<"/kids/[slug]">) {
  const { slug } = await params;
  const kid = kids.find((candidate) => candidate.slug === slug);
  if (!kid) notFound();

  return (
    <div className="mx-auto w-full max-w-205 px-5 pt-8.5 pb-20 md:px-10">
      <Link
        href="/kids"
        className="flex items-center gap-1.75 text-muted font-bold text-[14px] mb-5"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        Volver a Niños
      </Link>

      <div className="flex gap-6.5 items-start flex-wrap">
        <div className="flex-1 min-w-[300px] flex flex-col gap-4.5">
          <div className="flex items-center gap-4.5">
            <div
              className="flex-none flex h-21 w-21 items-center justify-center rounded-full font-fredoka font-semibold text-[34px]"
              style={{ backgroundColor: kid.avatar.background, color: kid.avatar.text }}
            >
              {kid.firstName[0]}
            </div>
            <div className="flex-1">
              <h1 className="font-fredoka font-semibold text-[28px] text-ink">{kid.firstName} {kid.lastName}</h1>
              <p className="mt-0.75 text-[15px] text-muted">{kid.ageYears} años · Sala {kid.room}</p>
            </div>
            <button
              type="button"
              disabled
              className="flex-none border-[1.5px] border-line bg-card text-muted font-bold text-[14px] px-4 py-[9px] rounded-xl cursor-default"
            >
              Editar
            </button>
          </div>

          {kid.allergies.length > 0 && (
            <div className="flex gap-3.5 bg-accent/15 rounded-2xl py-4 px-4.5">
              <div className="flex-none flex h-10 w-10 items-center justify-center rounded-[11px] bg-accent">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/></svg>
              </div>
              <div>
                <div className="font-extrabold text-accent text-[15px] mb-0.5">Alergias y notas</div>
                <div className="text-accent text-[14.5px] leading-[1.5]">{kid.allergyNote ?? kid.allergies.join(", ")}</div>
              </div>
            </div>
          )}

          <div className="bg-card border border-line rounded-2xl overflow-hidden">
            <div className="flex justify-between px-4.5 py-[15px] border-b border-line">
              <span className="text-muted text-[14.5px]">Fecha de nacimiento</span>
              <span className="font-extrabold text-ink text-[14.5px]">{kid.birthDate}</span>
            </div>
            <div className="flex justify-between px-4.5 py-[15px] border-b border-line">
              <span className="text-muted text-[14.5px]">Sala</span>
              <span className="font-extrabold text-ink text-[14.5px]">{kid.room}</span>
            </div>
            <div className="flex justify-between px-4.5 py-[15px]">
              <span className="text-muted text-[14.5px]">Ingreso</span>
              <span className="font-extrabold text-ink text-[14.5px]">{kid.entryDate}</span>
            </div>
          </div>
        </div>

        <div className="w-[300px] flex-none flex flex-col gap-3.5">
          <button
            type="button"
            disabled
            className="flex w-full items-center justify-center gap-2.25 py-[13px] rounded-[14px] bg-ink text-white font-extrabold text-[15px] cursor-default"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
            Resumen del día
          </button>

          <LinkedParentsCard kid={kid} />
        </div>
      </div>
    </div>
  );
}
