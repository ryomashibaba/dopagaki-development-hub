# K4BI — Genuine Road5 Source Camera / Road PBR + Civic Facade Craft

2026-11-04 JST（研究独立枝、ART-FIRST）。本書は [K4BH最終ART REJECT](R19_A6P4_R2F5K4BH_TRUE_CAMERA_COMPLETE_HERO_COMPOSITION_JA.md) の継承記録。継続ブランチ：`research/k4bi-road-surface-facade-craft-20261104`。

## 凍結される上位目標と不変更
全コースの世界水準の美術。いまは元実行ソースの物理ロードを変えずに、Road5の実Source Camera構図の画面全体が高品質になるか、**Blender DCC研究だけで**直接評価する。写真・架空の完成予想図ではなく実レンダリングを使用。
- 元ゲーム `web/p101-w9c2-g4e7ci-integrated-streetscape.mjs` Blob `af076d67492a677d2235e4730aef8cdf4808e106`、元B48全7／B51全28／240Hz／球0.65m／元6Camera数値／安全案内不変更。K4BH原本 `K4BH_SCULPTED_SEA_GATE_EDITABLE_HERO_ART_HOLD.blend` は真正親CI #41732617047／Artifact #13276364672／SHA256 `6e1251b08c37d67b6c87d450d616afd2485572aa94d1491e8395599c8c042796`。
- main／公式`p101-velocity-overdrive-native-trial`／Draft PR #46／本番ゲームサイトを変更しない。Game colliderの追加0、元Road5 source tessellation変更0。DCCに限ってshaderは変更するが、実ゲームの物理舗装更新ではない。
- Workは事前承認。ユーザーにWindows・Blenderローカル操作を要求しない。実WebGL走行FPS・B51全時刻クリアランス・人間観戦・SAT/CCD・本番デプロイは実行していない。

## 美術上の明確な課題
K4BHの真正画像では道路が視野の大半を占め、暗い無地の巨大面と粗い壁、遠方の細い二重アーチだけで公共空間の詳細がほとんど読めない。これを既製の箱・円弧の反復だけで覆っても世界品質に到達しない。

## 今回の作者試作
- `scripts/p101-k4bi-road-surface-civic-facade-craft.py`：元Blender真正原本を読み込み、元Road5全頂点と全三角形のSHA256 fingerprint `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2` を前後照合する。元camera数値も前後照合する。
- ROAD5原メッシュ・Cameraは変更せず、DCC内でRoad5材質だけ高周波マイクロバンプ・岩盤系PBR複層色・縦のレーシングライン・コース端の連続彩色・横断施工目地・コース外サインを**位置計算による本物のメッシュ表面shader**として作り込む。平らな上貼りジオメトリや新当たり判定で誤魔化さない。
- 左右の連続する公共建築外装に、奥行きつき開口、銅製柱と庇、建築ルーバー、開口内部の照明・ガラス・照明器具・展示棚・外部バルコニーを、元Camera近中距離のデザイン読解を優先して編集可能Blenderメッシュとして制作。巨大な粗い単体造形のみを増やすのではない。
- 新たに真正Source Camera control tick11307 + ultra tick11341の同じ元数値から2DCC画像生成。旧K4BH真正画像と同じ構図で差分を直接検証。
- 本工程は **DCC独立 ART候補**。Source/NativeBlender/PNGとSHAが通過してもART合格やWebGLビルド、ユーザーが認めた世界品質にはならない。

