# P100 — TERRAIN PULSE / genuine 3D physical road deformation (Draft/HOLD)

Baseline: merged P99 main `9a4f18d116758b379b3ee105bc44d45c64383e5d`.

## Gameplay change

P99 changes the physical road width. P100 now independently bends the **real B48 collision skin** across seven chapters: genuine lateral centerline S-turns, smooth rising/falling crests, and dynamic lateral road camber. These are not surface colors, HUD elements, screen shake or decoration. At every chapter endpoint both the source geometry and tangent of deformation are preserved by an envelope with zero endpoint slope. Road widths and twelve genuine B51-C moving obstacle definitions are inherited intact from P99.

Each stage has a separately selectable ID `VB-P100`. Existing P99, P95, P93, EP-P66, and frozen P62 assets are unchanged. Original 240Hz Runner, radius 0.65, speed, controls, camera, score and PB logic are unchanged. There is no boost, magnet, auto-pilot, teleport, or artificial collision bypass.

## Fail-closed release gating

This is a candidate, not a P100 completion. `fullStartToFinish: NOT_VERIFIED_P100`, `humanPlaytest: NOT_RUN`; the P100 spectator button stays disabled. No new finished demonstration is supplied without **independent P100 240Hz real-collider completion**. The four P96-style bounded *test-only* steering profiles are probed on P100, and both successes and failures are honestly reported. P100 physical integrity includes nonzero centerline deformation, unchanged P99 data, unchanged hazards, chapter seams, valid starts, real Chromium render and no browser errors.

Further gates before main merge: inspect actual mid-curve Chromium screenshots, assess gameplay-grade P100 hazard placement and native full-course finish, confirm acceptable player reaction window and imagery. Human enjoyment/manual fairness and real-device PC/mobile FPS remain NOT_RUN until measured. GitHub Pages is STAGING ONLY; production chatgpt.site is untouched.

## Independent native QA gate observed on original P100 geometry

GitHub Actions run `39101404829` native QA: **near-soft 40.104s** and **early-soft 39.817s**, both physical 7/7 finishes and zero native moving contacts with all twelve colliders enabled. Early-strong fell at 20.504s and fast-switch at 21.633s, proving input-policy tradeoffs. These results are not player difficulty proof. New P100 spectator reuses near-soft input only in explicit demo mode and never stores PB; browser full finish is a separate required gate. Continue to hold main merge until browser and real image review.
