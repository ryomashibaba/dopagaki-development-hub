## 【2026-11-03 現行GPU真実CI — #41566784540】

- [現行K4AJ真正GPU CI #41566784540](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41566784540)：**現在 queued / K4AJ SOURCE GPU TECH未判定**。旧 #41565679177 は研究用独立監査を更新したpushにより**cancelled**、成功と記録しない。既存CIは見かけ上の正常起動だけではGPU深度の真実性を証明しないため、全100元source GPU frame+100B51群mask+100復元/100×11,176 samples/2真K4AF anchor/PNGを必須にする。
- **監査の健全性改善**：独立Pythonの5件のnegative controlsを架空の失敗を起こすだけの無関係な式から、**測定済みの本物のGPU元配列、mask配列、tickリスト、集計行、取得seqを1つずつ破損させ、元監査と同じ検証関数が必ず拒否する方式**へ置換。破損内容は(1)mask深度を元より近くする、(2)サンプル数11,176から1点欠けさせる、(3)実tick重複、(4)実depth変更サンプル集計値を+1偽造、(5)元→mask→復元の実seq連番を重複させる。実証後の結果だけPASS。
- 各source GPU時点の元描画→**B51全28体group**だけ除去→元描画復元は連続して3回GPU描画し、総計300回すべての`seq`が欠番・重複なし、同一元native tickであることを監査。元GPU個別B51 IDが確定したのはK4AG tick11280だけ。残98時点の物体別帰属と人間が認知した遮蔽時間は**不明**。
- 元Source/球/Camera/240Hz/B48 7/B51 28/衝突判定/本番/main/PR #46不変更、正式ART0件・Slope2 DNA0m、SAT/CCD/HUMAN/FPS/RELEASE/MERGE HOLD。今後は余計なresearch scriptの再pushによるCIキャンセルを避け、現行CIのログ・実Artifact SHA/CRC・独立監査結果を優先する。

---

## 【K4AJ研究QA改訂 2026-11-03：GPU実測完了前の独立監査を強化】

- **現行実行CI**：[GitHub Actions #41565679177](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41565679177)（この更新時点は`pending / queued`）。元CI #41562897854は、真のGPU完走より前に研究監査強化の新pushで**cancelled**。結果が無い旧CIをPASSと呼ばない。**100元GPU mask + 100元復元 / SHA/CRCは現時点では未検証**。
- **真実性の修正**：GPU maskは元`B51_BODY`全28体をまとめて無効化して深度比較するもの。幾何の追跡対象`p95-hazard-12`と、その時点のGPU寄与原因を混同してはならない。`p95-hazard-12`単体の遮蔽が確定したのはK4AGで真正GPU別検証した**tick11280×2幅**だけ。残りの測定tickは**個体別帰属UNVERIFIED**とJSON・CSV・独立監査へ明示した。別の99tick全体の単体ID判定を装わない。
- **新GPU証拠ゲート**：元ソースの`72` draw、B51 BODY全群除去の`44` draw、復元`72` draw、元深度とのサンプル11,176点全一致に加え、元→B51群抑制→復元という**3回×100時点=300件の本物の連続GPU取得要求seqを欠番・重複なしに監査**。両幅にまたがる番号の巻き戻りも拒否。独立負例5件（遠いはずのmasked depthが手前に出た偽サンプル、配列長欠損、native tick重複、集計の不整合、GPU seq重複）を必ず拒否。元Source・camera・物理・collision判定・ART閾値は変更していない。
- 本物の連続GPUが取得されても、その観測可能性は「指定した窓において`B51_BODY`一括抑制で非線形GPU深度サンプルが奥に変わったtick数・区間」に限定する。人間の認知で『映像が遮られて見えた時間』やプレイ安全性・ART採用とは**別検証/HOLD**。

---

# DOPAGAKI — K4AJ 元240Hz時点の真正B51 GPU遮蔽を連続窓で測る（ART HOLD）

記録日：2026-11-03 JST。研究のみ。**原ゲーム・物理・カメラ・B51配置・main・本番・Draft PR#46は改変禁止。**

## 前工程K4AIは確定SOURCE TECH PASS

- [K4AI GitHub Actions #41560614512](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41560614512) = **completed/success**。元source・カメラ・物理SHA固定、元K4Z 82PNG SHA照合、元K4AF GPU depth 14基準+14 B51群mask+14復元全サンプル一致、元K4AH14幾何/カメラ元関数再実行、2幅各721×計**1,442元native物理tick**の原`viewForPose`・`movingObstaclePose`・`sphereBoxSeparation`独立再計算、10改ざん負例PASS。K4AIは**幾何SOURCE TECH限定PASS**であって、連続GPUの遮蔽時間・SAT/CCD/HUMAN/FPS/ART/RELEASEはHOLD。
- [K4AI生Artifact #13198040646](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41560614512/artifacts/13198040646) ZIP **6,142,170 bytes**、SHA-256 `ea03e1b20484e5ad5761670c46ebec986df72216d7dd1d7bed8e03e9b3c8bd2f`、全**50件CRC PASS**。K4AI真正生JSON SHA `e04c9990ebc2573467e8d95cd3e497a7a6059a9f12384f46507c3c1dfdc0eb60`、幾何独立監査JSON SHA `aa90ac8ec214b1e9cdb5838137407a07bfe888970ed7c27c334b106b9a249beb`。
- 14m・47.25417秒 tick11341：元camera eye→`p95-hazard-12` OBB最短 **−0.9748613671m**、OBB内の真native tick11340〜11349計10tick、眼が表面から1m以内14tick=11338〜11351。元球→OBB最短+5.00882m。元Road5で非接地0tick。
- 28m・46.99167秒 tick11278：元camera eye→OBB最短 **+0.4478183666m**、OBB内部0tick、1m以内8tick=11277〜11284。元球→OBB最短+3.45585m。元`Runner.surface=null`かつ`grounded=false`31tick（**他の時点**）。`null`を架空のRoad5に置換しない。
- K4AG [#41552778225](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41552778225)で28m・47.0秒のB51群による真正GPU深度の大規模遮蔽5,972/11,176=53.436%は元sourceID `p95-hazard-12`の1体に一意に帰属。他27体の同時点の寄与0。これは**その1時点だけ**の観測であり、継続秒数ではない。

## K4AJの実装（独立研究ブランチ）

- 研究ブランチ：`research/k4aj-native-b51-gpu-depth-contiguous-window-20261103`。[真正GPU Playwright計測](../scripts/p101-r19a6p4r2f5k4aj-consecutive-native-gpu-b51.mjs)、[独立Python深度監査](../scripts/p101-r19a6p4r2f5k4aj-independent-consecutive-b51-depth-audit.py)、[専用GitHub Actions](../.github/workflows/p101-r19a6p4r2f5k4aj-consecutive-original-gpu-depth.yml)。
- 元のK4AI真正source 1442 native tickと元K4AF84 genuine GPUの生JSON SHAを固定。元K4Z82PNGも全件SHAと寸法照合。K4ADで成立した元WebGL2 meshと元vertex shaderのRGBA24深度FBOを**一切変更せず**使う。各時点の元球・元カメラは、必ずK4AIの同じtickの値に数値照合。元sourceのdrawを変えるのは**研究用mask`without-B51-bodies`を同期GPU再描画する瞬間だけ**。
- **14m ultra：11320〜11369（連続50tick=0.20833秒）**。この期間に幾何的OBB内部の10tickが含まれる。さらに元K4AFと完全一致が必要な真正既知GPU参照tick11280を1本追加。計51 GPU元フレーム/51 B51-mask/51復元。
- **28m control：11259〜11307（連続49tick=0.20417秒）**。元B51遮蔽53.436%が確定したtick11280を含む。計49元フレーム/49 B51-mask/49復元。
- 両幅合計**100元source WebGL2フレーム＋100本物B51-mask深度＋100深度復元**。native 1/240秒の刻みで49/50tickを**すべて実再描画**する。真のスクリーンショットは11280基準・窓両端・最接近tickのみ（両幅計8元画面、8 B51除去、8復元）で負荷を削減。監査は全100真GPUフレームの8px格子11,176点/枚で元深度とmask後深度を全点比較。B51群除去でより近い深度が発生しないこと、元へ戻した全11,176点が一致すること、元GPU 72 draws→B51除去44 draws/ B51 28 calls除外が原census通りであることを要求。11280は**K4AF真正元画面/元深度/B51群maskと全点一致**を必須にする。
- 集計するのはB51群マスクによるGPU深度差が**1点以上**あったnative tickの総数と、その連続区間（tick数÷240秒）、および各tick 11,176点中の割合。別指標「深度差10%以上」は探索的な表示のみで合否条件にしない。

## 重要な解釈の上限とARTゲート

- 同じtickでの`B51_BODY`全28元source GPU visual group抑制によって深度が変わったことを**GPU sampled-depth遮蔽**と呼ぶ。実物体IDの内訳はK4AGのtick11280だけで特定済みで、その他のtickについては28体のうち1体と決めつけない。
- **99連続tickは2つの離れた窓**であり44.5〜47.5秒全体を連続GPU測定したわけではない。window外の継続時間は不明。GPU深度1サンプルでも変化したtickの秒数は**原時刻間隔に対する測定区間**であり、人間が映像を見て遮蔽を認識する継続時間、240fps映像再生、ART受容率と同義ではない。
- 非線形GPU深度は物理mではない。照明/色/美術/主役性/障害物衝突・CCD/人体安全/実FPSは判定しない。旧K4/K4R/K4U ART REJECT、正式ART採用0件、Slope2 DNA認定0m、モデル/Collider新設0、SAT/CCD/HUMAN/FPS/RELEASE/MERGE全HOLD。本番公開不可。
- 元source blob `af076d67492a677d2235e4730aef8cdf4808e106`、元球半径0.65、240Hz、元Camera、B48道路7、B51障害物28、Gold/P100/W9-X/B5、main/2本番URL、元継続`p101-velocity-overdrive-native-trial`とDraft PR#46 OPEN未マージを維持。Work事前承認、PC/ZIP操作不要。

## 次の工程

K4AJ GitHub Actionsの**実run status・step logs・真正Artifact ZIP SHA/CRC・独立100個のB51 GPU mask**を確認。FAILなら原因を正しく調査し、元物理・カメラやART基準を緩和せず最小修正。SUCCESSなら遮蔽のtick区間・割合を確定値として記録し、元シーンの継続的な可読性/ARTを別ゲートで審査。**未完了のCIをPASSとしない**。
