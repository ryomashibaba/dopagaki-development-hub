# DOPAGAKI SLOPE K4Z — 元ゲーム真正240Hz・合法操舵の高密度カメラ証拠追加

2026年11月2日 JST。正本は `ryomashibaba/dopagaki-development-hub` の `p101-velocity-overdrive-native-trial`／Draft PR #46。K4Y 58真正PNG・42元カメラ状態からRoad5の1時点（tick11040のみ）、Road2/4/6の2時点という不足を継承。**元ゲーム/本番/main/Gold/P100/W9-X/B5の変更・新建築・新コライダー・仮想人物・擬似視覚補完を一切許可しない。**

## 研究の対象・実装

[**K4Z真正再生**](../scripts/p101-r19a6p4r2f5k4z-dense-original-source-webgl2.mjs)、[**K4Z専用CI**](../.github/workflows/p101-r19a6p4r2f5k4z-dense-original-camera.yml)、[**Actions #41427816258**](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41427816258)。

元 `web/p101-w9c2-g4e7ci-integrated-streetscape.mjs` Git blob `af076d67492a677d2235e4730aef8cdf4808e106` を凍結。元A1のprivate original WebGL2キャプチャを構成する既存K3Bの**凍結コピー** `p101-r19a6p4r2f5k3b-private-camera-pack.mjs` Git blob `3096e5556189221d8411205a6cf96a1f5f5137bd` を使用。これは旧K3Bと同じ「tick7680（32秒）まではP96 early-soft/4.8、次tickからP94 corrective/3」という**合法入力のみ**の個別研究コピー。元240Hzシミュレーション本体/球XYZ/速度/重力/道路7・動的障害物28・元カメラball-lock-unfiltered-headingは変えない。

**道路幅14m・28mそれぞれ1本の連続する真正物理試行**で、41指定tickにおいて元WebGL2 canvasからPNGを取得。原K3B 14時刻×両幅のうち対応フレームでは元XYZ・速度・Road・CameraEye/Frontを独立照合。元K3法令的操舵の**native 16-run matrix**のスナップショットが存在する時刻では元XYZ/速度/道路の一致を確認。初期6tickの元A1アーカイブ眼点/方向も比較する。

特にRoad5 PRISM_CREST近傍 `tick10680,10800,10920,11040,11160,11280,11400,11520` を高密度化。Road2 `4801,5041,5281,5521,5761`、Road4 `9480,9600,9720,9840,9960,10080,10200,10320,10440,10560`、Road6 `11640,11760,11880,12000,12120,12240` とその他の比較フレームも元真正画面として撮影する。**指定tickが該当道路に存在するかは実ソースRoad IDで確認し、推測で道路名を割り振らない。** Road5等4重点区間はそれぞれ幅別に3枚以上の真の同一走行の画面が存在するかで技術ゲートを判定する。

## 必須の別扱い

- 取得PNGの元WebGL2と画像SHA/bytes、実カメラEye/Front、球XYZ/速度、道路ID、tick/240秒、K3B元フレームとの差、K3 native物理との比較をJSONに保存。**同一試行の疎な静止画であり240fpsの連続動画ではない**。元K3Bの旧撮影とは別試行なので、今回の撮影と旧K/K3Bを無検証で単一連続映像に接合しない。
- 描画をゲーム側で変更しない。実人間操作は行わず合法スクリプト操舵だけ。**元ソースを変えていない**ことと、元ゲームすべてのゲームプレイ品質を保証することは別。
- K4Zで追加しているのは元ゲームの空間を映す証拠であって、ユーザーが見る新しい公共空洞も新しい建築も存在しない。旧K4/K4R/K4U独立ART REJECT、K4Y新候補NOT_TESTED/HOLD、正式ART採用0件、Slope2 DNA認定0m。元A5都市と「実建築の公共用途」を**認知できるという主張は行わない**。
- B48全実モデルSAT・B51全動体CCD／床支持／人間操作の公平性／iPhone・Windows FPS／RELEASE・MERGEは引き続きHOLD。

**初回：実装とCI保存済み、真正カメラの採取と最終判定はCI/Artifactにおける実測完了まで保留。** 次工程は出力のRoad ID分布・元PNG hash・全エラーを独立検証し、Road5の実写密度が改善したら改めて構図ART-FIRSTレビューへ進む。単に画像枚数が増えても正式ART採用にはしない。
