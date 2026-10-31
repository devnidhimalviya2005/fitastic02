import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not sign in.");

      login(data);
      navigate(location.state?.from || "/", { replace: true });
    } catch (err) {
      setError(err.message || "Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard>
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-purple">
        Welcome back
      </p>
      <h1 className="text-3xl font-bold text-navy">Sign in to Fitastic</h1>
      <p className="mt-2 text-sm text-slate-500">
        Pick up where you left off.
      </p>

      <form onSubmit={handleSubmit} className="mt-7 space-y-4 text-left">
        <label className="block text-sm font-medium text-slate-700">
          Email
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-purple focus:ring-2 focus:ring-purple/20"
            placeholder="you@example.com"
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Password
          <input
            type="password"
            autoComplete="current-password"
            required
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-purple focus:ring-2 focus:ring-purple/20"
            placeholder="At least 6 characters"
          />
        </label>

        {error && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-navy px-4 py-3 font-semibold text-white transition hover:bg-purple disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-sm text-slate-500">
        New to Fitastic?{" "}
        <Link to="/register" className="font-semibold text-purple hover:underline">
          Create an account
        </Link>
      </p>
    </AuthCard>
  );
}