# P98 — Real WebGL2 playfeel investigation before more road or HUD changes

## Objective
P97 GitHub Pages main SHA `28f95ca32269bba82d11cd9633c81faebe7f4490` has 3990m / 7 actual physical road surfaces and 12 native B51-C moving obstacles. P96 scripted 240Hz finish and 36 P97 warning gates PASS; **human enjoyment, readability and FPS remain untested**.

Rather than implement yet another UI component or narrows the 92–127m course blindly, P98 captures **actual Chromium WebGL2 rendered screens** from the verified unmodified full native scripted spectator at `3s`, `12s`, `23s`, and `33s`. It stores browser source-dependent camera heading lag, render FPS, canvas resolution/quality, actual hazard target and distance/urgency, page errors and screenshots. This is evidence, NOT artificial scene mockups.

## Scope / limits
- Real game unchanged. P98 is browser QA only until evidence is visually reviewed. It modifies neither native B48/B51-C physics nor camera/steering, P97 road gates or stage data.
- Screenshot audit runs on GitHub Actions Linux Chromium, which **does not represent Windows RTX5080, iPhone or player eyesight**. Do not present CI FPS as end-user FPS. Do not report human-visible subjective scores as measured without actual image inspection/human play.
- The audit uses optional scripted spectator, not manual gameplay. It cannot certify joystick/key responsiveness, real human ability, fair obstacle spacing or how the user enjoys the game.
- Redesign/adjust road widths/banks/obstacle placements only after image and telemetry findings. If snapshots cannot be read in Chat, preserve them as a GitHub artifact and label visual review HOLD.

## Outputs
Browser tests: `tests/browser/p98-playfeel.spec.mjs` snapshots and data. CI attaches artifact `p98-real-playfeel-frames-<run>`, kept for 7 days. See GitHub Actions run artifacts.
