export type SocialPlatform =
  | "instagram"
  | "youtube"
  | "facebook"
  | "twitter"
  | "threads"
  | "whatsapp"
  | "email";

export interface SocialLink {
  platform: SocialPlatform;
  url: string;
  enabled: boolean;
  clicks: number;
}

export interface UserProfile {
  uid: string;
  name: string;
  email?: string;
  username: string;
  bio: string;
  title: string;
  profilePicture: string;
  backgroundImage: string;
  backgroundColor: string;
  backgroundGradient: string;
  theme: string;
}

export interface Analytics {
  profileViews: number;
  totalClicks: number;
  mostClicked: string;
}

export interface PlatformMeta {
  name: string;
  icon: string;
  color: string;
  gradient: string;
  placeholder: string;
}

export const PLATFORM_META: Record<SocialPlatform, PlatformMeta> = {
  instagram: {
    name: "Instagram",
    icon: "📷",
    color: "#E1306C",
    gradient: "linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)",
    placeholder: "https://instagram.com/yourusername",
  },
  youtube: {
    name: "YouTube",
    icon: "▶️",
    color: "#FF0000",
    gradient: "linear-gradient(135deg, #FF0000, #CC0000)",
    placeholder: "https://youtube.com/@yourchannel",
  },
  facebook: {
    name: "Facebook",
    icon: "📘",
    color: "#1877F2",
    gradient: "linear-gradient(135deg, #1877F2, #0d6fdb)",
    placeholder: "https://facebook.com/yourpage",
  },
  twitter: {
    name: "X (Twitter)",
    icon: "✖️",
    color: "#000000",
    gradient: "linear-gradient(135deg, #1a1a1a, #333333)",
    placeholder: "https://x.com/yourusername",
  },
  threads: {
    name: "Threads",
    icon: "🧵",
    color: "#000000",
    gradient: "linear-gradient(135deg, #101010, #2a2a2a)",
    placeholder: "https://threads.net/@yourusername",
  },
  whatsapp: {
    name: "WhatsApp Channel",
    icon: "💬",
    color: "#25D366",
    gradient: "linear-gradient(135deg, #25D366, #128C7E)",
    placeholder: "https://whatsapp.com/channel/yourhandle",
  },
  email: {
    name: "Email (Gmail)",
    icon: "✉️",
    color: "#EA4335",
    gradient: "linear-gradient(135deg, #EA4335, #C5221F)",
    placeholder: "mailto:yourname@gmail.com",
  },
};
