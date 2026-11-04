# 【2026-11-04 K4BM 最終正本】本物の作者UV・材質研究TECH PASS／ART REJECT

**最新研究継続枝**：`research/k4bm-uv-pbr-authored-hero-20261104`。K4BM実行・検証・目視美術判定・今後の制作条件は[**K4BM全監査文書**](docs/R19_A6P4_R2F5K4BM_NATIVE_UV_PBR_ART_JA.md)を最優先。過去K4BL以下に「最新」と書かれていても履歴。

- **実技術最終判定SOURCE/BLENDER_UV_PASS**：[Actions #41757027430](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41757027430) はcompleted/SUCCESS、Blender 4 EEVEEで元Camera control11307/ultra11341の2枚を真レンダリング。真正[Artifact #13288142972](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41757027430/artifacts/13288142972) ZIP SHA256 `1a394c2649f109dc4f360f1fb52539cfca5731555fc0f3d63666c4b2d30aed21`、編集可能BLEND 39,880,852B sha `7297b0ea17ffacb7f2c84cecf901947ce11de4e0a91ff4c93703f43cbe7b4a80`。実UVを備えた独立研究メッシュ296件、同じCameraの旧K4BLとのA/B画像、SHA JSONをGitHub保存・独立ZIP全CRC/全sourceファイルSHA再検証済み。
- **真正画像の美術判定ART REJECT**。UV/道路粗さ・窓枠・ガラスは技術改善、遠景の大型単純柱は第2修正で除去した。しかし両真Cameraで路面が画面の大半、遠景は薄く空白が大きい。世界水準の高速3Dレーシング美術に全く届かない。正式ART採用**0件**、Slope2 DNA正式認定**0m**。新研究DCCをゲーム正式採用としない。これは**実WebGL2ゲーム画面ではない**。初回[CI #41756146305](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41756146305)はPython変数参照ミスでFAIL、初回成功[CI #41756329982](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41756329982)の美術もREJECT、最終 #41757027430まで失敗と反省を記録。
- **K4BN次工程の固定計画**：単純な箱/屋根/柱を多産する方法に戻らず、実ゲームSource Cameraで実際に見える**道路の素材／コース造形と近景、遠景の港の用途・自然地形・レース速度の表現**を高密度作者制作で完成する。ARTとゲーム機能・安全/FPSは別検査。美術正式承認前に他6Road横展開やゲーム統合、本番公開をしない。必ず元CameraのDCC画像と可能なら実WebGL2撮影を別々に監査。
- **不変更契約**：元ゲームGit blob `af076d67492a677d2235e4730aef8cdf4808e106`、真Road5 mesh fingerprint `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、B48実7／B51実28／240Hz／球0.65m／元Camera6の全部／操作・安全表示不変。main／公式`p101-velocity-overdrive-native-trial`／Draft PR #46／本番2サイト保護。Work/Computer Useは事前承認、ユーザーWindows操作不要。ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。

---

# 【2026-11-04 K4BM 最新継続入口】原物Road5＋Sourceカメラ・手成形実UV/PBR美術制作

本研究継続ブランチ：`research/k4bm-uv-pbr-authored-hero-20261104`。次の作業では最初に[K4BM新作者メッシュ／UV-PBR／制作ログと厳格美術判定](docs/R19_A6P4_R2F5K4BM_NATIVE_UV_PBR_ART_JA.md)を読むこと。過去K4BL以下の「最新」は履歴。

- **前K4BL**：真実のSource Camera 2枚とBlender .blendのSHA／元Road5 geometry検証済み [#41751060525](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41751060525) completed/SUCCESS、ただし実画像の美術評価は**ART REJECT**。正式採用ART0件、Slope2 DNA0m。
- **K4BM実制作**：新`scripts/p101-k4bm-authored-uv-pbr-coastal-hero.py`で、元K4BL編集可能BLEND（SHA256 `220855d6500a74697e41b9bad36cb5c20654ea77d8c8a4be48d5ebf9a4ab2488`）を厳密読込。元Source Road5メッシュ実測9地点と全6 Camera固定。旧不採用ARTを消さずRenderOFF。道路面の細かい骨材と粗さ、石材／陶板／銅色の**作者UVとマテリアル**、実3Dの建築奥行き・海岸地層、公共室内・港湾遠景を手作り構造で制作する。
- [初回CI #41756146305](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41756146305) は植栽の未定義変数`R`で**失敗**。研究コード修正commit `3841be073af6edfad77912974fa03c255d5fde0e`、[再試験CI #41756329982](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41756329982) を実行中。必ず**最新 run 状態と新原本.blend・元Camera control11307/ultra11341実PNG・SHA・実UVマップを検証してから**技術PASSを記録し、画像を直接見てARTを判断。CI passはART passではない。新DCC画像は**実WebGL2ゲーム画像ではない**。
- 固定不変：ゲームBlob `af076d67492a677d2235e4730aef8cdf4808e106`、Source Road5 mesh fingerprint `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、B48元7/B51元28/元Camera6/240Hz/球半径0.65m/安全表示・物理。main／公式p101／Draft PR#46／本番2サイト保護。Work、Computer Useには事前個別承認。ユーザーにWindows操作要求なし。
- 正式ART採用0件・Slope2 DNA認定0m。ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGEはHOLD。ART合格前の他6Road横展開・ゲーム本体移植は禁止。

---

# 【2026-11-04 K4BL FINAL 正本】元Road5/CAM源保護・港湾美術TECH PASS／ART REJECT

継続する**最新隔離研究ブランチ**：`research/k4bl-harbor-atmosphere-art-reconstruction-20261104`。必ず[2026年11月4日・K4BL本物の編集可能Blender画像・CI・全反省・次工程K4BM美術制作転換](docs/R19_A6P4_R2F5K4BL_COASTAL_HARBOR_ART_DIRECTION_JA.md)を最初に読む。過去K4BK以前の見出しにある「最新」は履歴。

- **最終K4BL TECH**：[Actions #41751060525](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41751060525) completed/SUCCESS。EEVEEネイティブBlender本物DCC、元source Camera control11307/ultra11341の画像二枚、前K4BK同位置A/B比較、全SHA実検証・研究枝GitHub保存PASS。真[Artifact #13286275694](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41751060525/artifacts/13286275694)、ZIP SHA256 `cdcd49068a837e68d155b01824c720f216edeb3c50abe17919e90bc4c9b41b12`、編集可能.blend 36,684,824B SHA `220855d6500a74697e41b9bad36cb5c20654ea77d8c8a4be48d5ebf9a4ab2488`。
- **美術最終判定：K4BL ART REJECT**。実画像は旧巨大横断梁が消えて見通し改善、路面の色とノイズが改善したが、路面の画面占有が非常に大きく、左右は薄い巨大屋根、遠景は単純な塔＋白い空虚な水平線、港の海・生活・地形の読み取れる情報が不足。3D看板は一部見切れ／建物に隠れる。**世界水準の完成として扱わない**。正式ART採用0件、Slope2 DNA正式認定0m。
- 旧中間[CI #41749501857](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41749501857)はLinux libEGL欠落でFAILURE、[CI #41749843377](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41749843377)は次の修正でCANCELLED、初回修正版 #41749970400はSUCCESSだがART REJECT、第2修正版[CI #41750596888](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41750596888)は未定義Blender材質でFAILURE、最終 #41751060525 で修正成功。失敗を成功と呼ばず、実作品を継承。
- **K4BM次工程**：旧大きな箱／長い波型屋根／安価な色塗りのプログラム生成を停止。実寸Road5と元Camera6の完全不変を前提に、本物のUV・高精細PBR・実公共空間を持つ作者メッシュ・海岸地形・港湾機能・遠中近景・ドラマのある照明を、高品質なヒーロー一画面で先に完成させる。**承認されるアートが出るまでゲーム統合/他6Roadへの展開を許さない**。実WebGL2同元CameraフレームとSAT/CCD/FPS/HUMANは未検証。
- 凍結元Game git blob `af076d67492a677d2235e4730aef8cdf4808e106`、本物Road5 mesh fingerprint `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`。B48元7・B51元28・240Hz/球半径0.65m・元6Camera・安全表示不変、main/公式p101/Draft PR#46/本番2サイト保護、Work事前承認、ユーザーWindows操作不要。ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。

---

# 【2026-11-04 K4BL 現在の作業入口】Road5実寸の港湾景観ART-FIRST全面改修

**継続研究ブランチ**：`research/k4bl-harbor-atmosphere-art-reconstruction-20261104`。[今回の上位方針・実制作コード・厳密な美術受入・真正CI実行記録](docs/R19_A6P4_R2F5K4BL_COASTAL_HARBOR_ART_DIRECTION_JA.md)を最初に読む。

直前K4BKは本物のsource Road5測量9断面とBlenderネイティブDCC技術PASS・**ART REJECT**。正式採用0件／Slope2 DNA0m。薄い橋や前景の巨大壁、単調な灰色道路と水平線が主な問題。単純な箱増殖を繰り返すな。

K4BLでは旧K4BK/BJ/BI/BH不採用美術レイヤを保持したまま描画のみOFF。真Road5をBlender内でRaycastしたCamera相対d,s,zで近景を低い海岸路側と植生・中景を公共図書館とフェリーターミナル・遠景を港湾都市、観測塔、船用クレーン、海と崖の地形として制作した。目標は**画面全体のビジュアル**であり、モデル数やマテリアル数は合格根拠でない。旧画面の構図から根本的に変更。**真元source Camera control11307/ultra11341の数値は不変**、本物のBlender原本と両画像、前K4BKと同視点比較、独立SHAが必須。

[Actions #41749501857](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41749501857) は実CI状態とArtifactを必ず確認すること。**まだ美術合格を宣言していない**。元ゲームのWebGL2画像ではない。DCCレンダリング成功=美術PASSではない。世界品質に届かないならART REJECTと正式採用0件／DNA0mを維持。

元ゲームGit blob `af076d67492a677d2235e4730aef8cdf4808e106`／Road5 source mesh fingerprint `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、240Hz・球半径0.65m・B48実7・B51実28・元6Camera数値・安全案内不変、main／公式p101／Draft PR#46／本番2サイト保護。Work事前承認、ユーザーのWindows操作最小。SAT/CCD/HUMAN/FPS/RELEASE/MERGE/ART全HOLD。ART審査前の実ゲーム統合・他6道路への展開禁止。

---

# 【2026-11-04 K4BK最終引継ぎ入口】本物B48 Road5測量・Blender DCC技術PASS／ART REJECT

最新研究隔離枝：`research/k4bk-ground-truthed-civic-roadside-20261104`。次のチャットは[実物道路9地点の測量、真Source Camera画像の美術評価、全実行・失敗反省をまとめたK4BK正本](docs/R19_A6P4_R2F5K4BK_ROAD_CALIBRATED_CIVIC_ART_JA.md)を最初に読む。旧K4BJ・K4BI以前の「最新」表記は履歴。

- 9地点のSOURCE B48 Road5実物Raycastと左右境界／道路高さ確認は **PASS**。−25〜+170mのCamera前後方向にて2m刻みの路面側面サンプリングが全地点成功。旧来のd550m・s±170m以上に誤配置した街区構造とは異なり、今回のDCCモデルは測定した道路に沿って制作した。
- [K4BK最終修正版CI #41747761082](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41747761082) **completed/SUCCESS**。[本物の編集可能Blender DCC・元Camera control11307/ultra11341 2PNG・旧K4BJとのA/B・独立sha JSON Artifact #13284094495](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41747761082/artifacts/13284094495)、ZIP SHA256 `86879b1dd3a4a03ed7cb9d6db676cd2ba971dc2a3e9b61a39f9ac80dbd910904`。BLEND/PNG全SHA独立照合OK。初回[CI #41747047424](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41747047424)も技術SUCCESSだったが、極めて巨大な無地の外壁と連絡梁で美術REJECT。修正版は屋根を薄くし実寸開口と奥行きのある室内を設計し、旧より画面両側は少し改善。
- **ただし最終K4BKもART REJECT**。実画像を直接見て、安っぽい長い道路、平板な商業建築、青緑の単純な橋、空白の多い遠景と空気感の欠落が残る。SOURCE測量成功、DCC技術PASS、128編集可能モデルはART合格ではない。正式ART採用0件／Slope2 DNA正式認定0m。これは実WebGL2ゲーム画面ではない。
- **次工程K4BL**：正しいRoad5実寸を維持しつつ、「大きい屋根や箱を増やせば都市に見える」という制作を停止する。道路面の本物の質感・路側の高精度セット/土地利用・人が使う公共内部/自然との接続・都市遠景・照明・カメラ構図を一画面の商用水準の美術に高める。まず真の美術イメージ/3D実原本とsource Camera比較で審査し、合格前に実ゲーム統合・他6Road展開は禁止。ゲーム実WebGL2の同Camera検証も必要。
- 不変保護：元ゲームgit blob `af076d67492a677d2235e4730aef8cdf4808e106`、元Road5指紋 `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、240Hz/球半径0.65m／元B48全7・B51全28／Camera6／安全表示、main、公式`p101-velocity-overdrive-native-trial`、Draft PR #46、本番2サイト変更なし。Work個別承認制、ユーザーWindows操作不要。ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。

---

# 【2026-11-04 K4BK 新しい継続入口】元Road5の実寸座標に建築を合わせたART-FIRST研究

最新研究隔離枝：`research/k4bk-ground-truthed-civic-roadside-20261104`。必ず[K4BK真正道路実寸を用いたBlender制作・不変条件・美術審査正本](docs/R19_A6P4_R2F5K4BK_ROAD_CALIBRATED_CIVIC_ART_JA.md)を先に読む。K4BJの**実測発見**とART REJECTを継承し、旧来のCamera前方550m・横±160m以上というRoad5の尺度と噛み合わない建築を再利用しない。

- [K4BJ実道路測量](docs/research-evidence/k4bj/K4BJ_REAL_SOURCE_ROAD_CAMERA_SCALE_SURVEY.json)で真Road5 Camera前方0〜25mの頂点横位置−39.162〜+53.261m、100〜150mで−38.821〜+69.255m、前方の最大到達188.774mと実測。これは安全可走幅ではなく幾何の頂点分布。
- K4BK `scripts/p101-k4bk-true-road-civic-corridor.py` をGitHub保存済み。真正元Blender・元Road5・元Cameraを厳密SHAで保持したまま、9地点の真Blender RaycastでRoad5左右境界と高さを採寸し、その**道路外**に歩行者用街並み・西陶板図書館・東港湾ターミナルを構築、実Camera前方約132〜157mにガラス空中公共駅をデザインする。旧模型ARTは削除せずRender OFF。元Road5はDCCマテリアル以外変更しない。
- [専用実制作CI #41747047424](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41747047424) は実結果を必ず再照会。真正control11307/ultra11341のDCC元カメラ画像、編集可能.blend、独立SHA、旧K4BJ同Camera比較、研究隔離枝へ画像保存を試みる。成功・ART合格は実検証前に断言しない。
- 不変更：ゲーム blob `af076d67492a677d2235e4730aef8cdf4808e106`、元Road5 fingerprint `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、元6Camera／B48実7道路／B51実28動体／240Hz／球0.65m／ゲーム安全表示、main・公式`p101-velocity-overdrive-native-trial`・Draft PR #46・本番2サイト。Work事前承認、ユーザーWindows操作要求なし。
- 正式採用ART0件・Slope2 DNA正式認定0m、ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。今回のDCC研究画像は実WebGL2ゲーム画面ではない。**新しい真実の画面を見て質が低ければ必ずART REJECT。** 他6Roadへの展開、元ゲーム統合、本番反映は禁止。

---

# 【2026-11-04 K4BJ最終引継ぎ・最重要発見】モデルを量産する前にRoad5実寸尺度を是正する

**現研究正本**：`research/k4bj-hand-authored-hero-civic-canyon-20261104`。最優先で[K4BJ真正画像・品質不合格・実Road5幾何測量を統合した正本](docs/R19_A6P4_R2F5K4BJ_TIDAL_CIVIC_CANYON_TRUE_CAMERA_JA.md)を読む。古いK4BI以下の「最新」表記はすべて履歴。

- 新K4BJ[真Source Camera DCC CI #41743823084](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41743823084) **completed/SUCCESS**、[実編集Blender原本／control11307とultra11341の真正PNG・比較PNG・SHA証拠Artifact #13282722868](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41743823084/artifacts/13282722868)、ZIP SHA256 `7b85ebe4c3ef60053c9e5dfdc18e55d9c779714afa8b4319ac3370561b4948b3`。元Road5 mesh／元Camera値／ゲーム原blobは不変。しかし左右の巨大で無地な壁、中央模型的構造、広大で単調な前景路面のため**K4BJ ART REJECT**。正式採用0件／Slope2 DNA0m。
- **次工程を変える決定的な実測**：[Source Road5 geometry survey CI #41744748256](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41744748256) **completed/SUCCESS**、[実測生JSON](docs/research-evidence/k4bj/K4BJ_REAL_SOURCE_ROAD_CAMERA_SCALE_SURVEY.json)、[真Artifact #13283665361](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41744748256/artifacts/13283665361)。元Camera controlの前方`d=0〜25m` では元Road5 mesh頂点のカメラ横位置 `s=-39.162m〜+53.261m`、`d=100〜150m` では `-38.821m〜+69.255m`。元Road5 mesh全体のCamera前方最大 `d=+188.774m`。これまでの建築`s≈±160〜360m`や中央造形`d≈550m`はRoad5基準の実寸とずれていた。旧路側測定`s=±157m`は左右42点ずつ路面交差0。**安全な可走幅・B51とのクリアランスは依然未測定**。
- **K4BK次工程**：旧来の推定大尺度を捨て、元Camera／元Road5の実測d,s,z座標から、建物・植栽・側壁・中央遠景・道路の関係をカメラ平面上で計画してから高品質な3Dを作者制作する。実路面への接触・景観造形には地点別Source Raycastと、必要ならB51や実SAT/CCD/ゲーム統合後の安全証拠が必要。元ゲームは不変。単なる箱・弧・窓増殖、汎用リング再利用は禁止。
- 不変契約：ゲームBlob `af076d67492a677d2235e4730aef8cdf4808e106`、240Hz/球半径0.65m／元B48全7・B51全28・元6カメラ値・安全表示、main・公式p101・Draft PR #46・本番2URL保護。Work事前承認・ユーザーのローカルWindows操作不要。**ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE HOLD**。美術合格前の他6Road展開、実WebGL2ゲームへの移植不可。

---

# 【2026-11-04 K4BJ 最新継続入口】手描き指定の非対称都市キャニオン・Blender真正元カメラ審査

**研究継続ブランチ**：`research/k4bj-hand-authored-hero-civic-canyon-20261104`。まず[K4BJ工程の制作意図・原本不変契約・厳密合否](docs/R19_A6P4_R2F5K4BJ_TIDAL_CIVIC_CANYON_TRUE_CAMERA_JA.md)を読む。

- 前K4BIは[最終SOURCE/DCC CI #41740606366](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41740606366) 完全PASS、しかし**ART REJECT**。技術成功と美術合格を混同しない。正式採用ART0件／Slope2 DNA0m。
- 今回は単純な旧箱群を増やさず、編集可能Blender原本の旧K4BH/K4BI研究造形をRenderOFF、独立して非対称西図書館・東海洋公共施設、厚い片流れの機能的スカイロビー、異寸法の市街地・本物Road5のRaycastによる路側造形を制作者した。形状／空間の違いはSOURCE Camera 2画像を見て初めて評価。Raw true source-camera DCC images are **not actual WebGL2 screenshots**.
- [GitHub Actions #41743406627](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41743406627) は修正後CI。必ず実status / 本物PNG / Blender Artifact / SOURCE fingerprintsを検証すること。旧初回 #41743358774 はRaycastの戻り値数誤りで描画前停止しcancelled；成功ではない。レンダリング済み・合格と推測しない。
- 元凍結Game blob `af076d67492a677d2235e4730aef8cdf4808e106`、Road5メッシュ `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、実B48全7／B51全28・240Hz・球0.65m・元6Camera数値・原安全表示不変更。main / 公式`p101-velocity-overdrive-native-trial` / Draft PR #46 / 本番2サイト保護。Work事前承認、ユーザーのWindows操作要求なし。HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。
- 次工程：**必ず真renderを目視し旧K4BIと同じ2source cameraをA/B比較、画面全体で不合格ならART REJECTと正本に固定。** 合格未確認の別Road展開・本番統合不可。

---

# 【2026-11-04 K4BI最終確定・次回第一入口】真正Blender TECH PASS／美術REJECT

**継続最新研究枝**：`research/k4bi-road-surface-facade-craft-20261104`。必ず[K4BI最終実行報告・美術評価](docs/R19_A6P4_R2F5K4BI_ORIGINAL_CAMERA_ROAD_PBR_CIVIC_FACADE_JA.md)を先に読む。

- [最終Source DCC CI #41740606366](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41740606366) **completed/SUCCESS**。元B48 Road5頂点・面fingerprint、真正元control11307/ultra11341のカメラ数値、凍結元ゲームBlob、Blender親原本SHAを確認し、編集可能Blender + 2元Camera PNG + K4BH同フレーム比較PNG + SHA JSONができた。真正[Artifact #13281034575](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41740606366/artifacts/13281034575)、ZIP SHA256 `03ecbc210290d030884e42b5e09efa2f01aac8e7210bb2d19bf2c832e0621539`。見た目がよくなるよう路面マーカー、深い外装、室内窓、細い海色の縁を新たに制作者したが、**依然フラットで反復的な都市、寂しい奥行き、広く単調な路面、粒状ノイズが残りART REJECT**。
- 中間[CI #41740364212](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41740364212)はBlenderのOpenImageDenoiser非対応によりFAILURE。修正後96samples無デノイズで成功、最終成果物を独立再検査。再発防止としてOIDN依存は使わない。
- **正式ART採用0件・Slope2 DNA正式認定0m**。これは元WebGL2画面ではなく真正Source Camera数値からのBlender DCC研究。HUMAN/SAT/CCD/FPS/ART/RELEASE/MERGE全HOLD。主目的は世界水準のレーシングゲームの**全コース美術**、ただしRoad5のHero ART合格までは他6Road展開・ゲーム本体への統合不可。箱・細線・同じ窓を増やす作業は停止し、一画面の独自の高級な本物の美術制作へ優先度を上げる。
- 元source `af076d67492a677d2235e4730aef8cdf4808e106`、240Hz/0.65m／元B48全7・B51全28・元Camera6・安全表示、main/公式p101/Draft PR#46/本番2サイト不変更。Work事前承認、ユーザーWindows操作不要。

---

# 【2026-11-04 K4BI 現在の第一入口】DOPAGAKI SLOPE 真正ロードPBR・建築外装

**最新継続研究枝**：`research/k4bi-road-surface-facade-craft-20261104`、前K4BH `3718a6a39288dfc51a3d28abcdb0371d06202010` から隔離。まず[新K4BIの固定美術課題・研究原本](docs/R19_A6P4_R2F5K4BI_ORIGINAL_CAMERA_ROAD_PBR_CIVIC_FACADE_JA.md)を読む。旧K4BHはSOURCE/DCC技術PASS／**ART REJECT**、正式ART採用0件、Slope2 DNA 0m。

**今回の実制作**：`scripts/p101-k4bi-road-surface-civic-facade-craft.py` で、元Blender編集可能K4BH原本・元Road5形状とCameraをハッシュ固定したまま、原メッシュ上の物理PBR塗装レイヤ・深い建築窓・庇・室内照明・道路端の安全色彩と公共インテリアを実DCC制作。これは**新しいカメラを作ったコンセプト画像ではなく**、固定された元control11307/ultra11341の編集可能3D study。実ゲームWebGL2画面でも合格ARTでもない。 [GitHub Actions #41739572392](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41739572392) の**completed/conclusion・真正画像・独立SHAを再照合すること**。結果未確認でSUCCESS/美術合格とは書かない。

元ゲームsource blob `af076d67492a677d2235e4730aef8cdf4808e106`、B48元7道路/B51元28/240Hz/球0.65m/元6Camera、main、公式p101、Draft PR #46、本番サイトを保護。元ゲームの新規Collider・安全な施工・SAT/CCD/HUMAN/FPS/RELEASE/MERGEは未証明/HOLD。Work事前承認。ユーザーWindows操作要求無し。続行は最新研究ブランチのみ、ART合格までゲーム移植と他Road横展開をしない。

---

# 【2026-11-04 K4BH最終監査・現継続入口】Source-DCC TECH PASS／ART REJECT

研究ブランチ `research/k4bh-true-camera-complete-hero-composition-20261104`。最優先で[確定K4BH全文・美術評価・保護契約](docs/R19_A6P4_R2F5K4BH_TRUE_CAMERA_COMPLETE_HERO_COMPOSITION_JA.md)を読む。

[修正版CI #41732617047](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41732617047) **completed/SUCCESS**、Blender編集可能原本＋元control11307 / ultra11341数値を使った真正2 PNG・旧K4BG比較PNG・SHA監査が成立。[Artifact #13276364672](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41732617047/artifacts/13276364672)、ZIP SHA256 `3c1cc2c6534a1e290a091e4484f1ce537895a8a12dcff90289efc6c7a834ecb0`。**DCC技術限定PASS**であり、美術品質ではない。

- 結果：旧上部の模型的な橋を非表示にした一方、画面の大半が単調な路面と粗い平板壁、薄い二重アーチと小さな尖塔。**K4BH ART REJECT**。正式採用0件、Slope2 DNA認定0m。K4BGもART REJECTのまま。
- 第2 CI #41732218172は旧ART非表示処理が元K4BC v2のSource6道路に衝突し保護assertで停止、**FAILURE**。修正後第三CI #41732617047のみを最新SOURCE/DCC PASSとして扱う。元B48全7・B51元28・240Hz・球0.65m・元Camera/元安全描画不変更。
- 次はより多くの粗い箱・弧・塔の自動生成ではなく、元カメラの近景道路・都市中景・遠景の**一枚の本当に高品質な完成画面**をBlenderの実編集/マテリアル・UV/照明・公共内部として作り込む工程。ARTが認められるまでゲーム移植、他6Road展開は不可。DCC画像は実WebGL2ゲーム画面ではない。HUMAN/SAT/CCD/FPS/RELEASE/MERGE HOLD。
- 元ゲームGit blob `af076d67492a677d2235e4730aef8cdf4808e106`、main、p101公式枝、Draft PR #46、本番2サイトは保護。Work事前承認制、ユーザーWindows操作不要。

---

# 【2026-11-04 K4BH 最新継続入口】DOPAGAKI SLOPE美術制作

**最新の隔離研究枝**：`research/k4bh-true-camera-complete-hero-composition-20261104`。前K4BGは実Blender技術PASS／ART REJECT。今回の新美術制作者は [K4BH正本](docs/R19_A6P4_R2F5K4BH_TRUE_CAMERA_COMPLETE_HERO_COMPOSITION_JA.md) で再開。K4BGなど旧「最新」記述は履歴とみなす。

K4BHでは真Blenderネイティブのロード表面シェーダー、左右で連続する岩盤公共建築と内装、遠方シンボルの大型構造と都市・地形、天空・日照を、一体の実source Camera構図として実装済み。元source Road5メッシュ・元6Camera数値・240Hz物理/球0.65m・B48全7/B51全28・凍結原blob `af076d67492a677d2235e4730aef8cdf4808e106`・本番・main・公式p101・Draft PR #46を保護。

[実K4BH Actions #41731470838](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41731470838) で元K4BG真正.blendからcontrol11307/ultra11341の2枚と新.blendを制作・GitHub保存する。**結果は必ずrunの実状態と生Artifactを再検証すること。CIのTECH成功だけでART PASSとしない。** 不合格なら正式採用0件、Slope2 DNA0m、ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD継続。実ゲームのWebGL2画面、人間プレイ、全B51クリアランスは未測定。Work事前承認。ユーザー操作不要。

---

# 【2026-11-04 K4BG最終判定・次チャットの第一入口】真正Blender DCC 技術PASS／美術REJECT

**現在の研究継続枝**：`research/k4bg-civic-escarpment-true-camera-art-20261104`。必読：[K4BG最終美術判定・全方針・元ソース不変契約](docs/R19_A6P4_R2F5K4BG_SOURCE_CAMERA_COHERENT_CIVIC_ESCARPMENT_JA.md)。

- **修正版の確定CI**：[Actions #41726814278](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41726814278) は **completed/SUCCESS**。元K4BE SHA検証・真正Blender編集可能原本・元Camera control11307 / ultra11341のDCC PNG・独立manifest SHA・GitHubブランチ内画像保存・Artifactアップロードが実成功。真正[Artifact #13274862071](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41726814278/artifacts/13274862071)、ZIP SHA256 `12421de4f43d2aad1df744aed9d9bf450727dded08151eb7fab300334d9e787b`。
- **元Road5のULTRA画面欠落は表示設定修正で解消**。親Blender原本のsource Road5 ULTRA collection `hide_render` をmode別に戻し、元Road5メッシュ・材質割当・カメラ数値・元ゲームソースは変えていない。
- しかし**K4BG ART REJECT、正式ART採用0件・Slope2 DNA正式認定0m**。大面積の単調な前景路面、浅い・模型的な両側都市意匠と中央構造、都市奥行き/使われる公共空間/照明/人間スケールの未完成が残る。88新Blenderオブジェクト、PNG生成、SOURCE/DCC PASSをART合格へ読み替えない。**Blender Source Camera DCC画像は元WebGL2実ゲーム画像ではない**。
- **次工程**：まずこのDCCの不合格を固定し、実カメラの画面全体を大きく変える高精度アート（道路前景の自然な設計質感、左右の継続街区、用途のある内部、街区遠景・大気・光、強い構図）に制作方法を切り替える。単なる箱や曲面パーツの量産は中止。ART認定前の他6Road横展開・ゲーム統合/リリース不可。新候補の本物の元カメラ画像を目視審査。
- **保護契約**：main、`p101-velocity-overdrive-native-trial`、Draft PR #46、本番2サイト、元source blob `af076d67492a677d2235e4730aef8cdf4808e106`、240Hz/半径0.65m、元Camera全6、B48実7道路、B51実28動体、原安全表示不変。Work事前承認／ユーザーのWindows操作要求なし。HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。CI/HEADは次回GitHubで再照合する。

---

# 【K4BG 修正版の最優先注意 2026-11-04】

初回K4BG CI #41725702409はSOURCE/DCC技術SUCCESSだが、初回ultra source Camera画像では実B48 Road5が欠けた状態。親K4BE .blend保存時のULTRA **collection hide_render** を、子の object hide_render 変更では解除できないことが原因とコード上で確定。**修正版 commit e1f5354** では元ROAD5 Collectionをmode別に切替。再CI [#41726814278](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41726814278) の実状況・真2画像を必ず再照合。最新ART認定は依然0、Slope2 DNA0m、HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。詳細は [K4BG正本](docs/R19_A6P4_R2F5K4BG_SOURCE_CAMERA_COHERENT_CIVIC_ESCARPMENT_JA.md)。

---

# 【2026-11-04 K4BG／新チャット最優先入口】DOPAGAKI SLOPE — ART-FIRST研究

- **現在の継続研究枝**：`research/k4bg-civic-escarpment-true-camera-art-20261104`。親K4BF `f8d291d7c4436e739843bd3bb6fdf2b95c85feb0` から隔離。main／公式p101／Draft PR #46／本番2サイトは変更禁止。
- [K4BGの本当の一体型Blender美術制作コード・目的・不変条件・検証](docs/R19_A6P4_R2F5K4BG_SOURCE_CAMERA_COHERENT_CIVIC_ESCARPMENT_JA.md)を最初に読む。[K4BG Source-Camera制作CI #41725702409](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41725702409)は2026-11-04 06:52 JST頃起動。**最新statusを再照会**し、成功やART合格を推定しない。
- K4BF #41722243986は**completed FAILURE**（Blender .blend/2 source Camera PNG/独立SHA検査までは成功、最後のGit保存がnon-fast-forward）。実Artifact #13271498531、ZIP SHA `9adc33e93f72b053a20d264b480aea165c3ef43daeb8007df5b313242f7e49f3`、control/ultra真DCC比較を目視して**K4BF ART REJECT**。ultraでは道路が前景に無いように見える大空間、controlも模型感が残存。元ゲームのRoad5が実際に欠損した証拠ではない。
- K4BGは旧K4BE材質と真正道路メッシュの非改変を保証して、旧反復都市建築をDCC render OFF、連続する両側都市峡谷・大断面公共屋根・深い居室・雨庭・遠景ランドマークをBlender-nativeで一方向再制作。2 source Camera画面のARTを厳格審査するまで、**正式ART採用0／Slope2 DNA0m／HUMAN/SAT/CCD/FPS/RELEASE/MERGE HOLD**。DCC PNGと実WebGL2ゲーム画面を絶対に混同しない。
- 元source blob `af076d67492a677d2235e4730aef8cdf4808e106`、元Camera6・球0.65m・物理240Hz・B48道路7/B51実動体28、衝突/安全表示は不変更。Workは事前許可制、ユーザーWindows操作要求なし。K4BGのART不合格なら**次の道路全体展開は禁止**。

---

# 【2026-11-04 K4BF制作開始 / ART未判定】DOPAGAKI SLOPE — 正本最新入口

**最優先**：[K4BF本物のSource Camera/路面PBR/公共モノリス実制作](docs/R19_A6P4_R2F5K4BF_SOURCE_CAMERA_GROUND_MONOLITH_ART_FIRST_JA.md)、[K4BF専用Actions #41722243986](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41722243986)、[K4BE終盤の保護条件とART REJECT](docs/R19_A6P4_R2F5K4BE_SOURCE_CAMERA_COHERENT_TIDAL_FORUM_JA.md)。旧K4BE見出しは歴史資料として残す。

- 最新隔離研究枝：research/k4bf-true-camera-ground-and-civic-monolith-20261104（K4BE確定HEAD 8529b78fb04a30714137a5fb6cfd013f746726c9から派生）。旧main/本番/公式p101/Draft PR #46変更禁止。
- **今回実装**：元Blender編集原本から Road5の視認されるPBR質感を実材質化、中央の旧模型的Tidal Forumのみrender OFF保持、厚い非対称公共モノリスと地盤接続・居室・開口の大断面を新規実Blender meshesで制作。original 7 B48/28 B51/6 true Camera/240Hz/0.65m/凍結 WebGL2 Git blob af076d67492a677d2235e4730aef8cdf4808e106保持。
- **現時点の正直な状態**：最新版はCamera内の高さを修正した制作器と旧試行キャンセル改善込み。レンダー/編集可能Blender/save/API成否は実際の run #41722243986 を照合する。保存済みコードだけでBlender PASSや美術改善を宣言してはいけない。成功時の元Camera2画像も実際に開いてART審査する。
- **全ゲートHOLD**：K4BF独立全7 B48/B51有限静的BVHと真0.65m距離/全B51時間/SAT/CCD/HUMAN/FPS/実WebGL2描画は未検証。ART UNJUDGEDからは実画像審査を要する。正式ART採用0件・Slope2 DNA 0m・RELEASE/MERGE禁止。

---
# 【最新・2026-11-03 K4BE完了】DOPAGAKI SLOPE：ART-FIRST全画面研究

**ここを最優先**：[K4BEの完成証拠・拒否理由・次工程](docs/R19_A6P4_R2F5K4BE_SOURCE_CAMERA_COHERENT_TIDAL_FORUM_JA.md)、[K4BDからの完全統合引継](docs/continuity/HANDOFF_20261103_K4BD_TO_NEW_CHAT_COMPLETE_JA.md)。過去に「最新」と書かれた以下のK4BD/K4BC/K4BB見出しは歴史資料。

- **研究枝** research/k4be-camera-first-integrated-urban-civic-hall-20261103。元はK4BD確定HEAD 702805d4b58d7ff8f6bf99157dd25a02d3fc83e9。main・公式継続p101-velocity-overdrive-native-trial・本番2サイト・Draft PR #46（OPEN/DRAFT/UNMERGED）・元game source/blobは変更禁止。Work事前承認、Chat＋GitHub主体、ユーザーPC操作最小。
- **K4BE実装済**：[真正source camera2枚用Blender建築器](scripts/p101-k4be-source-camera-integrated-tidal-forum.py)で元K4BD編集可能原本を開き、旧模型的建築を削除せず表示OFF、真Road5 bank/元Road6に整合した公共ホール/海岸温室/中央Tidal ForumをBlender mesh/curveで305編集可能オブジェクトとして研究制作。元全7 B48／28 B51／6元Camera／240Hz／球0.65m／元sourceゲームのオリジナル危険表示・CCD・操作は不変。追加の偽game road/colliderは0。
- **正式な画像制作**：control11307・ultra11341の2つの本物source数値Camera画像＋非game航空DCCを実作成（残り4つのsourceカメラは未描画）。元レンダーrun #41657612279は画像とblendを保存したがGLB exporter NumPy不足で最終FAIL。失敗をSUCCESSと偽装しない。[元画像とblendを再利用する**再描画なし救済Actions #41659005101**](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41659005101) **completed SUCCESS**、Artifact #13240733042。ZIP40,927,628bytes/全7ファイルCRC0/SHA全一致、原Road5 4,728三角の幾何fingerprint不変、GLB別出力成功。実ゲームのWebGL2フレームではない。
- **独立元source静的BVH**：[Actions #41659267726](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41659267726) **completed SUCCESS**、Artifact #13240119880。真の全7 B48 road control＋ultra=14mesh／66,192三角＋元B51の6×28=168 source collision OBBを、K4BE新建築305件を含む全826建築・151,796評価面と独立照合。**源B48表面交差0、B51表面交差0**。これは有限の静的面交差であって、原球半径0.65mの余裕、B51全時間、原ゲームCCD/SAT/HUMAN/FPSは未証明。K4BDのDCC路面inlay52個／深海面は非衝突なので監査対象から除外。
- **GitHubで即確認**：[元Camera2視点のK4BD/K4BE同pose A/B](docs/research-evidence/k4be/K4BE_TWO_ORIGINAL_CAMERA_K4BD_VS_CITY_ART_REJECT.png)、[control11307](docs/research-evidence/k4be/K4BE_CONTROL_11307_TRUE_SOURCE_CAMERA_ART_REJECT.png)、[ultra11341](docs/research-evidence/k4be/K4BE_ULTRA_11341_TRUE_SOURCE_CAMERA_ART_REJECT.png)、[航空DCC](docs/research-evidence/k4be/K4BE_INTEGRATED_CIVIC_HALL_AERIAL_DCC_NOT_GAME.png)、[SHA原本](docs/research-evidence/k4be/K4BE_ORIGINAL_SOURCE_B48_B51_SHA_ART_REJECT.json)。[保存CI #41659255835](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41659255835) SUCCESS。ZIPダウンロードやユーザーPCでのスクリーン撮影は不要。
- **重要：ART REJECT継続**。Road5の単調な大面積路面はそのまま、中央Tidal Forumは高速Cameraから小さく文字も部分隠れ、周辺都市は厚みの足りない屋根・棒・単純な透明箱の模型のまま。Blender原本/CIのSOURCE技術PASSを見栄えの合格と呼ばない。正式ART採用0件、Slope2 DNA認定0m。
- **次工程K4BFへの確定した反省**：大量procedural shell/box/柱の繰返し、配色替え、ブラインド高コスト6カメラを禁止。まず**元source Cameraの本物の画面**で路面占有・視野・建築/公共施設が認識できる実範囲を測り、元roadやCameraを変えずに、画面に入るシグネチャー建築を独立の手作業系DCC造形・実世界に根付く公共空間として詳細設計。2元Cameraのpilotで実画像を審査し、不十分ならART REJECTで止める。
- **絶対不変**：凍結元ゲーム Git Blob af076d67492a677d2235e4730aef8cdf4808e106、元7 B48/28 B51、240Hz、球0.65m、元Camera6 tick、操作/速度/安全HUD/衝突は保持。ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGEすべてHOLD。main/本番/元Slope/公式継続研究/Draft PR #46に書き込み・マージ禁止。

---


# 【最新版 2026-11-03 K4BD 完了／新チャットからの入口】DOPAGAKI SLOPE

**最初に[完全統合K4BD→新チャット引き継ぎ正本](docs/continuity/HANDOFF_20261103_K4BD_TO_NEW_CHAT_COMPLETE_JA.md)を読むこと。** 最新研究枝 `research/k4bd-source-road5-civic-deck-material-architecture-20261103`。下の古いK4BC/K4BD進行中記録より、**この先頭・引き継ぎ正本・現在のGitHub Actions実結果**を優先。ユーザーの過去決定・反省を蒸し返さず継承。

- **K4BDの3K Road5元source DCC制作 2Camera pilot：** [Actions #41649107682](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41649107682) **completed SUCCESS**。control11307／ultra11341の**2真正source Camera**のみ撮影、元source Camera数値変更無し。残り4時点は**未描画**。Blender編集可能.blend、GLB、3K ALBEDO／ROUGHNESS／HEIGHT PNG、別B51 28体debug、独立航空、source SHA。非衝突路面inlay52枚、両側の公共テラス各1。真正WebGL2ゲーム画面ではない。元B48全7／B51 28／240Hz／球半径0.65m／freeze原source blob不変。
- **K4BD実ARTレビュー：ART REJECT（正式採用0件）**。道路の暗色石材施工区分はK4BC v3から一部前進、B51物理紫debug枠を美術previewから独立分離。ただし道路が巨大・単調で建築は模型的、都市密度と実公共用途が不十分。元高速Cameraで成立しないまま全6画像に高コストをかけることを避け、2Camera pilotで停止。**Slope2 DNA認定0m**。
- **GitHubへ画像を直接保存済**：[Actions #41650256585](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41650256585) **SUCCESS**。[K4BD元2Camera A/B](docs/research-evidence/k4bd/K4BD_PILOT_TWO_SOURCE_CAMERA_AB_ART_REJECT.png)、[control11307](docs/research-evidence/k4bd/K4BD_REAL_CONTROL_11307_CLEAN_DCC_ART_REJECT.png)、[ultra11341](docs/research-evidence/k4bd/K4BD_REAL_ULTRA_11341_CLEAN_DCC_ART_REJECT.png)、[別B51 28体debug](docs/research-evidence/k4bd/K4BD_TRUE_B51_28_BODIES_DEBUG_ULTRA_11341.png)、[航空DCC](docs/research-evidence/k4bd/K4BD_AUTHOR_AERIAL_DCC_NOT_GAME.png)、[3K原アルベド](docs/research-evidence/k4bd/K4BD_3K_TRUE_ROAD5_PBR_ALBEDO_DCC_ONLY.png)、[源SHA](docs/research-evidence/k4bd/K4BD_3K_PBR_SOURCE_SHA_ART_REJECT_PROVENANCE.json)。
- **K4BD独立源B48/B51静的BVH最終完成**：[Actions #41653236842](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41653236842) **completed SUCCESS**。真の7 B48道路×control/ultra=14元メッシュ**66,192三角形**／元B51 28×6 source時刻=**168物理OBB**、新K4BD路外テラス46件を含む現行建築**521評価オブジェクト・120,992評価面**、**元道路とB51の有限静的三角形表面交差は0件／0件**。非衝突Road5 visual inlay52件と海水面はスコープから除外。これは**真CCD／球半径0.65m安全余裕／B51全時間／HUMAN／SAT／FPS／ART**の合格ではない。
- **失敗と修正は正本に保存**。初回K4BD EEVEEはUbuntu headless `libEGL.so.1`欠落でABORT、Cyclesへ変更。8枚×112samplesの重い初期試行を減らし、56samplesの2Camera pilotへ。初期K4BD独立BVHはBlenderの63byte collection名切り詰めで対象識別assert失敗、安定prefix＋厳格countへ修正し**最終静的BVH本当にSUCCESS**。過去のFAILを実接触0としてすり替えない。
- **次のK4BE候補**：原Cameraの全画面美術、Road5の単調さ/都市街区実密度/建築用途と人間スケールをさらに根本再設計。表層の色変更・意味のない箱/棒/アーチ/資産増産で採用しない。**2元Camera pilot→厳格な実画像ARTレビュー→採用見込みがある場合だけ全6Camera→独立元全7 B48/B51静的検査→GitHub原本・証拠保存**の順番を守る。
- **原本・運用永久保護**：ゲーム凍結 `web/p101-w9c2-g4e7ci-integrated-streetscape.mjs` GitBlob `af076d67492a677d2235e4730aef8cdf4808e106`、元7 B48/28 B51/元Camera6tick/240Hz/半径0.65m/元操作/元安全表示不変。main、本番、公式開発枝 `p101-velocity-overdrive-native-trial`、OPEN/DRAFT/UNMERGED PR#46を変更/公開/マージしない。Work事前承認制、Chat+GitHub中心、ユーザーPC作業ゼロ優先。**正式ART採用0件、Slope2 DNA認定0m、ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD**。

---

# 【2026-11-03 最新・K4BC v3完了／次工程へ】DOPAGAKI SLOPE 継続入口

**この先頭を旧K4BC初版、K4BB、K4BA、K4AZの「最新」より優先すること。固定ART HOLDは変更しない。**

- 研究ブランチ：`research/k4bc-road5-source-camera-civic-monument-recomposition-20261103`。完全な正本：[K4BC全工程とv3実証](docs/R19_A6P4_R2F5K4BC_SOURCE_CAMERA_READABLE_CIVIC_DISTRICT_JA.md)。前K4BBの正式HEAD `9800d65b71f719347f9d467ef90199791925b511`から派生。
- **元B48全7道路を真ソースで導入**：元の`generateP101W9C1AbyssCandidate`＋`tessellate()`をread-only実行、control＋ultraの7×2＝14原メッシュ66,192三角形をDCC source sceneへ導入（Road5元物理mesh 4,728 triangles / source points SHA維持）。原B51 28体×source6Camera tick=168実物理OBB。元球半径0.65m／240Hz／camera/操作/衝突/ロード安全表示を変更しない。
- **v3実装と実証**：Blenderの元6source Cameraの方位から正面都市の構図を再計算。真Road6の実幅を計測し、路外の左右公共施設とRoad6上空の幅広い非衝突DCC専用公共ミュージアムを編集可能Blender/GLBで造形。**v3 DCC/同Camera画像のCI [#41640544530](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41640544530) completed SUCCESS**、Artifact #13232364254。主役が真正Cameraの中央に実際に入るようになったが、都市・路面・屋内の美術レベルが不十分で**ART REJECT**。
- **v3独立・全7道路の静的BVH**：[Actions #41642883010](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41642883010) **completed SUCCESS**、Artifact #13233801620。K4BC v3含む475件／114,064評価面 vs 本物B48全7×control/ultra=14メッシュ・66,192面＋B51実時刻OBB168件の静的三角形交差**0件/0件**。**元ゲーム連続CCD、球半径0.65mを考慮した接近クリアランス、全元時刻、人間操作、FPSやARTは未認定**。
- **実6Camera画像をZIP無しでGitHub閲覧**：[v3とv2全6Camera A/B](docs/research-evidence/k4bc-v3/K4BC_V3_REAL_SOURCE_ALL7_SIX_CAMERA_V2_AB_ART_REJECT.png)、[v3 control11307 DCC](docs/research-evidence/k4bc-v3/K4BC_V3_REAL_CONTROL_11307_DCC_ART_REJECT.png)、[v3航空DCC](docs/research-evidence/k4bc-v3/K4BC_V3_DESIGN_AERIAL_NOT_GAME_ART_REJECT.png)、[SHA/原source provenance](docs/research-evidence/k4bc-v3/K4BC_V3_ORIGINAL_ROADS_CAMERA_SHA_HOLD.json)。保存CI #41642553268 **SUCCESS**。Blender DCC画像は元のWebGL2ゲーム画面ではない。
- **次工程：全画面美術をさらに根本改善**。巨大で単調な前景道路の構造意匠・リアルな舗装質感、左右の公共用途が走行Cameraで読める建築断面、外観の構造/階層/人のスケール、都市の周辺街区を、編集可能DCC原本から完成品質へ再制作。雑なbox/棒/アーチの追加、軽微な色替えやCI greenだけでの美術採用は禁止。
- **恒久契約**：正式ART採用0件、Slope2 DNA認定0m、ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。元game frozen blob `af076d67492a677d2235e4730aef8cdf4808e106`。main・production・公式継続`p101-velocity-overdrive-native-trial`・Draft PR #46未変更/未マージ。Chat＋GitHub中心、Workは必ず事前承認、ユーザーPCローカル操作不要。

---

# 【最優先・2026-11-03 K4BC 再開】DOPAGAKI SLOPE — 真のB48全7道路とCameraフレーム美術

**旧K4BB/K4BA/K4AZの「最新」は過去記録。最新研究枝は`research/k4bc-road5-source-camera-civic-monument-recomposition-20261103`で、正本は[`docs/R19_A6P4_R2F5K4BC_SOURCE_CAMERA_READABLE_CIVIC_DISTRICT_JA.md`](docs/R19_A6P4_R2F5K4BC_SOURCE_CAMERA_READABLE_CIVIC_DISTRICT_JA.md)。K4BB HEAD `9800d65b71f719347f9d467ef90199791925b511`から独立。**

- 最優先の美術目標は**元ゲームの真正240Hz高速Cameraに映る全面の視覚品質**。Blender技術成功、単色帯、棒/箱/繰り返す薄いアーチ、source同Cameraのピクセル差だけでART合格としない。正式ART採用0件／Slope2 DNA認定0m、ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE HOLD。
- **v1実施済**：元Road5だけを物理参照として左右の大きな公共建築・街区を編集可能Blenderで再制作。制作CI [#41636914845](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41636914845) SUCCESS、Road5+B51六時刻の独立限定静的BVH [#41637181443](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41637181443) SUCCESS（新造形393評価対象91,888面のRoad5/B51交差0）。**実Camera画像は正面空白・単調路面などでART REJECT**。
- **v2実施済 — 重大なsource盲点を修正**：今までDCCでRoad5のみだったため、真の元ゲーム生成器 `generateP101W9C1AbyssCandidate`＋元 `tessellate` から**7本全部の元B48ソース**をcontrol/ultraで正確抽出。元index0〜6：ABYSS_DIVE / CROWN_REVERSAL / SCISSOR_RISE / LOWER_REVERSAL / VOID_SURGE / PRISM_CREST / FINISH_RIDGE。Road5元4,728三角の原point/index/vertexハッシュ不変。他6道路×2モード=12本をBlender preview原本へ追加、物理collider0追加。制作CI [#41638891877](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41638891877) **SUCCESS**、実7道路同pose A/B。
- **v2のより広い独立source静的BVH**：[Actions #41639263986](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41639263986) **SUCCESS**。全7道路×2モード＝**14原メッシュ・66,192三角**、原6tick×B51 28体=168物理OBBと、K4BC新建築393評価対象91,888面の**静的三角形表面交差0件/0件**。ただし元球0.65m、全時刻、真CCD/FPS/HUMAN、元WebGL2レンダリングは**未検証**。
- **v2も正式ART REJECT**。実Camera画像のRoad5しかない旧版との差は非常に小さく、`control_11307`の独立画像比較はRGB平均絶対差約1.135/255、画像最大チャネル差24超の画素約1.88%。元Road6は実在するが、上り勾配の元Road5に遮られてほぼ見えない。実道路の追加だけで正面の大空白は解消されない。**偽の走行可能路面で空白を埋めることは禁止**。
- **v3次工程、実装・CI起動済**：[K4BC v3制作器](scripts/p101-k4bc-v3-real-road6-camera-framed-sky-museum.py)は原Road6の中心線/実幅を元sourceから数値取得し、カメラ方向も測定して、元Road6実道路上空に非衝突DCCの広い公共建築と左右の基壇を再配置。旧画面外の不採用塔はBlender編集可能原本に残して表示OFF。元ゲーム物理や走行道路は増やさない。制作CI [#41640544530](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41640544530)、全7道路／B51独立静的BVH [#41640727947](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41640727947)。**この記述時点でv3 CI成功／画像／交差評価はまだ未確定。実ログ確認前のPASS禁止**。
- **元source完全保護契約**：凍結元game GitBlob `af076d67492a677d2235e4730aef8cdf4808e106`、本物のsource B48七道路／B51二十八体／240Hz／球半径0.65m／元Camera6時刻／衝突・操作・スピード・危険表示改変禁止。編集先は隔離研究枝のみ。main、本番URL、公式継続`p101-velocity-overdrive-native-trial`、Draft PR #46を変更・マージ禁止。
- **ユーザーPC操作を要求しない**。Chat＋GitHub中心、Work必ず事前承認。既存K4BC v2の6×真正source-camera A/B、航空DCC、元Road source SHAは[研究ブランチの永続画像](docs/research-evidence/k4bc-v2/K4BC_V2_TRUE_7_B48_SIX_ORIGINAL_CAMERA_AB_ART_REJECT.png)から直接閲覧可。新v3の元Camera画像と全source静的BVHの結果を確認して次の採否を決める。

---

# 【最新 2026-11-03 K4BB 継続入口】Road5本物のUV-PBR路面・居住性のある公共建築内部

**旧K4BA/K4AZ/K4AYの「最新」は歴史資料。最優先は以下のK4BB現研究枝と[完全方針・実装正本](docs/R19_A6P4_R2F5K4BB_TRUE_B48_ROAD_PBR_INHABITED_CIVIC_JA.md)。**

- 最新研究枝 `research/k4bb-road5-pbr-civic-interiors-20261103`、K4BA最終HEAD `bb7ea19ec05bc05ddad54a51faeb69f302656f0e`から派生。main・production・`p101-velocity-overdrive-native-trial`・Draft PR #46不変更。
- K4BA v2編集可能source DCC [Actions #41625837609](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41625837609) SUCCESS、K4BA v2独立Road5/B51静的BVH [#41626249550](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41626249550) SUCCESS（限定範囲のみ）、**美術は正式ART REJECT**。現在の本物の6Camera新旧比較は [K4BA画像](docs/research-evidence/k4ba/K4BA_V2_SIX_TRUE_NUMERIC_SOURCE_CAMERA_K4AZ_AB_ART_REJECT.png)。
- **K4BB真正次工程**：元Road5の本当のB48 physical meshesを絶対に動かさずに、2K Albedo/Roughness/Height 3map、格子91x13に対応するBlender UV、編集可能な4種の用途別公共室を新コレクションに実制作。元本物のSourceCamera control11259/11278/11307、ultra11320/11341/11369で6 DCC画像＋artist aerial＋人間視点を作り、前工程同poseと厳格比較する。Road5源7道路28 B51 240Hzはすべて不変。Blender DCCは真正WebGL2ではない。
- **K4BBの確定制作成果**： [Actions #41631593534](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41631593534) **completed SUCCESS**、Artifact #13229226496（`.blend`、GLB、2K Road5アルベド/粗さ/高さ各PNG、実source Camera 6＋studio2の8DCC画像、K4BAと6同pose A/B）。独立PILで全ZIP 15件CRC0・全ファイルSHA一致、ALBEDO/ROUGHNESS/HEIGHT RGB標準偏差合計31.657/49.132/20.650で、以前のグレースケール全黒の欠陥は解消。**これは元ゲームWEBGL2ではなくDCCのみ**。K4BB公共用途の新編集可能オブジェクト167件。源B48 Road5 vertex/tri SHA一致、元B51/Camera/240Hz不変。
- **K4BBの独立限定BVH成功**：[Actions #41631656710](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41631656710) **completed SUCCESS**。K4BB新公共室167評価済オブジェクト・5,630面と元Road5 B48 4,728面＋本物B51の元6tick×28 OBBS=168体の静的三角形交差0件。**K4BA既存建築はこの新規監査には含まれない**。他6 B48道路、全時刻、真CCD/HUMAN/FPSは未認定。
- **実6Camera美術評価：ART REJECT**。鏡面バグを直し、実アルベド/粗さ/高さ3mapで道路が正しい質感になったが、真正Cameraでは4種の新室内の用途が読めない。インテリア独立撮影は暗闇から改善したものの、棚ではなく棒の乱雑な集合に見える。正面都市・左右屋根の世界的美術としての説得力も未達。技術SUCCESSをART PASSに読み替えない。
- **GitHub直接閲覧画像**： [K4BB 6×元Camera A/B](docs/research-evidence/k4bb/K4BB_SIX_SOURCE_NUMERIC_CAMERA_PBR_INTERIORS_ART_HOLD.png)、[室内実DCC](docs/research-evidence/k4bb/K4BB_INTERIOR_DESIGN_EYE_NOT_GAME.png)、[航空DCC](docs/research-evidence/k4bb/K4BB_HARBOR_AERIAL_DCC_NOT_GAME.png)、[2K Road5アルベド](docs/research-evidence/k4bb/K4BB_ROAD_PBR_2K_ALBEDO_STUDY_ONLY.png)、[SHA](docs/research-evidence/k4bb/K4BB_EDITABLE_SOURCE_SHA_ART_HOLD.json)。Actions #41631663301により研究ブランチ永続保存成功。手動ZIPダウンロード・PC操作不要。
- **次工程**：[K4BB正式正本](docs/R19_A6P4_R2F5K4BB_TRUE_B48_ROAD_PBR_INHABITED_CIVIC_JA.md)の末尾を先に読み、K4BC相当の**本物の高速Cameraで用途が読める公共建築・路面の大規模構造的意匠・都市風景の一体的再制作**へ。追加の雑なboxや色替えを重ねず、ART-FIRSTを維持。
- 最優先は世界水準の**全画面美術品質**。路面画像の色が変わるだけ／細い線が増える／CI GREENだけではART不合格。Source画面の本物のP100/B5安全表示の色を勝手に無断変更しない。元凍結blob `af076d67492a677d2235e4730aef8cdf4808e106`、元球半径0.65m、camera/240Hz/B48七/B51二十八/衝突/操作厳守。
- 正式ART 0件、Slope2 DNA 0m、ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE HOLD。Work事前承認／ユーザーPC操作ゼロを優先。

---

# 【最新・2026-11-03 K4BA 継続入口】Tidal Commons 真Road5全画面美術

**この上段を過去の旧「最新」より優先し、[K4BA正本](docs/R19_A6P4_R2F5K4BA_TIDAL_COMMONS_WHOLE_SCREEN_ART_REBUILD_JA.md)から引き継ぐ。**

- 現研究枝: `research/k4ba-road5-tidal-city-cinematic-art-rebuild-20261103`。K4AZの確定HEAD `a09b4b2f0548640e43c948b4ce8695b8c2a39f0a`から派生。main、本番、PR#46、公式継続ブランチは変更禁止。
- 直前までの実績: K4AZ v3の編集可能本物source Road5 DCC Actions #41616880506 **SUCCESS**、同v3の独立静的B48(4,728三角)×B51(168時刻OBB)非交差 Actions #41617855388 **SUCCESS**。それでも**正式ART REJECT**で、正式採用0、Slope2 DNA認定0m。
- **K4BA設計の根本差分**：広く単調な路面と奥に何もない空を克服するため、元Road5上面の実データサンプルへ植え付けたDCC-only路面PBR候補、両側の複数階の公共建築、公共用途のある大きな屋上連絡回廊、**元Road5物理終端の先の芸術専用海港展望施設と都市遠景**をBlenderで全面再制作。美術専用の物理終端以遠の風景は原ゲームに無い走行可能な道ではなく、衝突も生まない。元K4AZは比較用に編集可能保持・表示のみOFF。
- **絶対固定**: 元game Git Blob `af076d67492a677d2235e4730aef8cdf4808e106`、元source 240Hz/球0.65m、B48 7道路、B51 28、原Camera6 tick、操作、速度、衝突。Source DCC/CI PASSを真正WebGL2やART PASSと混同禁止。
- 今回着手コード: [K4BA Blender制作器](scripts/p101-k4ba-authentic-b48-tidal-commons-cinematic-city.py)、[K4BA専用CI](.github/workflows/p101-k4ba-real-road5-tidal-cinematic-city.yml)、[K4BA独立B48/B51接触検査](research/k4ba/independent_b48_b51_native_spatial_audit.py)。
- **K4BA v2 真正DCC制作完了**： [Actions #41625837609](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41625837609) **completed/SUCCESS**、Artifact #13224834813、編集可能 .blend/GLB、真source-camera 6DCC PNG＋1 studio画像＋K4AZ v3とのA/B。旧アート保存、源Road5全頂点/face fingerprint不変。v1 #41624877761 SUCCESS後、初版の浮いた彫刻問題から海岸地形/基壇/公共屋根のv2へ本当に再制作。技術成功と美術品質は別。
- **K4BA v2独立BVH**： [Actions #41626249550](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41626249550) **SUCCESS**。新建築743評価済オブジェクト163,068面 vs 原Road5本物B48 4,728三角＋元6tick×B51 28=168時刻OBBの**静的表面交差0件/0件**。他6B48道路／全走行時刻／人間操作・CCD・FPS・HUDは未検証。
- **K4BAの実画像はなお正式ART REJECT**。全画面建築と正面の施設が出現したが、広い路面の素材がまだ単調、建築用途・地形の接続・都市遠景の完成度が世界的レベルに達していない。紫の物理OBBはゲームのB51ビジュアルではない。オブジェクト数や色替え、pixel差でART通過させない。
- **GitHub内の直接見られる永続画像**： [6×真正source-camera同pose新旧比較](docs/research-evidence/k4ba/K4BA_V2_SIX_TRUE_NUMERIC_SOURCE_CAMERA_K4AZ_AB_ART_REJECT.png)、[航空アート審査](docs/research-evidence/k4ba/K4BA_V2_AERIAL_CITY_SUPPORT_SECTION_DCC_ART_REJECT.png)、[完全SHA](docs/research-evidence/k4ba/K4BA_V2_TRUE_SOURCE_BLENDER_SHA_ART_REJECT.json)。[Actions #41626584149](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41626584149)成功で本研究ブランチへ確実に永続保存。
- **次工程**： [K4BAの最終正本](docs/R19_A6P4_R2F5K4BA_TIDAL_COMMONS_WHOLE_SCREEN_ART_REBUILD_JA.md)末尾のART REJECTを尊重し、小物追加ではなく路面・建築内部・公共空間・遠景を真の元Cameraで満足できるよう全面的にデザイン再検討。他のB48原道路/安全表示の扱いは源データに基づくこと。Blender DCCは本物WebGL2ゲーム画面ではない。
- **恒久HOLD**：正式ART採用0件、Slope2 DNA0m、ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。Work事前承認、Chat＋GitHub中心、ユーザーのローカル操作最小化。

---

# 【2026-11-03 最新・K4AZから再開】DOPAGAKI SLOPE 継続入口

**この上段を旧「最新」記述より優先。** 目標は元240Hz高速物理と一体の**世界水準の全画面美術**。技術CI成功や画像差だけでART合格を主張しない。

- **現研究ブランチ**: `research/k4az-road5-civic-rift-dcc-recomposition-20261103`。正本：[`docs/R19_A6P4_R2F5K4AZ_CIVIC_RIFT_BLENDER_ARCHITECTURAL_RECOMPOSITION_JA.md`](docs/R19_A6P4_R2F5K4AZ_CIVIC_RIFT_BLENDER_ARCHITECTURAL_RECOMPOSITION_JA.md)。
- **元物理の正確な参照**: K4AY 成功 #41612254866、元B48 Road5 source index5 `p93-PRISM_CREST-01` = 4,728 triangles、源B51 28体×6 native ticks=168 collision OBB、Blender editable原本。凍結blob `af076d67492a677d2235e4730aef8cdf4808e106`。
- **新Blender-native建築初版**: K4AZ #41614997838 成功。再調整した明るい路面・屋上横断公共ギャラリー等のv2は #41615762837 成功（Artifact #13221930364）。旧K4AX建築は破壊せず隠して残し、Road5 original B48頂点ハッシュ不変、source camera6点とartist viewを出力。
- **独立幾何SOURCE限定成果**: #41616623231 SUCCESS、K4AZ v2建築評価対象290メッシュ/カーブ、59,120面と原Road5 B48 / 6tick×28体物理OBBの**三角形交差0件**。連続走行CCD・他の6道路の完全非干渉、HUMAN/FPSは未検証。v3に横滑り認定禁止。
- **現在のART判定**: v2の真正source-numeric Camera DCC画像は、まだ巨大な路面空白、切れる架空横断アーチ、建築用途の不足があるため**ART REJECT**。画像は元のWebGL2ゲーム画面ではない。
- **v3最終CI/実画像**: [#41616880506](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41616880506) **SUCCESS**、Artifact #13221369011。元Cameraで横断アーチがフレーム内へ入ったものの、**世界水準の品質不足でART REJECT**。6元Camera DCC A/Bとアーティスト画像は [GitHubに永続保存](docs/research-evidence/k4az/K4AZ_V3_SIX_SOURCE_NUMERIC_CAMERA_AB_DCC_ART_REJECT.png)。真正ゲームWebGL2ではない。
- **v3静的干渉も独立実証**: [#41617855388](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41617855388) **SUCCESS**。290 source DCC建築mesh/curve、58,544面 vs Road5 source B48 4,728 triangle とB51 168 native snapshot OBBの**交差0件**。CCD/HUMAN/FPS/他6道路は未認定。
- **次の実行**: [K4AZ v3完全審査正本](docs/R19_A6P4_R2F5K4AZ_CIVIC_RIFT_BLENDER_ARCHITECTURAL_RECOMPOSITION_JA.md)の末尾を先に読み、安易な細部追加ではなく**画面全体の建築・地形・実路面・遠景の美術品質の抜本再制作**を続ける。元source 240Hz/球半径0.65m/Camera/B48七道路・B51二十八体/操作/衝突/加速は改変禁止。
- **固定HOLD**：正式ART採用0件、Slope2 DNA認定0m、ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE HOLD、main・公式継続 `p101-velocity-overdrive-native-trial`・本番・Draft PR #46無変更。Workは必ず事前承認、ユーザー側PC手動ZIP不要。

---

# DOPAGAKI SLOPE — START HERE（新チャットの唯一の短い入口）

**更新：2026-11-03 11:36 JST**。このファイルは`research/k4aj-native-b51-gpu-depth-contiguous-window-20261103`研究ブランチの入口です。**最新CIとHEADは必ずその場でGitHub照合**すること。古い引き継ぎメモの「最新」「queued」を現在値として再利用しない。

## まず読む2つ

1. [完全統合引き継ぎ正本 — 目標・凍結契約・過去の教訓・検証証拠・次工程](docs/DOPAGAKI_COMPLETE_INTEGRATED_HANDOFF_20261103_JA.md)
2. [現工程K4AJのコード/真正GPU実測/独立監査契約](docs/R19_A6P4_R2F5K4AJ_ORIGINAL_NATIVE_B51_GPU_OCCLUSION_WINDOWS_JA.md)

元の長大な`DOPAGAKI_RESTART_JA.md`/`docs/DOPAGAKI_LIVE_HANDOFF.md`/`PROJECT_STATE.md`は重要な履歴だが、旧「最新」の追記が残っている。まず上記の統合正本を基準に、必要な旧フェーズだけ確認する。

## 現在の判定スナップショット

- 開発目標：**約7,280m、約52秒・200m/s級の本物のSlope2高速走行**と、世界水準の圧倒的な超未来都市造形を一体の人間プレイ体験で完成。ART-FIRST。**正式ART採用0件、Slope2 DNA認定0m**。
- 本来の継続ブランチ`p101-velocity-overdrive-native-trial`、[Draft PR #46](https://github.com/ryomashibaba/dopagaki-development-hub/pull/46) OPEN/unmerged（11/03確認HEAD `19d3a32d525c0c2a67082cba646898fab8f2b60f`）。**main・本番・PR#46に無断変更禁止**。
- 元source Blob`af076d67492a677d2235e4730aef8cdf4808e106`、元球半径0.65m/240Hz/Camera/B48道路7/B51元動体28体、Gold/P100/W9-X/B5と本番URL固定。隔離研究以外への反映禁止。
- **K4AI SOURCE GEOMETRY TECH限定PASS**：[Chromium真正1,442元tick実走行CI #41560614512](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41560614512)成功、[元Artifact SHA固定独立再監査CI #41561002955](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41561002955)成功。
- **K4AJ SOURCE GPU TECHは未確定／HOLD**：[現行CI #41566784540](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41566784540)は11/03 11:36時点で`queued`、Artifact0。100元GPU/100 B51 BODY全28体group mask/100元復元、300順次GPU seq、99連続native tick＋参照tick、独立5改ざん負例を検証。**本物のGPU結果なしに遮蔽秒数を報告しない**。新しいCIがあればそちらを実際に確認。
- K4AGにおける元個体ID`p95-hazard-12`のGPU原因確定は**tick11280に限定**。ほかのtickの単体IDはUNKNOWN。K4AIの幾何距離と、人間の視野遮蔽時間は別物。
- **ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD**、正式ART0件・Slope2 DNA0m、研究用モデル/Collider新規0。旧K4/K4R/K4U ART REJECTを勝手に覆さない。

## この次に実行する作業

1. GitHubでK4AJ研究ブランチ最新HEAD、[#41566784540](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41566784540)と、それ以降のrun、Artifact、PR#46を確認する。
2. CI成功ならArtifact ZIP/SHA/CRC、元画像・元GPU/復元depth、100×11,176データ・300seq・元K4AFアンカー/個体帰属の独立監査を実施し、**当該観測窓のGPU sampled-depth区間**のみ確定。失敗なら最初のエラーを根拠に最小修正。queuedなら**余計なworkflow対象pushによるCIキャンセルを避ける**。
3. SOURCE TECH PASSしてもART合格とせず、将来都市の大幅な美術改善につながる具体的ART-FIRST候補と本物の人間プレイ審査へ接続する。実コード改修・テスト・GitHub保存まで進める。
4. Chat + GitHub中心、ユーザーのローカルPC操作・ZIP作業を求めず、**Workは事前承認なしに使用しない**。最新の正本を随時更新し、新チャットに長大なプロンプト貼付を要求しない。

## 新チャットからの一文

「DOPAGAKI SLOPEをGitHubの`research/k4aj-native-b51-gpu-depth-contiguous-window-20261103`の**START_HERE.md**から完全に引き継いでください。統合正本・固定方針・反省点を守り、最新CIとDraft PR #46を実照合して次の正当な開発工程を実装・検証・GitHub保存まで進めてください。main・本番・Work無断使用は禁止です。」

## 2026-11-03 11:53 JST 追加：K4AK ART-FIRST 非干渉工程

K4AJ本命の[Actions #41566784540](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41566784540)は11:53 JST照会時点でも `queued`、Artifact 0件。**GPU遮蔽区間は未確定**。K4AJ対象script/workflowへ再pushしてキャンセルしない。

前工程の待機と並行して、[K4AK ART-FIRST審査設計](docs/R19_A6P4_R2F5K4AK_ART_FIRST_GPU_TO_TRUE_CAMERA_REVIEW_JA.md)、[K4AK読み取り専用レビューゲートPython](scripts/p101-r19a6p4r2f5k4ak-art-first-review-packet.py)、[専用の低負荷・非干渉CI #41568787273](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41568787273)を隔離研究ブランチへ追加。7種類の合成データ改ざん負例と真Artifact不足を拒否する設計。**専用GitHub CIの実行はqueuedでありPASSではない**。K4AJ生Artifactの真SHA/CRC/全GPU深度監査はこのスクリプトで代替できない。元ゲーム、main、PR#46、本番、元ソースblob、B48/B51、Camera、元物理は変更なし。

次はまずK4AJ・K4AKのCIの実行結果と生Artifactを確認し、K4AJがSUCCESSなら生SHA/CRCを独立検証した後に限ってK4AKを**実Artifactに適用**する。ARTは未制作のRoad5《斜裂公共峡谷》構図1方向を真正元カメラのA/Bで検討する方針だが、現状の新ART候補モデル0、正式採用0、Slope2 DNA0m、HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。過去K4/R/U不採用は変更しない。

## 2026-11-03 K4AL：真正RGBの取得不足を静的計算・コード検証（K4AJ/K4AK非干渉）

[ART-FIRST RGB証拠照合と次工程](docs/R19_A6P4_R2F5K4AL_ORIGINAL_RGB_EVIDENCE_COVERAGE_AND_ART_FIRST_JA.md)、[K4AL実装](scripts/p101-r19a6p4r2f5k4al-true-rgb-coverage-audit.py)、[合成100ケースE2Eと5負例テスト](tests/p101-r19a6p4r2f5k4al-rgb-coverage.test.py)を同研究ブランチへ保存。撮影**計画上**、K4AJ元RGB画像は8時点（元/mask/復元×各1）、K4AK ART-FIRST審査要求は15時点。共通6／未撮影9／追加2を検出。**まだ真正画像の実取得成功ではない**。K4ALの自己検証・100合成ケースE2Eと5改ざん負例はローカルPASS、真Artifact適用はHOLD。queuedのK4AJ #41566784540／K4AK #41568787273をキャンセルさせないため、それぞれのworkflow対象scriptは変更せず、独立K4ALファイルと文書のみ追加。**直近のCI結果は必ず再照会**。真K4AJ ZIP/SHA/CRC/生depth独立PASS後だけK4AK→K4ALの順に適用。正式ART採用0件／Slope2 DNA認定0m、HUMAN/SAT/CCD/FPS/RELEASE/MERGE HOLD、本番・main・PR#46不変更。

## 2026-11-03 K4AM：ART審査用の真正元RGB9時点欠落を補う独立実装

[K4AM設計・審査契約](docs/R19_A6P4_R2F5K4AM_NINE_MISSING_ORIGINAL_RGB_TRUE_WEBGL2_JA.md)に従い、[真正Chromium取得コード](scripts/p101-r19a6p4r2f5k4am-genuine-original-nine-rgb-gaps.mjs)、[独立GPU/RGB監査](scripts/p101-r19a6p4r2f5k4am-independent-nine-rgb-depth-audit.py)、[合成負例](tests/p101-r19a6p4r2f5k4am-independent-native-rgb-depth.test.py)、[専用CI](.github/workflows/p101-r19a6p4r2f5k4am-original-nine-missing-rgb.yml)を隔離研究ブランチへ保存。K4ALで判明した元RGB不足9tick＝14m:11326/11338/11349/11351/11363、28m:11265/11277/11284/11301に限定し、元RGB／B51全28体group visual mask／復元RGBの**各3枚×9tick=27PNG**、**本物のGPU readback 27本・各11,176点**を取得する実装。元K4AI確定生JSON SHAと元ゲームsource blob固定。**GitHub CI実測結果・Artifactが確認されるまで完了PASS扱い禁止**。K4AJ、K4AK、K4AMの3 CIは独立。元HOLDをすべて継続し、新ARTモデル0、正式採用0、Slope2 DNA0m、PR#46・main・本番不変更。

次は3本のCI結果を実照合し、成功時のみK4AJ生Artifact SHA/CRC/depth独立監査→K4AK実レビューpacket→K4AL＋K4AM元RGB真正画像SHA突合→候補デザインの元cameraでのA/B審査へ進める。単に15元RGBが揃っても**人間可読性や新候補ARTは未検証**。

## 2026-11-03 K4AJ真GPU成功・K4AN本物のART-FIRST原画検査へ（今回の最新）

- **K4AJ GitHub Actions #41566784540 completed/success**。真正Artifact #13201661563、**11,959,523 bytes／ZIP SHA-256 `60aab331d8881b5f8f456539c00566837a2b061a96ab0725ce7c17ea91ed8efb`**、28件CRCすべてPASS。実生GPU 100元／100全B51 group mask／100復元×11,176点、300seq連番・元深度完全復元を別環境で独立再計算。詳細：[K4AJ最終実証](docs/R19_A6P4_R2F5K4AJ_CONFIRMED_100_NATIVE_GPU_DEPTH_ART_HOLD_20261103_JA.md)。
- 元GPU深度格子でB51群の寄与が1点以上の元native tick：**14m 39/50（11320–11350、11362–11369）**、**28m 38/49（11259–11288、11300–11307）**。最大は14m tick11339で11,176/11,176=100%、28m tick11277で6,396/11,176=57.2298%。tick数÷240秒の数値を**人間の視界遮蔽秒数と誤認しない**。個体別原因帰属はK4AGのtick11280だけ。
- 元sourceの実8時点×元/mask/復元PNGを目視・独立SHA検証。14m tick11341では元B51形状が大きく画面を覆い、群maskで道路が見える。**これは人間プレイ・ART合格の評価ではない**。
- [K4AN独立レビューコード](scripts/p101-r19a6p4r2f5k4an-original-rgb-review-sheets.py)／[K4AN実Artifact統合専用CI](.github/workflows/p101-r19a6p4r2f5k4an-pinned-real-gpu-to-art-review.yml)／[日本語契約](docs/R19_A6P4_R2F5K4AN_REAL_ART_FIRST_SOURCE_RGB_ATLAS_JA.md)を隔離研究ブランチへ保存。[Actions #41572736850](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41572736850)は作成直後queued。K4ANは本物の元K4AJ ZIPをSHA pinし、K4AK→K4ALを実Artifactで走らせ、元RGB比較2枚とレビューJSONを研究ブランチ `docs/research-evidence/k4an/` へ直接保存する設定。**CIの実成功とGitHub画像保存を確認するまではHOLD**。
- K4AK #41568787273、K4AM #41571299893は前照会ではqueued。次回は三つのrunとArtifactを実照会する。K4AJ成功をK4AM成功に横滑りさせない。
- 今後はGPU測定の反復ではなく、原画で見えるB51と公共空洞の関係を踏まえて未制作Road5《斜裂公共峡谷》の**本物のART-FIRST単一候補**を独立研究。候補の元source同poseカメラA/B・三層公共空洞・人間走行を審査するまで、ART正式0件／Slope2 DNA0m／HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。main・元source/Camera/240Hz球/B48×7/B51×28・本番URL・Draft PR#46不変更。Work事前承認。

## 2026-11-03 K4AO — 真正元RGBの対話式レビューとART-FIRST重点6tick

- [K4AO詳細正本](docs/R19_A6P4_R2F5K4AO_REAL_SOURCE_CAMERA_ART_REVIEW_JA.md)、[再現用Python](scripts/p101-r19a6p4r2f5k4ao-source-only-offline-art-review.py)、[K4AK要求15tickの実測ピン留めJSON](docs/research-evidence/k4ao/K4AO_TRUE_GPU_DEPTH_15_ART_CAMERA_REVIEW_ANCHORS.json)を隔離研究ブランチに保存。K4AJ真ZIP ID 13201661563／SHA-256 `60aab331d8881b5f8f456539c00566837a2b061a96ab0725ce7c17ea91ed8efb` から本物の8元source RGBとB51全28体群mask RGBを比較する完全オフラインHTMLをローカル生成、真PNG SHA/元復元GPU11,176点/100-case CSV突合・JS構文検証PASS。**元B51描画除去は研究用比較のみで元ゲームを改変しない**。
- 重点真正カメラtick：14m **11338（93.951%）／11341（100%）／11349（47.423%）**、28m **11277（57.230%）／11280（53.436%）／11284（37.938%）**。数値は11,176点の**B51群GPU深度サンプル変化**であり肉眼の遮蔽率ではない。実元RGBは要求15中6tick、残り9はK4AM真CI実測待ち。K4AOの新モデル0、ART正式採用0件、Slope2 DNA0m、HUMAN/SAT/CCD/FPS/RELEASE/MERGE HOLD。
- 次はK4AK #41568787273、K4AM #41571299893、K4AN #41572736850を実照合。CI未完了を成功とせず、K4ANの本物の審査アトラス＋K4AM不足9tick真正RGBを収束させた後、Road5《斜裂公共峡谷》の**一候補の真正同源Camera RGB A/B**を初めて制作・ART審査する。旧K4/K4R/K4U ART REJECTを再採用せず、main／原source／Camera／球240Hz／B48×7／B51×28／本番／PR#46を変更しない。Work事前承認。

## 2026-11-03 K4AP：真GPU画面三区分が覆した「高遮蔽tickで都市を読ませる」仮説

[K4AP ART-FIRST二段構成の報告](docs/R19_A6P4_R2F5K4AP_ART_FIRST_TWO_BEAT_TRUE_SOURCE_CAMERA_JA.md)／[真ZIP読取・127×88深度格子三区分解析器](scripts/p101-r19a6p4r2f5k4ap-real-b51-gpu-camera-beats.py)／[GitHub永続保存された検算サマリー](docs/research-evidence/k4ap/K4AP_REAL_SOURCE_B51_GPU_HORIZONTAL_THIRDS_SUMMARY.json)を研究ブランチへ追加。K4AJ真Artifact #13201661563のSHA固定ZIPをローカル独立再計算：14m 50tickのB51群除去GPU深度格子サンプル変化率は**左23.474%／中34.400%／右31.885%**、28m 49tickでは**左9.635%／中20.407%／右16.108%**（元11,176サンプル・各native tick集計）。14m **tick11339–11347の9連続tickで全三区分の11,176点すべて変化**。逆に14m 11351–11361、28m 11289–11299の各11tickは同group maskの変化検出0。これは**人間の全画面遮蔽、空き地、衝突安全、建築可読性を意味しない**。

**新しい正当なART-FIRST判断**：既決定のRoad5《斜裂公共峡谷》を**危険前の都市峡谷入口／危険後の中段公共テラスと遠方広場**という「二段の視覚構成」で1方向だけ検討し、真正B51の中心危険時点に巨大建築を重ねて都市の見栄えを稼ぐ案はやめる。K4AOの高遮蔽重点tickは**B51可読性を保護する審査点**であり、新都市が同じ画面で読める合格点ではない。真の人間視認時間はUNKNOWN。旧K4/R/U ART REJECT、正式ART0、Slope2 DNA0m、新候補モデル0、HUMAN/SAT/CCD/FPS/RELEASE/MERGE HOLDを厳守。

**次は**K4AM #41571299893の不足9枚真RGB・K4AN #41572736850の実Artレビュー画像をまず照合、成功時だけ真正元Cam同poseのBlender-native一案A/B制作に進む。K4AK #41568787273は合成QA SUCCESS済み。main／本番／PR#46／凍結source／B48 7／B51 28／元物理・カメラ不変更、Workは事前承認。新CIを増やさない。


## 2026-11-03 K4AQ — ART-FIRST画面全体の抜本再設計（新隔離研究ブランチ）
新しいユーザー指摘では、既存の画面は単に「都市でない」のではなく、**画面全体の色彩・素材・造形・ライティング・密度が雑で、評価できる美術がほとんどない**ことが最重要。技術計測の反復を主目的とすることは禁止。今回の **研究ブランチ `research/k4aq-road5-art-direction-rebuild-20261103`** でRoad5《斜裂公共峡谷》の美術制作を実際に開始。詳報：[K4AQ画面美術再設計と実装・真正カメラ審査契約](docs/R19_A6P4_R2F5K4AQ_ROAD5_FULL_SCREEN_ART_DIRECTION_JA.md)。

実装：`web/p101-k4aq-road5-civic-rift-material-art.mjs` に非対称の多層居住・公共都市構造、8素材マテリアル、独立WebGL2法線照明を作成。既存K4AD元sourceを完全隔離複製し、元240Hz／Camera／B48×7／B51×28／元source blobを触らず、真正原カメラ6tick×旧新計12 PNGの取得コードと専用CIを追加。既存K4AM/K4ANは独立runとして保持。新候補の真WebGL2スクリーンショットを実際に見て厳しく審査するまで**ART NOT_TESTED/HOLD、正式ART0件、Slope2 DNA0m、HUMAN/SAT/CCD/FPS/RELEASE/MERGE HOLD**。main・本番・PR #46は変更しない。次は新CI／Artifactsを照合し、真正画像で美術的に改善したか評価する。資料中の旧「最新HEAD」は必ずAPIで再取得すること。


## 2026-11-03 K4AR — 建築が本当に映ったかを空から分離する最新継続入口

**現継続研究ブランチ**：research/k4ar-road5-massing-and-true-mesh-evidence-20261103。今回の引き継ぎ・固定方針・問題点・次工程は [K4AR詳細正本](docs/R19_A6P4_R2F5K4AR_TRUE_CAMERA_THREE_WAY_ARCHITECTURE_PIXEL_GATE_JA.md) を読む。

**決定的な穴**：K4AQの元/新A/BのRGB差は空色変化だけでも成立し、新建築が映っている証明にならない。K4ARに、元source同native tick 6×（original／sky-only／sky+architecture）=18真正WebGL2 PNG・元Camera/B48/B51保護・独立PNG SHA/画素監査を実装。専用Actions #41585003708は作成直後queuedであり、ARTや画素検証はまだPASSではない。

次回はまず旧K4AQ [#41580058193](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41580058193) と新K4AR [#41585003708](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41585003708) の**現在**のstatus/jobs/Artifactを実照合。成功なら本物の18画像を開いて美術を厳しく審査。まだqueued/runningなら無用なworkflow対象pushやCIキャンセルをしない。新しい建築が画面に出ても、箱形11棟と繰返し配色が悪ければART REJECTとして一方向を再設計。単なる画素数や三角形数で認定しない。

K4AN [#41572736850](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41572736850) は2026-11-03にSOURCE RGBレビューCI SUCCESS、旧研究枝に比較PNG保存済み。新美術の実画面とは異なる。PR#46はOPEN/Draft/未マージ。main／本番／元source blob af076d67492a677d2235e4730aef8cdf4808e106／元物理・Camera・B48道路7・B51動体28は変更せず、Work事前承認制を守る。

**未変化判定**：ART正式0件、Slope2 DNA0m、ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。


## 2026-11-03 K4AS — 現在の継続入口（全画面の道路・B51素材美術）

**現在作業を継続する研究枝**：research/k4as-road5-native-screen-material-rescue-20261103。K4ARの真正3群比較を継承した美術改善実装。詳細：[K4AS元画面美術改善正本](docs/R19_A6P4_R2F5K4AS_ROAD5_NATIVE_SCREEN_MATERIAL_RESCUE_JA.md)。

K4AJの真正元Road5画像で確認した画面全体の彩度・単純色面問題に対し、**元のsource 240Hz／Camera／B48×7／B51×28のXYZ・当たり判定は変えず**、Road5元sourceカメラが実際にRoad5を描く場合だけ、研究用B48マット路面、A13元路面装飾の統一パレット、B51赤失敗／黄反発／紫押出しを保持した暗色装甲を描画する。K4AQの天空・建築もそのまま比較可能。元の他6道路／Gold／P100／W9-X／B5とmain／本番／PR#46は無変更。

**新実装**：web/p101-k4as-road5-original-screen-material-system.mjs、private-road5-material-pack、unit tests、24枚の元WebGL2同camera（original／sky-only／city／city+materials）撮影、独立画像SHA／画素監査＋比較シート、独立CI [#41589057566](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41589057566)。

**最新実測値はGitHubで再照合**：作成直後K4AS CIはqueuedで真正新画像0、K4AQ #41580058193はpending、K4AR #41585003708はqueued。K4ARに実コードのレポート出力名不整合があるので、そのCI成功を推定しない。**K4ASも新造形/世界水準のART品質は未検証で正式採用0、Slope2 DNA0m、HUMAN/SAT/CCD/FPS/RELEASE/MERGE HOLD**。ロード素材の色変更を美術合格と混同しない。次は実24PNGの画面審査、問題が残ればロード形状・建物・照明・公共空洞を本物の世界水準へ再設計。

Workは事前許可なしに使用しない。ユーザーのローカル操作不要。旧K4/K4R/K4U ART REJECTを覆さない。


## K4AS修正引き継ぎ（2026-11-03 16:04 JST以降）

**最優先入口**：[K4AS正本の真Artifact解析追記](docs/R19_A6P4_R2F5K4AS_ROAD5_NATIVE_SCREEN_MATERIAL_RESCUE_JA.md)。

K4AQ #41580058193／K4AR #41585003708／K4AS #41589057566は**全てcompleted/failure**。3本の本物のArtifact JSONで、初期化JavaScript **Cannot access 'r19a1OptIn' before initialization** を確認（120s timeoutは二次症状）。旧版の「待機」「成功見込み」を現在値に使わない。これまでの真正新候補PNG取得は0枚、ART正式0件。

K4AS隔離枝のみでK4AQのprivate pack内のr19a1OptIn先読みをlocalhost+明示URL条件直接照合に修正、再度の診断用pageerror fail-fastを追加。専用[修正後Actions #41594250729](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41594250729)は起動直後queued。**CI success／新ART画像や実FPSは未確認**。次担当はそのrunの本当のstatus/jobs/log/Artifactを最優先照合。元K4AQ/AR研究枝を重複実行せず、K4ASの真正元cam 6tick×original/sky/city/material=24画像と独立SHA＋コンタクトシートを取得・目視、未達なら本物の失敗症状を修正。

main・本番・元source blob af076d67492a677d2235e4730aef8cdf4808e106・元Camera/240Hz/B48×7/B51×28・Draft PR#46無変更、Work事前承認、ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。


## 2026-11-03 K4AT — 最新の継続入口：本物の元カメラ画像に基づく造形改善

**継続研究ブランチ**：research/k4at-road5-civic-canyon-sculpted-architecture-20261103。前K4ASの[TRUE native 24画像artifact #13211991425](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41594250729/artifacts/13211991425)の**生RGB全24枚**を独立確認。SOURCE SCREEN MATERIAL TECH限定PASS。しかし視覚的には広い単調な道路・残留多色線・ほぼ黒い空・右側だけの繰返し箱建築・公共奥行きの不足で、K4ASは**ART REJECT**（正式ART採用0）。素材変更だけでは世界水準にならない。

新K4AT一方向は[美術/固定契約](docs/R19_A6P4_R2F5K4AT_TRUE_CAMERA_CIVIC_SCULPTURE_ART_FIRST_JA.md)に従い、Road5の実B48座標に固定した**巨大非対称曲面シェル・抜けのあるアトリウム・奥まった暖色ガラス公共テラス5層・回転テーパー塔2棟**、元曲線バンク路面上の非衝突細分目地を研究制作。旧K4AQの反復箱街区を置換し（重ねない）、元Road5 B48/B51/CAMERA/物理は触らず、元WebGL2画面6時点×K4AS/K4AT=12枚で真評価する。元B51がCameraを塞ぐultra tick11341では建築可視を無理に通さない。

**最初の新CI #41595951481 failure**：形状テスト5件中2件FAIL。voidLongitudinalCellsの全閉鎖路面は、架空の支え床を作る代わりに0描画を合法化して修正。**2本目 #41596237031 failure**：5件中残る1件、9,918 trianglesのうち840成分が非有限。真ログから更に診断し、ねじれた塔のブロンズ継ぎ目の4頂点目でz指定を欠いていた一箇所 `local(f,vb[0]-off,vb[1]-off)` を `local(f,vb[0]-off,vb[1]-off,vb[2])` に修正。関数を独立V8合成スタブで再評価して9,918 triangles / 208,278数値/有限PASS、元doc不変。GitHub真正CIの検証とは別物なので混同しない。

**K4AT更新後専用 [#41596692908](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41596692908)** は最終確認時QUEUED、12真正新RGB/ART判断は未実測。新Runの実Status/jobs/Artifactを必ず確認。次は真正6視点のコンタクトシートを開いて、今回の曲面建築が本当に画面に映り、単純な雑造形を脱したか厳しく評価。届かなければART REJECTのまま設計再検討。元モデルblob af076d67492a677d2235e4730aef8cdf4808e106／240Hz／Camera／B48 7／B51 28／main／本番／Draft PR#46 unchanged、Work事前承認、HUMAN/SAT/CCD/FPS/RELEASE/MERGE HOLD。


## K4AU （2026-11-03）現在の唯一の次工程／引き継ぎ入口

**最新隔離美術研究枝**：research/k4au-road5-genuine-material-lighting-20261103。まず[K4AU正本](docs/R19_A6P4_R2F5K4AU_TRUE_SOURCE_MATERIAL_LIGHTING_ART_REVIEW_JA.md)へ。従前K4AT GitHub [#41596692908](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41596692908) は**完了SUCCESS**、本物12画像+元データSHA監査実成功、Artifact #13212149720を取得。K4ATの元cam画像を直接見た結果、両側斜めの巨大梁・レトロで反復的な立面と、現状ほぼ黒いB51機械箱と色面だけの道路・黒い空・大きな空虚部が目立ち、品質目標には未達のため**ART REJECT**。ART正式採用は0件。

K4AUは街区の量産を一旦やめ、**元の実物B48道路と元B51実動体28の原VBO/姿勢を変えず**、同じ原Camera WebGL2に面法線によるライティング・金属表面ノイズ・石材/アスファルト微細質感・パネル目地・実警告の赤/琥珀/紫を実装する。独立起動 `k4aq=on&k4as=materials&k4at=on&k4au=on` のみ、元ART候補とのnative 6時点×2=12真正source PNGを比較。試験はsource改変拒否／元球/camera/B48/B51検証／実GPUコンパイルと独立PNG画素監査。最初の専用 [CI #41598855479](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41598855479) は作成時QUEUED。**実際の新GPU成功/ART改善は未検証、次担当が最新run/jobs/Artifactを読む**。失敗ならログ原因を最小修正、成功なら本物の12画像を目視して美術の結果を厳しく判定する。

不変：元物理240Hz／0.65m球／実B48七章/B51 28／元カメラ・当たり判定／source blob af076d67492a677d2235e4730aef8cdf4808e106、main・本番・Draft PR #46変更禁止、Work事前承認、正式ART/Slope2 DNA0件、HUMAN/SAT/CCD/FPS/RELEASE/MERGE HOLD。


## K4AU 完了審査と次のART-FIRST出口（2026-11-03 JST）

旧入口のK4AU #41598855479 は**completed/SUCCESS**になった。旧QUEUED記述は履歴であり現在状態ではない。真正Chromium source-native 12PNG+独立SHA監査 [Artifact #13213758069](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41598855479/artifacts/13213758069)。真元カメラ6tickで元B48路面/元B51実28動体を変えず GPU材質陰影効果を実測し、RGB差は 280,890～592,547px/707,400px。**SOURCE SCREEN MATERIAL TECH限定PASS**だが、実画像目視で「路面がやや実材質らしくなった」「B51機械の面陰影が出た」に留まり、大規模に単調な路面、黒空、左右長大梁、繰返しの建築ファサード、巨大B51の視界妨害は残存。**K4AUも正式ART REJECT。正式採用0件、Slope2 DNA0m、全HUMAN/SAT/CCD/FPS/RELEASE/MERGE HOLD。** 正本：[K4AU完成レビューと次工程](docs/R19_A6P4_R2F5K4AU_TRUE_SOURCE_MATERIAL_LIGHTING_ART_REVIEW_JA.md)。

**次の正当な工程**：最終画面の美術レベルを先に変える大改修を別研究枝に一候補だけ制作。暗空の広い背景＋同型直方体ファサード・斜め梁を繰り返すという既往の根本問題へ直接対応。高い意匠を持つ本当に利用される公共空洞・可読な超未来都市・光/大気/遠景・人間スケールの層を構築し、元native 6tickの真画面A/Bで品質を判定。小さい色替え、技術ゲートの追加、単調な箱/輪の増築の繰り返しをしない。元B51の危険シーンを美術だけで隠したり物理を改変したりしない。

研究のGitHubのみ作業。main・本番・Draft PR #46、元source blob af076d67492a677d2235e4730aef8cdf4808e106、元Camera/球/240Hz/B48実7・B51実28不変更。Workはユーザーの事前承認制。ユーザー側ローカル操作不要。


## 2026-11-03 K4AV：コースの根本的に酷いビジュアルを抜本的に直す研究

**最新の継続する隔離研究枝**：research/k4av-road5-full-screen-art-reset-20261103。固定方針・理由・ART受入禁止条件は [K4AV 全画面美術再構築憲章](docs/R19_A6P4_R2F5K4AV_FULL_SCREEN_ART_RESET_CHARTER_JA.md) を読む。

真正K4AU WebGL2画像を再確認すると、元道路全体が平板な雑配色、障害物は巨大箱、超未来都市は同型ファサードの繰返し、黒い空、斜め梁、公共空間の使われ方の不在という**全画面の美術失敗**が残る。過去のK4AS/K4AT/K4AUはTECH限定PASSだが美術**全REJECT**。元Road5のART正式採用0件／Slope2 DNA0m。

**K4AV実装**：道路の実B48を根拠に、巨大ゲートや繰り返しの箱を撤去して別の独立した公共建築都市一案に置換。曲面屋根の公共ホール、5層級のガラス駅・市民回廊/中庭、複数形式の塔、実道路端の物理的に筋の通った低い側面構造。雑多な蛍光三角形の**非衝突**装飾だけを研究用描画から取り除き、元道路・危険・源B51動体・物理は維持。新の青灰→暖色水平線の大気・雲と奥行きを別のWebGL2天空プログラムで生成。元K4AUの実動体/路面材質効果は継続。

**真正3群画面検証**：元K4AU画面／新大気＋旧道路・都市なし／新大気＋新公共都市を、**真の元native Road5 6tick×3=18PNG**で比較。空の色が変わっただけでは新建築が見えた証明にしない。真球・元Camera/B51完全同一性、独立PNG SHA/画素差を検証。ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE HOLD維持。見栄えが悪ければ正式REJECT。

**不変**：凍結source blob af076d67492a677d2235e4730aef8cdf4808e106、240Hz／球半径0.65m／実B48七道路・実B51二十八動体／元カメラ/衝突、main・本番・Draft PR #46変更禁止。Work事前承認。ユーザーに手動ZIP・ローカル実行を要求しない。

今後は前回のように「色が少し変わった」「線が増えた」だけで進展と宣言しない。ゲームの画面全体が世界的なゲームの美術として成立するかを先に評価する。


## 2026-11-03 K4AV の真正画像審査による開発方針転換【これが最新・上位判断】

**重要：K4AVも正式ART REJECT。** 過去にこのSTART_HERE内で「K4AV実装／ART HOLD／CI検証待ち」と書かれていても、いまは最終実測で更新済み。この判断を優先する。

[K4AV詳細ART REJECT/次工程正本](docs/R19_A6P4_R2F5K4AV_FULL_SCREEN_ART_RESET_CHARTER_JA.md) を最初に読む。K4AV [Actions #41601799002](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41601799002) **completed/SUCCESS**、18枚本物の元Road5 source native Camera + independent SHA監査 [Artifact #13214568215](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41601799002/artifacts/13214568215)。source B48 7/B51 28/240Hz/Camera等不変。6フレーム中5フレームは新都市描画のpixel差が9.1〜12.6%、超巨大なB51で完全視界遮断されるultra11341は0%。これらは**技術的に描画された証拠のみ**。

実画像の品質は依然として酷い。空色/斜め梁だけは少し改善したが、コースは巨大な灰色平面にピンク/水色線が残り、都市も繰返しの水平帯箱ファサード。元B51が正面視野を奪う問題も変わらない。ART REJECT・正式ART採用0件・Slope2 DNA認定0m。**K4AS/K4AT/K4AU/K4AVのソースTECH成果をART成果扱いせず、同型のJS自動生成の再発は禁止。**

**新しい継続工程はロードのArt-First/DCC-first立て直し**。元WebGL2/source Cameraで残存する色付き図形の本当の描画レイヤーと安全意味を監査→Blender等の編集可能な立体原本・PBR/UV/ライト/建築内部・地形/都市遠景をRoad5の一つのHero短区間に手を入れてアート先行制作→原Camera代表3構図で厳格ART審査→合格したものだけ実WebGL2移植/元source 240Hz高速走行審査。**道路パレットの微調整・箱の数/三角形数/TECH PASSの増加で見栄え改善と主張する手法を停止**。本番/PR#46/mainや元物理を変更しない。Work事前許可、ユーザーのローカル操作なし。

次の担当は新しい研究ブランチやCIを先に乱発せず、元画面のアート作法と実描画レイヤーを把握して「今までと根本的に違う完成度のHero区間」を最優先に実制作する。原画像上で現代的なプロゲームのアート品質と明確に認められないなら採用しない。


## 2026-11-03 K4AW→K4AX　最新の唯一の継続入口：真の路面塗装発生源→編集可能Blender原本

**過去のK4AV/旧K4AS-K4AUの「描画TECH成功」を美術成功と誤認しない。** ユーザー評価は「まだコースのビジュアルが酷い」。正式ART採用0件・Slope2 DNA正式認定0m。旧不採用を上書きしない。K4AX以降もART-FIRST/DCC-FIRSTへ制作方法を切替え、ただの箱追加・色替え・TECHゲートの積上げは禁止。

### 最新GitHubブランチ
`research/k4ax-road5-editable-blender-civic-exchange-20261103`。最新の[**原因確定資料／Blender工程の統合正本**](docs/R19_A6P4_R2F5K4AW_K4AX_SOURCE_COLORS_AND_BLENDER_ART_FIRST_JA.md)を最優先で読む。元K4AV正本は履歴として維持。

### K4AW：ピンク・シアンが消えなかった理由が本物の元カメラで確定
[Actions #41604593198](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41604593198) completed/SUCCESS、[原Artifact #13216820565](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41604593198/artifacts/13216820565) で**元native Road5真正WebGL2×2時点×8描画群＝16PNG・独立SHA/色閾値監査**が成立。元物理/B48七/B51二十八/元カメラ完全不変。元色面はK4AVで既にOFFのA13ではなく、**P100道路視認マーカー（control明るいピンク−2,491px）とB5道路演出（同−1,185px）から強く出ている**。元道路端表示・B51警告からシアンも生じる。W9C1は元GPU draw呼出1ながら、この2時点の描画画素差0。個別寄与は重なりがあり足し算不可。**P100/B5/路端/B51の安全表示は実ゲームから無断削除不可。** 研究用マスクは安全性が検証されていない非プレイ画面。

### K4AX：3Dオブジェクトを自動box量産する方式を停止し、実Blender原本へ
[元sourceカメラ6時点のSHA固定JSON](docs/K4AX_TRUE_SOURCE_ROAD5_CAMERA_REFERENCE_20261103.json)、`scripts/p101-r19a6p4r2f5k4ax-blender-editable-tidal-exchange.py`、[Blender CI](https://github.com/ryomashibaba/dopagaki-development-hub/actions?query=branch%3Aresearch%2Fk4ax-road5-editable-blender-civic-exchange-20261103)。真Blenderで**単一の研究Hero区間「Tidal Exchange」**（二重曲率の厚いセラミック屋根・開いた市民広場／水盤・入口の奥まったガラス・木製家具・植栽・穏やかな暖色内装／1本の遠景ねじり塔）を編集可能なネイティブ`.blend`と`.glb`として生成、元Camera数値control11259/11278/11307から3枚のDCCプレビューをレンダリングするコードを作成済み。

**注意：DCCの3画像は「元Cameraの数値を利用したBlender独立プレビュー」であって、「元のWebGL2ゲームを描画した正規映像」ではない**。元B48/実B51/元HUD/衝突をスタジオへ統合していないので**源道路・危険物との干渉、安全な公共床、HUMAN/FPS、ARTはまだ何も保証されない**。Blender正本をゲームへ許可なく取り込まない。

初回DCC CIはPython構文でFAIL、改訂RunはUbuntu版BlenderでOpenImageDenoiser未ビルドのためレンダリングFAIL（ただし.editable .blend原本の生成までは到達）。修正では元物理に触れずデノイザ不使用・Cycles 24 samplesで再実行。**成功・真PNG目視・素材品質・クリアランスPASS等は最新CIと実Artifactを現時点で再確認するまで未認定**。

### 次担当の実行順序
最新K4AX GitHub Actionsの**本当の** status/jobs/Artifactを先に再照合。レンダ成功なら真实`.blend`/GLBとDCC PNGを開いて厳しくART審査。酷いならART REJECTしアート原本を本格改修、単なるカラーノイズやBOX増築を繰り返さない。候補が審査に値した時のみ、元B48真正曲面＋B51実動体との空間クリアランスを新たに計測し、source PRIVATE WebGL2へ導入、本当の元ゲーム画面／元240Hz本走行で再審査。P100/B5等の安全な代替表示は別課題として保持。

**絶対禁止**：元source blob `af076d67492a677d2235e4730aef8cdf4808e106`、240Hz物理・球半径0.65m、元Camera・B48 7/B51 28、Gold/P100/W9-X/B5、main、本番、Draft PR#46の変更。Work事前承認、ユーザーにローカルZIP等操作要求禁止。ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD、正式採用0件。


---

## 【最優先・2026-11-03最終】K4AY完全統合引き継ぎ／ART-FIRST・DCC-FIRST継続

**新しいチャットはこの項目のリンク先が最新の引き継ぎ正本。** 過去節の「QUEUED」「次はK4AV/K4AW/K4AX」の記述は当時の履歴。最新判断は必ずこの節から辿る。

### [2026-11-03 K4AY 完全統合引き継ぎ正本（方針・過去の失敗・最新CI・制作着手点）](docs/DOPAGAKI_20261103_K4AY_COMPLETE_INTEGRATED_HANDOFF_JA.md)

**現在の継続研究枝**：\`research/k4ay-road5-authentic-b48-blender-context-20261103\`。K4AXのHEAD \`8be964ea841e505f03bbce0a15b0d95785edf400\` を基点に作成し、まだRoad5真正B48/B51のBlender統合コードは**未実装**（引き継ぎ正本のみ保存済）。本当に実装済みのように報告禁止。

**直前の事実**：K4AW元Road5 16 PNG source-layer監査 Actions #41604593198 SUCCESS。ピンク色の主要描画元はP100路面視認マーカーとB5演出（control側それぞれピンク−2,491/−1,185px）、水色は源路端/案内とB51危険ガイドの寄与が大きい可能性。安全表示を勝手に消さない。K4AX編集可能Blender \`.blend\`＋\`.glb\`＋3 source-pose DCC画像＋1 artist-camera画像 Actions #41607194912 SUCCESSだが、実Road5 B48物理サーフェス・B51実動体がBlender内に未収録で、建築構図の黒空白・連続性欠如等の美術問題が残る。**正式ART採用0、Slope2 DNA0m、K4AXアート未採用**。Blenderプレビューは元の240Hz WebGL2走行画面ではない。

**次工程**：実source \`private/reference_only/director/surface.js\` の \`sample/frame/tessellate\` と本物のRoad5 stage、\`private/reference_only/director/moving/moving-obstacles.mjs\` の \`movingObstaclePose\` により、原道路B48と元時刻B51 OBBのSOURCE READ ONLY Blender 3D参照を作成。既存K4AX \`.blend\`原本＋真正カメラ数値6時点で道路と建築の構図/クリアランスをART-FIRST監査。正しい出自と不変元物理/元カメラ/Git blob SHA \`af076d67492a677d2235e4730aef8cdf4808e106\`を守り、実装・テスト・GitHubに結果保存。**細かい色替えや同じ反復箱のJS追加は禁止**。本番・main・Draft PR #46不変更、Work事前承認、ユーザー側ローカル操作不要。

正式ゲート：ART / HUMAN / SAT / CCD / FPS / RELEASE / MERGE すべてHOLD。他6Roadへ複製・ゲーム公開は禁止。


---

## 2026-11-03 K4AY 実コード着手記録（必ずActionsで最終判定）

[実装・テスト・保護契約と次作業の技術正本](docs/R19_A6P4_R2F5K4AY_AUTHENTIC_B48_B51_BLENDER_SOURCE_CONTEXT_JA.md)

研究ブランチでB48 Road5の本物の`sample/frame/tessellate`抽出、control/ultra 6tick×B51 28体source collision OBBの時刻別再現、元K4AX `.blend`の別collectionへ非破壊挿入、6元Camera DCC-only画像生成と独立検証を行うコード・専用CIを追加した。**コードのGitHub保存は完了したが、K4AY Actions #41610821799の実成功／Artifactsは現時点では未確定**。確証のない Blender/ART PASS を絶対に書かない。SRC静的テストのPASSとDCC完成、美術品質を区別する。初回K4AY CI run はworkflow対象外の文書追記でキャンセルしない。正式ART=0・Slope2 DNA=0m・ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE HOLD、main・公式継続branch・本番・PR#46・凍結blobは引き続き保護。次はCI実ログ確認と実6DCC画像の厳格な美術評価、必要な抜本造形改修。


---

## 2026-11-03 K4AY 最終監査結果 — 実B48/B51 DCC統合 SOURCE/DCC TECH PASS・ART REJECT

- **最新の成功したK4AY Github Actions**: [#41612254866](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41612254866) **completed / SUCCESS**。全工程（保護source hash、Node独立tests、K4AX正本Artifact SHA、Blender取込み、6元Camera+1artist DCC描画、別名.blend/GLB、生成物ファイルSHA独立検証）がSUCCESS。
- **真正Artifact**: [#13218659517](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41612254866/artifacts/13218659517)、7,304,277 bytes、ZIP SHA256 `c206c8de97a7741d40e19676523e79e9e5e4a1cb3d8ae0b18349336c273cc713`。Blenderの独立した新原本 `K4AY_TIDAL_EXCHANGE_WITH_TRUE_B48_B51_REFERENCE.blend`、参照GLB、6 source Camera PNG、1 artist camera PNG、source data/manifest/provenanceがある。
- 実B48 source Road5は物理surface **index 5、ID `p93-PRISM_CREST-01`**、真 `tessellate()` メッシュ **4,728三角形 (top 2,160)**。control/ultraのRoad5原制御点SHA-256 `5eb731e25bc9eb1a3cf1080e7b239f5e2e8043bfbc80e5d37e0b069a5a08a730` は一致。Road5 longitudinal void cellsなし。7 physical B48 surfacesと28 B51本体を元docから確認、元sourceは読み取り専用。
- Source B51 collision OBB参照は各tick 28体×6tick=**168個**、元Camera ticks control 11259/11278/11307、ultra 11320/11341/11369。元物理 `movingObstaclePose(descriptor,tick/240)` を使用。これらの**衝突OBBはゲームのB51美術メッシュではない**。K4AYでは誤認を避けるためOBBを線枠で表示。元K4AXの**架空・非物理背景地形のみ**をDCCレンダリングから隠してB48実道路を露出、編集可能な原本から削除はしていない。
- **ART REJECT継続**。7枚の実DCCを目視審査したが、走行画面は大部分が淡い単純な道路/空間、左の建物は途切れ・右の塔は孤立、公共機能・人間スケール・街区連続性・空間密度に説得力が不足する。アーティストカメラは構造/屋根形状を示すが、元ゲーム画面の美術合格にはならない。**単なる色替え・道路捏造・JS box建築量産禁止**。次はこの実B48/B51原本に位置合わせした公共空間/ランドスケープ/建築の大胆なBlender-native再設計、元Camera正確な構図とクリアランス検証。
- **不変のHOLD**: 正式ART採用0件、Slope2 DNA認定0m、ART REJECT、HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。Blender画像は元WebGL2ゲーム画像ではない。建築vs真B48/B51の詳細BVH干渉・元ゲームCCD/HUMAN/FPS/安全は**未検証**。main/継続公式branch/本番/Draft PR #46/原source blob・240Hz・球半径0.65m・元Camera/衝突条件の変更なし。Work事前承認のまま。
