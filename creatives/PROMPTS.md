# Bodhan creatives pack

Every scene on the site already works as a code-drawn, animated illustration. This pack lets you replace any of them with an AI painting (and optionally a short video loop) so the site looks fully painted. You can do it scene by scene, in any order.

## How to use this

1. Pick a scene below. Copy the **Master style** block, then add that scene's **Desktop** or **Mobile** prompt after it.
2. Generate in Gemini, ChatGPT, Midjourney or similar. Desktop is 16:9 (at least 1920x1080), mobile is 9:16 (at least 1080x1920).
3. Save the files in `creatives/raw/` named exactly by scene id:
   - `shashthi-bodhon.png` (desktop)
   - `shashthi-bodhon-m.png` (mobile, optional; the desktop image is used if missing)
   - `shashthi-bodhon.webm` or `.mp4` (optional video loop, under 2.5 MB)
4. Run `npm run scenes` (it also runs on every build). The site picks the images up automatically.
5. If smoke or flame overlays do not sit where the painting's dhunuchi or diya is, adjust that scene's `hotspots` in `src/config/scenes.ts`. Values are percentages of the frame from the top-left, `[x, y]`.

**Rules that apply to every image**

- Keep the **upper centre** clear (sky, wall, soft background): the title and caption sit there.
- Keep the **lower centre** calm and darker: the radio player covers it.
- The focal subject lives in the **middle band** (roughly 35% to 70% of the height).
- No text, letters, signboards or watermarks anywhere. Bengali lettering comes from the website itself.
- The Devi always appears as a clay protima in its pandal or ritual setting, in one consistent design across all scenes: ek-chala (one shared arched chalchitra), daker saaj (white shola and silver-foil ornaments), Durga at the centre with Lakshmi, Ganesh, Saraswati and Kartik. Show her with reverence: no extreme close-ups of the face, no distortion, no stylised or comic treatment.

---

## Master style (paste first, every time)

```
Hand-painted illustration in a warm Bengal gouache style: matte opaque paint, visible soft brush texture, subtle paper grain, flat layered planes with gentle depth haze like a paper-cut diorama, with a light Kalighat pat influence in the confident dark outlines of figures. Cinematic composition and lighting. Autumn (sharat) light of West Bengal during Durga Puja. Palette: sindoor red, lal-paar white, shola ivory, brass gold, dark terracotta, deep indigo for night skies. People are ordinary Bengali people of all ages, dignified and natural, women in white sarees with red borders or festive sarees, men in cotton panjabis and dhotis. Atmosphere of nostalgia and devotion. No text, no letters, no logos, no watermarks. Keep the upper centre of the frame open and uncluttered, keep the lower centre darker and simple.
```

**Desktop frame line** (add at the end of desktop prompts): `Wide 16:9 landscape composition, focal subject in the middle band of the frame.`

**Mobile frame line** (add at the end of mobile prompts): `Tall 9:16 vertical composition for a phone screen, focal subject in the middle of the frame, sky or wall in the top third, simple dark ground in the bottom third.`

**Video loop prompt** (image-to-video in Veo, Kling or Runway; start from the generated image): describe only the motion listed for the scene, then add:

```
Seamless 6 to 8 second loop, locked-off camera with no camera movement, subtle natural motion only, no new objects appearing, no morphing of faces or the idol, no text.
```

---

## Agomoni / Panchami

### `agomoni-kash`: Kash fields, a train heading home
- **Desktop:** A vast field of white kash phool flowers swaying under a deep blue sharat sky full of puffy white cumulus clouds. Tall kash plumes frame the left and right edges in the foreground. In the middle distance a green-and-yellow local train crosses on a low embankment beside a thin silver river, a faint village skyline and a terracotta temple behind. A small girl in a yellow frock and her mother in a white saree with a red border stand at the edge of the field looking at the train.
- **Mobile:** Same scene vertical: tall clouds filling the top third, the train small across the middle, the mother and daughter just below the centre, dense kash in the lower third.
- **Motion:** kash plumes swaying in a gentle breeze, clouds drifting slowly, the train moving left to right.
- **Hotspots:** none needed.

