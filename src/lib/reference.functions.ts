import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";

export type OfficeRow = { id: string; region: string; name: string; address: string; phone: string };
export type LibraryRow = { id: string; kind: string; title: string; filePath: string; note: string };
export type PenaltyRow = { code: number; violation: string; motorcycle: string; car: string; cab: string; other: string };
export type BriefRow = { id: string; title: string; body: string };

export type SiteReference = {
  offices: OfficeRow[];
  library: LibraryRow[];
  penalties: PenaltyRow[];
  briefs: BriefRow[];
};

export const loadReference = createServerFn({ method: "POST" })
  .validator((_input: unknown) => ({}))
  .handler(async (): Promise<SiteReference> => {
    const sql = await getSql();
    const offices = await sql<{ id: string; region: string; name: string; address: string; phone: string }>`
      select id, region, name, address, phone from offices order by sort
    `;
    const library = await sql<{ id: string; kind: string; title: string; file_path: string; note: string }>`
      select id, kind, title, file_path, note from library_items order by kind, title
    `;
    const penalties = await sql<PenaltyRow>`
      select code, violation, motorcycle, car, cab, other from penalties order by code
    `;
    const briefs = await sql<BriefRow>`
      select id, title, body from briefs order by sort
    `;
    return {
      offices,
      library: library.map((row) => ({
        id: row.id,
        kind: row.kind,
        title: row.title,
        filePath: row.file_path,
        note: row.note,
      })),
      penalties,
      briefs,
    };
  });
