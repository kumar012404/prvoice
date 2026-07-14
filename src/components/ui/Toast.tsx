"use client";

import { useEffect } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
}

export default function Toast({ message, type = "success", onClose }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  const colors = {
    success: { bg: "rgba(34,197,94,0.15)", border: "rgba(34,197,94,0.3)", icon: "✅" },
    error: { bg: "rgba(239,68,68,0.15)", border: "rgba(239,68,68,0.3)", icon: "❌" },
    info: { bg: "rgba(37,99,235,0.15)", border: "rgba(37,99,235,0.3)", icon: "ℹ️" },
  };

  const c = colors[type];

  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: 14,
        padding: "14px 20px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        backdropFilter: "blur(20px)",
        boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
        animation: "fadeInUp 0.3s ease",
        maxWidth: "90vw",
        minWidth: 260,
      }}
    >
      <span style={{ fontSize: 18 }}>{c.icon}</span>
      <span style={{ color: "white", fontSize: 14, fontWeight: 500 }}>{message}</span>
      <button
        onClick={onClose}
        style={{
          marginLeft: "auto",
          background: "none",
          border: "none",
          color: "rgba(255,255,255,0.5)",
          cursor: "pointer",
          fontSize: 16,
          lineHeight: 1,
        }}
      >
        ×
      </button>
    </div>
  );
}
