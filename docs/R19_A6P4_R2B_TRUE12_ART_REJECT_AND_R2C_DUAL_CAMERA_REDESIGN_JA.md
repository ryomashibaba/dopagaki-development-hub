# R19 A6 P4 R2B — 真12画面TECH PASS／実美術REJECT、R2C二時刻配置への修正

2026-10-31 JST。**R2B真正[GitHub Actions #41186791512](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41186791512)全SUCCESS。** [原Artifact #13037362073](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41186791512/artifacts/13037362073)の真正編集BLEND/GLB、元GLB30,088 GPU三角形／Blender14,424面、14m/28m×6元240Hz Tick=**12/12真正WebGL2写真**とB51・元A0物理12時刻照合を確認。実B51 OBBと背景建築三角形の両幅×6時刻の瞬時交差0。**R2Bについて全2881 tickのSATは未実施**であり、R2Aの全時刻PASSを流用しない。

## 真正同一カメラ実画像の美術診断

- Road0 4.404s：都市核をRoad1 u=.30左路肩外270mへ移したことで、道路遠景の左側に都市が現れたが、箱の反復・材質・生活街区の欠如は残る。
- Road1 8.004s：R2Aの右奥にわずかに見える都市から、R2Bでは**左中央の立体的な街区群が大きく見える**ように変わった。
- Road1 11.504s：**悪化**。R2Aでは右〜正面に建物が広がっていたのに対し、R2Bでは主役建築がカメラ左後方へ抜け、正面の都市が空白に戻った。この場面の反省は「8秒のみの正面を最大化し、11.5秒の市街区を削ってはならない」。

実画像の参考・再現可能な数値診断（この比較では旧P3の真正元ゲーム**建築なし**WebGL2 Canvasを参照、同一1013×698px、ULTRA14m、RGBいずれかの差が36超の画素の比率をROI `x=202..809, y=140..319`で算定。画像差分の割合であり都市建築だけの正確な可視画素占有率ではない）：

| 本物の元時刻 | R2Aと建築なし元画面の大きな色差 | R2Bと建築なし元画面の大きな色差 |
|---|---:|---:|
| Road0 4.404s（tick1057） | 9.13% | 18.70% |
| Road1 8.004s（tick1921） | 5.60% | **29.26%** |
| Road1 11.504s（tick2761） | **32.40%** | **0.00%** |

評価：R2BはTECH PASS／**ART REJECT**。ゲーム画面の改善を一場面に偏らせた。

## R2C：既存元P3カメラで前方2時刻を両立させる直接修正

R2B主役都市核（Road1 u=.30 / 左out270m／都市7マス）は8秒の正面街区として維持。そこに将来のカーブ以降まで市街区の軸を延ばすため、P4 R2 Blender 5地区のうち別の二地区を**元Road1の左側へ直接移動**：

- 第二地区 7マス：Road1右 u=.46／out219m → **Road1左 u=.47／out308m**。実カメラの概略投影は8.004s中央、11.504s左中央。
- 第三地区 5マス：Road1左 u=.83／out335m → **Road1左 u=.64／out267m**。8.004s右の中遠景、11.504s右中央。元のRoad1長手の連続した都市面を意図。
- 元Road0の2地区は変更なし。建物は非衝突装飾メッシュに限定し、道路・障害物・カメラ・Hud・240Hz球物理は変更せず。
- **R2Cの実造形・真正12画面/元B51 SAT結果は[独立CI #41189700048](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41189700048)の本当の完了で初めて判定する。** R2AやR2BのART拒否はそのまま維持。必要ならR2CでもART REJECTとする。

## 不変の出荷境界

元GitBlob `af076d67492a677d2235e4730aef8cdf4808e106`、B48×7/B51×28・元RAW camera/HUD・240Hz、main/本番/Gold/P100/W9-X/B5は不変。正式ART採用0件、Slope2 DNA正式認定0/2912m。PR #46 OPEN Draft・未マージ。HUMAN/GAMEPLAY/PERFORMANCE/RELEASE/MERGE HOLD。
