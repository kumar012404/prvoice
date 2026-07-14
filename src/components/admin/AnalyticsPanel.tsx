"use client";

import type { Analytics, SocialLink, SocialPlatform } from "@/lib/types";
import { PLATFORM_META } from "@/lib/types";

interface AnalyticsPanelProps {
  analytics: Analytics;
  links: SocialLink[];
}

export default function AnalyticsPanel({ analytics, links }: AnalyticsPanelProps) {
  const sorted = [...links].sort((a, b) => b.clicks - a.clicks);
  const topPlatform = sorted[0];

  const stats = [
    {
      label: "Profile Views",
      value: analytics.profileViews.toLocaleString(),
      icon: "👁️",
      color: "#3B82F6",
      change: "+12%",
    },
    {
      label: "Total Clicks",
      value: analytics.totalClicks.toLocaleString(),
      icon: "🖱️",
      color: "#10B981",
      change: "+8%",
    },
    {
      label: "Most Clicked",
      value: topPlatform
        ? PLATFORM_META[topPlatform.platform as SocialPlatform]?.name || "—"
        : "—",
      icon: "🏆",
      color: "#F59E0B",
      change: topPlatform ? `${topPlatform.clicks} clicks` : "No data",
    },
  ];

  const maxClicks = Math.max(...links.map((l) => l.clicks), 1);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: "white" }}>📊 Analytics</h2>
        <p style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>
          Track your profile performance
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "white", marginBottom: 2 }}>
              {s.value}
            </div>
            <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 11, color: s.color, fontWeight: 600 }}>{s.change}</div>
          </div>
        ))}
      </div>

      {/* Link Performance */}
      <div className="glass-card" style={{ padding: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: "white" }}>
          🔗 Link Performance
        </h3>
        {links.length === 0 ? (
          <p style={{ color: "#4B5563", fontSize: 13, textAlign: "center", padding: "20px 0" }}>
            No links added yet. Add links to see analytics.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {sorted.map((link) => {
              const meta = PLATFORM_META[link.platform as SocialPlatform];
              if (!meta) return null;
              const pct = (link.clicks / maxClicks) * 100;
              return (
                <div key={link.platform}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: 8,
                      background: meta.gradient,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 14, flexShrink: 0,
                    }}>
                      {meta.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "white" }}>{meta.name}</span>
                        <span style={{ fontSize: 13, color: "#9CA3AF" }}>{link.clicks} clicks</span>
                      </div>
                    </div>
                  </div>
                  <div style={{
                    height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden",
                  }}>
                    <div style={{
                      height: "100%",
                      width: `${pct}%`,
                      background: "linear-gradient(90deg, #2563EB, #3B82F6)",
                      borderRadius: 4,
                      transition: "width 0.8s cubic-bezier(0.34,1.56,0.64,1)",
                      boxShadow: "0 0 8px rgba(59,130,246,0.5)",
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Engagement rate */}
      <div className="glass-card-blue" style={{ padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 28 }}>📈</div>
          <div>
            <p style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 2 }}>Engagement Rate</p>
            <p style={{ fontSize: 24, fontWeight: 800, color: "white" }}>
              {analytics.profileViews > 0
                ? `${((analytics.totalClicks / analytics.profileViews) * 100).toFixed(1)}%`
                : "—"}
            </p>
            <p style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>
              Clicks per profile view
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
