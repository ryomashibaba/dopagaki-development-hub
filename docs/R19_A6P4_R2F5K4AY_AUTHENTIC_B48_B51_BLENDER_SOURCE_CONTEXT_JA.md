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

## 実測更新：K4AY CI2の真source抽出PASS、実DCC画像のART REJECT

- [#41611172565](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41611172565) は**workflow全体FAIL**（Blender 4.0.2 のGLB輸出時 `ModuleNotFoundError: numpy`）。ただしsource Nodeテスト3/3 PASS、K4AX編集可能原本の真正SHA照合PASS、Blenderソース画像6PNGの保存と`.blend`別名保存まではCIログで確認。
- 調査Artifact [#13219306598](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41611172565/artifacts/13219306598) は**失敗中の部分成果でありDCC統合完成PASSではない**。これを独立ダウンロードして画像6枚を直接目視した。
- source Road5 = **B48 index5、ID `p93-PRISM_CREST-01`**。CONTROL/ULTRA両方、制御点SHA256は`5eb731e25bc9eb1a3cf1080e7b239f5e2e8043bfbc80e5d37e0b069a5a08a730`、source `tessellate()`結果4,728三角形（top 2,160）、longitudinal void cellsは空。両stageでは**Road5同形状**である。
- K4AX参照画像の6原Cameraの近接物理道路候補は全時点Road5 index5、sample grid近似距離はcontrol 1.716/5.184/1.364m、ultra 1.825/3.771/1.212m。これはgrid上の最近傍サンプル距離であって球の安全クリアランスではない。
- 時刻別B51 6tick×28=168個、K4AIに照合済みのsource seconds=tick/240、CONTROL/ULTRA source B51 descriptor hash一致をCIで確認。衝突OBBを元ゲームの視覚メッシュと誤認しない。

**実際の6 DCC写真を直接審査した結果**：ART REJECT。非常に広い白い平面がフレームを占め、公共ホール屋根が左上で切れ、塔が右に孤立し、道路沿いの都市空間や用途、人間スケール、建築連続性・地形密度が読み取れない。紫色の巨大ボックスはあくまでB51 source COLLISION OBB参照でゲーム美術ではない。さらにK4AXの「NONPHYSICAL LANDSCAPE backdrop」が元Road5実道路を覆っている可能性があるため、後続のsource geometry視覚審査では**偽の地形を描画から明示的に外し、B51 COLLISION OBBは透視可能な線枠に変える**。どちらも元ゲームのsourceを削除・変更する行為ではなく、DCC調査目的だけ。

- CI3 [#41611613661](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41611613661) はCI2のNumPy不足を `python3-numpy` 導入で修正して再実行。最終statusはAPIで照合が必要。
- 次は元データを使ったDCC参照の実road露出、B51 proxyの誤解のない枠表示、**大胆な都市造形再設計**。表面的な色替えや単純BOX追加は引き続き禁止。
