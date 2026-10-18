# P97 — Physical-road hazard preview / Human readability quality gate

Date: 2026-10-18. Repo `ryomashibaba/dopagaki-development-hub`.
Source baseline: P96 main `d65da53f9066cf9e3db8183f2b077c82e456f2e3`.

## Why this next gameplay step exists

P96 proved one actual 240Hz scripted ordinary-input route across the original 3,990m VOID BREAKER trial with **12 enabled moving B51-C colliders, 7/7 road contacts, and 0 machine collisions** (39.904s on early-soft). That is a necessary, but not sufficient, proof of a challenging and enjoyable game. At native speeds around 100–140m/s, a warning at 220m can provide only ~1.6–2.2s of notice. Mere successful automation is not evidence that humans have time to look, decide and steer.

## P97 changes to the *actual player's visible road*

- Creates **36 world-space visual gates (three per each of 12 native obstacles)** on the correct **B48 rideable surfaces**, at true **400m, 270m, 140m road arc length** before each hazard — importantly *not* a straight 3D Euclidean line that can confuse vertically overlapping underpasses.
- Each physical-road cue has a **2.6m long, solid luminous road ribbon** reaching across much of the genuine track width, together with side-mounted vertical guide pylons and lines. All are built from the existing physical B48 `sample` and `frame`; rendered on a separate **noncolliding** WebGL VBO. No invisible safety surfaces or 3D collision edits.
- Machine color matches the exact native collider mode: red lethal, amber bounce, purple push. Wider warning and visual hierarchy at high speed; original P73 machine housing remains collision-fidelity-rendered from original B51-C poses.
- For VB-P95 ONLY, warning information is road-order-aware and shows **actual upcoming obstacle index, mode, approximate meters and seconds, and predicted moving-box position at estimated arrival**. Pose prediction invokes B51-C's own `movingObstaclePose` (never a duplicate formula). **Not** a left/right safe-route suggestion.
- HUD urgency levels **advance (400–270m), approaching (270–140m), immediate (140m and closer)** aid rapid interpretation. Other stages retain their original cues and have zero P97 geometry.
- P96 spectator, P94 human-unverified stage, P62 frozen 4 originals and P66/77 original race + PB stay unchanged. No new gameplay input assistance, speed reset, boosting or score modifications.

## Human-fairness measurement (quality not merely test count)

The `generated/P97_ROADPLAY_READABILITY.json` audit records the 12 true road-space station distances, the time between successive hazard stations at **130m/s reference speed**, any transitions below **1.7s**, 36 visible advance gates, and a 400m warning reference of **~3.08s** at 130m/s.

These are *estimated maximum notice windows*, not measured human reaction times or a proof that a particular left/right dodge is viable. Machine phase, visual occlusion, actual velocity, street-scale geometry, bank steering and surface fog can all reduce usable decision time. **Human fairness and playability remain HOLD / NOT_RUN**.

## Required QA gates before staging publication
1. Node: exactly 36 geometry gates, legal XYZ/RGB solids and lines, true route point registration, 12 authentic B51-C obstacles, mathematical timing, no P95 course mutation and P96 original native 7/7 completion unchanged.
2. Build/smoke: include source module + human-HOLD readability JSON; P62/66/94/95/96 provenance and checksums unchanged.
3. Browser: at P95 only, render 36 gates and show correct earlier warning; original P93/P62 have none; existing P96 12-hazard spectator still finishes in Chromium and PB is unchanged.
4. GitHub Pages: `main` SHA exactly matches deployed SHA, `verify-public` success. No completion claim before this.
5. **Human visual check still required**: test 400/270/140m visibility at operating speed, special bank turns, mobile, camera stability, physical avoidance fairness, eye-line occlusion and FPS. This last gate is NOT automatically satisfied by the other four.

**Production** remains `https://dopagaki-slope.sora-110029.chatgpt.site/` and is untouched. GitHub Pages is DEV/STAGING. Protected reproduction site is untouched. P97 physics specialist draft in separate repo is NOT merged. Work not used; no Windows user actions.
