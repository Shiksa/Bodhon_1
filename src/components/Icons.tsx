import type { SVGProps } from "react";

const base = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export const PlayIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p} fill="currentColor" stroke="none">
    <path d="M7 4.8v14.4a1 1 0 0 0 1.5.86l12-7.2a1 1 0 0 0 0-1.72l-12-7.2A1 1 0 0 0 7 4.8z" />
  </svg>
);
export const PauseIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p} fill="currentColor" stroke="none">
    <rect x="6" y="4.5" width="4" height="15" rx="1.2" />
    <rect x="14" y="4.5" width="4" height="15" rx="1.2" />
  </svg>
);
export const VolumeIcon = ({
  muted,
  ...p
}: SVGProps<SVGSVGElement> & { muted?: boolean }) => (
  <svg {...base} {...p}>
    <path d="M11 5 6 9H3v6h3l5 4V5z" fill="currentColor" />
    {muted ? (
      <path d="m22 9-6 6m0-6 6 6" />
    ) : (
      <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
    )}
  </svg>
);
export const ShareIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" />
  </svg>
);
export const ChevronIcon = ({
  dir = "right",
  ...p
}: SVGProps<SVGSVGElement> & { dir?: "left" | "right" }) => (
  <svg {...base} {...p}>
    <path d={dir === "right" ? "m9 6 6 6-6 6" : "m15 6-6 6 6 6"} />
  </svg>
);
export const CalendarIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M16 3v4M8 3v4M3 10h18" />
  </svg>
);

export const PrevIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p} fill="currentColor" stroke="none">
    <rect x="4" y="5" width="2.6" height="14" rx="1" />
    <path d="M20 5.6v12.8a.8.8 0 0 1-1.25.66L9.2 12.66a.8.8 0 0 1 0-1.32l9.55-6.4A.8.8 0 0 1 20 5.6z" />
  </svg>
);
export const NextIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p} fill="currentColor" stroke="none">
    <rect x="17.4" y="5" width="2.6" height="14" rx="1" />
    <path d="M4 5.6v12.8a.8.8 0 0 0 1.25.66l9.55-6.4a.8.8 0 0 0 0-1.32L5.25 4.94A.8.8 0 0 0 4 5.6z" />
  </svg>
);
export const ShuffleIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
  </svg>
);
export const RepeatIcon = ({
  one,
  ...p
}: SVGProps<SVGSVGElement> & { one?: boolean }) => (
  <svg {...base} {...p}>
    <path d="m17 2 4 4-4 4" />
    <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
    <path d="m7 22-4-4 4-4" />
    <path d="M21 13v1a4 4 0 0 1-4 4H3" />
    {one && <path d="M11 10h1v4" strokeWidth={2.2} />}
  </svg>
);
export const ListIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="M3 6h12M3 12h12M3 18h7" />
    <circle cx="18" cy="17" r="2.5" />
    <path d="M20.5 17V7l-3 1" />
  </svg>
);
export const DrumIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <ellipse cx="12" cy="7" rx="8" ry="3" />
    <path d="M4 7v9c0 1.7 3.6 3 8 3s8-1.3 8-3V7" />
    <path d="m8 10 2 8M16 10l-2 8M3 2l5 4M21 2l-5 4" />
  </svg>
);
export const RadioIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="2" />
    <path d="M16.24 7.76a6 6 0 0 1 0 8.49M7.76 16.24a6 6 0 0 1 0-8.49M19.07 4.93a10 10 0 0 1 0 14.14M4.93 19.07a10 10 0 0 1 0-14.14" />
  </svg>
);
export const CloseIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);
export const YouTubeIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width={20} height={20} {...p}>
    <rect x="1.5" y="5" width="21" height="14" rx="4" fill="#ff1a1a" />
    <path d="M10 9v6l5.2-3z" fill="#fff" />
  </svg>
);
export const BellIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);
