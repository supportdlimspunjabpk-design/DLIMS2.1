import { createServerFn } from "@tanstack/react-start";

const ADMIN_USER = "support.dlims.punjab.pk@gmail.com";
const ADMIN_PASS = "Pakistan123$#@";

function isAdmin(user: unknown, password: unknown) {
  return String(user ?? "").trim().toLowerCase() === ADMIN_USER && String(password ?? "") === ADMIN_PASS;
}

export const readCardScan = createServerFn({ method: "POST" })
  .validator((input: { user?: string; password?: string; image?: string }) => input)
  .handler(async ({ data }) => {
    if (!isAdmin(data?.user, data?.password)) throw new Error("Not allowed");
    const raw = String(data?.image || "");
    const b64 = raw.includes(",") ? raw.split(",")[1] || "" : raw;
    if (b64.length < 100) throw new Error("Card photo is missing.");
    if (b64.length > 2_000_000) throw new Error("Card photo is too large.");
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) throw new Error("Card scan is not configured.");
    const payload = {
      contents: [
        {
          role: "user",
          parts: [
            { text: "Read this Pakistani CNIC or driving licence and return only the JSON object." },
            { inlineData: { mimeType: "image/jpeg", data: b64 } },
          ],
        },
      ],
      systemInstruction: {
        parts: [
          {
            text: 'Return JSON with these string fields only: documentType, cnicNumber, cnicRaw, fullName, fatherOrHusbandName, dateOfBirth, issueDate, expiryDate, address, licenseNumber, allowedVehicles. Use "" when a field is not on the card. cnicRaw is 13 digits with no dashes.',
          },
        ],
      },
      generationConfig: { responseMimeType: "application/json" },
    };
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${encodeURIComponent(apiKey)}`,
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) },
    );
    if (!response.ok) throw new Error("The card could not be read.");
    const result = (await response.json()) as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("No details were found on this card.");
    const parsed = JSON.parse(text) as Record<string, string>;
    return {
      documentType: String(parsed.documentType || ""),
      cnicNumber: String(parsed.cnicNumber || ""),
      cnicRaw: String(parsed.cnicRaw || ""),
      fullName: String(parsed.fullName || ""),
      fatherOrHusbandName: String(parsed.fatherOrHusbandName || ""),
      dateOfBirth: String(parsed.dateOfBirth || ""),
      issueDate: String(parsed.issueDate || ""),
      expiryDate: String(parsed.expiryDate || ""),
      address: String(parsed.address || ""),
      licenseNumber: String(parsed.licenseNumber || ""),
      allowedVehicles: String(parsed.allowedVehicles || ""),
    };
  });
