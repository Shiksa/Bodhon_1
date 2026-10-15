// Optimises AI paintings and video loops for the scenes, and writes the manifest
// the site reads. Run: npm run scenes   (also runs automatically before build)
//
// Put files in creatives/raw named by scene id (see src/config/scenes.ts):
//   shashthi-bodhon.png       desktop 16:9 painting
//   shashthi-bodhon-m.png     mobile 9:16 painting (optional, falls back to desktop)
//   shashthi-bodhon.webm      desktop video loop (optional, .mp4 also works)
//   shashthi-bodhon-m.webm    mobile video loop (optional)
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const RAW = "creatives/raw";
const OUT = "public/scenes";
const MANIFEST = "src/data/scene-assets.json";
const WIDTHS = { d: [1280, 1920, 2560], m: [720, 1080, 1440] };

fs.mkdirSync(OUT, { recursive: true });
const files = fs.existsSync(RAW) ? fs.readdirSync(RAW) : [];
const manifest = {};

for (const f of files) {
  const ext = path.extname(f).toLowerCase();
  const base = path.basename(f, ext);
  const mobile = base.endsWith("-m");
  const id = mobile ? base.slice(0, -2) : base;
  const entry = (manifest[id] ??= {});

  if ([".png", ".jpg", ".jpeg", ".webp", ".avif"].includes(ext)) {
    const key = mobile ? "m" : "d";
    const webp = [];
    const avif = [];
    const meta = await sharp(path.join(RAW, f)).metadata();
    for (const w of WIDTHS[key]) {
      if (meta.width && w > meta.width * 1.05 && w !== WIDTHS[key][0]) continue;
      const name = `${base}-${w}`;
      const img = sharp(path.join(RAW, f)).resize({ width: w, withoutEnlargement: true });
      await img.clone().webp({ quality: 78 }).toFile(path.join(OUT, `${name}.webp`));
      await img.clone().avif({ quality: 55 }).toFile(path.join(OUT, `${name}.avif`));
      webp.push(`/scenes/${name}.webp ${w}w`);
      avif.push(`/scenes/${name}.avif ${w}w`);
    }
    entry[key] = {
      srcset: { webp: webp.join(", "), avif: avif.join(", ") },
      fallback: webp[webp.length - 1].split(" ")[0],
    };
    console.log(`image  ${f} -> ${webp.length} sizes`);
  } else if ([".webm", ".mp4"].includes(ext)) {
    fs.copyFileSync(path.join(RAW, f), path.join(OUT, f));
    const size = fs.statSync(path.join(OUT, f)).size / 1e6;
    if (size > 2.5) console.warn(`warn   ${f} is ${size.toFixed(1)} MB; aim for under 2.5 MB`);
    entry[mobile ? "videoM" : "video"] = `/scenes/${f}`;
    console.log(`video  ${f}`);
  }
}

fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log(`scenes: ${Object.keys(manifest).length} with custom art`);
