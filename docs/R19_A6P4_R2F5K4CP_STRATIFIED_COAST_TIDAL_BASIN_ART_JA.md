# K4CP R1最終｜真正Blender TECH PASS・同一SOURCE CHASE直接ART REJECT（2026-11-05 JST）

**この最終項目を最優先とする。下段の「未判定／実行待ち」は開発途中の履歴であり、R1最終結論ではない。**

- **[真正GitHub Actions #42015008268](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42015008268)** はcompleted/SUCCESS、真Blender4.0.2／元CHASE768×480 EEVEE／元SOURCE全ロック／独立画像QA全成功。入力作者コード commit `3a27fda405bbbc54953ad6fbc600e4bb9b76eaf3`。SHA固定K4CO R2親`9574e6f49865cf962280caa073f2c5583cf1a3ed1ae41a9efb2a4167d6ed3c91`を開き、真正可編集3Dを2件追加し別名.blend保存。元Game／240Hz物理／元Road5／元6Camera・CHASE／木11・全灯光、継承全Mesh/Transformを保護。**ゲームCollider追加0**。
- **真正[Artifact #13409096834](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42015008268/artifacts/13409096834)** をGitHubから独立再取得。ZIP実バイト**127,183,119B**／SHA256 `c9de661ddaf4a1b02be37b49d90a26a52242acbe76a16895ba50008f9d05a96e`。独立**ZIP全メンバーCRC PASS**、監査JSONの2個別ファイルSHA/byte完全一致。真正可編集 `K4CP_TRUE_STRATIFIED_COAST_TIDAL_BASIN_EDITABLE_ART_HOLD.blend` **284,336,520B**／SHA `30a61ddfefdd960a621da0c3da802d96f44ad46b3c2115e0bd2bf46ec63cdb18`。元CHASE画像 `K4CP_TRUE_SOURCE_CHASE_STRATIFIED_COAST_TIDAL_BASIN_NOT_GAME.png` **525,549B**／SHA `3b6b0a4e0c229c7bfeb47c411a581a1a78f0846c62731516aebfd843690a4630`。
- 新3D：K4CNの尖塔地質を研究上でのみ非表示にして旧トポロジー**1600頂点**を連続岩盤へ作家変形、**1,059頂点**を実位置変更。高架の地形支持部を含む遠方**336頂点は完全保持**。既存の玩具的港メガターミナルを研究レンダーでのみ非表示。元地盤とは別に固定海水位の湾岸土木／潮間帯／海水面を**639頂点・560面**の実立体メッシュとして制作。旧港の支柱・フェリー歩道、95m高架を元形状のまま継承。正式ゲームには実装せず、3D研究だけ。
- **[真K4CO対K4CPの同CHASE全画面比較](research-evidence/k4cp/K4CP_VS_K4CO_TRUE_SOURCE_CHASE_WHOLEFRAME_ART_REVIEW.png)**：左岩盤の実画像差**17,777px**、右港画面**11,234px**、元道路中央画像差**0px**（独立保護上限120px、5点保護を全通過）。これは**画像に実際の変化があるTECH証拠のみ**。
- **真画像を直接開いてART REJECT確定**：左の不自然な三角尖塔はかなり抑えられ、連続断層に改善。しかし左の新しい面も大きく一様な灰色で岩の材質／層理と自然景観の豊かさが読めない。右は旧巨大メガターミナルが消えて空が開いたが、**新しい潮汐海面が元CHASE画面の走行体験としては明瞭に見えない**。港はなお薄い模型・屋根・古い鉄骨に見え、実働港湾と広い海の地理関係も不足。中央は巨大な単調直線道路のまま、危険・速度・進路変化・都市スケールの迫力が不足している。**ART PASSは出さない**。
- **根本課題を認定し、K4CP微修正ループは停止**：地形だけのスムージング、暗色化、海面を画面外に追加、旧巨大屋根の表示切替、CI緑を繰り返してもゲームの完成に直結しない。次に進むには**実ゲームの元Road5上に存在する変化の大きい走行場面を、元の真の物理・カメラで一体的に表現する構図とゲーム上の体験**を作者設計した上で、世界の機能と地形を物理的に繋げる。元Road5/元Cameraを改変する「見かけだけの解決」は禁止。最初から繰り返し模型を作らない。
- **正式ART採用0件、Slope2 DNA認定0m、HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD**。本工程は真正Blender制作・静的DCC検証であり実WebGL2/人間高速プレイの成果ではない。main、公式P101、Draft PR #46、原Slope/Gold、本番2サイト、元Game Git blob`af076d67492a677d2235e4730aef8cdf4808e106`、元Road5全頂点/面 SHA256`f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`を永久保護。追加課金原則0、Work/Computer Use・正式採用・公開・mergeは個別事前承認。

---

# K4CP：自然な海岸の地質と実海面の港湾を1画面で繋ぐ — SOURCE固定ART研究

2026-11-05 JST。**新方針ではない。** K4CO R2 の真Blender TECH PASS／直接ART REJECT を受け、既存QUALITY-FIRST / ART-FIRST / DCC-FIRST / INTEGRATED VERTICAL SLICE と完成目標を継承した次工程。

## 前工程の確定結論

- K4CO R2 [Actions #42012187718](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42012187718) completed/SUCCESS、別取得 [Artifact #13408380356](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42012187718/artifacts/13408380356)全CRC／個別SHA PASS。Road5/Camera固定、元ゲーム不変。
- 真CHASE直接評価では、橋が画面に入る改善があっても、道路前景が単調、左は尖った人工岩の連続、右は港の模型・骨組みで、海の位置と港湾の機能が一続きにならず**ART REJECT**。TECH PASSと区別。過去のK4CM/K4CN失敗も踏襲。
- 親K4CO R2の編集可能真正Blender：`K4CO_TRUE_SOURCE_LOCKED_FREIGHT_VIADUCT_EDITABLE_ART_HOLD.blend` SHA256 `9574e6f49865cf962280caa073f2c5583cf1a3ed1ae41a9efb2a4167d6ed3c91`。親を上書き禁止。

## K4CPで実際に実装した一体作者変更

研究ブランチ：`research/k4cp-stratified-coast-tidal-basin-20261105`。作者コード：`scripts/p101-k4cp-native-stratified-coast-tidal-basin.py`。K4CO親を厳密SHA固定し、新研究専用の真正可編集メッシュ2件を構築する。

1. **左：地層の通った連続断崖**。K4CNで失敗した三角尖塔状の真メッシュを研究レンダーでのみ隠す。親K4CM/K4CNの同一トポロジー1600頂点を実3D上で自然な長周期断層に再作者変形し、岩の地層・褶曲の起伏を大きな連続形状として見せる。K4COの橋が実地形に接続する遠側d≥145mは、元のK4CN岩盤を一頂点も動かさないことで橋のアンカーを守る。
2. **右：現実に高さが一定の潮汐海面と港湾擁壁**。同じ地盤の道路高さ実測から海水位を決め、`d=48..188m`、道路外側`s=57..183m`に一つの地続きの実3D海水面・海岸擁壁・潮間帯を設ける。道路に海を貼り付ける偽表現はしない。模型的な旧K4CN巨大ターミナルはレンダー上でのみ非表示、元メッシュと変換行列は保護。既存フェリー支持部・歩行通路・港湾土木・元K4CO高架を継承する。
3. **完成絵の狙い**：中央の真Road5高速走行に対して、左は連続した岩の量感と地層、右は低く開けた実海面・岸壁・残存する港湾設備を見せ、海岸沿いの危険な高度と視線方向を同時に認知できること。あくまでも真の元CHASEから判定し、変わった画素数だけではART合格にしない。

## 研究の安全ゲート

- 元Game Git blob `af076d67492a677d2235e4730aef8cdf4808e106`、B48 Road5全頂点面SHA `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、元6Camera/CHASE、240Hz物理、木11・全ライト、旧研究親の**全Mesh頂点/面/Transform保持**。新ゲームCollider0。親橋の支持部も保持。
- 元道路中央画素差120未満と固定5点10階調以内の独立画像保護、左右実視認確認。**閾値緩和は禁止**。異なる制作対象の技術的可視性はART PASSではない。
- 真Blender4 EEVEE／768×480固定CHASE、編集可能 `.blend` と実PNGを別名出力。GitHub Actions成功、実Artifact ZIP独立再取得CRC＋実各ファイルSHA/byte、実PNG直接観察を経てTECHとARTをそれぞれ判定する。
- 本文作成時点は**コード実装保存済み／真正Blender・Artifact・直接ART未判定**。自動テストの緑だけで正式採用しない。WebGL2実プレイ・人間操作・FPS・SAT/CCDは全HOLD。

## 固定ロックと今後

正式ART採用0件、Slope2 DNA認定0m、HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。main、公式P101、Draft PR#46、元Slope/Gold、元Gameと本番2サイトは不変更。Work/Computer Use・追加課金・正式採用・merge・本番公開は都度事前承認。ユーザー操作を最小限にし、小QAのループやデザイン的に無意味な同種模型の量産をしない。

実レンダーを直接見て、旧模型の置き換えによっても世界水準の画面にならなければ**ART REJECTを明記し、同じ造形を細かく繰り返さず、実際の遊びの統合設計へ進む**。
