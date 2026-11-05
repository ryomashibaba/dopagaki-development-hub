# 【K4CH最終確定：本物のBlender DCCと独立SHA/CRC TECH PASS／直接ART REJECT】

**2026-11-05 JST／最新の確定記録。正式ART採用0件、Slope2 DNA正式認定0m。** 以下の古い「進行中」は歴史上の状態であり本記録の最終結果に優先しない。

## 実装から真正アート完成画像までの根拠

- K4CG R2実編集可能親 `K4CG_INTEGRATED_COASTAL_WORLD_GEOMETRY_EDITABLE_ART_HOLD.blend` SHA256 `5a2215677fd41c420bac3b44b78b65b0e42aa74b79399498a87a57b7b85946f1`をSHAで固定して研究専用アート生成。原Game git blob `af076d67492a677d2235e4730aef8cdf4808e106`、Road5全頂点・面SHA `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、原6 Camera／CHASE、木11本、灯光、K4BZ hide_render不正道路の保護PASS。元ゲームCollider0増、元のゲーム物理・WebGL2は未編集。
- 初回[Actions #41950843684](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41950843684)はFAILURE：Azure Ubuntu apt mirrorでBlender依存ファイル取得が約6分半かかりtimeout 124。次[#41951907166](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41951907166)はUbuntu公式archiveに切替成功したが、Blender64byteオブジェクト名短縮を考慮せず、長名の元研究メッシュ検索がFAIL。[#41952195139](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41952195139)は3D船港アート作者工程で研究可視メッシュの名前補正後、本物の`bpy_prop_collection`のスライスで失敗。コード型を修正し[#41952601548](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41952601548)は本物のBlender.blendと真PNGを生成したが、実画面右屋根の差分は2134画素、基準3500に満たず独立画像QA FAIL。つまり**それ以前の完走できない試行やQA失敗をTECH PASSとして扱わない**。
- [#41953338664](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41953338664)もFAILURE。新しい実Blenderカメラレイ検査で本当にCHASEに映る青灰色大屋根が`K4CB A2 | 52m sculpted marine terminal roof actual volumetric s`（検査8点中5点に投影）と実測できたが、研究名の許可条件が`K4CB A3`等に限定されていたため安全停止。**元Gameを選び直してはいない**。許可対象を唯一の可視研究屋根`K4CB A2`に厳密化して実装を修正。
- **最終[真正Actions #41957682964](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41957682964) completed/SUCCESS／全12ステップ成功**。元ゲームと親DCCのハッシュ検証→本物のBlender4.0.2→左沿岸の実4900頂点の節理付き岩地形変形・1539ポリゴンの実角面、右実カメラ可視銅色屋根858頂点の再作家造形、元の12支柱から生成した統一木質構造、港海面／沖合世界地形（研究Mesh計7件）→可編集.blend保存→原CHASE768×480実PNG→独立画像QA→研究GitHub証拠を保存、成功を確認。
- **真Artifact [#13383802521](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41957682964/artifacts/13383802521)**、GitHub元ZIP **125,763,699 bytes**／SHA256 `7a120c628df92f35096186bb5bf056c66f23f22406dd7ccf1a001b01dc89de52`。本会話で実際に別途ダウンロードして**ZIP全CRC PASS、.blendとPNG全個別bytes/SHA一致**。真編集可能原本 `K4CH_BASALT_AND_COPPER_HARBOR_FULL_FRAME_EDITABLE_ART_HOLD.blend` **279,347,364B／SHA256 `74dadf53327e7fff0fd3b57a9b9ff369371e2c0fffa43241eb27bee1ca19cace`**。真CHASE画像 `K4CH_TRUE_CHASE_BASALT_COPPER_HARBOR_NOT_GAME.png` SHA256 `23351704fd5d13e1d537fa0a311dce4fa120dda0ffd3fe3515320075fd165b69`。比較画像 `K4CH_VS_K4CG_R2_TRUE_CHASE_FULL_HARBOR_ART_REVIEW_NOT_GAME.png` SHA256 `e999628138edcf87615c59e8b25aa90cb3fedd20dd713ee3214c8109619efbd6`。
- 真CHASE画像を実際に開いて画面全体を観察。元K4CGと比べて**左岩壁40181画素・右大屋根6863画素**の実視認変化、研究港下部85画素、原Game道路中心0画素。K4BZ黒筋6組、元Road5独立5点、元カメラ全姿勢・木11・灯光・既存メッシュ形状/行列は不変。数値はTECHの可視証拠でART点数ではない。

## 画像の独立ART判断と大切な反省

[**真正K4CG R2（左）とK4CH（右）の同CHASE画像を直接開いて目視比較**](research-evidence/k4ch/K4CH_VS_K4CG_R2_TRUE_CHASE_FULL_HARBOR_ART_REVIEW_NOT_GAME.png)。

- 以前の青銀色の大屋根を経年銅系の明るい屋根へ**実画面で変更できた**。これは見えない研究屋根を作者化した失敗を解消した事実。左岩肌も灰青系へ寄り、形状が前より読み取れるようになった。しかし**左側はいまだ丸く均質な、灰色の砂丘・粘土に近い表面**で、本物の断崖に必要な目立つ割れ目・層の垂直断面・荒れた起伏・道路脇との構造関係が弱い。銅屋根は可視化したがターミナル全体の用途を絵として強く伝えず、船の存在も弱い。
- 最大問題は**灰色の広いRoad5が画像の中心・前景を過剰に占め、疾走している体験が見えないこと**。その原ROADを動かして見栄えの良い別ゲームへ変えてはならない。Road5の形状・Physics・Cameraを固定したまま、**走行視線に沿う実ランドマーク・路肩断面・連続する風景の奥行きやリズム・主役の港施設と海との地理的関係**を自然な3D空間で緊密に設計する必要がある。ポリゴン・画素差・CI数の増大だけでは世界水準ARTに届かない。**ART REJECTを正式確定**する。
- 次に同じ岩色・屋根色を少し変える微修正を大量ループしない。K4CI以降は**元CHASEの構図を基点として、レースで流れていく道路側空間と右港の一貫した大規模空間演出を最優先**し、真編集可能DCC＋本人評価可能な実CHASE画像にてQUALITYを判断する。現時点でHUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。真Blender映像をWebGL2正式ゲームや人間プレイ証拠と偽ってはならない。

---

# 【K4CH実装済み・真正Blender環境修復後の試験中／成功を先取りしない】

- 新隔離枝 `research/k4ch-basalt-copper-harbor-art-20261105`。左海岸実3D地形・右銅屋根実メッシュ・既存柱から組み上げた単一支柱構造・港海面・沖合岬の、**一つの統合作家モデル**を実装・GitHub研究枝に保存。元Game/物理/Road5/6Camera/CHASE/原樹・ライトを不変更に保護。
- 初回[Actions #41950843684](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41950843684)は**completed/FAILURE**。原Gameテスト・K4CG R2親真正Blender SHAと全Artifact照合まで成功。Blenderのインストール中に公式Azure apt配信元から35.9MBの`blender-data`取得が約6分28秒かかり、続く他パッケージの取得前に`timeout 420s`の**exit 124**で停止。**Blender起動・新DCC・新画像のTECH/ARTは未確認**。アートや元道路保護の失敗と混同禁止。
- この実ログに限定して、Ubuntu24 GitHub runnerの取得経路を`azure.archive.ubuntu.com`から**公式`archive.ubuntu.com`へ差し替え**、インストールの安全上限を延長した。元ソース・真研究Blender親SHA／元Game／Camera／Road5回帰／比較画像の閾値は一切緩めていない。修正run [#41951907166](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41951907166) を起動。本記録時点で**最終判定は未取得**。Actions run/ジョブログ/Artifactを次に確認する。失敗の場合でもART/TECH PASSと記録しない。
- **正式ART採用0件、Slope2 DNA認定0m、ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD**。Work/Computer Use個別事前承認、追加有料API原則0円、ユーザー操作0、main・正式P101・Draft PR#46・本番2サイト保護。

---

# K4CH — 真正DCCによる可視主要景観の大幅な作者再設計

日付：2026-11-05 JST。正式採用は **ART 0件、Slope2 DNA 0m**。K4CG R2の単なるパラメータ変更や模型増殖ではなく、主要画面を占める景観の実3D作者制作。

## 最上位方針・親固定

研究ブランチ `research/k4ch-basalt-copper-harbor-art-20261105` を K4CG R2 HEAD `eef27f8741b9315649592afb1614c2030ae4da61`から作成。K4CG R2 は[真正Actions #41942878730](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41942878730) SUCCESS／**ART REJECT**。実画像は左の柔らかい白い砂丘状地形、右の模型的な淡い青灰色の曲面屋根、幅広い灰色道路が支配的。沖合の小さな岬や波面の微調整ではレース空間として世界スケールが感じられない。

親の実編集可能Blender `K4CG_INTEGRATED_COASTAL_WORLD_GEOMETRY_EDITABLE_ART_HOLD.blend` 277,556,784B／SHA256 `5a2215677fd41c420bac3b44b78b65b0e42aa74b79399498a87a57b7b85946f1`。真R2原ZIP SHA256 `33dd91b49067b2832fded8c9e7f438f836ce36edf516ae8c68e1ff711e4d5cc9` CRC全検証済。以降の編集は**新しいBlender研究コピーのみ**。親原本と元ゲームは一切上書きしない。

## K4CH作者設計（大規模主要可視空間）

制作方向：「潮風を受ける暗灰色の割れ目を持つ沿岸岩壁 × 経年銅と耐海水木材で構成された働く渡船ターミナル」。左・右の画面に共通する重さ、質感、人工物と地質の関係を、固定CHASE内で実構造として成立させる。**小物や遠景の増殖ではない。**

`scripts/p101-k4ch-native-coherent-harbor-basalt-copper-art.py` を研究枝に実装：

- 左の前景：既存の可視 `K4CG | physically fractured coastal grey limestone headland` と `K4CG | true muted mineral ground underlying the entire visible coastal slope` を**Blender Mesh単位で複製**。経年侵食と実3D地質断層に沿ったワールド座標頂点変形、実ポリゴンの角面表現、不規則な3D Voronoi節理／ベースの複数鉱物色・法線バンプで統一。既存の明るい研究コピーは削除・編集せず、K4CH研究Render内の表示だけ切り替える。オリジナルRoad5と元ゲームコライダーは変更禁止。
- 右の海辺：最も大きく見える実研究屋根 `K4BW | folded coastal museum and boat service canopy shell` を元の位置の**物理的なBlender複製**として新しい銅屋根へ再造形。元屋根の全頂点を水平・標高を保ったまま0.72倍の高さの実曲面に修正（原屋根データは不変）。既存位置の12/14本の本物の支柱形状を**結合して1つの構造材Mesh**として木質素材を統一。元の可視P101研究元屋根や支柱はBlender原本保存／研究表示切替だけ。
- 水面・遠景：元K4CG研究港内の水と外洋の実編集可能メッシュを保持し、統一した自然な寒色にコピーで質感再設計。角張って孤立して見えた研究沖合岬を、**世界空間で低く横に広い実地形**へ作家変更。Road5の視界を覆う候補は拒否。元の遠景実データは削除しない。
- 新規研究オブジェクトは7編集可能Blender Mesh。元オブジェクト（Game・道路・カメラ・海・木・灯光・建築等）の頂点データ・World transformは変更せず、研究用コピー元の`hide_render`切替だけを明示的に独立記録する。**正式P101や原ゲームの建築実装ではない**。

実Workflow `.github/workflows/p101-k4ch-native-basalt-copper-harbor-art.yml` では、固定K4CG R2 Actions ArtifactをGitHubから取得して全SHA・原 Game blob・Road5全頂点面・6Camera・CHASE・木11本・元光源・既存K4BZ黒筋を独立検証した後、実Blender4.0.2 EEVEEによる編集可能.blend保存と同じ真CHASE768×480 PNGをレンダリング。旧K4CG vs K4CH新研究真正画像で**左実景観・右のターミナル屋根・元道路の画素差**を別々に検査する。元Road5自体の変更・元Camera変更を一切許さない。画素差はTECHの可視判定であり**ARTの点数ではない**。

## 最新ジョブの判定条件

[**K4CH Actions #41950843684**](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41950843684) を実行。この文書作成段階で**ソース照合・元K4CG親.blend SHA・真正Artifactの前検査PASS、Blenderインストール中で最終結果は未確定**。必ずrunの結論／ジョブログ／生成PNGとArtifactを最新の状態へ再照合。結果がFAILなら、その具体的3D原因を直すこと。技術PASSでも真画像を**直接開きART REJECT/ART PASSを独立判定**。ブランチ・Artifactから描いたイメージをCGでなく実ゲームと偽らない。

## 禁止事項／今後のゲート

元Game blob `af076d67492a677d2235e4730aef8cdf4808e106`、元 Road5 全vertex-face SHA256 `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、main、公式`p101-velocity-overdrive-native-trial`、Draft PR #46、凍結Gold、原作Slope・原Physics／Game Camera、元Road7/B51 Mover28/240Hz/球0.65m、本番2サイトは保護。**正式ART採用0件／Slope2 DNA0m／HUMAN/SAT/CCD/FPS/RELEASE/MERGEすべてHOLD**。Work/Computer Useは個別事前承認、追加有料API原則0円、ユーザー操作0。
