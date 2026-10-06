# Prompt for a local Claude Code session: Once Upon a Moon screenshots

Open Claude Code in your local `Once-upon-a-moon` folder, on the machine with Godot 4.7.2. Paste everything below the line.

---

I need website screenshots of Once Upon a Moon for the ZEAR Productions site. Read `HANDOFF.md` first, especially "Run", the screenshot mode flags, "Layout of the world" and the combat sections.

**Rules**
- Don't change any game code, and don't commit anything to this repo. If screenshot mode needs a workaround, use a temporary helper script outside the repo, and note in NOTES.md what it did.
- Use the game's own screenshot mode: `--shot=<abs.png> --frames=N --pos=x,y,z --yaw=deg --pitch=deg` plus `--swing=`, `--swing2=`, `--swing3=`, `--talk=`, `--guard=`, `--parry=`, `--style=ox`, `--menu` and `--hud=off` as needed. Use `--frames=75` or more for anything mid-swing.
- Render at **2560×1440**, so the quarter-resolution pixel and dither look stays as it is in play.
- `--hud=off` everywhere except the UI shots: M-04, M-12 and M-13.
- Keep the game's look exactly as it is. No debug or test lights, and no colour changes.
- Name each file after its code, as PNG straight from the game.

**World layout** (from HANDOFF.md, in metres)
- The cavern is 26 m in radius, centred on the origin.
- The player spawns at (0, 0, 10.5) facing −Z.
- The cabin, the Hollow Hearth, is at (0, 0, −2) with its door facing +Z. The innkeeper is behind the bar and the traveller sits by the fire.
- The merchant and cart are at about (6.5, 0, 4.7), in the moonbeam.
- The training dummy is at (0, 0, −13.5), behind the cabin, facing the cabin.

**Shot list**

| Code | What to capture | Notes |
|---|---|---|
| Z-04 | The most beautiful overall shot of the Hollow | Used tall on the studio page, so keep the subject centred |
| M-01 | **Hero:** looking steeply up at the moon hole in the roof dome, moonbeam and fog | Pitch up hard. Keep the hole centred. This is the most important shot. |
| M-02 | The Hollow, wide: cabin, moonbeam and cavern walls in one frame | From near the spawn or higher if possible |
| M-03 | The Hollow Hearth from outside, warm windows glowing | |
| M-04 | Talking to the innkeeper, dialogue box open (`--talk=`) | UI shot |
| M-05 | The traveller seated by the fire | |
| M-06 | The merchant and cart standing in the moonbeam | |
| M-07 | First person with the torch in hand, facing a dark part of the cavern | |
| M-08, M-09, M-10 | The Iron 3-hit combo: one frame mid-swing for each hit (`--swing=`, `--swing2=`, `--swing3=`), facing the dummy | Same position and camera for all three |
| M-11 | Guard pose (`--guard=`), facing the dummy | |
| M-12 | Way of the Ox counter (`--style=ox --parry=`), with "COUNTER!" on the HUD | UI shot |
| M-13 | The character menu with the sword styles (`--menu`) | UI shot |
| M-14 | The training dummy mid-chop, telegraph glow visible | |
| M-15 | One good wide shot | Normal settings |
| M-15b | **The exact same camera as M-15**, with the pixel and dither effect off | Set `PIXEL_SHRINK` to 1 and the dither off, only in a temporary copy or through a helper. Never commit that change. |

Also copy `audio/music/Memory Moon.ogg` into the bundle.

**Deliver**
1. Write `NOTES.md` covering:
   - a table of each file and what it shows, with position and angle
   - anything that didn't work, or that needed a workaround
   - any shot you couldn't take, and why
2. Zip all the PNGs, `Memory Moon.ogg` and `NOTES.md` into `moon-assets.zip`.
3. In a clone of `github.com/VoidR34ver/ZEAR-Productions`, create the branch **`moon`** from `main`. Add `assets/moon-assets.zip` and also `assets/NOTES.md`, commit as "Once Upon a Moon website screenshots", and push only that branch.
4. Tell me what you captured and anything you skipped.
