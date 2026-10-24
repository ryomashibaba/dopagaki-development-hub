# G4E-7AR — 真B51-C rotor #02 実接触・反発 vs push／真11m B48操舵到達比較（非公開）

作成 2026-10-24 JST。既存Draft PR #46の検証工程。A13正式Slope2=0m、公開/人間/美術すべてHOLD。

## 動体接触実験
- **同じ実ローター姿勢**を使い、B51-C`sweepSphereMovingObstacle`で本物の回転OBBへの衝突点と衝突時刻を測る。そこから`movingContactResponse`へ同一初速を与え、**push**と**bounce(0.8)**の衝突後速度成分と実道路接線の符号を比較する。これは数学的な核試験であり、人間のゲームプレイではない。
- さらに元の道路7本と28実動体を保持した`Runner`に、障害物02の横2方向から衝突する**人工チェックポイント**を与え240Hzで追跡。動体02接触・前後の速度・道路接線方向成分・逆走・失敗を記録。人工チェックポイントが通常開始00から到達可能とは主張しない。元の物理エンジンを書き換えない。
- 比較用bounceはAPのローター幾何と位相を保存して衝突設定のみ変えた**メモリ内の仮想条件**。第三のステージを保存も公開もしない。AJ本来の設定と混同しない。

## 左右操舵到達実験
- AQと同様AJからP96基準操舵を一度だけ作り、真の`p101Step`＋7道路B48＋全28動体の240HzRunnerへ同一入力を再生。
- TRUE-PINCHとPINCH-SWITCH、AJとAPの4組で、早期左／右と後期左／右の4種の固定A/D差分を走らせる。B48上の物理路肩距離・負マージン最初の時刻・脱落理由・B51接触IDを5Hz〜20Hzの補助サンプルと原生イベントで分けて記録。
- サンプルから求めた路肩への「近さ」は**通れる連続経路、カメラ内の視認、初見人間の反応、公平な回避を証明しない**。スクリプト操舵は非人間。新しい安全帯、スピードリセット、吸着補助は禁止。

## 保護条件と判断
- G4E-7AJ／7AP元ステージJSON／Gold／main／本番／原作再現／物理エンジンは不変更。26実動体、7道路、cell52真ギャップ、240Hz保存。
- `scripts/p101-w9c2-g4e7ar-rebound-reachability.mjs` と`tests/p101-w9c2-g4e7ar-rebound-reachability.test.mjs`をCI実行、JSONをActions artifactへ保存。
- CIが通っても人間QA、美術、正式認定、公開はHOLD。次に実観測を使って、改善すべき「反発速度の方向」「実操舵で道路幅内に収まる時間」を区別する。

## 実CI完了結果（2026-10-24 JST）

対象コードHEAD：`b1c97d0475a2981ddd26e18636db5b0d0920a6d4`。 [GitHub Actions #40074009266](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40074009266) は**全ステップSUCCESS**。従来Node回帰/AQ同一操舵、AR実OBB CCD＋真240HzRunner試験、Chromium **15/15 PASS**、PRIVATE buildとpublic/public-safe隔離、証拠artifact保存すべて成功。 [artifact #12551629966](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40074009266/artifacts/12551629966) に `g4e7ar-impact-edge-native.json` と実Chromium画像。

### 02ローター制御衝突（人間操作・正規00スタートではない）

- B51-Cスイープ核による接触 **8件**（2道路×AJ/AP×左右）。
- 本物の全道路/全動体Runnerでの**人工初期状態からの実動体接触12件**。意図的にローターへ進入した実物理事象であり、初見ユーザー操作の証拠ではない。
- APローター（同じ形・位置・位相）では、両道路ともpushモードの接触は各1回、道路進行方向への速度反転は **0件**。同じAP幾何でbounce(.8)へ切り替えた仮想衝突では接触が各1回、**速度反転が各1件**。
- 一方、AJローター幾何の制御比較はpush/bounceとも各道路2件接触のうち逆方向への速度反転が各1件。単にpushなら必ず逆走がなくなるわけではなく、**幾何と衝突の向きに依存**する。
- 危険な通常プレイでの衝突解消・再加速能力・高速度200m/s時の回避成功はまだ検証されていない。

### start00からの非人間固定A/D試験（6.7秒まで・独立した比較）

| 実B48 11mコース | AJ早左(−0.22) | AP早左(−0.22) | AJ/AP早右(+0.22) | AJ/AP遅右(+0.22) |
|---|---|---|---|---|
| TRUE-PINCH | 2.7833sにB51接触で失敗 | 6.7sまでRUNNING・最小投影路肩マージン−0.8688m | 共に6.5417sに落下・最小−0.7125m | 共に5.5292sに衝突専用面で失敗 |
| PINCH-SWITCH | 2.825sにB51接触で失敗 | 6.7sまでRUNNING・最小投影路肩マージン−1.0405m | 共に6.5833sに落下・最小−0.6492m | 共に5.625sに衝突専用面で失敗 |

- 遅左(−0.22)は両道路×AJ/APとも6.7秒RUNNING。ただし成功判定でも7/7完走でもない。
- **AP早左はB51へ衝突しなくなったが、投影上は真B48縁よりボール半径込みで外へ出るサンプルがあり、空中/再接地の可達性も含めて人間の安全操作を保証しない。**
- **早右の同時刻落下、遅右の同時刻静的衝突**はAJ/AP両案の道路幾何や操舵から生じ、実動体02の反発だけでは解決しない。

### 分離判定

`AR_NATIVE_TECHNICAL_PASS / CONTROLLED_AP_PUSH_REVERSE_0_OF_1_PER_ROAD / AP_EARLY_LEFT_SCRIPTED_SURVIVED_6_7_WITH_NEGATIVE_MARGIN / RIGHT_FAILURE_UNRESOLVED / HUMAN_HOLD / ART_HOLD / SLOPE2_0M / RELEASE_HOLD`。

次工程は本物の時間連続な**道路内の左右軌跡と障害物の時相の照合**（サンプルが開いているだけでは不十分）、可能なら手動JSONで確認する。新しい安全帯を仮設したり、反発・右落下を黙って消すようなエンジン改変は禁止。
