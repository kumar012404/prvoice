"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, query, where, limit, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { UserProfile, SocialLink, SocialPlatform } from "@/lib/types";
import { PLATFORM_META } from "@/lib/types";
import { DEMO_PROFILE, DEMO_LINKS } from "@/lib/firebase-demo";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import PlatformIcon from "@/components/ui/PlatformIcon";

const GRADIENTS: Record<string, string> = {
  gradient1: "linear-gradient(135deg, #0B0F19 0%, #1a1f35 50%, #0B0F19 100%)",
  gradient2: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
  gradient3: "linear-gradient(135deg, #0B0F19 0%, #1e3a5f 100%)",
  gradient4: "linear-gradient(135deg, #1a0533, #2563EB, #0B0F19)",
  gradient5: "linear-gradient(135deg, #0d1117, #161b22, #0d1117)",
};

async function findProfileByUsername(username: string): Promise<{ profile: UserProfile; links: SocialLink[] } | null> {
  try {
    // Query users collection by username field
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username), limit(1));
    const snap = await getDocs(q);

    if (snap.empty) return null;

    const profileDoc = snap.docs[0];
    const profile = profileDoc.data() as UserProfile;
    const uid = profile.uid || profileDoc.id;

    // Fetch links
    const linksSnap = await getDocs(collection(db, "users", uid, "links"));
    const links = linksSnap.docs.map((d) => d.data() as SocialLink);

    return { profile, links };
  } catch {
    return null;
  }
}

interface Props {
  username: string;
}

