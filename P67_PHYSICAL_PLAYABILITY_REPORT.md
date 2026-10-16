# P67 — Cathedral road continuity and measurable playability

2026-10-16 / development candidate. P62 frozen assets and B45/B51-C originals remain untouched.

## Substantial fixes
- P66 had an unintended 300m XYZ road disconnection between its 450-degree spiral and Y-fork. Rejoined all chapter centers, and moved the surrounding GPU megastructure scenery consistently.
- Replaced an impossible 5m-radius pipe bend with a 430m-radius banked high-speed intake; scaled the spiral to 430m radius and 96m width to accommodate downhill velocity, with higher native B48 collision tessellation on big curves.
- Widened and banked both fork roads. Added a seventh quick-start spawn for steering into a live Y-fork.
- Added in-page chapter cues covering breach, spiral, Y-fork, machines, takeoff, airborne and touchdown.
- Preserved the physical 25m gap without a jump button or booster.

## Native measured evidence
- P67 confirms zero airborne frames and no failure for first 12 seconds of the main intake at 44m/s initial speed with neutral steering.
- P67 confirms right branch remains grounded into fork rejoin for 12 seconds of its targeted simulation.
- Natural jump: genuine lift-off + landing at initial speeds 38 / 44 / 52 / 60 m/s, no authored jump impulse. Observed air time about 0.85 / 0.93 / 1.04 / 1.17 seconds.
- Exact chapter endpoint checks exclude only intentional 25m gap; B48 route and obstacle schema still validated, P62 source SHA reverified.

## Explicit open HOLDs
- Spiral launched from intermediate spawn eventually leaves the track at neutral steering; no full 450-degree run acceptance.
- Left fork eventually encounters CCD solver budget at the rejoin, despite remaining grounded up to that point. Dynamic in-run L/R choice is not yet accepted.
- Machine corridor requires actual avoidance: straight-line control intentionally hits the lethal slider. No complete 3D human-playable start-to-finish PASS is claimed.
- Not a finished commercial game: human playfeel, camera and rendering quality still need live validation.

## Release policy
Website is an experimental development preview, independent of the actual DOPAGAKI game and Moving Lab. Only publish after core/Chromium CI success, then live HTTP verification. Use P68 to fix held physical sections, not to hide them with superficial effects.
