# DOPAGAKI SLOPE — 完全統合開発引き継ぎ正本
更新基準：2026年11月3日 11:36 JST。対象は研究ブランチ `research/k4aj-native-b51-gpu-depth-contiguous-window-20261103`。**過去の大量の追記を読む前に、この文書とルート [START_HERE.md](../START_HERE.md) を優先する。**

> **重要な時点依存情報**：この文書のCI状況・HEADは作成時点のスナップショット。次チャットでは必ずGitHub APIで実際の最新値を照会し、未完了のジョブや変更済みHEADについて推測しない。古い「queued」「次工程」「ART HOLD」は時系列記録であり、現在値は実CIの結果が最優先。旧文書の「最新」の見出しよりこの正本の新しい観測を優先するが、数値等の根拠原本は保存したまま尊重する。

## A. 最終目標と不変の世界観・開発の優先順位

**『DOPAGAKI SLOPE — HYPER RUSH』**。Slope原作の中核の疾走感・本物の操作感を妥協せず、約7,280m・約52秒級・200m/s級の真正3D高速走行と、圧倒的に美しい超未来巨大都市・大建築を、**一つの自然な人間プレイ体験**として成立させる。原作の見た目だけ、数字だけ速くする、スクリプトで球をワープ/固定、HUDのみ偽加速する、障害物を無効化する、カメラを勝手に付け替える、といった「見せかけの完成」は禁止。

- 実道路7章・走れるB48物理道路・元のB51動体・球・操作入力・本物の縦横加速度・カーブ/バンク/落下/ジャンプと危険性を尊重する。
- 物理・カメラ・ゲームプレイ・映像美・ユーザーの人間実走・実端末FPSを、それぞれ**別ゲート**で評価する。TECH、SOURCE、モック、スクリプト完走、スクリーンショットの合格を、ART/HUMAN/FPS/RELEASEへ横滑りさせない。
- **ART-FIRST**：大規模な将来都市・巨大な公共空洞・形状の一体感・高い空間可読性を追求。単なる門や箱、薄板、リング/リボンの量産、巨大建築のつもりが視界を塞ぐだけの装飾を不採用。世界的な高い美術水準を優先。技術研究が長引き、造形品質の最終目標を忘れることは禁止。
- 過去の旧K4/K4R/K4Uほか不合格を再採用しない。**正式ART採用0件、Slope2 DNA正式認定0m**（目標2,912mと区別）。旧失敗作品の見た目だけの再着色・規模誇張では通さない。
- 研究中は常にART HOLD。必要なSAT/CCD/HUMAN/実FPS/GAMEPLAY/RELEASE/MERGEが揃うまで公開しない。危険な研究版を本番に流さない。

## B. リポジトリ・版管理・触ってはいけないもの

