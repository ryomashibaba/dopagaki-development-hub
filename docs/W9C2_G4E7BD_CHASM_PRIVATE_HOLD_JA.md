# G4E-7BD — Authentic CHASM entrance departure diagnosis (2026-10-25 JST)

Reason: BC rollDeck native 240Hz reached max supported road2 u=.604337/.604734; still only 2 of 7 roads, physical fall near CHASM. Do not infer the root cause from terminal survival.
This audit samples road2 u=.47-.86 and tracks 3D body position, native ground contacts, heading error, lateral/normal velocity, bank, curvature, width, and sustained-air episodes, using identical P96 fixed steering and actual start00 Runner/OVERDRIVE, compared to preserved historical AY. Source physics/rendering untouched.

Status at initial commit: PENDING CI. No approved design modifications; no hidden support/auto steering. Next physical geometry candidate must be justified by the native trajectory. Slope2 formal=0m, human/art/public/PR Ready/merge HOLD.

## BD actual 240Hz diagnosis complete — https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40147227909

Native CI SUCCESS. Actual BC rollDeck TRUE/SWITCH:
- First late natural airborne interval from u=.55786/.55794 at t=16.483/16.321, 0.338s/0.358s; genuine landing at u=.58238/.58401 while left/right edge margin still +11.37m/+10.55m.
- Irrecoverable second departure starts u=.604617/.605015, edge margin -0.970m/-0.936m; heading error only ~-0.31°/-0.025° at exit and road-normal velocity negative. This is an actual border exit, rather than another vertically separated centerline event.
- Existing road width collapses from ~85.9m at u=.53 to ~33.97m at u=.60, ~20.19m at u=.62 and 13.93m at u=.64, with curvature ~24.3° per 100m near u=.64 and downhill pitch near -10.5° at u=.62. The speed is ~112m/s. A long-radius, genuine physical narrowing/3D ribbon rather than a widened safety floor is the next justified prototype.

Do not claim that this deterministic P96 line is achievable or interesting for a human. Approved Slope2=0m. Human/Art/Publish remain HOLD.

## Full corridor real-machine accounting
The actual amended interval extends to u=26/30=.8667 and includes THREE native moving B51-C stations: p95-hazard-02 u=.57, a13-machine-04 u=.69, p95-hazard-03 u=.84. All three must be position/yaw/motion reanchored to the new B48; other 25 frozen. Do not weaken collision coverage or narrow-corridor asserts to pass CI. The first CI failed because its assertion incorrectly assumed two movers despite the full corridor; the observed three real machines are the correct count.

## Completed 240Hz comparison — technical SUCCESS / playability REJECT

Native 240Hz real start00 fixed P96 controls in both real roads: https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40147558159
Structure and authentic simulations PASS; both actual BD road designs fall earlier than BC.

| Design | TRUE max supported road2 u | SWITCH max supported road2 u | TRUE / SWITCH survival s |
|---|---:|---:|---|
| AY bankedSweep historical control | .35751 | .37892 | 16.59167 / 16.65417 |
| BC rollDeck best PRIVATE baseline | .60434 | .60473 | 19.58333 / 19.41250 |
| BD longArc | .59439 | .41916 | 19.52083 / 17.35417 |
| BD descentSweep | .59267 | .45012 | 19.45833 / 15.05833 |

All remain 2/7 real roads, native moving contacts=0; one fatal static contact on BD descentSweep SWITCH. Both BD options are **REJECTED** for actual grounded progress in both road modes; never interpret CI PASS as playable.

The changed real second-road guide can influence P96 early steering before the edited geometry. Especially SWITCH degradation by u=.42–.45 does not establish that local u>.50 pavement collision alone is responsible. Future work must isolate guide/input vs native collider contact.

Within changed physical interval u=.50–.867 there are three real B51 objects: p95-hazard-02 (.57), a13-machine-04 (.69), p95-hazard-03 (.84). All three are reanchored. The other 25 are untouched, all 28 retained. Initial CI failure was an incorrect test count; corrected CI confirms actual protected geometry and genuine physics.

BC rollDeck stays best **unpromoted** research benchmark. Next BE should favor real PRIVATE WebGL view/human driving and quantitative P96 guide divergence, not repeat blind XY offset shifts. No Slope2 formal approval (0m), human/art/public/PR Ready/merge all HOLD.
