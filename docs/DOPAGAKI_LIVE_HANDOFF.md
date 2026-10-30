# DOPAGAKI SLOPE — LIVE HANDOFF / R18 P2 (2026-10-30 JST)

**本工程が最新**。前の文章が残っていても、常にこの先頭を優先し、PR#46の最新HEADと本工程専用CIの結論を更新確認すること。長いチャットは再読込しない。

## 永久保護の境界
QUALITY/GAMEPLAY/ART-FIRST + INTEGRATED VERTICAL SLICE。元真正WebGL2 240Hz CCD・ball r=.65m・元B48物理道路7・元B51動体28・元合法P96/P94/A13操舵・原RAWカメラとHUDを不変にする。元ゲームファイル `web/p101-w9c2-g4e7ci-integrated-streetscape.mjs` のGit blob `af076d67492a677d2235e4730aef8cdf4808e106`。main/W7F Gold/P100/本番を絶対変更せず、`p101-velocity-overdrive-native-trial`のPR #46 OPEN/Draft/未マージを維持。透明床、磁力救済、カメラ操作、偽finish、ARTの自己認証禁止。

## 最終技術確認済み
- R18 P1真WebGL2 [Actions #41075148883](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41075148883) SUCCESS。真正6ケース/36 Canvas PNGのハッシュ36/36一致、R18 P1新A/B×2世界の元Runner finish4/4、独立偽認定10条件拒否。元Artifact #12986898295は2026-11-06期限。原画像は旧D15R1と同条件54/58/61/64/67秒で実際に目視。
- **R18 P1 A/BともART REJECT**。遠景で細いアーチ＋小塔にしか見えず、近景にまとまりのある実都市の厚さ・公共空洞・街区の連続性がない。画素差が増えたという理由では認証しない。評価詳細は [R18P1 ART審査記録](G4E7DZ_R18P1_ORIGINAL_36_PNG_ART_REJECT_AND_R18P2_GATE_JA.md)。
- R18P0の真原カメラ2世界×5時刻の配置候補をR18 P2でも踏襲（road5 u=.18/.48/.91、road6 u=.30/.78、right=[-forward.z,0,forward.x]、54/58/61/64/67秒）。

## 最新実装：R18 P2
- 新3D生成 `scripts/p101-r18p2-sculpted-inhabited-megacity-source.mjs`。A `A_INHABITED_ESCARPMENT`は6層の大きな街区、実開放ファサードとテラス、非直方体の居住施設。B `B_HOLLOW_TRANSIT_SAILS`は厚みのある左右に分離した立体シェルと中空公共空間、居住体積。前R18P1の細いアーチを単に増やす案ではない。
- 隔離WebGL2元ゲーム `scripts/p101-r18p2-private-original-webgl2-volumetric-pack.mjs`。実6条件テスト、PNG SHA/各tick真finish独立QA、10偽認定拒否、元Stage doc不変・物理コライダー0の単体テスト。Windows研究版ワンクリック `scripts/R18P2_PRIVATE_TWO_VOLUMETRIC_CITIES_ONE_CLICK.cmd`。
- [R18 P2真正CI #41078746216](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41078746216) **実行中のため全体PASSやARTは未宣言**。このCIの画像を取得しA/Bと旧D15R1を原カメラで独立比較すること。詳細は [R18 P2設計と品質ゲート](G4E7DZ_R18P2_INHABITED_MASSING_EVIDENCE_AND_GATE_JA.md)。
- ART正式採用0件、Slope2認定0m。人間操作・Windows実GPU/FPS・本物B51の手動回避・元ゲーム全体の統合QAは未実施、GAMEPLAY/HUMAN/PERFORMANCE/RELEASE/MERGE HOLD。

## 最初に行うこと
R18P2専用CIのステータス、失敗ログ/Artifacts→成功なら真正36 PNG・元Runner`finish`4/4・本当の元Canvasを目視、リポジトリの評価と引継ぎを更新。原画像が悪ければART REJECT。次のコード改修はPRIVATEのみ、ユーザーの明示承認なしに本番やmainへマージしない。
