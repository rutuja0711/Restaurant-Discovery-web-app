"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

const formClass =
  "flex w-full max-w-[420px] flex-col gap-4 rounded-[20px] bg-white p-8 shadow-card-md";
const fieldWrapClass = "flex flex-col gap-1";
const labelClass = "text-xs font-medium text-text-muted";

function getInputClass(hasError) {
  return `rounded-[10px] border px-4 py-3.5 text-sm focus:outline-none focus:ring-2 ${
    hasError
      ? "border-danger bg-white text-danger ring-danger/30 focus:ring-danger"
      : "border-transparent bg-white shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)] focus:ring-forest"
  }`;
}

const buttonClass =
  "cursor-pointer rounded-[10px] border-none bg-forest px-4 py-3.5 text-sm font-semibold text-white shadow-card-sm hover:bg-forest-dark disabled:cursor-not-allowed disabled:opacity-50";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    Promise.all([
      fetch("/api/auth/me").then((res) => res.json()),
      fetch("/api/admin/me").then((res) => res.json()),
      fetch("/api/superadmin/check").then((res) => res.ok),
    ]).then(([userData, adminData, superadminOk]) => {
      if (userData.user) router.replace("/");
      else if (adminData.admin) router.replace("/admin");
      else if (superadminOk) router.replace("/superadmin");
    });
  }, [router]);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    }
  }

  function validate() {
    const errors = {};

    if (!form.email.trim()) {
      errors.email = "Please enter your email";
    } else if (!EMAIL_REGEX.test(form.email.trim())) {
      errors.email = "Invalid email id";
    }

    if (!form.password) {
      errors.password = "Please enter your password";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");

    if (!validate()) return;

    setSubmitting(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSubmitting(false);

    if (res.ok) {
      router.push("/");
    } else {
      const data = await res.json();
      setFormError(data.error || "Invalid email or password");
    }
  }

  return (
    <>
      <Navbar />
      <main className="flex justify-center bg-[#f4f4f4] px-5 py-[60px]">
        <form onSubmit={handleSubmit} noValidate className={formClass}>
          <h1 className="mt-0 mb-1 text-2xl font-semibold">Log in</h1>

          <div className={fieldWrapClass}>
            <label className={labelClass}>Email</label>
            <input
              placeholder="Email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className={getInputClass(!!fieldErrors.email)}
            />
            {fieldErrors.email && (
              <p className="m-0 text-xs text-danger">{fieldErrors.email}</p>
            )}
          </div>

          <div className={fieldWrapClass}>
            <label className={labelClass}>Password</label>
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              className={getInputClass(!!fieldErrors.password)}
            />
            {fieldErrors.password && (
              <p className="m-0 text-xs text-danger">{fieldErrors.password}</p>
            )}
          </div>

          {formError && (
            <p className="-mt-1 text-[13px] text-danger">{formError}</p>
          )}

          <button type="submit" disabled={submitting} className={buttonClass}>
            {submitting ? "Logging in..." : "Log in"}
          </button>

          <p className="mt-1 text-center text-[13px] text-text-muted">
            Don&apos;t have an account?{" "}
            <a href="/register" className="font-medium text-forest">
              Sign up
            </a>
          </p>
        </form>
      </main>
    </>
  );
}
