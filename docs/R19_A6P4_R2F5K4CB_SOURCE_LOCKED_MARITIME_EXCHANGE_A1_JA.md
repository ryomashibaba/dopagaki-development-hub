# K4CB A1 — 真正K4CA A2原本から港湾公共建築の作者造形を再開（結果は実画像でのみ採否）

作成：2026-11-05 JST。DOPAGAKI SLOPE — HYPER RUSHの従来計画の継承であり、新規方針ではない。

## 実装された作業（技術実行・視覚結果の確認とは区別）

- K4CA研究HEAD `b3e2e659c60764ce01cd537d2f54e3c8d80d6ae5` を唯一の親とする新しい隔離研究枝 `research/k4cb-maritime-exchange-true-chase-20261105` を作成。main・正式P101・Draft PR #46は編集しない。
- 元K4CA A2真正編集可能Blender（SHA256 `299f1972e3383a7fc0047409a0f58581da3884988749dff6842a80cdf49a3ffa`）を厳密チェックして研究コピーをロードする `scripts/p101-k4cb-source-locked-maritime-exchange.py` を実装した。
- 以前のK4BW/K4BY港湾公共施設の本物の屋根、基礎柱、元11307方向軸を使い、建物の位置を推測の画面スクリーン板でなく3D物理空間に結びつける。既存公共施設の前に、3組の厚みのある石造構造アーチ、奥まったグレージング、真正入口の開口、屋根荷重を受ける構造材、連続したコンコース床と港湾アクセス斜路を追加。遠景に箱を大量生産しない。追加の素材は新規外部写真素材と偽称せず、作者プロシージャル研究材質として明記。
- `.github/workflows/p101-k4cb-native-maritime-exchange-art.yml` は、K4CA成功Run #41849818268から編集可能原本と本物の同CHASE画像を取得、ZIP展開後にSHA256と先行監査を確認し、真正Blender EEVEE・768×480・固定CHASEを1回レンダリング。元A2との同条件比較、既知6対黒筋の独立再発チェック、新しい港湾画面領域の実ピクセル変化を検証し、Blender/PNG SHA監査とResearch Evidenceを保存する設計。
- 起動Actions：[#41857056044](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41857056044)。**Run完了の証拠を見るまでTECH PASSを宣言しない**。パーツの画面内投影や画像差分はART品質採点ではない。

## 一切変更してはいけない正本

- 元Game Blob `af076d67492a677d2235e4730aef8cdf4808e106`、元B48 Road5 vertex/face SHA256 `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`。
- 元6Camera・CHASE、元樹9本（8本のCC0 pine＋K4BV本物canopy）・K4CA新設2本のCC0樹木、全照明。K4BZで因果実証済みのK4BY研究重複Road1個は `hide_render=True` のまま。
- 元7 Road・B51 28動体・240Hz・球半径0.65m・元の操作／物理・新Collider0。本番2サイト・W7F Gold・公式P101・main・Draft PR #46 Open/Draft/未merge。Work/Computer Use事前承認。追加有料API0円。

## K4CB A1の目視判定契約

本物の `K4CB_VS_K4CA_TRUE_SAME_CHASE_MARITIME_EXCHANGE_ART_REVIEW_NOT_GAME.png` がGitHub研究枝に保存されたら、ファイル自体を直接開いて次の点を評価する：①アーチと実際の屋根・柱・海辺デッキの立体接続、②模型に見えない実建築のスケールと内部奥行き、③元の道路を黒い筋や新オブジェクトで遮らない、④左海岸地形と道路は依然弱いため画面全体としての品質を過大評価しない。目視で高品質といえない限り**ART REJECT**、正式ART採用0件／Slope2 DNA0mを維持。

**開始時点の正確な判定：K4CBコード＋Workflowを研究枝へコミット済み、真正A1実行結果は未確認。ART/HUMAN/FPS/SAT/CCD/RELEASE/MERGE HOLD。**
