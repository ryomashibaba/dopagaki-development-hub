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

Until a 7/7 true finish passes, **do not amend** P93's metadata `fullStartToFinish: NOT_YET_PROVEN` or `humanPlaytest: NOT_RUN`. If the candidate fails, use its *exact* real failure location for subsequent **candidate-only** physical geometry refinement. Keep P66 P77 83s full run and P87 ghost, P62 frozen originals, and P97 Draft/HOLD unchanged.

No updates to production ChatGPT site. GitHub Pages staging only, and human review still required after any scripted PASS.

GitHub CI native probe may report HOLD without failing its own execution; a completed CI job only proves the **instrument ran**. Do not interpret QA SUCCESS as native full-route PASS unless the JSON report says so.
