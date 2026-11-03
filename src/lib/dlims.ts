import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const STATUSES = ["Applied", "Printed", "Dispatched", "Delivered"] as const;
export type Status = (typeof STATUSES)[number];

export const CATEGORIES = [
  { id: "BIKE", label: "Bike" },
  { id: "CAR", label: "Car" },
  { id: "LTV", label: "LTV" },
  { id: "HTV", label: "HTV" },
  { id: "PSV", label: "PSV" },
  { id: "TRACTOR", label: "Tractor" },
  { id: "RIKSHAW", label: "Rikshaw" },
  { id: "HEAVY", label: "Heavy" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export type LicenseKind = "Regular License" | "International License" | "Juvenile Permit";

export type LicenseRecord = {
  id: string;
  name: string;
  father: string;
  cnic: string;
  licenseNo: string;
  dob: string;
  issueDate: string;
  expiryDate: string;
  address: string;
  photo: string;
  categories: CategoryId[];
  status: Status;
};

export const ADMIN_CNIC = "3310206115455";

export const SAMPLES = {
  adnan: {
    name: "Adnan Ashraf",
    cnic: "33102-0611545-5",
    dob: "1996-07-14",
    licenseNo: "FD-26-7118777",
  },
  hammad: {
    name: "Muhammad Hammad Ali",
    cnic: "33102-1234567-8",
    dob: "1992-05-20",
    licenseNo: "KB-06-7324",
  },
} as const;

export function digits(value: string) {
  return value.replace(/\D/g, "");
}

export function formatCnic(value: string) {
  const d = digits(value).slice(0, 13);
  if (d.length <= 5) return d;
  if (d.length <= 12) return `${d.slice(0, 5)}-${d.slice(5)}`;
  return `${d.slice(0, 5)}-${d.slice(5, 12)}-${d.slice(12)}`;
}

export function prettyDate(iso: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return iso;
  return `${match[3]}-${match[2]}-${match[1]}`;
}

export function portraitData(name: string, hue: number) {
  const initials =
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase() ?? "")
      .join("")
      .replace(/[^A-Z0-9]/g, "") || "DL";
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 360'>
    <rect width='300' height='360' fill='hsl(${hue} 38% 36%)'/>
    <circle cx='150' cy='128' r='58' fill='hsl(${hue} 32% 78%)'/>
    <ellipse cx='150' cy='318' rx='108' ry='92' fill='hsl(${hue} 32% 78%)'/>
    <text x='150' y='144' text-anchor='middle' font-size='40' font-family='Inter,sans-serif' font-weight='700' fill='hsl(${hue} 38% 24%)'>${initials}</text>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export function readPhoto(file: File) {
  return new Promise<string>((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Choose an image file."));
      return;
    }
    if (file.size > 400_000) {
      reject(new Error("Use a photo under 400 KB."));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read that photo."));
    reader.readAsDataURL(file);
  });
}

const SEED: LicenseRecord[] = [
  {
    id: "rec_1",
    name: "ADNAN ASHRAF",
    father: "ASHRAF MASIH",
    cnic: SAMPLES.adnan.cnic,
    licenseNo: SAMPLES.adnan.licenseNo,
    dob: SAMPLES.adnan.dob,
    issueDate: "2026-10-15",
    expiryDate: "2030-10-15",
    address: "Moh Noor Pura Street No 12 Satiana Road, Faisalabad",
    photo: portraitData("ADNAN ASHRAF", 152),
    categories: ["BIKE", "CAR"],
    status: "Dispatched",
  },
  {
    id: "rec_2",
    name: "MUHAMMAD HAMMAD ALI",
    father: "MUHAMMAD HANIF",
    cnic: SAMPLES.hammad.cnic,
    licenseNo: SAMPLES.hammad.licenseNo,
    dob: SAMPLES.hammad.dob,
    issueDate: "2024-06-10",
    expiryDate: "2029-06-10",
    address: "Defence Road, Lahore Punjab",
    photo: portraitData("MUHAMMAD HAMMAD ALI", 210),
    categories: ["BIKE"],
    status: "Delivered",
  },
];

type DeskState = {
  records: LicenseRecord[];
  upsert: (record: LicenseRecord) => void;
  remove: (id: string) => void;
};

const memoryStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};

export const useDlims = create<DeskState>()(
  persist(
    (set) => ({
      records: SEED,
      upsert: (record) =>
        set((state) => {
          const index = state.records.findIndex((item) => item.id === record.id);
          const records = [...state.records];
          if (index >= 0) records[index] = record;
          else records.unshift(record);
          return { records };
        }),
      remove: (id) =>
        set((state) => ({ records: state.records.filter((item) => item.id !== id) })),
    }),
    {
      name: "dlims-demo-records",
      storage: createJSONStorage(() =>
        typeof window === "undefined" ? memoryStorage : window.localStorage,
      ),
      skipHydration: true,
      partialize: (state) => ({ records: state.records }),
    },
  ),
);

export function findByCnic(records: LicenseRecord[], cnic: string) {
  const needle = digits(cnic);
  if (needle.length !== 13) return undefined;
  return records.find((record) => digits(record.cnic) === needle);
}

export function findByQuery(records: LicenseRecord[], query: string) {
  const byCnic = findByCnic(records, query);
  if (byCnic) return byCnic;
  const needle = query.trim().toLowerCase();
  if (!needle) return undefined;
  return records.find((record) => record.licenseNo.toLowerCase() === needle);
}

export function statusRank(status: Status) {
  return STATUSES.indexOf(status);
}
