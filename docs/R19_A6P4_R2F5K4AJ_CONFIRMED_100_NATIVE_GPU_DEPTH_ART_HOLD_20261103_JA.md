# DOPAGAKI K4AJ — 本物の100元GPU深度＋99 native tick 窓の完了・再検証報告

**2026-11-03 JST。ART-FIRST／SOURCE GPU TECH限定PASS、正式ART採用0件、Slope2 DNA認定0m。** 本報告はGitHub Actions実runとダウンロードしたArtifactを根拠とする。元source・Camera・240Hz物理・球・B48道路7・B51動体28・main・本番・Draft PR #46は変更しない。

## 1. 最終CI・真正Artifact

- [GitHub Actions #41566784540](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41566784540) は **completed/success**。計測対象commit `80897e4ea226e8f0128f33795e2d176f8fda0630`、真正Chromium同期GPU capture・独立Python監査・Artifact uploadの各ジョブステップ完了。
- [Artifact ID 13201661563](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41566784540/artifacts/13201661563) は実際に独立ダウンロードしたZIP **11,959,523 bytes**、SHA-256 `60aab331d8881b5f8f456539c00566837a2b061a96ab0725ce7c17ea91ed8efb`。**28 ZIPメンバーCRC全件PASS**（`ZipFile.testzip()==None`）。
- 元生 `K4AJ_GENUINE_NATIVE_IN_RENDER_DEPTH_REPORT.json`、生100行CSV、独立JSON、研究MD、**8元時点×元RGB/B51 group mask RGB/復元RGB=24 PNG**を含む。PNGは各バイト数・SHA-256とメタデータ一致、元RGB→元復元RGBは8組すべて**バイト一致**。
- 元source Git blob `af076d67492a677d2235e4730aef8cdf4808e106`、K4AI生JSON SHA-256 `e04c9990ebc2573467e8d95cd3e497a7a6059a9f12384f46507c3c1dfdc0eb60`、K4AF生JSON `016c28bf4fafa50748d8083496a81a5d66732540c0c3b50e863a7c39cfaddf26`。
- 独立した二度目のローカル解析で、実ZIPの100時点それぞれの**元GPU 11,176点・B51群除去11,176点・復元11,176点**全配列を読み、元への100/100完全復元、maskでより近い深度に変化0、元72→除去44→復元72 draw、全300 capture seq連番、CSV全100行、window集計・割合を再計算し、Artifact内の独立監査JSONと全て一致。

## 2. 本物のGPU深度格子におけるB51群の寄与（観測窓だけ）

|比較|14m ultra|28m control|
|---|---:|---:|
|計測native tick|11320–11369（50連続tick）|11259–11307（49連続tick）|
|元/mask/復元のケース|51（窓外11280参照を含む）|49（11280は窓内）|
|B51群を除くと深度が遠くなるサンプル1点以上のtick|**39 / 50**|**38 / 49**|
|該当tick数÷240秒|**0.162500秒**|**0.158333秒**|
|該当連続tick範囲|11320–11350（31）、11362–11369（8）|11259–11288（30）、11300–11307（8）|
|11,176サンプルのうち深度変化10%以上のtick|22（11329–11350）|18（11269–11286）|
|深度変化最大|**11,176/11,176＝100%**（tick11339 / 47.245833秒）|**6,396/11,176＝57.2298%**（tick11277 / 46.987500秒）|
|元K4AG個体別原因を独立検証済みの参照|11280：53/11,176|11280：5,972/11,176（原因元ID `p95-hazard-12`）|

14m tick11341の真正元RGBでは大きな紫色系の元B51形状が画面の大部分を覆い、同一source tickのB51_BODY全群描画除外画像では道路の輪郭が再び見える。28m tick11278の元RGBでも下部が元障害物形状に隠れ、群除外画面との明確な視覚差がある。**これらは静止画での観察に限定**し、遮蔽継続秒数・人間反応・安全性・ART品質の評価ではない。

## 3. 誤解・過剰認定の禁止

- `B51_BODY_ALL_28`全群を一時描画除去した**非線形GPU深度8px格子**の変化。単体`p95-hazard-12`への帰属は元K4AGで証明したtick11280×2幅に限る。最大11,176点変化のtick11339の**単体原因はUNKNOWN**。
- 39/50や38/49、およびtick数÷240秒は**「この特定の短い観測窓で何tick深度変化があったか」**であり、映像の人間視認遮蔽時間、画面の真の物体画素占有率、衝突、失敗率、ART認定ではない。窓の外の時間はUNKNOWN。true 240Hz物理tickであり、リアルタイム240fps再生を証明しない。
- K4AJで新しく制作したART候補モデル・Colliderは0。世界水準のRoad5都市造形・入口→中段→奥の公共空洞は未制作。**ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGEはHOLD、正式ART採用0件、Slope2 DNA0m**。旧K4/K4R/K4U ART REJECTを変更しない。

## 4. 次工程（ART-FIRSTで技術調査を終える方向）

1. K4AJの真正生Artifactを固定し、実測値の再計算と元RGBの出所を監査可能な1つのARTレビュー資料へ接続。K4AK要求15RGB時点のうちK4AJが持つ6と、K4ALが特定した残り9を区別する。
2. K4AK→K4ALの**実Artifact適用**、K4AM真正残り9元RGB追加の実CIを独立判定。未完了runをPASS扱いしない。
3. Road5《斜裂公共峡谷》は**未制作の1候補構図方向**に留め、原B51を隠す装飾やカメラ変更はせず、静止元sourceの遮蔽証拠を踏まえ「道路の危険サインと公共空洞の3空間層を同じ元カメラで読み取れるか」を候補側本物のWebGL2 A/Bで検証する。偽のART採用・大量モデル制作を禁止。
