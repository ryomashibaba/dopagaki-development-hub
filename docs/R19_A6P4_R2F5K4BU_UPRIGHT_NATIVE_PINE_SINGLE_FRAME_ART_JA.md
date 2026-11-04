# K4BU — 実CC0針葉樹の向き・実画面1枚限定修正研究（正式ART HOLD）

2026年11月4日JST。現在の独立研究枝：`research/k4bu-upright-pine-single-frame-art-study-20261104`。

## 引き継いだ確定事実

- [K4BS最終CI #41795056558](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41795056558)：元編集可能Blender SHA256 `156e56ce373b731f1f0c8f96278a11977ac93d491973c2e8ef796ec1ea7795de`、Poly Haven CC0実松 glTF `pine_sapling_small` 398,144 triangles、共有8インスタンス、連続写真地表。TECH PASS。ただし同CHASE実研究画像では木がほぼ読めずART REJECT。
- [K4BT実CI #41799311517](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41799311517)：真正K4BS原本の元CHASE研究カメラへ8つのGLTF実メッシュCollection Instanceを投影し**SUCCESS**。8本中**3本は幾何学投影BBoxが画面外、5本は画面に入る**。0〜約0.97%程度の小さな画面矩形が複数あり、画面端で切れるインスタンスもある。BBox投影は実可視葉画素/alpha/遮蔽ではない。新ゲーム/Collider変更0。
- とくにK4BS実ワールドBBoxで元木0の高さ5.8mに対し水平方向は約11.8m、木1は横方向約11.7mに対し高さ5.6m。**単に位置だけでなく元モデルの主軸が木に自然な鉛直方向かを真正Meshで確認する必要がある**。モデルに欠陥と断定しない。

## K4BU実装の範囲

`scripts/p101-k4bu-upright-pine-one-frame.py`：元K4BS.blend SHAロック読込→ K4BT投影JSONの実数値を継承 → 元GLTF 3メッシュの実ワールド/Model bboxを再構成してK4BTの木0真Boundsと比較 → **元GLTF長軸Xが鉛直Zより1.35倍以上長い場合だけ**、オフスクリーンの木0の**元モデル座標をX→上方向Zへ回す**研究変換を試す。元の最大長から8.2mという研究上の樹高へ一様スケールを組み直す。元Blender/Cameras/Road5/B51/ゲームファイルと残り7本のTransformを変更しない。

研究用CHASEのカメラ空間に真meshの候補を投影し、`d=55〜154m、s=-26〜-62m`の既存地形の道路外側から**画面内で明確に読める可能性の高い候補を一つだけ採用**。木が実画面に見えるか確かめるため、**本物のBlender EEVEE 768×480px、同CHASE研究Camera、1枚のみ**を描画する。研究専用の編集可能な.blend（Artifact）と旧K4BS同研究Cameraの比較PNG・SHA監査JSONを保存する。新しい外部アセットの取得なし、実ゲームWebGL2ではなく、Art合格やFPS合格ではない。

- [初回K4BU Actions #41800959567](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41800959567)：この記述時点では**queued / 結果未確定**。CI green＝アート合格ではない。画像を確認して、木のシルエット・自然さ・道路との関係・沿岸の空白・遠景・港湾の生活感を判定。
- 技術失敗はその原因を最小限修正。美術失敗でも原本・研究画像を保存し**ART REJECT**。同じ素材を無駄に追加・多視点フルレンダー再実行しない。次の工程は実画像によりK4BVへ分岐。

## 不変契約・合格の線引き

元ゲーム `web/p101-w9c2-g4e7ci-integrated-streetscape.mjs` Git blob `af076d67492a677d2235e4730aef8cdf4808e106`、Road5元全頂点面 `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、元B48道路7本/B51動体28体/240Hz/球0.65m/6Camera/元研究Cameraを保護。main/公式`p101-velocity-overdrive-native-trial`/Draft PR #46（Open/Draft/未merge）/本番2サイト変更禁止。追加課金0円、Work/Computer Use事前承認、Windows手作業0。正式ART採用**0件**、Slope2 DNA正式認定**0m**、ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。実研究幅26.3mの道路を本番Road5と誤認禁止。