| 種別 | 正本・ルール |
|---|---|
| GitHub | [ryomashibaba/dopagaki-development-hub](https://github.com/ryomashibaba/dopagaki-development-hub) |
| 本来の継続枝 | `p101-velocity-overdrive-native-trial` |
| 継続Draft | [PR #46](https://github.com/ryomashibaba/dopagaki-development-hub/pull/46)、**OPEN・Draft・未マージ**。11/03確認HEAD `19d3a32d525c0c2a67082cba646898fab8f2b60f` |
| 現在の隔離研究枝 | `research/k4aj-native-b51-gpu-depth-contiguous-window-20261103` |
| この文書作成直前の研究HEAD | `45d1f091f0706e8c94122935938eb119c431c755`。文書追加でHEADは進む。毎回GitHubで再確認 |
| 本番 | https://dopagaki-slope.sora-110029.chatgpt.site/ |
| 原作再現の固定参照 | https://slope-neon-ryoma.sora-110029.chatgpt.site/ |
| GitHub Pages | 開発/検証用プレビュー。本番URLへ自動反映すると決めつけない |
| 研究で凍結したオリジナルsource | `web/p101-w9c2-g4e7ci-integrated-streetscape.mjs` のGit blob SHA-1 **`af076d67492a677d2235e4730aef8cdf4808e106`** |
| 主な固定物理 | 真正240Hz、球半径0.65m、B48道路7区間、現在の凍結元sourceのB51障害物28体、元camera/原描画とcollision不変更 |
| 禁止 | `main`変更、PR#46の無断マージ、ゴールド/P100/W9-X/B5の破壊、本番公開、ART無承認採用、元sourceの再配置/縮小、無断モデル・Collider追加、研究データを本番へ組み込み |

**注意**：歴史的B5/P101初期ドキュメントにあるB51「12体」は、その開発時点の候補説明。現K4A〜AJ凍結sourceの**B51 28体**と混同しない。

### 参考になる実走基準と未解決ゲート

B5基準：7,280m、初速52m/s、実ピーク206.28m/s、スクリプトによる7/7完走51.992秒、動体接触0（その実行条件に限定）。B48物理道路7、B51系障害物、横移動/反転/着地/空中操作を伴う走行品質と、人間/端末実走は別途HOLD。オリジナル物理・カメラ・球を変えずにSOURCE/ART調査中。

## C. 現在の状態：絶対に取り違えない

| 工程 | 現在の根拠と判定 |
|---|---|
| K4Z | 元Chromium 2幅×41=82真正元PNG保存、原source/source-state/画像SHA固定。元画像の基準 |
| K4AB | 真正WebGL2元描画群の元画面RGB寄与、元HUD領域を除いた画素一致。**SOURCE TECH限定PASS**、ART HOLD。元画素差は物理奥行き/安全とは別 |
| K4AC | MockGL状態復元6/6はPASSだが「画面撮影後」のGPU深度は破棄され得ると発覚。**モックを真GPU深度のPASS扱いしない** |
| K4AD / K4AF | 真正original mesh + WebGL2 FBOの**render内**同期GPU depth replayが成立。K4AF真正7tick×2幅×6元draw群=**84 B51等groupマスク**、元深度14・元復元14、K4Z82画像SHA/元3D画素と独立一致。**SOURCE GPU TECH限定PASS** |
| K4AG | B51 28体を1体ずつ視覚除外×2幅=**56真正GPU depth**と独立監査PASS。**47.0秒（tick11280）に限り**`p95-hazard-12`が28mの5,972/11,176（53.4359%）のB51 group GPU遮蔽を説明。14mは53/11,176（0.4742%）、他27体の同時点の単独寄与0。ほかのtickの個体ID原因は**不明** |
| K4AH | 7tick×2幅=14元source B51 piston/ball/camera OBB幾何を同じ描画内で捕捉、元関数の別Node独立再計算、元GPU/画像SHAとの照合PASS。**SOURCE GEOMETRY TECH限定PASS** |
| K4AI | 本物のnative 240Hzの**721連続tick×2幅=1,442**を走らせ、元`viewForPose` / `movingObstaclePose` / `sphereBoxSeparation`を1,442件独立再計算、10改ざん負例、真正GPU14元アンカー一致。**2つの独立GitHub CIでSOURCE GEOMETRY TECH限定PASS** |
| **K4AJ（現在）** | K4AIの最接近区間に絞った99連続native tick＋追加参照1本、計**100元GPU depth/100 B51 BODY群除去mask/100復元**の研究コードと独立監査・CI実装済み。ただし11/03 11:36 JSTのGitHub実照会で **CI #41566784540 はqueued、Artifactなし、SOURCE GPU TECH HOLD**。結果・遮蔽継続tick数は**まだわからない** |
| ART/HUMAN/RELEASE | **ART HOLD／正式採用0件／Slope2 DNA0m／SAT, CCD, HUMAN, FPS, RELEASE, MERGE HOLD** |

### K4AIで計測された2幅の幾何（証明済みだが「GPU遮蔽秒数」ではない）

| 元240Hz幾何 | 14m（ultra） | 28m（control） |
|---|---:|---:|
| `p95-hazard-12` camera-eye→OBB最短符号距離 | **−0.974861m** | **+0.447818m** |
| 最接近時刻 | 47.25417秒／tick11341 | 46.99167秒／tick11278 |
| カメラeyeがOBB内部 | 10tick（11340〜11349） | 0tick |
| カメラeyeがOBB表面1m以内 | 14tick（11338〜11351） | 8tick（11277〜11284） |
| ボール表面→OBB最短距離 | +5.00882m | +3.45585m |
| 原`runner.surface=null`＆非接地 | 0tick | 31tick（今回のK4AJ窓**外**） |

OBB内部へのカメラ侵入や非接地は真正幾何/元Runner状態の記録で、**これだけで物理衝突バグ・安全性・視界の人間的可読性は証明できない**。

### 真実性の要：元画像・GPU・生Artifact

- [K4AF CI #41472149272](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41472149272) SUCCESS／84真正GPU masks／14復元／K4Z82原PNG SHA固定。生 `K4AF_GENUINE_NATIVE_IN_RENDER_DEPTH_REPORT.json` SHA256 `016c28bf4fafa50748d8083496a81a5d66732540c0c3b50e863a7c39cfaddf26`。
- [K4AG CI #41552778225](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41552778225) SUCCESS／56 B51単体GPU masks、元B51 IDへの帰属。Artifact ZIP SHA256 `86f27ab7310835c405932b29049ac180d7e69d0987f19be5059fe15099bcbd61`、68件CRC一致。
- [K4AH CI #41554878800](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41554878800) SUCCESS／14真元画像・camera/OBB。元生 `K4AH_GENUINE_NATIVE_IN_RENDER_DEPTH_REPORT.json` SHA256 `84b4a185fb1c3c37454213b334c3c5db2a8fc6871500dca33d2255ec8a85beb0`。
- [K4AI真正Chromium CI #41560614512](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41560614512) SUCCESS、[別系統・実Artifact固定再監査CI #41561002955](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41561002955) SUCCESS。成功元Artifact #13198040646 ZIP SHA256 `ea03e1b20484e5ad5761670c46ebec986df72216d7dd1d7bed8e03e9b3c8bd2f`、50件CRC一致。真正生 `K4AI_GENUINE_NATIVE_IN_RENDER_DEPTH_REPORT.json` SHA256 `e04c9990ebc2573467e8d95cd3e497a7a6059a9f12384f46507c3c1dfdc0eb60`。
- [**K4AJ現行CI #41566784540**](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41566784540)：**queued / Artifact 0件（11/03 11:36時点）**。旧K4AJ #41562897854, #41565679177等は**cancelled**。これらの結果を「完成」「PASS」と扱わない。

## D. 現在のK4AJ設計と独立ゲート

K4AJの実装：
- `scripts/p101-r19a6p4r2f5k4aj-consecutive-native-gpu-b51.mjs`
- `scripts/p101-r19a6p4r2f5k4aj-independent-consecutive-b51-depth-audit.py`
- `.github/workflows/p101-r19a6p4r2f5k4aj-consecutive-original-gpu-depth.yml`
- [K4AJ詳報](R19_A6P4_R2F5K4AJ_ORIGINAL_NATIVE_B51_GPU_OCCLUSION_WINDOWS_JA.md)、[測定窓の事前監査](R19_A6P4_R2F5K4AJ_NATIVE_WINDOW_SELECTION_PREFLIGHT_JA.md)

実測窓（native 1/240秒単位）：
- 14m ultra：**tick11320〜11369、50連続tick**、47.166667〜47.370833秒。47.254秒のOBB内側10tickを含む。元真正GPUの参照tick11280も**別途1本**追加。
- 28m control：**tick11259〜11307、49連続tick**、46.912500〜47.112500秒。47.0秒の元GPU大遮蔽tick11280を含む。
- 合計99連続tick（2つの**別々の窓**）＋追加参照1本＝**100ケース**。元描画→`B51_BODY`全28体の視覚drawだけ除外→元描画復元、各ケース3真正WebGL2 depth readback、**300 unique seq**。元GPU original 72 draw、群除外44 draw、復元72 draw。各frameの8px格子**11,176のGPU非線形深度サンプル**を独立監査、除去で近い深度が新生しない/元深度が完全復元される/元K4Z PNGのHUD外3D画素不変・K4AF tick11280と一致必須。
- 独立テストは**実際のGPU生配列/tick/集計/seqを改ざんする5負例**を拒否する方式。人工的な数式だけの見かけPASSは禁止。
- **B51全28体groupの寄与≠特定個体`p95-hazard-12`の寄与**。K4AGで個体を特定したのはtick11280だけ。他の98ケースの個体は未測定で**UNKNOWN**。
- ここで求めるのは**GPUサンプル深度にB51 groupが何tick・どの連続区間で影響したか**。これは「人間に何秒間視界が塞がれたか」でも「実ゲーム240fps再生」でもなく、窓外の時間は不明。

## E. 最重要の反省と再発防止

1. **旧チャットを毎回ゼロから読んで長文を貼る運用へ戻さない。** GitHubを唯一の永続正本とし、新チャットは本`START_HERE.md`とこの統合正本を読み、コード/CI/PRの最新版と照合して継続する。長大な`PROJECT_STATE.md`/`DOPAGAKI_RESTART_JA.md`/`docs/DOPAGAKI_LIVE_HANDOFF.md`は履歴を含み、過去の「最新」「HOLD」を現時点の値と混同しない。
2. **CIを自分の連続pushで何度もキャンセルした問題**。K4AJの複数CIを無駄にcancelledにした。根本的な問題が見つかった場合を除き、**まず現在のrunを完走させてログ・Artifactを得る**。文書のみの更新ならworkflowのpaths filterの外にしてCIをキャンセルしない。新たなCIを起こすなら効果と必要性を点検。
3. **Mock/推定の誤認**。K4AC MockGL 6/6成功はGPU本番描画の真実性ではない。スクリーンショット後のdefault framebuffer depthはdiscard/不正となり得た。K4AD以降は元render内で同期、元mesh/vertex shader、GPU draw census、正真正銘のChromium、元Pixel/Artifact/SHA/CRCに基づく。
4. **RGB差・非線形深度・深度グループを意味以上に解釈しない**。元HUD CSSアニメを3D変更として数えない；元3D画素を無条件に許容しない。深度サンプル11,176のうち53.436%変化は「その時点の元GPU depth格子」であり、画面占有率・m距離・人間の認知/ART/危険性ではない。群除外は個体別原因ではない。
5. **sourceの内部状態と表示文字列を混同しない**。内部camera mode `raw` ≠ DOMの`ball-lock-unfiltered-heading`。K4AIで研究ガード不具合を経験。元コードから直接確認する。
6. **runner.surfaceが常にRoad5とは限らない**。K4AIの28m側では途中31tick、`surface=null`・非接地。元sourceの状態を勝手にRoad5として書き換えず、元`doc.surfaces[].id`または合法nullの両方を厳密検証・記録。
7. **JSONフィールド名を推測しない**。`signedEyePointToOBBMeters`と`signedCameraEyePointToOBBMeters`の不一致によって、真データ1,442tickを取得しながら最終監査がFAILした。まず実Artifactのスキーマを読んで修正。元データや許容差を変更して「通す」ことは禁止。
8. **負例は本当に変形した実データで拒否できるか**。元source tick/camera/OBB/seq/PNG/深度を独立照合。合格を与えるために妥協/抑制・合成・推定で穴埋め禁止。
9. **研究の孤立と美術停滞**。元sourceを動かせない研究段階でも最終目的は世界水準の未来都市+Slope2体験。前例K4/K4R/K4U ART REJECTに戻らない。GPU真相を調べたら、**美術が劇的に改善される根拠のある1案**をArt-firstで別研究へ進め、実画面/人間評価ゲートを設ける。技術的な指標がいくら増えても正式ART採用とはしない。
10. **ユーザー負担と運用**。ChatとGitHubで可能なコード編集・CI・保存は担当AIが実行。ユーザーが外出中でもPC操作要求・巨大ZIP手作業・PowerShell要求をデフォルトにしない。**Workはユーザーの事前承認制**で、Chatでできるなら無断起動しない。質を落とすための無意味な分割、計画だけ提示してコードを進めないことを避ける。
11. **同じ失敗を無限に繰り返さない**。最初にsource/ログ/Artifact根本原因を確認し、再現できる否定テストを加え、少数の意味ある修正で再検証。未測定ならUNKNOWN/HOLDと書く。

## F. 次チャットが最初に行うこと（明確な手順）

1. **GitHub接続で**この`START_HERE.md`、この完全統合引き継ぎ、[K4AJ詳報](R19_A6P4_R2F5K4AJ_ORIGINAL_NATIVE_B51_GPU_OCCLUSION_WINDOWS_JA.md)を読む。旧履歴と矛盾したら**実コードと最新GitHub CI/Artifact**を優先。
2. **最新状態を実照合**：研究ブランチHEAD、`p101-velocity-overdrive-native-trial`のPR#46 Draft/未マージ、main・元source SHA、[K4AJ run #41566784540](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41566784540) status/ジョブ別ステップ/Artifact一覧、より新しいrunの有無を確認。
3. K4AJが**SUCCESS**ならArtifactのZIP SHA256/メンバーCRC、JSON/CSVを開いて、元99 contiguous ticks＋追加1基準tick／100 source original/100 B51 mask/100 recover／300 seq・11,176GPU深度／K4AF 11280アンカーを独立再計算。**検証後だけ**GPU sampled-depth影響区間を秒へ換算。K4AJ SOURCE GPU TECH限定PASSまたはHOLDを証拠付き判定し、正本を更新。
4. K4AJが**FAIL**なら最初の失敗ステップの実ログ・Artifactスキーマを読み、物理・Camera・ART閾値を触らず、原因だけ最小修正。再実行前の新しい実測が必要か、既存Artifact固定再監査だけでよいか判断。過去の同じCI連続cancelledを繰り返さない。
5. K4AJが**queued/running**なら成功/失敗を宣言せず、不要なworkflow対象ファイルの連続pushで実行をキャンセルしない。並行でできる非干渉のART-FIRST分析や証拠監査に限り実施。
6. その後、既存のART REJECT例と最新GPU遮蔽証拠を使って**美術改善に直接つながる具体的な候補1案**へ進む。将来のGPU/ART/HUMAN/CCD/SAT/FPS/RELEASEの各ゲートを独立に記載し、最終的な街・高速道路一体の人間プレイ成功に向けて作業する。
7. 実コード/テスト/CI/日本語報告をGitHubの**適切な隔離ブランチ**に保存し、`START_HERE.md`や正本を更新。main・公開サイト・PR#46には無断で反映しない。毎回**実測PASSと未測定HOLD、次の1工程**を明確に報告する。

## G. 正本の参照順（再出発時の読み過ぎを防ぐ）

1. **この枝の [START_HERE.md](../START_HERE.md)**（短い入口）→ **本統合文書**（決定済み不変方針と現在の工程）→ [K4AJ契約](R19_A6P4_R2F5K4AJ_ORIGINAL_NATIVE_B51_GPU_OCCLUSION_WINDOWS_JA.md)（当該実装・監査仕様）。
2. 必要になった時だけ [元事前窓監査](R19_A6P4_R2F5K4AJ_NATIVE_WINDOW_SELECTION_PREFLIGHT_JA.md)・`scripts/p101-r19a6p4r2f5k4aj-*`・workflow定義を読む。
3. 過去の決定/変更の裏づけが必要なとき [DOPAGAKI_RESTART_JA.md](../DOPAGAKI_RESTART_JA.md)、[LIVE HANDOFF](DOPAGAKI_LIVE_HANDOFF.md)、[PROJECT_STATE.md](../PROJECT_STATE.md)・PR #46を参照。これらは**数万字〜数十万字に渡る履歴**で、古い「最新」は今の最新状態を意味しない。最初から全体を再要約する必要はない。

**新チャットの基本命令**：「GitHubの `ryomashibaba/dopagaki-development-hub` の研究ブランチ `research/k4aj-native-b51-gpu-depth-contiguous-window-20261103` の `START_HERE.md` を読み、リンク先の統合正本を継承。CI #41566784540と最新HEAD/PR#46を実確認し、固定方針を守って次の正当な開発工程を**実装・検証・GitHub保存**まで進めて。main・本番公開・Work無断利用は禁止。」

## H. 2026-11-03 K4AL 新工程：RGB真正画像証拠の静的カバレッジを確認

- [K4AL独立報告](R19_A6P4_R2F5K4AL_ORIGINAL_RGB_EVIDENCE_COVERAGE_AND_ART_FIRST_JA.md)／[本体コード](../scripts/p101-r19a6p4r2f5k4al-true-rgb-coverage-audit.py)／[100合成ケースE2Eの5負例テスト](../tests/p101-r19a6p4r2f5k4al-rgb-coverage.test.py)を隔離研究ブランチに保存。本体とテストのGit blobはローカル検証版と一致。
- **静的に裏付けられた不足**：K4AJの真正RGB撮影予定は8時点、K4AK ART-FIRSTレビュー要求15時点、重複6／要求側未撮影9／追加撮影2。100個の元GPU深度比較は100個の元RGB画面画像の取得を意味しない。
- ローカルPython構文・合成100ケースE2E・5改ざん負例はPASS。ただし**真正K4AJ生Artifact・PNGの実SHA監査は未実施／HOLD**。K4AKとK4ALへの実データ入力も未実施。
- 真K4AJ #41566784540とK4AK #41568787273は本記述以前の実照会で `queued`。**現在値は毎回GitHubで再照会**し、実完了までPASSと呼ばない。新K4ALは既存CIをキャンセルしないパスに隔離、新workflowは増やしていない。
- 以後の順番は K4AJ true GPU Artifact ZIP/SHA/CRC・独立生depth audit → K4AK実Artifactレビュー要求 → K4AL RGBのSHAつき画像在庫と不足9時点の確認 → 本物の元カメラA/B・独立ART審査。旧K4/K4R/K4UのART REJECTは変更しない。
- 正式ART採用0件、Slope2 DNA認定0m、候補新モデル0、元240Hz/球/Camera/B48×7/B51×28/source blob固定、HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD、main・原ゲーム・本番・Draft PR#46無変更、Work事前承認。

## I. 2026-11-03 K4AM：欠測9元RGBへの独立真正Chromium回収工程

- K4AJ 100 native GPU masked/recovered casesと、K4AK ART要求15時点のRGBを混同しない。K4ALの真元RGB撮影計画8tick中6tickがK4AK審査要求と重複し、9tick不足。
- [K4AMの新研究コード・専用CI・独立監査](R19_A6P4_R2F5K4AM_NINE_MISSING_ORIGINAL_RGB_TRUE_WEBGL2_JA.md)をGitHubの隔離ブランチに追加。元K4AI生SHA固定、真正元source WebGL2画像とそのB51 BODY全28体群非表示／元復元＝9tick×3 PNG／同期GPU27回、元球・Camera・元native tickの厳密一致。独立Pythonが生GPU整数配列とPNGの実SHAを検証。候補新モデル0。
- [合成9tick E2E＋9改ざん負例](../tests/p101-r19a6p4r2f5k4am-independent-native-rgb-depth.test.py)はテストコードを保存した段階であり、専用CIと生Artifactの結果は必ず実GitHub照会して判断する。新CI concurrencyはK4AJ/K4AKと別、`cancel-in-progress:false`。既存2本の長い待機を新pushでキャンセルしない。
- 真CI完走後も「元source RGBの15/15要求時点が揃うこと」と「候補同一pose RGB・三層公共空洞の人間ART認知・安全」は**別**。K4AJの成果＋K4AMの元画面を機械的に合算して美術品質を宣言しない。
- 旧K4/K4R/K4UはART REJECT、正式採用0件、Slope2 DNA正式認定0m。元source・240Hz物理・球・Camera・B48 7・B51 28・main/元ゲーム/本番/PR#46・Gold/P100/W9-X/B5固定。HUMAN/SAT/CCD/FPS/ART/RELEASE/MERGE全HOLD。

## J. 2026-11-03 K4AJ真正GPU確定とK4AN ART-FIRST実証入口


- **K4AJ GitHub Actions #41566784540 completed/success**。真正Artifact #13201661563、**11,959,523 bytes／ZIP SHA-256 `60aab331d8881b5f8f456539c00566837a2b061a96ab0725ce7c17ea91ed8efb`**、28件CRCすべてPASS。実生GPU 100元／100全B51 group mask／100復元×11,176点、300seq連番・元深度完全復元を別環境で独立再計算。詳細：[K4AJ最終実証](docs/R19_A6P4_R2F5K4AJ_CONFIRMED_100_NATIVE_GPU_DEPTH_ART_HOLD_20261103_JA.md)。
- 元GPU深度格子でB51群の寄与が1点以上の元native tick：**14m 39/50（11320–11350、11362–11369）**、**28m 38/49（11259–11288、11300–11307）**。最大は14m tick11339で11,176/11,176=100%、28m tick11277で6,396/11,176=57.2298%。tick数÷240秒の数値を**人間の視界遮蔽秒数と誤認しない**。個体別原因帰属はK4AGのtick11280だけ。
- 元sourceの実8時点×元/mask/復元PNGを目視・独立SHA検証。14m tick11341では元B51形状が大きく画面を覆い、群maskで道路が見える。**これは人間プレイ・ART合格の評価ではない**。
- [K4AN独立レビューコード](scripts/p101-r19a6p4r2f5k4an-original-rgb-review-sheets.py)／[K4AN実Artifact統合専用CI](.github/workflows/p101-r19a6p4r2f5k4an-pinned-real-gpu-to-art-review.yml)／[日本語契約](docs/R19_A6P4_R2F5K4AN_REAL_ART_FIRST_SOURCE_RGB_ATLAS_JA.md)を隔離研究ブランチへ保存。[Actions #41572736850](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41572736850)は作成直後queued。K4ANは本物の元K4AJ ZIPをSHA pinし、K4AK→K4ALを実Artifactで走らせ、元RGB比較2枚とレビューJSONを研究ブランチ `docs/research-evidence/k4an/` へ直接保存する設定。**CIの実成功とGitHub画像保存を確認するまではHOLD**。
- K4AK #41568787273、K4AM #41571299893は前照会ではqueued。次回は三つのrunとArtifactを実照会する。K4AJ成功をK4AM成功に横滑りさせない。
- 今後はGPU測定の反復ではなく、原画で見えるB51と公共空洞の関係を踏まえて未制作Road5《斜裂公共峡谷》の**本物のART-FIRST単一候補**を独立研究。候補の元source同poseカメラA/B・三層公共空洞・人間走行を審査するまで、ART正式0件／Slope2 DNA0m／HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。main・元source/Camera/240Hz球/B48×7/B51×28・本番URL・Draft PR#46不変更。Work事前承認。

**検証の順序**：GitHub Actions K4AN/K4AK/K4AMの現在状態→K4AN生Artifact→元画像の独立目視とGitHub研究画像保存→K4AM元不足9RGBの独立監査→候補新造形の独立ART/SAFE/HUMANゲート。未測定はUNKNOWN、旧REJECTを勝手に覆さない。

## K. 2026-11-03 K4AO：実元画像8tickの対話比較・ART-FIRST造形優先証拠

- [K4AO独立研究報告](R19_A6P4_R2F5K4AO_REAL_SOURCE_CAMERA_ART_REVIEW_JA.md)と[15実測JSON](research-evidence/k4ao/K4AO_TRUE_GPU_DEPTH_15_ART_CAMERA_REVIEW_ANCHORS.json)、[ZIP固定オフラインビューア生成コード](../scripts/p101-r19a6p4r2f5k4ao-source-only-offline-art-review.py)を保存。元のK4AJ真正成功Artifact ZIP・PNG SHA/bytes・元/mask/復元のGPUサンプルを照合して8時点の元画像とB51全28体群除去画像のスライダー比較HTMLを生成。ローカル実測・構文はPASS。GitHub保存したPythonの専用Actions実行は未検証。
- K4AK審査要求15tickに対し、元K4AJ画像あり6／K4AM不足9／余分な元画像2。高深度変化の造形画面審査優先6tickは14m: 11338/11341/11349、28m: 11277/11280/11284。**GPU group-mask深度格子変化率は人間の遮蔽率・秒数ではない**。元B51個体の原因帰属も11280以外はUNKNOWN。
- 新ART候補0／正式ART採用0／Slope2 DNA正式認定0m／HUMAN・SAT・CCD・FPS・RELEASE・MERGE HOLD。K4AK/K4AM/K4ANは最新CIと生Artifactを別途照会し、成功時にのみART-FIRST Road5《斜裂公共峡谷》の元camera 3層公共空洞A/Bへ進める。元ゲーム・main・本番・PR#46保護、Work事前承認。

## L. 2026-11-03 K4AP 真正GPU横三区分によるART-FIRST二段構成

- [K4AP正本](R19_A6P4_R2F5K4AP_ART_FIRST_TWO_BEAT_TRUE_SOURCE_CAMERA_JA.md)、[原K4AJ真ZIP限定データ再解析コード](../scripts/p101-r19a6p4r2f5k4ap-real-b51-gpu-camera-beats.py)、[全三区分の実測JSON](research-evidence/k4ap/K4AP_REAL_SOURCE_B51_GPU_HORIZONTAL_THIRDS_SUMMARY.json)。K4AJ元ZIP SHA `60aab331d8881b5f8f456539c00566837a2b061a96ab0725ce7c17ea91ed8efb` の本物の元/mask/復元11,176サンプル×99連続tickを独立ローカルで再計算。14m B51 group-depth change 左23.474%・中34.400%・右31.885%、28m 左9.635%・中20.407%・右16.108%。14m tick11339–11347の9tickは**横三区分すべてのサンプルがB51 BODY全群GPU深度マスクで変化**。これは人間視界の100%遮断・秒数とは断定不可。
- 真ART-FIRSTの新しい狭い仮説：同じRoad5一案《斜裂公共峡谷》で、危険通過前に公共空洞への大入口を、元B51危険域を保護した後に中段テラス／奥の都市広場を読ませる**二段の原カメラ構成**。元危険区間の深度遮蔽率を美術可読率として誤用する旧仮説を禁止。K4AOの6高寄与tickは危険視認性保護ゲート。新モデル・コライダー0、旧K4/R/U REJECT、ART正式0、Slope2 DNA0m、HUMAN/SAT/CCD/FPS/RELEASE/MERGE HOLD。
- K4AK専用合成CIは成功。K4AM真正元RGB欠測9時点、K4AN真正K4AJ→K4AK/K4ALアトラスはGitHub CIの実結果を再照会する。SOURCE 240Hzと実動作240fpsは別、遮蔽を見た人間の時間はUNKNOWN。元ゲームとmain/本番/PR#46固定、Work事前承認。
