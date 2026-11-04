# K4BV — Coastal canopy native art study（2026-11-04・研究隔離）

研究枝：`research/k4bv-real-coastal-canopy-native-art-20261104`。最上位目標は **DOPAGAKI SLOPE — HYPER RUSHの1画面から全コースへ展開できる世界水準の高速3Dレース景観**。ユーザーが低品質を繰り返し指摘したため、技術PASSと美術PASSを絶対に混同しない。

## 引き継ぎ事実

[K4BU最終正本](R19_A6P4_R2F5K4BU_UPRIGHT_NATIVE_PINE_SINGLE_FRAME_ART_JA.md) は真正Actions #41801261499 SUCCESS。元K4BS実CC0小型苗木のX軸をZ上向きへ修正し、地面への埋まり込みと完全画面外配置を解消した。実同CHASE真正Blender比較画像で **TECH PASS / ART REJECT**。少量の松枝だけが見えており、幅広い直線Road5・港湾空白・沿岸生活感・速度感は世界水準に全く届かない。正式ART採用0件、Slope2 DNA 0m。

## K4BVの対象・実装

現状の細い苗木を8本一気に回しても変わらないため、**実際に海岸用の横広がりの樹冠を持つ1本**を試す。公式Poly Haven [Island Tree 02](https://polyhaven.com/a/island_tree_02)は「風化した幹と横方向に枝葉が広がる海岸用の樹木」とされ、公式[ライセンス](https://polyhaven.com/license)はCC0。**これは松ではなく、針葉樹への正式置換を主張しない**。まず「自然な成木が画面内で読み取れるか」の限定した1フレーム研究にのみ使う。

- `scripts/p101-k4bv-fetch-official-coastal-canopy.py`：公式API `/info/island_tree_02` と `/files/island_tree_02` から1K glTF本体＋依存ファイルの公式サイズ/MD5/HTTPSホスト確認・独立SHA256取得。総105MiB／単体75MiB上限を超えたら**HOLD**。URL、元ハッシュ、実バイト、作者、出典をJSONに記録。追加有料API0円。ダウンロード/MD5成功前に導入成功と報告禁止。
- `scripts/p101-k4bv-one-genuine-coastal-canopy-native.py`：親K4BU真正Blender原本 `K4BU_ONE_REPOSITIONED_UPRIGHT_GENUINE_CC0_PINE_EDITABLE_RESEARCH_ART_HOLD.blend` のSHA256 `2536375f40e6a20e0061b80aba100c2469cfeacde814f4c127ff194201ba3064` を固定検証して再読込。元Blender/SOURCE B48/元6Camera/研究CHASE Cameraを保護。旧8本の真正小型松は削除せず**研究レンダーのみOFF**。実GLTFのメッシュ/葉アルファ/材質/実BBox/三角形数を読込検証し、自然な水平樹冠の姿勢を維持して1本だけ配置。
- カメラ内外、元研究Road片側の位置・樹冠の道路近接余裕、画面内BBoxを数値化した候補から**1カ所だけ**決定。真の元CHASE研究Cameraで **768×480実Blender EEVEE 1画像のみ**、編集可能.blend＋実SHA、K4BUと同研究カメラ解像度で旧新を比較する。ここで良い画像にならなければ正式ART不採用。中立なBBoxや単なるRGB差分は品質メトリクスではない。
- [K4BV Actions #41803574543](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41803574543)：**結果は確認時点で実行中。** 成功/失敗、元vendor bytes、native triangle、実モデル、実画像、ZIP CRC/個別SHAを最終照合するまでは結果を断定しない。

## 元ゲーム永久保護と正式採用ゲート

元Game Git Blob `af076d67492a677d2235e4730aef8cdf4808e106`、B48 Road5全頂点・面fingerprint `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、B48 7道路/B51 28動体/240Hz/球半径0.65m/元Rig6Camera、安全UI、元B48可走性を変更しない。研究Road幅26.3mはゲームの走行道路ではない。新ゲームCollider0、ゲーム統合0、Windows操作0、追加有料API0、Work/Computer Useは個別事前承認。main、公式`p101-velocity-overdrive-native-trial`、Draft PR #46、本番2サイト変更禁止。 **正式ART0件／Slope2 DNA正式認定0m、ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD**。

## 次K4BWへの分岐（実結果でのみ判断）

1. 実輸入モデルが視覚的に自然で一目で樹冠として読めれば、**木の大規模な追加より先に**、元CHASE画面中央の海岸地形・実用途のある港湾・人間スケールの公共施設の作者意匠を行い、1画面の質を抜本改善する。
2. 画像に木が出ない・輪郭が悪い・レンダリングが重すぎるなら、実現原因（モデル座標/葉アルファ/遮蔽/サイズ/資源制約）を修正し、無駄なアセット候補増殖や2枚高負荷レンダリングはしない。
3. 1画面の正式ARTが合格するまでは他6Road、本番ゲームへの展開はしない。技術上の合格と本物の世界級アート合格を別に判断。

## 2026-11-04 実行記録（修復未完了・HOLD）

- 初回 [Actions #41803574543](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41803574543) は**completed/FAILURE**。K4BU原本・SourceテストPASS、公式Poly Haven `island_tree_02` 1K glTFと全10依存ファイル、実計 **46,172,406 B**（全実URL・Vendor MD5・SHA256）取得検証PASS。真正Blender 4.0.2 glTF importerは約2秒で処理完了。しかしImported image datablock `island_tree_02_diff` の `has_data=False` という画像ロード状態でFail Closed、真研究画像と編集可能新.blendの作成なし。成果の成功を捏造しない。
- 同画像に対して、Vendor manifestの正確なファイル名から対応を取り、Blender各マテリアルへ元Vendor SHA一致ファイルを明示的に再接続する修正 commit `b715ca7b07d2016d0c50a62bc66d340f881fa249` を実装。[再実行 #41803979687](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41803979687) も **completed/FAILURE**。全モデル実バイト＋Blenderインポートは再度PASSしたが、新しく読み込んだ正しいVendor JPEGでもバックグラウンド Blenderの`has_data=False`で停止。**原因としてBlenderの遅延画像画素読込が疑われるが未確定**。ファイル欠損とは証明されていない。
- 以降の堅牢な修正候補は、Python APIの `image.has_data` だけでは成否を決めず、K4BSで技術実証済の `image.pack()` と `packed_file` の存在、Packed実バイト長および元Vendor SHA、独立画像再読込等で検証すること。ただし**この修正のGitHub保存と実行は現段階では未完了**。修正未実行のまま成功扱いは絶対にしない。
- K4BV正式技術判定：**素材取得/Source一致はPASS、Native material packed・Native.blend・実CHASE画像はBLOCKED**。元K4BU原本および正式Game / B48 / Camera / main / PR #46 / 本番サイトを改変していない。正式ART採用0、Slope2 DNA 0m、ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。モデルの実画面での美しさは**不明**。


## 【2026-11-04 K4BV最終確定】真正モデルのNative Blender TECH PASS／同CHASE実画像ART REJECT

### 真正技術と証拠

- CI結果：最終[GitHub Actions #41813863791](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41813863791)は **completed/SUCCESS**。それ以前の #41803574543、#41803979687、#41813263091、#41813606092 はそれぞれ **FAILURE**。最初の2回はBlenderのImage `has_data=False` に関係する安全停止、3回目はGlTFインポータによる合成roughness画像名、4回目は `leaves_diff-leaves_alpha` 合成名と実Vendor原画像名のずれによる停止。失敗を消さず、公式画像の実ファイルパス優先・粗さARM対応・公式SHA実バイトを `image.pack(data=...,data_len=...)` で正確に格納する修正を研究枝に保存。ソース権限外の画像や偽の結果なし。
- 実公式 Poly Haven `island_tree_02` のGlTF +依存11ファイル **46,172,406 bytes**、元Vendor MD5・sizeと独立SHAを検証。元K4BU編集可能 Native Blender SHA256 `2536375f40e6a20e0061b80aba100c2469cfeacde814f4c127ff194201ba3064` を検証して再読込。
- 本物のGlTFメッシュ **1,072,212 triangles（1メッシュ）** と**Vendor画像9点のNative Pack検証PASS**。研究用に既存K4BUの旧8本を削除せず RenderOFFし、本物の海岸樹1本を研究位置 **d=62m、s=-24m、yaw=60°、足元地表+0.15m** に置く。研究Road片側の枝葉BBoxとの余裕推定5.179mは**実ゲームのSAT安全値ではない**。真正CHASE投影BBox **95.928×57.114px**（768×480の1.48623%）は葉の実可視ピクセルではなく、単にジオメトリの投影範囲。
- [真正Artifact #13313382664](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41813863791/artifacts/13313382664)：ZIP実ファイル **112,671,781 bytes**／SHA256 `bb46f9ae2cc801046957f685408e08b7e109c9f980cb86618116cbd81d9cca7e`。GitHub Actionsの外部コンテナでも ZIP全CRC（`testzip()=None`）PASS。編集可能 `K4BV_ONE_GENUINE_COASTAL_CANOPY_EDITABLE_NATIVE_ART_HOLD.blend` **259,059,020 bytes**／SHA256 `7c28000ad1a75afb7f64958a6d48ec5ff205849c37d5a2878f17bdd1d2d4e1c4`、実CHASE画像 `K4BV_ONE_COASTAL_TREE_SAME_CHASE_NATIVE_768x480_ART_HOLD_NOT_GAME.png` **465,418 bytes**／SHA256 `390a2ca19cd98eba204f697c1f70532ca86ee77e504e4692c62d8a6c5244d665`、真正同CHASE K4BU比較画像 `K4BV_VS_K4BU_SAME_CHASE_TRUE_COASTAL_CANOPY_ART_REVIEW_NOT_GAME.png` SHA256 `ac5db3dfe01701ab48d15351841e4cf47c505bd2599c76718f582b7d2756a232`、公式素材レシート SHA256 `ba0ff57c07fd9f78d57a8b83a18918ccb4787784b1d10ebaed03a9e5889e97ae`、すべて ZIP実バイトから独立再計算・PASS。
- K4BVのNative画像と同Camera旧K4BUとの比較を**目視確認**した結果、右端斜面の木1本に低い横広がりの枝葉が見え、元の細い苗木より樹形の自然さは局所的に改善。ただし木はフレームの小領域に留まり、「成熟樹による景観が成立した」とは認定しない。**幅広い人工的な灰色直線道路、広い空白の空、港湾の生活/公共空間の欠如、地形の単調さ、スピード感不足**が主画面を占める。世界水準の全画面ART判定：**REJECT**。
- 真正Native.blendはゲーム本体ではない。ART採用0件・Slope2 DNA0m、実ゲーム新Collider0。main、公式P101、Draft PR #46、本番2サイト、元ゲームGit Blob `af076d67492a677d2235e4730aef8cdf4808e106`、元Road5 fingerprint `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、B48 7道路/B51 28動体/240Hz/0.65m球/元6Camera全保護。HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。

### K4BW次工程：単独の木ではなく、画面全体の作者構図を解決

同じ木を大量にコピーしたり、新たな素材を数十種類取り込んだりしても、主画面を占める灰色道路と空白の海岸という**本当の美術課題**は解決しない。K4BWはこの `K4BV` 編集可能Native.blendをSHAロックした原本として、**元CHASEの中央遠景～右沿岸の港湾・公共空間・実用途と海岸地形の立体的な構図**を作者設計する。大きな箱、灯台単体、円錐植生や単純反復物量に戻さない。最小の1画面実レンダーで品質が出るかを厳しく評価してから別画面に展開。K4BVの高密度実木は正式ゲームLOD候補としては未検証（HOLD）であり、可走Road5・物理/カメラ/ゲームには反映しない。最終採用は1画面の本物のART改善が成立し、別途SAT/CCD/HUMAN/FPSが合格するまで不許可。

