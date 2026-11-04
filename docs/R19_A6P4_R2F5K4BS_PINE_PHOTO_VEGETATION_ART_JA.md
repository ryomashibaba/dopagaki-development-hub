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


## 初回・第2回の本物の実行結果（追記）

- 初回[CI #41793014896](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41793014896)：`completed/FAILURE`。Node元Sourceテスト、親Artifact取得の開始は通過。K4BRのGitHub Artifactは`render/`サブディレクトリ内に元Native.blendと監査JSONがあるため、親SHA監査パス誤り`FileNotFoundError`で停止。素材の取得や画像生成なし。修正commit`a9ca4b5bb993ca6dd8ec704d5ff34881b42490d0`。
- 第2回[CI #41793241061](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41793241061)：`completed/FAILURE`。元ゲーム・親Blender真SHA・Node Source全PASS。**Poly Haven本物の`sparse_grass`2K写真Diffuse 3,733,797 B／NormalGL 5,892,473 B／Rough 1,729,786 B**実取得・全Vendor MD5/Bytes/独立SHA PASS。**`pine_sapling_small`1K glTF＋外部依存の実8ファイルもメーカーMD5/独立SHA PASS**。容量上限内の実配布物を取得したことは事実。Blender原本を開いた後、Blenderが長い岩マテリアル名を内部のID長さ制約で切り詰めたため、完全一致のPython辞書キーで`KeyError`となり停止。新Blender画像/原本未完成。長い材料名を一意の接頭辞で探す修正commit`9eaec2a155c21ae0117dda084fc5c6d5c54c008c`。
- 第3回[再試験 CI #41793514129](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41793514129)は現時点**結果確認前**。この回の本物のBlend/SHA/実画像成功、木が実際にどう見えるかまで確認してからTECH/ART合否を書く。公式の実木データ取得PASSを実Blender導入PASSと混同しない。正式ART0件・Slope2DNA0m継続。


- 第3回[CI #41793514129](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41793514129)：**completed/FAILURE**。素材の公式実ダウンロード・全メーカーMD5/独立SHA・元Source/親BLEND PASS、Blender原本開封後、**K4BQ研究斜面の長いオブジェクト名がBlenderのID上限で短縮され、完全一致部分文字列が存在しないため`terrain_changed={}`**となった。ここでは実材質をシェーダーノードとして構築したが、地形への割当は未実施。源ゲーム不変。修正commit `2270c9da0eeb0366ad53e09b2eff62cfbb4f58de`は、検証済みの一意な`authored subdivided eroded native`という短縮後にも残る接頭語から研究斜面2面だけを選び、2面以外ならHOLD。次[CI #41793831862](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41793831862)の結果未確定。前CI失敗を成功としない。


- 第4回[CI #41793831862](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41793831862)は元ゲーム/元親SHA・実草2K+本物の松1K全MD5/SHAが再度PASS、実Blender工程まで進んだが、高密度松の研究用インスタンス14本・1520×950の2枚の**ソフトウェア描画が長く継続**。無料のCIで処理効率を重視し、ART判断を得るための実験条件を14本→**8本（左右各4本）**、解像度1280×800に制限。元ツリーglTFのポリゴン品質を落とさず研究用共有インスタンスとして少数配置し、研究用高画質LOD/FPSはHOLDのまま。第4回は**cancelled**、描画成功の証拠は無し。性能の正式な速度測定として扱わない。
- 上記最小パイロットはスクリプト修正commit `14d7b2cdaa59c5bb7dedf4cda0a650795edd1a9d`、同カメラであることを保持したまま旧画像だけ新解像度へリサンプルして比較するCI修正commit `9b1de479213cc936da315c573c5e3d21bd0c1533`として保存。途中CI #41795019967は追加修正により**cancelled**。現行[CI #41795056558](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41795056558)の本物のBlender画像/原本SHAを独立検証するまでは技術PASS・ART改善とは報告しない。


## 【K4BS最終監査 2026-11-04】実CC0素材/Native Blender TECH PASS、実画像ART REJECT

### 最終実行・独立証拠

- [最終GitHub Actions #41795056558](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41795056558)は**completed/SUCCESS**。第1回 #41793014896、第2回 #41793241061、第3回 #41793514129は各々源パス/材質名/研究地形名で**FAILURE**。14本を使った第4回 #41793831862と修正途中 #41795019967は**cancelled**。それらをPASSと誤称しない。最終は**実松の共有インスタンスを8本に限定、1280×800の研究Blender画像2枚**を実レンダリングし、保存まで技術的に完了。
- [本物の最終Artifact #13305631124](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41795056558/artifacts/13305631124) ZIPサイズ70,283,541B、実SHA256 `6c656bf29353b9f81ddb42dceaaa624c2bffd0e021f18c78f47be12bcdac2e71`、ZIP全CRC **PASS**。編集可能原本 `K4BS_REAL_PINE_AND_ORGANIC_PHOTO_GROUND_EDITABLE_DCC_ART_HOLD.blend` 136,868,853B、SHA256 `156e56ce373b731f1f0c8f96278a11977ac93d491973c2e8ef796ec1ea7795de`。同CHASE研究Camera PNG 1,239,495B／SHA256 `be95187ce5fba724547a0333bcca261b8c300ee0bb9316edd23cfc18ca85ba3f`、元Controlポーズ複製研究Camera PNG 1,254,969B／SHA256 `4b4d899b1792023590e60ce923cf6bf8154f3e415a466e35d9608f79fc5ef61a`。
- [同CHASE研究CameraのK4BR旧とK4BS新の真正比較](research-evidence/k4bs/K4BS_VS_K4BR_SAME_CHASE_CC0_PINE_AND_ORGANIC_GROUND_ART_REVIEW_NOT_GAME.png) 1,944,018B／SHA256 `bc7086de33aa9588fd73463f03332d3c235f9912cec26e77825e8ab14ce7ffeb`。比較では元K4BRの1520×950だけを新K4BSの1280×800に縮小して並列掲載しており、**カメラ位置/レンズは同一だが解像度は異なる**。平均RGB差分`10.0967`は画像が変わったことの根拠のみ、品質指標ではない。
- **独立検査**：GitHub CI以外の作業コンテナでZIPを解凍、ZipFile.testzip() = None、原本BLENDと新PNG2枚/比較PNGのサイズと原SHA256、Poly Haven監査JSON実SHA256 `0cfd81f860a3b2ca541b8a4c503965cb1193732986fccfa6830740b3fb307e4a`を再計算し**全一致**。研究隔離ブランチに写真/原本の検証JSON/素材の実URL/全ハッシュを保存。
- メーカー公式 Poly Haven の`sparse_grass` 2K画像3枚（3,733,797B／5,892,473B／1,729,786B）と`pine_sapling_small`1K glTF＋依存ファイル計8本の実配布元MD5・Bytes/SHAを実検証。新Blender原本には実写真3chがPacked。Native tree importは**398,144 triangle**（1モデル）を実確認し、**8本の研究用共有ジオメトリインスタンス**を配置。元K4BQ研究斜面2本各1,456ポリゴンは旧`material_index=0`が718面、`index=1`が738面の人工的な交互色分けを解除し、各斜面を1つの3D連続マスクPBRに差し替えたことをネイティブ監査JSONで確認。
- 元GitゲームBlob `af076d67492a677d2235e4730aef8cdf4808e106`、原B48 Road5 mesh fingerprint `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、本物元Camera6数値、研究Camera2数値、実B48 7/B51 28/240Hz/球0.65m全不変更。元ゲーム新Collision0。元ゲームWebGL2フレームではなく本物のBlender研究画像。main/公式/PR#46/本番2サイト不変。

### 同CHASE元カメラの本物の画像を直接見たART判定：**ART REJECT**

確かな技術改善は、写真材質のgrass/rockが連続したので**以前の左側の大きな四角い緑パッチが消え、斜面の地表のマスクが連続した**こと。また巨大な舞台のような建築と一本塔が視界から消えた。

しかし**肝心の本物の松の木がカメラ画像では樹木としてほぼ視認できない**。glTFの実データ/Native triangle/8本の配置オブジェクトが存在することと、ゲーム走行画面で目立つことは別。これは**技術的なインポートPASS／視認性・構図デザインとして失敗**と判定する。位置の投影、単位系、元GLTFの中心補正、コレクション・インスタンスの表示評価などを独立診断する必要がある。原因は現段階では**断定できない**ので、「インスタンスが描画されていない」とは断定せずに実フレームで視認できていない事実を残す。

また建築と灯台を単純に非表示にした分、**空白の空が非常に広く、港湾施設・街並み・動く生活感・ゲームとしての完成世界が全く成立していない**。旧画面より地表は自然になったが、全体はむしろ寂しい。道路は相変わらず広く単調な上り平面で速度感も足りない。単純な写真素材や高精細モデルの投入は全体画面の品質を保証しないと再確認。

**世界水準のコース全体ART PASSは認定しない。正式採用0件、Slope2 DNA正式認定0m、HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD**。

### 次工程K4BTの優先修正（追加の長い無駄レンダリング禁止）

1. **木のカメラ内視認性を実数値・スクリーンショットで検査する**。K4BS木のglTF真BoundsとWorld transform/CollectionInstanceのbboxをコードで評価して、木の樹冠上端の`world_to_camera_view`が画面の何ピクセル・何%を占めるか出力し、**少数だけ元CHASE Cameraで低解像度の速い1画像**を一度撮る。本物の樹木シルエットが見えなければ他要素を増やさずFAILとして停止。実GLTFの植え込み位置・樹高・素材alpha・意図した視界内かを特定してから高解像度化する。
2. **港を空白にしない**。巨大な模型式建築を非表示にしたまま放置せず、実用途・スケール・文化/公共空間が明確な1つの海辺中心施設と、視界中央の立体的な海岸/港湾を**素材と作者意匠を使った高品質な一画面**で作る。箱/屋根の機械的な数増やしに戻らない。高解像度の絵だけでPASSしない。
3. ソフトウェアGLの高密度リアル木は14本で長時間処理が継続し、8本でも時間を要したため、**研究画像描画時間/実木tri/画像サイズを計測し、LOD/FPSを別の要件**とする。未計測なのに「実ゲームFPS良好」や無料で無制限に制作できると誤称しない。原因別の高速化、事前固定ソース監査、1画面単位の独立ゲート。
4. 実ゲームSource Control11307/B48元Road5正式採用には別のアート/物理/SAT/CCD/28動体/FPS・人間テストの全合格が必要。元ゲーム・main・Draft PR#46・本番不変更、Work/Computer Use事前承認制、正式ART0件・Slope2DNA0m。
