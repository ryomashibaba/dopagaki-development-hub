# DOPAGAKI SLOPE — START HERE（新チャットの唯一の短い入口）

**更新：2026-11-03 11:36 JST**。このファイルは`research/k4aj-native-b51-gpu-depth-contiguous-window-20261103`研究ブランチの入口です。**最新CIとHEADは必ずその場でGitHub照合**すること。古い引き継ぎメモの「最新」「queued」を現在値として再利用しない。

## まず読む2つ

1. [完全統合引き継ぎ正本 — 目標・凍結契約・過去の教訓・検証証拠・次工程](docs/DOPAGAKI_COMPLETE_INTEGRATED_HANDOFF_20261103_JA.md)
2. [現工程K4AJのコード/真正GPU実測/独立監査契約](docs/R19_A6P4_R2F5K4AJ_ORIGINAL_NATIVE_B51_GPU_OCCLUSION_WINDOWS_JA.md)

元の長大な`DOPAGAKI_RESTART_JA.md`/`docs/DOPAGAKI_LIVE_HANDOFF.md`/`PROJECT_STATE.md`は重要な履歴だが、旧「最新」の追記が残っている。まず上記の統合正本を基準に、必要な旧フェーズだけ確認する。

## 現在の判定スナップショット

- 開発目標：**約7,280m、約52秒・200m/s級の本物のSlope2高速走行**と、世界水準の圧倒的な超未来都市造形を一体の人間プレイ体験で完成。ART-FIRST。**正式ART採用0件、Slope2 DNA認定0m**。
- 本来の継続ブランチ`p101-velocity-overdrive-native-trial`、[Draft PR #46](https://github.com/ryomashibaba/dopagaki-development-hub/pull/46) OPEN/unmerged（11/03確認HEAD `19d3a32d525c0c2a67082cba646898fab8f2b60f`）。**main・本番・PR#46に無断変更禁止**。
- 元source Blob`af076d67492a677d2235e4730aef8cdf4808e106`、元球半径0.65m/240Hz/Camera/B48道路7/B51元動体28体、Gold/P100/W9-X/B5と本番URL固定。隔離研究以外への反映禁止。
- **K4AI SOURCE GEOMETRY TECH限定PASS**：[Chromium真正1,442元tick実走行CI #41560614512](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41560614512)成功、[元Artifact SHA固定独立再監査CI #41561002955](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41561002955)成功。
- **K4AJ SOURCE GPU TECHは未確定／HOLD**：[現行CI #41566784540](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41566784540)は11/03 11:36時点で`queued`、Artifact0。100元GPU/100 B51 BODY全28体group mask/100元復元、300順次GPU seq、99連続native tick＋参照tick、独立5改ざん負例を検証。**本物のGPU結果なしに遮蔽秒数を報告しない**。新しいCIがあればそちらを実際に確認。
- K4AGにおける元個体ID`p95-hazard-12`のGPU原因確定は**tick11280に限定**。ほかのtickの単体IDはUNKNOWN。K4AIの幾何距離と、人間の視野遮蔽時間は別物。
- **ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD**、正式ART0件・Slope2 DNA0m、研究用モデル/Collider新規0。旧K4/K4R/K4U ART REJECTを勝手に覆さない。

## この次に実行する作業

1. GitHubでK4AJ研究ブランチ最新HEAD、[#41566784540](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41566784540)と、それ以降のrun、Artifact、PR#46を確認する。
2. CI成功ならArtifact ZIP/SHA/CRC、元画像・元GPU/復元depth、100×11,176データ・300seq・元K4AFアンカー/個体帰属の独立監査を実施し、**当該観測窓のGPU sampled-depth区間**のみ確定。失敗なら最初のエラーを根拠に最小修正。queuedなら**余計なworkflow対象pushによるCIキャンセルを避ける**。
3. SOURCE TECH PASSしてもART合格とせず、将来都市の大幅な美術改善につながる具体的ART-FIRST候補と本物の人間プレイ審査へ接続する。実コード改修・テスト・GitHub保存まで進める。
4. Chat + GitHub中心、ユーザーのローカルPC操作・ZIP作業を求めず、**Workは事前承認なしに使用しない**。最新の正本を随時更新し、新チャットに長大なプロンプト貼付を要求しない。

## 新チャットからの一文

「DOPAGAKI SLOPEをGitHubの`research/k4aj-native-b51-gpu-depth-contiguous-window-20261103`の**START_HERE.md**から完全に引き継いでください。統合正本・固定方針・反省点を守り、最新CIとDraft PR #46を実照合して次の正当な開発工程を実装・検証・GitHub保存まで進めてください。main・本番・Work無断使用は禁止です。」

## 2026-11-03 11:53 JST 追加：K4AK ART-FIRST 非干渉工程

K4AJ本命の[Actions #41566784540](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41566784540)は11:53 JST照会時点でも `queued`、Artifact 0件。**GPU遮蔽区間は未確定**。K4AJ対象script/workflowへ再pushしてキャンセルしない。

前工程の待機と並行して、[K4AK ART-FIRST審査設計](docs/R19_A6P4_R2F5K4AK_ART_FIRST_GPU_TO_TRUE_CAMERA_REVIEW_JA.md)、[K4AK読み取り専用レビューゲートPython](scripts/p101-r19a6p4r2f5k4ak-art-first-review-packet.py)、[専用の低負荷・非干渉CI #41568787273](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41568787273)を隔離研究ブランチへ追加。7種類の合成データ改ざん負例と真Artifact不足を拒否する設計。**専用GitHub CIの実行はqueuedでありPASSではない**。K4AJ生Artifactの真SHA/CRC/全GPU深度監査はこのスクリプトで代替できない。元ゲーム、main、PR#46、本番、元ソースblob、B48/B51、Camera、元物理は変更なし。

次はまずK4AJ・K4AKのCIの実行結果と生Artifactを確認し、K4AJがSUCCESSなら生SHA/CRCを独立検証した後に限ってK4AKを**実Artifactに適用**する。ARTは未制作のRoad5《斜裂公共峡谷》構図1方向を真正元カメラのA/Bで検討する方針だが、現状の新ART候補モデル0、正式採用0、Slope2 DNA0m、HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。過去K4/R/U不採用は変更しない。

## 2026-11-03 K4AL：真正RGBの取得不足を静的計算・コード検証（K4AJ/K4AK非干渉）

[ART-FIRST RGB証拠照合と次工程](docs/R19_A6P4_R2F5K4AL_ORIGINAL_RGB_EVIDENCE_COVERAGE_AND_ART_FIRST_JA.md)、[K4AL実装](scripts/p101-r19a6p4r2f5k4al-true-rgb-coverage-audit.py)、[合成100ケースE2Eと5負例テスト](tests/p101-r19a6p4r2f5k4al-rgb-coverage.test.py)を同研究ブランチへ保存。撮影**計画上**、K4AJ元RGB画像は8時点（元/mask/復元×各1）、K4AK ART-FIRST審査要求は15時点。共通6／未撮影9／追加2を検出。**まだ真正画像の実取得成功ではない**。K4ALの自己検証・100合成ケースE2Eと5改ざん負例はローカルPASS、真Artifact適用はHOLD。queuedのK4AJ #41566784540／K4AK #41568787273をキャンセルさせないため、それぞれのworkflow対象scriptは変更せず、独立K4ALファイルと文書のみ追加。**直近のCI結果は必ず再照会**。真K4AJ ZIP/SHA/CRC/生depth独立PASS後だけK4AK→K4ALの順に適用。正式ART採用0件／Slope2 DNA認定0m、HUMAN/SAT/CCD/FPS/RELEASE/MERGE HOLD、本番・main・PR#46不変更。

## 2026-11-03 K4AM：ART審査用の真正元RGB9時点欠落を補う独立実装

[K4AM設計・審査契約](docs/R19_A6P4_R2F5K4AM_NINE_MISSING_ORIGINAL_RGB_TRUE_WEBGL2_JA.md)に従い、[真正Chromium取得コード](scripts/p101-r19a6p4r2f5k4am-genuine-original-nine-rgb-gaps.mjs)、[独立GPU/RGB監査](scripts/p101-r19a6p4r2f5k4am-independent-nine-rgb-depth-audit.py)、[合成負例](tests/p101-r19a6p4r2f5k4am-independent-native-rgb-depth.test.py)、[専用CI](.github/workflows/p101-r19a6p4r2f5k4am-original-nine-missing-rgb.yml)を隔離研究ブランチへ保存。K4ALで判明した元RGB不足9tick＝14m:11326/11338/11349/11351/11363、28m:11265/11277/11284/11301に限定し、元RGB／B51全28体group visual mask／復元RGBの**各3枚×9tick=27PNG**、**本物のGPU readback 27本・各11,176点**を取得する実装。元K4AI確定生JSON SHAと元ゲームsource blob固定。**GitHub CI実測結果・Artifactが確認されるまで完了PASS扱い禁止**。K4AJ、K4AK、K4AMの3 CIは独立。元HOLDをすべて継続し、新ARTモデル0、正式採用0、Slope2 DNA0m、PR#46・main・本番不変更。

次は3本のCI結果を実照合し、成功時のみK4AJ生Artifact SHA/CRC/depth独立監査→K4AK実レビューpacket→K4AL＋K4AM元RGB真正画像SHA突合→候補デザインの元cameraでのA/B審査へ進める。単に15元RGBが揃っても**人間可読性や新候補ARTは未検証**。

## 2026-11-03 K4AJ真GPU成功・K4AN本物のART-FIRST原画検査へ（今回の最新）

- **K4AJ GitHub Actions #41566784540 completed/success**。真正Artifact #13201661563、**11,959,523 bytes／ZIP SHA-256 `60aab331d8881b5f8f456539c00566837a2b061a96ab0725ce7c17ea91ed8efb`**、28件CRCすべてPASS。実生GPU 100元／100全B51 group mask／100復元×11,176点、300seq連番・元深度完全復元を別環境で独立再計算。詳細：[K4AJ最終実証](docs/R19_A6P4_R2F5K4AJ_CONFIRMED_100_NATIVE_GPU_DEPTH_ART_HOLD_20261103_JA.md)。
- 元GPU深度格子でB51群の寄与が1点以上の元native tick：**14m 39/50（11320–11350、11362–11369）**、**28m 38/49（11259–11288、11300–11307）**。最大は14m tick11339で11,176/11,176=100%、28m tick11277で6,396/11,176=57.2298%。tick数÷240秒の数値を**人間の視界遮蔽秒数と誤認しない**。個体別原因帰属はK4AGのtick11280だけ。
- 元sourceの実8時点×元/mask/復元PNGを目視・独立SHA検証。14m tick11341では元B51形状が大きく画面を覆い、群maskで道路が見える。**これは人間プレイ・ART合格の評価ではない**。
- [K4AN独立レビューコード](scripts/p101-r19a6p4r2f5k4an-original-rgb-review-sheets.py)／[K4AN実Artifact統合専用CI](.github/workflows/p101-r19a6p4r2f5k4an-pinned-real-gpu-to-art-review.yml)／[日本語契約](docs/R19_A6P4_R2F5K4AN_REAL_ART_FIRST_SOURCE_RGB_ATLAS_JA.md)を隔離研究ブランチへ保存。[Actions #41572736850](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41572736850)は作成直後queued。K4ANは本物の元K4AJ ZIPをSHA pinし、K4AK→K4ALを実Artifactで走らせ、元RGB比較2枚とレビューJSONを研究ブランチ `docs/research-evidence/k4an/` へ直接保存する設定。**CIの実成功とGitHub画像保存を確認するまではHOLD**。
- K4AK #41568787273、K4AM #41571299893は前照会ではqueued。次回は三つのrunとArtifactを実照会する。K4AJ成功をK4AM成功に横滑りさせない。
- 今後はGPU測定の反復ではなく、原画で見えるB51と公共空洞の関係を踏まえて未制作Road5《斜裂公共峡谷》の**本物のART-FIRST単一候補**を独立研究。候補の元source同poseカメラA/B・三層公共空洞・人間走行を審査するまで、ART正式0件／Slope2 DNA0m／HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。main・元source/Camera/240Hz球/B48×7/B51×28・本番URL・Draft PR#46不変更。Work事前承認。

## 2026-11-03 K4AO — 真正元RGBの対話式レビューとART-FIRST重点6tick

- [K4AO詳細正本](docs/R19_A6P4_R2F5K4AO_REAL_SOURCE_CAMERA_ART_REVIEW_JA.md)、[再現用Python](scripts/p101-r19a6p4r2f5k4ao-source-only-offline-art-review.py)、[K4AK要求15tickの実測ピン留めJSON](docs/research-evidence/k4ao/K4AO_TRUE_GPU_DEPTH_15_ART_CAMERA_REVIEW_ANCHORS.json)を隔離研究ブランチに保存。K4AJ真ZIP ID 13201661563／SHA-256 `60aab331d8881b5f8f456539c00566837a2b061a96ab0725ce7c17ea91ed8efb` から本物の8元source RGBとB51全28体群mask RGBを比較する完全オフラインHTMLをローカル生成、真PNG SHA/元復元GPU11,176点/100-case CSV突合・JS構文検証PASS。**元B51描画除去は研究用比較のみで元ゲームを改変しない**。
- 重点真正カメラtick：14m **11338（93.951%）／11341（100%）／11349（47.423%）**、28m **11277（57.230%）／11280（53.436%）／11284（37.938%）**。数値は11,176点の**B51群GPU深度サンプル変化**であり肉眼の遮蔽率ではない。実元RGBは要求15中6tick、残り9はK4AM真CI実測待ち。K4AOの新モデル0、ART正式採用0件、Slope2 DNA0m、HUMAN/SAT/CCD/FPS/RELEASE/MERGE HOLD。
- 次はK4AK #41568787273、K4AM #41571299893、K4AN #41572736850を実照合。CI未完了を成功とせず、K4ANの本物の審査アトラス＋K4AM不足9tick真正RGBを収束させた後、Road5《斜裂公共峡谷》の**一候補の真正同源Camera RGB A/B**を初めて制作・ART審査する。旧K4/K4R/K4U ART REJECTを再採用せず、main／原source／Camera／球240Hz／B48×7／B51×28／本番／PR#46を変更しない。Work事前承認。
