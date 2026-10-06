# Once Upon a Moon tab: design concept for Claude Design

**What it is,** from the owner's design document:
- A semi-open-world, first-person dark-fantasy action RPG. Not a soulslike.
- The world is a dream that has gone on far too long. The Worldbrain overslept, and five Lords, its subconscious, keep it under. Each Lord is wrong, and each believes they're right.
- **Themes:** fading, memory, not wanting to die, and *doing wrong things out of right conviction*.
- **Look:** crunchy low-res 3D, rendered at a quarter of the screen size, upscaled with hard pixels and Bayer-dithered, with a moonlit blue and purple palette. Think an 80s fantasy film: cold blue night, a crescent moon, a distant castle, and only a few warm windows lit.
- **Signature rule:** the world is chunky, but the player's hands and the menus move smoothly. The player is the one "real" thing in the dream.
- **Music:** the owner composed "Memory Moon", the title theme and the game's motif. It's in D Dorian, 3/4 time, at about 62 BPM.

**Honest status:** very early. Built so far:
- the hub, a cavern called the Hollow, with a moon hole in its roof
- a cabin called the Hollow Hearth
- an innkeeper, a traveller, and a merchant with a cart
- a training dummy
- the player's sword and torch, two sword styles, guard and counter
- the dither pipeline

The five Lord areas, enemies and story are not built yet. There's no build to download.

---

## Visual language: the dream and the real thing

The tab follows the game's own rule. **Images are chunky** (pixelated and dithered, like the game). **The page's text and interface are perfectly smooth and crisp**, like the player's hands. Never pixelate the type.

| Role | Colour | From |
|---|---|---|
| Night | `#0A0D1F` | the sky behind everything |
| Dream blue | `#1E2A5C` | the cold fill of the world |
| Moon violet | `#6B5EA8` | the purple in the shadows |
| Moonlight | `#C9D4F0` | text and the moon |
| Warm window | `#F2A93B` | **the only warm colour**, used sparingly like the few lit windows: the download or notify link, one word per scene at most |

- **Type:** a classic old-style serif for headings, storybook-like ("Once upon a…"). Choose one that isn't the site's Instrument Serif, so the tab has its own voice. Body text in IBM Plex Sans.
- **Texture:** a faint 4×4 Bayer dither pattern in the dark fills, never on text.
- **Flourish:** the crescent moon, used once as the hero. Not repeated as an icon.

Refine the colours by sampling the screenshots once they arrive.

---

## Scenes, top to bottom (scroll-driven, like the rest of the site)

1. **Hero: up through the moon hole.**
   - You start looking up from the floor of the Hollow at the ragged hole in the cavern roof, with a moonbeam falling through the fog (M-01).
   - On scroll, the camera rises through the hole into the open night. The dithered sky opens out, the crescent moon comes forward, and the title fades in crisp over the chunky world: *Once Upon a Moon*.
   - *This is the tab's signature moment, like Hadal's dive and One House's pixel crush.*

2. **The dream.** Short lines, one at a time, in the owner's voice. These are drafts from the design document:
   - "The world is a dream."
   - "It has gone on far too long."
   - "Someone has to wake it."

3. **The Hollow.** The hub, the only place built so far. A wide shot (M-02) with the camera slowly drifting while three warm-lit details come into focus as you scroll:
   - the cabin's windows (M-03)
   - the traveller by the fire (M-05)
   - the merchant in the moonbeam (M-06)

   Each gets a one-line caption.

4. **Five ways out.** A pinned scene. The Hollow is drawn as a simple circle seen from above, with five tunnels leaving it in five directions. As you scroll, each tunnel lights in its valley's colour: storm purple, blue moon, red moon, and two still to choose.
   - **Owner's choice:** show the five Lords' names and their one-line reason, e.g. "The Climber · born poor, clinging to the power he clawed up to", or keep them hidden as "[a Lord]" to avoid spoilers.

5. **The real thing.** The game's signature rule, shown directly. Split the screen down the middle:
   - **Left:** the world as rendered, chunky and dithered.
   - **Right:** the same shot with the pixel effect off (M-15 and M-15b).

   As you scroll, a crisp first-person sword-and-torch layer slides in over both, staying smooth. The line: "Everything is a dream. Except you."

6. **Sword and torch.** Three frames of the 3-hit combo (M-08 to M-10) play as you scroll, like flipping a storybook. Then the guard (M-11) and the counter (M-12), with "COUNTER!" from the game's HUD.
   - Two sword styles: *Way of the Iron* and *Way of the Ox*.
   - "One in hand at a time: torch or sword."

7. **Memory Moon.** The music section, with a single play button. Sound only starts on a click.
   - While it plays, the moon slowly pulses in 3/4 time, at 62 BPM.
   - Under it, small: "D Dorian · 3/4 · composed for the game". The design document says Dorian's raised sixth "is the lit window", so that line can be the one warm word.

8. **Status.** Plain and honest: "Very early. The Hollow is built. The five valleys aren't. No build yet."
   - Replace the download button with a quiet "[coming later]" line in the warm window colour.

9. **Recommendations?** The same feedback form as the other tabs, in this tab's night colours.

**Tab switch:** the wipe into this tab is the screen dissolving through the dither pattern, ordered-dither pixels flipping from the previous tab to night.

---

## Assets this needs

All of these come from the game's own screenshot mode. See `MOON_SCREENSHOT_PROMPT.md`.

| Code | Shows | Scene |
|---|---|---|
| Z-04 | Best overall shot | Studio door |
| M-01 | Looking up at the moon hole, moonbeam, fog | Hero |
| M-02 | The Hollow, wide | The Hollow |
| M-03 | The Hollow Hearth cabin, warm windows | The Hollow |
| M-04 | Talking to the innkeeper, dialogue box on | Optional |
| M-05 | The traveller by the fire | The Hollow |
| M-06 | The merchant and cart in the moonbeam | The Hollow |
| M-07 | Torch in hand, dark corner | Optional |
| M-08, M-09, M-10 | Sword combo, 3 frames | Sword and torch |
| M-11 | Guard | Sword and torch |
| M-12 | Ox counter, "COUNTER!" | Sword and torch |
| M-13 | Character menu, sword styles | Optional |
| M-14 | Training dummy mid-chop | Optional |
| M-15, M-15b | The same shot with pixels on, then off | The real thing |
| audio | `Memory Moon.ogg` | Memory Moon |

## Owner decisions needed

- **Spoilers:** show the five Lords' names and reasons, or keep them secret?
- **Your words:** your own lines for scene 2.
- **Valley colours:** the two still unnamed.
- **Music:** whether "Memory Moon" can be played on the public site.

## Notes for Claude Design

- Start with three artboards: the hero mid-rise through the moon hole, the "real thing" split, and the Memory Moon player.
- Keep warm colour rare. The tab's whole mood depends on it.
- At phone width the split becomes stacked (chunky above, smooth below), the five-tunnel map shrinks to a list, and the combo frames stack.
- Respect reduced motion: show the moon already risen, and the frames side by side.
