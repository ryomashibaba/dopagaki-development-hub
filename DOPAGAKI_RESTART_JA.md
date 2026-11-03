## 【2026-11-03 K4AI 1,442元native tick：二重の独立CIでSOURCE TECH PASS確定／ART HOLD】

- **真正Chromium本実走行CI**：[K4AI #41560614512](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41560614512) = **completed/success**。元Source/元カメラ/元240Hz物理 SHA固定、K4Z82PNG元3D画素、K4AF14元GPU depth+14 B51群mask+14完全復元、K4AH14真正元source幾何、`721連続native tick×14m/28m=1,442`の元カメラ・movingObstaclePose・sphereBoxSeparation別Node独立関数全件PASS、10幾何改ざん負例PASS。ゲーム・camera/collision/GPU source変更0。**SOURCE GEOMETRY TECH限定PASS、GPU画面遮蔽の連続時間とARTは未測定HOLD**。
- **再走行に頼らない別系統の独立Artifact監査**：[K4AI #41561002955](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41561002955) = **completed/success**。SHA固定された**別FAIL runのK4AI生データ**に対して元K4Z/K4AF/K4AH原証拠を再取得し、真正GPU14 anchor・元画像・1,442点元source関数再実行・10負例と日本語/CSVを独立再検査（このrunにChromium再走行はない）。両CIの成功を別々の根拠として保持。
- [**成功K4AI元生Artifact #13198040646**](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41560614512/artifacts/13198040646)：ZIP **6,142,170 bytes** SHA256 `ea03e1b20484e5ad5761670c46ebec986df72216d7dd1d7bed8e03e9b3c8bd2f`、**50全メンバーCRC PASS**。K4AI真正元生JSON SHA256 `e04c9990ebc2573467e8d95cd3e497a7a6059a9f12384f46507c3c1dfdc0eb60`、独立幾何近接窓JSON SHA256 `aa90ac8ec214b1e9cdb5838137407a07bfe888970ed7c27c334b106b9a249beb`。失敗した旧CI #41559179613は`failure`のまま（研究側の項目名ミス）、成功履歴に上書きしない。
- **全1442元時点の確定幾何**：14m（ultra）眼→`p95-hazard-12` OBB最短`−0.9748613671m`（47.25417秒, tick11341）、眼OBB内部10ticks（11340〜11349）、眼とOBB距離1m以下14ticks（11338〜11351）、元球→OBB最短+5.008817m。28m（control）眼→OBB最短`+0.4478183666m`（46.99167秒, tick11278）、OBB内0ticks、1m以内8ticks（11277〜11284）、元球→OBB最短+3.455851m、原`runner.surface=null`かつ非接地31ticks。**幾何的近接tick数はGPU遮蔽時間/衝突異常/ART合否と同義ではない**。
- K4AI研究継続`research/k4ai-original-240hz-camera-obb-continuity-20261103`、[K4AI詳細正本](docs/R19_A6P4_R2F5K4AI_REAL_240HZ_SOURCE_CAMERA_B51_CONTINUITY_JA.md)。次の隔離**K4AJ研究**は`research/k4aj-native-b51-gpu-depth-contiguous-window-20261103`：[K4AJ研究正本](https://github.com/ryomashibaba/dopagaki-development-hub/blob/research/k4aj-native-b51-gpu-depth-contiguous-window-20261103/docs/R19_A6P4_R2F5K4AJ_ORIGINAL_NATIVE_B51_GPU_OCCLUSION_WINDOWS_JA.md)、[K4AJ専用GPU CI #41562897854](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41562897854)で元native近接窓49+50tickの**真GPU B51 group mask**を計測。K4AJのCI完走・Artifact検証前にTECH PASSとは言わない。
- 固定：元source Blob `af076d67492a677d2235e4730aef8cdf4808e106`、元球半径0.65/240Hz/Camera/B48道路7/B51 28、Gold/P100/W9-X/B5、main/本番2URLとDraft PR #46 OPEN/unmerged変更なし。正式ART採用0、Slope2 DNA 0m、SAT/CCD/HUMAN/FPS/RELEASE/MERGE HOLD。Work事前承認、Chat/GitHub中心、PC/ZIP操作不要。

---
## 【K4AI 2026-11-03 10:33+ JST 監査再実行 — 真1,442native tick取得済み、合格未確定／ART HOLD】

- **最優先再開**：[K4AI研究正本](docs/R19_A6P4_R2F5K4AI_REAL_240HZ_SOURCE_CAMERA_B51_CONTINUITY_JA.md) → [再監査専用CI #41561002955](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41561002955) と[全Chromium再実行CI #41560614512](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41560614512)。いずれも現時点では**GitHub Actions queued、完走は未確認**。前段 #41559179613 は`failure`のまま記録し、偽PASS禁止。
- **すでに成立した証拠範囲**：#41559179613は元source/camera/physics SHA、K4Z82 PNG/K4AF84mask/K4AH14 geometryの固定根拠、Chromium実走行**721tick×2幅=1,442native ticks**、14元WebGL2 PNG/14元GPU depth/14 B51 group depth/14復元、14元source関数照合まで実PASS。監査末尾で実測JSONにないフィールド名`signedEyePointToOBBMeters`を読んだ研究用assertだけ`undefined`でFAIL。修正後の監査は`signedCameraEyePointToOBBMeters`に対してSHA固定元K4AHと比較し、**幾何値・画素・コライダー・判定閾値は未変更**。
- [真正K4AI生Artifact #13196762115](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41559179613/artifacts/13196762115)：ZIP SHA256 `213fd11a78d4785683081fd1d6ee617b01c8ecaaab2227afff4280d80ff6c502`、全46CRC一致、生JSON SHA256 `e04c9990ebc2573467e8d95cd3e497a7a6059a9f12384f46507c3c1dfdc0eb60`。この生JSONをSHA固定した高速専用CIで**Chromium再取得せずに**K4Z/K4AF/K4AH独立再監査・元関数1442件・10改ざん負例を検証する。全工程PASS前はK4AI正式認定HOLD。
- 生データの暫定集計：14m カメラeye→B51 `p95-hazard-12` OBB最短`−0.974861m`/47.254秒、OBB内部10ticks、眼から表面1m以内14ticks、路面未検出0ticks。28m 最短`+0.447818m`/46.992秒、OBB内部0ticks、1m以内8ticks、`Runner.surface=null`/非接地31ticks。これは**元240Hz物理の幾何時系列**。同じ秒数だけGPU画面が隠された/衝突不具合/ART不合格とは**一切断定しない**。
- 次は#41561002955と#41560614512の実run/Artifact JSON/CSV/CRC/SHAを確認し、必要なら元Source関数の不一致だけ修正。K4AI TECH PASSなら次のK4AJで**本物の連続GPU描画B51マスク**を個別に実測。main/本番URL/Gold/P100/W9-X/B5/元球/240Hz/カメラ/B48 7/B51 28、Draft PR #46 OPEN/unmerged不変、正式ART0件・Slope2 DNA0m、SAT/CCD/HUMAN/FPS/RELEASE/MERGE HOLD。Chat/GitHub主体、Work事前承認、PC/ZIP操作不要。

---
> **【最新 K4AI修正版CI #41559179613・2026-11-03 ART HOLD】** [K4AI正本](docs/R19_A6P4_R2F5K4AI_REAL_240HZ_SOURCE_CAMERA_B51_CONTINUITY_JA.md) → [現行CI #41559179613](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41559179613)。初回 #41557465698は内部カメラ値rawと表示ラベル混同でcancelled。第1修正 #41558189309 は元Source連続tickが`ultra`幅で721全件成功した一方、`control`幅の間で本物の`Runner.surface===null`が現れたため、「全tickがRoad5 ID」という検証側の誤った仮定でFAIL（実Artifact CRC43/43）。現在は**元`doc.surfaces[].id`に実在する路面IDまたは真の`null`のみ許可し、`runner.grounded`や路面未検出の区間・tick数をそのまま保存**。存在しない路面IDを拒否する負例を追加して10/10必須。元物理・カメラ・B51・source SHA/元K4Z82PNG/K4AF84GPU/K4AH14アンカー不変、main/本番/Draft PR#46不変更。現行CI全工程成功前K4AI SOURCE TECH未認定。幾何的な近接区間と実GPU遮蔽が続く時間を混同しない。正式ART0・Slope2 DNA0m、RELEASE/MERGE HOLD。

> **【K4AI修正版CI 2026-11-03・ART HOLD】** 元内部カメラモード値は`'raw'`、表示DOM文字列は`'ball-lock-unfiltered-heading'`。K4AIの初回CI [#41557465698](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41557465698) は研究コードが内部変数を表示名と比較するミスを含むため、中止された（**SOURCE TECH PASSと呼ばない**）。該当private-only guardを元`comparisonMode==='raw'`へ訂正し、**現在の正規CI**は [#41558189309](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41558189309)。元物理・camera・GPU・main・PR#46・本番は一切変えていない。K4AIの721tick×2幅・14 K4AH真正GPUアンカー・元82 PNG・元K4AF深度一致の実結果をこの新CIで判定。連続GPUの遮蔽秒数と人間ARTは依然**未測定/HOLD**。必読 [K4AI研究正本](docs/R19_A6P4_R2F5K4AI_REAL_240HZ_SOURCE_CAMERA_B51_CONTINUITY_JA.md)。

## 【2026-11-03 最新 K4AI — 真正元物理240HzのカメラとB51障害物の連続距離／ART HOLD】

- 次の継続研究ブランチ `research/k4ai-original-240hz-camera-obb-continuity-20261103`。必読：[K4AI研究正本](docs/R19_A6P4_R2F5K4AI_REAL_240HZ_SOURCE_CAMERA_B51_CONTINUITY_JA.md) → [K4AI専用Actions #41557465698](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41557465698)。本時点では実測ブラウザ継続実行中で**K4AI全工程の合否未確定**。
- 既にSUCCESSの[K4AH #41554878800](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41554878800)：Source真WebGL2原PNG14、元GPU B51 14 mask+14復元、独立元source OBB geometry 14。Artifact #13195125107 ZIP SHA `fe22a310a2a698a813abf0eaaa9f3b5e8d9a75af4d096a320be7e05261c29294` CRC46/46。元幾何Source生JSON SHA `84b4a185fb1c3c37454213b334c3c5db2a8fc6871500dca33d2255ec8a85beb0`、元関数再計算SHA `683287e4c5b9dee60cff344f067e115c02964a40366cb62c8ee487de83d4a8e6`。
- 原B51 ID `p95-hazard-12` はK4AGで28m・47秒のGPU深度53.436%遮蔽源と確定。K4AHの眼→障害物OBB表面は28m `0.5829530325m`、14m `46.52563704m`、ボール表面→OBBは28m `6.44651438m`。衝突不具合・ARTの合否は未判定。
- 今回K4AIは元Runnerのnative`1/240`tick 10680〜11400（44.5〜47.5秒）両端含め721本×2幅=**1,442本**をインラインread-onlyで収集し、元カメラ`viewForPose`/元piston `movingObstaclePose`/元`sphereBoxSeparation`を別Nodeから全件再実行し、K4AH実GPU14アンカーで一致検証。距離閾値は0/1/2/5/10/20/50/100mの幾何的近接tick数と区間のみを記録。**実GPUがB51で覆われていた秒数を補間・捏造しない**（K4AFは7時点しか本物GPU maskなし）。視覚遮蔽時間は次の別連続GPU工程の対象。
- 元Source Blob `af076d67492a677d2235e4730aef8cdf4808e106`・元球/240Hz/カメラ/B48道路7/B51実体28・Gold/P100/W9-X/B5・main/本番URL不変。Draft PR #46元HEAD `19d3a32d525c0c2a67082cba646898fab8f2b60f` OPEN/Draft未マージ。K4/K4R/K4U旧ART REJECT、正式ART採用0件、Slope2 DNA0m、新モデル/Collider0、SAT/CCD/HUMAN/FPS/RELEASE/MERGE HOLD。Chat/GitHub主体、Work事前承認、ユーザーPC/ZIP不要。
- 次はActions #41557465698の全step・Artifact SHA/CRC・1442値を独立照合。不合格なら厳格な元関数と真正PNGを緩めず原因を直す。

---
## 【K4AH最終確定 2026-11-03 / 真正B51-12カメラ/球/OBB幾何 TECH PASS・ART HOLD】

- GitHub研究継続先 `research/k4ah-original-b51-camera-obb-geometry-20261103`。[K4AH正式実測全文](docs/R19_A6P4_R2F5K4AH_NATIVE_B51_CAMERA_OBB_GEOMETRY_JA.md) → [真正Actions #41554878800](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41554878800) **completed/success** → [Artifact #13195125107](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41554878800/artifacts/13195125107)。ZIP 5,609,702 bytes、SHA `fe22a310a2a698a813abf0eaaa9f3b5e8d9a75af4d096a320be7e05261c29294`、CRC46/46 PASS。GitHub正本に14時点詳細表・RAW/監査/幾何JSON各SHAを保存。元K4Z82PNG SHA、K4AF真正GPU 14元depth+14個B51群マスク+14復元depth11,176点全一致、真正元Road5 14画面HUD外3D画素差0。元`movingObstaclePose`と`sphereBoxSeparation`の原描画時same native tick捕捉14/14、別Node原関数再計算14/14、偽装負例3/3拒否。
- **元`p95-hazard-12`（piston/size8×3×7.5m/vertical stroke8m）の28m・47秒遮蔽原因が幾何学的に裏付けられた**：28mはカメラeyeから元OBB表面**+0.582953m**、球表面→OBB**+6.446514m**、カメラ→OBB中心3.52489m。14mはeye→OBB+46.525637m、球→OBB+33.541810m。両条件ともeyeと球はOBB**外側**。前段K4AGの28mだけ原B51-12を消すと元GPU depth5,972/11,176＝53.436%の大遮蔽が解除される事実と一致。球が障害物内にいるためではなく**追従カメラの強い近接前景**と整合する。とはいえ元CCD/衝突妥当性・意図した演出か・人間ARTは未測定。
- **次工程K4AI**：元物理/カメラ変更せず47秒前後の真正240Hz連続時系列でeye→OBB最小距離・GPU遮蔽の持続時間を実測、演出と危険な視野遮断を区別する。7離散時点の観測値から継続秒数を推定しない。独立ART認定には人間審査。元Source blob `af076d67492a677d2235e4730aef8cdf4808e106`、球/240Hz/Camera/B48 7/B51 28/Gold/P100/W9-X/B5/main/本番2URL・継続`p101-velocity-overdrive-native-trial`のDraft PR #46 OPEN未マージ変更0。正式ART採用0件、Slope2 DNA0m、新モデル/Collider0、SAT/CCD/HUMAN/FPS/RELEASE/MERGE HOLD。Chat/GitHub主体、Workは事前承認、PC/ZIP操作不要。

---
## 【現行2026-11-03 K4AH：元B51障害物-12とカメラ/球の真正OBB幾何研究 — ART HOLD】

- 研究再開の正本は`research/k4ah-original-b51-camera-obb-geometry-20261103` → [K4AH完全研究記録](docs/R19_A6P4_R2F5K4AH_NATIVE_B51_CAMERA_OBB_GEOMETRY_JA.md) → [本物のGitHub専用CI #41554878800](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41554878800)。このCIは**実結果未確認**、K4AH TECH/ARTの成功を先取りしない。
- **前工程K4AGは確定SUCCESS**：[Actions #41552778225](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41552778225)、ZIP Artifact #13192687645 SHA256 `86f27ab7310835c405932b29049ac180d7e69d0987f19be5059fe15099bcbd61` CRC68/68。元K4Z82PNG SHA/元K4AF84GPUマスク/Source ID28個×2幅=56個別GPU実測の独立監査PASS。28m・47秒の8px格子5,972/11,176=53.436%遮蔽は**実原Source ID `p95-hazard-12` 1体**。14mは53点=0.474%、残り27体寄与0。衝突バグ・ART不合格は未判断。
- K4AHは元`movingObstaclePose` / `sphereBoxSeparation`を元rendererの**同一native 240Hz render callback内**でread-only再計算し、44.5〜47.5秒の7時点×2幅の原球/camera eye/front/元B51-12 OBB・球/眼の符号付距離を実測。K4Z元82PNG SHA、元K4AFの14 baseline+14 B51群mask GPU depth11,176点完全一致、元画面14本3D画素不変/14復元も監査。別Nodeから元source幾何関数を再実行して一致、3改ざん負例を拒否。元物理・B51配置・Collider・カメラは不変。
- 元source blob `af076d67492a677d2235e4730aef8cdf4808e106`、球/240Hz/Camera/B48 7/B51 28、Gold/P100/W9-X/B5、main/本番2URL、継続`p101-velocity-overdrive-native-trial`/Draft PR #46 OPEN未マージ維持。旧K4/K4R/K4U ART REJECT、正式ART採用0件、Slope2 DNA0m、新モデル/Collider0、SAT/CCD/HUMAN/FPS/RELEASE/MERGE HOLD。Work事前承認・Chat/GitHub主運用、PC/ZIP再提出不要。
- 次工程は**K4AH Actions #41554878800の実ステップ・ログ・Artifact ZIP SHA/CRC・独立元関数での幾何数値照合**。技術ゲートPASSでも衝突/ゲーム体験や人間ART合格と同義ではない。

---
## 【K4AG確定SUCCESS / 2026-11-03 / 次はK4AH幾何診断】

- [K4AG実真正GPU CI #41552778225](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41552778225) **completed/success**。元B51 28個の実Source IDそれぞれを1個だけGPU描画から抑制し、14m+28mの56真正WebGL2 readback・K4AF元depth SHA固定比較・元K4Z PNG厳格照合と独立監査PASS。ZIP Artifact [#13192687645](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41552778225/artifacts/13192687645) 8,316,226B、SHA256 `86f27ab7310835c405932b29049ac180d7e69d0987f19be5059fe15099bcbd61`、CRC68/68 PASS。詳細は[K4AG確定正本](docs/R19_A6P4_R2F5K4AG_B51_SOURCE_ID_OCCLUSION_JA.md)。
- **原因元Source B51 IDは `p95-hazard-12`**。28m・47.0秒（native tick11280）、1体だけの視覚除去でGPU深度11,176点中5,972点=53.436%が奥へ。全B51 28体除去と深度全点一致、他27個の単独除去では0点。14mでは同じ1体53点=0.474%。これは**視覚遮蔽**のTECH結論であり、元衝突判定異常・危険性・人間ART不合格とは断定しない。
- 元設計 `web/p95-hazard-layout.mjs`でこのIDはroadIndex 5、u0.73、type=2 vertical piston、横+8m。元`scripts/p95-void-hazard-build.mjs`でsize=[8,3,7.5]m、piston stroke8m、collision `push`。設計パラメータのみで、実行47秒のカメラ・OBB分離は未測定。**次工程K4AH**はread-onlyで`movingObstaclePose`と`sphereBoxSeparation`をそのまま使い、元カメラeye・球・OBBの位置関係を2幅比較する。元B51の改造・無断置換は禁止。
- 元Source Blob `af076d67492a677d2235e4730aef8cdf4808e106`・球/240Hz/カメラ/B48 7/B51 28、Gold/P100/W9-X/B5、main/本番2URL、PR#46 OPEN/Draft未マージ維持。新造形0/Collider0、正式ART採用0件、Slope2 DNA0m、K4/K4R/K4U旧ART REJECT継承、SAT/CCD/HUMAN/FPS/RELEASE/MERGE HOLD。Chat/GitHub主体、Work事前承認、ユーザーPC操作不要。

---
## 【最新2026-11-03 K4AG B51単体元IDのGPU遮蔽原因調査 — ART HOLD】

- 再開先：研究ブランチ `research/k4ag-b51-individual-occlusion-20261103`。根拠：[K4AG研究正本](docs/R19_A6P4_R2F5K4AG_B51_SOURCE_ID_OCCLUSION_JA.md) → [K4AG元B51個別28×2幅＝56 GPUマスク実測Actions #41552778225](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41552778225)。現在GitHub Actionsで本物のChromium実行中、**全56条件と独立監査が終わるまでK4AG TECH未判定**。
- **確定済K4AF**：[CI #41472149272](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41472149272) completed/success、Artifact #13156257422 ZIP 14,439,425 bytes SHA `fbeb9d8b3555f49b963800f2447378902fc4295e8a84e5636c2e13e4eca2348b` CRC116/116 PASS。元K4Z82 PNG SHA、Road5真正14画面HUD以外3D全画素一致、原GPU実depth 7tick×2幅×6mask＝**84/84 PASS**、元表示復元14/14、真元Source drawsとfarther-onlyを独立監査。全84行CSV/日本語報告。
- **重要視認問題の元データ**：47.0秒、28mだけ本物の`B51_BODY`移動障害物群を除くとGPU深度11,176点のうち5,972点（53.436%）が奥へ、14mは53点（0.474%）。28m他6tickは最大1.333%。28m元画像の下側に巨大な紫前景が映り、B51群非表示で道路が見える。遮蔽は単一連続成分5,972点、画面左下原点y0〜49。**この段階では個別ID、衝突バグ、ART不合格は確定していない**。
- K4AGは元`doc.movingObstacles` ID28件を私用K4AD rendererの視覚body drawだけ1個ずつ抑制して、**2幅×28=56**真正WebGL2 depthを検証。K4AF元7tickのsource GPUを完全固定し、元球/カメラ/240Hz/tick11280/元K4Z元PNG不変、個別71draw/元72draw/全群44draw、depth単体差分がgroup差分以下、復元前後のdepthと元画素一致を独立必須化。真IDの現場ログを照合するまでは推測IDで報告しない。
- 絶対固定：元source blob `af076d67492a677d2235e4730aef8cdf4808e106`、Gold/P100/W9-X/B5、main/本番URL/元球/240Hz/カメラ/B48 7/B51 28、PR#46 OPEN Draft `19d3a32d`未マージ維持。ART-FIRST、K4/K4R/K4U ART REJECT、正式採用ART0件、Slope2 DNA0m、新モデル/Collider0、SAT/CCD/HUMAN/FPS/RELEASE/MERGE HOLD。Work無断起動禁止、ユーザーPC/ZIP操作不要。

---
## 【最新版 2026-11-03 K4AF元Road5真正7時点×2幅×6群GPU遮蔽調査 — ART HOLD】

- 継続入口：`research/k4af-road5-7tick-six-layer-native-gpu-depth-20261103` → [研究詳細](docs/R19_A6P4_R2F5K4AF_GENUINE_ALLTICK_GPU_MASK_VISIBILITY_JA.md) → [K4AF専用CI #41472149272](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41472149272)。このCIは研究登録後**実完走未確認**。Source/ARTをPASSと誤認しない。
- 前段確定：[K4AD #41463872981](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41463872981) **SUCCESS（元K4Z82 PNG SHA/真正Road5 14元画像CSS外全3D画素一致/元GPU実draw RGBA24 depth14/14・同一46秒6群×2幅12/12マスク/元復元depth一致）**、[K4AE #41466857011](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41466857011) **SUCCESS（元真正ArtifactをSHA固定した7時点×2幅のGPU深度分布再解析）**。K4AE Artifact #13153921353 ZIP SHA `beba0b76ded60d7d7580cf8478dfc3dd452a7b0157edee28e8cc982a02f8a19b`、CRC全2。元K4AD GPU depth sourceにART認定は一切含まれない。
- 今回K4AFでは既存K4AD private rendererを変更せず、44.5〜47.5秒の真7tick×2幅の元球/元カメラ姿勢を固定し、6個の本物のSource GPU draw群を**一群ずつ**一時除去。**真84 GPU depth masks、14元フレーム、14復元フレーム**を真正WebGL2で測り、独立Python監査でK4Z元82PNG SHA/元3D全画素一致/84masked元source GPU draw census/深度farther-only/14回のmask解除後元depth11,176点一致と元3D画素不変を要求。独立出力CSVと日本語MDは7時点で**本当に計測した**GPU深度差のみ。実人間の美的ART認識、物体ID、安全床、視認持続秒数は未測定。
- 元継続ブランチ `p101-velocity-overdrive-native-trial` HEAD `19d3a32d525c0c2a67082cba646898fab8f2b60f`、Draft PR #46 OPEN Draft未マージ。元ゲームblob `af076d67492a677d2235e4730aef8cdf4808e106`、球、240Hz、Camera、B48道路7/B51動体28、Gold/P100/W9-X/B5/main/本番URL不変更。K4/K4R/K4U ART REJECT、正式ART採用0・Slope2 DNA0m、モデル/Collider新設0、SAT/CCD/HUMAN/FPS/RELEASE/MERGE HOLD。Chat/GitHub中心、Work事前承認、PC/ZIP再提出不要。
- **次にやること：** K4AF #41472149272の実run・job logs・Artifact SHA/CRC/サンプルを確認し、失敗なら根本原因を直す。全84 GPU mask/14復元の実PASSが確認されるまでART以前の技術判定もHOLD。データのない時点・視点を補間して合格にしない。

---
## 【最新K4AE 2026-11-02 — GitHub固定Artifactから7時点×2幅を独立再計算／ART HOLD】

- **再開対象研究ブランチ** `research/k4ae-verified-road5-depth-temporal-diagnostics-20261102`、[K4AE詳細正本](docs/R19_A6P4_R2F5K4AE_PINNED_GPU_DEPTH_SPATIOTEMPORAL_JA.md)、[元GPU深度分布監査コード](scripts/p101-r19a6p4r2f5k4ae-pinned-depth-temporal-audit.py)、修正版K4AE [Actions #41466857011](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41466857011)。このCIは実行待ちで**TECH診断判定未確定**。初回Actions #41466588681はFAIL（800万未満と24bit中点8,388,608未満の期待件数混用）。修正版では生Artifactの真サンプル3,556件/28行を厳密24bit中点として使用し、測定元JSONは改変なし。
- **既に成立した前段正本**：[K4AD Actions #41463872981](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41463872981) は**completed/success**、実Artifact #13150624075のZIP SHA `0004cb8081e290289734a182ff0fe484d953fc892fb70818eec5f6fbfbf09504`・30ファイルCRC全一致、元K4Z 82 PNG SHA、Road5 2幅×7tick 14画面の非HUD 3D画素差0、元72 GPU drawのRGBA24深度14/14成功、6mask×2幅12/12成功、元深度への復元11,176点一致。K4ADの**SOURCE TECH限定PASS**であり、ARTではない。元58?等の古い資料で上書きしない。
- K4AEはこの確定Artifactの生データSHA `537346d1df0afb8c2ba1f0b2581d088dfeae3711a2b27021c199d72800d2d0ad`・監査SHA `edf9a2e1ad20f30e186a0fe708a163f78e3935c489d45054fd273ab342d3f826`を完全固定して、7時点×2幅の非線形depth分布・46.0秒実mask寄与のみ算出。**WebGLの読み出し配列は画面左下が先**、値は24bit非線形整数で**メートル/物体ID/安全空間/ART可視率ではない**。違う時点にmask効果を補間しない。元source blob `af076d67492a677d2235e4730aef8cdf4808e106`、元球/240Hz/Camera/B48 7/B51 28、Gold/P100/W9-X/B5、main/本番2URL不変。K4/K4R/K4U旧ART REJECT、正式ART0件・Slope2 DNA0m、モデル/Collider0、SAT/CCD/HUMAN/FPS/RELEASE/MERGE HOLD、PR#46 OPEN Draft未マージ、Workは事前許可、ユーザーPC操作不要。
- **次は必ずActions #41466857011の実ジョブ・Artifact SHA/CRCとJSON/MDの観測値を監査してから次研究に進む**。実際に不合格ならエラーログと原因を明示し、合格基準を緩和しない。

> **【2026-11-02 K4AD 真GPU RGBA24深度取得14/14・12/12候補成立、PNG監査修正版CI #41463872981実行待ち】** [K4AD日本語正本](docs/R19_A6P4_R2F5K4AD_ORIGINAL_MESH_RGBA24_DEPTH_JA.md) → [新修正版Actions #41463872981](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41463872981) → 研究ブランチ `research/k4ad-original-mesh-rgba-depth-20261102`。直前の [CI #41458103800](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41458103800) は**FAIL**ながら実Artifact #13148042343を独立ダウンロード/ZIP SHA `e575e020666f7d30a01d1c0a882329eaa80cf9afcfa48c87acd35741f20fa46a`/CRC全29検証、**真Road5 14/14と6mask×2幅=12/12でRGBA8符号化GPU depthを読み出し**、元GPU描画72命令→マスク71/44/68、マスク除去depthが全てfarther-only、元へ戻したdepth差0。**旧CI FAIL原因は元K4Z画像比較で`control` tick11280の元`#chapterHud`文字x545/y33〜35 3画素RGB1差と既知P74動的HUD79,685差**。元 `web/drive3d.html` の`#chapterHud.chapter` CSS (absolute/top20/left50) を正本から照合。修正版は各画面で実DOM bounding rect+要素id/class/text/position/非操作性を記録し、UI文字領域のみ**最大3px・各RGB差1以内**、それ以外の真3D/非HUD画素差0を絶対維持。4px差、RGB2差、3D1px違反はすべて独立負例でFAIL。さらに実メッシュsource draw censusと24bit深度のfarther-onlyを12/12条件で必須化。**この新CIの最終結果が出るまでK4AD TECH/ART正式認定不可。** 元source blob `af076d67492a677d2235e4730aef8cdf4808e106`、元球/240Hz/カメラ/B48 7/B51 28、Gold/P100/W9-X/B5/main/本番2URL、PR#46 OPEN Draft `19d3a32d` 変更0。K4/K4R/K4U独立ART REJECT、正式ART0件/Slope2 DNA0m、SAT/CCD/HUMAN/FPS/RELEASE/MERGE HOLD。次工程は**CI #41463872981の実ログ/新Artifact SHA/CRC/PNGと独立深度監査**、勝手に合格とはしない。Work事前承認・ユーザーPC不要。

> **【K4AD正規CI訂正 2026-11-02】** 元メッシュRGBA深度試験の初回CI [#41457632488](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41457632488) は研究用フラグ初期化順序の不備を含む旧コミットで開始。**使用すべき修正版**は、先行宣言前のK4ABフラグ参照を除いた `a576b2d7511729a97987c3bb0f4f0a9d1a368e30` の [K4AD Actions #41458103800](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41458103800)。このCIの実WebGL2深度と画像独立監査が終了するまで**K4AD SOURCE TECH未判定・ART HOLD**。K4AC-S正本の82PNG/14PNG PASSとDEPTH_BLIT_ERROR_1282、Artifact2件独立SHA/CRCは既に確定。元物理・カメラ・main/本番不変更。以下は以前の記録。

## 【最新 2026-11-02 K4AD GPU RGBA24研究 — 専用Actions #41457632488 実行待ち／ART HOLD】

- 開発継続先として、研究ブランチ `research/k4ad-original-mesh-rgba-depth-20261102`、[K4AD正本](docs/R19_A6P4_R2F5K4AD_ORIGINAL_MESH_RGBA24_DEPTH_JA.md)、[専用CI #41457632488](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41457632488) をまず読む。PR#46の元継続ブランチ `p101-velocity-overdrive-native-trial`（HEAD `19d3a32d525c0c2a67082cba646898fab8f2b60f`）とは**別研究ブランチ**であり、PR#46/main/本番を変更しない。
- 前段K4AC-S [Actions #41455050342](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41455050342) **CI全工程SUCCESS**。元K4Z真正82 PNG SHA独立PASS、Road5 14真正PNG CSS外画素差0、元表示12研究mask/復元検証、ただしGPU深度0/14+0/12、Chromium2幅全条件で`DEPTH_BLIT_ERROR_1282`→**DEPTH HOLD**。ZIP artifact #13145664936実取得、SHA `8d8fc9200f9a486a6bc6fc2e1f4d8a8079c9a5638d8300e8db8442e600f9f5b3`、CRC全30 PASS。旧K4AC #41453572178は**CI FAIL**：深度同じ1282、さらに画素監査でcontrol tick11280の(545,33〜35) RGB 1値差3画素（画面上部・3D形状変化とは断定しない）。旧artifact #13147245711 SHA `5d7ff338446b44ca6566ba61d23ea02e31cf411f0ffd00049fc70160d5d49fc3`、CRC全29 PASS。勝手にROIを拡張して合格扱いしない。
- K4AD新工程は`gl.blitFramebuffer(DEPTH)`を廃止、**本物の元メッシュ描画命令・元GPU頂点バッファ・元vertex shaderをプライベートFBO (RGBA8+Depth24)に再描画**し、`gl_FragCoord.z`の24bit RGBA符号化を`gl.readPixels(RGBA8)`で読み取る隔離計測候補。元描画を保存し同一フレーム内で再描画、GPU状態を完全に復元するため、必ず真正元画像82 SHA+新14画面CSS外原画素一致と12マスク復元条件を独立監査。新技術は静的構文2JS PASS、CI**未完/実GPU未知**。元Source blob `af076d67492a677d2235e4730aef8cdf4808e106`、240Hz、球、Camera、B48 7、B51 28、Gold/P100/W9-X/B5保護。K4/K4R/K4U旧ART REJECT、正式採用ART0件・Slope2 DNA0m、モデル/Collider追加0、SAT/CCD/HUMAN/FPS/RELEASE/MERGE HOLD。Work事前許可、ユーザーPC操作/ZIP再提出不要。
- 次は**新CI #41457632488のjob結果・ログ最初の根本エラー・Artifact ZIP SHA/CRC+元PNG14+mask12+Depth 24bitを照合**する。成功でも正確な物体ID・安全空地・景観ARTは認定しない。

## 【最新2026-11-02 K4AC MockGL6/6 PASS・真GPU CI未完／次Actions#41453572178】

- [K4AC正本と厳格な未検証の区別](docs/R19_A6P4_R2F5K4AC_NATIVE_GPU_DEPTH_CAPABILITY_SOURCE_GATED_JA.md) → [K4AC Actions #41453572178](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41453572178) → [LIVE HANDOFF](docs/DOPAGAKI_LIVE_HANDOFF.md)。GitHub上に本当の`readDepth`コードを読み出してGPU無しのMockGLで実行する6条件テストを恒久追加、6/6独立PASS。真ロード5原WebGL2 14枚・深度・CI実Artifactは**まだ未検証／HOLD**であり、Mock成功から推定しない。過去の #41452389126 は取消、新版はpendingとして記録。
- K4AB最終SOURCE TECH限定PASSのまま、K4AC実GPU SOURCE TECHは未認定。元ゲームsource `af076d67492a677d2235e4730aef8cdf4808e106`/240Hz/球/Camera/B48×7/B51×28、Gold/P100/W9-X/B5/main/本番2URL変更0。K4/K4R/K4U旧ART REJECT、正式ART採用0/Slope2 DNA0m、新建築・Collider0、候補SAT/CCD/HUMAN/FPS/RELEASE/MERGE HOLD、PR #46 OPEN Draft未マージ。ユーザー再添付/ローカル操作不要、Work事前許可。次はActionsの実ジョブとArtifactの独立照合から着手。

## 【最新2026-11-02 K4AC GPU深度修正版・Actions#41452389126実測待ち／ART HOLD】

- [最新K4AC原本](docs/R19_A6P4_R2F5K4AC_NATIVE_GPU_DEPTH_CAPABILITY_SOURCE_GATED_JA.md) → [修正版Actions #41452389126](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41452389126) → [LIVE HANDOFF](docs/DOPAGAKI_LIVE_HANDOFF.md)。旧#41450761768は新コミットによりキャンセル。元GLのREAD_FRAMEBUFFERへの`gl.readBuffer`指定、TEXTURE0とactive textureの別保存・復元、context lost無限ループ防止を研究コードで改善。元K4Z SHA真正82PNGをピン留めし、Road5 7tick×2幅=14本物WebGL2元画面を**depth試験前後に再撮影**、本物CSS P74以外の全3D元画素一致を独立PythonとCIで監査。深度読出し可否、実PNG正しさ、CI Artifactの成功はいまだUNKNOWN/HOLD（修正版Actionsは2026-11-02 22:22 JST頃キュー待ち）。
- 前段K4AB SOURCE TECH限定PASS維持。K4ACは新規SOURCE TECH認定未成立。原Source `af076d67492a677d2235e4730aef8cdf4808e106`、元240Hz/カメラ/球/B48 7/B51 28、Gold/P100/W9-X/B5/main/本番2URL無変更。正式ART採用0・Slope2 DNA0m、旧K4/K4R/K4U独立ART REJECT、候補SAT/CCD/HUMAN/FPS/RELEASE/MERGE HOLD、Draft PR#46未マージ、候補新模型/新コライダー0。次は最新Actions結果とSHA Artifact監査から。ローカル実行・過去ZIP再要求禁止。

## 【最新2026-11-02 K4AC 深度読出し実装・実CI監査待ち／ART HOLD】

- [K4ACの独立実装とHOLD契約](docs/R19_A6P4_R2F5K4AC_NATIVE_GPU_DEPTH_CAPABILITY_SOURCE_GATED_JA.md) → [K4AC Actions #41450761768](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41450761768) → [LIVE HANDOFF](docs/DOPAGAKI_LIVE_HANDOFF.md)。元K4AB SOURCE TECH限定PASSは維持。K4ACは元K4Z 82PNG SHAを原本に、元240Hz合法操舵Road5真正7時刻×14m/28mの14本物WebGL2画面、元GPU描画群6種×両幅の同一tick11040深度読出しを**別研究用コードで試す**。元CSS P74領域以外の原3D画素の完全一致・深度復元・負例検査をCIで独立実施。
- **コード保存とCI実行登録は確認済みだが、WebGL2の深度読出し可否と実Artifactの最終検証は現段階UNKNOWN/HOLD。** 読出し不能を成功扱いしない。成功でも非線形深度サンプルは元オブジェクトID・人間用途・施工/衝突の安全を証明しない。
- 元Source `af076d67492a677d2235e4730aef8cdf4808e106`/球/原カメラ/B48 7/B51 28/Gold/P100/W9-X/B5/main/本番2URL不変、新建築・新コライダー0。旧K4/K4R/K4U ART REJECT、正式ART採用0、Slope2 DNA0m、候補SAT/CCD/HUMAN/FPS/RELEASE/MERGE全HOLD、PR#46 Draft OPEN未マージ。新チャットでは再添付不要、GitHubからActions/Artifactを確認して次へ。

## 【最新2026-11-02 K4AB 実際のGPU描画構造の真再現SOURCE TECH限定PASS → 次K4AC】

- **[最終K4AB GitHub Actions #41448066954](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41448066954) 全job SUCCESS**、[実Artifact #13144320278](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41448066954/artifacts/13144320278) ZIP **4,461,471B／SHA256 `78c0b3dec7ce2bac83a98d23332faad1e683ddaaaf4c1c9d0a3ef27995fa7baf`／33ファイルCRC全PASS**。[K4AB最終研究報告](docs/R19_A6P4_R2F5K4AB_NATIVE_RENDERED_WEBGL2_SOURCE_DRAW_PROVENANCE_JA.md)／[永続的なArtifact SHA＆反証マニフェスト](docs/R19_A6P4_R2F5K4AB_FINAL_GENUINE_RENDER_GROUP_EVIDENCE_MANIFEST.json)／[LIVE HANDOFF](docs/DOPAGAKI_LIVE_HANDOFF.md)。
- 元K4Zの82真正PNG SHA全部検証、元Road5 44.5〜47.5秒×7tick×両幅＝**14元WebGL2画像**と実GPU描画群ログ、46.0秒同一カメラ/球/物理で6元群を1つずつprivate描画スキップした**12真正WebGL2 A/B画像**を採取。元フルPNG 13/14SHA完全一致、残り1画像は実元CSS「NEAR MISS」0.24秒アニメ差**79,558画素**だけ。元CSS ROI x200..809/y418..589外の各**602,154画素は14/14全ビット一致**。マスクから元画像へ戻しても両幅で完全一致。元画像の3D画素変更を拒否する**CI負例テストPASS**。
- 画面の**46秒1時点だけ**で、実描画群のGPU可視寄与：14m/28m順でB48+fixture道路スキン34.474/35.863%、元路面視認4群15.623/13.442%、MEGA4.731/4.915%、A13/W9フレーム2.123/2.654%、B51動体0.090/0.150%、元EPIC未描画0%。これはHUD外RGB>40差分の割合、単純加算不可。元K4AAで問題化した「本当の元画面にはA5 GLBが描かれていない」誤解を防止し**元で実際に使用されたGPUソース群**を調べた。**実GPU深度・安全な歩行/敷地・人的視認秒数・建築の空洞の可読性は未測定**。
- **SOURCE TECH限定PASS／ART NOT_TESTED/HOLD、旧K4/K4R/K4U独立ART REJECT、正式ART採用0件・Slope2 DNA認定0m。** 元240Hz/球/Camera/B48 7/B51 28/Gold/P100/W9-X/B5/main/本番2URL不変、候補新モデル0/新コライダー0、全候補固有SAT/CCD/歩行/HUMAN/FPS/RELEASE/MERGE全HOLD、Draft PR#46 OPEN未マージ。**次K4AC**は元真正シーンの3D前後/オブジェクトdepthと高速追走時の時間窓を絞る研究であり、薄い屋根市場・透明床・磁力・テレポート等で偽装しない。GitHub正本から自動再開、ZIPや長文引き継ぎ要求禁止。

# DOPAGAKI SLOPE — 新しいChatのための永久GitHub再開入口

**ここは短い入口であり、技術正本を複製・上書きしない。** 作業開始時に必ずGitHubから現在の値を取得する。古いHEAD・古いCI結果よりも最新PRと根拠付きの正本を優先。2026-11-01作成。

## 【最新2026-11-02 K4AB 真正Road5 GPU描画群由来を実装／最終CI HOLD、次K4AC】

- [**K4AB実装・厳格反証日本語報告**](docs/R19_A6P4_R2F5K4AB_NATIVE_RENDERED_WEBGL2_SOURCE_DRAW_PROVENANCE_JA.md) → [K4AB最新版GitHub Actions #41446611321](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41446611321) → [LIVE HANDOFF](docs/DOPAGAKI_LIVE_HANDOFF.md)。**ソース真正K4Z 82PNG SHA再照合、元Road5 7tick×14m/28m真正14画像、tick11040両幅それぞれ6 GPU描画群のprivate-only実表示スキップ12枚を取得**。元カメラEye/Front・球XYZ・速度・道路ID・元物理/球/元球/原B48×7/B51×28の変更0、新候補・新衝突0。旧K4AAのA5反事実GLBは対象外で、元レンダラーの`roads`/巨大`megaWorld`/A13/W9`a13ArchMesh`/実B51機械ボディなど**実GPU描画呼び出し**を直接計測。
- 実画像における元14枚中13枚は**フルPNG完全一致**。28m tick11280の1画像だけ元CSS `NEAR MISS` の0.24秒アニメーションで **77,605px**の差が生じ、実座標 x219..794 / y426..575 に局在。アニメーションの外側は本当の元3D画面と一致し、元CSSだけを覆う x218..799,y418..589を独立検証時だけ除外すると14/14画像で各**606,970画素すべてビット一致**。元フルPNG SHAの不一致を隠さず別保存し、3D物理差・見かけの安全性に転用しない。K4AB 6群の実画素変化は元Road5の道路可視スキン34.63/36.06%、道路装飾15.62/13.41%、Mega4.69/4.88%、A13+W9 frame2.11/2.63%、実B51体0.09/0.15%、**EPICはそもそもNOT_DRAWN**（順に14m/28m）。**本物のGPU深度、連続視認秒数、建築可能性や公共用途の証明ではない**。
- **K4AB Actionsの最終全工程SUCCESSは現時点未確認のため SOURCE TECH判定HOLD**。旧ART REJECT維持、公式採用0・Slope2 DNA認定0m、候補独自B48全SAT/B51全CCD/床/人間/FPS/RELEASE/MERGEすべてHOLD。元ゲーム/本番URL/main/Gold/P100/W9-X/B5不変、Draft PR#46 OPEN未マージ。次K4ACは元WebGL2描画群の真の3D深度・時間窓・公共空洞の設計要件の検証に進む。新たな市場屋根の量産、未描画GLBへの代理レイでART合格の主張、透明床/磁力/テレポート禁止。GitHub正本だけで引き継ぐ。

## 【最新2026-11-02 K4AA Source Camera/A5反事実BVH限定PASS／実Road5視覚遮蔽・ART HOLD → K4AB】

- **[K4AA改訂GitHub Actions #41433154678](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41433154678) 全job SUCCESS**、[Artifact #13134579869](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41433154678/artifacts/13134579869) 実ZIP**2,114,811B／SHA256 `109520e30874d2d432e0b15db168ff6145e9d2194a7bd45f675cc9557cbd3747`、4ファイルCRC全PASS**。真正元K4Z PNG82枚実バイトSHA一致、元A5 GLB原2幅×5メッシュ10,566三角形／K4S独立GLB SHA一致。Road5元真正7tick×14m/28mの14カメラから計**1,512本のA5だけのBVH幾何レイ**、A5へのヒット**0/1512**（1500mと3000m共通）。元Road5の0.5秒ごとカメラEyeの差97.4〜99.5m、カメラFrontの角度差2.0〜11.9°。
- **【不可欠な反証】** 元K4Zは旧K3B `dist-private/r19a1` を使い、`r19a3=on` を有効にせず**A5研究都市5メッシュが真正元WebGL2の画面に描かれていない**。改訂CIが撮影URLとソース複製元・A3の表示ON条件を明示ASSERT。従って1,512本のA5レイは**同カメラに対する反事実の位置関係研究**であり、実画面に映る元道路・巨大ゲート・B51の3D遮蔽は未測定。**「A5に当たらない＝建築可能な空間」等の結論禁止**。K4AA計算SOURCE TECH限定PASS、**実視覚構図COMPOSITION_INCOMPLETE／ART NOT_TESTED・HOLD**。旧K4/K4R/K4U ART REJECT、正式ART採用0件・Slope2 DNA認定0mは全維持。
- [K4AA最終原報告](docs/R19_A6P4_R2F5K4AA_SOURCE_ROAD5_ORIGINAL_A5_VISUAL_LAYER_ART_FIRST_JA.md) → [K4AA SHA/反証の恒久JSON](docs/R19_A6P4_R2F5K4AA_FINAL_COUNTERFACTUAL_A5_EVIDENCE_MANIFEST.json) → [LIVE HANDOFF](docs/DOPAGAKI_LIVE_HANDOFF.md)。**次K4ABは元ゲームが本当に描いているB48道路・巨大フレーム・B51動体等の由来と立体遮蔽を先に確認する**。新モデル量産・元ゲーム物理/カメラ/source・main・本番/Gold/P100/W9-X/B5改変禁止。候補固有全SAT/CCD・床/HUMAN/FPS/RELEASE/MERGE HOLD、Draft PR#46 OPEN未マージ、Work事前許可。新チャットではGitHubから直接読み、ZIP再送・長文貼付に戻らない。

## 【最新2026-11-02 K4Z 真元240Hz/合法操舵のRoad5高密度カメラ取得・SOURCE TECH限定PASS／次K4AA】

- **K4Z [Actions #41427816258](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41427816258) 全job SUCCESS**。[Artifact #13133042206](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41427816258/artifacts/13133042206) ZIP9,152,549 bytes・SHA256 `2b6dc11228c561f07047253eb6a973d43ffa02e1b88894bf15c3e6abc6baf0e7`・83ファイルCRC全OK。元ゲーム真正WebGL2 **14m/28m×41時刻＝82PNG**を実独立照合。JSON109,457B・SHA256 `da69e5d9283f6a8fc5190cc9fefd4e8476114eedfb218fe2eb802bbecfcddb6c`、全82PNG SHA OK。**元K3Bとの共通14tick×両幅28原PNGがバイト完全一致**、K3 native元物理17tick×両幅34の球XYZ・速度・Road一致、元カメラ6tick×両幅一致。1撮影セッション/幅で合法元スクリプト操舵P96÷4.8→7680tickからP94corrective÷3、原物理/240Hz/B48 7/B51 28/カメラ変更0。
- 真正ロードID集計は各幅 **Road0〜6=4/2/5/6/10/7/5枚、AIR=2枚**。K4Yで1枚のみだったRoad5は**tick10680〜11400、0.5秒刻み7枚（44.5〜47.5秒）**に増加。**tick11520/11640はAIRでRoad5/6には数えない**。本物の元ゲーム約195〜199m/sで前景路面・既存巨大骨組みは確認、**新建築候補なし＝K4Z独立ART NOT_TESTED/HOLD**。旧K4/K4R/K4UのART REJECT、正式採用0・Slope2 DNA0mは維持。
- [K4Z独立日本語報告](docs/R19_A6P4_R2F5K4Z_DENSE_GENUINE_ORIGINAL_240HZ_CAMERA_JA.md) → [最新LIVE HANDOFF](docs/DOPAGAKI_LIVE_HANDOFF.md)。**次K4AA：Road5の本物の時刻別元カメラから「道路・既存都市・開いた公共空洞」の構図と奥行きが読み取れる設計要件をART-FIRSTで絞る**。新建築量産/低い屋根反復禁止、旧失敗繰返し禁止。元ゲーム/カメラ/物理/本番URL/main/Gold/P100/W9-X/B5不変。候補独自SAT/CCD/床/人間/FPS/RELEASE/MERGE全HOLD、Draft PR#46 OPEN未マージ。GitHub再開のみ、ZIP/長文手渡し要求禁止。

## 【2026-11-02 K4Y 元7道路の真正ART審査資料・SOURCE TECH限定PASS／次K4Z】

- **K4Y** [専用GitHub Actions #41424253272](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41424253272) **全job SUCCESS**、[元Artifact #13131795766](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41424253272/artifacts/13131795766) ZIP **5,330,171 bytes／SHA256 `d7b5b2637c4dc01095768af0cf6be04898c1b7d46f73624fbbda146606033415`／17ファイルCRC OK**。真元PNG K30＋K3B28＝58枚SHA完全一致、KとK3B共通12原画一致。元42状態（2幅×21tick）、元K4Xの1,764解析行・611数学的画像交差の来歴確認、K4Y詳細画像14枚・概観2枚・証拠JSON1件生成と実目視。CIの**SHA改ざん拒否テスト、欠測フレーム検査もPASS**。元ゲーム/物理240Hz/Camera/球/B48 7/B51 28不変、新モデル/コライダー0。
- 各道路・各幅の元画像数は**Road0〜6 = 4/6/2/4/2/1/2件**。欠測を絵で埋めず、K/K3B別撮影を1本の連続走行と偽称せず、Road5の実画像は各幅1時点のみ。建築候補は制作していないため、**K4Y SOURCE TECH限定PASS／独立ART NOT_TESTED・HOLD、旧K4/K4R/K4Uの独立ART REJECTは維持**。正式ART採用0件、Slope2 DNA認定0m、安全SAT/CCD・歩行・人間操作・FPS・RELEASE/MERGE全HOLD。
- [K4Y日本語独立審査・次ゲート](docs/R19_A6P4_R2F5K4Y_ART_FIRST_NEGATIVE_SPACE_COMPOSITION_CONTRACT_JA.md) → [LIVE HANDOFF](docs/DOPAGAKI_LIVE_HANDOFF.md)。**次K4Zは元真正カメラ撮影の不足（特にRoad5）を補う方法の研究**。新建築量産STOP、元source/本番URL/main/Gold/P100/W9-X/B5改変禁止。PR#46 OPEN Draft未マージ。新チャットではGitHub直接参照、ZIP/長文貼付不要。

## 新チャットでの操作 — 1文のみ。ファイル添付・ダウンロード不要

「**DOPAGAKI SLOPEをGitHub正本から引き継いで、次の工程を進めて。**」

GitHub接続済みChatGPTが上の1文を受けたら、本人に過去ZIP・Markdownや長文プロンプトの再貼付を求める前に以下の順に実行する。

## 自動で読む順序

1. GitHubの `ryomashibaba/dopagaki-development-hub` の [Draft PR #46](https://github.com/ryomashibaba/dopagaki-development-hub/pull/46) を直接取得し、**現在のHEAD**・OPEN/Draft/未マージ・保護対象を検査する。
2. PRのhead branch `p101-velocity-overdrive-native-trial` で最新 [`docs/DOPAGAKI_LIVE_HANDOFF.md`](https://github.com/ryomashibaba/dopagaki-development-hub/blob/p101-velocity-overdrive-native-trial/docs/DOPAGAKI_LIVE_HANDOFF.md) の**冒頭から最新工程を読む**。旧履歴を新状態として誤認しない。
3. [`PROJECT_STATE.md`](https://github.com/ryomashibaba/dopagaki-development-hub/blob/p101-velocity-overdrive-native-trial/PROJECT_STATE.md) で固定された全体目標・設計経緯・過去の合否・失敗原因・運用ルールを確認する。最新ゲートと矛盾した古い記述は履歴と扱う。
4. 最新 [K4U移設原本・16真正WebGL2独立ART REJECT](https://github.com/ryomashibaba/dopagaki-development-hub/blob/p101-velocity-overdrive-native-trial/docs/R19_A6P4_R2F5K4U_FROZEN_ART_ONLY_ROAD0_RELOCATION_TRUE_WEBGL2_JA.md) と、直前の [K4R設計・独立CI審査ゲート](https://github.com/ryomashibaba/dopagaki-development-hub/blob/p101-velocity-overdrive-native-trial/docs/R19_A6P4_R2F5K4R_ROAD0_MARKET_NATIVE_REDESIGN_JA.md) と、直前の [K4審査正本](https://github.com/ryomashibaba/dopagaki-development-hub/blob/p101-velocity-overdrive-native-trial/docs/R19_A6P4_R2F5K4_ROAD0_ONE_NATIVE_MARKET_16_TRUE_WEBGL2_TECH_PASS_ART_REJECT_JA.md) と直前 [K3/K3B正本](https://github.com/ryomashibaba/dopagaki-development-hub/blob/p101-velocity-overdrive-native-trial/docs/R19_A6P4_R2F5K3_K3B_ALL_SEVEN_TRUE_ORIGINAL_CAMERAS_ART_HOLD_K4_GATE_JA.md) を読む。必要に応じてK2、I/J、F/G2等の判定報告と原Actions・Artifactを照合する。
5. **最新ブランチ・CIを起点として継続**し、ソース追加/QA/画像/SHA/アート判定/未検証事項/次工程をGitHubで保持する。チャットでは要点＋正本リンクのみ。新チャットを開始するたびに全資料を再生成しない。

## 【最新2026-11-02 K4X全7道路元カメラ構図研究TECH限定PASS／ART REJECT・次K4Y】

- [K4X原GitHub Actions #41390354006](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41390354006) **全job SUCCESS**、[Artifact #13117255848](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41390354006/artifacts/13117255848) **2,048,804 bytes、SHA256 `97bc93fbc9f3054db1ac6a95632e6e275fe9018fe3e26befd8afbff07098b49f`／3ファイル・CRC PASS**、原研究JSON SHA256 `867c82c2ea3033e61c331a82aa63a2b1a0a674afc5fdd4cf45afdc9bb965c007`。K原画像30枚・K3B原画像28枚、合計**58真正WebGL2原PNG SHA一致**。重複12件SHA一致。元42カメラ状態×42個の数学的な道路外部位置（全7道路×左右×u=.25/.5/.75）＝**1,764調査行**。**K前半13＋K3B後半8の2幅別記録を合成した研究資料であり、単一の連続走行ではない**。
- 数学的に概念床の四角形が画面枠に一部入るのは**611/1764**、元カメラが走るのと同じ道路の位置だけなら**93/252**。道路別中央時刻の実14画面に一律u=.5左右70mの数学的床を後描きすると**1画面で片側だけ**少し収まり、他は画面外／後ろ向き投影不可。**同じ配置を全Roadへコピーする計画は裏付けられない**。これは本物の建物の実遮蔽や可読性ではない。
- 次K4Y：[K4X研究・独立原審査](docs/R19_A6P4_R2F5K4X_TRUE_7ROAD_NEGATIVE_SPACE_COMPOSITION_RESEARCH_JA.md) → [最上段LIVE HANDOFF](docs/DOPAGAKI_LIVE_HANDOFF.md)。元カメラの道路・巨大原A5骨組み・道路を**公共空洞の用途・前後奥行き・地表接続をどう認知できる構図にするか**という独立ART契約へ落とし込む。新建築・街区の量産はSTOP、順位付けだけで採用禁止。K4/K4R/K4U ART REJECT維持、正式ART0件、Slope2 DNA0m、元ゲーム240Hz/球/カメラ/B48 7/B51 28/main/本番2URL/Gold/P100/W9-X/B5非変更。安全SAT/CCD、人間操作/歩行、FPS、RELEASE、MERGE全HOLD、PR#46 OPEN/Draft未マージ。手動ZIP受渡し方式に戻らない。

## 【履歴：K4W真正Camera逆算・実GitHub CI全成功、独立ART REJECT／次K4X】

- [K4W Actions #41379909949](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41379909949)全job**SUCCESS**。[Artifact #13113495400](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41379909949/artifacts/13113495400) ZIP **1,130,558B／SHA256 `1089f0eadd2eedce41095246ab618a2fc350b5dd90fc60811ec2fc9dd3c4d92f`／3ファイルCRC PASS**、証拠JSON SHA256 `2894ecddb21591fc62c6629792de29b4e2f8b87cc11df71ae44bfdad81fd5fea`。元K/K4R/K4U/K4V原Artifactと真元Camera/SHA、凍結モデルK4R原コード、K4Vの16測定値を全部再計算照合、両幅×4tickの真正元A5/K4U WebGL2を後から注釈した比較画像2枚を独立取得。新建築0、コライダー0。
- K4U中庭床(20m×28m)はK2近似射影・元14m/28m真正Cameraでは、元4tickの14mで**縦6.93/8.87/11.68/15.38px**・1.7m定規**1.62/2.22/3.26/4.88px**。仮に8pxの垂直目印に必要な仮物理高さ**8.36/6.13/4.17/2.78m**、中庭縦24pxに必要な等方倍率**3.43/2.68/2.04/1.55倍**は、現凍結屋根x開口の上限1.20倍をすべて超える。**8/24pxは視認合格の実証済み基準ではなく研究比較値**。ゲームで人物や新建築を描画していない。K4/K4R/K4U独立ART REJECT、正式ART採用0・Slope2 DNA認定0m。
- **次K4X**：[K4W完成判定](docs/R19_A6P4_R2F5K4W_SOURCE_CAMERA_INVERSE_VOID_CONSTRAINTS_JA.md) → [最新LIVE HANDOFF](docs/DOPAGAKI_LIVE_HANDOFF.md)。元全7道路真正Cameraの都市空間の「負空間・公共用途・奥行き」が走行画面で読める構図条件を**新モデル0のART-FIRST研究**で整理する。屋根増築・モデル量産・微移設をやり直さない。B48/B51候補固有SAT/CCD/人間・歩行/FPS/RELEASE/MERGE全HOLD。main/本番/Gold/P100/W9-X/B5/元240Hz物理/カメラ変更禁止、PR#46 OPEN Draft未マージ。新チャットはGitHubを直接読み込み、長文・ZIP手動受渡しに戻らない。

## 【履歴：K4W新コード実装とCI未確認だった段階】

## 【2026-11-02 最優先 K4W：「人間の大きさ／中庭」のスクリーン制約を原Cameraから逆算（CI待ち）】

- [K4Wコード](scripts/p101-r19a6p4r2f5k4w-original-camera-void-constraint-study.py)・[専用Actions #41379909949](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41379909949)・[K4W日本語根拠報告](docs/R19_A6P4_R2F5K4W_SOURCE_CAMERA_INVERSE_VOID_CONSTRAINTS_JA.md)を追加。元7道路アンカー、K4R/K4U真正WebGL2原16画像、K4V元研究値16件と凍結旧コードを読み取り専用で検算する。**専用CIの最終SUCCESSは未確認のためTECH正式判定HOLD**。ユーザーのローカル操作不要。
- **独立逆計算**（14m、4つの元Camera、K2の近似画角）：元K4U中庭の1.7m定規は1.62/2.22/3.26/4.88px、仮8pxにするのに必要な垂直寸法は8.36/6.13/4.17/2.78m。元中庭床の縦6.93/8.87/11.68/15.38pxを仮24pxにする等方倍率は3.43/2.68/2.04/1.55、凍結元屋根のx開口上限1.20倍をいずれも超える。28m側もほぼ同等。**8/24pxは美術可読性の既知の合格基準ではなく、人物や建物の実描画ではない**。既存の屋根を少し広げるだけでは、この仮の画面条件に到達しないことを示す研究。
- 最新の実真正WebGL2審査は**K4V TECH限定PASS／K4/K4R/K4U 3連続独立ART REJECT**、公式ART0・Slope2 DNA0m。次回は最初にK4WのCI結果・原Artifact・16測定・注釈画像2枚を確認し、実証完了したら空洞・用途・奥行きが理解できる元カメラ構図の研究へ。モデル量産STOP、B48/B51 SAT/CCD・人間/床/FPS/RELEASE/MERGE HOLD。元ゲーム/カメラ/物理/本番/main不変、Draft PR#46未マージ。ZIP等の手動受渡しに戻らない。

## 【履歴：K4V真正元ゲーム画面・中庭判読研究：TECH限定PASS・ART REJECT／次K4W】

- **[K4V Actions #41374785974](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41374785974) 全ジョブSUCCESS**、[Artifact #13110464698](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41374785974/artifacts/13110464698) ZIP **1,630,984 bytes／SHA256 `0f55e30308d9756433cf79693c898bf6524908c92dd1cd2291c15fa036b7028e`／9ファイルCRC正常**、根拠JSON SHA256 `70fe2ba8bcfa18a28e7332c0908e278cd21fc4c05a4cf39d27a9bbc3ef895b6d`。元A5/K4R/K4U真正WebGL2 PNG 24枚のSHA一致、元XYZ/速度/240Hz/CameraEye/Front、原建築モデルBlender report/GLB SHA照合。**新建築0、コライダー0、元本番/物理/main不変**。
- 中庭は3Dで実際に屋根が開放されているが、同じ約20×28mの中庭床の**K2近似投影**ではK4U u=.85の14m元走行画面でtick265/721/1057/1249に**高さ6.93/8.87/11.68/15.38px**。画面に立つ**仮想1.7m定規**は約**1.62/2.22/3.26/4.88px**（人物モデルは存在しない）。K4Uでは画像内クリップが減る一方、元市場K4Rより中庭自体が小さく見える。真画像の差分のうち近似中庭内は14mでK4U 4.1〜6.5%で用途は読めない。**技術計測成功≠市場ART採用**。
- [K4V完成独立審査・次ゲート](docs/R19_A6P4_R2F5K4V_TRUE_SOURCE_CAMERA_PUBLIC_COURT_READABILITY_RESEARCH_JA.md) → [LIVE HANDOFF](docs/DOPAGAKI_LIVE_HANDOFF.md) を最優先。**K4/K4R/K4Uすべて独立ART REJECT維持、正式採用0件／Slope2 DNA0m**。次工程**K4Wは元高速走行カメラで人間スケール・空洞の深さが成立する設計条件の研究だけ**。屋根増築・市場コピー・小刻み位置変更・B48/B51コライダー/ゲーム物理・カメラ/公開・main変更は禁止。全B48/B51 SAT/CCD/床/HUMAN/Windows iPhone FPS/RELEASE/MERGE HOLD、PR#46 OPEN Draft未マージ。新チャットで長文貼付やZIP再送を要求せず正本を直接読む。

## 【履歴：2026-11-02 K4U実造形TECH限定PASS／ART REJECT、次K4Vと決めた当時】

- [K4U GitHub Actions #41359514124](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41359514124) **全job SUCCESS**、[原Artifact #13104454224](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41359514124/artifacts/13104454224) **4,070,133bytes SHA256 `2b3480cafc1d64c5a861c8b927f42c96cb3120fc7c8fa4a76b108cec2d37ca00`／26ファイル／16真正PNG-SHA実物一致**。K4Rの凍結同一34モジュール・668新面・GPU11,902三角形を元Road0 `u=.75`→`u=.85`に**位置だけ**移動。元A5元画像8/8はK4R/K4Uで完全同一、元球/速度/カメラ・B48 7/B51 28/240Hz/元source変更0、追加collider0。
- **独立ART REJECT**：本物の14m/28m×4tick画面ではt=5.204sで屋根群が少し画面内に増える一方、t=3.004/4.404sではむしろ小さく見える。市場・真の屋根下空間・都市的公共中庭・人間スケールが認識できない。**K4→K4R→K4Uの繰返し3段階とも正式美術REJECT、ART0・Slope2 DNA0m。**
- **次K4V：実原画から真の公共空洞が理解できない原因の独立ART研究を優先、同じ屋根の増築／数mの小刻み再移設／量産停止**。安全B48/B51 SAT・CCD/実歩行・人間操作・FPS/RELEASE/MERGE全HOLD。main/Gold/P100/W9-X/B5/本番2URL未変更、PR#46 OPEN/Draft未マージ。新チャットは [K4U最終QA報告](docs/R19_A6P4_R2F5K4U_FROZEN_ART_ONLY_ROAD0_RELOCATION_TRUE_WEBGL2_JA.md) → [LIVE HANDOFF](docs/DOPAGAKI_LIVE_HANDOFF.md) 最新冒頭を直接読む。手動添付・ZIP受渡しに戻らない。

## 【履歴：K4S/K4Tの元カメラ研究 — K4Uの判定より前】

- **K4S [Actions #41352432473](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41352432473) 全ジョブSUCCESS。** [Artifact #13102955065](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41352432473/artifacts/13102955065) ZIP12,512B SHA256 `f8a290a21097d06850f123186a5205834efd2d2ffab06fd1b010a906b6b80a11`。元A5 5メッシュ（各幅10,566三角形）・元K/K3B全58枚の真正PNGをSHA検証。元14/28m合計42カメラ×8配置＝336評価行の遮蔽4整数**1,344個全一致**。**SOURCE/BVH TECH限定PASS**（ART/HUMAN/SAFETYではない）。
- Road0市場の `u=.85・右70m`は、K4R失敗位置`u=.75・右70m`より**tick1249の代理外殻が28→63/75、中央空間2・1→9/9点**（14/28m）。原A5 BVH以外の遮蔽や実3D建築は未評価、位置は**仮説**でありART正式採用でない。
- **K4T（初回 #41354665119は通常Pythonのargv解析不一致でFAIL、修正commit 3776f4d・正規再実行 #41355153090）** [真正元A5 WebGL2注釈付き画像研究](docs/R19_A6P4_R2F5K4T_TRUE_SOURCE_WEBGL2_SITE_OVERLAY_REVIEW_JA.md)／[CI #41354665119](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41354665119)を新規実装。K4Rの**本物の原A5画像8枚**で原CameraEye/Front/球XYZ/SHAを再照合し、2研究地点のK2近似枠だけを描く（**新建築の真WebGL2レンダリングではない**）。実験結果はCI最終確認前HOLD。次チャットは**まずK4TのActionsと原Artifactを確認**し、その真画像上でどの程度見やすい位置かを慎重に審査する。元ゲーム・物理・カメラ/コライダー/本番URL/main/Gold/P100/W9-X/B5は未変更、新模型0、PR#46 Draft未マージ、正式ART0/Slope2 DNA0、HUMAN/B48B51全SAT/CCD/FPS/RELEASE/MERGE HOLD。

## 【履歴】K4S計算実装・CI待ち（上の最終TECH限定PASSを優先）

- K4Sの[研究コード](scripts/p101-r19a6p4r2f5k4s-source-occlusion-study.py)／[独立CI](.github/workflows/p101-r19a6p4r2f5k4s-original-camera-site-study.yml)／[審査正本](docs/R19_A6P4_R2F5K4S_TRUE_SOURCE_7ROAD_BVH_SITING_STUDY_JA.md)はGitHubに保存。**[Actions #41352432473](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41352432473)は起動後、成功判定は実行結果確認までHOLD**。
- 元K/K3BのWebGL2計58PNGのSHAを直接検証し、実7道路の元14/28mカメラ合計42状態、原A5 GLB5メッシュの独立BVH遮蔽と市場Road0 6配置＋旧K2参考2配置＝8代理サイト研究のみ。**新Blender建物・物理床0、模型製作STOP、公式ART0件/Slope2 DNA0m**。カメラ矩形と遮蔽の研究データは美術合格／障害物可視性/全SAT/CCD/人間操舵の証明ではない。
- 次回はZIP再提出を要求せず、**まずK4S ActionsとArtifactの原本を検証**、実際の遮蔽率と時系列から再配置の研究判断。K4/K4R二連続ART REJECT、本番/main/Gold/P100/W9-X/B5変更禁止、Draft PR#46マージ禁止。Work事前承認。

## 【直前の実測 2026-11-02 K4R】独立TECH限定PASS・ART REJECT — 次K4Sカメラ地点研究

- [K4R Actions #41351118263](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41351118263) **SUCCESS**、[Artifact #13101775313](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41351118263/artifacts/13101775313) **4,043,206bytes／SHA256 `4e41ad2be9cf2c360a1727d6dfbb372e56c7a08698192dd5da87c807298ddcf6`**。Native Blender 4.0.2、実34モジュール/668新面/GPU三角形11,902。元A5・K4Rの14/28m×4tickの16真正WebGL2 PNG/SHA全部一致、旧K4元8PNGとも元原画像8/8バイト一致。元B48 7/B51 28、240Hz、球XYZ/速度/元カメラ不変、新collider0。
- **独立ART REJECT**：新屋根／テラスの画面差増は確認できたが、高速走行画面で独自市場・実空洞・都市的空間が依然読み取れない。K4に続く同一地点二連続ART REJECTのため増築ループを止め、**次K4Sは本当の7道路カメラで地点・遮蔽・投影スケールを研究するだけ**。新BLENDや別道路候補の量産は禁止。正式ART 0件／Slope2 DNA 0m、B48/B51/CCD/HUMAN/FPS/RELEASE/MERGE HOLD。main/Gold/P100/W9-X/B5/本番URL不変更、PR#46 OPEN Draft未マージ、Work事前承認。
- **[K4R完了独立審査](docs/R19_A6P4_R2F5K4R_ROAD0_MARKET_NATIVE_REDESIGN_JA.md) → [LIVE HANDOFF冒頭](docs/DOPAGAKI_LIVE_HANDOFF.md) が最新版。** 以下のK4R実装中・CI未判定記述は履歴であり最新の結論ではない。

## 【履歴】K4R造形保存・原WebGL2 CI実行待ち（現在は判定済み）

- **[K4R専用Actions #41351118263](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41351118263)**。同じRoad0 u=.75右70mの1市場を独立造形へ差替。非対称の高低ある折板建築、奥行きある居住・交易テラス、空に開いた中央広場をNative Blenderでモデル化。14/28m×原/K4R×原カメラ4tick=**真正16枚を自動検証する新runner**を追加。**原WebGL2の成功およびART評価はCIと新画像の直接確認前に主張禁止。**
- [K4R開発と判定正本](docs/R19_A6P4_R2F5K4R_ROAD0_MARKET_NATIVE_REDESIGN_JA.md) → [LIVE HANDOFF](docs/DOPAGAKI_LIVE_HANDOFF.md) の最上段を読む。元K4はTECH限定PASS／ART REJECT。正式ART 0件／Slope2 DNA 0m、SAT/CCD/HUMAN/FPS/RELEASE/MERGE HOLD。物理/本番/main変更禁止。**新チャット再開時は実際のCI実行完了を確認し、新16PNGを独立評価してから次工程を決める。**

## 直前K4実測（2026-11-02 K4）— 次工程K4R、ART 0/Slope2 DNA 0

- [K4 Actions #41320140127](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41320140127)全job **SUCCESS**。原A5の5メッシュにRoad0市場**1案**だけ追加。14m/28m×原/新×4tick=16真WebGL2 PNG/全SHA独立一致。Native Blender 4のBLEND/GLB各2、32モジュール、三角形10,566→11,406。元原物理240Hz、元球XYZ/速度/カメラ、7 B48・28 B51・元source `af076d67492a677d2235e4730aef8cdf4808e106` 変更0、追加collider0。
- Artifact #13089117035／4,022,036 bytes／ZIP SHA256 `223a4e9d476c767d04b9479e537f8bdc2c6951bb283f3914a38397384969bb0e`。原ZIP16/16真正PNGを直接取得・検査。**TECH限定PASS、独立ART REJECT**：追加形は右側の小屋根・売店にしか見えず、元大型構造の足元に埋もれる。用途の異なる実市場街区や屋外公共空間として成立しない。数字上の画像差をART PASSに転用禁止。
- **次K4R**：別候補を量産せず、同一Road0 u=.75/右70mの開いた市場1案を、元真正4tick×2幅の画面に従い建築的立体シルエット・公共空間を再構成。K4現候補は不採用。技術成功を人間操舵・HUMAN・FPS・候補固有全B48/B51 SAT・CCD成功と混同しない。
- **正式採用ART 0／Slope2 DNA 0m、GAMEPLAY/HUMAN/SAFE/PERF/RELEASE/MERGE HOLD、PR #46 Draft未マージ**。main/Gold/P100/W9-X/B5/本番URL保護。[K4独立原画像審査正本](docs/R19_A6P4_R2F5K4_ROAD0_ONE_NATIVE_MARKET_16_TRUE_WEBGL2_TECH_PASS_ART_REJECT_JA.md) → [LIVE HANDOFF](docs/DOPAGAKI_LIVE_HANDOFF.md) の新節を優先参照。

## 直前の歴史的K3B実測（2026-11-01。上記K4の判定を優先）

- 正本branch `p101-velocity-overdrive-native-trial`。引き継ぎ入口作成前の確認HEAD `961e502cb7bf71aab81e193663254608a04362b9`。**これは固定するHEADではない**。新しいチャットではPRから毎回取得すること。
- K3 Native試験 [Actions #41314887466](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41314887466) PASS：14/28m×8法＝16試行、後半P94 corrective÷3とfullで両幅4試行が**元240Hz・本物のB48×7/B51×28の物理完走**。人間走行とは認めない。
- K3B WebGL2 [Actions #41315509252](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41315509252) PASS：本物の元240Hz/元カメラ、28PNG/28SHA、元6tick×両幅カメラと後半8tick×両幅native XYZ/速度一致。Road4〜6を実画面で確認。KのRoad2真正画像と合わせて**元7区間すべてのカメラ観測成立**。
- **正式ART採用0件、Slope2 DNA認定0m、R2F5-I/G2/FのART REJECTは維持**。今回のTECH成功をART成功と誤認しない。ART/HUMAN/FPS/独立候補固有SAT/CCD/B51視認/RELEASE/MERGE HOLD。
- **次工程 K4：元カメラ検証済みのRoad0で開放型市場街区を1案だけ本物のNative Blender/GLB制作**。14m/28m・最低4tick×2幅の真正元カメラWebGL2で独立美術審査。大壁・2小屋・反復柱・ラベルや演出だけの偽装を避ける。不十分ならART REJECTとして量産を止め、改善研究。
- 元ゲームの物理、240Hz、球半径0.65m、52→206.28m/s目標、B48 7区間/B51 28台、7,280m、左右操舵、自然ジャンプ、元カメラを保護。main、Gold/W7F、P100、W9-X、B5、原作再現、本番2サイト、旧凍結成果物を無断変更しない。

## 運用上の絶対禁止

- 新規作り直し／全体方針の再決定／原作忠実度や美術の妥協／成果未確認のPASS宣言。
- mainへのpush、PR #46のReady化・merge、本番サイトの公開・更新、ユーザーの明示承認なしのWork移行。
- 不可視床/磁力/テレポート/瞬間球位置・速度操作など原物理を偽装する工作。
- 長大ZIPの手動アップロードをデフォルトに戻すこと、毎回引き継ぎMarkdownを再添付させること。
- 技術PASS、投影のみPASS、真正画像PASS、ART PASS、人間プレイPASSを混同すること。

## 各工程の終わりに行うGitHub更新

同じDraftブランチの `docs/DOPAGAKI_LIVE_HANDOFF.md` の**先頭**へ完了した工程の実証/FAIL・正しい次工程を追記し、過去の意思決定・失敗理由の恒久記録を `PROJECT_STATE.md` に必要に応じて更新する。現HEADとCIを確認し、メッセージは短く、**次チャットではこの入口から自動再開できる**ように保つ。
