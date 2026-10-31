# R19 A6 P4 R2A 真Blender・元WebGL2・全2,881物理tickの厳密審査

**2026-10-31 JST。R2Aは技術PASS／美術REJECT。** [Blenderと12画面の真正Actions #41186356391](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41186356391)全SUCCESS、[原Artifact #13036978998](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41186356391/artifacts/13036978998)をダウンロードして実3D・元描画Canvasを確認。

## 検証済みの測定値

- 本物の元A5 GLBをBlenderへ取り込み、**5地区、29の独立建築マス**を持つ別の低中層街区へ造形。編集可能BLENDとGLBをULTRA14m/CONTROL28m各1、Blender面**14,424**／独立GPUパーサー**30,088三角形**。元Blenderソース10,566面との差は+3,858面。
- 原240Hz球・B48×7・B51×28・元RAWカメラ/HUDを保護。14m・28m×6 native tick**12/12真正WebGL2 Canvas**で元の画面にGLBが出現し、差分あり。A0球元XYZ最大差**0.0007703576m**。PBR、地盤支持、建築利用、人体動作やFPSは未検証。
- [B51全native240Hz独立掃引CI #41186681731](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41186681731)全SUCCESS。[全時刻データ原Artifact #13037146231](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41186681731/artifacts/13037146231)を回収確認。本物のGLB**30,088三角形**×元B51全28基×2幅について**0～12秒・2,881tickずつの13軸SATによる回転OBB実3D交差0**。各幅28×2,881＝80,668の動体時刻を計算、検索した三角形候補累計3,139,813（64m空間インデックス）。**これは元240Hz離散tickの全点、実時間の数学的に連続した掃引判定ではない**。実画素危険認知とは別。

## 本物の画面での美術結果

R1／R2Aの元240Hz同一6tick画像を比較。
- 4.404秒：R1の門柱・縦塔の反復は低層化したが、背景は暗く、街区というより遠くの小さな箱に見える。
- 8.004秒：**最重要の失敗。** R1で左にあった大きな塔塊を除去したが、R2Aの都市が**右の遠景に小さく集中**し、左と中央の将来都市が空白になった。物理・3D交差PASSをART改善と混同しない。
- 11.504秒：R1で左を覆った巨大塔壁がなくなり、低中層街区が道路の先へ見える。具体的なART改善はある。ただし市街区の材質・公共機能・人間スケール・遠景シルエットの品質は不十分。壁面の多色繰り返しは玩具／積み木状に見える。

**ART REJECT**。技術PASSは美術採用ではない。

## これを受けて制作中のR2B直接修正

本物のA1／P3カメラの投影から、Road1の8.004秒に中央左へ都市を映しつつ、11.504秒には左前景の巨大壁にしない位置を抽出。元Road1 u=.30, **左路肩外側270m**の建築底を8.004秒の画面NDC `x=-0.232,y=0.184`、120m高点を`x=-0.241,y=0.473`へ投影（元カメラ眼・前方・GLSL係数1.35、近クリップ未交差。実全メッシュ画素ではない）。11.504秒には元カメラの左に外れる（投影中心x=-8.052、8s/11.5s撮影位置が異なる）。これに基づいて**主役区画をRoad1 u=.54→.30／左外側208→270m**へ直接再配置し、建築壁面のチェック柄を抑制、屋根の斜面に非対称性を追加。

[R2B真正CI #41186791512](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41186791512)で新Blender・元カメラ12画面・元B51 6tick SATを再検証。**結果が出るまでR2BのTECH/ART認定はない**。全240HzのR2A PASSをR2Bに誤って引き継がない。R2B 12画面確認後、R2Bで2,881tick検査も実施する。

元GitBlob `af076d67492a677d2235e4730aef8cdf4808e106`不変、元物理境界・本番/main/Gold/P100/W9-X/B5保護。PR #46 Draft未マージ、公式ART採用0件/Slope2 DNA認定0/2,912m、GAMEPLAY/HUMAN/PERFORMANCE/RELEASE/MERGE HOLD。
