# DOPAGAKI SLOPE — 新しいChatのための永久GitHub再開入口

**ここは短い入口であり、技術正本を複製・上書きしない。** 作業開始時に必ずGitHubから現在の値を取得する。古いHEAD・古いCI結果よりも最新PRと根拠付きの正本を優先。2026-11-01作成。

## 新チャットでの操作 — 1文のみ。ファイル添付・ダウンロード不要

「**DOPAGAKI SLOPEをGitHub正本から引き継いで、次の工程を進めて。**」

GitHub接続済みChatGPTが上の1文を受けたら、本人に過去ZIP・Markdownや長文プロンプトの再貼付を求める前に以下の順に実行する。

## 自動で読む順序

1. GitHubの `ryomashibaba/dopagaki-development-hub` の [Draft PR #46](https://github.com/ryomashibaba/dopagaki-development-hub/pull/46) を直接取得し、**現在のHEAD**・OPEN/Draft/未マージ・保護対象を検査する。
2. PRのhead branch `p101-velocity-overdrive-native-trial` で最新 [`docs/DOPAGAKI_LIVE_HANDOFF.md`](https://github.com/ryomashibaba/dopagaki-development-hub/blob/p101-velocity-overdrive-native-trial/docs/DOPAGAKI_LIVE_HANDOFF.md) の**冒頭から最新工程を読む**。旧履歴を新状態として誤認しない。
3. [`PROJECT_STATE.md`](https://github.com/ryomashibaba/dopagaki-development-hub/blob/p101-velocity-overdrive-native-trial/PROJECT_STATE.md) で固定された全体目標・設計経緯・過去の合否・失敗原因・運用ルールを確認する。最新ゲートと矛盾した古い記述は履歴と扱う。
4. 最新 [K3/K3B審査正本](https://github.com/ryomashibaba/dopagaki-development-hub/blob/p101-velocity-overdrive-native-trial/docs/R19_A6P4_R2F5K3_K3B_ALL_SEVEN_TRUE_ORIGINAL_CAMERAS_ART_HOLD_K4_GATE_JA.md) を読む。必要に応じてR2F5-K/K2、I/J、F/G2等の判定報告、コミット、Actionsの原実行・Artifactを照合する。
5. **最新ブランチ・CIを起点として継続**し、ソース追加/QA/画像/SHA/アート判定/未検証事項/次工程をGitHubで保持する。チャットでは要点＋正本リンクのみ。新チャットを開始するたびに全資料を再生成しない。

## 現在の最終実測（2026-11-01 K3B、参照点。毎回最新を再照合）

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
