# DOPAGAKI K4AO — 真正K4AJ原画の対話式レビューとRoad5造形ゲート

**2026-11-03 JST／ART-FIRST、正式ART採用0件、Slope2 DNA正式認定0m。** 研究ブランチのsource blob `af076d67492a677d2235e4730aef8cdf4808e106` を変えない。main・本番・Draft PR #46無変更、Work事前許可。

## 1. 本物の元ゲームからレビュー可能な画面を作る

- 真正K4AJ [成功Actions #41566784540](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41566784540)・Artifact #13201661563 の生ZIP **11,959,523 bytes、SHA-256 `60aab331d8881b5f8f456539c00566837a2b061a96ab0725ce7c17ea91ed8efb`、CRC28件PASS**。
- [K4AO再生成Pythonコード](../../scripts/p101-r19a6p4r2f5k4ao-source-only-offline-art-review.py) は元ZIPのSHAを固定し、8組×元WebGL2 PNG／B51群除去PNG／元復元PNGの実SHA・bytes・解像度、100行CSV、元・group mask・復元GPU 11,176点、近い深度を生む不正を拒否。**ネットワーク不要のHTML比較ビューア**を生成する。正しい相対パスは下記参照。
- 手元の同等の生成器を使った真正Artifactテスト：**元RGB・mask・復元PNG8組×3、元/復元GPU全配列、ZIP SHA/CRC、CSV突合 PASS**。独立のローカルHTML/JavaScript構文チェックPASS、結果HTMLのSHA256検証PASS。GitHub保存したK4AO Python自体のCIはまだ実行していないため、同コードのGitHub Actions PASSとは記載しない。
- [再生成コード](../../scripts/p101-r19a6p4r2f5k4ao-source-only-offline-art-review.py) から `python3 scripts/p101-r19a6p4r2f5k4ao-source-only-offline-art-review.py --zip /path/to/K4AJ_99_CONTIGUOUS_20261103.zip --out /tmp/K4AO_TRUE_SOURCE_REVIEW.html`。UIは「14m／28mの8元RGBとB51群のみ研究用非表示」をスライダーで比較する。**作られた新ARTとの比較ではない。**
- [実測15カメラ審査時点JSON](research-evidence/k4ao/K4AO_TRUE_GPU_DEPTH_15_ART_CAMERA_REVIEW_ANCHORS.json)：K4AK要求をすべて本物のK4AJ 100ケースCSVの測定値で固定。RGB存在は6／15、残り9は未撮影、元画像に追加2。K4AMが真にSUCCESSしない限り15元RGB揃ったとはしない。

## 2. 元カメラでのART-FIRST優先観測時点

以下は元B51 BODY全28体を**研究用に一時描画除去**したとき、11,176点の元非線形GPU深度格子で遠方側へ変わった割合。人間による視界遮蔽率・遮蔽秒数ではない。

| 元幅・tick | GPU深度サンプル変化 | K4AJの元RGB |
|---|---:|---|
| 14m ultra 11338 | 10,500/11,176 = **93.951%** | 未撮影（K4AM待ち） |
| 14m ultra 11341 | 11,176/11,176 = **100%** | 元画像あり |
| 14m ultra 11349 | 5,300/11,176 = **47.423%** | 未撮影（K4AM待ち） |
| 28m control 11277 | 6,396/11,176 = **57.230%** | 未撮影（K4AM待ち） |
| 28m control 11280 | 5,972/11,176 = **53.436%** | 元画像あり |
| 28m control 11284 | 4,240/11,176 = **37.938%** | 未撮影（K4AM待ち） |

6時点を**造形時の重点比較対象**に選定する。閾値35%は工程上のヒューリスティックであり物理・人間認知・ART合否の規格値ではない。K4AJ全100ケースの最大深度変化14m tick11339と、この審査要求6時点を混同しない。GPU個体原因がK4AGで確認されたのは**tick11280のみ**で、その他の原因単体IDはUNKNOWN。

## 3. 次の真正造形・画面審査の受け入れ契約

造形案は既決定の **Road5《斜裂公共峡谷 / Inhabited Civic Rift》1方向**だけ。以前のK4・K4R・K4U ART REJECT（空洞は形状上あっても原カメラで居住可能な公共空間として見えず、屋根床の薄い現代的増築やA5骨組みに埋没）を再現しない。候補モデル/Colliderは現時点 **0**。

1. **本物の元カメラ/元物理の固定**：Sourceの球位置、Eye/Front、B48道路7、B51動体28のposeとdraw・colliderを一切変更せず、同一tickのsource/candidate真正Chromium/WebGL2 RGBのペアを提出。グループmask画像をcandidateの代用にしない。
2. **三層公共空洞の自然な可読性**：前景の道路から接続する公共床入口、中段の人間尺度の滞留テラス、遠方の主都市広場が**同じ真正カメラで**区別できること。細い輪郭やピクセル差分面積だけで合格にしない。
3. **原B51危険情報との共存**：6重点tick（その前後を含む連続窓）で、元B51群の姿と道路方向・左右余裕が潰れない。障害物の視覚除去・サイズ縮小・判定変更・Camera位置補正・速度低減による見栄えの捏造は禁止。
4. **独立ART判定後に限り安全・実走ゲート**：候補の同一native camera A/Bと2幅の連続真正フレームを独立ART審査。改善が見えないなら**ART REJECT/HOLDで造形追加停止**。独立HUMAN実操作、B48/B51 SAT/CCDと支持、Windows/iPhone FPSを通さずに元DNA認定、main反映、公開はしない。

## 4. 現時点の工程境界

- K4AJ SOURCE GPU独立PASS済。ただしSOURCE TECH限定でARTとは無関係。
- K4AK #41568787273、K4AM #41571299893、K4AN #41572736850 は本資料作成前の最終照会で **queued**、Artifact未確認。新コードはそれらの`paths:`パターンを避けており、既存runをキャンセルしない。
- K4AOは「真画面を見るためのレビュー媒体と15実測値の固定」を実装。**新候補形状を作った／ARTに合格したとは報告しない**。
