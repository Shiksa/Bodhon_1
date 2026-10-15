// Optional: fill titles and durations with the YouTube Data API instead of
// the in-browser tool at /tools/playlist.
//   1. Put YT_API_KEY=... in .env.local  (free key from Google Cloud Console)
//   2. Add entries to src/data/songs.json as { "url": "https://youtu.be/...", "tags": ["ashtami"] }
//   3. npm run playlist
import fs from "node:fs";

const FILE = "src/data/songs.json";
const env = fs.existsSync(".env.local") ? fs.readFileSync(".env.local", "utf8") : "";
const KEY = process.env.YT_API_KEY ?? env.match(/^YT_API_KEY=(.+)$/m)?.[1]?.trim();
if (!KEY) {
  console.error("No YT_API_KEY found. Use the in-browser tool at /tools/playlist instead (no key needed).");
  process.exit(1);
}

const idFrom = (s = "") => {
  if (/^[\w-]{11}$/.test(s)) return s;
  try {
    const u = new URL(s);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1, 12);
    return u.searchParams.get("v") ?? u.pathname.match(/\/(embed|shorts|live)\/([\w-]{11})/)?.[2];
  } catch {
    return null;
  }
};
const iso = (d) => {
  const m = d.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  return (+(m?.[1] ?? 0)) * 3600 + (+(m?.[2] ?? 0)) * 60 + +(m?.[3] ?? 0);
};

const data = JSON.parse(fs.readFileSync(FILE, "utf8"));
const songs = data.songs.map((s) => ({ ...s, id: s.id ?? idFrom(s.url) }));
const ids = songs.map((s) => s.id).filter(Boolean);
const found = {};
for (let i = 0; i < ids.length; i += 50) {
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,status&id=${ids.slice(i, i + 50).join(",")}&key=${KEY}`;
  const res = await fetch(url).then((r) => r.json());
  if (res.error) throw new Error(res.error.message);
  for (const v of res.items ?? []) found[v.id] = v;
}
data.songs = songs
  .map((s) => {
    const v = found[s.id];
    if (!v) return console.warn(`missing  ${s.id}`), null;
    if (!v.status?.embeddable) return console.warn(`blocked  ${s.id} ${v.snippet.title} (embedding disabled)`), null;
    const { url, ...rest } = s;
    return { ...rest, title: s.title ?? v.snippet.title, artist: s.artist ?? v.snippet.channelTitle, duration: iso(v.contentDetails.duration) };
  })
  .filter(Boolean);
fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + "\n");
console.log(`songs.json: ${data.songs.length} playable songs`);
