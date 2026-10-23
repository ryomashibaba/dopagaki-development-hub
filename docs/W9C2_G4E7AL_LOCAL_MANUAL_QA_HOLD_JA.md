# G4E-7AL — 真の11m B48 + B51-C の非公開・手動QAと結果JSON（HOLD）

2026-10-24 JST。対象: `ryomashibaba/dopagaki-development-hub` の `p101-velocity-overdrive-native-trial` / Draft PR #46。旧7AJ/7AKの物理・ゲーム本体・main・Gold・原作再現・本番は変更していない。

## 工程の目的

G4E-7AKの正規240Hz P96による成功と、実人間の高速細道プレイの公平性を混同しないため、旧7AJ `reanchor` の**TRUE-PINCH と PINCH-SWITCH** の2つの真のB48道路を実キーボードで試走し、A/D入力・実道路端と移動B51-Cを観測する。G4E-7Oのローカル手動QA方式を再利用するが、7Oの13〜16m候補と入れ替えたり上書きしない。

## 今回実装

- 新規 `web/p101-w9c2-g4e7al-manual-qa.mjs`：実7AJ `reanchor` 物理出典を厳密チェック。7道路、元のB51-C 28基（再配置2基、26基元配置）、第I道路の欠損B48 cell52、初速52m/s・spawn00を必須とする。
- 正規240Hzステップを観察するだけで、手動左右入力変化時刻、0.1秒間隔の実位置・速度・接地・実路肩距離と球対B51-Cの最近接距離、致命/非致命接触・失敗理由、最後の接地時刻・接地喪失後の落下までの秒数を保存。表示FPSとカメラ遅延も観察。危険予告・楽しさ・左右で回避できたかの自己申告を独立に採る。ユーザー／端末識別子、通信、強制合格はない。
- 新規 `web/p101-w9c2-g4e7al-manual-panel.mjs`：TRUE-PINCH → PINCH-SWITCH の任意評価付き手動2走比較。ゲームオーバー画面からその場でJSONをローカル保存。セッションをブラウザメモリで保持し、ステージ間で移行。Rのリトライは直前の実240Hz走行を**最大12回分**ブラウザメモリへ退避し、次回手動ダウンロードに同梱。12回を超えた旧データは明示件数で報告。端末外送信・localStorage書込はない。
- `web/drive3d.mjs`：loopback + `g4e7al=manual` の明示指定のみステージ選択を許可。G4E-7AKの固定フレームでは**なく**、実Runnerを人間のA/Dで動かす。P96なし、OVERDRIVE・元の240Hz Runner・元のカメラ・原物理形状を維持。比較試験のためG5-C1衝突後スロットル復帰を7ALに限り無効（7AK自動物理と同じ設定）。通常の本番プレイには影響しない。自己ベスト／スプリット最良記録は書き込まない。
- `scripts/build.mjs` は読み取り専用QAモジュールのみ同梱。真の7AJ reanchorステージJSON生成は従来どおり **`private` + `DOPAGAKI_G4E7AK_VISUAL=1`** が必須。public/public-safeには研究用ステージを出さない。
- `scripts/launch-g4e7al-manual.mjs` と `RUN_G4E7AL_MANUAL.cmd`：ローカルのprivateビルドと127.0.0.1固定サーバー、ブラウザURLを1操作で起動。Git push/デプロイ/外部送信はしない。
- `tests/p101-w9c2-g4e7al-manual.test.mjs` は実7AJ 2候補の出典・記録JSON・従来原本不変を検査。Chromium `tests/browser/p101-w9c2-g4e7al-manual.spec.mjs` は実WebGLでA/D操作・2走・明示ローカル保存・自然落下からのゲームオーバー直接保存を検査（すべて**自動化であって人間QAではない**）。

## 実行と合否

