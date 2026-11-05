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
