"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLink {
  href: string;
  label: string;
  icon: ReactNode;
}

const navigationLinks: NavLink[] = [
  {
    href: "/",
    label: "Feed",
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>
    ),
  },
  {
    href: "/ninos",
    label: "Niños",
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="7" r="3"/><circle cx="17" cy="9" r="2.4"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 20a5 5 0 0 1 5.5-4.9"/></svg>
    ),
  },
  {
    href: "/avisos",
    label: "Avisos",
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0"/></svg>
    ),
  },
  {
    href: "/mi-cuenta",
    label: "Mi cuenta",
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    ),
  },
];

function BrandLink({ onClick, className }: { onClick?: () => void; className?: string }) {
  return (
    <Link href="/" onClick={onClick} className={`flex items-center gap-[11px] ${className ?? ""}`}>
      <div className="w-[38px] h-[38px] flex-none rounded-[12px] bg-[linear-gradient(155deg,#F8C3A8,#F2937A)] flex items-center justify-center">
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
      </div>
      <div>
        <div className="font-fredoka font-semibold text-[17px] leading-none text-[#3F362E]">OpenDayCare</div>
        <div className="mt-[2px] text-[11.5px] text-[#A89A8B]">Sala Soles</div>
      </div>
    </Link>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      <BrandLink onClick={onNavigate} className="px-2 pt-1 pb-[22px]" />
      <Link
        href="/crear-publicacion"
        onClick={onNavigate}
        className="flex w-full items-center justify-center gap-2 rounded-[14px] bg-[linear-gradient(180deg,#F4977E,#EE8164)] py-3 font-extrabold text-[14.5px] text-white shadow-[0_8px_18px_-8px_rgba(238,129,100,0.75)] mb-[18px]"
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
        Nueva publicación
      </Link>
      <nav className="flex flex-1 flex-col gap-1">
        {navigationLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-[12px] px-3 py-[11px] text-[14.5px] ${
                isActive
                  ? "bg-[#FBE3D8] font-extrabold text-[#D9583C]"
                  : "font-semibold text-[#6E6359]"
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-[10px] border-t border-[#ECE0D0] pt-[14px]">
        <div className="flex items-center gap-[11px] px-2 py-1.5">
          <div className="flex-none flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#F2937A] font-fredoka font-semibold text-[16px] text-white">C</div>
          <div className="min-w-0 flex-1">
            <div className="font-extrabold text-[14px] text-[#3F362E]">Caro Giménez</div>
            <div className="text-[12px] text-[#A89A8B]">Maestra · Soles</div>
          </div>
          <Link
            href="/login"
            onClick={onNavigate}
            title="Cerrar sesión"
            aria-label="Cerrar sesión"
            className="flex-none flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#F6ECDF] text-[#94887B]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
          </Link>
        </div>
      </div>
    </>
  );
}

function MobileMenuButton({ onClick, label, icon }: { onClick: () => void; label: string; icon: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#F6ECDF] text-[#6E6359]"
    >
      {icon}
    </button>
  );
}

export default function Sidebar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <>
      {/* Desktop sidebar (identical to the mockup) */}
      <aside className="sticky top-0 hidden h-screen w-[248px] flex-none flex-col bg-[#FFFDF9] px-4 py-6 md:flex border-r border-[#ECE0D0]">
        <SidebarContent />
      </aside>

      {/* Mobile header */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-[#ECE0D0] bg-[#FFFDF9] px-4 md:hidden">
        <BrandLink />
        <MobileMenuButton
          onClick={() => setIsDrawerOpen(true)}
          label="Abrir menú"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>}
        />
      </header>

      {/* Mobile drawer with overlay */}
      <div className={`fixed inset-0 z-50 md:hidden ${isDrawerOpen ? "visible" : "invisible"}`}>
        <div
          onClick={closeDrawer}
          className={`absolute inset-0 bg-black/40 transition-opacity duration-200 ${isDrawerOpen ? "opacity-100" : "opacity-0"}`}
        />
        <aside
          className={`absolute left-0 top-0 flex h-full w-[280px] max-w-[85vw] flex-col bg-[#FFFDF9] px-4 py-6 border-r border-[#ECE0D0] transition-transform duration-200 ${
            isDrawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="absolute right-4 top-[26px]">
            <MobileMenuButton
              onClick={closeDrawer}
              label="Cerrar menú"
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>}
            />
          </div>
          <SidebarContent onNavigate={closeDrawer} />
        </aside>
      </div>
    </>
  );
}
