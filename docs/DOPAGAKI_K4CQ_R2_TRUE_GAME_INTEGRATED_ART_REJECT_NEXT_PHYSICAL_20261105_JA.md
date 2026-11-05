# DOPAGAKI SLOPE — HYPER RUSH / K4CQ R2 実ゲーム統合1場面：TECH PASS・直接ART REJECT
確定：2026-11-05 JST。**本書はK4CP完全引継ぎの固定方針を更新・破棄しない。** 新規のART正式採用や走行DNA認定は0。

## 1. 実際に行った制作
- 親研究HEAD `e66f71676fccf95bd68e30a51f536ded92844389` から、隔離研究ブランチ `research/k4cq-one-sector-native-playable-coast-20261105` を分岐。元K4CP研究枝・main・公式P101・Draft PR #46・Gold/原Slope/本番2サイトは変更しない。
- 既に真正R15S3D9として研究された**16m物理Road5+Road6候補**を改変せず再利用（元凍結Road5ではない。候補Road5 SHA-256 `39d66c47cfce3718871c5450f8594dfd10a2a31b7bbb70dd5634d1cb4c73922f`）。
- `scripts/p101-k4cq-one-sector-coast-geometry.mjs` で元 `surface.sample()` による実Road5のu=0.12～1.00と実Road6のu=0.00～0.36を連続した一場面として再著作。海水面・両岸地形・非衝突警告ライン・岸壁を実世界座標の可編集3Dにした。**新ゲームCollider 0、球/カメラ/操舵/240Hz/元28 B51の変更0。**
- 既存PRIVATE本物の `drive3d` レンダラを `dist-private/k4cq` にだけ隔離コピーし、2ケースのソース描画を行った。元原ゲームGit blob `af076d67492a677d2235e4730aef8cdf4808e106` 保護。
- 実ロード変更ではなく美術を実ゲームへ重ねた工程。**人間が遊べるようになったと主張しない**。

## 2. 真の実行結果と独立証拠
- 最新の成功run [Actions #42023232471](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42023232471) は **completed/SUCCESS**。研究コードの該当HEAD `51ff35469859582384b21eccf6ade29946de1ec3`。
- [Artifact #13411764422](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42023232471/artifacts/13411764422) は実WebGL2画像6枚、同一240Hz時刻の無加工2列比較3枚、監査JSON、ネイティブOBJ/MTLと実編集可能Blenderを収録。
- Ubuntu GitHub Actions実Chromium WebGL2 2セッション、58s/64s/67sにそれぞれ正規1/240s tick `13920/15360/16080` で停止、BASELINE対K4CQの**球・道路・HUD速度が一致**。実HUD速度 **171.1 / 178.5 / 186.6 m/s**を記録。物理接地Roadは58/64s `p93-PRISM_CREST-01`、67s `p93-FINISH_RIDGE-01`。オート操舵P96→P94、**NOT HUMAN**。
- 以前のPRIVATE研究ステージIDが`p75-survival.mjs`の記録キー規則に不適合だったため、双方の**研究コピーにのみ独立記録ID**を発行。元スコア/正式QAは変更せず、ブラウザ`jsErrors=[]`両ケースを確認。旧失敗runをPASSに書き換えない。
- 真Blender **4.0.2**で同じ著作OBJを読み、`K4CQ_EDITABLE_TRUE_SOURCE_COORDINATE_COAST_ART_HOLD.blend`別名保存成功。**4616三角形、OBJ由来の13848頂点、編集可能Mesh 1**。WebGL2候補の三角形数と独立一致。
- GitHub Actionと独立監査：圧縮Artifactを別取得してZIP全CRC正常、実物のPNG/Blender/JSON存在確認。これは**TECHのみ**。FPSはCIのSwiftShader/ソフトウェア条件に左右され、正式パフォーマンス合格としない。

## 3. 直接ART評価（R1→R2）
- 真の[同一時刻画像](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42023232471/artifacts/13411764422)を58/64/67sで直接観察。
- **R1**：高い単調灰色の崖が右半分を大きく閉塞、元Road5の終わりで世界が途切れ、地形形状も港用途も弱い → **ART REJECT**。
- **R2**：地形の高さを下げ、帯状の層・開口・水面・Road6への景観連続性を加えた。67秒の何もない背景は減った。ただし、画面はなお広く単調なネオン舗装が大半を占め、右はなお大きな平坦な斜面、海・港・道路の機能が一目で読みにくく、操作の選択・急旋回・危険回避のドラマがまだ生まれていない。**R2もART REJECT。**
- これは物理レーンの**面白さを改善した証拠ではない**。3時点のスクリーンショット・可視画素・成功CI・多い頂点を、プレイ合格へすり替えない。

## 4. 失敗の原因と次の唯一の進路
- 背景ARTを2回書き替えても、**ゲーム画面を支配する元の直線的走行ラインが変わらない**。巨大片面を低い巨大片面に替えるだけでは世界水準に届かない。
- **ここでK4CQ背景R3/R4を作らない**。次は同じ1区間で独立PRIVATE物理Road5研究コピー（別候補ID/独立SHA）へ進み、(i) 高速でも制御判断が必要な**実曲率・カント・下り高低差**、(ii) オリジナル28 B51との**本物の動的位置・近接危険**、(iii) 本物のCameraでの**予告・見通し**、(iv) 真240Hz自動走行と真正Chromium・画像直接比較、を**一つのプレイシーン**として製作・評価する。既存のP96/Runner/Playwrightを再利用し、新しい監督器や背景小物は量産しない。
- 研究候補が安全な連続操舵を実証できない場合はゲーム正式QA/ART/HUMANへ昇格させず、失敗原因に対する一回の明確な改修か候補破棄。ユーザー側の通常操作は0回。
- **不変ゲート：正式ART採用0件、Slope2 DNA認定0m、HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。** Work/Computer Use、追加課金、本番公開、merge、原本変更、正式採用は都度個別事前承認。

## 5. 失敗runの履歴を隠さない
- R1最初 [#42020265526](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42020265526): ステージファイル名不一致、FAIL。修正後 [#42020468725](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42020468725): R1 TECH SUCCESS/ART REJECT。
- R2途中 [#42022053336](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42022053336)～[#42022939695](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42022939695): 期待ID不一致、旧ステージ記録ID不正、私的スクリプト構文不正などを確認して修正。**それぞれFAILのまま保存**。
- R2最終 #42023232471: 技術成功。**ART REJECT・HUMAN HOLD**。

本書を次回の単一追加正本とし、K4CP元完全引継ぎとその歴史証拠を継承。背景模型だけの工程に戻らない。
