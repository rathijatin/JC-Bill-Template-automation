import { useState } from "react";
import { Lock, User, LogIn } from "lucide-react";

interface SignInPageProps {
  onSignIn: (userId: string, password: string) => boolean;
}

export default function SignInPage({ onSignIn }: SignInPageProps) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isValid = onSignIn(userId.trim(), password);

    if (!isValid) {
      setError("Invalid User ID or Password.");
      return;
    }

    setError("");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_10%_10%,#fee2e2_0%,transparent_35%),radial-gradient(circle_at_90%_0%,#dbeafe_0%,transparent_38%),linear-gradient(180deg,#fffaf5_0%,#fff_45%,#f8fafc_100%)] px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_96%,rgba(148,163,184,0.13)_96%),linear-gradient(90deg,transparent_96%,rgba(148,163,184,0.1)_96%)] bg-[length:30px_30px] opacity-70" />

      <div className="relative mx-auto flex min-h-[calc(100vh-80px)] max-w-lg items-center justify-center">
        <div className="w-full rounded-3xl border border-slate-200/80 bg-white/85 p-8 shadow-2xl shadow-slate-900/10 backdrop-blur-sm sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-600">Jaipur Craft</p>
          <h1 className="mt-2 font-display text-3xl text-slate-900">Sign In</h1>
          <p className="mt-2 text-sm text-slate-500">Use your assigned credentials to access the billing home page.</p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">User ID</span>
              <div className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3">
                <User size={16} className="text-slate-400" />
                <input
                  type="text"
                  value={userId}
                  onChange={(event) => setUserId(event.target.value)}
                  className="w-full bg-transparent py-3 text-sm text-slate-900 outline-none"
                  placeholder="Enter user ID"
                  autoComplete="username"
                  required
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Password</span>
              <div className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3">
                <Lock size={16} className="text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full bg-transparent py-3 text-sm text-slate-900 outline-none"
                  placeholder="Enter password"
                  autoComplete="current-password"
                  required
                />
              </div>
            </label>

            {error ? <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <LogIn size={16} /> Continue to Billing Home
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}