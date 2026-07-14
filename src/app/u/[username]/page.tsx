import { Metadata } from "next";
import PublicProfileClient from "./PublicProfileClient";

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  return {
    title: `@${username} – BioLink Pro`,
    description: `Check out ${username}'s links on BioLink Pro`,
    openGraph: {
      title: `@${username} on BioLink Pro`,
      description: `All links in one place`,
      type: "profile",
    },
  };
}

export default async function PublicProfilePage({ params }: Props) {
  const { username } = await params;
  return <PublicProfileClient username={username} />;
}
