# K4AS — Road5元ゲーム画面の素材・配色を再構成する研究候補

基準日：2026-11-03 JST。前工程K4ARから継承するART-FIRST/QUALITY-FIRSTの独立実験。**正式採用0、Slope2 DNA認定0m、全ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE HOLD**。

## 本工程の理由と限界

K4AJの真元スクリーンショットでは、Road5中央の広い青緑の平板路面、巨大なマゼンタ／シアン／黄の描画パターン、巨大な単色B51機械装甲が画面を支配した。K4AQの新天空・都市が追加されても、元画面の雑な色塗りが画面全域に残る可能性が高い。単純な「建物を足すだけ」ではユーザーが指摘した全画面美術の欠点を解消できない。

ただし**今回の実装はあくまで素材の第一段階で、世界水準の美術改善を実証したとは言わない**。既存の箱状道路オブジェクト／遠景11棟／K4AQ四街区の反復、美術的な公共空間設計、独創的建築意匠、法線のない元B48/B51のベタ色描画を完全に解消してはいない。元の道路・機械を全体として「素材化」した名目でART合格にすることは禁止。

## 新しい隔離研究と本物のコード

**研究枝**：research/k4as-road5-native-screen-material-rescue-20261103 （K4AR HEAD e14875f32c036d3c50e6bf51212353768be6b75d から派生）。
前K4AQ/ARの元Pending/Queued CIには触らず、独立枝・独立workflowで進める。

1. web/p101-k4as-road5-original-screen-material-system.mjs：元6float/vertex（XYZ + RGB）を複製し、RGBの3成分だけ編集。全XYZ一致とoriginal vertex countの不変・有限値・RGBA値範囲を検査。元B48物理・元B51衝突変更ゼロ。新しい建築素材とは別に道路・路面・B51機械のGPUの大きい色領域を落ち着いた質感方向に整理。
2. K4AS路面：元巨大な青緑色を、マットな青灰色／暗い裏面に視覚のみ置換。**元危険／報酬fixtureの赤黄カラーは変更しない**。
3. K4AS路面装飾：元A13高速道路の鮮やかなピンク・シアン・黄の意匠を低彩度の石材・チタン・ブロンズ・石板系へ視覚のみ再配置。パターンの危険性・左右誘導を勝手に保証しない。危険B51警告ゲートやHUDはこの変換の対象外。
4. K4AS障害物：元P73実機の本体色とA13機械GPUを別々に扱う。実際のfailは赤、bounceは琥珀、pushは紫の高コントラスト信号を残し、衝突体本体の彩度のみ下げる。すべて元の実動体OBB/poseに正確に従う、見た目だけの色変化。危険を無害な公共通路のように見せる編集は禁止。
5. scripts/p101-r19a6p4r2f5k4as-private-road5-material-pack.mjs：真のK4AD→K4AQ source-privateコピーからさらに隔離生成。**localhostでk4aq=onかつk4as=materials**のみ有効。元描画は常に保持し、元Runner.surfaceがRoad5の時だけ新3種GPU bufferを選ぶ。他6道路で新色を描かない。B48/B51、Camera、240Hzは元のまま。
6. tests/p101-r19a6p4r2f5k4as-original-screen-material.test.mjs：元XYZ完全一致、線分バッファ、3つの衝突意味、fixture色保持、異常データ拒否、Road5／7道路／28動体ガード。
7. scripts/p101-r19a6p4r2f5k4as-original-source-four-way-art.mjs：真正WebGL2 240Hz source同カメラ6tick×（元画面／新天空のみ／新天空＋都市／新天空＋都市＋Road5素材）＝**24真正元カメラPNG**を求める。元カメラ・球・実Road5・B51元28動体の同一性を検証。
8. scripts/p101-r19a6p4r2f5k4as-independent-four-way-review.py：24PNGのSHAと全画素差を独立検証し、4列×6行の**加工していない本物の元Canvas画像コンタクトシート**を生成。画素差が一定以上なければ、実建築/素材視認のSOURCE TECHを拒否。**画素差や色彩の合否をART評価に転用しない**。
9. .github/workflows/p101-r19a6p4r2f5k4as-original-four-way-screen-material.yml：独立CI。GitHub Actions #41589057566 は作成直後 queued。結果は未確認で実画像は未取得。

## 元ソース／バージョン保護

凍結source blob：af076d67492a677d2235e4730aef8cdf4808e106。元240Hz、球半径0.65m、B48道路7、B51動体28、元Camera・操作・衝突の変更禁止。旧K4/R/U ART REJECTを復活しない。main、本番URL、原作再現URL、Gold/P100/W9-X/B5、元Draft PR #46は変更しない。ユーザーPC操作不要、Work事前承認。

## 現在の独立実測と次工程

前K4AQ #41580058193 は最新照会時PENDING、K4AR #41585003708 はQUEUED、今回K4AS #41589057566 もQUEUED。**K4ASの24実PNG、実FPS、画素レビュー、画像の目視ART判定はまだ出ていない。** 新しいCIを繰り返しpushしてキャンセルしない。

**新たに認識したK4AR既存コードの出力不一致**：K4AR撮影コードの保存名は実コードでは K4AQ_TRUE_CAMERA_ART_AB_REPORT.json のまま、一方独立監査が期待するのは K4AR_TRUE_CAMERA_ART_AB_REPORT.json。これが未修正のK4AR CI失敗原因になる可能性が高い（他の失敗は実ログ未確認）。K4ARの元実行中の枝には無断で変更を加えず、K4ASの新しい専用コードでは**K4AS_ORIGINAL_NATIVE_FOUR_WAY_ART_REPORT.json**へ修正して独立検証する。

次はK4AQ/AR/ASの最新CIと真Artifact/PNG取得→生CRC/SHA/画素比較→本当に綺麗になったか美術審査。道路配色の調和だけでは薄っぺらい元メッシュを救えなければ**ART REJECTとして形態・公共空間・遠景密度・素材レンダリングを設計し直す**。元B51危険中に新建築を重ねて視界をごまかさない。
