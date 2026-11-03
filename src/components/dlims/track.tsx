import { useRef, useState, type FormEvent } from "react";
import { useCaptcha } from "@/components/dlims/use-captcha";
import { FieldLabel, Go, Heading, Note, Star, TextBox } from "@/components/dlims/form-ui";
import { lookupLicense, type SharedLicense } from "@/lib/licenses.functions";
import { useLiveLookup } from "@/components/dlims/live";

export function Track() {
  const captcha = useCaptcha();
  const [cnic, setCnic] = useState("");
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [record, setRecord] = useState<SharedLicense | null>(null);
  const [watch, setWatch] = useState({ cnic: "" });
  const leaving = useRef(false);
  useLiveLookup(Boolean(record), watch, setRecord);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const id = cnic.replace(/\D/g, "");
    if (!id) {
      setMessage("Enter CNIC/Passport.");
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
      const found = await lookupLicense({ data: { cnic: id } });
      setRecord(found);
      setWatch({ cnic: id });
      if (!found) {
        setMessage("Try Again. Apna data dobara put karein. Network issue.");
        if (!leaving.current) {
          leaving.current = true;
          window.setTimeout(() => {
            window.location.assign("https://dlims.punjab.gov.pk/track");
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
      <Heading title="Track License" />
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <FieldLabel>
            Enter CNIC/PASSPORT
            <Star />
          </FieldLabel>
          <TextBox value={cnic} onChange={(event) => setCnic(event.target.value)} autoComplete="off" placeholder="CNIC/Passport without dashes" aria-label="CNIC or passport" />
        </div>
        <div>
          <FieldLabel>What is {captcha.question} =</FieldLabel>
          <TextBox value={answer} onChange={(event) => setAnswer(event.target.value)} inputMode="numeric" placeholder="Enter Here..." aria-label="Captcha answer" />
        </div>
        <Go tone="amber">Track License</Go>
      </form>
      {message ? (
        <div className="mt-4">
          <Note>{message}</Note>
        </div>
      ) : null}
      {record ? (
        <p className="mt-4 text-center text-xs font-bold text-[#157a38]">Live tracking · {record.status} · updates on its own</p>
      ) : null}
      {record ? (
      <div className="mt-8 rounded-[1.6rem] bg-ill px-4 pt-6 pb-8 text-center">
        <img src="/dlims/track-art.jpg" alt="" className="mx-auto w-full max-w-sm" />
        <p className="mt-2 text-[1.7rem] leading-none font-black">Tracking Result</p>
        <div className="mx-auto mt-4 max-w-sm text-left">
            <p className="text-center text-lg text-ink/40">Delivery Handler {record.handler || "Pakistan Post"}</p>
            <dl className="mt-6 space-y-4 text-base">
              <div className="flex justify-between gap-4">
                <dt>Printed On:</dt>
                <dd className="font-medium">{record.printedOn || "—"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Dispatch On :</dt>
                <dd className="font-medium">{record.dispatchOn || "—"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Tracking No.</dt>
                <dd className="font-medium">{record.trackingNo || "—"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Status</dt>
                <dd className="font-medium">{record.status}</dd>
              </div>
            </dl>
        </div>
      </div>
      ) : (
        <img src="/dlims/track-art.jpg" alt="" className="mx-auto mt-10 w-full max-w-sm" />
      )}
    </div>
  );
}
