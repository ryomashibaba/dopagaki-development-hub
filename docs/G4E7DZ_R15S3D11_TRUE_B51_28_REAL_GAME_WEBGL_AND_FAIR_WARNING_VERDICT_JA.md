# DOPAGAKI SLOPE — R15S-3D11 本物の28 B51動体の高速ゲーム再配置・真正240Hz×4・実WebGL2×4・同軌道照合

**基準日：2026-10-30 JST。** PRIVATE研究用、Draft PR #46。目的は、前R15S3D9の元Runner全7道路FINISH2/2のまま、B51動体28基の「配置数だけ」「見せかけの警告」から脱し、元物理・正規ゲーム・実際のHUDで体験上の障害物を検証すること。保護元`web/p101-w9c2-g4e7ci-integrated-streetscape.mjs` Git blob `af076d67492a677d2235e4730aef8cdf4808e106`、元WebGL/Runner/CCD/原P96/P94/A13/元道路7本/本番/main/Gold/P100は変更しない。

## 1. 本物の実障害物2案、既存28基中6基のみPRIVATE再配置

`scripts/p101-r15s3d11-six-real-b51-lane-reanchor-candidates.mjs`：元R15S3D9 A案の**全実B48道路7本を1頂点も変更せず**、元B51のID`a13-machine-11`〜`a13-machine-16`のみ実路面上の道路5・6に位置変更。元オブジェクトID・タイプ・周期・位相・collision modeは維持。幅約16mの正規路面に合わせ、PRIVATE試験用の実B51衝突箱を約3.4〜3.6mへ変更。残り22基の元B51記述子も無改変。幽霊安全床、新コライダー、誘導操舵、テレポート、失敗救済は一切追加しない。

- **A_EDGE_READABLE**：6基を路肩側に交互設置し、正規車線中心側の通路を残す。元球の真正通過が可能で、画面上の動体接近が増えるかを研究する。操作の難しさ・駆け引きとして十分かは未認定。
- **B_INNER_CROSSING**：同じ6基を路面内側へ寄せ、元の動作位相で横切る実衝突を生む厳しい試験。失敗は意図的に隠さず、予告・回避判断が成立するかを検査する。現状では自動元操舵が接触して失敗するため正式採用REJECT。

## 2. 原240Hz実物理×4・独立QA

