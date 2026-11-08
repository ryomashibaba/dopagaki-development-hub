# DOPAGAKI SLOPE — HYPER RUSH｜R50 完全批判的引き継ぎ正本
**2026-11-08 JST／R49後。これは上位V15の変更ではない。新規企画ではない。**

> この正本の目的は「ゲーム完成につながる実仕事」を促すこと。100%の成功・完璧な計画を保証せず、真正GL／Blender／人間の検証で反証できる運用とする。古い「次R13/25/28/37」は履歴であり最新タスクにしない。

## 1. 継承する憲章と読取順
最初に **[START_HERE](../START_HERE.md) → 本R50正本 → [固定V15](DOPAGAKI_V15_COMPLETE_CRITICAL_INTEGRATED_HANDOFF_AFTER_R36_20261107_JA.md)**。必要な過去箇所だけ [V14](DOPAGAKI_COMPLETE_CRITICAL_HANDOFF_AFTER_R27_V14_20261107_JA.md)→[V13](DOPAGAKI_COMPLETE_CRITICAL_HANDOFF_AFTER_R24_R25_20261107_JA.md)→[V12.1](DOPAGAKI_CANONICAL_CRITICAL_HANDOFF_R12_TO_R13_20261106_JA.md)→[R5以前](DOPAGAKI_COMPLETE_CRITICAL_HANDOFF_AFTER_K4CT_R5_20261106_JA.md)を読む。各段階の証拠は研究JSON・Git履歴に保全。新チャットで全履歴・全CIを毎回再検索しない。

最上位目標は、**人が実際に遊んで面白い、有料インディー級の超高速3Dブラウザゲーム**の完成。大きく独創的なSF/工業世界、プレイする価値のある高速感、自然操舵・失敗→retry、公平なB51危険予告と回避が必要。固定思想 **QUALITY-FIRST / ART-FIRST / DCC-FIRST / INTEGRATED VERTICAL SLICE**。本物Blender3Dと元240Hz物理・元Camera/Chromium WebGL2を切り離さず、元ゲーム画面で美術・機構・走行視認を判断。CI・三角形・RGB差はART/HUMANの代理にならない。

直近の固定縦スライスはRoad5→Road6、真のB51-13→14。近景道路と本物の危険→中景の採水・地形・明確な水位差→実機械と下流水路の空間的因果を、元カメラで時間順に表現する。R47で研究上の「4要素×3時点全表示」を撤回済み：**上位V15は時間的に読めることを求め、全要素の各時点同時表示を必須とはしない**。長期的には全長約7.28kmの約40%（約2.912km）に本質Slope2 DNAを目指すが**現認定0m**。

