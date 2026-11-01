# DOPAGAKI SLOPE — R19 A6 P4 R2F5-D 真Native Blender配置・真正2幅画像・独立ART REJECT

**2026-11-01 JST / 研究ブランチ `p101-velocity-overdrive-native-trial` / PR #46 OPEN DRAFT 未マージ**

## 1. 判定

**SOURCE/NATIVE WEBGL2 TECH PASS（限定）／ART REJECT。正式美術採用0件、Slope2 DNA認定0/2912m。** 技術PASSは3Dモデル生成・検証済み2幅ソース画面に限定。正式B48/B51安全・人間の利用・体感やFPS、配信・マージの証明には使わない。

- [新正規Actions #41290765902](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41290765902)：**全job SUCCESS**。R2F5-DのNative Blender・インデックスGLB再読込・真正WebGL2 14/28m 2画像・証拠保存の各step SUCCESS。新コミット `d927f7cbcebc8859f6ffeda8237e69534933009a`。
- [原Artifact #13077252682](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41290765902/artifacts/13077252682)：ダウンロードZIP **19,476,270 bytes**、実ZIP SHA256 `d056da19883025f2c9376d5a01aa639f9c4ec7dd62c40d2afa672d4a331ab064`。原Artifact内82ファイル、R2F5-D固有11ファイル。真BLEND×2、GLB×2、GPU buffer×2、Blender report×2、元WebGL2 PNG×2、native report×1。
- 元ゲームsource Git blob `af076d67492a677d2235e4730aef8cdf4808e106`、元カメラ、元球240Hz、7 B48、28 B51、HUD・本番・Gold/P100/W9-X/B5・main無変更。追加collider0。
- **比較元** [R2F5-B Actions #41286633222](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41286633222) の原Artifact #13074894706、ZIP **15,426,877 bytes**、SHA256 `f07d6b0f6992966721c569f55edf0abfc5c1b0cd9013d24961afdc8e423a0215`。真正8.004秒の両画像を直接抽出し、新2画像を実見・画像SHA照合した。

## 2. 正真正銘の変化

**変更したのは8.004秒側のR2F5-B Native Blender建築のみ。** 元Road1 `u=.100`／左エッジ35m → `u=.125`／45m。11.504秒側の元 `u=.350`／35m は維持。Native部品63・支持柱／屋根接続計算上隙間0.0m・edited Blender faces 22,562・正規GLB GPU三角形44,788、どちらの道路幅でも元GLB上限<50,000を維持。

元tick1921の元source native WebGL2画面2枚のレポート：source球位置誤差（ultra **0.0003056m**、control **0.0004554m**）、速度誤差（ultra **0.0004633m/s**、control **0.0002750m/s**）。2枚とも元物理・カメラ・B51状態を照合してPNG SHAを原Artifactから独立確認、browser errors=[]。

**元画像SHA**：ultra `d9fe0f1cdabb628b5b83447989d76f1d07cc03add407b7fa1725297aa2c4aa1f`、control `7880ae1ed06dc3e54b3479e5be2e30c481a3af5ff8f04e9fd9aa92077352f6e4`。

## 3. R2F5-B → R2F5-D 元画像の真ピクセル比較

同じ元8.004秒、実1013×698、14m/28m別々、RGB各画素最大チャネル差>36の割合を直接測定。色差はART品質ではない。

| 比較領域 | ultra 14m | control 28m |
|---|---:|---:|
| 全1013×698 | 2.02270% | 2.00417% |
| 左建築ROI x0..369/y200..479 | 13.80502% | 13.67857% |
| 中央道路ROI x355..824/y290..619 | 0.00000% | 0.00000% |
| 建築近景ROI x0..339/y235..334 | 42.06471% | 41.67941% |

新R2F5-DのBlender実頂点投影bbox（画像への幾何学投影、真ラスタマスクではない）：

- ultra：x **104.72–299.81px** / y **257.68–317.20px**、見かけ縦 **59.52px**。
- control：x **95.74–296.60px** / y **257.44–318.45px**、見かけ縦 **61.02px**。
- 旧R2F5-C全建築の保守的立方体射影は縦 **90.90/93.42px** と予測していたが、**真建物の頂点bboxは約60px**。R2F5-Cの全形包絡は安全側の配置代理で、建築の実際の視覚的大きさを保証しないことを再確認。

## 4. 独立美術審査：REJECT

**正の進展**：以前は画面左端で途切れていた市場施設が、画面左前方に実際の描画として収まり、屋根／柱の一部分も認識可能。原物理・速度・カメラに依存した見せかけの改善ではない。中央道路比較ROIに画像差がない。

**本質的な不足**：走行者視点では施設は依然として小さな低い屋根2つ／単純な壁と柱の集合に見え、駅・市場としての内部奥行き、屋外公共地盤、街区と繋がる建築の一体感が読めない。元8秒の超未来都市らしい圧倒的構図・人間が使う都市の生命感は不足。再配置による画像差が生じただけで建築デザイン自体は旧R2F5-Bと同一。両モードとも**ART REJECT**。正式美術採用0件。

**次に不要な反復**：u/オフセットを数mずつ変える再探索、屋根/柱/発光色/材質係数/ポリゴン数だけを増やす反復、真画像を見ずに投影面積だけで合格、旧R2F4-DのB51 161,336組0交差の流用。

## 5. 次の工程 R2F5-E（設計ゲート、未実装）

**元のままのsourceカメラに映る一棟の「高低差のある実都市交通・市場コンコース」へ形態を再設計**。実支持構造と屋内外導線、視覚的に異なる交通機能／人の滞在領域／遠景都市への接続を、BLEND内のまとまった立体マスと開口で表現する。薄い屋根2枚ではなく、見える内部奥行き・上下階・本物の地盤への着地関係を最優先。ただし実地盤接地/実歩行は検証するまで不明とする。

制作と審査の段階は次の順序：

1. 14m/28mで元8.004秒の**実カメラ**から、建築の主要立体・開口・公共地盤が十分な画素寸法で読み取れる設計スケッチと投影ゲート。3Dで成立しない絵だけの採用禁止。
2. 既存1棟の実Blenderソースを**直接**組み替え、元の44,788/50,000 triangle規約を破らない。旧B・Dは別原本として残す。地盤との支持と道路横断のない局所アプローチを形で検証する。
3. 新GLB生成・元240Hz WebGL2 ultra/control×8秒の**まず2画像のみ**で批判的ART判定。旧B/Dと同一画像条件比較。中距離で駅市場の実内部／都市らしさが読めなければART REJECT。
4. ART候補として価値が証明されて初めて新モデル固有の元B48静的三角形、B51×全0..2880tickの離散3D SAT、時刻間連続CCD、実B51ラスタ視認、Windows/iPhone FPSとHUMAN QAへ進む。旧モデルの安全PASSを流用しない。

**CURRENT: TECH限定PASS / ART REJECT / GAMEPLAY HUMAN PERFORMANCE INTEGRATION RELEASE MERGE HOLD / PR #46 Draft 未マージ / 本番公開禁止**。