## 工程ログ
- 新ブランチ生成し、Python制作者・独立[CI #41739572392](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41739572392)をGitHub保存。
- この記述段階ではCI実レンダー/正規Artifact/真画像の結果は**未確認**。後続結果を必ず追記し、失败があれば失敗として記録する。
- 正式ART採用0件、Slope2 DNA正式認定0m、ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE HOLD維持。

## 必須の次ゲート
実画像を目視して、路面の素材・車線・近景構図・公共内部の読解・街区の豊かさ・遠景・速度感を評価。不十分なら新アセットを正式採用せず、外観作者工程を更新。ART承認前の他6Road横展開、実ゲームへの変更、本番公開はしない。

## K4BI初回実結果（2026-11-04）

- [初回真正CI #41739572392](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41739572392) は **completed/SUCCESS**。元の真正K4BH.blendのSHA、凍結原Game Blob、Node元sourceテスト、Blender真正Camera数値control11307/ultra11341、本来のRoad5 tessellation SHA、独立画像サイズ・SHA・RGB差分、研究ブランチPNG保存がすべてPASS。これは **SOURCE/DCC技術だけのPASS**。
- 真正 [初回Artifact #13280952631](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41739572392/artifacts/13280952631)、ZIP SHA256 `282798b50eda66567754e818e32d435fc88415149cc043cd203ab2e6a1e3ade6`。ZIP CRCエラー0。.blend 32,740,992 B、元Camera 2画像、K4BH同時刻比較PNG、検証JSONあり、JSONファイル SHAすべて独立一致。新Blender DCC objects 282、しかし物量を美術合格の根拠にしない。
- **実画像でのART判定：REJECT。** K4BH比で走行路面に規則的な線が可視化され、建築が単なる壁から柱・窓・庇・室内に変わった部分改善は確認。ただし画面の60%以上は無地の灰色の路面、既視感のある同一窓反復、距離の見せ場は細い二重アーチのみ、遠方都市／歩行者の機能／強い素材差／速度感／演出／地形の層は不足。粒状ノイズが強く、世界水準の画として不合格。正式採用ART0件、Slope2 DNA0m。
- この技術PASSを足場に、唯一の改善として新render試験：Cycles samples 96、denoise有効、全体露出を0.21段下げ、海色の細い連続外装inlayと暖色の手仕上げ帯を同じsource Cameraに追加。修正commit `0cc5bc5981599add685266c226ba5a18e365f6da`。再[Actions #41740364212](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41740364212)で真正画像と変更源の再検証が必要。**初回ART REJECTは撤回せず、再render完成前のアート評価を捏造しない。**
- 何らかのART認定前のGame WebGL移植、他Road複製、B51/HUMAN/SAT/CCD/FPS、main/p101/PR、本番公開は禁止・未実施。

## 次の本質的な絵作り
単純な規則的窓と直線白線は画面の改善の入口にすぎない。意匠の一部としてしか認めない。真の課題は、コース走行視点で道路自体が魅力的な素材・ディテール・立体環境として読み取れ、左右に機能する都市公共空間と遠方の豊かな地理・景観、主役の圧倒的な固有意匠が揃うこと。美術の合格を自称する代わりに、ひとつのフレームを現実の高級レーシングゲーム画面として再構成するための手制作優先の工程へ移行する。単なるDCCオブジェクト数量とテクニカルゲートを増やすことは避ける。

## Blender denoiser実機制約と安全な復旧

[2回目Actions #41740364212](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41740364212)は **completed/FAILURE**。元sourceと親SHA検査までPASSしたが、Blender 4.0.2 Ubuntuの`RuntimeError: Error: Build without OpenImageDenoiser`でレンダリングに入る直前に停止。成功・出力PNG・ART PASS扱いは禁止。初回ART REJECT・初回SOURCE/DCC技術PASSの保全は有効。

CIとBlenderの能力不足を事実として受け取り、`sc.cycles.use_denoising=False` と `view_layer.cycles.use_denoising=False` の両方を明示して保護。96の無デノイズ実サンプル、露出修正、シアン細帯の追加を固定。修正commit `4186c3daadeafd92bb3d32de07a5856a8911bcdf`、[3回目Actions #41740606366](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41740606366)の独立結果を待って確定させる。旧アートREJECTは変更しない。


## 【K4BI確定・2026-11-04】真の最終CI／ART判定／次工程

- **真の最終CI**：[Actions #41740606366](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41740606366) は **completed/SUCCESS**。中間 #41740364212 は OpenImageDenoiserなしビルドで **FAILURE**、修正版`4186c3daadeafd92bb3d32de07a5856a8911bcdf`で無デノイズ96samples、source SHA・親.blend SHA・2真Source Camera描画・独立PNG画像照合・GitHub画像保存が成功。ユーザーにローカル操作要求なし。
- **真正最終Artifact**：[Artifact #13281034575](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41740606366/artifacts/13281034575)、ZIP SHA256 `03ecbc210290d030884e42b5e09efa2f01aac8e7210bb2d19bf2c832e0621539`。ZIP CRCに異常なし。内容：編集可能`K4BI_ROAD_MATERIAL_ARCHITECTURAL_DETAIL_EDITABLE_DCC_HOLD.blend` 32,904,464 B、control11307 PNG、ultra11341 PNG、旧K4BHと同source pose2視点の並列比較PNG、独立sha JSON。全ファイルの真SHAをアーカイブ解凍後に再計算しJSONと一致。新DCCアセット286（数は美術評価の根拠にならない）。
- **画像を直接観察した結果**：元の単調な灰色路面は白金色のセンター線等によって進行方向が読めるようになり、左右には実体窓、柱、庇・室内、海色の細い縁が追加された。K4BHより全画面構図が機能しているのは視覚的に確認できる。しかし**全体はまだART REJECT**。縞模様は幅広く人工的、奥行きのある舗装や高級な表面仕上がりに届かず、道路がフレーム面積の過半を占めたまま。左右の建物はリズムが同じ窓で都市として薄く、遠方には孤立したアーチ・尖塔以外の魅力的な景観が乏しい。ライト・近中景・地形・環境ストーリー・色彩差は不十分。96samples無デノイズでも粗粒のレンダーノイズが残る。**これを世界水準の完成と報告しない**。
- **保護確認**：Road5実物頂点・面 fingerprint `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`全く不変、元Camera control/ultra数値不変、元Game blob `af076d67492a677d2235e4730aef8cdf4808e106`不変。物理7道路／28動体／240Hz／0.65mに変更なし。新Collider0。WebGL2ゲーム画面や実プレイを撮影したものではない。**正式ART採用0件／Slope2 DNA認定0m、ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE全部HOLD**。
- **次の正しい制作方針**：車線・窓の反復を数で増やす小幅工程はやめ、道路近景の精密な意匠／高品質な実UV-PBRと舗装の立体細工、左右で異なる中近景の居住・交通空間、豊かな都市遠景／地形、道路の曲率とカメラから本当に成立する立体構図を、ひとつのHeroフレームの**人間の美術審査で見事と認めるレベル**まで根本制作。評価前の他6道路の大量展開・元ゲームへの移植禁止。ユーザーへのWindows操作要求なし。main/公式p101/PR#46/本番2サイト保護。
