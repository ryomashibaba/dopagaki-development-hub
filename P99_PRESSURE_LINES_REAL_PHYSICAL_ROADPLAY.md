# P99 — PRESSURE LINES / Genuine variable-width driving challenge

Development branch from **P98 verified main** `31ee92eb9a18442522d857d64a689154492d2639`.

## What's actually changed
A separately selectable, fully native **seven-section B48 rideable and collidable road candidate** `VB-P99`, created from the original VB-P95 geometry but reshaped in the physical 31×5 Catmull-Rom surface control lattice. Each corridor widens into each major entry, narrows through the approach/turn and opens again at exit. Minimum scale per chapter .84 / .65 / .70 / .61 / .66 / .68 / .73 of the original section width. This introduces **real steering consequences** rather than only a decorative colored road stripe.

Each existing of the 12 B51-C moving machines retains unchanged physical location, size, phase, collision mode, motion and CCD. Machine colliders stay enabled. The centerline and stitched road seams are preserved to avoid accidental jump disconnects. Same gravity, rolling, steering law, survival scoring, natural jumps and almost fixed camera; no hidden guardrail, boost, teleport or forced speed resetting. Original VB-P95 and previously finished P94 stay intact.

The P99 full run is **NOT PREAPPROVED** just because the P96 controller previously succeeded on the wider road. Re-use the same bounded QA steering for physical measured evidence only; distinguish each P99 full native finish from actual human ability. Browser P99 begins in manual mode, without spectator demonstration until a genuine new full native and browser finish has been independently validated.

## Verification rules
- `tests/p99-variable-width-roadplay.test.mjs`: 7 actual modified road skins, smooth wide–tight–wide widths, unchanged road seams/centerline, all 12 active genuine moving collider definitions, valid spawns and source immutability.
- `scripts/p99-real-roadplay-probe.mjs`: compare four real native 240Hz steering profiles with all 12 obstacles; capture first true collision, off-road loss or native finished signal; green CI **is not equivalent to P99 completion**.
- `tests/browser/p99-stage.spec.mjs`: playable independent rendered road with 36 native B51 warning gates, 42 exterior macro portals and intact original VB-P95/VB-P93.
- Build outputs `generated/P99_PRESSURE_LINES.json` and `generated/P99_PHYSICAL_TRIAL.json`; release is GitHub Pages staging only after QA/Chromium/SHA verify. No final DOPAGAKI site edits.

**Human difficulty, fair steering on steep banks, GPU/mobile FPS, manual completion and final aesthetic quality remain HOLD.** Avoid overclaiming successful scripts as human evidence.
