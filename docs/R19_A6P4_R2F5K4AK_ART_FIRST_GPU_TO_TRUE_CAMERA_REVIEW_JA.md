# DOPAGAKI K4AK — Road5真正GPU証拠からART-FIRST設計審査へ接続する独立ゲート

2026-11-03 JST。**K4AJが成功したときだけ使う、非干渉の次工程。現時点でART採用0件／Slope2 DNA 0m／公開HOLD。**

## 目的と実装済み範囲

- [コード](../scripts/p101-r19a6p4r2f5k4ak-art-first-review-packet.py) はK4AJが生成した `K4AJ_INDEPENDENT_99_CONTIGUOUS_SOURCE_GPU_MASK_AUDIT.json` と `K4AJ_100_REAL_SOURCE_GPU_DEPTH_MASKS.csv` を**読取専用**で突合し、将来の真正同一sourceカメラA/B撮影要求をJSONで出す。
- 独立監査の契約（元GPU 100、B51全28体mask 100、復元100、連続native 99tick、K4AF元tick11280×2アンカー、300連続GPU seq、11,176点／原draw 72→44→72、未知の個別ID帰属）に構造上の矛盾がないか確認する。K4AJの元ZIP SHA/CRC・真正GPU depth全配列の**再監査の代替にはならない**。
- カメラ審査要求は**15本**：14m ultra 11320/11326/11338/11341/11349/11351/11363/11369、28m control 11259/11265/11277/11280/11284/11301/11307。これらは「今撮影済みの15枚」ではない。**元RGB、候補RGB、コライダー、実人間の遮蔽時間は未取得**である。
- このコード自体はモデルを作らず、描画・物理・カメラ・source・B48×7／B51×28を変更しない。元source Git blob `af076d67492a677d2235e4730aef8cdf4808e106` 固定。main／PR#46／本番URLへの変更禁止。
- `--self-test` は**合成fixture**だけに対する不正ART採用、人間遮蔽秒数の捏造、元K4AFアンカー改変、tick重複、seq重複、未検証個体ID帰属、集計改変の7つを拒否する。**真GPU検証PASSの証拠ではない**。

## ART-FIRST候補：Road5《斜裂公共峡谷 / Inhabited Civic Rift》1方向のみ

過去のK4/K4R/K4Uは、物理的に開いた中庭の3D形状があっても、原カメラでは巨大A5骨組みと薄い屋根・床に埋没し、公開都市空間として読めず、ART REJECT。これを同じ屋根の増築や小刻みな位置移動で繰り返さない。

**研究構想（未制作）**：Road5の高速道路を大きな公共構造の主役として、道路脇に互いに非対称な2つの厚い斜行建築量塊を配置し、その間に上方へ貫通する**一続きの大公共峡谷**を確保。公開床への入口→中間の回遊テラス→奥の明るい都市広場の**3つの独立した空間層**を、同じ元カメラの真正RGBで識別できる構図にする。B51の28体を隠す大装飾や、カメラを追従補正して見やすくする小細工は禁止。

**造形開始ゲート**：K4AJ原GPU artifactのSHA/CRCと100ケース独立再監査を優先し、元Road5の真正RGB（対象15tickの中で不足するものは不足と表示）・カメラEye/Front・ball pose・前景道路・既存A5・B51描画を固定して、候補1件だけの原カメラA/Bを組めること。巨大峡谷の入口/中段/奥行きが画面中で時間的に読めない場合は、造形や装飾追加を進めない。寸法・位置は真正カメラと既存A5/B48/B51安全隔離に基づき後決定し、推定の見た目だけで新モデルを作らない。

## 別々の合否ゲート

1. **SOURCE GPU**：K4AJ真元ZIP SHA-256/CRC・GPU生配列・capture seq・復元・K4AF元アンカー・99 native tick。K4AKはこのゲートの再認定不可。
2. **真正RGB/ART**：新候補の同一240Hz元pose、同CameraEye/Frontのsource/candidate両PNG、真正WebGL2、入口・中間・奥の意味的可読性、独立美術審査。差分ピクセル面積のみでPASS不可。
3. **HUMAN/GAMEPLAY**：実操作・B51判読・速度/舵可読・危険性を人間実走で確認。GPU深度サンプルのtick数÷240は「人間の遮蔽秒数」でない。
4. **SAT/CCD/支持・FPS**：新モデルの真正7道路/B51×28×両幅/全走行安全と実Windows/iPhone FPSを独立検査。現段階はすべてHOLD。
5. **RELEASE/MERGE**：正式ART0、Slope2 DNA0m、公開・main・PR#46無変更。Work使用は事前承認制。

## ローカル/CIによる非破壊検証

```bash
python3 scripts/p101-r19a6p4r2f5k4ak-art-first-review-packet.py --self-test
# K4AJ truly verified artifacts are available only after actual CI success:
python3 scripts/p101-r19a6p4r2f5k4ak-art-first-review-packet.py \
  --audit r19-evidence/r19a6p4r2f5k4aj/K4AJ_INDEPENDENT_99_CONTIGUOUS_SOURCE_GPU_MASK_AUDIT.json \
  --csv r19-evidence/r19a6p4r2f5k4aj/K4AJ_100_REAL_SOURCE_GPU_DEPTH_MASKS.csv \
  --out r19-evidence/r19a6p4r2f5k4ak/K4AK_ART_FIRST_REVIEW_PACKET.json
```

**現状**：真GPUのK4AJ実測結果をまだ読み込めていないため、K4AKの実Artifactへの適用結果は**UNKNOWN / HOLD**。K4AKを制作物やART採用と数えない。K4AJのCIがqueued/runningなら対象script/workflowを追加pushしてキャンセルしない。K4AKは異なるファイル名・独立工程であり、K4AJのpaths-filterとconcurrencyを乱さない。
