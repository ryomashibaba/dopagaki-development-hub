# G4E-7BA — LEFT CATCHMENT / PRIVATE REJECT (2026-10-25 JST)

## Source / physical implementation
BA forks AY bankedSweep to sculpt B48 road 2, rows 8–18 (u=.267–.600), with actual 9m or 13m lateral catchment and banking: outerContour and cliffBowl. Real 14–16m CROWN and CHASM cores, 7 original B48 roads, gap cell52, all 28 native B51-C (2 real reanchors) stay present. Actual 240Hz engine/controls and downstream courses protected. There are no hidden floors or auto-steering corrections.

AZ longGlide established left edge egress at about 100m/s, u=.353–.355; moving contacts zero. Leftward structural catchment was a design hypothesis, not an established cause-specific remedy.

## Native comparison: https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40142666494
Run SUCCESS: geometry tests PASS, start00 fixed P96 240Hz telemetry PASS, physical racing performance FAIL. Measurements are native nonhuman, NOT manual skill/fairness.

| Design | TRUE-PINCH max grounded road2 u | PINCH-SWITCH max grounded road2 u | Survival TRUE/PINCH seconds |
|---|---:|---:|---|
| AY bankedSweep (benchmark) | 0.35576 | 0.37595 | 16.59167 / 16.65417 |
| AZ longGlide | 0.35338 | 0.35523 | 16.79583 / 16.70833 |
| BA outerContour | 0.32110 | 0.32342 | 16.02083 / 15.87500 |
| BA cliffBowl | 0.31084 | 0.31270 | 15.79583 / 15.60417 |

All reached only 2/7 physical roads; moving contacts 0; static fatal contacts 0; final failure: fell off the track. BA starts losing dependable road2 contact around u≈.29–.32 and reduces maximal contact progress in both modes.

## Decision / next principle
**Both BA layouts REJECT as playing improvements; preserve code as PRIVATE evidence, never promote. AY still best unadopted physics benchmark.** CI assertions alone do not establish game quality. Formal Slope2 approved metres: 0. Human QA HOLD; art/WebGL QA HOLD; production, PR Ready, merge HOLD.

The next course design must not repeat arbitrary sign/magnitude lane shifts. Capture runner 3D position, velocity vector, road tangent/normal and timestamps around u=.25–.40 to distinguish natural airborne path from geometric turning, longitudinal elevation and scripted avoidance input. Then prototype a complete human-legible genuine CROWN→CHASM section and compare on actual max grounded progress in both modes.
