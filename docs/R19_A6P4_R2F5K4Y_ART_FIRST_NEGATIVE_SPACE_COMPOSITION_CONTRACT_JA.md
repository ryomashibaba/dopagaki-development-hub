# K4Y — 原7道路・真カメラ公共空洞の独立ART審査契約（新造形0）
2026-11-02 JST。正本 ryomashibaba/dopagaki-development-hub / p101-velocity-overdrive-native-trial / Draft PR #46。

## 継承と境界
K4X [Actions #41390354006](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41390354006) SOURCE TECH限定PASS。元PNG58枚、元カメラ42状態（KとK3Bは**別系列**）、全7道路42数学的仮サイト×42カメラ=1764組、投影画面内611組／同じ道路93/252組。**これは真遮蔽・用途の判読・衝突安全の結果ではない。** K4/K4R/K4U独立ART REJECT、ART正式採用0、Slope2 DNA認定0m。元球240Hz・B48×7/B51×28・カメラ・原A5・main・本番2URL・Gold/P100/W9-X/B5不変。

## 構図審査で分離する5つの証拠
1. **負空間の実体**：候補の前後・左右・上方に実際の連続した開口があること。単なる代理四辺形・屋根と床の間の数ピクセルの隙間では不合格。真正GLBの断面／元カメラの画像で独立に確認。
2. **前景道路との接続**：ゲーム内の道路と公開床の間に、物理的に到達可能な経路・床支持が存在するかを別途検証。画面上で接して見えるだけでは不合格。B48/B51候補固有SAT/CCD、実歩行は未実施のため全HOLD。
3. **奥行きの読める構図**：入口・中間・奥の少なくとも3つの空間層が、同じ元カメラの真正画面で区別できるかを人間が審査。投影面積や概念床の前後ピクセル差だけでは合格にしない。
4. **A5既存骨組みからの区別**：空洞・公共空間の輪郭が原A5の巨大構造や路面の輪郭に埋没していないか。元A5と候補の同tick・同CameraEye/Front・同画角・同球位置でA/Bし、意味的な区別を人間が確認。
5. **速度と継続性**：元240Hzの走行中、十分な時間認識できるか。K/K3Bの42カメラは別系列の疎な静止点なので連続視認秒数は**わからない**。時刻間を補間して連続可視と捏造しない。新しい真正連続キャプチャが必要。

## 審査記録の必須フィールド
- `sourceFrameId`、`captureProtocol`（KまたはK3B）、`mode`、`roadId`、`tick`、元画像SHA、元CameraEye/Front、元球XYZ/速度。
- `realNativeCandidateImageSha`（存在しなければ`NOT_CREATED`）、`geometryGapProof`、`foregroundRoadToCourtSupport`、`threeLayerDepthHumanReview`、`A5SemanticDistinctionHumanReview`、`continuousVisibilityEvidence`。
- `unknowns`を必須とし、未検証をPASSに変換しない。`technicalSourceAuthenticity`と`independentARTDecision`は**別項目**。

## 即時REJECT／HOLD条件
実際の公共空洞がない、単に屋根を増やしただけ、空洞が原画で数ピクセルに潰れる、用途が薄板屋根と区別できない、元カメラ/速度/原ゲームを改変した、旧K4R/K4Uの失敗造形を反復した場合はART REJECT。真正候補GLBや連続走行が存在しない場合はART **NOT_TESTED/HOLD**。画素面積の大きさ、611/1764の投影ヒット、仮8/24pxを自動採用基準にしない。

## 次の実証計画
**K4Z候補制作の前に**、元K/K3Bの真正PNGを道路別に提示し、(a) 前景道路、(b) 背景A5、(c) 潜在的な開口の方向を**注釈のみ**でレビューできる最小審査シートを整備する。道路0・1と4〜6を含め、画面が読みづらい例も削除しない。モデル・コライダー・ゲーム改変0のまま、ARTレビューの基準と不合格理由を確立する。ART採用0／Slope2 DNA0m／SAT・CCD・HUMAN・FPS・RELEASE・MERGE HOLD。Work事前許可、PR Draft未マージ。
