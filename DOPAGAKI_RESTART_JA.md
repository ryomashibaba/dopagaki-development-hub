# DOPAGAKI SLOPE — 新しいChatのための永久GitHub再開入口

**ここは短い入口であり、技術正本を複製・上書きしない。** 作業開始時に必ずGitHubから現在の値を取得する。古いHEAD・古いCI結果よりも最新PRと根拠付きの正本を優先。2026-11-01作成。

## 新チャットでの操作 — 1文のみ。ファイル添付・ダウンロード不要

「**DOPAGAKI SLOPEをGitHub正本から引き継いで、次の工程を進めて。**」

GitHub接続済みChatGPTが上の1文を受けたら、本人に過去ZIP・Markdownや長文プロンプトの再貼付を求める前に以下の順に実行する。

## 自動で読む順序

1. GitHubの `ryomashibaba/dopagaki-development-hub` の [Draft PR #46](https://github.com/ryomashibaba/dopagaki-development-hub/pull/46) を直接取得し、**現在のHEAD**・OPEN/Draft/未マージ・保護対象を検査する。
2. PRのhead branch `p101-velocity-overdrive-native-trial` で最新 [`docs/DOPAGAKI_LIVE_HANDOFF.md`](https://github.com/ryomashibaba/dopagaki-development-hub/blob/p101-velocity-overdrive-native-trial/docs/DOPAGAKI_LIVE_HANDOFF.md) の**冒頭から最新工程を読む**。旧履歴を新状態として誤認しない。
3. [`PROJECT_STATE.md`](https://github.com/ryomashibaba/dopagaki-development-hub/blob/p101-velocity-overdrive-native-trial/PROJECT_STATE.md) で固定された全体目標・設計経緯・過去の合否・失敗原因・運用ルールを確認する。最新ゲートと矛盾した古い記述は履歴と扱う。
4. 最新 [K4R設計・独立CI審査ゲート](https://github.com/ryomashibaba/dopagaki-development-hub/blob/p101-velocity-overdrive-native-trial/docs/R19_A6P4_R2F5K4R_ROAD0_MARKET_NATIVE_REDESIGN_JA.md) と、直前の [K4審査正本](https://github.com/ryomashibaba/dopagaki-development-hub/blob/p101-velocity-overdrive-native-trial/docs/R19_A6P4_R2F5K4_ROAD0_ONE_NATIVE_MARKET_16_TRUE_WEBGL2_TECH_PASS_ART_REJECT_JA.md) と直前 [K3/K3B正本](https://github.com/ryomashibaba/dopagaki-development-hub/blob/p101-velocity-overdrive-native-trial/docs/R19_A6P4_R2F5K3_K3B_ALL_SEVEN_TRUE_ORIGINAL_CAMERAS_ART_HOLD_K4_GATE_JA.md) を読む。必要に応じてK2、I/J、F/G2等の判定報告と原Actions・Artifactを照合する。
5. **最新ブランチ・CIを起点として継続**し、ソース追加/QA/画像/SHA/アート判定/未検証事項/次工程をGitHubで保持する。チャットでは要点＋正本リンクのみ。新チャットを開始するたびに全資料を再生成しない。

## 【2026-11-02 最新：K4S実CI 336/336一致、K4T原ゲーム画面の代理位置比較へ】

- **K4S [Actions #41352432473](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41352432473) 全ジョブSUCCESS。** [Artifact #13102955065](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41352432473/artifacts/13102955065) ZIP12,512B SHA256 `f8a290a21097d06850f123186a5205834efd2d2ffab06fd1b010a906b6b80a11`。元A5 5メッシュ（各幅10,566三角形）・元K/K3B全58枚の真正PNGをSHA検証。元14/28m合計42カメラ×8配置＝336評価行の遮蔽4整数**1,344個全一致**。**SOURCE/BVH TECH限定PASS**（ART/HUMAN/SAFETYではない）。
- Road0市場の `u=.85・右70m`は、K4R失敗位置`u=.75・右70m`より**tick1249の代理外殻が28→63/75、中央空間2・1→9/9点**（14/28m）。原A5 BVH以外の遮蔽や実3D建築は未評価、位置は**仮説**でありART正式採用でない。
- **K4T** [真正元A5 WebGL2注釈付き画像研究](docs/R19_A6P4_R2F5K4T_TRUE_SOURCE_WEBGL2_SITE_OVERLAY_REVIEW_JA.md)／[CI #41354665119](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41354665119)を新規実装。K4Rの**本物の原A5画像8枚**で原CameraEye/Front/球XYZ/SHAを再照合し、2研究地点のK2近似枠だけを描く（**新建築の真WebGL2レンダリングではない**）。実験結果はCI最終確認前HOLD。次チャットは**まずK4TのActionsと原Artifactを確認**し、その真画像上でどの程度見やすい位置かを慎重に審査する。元ゲーム・物理・カメラ/コライダー/本番URL/main/Gold/P100/W9-X/B5は未変更、新模型0、PR#46 Draft未マージ、正式ART0/Slope2 DNA0、HUMAN/B48B51全SAT/CCD/FPS/RELEASE/MERGE HOLD。

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
