# K4BY — CC0真正2Kレース路面PBR + 海辺公共施設を現実の建築として改修（研究）

2026年11月4日。隔離研究ブランチ：`research/k4by-photoreal-road-occupied-harbor-art-20261104`。**正式採用0件、Slope2 DNA0m、ART REJECTを前提に現実の実制作画像だけで評価する。** 新規プロジェクトではない。

## 上位方針・前工程

[K4BX A3真正美術監査](R19_A6P4_R2F5K4BX_TRUE_HEADLAND_WORKING_HARBOR_JA.md) では編集可能Blenderの岬・遠景・港湾が実画像に映り TECH PASS。しかし幅の広い灰色Road5が画面を大きく占め、港の建築は薄い屋根板とガラス面に見え、画面の現実感が不足したため**ART REJECT**。よってK4BYは「岬/小屋/木/手すりをさらに量産する」のでなく、**画面中央の本物らしいアスファルト材と右近景の公共施設の建築的整合性**だけを重点研究する。

- **真正Blender親原本**：K4BX A3 [Actions #41824656344](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41824656344)、Artifact #13318234253、`K4BX_HEADLAND_WORKING_SEAPORT_CINEMATIC_EDITABLE_NATIVE_ART_HOLD.blend` SHA256 `1cdf3233d3b2b91b1e10b6f7b2212ef9ec74331667ca4129a4e96ce43b4c2179`。K4BYはこれを**直接SHA検証して変更禁止原本の複製を研究**、元Game/Road5/Camera/木のTransformを毎回監査。
- 写真材質は <https://polyhaven.com/a/asphalt_track> 公開の実写由来**Asphalt Track CC0レース路面**から2K Diffuse／Roughness／OpenGL Normal各1画像のみ。Poly Haven公式 `/info/asphalt_track` と `/files/asphalt_track` から原URL、Vendor MD5と実サイズを独立SHAで検査する。総32MiB以下、1素材14MiB以下、HTTPS公式配布ホストのみ。オフライン研究用編集可能.blendに元Vendor実画像をSHA確認してPack。新しい有料API0円、ダウンロード失敗ならHOLD。
- 元ゲームRoad5は編集禁止。K4BWで既に製作した `K4BW | continuous source-sampled procedural road patina surface` という**研究専用オーバーレイ**に対してのみ、旧手続き的な道路マテリアルを公式写真材質PBRへ置換。幾何の各頂点を元11307 Camera・道路の正横方向から実距離（2m/テクスチャ）でUVに変換し、近景で画像の伸びや虚偽な縦線を抑える。元Game/物理/標準Road5材質・頂点・面は絶対不変。
- 実建築は**新しい巨大な箱を増やさず**、既存K4BW本物の `folded coastal museum and boat service canopy shell` に実物厚0.28mのSolidify・巻きエッジを付与し、風雨に耐える亜鉛金属の縁、木・石積の壁面、実際の開口（元の該当ガラス1面を研究画像だけ非表示にし、凹んだ玄関・框・扉と梁を追加）を形状で構築。遠くの6棟も既存屋根を0.22mに厚くするが、増殖させない。これらは真DCC用のみ。
- [真正K4BY CI #41828751760](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41828751760)はこの文書作成時**結果未確認**。実Blender EEVEEを元の同CHASEカメラで768×480の1フレームだけレンダリング、編集可能.blendと画像を個別SHAで固定し、元K4BXと実同Camera比較する。CIがSUCCESSでも**人間が真正PNGの道路面と港の建築を目視するまでART PASS扱いを禁止**。意味のないRGB差分閾値は用いない。

## 絶対保護契約

元Game Git Blob `af076d67492a677d2235e4730aef8cdf4808e106`、元B48 Road5全頂点・面 `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、元6Cameraと元研究CHASEカメラ、元B48 7道路／B51 28動体／240Hz／球半径0.65m／元9本の木の行列を保護。研究用ブレンダーはゲームWebGL2ではない。新ゲームCollider0、main、公式`p101-velocity-overdrive-native-trial`、Draft PR#46、本番2サイト不変更。**ART採用0、Slope2 DNA0m、SAT/CCD/HUMAN/FPS/RELEASE/MERGE全HOLD**。Work/Computer Useは個別事前承認。追加有料API0円。ユーザーWindows操作0。

## 次K4BZの研究分岐

本物の同CHASE画像を開き、写真材質が道路幅に対して不自然に拡大・繰返しされていないか、木や石垣や建築の陰影の縮尺が適切か、玄関が見えるか、屋根が浮いた膜に見えるかで局所判断。失敗なら元SHA原本に戻せる研究Blender内の可逆変更だけを最小修正する。全画面で世界級のARTに届く前に6Road展開やゲーム統合を行わない。
