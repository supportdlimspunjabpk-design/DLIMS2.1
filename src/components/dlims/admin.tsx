import { useEffect, useState, type FormEvent } from "react";
import { readCardScan } from "@/lib/scan.functions";
import {
  ADMIN_PASS,
  ADMIN_USER,
  approveAccount,
  blankLicense,
  issueAccountPsid,
  loadSharedDesk,
  logout,
  readSharedStamp,
  removeLicense,
  saveLicense,
  setAccountFee,
  setAccountNote,
  setAccountStatus,
  setLicenseFee,
  updateRequest,
  useDB,
  useSession,
  type Account,
  type LicenseRecord,
} from "@/components/dlims/store";

const input = "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm";

type Panel = "requests" | "live" | "ecard" | "regular" | "edit" | "status" | "fee" | "learner";

const tabs: { id: Panel; label: string }[] = [
  { id: "requests", label: "Requests" },
  { id: "status", label: "Sign ups" },
  { id: "live", label: "Live" },
  { id: "regular", label: "Regular" },
  { id: "edit", label: "Edit" },
  { id: "ecard", label: "E-card" },
  { id: "learner", label: "Learner" },
  { id: "fee", label: "Fees" },
];

export function AdminDesk({ onLeave }: { onLeave: () => void }) {
  const session = useSession();
  const db = useDB();
  const [panel, setPanel] = useState<Panel>("status");
  const [editing, setEditing] = useState<LicenseRecord | null>(null);

  useEffect(() => {
    let stamp = "";
    let stop = false;
    const tick = async () => {
      try {
        const next = JSON.stringify(await readSharedStamp());
        if (stop || next === stamp) return;
        stamp = next;
        await loadSharedDesk();
      } catch {
        /* keep the desk usable if the shared desk is briefly offline */
      }
    };
    void tick();
    const timer = window.setInterval(() => void tick(), 4000);
    return () => {
      stop = true;
      window.clearInterval(timer);
    };
  }, []);

  if (!session || session.role !== "admin") {
    return <p className="p-6 text-center font-bold">Open this desk from the admin login.</p>;
  }

  const pending = db.accounts.filter((item) => item.status === "pending").length;
  const review = db.accounts.filter((item) => item.status === "review").length;
  const approved = db.accounts.filter((item) => item.status === "accepted").length;
  const rejected = db.accounts.filter((item) => item.status === "rejected").length;
  const fees = db.accounts.filter((item) => item.feeConfirmed).length + db.licenses.filter((item) => item.feeConfirmed).length;
  const ecards = db.licenses.filter((item) => item.ecard).length;
  const permits = db.licenses.filter((item) => item.learnerPermit).length;

  return (
    <div className="mx-auto w-full max-w-5xl px-3 py-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h1 className="text-xl font-black text-[#157a38]">Admin desk</h1>
        <button
          type="button"
          className="rounded-full border px-3 py-1 text-xs font-bold"
          onClick={() => {
            logout();
            onLeave();
          }}
        >
          Log out
        </button>
      </div>
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button key={tab.id} type="button" onClick={() => setPanel(tab.id)} className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${panel === tab.id ? "bg-[#157a38] text-white" : "bg-white"}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {panel === "requests" ? (
        <ul className="grid gap-2">
          {(db.requests || []).length === 0 ? <p className="text-sm">No service requests yet.</p> : null}
          {(db.requests || []).map((item) => (
            <li key={item.id} className="rounded-2xl bg-white p-3 text-sm">
              <p className="font-bold">{item.name}</p>
              <p className="text-ink/60">{item.licenseNo ? `Licence ${item.licenseNo} · ` : ""}{item.vehicle} · {item.status} · {item.payment}</p>
              <p className="text-ink/60">{item.category} · {item.cnic} · {item.phone} · {item.email}</p>
              <p className="text-ink/60">{item.address}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(["processing", "approved", "rejected"] as const).map((status) => (
                  <button key={status} type="button" className="rounded-full bg-pill px-3 py-1 text-xs font-bold" onClick={() => updateRequest(item.id, { status })}>
                    {status}
                  </button>
                ))}
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      {panel === "live" ? (
        <div className="grid grid-cols-2 gap-2">
          {[
            ["Service requests", (db.requests || []).length],
            ["Applications", db.accounts.length],
            ["Pending", pending],
            ["In review", review],
            ["Approved", approved],
            ["Rejected", rejected],
            ["Licenses", db.licenses.length],
            ["Fees confirmed", fees],
            ["E-cards", ecards],
            ["Learner permits", permits],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-2xl bg-white p-3">
              <p className="text-[11px] font-bold tracking-wide text-ink/50 uppercase">{label}</p>
              <p className="text-2xl font-black text-leaf">{value}</p>
            </div>
          ))}
          <p className="col-span-2 text-xs font-semibold text-[#157a38]">Live — numbers change as soon as a record is saved.</p>
        </div>
      ) : null}

      {panel === "status" ? (
        <ul className="grid gap-3">
          {db.accounts.length === 0 ? <p className="text-sm">No sign ups yet.</p> : null}
          {db.accounts.map((account) => (
            <AccountReview key={account.id} account={account} />
          ))}
        </ul>
      ) : null}

      {panel === "fee" ? (
        <ul className="space-y-2">
          {db.accounts.map((account) => (
            <li key={account.id} className="flex items-center justify-between gap-2 rounded-2xl bg-white p-3 text-sm">
              <span>
                <b>{account.name}</b>
                <span className="block text-ink/60">Application</span>
              </span>
              <button type="button" className={`rounded-full px-3 py-1 text-xs font-bold ${account.feeConfirmed ? "bg-leaf text-white" : "bg-pill"}`} onClick={() => setAccountFee(account.id, !account.feeConfirmed)}>
                {account.feeConfirmed ? "Confirmed" : "Confirm fee"}
              </button>
            </li>
          ))}
          {db.licenses.map((record) => (
            <li key={record.id} className="flex items-center justify-between gap-2 rounded-2xl bg-white p-3 text-sm">
              <span>
                <b>{record.name}</b>
                <span className="block text-ink/60">{record.licenseNo}</span>
              </span>
              <button type="button" className={`rounded-full px-3 py-1 text-xs font-bold ${record.feeConfirmed ? "bg-leaf text-white" : "bg-pill"}`} onClick={() => setLicenseFee(record.id, !record.feeConfirmed)}>
                {record.feeConfirmed ? "Confirmed" : "Confirm fee"}
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {panel === "ecard" ? <UploadList kind="ecard" records={db.licenses} /> : null}
      {panel === "learner" ? <UploadList kind="learner" records={db.licenses} /> : null}

      {panel === "regular" ? (
        <div>
          <button type="button" className="rounded-full bg-[#157a38] px-4 py-2 text-sm font-bold text-white" onClick={() => setEditing(blankLicense({ kind: "REGULAR" }))}>
            Add regular license
          </button>
          {editing ? <LicenseEditor record={editing} onClose={() => setEditing(null)} /> : null}
        </div>
      ) : null}

      {panel === "edit" ? (
        <ul className="grid gap-2">
          {db.licenses.map((record) => (
            <li key={record.id} className="flex items-center justify-between gap-2 rounded-2xl bg-white p-3 text-sm">
              <span>
                <b>{record.name || "Unnamed"}</b>
                <span className="block text-ink/60">{record.licenseNo} · {record.cnic}</span>
              </span>
              <span className="flex gap-2">
                <button type="button" className="rounded-full bg-[#157a38] px-3 py-1 text-xs font-bold text-white" onClick={() => setEditing(record)}>
                  Edit
                </button>
                <button type="button" className="rounded-full bg-[#c51616] px-3 py-1 text-xs font-bold text-white" onClick={() => removeLicense(record.id)}>
                  Delete
                </button>
              </span>
            </li>
          ))}
          {editing ? <LicenseEditor record={editing} onClose={() => setEditing(null)} /> : null}
        </ul>
      ) : null}
    </div>
  );
}

function AccountReview({ account }: { account: Account }) {
  const [note, setNote] = useState(account.note || "");
  const [checked, setChecked] = useState(false);
  const rows = [
    ["Full name", account.name],
    ["Father / husband", account.father],
    ["CNIC", account.cnic],
    ["Date of birth", account.dob],
    ["Gender", account.gender],
    ["Phone", account.phone],
    ["Email", account.email],
    ["District", account.district],
    ["Address", account.address],
    ["License type", account.licenseType],
    ["Status", account.status],
  ];
  return (
    <li className="rounded-2xl bg-white p-3 text-sm">
      <div className="flex gap-3">
        {account.photo ? <img src={account.photo} alt="" className="size-16 shrink-0 rounded-xl object-cover" /> : <div className="grid size-16 shrink-0 place-items-center rounded-xl bg-[#eef3f0] text-[10px] font-bold text-ink/40">Photo</div>}
        <div>
          <p className="font-black">{account.name}</p>
          <p className="text-xs font-bold uppercase text-[#157a38]">{account.status}</p>
        </div>
      </div>
      <dl className="mt-3 grid gap-1 sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt className="text-[10px] font-bold tracking-wide text-ink/45 uppercase">{label}</dt>
            <dd className="break-words font-semibold">{value || "—"}</dd>
          </div>
        ))}
      </dl>
      {account.psid ? <p className="mt-2 font-bold text-[#163a86]">PSID {account.psid}</p> : null}
      <label className="mt-3 block text-xs font-bold">
        Note for this person
        <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={2} className={`${input} mt-1`} placeholder="Write the mistake, or leave blank if the form is correct" />
      </label>
      <label className="mt-2 flex items-center gap-2 text-xs font-bold">
        <input type="checkbox" checked={checked} onChange={(event) => setChecked(event.target.checked)} />
        I checked this form
      </label>
      <div className="mt-2 flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded-full bg-[#e0a020] px-3 py-1 text-xs font-bold"
          onClick={() => {
            setAccountNote(account.id, note);
            setAccountStatus(account.id, "review", note);
          }}
        >
          Save note
        </button>
        <button
          type="button"
          disabled={!checked}
          className="rounded-full bg-leaf px-3 py-1 text-xs font-bold text-white disabled:opacity-40"
          onClick={() => {
            setAccountNote(account.id, note);
            approveAccount(account.id);
          }}
        >
          Approve
        </button>
        <button type="button" disabled={!checked} className="rounded-full bg-[#c51616] px-3 py-1 text-xs font-bold text-white disabled:opacity-40" onClick={() => setAccountStatus(account.id, "rejected", note)}>
          Reject
        </button>
        <button type="button" className="rounded-full bg-[#163a86] px-3 py-1 text-xs font-bold text-white" onClick={() => issueAccountPsid(account.id)}>
          {account.psid ? "Resend PSID" : "Confirm & send PSID"}
        </button>
      </div>
    </li>
  );
}

function UploadList({ kind, records }: { kind: "ecard" | "learner"; records: LicenseRecord[] }) {
  const field = kind === "ecard" ? "ecard" : "learnerPermit";
  return (
    <ul className="grid gap-2">
      {records.length === 0 ? <p className="text-sm">Add a license first, then upload here.</p> : null}
      {records.map((record) => (
        <li key={record.id} className="rounded-2xl bg-white p-3 text-sm">
          <p className="font-bold">{record.name || record.licenseNo || "License"}</p>
          <p className="text-ink/60">{record.cnic}</p>
          <input
            type="file"
            accept={kind === "ecard" ? "image/*,application/pdf" : "image/*"}
            className={`${input} mt-2`}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => saveLicense({ ...record, [field]: String(reader.result || "") });
              reader.readAsDataURL(file);
            }}
          />
          {record[field] ? <p className="mt-1 text-xs font-bold text-[#157a38]">File attached</p> : null}
        </li>
      ))}
    </ul>
  );
}

function LicenseEditor({ record, onClose }: { record: LicenseRecord; onClose: () => void }) {
  const [form, setForm] = useState(record);
  function set<K extends keyof LicenseRecord>(key: K, value: LicenseRecord[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }
  function onSubmit(event: FormEvent) {
    event.preventDefault();
    saveLicense({ ...form, cnic: form.cnic.replace(/\D/g, "") });
    onClose();
  }
  const fields: [keyof LicenseRecord, string][] = [
    ["name", "Full name"],
    ["father", "Father / husband"],
    ["cnic", "CNIC"],
    ["dob", "Date of birth"],
    ["licenseNo", "License number"],
    ["vehicles", "Vehicles"],
    ["issueDate", "Issue date"],
    ["validTo", "Valid to"],
    ["district", "District"],
    ["phone", "Phone"],
    ["email", "Email"],
    ["address", "Address"],
  ];
  return (
    <form onSubmit={onSubmit} className="mt-4 rounded-2xl bg-white p-3">
      <CardScan onApply={(patch) => setForm((current) => ({ ...current, ...patch }))} />
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {fields.map(([key, label]) => (
          <label key={key} className="text-xs font-bold">
            {label}
            <input className={`${input} mt-1`} value={String(form[key] ?? "")} onChange={(event) => set(key, event.target.value)} />
          </label>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <button type="submit" className="rounded-full bg-[#157a38] px-4 py-2 text-sm font-bold text-white">Save</button>
        <button type="button" className="rounded-full border px-4 py-2 text-sm font-bold" onClick={onClose}>Close</button>
      </div>
    </form>
  );
}

function CardScan({ onApply }: { onApply: (patch: Partial<LicenseRecord>) => void }) {
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");

  async function scan(file: File) {
    if (!file.type.startsWith("image/")) {
      setNote("Choose a card photo.");
      return;
    }
    setBusy(true);
    setNote("");
    try {
      const image = await shrinkImage(file);
      const data = await readCardScan({ data: { user: ADMIN_USER, password: ADMIN_PASS, image } });
      const license = /licen/i.test(data.documentType);
      onApply({
        name: up(data.fullName),
        father: up(data.fatherOrHusbandName),
        cnic: (data.cnicRaw || data.cnicNumber).replace(/\D/g, ""),
        dob: asDate(data.dateOfBirth),
        address: data.address.trim(),
        licenseNo: up(data.licenseNumber),
        vehicles: data.allowedVehicles.trim(),
        issueDate: asDate(data.issueDate),
        validFrom: asDate(data.issueDate),
        validTo: /life/i.test(data.expiryDate) ? "LIFETIME" : asDate(data.expiryDate),
        photo: image,
        ...(license ? { ecard: image, kind: /intern/i.test(data.documentType) ? "INTERNATIONAL" : "REGULAR" } : {}),
      });
      setNote(license ? "License card read. Details and the card photo are on this form." : "CNIC read. Details and the card photo are on this form.");
    } catch (error) {
      setNote(error instanceof Error ? error.message : "Could not read the card.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-xl border border-dashed border-[#157a38] bg-[#f4fbf6] p-3">
      <p className="text-xs font-black text-[#157a38]">Scan CNIC or license card</p>
      <p className="mt-1 text-[11px] text-ink/60">Admin only. Use the camera or pick a saved photo from the gallery.</p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <label className="cursor-pointer rounded-full bg-[#157a38] px-3 py-2 text-center text-xs font-bold text-white">
          Camera
          <input
            type="file"
            accept="image/*"
            capture="environment"
            disabled={busy}
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (file) void scan(file);
            }}
          />
        </label>
        <label className="cursor-pointer rounded-full border border-[#157a38] bg-white px-3 py-2 text-center text-xs font-bold text-[#157a38]">
          Gallery
          <input
            type="file"
            accept="image/*"
            disabled={busy}
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (file) void scan(file);
            }}
          />
        </label>
      </div>
      {busy ? <p className="mt-2 text-xs font-bold">Reading the card…</p> : null}
      {note ? <p className="mt-2 text-xs font-semibold text-[#157a38]">{note}</p> : null}
    </div>
  );
}

function up(value: string) {
  return value.trim().toUpperCase();
}

function asDate(value: string) {
  const text = value.trim();
  const match = text.match(/^(\d{1,2})[/. -](\d{1,2})[/. -](\d{4})$/);
  if (!match) return text;
  return `${match[3]}-${match[2].padStart(2, "0")}-${match[1].padStart(2, "0")}`;
}

function shrinkImage(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not open the photo."));
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, 1200 / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.72));
      };
      img.onerror = () => resolve(String(reader.result));
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}
