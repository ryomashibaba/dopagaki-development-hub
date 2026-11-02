# DOPAGAKI SLOPE K4U — 旧K4Rの実建築形状を固定しRoad0位置のみ移動：真正WebGL2再審査

**2026-11-02 JST、GitHub正本のみ、Draft PR #46、`p101-velocity-overdrive-native-trial`。** K4/K4R同一地点の独立ART REJECT、K4S全42真正元カメラと元A5 BVH遮蔽位置研究、K4T真正元WebGL2近似代理枠の独立技術PASSを継承。正式ART採用0件、Slope2 DNA0m。

## 最終独立監査（2026-11-02 JST）：TECH限定PASS／ART REJECT

[**K4U Actions #41359514124**](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41359514124) **全job SUCCESS**、テスト実装HEAD `0765091ff354519f98542a6127a8264c9a09cf6a`。[真正Artifact #13104454224](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41359514124/artifacts/13104454224) ZIP **4,070,133 bytes／SHA256 `2b3480cafc1d64c5a861c8b927f42c96cb3120fc7c8fa4a76b108cec2d37ca00`**、実26ファイル／CRC・ZIP一式整合PASS。

元ソース・凍結K4R建築Python Git blob `e653029771982b2c39ee2831ea19199f0704ddaa` は変更なし。原A5編集可能5メッシュだけに、凍結K4Rと同じ**34モジュール・668面・GPU元10,566→新11,902三角形**を、Road0位置 `u=.75`→`u=.85` の**実アンカー置換のみ**でNative Blender4を実行。BLEND/GLB各幅2種とGPU独立読戻成功、追加コライダー0。元240Hz/B48 7/B51 28/球XYZ・速度／ball-lock-unfiltered-headingカメラの同時刻比較が元A5とのJSON検査で一致。**真正元A5/K4U × 幅14/28m × tick265/721/1057/1249 = 16枚、各PNGのSHA256を実ZIP内の根拠JSONと独立照合一致、`errors=[]`**。同tick・幅のK4RとK4Uの元A5原画8/8はPNGバイト単位で一致した。

### 同一元真正WebGL2背景との画像差を独立算出（元original A5・旧K4R・新K4U）

全画面の任意RGBチャネル最大差が36を超えるピクセル割合。**これは実建築の正確な可視マスク・美術品質・遊べる広場の証明ではない**。

| 元tick | 道路幅 | 元→旧K4R (%) | 元→移設K4U (%) | K4R→K4U (%) |
|---|---|---:|---:|---:|
| 265 (1.104秒) | 14m | 0.2680 | 0.2878 | 0.3628 |
| 721 (3.004秒) | 14m | 0.8302 | 0.6431 | 1.0167 |
| 1057 (4.404秒) | 14m | 2.4869 | 1.4318 | 2.8359 |
| 1249 (5.204秒) | 14m | 3.3138 | 3.7570 | 4.6690 |
| 265 (1.104秒) | 28m | 0.2667 | 0.2884 | 0.3606 |
| 721 (3.004秒) | 28m | 0.8323 | 0.6467 | 1.0181 |
| 1057 (4.404秒) | 28m | 2.6127 | 1.4781 | 2.9696 |
| 1249 (5.204秒) | 28m | 3.2106 | 3.8763 | 4.6073 |

**実画像判定：ART REJECT。** 先行3.004/4.404秒ではK4Uの画面上の面積がK4Rより小さい。5.204秒にはK4U屋根が旧K4Rより左から入り、元A5に遮られにくく残る。しかし真正原画の高速チェイス視点では、未だA5の巨大構造にオレンジ系の低い屋根・薄い段床が付属するだけに見える。市場の機能的な街路、人間スケールの活用、空に開く中庭の奥行きが判読できず、旧K4Rの主因を解消していない。実屋根の差分BBoxはtick1249に右画面端`x=1012`へ達する（両幅）。**K4Uを採用・美術PASS・Slope2 DNA加算してはならない**。

### 失敗の教訓と次の工程

K4（小屋根）→K4R（形状改修）→K4U（同形状位置変更）を元Camera/原物理で比較してなお、**屋根下の実公共空間がスピードで認識できない**。単なる建築量産、屋根サイズ拡張、位置の小刻みな移動を反復しない。次工程は**K4V：元画面から逆算する「公共空洞を認識できるか」という根本的な美術構成のゲート研究**を実施し、候補制作をSTOPする。元K4R/K4Uの実画像を使い、画面のどの時点・高さ・立体重なりで空洞が遮られるかを切り分ける。将来の市場建築原案の再制作は、この根拠で場面品質を改善する計画ができた時のみ、1案ずつに制限。新建築を形だけ増やしたことを開発進捗と扱わない。

**正式ART採用0件、Slope2 DNA認定0m、K4U候補固有のB48 7区間SAT／B51 28×両幅×2881tickSAT・CCD／動体ピクセル可読性／床支持／人間プレイ／Windows/iPhone FPS／RELEASE／MERGE全HOLD。** main/Gold/P100/W9-X/B5/元source・物理/カメラ/本番2URL非変更、Draft PR#46 OPEN未マージ。

---

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
