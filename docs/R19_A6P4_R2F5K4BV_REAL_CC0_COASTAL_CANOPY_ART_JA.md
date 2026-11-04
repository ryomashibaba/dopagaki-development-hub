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

