# DOPAGAKI SLOPE — LIVE HANDOFF (R18 P1, 2026-10-30 JST)

**リポジトリの正式HEADは再開ごとにPR#46から再取得。作業ログ・画像をチャットに大量貼付しない。**

## 不変原則
QUALITY/GAMEPLAY/ART-FIRST + INTEGRATED VERTICAL SLICE。元の真正240Hz WebGL2・球0.65m・元B48物理道路7本・元B51移動障害物28基・合法P96/P94/A13・原RAWカメラ/HUDを維持。保護blob `af076d67492a677d2235e4730aef8cdf4808e106`。元main、W7F Gold、P100、本番サイトを一切変更せず、PR #46をOPEN/Draft/未マージのまま。透明床・強制吸着・偽finish・物理外挿での美術合格は禁止。

## 新しいR18 P1実装
- 旧R17の真正A/BのARTは両方REJECT、正式ART採択0件、Slope2認定0m。
- R18 P0で元カメラ2世界×5時刻から66候補を計測・CI PASS。新R18 P1は **54/58/61/64/67秒**の5地点で単一の都市を時間設計する本物の3Dソース。
- 真の3D2案：`A_CIVIC_RIBBON_CONCOURSE`と`B_TERRACED_COURT_NETWORK`。`scripts/p101-r18p1-temporal-inhabited-city-architecture.mjs`。元R15S3D15と同一の法線符号`right=[-forward.z,0,forward.x]`、5つの元B48座標サンプルを使用。元ドキュメント不変、新規コライダー0。都市としての連結は可視意匠であり歩行可能な証明ではない。
- WebGL2個別隔離 `scripts/p101-r18p1-private-original-webgl2-city-pack.mjs`。正規6条件元ランナー `scripts/p101-r18p1-original-game-six-true-webgl2-runs.mjs` と独立PNG 36枚バイト検証＋10偽認定拒否 `scripts/p101-r18p1-independent-real-webgl2-native-gate.py`、専用 `tests/p101-r18p1-continuous-actual-native-city.test.mjs`／[CI](https://github.com/ryomashibaba/dopagaki-development-hub/actions/workflows/p101-r18p1-true-original-webgl2-continuous-city.yml)。
- 初回CIはR18 P1研究用接続回廊の高さベクトルが`[0,height]`の2成分だったため、非有限Zを検知してFAIL。原因は線分曲率の大小でなく欠落Z。コミット`65b1b0f5019b44f8e2d35c83e732b0cba4c43ac2`で`[0,height,0]`に修正。修正版[CI #41075148883](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41075148883)は**静的3D/原本保護テストPASS**、PRIVATEビルド以降は実際の完了結果を次回確認する。CI結果未確定のまま本物の描画/完走/ART PASSを主張しない。
- Windowsワンクリック試験入口：`scripts/R18P1_PRIVATE_FIVE_TIME_CITY_ONE_CLICK.cmd`。ユーザー実機のWindows GPU/FPSと手動操作結果は**未確認**。
- 本工程の詳細は `docs/G4E7DZ_R18P1_FIVE_TIME_REAL_3D_MEGACITY_INTEGRATION_AND_QA_JA.md`、過去設計理由は `docs/G4E7DZ_R18P0_TRUE_CAMERA_SPATIAL_CITY_TIME_DESIGN_GATE_JA.md`。

## 次に必ず行う
修正版CI #41075148883 の6条件36真正PNG/元`finish`4/4/10偽認定拒否/ソース保護を実結果で照合。成功ならArtifactを期限前に取得し実画像を旧D15R1と一致する5tickで目視審査。ARTが期待未達ならREJECTして原因を特定。公開・マージ禁止。人間手動、B51視認、実GPU性能は常に別ゲート。
