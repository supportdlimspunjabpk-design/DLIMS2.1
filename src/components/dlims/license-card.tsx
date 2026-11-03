import { Qr } from "@/components/dlims/qr";

function CatIcon({ kind }: { kind: string }) {
  const common = "h-7 w-10";
  if (kind === "bike") {
    return (
      <svg viewBox="0 0 64 36" className={common} aria-hidden="true">
        <circle cx="14" cy="24" r="8" fill="none" stroke="#1d4e9f" strokeWidth="3" />
        <circle cx="50" cy="24" r="8" fill="none" stroke="#1d4e9f" strokeWidth="3" />
        <path d="M14 24h10l6-10h12l6 10M28 14l6 10M36 8h8" fill="none" stroke="#1d4e9f" strokeWidth="3" strokeLinejoin="round" />
      </svg>
    );
  }
  if (kind === "car" || kind === "psv") {
    return (
      <svg viewBox="0 0 64 32" className={common} aria-hidden="true">
        <path d="M8 20h48l-4-8H22L14 20H8v6h6a5 5 0 0 0 10 0h16a5 5 0 0 0 10 0h6v-6" fill="#1d4e9f" />
        <circle cx="20" cy="24" r="3" fill="#fff" />
        <circle cx="46" cy="24" r="3" fill="#fff" />
      </svg>
    );
  }
  if (kind === "ltv") {
    return (
      <svg viewBox="0 0 64 36" className={common} aria-hidden="true">
        <path d="M10 22V12h16l8 8h20v8H10z" fill="#1d4e9f" />
        <circle cx="20" cy="28" r="5" fill="#1d4e9f" />
        <circle cx="48" cy="28" r="5" fill="#1d4e9f" />
        <circle cx="20" cy="28" r="2" fill="#fff" />
        <circle cx="48" cy="28" r="2" fill="#fff" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 64 32" className={common} aria-hidden="true">
      <rect x="8" y="10" width="40" height="14" rx="2" fill="#1d4e9f" />
      <circle cx="18" cy="26" r="3" fill="#1d4e9f" />
      <circle cx="42" cy="26" r="3" fill="#1d4e9f" />
    </svg>
  );
}

export function LicenseCard({
  photo,
  licenseNo,
  name,
  father,
  dob,
  cnic,
  issueDate,
  validTo,
  address,
  vehicles,
}: {
  photo?: string;
  licenseNo?: string;
  name?: string;
  father?: string;
  dob?: string;
  cnic?: string;
  issueDate?: string;
  validTo?: string;
  address?: string;
  vehicles?: string;
}) {
  const allowed = (vehicles || "").toUpperCase();
  const on = (label: string) => allowed.includes(label);
  const cats = [
    { name: "BIKE", icon: "bike", on: on("BIKE") || on("M/CYCLE") || on("MOTORCYCLE") },
    { name: "CAR", icon: "car", on: on("CAR") },
    { name: "LTV", icon: "ltv", on: on("LTV") },
    { name: "HTV", icon: "htv", on: on("HTV") },
    { name: "PSV", icon: "psv", on: on("PSV") },
    { name: "TRACTOR", icon: "tractor", on: on("TRACTOR") },
    { name: "RIKSHAW", icon: "rik", on: on("RIKSHAW") || on("RICKSHAW") },
    { name: "HEAVY MACHINERY", icon: "heavy", on: on("HEAVY") },
  ];

  return (
    <article className="relative mx-auto w-full max-w-sm overflow-hidden rounded-[28px] border border-[#e6eef8] bg-white shadow-[0_16px_40px_rgba(20,40,80,.12)]">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(circle at 18% 12%, transparent 0 40px, rgba(180,205,230,.35) 41px), repeating-linear-gradient(115deg, transparent 0 14px, rgba(190,210,230,.35) 15px 16px)",
        }}
      />
      <div className="relative px-4 pt-4 pb-0">
        <div className="flex items-start justify-between gap-2">
          <img src="/dlims/emblem-cut.png" alt="" className="size-14 object-contain" />
          <div className="pt-1 text-center">
            <p className="text-lg font-black tracking-wide text-[#1a3f8b]">E-DRIVING LICENSE</p>
            <p className="text-xs font-bold tracking-wide text-[#1a3f8b]">TRAFFIC POLICE PUNJAB</p>
          </div>
          <img src="/dlims/tp-badge-cut.png" alt="" className="size-14 object-contain" />
        </div>
        <div className="mx-auto mt-3 grid size-36 place-items-center overflow-hidden rounded-full border-4 border-[#7eb0d4] bg-[#d9dde3]">
          {photo ? (
            <img src={photo} alt="" className="size-full object-cover" />
          ) : (
            <svg viewBox="0 0 64 64" className="size-24 text-[#9aa0a8]" aria-hidden="true">
              <circle cx="32" cy="22" r="10" fill="currentColor" />
              <path d="M12 56c2-14 10-20 20-20s18 6 20 20" fill="currentColor" />
            </svg>
          )}
        </div>
        <p className="mt-3 text-center text-xl font-black tracking-wide text-[#1a3f8b]">{licenseNo || "—"}</p>
        <p className="text-center text-2xl font-black uppercase leading-tight text-ink">{name || "—"}</p>
        <p className="text-center text-sm font-black uppercase">So/Do/Wo : {father || "—"}</p>
        <div className="mt-4 grid grid-cols-2 gap-3 text-[#1a3f8b]">
          <p>
            <span className="block text-[10px] font-bold tracking-wide">DATE OF BIRTH</span>
            <span className="text-lg font-black text-ink">{prettyDate(dob)}</span>
          </p>
          <p>
            <span className="block text-[10px] font-bold tracking-wide">CNIC</span>
            <span className="text-lg font-black text-ink">{prettyCnic(cnic)}</span>
          </p>
          <p>
            <span className="block text-[10px] font-bold tracking-wide">ISSUE DATE</span>
            <span className="text-lg font-black text-ink">{prettyDate(issueDate)}</span>
          </p>
          <p>
            <span className="block text-[10px] font-bold tracking-wide">VALID TILL</span>
            <span className="text-lg font-black text-ink">{prettyDate(validTo)}</span>
          </p>
        </div>
        <p className="mt-3 text-[#1a3f8b]">
          <span className="block text-[10px] font-bold tracking-wide">ADDRESS</span>
          <span className="text-base font-black uppercase text-ink">{address || "—"}</span>
        </p>
        <div className="mt-4 grid grid-cols-4 border border-[#d7e0ea] bg-white/80 text-center text-[10px] font-bold text-ink">
          {cats.map((cat) => (
            <div key={cat.name} className="relative border border-[#e6eef5] px-1 py-2">
              <div className={`mx-auto grid h-8 place-items-center ${cat.on ? "" : "opacity-40"}`}>
                <CatIcon kind={cat.icon} />
              </div>
              {!cat.on ? <span className="absolute top-2 right-2 left-2 text-xl leading-none text-[#1a3f8b]">✕</span> : null}
              <p className="mt-1 leading-tight">{cat.name}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-end justify-between gap-3 pb-3">
          <div className="w-24">
            <Qr value={licenseNo || cnic || "DLIMS"} caption="License QR" />
          </div>
          <div className="text-right text-[#1a3f8b]">
            <p className="font-serif text-3xl italic leading-none">Signature</p>
            <p className="text-[11px] font-semibold">Licensing Authority</p>
            <p className="text-[11px] font-semibold">Punjab</p>
          </div>
        </div>
      </div>
      <p className="relative bg-[#163a86] py-2.5 text-center text-sm font-bold text-white">This is a valid Electronic Driving License</p>
    </article>
  );
}

function prettyDate(value?: string) {
  if (!value) return "—";
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return match ? `${match[3]}-${match[2]}-${match[1]}` : value;
}

function prettyCnic(value?: string) {
  const digits = (value || "").replace(/\D/g, "");
  if (digits.length !== 13) return value || "—";
  return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
}
