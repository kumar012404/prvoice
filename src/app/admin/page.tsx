"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { getProfile, getSocialLinks, getAnalytics } from "@/lib/firestore";
import type { UserProfile, SocialLink, Analytics } from "@/lib/types";
import { DEMO_PROFILE, DEMO_LINKS, DEMO_ANALYTICS } from "@/lib/firebase-demo";
import MobilePreview from "@/components/admin/MobilePreview";
import ProfileEditor from "@/components/admin/ProfileEditor";
import LinksManager from "@/components/admin/LinksManager";
import AnalyticsPanel from "@/components/admin/AnalyticsPanel";
import QRCodePanel from "@/components/admin/QRCodePanel";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Toast from "@/components/ui/Toast";

type Tab = "overview" | "profile" | "links" | "analytics" | "qrcode";

const NAV_ITEMS: { id: Tab; icon: string; label: string }[] = [
  { id: "overview", icon: "🏠", label: "Overview" },
  { id: "profile", icon: "👤", label: "Profile" },
  { id: "links", icon: "🔗", label: "Links" },
  { id: "analytics", icon: "📊", label: "Analytics" },
  { id: "qrcode", icon: "📱", label: "QR Code" },
];

export default function AdminPage() {
  const { user, logOut } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [profile, setProfile] = useState<UserProfile>(DEMO_PROFILE);
  const [links, setLinks] = useState<SocialLink[]>(DEMO_LINKS);
  const [analytics, setAnalytics] = useState<Analytics>(DEMO_ANALYTICS);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = useCallback((msg: string, type: "success" | "error" | "info" = "success") => {
    setToast({ msg, type });
  }, []);

  useEffect(() => {
    if (!user) return;
    async function loadData() {
      setLoading(true);
      try {
        const [p, l, a] = await Promise.all([
          getProfile(user!.uid),
          getSocialLinks(user!.uid),
          getAnalytics(user!.uid),
        ]);
        if (p) setProfile(p);
        if (l && l.length > 0) setLinks(l);
        if (a) setAnalytics(a);
      } catch (e) {
        console.error("Load error", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  function handleProfileUpdate(updates: Partial<UserProfile>) {
    setProfile((p) => ({ ...p, ...updates }));
  }

  function handleLinksUpdate(newLinks: SocialLink[]) {
    setLinks(newLinks);
  }

  async function handleLogout() {
    await logOut();
  }

  const publicUrl = typeof window !== "undefined"
    ? `${window.location.origin}/u/${profile.username}`
    : "";

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(publicUrl);
      showToast("Link copied! 🔗");
    } catch {
      showToast("Failed to copy", "error");
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0B0F19", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
        <LoadingSpinner size={40} />
        <p style={{ color: "#6B7280", fontSize: 14 }}>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0B0F19", display: "flex", flexDirection: "column" }}>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* ─── Top Bar ───────────────────────────────────────────────────────── */}
      <header
        className="admin-header"
        style={{
          position: "sticky", top: 0, zIndex: 50,
          background: "rgba(11,15,25,0.95)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "0 16px",
          height: 60,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginRight: "auto" }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: "linear-gradient(135deg, #2563EB, #3B82F6)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
            boxShadow: "0 4px 14px rgba(37,99,235,0.5)",
          }}>
            🔗
          </div>
          <span className="admin-logo-text" style={{ fontWeight: 800, fontSize: 16, color: "white" }}>
            Biolink<span style={{ color: "#3B82F6" }}>Pro</span>
          </span>
        </div>

        {/* Actions */}
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="btn-secondary admin-btn-action"
          style={{ padding: "7px 12px", fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}
        >
          <span className="btn-icon">📱</span>
          <span className="btn-text">Preview</span>
        </button>
        <a
          href={publicUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary admin-btn-action"
          style={{ padding: "7px 12px", fontSize: 12, textDecoration: "none", color: "white", display: "flex", alignItems: "center", gap: 6 }}
        >
          <span className="btn-icon">🌐</span>
          <span className="btn-text">View</span>
        </a>
        <button 
          onClick={copyLink} 
          className="btn-primary admin-btn-action" 
          style={{ padding: "7px 12px", fontSize: 12, width: "auto" }}
        >
          <span className="btn-icon">📋</span>
          <span className="btn-text">Copy Link</span>
        </button>
        <button onClick={handleLogout} style={{ background: "none", border: "none", color: "#6B7280", cursor: "pointer", fontSize: 20, padding: "0 4px" }} title="Sign out">
          ⎋
        </button>
      </header>

      {/* ─── Main Layout ───────────────────────────────────────────────────── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* ─── Sidebar (desktop) ─────────────────────────────────────────── */}
        <aside
          className="sidebar"
          style={{
            width: 200,
            padding: "20px 12px",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {/* User Info */}
          <div style={{ padding: "12px 8px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 8 }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%",
              background: profile.profilePicture ? `url(${profile.profilePicture}) center/cover` : "linear-gradient(135deg, #2563EB, #3B82F6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, marginBottom: 8,
              boxShadow: "0 0 0 2px rgba(37,99,235,0.4)",
            }}>
              {!profile.profilePicture && "👤"}
            </div>
            <p style={{ fontSize: 13, fontWeight: 700, color: "white" }}>{profile.name || "Admin"}</p>
            <p style={{ fontSize: 11, color: "#6B7280", marginBottom: 2 }}>@{profile.username || "username"}</p>
            {user?.email && (
              <p style={{ fontSize: 10, color: "rgba(255, 255, 255, 0.4)", wordBreak: "break-all" }}>
                📧 {user.email}
              </p>
            )}
          </div>

          {/* Nav Items */}
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`sidebar-item ${activeTab === item.id ? "active" : ""}`}
              onClick={() => setActiveTab(item.id)}
              style={{ border: "none", textAlign: "left", width: "100%" }}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}

          <div style={{ marginTop: "auto", paddingTop: 16 }}>
            <button
              className="sidebar-item"
              onClick={handleLogout}
              style={{ border: "none", width: "100%", color: "#EF4444" }}
            >
              <span>🚪</span>
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* ─── Content ────────────────────────────────────────────────────── */}
        <main style={{ flex: 1, overflowY: "auto", padding: "20px 16px 100px" }}>
          <div style={{ maxWidth: 640, margin: "0 auto" }}>

            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 18, animation: "fadeInUp 0.4s ease" }}>
                {/* Welcome */}
                <div style={{ marginBottom: 4 }}>
                  <h1 style={{ fontSize: 24, fontWeight: 900, color: "white" }}>
                    Welcome back, {profile.name?.split(" ")[0] || "Admin"} 👋
                  </h1>
                  <p style={{ color: "#6B7280", fontSize: 14, marginTop: 4 }}>
                    Manage your BioLink Pro profile
                  </p>
                </div>

                {/* Quick Stats */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                  <div className="glass-card-blue" style={{ padding: 16, textAlign: "center" }}>
                    <div style={{ fontSize: 22, marginBottom: 4 }}>👁️</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "white" }}>{analytics.profileViews.toLocaleString()}</div>
                    <div style={{ fontSize: 10, color: "#6B7280", marginTop: 2 }}>Profile Views</div>
                  </div>
                  <div className="glass-card-blue" style={{ padding: 16, textAlign: "center" }}>
                    <div style={{ fontSize: 22, marginBottom: 4 }}>🖱️</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "white" }}>{analytics.totalClicks.toLocaleString()}</div>
                    <div style={{ fontSize: 10, color: "#6B7280", marginTop: 2 }}>Total Clicks</div>
                  </div>
                  <div className="glass-card-blue" style={{ padding: 16, textAlign: "center" }}>
                    <div style={{ fontSize: 22, marginBottom: 4 }}>🔗</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "white" }}>{links.filter(l => l.enabled).length}</div>
                    <div style={{ fontSize: 10, color: "#6B7280", marginTop: 2 }}>Active Links</div>
                  </div>
                </div>

                {/* Public Link */}
                <div className="glass-card" style={{ padding: 20 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Your Public Profile URL
                  </p>
                  <div style={{ display: "flex", gap: 8 }}>
                    <div style={{
                      flex: 1, padding: "12px 14px",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 12, fontSize: 13, color: "#9CA3AF",
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {publicUrl}
                    </div>
                    <button className="btn-primary" onClick={copyLink} style={{ width: "auto", padding: "11px 14px", flexShrink: 0, fontSize: 13 }}>
                      📋
                    </button>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="glass-card" style={{ padding: 20 }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "white", marginBottom: 14 }}>Quick Actions</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {[
                      { icon: "👤", label: "Edit Profile", tab: "profile" as Tab },
                      { icon: "🔗", label: "Manage Links", tab: "links" as Tab },
                      { icon: "📊", label: "View Analytics", tab: "analytics" as Tab },
                      { icon: "📱", label: "Get QR Code", tab: "qrcode" as Tab },
                    ].map((a) => (
                      <button
                        key={a.tab}
                        className="btn-secondary"
                        onClick={() => setActiveTab(a.tab)}
                        style={{ flexDirection: "column", gap: 6, padding: "14px 12px", height: 72 }}
                      >
                        <span style={{ fontSize: 22 }}>{a.icon}</span>
                        <span style={{ fontSize: 12, fontWeight: 600 }}>{a.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Profile Preview Card */}
                <div className="glass-card" style={{ padding: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{
                      width: 56, height: 56, borderRadius: "50%",
                      background: profile.profilePicture ? `url(${profile.profilePicture}) center/cover` : "linear-gradient(135deg, #2563EB, #3B82F6)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 26, flexShrink: 0,
                      boxShadow: "0 0 0 3px rgba(37,99,235,0.3)",
                    }}>
                      {!profile.profilePicture && "👤"}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 700, fontSize: 16, color: "white" }}>{profile.name}</p>
                      <p style={{ fontSize: 12, color: "#3B82F6", marginTop: 1 }}>@{profile.username}</p>
                      <p style={{ fontSize: 12, color: "#6B7280", marginTop: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {profile.bio}
                      </p>
                    </div>
                    <a
                      href={publicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary"
                      style={{ width: "auto", padding: "8px 12px", fontSize: 12, textDecoration: "none", flexShrink: 0 }}
                    >
                      View →
                    </a>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "profile" && (
              <div style={{ animation: "fadeInUp 0.4s ease" }}>
                <div style={{ marginBottom: 18 }}>
                  <h2 style={{ fontSize: 20, fontWeight: 800, color: "white" }}>👤 Edit Profile</h2>
                  <p style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>Customize your public profile</p>
                </div>
                <ProfileEditor profile={profile} onUpdate={handleProfileUpdate} onToast={showToast} />
              </div>
            )}

            {activeTab === "links" && (
              <div style={{ animation: "fadeInUp 0.4s ease" }}>
                <LinksManager links={links} onUpdate={handleLinksUpdate} onToast={showToast} />
              </div>
            )}

            {activeTab === "analytics" && (
              <div style={{ animation: "fadeInUp 0.4s ease" }}>
                <AnalyticsPanel analytics={analytics} links={links} />
              </div>
            )}

            {activeTab === "qrcode" && (
              <div style={{ animation: "fadeInUp 0.4s ease" }}>
                <QRCodePanel username={profile.username} onToast={showToast} />
              </div>
            )}

          </div>
        </main>

        {/* ─── Live Preview (desktop) ──────────────────────────────────────── */}
        <aside
          style={{
            width: 360,
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            padding: "24px 20px",
            borderLeft: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(255,255,255,0.01)",
            gap: 16,
          }}
          className="mobile-frame-sidebar"
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ADE80", boxShadow: "0 0 6px rgba(74,222,128,0.8)" }} />
            <span style={{ fontSize: 12, color: "#6B7280", fontWeight: 600 }}>LIVE PREVIEW</span>
          </div>
          <MobilePreview profile={profile} links={links} />
          <p style={{ fontSize: 11, color: "#374151", textAlign: "center" }}>
            Changes reflect instantly
          </p>
        </aside>
      </div>

      {/* ─── Mobile Preview Modal ──────────────────────────────────────────── */}
      {showPreview && (
        <div className="modal-overlay" onClick={() => setShowPreview(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <MobilePreview profile={profile} links={links} />
            <button className="btn-secondary" onClick={() => setShowPreview(false)} style={{ width: 180 }}>
              ✕ Close Preview
            </button>
          </div>
        </div>
      )}

      {/* ─── Bottom Nav (mobile) ────────────────────────────────────────────── */}
      <nav
        style={{
          position: "fixed",
          bottom: 0, left: 0, right: 0,
          background: "rgba(11,15,25,0.97)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          padding: "8px 0 env(safe-area-inset-bottom, 8px)",
          zIndex: 40,
        }}
        className="mobile-bottom-nav"
      >
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "6px 4px",
              color: activeTab === item.id ? "#3B82F6" : "#4B5563",
              transition: "color 0.2s",
            }}
          >
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            <span style={{ fontSize: 9, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.03em" }}>
              {item.label}
            </span>
            {activeTab === item.id && (
              <div style={{ width: 20, height: 2, borderRadius: 1, background: "#3B82F6", boxShadow: "0 0 6px rgba(59,130,246,0.8)" }} />
            )}
          </button>
        ))}
      </nav>

      {/* Extra CSS for layout adjustments */}
      <style>{`
        @media (min-width: 900px) {
          .mobile-bottom-nav { display: none !important; }
          .mobile-frame-sidebar { display: flex !important; }
        }
        @media (max-width: 899px) {
          .mobile-frame-sidebar { display: none !important; }
          .mobile-bottom-nav { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
