# DOPAGAKI SLOPE — R2F Phase 1 真正3D実制作・独立QA・美術REJECT

**2026-11-01 JST。ブランチ `p101-velocity-overdrive-native-trial`／PR #46 Draft/OPENの非本番研究。**

**結論：SOURCE TECH限定PASS、ART REJECT。** ART正式採用0件、Slope2 DNA正式認定0/2912m、GAMEPLAY/HUMAN/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD。

## 1. 新造形と実証された工程

- R2F1新規Blenderソース `scripts/p101-r19a6p4r2f1-connected-urban-streets.py` を独立追加。元E2造形ソースを上書きせず、現在のRoad1側3地区の建築を、湾曲公共崖・非対称段状フォーラム・低い曲面庭園にそれぞれ変えて実3Dメッシュ化。厚い扇形地盤、二本の街路の左右に約35m厚の独立都市地盤形状を追加。Road0側2地区にも同じ新素材・扇形地盤/曲面形状の変更があり、**「Road0造形はE2と完全不変」とは言えない**。物理的なRoad0道路は不変。
- 5地区・22用途の割当・36m本物の空洞・12分割公共歩廊を維持。用途のラベル、立体地盤、接合した街路だけで本当の人間歩行・建築利用・地盤支持が認定されるわけではない。
- 最初の試行 [Actions #41273201395](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41273201395) は**失敗**。元10566 facesに対し新6764 facesのため、従来の `source_faces+100<new_faces` assertionでBlender生成停止。失敗を隠さず、検査条件を緩める代わりに曲面断面を高密度ロフトへ修正した。
- 修正版ソースコミット [`d7575d7ab2d`](https://github.com/ryomashibaba/dopagaki-development-hub/commit/d7575d7ab2d45bf8e3f7c216f97dee4545fd3d88) の [真正Actions #41273316467](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41273316467) は**全19ステップSUCCESS**。元ソースblob保護、実Blender 4のBLEND+GLB生成、独立GLB COLOR_0/triangles、B51六時刻・全2881tick、元A5とR2F1 WebGL2真正14/28m×6画像、R2Fカメラ投影JSON2件、PNG-SHA確認オーバーレイ6件を実施した。
- [検証Artifact #13069444253](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41273316467/artifacts/13069444253) ZIP 4,570,978 bytes、SHA256 `5098fe4900799b8cd3f0265c37aae9ac736dd1a11fd61230482df67d67c8b485`（実ダウンロードバイトを独立ハッシュ確認）。実ファイル32件。失効予定2026-11-08 04:33:22 UTC。証拠原本をダウンロードする場合は失効前に取得する。

## 2. 技術の独立計測

| 指標 | R2E-E2（比較元） | R2F1 |
|---|---:|---:|
| 実Blender編集faces | 15,098 | **11,148** |
| GPU real triangles | 30,436 | **22,296** |
| 元ソースに対する新faces | E2モデル | **+582** |
| Blender編集地区 | 5 | 5 |
| 建築用途割当数 | 22 | 22 |
| 元source WebGL2真正画像 | 12 | **12** |
| 元B51全0..2880tick × 28 × 2道幅 = 161,336離散組 | 交差0 | **交差0** |
| ゲームへのコライダー追加 | 0 | 0 |

実R2F1 GLBの独立`P4R2F1_ALL_2881_NATIVE_TICKS_B51_TRIANGLE_OBB_CONTACT_AUDIT.json`は`failures=[]`、両幅とも`totalTriangleOBBIntersections=0`、元sourceB51数28、physicsHz240。GPU triangle/OBB SATは**各離散tickの瞬間交差**に関する証拠であり、時刻間swept CCD、元B48静的道路と新地盤の交差、地盤接地、原B51の画素遮蔽、走行中の人間の認知・操作、人間の歩行やFPSを証明しない。

## 3. 元WebGL2 12枚の独立画像評価

比較原本は旧R2E-E2 Artifact #13068924481と新R2F1 Artifact #13069444253にある**同一1013×698・同tick・同モードの元ゲーム真正PNG**。各PNGのSHAを各真正QA JSONと照合した。下表はmax RGB channel absolute diff > 36の画素割合。中央ROI=x202..809,y140..319。**「美しさ／見通し評価点数」ではなく、実画面に新造形が現れた量の補助指標**。

| 真カメラ時刻 | 14m全画面差 | 14m中央ROI差 | 28m全画面差 | 28m中央ROI差 |
|---|---:|---:|---:|---:|
| 4.404s（Road0） | 5.056% | 19.975% | 4.645% | 19.777% |
| 8.004s（Road1） | 7.093% | 38.107% | 7.179% | 38.677% |
| 11.504s（Road1） | 9.832% | 43.243% | 10.092% | 42.405% |

### 独立ART判定

- **確かな前進：** 元8.004秒の左手前、11.504秒の左側に、E2のカクカクした別棟群ではない**波打つ連続屋根と異なる高さの都市壁体**が明確に映る。道路・球・HUDの元配置は維持。真画像に変化があることは認める。
- **未達：** 中景の建物はなお大きな単一の壁・平面に近く、窓が縦の細帯に見える。遠景は疎で、地盤の上下の連続、観察できる公共空洞、人のいる都市街路、巨大都市としての深いスケール・複数レイヤーが元カメラ上で成立していない。道路脇の地盤は主に低い横長形状に見え、**滑らかな建築を作ったことと、本当に美しい一体都市を作ったことの隔たりが残る**。
- **判定：** 形状面の進捗は認めるが、元のART最上位目標に達しないため**R2F1 ART REJECT**。旧E2もREJECT。技術PASSやRGB差分量を美術採用に読み替えない。

## 4. 次の修正ゲート：同じ案を質的に改善する

新候補名・新ワークフローを連続で増やさず、まず**同じR2F1の実BLENDを真カメラで美術修正**する。写真風・高級感のあるPBRゲーム表示も今は未実装（原ゲームではvertex color）。主役の単なる巨大曲線壁を「真の開口部・階層化した公共広場・支持構造・異種の公共機能」を読み取れる3D形へ改修。元8.004/11.504秒の静止画で、前景→中景→地区2/3を**都市の通り・空洞・地盤・建築**として連続させることを美術の最優先ゲートとする。

1. **画面に出る大きな面の解体：** 単に曲線の分割数を上げるのではなく、真正の開口・吹き抜け・屋根段差・複数の構造荷重経路を設計する。単純なカーテンウォール状のパネル反復は避ける。
2. **街路/公共利用の視覚的証拠：** 地区1→2→3の大地盤を人間規模の広場や歩行橋（ただしレース道を跨がない）に分け、真正カメラで少なくとも2つの視点から読めるか先に審査。
3. **正確なゲート順：** 元3画角を先に見て造形を見直してから、独立新GLB/12真画像/B51全tick・元source再検証。画面差、ポリゴン数、B51交差0はART/HUMAN/RELEASEの代替にしない。
4. **ゲーム目標継続：** Slope原作の操舵・自然ジャンプ・本物の高速物理・公平な危険予告を保ち、最終的には人間の真正240Hz走行でDNA Slope2 2,912mを狙う。現時点0m。
5. **保護境界：** 元ゲームGit blob `af076d67492a677d2235e4730aef8cdf4808e106`、main/Gold/P100/W9-X/B5、元物理・camera/HUD/入力/PB、二本番サイトは不変。PR #46 Draft/OPENで未マージ。Workへの無承認移行なし。

**ART正式採用0件・Slope2 DNA0/2912m。**
