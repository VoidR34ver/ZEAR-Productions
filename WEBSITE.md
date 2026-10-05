# ZEAR Productions website: current state (2026-10-05)

A one-page studio site with three tabs, built as plain HTML, CSS and JavaScript with no build step. It's meant for GitHub Pages and is not live yet.

The working copy is in `docs/` on branch `claude/practical-hopper-z4loha` of `VoidR34ver/ZEAR-Productions`. It's packaged in `zear-website.zip`.

**Status of the look:** the layout, copy and scroll animations are as agreed. The colours are not settled. The owner thinks they still look AI-made, and is redesigning the visuals in Claude Design.

---

## Files

| Path | What it is |
|---|---|
| `index.html` | All three tabs and the feedback-form template |
| `css/site.css` | All styles. Colour tokens are at the top. |
| `js/app.js` | Tabs, screenshot slots, feedback form, and every scroll animation |
| `vendor/gsap.min.js`, `vendor/ScrollTrigger.min.js` | GSAP 3.15 animation library, hosted locally (free licence) |
| `fonts/*.woff2` | Instrument Serif, IBM Plex Sans, IBM Plex Mono and UnifrakturMaguntia, hosted locally (Open Font License) |
| `assets/zear`, `assets/hadal`, `assets/ohafh` | Screenshots as 1920px JPEGs, named by shot code |

**To preview:** run `python3 -m http.server` inside `docs/` and open `http://localhost:8000`. Opening the file directly also works in most browsers.

The page loads nothing from other sites: no trackers, no analytics, no external fonts.

---

## How it works

- **Tabs:** Studio (`#zear`), Hadal (`#hadal`) and One House Away From Home (`#ohafh`). Switching wipes the screen in the next tab's colour and resets the scroll.
- **Screenshot slots:** every `<figure class="shot" data-src="assets/…/CODE">` tries `.jpg`, `.webp` and `.png`. If none exists, it shows a labelled placeholder.
- **Feedback form:** at the bottom of every tab, with that tab's game already chosen. It isn't connected to any service yet: `FEEDBACK_ENDPOINT` at the top of `js/app.js` is empty, so it sends nothing. It has a hidden honeypot field against bots.
- **Reduced motion:** if the visitor's system asks for less motion, nothing animates and every section shows still.
- **Phone:** works at 390px wide with no sideways scrolling.

---

## Content, tab by tab

Scroll effects are in the style of ASUS product pages. "Pinned" means the section stays on screen while scrolling drives its animation.

### Studio tab

1. **Pinned hero.** The giant word "ZEAR", with "Productions" under it. On scroll the letters fly apart and the line *"Maybe a bit **too zealous** in my ideas."* zooms in.
2. **"Current works"** heading.
3. **Pinned doors.** Two half-screen panels slide in from the sides:
   - **Hadal:** image Z-01, subtitle "Supergenetics.", links to the Hadal tab.
   - **One House Away From Home:** image Z-02, subtitle "What even is a home?", links to the One House tab.
4. **Sideways statements**, pinned and scrolled horizontally: "Just me." · "My games." · "Playtest builds, *for me.*" · "The player's opinion is the one that matters."
5. **Feedback form**, below.

### Hadal tab

1. **Pinned dive.** The background goes from the game's surface blue to black. A depth counter runs from 0 to 11,000 m and names the zone: sunlight, twilight, midnight, abyssal, hadal. Marine-snow particles drift past on a canvas. The title "Hadal" zooms through the screen, then: "You are a lab animal." / "With a *hypergene*."
2. **Pinned circle reveal.** H-01 opens out from a circle, with the line "The world is alive too, *you know.*"
3. **Pinned mutation steps.** H-03, H-04 and H-05 crossfade with "Start small." / "Level up." / "Keep going." / "The sky... well, the floor is the limit." On the last step the image sinks and darkens.
4. **Stats.** Counters for 98 starter species, 5 depth zones and 3 mutations offered per level.
5. **Size bar.** It grows from "7 cm, smallest reef fish" to "a few hundred m, biggest predator". When it fills, "It's cool, idgaf." appears. H-08 sits below it.
6. **Sideways zone gallery.** "Five zones down." then H-09 to H-13, captioned:
   - 01 · Sunlight zone · 22 m
   - 02 · Twilight zone · 590 m
   - 03 · Midnight zone · 1,560 m
   - 04 · Abyssal zone · 4,990 m
   - 05 · Hadal zone · 10,780 m
7. **Parallax pair.** H-14 with "Yes, another soulslike combat." H-15 with "Storms are alive too, you know. And so are the currents."
8. **Download.** "Windows · macOS · Linux · playtest build", a big "Download Hadal" button, then "Pick the zip for your system, unzip it, run it. It updates itself to newer builds." The button links to the repo's latest release.
9. **Feedback form.**

### One House Away From Home tab

