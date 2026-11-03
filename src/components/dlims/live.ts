import { useEffect } from "react";
import { lookupLicense, type SharedLicense } from "@/lib/licenses.functions";

export function useLiveLookup(
  active: boolean,
  query: { cnic: string; dob?: string; licenseNo?: string },
  setRecord: (record: SharedLicense | null) => void,
) {
  const cnic = query.cnic;
  const dob = query.dob ?? "";
  const licenseNo = query.licenseNo ?? "";
  useEffect(() => {
    if (!active || !cnic) return;
    let live = true;
    const tick = async () => {
      try {
        const found = await lookupLicense({ data: { cnic, dob, licenseNo } });
        if (live) setRecord(found);
      } catch {
        /* keep the card already on screen */
      }
    };
    const id = window.setInterval(tick, 4000);
    return () => {
      live = false;
      window.clearInterval(id);
    };
  }, [active, cnic, dob, licenseNo, setRecord]);
}
