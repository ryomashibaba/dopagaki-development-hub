# K4CA — K4BZ黒筋修正を保持し、実海岸樹と既存左斜面を本物の美術として改善

2026年11月4日。隔離研究ブランチ research/k4ca-authentic-coastal-terrain-photo-canopy-one-frame-20261104。これは新規ゲーム・新方針ではなく、従来の美術最優先のDOPAGAKI SLOPE開発の継続。

## 不変の前工程・主要価値

[K4BZ R1/R2/R3完全証拠](R19_A6P4_R2F5K4BZ_TRUE_BLACK_WEDGE_PIXEL_CAUSE_DIAGNOSTIC_JA.md)で、黒い道路筋の原因は「K4BY研究用PBRロード表面」と確認。元K4BY A3の黒筋6地点と正常な路面6地点の実レイ比較、黒筋対象1メッシュのhide_renderだけを変えた真正Blender 768×480 A/B、R3軽量回帰CI全PASS。**K4BZ修正は絶対に復活させない**。真正K4BZ R2編集可能Native.blend SHA256 = 162a7baaf7594b36a134457bee817bd7dcf0ef1b3e581419d6561efa92e45382。真の同CHASE 768×480元画像 SHA256 = d82a367f49623a8ed2a75a4540ba8a6de07f976a51d49f4dbb20673243576df7。実Blender Nativeは [GitHub Actions #41835036099 Artifact #13327120155](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41835036099/artifacts/13327120155)で固定。

## 今回の作者制作

- 元K4BZ R2真正編集可能.blendを**固定SHAで直接検証**して研究コピーを開く。既存左斜面がCHASE画面に実際に現れるピクセル6地点を、Blenderの本物のカメラraycastから物理位置・オブジェクト名・面を同定し、単一の同一既存丘陵モデルであることを守る。**新しい三角形地形、カメラへ貼る背景、虚偽の木の絵や道路の重ね塗りは禁止**。
- 元の丘陵を削除せず、**頂点・面・変形・カメラを一切変えないまま、その研究用左斜面の材質だけをコピーして改修**。ワールド座標依存の自然な地質変化、落ち着いた砂岩と海風の退色・低い灌木の色階調・微小な凹凸ノーマル。これが真の美術品質改善につながるかは本画像まで未確定。既存丘陵と地面の連続性を優先。
- 既存K4BV「Poly Haven island_tree_02」真のCC0・保存済みglTFモデル＋写真由来PBRを**新規有料ダウンロード・模型の木を作らずに元の検証済みMasterコレクションから直接利用**。同じ左斜面のraycast位置2点に、風で枝が剪定された実景樹を異なる回転・スケールで作者配置。多量の等間隔植樹や低品質ポリゴン円錐の増殖ではない。既存原本の9本の木のTransformは数値保護。
- 同じ原本CHASEカメラ、同じEeveeと光源、同じ768×480 1画面だけを真正Blenderレンダリング。真.blend、真PNG、同じ元K4BZのPNGとの比較、SourceとSHAの独立監査を実行。技術PASSと**全画面ART**を別判定。見た目が悪ければART REJECT。世界水準に届かない限り正式採用0件。

[初回真Blender CI #41847033140](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41847033140) は本記録の時点で**結果未確認**。CIの入力が必要条件を満たさなければ、書き込みを止め失敗を記録する。これまでのK4BW A1で発生した不自然な黒い巨大岬の再発を避けるため、追加の岸壁・断崖メッシュ制作はしない。

## 固定憲章と正式採用HOLD

- 元Game Git Blob = af076d67492a677d2235e4730aef8cdf4808e106
- 元B48 Road5全頂点面 SHA256 = f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2
- B48 7Road、B51 28Mover、240Hz、球半径0.65m、元6 Camera/CHASE、古い木9本、ゲーム本体WebGL2、main、公式 p101-velocity-overdrive-native-trial、Draft PR #46、本番2サイト**全部不変**。ゲームCollider追加0。
- **正式ART採用0件／Slope2 DNA0m／SAT/CCD/HUMAN/FPS/RELEASE/MERGE全HOLD**。元PRはOpen/Draft/未マージを保持する。Work/Computer Useは別途事前承認、追加有料API0円、ユーザーWindows操作0。

## 画像検証後の分岐

真正PNGを直接確認し、岩肌のスケール・退色表現が自然か、実樹が根元と地面でつながるか、道路を遮らないか、手前の巨大な灰色道路と右の港の模型感に変化があるかを確認。木が不自然なら追加せず、親原本を保持し植生の配置・材質を改善。TECH PASSでも「有数の3Dレースゲーム品質」のARTまで届かない限り研究としてHOLD。
