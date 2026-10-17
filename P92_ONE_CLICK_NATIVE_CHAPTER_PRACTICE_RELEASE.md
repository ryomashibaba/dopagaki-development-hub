# P92 — FAILED RUN → NATIVE PHYSICS CHAPTER PRACTICE

2026-10-17 / DEVELOPMENT HUB, STAGING ONLY

## Player-visible change
After a genuine **manual** failure in the experimental EP-P66 83-second course, the result screen offers a second button, **「失敗した区間を練習（実物理で再走）」**. The existing 「再挑戦 (R)」 button remains unchanged.

Clicking the new button:
1. Uses the latest authentic rideable contact (`runner.failure.surface`, `runner.lastSurface`, or historic grounded Runner record) to select the nearest *earlier* P79 practice entrance.
2. Starts P79 at spawn 00 and advances the original B48 Runner at **240Hz** under the existing P78 deterministic scripted driver.
3. Hands over that same Runner, real physical momentum, current moving machine phase and collision state at the selected section.
4. Records are not saved as manual personal bests. Existing PB from the failed manual run is preserved.
5. All original normal restart, spectator, P62 stages, 8-sector ghost and stable camera remain unchanged.

## Physical entry mapping
- HALO -> return; spiral segments 01–05 -> return; final spiral exit -> spiral-exit.
- Fork approach/branches -> fork; rejoin -> rejoin; machine gauntlet -> machines.
- Real takeoff or touchdown -> jump. An airborne death uses the most recent *actual* grounded road snapshot.
- Intake, unknown, non-P66, failed spectator/practice and completed runs -> button hidden.

It does **not** teleport to the failure coordinates, revive a failed ball, inject speed, provide a ghost safe lane or guarantee collision-free completion. It is for practicing the corresponding segment with authentic pre-entry physics.

## Tests and safety
- `tests/p92-failure-practice.test.mjs`: strict mapping, mode/stage/finished exclusions, grounded record fallback and immutable input.
- Chromium: actual P66 moving-machine failure → one-click native P79 practice → takeover → no PB contamination → P62 isolation.
- Stage physics and frozen P62 SHA remain byte-identical; no edits to reference-only Runner, B45/B48/B51-C, road surfaces, original site, or chatgpt.site production.
- Prior P97 physics Draft/HOLD remains separate.
- QA, Chromium, Pages SHA verify required for staging delivery; **human play experience is not independently accepted**.

See `docs/RELEASE_CHANNEL_POLICY_JA.md` for confirmed staging versus production site separation.
