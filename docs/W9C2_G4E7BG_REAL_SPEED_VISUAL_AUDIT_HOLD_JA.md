# G4E-7BG — BC real 240Hz high-speed visual audit (PRIVATE)

## Motivation and evidence baseline
G4E-7BF native Chrome physical/WebGL CI 40153126707 SUCCESS: unit geometry/Chrome/isolated public builds green. Examined actual artifact 12583661590 (TRUE initial, SWITCH initial, and default city control). Early 52m/s view is predominantly enormous flat DARK WALL silhouettes; unlike a spectacular habitable ultra-futuristic megacity. **Art review: REJECT/HOLD** even though technical CI succeeded. The screenshots show 52m/s at a broad road start, not the actual 100+ m/s CHASM, so they cannot evaluate high-speed fairness or compelling sky depth.

## This phase
Rather than adjusting another 0.1–1m B48 road or adding box-like structures, independently generate THREE READ-ONLY camera states at 15.0s / 17.0s / 18.5s from the **same frozen BC rollDeck REAL start00 native 240Hz** trajectories for both TRUE and SWITCH. Source is existing P96 early-soft /4.8 only; not human A/D. Actual measured pose, ball-relative camera yaw, moving B51 object pose time, 52m/s original start, collision/B48/gap values come from the real physics sample. No checkpoint teleport, fake road, speed reset, aim assist, camera auto-withdrawal or gameplay changes.

PRIVATE gate `DOPAGAKI_G4E7BG_VISUAL=1` AND `DOPAGAKI_G4E7BE_VISUAL=1` only. Read-only pages, for each exact `g4e7bgPoint=t1500|t1700|t1850`:
- default true baseline `http://127.0.0.1:4373/drive3d/?g4e7al=manual&g4e7be=roll-deck&g4e7bg=inspect&g4e7bgFrame=hold&g4e7bgPoint=t1850`
- BF art variant add `&g4e7bf=sky-fracture` (no gameplay effect).
- Switch by explicit stage? Existing manual stage menu is locked; for SWITCH inspect via new explicit read-only `g4e7bgRoad=pinch-switch` only where validated in test.

HOLD displays sourced actual native P96 frame at the same 18.5s, HUD labels it SCRIPTED FRAME, disables manual panel, pause/retry/race records. This does not masquerade as human control. Public and public-safe builds do not include native BG JSON, even if env flags are set.

Objective: true high-speed baseline/BF real WebGL screenshot comparison (not only geometry stats), inspect road legibility, architecture depth and forward/side visual occlusion. Reject BF as final if all it offers is dark corridor walls; no formal art approval until human camera QA. Officially approved Slope2=0m, Human=HOLD, Art=HOLD, Publish/PR Ready/Merge=HOLD.

## Final verified CI / comparative human-visible still assessment (2026-10-25 JST)
- BG workflow [40154087436](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40154087436): **SUCCESS**. Authentic 240Hz start00 BC native frame unit 1/1 PASS, Chromium Playwright **3/3 PASS first attempt (10.0s), no flaky retries**, PRIVATE build 112 files, public build 110 files, public-safe build 5 files; public/public-safe both exclude experimental BG/BC JSON even when environment variables are set.
- Original Chrome screenshots are GitHub artifact [12584250768](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40154087436/artifacts/12584250768); filenames: `g4e7bg-BC-real-18s5-original-wall-WebGL.png`, `g4e7bg-BC-real-18s5-fracture-WebGL.png`, `g4e7bg-switch-t1700-real240Hz-WebGL.png`, `g4e7bg-switch-t1850-real240Hz-WebGL.png`.
- Both TRUE snapshots at t=18.5 have exact same native camera and **122.9 m/s**; BG SWITCH snapshots show **112.2 m/s** at 17.0s and **125.8 m/s** at 18.5s. The screenshot HUD flags simulation 240Hz but this is **P96-scripted observed frame, never manual game performance or human approval**.
- Direct image review: baseline at 122.9 m/s shows repetitive oversized upright bars and geometric frame clutter. BF candidate at the exact identical pose replaces them with large solid **near-black curtain/wall silhouettes**, with little convincing depth, distinct inhabited city massing or opening visibility. At SWITCH 112–126m/s, road continuation is difficult to discern, black occlusion dominates a large fraction of the upper view; the ball's relationship to the next road is hard to read. **Reject the current BF art hypothesis**; the genuine Chromium and 240Hz engineering tests still PASS. This is not a formal quantitative player legibility score and human QA is still HOLD. No claim that BF is better.
- Strategic corrective direction: do not repeat dense dark walls or add larger cylinders/cuboids. For next BH, redesign the GPU skyline by maximizing clear negative sky (real missing triangles, not just cosmetic darkness), separated high-contrast positive silhouettes and layered suspended districts with visibly functional links; preserve deep road horizon and hazard sightlines at 110–126m/s. A/B against the exact BG native stills **before** refining micro-details. Keep physical lane changes separate from the purely artistic hypothesis.

**Current state: BG engineering PASS, BF visual hypothesis REJECT, human/overall ART formal certification HOLD, official Slope2 0m, no promotion or deployment.**
