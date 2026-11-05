# 【2026-11-05 K4CG R2最終：真正統合Blender DCC・独立ZIP/CRC/SHA PASS、直接画像ART REJECT】

**確定判定：K4CG R1/R2ともソース保護・真正Blender・レンダリング・独立証拠TECH PASS、全画面ART REJECT。正式ART採用0件・Slope2 DNA認定0m。元ゲームWebGL2実装・人間プレイ・FPS・SAT・CCD・MERGE・公開は未実施/HOLD。**

## R2実制作と独立検証

- 完成した最終研究[**GitHub Actions #41942878730**](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41942878730) は**completed/SUCCESS（全手順PASS）**。中間[#41942840961](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41942840961)はWorkflow編集によりキャンセルであり成功扱い禁止。親K4CF R2真正.blend SHA256 `1a17dc522b4d7df85c92023df5b580f1e5fe155b27264dfcb9d7a511d99d8533`を固定し、新研究作家DCCのみ変更。
- **初回R1では新旧比較の左岩肌変更が1,860画素しかなく、元K4BQ研究地形が新岩面を遮っていた。** R2では元K4BQ研究下地を非破壊に複製し、実526頂点を浅く変形してマテリアルを統一。元K4CD研究海面も原本保存の研究複製へ置き換え、沖合の外洋3Dメッシュと接続した。遠くに見える岬を同じ海上の実世界座標へ配置し直し、画面投影x=.561664〜.81425、y=.474252〜.656241の1127頂点の岩場を生成。外洋3053頂点、研究編集可能メッシュ計5件。**元Game/道路/Camera/物理/木11/照明・旧岩などのジオメトリ不変、表示切替は研究コピー元だけ**、Collider追加0。
- [**GitHub Artifact #13377510776**](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41942878730/artifacts/13377510776) ZIP **125,032,903B**, SHA256 `33dd91b49067b2832fded8c9e7f438f836ce36edf516ae8c68e1ff711e4d5cc9`。本会話で原ZIPを独立ダウンロードし、**全ZIP CRC PASS・監査JSON内.blend/PNGの実バイト数と各SHA256全件一致**を検算。真正編集可能Blender原本 `K4CG_INTEGRATED_COASTAL_WORLD_GEOMETRY_EDITABLE_ART_HOLD.blend` **277,556,784B**、SHA256 `5a2215677fd41c420bac3b44b78b65b0e42aa74b79399498a87a57b7b85946f1`。真正CHASE画像SHA256 `d96411f4dc77fbb67d2b8eeea2037dfe49de7a5c0a79d5ed80127c999f1aa9f6`、比較PNG SHA256 `b0fb67c1f8163973d9b8152cd3e15587d8a524a13fdd9a739eb30265416ac52a`。
- [**K4CG R2対K4CF R2の真正同CHASE比較PNG**](research-evidence/k4cg/K4CG_VS_K4CF_R2_TRUE_CHASE_INTEGRATED_WORLD_ART_REVIEW.png)を実際に直接開いた。左岩肌3,733画素・海遠景1,785画素・港1,142画素に可視差があるが、元Road5保護画面差0。**実際の全画面では左の白く柔らかい砂丘/雪山感が残り、岬は屋根の後ろで尖った1～2個の小岩にしか見えない。** 海と港の使用目的・スケール・地平線・速度感も依然として成立しない。初回からの改善幅は美術採用基準に達せず、**R2もART REJECT**。可視画素数はTECHの変化指標でARTの点数ではない。
- 真正Blender4.0.2 EEVEEの同一768×480 CHASE研究画像である。Source original WebGL2/実走行映像ではなく、元ゲームの実安全・SAT/CCD/240Hz/HUMAN/FPSや正式美術認定を試験したものではない。

## 失敗への明確な反省／次工程への固定条件

R1/R2で「**新研究オブジェクトの個数・頂点数・実マテリアル・見えているピクセル差は確実に増えたが、画面に支配的な道路・左地形・右港が構図として良くならなかった**」ことが明確になった。これ以降、同じ遠景を増殖させる、地形の色だけを少し変える、微細なプロップを敷く、CI技術合格件数だけを増やす工程は主経路から外す。

次は**源流の道路/Cameraを凍結したまま研究DCCの可視主要空間を統合的に作者が根本再設計する単一の大きな工程**を選ぶ。具体的には左実崖の断面形状とその道路肩への接続、右港の岸壁・海面・建物の実際の用途の見える関係、中心遠景の地理と走行時の速度感を、原CHASE実画面の最終構図から逆算して制作・真正Blender評価する。調整するのは研究専用メッシュに限り、元ROAD5・物理・6 Camera/CHASE・原作SOURCE・本番サイトを変更しない。正式採用0件／Slope2 DNA0mを続行する。Work/Computer Use個別承認・追加課金0円・ユーザー操作最小。

---

# K4CG — 沿岸世界全画面の作者景観、真正Blender、直接ART審査（2026-11-05 JST）

**正式ART採用0件／Slope2 DNA認定0mを維持。** SOURCE/GAME、正式P101、Draft PR #46、main、原作Slope、本番2サイトを変更しない。

## 継承した実績と制作目的

K4CF R2最終HEAD `65e0c0777c069423184bf357d84d83fdcc3996fb`から研究枝 `research/k4cg-integrated-coastal-worldscape-20261105` を新規分岐。親となる**真正編集可能Blender原本**`K4CF_TWO_REAL_GEOLOGICAL_HEADLAND_DIRECTIONS_EDITABLE_ART_HOLD.blend` SHA256 `1a17dc522b4d7df85c92023df5b580f1e5fe155b27264dfcb9d7a511d99d8533`。K4CF R2は実DCC TECH PASS、全画面ART REJECT。R2の左海岸地形は白い砂丘風、右港は模型的で海・遠景の関係が弱く、巨大な道路の視認面積とのコントラストが不足。

**作者制作の方向性は全画面の統合された自然環境の品質**。小型模型、船、標識、樹木、箱を増やさない。元Gameと原Road5を変更したり、カメラ位置を移して合格に見せかけることは禁止。海と港の物理的な高さが一致し、左側の地質と右沖合の水際が同じ世界の地理であることを本物の編集可能メッシュとマテリアルで表現する。画像の背景貼り・遠景写真・Billboardではない。

## 実装

- `scripts/p101-k4cg-native-integrated-coastal-worldscape.py`：元K4CF R2の左風化岩を不変で複製し、世界座標で方向のある地質マテリアルと実ポリゴン法線の岩割れに置換。海と同じ元の水位を基準に、1127頂点の沖合の連続した削剥された実3D岬と、3053頂点の実世界規模の外洋水面を制作。親海・元フェリー・元道路は不変。
- 初回[**Actions #41941951080**](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41941951080)は**completed/SUCCESS**。Blender EEVEE同CHASE 768×480実画像・編集可能別名保存・独立QA・研究証拠pushを全ステップ完走。真正編集可能.blend 277,325,320 bytes SHA256 `b3268638946437e7f31c906eb729f5f95d949cdf1837d109c950aa57dc5461a9`。真[Artifact #13376728614](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41941951080/artifacts/13376728614) ZIP124,877,124B SHA256 `9e96115267d84e4296ed5e4d7433baba643deb9e0e6dcdabee31b007f373f48a`、GitHubから再ダウンロードした原ZIPの**全CRCと.blend/PNG SHA一致**を実測。元Game/Road5/CAMERA/木11/ライト保護PASS、道路中央画像画素差0。
- 初回[**真正同一CHASE画像比較**](research-evidence/k4cg/K4CG_VS_K4CF_R2_TRUE_CHASE_INTEGRATED_WORLD_ART_REVIEW.png)を直接開いて**ART REJECT**。新3D岬は右ターミナルの背後の小さな角形2つとしてしか読めず、世界全体のサイズ・海とのつながりを表現しない。左岩肌の画像差1,860pxしかなく、画面手前に残った白いK4BQ研究下地が新しい岩材質を遮っていた。右水平線の差分807px、港1,139pxで、ART品質が実質改善せず。**初回TECH PASSを美術合格と混同しない**。

## 画像の欠陥に基づいたR2（同一研究親、非破壊）

上記の実画像で見えた遮蔽原因に対し、既存`K4BQ / EAST_SLOPING_HILLSIDE authored subdivided eroded native `研究地形も元データを保存したまま可編集複製し、岩の色・断層の浅い実頂点変形を直接施して元研究下地の表示だけを切替。既存K4CD港水面も元オブジェクトを保存したまま自然海色の可編集複製にして、延長海と同じ物理的水面・材質に接続。元K4CFの旧岩と元研究海は消去せず`hide_render`の研究切替だけ許す。形状への変更は**研究用新複製だけ**。

沖合岬のワールド空間配置も右端の建物後方に隠れる案を避け、実CHASE中央右の空いた遠景を狙う方針へ修正。本道路とカメラの位置/視野を動かすことも、道路映像に侵入する形状を認めることもない。製作の全ては真Blenderの編集可能形状。

R2コードとWorkflow `.github/workflows/p101-k4cg-native-integrated-worldscape-art.yml`はGitHub研究枝に保存。対応する最新[Actions #41942878730](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41942878730)はこの記録作成時点で実Blender描画中、最終結論・新Artifact・直接ART審査未確定。中間CI #41942840961は研究スクリプト後続更新によりキャンセル対象であり、TECH合格として扱わない。**必ず最新runを確認して状態を書き換えること**。

## 不変の安全条件

原Game Blob `af076d67492a677d2235e4730aef8cdf4808e106`、元Road5全頂点・面 SHA256 `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`。元B48 Road7/B51 mover28/240Hz/0.65m球・元6 Camera/CHASE・木11・灯光・元GAME physics・公式P101・Draft PR#46・main・本番2サイトに変更ゼロ。

**正式ART採用0件／Slope2 DNA認定0m／HUMAN・SAT・CCD・FPS・RELEASE・MERGEは全部HOLD。** 追加有料API原則0円、Work/Computer Use個別事前承認、ユーザー操作不要。次に進む場合はR2真正PNGを開いて全景を審査し、ART REJECTならまた多数の地質素材・人工島モデルを増殖せず、**実画面に価値のある構成の大幅な設計変更**へ切り替える。
