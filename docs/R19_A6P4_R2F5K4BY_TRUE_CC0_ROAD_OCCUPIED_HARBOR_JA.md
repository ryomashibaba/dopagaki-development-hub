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

## 【2026-11-04 K4BY A1～A3実検証確定】真正PBR＋公共施設TECH PASS／画面ART REJECT

**正式ART採用0件、Slope2 DNA0mを維持。全て実Blender研究のみ。**

1. 初回CI [#41828751760](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41828751760)は **FAILURE**。元K4BX A3.BlendとゲームSHA確認、公式Poly Haven `asphalt_track` 2K色・粗さ・OpenGL法線の3枚（計**9,656,072バイト**）を公式URLの実サイズ・MD5／独立SHA256で取得、BlenderにPackする工程までは進んだ。しかし遠景の建築屋根の長いオブジェクト名がBlenderによって短縮され、文字列検索で対象0件として安全停止した。ソースの `ACTUAL_USE=WEATHERPROOF_HARBOR_ROOF` 属性に変更して修正した。
2. A1最初の成功CI [#41829344849](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41829344849)は **SUCCESS**。写真PBRを先代K4BW研究用舗装スキンのUVへマッピングし、元の公共施設の屋根0.28m／遠景6建築屋根0.22mの厚み、海辺施設の外壁・玄関1室を修正した。真正編集可能.blend **271,175,516 B／SHA256 `cd35b8e85f1f57551b7320799c8be6304690f54bba2db1a2719e5bb1b1577480`**、同CHASE 768×480実画像 **480,023 B／SHA256 `60f996c18fde8cfbc6ff71cd4beb17237cbb22729e6a5e34b632f72dfa0d5c46`**。Artifact ZIP SHA256 `4bbf811c97556c62e527aa71c9465239061def31164d7c1c7cd2b5d608071c0a`、外部独立CRC PASS、個別ハッシュPASS。**実画像ART REJECT**：黒い細長い三角状の筋が左車線に残り、港湾建物も薄い模型感が残る。
3. A2 [#41830277784](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41830277784) は **SUCCESS**。A1と従来スキンの継ぎ目由来を疑い、元Gameの真正Road5の頂点面指紋と同じメッシュを**別研究表示コピー**として作り、上向きの2,160面に実PBRを表示。元Game colliderは0追加・元ROAD5物理面は不変。真正.blend **271,665,204 B／SHA256 `3af89eda96e046183b509612c5792080958e0a2335c9a4a0c21a8ee0b8b2875a`**、真正PNG **449,752 B／SHA256 `f8f262079b70218c4d80ea24e195044719ec346bda98359d1665d05600e92496`**。Artifact ZIP SHA256 `0421ef5bfbe326acab20cbf4310d56de17d536a7a9a15467ff40ca62337979f4`、外部独立CRC PASS。**実画像ART REJECT：左の路肩が広大に黒くなり、右にも黒い区画が発生。A1より悪化。** コピーした元Road5の上向き面には路肩/斜面が含まれる可能性が高い。正式採用せず研究枝に失敗証拠として保持。
4. A3最終 [#41831182680](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41831182680) は **SUCCESS**。前の広大な暗部を撤回。Road5元実メッシュへ真Ray Castで車道内だけ**3,978頂点・3,800四角面**を1m縦間隔で生成、元Road5から+0.028mの独立非衝突DCC表層に2mスケール実PBRを適用。元Game Road5そのものには書き込まない。真正編集可能Blender `K4BY_TRUE_CC0_ROAD_OCCUPIED_HARBOR_EDITABLE_NATIVE_ART_HOLD.blend` **271,569,072B／SHA256 `f0d3d7a27e5fbf599447b0e784b71684ff634b071d283f8b59bdaf06a179d4e4`**、真正同CHASE画像 `K4BY_ONE_SAME_CHASE_TRUE_PBR_RACE_ROAD_CIVIC_HARBOR_NOT_GAME.png` **479,845B／SHA256 `ad46b5377fd9d144c7ab94b428df52d5f97cb7675fe44c3d14389b7858c925f7`**、比較画像 `K4BY_VS_K4BX_A3_SAME_CHASE_TRUE_CC0_ROAD_HARBOR_ART_REVIEW_NOT_GAME.png` SHA256 `366abfe88efd89518d0e7fcf59c2d6c00863fbc09d76edc861c0ad7c368427c0`。Artifact ZIP **122,620,969B／SHA256 `357c55b9bd115ee6d02a87a1a58c1e833fcbc76a3cb29c1347c9f169f8db6bf6`**、実コンテナで `ZipFile.testzip()=None`、全CRC PASS、個別SHA一致。
5. **A3最終目視：TECH PASS／ART REJECT**。A2の巨大な黒い路肩は消えたが、**左車線内部の細い黒い三角形の筋は残存**。元K4BXにも銀色の類似した細線があり、出所は実データだけでは確定できない。PBR写真材質自体は3マップPack/MD5/SHA PASSである一方、画面全体では元の巨大な灰色道路・模型の建物・地表と港の生活感不足が残る。建築の入口や厚さはDCC上にはあるが、768×480の元CHASE画像で高品質な生きた建築として十分読めない。**正式ART採用0件／Slope2 DNA0m**。
6. **不変契約**：元Game Blob `af076d67492a677d2235e4730aef8cdf4808e106`、元Road5全頂点面 `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、元Rig6 Camera／CHASE Camera／古い9本の木、B48 7 Road/B51 28 Mover/240Hz/球半径0.65m、main/公式P101/Draft PR #46/本番2サイト不変。新ゲームCollider0、Work/Computer Use事前承認、追加有料API0、ユーザーWindows操作0。SAT/CCD/HUMAN/FPS/RELEASE/MERGE全HOLD。

### 次K4BZの優先作業：画面上の異常が何から描かれたかを本物の識別子で特定

もうひとつ写真材質や研究用舗装を当てずっぽうで試さない。**同じ真CHASEカメラの左車線に残る三角筋について、Blenderの指定画面ピクセルから、実ジオメトリのRay Cast／オブジェクトID／材質とレンダー遮蔽の前後関係を調べる非破壊診断**を先に実施。元A3、K4BY A1/A2/A3 の同じピクセルを比較し、実際の原因オブジェクトを特定できてから最小の1枚だけ研究修正。もし元Game Road5本体であれば、研究用コピーを安易にゲームへ反映せず、安全ゲートと原本保護を再設計する。原因不明を技術的成功やART合格とは呼ばない。正式ゲーム本体へこの写真PBRや建築変更を反映することは禁止。
