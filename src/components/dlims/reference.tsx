import { useEffect, useMemo, useState } from "react";
import { loadReference, type SiteReference } from "@/lib/reference.functions";

function useReference() {
  const [data, setData] = useState<SiteReference | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let live = true;
    loadReference({ data: {} })
      .then((value) => {
        if (live) setData(value);
      })
      .catch(() => {
        if (live) setError("Records could not be loaded. Refresh the page.");
      });
    return () => {
      live = false;
    };
  }, []);
  return { data, error };
}

export function Briefs() {
  const { data, error } = useReference();
  if (error) return <p className="text-sm text-[#9b1c1c]">{error}</p>;
  if (!data) return <p className="text-sm text-ink/60">Loading the DLIMS record…</p>;
  return (
    <div className="mx-auto max-w-5xl space-y-4">
      {data.briefs.map((brief) => (
        <details key={brief.id} open={brief.id !== "status"} className="rounded-2xl bg-white p-4">
          <summary className="cursor-pointer text-lg font-black text-[#157a38]">{brief.title}</summary>
          <p className="mt-3 text-sm leading-relaxed whitespace-pre-wrap text-ink">{brief.body}</p>
        </details>
      ))}
    </div>
  );
}

export function Offices() {
  const { data, error } = useReference();
  const [query, setQuery] = useState("");
  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const all = data?.offices ?? [];
    if (!q) return all;
    return all.filter((row) => `${row.region} ${row.name} ${row.address} ${row.phone}`.toLowerCase().includes(q));
  }, [data, query]);
  return (
    <section className="mx-auto max-w-5xl">
      <h1 className="mb-2 text-center text-3xl font-black text-leaf">Licensing offices</h1>
      <p className="mb-4 text-center text-sm text-ink/70">Contacts stored in the site database. Search by district, region or number.</p>
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search Sahiwal, Rawalpindi, 040…"
        className="mb-4 w-full rounded-xl border border-line bg-white px-3 py-3"
        aria-label="Search licensing offices"
      />
      {error ? <p className="text-sm text-[#9b1c1c]">{error}</p> : null}
      {!data && !error ? <p className="text-sm text-ink/60">Loading offices…</p> : null}
      <div className="grid gap-3 md:grid-cols-2">
        {rows.map((row) => (
          <article key={row.id} className="rounded-2xl bg-white p-4">
            {row.region ? <p className="text-xs font-black tracking-wide text-[#b8962e]">{row.region}</p> : null}
            <h2 className="font-black text-ink">{row.name}</h2>
            {row.address ? <p className="mt-1 text-sm text-ink/70">{row.address}</p> : null}
            <a href={`tel:${row.phone.replace(/[^\d+]/g, "").split("/")[0]}`} className="mt-2 block text-sm font-bold text-[#157a38]">
              {row.phone}
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

export function LibrarySection() {
  const { data, error } = useReference();
  if (error) return <p className="text-sm text-[#9b1c1c]">{error}</p>;
  if (!data) return <p className="text-sm text-ink/60">Loading downloads…</p>;
  const signs = data.library.filter((item) => item.kind === "sign");
  const files = data.library.filter((item) => item.kind !== "sign");
  return (
    <div className="mx-auto mt-10 max-w-5xl space-y-8">
      <section>
        <h2 className="mb-3 text-2xl font-black">Road signs</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {signs.map((item) => (
            <a key={item.id} href={item.filePath} className="rounded-2xl bg-white p-3" download>
              <img src={item.filePath} alt={item.title} className="w-full rounded-xl object-contain" />
              <p className="mt-2 text-center text-sm font-black">{item.title}</p>
            </a>
          ))}
        </div>
      </section>
      <section>
        <h2 className="mb-1 text-2xl font-black">Offences and penalties</h2>
        <p className="mb-3 text-sm text-ink/70">Twelfth Schedule of Ordinance XIX of 1965, as supplied. Fines by vehicle class.</p>
        <div className="overflow-x-auto rounded-2xl bg-white">
          <table className="w-full min-w-[720px] text-left text-xs">
            <thead className="bg-[#157a38] text-white">
              <tr>
                <th className="px-2 py-2">Code</th>
                <th className="px-2 py-2">Violation</th>
                <th className="px-2 py-2">Motorcycle</th>
                <th className="px-2 py-2">Car / jeep</th>
                <th className="px-2 py-2">Cab / rickshaw / agri</th>
                <th className="px-2 py-2">Other</th>
              </tr>
            </thead>
            <tbody>
              {data.penalties.map((row) => (
                <tr key={row.code} className="border-t border-line">
                  <td className="px-2 py-2 font-black">{row.code}</td>
                  <td className="px-2 py-2">{row.violation}</td>
                  <td className="px-2 py-2">{row.motorcycle}</td>
                  <td className="px-2 py-2">{row.car}</td>
                  <td className="px-2 py-2">{row.cab}</td>
                  <td className="px-2 py-2">{row.other}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section>
        <h2 className="mb-3 text-2xl font-black">Papers and forms</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {files.map((item) => (
            <a key={item.id} href={item.filePath} download className="rounded-2xl bg-white p-4">
              <p className="font-black text-[#157a38]">{item.title}</p>
              <p className="mt-1 text-sm text-ink/70">{item.note}</p>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
