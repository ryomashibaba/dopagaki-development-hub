# DOPAGAKI SLOPE — R15S3D14 真正3Dの大規模都市核とR1居住街区・美術品質ゲート

**基準日：2026-10-30 JST。** 研究用`p101-velocity-overdrive-native-trial`、[Draft PR #46](https://github.com/ryomashibaba/dopagaki-development-hub/pull/46)。保護元ゲーム`web/p101-w9c2-g4e7ci-integrated-streetscape.mjs` blob `af076d67492a677d2235e4730aef8cdf4808e106`。main/Gold/P100、本番サイト、元Runner/CCD/合法P96/P94/A13、原B48道路7本・移動B51 28基・原カメラ/HUDの改変禁止。正式ART採用0件・Slope2 DNA正式認定0mのまま。

## 1. R15S3D13R1を採用しなかった理由

前R15S3D13R1は[Actions #41017399399](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41017399399)真正WebGL2・7条件28実PNGで元Runner `finished`4/4。Aの空間開放は改善したが、道路脇に長い側壁・線状の外殻が連続して「大きい道路構造物」以上の都市が見えずART HOLD。Bは細い骨組みの反復が増えて都市の統一感を失いART REJECT。ここからの装飾足しは停止。

## 2. R15S3D14：主役の巨大都市核を3つ、元道路の実XYZに設計

`scripts/p101-r15s3d14-monumental-inhabited-hollow-crescents.mjs`を新作。今までの「道路両側の連続壁」を完全に引き継がず、真の物理面`sample()`で路面5/6の前方・左右位置を取得し、3つの異なる規模と役割の**巨大三日月型の本物の3D外殻**を生成。各外殻は表面・裏面・内面・支柱を持つ三次元三角形、中央には本当に空いた約147m以上の空洞。路面縁から少なくとも約67.74m離し、非衝突背景としてだけ描画。路面/障害物/原カメラに構造物を混ぜない。

- **A_TIDAL_CRESCENT_CITADEL**：5,652実三角形、3大空洞、12公共デッキ。視界に現れる実寸大の象徴的建造物の一体感はR1より改善。**しかし巨大な輪だけが暗い空間に浮き、背景の街区・生活圏・通過体験が足りないためART HOLD、正式採用不可。**
- **B_CANTILEVERED_SKY_COMMONS**：5,232三角形、同じ3大空洞・12公共デッキ。細部形状は異なるが、実画像ではAとの差が弱く「建築と街」を成立させる新方向としては不足。**ART REJECT**。

真正[CI #41041624933](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41041624933) **SUCCESS**、[全24枚と独立QAの原本Artifact #12970791757](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41041624933/artifacts/12970791757)。元R1 A比較×2世界、新R14 A/B×2世界の計6真正元WebGL2セッション、58秒13920tick・64秒15360tick・67秒16080tickの元RAWカメラが一致。**新4条件で元`finished`・原`finish`イベント各1・最終実路面に接地**。独立QAで10種の偽認定を拒否。これをART/HUMAN/本番統合PASSと取り違えない。

## 3. R15S3D14R1：実画像批評を受けた居住都市研究

R14 Aの一体化した巨大三日月の外殻を保ちつつ、`scripts/p101-r15s3d14r1-real-inhabited-hollow-city-districts.mjs`で別途**実際の15層の三次元公共テラス、環状公共街区、空いている居住中庭、下層連絡構造**を元3つのランドマークの外側に形成。道路脇の壁を復活させず、街区は元道路縁から外側の位置に限定。A_INHABITED_CRESCENT_DISTRICTS / B_DEEP_CIVIC_TERRACESの二つの面構成を本物のGLSL WebGL2に実装。建物が「生活できる」とは証明しない。公共空間の可視性・重なり・障害物の遮蔽・人間操作は別途必ず検証。

真正6条件・両世界の元物理+正規RAWカメラを同時刻で照合する[CI #41042937428](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41042937428)を実施。**R1の最終美術・実走行判定はCI完了と実PNG原本の直接目視まで保留**。CI実行中を「成功」と呼ばない。

## 4. 次の採否ルールと大方針

最優先は「圧倒的に美しい超未来都市を本物の高速ゲームで走ること」。画像に見える象徴性・公共空間/住居の密度・大規模構造の一体感・接近→内部通過→退出の時間設計、実B51の視認性を分離して評価する。単純なポリゴン増加、空洞数の増加、正規Runnerの自動完走のみでは正式ART/人間GAMEPLAY認定禁止。

完全な本番導入、PRマージ、保護元B48/B51/物理、通常の`main`、ユーザーの本番URLは**一切変更しない**。Windows PRIVATE比較一括実行は`scripts/R15S3D14R1_PRIVATE_REAL_INHABITED_CITY_ONE_CLICK.cmd`（ユーザー実機での動作は未検証）。


## 5. R15S3D14R1 真正本番元ゲームの成功と、実画面での厳格な不採用

- **真正最終CI [#41044411374](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41044411374) SUCCESS**／[元GLSL WebGL2・24実画像・独立QA Artifact #12972097319](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41044411374/artifacts/12972097319)。6条件（R14参照×2世界、R14R1 A/B×2世界）、正規RAWカメラの元240Hz 58秒・64秒・67秒と終端、元`finish`イベント4/4、7実B48・28実B51、独立QA 10/10の虚偽認定を拒否。新PRIVATE browser dependencyに元R14真3Dモジュールが不足していた初回CI [#41042937428](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41042937428) はFAIL、配布時に基礎モジュールをPRIVATE内へ実際にコピーして後続の3回（#41044316356、#41044353424、#41044411374）SUCCESS。元物理・原ソースは未変更。
- A_INHABITED_CRESCENT_DISTRICTS：7,920実三角形、36真空洞セル、15公共テラス層。技術的な巨大都市部材の追加と実WebGL2描画は成功。**画像の決定的な問題**：元64秒と67秒では新しい層の大半が画面右端・大円の内側に並び、ゲーム中央の遠景は暗い空と細い線のまま。正規画面で一目見て「壮麗な住める未来都市」とは言い難い。**Aは比較研究用ART HOLD／正式採用禁止**。
- B_DEEP_CIVIC_TERRACES：7,668三角形、61空洞セル。追加層の形が前景に薄く反復し、Aに比べて劇的に良い構図ではなく、暗い遠景の問題を解消しなかった。**B ART REJECT**、現形状への更なる窓・色・細部装飾は禁止。
- 正規画像だけでは**遮蔽の無さや人間の回避可能性は証明されない**。実B51の事前警告は元ゲーム実情報のままで、遮蔽・未来衝突・画面サイズは未認定。CIのSwiftShader性能もWindows実機FPSではない。
- 全R14/R14R1で正式美術0、正式Slope2 0m、HUMAN/GAMEPLAY/PERFORMANCE/RELEASE/MERGE HOLD維持。

## 6. R15S3D15 設計作業の軌道修正：実カメラの遠景投影を先に証拠化

繰り返しの失敗は「3Dメッシュの数と構造がある」ことを確認しても、**車速170～190m/sの真正正面カメラで主役が視野中央に入ることが担保されていない**点。次は3D制作の前に、元WebGL2の`viewForPose()`が実際に計算したeye/front/right/upと球位置を**PRIVATE読取専用**で観測し、R15S3D11実道路5・6にサンプリングした候補座標のスクリーン投影を元GLSLの`1.35*dot()/aspect/z`通りに比較する。

- 制作済`scripts/p101-r15s3d15-private-actual-raw-camera-probe-pack.mjs`、`scripts/p101-r15s3d15-source-native-project-true-landmarks.mjs`：元source private `drive3d`を隔離複製し、元RAW camera計算値をDOMへ観測だけで公開、54/58/61/64/67秒で元2世界の原native球を0秒から実走、実B48アンカーの画面中央/上下/前方距離をJSONと真正WebGL2 PNGに保存する。これは配置診断であり**新建築の美術PASS・遮蔽検査ではない**。
- [Actions R15S3D15ワークフロー](https://github.com/ryomashibaba/dopagaki-development-hub/actions/workflows/p101-r15s3d15-original-webgl2-camera-frustum-anchor-audit.yml)での実結果・原PNGを確認して初めて主役建築の中心配置を確定する。
- その後の実形状は「視野中央の遠景で大きな主輪郭→接近時の住居/公共デッキと空洞→退出後の街の眺望」がそれぞれ明瞭に異なる**時間構成**にする。都市をまた道路端に置く・固定の建物を3つ描く・デッキ面を増やすだけに後退しない。元の7 B48/28 B51、物理/RAWカメラ/速度、B51早期予告は一切変更不可。
