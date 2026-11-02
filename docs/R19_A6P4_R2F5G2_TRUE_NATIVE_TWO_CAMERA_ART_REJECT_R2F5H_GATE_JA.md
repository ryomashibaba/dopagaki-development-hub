# DOPAGAKI SLOPE — R19 A6 P4 R2F5-G2 / 真Native Blender・1921tick両幅2画像・独立ART REJECT

**2026-11-01 JST／正本 `p101-velocity-overdrive-native-trial`／PR #46 OPEN Draft未マージ。**

## 結論

**G2: 元A1カメラ幾何の予備ゲートはPASS／真正Native Blender・GLB・WebGL2 TECH限定PASS／独立ART REJECT。** 正式ART採用0件・Slope2 DNA 0/2912m。元ゲームの原物理・本番変更0。新G2モデル固有のB48/B51安全・CCD・実地盤・人間歩行・Windows/iPhone FPS・本番/マージは**全部HOLD**。

## 1. 実行済みエビデンス

- [非本番G2実装`e1c8cbbb`](https://github.com/ryomashibaba/dopagaki-development-hub/commit/e1c8cbbb03427f62ab8dbf5a39033f0a8162bac9)：元G2投影器 `preselectedGeometryOnly=G2_SUNKEN_COURT_AND_TRANSFER` を実行で検査し、旧R2F5-B/D/E/FソースSHA固定の実Native Blender建築を独立 `r19a6p4r2f5g2` に生成。元Road1 `u=.125`／左道路端45m、旧11.504秒の制御施設はそのまま。
- [真正GitHub Actions #41299372268](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41299372268)：**全job SUCCESS**。旧A/B/D/E/F/元240Hz・B48×7/B51×28の回帰、実G2 Blender両幅、独立GLB読み戻し、元カメラの真正1921tick WebGL2 PNG×2枚、元FとのPNG SHA/ピクセル差を実行。
- [正規Artifact #13080348046](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41299372268/artifacts/13080348046)：GitHub Actions ZIPダウンロード後**31,509,900 bytes**、独立SHA256 `0708347c8bd7f5a768f85d02d81d872112c8edd44bdb44a454712c00c1c1362e`。**119ファイル／G2固有12ファイル**（Blender真BLEND2、GLB2、audited GPU2、Blender JSON2、PNG2、WebGL2 report1、F比較JSON1）。
- Native Blender **58部品・edited faces 22,432**。GLBの独立GPUバッファ **3,208,896 bytes／44,568 triangles**（14m/28mで同数、インポータ<50,000制限PASS）。新物理Collider0、元球・カメラ・原source Git blob `af076d67492a677d2235e4730aef8cdf4808e106`不変、元B48×7/B51×28、main/Gold/P100/W9-X/B5・2本番サイトに変更なし。
- 元1921tickの真WebGL2、`errors=[]`。画像SHA256 ultra `bff79877c22f757c1c8667e15c411c947e2164235a1e04afeb2b7d60768aab81`、control `26e624ceaf7933f5bfcbaca06995554663536c2050e64a8e7721b003b68cf319`。原球XYZ差 ultra **0.0003055836m**／control **0.0004554248m**、速度差 ultra **0.0004633m/s**／control **0.0002750m/s**。

## 2. 両幅の真カメラ×G2幾何学結果

旧F→G2、元の **8.004秒、1921tick、1013×698、WebGL2、14/28m別々**で比較。幾何投影BBoxは**実建築の頂点射影で、遮蔽・見通しの認定ではない**。

| 指標 | 14m ultra | 28m control |
|---|---:|---:|
| G2実頂点BBox x | 111.25–300.42px | 102.55–297.24px |
| G2実頂点BBox y | 250.88–318.29px | 250.45–319.58px |
| G2投影高さ | **67.41px** | **69.14px** |
| 旧F投影高さ | 81.65px | 83.78px |
| F→G2 RGBチャネル最大差>36・全1013×698 | **1.22123%** | **1.28346%** |
| F→G2 RGB差>36・左施設ROI 0..369/200..479 | **8.33494%** | **8.75965%** |
| F→G2 RGB差>36・中央道路ROI 355..824/290..619 | **0.00000%** | **0.00000%** |

**画像差と投影高さでART認定しない。** 中央道路ROI差0は元B51の視認性や新メッシュの衝突安全認定を意味しない。

## 3. 独立ART REJECT：以前の問題を別の形で再発

実際の2枚を直接観察した結果、旧Fの**一面暗い巨大壁・大きな屋根**はG2で解消。より細長い開いた道路外景観になった。しかし走行者から約105m/sで見ると、**左前方にある異なる小型の駅舎風の2個の独立した建築と、細い低床部品**という印象が強い。市場カウンター/改札/乗換通路の用途、前景の公共地盤から奥へ人が移動できる一体感、都市への接続は画面上で判読できない。元G2幾何代理 `openingWidthPx約63–64` がPASSでも、**真正3Dモデルの開口と実ラスタの認識サイズを保証しなかった**。

- Fは「巨大壁」、G2は「二つの小箱」。両者の中間を細かな数値で繰り返すだけでは目標の未来都市の都市的説得力に到達しない。
- 分離した施設の間の通路が実使用可能か、実道路と接地しているかはGLB生成だけでは証明されない。表示上の手摺/階段は物理的な歩行実証ではない。
- 本フェーズの証明は**元ゲーム物理で走る真正画面に見えること**まで。人間が走れること・体感で良いことの証明はなし。
- **ART REJECT**。正式ART0件・Slope2 DNA0m。旧R2F4-DのB48/B51旧メッシュ安全証拠をG2に流用しない。

## 4. 次R2F5-H：真画面からの認知性評価へ軸足を移す

次に大きいBlenderモデルを増やす反復は中断。『200×70px前後の景観から用途を一瞥できるか』という**本当の表示上の問題**を、元カメラの**元1921tickに加えて近傍複数時点の短い連続再生と、実3D構造の前後遮蔽**から調査する。

1. 元の正しい240Hz速度・カメラのまま、8秒前後の複数原画を時系列で撮影。静止1枚の個別代理だけで「読みやすさ」を合格させない。まず新モデルは作らず、F/G2の表示が何フレーム・どの程度実視認されるか、施設の形態・色・距離を観察。これを小規模の再現可能な研究工程として準備する。
2. 重要な機能は2〜3の大きな建築的合図と**視線に対して奥まで抜ける空間**へ集約する。小さい店舗カウンターの増殖、偽の発光、単に屋根を巨大化する案を禁止。元ゲームの道路/元物理/カメラ/球は固定。
3. Hの視認研究結果により、同一場所の微修正を継続するか、より広い都市景観設計に設計対象を再設定すべきかを明確に判断。元カメラの1瞬で200×70px程度に留まる単独建物を何十回も作る効率低下を防ぐ。
4. **ART候補としての質が証明された時だけ**新GLB専用B48正規厳密静的・B51 2モード×28×2881tick SAT、tick間CCD、B51ピクセル可読性、Windows/iPhone FPS、実人間走行へ。合格未達なら本番・mainマージは禁止。

**CURRENT: SOURCE/NATIVE/TRUE WEBGL2 TECH限定PASS｜ART REJECT｜HUMAN/GAMEPLAY/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD｜PR#46 Draft未マージ。**
