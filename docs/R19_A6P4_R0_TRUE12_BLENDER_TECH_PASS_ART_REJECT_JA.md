# R19 A6 P4 R0 — 真Blender/GLBと真正12 WebGL2完成。美術REJECTの直接修正計画

**2026年10月31日 JST。** [GitHub Actions #41184387785](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41184387785) **全SUCCESS**。原 [Artifact #13036687584](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41184387785/artifacts/13036687584)（2026-11-07頃失効予定）から**本物のBlender編集可能BLEND 2本、GLB 2本、元WebGL2 12画面、物理比較JSON**を取り出して目視。

## 本物の技術結果

元GitBlob af076d67492a677d2235e4730aef8cdf4808e106維持、元B48道路7・B51物理動体28・元カメラ/HUD・240Hz不変。5独立建築地区、Blender面15,098、GPU三角形**30,332**、非衝突追加0。両幅×6時刻の真正Canvas12/12で元A5から画像差あり。A0元240Hz球XYZ差最大**0.0007703576m**。これはTECH PASSだが美術の良否を一切保証しない。

## 独立美術審査（ART REJECT）

- ULTRA 4.404秒：14m狭路上部から、背が高くほぼ同じ色・断面の細長い建築が列を作る。道路自身は残るが、生活都市・独自の巨大建築ではなく門柱/塔の反復に見える。B51の本物の画素遮蔽は未評価。
- ULTRA 8.004秒：Road1中央の空白は減ったが、画面上端まで伸びる同じタワー群が繰り返され、空虚な背景、無居住の柱、都市としての地盤/低中高層構成を解決できていない。P2巨大リボンに対する解決として不十分。
- ULTRA 11.504秒：左右の塔基部・垂直壁が画面端を大きく占め、手前の物量だけが増えた。公共機能/人間規模/奥行きの読める都市ではない。見た目の近接圧迫を誤って美術改善と認定しない。

## 新P3の実測に基づく未解決安全問題

[P3真正計測CI #41183558390](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41183558390) **SUCCESS**、[Artifact #13036507375](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41183558390/artifacts/13036507375)。元14/28m×6時刻すべて、カメラeye/front/right/up、GLSL係数1.35、FOV v73.057711°/h94.141613°、全28動体の現在時点OBB投影データを取得。各フレームに画面と交わる「完全に近クリップ前のOBB外接箱」はおおむね**9～21基**。**これは実画素可視と異なる**。

P4 R0の遠景Road1地区A3は元路肩out176mに配置。現物理B51 `a13-machine-12` の6時刻での元OBB中心に**1本の建築基部のX/Zが近接**し、概算（建築半径45m＋動体XZ半径）で負の余裕（約-35m）となる。上下方向の建築物やOBBの正確なメッシュ干渉までは未検証だが、無害と証明できていないため**要修正**。

## P4 R1 直接修正契約

1. 遠景Road1-A3の建築を実B51から離すため本物の路肩外側へ退避。6時刻だけで安全と断定せず、実データで再検査する。
2. 17の似た姿の細い縦塔を削減、地区ごとに**大きく異なる非対称の居住建築マス・空洞・横幅・階層・立体テラス**を見せ、ロードの正面を「都市」へ改善。巨大な横架構や門の回帰は禁止。
3. Blenderから実GLB再出力、元WebGL2同12視点再撮影、P4 R0との実画像比較によってのみART判断。P3のOBB投影データを画素可視と混同しない。
4. main/Gold/P100/W9-X/B5/本番は不変。PR #46 Draft未マージ、正式ART採用0/Slope2 DNA認定0m、GAMEPLAY/HUMAN/PERFORMANCE/RELEASE/MERGE HOLD。

**結論：P4 R0は技術PASS、独立した美術REJECT。P4 R1はこの失敗を形状に直接反映する工程。**
