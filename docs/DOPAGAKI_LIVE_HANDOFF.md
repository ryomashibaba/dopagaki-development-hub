# DOPAGAKI SLOPE — LIVE HANDOFF（R18 P3真正ART不採用→R18 P4道路接地型都市実制作、2026-10-31 JST）

**最新HEADとGitHub Actionsを優先。チャット全文を読み直さない。**
再開時：本ファイル→`PROJECT_STATE.md`先頭→[最新詳細監査](G4E7DZ_R18P3_ART_REJECT_AND_R18P4_REAL_ROAD_GROUNDING_JA.md)→真正CIの実結果。

## 絶対の保護
品質/ゲーム性/美術優先、INTEGRATED VERTICAL SLICE。元`web/p101-w9c2-g4e7ci-integrated-streetscape.mjs`の Git blob `af076d67492a677d2235e4730aef8cdf4808e106`、元240Hz CCD/r=.65m、実道路B48×7/動体B51×28、正規P96/P94/A13操舵、RAW camera/HUDを不変。main/Gold/P100/本番URLに変更なし。研究は`p101-velocity-overdrive-native-trial` Draft PR #46に限り、PRIVATE非衝突背景のみ。マージ・公開・透明床・磁力・自動操舵・偽finishを禁止。

## 前工程の確定実績
- **R18 P3真正 SOURCE TECH PASS**：[Actions #41081325468](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41081325468) SUCCESS。2世界×元D15R1/新A/B＝6真正WebGL2セッション、36枚Canvas PNG SHA個別36/36一致。新A/B×2世界の本物Runner `finished`と元`finishEvents=1`は4/4。偽認定10/10拒否。元Artifact #12990212624（ZIP SHA256 `96c7ba05fddca46ef8354680d5294e07ddfdb3efa74d1edc4f6a9e9733b4d2b6`、2026-11-06期限）。
- **R18 P3 A/BともART REJECT**。真正元Canvasの54・58秒は遠景の箱群、61〜64秒は唐突に頭上へ来る浮いた巨大建築、67秒は黒い空白。元B48と街区の地盤がつながって見えない。実原本の三角形数はA4,200／B3,036。合成ステージの三角形数は異なるので混同しない。
- 原因の一つを幾何コードから特定：R18P3の基準は真の道路Y+100m、主要基礎`bottom=-59m`なので**路面Y+41mに建築下端を置いた**。これだけが全ての原因とは断定せず、都市空間の形態・光・画角も分離する。

## 今回のR18 P4開発
- **R18 P4は元B48の道路の高さへ視覚上の都市街区を再配置**。`scripts/p101-r18p4-original-road-grounded-urban-fabric.mjs`で元road5/6の各8位置、計16の沿道街区と主役1を実3D生成。建物下端を**実B48 source road Y-2m**へ統一、街区は元路面中心から約40〜100m横に置く。衝突は0・架空ドライブ床は作らない。これは実際に歩行/走行できる都市ができたという保証ではない。
- 形状別2案：`A_GROUNDED_TRANSIT_BOULEVARD`（交通駅を中心とする大道路沿い都市）／`B_CARVED_GARDEN_DISTRICT`（開放庭園と公共施設が連続する低層街区）。3D元Stage全JSON不変・基礎Y検査・偽ソース拒否を実装。
- PRIVATE元WebGL2 pack`scripts/p101-r18p4-private-grounded-original-webgl2-pack.mjs`、6ケース元240Hz Runner`scripts/p101-r18p4-six-real-source-webgl2-runs.mjs`、独立PNG SHA＆偽成功拒否`scripts/p101-r18p4-original-webgl2-independent-art-gate.py`、専用unit`tests/p101-r18p4-road-anchored-3d-original-source.test.mjs`、Windows1クリック`scripts/R18P4_PRIVATE_ORIGINAL_GROUNDED_CITY_ONE_CLICK.cmd`。
- [R18 P4真正CI #41128954286](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41128954286)：最新確認では**元source SHAと正規7B48/28B51形状テストPASS、PRIVATEビルド実行中**。未完了CIの原finish・真正PNG・ART PASSを断言禁止。結果が出たらArtifactから元画像を取得し両世界×54/58/61/64/67秒で前作と直接比較して厳しく美術判定すること。

## 正式判定
R18 P3正式ART A/B REJECT、R18 P4正式ART HOLD。**正式ART採用0件・Slope2正式認定0m。** HUMAN/GAMEPLAY/PERFORMANCE/RELEASE/MERGEは引き続きHOLD。真正自動Runner完走≠人間のゲームプレイQA≠ART合格≠Windows実GPU FPS。
