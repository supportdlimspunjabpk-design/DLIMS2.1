import { useEffect, useState } from "react";
import { ELicense } from "@/components/dlims/elicense";
import { Track } from "@/components/dlims/track";
import { Verify } from "@/components/dlims/verify";
import { DuplicateForm } from "@/components/dlims/duplicate";
import { About, Downloads, FaqPage, Fees, Footer, Home, How } from "@/components/dlims/site-pages";
import { ApplyForm, Services, type ApplyKind } from "@/components/dlims/apply";
import { LoginForm, SignUpForm } from "@/components/dlims/auth";
import { AdminDesk } from "@/components/dlims/admin";
import { Offices } from "@/components/dlims/reference";
import { useSession } from "@/components/dlims/store";

export type TabId =
  | "home"
  | "about"
  | "how"
  | "faq"
  | "downloads"
  | "offices"
  | "fees"
  | "elicense"
  | "track"
  | "verify"
  | "duplicate"
  | "login"
  | "signup"
  | "admin"
  | "services"
  | "apply"
  | "dastak"
  | "police";

const TEXT: { id: TabId; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "about", label: "About us" },
  { id: "how", label: "How it works" },
  { id: "faq", label: "FAQ" },
  { id: "downloads", label: "Downloads" },
  { id: "offices", label: "Licensing offices" },
  { id: "fees", label: "Fee Structure" },
];

const PILLS: { id: TabId; label: string }[] = [
  { id: "elicense", label: "e-License" },
  { id: "track", label: "Track Application" },
  { id: "verify", label: "Verify License" },
];

