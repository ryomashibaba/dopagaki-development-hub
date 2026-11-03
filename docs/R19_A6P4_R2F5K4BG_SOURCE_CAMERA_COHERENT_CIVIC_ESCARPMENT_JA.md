# K4BG — 真正Source Cameraに基づく連続公共都市峡谷のBlender美術再制作

2026-11-04 JST。**研究・ART FIRST / 正式採用0件**。K4BF研究HEAD `f8d291d7c4436e739843bd3bb6fdf2b95c85feb0` から新しい隔離枝へ分離。main／公式p101／Draft PR #46／本番2サイトに変更を加えない。

## 直前の証拠を優先
K4BF [CI #41722243986](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41722243986) は completed/**FAILURE**。しかしBlenderは52件の編集オブジェクト、2元Camera PNG、.blendを実生成し、独立画像SHA検査も通過。失敗箇所は最後のGit push: 先行する引き継ぎ文書更新でブランチが動いたため non-fast-forward。原Artifact [#13271498531](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41722243986/artifacts/13271498531) は実在。CI FAILUREをSUCCESSに読み替えない。

真のK4BF左右2対2比較を画像で審査。controlは巨大に単調な前景と小さく薄い中央の開口箱、ultraは前景の道路面が消えたような大きな空き領域が出現しており、**K4BF ART REJECT**とする。これは元ゲームで路面を変更した証拠ではなく、Source Camera数値を使用したDCCレンダリングの問題。原因は未断定。K4BFを公開・横展開しない。

## 本工程が実際に変更するもの
`scripts/p101-k4bg-source-camera-coherent-civic-escarpment.py` はSHA検証済みK4BE DCC原本を開く。K4BE旧反復側面と旧中央の採用不可ARTコレクションを**削除せずrender OFF**、親K4BEの元Road5の**材質割当と頂点・面を共に完全不変**にしてK4BFのultra問題を隔離する。

新しい一体設計の公共海岸峡谷として、左右で非対称な連続石造崖・厚い波形公共屋根・奥まった居室ガラスと暖色内装・前景公共テラス/雨庭・地面に連続する大型橋脚・中央を抜いた公共ゲート・遠方のねじり市民記念塔を個別の真Blender編集meshで制作。安易な旧box街区を上に重ねない。**これは品質保証ではなく候補を実制作する新工程**。

元Camera control11307/ultra11341において、旧K4BE ART REJECT画面と新K4BG Source-DCC 2PNGの同pose比較を作り、目視で見栄えが悪いならK4BGもREJECTとする。カメラ構図/路面/bank/動体/高速走行の改変はしない。DCCにはB51のOBB参照はあるが、その材質視覚・ゲーム実描画は再現していない。

## 不変条件・評価ゲート
- 元ゲームblob `af076d67492a677d2235e4730aef8cdf4808e106`、240Hz、半径0.65m、実7 B48/28 B51、全6元source Camera、元安全表示、実プレイ道路および衝突は変更禁止。
- 親Artifact CI `41659005101` の検証済K4BE原本が必要。新専用CIはK4BGのみ、ART品質を満たすまで残り4Cameraや他6道路を複製しない。
- シーン編集/原本ファイル保存/SHAは **DCC TECH** のみ。独立全7道路対B51時間変化/BVH距離/SAT/CCD/球安全半径/HUMAN/FPS/真正WebGL2統合はすべてHOLD。
- **正式ART採用0件、Slope2 DNA正式認定0m、RELEASE/MERGE禁止**。Work事前承認制、ユーザーの手動ローカル操作不要。

## 本物の最新状態は必ず検証
この文書の記述はコードの設計契約であり、GitHub Actionsの実際の成否・画像の人間目視・美術評価を代替しない。

## 実際のCI結果と真正ART審査（2026-11-04追記）

初回[K4BG Actions #41725702409](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41725702409) は completed/SUCCESS。真K4BE親SHA・元source blob・Python・Blender・2 PNG+1 .blend・独立SHA・研究ブランチへ画像保存は技術的成功。Artifact #13273816812（ZIP SHA-256 `18a5f5d0e23c6bfedf13b660beb3933380118aa2739d2ffe0cb7a5d6afb241e6`）、新規88編集mesh等を作成。

しかし2画面の実画像審査ではcontrolも前景が単調で、中央の空洞の構成が弱い。さらにultraではRoad5が大きく欠けたように見えた。**初回のARTはREJECT／正式0件**。比較PNGが生成されたことだけでARTを認定しない。

**コードにある原因を独立追跡した**：K4BE原本は保存時にRoad5 CONTROL collectionだけを可視、ULTRA collectionを`hide_render=True`として保存していた。K4BG初版の`show(mode)`は各Road5 *object*.hide_renderだけを切り替え、親の*collection*.hide_renderを切り替えなかったため、ultra原Road5が描画されない。元B48のメッシュ・物理・材質・元カメラの改変は不要。

修正コミット `e1f5354f0738c34cce63a698a580e77c6bb69fb7`：`show(mode)`を真のsource B48 Road5コレクション可視切替へ修正、材質・頂点・ソースカメラは維持。修正版[CI #41726814278](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41726814278)を再実行。**その画像を実際に照合するまでK4BG改訂ARTは未判定**。初回成功は修正後の真正ultra画面を保証しない。


## 【最終事実認定 2026-11-04】修正後の本物の2CameraレンダとART判定

- 修正版 [GitHub Actions #41726814278](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41726814278) は **completed/SUCCESS**。すべてのjob steps（元ゲームGit blob・静的Node/py_compile・親K4BE artifact SHA・Blender・2画像独立SHA・研究ブランチGit保存・Artifact）が成功。正式採用の意味ではない。
- 真成果 [Artifact #13274862071](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41726814278/artifacts/13274862071)、ZIP SHA-256 `12421de4f43d2aad1df744aed9d9bf450727dded08151eb7fab300334d9e787b`。ZIP内容：編集可能 `K4BG_CIVIC_ESCARPMENT_EDITABLE_DCC_ART_HOLD.blend`、control11307/ultra11341各1PNG、K4BE旧vs K4BG新の2組比較PNG、SHA/provenance JSON。独立コンテナでZIP CRC・すべてのmanifest SHA・PNG読込を再検証済み。
- **以前のultra道路欠落は修正版DCC画面で解消**。発生源は元道路meshやマテリアルではなく、Blender原本で保存されたULTRA Road5 *collection* の `hide_render` を子が適切に切り替えなかったこと。元source Road5メッシュfingerprint control/ultra `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2` 不変、材質割当も不変。
- Blender-native新規編集可能建築は**88件**。ただし実カメラ2視点を人間目視すると、前景が依然ほぼ単調な広い路面、左右建築は粗い連続面と反復リブ、中央構造も薄い橋/空洞、奥行き・公共用途・人間尺度・遠景都市・ライティングにまだ実用美術としての説得力なし。**K4BGもART REJECT、正式採用0件、Slope2 DNA0m**。K4BE/K4BF/K4BGどれも正式ART採用禁止。新しい形状数や技術成功は世界水準の品質評価ではない。
- **次の正当な工程**：このK4BGをゲームへ移植したり他6Roadへ複製するのではなく、本物の元Cameraの画面で面積の大きい道路・近距離両側の連続街区・都市の奥行き・材質・昼夜照明を、一枚の完成画として組み直す。自動box/単純curve増築や検証ゲートの量産で成果を水増ししない。必要に応じてBlender GUIでの実アートディレクションを事前承認の範囲内で検討、最終受入は元WebGL2で別判定。ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGEすべてHOLD。
- 今回の正本記録時点の研究HEAD：`207272291b3784970008459cecc084392f989c9f`（後続のドキュメントcommitで変動するため、次回はGitHub再取得）。main、公式p101、PR #46、本番2サイト、元source blobに変更なし。PR #46は OPEN/DRAFT/未merge。Work未使用。
