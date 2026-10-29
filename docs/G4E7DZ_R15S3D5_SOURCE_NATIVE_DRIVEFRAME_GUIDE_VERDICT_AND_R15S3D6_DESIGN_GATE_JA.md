# R15S3D5 — 元240Hz真正4条件の走行ガイド／drive-frame再生と次の物理道路設計ゲート

**2026-10-30 JST／独立SOURCE TECH限定PASS・GAMEPLAY FAIL/HOLD・ART REJECT/HOLD。**
元[Actions #40956811818](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40956811818) **SUCCESS**、[Artifact #12934470871](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40956811818/artifacts/12934470871)。
原R15S3D4の4組×各637tick、0秒からの元Runner真正240Hzにおける位置・速度・入力・接地路面・イベント差分との一致。原B16 CROWN17秒／21.5秒prefixを全4条件で保持し、元B48×7、B51×28、CCD、P96→P94合法操舵、元routeと元物理コード・元本番ソースを一切変更しなかった。Python独立QAが数値整合性と12種類の虚偽認証を拒否した。

## 定義と実際に計測した証拠

- **球の進行方向**：元Runnerが出した実速度ベクトルの水平XZ成分。
- **forward**：元Runnerの実際の `player.forward`（移動前／移動後）。操作フレームと進行方向は同義ではない。
- **guide**：元Runnerの実装に合わせて選択した原source routeまたはgenerated-surface routeの局所接線。元routeを編集していない。
- **ground**：原Runnerの実接地路面と、R15S3D4で照合した`contacts()`由来の事前支持法線。これは各CCD接触の瞬間法線・個別衝撃量を直接測ったものではない。
- **時刻**：31.4→31.6秒、0.2秒区間の端点方向比較。角度は向きの違いであり、平均／瞬間加速度の直接計測ではない。

| 元世界／道路候補 | 実速度の水平方向変化 | 元Runner forwardの方向変化 | 元guide局所方向変化 | 31.4→31.6のガイド距離 | 元最終状態 |
|---|---:|---:|---:|---|---|
| true-pinch / L | 77.215250° | 60.116003° | 0° | 15.558655m→0.704717m | 45秒running・未完走 |
| pinch-switch / L | 6.776714° | 0.002620° | 0° | 7.707922m→12.111252m | 33.820833秒落下 |
| true-pinch / M | 8.832734° | 0.011621° | 32.750776° | 374.835994m→2.840151m | 33.700000秒落下 |
| pinch-switch / M | 8.200168° | 0.002252° | 0° | 7.006743m→12.934539m | 33.633333秒落下 |

L true-pinchでは31.4・31.6秒とも原Runnerの接地路面が`p93-LOWER_REVERSAL-01`。guideの局所接線は変わっていないのにforwardが60.12°変化した。これは**球が元guideに近づく過程で、原Runnerのgrounded時guide追従／地表法線への射影がforward再配向に関与した可能性が高い**ことを示す。元`physics.js`には接地時にtarget guideへforwardを混合し、地表法線へ射影し、そのフレームに合わせて球の速度成分を再配置する処理が存在する。

**ただし因果断定は禁止。** forward変化のうち、guide-assist、支持法線投影、CCD固定衝突の各寄与は独立に測定していない。速度方向77.22°をそのまま「アシストが原因」または「衝撃が原因」と結論することはできない。同じLでもpinch-switchには同等の再配向がないため、片世界だけのrunningは成功ではない。

M true-pinchのguide角32.75°は31.4秒の空中・原route参照から31.6秒の実接地・generated guide参照へ選択対象が切り替わるため、単一の連続guideの旋回として読まない。検証コードの`guideSource`を照合して解釈する。

### プログラム・証拠
- `scripts/p101-r15s3d5-original-drive-frame-and-guide-replay.mjs`：4つの真正Runnerを再現し、全637tickの原R15S3D4データと突合。
- `scripts/p101-r15s3d5-independent-original-guidance-honesty-qa.py`：速度・操舵・法線・方向・guideと旧証拠の整合および12偽認定の拒否。
- `.github/workflows/p101-r15s3d5-original-guide-drive-frame-source.yml`：元B16とR15S3D4の真Artifactを取得し、元ソースblobを検証した上で再実行。
- 結果は`R15S3D5_FOUR_CASE_ORIGINAL_GUIDANCE_DRIVE_FRAME.json`と`R15S3D5_INDEPENDENT_GUIDANCE_CONSISTENCY_QA.json`に保存。

## 次工程：R15S3D6 源流物理を保護した二仮説の形状設計

目的は、**原Runnerのforwardを切り替えて曲がれたように見せることではなく、ボールが先に路面の実形状に沿って自然に走ること**。以下を並行比較し、前段R15S3D3 L/M・R15S3D4・本R15S3D5を同じ判定基準で評価する。

**A. 事前支持・長曲率案**：CROWN全格子・SCISSOR行0〜11、元B51×28と元routeを保存し、SCISSOR後半と次B48入口の実物理面を一体の長半径曲線として再設計する。31秒の自由落下で約-80m/sになる前に実路面で接線進行・自然な支持を獲得できることを目指す。過去E/G/H/Iの急登坂・逆走は再利用しない。

**B. 自然再接地・迎え角低減案**：自然ギャップは認めつつ、球の飛行進路と次B48接線・法線を整合させ、L/Mで観測した1tick約75〜78m/sの激しい速度変化を軽減する。見えない床、吸着、物理改変は禁止。入り口の幅をただ増やす案は却下。

**必須検証**：元0秒から2世界×2候補の真正240Hz。元B16 prefix一致、原B48×7・元B51×28、CROWN/SCISSOR保護、元P96→P94操舵、原カメラ維持を確認する。次道路への実接地、正方向の符号付き速度、接地継続、損失速度、1tick速度差、0.2秒の球方向とforward方向、元guide近接、最終`finished/failed/running`を別々に測る。候補が繰り返し失敗したら形状を棄却し、無意味な微調整を続けない。

**人間の公平性・ゲーム正式採用には、実WebGLのプレイヤーカメラ、障害物の実視認性、実人間QAが追加で必須。** 本CI成功はSOURCE TECHに限る。ART正式0件、Slope2認定0m、GAMEPLAY FAIL/HOLD、ART REJECT/HOLD、HUMAN/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD。本番・main・Gold・P100・元保護source blob `af076d67492a677d2235e4730aef8cdf4808e106`の変更・マージ禁止。PR #46 OPEN/Draftのまま継続。

## 反省点
見かけの生存時間、次道路への再接地4/4、ある世界だけの高速走行を成功に数えない。**実際の速度方向・原forward・guide・路面支持を分解し、同じ原条件の二世界で自然に進める道路を成立させることを最優先**。それができないまま美術の巨大建築を詳細化しない。ただし都市との関係を初期から並行設計し、良好な物理道路は速やかに実ゲームWebGL・人間QAにつなぐ。
