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

## 1. Songs: an endless loop of pujo songs

All the music is controlled from **one file: `src/config/songs.ts`**. It already has a Durga Puja playlist in it, so the radio works out of the box and loops forever.

### Easiest: use a YouTube playlist

1. On YouTube, make a playlist (for example "Bodhan Pujo Songs") and add the songs you want. Set it to **Public** or **Unlisted**.
2. Copy the playlist link. It looks like `https://www.youtube.com/playlist?list=PLxxxxxxxx`.
3. Paste it into `YOUTUBE_PLAYLIST` in `src/config/songs.ts`, save, and deploy once.

After that, adding or removing songs is done on YouTube itself. The site always plays whatever is in the playlist, no redeploy needed. When the last song finishes, it starts again from the first.

### Or: list the songs yourself

Paste YouTube links between the backticks of `SONG_LINKS`, one per line:

```ts
export const SONG_LINKS = `
https://www.youtube.com/watch?v=XXXXXXXXXXX
https://youtu.be/YYYYYYYYYYY
`;
```

If `SONG_LINKS` has any links, it is used instead of the playlist.

### How visitors hear it

- Nothing plays until the visitor taps **ঢাকে কাঠি পড়ুক** (browsers block sound before a tap).
- The tap starts the loop at a point picked from the clock, so people who open the site around the same time hear the same song.
- Songs that don't allow embedding are skipped automatically.

### Optional: exact sync (everyone on the same second)

If you add each song's length on its line (`https://youtu.be/XXXXXXXXXXX | 4:32`), the radio becomes fully synchronised. You don't have to time the songs yourself: open **`/tools/playlist`** on the running site, paste your links, press **Read videos**, and copy the result over `SONG_LINKS`. You can also add day tags after the length (`| 4:32 | ashtami navami`) so a song only plays on those days.

In this mode each day's playlist starts at that day's start time and loops, so every visitor computes the same song and position from `(now - dayStart) mod totalLength`. The site corrects wrong phone clocks using its host's time and re-syncs every 30 seconds.

The YouTube player stays visible in the framed window in the dock. This is deliberate: YouTube's API terms don't allow hiding the player.

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

Every change to timings or art is a commit and a redeploy (songs in a YouTube playlist don't even need that), about a minute on any of these hosts.

---

## Project map

```
src/
  config/
    site.ts          name, domain, brand logos and links
    tithis.ts        phases, captions, palettes, ritual events, time slots
    scenes.ts        22 scenes, their time of day, overlays and hotspots
    songs.ts         THE MUSIC: a YouTube playlist link or a list of song links
  data/
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
```

Motion respects the "reduce motion" accessibility setting: overlays become still.

Songs stream from YouTube's own player. No audio is hosted or redistributed by this site.
