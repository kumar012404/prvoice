"use client";

import { useState } from "react";
import type { SocialLink, SocialPlatform } from "@/lib/types";
import { PLATFORM_META } from "@/lib/types";
import { saveSocialLink } from "@/lib/firestore";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import PlatformIcon from "@/components/ui/PlatformIcon";

interface LinksManagerProps {
  links: SocialLink[];
  onUpdate: (links: SocialLink[]) => void;
  onToast: (msg: string, type?: "success" | "error") => void;
}

const PLATFORMS: SocialPlatform[] = [
  "instagram",
  "youtube",
  "facebook",
  "twitter",
  "threads",
  "whatsapp",
  "email",
];

export default function LinksManager({ links, onUpdate, onToast }: LinksManagerProps) {
  const { user } = useAuth();
  const [saving, setSaving] = useState<string | null>(null);
  const [editing, setEditing] = useState<Record<string, string>>({});

  // Build a map from platform -> link
  const linkMap: Record<string, SocialLink> = {};
  for (const l of links) {
    linkMap[l.platform] = l;
  }

  function getLink(platform: SocialPlatform): SocialLink {
    return (
      linkMap[platform] || {
        platform,
        url: "",
        enabled: false,
        clicks: 0,
      }
    );
  }

  function handleUrlChange(platform: SocialPlatform, value: string) {
    setEditing((e) => ({ ...e, [platform]: value }));
  }

  async function handleSave(platform: SocialPlatform) {
    if (!user) return;
    setSaving(platform);
    const url = editing[platform] ?? getLink(platform).url;
    const link = getLink(platform);
    const updated: SocialLink = { ...link, url, platform };
    try {
      await saveSocialLink(user.uid, updated);
      const newLinks = [...links.filter((l) => l.platform !== platform), updated];
      onUpdate(newLinks);
      onToast(`${PLATFORM_META[platform].name} link saved! ✓`);
    } catch {
      onToast("Failed to save link", "error");
    } finally {
      setSaving(null);
    }
  }

  async function handleToggle(platform: SocialPlatform) {
    if (!user) return;
    const link = getLink(platform);
    const updated: SocialLink = { ...link, enabled: !link.enabled };
    try {
      await saveSocialLink(user.uid, updated);
      const newLinks = [...links.filter((l) => l.platform !== platform), updated];
      onUpdate(newLinks);
      onToast(
        updated.enabled
          ? `${PLATFORM_META[platform].name} enabled!`
          : `${PLATFORM_META[platform].name} disabled`
      );
    } catch {
      onToast("Failed to update", "error");
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ marginBottom: 4 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: "white" }}>🔗 Social Links</h2>
        <p style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>
          Add and manage your social media links
        </p>
      </div>

      {PLATFORMS.map((platform) => {
        const meta = PLATFORM_META[platform];
        const link = getLink(platform);
        const urlValue = editing[platform] ?? link.url;
        const isSaving = saving === platform;

        return (
          <div
            key={platform}
            className="glass-card"
            style={{
              padding: 18,
              borderColor: link.enabled
                ? "rgba(37,99,235,0.25)"
                : "rgba(255,255,255,0.06)",
              transition: "border-color 0.3s",
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: meta.gradient,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: `0 4px 12px rgba(0,0,0,0.3)`,
                  color: "white",
                }}
              >
                <PlatformIcon platform={platform} size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, fontSize: 15, color: "white" }}>{meta.name}</p>
                {link.clicks > 0 && (
                  <p style={{ fontSize: 11, color: "#6B7280", marginTop: 1 }}>
                    {link.clicks} click{link.clicks !== 1 ? "s" : ""}
                  </p>
                )}
              </div>
              {/* Toggle */}
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={link.enabled}
                  onChange={() => handleToggle(platform)}
                />
                <span className="toggle-slider" />
              </label>
            </div>

            {/* URL Input */}
            <div style={{ display: "flex", gap: 8 }}>
              <input
                className="input-field"
                type="url"
                placeholder={meta.placeholder}
                value={urlValue}
                onChange={(e) => handleUrlChange(platform, e.target.value)}
                style={{ fontSize: 13, flex: 1 }}
              />
              <button
                className="btn-primary"
                onClick={() => handleSave(platform)}
                disabled={isSaving}
                style={{ width: "auto", padding: "0 16px", minWidth: 72, flexShrink: 0, fontSize: 13 }}
              >
                {isSaving ? <LoadingSpinner size={14} /> : "Save"}
              </button>
            </div>

            {/* Status badge */}
            <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6 }}>
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: link.enabled ? "#4ADE80" : "#4B5563",
                  boxShadow: link.enabled ? "0 0 6px rgba(74,222,128,0.6)" : "none",
                }}
              />
              <span style={{ fontSize: 11, color: link.enabled ? "#4ADE80" : "#4B5563", fontWeight: 600 }}>
                {link.enabled ? "ACTIVE" : "DISABLED"}
              </span>
              {link.url && (
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ marginLeft: "auto", fontSize: 11, color: "#3B82F6", fontWeight: 600 }}
                >
                  Preview ↗
                </a>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
