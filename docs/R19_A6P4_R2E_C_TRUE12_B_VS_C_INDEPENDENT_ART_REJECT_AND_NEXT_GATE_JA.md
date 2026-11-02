# DOPAGAKI SLOPE — R19 A6 P4 R2E-C 原本直接監査・正式ART REJECT

**監査日：2026-11-01 JST。** 開発ブランチ `p101-velocity-overdrive-native-trial`、起点HEAD `e57489b62715857db6d0d8c59b3dfb9b94ad16a3`。PR #46 はOPEN/Draft/未マージ。本番・main・Gold・P100・W9-X・B5、物理・操作・HUD・RAW cameraには変更を加えない。

## 1. GitHub Actions原本の独立確認

- R2E-C [Actions #41266597018](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41266597018)：元ソースチェック、Blender 4生成、GLB再読、元WebGL2の14/28m×6時刻真正12枚、元B51瞬間・全2881tick SAT、Artifact保存が全SUCCESS。
- R2E-C [Artifact #13067775684](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41266597018/artifacts/13067775684)：ZIP SHA256 `95c8dcbd1274d53dcac34900f6624c8fc9e95669ecb8dc3b1bc0d32978a861e1`（取得バイト列で再計算一致）、全24ファイルを確認。失効予定2026-11-08 02:50:57 UTC。
- 比較用R2E-B [Actions #41193208028](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41193208028)、[Artifact #13039852952](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41193208028/artifacts/13039852952)：ZIP SHA256 `676403ac58fdac8028c208845f411b4acf05ef39a9d236df06ac039233ed2fc9`、同条件の12枚とB51 JSONを独立読出し。

R2E-Cは元ゲームGit blob `af076d67492a677d2235e4730aef8cdf4808e106`、元240Hz、B48×7、B51×28、追加コライダー0。元カメラ真正画像12/12の各SHA256は同梱REPORT JSONと一致。元球XYZ差最大0.0007703576m／速度差最大0.0004716m/s（元実行とレンダQAのログ間差で、物理改変を示すものではない）。

## 2. 実Blenderメッシュと元B51物理

| 項目 | R2E-B | R2E-C |
|---|---:|---:|
| Blender faces | 18,438 | 18,848 |
| 独立GLB GPU triangles | 36,876 | 37,696 |
| 5地区の建築プログラム | 22 | 22 |
| 新規分節街路 | 0 | 35 |
| 新規低層街路沿い量塊 | 0 | 20 |
| 元2,881tick×28 B51×2幅 | 161,336 | 161,336 |
| SAT検出3D交差 | 0 | 0 |

R2E-Cの道路1地区間のリンクは13+13モジュール、各地域の局所街路は3+3+3モジュール。専用JSONの `totalTriangleOBBIntersections=0`、`sampleContactB51Bodies=0` を実読。これは**離散240Hzスナップショットの回転OBB×GLB三角形SAT**に限定され、連続時刻のswept CCD、B51の画素可視、静的実道路メッシュ干渉、地盤接地、実歩行、人体、Windows/iPhone性能の証明ではない。各項目HOLD。

## 3. 実画像比較 — R2E-B vs R2E-C

両Artifactの1013×698 PNGを、各モード・同一元tickで開いて左右比較。下表は各ピクセルRGB最大チャネル差が36を**超えた**割合で、建築の見える面積や美術品質点ではない。中央ROIは x=202..809、y=140..319（608×180 px）。

| tick / 元時刻 | 14m全画面 | 14m中央ROI | 28m全画面 | 28m中央ROI |
|---|---:|---:|---:|---:|
| 1057 / 4.404s（Road0） | 0.313% | 2.019% | 0.311% | 2.007% |
| 1921 / 8.004s（Road1） | 0.334% | 1.725% | 0.332% | 1.742% |
| 2761 / 11.504s（Road1） | 2.085% | 6.041% | 1.887% | 5.982% |

**原画面の直接観察：** 4.404sと8.004sは旧版の孤立した建築群が主要構図を占め、新街路はほんの小さな低い遠景量塊として現れる。11.504sで道路左側に追加の色ブロック・細い公共街路帯が見えるが、ひと続きの成熟した市街地や歩行者の居住圏として読めない。街路の実メッシュ連結は確認しても、それが元ゲームカメラから都市の連続性を獲得したことにはならない。実画像上の道路中央とHUDは旧版と同様に残るが、**人間のB51認知・高速操作は別途未審査**。

**独立美術判定：R2E-C ART REJECT。** SOURCE TECHは検査済み範囲でPASS。ただしART採用0件、Slope2正式認定0/2,912m。GAMEPLAY/HUMAN/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD。本番公開禁止。

## 4. 次の実制作ゲート — 同じ方針での直接修正

1. R2E-Cの失敗を、さらに同型の小建物や装飾を増やして補わない。元Road1 8.004sと11.504sの真カメラが**ともに**捉える、中景の立体公共核と基盤の一体感を優先し、4.404s Road0の狭路・危険予告を遮らないこと。
2. 現スクリプトはRoad1の新規35m以下の分節街路と低層塊を配置したものの、道路外側の建築に比べて画面上のスケールが不足。元source `road0/1`アンカー、6真正カメラとB51動体の実座標によって、描写可能な実3D「支持基盤→開いた歩行者の街路→中低層→公共核」を再設計する。**遠近の推測だけで道路へ近付けない**。
3. まず元真正カメラの3重要時刻の試作画を比較して、R2E-Cから明らかな立体都市の改善がない場合は同じBlender造形を修正する。TECH QAを水増ししてART改善の代替にしない。
4. 構図が改善した後、14/28m×6時刻真正画像、元source blob、元B48×7/B51×28、全2881tick×28×2幅SATを**新造形で再実行**。元R2E-CのPASS転用は禁止。
5. 地形支持・実歩行・実画素B51・人間手動走行・Windows/iPhone FPSを独立ゲートとして維持し、公式ART・GAMEPLAYなどへ昇格させない。

旧単純箱・薄い皿板・吊り高架・巨大門・横断リボン・偽床・磁力・速度偽装は禁止。毎回新規専用CIを増殖させず、既存R2E-Cテスト経路を再利用する。採否が決まるまでPR #46はDraft/OPEN、本番無変更。
