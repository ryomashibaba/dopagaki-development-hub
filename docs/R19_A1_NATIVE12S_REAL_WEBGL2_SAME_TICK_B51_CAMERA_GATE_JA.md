# R19 A1 — 0〜12秒の真正元WebGL2カメラと元240Hz物理を一致させる

**2026-10-31 JST。R18の単独美術量産に戻らず、W9-C1実物理14m細道と既存G5B都市を同一カメラ・同一走行時刻で照合する。正式ART0件、Slope2認定0m、HUMAN/GAMEPLAY/PERFORMANCE/RELEASE/MERGE HOLD。**

## 元のA0から動かさないもの

- 実走行は0秒スポーン、初速52m/s、元240Hz CCD/r=.65m、7本の実B48・28体の実B51、元P96実スクリプト操舵＋P101 A13加速。旧W9-C1の28m CONTROL／14m ULTRAの本当の物理格子を再利用する。
- A0で実測された警告1.104秒→310mコア進入4.404秒＝3.300秒、ULTRAの狭路真補間幅13.159〜14m・概算路端最小1.743mは「人間に安全」という証拠ではない。
- G5Bは以前からある非衝突・原道路縁から65m以上離れた候補、デフォルトOFF。新たな都市の自動量産をしない。320mローカル初速52m/sの静止画像を本当に0秒から高速で走った画面と取り違えない。
- 元本体 web/p101-w9c2-g4e7ci-integrated-streetscape.mjs Git blob af076d67492a677d2235e4730aef8cdf4808e106、main/P100/Gold/B5/W9-X/本番、Draft PR #46未マージを維持。

## 今回の新実装

- scripts/p101-r19a1-private-original-native-camera-pack.mjs：build:privateで生成した**本物の旧drive3d/WebGL2**を dist-private/r19a1 にPRIVATEコピーした上で、このコピーだけに元P96スクリプト0秒起動と元240Hz tickでの確定停止を追加。カメラの生方向モード、速度HUD、元B51物理位置とFoV投影候補を元から読む。生産用オリジナルWebGLゲームには編集をかけない。描画コピーが元の物理と違ってしまえば落とす。
- scripts/p101-r19a1-six-true-native-matched-camera-frames.mjs：元W9-C1 CONTROL/ULTRA×G5B OFF/ONの4条件。6枚ずつ、**native tick 265 /721 /1057 /1249 /1921 /2761**（各約1.104、3.004、4.404、5.204、8.004、11.504秒）で一時停止して本物の原Canvasを24枚保存。別途R19 A0の元真240Hz traceから直接選び出した同tickのXYZ・速度・接地road IDに対し、差が位置0.08m、速度0.05m/s未満と独立検査する。前回の「同スポーン320m」の瞬間画像とは明確に区別する。
- 元28基のB51は scripts/p101-r15s3d10-physical-b51-hud-cue.mjs の既存投影処理を再使用し、各停止tickに原カメラのeye/frontと中心点画角の候補、実球との形状分離距離を保存。**FoVは遮蔽や人間の視認を示さない**。人間の障害物回避の公平性や実GPU FPSは正式HOLD。
- scripts/p101-r19a1-independent-24-native-frame-gate.mjs：真正24 PNG個別SHA256一致、tick・座標・速度・元カメラ・B51の遮蔽未判定表記、偽の「ART PASS」等の改竄4条件拒否。
- [専用Actions](https://github.com/ryomashibaba/dopagaki-development-hub/actions/workflows/p101-r19a1-original-synchronized-native-camera.yml)：旧のsource SHA/実物理test → 真のPRIVATE元renderer生成 → 真正Chromium WebGL2撮影 → 独立原本SHA・元Tick一致QA。Artifactは r19-evidence の独立保管先へ（前工程で発見したPlaywrightのtest-results削除で証拠を失う問題を防止）。

## 正式判定の要件

元P96の真正Native 12秒と元Browser gameのP96/球位置がtick一致しない場合はSOURCE技術FAIL。**不一致を目に見えない球位置の移動、原本道路形状改変、カメラ映像の捏造で埋めてはいけない**。環境依存のズレを含め原因を調査。0〜12秒中でG5Bが景観として成立するか、B51が今そこにあるかを元画角で比較してART・障害物評価を次A2で改善。

スクリプトが「running」や画像24枚PASSでも初見人間の操作性・楽しさ・障害物の実視認・実Windows GPU FPS、正式Slope2 DNA距離の合格ではない。正式ART0件／Slope2認定0mを維持。
