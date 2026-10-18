# P98 — Real WebGL2 playfeel investigation before more road or HUD changes

## Objective
P97 GitHub Pages main SHA `28f95ca32269bba82d11cd9633c81faebe7f4490` has 3990m / 7 actual physical road surfaces and 12 native B51-C moving obstacles. P96 scripted 240Hz finish and 36 P97 warning gates PASS; **human enjoyment, readability and FPS remain untested**.

Rather than implement yet another UI component or narrow the 92–127m course blindly, P98 captures **actual Chromium WebGL2 rendered screens** from the verified unmodified full native scripted spectator at `3s`, `12s`, `23s`, and `33s`. It stores browser source-dependent camera heading lag, render FPS, canvas resolution/quality, actual hazard target and distance/urgency, page errors and screenshots. This is evidence, NOT artificial scene mockups.

## Scope / limits
- First actual frame capture revealed a **player-facing navigation bug**: pressing the demo button from the long right-side setup panel leaves the actual WebGL racing canvas scrolled above the viewport. P98 fixes this at the actual spectator-start action with immediate `canvas.scrollIntoView({block:'start',behavior:'auto'})`, without camera/physics edits. Screenshot regression now asserts the canvas is fully onscreen after starting and stores both viewport+canvas images.
- Native B48/B51-C physics, P97 road gates, 12 colliders, camera, steering, score and stage geometry remain unchanged.
- Screenshot audit runs on GitHub Actions Linux Chromium, which **does not represent Windows RTX5080, iPhone or player eyesight**. Do not present CI FPS as end-user FPS. Do not report human-visible subjective scores as measured without actual image inspection/human play.
- The audit uses optional scripted spectator, not manual gameplay. It cannot certify joystick/key responsiveness, real human ability, fair obstacle spacing or how the user enjoys the game.
- Redesign/adjust road widths/banks/obstacle placements only after image and telemetry findings. If snapshots cannot be read in Chat, preserve them as a GitHub artifact and label visual review HOLD.

## Outputs
Browser tests: `tests/browser/p98-playfeel.spec.mjs` snapshots and data. CI attaches artifact `p98-real-playfeel-frames-<run>`, kept for 7 days. See GitHub Actions run artifacts.

## First P98 measured pre-fix run — do not misread cropped screenshots
QA/Chromium run `39090574814` PASS. Real 240Hz native spectator finished with 12 colliders; 4 frames at t≈3.8,12.29,23.84,33.56s showed **only the lower part of the game canvas**, due to page scrolling by the setup menu; therefore those pictures cannot support judgments that the road or ball is invisible. Actual recorded SwiftShader render FPS: 21,25,46,29 (not GPU-owner FPS); camera heading differences: 1.89°,7.49°,8.20°,2.73°. JS errors: 0. Real view corrected and recaptured in the next P98 workflow; evaluate the new screenshot artifact, not the old cropped set.
