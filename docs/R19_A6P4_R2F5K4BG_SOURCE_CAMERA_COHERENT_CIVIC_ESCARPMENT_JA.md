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
