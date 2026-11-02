# R15S3D17 — 道路上の実カメラ時間構成を重視した新2都市（PRIVATE 原本保護）

2026-10-30 JST。R15S3D16R1の真正36枚審査でA/Bとも美術REJECT（遠景の小塊→頭上棚群）になったことを受け、同じ円形天空島の詳細化を停止して、新規造形原本を実装した。

## 現時点の事実・出所

- 作業ベース：GitHub Draft PR #46、`p101-velocity-overdrive-native-trial`。新工程最初のコミット `c3392f463a6c4e414fa8c5ea8e57d07b34cb4e40`。CI対象の新ワークフロー導入コミット `21f189a33564648668073d7f9813faf0620865c2`。
- 新形状：`scripts/p101-r15s3d17-roadside-civic-architecture.mjs`。元B48道路5 u=.78・道路6 u=.62をサンプルした局所座標から構築。元doc不変、元7 B48/28 B51必須。すべて実頂点XYZ+RGBの真正三角メッシュだが**新規コライダー0**。実道路へ繋がるように見える都市は**歩行可能・交通接続済みの認定ではない**。
- **A_OBLIQUE_CIVIC_EXCHANGE**：道路左右の大型公共交通施設・ひとつの非対称斜架・低層公共体積。道路上の巨大不透明屋根板や円形多層島の反復は使わない。
- **B_SPLIT_STATION_COURTS**：開いた中庭を持つ左右の異なる駅街区、上層をつなぐ大型アーチを持たない立体彫刻。Aと別の造形文法。既存D16より単に建物数を増やす方式ではない。
- `scripts/p101-r15s3d17-private-real-webgl2-civic-pack.mjs`：元D11 WebGL2真ランナーから隔離複製を生成し、元デフォルトやD15R1対照を上書きせず、新都市のみ排他的に背景描画。対象 `dist-private/r15s3d17/`。
- `scripts/p101-r15s3d17-original-webgl2-six-camera-runs.mjs`：元D15R1対照×2世界、R17A/B×2世界、計6セッション。54/58/61/64/67秒の元240Hz exact-tickと本物の終端イベントを記録し、原カメラ/WEBGL2 Canvas+HUD PNGを撮る。
- `scripts/p101-r15s3d17-independent-original-webgl2-gate.py`：同時刻証拠照合、原道路/元動体の数、真正`finished`、誤ったclaims10件拒否、実PNGバイトのSHA256とサイズ・画像寸法を個別照合。実画像の面積差だけでARTをPASSにしない。
- `tests/p101-r15s3d17-roadside-architecture.test.mjs`：2世界の物理ステージ不変、異なるXYZ、否定ケース・原物理変更禁止。
- 正式実行：[R17 CI #41062687304](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41062687304)。このレポート作成時、元blob/新3D静的テストはPASS、真正WebGL2実行結果は未確定。**後から必ずCIの実際の結論・Artifact・元完走を確認すること。**

## 正式採用ゲート

1. TECH：元Blob `af076d67492a677d2235e4730aef8cdf4808e106`不変、元CCD240Hz・球0.65m・合法操舵・7 B48/28 B51・RAWカメラとHUDが真正。
2. ART：実ゲーム画面54/58/61/64/67秒で、巨大施設を遠景で認識し、接近で公共空間の階層が読め、通過の抜けがあり、退出後に新風景へ接続。画面上端だけの棚・都市壁・短冊反復をREJECT。数値/三角形数/自動完走は美術点にならない。
3. GAMEPLAY：実B51の遮蔽と正しい予告、実道路の曲率・障害物・回避経路の見通し。元ランナー自動完走はHUMAN PASSではない。
4. HUMAN/PERFORMANCE：Windows実GPU、ユーザー手動操作とFPS、B51回避を別途測定するまでHOLD。
5. 公開と本番：PR #46 Draft維持、main/Gold/P100/本番URL/元ゲームソースへの変更禁止。正式ART採用0件、Slope2認定0mのまま。

次に行うことはR17真正CIの実画像原本とログを見て、２案それぞれART HOLD/REJECT判定を更新すること。**根拠なしのPASSは禁止**。
