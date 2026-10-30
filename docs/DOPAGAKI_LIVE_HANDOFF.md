# DOPAGAKI SLOPE — LIVE HANDOFF（2026-10-31 JST・R19 A1真正同tick検証完了）

**正本：本ファイル、PROJECT_STATE.md先頭、実PR #46 HEADと原Artifact。本来の完成像は約7.28km／52秒級、Slope2 DNA目標2,912m＋本当に美しい巨大未来都市＋人間に楽しい高速物理ゲーム。R18の新美術量産反復を止め、GAMEPLAY×ART統合代表区間へ戻す。**

## 永久保護
元web/p101-w9c2-g4e7ci-integrated-streetscape.mjs Git blob af076d67492a677d2235e4730aef8cdf4808e106、240Hz CCD・球r=.65m・正規B48実道路7/B51実動体28・P96/P94/A13・元生カメラ/HUDを保護。Gold/W9-X/B5/P100/main/本番の無断改変なし。実験はp101-velocity-overdrive-native-trialのDraft PR #46 OPEN未マージ、PRIVATE非衝突都市のみ。透明床、磁力、速度リセット、偽finish、単体テストをART PASSと呼ぶことは不可。

## R19 A0・A1の確定進展
- A0真0秒スポーン→12秒2,880tick：本物のW9-C1 CONTROL 28mとULTRA 14m両方running・元road0→1へ接地進行。最高速度116.742／115.519m/s、B51接触0、警告1.104秒→310mコア4.404秒（3.3秒余裕）。ULTRA真Catmull–Rom幅13.159〜14m・概算路端最小余裕1.743mは公平性HOLD。原[ A0 Actions #41131784122 ](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41131784122)とArtifact #13013401969。
- A1は**元W9-C1の生ゲームWebGL2を本物のNative A0球位置と同じ240Hz tickで凍結**し、CONTROL/ULTRA×G5B既存景観OFF/ONの4条件×6時刻（tick265,721,1057,1249,1921,2761）で**元Canvas 24枚**を撮影。
- **修正後の[A1真Actions #41133092902](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41133092902) 全工程SUCCESS**、元24/24 PNG SHA256個別PASS・同tick完全一致・球XYZの最大差0.0007704m・速度最大差0.0004716m/s。正規B48/28B51・0秒初速52m/s・P96/A13・元生カメラ/HUD不変。原Artifact #13014316341（ZIP 3,855,835 bytes / SHA256 1bcebaf205a52e2bddba861eb5d15aedfc32f89d88dd53fff3ec4e7aec6e4c4d／2026-11-06期限）。初回#41132919104はPRIVATEカメラ計測挿入文字列のアンカー不一致でFAIL、PRIVATEだけ修正した。
- 元FOV投影でB51の中心候補は時刻ごと9〜21基（**これは見えた危険物の数ではない**）。選択された近傍候補は1.104秒でa13-machine-01球から約70m、5.204秒でa13-machine-02約36.8〜37.7m。遮蔽、実ピクセル視認、危険物の回避公平性は未検証。
- **真正画像上、既存G5B＋従来景観のARTは正式採用REJECT**。元G5B OFFでも大きな青い柱・箱が存在し、G5Bを色替えするだけでは問題は解決できない。ON/OFF画素差は1.104秒の0.5〜0.6%から狭路コア4.404秒の11〜16%前後、5.204秒の9〜11%程度。画素差は美術や安全性のスコアではない。元の正規生カメラでは道路曲率と14m狭幅を見られるが、建築は美しい大規模未来都市として未完成。
- 正式ART採用0件、Slope2 DNA認定0m。HUMAN/GAMEPLAY/PERFORMANCE/RELEASE/MERGE HOLD。詳しい証拠と評価は [R19 A1元24画像の完成監査](R19_A1_NATIVE12S_REAL_WEBGL2_SAME_TICK_B51_CAMERA_GATE_JA.md)。

## 次A2の優先順
1. A1真正同tickの元画像から、**G5B OFFにも出ている大きな箱/柱の所有コード**を先に特定。弱い景観上へ別の巨大箱を足すことをやめる。
2. 本物の14m狭路（最小余裕1.743m）と同一正規カメラを基準に、遠景→進入→狭路コア→退出の実時間を優先。デザインは大型の公共都市構成を**1案だけ**高度な造形で制作。単にモジュール増加・粒状装飾でART改善と主張しない。
3. 元B48/B51/生カメラ・実入力を守り、正規WebGL2で本物の速度時刻に見える形を直接比較。短いWindows人間14m/28m実機試走とB51の正確なピクセル視認・GPU FPSの検査へ進む。

今後も元WebGL2 source QA PASS≠ART/GAMEPLAY/HUMAN PASS。元の完璧な全体方針を維持。
