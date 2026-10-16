# P68 — Dual-Fork Continuity & Monumental Architecture

Date: 2026-10-16 (JST). Release class: EXPERIMENTAL 3D Drive Lab only.

## Actual source changes
- Fork-L and Fork-R road surfaces use controlled varying widths. The split and merge have staggered lane centers of ±10 m, preserving physical road coverage without two overlapping B48 collision solids.
- Both physical branches retain their own geometry; no teleport, jump booster, collision suppression, or B45 physics change.
- Left route and right route are separately asserted to remain grounded and reach FORK_REJOIN-01 from their starting spawns during 12 s native Runner trials at initial 44 m/s and neutral steering.
- The first 12 s of the main P67 intake remain verified in the same matrix.
- Distinct giant bell vaults, sky rings, pylons and elevated structural ribs added as WebGL-only megastructure meshes. They never enter B48 CCD physics.
- Frozen P62 stages and their source hashes, existing four-stage 2D inspector and Moving Lab B51-C remain unchanged.

## Explicit HOLDs
- 450° spiral exit: high-speed full-spiral completion is **not** verified. Several physically plausible bank/tangent experiments caused regressions, so the previous P67 intake and spiral were restored. Avoid any claim that P68 fixed the spiral.
- Start-to-finish and dynamic mid-run branch choice: still not proven across the full course. The machinery gauntlet intentionally contains collision/failure risk; winning lines require manual skill verification.
- Human assessment of delight, legibility, ridefeel, FPS and final visual quality: NOT RUN.

## Acceptance / delivery
- 21 physical road ribbons, below B48 max32.
- 12 additional large structural groups for each fork family plus matching towers, generated as visual-only meshes.
- Exact P62 original SHA, 240 Hz physics lock, existing P67 25 m no-booster jump with four native landing speeds, both 12s physical fork merge trials.
- PR gate: QA + Chromium PASS, then publish + verify-public checks actual HTTP, build SHA, release P68 marker and four P62 JSONs plus experimental P68 ECHO JSON.
