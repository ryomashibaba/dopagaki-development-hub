# DOPAGAKI SLOPE — R19 A6 P4 R2E-E1 → E2 2巡の真正Blender/WebGL2/元B51監査

**2026-11-01 JST／研究ブランチ `p101-velocity-overdrive-native-trial`／PR #46 OPEN DRAFT。**
**結論：E1・E2ともSOURCE TECH限定PASS、独立ART REJECT。** 初稿の巨大な平面屋根はE2で減ったが、目標の高度で一体的な超未来都市の建築美術には未達。正式ART採用0件、Slope2 DNA認定0/2912m。GAMEPLAY/HUMAN/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD。

## 1. 原本とソース境界

- **E1** [コミット `54d07c720086`](https://github.com/ryomashibaba/dopagaki-development-hub/commit/54d07c7200864150770f57eb1773651641291f49)、[真正Actions #41270654771](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41270654771)全SUCCESS、[Artifact #13069550680](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41270654771/artifacts/13069550680) ZIP SHA256 `f534c7296d23c53bc42e3417896a33ef4f8c40481e8cb48f0d64c2bf741475ca`、4,586,132 bytes。
- **E2** [コミット `5eae7d0e703c`](https://github.com/ryomashibaba/dopagaki-development-hub/commit/5eae7d0e703c1316452279164802a5676441cc78)、[真正Actions #41271119206](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41271119206)全SUCCESS、[Artifact #13068924481](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41271119206/artifacts/13068924481) ZIP SHA256 `38f66f71525f9dcdbd541f0710c09872c1ae795881b01aba0dbcd5723dd47940`、4,369,285 bytes。
- 両Artifactをダウンロードしたバイト列でSHA256再照合し、各24ファイル（真正WebGL2 PNG 12枚、編集BLEND×2、GLB×2、B51全tick JSONなど）を読込。原240Hz／B48×7／B51×28／RAW camera／入力・採点／元source Git blob `af076d67492a677d2235e4730aef8cdf4808e106`は不変。元ゲームへの新コライダー0。main／Gold／P100／W9-X／B5／本番2サイト無変更。

## 2. 真正技術計測

| 項目 | R2E-E1 | R2E-E2 |
|---|---:|---:|
| Blender real editable faces | 16,598 | 15,098 |
| native GPU triangles | 33,316 | 30,436 |
| real editable districts | 5 | 5 |
| use-zones | 22 | 22 |
| source-native WebGL2 14/28m×6tick | 12/12 | 12/12 |
| original 240Hz native B51×2881tick×2 modes | 161,336 | 161,336 |
| real B51 triangle×rotated OBB SAT intersections | 0 | **0** |
| appended colliders | 0 | **0** |

各検査は別の現行コミットとGLBに対して独立実行。SATは0..2880 tickの原B51動的OBBに対するGLB三角形の**離散時刻非干渉**であり、tick間の連続swept CCD、静的元B48道路の衝突、地形支持、歩行/避難動線、元B51実画素、手動プレイヤー認知、Windows/iPhone FPSは判定不能／HOLD。

## 3. 元WebGL2同一カメラ・同tickの本物の画面比較

比較はE1 vs E2の同一原1013×698 PNGから各RGB最大チャネル絶対差>36の画素率を算出。中央ROIはx202..809/y140..319。**画像差は形状の変化の証拠であって、美術採点・危険動体の可視率ではない。**

| 元カメラ時刻 | E1→E2 14m全画面差 | 14m中央ROI | 28m全画面差 | 28m中央ROI |
|---|---:|---:|---:|---:|
| 4.404s (Road0) | 3.211% | 19.191% | 3.075% | 19.001% |
| 8.004s (Road1) | 7.140% | 37.529% | 7.190% | 37.817% |
| 11.504s (Road1) | 8.861% | 47.164% | 9.295% | 46.119% |

**独立実見ART判断：**
- E1：前R2E-Dより大きな遠中景の建築量塊を実際に映した。ただし黄色い水平屋根・広い直方体風の平面壁が主役となり、少し変形した現代オフィス群に見える。8秒・11.5秒の両視点で「一体の都市」ではなく独立ブロック群に見え、**ART REJECT**。
- E2：各主シェルに実際の空隙と互いに傾きの異なる分割を作り、E1の一枚壁・平屋根の印象は明確に減った。8秒の左手前、11.5秒の左端には大小の分割が実際に映るため進歩を認める。
- しかしE2では分割された三角/台形の背の高い壁体が道路脇に孤立して見える。前景の厚い地盤と建築、連続街路、公共空洞、都市の人間規模・生活感・背景の関係が弱い。**「一枚壁→複数の変形ブロック」に留まり、一体的な超未来都市という最上位ART品質にはまだ足りない**。E2も **ART REJECT**。ユーザーに見せず正式採用・本番へ移してはならない。

## 4. 今後の修正方針：新しい箱モデル量産を止める

これまでの複数回のART REJECTは、コードの各地区・用途・建物数・ポリゴン数を最適化しても、**人が見たときの都市美術・奥行き・建築言語・景観連続性は保証されない**ことを示す。次R2Fでは次を先に実施する。

1. **最初に空間構図**：元4.404/8.004/11.504s真正3画面上で、道路/B51優先視野・主役都市核・遠景・開放空間・前景都市地盤を具体的な画面設計として固定する。建物を配置してから可視率を測るだけの逆順をやめる。
2. **3D形状の意匠を独立に審査**：明確に差別化した少数の非対称複合建築、段状実支持候補の一体地盤、歩廊・見通し・異なる公共機能をBlenderの編集可能メッシュで直接造り込む。画面に安易な押出箱・巨大門・空中帯・ラベルだけの公共機能が見えたら初期ART棄却。
3. **美術早期ゲート**：14m元3画面（4.404/8.004/11.504s）を最初にE2と並べて人間が比較。美術改善を認められない候補のために、新しい候補名/ワークフロー/幾何学の数だけのCIを増やさない。
4. **安全独立ゲート**：本物の改善案だけ、元source SHA、原BLEND/GLB、元全12カメラ、全161,336 B51離散SATを再実行し、**静的道路クリアランス／時刻間CCD／B51画素遮蔽／人間実走行／FPSを独立追加**するまでゲーム・人体・性能HOLD。
5. **Slope2 DNAを忘れない**：美術だけを完成扱いにせず、真正240HzのB48/B51実障害・自然ジャンプと操舵、公平な高速視野・人間走行を通して2,912m正式認定を目標とする。現時点0mを維持。

PR #46はOPEN/Draft/未マージ。原本・今回の失敗学習は正本記録へ残す。Workの使用には事前承認が必要であり、外注や勝手な本番公開は禁止。
