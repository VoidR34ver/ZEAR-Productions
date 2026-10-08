# [TITLE] — Game Design Document

**Version:** 0.1 · **Engine:** Godot 4 / GDScript · **Last updated:** [date]
**Author / Creative Director:** Zephie

> **How to use this doc**
> - Every bullet is a question for you to answer. Replace it with your answer; don't leave the question in.
> - `❓ OPEN:` marks undecided items. `📌 LOCKED:` marks a final decision. Nothing gets built off an OPEN item.
> - Wherever a number or formula is needed, write the actual number, even a placeholder. "Some damage" can't be implemented; "10 base, ×1.5 on weakness" can.
> - Every system section ends with **Edge cases**. Fill these in. That's where bugs and broken design hide.

---

# PART I — VISION

## 1. Identity

| Field | Answer |
|---|---|
| Title (working) | |
| Genre(s) | |
| Perspective | |
| Platform(s) | |
| Target session length | |
| Estimated total playtime | |
| Rating target / content limits | |
| Comparable titles ("X meets Y") | |

### 1.1 One-liner
- What is this game in one sentence, ideally under 20 words?

### 1.2 Elevator pitch
- What would you say in 3–5 sentences: premise, what you do, what makes it unlike anything else?

### 1.3 The hook
- What's the single image or moment that would make someone stop scrolling on a trailer?

### 1.4 Why this game exists
- What gap does it fill?
- What does it say? What is it *about* underneath the mechanics?

## 2. Design Pillars

Write 3–5 pillars. For each one, include a **"this means…"** and a **"this means NOT…"** line.

| # | Pillar | This means… | This means NOT… |
|---|---|---|---|
| 1 | | | |
| 2 | | | |
| 3 | | | |

> **Pillar test:** for every feature later in this doc, write which pillar it serves. If a feature serves none, cut it.

## 3. Player Experience Goals

### 3.1 Emotional arc
| Phase | Hours | What the player should feel | What creates that feeling |
|---|---|---|---|
| Opening | 0–1 | | |
| Early game | | | |
| Midgame | | | |
| Late game | | | |
| Ending | | | |

### 3.2 Target player
- Who is this for? What do they already play?
- What skills or knowledge do you assume they have?
- Who is this explicitly *not* for?

### 3.3 Anti-goals
- Which feelings or experiences do you want to avoid? (e.g. grind, tedium, unfair deaths, cheap jumpscares)

## 4. Tone & Themes

- **Tone in three words:**
- **Themes:** List them and say how each one shows up in *mechanics*, not just story.
- **Where's the line?** What content is too far, and what is the game unafraid of?
- **Humour:** none, rare, dark, or frequent?

---

# PART II — GAMEPLAY

## 5. Core Loops

### 5.1 Moment-to-moment (seconds)
- What are the player's hands doing most of the time?
- Diagram it:
```
[ ] → [ ] → [ ] → back to start
```

### 5.2 Encounter loop (minutes)
- What does one full encounter look like from first sighting to aftermath?

### 5.3 Session loop (30–90 min)
- What does a good play session contain? Where does it naturally end?

### 5.4 Progression loop (hours)
- What does the player gain over time, and what does it unlock?

### 5.5 Meta loop
- Is there anything persistent beyond one playthrough? (NG+, codex, achievements, multiple endings)

## 6. Controls & Input

| Action | Keyboard/Mouse | Gamepad | Context |
|---|---|---|---|
| Move | | | |
| Interact | | | |
| Attack / Act | | | |
| Menu | | | |
| | | | |

- Is there rebinding? Accessibility toggles?
- What's the input feel goal: weighty, snappy, deliberate?

## 7. Player Character

### 7.1 Who are they?
- Fixed character or customised? Named or silent?
- Why are *they* the one doing this?

### 7.2 Movement
| Property | Value |
|---|---|
| Walk speed (px/s) | |
| Run speed | |
| Dodge / roll? (distance, i-frames, cooldown) | |
| Stamina? | |
| Collision size | |

### 7.3 Stats
| Stat | What it does (exact effect) | Base value | Max | How it increases |
|---|---|---|---|---|
| | | | | |

