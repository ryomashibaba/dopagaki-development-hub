# P95 — VOID BREAKER / ACTIVE MACHINE HAZARD CANDIDATE

**Development staging only. Independent experimental VB-P95. 2026-10-17.**

## What changes in actual gameplay
- An **independent playable 3990m candidate** built from the same proven physical B48 road surfaces as VB-P93, but with **12 real moving B51-C collider obstacles** distributed through giant U-turns, upper scissor and lower surge corridors.
- Four animated lateral sliders with lethal red collision, four rotating yellow bouncing sweep arms, four vertically striking purple pushing pistons. They use the actual exact-clock native CCD moving collider source and existing matching collision-faithful 3D machine renderer, **not** decorative hazards.
- The first full risk gate confirms moving sliders can physically sweep over the nominal centerline. Never regard a centerline as guaranteed safe.
- Six optional section spawns, distinct VB-P95 selection, same original seven monumental visual regions. No new jumps, boost-pads, snap-to-road, or artificial speed resets.
- **No new game-physics, camera, steering, scoring or browser controls**. The player continues to use the same unmodified manual input.

## Evidence and HOLD
- `tests/p95-void-hazards.test.mjs` verifies native JSON validation, all 12 unique active colliders, three real distinct interaction types, centerline intrusion, B51-C sweep collision, native 240Hz movement from existing spawns and strict P94 isolation.
- `scripts/p95-hazard-probe.mjs` produces separate neutral and P94-corrective actual 240Hz native trajectories *on VB-P95*. Both outcomes are for diagnostics; **a green CI does not imply the full obstacle course can be completed**. See their `P95_HAZARD_NATIVE_*` records in QA logs.
- Chromium loads VB-P95 with 12 machine renderers and checks VB-P93 original still has 0, P94 original full-run evidence still says 7/7 and all P62 originals remain.
- Candidate metadata intentionally says `fullStartToFinish: NOT_YET_PROVEN_WITH_HAZARDS`, `humanPlaytest: NOT_RUN`, `inheritedP94Evidence: false`. It does not copy P94's full-run proof.
- **HOLD until** actual native full-course with all machines passes (including recoverable moving contacts and representative safe maneuvers), visual readability, and real human trial. No automatic promotion to game production.

## Protected boundaries
- Production: `https://dopagaki-slope.sora-110029.chatgpt.site/` unchanged.
- GitHub Pages: DEV/STAGING only, candidate labeled explicitly.
- Original reproduction site, P62 frozen inputs and moving 24, P66 83s course and P87 ghost, P93/P94 proven reference, and physics-specialist P97 Draft/HOLD all unchanged.
- Chat-based GitHub implementation; no Work or repeated local Windows user actions.
