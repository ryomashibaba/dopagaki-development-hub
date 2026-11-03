# DOPAGAKI K4AP — 真正GPU深度の画面三区分から「危険と都市」を時間的に分離するART-FIRST構図

基準：2026-11-03 JST。**独立SOURCE GPU TECH限定PASS／候補新造形0／ART正式採用0／Slope2 DNA認定0m。**

## 今回実行した作業

真正K4AJ [Actions #41566784540](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41566784540) の実ダウンロードZIP（Artifact #13201661563、11,959,523 bytes、SHA-256 `60aab331d8881b5f8f456539c00566837a2b061a96ab0725ce7c17ea91ed8efb`、ZIP 28 member CRC全PASS）を**二度目の独立空間分布解析**に使用した。

[独立Python解析器](../scripts/p101-r19a6p4r2f5k4ap-real-b51-gpu-camera-beats.py) は、同source球・同Camera・同native tickでB51 BODY全28体描画のみを除去したGPU深度の元/mask/復元全生配列を再読込する。各元画像1013×698に対し元WebGL2ソースに記載の `for(y=0;y<h;y+=8)for(x=0;x<w;x+=8)` ループで取り出す**127×88＝11,176点**を、横方向だけ `left x=0..41`、`center 42..84`、`right 85..126` に分解。座標yはOpenGL由来の下起点だが今回上下評価しない。CSV元100件の深度増加数、元復元GPU完全一致、原72→mask44→原72 drawと照合。真ZIP SHAは違えば処理を拒否する。

**実ローカル検証**：同一真正ZIPから14m 50連続tick＋28m 49連続tickを全件再計算し、新しいK4AP `K4AP_CAMERA_ZONE_REAL_AUDIT.json` 生成PASS。既存のK4AJ全画面集計との整合を再確認した。モデル、元ゲーム、main、本番への変更はゼロ。GitHub保存版K4AP単体のCIはまだ走らせておらず、SOURCE独立データのローカル再演算PASSと区別する。

## 画面三区分におけるB51「群のGPU深度寄与」

横三区分の全元tick×深度格子セルで、B51全群を除くとGPU非線形深度が遠くなるケースの割合。**人間の視界が遮られた面積／時間／操作不能率とは違う。**

| 原幅と連続元native窓 | 左 | 中央 | 右 |
|---|---:|---:|---:|
| 14m ultra tick11320–11369（50tick） | **23.474%** | **34.400%** | **31.885%** |
| 28m control tick11259–11307（49tick） | **9.635%** | **20.407%** | **16.108%** |

- **14m tick11339–11347の9連続tick**は11,176/11,176点、**左・中央・右の元GPUサンプルすべてでB51全群除去による深度差**。11339と11341の真正元カメラ映像が人間に完全な障害物遮蔽を呈した秒数を意味しないし、単体障害物の犯人が判明したわけでもない。
- 14m tick11351–11361の**11連続測定tick**では、群maskによる深度差が0/11,176。28mはtick11289–11299で同様にゼロ。これは「群除去による深度差が検出されなかった」という観測値に限り、**新建築が見える・建設可能・衝突安全の証明ではない**。
- 14m tick11320：B51群の深度差が**中央約10.333%**、左右0%。14m tick11326：左0%、中央約18.367%、右約0.947%。28m tick11259：左0%、中央約9.646%、右0%。序盤の真正画面に危険の可読性を保つ余地がある**可能性**を示すが、対象新ARTがまだ無い。
- 新都市美術が危険障害物と同じ前景で画面占有率を奪い合えば、K4R/K4Uと同じ認知失敗を繰り返すおそれがある。**高深度変化tickを「公共都市建築が主役として読める瞬間」と誤認しない**。

## ART-FIRST：1方向の真新しい構図仮説へ

**研究題名：Road5《斜裂公共峡谷 / Inhabited Civic Rift — TWO BEATS》。** 旧K4/R/Uの小屋根・低い段床・二個箱・巨大一枚壁・駅舎風連棟の反復は禁止。さらに元ゲームの危険B51を隠す、細くする、Cameraを動かす、球速を低下させる、元B48道路や物理を修正することは禁止。

1. **Beat A — 危険より前に一瞬で読める都市の主輪郭**：原Road5の前景道路沿いに、原A5骨組みとは別の巨大で非対称な都市量塊を一対配置したように見せるが、中央を跨ぐ巨大門・一枚壁にはしない。都市側に実際の広い開放口と、入口として読める大きな立体床が存在する構造を初めから設計。装飾のRGB輝度で隙間を捏造しない。
2. **Beat B — 危険通過後に奥の人間的な公共空間を露出**：中段の立体テラス、遠景の都市広場へ続く**同じ一つの公共空洞**が、右/左への小窓の集合ではなく大きい連続した開口として見える構図。危険の真正スクリーン領域では原B51の姿とステアリング手掛かりを優先し、新建築の見え方を無理に稼がない。
3. **原画と候補の実立体比較を条件にする**：まずK4AMで不足9時点を真正取得し、K4ANの本物の画像監査を完了する。候補1件をBlender-native editable GLBとして造る際には、元の同一240Hz source ball/Cam Eye/Frontを2幅×複数時点で比較し、入口→中段→奥の意味が自然に読めるか独立審査。静的投影プロキシやdepth %でART PASSしない。
4. **再生時間を捏造しない**：K4APの源データは14m 50tick／28m 49tickの**短い窓に限定**。実人間に十分な認知時間があるかは現データでは**わからない**。実際の元Camera、元B51描画を保持した候補連続WebGL2走行と人間審査が必要。
5. **見栄えが劣るなら早期ART REJECT**：候補モデルのB48/B51 7道路×2幅SAT／CCD、床支持、人間歩行、Windows/iPhone FPS、本番公開はその後。造形部品数や投影面積が増えたことは成果の基準にならない。

## 現状と次工程

- K4AJ SOURCE GPU TECH真正PASS。K4AK [#41568787273](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41568787273) の合成自動検査が **completed/success**。本物K4AJ生Artifactに対するK4ALのRGBカバレッジとK4AN比較PNG生成は**ローカルでPASS**。
- K4AM [#41571299893](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41571299893) とK4AN [#41572736850](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41572736850) は本報告前の最終照会時点で queued。成功Artifact0件。**新CIの大量起動・K4AJ再計測をしない**。
- 新候補モデル/Collider0、ART正式採用0、Slope2 DNA認定0m、HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。凍結元source blob `af076d67492a677d2235e4730aef8cdf4808e106`、元球半径0.65m／240Hz／B48道路7／B51元障害物28、main、本番URL、Draft PR #46は変更しない。Workは事前承認。
