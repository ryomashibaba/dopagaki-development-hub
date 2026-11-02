# DOPAGAKI — K4AE 真正GPU深度の時系列・画面領域診断（ART HOLD）

基準日 2026-11-02 JST。**K4ADは元画像・GPUの限定技術検証が成功。次のK4AEでデータにない事実を補間・創作しない。**

## 入口・固定経路
- GitHub正本：`ryomashibaba/dopagaki-development-hub`
- この研究ブランチ：`research/k4ae-verified-road5-depth-temporal-diagnostics-20261102`。研究継続元はK4AD `fa5541055f967eaa12a616a7c2d76ea930aea4c1`。
- K4AD確定した実CI：[Actions #41463872981](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41463872981) = **completed / success**。元コードの描画72件/240Hzの物理・カメラ不変、元K4Z真正PNG82枚SHA、Road5の2幅×7tick計14画面のHUDを除く3D全画素一致、元GPUメッシュのRGBA24深度14/14成功、同一元球姿勢の6mask×2幅計12/12成功、描画source census・farther-only・mask解除後depth11,176サンプル完全復元。これはSOURCE TECH限定であり、ART承認ではない。
- 確定Artifact [#13150624075](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41463872981/artifacts/13150624075)。ZIP **3,656,890 bytes**, SHA-256 `0004cb8081e290289734a182ff0fe484d953fc892fb70818eec5f6fbfbf09504`、全30エントリCRC-PASS。生データ `K4AD_GENUINE_NATIVE_IN_RENDER_DEPTH_REPORT.json` SHA-256 `537346d1df0afb8c2ba1f0b2581d088dfeae3711a2b27021c199d72800d2d0ad`、独立監査 `K4AD_INDEPENDENT_GENUINE_SOURCE_GPU_AUDIT.json` SHA-256 `edf9a2e1ad20f30e186a0fe708a163f78e3935c489d45054fd273ab342d3f826`。
- K4AE専用CI：[Actions #41466588681](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41466588681)。旧Artifactの固定ソースJSON2件だけをダウンロードし、SHA照合・独立再監査・時系列出力をGitHub Actionsで実施。報告時点で **queued / 実結果待ち**。
- [K4AE解析プログラム](../scripts/p101-r19a6p4r2f5k4ae-pinned-depth-temporal-audit.py)、[専用Actions](../.github/workflows/p101-r19a6p4r2f5k4ae-source-depth-temporal.yml)。

## K4AE研究が必要な理由
単一46秒での元メッシュmask寄与を7時点×2幅の視線深度分布へ延ばす。すでに取得した本物の元深度14画面には、無マスクの深度11,176点/画面が存在するが、遮蔽マスクについては**46.0秒の12条件だけ**。7時点分の巨大建築マスク別の視認率を推論することは禁止。

独立深度は`gl_FragCoord.z`を24bitで符号化した0〜16,777,215の**非線形値**。物理距離メートルに換算しない。最大値16,777,215はfar clear相当であり、空洞や自由空間の意味に直結しない。**WebGLの readPixelsの座標原点は左下**。配列最初の行は原スクリーンショットの上端ではなく下端。前景を上下反転して分析すると誤判定する。

固定Artifactの独立数値再解析の一例：control (28m) tick11280（47.0秒）では24bit下半分の深度サンプルが3,302 / 11,176個、GL下端から26行は127列全て該当。他13枚では0。元のRoad5画面の大きな画面下部前景と整合しうる。**これだけでカメラ不具合や接触判定/床の成立/造形の美しさは分からない。**

## 今回の実装・出力
新[Python研究監査](../scripts/p101-r19a6p4r2f5k4ae-pinned-depth-temporal-audit.py)は以下を完全固定して調べる。

1. 前段確定Artifactの生データと独立監査それぞれSHA256を再計算し、変更があればSTOP。
2. 82原PNG+14元3D一致+深度14フレーム+mask12点、物理/カメラ/本番不変、ART HOLDと元3D画素差0を独立再検査。
3. 2幅×7tick（44.5,45,45.5,46,46.5,47,47.5秒）で、far sentinel数・24bit符号化値の分位数・下半分の画面bottom/middle/top分布・中央矩形深度変化を出力。値の単位は符号化整数。特定の場所の距離/物体ID/可視建築の割合とは断言しない。
4. 46.0秒の元72drawから6maskのsource draw数への再照合、depthがnear方向へ変わることを禁じる。元へ復元のdepth全11,176点一致を要求。
5. 欠損点/24bit範囲外/意味のない全一様値/架空の物体IDフラグへの**4件の負例**を用意し、不正確なデータならFail。
6. JSON + 日本語MarkdownレポートをArtifactへ保存。GitHub専用CIのみ使用。ユーザーのPC操作不要。

## 変えないこと
**元ゲームSource blob `af076d67492a677d2235e4730aef8cdf4808e106`、元球・240Hz物理/カメラ/B48道路7/B51動体28、Gold/P100/W9-X/B5/main/本番URL一切変更しない。** K4/K4R/K4Uの旧ART REJECT継承、正式ART採用0件、Slope2 DNA認定0m、モデル/コライダー追加0、SAT/CCD/HUMAN/FPS/RELEASE/MERGE全HOLD。元継続ブランチ`p101-velocity-overdrive-native-trial`、Draft PR #46 OPEN/Draft未マージのまま。新K4AEのTECH診断を人のART合格に置換しない。Work事前承認が必要、ZIP再提出・ローカル操作不要。

## 次工程
Actions #41466588681の**実際の結果・ログ・JSON/MD Artifact SHA/CRC**を監査し、不合格なら失敗原因を修正（安全閾値緩和は禁止）。合格した場合のみ、元Road5の別tickでも真GPU遮蔽群maskを再測定する計画へ進むか、ART-FIRST人間評価へエビデンスを引き継ぐ。固定時点以外のART可視率は未測定のまま。
