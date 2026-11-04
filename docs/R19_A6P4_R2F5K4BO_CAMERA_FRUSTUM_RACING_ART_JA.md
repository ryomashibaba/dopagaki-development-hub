# K4BO — 元Cameraフラスタム実測に基づく路面前景のデザインと真正DCC 2視点検査

更新：2026年11月4日 JST。新研究隔離枝 `research/k4bo-camera-frustum-track-art-20261104`。最上位目標：DOPAGAKI SLOPE — HYPER RUSHを世界水準の高速3Dレーシングゲームとして**コース全体の美術を完成する**。そのため今回は一画面を真Cameraの映る領域から逆算する。技術と美術の区別厳守。

## K4BNから継承した実事実

[K4BN最終CI #41771580365](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41771580365)はSOURCE/ネイティブDCC技術PASS。[真Artifact #13295356720](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41771580365/artifacts/13295356720)の編集可能`K4BN_UV_PBR_AUTHOR_SCULPTED_EDITABLE_DCC_ART_HOLD.blend` 41,352,944B、SHA256 `fb98af8bccb84c9a6eaf18cabc8444135c5df99df267a5a7562c99c1fbe96a37` を親正本とする。本物のSource Camera control11307/ultra11341 PNGと同Camera K4BM比較も実確認。**K4BN美術ART REJECT**：船は道路の陰、元Road5は巨幅で前景がほぼ無地、レース文字は改善しても中央遠方で小さく、右左の空間もまだ模型。正式ART採用0件、Slope2 DNA0m。

元Game `web/p101-w9c2-g4e7ci-integrated-streetscape.mjs`のgit blob `af076d67492a677d2235e4730aef8cdf4808e106`、実Road5 source頂点／面fingerprint `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、元Source Camera全6・実B48道路7・B51移動体28・240Hz・球半径0.65m・安全UI・ゲーム物理・操作系、公式`p101-velocity-overdrive-native-trial`・main・Draft PR #46と本番2URLには触れない。Work/Computer Useには事前承認、ユーザーWindows作業不要。

## K4BOで実装した本質的な差分

- `scripts/p101-k4bo-author-velocity-atlas.py`：真Cameraの道路相対メートル`(d,s)`において、前回の細い線と遠景の小さい文字を主役にせず、**近景d≈3〜90mの路面へ複数段の速度感ある扇形のオリジナル塗装、セクター帯、ロード両端のレース方向ストローク、点線・摩耗・レース用数字**を作者制作。透過2048×4096PNG。カメラ左右の文字鏡像問題は文字の画素だけ反転する。画像そのものはGitHub管理された再現可能なPython生成物で、既存ゲーム著作物の模倣や第三者画像の貼付ではない。
- `scripts/p101-k4bo-source-camera-racing-art.py`：親K4BNの本物の編集可能.blendをSHA固定読込。元Road5にだけ、元Camera地上座標`U=(s+75)/180`・`V=(d+60)/265`で透明塗装RGBAを合成。前K4BNの編集可能モデルや手続きの路面材質は保持。真Source Road5のメッシュ・元Camera数値を実数値で前後検証し、ゲームのcollisionと新材質は全く変更しない。
- **実Frame可視性数値**：本物Road5メッシュのd=-20,0,5,10,15,20,30,40,55,70,90,110,130,150,170mのうち13以上の断面で、道路内の左右端と中央点が実Blender camera frameどこに見えるかを`world_to_camera_view`で算出、`cameraProjectionTrueOriginalPose`の`screenX/BottomUpY/depth/withinFrame`で保存。アート制作がスクショ範囲外へ行き過ぎないための初の実測可視性検査。
- **実Road5に沿う3D**：道幅は上記の元Road5そのものへの鉛直Raycastで測り、左右に計14本の航空的な細い金属／シアン・琥珀の光フィン（d10,32,56,82,110,140,164m）を配置。さらに元Road5の側面に沿った低い線状案内照明を制作する。公式Collider0・走行時のB51クリアランス未証明・これはDCCの美術研究のみ。
- 編集可能なBlenderネイティブ原本・真control11307/ultra11341 2PNG・前K4BN同Cameraの中立AB比較・生RGBA PNG・真実のRaycast座標・元ゲームSHA・原Road5 fingerprint・全部の個別SHAを必須。Blender EEVEE/Xvfb/Mesaを実起動、実WebGL2ゲームのスクリーンショットだと誤称しない。
- 旧作品全ての保護とmain・公式・本番非変更を最優先。新研究の画像の美術が低質ならART REJECT、正式ART0件／Slope2DNA0m、SAT/CCD/FPS/HUMAN/RELEASE/MERGE全HOLD維持。

## 初回技術実行と美術の評価ゲート

[専用CI K4BO](https://github.com/ryomashibaba/dopagaki-development-hub/actions/workflows/p101-k4bo-native-frustum-racing-art.yml)、初回[実行 #41779198031](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41779198031)。**初回執筆時点で技術の最終結果や美術完成を未確認**。Source Camera 2元画像を取得して独立PNG/Blender shaを照合する前に成功と報告しない。比較画像の道路下半分のMean RGB差分が1.5未満ならCIはFAILとして、デザインが実画面にほぼ反映されていない可能性を検出する。差分が出ただけではART合格ではない。

最終ART審査では旧来の「実際の路面大半がただの灰色」「背景はきれいな港として読めない」「左右が単調な壁」「超高速感と造形の高級感がない」を厳格に再検討する。1つでも重大な問題が残ればART REJECTし、次工程の美術設計方法を見直す。完成前の他6Road量産、本番映像・安全・FPS PASSの虚偽報告、main/公式へのmergeは禁止。


## 【K4BO最終実行・実画像美術判定】2026-11-04

### 技術検証・独立成果物の確定
- 真正[Actions #41779198031](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41779198031) は **completed/SUCCESS**。元K4BN.BlendのSHA・全個別バイト整合、元ゲームSource Blob、Nodeテスト、真正B48 Road5頂点／面fingerprint、元6 Cameraの数値変化なし、Blender EEVEE真native scene、元Camera control11307 + ultra11341両PNG、独立画像下半分Pixel差分、真source Camera画角へのRoad5投影測定とGitHub研究ブランチ保存までPASS。
- [Artifact #13298312331](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41779198031/artifacts/13298312331)、本ZIPのSHA256 `e834e6c0254a5da12994d74ed9fbd6383ce23ce56e9d7857600878ef7fc8b472`、ZIP CRC全PASS、Blender原本`K4BO_EDITABLE_GROUND_TRUTHED_VELOCITY_DCC_HOLD.blend` 41,838,860B／SHA256 `b546174d5ae5186015981f2d6b5ee40f823cb7a4f2f9ba33f07c2bbda84264e6`。control PNG 1,700,050B/SHA `02079b390eb9135c68cabe872af13bae12c3a2a5a524d4765dbab6401a0837be`、ultra PNG 1,673,174B/SHA `0106a50a93db52ec64f9c2e815ec165c7636507b7d1c0fabd68ef48296d3d8eb`、本オリジナル塗装Atlas SHA `4d2903e545dfc90f1290d5a6fcd5bebc0b46de78b1d47cdec47ed1f2189ad762`。ZIP元バイトと各Blender/PNG元SHAをコンテナで独立検証し全一致。
- GitHub研究枝内の[真の画角投影結果JSON](research-evidence/k4bo/K4BO_SOURCE_FRAME_AND_RACING_ART_PROVENANCE.json)参照。Source Road5真正Source Camera control11307の**道路中心線が画面のどの高さに見えるか**（screenYBottomUp、0=最下段／1=最上段）：d10m→0.120、d15m→0.298、d20m→0.393、d30m→0.493、d40m→0.543、d55m→0.585、d70m→0.607、d110m→0.633、d170m→0.639。d0mは画面下の外、d-20mはカメラ背後。実Road5の遠距離方向d70〜170mがほとんど同じ画面高度に集中し、カメラ構図の圧縮を実測で確認。
- 旧K4BNからの**画面下部RGB差分**：control平均7.3327／ultra3.4632（RGB画素値単位）。両方とも低限の差分下限1.5を超え、元Cameraに新マテリアル・ペイントが可視になった事実は検証PASS。差分の大きさを品質評価や人間プレイ品質と混同しない。

### 真正2視点の美術判定：**ART REJECT**
- 路面近景まで実オリジナルの琥珀／マリンブルー速度ウェーク・文字・扇形と細いロード端のイルミネーションを投影し、画角外にモデルを作るという前工程の手戻りは一部解消した。
- しかし両元Camera実画像では、色の広い塗りや細いフィンが依然「平面上に貼り付いたレース模様と単純な側面小物」に見え、道路の巨大な面積と大きな灰色空白はなお変わらない。近景のリアリズムが足りず、道路両脇は単調な長い壁で公共施設／海岸・港の利用実態に見えず、遠景の船もほぼ見えない。透視の圧縮が著しく、港湾の深さが感じられない。**世界水準の超高速3Dレーシングゲームの美術として認定不可、K4BO ART REJECT**。正式採用0件／Slope2 DNA 0m。
- 元ゲームSourceには変更無し、ゲームCollider0、元Road5/元Camera完全不変。これはBlender DCC元Camera画像であり実WebGL2画面ではない。B51全時間安全／SAT/CCD/HUMAN/FPS/RELEASE/MERGE全HOLD。

### K4BPに向けたプロジェクト方針

**これ以上「元Camera固定の広すぎるRoad5を、塗装／窓／フィン／箱で飾れば世界水準になる」と推定して大量生産しない。** この試験でわかった確かな事実は、見える画面を支配するのがRoad5約100m級の幅と元Cameraの遠近圧縮にあること。次は元ゲームを**保護し続けた隔離DCC**で次の二案を**別物として同じ原本から独立比較**する：
1. 元Camera／Road5完全固定の既存安全基準画像と、研究用**別カメラでの高品質コース構図試験**（元Cameraデータブロックを変更・移動せず複製）を明確に分離。例：画角・位置・視点高さ・側面パースの違いが「巨大路面・薄い遠景」をどれだけ改善できるか同一景観で比較。この画像を元Source Camera合格やゲーム実映像に偽装しない。
2. 元Road5の道路実幅・断面そのものが美術を阻む場合、**純研究用別メッシュの1フレームのコース再構成**を美術案として試すが、公式B48/source Road5を変更しない。1コースの研究候補だけに限定し、正式原本への採用や衝突・挙動への適用は美術・安全ゲートが揃うまで禁止。

この方法は過去の「mainや元原本を固定し、安全な3D研究で見る」という方針と両立しつつ、毎回不合格の同じ造形方法に戻ることを防ぐ。ユーザーの承認がない限りゲーム本体のカメラ/元道路/PR/本番は変更しない。正式ART採用0件、Slope2 DNA0m維持。
