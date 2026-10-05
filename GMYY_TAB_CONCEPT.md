# Give Me Your Yoghurt tab: design concept for Claude Design

**Assumption:** all that's known about the game so far is its title. This concept builds the tab out of the yoghurt pot itself: foil lid, printed label, best-before stamp, supermarket shelf. Swap the bracketed placeholders for real content (see `GIVE_ME_YOUR_YOGHURT_NEEDED.md`).

It sits next to two very different tabs:
- **Hadal** is deep blue fading to black, an italic serif and a dive.
- **One House** is dark wood, blackletter and a PSX pixel crush.

This one should be the daylight tab: loud, printed, bright and physical. The site already ruled out cream paper with a serif, rounded cards, pill badges, gradients and neon on dark. None of those appear here.

---

## Visual language: a printed yoghurt pot

- **Ground:** pot white `#FBFBF8`, a flat printed white rather than cream.
- **Two spot colours,** like cheap flexo printing:
  - strawberry `#E0306A` for the big type and fills
  - dairy blue `#1F3FA8` for small type, lines and the stamp
- **Foil:** a brushed-silver texture used only for the lid in the hero, never anywhere else.
- **Shelf-label yellow** `#FFD400` with black text, used only for prices and captions in the gallery.

**Fonts:**
- **Labels and headings:** a heavy condensed sans like the type on dairy packaging, such as Barlow Condensed ExtraBold. Set it big, tight and in caps for the title.
- **Best-before stamp:** a dot-matrix inkjet face, such as Doto.
- **Body text:** IBM Plex Sans, so the tab still belongs to the same site.

**Texture:** slight misregistration on the two spot colours, offset by 1 to 2 px, plus fine halftone dots in the big fills, so it reads as printed. No shadows and no rounded boxes. Things are stuck on at angles, like stickers and labels.

---

## Scenes, top to bottom (scroll-driven, ASUS style)

1. **Hero: the lid peels.** The screen is a pot seen from above. The foil lid fills the viewport, with GIVE ME YOUR YOGHURT printed across it in strawberry. On scroll, the lid peels back from the top-left corner with a real curl and a silver underside, revealing Y-01, the hero screenshot, full-bleed underneath. When it's fully peeled, the line [YOUR HERO LINE] drops in. *This is the tab's signature moment, like Hadal's dive and One House's crush.*

2. **Hook: the title eats the screen.** The words "GIVE ME YOUR YOGHURT" stack one per line, each bigger than the last. The final "YOGHURT" scales up until its O fills the screen, and Y-02 shows through the O like a porthole. Then it opens to full screen with [YOUR HOOK LINE].

3. **Core mechanic: the spoon.** A pinned scene. On one side is a big flat illustrated pot, side-on. Each scroll step takes a spoon-sized bite out of it: the fill level drops, a scoop shape leaves the pot, and the line changes:
   - [STEP 1]
   - [STEP 2]
   - [STEP 3]

   Y-03 to Y-05 crossfade on the other side.

4. **Numbers: the nutrition label.** The game's real numbers are laid out as a "Nutrition information, per playthrough" panel: black rules, condensed type, bold row labels. The rows tick up as they enter, for example "[N] levels", "[N] enemies" or "[N] yoghurts taken". Only true numbers. A small "Contains: [ALLERGEN JOKE]" line under it is optional.

5. **Gallery: the dairy aisle.** Screenshots Y-06 to Y-10 scroll sideways as products on a shelf. A thin shelf edge runs under them, and each has a yellow shelf-edge label with its caption and a fake price, such as "[CAPTION] · 0.00". The shelf tilts slightly with scroll speed, matching the skew on the other tabs' galleries.

6. **Two features: stickers.** Y-11 and Y-12 are stuck on at small angles like promo stickers on a pot. Each has a round strawberry starburst sticker carrying its one line. They slap on with a quick overshoot as they enter.

7. **Status: the best-before stamp.** The honest status note is printed in the dot-matrix face in dairy blue, slightly crooked, like the date on a real pot: "BEST BEFORE: [DATE] · PLAYTEST BUILD · [LOT NO.]". Under it is the plain-language note about what's rough.

8. **Download: the price tag.** One big button styled as a supermarket price tag: yellow, black condensed type, and a punched hole. It reads "Download", and under it is "Free · [PLATFORMS] · playtest build". If there's no build yet, the tag reads "Coming soon" and isn't a link.

9. **Feedback.** The same "Recommendations?" form as the other tabs, in this tab's colours.

**Tab switch:** the wipe into this tab is the foil lid sliding across the screen, instead of the plain colour wipe the other tabs use.

---

## If the game is serious under the silly title

Keep the same pot vocabulary, but let it go off:
- The white turns grey-green and the strawberry turns bruise-purple.
- The lid peel reveals mould spreading across the hero image.
- The best-before date is long past.
- The nutrition label lists unsettling things.

The joke title then becomes the hook rather than the tone.

---

## Assets this needs

| Code | Used for |
|---|---|
| Z-03 | Studio-tab door |
| Y-01 | Under the peeled lid (hero) |
| Y-02 | Through the O (hook) |
| Y-03 to Y-05 | Spoon steps |
| Y-06 to Y-10 | Dairy-aisle gallery |
| Y-11, Y-12 | Sticker features |

Everything else (lid, pot, spoon, label, stamp, tag) is drawn in code or as flat vector, so the tab works even before the screenshots arrive.

## Notes for Claude Design

- Start with three artboards to settle the look before building the whole page:
  - the hero mid-peel
  - the nutrition label
  - the price-tag download
- Keep the two spot colours strict. Most of the "printed pot" feel comes from that restraint.
- The page must still work at phone width: the label becomes one column, the shelf scrolls, and the stickers stack.
- Respect reduced motion: show the lid already peeled, and the pot already eaten.
