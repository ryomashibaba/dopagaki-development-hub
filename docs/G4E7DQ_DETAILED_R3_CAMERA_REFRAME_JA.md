## DQ 実画像・監査結果（2026-10-27 JST）

CI [#40454837621](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40454837621) SUCCESS、[実Blender Artifact #12712420146](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40454837621/artifacts/12712420146)（4.blend / 20.png / DOカメラ監査2 / DQ監査2 / サイト配置2）を取得・実際に確認。両道路で既存BW R3のBlender mesh1,493、元CX18ソース・22,920三角、元DOの実240Hzカメラ5台を完全保持。新たなコライダー・走路・動体0。

**最終判定＝ART REJECT**。構造化された本物の階層と窓が右側建築に増え、DPの板状大屋根より見た目は妨げが少ない。しかし15.5秒で旧左主役が画角外、16秒の正面は都市的つながりに乏しく、17秒まで右側で従来クレセントとBWが重なる。十分な都市の奥行き・高密な生活空間・主役間をつなぐ交通の軸線は読めない。この映像は**Blender**であり、元ゲームWebGL・人間操作・動体予告・FPSは未検証。だから本番移植禁止。ART採用0件。

今後、Blenderアート審査には遊べる実道路面・障害物の視覚的配置を含める必要がある。現DOマスターの路線はガイド曲線21本のみで、道路の実表面やゲームの動体は登場しない。次DRはこの不一致を埋める制作審査環境の機能追加を優先し、美術候補の乱造を中止する。

---

# G4E-7DQ — DETAIL-FIRST authored asset reframing in genuine camera

2026-10-27 JST. DP 20 genuine **Blender** images confirmed actual road-source rig and visibility, but DP model was seen as long faceless ribbons, roof panels and flat bridges, obscuring skyline at 16.5–17s, absent inhabited vertical facades or transit interiors. **DP ART REJECT**. Full DP CI [#40447458670](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40447458670) SUCCESS, artifact #12710006367 with 4 Blender scenes, 20 images, four audits. Technical achievement is NOT artistic success. Original game WebGL was not captured for DP, because the Blender-level art gate rejected it early.

DQ is not another new ribbon shader or a provisional acceptance. Re-use **existing authored and unadopted BW R3 HALO-CUT CONCOURSE** Blender source (1,493-ish meshes, full civic portals, interior foyers, occupied plazas, suspended transit, embedded surface detail). Source rights: original project-authored Blender study, prior visual assessment HOLD; BW shape is not a final urban plan. See `artifacts/private/g4e7bw-halocut-concourse-r3/G4E7BW_HALOCUT_CONCOURSE_SOURCE.blend`.

### Explicit test
The entire original BW R3 3D source is imported into a DO master scene containing exact unchanged CX triangles and original nonhuman 240Hz camera poses. Source Blender **Z-UP** transforms into game's **Y-UP** via basis: source X cross-road outward, source Y tangent along real BC road1, source Z up. Fixed native-site anchor at DO road1 centerline station39 and 240m outboard with uniform scale 0.38; this prevents artificial big wall/road intrusion and should occupy right-half scene through 15/15.5/16/16.5/17 seconds. Bounding-box preflight is based on the existing BW authored Blender bounds converted from glTF Y-up reference. It cannot guarantee true object-level visibility, aesthetic appeal or gameplay hazard fairness.

Outputs are 2 genuinely editable combined `.blend` models, 10 genuine offline Blender comparison views, 2 site projections and per-road audit JSON, plus unmodified DO reference scenes. **No change to core physics, roads, obstacles, view or engine source.** The captured images are *not* genuine original-game WebGL. If a portal/cathedral without a complete city still fails to bridge the visual continuity, ART REJECT without porting it into WebGL. ART/HUMAN/READY/PUBLISH/MERGE HOLD, official Slope2 0m, PR#46 Draft not merged.
