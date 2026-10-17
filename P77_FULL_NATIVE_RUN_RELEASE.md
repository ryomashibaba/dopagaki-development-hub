# P77 — First-spawn full route: native B48 physics FINISH

2026-10-17 (JST)

## Real course defect fixed

P76 created a continuous 260m-radius HALO RETURN allowing spawn00 to physically enter the 450° cathedral spiral. P77 identified two downstream challenges using full original B48 Runner/CCD, not a speculative structural audit:

1. Neutral steering from spawn00 leaves the 3D fork approach at **t=61.963s** and fails at **t=64.633s**, although all six spiral segments were traversed.
2. Manual-strength **LEFT (-1) for five seconds beginning when FORK_APPROACH is entered** reaches the right branch and machine gauntlet. The neutral machine line hits rotating arm #5 at t~76.326s, then falls.
3. A short **RIGHT (+1) 75.45–75.90s, LEFT (-1) 75.90–76.35s** avoids moving obstacle #5 and reaches the genuine natural launch runway t=77.963s. On the old high-speed (~95m/s) trajectory, the descent intersected the landing ribbon from below, causing a physical collision-only face failure t=82.438s.
4. P77 lowers the second half of the *actual physical* GAP_LANDING road by **at most 8m**, smoothly from t=.42 to .82 of the landing road. This represents a descending sky landing rather than any hidden boost, dynamic catch, teleport, collision disablement, or physical attraction.

## Acceptance

The mandatory `tests/p77-native-full-acceptance.test.mjs` now establishes a single genuine **spawn00 → FINISH** B48 240Hz continuous run with recorded player-like steering inputs, covering:
- PIPE_DIVE_A 2 physical segments
- HALO RETURN 2 physical segments
- 450° spiral all 6 physical segments
- FORK_APPROACH / true right-side two-segment branch / physical rejoin
- MACHINE_CHAMBER all 3 physical road segments, with **no moving-contact events** (real B51-C obstacle physics is enabled)
- GAP_TAKEOFF with ~95m/s actual entry speed and real airborne flight
- GAP_LANDING true physical touchdown and a native `finish` event around **83.21s**.

Native lower-speed jump regression checks for **38/44/52/60m/s** all pass the revised physical landing. Existing P62 four frozen authored-stage SHA, B45 impulse constants, P69 85s spiral regression, P68 dual forks, P71 camera, P72 240Hz fixed-step, P73 machine visuals and P74/75 near miss/survival score remain untouched.

## Safe release boundary

- Physics source `private/reference_only/director/*` is **unchanged**. Dedicated track-director-cloud physics PR #1 is Draft/HOLD and not imported.
- **Do not claim human-run success or optimal difficulty:** the 83s full run is a deterministic native automated simulation with human-like input sequences. Human course readability, avoiding all machines without scripted input and final Steam-grade visuals remain **NOT APPROVED / NOT RUN**.
- P77 stage metadata should say `NATIVE_SCRIPTED_SPAWN0_TO_FINISH_PASS` and `humanFullRun:'NOT_RUN'`.
- Earlier investigative tests were archived via `test.skip`, because the mandatory P77 successful native full-run test supersedes those unstable probe trajectories.

Only release if PR and main QA/Chromium/Pages/public-HTTP/SHA verification are SUCCESS for this exact commit.
