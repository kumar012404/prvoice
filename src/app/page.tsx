"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Link from "next/link";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/admin");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0B0F19", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <LoadingSpinner size={40} />
      </div>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0B0F19",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Background glows */}
      <div style={{
        position: "absolute", top: "-15%", left: "-5%",
        width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-10%", right: "-5%",
        width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(59,130,246,0.10) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto", padding: "0 20px" }}>
        {/* ─── Nav ─── */}
        <nav style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 0",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: "linear-gradient(135deg, #2563EB, #3B82F6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, boxShadow: "0 4px 18px rgba(37,99,235,0.5)",
            }}>
              🔗
            </div>
            <span style={{ fontSize: 20, fontWeight: 900, color: "white" }}>
              Biolink<span style={{ color: "#3B82F6" }}>Pro</span>
            </span>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Link href="/auth" style={{
              padding: "9px 18px", borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.12)",
              color: "white", textDecoration: "none", fontSize: 14, fontWeight: 500,
            }}>
              Sign In
            </Link>
            <Link href="/auth" style={{
              padding: "9px 18px", borderRadius: 10,
              background: "linear-gradient(135deg, #2563EB, #3B82F6)",
              color: "white", textDecoration: "none", fontSize: 14, fontWeight: 600,
              boxShadow: "0 4px 14px rgba(37,99,235,0.4)",
            }}>
              Get Started
            </Link>
          </div>
        </nav>

        {/* ─── Hero ─── */}
        <section style={{ textAlign: "center", padding: "80px 0 60px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "5px 14px", borderRadius: 999,
            background: "rgba(37,99,235,0.12)",
            border: "1px solid rgba(37,99,235,0.25)",
            marginBottom: 24,
          }}>
            <span style={{ fontSize: 12, color: "#60A5FA", fontWeight: 700 }}>✦ PREMIUM LINK IN BIO</span>
          </div>

          <h1 style={{
            fontSize: "clamp(36px, 7vw, 72px)",
            fontWeight: 900,
            color: "white",
            lineHeight: 1.1,
            marginBottom: 20,
          }}>
            One Link.<br />
            <span style={{
              background: "linear-gradient(135deg, #60A5FA, #2563EB)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Infinite Reach.
            </span>
          </h1>

          <p style={{
            fontSize: 18, color: "#9CA3AF", maxWidth: 520, margin: "0 auto 36px",
            lineHeight: 1.6,
          }}>
            Share your Instagram, YouTube, Facebook, X, Threads, and WhatsApp with a single premium profile link.
          </p>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/auth" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "15px 32px", borderRadius: 14,
              background: "linear-gradient(135deg, #2563EB, #3B82F6)",
              color: "white", textDecoration: "none", fontSize: 16, fontWeight: 700,
              boxShadow: "0 8px 30px rgba(37,99,235,0.5)",
              transition: "all 0.3s",
            }}>
              🚀 Create Your BioLink
            </Link>
            <Link href="/u/demo" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "15px 32px", borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.15)",
              color: "white", textDecoration: "none", fontSize: 16, fontWeight: 500,
              backdropFilter: "blur(10px)",
            }}>
              👁️ View Demo
            </Link>
          </div>
        </section>

        {/* ─── Features ─── */}
        <section style={{ padding: "20px 0 80px" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 16,
          }}>
            {[
              { icon: "📱", title: "Mobile First", desc: "Designed for Android & iPhone with touch-optimized interactions" },
              { icon: "🎨", title: "Custom Themes", desc: "Upload backgrounds, apply gradients, personalize everything" },
              { icon: "📊", title: "Real Analytics", desc: "Track profile views, link clicks, and top performing platforms" },
              { icon: "📲", title: "QR Code", desc: "Auto-generated QR code for instant sharing and printing" },
              { icon: "⚡", title: "Live Preview", desc: "See changes instantly in a real mobile phone preview frame" },
              { icon: "🔒", title: "Secure Admin", desc: "Firebase Auth protected dashboard, only you can edit" },
            ].map((f) => (
              <div
                key={f.title}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 18,
                  padding: "22px 20px",
                  transition: "all 0.2s",
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "white", marginBottom: 6 }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.5 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Social Platforms ─── */}
        <section style={{
          background: "rgba(255,255,255,0.02)",
          borderRadius: 24,
          padding: "32px 24px",
          marginBottom: 60,
          border: "1px solid rgba(255,255,255,0.06)",
        }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "white", textAlign: "center", marginBottom: 8 }}>
            All Your Platforms. One Link.
          </h2>
          <p style={{ color: "#6B7280", textAlign: "center", fontSize: 14, marginBottom: 28 }}>
            Connect and manage all your social media in seconds
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            {[
              { icon: "📷", name: "Instagram", gradient: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)" },
              { icon: "▶️", name: "YouTube", gradient: "linear-gradient(135deg, #FF0000, #CC0000)" },
              { icon: "📘", name: "Facebook", gradient: "linear-gradient(135deg, #1877F2, #0d6fdb)" },
              { icon: "✖️", name: "X (Twitter)", gradient: "linear-gradient(135deg, #1a1a1a, #333333)" },
              { icon: "🧵", name: "Threads", gradient: "linear-gradient(135deg, #101010, #2a2a2a)" },
              { icon: "💬", name: "WhatsApp", gradient: "linear-gradient(135deg, #25D366, #128C7E)" },
            ].map((p) => (
              <div key={p.name} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 18px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12,
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 9,
                  background: p.gradient,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16,
                }}>
                  {p.icon}
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: "white" }}>{p.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section style={{ textAlign: "center", padding: "0 0 80px" }}>
          <h2 style={{ fontSize: 32, fontWeight: 900, color: "white", marginBottom: 12 }}>
            Ready to go premium?
          </h2>
          <p style={{ color: "#6B7280", marginBottom: 28, fontSize: 15 }}>
            Join thousands of creators sharing their world with one link.
          </p>
          <Link href="/auth" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "15px 36px", borderRadius: 14,
            background: "linear-gradient(135deg, #2563EB, #3B82F6)",
            color: "white", textDecoration: "none", fontSize: 16, fontWeight: 700,
            boxShadow: "0 8px 30px rgba(37,99,235,0.5)",
          }}>
            🔗 Create Free Account
          </Link>
        </section>

        {/* Footer */}
        <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "20px 0", textAlign: "center" }}>
          <p style={{ fontSize: 12, color: "#374151" }}>
            © 2025 BioLink Pro · Premium Link in Bio Platform
          </p>
        </footer>
      </div>
    </main>
  );
}
