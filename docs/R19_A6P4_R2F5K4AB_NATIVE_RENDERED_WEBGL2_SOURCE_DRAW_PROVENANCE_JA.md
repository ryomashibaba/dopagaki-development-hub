# DOPAGAKI SLOPE K4AB — 真の描画群の由来と同一240Hz時刻のWebGL2差分

2026年11月2日 JST。研究正本 `ryomashibaba/dopagaki-development-hub`／`p101-velocity-overdrive-native-trial`／Draft PR #46。

## 【2026-11-02 実測追補：元レンダラ差分は取得済み、独立CI最終判定は別】

**変更したのはK4ABの隔離研究コード／CIのみ**。K4Z固定真正PNG82枚を全SHA再照合後、元Sourceが完全保護された状態でK4ABのprivate GPU描画フレームを14m/28mのRoad5 **7時刻ずつ、計14枚**取得した。各幅の46.0秒／native tick11040で、元球XYZ・カメラEye/Front・速度・道路IDを固定し、元描画群を6種類個別に非表示にした**12個の隔離WebGL2研究画像**と、元描画を復元した原画像2枚の実SHAを記録した。[初回全GPU撮影通過（独立監査はFAIL）Actions #41441353998](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41441353998)／[途中までの原証拠Artifact #13141261497](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41441353998/artifacts/13141261497)（ZIP3,640,617B／SHA256 `eaffd65f609022be48fe1244bf6e6ee2e45b01b26c9319da0887b8dfe4109701`、30ファイルCRC全PASS）。

**不合格を隠さず精査した結果：** 元K4Zの14枚に対する新研究用描画のPNG丸ごとSHA完全一致は**13/14**。28m／47.0秒／tick11280で原PNGの77,605画素に差異が発生し、ピクセル座標の実BBOXは**x219〜794／y426〜575**。元CSS `.nearMissBurst`の`p74pop .24s`アニメーションに一致するHUD範囲に局在し、Road5の道路/球/B51など3Dピクセル差は**実測0**。当初の保守的HUD除外ROI `x220〜799,y418〜589` から左端26画素がはみ出して独立監査がFAILした。**恣意的な3D差分許容率を導入せず、元CSS要素の差が実在した最小限に近い補正**として`x218〜799, y418〜589`だけを除外し、残り`606,970`画素の**全14画像のビット完全一致**を必須化。除外領域内の差分数も記録し、フルPNG SHA一致13/14を明記する。元フレームへ戻した各幅の2画像も独立な同一ROI外ピクセル完全一致を要求する。

### 実GPU描画群の同一時刻差分（46.0秒）

2026-11-02に過去実Artifactの元PNGと研究用GPUマスクPNGを独立に読み直して測定。以下は`RGBいずれかのチャネル絶対差>40`となった**HUD除外領域606,970画素**に対する割合。元物理・球・カメラは同一の真正Road5 native tick11040（元speed 約197.3m/s）。**見かけの大きさ／視線の奥行き／B51危険度やHUMAN可読性は測定していない。**

| 既存レンダラの描画群を除外した場合 | 14m元画面変化 | 28m元画面変化 | ソース由来 |
|---|---:|---:|---|
| 物理道路＋fixtureの可視スキン`roads` | **34.634%** | **36.059%** | `B48_AND_FIXTURES_RENDER_SKIN`（実コライダーは不変） |
| 道路の視認用装飾4群 | **15.621%** | **13.411%** | `A13_ROAD_DECORATION/W9C1_ROAD_MARKERS/ROAD_READABILITY_MARKERS/B5_ROAD_OPTICS` |
| 元巨大メガ構造 | **4.693%** | **4.876%** | `MEGASTRUCTURE_SCENERY` |
| 元A13機械フレーム＋W9 hero（結合） | **2.106%** | **2.633%** | `A13_MACHINE_FRAMES_AND_W9_HERO` |
| 本物の元B51動体ボディ28基 | **0.089%** | **0.148%** | `B51_BODY`（実衝突と28台の位置は保持） |
| `EPIC_SCENERY` | **0.000%** | **0.000%** | **この元W9C1ステージではそもそもGPU描画コールなし＝`NOT_DRAWN`** |

差分面積は各描画群を**別々に消す**反事実的な研究用画面寄与であって、部分を単純合算して背景占有率にすることは不可。元Sourceそのものでは元道路、巨大構造、機械、HUDが正常に描画され、研究用マスク画面はゲーム本番・公認ART候補ではない。元画面で路面の比率が大きく、ゲート・巨大骨組みが視野に入るという分析の裏付けになるが、**背景のみのA5反事実レイ（K4AA）との混同を禁止**する。

[**K4AB現在の最新CI**](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41446611321) には元`p74pop` HUDを独立検出し、**HUD外は1ピクセルの変化も拒否する**検査を搭載。最終のGitHub Actions `success` と最終Artifactを確認するまで**K4ABの正式SOURCE TECH PASSはHOLD**、未検証・エラーはそのまま報告。今回の自前のZIP・PNG読取りだけを「CI成功」と取り違えない。

**暫定結論**：K4ABは元Road5の実WebGL2描画群の来歴をK4AAより正しく識別できたが、まだ視線のGPU深度・構造の安全な3Dクリアランス・1.7m人体の公的用途理解・秒単位の連続可読性は未検証。**ART=NOT_TESTED/HOLD、旧K4/K4R/K4U=REJECT、正式ART採用0、Slope2 DNA認定0m、候補SAT/CCD/HUMAN/FPS/RELEASE/MERGE全HOLD、新モデル/コライダー0。** 今後は元描画群の**実depth/オブジェクトID**、Road5の画面と視点移動の対応を検証してから建築案を1件ずつART-FIRSTで審査する。

---

## 継承する目標・変更禁止

ゴールは原Slopeの高速度・左右操舵・自然ジャンプ・元カメラ、原240Hz、B48 **7道路**＋B51 **28障害物**の実感を守りつつ、原スロープで体験できるほど空洞や用途が読み取れる巨大都市を、独立ARTゲートに合格した場合のみ積み上げること。旧K4/K4R/K4U市場は独立ART REJECT・正式採用0・Slope2 DNA認定0m。低屋根・薄板の量産、幾何代理の可視率での採用、カメラや速度を偽る設計は禁じる。Gold/P100/W9-X/B5、main、本番2サイト、元ゲーム原ソース `web/p101-w9c2-g4e7ci-integrated-streetscape.mjs`（Git blob `af076d67492a677d2235e4730aef8cdf4808e106`）、物理と正式元CameraEye/Frontを変更しない。Workは事前許可、Chat+GitHub中心、ユーザーの操作を求めない。

K4Z [Actions #41427816258](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41427816258) 原真正WebGL2 **82 PNG**と元球・元CameraEye/Frontの合法操舵取得はSOURCE TECH限定PASS。K4AA [訂正Actions #41433154678](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41433154678) によるA5研究用5メッシュの1512レイは**反事実**であり、実際のK4Z原画には `r19a3=on` がなくA5を描画していなかった。したがって旧「A5と0本交差」は**実画面の空き空間や道路・B51の遮蔽を一切証明しない**。

## K4ABの検査対象を「実レンダラーの描画命令」に変更

[**K4AB privateソース描画群ログ実装**](../scripts/p101-r19a6p4r2f5k4ab-private-source-draw-provenance.mjs)／[**元Road5 14画面の原像SHA+同一停止時刻の6削除実画面A/B実装**](../scripts/p101-r19a6p4r2f5k4ab-true-source-render-provenance-webgl2.mjs)／[**独立PNG差分解析・レビューパネル**](../scripts/p101-r19a6p4r2f5k4ab-audit-native-source-layer-diffs.py)／[**K4AB GitHub Actions #41438745718**](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41438745718)。

まず元ゲームのまま構築した既存K3B PRIVATE `dist-private/r19a6p4r2f5k3b` から、新しい**隔離private研究コピー** `dist-private/r19a6p4r2f5k4ab` を作る。元K3Bとその親元A1のソースは読み取り専用。K4ABでの唯一の変更は、元WebGL2の`mesh`バッファが何の元描画群なのかという**ラベル付け**と、独立プライベートの`window.__k4abMask`が指定されたときの`draw`呼び出しだけの表示スキップ。元球のXYZ、合法P96→P94スクリプト操舵、240Hz、Road7、B51動体28の生成・動作・衝突は変更しない。

**実元シーンの描画群（元`web/drive3d.mjs`の`buildVisual`と`render`順序に直接由来）：**

| 研究用描画群ラベル | 元レンダラーの実体 | 重要な条件 |
|---|---|---|
| `B48_AND_FIXTURES_RENDER_SKIN` | `roads`（見える原B48サーフェスと一部fixture trianglesをまとめたGPUバッファ） | 元7つの物理B48と混同して表示マスクが衝突に作用すると主張しない |
| `B51_BODY` | `machineMeshes`／`a13MachineMeshes`、元MovingObstaclePoseによる実3D描画 | 画面で隠しても本物の28障害物の運動・衝突は変わらない |
| `EPIC_SCENERY` | `epicGeometry`由来`scenery` | 描画有無は元の画面分岐で確認 |
| `MEGASTRUCTURE_SCENERY` | `megastructureGeometry`由来`megaWorld` | 元画面の巨大フレーム等の**一部**の由来として照合 |
| `A13_MACHINE_FRAMES_AND_W9_HERO` | `a13MachineMegastructures`＋`a13W9HeroArchitecture`結合バッファ | 2種類を分離できないため**混在ラベル**のまま保持 |
| `ROAD_READABILITY_MARKERS`、`B5_ROAD_OPTICS`など | 元の描画用路面視認補助メッシュ | 物理接地の地表保証ではない |

2026年11月2日のK4ABは**反事実のA5や旧候補の建築モデルを表示しない**。元シーンの`g5b=off`と`r19a1=on`、`ball-lock-unfiltered-heading`のまま最終7tick `[10680,10800,10920,11040,11160,11280,11400]`（Road5／44.5〜47.5秒）×14m・28mを撮影する。

### 真正性ゲート（従来より厳格）

1. `k4abMask=none`／`r19a1=on`では、**元K4Zの各7時点×2幅＝14真正PNGと実bytesおよびSHA-256が完全一致**すること。位置や画角の近似一致ではなく、**同じGPU出力のバイト単位の完全再現**を要求する。元K4Z Artifactの全82PNG SHAも独立検証する。
2. 元Road5の`tick11040`でpause後、同一の`CameraEye/Front`・球XYZ・速度・RoadID/障害物28・実物理tickのまま、元GPU描画だけを指定順に`without-epic`／`without-mega`／`without-frames`／`without-B48-and-fixtures-visuals`／`without-B51-bodies`／`without-road-optics`に切り替える。各モードの**draw呼出ログ（バッファラベル・頂点数・グループ名）**と、修正された非本番WebGL2 PNGを出す。最後に`none`へ戻した原PNGのSHAが**完全一致**すること。
3. 各マスクの画面への**実表示寄与**を、元PNGと同時刻の隔離マスクPNGのRGBいずれかのチャネルで差>40pxの画素数・左右中央ROI別に定量化。**差がゼロなら表示寄与の検出失敗／遮蔽など未解明であり、描画命令の有無と画面変化の有無は分ける。** この差分は背後のシーンが現れる影響も含むため、厳密なオブジェクト分類マスク・真のGPU深度バッファではない。
4. 全てユーザー向け本番ゲームとは無関係な研究用コピーであること、正式ART採用0・Slope2 DNA認定0m、追加collision0、候補固有SAT/CCD/実歩行/HUMAN/FPS/RELEASE/MERGE全HOLDを確認する。

## 独立ARTの維持

K4ABは「元の実WebGL2画面に**何の元GPU描画群が寄与しているか**」のSOURCE技術審査であって、実建築の出口・入口・中間・奥の3D空洞や公共用途の読解ではない。HUDも時刻や3D遮蔽と異なる平面要素であり、色差では識別が自動化できない。新建築は**作っていない**。K4/K4R/K4U旧独立ART REJECTのまま、新候補`ART NOT_TESTED/HOLD`とする。

**初回報告段階：コード・専用Actions・本報告を保存。K4ABの真CI・真正GPUマスク／原Artifactの実一致はCI成功と独立検証までHOLD。** 次の段階は、K4ABで本当に目に見えた描画群を優先して、既存フレーム/道路/障害物の奥行き・視線を混同しない研究に進める。元ゲーム本体を編集しない。
