# P75 — SURVIVAL RUSH: Skill-Based Scoring and Personal Best

Date: 2026-10-17 JST. This is a playable 3D laboratory scoreboard, not an official full game release.

## Player-visible improvement
- The live 3D panel displays **SURVIVAL SCORE**, **PERSONAL BEST**, survival base and optional NEAR MISS bonus.
- Survival base is 100 points per actual physics second (`Runner.time`), not wall clock or rendered frames; pause correctly prevents progression.
- Near-miss bonus is `min(15 × actual P74 misses, floor(base/19))`. Therefore at all times the bonus is **≤5% of the total**, exactly preserving the user's survival-time-first scoring direction.
- Records rank first by longer survival time and only break a duration tie by score/finish. Bonuses cannot make a shorter survival run the personal best.
- Failed or finished real runs display the final score, time and bonus. A real retry button restarts with an unchanged Runner.
- Browser-local persistent records are isolated for each `(stageForge.id, spawn index)`; no sign-in, server or uploaded personal metrics. Storage blocked/corrupted means gameplay still works, without persistence.
- Restart resets in-run score, NEAR MISS counter and result; the existing stage-specific best remains. Changing stages does not pollute other stages' records.

## Protected source boundaries
- `private/reference_only/director/` physics modules (B48, B45, B51-C), P69 road/spiral, four P62 authored stage SHA, P72 fixed-step loop, P73 moving-machine visuals and P74 event detection are unchanged.
- Scoring operates only on `runner.time`, `nearMissTracker.total` and `runner.status`. It does not touch `Runner.points`, vehicle physics, steering, assists, collision or speed. No cheats or arbitrary input trigger results.
- Dedicated physics PR #1 remains Draft/HOLD and is not integrated. Physical curve and banking defects remain separate concerns.

## QA
- Node exhaustive 5% cap under huge near-miss counts, survival-priority record comparison, invalid/corrupt/blocked storage, stage/spawn isolation and a real Runner motion invariant.
- Chromium checks real WebGL2 ECHO stage, score HUD, camera A/B, near-miss reset, and actual B51 machine collision ending a run and saving a best that persists on reload.
- Human subjective difficulty, uninterrupted complete P69 stage run, and final-game visual approval are **not** established by this release.

Release only with PR qa/browser and main qa/browser/publish/verify-public SUCCESS. Verify exact P75 version and published merge SHA via HTTP.
