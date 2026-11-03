# DOPAGAKI SLOPE — K4AG 元B51障害物28個の単体GPU遮蔽原因特定（ART HOLD）

2026-11-03 JST。**ART-FIRST、独立審査、元ゲーム保護・main変更禁止。**

## 完了したK4AF実測（推定ではない）

- [K4AF GitHub Actions #41472149272](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41472149272) **completed/success**。K4Z元82 PNG SHA、Road5元14画面のHUD外3D画素完全一致、真WebGL2原meshで7 native ticks×2幅×6群=**84/84深度マスク取得**、14/14元depth復元、全84 farther-onlyでnearer 0、全84件時系列CSVと日本語報告をArtifact保存。
- [K4AF真GPU Artifact #13156257422](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41472149272/artifacts/13156257422)。ZIP 14,439,425 bytes、SHA256 `fbeb9d8b3555f49b963800f2447378902fc4295e8a84e5636c2e13e4eca2348b`、独立検算で**116全メンバーCRC PASS**。固定元JSON `K4AF_GENUINE_NATIVE_IN_RENDER_DEPTH_REPORT.json` SHA256 `016c28bf4fafa50748d8083496a81a5d66732540c0c3b50e863a7c39cfaddf26`、独立監査 `K4AF_INDEPENDENT_GENUINE_SOURCE_GPU_AUDIT.json` SHA256 `028f72fa8b40b450cb106e1484be488467c7dbcc4b9e69769cb2fa88a9aeec24`。
- **47.0秒・28m (control) の異常**：B51_BODY元28個を全て一時非表示にした際、8px格子11,176深度サンプル中**5,972点＝53.436%**がより奥へ変わった。対照14mでは53点＝0.474%。28m他6時点は最大1.333%。同じ47秒のB48描画群マスク寄与は28mで6.004%、14mで50.179%。元28mスクリーンショットの画面下部は巨大な紫色の前景に覆われ、without-B51-bodies では前方の道路が再び見える。
- 同一47.0秒・28m、B51 depth遮蔽のサンプルは**画面下左原点**でy0〜49にだけ存在し、5,972点がひとつの連結成分、表示幅全127列の画面下側に分布。GL readPixelsのbottom-left順を厳守。GPUの元groupタグ `B51_BODY` は実描画28命令であり、物体IDはこの全群試験では**未特定**。単一障害物や衝突異常と断言しない。

## K4AGで次に検証する内容

研究ブランチ `research/k4ag-b51-individual-occlusion-20261103`。専用 [Actions #41552778225](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41552778225)（実測・独立監査の完了結果待ち）。

1. [ソース保護の隔離K4AGレンダラービルダー](../scripts/p101-r19a6p4r2f5k4ag-b51-individual-private-builder.mjs)。検証済みK4AD元WebGL2 source rendererの私用コピーだけを加工し、原 `doc.movingObstacles` に実在する**元`o.id`**が合致した場合に限り、そのB51ボディの**視覚draw1回だけ**を除去する。元物理、B51collision、元球、camera、240Hz、source original blobは不変。作った・推測したIDを挿入しない。
2. [真正47秒ブラウザ検証](../scripts/p101-r19a6p4r2f5k4ag-b51-individual-native-11280.mjs)。2幅×28元B51 ID=56実WebGL2 RGBA24深度、2幅×B51全群マスク、2幅×元depth、4回元深度復元。K4Z元球/原カメラ/原道路/240Hz tick固定、28個すべてを別々に画面から除去。各IDに元WebGL2レンダラが実際にそのIDを消したログ `data-k4ag-excluded-b51-ids` が1件あることを検証。
3. [独立原ID・真正深度監査](../scripts/p101-r19a6p4r2f5k4ag-independent-b51-per-id-audit.py)。元82 PNG SHAとK4AFの真正30MB JSON SHAを厳密確認。元B51全群の47秒深度サンプル2幅が**前段K4AFと完全一致すること**を必須化。個別B51 IDにつき元72draw→71draw、GPU深度差がfarther-only、元深度 ≤ 1体除去depth ≤ 全28体除去depth を11,176点すべてで守る、元へ戻した全画素が一致する、などを独立監査。すべて成立するまでIDの原因特定は**HOLD**。
4. 原B51 IDランキング、GPUサンプル差比率、56行CSV、日本語所見を出力。重なった元B51の単体寄与は非加算なので合算しない。物理衝突の異常・正当な迫力か否か・人間のART視認性は別途判定。

## 固定方針

元 source Blob `af076d67492a677d2235e4730aef8cdf4808e106`、元球/240Hz/カメラ/B48 7/B51 28、Gold/P100/W9-X/B5/main/2本番URL不変。元継続 `p101-velocity-overdrive-native-trial`、Draft PR #46 OPEN/unmerged (HEAD `19d3a32d525c0c2a67082cba646898fab8f2b60f`) は一切触らない。旧K4/K4R/K4U ART REJECT、**正式採用ART0件・Slope2 DNA0m、新モデル0、新Collider0、SAT/CCD/HUMAN/FPS/RELEASE/MERGE HOLD**。研究用のGPU深度差の割合をARTの合格率と呼ばない。

## 次の工程

まずK4AG Actions #41552778225の全jobステップ・実ログ・Artifact SHA/CRCを検証。成功なら元sourceの障害物ID別ランキングを確認し、元メッシュ/元物理を変えずにどの元障害物が前景を覆うかの幾何学的原因を特定する次研究へ。失敗なら本物のエラーログを精査して最小修正。ユーザーのPC操作/ZIP再提出不要、Work使用は事前承認制。
