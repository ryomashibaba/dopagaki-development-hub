# K4BU — 実CC0針葉樹の向き・実画面1枚限定修正研究（正式ART HOLD）

2026年11月4日JST。現在の独立研究枝：`research/k4bu-upright-pine-single-frame-art-study-20261104`。

## 引き継いだ確定事実

- [K4BS最終CI #41795056558](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41795056558)：元編集可能Blender SHA256 `156e56ce373b731f1f0c8f96278a11977ac93d491973c2e8ef796ec1ea7795de`、Poly Haven CC0実松 glTF `pine_sapling_small` 398,144 triangles、共有8インスタンス、連続写真地表。TECH PASS。ただし同CHASE実研究画像では木がほぼ読めずART REJECT。
- [K4BT実CI #41799311517](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41799311517)：真正K4BS原本の元CHASE研究カメラへ8つのGLTF実メッシュCollection Instanceを投影し**SUCCESS**。8本中**3本は幾何学投影BBoxが画面外、5本は画面に入る**。0〜約0.97%程度の小さな画面矩形が複数あり、画面端で切れるインスタンスもある。BBox投影は実可視葉画素/alpha/遮蔽ではない。新ゲーム/Collider変更0。
- とくにK4BS実ワールドBBoxで元木0の高さ5.8mに対し水平方向は約11.8m、木1は横方向約11.7mに対し高さ5.6m。**単に位置だけでなく元モデルの主軸が木に自然な鉛直方向かを真正Meshで確認する必要がある**。モデルに欠陥と断定しない。

## K4BU実装の範囲

`scripts/p101-k4bu-upright-pine-one-frame.py`：元K4BS.blend SHAロック読込→ K4BT投影JSONの実数値を継承 → 元GLTF 3メッシュの実ワールド/Model bboxを再構成してK4BTの木0真Boundsと比較 → **元GLTF長軸Xが鉛直Zより1.35倍以上長い場合だけ**、オフスクリーンの木0の**元モデル座標をX→上方向Zへ回す**研究変換を試す。元の最大長から8.2mという研究上の樹高へ一様スケールを組み直す。**K4BSはモデル外接形状の中心を地表高-0.25mへ置いたため、木の下半分が地中側に入る配置だった。K4BUは回転・スケール後の実Bounding Footを地表+0.15mへ置き、下端を浮かせすぎず地中へ埋めずに可視化する。**元Blender/Cameras/Road5/B51/ゲームファイルと残り7本のTransformを変更しない。

研究用CHASEのカメラ空間に真meshの候補を投影し、`d=55〜154m、s=-26〜-62m`の既存地形の道路外側から**画面内で明確に読める可能性の高い候補を一つだけ採用**。木が実画面に見えるか確かめるため、**本物のBlender EEVEE 768×480px、同CHASE研究Camera、1枚のみ**を描画する。研究専用の編集可能な.blend（Artifact）と旧K4BS同研究Cameraの比較PNG・SHA監査JSONを保存する。新しい外部アセットの取得なし、実ゲームWebGL2ではなく、Art合格やFPS合格ではない。

- [初回K4BU Actions #41800959567](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41800959567)：この記述時点では**queued / 結果未確定**。CI green＝アート合格ではない。画像を確認して、木のシルエット・自然さ・道路との関係・沿岸の空白・遠景・港湾の生活感を判定。
- 技術失敗はその原因を最小限修正。美術失敗でも原本・研究画像を保存し**ART REJECT**。同じ素材を無駄に追加・多視点フルレンダー再実行しない。次の工程は実画像によりK4BVへ分岐。

## 不変契約・合格の線引き

元ゲーム `web/p101-w9c2-g4e7ci-integrated-streetscape.mjs` Git blob `af076d67492a677d2235e4730aef8cdf4808e106`、Road5元全頂点面 `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、元B48道路7本/B51動体28体/240Hz/球0.65m/6Camera/元研究Cameraを保護。main/公式`p101-velocity-overdrive-native-trial`/Draft PR #46（Open/Draft/未merge）/本番2サイト変更禁止。追加課金0円、Work/Computer Use事前承認、Windows手作業0。正式ART採用**0件**、Slope2 DNA正式認定**0m**、ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。実研究幅26.3mの道路を本番Road5と誤認禁止。

## 【K4BU最終監査 2026-11-04】本物の1フレームレンダー成功・目視ART REJECT

- [修正版GitHub Actions #41801261499](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41801261499) は **completed/SUCCESS**。初回 #41800959567は地面に木の半分が埋まる問題を訂正するため **CANCELLED**。未修正実行を成功/画像証拠として扱わない。
- 公式[K4BU Native Artifact #13307768050](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41801261499/artifacts/13307768050) ZIPの独立SHA256 `77a333b09e975836bb5e17117b42067b390dff0d8f001fd79a108bb6ae7f1df0`、ZIP CRCチェック **PASS**。真の編集可能 `K4BU_ONE_REPOSITIONED_UPRIGHT_GENUINE_CC0_PINE_EDITABLE_RESEARCH_ART_HOLD.blend` 136,869,749B / SHA256 `2536375f40e6a20e0061b80aba100c2469cfeacde814f4c127ff194201ba3064`、真CHASE同Camera PNG 465,009B / SHA256 `57972945e3ddeea0ebb78364059fb47c8782cd738cbe6557c151e5255ecbbcf9`、[K4BS旧画像とK4BU新画像の真同Camera比較PNG](research-evidence/k4bu/K4BU_VS_K4BS_SAME_CHASE_ONE_NATIVE_UPRIGHT_PINE_ART_REVIEW_NOT_GAME.png) 697,434B / SHA256 `ef89bc98eddffe8b82ce367de88831db768711d94e85a18f20a691183b7ed898`。以上すべてをCIとは別のコンテナで実ZIP原バイトからSHA独立再計算してPASS。
- K4BT真正Native解析で元`pine_sapling_small`実メッシュBoundsは **X=2.6421m、Y=0.7703m、Z=1.2990m**。既存K4BSでは元木0を画面完全外に置き、原BBox中心を地面付近へ置いた。K4BUでは**オフスクリーンの1本だけ**長軸Xを鉛直へ研究回転し、体高8.2mの一様スケール、道路前方研究Station d=66m、Road横s=-26mへ配置、BBox下端を地表の**+0.15m**にした。画面外→1280×800換算で **幅32.627px × 高さ106.078px** の画面内投影BBoxに変化。面積0.337983%はBBoxであり実可視ピクセル数ではない。推定候補12件から1件のみ選択、元研究カメラ/元ゲームRoad5/元6Camera/他7本のTransform不変更。実木398,144 triangles/8本保持。
- **元CHASEの真Blender研究画像を直接目視した結論：ART REJECT**。右側の海岸斜面に、確かに縦向きの細い木の形は現れた。しかし枝葉は非常に疎で、成熟した自然な針葉樹樹冠と認識しにくい。画面の主題を担える植栽品質に達していない。大部分は単調な灰色の上りRoad・低密度の海岸・目立つ空白の空で、走行スピード感、実世界の港湾・公共空間、立体的な街並み、世界水準の美術が全く足りない。この評価は作者の画像目視でありCIのRGB変化値から推測したものではない。
- 「GLTF実在」「Z-up向き修正」「1本が画面内」「実Blenderレンダー成功」＝ **作品美術合格ではない**。正式ART採用0件、Slope2 DNA正式認定0m、HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。元ゲームのWebGL2/真可走幅・FPS・遊びやすさは未試験。

## K4BVへの制作方向：疎な苗木を量産しない

1. K4BUで小型`pine_sapling_small`を正しく向けても**枝が細く疎で見た目が弱い**と真正画像から判明。これを8本すべてに増殖・2枚フル再レンダリングしても全体品質の解決にならない。K4BVでは用途を満たす**成熟した風に耐えた海岸樹の自然な樹冠**を、配布元の真正実モデル/ライセンス/バイト/アセットサイズ/形と位置を確かめ、少数配置・小さい画像の1画面で検証。追加無料素材を探す場合も取得前に見込みの薄い候補を増やさず、実在と利用権の証拠なしの導入は禁止。
2. 木単体の問題が改善したら、空白を埋める**実用途・人間的スケールの港湾施設・自然地形・視界中央のランドマーク**を作者意匠で構成する。大きな箱・低ポリ円錐・単純反復・模型の増産へ戻らず、同CHASE一画面の質を最優先。
3. 1画面ART PASSまで他6 Roadとゲーム本体に統合しない。本格採用時だけ別の真正B48可走Road5/元6Camera/SAT/CCD/28動体/FPS/HUMANのゲートを開始。リリース/マージ不許可。無駄なQA増殖を抑え、研究Blender画像と実ゲームフレームの境界を守る。