## 2. 絶対保護／承認
- 研究repo `ryomashibaba/dopagaki-development-hub`、ブランチ `research/k4ct-two-native-b51-choice-consequence-20261105`。本書**作成前**HEAD `0a79306127fbc1cc897babe5f11c79d8e77b8053`。本書コミット後のHEADは新チャットで1回再確認。
- main `d402801f271f43163ad85d9303abe9773d3958bd`、公式P101/[Draft PR #46](https://github.com/ryomashibaba/dopagaki-development-hub/pull/46) OPEN/DRAFT/UNMERGED（head `19d3a32d525c0c2a67082cba646898fab8f2b60f`）。原作Slope、Gold/Freeze、本番2サイト・Pages、正式QA、元Game/正式PRは未承認変更禁止。force-push、PR Ready化、merge・正式採用・公開禁止。
- 元Game Git blob `af076d67492a677d2235e4730aef8cdf4808e106`、元R12A Blender作者blob `096fffbc1627915eb0122224955bb02cfba6b3ae`、元Road5物理点SHA256 `4957a0e1ffb1a394c4bbaa2c502caad3fdec219c9713073f5236d7bbb6ab4e2b`。元Camera、元240Hz、真B48×7/移動B51×28、追加Collider0、保護DCC8群00/12/13/19/34/35/41/42の全XYZ/RGBを守る。
- 実物理・Camera・保護水面19・塔12の無断改変なし。必要性が実証されても**別途個別承認までHOLD**。課金原則0円、追加APIなし、Work/Computer Use事前承認。GitHub Actionsの実請求額は未確認。ユーザー操作は通常0回。
- 直近 [R49成功CI #42437685590](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42437685590)／[Artifact #13600556658](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42437685590/artifacts/13600556658)（SHA256 `2dcbd9448cf6c1a4c84b8599f08869a12d79ce26f42024e449b645fff20fda3d`、期限2026-11-15 02:18 UTC）。**正式ART採用0件／Slope2 DNA0m。HUMAN/SAT/CCD/Windows FPS/RELEASE/MERGEすべてHOLD**。R49のTECH PASSは診断の範囲のみ、ART REJECT、METHOD HOLD。

## 3. R1〜R49：技術成功・不採用の履歴を一つの表に
| 履歴 | 検証された技術 | 決定的な不足 |
| --- | --- | --- |
| 初期〜R12 | 元240Hz・WebGL2、本物のBlender／R9材質橋、同一元カメラのA/B、選択的な安全復元 | 本人の面白さは未認定。材質だけでは品質が上がらない |
| R13〜R25 | 真正Blenderと真CHASE RAWの多くの負例 | 単調岩盤・灰色梁・シアン水面・孤立機械、ART REJECT |
| R26〜R36 | 元GL可視地点、本物R36 DCC31,583三角形と8真正RAW | 灰アーチ・不可視の落水、ART REJECT |
| R37〜R40 | R39 DCC30,904三角形、元GL深度とleave-one-out実測 | R39落水24の元GL影響**0/0/0** |
| R41〜R43 | 保護水面19/塔12の遮蔽、真正カメラの近似解析 | CPUスクリーン面積は実ARTを予言できない |
| R44 | DCC32,004三角形・元GL3真正RAW、落水24影響**215/281/470** | 高低差・受け水・機械が実画面で読めずART REJECT |
| R45〜R47 | 元GL画面で66.35秒の導水23と落水24の影響画素が**13.601px離れる**と実測。過剰な同時表示条件を撤回 | 影響画素距離は物理的距離ではない。ART未解決 |
| R48 | R47時間順構図を元240Hz GLで診断、表示・復元PASS | シアン/白い板＋橙板にしか見えずART不採用 |
| R49 | 立体サイフォン式の研究診断を元GLで1回。受水の描画影響はR48から増加 | 実画面では依然として小さな棚状水帯。機械はさらに小さく、流水/密閉/サイフォン動作も未証明 |

R44初回2回のCIはファイル名・Artifact参照のミスでFAIL。保存済BLEND再利用による回収CI #42384597099で独立PASS。R48 CI #42436272677、R49 #42437685590は元WebGL2本物の画面・安全検証でSUCCESS。ただしARTは否決。履歴を美化しない。

根拠：[R49](../research-evidence/k4ct/K4CT_R49_ORIGINAL_NATIVE_GL_VOLUMETRIC_SIPHON_ART_REJECT_20261108.json)／[R48](../research-evidence/k4ct/K4CT_R48_SOURCE_ORIGINAL_WEBGL2_TEMPORAL_DIAGNOSTIC_NO_GO_20261108.json)／[R47](../research-evidence/k4ct/K4CT_R47_NATIVE_CALIBRATED_TEMPORAL_THREE_ACT_GATE_20261108.json)／[R46](../research-evidence/k4ct/K4CT_R46_ORIGINAL_CAMERA_FACE_ORIENTATION_SCREEN_FEASIBILITY_20261108.json)／[R45](../research-evidence/k4ct/K4CT_R45_NATIVE_SCREEN_TEMPORAL_ART_VETO_20261108.json)／[R44](../research-evidence/k4ct/K4CT_R44_TRUE_BLENDER_THREE_GL_RAW_TECH_PASS_ART_REJECT_20261107.json)。

## 4. 第一段階の批判
1. **技術KPIと美術・面白さの混同**。GL可視画素やポリゴンを増やしても、プレイヤーが「何の施設か」を一瞥できないなら正式ARTは進まない。
2. **同じ形態語彙の反復**。灰アーチ、規則的な柱・板岩、細いシアン水帯、機能不明の輪・管・箱。R48の平板→R49の立体でも空間の意味は改善せず。
3. **元ゲームの高速性と知覚の後回し**。約180〜190m/sでは0.1秒で18〜19m進む。静止RAW3枚・ROI差分だけでは予告認知・世界の一体感・公平性を判定できない。
4. **保護水面19・塔12との実遮蔽**。受水が見えなくなり、薄い帯を足して逃げる悪循環。ただし有限探索で「不可能」を証明したわけではない。無断原本変更不可。
5. **CI・研究番号・文書の増殖**。旧JSON名・PNG保存先/Artifactパスの不一致、CI緑化の再走、長大START。工程数の割に実作品の改善が小さい。
6. **ゲーム性から遠ざかった**。本物のB51-13→14の初見操舵・失敗→retry→回避→継続、人間の面白さ、実機FPSは未認証。TECH資産を捨てるのも誤りだが、分析だけの永久ループも誤り。

## 5. 第二段階の反証と修正
- **「もっと巨大で高精細なBlender/サイフォン」**：R44/R49が否定。**同じ景観族の再制作・色替え・GL差分数競争を停止**する。
- **「さらに何百個の深度候補を解析」**：局所画素探索は実GL/ARTを過大予測。**未解決の因果1問だけを低コスト検査**し、まず空間の意味を設計する。
- **「元Cameraや保護19を動かせば早い」**：権限外。客観的な衝突を証明した場合だけ影響の小さい変更承認案を提案。**承認なく適用しない**。
- **「一切制作せず計画だけ」**：世界は完成しない。R50は小さな実画面のGO/NO-GOを出し、GOなら本物Blender一候補まで進める。
- **「ARTが完成するまでB51は無視」**：最重要ゲーム目標から逸脱。元道/B51予告はART段階から保護し、優れたART候補が現れたらすぐ研究用の失敗→retry→自然回避に結ぶ。
- **「CIを全部省略」**：保護と真正証拠を失う。最低限の同Tick復元と8群全XYZRGB、原本SHAを保つ。**不要なCIだけ減らす**。
- **「新規の完全引継ぎを毎工程作る」**：旧次工程の競合と読取コストを増やす。本書は一度だけ作り、**次回からは短いSTART更新＋必要な実証記録1件**で済ませる。

## 6. 次の一つの本質工程：R50
**スコープ固定**：Road5→Road6 B51-13→14、本物の元Camera・240Hz・元保護8群。上位方針・ゲームを変更しない。

**R50-A／Camera-native ART構図のGO/NO-GO**：既存R49元GL3RAW・R44の真正3D・R38カメラと最新HEADを1回だけ照合。元の道路と赤B51予告・空の抜けを守りながら、**水源の存在→人の目で分かる本物の落差/制御機械→下流の受水**が時間順に因果で伝わる**R49とは空間断面そのものが違う案を1つ**提示・評価する。数値上の可視だけでGOにしない。機械の支持地盤と機能が説明できないもの、薄い水色棚、灰箱/孤立輪は禁止。

**R50-B／限定判断**：具体的な元Cameraの前・中・後の構図、遮蔽する原本群、水の接続、機械の荷重経路、B51との干渉を見積もる。筋が立てばGO。成立が証明できなければ**METHOD HOLD**で止め、有限証拠とボトルネックを記録。新たな似たCI・巨大プロキシを量産しない。無承認Camera・水面・元Game変更なし。

**R50-C／GO時だけの本物3Dと短い真GL批評**：隔離の**編集可能真正Blender**で非反復の岸壁・開口・水位差・機械基礎を一体著作1件→元R9素材橋・元240Hz/Chromium WebGL2の**3〜5真正RAW**＋同Tick復元＋保護8群XYZRGBの独立検査。元Game/Camera/B48×7/B51×28/Collider0維持。元RAWが単調な水帯/灰面・理解不能な機械・危険視界の悪化を示せば**EARLY ART REJECTで即止める**。同候補の色替えやART不採用CI緑化禁止。元作者は変更しない。正常基準blobなら復元不要。

**CI前の軽量1回チェック**：ソース実SHA、旧スクリプト名の混入、JS/Python構文、JSONスキーマ、生成PNGパス・必要な枚数、Artifact保存先、原本保護とGL provenanceを合わせてから走らせる。誤パス修復は原因を束ねて一度だけ。成果はGitHubに最小1記録＋必要なコード、永久Artifactと称さない。

**R50-D／作品完成への次ゲート**：優れた研究ART候補が確認できたら、同じ区間で本物B51の接近→警告→失敗→retry→自然操舵で回避→続行を真正元ゲームで評価。成熟後ユーザーには**URLを一つ開いて1回走る**程度に集約し、初見の爽快さ/フェアさを評価してもらう。本人試走なしにHUMAN PASSとしない。その後はコース全体・Slope2 DNA（現在0m）を伸ばし、正式SAT/CCD/Windows FPS/公開・merge・正式ART採用は独立QA＋個別承認。

## 7. 作業・費用・レポート契約
- ユーザー通常操作0回。GitHubコネクタで直接読む・研究コミット・必要なCI実行を済ませる。PowerShellコピペ・ZIPアップロード・スクショ連投を求めない。Work/Computer Use・追加有料APIは事前承認。GitHub Actions請求額は未知。
- 次の「続けて」は**R50の実質前進**。過去全史検索/長い監査だけを繰り返さず、できる範囲で実証・元RAW・独立評価・研究保存まで一度に実行。
- 成功の定義は「実画像でART因果が改善／B51判断が改善」したこと。CI PASS/コミット/ZIP/文書量ではない。
- 報告は **SOURCE / 作業結果 / 真GL画像の改善・悪化 / TECH / ART / HUMAN / SAFETY / EVIDENCE / NEXT / USER_ACTION / COST** だけ。わからない項目は「不明」。
- 現状のART成功確率、実機FPS、GitHub Actions実費、人間の面白さ、サイフォン流体作動は**不明**。楽観的な捏造をしない。

## 8. 新チャットで最小1回コピペするだけの指示
> DOPAGAKI SLOPE — HYPER RUSH の既存開発を方針変更なしに再開。GitHub `ryomashibaba/dopagaki-development-hub` の研究ブランチ `research/k4ct-two-native-b51-choice-consequence-20261105` で、最新START_HEREと **docs/DOPAGAKI_R50_COMPLETE_CRITICAL_CONTINUITY_AFTER_R49_20261108_JA.md**、固定V15を読み、旧V14/V13/V12の安全条件を継承。研究HEAD/原本保護SHA/main/公式P101/Draft PR#46を一度だけ照合。R49は真正元WebGL2 TECH PASSでもART REJECT、正式ART採用0、Slope2 DNA0m、HUMAN/SAT/CCD/FPS/RELEASE/MERGE HOLD。元Camera/240Hz/道路/B48/B51/8保護群を保護。次R50では同じ水色の棚/灰輪/サイフォンを量産せず、元ゲームカメラに本物の水源・落差・下流・支持機械が時間順に読める**異なる一体空間**を一案だけ検証し、GOのときに限り真正Blender1案→元GL少数RAW→批判的ART→研究保存。成立しなければ根拠付きでMETHOD HOLD。無承認の追加課金・Work/Computer Use・原本変更・公開・mergeは禁止。ユーザー作業を原則0回にして実仕事を進めてください。
