# K4BN — 原Camera道路主役化：オリジナルのレース塗装・実3D船・港湾荷役の美術研究

更新：2026-11-04。研究隔離ブランチ `research/k4bn-track-surface-harbor-silhouette-20261104`。元ゲームの商用水準の美術を完成する最上位目標を維持し、今回の現実的な改善を一画面（Control 11307、Ultra 11341）の本物のBlender DCC原Cameraに固定して審査する。**真ゲームWebGL2、シーン内に人や動く車が存在するという仮定、ゲーム安全性・衝突判定は含まない**。

## 1. K4BMからの継承と不変更契約

直前研究枝 `research/k4bm-uv-pbr-authored-hero-20261104` の最終HEAD `88106e5fe92784e0b2bfbb0a6320dbee20389ef0`、[K4BM全監査正本](R19_A6P4_R2F5K4BM_NATIVE_UV_PBR_ART_JA.md)。[最終成功Actions #41757027430](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41757027430)、[Artifact #13288142972](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41757027430/artifacts/13288142972) を真正親DCCとして使用。編集可能`K4BM_UV_PBR_AUTHOR_SCULPTED_EDITABLE_DCC_ART_HOLD.blend`のSHA256は`7297b0ea17ffacb7f2c84cecf901947ce11de4e0a91ff4c93703f43cbe7b4a80`。元Source Road5メッシュと元6Cameraの不変を担保。**K4BMはDCC/UV実制作技術PASS、しかしART REJECT**。正式ART採用0件、Slope2 DNA0m。

ゲーム本体`web/p101-w9c2-g4e7ci-integrated-streetscape.mjs`の元Git Blob `af076d67492a677d2235e4730aef8cdf4808e106`、本物B48道路7本、B51動体28体、240Hz、球半径0.65m、元Camera全6・UI・速度・当たり判定、元Road5 vertex/face fingerprint `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`は全て変更禁止。main、公式`p101-velocity-overdrive-native-trial`、Draft PR #46、本番2サイト保護。Work/Computer Use/追加課金は事前承認、ユーザーWindows操作要求なし。

## 2. K4BNの作者設計と実装

**この工程では、低品質な多数の巨大な箱・柱・塔を作る手法の主経路復帰を禁止。** 実際の元Cameraでフレーム下半分以上を占める**舗装路面自体**と、無人で白っぽかった道路の先の**港湾の使われ方が読めるシルエット**を優先する。

- `scripts/p101-k4bn-painted-track-atlas.py`：外部画像をコピーせず、Pillowで新規オリジナルの`HYPER RUSH`／`QUAY 05`／`SECTOR 05`と、道路に沿う左右のモータースポーツ案内・斜めの速度感ある記号・刻印・擦れを2048×4096 RGBAの透明レース塗装として描く。検証対象の真正Camera相対座標 `U=(s+60)/150`／`V=(d+65)/275` でマッピング。絵の底を作るのではなく、**既存のRoad5表面の手続き的アスファルト物理表現と混合し、**元メッシュ／材質以外のゲームコード・collisionを1つも変えない。塗装PNGは実Blender原本にpacked imageとして保存。
- `scripts/p101-k4bn-authored-track-harbor-hero.py`：真正親K4BM.blendを読込み、新「K4BN」編集可能研究モデル、船・荷役クレーン・立体海岸地形を本当にBlenderで構築。Road5の実Raycastによる9断面で近景の低い石材と速度感を読ませる控えめなライトレールの設計を実行。旧K4BMの**遠景だけ**を削除せずRender OFFし、既存の手作りUV建築と路面は継承・保持。過去の「視界を塞ぐ大柱」や「太い意味不明なリング・巨大橋」を復活させない。
- 路面先の**本物の貨物旅客船**はRoad5最大前方長`d≈188.8m`の後方`d≈211m`から配置し、切り詰めた船首・船底と船体断面、甲板／航海室／ガラス／デッキ・実ISO貨物コンテナの凹凸や無線マストを持つ。左右には斜めの負荷経路のある2基の荷役クレーンを3D鋼材・斜材・ブーム・フックケーブルから作者制作する。人工港の用途をシルエットで示す。いずれも**非走行のDCC背景**であり道路を架空に延長しない。
- Sea／堆積地形は元道路外であることを明示。海面の水位は本物Road5の道路端相対標高から導出。フレーム外で良い素材でも評価せず、control11307・ultra11341の2枚で元の巨大空白が解消されたかを審査する。
- UbuntuネイティブBlender EEVEE（Xvfb/Mesa Software GL）を使用、Cyclesの未実装OIDNに依存しない。直前K4BMモデルの真編集可能BlenderをArtifactから読みSHA全件照合し、原Road5とCameraの指紋も画像出力前後で確認。
- 本物の`.blend`・同源Camera2 PNG・旧K4BM対K4BN元Camera2視点の中立A/B PNG・元ゲーム/素材/画像SHA JSON・作者透明塗装アトラスを独立確認し、隔離GitHubだけに保存する。視覚の美術判定はこの後、直接実画像を確認して確定。

## 3. 実行トレースとゲート

[専用GitHub Actions](https://github.com/ryomashibaba/dopagaki-development-hub/actions/workflows/p101-k4bn-native-track-and-harbor-art.yml)でSource Nodeテストと真Blender親原本・別カメラの検証を行う。現時点の初回[CI #41770726727](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41770726727)は**結果確認前**。途中FAILが出てもSUCCESS扱いしない。

原GAMEへ移植、FPS、実WebGL2固定ソース同Timeに撮影、HUMAN/SAT/CCD/28物体実クリアランス、長時間プレーの安全性は全て別工程で**HOLD**。正しい画像が出来ていなければ技術的にもHOLD。作成した画像が安っぽければ**ART REJECT**とし、正式ART採用0件、Slope2 DNA0mを維持。美術合格前に他6Roadへコピー増殖・公式ブランチ、PR、本番を変更しない。

## 4. 反省：なぜK4BNは従来の繰り返しと違うか

K4BH〜K4BMの試行でわかったことは、道路を前方から見ているSource Cameraを変えずに遠景に建物だけ増やしても**画面の大半はなお単調なロード**となり、高品質のゲーム背景にはならないこと。本工程では道路自身の画面設計の語彙（ブランド・走行方向・摩擦感・色と形のバランス）と、道路の向こう側の働く船港・海岸線が実Cameraから明瞭に区別できるかを第一審査軸にする。たとえ技術CIが緑でも、美術が完成したとは認めない。


## K4BN初回真正Blender画像の確定評価と不具合修復（2026-11-04）

- 初回[Actions #41770726727](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41770726727)はクレーンの関数外インデントによる`height_m`の`NameError`で**completed/FAILURE**。実元カメラ画像・.blendなし。明示的に失敗の履歴として保持。研究コード修正commit `a0404e60a6ec69717f7701f74bd91d21441079ee`。
- **初回実技術成功**：[CI #41770899381](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41770899381) completed/SUCCESS。親K4BM真正.blend SHA/元Game blob/Node source/元B48 Road5指紋・元Control11307・Ultra11341カメラの座標回転レンズ、Blender EEVEE、RGBAアトラス、真DCC編集原本と2PNGの独立SHA、旧K4BM同元カメラAB、研究枝GitHub保存全PASS。[真正Artifact #13294469287](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41770899381/artifacts/13294469287)、ZIP SHA256 `4b739a171b7b92a2678709b5323be7f395814c69b163ec031ab752ebf5caf8ce`、CRC PASS。編集原本41,360,892B SHA `41f72017d74fa5a09d33cb5773d52f2e7b487ab9e6e446618de79ac3df6bb386`、control画像SHA `b187766786c5a33625700da10837115873cc14deb63bd33ca6e7a1e73688aefd`、ultra画像SHA `8660776d4c1de81f7e4d6763659118ab35805b80b3d7274d90372cfe5958086a`、本物アトラスSHA `8faedfa11c8b3c3ee5e0e8614206230103ada994074646e853422fc8d1e813cb`、比較PNG SHA `d951c8f74b04dfa8d7f200659f14cfd2e4304b18124171774e13580e3ee72588`。ZIP CRC全件と各原ファイルの完全ハッシュを独立照合。
- **初回の美術判定：ART REJECT**。元Camera二画像を直接見た結果、実道路に複数の独創的レース記号、沿道の低いシアン発光、船・実クレーンがレンダーされたことは真実。しかし肝心の`HYPER / RUSH / SECTOR05`の字面が真Cameraで**左右反転**し、controlではレース文字が大きすぎ画面下端に切れ、ultraでも読めない。また真正B48 Road5の起伏で船の船体が隠れ、空間全体では従来の模型感・単調な道・薄い遠景が残り、世界級の美術品質に到底届かない。
- この真のレンダーの失敗を基に、[オリジナル塗装修正commit `8663ab200a17652e5b52afa91d95cd7e75e48302`](https://github.com/ryomashibaba/dopagaki-development-hub/commit/8663ab200a17652e5b52afa91d95cd7e75e48302)：**路面全体を反転するのではなく、文字グリフだけ左右反転**してSource Camera投影で正しく読めるようにし、真Cameraで破綻した大きさを約半分、前方位置も見える場所へ変更。`HYPER / RUSH / SECTOR05`の文字表示の正しさは真の次回レンダリングを見てから認定。
- [船港構図修正commit `fae793a2fb3d2f6401a874917ece2f3d63a3181e`](https://github.com/ryomashibaba/dopagaki-development-hub/commit/fae793a2fb3d2f6401a874917ece2f3d63a3181e)：船が見えない原因は海面が本Road5の見上げる丘状の形状より相当下に位置することだったため、船・海面を**元Road5原メッシュに交差しないd≥196m以遠の非ゲームDCC背景**で+9m引き上げ、船体幅を広げ、荷役クレーンも元カメラ真正画像で見える中央寄りの港側へ移設。元Cameraとロード不変、可走の当たり判定確認なし。
- 最終再試験[Actions #41771580365](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41771580365)は**結果確認前**。途中の試験 #41771544907 は次修正によりcancelledの場合あり。成功の推測禁止。実画像による美術判定が不十分なら**ART REJECT・正式ART採用0件・DNA0m**維持。
