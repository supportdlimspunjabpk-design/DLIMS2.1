import { useEffect, useState } from "react";

export function Qr({ value, caption }: { value: string; caption: string }) {
  const [src, setSrc] = useState("");

  useEffect(() => {
    let alive = true;
    void import("qrcode").then((mod) =>
      mod.toDataURL(value, { margin: 1, width: 220, errorCorrectionLevel: "M" }).then((url) => {
        if (alive) setSrc(url);
      }),
    );
    return () => {
      alive = false;
    };
  }, [value]);

  return (
    <div className="aspect-square w-full overflow-hidden rounded-lg border border-line bg-card p-1">
      {src ? (
        <img src={src} alt={caption} className="size-full object-contain" />
      ) : (
        <div className="size-full animate-pulse bg-paper" />
      )}
    </div>
  );
}
