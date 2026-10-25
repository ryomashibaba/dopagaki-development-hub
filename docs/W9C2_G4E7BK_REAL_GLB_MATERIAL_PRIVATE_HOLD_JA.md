# G4E-7BK — Real GLB2 material/lighting proof for private 240Hz BC stage

Date: 2026-10-25 JST. Branch `p101-velocity-overdrive-native-trial` and **Draft PR #46**, never merge or deploy by default.

## Why BK differs from rejected BF, BH, BI and BJ

Prior art attempts repeatedly make simple flat-shaded colored scaffold geometry. They fail by being opaque walls, sparse overhead skyline sticks, or busy overlapping ribbons despite native physical accuracy. BJ finally placed 600–2200 visible triangles in actual 110–126m/s camera views, but the result visually resembled unfinished scaffolding; ART REJECT.

**G4E-7BK is a technical and sculptural pipeline experiment, NOT automatically a visual-quality success.** It replaces ad hoc in-runtime vertex-color city meshes with:
- A complete **binary glTF2 (.glb)** asset compiled from the exact unpublished BC road2 WORLD coordinates, separately for TRUE and SWITCH.
- Source-authored one continuous **HOLLOW CONTINENT** megastructure, two heavily folded faulted asymmetrical ceramic/titanium shells with real excavations, recessed habitable terrace ribbons, deep 3D understructure, repeating but sparse window micro-accents and separate energy conduits.
- Real per-triangle **POSITION + NORMAL** accessors and 6 separate glTF standard metallic/roughness/emissive materials (ceramic, titanium, architectural dark glass, warm windows, cyan energy, dark underside). **Geometry is scripted-authored in the first version, not a hand-sculpted Blender scene**; GLB asset support is merely the bridge to later Blender/GLB or more deeply modelled exterior architecture, not the end goal.
- Separate **lit material shader** in `web/p101-w9c2-g4e7bk-lit-glb.mjs`, preserving old production vertex-color shader/roads and physically meaningful distance fog. Directional/bounce/hemisphere, specular from metallic/roughness and emissive windows. Not yet a fully compliant physically based renderer or textured glTF feature set, and it rejects unsupported glTF extras rather than silently misrendering them.
- Only the PRIVATE approved path loads BK `g4e7bk=lit-glb` and `g4e7al=manual&g4e7be=roll-deck`. Test same physical state with existing nonhuman native BG `g4e7bg=inspect&g4e7bgFrame=hold&g4e7bgPoint=t1850`; SWITCH adds `g4e7bgRoad=pinch-switch`. Old BJ is separate rejected comparator. No camera physics manipulation and no extra B48 surfaces.
- Binary GLBs generated ONLY when `DOPAGAKI_G4E7BK_VISUAL=1` + `DOPAGAKI_G4E7BE_VISUAL=1` AND build=private. Public and public-safe builds MUST exclude both BK GLB assets, all experimental BC JSON, and BG camera proof. Normal mode contains neither custom scene nor asset, main and gold are never changed.
- Native automated test checks GLB2 header, real BIN, normals, six materials, geometry validity, source stage identity, mutation-free 7 real B48 roads, 28 real B51-C dynamic objects and gap52. Chrome Playwright captures actual identical 122.936mps TRUE and 112–126mps SWITCH with BJ vs BK. Human keyboard A/D and gameover-compatible direct local JSON never relabeled as scripted P96.

## Quality gates and limits
Never claim that passing a GLB file format, shader build, vertex count, test screenshot capture, or real projection area means “beautiful”. Check actual Chrome saved screenshots for coherent large inhabited architecture, perceivable depth and material hierarchy, clean sky negatives, stable fast road hazard visibility. If BK still looks like a disconnected procedural collage, ART REJECT again and prioritize actual designed asset production (e.g. Blender) over the old microprocedural repetition. Do not use ImageGen as a substitute for executable GLB.

CI initially triggered at [40159691780](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40159691780); it was queued when this document was written, so its results and images still require actual verification. Until an actual human trial and art review: **official Slope2 0m; Human HOLD, Art HOLD, Publish HOLD, PR Ready HOLD, Merge HOLD**.

## Efficiency
One isolated author module, one isolated GPU loader/renderer, one dedicated native/Chromium CI; core drive/build integrated once. Iterate future scene contents in the author module, not dozens of unrelated legacy giant workflows. Repo PROJECT_STATE.md is the permanent handoff, no new user ZIP or CMD routine.
