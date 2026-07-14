"use client";

import { useState, useRef } from "react";
import type { UserProfile } from "@/lib/types";
import { saveProfile } from "@/lib/firestore";
import { uploadImage } from "@/lib/storage";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface ProfileEditorProps {
  profile: UserProfile;
  onUpdate: (p: Partial<UserProfile>) => void;
  onToast: (msg: string, type?: "success" | "error") => void;
}

const GRADIENTS = [
  { id: "gradient1", label: "Midnight", colors: ["#0B0F19", "#1a1f35"] },
  { id: "gradient2", label: "Deep Space", colors: ["#0f0c29", "#302b63"] },
  { id: "gradient3", label: "Ocean", colors: ["#0B0F19", "#1e3a5f"] },
  { id: "gradient4", label: "Nebula", colors: ["#1a0533", "#2563EB"] },
  { id: "gradient5", label: "Carbon", colors: ["#0d1117", "#161b22"] },
];

const BG_COLORS = [
  "#0B0F19", "#111827", "#0f0c29", "#1a1a2e", "#0d1117",
  "#1e1b4b", "#1c1917", "#042f2e",
];

export default function ProfileEditor({ profile, onUpdate, onToast }: ProfileEditorProps) {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingBg, setUploadingBg] = useState(false);
  const profilePicRef = useRef<HTMLInputElement>(null);
  const bgImageRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: profile.name || "",
    username: profile.username || "",
    bio: profile.bio || "",
    title: profile.title || "",
  });

  function handleChange(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    onUpdate({ [key]: value });
  }

  async function handleSaveProfile() {
    if (!user) return;
    setSaving(true);
    try {
      await saveProfile(user.uid, { ...form });
      onUpdate({ ...form });
      onToast("Profile saved successfully! 🎉");
    } catch {
      onToast("Failed to save profile", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleProfilePicUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploadingProfile(true);
    try {
      const url = await uploadImage(user.uid, file, "profile");
      await saveProfile(user.uid, { profilePicture: url });
      onUpdate({ profilePicture: url });
      onToast("Profile picture updated! ✨");
    } catch {
      onToast("Failed to upload image", "error");
    } finally {
      setUploadingProfile(false);
    }
  }

  async function handleBgImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploadingBg(true);
    try {
      const url = await uploadImage(user.uid, file, "background");
      await saveProfile(user.uid, { backgroundImage: url, backgroundGradient: "" });
      onUpdate({ backgroundImage: url, backgroundGradient: "" });
      onToast("Background updated! 🖼️");
    } catch {
      onToast("Failed to upload background", "error");
    } finally {
      setUploadingBg(false);
    }
  }

  async function selectGradient(id: string) {
    if (!user) return;
    await saveProfile(user.uid, { backgroundGradient: id, backgroundImage: "" });
    onUpdate({ backgroundGradient: id, backgroundImage: "" });
    onToast("Gradient applied!");
  }

  async function selectBgColor(color: string) {
    if (!user) return;
    await saveProfile(user.uid, { backgroundColor: color, backgroundGradient: "", backgroundImage: "" });
    onUpdate({ backgroundColor: color, backgroundGradient: "", backgroundImage: "" });
    onToast("Background color applied!");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* ─── Profile Picture ──────────────────── */}
      <div className="glass-card" style={{ padding: 22 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: "white" }}>
          📸 Profile Picture
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            onClick={() => profilePicRef.current?.click()}
            style={{
              width: 80, height: 80, borderRadius: "50%",
              background: profile.profilePicture
                ? `url(${profile.profilePicture}) center/cover`
                : "linear-gradient(135deg, #2563EB, #3B82F6)",
              cursor: "pointer",
              border: "3px solid rgba(37,99,235,0.4)",
              boxShadow: "0 0 20px rgba(37,99,235,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 28, position: "relative", overflow: "hidden",
            }}
          >
            {!profile.profilePicture && "👤"}
            {uploadingProfile && (
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <LoadingSpinner size={22} />
              </div>
            )}
          </div>
          <div>
            <p style={{ color: "#9CA3AF", fontSize: 13, marginBottom: 8 }}>
              Tap your photo to change it
            </p>
            <button
              className="btn-secondary"
              onClick={() => profilePicRef.current?.click()}
              disabled={uploadingProfile}
              style={{ fontSize: 13, padding: "8px 14px", width: "auto" }}
            >
              {uploadingProfile ? <LoadingSpinner size={14} /> : "📁"}
              Upload Photo
            </button>
          </div>
        </div>
        <input ref={profilePicRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleProfilePicUpload} />
      </div>

      {/* ─── Profile Info ────────────────────── */}
      <div className="glass-card" style={{ padding: 22 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 18, color: "white" }}>
          👤 Profile Info
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={labelStyle}>Full Name</label>
            <input className="input-field" value={form.name} onChange={(e) => handleChange("name", e.target.value)} placeholder="Your full name" />
          </div>
          <div>
            <label style={labelStyle}>Username</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#6B7280", fontSize: 15 }}>@</span>
              <input className="input-field" value={form.username} onChange={(e) => handleChange("username", e.target.value.toLowerCase().replace(/\s+/g, ""))} placeholder="username" style={{ paddingLeft: 28 }} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Profile Title</label>
            <input className="input-field" value={form.title} onChange={(e) => handleChange("title", e.target.value)} placeholder="e.g. Content Creator & Developer" />
          </div>
          <div>
            <label style={labelStyle}>Bio</label>
            <textarea className="input-field" value={form.bio} onChange={(e) => handleChange("bio", e.target.value)} placeholder="Tell your audience about yourself..." rows={3} />
          </div>
          <button className="btn-primary" onClick={handleSaveProfile} disabled={saving} style={{ marginTop: 4 }}>
            {saving ? <LoadingSpinner size={18} /> : "💾"}
            Save Profile
          </button>
        </div>
      </div>

      {/* ─── Background Customization ─────────── */}
      <div className="glass-card" style={{ padding: 22 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 18, color: "white" }}>
          🎨 Background
        </h3>

        {/* Upload */}
        <div
          className="upload-zone"
          onClick={() => bgImageRef.current?.click()}
          style={{ marginBottom: 18 }}
        >
          {uploadingBg ? (
            <div style={{ display: "flex", justifyContent: "center" }}><LoadingSpinner size={28} /></div>
          ) : profile.backgroundImage ? (
            <div>
              <div style={{
                width: "100%", height: 80, borderRadius: 10, overflow: "hidden",
                backgroundImage: `url(${profile.backgroundImage})`,
                backgroundSize: "cover", backgroundPosition: "center", marginBottom: 10,
              }} />
              <p style={{ color: "#9CA3AF", fontSize: 12 }}>Click to change background image</p>
            </div>
          ) : (
            <>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🖼️</div>
              <p style={{ color: "#9CA3AF", fontSize: 13 }}>Upload background image</p>
              <p style={{ color: "#4B5563", fontSize: 11, marginTop: 4 }}>PNG, JPG, WebP supported</p>
            </>
          )}
        </div>
        <input ref={bgImageRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleBgImageUpload} />

        {/* Gradients */}
        <p style={labelStyle}>Gradient Presets</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          {GRADIENTS.map((g) => (
            <button
              key={g.id}
              onClick={() => selectGradient(g.id)}
              title={g.label}
              style={{
                width: 48, height: 28, borderRadius: 8, cursor: "pointer", border: "none",
                background: `linear-gradient(135deg, ${g.colors[0]}, ${g.colors[1]})`,
                outline: profile.backgroundGradient === g.id ? "2px solid #3B82F6" : "none",
                outlineOffset: 2,
                transition: "transform 0.2s",
              }}
            />
          ))}
        </div>

        {/* Solid Colors */}
        <p style={labelStyle}>Solid Colors</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {BG_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => selectBgColor(c)}
              className="color-swatch"
              style={{
                background: c,
                outline: !profile.backgroundGradient && !profile.backgroundImage && profile.backgroundColor === c ? "2px solid #3B82F6" : "none",
                outlineOffset: 2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 11,
  fontWeight: 600,
  color: "#6B7280",
  marginBottom: 6,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};
