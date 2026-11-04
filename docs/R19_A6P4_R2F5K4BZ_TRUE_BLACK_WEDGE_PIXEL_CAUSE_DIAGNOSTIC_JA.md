# K4BZ — 黒い路面三角筋の原因同定：実CHASE画像×真正Blenderレイ・材質・遮蔽診断

基準：2026-11-04。隔離枝 `research/k4bz-true-chase-black-wedge-object-shadow-audit-20261104`。元K4BY A3真正Blender原本を**一切改変しない**非破壊調査。今回は美術を推測修正する工程ではなく、黒い筋の原因である「描画された面／実物材質／影」を切り分ける工程。**新しいゲーム構築・正式採用なし**。

## 元正本・原因未確定のまま守ること

- [K4BY正式監査・TECH PASS／ART REJECT](R19_A6P4_R2F5K4BY_TRUE_CC0_ROAD_OCCUPIED_HARBOR_JA.md)。最後の真正.blend SHA256 `f0d3d7a27e5fbf599447b0e784b71684ff634b071d283f8b59bdaf06a179d4e4`、元CHASE画像 SHA256 `ad46b5377fd9d144c7ab94b428df52d5f97cb7675fe44c3d14389b7858c925f7` を**固定**。真正原本 Artifact [#13321649653](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41831182680/artifacts/13321649653)。原本を再レンダリングせずに原因候補を調べる。
- 画像幅768×高さ480、左上原点。暗部ピクセル座標は (292,300)、(280,330)、(267,360)、(250,400)、(235,440)、(225,470)。同じ行の正常路面を (317,300)、(310,330)、(310,360)、(295,400)、(280,440)、(270,470) として同時比較する。真正PNGのRGB平均差はそれぞれ約30〜36階調、存在は確定。**材質／別オブジェクトの重なり／太陽光影のどれが原因かは未確定**。
- `scripts/p101-k4bz-true-pixel-object-shadow-audit.py` は、元K4BY A3 BlEndとPNGの**実バイトSHA256を先に照合**し、元6Camera/CHASE/元B48 7Road/B51 28動体/元9木の状態を守りつつ、元CHASE実投影のピクセル光線からBlender Scene Raycastを行う。各暗点／比較点の最初のメッシュ（オブジェクト名、ポリゴン番号、材質名、法線）と背後5層、元Sunに向かう影遮蔽物候補を監査。背景画像をでっちあげたり、ゲームのコライダーを編集したりしない。
- **レイの交差は直接の陰影レンダリング証明ではない。** レンダーの表示/隠蔽状態とレイのScene内オブジェクトが異なる可能性、陰影マップや接触影の相違があるため、単に影遮蔽レイに何か当たっただけで「原因を特定した」と誤報しない。原因が絞られたら次工程で**同じカメラの限定的な影/単一オブジェクト表示A/B**を研究専用コピーで行い、真の描画ピクセル変化と照合する。
- [K4BZ初回Actions #41834276872](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41834276872) はこの文書記述時点で結果未確認。出力は JSON、真正PNG上に赤=異常・緑=比較点を付けた診断マーカー1枚で、**新Blenderレンダリングも新DCC幾何実装もなし**。CI結果と調査結果は事実を検証して追記する。

## 上位方針保護

元Game Blob `af076d67492a677d2235e4730aef8cdf4808e106`、元B48 Road5全頂点/面指紋 `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、元6Camera／CHASE、元9木、B48 7 Road／B51 28 Mover／240Hz／球半径0.65m、main／公式P101／Draft PR #46／本番2サイトを変更しない。ゲームCollider追加0。正式ART採用**0件**、Slope2 DNA**0m**。SAT／CCD／HUMAN／FPS／RELEASE／MERGE全HOLD。Work/Computer Useは別途事前承認、追加有料API0円、ユーザーのWindows操作0。美術水準が改善していないのにTECH PASSをART PASSに読み替えることを禁止。

## 【K4BZ R1確定】実Blender12ピクセル・シーンレイ診断PASS

[Actions #41834276872](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41834276872)は **completed/SUCCESS**、非破壊・無再レンダリング。真正K4BY A3原本.blend SHA256 `f0d3d7a27e5fbf599447b0e784b71684ff634b071d283f8b59bdaf06a179d4e4` と元CHASE実PNG SHA256 `ad46b5377fd9d144c7ab94b428df52d5f97cb7675fe44c3d14389b7858c925f7` を固定検証。スクリーンの12地点から最初の描画候補と裏側5層まで本物のBlender Scene Raycast。追加レンダー0回。

- 暗部6地点の**全6/6**：`K4BY | actual source raycast 1m road surface | NO GAME COLLIDER`、材質 `K4BY | genuine CC0 Asphalt Track 2K road PBR study`、最初の交差面を同定。
- 正常路面6地点の**全6/6**：`K4BQ / physically variegated 26m curved material research test`、材質 `K4BR | ACTUAL CC0 PHOTO PBR | worn asphalt high-resolution surf`、最初の交差面を同定。つまり、暗部と正常部で**手前にある本当の道路研究メッシュ・写真材質が切り替わっていることは事実**。
- 太陽 `K4BQ / natural sun eastward cut` は唯一の表示有効SUN。真の暗点と比較点のSUN方向レイは全12地点とも遮蔽物なし。従来「黒い筋は手すり等の投影影」という推測を採用しない。ただし Blender Scene Raycast の遮蔽物テストだけで照明/影の最終因果を証明したわけではない。
- [本物のレイ識別JSON](research-evidence/k4bz/K4BZ_REAL_CHASE_BLACK_WEDGE_PER_PIXEL_GEOMETRY_SHADOW_CANDIDATES.json)、[元画像上の12地点診断マーカー](research-evidence/k4bz/K4BZ_SOURCE_IMAGE_12_REAL_PIXEL_GEOMETRY_AUDIT_MARKERS_NOT_GAME.png)をGitHub研究枝に保存。診断 PNG SHA256 `41bb46e319409f4918dea90c5edb7cc553aac6f5e10b1837d8bfc13ea5c670b3`。元ゲーム/ソース/カメラ原本に一切書き込みなし。
- **原因候補最有力**：K4BYの高密度レイキャスト舗装と、既存K4BQの別写真路面が互いに前後し、異なるPBRの境界が斜めの筋に見えること。色差・前後の交差とSunレイはこれを支持するが、この時点では**「描画上の因果関係は未証明」**。公式のバグ修正と呼ぶ前に同じカメラで**1オブジェクトだけを非表示**にする限定的なA/Bを実施する。
- [R2 1オブジェクトA/B Actions #41835036099](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41835036099) は記載時点で結果未確認。元K4BY真正.blendの隔離コピー内で**非ゲーム研究用K4BY舗装1オブジェクトのみhide_render**、他のK4BQ路面・元Road5・全照明・Camera・本物の木9本・原本は全てそのまま。技術/美術成功は新実画像と監査を見て判断。

## 【K4BZ R2確定・真の1オブジェクトA/B】黒筋の直接原因を実証

- [真正Blender Actions #41835036099](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41835036099) completed/SUCCESS。元K4BY A3編集可能.blend SHA256 f0d3d7a27e5fbf599447b0e784b71684ff634b071d283f8b59bdaf06a179d4e4 を再読込した**独立研究コピー**で、非ゲーム研究用の「K4BY | actual source raycast 1m road surface | NO GAME COLLIDER」1オブジェクトのみ hide_render=True。他のK4BQ写真道路、元Game Road5全頂点面、CHASE、元6Camera、元木9本、全光源の配置と強度は不変。
- 768×480元CHASE同カメラで実Blender EEVEE再レンダリング。黒筋の6座標は明度が平均**+31.945階調**、黒筋vs正常路面の明度差は平均約**32.56→0.56階調**。正常路面比較6点はほぼ変化なし。**真正A/B画像で黒い三角筋の消失も目視で確認**。
- これにより**黒筋が生じる直接原因はK4BY研究用PBRロード表面の描画**だと制御試験で確認できた。R1の真Blenderレイは黒筋6/6=K4BY写真路面、正常6/6=K4BQ別写真路面。研究用の2つの道路表面と材質の可視境界による不連続が最も整合的な説明。ただし光の反射・法線など色の生成機構の細分類は未確定で、元Game Road5の不具合と誤認しない。
- 編集可能な修正研究.blend SHA256 162a7baaf7594b36a134457bee817bd7dcf0ef1b3e581419d6561efa92e45382（271,569,072B）。真正修正CHASE PNG SHA256 d82a367f49623a8ed2a75a4540ba8a6de07f976a51d49f4dbb20673243576df7（478,137B）。[真正旧新比較](research-evidence/k4bz/K4BZ_SINGLE_OBJECT_HIDDEN_VS_CANONICAL_CHASE_TRUE_RENDER_AB.png) SHA256 2b6430801b8b3a75c6e0eeee66f42007e8ebcce83b22a7281a5d41eb04799627。[独立画素監査JSON](research-evidence/k4bz/K4BZ_ONE_OBJECT_ABLATION_AUTHENTIC_NATIVE_AUDIT.json)。[編集可能Blender原本Artifact #13327120155](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41835036099/artifacts/13327120155) ZIP CRC PASS、各画像個別SHA確認済み。
- **局所黒筋TECH FIX PASS、全画面ART REJECT**。車道全体の広さと単調さ、自然地形と港の建築の模型感は残存。正式ART採用0、Slope2 DNA0m、SAT/CCD/HUMAN/FPS/RELEASE/MERGE HOLD。
- K4BZ R3として、真A3 PNG/修正R2 PNGのSHAと6組の画素RGB、元ゲーム不変、非表示にしたオブジェクト1つのみという監査を軽量CIで再検証する。これは限定的な**再発防止テスト**であり「世界水準ART」の定量合格基準ではない。[R3 Actions #41840882396](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41840882396) は本文追記時点で結果未確認。再レンダリングなし。

### 次K4CAへの条件

ゲーム原本の表面に新たな別舗装を重複させず、証拠のある唯一の修正（K4BYの研究用問題表層非表示）を保護。**写真材質の継ぎ目を憶測で修正する反復は終了**。次は同CHASE全画面で本物の沿岸都市の建築・地形・画面構図の美術品質を上げる工程へ戻る。ただし新Game Road5/6Camera/COLLIDER/MAIN/PR #46/本番への変更・採用は禁止。元Game blob af076d67492a677d2235e4730aef8cdf4808e106、元Road5 SHA f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2 を保護。

## 【K4BZ R3最終確定】軽量回帰試験 SUCCESS・黒筋を消した修正を保護

[GitHub Actions #41840882396](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41840882396) **completed/SUCCESS**。Blenderなし・新レンダリングなし・追加モデルDLなしで、tests/p101-k4bz-proven-dark-wedge-regression.py を実行。元K4BY A3正式研究画像とK4BZ R2修正研究画像の固定SHA256を検証し、6組12地点の実RGBが監査JSONとすべて一致すること、黒い筋の6画素が正常側の路面へ近づいたこと、正常側6画素が不変であること、元ゲームソースBlob・元Road5 SHA・6カメラ・9木・全照明・唯一の非ゲーム用非表示オブジェクトを区別できることを確認した。

**最終K4BZ：R1真レイ原因切り分けTECH PASS、R2真同CHASE 1オブジェクト除去TECH FIX PASS、R3軽量再発防止TECH PASS。** 正式ARTはREJECT、正式採用0件、Slope2 DNA0m。これはゲームでの最終走行品質の検証ではなく、真正Blender研究画像内の1つの局所欠陥の修正・保護である。元Game・Road5・公式P101・main・Draft PR #46・本番2サイトに一切変更なし。

**次K4CA**：K4BZで証明した黒筋の修正を動かさず、真の同CHASE画面の低品質が残る道路の広さ、左側の地形・海岸接続、港の建築・生活感の作者美術を改善する。物理・カメラ・既存原本は引き続き固定、正式ART合格0件を維持し、作品全体の美術検証ができるまでは現ゲームへ反映しない。
