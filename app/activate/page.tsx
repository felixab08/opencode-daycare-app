import Link from "next/link";
import ActivateForm from "@/components/ActivateForm";
import BrandMark from "@/components/BrandMark";
import { kids } from "@/components/kids-data";

export default function ActivatePage() {
  // The invitation screen is always Mateo's (SPEC 04), read from the kids data (DRI)
  const invitedKid = kids.find((kid) => kid.slug === "mateo-fernandez");
  if (!invitedKid) {
    throw new Error("Mateo Fernandez is missing from kids-data");
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-canvas-warm px-6 py-10">
      <div className="w-full max-w-[440px]">
        <div className="mb-[22px] flex h-[58px] w-[58px] items-center justify-center rounded-[18px] bg-[linear-gradient(155deg,var(--color-allergy-warm),var(--color-accent-soft))] shadow-[0_12px_26px_-10px_rgba(238,129,100,0.65)]">
          <BrandMark size={30} />
        </div>

        <h1 className="mb-2 font-fredoka text-[32px] font-semibold leading-[1.15] text-ink">
          Bienvenida a OpenDayCare
        </h1>
        <p className="mb-[26px] text-[15.5px] leading-[1.55] text-muted">
          Te invitaron a seguir el día de tu hijo. Creá tu contraseña para activar la cuenta.
        </p>

        <div className="mb-[22px] flex items-center gap-3.5 rounded-[16px] border-[1.5px] border-line bg-card px-4 py-3.5">
          <div
            style={{ backgroundColor: invitedKid.avatar.background, color: invitedKid.avatar.text }}
            className="flex h-11 w-11 flex-none items-center justify-center rounded-full font-fredoka font-semibold text-[19px]"
          >
            {invitedKid.firstName[0]}
          </div>
          <div>
            <div className="text-[13px] text-muted">Te invitaron a seguir a</div>
            <div className="font-fredoka font-semibold text-[17px] text-ink">
              {invitedKid.firstName} · Sala {invitedKid.room}
            </div>
          </div>
        </div>

        <ActivateForm />

        <p className="mt-[22px] text-center text-[14.5px] text-muted">
          ¿Ya tenés cuenta?{" "}
          <Link href="/login" className="font-extrabold text-accent">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
