import { useState } from "react";
import { Bike, Bus, Car, Tractor, Truck, Accessibility } from "lucide-react";
import { Briefs, LibrarySection } from "@/components/dlims/reference";

const FAQ = [
  {
    q: "What documents are required for the online application process?",
    a: [
      "Picture (Face)",
      "Scanned copy/picture of Original CNIC's front",
      "Scanned copy/picture of Original CNIC's back",
      "Medical Certificate signed by a government doctor in case age is above 50 years",
    ],
  },
  {
    q: "How can I apply for an online learner driving license?",
    a: ["Create an account, fill the learner application, generate a PSID, pay, then print the learner license from the system."],
  },
  {
    q: "What are the fees associated with applying for an online learner driving license?",
    a: ["Fees depend on the vehicle category. Open Fee Structure for the regular, renewal, duplicate, and international tables."],
  },
  {
    q: "How long does it take to receive the online learner driving license after applying?",
    a: ["After payment confirmation the application is reviewed. You are notified when it is approved."],
  },
  {
    q: "How will I get/download my learner driving license after filling the form and making payment?",
    a: ["Once approved, print the learner license directly from the system."],
  },
  {
    q: "Are there any specific guidelines for uploading documents in the online application?",
    a: ["Upload a face picture, both sides of the original CNIC, and a medical certificate when the applicant is over 50."],
  },
] as const;

const STEPS = {
  learner: [
    ["STEP 1", "Create Account & Login", "Begin your driving journey: sign up or log in to access our online platform. Streamlined processes await, so start today for a smoother path to driving."],
    ["STEP 2", "Fill Application Form", "Fill out your application form accurately with the required details. Ensure a smooth process for your learner's license application."],
    ["STEP 3", "Generate PSID", "After submitting your application, a unique PSID (Public Service Identifier) will be generated for reference and processing."],
    ["STEP 4", "Payment Confirmation", "Following the submission, once the payment for your application is successfully processed, you'll receive a payment confirmation."],
    ["STEP 5", "Print Learner", "Obtain a physical copy of your learner's license by printing it directly from our system. Get ready to hit the road safely!"],
  ],
  regular: [
    ["STEP 1", "Create Account & Login", "Begin your driving journey: sign up or log in to access our online platform. Streamlined processes await, so start today for a smoother path to driving."],
    ["STEP 2", "Fill Application Form", "Fill out your application form accurately with the required details. Ensure a smooth process for your learner's license application."],
    ["STEP 3", "Generate PSID", "After submitting your application, a unique PSID (Public Service Identifier) will be generated for reference and processing."],
    ["STEP 4", "Payment Confirmation", "Following the submission, once the payment for your application is successfully processed, you'll receive a payment confirmation."],
    ["STEP 5", "Approval", "Subsequently, your application undergoes an administrative review. Upon approval, you'll be notified that your application has been approved by the administration."],
    ["STEP 6", "Processing & Dispatch", "Finally, once approved, your driving license application will be processed and dispatched to you accordingly."],
  ],
} as const;

