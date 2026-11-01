# DOPAGAKI SLOPE K4U — 旧K4Rの実建築形状を固定しRoad0位置のみ移動：真正WebGL2再審査

**2026-11-02 JST、GitHub正本のみ、Draft PR #46、`p101-velocity-overdrive-native-trial`。** K4/K4R同一地点の独立ART REJECT、K4S全42真正元カメラと元A5 BVH遮蔽位置研究、K4T真正元WebGL2近似代理枠の独立技術PASSを継承。正式ART採用0件、Slope2 DNA0m。

## 1. なぜこの一件のみ実制作するか

K4T [真正原A5×2地点の注釈画像審査](R19_A6P4_R2F5K4T_TRUE_SOURCE_WEBGL2_SITE_OVERLAY_REVIEW_JA.md) は元建築BVH遮蔽を減らす`u=.85/right+70m`について、元カメラ4時刻×2幅の映像構図改善の可能性と、前半投影面積が小さくなるという**トレードオフ**を示した。代理箱の差では既存K4R実造形が街区として認識可能か分からないので、**新しいデザインを一切起こさず、既存の34モジュールを本物のBlender 3Dとして位置だけ動かして撮影する**。次の別建築・同時量産は禁止。

## 2. 保護と実装

- **凍結元形状の正本**：[K4R-market 34モジュール原コード](../scripts/p101-r19a6p4r2f5k4r-open-market.py) Git blob `e653029771982b2c39ee2831ea19199f0704ddaa`、**新K4Uの独立建築モデルファイルは作らない**。
- [K4U Blender移設](../scripts/p101-r19a6p4r2f5k4u-relocated-placement.py) はK4R形状関数に代替`frame(site,.85)`を渡すだけ。元モデルの`u=.75`呼び出しと`road=0/side=right`を厳格照合。K4Rの**34モジュール/668面と原10,566→新11,902三角形**、使用面・材料・ロフト断面は変えない。元A5 5独立メッシュのみへ追加する。
- [private pack](../scripts/p101-r19a6p4r2f5k4u-private-pack.mjs)、[真正WebGL2 16PNG](../scripts/p101-r19a6p4r2f5k4u-true-original-webgl2.mjs)、[K4U専用CI](../.github/workflows/p101-r19a6p4r2f5k4u-relocate-exact-road0-market.yml)。[Actions #41359514124](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41359514124) が原source SHA、K4R固定モデルGit blob、Native Blender4・BLEND/GLB×14/28m・GPU読戻を確認後に、**14m/28m×原A5/移設K4U×tick265/721/1057/1249 = 16 PNG**を元240Hz真ゲーム・元カメラで撮影する。
- **元物理240Hz・球・左右操舵・自然ジャンプ・B48 7・B51 28・元カメラ、元Blender A5、旧K4R原本、main/Gold/P100/W9-X/B5/本番2URL変更禁止**。新コライダー0。新3Dを研究証拠とすることと正式ゲーム統合は別物。

## 3. 判定条件（勝手に採用しない）

元A5 PNGとK4Uの16枚の原画像SHA実物一致・元球XYZ/速度/CameraEye/Front完全一致・Blender・GPU trianglesをまずTECHで独立照合。K4R元の形状とK4U新形状の同時刻画像を比較して、巨大骨組みとの関係と**屋根の下・中庭の公共空洞・建築用途・スケールが可読か**を独立ART判定する。遮蔽や画像差だけでPASSしない。改善しなければ本地点の追加造形をSTOPし、位置・規模研究へ戻す。

K4Uの全B48メッシュSAT／B51両幅×2881tickと連続CCD／障害物視認／見た目床の支持／HUMAN／実iPhone/Windows FPS／RELEASE／MERGEは**未実施HOLD**。物理A/Bの一致は候補固有の安全証明でない。

**CI開始時点の記録：K4U真Native試験コード・専用CIをGitHubへ保存、元の独立美術審査は未実施。正式ART0、Slope2 DNA0m、PR OPEN Draft未マージ。**
