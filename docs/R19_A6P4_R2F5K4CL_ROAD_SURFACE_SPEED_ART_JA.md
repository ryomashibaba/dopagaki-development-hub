# 【K4CL最終：本物の研究舗装A/B・真正Blender・独立ZIP/CRC/SHA TECH PASS／実画像ART REJECT】

**2026-11-05 JST。これが確定した最終結果であり、下段の「queued」は古い時点の記録。正式ART採用0件、Slope2 DNA認定0m、HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。**

## 本物の3D造形、2つの実CHASE画像、独立検証完了

- **[Actions #41985567281](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41985567281) completed/SUCCESS、全12工程成功**。元K4CK真編集可能Blender親 `K4CK_EDITABLE_TWO_TRUE_COHERENT_COASTAL_CORRIDOR_DIRECTIONS_ART_HOLD.blend` SHA256 `80eff12f48b2913d8f700d14f7d84ba86b10dd7ea622033f61fbe51859271330`を真正GitHub Artifactから取得・SHA固定。元ゲームGit blob `af076d67492a677d2235e4730aef8cdf4808e106`、元Road5全頂点/面 SHA256 `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、元6 Camera/CHASE、元11木、全光源、全既存メッシュ座標の厳密照合PASS。元のゲーム物理・Colliderは未変更。新Game Collider追加0。
- **真正Blender4.0.2 EEVEE**で、元K4BQ研究道路（非ゲームCollidable）の形状をSHA認証し、**同一形状の2つの独立した非衝突道路研究Mesh**へ新材質を直接適用。A＝ワールド進行方向と骨材粒子に沿う暗色グラファイト・アスファルトと路肩材、B＝風化した鉱物舗装と実際の継ぎ目。さらに元SOURCE道路地盤高を参照した2つの**編集可能な世界空間の真のポリゴン塗装**（A46面、B26面）を作成。合計研究新規Mesh4件。画面に描く線やBlenderコンポジットでの虚像ではない。A/BともK4CK Aの道路沿い海岸岩盤・実石造擁壁を背景に使用、画面中で同一SOURCE CHASE768×480の真のBlender画像をそれぞれ作成。
- **真正Artifact [#13396116054](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41985567281/artifacts/13396116054)** ZIP **127,363,725 bytes**／SHA256 `395c828a1ec289569c7c077d4326502add473d76699eb7a4f3ad4d3061e5a280`。本会話でGitHubから再ダウンロード、ZIP全CRC/各.blend・PNGバイト・SHAをストリームで独立検証しすべて一致PASS。編集可能.blend `K4CL_TRUE_EDITABLE_DUAL_PHYSICAL_PAVEMENT_STUDIES_ART_HOLD.blend` **282,087,560B** SHA256 `2b5288333b3b633649aefd349fbdc79837775719a6175eba23d72dbdbada7da1`。真正A PNG `K4CL_A_TRUE_CHASE_GRAPHITE_RACING_ASPHALT_NOT_GAME.png` SHA256 `ef65ca08caded92e7ed0fcb824341438e7082ce7427e74f1ff2b5ac4cb693d1b`、真正B PNG `K4CL_B_TRUE_CHASE_MINERAL_HIGHWAY_ROAD_NOT_GAME.png` SHA256 `477fc7d06cdc2c2e386cc6b772f1646c07dba84d22e5fa6f4e98134199cc15db`。真正3画面比較PNG `K4CL_K4CK_TRUE_CHASE_ROAD_SURFACE_A_B_COMPARISON.png` SHA256 `03918af03a1547cb404bb8f4aedbc1eb057ac5c78d87af04149f7b2e9221bb32`。
- **独立A/B画像QA**：旧K4CK Aを基準に本物の路面がA **33,097画素**、B **33,101画素**それぞれ変更（閾値12）。A vs B道路差 **36,489画素**。路面中央3点ではA/B両案とも前作から14階調を超える変化を確認。**元の左岩壁・右港の画像差はいずれも0画素**。今回は元道路を意図的に塗装しなおした研究のみを変えたので「道路中心ピクセル0」の旧限定QAを要求しない。代わりに元Road5完全形状SHAと元K4BQ研究道路メッシュ形状SHA `6e5241e0b519f40d62cffe43771accf98510c54b87519ca0c3d01199f2840f38`を研究A/Bの各コピーと完全一致で保証。真のRoad5を新しい舗装に置換・上書き・Game配布したわけではない。

## 最終実画像を直接開いたART判断と反省

[**K4CK A旧舗装（左）／K4CL暗色A（中央）／K4CL鉱物系B（右）の真正同CHASE画像**](research-evidence/k4cl/K4CL_K4CK_TRUE_CHASE_ROAD_SURFACE_A_B_COMPARISON.png)を実際に開き、A/Bの個別の本物のPNGも直接観察した。

- **相対的にはA（暗色グラファイト・アスファルト）が大幅に有望**。旧路面の広い灰色一枚板の見た目から、より自然な路面骨材、実3D進行方向の模様、複数の本物の路面車線マークによって道路自体の視覚的な進行方向を強調できた。真のゲーム物理や速度が改善された証拠ではない。**正式ART PASSとは認定しない**。
- B案は風化した鉱物系舗装という別デザインだが、画面の大面積で白灰色に見え、岸壁・背景と差がなく、疾走のための道路の奥行きとコントラストに劣る。今後の主方向としてはAを比較基準に残し、Bは研究資料としてだけ保存。
- **両方ART REJECT**。道路外観が目に見えて改善しても、左側の切土が不自然に一定で自然な巨大地質の層とレース世界としての説得力が弱い。右港の銅屋根や荷役ゲートも用途に対する空間規模と港湾生活が玩具的。道路の直線的な視界が画像の大部分を占め、疾走感の実ゲームプレイ評価/HUMAN/FPSはない。高品質ゲーム完成の宣言や世界水準の正式ART採用を行わない。

## 全失敗の因果関係と復旧

1. [初回Actions #41983551452](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41983551452)は実Blender研究コピー/塗装の形状生成まで実行したがBポリゴン18枚＜作者検証26枚で安全停止。新.blendやPNGの保存前に失敗。
2. [修正版Actions #41983863947](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41983863947)は**Blenderの編集可能.blend＋真正A/B PNG完成／ZIP全CRC・各SHA256独立PASS**だが、独立画像QAのA舗装中央点`(365,335)`で差14階調、`(410,380)`で差13階調と基準`>14`に満たずFAIL。Aの現実画像が旧灰色に近すぎるのが根因（Bの同3点は40階調以上）。技術SUCCESSとして水増ししてはならない。
3. 原本Game/道路/Cameraに触れず、実3Dの**Aグラファイト舗装Materialのベース色・コントラストだけを大きく下げる作者修正**を加えた（commit `43826e0137b177a7c4827e22d8b9d14be338ff80`）。**独立QA画素数・閾値・原SOURCE認証は一切緩和していない**。その実修正版 [#41985567281](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41985567281) を成功まで確認・元Artifact独立再検算完了。

## 次のK4CM工程へ一貫継承

**K4CL Aの暗色道路を暫定研究美術基準に固定（正式採用ではない）。BおよびK4CK A/Bの元親研究を編集可能原本に保存。** 同じ道路色・車線ダッシュの小変更を延々繰り返さず、K4CMは元Road5/元6 Camera/実物理を凍結したまま、**大断面の自然地形と走る路面の交通土木・右の港湾空間の関係を、一つの世界の実スケールで作家制作**することを検討。実ゲームの高品質な走行を最重要とし、Blenderスクリーンショットをゲームの真正人間プレイ証拠と偽らない。ARTとHUMAN/FPS等のゲートは再検証までHOLD。不要な小QAループや小物増殖を避ける。

**永久保護** main、公式P101、Draft PR#46、元SOURCE・Game、元Road5/全物理/Camera・凍結Gold、本番サイト。Work/Computer Useは個別事前承認、追加有料API原則0円、ユーザー操作0。

---

# 【K4CL試験履歴：初回失敗・実コード修正・最新再試験の状態】

- 初回真正[Actions #41983551452](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41983551452)は**completed/FAILURE**。元Game/元Road5/親K4CK.blend全SHA認証、Blender4.0.2インストール、K4CL研究舗装2コピー・A実標示メッシュ・B実標示メッシュ作成までは実行。しかし作者コードがB案もA案と同じ最低26以上の塗装面数を要求し、当初Bは意図した疎なデザインで18面しかなかったため、`assert len(vv)>100 and len(ff)>25`で安全停止。**新.blend保存も画像の実描画にも到達しておらず、TECH PASSやART評価と誤記しないこと**。
- 修正は**研究B案の標示実物を増設**し、交通標示と鉱物路面の継ぎ目の実間隔を変更：縦方向15mの中央ダッシュ12組と12m間隔の鉱物舗装目地14組で**計26面（104実頂点）**とした。QA顔色を変えて閾値を下げたり、元Road5・元カメラ・Game/Physicsを変更していない。修正SHA commit `fc13208b6f72bc1caf918f0bd1ead4c6e8561378`。
- [修正版Actions #41983863947](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41983863947) をGitHub実行キューに登録済。本記録時点の実行状態は**queued（実画像・新.blend・ART結果なし）**。**次に呼び出すChatGPTはこのrunの最新ジョブ・ログ・Artifactを先に確認**する。完走なら実ZIPを独立ダウンロードして全CRC・SHAと画像の直接ART判定を行い、結果をこの文書とSTART_HEREに追記。もしqueuedのままなら、時間が経っただけで成功と記載しない。
- 元Game・元Road5全ジオメトリ・カメラ・木11・全ライト・K4CK A岩盤は凍結。意図的に変更するのは研究路面の見た目だけ（新4研究Mesh+4研究表示切替）。新ゲームCollider0、正式ART採用0、Slope2 DNA認定0m、HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。main/P101/PR#46/本番保護、Work/Computer Use個別承認・有料API追加0円・ユーザー操作0。

---

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
