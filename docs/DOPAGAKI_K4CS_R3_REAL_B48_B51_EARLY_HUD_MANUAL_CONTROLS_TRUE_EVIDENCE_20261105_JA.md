# DOPAGAKI SLOPE — HYPER RUSH / K4CS R3 真B48/B51早期予告・真正Chromium操作・DCC・直接ART批判的評価
確定：2026-11-05 JST。**過去の固定憲章、K4CP批判的完全引継ぎ、K4CQ不合格、K4CR R2物理TECH PASSを一切変更・撤回しない。** 本書はK4CS研究枝専用正本。

## 最終状態・真正証拠
- 隔離研究ブランチ：`research/k4cs-native-road-hazard-early-cue-choice-20261105`。本工程の最終著作コードHEAD `8c48f8145f604f9b81ca9898b2e8924d1e6004c9`、元K4CR正本HEAD `6367e8ef2bef9f00f5dedae3869bdbdc8e2a3f04`不変更。
- R3 **[Actions #42035102211](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42035102211) completed/SUCCESS**。原本source blob固定`af076d67492a677d2235e4730aef8cdf4808e106`。実原WebGL2 Chromium、元240Hz物理Runner、元Camera、真正A/Dキーボード、実Blender4.0.2、独立監査、元Gameハッシュの全工程成功。途中ステップだけ成功でも正式合格とせず、run全体と独立JSONに基づいてTECH PASS。
- R3 [Artifact #13417758700](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42035102211/artifacts/13417758700)：**5,199,310 bytes**、SHA256 `0d9dc8b6d75ad0c5d6cf1f2a38c68022402c68868501d4dbb1845a9eea6c1bf4`。GitHubから別途取得しZIP **全CRC PASS／24ファイル**。実無加工画面10枚、同時刻比較5枚、A/D原操作画面2枚、可編集.blend、元Source sampled OBJ、監査JSONなど。R3の証拠はこのArtifactを正とする。
- R1 [Actions #42032738730](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42032738730) **FAIL保存**。最初のK4CS警告モジュールにNode.js専用`node:assert/strict`／`node:crypto` importが残り、ブラウザCORS阻止で2ケースともロード失敗。BlenderのSUCCESSをゲーム動作成功に読み替えない。
- R2 [Actions #42033717569](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42033717569) TECH SUCCESS。ただし実画像で警告文のCJK文字が四角い欠字、警告が**ゲームcanvas中央ではなくブラウザ全体中央**になっており、人間への警告表示として不合格。原HUD全体のCJK未インストール問題も研究Linux画像で未解決。
- R3でNode専用importをブラウザから完全除去、元SOURCEハッシュの前段検証は維持。警告は**ASCII優先の2行** `B51-12 | 481 m / 2.8 s | LEFT SIDE`＋`ESTIMATE - NO SAFE LANE CERTIFIED`で明瞭に表示。日本語案内はARIAテキストへ残し、実canvas`getBoundingClientRect`に合わせた画面中心ズレ実測**0px**（5時点全て）。元ゲームのその他日本語HUDのCJK欠字は別問題として残る。

## 何をゲームへ本当に実装したか
- `scripts/p101-k4cs-true-b48-ahead-b51-readable-cues.mjs`：K4CR R2実物理Road5 SHA `4957a0e1ffb1a394c4bbaa2c502caad3fdec219c9713073f5236d7bbb6ab4e2b`を基準。既存の真B48道路4・5・6を128分割した実中心線弧長により、現在位置から最大700mの**本当の再配置済み6体のB51**を追跡。実障害物`movingObstaclePose`を到達時間推定で呼んで左右を予測。これは現速度一定の**到達時推定であって、将来衝突の保証・視認ピクセル証明・安全レーン案内ではない**。
- ゲーム3D側：元B48路肩の**外側**に真サンプル座標の非衝突視認マーカー18基、**648三角形**を追加。道路面、Collider、元28 B51実衝突実体、動的タイミング、原Camera、操舵、元Runner、240Hz、元P96/P94デモ、Gold・正式QAは不変更。既存K4CRの可編集Road5／周辺環境は変えない。新3Dの正本OBJとゲームGL頂点は同一作者ソース。
- 元の`takeoverRun`手動経路にPlaywright実`KeyA`と`KeyD`を別セッション投入。source 240Hz物理で54.80s→55.15sの**実位置差14.263123m**、両ケースrunner`running`、JS/page errors 0。これは**自動キー入力による原操作系の応答検証**であり人間の反応時間、難易度、クリア成功の証明ではない。
- Blender4.0.2真正別名.blend：実Road5 **2400三角形**、前代ART REJECTの海岸 **4616三角形**、真警告ポスト **648三角形**を**3編集可能Mesh**で保存。元.blendを上書きしない。

## 同一条件の実測（旧K4CRと新K4CSの真走行）
両ケースでRoad5/B51全データ完全一致。5箇所の同一ソースNative Tick／道路ID／HUD速度が一致、オートP96→P94の原走行継続、ブラウザエラー**0件**。K4CS側の実予告：
| 原ゲーム時刻 | 真tick | 現速度 | 実B51 | 弧長での残距離 | 現速度一定 ETA | 将来側予測 |
|---|---:|---:|---|---:|---:|---|
| 55秒 | 13200 | 165.4m/s | a13-machine-11 | 437.34m | 2.64秒 | RIGHT |
| 58秒 | 13920 | 170.0m/s | a13-machine-12 | 481.22m | 2.83秒 | LEFT |
| 62秒 | 14880 | 172.6m/s | a13-machine-13 | 433.26m | 2.51秒 | RIGHT |
| 64秒 | 15360 | 176.2m/s | a13-machine-13 | 84.76m | 0.48秒 | RIGHT |
| 67秒 | 16080 | 186.1m/s | a13-machine-14 | 19.87m | 0.11秒 | LEFT |

**重要な否定情報：** `2.8秒前を観測した`のは特定5時点の推定。**64秒の0.48秒と67秒の0.11秒は人間が危険を判断するには厳しい可能性**を示し、次のB51が先に十分表示されたとは確認できていない。今後は連続する**2件以上の実B51の予告/選択を同じ本物の走行で観察・改善**する。短時間のP96自動操舵成功をゲーム性・HUMAN合格として扱わない。

## 直接画像評価と唯一の次の優先工程
- 真PNG直接観察でR3はR2より警告が読みやすくゲームcanvasに収まった。3D路肩ポストも実際に世界内で視認できる。ただしR3の作品全景は依然、巨大な平板状ネオン舗装・単調な崖/海・機能が感じられない背景。既存K4CQ R2 ART REJECTをそのまま引き継ぐため**全体ART REJECT・採用0件**。
- 次は背景小物、壁の細かい微修正、小QA監督器の増築ではない。**実2件以上の動く危険を早く予告し、左右へ正しく選択し、結果に意味がある一本の操作シーン**として改善。その後この走りの意思決定を支持するDCC-FIRST/ART-FIRSTの**全画面世界構図を再著作**する。原本以外のPRIVATE研究コピーでのみ実装し、新規Colliderや隠し補助物理を混ぜない。
- **安全ゲート不変**：正式ART採用**0件**・正式Slope2 DNA認定**0m**・HUMAN/SAT/CCD/FPS/RELEASE/MERGE**全HOLD**。main／公式P101／Draft PR #46／元Game/Road5/Camera/240Hz物理／Gold・元Slope／凍結原本／本番2サイト／正式QAを保護。Work/Computer Use・追加課金・本番公開・正式採用・merge・元原本変更には個別事前承認が必要。今回のユーザー操作通常0回。
