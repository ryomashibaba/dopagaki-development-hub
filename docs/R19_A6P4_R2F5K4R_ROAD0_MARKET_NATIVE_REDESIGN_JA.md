# DOPAGAKI SLOPE — K4R Road0同一市場・Native Blender構造改修／真正WebGL2審査

**2026-11-02 JST。** 正本 `ryomashibaba/dopagaki-development-hub`、Draft PR #46、研究ブランチ `p101-velocity-overdrive-native-trial`。旧K4のART REJECTを覆すための独立候補1案。**新候補を追加量産していない。正式ART採用0件、Slope2 DNA認定0mを継続。**

## 2026-11-02 独立完了判定 — TECH限定PASS／ART REJECT（正式採用0件）

**CI実行は完了。** [K4R Actions #41351118263](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41351118263) 全ジョブSUCCESS、実行ソースHEAD `fed9c27a0f356e3f9b8ddd142b4302d0f1fd078a`。[独立Artifact #13101775313](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41351118263/artifacts/13101775313) は**4,043,206バイト、実ZIP SHA256 `4e41ad2be9cf2c360a1727d6dfbb372e56c7a08698192dd5da87c807298ddcf6`**、実26ファイル。Native Blender **4.0.2**、編集可能な両幅BLEND/GLB、GPU独立読戻、**実34モジュール／668追加面／原10,566→新11,902 GPU三角形**。ローカル変換座標範囲 x[-44,44]、y[-30,30]、z[-1.2,31.3]m。

**元ソース原本は非改変** `af076d67492a677d2235e4730aef8cdf4808e106`。元B48 7道路／B51 28基／240Hz／球XYZ・速度／ball-lock-unfiltered-headingカメラ／追加collider0。14/28m×元A5/K4R×tick265,721,1057,1249＝**16/16真正WebGL2 PNGを元JSONのSHA256と独立全照合一致**、`errors=[]`。旧K4 Artifactからの**8/8元original PNGともバイト完全一致**。全採取tickで元シーンとK4Rの球XYZ・速度・カメラEye/FrontはJSON精度で差0。スクリプトの再現であり人間走行ではない。

### 元/K4/K4Rの本物の全画面ピクセル差（RGB max difference >36）

| 走行tick（秒） | 幅 | 原→旧K4 | 原→新K4R | 旧K4→新K4R |
|---|---|---:|---:|---:|
| 265（1.104秒） | 14m | 0.1779% | 0.2680% | 0.2887% |
| 265（1.104秒） | 28m | 0.1807% | 0.2667% | 0.2882% |
| 721（3.004秒） | 14m | 0.6107% | 0.8302% | 0.8105% |
| 721（3.004秒） | 28m | 0.6180% | 0.8323% | 0.8129% |
| 1057（4.404秒） | 14m | 1.8526% | 2.4869% | 2.5587% |
| 1057（4.404秒） | 28m | 1.9429% | 2.6127% | 2.6975% |
| 1249（5.204秒） | 14m | 1.5926% | 3.3138% | 3.0448% |
| 1249（5.204秒） | 28m | 1.4297% | 3.2106% | 2.9464% |

数値は**画面全体のしきい値を超えたRGB差分率**であり、建築物の厳密なピクセル領域・美術品質・広場の視認率ではない。新K4Rの最大差分は最後の5.204秒で大きいが、真画像では巨大な元骨組み脇の右端へ折板屋根と段状プラットフォームが移動しているだけで、**市場街路の空間性や屋外公共空洞は読めない**。

### 人間による独立美術判定

K4Rは旧K4の小さな小屋根群に比べて大きな段状テラスが見え、0.18→0.27%・1.85→2.49%・1.59→3.31%など画面上の変化は実証した。しかし4時刻×両幅の実画面を直接検分すると、空へ開く中央空洞も人が利用する空間の奥行きも識別しにくく、前後に積み重なる薄板／屋根状の塊に見える。既存A5の巨大骨組みとスケール・設計言語が混じらず、速度を伴うシーンで独立した市場街区として成立しない。**視認率改善だけでART承認するのは禁止。正式判定は独立ART REJECT、正式採用0、Slope2 DNA0m。**

本K4R候補専用の全道路B48三角形SAT、B51 28基×2幅×2881tick及び連続時刻CCD、障害物の画面遮蔽評価、床支持、実歩行、HUMAN、Windows/iPhone FPS、RELEASE、PR mergeは**一切PASSしていない・HOLD**。独立Artifact保持は7日間、満了後は再実行必要。

### 次の正当な研究工程 — K4S（場所／カメラ優先、制作STOP）

**K4とK4Rが同じRoad0の位置で二連続ART REJECT**したため、同位置でのサイズ・色・面数を増やす改造と別道路への3D量産を一旦停止する。新3Dモデルを書く前に、既存K/K3Bの元7道路真正カメラを使ってRoad0の市場を再配置する必要性、元骨組み前後の遮蔽、道路と背景の投影面積／奥行き／時系列滞留、およびK2 Road2/Road3候補の実元カメラ適否を、**代理ボックス投影のみ**で比較し記録する。これは新候補の正式採用ではない。あらゆるART合格／Slope2 DNA認定と混同しない。

---

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

**旧・CI開始時点の履歴（上の完了判定が最新）：K4R造形／専用Blender・pack・16画像 runner／専用Actions実装とGitHub保存済み。Actions実行結果待ち。K4R TECH/ART未判定。公式ART 0件、Slope2 DNA 0m、SAFETY/HUMAN/PERFORMANCE/RELEASE/MERGE HOLD。**
