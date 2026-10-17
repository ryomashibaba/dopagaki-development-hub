# P88 — Native Ghost Sector Pace / Real 240Hz comparison

## Actual game feature
P88 builds on already shipped P86 chapter timing and P87 non-colliding reference ghost. At each real 240Hz Runner sector crossing, the manual player can see how many seconds faster/slower their run is than the accepted **83-second native reference at the SAME sector transition**. Negative delta = ahead; positive delta = behind. This is intentionally *not* a comparison of raw XYZ distances at equal timestamps, which would be misleading around the 180° U-return, 450° spiral, route forks and overlapping elevations.

## Native reference derivation
- `scripts/p87-ghost-generate.mjs` runs the existing unmodified P77/P78 full-course native B48 script from spawn00 to FINISH, collecting the *actual* 8 P86 sector completion events in addition to sampled ghost XYZ positions.
- `generated/P87_REFERENCE_GHOST.json` now contains `sectors: [{id,time,duration},...]`, eight strictly ordered real physics event timestamps. No fabricated split times or second live Runner.
- `web/p88-ghost-pace.mjs` validates the entire sequence, matches chapter id/index and computes signed delta from physically committed sector events, with 1ms source precision and 0.01s UI display.
- The visual pace line is shown only for the explicitly opted-in P87 ghost during manual EP-P66 spawn00 runs, after at least one genuine sector crossing. It is hidden in P62 stages, alternate spawns, spectator demo and practice. Turning the ghost OFF removes the pace line without changing any saved sector results.
- The user remains responsible for steering. The ghost and pace line never modify B48/B51-C physical code, active Runner, steering, camera position, checkpoints, survival score or local best records.

## Safety and non-regression
- Protect 4 P62 authored stage SHA sources, the actual 23 physical-road course, P76 giant hairpin, P77 ~83s full FINISH, P78/P79 spectator/practice, P86 timer and P87 reference ghost.
- Dedicated physical engineering PR #1 remains DRAFT/HOLD until its own native tests and human playfeel gates pass. This P88 PR does not copy any candidate physics source.
- Browser tests confirm real native manual sector passage, show/hide on ghost toggle, spectator and stage/spawn exclusion, no JavaScript errors; core tests assert build-time 8 native sector crossings, equal pace vs same run, invalid metadata rejection and unchanged native motion.
- A scripted 83s run does not prove a human can finish the entire stage; actual human feel / local FPS remain unverified.

Release only when PR and main QA/Chromium, site publish and public HTTP P88 SHA checks all pass.
