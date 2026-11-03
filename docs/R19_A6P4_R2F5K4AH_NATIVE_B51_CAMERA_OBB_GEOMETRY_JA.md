# DOPAGAKI — K4AH 元B51-12の真正カメラ・ボール・OBB幾何監査

2026年11月3日 JST。研究専用、**SOURCE TECHとARTは別ゲート**。

## 確定している前段

- GitHub正本：`ryomashibaba/dopagaki-development-hub`。K4AG確定CI [#41552778225](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41552778225) **completed/success**。実GitHub Artifact #13192687645 ZIP SHA256 `86f27ab7310835c405932b29049ac180d7e69d0987f19be5059fe15099bcbd61`、68/68ファイルCRC。真正元B51-ID28件を1個ずつ2幅で抑制する56個の本物のsource-GPU深度と独立画素監査PASS。
- 28m・47.0秒の大きな前景遮蔽は実測による`p95-hazard-12`に一意に帰属。真正8px格子11,176点のうち **5,972点＝53.436%**。14m同一時点は53点＝0.474%。元`p95-hazard-12`を1個だけ消した深度は全B51-28体を消した深度と全サンプル一致。残27体の単体除去変化0。ただし**衝突バグ・体験ART不合格の証拠ではない**。
- 元障害物設計は [`web/p95-hazard-layout.mjs`](../web/p95-hazard-layout.mjs) のroadIndex5/u0.73/横+8m/type2、元生成器 `scripts/p95-void-hazard-build.mjs` のpiston（size 8×3×7.5m / stroke8m / collision=push）。このステージの実47秒OBB位置・cameraとの距離は前段では未計測。

## K4AHで実際に実装する観測

研究ブランチ`research/k4ah-original-b51-camera-obb-geometry-20261103`。専用CI [#41554878800](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41554878800) を実行。**CIとArtifactの結果を確認するまではK4AH TECH合格と呼ばない**。

1. [隔離レンダラービルダー](../scripts/p101-r19a6p4r2f5k4ah-private-original-geometry-builder.mjs)はK4ADで真正GPU深度が成立したオリジナルGPUレンダラーを複製し、同一render callback・同一native pause tickで元の`movingObstaclePose(originalDescriptor,pose.time)`と`sphereBoxSeparation`を**読み取るだけ**。実`view.eye/front/right/up`、元球`pose.position`、元B51-12の完全記述・OBB中心/halfSize/Yaw、元球表面→OBB・eye点→OBBの符号付き分離、相対視線方向の投影を記録。原球/Camera/physics/collision/元drawは変更しない。source blob`af076d67492a677d2235e4730aef8cdf4808e106`固定。
2. [真正Chromium 7時点×2幅](../scripts/p101-r19a6p4r2f5k4ah-original-b51-camera-seven-ticks.mjs)：44.5,45,45.5,46,46.5,47,47.5秒×14m/28mの14フレーム。geometryとK4AD同一フレームRGBA24深度のrequestSeq/tickを照合。1時点1群`without-B51-bodies`の14実GPU深度マスク、14復元を測定して、元K4AF真正深度と全11,176点一致を必須化。
3. [独立Python真正元画像・深度監査](../scripts/p101-r19a6p4r2f5k4ah-independent-pixel-gpu-audit.py)：K4Z82枚元PNG SHA固定、K4AF84真GPUマスク元JSON SHA固定、14元PNGの厳格なHUD外3D画素差0、14 baseline深度、14B51群mask、14復元深度全サンプル一致を必要とする。原`#chapterHud`HTML文字に限る厳しい3画素/各RGB1階調例外を継承し、3D画素基準は一切緩和しない。
4. [独立Node元source幾何検算](../scripts/p101-r19a6p4r2f5k4ah-independent-source-geometry.mjs)は**別Nodeプロセスから元`private/reference_only/director/moving/moving-obstacles.mjs`を直接import**し、捕捉された元descriptor+poseTimeに対する`movingObstaclePose` / `sphereBoxSeparation`を再計算する。14フレームのOBB/Camera/ballの座標差0、符号付き分離差0、画面前方/横/縦投影一致を厳密確認。中心座標+1m、眼距離+0.7m、source時刻+1秒という3つの改変負例は必ず拒否。
5. CIは本物のSource本番に触れずGitHub Actionsで実行し、実幾何JSON+日本語7時点テーブルと元画面・深度のArtifactを保存する。ユーザーPC操作・ZIP再提出不要。

## 事前に禁止する結論

- `signedBallSurfaceToOBBMeters`は元OBBのその瞬間の**幾何学的分離距離**。たとえ負値でも当たり判定エンジンの不具合と断言しない。接触/CCD/押し戻し/人体feasibilityは別工程で検証。
- カメラeyeとOBBの符号付き距離が負ならカメラ視点がOBB内側にある**幾何学的事実**に過ぎず、ART合格・不合格、想定外の壁抜けを単独認定しない。
- 真正GPU非線形depthはm単位に換算できない。GPUの53.436%は「8px格子でこのB51を描画除去すると背後のdepthになる比率」であり、人間の視認性・美的ART受容率ではない。
- 14mと28mの平均値で合格させず、7時点の間は非測定として勝手に補間しない。

## 保護する長期方針

元ゲーム/球/240Hz/Camera/B48 7/B51 28、Gold/P100/W9-X/B5・main・本番URL・元Source blob不変。元継続ブランチ`p101-velocity-overdrive-native-trial` Draft PR #46 OPEN/unmerged不変更。K4/K4R/K4U ART REJECT、**正式ART採用0件、Slope2 DNA0m、モデル/Collider追加0**、SAT/CCD/HUMAN/FPS/RELEASE/MERGE HOLD。Workは事前許可制、研究継続はChat + GitHub優先。

## 次に判定するゲート

専用Actions #41554878800のステップ・最初のエラー・Artifact ZIP SHA/CRC・真正14画像/元数値を確認。TECH成功なら47秒のカメラとOBBの実測距離を報告し、**元コリジョンの「正当な演出」か「予期せぬ近接」かの判断には別の走行衝突・人間ART試験が必要**と明確に分離する。失敗なら根本原因を修正し、真実性条件は緩めない。
