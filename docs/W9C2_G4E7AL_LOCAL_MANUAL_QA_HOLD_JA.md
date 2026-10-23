# G4E-7AL — 真の11m B48 + B51-C の非公開・手動QAと結果JSON（HOLD）

2026-10-24 JST。対象: `ryomashibaba/dopagaki-development-hub` の `p101-velocity-overdrive-native-trial` / Draft PR #46。旧7AJ/7AKの物理・ゲーム本体・main・Gold・原作再現・本番は変更していない。

## 工程の目的

G4E-7AKの正規240Hz P96による成功と、実人間の高速細道プレイの公平性を混同しないため、旧7AJ `reanchor` の**TRUE-PINCH と PINCH-SWITCH** の2つの真のB48道路を実キーボードで試走し、A/D入力・実道路端と移動B51-Cを観測する。G4E-7Oのローカル手動QA方式を再利用するが、7Oの13〜16m候補と入れ替えたり上書きしない。

## 今回実装

- 新規 `web/p101-w9c2-g4e7al-manual-qa.mjs`：実7AJ `reanchor` 物理出典を厳密チェック。7道路、元のB51-C 28基（再配置2基、26基元配置）、第I道路の欠損B48 cell52、初速52m/s・spawn00を必須とする。
- 正規240Hzステップを観察するだけで、手動左右入力変化時刻、0.1秒間隔の実位置・速度・接地・実路肩距離と球対B51-Cの最近接距離、致命/非致命接触・失敗理由、最後の接地時刻・接地喪失後の落下までの秒数を保存。表示FPSとカメラ遅延も観察。危険予告・楽しさ・左右で回避できたかの自己申告を独立に採る。ユーザー／端末識別子、通信、強制合格はない。
- 新規 `web/p101-w9c2-g4e7al-manual-panel.mjs`：TRUE-PINCH → PINCH-SWITCH の任意評価付き手動2走比較。ゲームオーバー画面からその場でJSONをローカル保存。セッションをブラウザメモリで保持し、ステージ間で移行。Rで途中リスタートすると現在の未保存観測は失われることを説明。
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
