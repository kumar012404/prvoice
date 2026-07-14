"use client";

import type { UserProfile, SocialLink } from "@/lib/types";
import { PLATFORM_META } from "@/lib/types";
import PlatformIcon from "@/components/ui/PlatformIcon";

interface MobilePreviewProps {
  profile: UserProfile;
  links: SocialLink[];
}

const GRADIENTS: Record<string, string> = {
  gradient1: "linear-gradient(135deg, #0B0F19 0%, #1a1f35 50%, #0B0F19 100%)",
  gradient2: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
  gradient3: "linear-gradient(135deg, #0B0F19 0%, #1e3a5f 100%)",
  gradient4: "linear-gradient(135deg, #1a0533, #2563EB, #0B0F19)",
  gradient5: "linear-gradient(135deg, #0d1117, #161b22, #0d1117)",
};

export default function MobilePreview({ profile, links }: MobilePreviewProps) {
  const enabledLinks = links.filter((l) => l.enabled);

  const bgStyle = profile.backgroundImage
    ? {
        backgroundImage: `url(${profile.backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : profile.backgroundGradient && GRADIENTS[profile.backgroundGradient]
    ? { background: GRADIENTS[profile.backgroundGradient] }
    : { background: profile.backgroundColor || "#0B0F19" };

  return (
    <div className="mobile-frame" style={{ ...bgStyle }}>
      <div className="mobile-notch" />

      {/* Overlay */}
      {profile.backgroundImage && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
          }}
        />
      )}

      {/* Scrollable content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          height: "100%",
          overflowY: "auto",
          padding: "40px 16px 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Avatar */}
        <div style={{ position: "relative", marginBottom: 14 }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              overflow: "hidden",
              border: "3px solid transparent",
              background: profile.profilePicture
                ? `url(${profile.profilePicture}) center/cover`
                : "linear-gradient(135deg, #2563EB, #3B82F6)",
              boxShadow: "0 0 0 3px rgba(37,99,235,0.5), 0 8px 20px rgba(0,0,0,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              color: "white",
            }}
          >
            {!profile.profilePicture && "👤"}
          </div>
        </div>

        {/* Name */}
        <h2 style={{ color: "white", fontSize: 17, fontWeight: 800, textAlign: "center", marginBottom: 3, textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>
          {profile.name || "Your Name"}
        </h2>
        <p style={{ color: "#3B82F6", fontSize: 11, fontWeight: 600, marginBottom: 2 }}>
          @{profile.username || "username"}
        </p>
        {profile.email && (
          <p style={{ color: "rgba(255, 255, 255, 0.45)", fontSize: 10, fontWeight: 500, marginBottom: 6 }}>
            📧 {profile.email}
          </p>
        )}
        {profile.title && (
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 10, fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {profile.title}
          </p>
        )}
        {profile.bio && (
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 11, textAlign: "center", marginBottom: 16, lineHeight: 1.5, maxWidth: 220 }}>
            {profile.bio}
          </p>
        )}

        {/* Social Links */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 9 }}>
          {enabledLinks.length === 0 ? (
            <div style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 11 }}>
              No links added yet
            </div>
          ) : (
            enabledLinks.map((link) => {
              const meta = PLATFORM_META[link.platform];
              return (
                <div
                  key={link.platform}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 12px",
                    borderRadius: 12,
                    background: "rgba(255,255,255,0.07)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: 9,
                    background: meta.gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    color: "white",
                  }}>
                    <PlatformIcon platform={link.platform} size={15} />
                  </div>
                  <span style={{ color: "white", fontSize: 12, fontWeight: 600, flex: 1 }}>
                    {meta.name}
                  </span>
                  <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>›</span>
                </div>
              );
            })
          )}
        </div>

        <p style={{ marginTop: 20, color: "rgba(255,255,255,0.2)", fontSize: 9, fontWeight: 600 }}>
          POWERED BY BIOLINK PRO
        </p>
      </div>
    </div>
  );
}
