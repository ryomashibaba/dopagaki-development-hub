# DOPAGAKI SLOPE — K4R Road0同一市場・Native Blender構造改修／真正WebGL2審査

**2026-11-02 JST。** 正本 `ryomashibaba/dopagaki-development-hub`、Draft PR #46、研究ブランチ `p101-velocity-overdrive-native-trial`。旧K4のART REJECTを覆すための独立候補1案。**新候補を追加量産していない。正式ART採用0件、Slope2 DNA認定0mを継続。**

## 原因と制作変更

K4 [元16枚の真正画像と独立ART REJECT](R19_A6P4_R2F5K4_ROAD0_ONE_NATIVE_MARKET_16_TRUE_WEBGL2_TECH_PASS_ART_REJECT_JA.md) では、30m程度の小屋根がA5の元巨大構造の足元に現れ、実際の高速チェイスカメラから公共空間・用途・都市的奥行きが認知できなかった。新造形ではRoad0 u=.75の**右路端から70m**、K2の暫定包絡**90×65×32m**、中央空洞区域を維持し、形状を以下の一案へ直接再設計した。

- 西側は低く深く切り込む折板シェル、東側は最大31m級の非対称立体シェル。元K4の小屋屋根を単に追加しない。大壁・巨大門・反復柱・孤立二小屋・薄い長尺リボンの再発を避ける。
- **x=-10〜10m、y=-15〜15m、z>3mに候補制御点がない**空に開いた中庭。これは限定的な制御点判定であって、元B48/B51三角形SATや実人間歩行の証明ではない。
- 建物の高低差を表す複数の立体的なテラス、張出し床、段差付き広場、公開連結面、長い正面街路を配置。**見た目の床は原物理でのコライダー0、実歩行可能性は未確認**。見えない床、磁力、テレポートなどゲーム安全装置として使用しない。

## K4R独立実装

- [K4R造形](../scripts/p101-r19a6p4r2f5k4r-open-market.py)
- [Blender原A5 5メッシュ直接編集](../scripts/p101-r19a6p4r2f5k4r-native-placement.py)
- [原source blob＋GPU readback private bundle](../scripts/p101-r19a6p4r2f5k4r-private-pack.mjs)
- [真正16画像 WebGL2／元球XYZ速度／カメラ再現](../scripts/p101-r19a6p4r2f5k4r-true-original-webgl2.mjs)
- [K4R単独GitHub Actions](../.github/workflows/p101-r19a6p4r2f5k4r-native-road0-open-market.yml)
- [K4R Actions #41351118263](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41351118263) — 研究コード保存時に起動。**成功・失敗は実際のCIを確認するまで保留**。

原ゲームソース Git blob `af076d67492a677d2235e4730aef8cdf4808e106`、B48 7区間、B51 28基、240Hz、球半径、自然ジャンプ、操舵・CCD、元カメラ、元GLB 5メッシュ、main/Gold/P100/W9-X/B5/本番2URLは変更禁止・非変更。旧ART REJECT B/F/G2/I建築を混入しない。ゲーム走行に追加コライダー0。

## 審査契約（画像実物と独立ART判定が必要）

1. GitHub ActionsのpreflightとBlender 4.0.2、二幅BLEND/GLB/原GPU三角形数読戻を検査。
2. 元原A5とK4Rの**14/28m×tick 265/721/1057/1249＝16PNG**を真正Chromium WebGL2で生成し、全PNGのSHA256とJSON整合、元240Hz球XYZ/速度、ball-lock-unfiltered-headingカメラ誤差を検査。
3. 旧K4の真16PNGとの同時刻視覚比較も行い、**建築用途、開放中庭の視認性、奥行き、スピード時の認識、巨大構造とのスケール関係**を人間が独立評価する。単なるピクセル差は美術合格条件としない。
4. ARTをREJECT可能に保ち、後で改善が実証できた場合にだけ候補固有B48/B51 SAT・CCD・地盤・B51ピクセル可読性・HUMAN・Windows/iPhone FPSを進める。

**本書初回記載時の状態：K4R造形／専用Blender・pack・16画像 runner／専用Actions実装とGitHub保存済み。Actions実行結果待ち。K4R TECH/ART未判定。公式ART 0件、Slope2 DNA 0m、SAFETY/HUMAN/PERFORMANCE/RELEASE/MERGE HOLD。**
