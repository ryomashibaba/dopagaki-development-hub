# DOPAGAKI SLOPE — K4AR 正本：真正Road5建築画素と空の改善の分離

2026年11月3日。ART-FIRST / QUALITY-FIRST。**ART正式採用0件、Slope2 DNA認定0m、ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE HOLD。**

## 発見した具体的な欠陥
K4AQ A/B画像のハッシュ差は、研究用の空グラデーションだけが変化しても成立する。新しい3D建築が元カメラに全く映らないケースと区別できないため、単なるRGBDifferentを建築の可視性・美術品質として認定してはならない。

## 今回の独立実装
研究枝：research/k4ar-road5-massing-and-true-mesh-evidence-20261103
基点：K4AQ commit e1008127875d3128fbbdcdd34d9052fef63d3553。実行中の元K4AQワークフローと枝には非干渉。

- web/p101-k4aq-road5-civic-rift-material-art.mjs：architecture=falseで**同じ新天空だけを描画**し、候補3Dのみ描画除外。元B48/B51・原カメラ・元物理不変。
- scripts/p101-r19a6p4r2f5k4aq-private-road5-art-pack.mjs：localhostの明示 opt-in k4aq=on と k4aqMesh=off で天空単独群。
- scripts/p101-r19a6p4r2f5k4ar-three-way-art-evidence.mjs：元カメラ6時点×（①元ゲーム画面②空のみ変更③同じ空＋新3D建築）＝真正Chromium WebGL2 18PNG。球位置・元CameraEye/Front・原B51、240Hz native tick一致を強制。
- scripts/p101-r19a6p4r2f5k4ar-independent-architecture-pixel-proof.py：18個の生PNGをSHA/bytes照合、天空だけの画素差と実建築だけの画素差を独立計算。建築が十分可視でなければFAIL CLOSED。危険画面中央への新建築描画の可能性は数値化しても、危険・衝突・美術の合格とはみなさない。
- .github/workflows/p101-r19a6p4r2f5k4ar-three-way-native-art.yml：既存K4AQ/K4AM/K4ANと別groupの専用CI。実行成功はその場で確認する必要がある。

## 不変条件
元source blob af076d67492a677d2235e4730aef8cdf4808e106、240Hz、球半径0.65m、元カメラ、B48道路7・B51元動体28・原ゲームの衝突／元操作、Gold/P100/W9-X/B5、main、本番、PR #46に無断変更なし。旧K4/K4R/K4U ART REJECTは維持。公開・正式採用・マージ禁止。Work利用は事前承認制。

## 元CIとの区別と直近の状態
- K4AN #41572736850：SUCCESS、元sourceのRGB比較資料を既存研究枝にGitHub保存。新ARTの合格ではない。
- K4AQ #41580058193：前回照会ではPENDING。旧CI #41579987798はCANCELLED。真正新候補A/B Artifactは未確認。
- K4AR #41585003708：作成直後QUEUED。**真正18PNGはまだ取得・確認されていない。**
- Draft PR #46：OPEN、Draft、未マージ。

どの状態も日時依存。必ず次の担当が最新HEAD／run／Artifactと一致を確認すること。

## 今後の美術方針
SOURCE TECH成功でもART合格にしない。実画面で建築・公共空洞・素材・光・背景・情報密度・B51危険シーンを人間が厳しく比較。K4AQに残る箱形遠景11棟・繰り返しの直方体群は世界水準の造形とは未確認。真正候補が可視になっても美術的に不足ならART REJECTし、同じRoad5一方向を根本再設計する。技術計測の際限ない追加や、旧不採用作品の再着色をしない。

次工程：K4AQ/K4AR本物CIの結果とArtifact→18PNG独立SHA/画素監査→画像を人間が比較→質の低い部分を狙った実造形改善。
