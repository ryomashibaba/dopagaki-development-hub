# DOPAGAKI SLOPE — HYPER RUSH｜START HERE
**現行：2026-11-06 JST／R14真正Blender・元Chromium TECH PASS／ART REJECT。R14も地形のみ検証済みR12A作者blobへ安全復元。次の制作は露出した反復施設・既存潮汐設備と水路の『主役としての統合』に集中。QUALITY/ART/DCC-FIRST変更なし。**

## まず読む（新チャット最短経路）
1. **唯一の現行戦略正本**：[R12→R13 統合引き継ぎ・全方針と批判監査](docs/DOPAGAKI_CANONICAL_CRITICAL_HANDOFF_R12_TO_R13_20261106_JA.md)
2. **最新研究・安全・否定結果**：[R12全群画素影響度＋R12B不採用・安全復元](research-evidence/k4ct/K4CT_R12_VISIBILITY_AND_ART_REJECTION_SAFE_RESTORE_20261106.json)
3. **最新の追加監査**：[R13真正3D／元ゲーム3 RAWによるART REJECTと正確なR12A選択的復元](research-evidence/k4ct/K4CT_R13_INTEGRATED_NATIVE_ART_REJECT_SAFE_RESTORE_20261106.json)。
4. **新しい真正評価**：[R14の引き算した地形・元CHASE3 RAW、ART REJECT、作者コード選択的復元](research-evidence/k4ct/K4CT_R14_SOURCE_NEGATIVE_SPACE_TRUE_NATIVE_ART_REJECT_SAFE_RESTORE_20261106.json)。
5. 詳細が必要なときだけ：[R5〜R11旧完全統合と歴史](docs/DOPAGAKI_COMPLETE_CRITICAL_HANDOFF_AFTER_K4CT_R5_20261106_JA.md)、[過去の入口全文](docs/archive/START_HERE_SNAPSHOT_PRE_R12_STRATEGY_20261106_JA.md)。既存R2/K4CP統合・原憲章・旧Gold/Freezeは上記正本からたどる。

## 現時点で絶対に取り違えないこと
- GitHub：ryomashibaba/dopagaki-development-hub／研究ブランチ：`research/k4ct-two-native-b51-choice-consequence-20261105`。**HEADは毎回ライブ照合**（本ファイル編集により変化する）。
- 元ゲームSHA1 blob `af076d67492a677d2235e4730aef8cdf4808e106`、研究Road5 SHA256 `4957a0e1ffb1a394c4bbaa2c502caad3fdec219c9713073f5236d7bbb6ab4e2b`、元7 B48・28 B51・240HzとCamera。
- main `d402801f271f43163ad85d9303abe9773d3958bd`、公式P101 `19d3a32d525c0c2a67082cba646898fab8f2b60f`、PR #46 Open/Draft/unmergedは保存前照合。正式GAME/本番/Gold/原作Slope/公式QAの未承認変更禁止。
- R14候補 `77ddb8f2` は[真正CI #42228341992](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42228341992) TECH SUCCESS。R12A比でRGB差率（閾値25）は65.25/66.35/68.05秒が**16.141%／11.137%／9.026%**。崖を減らして空と水面を露出したが、白い反復柱・屋根／低品質斜面が露出し、機能的一体の港湾空間は未達→**ART REJECT／正式ART0**。研究DCCだけR12A Git blob `096fffbc1627915eb0122224955bb02cfba6b3ae`に選択的復元、コミット `1c803fdb`。復元後CI [#42230306036](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42230306036) は **SUCCESS**。真正Blender43群／31,324三角形、元240Hz retryRun完走。R12A先行合格CI #42225408461と65.25／66.35／68.05秒の全RGB画素が**完全一致**。候補・証拠は常設監査JSONに保全。
- R13候補 `f1070a94` はCI #42223432779 TECH SUCCESS、真正元CHASEのRGB差25超24.664%／17.872%／12.638%でも、巨大な暗い壁状地形と左前景混雑を増やし **ART REJECT**。監査 `K4CT_R13_INTEGRATED_NATIVE_ART_REJECT_SAFE_RESTORE_20261106.json` に否定結果を保存。地形作者ソースをR12A検証済みGit blob `096fffbc1627915eb0122224955bb02cfba6b3ae`へ復元したコミットは `325481dc`。復元後CI #42225408461 は **SUCCESS**。真正Blender43群／31,324三角形、元Runnerの失敗→retryRun→完走成立、RAW 65.25/66.35秒は復元前R12AとRGB完全一致、68.05秒はRGB差>25の変化0.154%（CI間描画変動、ART改善とは主張しない）。
- R12Aの42群×3時点可視影響測定は[CI #42215413351](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42215413351) SUCCESS。**岩盤群21/25が上位**。R12B地形の[CI #42217656353](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42217656353)もTECH SUCCESSだがRAWで大きな平面に見え、ART REJECT。**候補不採用で地形だけR12A真正検証済みソースblobへ選択的復元**。
- 正式ART採用0件／Slope2 DNA認定0m、HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。人間初見判断は未実証、元B51実衝突も未実証。R9材質連携は真正TECH PASSだが完全PBRではない。
- 固定優先順位：**QUALITY-FIRST／ART-FIRST／DCC-FIRST／INTEGRATED VERTICAL SLICE**。低品質背景・帯状岩盤・小物・細分化CIの量産は禁止。**次は実際の主役地形・水路・港湾の立体構図を1バッチで真正制作・RAW批評**。
- Chat＋GitHub中心。Work/Computer Use、有料API、公開/merge/正式採用/原物理変更は個別事前承認。ユーザーの通常作業0回を原則とし、必要になれば1回にまとめる。

新チャットでは正本末尾Hの短い開始文を使う。過去の`次R6`などは当時の履歴であり、現行指示より優先しない。
