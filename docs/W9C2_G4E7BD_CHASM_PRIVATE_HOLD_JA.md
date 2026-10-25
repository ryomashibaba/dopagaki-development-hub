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
