import { useState, type ReactNode } from "react";
import { BookOpen, Download, FileText, FolderOpen, Printer } from "lucide-react";
import { PageTitle, Panel } from "@/components/dlims/bits";

type DocId = "medical" | "signs";

export function Downloads() {
  const [doc, setDoc] = useState<DocId | null>(null);

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <PageTitle title="Downloads" />
      {doc ? (
        <Document doc={doc} onBack={() => setDoc(null)} />
      ) : (
        <Panel className="space-y-4">
          <DocRow
            icon={<FileText className="size-6" />}
            tint="bg-leaf-soft text-leaf"
            title="Medical form"
            body="Blank form for a driving licence application"
            onClick={() => setDoc("medical")}
          />
          <DocRow
            icon={<BookOpen className="size-6" />}
            tint="bg-navy/10 text-navy"
            title="Traffic signs guide"
            body="Short study sheet for the learner test"
            onClick={() => setDoc("signs")}
          />
          <div className="border-t border-line pt-6 text-center">
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-paper text-navy">
              <FolderOpen className="size-7" />
            </span>
            <h2 className="mt-3 font-black">Forms on this device</h2>
            <p className="mt-1 text-sm text-muted">Fill the medical form, then print or save it from the browser.</p>
          </div>
        </Panel>
      )}
    </div>
  );
}

