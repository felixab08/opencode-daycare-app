import KidsGrid from "@/components/KidsGrid";
import { kids } from "@/components/kids-data";

export default function KidsPage() {
  return (
    <div className="mx-auto w-full max-w-220 px-5 pt-8.5 pb-20 md:px-10">
      <div className="flex items-end justify-between gap-4 mb-5.5">
        <div>
          <div className="font-extrabold text-[12.5px] tracking-[0.8px] text-accent mb-1">GESTIÓN</div>
          <h1 className="font-fredoka font-semibold text-[30px] text-ink">Niños</h1>
        </div>
        <button
          type="button"
          id="add-kids-button"
          disabled
          className="flex items-center gap-2 px-[18px] py-[11px] rounded-[14px] bg-[linear-gradient(180deg,var(--color-accent-soft),var(--color-accent-warm))] font-extrabold text-[14.5px] text-white cursor-default"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          Agregar niño
        </button>
      </div>

      <KidsGrid kids={kids}>
        <div className="flex items-center gap-3 mb-3.5">
          <span className="font-extrabold text-[12.5px] tracking-[0.8px] text-ink">SALA SOLES</span>
          <span className="text-[13px] text-muted">{kids.length} niños</span>
          <span className="h-px flex-1 bg-line" />
        </div>
      </KidsGrid>
    </div>
  );
}
