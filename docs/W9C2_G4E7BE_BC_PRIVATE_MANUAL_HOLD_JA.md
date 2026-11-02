# G4E-7BE — BC rollDeck PRIVATE actual browser + manual controls QA
2026-10-25 JST.

This phase introduces **zero geometry promotion** and no gameplay physics/steering edits. Preserves BC rollDeck (best unpromoted benchmark, u=.60434/.60473), rejected BD, AY, Gold and both production sites. Browser testing: localhost http://127.0.0.1:4373/drive3d/?g4e7al=manual&g4e7be=roll-deck ; Windows one-step RUN_G4E7BE_MANUAL.cmd.

Only private build with DOPAGAKI_G4E7BE_VISUAL=1 may emit two genuine BC rollDeck second-road JSON variants, each 7 real B48 road colliders, 28 moving B51-C and real gap cell52. Public/public-safe never emit. Record IDs and ancestry (BC→AY→AX→AV→AT→AS→AP→AJ) are validated. Existing proven AL UI uses actual manual A/D, start00, OVERDRIVE, 240Hz, JSON exports from result and in-flight, without P96 scripted steering or automatic upload. BE candidate label and report researchBCRealContour are private-only and do not suggest human certification.

In this turn test gates: browser real WebGL Chrome test, both road variants, A/D, direct download, gate/provenance, gold unaffected and both public build exclusions. **No human tester has yet played.** User-feedback perception / visual arts stay HOLD, launch/ready/merge HOLD. Formal Slope2 approved 0m.

## Initial verified CI / clean rerun distinction
- Initial BE workflow https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40148317936 completed SUCCESS with node unit tests 2/2 and private 110-file build containing both genuine BC candidate JSONs.
- Playwright Chrome tests: first native A/D comparison test **FLAKY** (second-road press occurred before distinct stage was confirmed ready; first attempt failed expecting final 2/2 text; retry passed). Gate-only test passed. Therefore **do not claim an unconditional clean 2/2 WebGL pass**.
- The public full build (109 files) and public-safe (5 files) both passed, and both had ZERO BC experimental real-road JSON even with DOPAGAKI_G4E7BE_VISUAL=1.
- Evidence artifact: https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40148317936/artifacts/12582505058 (browser screenshots, JSON and retry artifacts; not inspected for art quality).
- BE fix adds canvas data-g4e7be-loaded-road keyed to the genuine loaded BC stage's road rather than merely stage selector/mode. Playwright waits on loaded pinch-switch ID AND manual mode before A/D. Clean validation workflow https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40148567626 is **SUCCESS**. Native BC unit/guard tests PASS; stage private build PASS; authentic Chromium WebGL 2/2 tests PASS on the first attempt, **zero retries**; both public modes again exclude all real BC rollDeck stage JSON even with its env enabled. GitHub log shows 2 passed (15.0s), no flaky. Evidence artifact https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40148567626/artifacts/12581526918. Screenshots are present but aesthetic quality is UNASSESSED.

Human manual tester observations absent. No WebGL screenshots' aesthetic merits have been approved, no deployment/PR merge/Ready, Slope2 approved 0m.
