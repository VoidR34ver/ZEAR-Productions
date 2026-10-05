# Brief: ZEAR Productions website (GitHub Pages)

Written 2026-10-05 for a fresh session. The owner (GitHub `VoidR34ver`, solo dev, casual tone) wants the public builds
repo to have a website. In their words: "Here are my current projects etc. feel free to playtest and then like an
anonymous review and feedback system."

## Where it goes

- Repo: `VoidR34ver/ZEAR-Productions` (PUBLIC; renamed from `hadal-builds-pt` on 2026-10-05, old links redirect).
- Branches today: `main` (a short index README), `hadal` (README only), `OHAfH` (README, `play.sh`, `play.ps1`).
  Do not move or rename `OHAfH/play.sh` and `OHAfH/play.ps1`: playtesters' one-liners point at their raw URLs.
- Builds are that repo's GitHub releases, not files in a branch (git refuses files over 100 MB).
- GitHub Pages is not switched on yet. Suggested: site files in `docs/` on `main` (or a `gh-pages` branch), served at
  `https://voidr34ver.github.io/ZEAR-Productions/`. No custom domain yet.
- The two game source repos (`VoidR34ver/Hadal`, `VoidR34ver/One-house-away-from-home`) are PRIVATE. Nothing from
  them beyond what is in this brief should be published without asking.

## What the site should be

One studio page, plain HTML/CSS/JS, no framework, no build step:

1. Header: ZEAR Productions, one line about what it is (ASK the owner for the wording).
2. A card per current project: name, one-paragraph pitch, status, screenshots, how to playtest.
3. A feedback section: anonymous review (a rating plus free text, which game, which build), no login.
4. Works on a phone. Dark. Each game may carry its own accent (Hadal: deep sea; OHAfH: gothic, PSX dither).

Screenshots: none are public yet. ASK the owner for them. Do not invent art or use other games' images.

## The feedback system needs a decision first

GitHub Pages is static: it cannot store submissions. Pick one WITH the owner, since each needs an account they create:

- Google Forms / Tally embed: zero code, anonymous, results in a sheet. Looks like an embed.
- Formspree / Web3Forms / Getform: the site's own styled form posts to their endpoint, results by email. Free tiers
  are limited to a number of submissions a month.
- A Cloudflare Worker (free tier) writing to KV or D1: fully custom, could also show public reviews. Most work.
- GitHub Issues: NOT anonymous (needs an account), so it does not fit the request.

Whether reviews are shown publicly on the page or only reach the owner is undecided: ASK. Public display of anonymous
text needs moderation (spam, abuse), which argues for owner-only at first. Add a honeypot field against bots either way.

## Project 1: Hadal

- Third/first-person abyssal ocean game. You are a lab animal with a "hypergene" that lets you evolve at level-up,
  in a procedurally generated trench whose ecosystem simulates and evolves on its own.
- Godot 4.7.2 .NET (C#). Last pushed 2026-09-30.
- In the game so far (from its handoff notes): five depth zones from reef shelf to hadal trench with sub-biomes;
  98 starter species from 7 cm reef fish to a 20 m cave predator; procedural creature bodies and skin from a genome;
  combat with stamina, a burst dodge, charged bites and enemy tells; level-up menu with three mutation offers; status
  screen; start screen with five starting classes; weather, storm-driven waves and currents; the player can leave
  the water.
- Public builds: release `v20260929-2033-0d4e2f3` (marked Latest) with `Hadal-linux.zip` (68 MB),
  `Hadal-macos.zip` (130 MB), `Hadal-windows.zip` (78 MB). The release note mentions an updater that only moves
  forward to newer releases. Link to the latest release rather than a fixed tag.

## Project 2: One House Away From Home (OHAfH)

- First-person gothic survival horror: "what if RE4 and RE8 had a baby in RE1". Graubuenden, 1998, a castle built
  through a mountain, each area in its own architectural style. Modern-quality models and lighting shown through a
  PSX-style low-resolution, dithered screen filter.
- Godot 4.7.2 (GDScript). Work in progress on branch `castle-east-keep` (PR #1 of the private repo, 12 commits).
- In the game so far: one generated castle of 15 buildings and 228 rooms, all reachable (guest wing, lower ward, great
  hall, palas, great tower, greenhouse, burial galleries, core hall, east gallery, kitchens, donjon, hall range,
  cloister ward, chapel, Renaissance wing); two guns, ammo that is also the key to shootable locks, named keys,
  ladders, a Resident-Evil-style map; zombies that hear typed noise; ray-traced echoes and room-sized reverb; a
  different lamp colour per building.
- Honest status for the page: early playtest. Placeholder HUD, no terrain around the castle, some doors lead nowhere,
  enemies and story content are thin.
- Public builds: release `ohafh-latest`, replaced on every publish:
  - `OneHouseAway-linux.zip` (198 MB, x86_64, Vulkan), full quality.
  - `OneHouseAway-windows-lowspec.zip` (209 MB, Win 10/11 64-bit), cut down for integrated graphics and 4 GB RAM.
  - No macOS build and no full-quality Windows build are published.
- Playtest one-liners (already live; show them with a copy button):
  - Linux: `curl -sL https://raw.githubusercontent.com/VoidR34ver/ZEAR-Productions/OHAfH/play.sh | sh`
  - Windows (PowerShell): `irm https://raw.githubusercontent.com/VoidR34ver/ZEAR-Productions/OHAfH/play.ps1 | iex`
- Keys: WASD move, mouse look, Shift sprint, Ctrl crouch, E interact, 1 / 2 weapons, F flashlight, left click fire,
  right click aim, M map, Esc pause.
- Neither build has been run on its target system by the developer yet; say "playtest build", not "release".

## Other repos (not confirmed as current projects: ASK before listing)

`Once-upon-a-moon` ("idk a game") and `TopDownRPGMetroidvania` exist, both private.

## Working rules the owner has set

- Ask before anything goes public: switching Pages on, pushing the site, publishing reviews. Show a preview first.
- Publishing is outward-facing; the repo is public, so a push to it is visible at once.
- Never put the owner's email address on the site or send it to a third-party service unless they say so.
- Decline non-essential cookies on any service you visit; add no trackers or analytics to the site unasked.
- Report plainly what was tested and what was not.
