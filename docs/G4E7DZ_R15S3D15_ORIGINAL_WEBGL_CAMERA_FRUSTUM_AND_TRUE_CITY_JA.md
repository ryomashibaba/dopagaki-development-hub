# DOPAGAKI SLOPE — R15S3D15 真正WebGL2カメラ投影に基づく超未来都市再設計

**日付：2026-10-30 JST。研究用 Draft PR #46 / `p101-velocity-overdrive-native-trial`。本番／元物理／元GLSL／元カメラ／メインは変更しない。** 正式ART採用0、Slope2正式認定0m、HUMAN/GAMEPLAY/PERFORMANCE/RELEASE/MERGE HOLD。

## 何がこれまでの失敗だったか

R15S3D14R1の[元WebGL2真正24画像 Actions #41044411374](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41044411374)で、新しく追加した15層の公共テラス・中庭が元ゲームの正面カメラでは主に大輪の縁や画面端に投影され、170～190m/s級の実走行では**正面に壮大な居住都市が現れていなかった**。建築部材を追加しても体験の時間設計が破綻する問題を認識。従って「さらに地物や窓を増やす」手法を止め、元カメラ・実道路・ネイティブtickを測ってから絵作りする研究に転換。

## R15S3D15：真正元WebGL2 source cameraの実測定

- [真正Actions #41047602697](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41047602697) **SUCCESS**／[Artifact #12972194661：真カメラ10PNG+全候補座標と元GLSL投影JSON](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41047602697/artifacts/12972194661)。
- 元PRIVATE`drive3d`と元合法自動P96/P94/A13・元Runner/CCD 240Hz/本物の全7 B48・28 B51・元HUD・元ゲーム正規RAWカメラを維持。元`viewForPose()`による真のcamera `eye/front/right/up`・球位置を**隔離 PRIVATE コピーのみで読取専用**観測。tru e-pinch/pinch-switchの2世界×54/58/61/64/67秒の合計10フレーム、正確な元tick 12960/13920/14640/15360/16080。カメラベクトルのノルム・直交性・元WebGL2実体と真の路面/動体の本数を検査。
- 本物の`sample(real B48, u,v)`で求めた道路5/6中心・横幅±120/240m、相対高さ0/100/200/330mの候補点を元GLSLの`1.35*x/aspect/z`，`1.35*y/z`によって**同じカメラ座標へ本当に投影**し、画角中央に入るか・前方深度・カメラ中心とのずれをJSON化。
- 元ステージ選択器が有効ステージへの切り替え直前に一度出す `Invalid stage or spawn record key` 警告は**記録して保持**。初回CI [#41047236192](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41047236192) は監査がこれを致命的だと過判定したためFAIL。想定外の例外は引き続きFAILとし、真の元球・元画像・240Hz時刻・元ステージが正しく実走した場合に限ってこの警告を記録して受け入れるよう修正。二世界の最終CI SUCCESS。
- **重要な限界**：screen projectionは前方角度・画角に関する基礎データで、**建築の個別遮蔽・B51のピクセルサイズ・将来のゲームプレイ・美術品質を証明しない**。成功でART PASSとしない。

### 監査により確定した中心画角候補の例

| 原時刻 | 実世界 | 真B48の位置 | 相対高さ | 真カメラdepth | 原GLSLの正規化画面座標(x,y) |
|---|---|---|---:|---:|---|
| 58秒 | true-pinch | 道路5 u=.48, 中心 | +100m | 約563m | (+.021, +.553) |
| 58秒 | pinch-switch | 同じ実B48位置 | +100m | 約651m | (+.020, +.521) |
| 61秒 | true-pinch | 道路5 u=.78, 中心 | +100m | 約639m | (+.074, +.519) |
| 61秒 | pinch-switch | 道路5 u=.78, 120m偏位 | +100m | 約760m | (-.070, +.486) |
| 64秒 | true-pinch | 道路6 u=.30, 120m偏位 | +100m | 約636m | (+.113, +.440) |
| 64秒 | pinch-switch | 同じ候補 | +100m | 約738m | (+.134, +.423) |
| 67秒 | true-pinch | 道路6 u=.62, 中心 | +100m | 約321m | (+.025, +.561) |
| 67秒 | pinch-switch | 同じ候補 | +100m | 約439m | (+.054, +.458) |

画面位置の証拠により、主役候補を**道路5 u=.78と道路6 u=.62**へ集中できることを確認。従来の+300m超の横寄せ三日月都市が画面の左右端に映ってしまう原因を分析する基準となる。

## R15S3D15R1：初めて実カメラ位置を設計入力とした真正都市研究

- `scripts/p101-r15s3d15r1-real-camera-anchored-delta-city.mjs`で、上記2か所の元B48真正サンプルに基づく**巨大な非対称空中都市外殻と、開放的な多層公共デッキ**を本物のXYZ/RGB三角形として生成する。A `A_SKY_DELTA_CIVIC_CORE`、B `B_CROWNED_OPEN_SKY_CITY`。前工程の「輪を両路肩に3つ置いて、内側にテラスを加えるだけ」は継承しない。
- 主構造は大きく厚みある3D曲面屋根と下層体積・構造ルート、開口部が真に空く庭/公共中庭を持つ。主都市の位置・左右のスパン・高さは原WebGL2カメラフラスタムで決定。全7元B48・28元B51・240Hz Runner・原p101Step・合法P96/P94/A13・GLSL/カメラ/HUD早期危険予告を変更しない。元球の通路に新しい物理床や当たり判定を置かない。
- `scripts/p101-r15s3d15r1-private-true-webgl2-city-pack.mjs`で別の`dist-private/r15s3d15r1`へコピーし、元背景を重ねずに**新2案を排他的置換**する。true-pinch/pinch-switch 2世界×旧R14R1 Aと新A/B＝計6条件。54/58/61/64/67秒＋元finishを本物の正規RAWカメラと240Hzで撮影し、独立QAで5時点/原`finish`・元7/28と画像差/10の偽認定拒否を照合。
- 原WebGL2・原GPUレンダリングの[専用Actionsワークフロー](https://github.com/ryomashibaba/dopagaki-development-hub/actions/workflows/p101-r15s3d15r1-true-source-cam-framed-megacity.yml)。初期CIは独立アートテストの恣意的な三角形下限を高く設定しFAIL。数値を「美しさ」に使わず、真に空いている公共中庭・厚みある大構造・道路位置・元物理の不変性を維持する静的品質閾値を採用して修正。**真正画像がそろうまで技術も美術も正式承認しない**。

## 次の厳格美術ゲート

1. 元58・61・64・67秒の正規画面の**視線中央の空白**に、空中都市の巨大一体シルエットと具体的に入居できそうな段差・大空洞が実際に出ているかを、旧R14R1 Aと同画面で比較する。
2. 近付いたときに原実B48幅10～16m道路の進行方向と本物の28 B51の警告を損なっていないかを判定。**スクリーン投影成功は衝突回避成功ではない**。元カメラ視線上の都市デッキが実障害物を隠すならREJECT。
3. 天空の骨格が単なる巨大ゲート、白い薄板/天井、同じ窓の反復に逆戻りしていないかを直接批判的に審査し、弱ければ追加の装飾ではなくシルエット・公共都市構成を再設計する。
4. 実機Windows GPU FPS・キーボード操作の人間PLAY QAはまだ実施していないため、CIの自動原球`finished`のみから本番リリースへ昇格禁止。Draft PR #46を維持し公開/マージ不可。
