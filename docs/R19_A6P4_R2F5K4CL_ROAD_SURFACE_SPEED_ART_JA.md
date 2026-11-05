# K4CL — 非衝突研究レイヤーだけで実Road5の視覚的な疾走感を制作

**2026-11-05 JST／ART-FIRST研究。正式ART採用0件・Slope2 DNA認定0m・HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。**

## 継承した状態と前工程の反省

K4CK現行最終研究HEAD `bdbec27c138dca598564901065112fb0a4a511db` から隔離研究枝 `research/k4cl-true-road-surface-speed-art-20261105` を分岐。K4CK A/B真正Blender [Actions #41980948992](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41980948992) はTECH PASS、直接ART両案REJECT。Aは比較上Bより地形と道路の位置関係が整理されているため**新制作の研究比較基準**には使用するが、正式採用ではない。Road5中心に大きく見える灰色の舗装が空間の印象を支配しており、岩壁だけを直し続けても疾走感は改善しないことが確定。今回、人工風防・小物・新しい港の模型を増殖せず、**Road5の見た目自体を本物のBlender非衝突研究レイヤーだけで再作者化**する。

**元ゲームは変更しない。** 保護対象：main `d402801f271f43163ad85d9303abe9773d3958bd`、公式P101 `19d3a32d525c0c2a67082cba646898fab8f2b60f`、Draft PR#46 Open/Draft/未merge、元ゲームGame Git blob `af076d67492a677d2235e4730aef8cdf4808e106`、元Road5全頂点面SHA256 `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、Road7/B51 mover28/240Hz実物理/Collider、SOURCE6Camera/CHASE/木11/灯光、原作Slope・凍結Gold、本番2サイト。Work/Computer Useは個別事前承認、追加有料API原則0円、ユーザー操作不要。

## 真正3D制作

親となる元K4CK真正編集可能DCC `K4CK_EDITABLE_TWO_TRUE_COHERENT_COASTAL_CORRIDOR_DIRECTIONS_ART_HOLD.blend` **SHA256 `80eff12f48b2913d8f700d14f7d84ba86b10dd7ea622033f61fbe51859271330`**をGitHub Actions元Artifact [#13392704993](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41980948992/artifacts/13392704993)から独立バイト検証後にロード。

事前画像から重要な区別：元ゲームの真のB48 Road5メッシュは既存K4BQ工程で研究描画から隠されており、画像に映る灰色の道路は**`K4BQ / physically variegated 26m curved material research test`という研究用道路表示メッシュ**。これを原本として**編集可能Meshの別コピー2件**を作り、元研究道路の実ポリゴン・行列・SOURCE経路を元のまま保持。正式Road5のShape/Physicsは変わらない。この説明を無視して実Road5を直接塗り替えてはいけない。

- **K4CL A — 暗色グラファイトの荒粒アスファルト**：実ワールドのSOURCE進行方向Fと横方向Sをシェーダーノードの実3D座標に結び、長手の粒子模様と微細な骨材感を作る。元K4BQ研究道路のポリゴンを別コピーし舗装中央と肩に異なる材質を割り当てる。中心には3.5m長／14m周期の淡い車線ダッシュを、道路の両肩には約11mごとの控えめな反射帯を、SOURCE地盤高さのレイをもとに**世界空間の本物の塗装薄膜ポリゴン**として制作。画面に貼った速度線ではない。
- **K4CL B — 鉱物系の路面と抑制した伸縮継ぎ目**：Aとまったく同じ凍結Road5とK4CK A岩壁、しかし別の研究舗装シェーダー・実メッシュで、明色の鉱物骨材舗装、やや長いセンターラインと低コントラストの舗装継ぎ目を作者制作。A/Bとも元ゲームCollider0追加。画像の質感を後処理で偽装しない。
- **K4CK Aの元岩盤＋連続擁壁**を比較背景として使用。親.blendではB案表示中だったため、Aと壁を研究用描画に切り替え、Bのみ研究非表示にする。元K4CKのA/B地形・壁の全Mesh頂点データ・行列を維持。元研究K4BQ道路だけも削除せず非表示。すべての変更は**研究レンダーでの4つの表示スイッチ＋4つの新研究編集可能Mesh**だけ。
- 研究コード `scripts/p101-k4cl-authentic-road5-study-surface-art.py`。同一元CHASE768×480真正Blender EEVEEのA/B2枚を生成。真Blender可編集.blendも別名保存。

## QAの変更点（美術方向のため意図したもの）

前工程K4CKまでは「道路中心のピクセル差0」を安全ゲートにしていたが、**今回の目的は研究道路の外観を本当に変えること**。このゲートを今工程の安全基準として維持するのは論理的に誤り。代わりに以下を二重独立検証：元B48 Road5全頂点・面SHA256とゲームBlob・6 Camera・Physics/Collider不変、元K4BQ研究道路のポリゴンのハッシュとコピー全一致、元研究岩盤のポリゴン・行列・正式ソースを不変更、Racing路面中央の真正画像が十分に変わったこと、左の岩場・右の港は意図せず変わっていないこと、A/Bは真の異なる舗装画像であること。さらにK4BZ黒筋の正式ソース不変テストは従来どおり実行する。研究用道路のカラー変更を正式ゲームの路面物理変更と混同しない。

[**初回真正Blender Actions #41983551452**](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41983551452)を本書作成時点で実行開始。**新たな.blend/PNGの完了・全ZIP CRC/SHA・直接ART判定は未確定。** 必ずrunの最新結果を確認し、失敗なら実ログ原因で修正。TECH成功でも実画像を直接開きARTが世界水準に満たなければ正式ART採用は0件のままHOLD。

方針：少量の小物・テストの本数・Blenderの一回SUCCESSが目的ではない。**実際に遊べる、高品質で高速感のある世界を作ることが最上位目標**であり、SOURCE Road5/ゲーム本体はARTを満たすまで保護する。
