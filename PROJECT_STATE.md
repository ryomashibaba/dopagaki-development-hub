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

## 2026-10-24 JST 最終確認済み基準（**現在値とは限らない**）

| 項目 | 最後に確認した値 |
| --- | --- |
| Draft PR | #46：OPEN / Draft / 未マージ |
| ブランチ | `p101-velocity-overdrive-native-trial` |
| HEAD | GitHubの現行ブランチHEADを実際に取得（固定値を参照しない） |
| 確認済み工程 | G4E-7AK第1〜3ゲートの正規240Hz接触・実WebGL・真B48三角形×B51-C実OBB遮蔽・早い右入力の落下原因はCI PASS。7AJ全7道路2/2非人間自動完走を維持。**G4E-7AL：非公開手動A/D 2候補比較、実Runner240Hz記録・ゲームオーバーJSON保存・Windowsワンクリック起動を開発ブランチへ実装。専用Chromium CIの最終判定は未確定（実行待ち）。** 人間実試走・美術・正式認定HOLD。 |
| 次の計画 | **G4E-7AL検証待ち**：新設専用Actions [#40024578982](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40024578982) の最新ステータスとログを実際に確認。CIの失敗は修正し再実行、成功しても「実Chromiumでの自動A/D」＝「人間の手動QA合格」としない。実機の2道路比較JSON・感想が得られた後、判明した視認／操舵不公平を改善する別の本物の3D道路・動体候補を検討。Workは事前承認、公開/mergeは不可。 |
| Slope2 DNA正式認定 | 0m |
| 美術・人間品質・公開 | HOLD |
| 凍結比較基準 | G4E-7AA `landing-soft α=.70` |


**G4E-7AK第1/2ゲート CI**：[固定A/D実240Hz #39968223375](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/39968223375) SUCCESS（artifact 12507972133）。[reanchor実Chromium WebGL10画面 #39969621809](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/39969621809) SUCCESS（artifact 12509130409、public/public-safe研究用JSON非混入PASS）。人間の視認・操作/美術/正式採択/公開はHOLD。

**G4E-7ALコード実装済み・CI実行待ち**：[非公開手動A/D 2候補＋ローカルJSON #40024578982](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40024578982) は作業時点ではQUEUED。GitHub上の最新結果を再取得するまでPASSと報告しない。人間QAは実ユーザー試走証拠なしでHOLD。

**G4E-7AK第3ゲート CI**：[実B48/B51-C遮蔽・接地喪失 #39976900377](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/39976900377) SUCCESS。画面サイズ換算は近似であり人間の反応猶予は未認定。記録は最新監査を参照。

7AAは、本物の欠損B48セルによる走行因果性と全7道路240Hz自動完走（56.2292秒）を記録。ただし美術・人間プレイは未認定。7ABでは0.15〜0.60mの進入微調整候補が全て7道路完走に失敗し、視界改善も実証できなかった。**7AC R2で実ジャンプ維持の大型カーブが全編240Hz完走。その後7AHで細道＋S字まで実B48化し、7AIで同じ元の走行カメラを使うWebGLと視線遮蔽の検査が成功。ただし人間の遊びやすさと見た目は未認定。**

- [G4E-7AL 真11m細道×実B51-C手動QAとローカルJSON・CI判定待ち](docs/W9C2_G4E7AL_LOCAL_MANUAL_QA_HOLD_JA.md)
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
