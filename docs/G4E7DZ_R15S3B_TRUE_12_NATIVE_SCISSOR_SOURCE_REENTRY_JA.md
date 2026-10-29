# R15S3B — 元CROWN B16全保持・測定軌跡対応SCISSORマクロ道路12真正240Hz

2026年10月29日JST。**SOURCE TECH 限定PASS／GAMEPLAY・ART・HUMAN・PERFORMANCE・INTEGRATION・RELEASE・MERGE HOLD。** 完走・本番採用・Slope2認定は0件。

真正 [GitHub Actions #40866341059](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40866341059) **SUCCESS**、Artifact **#12894166744**。元B16 CROWN全物理格子・他6道路・元B51×28・元240Hz/CCD/元操作・カメラを保持し、元SCISSOR物理路面のみを3マクロ案で改修。2世界×3形状×2元合法操舵＝**12件の0秒開始真正物理**。17秒・21.5秒の元R15Q B16トレース一致、同一形状内2操舵の切替以前一致、独立QA偽承認13種類拒否。

## 元エンジンの結果

| 世界 | 案 | 操舵 | 最後の真の実接地 | 終了時点の状態 |
|---|---|---|---:|---|
| true-pinch | D_TRACE_APPROACH | 元P96 | 26.770833s | 32.904167sでfailed |
| true-pinch | D_TRACE_APPROACH | P94フル21.5s〜 | 26.779167s | 33.495833sでfailed |
| true-pinch | E_BANKED_LANDING | 元P96 | 27.112500s | 33.020833sでfailed |
| true-pinch | E_BANKED_LANDING | P94フル21.5s〜 | **32.845833s** | **34.000000sでrunning** |
| true-pinch | F_LATE_CANYON | 元P96 | 26.645833s | 32.429167sでfailed |
| true-pinch | F_LATE_CANYON | P94フル21.5s〜 | 26.820833s | 33.591667sでfailed |
| pinch-switch | D_TRACE_APPROACH | 元P96 | 26.666667s | 32.812500sでfailed |
| pinch-switch | D_TRACE_APPROACH | P94フル21.5s〜 | 26.658333s | 33.179167sでfailed |
| pinch-switch | E_BANKED_LANDING | 元P96 | 26.950000s | 33.033333sでfailed |
| pinch-switch | E_BANKED_LANDING | P94フル21.5s〜 | **33.141667s** | **34.000000sでrunning** |
| pinch-switch | F_LATE_CANYON | 元P96 | 26.720833s | 32.783333sでfailed |
| pinch-switch | F_LATE_CANYON | P94フル21.5s〜 | 26.662500s | 33.266667sでfailed |

**10/12は真エンジンfailed、残る2/12は最大時間34sに達しただけで未完走。** これを「ゲーム修復2件」や「完走2件」と称することは禁止する。

## 決定的な前進と限界
- 先のR15S3でCROWN後半まで変更した3案はすべてSCISSOR接地0。R15S3Bでは原CROWNを保持したため**全12件でSCISSORに実接地**し、D/Fの元P96でも26秒台まで接地できた。
- E BANKED_LANDING + 元P94合法フル操舵では、SCISSOR累積実接地はtrue-pinch **4.350000秒**、pinch-switch **4.037500秒**。実接地時の最も先のSCISSORガイド近似uは約**0.5625／0.578125**。厳密なCCD接触uではない。
- R15S2BのB16＋フル操舵では最終接地23.541667/23.416667sだった。今回Eではそれぞれ約+9.304/+9.725秒遅い実接地点まで到達した。**ただし、時間差そのものは路面通過距離・操作公平性を保証せず、停止や低速化を伴う可能性に注意**。
- 元240Hzの34秒時点では、両E/P94ケースとも**engineGrounded=false（空中）**。最後の接地は32.845833／33.141667秒であり、その後の飛行・落下を「安定走行」としてカウントしない。
- 34秒付近のtrue-pinchはボール位置XYZ約[-933.370851,96.770948,157.884159]、pinch-switch約[-930.348395,108.438787,163.199983]。**その後の自然着地・後続道路進入・エンジンの最終失敗は未確認**。今回の12試験は元B51接触系イベント0であったが、危険の公平性が証明されたわけではない。
- 幅10〜16mの正式Slope2通過は未証明。Fの後半狭幅物理候補も終端は全落下。Eの市街地への建築的統合・実ゲームWebGL・人間試遊は未実施。

## 次のR15S3C / R15Tへの審査門
E+P94合法フルの2ケースを**元0秒から**再実行し、R15S3Bの0〜34sすべての真240Hz保存標本と一致した上で、元エンジンの実失敗・完走または50s打切りを確認する。元コライダー、入力、B51を変えず、最後の実接地、34s後の実再接地の有無、後続の道路IDを追跡する。結果が全件落下なら、次はSCISSOR後半〜次道路の**実縦断・支持・旋回接続**をマクロ修正し、正確な到達経路を継続検証する。

本当に後続道路まで走れると分かった候補のみ、巨大都市の質量・主空洞・交通/公共動線・支持構造を統合した編集可能Blender/GLB、元カメラと実ブラウザWebGLを作る。美術は単純な箱・板・細梁で延命せず、全体QUALITY-FIRST、実ゲーム視点、HUMAN QAを必要とする。

**元ゲームGit blob af076d67492a677d2235e4730aef8cdf4808e106不変、PR #46 Draft/未マージ、main/P100/Gold、本番2サイト禁止。公式ART採用0、Slope2認定0m。**
