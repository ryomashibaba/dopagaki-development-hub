# R19 A6 P4 R2D-A — 本物の彫塑建築・全240Hz空間ゲートTECH PASS、美術REJECT

**基準：2026-10-31 JST。** 元ゲーム保護／Draft PR #46は未マージ。[真正GitHub Actions #41190775304](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41190775304) **全SUCCESS**。[原Artifact #13038926937](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41190775304/artifacts/13038926937) を実取得・展開して、Blender編集可能ファイル、GLB、12元画面、JSONで監査済み。初回R2D試行#41190471423はPython構文不整合、次#41190573155は出力filepathの変数上書きで失敗。原因別に直接修正して成功。**失敗CIを成功と偽らない。**

## R2D-Aの実測技術判定

- Blender 4.0.2の元5編集可能メッシュを真正GLBから読み込み、5地区の彫塑形状へ置換。**Blender面15,438／GPU三角形31,764**、元ソース面10,566から+4,872面。各幅ULTRA14m/CONTROL28mで編集可能BLEND・GLB各1、実WebGL2 Canvas6×2=12/12。
- 建築の区画ごとに異なる輪郭の彫塑造形：西側Crescent、Forum、Garden、Road0 Habitat、Marketの5地区。8/9/9/9/11件の主形状と低層塊。各地区7件の実3D基礎・ステップ、6件の独立ギャラリー床を作る。**人間が歩ける3D公共機能・内部建築・実地盤支持は一切認証していない**。
- 14m/28m両幅、元0〜12秒の**2,881 native ticks×元28 B51**、各80,668身体・時刻組み合わせ、合計161,336の瞬時OBB照合。実GLB三角形との13軸SAT交差**0件**、原JSON `failures=[]`。元A0球XYZの最大差0.0007703576m。元GitBlob `af076d67492a677d2235e4730aef8cdf4808e106`、元B48×7/B51×28・元カメラ/HUD・240Hz・main/本番無改変。
- 注意：240Hz離散tickでの非干渉は**連続時間での数学的掃引認定ではない**。背景の視覚遮蔽・人間操作・FPS/モバイル性能・地盤接地・公共機能はHOLD。

## R2Cとの真正同一カメラ美術比較

元P3 `r19a6p3/P3_ultra_...ORIGINAL_NO_CITY_CAMERA_B51_WEBGL2.png`を建築なし基準に、同じ元ゲーム1013×698、ROI `x202..809/y140..319`、RGB最大絶対チャネル差>36の画素比率を計算。**これは建物の正確な画素占有率ではなく参考色差**。

| 時刻 | R2Cの参考ROI差分 | R2D-Aの参考ROI差分 |
|---|---:|---:|
| 4.404秒 native1057 | 21.67% | 17.17% |
| 8.004秒 native1921 | 35.35% | 26.86% |
| 11.504秒 native2761 | 23.70% | 29.46% |

- 4.4秒：箱の長い列は減ったが、代わりに塊の無地の岩が並んで見える。
- 8秒：中央の大きな単色の碑／岩柱が複数。街区密度・窓や層・公共機能が無く、**中央ROIの景観変化もR2Cより小さい**。道路視界は維持しているが魅力的な街ではない。
- 11.5秒：大きな背の高い碑が画面左から突き上がり、画面には変化がある。しかし現実感ある都市生活・低中層のつながり・建築内部・照明・材質は欠如。
- **ART REJECT**。新しい曲面・非対称性の導入を、真の美しさや住める都市の完成とは認定しない。

## R2D-B 直接修正、同じ全契約で再検証

成功のR2D-Aソースを基に、(1)実3Dを持つ厚みのあるファサード・窓の層、(2)複数の高さの外部床と陰影、(3)Road1主役区画の中低層別棟を5→8へ増加、を**Blender形状に直接追加**。ひとつの無地モノリスと画面に見えない足元の広場だけでは不適切なため、視覚的に用途が読めるように再構成。ただし窓はまだ**非PBRの装飾メッシュ**で実室内・人間の出入りの証明ではない。

[R2D-B専用Actions #41191352574](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41191352574)でBlender・独立GLB読み込み・元12画面・B51の全2881点を別途実行。**R2D-Aの成功結果をR2D-Bに流用しない。** 実画像が改善しなければR2D-BもART REJECT。

## 正本境界

正式ART採用0件／Slope2 DNA正式認定0/2912m。R2D-A TECH PASS／ART REJECT、R2D-B判定待ち。GAMEPLAY/HUMAN/PERFORMANCE/RELEASE/MERGE HOLD。PR #46 Draft・未マージ、main/Gold/P100/W9-X/B5/本番無改変。
