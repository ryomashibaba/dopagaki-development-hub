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
