# R15S3D — 速度保持・実SCISSOR後半・次道路接続の研究実装

基準日：2026-10-29 JST。**研究コードを実装・コミットした段階。真正CIの完了前であり、SOURCE TECH/ GAMEPLAY/ ART の新規PASSを一切宣言しない。**

## 入力証拠と維持方針

- 直前の真正R15S3C Actions #40867343670 SUCCESS。E_BANKED_LANDING＋合法P94のtrue-pinchとpinch-switchは35.770833s／36.062500sで原Runnerが「コースから落下」。34秒以後の実再接地0。最終接地32.845833s／33.141667s。後続B48接地0。
- 元R15S3Bの実0.25秒位置履歴で、true-pinchはt30にx=-965.49、t31にx=-955.50。進行中のx方向が反転している。**これは世界X方向の反転であり、コースに対する厳密な逆走の証明ではない。** そこで当該道路の真正中心線接線に沿う符号付き速度を別指標とする。
- 完全な元B16 CROWN、SCISSOR制御格子の行0〜16、元その他6道路、B51動体28基とその衝突、240Hz/CCD/重力、P101 OVERDRIVE、通常合法[-1,1]操作、元ルートガイド、元カメラを保護。ゲーム本体や正式公開物に手を入れない。

## R15S3D0 先行ジオメトリ監査

研究コード：scripts/p101-r15s3d0-source-geometry-signed-trail-audit.mjs

[Actions #40868422387](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40868422387)。元B48 E路面のSCISSOR実コントロール点（行0〜30）と続く道路の最初の制御点（行0〜10）を、R15S3Bの本物の0.25秒保存軌跡と同じXYZ座標系で出す。半秒の位置差分を投影した「符号付き道路接線速度」は**近似値**であり、原240Hz内の瞬間速度ではない。CI未完了時点では静的結果を成功扱いしない。

## R15S3D 隔離型実物理道路6条件

研究コード：scripts/p101-r15s3d-isolated-scissor-late-velocity-geometry.mjs / scripts/p101-r15s3d-six-original-native-road-speed-and-junction-trials.mjs

- **G_SOFT_GRADIENT**：EのSCISSOR後半、制御行17〜28だけに最大約26m相当の下向き勾配緩和を与える。ボールの速度喪失を防げるか仮説検証。
- **H_TANGENT_RELEASE**：既存実路面行16の前進接線方向へ道路後半の制御格子を最大80m、縦断を最大約11m移す。急旋回に由来する反転や停滞が減るか検証。
- **I_TANGENT_CANYON**：接線方向へ最大115m、縦断約18m、後半に真16m細道を試す。前進速度と支持を維持できない場合は自動的にART詳細化禁止。

いずれも全幅を持つ実B48三角形ソース物理路面の**格子点変更**であり、ゲーム本体の見えない支え床、速度補正、ユーザー操作補正、別コライダーを追加しない。元SCISSOR行0〜16と行29〜30は完全保持。CROWN全格子・次道路全格子・他のB48/B51は不変。

2元世界×3形状×元P96 early-soft（21.5秒まで）から既存P94 full（21.5秒後）の合法入力＝**合計6真正240Hz・最大45秒**をCIで実行する。t17/t21.5でR15S3Bの元位置・入力・接地が一致しなければFAIL。

### 今回追加した実測指標
1. Runner.grounded＋物理道路IDによる真正支持。SCISSOR実接地累積秒／次道路実接地の最初の時刻と秒数。
2. 原プレイヤーvelocityの絶対速度、原forwardとの内積（エンジン前進速度）、本物のB48中心線へ射影した速度の符号付き接線成分。
3. 原forwardが25m/s未満になった真正接地tick数、負のforwardになったtick数、SCISSOR接線速度の負サンプル数。
4. 実SCISSOR上の到達uは離散中心線への**近傍射影プロキシ**であって真CCDの接触uではない。停滞と逆走を隠す「最後まで生き残った秒数」ランキングは禁止。
5. 後続B48の接地点と元動体B51の接触イベント、真の終了status（45s打切りrunningは完走ではない）。原ゲームブラウザWebGL、人間QA、公式美術は別ゲート。

独立Python QA：scripts/p101-r15s3d-independent-speed-and-junction-veto.py。元CROWN改変・元SCISSOR入口改変・偽次道路接触・偽WebGL・偽人間ゲームPASS・偽ART・偽Slope2認定等13ケースを棄却する設計。真正[Actions #40869325008](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40869325008)の最終結果を必ず参照すること。前の試験ラン#40869087958は古い独立QA版で、最新版の正式判定に使わない。

## 次の厳格な採否
合格候補は前進の**符号付き**速度が維持され、実支持を失わず、SCISSOR後半→次B48実接地が確認された案に限る。継続時間が延びても進行速度が小さい・符号が逆なら採用不可。6案を3D装飾で延命しない。現段階のCITY ART採用0、Slope2認定0m、GAMEPLAY/HUMAN/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD。元ゲームGit blob af076d67492a677d2235e4730aef8cdf4808e106 / PR#46 Draft / main・Gold・P100・本番2URL保護。
