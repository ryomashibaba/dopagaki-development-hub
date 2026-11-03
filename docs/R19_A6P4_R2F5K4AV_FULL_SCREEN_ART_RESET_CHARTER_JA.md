# K4AV — コース全画面の美術再構成：Civic Terraces over the Open Basin

2026-11-03 JST。DOPAGAKI SLOPE HYPER RUSH・**ART-FIRST**。これはK4AS/K4AT/K4AUのマイナー修正を積むものではなく、**実画面を見て判明した根本的失敗への新しい一本の美術候補**。作業は研究枝限定。

## 1. 決定事項と不採用理由

真正元Road5カメラのK4AU [Actions #41598855479](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41598855479) はcompleted/SUCCESS、Artifact #13213758069 に真WebGL2の12PNGが保存済み。画面を開いて確認した結果、以下は不採用とする。

- コースの大部分が塗り分けられた青灰色の平面・ピンク/オレンジ/水色の雑な多角形。
- 巨大な金属箱状のB51障害物が、実Camera 195m/sで正面をほぼ塞ぐ（ultra tick11341は本当に視界が大きく遮断）。GPU陰影と細かなノイズを追加しても危険の可読性を解消しない。
- 両側に水平帯を反復した箱型ビル群が続き、公共空間の使われ方・建築の用途・奥行き・ランドマークが見えない。
- 巨大な斜め梁・門が多く、**街ではなくコース脇の無機質な設備**に見える。
- 黒い空と遠景が未設計。元HUDも画面の大きな部分を占め、全体構図が整理されていない。CI Chromiumの日本語豆腐は描画環境固有の可能性があるので本番不具合とは未確定。

K4AS/K4AT/K4AUはSOURCE/描画TECH限定PASSが出ても**正式ARTはすべてREJECT**。これらの横線ファサード・大きな斜め梁・単なるノイズ・蛍光塗装をさらに細かくする方針は禁止。

## 2. 新美術案：都市の建築用途が高速走行中でも読める一本

**Civic Terraces over the Open Basin**：

- 高空に浮くスカイコースというより、**都市の地形と公共機能の中を真の道路が貫通する**大きな都市景観。
- 美術的な主役は巨大斜めゲートではない。Road5側の独立した**公共ホールの曲面屋根**、人の使うスケールの**ガラス付き駅前商業・回廊4〜6階層**、中低層公共テラス、奥の異種混合の塔。構造上の開口は本当の3D空間として空ける。
- 遠景は一様な黒でなく、**穏やかな黄金の地平線→青灰色の大気→濃い青の空、雲の層**で奥行きを構成する。SFネオンを空中へ乱雑に貼ることは禁止。
- 元物理B48の道路端をサンプリングして、その**実道路端より外側・下側だけ**に構造体を描画。実路面の消失セルを連結する架空の橋、歩けない視覚床の歩行可能認定はしない。
- 旧A13蛍光三角形の「非衝突装飾レイヤー」はK4AVだけで非表示とする。**元の実B48路面、B51の動体と衝突、元の危険ガイド・B51 warning、球、元HUD**は維持。消した装飾が実機で判断に必要だった場合はART/SAT HOLDから昇格せず描画ルールを修正する。
- 前K4AUの元道路/実動体ライティングは引き継ぐが、**材質だけで美術合格にしない**。

## 3. 今回の実装

研究枝：`research/k4av-road5-full-screen-art-reset-20261103`、元K4AU HEAD `c75b8364cfc4026d247b2f5b851f7edf8b41fa30` から新設。main、元ソース、本番、Draft PR #46を変えない。

1. `web/p101-k4av-road5-full-screen-civic-environment.mjs`：元Road5 real B48の側面/接線、実カメラ原球XYZ（tick11320）を基準に**別形態の都市1案だけ**を非衝突で配置。居住・公共・通路が読めるギャラリー、非対称ホール曲面屋根、凹凸を持つ駅前/オフィス、回廊・中庭、捻りテーパー塔。サンプル形状検査で11,068三角形、実元docの7道路/28動体の完全同一性を固定。
2. `web/p101-k4av-civic-basin-atmosphere.mjs`：WebGL2元カメラに沿った大気層・暖色地平線・雲・穏やかな空。フラグメント演出はあくまで景観表現で、物理・交通には触れない。
3. 研究枝限定の `web/p101-k4aq-road5-civic-rift-material-art.mjs`：元景観シェーダーに `sky:false` を受ける機能だけ追加。**新しい青灰/黄金の空を旧黒天空で上書きするバグ**を予防する。以前のART/HOLDは不変。
4. `scripts/p101-r19a6p4r2f5k4av-full-screen-original-art-pack.mjs`：元R19A1→K4AU研究ビルドをさらに隔離複製。`k4aq=on&k4as=materials&k4at=on&k4au=on&k4av=on`（localhost）でだけK4ATの巨大斜め構造物と旧A13雑多な色図形を**描画上置換**。元B48/B51衝突・元カメラ・演算完全維持。研究用 `k4avArt=off` で空だけ・元道路だけを出せる。
5. `tests/p101-r19a6p4r2f5k4av-full-frame-art-reset.test.mjs`：元source保護／voidセル無橋化／曲面街区有限xyz／全体役割／WebGL2 render state保護。
6. `scripts/p101-r19a6p4r2f5k4av-genuine-native-full-frame-triad.mjs` と独立Python監査：**元のRoad5 camera 6tick×3群=18PNG**（元K4AU／K4AV空と路面だけ／K4AV同空＋本物の新建築）を撮影。native球・Camera eye/front・B51元28体が全一致しないとFAIL。単に天空が変わっただけで建築可視性を誤合格させない。画像だけで美的ARTは合格しない。
7. 独立Actionsによる真Chromium WebGL2検証と元PNG SHAのコンタクトシート。

## 4. 必須不変契約

`web/p101-w9c2-g4e7ci-integrated-streetscape.mjs` Git blob `af076d67492a677d2235e4730aef8cdf4808e106`、元球0.65m、真240Hz、B48道路7、B51元動体28、原Road5/Camera/collision/HUD/Gold/P100/W9-X/B5、不変更。**正式ART採用0、Slope2正式認定0m、ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE HOLD。** 旧研究からの不採用を解除しない。Work起動は事前承認、ユーザーPC操作不要。

## 5. ARTチェックの判断軸

見栄えの合否は「元WebGL2画面そのものを人間の目で見て」、高速Cameraでのコース視認・道と建築の関係・空と遠景の奥行き・主役となる公共建築の独自性・マテリアルの密度・人間スケール・画面全体の統一感を総合判断。曖昧な数値スコアや色の変化だけでPASS禁止。B51の視界遮断やFPS、安全、CCDは別ゲートでHOLD。

本工程の最優先は本物の18PNGを取得して見て、**酷いならまたART REJECT**すること。狙いは実画面の質を上げることであり、三角形数・プログラム量・CI成功を成果の中心にしない。
