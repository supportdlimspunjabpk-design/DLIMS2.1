import { useState, type FormEvent } from "react";
import { Heading, Note } from "@/components/dlims/form-ui";
import { login, signUp, useSession, logout, getSession } from "@/components/dlims/store";

const input = "w-full rounded-lg border border-line bg-white px-3 py-3 text-sm";

export function LoginForm({ onAdmin }: { onAdmin?: () => void }) {
  const session = useSession();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const result = await login(user, password);
    setMessage(result.ok ? "" : result.message);
    if (result.ok && getSession()?.role === "admin") onAdmin?.();
  }

  if (session) {
    return (
      <div className="mx-auto max-w-md">
        <Heading title="Login" />
        <p className="text-center font-semibold">Signed in as {session.name}</p>
        {session.role === "admin" ? (
          <button type="button" onClick={onAdmin} className="mt-4 w-full rounded-full bg-[#157a38] py-3 font-bold text-white">
            Open admin panel
          </button>
        ) : null}
        <button type="button" onClick={logout} className="mt-4 w-full rounded-full bg-leaf py-3 font-bold text-white">
          Log out
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md">
      <Heading title="Login" />
      <form onSubmit={onSubmit} className="space-y-3">
        <label className="block text-sm font-bold">
          CNIC or email
          <input className={`${input} mt-1`} value={user} onChange={(event) => setUser(event.target.value)} autoComplete="username" required />
        </label>
        <label className="block text-sm font-bold">
          Password
          <input className={`${input} mt-1`} type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required />
        </label>
        <button type="submit" className="w-full rounded-full bg-[#f5c400] py-3 font-bold text-white">
          Login
        </button>
      </form>
      {message ? (
        <div className="mt-4">
          <Note>{message}</Note>
        </div>
      ) : null}
    </div>
  );
}

export function SignUpForm() {
  const [message, setMessage] = useState("");
  const [photo, setPhoto] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const error = await signUp({
      name: String(data.get("name") || ""),
      father: String(data.get("father") || ""),
      cnic: String(data.get("cnic") || ""),
      dob: String(data.get("dob") || ""),
      gender: String(data.get("gender") || ""),
      phone: String(data.get("phone") || ""),
      email: String(data.get("email") || ""),
      password: String(data.get("password") || ""),
      district: String(data.get("district") || ""),
      address: String(data.get("address") || ""),
      licenseType: String(data.get("licenseType") || ""),
      photo,
    });
    setMessage(error || "Sign up sent. Admin will verify this request before login is allowed.");
    if (!error) form.reset();
  }

  return (
    <div className="mx-auto max-w-lg">
      <Heading title="Sign up" />
      <form onSubmit={onSubmit} className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-bold">
            Full name
            <input name="name" required className={`${input} mt-1`} />
          </label>
          <label className="text-sm font-bold">
            Father / husband name
            <input name="father" required className={`${input} mt-1`} />
          </label>
          <label className="text-sm font-bold">
            CNIC
            <input name="cnic" required inputMode="numeric" placeholder="Without dashes" className={`${input} mt-1`} />
          </label>
          <label className="text-sm font-bold">
            Date of birth
            <input name="dob" required type="date" className={`${input} mt-1`} />
          </label>
          <label className="text-sm font-bold">
            Gender
            <select name="gender" className={`${input} mt-1`}>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </label>
          <label className="text-sm font-bold">
            Phone
            <input name="phone" required inputMode="tel" className={`${input} mt-1`} />
          </label>
          <label className="text-sm font-bold sm:col-span-2">
            Email
            <input name="email" required type="email" className={`${input} mt-1`} />
          </label>
          <label className="text-sm font-bold">
            Password
            <input name="password" required type="password" minLength={6} className={`${input} mt-1`} />
          </label>
          <label className="text-sm font-bold">
            License type
            <select name="licenseType" className={`${input} mt-1`}>
              <option>Learner</option>
              <option>Regular</option>
              <option>International</option>
              <option>Duplicate</option>
            </select>
          </label>
          <label className="text-sm font-bold">
            District
            <input name="district" required defaultValue="FAISALABAD" className={`${input} mt-1`} />
          </label>
          <label className="text-sm font-bold sm:col-span-2">
            Address
            <input name="address" required className={`${input} mt-1`} />
          </label>
        </div>
        <label className="block text-sm font-bold">
          Photo
          <input
            type="file"
            accept="image/*"
            className={`${input} mt-1`}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => setPhoto(String(reader.result || ""));
              reader.readAsDataURL(file);
            }}
          />
        </label>
        <button type="submit" className="w-full rounded-full bg-leaf py-3 font-bold text-white">
          Create account
        </button>
      </form>
      {message ? (
        <div className="mt-4">
          <Note>{message}</Note>
        </div>
      ) : null}
    </div>
  );
}

export function BrandPage({ brand }: { brand: "dastak" | "police" }) {
  if (brand === "police") {
    return (
      <section className="mx-auto max-w-lg text-center">
        <img src="/dlims/tp-badge.jpg" alt="" className="mx-auto h-40 object-contain" />
        <h1 className="mt-4 text-3xl font-black text-leaf">Traffic Police Punjab</h1>
        <p className="mt-2 text-sm text-ink/70">Driving license services shown in this portal.</p>
      </section>
    );
  }
  return (
    <section className="mx-auto max-w-lg text-center">
      <img src="/dlims/dastak-page.jpg" alt="Dastak" className="mx-auto h-24 object-contain" />
      <h1 className="mt-4 text-2xl font-black">All DLIMS services</h1>
      <p className="mt-2 text-sm text-ink/70">One window for form submission, verification, payment, and card tracking.</p>
    </section>
  );
}
