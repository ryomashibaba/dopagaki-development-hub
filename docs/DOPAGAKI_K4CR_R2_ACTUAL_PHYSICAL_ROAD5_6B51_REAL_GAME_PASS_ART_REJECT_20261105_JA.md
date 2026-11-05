# DOPAGAKI SLOPE — HYPER RUSH / K4CR R2 1区間 真B48物理＋元B51 実ゲーム統合：TECH PASS／ART REJECT／HUMAN HOLD
確定：2026-11-05 JST。本書は既存の **K4CP批判的完全正本** およびK4CQ R2正本の固定方針を変更しない。

## 最新の唯一の真正結果
- 分岐：`research/k4cr-genuine-b48-bank-chicane-b51-native-20261105`。K4CQ固定親HEAD `15ac5c448e91f8a6f4395831a5bdcaa0f7472f45` から派生。K4CQ元研究枝・main・公式P101・Draft PR #46は更新していない。
- **R2 [GitHub Actions #42029941216](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42029941216) completed/SUCCESS**。物理著作ソース修正HEAD `93f14c1145faf7121742be2aa7b8474cea16569c`。
- **R2 [真Artifact #13415198299](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42029941216/artifacts/13415198299)**、ZIP 2,997,438 byte、SHA256 `f3d886c2ee1384f58e67a0f2971dbf948bf89e88d231dd04a0a723c6375c0ec9`。GitHubから独立再取得、**全ファイルZIP CRC PASS**、18ファイル（実生Chrome画像6枚、比較3枚、実Blender、編集可OBJ、監査JSON等）確認済み。
- **元Game blob** `af076d67492a677d2235e4730aef8cdf4808e106` 保護。原本/Gold/元Road5/Camera/Runner/240Hz/CCD/入力/本番サイトは不変更。R15S3D9段階の16m研究用物理Road5からさらに **独立した新物理研究候補** を著作。元の106m級正式Road5の変更・採用ではない。

## 実制作した「走行に効く」物理区間
- `scripts/p101-k4cr-physical-road5-chicane-real-b51.mjs`：本当のB48物理Road5の31×5制御ネットを書き換え、進行方向に左右2回の切り返し、実縦断20m追加起伏、横断バンクを制作。ソースRoad5 SHA256 `39d66c47cfce3718871c5450f8594dfd10a2a31b7bbb70dd5634d1cb4c73922f`→研究新物理SHA256 `4957a0e1ffb1a394c4bbaa2c502caad3fdec219c9713073f5236d7bbb6ab4e2b`。
- 実測制御ネット：最大中心左右変位 **43.85699m**、最大バンク **5.84567°**（9°は設計係数であり実測9°とは言わない）、最大頂点変化45.99937m、サンプル路幅約15.98492～16.00470m、最小サンプル法線Y 0.99078。元Road4→Road5およびRoad5→不変更Road6の各5頂点境界**厳密不変**。他の6つのB48道路不変更。隠し路面・新Collider・速度ハック0。
- `scripts/p101-k4cr-true-game-and-blender-pack.mjs`：K4CQの既存PRIVATE真WebGL2描画/物理を再利用して`dist-private/k4cr`だけにオプトイン登録。元画像合成・代理物理・原本書換はしない。実Road5の`surface.sample()`から2,400三角形の独立Blender編集可能Road5を出力。同じ研究位置の周辺環境4,616三角形を併置。**この周辺ARTは過去のK4CQ R2不合格品の比較再利用に過ぎず正式採用していない**。
- 28個の元B51を全保持、**元のID/型/周期/位相/衝突モードを保持した6個**を、本当のRoad5/6相対座標に配置し直した。`A_EDGE_READABLE`がR2採用研究パラメータ。中央走行を塞ぎすぎず、交互の端側から危険判断をさせる研究仮説。残り22個は不変更。これを人間が楽しいと判断した証拠ではない。

## 実失敗と修正：ごまかし禁止
- 初回R1 [Actions #42029168415](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42029168415) **FAIL**。[R1 Artifact #13416240327](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42029168415/artifacts/13416240327)の無加工エラー画面を直接確認。元28 B51のうち `a13-machine-12` が走路正面に近く、実走行が**60.81秒**で中断、`runner.status=failed`。障害物との衝突が有力だが、ゲーム失敗イベントの確定詳細は未記録。真正Blender TECH成功でもゲーム統合QAは不合格のまま保管。
- 原因に対する**1回のまとまった再配置**としてR2では`B_INNER_CROSSING`から元D11の`A_EDGE_READABLE`へ6個とも移し、スライダー可動幅も元D11の1.8mとした。機械を削除・非衝突化しない。原物理カーブは一切弱めない。
- R2は独立監査で失敗0・実物理画像の相違を確認したので、R1を遡ってPASS扱いしない。

## 真正Chromium 240Hz・独立画像
- ソフトウェアGL下の **実Chromium WebGL2 2セッション**。元SOURCEの同一`ball-lock-unfiltered-heading` Cameraと自動操舵P96→P94、1/240秒ステップ：58/64/67秒、`13920/15360/16080` tickで両ケース **running**、ページ/consoleエラー各0。**人間操作ではない**。
- 旧/新速度HUD、同時刻順：58s **171.1/170.0m/s**、64s **178.5/176.2m/s**、67s **186.6/186.1m/s**。観測区間で球は本物の`p93-PRISM_CREST-01`から`p93-FINISH_RIDGE-01`へ進んだ。最後までクリアした証拠ではない（67s/予定83.2s）。
- 実物理B51近接：64sに`a13-machine-13`約81.88m、67sに`a13-machine-14`約17.13m、当該時点で`running`を確認。元22体を消したり非衝突化したものではない。
- 無加工の1365×930実画面比較は58/64/67秒で差異 **69,357 / 124,291 / 110,471 pixel**（閾値25輝度、2画面同時刻比較）。これらは**本物の表示とカメラ移動の差**であって、美術・操作性・動的衝突合格点を意味しない。
- 真Blender **4.0.2**、可編集Mesh **2**、本物の`Road5` サンプル三角形**2,400**と旧ART研究環境**4,616**。`K4CR_TRUE_EDITABLE_ROAD5_B48_AND_COAST_HOLD.blend`を原本とは別名保存。ソース幾何SHAをBUILDとDCCで一致。

## 直接美術・プレイ判定
- 生の58/64/67秒画像を直接観察した。R1とR2の走路曲率・速度・元B51の危険は実画面で変化し、ようやく背景3Dだけの研究から脱した。
- しかし、**まだ巨大で単調な蛍光模様の舗装と平板な壁・海の帯、見通しの弱い遠景、場としての物語・制作密度の不足**が残る。R2周辺景観自体K4CQ R2の不合格研究素材。**正式ARTは REJECT / 採用0件**。また危険予告が170～186m/sの速度で十分先行して見えるか、複数レーンの意思決定が楽しいかは**未立証**。
- **真230Hz等の別エンジンの結果にすり替えない**。240Hzオート走行の3時点だけで`SAT`/`CCD`/`FPS`/`HUMAN`合格にしない。全コース完走、実人間入力、Windows実機性能、競技性はHOLD。

## 次に進む優先度（従来方針を維持）
1. K4CR R2を基準とし、**本当に人が遊べる危険予告時間・左右操作・失敗/再挑戦・コースカーブの判断**をひと続きの実ゲーム場面で実測する。まず危険77m予告は171m/sでは約0.45秒、17mでは約0.09秒しかないため、人間向け事前予告と危険選択の評価を優先する。これらは速度/距離の単純商であり人間反応データではない。元Camera/物理/公式QAを変えず、研究COPYでのみ改善する。
2. 1区間のゲーム性が見えたら、**本物の進路を主役にした全画面一体3D環境**をDCC FIRSTで再著作する。K4CQの大きな平壁の微修正・小物の数増し・小QA/監督器量産は禁止。2つの実課題を1研究縦スライスで統合する。
3. 正式ART採用・DNA認定・本番・全コースへの横展開は、真正人間/動的SAT/CCD/Windows FPS等により独立認証が揃うまでHOLD。資料と修正はGitHub研究枝内隔離、通常ユーザー操作0。

**永久の保護ゲート：正式ART採用0件／正式Slope2 DNA 0m／HUMAN・SAT・CCD・FPS・RELEASE・MERGEすべてHOLD。** main・公式P101・Draft PR #46・Gold/元Slope・原Game・元Road5・元Camera・凍結/正式QA・本番サイトを保護。Work/Computer Use、追加支払、原本変更、正式採用、公開・mergeはそれぞれ事前承認。K4CP・K4CQの最上位固定正本を継承する。
