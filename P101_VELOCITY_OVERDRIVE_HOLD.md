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
