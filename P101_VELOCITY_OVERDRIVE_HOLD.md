# P101 / VELOCITY OVERDRIVE — REAL 240Hz EXPERIMENTAL HOLD

## Intent

Improve sense of speed primarily through genuine longitudinal velocity and **much stronger steerable lateral velocity**, rather than narrowing the verified P100 physical road. User preferred stronger lateral response than the previously proposed 2.5x.

## Executed candidate

- Branch `p101-velocity-overdrive-native-trial`, derived from merged and frozen P100 main.
- New `VB-P101` stage is a cloned 7/7 B48 collidable, rideable P100 S-bend/height/bank layout with the same 12 B51-C moving hazards. Original P100/P99, P62 SHA and native B48 physics files unchanged.
- Physical acceleration adapter `web/p101-overdrive.mjs` applies ADDITIVE, frame-rate-independent impulse to runner velocity **at each 240Hz step BEFORE** standard B48 physics and native continuous collision detection. This is *not* faking HUD speed, setting final poses, bypassing machine collisions or changing camera follow; all native contact constraints remain.
- Presets: RAPID 4.0x lateral / +5.5m/s² forward; OVERDRIVE **4.8x** lateral / +7.5m/s² forward; HYPER **6.0x** lateral / +9.5m/s² forward. Airborne lateral boost 3.0 / 3.7 / 4.5x respectively. Forward extra is always positive; no artificial braking, speed cap, force reset or teleport.
- Profile only active on VB-P101 manual play. No P101 spectator auto-finish or practice shortcuts until proven by independent 240Hz and human driving. Follows unchanged score priority (95%+ survival) and ball-relative camera.
- Native probe logs actual failures and peak speeds for all three presets. **Automated native finish is neither required nor claimed in this first exploration**: road radius and hazard anticipation might need optimization if going 200+ m/s.
- The crucial next phase is physics QA of 30m lateral displacement, reversal, curves, airborne landing, full-course traversal, hazards and real Windows/mobile FPS; optimize responsiveness without falsifying obstacle difficulty, moving to staging only after real QA gates.

## Safety gates

**P101 is independent / GitHub PR DRAFT; no merge, no GitHub Pages publish, no production site modification.** Any quality regression holds the PR. No heavy Work mode was used.

## First native truth (PR #46)
The initial genuine 240Hz test showed acceleration and side control really work but the old P100 steering QA policy is too aggressive / not fast enough: RAPID peak 223.99m/s, side 37.11m/s, fall 19.475s after 3 roads; OVERDRIVE peak 201.08m/s, side 32.63m/s, fall 11.758s after 2 roads; HYPER peak 278.83m/s, side 54.17m/s, fall 18.342s after 3 roads. **0/3 7-road finishes.** No success claims. Next read-only native study scales the QA steering to avoid overreaction and varies read-ahead. The actual human manual input is not reduced; preset 4x/4.8x/6x are maintained. Experimental visual warning strips move to 690/470/240m (P101 only), because at 225m/s a 400m warning gives under 1.8s. No B48 physics, P100 geometry or machine changes.

## Phase B: actual course tangent handling (P101 only, under QA)

Native profiles exceeded 200m/s but repeatedly left the giant hairpin even when six different QA steering input scalings were tested (0/6 finishes). The B48 native auto-forward rotation previews only ~12m. At speeds approaching 200m/s, this is under 0.1 seconds. P101 now tests a **bounded course-tangent orientation preview** drawn only from the current real collidable Catmull-Rom road surface: forward direction interpolates toward ~0.22s farther around the actual road, maximum preview 76m, maximum yaw 1.75rad/s. It does not alter position, speed, obstacle avoidance, lateral input or collision; the native B48 240Hz step still resolves the actual trajectory. Does not activate while airborne or off the road. If this cannot restore safe high-speed bends, Phase B must instead adjust only P101's real track geometry (radius, camber, transition), not secretly auto-place the ball or certify human fairness. Independent 240Hz and Chromium tests are mandatory. 

## Phase B1 rejected from physical evidence

Commit `3ccc15c0` speed-responsive *automatic yaw preview* was a negative result: several profiles decelerated to 65–110m/s while still failing to complete the course, compared to actual P101 B1 previous 201–279m/s. It is **reverted**, not merged or deemed an improvement. P101 keeps standard B48 forward handling and restores the real added acceleration and 4–6x lateral control. The P101-only UI selector visibility bug identified in Chromium 39110335063 is separately fixed with an explicit [hidden] CSS rule. New Phase B2 measures 240Hz curve survivability at increasing *additive* forward accelerations (no hidden braking or speed resets) to quantify the safe continuous range; manual default physics is unchanged until a truly usable configuration is established.

## Phase B2 / measured native safe-speed boundary (2026-10-18)
The six *real* 240Hz cases showed near-soft/early-soft with zero extra forward acceleration can keep strong 4.8x manual lateral authority, and **early-soft FINISHED 7/7 in 39.792s at 136.50m/s peak**, with all native original machine colliders active. However **0.30 extraForward** failed on SCISSOR RISE at 21.425s with peak 169.45m/s, and **0.60** failed at 19.829s with peak 204.64m/s. Full constant power failed during CROWN REVERSAL at 12.375s (204.15m/s peak). Therefore 4.8x lateral force is not inherently the cause; *earlier high-speed cornering on this P100 geometry* is the blocker. The zero-extra run is NOT a satisfactory fast final game; it is only a proof of physics baseline.

