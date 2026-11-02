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

## 【2026-11-02 K4Y真正原画像・審査シート最終監査：SOURCE TECH限定PASS／ART NOT_TESTED・HOLD】

[**GitHub Actions #41424253272**](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41424253272) **全job SUCCESS**、試験HEAD `638c5a81e7d6091c2b22d0dd93f5c029bb0c43b9`。[**Artifact #13131795766**](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41424253272/artifacts/13131795766) 実ダウンロードZIP **5,330,171 bytes／SHA256 `d7b5b2637c4dc01095768af0cf6be04898c1b7d46f73624fbbda146606033415`**、**17ファイル・ZIP CRC全PASS**。原JSON `K4Y_7ROAD_NATIVE_SOURCE_ART_REVIEW_CONTRACT_EVIDENCE.json` **78,348 bytes／SHA256 `55f027f8b0d9b0a1e754e3bb8706ed36b32501022593d6a50e72cd21e10435b7`**。

- [**K4Y解析・審査シート生成コード**](../scripts/p101-r19a6p4r2f5k4y-seven-road-native-source-art-review.py)／[**K4Y専用CI・SHA改ざん拒否テスト**](../.github/workflows/p101-r19a6p4r2f5k4y-real-source-review-atlas.yml)を実装・GitHub保存。元ゲームsource Git blob `af076d67492a677d2235e4730aef8cdf4808e106`、凍結元K4R建築Git blob `e653029771982b2c39ee2831ea19199f0704ddaa` は不変。
- K原画像**30枚**＋K3B原画像**28枚**＝**58枚すべて元PNGの実ファイルサイズ・SHA256一致**。重複撮影の12件は両系列のPNG SHA一致。重複を除くK前半13状態＋K3B後半8状態／道路幅ごと21状態、両幅**42状態**の元カメラ・元球/速度を審査用JSONに保持。元K4Xの1,764件・画面投影611件とロード別診断14件も元原本で検査。KとK3Bの記録は**一続きの走行証明ではない**。
- 生成物は**道路別14PNG（14m・28m×Road0〜6）＋全7道路概観2PNG＋根拠JSON1件**。道路別PNGは元の撮影順から原則「最初・中間・最後」を選び、元記録が1/2枚なら**足りない枠は欠測と明記**。画像は元PNGの縮小コピーであり、ゲームに市場や仮の人物を描き加えていない。Road0/1だけでなくRoad4/5/6の原画像を明示。元SOURCE上の都市骨組み・前景道路は**確認できる**が、未制作の公共中庭や用途の可読性は検証対象に存在しない。
- **14道路幅別審査行×5独立ART欠落ゲート**を構造化。真の新候補GLB空洞、道路と中庭の実支持・B48/B51 SAT/CCD、入口/中間/奥の人間による3層認知、元A5との同カメラ候補A/B画像、連続実走の視認時間がすべて未確認。42真フレームに元画像SHA・Eye/Front・球XYZ/速度・`unknowns`を保持。**`K4YIndependentART=NOT_TESTED_HOLD`、K4R/K4Uの過去ART=REJECT、正式ART0/Slope2 DNA0m**。数学的可視611件から候補採用ランキングを作らない。
- 原ZIPをCI内で展開・再ZIP化した場合は転送時のZIPバイトSHAが変わるため、**再ZIPのSHAと過去転送ZIPのSHAを一致必須にしない**（元PNGごとのSHAと共通12枚一致を厳格検査する）。故意にSHA256を改ざんしたPNG記録はCI負例テストで正常に拒否し、1・2時点しかない道路の欠測表現もテストPASS。

### 道路別の証拠密度（各道路幅で共通）

| 道路 | 42真正フレーム中、幅ごとの元記録数 | 採用した撮影tick（14m/28m共通） | 研究上の制約 |
|---|---:|---|---|
| Road0 ABYSS_DIVE | 4 | 265/1057/1249 | 現A5骨組みは描かれるが公開市場の新候補なし |
| Road1 CROWN_REVERSAL | 6 | 1921/3361/4321 | 曲線上の3時点は比較可能、連続視認の保証なし |
| Road2 SCISSOR_RISE | 2 | 4801/5761 | 中間時点欠測 |
| Road3 LOWER_REVERSAL | 4 | 6721/8640/9120 | K早期とK3B後期が混在、連続走行と誤認禁止 |
| Road4 VOID_SURGE | 2 | 9600/10320 | 中間時点欠測 |
| Road5 PRISM_CREST | **1** | 11040のみ | **本当に1時点だけ**。時間的視認の評価不能 |
| Road6 FINISH_RIDGE | 2 | 11760/12240 | 中間時点欠測 |

**判定：技術的な「独立ART審査に使える原画資料の作成」はPASS。ART採用判定自体はNOT_TESTED/HOLD（過去K4R/K4UはREJECT）**。元ソースの物理・240Hz/カメラ/球/B48×7/B51×28/元A5/Gold/P100/W9-X/B5/main/本番2URL変更0。新建築・コライダー・仮人物モデル0、HUMAN/FPS/全候補SAT/CCD/RELEASE/MERGEは全HOLD、Draft PR#46 OPEN未マージ。

### 次の正当な工程K4Z

新しい建築の試作にはまだ戻らず、まずRoad5（現1時点）・Road2/4/6（現2時点）の時間的な証拠不足を埋める**元ゲーム真正WebGL2/元カメラの追加ソース撮影**を研究する。元240Hz物理と合法操舵・同一撮影系列のまま撮影間隔・静止点・取得漏れを厳密記録し、欠測や不連続は欠測として残す。「視認可能秒数」の実証には元画面・対象3D構造・人間認知の別立証が必要。単なる撮影フレーム増加や別系列の継ぎ合わせを視認PASSとしない。

---

## 次の実証計画
**K4Z候補制作の前に**、元K/K3Bの真正PNGを道路別に提示し、(a) 前景道路、(b) 背景A5、(c) 潜在的な開口の方向を**注釈のみ**でレビューできる最小審査シートを整備する。道路0・1と4〜6を含め、画面が読みづらい例も削除しない。モデル・コライダー・ゲーム改変0のまま、ARTレビューの基準と不合格理由を確立する。ART採用0／Slope2 DNA0m／SAT・CCD・HUMAN・FPS・RELEASE・MERGE HOLD。Work事前許可、PR Draft未マージ。
