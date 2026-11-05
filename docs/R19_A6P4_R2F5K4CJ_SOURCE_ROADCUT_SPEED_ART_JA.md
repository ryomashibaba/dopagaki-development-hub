# 【K4CJ R2最終確定：本物の道路沿い198m実地形DCC・ZIP全CRC/SHA／TECH PASS、直接ART REJECT】

**2026-11-05 JSTの最新確定成果。正式ART採用0件／Slope2 DNA認定0m。** ここより下にある「未完了」「進行中」は各過去時点の記録。R2完了の根拠にはならない。

## 正式な実装・独立実証

- **最終R2 [Actions #41968702663](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41968702663) completed/SUCCESS、全12ジョブ工程PASS**。元K4CI編集可能.blend SHA256 `f1ce87fff6c88841890b6fc2dd4840db4b35a86be75236d90c02613a26ac7bb4`を実Artifactから固定照合し、元Game Git blob `af076d67492a677d2235e4730aef8cdf4808e106`と元Road5頂点・面SHA `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`を事前・事後確認。元6 Camera/CHASE・元11木/灯光・研究原本メッシュのジオメトリと行列不変、元道路・物理・ゲームCollider変更0。**K4CHの可視研究岩壁2件は原本保持、研究R2での`hide_render`切替のみを独立監査**。
- 真のBlender EEVEEによる**198mにわたる元SOURCE Road5と標高の一致する100縦断地点×11横断面、1,100頂点/1,980三角面の沿岸切土**。ほかに**392頂点/294面の1体の10区間風防**と、親研究岩壁を複製した可編集研究岩2件。合計4つの編集可能な研究メッシュ。道路の物理的半幅約13.15mに対し、切土は道路中心から最短16.65m離して実ワールドに配置。SOURCE11307 Camera／実Road5のレイから地盤と進行方向、元CHASEの投影から**真の左海岸側`+S`**を特定して配置。風防の最初の区間はSOURCE座標で33mから開始。全可視頂点の元CHASE xは切土最大0.4142、風防最大0.4061（元道路内のフェイク表示ではない）。
- 真正[**Artifact #13389450314**](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41968702663/artifacts/13389450314) ZIP **126,423,375 bytes**／SHA256 `9b0e898b6b7a39ce7785cf6d84a254eb5c1596fef1c91b1575c0c2abec662775`。**本会話で元ArtifactをGitHubから独立再DLし、ZIP全CRC PASS／内部Blender・PNGのバイト数・SHA256一致PASS**。真Blender原本 `K4CJ_SOURCE_ROAD5_CONTINUOUS_COAST_CUT_EDITABLE_ART_HOLD.blend` **280,884,764 bytes** SHA256 `296326d18c446e70c25ca45598ad623affaf20c07a26e263b1789e9dc2bb04d2`。真CHASE PNG `K4CJ_TRUE_CHASE_ROAD_EDGE_SPEED_RHYTHM_NOT_GAME.png` **506,506 bytes** SHA256 `20f056de4bb037c6b587f261557cd5649a98dba1a59daa5d947f6a8376b3abcf`。比較PNG `K4CJ_VS_K4CI_TRUE_SOURCE_CHASE_ROAD_DEPTH_ART_REVIEW.png` SHA256 `72067ce17ebffb2e09f2d0a603211026e73656609a77eba62d68a2a81f48189d`。
- **同一真CHASE 768×480の独立画像検査で左の可視変更42,488px、元道路中央0px、右港全域0px**。元Road5中央5点とK4BZ既知黒筋6対の独立回帰PASS。画素変化は可視TECHの根拠でありART合格の根拠ではない。R2実WebGL2や人間操作・240Hz物理・FPSの成功を意味しない。
- 初回[Actions #41967984673](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41967984673)はTECH PASSだが実画像ART REJECT。手前に巨大な斜材が浮いたように映り、新切土の色・形が元岩と不統一だった。旧ソース変更run #41968665046はCANCELLED。R2は元岩を非破壊複製し元岩表示のみ研究切替、切土高さと色を調整、風防開始位置を路面後方へ変更。**新規ゲームソースに変更なし**。

## 直接画像ART判定

[**K4CI左／K4CJ R2右の真正CHASE比較**](research-evidence/k4cj/K4CJ_VS_K4CI_TRUE_SOURCE_CHASE_ROAD_DEPTH_ART_REVIEW.png)を実際に開いた。前回に比べて手前の巨大斜材は減り、左岩のトーンが統一され、ロード沿いに地形の遠近ができた。しかし**ほぼ同じ大きさの淡い三角形リブが周期的に現れ、斜面に浮いた柵・模型のように映る**。背景の地形も丸く単調で、自然の崖の大きな断面・雨水侵食・道路と地理的に繋がる必然性を感じない。中央の巨大なアスファルト平面、港への視線、明確なレースの速度感も根本未解決。**独立TECH PASSでもART REJECTを確定**。

今後は**同じ10組の風防三角フレームに数本の横材を足す/色を替える/可視画素差を増やすR3小改変を主経路にしない**。次のK4CK以降は原SOURCE/Road5/Cameraを完全凍結したまま、遠近に伴う視線誘導を含めた道路と崖の断面・港との空間接続・道路自体の陰影と速度感を**ゲーム美術全体の構図として再作者設計**すること。自然な地質と構造の説得力が必須で、真正CHASE画像を直接観察してART合格前に元ゲーム・本番へ採用しない。

**正式ART採用0件／Slope2 DNA正式認定0m／HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD**。main、公式P101 `p101-velocity-overdrive-native-trial`、Draft PR#46、原作Slope・物理・凍結Gold・本番2サイトは不変更。追加有料API原則0円、Work/Computer Use個別事前承認、ユーザー操作0。

---

# 【K4CJ R1実Blender TECH PASS・直接ART REJECT、R2の真正造形・検証待ち】

- 初回[真正Actions #41967984673](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41967984673) は**completed/SUCCESS**。実K4CI編集可能原本`f1ce87fff6c88841890b6fc2dd4840db4b35a86be75236d90c02613a26ac7bb4`を認証し、元Road5のSOURCEメッシュを上向きレイで調べ、元CHASE投影から本当に画面左にある側（`+S`方向）を決定したうえで、198m×100縦断地点の真正3D切土と10区間の実風防を作者制作。編集可能Blender.blend・真正同CHASE画像・独立画素QA・研究Github証拠保存完了。
- 初回真Artifact [#13388895436](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41967984673/artifacts/13388895436) は ZIP **125,908,912B**／SHA256 `7b806ab065d241caf01f424f9de7eca3caf187ffaa2aa961e6d298e6ff0f496c`。本会話でGitHubから別途実ZIPを再DL、**ZIP全CRC PASS／新.blend 279,856,868B SHA256 `a376a651c787751843c9a4391bed90f08d023cf314710c303808416133c264d8`／実PNG 509,201B SHA256 `bb63798e05e355c55977430903a33afda961a44e52280d987acd52d8885e7804` と監査JSON一致**。元道路中心と右港は各0画素変化、左は27,558画素変化。初回実メッシュ1,100頂点／1,980三角面、実風防392頂点／294面。オリジナルGame/Camera/Road5/木11・全ライト・研究親不変。
- [**K4CJ R1とK4CI元の真正CHASE比較**](research-evidence/k4cj/K4CJ_VS_K4CI_TRUE_SOURCE_CHASE_ROAD_DEPTH_ART_REVIEW.png)を本会話内で**直接開いて評価**：画面左の地形に高さと遠近が追加されたが、特に手前の斜めの鋼材風防が浮き、岩壁の角面が白く荒く、源流の丸い旧岩との連続が弱い。車が走る時の自然な迫力として不足。**TECH PASSでもART REJECT**。正式ART採用0、Slope2 DNA0m。
- 実画像の反省に基づく**R2の実コード修正**：暗い片岩の岩肌の低コントラストの面変化、切土の急峻さを緩和して元の地形と連続する断面に修正。手前で浮いて見える風防は元SOURCE前方向`d=33m`以降へ後退し、手前大梁を増殖しない。実K4CH研究可視岩壁2件を**原本とMeshを改変せず新DCC研究コピーとして再作者化**し、R2の表示だけ切替。元Camera・Road5・Game・物理、右港は一切変更しない。新研究編集可能Mesh計4件、元研究親を削除しない。
- R2真正最新[Actions #41968702663](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41968702663)は本記録作成時点で**待機・結果未確定**。途中旧HEAD Run #41968665046は版が異なるため最新評価に使用禁止。最新Runのログ／DCC／全画素安全QA／ART画像を確認するまでTECHやART成功の主張は禁止。QA閾値の緩和は禁止。
- 主方針：小物の大量追加、遠景だけの差分、技術CI達成自体を目的にしない。**ゲームの走行視線から世界水準の連続した道路脇の速度体験が得られるか**を評価。ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。

---

# K4CJ — Original Road5地理を使った連続切土と風防の真正3D作者制作

## 出発点と不変の優先順位（2026-11-05 JST）

本工程はDOPAGAKI SLOPE — HYPER RUSHの既存R19系統を継続するART-FIRST研究。新規企画や開発方針の見直しではない。K4CI最終研究HEAD `85fa1981f497688e823cbf981fc3480e9510395f`から`research/k4cj-source-locked-roadcut-speed-rhythm-20261105`を分岐した。K4CIは[真正Blender #41966161805](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41966161805) TECH PASSだがART REJECT。幅56m／高さ44mの港のガントリーで右遠景は改善するものの、中央道路が灰色で広く、道路沿いに高さ・切土・遠近の連続リズムが足りず、速度感を生み出せない。ガントリーや樹木をさらに大量追加したり岩の色だけ修正したりする主経路は停止する。

最重要保護：main・公式`p101-velocity-overdrive-native-trial`・Draft PR #46・原作Slope・凍結Gold・元ゲーム物理とRoad5・元6Camera/CHASE・本番2サイト。原Game Git Blob `af076d67492a677d2235e4730aef8cdf4808e106`、元Road5全頂点面 SHA256 `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`。すべての元ゲーム／研究親.blendメッシュ・行列・表示状態を不変にする。追加ゲームCollider0。Work/Computer Useは個別事前承認、追加有料API原則0円。ユーザーのPC操作不要。

## 今回のゲーム世界作者工程

親：**本物のK4CI編集可能原本** `K4CI_EDITABLE_SOURCE_LOCKED_MARITIME_TIDE_GATE_ART_HOLD.blend` SHA256 `f1ce87fff6c88841890b6fc2dd4840db4b35a86be75236d90c02613a26ac7bb4`。正式ゲームではなく隔離DCCを別名保存して制作。

作家コード `scripts/p101-k4cj-native-source-roadcut-speed-rhythm.py` はオリジナルSOURCE tick 11307 Cameraから実走行の世界前方向・横方向を取得し、**オリジナルRoad5メッシュ**に上方から実レイを当てた地点別地盤高さを採用。元Road5の研究表示上の幅約26.3m（半幅約13.15m）に対し、新構造の最短横距離は実ワールドで**16.65m**。路面上のBillboardや画像上の偽3Dではなく、道路に沿う真のワールド空間 `d=-12..186m` に、下記を制作する。

- **1つの大きく連続する海岸切土の真正編集可能3Dメッシュ**。100ステーション×11横断面、各ステーションは地盤をオリジナルRoad5のSOURCEから補間、切土の路肩リップから海岸岩壁の頂まで山型ではない非対称断面を繋ぐ。現実的な大きさの岩面・非繰り返し変形・三角面の面法線、塩害風化した多種類の暗い片岩表面。岩の色替えのみでも、多数の小物の羅列でもない。
- **1つの連結した荷重支持用風防・岩盤支持リブの編集可能3D構造**。約19m間隔で実地質に根を持つ支持リブと進行方向に沿う連続した高さのある風防キャップを制作。路面から十分離して置き、画面の遠近縮小による路側リズムを生み出す。港そのものは保護し、画面右の港湾アートを既存のまま残す。
- 断面の全点・風防の全頂点を真CHASEで投影し、左側`x<.49`の制約から外れたら**安全STOP**する。固定道路中心5画素・K4BZ黒筋6対・右港全体の画像差と、道路/Cameraメッシュ・既存木11・全灯光・親研究全オブジェクトの行列と可視性を厳密照合する。元Source Road5に触れることは禁止。

本物のBlender EEVEEから同一SOURCE CHASE 768×480 PNGをレンダリングし、編集可能.blend・監査JSON・真画像をGitHub研究ブランチおよびActions Artifactに保存する。画素差は**TECHで表示されたことの証拠**であり、ARTの点数ではない。真画像を直接見たうえで高品質ゲーム美術と認められなければ正式ART=0、Slope2 DNA=0mを維持。

## 最新CIと下一工程

[**K4CJ真正Actions #41967984673**](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41967984673)を実行。作成時点では実走中であり、**成功、生成した新.blend、ART合否は未確定**。まず最新runのJobログ、原Game/PARENT SHA、Blenderによる真造形、独立画像QA、Artifactの有無を照合する。もしエラーなら実ログから原因を調べ、元道路保護条件とART可視最低基準を緩めず改善。完走ならZIP全CRC・個別SHAをGitHubから独立取得して照合し、**真CHASE画像を直接目視で評価**。ART REJECTなら正式採用しない。

**HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。ART採用0件／Slope2 DNA 0mを不変にする。**
