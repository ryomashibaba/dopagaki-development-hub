# G4E-7AP — TRUE B48 × B51-C temporal slalom（非公開・未認定）
作成日：2026-10-24 JST。Draft PR #46 の開発ブランチ限定。

## 目的と実装
ユーザー指摘「本物の障害物がしょぼい」「反発で逆走する」「左右のライン取りが面白くない」を直接扱う**物理候補**。AO警告マーカー追加ではない。

- `scripts/p101-w9c2-g4e7ap-temporal-slalom.mjs`: 7AJ reanchorの真11m級B48の2道路に独立生成。移動障害物01は周期3.6sの実横断slider（fail）。障害物02は路肩から周期4.8sで振る実rotator（衝突push）。リズムとライン選択を研究する。
- 元の7道路・欠損cell52・残り26基のB51-C・物理240Hzエンジン・速度・カメラ・操舵・得点・Goldを保護。新しいオブジェクトは生成しない。
- `tests/p101-w9c2-g4e7ap-temporal-slalom.test.mjs`: JSONの非破壊検査、姿勢変化する実B51-CのOBBと球の接触距離を左右路肩のサンプルで確認、240Hz正規Runnerの短時間スモーク。**左右の単点空きが、動くボールが到達可能な安全経路を保証するわけではない**。
- `web/drive3d.mjs`: `?g4e7al=manual&g4e7ap=duel` の**localhost限定**でのみ従来ALパネルを再利用し、AP 2道路の順次実240Hz A/D手動試走とゲームオーバーJSON保存を使用。旧ALやAO既定動作は不変。JSONの `physicalCandidate` がAPか7AJかを区別。自動運転ではない。
- 非公開ビルドは `DOPAGAKI_G4E7AK_VISUAL=1` でAPの独立JSONを出力。公開ビルド／public-safeはこれらを除外。既存CIにNode/実Chromium/WebGL比較・隔離検査を追加。

## 合否・残る問題
技術CI・WebGLの成否はコミットに紐づく実行結果を確認すること。コード実装だけで合格とは判定しない。実人間の高速度での回避判断、公平さ、逆走の解消、十分なライン選択の面白さ、美術、正式採用、公開はすべて**HOLD**。正式Slope2 DNA認定は**0m**。非人間240Hzスモーク ≠ 7/7自動完走 ≠ 人間による初見認定。

PR #46 Ready化・merge／Gold／main／両本番サイト／旧Slope再現：変更禁止。
