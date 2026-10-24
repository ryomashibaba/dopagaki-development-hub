# G4E-7AV — 第1道路の過大な左右蛇行を物理的に改善し、第2道路へ到達する独立試走候補
2026-10-24 JST。PR46 Draft/HOLD、main/Gold/本番サイト全保護。

## 診断の反証
- [AU起点00 240Hz](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40078962476)：TRUE-PINCH 7.025s、PINCH-SWITCH 7.058sで落下し、第2道路未到達。
- [AV物理軌道probe](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40080678294)：第1・第2道路の端点は**完全一致**。最初の意図しない空中離脱は **u約.288、2.596/2.629秒**。実ギャップcell52より大幅に手前。第1道路の接地経路が高速度の曲率と整合していない。
- [3段階の垂直勾配のみ補正 #40080960647](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40080960647)：すべて第2道路未到達。TRUE-PINCH最大u≈.397まで進んだが落下。
- [AV 2段階の中心線改良 #40081219349](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40081219349)：**lineSoft・lineLevelとも両道路で12秒RUNNING、第2道路到達に成功**。
  - lineSoft：TRUE-PINCH 7.933s／PINCH-SWITCH 7.858sで第2道路。
  - lineLevel：TRUE-PINCH 7.754s／PINCH-SWITCH 7.821sで第2道路。
- lineSoftは大きな曲率を約70%実際のB48制御点で緩和、lineLevelは100%緩和。既存の狭路/ギャップ・立体的なコース全体と独立して調整できる。**今回はlineSoftを第一手動試走候補に**するが人間の楽しさは未認定。

## 構造保護と操作方法
- ATが作った第2道路のCROWN/CHASM、他5道路、元7道路・28障害物、B48セル52実ギャップを保持し、変更した第1道路に元の実動体01だけを再アンカー。不可視の補助床・テレポート・新チェックポイント・速度リセット・自動操舵・ブースト禁止を厳守。
- GitHub上の独立 `generateG4E7AV(road,grade)` を保持し、オリジナルAT/ASを一切上書きしない。
- PRIVATE生成：`P101_A13_W9C2_G4E7AV_{TRUE_PINCH|PINCH_SWITCH}_{LINESOFT|LINELEVEL}_LOCAL_TRIAL.json`。通常メニュー・本番・public-safeでは不生成。
- 手動A/Dの正規00開始は `/drive3d/?g4e7al=manual&g4e7av=lines`。比較は `&g4e7avGrade=level`。試走後のJSON保存は以前のAL方式を使用し、送信しない。
- **12秒の非人間P96継続は7/7完走、人間の公平さ、初見の楽しさや美術の合格ではない**。CIのブラウザはStage HUD/UIのみで、長距離実人間プレイを証明しない。
- 次工程：さらに長い実走行（第2道路に入ってからの幅、回転体4基、次の狭路）、人間の初見視認性・難易度・見た目を検証し改良。形式的な数字だけで正式Slope2 DNA認定しない。現在の正式認定は**0m**。
