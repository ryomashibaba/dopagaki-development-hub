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
