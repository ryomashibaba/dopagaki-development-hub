# P81 — CATHEDRAL SKYWORLD / Architectural Megastructure Expansion

Date: 2026-10-17 JST. Experimental visual/gameplay-readability release.

## Actual gameplay result
- The continuous P76 HALO RETURN physical sky hairpin is now enclosed by monumental arched portal ribs, exterior support frames and a vast hollow reactor core with luminous stacked annular decks.
- P69's full 450-degree cathedral spiral receives 16 giant outer pylons, multiple high-level circular belt structures, enormous roof cross braces and suspended light needles, without moving the actual 3D physical spiral or redirecting the ball.
- Both diverging real road forks sit below a layered lattice of overhead skybridges and vertical branching towers rather than repeated generic arches.
- A sparse futuristic stepped skyline adds distant vertical scale and depth across the full ride.
- Architecture is pure GPU vertex data in `web/p81-megastructure.mjs`; no vertex is added to B48 `compile()` or a physical road, collision shape, stage JSON or navigation line.
- A visible **巨大都市構造：ON / OFF** performance comparison control switches the added mesh without changing ball physics, inputs, simulation clock or P75 score. Default is ON for the dramatic full-world experience.
- Stage reload discards the prior GPU buffer; each version builds a single immutable mesh instead of reconstructing each frame. All four P62 frozen stages omit the experimental city.

## Protecting previous gains
- P76 intake real U-turn, P77 native 83.21-second spawn00→finish, P78 spectator demo, P79 real-native chapter practice, P80 surface-normal-aligned neon flow remain unchanged.
- Original B45 fixture numbers, full B48 Runner/CCD, six B51-C moving machines, natural 25m physical jump, P62 SHA and P75 survival records all unchanged.
- The independent physical-engine PR #1 is still Draft/HOLD. P81 does not adopt an unapproved physical algorithm.

## Release gates and limitations
- Node QA: city triangles finite, at least four significant and distinct 3D areas, hard vertex count budget, deterministic recreation, source JSON untouched, freeze-stage exclusion, and real B48 Runner unchanged.
- Chromium: actual P81 WebGL2 level includes a nontrivial number of extra triangles; user can switch ON/OFF while gameplay continues; legacy practice/spectator tests remain mandatory.
- Human subjective Steam-indie-grade beauty and target GPU FPS are **NOT CERTIFIED**. The OFF switch is a fallback for slow graphics hardware.
- Publish only after PR QA/browser success, main QA/browser/publish/verify-public all pass, and public HTTP reports the exact P81 SHA.
