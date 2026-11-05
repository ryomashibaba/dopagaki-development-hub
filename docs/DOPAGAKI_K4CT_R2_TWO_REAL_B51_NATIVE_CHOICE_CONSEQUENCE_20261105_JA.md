# DOPAGAKI SLOPE — HYPER RUSH / K4CT R2・2連続B51の実操作結果／TECH PASS・ART REJECT
2026-11-05 JST。既存のK4CP固定憲章・K4CQ ART REJECT・K4CR実物理コース・K4CS R3真早期予告の全決定をそのまま継承。新企画でも正式採用でもない。

## 最終唯一の真正結果
- 研究枝 `research/k4ct-two-native-b51-choice-consequence-20261105`。改修コード最終検証HEAD `22f29ab42740bf6ba363ce78237cbab928ae8251`。
- **K4CT R2 [真正GitHub Actions #42038776523](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42038776523) completed/SUCCESS**。本物の元WebGL2エンジン・1/240秒固定物理・Runner・Camera・KeyA/KeyD入力・旧新物理一致・独立source auditすべてPASS。**Blenderは今回再実行せず**：物理とメッシュがK4CS R3から厳密に同一であり、K4CS R3の編集可能Blender4.0.2証拠のみ引き継ぐ。
- **[R2 Artifact #13420511782](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42038776523/artifacts/13420511782)**。ZIP 3,086,298 byte、SHA256 `49521b40b57f0bb76c8edd0e0ced4196f1d69dcac54c464e108ec9ac59f5ba6c`、GitHubから独立取得・全15ファイルZIP CRC PASS。真WebGL2旧新画面10枚、実KeyA／KeyD各1枚、実数値JSON3件。生画像を実視認してARTを判定。
- R1 [Actions #42037805620](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42037805620) は**FAIL永久記録**。新旧の5地点真WebGL2セッションは成功したが、63.7秒試験で`page.waitForFunction`の**第3引数のtimeout optionsを第2引数argと間違え**、設定120秒が適用されず30秒で誤タイムアウト。R1エラー画面はゲーム約58.4秒の走行継続を示しており、B51衝突と誤診しない。R2で第三引数を修正し実測成功。物理を弱めたり危険を消さない。

## 実制作したゲームの「選択」
- `scripts/p101-k4ct-dual-real-b51-decision.mjs`：K4CSで照合済みの本物の実B48道路中心線・実6 B51ステーションを読んで、**次の2体の元B51を同時に**進路の順に表示。未来`movingObstaclePose`を用いて、**元の回転したOBB寸法・Yawを正しい左右軸に投影**し、左右へ物理的余地があるか試算。これは直線速度一定・未来姿勢推定であり、動的衝突・カーブ速度・別の障害物・人間判断は含まない。「OPEN?」という候補は**安全ルート認証ではない**。
- `scripts/p101-k4ct-private-native-two-choice-game.mjs`：旧K4CS本物のPRIVATEゲームを`dist-private/k4ct`へ隔離COPYし、自然にKeyA/KeyD手動操作を継承。元物理JSONの`surfaces`全7／`movingObstacles`全28／route/spawns/fixturesを完全一致照合。原本Game blob `af076d67492a677d2235e4730aef8cdf4808e106`、物理Road5 SHA `4957a0e1ffb1a394c4bbaa2c502caad3fdec219c9713073f5236d7bbb6ab4e2b`保護。新Collider0。新DCC背景は制作していない。
- 警告はASCIIで本物のGame canvasに中央固定した2体の行を表示するが、**既存原作のCJK欠字や警告と原HUDの一部重なりは残る**。小HUD修正を何度も繰り返す対象にしない。

## 真正同物理自動走行・2体の連続出現
旧K4CS／新K4CTの同じ原Camera・同じP96→P94自動操舵で、全5時点で**真Native ticks・Road ID・HUD速度・元Runner位置が一致**。ページJSエラー0。各時点の原B51（距離/ETAは現速度一定の推定）：

| 原ゲーム秒・ticks | 次のB51 | その次のB51 | 残る最初のETA | 残る次のETA |
|---|---|---|---:|---:|
|55 / 13200|11|12|2.64秒|5.96秒|
|58 / 13920|12|13|2.83秒|6.57秒|
|62 / 14880|13|14|2.51秒|5.27秒|
|64 / 15360|13|14|0.48秒|3.18秒|
|67 / 16080|14|15|0.11秒|1.25秒|

同一コースで「次」と「その次」の**別個の元B51が本当に存在**することを立証。67秒に最初のETA0.11秒はまだ非常に厳しく、2体予告を出しただけで人間可読・回避成功とはならない。

## 本当にA/Dを入力した結果
- ブラウザ上の元ゲーム・デモ実240Hz走行を**63.70秒（15288 ticks）で停止し、元の`takeoverRun`から実KeyAかKeyDへ切り替え**、64.05秒（15372 ticks）まで入力。ユーザーが操作したわけではなくPlaywright自動キー。
- A／Dは**どちらもrunner.status=`running`**で64.050000秒へ到達。元Runner真位置の差 **14.27156067m**。元路面正規化横位置A=**0.951**、D=**0.063**。左右を独自入力物理で捏造したものではない。
- 元B51-13の真正`sphereBoxSeparation`で、A側**72.57m**、D側**74.35m**（両者とも離れている。小さくても実距離差が生じた）。未来警告は両経路ともB51-13／B51-14。これが**独立した左右選択の実物理的帰結**。**どちらが本当に避けたかは不明**：接触点までの時間を走り切っていない、衝突0の認証ではない。比較値を勝敗点数に偽装しない。

## 生画像の批判的ART・UX評価／絶対にブレない次工程
- 実WebGL2画像を直接確認。真B48の立体路面・警告ポール・球・先行2危険は見えるが、巨大で平板な海岸壁・水平な帯・路面の粗いネオン柄・建築密度の欠如から**世界水準のゲームARTには遠い。直接ART REJECT／正式採用0**。HUD原CJK欠字と重なりも残る。
- **次は先行警告UIを増やす作業ではない。** 本物の2連続B51のうち、少なくとも1件について**選択から実接触時刻まで**A/D別に元Runnerで走らせ、実回避/衝突/失敗・真正オブジェクト最小距離・復帰・再挑戦を追う。人間が楽しいかは独立HUMAN試験でのみ判定。A/Dだけを長押しして路外へ落ちた場合も結果FAILを残す。
- ゲームとして意味のある選択・リトライが立証されたら、**DCC-FIRST・ART-FIRSTの一体3D世界／実走路の同時再著作**へ移行。K4CQ不合格岸壁の微修正、飾り付けQAやモデル量産は禁止。今後は少数集中・ユーザー操作最小。
- **安全条件不変**：正式ART採用0件、Slope2 DNA 0m、HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。main、正式P101、Draft PR #46、Gold、元Game/Road5/Camera、正式QA、凍結本番、親K4CR/K4CS研究枝を保護。追加支払0原則、Work/Computer Use、元原本、本番公開、正式採用、mergeはすべて個別事前承認。