export function DlimsApp() {
  const [tab, setTab] = useState<TabId>("home");
  const [menu, setMenu] = useState(false);
  const [applyKind, setApplyKind] = useState<ApplyKind>("learner");
  const session = useSession();

  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menu]);

  function go(next: TabId | "apply-learner" | "apply-regular" | "apply-international") {
    if (next === "apply-learner" || next === "apply-regular" || next === "apply-international") {
      setApplyKind(next.slice(6) as ApplyKind);
      setTab("apply");
    } else setTab(next);
    setMenu(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const form = tab === "track" || tab === "elicense" || tab === "verify" || tab === "duplicate" || tab === "login" || tab === "signup" || tab === "admin" || tab === "apply" || tab === "services";
  const home = tab === "home";

  return (
    <div className="relative min-h-dvh w-full bg-[#f4f6f8]">
      {home ? null : (
      <div className="sticky top-0 z-30">
        <div className="flex h-[76px] items-center justify-between bg-gradient-to-r from-[#8fce45] via-[#1f8f3c] to-[#157a34] px-4 text-white md:h-[88px] md:px-10">
          <p className="text-[11px] leading-tight font-bold md:text-sm">
            All DLIMS
            <br />
            services are
            <br />
            Powered by
          </p>
          <img src="/dlims/logo-dastak-banner.png" alt="Dastak" className="h-12 object-contain md:h-16" />
          <p className="text-right text-[11px] leading-tight font-black md:text-sm">
            ONE WINDOW
            <br />
            FOR ALL
            <br />
            SERVICES
          </p>
        </div>
        <div className="banner-edge" />
        <div className="border-b border-[#e8ece9] bg-white">
          <div className="mx-auto flex w-full items-end gap-3 px-3 pt-2 pb-3 md:px-8">
            <button type="button" onClick={() => go("home")} className="flex shrink-0 items-center gap-2 self-center">
              <img src="/dlims/logo-dlims.png" alt="" className="h-12 w-12 object-contain md:h-14 md:w-14" />
              <span>
                <span className="block text-lg leading-none font-black tracking-tight text-[#1b7a3d] md:text-2xl">DLIMS</span>
                <span className="block max-w-[92px] text-[7px] leading-tight font-semibold text-[#2e8b4f] md:max-w-none md:text-[10px]">
                  Driving License Information <span className="text-[#e67e22]">Management System</span>
                </span>
              </span>
            </button>
            <span className="h-10 w-px shrink-0 self-center bg-[#c5cfc8]" />
            <img src="/dlims/logo-dastak.png" alt="Dastak" className="h-11 shrink-0 self-center object-contain md:h-14" />
            <p className="hidden self-center text-[11px] leading-tight font-extrabold text-[#e39b12] sm:block md:text-sm">
              ONE WINDOW FOR ALL
              <br />
              GOVERNMENT SERVICES
            </p>
            <nav className="ml-auto hidden items-center gap-3 self-center text-xs font-bold lg:flex">
              {TEXT.map((link) => (
                <button key={link.id} type="button" onClick={() => go(link.id)} className={tab === link.id ? "text-[#e0a020]" : "text-ink"}>
                  {link.label}
                </button>
              ))}
              {PILLS.map((link) => (
                <button key={link.id} type="button" onClick={() => go(link.id)} className={`rounded-full px-3 py-1 ${tab === link.id ? "bg-[#f5a623] text-white" : "border border-line bg-white"}`}>
                  {link.label}
                </button>
              ))}
            </nav>
            <button type="button" className="mb-0.5 ml-auto grid size-14 shrink-0 place-items-center rounded-2xl border border-[#d5d5d5] bg-white shadow-sm lg:ml-3" aria-label="Open menu" onClick={() => setMenu(true)}>
              <span className="flex w-6 flex-col gap-[5px]" aria-hidden="true">
                <span className="h-[2.5px] rounded-full bg-[#1a1a1a]" />
                <span className="h-[2.5px] rounded-full bg-[#1a1a1a]" />
                <span className="h-[2.5px] rounded-full bg-[#1a1a1a]" />
              </span>
            </button>
          </div>
        </div>
      </div>
      )}

      <main className={home ? "" : "w-full px-4 py-8 md:px-8"}>
        {tab === "home" ? <Home onOpen={(id) => go(id)} onMenu={() => setMenu(true)} /> : null}
        {tab === "services" ? <Services onApply={(kind) => go(`apply-${kind}`)} onOpen={(id) => go(id)} /> : null}
        {tab === "apply" ? <ApplyForm kind={applyKind} /> : null}
        {tab === "about" ? <About /> : null}
        {tab === "how" ? <How /> : null}
        {tab === "faq" ? <FaqPage /> : null}
        {tab === "downloads" ? <Downloads /> : null}
        {tab === "offices" ? <Offices /> : null}
        {tab === "fees" ? <Fees onDuplicate={() => go("duplicate")} /> : null}
        {tab === "elicense" ? <ELicense /> : null}
        {tab === "track" ? <Track /> : null}
        {tab === "verify" ? <Verify /> : null}
        {tab === "duplicate" ? <DuplicateForm onBack={() => go("fees")} /> : null}
        {tab === "login" ? <LoginForm onAdmin={() => go("admin")} /> : null}
        {tab === "signup" ? <SignUpForm /> : null}
        {tab === "admin" ? <AdminDesk onLeave={() => go("home")} /> : null}
      </main>

      {form || home ? null : <Footer />}

      {menu ? (
        <div className="fixed inset-0 z-40">
          <button type="button" aria-label="Close menu" className="absolute inset-0 bg-ink/40" onClick={() => setMenu(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col bg-[#f7f8fa] px-5 py-8">
            {TEXT.map((link) => (
              <button key={link.id} type="button" onClick={() => go(link.id)} className="min-h-11 text-left text-base font-medium">
                {link.label}
              </button>
            ))}
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={() => go("elicense")} className="rounded-full bg-pill px-4 py-2 text-sm font-semibold">
                e-License
              </button>
              <button type="button" onClick={() => go("track")} className="rounded-full bg-pill px-4 py-2 text-sm font-semibold">
                Track Application
              </button>
            </div>
            <button type="button" onClick={() => go("verify")} className="mt-3 w-fit rounded-full bg-[#f5c400] px-5 py-2 text-sm font-bold text-white">
              Verify License
            </button>
            <div className="mt-6 space-y-2 border-t border-line pt-4">
              <button type="button" onClick={() => go("login")} className="block min-h-11 text-left text-base font-bold">
                {session ? session.name : "Login"}
              </button>
              <button type="button" onClick={() => go("signup")} className="block min-h-11 text-left text-base font-bold">
                Sign up
              </button>
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
