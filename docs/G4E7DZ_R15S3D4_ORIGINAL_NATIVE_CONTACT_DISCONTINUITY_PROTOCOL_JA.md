# R15S3D4 — R15S3D3元240Hz再接地の接触法線・方向変化に関する独立原因診断

## 正本・判定境界（2026-10-30 JST）

対象: Draft PR #46の隔離試験。R15S3D3は[元Actions #40879559256](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40879559256)で次B48への再接地4/4を確認したが、真の全コース完走0/4。L(true-pinch)の45秒runningは完走ではなく、高速Uターン疑惑を含みGAMEPLAY PASSではない。

**本工程の目的:** 元R15S3D3のL/M×2世界を、新しい道路形状を混入せず0秒から再走行する。31秒台の差を、「各240Hzステップの元球速度差」「元Runnerでの接地・surface」「元contactsでの接地支持法線」「固定コライダー衝突回数」の同時系列で調べる。真の接触法線／曲率／大きい速度差の対応をできる限り分解する。

## 取得と証明可能性の境界

- 新ファイル `scripts/p101-r15s3d4-original-four-case-contact-velocity-forensic.mjs` は**観測のみ**。既存 `buildR15S3D3` のL/M、元P96→P94入力、0秒spawn、Runner 240Hz/CCD、B51 28基、CROWN全格子と元SCISSOR初期行0〜11を保持。4条件の旧R15S3D3出力に対して最終状態・終端時刻・実接地tick・B51イベント件数が完全一致することを強制。
- 再生時刻30.75〜33.4秒の毎tickで、元物理コードと**同じ方法で選択するプレイヤー移動前の支持接触** `contacts(compiled, prePosition, RADIUS)` と、step後の次tick候補支持、速度前後、`player.collisions` のtick差分を記録。前後の全速度差分は、**重力・操舵・路面接触等の全効果込み**であり、単独の衝突インパルスではない。
- 元Runnerの固定接触`sweep()`の**各CCD衝突時の法線・衝撃量は外部公開されていない**。`contacts()`の支持法線は真正な元メッシュの静的近接接触ではあるが、CCD瞬間衝突法線そのものではない。これらの情報を取り違えて「衝突原因証明」と書くことを禁止。
- `scripts/p101-r15s3d4-independent-velocity-contact-honesty-qa.py` は全stepの数値整合、法線・元Runnerの路面一致、旧結果への回帰、誇大認定・改変証拠の拒否を検査する。ただしPython側で物理エンジン全体を独立再実装した証拠ではない。

## 判定と次の設計

1. 先に真の4本の元Runner再現性を確認する。再現不一致なら分析を中断し回帰破壊の理由を調査する。
2. true-pinch Lの31.4〜31.6秒の速度急変が、単一tickの高衝突回数や接触切替付近に局在するか、複数tickに滑らかに分布するか比較する。pinch-switch L、およびM2世界を対照群にする。
3. 支持法線の急変と速度差が空間的に一致しても因果はまだ仮説。真のCCD瞬間法線は保護元ソースを改変しない隔離診断か、専用の非侵襲的再演算で検証してから断定する。
4. 形状候補は原因特定後に設計。新たな幅増し／見えない床／強制ジャンプ／速度補正／自動操舵は不可。両世界で滑らかな方向転換、継続支持、100m/s級の速度と操舵可能性、次の本物の路面への進入を要求する。
5. ゲームプレイ成立後には必ず実WebGL/正規カメラ・B51予告・実人間操作・巨大未来都市のIntegrated Vertical Sliceへ移る。技術試験だけを繰り返さない。

**正式評価: SOURCE TECHは今回のCI結果確認まで保留。GAMEPLAY FAIL/HOLD、ART REJECT/HOLD、HUMAN・PERFORMANCE・INTEGRATION・RELEASE・MERGE HOLD。公式ART0件、Slope2正式認定0m。本番・main・Gold・P100・元ゲームblob `af076d67492a677d2235e4730aef8cdf4808e106` の変更禁止。**
