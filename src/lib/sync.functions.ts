import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";

const ADMIN_USER = "support.dlims.punjab.pk@gmail.com";
const ADMIN_PASS = "Pakistan123$#@";

function clip(value: unknown, max: number) {
  return String(value ?? "").slice(0, max);
}

function isAdmin(user: unknown, password: unknown) {
  return String(user ?? "").trim().toLowerCase() === ADMIN_USER && String(password ?? "") === ADMIN_PASS;
}

export type SharedRequest = {
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

export type SharedAccount = {
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
  feeConfirmed?: boolean;
  psid?: string;
  note?: string;
  createdAt: string;
};

type RequestRow = {
  id: string;
  category: string;
  name: string;
  father: string;
  cnic: string;
  dob: string;
  phone: string;
  email: string;
  district: string;
  address: string;
  license_no: string;
  vehicle: string;
  status: string;
  psid: string;
  payment: string;
  created_at: string;
};

type AccountRow = {
  id: string;
  name: string;
  father: string;
  cnic: string;
  dob: string;
  gender: string;
  phone: string;
  email: string;
  district: string;
  address: string;
  license_type: string;
  photo: string;
  status: string;
  fee_confirmed: boolean;
  psid: string;
  note: string;
  created_at: string;
};

function requestStatus(value: string): SharedRequest["status"] {
  if (value === "processing" || value === "approved" || value === "rejected") return value;
  return "new";
}

function accountStatus(value: string): SharedAccount["status"] {
  if (value === "review" || value === "accepted" || value === "rejected") return value;
  return "pending";
}

function toRequest(row: RequestRow): SharedRequest {
  const category = row.category === "regular" || row.category === "international" ? row.category : "learner";
  return {
    id: row.id,
    category,
    name: row.name,
    father: row.father,
    cnic: row.cnic,
    dob: row.dob,
    phone: row.phone,
    email: row.email,
    district: row.district,
    address: row.address,
    licenseNo: row.license_no,
    vehicle: row.vehicle,
    status: requestStatus(row.status),
    psid: row.psid,
    payment: row.payment === "Paid" ? "Paid" : "Unpaid",
    createdAt: String(row.created_at),
  };
}

function toAccount(row: AccountRow): SharedAccount {
  return {
    id: row.id,
    name: row.name,
    father: row.father,
    cnic: row.cnic,
    dob: row.dob,
    gender: row.gender,
    phone: row.phone,
    email: row.email,
    password: "",
    district: row.district,
    address: row.address,
    licenseType: row.license_type,
    photo: row.photo,
    status: accountStatus(row.status),
    feeConfirmed: Boolean(row.fee_confirmed),
    psid: row.psid || "",
    note: row.note || "",
    createdAt: String(row.created_at),
  };
}

export const syncStamp = createServerFn({ method: "POST" })
  .validator((input: { user?: string; password?: string }) => input)
  .handler(async ({ data }) => {
    if (!isAdmin(data?.user, data?.password)) throw new Error("Not allowed");
    const sql = await getSql();
    const [licenses] = await sql<{ stamp: string; n: number }>`select coalesce(max(updated_at)::text, '') as stamp, count(*)::int as n from licenses`;
    const [requests] = await sql<{ stamp: string; n: number }>`select coalesce(max(updated_at)::text, '') as stamp, count(*)::int as n from service_requests`;
    const [accounts] = await sql<{ stamp: string; n: number }>`select coalesce(max(updated_at)::text, '') as stamp, count(*)::int as n from accounts`;
    return {
      licenses: `${licenses?.stamp ?? ""}:${licenses?.n ?? 0}`,
      requests: `${requests?.stamp ?? ""}:${requests?.n ?? 0}`,
      accounts: `${accounts?.stamp ?? ""}:${accounts?.n ?? 0}`,
    };
  });

export const submitRequest = createServerFn({ method: "POST" })
  .validator((input: { record?: SharedRequest }) => input)
  .handler(async ({ data }) => {
    const record = data?.record;
    if (!record?.id || !record.cnic) throw new Error("Request is incomplete");
    const sql = await getSql();
    await sql`
      insert into service_requests (
        id, category, name, father, cnic, dob, phone, email, district, address,
        license_no, vehicle, status, psid, payment
      ) values (
        ${clip(record.id, 80)},
        ${clip(record.category, 20)},
        ${clip(record.name, 160)},
        ${clip(record.father, 160)},
        ${clip(String(record.cnic).replace(/\D/g, ""), 20)},
        ${clip(record.dob, 20)},
        ${clip(record.phone, 30)},
        ${clip(record.email, 160)},
        ${clip(record.district, 80)},
        ${clip(record.address, 400)},
        ${clip(record.licenseNo, 40)},
        ${clip(record.vehicle, 40)},
        'new', '', 'Unpaid'
      )
      on conflict (id) do nothing
    `;
    return { ok: true as const };
  });

export const saveSharedRequest = createServerFn({ method: "POST" })
  .validator((input: { user?: string; password?: string; record?: SharedRequest }) => input)
  .handler(async ({ data }) => {
    if (!isAdmin(data?.user, data?.password)) throw new Error("Not allowed");
    const record = data?.record;
    if (!record?.id) throw new Error("Request is missing");
    const sql = await getSql();
    await sql`
      insert into service_requests (
        id, category, name, father, cnic, dob, phone, email, district, address,
        license_no, vehicle, status, psid, payment, updated_at
      ) values (
        ${clip(record.id, 80)},
        ${clip(record.category, 20)},
        ${clip(record.name, 160)},
        ${clip(record.father, 160)},
        ${clip(record.cnic, 20)},
        ${clip(record.dob, 20)},
        ${clip(record.phone, 30)},
        ${clip(record.email, 160)},
        ${clip(record.district, 80)},
        ${clip(record.address, 400)},
        ${clip(record.licenseNo, 40)},
        ${clip(record.vehicle, 40)},
        ${requestStatus(record.status)},
        ${clip(record.psid, 24)},
        ${record.payment === "Paid" ? "Paid" : "Unpaid"},
        now()
      )
      on conflict (id) do update set
        status = excluded.status,
        psid = excluded.psid,
        payment = excluded.payment,
        updated_at = now()
    `;
    return { ok: true as const };
  });

export const listSharedRequests = createServerFn({ method: "POST" })
  .validator((input: { user?: string; password?: string }) => input)
  .handler(async ({ data }) => {
    if (!isAdmin(data?.user, data?.password)) throw new Error("Not allowed");
    const sql = await getSql();
    const rows = await sql<RequestRow>`select id, category, name, father, cnic, dob, phone, email, district, address, license_no, vehicle, status, psid, payment, created_at::text as created_at from service_requests order by updated_at desc`;
    return rows.map(toRequest);
  });

export const submitAccount = createServerFn({ method: "POST" })
  .validator((input: { record?: SharedAccount & { password?: string } }) => input)
  .handler(async ({ data }) => {
    const record = data?.record;
    const cnic = String(record?.cnic ?? "").replace(/\D/g, "");
    const email = String(record?.email ?? "").trim().toLowerCase();
    const password = String(record?.password ?? "");
    if (!record?.id || cnic.length < 11 || !email || password.length < 6) throw new Error("Name, CNIC, email and a password of 6 or more characters are required.");
    const sql = await getSql();
    const existing = await sql<{ id: string }>`select id from accounts where cnic = ${cnic} or email = ${email} limit 1`;
    if (existing.length > 0) throw new Error("This CNIC or email is already registered.");
    await sql`
      insert into accounts (
        id, name, father, cnic, dob, gender, phone, email, password, district, address, license_type, photo, status
      ) values (
        ${clip(record.id, 80)},
        ${clip(record.name, 160)},
        ${clip(record.father, 160)},
        ${cnic},
        ${clip(record.dob, 20)},
        ${clip(record.gender, 20)},
        ${clip(record.phone, 30)},
        ${email},
        ${clip(password, 80)},
        ${clip(record.district, 80)},
        ${clip(record.address, 400)},
        ${clip(record.licenseType, 40)},
        ${clip(record.photo, 1_800_000)},
        'pending'
      )
    `;
    return { ok: true as const };
  });

export const loginAccount = createServerFn({ method: "POST" })
  .validator((input: { user?: string; password?: string }) => input)
  .handler(async ({ data }) => {
    const user = String(data?.user ?? "").trim();
    const password = String(data?.password ?? "");
    const cnic = user.replace(/\D/g, "");
    const email = user.toLowerCase();
    const sql = await getSql();
    const rows = await sql<{ name: string; cnic: string; status: string; password: string; note: string }>`
      select name, cnic, status, password, note from accounts where cnic = ${cnic} or email = ${email} limit 1
    `;
    const account = rows[0];
    if (!account || account.password !== password) return { ok: false as const, message: "Login details do not match." };
    if (account.status !== "accepted") {
      const note = account.note ? ` ${account.note}` : "";
      if (account.status === "rejected") return { ok: false as const, message: `This sign up was not accepted.${note}` };
      return { ok: false as const, message: `Sign up is waiting for admin approval. Login opens only after it is approved.${note}` };
    }
    return { ok: true as const, name: account.name, cnic: account.cnic, status: account.status };
  });

export const listSharedAccounts = createServerFn({ method: "POST" })
  .validator((input: { user?: string; password?: string }) => input)
  .handler(async ({ data }) => {
    if (!isAdmin(data?.user, data?.password)) throw new Error("Not allowed");
    const sql = await getSql();
    const rows = await sql<AccountRow>`
      select id, name, father, cnic, dob, gender, phone, email, district, address, license_type, photo, status, fee_confirmed, psid, note, created_at::text as created_at
      from accounts order by updated_at desc
    `;
    return rows.map(toAccount);
  });

export const saveSharedAccount = createServerFn({ method: "POST" })
  .validator((input: { user?: string; password?: string; id?: string; status?: string; feeConfirmed?: boolean; psid?: string; note?: string }) => input)
  .handler(async ({ data }) => {
    if (!isAdmin(data?.user, data?.password)) throw new Error("Not allowed");
    const id = clip(data?.id, 80);
    if (!id) throw new Error("Account is missing");
    const sql = await getSql();
    const psid = clip(data?.psid, 24);
    const hasNote = typeof data?.note === "string";
    const note = clip(data?.note, 500);
    if (typeof data?.feeConfirmed === "boolean" && !data?.status && !psid) {
      await sql`update accounts set fee_confirmed = ${data.feeConfirmed}, note = case when ${hasNote} then ${note} else note end, updated_at = now() where id = ${id}`;
    } else {
      await sql`update accounts set status = ${accountStatus(String(data?.status ?? "pending"))}, fee_confirmed = ${Boolean(data?.feeConfirmed)}, note = case when ${hasNote} then ${note} else note end, psid = case when ${psid} = '' then psid else ${psid} end, updated_at = now() where id = ${id}`;
    }
    return { ok: true as const };
  });
