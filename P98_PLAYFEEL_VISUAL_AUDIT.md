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

## Correctly framed first image review — actual gameplay deficiencies, not speculative
GitHub Chromium run `39091268340` SUCCESS; viewport top exactly 0 and canvas bottom 675 in all four shots, proving that `scrollIntoView` resolved the off-screen view bug. Full screenshot + canvas pixels were inspected (not merely passed by code tests).

Findings on the authentic P96 spectator + P97 warning-equipped VOID BREAKER:
1. The real driveable cyan 92–127m road is too visually homogeneous and wide; high-speed edges are difficult to judge from the image, despite physical road existence.
2. Original P93 visual arch generation placed huge opaque GPU columns at v=.025/.975 **almost touching real road edges**, with 10 separate portals per section = 70 gates total. In the opening and giant sky crown snapshots, massive opaque purple/blue/orange props crowd the road's eye line and obscure the next turn. They are not physical colliders, creating misleading apparent obstacles.
3. Many development-history paragraphs appear ABOVE stage selection in the desktop inspector; at 1440×900, choosing a stage originally auto-scrolled the actual canvas nearly offscreen. Also the CSS grid stretched the left `.viewport` to match the long right-side sidebar, creating blank dark vertical space beneath the active WebGL canvas.
4. Actual Github Actions SwiftShader CPU FPS varied 16–28 during the correctly positioned screenshot run; camera heading lag was 0.53–8.64 degrees. These are **CI-only measurements**, not a human PC FPS guarantee or proof of shaky camera. Human testing remains NOT_RUN.

### P98 change adopted as a result
- Visual-only **26m exterior column setback** from actual B48 road edges and **6 rather than 10 roof portals per road** (42 total vs 70). Roof remains colossal, but driver's view is less occluded. No collision or stage generator change.
- Reuse B48-sampled P84 noncolliding roadside reflectors for both VOID variants, alternating cyan/magenta accents and restoring high-speed depth/edge feedback. EP-P66 remains unchanged; frozen P62 remains opt-out.
- Fold long development and technical descriptions behind accessible `<details>`, move the stage dropdown above the fold, stop CSS grid from vertically stretching the gameplay viewport, and scroll the real canvas into view when spectator starts.
- Enforce actual 42 portal count, greater than 150 B48 roadside markers, unmodified P96 240Hz active 12-collider 7/7 finish, frame screenshots plus exact Pages release gates.

P98 changes are based on captured authentic browser imagery; **whether they are satisfactory visually and to human players must be confirmed after recapture.**
