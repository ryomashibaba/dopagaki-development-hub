# P93 — VOID BREAKER / SCISSOR ABYSS / Physical world candidate
Date: 2026-10-17. **Development/staging ONLY**.

## Real new course, independent from all P62/P66 road sources
- **3,990m original curved road design**, seven B48 3D Catmull-Rom physical rideable/collidable surface skins (31×5 controls, resolution 3).
- One **850m elevated 180° sky crown**, followed by an ascending scissor bridge; another **740m opposing 180° underpass crown**, plus an extended S-shaped low-level surge.
- Genuine **120m descent, 110m ascent, 155m descent, 95m prism crest**. A horizontally near crossing separated by ~55m height, not an invisible bridge.
- Road widths ~92–127m, with authored banking and a continuous 240Hz physical route. No input/jump/velocity overrides.
- Distinct **VOID BREAKER** architecture: suspended void blades, monumental paired sky portals, slanted crowns, abyss suspension pillars and exterior lattice. The GPU triangles do NOT enter native physics compilation.
- Six physical chapter spawns, stage selection in `/drive3d/` and native B48 steering. ECHO PIPE (P66) remains the default, and all four P62 original stage JSONs remain frozen.

## Validation boundaries
- `tests/p93-void-breaker.test.mjs`: native `validate`, real segment continuity, elevation and macro scale, 7 independent physical road skins, 7 geometry regions, rendering budget, native 240Hz initial driving checks on all six spawns, P66 unchanged.
- Chromium: load independent P93 stage, WebGL2, 7 architecture sections, 240Hz clock, manual input and visual toggle, then return to P66/P62. No hidden auto win.
- `build.mjs` writes `generated/P93_VOID_BREAKER.json`; Pages verifies P93 public JSON & version and the EXACT release SHA.
- Stronger end-to-end navigation, speed/steering/fall fairness, full course completion, and human review remain future gates.

**Not a claim of quality acceptance.** `stageForge.fullStartToFinish = 'NOT_YET_PROVEN'`, `humanPlaytest = 'NOT_RUN'`, `finalVisualQuality = 'NOT_APPROVED'`. A static course's correctness and 1.5s entry tests do not establish human fun/full-course playability. Do not ship to production on those grounds.

## Nonchanges
- Production `https://dopagaki-slope.sora-110029.chatgpt.site/` unchanged.
- Protected reproduction prototype unchanged.
- P62 4 original stages / 24 original moving machines unchanged.
- P66 P77 native 83s course and P87 real ghost unchanged.
- Existing camera, steering, B45/B48/B51-C, physics P97 Draft/HOLD unchanged.
- No migration/merge of unapproved Stage Forge candidate PRs.
- Chat-based implementation: no Work, no Windows user downloads.

Future step: 240Hz full-course scripted replay on P93 with tracking of every road crossing and failure, followed by human manual test, only then refine moving obstacles and publish as a released playable world.
