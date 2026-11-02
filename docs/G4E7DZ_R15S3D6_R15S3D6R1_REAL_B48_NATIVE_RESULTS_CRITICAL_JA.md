# R15S3D6 + R15S3D6R1 — 二仮説×2世界と実LOWER_REVERSAL再縦断・真正240Hz結果

**基準：2026-10-30 JST。GAMEPLAY FAIL/HOLD、ART REJECT/HOLD、HUMAN/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD。正式美術0・Slope2認定0m。**

## 真正の証拠と元ゲーム保護

- R15S3D6 真正[Actions #40958123543](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40958123543) **SUCCESS**／[Artifact #12935000733](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40958123543/artifacts/12935000733)。実B48 2形状A/B×2元世界＝4真正240Hz。独立QA12件の偽認証を拒否。
- R15S3D6R1 再実行[Actions #40958849153](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40958849153) **SUCCESS**／[Artifact #12934677277](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40958849153/artifacts/12934677277)。元B案を基に、真のB48`p93-LOWER_REVERSAL-01`の制御行2〜19を再縦断、2元世界で真正240Hz。独立QA10件の偽認証を拒否。
- R1の初回[Actions #40958814417](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40958814417)は旧実験JSONの`sourceGameBlob`/ `originalSourceBlob`フィールド不一致でFAIL。参照スキーマを修正して上記最終CI SUCCESS。**初回FAILを隠さず履歴に残す。**
- 共通で原P96→P94合法操舵、原`Runner`240Hz/CCD、CROWN B16全格子とSCISSOR行0〜11、B51全28基、元route/routeSegments、原カメラ、全B48道路7本を保持。17s/21.5s元B16 prefix一致。元保護ゲームblob `af076d67492a677d2235e4730aef8cdf4808e106`は変更なし、追加コライダー・幽霊床・吸着・転送・強制補正なし。作業はPR#46の隔離候補だけ。

## R15S3D6：実道路2案の結果

A`A_EARLY_DESCENT_SUPPORT`はSCISSORに実際の高い下降曲線を導入。B`B_LOW_ANGLE_RECONTACT`は飛行後の低迎え角での真正再接地を狙う。両案とも本物のB48曲面点格子・三角形を変更、見た目だけの橋ではない。

| 世界／案 | 真の最終状態 | SCISSOR実接地 | 次B48実接地 | 次B48符号付接線方向平均速度 | 最大1tick全速度変化（23s以降） |
|---|---|---:|---:|---:|---:|
| true-pinch / A | 落下33.525s | 1.633333s | 1.379167s | +116.811m/s | 56.698m/s |
| pinch-switch / A | **衝突専用面へ衝突28.600s** | 1.337500s | **0s** | — | 81.234m/s |
| true-pinch / B | 落下33.433333s | 1.637500s | 1.345833s | +119.385m/s | 51.234m/s |
| pinch-switch / B | 落下33.462500s | 1.454167s | 1.404167s | +116.010m/s | 53.898m/s |

Aはpinch-switchで危険な固定面衝突を引き起こし、**両世界成立せず棄却**。Bは両世界で後続実B48に再接地し、後続路面上は正方向に100m/s超で進み、元エンジンforwardの負速度は0tickだった。ただし2世界とも約33.4秒に落下、正式採用不可。

R15S3D4旧Lの着地近傍最大tick差約75〜76m/sに対し、Bは最大約51〜54m/s（計測窓・候補軌道が異なり、厳密なCCD接触インパルス改善率ではない）。元Bの支持終了は両世界ともX≈−1539〜−1540、Y≈−22、Z≈343、次道路近傍u≈.185〜.189。元物理の`Y<-24`での落下判定直前に支持を失っている。勾配と曲率の連動が設計上の有力課題。

## R15S3D6R1：実LOWER_REVERSALの勾配を限定改修

R1はBのSCISSOR・CROWN・原物理と元ガイドをそのままにし、LOWER_REVERSAL B48制御行2〜19だけを、元出入口の整合・実走行方向を守る形で再縦断。新たな別床・不可視コライダーは設けていない。

| 世界 | Bの最終落下 | R1の最終落下 | Bの次道路実接地 | R1の次道路実接地 | R1の次B48平均符号付速度 |
|---|---:|---:|---:|---:|---:|
| true-pinch | 33.433333s | **38.404167s** | 1.345833s | **2.500000s** | +119.590m/s |
| pinch-switch | 33.462500s | **38.454167s** | 1.404167s | **2.570833s** | +116.139m/s |

**真正の限定改善**：最終落下までの時間は+4.971/+4.992秒、後続道路の実接地時間は+1.154/+1.167秒。元ガイド・元合法操舵を変えず両世界の正方向高速走行を延長した。後続B48実接地中の負forward tickは0。

**それでも新しい失敗が明確化**：
- true-pinchは34.504167秒に実LOWER_REVERSAL支持終了（X=-1673.315906、Y=-3.788578、Z=380.477996）、その後空中のまま38.404167秒で落下。
- pinch-switchは34.562500秒で支持終了（X=-1673.135832、Y=-3.853489、Z=380.544926）、その後38.454167秒で落下。
- 2世界とも進行投影`u≈0.345665`で支持を失い、34.5秒前後には本物の静的衝突カウント増分1と大きな全速度差がある。最大1tick全速度差は**R1で54.215／56.480m/s**、Bの51.234／53.898m/sよりむしろ悪化。この大きな変化と支持喪失の因果関係はCCD個別インパルス未測定のため未確定。
- どちらも45秒打切りrunningにすら到達せず、`finished` 0/2、HUMAN・実WebGL未検証。

## 次R15S3D7のゲート（未実装・正式採用禁止）

**次は微調整の反復でなく、LOWER_REVERSAL中盤〜次実B48を一体にした進路・支持法線・原ガイドとの不整合を検証する。** 34.5秒の両世界共通支持喪失を、以下を別々に確証するまで形状を採用しない。

1. 元34.45〜34.65sの**各240Hz tick**で実元Runnerのボール速度、forward、地表支持`contacts()`法線、正規route生成ガイド、球と本物のB48上面/両外縁の最短距離、固定CCD衝突回数・衝突予定面を重ねる。実衝突法線と事前支持法線を混同しない。
2. 実道路の制御行8〜20と細長い長距離投影の曲率・法線・勾配の連続性を監査。接地喪失が「曲率/操舵」「路外」「道路コライダー自体」「次のB48未接続」のどれで起きたか仮説を分ける。単なる道路の横幅増しは却下。
3. B案→R1で確定した両世界の高速正方向前進を保持し、次の本物の道路へ自然進入する地形を一体的に設計する。元CROWN・SCISSOR前半・元B51/240Hz・原ゲーム本体は凍結したまま、真正2世界の0秒始動＋独立QA。
4. **本物の実WebGL／正規カメラ**・動体障害物視認性・人間操作への接続がなければGAMEPLAY/ARTの正式採用はしない。さらに後退復帰・道路幅10〜16m・都市空間統合の品質を忘れない。

**採否**：R15S3D6 Aは両世界性が破綻しGAMEPLAY REJECT。BとR1はSOURCE TECH限定PASSの保管候補であり、部分接地・正方向速度の証拠としてのみ再利用。**R1を正式ゲームプレイに採用してはならない。**

GitHub PR #46はOPEN/Draft・未マージ、main/Gold/P100/本番・保護ソース不変。ART正式採用0、Slope2認定0m。