### `agomoni-kumortuli`: Kumortuli at dusk
- **Desktop:** A narrow lane in Kumortuli, North Kolkata, at dusk. Blue and maroon tarpaulin sheds on both sides, bare bulbs hanging from wires. Rows of unfinished clay Durga idols on straw armatures, some still straw, some half clay, unpainted. An artisan sits on a low stool at the right painting a figure, a small clay pot of burning coal smoking beside him at the lower right. Old houses at the end of the lane under a violet-orange sky.
- **Mobile:** Vertical view down the lane, idols on both sides, the artisan right of centre, sky at the top.
- **Motion:** bulbs glowing softly, a thin smoke rising from the coal pot, the artisan's hand moving the brush.
- **Hotspots:** smoke d `[86, 66]`, m `[80, 55]` (the coal pot).

### `agomoni-para`: The para pandal going up
- **Desktop:** Night in a North Kolkata para. A bamboo pandal frame under construction stands in the centre, a young man on a wooden ladder stringing fairy lights across it, half of the lights already lit. Paper bunting across the lane above. Old houses with green shutters and lit windows on both sides, a full moon.
- **Mobile:** Vertical: moon and bunting above, bamboo frame filling the middle, ladder right of centre.
- **Motion:** fairy lights twinkling, bunting fluttering, the man adjusting the wire.
- **Hotspots:** none needed.

## Shashthi

### `shashthi-bodhon`: Bodhon under the bel tree
- **Desktop:** Bodhon at dusk. A large old bel tree on the left, a decorated ghot (clay pot with mango leaves) at its foot. A row of small clay diyas burning in front, a dhunuchi smoking on the ground at centre. A priest in a white dhoti stands right of centre raising a brass lamp. A dhaki with a white-plumed dhak stands further right. A soft orange sun sets behind a distant skyline.
- **Mobile:** Vertical: bel tree canopy across the top half, the ghot and diyas just below centre, priest to the right.
- **Motion:** diya flames flickering, dhuno smoke rising, the priest's lamp moving in slow circles, leaves stirring.
- **Hotspots:** smoke d `[44, 69]`, m `[56, 60]`; flames d `[36, 70] [40, 70] [48, 70]`, m `[40, 61] [64, 61]`.

### `shashthi-dhaki`: The dhakis arrive
- **Desktop:** Bright afternoon in a para lane decorated with paper bunting. Three dhakis walk in a line from left to centre, each carrying a big dhak slung at the hip with a tall white feather plume rising from it, one in a white panjabi, one in yellow, one in orange. Two children follow excitedly. Terracotta-coloured old houses, blue sky with white clouds.
- **Mobile:** Vertical: bunting in the top third, the three dhakis staggered through the middle.
- **Motion:** plumes bouncing with each step, bunting fluttering, sticks tapping.
- **Hotspots:** none needed.

### `shashthi-pandal`: Opening night at the pandal
- **Desktop:** A grand pandal facade at night, its arched entrance glowing gold, through which the ek-chala Durga protima in daker saaj is visible. Strings of coloured fairy lights from the surrounding houses to the pandal. A crowd seen from behind in the foreground, women in sarees with red borders. White alpana patterns on the red floor.
- **Mobile:** Vertical: pandal crest at the top, glowing arch with the protima in the middle, crowd in the lower third.
- **Motion:** lights twinkling and chasing along the arch, a warm glow breathing from inside.
- **Hotspots:** none needed.

## Saptami

### `saptami-kolabou`: Kola bou snan at the ghat
- **Desktop:** Dawn at a Ganga ghat. The Howrah Bridge in soft silhouette across the river on the right, the rising sun on the left turning the water rose and gold. On the ghat steps at left stands the kola bou: a banana plant dressed as a bride in a white saree with a red border and a veil, banana leaves rising above the veil. A priest in a white dhoti beside it holds a lamp, a dhunuchi smokes on the step, a dhaki stands lower down.
- **Mobile:** Vertical: the bridge small at the top, the river in the middle, kola bou left of centre on the steps.
- **Motion:** river shimmering, smoke rising, banana leaves stirring, the dhaki's plume swaying.
- **Hotspots:** smoke d `[30, 65]`, m `[28, 58]`.

### `saptami-nabapatrika`: Nabapatrika beside Ganesh
- **Desktop:** Inside a pandal with deep red cloth drapes and gold borders. The ek-chala protima under its glowing golden chalchitra fills the right two thirds. On the left, beside Ganesh, stands the Nabapatrika (kola bou) in her red-bordered white saree and veil. Brass diyas and lotus flowers on the alpana floor in front, a dhunuchi smoking at the far left.
- **Mobile:** Vertical: chalchitra arch in the upper middle, kola bou on the left edge, lamps below.
- **Motion:** lamps flickering, smoke rising, drapes moving very slightly.
- **Hotspots:** smoke d `[18, 68]`, m `[14, 59]`; flames d `[60, 69] [64, 69]`, m `[66, 60]`.

