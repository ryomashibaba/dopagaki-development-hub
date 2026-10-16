# P73 — Real Machine Gauntlet: Action Readability

Date: 2026-10-17 JST. Release class: **3D experimental game improvement**.

## Implementation
- B51-C moving-obstacle types are no longer rendered as one identical box. P73 has separate moving *slider carriages*, *rotator arms* and *piston press housings* with corresponding hazard body color.
- Red marks **fail**, yellow marks **bounce**, violet marks **push**. The actual collision modes come exclusively from B51-C JSON, not inferred by visual appearances.
- Each moving body uses the **unchanged** `movingObstaclePose(ob,simulationTime)` center, yaw, and half-sizes; all type-specific housing vertices stay within ±0.501 of the exact physical unit OBB. No enlarged/smaller fake colliders.
- Static non-collidable motion-guide rails indicate slider travel, rotator swept arc and vertical piston stroke. They are informational and do **not** affect physics.
- An optional in-viewport cue uses the *current sampled* physical pose of the nearest obstacle ahead, including movement type, contact effect and approximate horizontal distance. This is NOT a predicted collision or safe-lane system.
- GPU meshes are created per stage type/mode and reused each frame; no per-frame BVH rebuilding or excessive new mesh allocations.

## Preservation
- The real P69 collision roads, 450-degree spiral and 25m true jump are unchanged.
- Four frozen P62 authored stages and B45/240Hz/B48/B51-C physics remain untouched.
- P72 camera A/B and low-FPS fixed-step catch-up remain available.
- Physics chat's Draft PR #1 remains **HOLD**: still has high-speed spiral instability and Github Actions QA not executable. No unverified private physics code is copied into the public Development Hub.

## QA and limits
- Node: exhaustive 3×3 render-body combinations, vertex bounds and colors, motion guides deterministic, real B51-C pose sampling and cue orientation.
- Chromium: real P73 experimental stage, six obstacle definitions, machine-chamber spawn, visible live hazard cue, WebGL2 and existing camera interaction.
- Mandatory existing Node tests: P62 SHA, P68 both forks, P69 spiral, natural jump 38/44/52/60, P72 frame pacing and baseline physical-engine handoff.
- Human gameplay, FPS on intended device and whether the hazards are sufficiently legible at 80–140m/s remain NOT YET VERIFIED.

## Next decision
Seek user gameplay feedback on machine silhouettes and telegraph legibility; physics chat must separately complete long-run and CI validation before P74 imports engine changes.
