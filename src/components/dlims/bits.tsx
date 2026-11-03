import type { ButtonHTMLAttributes, ReactNode } from "react";

export const inputClass =
  "min-h-12 w-full rounded-xl border border-line bg-paper px-4 text-sm text-ink shadow-inner outline-none transition focus:border-leaf focus:ring-2 focus:ring-leaf/30";

export function Field({
  label,
  children,
}: {
  label: ReactNode;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-bold text-ink">{label}</span>
      {children}
    </label>
  );
}

export function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-3xl border border-line bg-card p-6 shadow-sm sm:p-8 ${className}`}>
      {children}
    </div>
  );
}

export function PageTitle({ title, kicker }: { title: string; kicker?: string }) {
  return (
    <div className="mb-6 text-center">
      {kicker ? (
        <p className="mb-2 text-xs font-black uppercase tracking-widest text-leaf">{kicker}</p>
      ) : null}
      <h1 className="text-3xl font-black tracking-tight text-ink">{title}</h1>
      <div className="mx-auto mt-2 h-1 w-12 rounded-full bg-gold" />
    </div>
  );
}

export function GoldButton({
  className = "",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gold px-4 font-black text-ink shadow-md transition hover:bg-gold-deep disabled:opacity-60 ${className}`}
      {...props}
    />
  );
}

export function LeafButton({
  className = "",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-leaf px-5 font-black text-on-leaf shadow-md transition hover:bg-leaf-deep disabled:opacity-60 ${className}`}
      {...props}
    />
  );
}

export function Seal({ className = "size-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="32" cy="32" r="23" fill="none" stroke="currentColor" strokeWidth="1" />
      <path
        d="M32 14c1.2 7 6 11 11 13-6 1.6-8.2 7-8.2 13.2 0-6.2-2.2-11.6-8.2-13.2 5-2 9.8-6 5.4-13z"
        fill="currentColor"
      />
      <path d="M18 44h28M22 49h20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function Alert({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="rounded-xl border border-danger/30 bg-danger/10 px-3 py-2 text-sm font-semibold text-danger">
      {children}
    </p>
  );
}
