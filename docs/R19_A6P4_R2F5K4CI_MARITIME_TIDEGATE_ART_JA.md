# K4CI — 港湾の荷役ガントリーによる「走行視界の奥行き」の実制作

**2026-11-05 JST。研究用DCCのみ、正式ART採用0、Slope2 DNA認定0m。**

## 継承・出発点

K4CH真正作者親 `research/k4ch-basalt-copper-harbor-art-20261105` HEAD `63fe4c0ab8a4c82cce69d9f93e0ef53e9c405a5b` から安全な隔離研究枝 `research/k4ci-maritime-gateway-gantry-real-chase-20261105`を新設。

K4CH [Actions #41957682964](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41957682964) TECH PASS だが直接ART REJECT。真Blender4.0.2／CHASE768×480の直接評価で、左の岩壁と右の銅色屋根は明瞭になった一方、中心と遠景を大きく占める空間は平坦。ユーザーの固定ART-FIRST方針どおり、「岩の色違い・屋根の色違い・箱モデル大量追加」を次の主工程にしてはいけない。道路・Cameraを動かして別の映像を作ることも禁止。

親の実編集可能 `K4CH_BASALT_AND_COPPER_HARBOR_FULL_FRAME_EDITABLE_ART_HOLD.blend` SHA256 `74dadf53327e7fff0fd3b57a9b9ff369371e2c0fffa43241eb27bee1ca19cace`を固定。元のGame Git blob `af076d67492a677d2235e4730aef8cdf4808e106`、Road5全頂点・面SHA256 `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`は元のまま。元6 Camera、凍結CHASE、木11本、全光源、K4BZの元不正重複道路非表示、研究親オブジェクトの行列と表示をすべて保持する。

## 次工程の具体的美術設計

**沿岸高速道路と機能しているフェリーターミナルを、一つのゲーム世界として認識できる「船舶荷役ゲート」**を新しく作者制作する。これは未使用屋根の改変、単なる青色の素材変更、小さなフェリーを増やす工程とは異なる。プレイヤーが固定CHASEで道路を進む時、港の遠景側に実在する工業的な大構造が地理的目印となり、高さ・距離・速度を判断できるようにする。

- 実K4CH銅屋根と既存木質支柱のワールド座標を「既存の港湾」の物理的基準として使用。元の11307 SOURCEカメラから地理的な前方向と海側の横方向を抽出し、**船舶荷役用の単一大型ガントリー**を既存の係留港の右側（原Road5を遮らない側）に配置する。位置は固定CHASEへの実投影で候補を絞るが、あくまでF/SとWorld-Zの実3D構造物であり、画像平面・スクリーンのBillboardではない。
- 物理的に一体の本物の編集可能ポリゴン構造。二つの大型Aフレーム・立体トラスの上梁・海風用X型補剛材・橋渡し梁・鋼製緊張材・荷役ブロック・元ターミナルと繋がる岸壁歩廊を、**1個のBlender Mesh**に作家制作。特定ゲームの原作建物・Road5 colliderには変更を加えない。各素材は作家オリジナルの潮風にさらされた青緑鋼／琥珀色の錆び鋼／鋼製ケーブル／木の歩廊。
- 原CHASE内の港右遠景に一定以上の実表示差分が出る必要があり、もし港建築の奥に隠れたら、TECHやARTに成功と書かない。元の道路中央や左岩壁が画像上でも変わっていないことを独立したPNG A/Bピクセル検査で確認。正式ARTの合否は、数値とは別に**必ず本物のレンダリングを直接開いて**判断する。

新コード：`scripts/p101-k4ci-native-source-locked-maritime-tidegate.py`。

真正CI：`.github/workflows/p101-k4ci-native-maritime-tidegate-art.yml`。元Game blob／Road5全形状SHA・K4CH親Artifact全SHA・全SourceCamera/CHASE/木/ライトを保護したままBlender4.0.2 EEVEEで実3Dを描画。元CHASE同一768×480で旧K4CH vs K4CIを独立QA。可編集.blend・真正PNG・監査JSON・Blenderログを**研究枝GitHubだけに保存**し、Actions Artifactにも記録する。

## 状態と次にすること

[新規真正Actions #41965535258](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41965535258)を実行。**この文書作成時点では最終結論・真正画像・ART目視・ZIP CRC未取得**。前のコード変更によるrun #41965499085はcancelled、旧run #41965424873は旧HEADであり、最新ART判断には使わない。

結果がFAILならジョブログの原因のみ修正し、元Road5・カメラ・最低可視性ゲートを緩めて「成功」に見せない。もし真正BlenderのDCCと独立画像QAが成功しても、それは**TECH PASSだけ**。港の本当の規模感と道路のプレイ視界が自然で魅力的にならなければART REJECT。正式ART 0、Slope2 DNA 0m、HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。

## 永久安全条件

main、`p101-velocity-overdrive-native-trial`、Draft PR #46（Open/Draft）、本番2サイト、原作Slope、物理/元Road5/元GameCamera、凍結Goldは変更禁止。Work/Computer Useは個別事前承認。追加有料API原則0円。ユーザー操作最小。
