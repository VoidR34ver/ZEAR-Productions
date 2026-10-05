# Ouroboros: Oculus tab: design concept for Claude Design

**What it is:** an old prototype the owner is extremely proud of. It's a sudoku roguelike that runs in the browser, one self-contained HTML file (`ouroboros-oculus.html` in this zip).
- You place digits on a sudoku board and score chips × mult, Balatro-style.
- Every cell has exactly one correct digit. A wrong one costs a Flicker, even if it's sudoku-legal.
- You beat nine floors, each with a score quota, with a merchant between floors.
- Bosses: The Weeping Eye (floor 3), The Hourglass (5), The Warden (8) and **The Eye** (floor 9).
- The Eye watches from the top of the screen the whole time, and it talks.
- The music is generated live in code, with a different motif for each boss.

Everything quoted below is the game's own text. The owner's own pitch lines go in the [brackets].

**The tab's big difference:** the other games are downloads. **This one can be played right on the page.** That's the centrepiece.

---

## Visual language: the game's own screen

The game already has a strong, finished look, so the tab adopts it whole:

| Role | Colour | In the game |
|---|---|---|
| Ground | `#000000` | everything |
| Text | `#FFFFFF` | digits, menus |
| The Eye | `#FF0000` with a red glow | the eye, Flickers, damage |
| Dried blood | `#880000` | boss bars, dark red |
| Dim grey | `#555555` and `#222222` | grid lines, spent things |
| Score gold | `#FFCC00` | score totals only |
| Row / column / box | `#FFCC00`, `#00CCFF`, `#CC66FF` | only on the score chips, never elsewhere |

- **Type:** all monospace, like the game. Use its Courier New, or IBM Plex Mono, which the site already hosts. Headings in widely spaced caps, as on the title screen: "O U R O B O R O S", with ": OCULUS" in red.
- **The Eye's voice:** always lowercase, small, letter-spaced, and sometimes glitched with a red/blue split ("▓▒ she weeps ▒▓"). This is the voice of the whole tab.
- **CRT:** the game's faint scanlines and dark vignette, at the same low opacity.
- **Shapes:** hard 1px white and grey lines and square cells, exactly like the board. No rounding, no gradients, no shadows except the red glow.

This is pure black with one red, and it reads as a deliberate retro-terminal look, not AI dark mode. That's because it's lifted straight from a real, finished game screen. Don't add any other accent colour.

---

## Scenes, top to bottom (scroll-driven, like the rest of the site)

1. **Hero: the Eye opens.**
   - A black screen. In the centre, the game's pixel eye is shut, a single white line.
   - On scroll, the lids part pixel by pixel, the red iris appears, and it starts **following the cursor** (or the scroll position on phones).
   - The spaced title types itself in underneath: "O U R O B O R O S : OCULUS".
   - The Eye's first line appears in its voice: *"you are here."*
   - *This is the tab's signature moment, like Hadal's dive and One House's pixel crush.* The Eye then stays small in the corner of the screen for the rest of the tab, still watching.

2. **The rule.** One line at a time, big, monospace:
   - "Sudoku."
   - "Every cell has one correct digit."
   - "Anything else costs a Flicker."
   - *"The Eye demands precision."*

   The Eye's reply fades in under the last line: *"obey."* [Or the owner's own pitch lines.]

3. **Scoring: chips × mult.** A pinned scene. A real 9×9 board (or `board.png`) sits on one side.
   - As you scroll, digits drop into one row. When the row completes, the game's score chips slide out one after another, just like the in-game queue:
     - ROW, in gold
     - COLUMN, in cyan
     - BOX, in violet
     - then **TRIPLE SIGHT**
     - then **OUROBOROS** in pulsing red
   - The total counts up in gold.
   - The Eye mutters *"chain them."* / *"....good."*

