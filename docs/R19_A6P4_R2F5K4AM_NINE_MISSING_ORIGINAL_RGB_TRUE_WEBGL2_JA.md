# DOPAGAKI K4AM — K4ALで判明した9欠測RGBを元真正WebGL2だけで補う（ART HOLD）

基準日：2026-11-03 JST。研究ブランチ `research/k4aj-native-b51-gpu-depth-contiguous-window-20261103` の隔離研究。**元ゲームsource、球半径0.65m／240Hz／camera、B48道路7、B51障害物28、main、本番2URL、元モデル、継続Draft PR #46を変更しない**。Work無断使用なし。正式ART採用0件、Slope2 DNA認定0m。

## 具体的に解消する不足

K4AL [真正RGBカバレッジ監査](R19_A6P4_R2F5K4AL_ORIGINAL_RGB_EVIDENCE_COVERAGE_AND_ART_FIRST_JA.md) で、K4AK要求15時点のうちK4AJ真正RGBの既存撮影計画が覆うのは6時点と判明。K4AMは**その残り9時点のみ**、元K4AIで証明した真正240Hzネイティブposeと1対1に照合して元source WebGL2の独立RGB画像を追加する。

|幅|追加予定tick|計|
|---|---|---:|
|14m ultra|11326, 11338, 11349, 11351, 11363|5|
|28m control|11265, 11277, 11284, 11301|4|
|合計|両幅、元source native poseの同一時点のみ|**9**|

各tickは**元RGB／元B51 BODY全28体の研究用視覚mask／元へ復元RGB**の3枚を真正Chromium WebGL2で保存する。計**27PNG**。同じtickで3回ずつ元meshの同期GPU深度読戻を行い、元/mask/復元の**生11,176点配列×27回**を保存し独立監査で各配列SHA、順次seq、原72draw→群mask44draw→原72draw、元深度復元一致、maskによる「近い深度」発生0、元sourceの球・camera視線をK4AI元721tick/幅の真データと数値照合する。

**重要：** 27枚・27 readbackはこの工程の**取得計画**。CI成功・Artifact全件実監査前に完成・TECH PASSと記載しない。元Source画像のcaptureは240Hz物理tickに対応するが、**実時間240fpsの動画ではない**。B51全28体のgroup mask寄与を単体`p95-hazard-12`へ帰属してはならない。K4AGで個体別GPU寄与が元tick11280に限り確定している事実は変えない。

## 実装済みコード・技術ゲート

1. [K4AM元Chromium捕捉](../scripts/p101-r19a6p4r2f5k4am-genuine-original-nine-rgb-gaps.mjs)：K4AI成功生JSONをSHA固定、凍結元source／元Cameraと描画を不変更、3元WebGL2カラー＋3元mesh GPU深度で各9tickを取得。失敗時はraw errorsのままHOLD。
2. [K4AM独立監査](../scripts/p101-r19a6p4r2f5k4am-independent-nine-rgb-depth-audit.py)：K4AI真sourceの球/eye/frontと照合し、元/mask/復元の実PNG SHA・bytes／限定CSS外の元RGB一致／GPUのフル整数配列SHA・mask単調性・復元・seqを独立再計算。元K4ADの厳格画像差分関数（HUD以外の元3D画素差0許容）を再利用する。
3. [合成E2E＋改ざんテスト](../tests/p101-r19a6p4r2f5k4am-independent-native-rgb-depth.test.py)：9tick×27PNG・27GPUを合成し9種類（偽ART採用、時点欠落、seq重複、mask不正近深度、GPU配列SHA改ざん、復元改ざん、未検証単体ID帰属、元球偽座標、元PNG改ざん）を拒否する**テストコード**。合成成功は実Chromiumデータの正しさを保証しない。
4. [専用CI](../.github/workflows/p101-r19a6p4r2f5k4am-original-nine-missing-rgb.yml)：一つの研究ジョブにsyntax・保護源SHA・合成負例・K4AI真Artifact SHA・真正Chromium捕捉・独立検証・ZIP Artifact登録を統合。K4AJとK4AKの`paths`対象外・concurrency別・`cancel-in-progress:false`。元の連続pushキャンセルを繰り返さない。

生K4AI JSON SHA-256=`e04c9990ebc2573467e8d95cd3e497a7a6059a9f12384f46507c3c1dfdc0eb60`、元source Git blob=`af076d67492a677d2235e4730aef8cdf4808e106`。継続PR #46及びmainは変更しない。

## 成果の解釈と止めどころ

- 先行K4AJ 8元RGB時点の**うちK4AK要求との重複6**＋K4AMで独立に追加する**9元RGB時点**＝**将来のK4AK要求15時点**、ただし両CI真正完走とPNG証拠監査が揃ったときだけ「元RGBカバー15/15」の可能性を検証できる。
- 元RGBカバー15/15になっても**候補側の新3D・候補RGBの同一カメラA/Bは0**。Road5《斜裂公共峡谷》はART-FIRST研究設計**1方向、モデル0**のまま。元RGB画素の有無だけで公共空洞3層可読性や独立ART採用を宣言しない。
- K4AJ生GPUのSHA/CRC・真正深度99tick/100ケース、K4AK実packet、K4AL/AMの画像SHAを別々に監査。成功時にだけ合算し、既存失敗K4/K4R/K4UのART REJECTを覆さない。
- HUMAN・7道路/B51×両幅の新造形SAT・CCD・Windows/iPhone FPS・ART・RELEASE・MERGE全HOLD。偽高速化・元操作変更・本番公開禁止。

**初期状態**：K4AMコード・負例テスト・独立CI・日本語正本を研究ブランチに保存。専用Actionsの実行結果、元27PNG、元GPU27本、生Artifact ZIP SHA/CRCは今後のGitHub実測で判定する。CIがqueuedの場合はSOURCE GPU/ARTをPASSにしない。