### 7.4 Resource pools
For each pool (HP, sanity, mana, etc.):

| Pool | Max | Drains from | Restores from | At zero | Shown on HUD as |
|---|---|---|---|---|---|
| | | | | | |

### 7.5 Death & failure
- What happens on death? What's kept, what's lost?
- Where do you respawn?
- Is there a corpse run, penalty, or nothing?

**Edge cases:**
- Two pools hit zero on the same frame?
- Dying mid-capture? Mid-dialogue? During a cutscene?

## 8. Creatures

### 8.1 Roster overview
- How many at launch? How many per region?
- Ratio of common / rare / unique / boss-tier?

### 8.2 Classification
- Types / archetypes / families: list them with a one-line identity each.

| Type | Identity | Strong vs | Weak vs | Gate (stat/item needed) |
|---|---|---|---|---|
| | | | | |

- **Matchup chart:** paste a full grid here.
- Can creatures have more than one type?

### 8.3 Creature stats
| Stat | Effect | Range |
|---|---|---|
| | | |

### 8.4 Creature spec sheet (copy one per creature)

```
NAME:
TYPE(S):
RARITY:
HABITAT / REGION:
APPEARS WHEN: (time, weather, Mind's Eye level, story flag…)
SILHOUETTE / VISUAL NOTES:
BASE STATS:
ABILITIES: (name — effect — cost — cooldown)
PASSIVE:
BEHAVIOUR (wild): (patrol, ambush, flee, stalk…)
ACQUISITION CONDITION:
WHAT IT GIVES THE PLAYER BEYOND COMBAT:
LORE (1–3 lines):
SOUND NOTES:
```

### 8.5 Growth
- Do creatures level? Evolve? Mutate? Degrade?
- What triggers change: XP, items, events, player choices?
- Can growth be bad?

### 8.6 Relationship with the player
- Do creatures have loyalty, fear, hatred, hunger…?
- Can they disobey, betray, escape, or die permanently?
- Party size? Storage?

**Edge cases:**
- Party full when acquiring a new creature?
- A creature dies permanently and was story-critical?
- Duplicates allowed?

## 9. Acquiring Creatures

### 9.1 Step-by-step flow
1. 📌 LOCKED: The creature must be beaten down to a defeated/weakened state before any acquisition attempt.
2.
3.
4.

### 9.2 State diagram
```
[Wild] → [Engaged] → [ ? ] → [ ? ] → [Acquired]
                         ↘ [Failed] → ?
```

### 9.3 Success formula
- What determines success? Write the formula, even roughly:
```
chance = ( ? ) × ( ? ) − ( ? )
```

