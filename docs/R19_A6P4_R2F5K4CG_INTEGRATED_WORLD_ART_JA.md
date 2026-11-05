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
