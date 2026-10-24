# DOPAGAKI SLOPE — 新チャット継続入口（固定URL）

> **このファイルが引き継ぎの入口です。毎日、長文プロンプトを作り直す必要はありません。**
> 最新状態は *この文章の記載日* ではなく、GitHubの現行HEAD・コミット・最新監査・CIを照合して確定してください。

## 最初にすること（次のチャットに渡す指令）

あなたは新規制作者ではなく、既存 **DOPAGAKI SLOPE — HYPER RUSH** の継続開発担当です。

1. `ryomashibaba/dopagaki-development-hub` の `p101-velocity-overdrive-native-trial` 最新HEADを実際に取得する。
2. [Draft PR #46](https://github.com/ryomashibaba/dopagaki-development-hub/pull/46) のOPEN/Draft/未マージ状態を取得し、変わっていたら無断で進めず差分を確認する。
3. 最新コミット、`docs/` 内の最近変更された工程監査、関連するスクリプトとCIを読む。**このファイルの「確認済み基準」より新しい事実を優先**する。
4. 直前工程の合否・独立候補・公開隔離・人間QA保留を維持し、次の意味あるゲーム体験改善へ進む。単なる監査・HUD・0.1m単位の反復は最優先にしない。
5. 変更はこの開発ブランチと既存Draft PR #46内に限定し、**main / Gold / 旧候補 / 両本番サイト / 原作Slope再現を不変更**とする。PRのReady化・merge・正式採択・公開は明示承認までHOLD。
6. 作業後は新HEAD・結果・CI・技術/人間/美術/公開の別々の判断・次工程を簡潔に報告する。**毎日新しい完全引き継ぎ文書を書かない。**

この指令と以下の恒久憲章は、個別チャットの過去の途中状態より優先されます。追加の最新ユーザー指示はもちろん最優先です。

## 恒久憲章（要約）

- **目標**：人間が実際に遊んで面白い、有料インディー級の巨大SF都市を疾走する3Dブラウザゲーム。単純な箱・直方体・反復門・広い平坦路・しょぼい障害物を量産しない。
- **操作**：A/D・左右矢印の左右操舵。常時微加速、坂で自然速度変化、空中慣性、OVERDRIVE/HYPERを維持。ジャンプボタン・ブーストボタン・磁力吸着・速度リセット・中央固定安全帯は禁止。
- **物理**：実B48コライダー（240Hz、ボール半径0.65m）、主要7道路、B51-C実動体28基を保存。見た目だけのギャップ、ゴースト床、強制ジャンプ不可。P96の自動操舵は**試験専用で人間のプレイを証明しない**。
- **カメラ**：ボール相対固定＋小揺れを基本。過追随や速度に応じた自動引き禁止。坂→平地への復帰遅延を改善対象として残す。
- **難易度**：旧v5より少し遊びやすく、高速でも危険を先読みでき、ライン取り・回避に意味があること。
- **A13**：全7.28kmの約40%（目標2.912km）をSlope2 DNA（真の10〜16m級細道・破断・自然飛行・急降下・曲率・再接地・障害物）へ。**試験距離を正式距離に算入しない。**
- **美術**：NEON GRID / MEGACITY / PRISM RUSH / VOID BREAKER。大質量・曲面・非対称・立体交差・人工断崖・都市内部の走路を、実カメラの視認性と統合する。
- **スコア**：生存時間95%以上・補助5%以内。
- **BGM**：174BPM DNB×Trance、約2秒導入・5秒以内の6音フック・ボーカル無し。ただし最優先はコースの面白さ。
- **人間QA**：自動CI、物理7/7、実WebGL、実機手動の証拠を別扱い。ゲームオーバー画面からローカルJSON保存。無断アップロードしない。
- **運用**：Chat＋GitHub優先。Workは明確に有利な場合のみ事前承認。ユーザーのZIP解凍・CMD・認証反復を最小化。小〜中規模の意味ある差分と適切なテスト。

## 直近差分：G4E-7AP 本物の障害物ライン選択・反発対策独立研究（2026-10-24 JST）

G4E-7AJ基準を一切上書きせず、実B51-C #01/#02の2基だけを再設計したAP候補。01は実横断slider、02は実push回転体。真11m級B48、7道路、ギャップcell52、他26動体、正規240Hzエンジンを維持。独立private JSONとlocalhost `?g4e7al=manual&g4e7ap=duel` 専用手動2コース比較へ接続。技術Node/Chromium/公開隔離検証は直近CIを必ず確認（コード追加＝PASSとは限らない）。手動の楽しさ/視認/反発解消未認定、正式Slope2 DNA=0m、公開/Gold/本番=HOLD。詳細：[G4E-7AP監査](docs/W9C2_G4E7AP_REAL_TEMPORAL_SLALOM_PRIVATE_HOLD_JA.md)。単なるマーカーの量産ではなく、試走した回避ラインと物理接触を比較して次を決める。

## 直近差分：G4E-7AO実障害物の早期認識研究（2026-10-24 JST）

**最新の新工程はG4E-7AO（AO）です。下の長いG4E-7AN美術履歴は過去の基準で、AOの次工程を上書きしません。** 開発ブランチ・Draft PR #46・主物理の保護条件は冒頭の憲章どおり。

- 7AJ `reanchor` の真11m B48先頭道路で、実B51-C動体01（u=.32）／02（u=.80）の**実道路中心線の弧長を逆算**し、手前150m／95m／45mの警告地点に、**路肩の13.5m外側**の非衝突V字型3Dマーカーを生成。`?g4e7al=manual&g4e7ao=on` のloopback明示時だけ表示。標準7AL・景観AM/AN・本番は不変。架空の安全レーン／強制誘導／早期衝突／幽霊床は作らない。
- **専用CI [#40068323822](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40068323822) 全ステップSUCCESS**：実弧長の独立720分割再測定、元ステージbyte同一、240Hz実Chromium A/D／手動QAの回帰、public/public-safeの研究ステージ非混入を確認。実Chrome3画面は[artifact #12550317586](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40068323822/artifacts/12550317586)を取得して目視済み。旧画面にはないV字警告がAO両コースでは路肩外に映る。
- 実際には警告は比較的小さく、既存HUDにも距離／残秒数の通知がある。**人間の回避・高速200m/s以上の認識余裕・面白さ・正式美術品質は未確認/HOLD**。技術PASSは本番採択ではない。元の28機／7道路／球・速度・操舵・カメラ・スコア・Goldは不変更。正式A13 Slope2 DNA=0m。
- 正式監査：[G4E-7AO 真B48/B51の距離算出警告・技術CI PASS・人間HOLD](docs/W9C2_G4E7AO_B51_TRUE_ARC_PREWARNING_PRIVATE_HOLD_JA.md)。**次はユーザーの実試走ログまたは厳密な認識猶予の根拠**を優先し、単なる新装飾やHUD量産でゲーム品質の不合格を隠さない。運用はChat＋GitHub、Workは事前承認、PR Ready/merge・本番公開禁止。

## 2026-10-24 JST 最終確認済み基準（**現在値とは限らない**）

| 項目 | 最後に確認した値 |
| --- | --- |
| Draft PR | #46：OPEN / Draft / 未マージ |
| ブランチ | `p101-velocity-overdrive-native-trial` |
| HEAD | GitHubの現行ブランチHEADを実際に取得（固定値を参照しない） |
| 確認済み工程 | G4E-7AK第1〜3ゲートの正規240Hz接触・実WebGL・真B48三角形×B51-C実OBB遮蔽・早い右入力の落下原因はCI PASS。7AJ全7道路2/2非人間自動完走を維持。**G4E-7AL：非公開手動A/D 2候補比較、実Runner240Hz記録・ゲームオーバーJSON保存・Windowsワンクリック起動を実装。順序強制、Rリトライ履歴最大12件、2走完了後の再開禁止、未走行の次候補移行禁止を反映。補助B51距離計測のみ毎ステップ240Hzから20Hzへ削減し、正規CCD/実接触イベントは240Hzを維持。初回Chromium CI #40026339519の手動入力区別漏れを修正し、G4E-7AL再試験 #40026772361 が SUCCESS（Node・private・Chromium・public/public-safe隔離すべてPASS）。さらにG4E-7AM巨大都市外殻／2連続する非対称都市大陸のGPU専用景観候補を実装。実WebGL・旧景観比較3画像 Actions #40028777111 は全SUCCESS。GitHub artifact #12534985530の実画像を審査し、R1は巨大な左右の壁に見え美術HOLD。G4E-7AM R2では左右外殻を222m/255m以上道路から離し、実メッシュ空穴246区画／大きな空スロット176区画とした。2コース目のPNGがスクロールによりキャンバス外を撮った問題を是正し、WebGLキャンバス自体を直接撮る方式へ。R2 CI #40037992309は全SUCCESS・WebGLキャンバス3枚を確認（artifact #12537044928）。2コース目の黒画像/スクロール不備は解消。ただし両コースの実画面で右に巨大な平面壁、左は空白が多く、**R2景観は美術未達・REJECT/HOLD**。次工程で**G4E-7AN SKY ARCHIPELAGO**の独立4巨大造形（裂けた巨大中空冠・双尖ねじれた都市・3層空中都市棚・分岐高空巨大構造）を実コードで制作。7AJ真B48の左右と前後の異なる位置に置き、旧壁景観は重ねない。Node/Chromium/2コース実WebGLの初回 [#40039374208](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40039374208) は技術全PASS（artifact #12539380888）だが、実画像では黒い空と一部の斜材しか見えず美術REJECT。正面向き中空冠＋遠近再配置R2 [#40049868810](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40049868810) も技術全PASS（artifact #12542808485、開始／走行後の実5画面）だが右の巨大な暗い平面壁が再発し美術REJECT/HOLD。4構造を独立描画するlocalhost WebGL診断 [#40050280820](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40050280820) は技術全PASS（artifact #12543187621）。巨大壁の原因は主に閉鎖した `citadel` の多角面と特定。R3で大部分を開放格子へ変え、冠／棚／分岐構造の視点内高さも調整。[R3 #40050904186](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40050904186) はNode/Chromium/公開隔離全SUCCESS（実画像artifact #12543641160）。**R3では右側大壁は減り路面視認性が改善したが、都市としての完成度はまだ未達で美術HOLD。**** 人間実試走・美術・正式認定HOLD。 |
| 次の計画 | **G4E-7AL技術ゲートPASS→G4E-7AM実景観研究中**：[#40026772361](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40026772361) 全ステップSUCCESS。非公開GPU候補G4E-7AM《UPTURNED CITY》R1 [#40028777111](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40028777111) 全PASS（**美術は壁状のためHOLD**）。R2景観のマクロスロット＋離隔修正の [Actions #40037992309](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40037992309) はNode/実Chromium/公開隔離すべてSUCCESS。実画像3枚は右の長い壁と左の空白で美術REJECT/HOLD。**G4E-7ANのR1/R2とも実Node/Chromium/公開隔離CIは全PASSだが、美術はREJECT/HOLD**。R1では建築が画角にほぼ入らず、R2では右の巨大壁が再発。 [#40050280820](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40050280820) の単体4画像でcitadel閉鎖面を原因特定。修正版 [R3 #40050904186](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40050904186) も技術全PASS・右の大壁は改善。ただし美術はHOLD。**次は実A/D操作・先読み・真の細道と障害物の質を重視**し、格子塔の単純な追加や数値微調整は最優先にしない。単純な小刻み位置調整、建築数だけの量産、物理やカメラの勝手な改造は行わない。CI合格と美術合格は別。美術・人間QA・正式採用・公開はHOLD。CIの失敗は修正し再実行、成功しても「実Chromiumでの自動A/D」＝「人間の手動QA合格」としない。実機の2道路比較JSON・感想が得られた後、判明した視認／操舵不公平を改善する別の本物の3D道路・動体候補を検討。Workは事前承認、公開/mergeは不可。 |
| Slope2 DNA正式認定 | 0m |
| 美術・人間品質・公開 | HOLD |
| 凍結比較基準 | G4E-7AA `landing-soft α=.70` |


**G4E-7AK第1/2ゲート CI**：[固定A/D実240Hz #39968223375](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/39968223375) SUCCESS（artifact 12507972133）。[reanchor実Chromium WebGL10画面 #39969621809](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/39969621809) SUCCESS（artifact 12509130409、public/public-safe研究用JSON非混入PASS）。人間の視認・操作/美術/正式採択/公開はHOLD。

**G4E-7AL 最終技術PASS**：[修正版 #40026772361](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40026772361) のNode/native・実Chromium操作/ゲームオーバー直接JSON保存・public/public-safe隔離は全SUCCESS。**新G4E-7AM R1 CI**：[#40028777111](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40028777111) はSUCCESS、ただし実画像から壁状と評価し美術HOLD。**R2技術成功・美術REJECT/HOLD**：[#40037992309](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40037992309) 全SUCCESS、実WebGLスクリーンショット artifact #12537044928 を目視。次は多層奥行き建築へ転換。人間QAは実ユーザー試走証拠なしでHOLD。

**G4E-7AK第3ゲート CI**：[実B48/B51-C遮蔽・接地喪失 #39976900377](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/39976900377) SUCCESS。画面サイズ換算は近似であり人間の反応猶予は未認定。記録は最新監査を参照。

7AAは、本物の欠損B48セルによる走行因果性と全7道路240Hz自動完走（56.2292秒）を記録。ただし美術・人間プレイは未認定。7ABでは0.15〜0.60mの進入微調整候補が全て7道路完走に失敗し、視界改善も実証できなかった。**7AC R2で実ジャンプ維持の大型カーブが全編240Hz完走。その後7AHで細道＋S字まで実B48化し、7AIで同じ元の走行カメラを使うWebGLと視線遮蔽の検査が成功。ただし人間の遊びやすさと見た目は未認定。**

- [G4E-7AN SKY ARCHIPELAGO R1〜R3実Chromium全PASS・R3右大壁改善・美術/人間QA HOLD](docs/W9C2_G4E7AN_SKY_ARCHIPELAGO_PRIVATE_ART_HOLD_JA.md)
- [G4E-7AM UPTURNED CITY R1/R2 実WebGL技術PASS・右壁/左空白の美術REJECT/HOLD](docs/W9C2_G4E7AM_UPTURNED_CITY_PRIVATE_ART_HOLD_JA.md)
- [G4E-7AL 真11m細道×実B51-C手動QA・リトライ履歴＋ローカルJSON・技術CI PASS](docs/W9C2_G4E7AL_LOCAL_MANUAL_QA_HOLD_JA.md)
- [G4E-7AK 第3ゲート 実B48三角形×B51-C動体遮蔽・早い右入力の無支持落下／人間HOLD](docs/W9C2_G4E7AK_G3_PHYSICAL_VISIBILITY_FALL_HOLD_JA.md)
- [G4E-7AK 第1/2ゲート 実240Hz固定A/D 10条件＋実Chromium WebGL10枚・人間/HOLD](docs/W9C2_G4E7AK_B51_FIXED_KEYS_NATIVE_GATE1_HOLD_JA.md)
- [G4E-7AJ 真のB51-C2/28基再配置・実240Hz全7道路完走・人間HOLD](docs/W9C2_G4E7AJ_REAL_B51_LANE_REANCHOR_HOLD_JA.md)
- [G4E-7AI 実11m細道WebGL15枚・正規240Hz視線遮蔽・公開隔離PASS](docs/W9C2_G4E7AI_TRUE_NARROW_B48_WEBGL_HOLD_JA.md)
- [G4E-7AH 真のB48細道2案・実240Hz全編7/7・非人間HOLD](docs/W9C2_G4E7AH_TRUE_B48_NARROW_PLAYABILITY_HOLD_JA.md)
- [G4E-7AG OPEN CITADEL 実WebGL/実遮蔽PASS・美術REJECT/HOLD](docs/W9C2_G4E7AG_OPEN_CITADEL_WEBGL_HOLD_JA.md)
- [G4E-7AF FRACTURE CITADEL 8画像検証・美術REJECT](docs/W9C2_G4E7AF_FRACTURE_CITADEL_WEBGL_HOLD_JA.md)
- [G4E-7AE SPLIT HORIZON 旧景観置換・実物理視界研究](docs/W9C2_G4E7AE_SPLIT_HORIZON_WEBGL_HOLD_JA.md)
- [G4E-7AD実視界研究とHOLD](docs/W9C2_G4E7AD_TRUE_NATIVE_WEBGL_ART_HOLD_JA.md)
- [G4E-7AC真の物理実験](docs/W9C2_G4E7AC_MACRO_PHYSICAL_PILOT_HOLD_JA.md)
- [G4E-7AB最終REJECT原本](docs/W9C2_G4E7AB_SUBMETER_TRUE_B48_FULLRUN_REJECT_JA.md)
- [G4E-7AA比較基準](docs/W9C2_G4E7AA_TRUE_B48_CONTOUR_NATIVE_HOLD_JA.md)
- [G4E-7W真のギャップ基礎](docs/W9C2_G4E7W_GROUNDED_REAL_15M_GAP_HOLD_JA.md)
- [旧G4E-7O実機QA](docs/W9C2_G4E7O_TRUE_B48_HUMAN_QA_HOLD_JA.md)
- [公開チャネル方針](docs/RELEASE_CHANNEL_POLICY_JA.md)

## 引き継ぎ自動化（GitHub上で完結）

- `scripts/generate-handoff.mjs` は**読み取り専用**。現在のGit HEAD、直近コミット、最近更新された `docs/*.md`、工程監査の内容をGitから抽出して、Markdownを標準出力へ出します。外部AI・外部サービス・APIトークン・個人情報は不要。
- `.github/workflows/handoff-snapshot.yml` はこの開発ブランチへのpushで軽量実行。生成物を**Actions artifactだけに保存**し、コミットやデプロイはしません。手動実行も可能です。過去のartifactは期限切れになり得るため、必要なら常にGitHub HEADから再生成できます。
- この固定URLを毎回新チャットへ渡せば十分です。**生成されたスナップショットは補助資料**であり、その時点のPR状態、ユーザー承認、人間QAを自動認定しません。
- 最新のdocsが古い、Git HEADと一致しない、PRの状態が違う場合は、最近のコードとCIを直接読む。新規追加資料の欠落を「存在しない」と断定しないこと。

**コピペは1行だけ：**「https://github.com/ryomashibaba/dopagaki-development-hub/blob/p101-velocity-overdrive-native-trial/PROJECT_STATE.mdを開き、GitHubの最新HEADとPR #46、最近の工程監査を照合してDOPAGAKIの次工程を進めて。正式公開・mergeは禁止。」

## 保護するURL

- [正式DOPAGAKI本番](https://dopagaki-slope.sora-110029.chatgpt.site/) — 無承認変更禁止
- [原作Slope再現](https://slope-neon-ryoma.sora-110029.chatgpt.site/) — **絶対変更禁止**
- [Draft PR #46](https://github.com/ryomashibaba/dopagaki-development-hub/pull/46)
