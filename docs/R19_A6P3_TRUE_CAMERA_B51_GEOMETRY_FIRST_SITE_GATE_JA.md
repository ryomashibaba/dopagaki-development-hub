# P3 完了追記（2026-10-31 JST）

**[真正CI #41183558390](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41183558390) は全SUCCESS。** [真正Artifact #13036507375](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41183558390/artifacts/13036507375)（失効予定2026-11-07 08:28 UTC）を実際に取り出し、`P3_ACTUAL_RAW_CAMERA_B51_12_FRAMES.json`と`P3_CAMERA_GROUNDED_VERTICAL_CITY_SITE_PROPOSALS.json`、Canvas12枚を確認した。

- 14m・28m × native tick 265/721/1057/1249/1921/2761の**真正12撮影**。元球native XYZ/速度・元B48 7/B51 28、GLSL係数1.35、Canvas 1013×698、元前方ベクトル・右方/上方の直交正規化の検査成功。FOV垂直73.057711°、水平94.141613°。
- B51全28基の実OBBの現在時刻座標・向き・半サイズ・外接矩形を各画面へ投影。完全に前方の外接箱が画像領域と交差する件数は`265:21, 721:16, 1057:15, 1249:13, 1921:9, 2761:11`。両幅共通。ただし**画像内で実際に見えるB51の数ではない**。
- 実カメラ＋Road0/1の全512幾何学研究候補から、P3独自のROIとOBB外接箱リスク判定で**17件**を研究用サイトとして抽出。候補スコアは視認・走行・美術・地盤・実B51全時間安全性のPASSではない。
- 技術判定 **P3 TECH PASS**。**ART/GAMEPLAY/HUMAN/PERFORMANCE/MERGE HOLD**。公式ART採用0、正式Slope2 DNA認定0m。成果はP4 R0で実Blender造形に入力されたがP4 R0の真正美術審査はREJECT。

---

# DOPAGAKI SLOPE — R19 A6 P3 / 真正カメラ駆動の都市設計・実B51視野投影ゲート

**2026-10-31 JST。P3ソース実装済み／GitHub CI実行待ち。未実測値は推測で埋めない。P2 ART REJECT継続、正式ART採用0件、Slope2 DNA正式認定0/2,912m。**

## 必須方針
目的は7,280m・約52秒の本物の200m/s級高速Slope2体験と、圧倒的な美しさの一体型未来都市を同一の人間プレイで成立させること。今回の目的は**巨大都市を作る前に、カメラで実際に見える位置・構図とB51の危険な視野を把握すること**。A5/P1の孤立箱、P2の巨大水平リボン・高架橋・反復柱を美術的成功として復活させない。

保護：元`web/p101-w9c2-g4e7ci-integrated-streetscape.mjs` Git blob `af076d67492a677d2235e4730aef8cdf4808e106`、240Hz CCD、原球半径0.65m、本当のB48道路7/B51動体28、P96/P94/A13、元RAW camera/HUD、main/Gold/P100/W9-X/B5/本番を無断変更しない。Draft PR #46未マージ・private-only。

## 新しいP3制作方法と実装コード
1. `scripts/p101-r19a6p3-readonly-source-camera-and-b51.mjs`：**本物の元ソース`viewForPose()`から各実フレームeye/front/right/up、WebGL2 viewport、原GLSLの投影係数1.35を読み取る。** 同じネイティブ時間の真正28基のB51 OBB箱8頂点を同じカメラへ投影。近クリップ・画面投影矩形・実B51 IDを明示記録。**幾何学上の予想矩形であり、GPUの本当の画素可視/遮蔽を計測したことにはならない**。
2. `scripts/p101-r19a6p3-private-readonly-source-camera-pack.mjs`：元のR19 A3 privateを別の`dist-private/r19a6p3`へコピーし、元レンダラの`const view=viewForPose(pose,cameraState);`の直後に**読み取りのみ**追加。カメラ操作・GLSL・物理・B48/B51・旧A3やA6P2の描画コードは無変更。localhost+明示URLのR19A1 gateが有効なときのみ。
3. `scripts/p101-r19a6p3-exact-12-camera-28obb-native.mjs`：真Chromium WebGL2、14m ULTRA/28m CONTROL×元本物の6native tick 265,721,1057,1249,1921,2761の計**12 Canvas画面・12 camera記録**を採取し、既存A0の真正元物理XYZ/速度/道路ID、B48=7/B51=28、同tickを独立照合。失敗時はFAIL、成功証拠は期限付きArtifact。
4. `scripts/p101-r19a6p3-true-camera-vertical-city-site-proposals.mjs`：前工程P2で取り込んだ実道路0/1各81断面×14/28mと、P3で測った真12カメラ・B51投影を組み合わせて**道路1前方の縦方向の建築候補**を選別。真正カメラへの投影、道路0の狭路中央侵入、B51 OBB投影への交差を保守的に警戒する。ただし建築候補は**建設していない座標上の研究提案**であり、地区の3D完成、都市の美しさ、建築安全性、地形接地、人間視認性を保証しない。
5. [専用CI workflow](../.github/workflows/p101-r19a6p3-true-source-camera-art-site-gate.yml) による保護検査→実カメラ12枚→候補サイト評価→原証拠保存。CIが成功するまで**CAMERA/B51/SITE TECH PASSとは宣言しない**。

## 採用のゲート
- TECH：元source blob・7 B48/28 B51・240Hz・元カメラの不変、元6時刻の全12レコード、各時刻の生WebGL2と元A0 native XYZ/速度/道路IDの一致、28個の物理OBBの画面投影。CI complete success必要。
- CAMERA：眼・前方・上・右が直交正規化しているか、元GLSLの投影係数1.35とCanvas実aspectを使用しているか。典型表示や推測値の捏造禁止。
- B51：投影矩形は**遮蔽検証の代用品ではない**。元B51の本物の前方画素の可読性は別途、実ピクセル比較で検査する。P3サイト候補でもB51と道路中央の遮蔽リスクはHOLD扱い。
- ART：今回の幾何学的設計候補の順位は美術審査の点数ではない。実都市GLB、元6画面、遠景→接近→通過→退出、用途/交通/内部公共空間が本物の3Dとして設計され、人間の独立批判的審査を通るまで正式ART採用0件。
- 次の制作はP3測定に基づく**縦の本物の都市区画・建築主役・都市基盤と生活内部**。過去の箱・巨大門・水平リボン・浮遊柱の単なる作り直しは禁止。無理に候補が出ないならHOLDとする。人間操作・Windows RTX/モバイルGPU FPS・発売・PRマージもHOLD。

## 正確な状態
[GitHub Actions #41182781084](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41182781084) は最初の確認時点で**queued**。従ってこの文書は「制作・実行手順をGitHubへ保存した」証拠であり、**12カメラ実測、候補判定、ART改善完了の証拠ではない**。CI完了時には実結果に基づいて更新する。
