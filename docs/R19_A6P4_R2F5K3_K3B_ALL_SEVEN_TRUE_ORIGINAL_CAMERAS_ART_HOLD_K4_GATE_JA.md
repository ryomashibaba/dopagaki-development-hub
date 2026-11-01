# DOPAGAKI SLOPE — R2F5-K3/K3B 240Hz合法操舵の実物理完走と元WebGL2後半カメラ完成

**2026-11-01 JST｜正本 `ryomashibaba/dopagaki-development-hub`／`p101-velocity-overdrive-native-trial`、PR #46 OPEN Draft未マージ。**

## 結論と正確な認証範囲

- **元W9C1物理・16本比較：4本が両幅で7区間完走**。後半のみP94 corrective操舵に変更した結果。**人間プレイの完走ではない**。
- **private A1の元240Hz/元カメラWebGL2：28真正PNG 28SHA成功**、旧A1最初6tick×2幅の12カメラ比較、成功P94/3ネイティブの後半8tick×2幅の16物理XYZ/速度/道路照合。**K3B原画単独では6区間を描画、旧KのRoad2真正画像と統合してRoad0〜6すべての元走行カメラ観測が成立**。原ゲームファイルを編集したわけではない。
- 成功したのは**非公開Scripted QAの物理／カメラ技術限定**。正式ART採用0件・Slope2 DNA認定0m、元ゲーム本番RELEASE、HUMAN、個別建築B48/B51 SAT・CCD、B51見通し、FPS、マージすべてHOLD。

## 1. K3合法操舵16本の結果

[Actions #41314887466](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41314887466) 全ジョブ SUCCESS。[Artifact #13086649501](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41314887466/artifacts/13086649501) ZIP **10,115 bytes**／SHA256 `102079ddf56435a54769da34d3d1dbd999751a52c673b77a6f0d12504047704f`。16試行＝14/28mそれぞれP96を中心とする6案＋P94 2案。**最初7680tick=32秒まで、全案同じP96 early-soft÷4.8元軌跡のJSON観測値が厳格一致。** 原ソースGit blob `af076d67492a677d2235e4730aef8cdf4808e106`、元7B48/28B51、元240Hz、元球半径0.65m、元52m/s発進／自然ジャンプ／無コライダー追加。

| 32秒以降の合法入力 | 14m元物理 | 28m元物理 | 道路通過 |
|---|---:|---:|---|
| 旧P96 ÷4.8 | 37.475s落下 | 37.195833s落下 | 0〜3 |
| P96 other 5 variants | 36〜37s台の落下 | 36〜37s台の落下 | 0〜3 |
| **P94 corrective÷3** | **51.525s完走** | **51.270833s完走** | **全0〜6** |
| **P94 corrective原倍率** | **51.3625s完走** | **51.05s完走** | **全0〜6** |

注意：「Native Runnerが実際にfinished」はゲーム表示と人間の楽しさ、ARTのPASSを含まない。P94は既存P94合法[-1,+1]操舵入力であり、球の位置速度を置き換えたり、仮設床を敷いたものではない。

## 2. K3B真正WebGL2再生・原物理とクロス照合

[K3B private再生実装 `8826730b`](https://github.com/ryomashibaba/dopagaki-development-hub/commit/8826730bcd08a7841ac211ea16213ef9314090ff) は実元A1のprivate版をコピーして**操舵選択の式だけ**を32秒後にP94÷3へ変更。物理・カメラ・B48/B51・球・ゲーム本体・本番サイトは変更なし。

[**Actions #41315509252**](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41315509252) **全ジョブSUCCESS**。[Artifact #13086878340](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41315509252/artifacts/13086878340) ZIP **3,302,953 bytes**, SHA256 `cdb87edcfe3b0ec8069f5d6e36488536d777a86c2e19b32339f9ed573ada5780`。実ZIP29ファイル＝真WebGL2 PNG28＋元カメラ/物理クロスチェックJSON1。全28PNGのSHA256を別環境で独立再計算、報告 `errors=[]`。

- `tick [265,721,1057,1249,1921,2761,7680,8640,9120,9600,10320,11040,11760,12240]` × ultra14m/control28m = 28真正WebGL2静止画像。
- 元A1アーカイブと最初6tick×両幅のカメラ eye/front が一致（閾値 eye<0.15m, front<0.0015）、後半8tick×両幅のネイティブK3成功試行と元球XYZの距離誤差 <0.0005m、速度差 <0.0005m/s、道路ID一致。元B51=28、実WebGL2、元カメラ`ball-lock-unfiltered-heading`を検証。改変原blob0、追加コライダー0。
- 両幅で **tick9600=40s Road4 VOID SURGE、tick11040=46s Road5 PRISM CREST、tick11760=49s Road6 FINISH RIDGE** の真元カメラを撮影。Road6 tick12240=51sは元物理がまだ走行中。K3B単体の画像にはRoad2 SCISSOR snapshotがないが、旧K Actions #41312758260 のtick4801/5761真正画像で実測済みなので、**K＋K3Bの合算で全7区間の元走行カメラをカバー**。全区間の任意時刻を撮れた/人間完走したとは主張しない。
- アーカイブと物理照合はヘッドレスChromium+SwiftShader環境のsource WebGL2検証。人間の画面FPS/UI/公平性や見えやすさを認証しない。

## 3. 後半の実画像の厳格ART観察

28枚から後半Road4/5/6の両幅6画面を目視。元の道路、HUD、先行する柱・ゲート・道路沿いの既存3Dが確かに存在する。現状の**都市的用途が異なる複数の巨大施設や、本物の奥行きある公共空洞は画面から判読できない**。これは新しいART候補を製作した結果ではない。**ART HOLD（旧F/G2/Iは依然ART REJECT）**。

今回の成功は、前回まで未観測だった後半3区間のカメラ実測と原物理完走が可能だと証明したことであり、市場・駅・公共広場の実造形品質ではない。

## 4. 次工程 K4 / 方針を固定

1. K2元投影3候補（Road0市場・Road2非対称交通・Road3真空洞公共広場）を**1つずつ**本物のNative Blenderで評価。最初の候補はRoad0の開いた市場街区。古い左局所Road1の大壁・2小屋・反復列柱への回帰は禁止。
2. 各候補は市場／交通／公共空洞を色・標識で区別せず、走行速度で一瞥できる**異なる実建築シルエット・建築的空隙**とする。元カメラの道路7区間時系列を基準に、14/28m真正WebGL2元画像最低4tick×2幅でART判定。画像投影BBox PASSだけでは不採用を覆せない。
3. 視野/空間の認知性がART候補として改善しなければモデル量産を止めて設計を再検討。正式採用後にのみ独立B48全区間／B51×2×2881tick／CCD／地盤／B51原画／HUMAN／Windows/iPhone FPSへ。
4. 元の一連のゲーム改変禁止: P100/W9-X/B5/main/Gold、本番2URL、ball/radius/240Hz/スピード法則、左右操舵・自然ジャンプ。PR #46 OPEN Draft、マージ禁止。**正式ART 0、Slope2 DNA認定 0m**。

**CURRENT: Native physical 4/16 FINISHED; K3B 28 REAL WebGL2 SOURCE PASS; whole-seven-road native CAMERA COVERAGE PASS when combined with K; ART/HUMAN/PERF/GAMEPLAY/SAFETY/RELEASE/MERGE HOLD。**
