# DOPAGAKI SLOPE — HYPER RUSH / 現行研究・START HERE（2026-11-06 K4CT R5後）

**現行唯一の案内正本**：[DOPAGAKI全計画・批判的評価と新チャット完全統合引き継ぎ](docs/DOPAGAKI_COMPLETE_CRITICAL_HANDOFF_AFTER_K4CT_R2_20261105_JA.md) をまず全文読む。過去の全記録は[旧START_HEREの原文アーカイブ](docs/archive/START_HERE_SNAPSHOT_K4CT_R2_20261105.md)に**省略・上書きなし**で保存。これは歴史や固定方針の撤回ではなく索引の短縮である。

## K4CT R5：真正「潮汐水門・岩盤切削港湾」の一体制作／ART REJECT（2026-11-06 JST）
- **実制作検証HEAD** `bcdc6c4cd88dd321c50bca9a73f86bf5d32e8725`、[真正Blender＋Chromium CI #42112944511](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42112944511) **completed/SUCCESS**。[Artifact #13454208718](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42112944511/artifacts/13454208718)（2026-11-12期限）、ZIP SHA256 `573e59ddec0f88f397d43459213858ad26936992c68bb8cbbb04109c4f3ae5b0`、ZIP CRC PASS。失敗CI #42110848613/#42111324074は元のままFAIL、原因はBlenderスクリプト内の名前衝突とカメラの未定義変数、研究枝の修正後に成功。
- **同じ真正R4物理のままDCC一体世界を新規構成**：編集可能Blender4.0.2、19機能群・23,592三角形。源流Road5/6と実B51-13/14を基準に、起伏・切削崖、4連潮汐水門、発電ポンプ棟、巨大昇降塔、海上連絡橋、荷役桟橋、段状の港湾水面・岸壁を意味のある1つの施設として著作し、隔離PRIVATE WebGL2へ非衝突で取り込んだ。新Collider0、元Game Blob `af076d67...`、研究Road5 SHA `4957a0e1...`、元Camera・240Hz物理・元28 B51・公式PR・main・本番を保護。
- **走行R4パリティ保持：** 真正Chromiumの元Runner 240Hz／Playwright実KeyD 65.25–65.36s＋65.79–65.91s → B51-14地点を実通過、69.941667s `finished`、元B51-13/14のmoving-contact 0・最短表面距離3.852m/3.149m。無操作側は69.483333sに実落下 `failed` → 元`retryRun` → 同一選択開始位置差0mで再挑戦に成功。人間操作は未試験。
- **美術の直接評価：ART REJECTを維持。** 元追走Cameraの63–68秒画面では見通しや素材の改善余地が大きい。巨大で単調な斜面・低密度の港湾建築、黄/シアンの反復形状、強すぎる巨大実B51の前景、欠字のままのUIが残る。旧P97非衝突ゲートと蛍光フロー線の描画を研究コピー内で抑えても黄/シアンの大フレームは残存し、原因の一部は別レイヤーである。ソースの実B51や危険計算を消して偽のART PASSを作らない。**正式ART採用0件／Slope2 DNA認定0m／HUMAN・SAT・CCD・FPS・RELEASE・MERGE全HOLD**。三角形数/CI成功は世界水準の美術・人間プレイの合格ではない。
- **次の最優先、旧工程へ逆行禁止：** 自動での2障害物の回避・失敗・再挑戦・完走は実証済みなので物理テストの量産を停止。真の追走画面を構図基準にして、視界を妨げる元描画レイヤーの出所を特定し、実B51を読みやすく保ったまま、1つの絵として認識できる港湾断面／建築シルエット／光と材料をDCCで再著作する。3視点のRAWを批評し、TECHとART/HUMAN/正式採用を別扱いにする。追加課金・Work・公開・mergeは個別承認、今回のユーザー操作0回。
- [R5恒久の最小実証JSON](research-evidence/k4ct/K4CT_R5_TIDAL_LOCK_DCC_AND_NATIVE_GAME_ART_REJECT.json)。過去R4・R3・R2と全上位方針は以下に撤回せず保存。

## K4CT R4の実証履歴：K4CT R4（2026-11-06 JST）
- **真正R4研究CI**：[Actions #42053864244](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42053864244) **SUCCESS**。実行HEAD `80e922493d262107db6e2832f5aacbf0ec53cde5`。Artifact [#13426704665](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42053864244/artifacts/13426704665)（2026-11-12期限）、GitHub報告digest `sha256:9838caba31ee9374531996340d3057a29a0690446fde30bddcb4012349774ad6`。ZIP全CRC検証済み。
- **初めて、同じ真正Chromiumの元ゲーム・同じ出発物理状態（63.70秒位置差0m）で**、無操作は元Runnerが69.483333秒に「コースから落下」`failed` → 元UIの`retryRun`でゼロから再走 → Playwright真正KeyDを65.25–65.36秒と65.79–65.91秒の2回のみ押す → 元Runnerが69.941667秒に`finished`、Road6のB51-14地点を通過、B51-13/14との接触イベント0、最小OBB表面距離それぞれ3.852m / 3.149m。**スクリプト入力であり人間ではない**。失敗CI #42050817518 と #42052034384 はFAILのまま履歴保存。
- Blender 4.0.2で本当に編集可能な**11機能群／14,232三角形**を生成して、元のB48 7本・B51 28体・240Hz物理・Cameraを変更せず、隔離PRIVATEゲームへ非衝突統合。旧蛍光色の路面光学表示は研究コピーの描画でのみ抑え、元形状に一致するDCC表面に置換。元原本Blob `af076d67…`、研究Road5 SHA256 `4957a0e1…`は不変。
- **真のRAWゲーム画像を直接評価：ART REJECT継続**。蛍光帯の過剰は軽減した一方、港湾建築はなお模型的、海岸の巨大平面、強い色の遮蔽物、欠字、見通しの悪さが残る。**正式ART0件・Slope2 DNA 0m・HUMAN/SAT/CCD/FPS/RELEASE/MERGEすべてHOLD**。TECH PASS≠世界水準の作品完成。
- **次の唯一の優先工程：** 実B51-13/14の選択・失敗・再挑戦の物理的因果は研究実証済み。旧「接触まで試す」を繰り返さず、同じ実ゲームカメラで速度183m/s時にも危険を前方から読める、本格的に統合された港湾崖・潮汐水門・高架・路面の**DCC全面構図再著作と真正RAW映像評価**へ重点を移す。操作許容幅の人間妥当性とWindows FPSは別の節目で検証し、現時点で合格扱いしない。
- [R4恒久証拠](research-evidence/k4ct/K4CT_R4_REAL_NATIVE_FAILURE_RETRY_FINISH_ART_HOLD.json) ／過去のR3実績と上位方針は下に履歴として保存。保護対象への変更・Work・課金・本番公開・正式採用・mergeは個別承認制。今回のユーザー操作0回。

## K4CT R3過去実証（2026-11-05、R4の以前の成功・撤回なし）
- 真正研究コードHEAD `0727c52b27759d06d8b2e5336ede15b8bbc2a525`。実証 [Actions #42048634777](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42048634777) **completed/SUCCESS**。[Artifact #13425699087](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42048634777/artifacts/13425699087)、SHA256 `8fdbe45ccd775c913ef2c2f838bc4c2230b77f0188a7f766ee44c8b160435abc`、全ZIP CRC PASS（現時点の独立ダウンロード検査）。
- 既存R2の63.70→64.05秒・A/D位置差14.27mは**過去の実証**。新実測R3は同じ元Game／真正WebGL2／240Hz原Runner／原Camera／K4CR研究Road5／元28 B51を継承し、B51-13→B51-14の連続区間を実物理で通過させた。人間操作ではなく**Playwright真正KeyD自動操作**。
- R3の4つの実KeyD短時間入力（65.15–65.30、65.48–65.66、65.82–66.00、65.25–65.36＋65.79–65.91）は**全てRoad6へ接地しB51-14設置地点+20mを実走行**。原B51-13/14の実moving-contactは4件とも0、失敗0。B51-14実OBB表面最短距離順に6.891m／5.609m／5.681m／3.149m。2回入力の試行は元Runner.status=`finished`、実時間69.941667s、他の3試行は70.500s時点`running`。これは**研究コピーの自動操作技術実証**であり、正式な人間完走認定ではない。
- 直前の [Actions #42046550320](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42046550320) SUCCESSでは真正Blender4.0.2編集可・9機能群／9,336三角形の非衝突DCCを同じK4CT実WebGL2場面に接続。4つのA/D/中立試行は全て路外落下、元UIの失敗→再挑戦（左失敗→右試行）が実測された。**本R3では短い追加入力だけでRoad6復帰が成立**。過去FAIL runはFAIL履歴として保全。
- 実Game RAW画像を直接評価し**ART REJECT**。巨大単調岸壁、模型的港、構図の弱さ、原HUD CJK欠字と警告の重なりが残る。真正DCCを作ったことと高品質な世界・人間にとって面白いことは別。**正式ART採用0件／Slope2 DNA認定0m／HUMAN・SAT・CCD・FPS・RELEASE・MERGE全HOLD**。本番・main・公式P101・PR#46・凍結Game/Camera/Physics/Road5・Gold・元Slopeは不変。
- 詳細値と将来の照合には [K4CT R3恒久研究判定](research-evidence/k4ct/K4CT_R3_TWO_NATIVE_B51_ROAD6_PHYSICAL_RESCUE_VERDICT.json) を使う。GitHub Artifactには元の240Hz全ステップ・本物のRAW画像・編集可能BLEND（有効期限あり）がある。

## 現在位置
- 現行研究枝：`research/k4ct-two-native-b51-choice-consequence-20261105`。検証コードHEAD `22f29ab42740bf6ba363ce78237cbab928ae8251`。**本索引・引継ぎコミット後はHEADが変化するため、毎回GitHubの実最新を確認すること**。
- [K4CT R2・真正240Hz Actions](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42038776523)：**completed/SUCCESS**。[Artifact #13420511782](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42038776523/artifacts/13420511782)。元28 B51のうち次の2体を本物の原Game WebGL2で同時提示。63.70→64.05sの実KeyA/D自動入力で球位置差14.27156m、A/Dともrunning、衝突までの回避成功は未証明。
- **正式ART採用0件／正式Slope2 DNA認定0m／HUMAN・SAT・CCD・FPS・RELEASE・MERGE全HOLD**。本物の実画像ART評価はREJECT。Blender/ゲーム自動テストTECH成功を人間の面白さ・作品完成と混同しない。
- main `d402801f271f43163ad85d9303abe9773d3958bd`／公式P101 `19d3a32d525c0c2a67082cba646898fab8f2b60f`／Draft PR #46 Open/Draft/未mergedは本書作成前の照合値であり今後再確認。元Game Blob SHA1 `af076d67492a677d2235e4730aef8cdf4808e106`。
- 本番2サイト、原作Slope、Gold、Freeze、元Game/Road5/Camera/240Hz物理、正式QA、main、公式P101、PR#46を保護。Work/Computer Use、追加課金、原本変更、本番公開、正式採用・mergeには個別事前承認。研究枝での安全制作・検証・GitHub保存は自律可。ユーザーの通常操作0回。

## 次の一つの制作目的（K4CT R3実測を受けて更新）
**R3で通過可能性と失敗／本物のリトライは原ゲームで実証した。次は「65秒台の0.15秒程度の右操作を人間が画面を見て選べるか」と「同じ真正走行場面が世界水準の美術を持つか」を一体で解く。** 元の物理を弱めず、単純なタイミングテストの量産も旧Blender模型の微修正も止める。次の縦スライスは、リアルな大型港湾構造・水際・地形の意味が原CHASEから読み取れる本格DCCの再構成と、見通し・操作可能時間・カメラを含む少数の実ゲーム観測を統合する。人間の楽しさは本人の実操作を得るまでHOLD、正式ART採用なし。

## 一次資料
- [今後の全方針・反省と唯一の新チャット引継ぎ](docs/DOPAGAKI_COMPLETE_CRITICAL_HANDOFF_AFTER_K4CT_R2_20261105_JA.md)
- [上位のK4CP批判的完全引継ぎ](docs/DOPAGAKI_COMPLETE_HANDOFF_K4CP_CRITICAL_REVIEW_20261105_JA.md)
- [K4CT R2 実B51二件・A/D物理結果・R1失敗](docs/DOPAGAKI_K4CT_R2_TWO_REAL_B51_NATIVE_CHOICE_CONSEQUENCE_20261105_JA.md)
- [K4CS R3 早期予告・真KeyA/D・Blender](docs/DOPAGAKI_K4CS_R3_REAL_B48_B51_EARLY_HUD_MANUAL_CONTROLS_TRUE_EVIDENCE_20261105_JA.md)
- [K4CR R2 物理Road5/Blender・28 B51](docs/DOPAGAKI_K4CR_R2_ACTUAL_PHYSICAL_ROAD5_6B51_REAL_GAME_PASS_ART_REJECT_20261105_JA.md)
- [旧START_HERE全文・全履歴原文](docs/archive/START_HERE_SNAPSHOT_K4CT_R2_20261105.md)

**禁止：** 古い「最新」で逆行、研究成功を正式採用に昇格、代替物理/カメラで本物と偽る、PlaywrightをHUMANと偽る、失敗runを後からPASS化、ユーザーに何度も「続けて」や手動ログ添付を要求する。
