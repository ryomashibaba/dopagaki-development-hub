# K4BD — 本物のRoad5を維持した3K路面・公共交通デッキの本格的美術研究

2026-11-03 JST。K4BC v3研究確定HEAD `6b06a76e6a467e0533b2ae49c7f01201e80a7474`から隔離研究枝 `research/k4bd-source-road5-civic-deck-material-architecture-20261103`を作成。

## なぜこの工程が必要なのか

K4BC v3の実6Camera画像は全7 source roadsをsource-native `tessellate` で取り込んだもので、元Road5物理形状やB51オリジナル時刻OBBに変更なし。正面には大型公共施設が映るようになったが、Road5が画面の大半を覆う極度に単調なグレーの床で、日光に対して表面が高輝度・ノイズが多く、左右は屋根と棒・窓の雑な模型。出力[control11307](research-evidence/k4bc-v3/K4BC_V3_REAL_CONTROL_11307_DCC_ART_REJECT.png)。ART REJECTの本質は「大きな道路が何の構造物なのか意味を持たず、路外の公的施設がつながっていない」こと。

**今回も実ART採用0、Slope2 DNA0m、全ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE HOLD**。DCCやCIのgreenはART PASSではない。単純な色替え・浮いたboxの増築でARTを誤魔化さない。

## 実際の制作

[K4BD Blender制作器](../scripts/p101-k4bd-true-source-road5-3k-deck-civic-architecture.py)はK4BC v3の編集可能.blendを開く。元source全7道路×control/ultra14メッシュ、Road5の4,728三角、元source6Camera眼球方向、元B51 28×6時刻 collision OBB=168はそのまま。

- **Road5真source曲面の3K PBR舗装**：3,072×1,536 ALBEDO／ROUGHNESS／HEIGHTの独立PNGとBlenderノード、Road5原本91x13格子のUVに沿って構築。大面積の中央basalt、石材の外側帯、継ぎ目、現実施工寸法の道路接合、大きな金属導水帯を**同じ基礎幾何の表面材質として視覚化**。K4BBのNon-Color画像が全黒だった不具合を再発させないよう独立PNGエンコーダで書く。
- **sourceに沿う金属/石材上面インレイ**：両側計52枚のアーキテクチャによるDCC独立スキン。元路面には一切collider追加を行わず、美術提案の指標として別collectionに保管。**元ゲームの進路・危険表示の正式置換ではない**。
- **公共施設と元Road5を接続する2つの大きな公共テラス**：実source Road5の左右端からそれぞれ16m以上外側に配置した連続する人間歩行用deck、階段状屋根、地中支持体、実手すりの建築断面。現行の元source物理路面に重ねない。新規登坂/走行可能なゲーム道路を作らない。
- **遠景の海港基盤**：source全7道路の標高最小値よりはるか下、Blender Z=-140に広がる海水面。元source gameplayや元B48/B51の機能・当たり判定を増やさず、これまで海港といいながら航空視点が真っ黒であった問題に根源的に対応。
- **source6CameraのきれいなARTと元物理debugを分離**：元B51の紫ワイヤはgameの原ビジュアルではないため、アート評価だけでは非表示、ただし源collision6tick×28参照オブジェクトは.blend内に維持して、`ultra11341` だけ実時刻28枠を描いた独立DEBUG画像も出力。これは元ゲーム画面と偽らない。
- **大きなCyclesノイズ問題をEeveeで切り分け**：Blender 4.0対応 `BLENDER_EEVEE` と各original Cameraで、Road5のテクスチャと公共施設全体が読めるのか直接評価。絵の粗さをsampleノイズで取り繕わず、ARTが未完成なら不採用。

## 禁止と厳密検証

- 元ゲーム凍結blob `af076d67492a677d2235e4730aef8cdf4808e106`。Source B48全7道路・B51移動28体・240Hz・球半径0.65m・元Camera数字・元の安全表示・操作・元の物理は変更禁止。
- main／本番URL／公式継続`p101-velocity-overdrive-native-trial`／Draft PR #46は変更禁止、正式マージなし、Work事前承認。
- Blender元物理頂点・face fingerprint before/after厳密一致必須。元のother6源メッシュ、6Camera eye、B51六時刻28OBBを先行検査。
- 3K画像3枚の実PNG RGB分布・SHA／元6Camera DCC画像・航空DCC・独立B51DEBUG・編集可能.blend・GLBと全マニフェストSHAを保存。6同Camera新旧A/Bを実画像確認。
- [独立BVHソース](../research/k4bd/independent_all7_native_B48_B51_offroad_terrace_static.py)は元全7B48×2mode+168 B51 source collision OBB対旧K4BC新美術＋K4BD路外建築だけを検査。路面上のゼロ高さvisual inlay52枚と低海面はsource physicsに加えていないため**明示して幾何接触検査対象から除く**。これは本物の球半径0.65mやCCD/全時刻/FPS/HUMANを認定するものではない。

## 次のチェック

専用[制作CI](../.github/workflows/p101-k4bd-3k-civic-deck-source-art.yml)。成功が確認される前に「実Blender画像が改善した」「BVH PASS」とは絶対に書かない。成功すれば現物を開いて対照、独立検証、GitHub正本へ成果/厳格審査結果を更新。人間の目で完成品質が不足なら**ART REJECTを維持**。

**この文書作成時点でK4BDの最終制作CI・元6Camera画像・独立BVH結果は未確定。**
