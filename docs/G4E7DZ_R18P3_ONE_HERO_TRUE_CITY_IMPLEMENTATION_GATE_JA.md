# R18 P3 — 一つの巨大公共都市を主役にした真正3D造形・実WebGL2検証ゲート

**基準 2026-10-30 JST。R18 P2 A/B ART REJECTからの抜本再設計。SOURCE TECH:R18 P3真CI検証中／ART:HOLD／HUMAN・GAMEPLAY・PERFORMANCE・RELEASE・MERGE:HOLD。**

## 設計方針の不変条件

先行P1は線画のような孤立アーチ、P2は約3万三角形の反復シェルと鋸歯状のスクラップ化。両方不採用。新P3では「5時刻×5巨大建築」方式を完全停止。**主役1体・前後に連続する低い街区4役・退出時の固有スカイライン1つ**とする。

- 真正R18 P0カメラ・元座標5地点の**時刻基準だけ**を維持：road5 u=.18 (+240m)、u=.48 (-120m)、u=.91 (-120m)、road6 u=.30 (-240m)、u=.78 (-120m)、鉛直+100m。元R15S3D15と一致する右方向`[-forward.z,0,forward.x]`。
- 主役はroad5 u=.91の**単一の巨大な公共建築**。前の54/58秒は低層地区→主役を認識、61秒は中央空洞・建物の外形、64秒は交通地区と元路面の見通し、67秒は退出後の街区へ接続。美術上の成否は実PNG直接目視を必須。
- A `A_CRESCENT_CIVIC_ATRIUM`：幅のあるC字型公共街区外皮と本当の開いた中央アトリウム（半径約79mの中空部、外半径約142m）、階高が変化する5帯の巨大一体的な主役。
- B `B_CARVED_TRANSIT_CITADEL`：互いに異なる高さ・勾配を持つ二つの大きい駅街区を挟んだ明確な屋外峡谷。1本の上部公共デッキ。Aの色違いではない。
- 4つの補助地区：入口街区、接近のブールバード、別道路の交通前庭、退出時の低いスカイライン。基本の建物形態は主役より小さく、壁・空中フレーム・同形巨大ビルの反復を防ぐ。道路中の偽の走行面や透明衝突床は設置しない。長い連結の嘘を避け、500m以上など世界座標で不自然なエアブリッジは除外する。視覚上の接続は歩行可能な都市・実都市機能の証明ではない。

## ソース・QA

- 新実装：`scripts/p101-r18p3-single-landmark-city-architecture.mjs`。元B48/B51`sample()`から実XYZ/RGB三角形出力。Stage document JSON全体が不変、衝突追加0、主役1・補助地区4・出口1・開放空洞1をテスト。実3Dの数量は原カメラでの美術認定とは無関係。
- PRIVATE original WebGL2：`scripts/p101-r18p3-private-original-webgl2-city-pack.mjs`。旧D11真正レンダラーを隔離複製し、`dist-private/r18p3`のみ新背景を置く。D15R1対照、main/Gold/P100/本番元ソースは一切上書きしない。
- 真正6ケース×6画像、2世界D15R1対照・新A/B、正規54/58/61/64/67秒と各終端・原240Hzスクリプト操舵。PNG個別bytes SHA256、真正`finished`・`finishEvents=1`、10件の偽認定拒否を専用独立Pythonで再実行。[R18 P3 CI](https://github.com/ryomashibaba/dopagaki-development-hub/actions/workflows/p101-r18p3-original-webgl2-single-landmark.yml)。
- Windowsローカルプレビュー`scripts/R18P3_PRIVATE_SINGLE_LANDMARK_ONE_CLICK.cmd`はユーザー手動QAの操作を簡略化するためのソース。Windows真正RTX GPUで実行・評価した証拠はまだない。

## 合否と次の決断

元ゲームの真正PNGを時刻で比較するまで、**ART PASSを宣言しない**。54秒遠景でランドマークが読めるか、58秒に奥行を保つか、61秒に巨大建築の空洞が実質的に見えるか、64秒にB51/路面を隠さず通過できるか、67秒の街区の連続性が生じるか。遠景に見えない/視界が遮られる/箱の反復やスクラップ化が改善しないならART REJECT。

不変：`web/p101-w9c2-g4e7ci-integrated-streetscape.mjs` blob `af076d67492a677d2235e4730aef8cdf4808e106`。元7 B48・28 B51・240Hz CCD・球半径0.65m・P96/P94/A13合法操舵・RAWカメラ/HUD、main/Gold/P100/本番維持。PR #46 Draft/open/未マージ。正式ART採用0件・Slope2認定0m、HUMAN/GAMEPLAY/PERFORMANCE/RELEASE/MERGE HOLD。
