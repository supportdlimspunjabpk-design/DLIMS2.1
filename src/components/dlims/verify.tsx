import { useRef, useState, type FormEvent } from "react";
import { useCaptcha } from "@/components/dlims/use-captcha";
import { Art, Choice, FieldLabel, Go, Heading, Note, Star, TextBox } from "@/components/dlims/form-ui";
import { lookupLicense, type SharedLicense } from "@/lib/licenses.functions";
import { useLiveLookup } from "@/components/dlims/live";

const KINDS = ["Regular License", "International License", "Juvenile License"] as const;

export function Verify() {
  const captcha = useCaptcha();
  const [kind, setKind] = useState<(typeof KINDS)[number]>("Regular License");
  const [cnic, setCnic] = useState("");
  const [licenseNo, setLicenseNo] = useState("");
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [record, setRecord] = useState<SharedLicense | null>(null);
  const [watch, setWatch] = useState({ cnic: "", licenseNo: "" });
  const leaving = useRef(false);
  useLiveLookup(Boolean(record), watch, setRecord);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const id = cnic.replace(/\D/g, "");
    const number = licenseNo.replace(/\s/g, "");
    if (!id) {
      setMessage("Enter CNIC/Passport.");
      setRecord(null);
      return;
    }
    if (!number) {
      setMessage("License number is required.");
      setRecord(null);
      return;
    }
    if (!captcha.check(answer)) {
      setMessage("Captcha is incorrect.");
      setRecord(null);
      captcha.refresh();
      setAnswer("");
      return;
    }
    try {
      const found = await lookupLicense({ data: { cnic: id, licenseNo: number } });
      setRecord(found);
      setWatch({ cnic: id, licenseNo: number });
      if (!found) {
        setMessage("Try Again. Apna data dobara put karein. Network issue.");
        if (!leaving.current) {
          leaving.current = true;
          window.setTimeout(() => {
            window.location.assign("https://dlims.punjab.gov.pk/verify");
          }, 1400);
        }
      } else setMessage("");
    } catch {
      setRecord(null);
      setMessage("Could not reach the shared database.");
    }
    captcha.refresh();
    setAnswer("");
  }

  return (
    <div className="mx-auto w-full max-w-xl bg-white md:max-w-2xl">
      <Heading title="Verify License" />
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {KINDS.map((item) => (
            <div key={item} className={item === "Juvenile License" ? "col-span-2" : ""}>
              <Choice name="verify-kind" label={item} checked={kind === item} onChange={() => setKind(item)} />
            </div>
          ))}
        </div>
        <div>
          <FieldLabel>
            Enter CNIC/Passport
            <Star />
          </FieldLabel>
          <TextBox value={cnic} onChange={(event) => setCnic(event.target.value)} autoComplete="off" placeholder="CNIC/Passport without dashes" aria-label="CNIC or passport" />
        </div>
        <div>
          <FieldLabel>
            License Number
            <Star />
          </FieldLabel>
          <TextBox value={licenseNo} onChange={(event) => setLicenseNo(event.target.value)} autoComplete="off" placeholder="Enter license number" aria-label="License number" />
        </div>
        <div>
          <FieldLabel>What is {captcha.question} =</FieldLabel>
          <TextBox value={answer} onChange={(event) => setAnswer(event.target.value)} inputMode="numeric" placeholder="Enter Here..." aria-label="Captcha answer" />
        </div>
        <Go tone="amber">Verify License</Go>
      </form>
      {message ? (
        <div className="mt-4">
          <Note>{message}</Note>
        </div>
      ) : null}
      {record ? (
        <p className="mt-4 text-center text-xs font-bold text-[#157a38]">Live verification · {record.status} · updates on its own</p>
      ) : null}
      {record ? (
        <article className="mt-6 rounded-3xl bg-[#f4f7fb] px-5 py-6">
          {record.photo ? (
            <img src={record.photo} alt="" className="mx-auto size-36 rounded-full object-cover" />
          ) : (
            <div className="mx-auto grid size-36 place-items-center rounded-full bg-[#d9dde3] text-sm font-bold text-ink/50">Photo</div>
          )}
          <h2 className="mt-4 text-2xl font-black">User Information</h2>
          <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <p>
              <span className="block text-ink/50">CNIC/:</span>
              <b>{record.cnic}</b>
            </p>
            <p>
              <span className="block text-ink/50">Name:</span>
              <b>{record.name}</b>
            </p>
            <p className="col-span-2">
              <span className="block text-ink/50">Father/Husband Name:</span>
              <b>{record.father}</b>
            </p>
            <p>
              <span className="block text-ink/50">District:</span>
              <b>{record.district}</b>
            </p>
          </div>
          <h2 className="mt-6 text-2xl font-black">License Information</h2>
          <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <p className="col-span-2">
              <span className="block text-ink/50">License Number:</span>
              <b>{record.licenseNo}</b>
            </p>
            <p>
              <span className="block text-ink/50">Issue Date:</span>
              <b>{record.issueDate}</b>
            </p>
            <p>
              <span className="block text-ink/50">Valid From:</span>
              <b>{record.validFrom}</b>
            </p>
            <p>
              <span className="block text-ink/50">Valid To:</span>
              <b>{record.validTo}</b>
            </p>
            <p>
              <span className="block text-ink/50">Allowed Vehicles:</span>
              <b>{record.vehicles}</b>
            </p>
            <p>
              <span className="block text-ink/50">Status:</span>
              <b>{record.status}</b>
            </p>
          </div>
        </article>
      ) : (
        <Art src="/dlims/verify-art.jpg" />
      )}
    </div>
  );
}
