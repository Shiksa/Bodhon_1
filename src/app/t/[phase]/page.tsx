// Share links like /t/ashtami/ carry that day's preview image and line, then open the live site.
import type { Metadata } from "next";
import Bodhan from "@/components/Bodhan";
import { PHASES } from "@/config/tithis";
import { site } from "@/config/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return PHASES.map((p) => ({ phase: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ phase: string }> }): Promise<Metadata> {
  const { phase } = await params;
  const p = PHASES.find((x) => x.id === phase) ?? PHASES[0];
  const title = `${site.nameBn} · ${p.bnLong}`;
  const description = `${p.captions[0].bn} ${p.captions[0].en}`;
  return {
    title,
    description,
    openGraph: { title, description, url: `${site.url}/t/${p.id}/`, images: [{ url: `/og/${p.id}.jpg`, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title, description, images: [`/og/${p.id}.jpg`] },
  };
}

export default function PhasePage() {
  return <Bodhan />;
}
