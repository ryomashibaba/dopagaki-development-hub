# K4AJ — GPU連続観測窓の元K4AIデータによる独立事前検証

2026年11月3日（JST）／**観測窓の選定だけSOURCE幾何確認済み。K4AJ実GPU結果はまだHOLD。**

## 証拠の固定

元データ：[K4AI真正SOURCE GEOMETRY TECH PASS CI #41560614512](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41560614512)／Artifact #13198040646。`K4AI_GENUINE_NATIVE_IN_RENDER_DEPTH_REPORT.json`のSHA256は`e04c9990ebc2573467e8d95cd3e497a7a6059a9f12384f46507c3c1dfdc0eb60`。ZIP実ファイルからこのJSONを抽出し、各`continuousNative240Hz.records[]`の`nativeTick`/`originalRoad`/`originalSourceGrounded`/`originalStatus`/`signedEyePointToOBBMeters`/`eyeInsideOBB`をプログラムで再集計。元K4AI本実走行CIに加え[SHA固定の独立再実行CI #41561002955](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41561002955)も**completed/success**。

### 2つの実験窓は、元物理の連続tickとして成立

| 元240Hz幾何 | ultra (14m) | control (28m) |
|---|---:|---:|
| 元native tick窓 | 11320〜11369 | 11259〜11307 |
| 同じtick幅での連続サンプル数 | **50** | **49** |
| 対応する元ゲーム秒 | 47.166667〜47.370833秒 | 46.912500〜47.112500秒 |
| 観測開始 eye→OBB表面 (m) | +14.311817 | +14.176439 |
| 観測終了 eye→OBB表面 (m) | +14.658301 | +14.302294 |
| 眼→OBB最短 (m) | **−0.974861** | **+0.447818** |
| 眼→OBBが10m以内の連続tick | **11326〜11363：38tick** | **11265〜11301：37tick** |
| 眼→OBBが1m以内の連続tick | 11338〜11351：14tick | 11277〜11284：8tick |
| eyeが元OBB内部にある連続tick | 11340〜11349：10tick | **0tick** |
| 球表面→OBB最短 (m) | +5.008817 | +3.455851 |
| sourceの路面分類 | 全50tick `p93-PRISM_CREST-01` | 全49tick `p93-PRISM_CREST-01` |
| 元source接地／状態 | 全50tick grounded=true/running | 全49tick grounded=true/running |

- 眼→OBBが10m以内の区間の**前後にはそれぞれ6tick**余白がある。少なくとも`眼→OBB≤10m`という幾何条件の開始と終了は、この2窓の内側で正しく包含される。したがって元28mの窓外で存在した31tickの`Runner.surface=null`状態は、この選定窓には含まれない。ただし窓外のGPU視認性は未検証。
- この幾何窓検証が**物体GPU遮蔽率の変動が10m以内でのみ起きるという意味ではない**。遮蔽はさらに遠くでも起こり得るので、そのためのGPU時間を現時点で推論しない。
- 元GPU深度遮蔽を確認できているのは、[K4AF真正7tick×2幅](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41472149272)および[K4AG個別B51-12判定tick11280](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41552778225)の実測のみ。K4AJで新たに**99個の各真source tickをGPU depth readbackしてから**、それらのGPU遮蔽区間を計算する。

## 参考：元K4AFが確定した離散7時点の本物のB51 GPU深度差

K4AF #41472149272の**元Source本物のGPU深度8px格子11,176点**を再計算した（B51_BODYだけ非描画したときのfarther sample件数）。離散7点の値はK4AJで新たに測る中間時刻を推論できないため、特に14mの47.254秒は**未測定のまま**と区別する。

|元native tick|元秒|14m B51 BODYによるGPU深度差|28m B51 BODYによるGPU深度差|
|---:|---:|---:|---:|
|10680|44.5|12 / 11,176（0.1074%）|26 / 11,176（0.2326%）|
|10800|45.0|38（0.3400%）|146（1.3064%）|
|10920|45.5|125（1.1185%）|7（0.0626%）|
|11040|46.0|10（0.0895%）|14（0.1253%）|
|11160|46.5|46（0.4116%）|149（1.3332%）|
|11280|47.0|53（0.4742%）|**5,972（53.4359%）**|
|11400|47.5|3（0.0268%）|10（0.0895%）|

**重要：** K4AIで14mの眼がOBB内部に入る47.254秒は、この7つのGPU観測時点の**どれにも含まれない**。したがって14mのOBB内部10tickにおけるB51真GPUの画面寄与はこの表からは**わからない**。K4AJの50連続真GPU実測が必要。一方28mの47.0秒はK4AFとK4AGで真GPU大面積遮蔽と元ID`p95-hazard-12`への帰属が確定している。

---

## 実装・審査への固定注意

- `signedEyePointToOBBMeters`が負でも衝突バグの証明ではなく、**cameraと元OBBがその瞬間に幾何的に交差**している事実だけ。
- K4AJの元60fps画面やスクリーンショットを240fps実描画と呼ばない。元Runnerの**物理時刻1/240秒ごとの元mesh GPU深度再描画**が観測対象。
- 対象の`B51_BODY`全28体のグループmaskは本物の元描画、ただし元GPU真IDの因果帰属はK4AGのtick11280だけ。K4AJ窓内の他のtickのGPU遮蔽をすべて`p95-hazard-12`1体に帰属させない。
- 元Source Blob`af076d67492a677d2235e4730aef8cdf4808e106`、本番・main・Draft PR#46、元カメラ/球/240Hz/B48 7/B51 28/衝突判定すべて不変。旧ART REJECT、正式採用ART0件・Slope2 DNA0m、SAT/CCD/HUMAN/FPS/RELEASE/MERGE HOLD。

K4AJ真GPU専用CI：[Actions #41562897854](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41562897854)（2026-11-03調査時点：queued/pending）。本工程のSOURCE GPU TECH合否・K4AJ Artifactはまだ未確定。
