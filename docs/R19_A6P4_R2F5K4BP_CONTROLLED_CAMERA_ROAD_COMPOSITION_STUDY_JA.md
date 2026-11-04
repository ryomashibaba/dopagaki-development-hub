# K4BP — 正真正銘の元Cameraと別カメラ・別道路コンセプトを厳格に区別したBlender構図研究

更新日：2026-11-04 JST。隔離研究ブランチ：`research/k4bp-camera-and-road-composition-study-20261104`。

## 固定目的と前工程の事実

DOPAGAKI SLOPE — HYPER RUSHを世界水準の超高速3Dレースゲームとして完成させること、**美術評価は実画像と本人の基準で行い、CIやオブジェクト数をART PASSとしない**ことを厳守。前工程K4BOの[正本](R19_A6P4_R2F5K4BO_CAMERA_FRUSTUM_RACING_ART_JA.md)、[実native CI #41779198031](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41779198031) completed/SUCCESS、[Artifact #13298312331](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41779198031/artifacts/13298312331) から完全継承する。編集可能Blender真正原本 `K4BO_EDITABLE_GROUND_TRUTHED_VELOCITY_DCC_HOLD.blend` のSHA256 `b546174d5ae5186015981f2d6b5ee40f823cb7a4f2f9ba33f07c2bbda84264e6`（41,838,860B）を固定。実Control11307/Ultra11341元画像とSHA、元Game Blob、元Road5頂点/面fingerprintを全照合する。

K4BOで発覚した本質：正真正銘の元Camera Control11307で、Road5中央のd70mの画面高さbottom-upY=0.60698、d170mでも0.63893で、前方100mが画面高さの約**3.195%**に圧縮される。再現性のある実Camera/実Source Road5/Blender `world_to_camera_view`で確認されている。既存の巨大なRoad5とカメラ構図に、単純な塗装・壁・柱・建築模型を大量に増やしても世界水準の美術にならなかった。ART正式採用0件／Slope2 DNA 0m。

## K4BP実制作と比較の設計

**変更していいのは独立した研究用Blenderシーン・研究用カメラ複製・非ゲーム美術メッシュのみ**。元ゲーム・元Camera・公式Road5を変更してゲームの成功を偽装しない。

`scripts/p101-k4bp-authentic-camera-composition-study.py` は真正K4BO原本を読込み、真正元Source Control11307を参照した次の4画像を**明確な別条件**として区別する。

1. **ORIGINAL B48 / ORIGINAL CONTROL11307**：K4BO真正元Camera画像を、親Artifactの全SHA検証後に比較表左上の元正本として再利用。カメラ位置・レンズ・道路は一切変更なし。
2. **CHASE_OBLIQUE_LOW**：元Cameraの複製（元本体変更禁止）を元Camera位置から後方8m／横4m／上2.8mに移動し、Source Road5の前方72m地点を向け、レンズ38mmで撮影。元B48 7RoadのSource DCC可視、Road5元Geometryを変更せず、元ゲームとは異なる研究用の映画的追従視点。
3. **HARBOR_3QUARTER**：別Camera複製を前方18m／横53m／高さ12mに配置し、前方105mの本物Road5中央を望む30mmの斜め俯瞰構図。元Road5の形状は変更しない。アート・土地用途の読みやすさを検証。これもゲームCameraではない。
4. **NARROW_FIXED_ORIGINAL_POSE**：元Control11307のCameraを**数値が完全に同じ状態で複製**。同一Camera視点のまま元B48道路メッシュを**研究画像でだけ非表示**とし、元Source中央線の実Raycastによる道路高低差を沿った新規独立の26.2m幅の道路美術コンセプトを表示。幅13.1m×2＋3.3m×2の路肩と、道路外沿岸の地形を手作り断面で追加。元B48は削除・改造しておらず、研究専用オブジェクトとして.blend内の別コレクションに保存する。**実ゲームで走れるという証拠も本物のRoad5/安全なコースという意味もない。** Road5元Camera/元Geometryを改変しないまま道路幅の美術的影響だけを実験する。

**確実な比較**：元Control11307元Road5画像と上記3つの研究画像を、2×2のPNGにして同時に見られるようにする。研究Cameraの比較を「元CameraでARTが合格した」と誤称することは絶対禁止。

**真正定量測定**：元Road5のd5〜170mの実中央線の画面Y値をそれぞれの研究Cameraで`world_to_camera_view`し、d70m〜170mの画面高さ差と実フレーム内サンプル数を独立JSONに記録。Cameraが被写体を見失った場合は画像が見栄え良くてもその事実を隠さない。元rig全カメラの位置・回転・レンズは制作前後で完全一致、元Road5 Control/Ultra両方の全頂点/面fingerprintも再照合。

**素材/美術の位置付け**：研究別道路の足場、ダークグラファイト舗装、元K4BO作者塗装のshader、低い沿岸の大地の断面は独立編集可能なBlender .blendに保存する。元Source Road5の道路ネットワーク、28個B51動体、240Hz、球0.65m、アートの実ゲーム統合、公式のウェブサイト、PRを一切編集しない。

## 作業実行と安全ゲート

[実K4BP CI #41780866652](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41780866652)で元原本SHA／固定源ゲームBlobとNode source tests、Ubuntu24.04真正Blender EEVEE/Xvfb実レンダリング、3つの比較画像、完全別名保存.blend、2×2比較PNG、全SHA、実Camera数値を検証し、画像＋JSONだけをこの隔離研究ブランチへGitHub保存する。初回執筆時点ではCI最終結果・実画像・美術の合否は未判定。エラーは失敗として残す。

**変更禁止**：game Git blob `af076d67492a677d2235e4730aef8cdf4808e106`／Road5 vertex-face fingerprint `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`／元Camera全6／B48 7実道路／B51 28個実移動体／240Hz／球半径0.65m／元ゲームの安全UI・制御・カメラ／main・公式`p101-velocity-overdrive-native-trial`・Draft PR#46・本番URL2つ。Work/Computer Use開始には事前承認。ユーザーWindows操作不要。正式ART採用0件、Slope2DNA0m、HUMAN／SAT／CCD／FPS／RELEASE／MERGEは全部HOLD。

**ART評価は各画像を実見して判定する**。撮影条件や仮道路の見た目が改善しても「実ゲーム美術の正式採用」にはならない。外観が低質なら世界水準のARTはREJECT、次工程へ限定的な研究証拠のみ継承する。


## 2026-11-04 第1回真正Blender実画像（再現可能な比較結果）

- 初回 [K4BP CI #41780866652](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41780866652) は **completed/SUCCESS**。本来の元Camera6・元Road5 polygon fingerprint・元source gameのテスト/ハッシュがすべてPASS、3案 A/B/C のBlender EEVEE実画像が作成され、編集可能.blendも保存。[本Artifact #13298614792](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41780866652/artifacts/13298614792) ZIP SHA256 `b28e5dbfb2bf2eac6223c5b49a3f070d35c1b05743b595a1f7ddca30968aec30`。ZIP CRC全PASS、全元出力ファイルのSHAも独立照合して完全一致。正真正銘の編集可能Blender原本42,142,252B、SHA256 `0fd170b64880815e46112a557e0966726f1231fb282ecab2b23429c087f7bc68`。
- **遠景の実投影改善量（Source Road5 d=70〜170mのscreen Yの絶対差）：元Camera 3.1957%／追従Camera A 7.4624%／港側斜めCamera B 12.8206%。** Aは元Road5の中心点13点中10点を元Camera画角内で捕捉、Bは8点。Cは元Cameraポーズの完全な複製なので、Source Road5への投影数値は3.1957%と**元と完全一致**（画像には元Road5ではなく研究用幅26.2m別メッシュを表示）。数値による明確な比較を達成。
- **正真正銘の4画面画像を直接確認：世界級美術のART REJECTは継続。** Aの低追従Cameraは従来より若干道路・建物の遠景パースの読解が良いが単調な路面がまだ広すぎる。Bの斜めCameraは港側の壁と遠景クレーンが少し分かりやすいが、手前Road5が画面外で、ゲーム走行を継続するカメラ候補としては欠陥。Cの独立路幅26.2mはゲームらしい明確なコース輪郭が現れるが、両側の岩肌・植生は灰色の簡素な大斜面になり、一般の高級ゲーム美術として認定できない。**元B48安全/Collision/実ゲームCameraは完全に未検証**。
- **新発見**：構図はカメラだけでも改善可能だが、元のRoad5が実測で約100m幅と非常に大きく、幅を狭める研究道路案がコース認識を大きく変える一方、地形や装飾の美術素材が弱い。AとCの個別差を切り分けられたので、**Aの追従カメラ + Cの研究用独立幅26.2m道路**を同時に使うDを追加すると、2変数の組合せの影響が明確になる。
- Dの追加実装commit `c2b71187f6bbd610821e30c8b593c01b600d43e4`、CI強化commit `f59bbfb42af19679f78ab4092d16c55232fe0a33`。DはAとCameraデータ数値が完全一致する別複製、研究用狭いRoadだけを使用。**原Source Road5や6元Cameraに触れない**。元Source＋A／C／Dを2×2の公平な実画像グリッドとして作り、別途Bの港側研究画像を保存する。初回A/B/C技術成果は保持したまま追加検証する。
- 新[正式再検証CI #41781600578](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41781600578)の完了・4つのBlender研究PNG/原本SHAを後から検証しない限り、Dの成果や最終K4BP合格を断言しない。K4BPの美術正式採用0件／Slope2 DNA 0m、SAT/CCD/FPS/HUMAN/ART/RELEASE/MERGE全HOLD、元ゲーム・Road5・main・公式・PR#46不変を厳守。

## 【K4BP最終監査 2026-11-04】4条件の原本保護と実Blender独立比較完了／美術ART REJECT

### 本物の最終実行・独立ファイル検証
- [最終GitHub Actions CI #41781600578](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41781600578)は**completed/SUCCESS**。真正K4BO親原本のSHA256／全個別 bytes、Git元ゲームBlobとNodeソーステスト、元Road5 Control/Ultra polygon fingerprint、元6 Cameraの位置・回転・lens数値不変、Ubuntu Blender 4 EEVEE真正レンダリング4条件、2種類の比較PNGとJSON、GitHub研究枝への証拠保存にPASS。研究用Blenderシーンの実別名保存もPASS。**実WebGL2ゲーム画面・安全プレイ検証ではない**。
- [真正成果物Artifact #13298834318](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41781600578/artifacts/13298834318)：ダウンロードZIP SHA256 `c629f226bfc477add3547af17726b8c3efed2b0ee65a49ec1e6ee800fd26ca7b`、ZIP CRC異常なし。編集可能原本`K4BP_CONTROLLED_CAMERA_AND_ALTERNATE_ROAD_EDITABLE_RESEARCH_HOLD.blend` 42,147,492 bytes、SHA256 `93c3583655eeb48fa06d61239646bb470419c72bf84cd97235be2288240d26aa`。4つの別条件PNG・四条件2×2比較PNG・元Cameraと別斜め研究を含む2×2比較PNG・全監査JSONを独立実バイトSHA照合し**全一致**。
- [元Cameraと別Camera・別Roadの4条件の公平な2×2画像](research-evidence/k4bp/K4BP_FACTORIAL_SOURCE_CAMERA_X_SOURCE_ROAD_VS_CHASE_X_NARROW_NON_GAME.png)は、上左「**元Camera＋本物B48 Road5**」（K4BO正本画像）、上右「**CHASEカメラ複製＋本物B48 Road5**」、下左「**元Cameraと数値完全一致の複製＋研究別幅26.2m道路**」、下右「**CHASEと数値完全一致の複製＋研究別幅26.2m道路**」。元Control11307ソース画像と別条件を混同していない。横の差はCamera効果、縦の差は研究道路幅の効果、左上と右下は両方変化する。**ゲームの安全道路の比較ではない**。
- 追加の港側俯瞰Camera Bと元の4条件の別比較も保全（[画像](research-evidence/k4bp/K4BP_ORIGINAL_VS_TWO_ALT_CAMERAS_VS_INDEPENDENT_ROAD_ART_STUDY.png)）。研究Cameraオブジェクトは新規独立コピーであり、元Cameraのデータブロックは未変更。
- **数値確定（元Source Road5中心線のd=70→170m画面上縦距離）：**本物Control11307（lens≈21.6mm）`0.031957`=3.1957%、CHASE（lens38mm）`0.074624`=7.4624%、HARBOR 3/4（lens30mm）`0.128206`=12.8206%。元Cameraと同ポーズの研究道路Cは3.1957%、CHASEと同ポーズの研究道路Dは7.4624%と**比較条件のカメラ指標が正確に一致**。本物Road5中心線13測量点で元Cameraは12点、CHASEは10点、港側は8点が画面内。港側Bは元Road5の前方20m地点が画面外で、単純採用は危険。比率は奥行き描画の投影差を示すもので、**走行安全・人間操作・世界美術の合格率ではない**。

### 実4画面の美術評価：ART REJECT（正式採用0件・DNA0m）

元Source Camera＋Road5の基準画面Aは依然100m級の幅の無地路面が下画面の大半。追従複製Camera＋元Road5のBは前方の建物やクレーンのサイズが読みやすくなるが、依然道路が極端に広い。元Camera＋幅26.2mの研究道路Cは道の輪郭が狭く読みやすくなる一方、両側に巨大な灰色の斜面が突然現れて景観は模型そのもの。**研究追従カメラ＋26.2m別道路のDは、4条件の中では方向性のあるコースの輪郭が最も読み取りやすいという相対的前進を確認**。しかし道路・護岸の素材、実立体の地形、都市の文化/用途、港の船、沿岸の自然と空気、通行・道路機能、リッチな背景のすべてが不足。**DもART REJECT、公式採用不可**。港側斜めBは都市全景を見るには有用だが走行手前を大きくカットするため、追従型としては現状不適切。全候補の合否は「世界水準の美術としてはREJECT」、単に比較研究で意味のある答えが得られたという技術成果と区別。

### K4BQに継承すべき判断と非変更原則

1. **K4BPの相対的な研究リードはD（狭い独立コース＋追従Camera）。ただし正式採用ではない。** 両端の斜面がただのグレー面で建築も酷い。そのため次は、Dの視線とコース輪郭を基準に、実務的な用途・プロの質感・自然地形・街区・交通・港湾の高品質な1画面に限定して作者制作し、同カメラの本当の結果で審査する。旧い箱・屋根・柱の量産・文字や装飾を追加するだけの手法に戻らない。
2. 元B48 Road5のゲーム利用は**安全・物理・B51移動体・CCD/SAT・FPS・走行テストを含む大規模な設計判断**。元ゲームの幅100m級を研究用26.2m道路に差し替える提案を**安全性検証抜きで実施しない**。元Game/WebGL2、元Road5、元Camera全6、他6Roadと物理を厳重保護。
3. カメラは元Control11307のポーズ/データブロックと完全別に保持し、研究用CHASE等の見た目の合格を元カメラの正式ART PASSと偽ってはいけない。
4. **美術判断のための新しいゲート**：1フレームに、道路・港・地形・海・公共建築の使われ方と高い意匠レベルが成立するかを最優先。無料/既存DCC資産とBlenderで作者実3Dを制作、同視点の旧比較とBlender原本SHAを記録。数値の良さ、ポリゴン数、AIが出した印象画像だけではPASSにしない。
5. **固定保護**：元Git game blob `af076d67492a677d2235e4730aef8cdf4808e106`、元Road5 fingerprint `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、B48実7／B51実28、240Hz、球半径0.65m、元Source Camera全6、main、公式`p101-velocity-overdrive-native-trial`、Draft PR#46、本番2サイト不変。Work/Computer Use事前許可。ユーザーWindows作業不要。正式ART0件／Slope2DNA0m、ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。

**K4BP最終ステータス**：`ORIGINAL_SOURCE_PASS`、`BLENDER_COMPOSITION_TECH_PASS`、`RESEARCH_CAUSAL_COMPARISON_PASS`、`ART_REJECT`、`GAME_MERGE_HOLD`。
