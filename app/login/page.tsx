import Link from "next/link";
import BrandMark from "@/components/BrandMark";
import PasswordInput from "@/components/PasswordInput";
import TextInput from "@/components/TextInput";

const inputLabelClasses = "block text-[12px] font-bold tracking-[0.7px] text-muted";

export default function LoginPage() {
  return (
    <div className="bg-canvas-warm md:grid md:grid-cols-[1.05fr_1fr]">
      {/* Branding panel (mockup, hidden below 768px) */}
      <div className="relative hidden overflow-hidden bg-[linear-gradient(155deg,var(--color-accent-soft),var(--color-accent-warm))] px-[60px] py-14 text-white md:flex md:min-h-dvh md:flex-col md:justify-between">
        <div className="absolute -right-[120px] -top-[140px] h-[420px] w-[420px] rounded-full bg-white/12" aria-hidden="true" />
        <div className="absolute -bottom-[110px] -left-[80px] h-[300px] w-[300px] rounded-full bg-white/10" aria-hidden="true" />

        <div className="relative flex items-center gap-[13px]">
          <div className="flex h-[46px] w-[46px] flex-none items-center justify-center rounded-[14px] bg-white/20">
            <BrandMark size={26} />
          </div>
          <span className="font-fredoka text-[21px] font-semibold tracking-[0.5px]">OpenDayCare</span>
        </div>

        <div className="relative">
          <h1 className="mb-[18px] font-fredoka text-[42px] font-semibold leading-[1.12] text-white">
            El día de cada niño,
            <br />
            compartido con su familia.
          </h1>
          <p className="max-w-[430px] text-[17px] leading-[1.6] text-white/90">
            Publicá momentos, gestioná las salas y mantené a las familias cerca, desde un solo lugar.
          </p>
        </div>

        <div className="relative text-[14px] text-white/90">🌿 Guardería Sala Soles</div>
      </div>

      {/* Form column */}
      <div className="flex min-h-dvh items-center justify-center px-6 py-10 md:min-h-0">
        <div className="w-full max-w-[392px]">
          <h2 className="mb-1.5 font-fredoka text-[30px] font-semibold text-ink">Iniciar sesión</h2>
          <p className="mb-7 text-[15px] text-muted">Ingresá para ver el día de hoy.</p>

          <label htmlFor="login-email" className={inputLabelClasses}>
            EMAIL
          </label>
          <TextInput id="login-email" type="email" defaultValue="caro@opendaycare.com" className="mb-[18px]" />

          <label htmlFor="login-password" className={inputLabelClasses}>
            CONTRASEÑA
          </label>
          <PasswordInput placeholder="••••••••" className="mb-2.5" />

          <div className="mb-5 text-right">
            <button
              type="button"
              disabled
              className="text-[13.5px] font-bold text-accent"
              title="Disponible próximamente"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <Link
            href="/"
            className="block rounded-[15px] bg-[linear-gradient(180deg,var(--color-accent-soft),var(--color-accent-warm))] py-[15px] text-center font-extrabold text-[16px] text-white shadow-[0_10px_22px_-8px_rgba(238,129,100,0.7)]"
          >
            Iniciar sesión
          </Link>

          <p className="mt-6 text-center text-[14.5px] text-muted">
            ¿Te invitó la guardería?{" "}
            <Link href="/activate" className="font-extrabold text-accent">
              Activá tu cuenta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