### `saptami-aarti`: Saptami aarti
- **Desktop:** Night, the pandal arch glowing with the protima inside. A priest stands right of centre performing aarti with a five-flame brass lamp held high, a dhunuchi smoking at his feet. A dhaki plays on the left. Silhouettes of devotees in the foreground.
- **Mobile:** Vertical: the arch in the middle, priest just right of centre, smoke rising through the frame.
- **Motion:** the lamp moving in circles, flames flickering, thick dhuno smoke drifting upward.
- **Hotspots:** smoke d `[63, 68]`, m `[70, 59]`.

## Ashtami

### `ashtami-anjali`: Ashtami pushpanjali
- **Desktop:** Morning light at the pandal. Rows of devotees in new clothes, women in white-and-red and yellow sarees, men in panjabis, stand with hands folded holding flowers, facing the glowing protima in the arched entrance. Marigold petals in the air.
- **Mobile:** Vertical: arch and protima in the upper middle, two rows of devotees below.
- **Motion:** petals drifting down, hands rising to offer flowers.
- **Hotspots:** none needed.

### `ashtami-kumari`: Kumari pujo
- **Desktop:** Inside a pandal with red drapes. A young girl dressed as the goddess in a red saree and a small gold crown sits cross-legged on a low wooden seat at the centre on white alpana, surrounded by brass diyas and lotuses. A priest in white stands at the right, a dhunuchi smokes at the left. A few women watch from the left.
- **Mobile:** Vertical: the girl centred in the middle band, lamps around her, priest at the right edge.
- **Motion:** lamps flickering, smoke rising, petals falling.
- **Hotspots:** smoke d `[30, 68]`, m `[20, 59]`.

### `ashtami-sandhi`: Sandhi pujo, 108 lamps and 108 lotuses
- **Desktop:** The sacred junction of Ashtami and Navami. A dark pandal interior lit only by 108 brass prodips arranged on a stepped stand, glowing in front of the golden chalchitra of the protima. A row of pink lotuses on the alpana floor. Dhunuchis smoking at the far left and right.
- **Mobile:** Vertical: chalchitra above, the stepped stand of 108 flames filling the middle.
- **Motion:** 108 small flames flickering, smoke rising at both sides.
- **Hotspots:** smoke d `[12, 68] [88, 68]`, m `[10, 59] [90, 59]`.

### `ashtami-bhog`: Bhog on sal leaves
- **Desktop:** Midday under a red-and-white striped shamiana. Long rows of sal-leaf plates on the floor, each with yellow khichuri, labra and a dab of tomato chutney, steam rising. A man in a white panjabi with a bucket at the left, a woman in a yellow saree serving at the right.
- **Mobile:** Vertical: canopy stripes at the top, rows of plates receding through the middle.
- **Motion:** steam curling up from the plates, the canopy rippling.
- **Hotspots:** none needed.

## Navami

### `navami-dhunuchi`: Dhunuchi naach
- **Desktop:** Navami night in front of the glowing pandal. Three women dance with dhunuchis held high above their heads, thick white smoke pouring from the clay pots: the left dancer in a white saree with red border, the middle in red, the right in yellow. Dhakis drum at the far left and right. A crowd in silhouette below.
- **Mobile:** Vertical: two dancers, left and right of centre, pots raised high in the middle band, the arch glowing between them.
- **Motion:** dancers swaying, dhunuchis swinging, dense smoke billowing upward, dhak sticks striking.
- **Hotspots:** smoke d `[33, 50] [52, 47] [70, 50]`, m `[30, 46] [70, 47]` (the raised pots).

### `navami-aarti`: Navami evening aarti
- **Desktop:** Dusk with a violet and orange sky behind the pandal. A priest performs sondhe aarti with a raised lamp right of centre, a dhunuchi smoking at his feet, a dhaki at the left, devotees in festive sarees below.
- **Mobile:** Vertical: pandal arch centred, priest right of centre.
- **Motion:** lamp circling, smoke rising, dhak plume swaying.
- **Hotspots:** smoke d `[64, 68]`, m `[70, 59]`.

### `navami-mela`: The last night at the mela
- **Desktop:** The last night of pujo. A lit nagordola (ferris wheel) on the left, food stalls with striped awnings and bare bulbs on the right, strings of lights overhead, a bittersweet crowd of families wandering, children holding ice lollies.
- **Mobile:** Vertical: the ferris wheel large in the upper middle, stalls and crowd below.
- **Motion:** the wheel turning slowly, lights chasing around its rim, bulbs glowing.
- **Hotspots:** none needed.

