# K4BH — Road5のSource Camera画面全体を美術として作り直す工程

更新：2026-11-04 JST。

## 正本と固定契約
前工程 [K4BGの確定評価](R19_A6P4_R2F5K4BG_SOURCE_CAMERA_COHERENT_CIVIC_ESCARPMENT_JA.md)を継承。K4BG修正済みActions #41726814278は編集可能DCC/本物の元Camera数値2時点/原B48形状が保持された**技術PASS**、しかし**ART REJECT**。正式ART採用0、Slope2 DNA0m。繰り返し箱・面積の広い単調路面・遠景に何もない構図を再使用しない。

ユーザーの最上位目標は世界水準の高速3Dレーシングゲームとしてのコース全体の美術完成。ただし今回の制作は**Road5の単一Hero短区間・編集可能Blender・ART FIRST**であり、他6Roadに拡張する権限も合格もない。

公式ゲームは決して変更しない。凍結原blob `af076d67492a677d2235e4730aef8cdf4808e106`、B48元7道路／B51元実動体28、240Hz／球半径0.65m／元Camera6数値／元安全表示／操作／衝突／速度を不変。main・公式`p101-velocity-overdrive-native-trial`・Draft PR #46・本番2サイトを不変更。Work事前承認、ユーザー側ローカル操作要求を禁止。

## 実装したK4BHの候補
- `scripts/p101-k4bh-sculpted-sea-gate-hero-art.py`：K4BG修正版の真正Blender原本（SHA256 `b665c84a88d719c4615638cfeb95ab5fe92a84a3a07d3ebe096dd540dd749b2f`）を開き、過去ART REJECT DCC造形を削除せず非表示。
- 元Road5の頂点・面を再ハッシュして不変保証。DCC表面のみ高密度火山岩コンポジットの物理シェーダーに変更。これは**実ゲーム内での安全な新道路素材ではない**。
- 実Source Cameraの方位とeyeを世界空間の単一の設計基準とし、左右公共建築の連続崖・深い居室・屋内暖色光、遠方の広い公共ゲート、異なる形状の都市ランドマーク、後方の海岸地形を**新しい編集可能メッシュ**として制作。重ねるのではなく旧候補を隠す。
- 天空はNishita実大気、単一太陽と用途のある室内面光源。画面の配色・遠近感・光まで同時に改める。元CameraとDCCを同一視しない。
- 元source control tick11307／ultra tick11341を**元Camera完全不変の2枚**でレンダリング。ARTに十分な見栄えがないなら残り4視点や他道路を製造しない。

## 検証と失敗報告の境界
新専用[Actions #41731470838](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41731470838)を起動済み。この文書を書いた時点で実レンダリングの結果・CI SUCCESS・真正画像・Art合格は未判定。毎回現在のstateとArtifactをGitHubで確認する。成功しても `SOURCE/DCC TECH PASS` と `ART判定` を別記する。

静的B48/B51交差検査・0.65mのクリアランス・全B51時刻・SAT/CCD/HUMAN/FPS・実WebGL2走行画面は**実行していない**。危険に当たらないことを推定しない。全体ART/SAT/CCD/FPS/HUMAN/RELEASE/MERGE HOLD、正式採用0件／Slope2 DNA 0m。旧ART REJECTは撤回しない。
