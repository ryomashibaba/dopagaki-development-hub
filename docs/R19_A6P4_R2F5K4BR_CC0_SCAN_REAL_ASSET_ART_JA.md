# K4BR — 実CC0写真測量素材・岩壁3Dモデルの原本証明付きBlender制作試験

2026-11-04 JST。隔離研究ブランチ `research/k4br-cc0-phototexture-source-verified-20261104`。

## 0. 固定目的と前回の失敗
DOPAGAKI SLOPE — HYPER RUSHを世界水準の高速3Dレーシングゲームとして完成するのが最上位目標。技術的なPASSは、美術の合格を意味しない。ユーザー指摘の全体ビジュアル不良を隠さない。K4BQ実Native Blender CI [#41783578592](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41783578592)成功だが、実同一CHASE画像では三角形の松・八面体岩・矩形の草・暗い広大な道路・不自然な海岸文化施設と灯台が目立ち**ART REJECT**。正式ART採用0件、Slope2 DNA認定0m。K4BQ完全監査は [K4BQ文書](R19_A6P4_R2F5K4BQ_GEOLOGICAL_COASTAL_HARBOR_ART_JA.md)。

親K4BQ真正編集可能原本 `K4BQ_GEOLOGICAL_HARBOR_EDITABLE_RESEARCH_ART_HOLD.blend` (SHA256 `5fe3ed2569b807af0b04c46cd1672f83a1c93863a19e958c468369985bd60252`)を完全バイト照合してロードする。元ゲーム`web/p101-w9c2-g4e7ci-integrated-streetscape.mjs` git blob `af076d67492a677d2235e4730aef8cdf4808e106`、B48元7Road/B51元28Mover/240Hz/球半径0.65m/元Rig全6Camera/元Road5 mesh fingerprint `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`不変。main・公式`p101-velocity-overdrive-native-trial`・Draft PR #46・本番2サイト変更禁止。Work/Computer Use事前承認・追加有料API原則0円・Windows操作要求0。

## 1. K4BRの制作方針 — 実物の良い素材を「入手できた場合だけ」採用
Poly Haven公式[Asset License](https://polyhaven.com/license)：全素材CC0、商用利用・再配布可能、個別のクレジットは不要。公式[API発表（2026-07-18）](https://polyhaven.com/uk/our-api)および[API利用規約](https://github.com/Poly-Haven/Public-API/blob/master/ToS.md)：無償APIアクセスは可能だが、ライブAPIに依存するプロダクトにはPoly Havenからの素材提供表示と固有User-Agentが必要。本試験には`DOPAGAKI-SLOPE-K4BR-OpenResearch/1.0`のUAと`Powered by Poly Haven`をJSON・Blenderモデルの記録に入れる。ライセンスの誤認や課金発生は禁止。

実在確認済みの公式候補：[Asphalt 01](https://polyhaven.com/a/asphalt_01)（実写の粗い路面）、[Rock Ground 02](https://polyhaven.com/a/rock_ground_02)（岩と砂利）、[Rock Face 01](https://polyhaven.com/a/rock_face_01)（実3D岩壁、メーカー表示約2万三角形、写真ベース）。前2種のDiffuse/Normal(OpenGL)/Roughの各2K（なければ1K）を公式`https://api.polyhaven.com/files/{id}`の応答による**実URLから**取得し、公式配布元のMD5・サイズ・独立SHA256を一枚ずつ確認。岩壁モデルも同公式APIのglTF形式と全`include`ファイルを同じ手順で取得する。URLや素材のダウンロード成功を事前に決めつけない。規約と配布内容が変わった場合はHOLDし、偽の素材を作らない。

**実装コード**：
- `scripts/p101-k4br-fetch-official-cc0-pbr.py`：上記公式の`/info`, `/files`を直接照合し、実マップ＋実glTF・外部依存ファイルをダウンロード・MD5/Byte/SHA256の全件照合・JSONマニフェスト保存。Python標準libのみ、ユーザーの追加有料API課金なし。
- `scripts/p101-k4br-native-cc0-scanned-art.py`：K4BQ編集Blender正本を保護読込。手続き的なアスファルト／岩・路側石材のマテリアルの一部を**実写真PBRの新しいBlenderノード**で置き換え、写真ベースのカラー・Roughness・Normal情報を同じCHASE_NARROW研究Cameraで試す。実glTF岩壁モデルをそのままBlender実ロードして3地点の独立した研究用スキャン素材として配置。元の簡易八面体岩フィールドだけ、原本では削除せず研究レンダーをOFFとし、実スキャン岩壁と同一CHASE研究Cameraで比較。カラー+ラフ+法線画像は全てBlenderファイルにPacked Imageとして保存。
- [専用GitHub Actions](https://github.com/ryomashibaba/dopagaki-development-hub/actions/workflows/p101-k4br-official-cc0-photogrammetry-blender.yml)：元ゲーム/親.blend原本のSHA→公式から実PBR/モデル取得→MD5+SHA→Blender EEVEE 2研究Cameraレンダリング→旧K4BQとの同一CHASEカメラA/B（差分の数値検査）→Blender原本・2画像・比較PNG・実ソースURL/ハッシュ付きJSONを隔離枝に保存→本物のArtifactを残す。

## 2. 正直なART判定のための個別ゲート
1. **実取得PASS**：6枚の実CC0 PBR画像と1個のglTFモデル+全依存ファイルが実元URLからバイト一致・メーカーMD5一致。実ネットワーク/規約エラーならHOLD。
2. **ネイティブ組込PASS**：実3Dのモデルメッシュが一定以上の三角形を持ち、Blenderへロードされて編集可能、実取得写真が適正なPBRノードに接続、元Source6CameraとRoad5頂点/面不変、元ゲーム変更0。Packed Imageの存在、Native.blendと元Camera研究2PNGの全SHAとCI passを独立検査。
3. **美術評価**：同CHASE_NARROW研究CameraのK4BQ旧版と新K4BRを人間の目で比較。実素材を入れただけでARTを合格にしてはいけない。岩/路面だけリアルでも樹木が玩具・背景が薄いなら**ART REJECT**、正式ART0件／DNA0m維持。研究Cameraも研究用幅26.3m道路も実ゲームではない。
4. **安全/ゲームの明示**：B48元7道/B51元28/240Hz/CCD/SAT/人間の走行/FPS/RELEASE/MERGE/全6Road美術は別問題。元ゲームやmainへの統合禁止、Work/Computer Useをユーザーの許可無しに使わない。

## 3. 実行履歴
最初の[GitHub Actions #41789921118](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41789921118)は初稿執筆時点では結果未確認。実ローダー/素材/画像が全て成功するまで、その点を成功したと主張しない。失敗したら原因・修正を追記し、前工程の確定した成果物は保護する。


## 第1回／第2回CI実行事実と再試験（2026-11-04）

- 初回[#41789921118](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41789921118)はPython通常コマンドに`--`がない引数パーサの不具合で**FAILURE**。実アセットは未取得、原ゲーム/親SHA照合のみPASS。修正commit `6e385c3168bc557aaa6904ff15718517e5da3b6c`。
- 修正版[#41790126272](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41790126272)は**全CC0実アセットの公式API取得・バイト/MD5/独立SHA検証PASS**！実際にPoly Haven `asphalt_01` の2K diffuse（3,118,607B）、OpenGL Normal（4,845,665B）、Rough（1,599,661B）と、`rock_ground_02` の2K diffuse（3,469,687B）、OpenGL Normal（5,566,160B）、Rough（2,107,834B）を取得。また`rock_face_01`のglTFモデルと公式指定の外部依存をあわせた**5実ファイル**も取得・配布元MD5/Byteと独立SHA検証PASS。`K4BR_REAL_CC0_PBR_INDEPENDENT_BYTES_SHA256_AND_VENDOR_MD5_PASS`をCIログで実確認。ただし、次のUbuntu native BlenderのglTFインポーター内でPython `numpy`が見つからず`ModuleNotFoundError: No module named numpy`。**第2回CIはcompleted/FAILURE、新Blender画像/原本の完了無し**。重要：アセット実ダウンロードは成功したが、3D作品の完成ではない。
- システムBlenderの実glTF importer依存`python3-numpy`を新たにインストールするCI修正commit `1dff4257deb01b32ddcc5f7c93dac7a4d288c3f5`。最新[再試験 #41790588687](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41790588687)は**現時点では結果未確認**。CI/新本物の実レンダリング/Source SHA/Blender packの全件を実照合するまではK4BR技術成功・ART成功と断定しない。旧K4BQの正式ART0件／DNA0m維持。

## 【K4BR最終監査 2026-11-04】公式CC0素材実取得・Blender原本に組み込みTECH PASS／美術ART REJECT

### 3回のCIの真実

1. [初回 #41789921118](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41789921118)＝**FAILURE**。通常Pythonの引数解析で`--`要求ミス。原ゲームとK4BQ正本SHA検査はPASS、素材/Blender未着手。
2. [第2回 #41790126272](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41790126272)＝**FAILURE**。公式APIから2K写真PBR 6ファイルとRock Face 01 glTF＋外部依存4ファイル、計11ファイル**実ダウンロード・公式MD5/実バイト/独立SHA256すべてPASS**。ただしUbuntu Blender 4 glTFプラグイン実行時に`numpy`が欠けて`ModuleNotFoundError`。本物のBlender成果物未完成。修正commit `1dff4257deb01b32ddcc5f7c93dac7a4d288c3f5`で`python3-numpy`を導入。
3. [最終 #41790588687](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41790588687)＝**completed/SUCCESS**。元ゲームGit Blob／元Source Nodeテスト／親K4BQ編集可能Blenderの正SHA256、上記6枚＋glTF/依存4枚のメーカーMD5・Byte数/独立SHA、Ubuntu Blender glTF本体の実読込、実写3ch材質(PBR)、2研究カメラの本物のEEVEEレンダリング、別名保存の編集可能.blend、旧K4BQと同一CHASE研究カメラの中立A/B PNG、原Source Road5全頂点面fingerprint、元6Cameraと2研究Camera数値不変、GitHub研究ブランチの実画像/出典/sha保存、最終Artifact全PASS。

### 本物のアセットとマニフェスト

正本の[Poly Haven取得監査マニフェスト](research-evidence/k4br/K4BR_CC0_LIVE_ASSET_RECEIPTS.json)で、公式API由来の**実URL／実バイトサイズ／公式MD5／実SHA256／配布元著作者／取得UTC**を記録。

- [Asphalt 01](https://polyhaven.com/a/asphalt_01)：2K JPEG 実Diffuse3,118,607B・実Normal(GL)4,845,665B・実Rough1,599,661B。Blenderのアスファルト表面材質を置換。
- [Rock Ground 02](https://polyhaven.com/a/rock_ground_02)：2K JPEG 実Diffuse3,469,687B・実Normal(GL)5,566,160B・実Rough2,107,834B。Blenderの斜面の岩材、歩行路石材の実材質を置換。
- [Rock Face 01](https://polyhaven.com/a/rock_face_01)：実glTFメッシュ2,793B、bin476,436B、外部JPEG 3ファイル（1K）853,749B・1,023,400B・693,610B、元Vendor MD5全一致。Blenderへ**1実モデルを3回独立読み込み、各20,174三角形**。配置は研究カメラの元Road5に対する(d,s)=(38,-30),(84,34),(137,-42)m。元B48/実ゲームに統合・Collider追加は一切無し。
- 公式Poly Havenは素材がCC0であると明示。公式APIを使用したため固有User-Agentと`Powered by Poly Haven`出典表記をマニフェストに含める。**個別Rock Face 01のモデル生成手法が実際に写真測量だったかは公式アセット説明から断定できない**。このモデルは`実際に配布される詳細3D岩壁モデル`であり、実際の写真測量を個別証明したものではない。写真由来だと確認できるのはPoly Havenのテクスチャ制作方法である。誤ったモデル由来の認定を避ける。

### 編集可能成果物と独立SHAs

[真正最終Artifact #13303311443](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41790588687/artifacts/13303311443) ダウンロードZIP SHA256 `208522d022cb24dda51c07bf0c63723ef472d18b84d2dad4fb36fce76c8291dc`、ZIP CRC **全部PASS**。

- 編集可能Blender正本 `K4BR_ACTUAL_CC0_PHOTOSCAN_ROCKS_EDITABLE_NATIVE_DCC_ART_HOLD.blend` **74,454,543B**、SHA256 `7f229b9fbc0d736c056e1494f64192e64b7915f768a6fb38f05c87901229fa69`。写真PBR画像はBlender内にPacked、実3D岩壁はBlenderネイティブMESHで編集可能。
- 真CHASE_NARROW研究カメラPNG 1,860,386B、SHA256 `3c98b22ba9f8fa7d2540d646e260eeac3595e6863e46e849627ab569b88e3049`。真NARROW_FIXED_ORIGINAL_POSE研究カメラPNG1,894,149B、SHA256 `4394ee5ec041e8cc61cab994146fbcf9f94d843b6f0145bb21f3c3262b1c4b63`。
- 同CHASEの旧K4BQ→K4BR実画像A/B比較 `K4BR_K4BQ_SAME_CHASE_CAMERA_ACTUAL_CC0_MATERIAL_AB_NOT_GAME.png` 2,091,894B、SHA256 `d4e5b816707818fb18fd0667139125bc4fb6a5ab8e0ef6c4121ae796e12405f9`。像差はmean RGB `9.5449`（0〜255値、品質指標ではない）。
- 取得監査JSON本体のSHA256 `b1589199e22d7f815833853e1d50911cdc0896b708cd221b23d76dbdd09ed344`。ZIP/Native BLENDと2画像/比較画像の全原バイトSHA、マニフェスト自身のSHAをGitHub CIとは別のコンテナで独立再計算し完全一致。
- 新写真マテリアルが実研究モデルに適用された元材質スロット数：岩地形4、路側石材7、レース研究Road1。研究ソフトのBlender実画像でアスファルト骨材・地面の写真ディテール・詳細岩モデルが見える。

### 実画像のART判定：REJECT

同CHASE_NARROW研究カメラ旧K4BQとの比較を実目視。**良い変更**：路面の単純なグレー一色から自然な色ムラ／舗装骨材が追加され、両側の地表は細かな粒度・岩の実画像で情報量が上がった。前K4BQの単純な八面体落石を表示OFFにして実配布の詳細岩を3カ所配置し、「中身がない色塗りモデル」から実材質に進んだ。

**美術REJECTの主因**：
- **左の緑の地表が矩形の色パッチで覆われている**（2種類の地面材を元の四角形ポリゴン単位で割り当てたため）。写真材質でも画面全体が人工的に見え、実現実の草地ではない。
- **木が単純な三角形の円錐を重ねたローポリ樹冠**のまま、写真岩の近くでは見た目が大きく乖離している。実際の沿岸森林、植生密度や自然な形状として不合格。
- 左上の公共建築の**巨大で不自然な切れ方**、右の**寸胴な単独灯台**、遠景空と海・港の大きな空白が残る。光/大気/建物のスケール・用途・街区全体の説得力も不足。
- 道路は素材は改善しても大きな直線平面としてカメラ視野の大部分を占め、**高速レースの速度感・路面勾配・近景の利用シーンが不足**。
- 写真岩モデルは今の画面で段状の塊として少し見えるだけで、**道路と地形の造形自体を高品質に再建したわけではない**。
- 依然として世界水準のART PASSには程遠い。**正式美術採用0件、Slope2 DNA認定0m**。元Source Control11307/Road5全6カメラは不変、DCCの研究画面をゲームWebGL2画面と誤称しない。

### K4BS（次の研究）の固定優先度と反省

今回で「実ライセンス照合→実アセット取得→ネイティブBlenderにパック→SHA証拠保存」の**再利用可能な無料制作パイプライン**を作れた。しかしこれを「高品質ゲームが完成した」と誤解しない。

次は最優先で、**(1)矩形に塗り分けられた地面を自然な連続した写真ベース植生・岩の遷移へ改修、(2)著作権/モデル利用条件を確認して実3Dの樹木をLODを考えながら1〜2種類本当に試す、(3)近景の不自然な巨大建築と単柱の灯台を現実的な構造・用途に合う一画面へ抜本的に整理、(4)道路を含む画面全体のライティング・構図・デザイン意匠の再考**。写真の枚数や樹木の数の増加を美術PASSとしない。無料で利用できる公式ソースの真正配布物と出典・編集可能BLEND・同CHASE DCC比較・元Sourceの不変更を1工程で検証する。実ゲームのFPSや28動体、SAT/CCDなどの安全は別途HOLD。公式採用・main統合・公開に勝手に進まない。