4. **Nine floors down.** A long vertical descent, one floor per screen-height, numbers 1 to 9 down the left. Each floor shows the Eye's actual line for it:
   - 1 · *"you are here."*
   - 2 · *"deeper."*
   - 3 · **THE WEEPING EYE** · *"▓▒ she weeps ▒▓"*
   - 4 · *"you learn."*
   - 5 · **THE HOURGLASS** · *"tick. tick. tick."*
   - 6 · *"no returning."*
   - 7 · *"numbers. numbers. numbers."*
   - 8 · **THE WARDEN** · *"prove yourself to the lock."*
   - 9 · **THE EYE** · *"I have been patient."*

   The boss floors are in red with their name. The screen gets slightly redder and the scanlines slightly stronger as you go down.

5. **The Weeping Eye.** A quiet pinned moment. The eye turns violet, as it does in the game, and red tears fall from it while her lines appear one by one:
   - *"i'm sorry."*
   - *"forgive me."*
   - *"you don't deserve this."*
   - *"...take this, please."*

   It's the emotional beat of the tab, so keep everything else still.

6. **The merchant.** Upgrades scroll sideways as plain monospace price-list lines, not cards. Each shows a name and its real effect:
   - **BLOOD PACT** · 6 ◆: "Lose 1 Flicker. Gain ×2 mult for this floor."
   - **THIRD EYE** · 16 ◆: "Every 7th placement scores ×3."
   - **HOLLOW CROWN** · 22 ◆: "Empty cells at floor end each give +50 chips."
   - **THE PATIENT** · 24 ◆: "+1 mult for each empty row remaining at floor end."
   - **THE UNBLINKING** · 25 ◆: "First placement each floor scores ×5."
   - **VOID PACT** · 30 ◆: "All mult ×3. But lose 25% score on floor start."
   - **OUROBOROS** · 32 ◆: "When you complete a row, its mult bonus also applies to the matching column."

   Hovering one plays a short blip from the game's own sound.

7. **Play it.** The game itself, embedded in a phone-shaped black frame in the middle of the screen, with the Eye in the corner looking at it.
   - Above it: *"we meet."*
   - Under it: "[Old prototype · plays in your browser · progress saves on this device]" and a plain "Open full screen" link.
   - On phones, skip the frame and show one big link that opens the game full screen. It's built for phones already, up to 480px wide.
   - Sound starts only after the visitor taps, which the game already does.

8. **Status.** In the Eye's voice, small: [an owner line, e.g. "an old prototype. finished as far as it goes."]

9. **Recommendations?** The same feedback form as the other tabs, in this tab's black, white and red.

**When leaving:** if the visitor scrolls back to the top, the Eye says *"well done."* or *"more."*

**Tab switch:** the wipe into this tab is the screen blinking: a black eyelid closes from top and bottom, then opens on this tab.

---

## What's in this zip

| File | What |
|---|---|
| `ouroboros-oculus.html` | The game, exactly as uploaded. Open it in a browser to play. |
| `shots/title.png` | Title screen |
| `shots/board.png` | Floor 1, fresh board, with the Eye |
| `shots/combo.png` | A row just completed |
| `shots/how.png` | The how-to-play screen |
| `palette.png` | The game's colours |

All screenshots are 1290×2796 (phone, 3×).

## Owner decisions needed

- **Publishing the game:** the site would host `ouroboros-oculus.html`, which makes the game public. Is that OK?
- **Pitch and status:** the owner's own lines for scene 2 and scene 8.
- **History:** when it was made, and whether it'll ever be picked back up. This could be one honest line on the page.
- **Name styling:** "OUROBOROS: OCULUS" as in the game, or another way?

## Notes for Claude Design

- Start with three artboards: the Eye half-open over the title, the score-chip cascade, and the embedded game frame.
- Keep it to black, white and red. The row, column and box colours appear only inside the score scene.
- At phone width, the floors become a simple list, the merchant stacks, and the game opens full screen instead of in a frame.
- Respect reduced motion: show the Eye open, the chips laid out, and no cursor-following.
