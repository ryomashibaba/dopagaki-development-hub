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
