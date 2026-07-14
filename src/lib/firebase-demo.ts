// Demo data used when Firebase is not configured (no real project)
// This allows the app to work with mock data for preview purposes
import type { UserProfile, SocialLink, Analytics } from "./types";

export const DEMO_PROFILE: UserProfile = {
  uid: "demo-user-123",
  name: "Alex Johnson",
  username: "alexjohnson",
  bio: "Digital creator & entrepreneur 🚀 Sharing my journey through content, tech & life.",
  title: "Content Creator & Tech Enthusiast",
  profilePicture: "",
  backgroundImage: "",
  backgroundColor: "#0B0F19",
  backgroundGradient: "linear-gradient(135deg, #0B0F19 0%, #1a1f35 50%, #0B0F19 100%)",
  theme: "dark",
};

export const DEMO_LINKS: SocialLink[] = [
  { platform: "instagram", url: "https://instagram.com/demo", enabled: true, clicks: 142 },
  { platform: "youtube", url: "https://youtube.com/@demo", enabled: true, clicks: 98 },
  { platform: "facebook", url: "https://facebook.com/demo", enabled: true, clicks: 67 },
  { platform: "twitter", url: "https://twitter.com/demo", enabled: true, clicks: 203 },
  { platform: "threads", url: "https://threads.net/@demo", enabled: true, clicks: 54 },
  { platform: "whatsapp", url: "https://whatsapp.com/channel/demo", enabled: false, clicks: 31 },
  { platform: "email", url: "mailto:alex@example.com", enabled: false, clicks: 12 },
];

export const DEMO_ANALYTICS: Analytics = {
  profileViews: 1247,
  totalClicks: 595,
  mostClicked: "twitter",
};
