# P76 — Native HALO RETURN / Full-intake road continuity

Date: 2026-10-17 JST. Release target: public experimental 3D drive lab.

## The actual gameplay defect fixed
The original P69 pipe ended at (-600,150,-10) **traveling +Z** while the 450-degree spiral began at the same position **traveling -Z**, a nearly 180-degree heading discontinuity. That could never be treated as full-route driving continuity.

P76 constructs a genuine, physical 180-degree banked sky hairpin called **HALO RETURN**:
- The 95m descending intake now ends at (-1120,150,-10) traveling +Z, with the slope ending well before the turn. The room-scale pipe visual-only rings remain.
- The return centerline is `x=-860-260*cos(pi*t), z=-10+260*sin(pi*t)`; radius 260m, with wide banks and a progressively blended final bank angle matching the unmodified P69 spiral.
- Its two separate real B48 3D rideable/collidable road surfaces have 5× physical tessellation, staying within the original 32-surface and collision compiler budgets.
- The return ends at (-600,150,-10) heading -Z — **no hidden bridge, automatic forward snap, teleport, road magnet or modified physics source**.
- Nine enormous GPU-only return hoops give the return section its own distinct futuristic silhouette, without adding colliders.
- Superseded intake collision-only tunnel fixtures that obstructed the remapped road were retired; equivalent monumental visual pipes remain, and collision machinery in the later level is unchanged.

## Measured proof
GitHub Actions native original B48 240Hz Runner:
- **SPAWN 00** successfully drives through `PIPE_DIVE_A-01/02`, `PIPE_RETURN-01/02` and into `SPIRAL_CATHEDRAL-01`.
- Reaches first spiral at **16.82s**, no unintended airborne frames and no failure.
- P76 physical joins have measured near-zero endpoint gaps and tangent alignment **dot greater than 0.998**.
- P69 spawn1 85-second full-spiral-to-natural-launch regression and P68 both genuine fork paths remain mandatory checks.
- Original P62 authored stages and their SHA256 checks unchanged. B45/B48 source, original 450° spiral, 25m natural gap, six B51-C machines, P71 camera, P72 fixed-step pacing, P74 NEAR MISS and P75 survival-first scoring unchanged.

## Honest limits
- **The complete SPWAN00-to-finish uninterrupted native run remains NOT VERIFIED**. P76 proves only intake-to-spiral. It does not make the full course automatically safe or guarantee its difficulty.
- Human playfeel and final Steam-quality visual approvals remain NOT RUN / NOT APPROVED.
- Dedicated physical-engine PR #1 remains Draft/HOLD; native engine has NOT been swapped.

## Acceptance
- Native Core QA and true 3D/browser Chromium must both pass.
- The main Pages release must pass qa, browser, publish and verify-public; HTTP must return P76, the exact merge SHA, and 4 frozen P62 stages + 1 experimental road with six machines.
