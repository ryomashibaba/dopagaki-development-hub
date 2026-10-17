# P79 — Native 240Hz chapter practice + live spectator takeover

2026-10-17 JST. Experimental game-play update, not a change to the B48 physical engine.

## Player features
- Select one of seven chapters: full-size 180° HALO RETURN, 450° spiral exit, fork entrance, actual fork rejoin, moving machine chamber, genuine no-boost jump launch, genuine landing.
- Press **指定区間から練習（実物理）**: create a clean native B48 Runner at spawn00 and replay the same original P78 steering, processing in 96-physics-step chunks across browser animation frames. No teleport, checkpoint `resumeAt`, position injection, velocity forcing, mode-specific collision bypass, edited machine phase, or artificial physics assistance.
- At the very first actual *physical rideable surface contact* belonging to the chosen chapter, stop replaying steering and hand over that exact Runner state to normal A/D keys. Ball position, speed, world clock, moving obstacles and contact events are preserved.
- P78 all-course spectator gains a **今ここから自分で操作（練習）** button that hands over immediately without restarting or re-simulating.
- A distinct practice overlay labels non-competitive assistance honestly; changes to another stage exit practice; only P69–P79 experimental ECHO road offers the training feature.
- The seek itself is not credited as the player's survival time or NEAR MISS; from takeover, a fresh practice timer starts at zero. Player practice and spectator can NEVER write the P75 best record. Existing manual gameplay remains unaffected.

## QA release gates
- Mandatory Node test executes original 240Hz physics through all seven chapter targets (one true uninterrupted 83-second run), plus an additional bounded chunked real-physics seek to the machine chamber. It compares the exact position, velocity, time, forward vector, surface and event history to an independent original P78 Runner replay, then exercises actual manual steering on that state.
- Chromium must verify 7 chapters, actual HALO RETURN seek and subsequent manual control, spectator takeover at current world-time, practice exclusion from localStorage records, and disabling practice on 4 frozen P62 stages.
- P62 source SHA, P69–P78 route, six B51-C moving obstacles, the 25m physical gap, B45/B48 physics, P74 NEAR MISS and P75 score are not modified.
- Physics chat's independent PR #1 is Draft/HOLD and must not be incorporated without a new physical compatibility gate.
- Full 83s native scripted finish proven P77/P78 is NOT a human playfeel certification; P79 human success and high-FPS performance remain to be checked.

Release on PR QA+Chromium PASS, then merge and verify all main QA/browser/publish/HTTP SHA.
