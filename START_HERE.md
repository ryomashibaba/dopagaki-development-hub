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

## 2026-11-03 K4AP：真GPU画面三区分が覆した「高遮蔽tickで都市を読ませる」仮説

[K4AP ART-FIRST二段構成の報告](docs/R19_A6P4_R2F5K4AP_ART_FIRST_TWO_BEAT_TRUE_SOURCE_CAMERA_JA.md)／[真ZIP読取・127×88深度格子三区分解析器](scripts/p101-r19a6p4r2f5k4ap-real-b51-gpu-camera-beats.py)／[GitHub永続保存された検算サマリー](docs/research-evidence/k4ap/K4AP_REAL_SOURCE_B51_GPU_HORIZONTAL_THIRDS_SUMMARY.json)を研究ブランチへ追加。K4AJ真Artifact #13201661563のSHA固定ZIPをローカル独立再計算：14m 50tickのB51群除去GPU深度格子サンプル変化率は**左23.474%／中34.400%／右31.885%**、28m 49tickでは**左9.635%／中20.407%／右16.108%**（元11,176サンプル・各native tick集計）。14m **tick11339–11347の9連続tickで全三区分の11,176点すべて変化**。逆に14m 11351–11361、28m 11289–11299の各11tickは同group maskの変化検出0。これは**人間の全画面遮蔽、空き地、衝突安全、建築可読性を意味しない**。

**新しい正当なART-FIRST判断**：既決定のRoad5《斜裂公共峡谷》を**危険前の都市峡谷入口／危険後の中段公共テラスと遠方広場**という「二段の視覚構成」で1方向だけ検討し、真正B51の中心危険時点に巨大建築を重ねて都市の見栄えを稼ぐ案はやめる。K4AOの高遮蔽重点tickは**B51可読性を保護する審査点**であり、新都市が同じ画面で読める合格点ではない。真の人間視認時間はUNKNOWN。旧K4/R/U ART REJECT、正式ART0、Slope2 DNA0m、新候補モデル0、HUMAN/SAT/CCD/FPS/RELEASE/MERGE HOLDを厳守。

**次は**K4AM #41571299893の不足9枚真RGB・K4AN #41572736850の実Artレビュー画像をまず照合、成功時だけ真正元Cam同poseのBlender-native一案A/B制作に進む。K4AK #41568787273は合成QA SUCCESS済み。main／本番／PR#46／凍結source／B48 7／B51 28／元物理・カメラ不変更、Workは事前承認。新CIを増やさない。


## 2026-11-03 K4AQ — ART-FIRST画面全体の抜本再設計（新隔離研究ブランチ）
新しいユーザー指摘では、既存の画面は単に「都市でない」のではなく、**画面全体の色彩・素材・造形・ライティング・密度が雑で、評価できる美術がほとんどない**ことが最重要。技術計測の反復を主目的とすることは禁止。今回の **研究ブランチ `research/k4aq-road5-art-direction-rebuild-20261103`** でRoad5《斜裂公共峡谷》の美術制作を実際に開始。詳報：[K4AQ画面美術再設計と実装・真正カメラ審査契約](docs/R19_A6P4_R2F5K4AQ_ROAD5_FULL_SCREEN_ART_DIRECTION_JA.md)。

実装：`web/p101-k4aq-road5-civic-rift-material-art.mjs` に非対称の多層居住・公共都市構造、8素材マテリアル、独立WebGL2法線照明を作成。既存K4AD元sourceを完全隔離複製し、元240Hz／Camera／B48×7／B51×28／元source blobを触らず、真正原カメラ6tick×旧新計12 PNGの取得コードと専用CIを追加。既存K4AM/K4ANは独立runとして保持。新候補の真WebGL2スクリーンショットを実際に見て厳しく審査するまで**ART NOT_TESTED/HOLD、正式ART0件、Slope2 DNA0m、HUMAN/SAT/CCD/FPS/RELEASE/MERGE HOLD**。main・本番・PR #46は変更しない。次は新CI／Artifactsを照合し、真正画像で美術的に改善したか評価する。資料中の旧「最新HEAD」は必ずAPIで再取得すること。


## 2026-11-03 K4AR — 建築が本当に映ったかを空から分離する最新継続入口

