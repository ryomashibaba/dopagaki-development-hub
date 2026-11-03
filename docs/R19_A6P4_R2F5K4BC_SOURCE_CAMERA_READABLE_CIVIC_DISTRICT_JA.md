# DOPAGAKI SLOPE — K4BC《Source Camera Civic Monument》統合制作正本

**2026-11-03 JST、K4BB確定HEAD `9800d65b71f719347f9d467ef90199791925b511`から独立。** これはDCC 3D美術の研究ブランチであり、正式ART採用や原WebGL2ゲーム実装を意味しない。

## 過去の技術成功と不合格理由の継承

- K4BB [GitHub Actions #41631593534](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41631593534) **SOURCE/DCC SUCCESS**。K4BB .blend＋GLB、2Kアルベド/ROUGHNESS/HEIGHT非ゼロ、元Road5 4,728三角形不変・6元source Camera DCC。独立BVH [#41631656710](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41631656710) は**K4BB新造形167個/5,630評価面の元Road5とB51 168時刻OBB静的表面交差0件**（他道路・全時刻/CCD/HUMANとは別）。
- K4BB 6真正source Camera DCC [実画像](research-evidence/k4bb/K4BB_SIX_SOURCE_NUMERIC_CAMERA_PBR_INTERIORS_ART_HOLD.png)：ロード中央の占有が大きく、左右建築が**薄い屋根と細かい棒の集合**に見える。4つの追加室内は真正高速Cameraから用途が**全く読み取れない**。航空写真も地域都市ではなく浮いた彫刻・塔の模型。source 2K PBRの技術成功を**ART PASSにしない**。
- K4BA旧原本を改変削除せず、**K4BB旧全コレクションとK4BA旧コレクションをBlender内で非表示にして、独立K4BC全画面美術を新規著作する**。source原路面、source B51 source時刻物理OBB、6原Cameraは非表示にせず正確に維持する。

## K4BCで実際に作る主要シーン

**Blender-native制作器**：[`scripts/p101-k4bc-original-b48-source-camera-civic-recomposition.py`](../scripts/p101-k4bc-original-b48-source-camera-civic-recomposition.py)。

1. **Source Road5両岸の一体型都市地形**。元B48 top source lattice 91x13に合わせ、道路実端から34m以上を基本に連続した成層岩・支持地形をメッシュで造形。床や建築の底が空中に浮かず、現実の都市のように複合的な公共デッキが3段の基壇と接続。元Road5道路の下側を架空の連続コースで埋めない。
2. **建物の用途が遠距離で読める厚い2棟の大きな公共体**。左の港湾交易所、右の都市中央図書館。巨大な入口開口を抜いて建物の背面・多層床・後壁を読ませ、細かい箱の装飾でなく、5階相当の赤い側壁＋ガラス壁、傾斜したコンクリート・テラコッタの構造屋根。圧倒的高速カメラの画面上で**大きな空間の暗部と光部のリズム**を判別できることが狙い。
3. **実用途を読み取れる大型公共階段/劇場ホール**。道路外側の岩盤デッキ上に、7段の大きな座席階段、多層の大入口ジャム、室内に光帯を挿入。通常人間が高速度で見るには小家具より建築断面の可読性が先決。細かい本棚等の反復を増やさず、巨大なグランドホールの実体を作る。
4. **長い跨道美術研究用の公共スカイミュージアム**。元Road5 u=.965–.988の上空に本当の床・屋根・透明ガラスと支持柱を持つ広い連絡施設。これは**非衝突DCC美術**で、元ゲームのゲート・新道路・当たり判定・危険表示の代わりではない。元Camera/実B51との静的干渉を別BVHで検査。
5. **原道路上の非衝突の石材肩帯**。路面2K PBRをK4BBから維持し、Road5実頂点からサンプリングした短い石材インレイを肩だけに配置。ユーザーのゲーム物理・安全表示や元の得点/カメラ/スピードは改変しない。
6. **真の造形的な正面都市**。Road5物理終端の先に、両岸の荷重支持に付いた110m級2建築の多面体シェルを設置。居住空間の床、多層の大きな吹抜け、厚い屋根・外皮、実ロード端以遠の135m上空の独立スカイ展望施設。Source以遠の「架空の走行可能路面」は作らない。元の次B48道路の安全性まではまだ実証しない。
7. **全体のDCC雰囲気**。青みの海港日光、グレーの basalt・赤い焼物・温かな本物の公共照明。建築だけを増やさず、道路・海岸・大広場・建物の断面を1つの読みやすい場面として設計する。旧K4BBはBlender editable保護したままDCCプレビュー上だけOFF。

## 厳守する source 契約

| 項目 | 原本不変 |
|---|---|
| 凍結元game blob | `af076d67492a677d2235e4730aef8cdf4808e106` |
| 元ゲーム構成 | B48 7道路／B51 28移動障害物、240Hz、球半径0.65m |
| 実Road5 source | `p93-PRISM_CREST-01`、4,728三角、B48ポイントSHA `5eb731e25bc9eb1a3cf1080e7b239f5e2e8043bfbc80e5d37e0b069a5a08a730` |
| 元source Camera | control11259/11278/11307、ultra11320/11341/11369、各 source eye 数値不変 |
| B51 source | 元Camera6時刻×28体の源物理 collision OBB=168 |
| 無変更 | 本物のWebGL2元物理/音/操作、元の危険表示/コース、main、公式継続枝、本番サイト、Draft PR #46 |
| 定義上の研究 | 新しい造形や石材帯は**DCC 非衝突3D研究**であり、元ゲームへの採用ではない |
| 永続HOLD | ART正式採用0件・Slope2 DNA認定0m、ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE HOLD |

## ソース・画像の検証工程

- [K4BC DCC専用Actions](../.github/workflows/p101-k4bc-true-camera-civic-visual-rebuild.yml)：ピン止めK4BB .blend/GLB・K4AY真SourceをSHA照合。全6source Camera numeric DCCを真正元source視点で描画、別の航空DCC。K4BB対K4BCの同pose A/B画像を自動出力し、編集可能 `.blend` / GLB / SHA付き文書を成果として残す。
- [新K4BC建築の独立BVH](../research/k4bc/independent_original_road5_and_B51_static_bvh.py) ＋ [専用CI](../.github/workflows/p101-k4bc-independent-b48-b51-bvh.yml)：K4BC**新規可視建築のみ**対元B48 Road5 4,728三角 / B51 6×28体源物理 OBBの**静的三角形表面交差**を確認。K4BA/K4BB古い不採用アートを含めず、元Road5に密着したDCC-only肩デザインも除く。CCDや元B48他6道路、元全時刻、人間のゲーム体験は未検証。
- [研究ブランチへの永続証拠保存Actions](../.github/workflows/p101-k4bc-pin-source-art-review-images.yml)。成功後はユーザーPC操作・ZIPの手動展開不要でGitHub上の真正Camera A/Bとアーティスト画像が直接見える。
- **CI green / B48元meshハッシュ不変 / 限定BVH静的ゼロ / source Camera画像の変化量だけでART認定しない。** 実画像を必ず開き、世界的な競争レベルの美術としてまだ薄い、用途が分からない、空間が雑な場合は**ART REJECT**を維持する。

**この正本の初版時点ではK4BC DCC描画結果／独立BVH結果は未確定。** 完了runのログ、源画像・SHA・モデルを別途照合するまで成果の成功を事前宣言しない。
