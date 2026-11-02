# DOPAGAKI SLOPE K4AA — Road5原真正カメラ×元A5都市奥行き層のART-FIRST検証

基準日：**2026-11-02 JST**。正本 `ryomashibaba/dopagaki-development-hub`／研究ブランチ `p101-velocity-overdrive-native-trial`／Draft PR #46。

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
