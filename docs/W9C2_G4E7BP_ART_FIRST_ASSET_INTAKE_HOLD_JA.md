# G4E-7BP — ART-FIRST asset intake and BO final audit (2026-10-25 JST)

## BO final evidence: technical PASS / visual REJECT
- [BO actual 240Hz Chrome run #40166540111](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40166540111): SUCCESS with 7 real B48 roads, 28 moving B51, gap52, TRUE 122.9m/s and SWITCH 112.2/125.8m/s scripted (not human), PRIVATE/public isolation.
- [Actual WebGL screenshot & GLB archive #12588778053](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40166540111/artifacts/12588778053). **Artifact expires after 14 days; not permanent**.
- The city remains cropped at the far left, without readable macro-scale urban depth. BO's BN-specific registration moved world-space geometry only ~X +4.6m, Y -27.7m, Z +23.7m.
- At TRUE the actual projected city 7%-93% quantile occupies **~0.11 of normalized screen width**, at SWITCH17 **~0.19**; ~100% vertex in-frustum can still yield a skinny unreadable silhouette.
- Geometry scores rose only from ~11.3 to ~11.5. Pixel RGB mean absolute differences from BN were ~4.34, 2.49 and 4.22 (range 0–255); objectively small screen-level differences, **not proof of better art**.
- Formal Slope2-certified meters remain 0. Human fairness, Art, Publish, PR Ready and Merge all HOLD.

## Important policy change: no more micro-iterations on procedural tubes
The accumulated BK→BL→BM→BN→BO sequence created valid GLBs and robust speed-camera QA, but not the desired futuristic megacity. Stop calling purely procedural silhouette tweaks visual progress. Preserve experiments as negative controls and shift art direction to **artist-authored, texture/material-rich original 3D architecture** while keeping the native physics.

### BP deliverable: independent GLB provenance & geometry contract
Added `scripts/p101-w9c2-g4e7bp-artist-asset-intake.mjs`, dedicated unit tests and isolated CI. This is a self-contained *admission gate*, **NOT a renderer, Blender modelling result, or public build integration**. Reads a real binary GLB2 with embedded mesh buffers and optional embedded image textures; checks triangle positions/indices, material existence, finite vertices, source license claim, explicit meter/Y-up convention and forced HOLD. Reads multiple meshes and nodes rather than tying artist assets to the BK one-mesh/six-material/no-texture prototype.

Run after an artist has created a GLB:
```bash
node scripts/p101-w9c2-g4e7bp-artist-asset-intake.mjs district.glb provenance.json report.json
```

Provenance example (a claim, not independently verified):
```json
{
  "assetId": "g4e7bp-original-urban-district-001",
  "author": "Original modelling artist",
  "sourceTool": "Blender",
  "sourceFile": "district-01.blend",
  "rights": "original-work",
  "unitsMetersPerUnit": 1,
  "coordinateSystem": "glTF-Y-UP",
  "reviewStatus": "HOLD",
  "publicationStatus": "HOLD"
}
```
For third-party use, also provide a real license name and source evidence; a declared license does not establish that reuse is permissible. Do not use unknown rights.

All output reports say `realCameraWebGLProof: NOT_YET_RUN`, `humanVisualReview: HOLD`, `publicRelease: FORBIDDEN`. Imported nodes with transforms make the mesh bounds **local**, not world-space; that is an explicit warning. Legacy BK renderer cannot faithfully load this arbitrary glTF subset (textures, arbitrary nodes/indices), so do not misstate admission as game-renderer readiness.

## Next vertical slice
Produce or acquire a truly authored, original/appropriately licensed high-quality urban district GLB (ideally source .blend too). First review artistic macro silhouette and coherent architectural structure in an independent professional renderer. Then add a separate PRIVATE modern glTF renderer compatibility test, and finally the unchanged 240Hz B48/B51 actual-high-speed visual QA. **Real native screenshots and human visual evaluation override numeric projected-vertex coverage.**

### Efficiency
BP intentionally does not edit `scripts/build.mjs` or `web/drive3d.mjs`: both monolithic files trigger many costly old CI workflows per change. Its own isolated CI tests only one fast Node script, not every game build. Keep one major art subject per pass. Save review-critical GLB/images to a durable GitHub asset archive after selection (GitHub Actions binary artifacts are only retained 14 days). Original Slope site, main, Gold, user playing controls, camera, acceleration, 240Hz physics untouched.
