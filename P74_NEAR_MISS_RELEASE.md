# P74 — Genuine 240 Hz NEAR MISS Action Feedback

Date: 2026-10-17 JST. Status: experimental game experience; no frozen physical engine or authored course changes.

## Actual implementation
- Each committed B48 240 Hz Runner step samples nearby moving obstacles' true B51-C oriented boxes with canonical `movingObstaclePose` and `sphereBoxSeparation`, using the canonical RADIUS 0.65m.
- After a machine has been ahead and the player physically passes behind it with no moving-contact or crush event, the run records a near miss only when the closest actual sphere-to-OBB clearance is 0.15–3.5m. Negative clearance, full collision, bounce/push contact, long-distance drive-by, wrong-way travel, and failures award nothing.
- New brief emerald NEAR MISS HUD with measured clearance and a per-run count. All near-miss data is display-only. It contributes zero points, never touches the runner's acceleration, position, velocity, steering or road surfaces, and does not predict safe paths.
- The implementation measures per fixed physics step, not per render frame; 10/30/60/120fps rendered output yields identical event time, clearance and tally.
- Restart changes the tracker, HUD tally and event visibility back to zero; pause freezes the simulation clock, including the feedback timeout.
- Limited broad-phase OBB samples minimize 240Hz CPU cost; near-miss reporting does not loop through the BVH again.

## Non-negotiable preservation
- 4 P62 frozen stages, P69 spiral/branch/true gap, B45 constants, B48 contact solver, B51-C moving physical definitions, P71 camera and P72 fixed-step pacing are unchanged.
- Physics project PR #1 on `ryomashibaba/dopagaki-track-director-cloud` still DRAFT as of implementation, with unresolved high-speed contact jerk and GitHub Actions pre-run failure. No unapproved physics source merged.

## Acceptance and limitations
- Node QA: one real sphere-OBB clean pass exactly once, physical overlap no award, moving-contact event cancels, far and reverse paths do not award, frame-rate-independent telemetry, real native B48 Runner path unchanged.
- Chromium: actual 3D ECHO JSON, 6 machines, near-miss HUD initialized/reset correctly; existing camera A/B remains.
- Entire human playable completion or guaranteed skilled near misses in the existing 6-obstacle machine gauntlet have NOT been certified; the feature is ready for trial, not a claim of universal successful hazard avoidance.

Release only after PR QA/browser and main QA/browser/publish/verify-public all PASS; verify published P74 SHA and stage data via real HTTP.