専用CI: [G4E-7AL GitHub Actions](https://github.com/ryomashibaba/dopagaki-development-hub/actions/workflows/p101-w9c2-g4e7al-manual.yml) / 初回run #40024578982。

**検証ステータスはGitHub Actionsの結論を必ず再取得して記すこと。** 自動キーボードの成功だけで人間の初見視認・公平性・楽しさを認定しない。旧7AJの2/2全7道路非人間自動完走基準を保護。7AKの「早い右で第I道路から接地喪失→落下」は手動で同じ現象が起こるか未検証。

手動試走を行う場合：開発ブランチをローカルへ取得した環境の `RUN_G4E7AL_MANUAL.cmd` を実行。ブラウザ `http://127.0.0.1:4373/drive3d/?g4e7al=manual&stage=VB-P101-A13-W9C2-G4E7AK-TRUE-PINCH` で2候補を順に試走する。ページが勝手にアーティファクトを送信したり人間QAを認定することはない。JSONのローカル保存はユーザーによる明示操作が必要。

**HOLD：人間初見QA、美術品質、物理難易度の正式採用、Slope2 DNA公式認定0m、本番・main・Gold・原作再現・公開。**

次の意味ある工程では手動試走で得た真のJSONを参考に、落下前の判断可能距離・目線と安全なライン取りを実3D形状改善で検討する。ただし、人間試走がまだ存在しない状態で不合格箇所を作り出して改造しない。

## G4E-7AL 追加の手動QA安全性修正（2026-10-24 JST）

- URLに2番目の `PINCH-SWITCH` を指定しても、**必ず第1走 TRUE-PINCH** から開始。記録順序と表示の不一致を防止。
- `R`、再開ボタンで再試走した場合、直前のRunnerで少なくとも1 physics step記録した走行のログを `restartedAttempts[]` に最大12件退避し、ユーザーが自分でJSON保存したときだけ出力する。最大数を超えた履歴は `olderAttemptsDropped` で明示。人間の評価を自動で補うことはしない。
- 2試走が確定した後の再スタートはガードで拒否し、確定済みレポートの意図せぬ上書きを防ぐ。ページの再読み込みは**保存とは異なる**ので、閉じる前にJSONを保存する必要がある。
- 専用Node試験にリトライ履歴最大12件・出典とHOLD、Chromium試験に逆順URLの強制修正・実R再走からのJSON保持・2走完了後の再開防止を追加。
- 保護：実B48や動体28基、物理法則・スコア・Gold・main・両本番を一切変更せず、privateの明示フラグのみ。人間初見QAは**未取得/HOLD**。

新しい専用CI：[G4E-7AL latest Actions](https://github.com/ryomashibaba/dopagaki-development-hub/actions/workflows/p101-w9c2-g4e7al-manual.yml)。初回 #40024578982 および新しいrunはGitHubホストrunnerのキュー待ちを確認。**CI SUCCESSとは断定せず、後続担当はGitHub上の現HEADに対応するrunの実結果を必ず確認する。**

## G4E-7AL 補助計測によるFPS汚染の予防（2026-10-24 JST）

- 従来の手動QA観測は移動障害物01/02の `movingObstaclePose` と `sphereBoxSeparation` を物理240Hzの毎ステップで再計算し、数値計測自体がブラウザFPSを下げる可能性があった。
- **物理の `Runner.step`・CCD・本物の28基B51-Cとの接触・速度・道路形状・カメラは一切変更しない。** 観測だけを1/12 physics step（原則20Hz）、初回、死亡／完走時に限定。移動接触イベントは引き続き正規240Hzの `runner.events` を全件読み取る。
- JSONには `movingSeparationSamplingHz:20`、`movingSeparationNotContinuousCCD:true`、実サンプル回数と `separationSampleSeconds` を明記。**補助距離の最小値を「連続衝突検査の真の最小値」と称さない。** 真の球／OBB衝突は正規物理エンジンが引き続き判定する。
- Node試験に25実物理ステップ中、2基の距離観測が3回（合計6オブジェクト姿勢＋分離判定）となることを検証するケースを追加。Chromiumには走行前のNext拒否・完了後のSpace拒否のシナリオを追加。
- 専用CI最新runは [#40026339519](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40026339519)。2026-10-24 JST確認時点では **QUEUED**。最終合否は未確認。既存の7F workflowのゼロジョブ失敗とは独立に扱い、ALをPASSと誤認しない。
- 保護：実人間の初見視認性、真の公平性、見た目、正式採用と公開は引き続きHOLD。G4E-7AJ/7AKの旧基準と凍結原本も保持。
