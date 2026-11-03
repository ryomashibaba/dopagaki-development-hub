# K4AY — 実B48 / B51 source native timeをK4AX編集可能Blenderへ非破壊統合

2026-11-03 JST | **ART REJECT / source-tech pending CI** | K4AYは前工程K4AXの美術合格を意味しない

## 永続最優先

* 目的は画面全体の美術品質の抜本改善。K4AXも正式ART不採用。道路・建築・B51の本当の関係を見ずに建物を量産しない。
* 固定原本 `web/p101-w9c2-g4e7ci-integrated-streetscape.mjs` は Git blob `af076d67492a677d2235e4730aef8cdf4808e106`。main/本番/公式ブランチ/PR#46は変更禁止。
* 240Hz、球半径0.65m、B48×7、B51×28、Camera、当たり判定、操作、HUD、速度を保持。正式ART0 / Slope2 DNA0m、ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE HOLD。
* この段階は完全に**DCCのみ**。元ゲームのWebGL2フレームではない。

## 今回実際に追加したコード

1. `scripts/p101-r19a6p4r2f5k4ay-export-true-road5-b51.mjs` は、K4AVで実測された Road5 ID `p93-PRISM_CREST-01` を同じ `VB-P101-A13-W9C1-CONTROL/ULTRA` stageから取得。元の `surface.js` の `sample/frame/tessellate` を直接使い、**上下・側面・本物のlongitudinal void capを含む source B48メッシュ**をJSONへ出す。元source pointsのSHA-256・原面数・top三角数・void cells・closest original road surveyも記録。ソースには書き戻さない。
2. `moving-obstacles.mjs` の `movingObstaclePose(descriptor,tick/240)` を6元Camera tick [11259,11278,11307,11320,11341,11369]で28体全件評価する（計168 OBB）。物理モード fail/bounce/push、原ID、center, halfSize, yawRadians、enabledを保存。B51動体は**実ゲームの描画メッシュではなく元衝突OBB**。演出形状を偽装しない。
3. `scripts/p101-r19a6p4r2f5k4ay-overlay-native-context.py` は既存K4AXの実`.blend`を読んだあと、control/ultra真正道路メッシュ2 collection＋6tickのB51 source OBB collectionに分離して挿入する。3既存CONTROL camera＋3 ULTRA source数値Camera、元のDCC建築・マテリアル・ライトは維持。新しい別名`.blend`・GLB・6枚のDCC-only PNGを保存。
4. `tests/p101-r19a6p4r2f5k4ay-source-native-context.test.mjs` でstage・blob・カメラtick・28体×6・topology・source time・改ざん拒否などを検証。
5. `.github/workflows/p101-r19a6p4r2f5k4ay-source-blender-context.yml` でsource Git blob固定を検査し、K4AX SUCCESS run **#41607194912** のArtifact **#13216639522**から編集可能なBlender原本を**SHA検算で保護した上で**利用する。新ARTだけは別の研究branchで評価し、この工程では再び箱を量産しない。

## 現時点の事実・証拠の強さ

* K4AX run #41607194912・Artifact #13216639522 はSUCCESS（先代の編集可能Blender＋DCC画像）。これを**K4AY成功**とは呼ばない。
* 新K4AY run [#41610821799](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41610821799) は初回照合時 **queued**。**Blender取込・6枚生成の実行PASSはまだ未確認**。当該runの結果をAPIで照合し、最初に落ちた箇所に限定して修正する。
* 元tick/240=source SecondsについてはK4AI実native GPU連続検証で同じ規則が照合されているが、K4AY自身の正確な合格範囲は、source数値とB51 collision proxyの再計算まで。ユーザーの人間操作やゲーム描画遮蔽率・FPS・当たり判定の合格を主張しない。
* `proxyCornersInsideCameraFrustumBroadphaseOnly` はカメラ視錐台への概算候補であって、本当の画面遮蔽率ではない。`B48VsArchitectureDetailedGeometricIntersection=NOT_TESTED_HOLD` は残課題。
* **美術品質は引き続きREJECT/HOLD**。成功した場合も次に真の源道路とB51に合わせて**屋根の視界占有・公共施設の実体感・内部空間・地形・建築連続性・元Cameraで読める美術**を大胆に再制作。元カメラ6時点を満たすアート審査ができるまでWebGL2移植・正式採用禁止。

## 次の具体工程（技術合格と美術評価を絶対に混同しない）

1. K4AY Actions runとArtifactの実status/jobsをチェック。失敗ならログの最初の真因を修正、CI成功なら`.blend`/GLB/6PNG/SHAを独立確認。
2. 実B48・B51が写ったDCC PNGを視覚審査、元K4AV真正WebGL2のoriginal source画像と同カメラ構図を比較。ただしBlenderの空・光・元B51描画は別物。
3. ROAD5 source collision surface / OBBS と建築の具体的近接・遮蔽の候補を取り出し、**建築の大幅な造形改修**。色替え、箱の量産、道路の形状改変、B51の削除、空だけの変更は再び行わない。
4. 認定候補が初めて現れた場合のみprivate WebGL2 A/B→元240Hz走行→安全/HUMAN/FPSを全て別審査。ART合格前に本番・PR#46・mainへ移植しない。

*作業権限：Chat＋GitHub、Work事前承認。ローカルPCでユーザーにZIPを求めない。*
