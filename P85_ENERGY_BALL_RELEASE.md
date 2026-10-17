# P85 — ENERGY BALL: Premium visual identity with real-speed trails

Date: 2026-10-17 (JST). Status: display-only experimental 3D enhancement; no game physics edit.

## Why
The previous `web/drive3d.mjs` ball was a flat-colored 10×14 tessellated turquoise globe. As the DOPAGAKI game aims for Steam-level paid indie presentation, P85 adds an immediately readable, three-dimensional, neon-styled energy sphere that makes high-speed travel visually satisfying.

## Implementation
- `web/p85-energyball.mjs` builds deterministic colorful multi-facet cyan/teal/indigo sphere, bright winding meridian circuits, two narrow orbital rings, and directionally aligned fading trail rays.
- Meshes are built **once** at WebGL init. Render uses unchanged `draw()` static WebGL buffers with native B48 Runner position and simulation time (not wall time) and the actual horizontal velocity direction. No CPU-generated particle cloud or extra BVH.
- Physical radius remains 0.65m. Opaque core radius 0.642m; purely visual circuit radius 0.652m, just 2mm outside the original collider. Outer orbit radius 0.83m is transparent line work and **never** participates in collision.
- Speed rays begin when velocity magnitude is at least 31m/s; maximum stroke length stays below 10m. At render scale ≤0.65 the optional orbit and speed rays are disabled to reduce GPU work. The core remains visible.
- `エネルギーボール：ON/OFF` allows immediate side-by-side comparison with the original player ball without resetting Runner, Camera, stage progress or best score. No camera shake or boost is introduced.

## Safety and scope
- No changes to private B48/B51-C physical modules, B45 constants, P62 frozen SHA assets, P76 return hairpin or P77 accepted 83.21s native full course, P78 spectator replay, P79 practice, P80–P84 GPU display systems.
- No attempt to integrate the separate physics chat's current Draft/HOLD PR #1. Display GPU math is not a cure for ongoing real bank steering issues.

## Quality gates
- Node validates finite RGB geometry, GPU vertex ceiling, actual collider clearance, deterministic mesh generation, render/pause/velocity calculations and native B48 Runner state invariance.
- Chromium validates live WebGL2 energy mesh, live trail at default speed, classic-toggle, adaptive 60% raster disabling nonessential effects, restoration at 100%, pause and restarts, and original P62 play compatibility.
- Main publication must pass QA + browser + publish + verify-public, matching exact P85 version and Git merge SHA.

## Explicit limits
Visual quality and subjective feel require human evaluation. Browser QA does not establish actual stable render FPS on the user's GPU or device; optional effects can be disabled. No audio or arbitrary simulation speed changes are included.
