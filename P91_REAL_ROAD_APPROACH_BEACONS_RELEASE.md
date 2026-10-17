# P91 — REAL-ROAD APPROACH BEACONS / 2026-10-17

## Why
The existing EP-P66 scripted 83.21-second native completion is not proof that a human can read the split, moving machines and real natural gap at high speed. P80 generic flow markers and P73 moving-machine HUD existed already. P91 adds **short, locally visible warnings embedded in the exact authored road skin**, without adding generic HUD or artificial driving assistance.

## Player-visible change
- Last `FORK_APPROACH` surface: three pairs of cyan-left / violet-right **forward chevrons**, followed by two edge posts. Colors distinguish the two options; they are not safe lanes or collision forecasts.
- First `MACHINE_CHAMBER` surface: two segmented amber approach bands and edge posts. They warn before moving machines but never predict a machine's timing or a safe dodge.
- Last `GAP_TAKEOFF` surface: amber bands with one red edge band and two red roadside posts. Drawn **only on the existing takeoff road**, never bridging to `GAP_LANDING`.
- All vertices are sampled from the existing exact B48 road skin and normal. Rendering uses WebGL2 `LINES` without collision effects. The 4 frozen P62 originals receive no new beacons.
- `data-approach-beacons` and `data-approach-regions` expose deterministic diagnostics.

## Code / quality
- `web/p91-approach-beacons.mjs`: pure read-only sampling; expected 68 GL line segments in the current EP-P66.
- `web/drive3d.mjs`: one WebGL buffer updated at stage load, drawn with existing camera and fog.
- `tests/p91-approach-beacons.test.mjs`: validate precise authored surfaces, immutability, finite positions, P62 isolation.
- `tests/browser/drive3d.spec.mjs`: P91 visible 3D app test (EP-P66 on / P62 off) in Chromium.
- `scripts/build.mjs`, smoke, Pages verify: artifact and P91 version validation.

## Intentionally unchanged
- No changes to physics `DT=1/240`, B48/B51-C collision, frozen P62 stage JSONs, P77 true gap, stage generation, velocity, camera, player input, score, demo/practice/gost eligibility or original game sites.
- No extra collision meshes, invisible ramps, guaranteed jump landing, autosteering or "safe lane".
- Physics PR #1 is still HOLD. This render-only improvement does not claim the banked-road steering bug is fixed.

## Acceptance scope
Code PR QA, native regression and Chromium are required before merge. After merge, main Pages publish and `build-info.json` SHA must be checked. **No human gameplay quality claims** without an actual manual test. This is a *development/staging-only* release under `docs/RELEASE_CHANNEL_POLICY_JA.md`, not a deployment to final DOPAGAKI production.
