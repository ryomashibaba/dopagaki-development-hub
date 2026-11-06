# DOPAGAKI SLOPE — HYPER RUSH
# 完全統合・批判的方針再評価・次チャット正本（K4CT R5後／2026-11-06 JST）

**これは継続開発であり新規企画・正式採用・方針撤回ではない。**
**最新R8Eの真正RAW批判判定を反映した『次に進む』判断は本書のR8D/R8E追補と第6〜8章の固定安全条件の併読による。** 本書に記載したGitHub HEADとCIは作成時点の値。次回は生のGitHub HEADを必ず再取得する。古い正本内の「現最新」「次工程」は歴史的な記述として扱い、当時の正しい事実・安全条件は撤回しない。

## K4CT R8C 実制作の批判的結果：真正TECH PASS／ART REJECT → 研究内で非採用・原地形へ戻す
- [R8C真正Blender4.0.2／元WebGL2・240Hz実走行 #42159236198](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42159236198) **SUCCESS**、実装候補 `ae065f0944673a0c99a1b5e63e94cd75c4f2caa5`、[Artifact #13475898161](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42159236198/artifacts/13475898161) SHA256 `45faf8133b2cccb9b4d8eb8ae7f2bb1d6a567f26d8191a88c9a18a0a008bf1c4`／CRC PASS。38編集可能DCC機能群／32,174三角形、新Collider0。元Runnerの落下→元UIリトライ→KeyD完走は継続。
- R8B CLEANと同じ真カメラの65.25/66.35/68.05秒比較で変更画素4.15%/1.40%/3.22%。しかし新たな大きな灰色の面が目立ち、単調な港・岩盤や読みづらいHUDの本質改善には至らず**ART REJECT**。変更面積を品質得点とみなさない。旧K4CS非衝突ゲート整理（R8B）は保持し、R8Cの岩盤フラクタル変更だけを別の安全コミットで戻す（履歴は削除しない）。
- [R8C非採用監査JSON](../research-evidence/k4ct/K4CT_R8C_REVERT_PLANAR_QUARRY_RAW_ART_REJECT_20261106.json)。品質/美術/DCC/縦スライスの固定方針、正式ART0件・Slope2 DNA0m、HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD不変。次は細かい同種の岩面揺らぎではなく、真カメラから見える港の構造関係・素材・陰影と文字欠字の改善に集中。

## 最新：K4CT R8K 真正DCC水路一体制作→元CHASEでART REJECT・安全復元（2026-11-06）
- [R8K実装 `461682d2`](https://github.com/ryomashibaba/dopagaki-development-hub/commit/461682d284a22aab693e24209e40596956fff8cc) → [真正CI #42187505243](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42187505243) **SUCCESS**。Blender4.0.2編集可45群・32,038三角形。R8Jタービンに採石場高所の取水・導水路（404三角形）、石造基礎・排水路（310三角形）を実DCCで制作。元7 B48／28 B51・Camera/240Hz・新Collider0・元UI落下→リトライ→KeyD完走を保持。海側と完全に水理接続したとの主張は**しない**。
- [R8K Artifact #13488227908](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42187505243/artifacts/13488227908) ZIP SHA256 `0e063216b70a9191cf59ae6d7a041fa615d8b8e055e3ebdab586734bd1e3bd2b`、全27ファイルCRC PASS。新2群のBlender頂点2,142個と元Road6左端129サンプルから独立計算した最短**水平距離52.6873m**（40mは本監査の暫定研究チェックで正式基準ではない）。これは正式3D衝突/人間安全認定ではない。
- 真正元CHASE RAWのR8J比65.25/66.35/68.05秒の画像変更率は**0%／0.156%／3.620%**、68.05秒の画面右部分のみ**12.375%**（**画素差はART得点ではない**）。追加導水路の多くは岩盤に隠れ、太い柱が機械輪郭を遮る。**ART REJECT、R8K非採用**。そのDCC**だけ**を[復元コミット `b4821756`](https://github.com/ryomashibaba/dopagaki-development-hub/commit/b4821756a5d4ec818017b15bf76ec28667584be8)で既往R8J blob `87214f8fc73ceef44947ff6697ef563499636032`へ戻した。R8Kのコード/CI/全証拠は履歴に保持。復元[真正CI #42188639045](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42188639045)も**SUCCESS**。R8Jも依然ART REJECT、R8Eを保守的な画像比較基準に維持。
- **次工程の批判的技術結論**：現在のBlender→実ゲームのDCC契約は実質**XYZ＋RGBの6値／頂点**で、出力JSONに法線・UV・各面の材質ID・Blender BSDFの実データは存在しない。R8Iの空グラデーションは本物だが豊かなBlender材質のゲーム再現ではない。平板/柱/架空水路を増やす反復を止め、**R9A真正DCC法線・UV・材質識別データの隔離受け渡し監査→R9B DCC専用WebGL2素材/光表現→R9C元CHASE3時点比較**を優先。今はR9実装/PBR PASSを**主張しない**。正式ART0件、Slope2 DNA0m、HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。[詳細監査JSON](../research-evidence/k4ct/K4CT_R8K_QUARRY_HYDRAULIC_NATIVE_ART_REJECT_RESTORED_R9_PIPELINE_DECISION_20261106.json)。

## 最新：K4CT R8J 真正Blender 3D潮汐タービン主役構造と元CHASEの直接評価（TECH PASS／ART REJECT）
- [真正実装 `995a8f1e`](https://github.com/ryomashibaba/dopagaki-development-hub/commit/995a8f1edee081950a3e5a00f8d192e94cdcbb99) → [CI #42184711612](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42184711612) **SUCCESS**。従来の角張ったR8D鉱石昇降機を元Road6 `u=.625`、真B48左岸から**87m外**の位置で、一つの立体的な24分割タービンリング・12枚のピッチ付き銅色ブレード・軸受基礎・海側配管へ真正Blender4.0.2著作。43編集可機能群、31,324三角形（R8I比+544）、Collider追加0、元Gameソース/Camera/B48×7/B51×28/240Hz保持。
- [Artifact #13487216241](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42184711612/artifacts/13487216241) ZIP SHA256 `833ce23c266c359921d5f2eb6b410f3c2b50c61661aef5b4bde343b58e30e0be`／27ファイル全CRC PASS。真正元WebGL2同一CHASE RAWのR8J対R8I画素差分は65.25/66.35/68.05秒で**0.444%／0.699%／6.130%**。画素差は美術品質得点ではない。68.05秒画面右上のタービン輪郭は明確に可視化され、以前の角張った設備との差異はある。しかし独立した巨大車輪にも見え、水との機能的な接続・採石港全体の立体奥行き・実人間のB51先読みは未達／未確認。**TECH PASS／ART REJECT／正式ART0件**で保留し、R8Eを保守的な比較基準に保持。
- 無操作路外落下69.483333秒→元UI `retryRun`→実KeyD2操作→69.941667秒完走、B51-13/14実接触0件、最短距離約3.852m／3.149m（**実衝突や人間操作の立証ではない**）。Slope2 DNA0m、HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。[R8J詳細批判監査](../research-evidence/k4ct/K4CT_R8J_NATIVE_TIDAL_ROTOR_TRUE_CHASE_ART_CRITICAL_20261106.json)。次は孤立した機械増殖を止め、潮汐水路・岩盤・構造基礎のつながりを真正景観として作り、実CHASE三時点と人間の危険可読性で採否判定。

## 最新：K4CT R8I 真正WebGL2の港湾昼光・Blender素材統一研究（TECH PASS／ART REJECT）
- [実装 `a96f701d`](https://github.com/ryomashibaba/dopagaki-development-hub/commit/a96f701d8f7e0ce6bfa536b10d24042ef790ce85)で元Gameの研究用隔離コピーに**本物のWebGL2空グラデーション**を描画。Blenderの43編集可DCC機能群・30,780三角形の素材色と太陽光/潮の湿りを著作。Camera・元B48×7/B51×28・240Hz・追加Collider0は不変。空の変更はPNG後加工ではなく実ゲームフレームの描画。画像上の空サンプル画素がRGB `29,43,49→35,69,94`に変化。
- 初回[CI #42181533989](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42181533989)はGLSL改行エスケープ不備でPRIVATE WebGL2統合時に**FAIL**。隠さず履歴に残す。修正[コミット `baa1de19`](https://github.com/ryomashibaba/dopagaki-development-hub/commit/baa1de195bd9fbd71e802f8e612d890c46f19ed6)後の[真正CI #42181666074](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42181666074)は**SUCCESS**。[Artifact #13485608187](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42181666074/artifacts/13485608187) ZIP SHA256 `1921b26e02726ad49a487680097ff46513907558c0ded6d57ed111f2c8033021`／27ファイルCRC全PASS。
- 元CHASE RAWのR8I対R8E差分65.25/66.35/68.05秒で**26.422%／39.879%／34.014%**。*空と建材の広域色変化を示すだけでART得点ではない*。暗い空と海のコントラストには一定の改善が見えるが、採石港はなお単調・岩盤は平面的・骨組みが密集し、本物の人間の危険先読みは未測定。**TECH PASS／ART REJECT**、R8Eは比較基準として維持。元の無操作69.483333秒落下→`retryRun`→KeyD2回→69.941667秒完走、B51-13/14実接触0件。正式ART0件・Slope2 DNA0m・HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。[詳細R8I監査JSON](../research-evidence/k4ct/K4CT_R8I_REAL_WEBGL2_DAWN_MATERIAL_AND_SKY_CRITICAL_ART_HOLD_20261106.json)。
- **次工程**：空や色を整えるだけで終えず、現物3Dの港湾主役造形と地形/水際の大規模な立体的連結を作り、同じ元CHASE RAWで真の美術品質を比較。Work・課金・原本/PR変更は引き続き許可なし。

## 最新：K4CT R8H 地形主役の真正再制作と批判的判定 — ART REJECT、地形だけ元に戻す
- **R8Hの地形復元後も真正CI PASS**：[復元commit `c666b69f`](https://github.com/ryomashibaba/dopagaki-development-hub/commit/c666b69fd4c0dbaf6dc6059616aa52433c1c8e65)の[CI #42176852702](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42176852702) **SUCCESS**／[Artifact #13484155371](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42176852702/artifacts/13484155371)。復元したDCC Git blob `b0eb484c816dd1576ae6fb054ebf445ef4d013dc` は既往R8Gと一致。R8H実験は非採用で、技術試験成功を美術採用に読み替えない。
- [R8H実制作 `78dde901`](https://github.com/ryomashibaba/dopagaki-development-hub/commit/78dde901ece0833dc8f543d22f1a7a1e25333783) → [真正CI #42175841618](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42175841618) **SUCCESS**。Blender 4.0.2、編集可能43群、35,822三角形（R8G比+5,042）。R7B物理右岸＋R6物理左岸＋ベース岩盤を一体段丘に再著作。元7 B48/28 B51/Camera/240Hz、Collider追加0、実KeyD→落下→元UIリトライ→完走とB51-14通過を保持（人間未検証）。
- [真正Artifact #13482588834](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42175841618/artifacts/13482588834) ZIP SHA256 `c31c922dc74c0d2bc02223eccb83e2ebacd01ba92cc37203d9b0aa985de8947f`、27ファイル全CRC PASS。元CHASE 65.25/66.35/68.05秒のR8Eとの差分24.459/10.282/17.4%、R8Gとの差分15.189/7.068/14.355%。**画素差は美術得点ではない。**65秒と68秒に巨大な平面ベージュ壁が生じ、海辺の奥行きと既存設備が隠れる。66秒も岩肌が板状。**ART REJECT／R8HはR8G・R8Eより明確に悪化。**
- **研究用の安全な復元**：この引き継ぎ保存コミットで、失敗したR8HのDCCファイル**のみ**を既往CI成功のR8G実装`af32816d`と同じblob `b0eb484c816dd1576ae6fb054ebf445ef4d013dc` に戻す。R8Hコミット、真正CI、Artifact、監査JSONは履歴に保持。R8GもART REJECTのままで、ART比較正本はR8E。**正式ART0件、Slope2 DNA0m、HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。**[R8H原カメラ3世代批判監査JSON](../research-evidence/k4ct/K4CT_R8H_TRUE_CHASE_CONTINUOUS_GEOLOGY_CRITICAL_ART_REJECT_AND_ROLLBACK_20261106.json)。次の改善は微細な段丘・棒・壁の反復ではなく、採石港全体の大きな彫刻的な造形・岸壁の奥行き・光の一体性と危険先読みへ移行。

## 最新：K4CT R8G 本物の元CHASEで三代直接比較・ART REJECT（2026-11-06）
- [実装 `af32816d`](https://github.com/ryomashibaba/dopagaki-development-hub/commit/af32816da3b1b60f1cf72a62a34379a56df5e0c1) → [真正CI #42173555667](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42173555667) **SUCCESS**。Blender4.0.2可編集43機能群、30,780三角形（R8F比**-1,542**）。R5→R6で画面を密集させていた1,536三角形の反復架構を288三角形の単一導水路に再著作。Road6の反復屋根も折れ屋根一枚に変更、元B48×7/B51×28、原Camera/240Hz・追加Collider0は不変。
- [Artifact #13482009730](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42173555667/artifacts/13482009730)、ZIP SHA256 `a950bd87ac0e42c5dfaf959938ac0b95250aedb999e72982bf9b42f325efd9f3`、27ファイル全CRC PASS。元ゲーム画面の同一タイミング65.25/66.35/68.05秒で、R8E基準との差分は7.479%/2.633%/8.038%、直前R8Fとの差分は1.116%/1.784%/3.455%（元ゲーム表示領域の画素変化率、ART得点ではない）。**66秒左側の架構は整理されたが、68秒の折れ屋根が大きな平板に見え、美術品質の改善は確立しない。ART REJECT。**
- 元ゲームの無操作69.483333秒落下→同じChromiumの元`retryRun`→実KeyD2回→69.941667秒finished、B51-13/14実接触0件／最短3.8517m・3.1487m。真正TECH PASSでも人間の危険認識や実衝突挙動は証明されていない。R8Eを保守的な画像比較基準として維持し、R8F/R8Gは研究候補のまま。正式ART0／Slope2 DNA0m／HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。 [詳細監査JSON](../research-evidence/k4ct/K4CT_R8G_R8F_R8E_TRUE_CHASE_3WAY_CRITICAL_ART_REJECT_20261106.json)。次は棒・屋根・微細材質の追加繰り返しから離れ、元CHASEの左側主役構図、採石場と水門/水面の光・形態、警告の人間可読性を一体で再設計する。

## 最新：K4CT R8F 真正Blender港湾建築＋素材統合研究（TECH PASS／ART REJECT、非採用）
- [実装 `7c5b288c`](https://github.com/ryomashibaba/dopagaki-development-hub/commit/7c5b288c897169c5b04aa61ed73008f52ea40441) → [真正CI #42168058983](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42168058983) **SUCCESS**。Blender4.0.2可編集43機能群、32,322三角形、新Collider0。重複した不透明なR7Bタービン発電棟を、水面へ実構造が降りる開放型タービンホールに変更し、素材別の連続した石材/金属/潮湿りと光の陰影をBlender側で著作。物理道路の材質色、元B51・Camera・240Hzは変更していない。
- [Artifact #13480311774](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42168058983/artifacts/13480311774) ZIP SHA256 `ea28fc2e2f1d71863fc1ff51cc44ed034d0f8e249e7ad9d748a6bce2366196b7`、全CRC正常。真正元CHASEのR8EとR8Fを同一時刻で比較すると、画面主要領域の差分は65.25秒 **3.76%**、66.35秒 **0.399%**、68.05秒 **4.224%**。*画素差は美術得点ではない*。65秒に開放感は出たが梁・屋根が乱雑に重なり、68秒は主役建物のシルエットが弱まった。**R8FがR8Eより良いと判断する証拠が不足。R8Eを比較基準として保持し、R8Fの正式採用・昇格はしない。**
- 元Chromium/240Hz/7 B48/28 B51と真の失敗→元UI`retryRun`→KeyD2回→69.941667秒finishedを保持、B51実接触0件。TECH PASSでも**ART REJECT／正式ART0件／Slope2 DNA0m／HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD**。[詳細の監査JSON](../research-evidence/k4ct/K4CT_R8F_OPEN_TURBINE_CAMPUS_MATERIAL_TRIAL_ART_REJECT_20261106.json)。次は反復する梁や微細材質ノイズを積み重ねず、元CHASE画面で強い主役シルエットと港湾の意味的な一体感を再設計する。

## 最新：K4CT R8D→R8E 一体制作の直接評価（2026-11-06）
- **R8D** [実装 `74d4cbb5`](https://github.com/ryomashibaba/dopagaki-development-hub/commit/74d4cbb5ecd027267c2622829478dfb9c4fbb86f) → [真正CI #42161000893](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42161000893) SUCCESS。Blender4.0.2可編集43機能群／32,106三角形。物理左岸（元CHASE画面右）の岩盤開口・搬送トラスを制作し、日本語フォント欠字の研究CI環境原因を`fonts-noto-cjk`で改善。ただし65.25秒の巨大黒い前景は変わらず、68.05秒の昇降機が大きすぎた。**ART REJECT**。
- **原因再照合**：元の65.25秒カメラへ真正DCC頂点を再投影すると、前景を塞ぐ主構造は地形ではなく旧`34_R7C_CHASE_VISIBLE_POWER_INTAKE`の不透明箱型設備。近似カメラ投影のため厳密な画素別ID認証とは別扱い。画面差分で修正効果を追加照合。
- **R8E** [実装 `da82df67`](https://github.com/ryomashibaba/dopagaki-development-hub/commit/da82df67c4c6d54ea30087286352403484a8613b) → [真正CI #42161985638](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42161985638) SUCCESS。43編集可能機能群／32,058三角形。箱型取水口を外部荷重支持の開放型設備へ再著作、Road6の過大な昇降機を縮小・後退。65.25秒の画面右前景はR8B基準で23.97%画素変化、黒い箱状遮蔽が減った。66.35秒0.27%、68.05秒20.49%。これは**画素変更率であり美術合格率ではない**。港湾の材質、地形の自然さ、左側の重複施設、危険の人間先読みは未達／未検証。
- **実ゲーム保持**：真正Chromium／元WebGL2／原Camera／240Hz、B48×7、B51×28、Collider追加0。無操作で69.483333秒に路外落下→元`retryRun`→出発位置差0m→真正KeyD 2操作で69.941667秒にfinished。B51-13/14実接触0件、最短間隔3.852m/3.149m。人間の結果ではない。
- [R8D証拠Artifact #13476892976](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42161000893/artifacts/13476892976) ZIP SHA256 `20e5e0d0cc67536edf2fa052167d489f4f0a13ed7e1d48d3e339da55afcba7b8`／[R8E証拠Artifact #13476808930](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42161985638/artifacts/13476808930) ZIP SHA256 `b8aea22a09017cc61917dc2dcefc01c0bd8057ef431d30e49a2e0e9027fa7c82`、共にCRC PASS。詳細[R8D/R8E批判監査JSON](../research-evidence/k4ct/K4CT_R8D_R8E_GENUINE_CAMERA_ARCHITECTURE_CRITICAL_ART_HOLD_20261106.json)。**現在はTECH PASS／ART REJECT、正式採用0件、Slope2 DNA 0m、HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。**
- **次の主課題**：同一B51-13→14追走区間で、岩ノイズや箱の量産ではなく、港湾の主役構造・素材/光/陰影・地形/水門/道路の意味ある統合を本物の元CHASE RAWで評価。R8Eでも世界水準のART認定は不可。原本、main、P101、PR #46、正式QAを保護し、Work・課金・公開・mergeは個別承認制。

## K4CT R8B：旧K4CS非衝突ゲートの出所確定・元CHASE清掃（ART HOLD）
- 最新の真正実行HEAD `421d5ebb326f12bcf05d07168fd50f5c90cf0202`、[CI #42158287850](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42158287850) **SUCCESS**。真正Blender 4.0.2／38機能群／31,226三角形、元WebGL2/Camera/240Hz、B48×7/B51×28、新Collider0、元UI落下リトライ→KeyDで69.941667秒finished再現。HUMANではない。
- 3時点×BASE/K4CS/CLEANの本物のRAW比較で黄・シアンの大きな柱は**非衝突旧K4CS `k4csMarkerMesh`**由来だと直接確定。旧柱のみ研究用で表示しない候補にすると65.25秒の変更1.61%、66.35秒7.57%、68.05秒0.07%。旧B51本体/現物危険と予告HUDは残る。消えた柱による実人間危険先読みの公平性は未検証。
- [R8B恒久機械監査](../research-evidence/k4ct/K4CT_R8B_K4CS_SOURCE_TRUE_CHASE_GATE_CLEANUP_ART_HOLD_20261106.json)／[Actions Artifact #13475981155](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42158287850/artifacts/13475981155) ZIP SHA256 `f3df8d1c10c064be867a977f36b9d718b9fe118e1faae6a1b508a33aa977c19e`・CRC PASS。**TECH PASS／ART REJECT**。次は新しい模型量産でなく、清掃後の真正視界で見える地形・港をDCCで彫刻的に再構成する。公式ART採用0、Slope2 DNA 0m、HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。

## K4CT R6 新しい真正結論（R5以前の固定方針は不変）
- 真正修正後CI [#42122293541](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42122293541) completed/SUCCESS、実行HEAD `114805aa8a73e6fc707589df0148ba53a2a37bbf`。初回[#42121628304](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42121628304)はFAIL履歴維持。真正Blender4.0.2、25編集可能機能群／27,254面、元WebGL2・元Camera・元240Hz・Road5/B51原本保護・追加Collider0。元KeyD×2で69.941667s finished、元UIリトライ0m状態差から再完走。人間ではない。
- 実RAW9枚の元CHASE3時点・描画条件A/B：**LEGACY対NO_A13は各0画素、NO_A13対R6は38/54/70画素のみ**。巨大黄/シアンのレイヤー主犯確定に失敗。主因不明のまま旧建築追加を正当化せず、認識可能な港湾絵・視線・危険を先に解決。**ART REJECT、正式ART採用0件／Slope2 DNA 0m、HUMAN/SAT/CCD/FPS/RELEASE/MERGE HOLD**。
- [R6恒久機械可読監査](../research-evidence/k4ct/K4CT_R6_NATIVE_DCC_SOURCE_CHASE_NEGATIVE_ART_AUDIT_20261106.json)／[新RAW/BLEND/全トレースArtifact #13460032580](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42122293541/artifacts/13460032580)。ZIP SHA256 `37bfeee872a51b3358708ef574427aa50494fa0d006009dfcc2749162e503972`、CRC全PASS。これがR5記録より新しい証拠で、R5以前を撤回するものではない。

## 0. 引き継ぐ文書と情報の優先順位

- Repository: https://github.com/ryomashibaba/dopagaki-development-hub
- **現行研究枝**: research/k4ct-two-native-b51-choice-consequence-20261105 （分岐し直さない。mainを触らない）。
- **入口**: ../START_HERE.md
- **本書**: DOPAGAKI_COMPLETE_CRITICAL_HANDOFF_AFTER_K4CT_R5_20261106_JA.md （現行判断と次の実開発）。
- **全K4CT R2〜R5実績・旧の批判的評価**: DOPAGAKI_COMPLETE_CRITICAL_HANDOFF_AFTER_K4CT_R2_20261105_JA.md
- **R1〜R19、W/B/G4E、K4B〜K4CPの全上位方針**: DOPAGAKI_COMPLETE_HANDOFF_K4CP_CRITICAL_REVIEW_20261105_JA.md。ここに含まれるK4CM/K4CN/K4CO/K4CPおよび古い個別工程文書は履歴資料として正しく維持。
- **長大な過去の入口全文、削除せず保管**: archive/START_HERE_SNAPSHOT_K4CT_R2_20261105.md。
- **第一級の実証**: 実コミットとCI/Artifactsの結果、独立JSON、偽装していない元ゲームRAWと真正編集可.blend。要約文書より実測が優先。
- **R5判定JSON**: ../research-evidence/k4ct/K4CT_R5_TIDAL_LOCK_DCC_AND_NATIVE_GAME_ART_REJECT.json。
- **R4判定JSON**: ../research-evidence/k4ct/K4CT_R4_REAL_NATIVE_FAILURE_RETRY_FINISH_ART_HOLD.json。
- 旧の成功/失敗/閾値は書き換えない。矛盾があれば正本の作成日とGitHub生実測で判定。全巨大ドキュメントを毎バッチ繰り返し読んでトークンを消耗しない。重要方針・最新の証拠・差分のみ再取得。

## 1. 絶対に変えないゲーム目標と4本柱

目的は**有料インディー級の、実際に遊んで面白い超高速3Dブラウザレーシング／サバイバルゲーム**。Render Showcaseでも技術デモでもない。

- **QUALITY-FIRST**: 単なる動作成功や数値改善を「完成」にしない。
- **ART-FIRST**: 実ゲーム画面が高品質でない限り正式採用しない。Blenderを作ること自体が美術の合格を意味しない。
- **DCC-FIRST**: 真正編集可能3Dで地形・道路・建築・水際の一体世界を作り、直接実ゲームのカメラで評価する。単純な平面・模型・色変更の量産は禁止。
- **INTEGRATED VERTICAL SLICE**: 同じ1場面の世界観・地形・コース・実障害物・速度と操作・視認性・ARTを一つの作品単位で改善する。別々の小QAや置物を増やして満足しない。

既存DNA: 加速するエネルギーボール、左右操舵、自然ジャンプと着地、真の高低差・旋回・狭路・隙間・分岐と再合流、危険/安全の判断、近接回避の緊張と爽快感、巨大な空間スケール。歴史的Gold資産としてB48の7区間／約7.28km、元240Hz物理、既存B51-C実移動障害物28基、元球径・Camera・操作・スコア・UI等を継承。Slope2 DNAを約40%に組み込むのは**長期目標**、正式認定は今も0m。既存Goldや当時の自動完走記録を現在のR5正式ゲーム合格と混同しない。

## 2. 絶対保護／承認が必要な境界

**保護対象**: main、公式P101ブランチ、Draft PR #46、正式QA、Gold/Freeze、原作Slope、元Game/Road5全7区間・Road6・B48/B51・Camera/CHASE・240Hz物理、現行操作/ジャンプ/衝突/スコア/UI、旧凍結素材・元景観、Pagesと本番2サイト。

- 本番の書換え、main push、公式P101やPR #46変更・merge、正式QAの再定義、元SOURCE/Camera/240Hz物理への改変、正式ART/Slope2 DNA採用、公開・release、Work/Computer Use開始、追加有料API/追加課金は**全て個別事前承認**。前チャットでの研究編集許可はこれらへの拡大許可ではない。
- **現在の承認済み範囲**は、独立したK4CT研究ブランチと隔離PRIVATEのゲーム/Blender研究コピーの中での作者実装、非衝突描画候補、検証、失敗修正、研究コミットと記録。既存dirty checkoutやPRIVATE情報は保護。
- 元Road5は凍結原本。別名・別SHAの明示的なPRIVATE研究コピーでの新コース候補制作は過去方針の範囲で可能だが、元Road5の同一性や正式採用を主張せず、本工程は**既存K4CR研究Road5の同一場面を継続**する。次バッチで不必要な物理改造はしない。
- 真の元ゲーム・動体障害物・衝突・Cameraを隠す／代理に置換してTESTやARTを合格させない。元B51の危険なボリュームを見かけ上の安全な空間と偽らない。
- 誤検知や失敗runはFAILとして保持。元の安全ゲートの緩和・暗黙の新Collider追加・原本ハッシュ汚染があればHOLD/STOP。
- TECH、ART、実Chromium/WebGL2、元240Hz・接触、HUMAN、SAT/CCD、Windows/GPU FPS、正式採用・公開・mergeは**別々のゲート**。

## 3. 真に達成済みの事実（撤回なし）

### R1〜K4CP・研究美術の歴史
- 凍結原本のSHA、研究隔離、真正Blender/Chromium/Actions/Artifacts、可編集3Dの外部保存、静止CHASE/描画の差分検査、ZIP CRCなどの安全研究パイプラインは資産。
- K4CM〜K4CPで岩盤・港・高架・水際・自然地形などを試作したが、**元GAMEの視界で意味が伝わらずART REJECTを繰り返した**。K4COの画面道路侵食（1482px）修正等のTECH成功は有益だがART合格ではない。
- 失敗の主因は、路面・コース・カメラをそのままにして、背景を大きくして直せると考えたこと。目立つ部分が単調な道路/模型/装飾ゲートのままでは工数効率が悪い。

### K4CR〜K4CTのゲーム実走行前進
- K4CR: 凍結原本に触れず、別識別子の研究Road5にS字・起伏・バンクを作成し、元28 B51を引き継いだ。研究Road5 SHA256: 4957a0e1ffb1a394c4bbaa2c502caad3fdec219c9713073f5236d7bbb6ab4e2b。これは原本Road5を変更したのではない。
- K4CS: 元B48弧長と動体B51予測に基づく早期警告・真正KeyA/KeyDの差を研究。ETAは安全保証ではない。
- K4CT R2: 同時の実B51-13/14と63.70〜64.05秒の元KeyA/Dで位置差14.27156m。しかしその時点の「通過・回避」は未証明であった。過去の値をR5の新規成果として再計上しない。
- K4CT R3: 真正Chromium/元Runner/元240Hzにて4種のKeyD自動操作がRoad6/B51-14設置地点の先へ到達。2回の短押し試行は69.941667秒で実finished。**人間ではない**。
- K4CT R4: 同じ元Runner・同じ本物のChromiumページ内で、無操作は69.483333秒に**路外落下**でfailed→元UI retryRun→位置差0mの同一選択開始→KeyD 65.25–65.36秒＋65.79–65.91秒→69.941667秒にfinished。B51-13/14の接触イベント0件、最短表面距離3.851688/3.148671m。**B51との衝突死は実証していない**。無操作は落下で失敗した。実動体の接触や被弾が証明されたような古い言い回しは訂正。
- K4CT R5: 2026-11-06の真正Blender4.0.2、編集可能BLEND、**19機能群・23,592三角形**。Road5/6基準の岩盤切削、4連潮汐水門、ポンプ棟、海上の連絡橋、港湾水面と岸壁、タワーを非衝突の一体施設として元WebGL2研究COPYに統合。元道路・Camera・240Hz・28 B51・元Gameハッシュ保護。**R4の落下→元UIリトライ→実KeyD完走のパリティを維持**。人間プレイではない。
- 研究CODE実測commit: bcdc6c4cd88dd321c50bca9a73f86bf5d32e8725、CI: https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42112944511 **completed/SUCCESS**、Artifact #13454208718、報告SHA256 573e59ddec0f88f397d43459213858ad26936992c68bb8cbbb04109c4f3ae5b0、CRC PASS、2026-11-12期限。R5の最初の2回 #42110848613/#42111324074 はBlender変数名衝突/未定義により**FAIL記録**。続く #42111817107 と最終 #42112944511 は**SUCCESS**。失敗を消したことにしない。
- 保存作業直前に確認した研究HEAD 173a8011be9bad7a0c886082a464ad2c613e2883。main d402801f271f43163ad85d9303abe9773d3958bd、公式P101 19d3a32d525c0c2a67082cba646898fab8f2b60f、PR #46 Open/Draft・未merge。**本書保存コミットで研究HEADは変わるため、次回は取得し直す**。
- 凍結元GameのGit blob af076d67492a677d2235e4730aef8cdf4808e106。研究Road5 SHAは上記の独立値。SHAが異なる種類（Git blob SHA1と研究路面SHA256）を混同しない。

## 4. R5実画面からの批判的評価：何が根本的に足りないか

本物の65.25秒／66.35秒／68.05秒のRAW Game Screenshotを評価すると以下を見逃せない。

1. **シーンが一本の世界として読めない**。潮汐港湾という設計意図はプログラム上あるが、実カメラでは水門/ポンプ棟が背景の小さな断片となり、波・港・道路・危険の因果が瞬時には分からない。
2. **前景に反復する極端な黄/シアンの背高フレーム**が残る。旧P97描画を研究コピーで抑えても残存。実元Gameの別描画コードには、a13ArchMeshを含む非衝突の機械メガ構造と実B51の描画がある。**残る全フレームの出所はまだ未確定**。非衝突A13建築などのA/B隔離が必要。物理B51を消して「きれい」と偽ってはいけない。
3. **単調な岩壁と材質**。真正メッシュ数を増やしても、照明/素材/形の主従/陰影/切削跡/海面と構造の接合がゲーム画面で足りない。実画面の芸術的水準はまだ明確に低い。
4. **ゲームUIが視界の大きな部分を覆い、日本語フォントが欠字**。画面上端に複数の英語危険情報、下部に練習メッセージと警告が競合。見通しと初見の操作判断を損なう。旧正式UIを無断変更せず、研究コピー内で本当に必要な情報を整理する。
5. **操作の難しさが人間にとって未知**。65.25–65.36秒と65.79–65.91秒の正確な自動入力は人間の反応・視認を証明しない。速度179.5〜190.7m/s級の実RAW場面で危険の先読み時間が十分かは未確認。

**判定：R5 TECH PASS／ART REJECT、正式ART採用0件、Slope2 DNA正式認定0m、HUMAN・SAT・CCD・Windows FPS・RELEASE・MERGEすべてHOLD。** 技術用の元GLと非衝突アートの成功は作品の完成ではない。

## 5. 計画の反証と修正（強い批判を先に検討）

- **「ART-FIRSTだからさらに背景を作ればよい」→反対。** K4CM〜R5まで背景追加だけではART不合格。次に必要なのは実カメラで主役が見える位置/体積/明暗の再構図であり、小物・ポリゴン増ではない。
- **「元カメラを変えれば簡単」→禁止。** 真正Cameraは凍結。研究だけなら別Cameraの検討は可能でも、同じ元ゲームの合格と偽らない。まず元CHASEのもとで改善する。
- **「黄/シアンを全て消すと解決」→不正確。** 非衝突装飾の責任を特定して抑制するのは正当だが、実B51の真の危険シルエットを消したり縮小して判定を欺くのは不可。画面の安全な見通しと現物ハザードを両立する。
- **「R5はCI成功、正式採用可」→反対。** ART、HUMAN、性能、正式QAはいずれも未認証。今回のCODE成功は制作基盤の再現性だけ。
- **「先に実人間を呼んで試してもらう」→時期尚早。** 欠字と視認性を残したままでは体験の可否を評価しづらい。自動でできるRAW観察・QAを終えてから、節目の1クリック試走1回にまとめる。人間でしか判定できないことはHOLD。
- **「全7区間へ拡大して完成に近づく」→反対。** 1区間がART/HUMANとして成立していない間の複製は負債の増加。B51-13→14場面の代表的な完成度を先に上げる。
- **「また少数のCI/文書を積めば」→反対。** 既存ワークフロー/テスト/原本監査を再利用。記録は単一最新正本＋短い機械JSON。文書作業や小QAだけを1工程としない。
- **「現在の計画が完璧か」→証明不能。** 固定の安全・品質・承認境界は厳格維持。経験的に反証された制作手法のみ変更し、成果が改善しなければ仮説を再評価する。

## 6. 次チャットで最優先の1つの制作バッチ：K4CT R6（研究仮称）

**唯一の作品目標：同じB51-13→14の高速度実CHASEで、進路・本物の危険・港湾の主役構造が短時間で読める、一体化された迫力ある3D世界を制作し、原物理成功/失敗ループを維持する。**
単なる「装飾ゲートをOFFにする」だけで終了しない。同じバッチで本格的な構図とDCCを実制作する。

1. **再開監査を短く**：研究HEADと本書/START_HERE、Actions #42112944511、PR #46、main/公式P101/原本SHAを確認。過去のR4/R5成功パリティを再利用。古いK4CT R2の「未通過」に逆行しない。不要なユーザー確認をしない。
2. **真RAWを設計条件に**：元GAMEの65.25／66.35／68.05秒の同一CHASEと、道路位置・速度・元B51の可視体積を基準に、最も重要な1枚の見通しと前/中/出口の連続性を設計。非衝突描画レイヤーの識別用に研究コピーのみでA/Bを行う。**a13ArchMesh、a13RoadArtMesh、他の案内描画、元B51をIDごとに分けて記録**。消してよいものは非衝突装飾のみ。元B51の体積は絶対保持。出所未確認の構造物は憶測で断定しない。
3. **大規模な一体DCC再著作**：もとのR5編集可能Blenderを捨てず、Road5/6の実座標、岩盤の切削断面、海の潮位、水門の力学的意味、発電棟・大型昇降塔、実導線を一つのシルエットに再構成する。巨大な色違いの積み木や非視認水面を増やさない。地層/滝/開口/桟橋の負空間、光と影の階層、遠景の霞、材質/スケールを実CHASEで調整する。追走視界の道と危険を邪魔しない。
4. **UIの致命的視認性を研究候補で整理**：原本を変えず、欠字/重複HUD/実操作を妨げるオーバーレイを修正。注意情報を減らす場合、実B51の警告機能や安全に関する表示の意味を勝手に偽らず、変更前/後でどの情報が消えたか記録する。UIだけの改善でART PASSとしない。
5. **一括で本物の検証**：真正Blender編集可能BLEND→隔離WebGL2→原Camera/240Hzの実KeyD走行と実リトライ→独立検証→前/中/出口3 RAW比較→ART判定。旧の成功数値を最新変更後に勝手に流用しない。元Game/Road5/28B51保持・新Collider0・実Runnerのfailed/finished・min-gap・元UI retryRunを必要な粒度で再検証。仕事を工程番号やPR数で分割しない。
6. **制作と判断を同じ単位で終える**：明確な見通し・地形/港湾の関係・素材が実際に改善したかを生画像で批評。TECH成功でも模型ならART REJECT。続けて同じアート原因が出たら小物微修正や新CI追加を止めて、**主役の位置と構図そのもの**の仮説を改める。合格しない理由を正直に保存。
7. **GitHub研究枝へコミットと短い証拠**：安全なHEAD leaseで保存、旧失敗とART REJECTを削除しない。README/START_HEREはコンパクトに保つ。次のチャットへユーザーのログ手貼り・ZIP添付・何度もの再質問を要求しない。

**ART評価の具体的な観点**: プレイヤーが最初の一瞥で道路の連続方向、元B51危険、港湾施設の主役/場所の意味を読み取れるか／「道路に色付きゲートが並ぶ模型」から脱したか／本物の走行と危険な間隔に対して見通しがあるか／前/中/出口で空間体験が変化するか／目立つポリゴンと本当に必要な危険を混同していないか。単一の数値に根拠のない新「正式PASS閾値」を作らない。

## 7. 進める順序と停止条件

- **短期R6**: A/Bレイヤーの出所検証→元CHASE主役構図→真DCC→旧HUDの読みにくさの限定改善→真Chromium/RUNNER→3 RAW直接評価→研究保存。1つの大きなバッチ。
- **その次**: ARTとして客観的に改善した候補に対して、元ゲームでの初見の危険先読み/操作許容幅を研究計測。正確にプログラムされた0.11秒の入力を人間の成功へ読み替えない。
- **節目の人間試走**: 上記を満たす候補があるときだけ、ワンショット起動手段・短い所感1回をまとめる。HUMANはそれまではHOLD。Windows本機FPS/SAT/CCDは未検証の範囲を独立HOLD。ユーザーの承認前にWorkや実機アクセスを開始しない。
- **正式昇格**: ART、人間、物理・性能の該当ゲート、ユーザーの個別承認が揃うまで0件のまま。公開やPR mergeはしない。
- **STOP**: 原SOURCE/公式PR/mainに予期しない差分、元物理/Cameraの偽装、アートだけでHUMAN PASS、未実証をSUCCESS化、証拠消失、同じ原因の模型量産があれば、実際の理由を示し研究候補を安全にHOLDする。

## 8. 工数/費用/ユーザーの操作を最小化する運用

- Chat内のGitHub操作と資料調査を優先。追加課金原則0円。Work/Computer Useは**個別事前承認制**。できない実Windows操作は不可能と明記する。
- 「続けて」1回ごとに1小QAではなく、一体DCC作品修正・真正検証・必要な再修正・GitHub保存を安全な範囲で**まとめて**行う。途中の小修正をユーザー承認待ちにしない。
- GitHub HEAD/CI/PRの動的照合を唯一の最新情報にする。スクリーンショット/BLEND/JSON/元実験を使い回すが変更後の合格を偽造しない。GitHub Artifact期限に注意し、元スクリプトから再現可能に保つ。期限前の必要な原本保管は自動側で行い、ユーザーに手作業を強制しない。
- 無意味な「小さなQA増殖・比較用模型量産・長文START追記・巨大ZIP再取得・古い数値の再計測」を原則禁止。資源は見えるシーン改善に使う。
- GitHub永続正本は**本書＋START_HERE＋短い最新監査JSON**。歴史は既存文書へのリンクで残し、最新の判断と古い履歴が混ざらないようにする。
- 1報告に必要なのは: 作った本物のゲーム/Blender変更、確認できた実測、RAWでのART批評、HUMAN/公式HOLD、保護境界、HEAD/CI/Artifact、ユーザー操作回数だけ。
- 「私の作業原則0回」は設計条件。最終的な人間評価だけは代行不能なので、十分に候補ができた時点で1回に集約する。判断に十分な根拠がない箇所は明確に「わからない」と記載する。

## 9. 次チャットに貼るだけのワンショット指示

> DOPAGAKI SLOPE — HYPER RUSH の継続開発を再開してください。新規企画でも正式方針変更でもありません。GitHub https://github.com/ryomashibaba/dopagaki-development-hub の研究ブランチ research/k4ct-two-native-b51-choice-consequence-20261105 にある START_HERE.md と docs/DOPAGAKI_COMPLETE_CRITICAL_HANDOFF_AFTER_K4CT_R5_20261106_JA.md を全文読み、そこからリンクする旧統合正本・R1〜R5の全成功/失敗・反省・保護方針を継承してください。実最新HEAD、Actions、Artifacts、main、公式P101、PR #46をまず照合してください。R5の真正Blender/WebGL2/240Hzは CI #42112944511 SUCCESS、落下→元UIリトライ→KeyD 2回で実finishedまでTECH実証済みですが、ART REJECT、正式ART0件・Slope2 DNA 0m、HUMAN/SAT/CCD/FPS/RELEASE/MERGEはHOLDです。B51に接触したという偽実績を作らないでください。次は旧の細かいQAや単調模型を量産せず、**同じB51-13→14の元CHASE画面で残る装飾ゲート・読めないHUDの原因を非衝突描画レイヤー別に特定し、真のB51と原Camera/240Hzを維持したまま、高品質な港湾崖・水門・高架・路面の一体構図を真正DCCで再著作して、実WebGL2走行の前中後RAW画像で直接ARTを評価するK4CT R6の大きな統合制作バッチ**へ進めてください。少数集中し、安全な研究作者実装・真Blender/Chromium検証・独立QA・GitHub保存まで私の操作原則0回でできる限り完了してください。main、凍結元Game/Road5/Camera/240Hz、Gold、正式QA、原作Slope、本番、公式P101、Draft PR #46を絶対保護。Work/Computer Use、有料API、公式採用、公開、mergeは個別事前承認。TECH/ART/HUMANを混同せず、わからない点はHOLD。これまでの全固定方針はぶらさないでください。

**最終方針**: 「もっと動く」「もっと多い」から「この一画面を本当に走りたくなるか」へ評価軸を変える。ただし安全・品質・原本・承認条件は不変。実測で作品効果を否定された手法のみを修正する。
