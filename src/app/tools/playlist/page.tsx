import type { Metadata } from "next";
import PlaylistBuilder from "@/components/PlaylistBuilder";

export const metadata: Metadata = {
  title: "Playlist builder · Bodhan",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <PlaylistBuilder />;
}
