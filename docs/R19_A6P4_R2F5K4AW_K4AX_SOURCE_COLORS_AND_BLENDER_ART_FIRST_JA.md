# DOPAGAKI K4AW→K4AX — 原Road5の雑なピンク／水色描画の真の発生源とDCC-FIRST再制作

基準：2026-11-03 JST。**ART-FIRST / QUALITY-FIRST。実ゲームに見える完成画面を最優先。**

## 1. 真正GPU描画層16原画で発生源を個別に切り分けた

前K4AV完成実画像はコース全体の美術品質が依然として酷く正式 **ART REJECT**。特に「A13装飾を非表示にしたのにピンク／シアンの図形が残存」という疑問から、旧K4ABの広い `without-road-optics` 複合マスクを再利用せず、Road5の各原描画GPUバッファを**個別に切り替えて**同一物理tickで撮影した。

**K4AW [Actions #41604593198](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41604593198) completed/SUCCESS**。元Artifact [#13216820565](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41604593198/artifacts/13216820565)。本物の元Source WebGL2/Chromium camera 2点（CONTROL 11259 と ULTRA 11320）×8描画条件＝16PNG。ZIP SHA256 `d6476d9f94e641e08d6063fbac36491b107f174ff93d15e2375647d5afda2233`、19member、CRC全PASS、独立PNG SHA全一致。B48実7道路／B51元28実動体／球XYZ/CameraEye/Front/240Hz/元source blob `af076d67492a677d2235e4730aef8cdf4808e106` 不変。

真正ゲーム原画と各マスク後のGPU画像を同tickで比較した結果：

| 個別に非表示にした描画元GPU層 | 元実GPU drawコール CONTROL/ULTRA | control側 RGB>32変化画素／ROI | control側明るいピンク減少 | ultra側明るいピンク減少 | 解釈 |
|---|---:|---:|---:|---:|---|
| `p100RoadRead` P100道路視認マーカー | 1/1 | 3,273（1.61%） | **2,491** | **2,677** | 目立つピンク塗装の主要原因の一つ |
| `p101B5RoadOptic` B5演出 | 1/1 | 2,619（1.29%） | **1,185** | **1,294** | 目立つピンク塗装のもう一つの原因 |
| `w9c1MarkMesh` W9C1 | 1/1 | 0 | 0 | 0 | この2時点の画面では表示差0。GPU呼出自体は存在 |
| `g4e7x/z/cCueMesh` X/Z/C警告 | 0/0 | 0 | 0 | 0 | 当該時点でGPU描画呼出なし |
| `lines, flowRoads, approachBeacons, shoulderLights` | 2/2 | 581（0.29%） | -3 | 0 | シアン画素がcontrol **617**、ultra **681**減少。道路端／流線要素として保存判断を要する |
| `hazardGateMesh/Solid`, B51ガイド | 30/30 | 322（0.16%） | 0 | 0 | シアン画素がcontrol **430**、ultra **386**減少。**B51警告の可能性があるため無断撤去禁止** |
| `a13RoadArtMesh` 等A13非衝突装飾 | 0/0 | 0 | 0 | 0 | K4AV研究候補では**既に非表示**。ここを再着色しても今回の残存色面を直せない |

control/ultra両方とも明るいピンク/シアンの画素色閾値は **原画像RGB値** に基づくもの。ここでの「減少」は元RGBとの色閾値差であり、正確なオブジェクトID・視認性や色の安全性を自動分類していない。非表示による後景の出現、重なり、グラフィックの隠れを含む。**行を足し算して色面全体の原因100%と断定しない。** K4AW真正PNGコンタクト `K4AW_ORIGINAL_NATIVE_SOURCE_LAYER_CONTACT.png` と独立監査 `K4AW_INDEPENDENT_REAL_SOURCE_LAYER_PIXEL_CAUSALITY.json` はArtifactに同梱。

**確定した対応方針**：見た目が酷い主なピンクはP100道路視認マーカーとB5道路演出から来る可能性が高く、A13の焼き直しは非効率。P100/B5/道路端/B51警告は**重要な高速走行情報を担う可能性があるため表示だけ除去した研究画像をプレイ版に適用してはいけない**。安全な代替UI/路面誘導の設計と真正source native走行／人間視認審査が必要。

## 2. K4AX — 次の編集可能なアート原本を制作する実装

研究枝：`research/k4ax-road5-editable-blender-civic-exchange-20261103`。実装 `scripts/p101-r19a6p4r2f5k4ax-blender-editable-tidal-exchange.py` は**Blender bpyの実DCC制作コード**。画像を捏造するスクリーンショット加工ではない。

Road5の genuine source-camera artifact K4AVから**球座標・カメラeye/front・native tick・原PNGハッシュ6時点**を読み取り専用の `docs/K4AX_TRUE_SOURCE_ROAD5_CAMERA_REFERENCE_20261103.json` に固定（元球座標を道路コライダー・実測サーフェスと取り違えない）。

**「Tidal Exchange Civic Hall」単一の研究Hero構図**：

- 1つの巨大な二重曲率セラミック屋根。屋根は現実にメッシュの厚みとベベルがあり、内部空間を板で塞がない。サテン銅製の構造的な細リブは支持柱に沿う。
- 中央の**本当に床が抜けた楕円形公共広場と小さな水盤**。段差・コートの開放感が実3Dとしてある。ただし元ゲームの歩行可能床ではない。
- 奥に凹んだガラス建具と、欠き込みのある玄関、人間スケールのベンチ・プランター・樹木・あたたかい内部の照明。均等な巨大窓の水平帯だけで都市に見せる方法は不採用。
- 反対側は小さな植栽テラスと、**1つだけ**の曲線・ねじり・テーパーを持つ遠景ランドマーク。主役の繰返し複製禁止。
- Blender node材質（セラミック・切石・サテン銅・ガラス・石材・内部照明・植栽・木材など）、真の曲面法線・厚み・ライト。ユーザーの望むデザインの見栄えが実際に良いかは**本物のプレビューを人間が見た後**に厳格判定する。

**本物の生成対象**：編集可能なネイティブ`.blend`、`.glb`、元真正Camera姿勢11259／11278／11307に合わせた**3枚の独立Blender DCCスタジオPNG**、全ファイルSHA・原source来歴JSON。生成検証は新専用 [Actions #41605755669](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41605755669) から始まり初回はPython構文問題でFAIL、最小修正後 [後続CI](https://github.com/ryomashibaba/dopagaki-development-hub/actions?query=branch%3Aresearch%2Fk4ax-road5-editable-blender-civic-exchange-20261103) で検証中。**成果が本当に生成できたか・品質が良いかはCI成功・実画像目視まで未確定**。

## 3. 比較と採用に必須の誠実な区別

Blenderの3枚は**元の道路やB51を組み込んだゲーム画面ではない**。元Cameraの数値を使って造形を審査する*アートスタジオプレビュー*であり、元Road5のサーフェス・リアルB51障害物・HUD・元ゲーム光・衝突はインポートしていない。地面の支持、巨大カーブのクリアランス、B51の遮蔽、時速700km/h近い画面可読性、フレームレートは**全部未検証**。見かけ上きれいでもゲーム統合のPASSではない。

**今後の厳格な順序**：まず本物Blenderの3構図を見てARTの方向性が評価に値するか審査（酷ければ作り直し）→元B48真正面データ・B51動体の3D安全クリアランス審査→整合したGLBだけを一度に限りsource PRIVATE WebGL2へ仮導入→本物の元ゲームカメラ／実高速走行/HUMAN/FPS/SAT/CCDを別々に判定。どこかFAILなら正式ART不採用。技術PASSや三角形数の増加だけで進捗と称さない。

旧K4/K4R/K4U、K4AS/K4AT/K4AU/K4AV ART REJECT不変。正式ART採用0／Slope2 DNA0m。元240Hz・球半径0.65m、B48七道路、B51二十八動体、P96/Gold/P100/W9-X/B5、本番、main、Draft PR#46に変更なし。Work事前承認・GitHub/Chat中心・ユーザーローカル操作不要。