## Dashami

### `dashami-boron`: Debi boron
- **Desktop:** Dashami morning inside the pandal. The protima's golden chalchitra on the right. On the left, married women in white sarees with red borders queue to perform boron, each holding a brass plate with a lamp, sindoor and sweets. A dhunuchi smokes at the right.
- **Mobile:** Vertical: chalchitra right of centre, two women with plates on the left.
- **Motion:** plate lamps flickering, smoke rising, the women stepping forward.
- **Hotspots:** smoke d `[86, 68]`, m `[86, 59]`.

### `dashami-sindoor`: Sindoor khela
- **Desktop:** Bright Dashami afternoon in front of the pandal. Pairs of married women in white sarees with red borders smear sindoor on each other's faces and hair, laughing. Clouds of red sindoor powder float in the air, the red ground is dusted with it. A dhaki at the far left.
- **Mobile:** Vertical: two pairs of women in the middle band, red powder clouds above them.
- **Motion:** red powder drifting and swirling, hands moving, the dhak plume bouncing.
- **Hotspots:** none needed (the site adds its own sindoor dust and tap bursts).

### `dashami-bisarjan`: Bisarjan at the ghat
- **Desktop:** Dusk on the Hooghly with the Howrah Bridge on the left. A wooden boat in the centre carries the protima with its golden chalchitra out on the water, two men aboard, one a dhaki. Crowds on the ghat steps at the right in festive sarees, a dhunuchi smoking on the steps. The setting sun reflected in the river.
- **Mobile:** Vertical: the bridge small at the top, the boat with the protima in the middle, steps at the right.
- **Motion:** water rippling, the boat rocking gently, smoke rising, reflections shimmering.
- **Hotspots:** smoke d `[78, 64]`, m `[78, 57]`.

## Bijoya

### `bijoya-empty`: The empty pandal at dawn
- **Desktop:** Dawn after Dashami. A bare bamboo pandal frame, the cloth taken down, unlit fairy lights still hanging. A single clay diya burns on the ground at the centre. Kash flowers at both sides, a hazy pink sky, scattered petals.
- **Mobile:** Vertical: bamboo frame filling the middle, the lone diya below centre.
- **Motion:** the single flame flickering, kash swaying, mist moving.
- **Hotspots:** flame d `[50, 69]`, m `[50, 60]`.

### `bijoya-kash`: Until next year
- **Desktop:** A quiet afternoon: a wide river under white clouds, a small country boat far out, kash flowers in the foreground swaying. Calm and wistful.
- **Mobile:** Vertical: clouds above, river in the middle, kash below.
- **Motion:** kash swaying, clouds drifting, the river glinting.
- **Hotspots:** none needed.

### `bijoya-pronam`: Bijoya pronam and narkel naru
- **Desktop:** Evening inside an old Bengali home. An arched lattice (jaali) window glows with dusk light on the left. A young man bends to touch the feet of his grandmother in a white saree with a red border. On a low wooden table at the right, a brass plate of narkel naru and a small diya.
- **Mobile:** Vertical: the window in the upper middle, the pronam just below, the plate at the right.
- **Motion:** the diya flickering, dust motes in the window light.
- **Hotspots:** flame d `[74, 63]`, m `[78, 54]`.

---

## Share images (Open Graph, 1200x630)

The site already ships share images generated from the code-drawn scenes (`public/og/`). To replace them with painted ones, use the master style plus the prompt below, then save as `public/og/<phase>.jpg` (and `default.jpg`).

```
1200x630 landscape share card. [Scene of the day from the list above]. Leave a wide calm area in the upper centre for a large Bengali title to be added later, no text in the image itself.
```

| File | Scene to use |
| --- | --- |
| `agomoni.jpg` | `agomoni-kash` |
| `shashthi.jpg` | `shashthi-pandal` |
| `saptami.jpg` | `saptami-kolabou` |
| `ashtami.jpg` | `ashtami-sandhi` |
| `navami.jpg` | `navami-dhunuchi` |
| `dashami.jpg` | `dashami-bisarjan` |
| `bijoya.jpg` | `bijoya-empty` |
| `default.jpg` | `navami-dhunuchi` |

Painted share images have no title on them. To keep the title, generate the painting first, add it as the scene, then re-render the cards (see the README).
