# G4E-7DW: artist-facing screening before new architectural massing

2026-10-27 JST. **No new art built or adopted; no modifications to gameplay, production, source physical B48/B51, camera, game renderer or public URLs.**

Earlier failures: DP giant ribbons, DQ detailed BW overlapped the existing crescent, DS duplicated weak 709-building towers, DT replaced these with three huge opaque walls, DU's 120m passage was camera-ray clear but not supported by the road, and DV's actual nearest road upper skin is **64.525m / 11.777m below DU station entrance** with hypothetical direct-grade **18.56%**. Even a small 3D lift + 63m bridge was minute in native camera, so ART REJECT. **The problem is site selection and perceivable architectural function.**

DW starts from unchanged true B48 **rideable, collidable surface** geometry: samples u={.12,...,.92} on both actual top edges v=0,1 of each of the seven surfaces. Candidate portal sites are displaced *outward* from the sampled road center-to-edge direction by 12/24/42/64m and raised 2/6/13/24m; none adds game geometry. Each candidate is given a **fixed** 18m wide by 19m tall portal outline, physically located in one common world coordinate system across both roads. Rather than cheat by turning assets toward each camera, compute camera projection for *all six* 15.5/16.0/16.5s original P96 nonhuman 240Hz shots in both variants. Pre-screen full 4-corner view containment, projected pixel width/height, depth and visual position; score is a heuristic prefilter **not beauty**, no car collision or hazard clearance certification.

The best pre-screen candidates are checked with DU's original exact **22,920 CX plus 33,092 B48 = 56,012 real triangles** and all **28 actual B51 rotating OBB physical poses per timestamp**. Each has 4 projected portal control point-to-camera rays in 6 native camera shots. A reference line from 1.8m above exact original B48 road-edge sample to the entrance center is also tested against the **existing static geometry** only. Strict study shortlist requires all original-world portal rays clear, static bridge reference ray clear, minimum portal screen width ≥18px and minimum height ≥16px across ALL six shots. This is not a real safe lane or a full swept-volume path. All source and new geometry remain untouched. If NONE passes, record that honestly and improve placement/search rather than invent safety or proceeding to massing. If candidates pass, they are **spatial hypotheses only**, not art or gameplay approval.

The selected 3 most useful sites and all failures are stored as native JSON with camera pixels, source road XYZ, source surface ID, per-shot original geometry/OBB occlusion evidence. The search creates **zero new game colliders, zero buildings**, keeps official Slope2 recognition at 0m, PR #46 Draft, ART/HUMAN/READY/PUBLISH/MERGE HOLD.

Next progression is visualization ONLY of actually shortlisted candidates and correctly scaled openings before designing costly Blender geometry. Current DW script is a pre-production search, not real WebGL nor a human traversal test.


## 最終・正規Blender目視評価（2026-10-27 JST）

[候補探索CI #40498009759](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40498009759)、[実画角レンダCI #40498941217](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40498941217)ともSUCCESS。DW追加の4 QA輪郭オブジェクト（駅ではない）を表示した2道路×3時点の6枚と、DR元物理道路を比較。低いH2入口は6画角で見え、走行に従い大きくなるが、単純な細線マーカーで都市機能や生活は一切読めない。**TECH PASS、ART HOLD**。

形式的な18px最小幅に届くH24では、H2よりわずか0.0626px改善するだけなのに高低差が2m→24mになり、不合理。H2本線通視チェックは静的CX/B48および指定3時刻のB51動体全28に合格しても、連絡路の**立体的な断面全体**や車線路肩のフェアネスは未証明。最終路面がプレイヤーに通れると称しないこと。公式認定0m、ART/HUMAN/MERGE/PUBLISH HOLD。
