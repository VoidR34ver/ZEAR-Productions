# Hadal: website assets (2026-10-05)

All PNG, 2560x1440, 16:9, straight from the game, uncompressed and unedited. No HUD except H-06.

Rendered from commit `0d4e2f3` (branch `menu/descent-backdrop`, the commit the latest playtest release
`v20260929-2033-0d4e2f3` was built from), Godot 4.7.2 .NET, macOS / Metal Forward+. The USB-stick copy
(`stick/2026-09-29`) has no storm or above-water surface, so H-15 needed the newer commit; everything was shot
from the same commit for consistency. Game code was not changed.

| File | What it shows |
|---|---|
| Z-01.png | Studio tab. A heavily evolved Hunter (lure, sail fin, wing fins, scute plating) cruising over the coral reef under sun shafts, 22 m. Creature in the centre for a tall crop |
| H-01.png | Hero. The same evolved creature in open water just under the surface, seen from below: rippling surface, sun shafts, glowing lure. Subject in the centre |
| H-03.png | Stage 1: the starting Hunter (1.10 m), side view, plain open water |
| H-04.png | Stage 2: the same animal after two mutations (Sail fin, Fangs). Same camera, distance and spot |
| H-05.png | Stage 3: heavily evolved, 15 mutations (see below), about 1.9 m. Same camera, distance and spot |
| H-06.png | Optional. The level-up screen: "HYPERGENE · level 1 · choose a mutation" with three offers (Hinged jaw, Glass skin, Muscular heart), HUD on, reef behind |
| H-07.png | Optional. The smallest reef fish next to the player: *Echinomorpha pascens*, a 6 cm purple grazer, around the 1.10 m Hunter on the reef |
| H-08.png | Optional. The cave predator *Tenebrodon cavernicola* in the hadal trench: red eyes and fangs in the player's lamp, player in the foreground |
| H-09.png | Zone 1, Sunlight zone (reef shelf): coral reef at 22 m, sun shafts, the player small in the middle |
| H-10.png | Zone 2, Twilight zone: gorgonian sea fans on a seamount top at about 590 m, the last blue light, lit by the player's lamp |
| H-11.png | Zone 3, Midnight zone: cold-water coral mounds at about 1,560 m, black water, bioluminescent glow, the player's lamp on the mound |
| H-12.png | Zone 4, Abyssal zone: a carcass graveyard (whale ribs) on the abyssal floor at about 4,990 m, a glassy deep-sea fish passing over it |
| H-13.png | Zone 5, Hadal zone (hadal trench): black smokers on the trench floor at about 10,780 m, the player a small silhouette at their foot |
| H-14.png | Combat. The 55 m *Gigantodon dentata* lunging with its jaws open, the player (left of centre, lamp on) dodging away |
| H-15.png | Surface in a storm. The player (four mutations: Sail fin, Wing fins, Lunate tail, Growth spurt I) leaping out of the water, sea and horizon behind. Subject in the centre for the 4:5 crop |

Depths are the ones the HUD would show (the game compresses real depth: 2,300 game metres stand for 11,000 m).

## Names of the depth zones

These are the names the HUD shows:

| Zone | Name | Depth on the HUD |
|---|---|---|
| 1 | Sunlight zone (the reef shelf) | 0 to 200 m |
| 2 | **Twilight zone** | 200 to 1,000 m |
| 3 | **Midnight zone** | 1,000 to 4,000 m |
| 4 | **Abyssal zone** | 4,000 to 6,000 m |
| 5 | Hadal zone (the hadal trench) | 6,000 to 11,000 m |

## Things to know before using them

- **H-03 / H-04 / H-05** were taken in one run: same animal, same position, same camera; only the mutations
  changed. The animal grows, so it fills more of the frame in H-05 (it stays inside the frame).
  Stage 2 = Sail fin, Fangs. Stage 3 adds Serrated fangs, Hinged jaw, Gulper maw, Growth spurt I and II,
  Lunate tail, Wing fins, Scute plating, Photophores, Melon organ, Esca lure, Searchlight photophore, Red muscle.
- **H-01 and Z-01** show the stage 3 animal, not the starter, because it is the better-looking one. Say so if
  the hero should be the starting Hunter instead (H-03 shows it).
- **H-10 to H-13 are dark on purpose.** Below the sunlight zone the only light in play is the player's lamp and
  whatever glows, and the shots show exactly that. The game also has a test light for screenshots (`--cam-light`)
  that floods the deep with light; I did not use it. If the zone gallery needs brighter pictures, that is the option.
- **H-15:** the game's storm has waves, a grey sky and foam on sharp crests, but no clouds or rain, so the picture
  reads as "rough open sea" more than "storm". Storm level was at its maximum (1.0).
- **H-08:** the shot list says "the 20 m cave predator". It has since grown: every behemoth is seeded at 50 m or
  more, and *Tenebrodon cavernicola* is now 65 m. It is shown in the open trench, not inside a cave: the game
  places hunters over the open floor.
- **H-14** uses the game's own screenshot hook (`--hunter=...,Gigantodon --gape=0.85`), which holds the animal
  facing the player with its jaws open, so it is a posed frame, not a moment from a fight.
- **H-06:** the menu is laid out for 1600x900; it was rendered at that layout and scaled to 2560x1440 so the
  text is the size it has in play.
- **H-07, H-09, Z-01:** the lamp is switched off (it only makes a glare on the coral in daylight).
- H-02 does not exist in the shot list, so there is no H-02.

## How they were taken

- The game's own screenshot mode, hosted in a screenshot-only helper script that renders the unmodified game
  scene into an offscreen 2560x1440 viewport (so no game window appears) and places a photo camera.
- Mutations, the spawned small fish and the frozen hunter use the game's own test hooks (`ForceMutation`,
  `SpawnNamed`, `--hunter`, `--gape`, `--storm`, `--menu=evolve`). The player is held still for the posed shots.
- One workaround was needed: on this commit the new menu backdrop leaves an opaque black fade layer up until
  the title menu has run once. Screenshot mode skips the menu, so every `--shot` run comes out black. The helper
  hides that one layer; in play it is already clear. This is a bug in the game's screenshot mode worth fixing.

## Not included

- The swimming video loop, the ZEAR tagline and the logo (yours).
- Nothing else was skipped.
