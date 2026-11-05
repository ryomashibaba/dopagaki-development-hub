# K4CK — 元Road5に忠実なA/B沿岸景観の実制作とART評価

**2026-11-05 JST／研究ARTのみ。** この文書はK4CJ R2を継承する開発正本。前チャットの方針は再審議しない。正式ART採用0件／Slope2 DNA認定0m、HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。

## 継承した失敗と禁止事項

K4CJ R2 `research/k4cj-source-locked-roadcut-speed-rhythm-20261105` HEAD `752908c984b6fe534d6199317a194bf056a82af8`。本物のBlender EEVEEと同一CHASE 768×480の[実画像](https://github.com/ryomashibaba/dopagaki-development-hub/blob/research/k4cj-source-locked-roadcut-speed-rhythm-20261105/docs/research-evidence/k4cj/K4CJ_VS_K4CI_TRUE_SOURCE_CHASE_ROAD_DEPTH_ART_REVIEW.png)を読んだ結果、TECH PASSでもART REJECT：三角リブが画面左に周期的に浮いて見え、道路と自然崖の地理が分断される。単純に風防リブの色を変えたり横材を足すR3工程、遠景に細かい小物を増やす工程を主経路に戻してはいけない。

**凍結**：main `d402801f271f43163ad85d9303abe9773d3958bd`、公式P101 `19d3a32d525c0c2a67082cba646898fab8f2b60f`、Draft PR #46 Open/Draft/未merge、凍結Gold・原作Slope・原ゲームと240Hz/B48 Road7/B51 28 moversとRoad5/6Camera/CHASE/物理/Collider、本番2サイト。元Game Git blob `af076d67492a677d2235e4730aef8cdf4808e106`、Road5全vertex/face SHA256 `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`。Work/Computer Useは事前承認、追加有料API原則0円、ユーザー操作最小。

## 今回の実制作設計

隔離研究ブランチ `research/k4ck-continuous-coastal-cut-retaining-wall-20261105`。親の真正可編集Blender `K4CJ_SOURCE_ROAD5_CONTINUOUS_COAST_CUT_EDITABLE_ART_HOLD.blend` SHA256 `296326d18c446e70c25ca45598ad623affaf20c07a26e263b1789e9dc2bb04d2`をGitHub Actions Artifact [#13389450314](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41968702663/artifacts/13389450314)から厳格に実バイト取得。

**研究作者工程は2方向を実形状として同一のBlender内に構築**し、研究上の表示のみ切り替え、各方向を**本物の同一CHASE**でレンダリングして厳密比較する。新たな平面画像を貼る・Cameraを移動する・ソース路面を細くすることは禁止。

- **A「波蝕の玄武岩切土＋一体式連続石造擁壁」**：元SOURCE 11307 Cameraの前方向と元Road5形状のレイで世界座標と地盤を固定し、198m近い100縦断地点・16横断面を実メッシュで制作。大きな岩盤の垂直断面、潮風の風化、3つの侵食谷を実頂点Zで作り、道路端とは一体の連続した**本物の厚みがある低い道路擁壁・石の笠木**を実3D形状として接続。10組の人工三角リブは使わない。
- **B「むき出しの水流侵食を受けた自然の岩盤断面」**：同じ元Road5の標高と可視地点だが、切土そのものを別の横断面と波蝕した地質として実作者制作。擁壁は設けず、道路と斜面の空間の自然さを比較する。Aとは研究メッシュ・マテリアル・輪郭が別。単なるAの色替えではない。
- 元K4CJの旧切土1件・旧風防1件の**元研究メッシュSHA256と行列はすべて凍結したまま**、研究描画のみ`hide_render`で非表示。削除・上書きせず、A/B両方向と連続擁壁を**合計3つの独立した編集可能な真3D研究Mesh**として新規追加。正式ゲームColliderは0追加。Bが表示中でもAと擁壁は元Blender内に編集可能な状態で保存。
- **安全ゲート**：元Road5物理半幅13.15m、新地形最小横距離16.70m以上。元Road5/CAMERA/木11本/光源、親研究メッシュのハッシュ・行列・非対象表示を不変。真CHASEで新構造が道路中央に侵入しないx<.49、元道路中央・右港の独立画素差、元Road5 5サンプル・K4BZ黒筋6対回帰。**ART判定は画素数で代用しない**。

研究コード：`scripts/p101-k4ck-source-locked-two-coastal-corridors.py`。真正GitHub Actions：`.github/workflows/p101-k4ck-native-dual-coastal-art.yml`、親SHA＋ゲーム原本保護→真Blender4.0.2 EEVEE→A/B両画像→独立画像QA→研究GitHub Evidence/Artifact。**初回[Actions #41980694105](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41980694105)はこの文書執筆時点では実行中。新K4CKのTECH/ART結果・Artifact・独立ZIP/SHAは未確定。** 必ず実ログ・実画像を検証して追記すること。

## 合格/不合格の評価の要点

A/Bは必ず直接画像を開き、自然地質の地理・道路との物理的関係・車の速度感・左岩盤と右港を含む1画面の統合度を比較する。小さな微調整を無制限に繰り返さず、**実ゲームとしての完成度に直結する作者制作**を優先する。ART合格まで正式ART採用0件、Slope2 DNA0m。元ゲームのWebGL2実走、人間プレイ、SAT/CCD/FPS/RELEASE/MERGE全HOLD。
