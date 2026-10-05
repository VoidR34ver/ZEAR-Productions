# Give Me Your Yoghurt: what the website needs

Adding *Give Me Your Yoghurt* as a third title means four changes to the site:
- a fourth tab next to Hadal and One House Away From Home
- a third door in "Current works" on the Studio tab
- an entry in the feedback form's "Which game" list
- a download button

There's no repo, branch or build for it yet, so everything below has to come from you. **Must have** blocks the tab. **Nice to have** can come later, and its section is left out until then.

---

## 1. Basics (must have)

| What | Example from the other games |
|---|---|
| **Exact title** as it should appear, with its capitalisation | "One House Away From Home" |
| **Short tab name** for phones | "OHAfH" |
| **One-line subtitle** for the Studio door | Hadal: "Supergenetics."; One House: "What even is a home?" |
| **Genre**, in a few words | "first-person survival horror" |
| **Setting line**, if it has one | "Graubünden, 1998" |
| **Engine** | Godot 4.7.2 |
| **Status**: playtest build, early playtest, or "not playable yet" | One House: "Early playtest" |
| **Honest status note**: what's missing or rough right now | One House: "The HUD is a placeholder, there's no terrain…" |

## 2. Getting the game (must have, unless it's "coming soon")

| What | Notes |
|---|---|
| **Is there a build to download?** | If not, the tab gets a "coming soon" line instead of a button |
| **Platforms**: Windows, macOS, Linux, and any low-spec version | Shown above the button |
| **Where the build lives** | Hadal uses versioned releases, One House uses one `ohafh-latest` release. A third pattern, e.g. a `yoghurt-latest` release, needs a branch in this repo |
| **Install steps** | e.g. "Pick the zip for your system, unzip it, run it." |
| **Does it update itself?** | Hadal's does, so its tab says so |

## 3. Your words for each scene (must have)

Each game tab is a run of scroll scenes. Give me one line per scene, in your own voice, like you did for the other two. The structure can differ from Hadal and One House, so tell me if a scene doesn't fit this game.

| Scene | What it does | What I need |
|---|---|---|
| **Hero** | Full screen, title animates in over an image or effect | 1 or 2 short lines, e.g. Hadal's "You are a lab animal. With a hypergene." |
| **Hook reveal** | A big image opens up behind one line | 1 line, e.g. "The world is alive too, you know." |
| **Core mechanic** | 2 to 4 steps that change as you scroll | 2 to 4 very short lines, e.g. "Start small." / "Level up." |
| **Numbers** | Big counters | 1 to 3 real numbers with labels, e.g. "228 rooms". Only true ones. |
| **Gallery** | Sideways-scrolling screenshots | 1 heading line, plus a short caption per shot |
| **Two features** | Two images with one line each | 2 features, one line each |

**Signature effect (optional):** Hadal has the dive and depth counter. One House has the pixel crush and the bullets. If this game has one thing that would make a good scroll effect, tell me what it is.

## 4. Screenshots (must have: at least Y-01, Y-02 and Z-03)

Same rules as before:
- 2560×1440 or 1920×1080, PNG straight from the game
- no HUD unless the shot is of the UI
- name each file after its code

| Code | What to capture | Notes |
|---|---|---|
| **Z-03** | The game's best-looking moment | The Studio door. Shown tall, so keep the subject centred. |
| **Y-01** | **Hero:** the shot that sums up the game | Full screen behind the title. Keep the middle calm, because the title sits there. |
| **Y-02** | **Hook reveal:** the most striking image | Opens out from the centre. |
| Y-03 to Y-05 | **Core mechanic**, one shot per step | Same camera for all three if they show the same thing changing. |
| Y-06 to Y-10 | **Gallery:** 3 to 5 different places or moments | Tell me what each one shows, for the captions. |
| Y-11, Y-12 | **Two features**, one shot each | Shown tall (3:4 or 4:5), so keep the subject centred. |

**Nice to have:**
- a 6 to 10 second loop of play: MP4, 1920×1080, no audio
- the game's logo as SVG or transparent PNG
- the main menu as a screenshot

## 5. Look (must have)

- **Two or three colours** that belong to the game: its main environment, the main character, any UI accent. If you don't know, I'll sample them from the screenshots, like Hadal's water blue and hunter red.
- **Title lettering:** does the game have its own logo or font? One House uses blackletter and Hadal an italic serif.
- **Mood:** is it as silly as the title sounds, or is the title a joke over a serious game? This decides the whole tab.

## 6. Also tell me

- **Order:** where it goes among the tabs and doors. Newest first, or after One House?
- **The other games:** whether *Once Upon a Moon* or the top-down RPG Metroidvania should be added too, while the site is being restructured.
- **Private details:** anything that must not be public yet. The brief says nothing from private repos goes on the site without asking.
