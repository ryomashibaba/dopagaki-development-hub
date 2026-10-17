# P83 — Adaptive Skyline Raster Quality

2026-10-17 JST. Visual-performance experiment on P82B, not a physical engine upgrade.

## New player-facing quality controls
- P82B's monumental HALO/spiral skyline, full 83.21s native spectator/practice and four frozen P62 stages remain available.
- Rendering presets: `Auto` (starts at 100%, adjusts GPU raster resolution), `Quality` 100%, `Balanced` 80%, and `Performance` 60%. This is a **linear pixel-density scaling**, not a triangle reduction.
- Auto watches measured visible-frame FPS at 0.5s intervals. Four consecutive samples below 42fps step scale down by 15% to a minimum 55%; sixteen consecutive samples at or above 57fps step up by 15% to maximum 100%. This hysteresis avoids rapid resolution flicker.
- User-set fixed presets never self-adjust. The mode, approximate raster resolution, and current percent are shown in the playtest HUD. The actual WebGL drawing buffer dimensions change while the CSS canvas/ball screen framing remain constant.
- The governor ignores sampling during spectator's accelerated 2× run, expensive real-physics chapter seeking, pause, background tabs and ended runs. Returning to the foreground clears the FPS measurement clock.
- Resolution changes don't alter GPU mesh content, P82B megalithic scene, road-edge radar, P80 road direction lines, P79 genuine native training, P75 personal records or P74 hazard tracking.

## Important limits
- FPS alone does not identify a GPU bottleneck: raster scaling may help GPU-limited clients, but doesn't guarantee higher FPS on CPU-limited devices or cure physics contact jitter.
- Native Runner B48/240Hz physics, B45 fixtures, B51-C machines, 23 road collision surfaces, P77 83.21-second full native drive, 25m natural gap, P62 SHAs are untouched.
- Dedicated physical-engine draft PR #1 is still HOLD and is NOT integrated. User hardware FPS measurements and subjective sharpness/readability remain unverified.

## Mandatory gates
- Node: pure quality selector, 10/15/30/60/120fps-style conditions, 42/57 hysteresis, 4/16 sample cadence, max/min scale, and 720-step actual Runner trajectory equality.
- Chromium: all 4 quality modes on WebGL2, actual framebuffer dimensions become 60% linear at Performance, unchanged CSS canvas layout, P82 skyworld ON/OFF, manual 240Hz gameplay, camera, edge radar, and P62 frozen stage checks.
- Release only on PR QA/Chromium PASS, then main QA/Chromium/publish/verify-public PASS and public SHA+P83 HTTP verification.
