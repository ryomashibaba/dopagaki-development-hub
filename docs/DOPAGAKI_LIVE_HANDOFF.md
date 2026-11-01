## 【2026-11-01 R2F4-B 空洞の実造形・静的B48高密度検査／SOURCE TECH PASS・ART REJECT】

- [実Blender直接修正`836269a`](https://github.com/ryomashibaba/dopagaki-development-hub/commit/836269ac7b6dc4e9e44057f2ce1f36779a816831)：Road1の前景2館を実厚の基壇+外側壁+独立曲面屋根へ分解し、各2つの実空洞ギャラリー、入口横断屋根の撤去、奥の実3D市場3店＋公共デッキで直接改修。旧R2F4 GLB／実画像Artifactは保存。元の道路／物理／カメラ／本番変更なし。
- [独立QA追加`cdcd8b0`](https://github.com/ryomashibaba/dopagaki-development-hub/commit/cdcd8b0556f2c655dd0d5687708653180ea5c884)：全B48×7を各320×12×2三角形＝**53,760**サンプル三角形で近似再構成し、新実GLBとの静的3D AABB＋SAT検査。**重なり候補0、実SAT対象0、サンプル接触0**。元B48エンジン三角形との完全同一検査ではないため厳密静的CLEARANCEはHOLD。
- [Actions #41279367644](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41279367644) **21/21工程SUCCESS**／[Artifact #13072192904](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41279367644/artifacts/13072192904) ZIP SHA256 `dc8830fcb816416e9edff0fbd2a4e2809a3bc580aabb6793cca7098fdcbe6488`。Blender22,164 faces、GPU44,512 triangles、元B51全28×2881×2=161,336離散SAT交差0、元14/28m×6=true12 WebGL2 PNG。
- 旧R2F4→B真正14m画面変化：8.004秒全体1.329%／左ROI8.817%、11.504秒全体1.501%／左ROI10.243%。横断屋根削減と内部空洞は画面に反映されたが、いまだ箱状の低い色面で市場と人の活動が読めず**ART REJECT**。
- **次の改善点を見直す**：現行glTF importerはXYZRGBのみで**PBR/materialレンダリング未実装**と明記。さらに屋根や柱を作るのでなく、まず専用private rendererの素材・法線・陰影を独立調査し、元の8s/11.5s美術と障害物視認が実際に改善するか最小単位で比較。旧本番/Gold/P100/W9-X/B5、元Blob `af076d67492a677d2235e4730aef8cdf4808e106`保持。静的元B48厳密/地盤支持/実歩行/B51実画素/CCD/FPSはHOLD。
- [詳細根拠と次工程](R19_A6P4_R2F4B_NATIVE_OPEN_GALLERIES_ALL_B48_STATIC_QA_ART_REJECT_JA.md)。PR #46 OPEN/Draft/未マージ、ART正式0件・Slope2 DNA正式0/2912m、GAMEPLAY/HUMAN/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD。

---

## 【2026-11-01 R2F4：正規B48/B51・元カメラの距離最適化→初の2近景公共施設、TECH PASS／ART REJECT】

- 初期遠方配置の公共入口は元8s/11.5sで431〜952px²と小さい。そこで[配置探索`7f5fad3`](https://github.com/ryomashibaba/dopagaki-development-hub/commit/7f5fad321dbc554872bec870f66e71953d69730a)＋[進行方向最適化`0c4fe48`](https://github.com/ryomashibaba/dopagaki-development-hub/commit/0c4fe482be65eec9a6286fa1e1c0e160d923b6d2)を追加。元Road1全U32点×横25/35/45m×元8s/11.5s、B48全7道路の高密度29,211サンプルと元B51全80,668ポーズ/モードを調査。**u=.100（8秒）とu=.350（11.5秒）、道路1左端から35m**を選択。14mの仮16×14m立体カメラ投影8,702px²／8,191px²（前より9〜20倍）、元B48サンプル平面余裕25.8m、B51 XZ保守余裕193.9m／119.9m。精密静的三角形交差/真画素/地盤支持は未証明。
- [実3D試作`4f94b07`](https://github.com/ryomashibaba/dopagaki-development-hub/commit/4f94b07d93e019c38e34fbafba06ff6c1560ef6e)：近景に新2小規模公共施設（実3D各568頂点、厚い低層広場・左右非対称の館・空いた玄関と後方交易館）を追加。旧R2F3保存、元WebGL2・物理・本番変更なし。
- 真正[Actions #41278482489](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41278482489) **20/20工程PASS**、[Artifact #13072421208](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41278482489/artifacts/13072421208) ZIP SHA256 `a03d9113ffb8211158d6cfcc01738d863a27e75e9d3ea363bd54be71c5654c29`。Blender21,176 faces／GPU42,568 triangles、元真WebGL2 12枚、元B51全161,336離散SAT交差0、新collider0。
- 旧R2F3→R2F4の14m元8.004/11.504秒で全画面差2.092/2.407%、左ROI変化14.093/16.425%。**小さい公共建物は実際に近景左側へ映った**が、入口はまだ単純な色の塊で、人間規模の内部市場と地上広場に見えず**ART REJECT**。
- 次はこの2棟の実内部断面・入口・公共歩廊を直接造形改善。**元B48静的三角形交差、元B51ラスタ画素・時刻間CCD、実地盤支持・歩行、実人間操作・FPS**を独立検証するまで本番禁止。
- [詳細と証拠](R19_A6P4_R2F4_SOURCE_B48_B51_PROBE_AND_NATIVE_ROADSIDE_ART_JA.md)。元ソースblob `af076d67492a677d2235e4730aef8cdf4808e106`不変、PR #46 OPEN/Draft/未マージ、main/Gold/P100/W9-X/B5/2本番不変、正式ART0、Slope2 DNA正式0/2912m。RELEASE/MERGE HOLD。

---

## 【2026-11-01 R2F3 元カメラ向き公共入口・実BLEND/GLB → TECH PASS / ART REJECT】

- [実装 `ac5c3a3`](https://github.com/ryomashibaba/dopagaki-development-hub/commit/ac5c3a35ecf2c3846b4cf5dcabc829a42ab8efc5)：元tick1921/2761のカメラ方位に合わせて道路に開いた入口、地表4大曲面広場、左右低層2館＋後背文化館へ変更。旧R2F2の巨大壁を低い構成へ改修、旧R2F2スクリプトと証拠は保存、既存CIワークフロー再利用。
- 本当の[Actions #41276658086](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41276658086) **全19工程PASS**、[Artifact #13071354443](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41276658086/artifacts/13071354443) ZIP SHA256 `8725b856f1a2530a4c301580468b0bb3ff3f841283dfcdc70347bd6e48141b91`。Blender 20,100 faces・GPU 40,368 triangles、元14/28m×6元WebGL2真正画面12枚、全原B51動体161,336離散SAT交差0。元ゲームblob `af076d67492a677d2235e4730aef8cdf4808e106`、元物理/camera/HUD変更なし、新collider0。
- 真旧R2F2→新R2F3比較：14mの4.404/8.004/11.504秒で全画面変更2.460/3.837/4.064%、中央ROI13.291/22.260/21.708%。壁は低くなったが、画面には低い黄土色屋根と壁だけが見え、**実公共入口・広場が読めないためART REJECT**。正式採用0件。
- **根本距離制約の発見**：元Road1敷地中心は原B48道路端アンカーから約291/318/298m外側、R2F3地上公共テラスの同一アンカーからの理論距離下限も**約104/131/111m**。カメラ方位に入口を向けても都市の人間規模が小さく見えることの合理的な要因。これまでの外壁/柱の繰返し調整だけでは突破不能。次R2F4では原道路端から25〜45m側（あくまで安全調査候補）に低層公共施設を置けるか元B48静的道路・B51動体を先に調査、2真正画面ART先行、合格のみフルQA。
- [R2F3独立監査と次の設計ゲート](R19_A6P4_R2F3_ORIGINAL_CAMERA_PUBLIC_SPACE_VISIBILITY_ART_REJECT_JA.md)。PR #46 OPEN/Draft/未マージ。main/Gold/P100/W9-X/B5/本番2URL不変。ART正式採用0件、Slope2正式DNA 0/2912m。HUMAN/GAMEPLAY/PERFORMANCE/RELEASE/MERGE HOLD。

---

## 【2026-11-01 R2F2独立真正QA：柱列削減は成功／巨大曲面壁への退化でART REJECT】

- [実装`6562825`](https://github.com/ryomashibaba/dopagaki-development-hub/commit/6562825ca90eb9a18e0d12c7ff0a221d44ae9a95)：R2F1-Dの153小地盤片と細柱をやめ、Road1の主役を2大曲面建築＋4連続公共地盤＋2入口側構造へ根本再造形。5地区/22用途維持、旧R2F1Dコード保護、既存Workflow再利用。
- [真正Actions #41275836322](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41275836322)全19工程SUCCESS、[原本Artifact #13071502142](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41275836322/artifacts/13071502142) ZIP SHA256 `0c94bd6d70b46ea373496d9fd311a6a3c1cd0d516f92a98b1733b99c6086d820`確認。Blender20,800 faces／GPU41,792 triangles、元WebGL2真正12画像、元B51離散161,336組交差0、source blob `af076d67492a677d2235e4730aef8cdf4808e106`不変・追加collider0。
- 同一元カメラ対R2F1-D：14m全画面RGB>36差 4.404秒0.999%／8.004秒1.236%／11.504秒**4.141%**（中央ROI5.939/7.498/21.884%）。細柱列は消えたが、11.5秒の紫灰色巨大曲面壁と8秒の青緑壁が支配的で、意図した内部公共広場は画面に読めない。**ART REJECT**。外面/柱/面数を追加するだけの方向は禁止。
- **次は元8sと11.5sで見える公共入口・地表広場・内部都市空間から先に美術構図を1案設計**。人が見て美しいとわかる画面が成立しない候補でフルCIを増殖させず、既存の検証基盤を使いART早期判定後にSOURCE QA。
- [独立監査の原本](R19_A6P4_R2F2_TRUE12_2881_SOURCE_TECH_PASS_ART_REJECT_JA.md)。main/Gold/P100/W9-X/B5/2本番・元物理/カメラ/HUDを保護、PR#46 OPEN/Draft/未マージ。正式ART0件・Slope2 DNA0/2912m、GAMEPLAY/HUMAN/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD。

---

## 【2026-11-01 R2F1-D 真真正銘の屋外公共地形置換 → SOURCE TECH PASS / ART REJECT】

- 実Blender形状直接改修 [`0f5b22b`](https://github.com/ryomashibaba/dopagaki-development-hub/commit/0f5b22b22ffa90327b214102529da499cc30718b)。原カメラ選択済みRoad1 3地区主壁を取り除き、各153個の9層分割実地盤モジュール、12基の実構造リブ、6段の公共歩道候補へ変換。旧R2F1-Cレポート/Artifact保持。
- 本物の独立[Actions #41275208203](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41275208203) **全19工程SUCCESS**、[Artifact #13071520257](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41275208203/artifacts/13071520257) ZIP SHA256 `16a2899dd9868d0ee953f3c4d2e9216724f23972dde42d6facd6d9ca92776408`原本照合。Blender14,314 faces／GPU28,628三角形。元14m/28m×6 tickの真WebGL2 12画面、元2,881×28×2 = **161,336離散B51 SAT交差0**。元ゲームsource blob `af076d67492a677d2235e4730aef8cdf4808e106`無変更、新collider0。
- 真画面の旧C→D 14m差分は4.404s 0.957%、8.004s 1.367%、11.504s 3.454%、中央ROIは6.126/8.299/19.198%。壁が減る効果はあったが、11.5秒の明るい細い柱状の配列と実都市空間の不在が目立つ。**独立ART REJECT**。実歩行/地形接地/静的道路/連続時刻衝突/B51実画素/HUMAN/FPSすべて未検証。
- **次の美術制作ルール**：箱・巨大壁・穴・柱・段々のパラメータ増殖では美しくならないので停止。まず元8秒・11.5秒の画面で、人間にとって魅力的な公共都市空間の一体構図と建築言語を明示し、実メッシュの単一造形を小さく素早く直接修正して早期ART評価。既存CI再利用。正式ART採用0件、Slope2 DNA 0/2912m。詳細：[R2F1-D独立QA・ART監査](R19_A6P4_R2F1D_TRUE_SOURCE_CAMERA_OPEN_AIR_CITY_ART_REJECT_JA.md)。
- 元B48×7/B51×28/240Hz/元操作・カメラ/HUD/物理/スコア、main/Gold/P100/W9-X/B5・二つの本番サイト不変。PR #46 OPEN/Draft・未マージ。GAMEPLAY/HUMAN/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD。

---

## 【2026-11-01 R2F1-B/C：真正画面で可視化改善は確認、ART REJECT】

- R2F1の直接B改修 [`be14631370f1`](https://github.com/ryomashibaba/dopagaki-development-hub/commit/be14631370f141a378cac8aee635dd189ac9d3fe) は、Road1各主役建築に本物の全高空洞と厚い公共地盤6段を実装。真正[Actions #41274215491](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41274215491)全19工程PASS、Artifact 13071255659 SHA256 `2acae79d8af465a663297860281b4560e3db0d86f05d82cbbbb2535d72825603`。Blender 10,772面/GPU 21,544三角形、元14/28m真12画面、28×2881×2の元B51離散SAT交差0。ただし元R2F1と比べ14mの8.004s画面差0.197%、11.504s画面差0.010%で、**空洞がほぼ見えない**ためART REJECT。
- 元カメラを基準に対象建築を選び直すC改修 [`82e2b80d49a2`](https://github.com/ryomashibaba/dopagaki-development-hub/commit/82e2b80d49a27aa369843be56750715e61c1e10a)、真正[Actions #41274666414](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41274666414)全19工程PASS、Artifact 13071315994 ZIP SHA256 `a46af3a5a07cd1f44422383b9b3fe3a07adbdb04c1977972a51a5d40459152f0`。Blender 11,054面/GPU 22,108三角形・元B51全161,336離散SAT交差0。**地区2主役はtick2761原カメラからsp=1を選択**。11.504s旧B→Cの14m画面差1.853%／中央ROI11.562%で、大きな隙間が実際に見えるようになった。
- **独立美術判定はCもART REJECT**：11.5秒の隙間は巨大壁が切断された形にしか見えず、都市の地盤・内部空洞・人間規模の公共空間・建築同士の一体感が弱い。8秒の改善も限定的。穴の位置・数・ポリゴン数だけをさらに増やすのは禁止。次は元真画面上で一体都市・地上公共空間から先に意匠構図を設計し、実Blenderで少数の主役造形を直接制作。
- [詳細独立監査](R19_A6P4_R2F1_B_C_TRUE_CAMERA_ART_REJECT_AND_NEXT_COMPOSITION_GATE_JA.md)。元ゲームGit blob `af076d67492a677d2235e4730aef8cdf4808e106`/240Hz/7B48/28B51/元RAW camera/HUD/入力、main/Gold/P100/W9-X/B5、本番2サイト無変更。正式ART0件・Slope2 DNA正式0/2912m、GAMEPLAY/HUMAN/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD、PR #46 Draft/未マージ。

---

## 【2026-11-01 R2F Phase1：R2F1実Blender制作→真正SOURCE TECH PASS／ART REJECT】

- R2F1実Blenderソースを独立作成：[`0e124d0`](https://github.com/ryomashibaba/dopagaki-development-hub/commit/0e124d05449a80d374d5347bad89c9bbbeafbc30)→高曲率化・元品質ゲート維持[`d7575d7`](https://github.com/ryomashibaba/dopagaki-development-hub/commit/d7575d7ab2d45bf8e3f7c216f97dee4545fd3d88)。旧E2ソース維持。道路1の地区1公共崖/2フォーラム/3庭園の異なる湾曲実3Dと、地区間の厚い都市地盤を実装。Road0側の美術形状も一部変更（Road0原物理は不変）。
- 初回[Actions #41273201395](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41273201395)はBlender元faces(10566)検査で6764面となり**FAIL**。元の安全門を緩めず高精度曲面を作って改修した。
- 再実行の**[Actions #41273316467](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41273316467)は19工程全SUCCESS**。[原本Artifact #13069444253](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41273316467/artifacts/13069444253) ZIP SHA256 `5098fe4900799b8cd3f0265c37aae9ac736dd1a11fd61230482df67d67c8b485`。Blender実11,148 faces、22,296 GPU triangles、5地区22用途、真12WebGL2画像、元240Hz×28B51×2幅×2881tick **161,336離散SAT交差0**、元ゲームGit blob不変、新コライダー0。実地盤接地・静的道路交差・tick間CCD・B51実画素認知・人間走行・FPSは未認証。
- **元3画角×両幅のE2 vs R2F1真正PNGをSHA照合して比較**：14m maxRGB差>36の全画面差は4.404s 5.056%／8.004s 7.093%／11.504s 9.832%。湾曲連続屋根は確認できたが、なお巨大のっぺり壁/細帯窓であり、都市の人間規模の広場・地盤の視覚接続・主役建築の美しさが未達。**独立ART REJECT、正式採用0件**。
- **次**は新候補増殖でなくR2F1の実3D造形を真正元8.004/11.504sで直接改修。主役の巨大壁に真の吹き抜けと深い階層化した公共空間を付与し、レース狭路とB51を見失わない。技術の前に美術ゲート。詳細：[R2F1独立監査](R19_A6P4_R2F1_SOURCE_NATIVE_QA_AND_ART_REJECT_JA.md)。
- 正本境界：`af076d67492a677d2235e4730aef8cdf4808e106`元ゲーム不変、main/Gold/P100/W9-X/B5、2本番、元240Hz/B48×7/B51×28/元HUD・camera/入力変更なし。Slope2 DNA正式認定0/2912m。GAMEPLAY/HUMAN/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD、PR #46 OPEN/Draft。

---

## 【2026-11-01 R2F PHASE 0：原ゲームカメラ起点の美術監督ゲート真正PASS】

- **最新実装：** [コミット `5ed105ac613d`](https://github.com/ryomashibaba/dopagaki-development-hub/commit/5ed105ac613d1802f2b2f102d8ea242140e3f4be)。新モデルを粗製濫造せず、旧R2E-E2の**本物の5地区Blender/GLBと真正6×2元カメラ**から、地区別画面投影と頂点間距離を測る`scripts/p101-r19a6p4r2f-camera-geometry-audit.py`、元PNG SHA確認付き構図補助画を作る`scripts/p101-r19a6p4r2f-native-overlays.py`を追加。既存CIを再利用、新CI数0。
- **真正[Actions #41272020211](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41272020211)全SUCCESS**、[Artifact #13070295161](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41272020211/artifacts/13070295161) ZIP SHA256 `70559c858f75012668c59d61f68076c862fad7783ccf9f129ff7ddb580141064`。各幅5地区×6時刻の投影JSON2件、元WebGL2実画面＋出力SHA検査の美術監督用PNG6枚を確認。独立GLB計算との画面bounds最大差0.00px。地区1–2の最短メッシュ**頂点**間0.682341m、地区2–3 3.196525m（面の接続保証ではない）。
- **原因の深化：** 元8.004s（14m）では地区1 x228–637・地区2 x572–963、11.504sでは地区1 x2–328・地区2 x179–705・地区3 x609–851に投影される。道路1の視点間で主役のバトンを引き継ぐ都市意匠・地盤の可読性が弱いのであって、建物単純追加・接近では未解決。
- **次R2F PHASE 1：** 元3ヒーロー画像で道路/28B51の視認を守り、地区1→2→3が連続する公共基盤と主役を**先に構図設計**してから真Blender造形。実画像審査で改善の見込みがない量産・類似塔・巨大門・リボンは禁止。技術QAとARTの判定は独立。
- **未実施・HOLD：** R2Fの新しい都市造形／正式美術採用、時刻間B51、静的実B48道路交差、地形支持、実人間歩行、B51本物の画素遮蔽、人間の高速操舵・Windows/iPhone FPS。正式ART採用0件・Slope2 DNA認定0/2912m、GAMEPLAY/HUMAN/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD。PR #46 Draft/OPEN、元Git blob `af076d67492a677d2235e4730aef8cdf4808e106`・main/Gold/P100/W9-X/B5/本番2サイト・元物理/HUD無変更。詳細：[R2F Phase 0 実証](R19_A6P4_R2F_CAMERA_FIRST_TRUE_GLb_HERO_COMPOSITION_GATE_JA.md)。

---

## 【2026-11-01 R2E-E初稿→E2直接造形改修、真正技術PASS／独立ART REJECT】

- **初稿** [`54d07c7`](https://github.com/ryomashibaba/dopagaki-development-hub/commit/54d07c7200864150770f57eb1773651641291f49) の真正[Actions #41270654771](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41270654771)全SUCCESS。Artifact #13069550680、SHA256 `f534c7296d23c53bc42e3417896a33ef4f8c40481e8cb48f0d64c2bf741475ca`。実BLEND/GLB・元12WebGL2画像、GPU33,316三角形、161,336離散B51 SAT交差0。しかし巨大一枚壁と黄色屋根が現代オフィス群に見えるため**ART REJECT**。
- **同案E2直接改修** [`5eae7d0`](https://github.com/ryomashibaba/dopagaki-development-hub/commit/5eae7d0e703c1316452279164802a5676441cc78)、真正[Actions #41271119206](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41271119206)全SUCCESS、Artifact #13068924481、ZIP SHA256 `38f66f71525f9dcdbd541f0710c09872c1ae795881b01aba0dbcd5723dd47940`。実Blender15,098 faces/GPU30,436三角形、原B48×7/B51×28/240Hz・元ゲームblob不変。原12WebGL2真画像、元2幅×2,881tick×28 B51 **161,336離散SAT交差0**。
- **真正画面比較**：E1→E2 14m全画面RGB>36差は原4.404s 3.211%／8.004s 7.140%／11.504s 8.861%。本物の立体空隙・異なる屋根傾きは増えたが、実画像では大きな台形壁が独立して並び、立体街区・公共街路・前景から遠景の連続都市が不足。**E2もART REJECT、正式採用0件**。
- **次R2F方針**：建物数やbox/wingの自動増殖を停止。元3ヒーロー画角から人間的に強い空間構図・都市地盤・公共核を先行設計し、Blenderの意匠を真正画像で早期監査。新案がARTに見込みを示してから全真正QA。独立[監査と次ゲート](R19_A6P4_R2E_E1_E2_INDEPENDENT_NATIVE_ART_REVIEW_JA.md)を必読。
- Source Git blob `af076d67492a677d2235e4730aef8cdf4808e106`不変、B48×7/B51×28、球/HUD/RAW camera/採点、main/Gold/P100/W9-X/B5/2本番変更なし。Slope2 DNA認定0/2912m。GAMEPLAY/HUMAN/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD、PR #46 OPEN/Draft未マージ。

---

## 【2026-11-01 R19 A6 P4 R2E-D 新モデル真正実走QA → SOURCE TECH限定PASS／ART REJECT】

- 実装：[研究コミット `05ac66026aac`](https://github.com/ryomashibaba/dopagaki-development-hub/commit/05ac66026aac4faecf6c55e8b6bf1a646f84d863)。R2E-C原本保存／同ワークフロー再利用、新Blender生成コードとR2E-D専用真WebGL2/SATテストを隔離。main・Gold・P100・W9-X・B5・本番・元ゲームblob `af076d67492a677d2235e4730aef8cdf4808e106`無変更。
- **真正R2E-D [Actions #41269655028](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41269655028)全SUCCESS**。[Artifact #13067864733](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41269655028/artifacts/13067864733) SHA256 `b6f87bd98f7de9251feec13d055873cfc3c2f02288c2c8b86198559220e0f598`原本回収。実Blender 19,710 faces／独立GPU39,420三角形、5地区22用途・分節街路42・開放U字街区14。元球240Hz/元7B48/元28 B51/原カメラ・HUD不変、追加コライダー0。**元2幅×2,881tick×28B51=161,336の離散実GLB三角形SAT交差0**。連続時刻／地盤支持／歩行／元B51の画素遮蔽・人間走行／FPSは未証明。
- **同条件の元WebGL2全12PNGをR2E-Cと直接目視比較し、独立ART REJECT。** 14m原画面でRGB差>36の全画面割合は4.404s 2.031%、8.004s 3.625%、11.504s 6.853%。実際の中景建築量は増えたが、8秒も11.5秒も箱と独立建物の連なりに見え、目標の一体都市・建築の美しさ・公共空間に未達。数値差分は美術PASSの代用品ではない。
- **次R2E-Eの制作方針を厳格化**：同型箱/デッキ/街区の量産をやめ、元8.004/11.504s二つの本物の視線に共通する主役公共核＋分節地盤＋人間規模の公共空間を一案の実Blender形状として最初から設計。3重要時刻の真正画像で美術改善がない場合はフルCI増殖前に直接修正する。詳細：[R2E-D独立監査・R2E-E方針](R19_A6P4_R2E_D_TRUE12_2881_SOURCE_TECH_PASS_ART_REJECT_JA.md)。
- 正式ART採用0件、Slope2 DNA正式認定0/2912m。GAMEPLAY/HUMAN/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD、PR #46 OPEN/Draft未マージ。

---

## 【2026-11-01 R19 A6 P4 R2E-C 原本直接監査：TECH限定PASS／ART REJECT】

- **独立再判定：** R2E-C [真正Actions #41266597018](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41266597018)の全ステップSUCCESS。独立Artifact #13067775684をZIP SHA256 `95c8dcbd1274d53dcac34900f6624c8fc9e95669ecb8dc3b1bc0d32978a861e1`まで照合し、24原本ファイル、真正12/12 WebGL2 PNG、編集BLEND/GLB、全2881tickのB51 SATを直接確認。旧R2E-B Artifactも再取得して同一時刻の原画像を目視比較した。
- **技術：** 5地区22プログラム、Blender 18,848 faces／GPU 37,696三角形。新規35分節街路・20中低層街路量塊。元Source blob `af076d67492a677d2235e4730aef8cdf4808e106`、元B48×7/B51×28／240Hz、追加衝突0。2幅×2881tick×28動体＝**161,336離散B51検査で三角形SAT交差0**。時刻間swept CCD、実道路・地盤接地、実歩行、元B51画素遮蔽や人体認知、Windows/iPhone性能は**未証明**。
- **実画像の結論：ART REJECT。** 旧R2E-BとのRGB差>36の画素割合（14m全画面）は、元tick1057=0.313%、1921=0.334%、2761=2.085%。11.504秒に左側へ新しい色面や薄い街路帯が出たが、8.004秒を含め都市の連続性・奥行き・公共街区として弱く、旧孤立建物問題を解消していない。差分値は美術採点ではなく実画像も直接確認した。
- **次ゲート：** 推定配置や小建物の大量増殖でなく、原Road1 8.004/11.504秒の真正カメラとB51の実座標で中景「都市基盤→公共街路→中低層→主役核」を一案直接修正。Road0 4.404秒の狭路読解を保持。美術に改善がないまま同種CI/候補を繰り返さない。新Blender変更後の全真正QAを再実行する。**独立監査原本**：[R2E-C真正12画面 ART REJECT・次ゲート](R19_A6P4_R2E_C_TRUE12_B_VS_C_INDEPENDENT_ART_REJECT_AND_NEXT_GATE_JA.md)。
- 正式ART採用0件・Slope2 DNA認定0/2,912m、GAMEPLAY/HUMAN/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD。PR #46はOPEN/Draft未マージ。main／Gold／P100／W9-X／B5／本番2サイト無変更。

---

## 【2026-11-01 R19 A6 P4 R2E-C 実3D街路候補と独立検証を開始】

- **新規実装コミット：** [R2E-C Blenderソース](https://github.com/ryomashibaba/dopagaki-development-hub/commit/34f592b09d75402d998745fbd69bd94578fb648d) → [独立QA統合](https://github.com/ryomashibaba/dopagaki-development-hub/commit/8f231903907605e36c1252c89a9eac24ecbd28fa)。R2E-B原本・main・Gold・P100・W9-X・B5・本番2サイトは無変更。差分はR2E-C専用7ファイル追加のみ。
- **実制作：** Road1の3地区間を元道路アンカーから計算して、分節された実3D公共街路と高さ・屋根・奥行きの異なる中低層街区を1案として追加。Road0の住宅・市場は道路を横断しない2つの局所街路。現行の5地区、22建築翼、各36m屋外中庭・環状12床は継承。地形接地・歩行の成立は**未検証**。
- **真正QA：** [R2E-C専用 GitHub Actions #41266597018](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41266597018) を起動。初期preflight（元ソースblob/Python構文）と元PRIVATEゲーム・道路アンカーのビルドはSUCCESS、Blender導入以降は未完了（2026-11-01 JST確認）。**R2E-C TECH PASS、BLEND/GLB完成、真正12画像、全161,336 B51 SAT成功をまだ主張しない**。CI/ART未合格。
- **次の決定：** Actions完了後、真正元カメラの4.404/8.004/11.504秒をR2E-Bと比較して**一体の都市としての改善**を判定する。薄い空中帯・旧箱群・巨大門の再発、動体/道路の視認阻害があればART REJECTとして同じBlenderモデルを修正。無用な候補量産は禁止。
- 正式美術採用0件、Slope2 DNA認定0/2912m、GAMEPLAY/HUMAN/PERFORMANCE/RELEASE/MERGE HOLD。PR #46はOPEN/Draft、Work無断切替・本番公開は禁止。[実装と未検証事項](R19_A6P4_R2E_C_PRIVATE_IMPLEMENTATION_QA_HOLD_JA.md)。

---

## 【2026-11-01 R19 A6 P4 R2E-B 独立再監査】

- [真正R2E-B Actions #41193208028](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41193208028) の実ジョブは**全SUCCESS**。原Artifact #13039852952（4,815,031 bytes／ZIP SHA256 `676403ac58fdac8028c208845f411b4acf05ef39a9d236df06ac039233ed2fc9`）を直接取得し、編集可能BLEND/GLB、真正元WebGL2 12/12画像と元2881tick×28 B51×両幅のSAT JSONを監査。
- 実Blender **18,438面**・GPU **36,876三角形**・5地区22翼・元球240Hz・元B48 7/B51 28・元Blob `af076d67492a677d2235e4730aef8cdf4808e106` 無変更、追加コライダー0。原動体との**161,336瞬間サンプルで3D接触0**。連続時刻間、実B51ピクセル視認、地盤接地、人間操作/FPSは**未証明**。
- R2E-A/Bを同一原カメラの4.404/8.004/11.504秒で再実見。R2E-Bでは皿状フロア→厚みのある建物へ確実に改善した一方、道路脇に**孤立した建物群**が並ぶだけで、街路・都市基盤・公共空間の連続性と圧倒的な未来都市が成立しない。**独立ART REJECT**。公式採用0件、Slope2 DNA正式認定0/2912m、GAMEPLAY/HUMAN/PERFORMANCE/RELEASE/MERGE HOLD。
- [R2E-B独立監査および次の都市構成ゲート](R19_A6P4_R2E_B_NATIVE12_TECH_PASS_ART_REJECT_URBAN_COHESION_GATE_JA.md) に真画像A/B比較・画素差・再現根拠・次のR2E-C候補手順を保存。次は**地盤・街路・中低層・公共核・遠景を本物の走行カメラから一体的に設計**し、既存Blender→GLB→PRIVATE WebGL2 QAを再利用。別案の量産／巨大門・リボン／旧箱の反復／新たなCIの乱立は禁止。main/Gold/P100/W9-X/B5/本番と元物理は不変、PR #46 Draft維持。

---

## 最新 R19 A6 P4 R2E：公共空間起点の新制作 → R2E-A美術REJECT／R2E-B直接改修

- **[R2E-A専用Actions #41192335941](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41192335941)は全SUCCESS**。[真Artifact #13039806771](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41192335941/artifacts/13039806771)を実ダウンロード・正規PNG12/12を実見。元Blender5メッシュ／**22用途別建築翼**／12区画の**開放中庭公共歩廊（各地区継ぎ目0.0m、直径36m空洞）**、12,630 Blender面／独立GPU25,260三角形。元B48×7/B51×28/元球240Hz/元RAW camera/HUD/元ソースBlob `af076d67492a677d2235e4730aef8cdf4808e106`無変更。
- **R2E-Aの全240Hz B51真正SAT（両幅×元0..2880 tick×全28体＝161,336動体時刻、GLB25,260三角形）交差0**。ただし離散240Hz点の非干渉であって、時刻間連続掃引、人間のB51可視・走行、地盤支持、ゲームでの歩行はHOLD。
- **R2E-AのART判定はREJECT**：元12画面では厚い建築が消えて、多色の薄い皿型フロアが幾重にも浮遊するように見える。Road0 4.404秒／Road1 8.004／11.504秒の中央ROIの参考色差（元P3都市なしとのRGB最大差36超、建築だけの画素ではない）はR2D-B `17.72/27.38/29.52%` → R2E-A `9.80/13.44/15.95%`。空洞・用途が3D内部にあっても元ゲームの遠景からは都市として認識できず、正式ART採用0。原画像の批判的監査：[R2E-A正式記録](R19_A6P4_R2E_A_REAL_COURTYARD_ART_REJECT_B_DIRECT_GEOMETRY_REVISION_JA.md)。
- そこで**R2E-Bを実3Dメッシュに直接修正**：各建物の4階層に、実厚みのある**部分開口を備える垂直外壁**を追加。下部の実3D支持部材も増設。屋外中庭と12区間の連続床は維持し、以前の巨大塔/門/長い横リボンは戻さない。新設の建築は、色だけでなく幾何形状として建物に見える必要がある。
- **[R2E-B専用Actions #41193208028](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41193208028)を開始、初回はrunner待ち**。R2E-AのTECH/SAT成功をR2E-Bに流用禁止。実Blender・GLB再読込・元12画像・元B51の全2881tick検査が本当に成功し、画像を実見するまで**R2E-B TECH/ART未認定**。
- main/Gold/P100/W9-X/B5/本番無改変、元240Hz・7B48/28B51不変。PR #46 Draft・未マージ。公式ART採用0／Slope2 DNA正式認定0m、GAMEPLAY/HUMAN/PERFORMANCE/RELEASE/MERGE HOLD。

---

## 最新 R19 A6 P4 R2E（2026-10-31 JST） — 真の公共空間を起点とするBlender都市制作に転換

- **R2D-Bは元240Hz・実GLB 40,628三角形・真正12WebGL2画像・全2,881tick B51 SATはTECH PASS、しかしART REJECT**。巨大無地の都市崖に窓や床を加えても、実画像では石碑の反復に見え、都市の公共性・人間規模・用途が成立しなかった。[厳格R2D-B監査](R19_A6P4_R2D_B_ACTUAL_BLENDER_12_WEBGL2_2881_B51_ART_REJECT_JA.md)。
- 反省を受け、**R2EはBlender制作ソース自体を刷新**。[新しい真の屋外中庭＋公共歩廊制作コード](../scripts/p101-r19a6p4r2e-real-open-civic-court.py)：元道路Road1 u=.30/.47/.64、Road0 u=.44/.73の5地区を維持し、交通／文化・大学／植物園・劇場／住宅／市場の建築プログラムを設定。各地区に**直径36mの開放中庭、12枚の実3D厚床で構成する一周の公共歩廊、接続ギャップ1e-8m未満の直接検査、3〜5の曲線状複数階建築翼と実3D張出し床・窓・低層装飾**を生成。ゲーム上のプレイヤー通行、建築の居住、元地盤への支持は**一切未確認**。単純な押出石碑や門・巨大水平帯へ回帰しない。
- [R2E専用Actions #41192335941](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41192335941)を実際に作成・起動。初回確認ではrunner**QUEUED**。実Blender/GPU変換、元14m/28m×6 native ticks=真正12 WebGL2画像、元B48×7/B51×28・0..2880の全2,881 tick厳密3D SAT、実歩廊床の繋ぎの検査が完了するまで**R2E TECH/HUMAN/ARTは未認定**。
- 次はR2Eの実元ゲーム画像をR2D-Bと4.404／8.004／11.504秒で比較し、単純な画像差やポリゴン増加ではなく、実在する公共空間が視認できるか・中低層のつながり・原障害物の読み取りを厳しく評価。ART REJECTなら新Blenderソースの形状に直接修正を加える。詳細：[R2E設計と厳格QA](R19_A6P4_R2E_OPEN_PUBLIC_COURT_METHOD_AND_QA_JA.md)。
- 元Git blob `af076d67492a677d2235e4730aef8cdf4808e106`、7B48／28B51／240Hz球／RAW camera/HUD、main/Gold/P100/W9-X/B5/本番を無変更。正式ART採用0／Slope2 DNA認定0m、GAMEPLAY/HUMAN/PERFORMANCE/RELEASE/MERGE HOLD。PR #46 OPEN/Draft未マージ。

---

## 【最新】R19 A6 P4 R2D-B 実Blender+全2881tick TECH PASS／ART REJECT（2026-10-31 JST）

- [正規Actions #41191352574](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41191352574)全SUCCESS。[実Artifact #13038474627](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41191352574/artifacts/13038474627)をダウンロード／画像実見。**元14m/28mのBlender編集可能5地区、19,722面、独立GPU40,628三角形、元ゲーム本物の12/12 WebGL2画面**、元A0球XYZ差最大0.0007703576m。
- **元B51全28基×元native0..2880の2,881tick×両幅＝161,336の動体時刻検査、真GLB三角形と原回転OBBの13軸SAT交差0**。これは離散240Hz点の非干渉であって、時刻間連続掃引／元B51の画素視認／人間の安全確認はまだHOLD。
- [R2D-A正規CI #41190775304](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41190775304)もTECH PASS/ART REJECT。無地岩柱という欠点があり、R2D-Bでは実3Dファサード・張り出し床・追加低層区画をBlenderで**直接修正**。しかし元4.4/8/11.5秒の同じ原ゲーム画面を比較すると、**窓と階層が少し見えるだけで、巨大石碑型の都市崖が反復しており都市の完成美術に未達**。**R2D-BもART REJECT**。
- R2Cからの元画面の中央ROI参考差分（建築だけの可視画素ではない）：4.404秒 R2C21.67%→R2D-B17.66%、8.004秒 R2C35.35%→R2D-B27.56%、11.504秒 R2C23.70%→R2D-B29.54%。8秒の都会の広がりはR2Cより弱まった。
- 初回R2DはPython構文、次は出力パス変数の衝突で失敗し、真正CIログから直接修正して成功。**失敗/修正記録は消さない**。元Blenderソース、元物理と本番は無改変。公式ART採用0件／Slope2 DNA正式認定0m、人間ゲームプレイ・性能・出荷・マージはHOLD。PR #46 Draft未マージ。
- **次の厳守方針：R2Eでは押出塔・巨大彫刻・箱群に小さな窓や色を足す方式をやめる。実都市の路地・歩行可能な公共床・異なる用途の建築・建物内外の接続・遠景から接近までの時間設計を中心に、PRIVATE本物の3Dシーン/描画材質を抜本設計。元12真正WebGL2・元全2881tick B51 SATを採用ゲートとして維持。** [詳細と直接美術判定](R19_A6P4_R2D_B_ACTUAL_BLENDER_12_WEBGL2_2881_B51_ART_REJECT_JA.md)。

---

# 最新 R19 A6 P4 R2C：両実カメラ都市配置TECH PASS／美術REJECT（2026-10-31 JST）

- **[R2C正規Blender/真12画面CI #41189700048](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41189700048)全SUCCESS**。[原Artifact #13038431720](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41189700048/artifacts/13038431720)回収・実見。元A5/元B48 7/B51 28/元240Hz・RAW camera/HUD無変更、5独立編集可能BLEND地区、29中低層都市マス、14,424 Blender面・30,088 GPU三角形、14m/28m×元6tick=真正WebGL2 12/12画像。R2B「8秒だけ都市・11.5秒は空白」を修正し、Road1の主役配置を維持しつつ後方二地区を元路肩の左側へu=.47,out308mとu=.64,out267mに直接再配置。
- **[R2C元B51全native240Hz 0～12秒独立CI #41190038075](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41190038075)全SUCCESS**。[Artifact #13037653968](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41190038075/artifacts/13037653968)のJSON原本をダウンロード確認。14m・28m各元2,881tick×28真正B51回転OBB×R2C実GLB 30,088三角形をSAT検査。**各幅80,668、全161,336動体・時刻に対して実三角形干渉0**。240Hz点間の連続掃引や人間の障害物認知は未検証。
- **元P3「都市無し」真WebGL2画面との参考色差計測**（ROI x202..809/y140..319; RGB最大チャネル差>36、純粋な建物画素占有率ではない）：4.404s R2A9.13%/R2B18.70%/**R2C21.63%**、8.004s R2A5.60%/R2B29.26%/**R2C35.12%**、11.504s R2A32.40%/R2B0.00%/**R2C23.59%**。8秒と11.5秒の両方で都市が再出現し、R2Bの時間的な構図回帰を解決。
- **独立美術判定：ART REJECT**。R2Cで8秒と11.5秒の都市構図とB51全240Hz離散干渉の問題は前進。ただし中低層建物は段付き箱／同形8断面押出の反復に見え、背景・実公共空間・人間規模の都市美術の質がまだ足りない。R2Cを本番採用しない。**次R2Dは塔数/改色の手直しでなく、建築言語・屋外公共地盤・真3D都市機能の大幅再設計**。取得した前方2時刻のバランスを崩さない。詳細[厳格R2C監査](docs/R19_A6P4_R2C_TRUE12_DUAL_CAMERA_CITY_ART_REJECT_JA.md)。
- 正式ART採用0、Slope2 DNA正式認定0/2912m、HUMAN/GAMEPLAY/PERFORMANCE/RELEASE/MERGE HOLD。main/Gold/P100/W9-X/B5/本番、元Blob `af076d67492a677d2235e4730aef8cdf4808e106`無変更。PR #46はOPEN/Draft未マージ。

---

## R19 A6 P4 R2A 技術PASS／美術REJECT → R2B元カメラ直接修正

- [R2A実Blender/元12WebGL2 Actions #41186356391](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41186356391)全SUCCESS。[原Artifact #13036978998](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41186356391/artifacts/13036978998)を回収。元A5を真Blenderで**5地区29マス**の中低層実3D都市へ作り直し、ULTRA14m/CONTROL28mの編集可能BLEND/GLBと、元240Hz×6時刻=真WebGL2 12/12画面が生成。Blender **14,424面**、独立GPU **30,088三角形**、元球XYZ差最大0.0007703576m、源Blob `af076d67492a677d2235e4730aef8cdf4808e106`保護。
- **[R2A元B51全240Hz 12秒独立Actions #41186681731](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41186681731)全SUCCESS**。[原Artifact #13037146231](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41186681731/artifacts/13037146231)を回収してJSON照合。14m/28m各0～2880の**2,881原native tick×28基B51**、回転した真OBB対編集GLB30,088三角形の13軸SAT、**実3D交差0**。離散元240Hz時刻の全点検査であり、間の数学的連続時間、画素視認・人間安全の証明ではない。
- R2Aの元画像の批判評価は**ART REJECT**。Road0 4.404sは小箱、Road1 8.004sは都市の主役核が画面右遠方で小さく主題を欠く、11.504sの巨大左壁消失は前R1から改善したが、色が積み木的で公共街区として貧弱。元画像実見比較の根拠[正式R2A監査](docs/R19_A6P4_R2A_TRUE12_ALL_2881_TICKS_TECH_PASS_ART_REJECT_JA.md)。
- **R2B改修のソース保存済み**：P3真正元カメラからRoad1 8.004秒の焦点を元画面座標NDC x≈-0.24, y≈0.18～0.47に移すため、主役街区を道路1u=.54→.30／左外側208→270m、164m高の非対称屋根、まとまった落ち着いた壁面配色へ直接再編集。11.504sには焦点街区がカメラ左後方に退出し、以前の近景巨大壁回帰を避ける設計。[R2B真正Actions #41186791512](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41186791512)で元12画面・元B51を**別途検証待ち**。**R2Aの2,881tick SAT PASSをR2Bに流用禁止**。最終美術判定は実写真を比較してから。
- main/Gold/P100/W9-X/B5/元物理/本番変更なし。PR #46 Draft未マージ。正式ART採用0件／Slope2 DNA正式認定0/2,912m、GAMEPLAY/HUMAN/PERFORMANCE/RELEASE/MERGE HOLD。


---

# DOPAGAKI SLOPE — LIVE HANDOFF（2026-10-31 JST・R19 A6 P4 R1 TECH PASS／ART REJECT、次R2の抜本都市建築へ）

**本来の不変目標**：本物の7,280m・約52秒級Slope2高速ゲーム（200m/s級、本物のカーブ・細道・ジャンプ・動体）と、圧倒的に美しく一体的な超未来巨大都市を**同じ人間プレイ体験で**成立させる。Slope2 DNA目標2,912m、正式認定0m。正式ART採用0件。技術QAの成功をART/GAMEPLAY/HUMAN合格と混同しない。


### P3新規：本物の旧A1カメラ12件の再利用と、単純タワー1,360配置の負の分析

- 旧A1原Chromium CI [#41133092902](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41133092902)／原Artifact #13014316341から正規元`cameraEye/cameraFront`12件を再取得、オリジナルJSON SHA256 `b5641a5298ec9f20fec48712f9e80dcc26f01a2b473b2a571fc61b07f9701ee0`確認。[実測12カメラ記録](R19_A6P3_PRIOR_A1_ORIGINAL_12_TRUE_CAMERAS.json)をGitHubで読める正本化。
- 元ゲーム実Road1の34断面×左右2×道路端距離5×高さ4、計**1,360サイト**を元カメラ画面へ投影。両幅でRoad1 8/11.5秒のどちらかに一定面積見える候補684件（**独立ローカルPython計算**）。それらがさらにRoad0 3/4.4/5.2秒の大きな中央ROIに一切重ならないという保守条件では**0件**。これは「都市が不可能」という結論でもB51実画素遮蔽の証明でもない。単純な直立箱塔だけで問題を解決できるとは言えないという**負の設計証拠**。詳細：[P3負の監査](R19_A6P3_PRIOR_A1_REAL_CAMERA_12_NEGATIVE_ARCHITECTURE_GATE_JA.md)／[再現可能なNodeコード](../scripts/p101-r19a6p3-prior-a1-vertical-tower-counterexample.mjs)。
- 新P3 Chromium/28物理B51-OBB完全投影の専用CIは**GitHub runner割り当て待ち**。初回[#41182781084](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41182781084)は後続の初期化時read-onlyガード修正によりキャンセル、新[#41183558390](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41183558390)がpending/queued（2026-10-31 JST確認）。**12フレーム28OBB測定TECH PASSとはまだ言わない。**
- 次の造形は正規カメラ＋B51の前方マスクを明示し、Road1に**相互接続する縦の公共/居住地区・実3D内庭**を構築。中央視野を水平架構で再び覆うことは禁止。元B48/B51/カメラ/本番、main、Goldを変更しない。正式ART採用0/Slope2 DNA認定0m、GAMEPLAY/HUMAN/PERFORMANCE/RELEASE/MERGE HOLD。

## 最新 P4 R1（元3D貫通の回帰防止、真正12写真TECH PASS／ART REJECT）

- [真正 GitHub Actions #41185479775](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41185479775) **全SUCCESS**。[原Artifact #13035893443](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41185479775/artifacts/13035893443)をダウンロード・検証し、Blender `.blend`/GLB両幅各1、5メッシュ、**10コア・14,548 Blender面／29,176 GPU三角形**、元14m/28m×6 native tick **12/12実WebGL2 Canvas**撮影。A0元球XYZ差最大0.0007703576m／速度差最大0.0004716m/s、元Blob/元7 B48/28 B51/240Hz/RAW camera/HUD不変。**P4 R1 TECH PASS**。
- 新規[元B51回転OBB対実GLBの13軸SAT独立ゲート](../scripts/p101-r19a6p4-original-b51-triangle-obb-contact-gate.mjs)で**両幅×6元時刻×28動体で真3D三角形交差0**。旧R0の`a13-machine-12`に三角形重心が2時刻で内部侵入した問題を、この範囲では除去。**12秒連続全時刻の非交差・B51画素遮蔽・人間視認は未検証**。
- 実画像をR0と同条件で厳格比較して**ART REJECT**。旧R0の17本の痩せた塔→10の太い形で数は減ったが、4.404秒は短い塔群、8.004秒は道路前方の孤立した建築塊、11.504秒は近景左の巨大な塔基部＋右側の細い2塔。都市街区・中低層基盤・広がり・公共機能の可読性不足。単にペタル塔の数や太さを変える微修正を**今後の主戦略から外す**。
- 次P4 R2は[美術REJECTと次ゲートの正式監査](R19_A6P4_R1_REAL_12_WEBGL2_AND_B51_3D_SAT_TECH_PASS_ART_REJECT_JA.md)に従う。**異なる建築言語を採用し都市の主役核・非対称の中低層街区・立体地盤・公共空洞を実制作**して、人間の元カメラの遠景→接近→通過を比較する。巨大門／水平リボン／柱列／空中ポータルの再生は禁止。正式ART採用0、Slope2 DNA正式認定0m、HUMAN/GAMEPLAY/PERFORMANCE/RELEASE/MERGE HOLD、PR #46 Draft未マージ。

## R19 A6 P4 R1 — 直接美術修正（コード更新済み・真正CI待ち）

- **P3専用 Actions #41183558390 は全SUCCESS**。[真正Artifact #13036507375](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41183558390/artifacts/13036507375)を回収し、14m/28m×6時刻計12真正WebGL2・カメラeye/front/right/up・元28 B51 OBB投影を確認。FOV元GLSL係数1.35、垂直73.057711°／水平94.141613°。画面と幾何外接箱が交差するB51は各tick 9～21基（**実画素可視ではない**）。配置評価512候補中17件を研究上の幾何学的低リスク候補に選別（**都市や視認のPASSではない**）。**P3 TECH PASS**。
- **P4 R0専用 Actions #41184387785 も全SUCCESS**。[真正Artifact #13036687584](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41184387785/artifacts/13036687584)回収、両幅の実Blender `.blend`各1件、編集GLB各1件、5建築地区、Blender **15,098面**／GPU **30,332三角形**、真元240Hz WebGL2**12/12画面**、球元XYZ差最大0.0007703576m、非衝突0。原ソース・元B48×7/B51×28・元RAW camera/HUD不変。**R0 TECH PASS／ART REJECT**：14mの4.404s、Road1 8.004/11.504sでは17個のそっくりな縦長塔・基礎が並び、都市生活／密な市街区に見えず、11.5sには画面端の巨大近景柱が視界を支配。旧水平リボンの失敗を同形の縦塔に置換しただけ。[P4 R0美術REJECT根拠](R19_A6P4_R0_TRUE12_BLENDER_TECH_PASS_ART_REJECT_JA.md)。
- **P4 R1直接修正実装済み**：既存P4 Blenderスクリプトを見た目の失敗から直接修正。17の反復塔→10の非対称居住マス、地区ごとにペタル4～7枚／峰高さ変化、外壁厚み・低層デッキ・都市基盤強化、Road1-A3を路肩外側**176→270m**に変更（元動体`a13-machine-12`との6時刻の幾何学的近接を減らすため）。ただし全軌道とGLB実3D干渉/実画素視認は未認定。新[Actions #41185315879](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41185315879)がrunner割当待ち。**R1のTECH/ARTは未判定**、成功を先取りしない。
- main/Gold/P100/W9-X/B5/本番無変更、PR #46 Draft未マージ、正式美術採用0件／Slope2 DNA認定0m、人間プレイ/FPS/発売はHOLD。

## 最新 R19 A6 P4 — 実Blender縦型都市の制作ソース追加・真WebGL2 12画面CI待ち

- 前P2「水平リボン・浮遊橋の反復」をART REJECTとしたまま、**A1真正12カメラ／P2元B48 Road0/1×81断面**から、[P4独立Blender制作スクリプト](../scripts/p101-r19a6p4-blender-vertical-open-atrium-city.py)を開発。Road1を主役にした5地区／17コアの**分節された縦型建築、実際に中央が空洞の6ペタル外壁、階段状テラス、彫塑された基礎、短い地区内連絡路**を設計。旧箱／巨大門／横長リボンに戻さない。
- Pythonコード、[GLB PRIVATE取込](../scripts/p101-r19a6p4-private-source-game-real-blender-pack.mjs)、[元ゲーム12画面QA](../scripts/p101-r19a6p4-12-original-native-camera-art-qa.mjs)、[Blender/Chromium専用Actions](../.github/workflows/p101-r19a6p4-camera-guided-true-blender-city.yml)は**PR #46に保存済み**。ただし**[現P4 CI #41184387785](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41184387785)がrunner未割当のため、実Blender起動・GLB/BLEND実生成・元WebGL2実画像12枚の完了は未確認**。TECH/HUMAN/GAMEPLAY/PERFORMANCE/RELEASE/MERGE HOLD。
- P3の28基 B51 OBB全面計測も[CI #41183558390](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41183558390)で**runner未割当**。P4が使ったのは**旧A1で本当に収録したeye/front**であり、28動体の実GPU画素マスクではない。元B51視認性、人体通路、地盤接地、PBR、Windows/iPhone FPSは検証していない。間引き頂点から投影した画面矩形は保守的な全メッシュ外接の証明でもない。
- **ARTは過去P2のREJECTが継続**。物理元Blob `af076d67492a677d2235e4730aef8cdf4808e106`／B48×7／B51×28／240Hz／RAWカメラは無変更。正式ART採用0／Slope2 DNA認定0m。次は専用CI完走→真正12枚のP2同条件比較→実Blenderで**少なくとも2回直接造形修正**（良く見えないならREJECT）を優先。[P4監査](R19_A6P4_SOURCE_CAMERA_VERTICAL_BLENDER_CITY_IMPLEMENTATION_AND_HOLD_JA.md)。PR #46 Draft、main未マージ。

## 最新 R19 A6 P3 — 実カメラ12時刻・B51/道路0・1配置計測へ（CI待ち・未認定）

- [P3専用GitHub Actions #41183558390](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41183558390) は2026-10-31 JST時点で**queued**（旧#41182781084は後続更新のため取消）。ソース、CI、検査コードはPR #46の研究ブランチへコミットしたが、**生カメラ12枚と配置候補の実測成功は未確認**。公式ART0件、Slope2 DNA認定0m、GAMEPLAY/HUMAN/PERFORMANCE/RELEASE/MERGE HOLD。
- 元sourceの`viewForPose`・WebGL2 GLSL係数1.35、真カメラeye/front/right/up/viewport、28物理B51の真OBB現在位置/向きを**PRIVATE copyに読み取り専用**で追加。元14m/28m×6 native ticksの元Canvas画像・A0物理一致を計測するCIを用意。実道路0/1各81サンプルを使った**縦型都市区画の画面投影候補**も、実カメラに照合するコードを実装。
- **B51 OBB投影≠GPUピクセル可視/遮蔽**、配置候補≠都市3D完成、評価スコア≠美しさ。これらを混同しない。前P2の巨大な吊りリボン・反復柱もART REJECTのまま。
- [P3実装と技術/美術ゲート](R19_A6P3_TRUE_CAMERA_B51_GEOMETRY_FIRST_SITE_GATE_JA.md)。次に必要なのは真正CI実測、原12画像とカメラ・実B51の視認監査。その後**カメラで見える立体都市主役・縦区画・公共空洞**を美術制作し、実画面で判定。単純な箱・巨大門・水平リボンへ回帰禁止。

## 最新 R19 A6 P2（本物の5地区Blender全面再設計・真正12画像ART REJECT）

- [GitHub Actions #41181717911](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41181717911) **全SUCCESS**。元source Blob `af076d67492a677d2235e4730aef8cdf4808e106`、正規7 B48/28 B51、240Hz物理、RAW camera/HUD無改変。元道路0/1各81断面を14m・28mで採取し、実Blender 4.0.2で旧A5箱形を**5地区とも別の真3Dへ置換**、本物の`.blend`2件/編集GLB2件を生成。元source SHA・indexed/TRS/COLOR再読込PASS。5建築オブジェクト、実GPU **33,700三角形**、非衝突0。
- 元14m/28m×元0〜12秒6時刻の**真正12 WebGL2 Canvas画像全取得**、球XYZ差最大0.0007703576m、速度差最大0.0004716m/s、B51=28、カメラ同tick。旧A5から画素は12/12枚変わったが美術認定ではない。[原Artifact #13034723431](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41181717911/artifacts/13034723431)（2026-11-07 07:46 UTC失効予定・永久バイナリ化は未実施）。
- **ARTはREJECT。** Road1の空虚な空とRoad0右側の旧箱は減ったが、新しい巨大水平曲面帯と長い吊り脚が4.404s/8.004s/11.504sで視野上部を覆い、都市ではなく浮遊高架に見える。前の巨大門失敗を巨大リボンに置換しただけ。実B51の見やすさ・人間走行・Windows/iPhone GPU FPSは**HOLD**、正式ART採用0・Slope2 DNA認定0m。ART成功を偽装しない。
- **次P3：** 先に本物の6元カメラの位置・向き・視錐台とB51画面マスクを記録し、実画像の構図から都市の主役と縦の建築区画/中庭/都市基盤を再設計。旧箱・巨大門・長い水平リボン・ぶら下がる脚の反復は禁止。真Blender→GLB→元ゲーム描画基盤は再利用。成果と反省は[A6 P2完全監査](R19_A6P2_REAL_B48_SPATIAL_REDESIGN_TRUE12_ART_REJECT_JA.md)。PR #46 OPEN/Draft未マージ、main/本番無改変。

## 旧 R19 A6 P1（実Blender編集の技術PASS・真正美術REJECT）

- **本物のBlender 4.0.2で**、A5 14m/28m GLB各5地区を import→三次元メッシュ編集（非対称彫塑+主役地区の立体曲面）→編集可能 `.blend`・編集GLB保存。10,566→**10,728三角形**（+162）、5独立地区、非衝突0追加。Node独立のindexed glTF/node変換/色データのGPU再読込PASS。**Blender GUI手動で作品を完成させたとの主張ではない**。
- [専用Actions #41180479851](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41180479851) **SUCCESS**。元14m/28m×元6tickの実WebGL2 Canvas**12/12撮影・旧A5とのSHA画像差12/12**。元240Hz球XYZ誤差最大0.0007703576m／速度誤差最大0.0004716m/s、元道路7/B51 28/元カメラHUD保持。
- [Artifact #13034364524](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41180479851/artifacts/13034364524)：実`.blend`2件・GLB2件・12真正写真/QA記録、2026-11-07 UTC失効予定。**バイナリ恒久GitHub原本化は未実施**。ソーススクリプトはこのブランチに保存。
- **ARTは厳格REJECT**。4.404秒の右の孤立した箱/フレームと、8.004秒Road1の空虚な前景・右端だけの巨大建築がそのまま残る。僅かな曲面化やPNG差を美術改善と偽らない。正式ART0件／Slope2 DNA認定0m、GAMEPLAY/HUMAN/PERFORMANCE/RELEASE/MERGE HOLD。
- **次R19 A6 P2**：旧箱・門・微小変形の続きは中止。元6視点をもとに**道路0/1の遠中近景の都市主役配置と連続街区を抜本再設計**する。特にRoad1 8〜11.5秒の正面を埋める本物の巨大都市と、14m細道4.404秒のB51危険認知の両立。作成済みBlender↔GLB↔PRIVATE元ゲーム検証基盤を再利用。[完全監査](R19_A6P1_REAL_BLENDER_EDITED_GLBS_NATIVE12_ART_REJECT_JA.md)。


## 最新 R19 A6 P0（技術限定PASS）

- A5元14m/28mそれぞれの**5独立メッシュ・5仮材料・10,566三角形の真正GLB**をSHA固定で実バイナリ読込し、全GPU XYZRGB float32を元直接ソースと照合して完全一致。改ざん/別モード/別blobの負のゲートを拒否。Blender GUIでの実編集・再書出しは未実施。
- [真正GitHub Actions #41179550859](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41179550859) **全ジョブSUCCESS**：元A5直接都市の生WebGL2 24PNGを再収集後、GLB由来PRIVATE描画で元14m/28m×4.404sと8.004sの4枚を原同tick画像とSHA256 **4/4完全一致**。元球位置/速度・7 B48/28 B51・240Hz RAW cameraを検査。元source blob保護。
- [原Artifact #13033983651](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41179550859/artifacts/13033983651)：約664kB、2026-11-07 07:13 UTC失効予定。CI検査HEAD `038872b79a91ad70f68b6645652c795c76291cb2`、後続docs/Windows cmdは同CI未検査。
- **最終判定はR19 A6 P0 SOURCE GLB READBACK TECH PASS／ART REJECT。** A5の孤立箱・門・偽地盤と視認問題は解決していない。正式ART0件／Slope2認定0m／HUMAN・GAMEPLAY・PERFORMANCE・RELEASE・MERGE HOLD。
- **次工程A6 P1/P2：** 実編集可能GLBをBlender等で修正し、indexed geometry/node transform/材質の検証済み再取込を確立。元6視点で遠中近景の都市一体感を大幅に改善して厳しくART判定する。単純なJS箱/門の追加は禁止。Windows手動14m/28mと原B51の真視認/GPU FPSは別途HOLD。[詳細証拠](R19_A6_P0_ORIGINAL_GLB_PRIVATE_ROUNDTRIP_AND_ART_GATE_JA.md)／[時間構図マスタープラン](R19_A6_SIX_TRUE_CAMERA_CITY_ART_MASTERPLAN_JA.md)。


## 永久保護
元WebGL2 `web/p101-w9c2-g4e7ci-integrated-streetscape.mjs` Git Blob `af076d67492a677d2235e4730aef8cdf4808e106`、元240Hz CCD、球r0.65m、実B48道路7本／本物B51動体28基、元P96/P94/A13、元RAWカメラ/HUD。本番/main/Gold/P100/W9-X/B5無改変。作業は`p101-velocity-overdrive-native-trial` Draft PR #46 OPEN未マージのPRIVATEのみ。透明床・磁石救済・偽減速/完走/資格詐称は禁止。

## A0〜A4の独立証拠
- R19 A0本物の0秒→12秒、ULTRA14m/CONTROL28m両走行継続、警告1.104s→真狭路コア4.404s（3.3s）、ULTRA補間の真幅13.159〜14m、概算路肩最小1.743m。人間が操作できる保証ではない。
- A1の元Native同tick24WebGL2画像、A2の真36画像でW9巨大壁・G5B/Mega重なりとB51装飾架台を画像寄与で特定。旧美術REJECT。
- A3は巨大白棚・柱が再発してART REJECT。A3Rはroad1の8/11.5秒にも構造が現れるが薄い骨組み/巨大門でART REJECT。
- A4は34ベイの本物の建築奥行き、5独立オブジェクトのglTF2編集GLB×2、真WebGL2元24画像・物理同tickでSOURCE TECH PASS。ただし建物が空中で孤立し、都市の内部機能/基盤がなくART REJECT。元証拠 #13019567092。

## R19 A5（過去の正式ART REJECT）
- **同じ1都市案RIFT CIVIC BASILICA**を再改修。主役1/公共地区4、34の厚みのある建築ベイに加え、**15件の多角形段状都市基盤・10件の公共空間の隙間・10件の下部支持部材・5件の景観アクセス**、合計**10,566三角形**の元B48ソース位置の独立5地区3D。元道路・B51本体/カメラ/操作を変えず、衝突追加0。
- **glTF2 GLBをULTRA14m/CONTROL28m各1件**、いずれもBlender等で5つの独立建築区画と**5個の仮編集マテリアル**を編集可能。1件約765kB。第三者`trimesh`で両方を5ジオメトリ、合計10,566面として正常読込、各SHA確認。Blender GUI実操作は未確認。光は元RGB頂点の簡易方向シェードであって**本物のPBRやシャドウは未実装**、実地形へ接地したとの証明もない。
- 最新[Actions #41144200111](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41144200111) **全ジョブSUCCESS**、原元Canvas画像24/24 SHA、元Native球XYZ最大誤差0.00077036m/速度0.0004716m/s、元7 B48/28 B51、GLB双方SHA・編集用5メッシュ構造を確認。一次Artifact #13019233506（ZIP SHA256 `2f05fcd04fcfc369cea8dacc268af746046f94b4cd4346fa57172aceb0c9d300`、2026-11-06 23:26 UTC失効）。
- 同じ元14m生カメラのCity ON/OFF中央ROI画素差：1.104s 4.230%、3.004s 9.750%、4.404s 10.576%、5.204s 3.658%、8.004s 1.383%、11.504s 6.508%。**ピクセル差は美しさ/遮蔽の割合ではない。**
- **ART REJECT**。建築の下へ都市基盤が加わったものの、実画面は近景の孤立した箱型建物・柱・門状フレームと空白が大半。元14m細道コア4.404秒の側面視界占有が増え、元B51の初見読解に関する安全性は未証明。8〜11.5秒でも巨大な実都市として連続しない。15基盤や10,566面を質の合格とすることは禁止。
- 詳細：[A5の完全独立監査](R19_A5_TRUE24_GLB5_ART_REJECT_AND_SOURCE_GAME_CONTINUITY_JA.md)、[A5設計](R19_A5_CIVIC_TERRACES_FIVE_EDITABLE_MATERIALS_GENUINE_CAMERA_GATE_JA.md)。

## A5時点の旧次工程記録（A6 P0技術検証で部分達成・美術は未解決）
**似た箱/門/基盤を増やす工程は停止**。A6は制作方法の進化：今回確実に作った5オブジェクトGLBを本当のデザイン原本として編集し、PRIVATE元WebGL2に安全に再読み込みできる入出力基盤を構築。元の6カメラで道路0/1の遠景・中景・近景と一体都市の造形を先に判断。既存スクリプト/CIを再利用し、高品質建築の外皮・視覚機能・色/照明と街のつながりを優先する。Windows RTXの人間14m/28m実プレイとFPS/B51のピクセル視認は別ゲートでHOLD。

**正式ART0件、Slope2 DNA 0m、GAMEPLAY/HUMAN/PERFORMANCE/RELEASE/MERGE HOLD。**
