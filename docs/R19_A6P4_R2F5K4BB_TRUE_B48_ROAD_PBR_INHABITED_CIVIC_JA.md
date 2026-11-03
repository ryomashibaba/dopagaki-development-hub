# K4BB — Road5真正B48実UV-PBR路面・公共建築内部のBlender編集可能再制作

2026-11-03 JST。K4BAから継承したART-FIRST・DCC-FIRST研究。**真正ゲームへの採用禁止／正式ART=0、Slope2 DNA=0m**。

## 現在の確定継承

元研究 `research/k4ba-road5-tidal-city-cinematic-art-rebuild-20261103` HEAD `bb7ea19ec05bc05ddad54a51faeb69f302656f0e` を基点にK4BBを隔離。K4BA v2 [CI #41625837609](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41625837609) 本Blender原本／GLB／6真正source数値camera DCC A/B／航空art DCC **SUCCESS**、[独立BVH #41626249550](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41626249550) **静的ソースRoad5・B51への交差0件**。それでも道路単調、左右が柱と屋根の模型、内部が機能に見えない、遠景も都市感が弱く、**ART REJECT**。画像のピクセル差やオブジェクト数を美術評価に使わない。

## 設計と実制作

### 道路（K4BB 2K PBR UV atlas）

- 元 source B48 の物理Road5 ID `p93-PRISM_CREST-01`、4,728 三角形、真の91×13上面格子をUVへ対応させる。元の制御点SHA `5eb731e25bc9eb1a3cf1080e7b239f5e2e8043bfbc80e5d37e0b069a5a08a730`。制御点/頂点/三角形のDCC Blender幾何 SHA before/after一致を必須。
- 2,048×1,024 deterministic image texture（seed 20261103）、Albedo／Roughness／Heightの**3独立画像**。石材・砂・骨材・目地のノイズを世界の施工寸法と実Road5縦横UVに一致させる。Bump nodeとRoughness nodeを実配線し、単なる色付きplane/boxの羅列とは違うBlender-native PBR材質候補を作る。
- Road5本物の物理メッシュの**色材質とUV preview**だけを新規追加する。元ソースゲームのP100/B5などの進路・危険表示を変更・置換したとは絶対言わない。本物のWebGL2原作の安全性と操作性は未認定。Road5以外に展開しない。

### Public interiors（ロード両岸、実source Road5から外側へ）

- K4BA v2 .blendの全編集可能コレクションを保持し、K4BB用の別collectionに実空間の側壁・後壁・屋根・床を持つ4種の大規模公共用途をBlender-nativeメッシュとして設計する。
- 公共用途別：**海港食堂**（実カウンター・暖色吊灯）、**閲覧交換所**（複数の棚とテーブル）、**公共交通ラウンジ**（ガラス表示面・サービス設備）、**海岸植物展示室**（実立体プランター・床灯）。Entranceの実開口を抜き、すべて同型のBOXの反復にしない。高速度の元Cameraで内部が認識できる構図・長い温かい光帯を重視。
- 2つの特徴的な大型アトリウム内装天井と、建築の荷重が読める入口柱を追加。素材は石材・ブロンズ・木・深い緑のガラス。室内専用カメラは**元sourceカメラと別**、混同しない。

### 実検査で必要な厳格ゲート

- 6元Camera control11259/11278/11307、ultra11320/11341/11369、B51 28個×6tick original collision OBBを時刻ごと描画（OBBは元ゲームのアートではない）。K4BA v2同Cameraとの6枚1:1比較＋アーティスト航空＋人間目線のインテリア画像。**これらのBlender画像は真正Chromium/WebGL2ゲーム画面ではない。**
- 編集可能原本 `.blend`、GLB、UV+PBR atlas3枚、合計8+3画像、元Road5 fingerprint/source/provenance JSON+全ファイルSHA。
- [Blender制作ソース](../scripts/p101-k4bb-source-road5-pbr-civic-interiors.py)、[専用CI](../.github/workflows/p101-k4bb-source-pbr-civic-rooms.yml)、[新K4BB公共室の独立元B48/B51 BVH検査](../research/k4bb/independent_new_interiors_native_b48_b51_bvh.py)。
- CI成功でもsource/DCC TECH限定、ART=REJECT/HOLD。真正ゲーム240Hz走行は実装も実測もまだ行わない。新PBRの実照明との相互作用・高速でのreadabilityを人間が見て審査し、画面の質が悪い場合は即座に不採用。

## 不変の保護契約

| 項目 | 固定 |
|---|---|
| 凍結元game blob | `af076d67492a677d2235e4730aef8cdf4808e106` |
| 物理・カメラ | 240Hz、球半径0.65m、原本7 B48／28 B51、6元Camera数値、源sourceタイムスタンプ |
| 変更不可 | main、production URL、公式継続branch `p101-velocity-overdrive-native-trial`、Draft PR #46、original WebGL2ソース、元物理 |
| ゲート | 正式採用ART 0件、Slope2 DNA 0m、ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE 全HOLD |
| 使用環境 | Chat＋GitHub、ユーザーPC操作最小、Workは事前許可が必要 |

**この文書を作成した時点でK4BBのActionsの最終成功・画像品質・独立BVH PASSは未確定。** 後続の検証結果を正本へ追記する前に本物のログとPNGを取得すること。


## 11月3日・K4BB初期実行の発見と対応（不採用履歴の保護）

1. [最初のCI #41629247606](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41629247606)：4公共用途の展開時に関数名とループ変数 `programme` が衝突、`TypeError: 'tuple' object is not callable`。実コードの展開変数を独立名称へ変更。元sourceは不変。
2. [初回の全画像生成CI #41629445676](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41629445676)：真正6Camera＋室内＋航空のDCC画像、Blender原本、GLB、2K PBR3画像を生成。ただし最後のPBR画像品質検査でFAIL。Artifact #13228505958（失敗途中物もHOLD管理）。実ファイルを独立PILで開いて測定したところ **ALBEDO stddev合計31.657、ROUGHNESS stddev0かつRGB全画素0、HEIGHT stddev0かつRGB全画素0**。BlenderがNon-Color設定済画像の保存時にグレースケール2画像を全黒化。これは**画素差が増えても本物PBRとして不合格**。実Control11307は路面が不自然に鏡面反射しており、ヒト視点の内観は暗い青緑で室内読取不能。ART REJECT。
3. [次のCI #41631369640](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41631369640)：Blender環境にOpenImageDenoiserがなく `RuntimeError: Build without OpenImageDenoiser`。ウブントゥの実Blender DCCにノイズ除去を要求しないよう変更。
4. K4BB修正版 `scripts/p101-k4bb-source-road5-pbr-civic-interiors.py` は、RGB/Roughness/Height 2048×1024 を**NumPyで確定しzlib/structで標準PNGを直接書き込み、実ファイルをBlenderで読込・pack**する方式へ改修。Non-ColorはPNG保存後のshader読込にのみ適用。0/0の自動検出基準を緩めない。室内カメラを実閲覧室奥へ移動し、室内可視用の実光源追加。Ubuntu Blenderビルドで使えないdenoiserはOFF、Cycles 64 samplesへ。
5. 現状の本命修正実行は [#41631593534](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41631593534)。これの**完了SUCCESSを確認するまではK4BBのSOURCE/DCCをPASSと言わない**。独立BVHは [#41631656710](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41631656710)、GitHubに画像を直接保存するCIは [#41631663301](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41631663301)。ともに本命修正版の成功を待つ設計。
6. これまでの失敗を成功・採用として読み替えない。**K4BB未認定／全体ART REJECT HOLD**。次は現行CIの結果、PBR画像のRGB分布・Python画像真正検査、元6カメラと実内観の目視、別BVHを確認して更新。


## K4BB 最終的に確認した制作・数値・ART判定（2026-11-03 JST）

**最終技術は成功。美術はART REJECT**。途中の失敗ビルドを合格扱いにしない。

- **正式な制作実行**：[K4BB Blender Actions #41631593534](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41631593534) **completed SUCCESS**（制作器commit `861a3d48ccd0366f5a118eb873abf44d70a40cb0`）。成果 [Artifact #13229226496](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41631593534/artifacts/13229226496)、ZIP 40,285,863 bytes、SHA-256 `137c8e1e88a46ff2cff16b419ce00d51955f607365eb7c9b205a911642debd0c`。内容：編集可能Blender原本、GLB、K4BB 2K PBR ALBEDO/ROUGHNESS/HEIGHT PNG、6 source numeric Camera DCC＋2独立artist DCC、6元CameraごとのK4BA v2とのA/B比較PNG、全source mesh SHA情報。
- **実ファイルから再抽出してPIL独立検査**：ZIP 15ファイル CRCエラー0。2K RGBA色層のRGB標準偏差合計：ALBEDO **31.657**、ROUGHNESS **49.132**、HEIGHT **20.650**。以前のROUGHNESS 0 / HEIGHT 0の全黒欠陥は解消。粗さ平均175.71/255、法線高さ画像平均125.59/255（PNGの保存値、物理単位ではない）。3素材のピクセル濃淡が非ゼロかつ独立して実証された。全原本内のSHA manifest照合0不一致。
- 元source Road5 B48 4,728三角形の**頂点・ポリゴン fingerprint before/after一致**、本物B48 7道路、B51 28×6時刻=168 collision OBB、元Camera数値変更無し。追加の実3D公共用途編集対象 **167オブジェクト**。UV＋2K PBRはBlender-only、source gameplay paint/物理未変更。
- **独立新規B48/B51空間監査**：[Actions #41631656710](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41631656710) **completed SUCCESS**。Artifact #13228844158（ZIP SHA `b7f6a75d3aa921333ed3d6eb3096fc7744a0690aa0b2cbafdeb26e8363b0650f`）。**K4BBで新しく作った公共室167評価済メッシュ/カーブ・5,630評価面**と元Road5 B48 4,728面＋元6tick×28 B51 native source collision OBB=168体の独立三角形BVH交差**0件/0件**。これは**新K4BB建築だけ**の有限静的限定検査。K4BA既存建築は本監査で再検証しておらず、元ゲーム他6道路、CCD/HUMAN/SAT/FPS/全時刻の安全合格は未認定。
- **GitHubのZIP不要・永続的実画像**：[Actions #41631663301](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41631663301) **completed SUCCESS**。研究ブランチ下の [6×same-pose DCC A/B](research-evidence/k4bb/K4BB_SIX_SOURCE_NUMERIC_CAMERA_PBR_INTERIORS_ART_HOLD.png)、[真DCC人間視点インテリア](research-evidence/k4bb/K4BB_INTERIOR_DESIGN_EYE_NOT_GAME.png)、[DCC航空](research-evidence/k4bb/K4BB_HARBOR_AERIAL_DCC_NOT_GAME.png)、[道路ALBEDO実PNG](research-evidence/k4bb/K4BB_ROAD_PBR_2K_ALBEDO_STUDY_ONLY.png)、[SHA manifest](research-evidence/k4bb/K4BB_EDITABLE_SOURCE_SHA_ART_HOLD.json)。

### 本物の7+1視点とA/Bを開いた上での厳格ART審査

**ART REJECT / 未採用維持**。K4BA v2（左）とK4BB（右）を元Camera 6時点で並べると、Road5の素材反射の不具合は直り、以前の鏡面のような路面が均質な石造り床に変わった。この点は実測で前進。しかし、道路は依然として広大な均一な帯状領域を大きく占有、石材テクスチャのmicro-detailが低解像に見え、全体は完成された世界的レーシングゲームのレベルデザインとは言えない。新しい4公共用途の室内は、6枚の真正高速Cameraでは**認識できない**。ゲームカメラで読めなければ公共用途をいくら内蔵してもARTの「公的施設が見える」という目的を達成できない。

追加した「人間目線の閲覧室」DCC画像は、改善前の全暗闇よりは構造が出たが、壁や丸棒が高密度な造形として見えるだけで**用途を伝える読書室の家具、入口、通路、陰影の美術構成が成立していない**。空撮でも単純な塔・孤立した観測リング・大きな屋根に見え、都市全景のデザイン完成度が足りない。これを単なる配色・素材修正・box増築で済ませることは禁止。

### 次の正当な美術工程（K4BC候補）

**「ロード5の真正高速6Cameraで機能と風景が読める画面設計」から再着手**。小部屋167個をさらに増やす・材質の色をいじるのは優先しない。前景路面を走行速度/カメラFoVに合わせた大規模な構造的意匠、側方に大きな開口と階段・公共広場の奥行きを持つ一体施設、明確な導線と人のスケール、現在の正面の巨大観望施設と海港風景を強い建築的物語にまとめ、元Camera 6視点と人間目線で初めて**用途が読み取れる**かを本物のBlender原本から目視判定する。source原道路・危険物は編集禁止、私的WebGL2への移植もARTが本当に合格するまで停止。元物理/本番/PRは変更しない。

**恒久評価**：正式ART採用0件・Slope2 DNA認定0m・ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE HOLD。今回のDCC/GitHub/SHA/BVH成功をARTや元ゲーム安全のPASSへ昇格させない。
