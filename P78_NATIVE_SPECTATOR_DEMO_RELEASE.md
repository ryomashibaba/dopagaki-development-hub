# P78 — Full Native Route Spectator Demo

## Actual game value
The user can now explicitly choose **全編デモを見る（自動操舵）** in the existing public 3D Drive Lab. The demonstration starts at spawn00 and replays the P77 native 240Hz verified driver inputs through the true 520m return hairpin, 450-degree spiral, fork, six real moving machines, 25m natural gap and final touchdown. No video cuts, teleports, collision bypasses, injected positions or physics-force hacks. A speed selector provides 1× or 2× presentation time, still stepping native B48 fixed DT. Camera and collision visuals remain real.

## Separate spectator / manual policy
- Mode banner says **観戦専用デモ · 自動操舵 · 自己ベスト対象外**. Automatic steering occurs only in this explicitly selected spectator mode, never in manual runs.
- P75 personal-best storage is guarded: demo finishes and demo failures display a separate spectator result and can NEVER call `storeBest`.
- Stop demo to restart in manual control; stage switching and changing spawn also exit demo. The demonstrator is disabled on all four frozen P62 stages.
- The script is a deterministic sequence of steering inputs taken from P77's accepted native test. The user cannot substitute this for winning a personal record or call it human driving success.
- P62 SHA-frozen source, P69–P77 existing B48/B51-C physics and actual 23 collision road sections, P74 NEAR MISS, P75 scoring, P71 stable camera and P72 fixed-step physics remain untouched.

## Acceptance
- New mandatory original-native Runner 240Hz P78 replay must actually finish ~83.21 seconds, traverse all six spiral road sections, both RETURN surfaces, right fork, machine gauntlet, natural jump and landing, with zero collision/failure events.
- Chromium must prove demo is opt-in, isolated from the local-record store, uses spawn00, shows spectator label, allows 1×/2× and returns to standard manual control with stage-specific eligibility.
- Existing P77 full-run and P62/fork/jump/GUI tests remain mandatory.
- Main Pages deployment must pass QA/browser/publish/verify-public and exact HTTP SHA/P78 metadata.

## Explicit limitations
This is an experimental demonstration **not a 100% human-playable route certification**. Input timing is tuned to current B48 baseline and may not work with an eventual separately approved physics upgrade. The physics chat's PR #1 is still Draft/HOLD, and cannot be incorporated without independent integration tests.
