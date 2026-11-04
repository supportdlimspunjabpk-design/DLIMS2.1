import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";

const ADMIN_USER = "support.dlims.punjab.pk@gmail.com";
const ADMIN_PASS = "Pakistan123$#@";

export type SharedLicense = {
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

type Row = {
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
  license_no: string;
  kind: string;
  vehicles: string;
  issue_date: string;
  valid_from: string;
  valid_to: string;
  status: string;
  tracking_no: string;
  printed_on: string;
  dispatch_on: string;
  handler: string;
  ecard: string;
  learner_permit: string;
  fee_confirmed: boolean;
};

function clip(value: unknown, max: number) {
  return String(value ?? "").slice(0, max);
}

function toRecord(row: Row): SharedLicense {
  return {
    id: row.id,
    cnic: row.cnic,
    name: row.name,
    father: row.father,
    dob: row.dob,
    district: row.district,
    address: row.address,
    phone: row.phone,
    email: row.email,
    photo: row.photo,
    licenseNo: row.license_no,
    kind: row.kind,
    vehicles: row.vehicles,
    issueDate: row.issue_date,
    validFrom: row.valid_from,
    validTo: row.valid_to,
    status: row.status,
    trackingNo: row.tracking_no,
    printedOn: row.printed_on,
    dispatchOn: row.dispatch_on,
    handler: row.handler,
    ecard: row.ecard || undefined,
    learnerPermit: row.learner_permit || undefined,
    feeConfirmed: Boolean(row.fee_confirmed),
  };
}

function isAdmin(user: unknown, password: unknown) {
  return String(user ?? "").trim().toLowerCase() === ADMIN_USER && String(password ?? "") === ADMIN_PASS;
}

async function ensureDemo(sql: Awaited<ReturnType<typeof getSql>>) {
  const existing = await sql<{ id: string }>`select id from licenses where id = 'demo-check-license' limit 1`;
  if (existing.length > 0) return;
  await sql`
    insert into licenses (
      id, cnic, name, father, dob, district, address, phone, email, photo,
      license_no, kind, vehicles, issue_date, valid_from, valid_to, status,
      tracking_no, printed_on, dispatch_on, handler
    ) values (
      'demo-check-license', '3520200000001', 'DEMO CHECK LICENSE', 'DEMO FATHER NAME',
      '1990-01-15', 'FAISALABAD', 'DEMO ADDRESS, FAISALABAD', '03000000000',
      'demo@dlims.local', '', 'FD-00-00001', 'REGULAR', 'M/CYCLE, CAR',
      '2025-05-13', '2025-05-13', '2027-05-13', 'Valid', 'PK000000001',
      '2025-05-14', '2025-05-16', 'Pakistan Post'
    )
    on conflict (id) do nothing
  `;
}

export const lookupLicense = createServerFn({ method: "POST" })
  .validator((input: { cnic?: string; dob?: string; licenseNo?: string }) => ({
    cnic: String(input?.cnic ?? "").replace(/\D/g, ""),
    dob: String(input?.dob ?? "").trim(),
    licenseNo: String(input?.licenseNo ?? "").replace(/\s/g, "").toLowerCase(),
  }))
  .handler(async ({ data }) => {
    if (data.cnic.length < 5) return null;
    const sql = await getSql();
    await ensureDemo(sql);
    const rows = await sql<Row>`select * from licenses where cnic = ${data.cnic}`;
    const match = rows.find((row) => {
      if (data.dob && row.dob && row.dob !== data.dob) return false;
      if (data.licenseNo && row.license_no.replace(/\s/g, "").toLowerCase() !== data.licenseNo) return false;
      return true;
    });
    return match ? toRecord(match) : null;
  });

export const listSharedLicenses = createServerFn({ method: "POST" })
  .validator((input: { user?: string; password?: string }) => input)
  .handler(async ({ data }) => {
    if (!isAdmin(data?.user, data?.password)) throw new Error("Not allowed");
    const sql = await getSql();
    await ensureDemo(sql);
    const rows = await sql<Row>`
      select id, cnic, name, father, dob, district, address, phone, email,
        case when octet_length(photo) > 90000 then '' else photo end as photo,
        license_no, kind, vehicles, issue_date, valid_from, valid_to, status,
        tracking_no, printed_on, dispatch_on, handler,
        case when octet_length(coalesce(ecard, '')) > 0 then 'keep' else '' end as ecard,
        case when octet_length(coalesce(learner_permit, '')) > 0 then 'keep' else '' end as learner_permit,
        fee_confirmed
      from licenses
      order by updated_at desc
    `;
    return rows.map(toRecord);
  });

export const saveSharedLicense = createServerFn({ method: "POST" })
  .validator((input: { user?: string; password?: string; record?: SharedLicense }) => input)
  .handler(async ({ data }) => {
    if (!isAdmin(data?.user, data?.password)) throw new Error("Not allowed");
    const record = data?.record;
    if (!record?.id) throw new Error("License is missing");
    const ecard = clip(record.ecard, 1_800_000);
    const photo = clip(record.photo, 1_800_000);
    const permit = clip(record.learnerPermit, 1_800_000);
    if ((record.ecard && ecard.length < String(record.ecard).length) || (record.photo && photo.length < String(record.photo).length)) {
      throw new Error("That picture is too large. Use a smaller photo.");
    }
    const sql = await getSql();
    await sql`
      insert into licenses (
        id, cnic, name, father, dob, district, address, phone, email, photo,
        license_no, kind, vehicles, issue_date, valid_from, valid_to, status,
        tracking_no, printed_on, dispatch_on, handler, ecard, learner_permit, fee_confirmed, updated_at
      ) values (
        ${clip(record.id, 80)},
        ${clip(String(record.cnic).replace(/\D/g, ""), 20)},
        ${clip(record.name, 160)},
        ${clip(record.father, 160)},
        ${clip(record.dob, 20)},
        ${clip(record.district, 80)},
        ${clip(record.address, 400)},
        ${clip(record.phone, 30)},
        ${clip(record.email, 160)},
        ${photo},
        ${clip(record.licenseNo, 40)},
        ${clip(record.kind, 40)},
        ${clip(record.vehicles, 160)},
        ${clip(record.issueDate, 20)},
        ${clip(record.validFrom, 20)},
        ${clip(record.validTo, 20)},
        ${clip(record.status, 40)},
        ${clip(record.trackingNo, 40)},
        ${clip(record.printedOn, 20)},
        ${clip(record.dispatchOn, 20)},
        ${clip(record.handler, 80)},
        ${ecard},
        ${permit},
        ${Boolean(record.feeConfirmed)},
        now()
      )
      on conflict (id) do update set
        cnic = excluded.cnic,
        name = excluded.name,
        father = excluded.father,
        dob = excluded.dob,
        district = excluded.district,
        address = excluded.address,
        phone = excluded.phone,
        email = excluded.email,
        photo = case when excluded.photo = '' then licenses.photo else excluded.photo end,
        license_no = excluded.license_no,
        kind = excluded.kind,
        vehicles = excluded.vehicles,
        issue_date = excluded.issue_date,
        valid_from = excluded.valid_from,
        valid_to = excluded.valid_to,
        status = excluded.status,
        tracking_no = excluded.tracking_no,
        printed_on = excluded.printed_on,
        dispatch_on = excluded.dispatch_on,
        handler = excluded.handler,
        ecard = case when excluded.ecard in ('', 'keep') then licenses.ecard else excluded.ecard end,
        learner_permit = case when excluded.learner_permit in ('', 'keep') then licenses.learner_permit else excluded.learner_permit end,
        fee_confirmed = excluded.fee_confirmed,
        updated_at = now()
    `;
    return { ok: true as const };
  });

export const removeSharedLicense = createServerFn({ method: "POST" })
  .validator((input: { user?: string; password?: string; id?: string }) => input)
  .handler(async ({ data }) => {
    if (!isAdmin(data?.user, data?.password)) throw new Error("Not allowed");
    const id = clip(data?.id, 80);
    if (!id || id === "demo-check-license") throw new Error("This record cannot be removed");
    const sql = await getSql();
    await sql`delete from licenses where id = ${id}`;
    return { ok: true as const };
  });
