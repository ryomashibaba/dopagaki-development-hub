# R19 A5 — 同じRIFT CIVIC BASILICAの立体都市基盤・公共空間・仮マテリアル工程

**2026-10-31 JST。元の全体目標を保持。ゲーム性＋美しい都市＋人間操作を同じ実走行で成立させる。正式ART0件／Slope2 DNA認定0m、GAMEPLAY・HUMAN・PERFORMANCE・RELEASE・MERGE HOLD。**

## A4からの実装内容
- 旧美術A4は14m真正元カメラで、窓付き実3D34区画と5オブジェクトGLBが確定した一方、建築が宇宙空間に離れて浮いて見えたためART REJECT。A5では既存都市一案だけを修正し、別の都市候補を量産しない。
- 現`scripts/p101-r19a3-one-integrated-civic-basilica-source.mjs`に、主役地区＋4公共地区ごとに合計**15個の多角形・深さを持つ段状都市基盤**（3個×5地区）と**空いた公共空間の間隔10か所**、建物と外側基盤に連なる**下部支持10部材**、非衝突の**景観上のアクセス動線5組**を制作。
- 各都市基盤は上下に離れた多角形の間を斜めの実3D側壁で接続し、下へ最大109mの深さを持つ。単一の幅広い道路跨ぎ床・巨大反復門・追加の物理走行床は生成しない。元道路縁を基準に都市の外側でのみ生成し、非衝突。
- 本ゲームの物理地面の確認・地表測量はない。**地下地形や既存地盤へ真に接地したとは認定せず**、ここは*都市基盤の仮造形*である。この基盤によりB51を隠す／14mの判断を妨げるならART REJECT。
- **仮の光表現**：実3D面の法線と固定の光方向に基づくRGB頂点カラー変化をモデル生成時に焼き込む。これはゲーム側のPBR・影・間接光や本物のGPU照明ではない。
- 既存`scripts/p101-r19a4-export-editable-source-city-glb.mjs`を再使用し、元14m/28mの真正B48データからBlender互換のGLBを2件生成。各GLBは主役＋4地区の**5独立オブジェクトと5個の異なる編集用仮マテリアル**、実都市基盤を含む。元Gameへ逆インポートする機能や完成PBRアセットではない。
- 元の`scripts/R19A3_REAL_14M_ONE_CITY_PRIVATE_ONE_CLICK.cmd`にA5の実3D/GLB生成を統合。ユーザーの操作を減らす。
- `tests/p101-r19a3-one-civic-city-real-14m.test.mjs`、`tests/p101-r19a4-editable-true-w9c1-gltf.test.mjs`に「15段丘・10空隙・10支持・仮照明・Blender材質・HOLD」の負のゲートを追加。

## 元source・研究境界
- 元本体`web/p101-w9c2-g4e7ci-integrated-streetscape.mjs` Git blob `af076d67492a677d2235e4730aef8cdf4808e106`不変。7本の正規B48・実動体B51 28基・240Hz CCD・元P96/P94/A13/元WebGL2カメラ/HUD・本番/main/Gold/W9-X/B5/P100を保護。PR #46はDraft OPEN／未マージ。
- `dist-private/r19a3`のみ追加美術。元0秒〜12秒、ULTRA14m/CONTROL28m×City OFF/ON×6同Native tickの元WebGL2 PNG**24枚**を現行CIで再撮影。画像と同じtickの元球XYZ/速度、28 B51、PNG SHAとGLB SHAを独立照合。正規人間操作の代替ではない。

## 今回の採否基準
1. 実元ソース上でA5の地形下部と建築が整合し、元14m路面や動体の前方視認が悪化しない。単に灰色の巨大台が現れただけなら**ART REJECT**。
2. 道路0の進入・狭路・退出から道路1の8〜11.5秒まで、近景・中景・遠景で一つの街と認識できる。断面の空洞、街の公共機能、実体の支持が感じられるかを画像で確認。
3. 造形の形数・マテリアル数・CI成功だけでART PASSを出さない。Blender GUIの操作と人間手動プレイ、RTX実GPU FPS、B51ピクセル視認、街の本物の地表接地は未確認。
4. 今後も成功した区間だけを正式Slope2 DNA目標2,912mへ認定する。**現時点で0m**。完成都市の評価は高品質という独立した観点を最優先。

**検証CI**：[R19 A5 正規Private QA](https://github.com/ryomashibaba/dopagaki-development-hub/actions/workflows/p101-r19a3-original-native-civic-city.yml)（最終結果とArtifactを別途確認してから正式に記録）。
