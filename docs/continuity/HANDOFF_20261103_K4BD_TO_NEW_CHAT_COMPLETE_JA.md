# DOPAGAKI SLOPE — 2026-11-03 K4BD→新チャット 完全統合開発引き継ぎ正本

**対象リポジトリ**：`ryomashibaba/dopagaki-development-hub`  
**現行研究ブランチ**：`research/k4bd-source-road5-civic-deck-material-architecture-20261103`  
**直前の成功した大型研究工程**：K4BC v3、HEAD `6b06a76e6a467e0533b2ae49c7f01201e80a7474`。  
**本書の優先順位**：最新の研究ブランチ `START_HERE.md` と本書を第一に、そこからリンクするK4BD正本、K4BC正本、さらにK4BB/K4BA/K4AZ/K4AY過去正本を読む。旧文書に書かれた「最新」より新しい実行結果と本書を優先。正本と矛盾する過去の一時的な計画を、採用済みとはみなさない。

> **絶対に変更してはいけない判断**：ゲームとしての元Slope再現と240Hz物理・安全性は保護し、**美術品質が世界的競争水準に達するまでは正式ART採用0件、Slope2 DNA認定0m、ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD**。SOURCE技術SUCCESS・CI green・Blender成果をART PASSや真正WebGL2ゲームの安全性に読み替えない。

## 1. 作品の位置づけ・ユーザーの本質的な要望

DOPAGAKI SLOPE — HYPER RUSH。原作Slope系の高速重力走行、カメラ、速度感、物理、空間・障害物設計を尊重しながら、**世界水準の視覚品質を持つ高密度・スケール感のある都市と道路のゲームに発展**させる。単なる技術デモ、色付き床、孤立したSF風の箱/柱/アーチの集合では認められない。

ユーザーからの厳しい過去評価は次のとおり。「都市に見えない／公共空間に見えない／ただの造形物／高速カメラで意味が読めない」という問題を超えて、**『画面に見えるもののすべてが雑な色塗りと雑な配色、空白が多く、デザインとして評価できる部分が一つもない』**との評価があった。したがって**安易な配色変更、PBR画像1枚追加、建築の形をしたプリミティブ多数、浮いた大きな屋根、棒と細いリングの量産は解決ではない**。原source Cameraに映る道路、前景、空間の接続、背景、建物の内部用途、人間的なスケール、構造的な説得力を一体で作る。

**美術が大幅に変わらない間は、正式な公開、元ゲーム本体への勝手な統合、ART認定、Slope2 DNA認定をしない。** K4BDでもART REJECTである。

## 2. 元ゲーム技術仕様・不変の安全契約

- 技術基盤：WebGL2、**240Hz**、本物の球半径**0.65m**、元B48 sourceの**道路7本**、元B51の**移動障害物28基**。source元物理の本番コード、プレイヤー操作、サウンド、元のCamera、危険表示、元の安全警告、走行経路、CCD、FPS条件、成功/失敗条件は保護。
- 凍結する元WebGL2 source原本：`web/p101-w9c2-g4e7ci-integrated-streetscape.mjs`、**Git blob `af076d67492a677d2235e4730aef8cdf4808e106`**。ファイル自体の編集は禁止。まず毎回 `git hash-object` と比較する。
- 元source 7道路は `generateP101W9C1AbyssCandidate(mode)` と原 `tessellate()` のread-only出力に基づき、control/ultraの**14物理形状参照**として扱う。順は `p93-ABYSS_DIVE-01`、`p93-CROWN_REVERSAL-01`、`p93-SCISSOR_RISE-01`、`p93-LOWER_REVERSAL-01`、`p93-VOID_SURGE-01`、`p93-PRISM_CREST-01`、`p93-FINISH_RIDGE-01`。Road5はindex5、**4,728元三角形**、points SHA-256 `5eb731e25bc9eb1a3cf1080e7b239f5e2e8043bfbc80e5d37e0b069a5a08a730`。
- 元Camera数値固定：control tick **11259／11278／11307**、ultra tick **11320／11341／11369**。対応元source時刻のB51 28体物理collision OBBは**6×28＝168件**。カメラのアングル、撮影位置、sourceデータを「美術を良く見せるため」に変更しない。別アーティストカメラは厳格に**非ゲームの参考視点**と明記。
- 参照基準の既知値：初速約**52m/s**、既存最高速度**206.28m/s**、全長約**7,280m**、過去基準のスクリプト完走**51.992秒**。これらは以前の基準で、現行本番に実変更したものとは主張しない。原作忠実度と速度体験を犠牲にしたアート優先も禁止。
- 正式制作/本番や認定の行動は**全てゲート通過までHOLD**。元ゲームの物理に直接書き込む、架空の道路を埋める、元の安全塗装を美術材質で無断置換、可視美術meshを原source B48の代わりのcolliderとして足すことを禁止。
- 独立BVHの「元三角形の静的表面交差0件」は、**球半径0.65mを含む距離clearance・連続CCD・全時刻B51動作・原WebGL2での人間操作・安全性を保証しない**。これは今後も必ず正確に説明する。

