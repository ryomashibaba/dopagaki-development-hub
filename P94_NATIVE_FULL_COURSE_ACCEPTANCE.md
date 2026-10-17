# P94 — VOID BREAKER 240Hz actual full-route acceptance

2026-10-17. Stage: `VB-P93`. Source baseline: P93 merge `849c9db72e2c77e6870f276dacd4dfaa62d23c28`.

## What is measured (not assumed)
- Simulate the exact unchanged B48 `Runner` at `DT=1/240`, initial spawn 00 at speed 44; real contacts/sweep and original route, no teleport.
- Compare **neutral** (no player input) vs **corrective** scripted lane following via the real per-surface B48 sampled route. This controller is QA instrumentation, not a change to in-game assist/steering.
- Capture visited authentic physical surfaces in authored order, time each is first contacted, elapsed time, positions, max speed, vertical range, air frames, longest air interval, native failure cause and last real road.
- The only PASS case requires `Runner.status==='finished'` **and** all 7 surfaces actually visited, with no native failure. Anything else is `HOLD_NOT_FULLY_TRAVERSED`. No assertions of completion based on travel duration, scene geometry, or WebGL.
- The CLI prints both outcomes with prefixes `P94_VOID_NATIVE_NEUTRAL` and `P94_VOID_NATIVE_CORRECTIVE`, with JSON evidence, in GitHub Actions QA logs.

## Why separate from P93 and production
P93 had a real WebGL course and initial 1.5s native runs per spawn, but neither native full route nor actual human viability was shown. This P94 instrument fills the evidence gap before any talk of gameplay approval.

**Measured P94 result (native B48, exact 240Hz, current shared spectator driver):** corrective steering FINISHED in **38.317s**, with all **7/7 real authored road surfaces**, **4,063.33m actual travel**, and **139.50m/s maximum speed**. Neutral driving failed at **27.637s**, after **4/7** surfaces, from a true fall off the lower reversal. Both traces and truthful PASS/HOLD statuses are published as the deterministic build artifact `generated/P94_VOID_NATIVE_ACCEPTANCE.json`. The result is repeatable under Node regression and Chromium opt-in spectator demonstration.

This evidence permits updating P93 metadata to `fullStartToFinish: NATIVE_SCRIPTED_240HZ_7_OF_7_PASS_P94`. **It does not authorize** changing `humanPlaytest: NOT_RUN`, declaring balanced difficulty, integrating physical P97 Draft/HOLD, or promoting the world to the ChatGPT Site production game. Keep P66 P77 83s full run and P87 ghost and P62 frozen originals unchanged.

No updates to production ChatGPT site. GitHub Pages staging only, and human review still required after any scripted PASS.

GitHub CI native probe may report HOLD without failing its own execution; a completed CI job only proves the **instrument ran**. Do not interpret QA SUCCESS as native full-route PASS unless the JSON report says so.
