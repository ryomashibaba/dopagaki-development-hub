## 【2026-11-03 更新：元1,442時点の実測取得済み／独立再監査実行中】

- [通常run #41559179613](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41559179613) は最終の独立Node監査でFAIL。真のChromium 2幅×721tickの全データ取得、元K4Z82PNG SHA・元K4AFの14 original+14 B51 group mask GPU depth+14復元、および元K4AHの14幾何関数再実行はすべてPASS。最後のコードだけ`a.geometry.signedEyePointToOBBMeters`という**存在しない項目名**を読み、`undefined`比較でFAIL。正しくは`a.geometry.signedCameraEyePointToOBBMeters`。元実測データや許容幅は一切修正していない。
- [元真実Artifact #13196762115](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41559179613/artifacts/13196762115)：ZIP実ダウンロードSHA256 `213fd11a78d4785683081fd1d6ee617b01c8ecaaab2227afff4280d80ff6c502`、**46ファイルCRC全一致**。`K4AI_GENUINE_NATIVE_IN_RENDER_DEPTH_REPORT.json` SHA256 `e04c9990ebc2573467e8d95cd3e497a7a6059a9f12384f46507c3c1dfdc0eb60`、`K4AI_INDEPENDENT_SOURCE_GPU_GEOMETRY_AUDIT.json` SHA256 `a39adcaf8b71068e4a37ce5421a7927a6159e6a9fcd52aedcd4f4e6d8ef3143d`。真正14画面/深度を継承する根拠。
- **再計算した生値（監査の残り条件は未合格）**：14m=最短camera-OBB `−0.9748613671m`/tick11341（47.2542秒）、eyeInsideOBB 10tick、眼距離≤1m 14tick、source`runner.surface`null 0tick。28m=最短camera-OBB `+0.4478183666m`/tick11278（46.9917秒）、eyeInsideOBB 0tick、眼距離≤1m 8tick、source`runner.surface`nullと`grounded=false`31tick。2幅とも原`runner.status`全721tick`running`。**元カメラ・障害物の幾何記録**であり、衝突不具合・視界遮蔽の秒数・ART合否を意味しない。
- 静的型名の修正後、元Chromiumを全面再実行する[通常CI #41560614512](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41560614512)に加え、真生データのSHAを固定して元K4Z/K4AF/K4AH参照を独立に再ダウンロードする**高速再監査専用CI [#41561002955](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41561002955)**も追加。後者は元Chromiumを再起動せずに1,442tick元関数再実行・14元GPUアンカー・10改ざん負例を監査する。**現時点でどちらも未成功なので、K4AI TECH正式PASSはHOLD**。
- GitHub研究ブランチのみ改修。main/本番/PR#46/Gold/元球/240Hz/Camera/B48 7/B51 28/元Source blob全不変、正式ART0件・Slope2 DNA0m、SAT/CCD/HUMAN/FPS/RELEASE/MERGE HOLD。

---

## 【暫定実測：14mの真正721tickは旧FAIL Artifact内で保存済み】

- [K4AI第1修正版CI #41558189309](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41558189309) は結果として`failure`。Artifact #13196385604（ZIP SHA256 `3bec6818b9bdb6435cc4e333010f253e1e1b9c5545015e21a54ca95e54204cc3`、43メンバーCRC全PASS）を実ダウンロードし、`K4AI_GENUINE_NATIVE_IN_RENDER_DEPTH_REPORT.json` SHA `fca34f8d3972690e9b952dd0da64786e34062ffb3b463d53c48b00f09a6be218` を計算。**ultra=14mの7真正元PNG/7元GPU mask/7深度復元/721/721元物理tickの原生JSONは保存成功、control=28mでsource road nullに対する研究用assert誤りによって中断**。
- その真14m生記録から、最短**符号付きカメラeye→元p95-hazard-12のOBB距離 −0.9748613671m（native tick11341、時刻47.2541667秒）**。元幾何関数が`eyeInsideOBB=true`とした連続tickは **11340〜11349の10tick=10/240秒≈0.041667秒**。眼→OBB表面1m以内のtickは11338〜11351の14tick。元`runner.surface`は全721tickで`p93-PRISM_CREST-01`、statusは全721tick`running`。同じ7基準tickのeye座標と元`signedEyePointToOBBMeters`は、SHA固定されたK4AH真正元描画生JSONと**ローカル独立Pythonの7/7数値差1e-8以内**で一致。
- これらは**保存された生source値の暫定事実**であり、まだ全1,442件の独立関数再実行とcontrol幅監査が通っていない。K4AI SOURCE TECH全体PASSには昇格させない。`eyeInsideOBB`の連続10tickは**元カメラと元箱の幾何学的重なり**であり、実GPUの遮蔽秒数・プレイヤーの接触・物理バグ・人間ARTのいずれとも同義ではない。
- 7時点スナップショットだけでは、14mの47.0秒（眼→OBB +46.526m）と47.5秒（+39.766m）の**中間で一時的に眼がOBB内に入る**事象を見逃すことが実証された。連続240Hz測定が必要である理由を示す一方、本番修正・衝突変更の許可ではない。
- 次の正規CIは [#41559179613](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41559179613)。source`Runner.surface`の元路面ID/NULLとgrounded状態も正しく記録する。**完走/Artifact独立検証までは確定せずART HOLD**。

---

## 【第2修正版CI：原Runner.surfaceのnull時間帯を正しく保存 2026-11-03】

- [K4AI第1修正版CI #41558189309](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41558189309) はSOURCE SHA/元K4Z82PNG/元K4AF84GPU/元K4AH14画像幾何/隔離rendererビルドPASS後、真Chromiumの`ultra`幅**全7元画面+7元B51 mask+7元深度復元+721/721 source-native tick capture成功**。しかし`control`幅の連続tickの一部で原`Runner.surface===null`だったため、K4AI研究用ランナーに書いた「721tick全部に`p93-PRISM_CREST-01`路面IDが必須」という**不当な仮定**がassert FAIL。これは元ゲームの描画不良・物理不正ではない。失敗Artifact #13196385604 ZIP SHA256 `3bec6818b9bdb6435cc4e333010f253e1e1b9c5545015e21a54ca95e54204cc3`、CRC43/43確認。制御幅の実sourceがnullであった事実を隠さない。
- 第2修正は元物理に一切介入せず、元ドキュメント`doc.surfaces[].id`の**実ソース路面ID全件**をtick10680で保存し、各tickの`runner.surface`は（1）その元IDのどれか、または（2）`null`に限り許容。元`runner.grounded`の真偽も同時記録し、`null`や`grounded=false`となる**区間と合計tick数**を独立レポートに出力する。存在しない路面IDを投入した負例を2幅で拒否するよう独立テストを4→5件/幅、計**10負例**へ増強。これは元データの偽造を許す「緩和」ではなく、元Runnerの実際の状態遷移を正しいスキーマで受容し、未検証の路面滞在を主張しないための修正。
- 現在の正規Actions：[**#41559179613**](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41559179613)。本CIの全14 GPUアンカー・1442本original tick・独立関数・Artifactが実成功するまで**K4AI TECH PASS未確定**。古いCIの「SUCCESSを装う」ことは禁止、旧二本はcancelled/FAILのまま保管。遮蔽の秒数と人間ARTは別ゲートHOLD。

---

## 【修正版専用CI 2026-11-03：内部camera設定名の不一致を修正】

- 初回K4AI [#41557465698](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41557465698) は元source/K4Z82/K4AF84/K4AH14 SHAと隔離ビルドを通過し、真正Chromium実行で停止した時点で研究者が元`web/drive3d.mjs`を再照合。**根本の静的な誤り**：元内部`comparisonMode`は`'raw'`、DOMに出る`canvas.dataset.cameraMode`だけが`'ball-lock-unfiltered-heading'`。K4AI private telemetryのguardが内部変数をDOM表示名と比較していたため、元物理が進むとthrowされる設計だった。
- この誤りは**研究用ガードだけ**であり、元Camera計算・元球/速度/OBB/B51や元sourceプログラムは変更しない。`comparisonMode==='raw'`へ修正。DOM/後段の`cameraModeRequired==='ball-lock-unfiltered-heading'`検査はそのまま。
- 新しい正規修正版CI [#41558189309](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41558189309)。**修正版の全工程とArtifact独立監査が終わるまでK4AI連続240Hzの最終PASS・最小距離を宣言しない。** 旧初回CIが中断・FAILになっても成功として扱わない。ARTと公開HOLD維持。

---

# DOPAGAKI SLOPE — K4AI 元ゲーム240Hz連続カメラ・B51-12幾何計測

2026年11月3日（日本時間）。**SOURCE TECHとARTは分離。合格前に最終結果を先取りしない。**

## 採用済み証拠と制約

- 正本repo：`ryomashibaba/dopagaki-development-hub`、開発の元継続ブランチ `p101-velocity-overdrive-native-trial` Draft PR #46（未マージ）。本研究ブランチは `research/k4ai-original-240hz-camera-obb-continuity-20261103`、親コミット `6b3e6d1de48a1997b9884a00079069044c462c34`。**main・PR#46・本番・Gold/P100/W9-X/B5変更なし**。
- 前段K4AF [CI #41472149272](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41472149272) SUCCESS：元K4Z82PNG SHA、Road5 7tick×2幅×6元描画群84真正GPUマスク、14復元、ART HOLD。
- K4AG [CI #41552778225](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41552778225) SUCCESS：元B51実ID28個×2幅=56真GPUマスク。28m・47秒の遮蔽は`p95-hazard-12`1体が原因。8px格子5,972/11,176点=53.436%、14mでは53点=0.474%。この数値は人間の見えやすさではない。
- 前段K4AH [CI #41554878800](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41554878800) SUCCESS：元元関数`movingObstaclePose`/`sphereBoxSeparation`を同じsource描画内で測定、別Nodeで14点全件再計算、原K4Z82PNG+K4AF真GPU深度14元/14マスク/14復元一致。Artifact [#13195125107](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41554878800/artifacts/13195125107) ZIP SHA `fe22a310a2a698a813abf0eaaa9f3b5e8d9a75af4d096a320be7e05261c29294`、CRC46/46 PASS。固定の真正K4AH生JSON SHA `84b4a185fb1c3c37454213b334c3c5db2a8fc6871500dca33d2255ec8a85beb0`、独立元画像/深度監査 `ba557d0ae2dba320e120a3386086d521fc2249cd3f91813d4e0024305ebaf84b`、元幾何独立再計算 `683287e4c5b9dee60cff344f067e115c02964a40366cb62c8ee487de83d4a8e6`。
- K4AH 47.0秒 28m：camera eye→B51-12 OBB表面符号距離`+0.5829530325m`、ball表面→OBB `+6.4465143846m`。14m：camera `+46.5256370402m`、ball `+33.5418099186m`。どちらも計測時点ではOBB外側、**衝突バグや人間ART結論ではない**。

## K4AIの計測範囲（今回実装）

- **本物の元Runnerが240Hzで1ステップ更新するたびに**、44.5〜47.5秒（native ticks 10680〜11400の両端含む721点）を実際に計測。2幅で計**1,442元物理tick**、欠けた秒を補間しない。
- [隔離K4AIビルダー](../scripts/p101-r19a6p4r2f5k4ai-private-240hz-continuity-builder.mjs)は、検証済みK4AH私用レンダラーのコピーだけに`currentPose=capturePose(runner)`直後の元native tickサンプラーを追加。原 source ball headingに対する`viewForPose(currentPose,createCameraState(currentPose.forward))`が、元unfiltered camera表示と一致する契約。元B51 `doc.movingObstacles[].id`/descriptorは全721ステップのID・JSON完全一致を監査。元`movingObstaclePose`と`sphereBoxSeparation`を同じsource tickでread-only再利用。
- [真正Chromium再走行](../scripts/p101-r19a6p4r2f5k4ai-original-240hz-two-widths.mjs)：元球/240Hz/元カメラ姿勢を動かさず、既存K4AHと同じ7tick真正GPU・PNG・元B51群maskを再測定。7つの元描画フレームのOBB/ball/eyeと、そのtickの新240Hz記録を数値差`1e-8`以内で照合。元K4Z82PNG SHA/元3D画素差0・元GPUと深度復元14画面一致も独立監査に残す。
- [本物のSource独立関数監査](../scripts/p101-r19a6p4r2f5k4ai-independent-native-240hz-geometry.mjs)：別Nodeプロセスで元`private/reference_only/director/physics.js`の`DT=1/240`と`RADIUS=0.65`、元`web/drive3d-camera.mjs`と元`moving-obstacles.mjs`をそのままimportし、記録1,442件すべてのcamera eye/front/right/up、OBB、signed eye/ball distances、camera座標投影を**独立に再計算**。7点×2幅はSHA固定K4AHの真GPU元frameと数値一致を必須化。時間+1/60、カメラeye+0.02m、OBB中心+1m、source descriptorのサイズ改変を2幅とも拒否（8負例）。Source physics/collision/camera/GPU変更0。
- 出力は1,442点CSV、生監査JSON、近接区間サマリーJSON、日本語報告。距離閾値（0/1/2/5/10/20/50/100m）は**近接を数えるためだけの幾何診断指標**であり、合格閾値ではない。連続区間はその条件を満たす本物の元tick数×`1/240s`として出す。

## 「遮蔽継続時間」との厳格な違い

- 元GPU`gl_FragCoord.z`が遮蔽された割合を取得済みなのは、K4AFの**7tick×2幅の離散GPUマスク**のみ。これらの間にある714tickのGPUマスクは**未測定**。`eye-to-OBB`距離0〜100mやOBB内側滞在は、**カメラと障害物の近接・重なりの継続tick数**であり、「画面が何秒間遮られたか」ではない。元眼がOBBの外でも遮蔽は大きくなり得る。
- GPU遮蔽率の秒間補間、物体ID逆推定、接触の正当性、B51の無断縮小/位置変更、カメラ変更、ART合格、公開は禁止。
- 元source blob `af076d67492a677d2235e4730aef8cdf4808e106`、元ゲーム/球/240Hz/Camera/B48 7/B51 28/Gold/P100/W9-X/B5/main/本番2URL不変、K4/K4R/K4U独立ART REJECT、正式採用ART0件、Slope2 DNA0m、モデル/Collider新規0、SAT/CCD/HUMAN/FPS/RELEASE/MERGE HOLD。Work事前承認制、PC操作不要。

## CIと次工程

- 専用Actions：[K4AI #41557465698](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41557465698)。元K4Z82PNG/K4AF84真GPU/K4AH14幾何のSHAを完全固定して、真正Chromiumの1,442 native tick・厳格14元画像/深度/元B51 mask/復元と独立1,442 source関数再実行を行う。**実CI完了・Artifact独立SHA/CRC検証前はK4AI全体PASS判定をHOLD**。
- CI成功なら「幾何学的最接近距離・その時刻・近接tick区間」を確定値として報告。その後別工程K4AJで**実GPUの同一240Hz連続時刻での元B51単体マスク**を測定できる方法を設計し、初めて実画面遮蔽時間を調べる。ART-FIRSTの人間評価は別ゲート。
