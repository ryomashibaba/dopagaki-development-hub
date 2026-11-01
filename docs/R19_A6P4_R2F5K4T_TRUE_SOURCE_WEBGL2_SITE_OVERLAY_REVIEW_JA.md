# DOPAGAKI SLOPE K4T — 元WebGL2原画でのRoad0市場移設の代理範囲比較（新建築モデル0）

**2026-11-02 JST。** GitHub正本 `ryomashibaba/dopagaki-development-hub`、Draft PR#46の `p101-velocity-overdrive-native-trial`限定。原物理240Hz、B48 7道路、B51 28、元カメラ、main、Gold、P100、W9-X、B5、本番2URL変更禁止。K4/K4R同じ市場位置の**ART REJECT 2回**と、K4S元真正42カメラ・元A5 BVH遮蔽TECH限定PASSを継承。正式ART採用0件、Slope2 DNA0m。

## 研究質問と固定判定

K4Sでは元K/K3B真正カメラ42状態と元A5 5メッシュ全10,566三角形で8地点×42カメラの元建築遮蔽を計算し、[K4S独立ART HOLD正本](R19_A6P4_R2F5K4S_TRUE_SOURCE_7ROAD_BVH_SITING_STUDY_JA.md) に保存。独立実測1,344サンプル値が本物のCIと全部一致した。元Road0市場の **u=.75/right70m**→**u=.85/right70m**は同じ90×65×32m代理箱で4時刻×両幅すべて中庭9/9が元A5に遮られず画面内に残る。ただし**旧K2の近似射影／代理サンプル**であり、実ゲーム画面での空洞・市場用途を証明しない。

新工程K4Tでは、**本物の原A5 WebGL2 PNG 8枚**（14m／28m×tick265、721、1057、1249）をGitHubのK4R真正Art REJECT実行証拠から取得し、**元ゲームの元球XYZ、カメラ眼／前方がK実走原本と合致**することを個別検証したうえで、同じ1枚の原画に異なる研究地点の代理投影BBoxを各1つだけ後付けアノテーションする。

