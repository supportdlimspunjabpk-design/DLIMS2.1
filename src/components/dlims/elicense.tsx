import { useRef, useState, type FormEvent } from "react";
import { useCaptcha } from "@/components/dlims/use-captcha";
import { Art, Choice, FieldLabel, Go, Heading, Note, Star, TextBox } from "@/components/dlims/form-ui";
import { LicenseCard } from "@/components/dlims/license-card";
import { lookupLicense, type SharedLicense } from "@/lib/licenses.functions";
import { useLiveLookup } from "@/components/dlims/live";

const KINDS = ["Regular License", "International License", "Juvenile License"] as const;

export function ELicense() {
  const captcha = useCaptcha();
  const [kind, setKind] = useState<(typeof KINDS)[number]>("Regular License");
  const [cnic, setCnic] = useState("");
  const [dob, setDob] = useState("");
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [record, setRecord] = useState<SharedLicense | null>(null);
  const [busy, setBusy] = useState(false);
  const [watch, setWatch] = useState({ cnic: "", dob: "" });
  const leaving = useRef(false);
  useLiveLookup(Boolean(record), watch, setRecord);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!cnic.trim() || !dob.trim()) {
      setMessage("CNIC/Passport and date of birth are required.");
      setRecord(null);
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dob.trim())) {
      setMessage("Enter date of birth as YYYY-MM-DD.");
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
    setBusy(true);
    try {
      const found = await lookupLicense({ data: { cnic: cnic.replace(/\D/g, ""), dob: dob.trim() } });
      setRecord(found);
      setWatch({ cnic: cnic.replace(/\D/g, ""), dob: dob.trim() });
      if (!found) {
        setMessage("Try Again. Apna data dobara put karein. Network issue.");
        if (!leaving.current) {
          leaving.current = true;
          window.setTimeout(() => {
            window.location.assign("https://dlims.punjab.gov.pk/elicense");
          }, 1400);
        }
      } else setMessage("");
    } catch {
      setRecord(null);
      setMessage("Could not reach the shared database.");
    } finally {
      setBusy(false);
      captcha.refresh();
      setAnswer("");
    }
  }

  return (
    <div className="mx-auto w-full max-w-xl bg-white md:max-w-2xl">
      <Heading title="e-Licence" />
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {KINDS.map((item) => (
              <div key={item} className={item === "Juvenile License" ? "col-span-2" : ""}>
                <Choice name="elicense-kind" label={item} checked={kind === item} onChange={() => setKind(item)} />
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
              Date of Birth
              <Star />
            </FieldLabel>
            <TextBox value={dob} onChange={(event) => setDob(event.target.value)} type="date" min="1940-01-01" max="2012-12-31" aria-label="Date of birth" />
          </div>
          <div>
            <FieldLabel>What is {captcha.question} =</FieldLabel>
            <TextBox value={answer} onChange={(event) => setAnswer(event.target.value)} inputMode="numeric" placeholder="Enter Here..." aria-label="Captcha answer" />
          </div>
          <Go tone="gold">{busy ? "Checking..." : "Generate e-Licence"}</Go>
        </form>
        {message ? (
          <div className="mt-4">
            <Note>{message}</Note>
          </div>
        ) : null}
        {record ? <p className="mt-4 text-center text-xs font-bold text-[#157a38]">Live card · {record.status} · updates on its own</p> : null}
        {record ? (
          <div className="mt-6">
            <UploadedCard record={record} />
          </div>
        ) : (
          <Art src="/dlims/verify-art.jpg" />
        )}
    </div>
  );
}

function isPdf(src: string) {
  return src.startsWith("data:application/pdf") || src.toLowerCase().includes(".pdf");
}

function UploadedCard({
  record,
}: {
  record: { ecard?: string; photo: string; licenseNo: string; name: string; father: string; dob: string; cnic: string; issueDate: string; validTo: string; address: string; vehicles: string };
}) {
  const uploadedPdf = record.ecard && isPdf(record.ecard) ? record.ecard : "";
  const picture = record.ecard && !uploadedPdf ? record.ecard : "";
  if (picture) {
    return (
      <div>
        <img src={picture} alt="E-card" className="w-full rounded-2xl bg-white shadow-lg" />
        <button type="button" onClick={() => downloadImagePdf(picture)} className="mt-4 w-full rounded-full bg-[#163a86] py-3 text-sm font-bold text-white">
          Download PDF
        </button>
      </div>
    );
  }
  return (
    <div>
      {uploadedPdf ? <iframe title="Uploaded e-card" src={uploadedPdf} className="h-[560px] w-full rounded-2xl bg-white" /> : (
        <LicenseCard photo={record.photo} licenseNo={record.licenseNo} name={record.name} father={record.father} dob={record.dob} cnic={record.cnic} issueDate={record.issueDate} validTo={record.validTo} address={record.address} vehicles={record.vehicles} />
      )}
      {uploadedPdf ? (
        <a href={uploadedPdf} download="DLIMS-e-license.pdf" className="mt-4 block rounded-full bg-[#163a86] py-3 text-center text-sm font-bold text-white">
          Download PDF
        </a>
      ) : (
        <button type="button" onClick={() => downloadCardPdf(record)} className="mt-4 w-full rounded-full bg-[#163a86] py-3 text-sm font-bold text-white">
          Download PDF
        </button>
      )}
    </div>
  );
}

function downloadImagePdf(src: string) {
  const image = new Image();
  image.onload = () => {
    const canvas = document.createElement("canvas");
    const scale = Math.min(1, 1200 / Math.max(image.width, image.height));
    const w = Math.max(1, Math.round(image.width * scale));
    const h = Math.max(1, Math.round(image.height * scale));
    canvas.width = w;
    canvas.height = h;
    canvas.getContext("2d")?.drawImage(image, 0, 0, w, h);
    const raw = atob(canvas.toDataURL("image/jpeg", 0.9).split(",")[1] || "");
    const jpg = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i += 1) jpg[i] = raw.charCodeAt(i);
    const enc = new TextEncoder();
    const chunks: Uint8Array[] = [];
    let length = 0;
    const push = (bytes: Uint8Array) => {
      chunks.push(bytes);
      length += bytes.length;
    };
    const pushStr = (value: string) => push(enc.encode(value));
    const offsets = [0, 0, 0, 0, 0, 0];
    const obj = (n: number, value: string) => {
      offsets[n] = length;
      pushStr(value);
    };
    pushStr("%PDF-1.4\n");
    obj(1, "1 0 obj<< /Type /Catalog /Pages 2 0 R >>endobj\n");
    obj(2, "2 0 obj<< /Type /Pages /Kids [3 0 R] /Count 1 >>endobj\n");
    obj(3, `3 0 obj<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${w} ${h}] /Contents 4 0 R /Resources<< /XObject<< /Im0 5 0 R >> >> >>endobj\n`);
    const content = enc.encode(`q\n${w} 0 0 ${h} 0 0 cm\n/Im0 Do\nQ\n`);
    offsets[4] = length;
    pushStr(`4 0 obj<< /Length ${content.length} >>stream\n`);
    push(content);
    pushStr("endstream endobj\n");
    offsets[5] = length;
    pushStr(`5 0 obj<< /Type /XObject /Subtype /Image /Width ${w} /Height ${h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpg.length} >>stream\n`);
    push(jpg);
    pushStr("\nendstream endobj\n");
    const xref = length;
    pushStr("xref\n0 6\n0000000000 65535 f \n");
    for (let i = 1; i <= 5; i += 1) pushStr(`${String(offsets[i]).padStart(10, "0")} 00000 n \n`);
    pushStr(`trailer<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`);
    const size = chunks.reduce((sum, part) => sum + part.length, 0);
    const pdf = new Uint8Array(size);
    let offset = 0;
    chunks.forEach((part) => {
      pdf.set(part, offset);
      offset += part.length;
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([pdf], { type: "application/pdf" }));
    link.download = "DLIMS-e-license.pdf";
    link.click();
  };
  image.src = src;
}

function downloadCardPdf(record: { licenseNo: string; name: string; father: string; dob: string; cnic: string; issueDate: string; validTo: string; address: string }) {
  const lines = ["E-DRIVING LICENSE", "TRAFFIC POLICE PUNJAB", "License " + record.licenseNo, record.name, "So/Do/Wo " + record.father, "DOB " + record.dob, "CNIC " + record.cnic, "Issue " + record.issueDate, "Valid " + record.validTo, record.address];
  const safe = (value: string) => value.replace(/[()\\]/g, " ").slice(0, 80);
  const stream = `BT /F1 14 Tf 40 780 Td 20 TL ${lines.map((line) => `(${safe(line)}) Tj T*`).join(" ")} ET`;
  const objects = [
    "1 0 obj<< /Type /Catalog /Pages 2 0 R >>endobj",
    "2 0 obj<< /Type /Pages /Kids [3 0 R] /Count 1 >>endobj",
    "3 0 obj<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources<< /Font<< /F1 5 0 R >> >> >>endobj",
    `4 0 obj<< /Length ${stream.length} >>stream\n${stream}\nendstream endobj`,
    "5 0 obj<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>endobj",
  ];
  let body = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((obj) => {
    offsets.push(body.length);
    body += obj + "\n";
  });
  const xref = body.length;
  body += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i < offsets.length; i += 1) body += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  body += `trailer<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([body], { type: "application/pdf" }));
  link.download = "DLIMS-e-license.pdf";
  link.click();
}