function DocRow({
  icon,
  tint,
  title,
  body,
  onClick,
}: {
  icon: ReactNode;
  tint: string;
  title: string;
  body: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-4 rounded-2xl border border-line bg-paper p-4 text-left transition hover:border-leaf"
    >
      <span className={`grid size-14 shrink-0 place-items-center rounded-xl ${tint}`}>{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block font-black">{title}</span>
        <span className="mt-0.5 block text-sm text-muted">{body}</span>
      </span>
      <span className="grid size-10 place-items-center rounded-full bg-leaf-soft text-leaf">
        <Download className="size-4" />
      </span>
    </button>
  );
}

function Document({ doc, onBack }: { doc: DocId; onBack: () => void }) {
  return (
    <div>
      <div className="no-print mb-4 flex gap-2">
        <button type="button" onClick={onBack} className="min-h-11 rounded-xl border border-line bg-card px-4 text-sm font-bold">
          Back
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-ink px-4 text-sm font-bold text-on-navy"
        >
          <Printer className="size-4" />
          Print
        </button>
      </div>
      <article className="rounded-3xl border border-line bg-card p-6 shadow-sm">
        {doc === "medical" ? <MedicalForm /> : <SignsGuide />}
      </article>
    </div>
  );
}

function MedicalForm() {
  return (
    <div className="space-y-4 text-sm">
      <header>
        <p className="text-xs font-black tracking-widest text-leaf uppercase">DLIMS sample</p>
        <h2 className="text-xl font-black">Medical certificate</h2>
        <p className="mt-1 text-muted">For a driving licence application. A registered doctor completes the lower half.</p>
      </header>
      <div className="grid gap-3 sm:grid-cols-2">
        <Blank label="Applicant name" />
        <Blank label="Father / husband name" />
        <Blank label="CNIC" />
        <Blank label="Age" />
        <Blank label="Address" wide />
      </div>
      <h3 className="pt-2 font-black">Doctor's findings</h3>
      <ul className="space-y-2">
        {["Vision", "Colour vision", "Hearing", "Limbs and joints", "Any condition affecting driving"].map(
          (item) => (
            <li key={item} className="grid grid-cols-[1fr_auto_auto] items-center gap-2 border-b border-line py-2">
              <span className="font-semibold">{item}</span>
              <Choice label="Fit" />
              <Choice label="Unfit" />
            </li>
          ),
        )}
      </ul>
      <div className="grid gap-3 sm:grid-cols-2">
        <Blank label="Doctor name" />
        <Blank label="Registration number" />
        <Blank label="Clinic / hospital" />
        <Blank label="Date" />
      </div>
      <p className="pt-6 text-xs text-muted">Signature and stamp</p>
      <div className="h-16 border-b border-ink" />
    </div>
  );
}

function Blank({ label, wide = false }: { label: string; wide?: boolean }) {
  return (
    <label className={`block ${wide ? "sm:col-span-2" : ""}`}>
      <span className="text-xs font-bold text-muted">{label}</span>
      <input className="mt-1 w-full border-b border-line bg-transparent py-2 outline-none" />
    </label>
  );
}

function Choice({ label }: { label: string }) {
  return (
    <label className="flex items-center gap-1 text-xs font-bold">
      <input type="checkbox" className="size-4 accent-leaf" />
      {label}
    </label>
  );
}

const SIGNS: { name: string; means: string; mark: ReactNode }[] = [
  {
    name: "Stop",
    means: "Come to a full stop. Move only when the way is clear.",
    mark: (
      <svg viewBox="0 0 64 64" className="size-14 text-danger">
        <polygon points="32,4 54,14 60,36 46,58 18,58 4,36 10,14" fill="currentColor" />
        <text x="32" y="38" textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--color-on-leaf)">
          STOP
        </text>
      </svg>
    ),
  },
  {
    name: "Give way",
    means: "Yield to traffic already on the road you are joining.",
    mark: (
      <svg viewBox="0 0 64 64" className="size-14 text-danger">
        <polygon points="32,6 58,56 6,56" fill="var(--color-card)" stroke="currentColor" strokeWidth="4" />
      </svg>
    ),
  },
  {
    name: "Speed limit",
    means: "Do not go faster than the number in the circle.",
    mark: (
      <svg viewBox="0 0 64 64" className="size-14 text-danger">
        <circle cx="32" cy="32" r="24" fill="var(--color-card)" stroke="currentColor" strokeWidth="4" />
        <text x="32" y="38" textAnchor="middle" fontSize="16" fontWeight="700" fill="var(--color-ink)">
          50
        </text>
      </svg>
    ),
  },
  {
    name: "No entry",
    means: "Do not enter this road from this direction.",
    mark: (
      <svg viewBox="0 0 64 64" className="size-14 text-danger">
        <circle cx="32" cy="32" r="24" fill="currentColor" />
        <rect x="16" y="28" width="32" height="8" fill="var(--color-on-leaf)" />
      </svg>
    ),
  },
  {
    name: "No parking",
    means: "You may stop briefly, but you may not park.",
    mark: (
      <svg viewBox="0 0 64 64" className="size-14 text-navy">
        <circle cx="32" cy="32" r="24" fill="none" stroke="currentColor" strokeWidth="4" />
        <path d="M18 46 L46 18" stroke="var(--color-danger)" strokeWidth="4" />
        <text x="32" y="38" textAnchor="middle" fontSize="16" fontWeight="700" fill="currentColor">
          P
        </text>
      </svg>
    ),
  },
  {
    name: "Pedestrian crossing",
    means: "People may be crossing. Slow down and be ready to stop.",
    mark: (
      <svg viewBox="0 0 64 64" className="size-14 text-navy">
        <rect x="8" y="8" width="48" height="48" rx="4" fill="var(--color-gold)" />
        <circle cx="32" cy="22" r="5" fill="currentColor" />
        <path d="M32 28 v10 M26 48 l6-10 6 10 M22 34 h20" stroke="currentColor" strokeWidth="3" fill="none" />
      </svg>
    ),
  },
];

function SignsGuide() {
  return (
    <div>
      <p className="text-xs font-black tracking-widest text-leaf uppercase">Study sheet</p>
      <h2 className="text-xl font-black">Traffic signs</h2>
      <p className="mt-1 text-sm text-muted">Six signs that show up on the learner test. Shapes and colours carry the meaning.</p>
      <ul className="mt-5 space-y-4">
        {SIGNS.map((sign) => (
          <li key={sign.name} className="flex items-center gap-4 border-b border-line pb-4">
            <span className="grid size-16 shrink-0 place-items-center">{sign.mark}</span>
            <span>
              <span className="block font-black">{sign.name}</span>
              <span className="mt-1 block text-sm leading-relaxed text-muted">{sign.means}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
