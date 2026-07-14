"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import QRCode from "qrcode";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface QRCodePanelProps {
  username: string;
  onToast: (msg: string, type?: "success" | "error" | "info") => void;
}

export default function QRCodePanel({ username, onToast }: QRCodePanelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [profileUrl, setProfileUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);

  const generateQR = useCallback(async (url: string) => {
    if (!canvasRef.current || !url) return;
    setGenerating(true);
    try {
      await QRCode.toCanvas(canvasRef.current, url, {
        width: 220,
        margin: 2,
        color: { dark: "#0B0F19", light: "#ffffff" },
        errorCorrectionLevel: "M",
      });
    } catch (e) {
      console.error("QR generation error", e);
    } finally {
      setGenerating(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/u/${username || "demo"}`;
      setProfileUrl(url);
      generateQR(url);
    }
  }, [username, generateQR]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      onToast("Link copied to clipboard! 🔗", "success");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      onToast("Failed to copy", "error");
    }
  }

  function downloadQR() {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `biolink-qr-${username}.png`;
    a.click();
    onToast("QR Code downloaded! 📲");
  }

  async function shareQR() {
    if (!canvasRef.current) return;
    try {
      const blob = await new Promise<Blob>((resolve) => {
        canvasRef.current!.toBlob((b) => resolve(b!), "image/png");
      });
      if (navigator.share) {
        await navigator.share({
          title: "My BioLink Pro",
          text: `Check out my profile: ${profileUrl}`,
          files: [new File([blob], "qr-code.png", { type: "image/png" })],
        });
      } else {
        downloadQR();
      }
    } catch {
      downloadQR();
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: "white" }}>📱 QR Code</h2>
        <p style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>
          Share your profile with a scannable QR code
        </p>
      </div>

      {/* QR Code */}
      <div className="glass-card" style={{ padding: 28, textAlign: "center" }}>
        <div
          style={{
            display: "inline-flex",
            flexDirection: "column",
            alignItems: "center",
            background: "white",
            borderRadius: 20,
            padding: "20px 20px 14px",
            boxShadow: "0 8px 40px rgba(37,99,235,0.3), 0 0 0 1px rgba(37,99,235,0.1)",
          }}
        >
          {generating ? (
            <div style={{ width: 220, height: 220, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <LoadingSpinner size={40} />
            </div>
          ) : null}
          <canvas
            ref={canvasRef}
            style={{ display: generating ? "none" : "block", borderRadius: 8 }}
          />
          <div style={{ marginTop: 10 }}>
            <p style={{ fontSize: 11, color: "#0B0F19", fontWeight: 800, letterSpacing: "0.08em" }}>
              BIOLINK PRO
            </p>
            <p style={{ fontSize: 10, color: "#6B7280", marginTop: 2 }}>@{username}</p>
          </div>
        </div>

        <div style={{ marginTop: 20, display: "flex", gap: 10, justifyContent: "center" }}>
          <button className="btn-primary" onClick={downloadQR} style={{ width: "auto", padding: "10px 18px" }}>
            ⬇️ Download
          </button>
          <button className="btn-secondary" onClick={shareQR} style={{ padding: "10px 18px" }}>
            📤 Share
          </button>
        </div>
      </div>

      {/* Public Link */}
      <div className="glass-card" style={{ padding: 20 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Your Public Link
        </p>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div
            style={{
              flex: 1, padding: "12px 14px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12,
              fontSize: 13, color: "#9CA3AF",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}
          >
            {profileUrl}
          </div>
          <button
            className="btn-primary"
            onClick={copyLink}
            style={{ width: "auto", padding: "11px 16px", flexShrink: 0, fontSize: 13 }}
          >
            {copied ? "✓ Copied" : "📋 Copy"}
          </button>
        </div>

        <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
            style={{ flex: 1, textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 13, padding: "10px" }}
          >
            🌐 Open Public Profile
          </a>
        </div>
      </div>

      {/* Tips */}
      <div className="glass-card-blue" style={{ padding: 18 }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: "#60A5FA", marginBottom: 10 }}>
          💡 Pro Tips
        </h3>
        <ul style={{ display: "flex", flexDirection: "column", gap: 6, paddingLeft: 0, listStyle: "none" }}>
          {[
            "Print your QR code on business cards",
            "Add it to your email signature",
            "Share on Instagram Stories",
            "Include in presentations",
          ].map((tip) => (
            <li key={tip} style={{ fontSize: 12, color: "#9CA3AF", display: "flex", gap: 6, alignItems: "flex-start" }}>
              <span style={{ color: "#3B82F6", flexShrink: 0 }}>→</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