export function FaqList() {
  const [open, setOpen] = useState(0);
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-white">
      {FAQ.map((item, index) => {
        const on = open === index;
        return (
          <div key={item.q} className="border-b border-line last:border-b-0">
            <button
              type="button"
              className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold"
              onClick={() => setOpen(on ? -1 : index)}
            >
              <span className="text-muted">{index + 1}</span>
              <span className="flex-1">{item.q}</span>
              <span className="text-muted">{on ? "⌃" : "⌄"}</span>
            </button>
            {on ? (
              <ul className="list-disc px-10 pb-3 text-sm text-ink/80">
                {item.a.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export function Steps({ kind }: { kind: keyof typeof STEPS }) {
  const rows = STEPS[kind];
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {rows.map(([step, title, body]) => (
        <div key={step} className="flex gap-3">
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-leaf-soft text-leaf">
            <span className="text-xs font-black">{step.replace("STEP ", "")}</span>
          </span>
          <div>
            <p className="text-xs font-black tracking-wide text-leaf">{step}</p>
            <p className="font-black">{title}</p>
            <p className="mt-1 text-sm leading-relaxed text-ink/70">{body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function Home({ onOpen, onMenu }: { onOpen: (id: "services" | "apply-learner" | "apply-regular" | "apply-international" | "about" | "how" | "faq" | "downloads" | "fees" | "elicense" | "track" | "verify" | "login" | "signup") => void; onMenu: () => void }) {
  return (
    <div className="bg-[#f4f6f8] font-[Poppins,system-ui,sans-serif] text-[#1a1a1a]">
      <div className="brand-marquee banner-flow" aria-label="DLIMS, Dastak and Traffic Police Punjab">
        <div className="brand-track">
          <div className="brand-slide flex items-center justify-between gap-2 px-3 text-white">
            <p className="text-[11px] leading-tight font-bold">
              All DLIMS
              <br />
              services are
              <br />
              Powered by
            </p>
            <p className="text-2xl leading-none font-black tracking-wide">
              <span className="mark-dlims">DLIMS</span> <span className="mark-ver">2.1</span>
            </p>
            <p className="text-right text-[11px] leading-tight font-black">
              ONE WINDOW
              <br />
              FOR ALL
              <br />
              SERVICES
            </p>
          </div>
          <div className="brand-slide flex items-center justify-center">
            <img src="/dlims/logo-dastak-banner.png" alt="Dastak" className="h-14 object-contain" />
          </div>
          <div className="brand-slide flex items-center justify-center gap-2 px-3 text-white">
            <img src="/dlims/logo-traffic.png" alt="" className="h-12 object-contain" />
            <p className="text-xs leading-tight font-black">
              TRAFFIC POLICE
              <br />
              PUNJAB
            </p>
          </div>
        </div>
      </div>
      <div className="banner-edge" />
      <header className="sticky top-0 z-30 border-b border-[#e8ece9] bg-[#f4f6f8] px-3 py-2 md:px-8">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-black tracking-wide text-[#1b7a3d] md:text-lg">DLIMS 2.1</p>
          <button type="button" aria-label="Menu" onClick={onMenu} className="flex size-14 shrink-0 flex-col items-center justify-center gap-[5px] rounded-2xl border border-[#c8c8c8] bg-white shadow-sm">
            <span className="block h-[2.5px] w-6 rounded-full bg-[#1a1a1a]" />
            <span className="block h-[2.5px] w-6 rounded-full bg-[#1a1a1a]" />
            <span className="block h-[2.5px] w-6 rounded-full bg-[#1a1a1a]" />
          </button>
        </div>
        <nav className="mt-3 hidden flex-wrap items-center gap-2 md:flex">
          {(
            [
              ["about", "About us"],
              ["how", "How it works"],
              ["faq", "FAQ"],
              ["downloads", "Downloads"],
              ["fees", "Fee Structure"],
            ] as const
          ).map(([id, label]) => (
            <button key={id} type="button" onClick={() => onOpen(id)} className="rounded-full px-3 py-1 text-sm font-bold">
              {label}
            </button>
          ))}
          <button type="button" onClick={() => onOpen("elicense")} className="rounded-full bg-white px-3 py-1 text-sm font-bold">e-License</button>
          <button type="button" onClick={() => onOpen("track")} className="rounded-full bg-white px-3 py-1 text-sm font-bold">Track Application</button>
          <button type="button" onClick={() => onOpen("verify")} className="rounded-full bg-[#f5c400] px-3 py-1 text-sm font-bold text-white">Verify License</button>
          <button type="button" onClick={() => onOpen("login")} className="rounded-full border border-[#c5cfc8] px-3 py-1 text-sm font-bold">Login</button>
          <button type="button" onClick={() => onOpen("signup")} className="rounded-full bg-[#157a38] px-3 py-1 text-sm font-bold text-white">Sign up</button>
        </nav>
      </header>

      <section className="mx-auto grid w-full max-w-6xl items-start gap-6 px-4 pt-6 md:grid-cols-[280px_1fr] md:px-8">
        <aside className="grid gap-3">
          {[
            ["https://dlims.punjab.gov.pk/", "/dlims/logo-dlims.png", "DLIMS 2.0"],
            ["https://dastak.punjab.gov.pk/", "/dlims/logo-dastak.png", "Dastak"],
            ["https://trafficpolice.punjab.gov.pk/", "/dlims/logo-traffic.png", "Traffic Police Punjab"],
          ].map(([href, src, name]) => (
            <a key={name} href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-2xl bg-transparent px-1 py-1">
              <img src={src} alt="" className="h-16 w-16 shrink-0 object-contain" />
              <span>
                <span className="block text-sm font-black text-[#1b7a3d]">{name}</span>
                <span className="block text-[11px] font-semibold leading-tight text-[#333]">Click here to open this portal</span>
              </span>
            </a>
          ))}
        </aside>
        <div className="grid items-center gap-4 md:grid-cols-[1fr_auto]">
          <div className="text-center md:text-left">
            <h1 className="text-[22px] leading-tight font-extrabold tracking-wide text-[#111] uppercase md:text-4xl">
              ONE WINDOW FOR ALL
              <span className="block">DRIVING LICENSE SERVICES</span>
            </h1>
            <button type="button" onClick={() => onOpen("elicense")} className="mx-auto mt-4 block w-[168px] md:mx-0" aria-label="Check e-License">
              <img src="/dlims/logo-21.png" alt="DLIMS 2.1" className="w-full object-contain" />
            </button>
            <p className="mt-2 text-sm font-bold text-[#157a38]">Click here to check your e-License</p>
            <span className="click-blink mt-1 inline-flex flex-col items-center text-2xl leading-none font-black text-[#e0a020]" aria-hidden="true">
              ▼
              <span className="text-[11px] tracking-[0.2em]">CLICK</span>
            </span>
          </div>
          <img src="/dlims/portrait-page.jpg" alt="" className="mx-auto h-64 w-[220px] object-contain object-bottom md:h-[380px] md:w-auto" />
        </div>
      </section>

      <section className="px-5 pt-2 pb-6 text-center md:mx-auto md:max-w-3xl md:text-left">
        <h2 className="mb-3 text-[15px] font-bold tracking-[4px] text-[#b8962e]">FEATURES</h2>
        <h3 className="text-lg font-extrabold text-[#157a38]">Dastak-Powered Processing</h3>
        <p className="mt-1 text-sm leading-relaxed text-[#333]">Every request you submit is processed securely and systematically through Dastak — one window for all government services.</p>
        <h3 className="mt-4 text-lg font-extrabold text-[#157a38]">Effortless Application Process</h3>
        <p className="mt-1 text-sm leading-relaxed text-[#333]">Apply for your driving license from the comfort of your home. Skip the queues and paperwork with our streamlined online application process.</p>
      </section>

      <AboutPanel />

      <footer className="relative overflow-hidden bg-gradient-to-b from-[#1f9e4a] to-[#157a38] px-4 pt-8 pb-8 text-white">
        <div className="pointer-events-none absolute inset-x-0 -top-4 h-8 rounded-b-[100%] bg-[#f4f6f8]" />
        <div className="relative grid gap-5 md:mx-auto md:max-w-6xl md:grid-cols-2 md:px-6">
          <div>
            <img src="/dlims/logo-dastak-banner.png" alt="Dastak" className="mb-2 h-12 object-contain" />
            <p className="max-w-[280px] text-[11px] leading-relaxed">
              The Driving License Information Management System (DLIMS) is an integrated component of the Government of Punjab’s Dastak – One Window for all Government Services which securely carries out all DLIMS processes including form submission, verification, payment, and card tracking.
            </p>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold">For driving license-related queries, please contact us at</p>
            <ul className="space-y-1 text-[11.5px]">
              <li>Emergency Number: <strong>15</strong></li>
              <li>Phone Number: <a className="underline" href="tel:+924299202892">042-99202892</a></li>
              <li>Email: <a className="underline" href="mailto:info@dlims.punjab.gov.pk">info@dlims.punjab.gov.pk</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function Portal({ onOpen }: { onOpen: (id: "elicense" | "track" | "verify" | "fees" | "downloads" | "how") => void }) {
  const links = [
    ["elicense", "e-Licence"],
    ["track", "Track Application"],
    ["verify", "Verify License"],
    ["fees", "Fee Structure"],
    ["downloads", "Downloads"],
    ["how", "How it works"],
  ] as const;
  return (
    <div className="mx-auto max-w-lg text-center">
      <p className="text-xs font-black tracking-[0.25em] text-[#b8962e]">OUR PORTAL</p>
      <h1 className="mt-2 text-3xl font-black text-leaf">DLIMS 2.1</h1>
      <p className="mt-2 text-sm text-ink/70">Traffic Police Punjab — one window for driving licence services.</p>
      <div className="mt-6 grid gap-3">
        {links.map(([id, label]) => (
          <button key={id} type="button" onClick={() => onOpen(id)} className="rounded-full bg-[#157a38] py-3 font-bold text-white">
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function KindSwitch({
  kind,
  setKind,
}: {
  kind: "learner" | "regular" | "international";
  setKind: (value: "learner" | "regular" | "international") => void;
}) {
  return (
    <div className="mb-4 flex justify-center gap-2">
      {(
        [
          ["learner", "Learner License"],
          ["regular", "Regular License"],
          ["international", "International License"],
        ] as const
      ).map(([id, label]) => (
        <button
          key={id}
          type="button"
          onClick={() => setKind(id)}
          className={`rounded-md px-3 py-2 text-xs font-bold ${kind === id ? "bg-leaf text-white" : "border border-line bg-white"}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

const ABOUT_FEATURES = [
  ["1. Unified Service Delivery", "6. Automated Verification"],
  ["2. Digital Form Submission", "7. Real-time Card Tracking"],
  ["3. Secure Payment Gateway", "8. Doorstep Delivery Integration."],
  ["4. Real-time Card Integration.", ""],
] as const;

export function AboutPanel() {
  return (
    <section className="mx-auto max-w-5xl overflow-hidden bg-white">
      <h1 className="bg-[#1f9e4a] px-4 py-4 text-center text-4xl font-black text-white md:text-5xl">About DLIMS</h1>
      <div className="flex flex-wrap items-center justify-center gap-4 border-b border-[#eee] px-4 py-5">
        <span className="flex items-center gap-2">
          <img src="/dlims/logo-dlims.png" alt="" className="h-16 w-16 object-contain" />
          <span>
            <strong className="block text-xl leading-none">DLIMS 2.1</strong>
            <span className="block max-w-[150px] text-[10px] leading-tight text-[#1b7a3d]">Driving License Information Management System</span>
          </span>
        </span>
        <img src="/dlims/logo-dastak.png" alt="Dastak" className="h-14 object-contain" />
        <img src="/dlims/logo-punjab.png" alt="Government of Punjab" className="h-16 w-16 object-contain" />
        <span className="flex items-center gap-2 text-xs font-black text-[#1b7a3d]">
          <img src="/dlims/logo-traffic.png" alt="" className="h-16 w-16 object-contain" />
          TRAFFIC
          <br />
          POLICE
          <br />
          PUNJAB
        </span>
      </div>
      <div className="grid gap-4 px-5 py-5 md:grid-cols-[1.4fr_0.8fr]">
        <div>
          <p className="text-sm leading-relaxed md:text-base">
            The Driving License Information Management System (DLIMS 2.1) is a unified platform integrated with the Government of Punjab’s Dastak initiative. Powered collaboratively by DLIMS, Maryam Ki Dastak, and Traffic Police Punjab, this system securely streamlines the entire driving license lifecycle. It provides citizens with hassle-free access to digital form submission, automated document verification, secure payment processing, and real-time card tracking.
          </p>
          <p className="mt-4 inline-block rounded-lg bg-[#163a86] px-3 py-1 text-sm font-bold text-white">DLIMS 2.1 Key Features:</p>
          <div className="mt-3 grid gap-x-6 sm:grid-cols-2">
            <ol className="space-y-1 text-sm font-bold text-[#157a38]">
              {ABOUT_FEATURES.map(([left]) => (
                <li key={left}>{left}</li>
              ))}
            </ol>
            <ol className="space-y-1 text-sm font-bold text-[#157a38]">
              {ABOUT_FEATURES.map(([, right]) => (right ? <li key={right}>{right}</li> : null))}
            </ol>
          </div>
        </div>
        <img src="/dlims/verify-art.jpg" alt="" className="mx-auto w-full max-w-xs object-contain" />
      </div>
    </section>
  );
}

export function About() {
  return (
    <div className="space-y-6">
      <AboutPanel />
      <Briefs />
    </div>
  );
}

export function How() {
  const [kind, setKind] = useState<"learner" | "regular" | "international">("learner");
  return (
    <section className="rounded-2xl border border-line bg-white p-4 md:p-6">
      <KindSwitch kind={kind} setKind={setKind} />
      <Steps kind={kind === "learner" ? "learner" : "regular"} />
    </section>
  );
}

export function FaqPage() {
  return (
    <section className="mx-auto max-w-3xl">
      <h1 className="mb-4 text-center text-3xl font-black text-leaf">Frequently asked questions</h1>
      <FaqList />
    </section>
  );
}

export function MedicalForm() {
  return (
    <article className="mx-auto max-w-3xl bg-white p-4 text-sm leading-relaxed text-ink md:p-8">
      <h1 className="text-center text-2xl font-black">FORM B</h1>
      <p className="text-center text-xs font-bold">(SEE SECTION 7(3) AND SECTION (2))</p>
      <p className="mt-2 text-center text-sm font-black">NATIONAL IDENTITY CARD NUMBER</p>
      <IdBoxes />
      <p className="mt-4">
        Form of Medical Certificate in respect of application for a license to drive any transport vehicle or to drive any vehicle as paid employee or otherwise:
      </p>
      <p className="mt-2 font-black">TO BE FILLED IN BY A REGISTERED MEDICAL PRACTITIONER</p>
      <ol className="mt-3 list-decimal space-y-3 pl-5">
        <li>What is apparent age of the applicant? <Line /></li>
        <li>Is the applicant, to best of your judgment, subjected to epilepsy, vertigo, chronic ill-health likely to effect his/her efficiency? <Line /></li>
        <li>Does the applicant suffer from any heart or lung disorder which might effect the performance of his/her duties as a driver? <Line /></li>
        <li>
          (A) Is there any defect of sightedness, if so, has it been corrected by using suitable spectacles? <Line />
          (B) Does the applicant suffer from a degree of deafness which would prevent his/her hearing of ordinary sound signals? <Line />
        </li>
        <li>Does the applicant have any deformity or loss of members, which effects the performance of his/her duties as a driver? <Line /></li>
        <li>Does the applicant possess any evidence of being addicted to the excessive use of alcohol, tobacco or drugs? <Line /></li>
        <li>In your opinion, he/she is generally fit as regards (a) bodily in health, and (b) eyesight? <Line /></li>
        <li>Marks of identification. <Line /></li>
        <li>Blood Group <Line /></li>
      </ol>
      <p className="mt-4">
        I certify that to the best of my knowledge and belief the applicant <span className="inline-block min-w-40 border-b border-ink" /> is the person here as above described and that the attached photograph is a reasonably correct likeness.
      </p>
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="grid h-36 place-items-center border border-ink text-center text-xs font-bold">
          SPACE
          <br />
          FOR
          <br />
          PHOTOGRAPH
        </div>
        <div className="space-y-2">
          <p>SIGNATURE <Line /></p>
          <p>NAME <Line /></p>
          <p>R.M.P NO. <Line /></p>
          <p className="font-bold">DOCTOR'S NATIONAL IDENTITY CARD NO.</p>
          <IdBoxes />
          <p>Date <Line /></p>
        </div>
      </div>
      <p className="mt-6 text-center text-xs text-ink/70">Print this form and have a registered medical practitioner complete it.</p>
    </article>
  );
}

function Line() {
  return <span className="mt-1 block border-b border-ink/70" />;
}

function IdBoxes() {
  const cells = [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1];
  return (
    <div className="mt-2 flex justify-center gap-0.5">
      {cells.map((box, index) =>
        box ? (
          <span key={index} className="size-5 border border-ink" />
        ) : (
          <span key={index} className="px-0.5">
            —
          </span>
        ),
      )}
    </div>
  );
}

export function Downloads() {
  return (
    <section className="mx-auto max-w-3xl">
      <h1 className="mb-2 text-center text-3xl font-black">Downloads</h1>
      <p className="mb-4 text-center text-sm text-ink/70">Medical certificate Form B. Print it and have a registered doctor fill it.</p>
      <button type="button" onClick={() => window.print()} className="mb-4 rounded-full bg-leaf px-5 py-2 text-sm font-bold text-white">
        Print Form B
      </button>
      <MedicalForm />
      <LibrarySection />
    </section>
  );
}

type Row = { name: string; cells: string[] };

const REGULAR: Row[] = [
  ["M/Cycle", "50", "450", "480", "930"],
  ["Rickshaw", "100", "400", "480", "880"],
  ["Car/Jeep", "15", "1350", "480", "1830"],
  ["Tractor Agri", "50", "950", "480", "1430"],
  ["Tractor Commercial", "100", "1400", "480", "1880"],
  ["LTV", "15", "1850", "480", "2330"],
  ["Invalid Carriage", "0", "0", "480", "480"],
  ["M/Cycle+Car/Jeep", "200", "1350", "480", "1830"],
  ["M/Cycle+LTV", "200", "1850", "480", "2330"],
].map(([name, ...cells]) => ({ name, cells: cells.map((n) => (n === "0" ? "Rs. 0" : `Rs. ${n}`)) }));

const RENEW: Row[] = [
  ["M/Cycle", "450", "225", "450", "1125", "480", "930"],
  ["Tractor Commercial", "1400", "700", "1400", "3500", "480", "1880"],
  ["Rickshaw", "400", "200", "400", "1000", "480", "880"],
  ["Car/Jeep", "1350", "675", "1350", "3375", "480", "1830"],
  ["M/Cycle+M/Car", "1350", "675", "1350", "3375", "480", "1830"],
  ["Agriculture", "1350", "675", "1350", "3375", "480", "1830"],
  ["LTV", "1850", "925", "1850", "4625", "480", "2330"],
  ["M/Cycle+LTV", "1850", "925", "1850", "4625", "480", "2330"],
  ["LTV + PSV", "1850", "925", "1850", "4625", "480", "2330"],
  ["M/Cycle+LTV+Trac Com", "1850", "925", "1850", "4625", "480", "2330"],
  ["HTV", "1850", "925", "1850", "4625", "480", "2330"],
  ["M/Cycle+PSV", "1850", "925", "1850", "4625", "480", "2330"],
  ["HTV + PSV", "1850", "925", "1850", "4625", "480", "2330"],
  ["Tractor Agri", "980", "475", "950", "2375", "480", "1430"],
  ["Invalid Carriage", "Free", "Free", "Free", "Free", "480", "480"],
].map(([name, ...cells]) => ({
  name,
  cells: cells.map((n) => (n === "Free" ? "Free" : `Rs. ${n}`)),
}));

const DUPLICATE: Row[] = [
  ["M/Cycle", "100", "480", "580"],
  ["Tractor Commercial", "100", "480", "580"],
  ["Rickshaw", "100", "480", "580"],
  ["Car/Jeep", "150", "480", "630"],
  ["M/Cycle+M/Car", "200", "480", "680"],
  ["Agriculture", "200", "480", "680"],
  ["LTV", "150", "480", "630"],
  ["M/Cycle+LTV", "200", "480", "680"],
  ["LTV + PSV", "200", "480", "680"],
  ["M/Cycle+LTV+Trac Com", "200", "480", "680"],
  ["HTV", "200", "480", "680"],
  ["M/Cycle+PSV", "200", "480", "680"],
  ["HTV + PSV", "200", "480", "680"],
  ["Tractor Agri", "200", "480", "680"],
  ["Invalid Carriage", "Free", "480", "480"],
].map(([name, ...cells]) => ({
  name,
  cells: cells.map((n) => (n === "Free" ? "Free" : `Rs. ${n}`)),
}));

const INTL: Row[] = [
  ["M/Cycle", "450", "480", "930", "1350", "1830"],
  ["Tractor Commercial", "1400", "480", "1880", "4200", "4680"],
  ["Rickshaw", "400", "480", "880", "1200", "1680"],
  ["Car/Jeep", "1350", "480", "1830", "4050", "4530"],
  ["M/Cycle+M/Car", "1350", "480", "1830", "4050", "4530"],
  ["Agriculture", "1350", "480", "1830", "4050", "4530"],
  ["LTV", "1850", "480", "2330", "5550", "6030"],
  ["M/Cycle+LTV", "1850", "480", "2330", "5550", "6030"],
  ["LTV + PSV", "1850", "480", "2330", "5550", "6030"],
  ["M/Cycle+LTV+Trac Com", "1850", "480", "2330", "5550", "6030"],
  ["HTV", "1850", "480", "2330", "5550", "6030"],
  ["M/Cycle+PSV", "1850", "480", "2330", "5550", "6030"],
  ["HTV + PSV", "1850", "480", "2330", "5550", "6030"],
  ["Tractor Agri", "950", "480", "1430", "2850", "3330"],
  ["Invalid Carriage", "Free", "480", "480", "Free", "480"],
].map(([name, ...cells]) => ({
  name,
  cells: cells.map((n) => (n === "Free" ? "Free" : `Rs. ${n}`)),
}));

function CatIcon({ name }: { name: string }) {
  const n = name.toLowerCase();
  const Icon = n.includes("invalid") ? Accessibility : n.includes("htv") || n.includes("bus") || n.includes("trac com") ? Bus : n.includes("tractor") || n.includes("agri") ? Tractor : n.includes("rick") ? Truck : n.includes("cycle") && !n.includes("car") && !n.includes("ltv") ? Bike : Car;
  return <Icon className="size-4 shrink-0" aria-hidden="true" />;
}

function Table({ title, note, headers, rows, id }: { title: string; note?: string; headers: string[]; rows: Row[]; id: string }) {
  return (
    <section id={id} className="mt-8">
      <p className="text-center text-sm text-ink/60">Fee Structure</p>
      <h2 className="text-center text-xl font-black">{title}</h2>
      {note ? <p className="text-center text-xs text-ink/60">{note}</p> : null}
      <div className="mt-3 overflow-x-auto rounded-xl border border-line">
        <table className="w-full min-w-[36rem] text-left text-xs">
          <thead className="bg-leaf text-white">
            <tr>
              {headers.map((head) => (
                <th key={head} className="px-2 py-2 font-bold">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name} className="border-t border-line">
                <td className="flex items-center gap-2 px-2 py-2 font-semibold">
                  <CatIcon name={row.name} />
                  {row.name}
                </td>
                {row.cells.map((cell, index) => (
                  <td key={index} className="px-2 py-2 whitespace-nowrap">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function Fees({ onDuplicate }: { onDuplicate?: () => void }) {
  const [tab, setTab] = useState<"regular" | "international">("regular");
  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex justify-center gap-2">
        <button type="button" onClick={() => setTab("regular")} className={`rounded-md px-4 py-2 text-sm font-bold ${tab === "regular" ? "bg-leaf text-white" : "border border-line bg-white"}`}>
          Regular License
        </button>
        <button type="button" onClick={() => setTab("international")} className={`rounded-md px-4 py-2 text-sm font-bold ${tab === "international" ? "bg-leaf text-white" : "border border-line bg-white"}`}>
          International License
        </button>
      </div>
      <p className="mx-auto mt-4 max-w-md rounded-xl border border-line bg-white px-4 py-3 text-center text-sm">
        In any combination the fee of highest fee category will be applicable
      </p>
      {tab === "regular" ? (
        <>
          <Table
            id="regular-fee"
            title="Regular License"
            note="The fee are applicable for one year"
            headers={["Category", "Test Fee", "Fee After Passing Test", "Courier Fee", "Total Fee (Excluding Test Fee)"]}
            rows={REGULAR}
          />
          <p className="mt-2 text-xs text-ink/60">Candidate can make regular license for the period of 1 year, 2 years, 3 years, 4 years, or 5 years max.</p>
          <Table
            id="renew"
            title="Regular License Renewal"
            headers={["Category", "Renewal Fee (1 Year)", "Fine (1 to 3 M)", "Fine (3 M to 1 Y)", "Fine (1 Year)", "Courier Fee", "Total (without fine)"]}
            rows={RENEW}
          />
          <p className="mt-2 text-xs text-ink/60">If a person applies for renewal and the original license is not available, the duplicate fee will be added.</p>
          <Table id="duplicate" title="Duplicate License" headers={["Category", "Duplicate Fee", "Courier Fee", "Total"]} rows={DUPLICATE} />
          <div className="mt-6 flex justify-center gap-3">
            <a href="#renew" className="rounded-full bg-leaf-soft px-6 py-2 text-sm font-bold text-leaf">
              Renew
            </a>
            <button type="button" onClick={onDuplicate} className="rounded-full border border-leaf px-6 py-2 text-sm font-bold text-leaf">
              Duplicate
            </button>
          </div>
        </>
      ) : (
        <>
          <Table
            id="intl"
            title="International License"
            headers={["Category", "Fee per Annum", "Courier Fee", "Total Fee", "Total Fee (3 Years)", "Total"]}
            rows={INTL}
          />
          <p className="mt-2 text-xs text-ink/60">If a person applies for renewal and the original license is not available, the duplicate fee will be added.</p>
          <div className="mt-6 flex justify-center">
            <span className="rounded-full border border-leaf px-6 py-2 text-sm font-bold text-leaf">Renew International License</span>
          </div>
        </>
      )}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="relative mt-10 overflow-hidden bg-leaf px-4 pt-16 pb-8 text-white">
      <div className="pointer-events-none absolute inset-x-0 -top-8 h-16 rounded-[100%] bg-[#f7f8f6]" />
      <div className="relative mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
        <div>
          <img src="/dlims/dastak-cut.png" alt="Dastak" className="h-16 object-contain" />
          <p className="mt-3 max-w-md text-sm leading-relaxed">
            The Driving License Information Management System (DLIMS) is an integrated component of the Government of Punjab's Dastak — One Window for all Government Services which securely carries out all DLIMS processes including form submission, verification, payment, and card tracking.
          </p>
        </div>
        <div className="md:text-right">
          <p className="text-sm font-bold">For driving license-related queries, please contact us at</p>
          <p className="mt-2 text-sm">Emergency Number: 15</p>
          <p className="text-sm">Phone Number: 042-99202892</p>
          <p className="text-sm">Email: info@dlims.punjab.gov.pk</p>
        </div>
      </div>
    </footer>
  );
}