**現継続研究ブランチ**：research/k4ar-road5-massing-and-true-mesh-evidence-20261103。今回の引き継ぎ・固定方針・問題点・次工程は [K4AR詳細正本](docs/R19_A6P4_R2F5K4AR_TRUE_CAMERA_THREE_WAY_ARCHITECTURE_PIXEL_GATE_JA.md) を読む。

**決定的な穴**：K4AQの元/新A/BのRGB差は空色変化だけでも成立し、新建築が映っている証明にならない。K4ARに、元source同native tick 6×（original／sky-only／sky+architecture）=18真正WebGL2 PNG・元Camera/B48/B51保護・独立PNG SHA/画素監査を実装。専用Actions #41585003708は作成直後queuedであり、ARTや画素検証はまだPASSではない。

次回はまず旧K4AQ [#41580058193](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41580058193) と新K4AR [#41585003708](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41585003708) の**現在**のstatus/jobs/Artifactを実照合。成功なら本物の18画像を開いて美術を厳しく審査。まだqueued/runningなら無用なworkflow対象pushやCIキャンセルをしない。新しい建築が画面に出ても、箱形11棟と繰返し配色が悪ければART REJECTとして一方向を再設計。単なる画素数や三角形数で認定しない。

K4AN [#41572736850](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41572736850) は2026-11-03にSOURCE RGBレビューCI SUCCESS、旧研究枝に比較PNG保存済み。新美術の実画面とは異なる。PR#46はOPEN/Draft/未マージ。main／本番／元source blob af076d67492a677d2235e4730aef8cdf4808e106／元物理・Camera・B48道路7・B51動体28は変更せず、Work事前承認制を守る。

**未変化判定**：ART正式0件、Slope2 DNA0m、ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。


## 2026-11-03 K4AS — 現在の継続入口（全画面の道路・B51素材美術）

**現在作業を継続する研究枝**：research/k4as-road5-native-screen-material-rescue-20261103。K4ARの真正3群比較を継承した美術改善実装。詳細：[K4AS元画面美術改善正本](docs/R19_A6P4_R2F5K4AS_ROAD5_NATIVE_SCREEN_MATERIAL_RESCUE_JA.md)。

K4AJの真正元Road5画像で確認した画面全体の彩度・単純色面問題に対し、**元のsource 240Hz／Camera／B48×7／B51×28のXYZ・当たり判定は変えず**、Road5元sourceカメラが実際にRoad5を描く場合だけ、研究用B48マット路面、A13元路面装飾の統一パレット、B51赤失敗／黄反発／紫押出しを保持した暗色装甲を描画する。K4AQの天空・建築もそのまま比較可能。元の他6道路／Gold／P100／W9-X／B5とmain／本番／PR#46は無変更。

**新実装**：web/p101-k4as-road5-original-screen-material-system.mjs、private-road5-material-pack、unit tests、24枚の元WebGL2同camera（original／sky-only／city／city+materials）撮影、独立画像SHA／画素監査＋比較シート、独立CI [#41589057566](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41589057566)。

**最新実測値はGitHubで再照合**：作成直後K4AS CIはqueuedで真正新画像0、K4AQ #41580058193はpending、K4AR #41585003708はqueued。K4ARに実コードのレポート出力名不整合があるので、そのCI成功を推定しない。**K4ASも新造形/世界水準のART品質は未検証で正式採用0、Slope2 DNA0m、HUMAN/SAT/CCD/FPS/RELEASE/MERGE HOLD**。ロード素材の色変更を美術合格と混同しない。次は実24PNGの画面審査、問題が残ればロード形状・建物・照明・公共空洞を本物の世界水準へ再設計。

Workは事前許可なしに使用しない。ユーザーのローカル操作不要。旧K4/K4R/K4U ART REJECTを覆さない。


## K4AS修正引き継ぎ（2026-11-03 16:04 JST以降）

**最優先入口**：[K4AS正本の真Artifact解析追記](docs/R19_A6P4_R2F5K4AS_ROAD5_NATIVE_SCREEN_MATERIAL_RESCUE_JA.md)。

K4AQ #41580058193／K4AR #41585003708／K4AS #41589057566は**全てcompleted/failure**。3本の本物のArtifact JSONで、初期化JavaScript **Cannot access 'r19a1OptIn' before initialization** を確認（120s timeoutは二次症状）。旧版の「待機」「成功見込み」を現在値に使わない。これまでの真正新候補PNG取得は0枚、ART正式0件。

K4AS隔離枝のみでK4AQのprivate pack内のr19a1OptIn先読みをlocalhost+明示URL条件直接照合に修正、再度の診断用pageerror fail-fastを追加。専用[修正後Actions #41594250729](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41594250729)は起動直後queued。**CI success／新ART画像や実FPSは未確認**。次担当はそのrunの本当のstatus/jobs/log/Artifactを最優先照合。元K4AQ/AR研究枝を重複実行せず、K4ASの真正元cam 6tick×original/sky/city/material=24画像と独立SHA＋コンタクトシートを取得・目視、未達なら本物の失敗症状を修正。

main・本番・元source blob af076d67492a677d2235e4730aef8cdf4808e106・元Camera/240Hz/B48×7/B51×28・Draft PR#46無変更、Work事前承認、ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。


## 2026-11-03 K4AT — 最新の継続入口：本物の元カメラ画像に基づく造形改善

**継続研究ブランチ**：research/k4at-road5-civic-canyon-sculpted-architecture-20261103。前K4ASの[TRUE native 24画像artifact #13211991425](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41594250729/artifacts/13211991425)の**生RGB全24枚**を独立確認。SOURCE SCREEN MATERIAL TECH限定PASS。しかし視覚的には広い単調な道路・残留多色線・ほぼ黒い空・右側だけの繰返し箱建築・公共奥行きの不足で、K4ASは**ART REJECT**（正式ART採用0）。素材変更だけでは世界水準にならない。

新K4AT一方向は[美術/固定契約](docs/R19_A6P4_R2F5K4AT_TRUE_CAMERA_CIVIC_SCULPTURE_ART_FIRST_JA.md)に従い、Road5の実B48座標に固定した**巨大非対称曲面シェル・抜けのあるアトリウム・奥まった暖色ガラス公共テラス5層・回転テーパー塔2棟**、元曲線バンク路面上の非衝突細分目地を研究制作。旧K4AQの反復箱街区を置換し（重ねない）、元Road5 B48/B51/CAMERA/物理は触らず、元WebGL2画面6時点×K4AS/K4AT=12枚で真評価する。元B51がCameraを塞ぐultra tick11341では建築可視を無理に通さない。

**最初の新CI #41595951481 failure**：形状テスト5件中2件FAIL。voidLongitudinalCellsの全閉鎖路面は、架空の支え床を作る代わりに0描画を合法化して修正。**2本目 #41596237031 failure**：5件中残る1件、9,918 trianglesのうち840成分が非有限。真ログから更に診断し、ねじれた塔のブロンズ継ぎ目の4頂点目でz指定を欠いていた一箇所 `local(f,vb[0]-off,vb[1]-off)` を `local(f,vb[0]-off,vb[1]-off,vb[2])` に修正。関数を独立V8合成スタブで再評価して9,918 triangles / 208,278数値/有限PASS、元doc不変。GitHub真正CIの検証とは別物なので混同しない。

**K4AT更新後専用 [#41596692908](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41596692908)** は最終確認時QUEUED、12真正新RGB/ART判断は未実測。新Runの実Status/jobs/Artifactを必ず確認。次は真正6視点のコンタクトシートを開いて、今回の曲面建築が本当に画面に映り、単純な雑造形を脱したか厳しく評価。届かなければART REJECTのまま設計再検討。元モデルblob af076d67492a677d2235e4730aef8cdf4808e106／240Hz／Camera／B48 7／B51 28／main／本番／Draft PR#46 unchanged、Work事前承認、HUMAN/SAT/CCD/FPS/RELEASE/MERGE HOLD。


## K4AU （2026-11-03）現在の唯一の次工程／引き継ぎ入口

**最新隔離美術研究枝**：research/k4au-road5-genuine-material-lighting-20261103。まず[K4AU正本](docs/R19_A6P4_R2F5K4AU_TRUE_SOURCE_MATERIAL_LIGHTING_ART_REVIEW_JA.md)へ。従前K4AT GitHub [#41596692908](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41596692908) は**完了SUCCESS**、本物12画像+元データSHA監査実成功、Artifact #13212149720を取得。K4ATの元cam画像を直接見た結果、両側斜めの巨大梁・レトロで反復的な立面と、現状ほぼ黒いB51機械箱と色面だけの道路・黒い空・大きな空虚部が目立ち、品質目標には未達のため**ART REJECT**。ART正式採用は0件。

K4AUは街区の量産を一旦やめ、**元の実物B48道路と元B51実動体28の原VBO/姿勢を変えず**、同じ原Camera WebGL2に面法線によるライティング・金属表面ノイズ・石材/アスファルト微細質感・パネル目地・実警告の赤/琥珀/紫を実装する。独立起動 `k4aq=on&k4as=materials&k4at=on&k4au=on` のみ、元ART候補とのnative 6時点×2=12真正source PNGを比較。試験はsource改変拒否／元球/camera/B48/B51検証／実GPUコンパイルと独立PNG画素監査。最初の専用 [CI #41598855479](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41598855479) は作成時QUEUED。**実際の新GPU成功/ART改善は未検証、次担当が最新run/jobs/Artifactを読む**。失敗ならログ原因を最小修正、成功なら本物の12画像を目視して美術の結果を厳しく判定する。

不変：元物理240Hz／0.65m球／実B48七章/B51 28／元カメラ・当たり判定／source blob af076d67492a677d2235e4730aef8cdf4808e106、main・本番・Draft PR #46変更禁止、Work事前承認、正式ART/Slope2 DNA0件、HUMAN/SAT/CCD/FPS/RELEASE/MERGE HOLD。


## K4AU 完了審査と次のART-FIRST出口（2026-11-03 JST）

旧入口のK4AU #41598855479 は**completed/SUCCESS**になった。旧QUEUED記述は履歴であり現在状態ではない。真正Chromium source-native 12PNG+独立SHA監査 [Artifact #13213758069](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41598855479/artifacts/13213758069)。真元カメラ6tickで元B48路面/元B51実28動体を変えず GPU材質陰影効果を実測し、RGB差は 280,890～592,547px/707,400px。**SOURCE SCREEN MATERIAL TECH限定PASS**だが、実画像目視で「路面がやや実材質らしくなった」「B51機械の面陰影が出た」に留まり、大規模に単調な路面、黒空、左右長大梁、繰返しの建築ファサード、巨大B51の視界妨害は残存。**K4AUも正式ART REJECT。正式採用0件、Slope2 DNA0m、全HUMAN/SAT/CCD/FPS/RELEASE/MERGE HOLD。** 正本：[K4AU完成レビューと次工程](docs/R19_A6P4_R2F5K4AU_TRUE_SOURCE_MATERIAL_LIGHTING_ART_REVIEW_JA.md)。

**次の正当な工程**：最終画面の美術レベルを先に変える大改修を別研究枝に一候補だけ制作。暗空の広い背景＋同型直方体ファサード・斜め梁を繰り返すという既往の根本問題へ直接対応。高い意匠を持つ本当に利用される公共空洞・可読な超未来都市・光/大気/遠景・人間スケールの層を構築し、元native 6tickの真画面A/Bで品質を判定。小さい色替え、技術ゲートの追加、単調な箱/輪の増築の繰り返しをしない。元B51の危険シーンを美術だけで隠したり物理を改変したりしない。

研究のGitHubのみ作業。main・本番・Draft PR #46、元source blob af076d67492a677d2235e4730aef8cdf4808e106、元Camera/球/240Hz/B48実7・B51実28不変更。Workはユーザーの事前承認制。ユーザー側ローカル操作不要。


## 2026-11-03 K4AV：コースの根本的に酷いビジュアルを抜本的に直す研究

**最新の継続する隔離研究枝**：research/k4av-road5-full-screen-art-reset-20261103。固定方針・理由・ART受入禁止条件は [K4AV 全画面美術再構築憲章](docs/R19_A6P4_R2F5K4AV_FULL_SCREEN_ART_RESET_CHARTER_JA.md) を読む。

真正K4AU WebGL2画像を再確認すると、元道路全体が平板な雑配色、障害物は巨大箱、超未来都市は同型ファサードの繰返し、黒い空、斜め梁、公共空間の使われ方の不在という**全画面の美術失敗**が残る。過去のK4AS/K4AT/K4AUはTECH限定PASSだが美術**全REJECT**。元Road5のART正式採用0件／Slope2 DNA0m。

**K4AV実装**：道路の実B48を根拠に、巨大ゲートや繰り返しの箱を撤去して別の独立した公共建築都市一案に置換。曲面屋根の公共ホール、5層級のガラス駅・市民回廊/中庭、複数形式の塔、実道路端の物理的に筋の通った低い側面構造。雑多な蛍光三角形の**非衝突**装飾だけを研究用描画から取り除き、元道路・危険・源B51動体・物理は維持。新の青灰→暖色水平線の大気・雲と奥行きを別のWebGL2天空プログラムで生成。元K4AUの実動体/路面材質効果は継続。

**真正3群画面検証**：元K4AU画面／新大気＋旧道路・都市なし／新大気＋新公共都市を、**真の元native Road5 6tick×3=18PNG**で比較。空の色が変わっただけでは新建築が見えた証明にしない。真球・元Camera/B51完全同一性、独立PNG SHA/画素差を検証。ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE HOLD維持。見栄えが悪ければ正式REJECT。

**不変**：凍結source blob af076d67492a677d2235e4730aef8cdf4808e106、240Hz／球半径0.65m／実B48七道路・実B51二十八動体／元カメラ/衝突、main・本番・Draft PR #46変更禁止。Work事前承認。ユーザーに手動ZIP・ローカル実行を要求しない。

今後は前回のように「色が少し変わった」「線が増えた」だけで進展と宣言しない。ゲームの画面全体が世界的なゲームの美術として成立するかを先に評価する。


## 2026-11-03 K4AV の真正画像審査による開発方針転換【これが最新・上位判断】

**重要：K4AVも正式ART REJECT。** 過去にこのSTART_HERE内で「K4AV実装／ART HOLD／CI検証待ち」と書かれていても、いまは最終実測で更新済み。この判断を優先する。

[K4AV詳細ART REJECT/次工程正本](docs/R19_A6P4_R2F5K4AV_FULL_SCREEN_ART_RESET_CHARTER_JA.md) を最初に読む。K4AV [Actions #41601799002](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41601799002) **completed/SUCCESS**、18枚本物の元Road5 source native Camera + independent SHA監査 [Artifact #13214568215](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41601799002/artifacts/13214568215)。source B48 7/B51 28/240Hz/Camera等不変。6フレーム中5フレームは新都市描画のpixel差が9.1〜12.6%、超巨大なB51で完全視界遮断されるultra11341は0%。これらは**技術的に描画された証拠のみ**。

実画像の品質は依然として酷い。空色/斜め梁だけは少し改善したが、コースは巨大な灰色平面にピンク/水色線が残り、都市も繰返しの水平帯箱ファサード。元B51が正面視野を奪う問題も変わらない。ART REJECT・正式ART採用0件・Slope2 DNA認定0m。**K4AS/K4AT/K4AU/K4AVのソースTECH成果をART成果扱いせず、同型のJS自動生成の再発は禁止。**

**新しい継続工程はロードのArt-First/DCC-first立て直し**。元WebGL2/source Cameraで残存する色付き図形の本当の描画レイヤーと安全意味を監査→Blender等の編集可能な立体原本・PBR/UV/ライト/建築内部・地形/都市遠景をRoad5の一つのHero短区間に手を入れてアート先行制作→原Camera代表3構図で厳格ART審査→合格したものだけ実WebGL2移植/元source 240Hz高速走行審査。**道路パレットの微調整・箱の数/三角形数/TECH PASSの増加で見栄え改善と主張する手法を停止**。本番/PR#46/mainや元物理を変更しない。Work事前許可、ユーザーのローカル操作なし。

次の担当は新しい研究ブランチやCIを先に乱発せず、元画面のアート作法と実描画レイヤーを把握して「今までと根本的に違う完成度のHero区間」を最優先に実制作する。原画像上で現代的なプロゲームのアート品質と明確に認められないなら採用しない。


## 2026-11-03 K4AW→K4AX　最新の唯一の継続入口：真の路面塗装発生源→編集可能Blender原本

**過去のK4AV/旧K4AS-K4AUの「描画TECH成功」を美術成功と誤認しない。** ユーザー評価は「まだコースのビジュアルが酷い」。正式ART採用0件・Slope2 DNA正式認定0m。旧不採用を上書きしない。K4AX以降もART-FIRST/DCC-FIRSTへ制作方法を切替え、ただの箱追加・色替え・TECHゲートの積上げは禁止。

### 最新GitHubブランチ
`research/k4ax-road5-editable-blender-civic-exchange-20261103`。最新の[**原因確定資料／Blender工程の統合正本**](docs/R19_A6P4_R2F5K4AW_K4AX_SOURCE_COLORS_AND_BLENDER_ART_FIRST_JA.md)を最優先で読む。元K4AV正本は履歴として維持。

### K4AW：ピンク・シアンが消えなかった理由が本物の元カメラで確定
[Actions #41604593198](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41604593198) completed/SUCCESS、[原Artifact #13216820565](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41604593198/artifacts/13216820565) で**元native Road5真正WebGL2×2時点×8描画群＝16PNG・独立SHA/色閾値監査**が成立。元物理/B48七/B51二十八/元カメラ完全不変。元色面はK4AVで既にOFFのA13ではなく、**P100道路視認マーカー（control明るいピンク−2,491px）とB5道路演出（同−1,185px）から強く出ている**。元道路端表示・B51警告からシアンも生じる。W9C1は元GPU draw呼出1ながら、この2時点の描画画素差0。個別寄与は重なりがあり足し算不可。**P100/B5/路端/B51の安全表示は実ゲームから無断削除不可。** 研究用マスクは安全性が検証されていない非プレイ画面。

### K4AX：3Dオブジェクトを自動box量産する方式を停止し、実Blender原本へ
[元sourceカメラ6時点のSHA固定JSON](docs/K4AX_TRUE_SOURCE_ROAD5_CAMERA_REFERENCE_20261103.json)、`scripts/p101-r19a6p4r2f5k4ax-blender-editable-tidal-exchange.py`、[Blender CI](https://github.com/ryomashibaba/dopagaki-development-hub/actions?query=branch%3Aresearch%2Fk4ax-road5-editable-blender-civic-exchange-20261103)。真Blenderで**単一の研究Hero区間「Tidal Exchange」**（二重曲率の厚いセラミック屋根・開いた市民広場／水盤・入口の奥まったガラス・木製家具・植栽・穏やかな暖色内装／1本の遠景ねじり塔）を編集可能なネイティブ`.blend`と`.glb`として生成、元Camera数値control11259/11278/11307から3枚のDCCプレビューをレンダリングするコードを作成済み。

**注意：DCCの3画像は「元Cameraの数値を利用したBlender独立プレビュー」であって、「元のWebGL2ゲームを描画した正規映像」ではない**。元B48/実B51/元HUD/衝突をスタジオへ統合していないので**源道路・危険物との干渉、安全な公共床、HUMAN/FPS、ARTはまだ何も保証されない**。Blender正本をゲームへ許可なく取り込まない。

初回DCC CIはPython構文でFAIL、改訂RunはUbuntu版BlenderでOpenImageDenoiser未ビルドのためレンダリングFAIL（ただし.editable .blend原本の生成までは到達）。修正では元物理に触れずデノイザ不使用・Cycles 24 samplesで再実行。**成功・真PNG目視・素材品質・クリアランスPASS等は最新CIと実Artifactを現時点で再確認するまで未認定**。

### 次担当の実行順序
最新K4AX GitHub Actionsの**本当の** status/jobs/Artifactを先に再照合。レンダ成功なら真实`.blend`/GLBとDCC PNGを開いて厳しくART審査。酷いならART REJECTしアート原本を本格改修、単なるカラーノイズやBOX増築を繰り返さない。候補が審査に値した時のみ、元B48真正曲面＋B51実動体との空間クリアランスを新たに計測し、source PRIVATE WebGL2へ導入、本当の元ゲーム画面／元240Hz本走行で再審査。P100/B5等の安全な代替表示は別課題として保持。

**絶対禁止**：元source blob `af076d67492a677d2235e4730aef8cdf4808e106`、240Hz物理・球半径0.65m、元Camera・B48 7/B51 28、Gold/P100/W9-X/B5、main、本番、Draft PR#46の変更。Work事前承認、ユーザーにローカルZIP等操作要求禁止。ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD、正式採用0件。
