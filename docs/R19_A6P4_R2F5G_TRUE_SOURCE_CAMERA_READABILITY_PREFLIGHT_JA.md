# R2F5-G — 原A1カメラ読解性の低コスト予備検証（実美術合格ではない）

2026-11-01 / 開発ブランチ p101-velocity-overdrive-native-trial / PR #46 Draft

## 目的と原本
Fの「暗い巨大壁・車庫風」失敗をBlenderで何度も繰り返さないため、F正規CI #41294304510・Artifact #13078872759に基づく世界座標中心と、`docs/R19_A6P3_PRIOR_A1_ORIGINAL_12_TRUE_CAMERAS.json`の元1921tick・14/28m二種を使い、元の投影式で形態仮説を低コスト比較する。ゲームの速度は当時約105m/s、施設の実領域は概ね200×80px。

## 予備調査
| 案 | ultra 14m | control 28m | 主な問題 |
|---|---|---|---|
| G0 旧壁型（負例） | HOLD | HOLD | 入口後ろの大壁投影重なり1.000 |
| G1 奥行きある開放駅 | HOLD | HOLD | 入口後ろの壁重なり約0.58、見かけ高さ不足 |
| **G2 低い公共広場＋奥の乗換施設** | **代理条件PASS** | **代理条件PASS** | 実遮蔽・美術・構造・物理は未確認 |

G2：入口投影幅 ultra **62.60px**・control **64.47px**、高さ約40.30/41.26px、3機能の最小中心間隔約42.66/43.18px、入口から奥への投影中心差約9.42/9.76px、奥側の大きい壁が入口と重なる矩形比率 ultra約**0.088**、control約**0.079**。いずれも**カメラ空間の代理計算**であり、元WebGL2の真画素や奥の実見通しではない。

## 監査・次の順序
新`scripts/p101-r19a6p4r2f5g-camera-readability-gate.mjs`、`tests/p101-r19a6p4r2f5g-camera-readability-gate.test.mjs`。軽量なread-only handoff workflowでテストできる。**G2は真Native Blenderを生成しておらず、正式ART未審査**。形態の前検査を通過した一案のみを次にリアル3D化し、原1921tick 14/28m真正WebGL2画像で実際の都市機能の読みやすさを厳格審査。G2でも巨大壁や人が使えない構造に見えたらREJECT。ART候補となって初めて新GLB専用のB48、B51×2881tick、CCD、FPS、HUMANへ。

**公式：ART0・Slope2 DNA 0/2912m／HUMAN・GAMEPLAY・RELEASE・MERGE HOLD／PR#46 OPEN DRAFT。**
