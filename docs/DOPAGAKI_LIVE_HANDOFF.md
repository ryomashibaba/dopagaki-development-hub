# DOPAGAKI SLOPE — LIVE HANDOFF（2026-10-31 JST・R19 A6 P3実カメラ検証コード完成／CI待ち・ART REJECT継続）

**本来の不変目標**：本物の7,280m・約52秒級Slope2高速ゲーム（200m/s級、本物のカーブ・細道・ジャンプ・動体）と、圧倒的に美しく一体的な超未来巨大都市を**同じ人間プレイ体験で**成立させる。Slope2 DNA目標2,912m、正式認定0m。正式ART採用0件。技術QAの成功をART/GAMEPLAY/HUMAN合格と混同しない。


## 最新 R19 A6 P3 — 実カメラ12時刻・B51/道路0・1配置計測へ（CI待ち・未認定）

- [P3専用GitHub Actions #41182781084](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41182781084) は最初の確認時点で**queued**。ソース、CI、検査コードはPR #46の研究ブランチへコミットしたが、**生カメラ12枚と配置候補の実測成功は未確認**。公式ART0件、Slope2 DNA認定0m、GAMEPLAY/HUMAN/PERFORMANCE/RELEASE/MERGE HOLD。
- 元sourceの`viewForPose`・WebGL2 GLSL係数1.35、真カメラeye/front/right/up/viewport、28物理B51の真OBB現在位置/向きを**PRIVATE copyに読み取り専用**で追加。元14m/28m×6 native ticksの元Canvas画像・A0物理一致を計測するCIを用意。実道路0/1各81サンプルを使った**縦型都市区画の画面投影候補**も、実カメラに照合するコードを実装。
- **B51 OBB投影≠GPUピクセル可視/遮蔽**、配置候補≠都市3D完成、評価スコア≠美しさ。これらを混同しない。前P2の巨大な吊りリボン・反復柱もART REJECTのまま。
- [P3実装と技術/美術ゲート](R19_A6P3_TRUE_CAMERA_B51_GEOMETRY_FIRST_SITE_GATE_JA.md)。次に必要なのは真正CI実測、原12画像とカメラ・実B51の視認監査。その後**カメラで見える立体都市主役・縦区画・公共空洞**を美術制作し、実画面で判定。単純な箱・巨大門・水平リボンへ回帰禁止。

## 最新 R19 A6 P2（本物の5地区Blender全面再設計・真正12画像ART REJECT）

- [GitHub Actions #41181717911](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41181717911) **全SUCCESS**。元source Blob `af076d67492a677d2235e4730aef8cdf4808e106`、正規7 B48/28 B51、240Hz物理、RAW camera/HUD無改変。元道路0/1各81断面を14m・28mで採取し、実Blender 4.0.2で旧A5箱形を**5地区とも別の真3Dへ置換**、本物の`.blend`2件/編集GLB2件を生成。元source SHA・indexed/TRS/COLOR再読込PASS。5建築オブジェクト、実GPU **33,700三角形**、非衝突0。
- 元14m/28m×元0〜12秒6時刻の**真正12 WebGL2 Canvas画像全取得**、球XYZ差最大0.0007703576m、速度差最大0.0004716m/s、B51=28、カメラ同tick。旧A5から画素は12/12枚変わったが美術認定ではない。[原Artifact #13034723431](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41181717911/artifacts/13034723431)（2026-11-07 07:46 UTC失効予定・永久バイナリ化は未実施）。
- **ARTはREJECT。** Road1の空虚な空とRoad0右側の旧箱は減ったが、新しい巨大水平曲面帯と長い吊り脚が4.404s/8.004s/11.504sで視野上部を覆い、都市ではなく浮遊高架に見える。前の巨大門失敗を巨大リボンに置換しただけ。実B51の見やすさ・人間走行・Windows/iPhone GPU FPSは**HOLD**、正式ART採用0・Slope2 DNA認定0m。ART成功を偽装しない。
- **次P3：** 先に本物の6元カメラの位置・向き・視錐台とB51画面マスクを記録し、実画像の構図から都市の主役と縦の建築区画/中庭/都市基盤を再設計。旧箱・巨大門・長い水平リボン・ぶら下がる脚の反復は禁止。真Blender→GLB→元ゲーム描画基盤は再利用。成果と反省は[A6 P2完全監査](R19_A6P2_REAL_B48_SPATIAL_REDESIGN_TRUE12_ART_REJECT_JA.md)。PR #46 OPEN/Draft未マージ、main/本番無改変。

## 旧 R19 A6 P1（実Blender編集の技術PASS・真正美術REJECT）

- **本物のBlender 4.0.2で**、A5 14m/28m GLB各5地区を import→三次元メッシュ編集（非対称彫塑+主役地区の立体曲面）→編集可能 `.blend`・編集GLB保存。10,566→**10,728三角形**（+162）、5独立地区、非衝突0追加。Node独立のindexed glTF/node変換/色データのGPU再読込PASS。**Blender GUI手動で作品を完成させたとの主張ではない**。
- [専用Actions #41180479851](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41180479851) **SUCCESS**。元14m/28m×元6tickの実WebGL2 Canvas**12/12撮影・旧A5とのSHA画像差12/12**。元240Hz球XYZ誤差最大0.0007703576m／速度誤差最大0.0004716m/s、元道路7/B51 28/元カメラHUD保持。
- [Artifact #13034364524](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41180479851/artifacts/13034364524)：実`.blend`2件・GLB2件・12真正写真/QA記録、2026-11-07 UTC失効予定。**バイナリ恒久GitHub原本化は未実施**。ソーススクリプトはこのブランチに保存。
- **ARTは厳格REJECT**。4.404秒の右の孤立した箱/フレームと、8.004秒Road1の空虚な前景・右端だけの巨大建築がそのまま残る。僅かな曲面化やPNG差を美術改善と偽らない。正式ART0件／Slope2 DNA認定0m、GAMEPLAY/HUMAN/PERFORMANCE/RELEASE/MERGE HOLD。
- **次R19 A6 P2**：旧箱・門・微小変形の続きは中止。元6視点をもとに**道路0/1の遠中近景の都市主役配置と連続街区を抜本再設計**する。特にRoad1 8〜11.5秒の正面を埋める本物の巨大都市と、14m細道4.404秒のB51危険認知の両立。作成済みBlender↔GLB↔PRIVATE元ゲーム検証基盤を再利用。[完全監査](R19_A6P1_REAL_BLENDER_EDITED_GLBS_NATIVE12_ART_REJECT_JA.md)。


## 最新 R19 A6 P0（技術限定PASS）

- A5元14m/28mそれぞれの**5独立メッシュ・5仮材料・10,566三角形の真正GLB**をSHA固定で実バイナリ読込し、全GPU XYZRGB float32を元直接ソースと照合して完全一致。改ざん/別モード/別blobの負のゲートを拒否。Blender GUIでの実編集・再書出しは未実施。
- [真正GitHub Actions #41179550859](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41179550859) **全ジョブSUCCESS**：元A5直接都市の生WebGL2 24PNGを再収集後、GLB由来PRIVATE描画で元14m/28m×4.404sと8.004sの4枚を原同tick画像とSHA256 **4/4完全一致**。元球位置/速度・7 B48/28 B51・240Hz RAW cameraを検査。元source blob保護。
- [原Artifact #13033983651](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41179550859/artifacts/13033983651)：約664kB、2026-11-07 07:13 UTC失効予定。CI検査HEAD `038872b79a91ad70f68b6645652c795c76291cb2`、後続docs/Windows cmdは同CI未検査。
- **最終判定はR19 A6 P0 SOURCE GLB READBACK TECH PASS／ART REJECT。** A5の孤立箱・門・偽地盤と視認問題は解決していない。正式ART0件／Slope2認定0m／HUMAN・GAMEPLAY・PERFORMANCE・RELEASE・MERGE HOLD。
- **次工程A6 P1/P2：** 実編集可能GLBをBlender等で修正し、indexed geometry/node transform/材質の検証済み再取込を確立。元6視点で遠中近景の都市一体感を大幅に改善して厳しくART判定する。単純なJS箱/門の追加は禁止。Windows手動14m/28mと原B51の真視認/GPU FPSは別途HOLD。[詳細証拠](R19_A6_P0_ORIGINAL_GLB_PRIVATE_ROUNDTRIP_AND_ART_GATE_JA.md)／[時間構図マスタープラン](R19_A6_SIX_TRUE_CAMERA_CITY_ART_MASTERPLAN_JA.md)。


## 永久保護
元WebGL2 `web/p101-w9c2-g4e7ci-integrated-streetscape.mjs` Git Blob `af076d67492a677d2235e4730aef8cdf4808e106`、元240Hz CCD、球r0.65m、実B48道路7本／本物B51動体28基、元P96/P94/A13、元RAWカメラ/HUD。本番/main/Gold/P100/W9-X/B5無改変。作業は`p101-velocity-overdrive-native-trial` Draft PR #46 OPEN未マージのPRIVATEのみ。透明床・磁石救済・偽減速/完走/資格詐称は禁止。

## A0〜A4の独立証拠
- R19 A0本物の0秒→12秒、ULTRA14m/CONTROL28m両走行継続、警告1.104s→真狭路コア4.404s（3.3s）、ULTRA補間の真幅13.159〜14m、概算路肩最小1.743m。人間が操作できる保証ではない。
- A1の元Native同tick24WebGL2画像、A2の真36画像でW9巨大壁・G5B/Mega重なりとB51装飾架台を画像寄与で特定。旧美術REJECT。
- A3は巨大白棚・柱が再発してART REJECT。A3Rはroad1の8/11.5秒にも構造が現れるが薄い骨組み/巨大門でART REJECT。
- A4は34ベイの本物の建築奥行き、5独立オブジェクトのglTF2編集GLB×2、真WebGL2元24画像・物理同tickでSOURCE TECH PASS。ただし建物が空中で孤立し、都市の内部機能/基盤がなくART REJECT。元証拠 #13019567092。

## R19 A5（過去の正式ART REJECT）
- **同じ1都市案RIFT CIVIC BASILICA**を再改修。主役1/公共地区4、34の厚みのある建築ベイに加え、**15件の多角形段状都市基盤・10件の公共空間の隙間・10件の下部支持部材・5件の景観アクセス**、合計**10,566三角形**の元B48ソース位置の独立5地区3D。元道路・B51本体/カメラ/操作を変えず、衝突追加0。
- **glTF2 GLBをULTRA14m/CONTROL28m各1件**、いずれもBlender等で5つの独立建築区画と**5個の仮編集マテリアル**を編集可能。1件約765kB。第三者`trimesh`で両方を5ジオメトリ、合計10,566面として正常読込、各SHA確認。Blender GUI実操作は未確認。光は元RGB頂点の簡易方向シェードであって**本物のPBRやシャドウは未実装**、実地形へ接地したとの証明もない。
- 最新[Actions #41144200111](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41144200111) **全ジョブSUCCESS**、原元Canvas画像24/24 SHA、元Native球XYZ最大誤差0.00077036m/速度0.0004716m/s、元7 B48/28 B51、GLB双方SHA・編集用5メッシュ構造を確認。一次Artifact #13019233506（ZIP SHA256 `2f05fcd04fcfc369cea8dacc268af746046f94b4cd4346fa57172aceb0c9d300`、2026-11-06 23:26 UTC失効）。
- 同じ元14m生カメラのCity ON/OFF中央ROI画素差：1.104s 4.230%、3.004s 9.750%、4.404s 10.576%、5.204s 3.658%、8.004s 1.383%、11.504s 6.508%。**ピクセル差は美しさ/遮蔽の割合ではない。**
- **ART REJECT**。建築の下へ都市基盤が加わったものの、実画面は近景の孤立した箱型建物・柱・門状フレームと空白が大半。元14m細道コア4.404秒の側面視界占有が増え、元B51の初見読解に関する安全性は未証明。8〜11.5秒でも巨大な実都市として連続しない。15基盤や10,566面を質の合格とすることは禁止。
- 詳細：[A5の完全独立監査](R19_A5_TRUE24_GLB5_ART_REJECT_AND_SOURCE_GAME_CONTINUITY_JA.md)、[A5設計](R19_A5_CIVIC_TERRACES_FIVE_EDITABLE_MATERIALS_GENUINE_CAMERA_GATE_JA.md)。

## A5時点の旧次工程記録（A6 P0技術検証で部分達成・美術は未解決）
**似た箱/門/基盤を増やす工程は停止**。A6は制作方法の進化：今回確実に作った5オブジェクトGLBを本当のデザイン原本として編集し、PRIVATE元WebGL2に安全に再読み込みできる入出力基盤を構築。元の6カメラで道路0/1の遠景・中景・近景と一体都市の造形を先に判断。既存スクリプト/CIを再利用し、高品質建築の外皮・視覚機能・色/照明と街のつながりを優先する。Windows RTXの人間14m/28m実プレイとFPS/B51のピクセル視認は別ゲートでHOLD。

**正式ART0件、Slope2 DNA 0m、GAMEPLAY/HUMAN/PERFORMANCE/RELEASE/MERGE HOLD。**
