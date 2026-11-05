# K4CN — 原SOURCE固定・自然断層海岸と実働港湾の一体構図（研究／ART HOLD）

記録日：2026-11-05 JST。**これは新方針ではなくK4CM R3のTECH PASS／ART REJECTを受けた次工程**。正式ART採用0件、Slope2 DNA認定0m、HUMAN/SAT/CCD/FPS/RELEASE/MERGEはHOLD。

## 変更の目的

K4CMの実CHASE画面で、道路が単調な直線として画面の大部分を占め、左の地質が薄く、右の港が模型的だった失敗を受け、局所的な色替え・小物量産・QA反復ではなく大きな風景構図を実作者変更する。

- 左：K4CMの本物の1600頂点褶曲岩盤を原物体は不変のまま別研究コピーへ変換。地質の褶曲、波蝕谷、自然断層帯・層理面のスケールを引き上げる。
- 右：本物の連続岸壁土木の研究コピーを変更し、元フェリー歩行アクセスの実接続を維持したまま、大きな鋼鉄屋根・支柱・荷役床・背後施設を含む一体化した海港ターミナルを実3D構築する。実ゲーム衝突面は追加0。
- SOURCE Road5本体・6 Camera/CHASE・240Hz物理・Game・親研究全Meshと全matrix・木11/ライトを凍結する。SOURCEを変えずに風景を強化するため中央道路の見え方と5重要点を独立比較する。

## 実装・真正再現

- 研究ブランチ：`research/k4cn-source-locked-coastal-canyon-port-20261105`
- 実作者コード：`scripts/p101-k4cn-native-coastal-canyon-working-port.py`
- 実行Workflow：`.github/workflows/p101-k4cn-source-locked-coastal-canyon-harbor-art.yml`
- K4CM真正親Run：[#41991682479](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41991682479)、Artifact `K4CM_TRUE_INTEGRATED_COAST_AND_PORT_EDITABLE_ART_HOLD`
- K4CM編集可能親SHA256：`273c6ab1ec334ff8b2524c43c611da43831aaef3374056f3ab02352e3e914aab`
- 元Game Git blob：`af076d67492a677d2235e4730aef8cdf4808e106`
- 元Road5頂点面SHA256：`f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`
- 初回CI：[Actions #42000172721](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42000172721)。

## ゲート（自動試験の緑をARTに転用しない）

1. 親Blenderの全個別ファイルSHA/バイト数、元GameとRoad5 SHAを確認。
2. Blender4.0.2、元カメラ解像度768×480で本物の編集可能`.blend`とCHASE PNGを保存。
3. 元カメラ/木/光源/継承Mesh/行列、元Road5全vertex/faceを独立保護検査。
4. 同じ真正CHASEのK4CMとの画像差を左岩・右港・道路中央に分離。左>8000px／右>2400px／両側合計>20000px、道路中央<120px、道路中央5座標各最大10階調の既存ゲート。**これらは画面に変更が生じたTECH証拠のみで、美術合格点ではない**。
5. 独立比較PNGを直接開き、自然景観・巨大港・走行視線・自然な構造・演出の品質をART PASS/REJECT。成功しても実WebGL2・人間プレイ証拠と混同しない。
6. 実Artifact取得・CRC・個別SHA照合を完了するまで最終TECH PASS判定を行わない。成功時は研究枝に監査JSONと真正PNGを保存し`START_HERE.md`を更新する。

## 状態

2026-11-05 新規K4CN制作コードと真正CIを研究枝に保存済み。**初回CIは実行開始、最終TECH/ARTは未判定**。元原作、Gold、公式P101、main、Draft PR #46、本番サイト、元Road5、元物理は変更していない。Work/Computer Use・課金・公開・正式統合は事前承認。

過去K4CMの完了をK4CNの達成と混同しない。次の更新時は最新CI結果・実像をこの節に追記する。
