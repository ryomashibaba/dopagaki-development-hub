# DOPAGAKI SLOPE — K4 Road0市場1案 Native Blender真正16画像：TECH限定PASS／独立ART REJECT

**2026-11-02 JST。** 正本 `ryomashibaba/dopagaki-development-hub`、branch `p101-velocity-overdrive-native-trial`、Draft PR #46 OPEN／未マージ。R2F5-K3/K3Bの元7区間カメラ技術成果を継承。**正式ART採用0件・Slope2 DNA認定0m**を維持する。

## 1. 正式判定と原物理の保護

- **TECH限定PASS：** [K4 GitHub Actions #41320140127](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41320140127) 全ジョブSUCCESS。元A5の編集可能5メッシュに**Road0市場1案のみ**を直接追加し、Native Blender 4.0.2→編集可能BLEND→GLB→独立GPU読戻→原WebGL2 16真正画像・画像SHAを成功。元 source Git blob `af076d67492a677d2235e4730aef8cdf4808e106` 変更0。B48 7道路、B51 28、240Hz、元球XYZ/速度、元ball-lock-unfiltered-headingカメラ、原コライダー、左右操舵/自然ジャンプ/法則不変。**増設コライダー0**。
- **独立ART REJECT：** 新市場が両幅の真の元カメラに出現するのは確認できた。しかし高速の原画では大小の平たい屋根・低い売店が元A5の巨大建築足元に重なった印象で、用途が異なる実市場街区・通り抜ける公共空間・人間規模の活動・深い立体都市構造が一瞥で判読不能。単純な投影BBox、30m屋根高さ、画像差の増加を美術合格にしない。
- **HOLD：** 新K4固有B48全道路三角形SAT、B51×両幅×2881tick回転OBB SAT、tick間CCD、原B51ピクセル可読性、実地盤接地、人間の建築・公共床利用、自然操舵、人間完走、Windows/iPhone FPS、正式ゲーム統合、出荷・merge。K3のスクリプト物理完走結果をK4固有衝突証明に転用しない。
- Art研究専用の元画像にはK4の真正WebGL2だけが違う。**歴史的B/F/G2/IのART REJECT街区は新K4モデルへ注入していない。** 既存の元A5デザイン自体の美術評価も今回のK4新候補の合格には使わない。

## 2. 原実行・完全検証可能性

- [Actions #41320140127](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41320140127)：全job SUCCESS（preflight／元PRIVATE A5・真道路座標／Native Blender+GLB×2／Playwright真WebGL2×16／Artifact）。
- 原 [Artifact #13089117035](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41320140127/artifacts/13089117035)：「R2F5K4_ONE_NATIVE_MARKET_TRUE_ROAD0_16_WEBGL2_ART_HOLD」。ZIP **4,022,036 bytes**、独立SHA256 `223a4e9d476c767d04b9479e537f8bdc2c6951bb283f3914a38397384969bb0e`。全26ファイル。16真正PNGすべてJSON記載SHAと独立照合一致、`errors=[]`。原Artifactは7日間保持指定なので期限切れなら再実行を要し、期限切れArtifactの検証済みを装わない。
- 元A5のGPU三角形数10,566→K4 **11,406**（新840三角形）。5独立メッシュを維持。Blender 3Dソース幾何 **32モジュール／420新面／原10,566面→編集後10,986面**。実市場の局所範囲 `x[-44,43], y[-29.5,30], z[-1.2,30.4]m`；元Road0 `u=.75`、道路**右端から外側70m**。K2の暫定90×65×32m包絡内に配置。
- 原カメラ時刻4点 `[265,721,1057,1249]` tick × 2道路幅（14m/28m）× 2映像（original/K4）＝**16真正WebGL2 PNG**。全フレーム、`WebGL2=true, B48=7, B51=28, colliders=0, camera=ball-lock-unfiltered-heading`。歴史的元カメラEye/Front誤差0（JSON精度）。元A5対新K4の各同tick XYZ/速度/カメラEye/Front誤差0（JSON精度）。**スクリプトのみ、人間ではない**。

## 3. 真画面の画素比較（独立実ZIP内PNGから計測）

同一時刻の元PNG vs K4 PNG。**RGB各チャネル最大差が36を超える画素の画面全域割合**。画像全域の画素差であり、市場建物だけの正確なマスク面積ではない。美術品質の自動採用指標ではない。

| 元tick（秒） | 14m差分割合 | 28m差分割合 | 独立真画面観察 |
|---|---:|---:|---|
| 265（1.104s） | 0.178% | 0.181% | ごく小さい追加景観、速い認知困難 |
| 721（3.004s） | 0.611% | 0.618% | 右道路沿いに小屋根群、街区として弱い |
| 1057（4.404s） | 1.853% | 1.943% | 新オレンジ／淡色屋根が実際に見えるが、元の巨大骨組み建築の足元に小型パビリオン数棟という印象 |
| 1249（5.204s） | 1.593% | 1.430% | 主市場部が右画面外へ移動してゆき、持続的な街路読解性なし |

最大差分が大きいtick1057の画素BBoxは14m `x642..914, y303..439`、28m `x652..933, y303..441`。このBBoxは**追加形状の正確な投影形や遮蔽範囲そのものではない**。独立実見では、市場らしさや広場の奥行きが形だけで明確な状態には達していない。色／店名／看板を増やして合格に見せる方式は不採用。

## 4. 失敗を隠さない修正履歴

- 初回 [CI #41319228895](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41319228895) FAIL。小型メーカー小屋の屋根が中央の空洞契約 `x(-10,10),y(-15,15),z>3m` に侵入。**assertを緩めず屋根を後退**、真の開口を保持。
- 途中で旧R2F5B街区を丸ごと継承すると、既存ART REJECT造形が混ざり新市場単体の有効性が混同されると判明。**元A5 GLB5メッシュに市場1案だけ追加する独立Blender実装に変更**。旧B/F/G2/I本体や履歴は変更せず。
- [CI #41319723784](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41319723784) FAIL。元GLB読み込み時のBlenderの頂点色属性ドメイン想定が合わず停止。元色を捨てずに `POINT`/`CORNER` 両方の読込を支持するよう修正。**#41320140127で技術PASS**。中間キャンセルは成功扱いしない。

## 5. 次工程 — K4R（同一Road0市場のカメラ先行造形見直し）

**別市場候補の量産・K2のRoad2/Road3を同時作成することは禁止。** 今回の8真正K4画像（14/28m×4tick）を基準に、**現状の小屋根が元A5巨大骨組みの足元に埋もれる**のを第一原因として設計し直す。大壁・二小屋・反復柱・巨大門・単一横リボンへの回帰は禁止。

1. 同一 `u=.75` 右70m、原カメラ 265/721/1057/1249tick を固定し、少数の大きく異なる建築シルエット・本当に空へ開く一体公共市場地盤・屋根下の奥行き、地上の連続した使用空間を、**色や表層ではなく形状**で強化。最低4tick×両幅の元ゲーム真正画像でARTを再拒否可能にする。仮Boxの見かけ面積増だけではPASSしない。
2. 現形状の中央開口は**z>3mの追加メッシュ無し**という限定検証のみ。現実の床支持・実歩行・都市的連続性は証明できない。旧失敗箇所を再度侵害しない。アートが改善しなければ再量産を止めて位置・設計ゲートを再調査。
3. ART候補の真画像が改善した場合のみ新モデル固有の**B48全7メッシュ／B51×両幅×全2881tick／CCD／B51画像遮蔽／地盤・HUMAN／Windows/iPhone FPS**に段階的着手。B5・P100・W9-X・原7,280m・原240Hz球・原物理・main・Gold・本番2サイト禁止変更。Draft PR #46 OPEN／マージ禁止。

**CURRENT: K3/K3B native-source true camera TECH PASS、K4 1-market Native BLEND/GLB + genuine 16 WebGL2 TECH PASS、独立K4 ART REJECT、正式ART 0、Slope2 DNA 0m、B48/B51/CCD/HUMAN/PERF/GAMEPLAY/RELEASE/MERGE HOLD。**
