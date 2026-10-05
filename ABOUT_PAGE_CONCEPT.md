# About me page: design concept for Claude Design

A fourth tab on the ZEAR Productions site, about the person behind it. Everything else on the site is about the games. This page is about ZEAR.

**What it needs to say,** from the owner:
- ZEAR are my initials.
- I love games.
- I bounce from one game's development to another, so I have many projects active at once.
- I also compose music and make art.
- My profile picture is hand-drawn by me.

**The included file:** `pfp.png` is the owner's hand-drawn portrait, a bald figure in thick dry-brush strokes on a dark ground. **The whole page is built from this painting.** It's the one piece of the site that's pure handmade art, so the page should feel painted rather than designed.

---

## Visual language: the painting

Every colour comes from `pfp.png`. Refine them by sampling the painting directly in Claude Design.

| Role | Colour | From |
|---|---|---|
| Ground | `#0B1013`, near-black with a cold teal tint | the background |
| Light | `#D7A948`, ochre yellow | the top of the head and the highlights |
| Warm | `#B8612F`, burnt orange | the face and neck strokes |
| Deep warm | `#7A3329`, oxide red | the shadows in the face |
| Cool 1 | about `#7A6182`, dusty mauve | the ears and the side strokes |
| Cool 2 | about `#4E6B6C`, slate teal | the cheek and shoulder strokes |

**Rules:**
- Text is the light ochre or an off-white pulled from the painting, on the dark ground.
- Never a flat bright accent. Colour arrives as **brushstrokes**, not fills.
- Section dividers, underlines and highlights are single dry-brush strokes, with the same broken, bristly edges as the portrait. Draw them as textured SVG paths, or as a mask cut from a stroke in the painting. No straight hairlines.
- Keep the canvas-grain texture visible in the dark ground. The painting has it.

**Fonts:**
- **Headings:** one expressive face that holds up next to the brushwork, such as a heavy grotesque with slightly rough edges. Keep "ZEAR" itself very large.
- **Body:** IBM Plex Sans, for continuity with the other tabs.
- **No** script or handwriting fonts. The hand-made part is the art, not the type.

**Composition:** asymmetric and close-up, like the portrait: big, cropped and filling the frame. Generous dark space around the text. No cards, no pills, no icon rows.

---

## Scenes, top to bottom (scroll-driven, like the rest of the site)

1. **Hero: the portrait paints itself in.**
   - The screen starts dark. As you scroll, the portrait appears stroke by stroke, revealed through a mask of brushstroke shapes laid down in roughly the order a painter would: dark masses, then the warm face, then the ochre highlights last.
   - "ZEAR" sits huge beside it, partly overlapping the canvas edge. Under it, small: "[It's my initials.]"
   - *This is the page's signature moment, like Hadal's dive and One House's pixel crush.*

2. **Who I am.** A short block of the owner's own words, set big, one or two sentences at a time, each revealed as you scroll. These are draft lines from what the owner said, to be rewritten in their voice:
   - "I love games."
   - "So I make them. Several at once, apparently."
   - "I also write the music, and draw the art."

3. **Too many projects: the bounce.**
   - A pinned scene. The project names (*Hadal*, *One House Away From Home*, *Give Me Your Yoghurt*, and [OTHERS?]) bounce around the screen like a screensaver logo. Each is in its own tab's lettering: Hadal's italic serif, One House's blackletter, and Give Me Your Yoghurt's dairy-label type.
   - As you scroll they slow, then line up into a list. Each line shows the project and its state, e.g. "Hadal · playtest build", "One House · early playtest", "Give Me Your Yoghurt · [STATUS]".
   - Each line links to that game's tab.
   - A counter reads "[N] projects active. [N] finished." Use honest numbers; the joke works better if they're true.

4. **I compose.**
   - The music section. A waveform drawn as one long horizontal brushstroke, which plays a track when clicked. Sound only ever starts from a click.
   - A short track list with the game each track belongs to, e.g. "[TRACK] · from Hadal".
   - If there's no audio yet, show the stroke and the track names with "coming soon".

5. **I draw.**
   - Art scrolls sideways, unframed, each piece at its own size and angle, like canvases leaning against a wall.
   - The portrait comes back once more as the last piece, so the section ends where the page began.

6. **Elsewhere.** Links to where people can follow the work: [GITHUB], [ITCH.IO], [OTHER]. Plain text links with a brushstroke underline on hover. **No email address,** per the site rules.

7. **Recommendations?** The same anonymous feedback form as the other tabs, with "Just the website" or "About me" as an option, in this page's colours.

**Tab switch:** the wipe into this tab is one huge dry brushstroke dragged across the screen in ochre, instead of a flat colour wipe.

---

## What the owner still needs to give

| What | For |
|---|---|
| Their own wording for scene 2 | Who I am |
| The full list of active projects, with an honest status for each, plus finished ones if any | The bounce |
| 1 to 5 music tracks as MP3 or OGG, with titles and which game each belongs to | I compose |
| 4 to 10 pieces of art, as PNG or JPG, at least 1600px on the long side | I draw |
| Links to their public profiles | Elsewhere |
| Optional: a higher-resolution or uncompressed portrait | The hero's paint-in, which crops close |
| Optional: an early sketch or work-in-progress layer of the portrait | Would make the paint-in reveal real |

## Notes for Claude Design

- Start with three artboards to settle the look:
  - the hero mid-paint-in, with "ZEAR"
  - the bounce scene lined up as a list
  - the music brushstroke
- The ground is dark, but this is not the dark slate with neon look the owner ruled out. It's the painting's own warm-on-cold palette, applied as strokes.
- The page must work at phone width: the portrait sits above "ZEAR", the bounce becomes the list straight away, and the art stacks.
- Respect reduced motion: show the portrait fully painted and the projects already listed.
