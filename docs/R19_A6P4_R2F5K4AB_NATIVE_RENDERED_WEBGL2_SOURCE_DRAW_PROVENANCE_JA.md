# DOPAGAKI SLOPE K4AB — 真の描画群の由来と同一240Hz時刻のWebGL2差分

2026年11月2日 JST。研究正本 `ryomashibaba/dopagaki-development-hub`／`p101-velocity-overdrive-native-trial`／Draft PR #46。

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
