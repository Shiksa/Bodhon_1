// Site-wide settings. Everything marked TODO is a placeholder to fill in.

export const site = {
  name: "Bodhan",
  nameBn: "বোধন",
  taglineBn: "পুজোর গান, একসাথে, এক তালে",
  taglineEn: "Pujo songs, together, in one rhythm",
  // TODO: set to your real domain once you have one (used for share links and OG tags)
  url: "https://bodhan.netlify.app",
  description:
    "বোধন: দুর্গাপুজোর গানের লাইভ রেডিও। Panchami to Dashami, every visitor hears the same pujo song at the same moment, while the scene changes with each tithi.",

  brands: {
    left: {
      name: "RSC Group",
      logo: "/brand/rsc.png",
      // TODO: replace with the real RSC Group website
      href: "https://www.rscgroup.in",
    },
    right: {
      name: "Saltbuzz",
      logo: "/brand/saltbuzz.png",
      // TODO: replace with the real Saltbuzz website
      href: "https://www.saltbuzz.co",
    },
  },

  credit: {
    text: "Crafted by Saltbuzz",
    // TODO: optional Instagram handle, e.g. "https://instagram.com/saltbuzz"
    instagram: "",
  },
} as const;
