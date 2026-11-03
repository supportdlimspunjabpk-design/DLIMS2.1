import type { InputHTMLAttributes, ReactNode } from "react";

export function OfficialBar() {
  return (
    <div className="flex items-center justify-between gap-3 bg-[#107C41] px-4 py-3 text-white md:px-8">
      <p className="text-[11px] leading-tight font-bold md:text-xs">
        All DLIMS
        <br />
        services are
        <br />
        Powered by
      </p>
      <p className="text-2xl leading-none font-black tracking-wide md:text-4xl">
        DLIMS <span className="text-[#F5BB18]">2.1</span>
      </p>
      <p className="text-right text-[11px] leading-tight font-black md:text-sm">
        ONE WINDOW
        <br />
        FOR ALL
        <br />
        SERVICES
      </p>
    </div>
  );
}

export function Heading({ title }: { title: string }) {
  return (
    <div className="mb-6 text-center">
      <h1 className="text-[1.7rem] leading-none font-black tracking-tight text-ink">{title}</h1>
      <div className="mx-auto mt-2 h-[3px] w-11 rounded-full bg-gold" />
    </div>
  );
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return <p className="mb-2 text-[1.05rem] leading-tight font-bold text-ink">{children}</p>;
}

export function Star() {
  return <span className="text-star"> *</span>;
}

export function TextBox(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded-md border border-line bg-white px-3 py-3 text-base text-ink outline-none placeholder:text-muted"
    />
  );
}

export function Go({ children, tone }: { children: ReactNode; tone: "gold" | "amber" }) {
  return (
    <button
      type="submit"
      className={`w-full rounded-full py-3.5 text-lg font-bold text-white ${tone === "gold" ? "bg-mustard" : "bg-gold"}`}
    >
      {children}
    </button>
  );
}

export function Art({ src, caption }: { src: string; caption?: string }) {
  return (
    <div className="mt-8 rounded-[1.25rem] bg-ill px-2 pt-3 pb-6">
      <img src={src} alt="" className="mx-auto w-full" />
      {caption ? <p className="text-center text-[1.7rem] leading-none font-black text-ink">{caption}</p> : null}
    </div>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="rounded-lg bg-pill px-3 py-3 text-sm font-semibold text-ink">
      {children}
    </p>
  );
}

export function Choice({
  name,
  label,
  checked,
  onChange,
}: {
  name: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex min-h-12 items-center gap-2 rounded-lg bg-pill px-3 py-2 text-[15px] leading-tight font-semibold text-ink">
      <input type="radio" name={name} checked={checked} onChange={onChange} className="sr-only" />
      <span
        className={`grid size-5 shrink-0 place-items-center rounded-full border-2 bg-white ${checked ? "border-radio" : "border-[#c5cad1]"}`}
      >
        {checked ? <span className="size-2.5 rounded-full bg-radio" /> : null}
      </span>
      <span>{label}</span>
    </label>
  );
}
