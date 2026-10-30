# R18 P2真正技術PASS・画像ART両案REJECT → R18 P3の構図抜本再設計（2026-10-30 JST）

**今回の確定事実：R18 P2 6/6真正WebGL2 source sessions / 元Canvas PNG36/36 SHA一致 / 真Runner新A/B×2世界finish 4/4 / 独立偽成功10拒否 = SOURCE TECH PASS。ただしA/Bとも真正RAWカメラ実画像目視でART REJECT。正式ART採択0件／Slope2正式認定0m、GAMEPLAY/HUMAN/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD。**

- 真正[Actions #41078746216](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41078746216)全工程成功、実証Artifact #12987684703（ZIP sha256 `ce186b7d48262305f7ac6b64c408158e91ee4e2925b1c2948d85770ff9379956`、2026-11-06 15:22:22 UTC期限）。新A`A_INHABITED_ESCARPMENT`30,053三角形、新B`B_HOLLOW_TRANSIT_SAILS`30,084三角形。ゲーム本体は不変、PRIVATEコライダー0。
- 真の2世界×旧D15R1/新A/B同時刻54/58/61/64/67s（plus終端）のCanvas PNGを実視。旧R18P1の細塔・アーチより物理的な巨体の輪郭は増したが、都市が鋸歯状/スクラップ状の面とシェルの反復へ変わり、都市全体の中心・まとまり・道路との連続性が**目標の巨大SF都市として不成立**。両案ART REJECT。画像SHA検証、比較と根拠は[ R18P2画像審査 ](docs/G4E7DZ_R18P2_ORIGINAL_36_PNG_ART_REVIEW_AND_R18P3_DIRECTION_JA.md)。
- 次R18 P3の正式方針：**カメラ時間帯5箇所へ類似構造物を複製する設計をやめる**。原ソース真カメラ54→67秒を使って、ひとつの巨大な主役建築＋中規模街区＋退出時に残る地平という都市景観の優先階層、大きい空洞と道路視認性を先に設計。色・面・ポリゴン数を増やしてARTを強弁しない。B51真正回避、人間操作とWindows実GPU FPSは未実施。
- 原本保護：Git blob `af076d67492a677d2235e4730aef8cdf4808e106`、元240Hz CCD/球.65m/B48×7/B51×28/合法P96-P94-A13/RAWカメラ-HUD、main/Gold/P100/本番URL、PR #46 Draft未マージ。新規衝突ゼロ。新3Dは隔離 PRIVATE のみ。
- 長いチャットからの最小復帰は[最新LIVE_HANDOFF](docs/DOPAGAKI_LIVE_HANDOFF.md)。GitHub原Artifactは7日後失効、会話証拠ZIPに原本と目視比較を収めたがGitHubへの恒久アーカイブは別作業。

---

# R18 P1 — 連続した5時間帯の実3D巨大SF都市を2案実装（2026-10-30 JST）

**元ゲームは不変／研究用独立3D。正式ART採用0件／Slope2認定0m／GAMEPLAY・HUMAN・PERFORMANCE・RELEASE・MERGE HOLD。**

- R18 P0の真RAWカメラ2世界共通候補に基づく5地点（54/58/61/64/67秒）、元B48道路5前半から道路6後半まで、様々な公共施設・真の開放中庭・居住ボリュームと間をつなぐ空中交通骨格を作成。
- 新2案は構造を別設計：`A_CIVIC_RIBBON_CONCOURSE`（非対称の曲面公共交通施設と複合市街地）、`B_TERRACED_COURT_NETWORK`（段状の開放中庭・駅街区と高さの異なる都市スパイン）。実頂点 XYZ/RGB。元Stage docを改変せず、物理コライダー追加0。
- 新実装 `scripts/p101-r18p1-temporal-inhabited-city-architecture.mjs`・研究用元WebGL2パッカー・元240Hz 6条件テスト・独立PNGハッシュ/10偽証拠否定検査・Windows 1クリック起動まで実装。詳細は[本工程の実装記録](docs/G4E7DZ_R18P1_FIVE_TIME_REAL_3D_MEGACITY_INTEGRATION_AND_QA_JA.md)。
- 初回CIの失敗原因はPRIVATE交通リンクの高さベクトル3次元成分欠落による非有限Z。修正コミット `65b1b0f5019b44f8e2d35c83e732b0cba4c43ac2`で解消。修正後の[真正元ゲームCI #41075148883](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41075148883)は**元SHA・形状単体QAと研究用ビルドPASS**。元WebGL2 6条件走行はこの記録作成時点で実行中。**真正Runnerの完走、PNG36枚、独立QA、画像ARTの合否は未確定**。次回必ずCIの実際の結果で更新する。
- 不変ルール：元ソースBlob `af076d67492a677d2235e4730aef8cdf4808e106`、240Hz CCD、半径0.65m、7本の元B48物理道路、28基の元B51動体、合法P96/P94/A13、RAWカメラ/HUD、main/Gold/P100/本番URL・既存PR#46 Draftを保護。偽路面/透明床/強制吸着/自動運転/カメラすり替え/偽finishを禁止。
- 最新の短い[復帰案内](docs/DOPAGAKI_LIVE_HANDOFF.md)と完全証拠の場所はGitHub正本で管理。元Runnerの自動成功はART/HUMAN/PERFORMANCE PASSを意味しない。

---

# R15S3D17R1真正36画像ART REJECT → 元カメラ幾何診断PASS → R18 P0時系列配置PASS（2026-10-30 JST）

**本段階の最終結果：R17 A/B双方正式美術REJECT。R18 P0は元カメラ配置研究のみSOURCE TECH PASS、R18の新規3D美術は未着手。正式ART採用0件／Slope2認定0m／GAMEPLAY/HUMAN/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD。**

1. **R17真正6条件テスト確定**：[Actions #41062687304](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41062687304) SUCCESS、2世界×旧D15R1/新A/B＝6セッション36実WebGL2 Canvas PNG。各PNGのSHA256 36/36一致。新A/B×2世界の正規240Hz原Runner`finished`・源`finish`各1は**4/4**成功。独立10偽認定拒否。原Artifact #12981741098（11/6期限）。両案とも実画像で、遠景小片・近景箱と壁・都市生活空間不足からART REJECT。詳しくは[画像監査原本](docs/G4E7DZ_R15S3D17R1_GENUINE_WEBGL2_ART_REJECT_AND_CAMERA_PREFLIGHT_JA.md)。
2. **R17R1真正RAWカメラ対真XYZ診断**：[Actions #41067099727](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41067099727) SUCCESS。元R15S3D15真正カメラ×両世界×新A/B投影で、前方の建築最短重心深度が54秒約1525〜1600m→61秒約427〜522m→64秒約52〜67m（A）。見た目の急接近を説明するが、真の遮蔽/美術PASSを保証しない。
3. **R18 P0の元真正カメラ2世界×5時刻配置**：[Actions #41067613036](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41067613036) SUCCESS。元7B48/28B51、実GLSL投影を基に有効66候補。54秒=9、58秒=8、61秒=19、64秒=23、67秒=7。前半の都市をroad5 u=.18付近から見せ、road6 u=.78の抜けまで分散する5場面の具体的な候補地・符号注意・R18 P1制作ゲートを[詳細](docs/G4E7DZ_R18P0_TRUE_CAMERA_SPATIAL_CITY_TIME_DESIGN_GATE_JA.md)に確定。見える位置の検査はART・B51遮蔽の認証ではない。
4. **変更禁止**：元保護ソースGit blob `af076d67492a677d2235e4730aef8cdf4808e106`／`main`／Gold／P100／本番／正規240Hz CCD・球r=.65／元B48×7／B51×28／元P96/P94/A13・RAWカメラ・HUD。PR #46はOPEN/Draft/未マージ。新ゲームコライダー0、公開禁止。
5. **再開時の最小負荷入口**：[最新LIVE_HANDOFF](docs/DOPAGAKI_LIVE_HANDOFF.md)を先に読む。次はR18 P1の**一体的なSF都市造形と真正元カメラ実画像比較**。同じ箱/薄板/反復島/側壁方式を詳細化しない。品質・時間構成・ゲームプレイを優先。

---

# R15S3D17 — 旧天空島を廃止、真正道路脇SF公共都市2案を新規実制作（2026-10-30 JST）

**QUALITY/GAMEPLAY/ART-FIRST・元240Hzゲーム原本保護・正式ART採用0件／Slope2認定0m。** 前工程R15S3D16R1の原PNG画像審査でA/Bとも正式ART REJECT。旧案の色・部材の微調整でなく、新規の非衝突真正3D造形を2案制作し、元ランナー用WebGL2へ隔離組み込み。

- **実制作A：** `A_OBLIQUE_CIVIC_EXCHANGE`。非対称斜架と低層交通/公共施設、道路脇の中庭を持つ連続街区。
- **実制作B：** `B_SPLIT_STATION_COURTS`。2段の開放中庭・分割駅街区・道路外側の立体フィン。Aのリング色違いではなく異なるXYZ造形構造。
- **真正独立検証：** 元D15R1対照2世界＋新A/B×2世界の6条件、54/58/61/64/67秒ネイティブ240Hzカメラと真の終端。元PNG実SHA256・サイズも独立検査し、10偽成功認定拒否。専用[Actions #41062687304](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41062687304)を実行。**最初の元blob・真正メッシュ単体テスト、研究用PRIVATEビルドは成功。実走行結果・真PNG・美術はCI確定と直接画像批評までHOLD。**
- **保護：** `main`/Gold/P100/本番/元保護blob `af076d67492a677d2235e4730aef8cdf4808e106`／本物のB48×7・B51×28・元CCD240Hz・カメラ/HUDと合法操舵を変更せず。新規物理コライダー0。PR #46 OPEN/Draftを維持。
- [新2都市の実装・真正QAの設計詳細](docs/G4E7DZ_R15S3D17_PRIVATE_ROADSIDE_TWO_CITY_SOURCE_AND_QA_JA.md)／[短い再開文書](docs/DOPAGAKI_LIVE_HANDOFF.md)。
- **次ゲート**：元WebGL2 PNGで進入→接近→公共空間通過→退出を観察し、元B51の視認と原道路上のプレイ公平性を批判的に判定。CI成功・三角形数・自動完走を美術や人間PLAYと混同しない。

---

# R15S3D16R1 — 36枚の真正WebGL2画像・原完走の独立美術審査、両新都市ART REJECT → R15S3D17設計転換（2026-10-30 JST）

**最新原本：** この記載直前のHEAD `9e6f44c7f531ad960f66e2aae65e7dd3daf8567c`（最新HEADは次の作業ごとに再取得）。[Draft PR #46](https://github.com/ryomashibaba/dopagaki-development-hub/pull/46) OPEN／Draft／未マージ。保護元ゲーム blob `af076d67492a677d2235e4730aef8cdf4808e106`・`main`／Gold／P100／本番・原B48×7／B51×28／240Hz・RAWカメラ・HUDは無改変。

- R15S3D16の初版記録にあった「再試験QUEUED」は歴史的記録。実際の**再試験 [#41051738027](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41051738027) はSUCCESS**。真のWebGL2・240Hz元カメラ×6セッション／36枚／新2案×2世界の元`finished`＋元`finish`イベント**4/4**、10偽装認定を独立拒否。保存原PNG36/36の個別SHA256はJSONと一致。元の成功やTECHは人間のゲーム性を証明しない。
- 期限付き[原画像Artifact #12975179431](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41051738027/artifacts/12975179431)は2026-11-06 12:15 UTCまで。ZIP原本はこの独立審査時に別途取得済み（GitHub恒久保存は**未完了**、期限を過ぎる前に保全が必要）。
- 旧D15R1／新A`A_CASCADE_HARBOR`／新B`B_CROWNED_ACROPOLIS`を2世界・54/58/61/64/67秒＋終端の実原カメラ画像で直接目視比較した結果、**A=ART REJECT、B=ART REJECT**。理由：遠景は小さな断片、接近時はカメラ上部で浮遊する巨大棚・薄層、道路に連なる公共都市の「進入・接近・内部通過・退出」が成立しない。A/Bの形態文法がほぼ共通で、ディテール増強だけでは解決しない。
- 数値面では上中央ROIの同時刻差分も確認済み。ただし画素差と三角形数は美術品質・遮蔽安全性の保証ではない。GAMEPLAY/HUMAN/PERFORMANCE/INTEGRATION/RELEASE/MERGE はHOLD。正式ART採用**0件**／Slope2真正認定**0m**。
- **次R15S3D17（未実装）**：PRIVATE背景の造形文法を根本改造し、原道路・原カメラの進行時間の中で巨大公共都市が見えることを狙う。左右の高い同心円島／上空大板の詳細化は禁止。実WebGL2の真正6条件・同tick画像・厳格なART拒否基準を維持する。ユーザー承認なき本番公開／merge禁止。

[36枚の直接視覚審査・原本照合・明確なR17制作ゲート](docs/G4E7DZ_R15S3D16R1_REAL_IMAGE_ART_REVIEW_AND_R17_DESIGN_GATE_JA.md) ／ [今後の短い復帰文書](docs/DOPAGAKI_LIVE_HANDOFF.md)

---

# R15S3D16 — 元カメラ中央に映る公共都市核・本物の立体居住群2案の制作（2026-10-30 JST）

**元ゲーム原本変更なし／実WebGL2の最新再試験はGitHub Actionsで現在QUEUED、正式ART・原Runner完走再認定はHOLD。** これまでのR15S3D13連続峡谷ART REJECT→R14輪の孤立ART HOLD→R15R1板状の右偏りART HOLDを受け、元WebGL2の10真正カメラ実測に基づく元B48道路5 u=.78、道路6 u=.62に、**2か所の空中公共都市核（各左右の立体居住アイランド、実中庭、3層公共デッキ、厚い連続都市主骨格）**を制作。旧背景を排他的に置換し、数値だけの巨大さを美術と混同しない。元7 B48／元28 B51の位置・衝突・原240Hz Runner・合法P96/P94/A13・正規カメラ・早期警告HUDは完全保持。

- **A_CASCADE_HARBOR**：実物の15,696三角形、76住居ボリューム、63中庭開口、44連続構造材。
- **B_CROWNED_ACROPOLIS**：実物の16,488三角形、84住居ボリューム、63中庭開口、44連続構造材。単なる色違いでないXYZメッシュを検証。
- **初回CI [#41050960908](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41050960908) FAIL**：真正幾何試験と元GLSL PRIVATEビルドはPASS、前R15R1対照2世界の12画像と源`finish`は撮影されたが、新案4条件は元工程のブラウザテストが開口数「>80」を誤要求し、実際の設計「63開口」と矛盾し全て撮影開始前にFAIL。保護元ゲーム/新3Dメッシュに手を触れず、ブラウザ・独立QAを設計の真中庭数に整合する「>=40」に修正。
- **最新再CI [#41051738027](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41051738027) はQUEUED／結果未確定**。新たな実写真・完走・美術を推測でPASSにしない。先行の既存D15R1真正CI[#41049194707](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41049194707)はSUCCESS（元6条件・36画像・新2案原finish4/4・10偽認定拒否）だがD16の証明に流用しない。
- **真正画素証明スクリプト**：`scripts/p101-r15s3d16-independent-real-png-visual-evidence.py`は公開ART承認とは独立に、真正PNGのSHA256/元RAWカメラ同tick 54・58・61・64・67秒での画面中央ROIの実画素差を計算する。コード実装済み、実D16の成功画像が得られるまで結果は未認定。
- **操作削減**：`scripts/R15S3D16_PRIVATE_ORIGINAL_GAME_TWO_CIVIC_HEARTS_ONE_CLICK.cmd`は当該GitHubブランチのWindowsで原PRIVATE→D10→D11→D15R1（基準）→D16だけをビルドしlocalhostで実ゲーム比較、以前のREJECT都市多数を順番に無駄ビルドしない。ユーザーのWindows実GPU/HUMAN検証は未実行。
- **次の真正ゲート**：後続の6条件実WebGL2・元54/58/61/64/67秒の同カメラ実画像と元終端イベントを取得し、新案が本当に中央視線の主役になるか、近距離で屋根が路面/元B51を隠さないかを人間が批評。単なるポリゴン増加、画素差だけの合格は禁止。次はシルエット/居住都市構造を抜本再設計し、実物理道路・原HUD・本番を守る。

**正式状態：R15S3D16 STATIC GEOMETRY 2世界×2案 PASS／SOURCE NATIVE WEBGL2 NEW ART/FINISH PENDING、ART A/B HOLD、HUMAN/GAMEPLAY/PERFORMANCE/RELEASE/MERGE HOLD。** 正式ART0件・Slope2認定0m、元保護ソース `af076d67492a677d2235e4730aef8cdf4808e106`、[Draft PR #46](https://github.com/ryomashibaba/dopagaki-development-hub/pull/46)未マージ。

[実制作・初回CI不合格と厳格な新美術ゲート](docs/G4E7DZ_R15S3D16_TRUE_CAMERA_CIVIC_HEART_GEOMETRY_AND_ART_GATE_JA.md)

---

# R15S3D14／R1 → R15S3D15 — 連続壁を棄却し巨大象徴都市核・公共テラスの真正実3D制作完了／実カメラ投影を先に確認（2026-10-30 JST）

**source B48/B51/240Hzの真正状態は保持**。[Draft PR #46](https://github.com/ryomashibaba/dopagaki-development-hub/pull/46) はOPEN/Draft/未マージ。保護元ゲームBlob `af076d67492a677d2235e4730aef8cdf4808e106`不変。MAIN/Gold/P100/本番/物理/camera/合法操舵/7実道路・28実動体・元HUD早期B51警告は無改変、全新ARTは`dist-private`の非衝突3Dのみ。

- **R15S3D14・本物の象徴都市核**：巨大な三日月状厚みある非衝突3Dを実道路5/6の進行方向に3つ設計。A 5,652三角形、B 5,232三角形、各3つの約147m以上の中央実空洞と12デッキ。真の元球240Hz・同RAWカメラWebGL2×6条件・24本物の画像、各新A/B×2世界元`finished`+原`finish`イベント1/1＝**4/4 PASS**、独立QAで10件の虚偽証拠を拒否。[真正Actions #41041624933](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41041624933) SUCCESS／[24画像原本 #12970791757](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41041624933/artifacts/12970791757)。**美術：A HOLD**（旧R1長壁より象徴性改善、しかし暗い空に輪だけが浮く）、**B REJECT**（Aより画面構図に優位なし）。
- **R15S3D14R1・周辺の本物の公共都市を追加**：R14 Aの真3D主核を保持し、本物の15層公共テラス／非矩形居住デッキ／空中街区／下層連絡/実中庭の2案。A `A_INHABITED_CRESCENT_DISTRICTS` 7,920実三角形/36開放セル、B `B_DEEP_CIVIC_TERRACES` 7,668三角形/61開放セル。PRIVATEの依存モジュール未同梱で初回CI #41042937428 FAIL、`p101-r15s3d14`基礎ES moduleをPRIVATE版へ同梱修正。後続CI成功。
- **R14R1真正最終CI [#41044411374](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41044411374) SUCCESS**／[原WebGL2実画像24枚＋独立QA Artifact #12972097319](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41044411374/artifacts/12972097319)。R14参照×2世界＋新R14R1 A/B×2世界＝6条件、元58s/64s/67s同1/240秒時刻・元Rawカメラ、元源球`finished`4/4/原`finish`イベント各1。独立10偽認定VETO。**実画像批判：A ART HOLD**（街区は増えたが大半が画面端の大輪内側、道路中央は暗闇のまま）、**B ART REJECT**（細い平板が反復しAより劇的進歩なし）。正式ART採用ゼロ、Slope2認定0m。
- **重大な工程転換：R15S3D15ではカメラの真正投影を先に測る**。幾何や三角形数が増えてもカメラ前方で主役都市にならない欠点を断つ。元の`drive3d`レンダラー内`viewForPose()`が実際に返すeye/front/right/up・元球位置を別PRIVATE複製に読み取り専用で記録。`sample()`で元実B48道路5/6から直接得た50+個の景観主核候補（横方向/高さ違い）を**元のGLSL式そのまま**真正WebGL2の54/58/61/64/67秒、true-pinch/pinch-switchの2世界×5場面でスクリーン投影して証拠化。候補の遮蔽や美術合格ではない。初回CI #41047236192は起動時の回復可能ステージキー警告を過剰に拒否してFAIL、その警告を証拠に保存したうえで想定外エラーを厳格拒否するよう修正。**真正最終CI [#41047602697](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41047602697) SUCCESS／[2世界×5時刻の実WebGL2 10PNG+実B48座標投影 Artifact #12972194661](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41047602697/artifacts/12972194661)**。同元カメラで道路5 u=.78、道路6 u=.62が画角中央に収まることを実投影で確認（遮蔽/美術/人間PLAY認定ではない）。出所は`scripts/p101-r15s3d15-private-actual-raw-camera-probe-pack.mjs`と`scripts/p101-r15s3d15-source-native-project-true-landmarks.mjs`。
- **R15S3D15R1真正カメラ配置の新実3D制作**：上記実測を参照して、旧の路肩大輪を置換する道路5 u=.78・道路6 u=.62の空中都市主核2案を非衝突 PRIVATE 真XYZ/RGBとして実装。A `A_SKY_DELTA_CIVIC_CORE` 2,984実三角形／公共デッキ250面セル／本物の空き中庭134、B `B_CROWNED_OPEN_SKY_CITY` 2,712三角形／公共デッキ226／空き中庭158。源7 B48・28 B51・元240Hz/RAWカメラ/HUD不変で、モード・負のQAを含む静的2/2 PASS。不要な旧R14 city依存チェックを新PRIVATEパッケージから除去した。元ブラウザー**54/58/61/64/67秒×2世界×旧基準A/新2案＝6セッション**を[Actions #41049194707](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41049194707)で実行中。**元`finish`・実スクリーンショット・独立QAを成功確認するまで技術WebGL2/ARTはHOLD**。薄板化・偽の都市合格禁止。
- **次の本制作の明確なゲート**：スクリーン中央遠景の実カメラ座標を測定し、「遠方の巨大一体シルエット→近景の本物の生活公共空洞→通過後の街」の時間構成を固定して初めて新3Dを造形。画面端の同じ輪、連続側壁/細破片、色替えと装飾のみを禁止。元B51の実画面内サイズ・遮蔽/手動回避、Windows GPU FPSは未検証で**HUMAN/GAMEPLAY/PERFORMANCE/RELEASE/MERGE HOLD**。実走自動完走を人間PLAY PASSとは絶対呼ばない。

[根拠・失敗と美術批評・次工程設計](docs/G4E7DZ_R15S3D14_TRUE_THREE_HOLLOW_CITIES_AND_INHABITED_R1_ART_GATE_JA.md)

---

# R15S3D13／R1 — 元ゲーム真正WebGL2大規模連続都市の実制作と批判的美術REJECT（2026-10-30 JST）

**確定SOURCE TECH：** [Actions #41015677226](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41015677226) **SUCCESS／[Artifact #12959673348](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41015677226/artifacts/12959673348)**。元の真正240Hz `Runner`・CCD・P96/P94/A13・本物の7 B48実道路・28 B51実動体・元GLSL WebGL2/RAWカメラ/HUDを元原本のまま、道路5/6の本当の物理面サンプルに沿った連続巨大3D都市2案をPRIVATE版に実制作。旧背景・前R15S3D12 A、新2案×2世界の**7セッション・27真正PNG**を同じ元ネイティブt58(13920tick)/64(15360tick)/67(16080tick)で比較し、真正原`finished`＋本物の`finish`イベント／最終路面接地**新2案×2世界の4/4 PASS**。独立QAで虚偽認定10件拒否。元物理とゲームソース未変更。

- **D13 A_CIVIC_MANTLE**：10,556実三角形、連続外殻247区間・4層公共デッキ981、真の空洞414。**ART REJECT**：実ゲームの元カメラで左右の巨大垂直壁が道を囲い込み、暗い単調なトンネルが支配。連続建造物として描けることと、壮大で美しい未来都市は別。
- **D13 B_OPEN_CALDERA**：8,888実三角形、真の空洞594、公共デッキ804。**ART REJECT**：穴の数を増やしても同じ巨大壁・暗い直線都市峡谷の美術欠点が残る。ゲームの2案ART正式採用ゼロ。
- **D13R1の修正研究（CI結果未確定）**：元のD13成功・失敗画像を保持し、`scripts/p101-r15s3d13r1-open-sky-continuous-civic-spine.mjs`として別の本物の3D再設計。原路面の左右壁を実B48路肩から**68m以上外側**へ退避。近接正面壁を大幅に除去し道路上空を開放。ただし浮遊破片へ逆戻りしないよう**600以上の途切れない実3D主ロードパス**を遠方側に接続。A_SKY_OPEN_CONTINUUM／B_ASYMMETRIC_FREE_EDGE の2モード。正規PRIVATEの元WebGL2×7同条件CI [#41017399399](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41017399399) を実行中。初期2CI（#41017020585／#41017286493）は新研究用の変数スコープ・「壁を除去するのに壁面連続数を要求する」不適切な内部テストのため失敗し修正、これを成功と偽装しない。**R1 ART/HUMAN/原finishはCI実結果までHOLD**。
- **保護**：元生産用`web/p101-w9c2-g4e7ci-integrated-streetscape.mjs` blob `af076d67492a677d2235e4730aef8cdf4808e106`。元`main`、Gold、P100、本番URL、原物理、原カメラ、原B51定義は未変更。Draft PR #46 OPEN/未マージ。合法な本物の実走と実画像に基づくART評価を分離、正式ART採用0件・Slope2正式認定0m。人間手動回避・Windows FPS・本番統合/HUMAN/GAMEPLAY/RELEASE/MERGE HOLD。

[画像評価とR1修正の真正GitHub出典](docs/G4E7DZ_R15S3D13_GENUINE_TWO_ROAD_CIVIC_CONTINUUM_ART_REVIEW_R1_HANDOFF_JA.md)

---

# R15S3D12 — 元240Hz真正WebGL2に巨大未来都市2案を実制作・ART批判的比較／A HOLD・B REJECT（2026-10-30 JST）

**真正技術結果：** [Actions #40999592638](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40999592638) **SUCCESS**／[Artifact #12953081232：元ゲームの本物の19画像](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40999592638/artifacts/12953081232)。PRIVATE元`drive3d`の本物のGLSL/追従カメラ/HUDを保持した`dist-private/r15s3d12`を構築、現行の旧柱・門・箱状背景を**排他的に置換**。真の既存B48道路5/6に合わせ、全7道路・全28の元移動障害物、合法P96/P94/A13、元Runner/CCD 240Hz、元実`finish`を無変更のまま、下流街区の3Dアート候補を2案制作した。

- **A_INHABITED_VOID**：7街区の多層居住テラス、巨大な負空間、空中連絡路と下面骨格。**9,536真正3D三角形／空きセル109／居住風断面227**、元2世界とも`finished`・元`finish`イベント各1。ART **HOLD**：真正スクリーンショットで道路周辺の街区・空洞の可視性は改善したが、壁・長方形ボリューム・板の反復が強く、公式採用0件のまま。
- **B_BRAIDED_ESTUARY**：浮遊する曲面帯・環状公共街区・空中トラス。**15,180三角形／空きセル375／居住風断面1,095**、元2世界とも`finished`・元`finish`イベント各1。しかし実画像では**細切れの浮遊パネルが分断され、都市全体の骨格として成立せず ART REJECT**。旧門の反復が浮遊破片に変わっただけでは不十分。
- **同条件5実画面セッション**：旧景観true-pinchと、新A/B×true-pinch/pinch-switch。58秒**13,920tick**、64秒**15,360tick**、67秒**16,080tick**で元Runnerを1/240秒単位に正確停止し、元ゲームの**補間なしRAWカメラ**／同一ゲーム画角で実画像を比較。合計**19枚**。新案の元Runner真正完走tickはtrue-pinch **16,759tick**、pinch-switch **16,924tick**。元B51早期警告を維持し、正式HUMAN/ARTとは別の**SOURCE WEBGL2 TECH限定PASS**。
- **初回実行失敗**：[Actions #40998734049](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40998734049) は、都市モジュールにNode.js用の`node:assert/strict`依存が残っていたため、静的2/2・元ゲームPRIVATEビルドはPASSするもブラウザART候補4件の読み込み失敗。ブラウザ互換の検証ガードに置換して**#40999592638で完全再実行成功**。失敗履歴を消さない。
- **画像差＝品質ではない**：元景観と新A/Bの真正画面でRGB差30以上の画素率はtrue-pinch67秒にA**約37.8%**、B**約19.2%**。変化量を「美しい」とは認定しない。形は増えたが、街の暮らし・統一された壮大な曲面主構造・接近/通過/退出のシーケンスは未達。正式ART採用0件・Slope2認定0m、現状の道路10〜16m/高速度の人間視認性・実機FPSは未認定。
- **起動/検査**：`scripts/R15S3D12_PRIVATE_TWO_CITIES_ONE_CLICK.cmd`はローカルWindows上で原ゲーム→D10→D11→D12のPRIVATEビルドとlocalhostの比較を一度に起動（実機での動作/人間手動試験はまだ未実施）。都市幾何のソース独立検査2/2合格、元実Stage JSON全B48/B51不変、他のオリジナルWebGL PRIVATEや元`web`ファイルに変更を加えない。
- **次R15S3D13**：Aの実カメラ可視性・空洞構成だけを最低限の出発点とし、Bの切れ端とAの箱壁を**両方いったん棄却して**、巨大な連続的非対称曲面の主骨格、内部の公開都市生活断面、奥行き・光・高度差を真の3Dで一体に再設計。元カメラのt58/64/67や実B51の接近地点で本物の画面を批判的に比較し、視界を遮る案はART即REJECT。実球真正`finished`と実障害物28・早期警告を保護、人間操作・FPS・総合美術は別ゲート。詳細は[本物の2案の批判・完全ログ](docs/G4E7DZ_R15S3D12_ACTUAL_WEBGL_TWO_REAL_3D_CITIES_NATIVE_ART_VERDICT_JA.md)。

**正式判定：SOURCE NATIVE/WEBGL2 2案×2世界 TECH限定PASS、A ART HOLD／B ART REJECT／正式ART0・Slope2認定0m。GAMEPLAY/HUMAN/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD。** 元本番ソースblob `af076d67492a677d2235e4730aef8cdf4808e106`一致、[Draft PR #46](https://github.com/ryomashibaba/dopagaki-development-hub/pull/46) OPEN/未マージ、`main`/Gold/P100/本番URLは変更なし。

---

# R15S3D11 — 実B51障害物の競技性向上・元240Hz真正走行4条件・実WebGL2四条件・同一路面全軌跡照合（2026-10-30 JST）

**重要な技術進歩：PRIVATE実験では元全7道路と元Runner/CCD/元操舵P96→P94/A13・カメラ/HUDを凍結し、実際の既存B51動体28基中6基（`a13-machine-11`〜`16`）のみ道路5/6へ移設。** 既存ID/タイプ/動作周期/位相/衝突モードを保持、実B51物理箱を狭路向けに調整。元22基や元ゲーム原本、`main`/Gold/P100/本番は無改変。

- **真正240Hz×4条件**：[Actions #40996596408](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40996596408) SUCCESS／[Artifact #12951144376](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40996596408/artifacts/12951144376)。A（左右路肩配置）は元true-pinch **69.829167秒`finished`**／pinch-switch **70.516667秒`finished`**、元`finish`イベント各1／移動体接触0。B（車線内障害物）は元`a13-machine-12`実接触で60.733333／61.304167秒`failed`、元`finish`0。原CROWNの17／21.5秒source prefix4/4一致。独立QA偽認定12種拒否。最初のCI2回のFAILは新試験の初期`ready`を誤って終了と扱った観測側のバグ。正しく`failed/finished`のみ終了とする修正後の真正証拠が正本。
- **公平な後半B51接近比較**：[Actions #40997061397](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40997061397) SUCCESS／[Artifact #12951313883](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40997061397/artifacts/12951313883)。同じ原Runnerの球XYZ・同じ時間・**23秒以降0.5秒刻み**で元28基の球面と実回転OBB距離を比較し、true-pinch 30m以内**1→5基**、pinch-switch **3→7基**。元R15S3D9との球XYZ差0m。新試験の0秒からの接近13/14基と、旧23秒以降の3基を直接比べる誤りは禁止。独立QA偽認定9種拒否。
- **本物のゲームWebGL2×4条件**：[Actions #40996713244](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40996713244) SUCCESS／[Artifact #12951946719](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40996713244/artifacts/12951946719)、**元GLSLとゲームHUD・追従カメラ・28本物のB51**で18実スクリーンショット。Aのブラウザ真正FINISH2/2、Bの`a13-machine-12`衝突失敗2/2一致。元の`dist-private/drive3d/`を上書きせず、隔離`dist-private/r15s3d11/`のみ研究用拡張。実機人間FPS・公平性・美術は未承認。
- **美術/ゲームの重大REJECT**：B案は58秒時点で元HUDが「危険なし」、60.7／61.3秒の実接触でようやくB51真距離0mを表示。**速度170m/s級の予告が遅すぎる**。A案は完走できるが機械近接が増えただけでは駆け引き・回避可能性の証明にならない。ART正式採用0件、Slope2認定0m。B致命衝突レイアウトを正式採用不可。
- **R15S3D11-R1追加検証成功**：`scripts/p101-r15s3d11-source-road-ahead-b51-warning.mjs`を追加し、元routeではなく真正B48中心線を用いた**最大650mの実路面前方動体予告**をPRIVATE元WebGL2 HUDに組み込んだ。未来衝突/遮蔽/人間回避/ETAを捏造しない。専用[Actions #40997430997](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40997430997) **SUCCESS**／[実WebGL2 21 PNG Artifact #12952301879](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40997430997/artifacts/12952301879)。**早期警告単体5/5 PASS**、元真正ブラウザ4条件（A finished2/2、B実B51衝突failed2/2）が再現。Bの致命衝突前に元実道路の沿線距離**true-pinch 252m先／pinch-switch 327m先**の実B51 IDと左右をHUDに表示。HUD間欠更新のため未来衝突時刻・画素上の可視性・人間回避成功とは混同しない。**SOURCE EARLY WARNING 限定TECH PASS、GAMEPLAY/HUMAN/ART HOLD**。
- **ローカル試験1クリック**：`scripts/R15S3D11_PRIVATE_HAZARD_WEBGL_ONE_CLICK.cmd`で当該ブランチをWindows作業コピーで実行すれば、プライベートビルド→本ゲーム複製→実4ステージ→localhost起動・ブラウザ表示まで一括。自動デモは人間試験ではない。
- **次R15S3D12**：Aの6基が本当に人間にとって判断・避ける楽しさを作れるか、元WebGL2画面の障害物サイズ・遮蔽・前方警告時間・手動入力を同条件で検証。小物の追加だけでなく未来巨大都市の**大胆な実3D骨格・多階公共空洞・高速の接近/通過/退出**を本物の原カメラで制作・批判的に審査。正式GAMEPLAY/HUMAN/ART/PERFORMANCE/RELEASE/MERGE HOLD。

**正式ゲート：SOURCE-NATIVE A`finished`2/2 PASS、B衝突FAIL/REJECT、SOURCE B51同軌道比較限定PASS、PRIVATE実WebGL2実描画4/4限定TECH PASS。GAMEPLAY/ART REJECT・HOLD／HUMAN/PERFORMANCE/RELEASE/MERGE HOLD。** 保護元ゲームblob `af076d67492a677d2235e4730aef8cdf4808e106`不変、[PR #46](https://github.com/ryomashibaba/dopagaki-development-hub/pull/46) OPEN/Draft未マージ。

[真正証拠・失敗・美術批判・次ゲート詳細](docs/G4E7DZ_R15S3D11_TRUE_B51_28_REAL_GAME_WEBGL_AND_FAIR_WARNING_VERDICT_JA.md)

---

# R15S3D10 — 本物の原WebGL2ゲームPRIVATE統合で240Hz真正完走2/2、元28 B51の接近不足・美術REJECT（2026-10-30 JST）

**実ゲームの限定技術成果**：元ゲーム`drive3d`本体を改変せず、PRIVATEビルド`dist-private/r15s3d10/`に実WebGL2レンダラー/240Hz Runner/CCD/元追従カメラ/HUD/元B51全28とR15S3D9実B48幅16m級道路7本を一体接続。原0秒から合法P96→P94・A13・OVERDRIVEの**自動走行**で、真正Chromium GPU APIによる実ブラウザ版も元世界2条件とも元Runnerの`finished`・`finish`イベント各1件を再現。原走行時計**true-pinch 69.83秒／pinch-switch 70.52秒**。元ステージゲームソースGit blob `af076d67492a677d2235e4730aef8cdf4808e106`不変。これは**PRIVATE SOURCE-GAME WEBGL2 TECH限定PASS**であり**本人手動・GAMEPLAYの楽しさ・都市ART・実機PERFORMANCE・RELEASE合格ではない**。

**R15S3D10最新CI確定 #40996525096**：真正[元WebGL2 Actions #40996525096](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40996525096) **SUCCESS**／[元2世界・同時刻17実PNG Artifact #12951985924](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40996525096/artifacts/12951985924)。元Runnerを17.0/23.5/34.0/48.0/60.0/65.3/67.3または67.9秒に**真正1/240秒tickで一時停止→同じソースカメラで描画撮影→再開**し、元真正完走tick **16759／16924**と元`finish`イベント各1件を維持。独立HUD単体テスト**6/6 PASS**、元ゲーム・物理・元B51 28基は不変。旧HUDがtrue-pinch67.3sの`a13-machine-15`真接近**4.37m**を「近接なし」と表示した実偽陰性を、側方・後方の実物理25m以内近接を明示するPRIVATE警告で修正。true-pinch23.5sの`a13-machine-05` **9.09m**、65.3sの`p95-hazard-12` **18.32m**、pinch-switch67.9sの`a13-machine-15` **4.24m**も、実スクリーンショット上で距離表示を確認。**正しい現時刻の物理接近と、将来衝突予測・可避性・遮蔽・人間が視認できるかは別。近接25m警告SOURCE TECH限定PASS、GAMEPLAY/HUMAN/ART HOLDのまま。** [検証詳細](docs/G4E7DZ_R15S3D10_REAL_ORIGINAL_WEBGL2_CAMERA_HUD_B51_VISUAL_AND_HUMAN_GATE_JA.md)

**実証証拠：**
- [真正原ゲームWebGL2 Actions #40994589547](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40994589547) SUCCESS／[実画面計10枚 Artifact #12950203398](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40994589547/artifacts/12950203398)。原物理・原GLSL・正規カメラ・HUD・球/B48/B51を実Chromiumで撮影。元CROWN/LOWER/VOID/PRISM/FINISHで実道路接地、2世界とも真`finished`＋元`finish`。
- [B51真正時空間監査 #40994708979](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40994708979) SUCCESS／[Artifact #12949689963](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40994708979/artifacts/12949689963)。元動体**28基中、実走行中30m以内へ接近した障害物は両世界で3基**、真球表面最接近4.367585/4.239973m、動体接触イベント0。画面への簡易投影27基は**遮蔽を除いた実視認証明ではない**。ハザード数と迫力・安全性は別。
- [HUD距離是正＋日本語フォント真WebGL再撮影 #40995166967](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40995166967) SUCCESS／[実画面 Artifact #12950903128](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40995166967/artifacts/12950903128)。元の誤解を招くrouteベース「0m・0.0秒」B51予報をPRIVATEコピーのみ排除し、元`movingObstaclePose`＋実`sphereBoxSeparation`による物理表面距離＋正規カメラの投影候補表示へ変更。単体テスト4/4 PASS。日本語フォント導入で文字化け改善、元真正FINISH2/2再現。**遮蔽・予測衝突・安全性は未認定**。
- さらに実B51最近接時刻23.5/65.3/67.3〜67.9秒の試験を追加し、スクリーンショットが500ms HUD更新遅延で数秒ずれる弱点を発見。新しい`R15S3D10 PRIVATE SOURCE TICK FREEZE`実装により、**試験専用の任意ターゲット時刻±1/240秒で元Runnerを一時停止**して撮影後に再開できる。通常プレイには介入しない。この正確な撮影ゲートをCIで確認し、B51警告見逃しを別判定する。

**実制作で確認した厳格な美術批評**：実画面で巨大直方体の壁/柱・線状ゲート、暗い単調な空間・繰返すネオン線が支配。現状は美しい巨大未来都市の圧倒的な内部空洞・非対称建築・街区断面・時間的接近/通過/退出を実現できていない。**ART REJECT/HOLD**。本当に走るゲームが描画されても「面白い/完成」とは判定しない。CIヘッドレスSwiftShader約11〜52fpsはハードウェア実機ベンチマークでないためPERFORMANCE HOLD。

**起動負担軽減**：Windows用`scripts/R15S3D10_PRIVATE_WEBGL_ONE_CLICK.cmd`を追加。ブランチの作業コピーで実行すると依存導入→PRIVATEビルド→隔離実3Dステージ→`127.0.0.1:4373`起動・ブラウザ表示まで一括。手動操作可だが手動QA未提出。公開版・`main`/Gold/P100/保護元ソースは不変更。[正式な開発・次のR15S3D11方針](docs/G4E7DZ_R15S3D10_REAL_ORIGINAL_WEBGL2_CAMERA_HUD_B51_VISUAL_AND_HUMAN_GATE_JA.md)。

**次R15S3D11**：現在28基中接近3基の「障害物の実コース上での意味」と、正確なスクリーン画素・遮蔽・回避予告、原カメラ真正3D街区美術を同時に設計。元のB51正本を破壊せず、PRIVATE候補でのみ本当の物理可避なレイアウトを制作・元240Hzと人間目線で評価。都市美術は旧直方体/ワイヤーの詳細化を停止し、巨大曲線・生活圏の立体公共空洞・複数高低差・非対称主構造の実3Dを実カメラ5〜8視点で比較。正式ART採用0、Slope2認定0m、手動HUMAN・GAMEPLAY/ART/PERFORMANCE/RELEASE/MERGE HOLD。

**状態**：Draft [PR #46](https://github.com/ryomashibaba/dopagaki-development-hub/pull/46) OPEN/未マージ、正式本番公開なし。元ゲーム/CROWN・元Runner・元B51の定義・元`main`/Gold/P100を無改変の研究追加。

---

# R15S3D9 — 原240Hz Runnerで全7道路の真正FINISH・実イベント2世界PASS（2026-10-30 JST）

**R15S3D9 A_CONTINUOUS_NARROW_MACRO：SOURCE-NATIVE FINISH 2/2 PASS（実WebGL/人間/美術/正式GAMEPLAYではない）。** PRIVATE実験の実既存B48道路5・6を同時に再制作し、元ゲームの7本B48・28 B51、原Runner/CCD 240Hz、原P96/P94/A13、元route/routeSegments、正規カメラ、元CROWN〜道路4、元本番・main/Gold/P100・保護元blob `af076d67492a677d2235e4730aef8cdf4808e106`を凍結したまま、元0秒から真正240Hz×4条件を試験。

- **全7 B48トポロジー監査**：真正[Actions #40987951631](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40987951631) SUCCESS／[Artifact #12947213686](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40987951631/artifacts/12947213686)。元道路4→5中心1330.555063mの断絶、元道路5入口106m幅・道路6 110m幅、元物理路面の左右断面不整合を確認。旧R15S3D8R2単道路接続方式は物理反転でREJECT。
- **真のB48狭幅一体4案静的検査**：真正[Actions #40988252405](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40988252405) SUCCESS／[Artifact #12948201217](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40988252405/artifacts/12948201217)。2モード×2元世界の実道路5・6全31行を調整し、元道路4→5・道路5→6の実5頂点シーム0m、幅約16m、法線上向き・隣接最大0.096〜0.267°、接線差0.38〜0.72°。静的4/4 PASS（GAMEPLAY判定とは別）。
- **元Runner初回 [Actions #40988524554](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40988524554) FAIL**：原240Hz真正4条件の走行結果は記録完了したが、独立QAが旧R15S3D8R1の`terminalTimeOr45sCap`を新`terminalTimeOr95sCap`と誤参照したため比較証拠が欠落。元物理やB48形状は修正せず、読み込みスキーマの参照を修正した。失敗履歴を隠さない。
- **真正再実行 [Actions #40988751126](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40988751126) SUCCESS**：原CROWN 17s・21.5s prefix4/4、原物理4条件完全再試行、偽認定12拒否。Aは元true-pinch **69.829167s finished**、元pinch-switch **70.516667s finished**。B実物理ギャップは61.262500/61.845833s failed、ROAD6実接地0秒。
- **finishイベント最終監査 [Actions #40989026403](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40989026403) SUCCESS／[Artifact #12948217815](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40989026403/artifacts/12948217815)**：独立QA**14件の虚偽認定を拒否**。Aの両元世界で本物の`finished`だけでなく、元Runner発行の`finish`イベント各1件、**最終実B48 `p93-FINISH_RIDGE-01`に真正接地したまま終了**を再現。原実道路5支持10.258333/10.400000秒、道路6支持3.395833/3.433333秒。Bは元`finish`イベント0件。
- **残る重大課題**：今回はB51動体28基の元定義を維持したが、真正4ケースの**移動障害物への接触イベント0件**。ハザードの視認性・回避可能性・プレイの魅力のQA未実行。現行Aの真完走はSOURCE-NATIVE限定。元ゲームへ入れた正規WebGL、カメラ/HUD、本当の人間操作、性能、未来都市の圧倒的な美しさ、Slope2狭幅DNA約40%は未認定（ART正式採用0、正式Slope2認定0m）。
- **次のR15S3D10**：PRIVATE正規WebGLの実制作・元物理データ一致、実B51相対姿勢と予告・回避・画面内サイズ、元HUD・カメラと高速人間操作、元都市との立体的統合美術を、実画像と実体験で検査。診断コードだけの反復に戻らない。公開/マージ/main/Gold/P100/保護元ソースの改変なし。

**正式境界**：SOURCE-NATIVE 完走2/2 PASS・SOURCE TECH限定PASS。B GEOMETRYはPASSでもGAMEPLAY失敗でREJECT。**GAMEPLAY統合／ART REJECT・HOLD、HUMAN・PERFORMANCE・INTEGRATION・RELEASE・MERGE HOLD**。 [Draft PR #46](https://github.com/ryomashibaba/dopagaki-development-hub/pull/46) OPEN/未マージ、本番URLは変更なし。

[完全な真正出典・4条件比較・虚偽証明防止・R15S3D10へ繋ぐ実制作ゲート](docs/G4E7DZ_R15S3D9_REAL_FINISHED_TWO_WORLDS_AND_REAL_16M_DOWNSTREAM_CRITICAL_GATE_JA.md)

---

# R15S3D8 + R15S3D8R1 + R15S3D8R2 — 元物理長距離B48真正走行改善／下流106m道路で静的REJECT（2026-10-30 JST）

**[R15S3D8 Actions #40974883310](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40974883310) SUCCESS／[Artifact #12942306619](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40974883310/artifacts/12942306619)。** PRIVATE本物のB48道路3・4の大局線形を2案制作、元Runner真正0秒240Hz×2世界×2案＝4実走行、元CROWN prefix4/4一致・独立QA偽認定12種拒否。AのLOWER真正接地11.583333/11.879167秒、さらにVOID_SURGE実接地1.4125/1.129167秒、45秒時点`running`で**未完走**。Bは40.866667/41.045833秒に失敗し次道路0s、正式棄却。Aは道路4横断向きが約179.9°反転していたため正式不採用のまま。

**[R15S3D8R1 Actions #40975463767](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40975463767) SUCCESS／[Artifact #12942251735](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40975463767/artifacts/12942251735)。** 実B48道路4の反転を取り除き、元2世界で65秒上限の真正240Hz再走行・偽認定10種拒否。法線隣接最大0.092324°、最小法線Y+0.999622、VOID_SURGE実接地**12.587500/12.816667秒**。しかしその終端から既存道路5入口まで**1330.555063m**空間的に離れ、道路5真正接地0s。元Runnerは58.383333/58.895833秒に`failed`（落下）、真正`finished`0/2。元ゲーム・カメラ・ガイド・240Hz・B51全28・保護CROWN/SCISSOR不変。

**[R15S3D8R2 Actions #40975864305](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40975864305) SUCCESS（静的検査のみ）／[Artifact #12941719676](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40975864305/artifacts/12941719676)。** 実B48道路4から元道路5への**2,496.412m**の長距離再接続を試作。5頂点の実位置シーム0m、終端接線角8.619°まで達したが、元道路5入口**幅106m**と横断向きに合わせた結果、曲面法線最大171.408°反転・法線Y最低−0.999919で**真正静的形状ゲート両世界REJECT**。無理に元Runner物理を走らせず早期棄却。CI SUCCESSはゲート合格ではない。

**次R15S3D9：実既存道路4・5（必要なら6）を同時マクロ再設計。** まず全7 B48と全28 B51の路面・幅・横断向き・実シーム・元ガイドを真正3Dで監査し、無理な幅16→106m／裏返りを避ける。CROWN成功領域とSCISSOR前半、元Runner/CCD/P96/P94/A13・カメラ・本番・`main`・Gold・P100保護。真正2世界で実道路5以降の物理支持・`finished`まで確認後に実WebGL・HUMAN・ART・Slope2約40%へ接続。

**SOURCE TECH：本2試験限定PASS／R2 GEOMETRY REJECT／GAMEPLAY FAIL/HOLD／ART REJECT/HOLD／HUMAN・PERFORMANCE・INTEGRATION・RELEASE・MERGE HOLD。** 正式ART0件、Slope2認定0m、保護元game blob `af076d67492a677d2235e4730aef8cdf4808e106` 一致、[PR #46](https://github.com/ryomashibaba/dopagaki-development-hub/pull/46) OPEN/Draft未マージ。本番公開・元ソース改変なし。

[実際の6真正240Hz結果・3設計の比較と下流全体再設計ゲート](docs/G4E7DZ_R15S3D8_D8R1_D8R2_MACRO_NATIVE_AND_SPATIAL_VERDICT_JA.md)

---

# R15S3D7 — 34.5秒の両世界共通路端離脱と本物の曲面折返しを特定（2026-10-30 JST）

**真正 [Actions #40960042785](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40960042785) SUCCESS／[Artifact #12934369573](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40960042785/artifacts/12934369573)。** R15S3D6R1の両世界を元Runner真正0秒/240Hzで再生、旧R1の168/169標本全件一致、原17/21.5秒prefix一致、34.25〜34.75秒の121tick×2を元`contacts()`支持・実速度/forward・元guide・本物のB48中心/左右外縁で観測。独立QA12種の虚偽認定を拒否。元B48×7/B51×28、元P96/P94、元原物理/CDD、source blob、本番は不変。

- **共通支持喪失**：真のLOWER_REVERSAL最終支持34.504167/34.562500秒（true-pinch/pinch-switch）、道路の左側縁との最近3D距離0.876338/0.850160m、水平XZ近似距離**0.142629/0.295461m**（球半径0.65m）、右側縁3D距離6.396761/6.200663m。次tickに元`contacts()`走行支持が消滅。事前支持法線は(0.249757,0.958426,-0.137987)/(0.413438,0.886831,-0.206398)。原CCD各インパルス・瞬間衝突法線は未計測。
- **実形状の根本問題**：元LOWER_REVERSAL行9→11のCatmull-Rom局所接線差**約101.44°**、行10→11の`frame()`法線差**約170.92°**。行10中心(-1668.683,-4.782,374.370)→行11(-1668.844,-4.730,396.386)→行12(-1631.585,-2.775,435.546)へ、球の高速西進を2格子行で東側に戻す不自然な急折返しがある。**路端離脱・異常な曲面向き・方向補正の複合問題の可能性が高い**。幾何法線をCCD衝突法線と取り違えず因果断定はHOLD。
- 最初の[Actions #40959897832](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40959897832)は負テスト`fake-contact`が実際にはデータを変更しない不備で独立QA FAIL。元240Hz再現自体は成功。値反転方式へ修正し、上記真正成功CIで12/12拒否を確認。
- **R15S3D7採否**：観測と独立数値QAだけSOURCE TECH限定PASS。元R1道路は正式GAMEPLAY採用禁止、ART正式0件、Slope2認定0m。GAMEPLAY FAIL/HOLD、ART REJECT/HOLD、HUMAN/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD。
- **次R15S3D8**：局所幅増し・勾配微調整を停止。元LOWER_REVERSALから次の実B48までのマクロ線形・接続・曲率・正常法線・生成guide・元ボール進路を一体設計し、真正2世界0秒240Hzで評価してから実WebGL/正規カメラ/人間QA・巨大未来都市アートへ進む。main/Gold/P100/本番・保護blob `af076d67492a677d2235e4730aef8cdf4808e106` 不変更、Draft PR#46維持。

[実走行・曲面・左右路端の数値、失敗原因と次設計ゲート](docs/G4E7DZ_R15S3D7_TRUE_NATIVE_EDGE_EXIT_FOLDED_LOWER_ROAD_AND_NEXT_MACRO_GATE_JA.md)

---

# R15S3D6・R15S3D6R1 — 本物のB48道路計6真正240Hz、限定改善と新しい支持喪失を確認（2026-10-30 JST）

**SOURCE TECH限定PASS／GAMEPLAY FAIL/HOLD／ART REJECT/HOLD／HUMAN・PERFORMANCE・INTEGRATION・RELEASE・MERGE HOLD。** 元ゲーム・main・Gold・P100・本番、保護blob `af076d67492a677d2235e4730aef8cdf4808e106` 不変更。Draft PR #46 OPEN/未マージ。正式ART0件、Slope2認定0m。

- **R15S3D6真正 [Actions #40958123543](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40958123543) SUCCESS／[Artifact #12935000733](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40958123543/artifacts/12935000733)**：SCISSOR〜LOWERの2実B48立体形状×true-pinch/pinch-switch＝4真正240Hz。全4条件原17/21.5秒CROWN prefix一致、独立QA偽認定12拒否。Aはtrue-pinch 33.525秒落下／pinch-switch 28.6秒で衝突専用面へ衝突し棄却。Bは両世界で後続実B48へ接地（1.345833/1.404167秒、平均符号付接線速度+119.385/+116.010m/s）したが、33.433333/33.462500秒に転落。最大1tick全速度差51.234/53.898m/s、元R15S3D4とは観測窓・走行軌道が異なり衝突インパルスを直接証明しない。
- **R15S3D6R1真正 [Actions #40958849153](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40958849153) SUCCESS／[Artifact #12934677277](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40958849153/artifacts/12934677277)**：Bを土台に実LOWER_REVERSAL制御行2〜19を追加物理コライダーなしで再縦断。元2世界からの真0秒再生2/2と独立QA虚偽10拒否。**後続B48の本物の接地が1.345833→2.500000秒／1.404167→2.570833秒、最終転落は33.433333→38.404167秒／33.462500→38.454167秒へ延長**。正方向平均接線速度+119.590/+116.139m/s、後続接地中の負forward tick0。ただし**34.504/34.562秒のほぼ同じ原空間（X≈−1673、Y≈−3.8、Z≈380.5）、次道路u≈0.345665で実支持を失う**。直前の固定衝突増分と全速度変化54.215/56.480m/sはBよりむしろ悪化。全コース正式完走0/2、正式GAMEPLAY不可。
- R1初回[Actions #40958814417](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40958814417)は旧証拠JSON参照キー不一致でFAIL、コードを修正し上記本試験SUCCESS。失敗履歴を隠さない。
- **次のR15S3D7**：微小勾配調整を続けず、元LOWER_REVERSAL約34.5秒の真接触・速度/forward/guide・支持法線/CCD・両外縁最短距離を240Hzで因果切り分けし、次の実道路を含む連続な支持線形を設計して真正2世界で検証。元routeや物理の隠れ変更・安全床追加は禁止。実WebGL＋人間操作＋未来都市美術の統合ゲートを経るまで採用しない。

[詳細な真正結果、反証、R15S3D7次工程方針](docs/G4E7DZ_R15S3D6_R15S3D6R1_REAL_B48_NATIVE_RESULTS_CRITICAL_JA.md)

---

# R15S3D5真正4条件: guide / forward / 球速度を分離して根因候補を狭めた（2026-10-30 JST）

**真正 [Actions #40956811818](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40956811818) SUCCESS／[Artifact #12934470871](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40956811818/artifacts/12934470871)。** 元R15S3D4×4条件の全637tick位置・速度・操舵・接地・衝突回数を元Runner 0秒開始の240Hzで再現。元CROWN/B16 17s・21.5s prefix全4一致、元B48×7・B51×28・CCD・P96/P94・正規ガイド・元保護blob変更なし。独立QA12虚偽認定を拒否。

- **L true-pinch（31.4→31.6s）**：球の水平速度方向77.215250°変化に対し、元Runner実forwardは60.116003°回転、元guide局所向き0°変化。実接地は両端とも `p93-LOWER_REVERSAL-01`、guide距離15.558655→0.704717m。**路面着地の衝撃だけでなく、接地・原guide追従／法線投影を伴うforward再配向が重要な診断候補**。元物理のCCD瞬間法線・個別インパルスと各寄与の因果比率は未実測、断定禁止。
- **対照**：L pinch-switch 球6.776714°／forward0.002620°／guide0°、M true-pinch 球8.832734°／forward0.011621°／guide32.750776°（空中→接地でguide選択対象が変わる）、M pinch-switch 球8.200168°／forward0.002252°／guide0°。L true-pinchのみ45秒runningで**finishedではなく、他3条件落下**。全コース完走0/4。
- **次R15S3D6（未実装）**：CROWN成功領域・SCISSOR行0〜11・元物理と元route維持、(A) 早期実路面支持の長半径曲線／(B) 自然ギャップの迎え角・着地衝撃低減という真のB48形状二仮説を比較。両世界2×2真正240Hz、前方速度・実接地・衝撃・forwardとguide・終端判定を評価。無理な幅増し・見えない床・強制補正・原ソース改変禁止。実ゲームWebGL・人間QA前の正式採用禁止。

**SOURCE TECH R15S3D5限定PASS／GAMEPLAY FAIL/HOLD／ART REJECT/HOLD／HUMAN・PERFORMANCE・INTEGRATION・RELEASE・MERGE HOLD。** ART正式採用0、Slope2認定0m、PR#46 OPEN/Draft未マージ、本番・main・Gold・P100未変更。

[完整な真正データ分析・採否境界・R15S3D6実設計ゲート](docs/G4E7DZ_R15S3D5_SOURCE_NATIVE_DRIVEFRAME_GUIDE_VERDICT_AND_R15S3D6_DESIGN_GATE_JA.md)

---

# R15S3D4真正4条件再試験・初着地の速度急変と一世界限定の急旋回を特定（2026-10-30 JST）

**真正 [Actions #40900490016](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40900490016) SUCCESS／[Artifact #12908457792](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40900490016/artifacts/12908457792)。** 元R15S3D3 L/M×2世界の4真正240Hzを0秒から同じ道路・同じ合法操舵・元B51 28基で再生。旧結果への終端/接地tick/B51イベント回帰4/4一致、独立QA誇大認定・偽テレメトリ11種拒否。CROWN・早期SCISSOR・原物理・保護blob不変。

- 初めての次道路接地付近の**元Runner 1tick全速度差分**: L(true-pinch)76.3160m/s (31.3875s、固定衝突+1)、L(pinch-switch)75.4858m/s (31.220833s、+1)、M(true-pinch)78.3690m/s (31.454167s、+1)、M(pinch-switch)78.0729m/s (31.245833s、+2)。全4条件で本路面への**激しい鉛直着地速度修正**が示唆された。これは全速度差分であり直接CCD個別インパルス値ではない。
- 元240Hz速度ベクトルを使う31.4→31.6秒の水平方向角差: **L true-pinch 約77.22°** 対 **L pinch-switch 約6.78°**。M true/pinchは約8.83°／8.20°。L true-pinch 45秒runningに依存した成功認証は不可、他3条件は落下。**全コース完走0/4、正式GAMEPLAY FAIL/HOLD**。
- **次の実装方針:** 落下時間と着地角差を減らす連続した本物のB48支持線形を設計し、同時にL片世界の着地後急旋回が元ガイド・法線・合法操舵のどこから発生するかを分解。源流CCD接触法線・衝突インパルスそのものは未計測で、`contacts()`の事前支持法線と区別する。2世界の自然走行・実WebGL・人間公平性を検証するまで正式採用しない。

**SOURCE TECH: R15S3D4の原ソース再現・独立整合性限定PASS／GAMEPLAY: FAIL/HOLD／ART: REJECT/HOLD／HUMAN・PERFORMANCE・INTEGRATION・RELEASE・MERGE: HOLD。** ART正式0件、Slope2認定0m、保護元ソース・本番・main・Gold・P100変更禁止。Draft PR #46を維持。

[新しい元データと原因診断・次の物理設計](docs/G4E7DZ_R15S3D4_ORIGINAL_NATIVE_CONTACT_DISCONTINUITY_PROTOCOL_JA.md)

---

# R15S3D3真正4条件: 次B48への再接地4/4・ただし高速Uターンと世界差で正式HOLD（2026-10-29 JST）

**真正 [Actions #40879559256](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40879559256) SUCCESS／Artifact #12900355259：元240Hz 4/4実走行・独立QA偽7種拒否。次の物理B48への実再接地が4/4で初めて成立したが、全コース正式完走は0/4。** 真正接地継続はL(true-pinch) 13.6125s／L(pinch-switch) 0.883333s／M(true-pinch) 0.741667s／M(pinch-switch) 0.854167s。L(true-pinch)は45秒上限まで次道路上を約103m/sで走行中（**finishedではない**）、他3条件は33.63〜33.82秒に落下。

**重大な品質上の留保：** L(true-pinch)ではt31.4→31.6の球X速度が約−90.43→+7.39m/sへ急変し、0.2秒標本差によるX加速度の平均約+489m/s²。pinch-switchでは同区間も約−88.68→−87.02m/sで西進を続け、t32.1後に路面を失う。人間が快適に操舵した証拠も、滑らかな曲率・法線連続性の証拠もない。衝突による急激な方向転換の可能性があり、L(true-pinch)の45秒生存をGAMEPLAY改善認定に転用禁止。**次は2世界の真の接触時刻・法線・曲率・衝撃と元合法入力の一致／不一致を調査し、両世界で滑らかに走れる真のB48連続曲線に修正する。** エンジンやカメラ・操舵ルートを隠れて変更しない。

SOURCE TECH=限定PASS／GAMEPLAY=FAIL/HOLD／ART=REJECT/HOLD／HUMAN・PERFORMANCE・INTEGRATION・RELEASE・MERGE=HOLD。正式ART0件、Slope2認定0m。本番・main・Gold・P100未変更。Draft PR#46未マージ。[R15S3D3真正検査と次工程](docs/G4E7DZ_R15S3D3_REAL_WESTWARD_RECONTACT_STUDY_JA.md)。

---

# R15S3D2真正4/4失敗確定 → R15S3D3実B48西進／再接地研究（2026-10-29 JST）

**最新真正R15S3D2 [Actions #40870432064](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40870432064) SUCCESS／artifact #12895893405。4/4元240Hz実走行で最終落下、次B48接地0。** SCISSOR最後の真接地（true-pinch J/K 26.704167/26.7125s、pinch-switch J/K 26.6125/26.575s）。元エンジンforward<25m/s接地0tick、B51接触0件、SCISSOR符号付き接線速度平均約+110m/s：逆走ではなく高速時の物理支持喪失が主問題。SOURCE TECH限定PASS、GAMEPLAY FAIL。

**R15S3D3開始：実験候補2形状×元2世界。** 既存の凍結CROWNとSCISSOR初期行を保存し、元球の西向き空中進路に沿う本物のSCISSOR再設計と次実B48の入口接続を研究。元240Hzを使う4真正条件／独立QA／真接地遷移記録。新CI結果を確認する前にR15S3D3のPASS/改善は認定しない。ガイド変更・元物理変更・本番デプロイなし。GAMEPLAY/ART/HUMAN/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD、ART採用0件、Slope2正式認定0m、Draft PR #46維持・main/Gold/P100/本番禁止。

[研究根拠・制御格子・採否](docs/G4E7DZ_R15S3D3_REAL_WESTWARD_RECONTACT_STUDY_JA.md)

---

# R15S3D0/S3D真正診断確定：急登坂と符号付逆走が本質的問題、R15S3D2二道路縦断実装中（2026-10-29 JST）

**真正R15S3D0 [Actions #40868422387](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40868422387) SUCCESS**、SCISSOR元E実高度は行11=66.521m→行17=146.787m→行30=195.000m、次道路入口中央位置と接続一致。元走行の路面接線向き半秒変位プロキシはt31以降で負に転じ、速度停滞・逆方向移動が起きていた。

**真正R15S3D [Actions #40869087958](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40869087958) SUCCESS**、SCISSOR後半行17〜28を3形状×2世界の6元240Hz物理試験。6/6とも次道路への真の接地0。G pinch-switchは45s runningであるがSCISSOR符号付接線速度平均−18.452m/s・原forward25m/s未満の接地約11.33sであり、走破やGAMEPLAYの改善と認定できず。公式ART0、Slope2認定0m。

**R15S3D2を実装**：急登坂そのものを修正し、SCISSOR行12〜30＋次道路実入口行0〜19を一体縦断にする2実形状（出口130m／145m）×2世界＝4真正240Hz試験。元CROWN B16、SCISSOR行0〜11、元28 B51、240Hz/CCD/操作を保持。元R15S3Bのt17／21.5と一致すること、正方向の接線速度・実接地・次B48進入で判断。[Actions #40870432064](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40870432064)は検証待ちで、未確認PASSは出さない。ART REJECT/HOLD、GAMEPLAY/HUMAN/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD、Draft PR#46未マージ、本番禁止。

詳細：[R15S3D0/S3Dソース証拠とR15S3D2縦断計画](docs/G4E7DZ_R15S3D0_D_NATIVE_SIGNED_SPEED_FAILURE_AND_D2_DESIGN_JA.md)。

---

# R15S3D 隔離道路6真正240Hz試験を実装・CI結果待ち（2026-10-29 JST）

**最新実装状態**：元B16 CROWN全面凍結・SCISSOR行0〜16保持のまま、後半行17〜28の実B48を3候補（G 勾配緩和／H 接線方向道路延長／I 接線道路＋後半細道）として試作。2元B48世界×3形状×元21.5sまでP96／以後合法P94＝6真正240Hz走行、最大45秒。元28 B51、240Hz/CCD、ボール操作、原ゲームファイルは変更なし。移動方向の**符号付き道路接線速度**、原前進速度25m/s未満／逆向きtick、実SCISSOR支持／後続道路実接地を必須評価。

[本試験Actions #40869325008](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40869325008)と[道路・次道路の幾何監査 #40868422387](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40868422387)は実行待ちで、**結果未検証**。技術PASS・GAMEPLAY PASSを事前に主張してはならない。独立QAは偽次道路通過、偽人間／WebGL／美術等13ケースを拒否する設計。実測で次道路まで自然接地が確定するまでは正式ART0件／Slope2認定0m、公開・マージ禁止。PR#46 Draft・元保護blob af076d67492a677d2235e4730aef8cdf4808e106 保持。

[R15S3D研究仕様・棄却条件](docs/G4E7DZ_R15S3D_GENUINE_SPEED_NEXT_JUNCTION_PROTOCOL_JA.md)

---

# R15S3C真正最終失敗確認：R15S3Bの接地改善は成果だが大幅減速を伴う、次R15S3Dへ（2026-10-29 JST）

真正 [R15S3C Actions #40867343670](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40867343670) **SUCCESS／Artifact #12893084995**。元R15S3B E_BANKED_LANDING＋P94フルの2世界を元0秒から再走行し、保存済み0〜34s全標本一致・独立QA偽承認10拒否。**true-pinch 35.770833s、pinch-switch 36.062500sでともに「コースから落下」。**最後の真正接地32.845833/33.141667s、34s後の実再接地0、後続B48進入0。R15S3Bの34s時点runningは完走ではなかった。

さらに速度は24秒128.743/130.033m/s→31秒約10.701/20.325m/sに低下し、接地延長と引き換えに高速爽快感が失われる問題を確認。34秒の速度上昇は両世界とも空中であり前進加速の証明ではない。**E案は「実再接地を増やした物理研究成果」として保管、正式GAMEPLAY・ART採択禁止。**

次R15S3Dでは元CROWN B16の成功域を守りつつ、SCISSOR中盤〜出口・後続道路の真の線形、縦断、曲率、前方接線速度と実接地／自然再接地を同時設計。単純な滞在時間延長や装飾の量産を成果扱いしない。公式ART0件・Slope2認定0m、GAMEPLAY/HUMAN/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD。本番禁止・Draft PR #46未マージ。

証拠：[R15S3C真の終了・大幅減速を含む独立批判](docs/G4E7DZ_R15S3C_TRUE_NATIVE_TERMINAL_SPEED_CRITICAL_JA.md)。

---

# R15S3B 12真正240Hz SOURCE TECH限定PASS → R15S3C 34秒後の真終端検証へ（2026-10-29 JST）

[真正R15S3B Actions #40866341059](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40866341059) SUCCESS／Artifact #12894166744／元B16 CROWN実格子全保持、3個の新SCISSOR物理路面×2元世界×2合法操作の**12真正240Hz実走行**。17秒・21.5秒の元R15Q B16との原位置一致と独立QA偽認証13種拒否。12/12でSCISSOR実接地あり。D/FとE旧P96の計10本はすべて最終落下。**E_BANKED_LANDING＋P94フルでは両世界34s時点でrunning、しかしすでに空中で、最後の真接地は32.845833/33.141667s。正式完走0。** EのSCISSOR累積実接地4.35/4.0375秒、到達ガイド近似u.5625/.578125。元B16＋フルの最終接地23.54/23.42sより大幅に改善したが、人間が楽しめる・実ゲームで完走可能とは証明していない。

**次R15S3C**：E/P94の元0秒開始2世界を34秒以降まで延長し、原0〜34sの元保存標本を逐一照合して、本当の失敗・完走・打切りを調べる。実際の再接地・後続道路進入を確認し、成功までGAMEPLAY HOLD。正式ART0件、Slope2正式認定0m、HUMAN/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD、Draft PR #46未マージ、本番禁止。

詳細：[R15S3B真正12走行とR15S3C検証条件](docs/G4E7DZ_R15S3B_TRUE_12_NATIVE_SCISSOR_SOURCE_REENTRY_JA.md)。

---

# R15S3真正240Hz 3マクロ形状×2世界×2合法入力＝12試験完了：全形状不採用 → R15S3B原CROWN保護再設計開始（2026-10-29 JST）

[真正R15S3 Actions #40865305848](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40865305848) SUCCESS／Artifact #12893781001／独立QA偽認証13拒否。ただし3案いずれもSCISSORに実接地0秒で、**12/12全件落下**。CROWN後半まで変更したことで、R15S2Bで成立していたSCISSOR実到達も失った。A最終接地19.85/19.7125秒、B20.3875/20.2625秒、C20.0333/13.354167秒（true-pinch/pinch-switch）。正式ART・Slope2採択0、GAMEPLAY/ART/HUMAN等HOLD。

次R15S3Bは元CROWN B16を完全保存し、実R15Qの自由飛行軌跡（t22.5〜24）を参照して元SCISSOR実路面だけを3マクロ案として再設計、元240Hz／B51×28で12条件比較。前半17秒・21.5秒の真正元R15Qトレースと不一致ならFAIL。接地延長が実証されるまでART詳細化禁止。元ゲームblob af076d67492a677d2235e4730aef8cdf4808e106不変、PR #46 Draft未マージ、本番公開禁止。

詳報：[R15S3 12実試験の批判的評価・R15S3B再設計](docs/G4E7DZ_R15S3_GENUINE_12_MACRO_REJECT_AND_R15S3B_REDESIGN_JA.md)。

---

# R15S2B真正12本合法操舵の物理対照試験完了 → R15S3マクロ道路再設計（2026-10-29 JST）

**真正 [Actions #40862771923](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40862771923) SUCCESS／Artifact #12892262124／元240Hz 12/12実試験・独立QA偽認証13拒否。ただし12/12すべて真のRunnerで「コースから落下」、完走0。** 元P96 early-soft入力を21.5秒までは原物と完全一致させ、以後に既存P94合法操舵を1/4.8倍またはフルで入力。同一B48道路形状・全28動体・元物理を保持。

**P94合法フルはSCISSOR最後の実接地を元P96比+0.504〜+0.767秒延長**。入力方式にも原因の一部があるが、元道路を実際に抜けるには不足。2道路×B16/B40/C30狭幅×2入力＝12条件とも最終落下。フル入力6試験で障害物接触系イベント1件ずつ、ただし最終失敗は落下。元狭幅最狭u約0.177の真正接地通過は未確認。自動合法入力は人間公平性証明ではない。

**次のR15S3**：局所幅増しや固定操舵試験の反復を停止し、CROWN出口〜SCISSOR入口〜上り区間を一体のマクロ道路として曲率・縦断・バンク・路幅移行・B51予告とともに実コライダー再設計。実接地通過を確認できた候補を都市の巨大構造と真正Blender＋実WebGLへ進める。公式ART0件、Slope2認定0m、ART REJECT/HOLD、GAMEPLAY/HUMAN/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD、Draft PR #46未マージ、本番禁止。

証拠：[R15S2Bの12真正フル走行と批判的評価](docs/G4E7DZ_R15S2B_12_LEGAL_CONTROLLER_NATIVE_REPLAY_JA.md)。

---

# R15S1＋R15S2A技術限定PASS／R15S2B開始（2026-10-29 JST）

真正R15S1 Actions #40861606593 SUCCESS、元R15Qの8真正240Hz走行一致・独立QA13偽認証拒否。真正R15S2A Actions #40861980465 SUCCESS、元SCISSOR狭幅の真補間XZ道路幅とP96旧横回避目標の静的監査。R15S2Bは12合法操舵の元240Hz試験を実装し、結果待ちのため未認定。

新しい重要事実：8条件の最後のSCISSOR実接地はu約0.018〜0.065・幅約110〜113mの入口であり、狭幅u約0.177には到達していない。従って最初の転落を旧P96の狭幅回避目標が引き起こしたとは現状断定できない。補間XZ幅の局所最狭は約14.314m、ボール半径控除後の左右対称近似片側余裕約6.507m。元P96希望横回避目標24／25／33／34mは狭幅設計に不適合だが、即座の実落下や人間公平性の立証ではない。

元ゲームblob af076d67492a677d2235e4730aef8cdf4808e106不変。SOURCE TECH限定PASS、ART REJECT/HOLD、GAMEPLAY/HUMAN/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD、公式ART採択0件・Slope2認定0m。PR #46 Draft・未マージ、本番サイト公開禁止を維持。

詳細：[R15S1/R15S2Aの真正証拠とR15S2B計画](docs/G4E7DZ_R15S1_R15S2A_TRUE_NATIVE_STEERING_GEOMETRY_CRITICAL_JA.md)。

---

# R15R 完了：元240Hzカメラ＋元B51 28体＋実B48道路の真正18視点・WebGL画角同値（2026-10-29 JST）

**最終 GitHub Actions [#40843279477](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40843279477) SUCCESS／Artifact #12884446304／元ゲームblob `af076d67492a677d2235e4730aef8cdf4808e106` 不変／PR #46 Draft未マージ。** 初回[#40842697659]でも技術QAは成功したが元ShaderとBlenderの画角不一致を発見し、原WebGLの`1.35`投影係数に相当する**15.549107mm（1008×645）**へ修正・独立QA13偽認証拒否して最終成功。元R15Q 8条件×元P96 240Hz真Runnerから得たカメラ姿勢を元B48 3Dに当て、動的B51全28体の時刻別物理OBBを重ね、**真正ソース由来PNG18枚・編集可能BLEND6枚**を生成。これらは**再構成Blender**であり元ブラウザWebGLではない。

**22秒の実元エンジン接地は8/8すべて空中、23秒は1/8のみ接地、全8走行は最終落下し完走0。** 実画像を直接確認し、路面が単調・背景が空虚・未来都市建築が未成立なので**ART REJECT**。次はカメラゲート追加ではなく、元117m/s級の曲率・連続接地・10〜16m狭幅・元B51先読みを両立する本物のマクロ道路設計と、接続された大規模都市造形へ。GAMEPLAY/HUMAN/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD、正式ART0件・Slope2認定0m、本番/主ブランチ禁止。 [根拠とR15S方針](docs/G4E7DZ_R15R_TRUE_SOURCE_CAMERA_28_B51_PHYSICAL_BOUNDS_AND_WEBGL_FOV_JA.md)。

---

# R15Q / R15Q3 — 真の狭幅C1 SCISSOR道路8走行＋実B48編集可能3D8案の独立検証（2026-10-29 JST）

**技術的SOURCE PASS／実元ゲームGAMEPLAY FAIL／ART REJECT。正式採用0、Slope2正式認定0m。元ゲームのGit blob `af076d67492a677d2235e4730aef8cdf4808e106`不変、Draft PR #46未マージ。ART/GAMEPLAY/HUMAN/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD、公開・正式施工禁止。**

- **R15Q元真正の物理**：元B48 SCISSOR_RISEの格子行1〜13を物理的に曲げ、元CROWN B16・SCISSOR入口行0／行14以降・B51×28を保持。4形態（B16基準／元幅維持C1中心線24mシフト／元幅維持40mシフト／30mシフト＋局所16m幅）×2元道路＝**8真正240Hz native 0秒実走行**。すべてエンジン`failed`「コースから落下」。
- **実測**：B16基準の落下true-pinch25.704167s／pinch-switch25.562500s。24mシフト25.845833／25.695833s、**40mシフト26.104167／25.954167s（この4形態中最良）**、局所16m幅25.954167／25.804167s。B40は接地最後23.079167／22.929167s、基準比たった約0.283／0.279秒の実接地延長。元の広幅77.256mは保持、目標の狭幅は未達。C狭幅案は本物の一部16m物理路面を作れたが2世界とも落下でGAMEPLAY FAIL。
- 本物の試験データは [Actions #40833907561](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40833907561) から保存（元のJS変位accumulator `const`失敗を修正して計8本作成）。初回独立QAは、元Catmull-Rom補間の不変位置点でも曲率導関数が変わることを正しく扱えずFAIL。保存済み8本の独立QA [Actions #40834442343](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40834442343) **SUCCESS**、12種類の偽承認を拒否。真の物理試験と独立QAのCI結論を混同しない。[R15Q研究報告](docs/G4E7DZ_R15Q_GENUINE_SOURCE_C1_CURVE_AND_16M_NARROW_EIGHT_NATIVE_JA.md)
- **R15Q3元3D造形可視化**：元の`tessellate()`から真正CROWN+SCISSOR各4728三角形の物理道路面を生成、2世界×4形態で**8 BLEND（編集可）／8 GLB／8 Blender技術俯瞰PNG**にし、元Runner0.25秒ごとの接地/空中を区別してモデルへ重ねた。真正 [Actions #40835268471](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40835268471) **SUCCESS**、Artifact #12880063847、独立QAはBLEND/GLB2.0/PNG原画像・真のソース三角形・実測サンプル点＋10偽認証拒否、すべてPASS。初回[#40835079050](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40835079050)は空Blender World未設定で止まったが修正。俯瞰画像は本来のゲームプレイヤーカメラではない。[R15Q3の3D証拠・美術/物理批判](docs/G4E7DZ_R15Q3_TRUE_NATIVE_B48_8_EDITABLE_3D_ROAD_AND_TRAIL_CRITICAL_REVIEW_JA.md)
- **重要な反省**：source本物の水平XZ俯瞰比較により、SCISSORが曲がるのに対して、最後の実接地を離れたボール軌跡は道路外を直線的に飛び続けることが明瞭。局所曲率や狭幅のつまみ調整で安全走行や魅力的なSlope2道を得たと誤判定しない。16m狭幅の局所「くびれ」も、元巨大112m入口～幅77mの後続との連続美術がなくART採用禁止。
- **次R15R**：**元約117m/sの実速度、必要な走行方向変更に対して曲率／操舵能力／勾配を計算・整合し、CROWN出口～SCISSOR～上り道を一体の長い狭幅10〜16mコースとして設計**。元B51×28とカメラ警告、戻れる落下復帰、超未来都市美術、原作DNAが必要。完走0・人間QA0・原ゲームWebGL0である以上「ART/GAMEPLAY合格」発表は禁止。

---

# R15P 完了 — SCISSOR入口の真正B48物理8試験／全例落下・単純拡幅REJECT（2026-10-29 JST）

**R15O実道路の重要改善は維持。ただしR15Pの外縁拡幅8/16/24mの3案はゲーム採択REJECT／ART REJECT。** 元ゲームソースblob `af076d67492a677d2235e4730aef8cdf4808e106`不変、PR #46 Draft未マージ、R15O/Pの新規ゲームコライダー0、正式ART採択0件、Slope2正式認定0m、本番禁止、**ART/GAMEPLAY/HUMAN/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD**。

- 真正源流 [R15P Actions #40831737781](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40831737781) **SUCCESS**。元のP96操作、P101 240Hz、2道路×4形態（B16 CROWNのみ／後続SCISSOR入口v0の8/16/24m外側実路面拡幅）＝**8本の真正フル走行**。基準のR15O4（0〜36秒）全記録と完全一致。独立QA偽GAMEPLAY/ART/人間・元物理改変等10件拒否、SUCCESS。Artifact #12878653870。
- 基準B16のみの真の落下：**true-pinch 25.704167秒／pinch-switch 25.562500秒**。
- SCISSOR入口v0 +8m：25.991667秒／25.845833秒で落下。
- +16m：26.241667秒／26.100000秒で落下。
- **+24m：26.458333秒／26.308333秒で落下**。これが限定3形態中では最長だが**両世界でGAMEPLAY FAIL、完走0**。B16比の延長は約0.754秒／0.746秒、最後の実SCISSOR接地は23.2875秒／23.1375秒。
- SCISSOR元入口幅は**112m**あり、+24mまで拡幅しても改善が約0.75秒しかない。物理的改修としての結果は再現可能だが**10〜16mの狭幅・Slope2 DNA・美術には不適合**。外縁を広げる反復を停止。[R15P真正8ケース＋批判的美術判断](docs/G4E7DZ_R15P_REAL_SCISSOR_B48_8_NATIVE_TRIALS_CONTOUR_REJECT_JA.md)
- 次R15Q：**道路中心線の旋回半径、速度、横加速度、路面勾配、前方予告、元B51公平性**を合わせて**別案の実3D曲線設計と物理対照試験**を優先。場当たり的な橋／過剰な幅増し／固定操舵を再採用しない。実WebGL・人間操作・都市アートの正式QAは未実施。

---

# R15O + R15O4元B48実路面・物理改修研究／R15P後続SCISSOR接続実験開始（2026-10-29 JST）

**真の改善・ただし全コース未修復。** 元ゲームソースblob `af076d67492a677d2235e4730aef8cdf4808e106`と物理エンジン・既存B48/B51・本番は**一切変更していない**。Draft PR #46の隔離試験のみ。ART/GAMEPLAY/HUMAN/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD、本番禁止、公式ART採択0件、Slope2正式認定0mを維持。

- **R15O根本原因**：真の元P96 240Hzプレイヤーは `p93-CROWN_REVERSAL-01` の急カーブ外縁、**u≈0.600・v=0**で支持を失う。元道路幅約33.96m→約14.44m。真正原メッシュ照合[Actions #40829468768](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40829468768) SUCCESS。
- **隔離実物理路面3案、16真正実走行**：8m外縁拡幅／**16m外縁拡幅＋最大1mバンク**／22m中心線修正を元のB48乗れるコライダーで構築。元のP96またはR15N2共通の15.75秒から右+0.18、2世界×4形態×2操作=16走行。真正ソース計測[Actions #40830080170](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40830080170)本体16走行生成、全体は重複メタデータ属性名誤りでFAIL。保存済みの真正結果を再利用した独立QA[Actions #40830496328](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40830496328)SUCCESS、偽GAME/ART等12件拒否。
- **16mバンク案が実物理を大幅改善**：元P96操舵を**変更しない条件**でtrue-pinchの最終接地17.170833→**22.795833秒**、本物の落下19.583333→**25.704167秒**。pinch-switch最終接地17.008333→**22.650000秒**、落下19.412500→**25.562500秒**。元より**6.121秒／6.150秒**延長。R15O4真正0〜36秒再走行[Actions #40830811488](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40830811488)SUCCESS、保存済み0〜24秒と厳密同一、独立QA偽認証10件拒否。「24秒時点でrunning」は完走ではなく両方25秒台で落下。
- **実際に次の元道路へ到達**：16mバンク案の最終接地元道路は**`p93-SCISSOR_RISE-01`**（B48原区間）。R15O5真正検査[Actions #40831145326](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40831145326)SUCCESS。元SCISSOR出口直後ではなく**入口u≈0.025・v=0の外縁**で支持が切れる。原メッシュ最近距離約3.17m／3.06m。
- **R15P隔離試験の方向**：元B16 CROWNを保持し、元SCISSOR入口u0断面を固定、実路面の外縁行1〜8を8／16／24m滑らかに補正する元物理シーン3案とB16無変更基準を比較する。元物理コード、本番、他道路、B51全28は元のまま。**結果は実Actionsおよび真正QAを確認するまで未確定**。正式施工・ブラウザWebGL・人間評価も未実施。

詳細[ R15O / R15O4研究報告 ](docs/G4E7DZ_R15O_ORIGINAL_REAL_B48_PHYSICAL_CURVE_16_REPLAYS_AND_BANKED36_JA.md)。次に重要なのは改修路面の物理連続性に加え、真のゲームカメラとB51人間公平性、狭い道路・Slope2 DNA・超未来都市の景観を統合して成立させること。**数秒延長のみをGAMEPLAY PASSとしない。**

---

# G4E-7DZ R15N＋R15N2 — 実BLEND橋梁4案ART REJECT／元240Hz進入操舵24件すべて落下（2026-10-29 JST）

**元ゲーム本体・物理・B48/CX/B51は不変。Git blob `af076d67492a677d2235e4730aef8cdf4808e106`、PR #46 Draft・未マージ、本番非公開。正式ART採択0件、Slope2正式認定0m、ART/GAMEPLAY/HUMAN/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD。**

**R15N 実3D建築試作：** 真正Actions [#40815310461](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40815310461) SUCCESS。元B48 `p93-CROWN_REVERSAL-01` の最終原物理接地を起点に、両道路で64m×10m開放ラチスA（各54編集オブジェクト）、72m×14m分岐回廊B（各63）を元R1 Blenderに構築。**計4 BLEND＋4 GLB＋8元ゲームカメラ実レンダリング**、12偽認証拒否まで実施。元地形に基礎がついた支持脚**0/5×4案**。視認割合は両道路16秒では0、16.5秒でも最大1/135、17秒で最大18/135。**全4案ART REJECT／実コライダー0・施工0**。この浮遊橋の詳細化を停止。[美術／設計否認の根拠](docs/G4E7DZ_R15N_ORIGINAL_SOURCE_4_REAL_BRIDGE_ART_REJECT_AND_R15N2_PIVOT_JA.md)

**R15N2 元の高速カーブ改善の実走行：** 真正Actions [#40815591798](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40815591798) SUCCESS／Artifact #12873030009。元P96 fixed入力を保持し、15.0／15.75／16.25／16.5秒から右+0.18／+0.35／+0.52を付加する**12条件×元道路2＝24の実240Hz走行**と独立QA12偽承認拒否。24件すべて元エンジンで「コースから落下」、完走0件。接地を最も保った個別試験はtrue-pinch **18.995833秒**（16.25s,+0.18）、pinch-switch **18.712500秒**（15.75s,+0.18）。両道路共通の限定12条件で最良は**15.75s,+0.18**（true-pinch18.808333s、pinch-switch18.712500sの実接地）だが、両方とも21秒前後に落下、GAMEPLAY PASSではない。入力を強めると悪化する条件があり、定数右操舵だけでは根本解決できない。[全24試験と次方針](docs/G4E7DZ_R15N2_24_REAL_NATIVE_EARLY_STEER_TESTS_FAIL_NO_NEW_BRIDGE_JA.md)

**次R15Oの方針：** 元p93急カーブの横断・曲率・走行予告・狭幅10〜16m・B51との共存・落下復帰を統合し、見た目だけの浮遊物や定数操舵の追加乱試験ではなく、**元道路の実際のプレイ可能な変更案（隔離した試験の実3Dと元物理の対応）**を品質優先で検証。正式元ゲームソース変更・本番反映・マージは禁止継続。

---

# G4E-7DZ R15M3完了 — B48元道路端での真の240Hz落下・早期右補正の限界（2026-10-29 JST）

**R15M/ R15M3 SOURCE TECH検査PASS。実道路修復未実装、ART HOLD、GAMEPLAY HOLD。** 元物理・入力・B48×7/CX18/B51×28・カメラ、ゲームソースblob `af076d67492a677d2235e4730aef8cdf4808e106`不変。PR #46 Draft未マージ、本番非公開。

- **元固定操舵**：true-pinchの最終元道路接地17.170833s→離脱17.175s→19.583333s落下。pinch-switch最終接地17.008333s→離脱17.0125s→19.4125s落下。接地していた原道路IDは両方`p93-CROWN_REVERSAL-01`。本物の原Blender B48上面境界への水平最短距離はtrue-pinchで0.174m→0.286m、pinch-switchで0.147m→0.257m。
- **16.5sより早期操舵補正（試験のみ）**：左-0.35はtrue-pinch 19.525s／pinch-switch 19.375sで落下。右+0.35は20秒時点では両道路ともrunningだが、原B48最終接地は18.483333s／18.358333sで終わる。20秒以降も元の入力で本当に継続すると、**true-pinch 20.650s／pinch-switch 20.483333sで再び「コースから落下」**。完走でもゲーム修復でもない。true-pinch右補正の一時離脱17.591667sと再接地、最終離脱18.4875sを別々に確認。
- **真のCI・独立QA**：R15M元ゲーム6走行本体の初回[#40808924333](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40808924333)は途中離脱を最終離脱と取り違えてBlenderゲートFAIL。元6走行を再利用した元B48実面測定[#40809307778](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40809307778)は元Blender測定完了・独立QA属性名誤りでFAIL。**元ソース証拠を再利用し、独立QA[#40809596433](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40809596433) SUCCESS（偽認証13件拒否）**。延長走行R15M3真正[#40809877708](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40809877708) **SUCCESS（偽認証12件拒否）**。
- 次工程**R15N**は、原B48道路端・走行軌道・横速度・路面連続支持の因果分析と、隔離した原地形上の橋／道路接続実3D設計の可否を確認。**都市を浮遊箱だけで追加して問題を隠さない**。公式ART採択0件、Slope2正式認定0m、ゲーム新コライダー0、GAMEPLAY/HUMAN/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD維持。

関連報告：[R15M 元物理の道路端](docs/G4E7DZ_R15M_REAL_B48_240HZ_FINAL_EDGE_AND_EARLY_STEER_JA.md)／[R15M3 20秒以降の最終確認](docs/G4E7DZ_R15M3_ACTUAL_POST20_RIGHT_STEER_STILL_FALLS_JA.md)。

---

# G4E-7DZ R15L2 — 元Runner失敗理由の真正確定と17秒以降の操舵比較（2026-10-29 JST）

**真正 GitHub Actions [#40803935993](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40803935993) SUCCESS／Artifact #12867133216。** 元17.0秒の位置・カメラ・物理路面とR15L真正保存証拠は全て一致。原P96固定入力と17秒以降の左右±0.35だけを変更した入力の**2道路×3試験＝6走行**を原240Hzで実行。6/6全件、元エンジンの `Runner.failure.reason` が **「コースから落下」**。元入力はtrue-pinch 19.583333s／最終接地17.170833s、pinch-switch 19.412500s／最終接地17.008333s。左右補正でも19秒台に落下し、前半からのコース進入変更や道路支持構造を調べる必要がある。**元物理エンジンと元ゲームソース編集0、コライダー追加0、人間プレイ未確認。** 独立QA PASS、12偽認証拒否。

次のR15Mは16.5〜17.5sの元道路支持・進入方向・縁距離の**本物のB48 3D接続原因**を調べ、17秒より前からの入力・安全な道路支持の比較。路外落下を都市アートだけで隠すことはしない。[R15L2元エンジンの根拠とR15M方針](docs/G4E7DZ_R15L2_REAL_SOURCE_TERMINAL_FAILURE_6_INPUT_SENSITIVITY_JA.md)。正式ART採択0件、Slope2認定0m、ART/GAMEPLAY/HUMAN/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD、PR #46 Draft未マージ、本番公開禁止。

---

# G4E-7DZ R15L — 元240Hz開始0秒の真正全可走行区間・CX18広域土地研究（2026-10-29 JST）

**元ゲームソース不変** `af076d67492a677d2235e4730aef8cdf4808e106`。元P96 early-soft＋P101 OVERDRIVE固定スクリプトでR1の11〜17秒13カメラを再現し、元ゲームRunnerの実終了まで観測：**true-pinchは19.583333秒でfailed、pinch-switchは19.4125秒でfailed**。両道路共有実カメラは0.5〜19.0秒の38時点（26時点?ではない）、架空の52秒カメラなし。17.0秒は接地、17.5秒以降路面離脱し、Yが急降下。ただし人間が必ず失敗する証拠ではなく、真のエンジン失敗理由を検査するR15L2が次。

元Blenderの**CX全18、B48×7、B51×28**と上記の実カメラを交差検証。上向き25点支持研究対象の両道路同一XYZ候補240件、幅6/10/16m支持標本113/102/25件。最長共通連続視認は4半秒時点で要求5に届かず、元B51画面警告・道路近接の統合研究通過**0/240**。CX地形の視認はほぼ11〜17秒に限定、0〜11秒には今回の研究閾値を満たす候補なし。**支持した床≠巨大都市の美術/交通/安全認定**。

真正固定物理・Blender全測定GitHub [#40802904554](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40802904554) はデータ生成成功・QAフレームゼロ詰めバグでワークフローFAIL。保存Artifact #12867410080を**高負荷再実行せず**独立QA [#40803366440](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40803366440) **SUCCESS**、18種の偽合格拒否、検査Artifact #12866588180。正式評価SOURCE RESEARCH TECH PASS／ART HOLD、正式ART採用0、Slope2認定0m、GAMEPLAY/HUMAN/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD、元ゲーム新コライダー0、PR #46 Draft未マージ、本番公開禁止。

研究報告：[R15L 真正固定ルート・CX18広域土地・独立QA](docs/G4E7DZ_R15L_ALL_ACTUALLY_REPLAYABLE_NATIVE_FULL_CX_ATLAS_JA.md)。次工程はR15L2「本当のRunner.failure.reasonと17秒以降の入力感度比較」を隔離し、主都市は狭いCX片での箱の再試作を停止、元道路に連結する広域実3D設計を優先。

---

# G4E-7DZ R15K4C — 元CX指定2ポリゴン限定25点支持・R1カメラ研究（2026-10-29 JST）

**R15K4B 真正Actions #40796634747 SUCCESS。** 元CX02（面index1・840.00037㎡）とCX04（面index0・216.00031㎡）の元頂点を解析し、着地点0件に対して地形重心側で5点全支持4件を検出。ただし元ゲームでの歩行や巨大都市成立を認定しない。

R15K4Cは最初に同じCXメッシュの**別の上向き面まで含む誤った40件**を抽出したため、その値を正式採用しない。元R15K4B真正Artifact #12864276582の指定ポリゴンindex・頂点・原面積に制限し、25点実面内支持を**CX02 20案／CX04 16案＝36案**で元Blender計測。両道路の正規13時点で、スクリーン標本の連続可視は両地区とも最長**2半秒標本**。要求5標本に届くもの0。道路→CXの人間用連続動線、真のB51全姿勢・美術を認定せず、正式採用0。元Blender初回測定Actions #40797415284は独立QA引数不足でFAIL。その後修正し**真正Actions [#40797876186](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40797876186) SUCCESS／Artifact #12864532551**。指定2枚のポリゴン同一性・25点床・R1両道路・元B51距離の独立QA PASS、偽認証**14件拒否**。SOURCE研究に限定した技術PASSであって、ART/GAMEPLAY/HUMAN PASSではない。

今後の方向性：既存のCX02/CX04の二面だけで巨大未来都市の主役を成立させる過度な局所調整を停止。**R15Lでは元ゲームの広域時間／道路区域へ都市用地探索を移し、道路連続アクセス・主空洞の目視時間・B51警告視界を先に満たす。** 新規美術モデル・物理コライダーはまだ追加しない。R15Jの美術REJECT、公式ART採択0、Slope2認定0m、GAMEPLAY/HUMAN/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD、元ソースblob `af076d67492a677d2235e4730aef8cdf4808e106` 不変、PR #46 Draft未マージ。本番公開禁止。根拠：[R15K4C研究と訂正](docs/G4E7DZ_R15K4C_TRUE_CX_POLYGON_25POINT_CAMERAS_AND_R15L_DECISION_JA.md)。

---

# G4E-7DZ R15K4B — 元CX実三角形・実重心に再基準化、R15K4のBVH法線偽陰性を解明（2026-10-29 JST）

**R15K4B真正Actions #40796634747 SUCCESS／Artifact #12864276582。** 元CX02は実上向き**840㎡三角形**、元CX04は**216㎡三角形**。元着地点基準の仮想箱と異なり、CX02の実面重心(-83.15144,105.34249,-721.82538)と周辺で**8m×8mの5点が実上向き元三角形内に収まる4配置**を両道路共通に確認（CX04の今回の軸平行8/14/24mは5点全内包0）。その4配置の元BVH垂直第1ヒットは**Y=-1**で、同じ元CXポリゴン本体は**Y=+1**。R15K4の足元支持ゼロを「元上向き地形がない」と判断するのは誤りであり、元重なり面・面内判定を区別する必要がある。独立QAは元頂点から面積・重心・5点のXZ内包を再計算PASS、偽認証9種拒否。

**上向き元三角形内に収まることは、荷重支持やB48からの歩行接続ではない。** R15K4の直線通路全幅41点検査で5入口仮説は0/41であり、別の実際の経路・支持構造が必要。次R15K4CではCX02 8m級元床接続の歩行と新支持スパン／B51保護／複数元カメラ視認を先に立証し、CX04は三角地形を活かす細い入口候補のみ。現二面を巨大都市主要マクロとして強行しない。元ゲームblob `af076d67492a677d2235e4730aef8cdf4808e106` 不変、ゲーム新コライダー0、ART正式採用0、Slope2正式認定0m、ART/GAMEPLAY/HUMAN/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD、Draft PR #46未マージ、本番非公開。

詳細：[R15K4B真の元三角形面内・BVH法線の矛盾と次研究](docs/G4E7DZ_R15K4B_TRUE_ORIGINAL_CX_TRIANGLE_CENTROID_CORRECTED_FINDINGS_JA.md)。

---

# G4E-7DZ R15K4 — 元B48→CX5経路・元13カメラ×2道路で30仮想都市の接続／支持／B51予告近接を反証（2026-10-29 JST）

**真正Actions #40794617097 SUCCESS、Artifact #12863268499。** 元R1両道路の実CX18/B48×7/B51×28・元カメラ13時点から、5本の元B48リム→CX仮想直線の41箇所×3点を検査。今回の直線・全幅支持は各経路 **0/41**、30仮想ボリューム（CX02 840㎡/CX04 216㎡に各15案）の足元CX5点完全支持は **0/30**。元カメラ両道路で最大6半秒時点の見え方は有るが、元B51保守的±yaw矩形と近接する時点も有り、今回の候補は **研究ゲート0/30**。独立QAで元支持地点・視認矩形・B51距離・両道路合同条件を再計算し偽ART/HUMAN/WebGLなど10種を拒否PASS。

**これは区域全体の物理的建設不可能証明ではない**。仮想体の配置中心が元CX地形の中心でなく道路からの端の着地点で、幅24mなどは元840㎡面の境界からはみ出し得る。元BVH垂直レイの最初の面が下向きでも、同一元地点近接でR15Kに上向き面が確認された例があり、重なった元表裏を区別して再検証すべき。次R15K4Bは元ポリゴン実重心と実三角面支持から検証し、見た目の良い2翼箱の再生産を避ける。元B48→CXの曲線通路・元B51予告・美術・人間実走は全て未承認。原ゲームblob `af076d67492a677d2235e4730aef8cdf4808e106` 不変、新コライダー0、正式ART0件、Slope2正式認定0m、ART HOLD／GAMEPLAY・HUMAN・PERFORMANCE・INTEGRATION・RELEASE・MERGE HOLD、PR #46 Draft未マージ、main/Gold/P100/本番不変更。

詳細：[R15K4真正実3D検証とR15K4B修正条件](docs/G4E7DZ_R15K4_REAL_ORIGINAL_FULLWIDTH_SUPPORT_30_VOLUME_REJECT_AND_REPAIR_JA.md)。

---

# G4E-7DZ R15K3 — 元3D B51寸法・回転の両符号画面矩形でCX2実面の危険近接研究を検証（2026-10-29 JST）

**R15K3最終真正Actions #40792817387 SUCCESS／Artifact #12862671094。** 元R1両道路13時点のB51動体の halfSize/yawRadians を元カメラに投影し、回転符号が不確かなため ±yaw の保守的な画面矩形和集合を使用。元CX02 840㎡の実可視面から48px以内の近接はtrue-pinch **5/13**／pinch-switch **5/13**（元p95-hazard-11/12、a13-machine-13/14）。元CX04 216㎡はtrue **1/13**（a13-machine-12）／pinch **2/13**（a13-machine-12、p95-hazard-10）。独立QAで元カメラ画面座標・元3D寸法・回転・距離を再計算PASS、偽認証9例拒否。13視点×2道路×2元CX面の真正原R1画像4比較シートとJSON証拠を保管。

**重要：B51全体の実メッシュ輪郭・回転符号・連続240Hz・人間の2秒警告／回避経路・本物のWebGLは未認証。** 48pxは研究上の近接閾値であり、安全PASSではない。CX04も都市規模不足、CX02は障害物視界近接が強い。次R15K4では実道路入口・建築の構造支持・巨大都市マクロの視認性／障害物警告を同時検査し、同じ浮遊箱・二翼建築を量産しない。R15J ART REJECTを維持。新ゲームコライダー0／正式ART採択0／Slope2正式認定0m、全GAMEPLAY/HUMAN/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD、PR #46 Draft未マージ、main/Gold/P100/本番公開不変更。根拠：[R15K3真正観測と次工程方針](docs/G4E7DZ_R15K3_REAL_B51_3D_YAW_CX_SOURCE_CAMERA_JA.md)。

---

# G4E-7DZ R15K2 — 元R1全52画像の実CX面＋B51中心オーバーレイ／独立検証成功（2026-10-29 JST）

**最終真正Actions #40792033183 SUCCESS（Artifact #12861868482）。** R15K元CX真正面の実半秒13時点×両道路×独立したCX 2面（840㎡／216㎡）の**原R1画像52枚**に元B51中心投影を重ね、独立QAの再計算と偽認証拒否をPASS。研究上の任意48px以内に元B51中心が近づく時点は840㎡でtrue-pinch **5/13**・pinch-switch **5/13**、最短3.606px／4.000px。216㎡では0/13・1/13、最短48.549px／14.318px。元地形が見えても巨大全体都市が見えることを意味せず、840㎡側は地平線近くの細い帯として現れ、13～14秒前後の原障害物中心と極めて近い。**この場所にR15H/J式の巨大単独造形を置かない。** 2D中心近接は未来建築の実遮蔽・反応時間・安全認証ではない。正式ART採用0、Slope2認定0m、GAMEPLAY/HUMAN/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD。元blob af076d67492a677d2235e4730aef8cdf4808e106 不変、PR #46 Draft未マージ、main/Gold/P100/本番変更なし。詳細：[R15K2実際の元画像・B51近接とR15L方針](docs/G4E7DZ_R15K2_SOURCE_B51_CAMERA_RISK_AND_R15L_PLAN_JA.md)。

**R15K確定:** 真正Actions #40791002177 SUCCESS（Artifact #12861582490）。初回の巨大CXポリゴン1点測定＝偽陰性、後続のBlender triangulate頂点番号誤認を修正し、4着地点から**3研究地点／実体として2種類の上向き連結元CX面（840㎡／216㎡）**を残した。前者12.5〜15秒、後者14.5〜17秒の両道路同時視認6半秒時点（差2.5秒）。建築が同時間見える証明ではない。詳細：[R15K真正地形・元カメラ研究](docs/G4E7DZ_R15K_FINAL_REAL_CX_PATCH_TWO_ROAD_CAMERA_JA.md)。

次R15Lは新巨大建築を量産せず、元B51**本体**の実時系列・予告視界と原道路接続・支持／人間動線を保護する本質的空間設計へ移る。先に実物の危険と景観が両立する敷地を見つけ、それができない区間には正式ARTを建てない。

---

# G4E-7DZ R15K→R15K2 — 元CX実面連結可視3着地点・実都市2地区／B51基準予告保護の出発点（2026-10-29 JST）

**R15K最終真正CI #40791002177 SUCCESS／Artifact #12861582490。R15K2軽量独立CI #40791769661 SUCCESS／Artifact #12861692868。** 元R15I4の8未施工候補→元CX同一点重複排除4点→実CX上向きポリゴン実三角内サンプル×元R1 13正規カメラ両道路で2.5秒連続非遮蔽の研究立地3点→15mクラスタ統合で**中盤02 roadbank-promenade 840㎡と後半04 roadbank-promenade 216㎡の2独立研究地区**。中盤t12.5〜15、後半t14.5〜17に両道路で同時刻の地形実面内部2点以上非遮蔽を6連続0.5秒時点で確認した。面積は元mesh面積近似、支持/歩行/建築は未認証。

**初回R15K #40789997365のKEEP0は誤判定として破棄**。巨大な元CX1ポリゴン840㎡を1中心点で検査し「2点以上」を要求する偽陰性だった。三角分割のBlender API戻り値インデックスも途中修正 #40790739202 / #40790756010 で誤解しFAIL。最終 #40791002177 で正しい元頂点インデックス→ワールド三角点内標本と独立偽承認拒否がPASS。中盤元B51要注意a13-machine-03、後半p95-hazard-02・a13-machine-04。これらは元カメラ中心投影と直線距離／元速度の**注意すべき基準点**であり、人間警告公平性や2.3秒の実回避猶予を認証しない。

**次R15L**：この2地区の元B48路肩・CX実床の端部隙間/全幅連続性/実支持を測り、元B51全幅投影と前方障害物視界を保護するSOURCEゲートを作る。成功するまで新都市模型の量産禁止。元ソースblob af076d67492a677d2235e4730aef8cdf4808e106不変、元ゲームコライダー0、正式ART採用0件／Slope2正式認定0m、GAMEPLAY/HUMAN/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD、PR#46 Draft未マージ、main/Gold/P100/本番URL変更なし。詳細：[R15K/R15K2真正実証とR15L条件](docs/G4E7DZ_R15K_R15K2_TRUE_CX_PATCH_CAMERA_HAZARD_DISTRICTS_JA.md)。

---

# G4E-7DZ R15J — 真正2案×2道路の編集Blender・28原カメラ画像：ART REJECT／元ソース交差（2026-10-29 JST）

**最終Actions #40780029723 SUCCESS／Artifact #12856865952。** R15I4の順位1位は元CX面法線が下向きで、R15J初回 #40779820764 が正しくFAIL。CX面法線が上向きの元B48路肩559:572（元道路→CX理論約44.736m、最大勾配4.112%、元地点視認t13〜t15）へ変更。LANDSCAPE・RIFTの2案を両道路で合計4実編集可能Blender／元R1カメラ28PNG・独立画像4ペア組で比較した。各案各道路10メッシュ。原CX/B48と新造形との三角面交差検出オブジェクト組はLANDSCAPE各道路7、RIFT各道路6（0ではない）。主空洞4標本レイも新造形に当たり非開放。元B51保守AABB警告0は人間公平性認証ではない。7代表時点で新造形初ヒット平均はLANDSCAPE true **0.877%**／pinch **0.752%**、RIFT true **0.815%**／pinch **0.940%**。元画像との実視覚比較でもわずかな単独壁状塊がt15で浮かぶ程度で、立体都市・入口・生活・公共空洞の一体感なし。**SOURCE TECH限定PASS／SOURCE GEOMETRY CONFLICT／両案独立ART REJECT。二翼ロフト等の微修正を停止。**

次R15Kは元CX実面の法線・支持/入口連続性、元カメラ連続可視三角形群、元B51予告視界を測った上で、真に見えてつながる都市マクロ設計に転換する。新3Dの量産前の停止条件を導入。原ソースblob `af076d67492a677d2235e4730aef8cdf4808e106` 不変、新ゲームコライダー0、正式ART採用0件／Slope2認定0m、GAMEPLAY/HUMAN/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD、PR #46 Draft未マージ、main/Gold/P100/本番変更なし。全根拠：[R15J真正比較とR15K停止ゲート](docs/G4E7DZ_R15J_ORIGINAL_SOURCE_MACRO_ART_REJECT_AND_R15K_GATE_JA.md)。

---

# G4E-7DZ R15I4 — 両道路同一世界のCX支持候補8件を実ソース・元R1視界・曲線勾配で再選定（2026-10-29 JST）

R15I〜R15I3の元B48路肩79→元CXの支持線研究42→真正Blender道路脇通路各道路6メッシュ（元R1カメラ14画像、平均初ヒット0.50%／1.13%）を維持。R15I3の独立ART REJECTを停止条件として、**同一の細道・単独庇の延命はしない**。

R15I4初回CI [#40776263247](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40776263247) は独立QAの退化曲線判定不一致でFAIL。改訂後CI [#40776460960](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40776460960) **SUCCESS**（Artifact #12854717840）。元世界79候補の元B48接続・元CX実体接近・B51保守・両道路の元カメラ視認時間・構想曲線勾配を調べ、**8つの未施工立地を研究上残した**。優先調査は元道路 `:377:390`（約81.35m／5.29%、t11/12/13の同一地点視認）、`:559:572`（約44.74m／4.112%、t13/14/15の同一地点視認）。これは元ソース1点視認と理論曲線であり、建築の美術・構造・荷重・人間通行・元B51の警告公平性・本物のWebGLは証明しない。

原ソースblob `af076d67492a677d2235e4730aef8cdf4808e106` は不変。公式ART採用0件／Slope2正式認定0m／GAMEPLAY・HUMAN・INTEGRATION・RELEASE・MERGE HOLD、PR #46 Draft・未マージ・本番変更禁止。全根拠：[R15I〜R15I4の実証・ART REJECT記録](docs/G4E7DZ_R15I_ROAD_CX_SOURCE_ART_REJECT_AND_NEXT_JA.md)。

---

# G4E-7DZ R15I～R15I3 — 実B48路肩79候補→CX立体接点42候補→32.3m編集可能3D通路：技術検査PASS／独立ART REJECT（2026-10-29 JST）

**R15I** 真正Actions [#40773579399](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40773579399) SUCCESS（Artifact #12853108594）：元B48の路肩・近傍79地点を両道路同一world XYZで検査。道路内側実面ヒット58、仮想床原CX/B48交差0の位置78、B51保守範囲クリア79。しかし下方45mの実支持面が四隅中2点以上ある候補は0。建築成立ではない。

**R15I2** 真正Actions [#40774307893](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40774307893) SUCCESS（Artifact #12853428623）：元CX18実三角面への3D最近接および仮想支持線の原物・B51保守干渉を探索。79地点中、各道路68に近接支持線研究可能性、**両道路同一XYZ・同じCX接点条件を満たす42個の未施工仮説**。実構造・歩行・入口は未実証。

**R15I3** 初回真正Actions [#40775006797](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40775006797) **FAIL**：元CX選定点を鉛直全CX First Hitと同一視した誤検査。選択メッシュのBVH最近接検査で実点距離0.0mを再確認して修正。再実行真正Actions [#40775378736](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40775378736) **SUCCESS**（Artifact **#12855260486**）：約32.3m・最大勾配2.37%の開いた公共通路の研究模型を元B48実路肩→元CXの異なる同一world XYZに両道路各6個の編集可能Blenderメッシュとして保存。元CX/B48実三角交差0、元R1同一カメラ両道路14真正Blender画像と独立画像QA実施。新造形初ヒット平均true-pinch **0.50%**、pinch-switch **1.13%**。実画像ではほとんどの時点で見えず、t17で単独の庇に見える。**独立ART REJECT**。支持・端部接触・人間歩行・実動体公平性・本物のWebGLは未認証。

**重要な制作転換**：R15Hの空中箱方式を停止したが、R15I3の細い路肩通路＋庇方式も美術不合格。形式的なメッシュ追加・色変更を行わず、道路×CX入口×生活スケール×複層都市マクロ形態と原カメラ複数時点を同時に成立させる設計に転換。詳細・途中FAILの根拠：[R15I総括](docs/G4E7DZ_R15I_ROAD_CX_SOURCE_ART_REJECT_AND_NEXT_JA.md)。

**正規状態**：原ゲームblob `af076d67492a677d2235e4730aef8cdf4808e106`、CX18/B48×7/B51×28/240Hz/P96/gap52不変。新コライダー0、正式ART採用0、Slope2認定0m、GAMEPLAY/HUMAN/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD。PR #46 Draft・main/P100/Gold/本番変更・マージ禁止。

---

# G4E-7DZ R15G-H 最終真正13カメラ・14画像：SOURCE TECH PASS／美術REJECT／支持未成立（2026-10-29 JST）

**最終真正GitHub Actions #40770848623 SUCCESS／artifact #12852028785。** 元R1正規240Hz真正両道路・CX18/B48元実物理7/B51元動体28/元カメラ5を維持して、R15Fの候補から世界XYZ150m以上分離した前半／中盤／後半の76×64×84m同一座標3地点を選定。R15Gでは元B48道路の底面9点の鉛直下方射線：EARLY **3/9**（元道路最近接28.365m）、MIDDLE **0/9**（90.696m）、LATE **0/9**（34.925m）。原道路との連続歩行・基礎・本当の構造支持は認証できず、空中の独立体積である。

R15Hは各道路編集可能真正Blender **18メッシュ・3個の異なる非対称質量と中央主空洞**を作成。全新頂点はR15F元物/B51の保守的に安全な各76m体積内、元CX/B48実三角交差**0**、中央空洞への実BVHテスト各3 PASS、元R1同一13フレーム×228線の原ゲームカメラ初ヒットの11/12/13/14/15/16/17秒7視点平均 **true-pinch 4.95%、pinch-switch 5.89%**。真正R1 vs R15Hの2道路×7時点画像14枚、各編集可能.blend、空洞・物理・独立画像審査JSONをartifact保存。独立ゲートは偽ART／偽WEBGL／偽の中央空洞／偽の原物理クリアを拒否。元ゲームWebGLや人間試遊の合格ではない。

**両道路ART REJECT。** 実画像では尖った非対称都市ではなく、上に切れる大きな箱形の塔・同種の門／アーチ・浮遊バルクヘッドがまばらに出現。都市の地形、立体生活、公道・建築の出入口、歩ける公共空間との連続性がなく、目的の超未来都市の美しさ・空間体験に達しない。R15Eの2.8%から単純な可視率は改善したが、まだ8%の研究上の最低視野閾値にも届かない。**大きい箱の配置を変えたり装飾を増やす路線は停止。**

初回 #40770093302 はR15G現物テストまでPASS後、R15H中盤模型の一部が安全箱から約1m逸脱したためFAIL。安全域へ戻した修正commit後、最終 #40770848623 で原メッシュ0交差・14真正画像と独立QAまでSUCCESS。**最終記録は修正後の結果のみ**。現在のHEADは続くdoc-only commitで更新する。

**次R15Iの重点**：空中の巨大箱を許す立地評価から離れ、元B48道路・CX地形に現実的に接続可能な都市低層＋支持・歩行可能な原道路アクセス・トンネル／公共床の3Dを根拠として探す。フレーム上端で切れる巨大壁より、走行景観から建築内部への連続した一つの魅力的な経路が先。source-only Blender画像を実ゲームWebGLの代わりに扱わず、ART-FIRSTとGAMEPLAY-FIRSTの両方を認証するまで公開禁止。

元ゲーム不変git blob **af076d67492a677d2235e4730aef8cdf4808e106**、Draft PR#46 OPEN未マージ、Gold/P100/main/本番不変、新ゲームコライダー0、正式ART採用0、Slope2正式認定0m、GAMEPLAY/HUMAN/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD。

---

# G4E-7DZ R15D→R15E→R15F 一括工程：真正3D経路成立／可視美術REJECT／原カメラ前方大型立地調査TECH PASS（2026-10-28 JST）

**R15D 真正CI #40709760374 SUCCESS**、Artifact #12826345777。原CX18／B48実7／B51全28×721tick保守包囲、両道路完全共通world XYZ、幅8mと12mの4非直線A*接続**8/8**が全区間保守スイープ体積で非干渉。実元ワールド独立保守体積4,064件中3,629非干渉・435除外。原素材未編集。**「研究用の空き回廊」TECH PASS、実通路・支持・歩行・入口ではない。**

**R15E 真正CI #40710647597 SUCCESS**、Artifact #12824579435。R15Dの12m級3接続から総延長約414.545m、両道路各14個の編集可能真正Blender研究メッシュ／真の原カメラ7時点×2の14レンダリング。元CX/B48実三角交差0、新造形頂点は元R15D両道路12m保守安全区間内。R1原画像との独立比較で新造形初ヒット平均 **true-pinch 2.819%、pinch-switch 2.757%**。画像では遠い橋状構造で巨大未来都市の質量・主空洞・居住空間として読めず、**独立ART REJECT**。安全な細い回廊を飾る路線を停止。ゲーム未統合、人体歩行・支持・真のWebGLは未試験。

**R15F 真正CI #40712198305 SUCCESS**、Artifact #12826776538。原R1真正13カメラ×両道路で、正面85/150/225m・左右50/100m・底部+18/+50mに42×42×58m／76×64×84mの**336研究用箱状立地仮説**。両道路元CX/B48実三角面・元頂点包含／B51×28×721tick保守AABBを通過**280件**、そのうち両道路の同時刻複数カメラで6内部点の2点以上が見通せる**237件**。元静的物理非干渉56件除外、可視時点不足43件除外。元B51中心レイ研究で追加拒否0（本当の2秒前警告ではない）。EARLY/MIDDLE/LATEそれぞれ上位5候補を抽出。ただし**異なるフェーズで同一世界位置が繰り返し上位**であり、15個の独立巨大都市立地を意味しない。ほとんどが実支持・歩行者入口未検査の空中体積で、画面占有率も美術品質も実画像で認証していない。**SOURCE PREMODEL TECH PASS／ART HOLD（新建築未制作）**。

**次R15G** はR15Fの237条件を安易に建築量産せず、3フェーズで共通し過ぎた候補を空間で再分類し、プレイヤーの進行方向の原カメラ7時点に異なる景観ランドマークを選ぶ。現実の支持・道路からの入口・元B51危険予告を保護した上で、巨大非対称主空洞の真正Blenderマクロ造形を少数作り、元R1と同カメラ・同シェーダーで画像比較。巨大無地の壁・小さな繰り返し門／立地の数合わせをしない。

全工程で原ゲームソースgit blob af076d67492a677d2235e4730aef8cdf4808e106、元CX18/B48×7/B51×28、240Hz/P96/gap52、Gold/P100/main、本番URLを不変に保つ。新ゲームコライダー0、**正式ART採用0件、Slope2正式認定0m**、GAMEPLAY/HUMAN/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD、Draft PR #46 OPEN未マージ、本番公開禁止。ART REJECTはR15E（R15Bも維持）、R15Fは新美術未制作につきHOLD。細目は docs/G4E7DZ_R15D_CONSERVATIVE_TWO_ROAD_CURVED_CORRIDOR_JA.md / docs/G4E7DZ_R15E_SOURCE_3D_TRANSPORT_ART_HOLD_JA.md / docs/G4E7DZ_R15F_CAMERA_FIRST_SOURCE_MACRO_SITES_JA.md。

---

# G4E-7DZ R15C 真正元ゲーム両道路：可視×安全の共通3D空間探索完了 — SOURCE TECH限定PASS／ART未制作・HOLD（2026-10-28 JST）

[R15C最終真正GitHub Actions #40705855639](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40705855639) **SUCCESS**／Artifact **#12824147123**。R14Bで確認済みの両道路共通候補18行から世界XYZ＋試験寸法の重複6行を排除し、**66個の相異なる体積**を元R1真正Blender両道路・元240Hz正規13カメラ、元CX18/B48物理7三角面＋頂点包含、元B51動体28×721tick保守AABBに照合。元B48を含む原物＆B51 AABBの非干渉：R14B基準寸法18/18、48×48×48m **10/16**、72×60×64m **3/16**、96×72×80m **0/16**、**計31/66**。両道路**同じ時点の5連続0.5秒標本＝始点終点差2秒**で内部27点中3点以上の非遮蔽・元B51への保守的カメラ危険中心レイ非遮断まで満たしたものは**16体積条件（9相異なる世界中心位置）**。16条件内訳は基準寸法10、48m6、72/96m0。独立QAが偽ART・偽候補・偽物理クリアを拒否PASS。

R14B既知のEARLY→MIDDLE／MIDDLE→LATE共通候補近傍、両道路同一12×12×12m断面を各7点で**24経路候補**探索したが、両道路7/7離散安全は**0/24**。最大でも片道路3/7安全の例があり、元B48道路交差・B51保守包囲などを確認。従来の約600m巨大一枚地形を原物に貫通させるのも、点在する48m箱だけで一体都市を名乗るのも拒否。研究用の空気体積は**Blender都市建築・荷重支持・歩行可能な床・ゲームWebGL・人間ART承認ではない**。元ゲームへの新造形導入0、公式ART0件、Slope2正式認定0m。R15B ART/SOURCE REJECT維持。GAMEPLAY/HUMAN/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD。

初回R15C #40704532461 は72重複条件を数えた暫定版、次 #40705327552 は独立審査が拡大後の同一座標・寸法重複を拒否しFAIL、最終 #40705855639 で同一世界XYZ＋寸法重複排除とB51本人の自己遮蔽を取り除き再実行成功。**正式記録には最終66／31／16／9／0のみ採用する**。元CX/blob af076d67492a677d2235e4730aef8cdf4808e106、B48×7/B51×28/カメラ5＋R1延長8/gap52、240Hz・P96、Gold/P100/main/本番URL変更なし、PR#46 Draft未マージ。本番公開禁止。

**次R15D研究方針:** 同一世界XYZで空き地点をただ直線接続せず、実B48接触箇所を避けた**非直線・非直方体の大型主空洞と都市の接続経路**を前段の原3Dで検証する。新造形は、視認時間・空洞・支持・公道接続が実証できる部分に絞り、巨大面／孤立した小建築／反復門の再生産は禁止。[R15C独立実証の詳細](docs/G4E7DZ_R15C_SOURCE_SAFE_VISIBLE_MACRO_DOMAIN_JA.md)。

---

# G4E-7DZ R15B 605m巨大都市・37実Blenderメッシュ・14真正画像・独立ART/GEOMETRY REJECT（2026-10-28 JST）

真正R15B生成CI #40700631638 **SUCCESS**、真正独立審査CI #40701514443 **SUCCESS**。原240Hz両道路×同一世界XYZの約605.463m都市候補、Blender編集37メッシュ、原カメラ7時点×両道路14PNG、編集BLEND2。**元CX18の実三角面交差16組ずつ**、B48実三角面交差0、B51全28×721tick保守AABB警告3組ずつ（元13姿勢実三角交差0）。新都市初ヒット7時点平均true 2.256%／pinch 1.692%。13〜17秒の主空洞への見通しゼロ、17秒新都市可視ゼロ。元R1画像との独立差分でも原景観への影響が小さく、壁状形態が残ったため**SOURCE GEOMETRY REJECT／ART REJECT**。別スクリプトによる元R1画像比較と偽美術承認注入の拒否を実証、R15B真正最終Artifact #12821199337。**CI SUCCESSはART PASSではない。**

R15Cは巨大造形の追加量産を停止し、まず元CX/B48/B51との安全×11〜17秒の同時刻カメラ可視領域を、両道路同一世界XYZで探索してから造形。前方障害物の視認性・主空洞・公道/居住/交通の実体積を技術と美術で分けて判定。原blob af076d67492a677d2235e4730aef8cdf4808e106、元CX18/B48×7/B51×28、元カメラ5＋R1追加8、gap52、P96、240Hz、Gold/P100/main、本番変更なし。正式ART採用0件、Slope2正式認定0m、GAMEPLAY/HUMAN/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD、Draft PR #46未マージ、本番公開禁止。詳細: docs/G4E7DZ_R15B_ONE_CURVED_MACRO_CITY_STUDY_JA.md。

---

# G4E-7DZ R15A 真正ゲーム体験ソース監査 — CI SUCCESS / R14D既存ART REJECT継続（2026-10-28 JST）

[真正R15A CI #40698730601](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40698730601) **SUCCESS**、Artifact **#12819844559**。原240Hz／P96 start00／11〜17秒13時点×両道路と元B51移動28基を再実行。原ソースblob `af076d67492a677d2235e4730aef8cdf4808e106`不変、追加単体テスト2/2 PASS、真正軌跡検査と独立JSON確認PASS。標本速度true-pinch **90.915〜110.602m/s**、pinch-switch **92.173〜112.189m/s**。動体中心の原カメラ投影は両道路13/13時点で1基以上、現在速度に対する**直線距離換算2秒以内かつ中心投影範囲**の候補ありtrue **10/13**、pinch **11/13**。接地代表時点両道路**10/13**。この指標は実視認性・先読み2秒・遮蔽・実避難経路・人間公平性を認証しない。画像の正式美術審査も実WebGL認証もNOT RUN、正式ART0、Slope2認定0m、GAMEPLAY/HUMAN/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD。

別途R14Dの真正Blender 11〜17秒×両道路14画像（Artifact #12819395101）を目視再比較。14秒の単独的で細い新造形が16秒の実視点から消え、既存道路と背景構造ばかりが残る。R14D/E **ART REJECT維持**。R15Bでは巨大都市のマクロ構造と近・中・遠景を先に比較し、旧案へ装飾を足さない。元CX/B48/B51・正規カメラ・Gold/P100/main・本番を変更せず、PR#46 Draft維持。[R15A詳細](docs/G4E7DZ_R15A_NATIVE_GAME_EXPERIENCE_SOURCE_AUDIT_JA.md)。

---

# G4E-7DZ R6D-R14A〜R14E 5工程完了 — 同時刻プレイヤー・カメラ一致→二道路同一安全座標→実Blender一断面→画像ART REJECT（2026-10-28 JST）

**R14A** [真正CI #40692425178](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40692425178) **SUCCESS**／Artifact #12818335288：元プレイヤーと正規元カメラの同時刻、元CX18/B48実物理7の真正三角面、B51全28×721tick包囲を統合した大型32×36×36m・中型20×24×26m立地探索。元物理非干渉＋同時刻3D内部が見える候補true**970（前435/中293/後242）**、pinch**956（前413/中294/後249）**。原プレイヤーが最接近する時刻も±0.5秒以内の候補を複数確認。元床や人間入口は未認証。

**R14B** [修正後真正CI #40693102074](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40693102074) **SUCCESS**／Artifact #12818391129：**両道路で同一世界XYZのまま、同じ寸法の建築体積・元CX/B48/B51に干渉せず、同時刻の原カメラで内部3高度が見える**共通立地、前半**4**／中盤**5**／後半**9**件。共通最良XYZは前(-320.84753,116.51085,-904.74261)、中**(-218.91870,109.83630,-766.24292)**、後(-142.78160,98.96365,-491.04324)。初回CI #40692906018はB51 JSONを数値変数で上書きするスクリプトミスによる失敗で修正済み。

**R14C** [独立CI #40693614337](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40693614337) **SUCCESS**／Artifact #12817937813：実BVH結果の二道路照合・偽世界座標の注入拒否。真の共通立地間の最短3D距離は前→中約**134.1m**／中→後約**176.7m**。まだ一体化した歩行可能な都市ではない。

**R14D** [真正Blender CI #40694210972](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40694210972) **SUCCESS**／Artifact #12819395101：上記中盤の元両道路共通安全XYZで**新規70個の真正編集Blender非対称中庭都市断面**を制作、両道路の元カメラ11/12/13/14/15/16/17秒の本物のBlender14PNG＋編集BLEND2＋監査JSON2を保存。元CX18/B48×7への実三角交差両道路0、B51全28×721tick包囲重複0、B51元13時点実姿勢交差0。14.5秒の一時的な都市初ヒットはtrue14.04%／pinch20.61%だが、**15〜17秒0%**、実画像では遠い細い単独建物で、大きな未来都市の生活空間として不十分。**ART REJECT**。

**R14E** [独立画像CI #40694742949](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40694742949) **SUCCESS**／Artifact #12819365701：元R1と同じ正規Blender画像とのRGB差とR11-R1元カメラBVHを独立比較。元11〜17秒7代表時点の新都市初ヒット率平均R14Dは**true0.564%／pinch1.003%**（R11-R1は約10.901%／11.153%）、両道路6/7時点が2%未満。**ART_REJECT_REAL_SOURCE_IMAGE_DISAPPEARS_AND_SMALL_FACADE**。正式美術0、Slope2正式認定0m。

原CX18/B48実物理7/B51動体28/正規元カメラ5＋8研究延長/gap52/元240Hz・P96操舵・CX保護Git blob・Gold/P100/main/本番URL不変更。ゲーム新コライダー0、R14はBlender研究のみ、GAMEPLAY/HUMAN/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD、PR#46 OPEN/Draft未マージ、本番公開禁止。[完全審査](docs/G4E7DZ_R6D_R14A_R14E_TRUE_NATIVE_CITY_VERDICT_JA.md)／[次R15全体方針](docs/G4E7DZ_R6D_R15_GAME_AND_MEGA_CITY_RETHINK_JA.md)。

---

# G4E-7DZ R6D-R13A〜R13C 原世界8m接続→32m幅真正空き領域→実床・実走行視点ゲート完了（2026-10-28 JST）

**R13A** [CI #40690352681](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40690352681) **SUCCESS**／[Artifact #12817141387](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40690352681/artifacts/12817141387)：R12A原物非干渉EARLY→MIDDLE安全箱間を、元CX18/B48実物理7/B51全28×721tickの真正Blender 8m立体格子（両道路各1530セル）で再探索。true**1447**／pinch**1458**空きセル、原CX交差true83／pinch72。中間1/4・1/2・3/4標本も原物非干渉の**10ノード連続空間68.302m／68.420m**発見。ただし勾配true**18.74%**／pinch**18.11%**、実床・構造・歩行は未認証。最初のCI #40690069714 のfloat32対JSON 4桁座標の誤った完全一致を2mm距離検証へ修正し再実行SUCCESS。

**R13B** [CI #40690811555](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40690811555) **SUCCESS**／[Artifact #12817865029](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40690811555/artifacts/12817865029)：10経路点＋各区間1/4,1/2,3/4の**37点**で、8×8、12×10、16×12、24×16、**32m幅×20m高さ**の真正3D体積を原CX/B48実三角面＋B51全28×721tick標本に再照合。両道路・各寸法**37/37非干渉**（離散標本であり連続時間/全区間体積認証ではない）。下方12m以内の実既存支持面は**両道路0/10**。最浅の原CX面でもtrue約30.7m・pinch約30.8m下。元R1真正7時点×2道路の**診断PNG14枚、編集BLEND2、元研究JSON2**。青の線材は空間位置のデバッグ図形のみ、都市ART制作物やゲームの橋梁ではない。

**R13C** [独立CI #40691321448](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40691321448) **SUCCESS**／[Artifact #12817536370](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40691321448/artifacts/12817536370)：本物の13時点のプレイヤーに経路が最接近するのは**16.0秒**、水平距離true**81.909m**／pinch**83.990m**、高さ差true約**58.973m**／pinch約**59.604m**。**16〜17秒の実カメラから経路可視点0**。可視点は11〜13秒の遠景に偏る。立地を「EARLY」と名付けるだけでは実プレイヤー時系列と一致しない。元高度差true12.578m／pinch12.194mから研究上の9%勾配目標に必要な水平経路は約140／135mで、現67m直線より約73／68m長い。本当の支持・入口・通路と美術・WebGLは未制作。**研究資料は採用、現位置を人間の主都市通路／完成ARTには昇格しない。**

原CX18/B48実物理7/B51動体28/正規元カメラ5＋研究延長8/gap52/保護CX blob/原240HzとP96、Gold/P100/main/本番URL不変更。R13 source geometry限定TECH PASS、**ART HOLD／R11・R12既存ART REJECT維持**。正式ART採用0、Slope2正式認定0m、新ゲームコライダー0、GAMEPLAY/HUMAN/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD、PR#46 OPEN/Draft未マージ、本番公開禁止。[R13完全検証](docs/G4E7DZ_R6D_R13A_R13C_ACTUAL_SOURCE_CONNECTIVITY_VERDICT_JA.md)／[R14源走行・源視点先行設計](docs/G4E7DZ_R6D_R14_NATIVE_PLAY_AND_CAMERA_ALIGNED_CITY_PLAN_JA.md)。

---

# G4E-7DZ R6D-R12A〜R12D 原3D安全体積→実内部→真正14カメラ画像審査→連結失敗原因の4工程完了（2026-10-28 JST）

**R12A** [CI #40687143619](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40687143619) SUCCESS／[Artifact #12815611873](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40687143619/artifacts/12815611873)：元R1真正13カメラ、CX18/B48×7実三角BVH、B51全28×721tick標本包囲を用いた26×30×36m候補の元空間探索。真正原物への交差なし＋カメラの内部高さ方向が複数時点で見える候補**true-pinch 213（前65/中64/後84）／pinch-switch 204（前64/中57/後83）**。元物変更なし。

**R12B** [専用成功CI #40688145741](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40688145741) SUCCESS／[Artifact #12815029591](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40688145741/artifacts/12815029591)：前・中・後の3区画を実際の安全体積へ配置し、**各道路123個の真正編集Blenderメッシュ／2BLEND＋元カメラ11〜17秒14PNG＋監査JSON2**を制作。屋外公共床、3層の居住ギャラリー、窓・階段・交通プラットフォームの実体積。元CX・B48・B51（13姿勢三角形＋全28×721標本）との干渉**両道路0組**。ただし実画像では遠くの細い建物が3つに分断し、大未来都市としての存在感不足で**ART REJECT**。当初CI #40687773969は監査schema旧名によるFAIL、修正済み。

**R12C** [CI #40688475676](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40688475676) SUCCESS／[Artifact #12815353376](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40688475676/artifacts/12815353376)：真正元R1/R11-R1/R12Bの同カメラPNGのRGB差と7時点の実BVH初ヒットを独立審査。**都市初ヒット7時点平均R11-R1→R12B true10.90%→1.63%、pinch11.15%→1.69%**へ低下、全7時点とも8%未満。視界だけでART合格しない。**R12B ART REJECT**を確定。

**R12D** [CI #40688829549](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40688829549) SUCCESS／[Artifact #12815319446](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40688829549/artifacts/12815319446)：選択3区画間の真正3D中心距離は**true205m/185m、pinch205m/188m**で人間通路なし。元の安全候補全部から選び直してもEARLY→MIDDLEの最短**true68.3m／pinch68.4m**で、中心32m以内の既知候補ペア0。MIDDLE→LATE最短**true15.0m／pinch17.8m**で32m以内ペア5組（ただし連結安全未認証）。**断片的な小型箱量産を停止しR13では初めに連続した大きい元空間を探索**。

元CX18／B48実物理7／B51動体28／原カメラ5／gap52／CX保護blob、P96原操舵・元240Hz・Gold・main・本番サイト不変更。研究Blenderはゲーム未統合。正式ART0、Slope2正式認定0m、R12B ART REJECT・R11-R1 ART REJECT／GAMEPLAY・HUMAN・PERFORMANCE・INTEGRATION・RELEASE・MERGE HOLD／PR#46 OPEN/Draft未マージ、本番公開禁止。[R12完全審査](docs/G4E7DZ_R6D_R12A_R12D_TRUE_SOURCE_CITY_VERDICT_JA.md)／[R13の一体的都市計画](docs/G4E7DZ_R6D_R13_CONTIGUOUS_CITY_SOURCE_FIRST_PLAN_JA.md)。

---

# G4E-7DZ R6D-R11＋R11-R1 真正3D新都市1案×設計修正、元カメラ画像28枚・原物安全監査完了 — TECH限定PASS／両案ART REJECT（2026-10-28 JST）

**R11初回**：[専用Actions #40685217676](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40685217676) **SUCCESS**／[Artifact #12814995390](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40685217676/artifacts/12814995390)。元Blender R1真の11〜17秒×2道路14画像・BLEND2・監査JSON2。公共／居住／交通で構成する道路へ開いた一体的都市96実編集メッシュ。元B48実三角交差0、B51全28×721tick標本包囲重複0、元CX交差true-pinch12／pinch-switch13組。実画像は巨大な垂直壁・板、17秒でほぼ見えなくなり**ART REJECT**。

**R11-R1修正**：[専用真正再実行CI #40686105227](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40686105227) **SUCCESS**／[Artifact #12815840157](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40686105227/artifacts/12815840157)。修正版99編集メッシュ、厚い斜面化した街区・広い公共中庭進入面・中間区画配置調整・最終都市を17秒正規カメラ前方168mへ。元B48交差0、B51×721tick重複0、元CX交差**true6／pinch8組**に減少。17秒元カメラ新都市初ヒット率**true3.5%→11.4%、pinch2.6%→10.5%**へ改善。しかし11〜15秒の都市可視率は低下し、実画像にはなお巨大な折れた壁・建築片が目立ち、中庭の内部を通り抜ける生活空間は読めない。17秒の中庭内部視線はtrue0点/pinch1点。**R11-R1もART REJECT**。最初のR11-R1 CI #40685737365 は旧R11出力フォルダー参照の監査パスミスでFAIL、修正のうえ再実行成功済み。

元R1・R11・R11-R1の同一正規画像を三段比較して目視検証。元CX18／B48物理7／B51動体28／原カメラ5／gap52／原CX blob／240Hz原物理／P96操舵／main/Gold/P100／正式公開URLは一切変更していない。**正式美術0件、Slope2正式認定0m、新ゲームコライダー0／GAMEPLAY・HUMAN・PERFORMANCE・INTEGRATION・RELEASE・MERGE HOLD**。PR#46 OPEN/Draft未マージ、本番公開禁止。[R11完全実画像レビュー](docs/G4E7DZ_R6D_R11_R11R1_ORIGINAL_IMAGE_ART_VERDICT_JA.md)／[R12造形方針](docs/G4E7DZ_R6D_R12_TRUE_GAME_CAMERA_OCCUPIED_CITY_DESIGN_GATE_JA.md)。

---

# G4E-7DZ R6D-R10A〜R10C 真正元CX空洞・橋梁支持の二方式比較完了 — SOURCE研究TECH限定PASS／両設計仮説STOP／ART HOLD（2026-10-28 JST）

**R10A＋R10B [真正Blender CI #40683577944](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40683577944) SUCCESS／[Artifact #12813284015](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40683577944/artifacts/12813284015)**：原CX18・B48物理7・B51動体28・正規原カメラ5に変更なし。R10Aは元R9/R8近傍の各道路486サンプルで6×6×10mの真の元CX空き体積・床・対向CX壁を同時に満たす候補**両道路0/486**。これは調査範囲の結果のみでCX全域否定ではない。R10Bは約96〜110mのR8E接続に元CXの上向き床面から橋脚支持できそうな幾何候補を探し、true-pinch **3/15駅**、pinch-switch **5/14駅**。**両道路とも橋梁の終端に支持点なし、全駅連続支持なし**。強度・設計・連続時間B51安全・人間動線は未認証。

**R10C [独立CI #40683892224](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40683892224) SUCCESS／[Artifact #12814042274](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40683892224/artifacts/12814042274)**：R10AB＋R8E＋R9D真正証拠の再利用、造形・レンダー追加なし。偽の集計値を注入しても採用しない負試験をPASS。両道路`STOP_BOTH_SPECIFIC_R10_HYPOTHESES_NO_REJECTED_ART_RECYCLE`。元CXに既存の支持／空洞がないことは**独立した新しい未来都市建築が不可能という意味ではない**ため、R11は原物を保護しながら自立・懸架・浮遊構造を含む一体的な都市断面を、原走行カメラの**実画像と空間体積から再設計**する。

R10新都市・ゲームメッシュ0、原CX18/B48実物理7/B51動体28/正規元カメラ5/gap52/元CX blob／P96操作／元240Hz／Gold／main／本番公開物不変更。前R7 ART REJECT、現R9直接設置STOP、新ART採用0件、Slope2正式認定0m、GAMEPLAY/HUMAN/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD、PR#46 OPEN/Draft未マージ、本番公開禁止。[R10全文](docs/G4E7DZ_R6D_R10_SOURCE_TRUE_VOID_BRIDGE_COMPARATIVE_VERDICT_JA.md)／[R11の実制作方針](docs/G4E7DZ_R6D_R11_INTEGRATED_CITY_SECTION_ACTUAL_IMAGE_PLAN_JA.md)。

---

# G4E-7DZ R6D-R9A〜R9D 元CX直接設置の4工程真正監査完了 — 原物TECH限定PASS／試作条件STOP／新ART HOLD（2026-10-28 JST）

**R9A** [Actions #40681660432](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40681660432) **SUCCESS**／[Artifact #12812119475](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40681660432/artifacts/12812119475)：元CX18の上向き床候補true-pinch **111面**／pinch-switch **115面**、8m四隅の原メッシュ支持候補**両道路16面**。原11〜13秒の真正5カメラで想定複層立体が連続見通せる床候補**両道路3面**。共通最良は元CX`00 roadbank-inhabited None` polygon**0**、XYZ **(-215.16902,113.41296,-837.28394)**、面積約961m²。これは構造安全・空き体積・入口の証明ではない。

**R9B** [Actions #40681964142](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40681964142) **SUCCESS**／[Artifact #12813162094](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40681964142/artifacts/12813162094)：両道路各3候補へ8×8×31mの真正BVH試験体積を適用。B48／B51の交差警告0でも、3/3すべて**既存CX自身との元三角メッシュ交差**→安全な実体積0。

**R9C** [Actions #40682296528](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40682296528) **SUCCESS**／[Artifact #12812753756](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40682296528/artifacts/12812753756)：床面上で4m刻みに移動し、四隅が同じ元床ポリゴンに乗る6×6×23.2m候補を**両道路17配置**ずつ試験。**安全かつ早期実カメラで可視な体積0/17**。確認した不合格は元CXメッシュ自身が干渉。大規模な未来都市内部は、この元建築上へ無理に押し込められない。

**R9D** [Actions #40682620751](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40682620751) **SUCCESS**／[Artifact #12812729960](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40682620751/artifacts/12812729960)：3工程の実証Artifactから**両道路`STOP_CURRENT_DIRECT_CX_FLOOR_CITY_MODEL_NO_GEOMETRIC_POCKET`**と独立判定。偽の安全結果を挿入する負のテストでも美術採用拒否。

**最終**：R9A〜R9Dの正規幾何研究TECH限定PASS、現CX直接設置方式は体積衝突でSTOP、新規R9美術・ゲームメッシュ0。前R7 ART REJECT維持。元CX18/B48物理7/B51動体28/原カメラ5/gap52/保護blob、原240Hz物理・操作、main/Gold/本番公開不変、PR#46 OPEN/Draft未マージ。正式美術0・Slope2認定0m、GAMEPLAY/HUMAN/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD。[R9完全審査](docs/G4E7DZ_R6D_R9A_R9D_SOURCE_FLOOR_VOLUME_ACTUAL_VERDICT_JA.md)／[次R10研究方針](docs/G4E7DZ_R6D_R10_CITY_VOID_AND_SUPPORT_DESIGN_GATE_JA.md)。

---

# G4E-7DZ R6D-R8A〜R8F 六工程一括の原世界立地・動線・構造研究完了 — SOURCE PREMODEL TECH限定PASS／R8F構造STOP／ART HOLD（2026-10-28 JST）

**R8A** [真正CI #40678460212](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40678460212) 成功：元R1正規13時点のカメラで両道路各144候補を調査し、連続可視＋元B48面距離＋B51全28×721時点の標本制約を満たす候補true-pinch **137**／pinch-switch **138**。ただし可視性だけの選定は順序逆転・最大約81%勾配を生む。

**R8B** [CI #40678683173](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40678683173) 成功：4都市役割の時間順を両道路で修正。しかし元R5A CX接点→早期公共区画は水平true **464.705m**／pinch **454.718m**、直線勾配10.7〜10.8%。**R8C** [元Blender実監査CI #40678958090](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40678958090) 成功：その長距離経路は元CX/B48実三角形交差**両道路7**、支持基礎も不足。選んだ4地点の13元カメラの視認性再検証は全一致。長距離経路は不採用。

**R8D** [実既存CX床候補CI #40679407999](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40679407999) 成功：元CX `00 roadbank-inhabited None` polygon **2381**、XYZ **(-176.7074,134.0796,-925.2911)** という実上向き床面を発見。代替接続はtrue **110.060m／6.065%**、pinch **96.094m／6.439%**。**R8E** [実幅6m通路CI #40679711147](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40679711147) 成功：元CX/B48実メッシュの中心±3m線分交差**両道路0**、B51全28×721tick標本AABB警告**0**。ただし下方20m以内の原物支持面はtrue **1/14**、pinch **1/13** 標本のみ。歩行・荷重・連続時間安全は未認証。

**R8F** [5工程再利用の停止ゲートCI #40680040040](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40680040040) 成功：証拠不足の大都市建築を作らないため、両道路`STOP_BUILDING_3D_CITY_UNTIL_TRUE_LOAD_SUPPORT_AND_ACCESS_DESIGNED`を実確定。追加都市Blenderメッシュ0、ゲーム新コライダー0、元CX18/B48×7/B51×28/元カメラ5/gap52/元240Hz物理・操舵/保護CX blob不変。ARTは**未制作・HOLD**、前R7は**ART REJECT**のまま。正式美術0、Slope2認定0m、GAMEPLAY/HUMAN/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD、PR#46 OPEN/Draft未マージ、本番公開禁止。[R8完全審査](docs/G4E7DZ_R6D_R8A_R8F_PREMODEL_ACTUAL_VERDICT_JA.md)／[次R9支持構造先行ゲート](docs/G4E7DZ_R6D_R9_ACTUAL_SUPPORT_PREMODEL_GATE_JA.md)。

---

# G4E-7DZ R6D-R7〜R7C 一括制作・真正3D・空間視界・機能動線反証を完了 — SOURCE TECH限定PASS／ART REJECT／歩行FAIL／STOP（2026-10-28 JST）

**R7の真正建築試作** [Actions #40676273915](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40676273915) **SUCCESS**・[Artifact #12810108245](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40676273915/artifacts/12810108245) を実取得：両道路各253編集メッシュ、6実天空吹抜、斜路32本（最大約9.48%）、元正規11〜17秒×両道路のBlender14画像。原B48三角交差0、B51元13時点交差0、B51全28×721tick標本AABB重複0、元CX重複true-pinch17／pinch-switch29組。原物保護継続。ただし画像は積層フレームが道路脇に並ぶ印象で都市内部の生活が見えない。**ART REJECT**。

**R7Bの独立反証** [Actions #40676864540](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40676864540) **SUCCESS**・[Artifact #12809984071](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40676864540/artifacts/12809984071)：6空洞×3高度×7正規カメラ＝126真の3D視線で画角に入る83点のうち、真正BVH視線が通ったのはtrue-pinch **16**／pinch-switch **14**点、17秒は**両道路0**。斜路32本の両端最近接は0.25mでは0/32、モデル厚さに配慮した**1m許容でも16/32**。4フライト連続ルート**0/8**。入口約7.06m／出口約10.21mの接続欠落。実画像のRGB45/255超差分は17秒に両道路約24%だが美術の改善ではない。

**R7C実STOPゲート** [Actions #40677351763](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40677351763) **SUCCESS**・[Artifact #12811590703](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40677351763/artifacts/12811590703)：原物Artifact再利用・新描画0、両道路とも`STOP`を確定。理由は**歩行ルート0/8、17秒の中庭内部可視0、元CXへの人間アクセス未証明**。仮想B48衝突を入れれば必ずSTOPし、見た目の可視性・端点距離だけ改善しても原CX歩行接続がなければ採用しない負の試験にPASS。

**結論：R7 SOURCE幾何TECH限定PASS／R7 ART REJECT／人の動線FAIL／R7C STOP。** 正式美術0件／Slope2認定0m／GAMEPLAY・HUMAN・PERFORMANCE・INTEGRATION・RELEASE・MERGE HOLD、PR#46 OPEN/Draft未マージ、本番公開禁止。元CX18/B48×7/B51×28/原カメラ5/gap52/原物理・操作・main/Gold/本番不変更、新ゲームコライダー0。[R7完全実測報告](docs/G4E7DZ_R6D_R7_R7B_R7C_INDEPENDENT_VERDICT_JA.md)／[次R8の成立条件](docs/G4E7DZ_R6D_R8_PREMODEL_DESIGN_GATE_JA.md)。

---

# G4E-7DZ R6D-R6 全域粗実3D・R6R1前方都市の真正14画像×2比較完了 — SOURCE TECH限定PASS／両案ART REJECT（2026-10-28 JST）

R6初回：元11〜17秒の広域6都市街区を両道路各73真正編集メッシュで制作。[Actions #40674227788](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40674227788) **SUCCESS**、[Artifact #12809598357](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40674227788/artifacts/12809598357) のBLEND2/真正PNG14/監査JSON2を実取得。**16〜17秒で新都市の投影候補が両道路0**になり、カメラから消失。**初回ART REJECT**。

R6R1補正：元17秒真正カメラ前方172/342/548mに追加公共・居住・交通都市輪郭29メッシュ／道路、総102メッシュ／道路。[Actions #40674790128](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40674790128) **SUCCESS**、[Artifact #12810505174](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40674790128/artifacts/12810505174) のBLEND2/真正PNG14/監査JSON2を実取得。元R1／R6／R6R1同14視点を3段比較。17秒新前方都市の投影候補は両道路28、元R1比45/255超画素差はtrue-pinch 2.30%→13.08%、pinch-switch 2.38%→12.91%となり**可視性改善は事実**。しかし実像は巨大柱・門状骨組み・細線路に留まり、内部都市の空洞・生活機能は読めないため**R6R1もART REJECT**。

監査：R6 73とR6R1追加29の元B48実三角形交差**両道路0**、B51×13時点交差**両道路0**、B51全28体×721tick標本AABB重なり**両道路0**。元CX交差はR6が8／10、R6R1追加が5／4組。連続時間動的安全、建築接合・人間アクセス、正式ゲームWebGLは**未証明・未実施**。元CX18/B48物理7/B51動体28/正規カメラ5/gap52/保護blob原物不変、物理・操舵・本番・main/Gold不変更、新ゲームコライダー0。**SOURCE TECH限定PASS／両案ART REJECT／正式美術0件／Slope2認定0m**。GAMEPLAY/HUMAN/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD、PR#46 OPEN/Draft未マージ、本番公開禁止。[詳細](docs/G4E7DZ_R6D_R6_WHOLE_CITY_AND_FORWARD_ACTUAL_VERDICT_JA.md)。

**次R7**：別の門・壁・吊り線を量産しない。真の体積を持つ生活建築、開いた空洞・立体経路・都市交通が正規カメラから同時に読める都市断面を先に設計し、不成立なら制作停止。CI成功・画素差・見える頂点数ではARTを採用しない。

---

# G4E-7DZ R6D-R5 3都市ノード《CITY DEPTH FIELD》真正14視点比較・28動体安全監査完了 — SOURCE TECH限定PASS／ART REJECT（2026-10-28 JST）

[R5真正Actions #40672567617](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40672567617) **SUCCESS**、[Artifact #12808653048](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40672567617/artifacts/12808653048) を実取得、**真正Blender画像14・編集可能BLEND2・監査JSON2**を元R1の同14カメラ画角と比較。元の14〜17秒の蛇行道路に沿って**公共・居住・交通の3都市ノード×各道路37真正3Dメッシュ**を新試作。原CX18/B48物理7/B51動体28/元カメラ5/gap52/保護Git blob不変。元B48実三角形交差0／両道路、B51の13時点実三角形交差0／両道路、全28動体の721tick標本AABB重なり0／両道路。ただし元CXとtrue-pinch 1・pinch-switch 2オブジェクト組の重なりあり、歩行・構造接合・連続時刻安全未認証。

**真正画像ART REJECT**：高層でも左右の孤立支柱・薄板・水平構造として見え、居住・公共・鉄道の都市内部を駆け抜ける体験なし。16.5〜17秒には実カメラからほぼ消える。17秒の元R1との差分45/255超画素はtrue-pinch 2.02%、pinch-switch 1.82%（画像差であってART品質指標ではない）。**R5案の美術採用・詳細化禁止。** SOURCE保護TECH限定PASS／ART REJECT、正式美術0、Slope2 0m、GAMEPLAY/HUMAN/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD。PR#46 OPEN/Draft未マージ、本番公開禁止。[独立審査](docs/G4E7DZ_R6D_R5_CITY_DEPTH_FIELD_ACTUAL_VERDICT_JA.md)。

次R6は**局所に追加する小・中・大規模の建物実験の繰り返しを止め、全域粗実3D・交通・住民生活・空洞・遠景の統合設計**を最初から検証する。元物理／元カメラに手を加えて見た目だけを作らない。

---

# G4E-7DZ R6D-R4 正規原世界3D地図・7時点カメラ視界・B51全28体×721tick監査完了 — SOURCE SPATIAL TECH限定PASS／ART HOLD（2026-10-28 JST）

[真正Actions #40671430779](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40671430779) **SUCCESS**、[Artifact #12808491815](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40671430779/artifacts/12808491815) の全24ファイルを実取得・検査。14〜17秒の**元カメラ7時点×両道路×375レイ**から、実CX18・B48道路7・B51動体28・空のファーストヒット画面比率を解析。既存CX可視平均はtrue-pinch **9.30%**／pinch-switch **10.06%**、B48道路**38.82%／38.13%**、空**51.43%／51.77%**。元建築は道沿いに点在するが、元ゲーム視界では内部の連続した立体都市として読めない。数値は粗い視線サンプルであり美術採点ではない。

元B51**全28体×721tick×両道路＝40,376原物動体姿勢標本**を取得し、元R1走行の7時点×28体で全一致。最大同一角tick変位は`a13-machine-11`約0.247m。しかし**連続時刻の安全性は未認証**。実Blenderの元世界上面／斜視マップ4 PNG、元カメラ由来レイヒット分類画像14 PNG、編集可能BLEND2、監査JSON4を保存。新都市美術0・ゲーム新コライダー0、原CX18/B48×7/B51×28/正規カメラ5/gap52/保護Git blob不変。

**R4 SOURCE SPATIAL TECH限定PASS／都市ART HOLD**。前R3はB48安全FAIL・ART REJECT、R2 ART REJECT維持。正式採用0、Slope2認定0m、GAMEPLAY/HUMAN/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD、PR#46 OPEN/Draft未マージ、本番公開禁止。[詳細研究](docs/G4E7DZ_R6D_R4_TRUE_SOURCE_SPATIAL_AND_HAZARD_VERDICT_JA.md)。**次R5**は模型の増量を止め、元カメラに前景・中景・遠景で連続した都市内部が成立する実世界立地／CXへの人間アクセス／B48/B51の危険を最初に説明できる構造を検討する。

---

# G4E-7DZ R6D-R3 元道路中心都市《ROAD-INTERNAL AIR DISTRICT》実3D・14視点判定完了 — 原物SOURCE限定PASS／B48安全FAIL／ART REJECT（2026-10-28 JST）

[R3真正Blender Actions #40669433729](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40669433729) **SUCCESS**、[Artifact #12807682590](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40669433729/artifacts/12807682590) の**真正PNG14・編集BLEND2・監査JSON2**を実取得、元R1の同カメラ14画像と比較。R2の「既存CX横の独立円環」と異なり、元の15〜17秒約211〜215mの正規走行を中心空洞として両側に公共・居住・高架鉄道・既存CX連絡の28実メッシュ／道路を制作。ただし新支持脚`08 structural diagonal root 3`が元B48 `p93-CROWN_REVERSAL-01`と真正三角形交差：**true-pinch 10組／pinch-switch 11組、両道路とも安全FAIL**。B51の13時点交差は0、元CXとは両道路2組干渉、全時刻安全・構造接合・連続歩行未認証。

**実画像ART REJECT**：14〜15秒は細い架線・横へ突き出た部材、15.5秒は上空の細長い線と未完成の両側部材、16〜17秒はほぼ画面外へ流れ、元CXと生活都市の内部を横断する体験は成立しない。原物CX18/B48×7/B51×28/正規カメラ5/gap52/保護blob `af076d67492a677d2235e4730aef8cdf4808e106`、main／Gold／本番／元240Hz物理・操作は不変更、新ゲームコライダー0。**SOURCE保護TECH限定PASS／R3候補TECH安全FAIL／ART REJECT**、GAMEPLAY/HUMAN/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD、正式美術0、Slope2認定0m、PR#46 OPEN/Draft未マージ。[独立審査詳細](docs/G4E7DZ_R6D_R3_ROAD_INTERNAL_ACTUAL_BLENDER_VERDICT_JA.md)。

**次R6D-R4**は形だけの支持移動・架線増量・別の小門制作を止め、まず元道路・既存CX全体・原カメラ・危険と都市内空間の関係を立体的に再定義する根本立地検証から始める。

---

# G4E-7DZ R6D-R2 真正3D《POROUS CONFLUENCE》・原物監査完了 — SOURCE TECH限定PASS／ART REJECT（2026-10-28 JST）

[実装CI #40668156864](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40668156864) **SUCCESS**、[Artifact #12806144908](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40668156864/artifacts/12806144908) の実BLEND2・真正Blender PNG12・監査JSON2を独立に取得／目視比較。元R5Aの実CX接点を起点に両道路各19編集可能メッシュ・中央径38mの真の空洞を備えた一案を制作。ただし**遠景は小さな箱、16秒前後は板・別々の施設、17秒近景は巨大な不透明壁に見え、道路が都市内部を横断する感覚、公共・鉄道・居住の判読は成立しなかった**。過去の失敗に対する本質的な改善は認定できず **ART REJECT**。模型の詳細化・ゲーム統合禁止。

実監査：新R2×元B48実三角交差**両道路0**、元B51×13時点交差**両道路0**、R6D `a13-machine-04` 1081tick標本AABB重なり**両道路0**。ただし元CXメッシュ交差 true-pinch **4**／pinch-switch **6** 組で、歩行・構造接合の認証なし。全28動体・連続時刻の安全性も**未証明**。元CX18/B48実道路7/B51 28/カメラ5/gap52/原CX blob `af076d67492a677d2235e4730aef8cdf4808e106`、物理・操舵・公開物全て維持。ゲーム新コライダー0。**SOURCE TECH限定PASS／ART REJECT／GAMEPLAY・HUMAN・PERFORMANCE・INTEGRATION・RELEASE・MERGE HOLD**。正式美術0件、Slope2認定0m、PR #46 OPEN/Draft、未マージ。本番公開禁止。[R2詳細](docs/G4E7DZ_R6D_R2_POROUS_CONFLUENCE_ACTUAL_VERDICT_JA.md)。

**次R6D-R3**は道路脇に別の箱／円環／斜面を再制作する前に、正規走行道路そのものが実際に横断する空洞と歩行・交通の立体関係を先に検討する。形だけの反復やCI量産を停止する。

---

# G4E-7DZ R6D-R1 正規11〜17秒の真正26画像・元DJ 7時点一致検査完了 — SOURCE TECH限定PASS／ART HOLD（2026-10-28 JST）

[専用Actions #40666518657](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40666518657) **SUCCESS**、[Artifact #12805694338](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40666518657/artifacts/12805694338) を**実取得**。両道路13時点ずつの正規11〜17秒（真正Blender PNG26／編集可能BLEND2／JSON4）を独立確認。元DJの14〜17秒7時点すべてで正規240Hz走行／カメラ／速度／接地／路面ID一致。15〜17秒×2道路の元R6D同時刻画像10枚は画素値完全一致。元CX18／B48実道路7／B51動体28／元カメラ5／gap52／保護CX blob不変、追加ゲームコライダー0、新都市メッシュ0。

**重要な発見**：11〜11.5秒は非接地・道路IDなし、12〜13.5秒は上り路面が視界を大きく占め、14〜15.5秒は元CX街区の視差があるが都市の機能接続が読めない。16.5秒の一時非接地は17秒に接地復帰、17.5〜18.5秒の道路外診断は正式退出に使用しない。11〜17秒の1441tickにおける非接地または道路ID不在はtrue-pinch 241tick、pinch-switch 218tick。ただし**非接地は即失敗とは限らない**。4ビートはまだ正式に成立せず、新都市ART採用やHUMAN/GAMEPLAY品質へ転用できない。次R6D-R2は実CX・B48・B51の位置関係を確認し、根本的に新しい都市構造一案を最小真正Blender3Dで反証可能に試す。[詳細研究](docs/G4E7DZ_R6D_R1_EARLY_11_TO_17_ACTUAL_BLENDER_VERDICT_JA.md)。

**判定：R6D-R1 SOURCE TECH限定PASS／都市ART HOLD、R6B安全FAIL・ART REJECT継続、正式美術0、Slope2認定0m、GAMEPLAY/HUMAN/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD。** PR#46 OPEN/Draft未マージ、main・本番・物理・原CX不変更。

---

# G4E-7DZ R6D 正規10時点Blender・B51-04の240Hz標本解析完了 — SOURCE TECH限定PASS／都市ART HOLD（2026-10-28 JST）

[実装後の専用CI #40664059724](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40664059724) **SUCCESS**、[Artifact #12804948792](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40664059724/artifacts/12804948792) **実ダウンロード・展開・20真正Blender PNG・編集可能BLEND2・監査JSON2・ソース時系列JSON2を確認**。元DJの正規240Hz走行から14.0〜18.5秒×両道路の10画角を新規参照化し、元DRのCX18/B48×7/B51×28/カメラ5/gap52/保護blob維持。追加の5カメラは元正規フレームの姿勢から生成したBlender参考カメラであり、原物カメラやゲームは変更していない。元B51 `a13-machine-04` の1081tick回転OBB標本AABBは min=(-171.047186,72.894535,-410.082510)、max=(-119.012096,81.894535,-373.913634)。R6Cの4標本箱よりmax x約15.53m・max z約13.11m拡大。ただし連続時間安全性は未認証。

実画像では14〜17秒に既存CXと道路の接近が見える一方、17.5〜18.5秒は原走行データで非接地かつ道路IDなし、18.5秒は元DJでもoff-road diagnostic。したがって**その時間を正常な都市退出ビートとして使用しない**。新都市メッシュ0、ゲーム新コライダー0。R6B安全FAIL/ART REJECT継続。**R6D SOURCE TECH限定PASS／新都市ART HOLD、正式美術0、Slope2認定0m、GAMEPLAY/HUMAN/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD**。次R6D-R1は元ゲームを改造せず、時間窓を11〜17秒など前方に広げ、使用可能な正規走行時間に4ビートを配置して最小真正3D案一つへ進める。[詳細](docs/G4E7DZ_R6D_TENFRAME_NATIVE_TEMPORAL_BLENDER_VERDICT_JA.md)。

---

# G4E-7DZ R6C 原物B51障害物の時系列診断ガイド制作完了 — SOURCE TECH限定PASS／新都市ART HOLD（2026-10-28 JST）

[R6C実装コミット 71e537e](https://github.com/ryomashibaba/dopagaki-development-hub/commit/71e537e90fcb2929519a259251f2fb72e478f5ac)、[真正Blender専用Actions #40646409781](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40646409781) **SUCCESS**、[Artifact #12797925953](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40646409781/artifacts/12797925953) を**実ダウンロードして編集BLEND2、真正BlenderガイドPNG8、監査JSON2を独立確認**。元DR真正ソースの B51 a13-machine-04 について両道路×4時点の実頂点ワールド座標境界と4サンプル包含AABBを計算。両道路で4サンプルの共通座標範囲は min=(-171.047,72.895,-410.083)、max=(-134.545,81.895,-387.028) m（元ソースの座標）。表示用の+2m拡張枠と各時点の4枠を編集可能なBlenderカーブ5個/道路で制作。**8画角すべてで拡張枠の8隅が画角内に投影**、ただしその数値は画面上の危険予告、実際の衝突安全性、景観品質を証明しない。

**保護は限定PASS**：元CX18、B48×7、B51×28、正規カメラ5、gap52、CX保護blobを保持。原ソースを変更せず、都市造形メッシュ0、ゲーム新コライダー0、本物の新都市WebGL描画0。**この2mは設計ガイド用であって連続時間の衝突回避認証ではない**。R6BのB51サンプル25組交差（全て a13-machine-04）・ART REJECTを覆さない。

**判定：R6C SOURCE TECH限定PASS／新都市ART HOLD（新都市は未制作）**。R6B安全ゲートFAIL・ART REJECT、R4/R5B等の不採用継続。正式美術0件、正式Slope2認定0m、GAMEPLAY/HUMAN/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD、PR#46 OPEN/Draft未マージ、本番公開禁止。**次R6D**は同じ道路沿い帯状断面を再提出せず、15.5～17秒だけの短い景観に全用途を詰め込まず、正規ゲームカメラのより長い時間区間を取得して「進入→都市内生活→鉄道・居住の接続→退出」の視覚的な時間構成を設計する。一案の最小真正3Dで反証可能な比較へ進み、安易な微修正や監査量産をしない。[R6C詳細](docs/G4E7DZ_R6C_B51_SPATIOTEMPORAL_KEEP_OUT_PRIVATE_JA.md)。

---

# G4E-7DZ R6B 真正Blender都市断面を実制作・目視審査完了 — TECH安全ゲートFAIL／ART REJECT（2026-10-28 JST）

[R6B実装コミット 6dbcd2a](https://github.com/ryomashibaba/dopagaki-development-hub/commit/6dbcd2aefe68f4042e5760c86f7346347e5e1e7f)、[専用Actions #40637504539](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40637504539) SUCCESS、[実Blender Artifact #12794281741](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40637504539/artifacts/12794281741) を**実ダウンロードし画像8・編集BLEND2・監査JSON2確認**。各道路9新メッシュ、元CX18・B48×7・B51×28・元カメラ5・gap52保持、原CX保護blob一致、新ゲームコライダー0・元B48三角交差0。しかし元B51への**サンプル交差true-pinch合計12件／pinch-switch13件**で安全基準FAIL。新都市と元CXの重なりも8組／11組で構造接続と認証不可。

**真正画像ART REJECT。** R6Bの都市断面は横長の帯・床・巨大スロープ状の塊に見え、17秒で近景圧迫。公共／交通／居住の視覚的違いも内部生活も読み取れず、既存CXとの一体化も不成立。R3/R4の失敗を違う断面に置き換えた。**同案の詳細化は禁止**。CI SUCCESSは制作・監査の実行成功だけ。**R6B TECH（安全性）FAIL／ART REJECT**、GAMEPLAY/HUMAN/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD、正式美術0、Slope2正式認定0m、PR#46 OPEN/Draft/未マージ、本番・元物理・公開物不変更。[R6B詳細結果](docs/G4E7DZ_R6B_INHABITED_ROAD_SECTION_PRIVATE_RESEARCH_JA.md)。

---

# G4E-7DZ R6A 原物カメラ視野監査完了 — 限定TECH PASS／新都市ART HOLD（2026-10-28 JST）

[実装コミット 1eac577](https://github.com/ryomashibaba/dopagaki-development-hub/commit/1eac5771906d10baf07e74bddc9d4a698d0b673c)、[専用Actions #40636653095](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40636653095) **SUCCESS**、[Artifact #12794295300](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40636653095/artifacts/12794295300) **実ダウンロード・JSON検査・画像確認済み**。元DR真正Blenderの実カメラにより、両道路×4時点で**元世界Blender実画像8枚と64×40レイ視野解析マスク8枚、監査JSON2個**を作成。原CX18・B48×7・B51×28・元カメラ5・gap52・CX保護blob一致。**R6Aは新規美術メッシュ0、新ゲームコライダー0**。元のゲーム映像に新都市を描いた証拠ではない。

**見え方の新しい事実：** true-pinchの元CXカメラサンプル視野占有率は15.5/16/16.5/17秒で**13.20%／6.56%／5.90%／9.77%**、pinch-switchは**10.47%／4.53%／7.62%／9.26%**。同16.0秒のB48原道路はそれぞれ50.78%／50.35%。R5Aの元CX接触候補はpinch-switch 17秒で画角外、true-pinchでは画角内でも左寄り。サンプル視野占有率は新都市の美術・用途判読・FPS・安全性を証明しない。**現行のCX一点接触への薄い連絡床を追加・延長しても十分な巨大都市体験を作れる根拠はない。**元R4巨大地形・R5B短床はART REJECT維持。次は[専用実結果とR6B設計制約](docs/G4E7DZ_R6A_ACTUAL_CAMERA_VISIBILITY_VERDICT_JA.md)に基づき、道路周辺に連続する機能・空洞・交通の一体断面を一候補だけ実3D化して厳格比較する。新候補のART合否は未判定。

**品質：R6A原物視野解析限定TECH PASS／R6A新都市ART HOLD（新都市造形なし）／既存R4・R5B ART REJECT。GAMEPLAY/HUMAN/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD、正式美術採用0、Slope2認定0m。PR #46 OPEN／Draft／未マージ。main/Gold/P100/原物理/ゲームカメラ/本番サイト不変更。**

---

# G4E-7DZ R5A/R5B 完了 — 実CX接続候補監査TECH限定PASS・真正Blender接続小模型ART REJECT（2026-10-28 JST）

[実結果と厳格な不採用理由](docs/G4E7DZ_R5AB_SOURCE_CONNECTION_REAL_BLENDER_VERDICT_JA.md)。R5A [Actions #40635016206](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40635016206) SUCCESS／監査Artifact #12793336478。元DR真正Blenderの両道路各128候補から、実CX「04 roadbank-promenade」への暫定幾何条件をtrue-pinch 6件、pinch-switch 7件確認。代表のCX表面距離25.270m／7.087m。歩行可能な幅員・支持・連続動体安全性は未認証。

R5B [Actions #40635313787](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40635313787) SUCCESS／実Blender Artifact #12792424367：真正正規カメラPNG8／編集可能BLEND2／監査JSON2。新3Dメッシュ2個/道路、新ゲームコライダー0、元B48静的三角交差0、B51の4時点重なり0。**画像美術はART REJECT**：遠景で小さく、近景では薄い床・短い橋にしか見えず、公共・交通・居住が連結する巨大都市内部には未達。単純な詳細化禁止。元CX18/B48×7/B51×28/正規カメラ5/gap52/CX保護blob、main/Gold/P100/本番/元物理・操作不変。**限定TECH PASS、ART REJECT、GAMEPLAY/HUMAN/PERFORMANCE/INTEGRATION/RELEASE HOLD、正式美術0、Slope2 0m、PR #46 OPEN/Draft/未マージ。**

---

# G4E-7DZ R4 実制作・真正画像監査 完了 — 限定TECH PASS／ART REJECT（2026-10-28 JST）

[PRIVATE研究実装コミット fc4f110](https://github.com/ryomashibaba/dopagaki-development-hub/commit/fc4f11045ba95f3cfe8a30afe55e9d9d1a6a8659)、[専用Actions #40629896298](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40629896298) **SUCCESS**、[本物Blender Artifact #12790628370](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40629896298/artifacts/12790628370) を**実ダウンロード／展開／画像目視／監査JSON読取**した。真のDR元世界から原カメラ4視点×2道路の**8枚真正Blender PNG・編集可能BLEND2・監査JSON2**を作成。各道路8つの新3Dメッシュ（非対称都市地形２、公共/交通床２、床に埋めた鉄道軌跡２、異なる公共・住宅コート２）。R3の門や横梁は流用せず新たな巨大門も０。

**技術限定PASS：** 原CX18／B48実道路7／B51動体28／真正240Hzカメラ5／gap52不変、原CX blob af076d67492a677d2235e4730aef8cdf4808e106一致。新ゲームコライダー0、両道路新建築×B48静的三角交差0件、B51原15.5・16・16.5・17秒の4時点OBB重なり0件。完全連続時間安全性、実人間公平性、実ゲームWebGL、FPS、正式ゲーム統合は**未検証**。

**R4真正画像の厳格な美術評価：ART REJECT。** R3の大きな矩形門は消えたが、15.5秒では遠景に低い平たい巨大な斜面帯が見え、16.0秒でそれが道路側の長い板・堤防になり、16.5～17.0秒では大きな三角断面の斜面・段床が近景を占める。公共・交通・居住の違いと、建築の内部に入る体験は十分に読めない。CXの主役となる既存建築と新地形が**独立した造形のまま**で、都市が一つの生活交通構造としてつながって見えない。元DR、R3との同一画角比較で、R4の方が魅力的な巨大都市になったとは判定不可。**R3の門→R4の巨大な斜面板へ、失敗する母体形態を置換した**。形状の局所修正・詳細化は禁止。

R4正規カメラ代表4点の画角内かつ遮蔽なしのレイは、true-pinch 15.5/16/16.5/17sで **1/4・1/4・2/4・2/4**、pinch-switchで **1/4・1/4・3/4・2/4**（R3は両道路2/4・2/4・3/4・1/4）。観測値から機能の判読・美術品質を導かない。元CXへの最短参照距離は手前左で**14.351m／32.692m**、奥右で**10.334m／8.931m**（true-pinch／pinch-switch）。実際の生活・歩行・支持連絡は確認されておらず「同じ都市に接続済」と見なさない。

**結論・次段階：** 技術は真正DR原物保護／限定静的検査PASS、都市美術はART REJECT。新しい地形の位置・傾き・素材だけを変える再試作をしない。**都市と道路の実接続を先に定義し、実走行カメラの前後変化の中で公共/居住/駅の用途が判別できる立体都市断面と交通の交点を、まず最小の実模型で示す。** 不成立ならモデリング再開を見送る。正式ART採用0、Slope2正式認定0m、GAMEPLAY/HUMAN/PERFORMANCE/INTEGRATION/RELEASE HOLD。main/Gold/P100/本番/元物理・操作・カメラ保護、PR#46 OPEN／Draft／未マージ継続。[詳細R4研究・結果](docs/G4E7DZ_R4_GROUND_CITY_PRIVATE_TRIAL_JA.md)。

---

# G4E-7DZ R3 完了 — 元世界19実3Dメッシュ／2実開口・2道路8枚真正Blender／TECH PASS・ART REJECT（2026-10-28 JST）

[実装 2f497876](https://github.com/ryomashibaba/dopagaki-development-hub/commit/2f497876caeb1e7138e074fee9e4bd4c4310a149)、[専用CI #40615167856](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40615167856) **SUCCESS**、[実Blender Artifact #12784548819](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40615167856/artifacts/12784548819) 実取得・解凍：**本物Blender PNG8・編集可能.blend2・監査JSON2**。両道路それぞれ新3D **19メッシュ、実際に穴の空いた2開口**。原CX18/B48×7/B51×28/原カメラ5/gap52を保持し、ゲーム新コライダー0。道路静的三角干渉0、B51の4時点重なり0（連続時間の全安全性ではない）。元世界の代表室内点までの正規カメラ投影＋遮蔽レイで可視点は両道路とも15.5/16/16.5/17秒=**2/4・2/4・3/4・1/4**。ただし線が通ることは奥の都市機能が読めることを保証しない。

**R3真正画像美術審査 ART REJECT。** 同条件のDR原景観／不採用DY R1／R3を両道路×4視点で目視比較。R3遠景は巨大な四角い門が並ぶに留まり、16.5～17秒の近景は大きな門柱で圧迫。向こう側の公共・鉄道・住居は線・板のようにしか読めず、元CXとの都市の連続性、超未来都市内部通過の驚きは不成立。**元の巨大壁・棚の失敗を巨大門へ置き換えたに近い**。R3直接詳細化・ゲーム導入は禁止。これは**Blender**の証拠であり**新都市のWebGLは未実施**。人間操作・ゲーム性・FPSはHOLD。正式美術採用0件、Slope2正式認定0m、ART/HUMAN/GAMEPLAY/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD。次R4では単独巨大門の再調整をやめ、元CXと路線の都市母体そのものを先に接続する構造へ切り替える。main/Gold/P100/本番/CX保護blob/元物理・カメラ不変更、PR#46 OPEN/Draft/未マージ。[詳細R3審査](docs/G4E7DZ_R3_REAL_WORLD_CARVED_CITY_JA.md)。

---

# G4E-7DZ R2 完了 — 真正WebGL20枚の原本SHA照合・3都市構図×両道路×4時点を実画像監査／TECH PASS・SITE HOLD（2026-10-28 JST）

[PRIVATE実装・専用CIコミット 4ec4dcb](https://github.com/ryomashibaba/dopagaki-development-hub/commit/4ec4dcb07541e702e2a3975827f84ef23d6f44c0)、[Actions #40614088291](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40614088291) SUCCESS。新規R2テスト4/4＋R1回帰4/4 PASS、元CX保護blob af076d67492a677d2235e4730aef8cdf4808e106一致。[Artifact #12784616591](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40614088291/artifacts/12784616591) は24真正WebGL背景＋**架空3D線投影**SVG、閲覧HTML、監査JSONの26ファイル。元DJ実WebGL20枚SHA256検査PASS、両道路×3独立都市叙事×4時点の24投影で各4種の線区間が画角と重なるが、**投影成立率24/24は建築・美術・都市通過・障害物視認性・遮蔽安全性の合格ではない**。

**実物24枚画像目視のR2結論：3候補とも正式SITE選定なし。** CIVIC_CLEFTは既存CX左主役と別の薄い弧・輪郭の組み合わせに留まり、奥行きのある公共空洞を走り抜ける構図が読めない。TRANSPORT_CONFLUENCEは青い交通線が長く空中を横断するが駅・鉄道・住居の接続と支持が読めず、棚/横棒再発リスク。LIVING_CANYON_SEQUENCEは桃・黄の輪郭が空へ立つが谷と居住街路の体験にならず、既存都市との一体感がない。2道路とも元の道路自体は見える一方、線ガイドは実コライダー・実建築・真の照明/遮蔽を持たないため、新建築後の走行視認性・魅力度は証明していない。R2で新モデル・新ゲームコライダーは**0件**。ガイドを3D本制作として採択しない。

**品質**：R2投影基盤と原物保護の限定TECH PASS／候補3案SITE HOLD・正式ART HOLD（未造形）／GAMEPLAY・HUMAN・PERFORMANCE・INTEGRATION・RELEASE・MERGE HOLD。正式美術採用0、Slope2認定0m、PR#46 OPEN/Draft/未マージ。main/Gold/P100/元CX/B48×7/B51×28/gap52/正規240Hzカメラ・物理/公開ゲームは変更なし。次R3では単に線を太くしない。最初に**既存CXと道路を同じ実世界座標でつないだ通過空間の深さと実開口**を強制し、最小の本物3Dブロッキングを元ゲームカメラで比較する。現在のR2三案の直接の詳細化は禁止。詳細[研究・評価](docs/G4E7DZ_R2_NATIVE_CITY_NARRATIVE_STUDY_JA.md)。

---

# G4E-7DZ R1 実WebGLカメラ立地審査完了 — 技術検証PASS／3サイト正式選定なし、ART HOLD（2026-10-28 JST）

[初回実装 098c8c8](https://github.com/ryomashibaba/dopagaki-development-hub/commit/098c8c8da5f95b096baa00315ff4f8179e47165b) → 外積バグのため初回CI FAIL → [修正 10f4dc8](https://github.com/ryomashibaba/dopagaki-development-hub/commit/10f4dc8048c05c1a8fde20de9d02d85728eeca97) → [専用Actions #40603393437](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40603393437) SUCCESS（独立テスト4/4）。[真正比較Artifact #12779426808](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40603393437/artifacts/12779426808)：元DJ真正WebGL20枚SHA256一致、3空洞**立地ガイド**×2道路×4画角=24比較（画角内18/24）。**24枚は元ゲーム画面に数学的輪郭を合成したものであり新都市をゲーム描画した映像でもBlender本制作でもない**。過去DY R1の棚・支柱、DZ R0 Aの壁、DZ R0 Bの画角外殻を本物Blender画像で再確認してART REJECT維持。3新立地候補も主空洞の見せ方が成立したとは言えず正式選定なし／新建築0。次R2は元複数視点が重なる前方空間を探索して四段階の空洞・交通・居住・道路予告を先に設計。main/Gold/本番/元CX/B48/B51/gap52/正規カメラ/物理は不変更、PR#46 Draft未マージ、正式美術採用0件、Slope2認定0m、ART/HUMAN/GAMEPLAY/PERFORMANCE/INTEGRATION/PUBLISH/MERGE HOLD。詳細[専用審査](docs/G4E7DZ_R1_NATIVE_CAMERA_SITE_SCREEN_REVIEW_JA.md)。

---

# G4E-7DZ R0 完了 — 元世界・正規カメラによる大空洞都市２形態を真正Blenderで制作・審査／TECH PASS・両案ART REJECT（2026-10-28 JST）

[実制作 d36ee601](https://github.com/ryomashibaba/dopagaki-development-hub/commit/d36ee6014a97526ca87d5826a5bac0894ece4080)、[専用CI #40592618142](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40592618142) SUCCESS、[Artifact #12774512351](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40592618142/artifacts/12774512351) を実取得・解凍。**独立２形態A=削り出した都市峡湾、B=片側に開口を持つ縦型都市セル**を原DR同世界で各道路4画角ずつ制作。**16真正Blender PNG＋4編集可能.blend＋4監査JSON**。元CX18・B48×7・B51×28・gap52・240Hzカメラ5維持、新ゲームコライダー0。限定静的原道路三角交差0、B51原4時刻サンプル重なり0（全連続時間・人間の安全性ではない）。

**画像の美術判定：Aは近景に巨大な無表情の斜面壁、Bは上方画角外に切れた巨大殻となり、どちらも空洞の内部と交通・居住の生活が読めない。ART REJECT／採用0件。** 4メッシュでも失敗。従来の部品方式だけが問題なのではなく、実走行カメラに合う配置区間と4段階の構図が先に確立していないことが原因。新建築はゲームWebGL未投入。DJ既存真正WebGL20枚は元景観の別の比較基準、A/BのWebGLではない。ART/HUMAN/GAMEPLAY/PERFORMANCE/INTEGRATION/PUBLISH/MERGE HOLD、Slope2認定0m、PR#46 Draft未マージ、main/Gold/P100以前/本番/元ゲーム/CX元blob af076d67492a677d2235e4730aef8cdf4808e106不変更。

**次 G4E-7DZ R1**：同じ360m・15.5～17秒に長期拘束されず、正規カメラ14～20秒・元B48内で構図の成立する別位置を比較。大造形以前に時系列の4段階を同一実画角へ重ねて観察し、壁化・画角外主役を事前却下。旧A/B微修正禁止。詳細[正式不採用と根本反省](docs/G4E7DZ_R0_VOID_FIRST_ART_RESEARCH_JA.md)。

---

# G4E-7DY R1 実結果確定 — 360m正規カメラ改善・本物Blender34メッシュ制作／TECH PREVIEW PASS・ART REJECT（2026-10-28 JST）

[本物専用CI #40587470014](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40587470014) SUCCESS、[Artifact #12771488099](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40587470014/artifacts/12771488099)、コミット3a3f6b3。真の15.5秒プレイヤー前方を起点に元B48×7/B51×28/gap52/CX×18/240Hzカメラ5を保持し、360mの2道路とも5地点投影数は15.5/16/16.5/17秒=5/4/4/3。新実Blender3Dメッシュ34個/道路、元DO/DR20PNG＋新DY8PNG＝計28本物PNG・6編集可能.blend。静的B48三角との交差0件、各道路4サンプル時刻で元B51×28 OBBとの交差0件（**未来の完全安全性ではない**）。ゲーム追加コライダー0／元物理変更なし。

**実画像の厳格美術判定 ART REJECT**。遠景は小さな設備群、近景は棚・支柱・厚い水平床に変わり、都市内部の生活と交通が読めない。17秒は視界圧迫。過去DS/DI/DT失敗の形を繰り返したため、形の局所修正・再パラメータ調整を禁止。元CX比較画角の問題へ戻り、**建築としての大構図・巨大空洞・都市機能を先に設計し、元ゲームWebGLでの検証へ接続する**。美術採用0件、Slope2認定0m、ART/HUMAN/READY/PUBLISH/MERGE HOLD、PR#46 Draft未マージ、main/Gold/本番/原作・物理/操作/カメラ不変。詳細[審査記録](docs/G4E7DY_R1_INTEGRATED_CITY_ART_JA.md)。

---

# G4E-7DY R1 — 正規15.5秒前方360mに実3D未来都市の立体通過区間を制作（2026-10-28 JST）

**R0設計修正**：16秒基準中心360mのうち入口2ゲートがカメラ背面だった。実B48センターラインを15.5秒プレイヤー+28m前方に寄せ、正規4時点の投影と実路幅を再評価。左右の非対称公共/交通/居住街区、巨大な中央通過空洞、上空1本の公共連絡通路を元DO/DR本物Blender物理シーンへ実造形。元B48 7、B51 28、CX 18、240Hzカメラ5・gap52を保持。Blender新三角の実道路・障害物重なりを報告、Blender画像と原本比較を専用PRIVATE Actionsで作成。実WebGLと人間試走の証拠ではない。

**保護**：CX元blob af076d67492a677d2235e4730aef8cdf4808e106、main/Gold/公開サイト、元ゲーム物理、操作、HUD、スコアは変更なし。ART/HUMAN/READY/PUBLISH/MERGE HOLD、正式採用0、Slope2認定0m、PR#46 Draft未マージ。[専用R1資料](docs/G4E7DY_R1_INTEGRATED_CITY_ART_JA.md)。

---

# G4E-7DY R0 — DX R1美術不採用を確定し、真のB48道路中心360m都市統合配置のPRIVATE研究を開始（2026-10-28 JST）

**DX R1判定**：内部通視は初案3/30→R1 18/30へ技術改善。[R1成功CI](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40506610828)のBlender画像は、依然として大きな暗い基壇や箱型施設が目立ち、都市交通・生活と道路が一体で読めない。**DX R1 TECH PASS / ART REJECT**。正式採用0件、全体ART/HUMAN HOLD、正式Slope2認定0m。

**DY R0**：DX R2の局所修正を中止し、元ゲームの真のB48×7、B51×28、gap52を維持しながら、正規240Hzの16秒位置から真の実道路中心360m・21サンプル・5空間ゲートを両道路で取得するPRIVATE実コード/テスト/CIを追加。原物理形状のある通過区間を未来都市の公共空洞・交通・居住施設へ統合するための初期空間ガイドOBJ（線のみ）とJSONを生成。**新しい建築メッシュも新しいコライダーもゼロ、実WebGL/人間QA/美術採用は未実施**。詳細 [DY設計資料](docs/G4E7DY_INTEGRATED_SLICE_JA.md)。

main/Gold/本番/原作/既存カメラ・速度・240Hz/公開QA、CX blob af076d67492a677d2235e4730aef8cdf4808e106 不変更。PR #46 OPEN/Draft/未マージ、ART/HUMAN/READY/PUBLISH/MERGE HOLD。

---

# G4E-7DW 完了 — 実B48道路端2016候補×元240Hz両道路6視点×56012三角・28動体の入口選定、低い2m案を実Blenderで検証（2026-10-27 JST）

**DW開発・本物CI**：[初期実装 69a580b](https://github.com/ryomashibaba/dopagaki-development-hub/commit/69a580b580ead8c933736b331228971be57136f7)、[精密候補計算 CI #40498009759](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40498009759) **SUCCESS**、[Artifact #12730883340](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40498009759/artifacts/12730883340) ダウンロード・実監査JSON照合。元B48実道路上面の左右エッジを7面×元サーフェスuの9地点（0.12～0.92）×左右2×道路外方向4距離（12/24/42/64m）×高低差4（2/6/13/24m）で**2016元B48路肩起点の単一ワールド候補**生成。元ゲームの両道路それぞれ15.5/16/16.5秒、合計**正規カメラ6視点**で18×19m門型の画角投影を計算。全6視点で門の各基準点が画角に収まる候補**518**。上位と多様性を含む72候補を元CX22920＋元B48実物理33092＝**56012三角形/道路**および各正規フレームの元B51動体28ヨー付きOBBで、入口4基準点×6視点の遮蔽と、元B48路面端から入口への仮中心線の静的三角形交差を検査。コード・専用テスト・ActionsすべてPASS。**18px幅/16px高＋全遮蔽なしの最初の形式的閾値を全部満たしたのは72候補中1つ**：`B481_U62_V0_O42_H24`。幅18.04679px、高さ36.10px（6視点の最小）、元路面端から42m・高低差24m、直結斜度**57.14%**なので美術・歩行アクセス案として採用不可。閾値達成と都市機能成立は別。

**重要な同一路面端・低高低差の近傍案**：候補 `B481_U62_V0_O42_H2` は元物理サーフェス `p93-CROWN_REVERSAL-01` の元座標**(-120.714631,86.161367,-516.410140)** から道路外側42m、仮入口元世界位置**(-79.390153,88.161367,-508.907639)**。6視点全4入口点とも元CX+B48+B51遮蔽なし、参考中心線元静的三角交差なし、門幅18m・高さ19mの画面最小幅**17.984224px**・最小高さ約**34.95px**、直線上昇は**2m/42m＝4.7619%**。先のH24案の最小幅18.046789pxと**約0.063pxしか差がない**。従来の閾値18pxを約0.016pxだけ下回るからと却下して高低差を24mへ増やすのは、測定値を形式的に最大化する過適合。H6案も元レイ通過、17.973px・高低差6m。画像や人間体験前の候補は**正式採用0**。

**DW真正Blender実3D検証**：[低位入口の実制作 a671f8ad](https://github.com/ryomashibaba/dopagaki-development-hub/commit/a671f8ad6bdca6d1a722bffde9c799f11e05c4a5)、[専用CI #40498941217](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40498941217) **SUCCESS**、[Artifact #12732252401](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40498941217/artifacts/12732252401) 本物ZIPダウンロード／構成・実画像を確認。**39ファイル、26本物Blender PNG（元DO10+元DR10+DW入口6）・6編集可能.blend・JSON診断データ**。元B48正規Tessellation×7、元B51動体28、元CX18オブジェクト、元240Hzカメラ5保持。DU/DVと違い、画面内に小さいながら入口の位置が追跡でき、15.5～16.5秒に自然に近づいて見える。同じ物理で2道路とも確認。門はあくまで光る**薄いQA輪郭4オブジェクト**で、駅・居住街路・歩行床は制作していない。ART PASSEDと誤称せず、**DW TECH PASS、ART HOLD／正式採用0**。

**限界と次DX**：実道路上面の数式境界点を支持起点にすることは「安全な路肩」「ゲーム内の歩行可能接続」「手すりと実道路の衝突分離」「新街区の完全な幾何遮蔽」が成立したことを意味しない。門が幅18pxで見えるとしても、観察画像では依然小さい単純な線だけ。次DXは1か所に絞り、元道路・B51のフェアな走行視認性を守りながら、**道路の動線を邪魔しない近景・公共空間の実世界断面**を具体化。再び装飾や独立した巨大壁を乱造せず、実際に門の向こうの生活と街路が見える小さな代表実3D空間をつくり、Blenderと真正ゲームWebGLで別途判定する。ただしDXでも安全な道路交通は新規ゲームコライダーなしに推測しない。

元CX保護blob `af076d67492a677d2235e4730aef8cdf4808e106`、B48×7/B51×28/gap52/240Hz/操作/カメラ/HUD/Gold/main/本番/公開URL無変更。PR #46 OPEN/Draft/未マージ。ART/HUMAN/READY/PUBLISH/MERGE HOLD、公式Slope2認定0m。

---

# G4E-7DV 完了 — DU公共駅入口と元B48実道路は不接続。実路面最近接調査・昇降機アクセス3D実制作 → ART REJECT（2026-10-27 JST）

**原DUの通視帯はアクセスできる床ではなかった。**  DU可視通路 `x=-65,y=95,z=-475～-355` の近接元B48物理上面を、真の `tessellate` 全三角形を走査する正確な最近接点計算で2道路×6地点検証。[初回実装 989ff54](https://github.com/ryomashibaba/dopagaki-development-hub/commit/989ff54be60870982a47e43b221488294caadb7d)、[専用CI #40494337294 SUCCESS](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40494337294)、[原始診断 Artifact #12729707311](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40494337294/artifacts/12729707311)。2道路同一の入口中央から最寄り真正B48元物理`p93-CROWN_REVERSAL-01`まで**3D直線64.525249m、水平63.441325m、高さ差11.777355m**。直線勾配**18.5642%**（歩行しやすい駅アクセスと認定不可）。入口左右端の最近距離58.94 / 70.16m、中間地点86.58m、120m遠端105.58m。入口および通路に既存の歩行可能な床は実証されていない。元DUで視線が通ったことと交通アクセスの成立は全く別。

**DV第二段階：PRIVATE未採用アクセス建築一案を実制作・正規視点で審査**。[新3D造形・専用CI実装 532a4da](https://github.com/ryomashibaba/dopagaki-development-hub/commit/532a4da56ab73ab9972704bb589651711d145cf0) を [CI #40495483037](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40495483037) **SUCCESS**まで実行。[Artifact #12730083322](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40495483037/artifacts/12730083322) 実ダウンロード・ZIP展開・2道路各3画像目視・監査を実施。ZIP**40ファイル＝元DO10/DR10/DV6枚の真正Blender PNG26枚＋編集可能.blend6個＋上記診断・監査**。元B48真の最近接点から高さ95mまでの**昇降機**、水平約63.44mの実立体**高架歩行デッキ**、幅広の本当の空気開口を持つ駅入口の**14個のPRIVATEメッシュオブジェクト**をBlenderだけに作成。元ゲームB48×7・B51×28・CX×18・オリジナル240Hzカメラ5台を保全。直接の18.6%スロープは赤い不適合参照線に留める。**既存ゲームの車線・路肩と安全に結ばれたわけではない**：道路の上面最近接点が車線中央か路肩かは未検証、元CX/B51との3D新メッシュ交差、構造支持・安全な歩行幅・操作・HUD・真正ゲームWebGL・人間試走すべて未検証。元ゲームへの新道路/コライダー0、B48 gap52も維持。

**最終美術評価：DVアクセス模型 ART REJECT／全体ART HOLD／正式採用0**。元DR対DVの同じBlender原240Hz 2道路×15.5/16/16.5秒6画像を並べて比較すると、デッキは小さな遠景の横棒、入口はごく小さな灯った四角い門にしか見えない。都市内部へ入る人や広場は理解できず、見た目の設計突破にはならない。画面上部55%で、元DRからDVへの各ピクセルRGB最大絶対差が70（8bit）超となる画素比はtrue-pinch**0.257/0.333/0.615%**、pinch-switch**0.283/0.396/0.765%**（順に15.5/16/16.5秒）。レンダノイズを含む単純差なので品質値ではないが画角上の小ささと整合。小型建築の細部を増やしてもこの視野では見えないため作らない。

**次DWの実質課題**：DU〜DVで視線/実道路隔たりを証明した結果、現在の候補街路はカメラから遠く、建築主役になるための投影サイズと実路肩アクセス条件が両立していない。むやみに巨大化・塔量産はDS/DTの失敗を再発させる。次は**原ゲームカメラを固定したまま、想定街路入口の正規スクリーン寸法（px）・周辺の真正物理路面への離隔・路肩の位置・既存B51との遮蔽を同時に測り、見えて安全に接続し得る新配置を先に探す**。候補入口の比較選定に留め、採択前の巨大造形生成/公開改造禁止。ゲームボールは道路を超えて街を実際に歩くプレイではないため、PRIVATE未来都市背景アートの歩行連絡路と、プレイヤーが走行で実際に通るB48物理ルートを明確に分離する。

PR #46 OPEN/Draft/未マージ、CX source blob `af076d67492a677d2235e4730aef8cdf4808e106`・B48×7/B51×28/gap52/240Hz/カメラ/元操作/HUD/Gold/main/本番URL不変。ART/HUMAN/READY/PUBLISH/MERGE HOLD、公式Slope2 0m。

---

# G4E-7DU 完了 — 元物理全56012三角/28動体×正規240Hz 通視ゲート、Blender実6比較画像 PASS（2026-10-27 JST）

**前DTのART REJECTを維持し、新都市造形0件**。今回の対象は従来の「駅入口がカメラ視野に入る＝見える」という誤検証を根絶すること。 [実装 e38ff5bacf0c3b613d08459d191e17ebda9d9b20](https://github.com/ryomashibaba/dopagaki-development-hub/commit/e38ff5bacf0c3b613d08459d191e17ebda9d9b20) にて、元CX建築**22920三角形**＋元B48物理**33092三角形**＝**合計56012元三角形**への正確な3D線分交差と、各元240Hzフレームの**B51動体28個のヨーつき衝突OBB**に対する線分交差をPRIVATE導入。元ゲーム物理/カメラ/速度/操作/HUD/GLB/Gold/main/publicを変更しない。

**根拠を伴う新しい通視帯**：元世界絶対座標 **x=-65, y=95, z=-475～-355**、長さ120m×幅12m。原正規ゲームP96 start00スクリプト（**人間プレイではない**）の2道路×3時点（15.5/16/16.5秒）×左右端・中心の3列×13地点＝**234本**の線分全てが、元56012三角/B51全28衝突箱に遮蔽されず、両道路とも画角内。元三角形への経路中心/左右端の36線分/道路にも交差なし。**ただしこの結果は実際に道路から入れる歩行路・床材の支持・人間公平性・完全な３D建築の遮蔽不在ではない**。元の盲目駅入口 `[-18,90,-440]` を負対照で採用し、現実の元CX等に遮蔽される時刻はtrue-pinch **1/3**、pinch-switch **3/3**と検出。「中央に建物が映るだけ」では内部空間に入れるとは言えない。

[専用 CI #40487969893](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40487969893) **SUCCESS**。 [証拠 Artifact #12725892248](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40487969893/artifacts/12725892248) 実ダウンロード・ZIP構造/監査JSON/実画像目視を確認。合計**44ファイル**：真正Blenderレンダー**26PNG**（DO元景観10＋DR実道路/障害物10＋DU診断6）、編集可能.blend６個（各道路DO/DR/DU）・プランJSON２・物理データ等。実B48７・B51 28・元CX18・元カメラ５を維持、都市美術**新規0**、追加ゲームコライダー0。DU新規オブジェクトは**16個の診断マーカー**のみ。スクリーンの3門型は元CXの間、道路遠方に小さく見える。**現状では都市としての強い視覚的魅力・接近して入れる機能が全く成立しないため美術の採択をしない**。Blenderは元ゲームWebGLの外観と物理・人間プレイの証拠ではない。

**次DVの限定工程**：この通視帯を新しい巨大壁で覆わず、人が分かる駅への入口/公共空間の**横方向の寸法・手前の路肩からの交通接続・画面上の最低限の視認寸法**を検証。追加する造形は通視ゲートを通った後に限る。将来形が増えればDUの正確なレイ交差検査へその造形三角形を必ず入れ、修正前の元カメラ×３時点を維持する。未確認の路面導線や衝突公平性を「接続した」と言い換えない。PR#46 OPEN/Draft未マージ、正式都市美術採用0、ART/HUMAN/READY/PUBLISH/MERGE HOLD、認定Slope2 0m。

---

# G4E-7DT 完了 — 3居住断崖・29巨大部材 / 正規240Hz・実道路＋28動体Blender実画角 ART REJECT（2026-10-27 JST）

[PRIVATE新造形コミット db98d221](https://github.com/ryomashibaba/dopagaki-development-hub/commit/db98d2219769dfbcf970a4a15c0110d5f900b0e6) を実制作・検証。[専用 GitHub CI #40481138606](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40481138606) **SUCCESS**、[証拠Artifact #12723012609](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40481138606/artifacts/12723012609)。このArtifact実物ZIPをダウンロード・解凍・画像目視・監査JSON確認し**44ファイル：真正Blenderレンダー26PNG（DO原景観10＋DR実走路・障害物10＋DT新造形6）、.blend６個（DO/DR/DT各2道路）、実B48物理バイナリ・監査**を確認。元CX18メッシュ・元B48実物理7面・元B51移動OBB28個・元ゲームカメラ５台の証拠は不変、新規ゲームコライダー0。DT造形は計29メッシュ（実基壇から立つ地形的居住断崖18、広い公共テラス6、峡谷広場3、太い交通接続2）。窓・柱の大量反復を中止。一次造形候補1つ、2道路×15.5/16/16.5秒で評価。予定どおりCIは Blender実レンダーであり、元ゲームWebGLを再現したものではなくプレイヤー操作やFPSの認定もない。

**DT ART REJECT／正式都市美術採用０件**。2道路の同フレーム比較では、確かに15.5～16.5秒の中央都市的空白が減り、DSで問題だった細い柱に浮かぶ棟の集合は解消された。しかし新巨大造形は角張った基壇・塔状の壁として見え、内側実開口12ヶ所・6枚のテラス・広場は走行カメラからほとんど判読不能。16.5秒で左中景の巨大壁が画面の多くを占め、奥の元CXクレセントと街路の一体感を阻害。**29部材に減らしても、その配置に建築の人間的体験が現れなければただの巨大彫刻・背景壁になる**。このまま細密装飾しても改善の根拠がない。実画像はパネル毎に DR基準上、DT下で確認。

参考定量QA：真の元ゲームではなく同一条件のBlender画像DR/DTで、各RGBチャンネル絶対差の最大値が45（8bit）を超える画素割合を算出。画面上部53%の変化率はtrue-pinchで15.5/16/16.5秒**18.7/26.8/38.7%**、pinch-switchで**20.6/31.0/40.3%**。比較はレンダリングノイズや照明/遮蔽の影響を含む単純差であり、美術価値や安全性の評価値ではない。画角占有量が大きくなるほど構図悪化のリスクを示唆する定性的な補助としてのみ使う。

**次DUで設計方法を根本変更**：DPは薄い巨大リボン、DQは詳細資産が元クレセントと重複、DSは反復高層キオスク、DTは重量感のある巨大壁。多量装飾→少数大形状の双方が不採用なので、このままパラメトリック形状を変えた工程を無限に繰り返さない。次は実B48/B51カメラの**画面内で、街路への入口・背後の街区・横断連絡・公共生活が視認できる視線を先に設計**し、レンダ前に画角をブロッキングして前景・中景・遠景のレイヤーと遮蔽率を調べる。大形状の実幾何を増やすより、元の中央空白から左右の既存クレセントへつながる「通り」を可視化することが優先。元ブロック数などを品質指標にしない。人間に理解される美術・交通の方向性が成立するまで game GLB/本番統合禁止。DTモデルはPRIVATE研究候補のまま。

元CX blob `af076d67492a677d2235e4730aef8cdf4808e106`・B48×7/B51×28/ギャップ52/240Hz/操作/カメラ/HUD/Gold/main/公開URLに変更なし。PR#46 OPEN/Draft未マージ、ART/HUMAN/READY/PUBLISH/MERGE HOLD、公式Slope2認定0m。

---

# G4E-7DS 完了 — 正規実道路・全28動体の本物Blender都市画像30枚比較 / MERIDIAN FIVE ART REJECT（2026-10-27 JST）

[DS PRIVATE本造形コミット 63174d65](https://github.com/ryomashibaba/dopagaki-development-hub/commit/63174d65a128cde6d4088442c56a3743a02e894a) を実際にGitHub Actionsで [専用CI #40471912619](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40471912619) **SUCCESS**まで実施。[実本物Blender成果物 Artifact #12719920620](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40471912619/artifacts/12719920620)をダウンロード・ZIP展開・画像表示・監査JSON照合した。**48ファイル、真正Blender PNG30枚（元DO10＋実B48/B51 DR10＋新DS10）、編集可能.blend6個（各道路DO/DR/DS）、プラン・元B48 f64道路バイナリ・監査データ**。DS 2道路各709新都市オブジェクト、居住床80、実3D開口35、道路7物理面・全28動体・元CX18ソース・元カメラ5枚保持、正式ゲームコライダー追加0。元CX blob `af076d67492a677d2235e4730aef8cdf4808e106` 不変。5街区の中心は両道路で同じ世界位置、元B48全7道路のガイドから「街区半径+30m」以上離れ、すべての正規15/15.5/16/16.5/17秒視野内に基準点あり。ただしガイド離隔は全三角形との衝突不在保証ではなく、基準点が見えることと建築が見えることは異なる。

**本物Blender比較の美術判定：ART REJECT（正式採用０件）**。15.5〜16.5秒前方の街区密度はDRより増すが、同型の細い縦棟・高層キオスク群が反復し、下部に細い支柱が垂れる「浮いた施設」に見える。新居住階80や内部開口35は本当の3Dとして存在するが、実走行カメラからは公共生活・移動導線として読めず、単に形の密度が増えただけである。過去の箱ビル列・孤立オブジェクト失敗の再発。右側元CXクレセントとの都市設計的つながりも不十分。**数値やCI成功を美術成功と混同しない**。DSはアート移植しない。元ゲーム真正WebGL/HUMANプレイ未実施。元レンダラ、動体のビジュアルモデル、HUD、霧などはBlenderレビュー画像と非同一。画像差分は美術品質や公平性の証明ではない。

**次工程DTを設計し直す**。次は自動生成で数百の窓・棒・反復するフロアを作らない。必要な工程は、実道路＋正規カメラのまま**15.5 / 16.0 / 16.5秒の３画角だけに焦点を絞った**一次形状・大きな街路空間・非対称の住居群・巨大空隙・駅機能・人間スケールの構図研究。まずごく少数の一体造形メッシュ／空間を使って「連続する未来都市として魅力的か」を目視で通す。形が未成立なら細部装飾・オブジェクト709個生成・ゲーム統合へ進まない。高層キオスク、棒、板、巨大一発モニュメント、同形反復を明示禁止。現Blender制作基盤は技術PASSなので使い続けるが、ARTは何度でも厳格REJECTする。

PR #46 OPEN/Draft/未マージ、main/Gold/public/本番・元B48×7/B51×28/gap52/240Hz/操作/カメラ/自然ジャンプ/HUDに無変更。ART/HUMAN/READY/PUBLISH/MERGE HOLD、公式Slope2認定0m。

---

# G4E-7DR 完了 — 元ゲーム実B48×7/B51×28/240Hz可視審査Blender基盤 PASS・ART採択0（2026-10-27 JST）

[PRIVATE実装 db6b301f](https://github.com/ryomashibaba/dopagaki-development-hub/commit/db6b301f4daf2b549b100f3aa1d9c25bdc0227ff)、[Blender float32表現と元f64座標の丸め誤差監査修正 fe1f5575](https://github.com/ryomashibaba/dopagaki-development-hub/commit/fe1f5575bd00849e1a06aef6a7d2cd5141cdf7ac)、[最終専用CI #40469650772](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40469650772) **SUCCESS**、[全証拠Artifact #12717668295](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40469650772/artifacts/12717668295)。ZIPを実ダウンロード・展開して**32ファイル＝20PNG / 4.blend / 実道路f64バイナリ2個 / 物理監査2個 / オリジナルメタJSON2個 / DOカメラ監査2個**を確認。両道路の監査JSONで元B48物理サーフェス7・元B51動体28・元CX18ソース・全5元カメラ・真のギャップ52・物理変更なしを確認した。各道路の元B48の上面/裏面/側壁/切断面を合わせた合計**33,092三角形**を実Blenderにロード。元stageソースから生成したfloat64位置＋uint32索引のバイナリを SHA-256 証明。先頭roadのcell52は実走路TOP三角形0枚、51・53は存在。動体28全ての中心／回転／半寸法は元ゲーム`movingObstaclePose`で、同じ非人間P96 start00 240Hz shot.tick×DTの15/15.5/16/16.5/17秒で証明。Blenderの位置/キーフレームは内部float32の表現限界があり、**元f64→Blender f32最大丸め差 true-pinch=0.0000533643m、pinch-switch=0.0000595087m**。元64bitバイナリは無損失で保存し、Blender各時刻の位置はそのf32に一致することを自動検査。物理を捏造するための許容幅緩和は禁止。

初回[CI #40469220277](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40469220277) は元ゲーム物理抽出テストPASS、Blenderでfloat64との直比較をしたためfalse-failure。元座標のf32量子化チェックに正しく置換して再実行しSUCCESS。元ゲームレンダラ・道路/動体材質は**再現していない**。28個はcollision OBBの正確な形状・位置であり、障害物本来のアート外観ではない。プレイヤーボール・HUD/スコア・霧・高速演出も未再現。**Blender画像を真正ゲームWebGLと呼ばない**。元ゲーム主役CX形状は元blob `af076d67492a677d2235e4730aef8cdf4808e106` 不変、camもDOに合わせて不変。

**美術面の実画像判定**：元CXのみのBlender10画角と、新たに元道路・衝突動体を入れた10画角を目視。15〜17秒の手前画面は実際には巨大な物理道路面で占有され、旧DOの線ガイドのみの画面とは印象が大幅に異なる。道路中央の前方都市核が小さいまま、旧左クレセントが15.5〜16秒で退場する問題は一切解決していない。DR自体は新美術造形0なのでART PASS/REJECTではなく、**技術的な制作審査基盤のPASS／正式都市美術採択0件・総合ART HOLD**。数値や差分を美しさの評価点と呼ばない。次DSは、この実道路面＋全動体のPRIVATE参照シーンを設計の基準にして、正面15.5〜16.5秒の都市連続性を優先。建物の乱造や単一巨大アーチ・棚・リボンの再挑戦は禁止。最終審査には真正ゲームWebGLと人間操作性検証を別途要求。

B48×7/B51×28/gap52/240Hz/元操作/カメラ/HUD/Gold/main/publicとproduction URLsは変更なし、PR #46 OPEN/Draft/未マージ、ART/HUMAN/READY/PUBLISH/MERGE HOLD、正式Slope2 0m。

---

# G4E-7DQ 最終実制作検証 — 既存BW R3細密3Dの実240Hzカメラ配置、ART REJECT（2026-10-27 JST）

[実装コミット abb81f8](https://github.com/ryomashibaba/dopagaki-development-hub/commit/abb81f8d5d9e8e2995f1d39164143c4effec7ae3) を [専用CI #40454837621](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40454837621) で実行し**SUCCESS**。真正Blenderの２道路×CX/DQ×15.0/15.5/16.0/16.5/17.0秒=**20PNG**、編集可能.blend４個（DO参照２・DQ候補２）、基準カメラ・DQ監査を含む [Artifact #12712420146](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40454837621/artifacts/12712420146) を実際にダウンロード、ZIPを展開して画像・監査JSONの存在を確認。BW R3元Blenderオブジェクト**1,493**を実座標へ読み込み、元CX**18**ソース／**22,920**三角形を保全、２道路とも元ゲーム240Hzカメラ５台。座標は元Blender Z-UP→ゲームY-UPを正確に変換。基準DOカメラ投影誤差最大約2.70435e-7。新しい道路・動体・コライダーは0、元物理不変更。

**実画像目視：DQ ART REJECT／正式採用０件**。DPの大きな板状屋根は消え、既存右クレセントに窓・階層・照明のような細部が現れる。しかし詳細BW R3が主に既存右側主役の視界位置に重なるため、15.5〜16.5秒の真正構図でプレイヤー前方の都市空白や機能的な公共動線は埋まらない。細部1,493個追加と都市の連続性改善は別問題である。真正ゲームWebGLの比較は**未実施**（低評価の候補を移植せず早期REJECT）。

**根本改善方針／次DR**：細密度／新形状を追加する前に正規道路・障害物と都市を同じ実3D舞台で評価する。現DO/DP/DQのBlender参照マスターは本物のB48走路を示す「７×３の非物理ガイド曲線」を置くのみで、**実ゲームと同じ道路三角形・動体28・道路材質・車体周辺のゲーム光学・描画状態を再現していない**。都市体験を判定するならまず重要な実走路・障害物がアート審査画面に含まれる必要がある。DRは変わらない元B48曲面の参照レンダーメッシュと指定時刻の実動体姿勢を読み取り、Blenderへ可視化するPRIVATE QA基盤へ焦点を絞る。ロード・コライダーを新規生成しない。Game WebGLとBlenderではレンダラが異なるため、最後は元ゲーム真正WebGL＋人間操作試験が必須。これが整う前の孤立した巨大物や規則的箱の再生成はしない。

[前DP CI #40447458670](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40447458670) は技術SUCCESSでもART REJECT済み。DO編集可能Blenderマスターは技術的に完成。main/Gold/本番/public・元B48×7/B51×28/gap52/240Hz/操作/カメラ/自然ジャンプに変更なし。元CX Git blob `af076d67492a677d2235e4730aef8cdf4808e106` 固定。PR#46 OPEN/Draft/unmerged、ART/HUMAN/READY/PUBLISH/MERGE HOLD、公式Slope2認定0m。

---

# G4E-7DQ 開始 — DP実画像を正式ART REJECT、既存本格Blender資産の元カメラ再配置を限定検証（2026-10-27 JST）

**DP最終審査**： [CI #40447458670](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40447458670) **SUCCESS**、[真正Blender画像20枚＋.blend4個 Artifact #12710006367](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40447458670/artifacts/12710006367)取得・目視。元DOとDPを２道路×5時点で比較すると、**DPの新造形は長い薄い屋根・空中の板・波状リボンにしか見えない**。特に16.5〜17秒に画面上部を占有、住民利用の内部・移動交通路が読めず、旧クレセントと遠景の機能的接続が改善しない。**DP ART REJECT／正式採用0**。検証はBlender参照画像であって真正ゲームWebGLではない。Blenderで門前払いできたため、低品質なDPをゲーム本体へ移植しない。

**DQ**：技術基盤DOで正規240Hzカメラを一致させたうえで、以前実Blender制作済みBW R3の**本当の階層・入口・内部交通を持つ細密3D元資産**がどう見えるかを世界座標で検証する。BW R3自体も正式美術採用0の研究資産。DQは新しい棒・箱・板を乱造せず、既存1案の再配置可否を先に判定。2道路×15〜17秒=10真正Blender比較画角を生成するPRIVATEスクリプトとCI。BWはBlender Z-up、ゲームY-upとして座標系を明確に変換する。正規カメラに映る位置でも、美術成功を主張しない。BW形状が孤立した神殿になり都市にならなければ即ART REJECT。GLB移植、ゲーム描画変更、物理変更なし。元CX blob `af076d67492a677d2235e4730aef8cdf4808e106` 固定。

PR #46 OPEN/Draft/未マージ、B48×7/B51×28/gap52/240Hz/元カメラ/操作/main/Gold/public変更禁止。ART/HUMAN/READY/PUBLISH/MERGE HOLD、Slope2公式認定0m。

---

# G4E-7DP 進行中 — 正規カメラ実証マスターの完成とSKYRIFT QUARTER PRIVATE一案制作（2026-10-27 JST）

[DO正式な技術CI #40446863995](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40446863995) は **SUCCESS**。 [Artifact #12708956774](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40446863995/artifacts/12708956774) をダウンロードし、**実編集可能.blend２個＋Blender正規視点PNG10枚＋カメラ検証JSON２個**をZIP内で確認。２道路ともCX元三角形22,920枚、ソース18個、元CX頂点SHA一致。Blender投影誤差は最大約2.70435e-7（正規化座標）。これは**Blenderの実参照レンダー**であり、元ゲーム真正WebGL/PBR/物理プレイを再現した証拠ではない。DOでついにBlender制作マスター基盤だけは技術的に成立。**都市美術採択0件**。

DP [PRIVATE実装 f2683bdd](https://github.com/ryomashibaba/dopagaki-development-hub/commit/f2683bddcb31669ad0e0d0a8a1f0202c51b75ab1) は《SKYRIFT QUARTER》の**単一共通世界**Blender造形試作。道路1の路肩から離れたstationインデックス30.5–42.7、曲面の居住断層２本・開放的な交通渓谷・接続する公共デッキ・少数の暖色/寒色居住帯を元CXそのままの編集可能な3D都市に重ねる。過去の箱・棒・孤立アーチ案の反復を避ける意図だが、**画面上で魅力的に見えることは未実証**。実世界配置の視野テスト（2道路×5時刻×5選定参照点）・Node保護テスト・Python形式チェックは [専用CI #40447458670](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40447458670) の第一段階で **PASS**。CIはこの文書記録時点でBlender導入中で、完成したDP Blenderの画像20枚・候補.blend２個・目視評価は**未確認**。CIが終わる前にART PASS/REJECTどちらも捏造しない。参照道路はDOの非物理ガイドであり、最終物理道路／動体をレンダーしていない。今後の承認には本物のゲームWebGLとプレイヤー公平性の実証が別途必要。

全変更は研究ブランチPRIVATEのみ、元B48道路７/B51動体28/gap52/240Hz/カメラ/操作/自然ジャンプ/HUD/Gold/main/本番を変更せず。元CX blob `af076d67492a677d2235e4730aef8cdf4808e106` に保護チェック。PR #46 OPEN/Draft/未マージ、ART/HUMAN/READY/PUBLISH/MERGE HOLD、正式Slope2 0m。次の作業はDP CIの成否・成果物を実物確認し、10正規カメラの純Blender候補実画像を目視で採否判定すること。

---

# G4E-7DO 継続中：実240Hzカメラ→編集可能Blenderマスター初回生成、レンダーCIは未完了（2026-10-27 JST）

**完成認定はしない。** PRIVATE限定で、Blenderによる都市美術の本設計へ移るため、元CX景観の正確な三角形と２道路×15〜17秒の正規ゲーム240Hzカメラを完全一致のまま書き出す制作基盤を開発。[実装コミット 4453c2da](https://github.com/ryomashibaba/dopagaki-development-hub/commit/4453c2da7c10457eb04b700f5e14a969209f4e96)、[CLI修正 0a89f1f8](https://github.com/ryomashibaba/dopagaki-development-hub/commit/0a89f1f81daedae5e5ac1f4797ac3c2c96042238)、[重複240Hz演算の削減 9f86b90f](https://github.com/ryomashibaba/dopagaki-development-hub/commit/9f86b90feac5b2587ab96723897ce69365c4bfd5)、[Blenderカメラ行列更新 7573dde5](https://github.com/ryomashibaba/dopagaki-development-hub/commit/7573dde590d032920615edc40e7698dc859fa2ad)、[ヘッドレスCycles CPU修正 db945742](https://github.com/ryomashibaba/dopagaki-development-hub/commit/db945742125992605ab6a4e4dbb3ff3c395a2516)。

**検証済**：Node側元CX blob `af076d67492a677d2235e4730aef8cdf4808e106`完全一致、240Hzカメラ/ジオメトリ書き出し、B48道路7/動体28/gap52保護単体テスト成功。GitHub [CI #40442610016](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40442610016) ではBlender 4.0.2起動→カメラ投影チェックを通過し、**true-pinch用実Blender編集可能 .blend（約3.26MB）** を書き出し、[部分証拠 Artifact #12707061511](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40442610016/artifacts/12707061511) に保存。Eeveeレンダー時の `libEGL.so.1` 不在で**CI FAILURE**、Blender 10PNGは未実現、pinch-switch .blendも未保存。画像・美術認定は不可。

**最新版 [Cycles CPU CI #40442938522](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40442938522)**：ヘッドレス環境でEGL不要のCyclesレンダーへ切替。**この文書更新時点では結果未確定**。CIがSUCCESSになるまでは２道路×5真正Blender画像や双方の.blend完成を主張しない。※ Blender参照レンダーは本物のゲームWebGL framebufferではない。カメラの投影は照合可能でもゲームのシェーダ/FPS/フェアネスを保証しない。

**なぜこの方式か**：BW/BX既存大規模Blender/GLBは世界配置/node transform/ゲーム実視野未立証、BK限定GLBパーサーは汎用GLBを読めない。旧ART REJECTモデルを無検証で公開レンダへ持ち込まず、まず正規実道路・元CX・元カメラが重なる編集可能な制作マスターを作る。**DOは新都市候補0件／ART採用0件、元物理・コントロール・カメラ・main/Gold/public build非変更**。PR #46 OPEN/Draft未マージ、ART/HUMAN/READY/PUBLISH/MERGE HOLD、正式Slope2認定0m。

---

# G4E-7DN 完了 — NEGATIVE-SPACE真正WebGL30枚、構図仮説不成立 / ART REJECT（2026-10-27 JST）

[DN PRIVATE実装 4461a318](https://github.com/ryomashibaba/dopagaki-development-hub/commit/4461a31889a3e0e8e0c900f59c9531c18e1781fa)、[証拠保存修正 53691337](https://github.com/ryomashibaba/dopagaki-development-hub/commit/536913370da7c85e6c0362978872db862ffffd86)、[最終真正WebGL CI #40436641309](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40436641309) **SUCCESS**、[本物の30枚・監査JSON Artifact #12703663917](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40436641309/artifacts/12703663917)（7日retention）、[独立物理 #40436070565](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40436070565) **2 jobs SUCCESS**。初回CI #40436070653はWebGL技術PASSだがArtifactアップロードのパスが誤っており証拠0（結果採用不可）、次コミットで修正し再撮影した。

**新建築0個・追加三角形0枚**。PRIVATE差替えだけで、元CX、CX主役2基、道路7面、動体28個、gap52、240Hz、ボール相対カメラ、自然ジャンプ、操作、shared build/main/Gold/本番に変更なし。正規２道路×15/15.5/16/16.5/17秒×CX/UNROOF/REVEAL=30枚撮影。CX元DJ PNG SHA **10/10完全一致**、同じカメラ・時刻・速度比較20対を検証。

- **UNROOF**：画素差合計10/10で **0.0000%**。この5時点では遠景折屋根の除去は最終描画に可視の変化をもたらさず、主要な断絶原因とする根拠がない（他物体への遮蔽・画角外など原因は未特定）。
- **REVEAL**：近景station2左公共歩道１ソースをさらに外した変化率はtrue-pinchの15→17秒順で **0.0814/0.1115/0.2073/0.5343/2.0718%**、pinch-switchで **0.0912/0.1378/0.2593/0.7695/1.8742%**。17秒の数％弱の差は実表示確認できたが、主役〜街区間の連続性や大きな内部空間は改善しない。
- 30枚をモンタージュにして人間目視。左既存クレセントは15.5秒で画角から退場、次の主役はまだ小さく、道路の占有感が強い。削除だけでは都市の内部生活・一体化した交通・中景から遠景への都市構造は出現しない。REVEALは公共歩道自体を取り去る診断であり完成景観として不適格。

**DNのアブレーションを正式美術としてART REJECT**。ただし原因切り分けの技術研究としては真正CI PASS。pixel delta≠美術改善、スクリーンショット≠人間操作性/FPS。次DOは「巨大モノリス増設」「規則的箱の再配置」「見えない屋根の微調整」を中止し、**世界の都市核・居住・交通が同じ造形言語で連なる単一の街づくりマスター構成**を先に設計。Blender/GLB等を利用するなら実視点に沿った都市断面・素材・実内部を全景として制作し、前景・中景・遠景が15〜17秒で機能的に連なることを証拠にする。まず絵になる都市の統合構図、次に実装／計測。正式美術採用0件、ART/HUMAN/READY/PUBLISH/MERGE HOLD、Slope2認定0m、PR #46 OPEN/Draft未マージ。

---

# G4E-7DM 完了：LIVING CONFLUENCE → **早期ART REJECT／真正WebGL CI FAIL**（2026-10-27 JST）

[PRIVATE実装 1d3a485e](https://github.com/ryomashibaba/dopagaki-development-hub/commit/1d3a485e7ec92a31fe82f7f6df85e1de7c0b6f6b)、[DM専用CI #40433597701](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40433597701) **FAILURE**、[不完全証拠Artifact #12702903731](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40433597701/artifacts/12702903731) 7枚（true-pinch 14.5/15/15.5秒各CX/DM、16秒CXだけ）、[独立物理 #40433597503](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40433597503) B5/A13 **2 jobs SUCCESS**。CX旧SHA 3/3一致後、16秒の元CX出力が旧画像と2画素±1 RGBで異なり strict SHA checkが停止。両道路24枚は未達、ハッシュゲートは緩めない。真正画像で新住区は単純な白い箱ビル列に見え、DGを再発。**DM ART REJECT／正式採用0**。不採用の早期確定につき完成24枚の再撮影や微調整はせず、失敗資料として凍結。次DNでは建築物追加より**連続視点の都市的構成と本物の内部の造形言語**を先に検討。[DM最終QA](docs/G4E7DM_LIVING_CONFLUENCE_PRIVATE_STUDY_JA.md)。元CX blob `af076d67492a677d2235e4730aef8cdf4808e106`、B48×7/B51×28/gap52/240Hz/カメラ/入力/main/Gold/本番不変更。PR #46 Draft未マージ、ART/HUMAN/READY/PUBLISH/MERGE HOLD、Slope2正式0m。

---

# G4E-7DL 完了：APERTURE CITY / 真正WebGL 24画角検証 — **ART REJECT**（2026-10-27 JST）

[PRIVATE実装 a5f14fe7](https://github.com/ryomashibaba/dopagaki-development-hub/commit/a5f14fe7022d9e6e09c78f75a379d1b034d20926)、[DL真正WebGL #40430724416](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40430724416) SUCCESS、[独立物理 #40430724261](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40430724261) **2 jobs SUCCESS**、[証拠Artifact #12702566144](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40430724416/artifacts/12702566144)。前DKの薄板・柱と遮蔽問題を改善するため、GLB既存基盤を調査しつつ無意味なレンダラ置換は避け、単一の厚い曲面大開口と奥に６個の実3D居住・交通区画を持つPRIVATE候補を制作。元２道路の正規カメラ５時点で10候補を比較して固定した世界座標に配置。2道路×6時刻×CX/DL=**24枚の本物の元ゲームWebGL**を取得し、元DJのCX12PNG SHA-256 **12/12完全一致**、ペア時刻/速度/カメラ一致。

しかし実画像では「巨大アーチの背後に小さな棚」でしかなく、公共都市の内部空間・街区・交通の一体感は生まれず、15.5〜16.5秒の構図断絶が継続。**DL ART REJECT／正式美術採用0件**。DLは凍結されたPRIVATE研究として保存。技術成功は美術成功・人間の公平性・FPSを保証しない。次は巨大な孤立形状の反復をやめ、15→17秒に同じ都市公共動線と居住の奥行きが読める連続画角の証拠を先に設計する。[詳細DL最終QA](docs/G4E7DL_APERTURE_CITY_PRIVATE_STUDY_JA.md)。CX blob `af076d67492a677d2235e4730aef8cdf4808e106`、B48×7/B51×28/gap52/240Hz/カメラ/操作/main/Gold/本番非変更。PR #46 OPEN/Draft未マージ、ART/HUMAN/READY/PUBLISH/MERGE HOLD、公式Slope2 0m。

---

# G4E-7DK 完了：CIVIC ESTUARYを真正240Hz 12対WebGLでART REJECT（2026-10-27 JST）

実装 [c3d5f0c8](https://github.com/ryomashibaba/dopagaki-development-hub/commit/c3d5f0c8a0c99d65738e579c4f6013e4cab59955)、[真正WebGL CI #40428018396](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40428018396) SUCCESS、[独立物理 #40428017965](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40428017965) SUCCESS、[証拠Artifact #12701191210](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40428018396/artifacts/12701191210)。DJで確認した15.5〜16.5秒の都市の断絶を、湾岸都市のひとつの母体で埋める狙いのPRIVATE実3D。2道路×14.5/15/15.5/16/16.5/17秒×CX/DK=24真正WebGL画面、カメラ・速度・日時が厳格一致。原CX12PNGはDJ真正WebGL12/12 SHA-256完全一致、元CX generator Git blob `af076d67492a677d2235e4730aef8cdf4808e106`不変。15.5→16.5秒では新規画面差が3.79→6.97%（true-pinch）、4.26→7.26%（pinch-switch）まで増加。ただし実画像は湾岸の住区・公共空洞ではなく、**巨大な縦の柱や薄い板**に見え、従来のDB棒／DA壁／クリップ失敗を再発。**DK個別ART REJECT、正式美術採用0件**。画素変化は美術成功・プレイ公平性の証明ではない。

次工程では大型建築を増やすことで中間画面を埋める方式を中止。正規視点で広大な内部／住区／交通が読み取れる構図を先に証明し、可視の都市体験と美術品位が成り立つ仮説だけを一案ずつPRIVATEで実制作。詳細は [DK専用QA](docs/G4E7DK_CIVIC_ESTUARY_TRUE_WEBGL_ART_REJECT_JA.md)。B48×7/B51-C×28/gap52/240Hz/カメラ/操作/スコア/main/Gold/本番不変更、PR #46 Draft未マージ、ART/HUMAN/READY/PUBLISH/MERGE HOLD、Slope2認定0m。

---

# G4E-7DJ 完了：正規240Hzの20実WebGL画角で15.5〜16.5秒の都市構図断絶を特定（2026-10-27 JST）

実装 [830ed1e8](https://github.com/ryomashibaba/dopagaki-development-hub/commit/830ed1e8ab76e18efa7b6a1845bef7cb83b6489e)＋専用ガード修正 [607030c](https://github.com/ryomashibaba/dopagaki-development-hub/commit/607030cc2ed5012218128ff13aa04955a0ca6d04)。[専用CI #40417051913](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40417051913) SUCCESS、[真正WebGL Artifact #12694559525](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40417051913/artifacts/12694559525)＝2道路×14〜18.5秒0.5秒刻み20PNG。元BGの15/17/18.5秒240HzカメラスナップショットはdeepEqual、前DIの正式CX 6PNGとのSHA-256は6/6完全一致（カメラ・CX画面改変なし）。新しい美術案を乱造せず、通常ゲーム外PRIVATE Playwrightの追加フレーム許可だけで実カメラ時系列を制作。**15.5秒に左巨大主役が裁断され16.0秒でほぼ消える一方、前方都市が小さいため、15.5〜16.5秒に都市の壮大さが途切れる根本問題が判明**。16.5〜17秒も街区・公共施設・主役が一体の都市として読めない。17.5秒以降の異常な走路構図および18.5秒off-roadは正式走行公平性として認定しない。

次DKは**その中間区間に現れる、都市の大きな輪郭・内部公共空洞・居住階層の同時構図**を一案だけPRIVATE実3D制作。単純な巨壁・棚・棒・箱・埋め込み・遠景追加の反復禁止。DJは美術案を新たに作っていないのでART正式採用0件、過去DI ART REJECT維持。[DJ詳細QA](docs/G4E7DJ_TRUE_NATIVE_SEQUENCE_QA_JA.md)に証拠・失敗・次工程の構図制約を記録。CX blob `af076d67492a677d2235e4730aef8cdf4808e106`、B48×7/B51-C×28/gap52/240Hz/カメラ/入力/main/Gold/本番変更なし、PR #46 Draft未マージ、ART/HUMAN/READY/PUBLISH/MERGE HOLD、Slope2正式0m。

---

# G4E-7DI 完了：SKY FJORD PRIVATE真正WebGL / ART REJECT（2026-10-27 JST）

実装 [c24f9ea7](https://github.com/ryomashibaba/dopagaki-development-hub/commit/c24f9ea7ae8f59094de44fb6c068a532c002a717)、[専用CI #40412675585](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40412675585) SUCCESS、[独立物理CI #40412675329](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40412675329) SUCCESS、[真正WebGL Artifact #12694960144](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40412675585/artifacts/12694960144)を保存。35PNG=baseline/CX12+CR2+CT3+凍結DG6+凍結DH6+新DI6。前DH証拠との比較では旧baseline/CX12/12 PNGと旧DG/DH12/12 PNGがSHA-256バイト一致。CX generator blob `af076d67492a677d2235e4730aef8cdf4808e106`、元道路7面/動体28/gap52/240Hz/カメラ/入力/main/Gold/本番を変更せず、PRIVATE専用の4ファイルだけ実装。Actions起動3件。

**都市構図仮説**：DG箱街区、DH内部充填の失敗を踏まえ、クレセント2基を完全に保ち、主役の向こうに扇状に開く左右の居住翼と中央の大峡谷空洞を作った。ただし2実道路×15/17/18.5s正規WebGLでは、15秒の追加物が棚・梁状の斜めの張り出しに見え、17秒は遠景へ0.90～0.99%の差分に圧縮、18.5秒は上部クリップ。峡谷の奥行き、居住の活動、巨大都市と主役の統合が高速走行画面で読み取れず **DI ART REJECT**。CX→DI変更画素率：true-pinch 2.9050/0.9035/3.2538%、pinch-switch 2.3545/0.9924/2.9507%（画素差は美術評価点・ゲーム公平性の証拠ではない）。

**次は絵コンテから**：距離を深めるだけでは視覚の奥行きにならない。15→17秒にプレイヤーが何を見るかを三幕の連続視点で設計し、統一都市として本当に見える大胆な構図だけをPRIVATE実WebGL試作。パーツ追加と自動診断だけを繰り返さない。証拠・反省の詳細は [DI専用QA](docs/G4E7DI_SKY_FJORD_TRUE_GAME_ART_REJECT_JA.md) に記録。正式都市美術採用0件、ART/HUMAN/READY/PUBLISH/MERGE HOLD、公式Slope2認定0m、PR #46 OPEN/Draft/未マージ。DIは研究保存のみ。

---

# G4E-7DH 完了：PRIVATE統合HARBOR CRESCENT真正WebGL・構図ART REJECT／効率改善（2026-10-27 JST）

**実装**：コミット [a2c5e4b](https://github.com/ryomashibaba/dopagaki-development-hub/commit/a2c5e4bc140a357f5074aa5e9c68abbc51f389df)。前DGの箱型ビルでCXの象徴的クレセントを失ったことを受け、CX元ランドマーク・公道バンク公共歩行空間・全オリジナル物理/カメラを保持。主役と同じ道路端/曲線profileから、左右非対称の湾曲した居住ギャラリー、実際の穴のある前後外壁、斜めの接続アバットメントを生成する小さなDH候補を実制作。新たなshaderや偽レンダではなく、**Playwright PRIVATE-only 既存DG試験モジュールURLを一画面だけ差し替え**、同じ実ゲームWebGL2 renderer/real 240Hz native cameraで撮影。DHモジュールはbuildにコピーせず、通常のCX・凍結DG・drive3d・scripts/buildの各ファイルは一切変更しない。PUBLISH禁止、正式Slope2=0m。

**テスト・エビデンス**：[専用PRIVATE CI #40406130250](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40406130250) SUCCESS、旧CIテスト10/10、DG 1/1、DH独立1/1、DF合成3/3 PASS、DEの凍結DA/DB/DC再現PASS、PRIVATEビルドPASS、真正WebGL **29 PNG**（既存baseline/integrated12+CR2+CT3+凍結DG6+新DH6）を保存。[Artifact #12690169687](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40406130250/artifacts/12690169687) に `G4E7CI_REAL_GAME_SCREENSHOT_AUDIT_HOLD.json` と元PNGを格納。前DG artifact #12689434708 と標準CX/baseline 12PNGのSHA-256を比較し **12/12バイト完全一致**。既知CX private GPU source-ID 17秒左近景 ROI 13,423/206,824=6.4901%（<18%）と壁0の既存回帰も保持。ただし DHの新付加建築の視界保護までGPUで認定した意味ではない。[独立物理CI #40406130272](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40406130272) SUCCESS（A13/B5 2 jobs）。

**DH/CX 真正WebGL画素差**：true-pinch 15s 2.9540%、17s 1.3100%、18.5s 2.4476%；pinch-switch 15s 3.4248%、17s 1.4601%、18.5s 1.3081%。2道路×3秒の画角、正規BG240Hzカメラと物理状態は完全に一致。指標は候補が画面に映った程度を示すだけで美術点数ではない。DHの15/17秒比較画像ではCXの特徴的巨大クレセント輪郭を残せたが、内部に追加された淡い青/白の構造が**大きな斜めの楔状不透明塊**となり、道路と街区の接続や奥行きが読み取れない。18.5秒も効果は乏しい。横長棚と箱ビルを避けても『建物の一部をふさいだだけ』という新しい失敗類型。**DH候補を美術ART REJECT、正式採用0件**とし、CX通常表示を維持。構図は装飾的追加では突破しない。

**効率改善は明確にPASS**：DG前工程は shared build / drive3d を変更して47 workflow runs発火。本DHは専用 `web/p101-w9c2-g4e7dh-harbor-crescent.mjs`、独立テスト、private capture、専用CIのみを変更し、同コミットでActions起動 **3件**（専用CI、B5 physics、P64 QA-gated preview）に限定。通常のshared build / game rendererを触らず真正WebGLまで到達した。PRIVATE一時差替えは評価専用で、公開ビルドのDGモードからDHへ自動切り替えるものではない。

**次工程の方針**：すでにDA/DB/DC/DG/DHをART REJECTしたため、**単純な形の差し替えをやめ、走行中に見える3D都市の主題・規模・居住導線を設計から再考すること**。キャプチャ上では都市より道路のカーブとHUDが支配的で、主役が近接フレームで消え/画角上部に切れがち。カメラをズルして変更するのではなく、どの高速視点でも主役が都市街区に接続した形を認識できる設計証拠が必要。巨大な楔/壁、孤立クレセント、箱ビル群、棒・薄板のいずれも禁止。既存2道路×15s/17s/18.5s画像＋可能なら連続走行の時間軸を主体に評価し、ART肯定例がない状態で数値閾値を正式採用条件にしない。

**固定ゲート**：ART/HUMAN/READY/PUBLISH/MERGE HOLD、公式Slope2 0m、CX generator blob `af076d67492a677d2235e4730aef8cdf4808e106`を維持、PR #46 Draft未マージ、main/Gold/本番/原作非変更。

---

# G4E-7DG 結果確定：CITY CANYON候補は真正WebGLでART REJECT（2026-10-27 JST）

**実制作**：[独立DG候補 3b14196](https://github.com/ryomashibaba/dopagaki-development-hub/commit/3b14196c3f2e558f79c10a9539f7cda2e9414c49) と [比較ゲーム接続 13a8633](https://github.com/ryomashibaba/dopagaki-development-hub/commit/13a8633f107bbe76fd3bf5a56fd44983e4f420e5) をPRIVATE研究用に保存。旧CX generator Git blob `af076d67492a677d2235e4730aef8cdf4808e106` は変更せず。凍結BG240HzカメラとB48×7/B51-C×28/gap52を利用し、既存2主役を一時的に三つの奥行き層の居住塊・抜けのある街路・公共進入路を持つ6体積×2地区に置き換える明示的ローカル比較モード `g4e7dg=canyon-city` を作成。ゲーム標準描画はCXのまま、新規道路・衝突床・動体・速度リセットなし。正式Slope2=0m。

**技術検証**：[PRIVATE真正WebGL CI #40402442774](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40402442774) **SUCCESS**、既存CI単体10/10・DG候補単体1/1・DF合成3/3 PASS、DE過去不採用再生PASS、PRIVATE build PASS。元ゲームbaseline/integrated計12PNG・CR source-ID2・CT source部分3PNGに加え、真正DG WebGL6PNG（2道路×15/17/18.5s）＝合計23PNG。[Artifact #12689434708](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40402442774/artifacts/12689434708) に画像と `G4E7CI_REAL_GAME_SCREENSHOT_AUDIT_HOLD.json` を格納。[独立物理fast CI #40402442748](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40402442748) SUCCESS。前DF artifact #12658309698 と普通のbaseline/integrated真正WebGL12PNG SHA-256を照合し **12/12バイト完全一致**。既知CX近景のprivate source-ID ROIは13423/206824=6.4901%（18%未満）、既知青緑壁ゼロを維持。ただしこれは**DG候補の全景観遮蔽保証ではなく、標準CX画面の既知回帰**である。

**実画面のCX→DG変更率**：true-pinchの15/17/18.5秒=9.9880%／3.5211%／5.7592%、pinch-switch=11.8280%／3.8604%／5.0957%。数値は同一カメラWebGL画素差であり、品質点数ではない。道路中央窓の変更量も小さいが人間の道路先読みや視認の合格判定には使えない。

**美術判定はART REJECT**：15秒で左の巨大街区が画角外へ切れ、主役クレセントの形状が箱型の直立ビル群に置き換わった。17秒では箱ビルの間の公共空間・居住奥行き・連続する街路が高速視点から読めず、従来の失敗類型「別個の箱を足しただけ」の再発になった。18.5秒でも巨大街区は上方で途切れた形として迫り、魅力的な都市のまとまりは成立しない。形状の差が大きいこと（15秒画角の約10～12%）は美術改善の証拠ではない。**新候補を正式採用せず、CX標準を維持**。DGコードはPRIVATEの未採用実験記録に限定し、公開・マージは行わない。

**工程効率上の失敗**：`scripts/build.mjs` に新しい静的コピーを追加したため、他工程と共有する多数のActions（同一コミットで47 workflow runs）が不要に起動してCI待ちを発生させた。次工程は専用評価基盤の隔離と既存ワークフローのwatch pathの影響調査を重視し、共有ビルドファイルを無闇に変更しない。新候補制作前には、まず2道路×連続視点の主役輪郭と構造的な空洞が一つの都市として読める設計図・比較構図の基準を作る。建築数やBOXのレイアウト微調整を進歩とみなさない。

**保護ゲート**：CXは安全比較基準でありART正式合格でない。ART/HUMAN/READY/PUBLISH/MERGE HOLD、正式Slope2認定0m、Draft PR #46 OPEN/Draft/未マージ、main/Gold/本番/原作未変更。

---

# G4E-7DF 完了：17秒の主役形状と15→17秒変化の実測、真正WebGL保持（2026-10-26 JST）

**技術結果**：実装 [2abc765](https://github.com/ryomashibaba/dopagaki-development-hub/commit/2abc765083c8aa24ab13d69c98b561495c3fde11)／[専用CI #40340505043](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40340505043) **SUCCESS**／[独立P101物理CI #40340505090](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40340505090) **SUCCESS**。既存ゲーム側テスト10件PASS、新DF合成テスト3件PASS、CX・凍結DA/DB/DCの2道路×15/17秒＝16画角を正規BG240Hz CPU投影で再生。PRIVATEビルド、真正WebGL画像17枚（通常12、source-ID2、CT3）、同一正規カメラ6対、warnings0。[証拠Artifact #12658309698](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40340505043/artifacts/12658309698)に \`G4E7DF_HERO_MORPHOLOGY_HOLD.json\` と16枚のCPUシルエットSVG、真正WebGL17 PNGを保存。前DE成功時Artifact #12657063279 と普通のbaseline/integrated真正WebGL12 PNGのSHA-256比較を行い **12/12バイト完全同一**。CXジェネレータ blob \`af076d67492a677d2235e4730aef8cdf4808e106\`、元走路/動体/240Hz/カメラ/コントロール/本番には変更なし。

**新診断の範囲**：DDのCPUデプス格子48×30で、明示的オプション使用時にのみprivate描画source所有格子を返す。DFはauthored \`slot\` のある主役建築を抽出し、見えるセル数、形状外接箱充填率、連結成分、横断行の分断数、閉じた空洞セル、外接・画面端位置を記録。15秒から17秒まで同じslotを追い、画面内への出入りと指標変化を記録する。合成の密実板・穴のある輪郭・細い分断材を区別するが、良し悪しの正解ラベルを予測するモデルではない。格子を描いたSVGは **CPUによる所有推定** で、真正WebGL画素でも美術的なレンダリングでもない。

**17秒の実測（主役slot 2）**：true-pinch／pinch-switch順に、CXは27/31セル、外接箱充填率0.429/0.492、囲まれた空洞4/4セル。DAは45/52セル、充填率0.625/0.650、囲まれた空洞0/0セル。旧「巨大壁」の不採用形状が17秒では薄い帯警告に引っ掛からなくても、画面上の不透明な塊に寄っていることが定量的に確認できる。DBは24/25セル、充填率0.381/0.446、連結成分6/3（CXは3/2）で、薄い支持材と分離構造が画面上の断片化として残る傾向を示す。DCは26/30セルとCXの27/31セルに近く、slot 2の外形にも差が少ない。DC特有の非主役 \`inhabited-canyon-section\` はslot 2の形状指標だけでは対象外であり、**非主役の都市断面を診断できたと誤認してはいけない**。この制約は次の統合都市構図の評価に重要。

**本質的な校正上の教訓**：既知のDA/DB/DCは企画全体に対するART REJECTであり、全12カメラ画角それぞれを人が独立に「失敗」と判定したラベルではない。17秒に候補の失敗部分が視界外へ離れたり、低格子で小さくなったりすれば、警告が無くても診断の誤判定とは直ちにいえない。従来の17秒6画角0検出を恣意的な閾値で100%にすることは禁止。DFの数値で「検出率向上」「都市美術改善」「人間が楽しく遊べる」のいずれも認定しない。

**未解決**：DFはslot付き主役のみに特化し、DCのような公共施設・居住断面の非主役source全体について2Dの空隙・構造を評価できない。48×30 CPU所有格子はGPU最終色、物理的な奥行感、透過、遮蔽、人間の視認時間の代用ではない。新たな良質都市の独立肯定例も無い。DA/DB/DCはDF内で真正GPU再描画しておらず、過去のART REJECTはその当時の実WebGL評価に依拠する。DFの新たな主役形状分類はCPU仮説であり、WebGLで形態識別できたとの断言を禁ずる。

**次工程の方針**：これ以上過去12画角の検出率合わせを行わず、実ゲーム高速カメラで主役＋公共路＋居住地区のマクロ構図が成立する少数の統合都市案に戻る。次の制作前に①15/17秒だけでなく高速通過による連続視点、②主役以外の都市機能の読める奥行、③実際の道路と街区の接続感、④局所化した壁・棚・棒状失敗の回避を明示する。真正WebGLを制作後に比較し、美術が未達なら実験案のみ撤回。CXは安全な比較基準であってART採用ではない。**ART/HUMAN/READY/PUBLISH/MERGE HOLD、公式Slope2認定0m、Draft PR #46未マージ**を維持。

---

# G4E-7DE 最終確定：過去のART REJECT再現16件と監査の実際の弱点（2026-10-26 JST）

**正本と完成CI**：歴史的DA/DB/DC景観固定とCPU構図監査拡張 [fd0039a](https://github.com/ryomashibaba/dopagaki-development-hub/commit/fd0039a7e9af97a45c268f03306e1191239bc97e)、主役分類のバグ修正と暫定3指標 [47bb409](https://github.com/ryomashibaba/dopagaki-development-hub/commit/47bb409fddce0435ccbdc83a2875079bd708cc77)、専用CIの監視パス補完 [4f2aa22](https://github.com/ryomashibaba/dopagaki-development-hub/commit/4f2aa2276968cecf7c08ff9ced3373fe1794c88e)。[最終専用CI #40336577889](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40336577889) **SUCCESS**：従来BC/B48/B51/CI単体テストPASS、DA・DB・DC歴史的比較PASS、PRIVATEビルドPASS、真正元240Hz/WebGL17PNG＋同カメラ6対、warnings0。[証拠Artifact #12657063279](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40336577889/artifacts/12657063279) 内に G4E7DE_REJECT_CALIBRATION_HOLD.json、DD構図診断JSON、WebGL画像を保存。DE最初の実装コミット物理fast lane [#40334593020](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40334593020) SUCCESS。GPU近景ROIはCX既知の13,423/206,824＝6.49%（上限18%）、既知青緑壁0画素を維持。DEの最初の成功CIから最後のCIまで、元の通常WebGL12PNG（baseline/integrated各6）はバイトハッシュ完全一致。既存景観ジェネレータ、元物理、カメラ、走路操作を変更していない。

**本物の校正結果（2道路×15/17s×過去3案＝不採用12画角）**：従来DDの同一三角形/建築源/種類の30%以上水平連続帯および画面端大型占有警告は、**DA 0/4、DB 0/4、DC 0/4＝12/12を見逃した**。既存指標だけの採用判定は完全に不可。研究用に追加した既知失敗データ依存の3候補信号は、DA 2/4（15秒の上空占有急増）、DB 2/4（15秒の広い疎な形）、DC 2/4（15秒の上空増加＋画面幅77〜81%の低占有巨大断面）を拾い、**合計6/12＝50%**。17秒の6画角は全件見落とし。閾値は同じ12不採用画像に調整したもので、未知の美術品質への汎化、誤検出率、ART PASSの妥当性は未検証。自動ゲートに昇格禁止。

**診断バグ修正**：旧heroNotVisibleは 'anchored-civic-crescent' という種類名だけを数え、DA/DBの別主役2基を誤って不可視判定していた。現在はサイト固有の authored slot 属性を使用し、DA/DB/CX/DCすべてで15秒2基、17秒1基と正しく計測した。近平面未測定は完全後方・近裁断横断・近平面以下に分割して記録。これらも最終GPU可視性の代わりにはならない。

**次DFへ**：まず17秒で過去3案がすべて見逃された理由を調べ、単純な面積・水平帯の閾値よりも、画面投影された主役の形状・空洞・居住体積・フレーム間一貫性の指標を研究。静止4画角で人間走行体験は証明できない。正規WebGL画像を唯一の美術確認の証拠とし、これ以上失敗都市の小手先置換を繰り返さない。引き続き**ART/HUMAN/READY/PUBLISH/MERGE HOLD・公式Slope2 0m**。PR#46 Draft未マージ、main/Gold/本番/原作を保護。

# G4E-7DE CI trigger coverage and detector evaluation — 2026-10-26 JST

Initial DE replay (run #40334593002, SUCCESS) detected zero/12 previously REJECTed views with original >=30%-row-based single triangle/source/kind/composite warnings. Keeping this as a measured false-negative result, NOT a pass. Historical RGB examples indicate DA first 15s sky occupancy +53/+52 of 624 cells; DC +43/+44 and occupied source widths 0.77083/0.81250 with low area. DB 15s architecture widens by ~0.08-0.15 screen fraction without material rise in total occupancy, explaining why broad planar-band thresholds miss it. A proposed exploratory triad (sky expansion >=30 cells, mostly unfilled widened silhouette, wide low-area source mass) is recorded in JSON but is empirically tuned ONLY to prior rejections. Do not deploy as an ART gate before independent positive/success examples. DA/DB heroNotVisible was an invalid false positive caused by kind-string rename; changing to source.slot corrects that. DE commit 47bb409 adds unit test and exploratory findings; here CI workflow file-watching also includes the new audit, calibration script and historical fixtures so future changes cannot skip validation. Existing CX renderer and physical road never modified; ART/HUMAN/READY/PUBLISH/MERGE HOLD, official Slope2 0m, PR#46 Draft remains unmerged.

# G4E-7DE calibration corrections (2026-10-26 JST)

DE first successful CI #40334593002 used exact history and produced true 17-WebGL screenshot artifact #12656967603. The old long-horizontal-row warning detected ZERO of 12 known ART REJECT viewpoint cases: DA 0/4, DB 0/4, DC 0/4. This establishes an important FAIL for diagnostic recall, not an ART success; calibration is technically valid. Analyses show DA 15s sky occupancy +53/+52 cells of 624 vs CX, DC +43/+44, and DC's single 'inhabited-canyon-section' source visibly spans 77.083%/81.25% of screen width with only 3.75%/4.31% screen area. DB 15s widens its dominant structure but with little occupancy change; image shows spindly skeletons, not a large solid wall. Previously DD counted heroes only by source kind 'anchored-civic-crescent', erroneously labeling DA/DB renamed megastructures as absent. Corrected hero identification to authored immutable site 'slot' metadata, irrespective of kind; add one synthetic slot regression test. Experimental comparative warnings (excess sky, sparse widening, broad thin mass) appear in DE calibration JSON as research, NOT production ART gates and not validated on a positive corpus. Need positive/negative calibration and GPU provenance before any automatic rejection. CX mesh, physics, genuine camera, speed, natural jump, PR#46 Draft/main/Gold/production untouched. ART/HUMAN/READY/PUBLISH/MERGE HOLD, official Slope2=0m.

# G4E-7DE — Frozen historic DA/DB/DC calibration (2026-10-26 JST; CI pending)

Original ART REJECT historical generators have been frozen from commits DA 0158742, DB 63c58d6, DC 2be6997 as exact source fixtures. Replay CX+DA+DB+DC on both authentic B48/28 B51/gap52 roads using unchanged original 240Hz cameras at 15s/17s. Store 16 read-only CPU macro audits and 12 rejected-vs-CX pair comparisons alongside 17 genuine WebGL PNGs in existing CI artifact. DD audit now separates fully-behind from near-plane-crossing triangles, detects connected screen rows of the same kind or entire scenery in addition to single triangles/sources, and records per-source screen bounding boxes and cropping. Treat detection thresholds as provisional warning candidates, compare against the known subjective ART REJECT labels, never automatically certify artistic quality. Existing actual CX scenery generator, physics, renderer, controls, Gold/main/production and PR#46 draft are not altered; ART/HUMAN/READY/PUBLISH/MERGE HOLD, certified Slope2=0m.

# G4E-7DD — completed authentic camera composition QA, CX unchanged (2026-10-26 JST)

**Commits:** DD implementation 48a6682ce74f6727cadbca7cf8e7e0ea16502229; expectation correction 18a6660d0edf5922186cced69627b833dbdf2f64. Initial run https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40330851720 FAILED only one new synthetic wall test: 300m geometry is correctly classified as MID (125m..400m), not FAR (>400m). The 9 other tests passed. Corrected the assertion only; existing scenery, audit algorithm, camera, physics unchanged.

**Final CI:** https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40331574011 completed SUCCESS. 10/10 tests, PRIVATE build, genuine original BG240Hz 17 WebGL PNGs (12 ordinary + CR2 + CT3), six strictly matched camera pairs, warnings0, artifact ID 12654704411. DD source-aware read-only 48x30 CPU geometry audit saved as G4E7DD_CAMERA_COMPOSITION_HOLD.json in this artifact. B5 physical fast lane https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40330851918 SUCCESS. Genuine DD versus saved CX integrated screenshots: exact RGB match for both roads at 15s, 17s, 18.5s = all 6 normal screenshots, 0 changed pixels. CX source-ID ROI remains 13,423/206,824=6.49% (threshold 18%). Known blue-green wall returns 0 pixels.

**Actual 4-view CPU baseline:** true-pinch 15s 9.375% scenic screen occupancy and 2 visibly sampled hero sources; 17s 9.583% / 1 hero; pinch-switch 15s 11.528% / 2 heroes; 17s 9.444% / 1 hero. No source-level or triangle-level >=30%-wide row warning in CX. Synthetic wide planar wall check PASS. Central candidate scenic triangle occupancy 0/196 cells in all four shots, but this instrument does not measure the road itself: do NOT use as road/human play visibility proof.

**Limitations and DE next:** This is CPU authored triangles raster depth approximation, NOT final WebGL fragment ownership or artistic score. The conservative unknown-near bucket also includes triangles fully behind camera, so nearClipUnmeasured=true alone is not proof of a dangerous clipping incident; split all-behind versus near-plane-crossing next. Calibrate these candidate metrics against previous visual failures DA, DB, DC, quantify false positives before any automatic ART gates. This DD stage improved diagnostics only, made no new artistic geometry, and ART/HUMAN/READY/PUBLISH/MERGE remain HOLD; officially certified Slope2=0m. Main, Gold, production, original, physics, Draft PR#46 unmerged/protected.

# G4E-7DD CI test expectation fix — 2026-10-26 JST

Initial genuine WebGL CI run #40330851720 FAILED only the new synthetic wall test: the mock wall is at 300m depth and the diagnostic correctly bins 125m..400m as mid distance. The test incorrectly asserted far>0 (far starts at 400m). All 9 other unit tests passed including actual 4-camera geometry audit and CX physical protections; private build and screenshots were skipped. Fixed the synthetic test expectation to mid>0; no geometry, renderer, camera, physics or audit algorithm change. Re-run the original single workflow and inspect both JSON and unchanged genuine GPU frames before declaring success. ART/HUMAN/READY/PUBLISH/MERGE remain HOLD.

# G4E-7DD — read-only camera composition diagnostic implemented (2026-10-26 JST; CI pending)

Quality problem: failed DA/DB/DC city silhouettes passed the existing CX 125m near-screen veto while creating distant giant slabs, narrow shelves and clipped skyline buildings. DD does NOT generate a new city mesh. A new private diagnostic module performs depth-aware CPU triangle projection of ORIGINAL BG240Hz cameras at 15s and 17s for both roads, on the existing authored CX scenery. It records near/mid/far screen cells, central-driving-view occupancy, upper-sky occupancy, visible major hero source IDs, clipped-at-edge and unknown-near triangles, and longest continuous horizontal runs for both individual triangles and whole source buildings. A synthetic large far wall unit test checks detection. Every result is labeled NOT GPU / NOT ART; thresholds are warnings until calibrated against rejected images. The output G4E7DD_CAMERA_COMPOSITION_HOLD.json is bundled with the existing genuine 17-PNG / six-pair CI artifact, without modifying the camera or renderer. No artificial grade or visual pass is declared.

Protected: untouched existing CX generator/road/camera and WebGL renderer, B48=7, B51-C=28, gap52, 240Hz, natural jump/steering/speed/score, main/Gold/production/original, PR#46 remains draft and unmerged. ART/HUMAN/READY/PUBLISH/MERGE HOLD, certified Slope2 0m.

# G4E-7DC 完了 — 都市一体型断面は真正WebGLでART REJECT、CXへ安全復元（2026-10-26 JST）

**実験の証拠**：実制作 [2be6997](https://github.com/ryomashibaba/dopagaki-development-hub/commit/2be6997035a6dad8f884184bfa8129d058aabc3e) は主役クレセントを交換せず、既存公共通路に接続する3段・両岸計4候補の居住都市峡谷断面を設計。旧CPの孤立した遠景折屋根は置換し、厚い段床・左右荷重壁・透過でなく真正未作成三角形の開放ファサード・駅ランプを同一断面で生成。各候補は元15/17s正規カメラ2枚で125m/150点のCX近景視界監査（19点以上なら描画前棄却）を使用。

**真正CI結果**：[Run #40328424880](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40328424880) **completed/SUCCESS**、元BC道路/28動体/gap52/正規240Hz単体テストPASS、PRIVATEビルドPASS、元ゲームCanvas WebGL17枚・6組厳密同カメラ比較、warnings0。[Artifact #12655165175](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40328424880/artifacts/12655165175)。別の B5 物理CI #40328424907もSUCCESS。CX近景 source-ID magenta 13,423/206,824＝**6.49%**（上限18%以内）、true-pinch 17s C.glass 青緑RGB(41,135,163)は0画素。これはPRIVATE特定源ROIだけの回帰監査であり、新規追加された遠方の大面を安全承認するものではない。

**CX→DC 4画角真正WebGL RGB差分**（各1008×645、RGB差和>48）：true-pinch 15s 25,056px（3.854%）、17s 4,307px（0.662%）、pinch-switch 15s 26,484px（4.073%）、17s 4,659px（0.717%）。中央の固定走路ROIでの変更はそれぞれ0/9/27/0画素と小さく、走行の公平性・ゲーム性は未認定。

**美術ART REJECT**：実画像では15sの画面左から大きな青白い水平／斜めの連続面が張り出し、厚い居住都市ではなく巨大な低い浮遊板や高速道路外側の屋根に見える。17sでは新断面が遠く小さくなり、既存クレセント、近景街区との機能的な都市接続・用途・階層が視覚的にほぼ読めない。実装意図としては三角形未配置の開口と荷重壁があるものの、本物のゲーム視点ではCYの細い架構・DBの棚・DAの大面という失敗を解消できなかった。変更画素率やCI PASSをART PASSに転用しない。

**復元・次DDへ**：DCの履歴・真正CI/PNGは保持。活動中ブランチの景観ジェネレータと専用テストを前HEAD [a52e4ad](https://github.com/ryomashibaba/dopagaki-development-hub/commit/a52e4adae62a0de493a10939dae6677d440a2f3c) のCX Git blobと完全一致へ戻す。[skip ci]を指定し無意味な既知CXの再CIを増やさない。次DDはマクロメッシュをまた追加する前に、4つの元画角に対する各視認領域・道路可読領域の**画像設計基準を先に設け、低く巨大な横面を画角上で排除する**。都市の主役、居住、駅、断崖が各視点で自然に連続する構図を先に検証する。ローカル/公開メッシュ混用を避け、個別の棒/屋根/箱を足す反復もしない。

**絶対維持**：B48×7/B51-C×28/gap52/240Hz、速度、操舵、自然ジャンプ、相対カメラ、スコア、main/Gold/原作再現/本番二サイト未変更、PR#46 Draft未マージ、ART/HUMAN/READY/PUBLISH/MERGEすべてHOLD、正式Slope2認定0m。

# G4E-7DC — 近中遠の道路沿い都市断面一体化（実3D実装・真正WebGL未判定、2026-10-26 JST）

**問題と方針**：CY/CZ/DA/DBは主役2基の局所置換が失敗。DCは既存2クレセントとCXの近景12街区の視界保護を変更せず、孤立する遠景の細い折屋根の生成機構そのものを廃止し、元道路沿いの公共コンコースへ直結する3段の**厚い居住都市断面**へ置換。両岸2か所ずつ合計4候補。各断面は公共交通基壇(d78)→中景居住(d128)→奥側都市(d173-230)を一つの道路追従座標で建築。斜めの広い荷重壁・三角形のない連続空気開口・居住ギャラリー・階層をつなぐ公共スロープを同一マクロ構造に含める。近接125mの正規BG240Hz 15/17sカメラに本物の三角形が19/150グリッド以上投影された候補は、CXと同じ保護アルゴリズムで描画前棄却。単なる大量の細棒や独立巨大平面の追加ではない。

**保護**：B48道路7/B51-C動体28/gap52/正規240Hz/操舵/自然ジャンプ/カメラ/加速/スコア未変更、station2左近景とCR/CT識別機構不変更、新衝突・新道路0、main/Gold/原作/本番未変更、Draft PR #46未マージ。実ゲーム現物17 PNG/6同カメラ組の既存CIを再利用する。CX近景source-ID18%上限、青緑ベタ壁0を保持。**現時点はART/HUMAN/READY/PUBLISH/MERGE HOLD、正式Slope2認定0m**。単体テストや画素変化だけで芸術合格としない。失敗なら研究コミットと証拠を残し、景観/テストをCXへGit blob復元する。

# G4E-7DB 完了 — 開放段層スカイポート、真正WebGL美術ART REJECT／CX復元（2026-10-26 JST）

**研究と証拠**：DBの実装コミット [63c58d6](https://github.com/ryomashibaba/dopagaki-development-hub/commit/63c58d630d22915b5b5280b5f16e0bbd7e3f06d9)。旧DAの連続巨大垂直壁を破棄し、既存2主役を4段の公共交通/居住テラス、3つの連続した大きな空気の抜け、上下を支える6本の荷重/交通コア、低い公共広場へ全交換。体積より開口と各層の可読性を重視したが、デザインの成熟は実ゲーム画像で判定する。

**真正CI**：[G4E-7CI #40325893148](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40325893148) **completed/SUCCESS**。単体テストPASS、PRIVATE build PASS、B48道路7・B51-C動体28・gap52・正規240Hzの元ゲームWebGL17枚（12通常、2CR、3CT）・元同一カメラ6比較対、warnings0。[証拠artifact #12652025241](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40325893148/artifacts/12652025241)。DA時と同じCXのpinch-switch 17s PRIVATE magenta源ROIは13,423/206,824＝6.49%（18%上限を維持）、true-pinch 17s既知青緑RGB(41,135,163)は0画素。人間操作の成功ではない。

**CX→DB実画面RGB差分（4画角、各1008×645、RGB差和>48）**：true-pinch 15s 49,811px（7.661%）、17s 17,942px（2.760%）；pinch-switch 15s 59,624px（9.171%）、17s 20,033px（3.081%）。画面中央走路域の変化ピクセルはそれぞれ0/215/0/226と限定的で、走行視界の劇的改善とは扱わない。15sのDBは白い斜め巨大支持材＋薄いデッキが並び、17sは細い縦柱・平床の骨組みに圧縮される。都市主役の内部や用途、生活スケール、建築体積が読めない。これは旧CYの細い棒／CZの付属箱という失敗への逆戻りであり、**ART REJECT、CITY HERO不採用**。変更画素率とCI PASSは美術評価ではない。

**復元**：DBの研究と実画像はコミット・CI・artifactとして保持し、活動中の景観ジェネレータと専用単体テストを直前のCX復元コミット [4360a36](https://github.com/ryomashibaba/dopagaki-development-hub/commit/4360a36fe4d3967008b719a81845adf835ff2cc7)のGit blob SHAと完全一致へ戻す。[skip ci]で既に実証されたCXを無目的に再テストしない。開発正本にはこの失敗と次工程の指針を文書追加。

**次DCの設計原則**：同じ主役2基を「リング→壁→棒→棚」と置換する局所形態研究は一時停止。まず実240Hz 15/17sの4画角で、近景の走路・中景の居住街区・遠景の大建築・公共動線が最初から統合された **一枚の都市断面** として見える空間配置を研究。カメラに対し見えていないだけの内部機能を作り込まない。独立アーチ追加や細線支持の量産を避け、ゲームプレイヤーが道路の進路を予測できることと一体の宏観構造を両立させる。視認・負空間・断面階層を複数視点で事前予測してから実3D化する。B48×7/B51-C×28/gap52/240Hz/自然ジャンプ/速度/相対カメラ/操舵/main/Gold/本番/原作全保護。ART/HUMAN/READY/PUBLISH/MERGE HOLD、正式Slope2認定0m、PR#46 Draft未マージ。

# G4E-7DB — 開いた居住段層スカイポート、真正WebGL判定待ち（2026-10-26 JST）

**解決対象**：DAの二分巨大居住断崖は17正規WebGLで鋭角のベタ壁に見え、15sでは上端が画面外に切れた（成功した物理CIと別にART REJECT）。DBはDA構造の小型化・微修正ではなく、連続した縦壁自体を廃止。既存主役2基を「4段の厚い居住/駅テラス＋各段を隔てる3つの空気の抜け＋上下連続する6本の交通・荷重コア＋低い公共駅前広場」の統合建築へ置換。飾りの線/リング増殖、道路越しのゲートをしない。すべてPRIVATE描画専用で、走行可能床の認定なし。旧アーチ向け粗い位置スコアに加え、DB自身の6代表実メッシュ点を本物の15s/17s元BG240Hzカメラへ投影して各主役の有効視界/上端欠けを dbSkyportQA に残す。これはGPUピクセルや美術合格の証明ではない。

**品質ゲート**：専用CIの17真正元ゲームWebGL PNG／6厳格同カメラ対を用い、2道路15s/17sの通常描画で近景道路・中景・奥の主役に用途と高度差が読めるか観察。18.5sはoff-road分離。近景CX の source-ID 割合<18%、青緑C.glass巨大壁再発なし。2基のいずれかが細い棚・浮き板・模様付き箱、遠景で消える断面、道路を圧迫する巨大屋根になるならART REJECT、検証済CXへ単体テストと景観ジェネレータをGit blob完全復元。テストPASSのみで採用しない。

**厳格保護**：B48×7/B51-C×28/gap52/正規240Hz・自然ジャンプ/操舵/速度/既存カメラ不変更、main/Gold/原作/本番二サイト不変更。正式Slope2=0m、ART/HUMAN/READY/PUBLISH/MERGEすべてHOLD、Draft PR #46 未マージ。

# G4E-7DA — 大断崖型都市の実WebGL美術審査ART REJECT、CXへ安全復元（2026-10-26 JST）

**実験コミット**：[0158742](https://github.com/ryomashibaba/dopagaki-development-hub/commit/0158742798af56193f3ec0225fac903472171194)。既存クレセント2基を二分居住断崖（中央37m空間、3段テラス、前後貫通開口、接地斜支持）へ置換し、単純な棒やアーチ内部の小箱追加とは異なる都市主役の輪郭を実制作。

**本物の検証**：[G4E-7CI 専用CI #40323003944](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40323003944) **completed/SUCCESS**。BC/B48/B51・景観単体テストPASS、PRIVATE build PASS、元ゲーム正規BG240Hzの真正WebGL 17PNG（12通常+2CR+3CT）/厳格同カメラ比較6対、warnings0。[証拠 Artifact #12649359854](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40323003944/artifacts/12649359854)（2026-11-02 12:37:24 UTC失効）。CXのprivate GPU source-ID近景ROIは13,423/206,824 = **6.49%**で18%上限を維持。既存の青緑ベタ板は正規画面での再登場を認めず、原物理B48×7/B51-C×28/gap52/240Hz/カメラ/操舵/自然ジャンプを改変していない。

**CX→DA真正WebGL RGB差分（同一1008x645画像・RGB差和>48）**：true-pinch 15s **49,453px/7.606%**、17s **18,015px/2.771%**。pinch-switch 15s **53,472px/8.224%**、17s **21,875px/3.365%**。変化は大きい主役の画面上端・側方へ集中し、中心走行帯の変更は極少。画素変更は美術点数ではない。

**目視美術審査＝ART REJECT**：新しい輪郭は旧リングと明確に異なるが、15sでは上端が画面外に切れ、大きな鋭角の不透明な断崖ファサードが目立つ。並列する二つの居住翼と中央37m空洞はゲーム画面で都市の公共空間・駅・居住の階層として十分読めず、巨大な装飾壁／尖った外殻に後退。17sでは建築の大きな輪郭変化が遠景に圧縮され、都市の近中遠連続・壮大な未来生活スケールの統合不足。CXの進路前方は大幅悪化していないが、CITY HERO採用不可。技術CI PASSをART PASSとしない。

**安全復元**：DAの失敗研究は上記commitと成功CI/Artifactに永久記録し、活動中ブランチの**景観ジェネレータと単体テストを検証済CXのGit blobへ完全復元**（DA撤去）。文書のみ追加し、[skip ci]で無意味な既知CXのCIを増やさない。次DBでは新たな巨壁・平坦外殻を避けるため、シルエット全体が同一元240Hzカメラに収まる主役立地と**中空の都市断面・居住体積が視認できる高低差**を設計段階で保証してから実装する。近中遠・負空間・走路予兆は引き続き統合審査。ART/HUMAN/READY/PUBLISH/MERGE HOLD、正式Slope2認定0m、PR#46はDraft、main/Gold/本番/原作保護。

# G4E-7DA — 主役都市の二分居住断崖マクロ形態・実WebGL審査待ち（2026-10-26 JST）

**品質仮説**：CYの細い周辺骨格、CZの既存リング内の箱状積層はいずれも、都市の主役輪郭を変更できずART REJECT。DAでは既存の主役リング2基を直接再設計し、二つの分厚い居住断崖が幅37mの本物の空中裂け目を挟む大形態とした。実メッシュの上下3層公共テラス、前後の貫通開口、接地した6斜支持を同一建築体内に彫り込む。細い棒/独立リングの追加はしない。旧source名をsplit-rift-urban-massifに変更し従来のsource rangeと真のBG240Hz同カメラ検査を保つ。

**保護**：都市景観ジェネレータと専用単体テストのみを変更。道路B48×7/動体B51-C×28/gap52/原物理240Hz/カメラ/速度/自然ジャンプ/操作/Gold/main/原作再現/本番サイトは変更禁止。既存CXの個別街区開放ルールおよびGPU近景ROI上限18%と青緑壁0画素を維持。元15s/17s両道路の通常描画、および18.5s off-roadの扱いを区別する。ART/HUMAN/READY/PUBLISH/MERGE HOLD、Slope2正式0m、PR#46 Draft未マージ。

**検証状態**：この記述は実装時点の設計仮説。新たなGitHub Actionsの結果および真正WebGL PNGを評価する前に技術PASS/美術改善を宣言しない。外形が改善せず単なる板壁や小部品に見えればART REJECTとし、CXへコードを安全復元する。

# G4E-7CZ 実3D検証・ART REJECT／CXへ安全復元（2026-10-26 JST、最新）

**実装したもの**：[CZ実験30da6e2](https://github.com/ryomashibaba/dopagaki-development-hub/commit/30da6e2948c0cdf6c6651c95a059c88a57943a96) は既存巨大クレセント2基それぞれの内部へ、両岸6層の多層床、18の実開放ファサード区画、4接地脚、4内部スロープ、既存高さ48m公共広場への2連絡面を描画専用に追加。外周巨大リングと中央上部空洞は保持し、独立した紐状CY案からは生成原理を変更した。

**本物の結果**：[専用CI #40319395601](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40319395601) **completed/SUCCESS**、10/10テスト、PRIVATEビルドPASS、元ゲーム正規240Hz WebGL17枚・同一カメラ6比較対・warnings0。[Artifact #12648312766](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40319395601/artifacts/12648312766) 2026-11-02 12:08:58 UTCまで保持。元B48道路7・B51-C動体28・gap52・240Hzと操作/速度/カメラ/自然ジャンプ不変更。CXのGPU前景遮蔽13,423/206,824（6.49%）、再発禁止閾値18%を維持。青緑色RGB(41,135,163)の壁も0画素。これは自動正規カメラの成功で人間のプレイ試験ではない。

**4画角の真正WebGL画像による美術審査**：旧CX→CZの全画面RGB変更画素は1008×645=650,160画素に対し true-pinch 15s 13,205（2.031%）、17s 3,161（0.486%）、pinch-switch 15s 15,408（2.370%）、17s 3,400（0.523%）。15秒画角では巨大アーチの下層に四角い積層付属物・空中ガレージのような面が増え、17秒画角では遠景巨大建築に吸収され変化がほとんど判別不能。画面中央の重要な走行帯の変化は限定的で危険視認性が悪化していないが、巨大都市の全域接続・主役アーチの造形統一・機能的建築としての説得力は未達。**美術判定 ART REJECT／総合 ART HOLD / CITY HERO REJECT**。CAD的な「層数・窓の数・支持材数」だけでは美術品位は担保できない。

**安全な対応**：CZの元コードと追加単体テストを破棄せずCZコミット履歴へ保持したうえで、活動中ブランチの都市景観ジェネレータとテストを**検証済みCXのGit blob SHAと完全一致**させ復元。CIは [skip ci] のリバートコミットとし、直前の成功済みCX固有のコードを再テストせず維持する（[CZの最新CI](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40319395601) 自体は成功済）。新しい物理/公共サイト公開は絶対禁止。

**次G4E-7DA：方針転換**。同じ既存巨大リングに小さな層/棒/箱を足す連続マイクロ改善を停止。初めに4つの元240Hz視点に同一レベルで現れる「都市の主役、居住群、駅/交通、空洞、道路ガイド」を**全体の形態階層**として再設計する。大型構造は市街地全域の母体として作り、個々の街区がその構造に彫り込まれているように見えること、実用途が外形に現れること、道路側の巨大壁が再発しないことを同時要件とする。実装は全域の静的デザインシルエットをまず比較し、近・中・遠景の4画角で方向性がよければ初めて内部階層を増やす。既存CXのプライベート視界保護、B48×7/B51-C×28/gap52/240Hz、main/Gold/本番/原作とDraft PR#46は保護。

**公開ゲート** ART/HUMAN/READY/PUBLISH/MERGE HOLD・正式Slope2認定0m。人間のプレイ成功未確認。

# G4E-7CZ — 既存巨大クレセント内部の都市化研究（2026-10-26 JST、実3D実装・CI未評価）

**正本**：前工程CY [実験41b6340](https://github.com/ryomashibaba/dopagaki-development-hub/commit/41b6340ab9f8222b5879116e0e685214b2b750c2) は10/10テストと実WebGL CIを通ったが、4画角の描画差分0.13〜0.47%に留まり細い独立棒にしか見えないためART REJECT。以前の実証済みCXへ景観/テストを戻した [dd61e35](https://github.com/ryomashibaba/dopagaki-development-hub/commit/dd61e35c0ee2c51eecbf8593fb272b6494a32b85) をCZ基点とする。

**設計仮説**：既存の壮大なクレセント2基は真の15秒/17秒の正規カメラに大きく現れるため、周辺へ細い装飾を増やすのでなく、その内側の立体公共都市施設を設計すればスケール・用途・交通の統一感を増やせる。巨大アーチ外周と空は変更しない。リング内側に左右各3層の開放公共/居住テラス（計6層/施設）、各層の実空気抜きポータル18区画/施設、接地した支持材4本/施設、内側ランプ4本/施設、既存48m公共広場への連絡面2か所/施設を追加。中央上層空洞は実際に三角形を置かず保持。あくまで景観・見た目上の用途表現で、Minecraft施工や物理的に走行できる床の認定ではない。

**禁止と評価**：巨大な青緑ベタ板、道路内ゲート、画面を覆う黒い屋根、非接地薄板、紐状追加建築は不可。既存の真正B48×7/B51-C×28/gap52/240Hz速度・操作・カメラ・自然ジャンプ・本番/Gold/mainを変更しない。CX近景GPU源占有率6.49%と上限18%の回帰CI、青緑RGB(41,135,163) 0の回帰CIも引き継ぐ。実際の2道路15s/17s正規カメラで変化が見えるか、空の抜け・進路予兆・巨大構造との美術的統一が改善するかを確認してから採否。ART/HUMAN/READY/PUBLISH/MERGE HOLD、正式Slope2認定0m、PR #46はDraft未マージ。

# G4E-7CY 完成審査：真正WebGL実測でART REJECT／景観をCX確定版へ差し戻し（2026-10-26 JST、最新）

**診断結果**：CYの「離れた都市クレセントと公共コンコースを繋ぐ建築骨格」はGitHub [実験コミット41b6340](https://github.com/ryomashibaba/dopagaki-development-hub/commit/41b6340ab9f8222b5879116e0e685214b2b750c2)に実制作。専用CI [#40316383653](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40316383653)は **SUCCESS**（10/10テスト・PRIVATEビルド・正規BG240Hzの元ゲーム真正WebGL17 PNG／6組の一致するカメラ／warnings0）。[Artifact #12646714580](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40316383653/artifacts/12646714580) 2026-11-02 11:44:06 UTC失効。体験の検証は非人間の固定スクリプトカメラによる。

**コンセプトの失敗原因**：正規15s/17sを使った候補絞り込みで意図の「左右に分布する最大3拠点」のうち、実際に生き残ったのは **u=.72/side=-1 と u=.92/side=-1 の左岸2拠点のみ**。左右バランスのある都市接続にはならなかった。さらに巨大クレセントの横に細い黄・青の骨格が数本増えただけで、公共都市施設にも大規模交通ネットワークにも読みづらい。路面先読みの妨げにはなっていないが、過去に失敗した「棒を追加する」段階から脱出できていない。

**本物の全画面RGBピクセル一致比較：CX→CY（1008×645=650,160画素/画像）**：true-pinch/t1500 843画素(0.130%)、true-pinch/t1700 2,816画素(0.433%)、pinch-switch/t1500 901画素(0.139%)、pinch-switch/t1700 3,040画素(0.468%)。CYによる差分は画像右の巨大クレセント周辺の狭い上方領域に集中（pinch-switch/t1700の差分bbox x558..867/y139..284）。中央走行ウィンドウの変化画素も少なく、安全改善としては主張できない。実画像比較の結論は「小装飾の追加」に留まり、**ART REJECT（総合ART HOLD、CITY HERO不採用）**。CI PASSや投影カメラへの表示は美術採用条件にしない。

**対応**：CY用の `civicEchelon` と選択関数・生成元タグ、追加テストを取り消し、景観モジュールと元テストを**CXの検証済みHEAD f22d838とバイト単位で同一内容へ復元**。元の成功済み近景視界保護とprivate GPU回帰ガードはそのまま維持し、負担の多い無目的なCI fanoutを避ける。実験コードは41b6340の履歴に残るため研究成果は失われない。

**次工程G4E-7CZ**：小さい装飾・紐状骨組みの量産は禁止。主役となる巨大都市形態を、広い居住空間・開口・歩行経路・接地・遠景シルエットをひとつの実3D都市施設として設計し、建築として成立する状態で実カメラへ持ち込む。第一候補は既存クレセントの「外周線」ではなく、クレセント間の実際の空き領域に用途を持つ多層都市施設を設ける統合案。その際、中心道路の先読み・CX近景GPU占有率<18%・青緑壁再発0を先に保護。1枚の静止画で美しくても15s/17s別道路の4画角で成立しない案は棄却。**HUMAN/READY/PUBLISH/MERGE HOLD・正式Slope2距離0m**。B48×7/B51-C×28/gap52/240Hz/自然ジャンプ/カメラ/操作/速度とmain/Gold/原作/本番二サイト不変、Draft PR #46未マージ。

# G4E-7CY — 進路の視認性を守った都市の主役骨格研究（2026-10-26 JST、CI検証前）

**統合した設計仮説**：CXによる112m/s付近での道路先読み改善を保持しながら、「2つの巨大クレセント＋細い公共廊＋分断された箱街区」を、街区と未来都市の巨大建築が連続する姿に接続する。飾り棒の乱立、大板の街路遮蔽、車線をまたぐ疑似ゲートは過去の失敗として繰り返さない。

**CY実装**：既存のB48実道路の沿道フレーム上で、正規BG240Hzの15s/17s二つの固定撮影カメラに見える街区点のみから、u間隔0.15超を維持して最大3か所の構造的都市インターチェンジ『civic-echelons』を自動選出。新しい形状は既存歩行者通路のd=78地点に接続する公共アプローチ（道路から77m以上外側）、2つの実接地基礎、6節の非対称V折れ立体支持材、背後の短い2段ギャラリー。大きな負空間は実際に三角形が存在しない開口で、道路を覆わず、景観だけで衝突なし。単に箱やネオン線を増やすのではなく既存の遠景シビックアーチに共通の構造言語を与える。生成元タグと`cySpineQA`（実カメラで視認できるフレーム数、u、side）を保存。

**検証**：既存専用G4E-7CI現物WebGL 17PNG/同一BG240Hz6対を再利用して、true-pinchとpinch-switchの15s/17sで街路視認性、スケール感、近中遠景の連結と空の抜け、CX防壁の再発0を確認。先にunit、private build/real Chromium CIを通す。ART/HUMAN/READY/PUBLISH/MERGE HOLD、正式Slope2 0m、B48実道路7/B51-C障害物28/gap52/240Hz/自然ジャンプ/相対カメラ/速度/入力不変、main/Gold/本番/原作保護、PR#46はDraft維持。

# G4E-7CX 最終確定 — 近景の走行視界保護ルール＋実GPU再発防止CI SUCCESS（2026-10-26 JST）

**正本コミット [3919b25](https://github.com/ryomashibaba/dopagaki-development-hub/commit/3919b25feaf7a9b54f98d0313b9a5afb4b0cbb6a)** に対する [専用CI #40313417994](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40313417994) は **completed/SUCCESS**。9/9単体テストPASS、PRIVATEビルドPASS、正規240Hz元ゲームWebGL17 PNG、6組の完全同一カメラ比較、warnings0。[Artifact #12645429225](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40313417994/artifacts/12645429225)。

**事実の確定**：実際のpinch-switch 17s近景左岸 `roadbank-inhabited station2/u=.62/side=-1` は旧CPU4角中心の閾値では見落とされた巨大画面遮蔽。CXは各街区の実三角形を正規15s/17sカメラで投影する15×10・近距離125mの占有判定を追加し、150サンプル中42を占めた該当街区**だけ**を開放型に切替。true-pinch15s/17sのゲーム実PNGは1画素も変化せず。pinch-switch 15s約2.0%、17s約19.8%の画素に局所変化。直接画像を見た結果、左側巨大建築の圧迫が減り、前方の道路とカーブを読める空間が増加。

旧CWのPRIVATE GPU source-ID左近景ROI 206,824画素のマゼンタ建築ピクセルは109,914（53.14%）→CXで13,423（6.49%）。**新たに既存実WebGL CIへこの比率18%上限を設け、CI #40313417994で実画像を検証・PASS**。特定色だけのGPU識別診断であり、美術品質点数/人間プレイの証明ではない。B48道路7/B51-C動体28/gap52/物理240Hz/自然ジャンプ/速度/カメラ/入力は改変していない。

**批判的な総合評価**：視界保護の技術的・視覚的前進は有効。ただし新しい開放型街区自体は単調で、遠景の箱型反復と道路障害物の弱さ、ステージの美術一貫性とゲームの面白さは未解消。**ART HOLD/CITY HERO REJECT、HUMAN/READY/PUBLISH/MERGE HOLD、正式Slope2認定0m**。次のG4E-7CYは遠景/中景/近景の主役級美術と走路予兆をひとつの全体構想として検討し、単に箱の数を増やさず正規カメラで再検証する。main/Gold/本番二サイト/原作保護、PR#46 Draft/未マージ。

# G4E-7CX — 真正WebGLによる高速視界改善確定＋再発防止（2026-10-26 JST、次専用CI待ち）

**基準コード [20c8ead](https://github.com/ryomashibaba/dopagaki-development-hub/commit/20c8ead35f92fbc623ddd432eb865d9e65c6b161)** に対する [CI #40312047578](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40312047578) **SUCCESS**：9/9 tests、PRIVATEビルドPASS、正規BG240Hz WebGL17枚/同一カメラ6対・warnings0。[Artifact #12645830351](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40312047578/artifacts/12645830351)（期限はGitHubの現在のArtifact情報で確認）。

**視界ルールによる新しい救済対象はpinch-switch station2/u=.62/side=-1 のみ。** 150点中、正規17sで巨大 near-road 居住区が42点（28%）を占める一方、旧中心距離+4角投影は見逃し。CXは実 authored triangles の近距離125m未満の15×10プローブを使い、19格子以上で開放型へ切替。true-pinch station2は旧規則で既に救済対象、他の都市街区も保持した。`cxNearVisionQA` が各街区の判定根拠を保存。

**本物の旧CW画像と新CX画像を画素比較・目視**：pinch-switch t1700 128,734/650,160 (約19.8%)が変更、t1500 13,003(約2.0%)、true-pinch t1500/t1700は1画素も変更されず。巨大な左側居住棟がなくなり走行道路のカーブと遠景が見やすくなった。Private GPU source-ID `pinch-switch-t1700` の左近景ROI x0..501,y25..436にある正確RGB(255,0,255)の画素は旧CW **109,914→新CX 13,423**（約53.14%→6.49%）。真のジオメトリが空間を占有していた証拠であり、画面が無くなった=都市美術合格とはしない。

**CX小追補**：この真のGPU根拠に基づくCI画像再発防止を既存 capture に追加。正規 pinchswitch t1700 のPRIVATE source-ID RGB(255,0,255)画素割合が同ROIで18%以上ならFAIL（旧53%、新6.49%）。保存済み `cxOpenVisibility` はART得点ではなく、未来の大きな近景巨大壁の回帰防止。新ワークフローは作らず既存CIを再利用。数値以外の総合景観は前方遠景の箱状反復や開放型広場の単調さが残り、**ART HOLD/CITY HERO REJECT、HUMAN/READY/PUBLISH/MERGE HOLD、正式Slope2 0m**。

**次G4E-7CYの基準**：今回新しい建築の物量追加は見送る。必要な都市造形主役/奥行/走路誘導を一体で設計し、本物の2道路15/17s画像で確かめる。視界保護の画面占有ゲートを維持しつつ、大都市景観の構成を改善する。B48道路7/B51-C障害物28/gap52/正規240Hz・自然ジャンプ・カメラ・速度・入力、main/Gold/本番/原作とDraft PR#46は保護。

# G4E-7CX — 高速走行時の近景建築視界遮蔽を一般規則で防ぐ（2026-10-26 JST、専用CI未検証）

**全体方針**：前CWで視覚上の青緑ベタ板や日本語HUDは改善した一方、ゲームの本質は112m/s前後の実走時に次の道路を読めること。真正pinch-switch/t1700では左岸巨大街区が画面左半分近くを遮る。GPU source-ID (CR以降、station2/u=.62/side=-1 の roadbank-inhabited) はこの巨大な近距離面と一致、CPUトレースでも15/15候補の大半を占めた。これは物理障害物ではなく描画専用巨大街区だが、道路進路予測を妨げる。

**仮説**：カメラから離れた街区中心距離・コーナーだけで遮蔽を測る旧 `cameraCellIntrusion` は、細長い占有棟の一部がカメラ近傍に飛び込む時に過小評価する。CXでは各街区の既存の occupied 実メッシュを一時生成し、正規BG240Hzの15s・17sショットに投影。画面中央走行視界用15×10の格子で、125m以内に見える実三角形の覆域19サンプル以上なら従来と同じ低層 `authorPromenade` に切替。各セルの候補スコアと救済判定をJSON互換の `cxNearVisionQA` に記録。新しい図形・衝突物・道路はなし。形状を大きく弱める判断は機械的な画面覆域と既知GPU帰属に基づき、場当たり的な station2 例外ではない。

**検証条件**：`pinch-switch` t1700で問題の巨大建築が消え、正規15sでも道路先読みが悪化しないことを同一BG240Hz真正WebGLで目視。`true-pinch`の3枚のC.glass青緑壁の再発0画素、pinch-switchの通常居住都市が無意味に全消失しないこと、元B48道路7・B51-C障害物28・gap52・カメラと入力・速度・自然ジャンプは完全不変。専用CI既存ワークフローを再利用、12基準＋2CR+3CT＝17画像/6対を維持。人体操作・正式ARTの合格には使わない。ART/HUMAN/READY/PUBLISH/MERGE HOLD・Slope2認定0m・Draft PR #46未マージ・main/Gold/原作/本番保護。

# G4E-7CW — 実WebGL17枚・日本語HUD修復・支持材/屋根局所改善（2026-10-26 JST、最新確定）

専用CI [#40309248652](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40309248652) は **completed/SUCCESS**、実装HEAD [9d173db](https://github.com/ryomashibaba/dopagaki-development-hub/commit/9d173db4ce6f7ecf6fd69104132aee6c47911946)。**8/8 tests PASS、PRIVATE build PASS、正規BG240Hzの元ゲームWebGL17枚（12基準+CR2+CT3）/同一カメラ6対/warnings0**。[Artifact #12644191731](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40309248652/artifacts/12644191731)は2026-11-02 10:46:17 UTCまで。非人間固定スクリプト撮影、人間試走ではない。

**目視評価**：前CUはheadless-only Chromiumに日本語フォントがなくHUDが□表示だった。CWはfonts-ipafont-gothicだけ選択的追加し、真正15s/17s PNGで日本語が正常に描画されることを確認。巨大に映った白色斜柱2本を幅3.5m→1.6mの鋼色支持材にし、屋根2枚を20/19m→14/13mに短縮。左岸の視界と支持材の巨柱感は局所改善したが、近景都市の平板さ、暗い屋根の存在感、遠景の箱状物量感、ステージ面白さ・障害物の弱さなどの根幹課題は未達。

**正規17sのGPU識別色ROI（33,750画素）**：transit屋根/柱はCT 10,483→CU 4,825→CW 3,084画素、CWのfloor床4,152画素、左岸civic-concourse 536画素。既知青緑ベタ板RGB(41,135,163)はCWでも0画素。これらは画面上の占有範囲の測定であり、美術スコアではない。**総合ART HOLD / CITY HERO REJECT、HUMAN/READY/PUBLISH/MERGE HOLD、正式Slope2認定0m**。

**次G4E-7CX**：同じstation2の微細な寸法修正を無限に続けない。正規15/17sを含む6画角で近・中・遠景の建築のつながり、道路視認性、直方体状遠景、障害物とステージの面白さを再審査し、質の突破に直結する1仮説を優先実装する。変更は真正WebGLの新旧実画像で検証。B48道路7、B51-C動体28、gap52、240Hz物理/操舵/カメラ/自然ジャンプ、main/Gold/公開2サイト/原作とDraft PR #46未マージ保護。不要なワークフロー増殖とCI fanout回避。

# G4E-7CW — 真正CU美術審査から支持材/屋根比率と日本語描画を局所修正（2026-10-26 JST、CV CI成功→CW実画面待ち）

[CV専用CI #40307776332](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40307776332) は **SUCCESS**、8/8テスト、PRIVATEビルドPASS、正規BG240Hzの元ゲームWebGL **17画像（12基準+CR2+CT3）・6対、警告0**。[Artifact #12643920062](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40307776332/artifacts/12643920062)（2026-11-02 10:34:52 UTCまで）。18分タイムアウト原因だった `playwright install --with-deps` をheadless-onlyへ変更したことで撮影に成功。true-pinch17s ROIの既知青緑RGBは再発せず0。描画元識別はfloor 4,115画素/33,750（旧CT6,608）、transit 4,825（旧CT10,483）、left-concourse 487（旧CT351）。減少したのは識別対象の表示領域であり、美術合格ではない。

**本物の15s/17s画像を視覚審査**：6反復柱は消え左岸空間が開いたが、CUの白く太い2本の斜支柱は新たな単調な巨柱に見え、2枚の屋根も遠近投影では広い水平板に見える。さらに `--only-shell` CIではPlaywrightの全OS依存導入で提供されていた日本語フォントが無いため、HUDや警告の日本語が豆腐（□）に化けている。ART HOLD、現在のCUを美術PASSにしない。物理・カメラの不合格ではない。

**CW局所修正**：station2/u=.62/side=-1 の2屋根を横方向14m/13m程度へ短縮し、両者の投影ギャップを拡大。2本の斜め支持材を幅3.5m・C.pearl→幅1.6m・C.steelとし、支える構造を保ちながら白い塊を抑える。別道路、同駅以外、civic-concourse、物理・操舵・カメラ不変更。CIでは前工程と同じheadless-only Chromiumに、**fonts-ipafont-gothicだけを選択的追加**して日本語HUDの文字化けを予防。以前の巨大apt `--with-deps` には戻さない。真正15s/17sの新旧画像と日本語表示確認までは品質未判定。ART/HUMAN/READY/PUBLISH/MERGE HOLD、正式Slope2認定0m、Draft PR #46未マージ、main/Gold/本番/原作保護。

# G4E-7CV — CU検証の18分タイムアウト対策（2026-10-26 JST、CI結果待ち）

CU [専用CI #40304256841](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40304256841) は **CANCELLED**（開始2026-10-26 10:02 UTC、取消10:20 UTC）。7? ではなくG4E-7CUの単体テスト工程は成功、しかしPRIVATEビルド工程の末尾で `npx playwright install --with-deps chromium` によるUbuntu全体のフォント/GUI依存パッケージをaptで取得中に18分上限でキャンセル。ゲーム描画・美術のFAILではない。CUの実WebGLスクリーンショットは一切生成されず、Artifactなし。美術改善は未検証。

CVは **CI準備だけ**修正。Ubuntu-24.04 GitHub標準runner上でPlaywright 1.56のヘッドレス撮影に必要なChromiumシェルを `npx playwright install --only-shell chromium` で取得。aptによる全OSパッケージの導入を省き、依存不足で起動が失敗した場合はその実ログから不足ライブラリだけ追加する（未確認のまま成功を宣言しない）。実ゲーム・景観・240Hzカメラ・B48×7/B51-C×28/gap52・プレイヤー入力は不変更。テストと12基準+2CR+3CT=17PNG、6対同一カメラ比較は変えない。ワークフローの画像名を実態に合わせて更新。

**状態**：CUの大床/6支柱→2広場+2斜支持案は候補のまま。CV CIで実17s/15s真正WebGLを確認してからART採否を決める。ART/HUMAN/READY/PUBLISH/MERGE HOLD、正式Slope2認定0m、Draft PR #46未マージ、main/Gold/原作/本番保護。不要な追加WF・多重pushはしない。

# G4E-7CU — CT GPU実証に基づく第3ステーション左岸だけの公共広場改良（2026-10-26 JST、検証待ち）

直前CT [専用CI #40302982954](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40302982954) は completed/SUCCESS、7 tests PASS・FAIL0、PRIVATEビルドPASS、正規BG240Hz元ゲームWebGL**12コア+CR2+CT3=17枚**、warning0。[Artifact #12641322389](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40302982954/artifacts/12641322389)（2026-11-02 09:57:51 UTCまで）。真の17秒GPU独立識別色比較：roadbank station2/u=.62/side=-1 の promenade-floor=6,608画素/ROI33,750(19.5793%)、promenade-transit=10,483画素(31.0607%)、civic-concourse-left=351画素(1.04%)。数値は色IDが反映された面積であり美術点数ではない。真正画像目視で**巨大平床はpromenade-floor、長い屋根と6本の反復支柱はpromenade-transit**と一致。左岸全体のcivic-concourseは主原因ではなく不変更が適切。

G4E-7CU はこの確証を根拠に**この1街区だけ**の60×28m大平板を、段差をもつ2つの小公共広場＋細い連絡部へ変更。6本の垂直反復支持材・薄い長大屋根を、2つの非対称な折れ屋根＋各1基の厚い斜め支持構造へ置換。ほかのpromenade、pinch-switch居住街区、civic-concourse、折れ屋根遠景、主役建築は不変更。スクリーンショット診断17枚と元CIを再使用し、真の17秒と15秒画角で別の大きい遮蔽物が出ないことを見て採否決定する。自動テストとCI成功だけでART合格としない。

**全ゲート** ART/HUMAN/READY/PUBLISH/MERGE HOLD、正式Slope2 0m。B48実道路7・B51-C動体28・gap52・正規物理240Hz・速度/操舵/カメラ/自然ジャンプ不変更。main/Gold/本番・原作再現不変更、Draft PR #46未マージ。新CI追加禁止、既存専用CI再利用。次はCI結果と真正PNG目視が最優先。

# G4E-7CT — 左岸残存暗色デッキの生成元を3分割してPRIVATE GPU検証（2026-10-26 JST、検証待ち）

直前のG4E-7CSは専用CI [#40298652277](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40298652277) completed/SUCCESS、6/6単体テスト、PRIVATE真正WebGL12+2画像。true-pinchの正規17s左岸ROIでC.glass RGB(41,135,163)は10,720→0となり、問題の3枚の青緑パネル撤去を確証。ただし暗い広いデッキ面と反復支持材が残り、街区の見通し・規模感は未達。ART HOLD/REJECT継続。

**CTは新しい景観形状を追加・削除しない診断専用**。既存 provenance 内の station2/u=.62/side=-1 roadbank-promenade を floor(4 triangles) と transit(canopies+grounded supports, 84 triangles) に分け、既存 civic-concourse の左岸側を第3候補とする。元のメッシュ、物理、色、カメラ、道路構造は通常描画では完全に同じ。true-pinch/t1700に3枚のPRIVATE色識別画像を既存WebGL CIへ追加し、同一カメラ/同一時刻の統合元画像とのROI差分と三角形数を監査する。撮影後は実画面で暗い面・支柱との対応を目視し、帰属が明白な面のみ次の小規模景観修正候補とする。単なるRGB差分はART合格証明ではない。既存12基準+2 CR source-ID、6比較ペアを維持。専用CIは既存G4E-7CIワークフローを再利用し増殖なし。

**安全**：B48×7/B51-C×28/cell52/正規240Hz、速度・操舵・相対カメラ・自然ジャンプ変更なし。ART/HUMAN/READY/PUBLISH/MERGE HOLD、正式Slope2認定0m、Draft PR #46はマージ禁止。main/Gold/本番/原作再現保護。次工程での恒久造形採否は真正WebGL画像と局所性評価で決める。

# G4E-7CS 実WebGL完成検証／ART HOLD（2026-10-26 JST、最新確定）

**正本は Draft PR #46、景観修正 [c39d04d](https://github.com/ryomashibaba/dopagaki-development-hub/commit/c39d04d1c26f0fe907ea4472a412015113286a73)。** [専用CI #40298652277](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40298652277) は **completed / SUCCESS**、6 tests PASS・0 FAIL、PRIVATEビルドPASS、元ゲームWebGL画像 **12枚+識別色2枚、6組の正規BG240Hz固定カメラ**。警告0。[Artifact #12640073134](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40298652277/artifacts/12640073134) は2026-11-02 09:36:50 UTCまで。前工程でQUEUE/PENDINGと書かれた内容は当時の履歴。最新のCS実測を優先。

**GPU実描画で特定済みの3枚の青緑板を局所修正した結果**：true-pinch 17s画面左ROI x190..439, y205..339 の C.glass の正確RGB(41,135,163)は **10,720→0画素**。原因は station=2/u=.62/side=-1 の roadbank-promenade の不透明ガラス面3枚。ほかの建築や色を大量追加していない。

**CR→CSの実PNG RGB差分**（画像解像度1008×645、1チャネルでも違えば変更画素）：true-pinch 15s **483画素(0.074%)**、17s **13,797画素(2.122%)**、18.5s **0画素**。pinch-switch は15s/17s/18.5s全て **0画素**で同一。この数値は美術点数でなく変更局所性のみ。真正17s画像を直接目視すると板は消えたが、左側には大きな暗いデッキと繰り返し支持材が残り、近・中・遠景の街区連結感と都市規模感はまだ不十分。**ART HOLD / CITY HERO REJECT、HUMAN/READY/PUBLISH/MERGE HOLD、正式Slope2認定0m**。18.5sはphysicalRoad=offなので通常走行審査対象外。

**次G4E-7CT**：残る暗い左岸デッキ・支持材について真正15/17s画角と既存の三角形生成元タグを対応づけ、元凶を特定した面のみ変更。推測で別のデッキ・屋根を削らない。無目的な素材追加・CI増殖・繰り返しpushを避ける。B48実道路7、B51-C動体28、gap52、240Hz、速度、操舵、カメラ、自然ジャンプ、main/Gold/本番と原作再現を保護し、Draft PR #46未マージ維持。

# G4E-7CS — GPU特定済み青緑壁の3面を局所修正（2026-10-26 JST、専用CI検証待ち）

G4E-7CR初回run [#40297532117](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40297532117) は最終 FAILURE。ただしテストとPRIVATEビルドはPASS、14枚の真正WebGL画像は [Artifact #12639535527](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40297532117/artifacts/12639535527) に保存済み。固定17秒で第3ステーション左岸の三角形だけマゼンタ表示すると、true-pinchで問題の**3枚の青緑壁が一致して着色**した。ROI変更率61.2119%（28三角形）、pinch-switch居住街区79.8874%（2380三角形）。これはGPU実描画での出所確証だが美術評価ではない。

初回CI FAILUREは**撮影データの mode キーが元のカメラ状態によって上書きされる既存の落とし穴**で、14画像を12基準+2診断として数えられなかったことによる。キャプチャ時の captureMode を別途保持して修正。実画像撮影そのものは成功。

CSでは、正規17秒のtrue-pinchに出ていた authorPromenade の station=2/u=.62/side=-1 の**3枚だけ**を開放し、道路沿いに高さ11mの短い接地3D支持材6本で屋根を支える。ほかのステーション、pinch-switch居住街区、B48×7、B51-C×28、void52、正規240Hzカメラ/物理、本番は不変更。旧CQ実PNGのROIにはC.glassのRGB(41,135,163)が10,720画素あったため、修正後は真正同画角で1,500画素以下を最低回帰条件とする。低下が数値で認められてもARTは画像の実目視評価までHOLD、HUMAN/READY/PUBLISH/MERGEもHOLD、Slope2正式認定0m。

# G4E-7CR — 第3ステーション左岸GPU識別色 A/B（2026-10-26 JST、検証待ち）

CQ [CI #40294635351](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40294635351) は **completed / SUCCESS**、4/4 tests PASS、真正WebGL基準12画像・6組を確認。旧CQ欄の QUEUED は時点情報であり現在の状態ではない。[Artifact #12639060181](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40294635351/artifacts/12639060181) は2026-11-02 08:57 UTCまで保持。実画像ではtrue-pinch 17s左岸に大きな青緑の矩形3枚、pinch-switchには別の居住街区が確認できた。幾何学候補は両方 station=2 / u=.62 / side=-1 に集中したが GPU最終帰属は **未確定**。

G4E-7CRはこの候補範囲の**頂点色だけを蛍光マゼンタにするPRIVATE固定240Hzカメラ診断**を追加。景観構造や物理を変更せず、既存12枚に17秒時点の識別色画像2枚を追加し、同フレーム同カメラで元のゲーム画像とのROI画素差をJSONに記録する。CIの実画像で壁の位置・形状とマゼンタ領域が一致するまで、恒久的な建築修正・ART合格は宣言しない。G4E-7CR専用チェックが実際に成功したか確認すること。ART/HUMAN/READY/PUBLISH/MERGE HOLD、正式Slope2認定0m、PR #46 Draft保留。main、Gold、本番、原作再現、B48×7/B51-C×28/gap52/240Hzは変更禁止。

# DOPAGAKI SLOPE — 新チャット継続入口（固定URL）

## G4E-7CQ — 実スクリーン画素→三角形出所の解析を追加（2026-10-26 JST、検証は QUEUED）

**コード [90acb053](https://github.com/ryomashibaba/dopagaki-development-hub/commit/90acb053580bd0a03ffafeeafdf4409f7a608083) で診断実装済みだが CI の結果/美術結果は未判定**。[専用CI #40294635351](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40294635351) queued、GitHub Actionsの同ブランチで多数のCIが同時発火し待ち行列を確認。PASSまたは実画像原因特定を宣言してはいけない。

**変更点**：真正PRIVATE BG 240Hzフレーム15s/17sのうち t1700 を用い、元WebGL2の頂点変換式・正規カメラを変えず、問題の画面 x220～380／y250～315 内15箇所について静的な景観三角形の射影・奥行とタグ（道路bank、公共通路、折屋根、アンカー建築）、元の三角形ID、色、3D座標を画面datasetと既存スクリーンショットJSONへ記録する読み取り専用CPU geometry candidate tracerを追加。元景観は三角形構成を含めて**一切変更していない**。ゲーム物理もカメラも無変更。CPU解析は街区メッシュ内の幾何候補でありGPUピッキングの証明ではない。他のオブジェクトによる遮蔽/fragment shading/antialias を検証するまでは原因と断定しない。単体テストに合成三角形の真ん中ヒットとオフスクリーンミス、生成元数え上げを追加。計測は既存のCIを使い追加専用ワークフローを作らない。

**次に必要な作業**：#40294635351 を確認し、失敗なら最小修正。成功なら実際の t1700 スクリーン画素と provenance 候補の色/3D位置/建築生成元を比較し、残存青緑壁の描画元を特定できた場合のみ該当する生成関数・三角形面を最小修正する。正式なART評価はWebGL旧新の画像を実際に確認してから。複数pushによるCI fanout問題を意識し、修正・テストを小さくまとめる。前工程 G4E-7CP のART HOLD/主役級REJECT、正式Slope2=0m、HUMAN/READY/PUBLISH/MERGE HOLD を継続。元B48×7、B51-C×28、gap52、240Hz、操舵、カメラ、main/Gold/本番と原作再現は保護。PR #46 Draft未マージ。


## G4E-7CP — 連続都市廊・非箱型屋根研究と現物WebGL反証（2026-10-26 JST）

**最終コード [826d355](https://github.com/ryomashibaba/dopagaki-development-hub/commit/826d3553e9147e049028f97e3d40c30a95e71127)、専用CI [#40293077968](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40293077968) SUCCESS、物理不変・形状の自動テスト3件PASS、PRIVATEビルドPASS。** 2道路×15秒/17秒/18.5秒×BASELINE/CP=12枚の**元ゲームWebGL2実画像**、6組の同一BG実240Hzカメラ比較あり。[最終PNG/JSON Artifacts #12637236643](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40293077968/artifacts/12637236643)。画像は非人間の固定スクリプト走行であり、ART PASSやHUMAN PASSを意味しない。18.5秒はBG physicalRoad=off、通常走行の画面とは区別。

**構築と真のQA反省**：初版 [afe978f](https://github.com/ryomashibaba/dopagaki-development-hub/commit/afe978f876a23c3ebf1e6bd4f973b57da6d204c7) で両岸の公共デッキを10区間接続し、稜線屋根10区間と建築背面の実開口を作成。初版CI [#40291431137](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40291431137) SUCCESSだったが、真の17秒画面に長い黒い屋根帯が被さり、前工程から視認性が悪化。2版 [bd05522](https://github.com/ryomashibaba/dopagaki-development-hub/commit/bd05522ee47738a1a46ac21c75668ab8441c4a7b) では連続屋根を短い部分屋根に分割、公共デッキを地表近くへ移し、CI [#40292302238](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40292302238) SUCCESS。3版 [826d355](https://github.com/ryomashibaba/dopagaki-development-hub/commit/826d3553e9147e049028f97e3d40c30a95e71127) では上下幅を広く占める屋根のカメラ投影を棄却、旧店舗の3枚の不透明な青緑のベタ面と推定した要素を撤去、実投影上6/10遠景屋根のみ採用。元の背景/物理は未変更。

**現物画像を目視した結果：ART HOLD / 主役景観REJECT（引き続き）**。上空の遮蔽帯は初版より減り、中央の物理道路は維持された。しかし真の17秒 true-pinch画像（およそ画面 x=190〜430, y=222〜323）に**3枚の大きな青緑色の平面がほぼ同じまま残存**する。CP3で削除した店舗パネルを出所と推定したのは誤り、原因は未特定。さらに数km級都市の奥行き・道路沿いの広域連続性と用途の読み取りも未達。**これ以上同一の見た目推測で部材を削るのは禁止**。次CQは **真正WebGL17秒の問題ピクセル位置を、出力メッシュ（発生関数/街区/三角形/色/3D位置）へ逆引きする診断**を最小限追加し、物理・カメラとスクリーンショットを不変のまま確定した箇所だけ修正する。画角比較は2道路×15/17秒を中心に、18.5秒 off-roadは分離評価。

**最終CIのBASELINE比較 RGB差和>48 の画素率**（美術点数ではない）：true-pinch 15s **13.1537%**／17s **19.8540%**／18.5s **20.7207%**、pinch-switch 15s **15.3012%**／17s **32.2714%**／18.5s **13.2880%**。CIは12枚/6ペア、warningsゼロ。描画メッシュの街区10連結、視覚専用遠景屋根6をログで確認。ART/HUMAN/READY/PUBLISH/MERGEは全HOLD、公式Slope2 **0m**。B48道路7、B51-C動体28、gap52、240Hz、カメラ、操舵、自然跳躍、A13方針変更なし。main/Gold/原作再現/本番サイト保護、PR #46 OPEN Draft未マージ。Work未使用。


## G4E-7CO — 旧CN巨大近景壁の遮蔽を修正、PRIVATEゲームWebGL12枚で美術HOLD判定（2026-10-26 JST）

**今回の実装と検証は完了。美術はなお ART HOLD / 最終採用不可。** コード [b9b1c44](https://github.com/ryomashibaba/dopagaki-development-hub/commit/b9b1c4452b6134b67bdea912f2c7d31734cbb6ec)、期待テスト文言修正 [0e560b6](https://github.com/ryomashibaba/dopagaki-development-hub/commit/0e560b660b302224715e53b90b0f34d0005c6530)。専用[CI #40289823039](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40289823039) SUCCESS、正規BC/B48/B51物理不変含む**3/3テストPASS**、PRIVATEビルドPASS、原ゲームWebGL2で2道路×3時点×旧新の**12枚**、6組の原BG240Hz同カメラ照合済み。[実画像/JSON Artifact #12635656344](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40289823039/artifacts/12635656344)（7日間保持）。初回CI #40289569552 の失敗はテスト期待文言の不一致（「CM requires…」対「CO requires…」）のみであり、期待文言修正後PASS。物理・本番コードには未影響。

**造形改善**：CNの手前で極端に大きかった無地青緑色の台形壁を抑制。近/中景の段状建築の高さを下げ、道路から奥へ設置。前面と道路側側面は実際に三角形が存在しない開口を持つ構造に変更し、平面テクスチャ窓だけで遮蔽を隠したのではない。15/17秒の両方の正規カメラに対する画面面積の危険判定で、視界を占有する近景は同じ道路沿いの低層・開放的な公共プロムナードに固定置換（人間プレイ中に切り替わらない）。実測：true-pinch **9街区フル維持/3低層化**、pinch-switch **10フル維持/2低層化**。主役2つは既存の物理路面0/1沿いの固定配置を維持。無意味な追加オブジェクトの大量増殖はしない。

| 変更RGB画素率・各旧ゲーム基準 | t15 | t17 | t18.5（BG physicalRoad=off） |
|---|---:|---:|---:|
| true-pinch CO vs BASELINE | 13.087% | 19.391% | 21.123% |
| pinch-switch CO vs BASELINE | 15.271% | 33.105% | 13.328% |
| true-pinch CO vs CN | 17.230% | 21.066% | 9.061% |
| pinch-switch CO vs CN | 16.749% | 20.921% | 6.436% |

CO/CN比較はArtifact同解像度の元ゲームPNGをRGB絶対差和48超で比較した画素比。**いずれも美術スコアではない。** 実画像を直接確認：CNより前景の巨大無地壁が目立たなくなり、クレセントなど主役建築や開口のある街区を読みやすい視点ができた。とはいえ17秒の道路左側には壁状の長い構造が残り、左街区と先の都市の連続性は弱い。空へ伸びる都市全体の稜線・遠景の層・数kmの規模感は不成立。18.5秒はそもそもBGのphysicalRoad offなので走行時と同一の美術比較をしない。**ART HOLD / CITY HERO REJECT**。人間操舵での視認性・公平性・完成品質は未認定。

次のCPは**見えている都市の建築関係と都市稜線の再構成**を優先。すでに改善した無地壁を再導入せず、過剰な箱/格子量産もしない。新しい素材巡回や無目的なテスト環境の増殖を避け、同じPRIVATE正規WebGL 12フレームで質を審査。元240Hz速度/操舵/カメラ/自然跳躍、B48道路7/B51-C動体28/gap52、A13規定、main/Gold/原作再現/本番サイト保護。正式Slope2=0m、PR#46 OPEN/Draft/未マージ。ART/HUMAN/READY/PUBLISH/MERGE全HOLD。Work未使用。

## G4E-7CN — 造形を持つ街区へ転換、真のPRIVATEゲーム画像12枚で再評価（2026-10-26 JST）

**コード [9d8f59e](https://github.com/ryomashibaba/dopagaki-development-hub/commit/9d8f59e05d56bf7735f63544fa9430ec88e0daf2) / [実ゲーム専用CI #40287595121](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40287595121) SUCCESS、テスト3 PASS・FAIL 0。** 2道路×3時点×BASELINE/CN=12枚の元ゲームCanvas WebGL2画像と6組の同一元BG240Hzカメラ比較を取得。[7日保持の真正画像とJSON artifact #12634718104](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40287595121/artifacts/12634718104)。元のB48道路7・B51-C動体28・gap52、速度・操舵・元カメラ・ジャンプを変更しない。

**実装変更**：CMで4基中2基のスコアが0～0.03／両時点視認0だったため、主役クレセント4基を2基へ絞り、15s/17sの実カメラの少なくとも片方で粗い全体投影が視認可能な候補だけ配置。12街区の近景では旧薄柱・細い浮梁を減らし、開口した店舗と屋根、二翼の段状建築、公共通路、階層のある厚みへ修正。**テストの投影スコアは美術合格基準ではない。** 残る2基はtrue-pinchで実投影score 1.160233（2視点）, 0.5（1視点）；pinch-switchで1.032176（2視点）, 0.5（1視点）。評価はスクリプト走行の固定視点であり人間の走行試験ではない。

**真正Canvas画像の定量情報（ベースラインからのRGB差＞48の画素割合、画質評価ではない）**：

| 視点 | 15s | 17s | 18.5s（原物理 off-road） |
|---|---:|---:|---:|
| true-pinch CN / baseline | 22.936% | 29.788% | 18.500% |
| pinch-switch CN / baseline | 22.975% | 35.606% | 10.670% |
| true-pinch CN / CM | 22.031% | 26.576% | 6.744% |
| pinch-switch CN / CM | 19.853% | 29.692% | 2.906% |

**実画像目視美術評価：ART HOLD / 主役級REJECTを維持。** 薄柱・空中梁の反復は相対的に減り、段状の建築質量が見える。ただし15～17sでは近景に大きく切れた無地の青緑ファサード/斜面壁が増えた。街区の規模・開口・用途の読み取りは十分でなく、遠景まで続く超未来都市の統一景観・数km級の印象は未達。数値の変更率や箱を厚くしただけでは合格ではない。18.5sの physicalRoad=off では従前同様景観が画面上方へ寄り、通常走行画面と分離評価する。**次COはサイズや個数の追加でなく、実カメラの近景巨大遮蔽を弱め、遠景と建物内の都市生活スケール・稜線を明瞭化し、2方向の15/17s実画像を美術採点する。** 旧初案の箱・新案の無地壁・無意味な細部増殖の反復は禁止。CIは成功したがART/HUMAN/PUBLISH/READY/MERGEは全HOLD、正式Slope2 0m、PR #46 Draft未マージ、保護本番・原作・Gold・main不変更、Work未使用。

## G4E-7CM — 実240Hz 15/17秒カメラ逆算・固定景観候補（2026-10-26 JST、検証待ち）

**実装は存在するが、専用CIと美術審査は未完了。** ブランチ上のコードコミット [1f432c9](https://github.com/ryomashibaba/dopagaki-development-hub/commit/1f432c9bc66714f6cc3869b90f4ff35f72a25922) で、G4E-7CI/CL既存16街区・主役4建築の配置を見直した。主役の高さと奥行を減らし、近景の単調な階数反復と中景箱塔の密度を軽減。主役4基は「15秒撮影用と17秒撮影用に別々の世界を作る」のではなく、**同じ既存物理B48道路0/1上で両方の実BG240Hzカメラの画角を評価してから固定配置**する。render関数・物理・カメラ・A13・入力・障害物は変更していない。テストは正規BG両時刻と位置スコアの記録を追加。3テストと真正WebGL旧新6対12枚の [CI #40285116236](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40285116236) は記録時 **QUEUED（未PASS）**。

**残るリスク：** 位置スコアは投影の工学的近似であり、美術的な巨大都市/用途/奥行きは証明しない。初期の近景セルは主に道路2沿いのままで、主役の選定候補には既存道路1/2も含む。街区連続性と物理道路との自然な関係、投影した主役の上端、15/17秒の視界と18.5秒 off-roadを、実画素の目視で必ず検証。CIで最低1基も見えない・部分欠け・単調な近景が残る場合は **ART HOLD/REJECT継続、配置を修正する**。原作再現/main/Gold/本番未変更、Draft PR #46未マージ、正式Slope2認定0m、ART/HUMAN/PUBLISH/READY/MERGE HOLD。Work未使用。

## G4E-7CL — 完成した二度目の真正実ゲームWebGL、美術HOLD/REJECT確定（2026-10-26 JST）

**CL第2案の専用CI [#40282742498](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40282742498) SUCCESS**。原本BC B48道路7/B51-C動体28/gap52、正規240Hz BGスクリプトカメラの同一視点でBASELINE対第2案の12枚の**真正ゲームWebGL画像**取得、3テストPASS。[実PNG/JSON Artifact #12632568264](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40282742498/artifacts/12632568264)。初案との写真ピクセル変化は約2.9～9.1%に留まり、近景・中景の箱状都市感は抜本解決しない。新しい曲面の主役クレセントも画面上方に大部分が切れ、18.5秒のBG physicalRoad=offの空虚さも続く。**人間の実走行の美術PASSではない。CL第2案もART HOLD/主役級不採用**。物理・カメラ変更なし。次CMは建物の再大量配置ではなく、実240Hzのカメラ**画角内に収まる主役建築の位置と都市の連続景観**を最初に再設計する。3本目の道路やoff-road視点の誤判定を防ぎ、明確な都市品質を比較。main/Gold/原作/B48/B51/本番2サイト保護、PR#46 OPEN/Draft/未マージ、正式Slope2 0m、ART/HUMAN/READY/PUBLISH/MERGE HOLD。詳細[CI/CL 実画面検証文書](docs/G4E7CI_INTEGRATED_GAME_VSLICE_QA_JA.md)。Work未使用。


## G4E-7CL — 実ゲーム12画像で初案美術REJECT→主役級公共建築の第2案（2026-10-26 JST）

[専用CI #40237934943](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40237934943) はSUCCESS。実ゲームCanvasにて既存B48道路7/B51-C動体28/gap52/240Hz固有カメラ6姿勢の旧新12枚・6ペアPNG差分を真正取得。画素変化率9〜30%でも新都市の美術品質は不十分。15/17秒では箱塔と細柱の反復、18.5秒ではBG物理road=offで道路/街区が画面上部へ移り暗い空間が大きい。初案は**ART HOLD/REJECT**。こちらは実プレイでなくスクリプトカメラである。

今回の第2案では路肩の近景階数を変化、同質の中景塔を間引く、遠景のフレーム反復を低減し、厚い湾曲外殻と開口・広場・支持を持つ大規模な公共建築クレセント4基をPRIVATEだけで制作。[G4E-7CI/CLレポート](docs/G4E7CI_INTEGRATED_GAME_VSLICE_QA_JA.md)。実画面の美術審査は次のCIまで未実施。既存240Hz/カメラ/操舵/自然跳躍/速度、main/Gold/原作サイト/本番2サイト維持、PR #46 Draft未マージ、公式Slope2=0m、ART/HUMAN/READY/PUBLISH/MERGE HOLD、Work未使用。

## G4E-7CK — PRIVATE実WebGLのCI起動障害を実測から修正（2026-10-26 JST）

実計測 [G4E-7CI/CJ CI #40237327203](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40237327203) で物理/生成景観テスト3件PASS。一方、`package-lock.json`なしのリポジトリに`npm ci`を使用したEUSAGEでPRIVATEビルドを開始できず画像はゼロ。G4E-7CKで専用CIの依存導入を`npm install --no-save --no-package-lock --no-audit --no-fund`に置き換える**最小修理**を適用。修正後CIによる実ゲームCanvasの画像12枚・6画素ペアが出るまでART/HUMAN/READY/PUBLISH/MERGE全HOLD。既存240Hz/B48×7/B51-C×28/gap52/元カメラ・操舵・自然ジャンプ、A13、main/Gold/原作サイト/本番2サイト未変更。PR #46 OPEN/Draft/未マージ、正式Slope2 0m。Work未使用。詳細：[G4E-7CK CI root cause](docs/G4E7CI_INTEGRATED_GAME_VSLICE_QA_JA.md)。

## G4E-7CJ — 実ゲーム画像の同一カメラ保証＋6画面ペアの実画素計測（2026-10-26 JST）

G4E-7CIのTRUE GAME WebGL CI #40236394164がqueuedで未実行、画像は未取得。このまま美術採用へ進まない。GH Actionsは確認時点で34件queued・4件in_progress、混雑による証拠取得遅れを別途記録。12枚のBASELINE/新案を撮影するとき、**撮影時刻・BG240Hz由来の速度・道路・カメラフレームID・Canvas寸法が同一**であることを自動照合し、**元ゲームCanvas PNGの6ペアそれぞれで実画素差分・道路中央領域の変化率**を追加計測する。小さすぎる/道路中心を覆う視覚変化は警告。検査のTECH成功や変更画素率を美術PASSと混同しない。元物理240Hz/B48×7/B51-C×28/gap52/速度・操舵・自然ジャンプ・カメラ、A13、main/Gold/原作・本番2サイトを変更せず、PR#46 OPEN Draft/未マージ、公式Slope2=0m、ART/HUMAN/PUBLISH/READY/MERGE HOLD。参照：[G4E7CIとCJのレビュー手順](docs/G4E7CI_INTEGRATED_GAME_VSLICE_QA_JA.md)。Work未使用。

## G4E-7CI — B48真正ゲーム画面に初めて近・中・遠の連続都市をPRIVATE実装（2026-10-26 JST）

**実装済み/審査待ち**。独立3Dの原本探し→本物のゲームWebGLへ移行。新しい`web/p101-w9c2-g4e7ci-integrated-streetscape.mjs`では実BC road2に近景開口店舗/公共庇、中景の段丘状住居・空いた翼間、遠景の非対称稜線を連続配置。B48×7・B51-C×28・gap52・240Hz/操舵/自然ジャンプ/元カメラを凍結し、PRIVATEのみ `g4e7ci=streetscape`。元BG 240Hzの6点×BASELINE/新案を**本物のゲームCanvas WebGL**で同条件比較するCIを実装。**CI実行前にART合格は出さない**。写真/外部3D著作権の導入なし。デフォルトOFF、main/Gold/原作再現/本番2サイト不変更。PR #46 OPEN/Draft/未マージ、正式Slope2 0m、ART/HUMAN/READY/PUBLISH/MERGE HOLD、Work未使用。 [手法・QA](docs/G4E7CI_INTEGRATED_GAME_VSLICE_QA_JA.md)。


## G4E-7CH — 原本街路GLB真正12WebGL画像によるSILHOUETTE審査（2026-10-26 JST）

**技術：PASS / 対象単独街路の主役級ゲームシルエット：HOLD（この2配置では不合格）/ 本番ゲーム画質：未検証。** [専用CI #40234897063](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40234897063) SUCCESS。真正上流8,040,396byte／Git blob SHA 92e2ed214034c9cd7bed5248991924d3af9a6d24を照合したうえで、MeshoptDecoderを使いglTFから**192描画メッシュ**を読込。元BGの真240Hz起点から得た6つの脚本カメラ×100m/240mの2提案配置の12枚の真正Chromium WebGL2画像と画素JSONを保存。[7日保持の画像とJSON](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40234897063/artifacts/12614657186)。原本SHA256 f59104c101642527b0e15db64820c4584f41e465b1fa019ee8a52b520de1c660。原モデル・元テクスチャはDOPAGAKI GitHubに保存せず、独立無地材質のみ。

- 実WebGL **ピクセル差分**：100m 6視点0.01082〜0.35086（中央値**2.8035%**）、240m 0.00628〜0.03905（中央値**1.064%**）。100mのtrue-pinch18.5sで17.774%、pinch-switch18.5sで35.086%。元G4E-7CGの200m中央値1.4305%から画角上の改善例が存在。ただし**距離・モデル・画角をそろえた公平な美術品質比較ではない**。また15sでは両配置とも約1%以下で、視界での存在感は強く変動。
- 12枚を目視：**二列の角張った高層/住宅ブロック、真正都市として連続した近中遠景・道路接続・看板/店舗・生活感はこの元材質なしの画角では成立していない。** 100mで大きく映る最終18.5sは屋根/壁の広面積が支配的で、旧G4E-7CG同様、画素面積を美術合格と誤認できない。**このモデル1件をその2仮配置で主役級の未来都市へ昇格させる案はSILHOUETTE HOLD/REJECT**。ただし素材から外された実PBRやNeon Zenith全都市レンダリングの美術品質まで否定しない。
- **品質・効率の方針転換**：単体GLBの探し直しで工程を費やし続けない。成功事例の本質は**元作者造形の近景街路＋適切な中景ファサード＋遠景の変化に富んだ都市質量＋照明・霧・道路方向の統合**。この方法を現在のDOPAGAKI本来のB48道路／カメラへART-FIRSTで合わせて評価する。プロシージャルでも「単純箱を大量複製して街に見せかける」方式だけ禁止、技法そのものを禁止しない。G4E-7CIでは最初から真正ゲーム画面の一つの短い垂直スライスの美術目標・権利経路・独立QAを具体化。適切な素材権利を解決する前のゲーム統合・公開は禁止。
- **保護**：B48×7/B51-C×28/gap52/240Hz、速度/操舵/自然ジャンプ/元カメラ、A13 40%・細道10〜16m、main/Gold/原作Slope再現/本番2サイト不変更。正式Slope2 0m、ART/HUMAN/PUBLISH/READY/MERGE HOLD。PR #46 OPEN/Draft未マージ、Work未使用。[検証詳細](docs/G4E7CH_NEON_DISTRICT_STREET_QA_JA.md)。

## G4E-7CG — 12真正WebGL画素を目視審査：主役都市としてのシルエット不合格（2026-10-25 JST）

**[専用CI #40198872340](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40198872340) SUCCESS。** 前工程の正規配布原本Market_Day.glb（同じSHA256）を一時取得し、全元テクスチャと元マテリアルを描画前に独立無地材質へ置き換えて、**本物のChromium WebGL2ラスタ**で12視点のスクリーンショットと画素差分を作成。G4E-7BGの本物の240Hz物理起点から得た2種×3時点=6カメラ姿勢、設置距離200mと320m。**これは本ゲームの道路・HUD・障害物・元PBRを含まない独立WebGLであり「実ゲームで画質向上」とは言わない。** [7日間の12枚画像とJSON artifact](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40198872340/artifacts/12601685349)。

- 元glTFメッシュ数13、WebGL描画メッシュ46（異なる集計対象）。いずれも真正GLBによるデータ。色が変わった**WebGL実画素比率**：200m 6視点で最小0.678%／中央値**1.4305%**／最大6.192%、320mは最小0.452%／中央値**0.739%**／最大1.791%。これらは「表示時と非表示時でRGB差があるピクセル」、面積/美術点数や遮蔽率そのものではない。先のCBのAABB横幅35.08%が本物の投影ピクセル占有を全く代表しない失敗を**定量的に再確認**できた。
- 12枚の実画像を目視：近い200mの終盤18.5sでも、**孤立した水平住宅状の長い箱/台座と大きな空虚な背景**に見える。320mの早期時点では遥か遠くの小塊。交通・住居・近中遠景の巨大SF街路景観を構成できていない。**「この単一資産をこの2配置で主役級遠景都市にする」方向はSILHOUETTE REJECT。** ただし元PBRや都市への立体配置は表示していないため、原作者のモデル全体を低品質と断定しない。
- よって**このモデルに追加のTextures.com権利精査・PBRレンダリング・ゲーム統合のコストを現段階ではかけない**。過去のBX/BY/BZ/CA小修正・箱増築/大量配置へ戻らない。新たな品質基準：「正式ゲーム内で見せるための都市の大質量・通り・遠近が、まず権利安全な真正WebGL画素で成立する」こと。次工程G4E-7CHでは登録不要で**形状そのものが巨大な未来都市として成立する完成建築**を1件に絞り、早期に本物の画素と道路方向を検証する。定量AABBゲートだけで合格させない。
- Spectra原本のCC0にはTextures.com由来画像の権利例外があり、**ゲームやGitHubへの元素材再配布は依然HOLD**。ART（実ゲーム）・HUMAN・PUBLISH・READY・MERGEいずれもHOLD。正式Slope2=0m。240Hz/B48実道路7/B51-C実動体28/gap52/高速操舵・自然ジャンプ/元カメラ/A13/main・Gold・原作Slope・本番2サイト不変更。PR #46 Draft未マージ。Work未使用。

## G4E-7CF — **正規無登録GLB取得・実物技術検査PASS、画面美術は未合格**（2026-10-25 JST）

**CI [#40197574426](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40197574426) SUCCESS。** GitHub公式Spectra Cities/SourceCityToolkit_glb のMarket_Day.glbを、コミット固定URLで一時ダウンロードし、17,786,532バイトと上流Git blob SHA ee3334d9f13f63e38a1f813eee8eb9e7c720b4e1 が完全一致した。GLB原本SHA256 **6137dfaf678785a2f4e4226d0cddc3032086f68a99e2c2793491058d64291c57**。実GLB 13 mesh。元G4E-7BGの正規240Hz/B48道路7・B51-C動体28/gap52の6カメラを使用した既存CB投影検査に5仮配置すべてが完走した。**今度こそ実ファイルに基づく技術測定。** ただしGLB原本自体は本リポジトリ/CI公開成果物に保存していない。監査数値JSONは[短期Artifact](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40197574426/artifacts/12600598103)（7日保持）。

- 距離200m（左 -0.65）で6カメラ中最大フレーム横幅35.08%、320m（左 -0.55）18.50%、450m（左 -0.55）12.34%、660m（左 -0.55）8.26%、320m（右 +0.70）18.50%。**最大値であり平均値やレンダリングされた実画素ではない**。200mでもAABB外接画面面積が小さすぎる警告、近配置で道路中央の視界干渉警告があり、特に遠方では過去の小シルエット問題が残る。つまり「配布原本の実在・GLB読込・投影 TECH PASS」であり「巨大未来都市として美術合格」とは全く言えない。
- 上流はCC0を主張するが、**textures.com由来の画像には著作権/再配布例外**がある。実3Dに含まれる第三者テクスチャの権利は独立確認できていないため、主役素材のゲーム統合・再配布は**権利HOLD**。最終IP・PBR・視認性・WebGL真正ゲーム描画・人間試走はいずれも未審査。**ART NOT TESTED / WEBGL NOT TESTED / HUMAN HOLD / PUBLISH READY MERGE HOLD、正式Slope2認定0m。**
- これは「アカウントを増やしたくない」というユーザーの条件を満たす、実際の無登録オリジナルGLB調達ルートの実証。ただし完成ゲームの画質は**未改善**。低品質の箱・遠景素材を大量に増やさず、次のG4E-7CGでは実際のスクリーンショットと、ライセンス問題のない主役級モデルに絞り込む。既存240Hz/B48×7/B51-C×28/gap52/高操舵/自然ジャンプ/カメラ・A13/main/Gold/原作Slope・本番2サイト不変更。PR #46 Draft未マージ。Work未使用。[詳細監査と数値](docs/G4E7CF_SPECTRA_CAMERA_SOURCE_AUDIT_JA.md)へ。

## G4E-7CE — 無登録で取得可能な実作者未来都市モデルを確認（2026-10-25 JST）

**確認済み：新規Epic/Sketchfab登録をせず作者正規配布元から無料のGLB入りZIPに進める導線を発見。ただしZIP実バイナリはこの環境の外部DNS不通により取得できていない。SOURCE-LISTING PASS（無登録候補発見）／ORIGINAL GLB 0／SHA UNKNOWN／NATIVE SIX-CAMERA NOT RUN／TRUE WEBGL NOT RUN／ART/HUMAN/PUBLISH/READY/MERGE HOLD。** 詳細とソース・失敗リスク・次の1回の原本QAは [G4E-7CE無登録建築原本・美術事前審査](docs/G4E7CE_NO_ACCOUNT_FUTURE_CITY_ARTIST_SOURCE_SCREEN_JA.md)。

- **有力な実物検証候補**：作者Dreamloft3D [Tron Gothic City](https://dreamloft3d.itch.io/tron-gothic-city)。作者は、かつてSketchfabで公開したモデルを自分のitch.ioに移したと説明。無料購入画面に **「No thanks, just take me to the downloads」** が存在。CC BY 4.0表示、ZIP6.6MB、GLB/BLEND/FBX/OBJとPBRテクスチャの掲載情報、作者制作の公開画像は確認したが**真正バイナリの実取得・権利完全検査・ゲーム画面美術PASSではない**。Tron由来の意匠が第三者IPを侵害しないことは不明、低い高速カメラでは暗い大壁面が目立つ可能性が高く、**まだ採用禁止**。tomato3元Sketchfab候補は参照として残し、登録を要求しない。
- **低適合を除外**：NVIDIA ORCA Amazon Lumberyard BistroはCC BY 4.0・実街路の高品質参照だが現代街かつ外装約283万三角形で重量が大きい。GrandWhis Neon Frontは無登録・104MB/153万三角形だがAI補助制作・平坦建築で主役級には不適。JadeRealms H-14は単なる単体回廊。数と出典の良さだけでART承認せず、BX/BY/BZ/CAの箱や薄板の大量生成に戻らない。
- **G4E-7CFの前提**：無登録6.6MB公式ZIPを適法取得できた場合のみ、原本/作者/license/テクスチャ/第三者IP/SHA256→真正BG 240Hz6視点への複数仮配置→**本物のPRIVATE WebGL画像**→人間の美術審査。元ゲームのB48×7/B51-C×28/gap52/240Hz、速度/操舵/自然ジャンプ/カメラ、A13のSlope2方針、main/Gold/原作Slope/本番2サイト、PR #46 OPEN Draftを保護。正式Slope2認定0m。新規ゲーム実装・巨大Blender/CI・マージ・公開なし。Work未使用。


## G4E-7CD — 正規建築原本の取得経路再確認・高品質代替スクリーニング（2026-10-25 JST）

**結果：SOURCE ACCESS RECHECK 完了、真正の新規都市GLB 0件・テクスチャ/著作権完全確認0件・ゲームWebGL新規映像0件・ART NOT TESTED。主役建築の美術改善は未実証。** 第一候補tomato3《Futuristic Buildings》（Sketchfab公開欄CC Attribution、約121.4k tris）は維持。作者主張に基づく有望候補だが**正規Sketchfabログインを要するため今回未取得**。代替Pasha《Cyberpunk city》（公開CC Attribution、約295k tris、作者主張ゲーム用・高品質テクスチャ）は参考のみで認証障壁も同じ。AI制作モジュール群をCC0だからと主役建築に流用せず、BX/BY/BZ/CAの劣化手法を再開しない。出典・権利・一度の正規取得と検証手順は [G4E-7CDアセット取得ゲート](docs/G4E7CD_AUTHORIZED_HERO_CITY_ACQUISITION_JA.md) に固定。

- **次の唯一の依存条件**：Sketchfab等から**作者/正規ライセンス/テクスチャを伴う正当なオリジナルZIP/GLB 1件**を手に入れた場合のみ、元原本と変換GLBを別SHAで記録し、既存CC権利ゲート→CBの6真正240Hzカメラ複数仮配置→真正PRIVATE WebGL比較→美術/人間審査の順。閲覧ページ/ポリゴン数/ダミー検査だけでART PASSは絶対に出さない。実原本未取得のため新規Blender/長時間Chromiumジョブを走らせない。
- **継続固定**：240Hz、B48実道路7、B51-C動体28、gap52、A13 Slope2方向性、元速度・操舵・カメラ・自然跳躍は未変更。main・Gold・原作再現・本番2サイト未変更。正式Slope2=0m。PR #46 OPEN/Draft未マージ。ART/HUMAN/PUBLISH/READY/MERGEすべてHOLD。Work未使用。G4E-7CEは実原本取得時のみ実体QAへ進める。


## G4E-7CC — 有料ゲームに使える完成建築原本の選定・権利ゲート（2026-10-25 JST）

**判断：主役級に近い「実在の作者がBlenderで制作した街路＋建物群」1候補を正式な次の調達先として選定。ただしSketchfabの認証なしで合法的に3Dファイルを取得できないため、モデルを入手・表示・技術PASS・美術PASSしたとは言わない。SOURCE RESEARCH 完了／ART NOT TESTED／ゲーム実WebGL未実施／HUMAN・PUBLIC・READY・MERGE HOLD。**

- **優先する本物の原本**：[Sketchfab tomato3《Futuristic Buildings》](https://sketchfab.com/3d-models/futuristic-buildings-adf97f38cda44e67a44994fff1cb4d58)。作者記述ではBlender制作・GLB形式・約121.4k三角形で、**屋上テラス、店舗、看板、交通信号、地下道路入口等を含む「建築・都市のまとまり」**が特徴。窓や構造部品だけでなく、人が建築/道路/生活を使う関係を最初から描いているため、BX→CAより方向性は適切。ただしこれは**作者の公開ページ上の説明**であってGLB実物・人間制作/第三者テクスチャ権利・ビジュアルの独立実証ではない。見た目の最終採択は未実施。
- **補助候補**：[Akshita_eb Dhaka《Cyberpunk Shop》](https://sketchfab.com/3d-models/cyberpunk-shop-4cfc925db2ec4634b6e31e550dabe17f) は制作者の説明でSubstance Painter PBR・ダクト・配管・看板を備える約32.3k三角形の**近景店舗**。 [nenkea《Sci-Fi Building 1》](https://sketchfab.com/3d-models/sci-fi-building-1-da4d7f4c35be49baa287af0782c2171b) はレースゲーム用に作ったと記述するガラス建築・エレベーター、約35.8k三角形。**建築の中心候補ではなく補助として控える**。いずれもCC Attributionの公開表示だが、正式版数・モデル中の第三者素材等は元アーカイブで再照合が必要。
- **重要なダウンロード制約**：[Sketchfab公式Download API](https://sketchfab.com/developers/download-api/downloading-models)によれば認証されたアカウントが必要。一般公開画像、表示用キャッシュ、開発者ツール等から抽出する回避は禁止。現在このチャットには正規のログイン権限と真のGLBファイルがないので、**GitHubに存在しないファイルを保存済みと主張しない**。実物未取得の段階で偽のレンダリングやモデル表示は作成しない。
- **候補出典・権利・使用適性を[機械可読レジストリ](docs/G4E7CC_VERIFIED_ARCHITECTURE_SOURCES.json)に記録**。全候補にオリジナルページ・作家名・CC Attributionの表示・説明/リスク・原本SHA未取得を明示。[source gate](scripts/p101-w9c2-g4e7cc-vetted-artist-source.mjs) + [安全テスト](tests/p101-w9c2-g4e7cc-vetted-artist-source.test.mjs)を既存の**BP軽量CI**に統合し、未取得素材・NC素材・古いCAのGLBを新しい原本と偽装して美術承認しない。今後真正ファイルを正当に入手した場合のみSHA256照合と[CB真正240HzカメラGLB事前検証](scripts/p101-w9c2-g4e7cb-native-asset-preflight.mjs)を実施する。実WebGLとアート審査はさらに別ゲート。
- **停止/効率**：Quaternius/Kenneyの低ポリ量産、BYの部品を箱に貼る、BZ茶住宅の大量複製、CAの薄い梁/曲面の微修正を再開しない。3D実物が手元になければ長いBlender/Chromium CIは回さない。調達先の品質、ライセンス、実建築・道路・人間スケールを優先。正式Slope2=0m。元240Hz/B48実道路7/B51-C動体28/gap52/原カメラ/操舵/速度・main・Gold・本番2サイト不変更。PR #46はOPEN Draft未マージ。Work未使用。

## G4E-7CB — 初めて「見えているだけ」を落とす実240HzカメラGLB事前審査 / TECH PASS（2026-10-25 JST）

**最新結論：新美術の合格・新道路の完成ではない。低コストのGLB受入/フレーム占有診断 TECH PASS。CA-R2の未来都市美術ART REJECTは維持、WebGL実描画・人間試走は未実施/HOLD、正式Slope2 0m、公開/READY/マージ禁止。**

- **過去の失敗からの工程転換**：BX=低ポリ模型市街、BY=高級CC0部品を箱に4個貼るだけ、BZ=普通の茶系集合住宅、CA=内部/ガラスと曲面に改善はあるが、低い高速カメラでは依然暗い面・都市の広がり不足。これ以上低価値な新箱/薄板/小修正＋長時間Blender CIを量産することを中止。新建築前に**実際の車載/ボール追尾カメラで見えるかをチェック**する。
- **既存の実際の物理カメラを再利用**：[G4E-7BG開始地点00からの正規240Hz/P96スクリプト軌道](scripts/p101-w9c2-g4e7bg-native-visual-frames.mjs)はB48実道路7/B51-C動体28/元gap52でtrue-pinch / pinch-switch の各15s/17s/18.5s＝**6視点**を固定。本物のゲームカメラの位置・方向・速度103〜126m/sを流用するが、**Playwrightの実描画画像ではない**、また人間操舵・遊びやすさを保証しない。
- **実装**：[G4E-7CB GLB native preflight](scripts/p101-w9c2-g4e7cb-native-asset-preflight.mjs)、[負例固定テスト](tests/p101-w9c2-g4e7cb-native-asset-preflight.test.mjs)。GLB 2.0実シーンノードのTRS/親子変換を含む世界座標AABB各8角を取り、既存BGの真正240Hzカメラに投影。画面内頂点率だけではなく**横幅・縦幅・外接面積・道路中央付近の角点・130m以内**を別々に診断。いずれも美術、実画素、閉塞率、当たり判定の承認根拠とはしない。外部ダウンロード、Blender、Playwright、実ゲーム修正不要の軽量Node試験。
- **実測/失敗の再現**：既存のART REJECT済[CA-R2 GLB](artifacts/private/g4e7ca-rift-exchange/G4E7CA_RIFT_EXCHANGE_ART_ONLY.glb)を意図的な負例とし、18.5秒true-pinchカメラ前方660m・視界左側の仮位置で6視点に投影。実モデル893メッシュインスタンス/7144 AABB角点、実GLB外接幅71.3268m・高さ59.6339m・奥行81.4m（Z-upではなく**glTF Y-up**）。**6/6視点で全AABB角点が画面内**でも、フレーム横幅占有わずか **3.79〜4.93%**、画面面積の外接矩形も **0.18〜0.33%**。つまり「100%画面内」に騙される従来判定は全く不十分。4つの診断フラグ、TINY 12%未満、2.5%未満の占有、頂点率偽陽性、路面領域への潜在干渉を出す。**あくまで一つの仮配置であり、CAの最適配置や実描画の実証ではない。**
- **QA証拠**：[再利用のBP intake GitHub CI #40189100352](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40189100352) **SUCCESS**。既存の軽量ワークフロー[artist GLB intake](.github/workflows/p101-w9c2-g4e7bp-artist-intake.yml)にCBを接続して新ワークフローなし。実行アーティファクト `g4e7cb-real240hz-camera-preflight-NOT-art-acceptance` に数値JSON保存。親ノード変換、回転、改ざん240Hz、実CA GLBと再現性を自動テスト。パフォーマンス指標/画面内率が高くてもART PASS禁止。
- **次の実制作ゲート**：新しい巨大都市モデルを機械的に何十回も生成しない。実際に建築的完成度が高く、出典と利用可能範囲が確認できる**本格的な人間制作3Dの一単位**（あるいは直接DCCで十分に完成させたもの）を選び、まずCBで実ゲーム視点の大きさ・位置・道路中央干渉の疑いを調べる。小さすぎれば高価なCycles撮影前に不採択。幾何の目安に通れば**元240Hzカメラでの真正WebGLスクリーンショットと人間による美術審査**、そこからのみ近・中・遠景を持つ100〜150m単一区間へ進む。作品全体の見た目だけでなく近景での細密さ、交通/公共生活、実路面への接続を確認。Poly Havenは素材/部品、QuaterniusのStylizedは補助候補であり、高品質な主要建築と取り違えない。Blender Studio Charge等の映画向けデータはライセンスとリアルタイム利用可否の個別確認なしにゲームへ取り込まない。
- **保護と効率**：元240Hz B48×7/B51-C×28/gap52/操作/速度/カメラ、main・Gold・原作Slope・本番2サイト不変更。CBはPrivate・READ-ONLYでエンジンに統合しない。既存スクリプト・CIの再利用で重複管理を避ける。Draft PR #46 OPEN/未マージ。正式Slope2=0m／ART HOLD・HUMAN HOLD・PUBLISH/READY/MERGE FORBIDDEN。Chat＋GitHubのみ、Work未使用。次回も最新HEADを再確認。

## G4E-7CA — 未来SF複合建築《RIFT EXCHANGE》実3D R1/R2・6視点比較（2026-10-25 JST）

**最終判断：真正Blender/GLB/CC0素材 TECH PASS、単体の建築美術R2は部分改善により研究ART HOLD、ゲーム用巨大未来SF都市としては明確にART REJECT。B48実カメラ・人間試走ともNOT TESTED/HOLD。正式Slope2認定0m。公開、PR Ready、merge 全禁止。**

- **開始点**：BZ-R2で原本147部品の3mグリッド組み立ては可能となったが、見た目は茶系集合住宅で巨大未来都市に遠い。単なる別の低ポリ街区や箱の大量複製は止め、50〜60m程度の都市公共交通を兼ねる非対称1建築《RIFT EXCHANGE》を新規に**独立Blender美術研究**。左右の実床・支持柱、内部公共吹抜け/昇降路、3連絡橋、1高架交通、ガラス面、厚い上昇屋根をモデル化。ただし施工・物理道路は一切作っていない。編集可能ソース：[CAオリジナルBlender Python](scripts/p101-w9c2-g4e7ca-rift-exchange-architecture.py)。
- **権利を検証したPBR**：Poly Haven公式CC0の[Concrete Tile Facade](https://polyhaven.com/a/concrete_tile_facade)と[Blue Metal Plate](https://polyhaven.com/a/blue_metal_plate)を公式APIから1K Diffuse/Roughness 4枚取得しSHA256と原本配布URLを記録。[真正編集可能BLEND・GLB・6 Cycles画角・PBR根拠・SHA256](artifacts/private/g4e7ca-rift-exchange)。配布元API利用表記は「Powered by Poly Haven」。幾何形状はOpenAIによるBlenderスクリプト造形であり、手モデリング/人間制作品とは主張しない。
- **R1制作**：まず屋根と大幅に開いた床だけで構成され、真正画像では窓ガラスが床外周から浮いている、室内が暗い、広いデッキが未完成に見えるなどが判明。**R1 ART REJECT**。初回 CI #40184941581 は6真正Cycles・GLB生成まで完了したが、短い有効JSONを「2000バイト未満＝欠落」と誤判断して失敗。改行修復も含め正規[CI #40185335466](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40185335466) SUCCESS。R1原版の画像/モデルはコミット `792d35103632af16c2cb39f3f9e33f55f0ba9bf4` で保存。**失敗したCIをPASSと偽装しない**。
- **R2修正**：中心の直方体を増やすのではなく、左右の実床に取り付く曲面沿いの連続側面ガラス、前方ガラス、階間の荷重/雨仕舞い帯、構造と接続する立体日除けを作り直した。上昇屋根の帯も厚く幅を持たせ、前版と同じ6視点で真正画像化。[R2真正CI #40186265646](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40186265646) **SUCCESS**。R2保管コミット `b045b0b8cb04746eff1d9100bc816a7a2bc0f7af`、保存済みJSONでは10階床プレート・3連絡橋・高架交通1・ガラス外面88・支持部材59。**数は技術確認用に限定し、美術/使用可否の代理にしない**。
- **[R1/R2 固定画角の真正Blender画像比較（PR #46）](https://github.com/ryomashibaba/dopagaki-development-hub/pull/46#issuecomment-6396782288)**：R2のOBLIQUE/AERIALでは、空中に孤立していたガラス板の多くが連続した建築外面になり、一棟としてのまとまりは確かに前進。しかしSTREET_APPROACH / STREET_LEFT / ENTRANCEでは道路両側が暗い大面に見え、走る先の都市密度・人間活動・外装意匠の豊かさ・長距離の街路/交通接続がまだ著しく不足。巨大な上昇弧も高度な未来建築というよりシンプルな装飾弧の印象が残り、背面は未完成な階層。スタジオで見える改善は実際のプレイヤー視界のPASSではない。**R2でも商品級の巨大SF都市はART REJECT**。研究建築単位の連続性のみART HOLD。
- **効率上の反省・停止条件**：外見を同じ薄い板/輪/梁/窓で部分修正するR3反復を**原則停止**。Blenderに大量のCube/Curveを追加する工程数では品質が上がらない。より高品質な**人が設計した建築の本体メッシュ、意図的に仕上げた現代建築の外装と生活空間、または本格的な直接編集型の美術制作手法**を調査/検証し、**最初から低いゲーム進行方向のカメラ構図**と対応させる。外部アセットの権利確認、編集可能な真正3D、複数方向の同一条件比較は引き続き必須。近景で建築/都市が美術的に成立しない間は100〜150m街路の大量生成、500〜800m B48 Phase C PRIVATE統合、正式コース昇格をしない。実ゲームの正規240Hz/WebGL視認性と人間のプレイ体験は後で別々に審査。
- **永久保護**：このCAはPRIVATE Studio ART-ONLY、元のBW/BX/BY/BZ資産とB48実道路7・B51-C実動体28・gap52・正規240Hz・操作/速度/カメラ/自然跳躍を一切不変更。main、Gold、原作Slope再現、両本番サイトも不変更。Draft PR #46はOPEN/Draft/未マージ。正式Slope2認定0m、ART/人間QA/PUBLISH/READY/MERGEすべてHOLD/REJECT。Workは利用していない。**別チャットへの長文引き継ぎ再作成不要。次回も現行GitHub HEADを再取得すること。**

## G4E-7BZ — 3m原本モジュール組立・21m建築マイクロスライス R1/R2 真正5視点審査（2026-10-25 JST）

**確定判定：REAL CC0/Blender/GLB技術PASS／21m単体の建築的連続性はR2で改善・研究ART HOLD／有料インディー級の巨大未来SF都市としてART REJECT／B48真正240Hzゲームカメラ未実施／人間実試走HOLD／正式Slope2認定0m／公開・READY・MERGE禁止。**

- **根本原因の発見**：BYで取り込んだ[Poly Haven公式の住宅ファサード素材](https://polyhaven.com/a/modular_urban_apartments_facade)は完成した建物ではなく、実際には部品を横並びにした**147メッシュのモジュールカタログ**。これをそのまま拡大配置して都市に見せかける方法は成立しない。BW/BX/BYをさらに量産せず、最初に原本部品を実際の壁・窓・扉へ組み立てる方式に転換。
- **本物の原本調査**：[元部品の真正Blender 2画像・寸法/マテリアル台帳・原本PBR](artifacts/private/g4e7bz-facade-lab)を作成。[元部品の検査CI #40181970715](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40181970715) SUCCESS。住宅キット147メッシュ、元の幅51.53m×奥行6.665m×高さ17mという数値はキット展開の外接寸法であり、一棟の建築寸法とは違う。3m幅の壁・独立窓・扉・柱・軒飾り等をオリジナルCC0の真正ジオメトリ/PBRのまま利用。[元部品検査ソース](scripts/p101-w9c2-g4e7bz-real-facade-study.py)。
- **実制作**：[組立Blenderソース](scripts/p101-w9c2-g4e7bz-assemble-inhabited-facade.py)で21m×4層の《TIDAL PORTICO》住宅/公共入口試験を独立制作。真正な3mモジュールを実際に248枚程度ではなく**247個**組み立て、窓60カ所、出入口3カ所、内部床8スラブ、階段/歩行者接続4をモデル化。これはコンポーネント数の技術記録であって、室内歩行可能性や映像品質を証明しない。元BYの都市・物理本体は全く編集せず、一建築単位のスタジオ検査。
- **初版R1**：[制作CI #40182523342](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40182523342) SUCCESS、編集可能.blend・GLB・真正Cycles 5視点を保存。しかし真正画像では階間に広い黒い水平空洞、入口が閉じたまま、屋根や周辺が無表情で、建築美術HOLD。**R1を完成品と扱わない**。旧コミット `23afb00a9bf05677f6bfbf901fb55999ed8f6786` で証拠復元可能。
- **R2 修正**：元3m高さパネルの上下にできる約1mの水平欠落を専用の厚みある構造・外装帯で接続、中央実3m開口に少し開いたガラス戸＋支持庇＋奥のロビー照明を設け、模型的なスタジオ人型マーカーを削除し実人間アイレベルの全体構図も改善。初回 [CI #40183144814](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40183144814) はR2の真正5レンダリング・GLBまで完走後、`UNJUDGED_R2` と `UNJUDGED` の**メタデータ表記不一致**のみで失敗。表記を整合させた最終[CI #40183179370](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40183179370) **SUCCESS**。最終[編集可能Blender・本物のGLB・真正5視点＋SHA256](artifacts/private/g4e7bz-facade-lab)を保存。BlenderソースにはPBR画像をpackしている。初版とR2の真正画像は[PR #46の安定SHA付き画像比較コメント](https://github.com/ryomashibaba/dopagaki-development-hub/pull/46#issuecomment-6396382250)から閲覧。
- **R2の本当の美術結論**：視点をそろえて目視し、階間の黒い隙間が構造帯になり建築の上下連続性が改善、中央入口も近景で見えるようになった。一方で繰り返す窓、普通の茶系集合住宅の意匠、薄いバルコニー、屋上の平板、弱い内部生活感、交通の孤立、周囲の未来都市・近中遠景が依然不在。**「建築部品の扱い」の技術検証としては価値があるが、近未来/巨大都市/ゲーム美術としてART REJECT。単体実建築の美術研究としてはHOLD。** 500〜800m統合や100〜150m街区への量産・正式道路上の表示を進めない。
- **次の制作・撤退ゲート**：この茶色い住宅ファサードを多数コピーして巨大都市を作るのは禁止。原本組立の技術は再利用しつつ、**適正ライセンスのモダン／未来SFに見える建築PBR/メッシュ部材**を別途実際に確認して、建築一単位の入口・人間の生活/交通・荷重支持・精密な外装を本当に目視で成立させる。形が成立するまで1kmの大量装飾へ戻らない。美術ゲート後にのみ代表する走行方向の100〜150m連続街区、次いでB48実道路の500〜800m PRIVATE統合を考える。正規240Hz/WebGL元カメラ・人間による高速プレイの視認性と面白さは依然未証明。Workは使わずChat＋GitHub、既存の工程表とQA分類を保持。
- **既存ゲームの保護・引き継ぎ**：B48実道路7・B51-C実動体28・gap52・240Hz・速度/操舵/自然跳躍/カメラ・main・Gold・本番2サイト・原作Slope再現は一切変更していない。PR #46 OPEN/DRAFT未マージ。正式Slope2=0m。Human/PUBLISH/READY/MERGE=HOLD。新チャットもこの固定URLと実HEADを最初に照合。日次引き継ぎ全文の作り直しは不要。

## G4E-7BY — 高精細CC0ファサード＋都市交通を試した真正Blender7視点 / 美術REJECT（2026-10-25 JST）

**結論：TRUE BLENDER/CC0 ORIGINAL FILE TECH PASS／ART REJECT（BXより後退）／AUTHENTIC GAME CAMERA NOT RUN／HUMAN HOLD／PUBLICATION FORBIDDEN。** 本節は画像を本当に目視した後の結果。工程増加そのものを進歩と扱わない。

- [真正制作CI #40180712675](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40180712675) **SUCCESS**。初回はジョブ-level `runner.temp` 不正でワークフロー失敗、2回目はBlender4マテリアル入力名、3回目はrunnerにOpenImageDenoiser非搭載で失敗。修正後、Poly Haven公式APIから **CC0 1.0** の `modular_urban_apartments_facade`（1K glTF、依存13）と `modular_factory_facade`（同16）を真正取得し、編集可能.blend／GLB／独立真正Cycles 7視点／SHA256マニフェストをPRIVATE開発ブランチへ保存。アセット原本自体は外部配布元に帰属し、ソースファイル・取得API・SHAと著作権表記は保存。Poly Haven API利用のため *Powered by Poly Haven* 表示を計画に含める。
- [BY実制作ソース](scripts/p101-w9c2-g4e7by-urban-pbr-corridor.py)、[BY真正7画像と編集可能3D](artifacts/private/g4e7by-urban-pbr-corridor)。ブランチの旧BW-R3・BXファイルは無変更。旧BXと**同じスタジオ画角**のAPPROACH／FORWARD_300／FORWARD_700／OBLIQUE／FRONT／AERIAL等を保存。ただしゲーム240Hz起点00の実走カメラで撮影したものではない。
- **具体的な失敗**：BYの実APPROACH/FRONTでは、シンプルな白い角柱・直方体の集合と細い発光軌道が画面を占め、建築内部・高密度街路・迫力ある背後景観に至らない。300m／700m先の視点でも疎な白箱と空白が支配。Poly Havenの高品質なオリジナルファサードは少数かつ場面に対して非常に小さく、都市全体の造形を改善しなかった。**BXのほうが実際の街並みとしてはまだ読める**。高級インディーゲーム級の美術としてBYを明確にREJECT、3Dの手法・素材取得TECH PASSと取り違えない。
- **根本原因**：第三者の高品質ファサードを4配置しただけで、主質量を旧来のスクリプト生成ボックスに依存した。連続ガイドレールは交通ネットワークの証明ではなく、都市生活・アクセス・公共空間を実際の建築として作れていない。**この方法の同一スケール反復、ボックス追加、CI目的の連続コミットは禁止**。

**次の制作ゲート・再転換（方針確定）**：最初に実際のソース3Dのモジュール寸法・階・屋内外・PBRを単体で独立確認し、10〜30mの**ひとつの納得できる外壁＋入口＋支持構造＋生活層**を本物の建築として構築する。巨大箱の外側に表面素材だけ貼る作り方はやめる。次にその高品質モジュールを配置する**近景100〜150mの実走行方向の代表断面**を1つ丁寧に制作・審査する。視覚的に建築品質が成立しない間は1km全体・建物数量への拡張をしない。ゲームのB48 500〜800m/Phase CへのPRIVATE統合も美術ゲートが成立するまで禁止。真正Cycles**だけでなく**最終採択前に正規240Hz/WebGL実カメラと人間テストが不可欠。素材出典・CC0ライセンス・原本SHAの追跡は必須。

**恒久保護**：B48実道路7／B51-C実動体28／gap52／正規240Hz／元操作・自然ジャンプ・カメラ・速度、main、Gold、原作Slope再現、本番2サイト不変更。PR #46はOPEN/DRAFT/未マージを維持。**正式Slope2=0m／ART REJECT／HUMAN HOLD／PUBLISH・READY・MERGE FORBIDDEN**。Work未承認のまま使用していない。次回も必ずGitHub現行HEADから開始。

## G4E-7BX — 人間制作CC0建築の取り込み・実7視点審査（2026-10-25 JST）

**確定証拠**：[Blender制作CI #40177368056](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40177368056) SUCCESS。最初のCI失敗はアセット解凍パスの不一致で、コミット9a89d9e6b2baa72ccac059193359710131ed9aa7で修復。Kenney公式[City Kit (Commercial) v2.1](https://kenney.nl/assets/city-kit-commercial)をCC0 1.0ライセンス原本として採用、[Kenney本人のOpenGameArt掲載](https://opengameart.org/content/city-kit-commercial)と一致。真正GLB 41点を取得、ZIP原本SHA-256 f8b09b081c2bb88bcc126e2dec1cb40fd0dad7e7e591b6c26aaefe96fb35276b。うち13種類を34地点に配置し、既存BW-R3ネイティブ.blendから独立BXモデルを制作。**新しい物理道路は作っていない**。

**[PR #46のBX実7視点画像付き審査](https://github.com/ryomashibaba/dopagaki-development-hub/pull/46#issuecomment-6395590457)**：従来R3と同じ低いAPPROACH視点・前方300m・700mなど、真正Blender Cycles 7画像を直接目視。旧空白だった前方両側に3D建築が増え、真正な立体メッシュの取り込みが実証された。ただしKenney低ポリ建築の反復で**箱状の模型都市感が顕著であり、道路中心の奥は依然空白**。巨大未来都市の高品質美術としては **ART REJECT**。人間制作CC0資産であっても、映像品質の保証にはならない。**大量複製・ポリゴン増加で合格を偽装しないこと**。

保存先：[原本ZIP・ライセンス根拠・GLB・真正7画像・編集可能Blender・SHA256](artifacts/private/g4e7bx-licensed-urban-depth)／[独立BX Blender制作ソース](scripts/p101-w9c2-g4e7bx-forward-cc0-depth.py)。GLB二進検査は1,505 meshes/41,360三角形/29 materials/埋込画像2、技術PASS。元のBW-R3とそれ以前のBR～BW制作物はすべて無変更。

**次の方法転換**：低ポリ建物を大量に置く方法を反復しない。自分自身の高品質な美術目標を、走行路の近・中・遠景と都市公共空間・支持構造・交通接続・緻密な素材で一体設計し、本物の編集可能3Dとカメラ画像で審査。必要なら異なる制作ツール・アセット調達・アートディレクションを調査するが、未確認ライセンスの外部作品を採用しない。**美術未合格で正規B48 500～800m統合を無断進行しない**。main、Gold、両本番、原作Slope、240Hz B48×7/B51-C×28/gap52/既存物理とゲームカメラを不変更。PR #46 OPEN/DRAFT/未マージ。Slope2公式認定0m、人間QA/ART/PUBLISH/READY/MERGE全HOLD。


## G4E-7BW-R3 — 主役建築の入口・内部と北側の連続性実制作（2026-10-25 JST）

**毎回GitHub現行HEADを再取得すること。** [BW-R3 Blender制作CI #40175375668](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40175375668) **SUCCESS**。実際のBlender編集可能モデル、GLB、Blender Cycles 6視点（従来のOBLIQUE/FRONT/SIDE/AERIAL/APPROACH＋新FOYER）、SHA256を[PRIVATE原本保管](artifacts/private/g4e7bw-halocut-concourse-r3)へ保存した。[新しい独立R3制作ソース](scripts/p101-w9c2-g4e7bw-r3-interior.py)はR2の原本を不変更。旧制作CIを再利用し新ワークフローは増やさない。GLB 1,493メッシュ/23,592三角形/17マテリアル/埋込画像1は技術情報で美術PASSではない。

**[PR #46に本物のBlender画像 R2対R3同条件5視点とFOYERを掲載](https://github.com/ryomashibaba/dopagaki-development-hub/pull/46#issuecomment-6395286936)。** R3では両建築翼に立体入口、中二階、手すり、室内照明、傾斜移動構造、北へつながる居住層と支持のある交通構造を実造形。従来の5方向のカメラ位置・画角は不変更なので適正比較可能。R3は近場の建築の階層・入口・FOYERでは改善が見られたが、**低いAPPROACH視点の奥は依然ほぼ空白であり、巨大都市疾走の景観は不成立**。硬く角張った白い屋根、反復窓・単調な素材も課題。技術PASS／美術HOLD（正式不採用）／実ゲームカメラ・人間試走未検証／公開禁止。

**次工程は同型Blender bpy簡易造形の追加反復を止め、近景・中景・遠景をつなぐ真の都市美術と高精細建築制作方法へ転換。** 目視審査で成立してからPRIVATE 240Hz B48本物の500～800m代表区間統合を検討。B48×7、B51-C×28、gap52、240Hz、main、Gold、本番2サイト、原作Slope再現不変更。PR #46 OPEN/DRAFT/未マージ。公式Slope2認定0m。ART/HUMAN/PUBLISH/READY/MERGE全HOLD。



## G4E-7BW / 主役建築を単体で制作・5視点×2バージョン真画像審査（2026-10-25 JST）

**最新成果**：[BW / HALO-CUT CONCOURSEの真のBlender画像付きDraft PR美術評価](https://github.com/ryomashibaba/dopagaki-development-hub/pull/46#issuecomment-6395122703)にR1/R2の斜視・正面・側面・俯瞰・低いAPPROACH計10画像を直接掲載。真正.blend、実GLB、出典、独自埋込画像、SHA-256を[初回BW原本](artifacts/private/g4e7bw-halocut-concourse)・[前方視野改善版R2](artifacts/private/g4e7bw-halocut-concourse-r2)へ完全分離保存。[BW真正Blender CI #40173719487](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40173719487)・[R2真正Blender CI #40174244111](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40174244111) はいずれも **SUCCESS**。新ワークフローを増やさず既存のBlender美術制作CIを改修利用。

- **BV以前からの設計方法転換**：街や外殻を多数一括生成せず、主役となる**一棟の複合公共交通建築**を建築翼・中空アトリウム・構造屋根・実居住層と連絡橋・内部照明・細いファサード部材で一体化。[唯一のBW制作ソース](scripts/p101-w9c2-g4e7bw-halocut-concourse.py)はBlender bpyによる**作者指定の幾何学構成のスクリプト再現**であり、手作業彫刻や実ゲーム描画とは称さない。図的な一体感・居住階層はBVより改善。
- **初回BWの明白な欠陥**：手前からの低い\`APPROACH\`で5本の水平横断橋が前方空間を著しく遮る。単なる構図最適化で美術判定を誤魔化さず、R2では**実形状の橋を5本→2本へ**変更し、スタジオカメラの仰角と画角も見直した。改善画像の視界は前より開けたが**橋除去のみの純粋効果は測定していない**（カメラ設定も異なる）。
- **画像比較による厳格な結論**：R2は中央前方の重なりが減り、単一建築単位の構造的つながりは進歩。ただし屋根・大梁の外観の硬さ、未完成に見える浮遊細部、ガラス帯の繰り返し、暗い公共空間、前方に続く都市背景の欠落が残る。**BWを高級インディー水準の都市アートとしてART PASSにしない。技術PASS、ART HOLD、実B48カメラ・人間QA未試験。** R2を実道路に統合したという主張は禁止。検査はBW R2 GLB 1,241 mesh / 19,504三角形 / 13 material / PBR画像1で、建築品質の代理指標ではない。
- **次工程の品質焦点**：別の都市プロシージャルモデル量産を停止。BWを暫定**主役建築単体の研究素材**として保管し、外装・出入口・公共内部空間を本物の建築的意図で深く磨く。周辺の高密度な居住都市と都市交通が実カメラの進行方向に繋がる設計を必要とする。ライセンス未確認の他者3Dモデルは採用しない。**ART/ロード視界の実証を経ず500–800mのPhase C PRIVATE統合には進まない**。次の手段は細かい手作業のモデリングや制作環境の変更などを含むが、ユーザーが事前承認していないWorkを無断利用しない。
- **保護**：BR/BT/BU/BVのREJECT原本・BW R1原本を全て残した。main/Gold/本番2サイト/原作Slope実装・B48実路面7/B51-C実動体28/gap52/240Hz/元操舵とカメラ不変更。Draft PR #46はOPEN/DRAFT/未マージ。公式Slope2認定0m。ART/HUMAN/実ゲーム映像/PUBLISH/READY/MERGEはHOLD。



## G4E-7BV — 建築ファースト地区の実制作・実視点美術REJECT（2026-10-25 JST）

**最新確定証拠**：[BV Blender真正実制作CI #40172833140](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40172833140) SUCCESS。ネイティブBlenderソース、1.57MBのGLB、5方向の実Cycles（斜視・正面・側面・俯瞰・APPROACH）、独自GLB内テクスチャ1、SHA-256を[既存Draftブランチの証拠](artifacts/private/g4e7bv-architectural-quarter)へ保存した。821メッシュ・14,458三角形・11マテリアルは技術指標に過ぎない。[Draft PR #46の実画像付き独立美術審査](https://github.com/ryomashibaba/dopagaki-development-hub/pull/46#issuecomment-6394934226)。

**制作方式**：[BVの編集可能Blender生成ソース](scripts/p101-w9c2-g4e7bv-architectural-quarter.py)はBUの巨大な空殻から抜け、約700mの地区に駅、段丘状アーコロジー、曲面文化施設、異なる住宅・学校街区、橋・テラスを個別に設計した。従来のBlender CIを再利用し新ワークフローは増やさず、5枚の画像を同一CIで搬出。追加APPROACHは**スタジオの擬似道路視点であり240Hz実ゲームカメラではない**。

**美術結論＝ART REJECT（BUILD/GLB技術PASSと区別）：** 真正5枚を直接目視。斜視・俯瞰は大きな空の地面の上に数個の箱型建築が並ぶジオラマに見える。広範囲の居住密度と都市街路・公共空間の連続性が欠け、複数の施設は疎らで外壁も平板。低いアプローチでは無地の壁と長い水平橋が視界を占領し、危険の予告に使える実道路風景になっていない。前のBR/BT/BUと同様に正式都市アセットへ採用しない。

**今後の最重要手法転換：** 「Blender bpyで小箱・円弧部材を一度に生成→シーン全体を大きくする」方法を**終了**する。次は**まず一つの建築的に説得力ある主役建築を本格制作・目視審査**（意図的な造形・繊細な多層ファサード・内部公共空間・4–8m生活スケール・実オリジナルPBR）。それから周辺の異種建築と街路・交通で本当に連続した都市街区を形成する。外部アセット使用時は商用可否等を根拠で確認し、未確認の権利物は使わない。単なるモデルのポリゴン数・CI本数増加は禁止。**美術PASSまでPRIVATE実ゲームへの統合なし**。アートの正式採否はユーザーの実画像評価を尊重。参考写真と実カメラの視認性を重視し、従来のものと異なる制作ソフト・方式の利用も認めるが、Work使用の新たな事前承認は維持する。

**保護とゲート：** BVの技術PASSはゲーム・人間・美術・公開PASSを意味しない。B48道路7、B51-C動体28、240Hz、Gold、gap52、main、原作Slope・両本番URLすべて維持。Draft PR #46 OPEN/Draft/未マージ。正式Slope2 0m、ART/HUMAN/PRIVATE-REAL-GAME/PUBLISH/READY/MERGE HOLD。過去のBVレンダリングはプロジェクト失敗学習の証拠として保存する。




## G4E-7BT/BU 真正4視点美術審査と手法転換（2026-10-25 JST）

**重要・前回の「BT美術HOLD」を上書きする後続審査結果：BR / BT / BU 全て美術REJECT。** [PR #46の独立BT対BU真正レンダリング4視点比較](https://github.com/ryomashibaba/dopagaki-development-hub/pull/46#issuecomment-6394820834)。相対的な前進を芸術合格にすり替えない。

- **BT真正画像をGitHub CI経由で取り出して人間目視評価：** BRより建築量塊・窓・街区の連続性は改善したが、円形の玩具的都市と反復直方体の小塔に見える。現状では実ゲーム統合に値しない。**BT=ART REJECT**。
- **BU《RIFTBOUND MEGACITY》真正Blender実制作**：円形の器を捨て、2本の非対称で一体的な都市断崖、縦方向約1.9kmの深い開放峡谷、連続居住層と横断公共交通を、旧BTスクリプトとは別の[BU独立ソース](scripts/p101-w9c2-g4e7bu-riftbound-city.py)でモデル化。[Blender実制作CI #40172049902](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40172049902) **SUCCESS**、実.blend/GLB/4方向1440×900 Cycles PNG/埋込独自PNG画像/整合性SHA-256を[GitHub独立PRIVATE証拠](artifacts/private/g4e7bu-riftbound-megacity)へ保存。独立GLBバイナリ検査は668メッシュ・38,110三角形・11マテリアル・埋込み画像1。これらは美術合否に無関係な技術指標。
- **BUの真正画像目視判定=ART REJECT。** 円形ミニチュアの改善と規模シルエット強化はあるが、巨大な白い無地外殻、黒い平板の窪み、生活街区の視認性不足、単調な窓列、側面/斜視での直方体感という根本問題を残した。**「大きな外殻をプロシージャル生成→小箱街区を貼る」方式そのものが都市美術のボトルネック**であると認定。
- **方法論の変更（最上位QUALITY-FIRSTに準拠）：** 同じ欠点が複数候補で連続したため、BR→BT→BUのようなプログラム形状の同型微調整/反復を停止。次回は**建築・街区・公共空間・多層交通・居住痕跡を、意図あるアートディレクションによる3D建築として先に組み立てる**。作り込んだ差別化のある都市モジュール、真の建築的接続、地形と外装を貫く実住区、室内奥行と照明、建築スケールの階層を制作し、そこから巨大質量を統合する。Blenderのカーブ/メッシュ編集/ブーリアン/適度なGeometry Nodesは手段であり、無数の簡易柱、リング、舗装箱、窓だけで美術合格を捏造しない。外部3D資産の場合は本物の権利資料を要求し、使用可能性が未証明なら使わない。スクリプト制作を手彫りと称しない。
- **効率改善**：追加CIを新設せず、既存BSレビュー経路でBT対BR、BT対BUの真正画像をSHA照合した。次BU用に既存Blender制作CIへ4視点レビュー・アーティファクト出力を統合したため、毎回BSの別起動は不要。必要な節目検証のみ。
- **次の品質ゲート**：まず少数の高品質な都市建築モジュール＋人間の縮尺が読み取れる都市層の本物のBlender画像を組み合わせて審査。以前のように「大外殻を完成→小塔を埋める」のは禁止。**4視点でプレイヤー目線の美術が成立してから**PRIVATE専用glTF/PBRレンダリング検証と正規B48道路500～800m区間へ。まだ実ゲーム内の視界/楽しいレース/人間手動QAは未実施。
- **保護**：main・Gold・両本番・原作Slope再現・正規240Hz B48×7/B51-C×28/gap52/元物理・カメラは不変更。Draft PR #46 OPEN/DRAFT/未マージ。正式Slope2認定0m。Human / Art / Publish / PR Ready / Mergeは全HOLD。


## 最新BT美術制作・CI改善（2026-10-25 JST、Quality-first実行結果）

**最新確定HEAD（この記載時点）：** `2f1ce519668fb4e08c5922d3f1c5f3e0cf7adf88`。このSHAは固定最新とせず、次回GitHub HEADを再取得すること。[既存Draft PR #46](https://github.com/ryomashibaba/dopagaki-development-hub/pull/46) はOPEN/DRAFT/未マージのまま。

- **Phase A 限定CI改善実施：** コミット `14970618a78a1de93b71968cd84ab16f8e01f5f6` で毎回ジョブ0のまま失敗していたG4E-7F YAMLの未引用コロンを修復。[真正ワークフロー成功 #40170147094](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40170147094) を確認。B5重物理検証・handoff snapshotのpush条件を関連ファイルに限定、手動起動は残した。BT美術コードのコミットでは両ワークフローの不要起動が発生しなかった。従来の公開ゲートP64 PR QAは保護のため残した。CI起動削減とゲーム品質向上は別物。
- **Phase B 初回実制作：** 過去の[BR美術REJECT](docs/W9C2_G4E7BR_ACTUAL_BLENDER_ART_FOUR_VIEW_REJECT_JA.md)から、単なる塔/箱増殖をやめ、約1.15km級の**連続した中空都市大質量＋内外に密集した居住街区＋4層の居住断面＋立体交通と公共空間＋非対称の巨大立ち上がり**を、一つの[オリジナルBlender bpyソース](scripts/p101-w9c2-g4e7bt-blender-mass.py)に組み込んだ。手彫りではなくスクリプト制作と明示。
- **[BT真正Blender制作CI #40170836465](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40170836465) SUCCESS。** [PRIVATE開発証拠ディレクトリ](artifacts/private/g4e7bt-inhabited-tidal-fold)に真正.blend、GLB2、4方向独立Cycles 1440×900画像、オリジナルPBR画像アトラス、独立GLB intake、SHA-256を永久保存。469 mesh／17,136三角形／11 material／GLB内画像1点。初回はOpenImageDenoiser欠如で失敗、2回目はCyclesのsegfault、生成・GLB書出とレンダリングの順序を分離して3回目成功。旧BR制作物は原本保護。
- **実画像によるBTとBRの4方向比較は[PR #46のレビュー用コメント](https://github.com/ryomashibaba/dopagaki-development-hub/pull/46#issuecomment-6394644464)。** 現時点で**技術PASS／美術HOLD（合格判定なし）／ゲーム内実WebGL HOLD／人間手動HOLD**。三角形数・素材点数・CI成功だけでは芸術向上を証明しない。もし連続量塊でも模型感を払拭できないなら、脚本的な小塔追加ではなく建築資料・モデリング方式・アートディレクションそのものを転換。
- **Phase C／Dは未開始：** ユーザーによるBT美術審査を経ずゲーム本体へ統合しない。次に合格した候補を正規起点00からの約500〜800m本物のB48狭路・CHASM・危険先読みと一体化し、100〜130m/s実WebGLの視野・路肩・自然ジャンプ・接地・再挑戦価値を確認する。現行旧BK GLBローダーは一般PBR/複数ノード・テクスチャ未対応であり、この技術負債を隠さない。
- **保護：** B48実道路7、B51-C動体28、gap52、240Hz、元操舵・カメラ／main／Gold／本番2サイト／原作Slope再現は未変更。公式Slope2認定0m、Human/Art/Publish/PR Ready/Mergeは全HOLD。


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

## 【最上位運用方針】QUALITY-FIRST / INTEGRATED VERTICAL SLICE（2026-10-25、ユーザー正式採用）

**本規約は直近737コミット・約680変更ファイルの総点検後にユーザーが正式採用した新方針であり、以下の過去の「次工程」文言より優先する。** 本プロジェクトは大量の技術テスト・分離試作は蓄積できたが、ゲームの面白さと巨大都市美術が依然として未達。工程番号、コミット数、GLB三角形数、CI PASSの数を完成度や進捗の代理指標にしない。**評価の主軸を人間が遊んで面白いこと・実カメラで美しく見えること・品質改善量/工数に変更する。**

### 1. 開発の新しい順序（ゲート制）

**Phase A — 小さく、即効性のあるCI・継続開発の効率化。**
- 約129ワークフロー、263テスト、185スクリプト（2026-10-25調査時）の依存関係と実際の起動条件を確認。常時発火・毎回失敗・大量キャンセル・無関係なChromium/Blender再実行を減らす。**修正するのは安全に対象を絞れるワークフローだけ**。旧証拠の削除、無差別停止、mainや本番への変更は禁止。
- 軽量ユニット/構文確認→関連した変更の統合テスト→節目の実Chromium/240Hz/Blender重検証に分ける。独立小実験ごとの新CI新文書は原則増やさず、既存の共通検証経路を再利用。**効率化研究だけで何十工程も消費しない**。

**Phase B — ART-FIRST、少数候補の独立美術制作。**
- BRの真Blenderソース＋GLB＋4方向画像を活用するが、**BRは美術REJECT**であり、そのまま「都市完成」としない。従来の疎らな塔/巨大無地床/筒状外殻/無意味な細い梁を大量に増やす路線を中止。
- 主役は**ひと目で1km級と分かる連続的な巨大建築量塊＋内部都市・高密度の街区＋深い中空の公共空間＋差別化された居住層**。素材、照明、都市交通、建築のつながりをセットで造形。Blender等の**編集可能な真正3D**、4方向の真正レンダリング、GLB/PBR素材・出典/権利情報を保存。手作業でないものは正直にスクリプト生成と記録。
- **美術ゲート：**まず複数角度の実画像で①壮大な量塊・規模感②街区密度と建築的連続性③シルエットと空洞④素材・照明⑤既存案との差分を目視比較。絵が悪い時はゲームへ統合しない。自動の投影率やポリゴン数で美術PASSを出さない。
- **同じ根本的欠点で2〜3候補続けて不合格なら、パラメータの微調整ではなくモデリング/レンダリング/アートディレクションの方式を見直す。** この判断はユーザーの実画像評価を尊重。

**Phase C — 代表コース区間への「ゲームとしての統合」**
- 美術の成立した**500〜800m程度の代表区間**を目安に、本物の狭い道路・曲率・自然跳躍・下り・復帰・回避障害物と都市風景を**一体で完成させる**（長さは目安で、品質を犠牲にして距離を稼がない）。都市アセットが既存GLB表示方式に未対応なら**PRIVATE限定の現実的なglTF/PBR対応**を設計・検証し、旧BKローダーの制限を隠さない。
- 正規起点00／240Hz B48実路面7本・B51実動体28基・gap52・元ゲームカメラを維持。外観だけの危険・偽足場・物理の無断変更は禁止。100〜130m/sの実WebGL画面で、都市が存在するだけでなく**道路の危険を先読みでき、かつ迫力がある**ことを確認。
- QAは実道路への接地・落下・視界・反発・カメラ復帰・再挑戦価値を同じ区間で検証。P96自動操舵の成功を人間QA成功と称しない。

**Phase D — 人間のプレイと品質確認後にだけ全長へ拡張。**
- 本当に遊べるPRIVATEプレビューを作り、ユーザーの**実機プレイとJSON保存**で難易度・操作感・ロードの楽しさを判定。人間が遊べると証明する前に大量のコースへ横展開しない。
- 代表区間が技術/美術/人間の各ゲートを満たして初めて、全長7.28kmとA13の40%=2.912km級Slope2 DNAへ展開。公式認定距離は現行**0m**。実験結果を認定距離へ無断加算しない。

### 2. 工程とコミットの運用ルール
- **1工程＝プレイヤーの体験を明確に改善する、検証可能な意味ある成果。** 変更は安全な範囲で関連機能をまとめ、重要な中間保存で適切にコミット。工程番号を増やすための極小差分・CI一本追加だけの反復を避ける。過剰な大規模改変や原本破壊も避ける。
- 毎回の作業開始時に「今回実際に改善する体験」「客観・視覚・人間の評価ゲート」「撤退/手法転換条件」を短く明記。結果はPASS/REJECT/HOLDで正直に報告。ユーザーが疑問を呈した品質問題から逸れない。
- **BUILD/UNIT PASS ≠ VISUAL PASS ≠ HUMAN PASS ≠ PUBLISH APPROVED。** REJECTの画像やGLBもGitHubのPRIVATE証拠として保存できるが、正式採用・遊べる状態・作品完成とは見なさない。
- 永続引き継ぎは**この`PROJECT_STATE.md`が唯一の入口**。古い履歴を丸ごと複製せず、最上位規約と最近の結論を短く更新。多量の個別ドキュメント・CI・手作業ZIP・毎日の新プロンプトは増やさない。
- 実装は原則Chat＋GitHubで効率的に。Workは明確な利点がある場合にのみユーザーの事前承認。既存成果を原本保護。PR #46はOPEN/DRAFT、main/Gold/本番2サイト/原作Slope再現不変更。**Human/Art/Publish/Ready/Mergeは明示承認・根拠が揃うまでHOLD**。

### 3. 新チャットの最初の具体的工程
1. GitHubの最新HEADとPR #46・現存する実証・この規約を取得する（この文書にある古いSHAを最新だと決めつけない）。
2. **CIの無駄な大量起動の主要因を限定的に修正**して、軽量経路と節目検証を分ける。改善前後の発火数と安全性を検証。余計な新ワークフローを作らない。
3. 同時に、**BRの美術REJECTを出発点とした「一体型巨大都市＋内部に住める高密度街区」の明確に異なる次候補**を、真正Blender/PBRと4実視点で制作する作業へ進む。**単なる監査だけで工程を終えない**。
4. 結果と失敗理由をユーザーへ画像中心に説明し、完成した次の代表コース体験につながるかで採否判断する。

## G4E-7BR / BS — Blenderによる本物の3D都市制作・4視点美術審査（2026-10-25 JST）

[BR実制作CI #40168751293](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40168751293) **SUCCESS**、[BSの出典・SHA-256画像検証CI #40169047717](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40169047717) **SUCCESS**。Blender4.0.2で独立した都市地区《THE FRACTURED TIDE CITADEL》を実際に生成、**ネイティブ.blend（約2.57MB）／GLB2（約1.82MB）／独立4方向1440×900の真のCycles画像／SHA-256／出典・素材検査**を[GitHub PRIVATE開発用フォルダ](artifacts/private/g4e7br-fractured-tide-citadel)へ恒久保存。**26,594三角形・219メッシュ・17GLBマテリアル・テクスチャ画像0点**。スクリプトをBlender内で実行した造形であり、手彫りの精密Blenderアートや実ゲーム内WebGL描画と偽らない。

実Blender4画像を目視評価。曲面断崖・二つの段状都市島・立体高架橋・光る居住面など従来より確かに立体構造へ前進したが、**巨大都市というよりミニチュアの疎らな模型**に見える。広い無地の床、無個性で反復した塔、都市の連続居住層と複雑な大質量不足、素材・ディテールの物足りなさが明白。**技術PASS／中央級巨大SF都市の美術候補としてREJECT、Human/Art/Publish/Ready/Merge HOLD**。実ゲームの正規起点00・240Hz・高速P96カメラ表示はまだ未実施、ゲーム画面改善を達成したとは言えない。[BR美術監査・次の質的転換](docs/W9C2_G4E7BR_ACTUAL_BLENDER_ART_FOUR_VIEW_REJECT_JA.md)。

次は同じコード生成の微調整で立方体を増やさず、**1km級に見える連続した都市大質量／深い開口／実居住街区／複雑な素材・テクスチャ**を一体で美術設計し、本物のBlender4視点審査後にのみゲーム統合へ。現存BK描画器はBlenderの複数ノード・インデックス・テクスチャに対応しないため、将来PRIVATE対応パスの別検証が必要。既存B48実道路7／B51-C実動体28／ギャップ52／240Hz不変更。main、Gold、2本の本番、原作Slope、PR #46 Draft維持。正式Slope2認定0m。

## G4E-7BQ — BOの監査用GLB・実WebGL画像を開発GitHubへ永続保存（2026-10-25 JST）

[専用保存CI #40167708533](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40167708533) **SUCCESS**、[PRIVATE開発ブランチの永続監査資料](artifacts/private/g4e7bo-native-20261025)に、元[BO CI #40166540111](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40166540111)の正規240Hz 3視点×BN/BOの**実PNG6枚とGLB2本、全8ファイルのSHA-256監査情報**を登録。B48 7本／B51動体28基／セル52、TRUE 122.9・SWITCH 112.2/125.8m/s、SCRIPTED NOT HUMAN。**Technical PASS／Art REJECT／Publish FORBIDDEN、PR #46はDraft**であり、公開デプロイではない。これで元GitHub Actionsの14日アーティファクト期限に依存しない。

[BP軽量CI #40167594463](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40167594463) は4/4 PASS。今後はBlender等の真の芸術制作物を入庫→独立美術審査→適合レンダラー検討→元240Hzカメラで可視確認する。**今工程で高品質新GLBを制作・実走行描画したと誤認しないこと**。本番・原作サイト・main・Goldは不変更。正式Slope2 0m、Human/Art/Publish/Ready/Merge HOLD。

## G4E-7BP — 技術PASS／美術REJECTとART-FIRST転換（2026-10-25 JST）

[BO CI #40166540111](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40166540111) は全PASS。正規240Hz起点00 P96非人間3視点、GLB2×2、実Chromium画像・PRIVATE/公開隔離成功。ただしBN→BOで都市は画面左端に小さく残り美術的向上はほぼないため**BO ART REJECT**。モデル移動は約X+4.6m／Y-27.7m／Z+23.7m、画面差分RGB平均2.49〜4.34/255。画面内頂点率・小改善スコアでは巨大都市の美術品質を証明できない。[証拠GLB/実画像](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40166540111/artifacts/12588778053)は14日で期限切れとなるため永続ではない。

同様の単調なプロシージャル形状の微修正を繰り返す方針を中止。**ART-FIRST / 質の高い外部制作3Dアセットと美術審査**へ移るため、BPで[実GLB2／PBR素材／埋込みテクスチャ／複数メッシュの入庫検査](scripts/p101-w9c2-g4e7bp-artist-asset-intake.mjs)、元制作物・権利宣言・Y-upメートル単位・強制HOLD・Node独立テスト・専用軽量CIを追加。詳細：[BO最終美術監査とBP運用方針](docs/W9C2_G4E7BP_ART_FIRST_ASSET_INTAKE_HOLD_JA.md)。これは**高品質GLB実制作やゲーム画面での検証完了を意味しない**。旧BK専用WebGL2描画は任意のリッチGLB対応ではないため、将来独立したPRIVATEレンダラー適合が必要。

`scripts/build.mjs` と `web/drive3d.mjs` は今回不変更（大量CI起動回避）。元物理B48 7本／動体B51 28基／gap52／240Hz、main/Gold/本番/原作サイト不変更。正式Slope2認定0m、Human/ART/PUBLISH/Ready/Merge HOLD。

## G4E-7BO — BN固有の都市全体を実カメラ内に再配置（2026-10-25 JST）

[BN専用CI #40165794276](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40165794276) は**SUCCESS**：正規240Hz実3視点、2本のGLB(各約246kB)、公開隔離PASS。BNはBMの単調な筒より塔・居住層・屋根形状が見えるが、**都市の大部分が画面左端に切れている**ため巨都市の美術目標は未達・ART HOLD。原因はBMの筒モデルに最適化した座標を、形状が異なるBNにそのまま転用したこと。

BOは**新しい建物を乱造せずBNと完全に同じ三角形を使用**し、BN元GLBの頂点とBG真正240Hz P96視線からモデル全体をフレーム内に再配置する。TRUE/SWITCH各道路の実カメラ3視点をスコア化、道路中央下部・近すぎる構造・B48近接を減点、元BNと同一条件のWebGL画像比較で判断する。Dedicated PRIVATE `g4e7bo=framed`、本番・main・Gold・原作サイト不変更。**数値PASS≠美術PASS**。施工や公開許可を意味しない。[BO監査](docs/W9C2_G4E7BO_BN_TRUE_CAMERA_FRAMING_HOLD_JA.md)。Human/Art/Publish/Ready/Merge HOLD、正式Slope2認定0m。

## G4E-7BN — BREAKWATER CITADEL：主役都市の造形そのものを改修（2026-10-25 JST）

BMの[CI #40164933668](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40164933668) は**SUCCESS**。実バイナリGLB（TRUE/SWITCH各約488kB、6,704三角形）、Chromium同一正規240Hz高速カメラでBK2/BL/BMの9枚比較、PRIVATE/public/public-safe隔離を確認。カメラ合わせによって画面内へ建築が復帰したが、外観は巨大な白い筒状構造に過ぎず、居住都市・奥行き・美術的独創性の目標から大幅未達。**BM技術PASS／美術REJECT**。[BM WebGL成果物](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40164933668/artifacts/12588690357)。

BNで旧筒状外殻を主役から外し、**1地区の建築形態を作り直す**：4枚の不規則な厚い都市基盤、真の抜けを持つ非対称2翼の大屋根、238m・302m・214mの異なる高層住宅塔＋小型2塔、実居住層のガラス面・採光部と立体的都市間接続。BMで確認した実P96カメラの固定ワールド座標補正を再利用し、別GLB候補としてPRIVATE隔離する。**まだ美術合格ではない。** モデリングはコード生成でBlender手作業とは称さない。[BN監査と実画像ゲート](docs/W9C2_G4E7BN_BREAKWATER_CITADEL_HOLD_JA.md)。B48道路7/実B51動体28/欠落セル52/240Hz/原本・公開隔離不変。正式Slope2 0m、Human/Art/Publish/Ready/Merge=HOLD。

## G4E-7BM — 実240Hzカメラ投影から建築配置を最適化（2026-10-25 JST）

BL最終[CI #40163689908](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40163689908) **SUCCESS**：2本の本物のGLB、独立正常ロード、実WebGL撮影、公開隔離PASS。ただし実保存画像ではTRUE 122.9m/s／SWITCH 112.2・125.8m/sの**すべてで新都市建築がほぼ見えない**。BK2は近い巨大な壁が見える。よって**BL技術PASS／美術REJECT**。単にGLB三角形数を増やす失敗を繰り返さない。

BMでは既存BLの同じ実3Dモデルを保持し、`g4e7bgNativeFrames()` の真正のP96起点00・240Hz非人間3カメラから eye/front/right/up を復元し、見通し角・建築投影率・遠近・道路中央下部の遮蔽・実B48車道との水平距離を加味した位置最適化を実装。これは**カメラ/物理変更ではなく、PRIVATE表示専用GLB頂点の固定ワールド座標変換のみ**。TRUE/SWITCH両道路GLB生成、元BK・不採用BL・BM三者を同一高速カメラで撮影する専用テストを追加。[BM専用CI #40164933668](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40164933668) はキュー入り。現物画像を見る前に美術PASSとはしない。

[BM独立監査](docs/W9C2_G4E7BM_CAMERA_PROJECTION_PRIVATE_HOLD_JA.md)。PRIVATEオプトイン `g4e7bm=registered`、生成フラグ `DOPAGAKI_G4E7BM_VISUAL=1`。Blender制作とは称さない。新B48/B51・偽道路・カメラ補正・速度変更無し。**正式Slope2=0m、Human/Art/Publish/PR Ready/Merge=HOLD**。main・Gold・本番2サイト不変更。

## G4E-7BL — OPEN CROWN ARCOLOGY / 単一主都市地区のPRIVATE実制作（2026-10-25 JST）

**現在は実制作コミット済み／CI実行待ち／美術HOLD。** BK V2の実GLB2＋6素材＋法線＋ライティング基盤を流用し、コードで造形する単一の中空都市地区へ転換した。曲面の二重外殻、真に穴の開いた天空中庭2つ、厚い居住テラス5つ、270m級の都市主塔、立体連結部材を造形。道路際の不透明壁を繰り返す代わりに、B48第2道路から離れた開いた都市断面を目指す。

PRIVATEビルドだけに生成するGLB2は TRUE/SWITCH両条件。フラグ `DOPAGAKI_G4E7BL_VISUAL=1` および `DOPAGAKI_G4E7BE_VISUAL=1`。PRIVATE走行プレビューの個別選択 `g4e7bl=open-crown`。BK2と同じP96非人間240Hzカメラの3条件（TRUE 122.936m/s、SWITCH 112.189/125.796m/s）で実Chromium画像A/Bを別途専用CIに実装。[CI #40163689908](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40163689908) は開始時点でQUEUED。確認前に結果をPASSと呼ばない。[BL監査と美術審査手順](docs/W9C2_G4E7BL_OPEN_CROWN_PRIVATE_HOLD_JA.md)。

**正直な制作方式**：実バイナリGLBだが造形はコード制作であり、Blenderモデル・テクスチャ・一般glTFモデルの完全互換ではない。見た目の改善は実WebGL画像を確認するまで未認定。**正式Slope2=0m、Human/Art/Publish/Ready/Merge=HOLD。** main/Gold/本番/原作は変更せず、既存ブランチとDraft PR #46のみ。

## G4E-7BK — PRIVATE実バイナリGLB・法線付き素材描画の検証完了（2026-10-25 JST）

**基盤技術成立**。従来の頂点色付き板・梁だけの景観から、独立GLB2（TRUE/SWITCH各約208KB、2,832三角形、6種類のglTF Metallic/Roughness/Emissive素材＋3D法線）と実WebGL2の独立照明・反射・発光・霧経路へ移行した。作者は**コード生成されたGLB**であってBlenderで精密に造形したと偽らない。既存B48道路・B51動体・本番シェーダーは不変更。第1案[CI #40159691780](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40159691780) **SUCCESS**、Chrome4/4。実画像はまだ黒い大壁が近過ぎて道路横の視認が悪かったため、上記技術合格でも美術は不合格。

**V2で大きな開口・外側距離・明るい素材調整**：連続外殻の約35%以上を実空隙にし、近過ぎる始点と路肩距離を修正。改修版[CI #40160159906](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40160159906) **SUCCESS**（Native GLB2検証両道路、Chromium4/4再試行なし、PRIVATE118／public114／public-safe5、BK私有GLB/BC路面/BGフレーム非公開隔離確認）。[実Chromium比較画像 #12586186814](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40160159906/artifacts/12586186814) を旧第1案画像と同じTRUE122.936m/s、SWITCH112.189/125.796m/sの240Hz非人間走行カメラで比較。見通しと建築の量塊・素材表現は初版より改善したが、屋根や窓の反復と画面右側の大質量が残り、独創的で密度ある巨大SF都市には依然届かない。**美術ART HOLD／人間QA HOLD／公開HOLD**。

**次BLの最優先課題**：GLB技術とコード生成された単調な都市造形を混同しない。GLBを本物の手の込んだアセット制作（例：Blenderの階層ノード・インデックス付きメッシュ・テクスチャ/法線/ラフネス）へ接続し、素材・地形・都市階層・構図を一体として作る。ただし現在のBKパーサーは単一ワールド座標・unindexed・6マテリアルのみの**実験的サブセット**であり、一般Blender GLB全てに対応したと主張しない。あくまで同一実カメラのスクリーンショットを採否基準にし、量産を避ける。[BK技術・美術監査](docs/W9C2_G4E7BK_REAL_GLB_MATERIAL_PRIVATE_HOLD_JA.md)。正式Slope2認定0m、Human/Art/Publish/PR Ready/Merge=HOLD、main/Gold/原作/本番不変。

**モデル本体も検証可能**：[最終BK成果物CI #40160600019](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40160600019) SUCCESS。Actionsの[成果物 #12586536198](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40160600019/artifacts/12586536198) にTRUE/SWITCH両条件の**実GLBバイナリ各約208KB**と対応WebGL画像を同時保存。現地ではなくGitHub Actionsアーティファクト（14日保存）、再生成するコードはGitHubで永続。技術成立／造形美術HOLDであることは不変。

## G4E-7BJ — 巨大SF都市の画面内描画確認／美術案REJECT（2026-10-25 JST）

BIまでの都市が上方向・左右に切れてゲームの実カメラに映らない問題へ、BJでは**道路側方・下方に都市の実質量を配置**。PR #46の現行PRIVATE BC rollDeckを不変更、正規起点00/240Hz・2種実道路・28基の動体とgap52を維持。非衝突GPUの4街区/32開放空間/176都市セル/48断崖底面/6304三角形で、画面内に本当に入るかを実物理カメラ投影テスト化。最終[CI #40158555150](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40158555150) SUCCESS：Native4/4・Chromium4/4再試行0、PRIVATE115・public113・public-safe5、公開にBC/BG実験JSON混入なし。TRUE 18.5秒122.936m/sで実表示面中心728三角形、SWITCH 18.5秒125.796m/sで中心614面。現物[WebGL画像成果物 #12585319182](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40158555150/artifacts/12585319182)。

**重要・美術はREJECT。** 物理的に画面に入ることは改善したが、現物は白色の柱と平板な水色/橙色/青色リボンが交差した仮設足場に見え、超未来居住都市の実質感・統一的建築形態・材質・ライティング・奥行き/ランドマークは目標から極端に遠い。技術的にPASSでも美術PASSはない。外積3成分目を欠く不具合が再発（初回CI失敗）したため明示的な3成分finite guardを追加して修正。

**全体方針変更：BF→BJで繰り返してきた独立小型頂点色メッシュの量産では目標品質を実現できない。** 次BKは既存走行カメラの本物の画像を構図基準にし、設計された建築の連続大質量・実開口・街区構造・素材・光・遠近を統合したアセット制作/表示方式を検証する。可能であればBlender/GLB等の本物のモデルと専用のマテリアル/ライト付きPRIVATEレンダーパスを比較し、既存の単一頂点色シェーダーから必要な範囲で脱却。**いきなり大量の単色板、細い梁、棒、リングを増設しない。** まず小さな範囲の本物の建築品質を作り込み、景観を一気に良くする方針。Gold・本番・原作再現・物理・カメラ・操作は不変更。認定Slope2=0m、人間QA/美術認定/公開/Ready/MergeすべてHOLD。[BJ監査](docs/W9C2_G4E7BJ_ABYSSAL_STRATA_REJECT_JA.md)。

## G4E-7BI — 実B48遠景多層都市・最終実WebGL審査（2026-10-25 JST）

**[修正版BI CI #40156775824](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40156775824) SUCCESS。** Native generator両道路・本物の起点00/240Hz/7実B48/28実B51、Chrome Chromiumの**4/4テスト再試行なしPASS**、PRIVATE 114ファイル／public 112ファイル／public-safe 5ファイルでBG/BC非公開JSON隔離PASS。[元の実画像・BHとBI同じカメラの比較 #12585330822](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40156775824/artifacts/12585330822)。

**失敗と修正**：最初のBI実装では3D梁メッシュの外積の第3成分が欠落し、4街区の各2268座標が不正になった。最初は道路区間外配置を疑って場所を調整したが、同数のエラーが続いたため各街区の診断で原因を特定。数学的外積3成分を修復し native CI PASS。旧BF/BH、道路・障害物・カメラの変更なし。

**写真に基づく美術判断：HOLD／現案は未採用**。TRUE 18.5秒・122.9m/sの実P96カメラでBHとBIは同一速度・位置。SWITCH 17秒・112.2m/sと18.5秒・125.8m/sも撮影。BIの中間都市テラスと発光リブが前方に現れ、旧BFの真っ黒な壁は戻らず、高速路面視認性が失われた様子はない。ただし主都市外骨格は画面上部の外に切れ、縦方向の都市密度・構造連結・数百m級規模感を走行視点では表現できない。**単なるメッシュ数・ユニットテスト・スクリーンショット生成を美術PASSと扱わない**。人間A/D公平性も未認定。

次 BJ では見せる建築を上空へさらに追加するのではなく、正規ボール相対カメラ視野内の**地平線近くから道路の下方/側方**まで、実スケールの空中都市の中間高さ・裏面・巨大人工断崖・入居可能な街区・立体連絡構造を豊かに設計し、同じBG高速カメラでビジュアル主役が画面内に明確に入るかを先に審査。路面・カメラ角度を無断で変更せず、全候補をPRIVATEの独立景観に保持する。正式認定Slope2距離0m、Human/Art/Publish/Ready/Merge=HOLD。詳細[BI監査](docs/W9C2_G4E7BI_PARALLAX_HOLD_JA.md)。

## G4E-7BH — OPEN HORIZON 実空間に抜ける4都市構造をPRIVATE制作（2026-10-25 JST）

**背景**：BG同一正規240Hz高速カメラは BF を大きな暗色壁として美術REJECT。BHは単なる色替えではなく、実路肩から165m以上外側の4都市主構造・大空洞8方向・高低差ある外側連結テラス16・明色の非反復3Dリブでスカイラインを大きく再設計。実7 B48、28動体B51、実欠落セル52、操作・カメラ、旧候補・Gold・本番は**完全保護**。BC rollDeck／正規240Hz／P96非人間カメラ t=17.0/18.5sec で元都市・不採用BF・BHを同位置比較する。通常BEから手動A/Dも引き続き動作。PRIVATEのみ URL パラメータ `g4e7bh=open-horizon` が追加。

専用CI [#40154982364](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40154982364) は**起動済みで結果確認待ち**。実WebGL撮影による視認性・都市としてのスケール/深さ確認前には**BHの美術PASSを主張しない**。正式Slope2=0m、人間QA・美術承認・Publish/PR Ready/Merge=HOLD。[BH監査](docs/W9C2_G4E7BH_OPEN_HORIZON_PRIVATE_HOLD_JA.md)。反復の効率は独立景観モジュールで上げる。

## G4E-7BG — BCの実高速240Hzカメラ・景観A/B検証完了（2026-10-25 JST）

**[専用実CI #40154087436](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40154087436) SUCCESS。** Native240Hz BC/起点00固定P96の観測テストPASS、Chromium Playwright **3/3初回PASS・再試行0**。PRIVATE 112ファイル、public 110ファイル、public-safe 5ファイルを検証。後二者にBG高速度フレームJSONまたはBC未採用路面JSONの混入なし。スクリーンショットは[Actions成果物 #12584250768](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40154087436/artifacts/12584250768)（閲覧可能期間14日）。BE手動A/Dと混同しない**SCRIPTED READ-ONLYフレーム**で、人間プレイの証拠ではない。

**実画像比較・美術判断：BF仮説REJECT。** 起点00から18.5秒のTRUE-PINCH 122.9m/s、PINCH-SWITCH 125.8m/s、SWITCH 17.0秒112.2m/sの高速実カメラで撮影。元景観は反復巨大ポール/門であり、BFへ交換すると暗色の巨大壁状メッシュが景観の大部分を占め、都市の階層感・空の抜け・100m/s超の道路先読みが改善しない。初期52m/sだけの検証と異なり中盤の本物のカメラで欠点を可視化できた。**技術CIが成功しても視覚的完成とは判断しない。**

次BHでは路面/操作を変更せず、同じ正規BG高速カメラで大きく空が抜ける本物の空隙、明暗と立体レイヤー、前方走行路の遮蔽軽減をねらった新景観を作る。数mの道路左右微調整や暗い箱の増築は禁止ではないが、この課題の主手段にはしない。GitHubの既存仕様/BE・BG操作導線/原作再現・Gold・本番不変更。人間の楽しさ・公平性は依然未評価、**正式Slope2=0m、Human QA/Art認定/公開/PR Ready/Merge=HOLD**。[BG監査](docs/W9C2_G4E7BG_REAL_SPEED_VISUAL_AUDIT_HOLD_JA.md)。

## G4E-7BF — SKY FRACTURE：BC実道路沿い巨大SF景観の独立PRIVATE制作（2026-10-25 JST）

BE修正版 [#40148567626](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40148567626) はChrome2/2再試行0、公開隔離PASS。**全体方針監査**：物理の微小改造・診断を繰り返して人間の楽しさ/遠景都市美術を後回しにしていた点は効率・目的ともに改善余地あり。そこでBFは道路を追加改造せず、BC rollDeckの正規7実B48・28実B51・gap52・手動A/D・240Hz・ボール相対カメラをそのまま使用し、実路面から外側140m超の独立した3つの**非直方体・実開口・非対称数百m級〜約900m巨大都市構造**を実GPUに構築する。PRIVATE opt-in `?g4e7al=manual&g4e7be=roll-deck&g4e7bf=sky-fracture`、通常BEは比較対照として維持。実Chromiumで有無比較・両道路・画面画像・性能を検査、結果が出るまで美術合否保留。技術CIは実験が成立する証拠であって人間の楽しさではない。

**恒久効率方針**：小〜中規模意味ある機能差分、既存BEランナー再利用、GitHub PROJECT_STATE自動継承、共通driver/build修正をまとめてCI乱発を抑制、1工程ごとにネイティブ/実WebGL/公開隔離を別々に確認。実験結果が悪ければ設計を棄却し、0.1mの微小調整反復に戻らない。正式Slope2=0m、Human/Art/Publish/PR Ready/Merge=HOLD。[BF監査](docs/W9C2_G4E7BF_SKY_FRACTURE_PRIVATE_HOLD_JA.md)。

## G4E-7BE — BC rollDeckを実Chromium PRIVATE手動WebGLへ接続（2026-10-25 JST）

BC rollDeck（直近の最良だが未採用実道路、第2道路最後の実接地u=.60434/.60473）の2道路を独立localhostだけにビルド。起動入口：`RUN_G4E7BE_MANUAL.cmd` → `http://127.0.0.1:4373/drive3d/?g4e7al=manual&g4e7be=roll-deck`。正規00出発52m/s、240Hz実B48道路7本・B51-C動体28基・実gap cell52、A/D／左右矢印の真手動、P96固定自動操舵を不使用。OVERDRIVE、標準ボール相対カメラ、ゲームオーバー直JSON保存・2道路比較・試走再記録を既存G4E7ALのPRIVATE UIと共有。新規BC ID/provenance不整合時は実ロード拒否。Gold・AY・BD・原作再現・2本番不変更。

**[初回BE本物のChromium検査CI #40148317936](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40148317936) はジョブSUCCESS。** Unit 2/2 PASS、PRIVATE BC 2生成PASS、Chrome/SwiftShader WebGLで明示ゲート・BC A/D・両道路切替・JSONダウンロードを実ブラウザで実行、public/public-safe両ビルド（BE環境変数が有効でも）BC候補JSON混入ゼロ確認PASS。自動写真2条件＋計測ログは同Actions artifact #12582505058に保存。ただし2番目のChromeテストは**初回1失敗、再試行でPASSのFLAKY**であったため無条件のクリーン合格とはしない。

原因の候補は、2道路目への`load()`が非同期中なのにテストが前道路のmodeフラグだけを読んで入力したこと。修正コミットではcanvasに実ロード済みBC実道路IDを追加し、2道路目の実ロードIDとmanual準備完了が両方成立するまで操作を待つ。[修正再検証CI #40148567626](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40148567626) **SUCCESS／Chrome 2/2テストを再試行ゼロでPASS**。実ロード済みBC道路IDを照合してから2条件目を操作し、ロード前入力の競合を除去。正規PRIVATE実路面生成・公開／public-safe隔離も再度PASS。手動人間プレイと美術品質はHOLD。

BEは本番公開も正式コース採用もしていない。テストによるWebGL起動確認と、人間が遊んで見やすい・楽しい・公平かの評価を厳格に区別する。実機手動、人間QA、都市造形の美術審査は未実施、**正式Slope2=0m、Human=HOLD、Art=HOLD、Publish/PR Ready/Merge=HOLD**。次工程は実機A/D＋画面/JSONを得るか、手元のprivate Chromiumフレームを検証して視認性・曲率・遠景の箱問題を具体的に直す。BE詳細：[監査](docs/W9C2_G4E7BE_BC_PRIVATE_MANUAL_HOLD_JA.md)。

## G4E-7BD — CHASM実路面診断・大区間再制作／2案REJECT（2026-10-25 JST）

**診断CI #40147227909 SUCCESS**：BC rollDeckは第2道路u≈.558で自然離地、0.34〜0.36秒後のu≈.582〜.584で自然に再接地。u≈.6046/.6050で路肩余裕-0.970m/-0.936m、約112m/sで最終離地。道路幅はu=.53の約86m→.60の約34m→.64の約14mに急収束。曲率も強い。路面/操舵の複合要因が疑われるが、因果寄与は未確定。
実B48第2道路u=.50〜.867を中心線・幅・バンク・縦断を含む10行の長半径リボンへまとまって再制作したlongArcとdescentSweepをPRIVATE検証。全7 B48、全28 B51-C（3基実路面へ再アンカー、他25凍結）、本物のギャップ52、残り5道路、正規物理240Hz、操作、本番隔離を維持。

**[実走比較CI #40147558159](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40147558159) SUCCESS（構造・ネイティブ試走完了）／走行結果は両BD案REJECT**。

| 同一P96固定操舵・第2道路最大実接地u | TRUE-PINCH | PINCH-SWITCH |
|---|---:|---:|
| AY bankedSweep 歴史的対照 | .35751 | .37892 |
| **BC rollDeck 最良未採用比較基準** | **.60434** | **.60473** |
| BD longArc | .59439 | .41916 |
| BD descentSweep | .59267 | .45012 |

全ケース訪問2/7道路で落下。動体衝突0、BD descentSweepのPINCH-SWITCHは致命的静的衝突1件。特に切替条件でu=.42〜.45へ悪化したため、未来の実道路形状やルートガイド変更が手前の固定P96操舵へ影響する可能性がある。人間操作での再現性は未確認。**BDの大きな中心線変更は不採用。BCを保持し、次BEはP96操舵／ルートガイド差と実道路作用を切り分けつつPRIVATE実WebGLの視認性・手動QAを優先する。**

正式Slope2認定0m、Human QA HOLD、Art/WebGL QA HOLD、Publish/PR Ready/Merge HOLD。[BD監査](docs/W9C2_G4E7BD_CHASM_PRIVATE_HOLD_JA.md)。

## G4E-7BC — CROWN実3Dバンク再制作：AYより大幅に実接地が進行（2026-10-25 JST）

前工程BB [実240Hzベクトル診断 #40143385126](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40143385126) がAY継続離地u≈.358（路肩余裕+0.93m、路面法線方向+0.81m/s）、BA早期離地u≈.324（路肩+7.30m、法線方向+1.17m/s）を確認。左右への道路移動ではなく、第2実B48道路u=.267〜.600の大きな横断バンクをなだらかに再制作。AYからのBC rollDeck（66%バンク緩和・追加縦断隆起なし）およびskylineSaddle（78%緩和＋実2.6m隆起）。本当の細道・ギャップ52・後半CHASM・他6道路・実28動体を保護。エンジン・操舵・非公開外サイト・Gold不変更。

**[BC真正240Hz物理CI #40143790098](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40143790098) SUCCESS：構造テスト・両条件AY対照の起点00固定P96非人間実物理比較PASS。** 第2道路の最大実接地位置：
- TRUE-PINCH：AY bankedSweep **u=.357514** → BC rollDeck **u=.604337**、BC skylineSaddle **u=.604365**。
- PINCH-SWITCH：AY bankedSweep **u=.378923** → BC rollDeck **u=.604734**、BC skylineSaddle **u=.604825**。
- 生存時間 TRUE/PINCH：AY 16.59167/16.65417秒 → BC rollDeck **19.58333/19.41250秒**、BC skylineSaddle **19.57500/19.40000秒**。
- 全条件の訪問実道路2/7、動体衝突0・致命的静的衝突0。まだ第2道路u≈.60以降で落下し、全7道路完走は未達。

**判断：BCは接地距離改善の有望な未採用PRIVATE候補。** 2案の実走差はごく小さく、物理的改変が比較的単純なrollDeckを次工程の研究基準に優先（品質の正式採用ではない）。AYは変更なしの歴史的対照として維持。法線速度・バンク・路面接触の寄与分離は完了しておらず、人間が安全に曲がれるとの判断もしていない。次BDではrollDeckのu≈.53〜.72の接地・路肩・自然飛行・曲率をベクトル診断してから、CHASMへの本物の道路断面接続を改善する。遠景都市の箱問題・実WebGL視認性も未評価。

正式Slope2認定0m、人間QA=HOLD、美術/WebGL QA=HOLD、公開・PR Ready・merge=HOLD。[BC監査](docs/W9C2_G4E7BC_CROWN_BANK_PRIVATE_HOLD_JA.md)を参照。

## G4E-7BB — 接地喪失の3Dベクトル解析（2026-10-25 JST、CI結果待ち）

BAの左右オフセットは実接地距離を縮めたため、推測に基づく連続なコース移動は停止する。AY bankedSweepとBA outerContourを同じ起点00・正規240Hz・固定P96入力で比較し、第2実B48道路u=.20〜.55の**3D速度・接線・法線・縦勾配・曲率・レーン余裕・接地断続**を読み取り専用で収集するBBを実装。単発非接地と継続非接地を区別し、曲率のv²κはあくまで幾何学的目安とする。[BB監査](docs/W9C2_G4E7BB_VECTOR_AUDIT_PRIVATE_HOLD_JA.md)。

**BBは診断工程であり路面の正式採用も性能改善も未主張。結果は専用CI実行後に確定する。正式Slope2=0m、人間/美術/公開/Ready/merge全HOLD。**

## G4E-7BA — 第2道路左キャッチメント実制作・正規240Hz REJECT（2026-10-25 JST）

AY bankedSweepから、第2道路u=.267〜.600の実B48 11行を左に連続的に再制作した（outerContour最大9m / cliffBowl最大13m）。実CROWN/CHASM細道・本物のギャップ52、全7本B48、実28基B51-C（2機再アンカー）、正規240Hz・原操作を維持。既存物理/生産ルート/main/本番を変更せずPRIVATE候補として実装。

**[BA真正240Hz実走CI #40142666494](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40142666494) SUCCESS：構造テストと起点00固定P96比較完走（非人間）。しかし改善はなし。** 第2道路の最大実接地u：
- TRUE-PINCH：AY **.35576**、AZ longGlide .35338、BA outerContour **.32110**、BA cliffBowl **.31084**。
- PINCH-SWITCH：AY **.37595**、AZ longGlide .35523、BA outerContour **.32342**、BA cliffBowl **.31270**。
- 生存秒：AY 16.59167/16.65417、BA outerContour 16.02083/15.87500、BA cliffBowl 15.79583/15.60417（TRUE/PINCH順）。
- 全候補2/7実道路で落下、動体接触0・致命的静的接触0。BAは第2道路u≈.29〜.32から既に接地が不安定で、左方向9〜13mの路面移動は逆効果。

**判定：BA outerContour / cliffBowl = 走行性能REJECT、PRIVATE保管のみ。AY bankedSweepが最良の未採用比較基準。** 技術CI=PASS、人間QA=未実施、美術QA=未実施、正式Slope2=0m、公開/PR Ready/merge=HOLD。

次工程は任意の左右オフセット試行を繰り返さない。100m/s直前の**ボール速度ベクトル・道路接線・路面法線・実接地/浮遊イベント**を同一座標系の240Hzトレースで確認し、カーブ・勾配・自然離陸と操舵の寄与を切り分けてから、見通しのあるCROWN→CHASM実コース区間をまとまって制作する。実WebGLの中盤視点・遠景都市の箱感も別途審査する。[BA監査](docs/W9C2_G4E7BA_LEFT_CATCHMENT_PRIVATE_HOLD_JA.md)。

## 最新G4E-7AY — 長半径の実B48「CROWN TANGENT BRIDGE」制作・試走確認（2026-10-24 JST）

AXで第2道路u≈.20までしか接地できなかったため、単純な数mの横移動ではなく、**第2道路CROWN中盤u≈.167〜.50の31×5実路面を長半径の接線連続橋へ再構築**。途中で本当に幅が狭くなるB48コアu≈.34〜.43（約14〜16m）と後半CHASM u≈.63〜.82を保持。AV第一道路・実ギャップcell52・第2道路CROWN入口とCHASM・残り5道路・全28 B51-C・操作／推進物理を保護。変形区間の実動体2基は新路面へ再アンカー、残26基を原データとして保持。不可視安全帯、磁力誘導、自動操舵、ブースト／ジャンプボタン、速度リセットは追加していない。

[AY真240HzネイティブCI #40101623682](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40101623682) **SUCCESS**。開始00・同一固定P96操舵で両道路を試験（非人間）：
- TRUE-PINCH：AX longLead **14.6667秒・第2道路最終接地u=.2057** → AY tangentDeck 16.5042秒・u=.3314 → **AY bankedSweep 16.5917秒・u=.3540**。
- PINCH-SWITCH：AX longLead **14.4000秒・u=.1991** → AY tangentDeck 16.3667秒・u=.3454 → **AY bankedSweep 16.6542秒・u=.3744**。
- bankedSweepは両道路で最も改善したが、**両方2/7道路で落下している**。実接地位置の改善は明確だが、全コース完走・人間の公平さ・見た目の合格を意味しない。
- [AY native JSON artifact #12563585098](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40101623682/artifacts/12563585098)。

最良の`bankedSweep`のみPRIVATE手動試走へ接続：`?g4e7al=manual&g4e7ay=banked-bridge`、Windows用`RUN_G4E7AY_MANUAL.cmd`。 [AY統合CI #40102058843](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40102058843) **全SUCCESS：実Chromium 28/28 PASS、PRIVATE生成、通常/public-safe両方AY生成物排除PASS**。[WebGL QA画像/artifact #12563447884](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40102058843/artifacts/12563447884)。実Windows端末での起動・人間長距離試走は未検証。

**判断：AY bankedSweepはPRIVATEの次期比較基準候補（正式昇格ではない）。** AV/AX旧候補・main・Gold・2本番は不変。人間QA、美術品質、正式Slope2認定=0m、公開、PR Ready、mergeは全HOLD。次工程AZでは、u≈.35〜.5からCHASMへつながる第2道路を区間設計として見直すと同時に、**高速度での道路視認性と箱状の都市景観を実ブラウザで評価**する。狭路の微小位置変更やテスト件数増加だけを目的にしない。[AY監査](docs/W9C2_G4E7AY_TANGENT_BRIDGE_PRIVATE_HOLD_JA.md)を参照。

## 最新G4E-7AX — LONG CROWN：高速度を前提とした第2道路入口の実B48リデザイン（2026-10-24 JST）

AWの細かい改変6案は全滅したため、第2道路CROWNを**30×4の物理セル群の制御点レベルで再構築**。AV lineSoftの第1道路・実ギャップcell52・7道路・28動体・他5道路・後半CHASMの全制御点を維持。既存の第2道路前半に、長い幅の収束（u≈.05〜.29）・緩曲率の中心線・S字と高さを持つ本物の衝突路面を置き、細道コアu≈.29〜.39・後半CHASMコアu≈.63〜.82を維持。該当路面の実B51-C2基を位置・軸・回転ごと追従。他26基を保護。**細い実道路と高速度、実ギャップを犠牲にせず、不可視サポート・ジャンプボタン・速度リセットは一切追加しない**。

[AX正規240Hz物理CI #40085562570](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40085562570) **SUCCESS**。非人間P96固定操舵・起点00でlineSoft対AXを比較：
- AV lineSoft：TRUE-PINCH 14.4958秒、第2道路最後の接地u=.1345／PINCH-SWITCH 14.4083秒・u=.1347
- **AX longLead：TRUE-PINCH 14.6667秒・u=.2057／PINCH-SWITCH 14.4000秒・u=.2006**。両方の第2道路実接地を先へ進めるが**2/7道路で落下し、全走破できず**。高速度の新しい入口として方向は有望だが人間の品質不明。
- AX wideArc：TRUE-PINCH 11.2708秒、PINCH-SWITCH 11.2542秒で静的衝突 → **採用禁止／HOLD**。
- [AX実JSON artifact #12557271039](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40085562570/artifacts/12557271039) を記録した。

longLeadだけを**PRIVATE/localhost手動A/D試走**へ接続（`?g4e7al=manual&g4e7ax=long-crown`）。`RUN_G4E7AX_MANUAL.cmd`から非公開buildと本物のWebGLで2道路を手動確認できる設計。JSONはゲームオーバー後にローカル保存可能で外部送信なし。既存AV/AU/AS、Gold、2本番URLは未変更。統合Chromium/公開隔離CI [#40085980811](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40085980811) は結果未確認のため**人間QA・WebGL最終合格はHOLD**。正式Slope2認定は厳格に0m。

次工程は**実ブラウザ画像と非人間連続トレース双方で、CROWNのu=.20以降の路肩逸脱を見直す**。小さな座標掃引を繰り返すのではなく、走りやすいコース全体の構成・見える前方の予告・巨大都市の造形へ戻す。人間が試した合格なしに正式採用・Ready化・merge・publishしない。[AX工程監査](docs/W9C2_G4E7AX_LONG_CROWN_PRIVATE_HOLD_JA.md)。

## G4E-7AW — 第2道路CROWN進入の実物理・詳細比較（2026-10-24 JST）

実B48第2道路の高低差・S字を減らした4案、および細道幅を拡大せず実路面を12m/18m移動した2案を独立実装。7本の実道路、28機のB51-C、真のギャップcell52、AV第1道路を保護し、実路面へ動体4基を追従させた。

**物理テスト3回ともSUCCESS、ただし改善なし**：
- [#40082792851](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40082792851)：flowSoft 14.292/14.196秒、flowOpen 14.117/14.021秒で落下。
- [#40083160854](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40083160854)：entryEase/flowClearは約11.3〜11.4秒に静的衝突。
- [#40083613700](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40083613700)：laneAlign12 14.275/14.175秒、laneAlign18 14.271/14.171秒で落下。

AV lineSoft比較基準14.496/14.408秒より延長できなかったため、**AWはすべて不採用/HOLD**。第2道路CROWN u≈.12〜.13の接地喪失後、u≈.14で右路肩を越える。後の14秒台落下は結果であり、真の出発点ではない。次AXは細道入口の長い予告・自然な曲率・高速で通過可能なレーンを再設計し、細かい数値掃引を繰り返さない。

別件：AV/AU実Chromium [#40081979873](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40081979873) FAIL。AVステージIDにLINE SOFT/LEVEL末尾が欠落、カメラ初期state nullからyaw参照エラー。修正コミット10ccf5fで対応したが[再検証CI #40084099231](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40084099231)結果未確認。正式Slope2=0m／Human/Art/Publish/PR-Ready/Merge=HOLD。

## 最新G4E-7AV — 実B48進入蛇行の緩和で第2道路に到達（2026-10-24 JST）

**AV長距離実測を追記**： [#40081842160](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40081842160) **SUCCESS**。[JSON artifact #12555371977](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40081842160/artifacts/12555371977)。AV lineSoft/lineLevel×TRUE-PINCH/PINCH-SWITCHの開始00固定P96非人間240Hz・最大38秒試験で全4ケースが第2道路に到達する一方、**第2道路走行中14.296〜14.538秒で再び落下。訪問2/7、動体接触0**。少なくとも第1道路の先行7秒落下は解消したが、全7道路走破・完全解決ではない。次G4E-7AWでは第2道路内の実曲率／高低差・レーン選択を改良し、実走行で検証する。最新ブラウザ統合検査は該当HEADのCIで合否を照合し、未完了ならHOLDのまま。**正式Slope2=0m、人間/美術/公開=HOLD**。


**開始00の落下原因を特定**。正規240Hzの第1道路離陸トレース [#40080678294](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40080678294) により真ギャップcell52より遥か手前、第1道路u≈.288／2.60秒で意図しない離脱。第1・第2道路の結合座標は正確に同じ。垂直上り勾配だけを和らげた3候補は全て未改善。そこで**第1道路の実B48中心線の過大な左右蛇行を緩めた**AVの2案（lineSoft/lineLevel）をAT原本を保持したPRIVATE候補として制作。 [AV正規240Hz比較 #40081219349](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40081219349) 全SUCCESS：原本ATはTRUE-PINCH 7.025s／PINCH-SWITCH 7.058sで落下、両AV候補は**2道路とも12秒走行継続し、lineSoft第2道路到達7.933s/7.858s、lineLevel 7.754s/7.821s**。本物の残り6道路・実動体28基（変更路面に実物01を追従）・実ギャップcell52は維持。これは非人間P96固定操舵であり、**全7/7・人間の公平性/面白さ・アートの合格ではない**。AVはlocal PRIVATE手動に `?g4e7al=manual&g4e7av=lines`（より穏当なlineSoft既定）／比較用 `&g4e7avGrade=level`。 [AV監査](docs/W9C2_G4E7AV_REAL_FIRST_ROAD_LINE_PRIVATE_HOLD_JA.md) を参照。正式Slope2距離0m、HUMAN/ART/PUBLISH/MERGE: HOLD。

## 最新G4E-7AU — 開始00から第2道路への連続到達性と実道路2チェックポイントの分離QA（2026-10-24 JST）

AU実240Hz長距離CI [#40078962476](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40078962476) SUCCESS。証拠 [artifact #12554531826](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40078962476/artifacts/12554531826)。
**開始00から非人間P96固定操舵では、ASもATも第1道路で7.025s（TRUE-PINCH）／7.05833s（PINCH-SWITCH）に落下。第2道路へ未到達（訪問1/7）。** 第2道路の孤立ネイティブ開始 u=.18/.70×105/165m/sは、105m/sで3.4s継続したが負の路肩マージン。165m/sでは障害物衝突／落下。**孤立開始の継続＝開始00からの到達でも人間の公平な走行でもない。** このブロッカーを見逃さず、AT原本不変更の独立AU PRIVATE「第2道路直接試走」候補を追加する。2つの追加QA開始点と実28障害物/全7道路/真ギャップは同じ物理。localhostのみ `?g4e7au=inspect&g4e7auPoint=crown|chasm&g4e7auSpeed=105|165`（チェックポイントはレース進行の救済機能ではない）。次の工程は第1道路で空中離脱する原因をレース本体の実B48形状と操作可能性で修正する。**正式Slope2=0m／Human/Art/Promotion/Publish/PR Ready/merge=HOLD**。 [AU監査](docs/W9C2_G4E7AU_CONTINUOUS_ROAD2_PRIVATE_HOLD_JA.md)。

## 最新G4E-7AT — CROWN THREAD＋CHASM SWEEP：真2道路の連続3Dコース制作（2026-10-24 JST）

**AT専用CI #40077679372 SUCCESS／ブラウザ統合CI [#40077944798](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40077944798) 全SUCCESS（Chromium19/19、PRIVATE build、公開/公開安全モード隔離PASS）**。 [画面artifact #12554380582](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40077944798/artifacts/12554380582)。`RUN_G4E7AT_MANUAL.cmd` を追加してWindows privateローカル起動を1操作化（人間QAの合格を意味しない）。多数の旧CIが共通ファイル変更で同時に起動する効率問題は未解決で、今後は対象別CI＋節目のフル回帰とする。人間/美術/認定/公開はHOLD。\n\n前工程ASの実WebGL写真では、スタート直後の道路が幅54〜55mで広く見え、直方体型景観の弱さも再認識した。診断を繰り返さずコース制作を加速するため、ASの真B48第1道路を保持し、**第2道路にさらに2つの独立した実3D狭路**（最大27m級S蛇行／高低差23m／横傾斜・衝突有効）を制作した。第2道路のP95/A13実障害物4基を路面位置と向きに追従し、他24機、全7道路、真ギャップcell52、原本ASを保護。専用CI [#40077679372](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40077679372) SUCCESS：CROWN_THREADの実細道長244.97m・幅12.10〜16.17m、CHASM_SWEEPの実細道長294.33m・幅13.80〜15.98m、**約539.30mは新規制作された実B48物理狭路長で、正式Slope2 DNA距離ではない**。240Hzの2.4秒×6条件PASSは7/7完走ではない。ブラウザ手動QAは `?g4e7al=manual&g4e7at=crown-chasm` でPRIVATE localhostのみ。Human/Art/Fairness/Publish/PR Ready/merge: HOLD。正式Slope2認定0m。 [AT技術監査](docs/W9C2_G4E7AT_CROWN_CHASM_PRIVATE_HOLD_JA.md) に詳細。

## 最新のG4E-7AS — 真のB48道路を改造したBANKED SERPENT制作・localhost限定QA（2026-10-24 JST）

先行AQ/ARの診断だけでは遊びの改善が進まないため、次は**具体的な3Dコース候補の実制作**へ転換。G4E-7APを保持した独立ASは、真11m B48第1道路の2区間を大きく左右へ曲げ、上り/下り起伏＋横傾斜を付けた2つの本物の物理道路。スライダー01とローター02を変更後の実道路へ追従、残り26障害物/6道路/実ギャップcell52/離陸着地を維持。初回CI #40075983957で前方u=.08–.13の道路が実幅106–111mと判明したため上り蛇行を真11m細道u=.24–.435へ移設。次CIで合否を再確認。従来のlocalhost 2道路手動A/D・ゲームオーバー直接JSON保存へ `?g4e7al=manual&g4e7as=bank` で明示参加。PRIVATE JSON・Node240Hz・Chromium画面・公開隔離CIは最新の当該HEADの結果を照合すること。**7/7完走も人間の回避/美術品質も未認定。正式Slope2=0m、公開/PR Ready・merge=HOLD**。 [G4E-7AS監査](docs/W9C2_G4E7AS_BANKED_SERPENT_PRIVATE_BUILD_HOLD_JA.md)。次ATはASの実プレイ試験から危険箇所・大区間設計の不足を評価し、一連の面白いコースとして規模を拡張。小幅修正やHUDで代替しない。

## 最新のG4E-7AR — 実ローター02接触反応と実細道左右操舵の分離検証（2026-10-24 JST）
 
**G4E-7AR 専用CI [#40074009266](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40074009266) 全SUCCESS**：Node/正規240Hz人工接触＆start00非人間操舵、Chromium15/15、private/public-safe隔離PASS。 [証拠artifact #12551629966](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40074009266/artifacts/12551629966)。AP02同じ幾何への制御接触ではpush逆方向速度反転0/各道路1件、bounce(.8)反転1/各道路1件。ただしAJ幾何はpushでも1/各道路2件の逆方向速度変化が生じるため形状依存。APの弱い早左固定入力は両道路で6.7s RUNNINGまで到達したが最小路肩投影マージン−0.87m/−1.04m。早右落下、遅右静的衝突はAJ/AP同一で未改善。**人間回避や正式美術を認定しない**。次は動体の時相と道路内で実際に到達できる左右軌跡の連続性の調査を重視。正式Slope2=0m／正式公開・採用HOLD。



本物のB51-C回転体02に人工初期位置から接触する240Hz Runner実験、実B51-OBB CCDに対する同一幾何のpush/bounce比較、真11m B48での固定A/D操舵・路肩距離を同時検証。従来のAQで早右落下がAJ/APとも同じだったため、障害物の衝突反応と道路端到達を独立測定する。**人工接触位置やP96固定操舵は人間のスタート00走行・成功の根拠ではない。** CI結果は該当HEADで確認。元7AJ/AP/Gold/main/本番を保存、正式Slope2=0m、Human/Art/Promotion/HOLD。 [G4E-7AR監査](docs/W9C2_G4E7AR_NATIVE_ROTOR_IMPACT_EDGE_PRIVATE_HOLD_JA.md)。

## 直近差分：G4E-7AQ 同じA/D時系列を再利用した真240HzのAJ/AP障害物比較（2026-10-24 JST）

**AQ専用CI [#40073189396](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40073189396) SUCCESS**（対象HEAD `1c8df3895929cab2f79733fb1a3b05600d125ce7`）。Node・真240Hz・実Chromium15/15・公開隔離までPASS。実結果：AP#01はB48中央のOBB遮蔽が0/121→36/121、#02は9/121→4/121。基準P96固定操舵は両案7.2秒継続だが、早左はAJ B51移動接触→AP静的衝突専用面失敗、早右はAJ/APとも同時刻に落下。**面白さ・公平性改善の証拠なし**。対象#02のpush接触は確認できず反発回復も未認定。実測JSON： [Actions artifact #12551693120](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40073189396/artifacts/12551693120)。次は接触後の運動や道路端の可達性を本物のRunnerで診断する。正式Slope2認定0m、人間/美術/採用=HOLD。


G4E-7APの専用CI [#40071849065](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40071849065) はNode/実Chromium15/15/非公開ステージ隔離すべてSUCCESS（人間QAはHOLD）。次のAQでは、実11m B48上の7AJ対7APを同じP96操舵履歴+早期左右A/D追加入力で非人間の240Hz比較。左右5点の動体OBB遮蔽、接触イベント、失敗・終了・速度を記録。**固定操舵による動作比較は人間の到達可能性や公平性の証明ではない。** JSON証拠はGitHub Actionsのg4e7aq-native-compare.jsonへ。結果は新HEADのCIを照合し、未確認の数字は報告しない。 [G4E-7AQ監査](docs/W9C2_G4E7AQ_240HZ_PHYSICAL_AB_PRIVATE_HOLD_JA.md)。既存物理・Gold・本番・PR#46 Draft維持。正式Slope2=0m、Human/Art/Promotion=HOLD。

## 直近差分：G4E-7AP 本物の障害物ライン選択・反発対策独立研究（2026-10-24 JST）

G4E-7AJ基準を一切上書きせず、実B51-C #01/#02の2基だけを再設計したAP候補。01は実横断slider、02は実push回転体。真11m級B48、7道路、ギャップcell52、他26動体、正規240Hzエンジンを維持。独立private JSONとlocalhost `?g4e7al=manual&g4e7ap=duel` 専用手動2コース比較へ接続。技術Node/Chromium/公開隔離検証は直近CIを必ず確認（コード追加＝PASSとは限らない）。手動の楽しさ/視認/反発解消未認定、正式Slope2 DNA=0m、公開/Gold/本番=HOLD。詳細：[G4E-7AP監査](docs/W9C2_G4E7AP_REAL_TEMPORAL_SLALOM_PRIVATE_HOLD_JA.md)。単なるマーカーの量産ではなく、試走した回避ラインと物理接触を比較して次を決める。

## 直近差分：G4E-7AO実障害物の早期認識研究（2026-10-24 JST）

**この節は当時のG4E-7AO記録です。最新の開発工程は上記G4E-7AQを参照してください。旧G4E-7AN美術履歴を現行工程として扱わないこと。** 開発ブランチ・Draft PR #46・主物理の保護条件は冒頭の憲章どおり。

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
