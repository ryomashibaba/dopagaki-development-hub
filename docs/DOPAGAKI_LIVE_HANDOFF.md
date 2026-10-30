# DOPAGAKI SLOPE — LIVE HANDOFF（R19 A1、2026-10-31 JST）

**最上位目標は、美しく巨大な未来都市の中を人間が気持ちよく操作する実物理Slope2系高速ゲーム。** A0で真正12秒の14m狭路を確認、現在はA1で同じNative 240Hz tickと本物の元WebGL2カメラを照合中。R18の不採用都市量産は停止し、GAMEPLAY×ART共同設計へ転換済み。

## 絶対に破らない境界
元WebGL2ゲームファイル web/p101-w9c2-g4e7ci-integrated-streetscape.mjs Git blob af076d67492a677d2235e4730aef8cdf4808e106、元240Hz CCD、球半径.65m、B48実道路7・B51実動体28、元P96/P94/A13合法操作、RAWカメラ・HUDを不変。Gold/W9-X/B5/P100/main/本番を変更せず、研究ブランチ p101-velocity-overdrive-native-trial のDraft PR#46だけでPRIVATE実験。透明床・救済、偽finish、勝手な製品公開禁止。

## R19 A0 真正確定
[修正済Actions #41131784122](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41131784122)全工程SUCCESS。元0秒スポーンで12秒2,880tick走行、CONTROL 28m/ULTRA 14mともrunning、B48 road0→1まで接地、元B51接触0。ピーク116.742/115.519m/s、狭路コアは4.404秒、警告の初観測1.104秒で計測上の余裕3.300秒。ULTRAは真補間道路幅13.159〜14m、概算路端最小1.743mで、人間QAが必須。既存G5B 4,608三角形は同スポーン320mの静止的元WebGL2表示に成功したが、0〜12秒の本物の高速走行画像ではない。原Artifact #13013401969。ART採用0件、Slope2正式認定0m。

## R19 A1：今の実作業
- PRIVATE元ゲームそのものをコピーして dist-private/r19a1 のみに差分を挿入する scripts/p101-r19a1-private-original-native-camera-pack.mjs（本体/Goldは不変）。
- scripts/p101-r19a1-six-true-native-matched-camera-frames.mjs：本物の元B48幅28/14m × G5B OFF/ONの4セッション、各6つの**native tick 265,721,1057,1249,1921,2761**で本物元Canvasをスクリーンショット、24枚の真画像をNative A0の同じtickの球XYZ（0.08m以内）・速度（0.05m/s以内）・ロードIDで厳格に検査。本人の手動操舵ではなくP96スクリプトが再現する。
- 元28 B51のカメラFoV投影候補と実物理的な形状距離を記録するが、遮蔽/実画素視認/HUMANの認証はしない。
- scripts/p101-r19a1-independent-24-native-frame-gate.mjs は各PNGのbytes/SHA256と偽成功4条件を独立検査、原本はPlaywrightが削除しない r19-evidence に保存。
- 真正[専用GitHub CI #41133092902](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41133092902) はこのhandoff更新時点で実行中。前回 #41132919104 は元物理ではなくPRIVATEレンダラにカメラ検査コードを挿入する際の文字列検索ミスで失敗し、修正済み。現在の最終CIの成功や撮影24枚をまだ確認していない以上、SOURCE TECH PASSを宣言しない。
- 技術・美術ゲートと現工程の正本：[R19 A1設計・真実性監査](R19_A1_NATIVE12S_REAL_WEBGL2_SAME_TICK_B51_CAMERA_GATE_JA.md)。

## 次にすること
CI最終結果を確認→失敗ならPRIVATE挿入コードか本物Native不一致の根因を修正し再検査→成功なら24本物Canvas元画像を同tickで視覚比較、実B51カメラFoVと遮蔽を明確に区別する→**1つの新都市＋本当の細道を同じ代表区間で高品質に同時設計するA2**。次のNative/HUMAN/FPS/ARTは正式別ゲート。コース全体の完成目標は7,280m約52秒、Slope DNA2,912m、認定0mのまま。

**GAMEPLAY/HUMAN/ART/PERFORMANCE/RELEASE/MERGE HOLD、正式ART 0、正式Slope2 0m。**
