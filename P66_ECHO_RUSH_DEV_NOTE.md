# P66 — ECHO PIPE / RESONANCE CATHEDRAL RUSH

Status: experimental. Human acceptance and full-route steering/jump landing are not yet confirmed. This is a true new route, not a shader reskin of P62.

## New physical gameplay
- 95 m inlet dive and 450-degree, radius-150 m vertical spiral.
- Separate physical L/R forks with altitude offsets and a merged runway.
- Six actual B51-C machines: slider/fail, rotator/bounce, piston/push (two each).
- Rising natural takeoff ramp and a 25-metre gap without a collision bridge or jump booster.
- Six start points; P62's original four SHA-frozen JSON files are unchanged.

## Why it looks different
The visualBlueprint contains enormous rings, spiral annuli, organ-pipe clusters, cantilevers and abyss pillars. These are GPU-only scenery meshes built by web/p66-visual.mjs, not collision surfaces. The original B48 Runner/CCD and Moving Lab B51-C are unchanged.

## Gates and limits
Node QA tests B48 geometry, native road progress, and natural airtime; browser CI opens the P66 scenario and tests WebGL2/spawn selection. Deployment remains downstream of green QA+Chromium. Y-fork dynamic mid-run choice, jump landing, full-route pacing and human excitement are not yet proven. Do not report those as passed until measured.
