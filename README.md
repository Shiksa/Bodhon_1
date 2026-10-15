# বোধন · Bodhan

A Durga Puja live radio. From Panchami to Dashami the scene follows the real festival, changing by tithi and by time of day, with smoke, kash, diyas, shiuli and sindoor moving in every scene. Every visitor hears the same pujo song at the same moment, as if standing in the same pandal.

Built for Saltbuzz (RSC Group). Next.js static site, free to host on Netlify or Vercel.

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # static site in /out
```

Node 20 or newer.

**Preview any day or scene** while testing:

- `/?tithi=ashtami` shows Ashtami (phases: `agomoni`, `shashthi`, `saptami`, `ashtami`, `navami`, `dashami`, `bijoya`)
- `/?tithi=navami&scene=navami-dhunuchi` pins one scene
- Arrow keys or swipe change scenes; scenes also rotate every 75 seconds

---

## 1. Add your songs (do this first)

The radio stays in "coming soon" mode until it has songs.

1. Run the site (`npm run dev`) and open **`/tools/playlist`**.
2. Paste YouTube links, one per line. Optionally add tithi tags after a link:
   ```
   https://youtu.be/XXXXXXXXXXX
   https://www.youtube.com/watch?v=YYYYYYYYYYY ashtami navami
   ```
3. Press **Read videos**. The tool loads each video (muted) in YouTube's own player and reads its real title, channel and length. No API key needed. Videos marked **blocked** don't allow embedding; find another upload of that song.
4. **Download songs.json** and replace `src/data/songs.json` with it. Rebuild and deploy.

Tags decide which day a song plays on. Untagged songs play every day. A day with no tagged songs plays everything.

Alternative: `npm run playlist` fills titles and durations with the YouTube Data API if you put `YT_API_KEY=...` in `.env.local` and list songs as `{ "url": "...", "tags": [...] }`.

### How the shared radio works

There is no server. Each phase's playlist starts at that phase's start time and loops, so every visitor computes the same answer from `(now - phaseStart) mod totalDuration`. The site corrects for wrong phone clocks by reading the time from its own host, and re-checks every 30 seconds, re-seeking if a listener drifts more than 2 seconds. If a video stops being playable, every visitor drops it at the same moment and stays in sync.

Audio only starts after a tap (browsers block autoplay with sound), so the first screen has one clear button: **ঢাকে কাঠি পড়ুক**. Tapping always joins the live position, like tuning a radio.

The YouTube player stays visible in the framed window in the dock. This is deliberate: YouTube's API terms do not allow hiding the player.

---

## 2. Set the pujo calendar and ritual times

Everything lives in **`src/config/tithis.ts`**:

- `PHASES`: each tithi's start time (IST), colours, captions and song tags. Dates are set to the 2026 Kolkata calendar (Drik Panchang): Shashthi Sat 17 Oct, Saptami Sun 18, Ashtami Mon 19, Navami Tue 20, Bijoya Dashami Wed 21. Check against your panjika and edit if needed.
- `EVENTS`: Bodhon, Nabapatrika snan, anjali, Kumari pujo, **Sandhi pujo**, sindoor khela, bisarjan. All clock times are `null` on purpose: the site counts down to the day and never shows an invented time. When you have exact times from your panjika, fill them in, e.g. `time: "10:51"`, and the chip counts down to the minute.

All times are Kolkata time, so visitors abroad see Kolkata's tithi.

---

## 3. Replace drawings with AI paintings (optional, anytime)

Every scene already works as an animated illustration. To make the site fully painted:

1. Open **`creatives/PROMPTS.md`**. Copy the master style block plus a scene's prompt into Gemini, ChatGPT or Midjourney.
2. Save results in `creatives/raw/` named by scene id: `ashtami-sandhi.png` (desktop 16:9), `ashtami-sandhi-m.png` (mobile 9:16, optional), `ashtami-sandhi.webm` (video loop, optional, under 2.5 MB).
3. Run `npm run scenes` (also runs before every build). It makes AVIF and WebP versions in three sizes and the site switches that scene to the painting.
4. Smoke and flame overlays are placed by `hotspots` in `src/config/scenes.ts`. If they don't sit on the painting's dhunuchi or diya, nudge the percentages.

Scene ids: `agomoni-kash`, `agomoni-kumortuli`, `agomoni-para`, `shashthi-bodhon`, `shashthi-dhaki`, `shashthi-pandal`, `saptami-kolabou`, `saptami-nabapatrika`, `saptami-aarti`, `ashtami-anjali`, `ashtami-kumari`, `ashtami-sandhi`, `ashtami-bhog`, `navami-dhunuchi`, `navami-aarti`, `navami-mela`, `dashami-boron`, `dashami-sindoor`, `dashami-bisarjan`, `bijoya-empty`, `bijoya-kash`, `bijoya-pronam`.

---

## 4. Brand, domain and links

**`src/config/site.ts`**:

- `url`: your final domain (used in share links and preview cards). **Set this before launch.**
- `brands.left` / `brands.right`: RSC Group (top-left) and Saltbuzz (top-right) logos and their website links. The logos in `public/brand/` were cut out from the supplied files; swap in official transparent PNG or SVG files when you have them, keeping the same names.
- `credit.instagram`: optional Instagram link in the footer.

**Share images**: `public/og/<phase>.jpg` (1200x630) show up when a link is shared on WhatsApp, Instagram or X. Each day has its own share link, e.g. `https://yourdomain/t/ashtami/`. To regenerate a card after changing art, open `/?tithi=ashtami&og=1` in a 1200x630 browser window and take a screenshot (`/?og=default` for the generic one).

---

## 5. Deploy for free

**Netlify** (recommended for a branded campaign): push to GitHub, then "Add new site" in Netlify and pick the repo. `netlify.toml` already sets the build command (`npm run build`) and publish folder (`out`). Add your domain in Site settings.

**Vercel**: import the repo; it detects Next.js and the static export automatically. Note that Vercel's free Hobby plan is meant for non-commercial projects, which matters for a branded Saltbuzz campaign.

**Cloudflare Pages** also works: build command `npm run build`, output directory `out`.

Every change (songs, timings, art) is a commit and a redeploy, about a minute on any of these hosts.

---

## Project map

```
src/
  config/
    site.ts          name, domain, brand logos and links
    tithis.ts        phases, captions, palettes, ritual events, time slots
    scenes.ts        22 scenes, their time of day, overlays and hotspots
  data/
    songs.json       the playlist (generate with /tools/playlist)
    scene-assets.json  written by `npm run scenes`
  components/
    Bodhan.tsx       the page: title, captions, scene rotation, share, sindoor taps
    RadioDock.tsx    the player dock
    Countdown.tsx    next ritual chip and the schedule sheet
    SceneStage.tsx   crossfading scenes; AI painting or drawing
    Overlays.tsx     shiuli, petals, embers, sindoor dust
    scenes/kit.tsx   shola-cut drawing kit (pandal, protima, kash, people, smoke...)
    scenes/compositions.tsx  the 22 drawn scenes, landscape and portrait
  hooks/useRadio.ts  synced YouTube radio
  lib/               clock sync, IST helpers, schedule, YouTube loader
creatives/
  PROMPTS.md         image and video prompts for every scene
  raw/               drop AI paintings here
scripts/
  scenes.mjs         optimise paintings, write the manifest
  playlist.mjs       optional YouTube Data API filler
```

Motion respects the "reduce motion" accessibility setting: overlays become still.

Songs stream from YouTube's own player. No audio is hosted or redistributed by this site.
