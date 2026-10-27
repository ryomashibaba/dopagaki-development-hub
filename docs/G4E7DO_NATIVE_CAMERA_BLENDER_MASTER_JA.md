## DO検証経過と暫定ゲート（2026-10-27）

[最新版CPU CI #40442938522](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40442938522) はこの記録作成時点で未確定。前回[CI #40441647755](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40441647755) は元CX/camera Node検証PASS、Eeveeでの正規BlenderレンダーはEGL不足のためFAILED。true-pinch `.blend` 自体は[Artifact #12707061511](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40442610016/artifacts/12707061511)で実体確認済み。Blender 4.0.2のカメラ検証段階で最初は行列未更新の誤差があり、`bpy.context.view_layer.update()`を追加し元視点との投影チェックを通過。次はGPU非依存Cycles CPUへ切り替え済み。**美術・完成・2道路.blend・10画像のPASSを先取りしない。**

---

# G4E-7DO — ORIGINAL GAME CAMERA → REAL EDITABLE BLENDER MASTER

2026-10-27 JST. QUALITY-FIRST / INTEGRATED VERTICAL SLICE. ART/HUMAN/PUBLISH/READY/MERGE HOLD.

## Why this phase does NOT create another procedural city
DA through DN exhausted wall/bar/shelf/box/rim/protrusion/removal variants without demonstrating an integrated architectural city in the native 15–17 second camera. A Blender scene made for dramatic free-fly beauty is no better if its placement relative to the real player camera is unproven. Existing BW/BX Blender/GLB files are genuine research assets, **not automatically world-aligned drop-in game assets**: BW R3 is 1,493 meshes, 23,592 triangles, embedded texture, has unresolved possible node transforms; BX CC0 sample is 1,505 meshes, 41,360 triangles, 29 materials, also flagged node transforms and no native WebGL proof. BK GLB test renderer rejects generic indexed/textured/node-transformed glTF, so do not silently load those assets into the game. Avoid force-fitting prior ART-rejected asset.

## G4E-7DO actual output

PRIVATE source export copies **exact unchanged CX world-space 3D triangles** and each source SHA/semantic kind. Exact original BC A13 P96 *non-human* 240Hz native camera snapshots at 15/15.5/16/16.5/17 seconds, two actual B48 road variants, are recorded. 7×3 edge/center guide curves are intentionally wire guides (NOT road meshes, NOT a claim about road collisions or playable gap geometry). Blender preserves game XYZ as is, camera local -Z and +Y use original front/right/up, and uses **game vertical focal coefficient 1.35** with FOVY = 2 atan(1/1.35). For each shot a concrete in-front calibration target must agree with Blender world_to_camera_view within 1e-4 normalised coordinates.

Exported **editable .blend** scenes contain all original CX geometry grouped by source semantic class and exactly aligned native cameras; 5 real Blender offline reference images per road are created. These are genuine Blender output, **NOT actual game WebGL**. Renderer shaders / sky / road edges differ from the game; camera projection tests verify geometry composition alignment, not pixel parity or FPS. Test scene is PRIVATE reference and creates zero new aesthetic architecture. The artistic design stage next must reshape an integrated city across all 10 native camera viewpoints in a single shared Blender master. Do not promote to game while only technical rig gates pass.

The CI checks the original CX Git blob `af076d67492a677d2235e4730aef8cdf4808e106`, original two hero meshes and source triangles, 7 B48 / 28 B51 / gap 52, no new colliders, no game/renderer changes, Blender exact camera projective parity, .blend and PNG existence. The artifacts are exploratory only. GitHub main/Gold/public remain unchanged. PR #46 Draft unmerged, officially recognised Slope2 0m.
