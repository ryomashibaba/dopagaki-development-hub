# K4BW — 元CHASE一画面で港湾・公共空間・道路・自然地形を一体として作者設計する真正Blender研究

2026年11月4日、隔離研究枝 `research/k4bw-coastal-viaduct-harbor-composition-20261104`。ここは新ゲーム建設ではなく、**源作品の世界水準の高速3Dレース景観を実映像で改善するための独立したDCC研究**。1画面のART REJECTを偽装したり、技術合格を正式美術採用へ読み替えたりしない。

## 引き継ぎ

[K4BV最終真正監査](R19_A6P4_R2F5K4BV_REAL_CC0_COASTAL_CANOPY_ART_JA.md)では、公式CC0 Island Tree 02 1,072,212 triangles、9画像Packedの本物Blender編集可能原本 `K4BV_ONE_GENUINE_COASTAL_CANOPY_EDITABLE_NATIVE_ART_HOLD.blend` SHA256 `7c28000ad1a75afb7f64958a6d48ec5ff205849c37d5a2878f17bdd1d2d4e1c4`、元CHASE Cameraの768×480実PNG SHA256 `390a2ca19cd98eba204f697c1f70532ca86ee77e504e4692c62d8a6c5244d665` に技術PASS。しかし木1本と古い港湾断片では画面がほぼ何もなく、巨大灰色Road5と無機的左斜面が支配するため **ART REJECT、正式採用0件、Slope2 DNA 0m**。ユーザーが一貫して求めるのは画像全体の美術改善。単純な箱、円錐植生、大量の簡易素材、空白の港への回帰禁止。

## K4BW実制作（変更はDCC研究のみに限定）

- `scripts/p101-k4bw-native-harbor-composition.py` はGitHub Actions成功のK4BV真正Native原本を固定SHA256検証・独立再読込。元Game Blob `af076d67492a677d2235e4730aef8cdf4808e106`、元B48 Road5 fingerprint `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、元6 Cameraと研究CHASE Camera数値を不変のまま維持。元B48実7道路/B51動体28体/240Hz/球0.65mに変更なし。
- 元Road5の実メッシュへRay Castして真正の高さをサンプルし、**非Colliderの研究用素材オーバーレイ**だけを上に置き、鉱物質の暗い粗さとわずかな縦方向の摩耗を1つの連続PBR材質で表現。実ゲームRoad5頂点/面/材質を変更せず、ゲームの車線・物理の安全を認定しない。
- 左側の灰色で単調な斜面には、断面を連続編集した風化した自然斜面を追加。元K4BSの真正写真地表PBRを使い、四角い手続き的な交互色分けをしない。自然の侵食、実地形に近い曲面起伏、遠景の層を検証。
- 右側には「**海辺の来訪者案内・船舶サービスの公共施設**」という具体的用途を置く。曲面の薄い耐候金属キャノピー、木製の屋根構造、開いたガラス開口、細い柱、段状の公共観覧テラス、歩行可能な木デッキ、護岸、海沿いのガードを**同じ構造用途**として一体構成。屋根の単純巨大な平箱、1本灯台、形だけの巨大モニュメントにしない。元CHASE研究Cameraで実際に画面内に位置する候補を数値選択。
- 旧CC0高密度海岸樹は**1本の本物を保持**、同じモデルの大量クローンなし。後日LOD/FPSは別のゲート。研究用だけの造形は今の実ゲームColliderやソースには反映しない。
- 実Blender EEVEE **768×480、CHASE_NARROW同元研究Camera、原則1画像だけ**。元K4BV 768×480と実同Camera A/Bを中立比較。RGB差分は「違う」証拠に過ぎず、ART品質指標ではない。新しい.blend・PNG・ハッシュ監査JSONを保存。技術PASSと美術PASSは独立して評価。

[**K4BW初回 GitHub Actions #41818181545**](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41818181545) はこの文書作成時点で結果未確認。真正レンダリングの成功、Art判断は事実確認後に追記。美術審査がPASSしないなら研究の成果としてだけ残し、正式採用0件とSlope2 DNA0mは継続。

## 保護条件と次への判断

main、公式 `p101-velocity-overdrive-native-trial`、Draft PR #46、本番2サイト、既存Blob/B48メッシュ/元Cameraを改変せず、追加有料APIなし。Work/Computer Use開始は個別事前承認。ユーザーWindows操作0。SAT/CCD/HUMAN/FPS/RELEASE/MERGE全HOLD。制作物は真のGame WebGL2フレームではなく研究Blender出力。

**K4BXの分岐**：実画像を直接確認し、建築・地形・路面が同じ画面内で自然に見えるか、元Road5のスケールと高速走行への視線誘導が改善したかを評価する。遠景の街並み・港湾の密度が足りないなら少数の本物の用途ある街区/地形の作者設計に集中。箱や材質の単純増殖は禁止。1画面ARTが成立するまでは他6道路・本ゲームへ展開禁止。
