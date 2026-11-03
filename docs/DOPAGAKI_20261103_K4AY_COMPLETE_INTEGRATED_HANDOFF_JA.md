# DOPAGAKI SLOPE — 2026年11月3日・K4AY完全統合引き継ぎ正本

**作成日：2026-11-03 JST。優先順位：この文書の最新判断 ＞ 同ブランチのSTART_HEREの古い進捗記述 ＞ 個々の旧研究報告。** この文書の目的は新しいチャットが方針を再決定せず、最後の実作業から安全に続けられること。ユーザーからの最新の明示評価は「まだコースのビジュアルが酷い」。これは改善の最重要指標であり、技術テスト成功をもって満足したと扱わない。

## 0. ユーザーの希望／あなたの役割

DOPAGAKI SLOPE — HYPER RUSH の実装担当と厳格なアートディレクター・QA担当として、GitHubの最新正本と実コードを確認した後、**実際の制作・テスト・GitHub保存**を進める。単なる計画報告、偽の実画像、結果未確認のSUCCESS宣言、繰返しの軽微な配色変更は禁止。実ゲームの画面全域に世界水準の独創性・完成度を求める。ユーザーが次工程を指示したら、質問を繰り返さず作業可能な範囲を一括実行し、最小限の操作で検証可能な成果を提示する。Chat+GitHub主体、Workは毎回事前承認制。ローカルPC操作、ZIP解凍、手動PowerShell、連続スクショ提出をユーザーに求めない。効率より品質を優先し、不要な高額AI・無用なCI再試行を避ける。

## 1. プロジェクトの不変憲章

