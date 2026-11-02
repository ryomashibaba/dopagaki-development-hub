# G4E-7T — 真の早期細道と物理ギャップ、因果性・全編完走は未採択
基準：2026-10-22 JST。G4E-7Sの厳密な同一制御比較では切断による位置差0m、接地差0tick。従ってR-CUTのジャンプは既存坂の自然ジャンプであり、ギャップ原因とは証明できない。

G4E-7Tの独立した路面研究はG4E-7R SWEEP原型から派生し、実B48第一道路のu=.43–.77に追加の幅絞りを形成する。目標13.6m、中心周辺のu=.56–.70で実幅を測定。SOLIDは連続路面、EARLYとLATEは同じ実制御点にそれぞれu約.605/.667の2セル実切断を設定。ギャップあり／なしで同一の速度・物理・操舵・障害物28基を維持して比較。真の路面で起こるかを検証し、人間評価は別とする。既存Rと全てのGoldは不変更。

本研究は早期路面の初試作・専用Node検証のみ。描画公開・通常ステージ選択・公式Slope2 DNA認定は無し。認定0m、PR #46はDraftでHOLD。

## G4E-7T R1 / 240Hz 実測（2026-10-22 JST）

- 初期のG4E-7Sの欠損ギャップ：同一物理の連続床と切断床で位置差 **0m**、接地差 **0tick**。よってジャンプの主因は自然起伏であり、穴自体には実効的な効果がなかった。CI [#39797081221](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/39797081221) SUCCESS。
- G4E-7T地上踏切調査：正規B48の連続床では自然ジャンプ開始は **u=0.72528 / 5.8375s**。元のR欠損位置u約0.81は遅すぎる。u約0.50–0.69では床に接地した状態から穴により新たな浮遊が発生する。CI [#39800217370](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/39800217370) SUCCESS。最初のスカウト[#39798602559](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/39798602559)はRunner初期状態readyを処理しないため無効。修正後の値のみを採用。
- G4E-7T R1正規240Hz start00マトリクス[#39799927966](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/39799927966) SUCCESS（テスト成功は候補の品質合格ではない）。**SOLID 53.300秒で7/7完走**。実13.790m EARLYは5.071秒でcollision-only側面衝突・FAIL。実13.507m LATEは5.529秒で同様FAIL。両方が実欠損による軌道差を生み、R旧ギャップの欠点は克服。ただし着地面を作れていない。
- R1因果コード初版の「追加浮遊148/108 tick」は失敗後に停止したRunnerを含める集計バグ。これは**正式な追加浮遊量として使用禁止**。後続コミット `0d763976786e5f629446c9d7020cf9e17961749a` で両方がrunning時のみを集計する条件へ変更。正しい修正後CI値が出るまでは数値未認定。
- G4E-7S景観A/B: 実240Hz撮影4ポイントのうち3ポイントで6 spireの景観ON/OFFが画面上同一。美術として改善が実証されず**不合格/HOLD**。高速カメラ比較の停止した検査Runnerの52m/s HUD表示バグも修正 `e0be40c...`。
- G4E-7T R2: EARLY実細道13.6mの着地点を追加の下り曲面として物理B48制御点から生成する研究案（12m/18m深度、1/2欠損セル比較）。新たな架空床・飛び石・自動ジャンプ等は禁止。自動完走／実着地はCI成功まで未判定。ソース `scripts/p101-w9c2-g4e7t-lower-landing-build.mjs`、`scripts/p101-w9c2-g4e7t-lower-landing-native.mjs`。

## 依然として守るべき保護

Gold/W7F/B5/原作Slope再現サイト・本番サイト・main、G4E-7R/Qの原本、7本の物理B48、28のB51-C機械、240Hz物理、後方固定相対カメラは変更禁止。ローカルprivateの明示オプトインでしか開発候補を選ばせない。PR #46はDraftのまま。人間のプレイ成功・楽しさ・合法的な運転可能区間を自動操舵の結果からは認定しない。正式Slope2 DNA 0m、リリースHOLD。
