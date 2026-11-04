# K4CA A1→A2 — 真正画像美術評価と安全な再試験の記録

2026-11-04 JST。研究専用。元ゲームは変更しない。

## A1 真正技術成功、目視美術REJECT

- [K4CA A1 CI #41847858655](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41847858655) SUCCESS。先に #41847033140 はPIL導入順の不備、#41847318174 はBlender非描画原本メッシュへのRaycastが原因で安全停止。環境と実可視レイ検査を修正し成功した。
- 本物のK4BZ R2編集可能Blender SHA256 162a7baaf7594b36a134457bee817bd7dcf0ef1b3e581419d6561efa92e45382 から、可視左地形 K4BQ EAST_SLOPING_HILLSIDE の頂点・面を保持し、地質PBR材質のみ更新。元の真正Poly Haven CC0 island_tree_02を2本だけ位置(113,255)/(202,274)の実地形Raycastへ接地配置。旧木9本、元6Camera/CHASE、物理Road5、照明は不変。黒筋は戻らなかった。
- 編集可能A1 Blender 271,620,488B SHA256 7b879e56bc04f2db5b3a8607e2da798f728fd9cfe9b5cbbba1bb0ba9d9375a3e。
- A1真正同CHASE 768x480 PNG 477,109B SHA256 e51daeda02ce3e216f797b3dbaf3f7a0e7d93123ee64849d77ea95fd00cfd49a。
- [本物のK4BZ→K4CA A1比較画像](research-evidence/k4ca/K4CA_VS_K4BZ_TRUE_SAME_CHASE_COASTAL_SLOPE_PHOTO_CANOPY_ART_REVIEW_NOT_GAME.png) SHA256 bf6d11ac49c7f49bfcaf3284f710caa788a1b3ddfbb1ffca1ad15559d09cddfc。
- [A1 Artifact #13333166929](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41847858655/artifacts/13333166929) ZIP 122,704,490 B SHA256 1826c9b9a3677f84ca2650a4b178d01564006f904ecdb8fee7c98b97bfd90152。実ZIP CRCと個別画像SHA一致。
- **A1 ART REJECT**：左側の地面が白っぽい・チョーク状で自然な海岸地質に見えない。2本の真木は小さな立体として見えるが、全体の道路が単調で右港建築が模型のような問題は残る。TECH PASSをART合格とは扱わない。

## A2 再試験

- 新しい巨大な地形・道路の二重化を追加しない。A1で白くなった左斜面の色だけを暖色・低輝度の岩へ調整、真木2本の位置と原本・CHASEは固定。K4BZの黒筋再発防止試験を必須とする。
- [A2 CI #41849818268](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41849818268) は記録時点で進行中。実画像確認前のART合格は主張禁止。

## 恒久的な保護

元Game Blob af076d67492a677d2235e4730aef8cdf4808e106。元Road5全頂点面 f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2。B48 7Road/B51 28Mover/240Hz/球0.65m、元6Camera、研究CHASE、9本の木、main、公式P101、Draft PR #46、本番2サイト不変。正式ART採用0件／Slope2 DNA0m、SAT/CCD/HUMAN/FPS/RELEASE/MERGE全HOLD。Work/Computer Use事前承認、追加有料API0円、Windows操作0。

## A2 完了：真の編集可能Blenderと画像再照合

- [真正Blender CI #41849818268](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41849818268) は **completed/SUCCESS**。同じK4BZ R2親.blendの固定SHAをチェックし、旧6Camera/CHASE/木9本/光源/元B48 Road5/元Game Blobを変えず、左K4BQの同一丘陵メッシュに付ける研究マテリアルの地質カラーパレットのみを低輝度暖色砂岩へ修正した。新しい崖/二重舗装/偽スクリーン材はなし。元K4BZの黒い路面筋も再発せず、真正CC0 tree master由来の2本は同じRaycast座標。
- A2真編集可能Blender 271,620,488 B、SHA256 299f1972e3383a7fc0047409a0f58581da3884988749dff6842a80cdf49a3ffa。
- A2真同CHASE 768×480 PNG 476,441 B、SHA256 e864aa1cdcc7707370c47e0542580cd6963f8e2fb9deada8cf0a9752dd8f84d6。
- [K4BZ→K4CA A2真同Camera比較](research-evidence/k4ca/K4CA_VS_K4BZ_TRUE_SAME_CHASE_COASTAL_SLOPE_PHOTO_CANOPY_ART_REVIEW_NOT_GAME.png) 430,170 B、SHA256 a7843378e17a113e07d6d6a9b3ea4e090b55458fb49a4c1bd389db4b31b3b1f9。
- [A2研究原本+画像 Artifact #13334366579](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41849818268/artifacts/13334366579) ZIP 122,648,582 B、SHA256 201a290b04165b5f70da4f88705f34d9c7fdc27edca6e42c2311674807708788。実ファイルのZIP全CRC PASS、個別PNGと監査SHA一致。
- 真正A1/A2同画面の左斜面RGB比較：例、(70,350) A1 (160,163,157) → A2 (132,133,126)。色は明瞭に改善。旧K4BZでは同位置(111,104,88)。ただしこの色差をARTスコアにはしない。
- A2画像の局所目視判定：A1の不自然な白っぽさを抑えた。真正2本の樹木は接地して映る一方、地面は起伏・自然な風化の表現不足、右港湾も薄い模型的な建築のまま。道路占有面積も過大。**A2 TECH PASS／ART REJECT、正式採用0件、Slope2 DNA0m**。本番へ素材採用しない。
- [K4CA A2ソース保護・実画像12ピクセル回帰CI #41850910734](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41850910734) を新設。元K4BZ真正PNGとK4CA A2の固定SHA、既知6組の黒筋消失、右港や中央元道路の8座標が完全に同じRGB、左地形のみ変化を軽量検証。これはTECH/回帰テストのみで美術合格の指標ではない。CI結果は実行完了後に確定する。

## 次K4CBの論点：色だけの改善では不足

写真レベルの自然な地質マテリアル、岩層と走行路肩の接地、生活感のある右港の施設と街路、速度感のある全画面構図が未解決。K4CAの樹木2本+材質トーン補正を過大評価して正式採用へ進めず、**次は低品質な単純3Dの追加よりも実材質と元建築の造形の根本改善**へ集中する。元Game Road5/6Camera/物理/B48/B51/公式PR/main/本番保護とART REJECTは継承。

## A2画像保護の軽量CI最終検証

[Actions #41850910734](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41850910734) **completed/SUCCESS**。Blender再レンダリングなし。元K4BZ R2とK4CA A2真正PNGの固定SHA、K4BZで除去した黒筋6対の画素維持、中央道路・右港湾の指定8地点のRGB完全一致、左斜面の指定5地点の実画像変化、元Road5/6Camera/9木/照明/元Game保護を監査。既知の問題が再発していないことは技術上確認済み。**美術は依然ART REJECT**。
