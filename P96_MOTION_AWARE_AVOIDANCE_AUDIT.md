# P96 — Native moving-machine avoidance investigation

2026-10-17. DEV/STAGING candidate only. Protected baseline: main P95 SHA `a43e04bfe42101c0bee97d9bf6b0c3644b409c13`.

## Problem being addressed
P95 authored 12 real moving B51-C obstacles onto an independent full 3990m VOID BREAKER route. This was an actual physical gameplay improvement over a safe empty middle strip; however it was not full-run approved. P95 native corrective run failed from collision with a lethal red slider at **15.712 seconds** on real `p93-SCISSOR_RISE-01`; neutral steering fell off at **27.637 seconds** on the lower reversal. Green P95 CI verified the systems operated, NOT that avoidance was feasible.

## P96 actions
- Export the original **unchanged** P95 hazard station table. No stage JSON, physics, collision, amplitude or timing modification.
- Pure QA-only control compares four bounded profiles (near-soft, early-soft, early-strong, fast-switch). It reads real per-surface native B48 guide arc length, computes upcoming station distance and B51-C moving collider pose at predicted arrival, and emits only legal ordinary **[-1,1] player steer inputs**, with alternate right/left offset to avoid dynamic occupancy. It never teleports, slows, changes physical contact or injects safety.
- Actual native Runner at 240Hz reports first true red collision/fall, all 7 physical surfaces visited, steering decisions, any moving contacts and finish event. CI may pass while all 4 candidate steering runs FAIL; every trajectory must explicitly report a true PASS or HOLD.
- Tests assert: route layout immutable, original P94 fully finished course unmodified, P95 preserves its honest `NOT_YET_PROVEN_WITH_HAZARDS` metadata, valid bounded inputs, and partial run remains HOLD.

## Decision gate
1. If any P96 steering candidate reaches real 7/7 Runner finish with 12 B51-C obstacles active, this is evidence of *scripted* possible traversal, **not** that the difficulty is fair or fun for people. Follow up with near-miss visibility and alternative policy trajectories; human trial later.
2. If all fail, identify first collision and whether this is steering preview, collider placement, side clearance or physically untenable dynamic contact. Adjust candidate-only road/hazard configuration in a **separate** controlled P97+ phase after evidence; do not silently weaken collision or create fixed safe lane.
3. Never merge or cite physical-specialist P97 Draft/HOLD; its repo is unrelated to this P96 audit.

**Production remains** https://dopagaki-slope.sora-110029.chatgpt.site/. GitHub Pages is only DEV/STAGING. Original site and P62, P66, P93, P94 protected. No Work usage; user Windows operation zero.

## Measured result — native B48+B51-C (PR#41 initial QA)
| Scripted steering profile | Native result | 7 real sections | Time | Moving collisions |
|---|---|---:|---:|---:|
| near-soft | HOLD, physically wedged by last piston in PRISM_CREST | 6/7 | 35.017s | 2 contacts (push) |
| early-soft | TRUE NATIVE FINISH | 7/7 | 39.904s | 0 |
| early-strong | TRUE NATIVE FINISH | 7/7 | 39.992s | 0 |
| fast-switch | TRUE NATIVE FINISH | 7/7 | 40.704s | 0 |

The physical overlap of all **12 genuine B51-C colliders remains enabled**. The pass was obtained through normal native [-1,1] steering only. The result does not prove safety for arbitrary lanes/timings, human feasibility or satisfactory game difficulty.

## P96 code / player-facing preview
- P95 original hazard station definitions are moved to a single read-only `web/p95-hazard-layout.mjs` import, with identical 12 obstacles, spacing and timestamps.
- `web/p96-avoidance-steer.mjs` is the identical pure input algorithm used by Node and on-screen **opt-in P95 spectator**. No physical pose math is copied. The caller supplies the existing exact native B51-C sampler; the Node adapter is `scripts/p96-avoidance-controller.mjs`.
- `web/p78-demo.mjs` retains unmodified original P66 and P94 spectator methods, adding P95 only when explicitly enabled. P79 practice, human manual steering and PB saving remain separate; spectator results are never stored as personal best.
- `scripts/p96-acceptance-evidence.mjs` fails closed if the exact 7/7 actual native pass with all 12 active obstacles, 0 collider contacts and all 12 hazard decisions regresses. Public proof artifact is `generated/P96_NATIVE_DODGE_ACCEPTANCE.json`.
- New full native spectator regression and Chromium visual spectator-to-finish check are required before staging promotion.

**Status boundary:** P96 validates a scripted physical completion, while `humanPlaytest: NOT_RUN` and `difficultyAndFairness: HOLD` remain. GitHub Pages dev staging is not the official DOPAGAKI production site.
