# R18 P1真正36 Canvas PNG判定→R18 P2実制作・厳格ARTゲート（2026-10-30 JST）

**品質最優先：source tech PASS≠ART PASS、人工的な「巨大な箱」「棚」「アーチ線画」の反復を厳禁。**

## 正本の実測

- 元の真正[CI #41075148883](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41075148883)は全ジョブSUCCESS。実6セッション36枚のCanvas PNGを独立照合（**36/36 SHA256**）、R18P1の新A/B×両世界の元物理`finished`＋`finishEvents=1`は**4/4**、10偽証明拒否。真正元ソースBlob `af076d67492a677d2235e4730aef8cdf4808e106`不変。
- 元Artifact #12986898295、18,369,537 bytes、ZIP SHA256 `8883ec148e381f61e4007514b59795886bcb0dd3bc08ecc6149bdfdff194b8c9`。保存期限 **2026-11-06 14:57:13 UTC**。別途会話添付で元ZIPと2つのtrue camera contact sheetを保全。GitHubへ永久保管したという主張はしない。
- 両世界で54/58/61/64/67秒の元Canvasの画像を目視。**R18P1 A_CIVIC_RIBBON_CONCOURSE: ART REJECT／B_TERRACED_COURT_NETWORK: ART REJECT**。小型の高塔と細いアーチ、独立した梁と小塊が支配し、都市の大きな体積や厚い街区の形状が不成立。54秒の遠景が空洞気味、64/67秒は孤立造形が接近してフレームがバラバラに見える。古いD15R1との違いが出ても、美術水準が十分とは言えない。
- 元D15R1比RGB最大差>28のROI画素変化率（x18〜82%、y12〜70%）：
  - true-pinch A：54 5.70%、58 8.57%、61 13.89%、64 25.12%、67 26.77%。
  - true-pinch B：54 3.37%、58 7.92%、61 14.52%、64 29.91%、67 27.06%。
  - pinch-switch A：54 4.89%、58 6.89%、61 11.86%、64 27.31%、67 29.87%。
  - pinch-switch B：54 2.62%、58 6.77%、61 11.72%、64 30.70%、67 29.39%。
  - **これは描画画素変化の補助指標であり「都市の可視被覆率」でも「美しさの点数」でもない。**

## R18 P2 本物の次工程実制作

- R18P0の元正規カメラ2世界×5時刻の候補地点を保持（道路5 u=.18/.48/.91、道路6 u=.30/.78／正規 right=[-forward.z,0,forward.x]の符号を保持）。
- 新A：`A_INHABITED_ESCARPMENT`。巨大な崖状の**6層の居住・公共施設**、窓の真正開口、曲面テラス、街路と変化する塔群。薄い線画のアーチ構造の置き換え。
- 新B：`B_HOLLOW_TRANSIT_SAILS`。左右に分かれた**厚みのある複曲面の街区外皮**、間の本物の吹抜け、内部の多層公共庭と実際の居住ボリューム。天蓋で原道路を架空の床に変えない。
- 真正世界のXYZ+RGB三角形生成器：`scripts/p101-r18p2-sculpted-inhabited-megacity-source.mjs`。PRIVATE原ゲーム: `scripts/p101-r18p2-private-original-webgl2-volumetric-pack.mjs`。元物理の変更ゼロを静的検証、実WebGL2環境にのみ排他的にA/Bを描画。道路とB51はオリジナル。
- 比較：旧D15R1×2世界、新A/B×2世界、計6ケース、元54/58/61/64/67秒と終端。元Canvas PNGバイトSHA256、ネイティブtick/フィニッシュ、10偽証明拒否。専用[CIワークフロー](https://github.com/ryomashibaba/dopagaki-development-hub/actions/workflows/p101-r18p2-original-webgl2-volumetric-architecture.yml)。単体3D座標・原stage不変を別に検査する。
- Windows 1クリック研究プレビュー：`scripts/R18P2_PRIVATE_TWO_VOLUMETRIC_CITIES_ONE_CLICK.cmd`。Windows手動、FPSとB51実回避は未検証。

## 正式美術審査の否定条件

54秒遠景のシルエットが小さな建物や線画の集合に過ぎない・道路を自然に包む建築の厚みがない・61秒で内部の生活空間の形が読めない・64秒で路面/B51を不当に隠す・67秒で都市が突然途切れるなら、**どちらもART REJECT**のまま。大きなポリゴン・成功したCI・PNG差分の多さだけで採用しない。撮影した元画像を必ず人間が直接見ること。

絶対不変：元ソースGit blob `af076d67492a677d2235e4730aef8cdf4808e106`、元240Hz CCD/球r.65/道路B48×7/障害物B51×28/操作P96・P94・A13/RAWカメラ/HUD、main/Gold/P100/本番、PR#46 Draft/未マージ。コライダー追加0。GAMEPLAY/HUMAN/PERFORMANCE/RELEASE/MERGEは別途HOLD。正式ART採用0、Slope2認定0m。
