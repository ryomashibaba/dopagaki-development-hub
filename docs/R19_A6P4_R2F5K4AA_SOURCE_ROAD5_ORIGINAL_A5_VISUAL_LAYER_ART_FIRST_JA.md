# DOPAGAKI SLOPE K4AA — Road5原真正カメラ×元A5都市奥行き層のART-FIRST検証

基準日：**2026-11-02 JST**。正本 `ryomashibaba/dopagaki-development-hub`／研究ブランチ `p101-velocity-overdrive-native-trial`／Draft PR #46。

## 【最終確定：K4AA改訂CI成功／原画は真正、A5視線は反事実、実遮蔽・ARTはHOLD】

[**改訂K4AA GitHub Actions #41433154678**](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41433154678) **全job SUCCESS**、改訂試験HEAD `1526797169c512cb9a60b0247f4f74dcf64a3f6b`。[**最終Artifact #13134579869**](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41433154678/artifacts/13134579869) の実ダウンロードZIP **2,114,811 bytes／SHA256 `109520e30874d2d432e0b15db168ff6145e9d2194a7bd45f675cc9557cbd3747`／4ファイルCRC全PASS**。元BVHレイJSON **433,337B／SHA256 `723234fadbcc77697555702da6e806077d1d1ac1995d5ab6d452245c37590e63`**、元画面と独立ROI数値JSON **32,811B／SHA256 `9357ad23b1f4df228f7ec04d78b4fe1791291b1c6916ac8b24bf186d5fcc9dae`**。残りは14m・28mそれぞれ7枚の元真正原画の**未改変コピー**と、色分けした**後書き反事実A5レイプローブ**を並べた比較シートPNG×2。後書きの水色/橙点は元ゲームが描画した構造物ではない。

**独立した実ZIP開封・CRC／JSON SHA再確認結果：**
- 元K4Zの真正82枚PNG実bytes/SHA一致、元球・元カメラEye/Front・Road5 7 tick×両幅14状態＝元A5 BVHの1,512発射レイに使用。元ソースGit blobと旧K4S認証済みA5両幅GLBハッシュを保持。改訂CIは**K4Z/K3Bプライベート原画にA5研究都市の `r19a3=on` が一切ないことを**、撮影URLとコピー元`dist-private/r19a1`、A3オプトイン条件を直接検査してPASS。
- A5反事実BVH内で1500m以内の交差**0/1512**、3000m以内も**0/1512**。これは**撮影時の描画構造物についての空間開放率0/100%を表すものではなく**、元画面の道路・骨組み・B51に対する遮蔽データではない。最終JSONには `K4ZSourceSceneRenderedA5=false`、`counterfactualA5GeometryUnderRealSourceCamera=true`、`actualK4ZScreenGeometryExplainedByThisBVH=false` を強制。
- 0.5秒間で元カメラEye位置差約97.4〜99.5m、視線方向角度差約2.0〜11.9°。真正PNGの画面領域でRGB差>40が起こった割合（画面上の固定3帯域、HUDの大半除外）は14m左34.8〜59.0%、中央24.3〜39.8%、右9.8〜30.6%。これは**別々の静止画の色差**であり、人物の用途理解、建築可読性、同一3D空間の連続視認秒数の測定ではない。

**厳格最終評価：原ソース・元カメラ・元A5研究用GLB・反事実BVH計算・真正画像のSOURCE TECH限定PASS。実元WebGL2の全表示構造についての視線遮蔽と、本当の公共空洞の入口／中間／奥のART審査は未実施＝`COMPOSITION_INCOMPLETE / ART_NOT_TESTED_HOLD`。** K4/K4R/K4U旧ART REJECT維持、正式ART0、Slope2 DNA0m、新建築・コライダー0、main／本番／元物理・カメラ変更0、候補固有SAT/CCD／歩行／HUMAN／FPS／RELEASE/MERGE HOLD。

正本を長期保存するため、Actions成果物の有効期限が切れても参照できる[**K4AA最終ハッシュ・反証・合否マニフェスト**](R19_A6P4_R2F5K4AA_FINAL_COUNTERFACTUAL_A5_EVIDENCE_MANIFEST.json)をGitHubコミットに保存。**次K4AB**で、元の真正画面に**実際に描画されている**7区間道路・橋梁フレーム・B51等の元ソース生成物をフレームID別に調べる。「A5にレイが当たらない」「暗い空間」を敷地・公共空洞・開発許可の代理として使わない。最後までART-FIRST／真正元視点・新案は1件ずつの独立判定を守る。

---

## 【独立検証から判明した重要な反証：A5は撮影シーンに表示されていない】

**K4AAの初回GitHub Actions #41432055691 は全工程SUCCESS**、原Artifact #13134283875を実取得・ZIP CRC確認。元PNG82枚のSHA独立一致、A5 GLB両幅SHA一致、真正Road5の14Camera×108点＝**1512レイのBVH計算**は実行された。

**結果：1512/1512本のレイで、原A5静的5メッシュへの3,000m以内の交差0件。** 14m／28m両方とも7時点・各画面左/中央/右108点の全値で0。しかし元WebGL2画像には巨大な道路・柱状構造が実際に描画されている。

その原因の切り分けで、**参照シーンの不一致**を確認した。K4Zは旧K3Bのプライベートコピー `dist-private/r19a1` を元にしており、真正画像のURLは `/r19a6p4r2f5k3b/?r19a1=on&g5b=off&stage=...` で、**A5をONにするフラグは一切存在しない**。別の旧A3プライベート研究ソースでは `r19a3=on` を明示した場合のみA5の統合都市メッシュを表示する契約である。したがって今回のA5 BVHは「元カメラ位置から**もし旧A5都市の5メッシュを対象にしたら**交差するか」という反事実の幾何学試験であり、**実際のK4Z原画の遮蔽・空間層を測定したものではない**。

このため以下の誤った結論は全面禁止する。

- 「A5レイが当たらない＝道路脇が開放されていて建築できる」「画面の暗い部分＝地表・遊歩道・空洞が確保されている」
- 「元画面で見えている巨大フレーム／道路／動く障害物がA5 BVHで測れている」「Source GPU深度が検証された」
- 「7点間で同じ空間が連続して見えた」「元画像で公共施設の用途が識別できた」「数学的レイから正式敷地や建築を選ぶ」

この発見は**ART／実遮蔽の不合格・未検証を誠実に保持するための技術的反証**であり、実建築の改良を意味しない。初回CIに加えて、**改訂K4AA CI**では参照K3Bの元プライベートソースの複製元が `dist-private/r19a1` であること、撮影URLが `r19a3=on` を含まないこと、A3表示の別契約が明示オプトインであることを検査してからBVHを走らせる。修正コードは最終根拠JSONにも `K4ZSourceSceneRenderedA5=false` ／ `counterfactualA5GeometryUnderRealSourceCamera=true` と記載し、元画像の実遮蔽と反事実レイの区別を強制する。

### 本当に数値として認められるRoad5カメラ・元画面の変化

0.5秒で元カメラEyeの実測差が約97.4〜99.5m、カメラFrontの角度差が2.0〜11.9°（両幅×6区間）。元PNGの**横方向3つのROIの色差>40**の割合は14m側で左約34.8〜59.0%、中央約24.3〜39.8%、右約9.8〜30.6%。これは`K4Z`真画像の**画素値同士**の検算であり、レイと独立に有効。ただしカメラ移動・画面内のオブジェクト・ライティングを区別しておらず、物体の追跡/視認の保証や建築敷地の優劣には使わない。

### 次K4ABへの明確な技術ゲート

**候補を新造形する前に、表示された本物の元シーンを対象にすること。** K4Z/K3Bと同じ `r19a1` private描画で原7 B48道路メッシュ・道路沿いの柱・元B51動体・その他の表示構造をソースID別に抽出し、既存道路のサーフェスと障害物の時刻位相を照合する。可能なら真正GPUの**オブジェクト分類／実深度**と同じtick元画面を照合する。元ゲームを改変せず研究コピー限定で調査、注釈と真ゲーム画面を必ず分離。少なくとも旧A5だけのBVHや黒背景の色をもって安全な「負の空間」を認定しない。ART-firstの1案要件は**真正元描画の遮蔽と時間窓が検証できてから**定義する。

**SOURCE TECH限定PASS（元Camera/A5反事実計算）／「本当のRoad5遮蔽」未検証・ART NOT_TESTED/HOLD、正式ART0件・Slope2 DNA0m。** K4/K4R/K4U旧ART REJECTを変更せず、元ゲーム/Main/本番/物理/カメラ不変、候補SAT/CCD／実歩行／人間テスト／FPS／RELEASE/MERGE全HOLD。

---

## 継承と研究上の制約

- **元ゲームSource不変**：元ソースGit blob `af076d67492a677d2235e4730aef8cdf4808e106`。元240Hz、球の軌道・速度・左右操舵・自然ジャンプ、原`ball-lock-unfiltered-heading`カメラ、B48×7/B51×28、元A5/Gold/P100/W9-X/B5/main、本番2URLの変更禁止。
- **K4Z SOURCE TECH限定PASS**：[元真正CI #41427816258](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41427816258)、[原証拠Artifact #13133042206](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41427816258/artifacts/13133042206)。元同一合法240Hz物理走行セッション/道路幅、14m・28mそれぞれ41真正PNG＝82枚、元SHA全一致。Road5 PRISM_CREST真正44.5–47.5秒の0.5秒刻み7時点／道路幅。K3B旧14時刻×両幅28PNG SHAがバイト完全一致。新建築・新コライダー0。
- **K4Y ART-FIRST審査**：入口・中間・奥の実3D空隙、道路と公共床の物理接続、元A5骨組みとの見分け、真正走行時の見え方、人間の用途理解を、画面の見かけの大きさやピクセル差分と混同しない。K4/K4R/K4U独立ART REJECT、正式ART0件、Slope2 DNA認定0m。失敗した屋根市場の再設計・大量複製禁止。新モデルは独立ART証拠を作る意義が明確になるまで**0**。

## K4AAの実装

[**元A5のみのBlender BVH研究コード**](../scripts/p101-r19a6p4r2f5k4aa-original-a5-true-road5-bvh.py)／[**元PNG独立SHA・視線と画像の検査コード**](../scripts/p101-r19a6p4r2f5k4aa-true-source-road5-ray-review.py)／[**CI正本**](../.github/workflows/p101-r19a6p4r2f5k4aa-original-road5-a5-layers.yml)／[**K4AA GitHub Actions #41432055691**](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41432055691)。

最初にK4Z原ArtifactのPNG全82枚の実バイト・SHA256と元ソース、K4Z JSON `da69e5d9283f6a8fc5190cc9fefd4e8476114eedfb218fe2eb802bbecfcddb6c`を検証。元ソースから元A5を**新造形せず**14m/28mそれぞれ原GLBとして再エクスポートし、元K4S既存研究で独立認証されたGLB SHA（ultra `00197cab04222acbbb6c27f1c97c348ccbf9df0b74864235bed90c0598d3a527`／control `bb7edbdcd850be94e49ada0cd148328e663e60d3ea7398542ff44336f38f226f`）と一致することを確認。元A5は**各幅5メッシュ／10,566三角形**。Blender BVHのray-castで、元K4Z真正Road5カメラ14状態×108本＝**計1,512本**の視線を調査。

### 1,512本の視線の意味

K2方式（1013×698px、画角係数1.35）の**近似逆投影**を用い、14m/28mそれぞれ真正7時点で、画面内の左・中央・右（各36サンプル）の元A5静的構造との最大3000m距離での交差を測定する。1500m以内の交差数を主要指標とする。

- **実測できること**：固定した元カメラEye/Frontから元A5の5静的GLBメッシュへ照射した**近似レイが交差するかどうか**、各時刻の見かけの元A5占有の違い。元球からのカメラEye移動距離とカメラFront角度の変化、元WebGL2画像のゾーン別RGB変化（0.5秒間に別撮影されたフレーム間のピクセル差のみ）。
- **実測できないこと**：GPUの真正深度バッファ、道路B48・動体B51の遮蔽、歩行可能な空間や地表支持、実際の「空洞の入口」を示す新建築、公共用途の理解、連続時間の視認性。**空のように暗いピクセル／A5に当たらないレイは、空き地・配置候補・構造物がない保証ではない。**
- **画像資料**：各道路幅7行の比較シートを作成する。1列目は未改変の真正元WebGL2 PNG、2列目は同じ元画面に**撮影後に追加した交差点プローブの色マーカー**（橙：1500m以内に元A5と交差、水色：その距離内では元A5に交差せず）、3列目に元カメラ移動/角度と独立審査注意書き。これらの色点は**ゲームが描いた3Dや人物ではない**。
- **時刻と速度**：Road5の同一合法元ソースセッションにおいて0.5秒間の元カメラ位置変化は両幅で約97.4〜99.5m、元カメラ向き変化は約2.0〜11.9°。これは計測した不連続な静止点同士の差であって、途中区間全フレームが同じ画面状態だった根拠ではない。

## 事前固定する採用・不採用の原則

**K4AAでは新建築も配置候補ランキングも作らない。** 1,512レイを画面の背景レイヤー研究として用い、将来の**一案だけ**を本当に造形するときに次の真偽を確かめる：入口、中間、奥の3つが0.5秒間隔の両幅スクリーンで追えるか／旧巨大フレームと紛れないか／前景道路と公開空間に本当に安全な接続があるか／原速度で障害物の視認を阻害していないか。単なる「A5の交差率が低いゾーン」を建築可能敷地とみなしてART PASSにしてはいけない。

**独立判定ゲート**：元82 PNG実SHA／source blob／元A5両幅GLBハッシュ／14真正カメラ×108レイすべて一致し、注釈2枚と出力JSON2件が揃う場合に限り **SOURCE/TECH限定PASS**。正規候補自体は存在しないため `ART=NOT_TESTED/HOLD`。候補固有SAT/CCD、歩行、HUMAN、Windows/iPhone FPS、RELEASE/MERGE全HOLD。

**初回保存段階**：コード・CI・本報告をGitHub保存。最終CI成否・BVH計算値・Artifact中身の独立検査は実CI完了までHOLD。過去のK4X/K4Y/K4Zを再開と誤認せず、K4AAの真計測の是非で次の研究内容を決める。
