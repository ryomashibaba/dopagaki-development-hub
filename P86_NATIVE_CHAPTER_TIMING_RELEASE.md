# P86 — NATIVE 240Hz SECTOR TIMING

Date: 2026-10-17 JST. User-facing 3D game improvement; **no physical engine or course geometry edits**.

## Playable feature
- Exact eight-sector split timing derived on **each original 240Hz B48 Runner step**, based only on the contacted physical road surface `PIPE / HALO / SPIRAL / FORK / REJOIN / MACHINES / LAUNCH / LAND`.
- The live HUD shows current chapter time, saved fastest time for that exact stage+starting spawn, and three most recent sector completions. A subtle two-second toast announces a valid chapter crossing and personal best.
- Real progress through the alternate left/right fork maps to the same one fork sector; no invented checkpoint order, per-frame wall-clock interpolation, automatic physics assistance, or teleport.
- Local per-sector records are saved **only on genuinely manual runs**, isolated by stage and spawn. Quicker physical sector time wins. Spectator replay and practice chapter takeover never write competitive split records. Practice timing starts at actual Runner handover time, excluding earlier automated seek.
- Failed runs do not get credit for the unfinished sector; native finishes complete the final LAND sector. Pause freezes the 240Hz clock, so the timing display remains stable.
- The underlying P75 primary score remains 95%+ survival based, with no extra split bonuses.

## Nonnegotiable preserved assets
- B45/B48/B51-C native code, 23 true collision road segments, P76 hairpin, P77 accepted native spawn00 83s FINISH, six moving machines, 25m unassisted gap, P78/P79 replay/practice and the P85 enhanced ball remain unchanged.
- Four original P62 stage SHA files remain frozen. Sector HUD is disabled for them.
- Dedicated physics chat PR #1 at `dopagaki-track-director-cloud` remains **Draft/HOLD** (now P86 profiler phase), and no candidate physical code is integrated.

## Verification
- Node: genuine complete 83s original Runner/Demo route produces exactly eight valid sector splits in order. Synthetic road passes check midpoint, bank/fork grouping, airborne last-surface, pause, skipped/failed route and chapter-start practice takeover. Per-stage/spawn record isolation, corrupted/denied storage and faster-is-better are covered.
- Chromium: real WebGL2 3D route displays PIPE, spectator physically reaches HALO, splits appear and NO personal record is saved. Taking control enters practice with zero new split elapsed, while a frozen P62 stage hides the sector HUD.
- Requires PR and main **QA, Chromium, Pages publish and live HTTP SHA verification** for actual P86 commit.

**Limitations:** An 83-second autonomous accepted script is not proof that a human can play the complete route. Subjective responsiveness, high-speed corner feel and real hardware FPS still require evaluation; the separately developed physics upgrade must pass its own gates.
