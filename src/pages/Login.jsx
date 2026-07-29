import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import GlassPanel from "../components/GlassPanel";
import FormField from "../components/FormField";
import { useForm } from "../hooks/useForm";
import { validateEmail, validatePassword } from "../utils/validation";

const validators = {
  email: validateEmail,
  password: validatePassword,
};

export default function Login() {
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const { values, errors, touched, handleChange, handleBlur, validateAll } = useForm(
    { email: "", password: "" },
    validators
  );

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError("");

    const isValid = validateAll();
    if (!isValid) return;

    setIsSubmitting(true);
    const result = await login(values.email, values.password);
    setIsSubmitting(false);

    if (result?.success) {
      navigate("/dashboard");
    } else {
      setSubmitError(result?.message || "Email atau password salah.");
    }
  }

  return (
    <div className="bg-zinc-950 text-zinc-100 font-sans min-h-screen flex items-center justify-center px-6">
      <GlassPanel className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-white">graphic_eq</span>
          </div>
          <h1 className="text-2xl font-bold">Masuk ke VoxFlow AI</h1>
          <p className="text-zinc-400 text-sm mt-2">Kelola pipeline podcast otomatis kamu</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <FormField
            label="Email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.email}
            touched={touched.email}
            placeholder="demo@voxflow.ai"
          />

          <FormField
            label="Password"
            name="password"
            type="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.password}
            touched={touched.password}
            placeholder="••••••••"
          />

          {submitError && (
            <p className="text-fuchsia-400 text-sm flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">error</span>
              {submitError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-500 text-white py-2.5 rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all mt-2 disabled:opacity-50"
          >
            {isSubmitting ? "Memproses..." : "Masuk"}
          </button>
        </form>

        {/* Kredensial diselaraskan agar konsisten */}
        <p className="text-center text-zinc-500 text-xs mt-6">
          Demo: demo@voxflow.ai / podflow123
        </p>

        <Link to="/" className="block text-center text-zinc-400 hover:text-zinc-100 text-sm mt-4 transition-colors">
          ← Kembali ke Landing Page
        </Link>
      </GlassPanel>
    </div>
  );
}