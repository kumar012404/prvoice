"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B0F19",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <LoadingSpinner size={40} />
        <p style={{ color: "#6B7280", fontSize: 14 }}>Loading BioLink Pro...</p>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
