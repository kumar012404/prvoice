"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Toast from "@/components/ui/Toast";

type AuthMode = "signin" | "signup" | "reset";

export default function AuthPage() {
  const { user, loading, signIn, signUp, signInWithGoogle, resetPassword, error, setError } = useAuth();
  const router = useRouter();

  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" | "info" } | null>(null);

  useEffect(() => {
    if (!loading && user) {
      router.push("/admin");
    }
  }, [user, loading, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (mode === "signin") {
        await signIn(email, password);
        router.push("/admin");
      } else if (mode === "signup") {
        if (!name.trim()) { setError("Please enter your name."); setSubmitting(false); return; }
        await signUp(email, password, name);
        router.push("/admin");
      } else {
        await resetPassword(email);
        setToast({ msg: "Password reset email sent! Check your inbox.", type: "success" });
        setMode("signin");
      }
    } catch {
      // error is set by context
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogleSignIn() {
    setError("");
    setSubmitting(true);
    try {
      await signInWithGoogle();
      router.push("/admin");
    } catch {
      // error is set by context
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0B0F19" }}>
        <LoadingSpinner size={40} />
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0B0F19",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background effects */}
      <div style={{
        position: "absolute", top: "-20%", left: "-10%", width: 500, height: 500,
        borderRadius: "50%", background: "radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-20%", right: "-10%", width: 400, height: 400,
        borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div style={{ width: "100%", maxWidth: 420, animation: "fadeInUp 0.5s ease" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18,
            background: "linear-gradient(135deg, #2563EB, #3B82F6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, margin: "0 auto 16px",
            boxShadow: "0 8px 30px rgba(37,99,235,0.5)",
          }}>
            🔗
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "white", marginBottom: 4 }}>
            Biolink<span style={{ color: "#3B82F6" }}>Pro</span>
          </h1>
          <p style={{ color: "#6B7280", fontSize: 14 }}>Premium Link in Bio Platform</p>
        </div>

        {/* Card */}
        <div className="glass-card" style={{ padding: 28 }}>
          {/* Mode Tabs */}
          <div className="tab-bar" style={{ marginBottom: 24 }}>
            <button className={`tab-item ${mode === "signin" ? "active" : ""}`} onClick={() => { setMode("signin"); setError(""); }}>
              Sign In
            </button>
            <button className={`tab-item ${mode === "signup" ? "active" : ""}`} onClick={() => { setMode("signup"); setError(""); }}>
              Sign Up
            </button>
          </div>

          {mode === "reset" && (
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Reset Password</h2>
              <p style={{ fontSize: 13, color: "#6B7280" }}>Enter your email to receive a reset link.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {mode === "signup" && (
              <div>
                <label style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 6, display: "block", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Full Name
                </label>
                <input
                  className="input-field"
                  type="text"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div>
              <label style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 6, display: "block", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Email Address
              </label>
              <input
                className="input-field"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {mode !== "reset" && (
              <div>
                <label style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 6, display: "block", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Password
                </label>
                <input
                  className="input-field"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
            )}

            {error && (
              <div style={{
                padding: "12px 14px",
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.25)",
                borderRadius: 10,
                color: "#F87171",
                fontSize: 13,
              }}>
                {error}
              </div>
            )}

            <button type="submit" className="btn-primary" disabled={submitting} style={{ marginTop: 4 }}>
              {submitting ? <LoadingSpinner size={18} /> : null}
              {mode === "signin" ? "Sign In" : mode === "signup" ? "Create Account" : "Send Reset Link"}
            </button>
          </form>

          {mode !== "reset" && (
            <>
              <div style={{ display: "flex", alignItems: "center", margin: "20px 0", gap: 10 }}>
                <div style={{ flex: 1, height: 1, background: "rgba(255, 255, 255, 0.1)" }} />
                <span style={{ fontSize: 12, color: "#6B7280", fontWeight: 500 }}>or</span>
                <div style={{ flex: 1, height: 1, background: "rgba(255, 255, 255, 0.1)" }} />
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={submitting}
                className="btn-secondary"
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  padding: "12px",
                  borderRadius: 10,
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: 14,
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Continue with Google
              </button>
            </>
          )}

          {mode === "signin" && (
            <p style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: "#6B7280" }}>
              Forgot your password?{" "}
              <button
                onClick={() => { setMode("reset"); setError(""); }}
                style={{ background: "none", border: "none", color: "#3B82F6", cursor: "pointer", fontWeight: 600 }}
              >
                Reset it
              </button>
            </p>
          )}

          {mode === "reset" && (
            <p style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: "#6B7280" }}>
              <button
                onClick={() => { setMode("signin"); setError(""); }}
                style={{ background: "none", border: "none", color: "#3B82F6", cursor: "pointer", fontWeight: 600 }}
              >
                ← Back to Sign In
              </button>
            </p>
          )}
        </div>

        <p style={{ textAlign: "center", marginTop: 24, fontSize: 12, color: "#4B5563" }}>
          © 2025 BioLink Pro · All rights reserved
        </p>
      </div>
    </div>
  );
}
