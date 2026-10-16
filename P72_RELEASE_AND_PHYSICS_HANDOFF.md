# P72 — Low-FPS gameplay stability and safe physical-engine handoff

**Status:** public 3D Drive Lab improvement; physics upgrade not integrated.

## Actual game loop change
- The previous frame cap ran at most 12 steps at B48 240Hz, so 10fps rendering advanced only 50ms of simulation per 100ms frame, causing slowdown.
- P72 uses a bounded fixed-step accumulator with up to 30 steps and 125ms of recoverable render time: 10fps=24 physics steps, 15fps=16, 30fps=8, 60fps=4, 120fps=2.
- Exceptional render stalls are bounded to avoid unbounded catch-up; skipped backlog shows up in the existing warning counter rather than being called normal game time.
- Returning from a background tab resets the rendering clock and interpolation anchor. Paused/failed ball display remains locked to the latest committed pose.
- No changes to B45/B48 physics, CCD, B51-C moving obstacles, frozen P62 stages, P69 stage geometry or P71 camera filtering.

## Private physical candidate policy
- The dedicated physics project has a DRAFT PR for stronger bank steering and stable world momentum. It has known longer-run regressions and unavailable full GitHub Actions QA; it is NOT approved for game integration.
- The public Stage Forge repository **MUST NOT contain or deploy private candidate physics source**. P72 has no copy of that source.
- `scripts/p72-physics-compat.mjs` tests P69's genuine road geometries using real Runner/CCD. With no candidate it reports `HOLD_NO_APPROVED_CANDIDATE` plus the frozen B48 baseline.
- Future approved physics source may be supplied as a private local absolute file path under `DOPAGAKI_PHYSICS_CANDIDATE`. It is imported solely at runtime; only behavioral metrics and SHA-256 are emitted, no source bytes.
- Run `DOPAGAKI_PHYSICS_FULL=1` for the 85s real six-segment spiral-to-takeoff gate. Other checks include 12s intake, both fork lanes, and natural jumps at 38/44/52/60m/s.
- If a candidate fails any gate, stop with HOLD and send results to the physics chat. Passing the gate alone does not authorize publication; human playfeel and source review remain required.

## Release definition
- `npm run test:core`, static site generation, HTTP smoke and Chromium browser tests must pass.
- `main` Pages verify-public must verify SHA, P72 version, four frozen stages and P69 experimental JSON.
- After deployment, compare live 3D gameplay at 10/15fps where practical. Automated timing tests do not substitute for real hardware FPS or subjective controls.
