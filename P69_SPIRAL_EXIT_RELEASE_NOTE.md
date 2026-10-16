# P69 — SPIRAL EXIT / STEERABLE MEGASTRUCTURE RUSH

Date: 2026-10-17 JST. Release class: Experimental 3D playtest; not the final DOPAGAKI game.

## Measured improvement
Using the unchanged B48 Runner at 240Hz, spawn at spiral entry (index 1), initial speed 44m/s. P68's old spiral fell around 11.56s and reached only segment 02.
- Spiral banking: −0.25rad, smoothly levelled over the final 23% of the 450° spiral.
- The genuine 3D fork approach widens to 150m at entry and tapers to 40m near the Y-fork, with 90% gradual taper.
- Real LEFT input −1 for 5 seconds (t=62.15–67.15s), not a booster, teleport, automated guide or change to B45 physics.
- Native 85s trial: all six spiral collision-road segments, fork approach, machine district and actual natural-jump takeoff entered, with no unplanned flight or failure. Final measured speed ~86.5m/s.

## Limits
Neutral steering fails at the fork approach; player steering is required. The exit is not an automatic ride. A complete run from starting spawn0 is still HOLD. Human playfeel, FPS and start-to-finish completion are not accepted. Playtest cues explain the required left steering.

## Preservation and verification
Frozen P62 original SHA, B45 constants, Moving Lab and the 2D inspector are unchanged. Historical banking/exit probes are kept as skipped Node test files so daily CI is fast. A mandatory 85s physical-run regression test verifies actual progression through six spiral segments into the 25m natural takeoff. Existing P68 dual-fork and P67 four-speed jump QA remain mandatory.

Release gate: PR QA and Chromium, merge, then main qa/browser/publish/verify-public. Do not report live P69 before the HTTP release/version/SHA check passes.