1. **Pinned pixel crush.** O-02, the sharp palas shot, is pixelated and dithered live on a canvas as you scroll. It ends on O-01, the in-game PSX capture. Over it: "Graubünden, 1998", the blackletter title, and "No need for *high resolutions.*"
2. **Castle.** Counters for 15 buildings and 228 rooms, all reachable, plus the line "RE8, but it's all Dimitrescu." Beside them, a list of the 15 buildings, each with a glowing dot in its real lamp colour.
3. **Pinned ammo scene.** Six bullets drop in. "Survive now?" while three fall away. "*Or progress later?*" as they come back and glow.
4. **Sideways gallery.** "Travel through history." then:
   - O-03 Great hall · Gothic
   - O-04 Old chapel · Romanesque
   - O-06 West gallery · burial galleries in the rock
   - O-07 Cloister ward · the cloister walk
   - O-08 Guest wing · 1920s lounge
5. **Two features, staggered.** O-10 with "Zombies hear you. Every noise has a type, and they react to it." O-11, the floor-plan map, with "A proper map. Resident Evil style."
6. **Status note:** "It's early. The HUD is a placeholder, there's no terrain around the castle yet, some doors go nowhere, and there isn't much enemy or story content."
7. **Download.** "Linux · Windows (low-spec) · playtest build", a "Download One House" button, then "Pick the zip for your system, unzip it, run it." The button links to the `ohafh-latest` release.
8. **Feedback form.**

### Feedback form (every tab)

The heading is **"Recommendations?"**, with "I won't know you, your name or your email." under it. The fields are:
- Which game
- Which build, if you know
- How was it, from 1 to 5
- What happened
- Send

---

## Screenshots in use

| Code | Shows | Where |
|---|---|---|
| Z-01 | Evolved hunter over the coral reef | Studio, Hadal door |
| Z-02 | One House core hall, three storeys of galleries | Studio, One House door |
| H-01 | Evolved hunter under the surface, from below | Hadal circle reveal |
| H-03, H-04, H-05 | Same hunter at stage 1, 2 and 3 | Hadal mutation steps |
| H-08 | Cave predator's jaws in the lamp | Under the size bar |
| H-09 to H-13 | One shot per depth zone | Zone gallery |
| H-14 | 55 m Gigantodon lunging | Combat line |
| H-15 | Hunter leaping out of a rough sea | Storm line |
| O-02, O-01 | Palas saloon, PSX filter off, then on | Pixel-crush hero |
| O-03, O-04, O-06, O-07, O-08 | Five wings | Gallery |
| O-11 | Map screen, floor plan | Map feature |

**Still missing:** O-10, the zombie in the flashlight. It has to be captured in play.

**Received but unused:** H-06 (level-up screen), H-07 (smallest reef fish), O-05 (greenhouse, removed at the owner's request) and O-11b (3D map). The originals, at 2560×1440 PNG, are on the `hadal` branch (`assets/hadal-assets.zip`) and the `OHAfH` branch (`assets/`).

---

## Current visual system (what the redesign replaces)

**Fonts:**
- Instrument Serif for headings and display.
- IBM Plex Sans for body text.
- IBM Plex Mono for small labels.
- UnifrakturMaguntia for One House titles only.

**Colours,** each sampled from the games' screenshots:

| Tab | Background | Text | Accent |
|---|---|---|---|
| Studio | `#ffffff` | `#0b0b0b` | none |
| Hadal | Surface blue `#044e8e` fading to `#000000` | `#f3f6f8` | Hunter red `#e0283a` |
| One House | Wood shadow `#1e100a`, with carpet red `#4c0504` for the ammo band | `#efe4d0` | Picture-frame gilt `#c9a36a` |

**One House lamp colours,** in list order: `#FFDBA8 #FF994D #FFAD61 #FFD69E #F2BD80 #9EB8FA #B8E6BD #FFC780 #FF7033 #FFDBA8 #FF853D #FFC26B #FFB370 #FFDBAD #FFEBC7`

**Already ruled out by the owner** as looking AI-made:
- Rounded bordered cards and pill badges.
- Spaced-out capital eyebrow labels and three-card grids.
- Purple or blue gradients.
- Dark slate with neon accents.
- Cream paper with a serif and a terracotta accent.
- Mint on dark teal.

---

## Rules from the brief

- **Going public:** ask before anything goes public, which includes switching Pages on and publishing reviews. Show a preview first.
- **Privacy:** no trackers or analytics, and never put the owner's email address on the site.
- **Honest labels:** call them "playtest build", never "release".
- **Install scripts:** never move or rename `OHAfH/play.sh` or `OHAfH/play.ps1`, because playtesters' one-line installers point at them.

## Open decisions

- **Feedback service:** Formspree or Web3Forms (email), a Google Forms or Tally embed, or a Cloudflare Worker. Once chosen, set its address as `FEEDBACK_ENDPOINT`.
- **Reviews:** shown on the page, or sent only to the owner. Owner-only is suggested at first.
- **Switching on Pages:** in repo Settings, open Pages, choose "Deploy from a branch", and pick `main` with the `/docs` folder. The site must be merged to `main` first.
