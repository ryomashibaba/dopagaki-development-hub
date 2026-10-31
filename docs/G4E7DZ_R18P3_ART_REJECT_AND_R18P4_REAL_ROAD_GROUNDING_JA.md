# R18 P3真正原WebGL2画像監査 → R18 P4元道路接地型都市試作

2026-10-31 JST。**R18 P3 SOURCE TECH PASS、A/BともART REJECT。R18 P4新PRIVATE実3Dは制作済み、元ゲーム真正CI・美術判定は検証中。**

## R18 P3の確定証拠

- [Actions #41081325468](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41081325468)の全工程SUCCESS。元WebGL2で旧D15R1参照と新A/Bの2世界×3案=6セッション。54,58,61,64,67秒＋元終端、計36枚の真正Canvas PNGを全て元証拠SHA256へ照合し**36/36一致**。真正RunnerのA/B×2世界の最終`finished`/各`finishEvents=1`は**4/4**。独立10件偽認定拒否。
- [原Artifact #12990212624](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41081325468/artifacts/12990212624)のZIPは**18,244,537 bytes**, SHA256 `96c7ba05fddca46ef8354680d5294e07ddfdb3efa74d1edc4f6a9e9733b4d2b6`、期限**2026-11-06 15:42:55 UTC**。別途会話内の元ZIPと2枚の実WebGL2比較画像に保存（GitHub恒久保管済みとは主張しない）。元の物理7 B48・28 B51、240Hz、元RAWカメラ/HUD/合法操舵は不変、新コライダー0。
- 実ブラウザの新都市三角形数はA `A_CRESCENT_CIVIC_ATRIUM` **4,200**、B `B_CARVED_TRANSIT_CITADEL` **3,036**。以前の合成Stageの4,440／3,276とは異なるので、**実原本データの値4200/3036**を正本にする。

### 真正元Canvas目視（2世界）

| t | Aの元Canvas | Bの元Canvas |
|---|---|---|
| 54 | 小さい箱・塔の塊だけが遠景に見え、巨大な主役の輪郭はない | 低い直方体の集合の輪郭。主役建築としては不明 |
| 58 | 幾つかの箱が浮いたように見え、道路と市街地のつながりがない | 幾つかの立体片が孤立し、公共空間が読めない |
| 61 | 上部で主役の丸い形が読み取れ始めるが、その下に街路が続かない | 上部に大きい破片的な塊が現れるが、2棟の間の都市的通路が不明 |
| 64 | 巨大な円弧状建物が頭上に突然現れ、道路を囲む日常都市というより空中の構造物に近い | 巨大な二棟が頭上に急に現れる。路面と支えの関係が読めない |
| 67 | 左右に小さい箱、通過後は広い黒背景。次の市街地への連続性がない | 同様に建物が散在し、退出時の連続地平になっていない |

**A ART REJECT / B ART REJECT**。以前の複雑な反復シェルが減った点は改善したが、根本の「元道路から離れた空中の建築」問題は残る。実画像上の美術・公共空間・B51の手動回避を認証するには不足。

### 補助PNG画素差（ART得点ではない）

同世界・同時刻の元D15R1 CanvasからRGB最大差>28、ROI x18〜82%/y12〜70%の各画素割合：

| World | Mode | 54 | 58 | 61 | 64 | 67 |
|---|---|---:|---:|---:|---:|---:|
| true-pinch | A | 3.92% | 10.32% | 24.01% | 38.54% | 30.10% |
| true-pinch | B | 4.56% | 7.54% | 17.48% | 32.02% | 31.20% |
| pinch-switch | A | 3.18% | 7.72% | 21.83% | 38.34% | 32.04% |
| pinch-switch | B | 3.68% | 6.79% | 18.52% | 32.27% | 32.33% |

これは画素の違いであり、可視都市面積率、遮蔽評価、安全性、美術評価スコアではない。

## 幾何学的な根本原因と次の抜本修正

**R18 P3 source:** `tangentFrame()`の建築基準点は元B48のサンプルY+`up=100m`。主要建築の`bottom=-59m`なので、`100-59=+41m`の位置に建物の下端を置いてしまい、路面との実際の空間的関係が成立しにくい。元カメラの真正PNGはその「浮いた建物に見える」印象と整合するが、41mだけが美術失敗の唯一原因とは断定しない。

**R18 P4は「5時刻×5巨大建築」の配置を完全にやめ、実際の元B48 `sample(surface,u,.5)`を直接採用して路面Yに根付いた連続街区を作る。**

- `scripts/p101-r18p4-original-road-grounded-urban-fabric.mjs`で元road5・road6の各8位置、計16の**低い道路沿い街区**を生成。道路中央から約40〜100m横に配し、物理の元道路には新規の衝突床や道路は作らない。小規模公共広場・短い周辺リンクと1つの主役を作り、実道路沿いの都市が続く印象を目指す。
- すべての実建築ボリュームの`baseY=-2m`（真の元道路`sample`から相対）、すなわち**元道路Yより約2m低い位置に基礎を設定**。旧R18 P3のように基礎を+41m宙に浮かす方式を破棄。道路の水平カーブや高低差は元サンプルを使い、未来都市が滑らかに視覚的に続くかは実画像で検証。
- A `A_GROUNDED_TRANSIT_BOULEVARD`：道路5の中間に交通駅街区を1つ設け、その前後を小規模で連続した市街地にする。
- B `B_CARVED_GARDEN_DISTRICT`：別形状の公共建築1つ＋開放庭園・緑の低層街区。単なるAの色替えは禁止。
- 新PRIVATE元WebGL2 `scripts/p101-r18p4-private-grounded-original-webgl2-pack.mjs`、元本物6セッション `scripts/p101-r18p4-six-real-source-webgl2-runs.mjs`、独立PNG SHA/10偽認定拒否 `scripts/p101-r18p4-original-webgl2-independent-art-gate.py`、元B48地盤Yと新衝突0を確かめる `tests/p101-r18p4-road-anchored-3d-original-source.test.mjs`を制作。
- [R18 P4真正CI](https://github.com/ryomashibaba/dopagaki-development-hub/actions/workflows/p101-r18p4-original-source-grounded-city.yml)を登録。合成Stageでの補助生成はA 5,088三角形/B 4,904、街区16・真の基礎相対Y=-2m、コライダー0。**本物の元ゲームにおけるSOURCE TECHおよびART認定ではない**。専用CI結果と元画像実確認を必須とする。
- Windowsの独立1クリック研究プレビュー：`scripts/R18P4_PRIVATE_ORIGINAL_GROUNDED_CITY_ONE_CLICK.cmd`。手動操作・Windows RTX GPU性能・B51の人間回避は未確認。

## 絶対不変と合否

保護元ソースblob `af076d67492a677d2235e4730aef8cdf4808e106`、元240Hz CCD/r.65m/B48×7/B51×28、P96/P94/A13/元RAWカメラ/HUD、main/Gold/P100/本番URLは変更禁止。PR #46のDraftを維持、マージ禁止。GAMEPLAY/HUMAN/PERFORMANCE/RELEASE/MERGEはHOLD。正式採用ART0件／Slope2認定0m。描画量や合成テストだけでARTを通さず、元ゲーム真正WebGL2の54・58・61・64・67秒を厳密に見ること。
