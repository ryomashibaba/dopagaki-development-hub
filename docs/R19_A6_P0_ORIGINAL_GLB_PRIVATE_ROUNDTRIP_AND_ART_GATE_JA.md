# DOPAGAKI SLOPE — R19 A6 P0 / A5元GLBの真正PRIVATE描画往復

2026-10-31 JST。**研究のみ。現時点では美術REJECT／GAMEPLAY・HUMAN・PERFORMANCE・RELEASE・MERGE HOLD。**

## 目的と今回の限定スコープ
目標は本物の7,280m約52秒級高速Slopeゲームと壮大で美しい未来都市を同じ人間体験で成立させること。A5で5つの独立編集オブジェクトGLBを生成したが、元ゲームに安全に戻す経路がなかった。

A6 P0では**A5の元14m／28m GLBのみ**をSHA256とGLB構造・ソース由来の双方で固定し、5区画のPOSITION/COLOR_0 float32を実際にバイナリ再読込して元WebGL2頂点ABI（XYZRGB）へ戻す。**単に元JavaScriptの頂点配列を再度利用するものではない。** 計算結果を別のPRIVATEゲーム複製へロードして、A5直接描画と同一元240Hz native tick・RAW camera画像を照合する。

これはBlender GUIの実インポート/編集/再エクスポートの成功ではない。GLBの再読み込みに成功しても、美術改善を一切意味しない。

## 実装
- `scripts/p101-r19a6-source-glb-roundtrip.mjs`：元GLBを厳格に読み戻す。SHA／モード／元blob／5メッシュ／属性stride／頂点データ・COLORS／source metadata等を検査。未知の拡張・indices・transform・変造GLBはP0ではreject。将来の編集GLB対応には専用のP1審査が必須。
- `tests/p101-r19a6-pinned-city-glb-roundtrip.test.mjs`：元A5の14m/28mそれぞれで実GLB読込頂点と元sourceのGPU float32入力を**全要素一致**で確認。改ざん・偽SHA・別モード・偽blobを拒否。物理stageをJSONで保護。
- `scripts/p101-r19a6-private-pinned-glb-scene-pack.mjs`：元`dist-private/r19a3`を**変更せず**別の`dist-private/r19a6`へ複製し、検証済みGLB由来の二つのGPU頂点バッファをロード。localhost限定、URL明示`r19a6=on`、A5との二重重ね描き禁止。読み込み失敗は明示FAIL、物理救済なし。
- `scripts/p101-r19a6-real-glb-source-native-camera-compare.mjs`：A5側の既存真正24画像のうち14m/28m×4.404s・8.004sの4画像とGLB側の真正原Canvas PNGを**SHA256完全一致**比較。球XYZ・速度・元道路・B51=28・同RAW cameraの照合を別途要求。
- `.github/workflows/p101-r19a6-pinned-glb-source-native.yml`：既存元game/自動QAを再利用した独立CI。原本Git blob `af076d67492a677d2235e4730aef8cdf4808e106`を実検査。PR #46 Draftを維持。本番deploy/mergeなし。

## 検査の意味
- SOURCE TECH PASSの条件：元14m/28m双方のGLB読込が成功し、直接頂点配列との全float32一致。PRIVATE元240Hz原カメラの同tick描画4比較が同じPNG SHAとなり、28動体、7 B48、カメラ、元球位置速度が維持されること。
- もしCI途中で失敗したら **A6 P0はHOLD/FAIL**。ローカル生成やコードのpushだけでTECH PASSとはしない。
- 技術成功しても**A5美術は正式REJECTのまま**。編集した形状・高品質マテリアル・ゲーム性・Windows GPU FPS・人間操作・障害物見やすさは未承認。Slope2 DNA正式認定0m、ART採用0件。

## 次に必要なA6 P1 / P2
P1：Blenderなどで実編集した真正5区画GLBを元アセットとして保管し、indices／node transform／materialsの合法的変換に対応した**別の検証済み**読込を行う。編集前後の各区画変化と元source座標を独立監査し、危険な任意外部素材ロードを許さない。GLBの体積/支持・屋内空洞・景観の連続性を改善する。

P2：実カメラ6時刻の一貫した遠景→接近→通過→退出の芸術設計。既存の孤立した箱・巨大門・単純骨組みと偽都市基盤の量産に戻らない。ゲームの視認性や細道/B51を犠牲にしない。真正WebGL2 PNGを人間が批評し、不合格ならART REJECTを保持する。

Windows人間14m／28m走行、原B51実ピクセル視認、RTX実GPU FPSは別の未完了ゲート。main・Gold・P100・B5・W9-X・本番・元CCD・ソース原本を無断変更しない。