## Phase B3 / genuinely accelerating late-surging trial (not approved)
An opt-in **test-only** B3 law allocates positive additional acceleration to physical chapters V / VI / VII, smoothly and monotonically, while I–IV keep native B48 slight ongoing acceleration. Its moderate / balanced / aggressive modes never brake, hard-cap, teleport, warp the camera, alter lateral control, or rewrite P100 geometry. This probes whether the final wide highway can genuinely reach 180–220m/s *without* failing early 180-degree U turns. If all trials fail, next task is a redesigned P101-only true B48 high-radius road, not a dishonest completion claim. Default manual P101 preset still uses the original full acceleration pending independent native and human acceptance.

## Phase B4 — real physical high-radius geometry (new branch-only candidate)
B2/B3 evidence shows native acceleration alone cannot hold 155–205m/s around the physically tight P100 U-bends. This phase edits **only the P101 B48 collidable 31x5 control-point lattices** rather than changing speed readout, hiding obstacles, teleports or auto-steering. Exterior smooth turn-envelope displacements: section II +115m, III +35m, IV +125m, V +80m, VI +48m, VII +38m with additional actual B48 bank roll 4–9m across half-width. Section I is unchanged to preserve the big initial natural dive. Endpoints of every chapter remain byte-identical to frozen P100 and envelope derivative goes to zero at both ends. Preserve the 7-chapter macro structure, high-altitude course, real S-bends, natural jumps, wide physical corridor, constant slight acceleration and fixed-relative camera.

All twelve existing B51-C machine types, collision modes, sizes, timing phases, periods and identities remain; P101-only positions and slider side axes are reanchored to their *real new* section/surface tangents and same original lateral offsets. No machine disabled or removed. The original P100 coordinates and obstacles remain exactly untouched.

Measured result and curvature profile from `scripts/p101-b4-road-proof.mjs` are **required before assuming any improvement**. Source QA script probes five independent authentic 240Hz cases and reports earlier failures alongside gains; reject the whole candidate if invalid topology, machine attachment, 2000m coordinate limits or regressions. The planned subsequent review is road visual screenshots plus user hands-on driving, not automated scripted-finish as a proxy for human fairness. Staging and production remain unchanged.

## Direction and efficiency audit
1. **True objective:** make the ball visibly much faster and **retain 4.8–6× lateral player control**, not narrow the road or replace 3D geometry with HUD tricks.
2. **Course evolution:** preserve enormous real U-turns, elevation and architecture while reducing real curvature dynamically, and keep meaningful moving obstacles.
3. **Protection:** P62/P66/P93/P99/P100, B48/B51-C core, survival-priority score, camera relative lock, natural jump and both chatgpt.site production URLs are immutable.
4. **Evidence:** early pilot high-speed failures, B1 rejected yaw patch, B2 0% extra true 7/7 at 136.5m/s, B3 all 3 native failures at 155–174m/s are reported honestly. 200m/s high-radius success remains UNPROVEN until latest native QA.
5. **Delivery:** one batch 7-surface B4 physical design plus full 240Hz differential probe, Draft PR #46 only, no Work handoff, no automatic production promotion.

## B4 native results — first exterior hairpin candidate REJECTED
Actions run `39114135528` QA 142/142 PASS (core correctness) but the full-course TRUE B48 physical trial failed in all 5 variants in section II: control/no-added-thrust 14.908s peak 128.49m/s, LOW .30 13.050s peak 148.50m/s, MID .60 11.067s peak 167.07m/s, FULL 10.146s peak 185.19m/s, near-full 10.104s peak 185.01m/s. There is NO P101 full-course proof. Native curve audit showed II p10 curvature radius 160.38→202.95m, IV 142.4→186.79m and V 105.39→134.99m (on sampled .10–.90 interval), but this failed real rideability. It exposes the risk of optimizing just one geometric statistic and ignoring the curve's entrance; the earlier B4 must NOT be promoted.

## B4C correction — real smooth shoulders, improved audit
For the same independent P101 physical road candidate, replace the turn expansion window from sin²(pi*u) to sin⁴(pi*u), while keeping the first TWO and last TWO B48 control rows exactly as P100. This makes the first deformable row shift <0.3m instead of ~5m on the 115m-arc expansion, reducing abrupt Catmull–Rom curvature knees and preserving actual tangent continuity. The measured turn-radius audit now includes entry/exit (u=.02 to .98) with separate worst-entry/worst-exit values. This is a falsifiable physics experiment, not a claim of a safe curve. Re-run the same true-240Hz, hazard-enabled, full seven-section tests; HOLD any claim until success.

## B4C rejection — 143 core tests passed but 0/5 native 7/7 
The sin⁴ smooth-shoulder variant did not recover the original B48/P100 continuous road-play: B4C control/no added thrust failed in original section II after 14.262s, peak 128.12m/s; +30% failed 12.450s, +60% 10.933s, +100% 10.321s, near-target 10.354s. No 7/7 completion. Real curvature metrics changed, including a decrease in section VI, so curvature-only improvements are not a gameplay approval.

## Phase B4D one-batch causal isolation
Instead of another unproven large geometry mutation, introduce per-section intensity for the exact same real B48 31x5 P101 road lattice and reanchor original 12 B51-C machines ONLY where the physical road changes. Weight zero is mathematically the original physical P100 mesh and ORIGINAL machine axes/positions, which provides a solid A/B baseline with no confound. Eight authentic 240Hz scenarios: exact P100 geometry, II-only 0.15/0.3/0.5/1.0, late-only 0.25, early .15, and hybrid early .15 + late .25. All use early-soft correctly scaled for still-available 4.8× player manual side power; extra-forward set zero on this **geometry-only** isolation, explicitly NOT presented as the finished high-speed mode. Once geometry preserving 7/7 is identified, repeat at genuine extra-forward thrust with all 12 machine threats. The P101 production candidate remains HOLD and inherited P100 stays immutable.
