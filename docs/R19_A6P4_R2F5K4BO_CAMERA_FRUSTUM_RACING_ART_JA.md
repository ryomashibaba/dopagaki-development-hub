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