- Repository: \`ryomashibaba/dopagaki-development-hub\`。
- 公式継続ブランチ: \`p101-velocity-overdrive-native-trial\`、2026-11-03実照合HEAD \`19d3a32d525c0c2a67082cba646898fab8f2b60f\`。
- Draft PR **#46** は **OPEN / draft / unmerged**。main、公式継続ブランチ、本番、原作再現版への無許可マージ／push／公開は禁止。
- 本番URL: \`https://dopagaki-slope.sora-110029.chatgpt.site/\`。変更禁止のSlope原作忠実再現: \`https://slope-neon-ryoma.sora-110029.chatgpt.site/\`。
- 凍結原本 \`web/p101-w9c2-g4e7ci-integrated-streetscape.mjs\` のGit BLOB SHA-1 = **\`af076d67492a677d2235e4730aef8cdf4808e106\`**。各CIで \`git hash-object\` により確認。これを編集・上書きしない。
- 元の本物の **240Hz物理シミュレーション**（画面FPSと混同禁止）、ボール半径0.65m、B48実コリジョン道路7区間、B51実物理動体28基、球/カメラ/加減速/操作/障害物の当たり判定、P100/W9-X/B5/Gold、従来の成果を保持する。旧実走/B5テスト基準では初速約52m/s、最高約206.28m/s、全長7,280m、スクリプト完走51.992秒。これらを美術のために偽装、衝突を削除、速度を遅くする、静止絵の専用カメラへ差し替えることは禁止。
- 現研究対象はRoad5 \`p93-PRISM_CREST-01\` のHero短区間**だけ**。正式ART採用 **0件**、正式Slope2 DNA認定 **0m**。他6道路への展開禁止。
- ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGEはそれぞれ**HOLD**。unit/GPU/原CameraのSOURCE TECH PASSからART合格を自動推定しない。元B51の視界遮断、原Cameraでのコースの読みやすさは別途評価する。
- 「危険表示を減らせば見やすい」という理由でP100/B5/路端/B51警告を消してはならない。研究用一時マスクはプレイ版への採用根拠にならない。

## 2. 美術面の根本的失敗／固定された反省

過去のK4・K4R・K4U、K4AQ〜K4AVは、実体の薄い箱・反復水平ファサード・巨大斜め梁・単純な灰色路面・ピンク/シアン/オレンジの雑多な蛍光図形・黒い空・未設計遠景・巨大B51機械の遮蔽を引きずり、**ART REJECT**。K4AS/K4AT/K4AU/K4AVの真正WebGL2 A/Bは技術的に成功しても芸術的には失敗。24/12/12/18などの大量画像、11,068個の三角形、変更画素数、GPU成功は「描画できた」だけの証拠。現代の完成度ある都市・走行ゲームには見えない。前案の路面を少し暗くする／細かな粒状ノイズを載せる／箱の数を増やす／空色だけ変える／斜めゲートを別のゲートに置換するといった反復手法は**停止**。

絶対的なART判定は元の**高速走行ゲームカメラで**、路面構造、質感、ライティング、遠近の都市景観、ランドマーク、明確な建築用途、公共空間の内部、人のスケール、画面密度、世界観の統一、危険と進路の視認性を総合審査する。Blender単独の高級感あるスタジオ絵も、真正元Road5/B51/HUDに戻したときに美しくなければ合格しない。

**制作方法の新しい固定方針 = ART-FIRST / DCC-FIRST**。無限のJavaScript自動box生成を禁止し、Blenderで真の曲面の厚み、開口、構造、ベベル、UV/材質ノード、光源、公共建築の奥行き、植栽などが編集可能な**単一の完成度高い3D原本**を先行制作。元Road5の正しい道路/B51時刻別形状の中で構図・クリアランスを評価し、方向性が合格に値する場合のみsource-private WebGL2へ移植する。複雑な背景・たくさんの棟数自体は品質ではない。最初のHeroを正式採用するまで全体へ散布しない。

## 3. 正式証拠と今までの採否

| 研究 | 本物の成果 | GitHub Actions / Artifact | 美術判断 |
|---|---|---|---|
| K4AS | 真正WebGL2 24PNG、Road5の元material表示差 | [#41594250729](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41594250729) / Artifact #13211991425 | ART REJECT |
| K4AT | K4AS vs 立体的「公共峡谷」12PNG。original/native pose同一 | [#41596692908](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41596692908) / #13212149720 | ART REJECT |
| K4AU | 真正元B48路面/B51実動体にGPU面陰影・微細材質を適用、12PNG | [#41598855479](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41598855479) / #13213758069 | ART REJECT |
| K4AV | 青灰／暖色大気＋新市民建築。元Road5 6tick×base/sky-only/fullの18PNG | [#41601799002](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41601799002) / #13214568215 | ART REJECT、元色図形残存 |
| K4AW | **真正WebGL2×2元Camera時点×8原GPU描画mask＝16PNG**、pink/cyanの描画レイヤー別寄与を独立SHA/画素監査 | [#41604593198](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41604593198) / #13216820565 | SOURCE attribution限定PASS／美術未採用 |
| K4AX | **Blender実\`.blend\`・\`.glb\`＋元実Cameraの数値を使用した3 DCC画像＋1 artist-angle画像**、4プレビュー。真のDCC原本を生成 | [#41607194912](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41607194912) / #13216639522 | CI SUCCESS、**ART REJECT/研究HOLD**。原B48/B51を3D Sceneに取り込んでいない |
| K4AY | **研究ブランチを作成しただけ。実B48/B51のBlenderへの取り込みは未実装。** | CIはまだ作っていない | 次の正当な工程、ART HOLD |

K4AV 6原Camera時点: CONTROL tick11259/11278/11307、ULTRA tick11320/11341/11369。元B51が視界をほぼ埋めるULTRA 11341では、「都市を足す前後」の画像差が**0**。障害物を透明化・削除してART合格にすることは禁止。K4AV sky-only vs fullでは5/6時点で建築の画素変化、但し「建築が画面に描画された」としか言えない。

## 4. K4AWで特定された路面の派手な色の原因

原source/native 240Hzを変更せずROAD5のCONROL11259とULTRA11320、2×8=16画像の個別引き算で実測（画面中央road-facing ROI／RGB色閾値）。CONTROL側の結果：

- \`p100RoadRead\`: P100源道路視認描画を研究スクショだけOFFすると明るい**ピンク2,491画素減**。主な発生元の一つ。
- \`p101B5RoadOptic\`: B5源道路演出をOFFで明るい**ピンク1,185画素減**。もう一つの大きな発生元。
- \`lines, flowRoads, approachBeacons, shoulderLights\`: シアン約**617画素減**。
- \`hazardGateMesh / guideMeshes\` 等B51案内: シアン約**430画素減**。
- W9C1: 該当2時点ではdraw callは存在するが可視画像差0。X/Z/C警告もこの2時点draw call無し。A13 decorationはK4AVで既にOFF、そこは原因ではない。
- マスク同士の寄与は重なる。画素減少数を足して100%の因果と見なさず、時間帯による違いも未検証。

このため**P100/B5の色を黙って除去することは原作の危険/進路案内の破壊になりうる**。将来は意味ごとに情報設計を見直し、元ソースの危険性を保持する代替表示を作り、元走行・HUMAN/SATを検証する。これまでの「A13だけ再着色」のような無駄な修正はしない。

詳細 [K4AW/K4AX正本](R19_A6P4_R2F5K4AW_K4AX_SOURCE_COLORS_AND_BLENDER_ART_FIRST_JA.md) と [K4AW Artifact](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41604593198/artifacts/13216820565)。

## 5. K4AX Blender DCC原本：実績と未解決のアート課題

最新の成功研究枝 \`research/k4ax-road5-editable-blender-civic-exchange-20261103\` HEAD = \`8be964ea841e505f03bbce0a15b0d95785edf400\`。真正originalの6Camera eye/front、ball XYZ、元PNG SHAを [カメラ正本](K4AX_TRUE_SOURCE_ROAD5_CAMERA_REFERENCE_20261103.json) に固定、元WebGL座標\`(x,y,z)\`→Blender\`(x,-z,y)\`。注：**カメラは本物の数値**だが、それだけで道路・動体との3Dクリアランスを検査したことにはならない。

原本生成 [\`scripts/p101-r19a6p4r2f5k4ax-blender-editable-tidal-exchange.py\`](../scripts/p101-r19a6p4r2f5k4ax-blender-editable-tidal-exchange.py)：仮称 **Tidal Exchange Civic Hall**。二重曲率の厚みのあるセラミック公共ホール屋根、真に抜いた中庭/水盤、ガラスを引っ込めた店舗・開口、サテン銅・石材・木・植栽、ベンチ・光源、ねじれた単独の遠景塔をBlenderデータとして生成。数回の実CI失敗（初回Python構文、Ubuntu版BlenderのOpenImageDenoiser非対応、GLB出力依存など）を修正し、最後のCI #41607194912 は完了SUCCESS、実Artifact #13216639522。プロンプトで生成された単なる画像ではなく編集可能\`.blend\`、GLB、3 source-pose DCC画像＋1 artist-angle DCC画像がある。

**実画像審査で品質不足**：現画像では屋根・塔がカメラで切れたり、広い空白/黒い領域があり、建築同士と路面が分断されて見える。部分的な材質の改善だけでは世界水準に遠い。現時点で**正式ART不採用**。DCC専用レンダリングには元Road5の**本物のB48道路サーフェスもB51実動体も入っていなかった**ため、見え方・床支持・危険物との重なり/遮蔽を評価できない。編集可能原本ができたことと完成したことは別。

**誤認禁止**：Blenderの3+1画像は本物のWebGL2ゲーム画面ではない。原物理速度、ゲームHUD、B48実地形、B51実時刻、WebGL2 performance、ユーザーが実際に操作した視認性は未検証。画面を良く見せるためだけの元ゲームに無い架空道路を描いて正式採用してはならない。

## 6. 現在地（ここから再開）

**新しい作業継続ブランチ**：
\`research/k4ay-road5-authentic-b48-blender-context-20261103\`

2026-11-03に実際のGitHubで照合したHEADは \`8be964ea841e505f03bbce0a15b0d95785edf400\`、K4AXと同じ。**K4AYを作成しただけで独自のコード・CI/Artifact・メッシュ取込みはまだ無い**。決して「K4AYがBlender統合PASS」と報告しない。

元source形状を抽出する際の既存実装：
- \`private/reference_only/director/surface.js\` の \`sample(s,u,v)\`、\`frame(s,u,v)\`、\`tessellate(s)\`。原B48曲率・bank・実void longitudinal cellsも含める。既存例 \`scripts/p101-r15q3-export-actual-b48-mesh-and-native-trails.mjs\` は**Road1/2の別研究**なのでRoad5に結果を流用しない。
- \`scripts/p101-w9c1-abyss-narrow.mjs\` の \`generateP101W9C1AbyssCandidate('control'|'ultra')\` が原研究ステージ生成入口（本当にK4AVのoriginal Road5 Cameraと一致するsource stageを使っているか必ず証拠照合）。既存 \`scripts/p101-r19a6p2-real-road-spatial-anchors.mjs\` はRoad0/1だけなのでRoad5の支持根拠にならない。
- \`private/reference_only/director/moving/moving-obstacles.mjs\` の \`movingObstaclePose(descriptor,simulationSeconds)\`。B51 28基の\`center / halfSize / yawRadians / enabled\`をsource originalに従い時刻別出力。単に\`tick/240\`を入れるだけで本当のnative camera time同期と一致するか**検証せずに「時刻厳密」と断言しない**。
- 元original GLSLのCamera eye/front/透視係数は \`docs/K4AX_TRUE_SOURCE_ROAD5_CAMERA_REFERENCE_20261103.json\` の6時点、\`web/drive3d.mjs\` の実描画式に基づく。Blender側のスタジオ専用artist cameraを「original native」と呼ばない。

### 次工程 K4AY：中断地点から実際に進めること

1. **真ソース構造の抽出**：K4AXに存在しないRoad5のB48実メッシュを\`sample/tessellate\`で非改変エクスポート（OBJなど）。source blob/道路IDと7道路28障害物・Road5 original points SHA・top triangle数・voidセル・面法線の証拠マニフェストを保存する。元game sourceの唯一の基準SHAを再検査。ゲームの衝突データ・道路を変更しない。
2. **B51の真の空間代理**：control11259/11278/11307とultra11320/11341/11369に合わせた元B51実物理OBBを28基全件出力。研究用Blenderでは **「元source collision proxy。見た目の元ゲームB51メッシュではない」**と明示し、visual美術評価を欺かない。位置は元native timeと照合。
3. **K4AX .blendの新バージョンを保存**：元実Road5、B51 OBBを別collectionの参照レイヤーとして持ち、既存建築の編集可能形状・材質・4枚のDCC画像も保持。元路面の穴を勝手に埋めない。原Camera6視点とartist viewの**両方**で、道路が真のロード形状として見えるBlenderプレビューを生成。単純な道路代理平面は実路面の代用にしない。
4. **地形/建築の干渉・見通し監査**：B48 source road/B51動体との大きな干渉、原カメラで巨大B51が前景を遮る場面、建築の過密/空白、斜めの巨大梁や繰返しの箱の再発を判定。球と路面のクリアランス、歩ける公共床については実B48/B51データで幾何学検証してからのみ主張。研究proxyの非干渉だけではHUMAN/CCD/FPS PASSにはならない。
5. **DCC ARTを真の3D原本で反復・審査**：構図が安っぽい・単一巨大屋根だけ・外形の印象が弱い・公共内部が読めないならART REJECTとして**原本を大きく再制作**。小さな色替えやbox量産を繰返さない。可能ならBlenderの編集可能ファイル＋GLB＋source camera/A-B原画＋PNG SHAと独立アート審査にまとめる。
6. DCC品質の方向が定まった**後**に限り元private WebGL2へ統合し、元のCamera球/B48/B51/240Hz/HUDと同一条件で真正Chromium WebGL2画像・連続走行・HUMAN/性能/SAT/CCDを別々に審査。正式採用に必要なゲートを下げない。main/PR#46/productionは触らない。

### 停止条件・やってはいけないこと
- 元の凍結source Git blob 不一致、7/28条件の不一致、K4AX Camera/source stage不一致があれば **HOLD**して修正、元データを都合よく作り直さない。
- Blender .blendが保存されてもアートが酷ければ **ART REJECT**、他6道路へ展開しない。
- 実時刻B51を削除・不可視化しての見栄え審査は禁止。研究用のmask画像と本番を区別。
- GitHub Actions成功や素晴らしいスタジオショットを **本物のWebGL2ゲーム画面/安全性証明** と呼ばない。
- 画面に映るもののすべてが雑なままなら、小道具増殖で誤魔化さず建築・材料・大気・都市空間全体のデザインを作り直す。

## 7. 主要なリンク／ファイル

- 入口：\`START_HERE.md\`（このK4AY枝から読む）。
- この文書：\`docs/DOPAGAKI_20261103_K4AY_COMPLETE_INTEGRATED_HANDOFF_JA.md\`。
- K4AW実GPU層監査：\`docs/R19_A6P4_R2F5K4AW_K4AX_SOURCE_COLORS_AND_BLENDER_ART_FIRST_JA.md\`。
- K4AVの不採用・DCC firstへの転換：\`docs/R19_A6P4_R2F5K4AV_FULL_SCREEN_ART_RESET_CHARTER_JA.md\`。
- 元sourceカメラ6時点：\`docs/K4AX_TRUE_SOURCE_ROAD5_CAMERA_REFERENCE_20261103.json\`。
- 最新のDCC生成器：\`scripts/p101-r19a6p4r2f5k4ax-blender-editable-tidal-exchange.py\`。
- 最新DCC成功CI [#41607194912](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41607194912) と[Artifact #13216639522](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41607194912/artifacts/13216639522)。
- K4AW本物の描画層原因CI [#41604593198](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41604593198) と[Artifact #13216820565](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41604593198/artifacts/13216820565)。
- K4AV真正本ゲーム画面CI [#41601799002](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41601799002) と[Artifact #13214568215](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41601799002/artifacts/13214568215)。

## 8. 新しいチャットで最初に行うこと

この文書を先頭から読んで**上位方針として固定**し、GitHubのK4AY最新HEAD、PR#46、main以外の参照枝、最新CIを再照合。K4AXの成功Artifact中身を基準にし、K4AY工程（Road5本物のB48/B51をBlender原本へ取り込む）を**本当にコード実装→テスト→GitHub保存**まで進める。成功報告にアートの質とsource TECHの合否を分け、次にユーザーが手動操作しなければならない状況を極力避ける。Workは事前許可まで使わない。

**最後の確定状態**：K4AW SOURCE GPU layer TECH PASS／K4AX Blender DCC GENERATED（CI SUCCESS）だが美術不採用／K4AYブランチ作成済・実装未着手／formal ART=0／Slope2 certified=0m／main・本番・PR#46・元物理未変更。


---

## 2026-11-03 K4AY 実コード着手記録（必ずActionsで最終判定）

[実装・テスト・保護契約と次作業の技術正本](docs/R19_A6P4_R2F5K4AY_AUTHENTIC_B48_B51_BLENDER_SOURCE_CONTEXT_JA.md)

研究ブランチでB48 Road5の本物の`sample/frame/tessellate`抽出、control/ultra 6tick×B51 28体source collision OBBの時刻別再現、元K4AX `.blend`の別collectionへ非破壊挿入、6元Camera DCC-only画像生成と独立検証を行うコード・専用CIを追加した。**コードのGitHub保存は完了したが、K4AY Actions #41610821799の実成功／Artifactsは現時点では未確定**。確証のない Blender/ART PASS を絶対に書かない。SRC静的テストのPASSとDCC完成、美術品質を区別する。初回K4AY CI run はworkflow対象外の文書追記でキャンセルしない。正式ART=0・Slope2 DNA=0m・ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE HOLD、main・公式継続branch・本番・PR#46・凍結blobは引き続き保護。次はCI実ログ確認と実6DCC画像の厳格な美術評価、必要な抜本造形改修。


---

## 2026-11-03 K4AY 最終監査結果 — 実B48/B51 DCC統合 SOURCE/DCC TECH PASS・ART REJECT

- **最新の成功したK4AY Github Actions**: [#41612254866](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41612254866) **completed / SUCCESS**。全工程（保護source hash、Node独立tests、K4AX正本Artifact SHA、Blender取込み、6元Camera+1artist DCC描画、別名.blend/GLB、生成物ファイルSHA独立検証）がSUCCESS。
- **真正Artifact**: [#13218659517](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41612254866/artifacts/13218659517)、7,304,277 bytes、ZIP SHA256 `c206c8de97a7741d40e19676523e79e9e5e4a1cb3d8ae0b18349336c273cc713`。Blenderの独立した新原本 `K4AY_TIDAL_EXCHANGE_WITH_TRUE_B48_B51_REFERENCE.blend`、参照GLB、6 source Camera PNG、1 artist camera PNG、source data/manifest/provenanceがある。
- 実B48 source Road5は物理surface **index 5、ID `p93-PRISM_CREST-01`**、真 `tessellate()` メッシュ **4,728三角形 (top 2,160)**。control/ultraのRoad5原制御点SHA-256 `5eb731e25bc9eb1a3cf1080e7b239f5e2e8043bfbc80e5d37e0b069a5a08a730` は一致。Road5 longitudinal void cellsなし。7 physical B48 surfacesと28 B51本体を元docから確認、元sourceは読み取り専用。
- Source B51 collision OBB参照は各tick 28体×6tick=**168個**、元Camera ticks control 11259/11278/11307、ultra 11320/11341/11369。元物理 `movingObstaclePose(descriptor,tick/240)` を使用。これらの**衝突OBBはゲームのB51美術メッシュではない**。K4AYでは誤認を避けるためOBBを線枠で表示。元K4AXの**架空・非物理背景地形のみ**をDCCレンダリングから隠してB48実道路を露出、編集可能な原本から削除はしていない。
- **ART REJECT継続**。7枚の実DCCを目視審査したが、走行画面は大部分が淡い単純な道路/空間、左の建物は途切れ・右の塔は孤立、公共機能・人間スケール・街区連続性・空間密度に説得力が不足する。アーティストカメラは構造/屋根形状を示すが、元ゲーム画面の美術合格にはならない。**単なる色替え・道路捏造・JS box建築量産禁止**。次はこの実B48/B51原本に位置合わせした公共空間/ランドスケープ/建築の大胆なBlender-native再設計、元Camera正確な構図とクリアランス検証。
- **不変のHOLD**: 正式ART採用0件、Slope2 DNA認定0m、ART REJECT、HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。Blender画像は元WebGL2ゲーム画像ではない。建築vs真B48/B51の詳細BVH干渉・元ゲームCCD/HUMAN/FPS/安全は**未検証**。main/継続公式branch/本番/Draft PR #46/原source blob・240Hz・球半径0.65m・元Camera/衝突条件の変更なし。Work事前承認のまま。
