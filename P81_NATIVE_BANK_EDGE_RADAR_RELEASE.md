# P81 — Native Bank Edge Radar / Roadside Visibility

2026-10-17 JST. Latest base: P80 `27ed149e892ee665f07b81b9b6e82a91b938f557`.

## Purpose

The user reports weak steering on strongly banked roads and frequent accidental falls. The authoritative physical steering solver is under investigation in the dedicated private physics project's **Draft PR #1**; Stage Forge must not silently change B48 engine constants or auto-steer.

P81 instead delivers a directly playable improvement: an **actual-surface lateral location bar**, left/right edge proximity and physical top-skin tilt angle. It visualizes the player's position relative to the current native collision road without modifying driving dynamics.

## Implementation

- A pure `web/p81-edge-radar.mjs` reader locates the closest longitudinal position on the actual `Runner.surface`, then projects the actual ball onto the current Catmull–Rom road skin. The sample/frame callbacks are injected from the unchanged canonical B48 implementation.
- Show the ball as a white locator on a colored width bar, with approximate left/right margin and road-surface tilt. Danger/caution are visual awareness thresholds, not guaranteed collision timings or recommended steering corrections.
- 10Hz HUD sampling (not 240Hz), no new geometry, no BVH changes, no magnetic assist, no AI driver, no physics mutation.
- Hide the radar while the real Runner is airborne or there is no rideable contact. The road ID is taken from actual physics, so it never chooses a nearby but uncontacted fork automatically.
- Preserve manual game score, P75 personal-best, P74 NEAR MISS, P78 opt-in spectator, P79 true-physics practice, P80 road-flow chevrons, frozen P62 stage objects, six moving machines and original complete 83s scripted B48 route.

## Explicit accuracy boundaries

- Width and margins are **local visual estimates** from a sampled cross-section. Curved edges and real CCD contacts are more complex, so do not interpret the display as an exact upcoming collision distance. Normal-based tilt includes slope as well as bank and is labelled `面傾斜`, not a fictional pure roll measurement.
- No human gameplay quality or strong-bank steering fix is claimed. That work remains in the separate physics chat. P81 is primarily a player's visual awareness improvement while that source undergoes testing.
- The older P75-based PR #18 experiment was safely CLOSED without merge because P80 main already included the superior real P76 U-turn and P77 full B48 native run. Production P80 is protected.

## Required verification

- Node: canonical B48 road center and both edge margins, banked return/spiral/fork/machine surfaces, airborne/unknown-contact suppression and identical 720-step B48 Runner outputs.
- Chromium: genuine intake, spiral and an original P62 stage display working; P78/P79 demo/practice, 8-stage flow and camera A/B continue to pass.
- Existing frozen P62 source SHA, P77 native entire run, P78 demo and P79 practice must all be green.
- Only publish after PR QA and Chromium PASS followed by main QA, browser, publish and public HTTP SHA verification.
