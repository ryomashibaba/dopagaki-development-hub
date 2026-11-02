# G4E-7BB — Evidence-first native 3D vector diagnosis (PRIVATE / PENDING)

Date: 2026-10-25 JST. Baseline: AY bankedSweep / rejected BA outerContour, both true-pinch and pinch-switch.

Goal: do not repeat unsupported lateral offset designs after BA (all u≈.31-.32, AY max grounded u=.35576/.37595). Instrument **original native 240Hz** start00 nonhuman physics. It is read-only; no P96, physics, course, camera, release, player controls or production assets are changed.

## Exact measures
Per sampled state near second B48 u=.20-.55: complete ball velocity vector and position, local 3D road tangent, surface normal and pitch, horizontal heading error, signed transverse speed, height above ribbon, body radius-aware road edge margin, geometric curvature and kinematic v²κ **estimate**. Sampled state only: engine's grounded flag may lag actual post-integration contact by one step; compensate interpretation using consecutive support sequences and recorded contact transitions. Flag sustained air >0.12s rather than treating a single air frame as irrecoverable. Per run also last-supported u (not terminal fall u), 7-road reach, native collision counts, actual steering and bounded physics speed.

Native runner has an existing heading-preview assist flag in its own physics; **BB only reads it** and does not enable/change it. The fixed P96 profile remains exactly 'early-soft'/4.8 as in AY/AZ/BA. This is not human QA. The v²κ scalar is a geometric curvature acceleration *estimate*, not a direct required input or proof of insufficient steering.

## Gate
BB diagnostics workflow to attach JSON plus concise summary (pending).
Make a new genuine B48 road candidate only after attributing normal separation / cross-track motion / curvature with observed evidence; no speculative width patches, speed resets, magnets or invisible support.
Formal Slope2 distance remains 0m. AY benchmark (not promoted). Human QA HOLD; art/WebGL HOLD; publication/PR Ready/merge HOLD.

## Observed results (completed)
[CI #40143385126](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40143385126) SUCCESS. Four original physical start00 runs (AY and BA outerContour in both modes) captured normal velocity, road-bank normal-Y, signed heading/curvature, contact transitions and sustained-air intervals. The first unsupported sample is NOT always the unrecoverable event; AY temporarily leaves/recontacts at u≈.21 and u≈.23. AY TRUE terminal sustained loss starts u=.357807 (margin+.932m, normal velocity+.809m/s); BA TRUE starts u=.323928 (margin+7.299m, normal velocity+1.172m/s). Fixed steering, no body/collider edits. This evidence informed BC bank-relief physical construction, which then improved max supported road 2 u to around .604 on both road modes. BB remains a diagnostic tool, not an approved course.
