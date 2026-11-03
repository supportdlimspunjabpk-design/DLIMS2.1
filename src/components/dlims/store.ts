import { useSyncExternalStore } from "react";
import { listSharedLicenses, removeSharedLicense, saveSharedLicense } from "@/lib/licenses.functions";
import { listSharedAccounts, listSharedRequests, loginAccount, saveSharedAccount, saveSharedRequest, submitAccount, submitRequest, syncStamp } from "@/lib/sync.functions";

export type Account = {
  id: string;
  name: string;
  father: string;
  cnic: string;
  dob: string;
  gender: string;
  phone: string;
  email: string;
  password: string;
  district: string;
  address: string;
  licenseType: string;
  photo: string;
  status: "pending" | "review" | "accepted" | "rejected";
  note?: string;
  feeConfirmed?: boolean;
  psid?: string;
  createdAt: string;
};

export type LicenseRecord = {
  id: string;
  cnic: string;
  name: string;
  father: string;
  dob: string;
  district: string;
  address: string;
  phone: string;
  email: string;
  photo: string;
  licenseNo: string;
  kind: string;
  vehicles: string;
  issueDate: string;
  validFrom: string;
  validTo: string;
  status: string;
  trackingNo: string;
  printedOn: string;
  dispatchOn: string;
  handler: string;
  ecard?: string;
  learnerPermit?: string;
  feeConfirmed?: boolean;
};

export type ServiceRequest = {
  id: string;
  category: "learner" | "regular" | "international";
  name: string;
  father: string;
  cnic: string;
  dob: string;
  phone: string;
  email: string;
  district: string;
  address: string;
  licenseNo: string;
  vehicle: string;
  status: "new" | "processing" | "approved" | "rejected";
  psid: string;
  payment: "Unpaid" | "Paid";
  createdAt: string;
};

type DB = { accounts: Account[]; licenses: LicenseRecord[]; requests: ServiceRequest[] };
type Session = { role: "admin" | "user"; name: string; cnic?: string };

const KEY = "dlims-demo-v1";
const SESSION = "dlims-session";
export const ADMIN_USER = "support.dlims.punjab.pk@gmail.com";
export const ADMIN_PASS = "Pakistan123$#@";

const DEMO_ID = "demo-check-license";

const demoLicense = (): LicenseRecord => ({
  id: DEMO_ID,
  cnic: "3520200000001",
  name: "DEMO CHECK LICENSE",
  father: "DEMO FATHER NAME",
  dob: "1990-01-15",
  district: "FAISALABAD",
  address: "DEMO ADDRESS, FAISALABAD",
  phone: "03000000000",
  email: "demo@dlims.local",
  photo: "",
  licenseNo: "FD-00-00001",
  kind: "REGULAR",
  vehicles: "M/CYCLE, CAR",
  issueDate: "2025-05-13",
  validFrom: "2025-05-13",
  validTo: "2027-05-13",
  status: "Valid",
  trackingNo: "PK000000001",
  printedOn: "2025-05-14",
  dispatchOn: "2025-05-16",
  handler: "Pakistan Post",
});

function withDemo(data: DB): DB {
  if (data.licenses.some((item) => item.id === DEMO_ID)) return data;
  return { ...data, licenses: [demoLicense(), ...data.licenses] };
}

function empty(): DB {
  return withDemo({ accounts: [], licenses: [], requests: [] });
}

function read(): DB {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty();
    const parsed = JSON.parse(raw) as Partial<DB>;
    return withDemo({ accounts: parsed.accounts ?? [], licenses: parsed.licenses ?? [], requests: parsed.requests ?? [] });
  } catch {
    return empty();
  }
}

let db: DB = typeof localStorage === "undefined" ? empty() : read();
const listeners = new Set<() => void>();