### 9.4 Player decisions during acquisition
- What choices does the player make? (At least two meaningful ones, or it's just a button.)
- What information do they have when choosing?

### 9.5 Failure
- 📌 LOCKED: Overkilling a creature makes it **escape** rather than die.
- 📌 LOCKED: For **unique legendaries**, escaping triggers a **Nemesis-style mechanic**: each later attempt to acquire it gets harder.
- ❓ OPEN: Does overkill-escape apply to common creatures too, or only legendaries? (If commons escape, they just respawn, so what's the cost?)
- 📌 LOCKED: On escape, a legendary gains **stat/power increases** and **visible physical changes/scars** from the encounter.
- 📌 LOCKED: An acquired scarred legendary **keeps its scars and boosted stats**.
- ⚠️ RISK: Deliberate overkill becomes a strategy for farming stronger legendaries. Decide whether that's intended (a high-risk/high-reward choice) or something to close off.
- 📌 LOCKED: Nemesis escalation has a **hard cap** (placeholder: 3 escapes).
- ❓ OPEN: Exact cap number, and how much stat increase per level?
- ⚠️ NOTE: With scars + stats kept, the "optimal" play is now to overkill exactly to the cap and then catch it. That's fine if intended; it makes max-scar legendaries a known goal.

### 9.6 Feel
- How should this feel, in one sentence?
- What makes it feel unlike a menu or dice roll? (input, timing, animation, sound, risk)

**Edge cases:**
- Acquiring a boss? A unique creature? A creature during a story event?
- Interrupted by another enemy?

## 10. Combat

### 10.1 Format
- 📌 LOCKED: Turn-based, on a separate battle screen (overworld encounter → transition → battle scene).
- 📌 LOCKED: Creatures only on the field; the player commands from outside.
- 📌 LOCKED: 1v1, one active creature each side, swap from the bench.
- ❓ OPEN: Player is off-field. What does the player risk or spend during a fight, if anything?

### 10.1a Swapping
- 📌 LOCKED: By default, swapping costs your turn.
- 📌 LOCKED: Special consumable items (destroyed on use) let a swap happen with **Haste**.
- 📌 LOCKED: Haste also exists as a **passive ability** on some creatures.
- 📌 LOCKED: **Haste** = the incoming creature enters and gets an instant action before the enemy moves.
- 📌 LOCKED: Passive Haste has no mechanical limit; it is balanced by **rarity** (Haste creatures are very rare / hard to acquire).
- ⚠️ RISK: Once a player owns one, it will likely be on every team. Rarity controls *when* they get it, not how much it dominates after. Watch this in playtesting.

### 10.2 Turn / action structure
- Describe a full round or a typical 10 seconds of combat.

### 10.3 Damage formula
```
damage = ( ? )
```
| Modifier | Value |
|---|---|
| Type advantage | |
| Type disadvantage | |
| Critical | |
| Status bonus | |

### 10.4 Status effects
| Status | Effect | Duration | Cure | Stacks? |
|---|---|---|---|---|
| | | | | |

### 10.5 Abilities
- How are abilities obtained, equipped, and limited (cooldown, cost, slots)?

### 10.6 Enemy behaviour
- How do enemies decide what to do? Describe each behaviour tier.

### 10.7 Ending a fight
- Win conditions, lose conditions, fleeing, rewards.

**Edge cases:**
- Fight runs indefinitely (stalemate)?
- Player and enemy both die at once?
- Fleeing from a boss?

## 11. Progression & Economy

### 11.1 Progression curve
| Phase | Player level / power | Creatures available | Key unlock |
|---|---|---|---|
| | | | |

### 11.2 Currencies & resources
| Resource | Source | Sink | Can be farmed? |
|---|---|---|---|
| | | | |

### 11.3 Items
| Category | Examples | Stack limit | Where found |
|---|---|---|---|
| Consumables | | | |
| Key items | | | |
| Equipment | | | |
| Crafting | | | |

### 11.4 Shops / trading / crafting
- Do they exist? How do prices scale?

### 11.5 Difficulty
- Fixed, selectable, or adaptive?
- Where are the intended difficulty spikes?

---

# PART III — WORLD & NARRATIVE

## 12. World Structure

- Open world, hub-and-spoke, interconnected, linear?
- Map size estimate (screens or tiles):
- How does the player travel? Fast travel?

### 12.1 Regions
| Region | Theme / biome | Level range | Creatures | Key locations | Gate to enter | Music |
|---|---|---|---|---|---|---|
| | | | | | | |

### 12.2 Gating
- List every gate type (stat, item, story flag, ability, perception) and where each is used.

### 12.3 Secrets & hidden layers
- What's hidden? What reveals it? How often should the player find something?

### 12.4 Safe zones & save points
- Where can the player save/rest? Is anywhere truly safe?

### 12.5 Time & weather
- Day/night? Weather? Do they change gameplay?

## 13. Story

### 13.1 Backstory
- What happened before the game starts?

### 13.2 Plot outline
| Act | Summary | Player goal | Key event | Location |
|---|---|---|---|---|
| I | | | | |
| II | | | | |
| III | | | | |

### 13.3 Delivery
- Dialogue, item descriptions, environment, cutscenes, notes? Rank them by importance.

### 13.4 Endings
| Ending | Condition | What it says |
|---|---|---|
| | | |

### 13.5 Lore bible
- Factions, religions, history, cosmology. Link to a separate doc if it gets long.

## 14. Characters & NPCs

| Name | Role | Location | Function in gameplay | Arc / change | Fate | ❓ |
|---|---|---|---|---|---|---|
| | | | | | | |

### 14.1 Dialogue
- Branching or linear? Do choices matter mechanically?
- Voice: text only, gibberish voices, or VO?

## 15. Quests & Objectives

- Main quest structure.
- Side quests: how many, what kinds?
- How does the player track objectives? (journal, none, map marks)

---

# PART IV — PRESENTATION

## 16. Art Direction

| Spec | Value |
|---|---|
| Base resolution | |
| Tile size | |
| Player sprite size | |
| Creature sprite size range | |
| Palette (colour count / rules) | |
| Animation FPS | |
| Lighting approach | |

- References (games, painters, architecture):
- Rules: what must every asset do? What must the art never do?
- Animation list per creature/character (idle, walk, attack, hurt, death…).

## 17. Audio

### 17.1 Music
| Context | Mood | Instrumentation | Loop / adaptive? |
|---|---|---|---|
| Title | | | |
| Hub | | | |
| Region | | | |
| Combat | | | |
| Boss | | | |

### 17.2 Sound design
- Sound identity in one sentence.
- Which sounds carry gameplay information?
- Silence: where is it used deliberately?

## 18. UI / UX

### 18.1 Screen list
| Screen | Purpose | Accessed from | Key elements |
|---|---|---|---|
| Title | | | |
| Pause | | | |
| Party | | | |
| Inventory | | | |
| Map | | | |
| Codex | | | |
| Settings | | | |

### 18.2 HUD
- What's always visible? What's contextual? What is deliberately hidden?

### 18.3 Onboarding
- How is each mechanic taught? (tutorial, environment, NPCs, nothing)
- What does the player know after the first 15 minutes?

### 18.4 Accessibility
- Text size, colour-blind modes, remapping, subtitles, difficulty assists?

---

# PART V — PRODUCTION

## 19. Technical (Godot 4)

| Spec | Value |
|---|---|
| Godot version | |
| Renderer | |
| Target resolution / scaling | |
| Target FPS | |
| Platforms | |

### 19.1 Architecture
- Autoloads/singletons (e.g. GameState, SaveManager, AudioManager):
- Scene tree overview:
- Key systems and how they talk to each other (signals, groups, direct refs):

### 19.2 Data
- Creatures, items, abilities: stored as `.tres` Resources, JSON, or other?
- Resource class list with fields:
```
class_name CreatureData extends Resource
@export var ...
```

### 19.3 Save system
- What's saved? When? How many slots? Format?

### 19.4 Tools & pipeline
- Tilemap workflow, sprite import settings, audio buses, version control.

## 20. Scope & Milestones

### 20.1 MVP
- The smallest build that is still *this game*:

### 20.2 Milestones
| Milestone | Contents | Done when… | Target date |
|---|---|---|---|
| Prototype (core loop only) | | | |
| Vertical slice (1 region, polished) | | | |
| Alpha (all systems in) | | | |
| Beta (all content in) | | | |
| Release | | | |

### 20.3 Content counts
| Content | MVP | Release |
|---|---|---|
| Creatures | | |
| Regions | | |
| NPCs | | |
| Bosses | | |
| Music tracks | | |

### 20.4 Cut list
- Features to drop first if time runs out, in order:

## 21. Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| | | | |

- Which system is hardest to make *fun*?
- Which is hardest to *build*?
- Where are you most likely to over-scope?

## 22. Playtesting Plan

- What questions does each test answer?
- Who tests? What do you watch for?
- Feedback template:
```
Build:
Tester:
What did you try to do?
What confused you?
What felt good?
What felt bad?
```

---

# APPENDICES

## A. Glossary
| Term | Meaning |
|---|---|
| | |

## B. Open Questions
- [ ]
- [ ]

## C. Decision Log
| Date | Decision | Reason | Alternatives rejected |
|---|---|---|---|
| | | | |

## D. Changelog
| Version | Date | Changes |
|---|---|---|
| 0.1 | | Document created |
