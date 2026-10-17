# P87 — NATIVE REFERENCE GHOST (83-SECOND COURSE)
 
Status: GAMEPLAY reference feature, deliberately separate from physical engine candidate.
 
## Actual player capability
- The user may opt in to a purple wireframe reference ball in the 3D game. It shows where an independently verified **native B48 240Hz** reference run was at the same **simulation elapsed time**.
- This is not a recording of the user's best attempt, and does not predict how the player's current trajectory should move. It is a visual reference, not autopilot.
- Only enabled for EP-P66 **manual spawn00**. Hide and disable in P62 frozen levels, other spawns, spectator demo and section practice. Default OFF to preserve clarity and FPS.
- The ghost never writes to Runner, B45 fixture constants, B51-C moving contacts, points, near-miss events, survival score, PBs or sector records.
 
## Offline generation and efficient rendering
- Site build runs a **real complete 83-second native physics run**, feeding the *existing P78 demo input script* to a new temporary Runner. A new ghost JSON is created only if the physical run reaches FINISH without failures at 82–85 seconds.
- Sample one point per 16 native 240Hz steps (~15Hz) and interpolate between samples at visual render time; this costs no live second Runner. Data remain in public/generated/P87_REFERENCE_GHOST.json.
- Front-end imports **no private physical candidate**. It draws a noncolliding purple latitude/longitude wire sphere with WebGL LINES.
- Every rebuild re-generates the reference under the bundled, frozen B48 engine. No intentional physical code, route surfaces, original P62 authored JSON or P77 demo steering were modified.
 
## Verification gates and honest limitations
- Node tests assert finish, exact sample metadata, monotonic timestamp interpolation, preservation of original course JSON, manual eligibility and safe wireframe geometry.
- Chromium test checks real generated ghost ON/OFF, player mode, stage/spawn switching, spectator exclusion, console errors.
- Main Actions verify-public confirms P87 commit and HTTP 200/content for actual ghost JSON.
- A full 83s scripted pass does **not** mean a human can already complete the course, and visual ghost paths may overlap the player's starting position. Subjective gameplay/FPS remain unverified.
- Physical chat PR #1 at dopagaki-track-director-cloud remains HOLD; do not merge it based on this display-only feature.
