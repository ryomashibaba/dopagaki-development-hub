# P80 — NEON TRACK FLOW / Surface-Accurate Road Readability

Date: 2026-10-17 JST. This change improves actual 3D playability without modifying native physics.

## Delivered
- Road-skin-accurate **two-column neon chevrons** on all visible rideable authored/experimental track surfaces.
- Markers are built directly from canonical B48 `sample()` and `frame()`; the vertex buffer is decorative (separate WebGL2 LINES), never in `compile()`, surface JSON or CCD.
- Two columns at surface-v 0.28 and 0.72 indicate **forward travel direction**, not a guaranteed safe lane or an auto-guided route. This deliberately does not make the center permanently safe.
- Chapter-specific color treatment (cyan pipe, mint U-turn, violet spiral, blue branching, amber machines, green landing) helps fast players distinguish upcoming terrain. Markers follow banks/curves rather than horizontal projected XY geometry.
- Eight-section progress ribbon (PIPE, HALO, SPIRAL, FORK, REJOIN, MACHINES, LAUNCH, LAND) follows actual `Runner.surface` and last real contact while airborne, never a guessed wall-clock waypoint or fabricated split time. Both physical forks share the single fork step.
- P79's seven true-physics practice chapters, native spectator takeover, P77 complete 83.21s demonstrator, P75 survival/personal best, P74 NEAR MISS and P71 camera remain available.

## Preservation and boundaries
- 23 original experimental EP-P66 collision surfaces (including P76 physical return) unchanged. Do not modify frozen P62 inputs, B45/B48/B51-C physics, bank/spiral shapes, natural 25m gap or moving machines.
- Surface decoration is not collider geometry, magnetic assistance, or a speed booster. Driving ability on a steep bank remains an unresolved dedicated physics problem.
- Dedicated physics source-of-truth `ryomashibaba/dopagaki-track-director-cloud` PR #1 is still Draft (P81 HOLD). No unapproved source copied here.
- P62 original 3D stages keep their own physical route visuals but do not display the EP-P66 chapter ribbon. They also receive physical-road sampled chevrons without changing stage files.

## QA gates
- Node: every real road receives both columns, all marker vertices finite and deterministic, endpoints near actual physical road top skin, 8 chapters map all 23 real roads, replay Runner remains bit-identical.
- Existing mandatory P62 SHA, P76 U-turn, P77 complete run, P78 spectator and P79 physical training tests must remain green.
- Chromium: actual WebGL2 confirms nonzero generated road markers and correct section changes at three true spawn positions, chapter practice and original P62 stage isolation.
- Automatic Playwright does not certify that human players find the colors, marker scale or camera visually perfect.

Ready only after PR QA/Chromium, main QA/Chromium/Pages deploy and public HTTP SHA verification succeed.