## 3. 開発運用・原本保護・ユーザーへの配慮

- リポジトリ：`https://github.com/ryomashibaba/dopagaki-development-hub`。
- **main変更禁止**、公式継続ブランチ `p101-velocity-overdrive-native-trial` 不変更、本番固定URL `https://dopagaki-slope.sora-110029.chatgpt.site/` 不変更、原作固定URL `https://slope-neon-ryoma.sora-110029.chatgpt.site/` 不変更。
- **Draft PR #46** は現在OPEN／DRAFT／未マージ。勝手にmainへマージ、PRをReady for reviewに変更、本番公開、元ゲーム統合しない。
- 研究は隔離ブランチで実施。作業を始める前にGitHub `START_HERE.md`、完全引き継ぎ正本、最新HEAD、PR/CIを照合。過去の決定事項を毎回再討議しない。
- **計画書を作るだけでは不十分。** 可能な範囲で実コード・編集可能Blender・source SHA・source Camera画像・独立検査・GitHub保存まで進める。
- **Chat＋GitHub中心、Work使用は必ずユーザーの事前承認**。ユーザーのWindows PC/ローカル実行・ZIPダウンロード・撮影・手動コピーを原則不要にする。GitHubに画像を直接保存し、URLでユーザーが見られるようにする。ユーザー操作は最小。
- 制作費用/モデル利用枠に配慮し、高額推論・大量レンダリングを使う前に小規模な元Camera**パイロットで美術が実際に成立するか判定**する。低品質を安く量産することも、改善なしに高コスト技術を延々使うことも避ける。
- 複数の並行プロジェクト全体ではMinecraftAIBuilderとBrowser Ink TPSが同格の最優先で、DOPAGAKI単独のために勝手に他の優先度を覆さない。

## 4. K4AY → K4BCまでの歴史的な実績と反省

