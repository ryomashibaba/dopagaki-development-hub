# K4CD — 真正K4CCを親にした沿岸旅客船と水辺のDCC作者工程

記録：2026-11-05 JST。**これは独立研究であり正式ART採用は0件、Slope2 DNA正式認定0m、WebGL2/HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。**

## 継承した結果と目的

K4CC修正版の真正Blender [Actions #41922703441](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41922703441) は completed/SUCCESS。Artifact #13367744605（ZIP全体SHA256 `1f7bc744e798b236c568cbd36b4e9ad49e7711c0fcbbf403d7ebf1c441e434d9`）を再ダウンロードしてZIP全CRCと編集可能原本/PNGの個別SHAを独立照合済み。真正Blender親原本 `K4CC_COASTAL_RELIEF_EDITABLE_DCC_ART_HOLD.blend` は273,477,600 B／SHA256 `4fcd20db998696c270df95f624fed1a229ae2703322c180de1f3bfbc15abd6da`。直接画像比較では左地形の接続が改善した一方、中心の灰色道路が広く、右港は用途の読めない模型群である。**K4CC TECH PASS／ART REJECT**。

次K4CDでは、同じ元CHASEの右港を世界の中の使われる港に近づけるため、A3から引き継いだ本物の乗船スロープ終端を位置拘束として**単一の実際に3Dの沿岸旅客船と連続した水面**を研究Blenderで作る。単なるランダムな箱・遠景のビル量産ではない。

## 実装済み／ソース保護

研究枝 `research/k4cd-real-ferry-waterfront-hero-20261105` は前K4CC `ca42b57a9415a9ba55703f38412c412f1f80acb4` から分岐した。新コード `scripts/p101-k4cd-authentic-marine-ferry-sea-hero.py` と専用Workflow `.github/workflows/p101-k4cd-authentic-ferry-native-art.yml` を研究枝だけに追加。

- **実幾何**：湾曲した船首と船体チャイン/キールを持つ可編集船殻、細くなる船首デッキ、台形の旅客空間、奥行きのある船窓、厚みのある曲面屋根、メッシュ状の広い波立つ湾水面。研究用Blenderメッシュ計6件として生成する実装。作者自作材質で、写真スキャン・ゲームWebGL2実装・本物の波動物理とは称しない。
- 既存の港湾乗船スロープの終端と元ソースカメラ・既存建物の座標からF/Sを抽出し、実世界で係留候補を検索。**元CHASEや元Road5を一切変更せず**、道路の画面に食い込む候補を必ず棄却。候補サイズは沿岸旅客船として19.7〜29m、実メッシュ全体の画面投影が収まるものだけ認める。船形状を一枚絵や静止広告に置換しない。
- 親Blender実バイトSHA検証、元ゲーム git blob `af076d67492a677d2235e4730aef8cda4808e106` と誤記しないこと（**正本は下記**）、Road5頂点面全SHA、Camera6/CHASE、旧樹11、光源、K4BZ hide_render、旧オブジェクトのvisibility/pose、非Colliderを厳重維持。新ゲームCollider 0。main/公式P101/Draft PR#46/原作Slope/本番サイトは不変更。
- 真Blender EEVEE 768×480と元CHASE同画面比較、原道路画面5点・既知K4BZ黒筋6対、親／新.blend／PNG／監査JSON全SHA独立検証、Artifact保存・研究枝証拠commitをCIで行う。**TECHテストと正式ART審査は別**。

原Game Git blobの厳密な固定値は **`af076d67492a677d2235e4730aef8cdf4808e106`**。原Road5形状：`f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`。

## 実Actions・失敗根拠・再試験

- **初回 [Actions #41929001183](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41929001183) completed/FAILURE**。ソース・親.blend全ファイルSHA・過去の回帰試験PASS後、Blender4.0.2で本物の乗船スロープ先端を投影。正規化画面 x=0.53046/y=0.43761。最初の29m船候補範囲（係留沿い向きと近傍オフセット）が安全画面条件を満たさず、`NO_WATERSIDE_FERRY_LOCATION_WITHOUT_CAMERA_OR_ROAD_INTRUSION` で停止。新.blend、船PNGは未生成。これは**保護ゲートの正常な停止で、TECH PASSではない**。
- **修正commit `4eea4776156f56cb7a4e1ac027fb01632062af2a`**：元Camera/道路/安全視界ガードの値を変えず、位置候補を広げ、19.7〜29mの実船サイズ候補を連続した3D実寸で選別、実投影を記録して適合候補のみ採用。これは視界保護を緩めた修正ではない。
- **再試験 [Actions #41929801390](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41929801390)** を起動。**この文書作成時点でBlenderインストール段階・in_progress、実船レンダリング／結果／ART判定は未確定**。CI終了とArtifactsを必ず照合してから次工程へ。形状が見えない・道路を覆う場合はART・TECHをPASS扱いしない。

## これから確認する順番

まず最新Actionsの正確な結論と実Blenderジョブログ→編集可能原本/PNG/監査JSON Artifactを確認。真正画像を直接開きK4CCと比較して、港の使用目的、世界スケール、元道路の見通し、海面と岸壁の立体的なつながり、左地形の自然さを**全画面ART審査**。技術や変更画素数だけでは採用禁止。ソースの法的権利やゲームの人間プレイ品質もまだ認定しない。

**不変**：main、公式`p101-velocity-overdrive-native-trial`、Draft PR #46 (Open/Draft/未merge)、元Game／物理／道路／カメラ／原作Slope／本番2サイト、正式ART採用0・Slope2 DNA0m。Work/Computer Useは個別事前承認。追加有料API原則0円、ユーザー操作最小。
