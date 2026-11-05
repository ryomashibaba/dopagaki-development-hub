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