| 工程 | 事実として達成したこと | 厳しい美術判断 |
|---|---|---|
| **K4AY** | 本物Road5 B48 4,728三角形・source Camera6時点・B51 6tick×28 collision OBBのBlender原本/GLBを確立。元Road5 source points SHA照合。元コースは絶対保護。 | 左右施設が孤立、道路が巨大な空白。ART REJECT。 |
| **K4AZ** | 道路材・左右の公共造形・跨道建築をDCC再制作、静的限定source BVH。 | 細い構造、空中アーチ、単調な道路の占有が改善せずART REJECT。 |
| **K4BA** | 真のRoad5曲面とsource Cameraを保った一体型の公共建築/段丘を試作。 | まだ薄い屋根、浮いた施設、街の実体性不足、ART REJECT。 |
| **K4BB** | 2K PBR3種と4用途の公共室をeditable Blender作成。CI [#41631593534](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41631593534) SUCCESS、独立新K4BB建築の静的BVH [#41631656710](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41631656710) SUCCESS。 | 全黒粗さ/高さPNGのバグを直したが、公共室は高速Cameraから読み取れず、屋根/棒の模型に見える。ART REJECT。 |
| **K4BC v1** | 左右の大きな実地形/吹抜けの市民施設。Blender制作CI [#41636914845](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41636914845) SUCCESS。 | 正面に大空白が残る。ART REJECT。 |
| **K4BC v2** | **従来Blender参照がRoad5だけ**という重要な見落としを発見。元source generator/tessellateから本物の**全7道路×2 mode、14メッシュ66,192三角形**を復元。制作 [#41638891877](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41638891877) SUCCESS／全7道路静的BVH [#41639263986](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41639263986) SUCCESS。 | 道路6は存在するが、元Road5の上り勾配と元Camera視線でほぼ隠れ、正面空白の主要問題は消えなかった。ART REJECT。 |
| **K4BC v3** | 真のRoad6幅と元Camera方向を数値確認し、上空の広い公共施設を正面に再配置。Blender編集可能原本＋6Camera [#41640544530](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41640544530) SUCCESS。独立全7道路/B51静的BVH [#41642883010](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41642883010) SUCCESS。 | 正面中央に施設が映るようになったが、道路/街区/建物が単調、都市密度と実感不足。ART REJECT。 |

**K4BC v3の独立静的BVHの確定値**：14元B48メッシュ／66,192元三角形＋168 B51時刻別物理OBBと、可視K4BC建築**475オブジェクト／114,064評価面**の静的三角形交差数は**B48 0件／B51 0件**。これを真の全時間安全性やART PASSに読み替えない。確定したK4BC v3 HEAD `6b06a76e6a467e0533b2ae49c7f01201e80a7474`。

## 5. 現行K4BDの実装と最終確認できた範囲

研究枝：`research/k4bd-source-road5-civic-deck-material-architecture-20261103`、K4BC v3から分岐。

**実装済み**：
- `scripts/p101-k4bd-true-source-road5-3k-deck-civic-architecture.py`：Road5原source 91×13格子に沿う**3072×1536 PBR ALBEDO／ROUGHNESS／HEIGHT各1枚**を真PNGとして独立書き出し。元Road5道路の頂点/triangle fingerprintをbefore/after比較し変更なし。石材の14m間隔施工目地、中央玄武岩・外側石材・bronze導水帯、Blender材質ノードを構築。
- sourceをサンプリングする**52枚の非衝突DCC用道路インレイ**、Road5元road外側の**左右の公共テラス各1本**、下方の海水面を新しい編集可能コレクションとして作成。これらは原ゲームのコース/ゲームcollider/安全表示に採用していない。
- B51の紫色の**元衝突検査枠**を美術審査previewでは非表示にするが、元B51 168 source時刻分は.blend内で保持し、`ultra11341`の独立**28体デバッグ画像**を別途生成。元WebGL2の実障害物見た目と混同しない。
- 高負荷の6Camera/高サンプル一括レンダリングは**美術審査の費用対効果が悪い**ため中断し、**control tick11307・ultra tick11341の2元Camera先行**＋独立デバッグ＋航空DCCに修正。source Camera数値は固定、残り4視点は**K4BDでは未描画**。
- **確定制作成功**：[`Actions #41649107682`](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41649107682) completed **SUCCESS**。Artifact `13236967042`、GitHub Actions ZIP SHA-256 `e355620ada882877bb5271407eaf31f52b6568dc18cf30b03560f1c50b307131`。editable `.blend`、GLB、3K3枚、原source2Camera preview、B51debug、artist aerial、旧K4BCとの同pose A/B PNG、源SHA provenance。3K PNGは実ファイルで全黒でないことを確認、元source前後のSHA同一。
- **画像と証拠はGitHub直接保存済み**：[Actions #41650256585](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41650256585) completed **SUCCESS**。[元Camera2視点新旧比較](research-evidence/k4bd/K4BD_PILOT_TWO_SOURCE_CAMERA_AB_ART_REJECT.png)、[control11307](research-evidence/k4bd/K4BD_REAL_CONTROL_11307_CLEAN_DCC_ART_REJECT.png)、[ultra11341](research-evidence/k4bd/K4BD_REAL_ULTRA_11341_CLEAN_DCC_ART_REJECT.png)、[航空DCC](research-evidence/k4bd/K4BD_AUTHOR_AERIAL_DCC_NOT_GAME.png)、[B51衝突原時刻debug](research-evidence/k4bd/K4BD_TRUE_B51_28_BODIES_DEBUG_ULTRA_11341.png)、[3Kアルベド](research-evidence/k4bd/K4BD_3K_TRUE_ROAD5_PBR_ALBEDO_DCC_ONLY.png)、[原source SHA provenance](research-evidence/k4bd/K4BD_3K_PBR_SOURCE_SHA_ART_REJECT_PROVENANCE.json)。
- **実美術の判定**：路面は明るすぎる低密度床から暗い石材の構造がやや読める見た目に改善、B51元物理ワイヤ分離で審査しやすくなった。ただし巨大で暗い単調な道路が主画面を占め、公共建築は相変わらず模型的で、周辺都市の街区密度・人間スケール・素材の説得力が大きく不足。世界的なゲーム美術完成品質には**明らかに未達＝ART REJECT**。決してART PASSと呼ばない。

## 6. 2026-11-03時点のK4BD独立監査の状況

監査スクリプト `research/k4bd/independent_all7_native_B48_B51_offroad_terrace_static.py`、workflow `.github/workflows/p101-k4bd-all7-native-road-static-bvh.yml`。

- 元all7 B48道路14メッシュの実source三角形と、B51元6tick 28体=168 source collision OBBを**描画Blender由来ではなく独立source JSONから再構築**。対象はK4BC現行可視建築＋K4BD新路外テラス等。元路面に密着する52枚の**非衝突PBR inlay**と遠方の**非衝突海面**は対象から除外することを明記。
- [初期監査 #41650118941](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41650118941) は**FAIL**。Blender 4.0が長いコレクション名を63バイトで切り詰め、スクリプト内`bpy.data.collections.get(fullname)`が見つからず、`assert k4bd_inlay and len(...objects)==52`で停止した。**幾何交差を計算して0件になったのではない**。先にあった旧監査 #41647360346 も元アート親CIの失敗をfail-closedして停止。
- **修正コード commit `da284af7645cfe0528d2d396652767216e78d68f`**：意図の判る安定接頭辞 `K4BD 01 |`、`K4BD 03 |`で候補を取得し、一意性・52/1オブジェクト数を厳格に検査。条件を緩めず、単なるBlender IDの長さ制限を解消。
- **修正後Actions #41653236842**：本書の作成中は実行中。**結果を確認するまでK4BD BVHをSUCCESS/接触0件と断言しないこと**。1件以上の本物road/B51交差を発見した場合は対象名・源道路/時刻ID・交差数を正直に記録し、美術候補を安全ゲートでHOLDする。BVH0件でも本物CCD/safetyはHOLD。

## 7. 失敗・反省と再発防止の義務

1. **偽の完成感**：「sourceが正しい」「テストが緑」「画像が出来た」は**完成した美術**を意味しない。毎回実source Camera画像を実際に開き、「元ゲームを遊ぶ人が見える全画面」の品質で判定。
2. **路面が画面の大半**：建築を路外に量産しても、Cameraではほぼ画面に入らずARTが改善しない。先にカメラ眼球・方向・FoVとRoad5上り勾配・元Road6実位置から**フレーミングを計算**する。
3. **源道路の見落とし**：K4AY〜K4BC v1は真Road5だけのsource reference sceneだった。以後必ず元generator/tessellateからの**全7道路control/ultra**と照合。Road6が見えないために**勝手に走れる偽Road6を造形しない**。
4. **薄いアーチ/浮いた屋根/棒の量産は都市ではない**。建築の支持/壁厚/断面/実開口/動線/使い道/地面との結合が物理的・視覚的に説明できること。模型的な美術は採用禁止。
5. **内部用途の不鮮明さ**：K4BBの4用途施設も高速Cameraではまったく読み取れない。実人間視点と高速Cameraの両方で機能と大きな構造の物語を読ませる。微小小物を増やすだけで解決を装わない。
6. **全黒PBR**：K4BB初版のBlender保存ではNon-Color設定の粗さ/高さが全画素0になった。3K路面では**numpy→直接PNG書出し→Blender画像pack**とし、独立PIL RGB分散・ファイルSHAを検査。assertionを下げて通さない。
7. **描画環境の誤認**：K4BD初回 [#41646724681](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41646724681) はUbuntu GitHub Actionsの`libEGL.so.1`欠落でヘッドレスEeveeがexit134。Eevee画像は存在しない。CPU Cyclesのパイロットに移行。Ubuntu Blender 4.0のOpenImageDenoiser未実装も過去の失敗要因なので、対応確認なしで有効化しない。
8. **制作コスト最適化**：56samplesの元Camera2視点pilotを先に。無条件に6×112samples＋追加ビューの長時間をかけると、明らかにART REJECTな案の検証費が高すぎる。パイロット不合格なら**残り4枚を作る必要はない**。
9. **レポート/CI契約不一致**：Blenderで確かめた事実と最終CIのフラグ名が不整合ならCIが失敗する。原因を正しく切り分け、成功に偽装せず実コードとレポートschemaを修正する。静的BVHが0でもCCD0と書かない。
10. **Blenderコレクション名の上限**：63バイトを超える名前での厳密getは危険。識別しやすい短い名前または一意prefixを使い、数とスコープをassert。
11. **元source物理デバッグ見た目の混同**：紫のB51ワイヤはsource原ゲームの実visible障害物画像ではない。元時刻物理debugと純美術DCC画像を別保存し、元ゲーム画面だと誤表示しない。
12. **修正前の失敗証拠を失わない**：初期失敗は未採用のhistory、最終採用なし。成功CIと失敗CIのrunID/原因/日付・依存source SHAを両方残す。
13. **GitHubを唯一の永続正本へ**：別チャット移動では前チャットのローカルsandboxパスは失効し得る。Github研究ブランチの実画像・原本生成器・CI・正式文書を信頼し、架空のダウンロードURLや存在しないファイルを案内しない。

## 8. 次のチャットで先に行う作業（決定済み）

1. GitHubの**最新**研究枝 `research/k4bd-source-road5-civic-deck-material-architecture-20261103` を現在のHEADで取得し、ルート `START_HERE.md`→**本書**→K4BD正本→K4BC v3正本を実際に読む。固定憲章とこれまでのユーザー拒否理由をすべて継承。
2. Draft PR #46がOPEN/DRAFT/UNMERGEDであること、main・本番・公式開発枝を触らないこと、凍結blob `af076...` が一致することを確認。
3. 最新の **K4BD全7道路独立BVH Actions #41653236842** と最新ログを調べる。まだ未完成・FAILなら理由を正確に特定して**安全な小修正→本当のCI成功まで検証**。もしsource physical road/B51と接触したら合格扱いせず保持。**ユーザーへローカル操作を要求しない**。
4. K4BDの元source Camera2枚＋航空＋3K atlasのGitHub永続画像を**実際に開き**、K4BC v3と比較する。路面の大半は単調、モデル建築の造形が雑、どこにも使い道・高密度都市が感じられないなら**ART REJECTは維持**。
5. ここから先は**K4BE候補**。色替えや造形物の数だけ増やすことは禁止。Road5の実視界、公共空間の地盤・大断面、元Cameraから見た都市の全画面密度/個別素材/設計意図、人が使える建物の空間構成を**Art-first DCC-native**で再設計。独立のartist aerialはあくまで補助、元control/ultra高速source-cameraの印象を最優先。
6. 高負荷制作は**2元Camera pilot → 厳格ARTレビュー → 合格見込みがあるときだけ全6source Camera検査 → 別の全7道路/B51限定静的監査 → GitHub image/manifest永久保存**。正式ART合格なしに元ゲームWebGL2統合・本番公開・PRマージはしない。
7. 新規の成果はコード、編集可能 `.blend`、GLB、PNG、SHA provenance、独立BVH結果、ユーザーに見えるGitHub画像、`START_HERE.md`更新に残す。**報告だけで終えず実作業**し、その範囲を正直に区別。

## 9. 成功の基準と技術とARTの分離

**SOURCE技術成功**：元Road5 original points/triangles SHA不変、元全7 road source ID/geometry照合、元6Camera eye数値照合、B51 source collision OBB168の保護、editable scene+images+SHAが存在すること。

**限定静的BVH成功**：独立sourceの全7道路×2モード14メッシュ・66,192三角形と、元B51六時刻168 OBBと、監査対象に含めた新たなoffroad実建築の**三角形表面交差0**。路面スキン52枚/深海は非colliding visual-artであることを明示。この結果は**連続CCD / 球半径0.65m clearance / 実ゲームFPS / 元の全時間の障害物安全/人間操作**とは別。

**ART成功**：真の高速Cameraで意味が伝わる世界的なゲーム美術。大面積の道が意図的・機能的で、都市の建築/地形/公共空間/周辺街区が実際に成立していること。単色の道、細棒、SFオブジェクトの羅列、安直なカラーグレーディング、無関係な空白・グリッド、実体を持たない「都市」は不採用。**現状ART成功は0件**。

**正式出荷**：ART・HUMAN・SAT・CCD・FPS・安全などすべてのゲートが改めて実証/承認されるまで禁止。

## 10. 再開するための最短指示

> DOPAGAKI SLOPE — HYPER RUSHを、GitHub `ryomashibaba/dopagaki-development-hub` の最新K4BD研究枝`research/k4bd-source-road5-civic-deck-material-architecture-20261103`から完全に引き継いで、作業を再開してください。最初に研究枝の`START_HERE.md`と本書`docs/continuity/HANDOFF_20261103_K4BD_TO_NEW_CHAT_COMPLETE_JA.md`、リンクされたK4BD/K4BC正本と実画像を必ず読み、固定方針を変えないでください。まずActions #41653236842の実行・検証状況を確認し、未成功なら監査を修正・完了させてください。K4BD2CameraパイロットのSOURCE/DCC成功とART REJECT、未描画4視点を混同せず、次に路面・都市の全画面美術改善をART-firstの編集可能Blender原本で実際に進めてください。元B48全7、B51 28、240Hz、半径0.65、元Camera、元source game、main、本番、公式継続枝、Draft PR#46は保護し、Workは必ず事前承認、Chat+GitHub中心・ユーザーPC操作最小化を維持してください。技術検査だけでART PASSにせず、本物のsource Cameraで見栄えを目視評価し、成果をGitHubへ保存してください。

---

*注意：本書の監査Run欄に実行中と書かれたものは、書いた瞬間の状態に過ぎない。再開時は必ず最新API/Actionsで成功・失敗・最新HEADを再確認し、未確認を合格として継承しない。*
