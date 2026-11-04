# K4CB A3 — 真正Blender港湾導線制作・直接ART審査・独立ZIP監査（2026-11-05 JST）

**判定：A3 SOURCE/DCC/真正描画 TECH PASS、全画面 ART REJECT。正式ART採用0件、Slope2 DNA認定0m。** 研究専用であり、実ゲームWebGL2ではない。人間プレイ、SAT、CCD、FPS、正式採用、公開、mergeはすべてHOLD。

## 出発点・方針

前K4CB A2の真編集可能Blender `.blend` 272,243,520 bytes／SHA256 `5f57d64654ff8df6b6ecd852699432cda50f1afc1af3723779170ccb4cbed5b1`を**実Artifact #13363873298のバイトで厳密検証した上で**入力する。A2は屋根の存在感を技術的に高めたが、右港は孤立金属シェル、左地形は平板、道路が画面の多数を占め、ART REJECT。元のゲームと原Road5を変更せず、A2同CHASEで右の港湾公共用途と岸壁につながる実立体を作者制作する計画を継承した。

隔離枝：[research/k4cb-a3-integrated-quay-arrival-art-20261105](https://github.com/ryomashibaba/dopagaki-development-hub/tree/research/k4cb-a3-integrated-quay-arrival-art-20261105)（A2証拠HEAD `e727f39fc72ea6317f5fd3dd6b983bd1d6f9f74d`から分岐）。A3専用Blenderスクリプト `scripts/p101-k4cb-a3-integrated-quay-arrival-source-locked.py`、専用GitHub Actions `.github/workflows/p101-k4cb-a3-integrated-quay-arrival-native-art.yml`を作成。旧原本は変更せず、新編集可能Blender原本を別名保存。

## 実装したもの（研究DCCのみ）

- A2の既存52m曲面屋根・柱・既存全メッシュを**編集・削除せず**、右港の公共機能を空間的に読ませることを試みた。単一26m級石造ポータル、厚い入口側壁、奥に退いた待合ガラス面、連続する乗船前広場、岸壁へ下がる立体スロープ、不整形の潮間帯岩棚を、**Blender真正メッシュ10個**で生成。
- 研究専用 `DCC_RESEARCH_ONLY=True`、`NOT_GAME_COLLIDER=True`。新規ゲームコライダー0。原作ゲームに書込みなし。材質は作者手続き材質のみであり、写真スキャン・実撮影・WebGL2ゲーム描画だと偽らない。
- 元6 Source Camera、元CHASE研究カメラ、元Road5全頂点面、樹木11本の姿勢、元照明、旧建築の可視性、K4BZ不良重複道路の非表示を固定。研究画面内で道路中央の視認性を侵す形状は**安全検査で停止**。

## 実際のGitHub Actions履歴と反省

- [#41917691456](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41917691456) は独立監査JSONのA2親キーを修正したため自動キャンセル。成功として扱わない。
- [#41917833226](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41917833226) はBlender実投影ガードでFAIL。研究新形状の一部が正規化画面X=0.4599に入り、最低X>0.49の道路視認保護に抵触。図形を削らずにガードを緩める変更はしなかった。
- [#41918198305](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41918198305) は海岸棚を縮小後も乗船スロープ先端のX=0.4622でFAIL。失敗ログから**衝突対象メッシュを独立投影で特定**（海岸棚はX=0.4967）。スロープ長と落差を調整。
- [**#41918497448 — completed/SUCCESS**](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41918497448)。真Blender 4.0.2 EEVEE編集・768×480同CHASEレンダー、原本保存、SHA・6対黒筋比較・研究枝証拠commit・Artifactアップロードまで**全GitHub ActionsステップSUCCESS**。道路視野を守る新10メッシュの実CHASE BBoxはX=0.496672〜0.819957、Y=0.337204〜0.558892（画面正規化座標）。投影BBox面積0.07167はARTスコアでない。

## 真Artifactの独立再ダウンロード・完全照合

[**真正A3 Artifact #13365996340**](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41918497448/artifacts/13365996340) ZIP 122,766,266 bytes、ZIP全体 SHA256 `2935d7c51562a544491027d66a2abf37dcb2ddb26bff85740aae25e47b08624e`。本会話でGitHubから別途ZIP原バイトをダウンロードしてSHA256実測一致、`ZipFile.testzip()` は `None` （全エントリCRC PASS）。

- 真編集可能原本 `K4CB_A3_INTEGRATED_QUAY_ARRIVAL_EDITABLE_NATIVE_ART_HOLD.blend`：272,525,680 bytes、SHA256 `0b581f45de4d4e215515e8dbef9a4038c7f1b9bdb0e1935943c4445529193e6c` **実バイト検算PASS**。
- [真正CHASE 768×480 PNG](research-evidence/k4cb-a3/K4CB_A3_TRUE_SAME_CHASE_INTEGRATED_QUAY_ARRIVAL_NOT_GAME.png)：475,851 bytes、SHA256 `94d349036731ab47ed62677e6e7fdc50f80b9ac96060533bd32ae65d7721b6ae` **検算PASS**。
- [同CHASEのA2対A3比較PNG](research-evidence/k4cb-a3/K4CB_A3_VS_A2_TRUE_SAME_CHASE_QUAY_ARRIVAL_ART_REVIEW_NOT_GAME.png)：440,362 bytes、SHA256 `f2b1cd01b1c848a2710467289af45bcb23296ab4171ea75397af81dcc64a489b` **検算PASS**。
- [監査JSON](research-evidence/k4cb-a3/K4CB_A3_REAL_NATIVE_AUDIT.json)とBlender実ログもArtifact内に存在し、JSONの全ファイルハッシュと一致。PNG A2対A3の右港変化画素4,777は描画差のTECH根拠に限り、ARTスコアではない。K4BZ既知黒筋6対は安定。**この会話では原本を独立した別Blenderで開き直したとまでは主張しない**（本体生成・保存・レンダーはGitHub Actions実機ログの根拠）。

## 真PNGを画像として直接開いたART判定：REJECT

Blenderの**新CHASE PNGとA2/A3同カメラ比較を実際に直接表示し目視評価**。今回の新屋根下ポータル・厚い側壁は画面右でベージュ色の広い壁として見え、港の奥行きや用途・実際の乗船ルートを**かえって隠す**箇所がある。最重要の船着き場、乗船口、内部の人間スケール、階層のつながりは遠景・実画面で読めず、作った3D機能が絵で成立していない。正面道路は巨大な起伏のない灰色面、左は薄い砂岩地形に少数の木だけ、遠景の生活感とスピード感不足。世界水準のレーシング美術とは認められない。**ART REJECT／正式採用0件／Slope2 DNA0m**を維持。CI PASS、3Dメッシュ数、4,777画素差は美術採用の根拠にならない。

## 次の一貫した方針（再び無数の小工程化しない）

- **モデル・壁・柱・屋根を増殖するのを停止する**。写真材質の小手先変更も主経路にしない。まず本物のCHASEで見える「レース道路対左岩肌対右港対水平線」の全画面構図の破綻に集中。視認されない内部建築を数だけ増やしても、世界水準にはならない。
- 技術的に作れるからといってA3を正式採用しない。研究原本を保持し、次の作者品質工程では右港が一枚絵で読めるよう、見える床・岸壁・水面・自然地形と建築の関係を**根本的に再設計**する。世界スケールと視野の質を中心にし、元Camera・元Road5を変更しない。次の真正Blender比較前にART PASSを主張しない。
- 人間プレイHOLD、SAT/CCD/FPS/HUMAN/RELEASE/MERGEは個別に継続HOLD。正式ロードへの組込・他6 Road量産・本番反映を行わない。追加有料API0円、Work/Computer Useは個別事前承認、ユーザーWindows操作不要。

## 保護の正本

原Game git blob `af076d67492a677d2235e4730aef8cdf4808e106`、元Road5頂点面 SHA256 `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`。B48本物7 Road／B51本物28 Mover／240Hz／球半径0.65m／元6 Camera＋CHASE／既存木11本と照明、不変。main、公式`p101-velocity-overdrive-native-trial`、Draft PR #46、元のSlope原本、本番2サイト、凍結P101／W7F Goldを変更しない。ART正式採用0件／Slope2 DNA0mを上書きしない。
