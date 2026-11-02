# DOPAGAKI SLOPE K4Z — 元ゲーム真正240Hz・合法操舵の高密度カメラ証拠追加

2026年11月2日 JST。正本は `ryomashibaba/dopagaki-development-hub` の `p101-velocity-overdrive-native-trial`／Draft PR #46。K4Y 58真正PNG・42元カメラ状態からRoad5の1時点（tick11040のみ）、Road2/4/6の2時点という不足を継承。**元ゲーム/本番/main/Gold/P100/W9-X/B5の変更・新建築・新コライダー・仮想人物・擬似視覚補完を一切許可しない。**

## 【最終独立原本監査 2026-11-02：K4Z SOURCE TECH限定PASS／ART NOT_TESTED・HOLD】

[**K4Z GitHub Actions #41427816258**](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41427816258) は**全ジョブSUCCESS**、試験HEAD `7d622a358757ab3ac5b4ca5f9eff6461d294a736`。[**Artifact #13133042206**](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41427816258/artifacts/13133042206) を実ダウンロードして独立検査。ZIP **9,152,549 bytes／SHA256 `2b6dc11228c561f07047253eb6a973d43ffa02e1b88894bf15c3e6abc6baf0e7`**、**83ファイル（真正元WebGL2 PNG82枚＋JSON1件）／ZIP CRC全PASS**、JSON **109,457 bytes／SHA256 `da69e5d9283f6a8fc5190cc9fefd4e8476114eedfb218fe2eb802bbecfcddb6c`**。PNG82枚すべての実bytes/SHAを独立再計算し、元記録と一致した。

### 実ロードID別撮影件数（各幅同じ）

| Source Road | K4Y以前の原画/幅 | K4Z新たな原PNG/幅 | 旧証拠での課題と現評価 |
|---|---:|---:|---|
| Road0 ABYSS_DIVE | 4 | 4 | 元Source/A5静止画を維持 |
| Road1 CROWN_REVERSAL | 6 | 2 | K4Zは追加目標外、既存K4Yを別途保存 |
| Road2 SCISSOR_RISE | **2** | **5** | 4.8/5.0/5.3/5.5/5.8k tick近辺を増補 |
| Road3 LOWER_REVERSAL | 4 | 6 | 32秒近辺含む元カメラ証拠 |
| Road4 VOID_SURGE | **2** | **10** | 高密度化成功 |
| Road5 PRISM_CREST | **1** | **7** | 真正撮影44.5〜47.5秒の0.5秒間隔 |
| Road6 FINISH_RIDGE | **2** | **5** | 後半ロードの追加カメラ |
| AIR | （未割当） | 2 | tick11520=48.0秒、11640=48.5秒。**Road5/6に偽割当禁止** |

※「K4Y以前」と「K4Z新たな」は**別の計測シリーズ**であり、合算して一本の連続動画とは呼ばない。K4Zの各道路幅は同一の合法スクリプト操舵で**1回の実Source物理試行から41時点を順番に停止撮影**した。少数の静止画像間で視認がずっと続いたという意味ではない。Road1のK4Z 2枚は前工程の不足を減らすための研究対象外で、K4Yに6枚存在する事実を減じない。

### Road5の実証した7時刻

| tick | 秒 | 両幅の真正Road ID | 速度（14m／28m） |
|---:|---:|---|---:|
| 10680 | 44.5 | Road5 PRISM_CREST | 198.3／199.0 m/s |
| 10800 | 45.0 | Road5 PRISM_CREST | 198.7／198.9 m/s |
| 10920 | 45.5 | Road5 PRISM_CREST | 198.2／198.2 m/s |
| 11040 | 46.0 | Road5 PRISM_CREST | 197.3／197.2 m/s |
| 11160 | 46.5 | Road5 PRISM_CREST | 196.3／196.2 m/s |
| 11280 | 47.0 | Road5 PRISM_CREST | 195.4／195.5 m/s |
| 11400 | 47.5 | Road5 PRISM_CREST | 194.9／195.1 m/s |

K4Zの古いK3B撮影14一致tick×両幅＝**28PNGはSHAまでバイト完全一致**。同じ旧真正画像であるだけでなく、元CameraEye/Front・元球XYZ/速度・Roadの実照合も成功。K3の元native物理成功試行では17tick×両幅＝**34物理スナップショット**が元XYZ/速度/ロードと一致。オリジナルA1アーカイブカメラも6tick×両幅で許容誤差内一致。

### 独立画像審査と制限

Road5の14m/28mの真正7時点を別々に視覚比較した。画面は速度約195〜199m/sで走る本物の道路、既存のフレーム状巨構造、左右の路端と前方の障害物に強く占有される。画像の前後時刻によるフレーム位置・路面の変化は十分確認できるが、**新市場・駅・人間が利用できる中庭等の建築候補は一切追加していない**ため、公共空間の奥行き・入口・地上への接続・用途のART判定はできない。この撮影密度は「何を設計するなら元カメラに何時点で見せるべきか」を考える**本物の視点資料**であり、候補ARTが改善した証拠ではない。

- **成功範囲：SOURCE TECH限定PASS**（追加元82PNGの真正性、同一試行の合法240Hz、撮影Road ID、元物理・カメラ保護、元K3B PNG28一致）
- **未成功：新建築候補ART NOT_TESTED/HOLD**。K4/K4R/K4Uの旧不採用はART REJECTのまま。ART正式0件・Slope2 DNA認定0m。
- **引き続きHOLD：** 1つの候補を造形した場合のB48×7/B51×28実SAT/CCD、床支持・実歩行・人間認知・Windows/iPhone FPS、RELEASE/MERGE。連続動画の視認秒数は現静止画だけでは**わからない**。

### 次のK4AA工程

K4AAでは、**元Road5の真正44.5〜47.5秒（14時点両幅）、Road4の実10点／Road2と6の各5点**を使い、元A5巨構造と前景道路が視線を占有する**時間窓・方向・空間の重なり**を独立審査する。新建築を量産せず、失敗したK4R/K4Uの低屋根を再制作しない。カメラ固定のまま「本当に奥行きのある公開空洞」を一度に読ませる**美術原案1案の要件**を、元原画の具体的時刻ごとに厳格に設定する。実作品採用には実Glb/A/B動画、独立ART審査、候補固有安全検証を要求。元Sourceと本番は絶対不変。

---

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
