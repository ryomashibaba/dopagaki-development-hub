# 【2026-11-05 K4CH：源流・Camera不変の一体的な沿岸岩壁＋渡船ターミナル再設計／真正Blender未判定】

**現行研究正本ブランチ**：`research/k4ch-basalt-copper-harbor-art-20261105`。最初に[**K4CHの本格的な可視全画面アート作者制作／試験・前回環境失敗・永久保護の全記録**](docs/R19_A6P4_R2F5K4CH_NATIVE_BASALT_COPPER_ART_JA.md)を読む。下段「K4CG最新」は過去の履歴。

- **出発根拠**：K4CG R2真Blender [#41942878730](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41942878730) はTECH PASS／直接ART REJECT。親真正.blend `5a2215677fd41c420bac3b44b78b65b0e42aa74b79399498a87a57b7b85946f1`。前作は左の白い砂丘のような斜面・右の模型的屋根・広い灰色道路が根本未解決。小さな岬・樹・小物・AIノイズの量産をせず、**画面の支配的な左右空間を本物の編集可能3Dで同時に作家再設計する**。
- **実装済みGitHubコード** `scripts/p101-k4ch-native-coherent-harbor-basalt-copper-art.py`：左のK4CG実海岸斜面2研究メッシュを元ジオメトリ保存で研究複製し、割れのある灰青色石材・実ポリゴン角面・非円錐形の地質段差へ変更。右の既存研究屋根を新しい銅色の湾曲ターミナル屋根へ研究3D再成形。既存研究支柱の本物の位置と断面を単一木質構造体に統合。港海面・外洋を同じ海色にし、突起しか見えない沖合岬は低く広い真地形へ変更。元Game・元Road5・原Camera・木11・ライト・物理は不変、Collider追加0。**WebGL2実ゲームはまだ改造しない**。
- 専用真正Blender Workflow `.github/workflows/p101-k4ch-native-basalt-copper-harbor-art.yml`：固定K4CG R2親原本全SHA・元Game Git blob `af076d67492a677d2235e4730aef8cdf4808e106`・元Road5全vertex/face SHA `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`・元6 Camera/CHASE・木11を独立保持したまま真正Blenderで描画し、**元CHASE画面左岩壁＋右建築に大きな可視変化があり、道路中央不変**であることを別々に独立検査する。TECH判定とART合格を区別。
- **初回[#41950843684](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41950843684)はFAIL**。親SHAや元GameのチェックはPASS、Ubuntu Azure apt配信元からの本物Blender取得が異常に遅く、インストール7分経過でタイムアウト124。**新Blender DCC・真PNGは未生成**。正規のArchiveから実Blender導入を試す[#41951907166](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41951907166)は本引き継ぎ書作成時点で**in_progress**、最終結果とArtifact／直接ARTの有無を最新取得する。Blenderが成功するまでCODE実装だけでTECH PASSを宣言しない。元保護条件・画像QA閾値の緩和は禁止。
- **不変**：正式ART採用 **0件**／Slope2 DNA認定 **0m**、HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。main、公式P101 `p101-velocity-overdrive-native-trial`、Draft PR#46（Open/Draft）、原作Slope/Gold/元Game、原道路／物理／Camera、本番2サイト保護。追加有料API原則0円、Work/Computer Use個別事前承認、ユーザー操作0。

---

# 【2026-11-05 K4CG最終：全画面の真3D沿岸景観を制作→Blender→独立QA→直接ART REJECT→GitHub保存】

**現在の隔離研究正本** `research/k4cg-integrated-coastal-worldscape-20261105`。最初に[**K4CG R1/R2真正実制作・独立Zip/SHA・同CHASE全画面ART REJECT・本当に必要な次の大規模作者工程**](docs/R19_A6P4_R2F5K4CG_INTEGRATED_WORLD_ART_JA.md)全文と、[**K4CG R2対K4CF R2の真正同CHASE比較画像**](docs/research-evidence/k4cg/K4CG_VS_K4CF_R2_TRUE_CHASE_INTEGRATED_WORLD_ART_REVIEW.png)、[独立監査JSON](docs/research-evidence/k4cg/K4CG_REAL_NATIVE_AUDIT.json)を確認。下段の「最新」「現行」は当時の履歴であり、K4CG結果より優先しない。

- **真Blender K4CG初回[Actions #41941951080](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41941951080) completed/SUCCESS、TECH PASS／直接ART REJECT**。元K4CF R2編集可能真Blender.blend SHA256 `1a17dc522b4d7df85c92023df5b580f1e5fe155b27264dfcb9d7a511d99d8533`を厳格に読み込み、左岩肌の作者地質・遠景の実岬・外洋の実メッシュを追加。ただし真CHASEでは新岬が右屋根の裏に小さく見えるだけ、左地形は元の白い研究下地が遮蔽し、目に見える改善不足。初回真正Artifact #13376728614はZIP全CRCと.blend/PNGハッシュ独立再検算済。
- **K4CG R2最終[Actions #41942878730](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41942878730) completed/SUCCESS**。初回画像で確認した現実の遮蔽問題から、元のK4BQ研究左地形・K4CD研究海を**原本保持で真編集可能な研究複製**へ置換し、526左地形頂点を実変形、岩材質と港湾海面・外洋を地理的に接続。岬は原Cameraを一切変えず実世界位置を変更。研究DCC5メッシュ、元Game・物理・Road5・6Camera/CHASE・樹11/ライト・港・船の既存ソース不変、新ゲームCollider0。
- **真R2 Artifact [#13377510776](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41942878730/artifacts/13377510776)** ZIP125,032,903B SHA256 `33dd91b49067b2832fded8c9e7f438f836ce36edf516ae8c68e1ff711e4d5cc9`を別途GitHubから原バイトDLし、全CRC／全.blend・PNGの実バイト数・SHA256一致PASS。真編集可能.blend277,556,784B SHA256 `5a2215677fd41c420bac3b44b78b65b0e42aa74b79399498a87a57b7b85946f1`。真CHASE768×480 PNG2画像比較を直接開き評価：左岩肌3,733px・水平線1,785px・右港1,142pxの変化、元道路中心0px変化、しかし広い白い岩斜面、屋根の裏の小さい尖った岬、巨大な灰色の道路・右港の模型感が改善未達で**ART REJECT**。TECH PASSをART合格と混同禁止。中間CI #41942840961はCANCELLEDでTECH PASSではない。
- **次の方針を固定**：新地形オブジェクト／ノイズ／色の小さな修正を増殖する主経路は停止。**左右の可視主要空間・道路肩・岸壁水際・遠景の一貫した物理的構図を研究DCCで作者が根本再設計する一工程**を選ぶ。元Game/物理/Road5/Cameraは動かさず、Blenderで本物の完成図が確認できなければ正式ART採用しない。他6道路展開、本番公開、merge禁止。
- **永久保護**：原Game Git blob `af076d67492a677d2235e4730aef8cdf4808e106`、元Road5全vertex/face SHA `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、原作Slope、main、公式`p101-velocity-overdrive-native-trial`、Draft PR #46、本番2サイト、元6カメラ、原物理、凍結Goldは無変更。**正式ART採用0件／Slope2 DNA認定0m／HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD**。追加有料API0円、Work/Computer Useは個別事前承認、ユーザー操作不要。

---

# 【2026-11-05 K4CF R2最終：本物の二方向Blender ART研究・全CRC/SHA独立PASS・直接ART REJECT】

**この研究ブランチの最優先正本**：`research/k4cf-windward-cliff-hero-frame-20261105`。先に[**K4CF初回失敗→R2実装→真正Blender画像／SHA独立検証→A/B直接ART REJECT→次の統合作家工程の完全記録**](docs/R19_A6P4_R2F5K4CF_TRUE_DCC_HEADLAND_AB_JA.md)を全文読む。下記の「最新」「in_progress」は過去段階の履歴であり、今回の確定判定ではない。

- **初回R1真正[Actions #41939075340](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41939075340)** 全ステップSUCCESS／TECH PASS、直接ARTはA/B両案REJECT。初回の二峰コーン形状と高コントラストの定期的World-Z横縞が岩山に見えず、採用禁止。真Artifact #13375059698・ZIP全CRC/各SHA独立検証完了。
- **R2真正[Actions #41939899891](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41939899891)** **completed/SUCCESS**。K4CE真編集可能親.blend `3f0bc2f048dec39bc263151e2117b374d40b7422478c7e9b49583865c836d63e`を厳格認証し、同じ元CHASE実3D岩肌だけを研究用に複製し再作者制作。ワールド空間で低く幅広い斜面へ彫刻し、縞模様を使わず低コントラスト鉱物変化で表現。A 5728頂点・最大4.937m、B 5728頂点・最大6.033m真地形変形。元Game git blob `af076d67492a677d2235e4730aef8cdf4808e106`／Road5 vertex-face SHA `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、6 Camera/CHASE、木11、灯光、右港、海、船、元ゲームCollider追加0を保証。
- **真Artifact [#13376376036](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41939899891/artifacts/13376376036)** ZIP124,889,472B／SHA256 `afb726787b00813c8298149ef4159da7e779384ba2df47ffe4cc1666f6f80487`、本会話で別途実ZIPダウンロードして全CRC・各.blend/PNGサイズ・SHAを独立検証PASS。R2真編集可能.blend 275,974,128B／SHA256 `1a17dc522b4d7df85c92023df5b580f1e5fe155b27264dfcb9d7a511d99d8533`。[**R2 K4CE対A/B同一真正CHASE直接ART評価画像**](docs/research-evidence/k4cf/K4CF_TRUE_CHASE_BASELINE_VS_TWO_REAL_HEADLAND_DIRECTIONS_ART_REVIEW.png)を直接目視。R1のコーン・横縞は明確に解消したが、R2も丸い砂丘・雪山状で、岩肌の割れ／路側の説得力・港の生活感・遠景速度感は未達。**R2 A/B両案ART REJECT**。TECH PASSと混同しない。
- **次は失敗した崖を微修正し続けたり模型・樹木を量産しない。** 原ROAD5/Cameraは触れず、左断崖・右港・地平線を通した**全画面の統合作者景観**を1つの真正CHASEで研究。画像の美術合格まで他6 Road展開不可。
- **永続制約**：元Slope、main、正式P101 `p101-velocity-overdrive-native-trial`、Draft PR#46、凍結Gold、元ゲームRoad5/物理／Camera、本番2サイトを保護。正式ART採用 **0件**／Slope2 DNA正式認定 **0m**。HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。追加有料API原則0円、Work/Computer Useは個別事前承認、ユーザー操作最小。

---

# 【2026-11-05 K4CF現行：真3D断崖A/B作者実装保存／Blender実Actions #41936765348要判定】

**現行隔離研究枝** `research/k4cf-windward-cliff-hero-frame-20261105`。最初に[**K4CF真正3D断崖A/B・世界景観優先・原Game保護・未完了Actionsと採否ゲート**](docs/R19_A6P4_R2F5K4CF_TRUE_DCC_HEADLAND_AB_JA.md)を読み、[K4CF GitHub Actions #41936765348](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41936765348)の**最新status/conclusion/ジョブログ/Artifacts**を再照合。以下K4CEは終了済の歴史正本であり、K4CF結果を上書きしない。

- 本物のK4CE編集可能親.blend SHA256 `3f0bc2f048dec39bc263151e2117b374d40b7422478c7e9b49583865c836d63e`を厳密に検証し、元K4CCの実左岩肌を**変更せず**別メッシュに複製して、A:暖色の風化積層崖・B:深い陰影の暗い岩盤を**大きく異なるワールド空間の実地形頂点起伏**で作者制作するスクリプト＋真のBlender EEVEE二枚比較CIを実装・GitHub研究保存した。原Road5・6 Camera+CHASE・物理・原作Game・木11・ライト・港／船体等は変更禁止。新Collider 0。
- [K4CF実Actions #41936765348](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41936765348)はこの記録時点で**ソース／実K4CE原本SHA保護の前段PASS、Blender導入中**。**K4CF実レンダリング/ART目視/新.blend/独立ZIP検算/TECH PASSは未確認**。実行完了前に達成と書いてはいけない。失敗していればログの原因を特定して実3D品質改善の範囲内で修正し、安全閾値緩和やフェイク画像の代用をしない。
- 元ゲームGit Blob `af076d67492a677d2235e4730aef8cdf4808e106`、元Road5全vertex-face SHA256 `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`不変。main・公式P101・原Slope・Draft PR#46・本番2サイト不変更。正式ART採用0件／Slope2 DNA認定0m、HUMAN/SAT/CCD/FPS/RELEASE/MERGE HOLD。Work/Computer Useは個別事前承認、追加有料API原則0円、ユーザー操作不要。
- **制作主目的は全画面ARTでありQA件数増ではない**。新真正CHASE画像が存在すれば左岩肌・道路・右港・地平線の画面全体を直接開いて評価し、TECH PASSでもART REJECTなら正式候補にしない。

---

# 【2026-11-05 K4CE最終：真正Blender同CHASE構図改善TECH PASS／画像直接ART REJECT・独立ZIP/SHA完全照合】

**現行研究正本** `research/k4ce-coherent-berth-ferry-foreground-20261105`。真の最終結論は[**K4CE独立レンダリング・失敗/修正・直接ART REJECT・保護・下一工程**](docs/R19_A6P4_R2F5K4CE_BERTH_FERRY_COMPOSITION_ART_HOLD_JA.md)。[K4CD対K4CE本物の同CHASE比較画像](docs/research-evidence/k4ce/K4CE_K4CD_TRUE_SAME_CHASE_FOREGROUND_BERTH_ART_REVIEW_NOT_GAME.png)と[GitHub研究証拠監査JSON](docs/research-evidence/k4ce/K4CE_REAL_NATIVE_AUDIT.json)を開く。以下「K4CE実行中」は当時の履歴。

- **真の最終[Actions #41935099728](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41935099728) completed/SUCCESS、編集可能DCC・真CHASE 768×480二画像・独立QA・研究GitHub証拠保存まで完了**。真K4CD原本 SHA256 `c81111664d4703ec044aeaaeee1e7b659d95343dbf762ebf9892c6636a7d5a0a` を厳格に読み込み、K4CEの船形状を変更せず元フェリー4研究メッシュを係留位置へ一体移動。元研究乗船橋を保護非表示、新たに既存岸壁に実3Dで接続する乗船橋を制作。原SOURCE、元Road5、元6Camera/CHASE、木11本、灯光、岩肌・水面、黒筋を技術保護。新ゲームCollider0。
- **初回[Actions #41934329234](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41934329234)はFAIL**。船が画面内に投影されても港建築にほぼ隠れた（実Blender船あり/なし差262px）。2D投影だけでART可視とみなす失敗を繰り返さず、可視船体の真正レイ検査を54係留候補へ実装して改善。最終 x .7295〜.9383に船を完全表示し、**船＋新橋の真可視差分4,528px**（前K4CD船のみ2,816px）を独立PNGで実測。これはART点数ではない。
- **GitHub真正Artifact [#13374375359](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41935099728/artifacts/13374375359)** ZIP123,802,865B／SHA256 `d8e57ca4af3b3de9c6ceb7830ff85d66a7b0dde8a9c24360cf6eb9d7c8cf989a`。本会話で別途原ZIPを取得、ZIP全CRC／全内ファイルbytes・SHAを独立照合PASS。Blender `.blend` 273,964,752B／SHA256 `3f0bc2f048dec39bc263151e2117b374d40b7422478c7e9b49583865c836d63e`。研究データであり実WebGL2ではない。
- **本物の比較画像を直接目視し全画面ART REJECT**：右港の船は右端切れなく、多少読み取りやすくなったが、船・海・ターミナル全体が依然模型、中心の広い平坦な道路と弱い左斜面／遠景が主な美術未完成。**正式ART採用0件／Slope2 DNA正式認定0m**を維持。HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。今後は微細な船・装飾量産を止め、道路／左地形／右港／水平線の全画面作者品質に集中する。
- main、公式P101 `p101-velocity-overdrive-native-trial`、Draft PR#46、原作Slope、凍結Gold、本番2サイトは完全保護。追加有料API0円、Work/Computer Useは個別事前承認、ユーザーPC操作0。既存Road5やCamera/物理を動かして偽の映えを作ることは禁止。

---

# 【2026-11-05 K4CE最新・実ゲーム保護：真正K4CDフェリー再構図＋岸壁動線研究／ARTゲート別】

**研究最新正本はこのページ先頭。現在の新研究枝**：`research/k4ce-coherent-berth-ferry-foreground-20261105`。
最初に[**K4CE既存成功親・真3D再配置・乗船橋・安全・CI状態**](docs/R19_A6P4_R2F5K4CE_BERTH_FERRY_COMPOSITION_ART_HOLD_JA.md)を読み、[真正K4CE Actions #41934329234](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41934329234)の最新結論／Artifactsを再照合する。**この記録時点ではBlender実作者ステップ中**であり結果未確定。下の「最新」「実行中」は当時の履歴。

- 既存K4CDには研究枝が二つある。**正式先祖は成功済み`research/k4cd-harbor-water-ferry-true-chase-20261105` HEAD `ee911286f133c534eabda3fa1c92c332b891631d`**。親の実[Actions #41926752717](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41926752717) completed/SUCCESS、真DCC.blend 273,958,272B／SHA256 `c81111664d4703ec044aeaaeee1e7b659d95343dbf762ebf9892c6636a7d5a0a`、本物の船あり・水のみCHASEにより船2,816px可視TECH PASS。右端で船が切れてART REJECT。他方の`research/k4cd-real-ferry-waterfront-hero-20261105`は別研究で、結果未確認のまま成功と混同しない。
- **K4CEの真の実装**：既存船を作り直さず、親原本内の編集可能なフェリーの船体・デッキ・旅客室・屋根4メッシュを一体移動し、元CHASE実投影による安全領域（画面x>.505）を守った実世界係留位置だけ採用。研究旧橋はデータを保持して非表示にし、A3真正岸壁スロープ終端と移動後フェリーの甲板を3Dの厚い乗船橋で再接続。水面、元景観、原Road5頂点面、元6Camera/CHASE、樹木11本、照明を固定。専用コードと真正BlenderWorkflowをGitHub研究枝に実装。
- **GitHub Actions #41934329234**はこの段階で親SHA・原Game blob・Road5等の前検査PASS→真正Blender中。成功の認定には編集可能原本、Blenderログ、実同CHASE画像を直接開いたART評価、独立ZIP／全CRC／各SHA・研究GitHub保存が必要。失敗の場合は検証閾値を安易に緩めず、投影・位置・空間接続という実原因に沿って修正。証拠なしにK4CEのTECHやART PASSを宣言しない。
- **厳格ゲート不変**：元Game Blob `af076d67492a677d2235e4730aef8cdf4808e106`、原Road5 vertex-face SHA `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、B48 7実Road／B51 28Mover／240Hz／0.65m球、main・正式P101・Draft PR #46・原Slope・凍結Gold・本番2サイトを保護。**正式ART採用0件／Slope2 DNA0m**、HUMAN/SAT/CCD/FPS/RELEASE/MERGE HOLD。Work/Computer Useは個別事前承認、追加有料API原則0円、ユーザーPC操作0。他6路面の美術展開不可。

---

# 【2026-11-05 K4CD最新：真正Blender船あり/なし2画像・船2,816px実可視TECH PASS／ART REJECT】

**現行隔離研究枝**：`research/k4cd-harbor-water-ferry-true-chase-20261105`。最初に[**K4CD実コード・実Blender・直接画像ART REJECT・独立ZIP/SHA・全保護条件・次工程**](docs/R19_A6P4_R2F5K4CD_REAL_FERRY_VISIBLE_ART_REJECT_JA.md)を読み、[**K4CCとK4CDの真同CHASE比較画像**](docs/research-evidence/k4cd/K4CD_K4CC_VS_TRUE_HARBOR_FERRY_SAME_CHASE_ART_REVIEW_NOT_GAME.png)、[**研究真正監査JSON**](docs/research-evidence/k4cd/K4CD_REAL_NATIVE_AUDIT.json)を直接照合。下の「最新」「実行中」は過去時点の履歴でありこの先頭記録より優先しない。

- **正式[Actions #41926752717](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41926752717) completed/SUCCESS／SOURCE-DCC-RENDER TECH PASSのみ**。元K4CC真正.blendを実ハッシュ `4fcd20db998696c270df95f624fed1a229ae2703322c180de1f3bfbc15abd6da`で固定後、研究DCCだけに1枚の立体海面、船首から船尾までフレームを持つ真の船体、甲板、曲面客室、厚屋根、アクセス橋の6メッシュを制作。Blender4.0.2／EEVEE／本物のCHASE 768×480実レンダー、source SHA・Road5・元6Camera・木11本・光源・左岩肌・黒筋6対・描画不変の検証とGitHub研究証拠commitが全SUCCESS。
- **船の存在確認を投影点数で偽装しない。** 初回 [#41925637297](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41925637297) は実海面の道路視野侵入でFAIL、安全閾値緩和なしで港側に修正。[#41926040646](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41926040646) TECH PASSだが船が実画像でほぼ隠れたためART REJECT。最終では港の手前へ移し、**水のみ／船ありの二つの本物Blender画像を実生成**。同じCHASEで船のみの可視変化**2,816画素**を独立検証してTECH PASS。ただし画面右端で船が切れ、全景に占める比率が小さいため**ART REJECT**。中間 #41926723134 CANCELLEDは正式合格としない。
- **実Artifact独立再DL完全照合PASS**：[Artifact #13369741975](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41926752717/artifacts/13369741975) ZIP123,796,338 B／SHA256 `3b7b3c72a2d47fc355f375cf19dc98f40b3f8e1b461a9c6233c61db63e32efce`、ZIP全CRC成功。真正編集可能Blender `273,958,272 B`／SHA256 `c81111664d4703ec044aeaaeee1e7b659d95343dbf762ebf9892c6636a7d5a0a`、船あり真正CHASE PNG SHA256 `e74ebe0766fbb7a9169c6561e113549bddb395dca03958849e2ef9e335904069`、水だけPNGと比較PNGもZIP内の個別SHA一致。**Blender編集可能DCCと真正レンダリングは成立、独立Blender GUI再読込と実ゲームWebGL2／人間プレイは未実証**。
- **次は背景アイテムをさらに小さく量産しない。** 港全体の「道路／左岩肌／右公共ターミナル／乗船動線／海面と船」が走行カメラ一枚で読める統合作者美術を優先。右端で切れる船、道路が大半の画面、模型的港、薄い遠景が未解決。単純にモデル・技術テストを増殖してART PASSとみなさない。従来の単一Hero区間ART-FIRST方針を継続。
- **保護・ゲート**：元Game Blob `af076d67492a677d2235e4730aef8cdf4808e106`、元Road5全vertex-face SHA `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`。元B48 7真路面/B51 28Mover、240Hz、0.65m球、6Camera＋CHASE、元樹木11本・光源不変更。main、公式P101研究枝、Draft PR#46（Open/Draft/未merge）、元Slope原本、凍結Gold、本番2サイト保護。正式ART採用**0件**／Slope2 DNA認定**0m**、SAT/CCD/FPS/HUMAN/RELEASE/MERGE全HOLD。Work/Computer Use個別事前承認、追加有料API0円、ユーザーWindows操作0。

---

# 【2026-11-05 K4CC実制作／初回真正Blender TECH PASS・ART REJECT／最新修正版CI確認中】

現在の唯一の研究引き継ぎ入口：`research/k4cc-coastal-relief-fullframe-art-20261105`。最初に[**K4CC真正3D左斜面＋右港画面回復・Native全SHA・初回ART REJECT・修正版の安全な状況**](docs/R19_A6P4_R2F5K4CC_NATIVE_COASTAL_RELIEF_ART_JA.md)を全文読み、[A3とK4CC真同CHASE比較画像](docs/research-evidence/k4cc/K4CC_A3_VS_TRUE_COASTAL_RELIEF_ART_REVIEW_NOT_GAME.png)、[真正監査JSON](docs/research-evidence/k4cc/K4CC_REAL_NATIVE_AUDIT.json)を確認。下の「最新」は旧時点の履歴。

- **実コード・本物Blender保存済**：元K4CB A3真正Blender SHA256 `0b581f45de4d4e215515e8dbef9a4038c7f1b9bdb0e1935943c4445529193e6c`を親としてA3研究用遮蔽壁5個をレンダーだけ非表示にし、K4BQ既存の真左斜面1564頂点→本物の別Blenderメッシュ13426頂点に分割・5587頂点を実立体変形、編集可能原本を別名保存。ゲーム元SOURCE・元B48 Road5・6Camera/CHASE・木11本・光源・元Game Colliderは不変更。
- [K4CC初回真正Actions #41921803434](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41921803434) completed/SUCCESS。**SOURCE/DCC/RENDER TECH PASS、ART REJECT**。Artifact [#13366199801](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41921803434/artifacts/13366199801) は元ZIP SHA `7ad3616db225c4dbbeac619dc3951e48d3c8f2fbde2a35fb92a69895d0733645`を独立DL／全CRC再検算済。真Blender原本SHA256 `19e9169cf4568f973ac4f178e8bbcdf3d05fa88edd3a4c83da07d921c3563a08`、真正同CHASE PNG `efed6b1052536e6c596f23ca1c0f8e6692787a71fa53ac195c7e298483f5f861`。本物の比較画像を**直接目視**：右港は見通し改善、左斜面も3D化。ただし起伏が不自然で路肩脇の薄茶色の継ぎ目、全画面の道路・港の模型感が未達。**正式ART採用0件／Slope2 DNA認定0m。**
- 実画像を受けて**原研究地形を下地として再表示し、その上の複製岩肌を0.055m浮かせて、継ぎ目からの露出を防ぐ修正を研究専用コードに実装・GitHub保存済**。旧地形形状・原Gameは不変更。新実行 [#41922703441](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41922703441) は本項目の記録時点で**in_progress／結果未確認**。完了・画像直接評価・CRCを確認するまでは修正版の成功やART判定を上書きしてはならない。中間 #41922678765 はCANCELLED。
- **今後は技術QAや模型の量産を目的化しない。** 同じCHASE画像で全画面の作者美術（道路対左岩肌対右港、実在の建築用途・遠景・速度）を審査し、ART不合格なら正式候補へ昇格させない。ゲームWebGL2/HUMAN/FPS/SAT/CCDの合格とは絶対に言わない。他6 Roadへの美術展開は禁止。
- **凍結と保護**：元Game Git Blob `af076d67492a677d2235e4730aef8cdf4808e106`／本物Road5 vertex-face SHA `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`。B48本物7、B51本物28、240Hz、球0.65m、元6Camera全値。main、正式`p101-velocity-overdrive-native-trial`、Draft PR #46、原作Slope、本番2サイト不変。Work/Computer Use個別事前承認／追加有料API原則0円／ユーザー操作0。ART/SAT/CCD/FPS/HUMAN/RELEASE/MERGEすべてHOLD。

---

# 【2026-11-05 K4CB A3最終正本：実装→真正Blender→直接ART REJECT→独立ZIP/SHA→GitHub研究保存完了】

**現在の隔離研究ブランチ** `research/k4cb-a3-integrated-quay-arrival-art-20261105`。まず[**K4CB A3完成技術証拠・実画像直接ART REJECT・失敗/保護・次工程固定方針**](docs/R19_A6P4_R2F5K4CB_A3_TRUE_NATIVE_QUAY_ART_REVIEW_JA.md)を全文確認し、[実同CHASE A2対A3画像](docs/research-evidence/k4cb-a3/K4CB_A3_VS_A2_TRUE_SAME_CHASE_QUAY_ARRIVAL_ART_REVIEW_NOT_GAME.png)、[A3独立監査JSON](docs/research-evidence/k4cb-a3/K4CB_A3_REAL_NATIVE_AUDIT.json)を照合する。下段の「現行」「最新」は当時の履歴でありA3より優先しない。

- **真の制作と検証：SOURCE/DCC/RENDER TECH PASSのみ。** 元K4CB A2（研究Blender親SHA256 `5f57d64654ff8df6b6ecd852699432cda50f1afc1af3723779170ccb4cbed5b1`）を真正Artifactから厳格再読込。A3作者スクリプトで港湾の単一大開口、入港側の壁・奥に退いた待合空間、乗船前広場・スロープ・岩棚を**真正Blender独立新10メッシュ**として制作。原ゲーム編集なし・ゲームCollider追加0。元Road5やCHASE、全6 Source Camera、木11本・光源、K4BZ悪い研究舗装hide_render、元A2オブジェクトは不変。
- **最終真正[Actions #41918497448](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41918497448) completed/SUCCESS**。真Blender 4.0.2 EEVEE 768×480同CHASE実画像の生成、編集可能.blend保存、独立ゲーム/Camera/道路指紋/SHA/黒筋6対回帰、研究枝証拠commitの全手順SUCCESS。真編集可能.blend **272,525,680 B／SHA256 `0b581f45de4d4e215515e8dbef9a4038c7f1b9bdb0e1935943c4445529193e6c`**、真CHASE PNG SHA256 `94d349036731ab47ed62677e6e7fdc50f80b9ac96060533bd32ae65d7721b6ae`。[本物の編集可能原本＋画像＋ログ Artifact #13365996340](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41918497448/artifacts/13365996340)。
- **別途独立したZIP原バイト再取得・全CRC/SHA照合PASS**：ZIP 122,766,266 B／SHA256 `2935d7c51562a544491027d66a2abf37dcb2ddb26bff85740aae25e47b08624e`、比較PNG SHA256 `f2b1cd01b1c848a2710467289af45bcb23296ab4171ea75397af81dcc64a489b`。この会話内では独立Blender再オープンはしておらず、実レンダーの裏付けはGitHub Actions Blenderステップと真正原本/PNG実ハッシュ。
- **画像を直接開いて全画面ART REJECT**。右港に入口・壁面は増えたが、画面では広いベージュ壁が空間を隠して港の機能がさらに読みにくい。大きく平坦な灰色道路と単調な左側の山・遠景がそのまま。右港4,777画素差は美術点数ではない。**正式ART採用0件／Slope2 DNA認定0m**、SAT/CCD/FPS/HUMAN/RELEASE/MERGE全HOLD、他6 Road展開禁止。新Blender画像はゲームWebGL2実画面／人間プレイではない。
- **実失敗と反省を引き継ぐ**：[#41917691456](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41917691456)は修正によりCANCELLED、[#41917833226](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41917833226)・[#41918198305](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41918198305)は新研究海岸/乗船スロープがCHASEのレーシング視認保護X>0.49に抵触してFAIL。**安全閾値を緩めず実立体を調整**して最終PASS。これ以上モデル数・箱・屋根・線を増殖しない。全画面が良くなる**真の美術作者による統合造形**（岸壁・左自然地形・海と道路の関係、見える機能）を次工程の唯一の方向とする。単純な微修正CI反復や基盤整備を目的化しない。
- **強制保護**：原Game Blob `af076d67492a677d2235e4730aef8cdf4808e106`、元B48 Road5頂点面SHA256 `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、B48本物7／B51本物28／240Hz／球0.65m／元6Camera＋CHASE、main、公式`p101-velocity-overdrive-native-trial`、Draft PR #46、原作Slope／W7F Gold／本番2サイト不変更。追加課金原則0円、Work/Computer Useは個別事前承認、ユーザーPC操作0。

---

# 【2026-11-05 K4CB A2真正Blender・同CHASE・独立QA成功／ART REJECT → 次は港湾・地形の統合作家工程】

**現行隔離研究枝** `research/k4cb-a2-sculpted-ferry-terminal-chase-20261105`。最初に[**A2真の画像・Blender／ART REJECT／SHAと改善課題**](docs/R19_A6P4_R2F5K4CB_A2_TRUE_NATIVE_ART_REJECT_JA.md)と[真同CHASE A1対A2比較画像](docs/research-evidence/k4cb-a2/K4CB_A2_VS_A1_TRUE_SAME_CHASE_SCULPTED_TERMINAL_ART_REVIEW_NOT_GAME.png)、[正式独立監査JSON](docs/research-evidence/k4cb-a2/K4CB_A2_REAL_NATIVE_AUDIT.json)を確認。下の「A2結果未確認」「次K4CB」は過去の記録。

- [A2正式真正Actions #41914599116](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41914599116) **completed/SUCCESS／TECHのみ**。初回 #41914127494 はA1記録SHAと真Artifactの不一致で安全停止。真Artifactの実バイト検査と内部監査一致後、原本SHA `ea0cadc1db9dde9b01faac17d1cddc7b81c4d6c011eae2ea3c8bf68e90ec5b5d` に固定し再成功（検証を緩めず修正）。
- A2 **真正編集可能.blend 272,243,520 B／SHA256 `5f57d64654ff8df6b6ecd852699432cda50f1afc1af3723779170ccb4cbed5b1`**。同CHASE PNG `dc633bc0a89a14cdd85b7de48c18c115bfad0a4c374eb6471196cd98cd8496d1`。[真正Native Artifact #13363873298](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41914599116/artifacts/13363873298)。GitHub保存・比較画面直接目視完了、ZIP独立再DL/CRCは本会話では未実施。
- 元Game Blob `af076d67492a677d2235e4730aef8cdf4808e106`、Road5全頂点面 `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、6 Camera＋CHASE、旧樹11本、照明、K4BZで消した黒筋、既存元屋根・柱・全表示不変を真正技術検査。原Game編集0、追加Collider0、main／公式P101／Draft PR #46／本番2サイト保護。
- **ART REJECT**：A1に比べて右港の真の大きな曲面屋根は視認できるが、金属シェル的・接続感不足。ほかの港は模型、左地形は平坦、広大な道路が画面を支配。TECH合格・10,277画素差≠世界水準ART。正式ART採用0件／Slope2 DNA認定0m。SAT/CCD/FPS/HUMAN/RELEASE/MERGE HOLD。
- **次**：同様のシェル／箱の量産・色替え禁止。右港の公共用途・建築断面・厚い屋根・出入口・岸壁の地形接続と、左自然地形・画面全体のスケールを統合した作者工程。元Road5物理をいじらず、再び真の同CHASEの編集可能DCC・比較画像でART判定。Work/Computer Use事前承認・追加有料API原則0円・ユーザー操作最小。

---

# 【2026-11-05 K4CB A2実装・真正Blender試験起動／結果確認前はTECH/ART HOLD】

**現行隔離研究枝** `research/k4cb-a2-sculpted-ferry-terminal-chase-20261105`。最優先で [K4CB A2真フェリーターミナル作者造形・保護・未判定記録](docs/R19_A6P4_R2F5K4CB_A2_SCULPTED_NATIVE_TERMINAL_ART_HOLD_JA.md) と [実Actions #41914127494](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41914127494) を照合。元K4CB A1は **真正画像 TECH PASS／全画面ART REJECT** であり、下段のSTART_HERE A1記載は引き継ぎ履歴。新A2は元A1真正.blendの固定SHA照合→既存公共建築につながる大きな実曲面屋根・構造柱・乗降フロア制作→元CHASE 768×480真正レンダー→同画面A/B・独立SHA／K4BZ黒筋回帰を試行する。**試験結果の確認前に成功を宣言しない。** 元Game・元Road5・元6 Camera／CHASE・旧樹11本・光源・元の非表示K4BZ研究舗装、main、公式P101、Draft PR #46、本番は保護。正式ART採用0件、Slope2 DNA0m、SAT/CCD/HUMAN/FPS/RELEASE/MERGE HOLD。Work/Computer Use事前承認、追加有料APIなし。

---

# 【2026-11-05 K4CB A1 真正Blender画像・GitHub研究保存確認／ART REJECT → 次K4CB作者造形改善】

**現行隔離研究枝** `research/k4cb-maritime-exchange-true-chase-20261105`。最初に[**K4CB A1 真同CHASE実レンダー・直接目視ART REJECT・原因と次工程**](docs/R19_A6P4_R2F5K4CB_A1_NATIVE_CHASE_ART_REJECT_JA.md)と[実監査JSON](docs/research-evidence/k4cb/K4CB_SOURCE_LOCKED_TRUE_MARITIME_EXCHANGE_AUDIT.json)を開く。歴史的な下段の「未確認」「次K4CB」は以前の時点であり、今の状況を上書きしない。

- A1初回Actions #41857056044はBlender樹木長名prefixの不一致でFAIL。元A2.blendを実バイト検査しBlender ID 63バイト制限が原因と同定、[修正 `78e72df`](https://github.com/ryomashibaba/dopagaki-development-hub/commit/78e72df6ce08c13448e761ae9335b2be196fe331)。K4BS 8／K4BV 1／K4CA 2は保存原本に存在、個別件数・CC0/非Collider・元姿勢を再ASSERT。
- **本物のK4CB A1 Blender同CHASE 768×480 PNGと旧K4CA A2比較**を[研究証拠](docs/research-evidence/k4cb/K4CB_VS_K4CA_TRUE_SAME_CHASE_MARITIME_EXCHANGE_ART_REVIEW_NOT_GAME.png)としてGitHubで確認・画像を直接開いて評価。24 DCC研究メッシュ、港の実画像領域2,083画素が変化、6対の既知黒筋が再発しなかったことを監査。**3連アーチは小さすぎて模型感の港／極端に広く平坦な道／単調な左地形を改善しきれないため全画面ART REJECT**。
- A1編集可能.blendの監査記録SHA `9df956acf164d7a0f4d861585644e15f87faa5d85683f2e8ae79bb438c03333d`／同CHASE PNG `0aa667522b327e2ace253c3e5acff56b77ff05139024e7aaab517c8ef70d99b7`／比較画像 `ab908c1b15aaee1f397fd1a67253dcee64a5036e39634aa48cd1282fb95089fd`。**これらはActions研究監査の記録値で、新編集可能A1.blendをこの会話内で独立再ダウンロードして照合したわけではない**。最終Actions run conclusionは未照合。
- 次は**K4CBの作者再構成**：アーチを量産するのではなく実CHASEで支配力を持つ建物の構造、厚い屋根・壁・入口、岸壁・地形との立体連続と遠近スケールを根本改善し同条件画像で採否。元Game Blob `af076d...`／元Road5 `f7c609...`／6 Camera＋CHASE／元9樹＋新2樹／光源／K4BZの1研究重複Road非表示を不変。正式ART採用0件、Slope2 DNA 0m、SAT/CCD/FPS/HUMAN/RELEASE/MERGE HOLD、main/公式P101/Draft PR #46/本番2サイト保護。Work/Computer Useは個別事前承認、追加有料API0円。

---

# 【2026-11-05 K4CB A1実Blender初回FAIL → Blender 63-byte ID切詰め原因を実親.blendで特定・研究枝で修正】

**現在の隔離研究ブランチ** `research/k4cb-maritime-exchange-true-chase-20261105`。K4CA A2から3コミット進んで真正港湾Exchange作者研究コード・Blender EEVEE Actionsを実装し、さらにK4CB A1初回の失敗を原因に応じて修正した。詳細は[**K4CB A1制作・厳密原本保護・結果未確認**](docs/R19_A6P4_R2F5K4CB_SOURCE_LOCKED_MARITIME_EXCHANGE_A1_JA.md)。

- 初回真正[Actions #41857056044](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41857056044)は**FAILURE**。親A2 Artifact/本物のSHA、元Game保護、K4BZ/K4CAの回帰テストはPASS。Blender 4.0.2で親.blendを直接再読込した直後、スクリプトの `len(orig_trees)==11` で停止。**新しいK4CBレンダー／原本／成功画像は生成されず**、ART判定不可。
- GitHubのA2 Artifact #13334366579 の真.blendを独立取得し、ZIP CRC PASS。Blenderファイルのオブジェクト名をバイナリで点検するとK4BS 8／K4BV 1／K4CA 2を実確認。**K4CAの新規2件は長いBlender Object IDが63バイトへ切り詰められ、元の長いprefix指定から漏れていた**。原本の樹木が2本欠落したのではない。
- [修正コミット `78e72df6ce08`](https://github.com/ryomashibaba/dopagaki-development-hub/commit/78e72df6ce08c13448e761ae9335b2be196fe331)：K4CA検索prefixを実際の保存名に合わせ、**8+1+2別個数・2本のCC0 collection instance/vendor/非Collider・11名称一意・全姿勢不変**をASSERT。原本保護の緩和なし。workflowはscript pushで再試験する仕様。**修正後の実Blender完了はこの記載時点で未確認**。新規A1のTECH PASS/ART PASSを宣言しない。
- 保護：元Game blob `af076d67492a677d2235e4730aef8cdf4808e106`、Road5形状SHA `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、6Camera＋CHASE、元9樹＋K4CA 2樹、K4BZ黒筋オーバーレイ非描画、元物理・Collider、main／公式P101／Draft PR #46／本番を保護。**正式ART採用0／Slope2 DNA 0m、ART REJECT、HUMAN/FPS/SAT/CCD/RELEASE/MERGE HOLD**。Work/Computer Useは個別事前承認。追加有料API0円。次工程は同CHASE真正レンダーと人間の全画面ART判定であり、大量の箱やRoadオーバーレイ増殖ではない。

---

# 【2026-11-04 K4CA A1/A2実制作・真正画像・QA完了 → 次K4CB】

**現行研究ブランチ** research/k4ca-authentic-coastal-terrain-photo-canopy-one-frame-20261104。[**K4CA A1→A2の真のBlender SHA・比較画像・ART REJECT・軽量再発防止**](docs/R19_A6P4_R2F5K4CA_A1_ART_REJECT_A2_HOLD_JA.md)を最初に読む。[制作時に固定した安全条件](docs/R19_A6P4_R2F5K4CA_SOURCE_LOCKED_REAL_COASTAL_ART_JA.md)、[前K4BZ黒筋の直接原因を真A/Bで確定](docs/R19_A6P4_R2F5K4BZ_TRUE_BLACK_WEDGE_PIXEL_CAUSE_DIAGNOSTIC_JA.md)も継承。以下の「最新」「未確認」は履歴。

- A1 [真Blender CI #41847858655](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41847858655) **SUCCESS**。K4BZ R2で黒筋を修正済みの本物の編集可能.blend SHA256 162a7baaf7594b36a134457bee817bd7dcf0ef1b3e581419d6561efa92e45382 を直接入力。既存の本当に見える左K4BQ丘陵の材質だけ改修し、本当のCC0 island_tree_02写真樹木モデル2本を地面Raycastで植えた。黒筋再発なし、Road5/Cameraは保護。ただし**明るすぎる白い左斜面でART REJECT**。
- A2 [真正Blender CI #41849818268](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41849818268) **SUCCESS**。同じ親Native・同じCamera・同じ2本の樹木で、左斜面を低輝度・暖色砂岩の研究マテリアルに再調整。真編集可能 A2.blend **271,620,488 B／SHA256 299f1972e3383a7fc0047409a0f58581da3884988749dff6842a80cdf49a3ffa**。真同CHASE 768×480 PNG SHA256 **e864aa1cdcc7707370c47e0542580cd6963f8e2fb9deada8cf0a9752dd8f84d6**。[K4BZからの本物の同カメラA2比較](docs/research-evidence/k4ca/K4CA_VS_K4BZ_TRUE_SAME_CHASE_COASTAL_SLOPE_PHOTO_CANOPY_ART_REVIEW_NOT_GAME.png) SHA256 a7843378e17a113e07d6d6a9b3ea4e090b55458fb49a4c1bd389db4b31b3b1f9。[真A2編集可能.blendと画像 Artifact #13334366579](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41849818268/artifacts/13334366579) ZIP実CRC全PASS。**A2の色は改善したが地形と港湾・道路の実在感は不十分、ART REJECT継続**。
- [K4CA軽量Sourceと真画像回帰CI #41850910734](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41850910734) **SUCCESS**。元K4BZ黒筋6対の再発なし、元CHASE Road5・右港の8ピクセルは元画像と完全一致、左斜面だけ真画像が変わり、元ゲームと元Road5指紋を保護。Blender再実行なし。tests/p101-k4ca-protected-coastal-frame-regression.pyを永続化。
- **正式ART採用0件／Slope2 DNA0m、SAT/CCD/HUMAN/FPS/RELEASE/MERGE HOLD**。新ゲームCollider0。main、公式p101-velocity-overdrive-native-trial、Open/Draft PR #46、本番2サイトは不変更。元Game Blob af076d67492a677d2235e4730aef8cdf4808e106、元B48 Road5全頂点面 SHA f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2、元B48 7 Road/B51 28 Mover/240Hz/球半径0.65m、6 Camera/CHASE/真木9本保持。追加課金0円、Work/Computer Use事前承認、ユーザーWindows操作0。
- **次K4CB**：追加の円錐の木や重複Roadを量産しない。画像で確認した左岩肌の平板さ、右港の箱型建築・実材質不足、道路が画面を占める構図と速度感を根本改善する真の美術作者工程へ移行。単なる配色差やRGB差分をART評価と誤認せず、実Blender画面のART基準を守る。6Road展開/公式PR組込は禁止。

---

# 【2026-11-04 K4CA継続美術制作】真正CC0海岸樹2本と既存岩肌・元CHASEの1画面評価

**現在の隔離研究枝** research/k4ca-authentic-coastal-terrain-photo-canopy-one-frame-20261104。先に[**K4CA写真由来海岸樹・既存斜面の本物のPBR地質・元ゲーム保護方針**](docs/R19_A6P4_R2F5K4CA_SOURCE_LOCKED_REAL_COASTAL_ART_JA.md)を読む。前K4BZ完成済み[引き継ぎ・原因同定／再発防止](docs/R19_A6P4_R2F5K4BZ_TRUE_BLACK_WEDGE_PIXEL_CAUSE_DIAGNOSTIC_JA.md)も固定し、過去の決定を変えない。以下の「最新」記述は履歴。

- K4BZ R1真Blender診断、R2真正固定CHASE A/B、R3軽量RGB回帰の全3工程が**TECH PASS**。問題K4BY研究道路表面1件の描画OFFで黒い筋を除去した**真正Native.blend SHA256 162a7baaf7594b36a134457bee817bd7dcf0ef1b3e581419d6561efa92e45382** をK4CA唯一の親原本とする。K4BZ修正の正式ART採用は禁止。元Game/Road5は変更せず。
- K4CA は「大量の粗い樹木・新たな不自然な山・道路表面を上塗りしない」方針で、**元CHASE上の左側の斜面実Blender RayCast・同一本物メッシュのPBR地質のみ変更、Photo素材入りの真正Poly Haven CC0 island_tree_02コレクションから風剪定樹を2本のみ接地設置**して、同じ元CHASE 768×480だけをレンダリング。木が自然に見えない場合はART REJECT。真正原本・比較画像・独立SHA監査を守る。
- [K4CA初回CI #41847033140](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41847033140) はPillow未導入でプリフライト停止。修正CI [#41847318174](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41847318174) はこの記載時点で**完了未確認**。合格を主張する前に実Blender画像を見ること。
- 元Game Git Blob af076d67492a677d2235e4730aef8cdf4808e106、元B48 Road5全頂点面 f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2、元6Camera/CHASE、既存木9本、B48 7実Road/B51 28Mover/240Hz/0.65m球、main/公式P101/Draft PR#46/本番2サイト不変。正式ART採用0件、Slope2 DNA0m、SAT/CCD/HUMAN/FPS/RELEASE/MERGE全HOLD。Work/Computer Use事前承認、追加有料API0円、ユーザーWindows操作0。

---

# 【K4BZ 2026-11-04 最終 R1/R2/R3 全技術検証PASS → 次K4CA ART-FIRST】

**現行隔離研究枝** research/k4bz-true-chase-black-wedge-object-shadow-audit-20261104。[K4BZ全根拠・画像・修正・R3再発防止・次工程](docs/R19_A6P4_R2F5K4BZ_TRUE_BLACK_WEDGE_PIXEL_CAUSE_DIAGNOSTIC_JA.md)をまず読む。以下の「実行待ち」「終了未確認」は過去の履歴。

- [R1真のBlender 12地点レイ診断 #41834276872](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41834276872) SUCCESS：黒い筋の6/6点はK4BY研究用Road5 PBRスキン、正常側の6/6点はK4BQ既存別のCC0写真道路が最前面。太陽方向にレイ遮蔽物なし。ソースGame/Road5/Camera全保護。
- [R2真の同CHASE Blender制御 A/B #41835036099](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41835036099) SUCCESS：**研究用K4BY道路メッシュ1オブジェクトのみhide_render、ほか全不変**で異常6点の明度が平均+31.945階調、正常との明度差は約32.56→0.56階調。真正画像でも黒い三角筋が消えた。黒筋の直接原因はK4BY研究道路オーバーレイの描画と実証。元Game本体の不具合ではない。
- [R3軽量再発防止 CI #41840882396](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41840882396) **SUCCESS**。固定された元と修正後の768×480真正PNGのSHA256、全6組12ピクセルRGB、元Game Blob/道路形状、非表示の対象1つだけ、比較路面の安定性を再検証。Blender新レンダリング不要。tests/p101-k4bz-proven-dark-wedge-regression.py を保存。
- 編集可能**R2真.Blend** SHA256 162a7baaf7594b36a134457bee817bd7dcf0ef1b3e581419d6561efa92e45382。[**本物の元K4BY対修正K4BZの画像**](docs/research-evidence/k4bz/K4BZ_SINGLE_OBJECT_HIDDEN_VS_CANONICAL_CHASE_TRUE_RENDER_AB.png)、修正PNG SHA256 d82a367f49623a8ed2a75a4540ba8a6de07f976a51d49f4dbb20673243576df7。[真A/B Blender原本 Artifact](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41835036099/artifacts/13327120155)。
- **局所黒筋のみTECH FIX PASS／正式ART REJECT、正式採用0件、Slope2 DNA0m**。次K4CAは黒筋対策を蒸し返さず、元CHASE全体で道路の平板さ・左自然地形・右の港湾建築・街区の現実感を本物の作者美術として改善する。元Game Blob af076d67492a677d2235e4730aef8cdf4808e106／元Road5頂点面 f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2／元6Camera/CHASE/元9木／B48 7Road/B51 28Mover/240Hz/球半径0.65m／main/公式P101/Draft PR#46/本番不変更。SAT/CCD/HUMAN/FPS/RELEASE/MERGE全HOLD、Work/Computer Use事前承認、追加課金0円。

---

# 【2026-11-04 K4BZ R2原因確定 → R3軽量回帰・次K4CA】研究路面重複由来の黒筋を真正同CHASE A/Bで除去

最新隔離研究枝 research/k4bz-true-chase-black-wedge-object-shadow-audit-20261104。[**K4BZ正式真Blender原因同定・6対6ピクセル・1オブジェクト制御A/B・次K4CAの画面全体ART方針**](docs/R19_A6P4_R2F5K4BZ_TRUE_BLACK_WEDGE_PIXEL_CAUSE_DIAGNOSTIC_JA.md)をまず読む。以下の「結果未確認」「最新」は履歴。

- [K4BZ R1 Actions #41834276872](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41834276872) **SUCCESS**。実CHASEの暗部6/6最前面=K4BY研究PBRレイキャスト道路、正常部6/6最前面=K4BQ既存別CC0写真道路。元太陽光レイの遮蔽物は12/12なし。原因は「二種類の研究用道路表面・材質が重なり交替すること」の可能性が高いとしてR2で制御実験。
- [K4BZ R2 Actions #41835036099](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41835036099) **SUCCESS**。元K4BY A3真.blendをSHA256 f0d3d7a27e5fbf599447b0e784b71684ff634b071d283f8b59bdaf06a179d4e4で独立ロードし、**K4BY非ゲーム研究路面オブジェクト1つだけ描画OFF**。元Road5／元6Camera／元CHASE／真木9本／全照明／物理保持。同カメラの真正768×480 Blender画面で6個の異常座標が平均+31.945階調明るくなり、異常対正常差約32.56→0.56階調で実際の黒い三角筋が消失。直接原因となった研究オーバーレイの表示は確定。ゲーム本体の不具合とは認定しない。
- 編集可能真R2.blend SHA256 162a7baaf7594b36a134457bee817bd7dcf0ef1b3e581419d6561efa92e45382、新実CHASE PNG SHA256 d82a367f49623a8ed2a75a4540ba8a6de07f976a51d49f4dbb20673243576df7。[旧K4BY→K4BZの真正A/B比較](docs/research-evidence/k4bz/K4BZ_SINGLE_OBJECT_HIDDEN_VS_CANONICAL_CHASE_TRUE_RENDER_AB.png)・[ピクセル監査JSON](docs/research-evidence/k4bz/K4BZ_ONE_OBJECT_ABLATION_AUTHENTIC_NATIVE_AUDIT.json)・[Blender原本Artifact](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41835036099/artifacts/13327120155)を保存。**局所黒筋TECH FIX PASSでも、美術ART REJECT・正式採用0件・Slope2 DNA0mは継続**。路面・地形・港湾の質は依然不足。
- **R3の軽量な回帰試験** [Actions #41840882396](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41840882396) は記述時点で終了未確認。tests/p101-k4bz-proven-dark-wedge-regression.py と .github/workflows/p101-k4bz-fixed-real-chase-wedge-regression.yml を実装。元と修正済み真正PNGのSHA/6組のRGBから既知黒筋の消失と正常路面の維持を判定。**再レンダリング不要・美術合格判定ではない**。
- 次K4CAは道路の推測重ね塗りを止め、同CHASE全体の風景・沿岸公共建築・自然地形の美術品質を集中改善。元Game blob af076d67492a677d2235e4730aef8cdf4808e106、元B48 Road5全頂点面 f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2、B48 7Road/B51 28Mover/240Hz/0.65m球、元6Camera・研究CHASE、真木9本、main/公式P101/Draft PR#46/本番2サイト保護。SAT/CCD/HUMAN/FPS/RELEASE/MERGE HOLD、追加課金0、Work/Computer Use事前承認。

---

# 【2026-11-04 K4BZ実診断】左車線の黒い筋＝別々の研究道路メッシュの交差を実12ピクセルで確認

新研究枝 `research/k4bz-true-chase-black-wedge-object-shadow-audit-20261104`。[**K4BZ真正Blenderの元CHASE12ピクセル・レイ・材質・Sun遮蔽調査、源保護、1オブジェクト真正A/B**](docs/R19_A6P4_R2F5K4BZ_TRUE_BLACK_WEDGE_PIXEL_CAUSE_DIAGNOSTIC_JA.md)を第一に読む。以下の「最新」記述は前工程の履歴。

- [**診断CI #41834276872**](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41834276872) **completed/SUCCESS**。元K4BY A3真.blend SHA256 `f0d3d7a27e5fbf599447b0e784b71684ff634b071d283f8b59bdaf06a179d4e4`＋元CHASE PNG SHA256 `ad46b5377fd9d144c7ab94b428df52d5f97cb7675fe44c3d14389b7858c925f7`を直接検証。実画像の黒筋6点の最初の交差は全6点 **K4BY | actual source raycast 1m road surface | NO GAME COLLIDER** （真2K Asphalt Track PBR材）、隣の普通路面6点の最初の交差は全6点 **K4BQ / physically variegated 26m curved material research test** （K4BR実CC0アスファルト材）。唯一表示有効Sun方向の影遮蔽レイは12点すべて遮蔽物なし。よって**研究用道路サーフェスの前後交差・別材質境界が最有力**だが、レンダー因果関係を完全同定したとする前に**K4BY研究舗装1オブジェクトだけを非表示にした実同CHASE A/B**を行う。
- [**R2真正Blender A/B CI #41835036099**](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41835036099) はこの先頭文書記述時点で結果未確認。元ゲーム・元B48 Road5全頂点面 `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、元6Camera・研究CHASE、元9木、全照明を保護。元Game Blob `af076d67492a677d2235e4730aef8cdf4808e106`、B48 7道路/B51 28動体/240Hz/0.65m球不変。正式ART採用0件／Slope2 DNA 0m、ART REJECT、HUMAN/SAT/CCD/FPS/RELEASE/MERGE HOLD。main・公式P101・Draft PR#46・本番2サイト不変更。Windows操作0、Work/Computer Use事前承認、追加課金0円。

---

# 【2026-11-04 K4BY A3最終確定 → 次K4BZ】真2K CC0路面と既存港湾建築TECH PASS／真正画像ART REJECT

**最新の研究隔離枝** `research/k4by-photoreal-road-occupied-harbor-art-20261104`。[**K4BY公式PBR路面・港湾建築改修、A1/A2/A3の実画像失敗原因と独立SHA、K4BZのピクセル原因識別**](docs/R19_A6P4_R2F5K4BY_TRUE_CC0_ROAD_OCCUPIED_HARBOR_JA.md)を第一に読む。以下の「最新」「CI実行中」は過去の履歴。

- K4BY初回 [CI #41828751760](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41828751760) は建築屋根の名前省略への検索不具合でFAILURE。A1 [#41829344849](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41829344849) はTECH PASS／路面の黒筋でART REJECT。A2 [#41830277784](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41830277784) はTECH PASS／路肩が黒い大ポリゴンとなりART REJECT。A3 [#41831182680](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41831182680) は**completed/SUCCESS**、真Road5に1m間隔で実Raycastした研究用PBR舗装3,978頂点/3,800面、旧原因候補の道路スキンはRender OFF。巨大な暗路肩は消えたが左車線内部の暗三角筋残存。**A3最終TECH PASS／目視ART REJECT**。
- 公式 Poly Haven `asphalt_track` 2K Diffuse/Rough/OpenGL Normal**3枚、総9,656,072B**のVendor MD5/Bytesと独立SHA256照合、真正Blender原本へのPacked SHA PASS。元K4BX A3原本 SHA256 `1cdf3233d3b2b91b1e10b6f7b2212ef9ec74331667ca4129a4e96ce43b4c2179` を固定。真K4BY A3編集可能.blend SHA256 `f0d3d7a27e5fbf599447b0e784b71684ff634b071d283f8b59bdaf06a179d4e4`、[同CHASE PNG](docs/research-evidence/k4by/K4BY_ONE_SAME_CHASE_TRUE_PBR_RACE_ROAD_CIVIC_HARBOR_NOT_GAME.png) SHA256 `ad46b5377fd9d144c7ab94b428df52d5f97cb7675fe44c3d14389b7858c925f7`、[旧新同カメラ比較](docs/research-evidence/k4by/K4BY_VS_K4BX_A3_SAME_CHASE_TRUE_CC0_ROAD_HARBOR_ART_REVIEW_NOT_GAME.png) SHA256 `366abfe88efd89518d0e7fcf59c2d6c00863fbc09d76edc861c0ad7c368427c0`、[GitHub Artifact #13321649653](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41831182680/artifacts/13321649653) ZIP CRC PASS/SHA `357c55b9bd115ee6d02a87a1a58c1e833fcbc76a3cb29c1347c9f169f8db6bf6`。
- **次K4BZ**：もう目視だけで舗装を推測修正しない。固定CHASEの異常ピクセルから何のオブジェクト／面／材質／遮蔽で黒三角が生まれたかを**非破壊Blender Ray Castや識別パスで真正同定**してから最小限の美術改修。屋根/玄関は現研究DCCで厚みがありながら見た目未合格。世界水準の1画面ART合格まで他6Roadや本番Gameへ拡大禁止。
- 不変：元Game Blob `af076d67492a677d2235e4730aef8cdf4808e106`、元B48 Road5指紋 `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、元Rig6 Camera/CHASE、元真木9本、B48 7 Road/B51 28 Mover/240Hz/球半径0.65m。main/公式P101/Draft PR#46/本番2サイト不変更。正式ART採用0件／Slope2 DNA0m、SAT/CCD/HUMAN/FPS/RELEASE/MERGE全HOLD。Work事前承認、追加課金0円、ユーザー操作0。

---

# 【2026-11-04 K4BY制作】実CC0路面写真PBR・既存海辺公共施設の構造修正

現行**隔離研究ブランチ** `research/k4by-photoreal-road-occupied-harbor-art-20261104`。[**K4BY公式Asphalt Track PBR／本物の既存公共施設の屋根厚・玄関・石壁の修正／元Road5保護**](docs/R19_A6P4_R2F5K4BY_TRUE_CC0_ROAD_OCCUPIED_HARBOR_JA.md)を最初に読む。そのあとK4BX A3→K4BW→K4BV→K4BU→K4BTの永続正本を遡る。以下の「最新」は過去の履歴。

- 元K4BX A3 [Actions #41824656344](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41824656344)真正 Native.blend SHA256 `1cdf3233d3b2b91b1e10b6f7b2212ef9ec74331667ca4129a4e96ce43b4c2179` を固定・再読込。前画像は巨大灰色道路・模型のような薄い港の施設が課題で**TECH PASS／ART REJECT**。
- K4BYでは正式物理Road5は編集せず、既存研究用道路スキンに**公式CC0 Asphalt Track 2KのDiff/Rough/NormalをVendor MD5と独立SHA256で確認し**実世界2m UVの本物のPBR素材を適用。既存海辺の公共施設の屋根に実厚0.28m、入口ガラス1面に開閉可能な研究用玄関表現、石壁と亜鉛金属の仕舞を作者再構成。同Camera 768×480の**真正Blender実画像1枚**で採否を判定。素材が本当に読み込めなければHOLD、見た目が悪ければART REJECT。
- [K4BY初回Actions #41828751760](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41828751760)は記述時点で**結果未確定**。実画像・編集可能.blend・元ゲーム保護・独立SHAを検証するまでは技術成功も美術成功も主張しない。
- 元Game Blob `af076d67492a677d2235e4730aef8cdf4808e106`、元B48 Road5 Vertex/Face指紋 `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、元6Camera、研究CHASE、9本の木、B48 7実道路・B51 28動体・240Hz・0.65m球、main、公式P101、Draft PR#46、本番2サイトは絶対保護。**正式ART採用0件／Slope2 DNA0m、SAT/CCD/HUMAN/FPS/RELEASE/MERGE全HOLD**。追加有料API0円、Work/Computer Use事前承認、ユーザーWindows操作0。

---

# 【2026-11-04 K4BX A3最終確定 → 次K4BY】真正3D岬と港湾 TECH PASS／同CHASE画面 ART REJECT

**研究隔離枝** `research/k4bx-source-locked-harbor-horizon-composition-20261104`。[**K4BX A1～A3 真正Blender原本・SHA256・最終目視ART REJECT・次K4BY品質優先方針**](docs/R19_A6P4_R2F5K4BX_TRUE_HEADLAND_WORKING_HARBOR_JA.md)を最初に読む。以下の古い「最新」「A3実行中」は履歴。

- A1 [CI #41823102768](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41823102768) SUCCESSだが左の黒三角形岬・継ぎ目がART REJECT。A2 [CI #41823924403](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41823924403) SUCCESSだが遠景空白・屋根板・浮いたVTSがART REJECT。A3 [CI #41824656344](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41824656344) **SUCCESS**。元Cameraの本物の射影を用いて**深度265～700mの実メッシュ岬・島影**を作者制作し、前の地形不具合とVTS屋根浮きの悪化物を研究原本に保持・非表示。**真正768×480実画像で道路の先に連続した海岸丘陵・遠景が見えたが、港の小さく板状の建築と路面・近景の現実感不足でART REJECT**。正式採用0件・Slope2 DNA 0m。
- 真A3編集可能Blender.blend SHA256 `1cdf3233d3b2b91b1e10b6f7b2212ef9ec74331667ca4129a4e96ce43b4c2179`／真正同CHASE研究PNG SHA256 `4f6cb003a57fedefaed44ff39662398f44e3e00f30b5395fd4c0c8b8a2dc80ee`。[本物の同Camera旧新画像比較](docs/research-evidence/k4bx/K4BX_VS_K4BW_A2_SAME_CHASE_TRUE_HARBOR_HEADLAND_ART_REVIEW_NOT_GAME.png)。[実編集可能原本と監査Artifact #13318234253](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41824656344/artifacts/13318234253) ZIP実SHA `9e43fbaf5a6e7fdf44da6810f7fd890045184c4ddebfabea8c73a25d9678c920`、CRC PASS。
- **次K4BY**：模型の建物・手すり・量産植生を増殖しない。路面と左自然斜面の写真レベルの物理質感、右の港の屋根厚・壁面・出入口・港湾の実用途・生活感など、少数の主役の本物の美術造形を完成させる。元ゲームGit Blob `af076d67492a677d2235e4730aef8cdf4808e106`、元B48 Road5 Vertex/Face SHA `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、元6Camera・研究CHASE・旧真木9本・B48 7Road/B51 28Mover/240Hz/球0.65mを保護。Game Collider新規0、main・公式P101・Draft PR #46・本番不変更。SAT/CCD/HUMAN/FPS/RELEASE/MERGE HOLD。Work/Computer Use事前承認、追加課金0円、Windows操作0。

---

# 【2026-11-04 K4BX実制作】本物の連続3D岬・港湾生業・遠景を同CHASE研究で確認

現行隔離研究枝 `research/k4bx-source-locked-harbor-horizon-composition-20261104`。[K4BX真正3D海岸岬・働く港・源Game不変の制作方針](docs/R19_A6P4_R2F5K4BX_TRUE_HEADLAND_WORKING_HARBOR_JA.md)を第一に読み、[K4BW A2最終ART REJECT](docs/research-evidence/k4bw/K4BW_A2_FINAL_STATUS.md)からK4BV→K4BU→K4BTと過去正本を継承する。以下の「最新」「結果」は履歴。

- K4BW A2真正.blend SHA256 `62c2990e6687ea092a8151339b37fdb0cb8ad156b5dffac1a593218b2c517c02`を固定原本とし、**元Road5頂点面/元6 Camera/研究CHASE/旧CC0真木9本のTransform、元Gameソースをすべて変更なし**で研究3D岬、港の魚市場・フェリー発着所・港務所・実荷役クレーン・作業船・丘陵住宅と岸壁を作者制作。同研究CHASE **768×480 1枚**だけで投影と目視ARTを判定。追加有料素材なし。
- [初回真正CI #41823102768](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41823102768) は記述時点**実行中／成果未確認**。実Native.Blend、PNG/Blob/SHA、元カメラ保護と実画像を確認するまで成功・美術合格を主張禁止。
- 元Game Blob `af076d67492a677d2235e4730aef8cdf4808e106`、元B48 Road5指紋`f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、元B48実7Road/B51 28Mover/240Hz/0.65m球/元6Camera/安全UI、本番、main、正式P101、Draft PR #46保護。**ART採用0件／Slope2DNA0m、SAT/CCD/FPS/HUMAN/RELEASE/MERGE全HOLD**。Work/Computer Use事前承認、追加課金0円、ユーザー操作0。

---

# 【2026-11-04 K4BW A2最終・次K4BX】Native技術PASS／真正研究画像ART REJECT

最新研究枝 `research/k4bw-coastal-viaduct-harbor-composition-20261104`。まず[K4BW A2最終判定](docs/research-evidence/k4bw/K4BW_A2_FINAL_STATUS.md)、次に[K4BW作者Blender工程](docs/R19_A6P4_R2F5K4BW_COHERENT_COASTAL_HARBOR_ART_JA.md)とK4BV→K4BU→K4BTの正本を参照。以下の「最新」「実行中」は履歴。

- A1 [CI #41818181545](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41818181545) SUCCESSだが路面筋と左斜面継ぎ目がART REJECT。A2 [CI #41818853277](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41818853277) は本物のBlender原本と実画像を保存したが後段の恣意的平均RGB差分閾値でFAILURE。既存Artifactを**再レンダリングなし**で独立検証した[CI #41819493849](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41819493849)は SUCCESS、技術PASS。技術PASSは美術PASSではない。
- 真A2編集可能.blend SHA256 `62c2990e6687ea092a8151339b37fdb0cb8ad156b5dffac1a593218b2c517c02`、真正同CHASE 768×480 PNG SHA256 `542c765f92c5bc0007c7883dd407b72467e889504cf02c56b9cc5bc726710372`、[真正旧新比較画像](docs/research-evidence/k4bw/K4BW_A2_VS_K4BV_SAME_CHASE_REAL_ART_REVIEW_NOT_GAME.png)。実画像ART REJECT、正式採用0件・Slope2 DNA0m。
- 次のK4BXは**道路・自然地形・港湾の実用途と遠景を含む構図の抜本改善**。単純な箱・円錐樹・柵や細い線を量産しない。元Game Blob `af076d67492a677d2235e4730aef8cdf4808e106`、元B48 Road5 fingerprint `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、元6 Camera、B48 7Road/B51 28Mover/240Hz/0.65m球、main/公式P101/Draft PR #46/本番保護。SAT/CCD/FPS/HUMAN/RELEASE/MERGE HOLD。追加課金0、Work/Computer Use事前承認。

---

# 【K4BW 2026-11-04 海辺の港湾・地形・路面を一体で作者設計する工程】

**新しい隔離研究枝** `research/k4bw-coastal-viaduct-harbor-composition-20261104`。[K4BW作者海岸港湾・路面構図、元SOURCE厳守、真正Camera1枚検証](docs/R19_A6P4_R2F5K4BW_COHERENT_COASTAL_HARBOR_ART_JA.md)を第一に読み、以下のK4BV真正高密度木・K4BU木配置・K4BT投影診断を継承する。下の「最新」は履歴。

- 元K4BV Native画像は右岸の実在樹木だけが改善し、**高速ゲームとしての画面全体ART REJECT**。元ゲームBlob `af076d67492a677d2235e4730aef8cdf4808e106`、B48 Road5 fingerprint `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、元B48 7実道路/B51 28動体/240Hz/0.65m球/元Rig6Camera、元研究CHASE全保護。
- K4BWは元K4BV編集可能.blend SHA256 `7c28000ad1a75afb7f64958a6d48ec5ff205849c37d5a2878f17bdd1d2d4e1c4` を読み、元Road5の物理を**一切書き換えず**、研究用表面の道路摩耗、左連続斜面、右の明確な海辺の公共施設（木の構造屋根・ガラス面・岸壁・港湾歩道・観覧テラス）を作者配置、同研究CHASE元カメラの**768×480 Native実画像1枚**で真の視認性を評価。見た目が悪ければTECH PASSでも**ART REJECT**、採用禁止。
- [K4BW初回 Actions #41818181545](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41818181545) は記述時点で結果未確認。実証結果を後で差分追記するまではブレンダー画像成功を宣言しない。元物理Collider0/ゲーム編集0、正式ART0件/Slope2 DNA0m、SAT/CCD/FPS/HUMAN/RELEASE/MERGE HOLD、main/公式P101/Draft PR #46/本番2サイト不変更。追加有料API0円、Work/Computer Use事前承認、Windows操作不要。

---

# 【2026-11-04 K4BV最終確定 → K4BW制作入口】実海岸樹Native TECH PASS／画面ART REJECT

現行隔離研究枝 `research/k4bv-real-coastal-canopy-native-art-20261104`。[**K4BV最終実Blender／全画像・SHA独立検査／同CHASE目視ART REJECT／K4BWへの反省と次工程**](docs/R19_A6P4_R2F5K4BV_REAL_CC0_COASTAL_CANOPY_ART_JA.md)を第一に読む。以下の「最新」「結果未確認」「未完成」は過去の履歴。

- [最終Actions #41813863791](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41813863791) は **completed/SUCCESS**。それ以前 #41803574543 / #41803979687 / #41813263091 / #41813606092 はすべて **FAILURE**、正式技術成功に含めない。最終は公式Poly Haven `island_tree_02` 1K GlTF＋全依存11ファイル（46,172,406 bytes）の元Vendor MD5／独立SHA確認後、実 **1,072,212 triangles** のNative Blenderメッシュ、9画像Packed、同CHASE 768×480研究画像1枚を生成・保存した。元の実K4BU Blender SHA256 `2536375f40e6a20e0061b80aba100c2469cfeacde814f4c127ff194201ba3064` に変更なし。
- [真正Artifact #13313382664](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41813863791/artifacts/13313382664) ZIP SHA256 `bb46f9ae2cc801046957f685408e08b7e109c9f980cb86618116cbd81d9cca7e`、CRC PASS、編集可能原本 `K4BV_ONE_GENUINE_COASTAL_CANOPY_EDITABLE_NATIVE_ART_HOLD.blend` SHA256 `7c28000ad1a75afb7f64958a6d48ec5ff205849c37d5a2878f17bdd1d2d4e1c4`、元CHASE画像SHA256 `390a2ca19cd98eba204f697c1f70532ca86ee77e504e4692c62d8a6c5244d665`、[本物の同Camera旧K4BU比較画像](docs/research-evidence/k4bv/K4BV_VS_K4BU_SAME_CHASE_TRUE_COASTAL_CANOPY_ART_REVIEW_NOT_GAME.png) SHA256 `ac5db3dfe01701ab48d15351841e4cf47c505bd2599c76718f582b7d2756a232`。ZIP原バイト独立再計算PASS。
- **実画像の作者ART判定はREJECT**。右の海岸樹は小型苗木より自然になったが画面全体の低品質は残存。中央を占める巨大灰色Road、ほぼ空白の海岸・空、生活感のない港、速度感不足。新木を大量増殖するより元CHASE1画面の港湾・自然地形・公共空間・遠景ランドマークの**統一された作者構図**が次K4BW最優先。低ポリ円錐や巨大な箱・灯台単体へ回帰禁止。
- 元Game Blob `af076d67492a677d2235e4730aef8cdf4808e106`／元B48 Road5 fingerprint `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`／B48実7道路・B51実28動体・240Hz・0.65m球・元6Cameraを保護。main、公式P101、Draft PR #46、本番2サイト保護。元真正Blender研究CameraはゲームWebGL2ではない。**正式ART採用0件、Slope2 DNA0m**。ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。追加課金0円、Work/Computer Use事前承認、ユーザーWindows操作0。

---

# 【K4BV最終実行記録・2026-11-04】公式実CC0海岸樹46.17MB取得検証PASS／Blender材質画像ロードHOLD

研究隔離枝 `research/k4bv-real-coastal-canopy-native-art-20261104`。[**K4BV真正素材ハッシュ・CI二度の失敗・未完成箇所・次工程**](docs/R19_A6P4_R2F5K4BV_REAL_CC0_COASTAL_CANOPY_ART_JA.md)を最優先。以下の「最新」「実行中」は履歴。

- [初回CI #41803574543](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41803574543)／[修正版CI #41803979687](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41803979687)ともに**FAILURE**。公式Poly Haven `island_tree_02` 1K native glTF+全依存11ファイル合計**46,172,406バイト**のVendor MD5/Bytesと独立SHA256は検証PASS。真Blenderはモデルimport成功したがVendor JPEG `island_tree_02_diff` のバックグラウンド画像`has_data=False`で安全停止。原因は**未断定**。実K4BV研究PNGや編集可能.blendはまだ作成なし。CI成功、美術改善、FPS改善と誤称禁止。
- 次は真Vendor JPEGの実ファイルSHAを維持したまま、Blenderの実Packed image byteと再読込を検証する最小材質修正。追加アセットなし／2枚高負荷レンダリングなし。配布元以外の代用品や画像の捏造禁止。
- 元K4BU真正Blender/元Game Blob `af076d67492a677d2235e4730aef8cdf4808e106`、B48 Road5指紋`f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、7Road/28Mover/240Hz/球0.65m/元6Cameraと本番・main・公式P101・Draft PR#46完全保護。正式ART採用0件／Slope2 DNA0m／HUMAN/SAT/CCD/FPS/RELEASE/MERGE HOLD。Work事前承認、追加課金0円、ユーザーWindows操作0。

---

# 【2026-11-04 K4BV実制作・真正海岸樹1本のネイティブ検証】

**現行の研究隔離枝** `research/k4bv-real-coastal-canopy-native-art-20261104`。[**K4BV実在CC0海岸樹・本物のモデル取得とCHASE 1フレーム美術試験**](docs/R19_A6P4_R2F5K4BV_REAL_CC0_COASTAL_CANOPY_ART_JA.md) を先に読み、次にK4BU最終正本、K4BT投影診断、K4BS地表正本へ遡ること。以下の「最新」は過去の履歴。

- 元K4BU [Actions #41801261499](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41801261499)は**TECH PASS／同CHASE画像ART REJECT**、小型苗木の枝葉は依然疎。正式ART0件、Slope2 DNA 0m。
- K4BVは公式Poly Haven CC0 **Island Tree 02**（松とは断定しない）の1K glTFと依存をサイズ制限内で実取得・MD5/SHA証明し、元K4BU Blender原本を固定読込、元8本の松を研究画像だけ非表示、風に耐える横広がりの海岸樹1本を同CHASEへ安全配置。本当のBlender EEVEE 768×480 1枚・編集可能Native.blend・SHA・同Camera旧新比較で評価。追加モデルの大量導入／高価な2枚レンダリングを繰り返さない。
- [**K4BV実行CI #41803574543**](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41803574543)は**結果未確認、PASS宣言禁止**。NativeImportが成功しても実画像を見てARTが不合格なら正式採用0件を維持。
- 元Game Blob `af076d67492a677d2235e4730aef8cdf4808e106`、B48 Road5 fingerprint `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、元6Camera、実B48 7本/B51 28体/240Hz/球0.65m/本番保護。main、公式P101、Draft PR#46、本番2サイト不変更。Work/Computer Useは事前承認、追加課金0円、ユーザーWindows操作0。ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。

---

# 【2026-11-04 K4BU最終確定・次K4BVへ】本物のBlender針葉樹1本の位置/植え込み修正TECH PASS・ART REJECT

**最終隔離研究枝** `research/k4bu-upright-pine-single-frame-art-study-20261104`。[**K4BU最終実Blender原本/全SHA・同CHASE実画像の美術REJECT・K4BVの作者方針**](docs/R19_A6P4_R2F5K4BU_UPRIGHT_NATIVE_PINE_SINGLE_FRAME_ART_JA.md)を先に読む。以下の「最新」「未確認」はすべて履歴。

- 真正[最終Actions #41801261499](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41801261499) は **completed/SUCCESS**。初回 #41800959567 はK4BSの木が半分地面に埋まる問題を修正したため**CANCELLED**。元真正K4BS Blender SHA256 `156e56ce373b731f1f0c8f96278a11977ac93d491973c2e8ef796ec1ea7795de` の実アセットを読み、元Game/Road/Camera変更0、元実木398,144tri×共有8本。実木0のGLTF主軸を鉛直に補正、道路前方 d=66m／Road横 s=-26m、実BBox下端地表+0.15m。**旧画像外→画面内BBox幅32.627px×高さ106.078px（旧1280×800換算）**、真正Eevee同CHASE768×480研究PNG1枚を取得。ただしBBoxは葉の実可視面積の証拠ではない。
- [Artifact #13307768050](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41801261499/artifacts/13307768050) ZIP SHA256 `77a333b09e975836bb5e17117b42067b390dff0d8f001fd79a108bb6ae7f1df0`、全CRC PASS、編集可能`.blend` SHA256 `2536375f40e6a20e0061b80aba100c2469cfeacde814f4c127ff194201ba3064`、元CHASE PNG SHA256 `57972945e3ddeea0ebb78364059fb47c8782cd738cbe6557c151e5255ecbbcf9`、[同CHASE旧新比較画像](docs/research-evidence/k4bu/K4BU_VS_K4BS_SAME_CHASE_ONE_NATIVE_UPRIGHT_PINE_ART_REVIEW_NOT_GAME.png)。すべて独立コンテナでZIP実バイトのSHA検証合格。
- **本物の画像美術ART REJECT**。木の細い姿は画面右に現れたが、疎な枝・弱いシルエットで自然な成木の樹冠には見えない。道路は依然広大な灰色の上り直線、港湾と自然と公共空間は空白が多く世界水準から遠い。**正式ART採用0件／Slope2 DNA0m**。技術PASSは美術合格の証明ではない。
- **次K4BV**：元`pine_sapling_small`を8本に機械複製・2枚高負荷レンダリングしない。真正自然樹冠のアセット/作者配置/最低限の実見た目検証→同CHASE1画面の高品質港湾・海岸の実作者設計。1画面ART合格まで他6道路展開なし。元Game Git Blob `af076d67492a677d2235e4730aef8cdf4808e106`、B48 Road5 fingerprint `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、7実Road/B51 28体/240Hz/球0.65m/元6Camera厳守。main、公式P101、Draft PR#46、本番2サイト変更禁止。HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。追加課金0円、Work/Computer Use事前承認、Windows操作0。

---

# 【2026-11-04 K4BU実制作・K4BT真正投影から1本だけ向きと位置を実Blender低負荷検証】

最新の独立研究枝 `research/k4bu-upright-pine-single-frame-art-study-20261104`。[**K4BU真正CC0松の長軸/画面外配置を修正する最小1画像美術試験**](docs/R19_A6P4_R2F5K4BU_UPRIGHT_NATIVE_PINE_SINGLE_FRAME_ART_JA.md)を第一に読み、次に[K4BT真正Screen投影診断](docs/R19_A6P4_R2F5K4BT_NATIVE_PINE_CAMERA_PROJECTION_DIAGNOSIS_JA.md)、K4BS写真地表と木の正本を参照。下の旧「最新」は履歴。

- K4BT Actions #41799311517は**SUCCESS**：元真正8本の研究GLTF松のうち3本はカメラ画像外、5本は投影BBoxが画面内。BBox≠実の木の視認画素。実木0の見かけの幅が高さより大きいため、アセットの向きも再検討。
- K4BUはオフスクリーンの**木0のみに**、元CC0 GLTFの長軸を鉛直に立てて一様な樹高に正規化し、元CHASE Cameraで画面内投影BBoxを評価する限定改修。実Blender **768×480 1枚のみ**＋編集可能原本をGitHub Actions Artifactで取得する。新素材なし・元Road5/元6Camera変更なし。
- [K4BU初回GitHub Actions #41800959567](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41800959567) は本記述時点で結果未確認。実画像とCI結果を確認するまでは技術成功や視覚改善を断定しない。
- main、公式P101、Draft PR#46、本番2サイト不変更、正式ART0件、Slope2DNA0m、ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。追加課金0、ユーザーのWindows操作0、Work/Computer Use事前承認。

---

# 【2026-11-04 K4BT研究継承・Native木の投影診断／ART REJECT継続】

**現行隔離研究枝** `research/k4bt-native-pine-camera-projection-gate-20261104`。最初に[**K4BT真正K4BS原本から実松のカメラ投影bbox・不変保護・次工程K4BUへの分岐**](docs/R19_A6P4_R2F5K4BT_NATIVE_PINE_CAMERA_PROJECTION_DIAGNOSIS_JA.md)、次に[**K4BS真正Native原本と元CHASE画像の美術REJECT**](docs/R19_A6P4_R2F5K4BS_PINE_PHOTO_VEGETATION_ART_JA.md)を読む。以下の「最新」は過去の履歴。

- K4BS最終Actions #41795056558は**completed/SUCCESS**、本物のBlender/草/39.8万tri実松8本の技術PASS。ただし木の実画面可視性・巨大な空白・単調道路は**ART REJECT**。
- K4BTでは**K4BS正本BLEND SHAをロックしたまま**、元同CHASE研究Cameraで8本の木のdepsgraph実ジオメトリ投影bbox/画面面積・画面内外を診断し、旧真正画像に輪郭枠のみを上書き。**新規重いレンダリング・有料API・ゲーム変更・原本変更なし**。投影BBoxは葉の実際の可視ピクセル/alpha/遮蔽の証明ではない。
- [K4BT初回Actions #41799311517](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41799311517)は**この文書追記時点で結果未確認**。成功・失敗・計測結果を事実として再取得してから次へ進む。重いQA増殖をしない。
- main、公式p101、Draft PR #46、本番、元B48 7道路/B51 28体/240Hz/球0.65m/6Camera/元Game Blob/Road5 fingerprintを完全保護。正式ART 0件、Slope2 DNA 0m、ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE HOLD。Work/Computer Use事前承認。

---

# 【2026-11-04 K4BS最終正本・K4BTへ継承】実CC0草+39.8万tri針葉樹Native TECH PASS／画像ART REJECT

最終研究隔離枝`research/k4bs-photo-vegetation-art-direction-20261104`。まず[**K4BS真正Blender原本・全MD5/SHA・実同CHASE画像の美術REJECT・K4BTへの反省**](docs/R19_A6P4_R2F5K4BS_PINE_PHOTO_VEGETATION_ART_JA.md)を読む。以下の旧文書/見出し「最新」はすべて履歴。

- **TECH成功の根拠**：最終[GitHub Actions #41795056558](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41795056558) completed/SUCCESS。初回〜第3回はFAIL、第4回と中間は長時間高密度レンダリングの合理的な条件変更でCANCELLED。[本物の編集可能Blender Native 2研究Camera PNG・旧K4BR同CHASEの中立比較・素材取得SHA JSON Artifact #13305631124](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41795056558/artifacts/13305631124)。ZIP実SHA256 `6c656bf29353b9f81ddb42dceaaa624c2bffd0e021f18c78f47be12bcdac2e71`、原本`K4BS_REAL_PINE_AND_ORGANIC_PHOTO_GROUND_EDITABLE_DCC_ART_HOLD.blend` SHA256 `156e56ce373b731f1f0c8f96278a11977ac93d491973c2e8ef796ec1ea7795de`。全ZIP CRC/Blender/PNG/比較/素材マニフェストSHAをコンテナでCIから独立検算・PASS。
- **実装した技術**：Poly Haven公式CC0の`sparse_grass` 2K実画像3マップを公式MD5/SHA照合し、元K4BR`rock_ground_02`写真材質と斜面2面各1456polygonsの**自然な連続マスク**に統合。旧人工矩形の草パッチは元Camera研究画像から消えた。実CC0`pine_sapling_small`1K glTF＋8依存ファイルをMD5/SHA実検証、**398,144三角形実モデル**をBlenderへimportして、研究専用8共有インスタンスを保存。元K4BQ低ポリ三角木・大きな形が破綻した模型建築・灯台は本研究画像だけRenderOFF、原本に残す。追加有料API0円・Work/Computer Use不使用。
- **美術ART REJECT**。最新の実CHASE研究カメラ画像では細かい高密度松が**樹木としてほとんど見えない**。Native import/8配置＝実画面での視認性ではない。巨大建築・灯台の非表示による**空と海岸の空白も増えた**。地面は若干改善したが、道路は巨幅の直線的平面、港・公共空間・自然・走行スピード感は世界級に全く届かない。正式ART採用0件／Slope2 DNA認定0m。Blender研究Camera、非ゲーム幅26.3m Roadを、元ゲームのWebGL2実画面や可走Road5と誤認禁止。
- **K4BTの固定制作方向**：新アセット大量導入を一旦停止し、**元CHASE研究Cameraに対して真GLTF木オブジェクトのカメラ投影BBox/視認ピクセル数・alpha/配置をまず低コスト1画像で計測**し、樹木が実画面に読めない原因をデータで解決。木が見えるようになる前に別モデル増殖・高負荷の2枚フルレンダリングを繰り返さない。次に空白の多い沿岸に本物の使われる港湾・海岸公共空間と地形の一貫した美術を実作者設計する。1画面の正式ART合格まで他6Road展開なし。
- **強制保護**：元Game Blob `af076d67492a677d2235e4730aef8cdf4808e106`、原B48 Road5 vertex-face fingerprint `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、B48 7本/B51 28体/240Hz/球0.65m/元Rig6Camera安全UI不変更。main、公式`p101-velocity-overdrive-native-trial`、Draft PR #46、本番2サイトを保護。ゲーム新Collider0、HUMAN/SAT/CCD/FPS/ART/RELEASE/MERGE全HOLD。追加課金0、Work事前承認、ユーザーWindows操作0。

---

# 【2026-11-04 K4BS 最新の実作業正本】実CC0草・松を取得、連続地表＋実モデルを実装・Blender負荷検証中

研究枝 `research/k4bs-photo-vegetation-art-direction-20261104`。[K4BS実CC0素材・地表遷移・松モデル・失敗と安全ゲートの記録](docs/R19_A6P4_R2F5K4BS_PINE_PHOTO_VEGETATION_ART_JA.md)を最優先。過去章の「最新」は履歴。

**取得・Source検証まで実PASS**：Poly Haven公式CC0`sparse_grass` 2K diffuse/normalGL/rough（メーカーMD5・実サイズ・独立SHA）、本物の1K`pine_sapling_small` native glTF＋全依存8ファイル（同じ独立ハッシュ照合）、追加API課金なし、公式ライブAPI利用表記あり。元Game git blob `af076d67492a677d2235e4730aef8cdf4808e106`、真Road5メッシュfingerprint `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、元Rig6/7本B48/28Mover B51/240Hz/球半径0.65m全保護。親K4BR編集可能原本SHa`7f229b9fbc0d736c056e1494f64192e64b7915f768a6fb38f05c87901229fa69`に変更なし。

**研究実装（技術ARTは未認定）**：`scripts/p101-k4bs-organic-cc0-ground-and-pine-art.py`、`scripts/p101-k4bs-fetch-cc0-vegetation.py`と専用Workflowに、左右の地表の矩形塗り分けを解除して実PBR写真岩/草を傾斜・連続ノイズで混ぜること、旧低ポリの木/巨大建物/塔を研究レンダーだけ非表示にし、CC0詳細3D松を共有メッシュの少数インスタンスで使うこと、同CHASE研究カメラで旧K4BRとのA/Bを取ること、元Camera値/元Road5指紋を真Blenderで確認することを実装。**ゲーム本体には統合なし、Blender画像は実ゲームではない**。

**実行結果を捏造しない**：[初回 #41793014896](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41793014896) は親Artifactの`render/`ディレクトリ誤認でFAIL、第2回[#41793241061](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41793241061)は素材実取得MD5/SHA PASS後にBlenderのマテリアルID短縮を見落としてFAIL、第3回[#41793514129](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41793514129)は研究地形IDの文字数切詰めを見落としてFAIL。修正版第4回[#41793831862](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41793831862)は14本高密度松のソフトウェアGL処理が長く、合理的な描画コストの範囲での本研究評価へ変更するためCANCELLED。さらに中間 #41795019967 もCANCELLED。**最新実行中 [CI #41795056558](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41795056558)** は樹木を左右各4本の実モデル共有インスタンス（8本）＋1280×800の2視点に抑えた改訂。現時点ではBlenderの実画像・ネイティブ原本の保存検証はまだ未完了、完了やART合格を断定禁止。

**次の事実確認**：最新CIがcompleted/SUCCESSかFAILか確定し、成功なら本Artifactの`.blend`、同CHASE写真比較PNG、実草材質連続マスクと実木モデルの三角数、元道路/Camera不変のSHA、ZIP CRCを独立確認。品質が悪ければ**ART REJECT**。正式ART0件・Slope2DNA0m維持。今後は旧い巨大な箱や追加の低ポリ木を大量生成しない。元B48/Cameraの正式改造、main/公式`p101-velocity-overdrive-native-trial`、Draft PR #46、本番2サイトは変更禁止。Work/Computer Useは事前承認、ユーザーWindows操作不要、実ゲームCollider0、ART/SAT/CCD/HUMAN/FPS/RELEASE/MERGE全HOLD。

---

# 【2026-11-04 K4BS実制作・最新研究正本】CC0実松と連続写真地表の自動取得・真正Blender画像検証

最新隔離研究枝：`research/k4bs-photo-vegetation-art-direction-20261104`。詳細設計・不変更保護は[**K4BS原本と本物の植生/地表素材を使った制作条件**](docs/R19_A6P4_R2F5K4BS_PINE_PHOTO_VEGETATION_ART_JA.md)を最優先。以前の「最新」は履歴。

- **直前K4BR**：[確定GitHub Actions #41790588687](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41790588687) completed/SUCCESS、本物のPoly Haven CC0写真材質と約20,174tri岩壁のBlender組込TECH PASS、真同研究CHASE画像は**ART REJECT**。編集可能親原本`K4BR_ACTUAL_CC0_PHOTOSCAN_ROCKS_EDITABLE_NATIVE_DCC_ART_HOLD.blend` SHA256 `7f229b9fbc0d736c056e1494f64192e64b7915f768a6fb38f05c87901229fa69`をロック。正式ART採用0件／Slope2 DNA0m。
- **K4BS真の作業**：Poly Haven公式CC0 `sparse_grass`の2K実Diffuse/OpenGL Normal/Roughと`pine_sapling_small` 1K実glTF+全依存を、ソース公式URL/MD5/実サイズ/SHA256照合で取得する（容量制限モデル総175MiB、単ファイル100MiB）。Blenderの元K4BR真正BLENDをロック読込し、左右K4BQ研究斜面の**各矩形ポリゴン単位の草/岩切替えを解除、自然な傾斜+3D noise連続マスクの写真PBRブレンド**に置き換える。元の低ポリ三角木と画面の上下を占める公共建築模型・灯台は削除せず本研究レンダーだけOFF。実松を高詳細のまま読み込めた場合だけ共有ジオメトリの最大14本研究配置。**元CHASE_NARROW複製研究カメラと前K4BRを全く同じ数値で旧新比較**し、元Camera複製のもう1画像と全SHA、実Blender原本を保存。High-poly木のLOD/FPSはHOLD、ゲームに統合不可。
- 初回[CI #41793014896](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41793014896) **FAILURE**：前親Artifact内の`render/`階層を見落とし、原本監査JSONのFileNotFoundで停止。源テストPASS、素材未取得。検証経路修正commit `a9ca4b5bb993ca6dd8ec704d5ff34881b42490d0`、修正版[CI #41793241061](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41793241061) は結果検査中。成功するまで外部素材や美術を導入済みと宣言禁止。
- **最上位目標**：世界水準の高速3Dレーシングゲーム全コース美術であり、単にPBR枚数/模型本数を増やすことではない。現在ART REJECT、正式ART0件／Slope2DNA0m。実BLENDの研究図はゲームWebGL2画面でも実安全な本番Road5でもない。
- **元ソース全保護**：本物のGame Git Blob `af076d67492a677d2235e4730aef8cdf4808e106`、元Source B48 Road5全頂点面fingerprint `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、B48 7Road/B51 28Mover/240Hz/ball radius 0.65m/元Rig6Camera値と安全UI、main、公式`p101-velocity-overdrive-native-trial`、Draft PR #46、本番2サイト不変更。Work/Computer Useは事前承認、追加課金なし、ユーザーWindows操作不要。新ゲームCollider0、ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。

---

# 【2026-11-04 K4BR最終確定・K4BSへの制作入口】実CC0 PBR/3D岩壁モデルの真正取得→Blender実装TECH PASS／美術ART REJECT

**現行最終隔離枝**：`research/k4br-cc0-phototexture-source-verified-20261104`。次の作業は[**K4BR実配布素材・全MD5+SHA・本物のBlender原本・比較画像・美術評価・K4BS制作原則**](docs/R19_A6P4_R2F5K4BR_CC0_SCAN_REAL_ASSET_ART_JA.md)を最優先で読む。それ以前の「最新」記事は履歴。

- **実装・検証成果**：[最終Actions #41790588687](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41790588687) **completed/SUCCESS**。最初[#41789921118](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41789921118)はPython引数で失敗、第2回[#41790126272](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41790126272)は実6 PBR +岩壁glTFと全依存4の実取得・公式MD5/独立SHA照合PASS後にUbuntu glTF importerのnumpy欠損で失敗、最終修正版は全部PASS。この失敗と修正も継承。
- **新実物アセットの証拠**：Poly Haven公式CC0[Asphalt 01](https://polyhaven.com/a/asphalt_01)と[Rock Ground 02](https://polyhaven.com/a/rock_ground_02)の2K実カラー/GL法線/rough各3点、[Rock Face 01](https://polyhaven.com/a/rock_face_01)本物の実3D岩壁glTF＋依存外部4点（各20,174tri、3か所に実ロード）。公式MD5/Bytes/独立SHAを全11ファイルで厳格検証し、Blender実メッシュとPBR packed imagesへ組み込み。同研究CHASEと元Camera同ポーズ複製の2画像＋旧K4BQ同CHASE比較を実レンダリング。**3D岩壁モデルが「写真測量で作られた」かは個別公式データで確証なし**、それは断定しない。ライブAPI UserAgentと`Powered by Poly Haven`を実施、追加有料API0円。
- [本物の最終Artifact #13303311443](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41790588687/artifacts/13303311443) ZIP SHA256 `208522d022cb24dda51c07bf0c63723ef472d18b84d2dad4fb36fce76c8291dc`、**編集可能Blender`K4BR_ACTUAL_CC0_PHOTOSCAN_ROCKS_EDITABLE_NATIVE_DCC_ART_HOLD.blend` SHA256 `7f229b9fbc0d736c056e1494f64192e64b7915f768a6fb38f05c87901229fa69`**、元画像2枚・同CHASE比較・素材の元URLとMD5/SHA JSONを実原バイトで独立再照合してZIP CRC/個別SHA全PASS。
- **美術ART REJECT、正式ART採用0件／Slope2 DNA正式認定0m**。実画像で実写由来の岩・舗装の微細材質は明確に見えるが、矩形緑色の地面、ローポリ三角木、大きな切れた建物、単独巨大灯台、薄い港遠景、巨大な単調直線のRoadが残り世界級ではない。物量と素材の実在≠品質合格。
- **K4BS固定次工程**：これ以上単純な柱/箱/木/塗装を増殖しない。最優先は写真材質を使った自然な**地面マスク/草の接続**、実LODを持つ配布元ライセンス確認済み3D樹木、近景巨大建築と灯台を構図から再設計、道路の本当に高級な視覚と速度感の全体デザイン。同CHASE_NARROW研究Cameraの実Blender比較で審査、良くなければART REJECTと正式ART0/DNA0m継続。実ゲームWebGL2の安全・FPSは未実証。
- **全ソース保護**：元Game Git blob `af076d67492a677d2235e4730aef8cdf4808e106`、Source B48 Road5全頂点・面fingerprint `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、B48実7/B51実28、240Hz/球半径0.65m、元Rig6カメラ・研究CHASEカメラ数値、main/公式`p101-velocity-overdrive-native-trial`/Draft PR#46/本番2URL不変。Work/Computer Use事前承認、Windows操作要求なし、実ゲーム新Collider0。ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。過去の公式原本や旧成功B48を改変しない。

---

# 【2026-11-04 K4BR 現行正本】実CC0写真素材＆真3Dスキャンの確実な入手・編集可能Blender実画像研究

**隔離研究枝**：`research/k4br-cc0-phototexture-source-verified-20261104`。最新[K4BR全体制作/配布元CC0とAPI利用条件/実アセット独立検証/美術ゲート](docs/R19_A6P4_R2F5K4BR_CC0_SCAN_REAL_ASSET_ART_JA.md)を先に読む。過去の「最新」は履歴。

- 前工程K4BQ：[真正成功CI #41783578592](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41783578592)、元Road5と6Camera保護、実Blender.blend＋同CHASE研究Camera PNGは技術PASSだが低ポリ模型美術**ART REJECT**。正式ART0件／Slope2DNA0m。
- **K4BR主方針**：単色の手続き的岩/路面と低ポリ植物の量産を主経路から離れ、Poly Haven公式CC0から本物の「Asphalt 01」「Rock Ground 02」の2K Diffuse／OpenGL Normal／Rough各3マップ、実3D岩壁「Rock Face 01」の1K glTF+全依存ファイルを無償で取得。メーカーMD5、Byte数、独立SHA256全一致が必須。ユーザーへの課金/API追加なし。公式APIの固有User-Agentと`Powered by Poly Haven`の利用元明示を実装。**まだ取得成功の保証はしていない**。
- 素材が本当に取れた場合だけ、親K4BQ正本の編集可能BLEND SHA `5fe3ed2569b807af0b04c46cd1672f83a1c93863a19e958c468369985bd60252`を保護ロードし、実写真PBRを道路・岩・路側石材へ接続して画像Packed、実スキャン岩壁を個別に編集可能な3D研究モデルとして3カ所に配置する。**元K4BP DのCHASE_NARROW研究Cameraと同じ数値でK4BQ/K4BR真正Blender A/B**を取得し、質を目視で判定。画像の単純な差分が出ただけではART PASS禁止。
- [初回CI #41789921118](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41789921118) はGit Source/親K4BQ source検証はPASS、Pythonダウンローダーの引数`--`誤要求で**FAILURE**、実素材取得・新Blender未作成。修正commit `6e385c3168bc557aaa6904ff15718517e5da3b6c`で通常Pythonの引数も受理。[再試験CI #41790126272](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41790126272) は実状態・Vendor API・SHA・本画像を確認する。成功前に完了と報告しない。
- **絶対保護**：元ゲームGit blob `af076d67492a677d2235e4730aef8cdf4808e106`、元Road5全頂点面 fingerprint `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、B48実7/B51実28/240Hz/球0.65m/元6Camera、main、公式`p101-velocity-overdrive-native-trial`、Draft PR#46、本番2サイト不変。Work/Computer Useは事前承認制、ユーザーWindows操作無し。元ゲームの新しいCollider0。正式採用ART0件／Slope2DNA0m、ART/SAT/CCD/HUMAN/FPS/RELEASE/MERGE全HOLD。
---

# 【2026-11-04 K4BQ 最終確定／K4BR実美術への正本入口】実DCC技術PASS、ポリゴン模型美術はART REJECT

**最新隔離研究枝**：`research/k4bq-geological-harbor-art-direction-20261104`。継続前に[**K4BQの実Blender原本・元Camera同一比較・美術不合格原因・K4BR本格材質転換**](docs/R19_A6P4_R2F5K4BQ_GEOLOGICAL_COASTAL_HARBOR_ART_JA.md)を最初に読む。K4BP以下の「最新」は履歴。

- **本物の最終CI成功**：[GitHub Actions #41783578592](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41783578592) completed/SUCCESS。[編集可能Blender原本＋真CHASE_NARROW／元Camera姿勢複製2研究PNG＋同CHASEのK4BP比較＋SHA JSON Artifact #13299639828](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41783578592/artifacts/13299639828)。ZIP SHA256 `c689da70ce749ad021083e6d6d13e3a4b7f367ef1424cba66a1a69e08f698717`、原本 `K4BQ_GEOLOGICAL_HARBOR_EDITABLE_RESEARCH_ART_HOLD.blend` SHA256 `5fe3ed2569b807af0b04c46cd1672f83a1c93863a19e958c468369985bd60252`。ZIP/各BLEND/PNG/比較実バイトSHA独立再検証済。元Source Road5頂点面/全6 Camera数値不変、Git source Blob・B48 7/B51 28原本を保護。
- **ART REJECT**：研究用CHASE×狭いRoadのD案で、旧灰色斜面を松/草/岩肌/海辺の建築と船・灯台を含む3D空間に変えたが、真正画像は低ポリゴンの三角形の松・不自然な石の反復・矩形の草・暗い単調な道路・模型的建築・白い遠景の広い空白が目立ち、**世界水準の超高速3Dレーシングゲームの美術には全く届かない**。技術PASS=美術PASSではない。正式ART採用**0件**、Slope2 DNA **0m**。
- **K4BRは同じ手続きメッシュ・Blender Noise・円錐/多面体物量の増殖を主経路に戻さない**。まず実ライセンス・実ダウンロードURL・原SHAを独立検証したスキャン由来のCC0 PBR素材・自然な3D岩/植物・立体の港湾人間スケールを1画面で本物の作者品質に仕上げ、元K4BP Dと同じCHASE研究Cameraの中立比較で判定。材料導入候補は公式Poly Haven `https://polyhaven.com/a/rock_ground`、ambientCGなど。ライセンスと実モデル取得/BLEND packが成功するまでは素材成功と主張しない。追加有料APIなし、Workは事前承認。
- **絶対保護**：本物のGame Git Blob `af076d67492a677d2235e4730aef8cdf4808e106`、原B48 Road5 mesh fingerprint `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、他6道路、B51元28、240Hz/球半径0.65m/元Camera6、main/公式`p101-velocity-overdrive-native-trial`/Draft PR #46/本番2サイトを変更禁止。K4BQ研究の26.3mロードは実ゲームの可走B48に非該当。新ゲームCollider0、HUMAN/SAT/CCD/FPS/RELEASE/MERGE/ART全HOLD。ユーザーWindows操作不要。

---

# 【2026-11-04 K4BQ 現在の研究正本】同CHASE研究Cameraで灰色斜面→実地形・海・生活する港の作者美術作り直し

新規隔離研究ブランチ `research/k4bq-geological-harbor-art-direction-20261104`。まず[**K4BQ真のBlender地形・建築・港湾・保護条件の制作正本**](docs/R19_A6P4_R2F5K4BQ_GEOLOGICAL_COASTAL_HARBOR_ART_JA.md)を優先。過去K4BP以下の「最新」は履歴。

- **親K4BP**：[最終Actions #41781600578](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41781600578) completed/SUCCESS。真編集可能.blend SHA `93c3583655eeb48fa06d61239646bb470419c72bf84cd97235be2288240d26aa`、4条件のカメラ×道路幅の実3D研究画像・JSON、元B48/元カメラ6不変更。美術は全4条件**ART REJECT**。相対的に改善したのはD（CHASE研究Cameraと独立新規幅26.2m研究道路）の1画面だが採用ではない。
- **K4BQ実制作**：上記K4BP editable.blendから、Dと**同一CHASE_NARROW研究Camera数値を一切変更せず**、左右の無地法面を細部の地層・細かな落石・草・ボリュームのある松・本物の港湾用小船2隻／杭のある公共港デッキ・ガラス展示室と銅屋根の海辺文化施設・灯台・沿岸遠景に作り直す。ロードも研究専用の細かなアスファルトと落ち着いた細い路線を作者仕様に変更。巨大で意味不明な橋や白い単調な壁を増殖しない。**すべて独立した編集可能なBlenderメッシュであり、ゲーム本体ではない**。真ImageGenの雰囲気画像で実ソース合格と偽装しない。
- [K4BQ BlenderネイティブCI #41783578592](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41783578592) 実行。実生成.blend、CHASE_NARROW実PNG、元Sourceカメラ数値同ポーズの研究別カメラ実PNGとK4BP DとのA/B、各SHAを検証し、研究ブランチにだけ保存。検証前のART PASS宣言禁止。
- **元全て保護**：Game Git blob `af076d67492a677d2235e4730aef8cdf4808e106`、真正B48 Road5メッシュ fingerprint `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、B48実7／B51実28/240Hz/半径0.65m/元全Camera6、安全UI、main、公式`p101-velocity-overdrive-native-trial`、Draft PR#46、本番2URLは不変。Work/Computer Use事前承認・ユーザーWindows操作不要。正式ART0件／Slope2 DNA0m。ART/SAT/CCD/FPS/HUMAN/RELEASE/MERGE全HOLD。新研究26.3m道路を元ゲームの安全なB48と混同禁止。

---

# 【2026-11-04 K4BP最終引き継ぎ／K4BQ制作入口】本物B48保護・Camera×道路幅の4条件研究PASS／美術ART REJECT

**最終研究隔離ブランチ**：`research/k4bp-camera-and-road-composition-study-20261104`。まず[**K4BP真正Blender 2×2比較・全GitHub実行・実画像美術判定・K4BQ制作条件**](docs/R19_A6P4_R2F5K4BP_CONTROLLED_CAMERA_ROAD_COMPOSITION_STUDY_JA.md)を読む。過去の「最新」はすべて履歴。

- [最終Actions #41781600578](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41781600578) は**completed/SUCCESS**、[真編集可能Blender .blend＋4条件の研究ネイティブPNG＋2×2比較2画像＋元Camera実投影JSON Artifact #13298834318](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41781600578/artifacts/13298834318)に保存。ZIP SHA256 `c629f226bfc477add3547af17726b8c3efed2b0ee65a49ec1e6ee800fd26ca7b`、Blender原本 SHA256 `93c3583655eeb48fa06d61239646bb470419c72bf84cd97235be2288240d26aa`、原4PNG/2比較/BLENDの全SHAとZIP CRCを独立再読込検証済。
- **真Camera×Road幅の公平な2×2研究比較**：[比較PNG](docs/research-evidence/k4bp/K4BP_FACTORIAL_SOURCE_CAMERA_X_SOURCE_ROAD_VS_CHASE_X_NARROW_NON_GAME.png)：左上 ORIGINAL SOURCE CAMERA＋ORIGINAL B48 Road5（正本）、右上CHASE研究カメラ＋元B48、左下元Cameraと数値同じ複製＋**独立新規幅26.2m研究Road**、右下CHASE複製＋独立幅26.2m研究Road。元Road5が研究画面で非表示の時も頂点/面データは不変・元Camera全6の位置回転レンズ不変。研究Roadは走行可能なゲームCollisionではなく、採用も安全も未承認。
- 実測投影：Source Control11307のd70→170mの画面高さは**3.1957%**、CHASEは**7.4624%**、港側斜め研究Cameraは**12.8206%**。しかし港側Bは近距離Roadのうち5/13点が画面外で、追従ゲームCameraにそのまま採用できない。研究別Road C＋Dは元Camera/CHASEの数値投影とそれぞれ完全一致。これは高級ゲーム美術の合否ではない。
- **世界水準のARTは全4案 REJECT**。追従＋狭い別RoadのDが相対的には最も分かりやすい走行構図だが、灰色の巨大な斜面、モデル風の建物、海と港の不可読性、素材・自然・生活感の大幅不足。正式ART採用0件・Slope2 DNA認定0m。実ゲーム画面ではない。
- **K4BQの固定方針**：K4BP Dの構図を採用候補ではなく**高品質な美術研究の出発点**として、作者による細密な景観・高解像度物理材質・使われる埠頭や海岸・自然地形を1枚から本当に制作する。「箱・柱・屋根・線をもっと量産」しない。同一研究Cameraの写真比較→ART判定。採用前に現ゲームの全部の物理/安全影響の別検証を要求し、現在の元B48コースやCameraを変更しない。
- **強制不変**：ゲームgit blob `af076d67492a677d2235e4730aef8cdf4808e106`、元Road5 source指紋 `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、元B48全7／B51全28・240Hz・球半径0.65m・元Camera6／main／公式`p101-velocity-overdrive-native-trial`／Draft PR#46／本番2サイト保護。Work/Computer Use事前承認制。ユーザーWindows操作0。HUMAN/SAT/CCD/FPS/ART/RELEASE/MERGE全HOLD。

---

# 【2026-11-04 K4BP 実構図比較の新正本】元B48／元カメラを保持し3つの独立仮説を実Blender比較

**最新研究隔離枝**：`research/k4bp-camera-and-road-composition-study-20261104`。まず[**K4BP全体方針・4画面の条件と安全境界**](docs/R19_A6P4_R2F5K4BP_CONTROLLED_CAMERA_ROAD_COMPOSITION_STUDY_JA.md)を読む。過去K4BO以下の「最新」は履歴。

- これまでのK4BOで**本物のSource Camera Control11307とSource Road5の遠近圧縮**（d70〜170mが画面高さの約3.2%）を実測。真Blender DCCはTECH PASSだが**ART REJECT**。正式ART採用0件・Slope2 DNA0m。箱・屋根・リングの増殖を主経路にしない。
- K4BPでは元真正K4BO原本`K4BO_EDITABLE_GROUND_TRUTHED_VELOCITY_DCC_HOLD.blend` SHA256 `b546174d5ae5186015981f2d6b5ee40f823cb7a4f2f9ba33f07c2bbda84264e6`を厳密取得し、`scripts/p101-k4bp-authentic-camera-composition-study.py`にて3つの独立研究：**A／元Road5での低い追従カメラ複製、B／元Road5での港側からの斜め俯瞰カメラ複製、C／元Control Cameraの数値が完全に同じ複製と、新規純研究用幅26.2m（＋両肩）の別Road美術**。純研究Road Cでは元B48 Road5を**その画面に限って非表示**、元メッシュは削除も編集もしない。4条件の比較（元Source ControlのK4BO原画＋3条件）と元Road5カメラ投影数値をGitHubに保存する。別カメラ・別Roadの成功は元ゲームの成功と絶対に呼ばない。
- [実GitHub Actions #41780866652](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41780866652) の各ステップ、真画像、編集可能BlenderとSHAを確認後にTECHおよび美術評価を更新。**初回の最新状況は実検証中**、ART合格未認定。
- **固定保護**：source Game git blob `af076d67492a677d2235e4730aef8cdf4808e106`、元Road5 mesh fingerprint `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、B48原7本／B51実28体／240Hz／球半径0.65m／元Source Camera 6とそのポーズ・全ゲーム操作・安全UI、main、公式`p101-velocity-overdrive-native-trial`、Draft PR#46、本番2サイト変更なし。Work/Computer Use事前承認、ユーザーWindows操作不要。ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。正式ART0／DNA0m。

---

# 【2026-11-04 K4BO最終確定・K4BPへの第一入口】Source Camera 実測による構図の制約発見／TECH PASS・ART REJECT

**現行最終研究ブランチ** `research/k4bo-camera-frustum-track-art-20261104`。まず[**K4BO真正DCC・Source Camera数値実測・最終美術REJECTと次工程条件**](docs/R19_A6P4_R2F5K4BO_CAMERA_FRUSTUM_RACING_ART_JA.md)を読む。従来のK4BN以下「最新」はすべて履歴。

- [最終CI #41779198031](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41779198031) **completed/SUCCESS**。[本物のNative editable.blend、元Camera control11307/ultra11341 2PNG、旧K4BNと同Camera二視点A/B、RGBA塗装と真元Camera screen投影JSON Artifact #13298312331](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41779198031/artifacts/13298312331) を全SHA/ZIP CRC独立再検証。ZIP sha `e834e6c0254a5da12994d74ed9fbd6383ce23ce56e9d7857600878ef7fc8b472`、真Blender SHA `b546174d5ae5186015981f2d6b5ee40f823cb7a4f2f9ba33f07c2bbda84264e6`。
- 初の**実Blender source Camera画面投影**：Camera前方のRoad5中線d=10mが画面最下から0.120、d20mが0.393、d40mが0.543、d70mが0.607、d170mが0.639（Y=0最下、1最上）。**d70m〜170mの約100mの遠近が画面高さのわずか0.032に詰まる**。路面の大面積、港が見えない原因の一部を数値で確定。lower-roadの真画像RGB差分平均はcontrol7.3327、ultra3.4632→描画可視性PASS、ただし芸術性の証明ではない。
- **実画像ART REJECT**：大きいレース塗装と低いアートフィンは表示できたが、路面が巨大、建築は長い人工壁、遠景船/港のシルエットは薄く、高速ゲームの世界級アートにならない。**正式ART採用0件／Slope2 DNA認定0m**。Blender DCCの絵であってゲームWebGL2の画像ではない。
- **K4BPの開発固定条件**：これ以上窓・箱・線・文字を増殖しない。現状のSource CameraとRoad5の構図制約が大きいため、**元Cameraのデータは一切変更せず**研究用に別カメラや別Road案を独立生成し、元Camera/元Road条件と別カメラ/別美術仮説の画像を正しく区別して比較する。「変更した研究カメラの良い画像」を元CameraのART PASSと偽装せず、公式ゲームの採用・merge前に美術/SAT/CCD/FPSを個別認証。依然として既存元Camera/道路の本番値は変更禁止。
- **強制保護**：元ゲームgit blob `af076d67492a677d2235e4730aef8cdf4808e106`／元Source Road5頂点面fingerprint `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`／B48元7道路／B51元28動体／240Hz／球半径0.65m／元全6Camera／安全UI、main／公式`p101-velocity-overdrive-native-trial`／Draft PR #46／本番2URL不変。Work/Computer Useはユーザーの事前許可、Windows作業要求なし。HUMAN/SAT/CCD/FPS/ART/RELEASE/MERGE全HOLD。

---

# 【2026-11-04 K4BO最新実作業】元Road5の画面投影実測・視認されるレース路面意匠

**現行隔離研究枝**：`research/k4bo-camera-frustum-track-art-20261104`。[K4BO元Camera実測・オリジナル道路ペイントと保存条件](docs/R19_A6P4_R2F5K4BO_CAMERA_FRUSTUM_RACING_ART_JA.md)が最新の企画と検証入口。以前のK4BN以下の「最新」は履歴。

- **前工程確定**：K4BN [CI #41771580365](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41771580365) completed/SUCCESS、真正Blender元カメラ画像と全sha再検証。**ART REJECT**：元Cameraが広いRoad5前景を写すのに、塗装の主役が先に小さく、港の船も隠れる。正式ART採用0件、Slope2 DNA0m。
- **K4BO実実装**：真Blender元Road5の道路中心/左右端d=-20〜+170mを`world_to_camera_view`で各元control11307 Source Camera画面座標へ投影して、塗装が本当に見える位置へ原作者の扇形速度意匠・セクターガイド・マリンシアン/琥珀のペイントを2048×4096元PNGとして配置。真正K4BN親編集可能.blendをSHA256 `fb98af8bccb84c9a6eaf18cabc8444135c5df99df267a5a7562c99c1fbe96a37`で開き、元Road5の**shaderだけ**にpacked original image重ね塗り。近景の本道路端に実Raycastした細い鋼材・光ガイド研究オブジェクトを左右7本ずつ生成。以前の巨大柱/橋/箱を追加しない。ゲームCollider・Road5頂点/面・元Camera値は変更しない。
- [K4BO初回CI #41779198031](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41779198031) を実行。状態・Artifact・真Blender・2画像・独立SHAを確認してからSOURCE/DCC技術PASSを認定。**実画像の美術評価は未確定**。TECHはARTではなく、悪ければART REJECT。
- 不変：ゲームgit blob `af076d67492a677d2235e4730aef8cdf4808e106`、元Road5 fingerprint `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、B48実7道路／B51実28体／240Hz／球半径0.65m／元6Camera数値、安全表示、main・公式p101・Draft PR #46・本番2URL。Work事前承認、ユーザーWindows操作要求なし。ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。他6Road横展開とゲーム統合は禁止。

---

# 【2026-11-04 K4BN最終確定】実Source Camera／Blender SOURCE TECH PASS・ART REJECT

最終隔離研究ブランチ`research/k4bn-track-surface-harbor-silhouette-20261104`。次工程は[K4BNの実技術結果と目視美術REJECT、K4BO制作原則](docs/R19_A6P4_R2F5K4BN_RACE_TRACK_AND_WORKING_HARBOR_ART_JA.md)を最優先。以前の「最新」は履歴。

- [最終CI #41771580365](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41771580365) **completed/SUCCESS**、[完全Blender artifact #13295356720](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41771580365/artifacts/13295356720)、真正Blend sha`fb98af8bccb84c9a6eaf18cabc8444135c5df99df267a5a7562c99c1fbe96a37`、元Road5/Cameras/source不変、2枚の元Camera EEVEE画像とRGBA道路ペイントを生成、実ZIP/全Sha独立再検証。
- **ART REJECT**：レース塗装と荷役クレーンの小型シルエットは見えたが、路面画面占有が巨大、背景船体は道路の陰、左右の大建築は模型的。正式ART採用0件、Slope2 DNA正式認定0m。実Blender DCCはゲームWebGL2実画面ではない。
- **K4BO**：d=-65m以遠にほとんど模様がなかったという真の路面視野位置問題を調べ、カメラに見える前景面と港湾シルエットの作者制作へ切り替える。元Cameraをこっそり動かした虚偽合格は禁止、ゲーム改修・他6Road展開は禁止。
- 元ゲームGit blob`af076d67492a677d2235e4730aef8cdf4808e106`、Road5`f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、元B48実7/B51実28/240Hz/球半径0.65m/元全Camera、main/公式p101/Draft PR#46/本番2URL不変。Work事前承認、ユーザーWindows操作なし。ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。

---

# 【2026-11-04 K4BN 現行研究の正本入口】Road5舗装画像のオリジナルレース意匠＋実船港シルエット／元Camera固定

最新隔離研究ブランチ：`research/k4bn-track-surface-harbor-silhouette-20261104`。従来K4BMの美術REJECTを必ず継承し、[K4BNの元Road5正本保護と一画面作者美術・真正画像評価](docs/R19_A6P4_R2F5K4BN_RACE_TRACK_AND_WORKING_HARBOR_ART_JA.md)を最優先で読む。旧K4BM以下の「最新」見出しは履歴。

- **従来の最大問題**：control11307／ultra11341の元走行カメラでは、画面の下半分以上が巨大な単調路面、遠景は港の存在を読めない模型。K4BMは真UV付きBlenderの技術PASSでも**ART REJECT**。正式ART採用0件、Slope2 DNA0m。
- **K4BN実制作**：研究専用Pillowオリジナル`HYPER RUSH／QUAY05／SECTOR05`の2048×4096透明走行塗装アトラスを元Camera相対実道路座標へ投影し、既存Road5の手続き的マテリアルと合成。道路原メッシュ、実ゲームShader/当たり判定不変更。さらに元Road5のd=188.774mの向こうに、編集可能な実船体・操舵室・艤装、荷役トラスクレーン2基、現実的な海岸線とサイドの低いレース誘導を作者制作。旧K4BM採用不可の遠景だけRenderOFF、元の研究原本は保存。
- 初回[CI #41770726727](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41770726727)は**completed/FAILURE**。元ゲーム/親K4BM.blendのSHA、Source Nodeテストとオリジナル塗装アトラス作成はPASSしたが、Blenderのオリジナルクレーン関数内で1つの物体生成がスコープ外になった`NameError(height_m)`で停止。研究コードのみ修正commit `a0404e60a6ec69717f7701f74bd91d21441079ee`、[再試験CI #41770899381](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41770899381)を実行中。新画像と編集可能.blendのSHAと実CI結果は厳密照合後に報告し、失敗を成功と呼ばない。
- **引き続き保護**：元Git game blob `af076d67492a677d2235e4730aef8cdf4808e106`、真正Road5 vertex/face fingerprint `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、B48元7／B51元28／240Hz／球0.65m／元Camera全6数値／元操作・安全UI完全不変。main、公式`p101-velocity-overdrive-native-trial`、Draft PR #46、本番2URL保護。Work/Computer Useは事前承認、ユーザーWindows操作不要。
- **ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGEは全HOLD**、正式ART0件／Slope2DNA0m。実DCC画像はWebGL2の本ゲーム画像ではなく、真正の走行の安全性、28実動体クリアランス、プレー性能を証明しない。見栄えの悪いものはART REJECTを維持し、他6Roadへ展開／本番反映／main merge不可。

---

# 【2026-11-04 K4BM 最終正本】本物の作者UV・材質研究TECH PASS／ART REJECT

**最新研究継続枝**：`research/k4bm-uv-pbr-authored-hero-20261104`。K4BM実行・検証・目視美術判定・今後の制作条件は[**K4BM全監査文書**](docs/R19_A6P4_R2F5K4BM_NATIVE_UV_PBR_ART_JA.md)を最優先。過去K4BL以下に「最新」と書かれていても履歴。

- **実技術最終判定SOURCE/BLENDER_UV_PASS**：[Actions #41757027430](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41757027430) はcompleted/SUCCESS、Blender 4 EEVEEで元Camera control11307/ultra11341の2枚を真レンダリング。真正[Artifact #13288142972](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41757027430/artifacts/13288142972) ZIP SHA256 `1a394c2649f109dc4f360f1fb52539cfca5731555fc0f3d63666c4b2d30aed21`、編集可能BLEND 39,880,852B sha `7297b0ea17ffacb7f2c84cecf901947ce11de4e0a91ff4c93703f43cbe7b4a80`。実UVを備えた独立研究メッシュ296件、同じCameraの旧K4BLとのA/B画像、SHA JSONをGitHub保存・独立ZIP全CRC/全sourceファイルSHA再検証済み。
- **真正画像の美術判定ART REJECT**。UV/道路粗さ・窓枠・ガラスは技術改善、遠景の大型単純柱は第2修正で除去した。しかし両真Cameraで路面が画面の大半、遠景は薄く空白が大きい。世界水準の高速3Dレーシング美術に全く届かない。正式ART採用**0件**、Slope2 DNA正式認定**0m**。新研究DCCをゲーム正式採用としない。これは**実WebGL2ゲーム画面ではない**。初回[CI #41756146305](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41756146305)はPython変数参照ミスでFAIL、初回成功[CI #41756329982](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41756329982)の美術もREJECT、最終 #41757027430まで失敗と反省を記録。
- **K4BN次工程の固定計画**：単純な箱/屋根/柱を多産する方法に戻らず、実ゲームSource Cameraで実際に見える**道路の素材／コース造形と近景、遠景の港の用途・自然地形・レース速度の表現**を高密度作者制作で完成する。ARTとゲーム機能・安全/FPSは別検査。美術正式承認前に他6Road横展開やゲーム統合、本番公開をしない。必ず元CameraのDCC画像と可能なら実WebGL2撮影を別々に監査。
- **不変更契約**：元ゲームGit blob `af076d67492a677d2235e4730aef8cdf4808e106`、真Road5 mesh fingerprint `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、B48実7／B51実28／240Hz／球0.65m／元Camera6の全部／操作・安全表示不変。main／公式`p101-velocity-overdrive-native-trial`／Draft PR #46／本番2サイト保護。Work/Computer Useは事前承認、ユーザーWindows操作不要。ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。

---

# 【2026-11-04 K4BM 最新継続入口】原物Road5＋Sourceカメラ・手成形実UV/PBR美術制作

本研究継続ブランチ：`research/k4bm-uv-pbr-authored-hero-20261104`。次の作業では最初に[K4BM新作者メッシュ／UV-PBR／制作ログと厳格美術判定](docs/R19_A6P4_R2F5K4BM_NATIVE_UV_PBR_ART_JA.md)を読むこと。過去K4BL以下の「最新」は履歴。

- **前K4BL**：真実のSource Camera 2枚とBlender .blendのSHA／元Road5 geometry検証済み [#41751060525](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41751060525) completed/SUCCESS、ただし実画像の美術評価は**ART REJECT**。正式採用ART0件、Slope2 DNA0m。
- **K4BM実制作**：新`scripts/p101-k4bm-authored-uv-pbr-coastal-hero.py`で、元K4BL編集可能BLEND（SHA256 `220855d6500a74697e41b9bad36cb5c20654ea77d8c8a4be48d5ebf9a4ab2488`）を厳密読込。元Source Road5メッシュ実測9地点と全6 Camera固定。旧不採用ARTを消さずRenderOFF。道路面の細かい骨材と粗さ、石材／陶板／銅色の**作者UVとマテリアル**、実3Dの建築奥行き・海岸地層、公共室内・港湾遠景を手作り構造で制作する。
- [初回CI #41756146305](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41756146305) は植栽の未定義変数`R`で**失敗**。研究コード修正commit `3841be073af6edfad77912974fa03c255d5fde0e`、[再試験CI #41756329982](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41756329982) を実行中。必ず**最新 run 状態と新原本.blend・元Camera control11307/ultra11341実PNG・SHA・実UVマップを検証してから**技術PASSを記録し、画像を直接見てARTを判断。CI passはART passではない。新DCC画像は**実WebGL2ゲーム画像ではない**。
- 固定不変：ゲームBlob `af076d67492a677d2235e4730aef8cdf4808e106`、Source Road5 mesh fingerprint `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、B48元7/B51元28/元Camera6/240Hz/球半径0.65m/安全表示・物理。main／公式p101／Draft PR#46／本番2サイト保護。Work、Computer Useには事前個別承認。ユーザーにWindows操作要求なし。
- 正式ART採用0件・Slope2 DNA認定0m。ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGEはHOLD。ART合格前の他6Road横展開・ゲーム本体移植は禁止。

---

# 【2026-11-04 K4BL FINAL 正本】元Road5/CAM源保護・港湾美術TECH PASS／ART REJECT

継続する**最新隔離研究ブランチ**：`research/k4bl-harbor-atmosphere-art-reconstruction-20261104`。必ず[2026年11月4日・K4BL本物の編集可能Blender画像・CI・全反省・次工程K4BM美術制作転換](docs/R19_A6P4_R2F5K4BL_COASTAL_HARBOR_ART_DIRECTION_JA.md)を最初に読む。過去K4BK以前の見出しにある「最新」は履歴。

- **最終K4BL TECH**：[Actions #41751060525](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41751060525) completed/SUCCESS。EEVEEネイティブBlender本物DCC、元source Camera control11307/ultra11341の画像二枚、前K4BK同位置A/B比較、全SHA実検証・研究枝GitHub保存PASS。真[Artifact #13286275694](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41751060525/artifacts/13286275694)、ZIP SHA256 `cdcd49068a837e68d155b01824c720f216edeb3c50abe17919e90bc4c9b41b12`、編集可能.blend 36,684,824B SHA `220855d6500a74697e41b9bad36cb5c20654ea77d8c8a4be48d5ebf9a4ab2488`。
- **美術最終判定：K4BL ART REJECT**。実画像は旧巨大横断梁が消えて見通し改善、路面の色とノイズが改善したが、路面の画面占有が非常に大きく、左右は薄い巨大屋根、遠景は単純な塔＋白い空虚な水平線、港の海・生活・地形の読み取れる情報が不足。3D看板は一部見切れ／建物に隠れる。**世界水準の完成として扱わない**。正式ART採用0件、Slope2 DNA正式認定0m。
- 旧中間[CI #41749501857](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41749501857)はLinux libEGL欠落でFAILURE、[CI #41749843377](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41749843377)は次の修正でCANCELLED、初回修正版 #41749970400はSUCCESSだがART REJECT、第2修正版[CI #41750596888](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41750596888)は未定義Blender材質でFAILURE、最終 #41751060525 で修正成功。失敗を成功と呼ばず、実作品を継承。
- **K4BM次工程**：旧大きな箱／長い波型屋根／安価な色塗りのプログラム生成を停止。実寸Road5と元Camera6の完全不変を前提に、本物のUV・高精細PBR・実公共空間を持つ作者メッシュ・海岸地形・港湾機能・遠中近景・ドラマのある照明を、高品質なヒーロー一画面で先に完成させる。**承認されるアートが出るまでゲーム統合/他6Roadへの展開を許さない**。実WebGL2同元CameraフレームとSAT/CCD/FPS/HUMANは未検証。
- 凍結元Game git blob `af076d67492a677d2235e4730aef8cdf4808e106`、本物Road5 mesh fingerprint `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`。B48元7・B51元28・240Hz/球半径0.65m・元6Camera・安全表示不変、main/公式p101/Draft PR#46/本番2サイト保護、Work事前承認、ユーザーWindows操作不要。ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。

---

# 【2026-11-04 K4BL 現在の作業入口】Road5実寸の港湾景観ART-FIRST全面改修

**継続研究ブランチ**：`research/k4bl-harbor-atmosphere-art-reconstruction-20261104`。[今回の上位方針・実制作コード・厳密な美術受入・真正CI実行記録](docs/R19_A6P4_R2F5K4BL_COASTAL_HARBOR_ART_DIRECTION_JA.md)を最初に読む。

直前K4BKは本物のsource Road5測量9断面とBlenderネイティブDCC技術PASS・**ART REJECT**。正式採用0件／Slope2 DNA0m。薄い橋や前景の巨大壁、単調な灰色道路と水平線が主な問題。単純な箱増殖を繰り返すな。

K4BLでは旧K4BK/BJ/BI/BH不採用美術レイヤを保持したまま描画のみOFF。真Road5をBlender内でRaycastしたCamera相対d,s,zで近景を低い海岸路側と植生・中景を公共図書館とフェリーターミナル・遠景を港湾都市、観測塔、船用クレーン、海と崖の地形として制作した。目標は**画面全体のビジュアル**であり、モデル数やマテリアル数は合格根拠でない。旧画面の構図から根本的に変更。**真元source Camera control11307/ultra11341の数値は不変**、本物のBlender原本と両画像、前K4BKと同視点比較、独立SHAが必須。

[Actions #41749501857](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41749501857) は実CI状態とArtifactを必ず確認すること。**まだ美術合格を宣言していない**。元ゲームのWebGL2画像ではない。DCCレンダリング成功=美術PASSではない。世界品質に届かないならART REJECTと正式採用0件／DNA0mを維持。

元ゲームGit blob `af076d67492a677d2235e4730aef8cdf4808e106`／Road5 source mesh fingerprint `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、240Hz・球半径0.65m・B48実7・B51実28・元6Camera数値・安全案内不変、main／公式p101／Draft PR#46／本番2サイト保護。Work事前承認、ユーザーのWindows操作最小。SAT/CCD/HUMAN/FPS/RELEASE/MERGE/ART全HOLD。ART審査前の実ゲーム統合・他6道路への展開禁止。

---

# 【2026-11-04 K4BK最終引継ぎ入口】本物B48 Road5測量・Blender DCC技術PASS／ART REJECT

最新研究隔離枝：`research/k4bk-ground-truthed-civic-roadside-20261104`。次のチャットは[実物道路9地点の測量、真Source Camera画像の美術評価、全実行・失敗反省をまとめたK4BK正本](docs/R19_A6P4_R2F5K4BK_ROAD_CALIBRATED_CIVIC_ART_JA.md)を最初に読む。旧K4BJ・K4BI以前の「最新」表記は履歴。

- 9地点のSOURCE B48 Road5実物Raycastと左右境界／道路高さ確認は **PASS**。−25〜+170mのCamera前後方向にて2m刻みの路面側面サンプリングが全地点成功。旧来のd550m・s±170m以上に誤配置した街区構造とは異なり、今回のDCCモデルは測定した道路に沿って制作した。
- [K4BK最終修正版CI #41747761082](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41747761082) **completed/SUCCESS**。[本物の編集可能Blender DCC・元Camera control11307/ultra11341 2PNG・旧K4BJとのA/B・独立sha JSON Artifact #13284094495](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41747761082/artifacts/13284094495)、ZIP SHA256 `86879b1dd3a4a03ed7cb9d6db676cd2ba971dc2a3e9b61a39f9ac80dbd910904`。BLEND/PNG全SHA独立照合OK。初回[CI #41747047424](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41747047424)も技術SUCCESSだったが、極めて巨大な無地の外壁と連絡梁で美術REJECT。修正版は屋根を薄くし実寸開口と奥行きのある室内を設計し、旧より画面両側は少し改善。
- **ただし最終K4BKもART REJECT**。実画像を直接見て、安っぽい長い道路、平板な商業建築、青緑の単純な橋、空白の多い遠景と空気感の欠落が残る。SOURCE測量成功、DCC技術PASS、128編集可能モデルはART合格ではない。正式ART採用0件／Slope2 DNA正式認定0m。これは実WebGL2ゲーム画面ではない。
- **次工程K4BL**：正しいRoad5実寸を維持しつつ、「大きい屋根や箱を増やせば都市に見える」という制作を停止する。道路面の本物の質感・路側の高精度セット/土地利用・人が使う公共内部/自然との接続・都市遠景・照明・カメラ構図を一画面の商用水準の美術に高める。まず真の美術イメージ/3D実原本とsource Camera比較で審査し、合格前に実ゲーム統合・他6Road展開は禁止。ゲーム実WebGL2の同Camera検証も必要。
- 不変保護：元ゲームgit blob `af076d67492a677d2235e4730aef8cdf4808e106`、元Road5指紋 `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、240Hz/球半径0.65m／元B48全7・B51全28／Camera6／安全表示、main、公式`p101-velocity-overdrive-native-trial`、Draft PR #46、本番2サイト変更なし。Work個別承認制、ユーザーWindows操作不要。ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。

---

# 【2026-11-04 K4BK 新しい継続入口】元Road5の実寸座標に建築を合わせたART-FIRST研究

最新研究隔離枝：`research/k4bk-ground-truthed-civic-roadside-20261104`。必ず[K4BK真正道路実寸を用いたBlender制作・不変条件・美術審査正本](docs/R19_A6P4_R2F5K4BK_ROAD_CALIBRATED_CIVIC_ART_JA.md)を先に読む。K4BJの**実測発見**とART REJECTを継承し、旧来のCamera前方550m・横±160m以上というRoad5の尺度と噛み合わない建築を再利用しない。

- [K4BJ実道路測量](docs/research-evidence/k4bj/K4BJ_REAL_SOURCE_ROAD_CAMERA_SCALE_SURVEY.json)で真Road5 Camera前方0〜25mの頂点横位置−39.162〜+53.261m、100〜150mで−38.821〜+69.255m、前方の最大到達188.774mと実測。これは安全可走幅ではなく幾何の頂点分布。
- K4BK `scripts/p101-k4bk-true-road-civic-corridor.py` をGitHub保存済み。真正元Blender・元Road5・元Cameraを厳密SHAで保持したまま、9地点の真Blender RaycastでRoad5左右境界と高さを採寸し、その**道路外**に歩行者用街並み・西陶板図書館・東港湾ターミナルを構築、実Camera前方約132〜157mにガラス空中公共駅をデザインする。旧模型ARTは削除せずRender OFF。元Road5はDCCマテリアル以外変更しない。
- [専用実制作CI #41747047424](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41747047424) は実結果を必ず再照会。真正control11307/ultra11341のDCC元カメラ画像、編集可能.blend、独立SHA、旧K4BJ同Camera比較、研究隔離枝へ画像保存を試みる。成功・ART合格は実検証前に断言しない。
- 不変更：ゲーム blob `af076d67492a677d2235e4730aef8cdf4808e106`、元Road5 fingerprint `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、元6Camera／B48実7道路／B51実28動体／240Hz／球0.65m／ゲーム安全表示、main・公式`p101-velocity-overdrive-native-trial`・Draft PR #46・本番2サイト。Work事前承認、ユーザーWindows操作要求なし。
- 正式採用ART0件・Slope2 DNA正式認定0m、ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。今回のDCC研究画像は実WebGL2ゲーム画面ではない。**新しい真実の画面を見て質が低ければ必ずART REJECT。** 他6Roadへの展開、元ゲーム統合、本番反映は禁止。

---

# 【2026-11-04 K4BJ最終引継ぎ・最重要発見】モデルを量産する前にRoad5実寸尺度を是正する

**現研究正本**：`research/k4bj-hand-authored-hero-civic-canyon-20261104`。最優先で[K4BJ真正画像・品質不合格・実Road5幾何測量を統合した正本](docs/R19_A6P4_R2F5K4BJ_TIDAL_CIVIC_CANYON_TRUE_CAMERA_JA.md)を読む。古いK4BI以下の「最新」表記はすべて履歴。

- 新K4BJ[真Source Camera DCC CI #41743823084](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41743823084) **completed/SUCCESS**、[実編集Blender原本／control11307とultra11341の真正PNG・比較PNG・SHA証拠Artifact #13282722868](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41743823084/artifacts/13282722868)、ZIP SHA256 `7b85ebe4c3ef60053c9e5dfdc18e55d9c779714afa8b4319ac3370561b4948b3`。元Road5 mesh／元Camera値／ゲーム原blobは不変。しかし左右の巨大で無地な壁、中央模型的構造、広大で単調な前景路面のため**K4BJ ART REJECT**。正式採用0件／Slope2 DNA0m。
- **次工程を変える決定的な実測**：[Source Road5 geometry survey CI #41744748256](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41744748256) **completed/SUCCESS**、[実測生JSON](docs/research-evidence/k4bj/K4BJ_REAL_SOURCE_ROAD_CAMERA_SCALE_SURVEY.json)、[真Artifact #13283665361](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41744748256/artifacts/13283665361)。元Camera controlの前方`d=0〜25m` では元Road5 mesh頂点のカメラ横位置 `s=-39.162m〜+53.261m`、`d=100〜150m` では `-38.821m〜+69.255m`。元Road5 mesh全体のCamera前方最大 `d=+188.774m`。これまでの建築`s≈±160〜360m`や中央造形`d≈550m`はRoad5基準の実寸とずれていた。旧路側測定`s=±157m`は左右42点ずつ路面交差0。**安全な可走幅・B51とのクリアランスは依然未測定**。
- **K4BK次工程**：旧来の推定大尺度を捨て、元Camera／元Road5の実測d,s,z座標から、建物・植栽・側壁・中央遠景・道路の関係をカメラ平面上で計画してから高品質な3Dを作者制作する。実路面への接触・景観造形には地点別Source Raycastと、必要ならB51や実SAT/CCD/ゲーム統合後の安全証拠が必要。元ゲームは不変。単なる箱・弧・窓増殖、汎用リング再利用は禁止。
- 不変契約：ゲームBlob `af076d67492a677d2235e4730aef8cdf4808e106`、240Hz/球半径0.65m／元B48全7・B51全28・元6カメラ値・安全表示、main・公式p101・Draft PR #46・本番2URL保護。Work事前承認・ユーザーのローカルWindows操作不要。**ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE HOLD**。美術合格前の他6Road展開、実WebGL2ゲームへの移植不可。

---

# 【2026-11-04 K4BJ 最新継続入口】手描き指定の非対称都市キャニオン・Blender真正元カメラ審査

**研究継続ブランチ**：`research/k4bj-hand-authored-hero-civic-canyon-20261104`。まず[K4BJ工程の制作意図・原本不変契約・厳密合否](docs/R19_A6P4_R2F5K4BJ_TIDAL_CIVIC_CANYON_TRUE_CAMERA_JA.md)を読む。

- 前K4BIは[最終SOURCE/DCC CI #41740606366](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41740606366) 完全PASS、しかし**ART REJECT**。技術成功と美術合格を混同しない。正式採用ART0件／Slope2 DNA0m。
- 今回は単純な旧箱群を増やさず、編集可能Blender原本の旧K4BH/K4BI研究造形をRenderOFF、独立して非対称西図書館・東海洋公共施設、厚い片流れの機能的スカイロビー、異寸法の市街地・本物Road5のRaycastによる路側造形を制作者した。形状／空間の違いはSOURCE Camera 2画像を見て初めて評価。Raw true source-camera DCC images are **not actual WebGL2 screenshots**.
- [GitHub Actions #41743406627](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41743406627) は修正後CI。必ず実status / 本物PNG / Blender Artifact / SOURCE fingerprintsを検証すること。旧初回 #41743358774 はRaycastの戻り値数誤りで描画前停止しcancelled；成功ではない。レンダリング済み・合格と推測しない。
- 元凍結Game blob `af076d67492a677d2235e4730aef8cdf4808e106`、Road5メッシュ `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、実B48全7／B51全28・240Hz・球0.65m・元6Camera数値・原安全表示不変更。main / 公式`p101-velocity-overdrive-native-trial` / Draft PR #46 / 本番2サイト保護。Work事前承認、ユーザーのWindows操作要求なし。HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。
- 次工程：**必ず真renderを目視し旧K4BIと同じ2source cameraをA/B比較、画面全体で不合格ならART REJECTと正本に固定。** 合格未確認の別Road展開・本番統合不可。

---

# 【2026-11-04 K4BI最終確定・次回第一入口】真正Blender TECH PASS／美術REJECT

**継続最新研究枝**：`research/k4bi-road-surface-facade-craft-20261104`。必ず[K4BI最終実行報告・美術評価](docs/R19_A6P4_R2F5K4BI_ORIGINAL_CAMERA_ROAD_PBR_CIVIC_FACADE_JA.md)を先に読む。

- [最終Source DCC CI #41740606366](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41740606366) **completed/SUCCESS**。元B48 Road5頂点・面fingerprint、真正元control11307/ultra11341のカメラ数値、凍結元ゲームBlob、Blender親原本SHAを確認し、編集可能Blender + 2元Camera PNG + K4BH同フレーム比較PNG + SHA JSONができた。真正[Artifact #13281034575](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41740606366/artifacts/13281034575)、ZIP SHA256 `03ecbc210290d030884e42b5e09efa2f01aac8e7210bb2d19bf2c832e0621539`。見た目がよくなるよう路面マーカー、深い外装、室内窓、細い海色の縁を新たに制作者したが、**依然フラットで反復的な都市、寂しい奥行き、広く単調な路面、粒状ノイズが残りART REJECT**。
- 中間[CI #41740364212](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41740364212)はBlenderのOpenImageDenoiser非対応によりFAILURE。修正後96samples無デノイズで成功、最終成果物を独立再検査。再発防止としてOIDN依存は使わない。
- **正式ART採用0件・Slope2 DNA正式認定0m**。これは元WebGL2画面ではなく真正Source Camera数値からのBlender DCC研究。HUMAN/SAT/CCD/FPS/ART/RELEASE/MERGE全HOLD。主目的は世界水準のレーシングゲームの**全コース美術**、ただしRoad5のHero ART合格までは他6Road展開・ゲーム本体への統合不可。箱・細線・同じ窓を増やす作業は停止し、一画面の独自の高級な本物の美術制作へ優先度を上げる。
- 元source `af076d67492a677d2235e4730aef8cdf4808e106`、240Hz/0.65m／元B48全7・B51全28・元Camera6・安全表示、main/公式p101/Draft PR#46/本番2サイト不変更。Work事前承認、ユーザーWindows操作不要。

---

# 【2026-11-04 K4BI 現在の第一入口】DOPAGAKI SLOPE 真正ロードPBR・建築外装

**最新継続研究枝**：`research/k4bi-road-surface-facade-craft-20261104`、前K4BH `3718a6a39288dfc51a3d28abcdb0371d06202010` から隔離。まず[新K4BIの固定美術課題・研究原本](docs/R19_A6P4_R2F5K4BI_ORIGINAL_CAMERA_ROAD_PBR_CIVIC_FACADE_JA.md)を読む。旧K4BHはSOURCE/DCC技術PASS／**ART REJECT**、正式ART採用0件、Slope2 DNA 0m。

**今回の実制作**：`scripts/p101-k4bi-road-surface-civic-facade-craft.py` で、元Blender編集可能K4BH原本・元Road5形状とCameraをハッシュ固定したまま、原メッシュ上の物理PBR塗装レイヤ・深い建築窓・庇・室内照明・道路端の安全色彩と公共インテリアを実DCC制作。これは**新しいカメラを作ったコンセプト画像ではなく**、固定された元control11307/ultra11341の編集可能3D study。実ゲームWebGL2画面でも合格ARTでもない。 [GitHub Actions #41739572392](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41739572392) の**completed/conclusion・真正画像・独立SHAを再照合すること**。結果未確認でSUCCESS/美術合格とは書かない。

元ゲームsource blob `af076d67492a677d2235e4730aef8cdf4808e106`、B48元7道路/B51元28/240Hz/球0.65m/元6Camera、main、公式p101、Draft PR #46、本番サイトを保護。元ゲームの新規Collider・安全な施工・SAT/CCD/HUMAN/FPS/RELEASE/MERGEは未証明/HOLD。Work事前承認。ユーザーWindows操作要求無し。続行は最新研究ブランチのみ、ART合格までゲーム移植と他Road横展開をしない。

---

# 【2026-11-04 K4BH最終監査・現継続入口】Source-DCC TECH PASS／ART REJECT

研究ブランチ `research/k4bh-true-camera-complete-hero-composition-20261104`。最優先で[確定K4BH全文・美術評価・保護契約](docs/R19_A6P4_R2F5K4BH_TRUE_CAMERA_COMPLETE_HERO_COMPOSITION_JA.md)を読む。

[修正版CI #41732617047](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41732617047) **completed/SUCCESS**、Blender編集可能原本＋元control11307 / ultra11341数値を使った真正2 PNG・旧K4BG比較PNG・SHA監査が成立。[Artifact #13276364672](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41732617047/artifacts/13276364672)、ZIP SHA256 `3c1cc2c6534a1e290a091e4484f1ce537895a8a12dcff90289efc6c7a834ecb0`。**DCC技術限定PASS**であり、美術品質ではない。

- 結果：旧上部の模型的な橋を非表示にした一方、画面の大半が単調な路面と粗い平板壁、薄い二重アーチと小さな尖塔。**K4BH ART REJECT**。正式採用0件、Slope2 DNA認定0m。K4BGもART REJECTのまま。
- 第2 CI #41732218172は旧ART非表示処理が元K4BC v2のSource6道路に衝突し保護assertで停止、**FAILURE**。修正後第三CI #41732617047のみを最新SOURCE/DCC PASSとして扱う。元B48全7・B51元28・240Hz・球0.65m・元Camera/元安全描画不変更。
- 次はより多くの粗い箱・弧・塔の自動生成ではなく、元カメラの近景道路・都市中景・遠景の**一枚の本当に高品質な完成画面**をBlenderの実編集/マテリアル・UV/照明・公共内部として作り込む工程。ARTが認められるまでゲーム移植、他6Road展開は不可。DCC画像は実WebGL2ゲーム画面ではない。HUMAN/SAT/CCD/FPS/RELEASE/MERGE HOLD。
- 元ゲームGit blob `af076d67492a677d2235e4730aef8cdf4808e106`、main、p101公式枝、Draft PR #46、本番2サイトは保護。Work事前承認制、ユーザーWindows操作不要。

---

# 【2026-11-04 K4BH 最新継続入口】DOPAGAKI SLOPE美術制作

**最新の隔離研究枝**：`research/k4bh-true-camera-complete-hero-composition-20261104`。前K4BGは実Blender技術PASS／ART REJECT。今回の新美術制作者は [K4BH正本](docs/R19_A6P4_R2F5K4BH_TRUE_CAMERA_COMPLETE_HERO_COMPOSITION_JA.md) で再開。K4BGなど旧「最新」記述は履歴とみなす。

K4BHでは真Blenderネイティブのロード表面シェーダー、左右で連続する岩盤公共建築と内装、遠方シンボルの大型構造と都市・地形、天空・日照を、一体の実source Camera構図として実装済み。元source Road5メッシュ・元6Camera数値・240Hz物理/球0.65m・B48全7/B51全28・凍結原blob `af076d67492a677d2235e4730aef8cdf4808e106`・本番・main・公式p101・Draft PR #46を保護。

[実K4BH Actions #41731470838](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41731470838) で元K4BG真正.blendからcontrol11307/ultra11341の2枚と新.blendを制作・GitHub保存する。**結果は必ずrunの実状態と生Artifactを再検証すること。CIのTECH成功だけでART PASSとしない。** 不合格なら正式採用0件、Slope2 DNA0m、ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD継続。実ゲームのWebGL2画面、人間プレイ、全B51クリアランスは未測定。Work事前承認。ユーザー操作不要。

---

# 【2026-11-04 K4BG最終判定・次チャットの第一入口】真正Blender DCC 技術PASS／美術REJECT

**現在の研究継続枝**：`research/k4bg-civic-escarpment-true-camera-art-20261104`。必読：[K4BG最終美術判定・全方針・元ソース不変契約](docs/R19_A6P4_R2F5K4BG_SOURCE_CAMERA_COHERENT_CIVIC_ESCARPMENT_JA.md)。

- **修正版の確定CI**：[Actions #41726814278](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41726814278) は **completed/SUCCESS**。元K4BE SHA検証・真正Blender編集可能原本・元Camera control11307 / ultra11341のDCC PNG・独立manifest SHA・GitHubブランチ内画像保存・Artifactアップロードが実成功。真正[Artifact #13274862071](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41726814278/artifacts/13274862071)、ZIP SHA256 `12421de4f43d2aad1df744aed9d9bf450727dded08151eb7fab300334d9e787b`。
- **元Road5のULTRA画面欠落は表示設定修正で解消**。親Blender原本のsource Road5 ULTRA collection `hide_render` をmode別に戻し、元Road5メッシュ・材質割当・カメラ数値・元ゲームソースは変えていない。
- しかし**K4BG ART REJECT、正式ART採用0件・Slope2 DNA正式認定0m**。大面積の単調な前景路面、浅い・模型的な両側都市意匠と中央構造、都市奥行き/使われる公共空間/照明/人間スケールの未完成が残る。88新Blenderオブジェクト、PNG生成、SOURCE/DCC PASSをART合格へ読み替えない。**Blender Source Camera DCC画像は元WebGL2実ゲーム画像ではない**。
- **次工程**：まずこのDCCの不合格を固定し、実カメラの画面全体を大きく変える高精度アート（道路前景の自然な設計質感、左右の継続街区、用途のある内部、街区遠景・大気・光、強い構図）に制作方法を切り替える。単なる箱や曲面パーツの量産は中止。ART認定前の他6Road横展開・ゲーム統合/リリース不可。新候補の本物の元カメラ画像を目視審査。
- **保護契約**：main、`p101-velocity-overdrive-native-trial`、Draft PR #46、本番2サイト、元source blob `af076d67492a677d2235e4730aef8cdf4808e106`、240Hz/半径0.65m、元Camera全6、B48実7道路、B51実28動体、原安全表示不変。Work事前承認／ユーザーのWindows操作要求なし。HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。CI/HEADは次回GitHubで再照合する。

---

# 【K4BG 修正版の最優先注意 2026-11-04】

初回K4BG CI #41725702409はSOURCE/DCC技術SUCCESSだが、初回ultra source Camera画像では実B48 Road5が欠けた状態。親K4BE .blend保存時のULTRA **collection hide_render** を、子の object hide_render 変更では解除できないことが原因とコード上で確定。**修正版 commit e1f5354** では元ROAD5 Collectionをmode別に切替。再CI [#41726814278](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41726814278) の実状況・真2画像を必ず再照合。最新ART認定は依然0、Slope2 DNA0m、HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。詳細は [K4BG正本](docs/R19_A6P4_R2F5K4BG_SOURCE_CAMERA_COHERENT_CIVIC_ESCARPMENT_JA.md)。

---

# 【2026-11-04 K4BG／新チャット最優先入口】DOPAGAKI SLOPE — ART-FIRST研究

- **現在の継続研究枝**：`research/k4bg-civic-escarpment-true-camera-art-20261104`。親K4BF `f8d291d7c4436e739843bd3bb6fdf2b95c85feb0` から隔離。main／公式p101／Draft PR #46／本番2サイトは変更禁止。
- [K4BGの本当の一体型Blender美術制作コード・目的・不変条件・検証](docs/R19_A6P4_R2F5K4BG_SOURCE_CAMERA_COHERENT_CIVIC_ESCARPMENT_JA.md)を最初に読む。[K4BG Source-Camera制作CI #41725702409](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41725702409)は2026-11-04 06:52 JST頃起動。**最新statusを再照会**し、成功やART合格を推定しない。
- K4BF #41722243986は**completed FAILURE**（Blender .blend/2 source Camera PNG/独立SHA検査までは成功、最後のGit保存がnon-fast-forward）。実Artifact #13271498531、ZIP SHA `9adc33e93f72b053a20d264b480aea165c3ef43daeb8007df5b313242f7e49f3`、control/ultra真DCC比較を目視して**K4BF ART REJECT**。ultraでは道路が前景に無いように見える大空間、controlも模型感が残存。元ゲームのRoad5が実際に欠損した証拠ではない。
- K4BGは旧K4BE材質と真正道路メッシュの非改変を保証して、旧反復都市建築をDCC render OFF、連続する両側都市峡谷・大断面公共屋根・深い居室・雨庭・遠景ランドマークをBlender-nativeで一方向再制作。2 source Camera画面のARTを厳格審査するまで、**正式ART採用0／Slope2 DNA0m／HUMAN/SAT/CCD/FPS/RELEASE/MERGE HOLD**。DCC PNGと実WebGL2ゲーム画面を絶対に混同しない。
- 元source blob `af076d67492a677d2235e4730aef8cdf4808e106`、元Camera6・球0.65m・物理240Hz・B48道路7/B51実動体28、衝突/安全表示は不変更。Workは事前許可制、ユーザーWindows操作要求なし。K4BGのART不合格なら**次の道路全体展開は禁止**。

---

# 【2026-11-04 K4BF制作開始 / ART未判定】DOPAGAKI SLOPE — 正本最新入口

**最優先**：[K4BF本物のSource Camera/路面PBR/公共モノリス実制作](docs/R19_A6P4_R2F5K4BF_SOURCE_CAMERA_GROUND_MONOLITH_ART_FIRST_JA.md)、[K4BF専用Actions #41722243986](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41722243986)、[K4BE終盤の保護条件とART REJECT](docs/R19_A6P4_R2F5K4BE_SOURCE_CAMERA_COHERENT_TIDAL_FORUM_JA.md)。旧K4BE見出しは歴史資料として残す。

- 最新隔離研究枝：research/k4bf-true-camera-ground-and-civic-monolith-20261104（K4BE確定HEAD 8529b78fb04a30714137a5fb6cfd013f746726c9から派生）。旧main/本番/公式p101/Draft PR #46変更禁止。
- **今回実装**：元Blender編集原本から Road5の視認されるPBR質感を実材質化、中央の旧模型的Tidal Forumのみrender OFF保持、厚い非対称公共モノリスと地盤接続・居室・開口の大断面を新規実Blender meshesで制作。original 7 B48/28 B51/6 true Camera/240Hz/0.65m/凍結 WebGL2 Git blob af076d67492a677d2235e4730aef8cdf4808e106保持。
- **現時点の正直な状態**：最新版はCamera内の高さを修正した制作器と旧試行キャンセル改善込み。レンダー/編集可能Blender/save/API成否は実際の run #41722243986 を照合する。保存済みコードだけでBlender PASSや美術改善を宣言してはいけない。成功時の元Camera2画像も実際に開いてART審査する。
- **全ゲートHOLD**：K4BF独立全7 B48/B51有限静的BVHと真0.65m距離/全B51時間/SAT/CCD/HUMAN/FPS/実WebGL2描画は未検証。ART UNJUDGEDからは実画像審査を要する。正式ART採用0件・Slope2 DNA 0m・RELEASE/MERGE禁止。

---
# 【最新・2026-11-03 K4BE完了】DOPAGAKI SLOPE：ART-FIRST全画面研究

**ここを最優先**：[K4BEの完成証拠・拒否理由・次工程](docs/R19_A6P4_R2F5K4BE_SOURCE_CAMERA_COHERENT_TIDAL_FORUM_JA.md)、[K4BDからの完全統合引継](docs/continuity/HANDOFF_20261103_K4BD_TO_NEW_CHAT_COMPLETE_JA.md)。過去に「最新」と書かれた以下のK4BD/K4BC/K4BB見出しは歴史資料。

- **研究枝** research/k4be-camera-first-integrated-urban-civic-hall-20261103。元はK4BD確定HEAD 702805d4b58d7ff8f6bf99157dd25a02d3fc83e9。main・公式継続p101-velocity-overdrive-native-trial・本番2サイト・Draft PR #46（OPEN/DRAFT/UNMERGED）・元game source/blobは変更禁止。Work事前承認、Chat＋GitHub主体、ユーザーPC操作最小。
- **K4BE実装済**：[真正source camera2枚用Blender建築器](scripts/p101-k4be-source-camera-integrated-tidal-forum.py)で元K4BD編集可能原本を開き、旧模型的建築を削除せず表示OFF、真Road5 bank/元Road6に整合した公共ホール/海岸温室/中央Tidal ForumをBlender mesh/curveで305編集可能オブジェクトとして研究制作。元全7 B48／28 B51／6元Camera／240Hz／球0.65m／元sourceゲームのオリジナル危険表示・CCD・操作は不変。追加の偽game road/colliderは0。
- **正式な画像制作**：control11307・ultra11341の2つの本物source数値Camera画像＋非game航空DCCを実作成（残り4つのsourceカメラは未描画）。元レンダーrun #41657612279は画像とblendを保存したがGLB exporter NumPy不足で最終FAIL。失敗をSUCCESSと偽装しない。[元画像とblendを再利用する**再描画なし救済Actions #41659005101**](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41659005101) **completed SUCCESS**、Artifact #13240733042。ZIP40,927,628bytes/全7ファイルCRC0/SHA全一致、原Road5 4,728三角の幾何fingerprint不変、GLB別出力成功。実ゲームのWebGL2フレームではない。
- **独立元source静的BVH**：[Actions #41659267726](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41659267726) **completed SUCCESS**、Artifact #13240119880。真の全7 B48 road control＋ultra=14mesh／66,192三角＋元B51の6×28=168 source collision OBBを、K4BE新建築305件を含む全826建築・151,796評価面と独立照合。**源B48表面交差0、B51表面交差0**。これは有限の静的面交差であって、原球半径0.65mの余裕、B51全時間、原ゲームCCD/SAT/HUMAN/FPSは未証明。K4BDのDCC路面inlay52個／深海面は非衝突なので監査対象から除外。
- **GitHubで即確認**：[元Camera2視点のK4BD/K4BE同pose A/B](docs/research-evidence/k4be/K4BE_TWO_ORIGINAL_CAMERA_K4BD_VS_CITY_ART_REJECT.png)、[control11307](docs/research-evidence/k4be/K4BE_CONTROL_11307_TRUE_SOURCE_CAMERA_ART_REJECT.png)、[ultra11341](docs/research-evidence/k4be/K4BE_ULTRA_11341_TRUE_SOURCE_CAMERA_ART_REJECT.png)、[航空DCC](docs/research-evidence/k4be/K4BE_INTEGRATED_CIVIC_HALL_AERIAL_DCC_NOT_GAME.png)、[SHA原本](docs/research-evidence/k4be/K4BE_ORIGINAL_SOURCE_B48_B51_SHA_ART_REJECT.json)。[保存CI #41659255835](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41659255835) SUCCESS。ZIPダウンロードやユーザーPCでのスクリーン撮影は不要。
- **重要：ART REJECT継続**。Road5の単調な大面積路面はそのまま、中央Tidal Forumは高速Cameraから小さく文字も部分隠れ、周辺都市は厚みの足りない屋根・棒・単純な透明箱の模型のまま。Blender原本/CIのSOURCE技術PASSを見栄えの合格と呼ばない。正式ART採用0件、Slope2 DNA認定0m。
- **次工程K4BFへの確定した反省**：大量procedural shell/box/柱の繰返し、配色替え、ブラインド高コスト6カメラを禁止。まず**元source Cameraの本物の画面**で路面占有・視野・建築/公共施設が認識できる実範囲を測り、元roadやCameraを変えずに、画面に入るシグネチャー建築を独立の手作業系DCC造形・実世界に根付く公共空間として詳細設計。2元Cameraのpilotで実画像を審査し、不十分ならART REJECTで止める。
- **絶対不変**：凍結元ゲーム Git Blob af076d67492a677d2235e4730aef8cdf4808e106、元7 B48/28 B51、240Hz、球0.65m、元Camera6 tick、操作/速度/安全HUD/衝突は保持。ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGEすべてHOLD。main/本番/元Slope/公式継続研究/Draft PR #46に書き込み・マージ禁止。

---


# 【最新版 2026-11-03 K4BD 完了／新チャットからの入口】DOPAGAKI SLOPE

**最初に[完全統合K4BD→新チャット引き継ぎ正本](docs/continuity/HANDOFF_20261103_K4BD_TO_NEW_CHAT_COMPLETE_JA.md)を読むこと。** 最新研究枝 `research/k4bd-source-road5-civic-deck-material-architecture-20261103`。下の古いK4BC/K4BD進行中記録より、**この先頭・引き継ぎ正本・現在のGitHub Actions実結果**を優先。ユーザーの過去決定・反省を蒸し返さず継承。

- **K4BDの3K Road5元source DCC制作 2Camera pilot：** [Actions #41649107682](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41649107682) **completed SUCCESS**。control11307／ultra11341の**2真正source Camera**のみ撮影、元source Camera数値変更無し。残り4時点は**未描画**。Blender編集可能.blend、GLB、3K ALBEDO／ROUGHNESS／HEIGHT PNG、別B51 28体debug、独立航空、source SHA。非衝突路面inlay52枚、両側の公共テラス各1。真正WebGL2ゲーム画面ではない。元B48全7／B51 28／240Hz／球半径0.65m／freeze原source blob不変。
- **K4BD実ARTレビュー：ART REJECT（正式採用0件）**。道路の暗色石材施工区分はK4BC v3から一部前進、B51物理紫debug枠を美術previewから独立分離。ただし道路が巨大・単調で建築は模型的、都市密度と実公共用途が不十分。元高速Cameraで成立しないまま全6画像に高コストをかけることを避け、2Camera pilotで停止。**Slope2 DNA認定0m**。
- **GitHubへ画像を直接保存済**：[Actions #41650256585](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41650256585) **SUCCESS**。[K4BD元2Camera A/B](docs/research-evidence/k4bd/K4BD_PILOT_TWO_SOURCE_CAMERA_AB_ART_REJECT.png)、[control11307](docs/research-evidence/k4bd/K4BD_REAL_CONTROL_11307_CLEAN_DCC_ART_REJECT.png)、[ultra11341](docs/research-evidence/k4bd/K4BD_REAL_ULTRA_11341_CLEAN_DCC_ART_REJECT.png)、[別B51 28体debug](docs/research-evidence/k4bd/K4BD_TRUE_B51_28_BODIES_DEBUG_ULTRA_11341.png)、[航空DCC](docs/research-evidence/k4bd/K4BD_AUTHOR_AERIAL_DCC_NOT_GAME.png)、[3K原アルベド](docs/research-evidence/k4bd/K4BD_3K_TRUE_ROAD5_PBR_ALBEDO_DCC_ONLY.png)、[源SHA](docs/research-evidence/k4bd/K4BD_3K_PBR_SOURCE_SHA_ART_REJECT_PROVENANCE.json)。
- **K4BD独立源B48/B51静的BVH最終完成**：[Actions #41653236842](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41653236842) **completed SUCCESS**。真の7 B48道路×control/ultra=14元メッシュ**66,192三角形**／元B51 28×6 source時刻=**168物理OBB**、新K4BD路外テラス46件を含む現行建築**521評価オブジェクト・120,992評価面**、**元道路とB51の有限静的三角形表面交差は0件／0件**。非衝突Road5 visual inlay52件と海水面はスコープから除外。これは**真CCD／球半径0.65m安全余裕／B51全時間／HUMAN／SAT／FPS／ART**の合格ではない。
- **失敗と修正は正本に保存**。初回K4BD EEVEEはUbuntu headless `libEGL.so.1`欠落でABORT、Cyclesへ変更。8枚×112samplesの重い初期試行を減らし、56samplesの2Camera pilotへ。初期K4BD独立BVHはBlenderの63byte collection名切り詰めで対象識別assert失敗、安定prefix＋厳格countへ修正し**最終静的BVH本当にSUCCESS**。過去のFAILを実接触0としてすり替えない。
- **次のK4BE候補**：原Cameraの全画面美術、Road5の単調さ/都市街区実密度/建築用途と人間スケールをさらに根本再設計。表層の色変更・意味のない箱/棒/アーチ/資産増産で採用しない。**2元Camera pilot→厳格な実画像ARTレビュー→採用見込みがある場合だけ全6Camera→独立元全7 B48/B51静的検査→GitHub原本・証拠保存**の順番を守る。
- **原本・運用永久保護**：ゲーム凍結 `web/p101-w9c2-g4e7ci-integrated-streetscape.mjs` GitBlob `af076d67492a677d2235e4730aef8cdf4808e106`、元7 B48/28 B51/元Camera6tick/240Hz/半径0.65m/元操作/元安全表示不変。main、本番、公式開発枝 `p101-velocity-overdrive-native-trial`、OPEN/DRAFT/UNMERGED PR#46を変更/公開/マージしない。Work事前承認制、Chat+GitHub中心、ユーザーPC作業ゼロ優先。**正式ART採用0件、Slope2 DNA認定0m、ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD**。

---

# 【2026-11-03 最新・K4BC v3完了／次工程へ】DOPAGAKI SLOPE 継続入口

**この先頭を旧K4BC初版、K4BB、K4BA、K4AZの「最新」より優先すること。固定ART HOLDは変更しない。**

- 研究ブランチ：`research/k4bc-road5-source-camera-civic-monument-recomposition-20261103`。完全な正本：[K4BC全工程とv3実証](docs/R19_A6P4_R2F5K4BC_SOURCE_CAMERA_READABLE_CIVIC_DISTRICT_JA.md)。前K4BBの正式HEAD `9800d65b71f719347f9d467ef90199791925b511`から派生。
- **元B48全7道路を真ソースで導入**：元の`generateP101W9C1AbyssCandidate`＋`tessellate()`をread-only実行、control＋ultraの7×2＝14原メッシュ66,192三角形をDCC source sceneへ導入（Road5元物理mesh 4,728 triangles / source points SHA維持）。原B51 28体×source6Camera tick=168実物理OBB。元球半径0.65m／240Hz／camera/操作/衝突/ロード安全表示を変更しない。
- **v3実装と実証**：Blenderの元6source Cameraの方位から正面都市の構図を再計算。真Road6の実幅を計測し、路外の左右公共施設とRoad6上空の幅広い非衝突DCC専用公共ミュージアムを編集可能Blender/GLBで造形。**v3 DCC/同Camera画像のCI [#41640544530](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41640544530) completed SUCCESS**、Artifact #13232364254。主役が真正Cameraの中央に実際に入るようになったが、都市・路面・屋内の美術レベルが不十分で**ART REJECT**。
- **v3独立・全7道路の静的BVH**：[Actions #41642883010](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41642883010) **completed SUCCESS**、Artifact #13233801620。K4BC v3含む475件／114,064評価面 vs 本物B48全7×control/ultra=14メッシュ・66,192面＋B51実時刻OBB168件の静的三角形交差**0件/0件**。**元ゲーム連続CCD、球半径0.65mを考慮した接近クリアランス、全元時刻、人間操作、FPSやARTは未認定**。
- **実6Camera画像をZIP無しでGitHub閲覧**：[v3とv2全6Camera A/B](docs/research-evidence/k4bc-v3/K4BC_V3_REAL_SOURCE_ALL7_SIX_CAMERA_V2_AB_ART_REJECT.png)、[v3 control11307 DCC](docs/research-evidence/k4bc-v3/K4BC_V3_REAL_CONTROL_11307_DCC_ART_REJECT.png)、[v3航空DCC](docs/research-evidence/k4bc-v3/K4BC_V3_DESIGN_AERIAL_NOT_GAME_ART_REJECT.png)、[SHA/原source provenance](docs/research-evidence/k4bc-v3/K4BC_V3_ORIGINAL_ROADS_CAMERA_SHA_HOLD.json)。保存CI #41642553268 **SUCCESS**。Blender DCC画像は元のWebGL2ゲーム画面ではない。
- **次工程：全画面美術をさらに根本改善**。巨大で単調な前景道路の構造意匠・リアルな舗装質感、左右の公共用途が走行Cameraで読める建築断面、外観の構造/階層/人のスケール、都市の周辺街区を、編集可能DCC原本から完成品質へ再制作。雑なbox/棒/アーチの追加、軽微な色替えやCI greenだけでの美術採用は禁止。
- **恒久契約**：正式ART採用0件、Slope2 DNA認定0m、ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。元game frozen blob `af076d67492a677d2235e4730aef8cdf4808e106`。main・production・公式継続`p101-velocity-overdrive-native-trial`・Draft PR #46未変更/未マージ。Chat＋GitHub中心、Workは必ず事前承認、ユーザーPCローカル操作不要。

---

# 【最優先・2026-11-03 K4BC 再開】DOPAGAKI SLOPE — 真のB48全7道路とCameraフレーム美術

**旧K4BB/K4BA/K4AZの「最新」は過去記録。最新研究枝は`research/k4bc-road5-source-camera-civic-monument-recomposition-20261103`で、正本は[`docs/R19_A6P4_R2F5K4BC_SOURCE_CAMERA_READABLE_CIVIC_DISTRICT_JA.md`](docs/R19_A6P4_R2F5K4BC_SOURCE_CAMERA_READABLE_CIVIC_DISTRICT_JA.md)。K4BB HEAD `9800d65b71f719347f9d467ef90199791925b511`から独立。**

- 最優先の美術目標は**元ゲームの真正240Hz高速Cameraに映る全面の視覚品質**。Blender技術成功、単色帯、棒/箱/繰り返す薄いアーチ、source同Cameraのピクセル差だけでART合格としない。正式ART採用0件／Slope2 DNA認定0m、ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE HOLD。
- **v1実施済**：元Road5だけを物理参照として左右の大きな公共建築・街区を編集可能Blenderで再制作。制作CI [#41636914845](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41636914845) SUCCESS、Road5+B51六時刻の独立限定静的BVH [#41637181443](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41637181443) SUCCESS（新造形393評価対象91,888面のRoad5/B51交差0）。**実Camera画像は正面空白・単調路面などでART REJECT**。
- **v2実施済 — 重大なsource盲点を修正**：今までDCCでRoad5のみだったため、真の元ゲーム生成器 `generateP101W9C1AbyssCandidate`＋元 `tessellate` から**7本全部の元B48ソース**をcontrol/ultraで正確抽出。元index0〜6：ABYSS_DIVE / CROWN_REVERSAL / SCISSOR_RISE / LOWER_REVERSAL / VOID_SURGE / PRISM_CREST / FINISH_RIDGE。Road5元4,728三角の原point/index/vertexハッシュ不変。他6道路×2モード=12本をBlender preview原本へ追加、物理collider0追加。制作CI [#41638891877](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41638891877) **SUCCESS**、実7道路同pose A/B。
- **v2のより広い独立source静的BVH**：[Actions #41639263986](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41639263986) **SUCCESS**。全7道路×2モード＝**14原メッシュ・66,192三角**、原6tick×B51 28体=168物理OBBと、K4BC新建築393評価対象91,888面の**静的三角形表面交差0件/0件**。ただし元球0.65m、全時刻、真CCD/FPS/HUMAN、元WebGL2レンダリングは**未検証**。
- **v2も正式ART REJECT**。実Camera画像のRoad5しかない旧版との差は非常に小さく、`control_11307`の独立画像比較はRGB平均絶対差約1.135/255、画像最大チャネル差24超の画素約1.88%。元Road6は実在するが、上り勾配の元Road5に遮られてほぼ見えない。実道路の追加だけで正面の大空白は解消されない。**偽の走行可能路面で空白を埋めることは禁止**。
- **v3次工程、実装・CI起動済**：[K4BC v3制作器](scripts/p101-k4bc-v3-real-road6-camera-framed-sky-museum.py)は原Road6の中心線/実幅を元sourceから数値取得し、カメラ方向も測定して、元Road6実道路上空に非衝突DCCの広い公共建築と左右の基壇を再配置。旧画面外の不採用塔はBlender編集可能原本に残して表示OFF。元ゲーム物理や走行道路は増やさない。制作CI [#41640544530](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41640544530)、全7道路／B51独立静的BVH [#41640727947](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41640727947)。**この記述時点でv3 CI成功／画像／交差評価はまだ未確定。実ログ確認前のPASS禁止**。
- **元source完全保護契約**：凍結元game GitBlob `af076d67492a677d2235e4730aef8cdf4808e106`、本物のsource B48七道路／B51二十八体／240Hz／球半径0.65m／元Camera6時刻／衝突・操作・スピード・危険表示改変禁止。編集先は隔離研究枝のみ。main、本番URL、公式継続`p101-velocity-overdrive-native-trial`、Draft PR #46を変更・マージ禁止。
- **ユーザーPC操作を要求しない**。Chat＋GitHub中心、Work必ず事前承認。既存K4BC v2の6×真正source-camera A/B、航空DCC、元Road source SHAは[研究ブランチの永続画像](docs/research-evidence/k4bc-v2/K4BC_V2_TRUE_7_B48_SIX_ORIGINAL_CAMERA_AB_ART_REJECT.png)から直接閲覧可。新v3の元Camera画像と全source静的BVHの結果を確認して次の採否を決める。

---

# 【最新 2026-11-03 K4BB 継続入口】Road5本物のUV-PBR路面・居住性のある公共建築内部

**旧K4BA/K4AZ/K4AYの「最新」は歴史資料。最優先は以下のK4BB現研究枝と[完全方針・実装正本](docs/R19_A6P4_R2F5K4BB_TRUE_B48_ROAD_PBR_INHABITED_CIVIC_JA.md)。**

- 最新研究枝 `research/k4bb-road5-pbr-civic-interiors-20261103`、K4BA最終HEAD `bb7ea19ec05bc05ddad54a51faeb69f302656f0e`から派生。main・production・`p101-velocity-overdrive-native-trial`・Draft PR #46不変更。
- K4BA v2編集可能source DCC [Actions #41625837609](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41625837609) SUCCESS、K4BA v2独立Road5/B51静的BVH [#41626249550](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41626249550) SUCCESS（限定範囲のみ）、**美術は正式ART REJECT**。現在の本物の6Camera新旧比較は [K4BA画像](docs/research-evidence/k4ba/K4BA_V2_SIX_TRUE_NUMERIC_SOURCE_CAMERA_K4AZ_AB_ART_REJECT.png)。
- **K4BB真正次工程**：元Road5の本当のB48 physical meshesを絶対に動かさずに、2K Albedo/Roughness/Height 3map、格子91x13に対応するBlender UV、編集可能な4種の用途別公共室を新コレクションに実制作。元本物のSourceCamera control11259/11278/11307、ultra11320/11341/11369で6 DCC画像＋artist aerial＋人間視点を作り、前工程同poseと厳格比較する。Road5源7道路28 B51 240Hzはすべて不変。Blender DCCは真正WebGL2ではない。
- **K4BBの確定制作成果**： [Actions #41631593534](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41631593534) **completed SUCCESS**、Artifact #13229226496（`.blend`、GLB、2K Road5アルベド/粗さ/高さ各PNG、実source Camera 6＋studio2の8DCC画像、K4BAと6同pose A/B）。独立PILで全ZIP 15件CRC0・全ファイルSHA一致、ALBEDO/ROUGHNESS/HEIGHT RGB標準偏差合計31.657/49.132/20.650で、以前のグレースケール全黒の欠陥は解消。**これは元ゲームWEBGL2ではなくDCCのみ**。K4BB公共用途の新編集可能オブジェクト167件。源B48 Road5 vertex/tri SHA一致、元B51/Camera/240Hz不変。
- **K4BBの独立限定BVH成功**：[Actions #41631656710](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41631656710) **completed SUCCESS**。K4BB新公共室167評価済オブジェクト・5,630面と元Road5 B48 4,728面＋本物B51の元6tick×28 OBBS=168体の静的三角形交差0件。**K4BA既存建築はこの新規監査には含まれない**。他6 B48道路、全時刻、真CCD/HUMAN/FPSは未認定。
- **実6Camera美術評価：ART REJECT**。鏡面バグを直し、実アルベド/粗さ/高さ3mapで道路が正しい質感になったが、真正Cameraでは4種の新室内の用途が読めない。インテリア独立撮影は暗闇から改善したものの、棚ではなく棒の乱雑な集合に見える。正面都市・左右屋根の世界的美術としての説得力も未達。技術SUCCESSをART PASSに読み替えない。
- **GitHub直接閲覧画像**： [K4BB 6×元Camera A/B](docs/research-evidence/k4bb/K4BB_SIX_SOURCE_NUMERIC_CAMERA_PBR_INTERIORS_ART_HOLD.png)、[室内実DCC](docs/research-evidence/k4bb/K4BB_INTERIOR_DESIGN_EYE_NOT_GAME.png)、[航空DCC](docs/research-evidence/k4bb/K4BB_HARBOR_AERIAL_DCC_NOT_GAME.png)、[2K Road5アルベド](docs/research-evidence/k4bb/K4BB_ROAD_PBR_2K_ALBEDO_STUDY_ONLY.png)、[SHA](docs/research-evidence/k4bb/K4BB_EDITABLE_SOURCE_SHA_ART_HOLD.json)。Actions #41631663301により研究ブランチ永続保存成功。手動ZIPダウンロード・PC操作不要。
- **次工程**：[K4BB正式正本](docs/R19_A6P4_R2F5K4BB_TRUE_B48_ROAD_PBR_INHABITED_CIVIC_JA.md)の末尾を先に読み、K4BC相当の**本物の高速Cameraで用途が読める公共建築・路面の大規模構造的意匠・都市風景の一体的再制作**へ。追加の雑なboxや色替えを重ねず、ART-FIRSTを維持。
- 最優先は世界水準の**全画面美術品質**。路面画像の色が変わるだけ／細い線が増える／CI GREENだけではART不合格。Source画面の本物のP100/B5安全表示の色を勝手に無断変更しない。元凍結blob `af076d67492a677d2235e4730aef8cdf4808e106`、元球半径0.65m、camera/240Hz/B48七/B51二十八/衝突/操作厳守。
- 正式ART 0件、Slope2 DNA 0m、ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE HOLD。Work事前承認／ユーザーPC操作ゼロを優先。

---

# 【最新・2026-11-03 K4BA 継続入口】Tidal Commons 真Road5全画面美術

**この上段を過去の旧「最新」より優先し、[K4BA正本](docs/R19_A6P4_R2F5K4BA_TIDAL_COMMONS_WHOLE_SCREEN_ART_REBUILD_JA.md)から引き継ぐ。**

- 現研究枝: `research/k4ba-road5-tidal-city-cinematic-art-rebuild-20261103`。K4AZの確定HEAD `a09b4b2f0548640e43c948b4ce8695b8c2a39f0a`から派生。main、本番、PR#46、公式継続ブランチは変更禁止。
- 直前までの実績: K4AZ v3の編集可能本物source Road5 DCC Actions #41616880506 **SUCCESS**、同v3の独立静的B48(4,728三角)×B51(168時刻OBB)非交差 Actions #41617855388 **SUCCESS**。それでも**正式ART REJECT**で、正式採用0、Slope2 DNA認定0m。
- **K4BA設計の根本差分**：広く単調な路面と奥に何もない空を克服するため、元Road5上面の実データサンプルへ植え付けたDCC-only路面PBR候補、両側の複数階の公共建築、公共用途のある大きな屋上連絡回廊、**元Road5物理終端の先の芸術専用海港展望施設と都市遠景**をBlenderで全面再制作。美術専用の物理終端以遠の風景は原ゲームに無い走行可能な道ではなく、衝突も生まない。元K4AZは比較用に編集可能保持・表示のみOFF。
- **絶対固定**: 元game Git Blob `af076d67492a677d2235e4730aef8cdf4808e106`、元source 240Hz/球0.65m、B48 7道路、B51 28、原Camera6 tick、操作、速度、衝突。Source DCC/CI PASSを真正WebGL2やART PASSと混同禁止。
- 今回着手コード: [K4BA Blender制作器](scripts/p101-k4ba-authentic-b48-tidal-commons-cinematic-city.py)、[K4BA専用CI](.github/workflows/p101-k4ba-real-road5-tidal-cinematic-city.yml)、[K4BA独立B48/B51接触検査](research/k4ba/independent_b48_b51_native_spatial_audit.py)。
- **K4BA v2 真正DCC制作完了**： [Actions #41625837609](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41625837609) **completed/SUCCESS**、Artifact #13224834813、編集可能 .blend/GLB、真source-camera 6DCC PNG＋1 studio画像＋K4AZ v3とのA/B。旧アート保存、源Road5全頂点/face fingerprint不変。v1 #41624877761 SUCCESS後、初版の浮いた彫刻問題から海岸地形/基壇/公共屋根のv2へ本当に再制作。技術成功と美術品質は別。
- **K4BA v2独立BVH**： [Actions #41626249550](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41626249550) **SUCCESS**。新建築743評価済オブジェクト163,068面 vs 原Road5本物B48 4,728三角＋元6tick×B51 28=168時刻OBBの**静的表面交差0件/0件**。他6B48道路／全走行時刻／人間操作・CCD・FPS・HUDは未検証。
- **K4BAの実画像はなお正式ART REJECT**。全画面建築と正面の施設が出現したが、広い路面の素材がまだ単調、建築用途・地形の接続・都市遠景の完成度が世界的レベルに達していない。紫の物理OBBはゲームのB51ビジュアルではない。オブジェクト数や色替え、pixel差でART通過させない。
- **GitHub内の直接見られる永続画像**： [6×真正source-camera同pose新旧比較](docs/research-evidence/k4ba/K4BA_V2_SIX_TRUE_NUMERIC_SOURCE_CAMERA_K4AZ_AB_ART_REJECT.png)、[航空アート審査](docs/research-evidence/k4ba/K4BA_V2_AERIAL_CITY_SUPPORT_SECTION_DCC_ART_REJECT.png)、[完全SHA](docs/research-evidence/k4ba/K4BA_V2_TRUE_SOURCE_BLENDER_SHA_ART_REJECT.json)。[Actions #41626584149](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41626584149)成功で本研究ブランチへ確実に永続保存。
- **次工程**： [K4BAの最終正本](docs/R19_A6P4_R2F5K4BA_TIDAL_COMMONS_WHOLE_SCREEN_ART_REBUILD_JA.md)末尾のART REJECTを尊重し、小物追加ではなく路面・建築内部・公共空間・遠景を真の元Cameraで満足できるよう全面的にデザイン再検討。他のB48原道路/安全表示の扱いは源データに基づくこと。Blender DCCは本物WebGL2ゲーム画面ではない。
- **恒久HOLD**：正式ART採用0件、Slope2 DNA0m、ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。Work事前承認、Chat＋GitHub中心、ユーザーのローカル操作最小化。

---

# 【2026-11-03 最新・K4AZから再開】DOPAGAKI SLOPE 継続入口

**この上段を旧「最新」記述より優先。** 目標は元240Hz高速物理と一体の**世界水準の全画面美術**。技術CI成功や画像差だけでART合格を主張しない。

- **現研究ブランチ**: `research/k4az-road5-civic-rift-dcc-recomposition-20261103`。正本：[`docs/R19_A6P4_R2F5K4AZ_CIVIC_RIFT_BLENDER_ARCHITECTURAL_RECOMPOSITION_JA.md`](docs/R19_A6P4_R2F5K4AZ_CIVIC_RIFT_BLENDER_ARCHITECTURAL_RECOMPOSITION_JA.md)。
- **元物理の正確な参照**: K4AY 成功 #41612254866、元B48 Road5 source index5 `p93-PRISM_CREST-01` = 4,728 triangles、源B51 28体×6 native ticks=168 collision OBB、Blender editable原本。凍結blob `af076d67492a677d2235e4730aef8cdf4808e106`。
- **新Blender-native建築初版**: K4AZ #41614997838 成功。再調整した明るい路面・屋上横断公共ギャラリー等のv2は #41615762837 成功（Artifact #13221930364）。旧K4AX建築は破壊せず隠して残し、Road5 original B48頂点ハッシュ不変、source camera6点とartist viewを出力。
- **独立幾何SOURCE限定成果**: #41616623231 SUCCESS、K4AZ v2建築評価対象290メッシュ/カーブ、59,120面と原Road5 B48 / 6tick×28体物理OBBの**三角形交差0件**。連続走行CCD・他の6道路の完全非干渉、HUMAN/FPSは未検証。v3に横滑り認定禁止。
- **現在のART判定**: v2の真正source-numeric Camera DCC画像は、まだ巨大な路面空白、切れる架空横断アーチ、建築用途の不足があるため**ART REJECT**。画像は元のWebGL2ゲーム画面ではない。
- **v3最終CI/実画像**: [#41616880506](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41616880506) **SUCCESS**、Artifact #13221369011。元Cameraで横断アーチがフレーム内へ入ったものの、**世界水準の品質不足でART REJECT**。6元Camera DCC A/Bとアーティスト画像は [GitHubに永続保存](docs/research-evidence/k4az/K4AZ_V3_SIX_SOURCE_NUMERIC_CAMERA_AB_DCC_ART_REJECT.png)。真正ゲームWebGL2ではない。
- **v3静的干渉も独立実証**: [#41617855388](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41617855388) **SUCCESS**。290 source DCC建築mesh/curve、58,544面 vs Road5 source B48 4,728 triangle とB51 168 native snapshot OBBの**交差0件**。CCD/HUMAN/FPS/他6道路は未認定。
- **次の実行**: [K4AZ v3完全審査正本](docs/R19_A6P4_R2F5K4AZ_CIVIC_RIFT_BLENDER_ARCHITECTURAL_RECOMPOSITION_JA.md)の末尾を先に読み、安易な細部追加ではなく**画面全体の建築・地形・実路面・遠景の美術品質の抜本再制作**を続ける。元source 240Hz/球半径0.65m/Camera/B48七道路・B51二十八体/操作/衝突/加速は改変禁止。
- **固定HOLD**：正式ART採用0件、Slope2 DNA認定0m、ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE HOLD、main・公式継続 `p101-velocity-overdrive-native-trial`・本番・Draft PR #46無変更。Workは必ず事前承認、ユーザー側PC手動ZIP不要。

---

# DOPAGAKI SLOPE — START HERE（新チャットの唯一の短い入口）

**更新：2026-11-03 11:36 JST**。このファイルは`research/k4aj-native-b51-gpu-depth-contiguous-window-20261103`研究ブランチの入口です。**最新CIとHEADは必ずその場でGitHub照合**すること。古い引き継ぎメモの「最新」「queued」を現在値として再利用しない。

## まず読む2つ

1. [完全統合引き継ぎ正本 — 目標・凍結契約・過去の教訓・検証証拠・次工程](docs/DOPAGAKI_COMPLETE_INTEGRATED_HANDOFF_20261103_JA.md)
2. [現工程K4AJのコード/真正GPU実測/独立監査契約](docs/R19_A6P4_R2F5K4AJ_ORIGINAL_NATIVE_B51_GPU_OCCLUSION_WINDOWS_JA.md)

元の長大な`DOPAGAKI_RESTART_JA.md`/`docs/DOPAGAKI_LIVE_HANDOFF.md`/`PROJECT_STATE.md`は重要な履歴だが、旧「最新」の追記が残っている。まず上記の統合正本を基準に、必要な旧フェーズだけ確認する。

## 現在の判定スナップショット

- 開発目標：**約7,280m、約52秒・200m/s級の本物のSlope2高速走行**と、世界水準の圧倒的な超未来都市造形を一体の人間プレイ体験で完成。ART-FIRST。**正式ART採用0件、Slope2 DNA認定0m**。
- 本来の継続ブランチ`p101-velocity-overdrive-native-trial`、[Draft PR #46](https://github.com/ryomashibaba/dopagaki-development-hub/pull/46) OPEN/unmerged（11/03確認HEAD `19d3a32d525c0c2a67082cba646898fab8f2b60f`）。**main・本番・PR#46に無断変更禁止**。
- 元source Blob`af076d67492a677d2235e4730aef8cdf4808e106`、元球半径0.65m/240Hz/Camera/B48道路7/B51元動体28体、Gold/P100/W9-X/B5と本番URL固定。隔離研究以外への反映禁止。
- **K4AI SOURCE GEOMETRY TECH限定PASS**：[Chromium真正1,442元tick実走行CI #41560614512](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41560614512)成功、[元Artifact SHA固定独立再監査CI #41561002955](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41561002955)成功。
- **K4AJ SOURCE GPU TECHは未確定／HOLD**：[現行CI #41566784540](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41566784540)は11/03 11:36時点で`queued`、Artifact0。100元GPU/100 B51 BODY全28体group mask/100元復元、300順次GPU seq、99連続native tick＋参照tick、独立5改ざん負例を検証。**本物のGPU結果なしに遮蔽秒数を報告しない**。新しいCIがあればそちらを実際に確認。
- K4AGにおける元個体ID`p95-hazard-12`のGPU原因確定は**tick11280に限定**。ほかのtickの単体IDはUNKNOWN。K4AIの幾何距離と、人間の視野遮蔽時間は別物。
- **ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD**、正式ART0件・Slope2 DNA0m、研究用モデル/Collider新規0。旧K4/K4R/K4U ART REJECTを勝手に覆さない。

## この次に実行する作業

1. GitHubでK4AJ研究ブランチ最新HEAD、[#41566784540](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41566784540)と、それ以降のrun、Artifact、PR#46を確認する。
2. CI成功ならArtifact ZIP/SHA/CRC、元画像・元GPU/復元depth、100×11,176データ・300seq・元K4AFアンカー/個体帰属の独立監査を実施し、**当該観測窓のGPU sampled-depth区間**のみ確定。失敗なら最初のエラーを根拠に最小修正。queuedなら**余計なworkflow対象pushによるCIキャンセルを避ける**。
3. SOURCE TECH PASSしてもART合格とせず、将来都市の大幅な美術改善につながる具体的ART-FIRST候補と本物の人間プレイ審査へ接続する。実コード改修・テスト・GitHub保存まで進める。
4. Chat + GitHub中心、ユーザーのローカルPC操作・ZIP作業を求めず、**Workは事前承認なしに使用しない**。最新の正本を随時更新し、新チャットに長大なプロンプト貼付を要求しない。

## 新チャットからの一文

「DOPAGAKI SLOPEをGitHubの`research/k4aj-native-b51-gpu-depth-contiguous-window-20261103`の**START_HERE.md**から完全に引き継いでください。統合正本・固定方針・反省点を守り、最新CIとDraft PR #46を実照合して次の正当な開発工程を実装・検証・GitHub保存まで進めてください。main・本番・Work無断使用は禁止です。」

## 2026-11-03 11:53 JST 追加：K4AK ART-FIRST 非干渉工程

K4AJ本命の[Actions #41566784540](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41566784540)は11:53 JST照会時点でも `queued`、Artifact 0件。**GPU遮蔽区間は未確定**。K4AJ対象script/workflowへ再pushしてキャンセルしない。

前工程の待機と並行して、[K4AK ART-FIRST審査設計](docs/R19_A6P4_R2F5K4AK_ART_FIRST_GPU_TO_TRUE_CAMERA_REVIEW_JA.md)、[K4AK読み取り専用レビューゲートPython](scripts/p101-r19a6p4r2f5k4ak-art-first-review-packet.py)、[専用の低負荷・非干渉CI #41568787273](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41568787273)を隔離研究ブランチへ追加。7種類の合成データ改ざん負例と真Artifact不足を拒否する設計。**専用GitHub CIの実行はqueuedでありPASSではない**。K4AJ生Artifactの真SHA/CRC/全GPU深度監査はこのスクリプトで代替できない。元ゲーム、main、PR#46、本番、元ソースblob、B48/B51、Camera、元物理は変更なし。

次はまずK4AJ・K4AKのCIの実行結果と生Artifactを確認し、K4AJがSUCCESSなら生SHA/CRCを独立検証した後に限ってK4AKを**実Artifactに適用**する。ARTは未制作のRoad5《斜裂公共峡谷》構図1方向を真正元カメラのA/Bで検討する方針だが、現状の新ART候補モデル0、正式採用0、Slope2 DNA0m、HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。過去K4/R/U不採用は変更しない。

## 2026-11-03 K4AL：真正RGBの取得不足を静的計算・コード検証（K4AJ/K4AK非干渉）

[ART-FIRST RGB証拠照合と次工程](docs/R19_A6P4_R2F5K4AL_ORIGINAL_RGB_EVIDENCE_COVERAGE_AND_ART_FIRST_JA.md)、[K4AL実装](scripts/p101-r19a6p4r2f5k4al-true-rgb-coverage-audit.py)、[合成100ケースE2Eと5負例テスト](tests/p101-r19a6p4r2f5k4al-rgb-coverage.test.py)を同研究ブランチへ保存。撮影**計画上**、K4AJ元RGB画像は8時点（元/mask/復元×各1）、K4AK ART-FIRST審査要求は15時点。共通6／未撮影9／追加2を検出。**まだ真正画像の実取得成功ではない**。K4ALの自己検証・100合成ケースE2Eと5改ざん負例はローカルPASS、真Artifact適用はHOLD。queuedのK4AJ #41566784540／K4AK #41568787273をキャンセルさせないため、それぞれのworkflow対象scriptは変更せず、独立K4ALファイルと文書のみ追加。**直近のCI結果は必ず再照会**。真K4AJ ZIP/SHA/CRC/生depth独立PASS後だけK4AK→K4ALの順に適用。正式ART採用0件／Slope2 DNA認定0m、HUMAN/SAT/CCD/FPS/RELEASE/MERGE HOLD、本番・main・PR#46不変更。

## 2026-11-03 K4AM：ART審査用の真正元RGB9時点欠落を補う独立実装

[K4AM設計・審査契約](docs/R19_A6P4_R2F5K4AM_NINE_MISSING_ORIGINAL_RGB_TRUE_WEBGL2_JA.md)に従い、[真正Chromium取得コード](scripts/p101-r19a6p4r2f5k4am-genuine-original-nine-rgb-gaps.mjs)、[独立GPU/RGB監査](scripts/p101-r19a6p4r2f5k4am-independent-nine-rgb-depth-audit.py)、[合成負例](tests/p101-r19a6p4r2f5k4am-independent-native-rgb-depth.test.py)、[専用CI](.github/workflows/p101-r19a6p4r2f5k4am-original-nine-missing-rgb.yml)を隔離研究ブランチへ保存。K4ALで判明した元RGB不足9tick＝14m:11326/11338/11349/11351/11363、28m:11265/11277/11284/11301に限定し、元RGB／B51全28体group visual mask／復元RGBの**各3枚×9tick=27PNG**、**本物のGPU readback 27本・各11,176点**を取得する実装。元K4AI確定生JSON SHAと元ゲームsource blob固定。**GitHub CI実測結果・Artifactが確認されるまで完了PASS扱い禁止**。K4AJ、K4AK、K4AMの3 CIは独立。元HOLDをすべて継続し、新ARTモデル0、正式採用0、Slope2 DNA0m、PR#46・main・本番不変更。

次は3本のCI結果を実照合し、成功時のみK4AJ生Artifact SHA/CRC/depth独立監査→K4AK実レビューpacket→K4AL＋K4AM元RGB真正画像SHA突合→候補デザインの元cameraでのA/B審査へ進める。単に15元RGBが揃っても**人間可読性や新候補ARTは未検証**。

## 2026-11-03 K4AJ真GPU成功・K4AN本物のART-FIRST原画検査へ（今回の最新）

- **K4AJ GitHub Actions #41566784540 completed/success**。真正Artifact #13201661563、**11,959,523 bytes／ZIP SHA-256 `60aab331d8881b5f8f456539c00566837a2b061a96ab0725ce7c17ea91ed8efb`**、28件CRCすべてPASS。実生GPU 100元／100全B51 group mask／100復元×11,176点、300seq連番・元深度完全復元を別環境で独立再計算。詳細：[K4AJ最終実証](docs/R19_A6P4_R2F5K4AJ_CONFIRMED_100_NATIVE_GPU_DEPTH_ART_HOLD_20261103_JA.md)。
- 元GPU深度格子でB51群の寄与が1点以上の元native tick：**14m 39/50（11320–11350、11362–11369）**、**28m 38/49（11259–11288、11300–11307）**。最大は14m tick11339で11,176/11,176=100%、28m tick11277で6,396/11,176=57.2298%。tick数÷240秒の数値を**人間の視界遮蔽秒数と誤認しない**。個体別原因帰属はK4AGのtick11280だけ。
- 元sourceの実8時点×元/mask/復元PNGを目視・独立SHA検証。14m tick11341では元B51形状が大きく画面を覆い、群maskで道路が見える。**これは人間プレイ・ART合格の評価ではない**。
- [K4AN独立レビューコード](scripts/p101-r19a6p4r2f5k4an-original-rgb-review-sheets.py)／[K4AN実Artifact統合専用CI](.github/workflows/p101-r19a6p4r2f5k4an-pinned-real-gpu-to-art-review.yml)／[日本語契約](docs/R19_A6P4_R2F5K4AN_REAL_ART_FIRST_SOURCE_RGB_ATLAS_JA.md)を隔離研究ブランチへ保存。[Actions #41572736850](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41572736850)は作成直後queued。K4ANは本物の元K4AJ ZIPをSHA pinし、K4AK→K4ALを実Artifactで走らせ、元RGB比較2枚とレビューJSONを研究ブランチ `docs/research-evidence/k4an/` へ直接保存する設定。**CIの実成功とGitHub画像保存を確認するまではHOLD**。
- K4AK #41568787273、K4AM #41571299893は前照会ではqueued。次回は三つのrunとArtifactを実照会する。K4AJ成功をK4AM成功に横滑りさせない。
- 今後はGPU測定の反復ではなく、原画で見えるB51と公共空洞の関係を踏まえて未制作Road5《斜裂公共峡谷》の**本物のART-FIRST単一候補**を独立研究。候補の元source同poseカメラA/B・三層公共空洞・人間走行を審査するまで、ART正式0件／Slope2 DNA0m／HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。main・元source/Camera/240Hz球/B48×7/B51×28・本番URL・Draft PR#46不変更。Work事前承認。

## 2026-11-03 K4AO — 真正元RGBの対話式レビューとART-FIRST重点6tick

- [K4AO詳細正本](docs/R19_A6P4_R2F5K4AO_REAL_SOURCE_CAMERA_ART_REVIEW_JA.md)、[再現用Python](scripts/p101-r19a6p4r2f5k4ao-source-only-offline-art-review.py)、[K4AK要求15tickの実測ピン留めJSON](docs/research-evidence/k4ao/K4AO_TRUE_GPU_DEPTH_15_ART_CAMERA_REVIEW_ANCHORS.json)を隔離研究ブランチに保存。K4AJ真ZIP ID 13201661563／SHA-256 `60aab331d8881b5f8f456539c00566837a2b061a96ab0725ce7c17ea91ed8efb` から本物の8元source RGBとB51全28体群mask RGBを比較する完全オフラインHTMLをローカル生成、真PNG SHA/元復元GPU11,176点/100-case CSV突合・JS構文検証PASS。**元B51描画除去は研究用比較のみで元ゲームを改変しない**。
- 重点真正カメラtick：14m **11338（93.951%）／11341（100%）／11349（47.423%）**、28m **11277（57.230%）／11280（53.436%）／11284（37.938%）**。数値は11,176点の**B51群GPU深度サンプル変化**であり肉眼の遮蔽率ではない。実元RGBは要求15中6tick、残り9はK4AM真CI実測待ち。K4AOの新モデル0、ART正式採用0件、Slope2 DNA0m、HUMAN/SAT/CCD/FPS/RELEASE/MERGE HOLD。
- 次はK4AK #41568787273、K4AM #41571299893、K4AN #41572736850を実照合。CI未完了を成功とせず、K4ANの本物の審査アトラス＋K4AM不足9tick真正RGBを収束させた後、Road5《斜裂公共峡谷》の**一候補の真正同源Camera RGB A/B**を初めて制作・ART審査する。旧K4/K4R/K4U ART REJECTを再採用せず、main／原source／Camera／球240Hz／B48×7／B51×28／本番／PR#46を変更しない。Work事前承認。

## 2026-11-03 K4AP：真GPU画面三区分が覆した「高遮蔽tickで都市を読ませる」仮説

[K4AP ART-FIRST二段構成の報告](docs/R19_A6P4_R2F5K4AP_ART_FIRST_TWO_BEAT_TRUE_SOURCE_CAMERA_JA.md)／[真ZIP読取・127×88深度格子三区分解析器](scripts/p101-r19a6p4r2f5k4ap-real-b51-gpu-camera-beats.py)／[GitHub永続保存された検算サマリー](docs/research-evidence/k4ap/K4AP_REAL_SOURCE_B51_GPU_HORIZONTAL_THIRDS_SUMMARY.json)を研究ブランチへ追加。K4AJ真Artifact #13201661563のSHA固定ZIPをローカル独立再計算：14m 50tickのB51群除去GPU深度格子サンプル変化率は**左23.474%／中34.400%／右31.885%**、28m 49tickでは**左9.635%／中20.407%／右16.108%**（元11,176サンプル・各native tick集計）。14m **tick11339–11347の9連続tickで全三区分の11,176点すべて変化**。逆に14m 11351–11361、28m 11289–11299の各11tickは同group maskの変化検出0。これは**人間の全画面遮蔽、空き地、衝突安全、建築可読性を意味しない**。

**新しい正当なART-FIRST判断**：既決定のRoad5《斜裂公共峡谷》を**危険前の都市峡谷入口／危険後の中段公共テラスと遠方広場**という「二段の視覚構成」で1方向だけ検討し、真正B51の中心危険時点に巨大建築を重ねて都市の見栄えを稼ぐ案はやめる。K4AOの高遮蔽重点tickは**B51可読性を保護する審査点**であり、新都市が同じ画面で読める合格点ではない。真の人間視認時間はUNKNOWN。旧K4/R/U ART REJECT、正式ART0、Slope2 DNA0m、新候補モデル0、HUMAN/SAT/CCD/FPS/RELEASE/MERGE HOLDを厳守。

**次は**K4AM #41571299893の不足9枚真RGB・K4AN #41572736850の実Artレビュー画像をまず照合、成功時だけ真正元Cam同poseのBlender-native一案A/B制作に進む。K4AK #41568787273は合成QA SUCCESS済み。main／本番／PR#46／凍結source／B48 7／B51 28／元物理・カメラ不変更、Workは事前承認。新CIを増やさない。


## 2026-11-03 K4AQ — ART-FIRST画面全体の抜本再設計（新隔離研究ブランチ）
新しいユーザー指摘では、既存の画面は単に「都市でない」のではなく、**画面全体の色彩・素材・造形・ライティング・密度が雑で、評価できる美術がほとんどない**ことが最重要。技術計測の反復を主目的とすることは禁止。今回の **研究ブランチ `research/k4aq-road5-art-direction-rebuild-20261103`** でRoad5《斜裂公共峡谷》の美術制作を実際に開始。詳報：[K4AQ画面美術再設計と実装・真正カメラ審査契約](docs/R19_A6P4_R2F5K4AQ_ROAD5_FULL_SCREEN_ART_DIRECTION_JA.md)。

実装：`web/p101-k4aq-road5-civic-rift-material-art.mjs` に非対称の多層居住・公共都市構造、8素材マテリアル、独立WebGL2法線照明を作成。既存K4AD元sourceを完全隔離複製し、元240Hz／Camera／B48×7／B51×28／元source blobを触らず、真正原カメラ6tick×旧新計12 PNGの取得コードと専用CIを追加。既存K4AM/K4ANは独立runとして保持。新候補の真WebGL2スクリーンショットを実際に見て厳しく審査するまで**ART NOT_TESTED/HOLD、正式ART0件、Slope2 DNA0m、HUMAN/SAT/CCD/FPS/RELEASE/MERGE HOLD**。main・本番・PR #46は変更しない。次は新CI／Artifactsを照合し、真正画像で美術的に改善したか評価する。資料中の旧「最新HEAD」は必ずAPIで再取得すること。


## 2026-11-03 K4AR — 建築が本当に映ったかを空から分離する最新継続入口

**現継続研究ブランチ**：research/k4ar-road5-massing-and-true-mesh-evidence-20261103。今回の引き継ぎ・固定方針・問題点・次工程は [K4AR詳細正本](docs/R19_A6P4_R2F5K4AR_TRUE_CAMERA_THREE_WAY_ARCHITECTURE_PIXEL_GATE_JA.md) を読む。

**決定的な穴**：K4AQの元/新A/BのRGB差は空色変化だけでも成立し、新建築が映っている証明にならない。K4ARに、元source同native tick 6×（original／sky-only／sky+architecture）=18真正WebGL2 PNG・元Camera/B48/B51保護・独立PNG SHA/画素監査を実装。専用Actions #41585003708は作成直後queuedであり、ARTや画素検証はまだPASSではない。

次回はまず旧K4AQ [#41580058193](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41580058193) と新K4AR [#41585003708](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41585003708) の**現在**のstatus/jobs/Artifactを実照合。成功なら本物の18画像を開いて美術を厳しく審査。まだqueued/runningなら無用なworkflow対象pushやCIキャンセルをしない。新しい建築が画面に出ても、箱形11棟と繰返し配色が悪ければART REJECTとして一方向を再設計。単なる画素数や三角形数で認定しない。

K4AN [#41572736850](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41572736850) は2026-11-03にSOURCE RGBレビューCI SUCCESS、旧研究枝に比較PNG保存済み。新美術の実画面とは異なる。PR#46はOPEN/Draft/未マージ。main／本番／元source blob af076d67492a677d2235e4730aef8cdf4808e106／元物理・Camera・B48道路7・B51動体28は変更せず、Work事前承認制を守る。

**未変化判定**：ART正式0件、Slope2 DNA0m、ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。


## 2026-11-03 K4AS — 現在の継続入口（全画面の道路・B51素材美術）

**現在作業を継続する研究枝**：research/k4as-road5-native-screen-material-rescue-20261103。K4ARの真正3群比較を継承した美術改善実装。詳細：[K4AS元画面美術改善正本](docs/R19_A6P4_R2F5K4AS_ROAD5_NATIVE_SCREEN_MATERIAL_RESCUE_JA.md)。

K4AJの真正元Road5画像で確認した画面全体の彩度・単純色面問題に対し、**元のsource 240Hz／Camera／B48×7／B51×28のXYZ・当たり判定は変えず**、Road5元sourceカメラが実際にRoad5を描く場合だけ、研究用B48マット路面、A13元路面装飾の統一パレット、B51赤失敗／黄反発／紫押出しを保持した暗色装甲を描画する。K4AQの天空・建築もそのまま比較可能。元の他6道路／Gold／P100／W9-X／B5とmain／本番／PR#46は無変更。

**新実装**：web/p101-k4as-road5-original-screen-material-system.mjs、private-road5-material-pack、unit tests、24枚の元WebGL2同camera（original／sky-only／city／city+materials）撮影、独立画像SHA／画素監査＋比較シート、独立CI [#41589057566](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41589057566)。

**最新実測値はGitHubで再照合**：作成直後K4AS CIはqueuedで真正新画像0、K4AQ #41580058193はpending、K4AR #41585003708はqueued。K4ARに実コードのレポート出力名不整合があるので、そのCI成功を推定しない。**K4ASも新造形/世界水準のART品質は未検証で正式採用0、Slope2 DNA0m、HUMAN/SAT/CCD/FPS/RELEASE/MERGE HOLD**。ロード素材の色変更を美術合格と混同しない。次は実24PNGの画面審査、問題が残ればロード形状・建物・照明・公共空洞を本物の世界水準へ再設計。

Workは事前許可なしに使用しない。ユーザーのローカル操作不要。旧K4/K4R/K4U ART REJECTを覆さない。


## K4AS修正引き継ぎ（2026-11-03 16:04 JST以降）

**最優先入口**：[K4AS正本の真Artifact解析追記](docs/R19_A6P4_R2F5K4AS_ROAD5_NATIVE_SCREEN_MATERIAL_RESCUE_JA.md)。

K4AQ #41580058193／K4AR #41585003708／K4AS #41589057566は**全てcompleted/failure**。3本の本物のArtifact JSONで、初期化JavaScript **Cannot access 'r19a1OptIn' before initialization** を確認（120s timeoutは二次症状）。旧版の「待機」「成功見込み」を現在値に使わない。これまでの真正新候補PNG取得は0枚、ART正式0件。

K4AS隔離枝のみでK4AQのprivate pack内のr19a1OptIn先読みをlocalhost+明示URL条件直接照合に修正、再度の診断用pageerror fail-fastを追加。専用[修正後Actions #41594250729](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41594250729)は起動直後queued。**CI success／新ART画像や実FPSは未確認**。次担当はそのrunの本当のstatus/jobs/log/Artifactを最優先照合。元K4AQ/AR研究枝を重複実行せず、K4ASの真正元cam 6tick×original/sky/city/material=24画像と独立SHA＋コンタクトシートを取得・目視、未達なら本物の失敗症状を修正。

main・本番・元source blob af076d67492a677d2235e4730aef8cdf4808e106・元Camera/240Hz/B48×7/B51×28・Draft PR#46無変更、Work事前承認、ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。


## 2026-11-03 K4AT — 最新の継続入口：本物の元カメラ画像に基づく造形改善

**継続研究ブランチ**：research/k4at-road5-civic-canyon-sculpted-architecture-20261103。前K4ASの[TRUE native 24画像artifact #13211991425](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41594250729/artifacts/13211991425)の**生RGB全24枚**を独立確認。SOURCE SCREEN MATERIAL TECH限定PASS。しかし視覚的には広い単調な道路・残留多色線・ほぼ黒い空・右側だけの繰返し箱建築・公共奥行きの不足で、K4ASは**ART REJECT**（正式ART採用0）。素材変更だけでは世界水準にならない。

新K4AT一方向は[美術/固定契約](docs/R19_A6P4_R2F5K4AT_TRUE_CAMERA_CIVIC_SCULPTURE_ART_FIRST_JA.md)に従い、Road5の実B48座標に固定した**巨大非対称曲面シェル・抜けのあるアトリウム・奥まった暖色ガラス公共テラス5層・回転テーパー塔2棟**、元曲線バンク路面上の非衝突細分目地を研究制作。旧K4AQの反復箱街区を置換し（重ねない）、元Road5 B48/B51/CAMERA/物理は触らず、元WebGL2画面6時点×K4AS/K4AT=12枚で真評価する。元B51がCameraを塞ぐultra tick11341では建築可視を無理に通さない。

**最初の新CI #41595951481 failure**：形状テスト5件中2件FAIL。voidLongitudinalCellsの全閉鎖路面は、架空の支え床を作る代わりに0描画を合法化して修正。**2本目 #41596237031 failure**：5件中残る1件、9,918 trianglesのうち840成分が非有限。真ログから更に診断し、ねじれた塔のブロンズ継ぎ目の4頂点目でz指定を欠いていた一箇所 `local(f,vb[0]-off,vb[1]-off)` を `local(f,vb[0]-off,vb[1]-off,vb[2])` に修正。関数を独立V8合成スタブで再評価して9,918 triangles / 208,278数値/有限PASS、元doc不変。GitHub真正CIの検証とは別物なので混同しない。

**K4AT更新後専用 [#41596692908](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41596692908)** は最終確認時QUEUED、12真正新RGB/ART判断は未実測。新Runの実Status/jobs/Artifactを必ず確認。次は真正6視点のコンタクトシートを開いて、今回の曲面建築が本当に画面に映り、単純な雑造形を脱したか厳しく評価。届かなければART REJECTのまま設計再検討。元モデルblob af076d67492a677d2235e4730aef8cdf4808e106／240Hz／Camera／B48 7／B51 28／main／本番／Draft PR#46 unchanged、Work事前承認、HUMAN/SAT/CCD/FPS/RELEASE/MERGE HOLD。


## K4AU （2026-11-03）現在の唯一の次工程／引き継ぎ入口

**最新隔離美術研究枝**：research/k4au-road5-genuine-material-lighting-20261103。まず[K4AU正本](docs/R19_A6P4_R2F5K4AU_TRUE_SOURCE_MATERIAL_LIGHTING_ART_REVIEW_JA.md)へ。従前K4AT GitHub [#41596692908](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41596692908) は**完了SUCCESS**、本物12画像+元データSHA監査実成功、Artifact #13212149720を取得。K4ATの元cam画像を直接見た結果、両側斜めの巨大梁・レトロで反復的な立面と、現状ほぼ黒いB51機械箱と色面だけの道路・黒い空・大きな空虚部が目立ち、品質目標には未達のため**ART REJECT**。ART正式採用は0件。

K4AUは街区の量産を一旦やめ、**元の実物B48道路と元B51実動体28の原VBO/姿勢を変えず**、同じ原Camera WebGL2に面法線によるライティング・金属表面ノイズ・石材/アスファルト微細質感・パネル目地・実警告の赤/琥珀/紫を実装する。独立起動 `k4aq=on&k4as=materials&k4at=on&k4au=on` のみ、元ART候補とのnative 6時点×2=12真正source PNGを比較。試験はsource改変拒否／元球/camera/B48/B51検証／実GPUコンパイルと独立PNG画素監査。最初の専用 [CI #41598855479](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41598855479) は作成時QUEUED。**実際の新GPU成功/ART改善は未検証、次担当が最新run/jobs/Artifactを読む**。失敗ならログ原因を最小修正、成功なら本物の12画像を目視して美術の結果を厳しく判定する。

不変：元物理240Hz／0.65m球／実B48七章/B51 28／元カメラ・当たり判定／source blob af076d67492a677d2235e4730aef8cdf4808e106、main・本番・Draft PR #46変更禁止、Work事前承認、正式ART/Slope2 DNA0件、HUMAN/SAT/CCD/FPS/RELEASE/MERGE HOLD。


## K4AU 完了審査と次のART-FIRST出口（2026-11-03 JST）

旧入口のK4AU #41598855479 は**completed/SUCCESS**になった。旧QUEUED記述は履歴であり現在状態ではない。真正Chromium source-native 12PNG+独立SHA監査 [Artifact #13213758069](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41598855479/artifacts/13213758069)。真元カメラ6tickで元B48路面/元B51実28動体を変えず GPU材質陰影効果を実測し、RGB差は 280,890～592,547px/707,400px。**SOURCE SCREEN MATERIAL TECH限定PASS**だが、実画像目視で「路面がやや実材質らしくなった」「B51機械の面陰影が出た」に留まり、大規模に単調な路面、黒空、左右長大梁、繰返しの建築ファサード、巨大B51の視界妨害は残存。**K4AUも正式ART REJECT。正式採用0件、Slope2 DNA0m、全HUMAN/SAT/CCD/FPS/RELEASE/MERGE HOLD。** 正本：[K4AU完成レビューと次工程](docs/R19_A6P4_R2F5K4AU_TRUE_SOURCE_MATERIAL_LIGHTING_ART_REVIEW_JA.md)。

**次の正当な工程**：最終画面の美術レベルを先に変える大改修を別研究枝に一候補だけ制作。暗空の広い背景＋同型直方体ファサード・斜め梁を繰り返すという既往の根本問題へ直接対応。高い意匠を持つ本当に利用される公共空洞・可読な超未来都市・光/大気/遠景・人間スケールの層を構築し、元native 6tickの真画面A/Bで品質を判定。小さい色替え、技術ゲートの追加、単調な箱/輪の増築の繰り返しをしない。元B51の危険シーンを美術だけで隠したり物理を改変したりしない。

研究のGitHubのみ作業。main・本番・Draft PR #46、元source blob af076d67492a677d2235e4730aef8cdf4808e106、元Camera/球/240Hz/B48実7・B51実28不変更。Workはユーザーの事前承認制。ユーザー側ローカル操作不要。


## 2026-11-03 K4AV：コースの根本的に酷いビジュアルを抜本的に直す研究

**最新の継続する隔離研究枝**：research/k4av-road5-full-screen-art-reset-20261103。固定方針・理由・ART受入禁止条件は [K4AV 全画面美術再構築憲章](docs/R19_A6P4_R2F5K4AV_FULL_SCREEN_ART_RESET_CHARTER_JA.md) を読む。

真正K4AU WebGL2画像を再確認すると、元道路全体が平板な雑配色、障害物は巨大箱、超未来都市は同型ファサードの繰返し、黒い空、斜め梁、公共空間の使われ方の不在という**全画面の美術失敗**が残る。過去のK4AS/K4AT/K4AUはTECH限定PASSだが美術**全REJECT**。元Road5のART正式採用0件／Slope2 DNA0m。

**K4AV実装**：道路の実B48を根拠に、巨大ゲートや繰り返しの箱を撤去して別の独立した公共建築都市一案に置換。曲面屋根の公共ホール、5層級のガラス駅・市民回廊/中庭、複数形式の塔、実道路端の物理的に筋の通った低い側面構造。雑多な蛍光三角形の**非衝突**装飾だけを研究用描画から取り除き、元道路・危険・源B51動体・物理は維持。新の青灰→暖色水平線の大気・雲と奥行きを別のWebGL2天空プログラムで生成。元K4AUの実動体/路面材質効果は継続。

**真正3群画面検証**：元K4AU画面／新大気＋旧道路・都市なし／新大気＋新公共都市を、**真の元native Road5 6tick×3=18PNG**で比較。空の色が変わっただけでは新建築が見えた証明にしない。真球・元Camera/B51完全同一性、独立PNG SHA/画素差を検証。ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE HOLD維持。見栄えが悪ければ正式REJECT。

**不変**：凍結source blob af076d67492a677d2235e4730aef8cdf4808e106、240Hz／球半径0.65m／実B48七道路・実B51二十八動体／元カメラ/衝突、main・本番・Draft PR #46変更禁止。Work事前承認。ユーザーに手動ZIP・ローカル実行を要求しない。

今後は前回のように「色が少し変わった」「線が増えた」だけで進展と宣言しない。ゲームの画面全体が世界的なゲームの美術として成立するかを先に評価する。


## 2026-11-03 K4AV の真正画像審査による開発方針転換【これが最新・上位判断】

**重要：K4AVも正式ART REJECT。** 過去にこのSTART_HERE内で「K4AV実装／ART HOLD／CI検証待ち」と書かれていても、いまは最終実測で更新済み。この判断を優先する。

[K4AV詳細ART REJECT/次工程正本](docs/R19_A6P4_R2F5K4AV_FULL_SCREEN_ART_RESET_CHARTER_JA.md) を最初に読む。K4AV [Actions #41601799002](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41601799002) **completed/SUCCESS**、18枚本物の元Road5 source native Camera + independent SHA監査 [Artifact #13214568215](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41601799002/artifacts/13214568215)。source B48 7/B51 28/240Hz/Camera等不変。6フレーム中5フレームは新都市描画のpixel差が9.1〜12.6%、超巨大なB51で完全視界遮断されるultra11341は0%。これらは**技術的に描画された証拠のみ**。

実画像の品質は依然として酷い。空色/斜め梁だけは少し改善したが、コースは巨大な灰色平面にピンク/水色線が残り、都市も繰返しの水平帯箱ファサード。元B51が正面視野を奪う問題も変わらない。ART REJECT・正式ART採用0件・Slope2 DNA認定0m。**K4AS/K4AT/K4AU/K4AVのソースTECH成果をART成果扱いせず、同型のJS自動生成の再発は禁止。**

**新しい継続工程はロードのArt-First/DCC-first立て直し**。元WebGL2/source Cameraで残存する色付き図形の本当の描画レイヤーと安全意味を監査→Blender等の編集可能な立体原本・PBR/UV/ライト/建築内部・地形/都市遠景をRoad5の一つのHero短区間に手を入れてアート先行制作→原Camera代表3構図で厳格ART審査→合格したものだけ実WebGL2移植/元source 240Hz高速走行審査。**道路パレットの微調整・箱の数/三角形数/TECH PASSの増加で見栄え改善と主張する手法を停止**。本番/PR#46/mainや元物理を変更しない。Work事前許可、ユーザーのローカル操作なし。

次の担当は新しい研究ブランチやCIを先に乱発せず、元画面のアート作法と実描画レイヤーを把握して「今までと根本的に違う完成度のHero区間」を最優先に実制作する。原画像上で現代的なプロゲームのアート品質と明確に認められないなら採用しない。


## 2026-11-03 K4AW→K4AX　最新の唯一の継続入口：真の路面塗装発生源→編集可能Blender原本

**過去のK4AV/旧K4AS-K4AUの「描画TECH成功」を美術成功と誤認しない。** ユーザー評価は「まだコースのビジュアルが酷い」。正式ART採用0件・Slope2 DNA正式認定0m。旧不採用を上書きしない。K4AX以降もART-FIRST/DCC-FIRSTへ制作方法を切替え、ただの箱追加・色替え・TECHゲートの積上げは禁止。

### 最新GitHubブランチ
`research/k4ax-road5-editable-blender-civic-exchange-20261103`。最新の[**原因確定資料／Blender工程の統合正本**](docs/R19_A6P4_R2F5K4AW_K4AX_SOURCE_COLORS_AND_BLENDER_ART_FIRST_JA.md)を最優先で読む。元K4AV正本は履歴として維持。

### K4AW：ピンク・シアンが消えなかった理由が本物の元カメラで確定
[Actions #41604593198](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41604593198) completed/SUCCESS、[原Artifact #13216820565](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41604593198/artifacts/13216820565) で**元native Road5真正WebGL2×2時点×8描画群＝16PNG・独立SHA/色閾値監査**が成立。元物理/B48七/B51二十八/元カメラ完全不変。元色面はK4AVで既にOFFのA13ではなく、**P100道路視認マーカー（control明るいピンク−2,491px）とB5道路演出（同−1,185px）から強く出ている**。元道路端表示・B51警告からシアンも生じる。W9C1は元GPU draw呼出1ながら、この2時点の描画画素差0。個別寄与は重なりがあり足し算不可。**P100/B5/路端/B51の安全表示は実ゲームから無断削除不可。** 研究用マスクは安全性が検証されていない非プレイ画面。

### K4AX：3Dオブジェクトを自動box量産する方式を停止し、実Blender原本へ
[元sourceカメラ6時点のSHA固定JSON](docs/K4AX_TRUE_SOURCE_ROAD5_CAMERA_REFERENCE_20261103.json)、`scripts/p101-r19a6p4r2f5k4ax-blender-editable-tidal-exchange.py`、[Blender CI](https://github.com/ryomashibaba/dopagaki-development-hub/actions?query=branch%3Aresearch%2Fk4ax-road5-editable-blender-civic-exchange-20261103)。真Blenderで**単一の研究Hero区間「Tidal Exchange」**（二重曲率の厚いセラミック屋根・開いた市民広場／水盤・入口の奥まったガラス・木製家具・植栽・穏やかな暖色内装／1本の遠景ねじり塔）を編集可能なネイティブ`.blend`と`.glb`として生成、元Camera数値control11259/11278/11307から3枚のDCCプレビューをレンダリングするコードを作成済み。

**注意：DCCの3画像は「元Cameraの数値を利用したBlender独立プレビュー」であって、「元のWebGL2ゲームを描画した正規映像」ではない**。元B48/実B51/元HUD/衝突をスタジオへ統合していないので**源道路・危険物との干渉、安全な公共床、HUMAN/FPS、ARTはまだ何も保証されない**。Blender正本をゲームへ許可なく取り込まない。

初回DCC CIはPython構文でFAIL、改訂RunはUbuntu版BlenderでOpenImageDenoiser未ビルドのためレンダリングFAIL（ただし.editable .blend原本の生成までは到達）。修正では元物理に触れずデノイザ不使用・Cycles 24 samplesで再実行。**成功・真PNG目視・素材品質・クリアランスPASS等は最新CIと実Artifactを現時点で再確認するまで未認定**。

### 次担当の実行順序
最新K4AX GitHub Actionsの**本当の** status/jobs/Artifactを先に再照合。レンダ成功なら真实`.blend`/GLBとDCC PNGを開いて厳しくART審査。酷いならART REJECTしアート原本を本格改修、単なるカラーノイズやBOX増築を繰り返さない。候補が審査に値した時のみ、元B48真正曲面＋B51実動体との空間クリアランスを新たに計測し、source PRIVATE WebGL2へ導入、本当の元ゲーム画面／元240Hz本走行で再審査。P100/B5等の安全な代替表示は別課題として保持。

**絶対禁止**：元source blob `af076d67492a677d2235e4730aef8cdf4808e106`、240Hz物理・球半径0.65m、元Camera・B48 7/B51 28、Gold/P100/W9-X/B5、main、本番、Draft PR#46の変更。Work事前承認、ユーザーにローカルZIP等操作要求禁止。ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD、正式採用0件。


---

## 【最優先・2026-11-03最終】K4AY完全統合引き継ぎ／ART-FIRST・DCC-FIRST継続

**新しいチャットはこの項目のリンク先が最新の引き継ぎ正本。** 過去節の「QUEUED」「次はK4AV/K4AW/K4AX」の記述は当時の履歴。最新判断は必ずこの節から辿る。

### [2026-11-03 K4AY 完全統合引き継ぎ正本（方針・過去の失敗・最新CI・制作着手点）](docs/DOPAGAKI_20261103_K4AY_COMPLETE_INTEGRATED_HANDOFF_JA.md)

**現在の継続研究枝**：\`research/k4ay-road5-authentic-b48-blender-context-20261103\`。K4AXのHEAD \`8be964ea841e505f03bbce0a15b0d95785edf400\` を基点に作成し、まだRoad5真正B48/B51のBlender統合コードは**未実装**（引き継ぎ正本のみ保存済）。本当に実装済みのように報告禁止。

**直前の事実**：K4AW元Road5 16 PNG source-layer監査 Actions #41604593198 SUCCESS。ピンク色の主要描画元はP100路面視認マーカーとB5演出（control側それぞれピンク−2,491/−1,185px）、水色は源路端/案内とB51危険ガイドの寄与が大きい可能性。安全表示を勝手に消さない。K4AX編集可能Blender \`.blend\`＋\`.glb\`＋3 source-pose DCC画像＋1 artist-camera画像 Actions #41607194912 SUCCESSだが、実Road5 B48物理サーフェス・B51実動体がBlender内に未収録で、建築構図の黒空白・連続性欠如等の美術問題が残る。**正式ART採用0、Slope2 DNA0m、K4AXアート未採用**。Blenderプレビューは元の240Hz WebGL2走行画面ではない。

**次工程**：実source \`private/reference_only/director/surface.js\` の \`sample/frame/tessellate\` と本物のRoad5 stage、\`private/reference_only/director/moving/moving-obstacles.mjs\` の \`movingObstaclePose\` により、原道路B48と元時刻B51 OBBのSOURCE READ ONLY Blender 3D参照を作成。既存K4AX \`.blend\`原本＋真正カメラ数値6時点で道路と建築の構図/クリアランスをART-FIRST監査。正しい出自と不変元物理/元カメラ/Git blob SHA \`af076d67492a677d2235e4730aef8cdf4808e106\`を守り、実装・テスト・GitHubに結果保存。**細かい色替えや同じ反復箱のJS追加は禁止**。本番・main・Draft PR #46不変更、Work事前承認、ユーザー側ローカル操作不要。

正式ゲート：ART / HUMAN / SAT / CCD / FPS / RELEASE / MERGE すべてHOLD。他6Roadへ複製・ゲーム公開は禁止。


---

## 2026-11-03 K4AY 実コード着手記録（必ずActionsで最終判定）

[実装・テスト・保護契約と次作業の技術正本](docs/R19_A6P4_R2F5K4AY_AUTHENTIC_B48_B51_BLENDER_SOURCE_CONTEXT_JA.md)

研究ブランチでB48 Road5の本物の`sample/frame/tessellate`抽出、control/ultra 6tick×B51 28体source collision OBBの時刻別再現、元K4AX `.blend`の別collectionへ非破壊挿入、6元Camera DCC-only画像生成と独立検証を行うコード・専用CIを追加した。**コードのGitHub保存は完了したが、K4AY Actions #41610821799の実成功／Artifactsは現時点では未確定**。確証のない Blender/ART PASS を絶対に書かない。SRC静的テストのPASSとDCC完成、美術品質を区別する。初回K4AY CI run はworkflow対象外の文書追記でキャンセルしない。正式ART=0・Slope2 DNA=0m・ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE HOLD、main・公式継続branch・本番・PR#46・凍結blobは引き続き保護。次はCI実ログ確認と実6DCC画像の厳格な美術評価、必要な抜本造形改修。


---

## 2026-11-03 K4AY 最終監査結果 — 実B48/B51 DCC統合 SOURCE/DCC TECH PASS・ART REJECT

- **最新の成功したK4AY Github Actions**: [#41612254866](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41612254866) **completed / SUCCESS**。全工程（保護source hash、Node独立tests、K4AX正本Artifact SHA、Blender取込み、6元Camera+1artist DCC描画、別名.blend/GLB、生成物ファイルSHA独立検証）がSUCCESS。
- **真正Artifact**: [#13218659517](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41612254866/artifacts/13218659517)、7,304,277 bytes、ZIP SHA256 `c206c8de97a7741d40e19676523e79e9e5e4a1cb3d8ae0b18349336c273cc713`。Blenderの独立した新原本 `K4AY_TIDAL_EXCHANGE_WITH_TRUE_B48_B51_REFERENCE.blend`、参照GLB、6 source Camera PNG、1 artist camera PNG、source data/manifest/provenanceがある。
- 実B48 source Road5は物理surface **index 5、ID `p93-PRISM_CREST-01`**、真 `tessellate()` メッシュ **4,728三角形 (top 2,160)**。control/ultraのRoad5原制御点SHA-256 `5eb731e25bc9eb1a3cf1080e7b239f5e2e8043bfbc80e5d37e0b069a5a08a730` は一致。Road5 longitudinal void cellsなし。7 physical B48 surfacesと28 B51本体を元docから確認、元sourceは読み取り専用。
- Source B51 collision OBB参照は各tick 28体×6tick=**168個**、元Camera ticks control 11259/11278/11307、ultra 11320/11341/11369。元物理 `movingObstaclePose(descriptor,tick/240)` を使用。これらの**衝突OBBはゲームのB51美術メッシュではない**。K4AYでは誤認を避けるためOBBを線枠で表示。元K4AXの**架空・非物理背景地形のみ**をDCCレンダリングから隠してB48実道路を露出、編集可能な原本から削除はしていない。
- **ART REJECT継続**。7枚の実DCCを目視審査したが、走行画面は大部分が淡い単純な道路/空間、左の建物は途切れ・右の塔は孤立、公共機能・人間スケール・街区連続性・空間密度に説得力が不足する。アーティストカメラは構造/屋根形状を示すが、元ゲーム画面の美術合格にはならない。**単なる色替え・道路捏造・JS box建築量産禁止**。次はこの実B48/B51原本に位置合わせした公共空間/ランドスケープ/建築の大胆なBlender-native再設計、元Camera正確な構図とクリアランス検証。
- **不変のHOLD**: 正式ART採用0件、Slope2 DNA認定0m、ART REJECT、HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。Blender画像は元WebGL2ゲーム画像ではない。建築vs真B48/B51の詳細BVH干渉・元ゲームCCD/HUMAN/FPS/安全は**未検証**。main/継続公式branch/本番/Draft PR #46/原source blob・240Hz・球半径0.65m・元Camera/衝突条件の変更なし。Work事前承認のまま。
