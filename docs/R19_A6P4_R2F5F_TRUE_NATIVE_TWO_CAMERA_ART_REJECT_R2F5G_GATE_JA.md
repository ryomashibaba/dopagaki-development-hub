# DOPAGAKI SLOPE — R19 A6 P4 R2F5-F 独立2カメラ原画審査・ART REJECT・R2F5-Gゲート

**2026-11-01 JST / ブランチ `p101-velocity-overdrive-native-trial` / PR #46 OPEN Draft未マージ。**

## 結論

**R2F5-F SOURCE/TRUE BLENDER/INDEXED GLB/ORIGINAL WEBGL2 TECH限定PASS、厳格ART REJECT。** 正式美術採用0、Slope2 DNA認定0/2,912m。B48/B51新Fモデル固有の厳密安全、リアルタイムB51画素可読性、CCD、実地盤支持、人体歩行、Windows/iPhone FPS、GAMEPLAY、RELEASE、MERGEは全HOLD。

## 1. 再現できる証拠

- [本当の新F実装コミット`4eaae279`](https://github.com/ryomashibaba/dopagaki-development-hub/commit/4eaae279d58c0fe74d6a9c9961eb6694bb5dd21c)。旧R2F5-B/D/Eを不変保存。新F専用のNative Blender module、Eを原本にしたSHAチェック付きwrapper、GLBパック・2画像取得、旧Eとの実PNG pixel audit、既存ActionsにF実行工程を追加。
- [真正GitHub Actions #41294304510](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41294304510)：**全Job SUCCESS**。旧A/B/D/E回帰、元240Hz物理・B48×7/B51×28、FのBLEND×2・GLB×2・glTF独立GPUデコード・元1921tick画像2枚、旧Eとの同一原カメラ比較まで成功。
- 既存workflowのコピーベース工程名には**既知の小さなラベル誤り**が残る：step #24は `R2F5-E genuine multi-level station...` と表示されるが、実際のシェル引数・生成ファイル・原Artifactは **R2F5-F**。Step #23が本当の旧E。今後の新工程実装と同時に**#24の表示名だけ是正**する（名前を直すためだけに高価なActionsを再実行しない）。
- [真Artifact #13078872759](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41294304510/artifacts/13078872759)：実ZIP **27,477,702 bytes**、ダウンロード原本SHA256 `da6e5d2645b0c9dbced0a8a49c95571bdb25e853118f12a8bcc51d9f85ab4947`、全**106ファイル**、F固有**12ファイル**（BLEND2、GLB2、audited GPU2、Blender report2、native WebGL2 PNG2、native JSON1、pixel audit1）。
- **Native実Blender 49部品、実Blender faces 22,198、インデックスGLB GPU triangles 44,172（両幅・上限50,000未満）。** 原物理 source Git blob `af076d67492a677d2235e4730aef8cdf4808e106`、元カメラ、元240Hz球、B48・B51数、Gold/P100/W9-X/B5・本番2サイトとmainの変更はなし。追加物理Collider 0。実BLENDとGLBが存在することは都市としての美術合格ではない。
- 元1921tick真正WebGL2レンダラー report `errors=[]`、`comparisons.length=2`、実PNGのSHA256は原Artifactから**独立確認PASS**：
  - 14m ultra：`9ed187fd30218e39909adaf97bd549d118dd1452655567b77517502cd298ced5`
  - 28m control：`b41b757b5462778be0f99e4a2883dfca2cd00272a65f7f6b1c681a08432d85f8`
- 元物理球XYZ誤差 ultra **0.00030558m** / control **0.00045542m**。速度誤差 ultra **0.00046330m/s** / control **0.00027500m/s**。

## 2. 旧E→新Fの真カメラ比較

**同一元ソースA1 8.004秒、元1921tick、画像1013×698、14m/28m独立**。旧Eの「骨組み2塔」に比べ、新Fには一つの長い厚い屋根、連続する暗い街区マス、正面に残された門状の開口が映る。デザインコードが増えたからではなく、真正画面を実際に確認した。

| 指標 | 14m ultra | 28m control |
|---|---:|---:|
| 新F投影BBox X | 106.91–303.13px | 98.03–300.01px |
| 新F投影BBox Y | 236.67–318.32px | 235.84–319.62px |
| 新F投影高さ | **81.65px** | **83.78px** |
| 旧E投影高さ | 104.23px | 106.62px |
| E→F RGB最大チャネル差>36：全画面 | **1.39745%** | **1.46958%** |
| E→F RGB差>36：左建築ROI | **9.53764%** | **10.02992%** |
| E→F RGB差>36：中央道路ROI | **0.00000%** | **0.00000%** |

面積・画素差・投影高さは**品質PASSではない**。BBoxは実建物頂点の幾何射影であり、元画面のラスタ遮蔽証明ではない。

## 3. 独立ART REJECTの理由と反省

R2F5-Eでの『2本の独立塔』の視覚的欠点は改善した。しかし、R2F5-Fの駅市場は元高速走行画面の左側で**暗い青い大箱／長い壁／車庫風の浅い正面開口**に見える。左右の店舗、乗換回廊、公共地盤の人間らしい使用感と、背後の街区の連続性を読み取れない。元速度約105m/sの原視点では、現状の**200px幅×80px高程度**の視覚領域が課題の核心。モジュール数を増やしても物語性・人間スケールは確立しない。

- 一体感だけの改善をアート合格に変換しない。「2塔→巨大壁」の失敗パターンは歴史的に既に不採用。今回も**ART REJECT／正式採用0**。
- 黄色い暖色を足す・光量を上げる・柱を数本追加する反復は禁止。巨大な屋根や基壇を増やしてさらに壁にすることも禁止。
- 元B48/B51の旧検査がSUCCESSでも**Fモデル固有の衝突PASSではない**。地盤支持や人が通れる証拠はまだ一切なく、`nativeSupportError:0`は計算用値でしかない。
- 静的2画像しか審査していないため、他時間帯や動体B51の視認性は無証明。

## 4. 次 R2F5-G 方針（計画・新モデル未実装）

**フルBlenderで大型構造物を量産する前に、元1921tick両幅の実スクリーン領域（約200×80px）を起点とするカメラファーストの視覚設計ゲートへ変更。**

1. 施設が数秒しか視認されない現状を認識し、**1つの輪郭、1つの明確な大開口、2〜3つの機能が違う立体ゾーン**で『交通駅の入り口・市場の場・公共通路』を一瞬で読み取れる構成を、真カメラで投影チェックする。単なる左右2塔、平板壁、巨大ゲートの再現は禁止。
2. 新建築を長い箱の面で塞がず、**前景の3D公共歩行路から奥の市場・街区まで実際に見通せる空洞、強い前後差、道路の方向に合う建築稜線**をモデルで実現する。道路・カメラ・物理・透明床・偽サポート・見えない物理は変更／導入しない。
3. 機能・動線の自明性、地盤・支持構造、速度105m/s時の視覚的な用途の判読を**2枚の元WebGL2 PNGで独立審査**。事前投影値だけで合格しない。初めて価値が確認できたら、その候補GLB固有の元B48静的厳密、B51 28×2881×2幅離散SAT、tick間CCD、元B51ラスタ、fps/humanまで進める。
4. 効率改善のため大量の古い前処理再実行を前提にせず、既存原本検証を残しながら、アート仮説の真2画面を低コストに得られる工程を技術調査する。**未検証の近道で安全PASSを省略しない。**

**総括：R2F5-F SOURCE TECH限定PASS / ART REJECT / 新F衝突HOLD / HUMAN・GAMEPLAY・PERFORMANCE・RELEASE・MERGE HOLD / PR#46 Draft未マージ。**
