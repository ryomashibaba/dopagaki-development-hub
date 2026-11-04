# K4BS — 実在CC0松モデルと写真地表の連続材質による真Blender美術研究

2026-11-04 JST。隔離ブランチ：`research/k4bs-photo-vegetation-art-direction-20261104`。

## 目的と継承

DOPAGAKI SLOPE — HYPER RUSH の世界水準の高速3Dレーシングゲーム美術を完成させるため、**単純な手続き的ローポリ植生・巨大な公共建築・矩形色パッチ地面**を改修する。ただし技術と美術の合格は別。親[K4BR完全監査](R19_A6P4_R2F5K4BR_CC0_SCAN_REAL_ASSET_ART_JA.md)、[最終CI #41790588687](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41790588687) completed/SUCCESSから真正編集可能Blender`K4BR_ACTUAL_CC0_PHOTOSCAN_ROCKS_EDITABLE_NATIVE_DCC_ART_HOLD.blend` 74,454,543 bytes、SHA256 `7f229b9fbc0d736c056e1494f64192e64b7915f768a6fb38f05c87901229fa69`を独立検証して継承。K4BRはCC0材質/実3D岩壁導入技術PASS、実CHASE研究画像の美術ART REJECT、正式ART採用0件、Slope2 DNA正式認定0m。

## K4BS実制作 — 写真の連続した地面・実3D松・構図の整理

- [実在のPoly Haven Sparse Grass CC0](https://polyhaven.com/a/sparse_grass)：写真由来の薄い草・根・湿った土壌の地表画像。公式API`https://api.polyhaven.com/info/sparse_grass`と`/files/sparse_grass`を呼び、2K Diffuse・OpenGL Normal・Roughを取得し、公式MD5/バイト数・独立SHA256全一致が必須。追加有料APIを使用しない。
- [実在Poly Haven Pine Sapling Small](https://polyhaven.com/a/pine_sapling_small) CC0：約398K trianglesの写真ベースの針葉樹。**これは高密度のDCC研究素材であり、正式ゲームLODではない**。公式APIの1K glTFファイルと全依存素材のMD5/SHAを検証し、合計175MiB超なら失敗とし無制限ダウンロードを避ける。実ダウンロード・Blenderへの実読込成功前に採用済みと報告しない。
- `scripts/p101-k4bs-fetch-cc0-vegetation.py`：Poly Haven公式APIの利用規約に従い固有User-Agent・`Powered by Poly Haven`出典表記と、HTTPS配布元ホスト制限、公式サイズ/MD5/独立SHA256、個々の実URL・ファイル名・画像HashをJSONに保存。
- `scripts/p101-k4bs-organic-cc0-ground-and-pine-art.py`：独立されたK4BR編集可能.blendをSHA固定で読み込み、元B48の7本と本物の6Cameraはそのまま。K4BQ研究用左右斜面の材料2種類をポリゴン単位で切替える現行方式を研究専用の材質として解除し、**実写CC0 Sparse Grass+既存の実写CC0 Rock Ground 02のRGB/rough/OpenGL normalを3D位置・斜面角度・複数空間周波数でなだらかに連続ブレンドする新しいBlenderノード**に置換。斜面のメッシュ形状そのものはそのまま保持し、色分けの四角い継ぎ目が消えたかを実PNGで評価。
- 実取得した松のglTFは、元の針葉・枝・樹皮・アルファ素材をBlenderで読み込み、**同一ジオメトリの研究専用コレクションインスタンスを最大14本**に限定して配置。元K4BQの三角形の木、平らな草地メッシュは削除せずRender OFF。高密度の木を遠景も含め大量複製しない。**LOD/FPSは未検証**。
- 元K4BQ画面の左上の巨大な模型的建築・右の非現実的な単独灯台を研究画像でだけRender OFFし、港と海岸線のシルエットを優先。オブジェクト本体は.blendに保持。実建築の完全リデザインは別にART評価が必要で、描画非表示をもって完成とは言わない。
- **K4BRと同一のK4BP D研究用`CHASE_NARROW` Camera**で真实旧/新A/B、加えてNARROW_FIXED_ORIGINAL_POSE研究複製カメラで別視点PNG。Source Control11307や元Road5は一切変更しない。実WebGL2ゲーム画面ではなく、Blender DCCの研究画像。
- [実K4BS GitHub Actions](https://github.com/ryomashibaba/dopagaki-development-hub/actions/workflows/p101-k4bs-organic-real-pine-native-art.yml)を実行し、配布元実バイト、Blender原本・写真packed image・木の実三角形数・元Road5頂点/面fingerprint・元全Camera数値・同CHASE PNG差分・編集可能.blendを独立SHAで証明、研究枝に真正PNG/JSONとArtifactを保存。

## 不変更契約／正式ARTのゲート

元ゲーム`web/p101-w9c2-g4e7ci-integrated-streetscape.mjs` git blob`af076d67492a677d2235e4730aef8cdf4808e106`、原Road5頂点/面fingerprint `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、B48実道路7、B51元実移動体28、240Hz、球半径0.65m、元Camera全6と操作/安全UIは完全保護。main、公式`p101-velocity-overdrive-native-trial`、Draft PR #46、本番2サイト不変更。Work/Computer Useは事前承認。追加API費用原則0。ユーザーWindows操作を要求しない。新ゲームCollider0、新独立の研究Road幅26.3mをゲーム可走B48と混同しない。正式美術採用0件、Slope2 DNA0mを保留、ART/SAT/CCD/HUMAN/FPS/RELEASE/MERGEはHOLD。

**美術評価**：真同Cameraで道路に対する地面と木・港の全体質量が自然に見えるか。さらに世界水準の画面構成・密度・ディテール・奥行きの各問題を厳格に見る。木がちゃんとした3Dでも写真の草が不自然、都市と港が空白なら**ART REJECT**。物量・公式素材・CI成功率を品質PASSと混同禁止。

## 実行履歴

初回[Actions #41793014896](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41793014896)は、執筆時点で最終結果未確認。実Blenderの画像、素材MD5、SHA検証結果が得られたら逐次追記する。完了前に実素材取得・技術PASS・ART合格を報告しない。
