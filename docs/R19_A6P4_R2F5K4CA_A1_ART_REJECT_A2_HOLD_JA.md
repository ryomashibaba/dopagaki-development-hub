# K4CA A1→A2 — 真正画像美術評価と安全な再試験の記録

2026-11-04 JST。研究専用。元ゲームは変更しない。

## A1 真正技術成功、目視美術REJECT

- [K4CA A1 CI #41847858655](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41847858655) SUCCESS。先に #41847033140 はPIL導入順の不備、#41847318174 はBlender非描画原本メッシュへのRaycastが原因で安全停止。環境と実可視レイ検査を修正し成功した。
- 本物のK4BZ R2編集可能Blender SHA256 162a7baaf7594b36a134457bee817bd7dcf0ef1b3e581419d6561efa92e45382 から、可視左地形 K4BQ EAST_SLOPING_HILLSIDE の頂点・面を保持し、地質PBR材質のみ更新。元の真正Poly Haven CC0 island_tree_02を2本だけ位置(113,255)/(202,274)の実地形Raycastへ接地配置。旧木9本、元6Camera/CHASE、物理Road5、照明は不変。黒筋は戻らなかった。
- 編集可能A1 Blender 271,620,488B SHA256 7b879e56bc04f2db5b3a8607e2da798f728fd9cfe9b5cbbba1bb0ba9d9375a3e。
- A1真正同CHASE 768x480 PNG 477,109B SHA256 e51daeda02ce3e216f797b3dbaf3f7a0e7d93123ee64849d77ea95fd00cfd49a。
- [本物のK4BZ→K4CA A1比較画像](research-evidence/k4ca/K4CA_VS_K4BZ_TRUE_SAME_CHASE_COASTAL_SLOPE_PHOTO_CANOPY_ART_REVIEW_NOT_GAME.png) SHA256 bf6d11ac49c7f49bfcaf3284f710caa788a1b3ddfbb1ffca1ad15559d09cddfc。
- [A1 Artifact #13333166929](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41847858655/artifacts/13333166929) ZIP 122,704,490 B SHA256 1826c9b9a3677f84ca2650a4b178d01564006f904ecdb8fee7c98b97bfd90152。実ZIP CRCと個別画像SHA一致。
- **A1 ART REJECT**：左側の地面が白っぽい・チョーク状で自然な海岸地質に見えない。2本の真木は小さな立体として見えるが、全体の道路が単調で右港建築が模型のような問題は残る。TECH PASSをART合格とは扱わない。

## A2 再試験

- 新しい巨大な地形・道路の二重化を追加しない。A1で白くなった左斜面の色だけを暖色・低輝度の岩へ調整、真木2本の位置と原本・CHASEは固定。K4BZの黒筋再発防止試験を必須とする。
- [A2 CI #41849818268](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41849818268) は記録時点で進行中。実画像確認前のART合格は主張禁止。

## 恒久的な保護

元Game Blob af076d67492a677d2235e4730aef8cdf4808e106。元Road5全頂点面 f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2。B48 7Road/B51 28Mover/240Hz/球0.65m、元6Camera、研究CHASE、9本の木、main、公式P101、Draft PR #46、本番2サイト不変。正式ART採用0件／Slope2 DNA0m、SAT/CCD/HUMAN/FPS/RELEASE/MERGE全HOLD。Work/Computer Use事前承認、追加有料API0円、Windows操作0。
