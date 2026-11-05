# 【K4CI 最終：真正Blender単体港湾ランドマーク・独立ZIP CRC/SHA TECH PASS／直接ART REJECT】

**最終確認：2026-11-05 JST。正式ART採用0件、Slope2 DNA正式認定0m。** 以下の「run中」「未取得」は各時点での歴史記録であり、最終判定より優先しない。

## 実制作と独立監査が完了した事実

- **[最終Actions #41966161805](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41966161805) completed/SUCCESS、全ワークフロー工程PASS**。元K4CH実編集可能親 `K4CH_BASALT_AND_COPPER_HARBOR_FULL_FRAME_EDITABLE_ART_HOLD.blend` SHA256 `74dadf53327e7fff0fd3b57a9b9ff369371e2c0fffa43241eb27bee1ca19cace`をGitHub Artifactから取得・実バイトを照合後、真のBlender4.0.2 EEVEEで研究用の港の大規模船舶荷役ガントリーを可編集Meshとして作者制作。研究コード `scripts/p101-k4ci-native-source-locked-maritime-tidegate.py`と独立CI `.github/workflows/p101-k4ci-native-maritime-tidegate-art.yml`を研究枝に保存。
- 実ワールド座標で**幅56m／高さ44m**、元の実ターミナル建築からの接続歩廊72.277m。単なる2D画像・billboard・写真背景ではなく、**640頂点・480ポリゴン**の1つの編集可能な構造用Meshとして左右Aフレーム、耐風Xブレース、二重荷役上梁、支柱横断通路、オペレーター荷役機械室、荷役ケーブルと実ターミナルへの通路を組み上げた。元CHASEが映す実画面で港の荷役機能が一歩読み取れるようになった。
- **元Game Blob `af076d67492a677d2235e4730aef8cdf4808e106`、元Road5全vertex-face SHA `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、元SOURCE 6 Camera/CHASE、木11、全光源、既存K4BZ不正重複Road非表示、元研究物体すべての行列・表示を完全保持**。新ゲームCollider0、元Game WebGL2/物理/本番に変更0。独立QAの元道路中心画像差 **0画素**、左岩壁差 **0画素**。K4BZ既知黒筋6対と元Road5独立5画素の回帰PASS。
- **真GitHub Artifact [#13387547631](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41966161805/artifacts/13387547631)** ZIP **125,772,766B**／SHA256 `dec5baf575b62c77b554bc1b769c082605781fa6c0fd41d17a9e3116451745e5`。本会話で実際にGitHubからZIPを独立再取得し**全ZIP CRC=PASS、編集可能.blendとPNGのバイト数・SHA256全件一致PASS**。真.blend `K4CI_EDITABLE_SOURCE_LOCKED_MARITIME_TIDE_GATE_ART_HOLD.blend` **279,476,100B／SHA256 `f1ce87fff6c88841890b6fc2dd4840db4b35a86be75236d90c02613a26ac7bb4`**。真CHASE PNG `K4CI_TRUE_SOURCE_CHASE_MARITIME_TIDEGATE_NOT_GAME.png` SHA256 `e25f24cfcfa05a1c4d33bfffe661d747994682f3d9b198523f72efb783bde56d`。比較PNG `K4CI_VS_K4CH_REAL_SOURCE_CHASE_ART_REVIEW_NOT_GAME.png` SHA256 `de0395be5eb37d01500d1f2e8926b24d18bd0a9c1eb52ec743ef96c7826a5450`。
- 真CHASE同一768x480の独立PNG A/Bで、右港**9,927画素（上側空間）／3,317画素（右側建築）**の実視認変化を確認。これらは可視性のTECH証拠であり、美術の点数ではない。
- 初回[Actions #41965535258](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41965535258)は実3D/blend/PNG作成まで成功したが、独立QAの右側差分**2,104px**が固定最低基準**2,500px**に達せず**FAILURE**。初回真正画像を直接開いて荷役フレームの下が細く空疎と確認し、**物理的に接続する操作通路と作業トラス・機械室を作者が実増築**。安全閾値や原Road5/Cameraには一切変更せず、修正版の独立QA PASS。旧run #41965424873/#41965499085は途中コード更新によるCANCELLEDでTECH PASS扱い禁止。

## 本物の画像を直接開いたART判定

[**K4CH研究元（左）対K4CI最終（右）の真CHASE比較画像**](research-evidence/k4ci/K4CI_VS_K4CH_REAL_SOURCE_CHASE_ART_REVIEW_NOT_GAME.png)を本会話内で直接開き確認。

右港の大型鋼製荷役ゲートが上部視野に新しく現れ、港に実作業用施設があることを表現できている。以前の小さく見える岬・船・単独屋根のような脇役だけより、右側の高さとスケール感は改善。しかし**ロードの過半画面を占める単調な舗装、左の丸く白っぽい地形断面、右港の地理・活動と実走行の関係の弱さ**が、世界水準の高速ゲームアートとして依然重大。薄い構造物が増えただけで、プレイ時の路面際のスピードリズムはほぼ改善できていない。**正式ART REJECT**。

## 次工程への確定制作方針

K4CJ以降でガントリーをさらに何本も増やす、カメラに映らない岩を増やす、小さな模型や少しの色替えを繰り返すことは禁止。次は**凍結Road5の道路端に沿う連続した実スケールの風防/切土断面・視線誘導・巨大な遠近リズム**を、原物理／元Cameraを絶対に変えず、単一の作者景観構図として研究する。これは元のゲームの速度感に実際に貢献する必要がある。真正CHASEで画像を直接確認し、技術が成功してもARTに満たなければ再びHOLD。必要なら特定の完成イメージまで新たな小物量産を停止する。

**不変の禁止・ゲート：** main、正式P101 `p101-velocity-overdrive-native-trial`、Draft PR #46、原作Slope、凍結Gold、元Game/物理/Road5/Camera、本番2サイトを変更しない。正式ART採用 **0件**／Slope2 DNA **0m**。HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。Work/Computer Use開始は個別事前承認。追加有料API原則0円。ユーザー操作最小。

---

# 【K4CI 初回実DCC画像で得た失敗と修正 — 最新判定はActionsを再照合】

- 初回 [**Actions #41965535258**](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41965535258) は **completed/FAILURE（独立QAのみ）**。本物のBlender4.0.2でK4CH真正原本をSHA固定し、実3D港湾ガントリー**552頂点・414面**を作成、編集可能.blend保存、実CHASE 768×480 PNG描画までは完了。選定した実世界地理：SOURCE前方向 **+70m**、海方向 **+46m**、開口幅 **56m**、高さ **44m**。真正CHASEでガントリーBBox `x=.6796..9275, y=.4758..7892`。元の道路カメラ変更なし。
- 初回の本物のPNGを直接開いた結果、上部大梁とAフレームが右港に実表示されるが、その下の空間が空疎で建物の背後に隠れる。独立右港可視変化 **2,104px** と合格基準 **2,500px**に不足したため、**初回TECH PASSにはしない／ART REJECT**。真Artifact [#13387412094](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41965535258/artifacts/13387412094) は研究用.blend/PNG証拠であり正式成功を意味しない。
- **根因に絞った修正**：最初の実3Dガントリーを壊さず、既存の支柱構造と上梁に物理的に接続する**二重の海上作業キャットウォーク・斜交差耐風トラス・荷役機械室**を真3D梁で加えた。港の仕事内容を構造的に示し、右奥の空白を減らす。可視差分・道路・カメラなどのQA閾値を**一切変更していない**。最終スクリプトcommit `6189f52d3f8786bfddbfd76bbdede705dcb24e56`。
- **真正再試験 [#41966161805](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41966161805)** は本記録時点で実行中。最新result、独立QA、Artifact、実編集可能DCC全バイトSHA/ZIP CRC、真CHASE画像の直接ART審査を済ませる前にTECH／ARTのPASSを言わない。前のrun #41965424873/#41965499085 はコードの上書きによりCANCELLEDであり成功扱い禁止。
- **不変**：原Game・Road5・Camera・木11本・ライト・元研究親形状、main、公式P101、Draft PR #46、原作Slope・凍結Gold・本番2サイトの一切を保護。研究のみ、ゲームCollider増加0、正式ART採用0／Slope2 DNA認定0m、HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。Work/Computer Use個別事前承認、追加有料API原則0円、ユーザー操作0。

---

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
