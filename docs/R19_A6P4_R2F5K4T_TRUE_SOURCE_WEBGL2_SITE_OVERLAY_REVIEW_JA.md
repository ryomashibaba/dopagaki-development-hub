# DOPAGAKI SLOPE K4T — 元WebGL2原画でのRoad0市場移設の代理範囲比較（新建築モデル0）

**2026-11-02 JST。** GitHub正本 `ryomashibaba/dopagaki-development-hub`、Draft PR#46の `p101-velocity-overdrive-native-trial`限定。原物理240Hz、B48 7道路、B51 28、元カメラ、main、Gold、P100、W9-X、B5、本番2URL変更禁止。K4/K4R同じ市場位置の**ART REJECT 2回**と、K4S元真正42カメラ・元A5 BVH遮蔽TECH限定PASSを継承。正式ART採用0件、Slope2 DNA0m。

## 研究質問と固定判定

K4Sでは元K/K3B真正カメラ42状態と元A5 5メッシュ全10,566三角形で8地点×42カメラの元建築遮蔽を計算し、[K4S独立ART HOLD正本](R19_A6P4_R2F5K4S_TRUE_SOURCE_7ROAD_BVH_SITING_STUDY_JA.md) に保存。独立実測1,344サンプル値が本物のCIと全部一致した。元Road0市場の **u=.75/right70m**→**u=.85/right70m**は同じ90×65×32m代理箱で4時刻×両幅すべて中庭9/9が元A5に遮られず画面内に残る。ただし**旧K2の近似射影／代理サンプル**であり、実ゲーム画面での空洞・市場用途を証明しない。

新工程K4Tでは、**本物の原A5 WebGL2 PNG 8枚**（14m／28m×tick265、721、1057、1249）をGitHubのK4R真正Art REJECT実行証拠から取得し、**元ゲームの元球XYZ、カメラ眼／前方がK実走原本と合致**することを個別検証したうえで、同じ1枚の原画に異なる研究地点の代理投影BBoxを各1つだけ後付けアノテーションする。

- **[K4T読取専用可視化・SHA検証コード](../scripts/p101-r19a6p4r2f5k4t-original-webgl2-proxy-review.py)**。本物の原画は一切書換えず、生成画像は**注釈付きコピー**と明記する。オーバーレイの黄色枠は「市場GLBの正確な画素」ではなく「K2方式の近似投影した90×65×32m代理包絡矩形」。屋根、床、真空洞、遮蔽マスクは表現しない。
- [K4T GitHub Actions #41354665119](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41354665119)／[CIソース](../.github/workflows/p101-r19a6p4r2f5k4t-original-webgl2-proxy-review.yml)。K #41312758260、K4R #41351118263、K4S #41352432473の**実Artifact**を直接再取得。元KとK4Rの元カメラEye/Front/球XYZ/速度一致・原WebGL2 PNGの実バイト数とSHAをチェック。
- 出力予定：14m/28m×4tick＝8個の横2枚対比PNGと、各幅4tick縦連結の2つのレビュー用JPEG、16個の候補×画面根拠を持つJSON。**これは新WebGL2建物をレンダリングする工程でない**。元写真の上に代理矩形を描く静的審査であり、数学的代理BBoxと原シーン文脈の距離感・遮蔽構成をチェックする。
- 原A5の真の原画なので視野内の既存道路・巨大都市骨組みとの**構図比較**はできるが、黄色枠の輪郭や見える内容は仮数学的位置を表すだけ。元A5以外の遮蔽、道路/B51、実GLB、実人間の視認性を測っていない。

## 次工程の条件

- GitHub CIの全job・原Artifact・全8原画SHA・8組比較PNG・2枚のシート実物を確認する。原画の元XYZ/カメラが違えばFAIL、黄色枠が画面外なら確認できた事実を残し、品質評価に不利な点も記録する。
- 元A5の前後・街区のスケールが画像構図上有望かを**実画像で独立評価**。この静的オーバーレイが合格しても正式ARTや新建築製作の許可とはしない。建築的空洞が明確に見える条件がない限り、建築量産STOPを維持する。
- ART 0件、Slope2 DNA 0m、新モデル／新コライダー0、独立固有B48/B51 SAT・CCD、HUMAN、FPS、GAMEPLAY、RELEASE、MERGE全HOLD。

**初回設計状態：K4Tコード／専用ActionsはGitHub保存・CI起動。実行成功・画像の内容の独立判定は未認定。**
