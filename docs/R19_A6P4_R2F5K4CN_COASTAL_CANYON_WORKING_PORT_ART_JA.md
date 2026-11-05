# K4CN R2 完了確定 — 真正Blender TECH PASS／直接ART REJECT（2026-11-05）

- **最新正式研究HEADはその都度再照合**。R2作者修正 c2c626c99f16c8754e170d530577070fab88e139、真正Actions [#42003004167](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42003004167) は **completed/SUCCESS**。実際のBlender4.0.2 EEVEE、真正固定CHASE 768×480、親K4CM編集可能.blend固定SHAを使用。独立SOURCE回帰・実画像比較QAともSUCCESS。ただしこれはART合格でもWebGL2/人間実走行の検証でもない。
- **真正Artifact #13403680959の独立再取得確認**：ZIP **127,216,248B**／SHA256 **a606c4ad9be7716c9a8eb6cb11f43ecbd8d535614d056e22980885eec485448c**。再ダウンロードZIP全CRC PASS。個別の真編集可能.blend **283,623,560B**／SHA256 **f66531d8596e67a19f4c6f2debcf2521efbae54d9fc5ac911f94963dd6a45156**、真正CHASE PNG **504,228B**／SHA256 **6d12e33d530fb58789ad47637b55ab80d04c5f6f72c036453e6212292bdde160** のbyte/hash一致PASS。
- **造形実績**：元K4CMから非破壊コピーした左研究岩1600頂点、連続右岸壁737頂点、港の可編集研究メガターミナル**1384頂点／1074面**。左断層稜線の最大追加起伏17.444m。元Camera、元Game git blob af076d67492a677d2235e4730aef8cdf4808e106、元Road5全頂点面SHA256 f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2、木11・灯光・既存研究親の全Mesh/Transformは保存。新ゲームCollider0。元港の接続歩道不変。
- **同CHASEでのK4CMとの差分**：左**17,532px**／右港**11,562px**／道路中央**24px**（独立閾値120px未満）で可視TECH成立。R1→R2独立差分は左**10,161px**／右**11,456px**／中央道路**0px**（同画面内ROI maxRGB差15超による計測）。これらはART点数ではない。
- **真正画像を直接開いた独立美術判断：ART REJECT**。R1より右港の大型構造を視界内へ取り込み、左も稜線の起伏と断層を明確にした。しかし左の輪郭は鋭角の繰り返し・尖塔状で自然侵食の巨大岩盤らしくない。右は大きな機械的プラットフォームと屋根が上端・右端で切れ、実際に使われる港湾都市や水際との意味ある全体構成不足。道幅と真っすぐな単調前景によってレース高速感・道路の目的も伝わらない。**現構図の反復微調整は停止**。元のSOURCE Road5/Cameraを保護したまま、次はストーリーのある一体的景観/ゲーム体験の方向を改めて選ぶ（ただし既存確定方針は変更しない）。
- **固定ゲート**：正式ART採用**0件**、正式Slope2 DNA認定**0m**。HUMAN/SAT/CCD/FPS/RELEASE/MERGEは全HOLD。main・元Road5・元物理/カメラ・原Slope・Gold・公式P101・Draft PR #46・本番2サイト未変更。Work/Computer Use・追加課金・正式統合・公開は個別事前承認。

---

## 【2026-11-05 K4CN R1独立実証・直接ART REJECT／R2作者修正】
- R1真正Actions [#42000172721](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42000172721) completed/SUCCESS。SHA固定のK4CM編集可能親.blendから真正Blender4.0.2で新研究Mesh3件を生成し、ゲーム原Game/Road5/6Camera/CHASE/木11/光源/240Hz物理の保護検証に成功。元Game Collider追加0。**TECHのみ成功、正式ART採用0件／DNA0m**。
- R1真正Artifact #13402321747を本チャットで別途再取得：ZIP **127,226,891B**、SHA256 **cf7cf8cdd005d705a86d06d35aca5e2e5b293cbe1c7dfa72c9e706ea7076435a**、全ZIP CRC PASS、個別.blend（283,606,796B、SHA256 **766b34c1a947915648d16d4ddacf54a84557607114964f63152c1c32ac3bd5e1**）とPNG（504,217B、SHA256 **1541f656d065d660b6ef0a74d61660ca4cae4f81b262f2f6846abf4fb2895ef2**）の独立bytes/hash一致PASS。画像では左**17,554px**、右**9,740px**、路面中央**24px**変化。元路面形状はSHA固定、画像差は可視性のTECH証拠でART評価ではない。
- **直接同じ真正CHASEの全画面比較を開いてART REJECT**：左の暗い大型岩盤は滑らかな山腹状の単一斜面に近く、地質の岩割れ・断層・自然な段丘が画面上で十分読めない。右の広大な港屋根と柱は上半分が画面外に寄り、大きな骨組み・平板状で港の生活／機能／街とのつながりが分からない。中央の道路はK4CM同様に単調で速度感も不足。CI緑から正式採用へ昇格しない。
- **R2実制作変更コミット** [c2c626c9](https://github.com/ryomashibaba/dopagaki-development-hub/commit/c2c626c99f16c8754e170d530577070fab88e139)：親K4CMから独立3Dとして、左は近景量感を抑えながら奥の断層・谷と岩の段差を深く彫刻。右は約94mの本物の港屋根・支柱・床・閉鎖機械室・連続防波土木をSOURCEから可視な道路外側へ再配置し、構造体の支柱接続を維持。**研究用コードのみ更新、原Game/原Road5/カメラ/物理/Colliderは未変更**。
- R2真正Actions [#42003004167](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42003004167) の独立Blender/実PNG/全CRC/直接ART評価は、この節記述時点では**進行中**。未完了の成功や合格は主張しない。R2が終了したら最新結果でこの節の暫定文を更新する。
- 恒久条件：**ART REJECT（R1）、R2はHOLD、正式ART採用0件、Slope2 DNA0m、HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD**。main、公式P101、Gold/元原作/旧Road5、Draft PR#46、2本番サイト、元GAME・240Hz物理とCameraを保護。Work/Computer Use・有料API・正式統合・本番公開は個別事前承認。

---

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
