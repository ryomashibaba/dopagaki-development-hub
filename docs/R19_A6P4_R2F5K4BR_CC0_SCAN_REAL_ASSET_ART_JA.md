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
