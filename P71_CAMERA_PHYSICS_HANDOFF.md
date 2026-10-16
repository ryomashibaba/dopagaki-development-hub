# P71 — Camera A/B and physical-engine integration handoff

## Why this release exists
User reported extreme camera jitter on curves and slopes, plus poor bank steering. P70 added display interpolation; P71 makes the camera comparison directly playable and catches pause/low-fps edge cases. Physics defects belong to the dedicated physics chat.

## Render-only changes
- `web/drive3d-camera.mjs`: frozen simulation draws the exact latest ball snapshot, instead of blending against an old snapshot; yaw response matches actual time down to 10fps while limiting exceptional frame stalls.
- `web/drive3d.mjs`: selectable stabilized heading vs raw-heading rendering, accessible in the playtest panel. Both modes continue to interpolate the committed 240Hz ball state and neither writes any field to Runner or changes the B48 step.
- UI shows heading lag and counts max-substep backlog warnings; these indicate slowdown, **not** automated physics stabilization.
- Browser acceptance toggles camera modes and verifies pause holds TIME, then resumes. Node tests check frozen-frame positioning, centered ball, abrupt curves and 10/15/30/60/120fps heading equivalence.

## Cross-chat physics integration: HOLD until approved
- Physics source-of-truth: private `ryomashibaba/dopagaki-track-director-cloud`, `cloud-live` HEAD `23500101e2ff873a125faab0707622f5a1298e8b` as checked at start of P71.
- A physics PR #1 titled `P70 HOLD: bank-capable 240Hz steering and stable curve momentum` existed in Draft state. Do not merge, copy or publish this unapproved candidate as a tested physics upgrade.
- After the physics chat confirms a merged/approved SHA, acquire its exact `director/physics.js`, `director/surface.js`, `director/collision.js` and dependency versions, review compatibility with `capturePose(runner)`, run original P62 SHA checks, B45 fixture + B51-C moving collision tests, P68 dual fork and P69 85s ride. Any changed dynamics require new baselines and an explicit compatibility evaluation.
- Keep the P62 authored stage JSONs and current P69 stage geometry unchanged unless an identified physics problem requires a separately approved geometry adaptation.

## Release limitations
Playwright/Node PASS is not human subjective camera approval. Low-fps telemetry can reveal slow simulation but does not claim to cure GPU bottlenecks. No new physical-engine algorithm was implemented in the Stage Forge repo.
