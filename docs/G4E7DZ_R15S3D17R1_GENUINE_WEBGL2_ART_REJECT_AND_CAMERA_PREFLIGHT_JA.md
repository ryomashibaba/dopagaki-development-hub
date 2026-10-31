# R15S3D17R1 — 元真正WebGL2全36PNG・新道路脇公共都市2案の実画像ART審査

**2026-10-30 JST：SOURCE TECH PASS／ART A+B REJECT／GAMEPLAY・HUMAN・PERFORMANCE・RELEASE・MERGE HOLD**

## 厳密に確認した結果

- GitHub Actions [#41062687304](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41062687304) は全ジョブSUCCESS。元の保護ソース、240Hzの真正走行、PRIVATEへの隔離、独立QAを含む。
- 原本のArtifact [#12981741098](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41062687304/artifacts/12981741098)：19MB弱、正確には **18,241,473 bytes**／ZIP SHA256 `8c89eaa21cecd4862fc55883bdeb775e61733dfd3d69042b1391cf25458f144b`。GitHub保存期限2026-11-06 13:29:11 UTC。審査時にZIP別途取得、36枚の元Canvas PNGを各記録SHA256と照合して**36/36一致**。
- 世界 `true-pinch`／`pinch-switch`。比較：旧`D15R1_REFERENCE_SKYDELTA`×2、新`A_OBLIQUE_CIVIC_EXCHANGE`×2、新`B_SPLIT_STATION_COURTS`×2、合計**6真正セッション／36元画像**。新都市各2世界の元Runner`finished`＋`finishEvents=1`は**4/4成功**。原HUD・元B51の表示・元道路は保全。10件の偽認定条件も独立して拒否。
- Aは**3,456**本物の3D三角形、Bは**4,208**三角形。三角数や自動完走は美術の合否と無関係。
- 出所と判定の境界：この審査は実際の元WebGL2 Canvasの目視とPNG比較による独立ART判定であり、Windows人間QAや実GPUのFPS測定は行っていない。

## 時間構成ごとの直接目視（2世界に共通する主要問題）

| t | A_OBLIQUE_CIVIC_EXCHANGE | B_SPLIT_STATION_COURTS |
|---|---|---|
| 54秒 進入 | 遠景が小さい建築輪郭のままで強いランドマーク性がない | Aと同様に非常に小さく、駅街区が判読できない |
| 58秒 遠景 | 単純なアーチ・箱が少し見えるが巨大な立体都市には見えない | 縦に長い単純な塊。周囲に実都市の密度がない |
| 61秒 接近 | アーチと箱が見えるが生活公共空間・実中庭が読み取りにくい | バラバラの塔と梁の印象が強い |
| 64秒 近接 | 左右の大きな壁面に急接近し、道路の両端を圧迫。都市の内部機能は理解できない | 巨大な箱と高い柱が画面を占有。中央空間は暗いまま |
| 67秒 退出 | 構造物を通り抜けた都市の連続性ではなく、近くの数体が過ぎ去る感じ | ばらばらの高層建築が残り、連続して発展する都市の奥行がない |

旧D16の頭上に重なる大棚・円形島を減らし、路面の正面が比較的開いた点は改善。しかし単純で無機質な箱状幾何、巨大な空白の黒背景、近景壁面の急激な迫り、道路と街区の都市機能上の接続不足により、Steam有料インディー級の美術水準には遠い。**両案をART REJECT**とする。AとBの相対ランキングを美術採用には使わない。元B51の遮蔽と実際の手動回避可否は依然不明。

## 本物PNG画素差（幾何が見えた量の補助証拠にすぎない）

同世界・同時刻の真正旧D15R1キャンバスとのRGB絶対差、各画素の最大チャネル差が28超の割合。ROI=x18〜82%、y12〜70%。**美術評価スコアではない**。

| world | art | 54s | 58s | 61s | 64s | 67s |
|---|---|---:|---:|---:|---:|---:|
| true-pinch | A | 0.92% | 4.83% | 16.29% | 41.21% | 44.24% |
| true-pinch | B | 0.89% | 4.65% | 15.84% | 38.84% | 38.39% |
| pinch-switch | A | 0.72% | 3.91% | 12.41% | 43.84% | 38.09% |
| pinch-switch | B | 0.72% | 3.80% | 11.99% | 39.95% | 36.26% |

54秒では画面中央上部の実画素差が1%未満だが64秒には39〜44%程度。これは見た目がよくなった証明ではなく、**建築の画角内への出現の時間が偏っている**という仮説を支持する。原HUDやその他の差分も含むため厳密な純建築面積率とは呼ばない。

## 次工程R15S3D17R1：造形変更前の実カメラ幾何診断

- 先に真正R15S3D15の10カメラ元RAW `eye/front/right/up` と、今回のR17真XYZメッシュを同世界座標で照合する。単なる画像比較では分からない「進入54秒の見込み視角」「遠方ランドマークの画角」「64秒の大きい壁が進行方向を狭めるリスク」を再測定。
- `scripts/p101-r15s3d17r1-genuine-camera-mesh-projection-gate.mjs`および[専用CI](https://github.com/ryomashibaba/dopagaki-development-hub/actions/workflows/p101-r15s3d17r1-genuine-camera-mesh-preflight.yml)を実装。原10カメラ証拠は以前の真正[Actions #41047602697](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41047602697)から再利用。
- 投影は本物のGLSL投影式と元カメラ軸を使うが、**三角形重心の視野内測定であり、レンダリングの視認性・遮蔽・美術を保証しない**。実画像の独立目視と、元B51の人間可視性・操作性評価を引き続き必須とする。
- 旧A/Bを単に詳細化する次案は禁止。「54秒で画面中央に都市がどの程度見えるか」→「64秒で壁が急接近して悪印象を与えないか」の2点を先に設計してから、大きな建築の形態自体を刷新する。

正式ART採用0件／Slope2認定0m／HUMAN・PERFORMANCE・RELEASE・MERGE HOLD。PR #46はDraftのまま。本番・main/Gold/P100・元ソース・正規7B48/28B51/240Hz/合法操舵/RAWカメラ/HUDは無変更。
