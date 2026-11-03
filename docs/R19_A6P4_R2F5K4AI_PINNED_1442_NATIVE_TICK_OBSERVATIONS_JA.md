# K4AI — 真正1,442 Native Tick の独立生データ観察（SOURCE TECH HOLD）
2026-11-03 JST。根拠：GitHub Actions失敗run #41559179613の実Artifact #13196762115。これは**成功レポートではない**。

## 確認した事実

- ZIP SHA256 `213fd11a78d4785683081fd1d6ee617b01c8ecaaab2227afff4280d80ff6c502`、46エントリすべてCRC正常。
- 真のChromium生JSON `K4AI_GENUINE_NATIVE_IN_RENDER_DEPTH_REPORT.json` SHA256 `e04c9990ebc2573467e8d95cd3e497a7a6059a9f12384f46507c3c1dfdc0eb60`。14m/28mの両条件でnative tick10680〜11400を**1件も欠かさず721時点ずつ**確認。元`Runner.status='running'`、元`p95-hazard-12`のsource IDが全件一致。
- K4AH元Source生Artifact `K4AH_GENUINE_NATIVE_IN_RENDER_DEPTH_REPORT.json` と同一の真source tick7件×2幅の球表面→OBB、眼→OBBの距離をそれぞれ数値差1e-8未満で比較成功。これは生JSON項目の**数値一致**であり、全1,442件で元Camera/OBB関数を独立再実行した判定ではない。

|生データ幾何指標|14m (ultra)|28m (control)|
|---|---:|---:|
|カメラとOBBの最短符号付き距離|−0.974861367m|+0.447818367m|
|最接近native tick|11341|11278|
|最接近時刻|47.254167s|46.991667s|
|カメラがOBB内部のtick数|10|0|
|眼→OBB符号距離≤1m|14tick|8tick|
|眼→OBB符号距離≤2m|17tick|16tick|
|眼→OBB符号距離≤5m|25tick|25tick|
|眼→OBB符号距離≤10m|38tick|37tick|
|ボール表面→OBB最短距離|+5.008817487m|+3.455851384m|
|元`runner.surface=null`時点|0|31tick|
|元`runner.grounded=false`時点|0|31tick|

14mの眼→OBB内部10tickは`11340〜11349`、眼→OBB≤1mは`11338〜11351`。
28mの眼→OBB≤1mは`11277〜11284`。28m元`runner.surface=null`と非接地は同じ次の**4つの分離区間**：`11345〜11351`（7tick）、`11354〜11362`（9tick）、`11364〜11372`（9tick）、`11375〜11380`（6tick）。合計31tick=0.129167秒分の元物理サンプル。間隔の連続性を偽装して、ひとつの31tick連続区間とは呼ばない。

14mのsource路面は全721tick `p93-PRISM_CREST-01`。28mは同路面690tick+元`null`31tickである。各source状態はそのまま報告し、nullをRoad5接地に補完しない。

## 方法上の限界・決定

1. 上記は**元240Hz幾何座標の時系列**。眼→障害物0m付近でも、本物のGPU深度遮蔽の何%が何秒間続くかはこの資料だけではわからない。K4AFの元GPUマスクは7tick×2幅のみ。人間の視覚・ARTの合否、物理衝突異常・SAT/CCD/安全性も未認定。
2. [旧CI #41559179613](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41559179613)は最終独立監査でJSONの誤フィールド名を参照して**FAIL**。この資料は失敗を上書きしない。
3. 修正済みの元Code関数1442件のSHA固定独立再監査は[Actions #41561002955](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41561002955)、元Chromium全面再実行は[Actions #41560614512](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41560614512)。いずれも**最終結果の確認が必要**。完成扱いしない。
4. 原Source blob `af076d67492a677d2235e4730aef8cdf4808e106`、元球/Camera/240Hz/7 B48/28 B51/main/本番2URL/Gold/P100/W9-X/B5/Draft PR#46不変更。正式ART採用0、Slope2 DNA 0m、新モデル/Collider0、RELEASE/MERGE HOLD。

次の正当な研究K4AJは元GPUで連続的にB51単体描画を除去した遮蔽率を、真正同一240Hz tickで比較する。元ゲームの描画・コリジョン・カメラを変更しない。