- **[K4T読取専用可視化・SHA検証コード](../scripts/p101-r19a6p4r2f5k4t-original-webgl2-proxy-review.py)**。本物の原画は一切書換えず、生成画像は**注釈付きコピー**と明記する。オーバーレイの黄色枠は「市場GLBの正確な画素」ではなく「K2方式の近似投影した90×65×32m代理包絡矩形」。屋根、床、真空洞、遮蔽マスクは表現しない。
- [K4T GitHub Actions #41354665119](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41354665119)／[CIソース](../.github/workflows/p101-r19a6p4r2f5k4t-original-webgl2-proxy-review.yml)。K #41312758260、K4R #41351118263、K4S #41352432473の**実Artifact**を直接再取得。元KとK4Rの元カメラEye/Front/球XYZ/速度一致・原WebGL2 PNGの実バイト数とSHAをチェック。
- 出力予定：14m/28m×4tick＝8個の横2枚対比PNGと、各幅4tick縦連結の2つのレビュー用JPEG、16個の候補×画面根拠を持つJSON。**これは新WebGL2建物をレンダリングする工程でない**。元写真の上に代理矩形を描く静的審査であり、数学的代理BBoxと原シーン文脈の距離感・遮蔽構成をチェックする。
- 原A5の真の原画なので視野内の既存道路・巨大都市骨組みとの**構図比較**はできるが、黄色枠の輪郭や見える内容は仮数学的位置を表すだけ。元A5以外の遮蔽、道路/B51、実GLB、実人間の視認性を測っていない。

## 【K4T最終原CI照合：TECH限定PASS／美術・配置決定HOLD（2026-11-02）】

- 初回 [#41354665119](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41354665119) は `--` がない通常Python引数に対してBlender形式 `argv.index('--')` を必須にしていた単純な起動不備でFAIL。原画や元physicsの不一致は観測前に停止。原ゲームや美術品質には起因しない。[修正 `3776f4d6`](https://github.com/ryomashibaba/dopagaki-development-hub/commit/3776f4d63141b579bfcd506029dc2ed6b184940a) は通常PythonとBlenderの両引数形式を許可するだけ。
- **[修正後Actions #41355153090](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41355153090)全job SUCCESS**、実行HEAD `3776f4d63141b579bfcd506029dc2ed6b184940a`。[Artifact #13102728886](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41355153090/artifacts/13102728886)を実ダウンロード。ZIP3,307,518バイト SHA256 **`919964f4e3159baf87ed89dcbfdac7f69a5c27517fde5ad39794315b6b609fd3`**、11ファイル、CRC・ZIP構造PASS。8個の「両配置の注釈を載せた同一元WebGL2原画」PNG、2枚の4時刻縦結合JPEG、根拠JSON SHA256 **`906adfab4088bd590a08c27dc9799b6a891ce345fe1f3c0778231a3b95eccaf0`**。
- 元A5 PNG 8/8の元SHAとカメラ眼/前方/球XYZ/速度をK/K4R真原本と照合したCIはPASS。**右側へu=.85に移すと元A5遮蔽が減ってtick1249でも画面内に残りやすいが、tick265/721/1057の代理BBox面積が小さくなる**。元ゲーム・カメラ・右路端+70mは不変。現実に建物を移した画像ではなく、黄色枠で近似位置を示すだけの**研究成果**である。
- 次研究K4Uに進む場合も**新形状案を制作しない**。凍結K4Rと同一34モジュール／668面を元A5 5メッシュへ組込む位置だけ`u=.75`→`u=.85`に変え、本物の元A5 WebGL2 4tick×2幅×原/移設候補16枚を真正レンダリング、K4R元の候補8PNGと直接比較する。造形改善・物理/カメラ・コライダー追加禁止。これでも公共空洞が読めなければ再REJECTし、再び大型化を繰り返さない。

**K4T SOURCE/ANNOTATION TECH限定PASS、位置選定本決定HOLD、正式ART採用0件、Slope2 DNA認定0m、独立B48/B51 SAT・CCD/HUMAN/FPS/RELEASE/MERGE HOLD。**

---

## 独立ローカル真元A5画像8枚での比較実見（CI最終判定とは区別）

- K4R正規Artifact #13101775313から原A5の8 WebGL2スクリーンショットを再取得、原JSONに記録された8/8のPNG SHA256・画角1013×698・元各tick/source cameraのEye/Front/XYZを元K真正Camera JSONと直接照合し一致。**2幅×4tick、旧 u=.75/右70m と仮 u=.85/右70mを元の同じPNGに図示した現実画面の近似位置比較**を別途作成・実見した。ただし**注釈後の画像自体はゲームが描画した本物の新市場ではない**。真実の原背景だけWebGL2。
- 旧K4R位置は5.204秒/tick1249で元建築の右画面端に広がり、代理矩形がかなり画面外にはみ出す。移設仮位置は同一時刻に右側の道路沿い背景でより長く画面内に残る。実際の市場の屋外空洞・商業街路としての読みやすさは**この注釈では不明**。
- **重要なトレードオフ：** 研究仮位置は元A5遮蔽が減った一方、旧位置に比べ**代理スクリーン投影BBoxの面積が前半の真カメラtick265／721／1057で狭くなる**。下記はK2の近似・原画像上の代理BBox（正しい建築のピクセル面積でない）。

| 14m元tick | 旧u=.75 proxyBBox面積 | 仮u=.85 proxyBBox面積 | 仮位置の元A5非遮蔽外殻 | 仮位置の中庭 |
|---|---:|---:|---:|---:|
| 265 | 6,742.71 px² | 5,009.77 px² | 61/75 | 9/9 |
| 721 | 15,454.47 px² | 9,615.43 px² | 63/75 | 9/9 |
| 1057 | 48,386.47 px² | 21,672.19 px² | 60/75 | 9/9 |
| 1249 | 72,482.43 px² | 45,482.22 px² | 63/75 | 9/9 |

- **位置の遮蔽改善と街区の大規模な視覚的存在感には衝突がある。** この証拠では、仮u=.85を美術的な市場として採用することも「旧u=.75より品質が高い」と断言することもできない。原資料に基づく複数の位置案を継続研究し、実市場モデルへの復帰前に**正確な真WebGL2視線と実物の建築構成に繋がる根拠**を求める。

## 次工程の条件

- GitHub CIの全job・原Artifact・全8原画SHA・8組比較PNG・2枚のシート実物を確認する。原画の元XYZ/カメラが違えばFAIL、黄色枠が画面外なら確認できた事実を残し、品質評価に不利な点も記録する。
- 元A5の前後・街区のスケールが画像構図上有望かを**実画像で独立評価**。この静的オーバーレイが合格しても正式ARTや新建築製作の許可とはしない。建築的空洞が明確に見える条件がない限り、建築量産STOPを維持する。
- ART 0件、Slope2 DNA 0m、新モデル／新コライダー0、独立固有B48/B51 SAT・CCD、HUMAN、FPS、GAMEPLAY、RELEASE、MERGE全HOLD。

**初回設計状態：K4Tコード／専用ActionsはGitHub保存・CI起動。実行成功・画像の内容の独立判定は未認定。**
