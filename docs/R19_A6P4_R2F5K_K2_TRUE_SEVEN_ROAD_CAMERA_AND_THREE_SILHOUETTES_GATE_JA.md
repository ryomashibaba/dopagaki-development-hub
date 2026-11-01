# DOPAGAKI SLOPE — R2F5-K／K2 全7道路元座標・30真正カメラ・3別道路視点投影の実測報告

2026年11月1日 JST。正本 `ryomashibaba/dopagaki-development-hub`、開発ブランチ `p101-velocity-overdrive-native-trial`、PR #46 OPEN Draft未マージ。

## 正式判定

**K：SOURCE/TRUE NATIVE WEBGL2限定PASS（到達した地点のみ）。K2：実元カメラ投影のみ限定PASS。ART採用0件、Slope2 DNA認定0m。Road4〜6の真正走行カメラ未観測。** 本番・main・Gold・P100・W9-X・B5、元240Hz/球/左右操舵/自然ジャンプ/カメラ/B48×7/B51×28は一切変更なし。新コライダー0。新Blenderモデル0。

### 1. 元7区間の物理座標・真正カメラ延長：成功した部分と明確な限界

- [R2F5-K実装 `24b2e470`](https://github.com/ryomashibaba/dopagaki-development-hub/commit/24b2e47065d50f557e6edc4212bdce0543fdbe2f) で、元ゲームsource Git blob `af076d67492a677d2235e4730aef8cdf4808e106` 固定から、14m/28mの元B48全7区間・各81道路ステーション、**計1134**の真の中心／左右端／進行方向を生成。元ゲームstageを変異させないテスト合格。
- [K GitHub Actions #41312758260](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41312758260) **全工程SUCCESS**。[Artifact #13086435838](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41312758260/artifacts/13086435838)：ZIP **3,856,011 bytes**, SHA256 `b493ddaf0dd70d34660e47107e7cfca154d69bda2ab121206e24823dabf4586c`。32ファイル（元真正WebGL2 PNG×30、全7区間座標JSON、元カメラ観測JSON）。30PNG SHAとバイト数を原Artifactで独立照合、すべて一致。6つのアーカイブ済み原カメラ×両幅も真正一致。
- 元P96 scripted QA（**人間操作ではない**）を元240Hz/元カメラで再生し、両幅で15時刻×2＝30真正WebGL2画像。取得した元時刻 `[265,721,1057,1249,1921,2761,3001,3361,3841,4321,4801,5761,6721,7681,8641]`、最後8641/240＝**36.004秒**。
- 走行道路の記録：Road0 ABYSS（265〜1249）、Road1 CROWN（1921〜4321）、Road2 SCISSOR（4801〜5761）、Road3 LOWER（6721〜7681）、8641は`AIR`。元自動操舵が到達不能になる次の目標9601までに落下：**ultra tick8994 ≈37.475秒、control tick8927 ≈37.196秒**。目標9601／10561／11521／12461は撮影できなかった。ここを「全7区間の元走行・カメラPASS」と誤記しない。
- Road4 VOID SURGE、Road5 PRISM CREST、Road6 FINISH RIDGEは**実道路座標あり、元真カメラ未観測**。コース7区間7200m超を真正走行で評価したという断言は禁止。全区間連続原走行の成功も未確認。

### 2. K2：Road1左の一建物の反復から、3道路の建築的シーケンス候補へ

- [K2実装 `065be44c`](https://github.com/ryomashibaba/dopagaki-development-hub/commit/065be44c51d019f66af07b30e26293f1125510b0)：元KのSHA固定Artifactを読み、道路の元中心線・左右端・進行方向と本物の元カメラ（eye/front）から、異なる3プログラムの大体積**研究用直方体**を投影。Blenderモデル・空洞・ゲーム景観は一切新規生成しない。
- [K2 GitHub Actions #41313451046](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41313451046) **全工程SUCCESS**。[K2 Artifact #13086063935](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41313451046/artifacts/13086063935) ZIP **2,565 bytes**, SHA256 `0f1ed75a026c538a9e2036c2f894307ea3ca956663ec591254ca48299de5cc67`。研究JSON原本の実ファイルを開いて16ケースの測定を独立照合。
- K2は「ビューフラスタム内に見かけ上投影される」テストだけ。**真の遮蔽、建築の美術/用途認識、地盤接地、厳密道路/B51静的・動的安全、FPS、実人間の自然操舵は一切認証していない**。

| 研究用の役割 | 元の道路・位置（暫定） | 撮影した元240Hz tick | 2幅での投影結果 |
|---|---|---|---|
| 低く開いた市場街区 | Road0 ABYSS・`u=.75`・道路右端外70m | 265,721,1057 | 6/6投影試験成立。最小描画BBox面積 約7,110 px² |
| 非対称の交通・乗換街区 | Road2 SCISSOR・`u=.25`・道路左端外70m | 3841,4321,4801 | 6/6成立。最小約4,514 px² |
| 空洞を持つ公共地形・広場 | Road3 LOWER・`u=.20`・道路右端外100m | 5761,6721 | 4/4成立。最小約3,304 px² |

各候補を構成する直方体はマーケット90×65×32m、交通120×70×67m、公共135×95×43m。**真の建築形ではなく最外郭の仮プロキシ**。境界元道路端から仮箱の最寄り面はそれぞれ37.5m／35.0m／52.5mという**局所算術のみ**。曲線の隣接Road・高低差・走行球と接触しないとの保証はない。前述の3種類が視覚的に見分けられるとの証明もない。「真の公共空洞」の製作もまだない。

## 3. 次工程K3の優先順位／方針をぶらさない

1. **未観測Road4〜6の真正カメラ獲得を優先**。元走行Scripted QAは37秒台で落下終了するため、現状のルートを完走として扱わない。コアゲームは保護したまま、テスト運転の原操舵改善（実走成功が証明できる場合のみ）か、元ソースの区間別QAスタートを**連続走行とは区別**して探る。ゲートを迂回するテレポート/透明床/磁力/原物理・カメラ書換は禁止。
2. K2の3地点が本当に見られる範囲を原14/28m×複数時刻の**真正WebGL2に1つずつ**立体化した最小Native GLBで審査。3候補を巨大建築として同時量産することは禁止。見かけ面積が十分でも、F/G2/Iの暗い大壁／2小屋／反復柱を繰り返したらART REJECT。
3. 市場・駅・公共地形は*明確に異なる形*と*通り抜けられる真の3D負空間*で設計し、見た目の色・LED・ラベルだけで識別させる案は禁止。使える公共空間・人間歩行は実機の検査までHOLD。原Slope2 DNA認定40%＝約2,912mの目標は変更しない。
4. どれか1候補が真カメラでARTレビューに進むだけの質を満たした時のみ、その固有候補の全B48メッシュとB51×2幅×2881 tickのSAT・tick間CCD・B51画像可読性・実走/Windows/iPhone FPSへ。**ART0件のまま統合/RELEASE/mergeをしない**。

## 4. 保護・状態

**SOURCE/TRUTH CAMERA&PROJECTION TECH限定PASS、K2 ART未試験、以前I/G2/F ART REJECT継続、正式ART 0／Slope2 DNA 0m、ROAD4〜6視点UNOBSERVED、HUMAN/GAMEPLAY/SAFE/PERFORMANCE/RELEASE/MERGE全HOLD、PR#46 Draft未マージ。** 本番2URLと原物理・カメラ・gold/masterは無変更。
