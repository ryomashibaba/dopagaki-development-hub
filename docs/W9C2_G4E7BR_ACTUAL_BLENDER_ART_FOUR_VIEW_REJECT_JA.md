# G4E-7BR / G4E-7BS — ACTUAL BLENDER ART PRODUCTION & FOUR-VIEW REVIEW
**2026-10-25 JST — TECHNICAL PASS / PRIMARY-MEGACITY ART REJECT / HUMAN HOLD**

## Verifiable deliverables
- [G4E-7BR actual Blender CI #40168751293](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40168751293): **SUCCESS**; Blender 4.0.2 headless built the scene, saved the actual native `.blend`, exported binary glTF2 and rendered four independent actual Cycles camera PNGs.
- [G4E-7BS original native render checksum verification #40169047717](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40169047717): **SUCCESS**. ZIP artifact #12589286753 is temporary for transport, the below branch files are permanent.
- [Permanent PRIVATE art-original asset directory](../artifacts/private/g4e7br-fractured-tide-citadel): native `.blend` (2,574,624 bytes), original GLB (1,821,588 bytes), four 1440×900 real Blender renders (OBLIQUE/FRONT/AERIAL/SIDE), BP admission, provenance and SHA-256 review manifest. Actual SHA hashes in `SHA256_ART_HOLD_MANIFEST.json`.
- [Source authoring script](../scripts/p101-w9c2-g4e7br-blender-art.py) is algorithmic Blender `bpy` modelling, **not manually hand-sculpted, not image generation, not a native game screenshot**.
- BP intake: 26,594 actual triangles, 219 meshes, 264 primitives, 53,082 vertex positions, 17 exported materials, **0 embedded image textures**, mesh-local bounds approximately 1,062×675×898m, many node transforms. Note node-local GLB bounds do not alone establish proper world-space size.
- **No PRIVATE game integration, no real start00 240Hz P96 screenshot, no human trial** performed by this phase. Native physics B48×7/B51×28/gap52 and camera remain untouched. Official approved Slope2 length 0m.

## Actual visual inspection: primary-city candidate REJECT
The assistant inspected the *actual Blender OBLIQUE, FRONT, AERIAL, SIDE* renders. The composition has tangible progress over pre-BP simple colored geometry (real art object, organic fracture sails, modeled shadowed islands, warm lit facades, physically meaningful depth), but the art direction remains **far below the intended paid-indie megacity quality**, in particular:

1. **Miniature-diorama reading**: despite nominal ~1km geometry, 4 views read as a small separated collection of platforms, not a continuous kilometer-scale inhabited world.
2. **Sparse population**: giant smooth empty roof plates/foregrounds and only a handful of repeated tall towers; almost no district-scale urban tissue, skyline strata, public spaces, transit density or diverse occupancy.
3. **Geometrically generic tall buildings**: polygonal columns with ring-like balcony bands and bulky square roofs still repeat, with no distinctive city architecture tying them to the huge fracture sails.
4. **Materials lack authored texture detail**: 0 embedded textures; smooth facades read as low-poly placeholders. More materials alone do not solve this.
5. **Disconnected composition**: the signature blades, city decks and towers read as independently placed objects rather than a dominant continuous inhabited architectural silhouette; central negative space lacks purpose and strong urban edges.
6. **No game camera evidence**: Blender studio beauty cameras can flatter architecture. The only consequential framing test is the unchanged real >100m/s native game camera, which is still pending and MUST NOT be called PASS.

**Decision:** Technological modelling/rendering/export/intake succeeded. Reject BR as the hero megacity district. Retain as a possible early-stage industrial satellite / art-study fragment only, with **Human/Art/Publish/Ready/Merge all HOLD**. Do not claim it is accepted or ready for public use.

## Next ART-FIRST pass: qualitative leap, not a cosmetic procedural tweak
The next architectural proposal should change the **mass distribution and inhabited substance**, not merely add more rings or simple towers:
- Make one **unmistakable central 400–700m inhabited mass**, with interlocking curved hulls, deep large voids, elevated enclosed public terraces, suspended neighborhoods and thick major transit arcs genuinely *embedded into* the city.
- Give that mass **an 800–1200m dense supporting metropolitan tissue**: differentiated continuous blocks, hanging decks, underside habitation and stepped boulevards with human-scale 4–8m window rhythm. Avoid empty expansive foreground slabs.
- Use authored PBR texture layers (metal roughness, emissive window atlases, urban interior modules, grime/weathering) and bake/apply them to actual Blender-glTF compatible materials. Self-declared material labels are not enough.
- Improve **coherent landmark identity**: a singular compelling distance-read architectural gesture, not isolated repeated towers. Keep the successful fractured-sail gesture as one integrated structural element if it helps.
- **FIRST** review 4 original camera renders with explicit silhouette/city-density/1km-scale human reading; **SECOND** find a dedicated PRIVATE glTF renderer capable of Blender-indexed meshes/PBR/textures/multiple nodes; **THIRD** test in unchanged genuine 240Hz fast physical-game camera and iterate placement *by visual evidence*, not projected vertex fractions. No readiness/public promotion without explicit user approval.

## Runtime/policy preservation
Work not required for this branch: produced and archived via Chat+GitHub Actions. Do not claim Blender 4-view success means the BK legacy WebGL importer supports this asset; it explicitly does not. Do not change the old Slope2 original site, main, Gold, production, existing physics B48/B51, original acceleration or camera. Draft PR #46 remains OPEN/Draft. Archiving rejected evidence to GitHub does **not** constitute release.