[Actions #40996596408](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40996596408) はSUCCESS、[保存済み元Runner証拠 #12951144376](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40996596408/artifacts/12951144376)。本物の`Runner`・元`p101Step`・正規A13力・P96 early-soft 0〜21.5秒／P94 corrective以後・240Hz・元球半径0.65・元7道路／28物体を新しい実配置で毎回0秒から起動。原CROWNの17秒/21.5秒源座標・速度・合法操舵・路面、**4/4ケースで2地点一致**。独立QAで虚偽認定12件を拒否。

| 元世界 | 真のA案（路肩） | 真のB案（車線内） | A実30m内動体数／0秒〜終点 | B実接触 |
|---|---|---|---:|---|
| true-pinch | **69.829167s finished / 本物のfinishイベント1** | **60.733333s failed / finishイベント0** | 13/28 | `a13-machine-12` |
| pinch-switch | **70.516667s finished / 本物のfinishイベント1** | **61.304167s failed / finishイベント0** | 14/28 | `a13-machine-12` |

最初の2回のCI失敗（#40996242388、#40996389457）は**研究用試験コードの時刻0初期status=`ready`を終了条件と誤解**した問題で、元Runner本体や試験用B51を変えず「`failed`または`finished`のみ終了」と修正。後の真正4ケースCI SUCCESSにより正しい物理結果を得た。失敗を闇に葬らない。

重要：表の「13/14基」は**時刻0から終点まで0.1秒間隔**の試験計測であり、前R15S3D10の「23秒以降のみ10Hz」3基と直接比較してはいけない。

## 3. 本当に同じ球の軌道で公正に比較

[同軌道照合CI #40997061397](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40997061397) はSUCCESS、[証拠 #12951313883](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40997061397/artifacts/12951313883)、独立QA偽認定9件拒否。

両世界とも真正元球の**23秒以降・0.5秒間隔**、同じ実球XYZ・元時刻、元の移動箱位相のまま、28基元配置とPRIVATE6基再配置の球表面〜回転OBB離隔を同じサンプルで比較。元R15S3D9の真正元球とR15S3D11 Aの重複位置差は**両世界とも0m**。

| 23秒以降、同一位置・時刻条件 | 元配置の30m内B51 | A案の30m内B51 | 元の10m内 | A案の10m内 |
|---|---:|---:|---:|---:|
| true-pinch、94地点 | **1基** | **5基** | 1基 | 2基 |
| pinch-switch、96地点 | **3基** | **7基** | 0基 | 1基 |

これで衝突物が実際にコース近くへ移ったことは定量確認。ただし測定間隔0.5秒で最接近値を見逃す可能性、`swept`CCD個別インパルス・人間の瞬間判断・実描画の遮蔽は未測定。源位置差0mは保存精度による結果で人間の操作性の保証ではない。

## 4. 実ゲーム PRIVATE WebGL2×4

[真正WebGL2 Actions #40996713244](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40996713244) SUCCESS／[本物の18スクリーンショット #12951946719](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40996713244/artifacts/12951946719)。

`scripts/p101-r15s3d11-private-genuine-webgl-hazard-pack.mjs`が、すでに元ゲームを複製したD10`dist-private/r15s3d10`をさらに`dist-private/r15s3d11`へ隔離複製し、4つの実B48×7＋実B51×28を登録。**元`drive3d.mjs`の本物のWebGL2レンダラー・GLSL・球・3D衝突道路・本物のB51描画・元追従カメラ・元HUDで実画面を出した。** ただしCIのSwiftShaderヘッドレスGPU性能はユーザーのWindows実機FPSではない。

A：元2世界ともブラウザでも`finished`＋本物の`finish`イベント1、元最終B48に接地（69.83/70.52秒）。B：元2世界ともブラウザでも61秒前後に`a13-machine-12`実接触`failed`、本物の`finish`イベント0。終端実画面でB51球表面からの距離0mを表示し、ゲームの本物の物理失敗が視認できる。

**重大反省**：Bのt58秒台では既存HUDが「前方動体なし」と表示し、t60.7秒実衝突地点ではやっと`0m`警告に変わった。**高速170m/s級では実用的な予告不足**。ブラウザの`screenshot`が取れたこと、B51実体が存在すること、赤色警告が出ることは「人間に公平に遊べる」の証明ではない。

## 5. R15S3D11-R1 本物のWebGL2で早期予告を検証（過大申告禁止）

この遅いHUDを改善するため、別PRIVATEコピーに`scripts/p101-r15s3d11-source-road-ahead-b51-warning.mjs`を追加。元routeを信用せず、本当に変更済みの実B48道路中心線の弧長を算出し、約650m以内の**実在する6基の原B51**の前方距離を、正規HUDに事前表示する。今の箱位置と実路面距離のみを根拠とし、見えている・衝突する・何秒後・人間が避けられるとは断定しない。元カメラ／Runner／B51は変更せず、`dist-private/r15s3d11/`の複製だけに実装。

**追加検査を完了・技術限定PASS**：[R15S3D11-R1 本物のWebGL2再撮影Actions #40997430997](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40997430997) **SUCCESS**／[21枚の真正画像と元HUD証拠 Artifact #12952301879](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40997430997/artifacts/12952301879)。実物理道路の前方弧長、次障害物の原ID・車線左右・現時刻の実OBB姿勢を表示。元WebGL2/CAMERA/HUD/Runner/元B51はそのまま、隔離PRIVATE版のみ拡張。路面にいない球は強制的な予告を出さない。単体**5/5 PASS**、4つのPRIVATE元ブラウザ真正ゲームの走行が原Runner終端A`finished`×2／B`failed`×2に一致。

**特にB案の衝突予告を実画面で確認**：

- true-pinch：元ブラウザHUD表示時刻**59.23秒**で`a13-machine-12`を**前方実B48曲線252m**と表示。元Runnerの実衝突は60.733333秒。次のスクリーンショットでは真衝突による`failed`を確認。
- pinch-switch：ブラウザHUD時刻**59.34秒**で同じ実障害物を**前方327m**、60.37秒で**151m**と表示。その後61.304167秒に`failed`、`finish`イベント0。A案は両元世界とも約69.83／70.52秒に真正`finished`／元`finish`1を維持。
- **時間の限界**：スクリーンショットは元ブラウザのHUD約500ms間欠更新・描画時刻のずれがあるため、`252m→厳密1.5秒`等の衝突予告正確性を認定しない。道路距離は実B48中心線弧長の試験値であって、動体の将来位置・CCD衝突時刻・実描画遮蔽・人間の反応可能性を予測したものではない。現時刻の2値を照合した限定技術成果にとどめ、**GAMEPLAY/HUMAN/ART HOLD**を維持する。

## 6. 次のR15S3D12の明確な目標

1. **真正の早期危険予告と機械が実画面で見えるか**を、B案で「2秒程度前・1秒程度前・衝突時」の元カメラ／HUD／実動体サイズ／遮蔽とともに検査する。HUDに出ても道路/都市に隠れる、または障害物のサイズが数pxしかないならREJECT。
2. **A路肩配置を『自動完走だけで退屈』から脱却させる**。中核は幅10〜16m・最高200m/s級での予告→位置選択→安全な通過。自然な回避可能性を人間の元手動入力で検証するまでGAMEPLAY/HUMAN HOLD。Bの中心衝突を「成功体験」として採用しない。
3. **現景観の巨大ワイヤー／柱／無地面をアートとして棄却**し、原実WebGL元カメラの同条件で新しい道路5/6の超巨大非対称都市骨格・多階層居住/公共空洞・接近/通過/退出の時間構成を本物の3Dとして再構築。無関係な画像生成や小さな飾りだけは禁止。
4. ソフトウェアGPUのCIスクリーンショットや自動操舵の`finished`を、ユーザーの実機でのプレイ可能性・FPS・美術品質として誤認しない。
5. PRIVATE Windowsワンクリック`scripts/R15S3D11_PRIVATE_HAZARD_WEBGL_ONE_CLICK.cmd`から、ユーザー側のローカルリポジトリ上で比較ステージを起動可能。USERは別のアカウントやZIP操作を必要としない（ただし当該ブランチをPC上にチェックアウトした場合）。公開サイトは未更新。

**正式状態**：SOURCE-NATIVE 240Hz A `finished` 2/2、B物理失敗2/2、元CROWN prefix4/4、SOURCE B51同軌道比較PASS、元WebGL2で4/4真正表示と一致した物理終端PASS。**GAMEPLAY/HUMAN/ART/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD、正式ART0件・公式Slope2認定0m**。Draft PR #46 OPEN・未マージ、production/main保護。