export default function PublicProfileClient({ username }: Props) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [clickedLinks, setClickedLinks] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const result = await findProfileByUsername(username);
        if (result) {
          setProfile(result.profile);
          setLinks(result.links.filter((l) => l.enabled));
        } else {
          // Fallback to demo for development
          if (username === "demo" || username === "alexjohnson") {
            setProfile(DEMO_PROFILE);
            setLinks(DEMO_LINKS.filter((l) => l.enabled));
          } else {
            setNotFound(true);
          }
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [username]);

  async function handleLinkClick(link: SocialLink) {
    setClickedLinks((s) => new Set([...s, link.platform]));

    // Reset status back to "Tap to open" after 2.5 seconds
    setTimeout(() => {
      setClickedLinks((s) => {
        const next = new Set(s);
        next.delete(link.platform);
        return next;
      });
    }, 2500);

    // Fire-and-forget analytics
    try {
      const { incrementLinkClick } = await import("@/lib/firestore");
      if (profile?.uid) {
        await incrementLinkClick(profile.uid, link.platform);
      }
    } catch {
      // ignore
    }

    let targetUrl = link.url;
    if (link.platform === "email") {
      const trimmedUrl = targetUrl.trim();
      if (trimmedUrl.startsWith("http://") || trimmedUrl.startsWith("https://")) {
        targetUrl = trimmedUrl;
      } else {
        const emailAddress = trimmedUrl.replace(/^mailto:/i, "").trim();
        if (emailAddress.endsWith("@gmail.com")) {
          targetUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emailAddress)}`;
        } else if (emailAddress) {
          targetUrl = `mailto:${emailAddress}`;
        }
      }
    } else {
      if (targetUrl && !targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
        targetUrl = `https://${targetUrl}`;
      }
    }

    if (targetUrl) {
      window.open(targetUrl, "_blank", "noopener,noreferrer");
    }
  }

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", background: "#0B0F19",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column", gap: 14,
      }}>
        <LoadingSpinner size={40} />
        <p style={{ color: "#6B7280", fontSize: 13 }}>Loading profile...</p>
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div style={{
        minHeight: "100vh", background: "#0B0F19",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column", gap: 16, padding: 24,
      }}>
        <div style={{ fontSize: 64 }}>🔍</div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "white", textAlign: "center" }}>
          Profile Not Found
        </h1>
        <p style={{ color: "#6B7280", textAlign: "center", maxWidth: 300, fontSize: 14 }}>
          The profile <strong style={{ color: "#3B82F6" }}>@{username}</strong> doesn&apos;t exist or hasn&apos;t been set up yet.
        </p>
        <a
          href="/"
          style={{
            background: "linear-gradient(135deg, #2563EB, #3B82F6)",
            color: "white",
            padding: "12px 24px",
            borderRadius: 12,
            textDecoration: "none",
            fontWeight: 600,
            fontSize: 14,
            boxShadow: "0 4px 20px rgba(37,99,235,0.4)",
          }}
        >
          Get Your Own BioLink Pro
        </a>
      </div>
    );
  }

  const bgStyle: React.CSSProperties = profile.backgroundImage
    ? {
        backgroundImage: `url(${profile.backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }
    : profile.backgroundGradient && GRADIENTS[profile.backgroundGradient]
    ? { background: GRADIENTS[profile.backgroundGradient] }
    : { background: profile.backgroundColor || "#0B0F19" };

  return (
    <div
      style={{
        minHeight: "100vh",
        ...bgStyle,
        position: "relative",
      }}
    >
      {/* Overlay for bg images */}
      {profile.backgroundImage && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 0 }} />
      )}

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "40px 16px 60px",
          width: "100%",
          maxWidth: 480,
          margin: "0 auto",
          boxSizing: "border-box",
        }}
      >
        {/* Profile Picture */}
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: profile.profilePicture
              ? `url(${profile.profilePicture}) center/cover`
              : "linear-gradient(135deg, #2563EB, #3B82F6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 42,
            marginBottom: 16,
            boxShadow: "0 0 0 4px rgba(37,99,235,0.4), 0 0 30px rgba(37,99,235,0.3), 0 12px 30px rgba(0,0,0,0.4)",
            animation: "float 3s ease-in-out infinite",
          }}
        >
          {!profile.profilePicture && "👤"}
        </div>

        {/* Name */}
        <h1
          style={{
            fontSize: 26,
            fontWeight: 900,
            color: "white",
            textAlign: "center",
            marginBottom: 4,
            textShadow: "0 2px 10px rgba(0,0,0,0.5)",
          }}
        >
          {profile.name}
        </h1>

        {/* Username */}
        <p style={{ color: "#3B82F6", fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
          @{profile.username}
        </p>

        {/* Email */}
        {profile.email && (
          <p style={{ color: "rgba(255, 255, 255, 0.55)", fontSize: 13, fontWeight: 500, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
            📧 {profile.email}
          </p>
        )}

        {/* Title */}
        {profile.title && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 12px",
              background: "rgba(37,99,235,0.15)",
              border: "1px solid rgba(37,99,235,0.3)",
              borderRadius: 999,
              marginBottom: 12,
            }}
          >
            <span style={{ fontSize: 11, color: "#60A5FA", fontWeight: 600 }}>✦</span>
            <span style={{ fontSize: 12, color: "#93C5FD", fontWeight: 600 }}>{profile.title}</span>
          </div>
        )}

        {/* Bio */}
        {profile.bio && (
          <p
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: 14,
              textAlign: "center",
              lineHeight: 1.6,
              maxWidth: 320,
              marginBottom: 32,
            }}
          >
            {profile.bio}
          </p>
        )}

        {/* Social Links */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
          {links.map((link, idx) => {
            const meta = PLATFORM_META[link.platform as SocialPlatform];
            if (!meta) return null;
            const wasClicked = clickedLinks.has(link.platform);

            return (
              <button
                key={link.platform}
                className="social-btn"
                onClick={() => handleLinkClick(link)}
                style={{
                  animationDelay: `${idx * 0.08}s`,
                  animation: "fadeInUp 0.5s ease forwards",
                  opacity: 0,
                }}
              >
                <div
                  className="social-btn-icon"
                  style={{ background: meta.gradient }}
                >
                  <PlatformIcon platform={link.platform} size={22} />
                </div>
                <div className="social-btn-text">
                  <span className="social-btn-name">{meta.name}</span>
                  <span className="social-btn-action">
                    {wasClicked ? "Opening..." : "Tap to open"}
                  </span>
                </div>
                <span className="social-btn-arrow">›</span>
              </button>
            );
          })}
        </div>

        {links.length === 0 && (
          <div style={{
            textAlign: "center", padding: 30,
            background: "rgba(255,255,255,0.04)",
            borderRadius: 16, width: "100%",
            border: "1px solid rgba(255,255,255,0.08)",
          }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>🔗</div>
            <p style={{ color: "#6B7280", fontSize: 13 }}>No links added yet</p>
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: 48, textAlign: "center" }}>
          <a
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              color: "rgba(255,255,255,0.25)",
              textDecoration: "none",
              fontWeight: 600,
              transition: "color 0.2s",
            }}
          >
            🔗 Create your BioLink Pro
          </a>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