function emit() {
  try {
    localStorage.setItem(KEY, JSON.stringify(db));
  } catch {
    /* keep the in-memory copy if the photo is too large for this browser */
  }
  listeners.forEach((listener) => listener());
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === KEY) {
      db = read();
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function getDB() {
  return db;
}

const SERVER_DB = empty();

export function useDB() {
  return useSyncExternalStore(subscribe, getDB, () => SERVER_DB);
}

let sessionCache: Session | null = null;
let sessionRaw: string | null | undefined;

export function getSession(): Session | null {
  try {
    const raw = sessionStorage.getItem(SESSION);
    if (raw === sessionRaw) return sessionCache;
    sessionRaw = raw;
    sessionCache = raw ? (JSON.parse(raw) as Session) : null;
    return sessionCache;
  } catch {
    return null;
  }
}

export function useSession() {
  return useSyncExternalStore(
    (listener) => {
      window.addEventListener("dlims-session", listener);
      return () => window.removeEventListener("dlims-session", listener);
    },
    getSession,
    () => null,
  );
}

function setSession(session: Session | null) {
  if (session) sessionStorage.setItem(SESSION, JSON.stringify(session));
  else sessionStorage.removeItem(SESSION);
  window.dispatchEvent(new Event("dlims-session"));
}

export function logout() {
  setSession(null);
}

export async function login(user: string, password: string) {
  const id = user.trim();
  if (id.toLowerCase() === ADMIN_USER && password === ADMIN_PASS) {
    setSession({ role: "admin", name: "Admin" });
    return { ok: true as const };
  }
  try {
    const remote = await loginAccount({ data: { user: id, password } });
    if (!remote.ok) return remote;
    setSession({ role: "user", name: remote.name, cnic: remote.cnic });
    return { ok: true as const };
  } catch {
    const account = db.accounts.find((item) => item.email.toLowerCase() === id.toLowerCase() || item.cnic === id.replace(/\D/g, ""));
    if (!account || account.password !== password) return { ok: false as const, message: "Login details do not match." };
    if (account.status !== "accepted") {
      const note = account.note ? ` ${account.note}` : "";
      if (account.status === "rejected") return { ok: false as const, message: `This sign up was not accepted.${note}` };
      return { ok: false as const, message: `Sign up is waiting for admin approval. Login opens only after it is approved.${note}` };
    }
    setSession({ role: "user", name: account.name, cnic: account.cnic });
    return { ok: true as const };
  }
}

export async function signUp(input: Omit<Account, "id" | "status" | "createdAt">) {
  const cnic = input.cnic.replace(/\D/g, "");
  const account: Account = {
    ...input,
    cnic,
    email: input.email.trim().toLowerCase(),
    id: crypto.randomUUID(),
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  try {
    await submitAccount({ data: { record: account } });
  } catch (error) {
    return error instanceof Error ? error.message : "Could not save the sign up.";
  }
  db = { ...db, accounts: [account, ...db.accounts] };
  emit();
  return "";
}

export async function saveRequest(input: Omit<ServiceRequest, "id" | "status" | "psid" | "payment" | "createdAt">) {
  const request: ServiceRequest = {
    ...input,
    cnic: input.cnic.replace(/\D/g, ""),
    id: crypto.randomUUID(),
    status: "new",
    psid: "",
    payment: "Unpaid",
    createdAt: new Date().toISOString(),
  };
  await submitRequest({ data: { record: request } });
  db = { ...db, requests: [request, ...(db.requests || [])] };
  emit();
  return request.id;
}

export function updateRequest(id: string, patch: Partial<ServiceRequest>) {
  db = { ...db, requests: db.requests.map((item) => (item.id === id ? { ...item, ...patch } : item)) };
  emit();
  const request = db.requests.find((item) => item.id === id);
  if (request) {
    void saveSharedRequest({ data: { user: ADMIN_USER, password: ADMIN_PASS, record: request } }).catch(() => {
      /* the next live refresh loads the server copy */
    });
  }
}

export function setAccountStatus(id: string, status: Account["status"], note?: string) {
  db = { ...db, accounts: db.accounts.map((item) => (item.id === id ? { ...item, status, ...(note !== undefined ? { note } : {}) } : item)) };
  emit();
  const account = db.accounts.find((item) => item.id === id);
  void saveSharedAccount({
    data: { user: ADMIN_USER, password: ADMIN_PASS, id, status, feeConfirmed: Boolean(account?.feeConfirmed), note: note ?? account?.note ?? "" },
  }).catch(() => {
    /* local status stays until the next refresh */
  });
}

export function setAccountNote(id: string, note: string) {
  const account = db.accounts.find((item) => item.id === id);
  if (!account) return;
  db = { ...db, accounts: db.accounts.map((item) => (item.id === id ? { ...item, note } : item)) };
  emit();
  void saveSharedAccount({
    data: { user: ADMIN_USER, password: ADMIN_PASS, id, status: account.status, feeConfirmed: Boolean(account.feeConfirmed), note },
  }).catch(() => {
    /* local note stays until the next refresh */
  });
}

export function issueAccountPsid(id: string) {
  const current = db.accounts.find((item) => item.id === id);
  if (!current?.email) return "";
  const psid = current.psid || String(Date.now()).slice(0, 17);
  db = { ...db, accounts: db.accounts.map((item) => (item.id === id ? { ...item, psid, status: "accepted" } : item)) };
  emit();
  void saveSharedAccount({
    data: { user: ADMIN_USER, password: ADMIN_PASS, id, status: "accepted", feeConfirmed: Boolean(current.feeConfirmed), psid },
  }).catch(() => {
    /* local copy stays until the next refresh */
  });
  const body = `Assalam o Alaikum ${current.name},\n\nYour DLIMS 2.1 request is confirmed.\nLicence: ${current.licenseType}\nPSID: ${psid}\n\nPay the fee with this PSID. After payment the office will review the record and mark it OK.`;
  window.open(`mailto:${current.email}?subject=${encodeURIComponent(`DLIMS 2.1 confirmed — PSID ${psid}`)}&body=${encodeURIComponent(body)}`, "_blank");
  return psid;
}

export function approveAccount(id: string) {
  const account = db.accounts.find((item) => item.id === id);
  if (!account) return;
  setAccountStatus(id, "accepted");
  const cnic = account.cnic.replace(/\D/g, "");
  const existing = db.licenses.find((item) => item.cnic === cnic);
  const type = account.licenseType.toUpperCase();
  const kind = type.includes("LEARN") ? "LEARNER" : type.includes("INTERN") ? "INTERNATIONAL" : "REGULAR";
  saveLicense(
    blankLicense({
      ...(existing?.id ? { id: existing.id } : {}),
      cnic,
      name: account.name,
      father: account.father,
      dob: account.dob,
      district: account.district,
      address: account.address,
      phone: account.phone,
      email: account.email,
      photo: account.photo || existing?.photo || "",
      kind,
      vehicles: existing?.vehicles || "M/CYCLE",
      licenseNo: existing?.licenseNo || `PB-${cnic.slice(-7)}`,
      status: "Approved",
      ecard: existing?.ecard,
      learnerPermit: existing?.learnerPermit,
    }),
  );
}

export function setAccountFee(id: string, feeConfirmed: boolean) {
  db = { ...db, accounts: db.accounts.map((item) => (item.id === id ? { ...item, feeConfirmed } : item)) };
  emit();
  void saveSharedAccount({ data: { user: ADMIN_USER, password: ADMIN_PASS, id, feeConfirmed } }).catch(() => {
    /* local fee flag stays until the next refresh */
  });
}

export function setLicenseFee(id: string, feeConfirmed: boolean) {
  db = { ...db, licenses: db.licenses.map((item) => (item.id === id ? { ...item, feeConfirmed } : item)) };
  emit();
  const record = db.licenses.find((item) => item.id === id);
  if (record) syncLicense(record);
}

function syncLicense(record: LicenseRecord) {
  void saveSharedLicense({ data: { user: ADMIN_USER, password: ADMIN_PASS, record } }).catch(() => {
    /* local copy stays; the next admin open retries from this device */
  });
}

export function saveLicense(record: LicenseRecord) {
  const index = db.licenses.findIndex((item) => item.id === record.id);
  const licenses = [...db.licenses];
  if (index >= 0) licenses[index] = record;
  else licenses.unshift(record);
  db = { ...db, licenses };
  emit();
  syncLicense(record);
}

export function replaceLicenses(records: LicenseRecord[]) {
  if (records.length === 0) return;
  db = { ...db, licenses: records };
  emit();
}

export async function loadSharedLicenses() {
  const records = await listSharedLicenses({ data: { user: ADMIN_USER, password: ADMIN_PASS } });
  replaceLicenses(records as LicenseRecord[]);
  return records;
}

export async function readSharedStamp() {
  return syncStamp({ data: { user: ADMIN_USER, password: ADMIN_PASS } });
}

export async function loadSharedDesk() {
  const auth = { user: ADMIN_USER, password: ADMIN_PASS };
  const [licenses, requests, accounts, stamp] = await Promise.all([
    listSharedLicenses({ data: auth }),
    listSharedRequests({ data: auth }),
    listSharedAccounts({ data: auth }),
    syncStamp({ data: auth }),
  ]);
  replaceLicenses(licenses as LicenseRecord[]);
  db = { ...db, requests, accounts: accounts as Account[] };
  emit();
  return stamp;
}

export function removeLicense(id: string) {
  db = { ...db, licenses: db.licenses.filter((item) => item.id !== id) };
  emit();
  void removeSharedLicense({ data: { user: ADMIN_USER, password: ADMIN_PASS, id } }).catch(() => {
    /* keep the local delete even if the shared row is already gone */
  });
}

export function findLicense(cnic: string) {
  const id = cnic.replace(/\D/g, "");
  return db.licenses.find((item) => item.cnic === id) ?? null;
}

export function blankLicense(seed?: Partial<LicenseRecord>): LicenseRecord {
  const today = new Date().toISOString().slice(0, 10);
  return {
    id: crypto.randomUUID(),
    cnic: "",
    name: "",
    father: "",
    dob: "",
    district: "FAISALABAD",
    address: "",
    phone: "",
    email: "",
    photo: "",
    licenseNo: "",
    kind: "REGULAR",
    vehicles: "M/CYCLE",
    issueDate: today,
    validFrom: today,
    validTo: today,
    status: "Valid",
    trackingNo: "",
    printedOn: "",
    dispatchOn: "",
    handler: "Pakistan Post",
    ...seed,
  };
}
