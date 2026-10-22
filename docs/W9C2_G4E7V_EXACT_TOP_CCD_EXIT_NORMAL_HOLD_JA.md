# G4E-7V — 実CCD採択三角形の確定／実B48着地の局所形状研究

**基準：2026年10月23日 JST**。開発 `p101-velocity-overdrive-native-trial`、Draft PR #46。Gold/W7F/B5/本番/原作再現/mainを保護。非公開研究の正式Slope 2 DNA認定は **0m**。実装成功・自動完走は人間の公平性・面白さ・美術合格ではない。**HOLD**。

## 実衝突面が確定した

G4E-7U ONE53で確認された t=4.99583秒・第I実B48道路u≈0.599の31.42287m/s失速について、前研究の「近接top/edge」だけでは採択三角形の確証がなかった。

`scripts/p101-w9c2-g4e7v-exact-ccd-audit.mjs` は旧物理Runnerと**一時的に生成した観察のみを加える物理原本のコピー**を同じP96/4.8非人間研究操舵・240Hz・start00で動作させ、毎ステップの位置・速度・衝突数・接地・surface・statusを厳格に一致検査する。GitHub原本`private/reference_only/director/physics.js`は不変更、コピーはテスト後削除。

[Actions #39857631571](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/39857631571) **SUCCESS**。当該大接触の実採択三角形は **surface `p93-ABYSS_DIVE-01`、part=`top`、rideable=true**。normal=(-0.5078797,0.8459588,0.1625175)、法線方向速度除去は約67.31536m/s。速さ **87.70453→56.28166m/s**。赤い移動機械や側縁ではない。「固定衝突が物理規則に従い減速した」事実はゲームプレイとしての妥当性を証明しない。

## 9案の出口傾斜比較 — 幅と速度を維持

`scripts/p101-w9c2-g4e7v-exit-build.mjs` は**正式採用ではない**独立ONE53複製の第一B48ラティス行18–20のみ変更。実1セルの物理欠損・その他6道路・28B51-C機械はそのまま。路幅は第一道路の研究コア約13.6mを維持。追加の隠し床、橋、ブースト、速度リセット、ジャンプボタン、中央安全帯、カメラ変更なし。

[Actions #39858042382](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/39858042382) **SUCCESS**。正規240Hz start00 / 52m/s / 非人間P96脚本操舵 / リアルギャップでの第I路面再接地と全7道路比較：

| 案 | 第I出口の単一ステップ最大速度損失 | ギャップ後最低速度 | 自動の全7道路 |
|---|---:|---:|---|
| original ONE53 | 31.423m/s | 48.57m/s | 62.4083s FINISHED |
| exit2 | 3.339m/s | 84.29m/s | 70s超で未完走 (6道路) |
| exit4 | 4.740m/s | 86.33m/s | 第V道路で赤い動体に衝突 |
| **exit6** | **8.306m/s** | **83.14m/s** | **56.6583s FINISHED** |
| exit8 | 11.160m/s | 79.99m/s | 57.1958s FINISHED |
| incline2 | 3.386m/s | 86.60m/s | 第II道路で接触収束FAIL |
| incline4 | 0.869m/s | 85.38m/s | 70s超で未完走 (6道路) |
| slope4 | 3.082m/s | 87.63m/s | 第V道路で赤い動体に衝突 |
| **slope6** | **5.846m/s** | **84.72m/s** | **56.125s FINISHED** |

**暫定的な技術上の有望候補はSLOPE6、次点EXIT6。** SLOPE6の局所ショックの原型比削減は約81%、自動完走時間も約6.28秒短縮。いずれも**一度の研究用P96自動操舵による成功**であり、人間の試走成功率ではない。「速度が落ちないから面白い」とも未認定。速度を維持しても危険なコースにはできるため、次に視界と判断可能性を検証する。

## 高速での視覚QA

`scripts/p101-w9c2-g4e7v-camera-frames.mjs` は原型/exit6/slope6それぞれを正規start00 240Hzで実走させてt=4.8/5.0/5.4/6.0sの本物のpose・速度・固定相対カメラyawを保存。**同じ経過時刻の比較であり、3候補が同一世界座標にあるとは限らない**。

`web/drive3d.mjs` にlocalhost・`g4e7v=on&g4e7vFrame=hold`明示のみの非公開比較表示。HUDは検査spawn00の52m/sでなく**実記録速度**を表示する。GPU装飾・P100読路線・B5光学線が実物理の欠損セルに架空の橋を描画しないよう抑制。候補は公開ビルドに含めず通常メニュー・自己ベスト・通常手動監査から隔離。

Chromium 12画面・public漏洩防止の専用Workflow: [G4E-7V WebGL #39859726378](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/39859726378)。初回[#39859504698](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/39859504698)は「50m/sを下回った実速度を撮影拒否」という**証拠隠しに等しい検査条件**で失敗。後続コミットでは低速も実測どおり表示して比較対象に残す。静的QA結果と実視界審査はCI成果画像に基づいて判断する。

## 次の合否判定

1. 踏切約14m実幅、視界の中で欠損が見え、100m/s級で少なくとも約2秒の先読みが可能か。臨時景観や路面裏側がカメラを塞いでいないか
2. 高速で実着地し、速度方向・前方進行の回復が明確か。危険機械28基の適正配置と人間の操舵可能性
3. 原型Gold、その他の研究素材、実B48法則や固定相対カメラは書換えない
4. 人間の実プレイを未検証で正式認定距離を増やしたり、PRをready/mergeにしない。**HOLD / 0m**

