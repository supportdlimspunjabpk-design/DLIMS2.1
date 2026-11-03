import { useState, type FormEvent } from "react";
import { OfficialBar } from "@/components/dlims/form-ui";
import { saveRequest } from "@/components/dlims/store";

export type ApplyKind = "learner" | "regular" | "international";

const TITLES: Record<ApplyKind, { title: string; hint: string }> = {
  learner: { title: "Learner License", hint: "Enter the CNIC, then the name, phone and both sides of the CNIC." },
  regular: { title: "Regular License Renewal", hint: "CNIC, licence photos, and a passport-size photo on a white background." },
  international: { title: "International License", hint: "Same documents as renewal, plus the current regular licence." },
};

export function Services({
  onApply,
  onOpen,
}: {
  onApply: (kind: ApplyKind) => void;
  onOpen: (id: "verify" | "elicense" | "track" | "duplicate" | "fees") => void;
}) {
  const items: { label: string; run: () => void }[] = [
    { label: "LEARNER LICENSE", run: () => onApply("learner") },
    { label: "REGULAR LICENSE", run: () => onApply("regular") },
    { label: "INTERNATIONAL LICENSE", run: () => onApply("international") },
    { label: "DUPLICATE LICENSE", run: () => onOpen("duplicate") },
    { label: "VERIFY LICENSE", run: () => onOpen("verify") },
    { label: "E-LICENSE", run: () => onOpen("elicense") },
    { label: "TRACK APPLICATION", run: () => onOpen("track") },
    { label: "FEE STRUCTURE", run: () => onOpen("fees") },
  ];
  return (
    <div className="mx-auto w-full max-w-lg">
      <button type="button" className="flex w-full items-center justify-between rounded-[28px] bg-[#e2b423] px-6 py-5 text-left text-3xl font-black text-[#1a1a1a]">
        Apply Service
        <span className="grid size-16 place-items-center rounded-2xl bg-[#f3d56a] text-4xl">↗</span>
      </button>
      <div className="mt-8 grid gap-4">
        {items.slice(0, 3).map((item) => (
          <button key={item.label} type="button" onClick={item.run} className="flex items-center gap-3">
            <span className="grid size-8 place-items-center rounded-full bg-[#1f9e4a] text-sm font-black text-white">✓</span>
            <span className="flex-1 rounded-full border border-[#e6e6e6] bg-white px-5 py-3 text-center text-sm font-black tracking-wide text-[#157a38] shadow-sm">
              {item.label}
            </span>
          </button>
        ))}
      </div>
      <div className="mt-6 grid grid-cols-2 gap-2">
        {items.slice(3).map((item) => (
          <button key={item.label} type="button" onClick={item.run} className="rounded-full border border-[#d7e6db] bg-white px-3 py-2 text-xs font-black text-[#157a38]">
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ApplyForm({ kind }: { kind: ApplyKind }) {
  const copy = TITLES[kind];
  const [message, setMessage] = useState("");
  const [ref, setRef] = useState("");
  const [files, setFiles] = useState<Record<string, string>>({});

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const cnic = String(data.get("cnic") || "").replace(/\D/g, "");
    const phone = String(data.get("phone") || "").trim();
    const father = String(data.get("father") || "").trim();
    const dob = String(data.get("dob") || "").trim();
    const address = String(data.get("address") || "").trim();
    if (!name || cnic.length < 11 || !phone) {
      setMessage("Name, CNIC and phone are required.");
      setRef("");
      return;
    }
    if (kind !== "learner" && (!father || !dob || !address)) {
      setMessage("Father name, date of birth and address are required.");
      setRef("");
      return;
    }
    const uploads = Object.entries(files)
      .filter(([, value]) => value)
      .map(([key, value]) => `${key}: ${value}`)
      .join(", ");
    try {
      const id = await saveRequest({
        category: kind,
        name: name.toUpperCase(),
        father: father.toUpperCase(),
        cnic,
        dob,
        phone,
        email: String(data.get("email") || "").trim(),
        district: String(data.get("district") || "FAISALABAD").trim().toUpperCase(),
        address: [address.toUpperCase(), uploads].filter(Boolean).join(" · "),
        licenseNo: String(data.get("licenseNo") || "").trim().toUpperCase(),
        vehicle: String(data.get("vehicle") || (kind === "learner" ? "M/Cycle" : "")).trim(),
      });
      setMessage("");
      setRef(id.slice(0, 8).toUpperCase());
      setFiles({});
      form.reset();
    } catch (error) {
      setRef("");
      setMessage(error instanceof Error ? error.message : "Could not send the request. Try again.");
    }
  }

  const uploads =
    kind === "learner"
      ? [
          ["cnic-front", "CNIC front"],
          ["cnic-back", "CNIC back"],
        ]
      : [
          ["photo", "Passport photo, white background"],
          ["cnic-front", "CNIC front"],
          ["cnic-back", "CNIC back"],
          ["licence-front", "Licence front"],
          ["licence-back", "Licence back"],
        ];

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-lg space-y-3 rounded-3xl bg-white p-5">
      <OfficialBar />
      <p className="text-xs font-black tracking-[0.2em] text-[#b8962e]">APPLICATION</p>
      <h1 className="text-2xl font-black text-leaf">{copy.title}</h1>
      <p className="text-sm text-ink/70">{copy.hint} The request, with these details, goes to the admin panel.</p>
      <Field name="cnic" label="CNIC number" inputMode="numeric" />
      <Field name="name" label="Full name" />
      <Field name="phone" label="Phone" inputMode="tel" />
      {kind === "learner" ? null : (
        <>
          <Field name="father" label="Father / husband name" />
          <Field name="dob" label="Date of birth" type="date" />
          <Field name="email" label="Email" type="email" required={false} />
          <Field name="district" label="District" defaultValue="FAISALABAD" />
          <Field name="address" label="Address" />
          <Field name="licenseNo" label={kind === "regular" ? "Current licence number" : "Regular licence number"} />
        </>
      )}
      {uploads.map(([key, label]) => (
        <label key={key} className="block text-sm font-semibold">
          {label}
          <input
            type="file"
            accept="image/*"
            className="mt-1 block w-full text-sm"
            onChange={(event) => {
              const file = event.target.files?.[0];
              setFiles((prev) => ({ ...prev, [label]: file ? file.name : "" }));
            }}
          />
          {files[label] ? <span className="mt-1 block text-xs text-[#157a38]">{files[label]}</span> : null}
        </label>
      ))}
      <button type="submit" className="w-full rounded-full bg-[#157a38] py-3 font-bold text-white">
        Submit request
      </button>
      {message ? <p className="rounded-xl bg-[#fff4f4] px-3 py-2 text-sm text-[#9b1c1c]">{message}</p> : null}
      {ref ? <p className="rounded-xl bg-[#eef8f1] px-3 py-2 text-sm font-semibold text-[#157a38]">Request sent to admin. Reference {ref}.</p> : null}
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  required = true,
  placeholder,
  defaultValue,
  inputMode,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
  inputMode?: "numeric" | "tel" | "email";
}) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      {required ? <span className="text-[#d10000]"> *</span> : null}
      <input name={name} type={type} required={required} placeholder={placeholder} defaultValue={defaultValue} inputMode={inputMode} min={type === "date" ? "1940-01-01" : undefined} max={type === "date" ? "2012-12-31" : undefined} className="mt-1 w-full rounded-xl border border-line px-3 py-2 font-normal" />
    </label>
  );
}
