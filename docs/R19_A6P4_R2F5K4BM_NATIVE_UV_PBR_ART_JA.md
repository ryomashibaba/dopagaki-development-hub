# K4BM — 真の作者メッシュ・UV素材・カメラ内Hero構図の美術試験

更新 2026-11-04 JST。隔離研究枝 `research/k4bm-uv-pbr-authored-hero-20261104`。大目標：DOPAGAKI SLOPE—HYPER RUSHを世界水準の高速3Dレーシングゲームとして**全コースビジュアルを完成**。本段階は元Road5真Camera Heroを1枚でも世界水準に到達させるための作者3D研究。**技術CI・物量の成功とART合格を絶対混同しない**。

## 1. K4BLから継承した誤りと成功

2026年11月4日確認、直前K4BLブランチ `research/k4bl-harbor-atmosphere-art-reconstruction-20261104` の最終HEAD `14a6559c8195420f05f37c2a10bfe22e1fa6e6c6`、[完全ログ](R19_A6P4_R2F5K4BL_COASTAL_HARBOR_ART_DIRECTION_JA.md)。真正最終CI #41751060525 成功、Artifact #13286275694編集可能`K4BL_HARBOR_ART_DIRECTED_EDITABLE_NATIVE_BLENDER_HOLD.blend`正SHA256 `220855d6500a74697e41b9bad36cb5c20654ea77d8c8a4be48d5ebf9a4ab2488`（36,684,824B）。真Camera control11307/ultra11341 Blender実画像SOURCE技術PASS **美術はART REJECT**。旧大屋根、硬いカラーリング、巨大で単調なRoad5、単純なランドマーク、遠景の空虚さ、実港湾の機能が見えない問題が継続。正式採用ART0件／Slope2 DNA0m。

原本：Gitゲーム source blob `af076d67492a677d2235e4730aef8cdf4808e106`、Road5元mesh頂点／面 fingerprint `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、元B48実7道路／B51実28移動体／240Hz／球0.65m／元Camera6ポーズ／安全UI・操作・当たり判定不変。main、公式`p101-velocity-overdrive-native-trial`、Draft PR #46（OPEN/Draft）、本番2URLは変更禁止。Work/Computer Useは事前承認、ユーザーWindows作業なし。

## 2. K4BMで実際に制作する差分

`scripts/p101-k4bm-authored-uv-pbr-coastal-hero.py` はK4BL真正.blendを確定SHAで開く。元K4BL/BK/BJ/BI/BHの不採用研究コレクションを消さずRenderOFF、同じ元Control11307/Ultra11341 Cameraから画像を実生成する。

- **真正UVの作者メッシュ**：独立して編集可能な断面を持つ海岸斜面、地層、一体型の西図書館、東旅客ターミナル、造形の違う港湾公共施設の構造メッシュに`K4BM_PHYSICAL_UV_EDITABLE`という実UVレイヤを焼き込む。石材・陶板・銅・沿岸植生に、UVから手設計のmulti-frequency Noise + Voronoi + 微細Bumpを適用。単純な色塗りとポリゴン数増殖を美術として採用しない。
- **実Road5の路面**：元Source Road5メッシュは一切変更せず、DCC研究でのみワールド実座標に基づく粒状骨材・タイヤ走行跡・微細起伏・物理粗さ変動・路側低彩度ハッチを改作。旧白く大きい単調な道路の視覚負担を軽減。実ゲームのshader・collision・LOD・FPSへの反映は未実施。
- **道路沿い**：K4BK/K4BLで成功したCamera相対左右座標の真Source Road5 raycastを9地点 `d=-25,0,25,50,75,100,125,150,170m` で取り直し、道路外へ7点断面の岩肌・路盤・人間サイズの植栽・歩行者レールを正しい距離で配置。
- **西図書館**：一つの紫外線耐性外装と手成形の屋根、3つの深い実開口、実ガラス／暖色図書室・展示／陽光を切る梁・読める建物用途。
- **東ターミナル**：西とは別のファン状銅屋根と25の深さの違う遮光フィン・中が暖かい旅客施設を実寸で構築。単純な「同型窓・箱」を大量に増やすのではなく、陰影・構造表現を重視。
- **遠景**：単なる円筒塔をそのまま増やす代わりに用途の異なる4つの居住可能な港湾公共施設、展望床、実荷役クレーン、自然の沿岸の段状地層・海面を作り込み、シルエットに密度を出す。
- **素材光**：EEVEE + ソフトウェアGL/Xvfb で、従来のCycles OIDN未対応ノイズを抑える。Natural Nishita世界光、実公共室内のAREAを作者指定。実全画面画像で質を審査。

真Cameraポーズと元ロードを不変指紋で前後照合し、元ゲームsourceもGit blob一致でCI検証。正式ART 0・DNA0、B51 clearance/SAT/CCD/HUMAN/FPS/RELEASE/MERGE全HOLD。DCC絵をWebGL2ゲームスクリーンショットと誤表示しない。

## 3. 実行履歴とゲート

[専用初回 CI #41756146305](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41756146305) で、元Game Blob、Nodeテスト、K4BL親Blend SHA256、Python syntax、Blender 4 EEVEE実3D、control11307 + ultra11341二原Camera、比較PNG、独立 SHA JSON、研究ブランチPNG保存を実施。初回記録時点で実画像・最終CI結果は**未確定**。後に実結果と失敗原因を追記する。

美術的な合格には、(a)実路面表面が細部までリアル、(b)近景・中景・遠景と港湾機能が走行カメラで読める、(c)素材・影と地形・景観が世界級、(d)全画面の空白や模型感を解消、(e)両視点で安定、を要求。CI SUCCESSやUV数だけで合格は不許可。実目視の結果が不足なら`ART_REJECT`、正式採用0件／Slope2 DNA0mで保存。ART合格前に他6Roadのコピー展開／WebGL2ゲーム改修／公式PR merge／本番公開は禁止。

## 初回実機の失敗と再試験

- [K4BM初回Actions #41756146305](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41756146305) は **completed/FAILURE**。親K4BL真正原本.blend全バイトSHA、元Game git blob、B48 Source Node testsとBlender依存ソフトのインストールはPASS。ただし植栽用の独立Blenderメッシュを生成中に、Camera横方向ベクトル`S`を未定義の`R`と誤参照したため`NameError`、レンダリング前に停止。**初回画像、新BLEND、Artifactは生成されていない**。元ゲーム/元B48は未変更。
- 隔離研究Pythonのみ修正commit `3841be073af6edfad77912974fa03c255d5fde0e`、変数`S`へ統一。再[GitHub Actions #41756329982](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41756329982)の画像・原Blender・実UVとSHAを再検証するまでSUCCESS/ART合格の主張は禁止。K4BL ART REJECT、正式ART0件・Slope2 DNA0m維持。

## 第1回実Blender／独立SHA／美術の中間判定

- [修正済みK4BM CI #41756329982](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41756329982) **completed/SUCCESS**、親原本`K4BL_HARBOR_ART_DIRECTED_EDITABLE_NATIVE_BLENDER_HOLD.blend`（SHA `220855d6500a74697e41b9bad36cb5c20654ea77d8c8a4be48d5ebf9a4ab2488`）、元Source Road5実メッシュFingerprint、元真Camera位置/回転/レンズ、元ゲームBlob、NodeテストPASS。編集可能.Blend・両元カメラNative EEVEE 2PNG・旧K4BL同Camera A/B・JSONを生成し研究枝に保存。
- 真[初回成功Artifact #13288132119](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41756329982/artifacts/13288132119)、ZIP SHA256 `27bf17c11c85d2bf5b4760d26312ec9fa5275edc9d75dc9cffd5b8449387e3df`、ZIP CRC PASS。編集可能Blender 39,685,172B／SHA `6ee9e0fcd6a76b29b6b68ef6dbddcf730f567d90ae37182df486f6a4c3208b8d`、control/ultra PNGそれぞれ1,653,553/1,634,023B、比較画像2,546,027B、各ファイルSHA実バイト独立一致。**本物のUVレイヤが付いた編集可能DCCメッシュ272件**、独立オブジェクト274件。技術的な新しい進歩を認めるが物量を美術品質にカウントしない。
- **初回の真正control11307/ultra11341実画像を直接観察：ART REJECT**。旧K4BLより左右のガラス・日射遮蔽・岩肌・ロード骨材の素材と近景設計が洗練された一方、中央に黒茶の高い2本の柱状建築が並び景観を不自然に支配し、道路も画面の大半が灰色で平板、人物が使う港や海、都市の地理の関係が読み取りにくい。良い部分を確認しても**世界水準のビジュアル完成には程遠い**。正式ART採用0件、Slope2 DNA0m。
- この実見に基づき修正commit `15512af0c61b16f404e72817d17310198a61474e`。画面中央の巨大で単調な2本のシリンダータワーを遠方・低い小構造へ移し、**低く展開する複雑なUV石材／実室内ガラスの公共埠頭2棟と、開放的な荷役用金属骨格の灯台**に転換。単純な高い柱を繰り返さず、実寸ロードの最終頂点d=188.774mのさらに奥の非走行背景にだけ置く。
- [追加再描画 CI #41757027430](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41757027430) は**実完了未確認**。真正元カメラPNGとBlender原本・ソースShaが揃うまで2回目の美術評価を捏造しない。最終が失敗したら前回技術PASS成果を保護、ARTはREJECTのまま。


## 【K4BM最終監査 2026-11-04】実UV Blender作者工程 TECH PASS / ART REJECT

### 技術の真偽・完全な原本検証
- [最終CI #41757027430](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41757027430) **completed/SUCCESS**。K4BL親.blend 正SHA、凍結ゲーム元blob、B48元7／B51元28／240Hz／球半径0.65m、Source Nodeテスト、9地点の真Road5 Raycast、元Road5 vertex/face fingerprint `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、元Camera control11307／ultra11341の位置・回転・レンズ数値不変、Ubuntu 24.04 Blender 4 EEVEE実レンダリング、2枚の真元Camera画像・独立RGB差分/sha・研究ブランチへのPNG保存にPASS。実WebGL2ゲーム画面ではない。
- **真正最終Artifact** [#13288142972](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41757027430/artifacts/13288142972)、ZIP SHA256 `1a394c2649f109dc4f360f1fb52539cfca5731555fc0f3d63666c4b2d30aed21`。ZIP CRCエラーなし。編集可能`K4BM_UV_PBR_AUTHOR_SCULPTED_EDITABLE_DCC_ART_HOLD.blend` 39,880,852B／sha `7297b0ea17ffacb7f2c84cecf901947ce11de4e0a91ff4c93703f43cbe7b4a80`、control11307 PNG 1,650,501B／sha `edc72ddabbe7a7b6ea1fd4cd22234eb81f43a57b2f217681a03eec81576abd70`、ultra11341 PNG 1,631,799B／sha `c0e73889f8729befb80cd147c563f6e6daeb098a3368c62bd37311702aff631a`。旧K4BLとの同Camera二視点比較PNG 2,545,323B／sha `04c71afcabb8a9262cb406db5a158542b93ba548df9e8628fce2da325bcc9827`、真provenance JSON。ZIPファイル本体・全個別Blender/PNG・ABはGitHub結果とは別にコンテナ内で独立SHA計算して一致。
- 真K4BM用 Blender研究シーンは作者メッシュの実UVレイヤが付いたメッシュ **296件**、研究用の独立編集可能オブジェクト **298件**（本数は評価の根拠ではない）。UVは3D世界座標から設計した展開＋Blender Noise/Voronoi/Normal Bump等の**手作りの手続き的材質**。実スキャンPBRテクスチャ写真や物理BRDF測定を用いたわけではない。高品質・実ゲーム実績を偽装しない。
- 元source Game blob `af076d67492a677d2235e4730aef8cdf4808e106`不変、Road5真Mesh・元Camera値不変。未許可ゲーム新Collision0、ゲーム統合0、B51動的clearance/SAT/CCD/HUMAN/FPS未実証。元main/公式p101/Draft PR #46/本番2サイト変更なし、Work/Computer Use起動なし。

### 実画像の最終ART判定：**REJECT**

- **改善を認める部分**：前K4BLより真Road5路面の粗さ・素材の斑、左右の実ガラスと奥行きのある開口／細い金属フィン、手続き材質の陶板・銅・風化岩の差が実Cameraから一部確認できる。初回K4BM版を支配していた黒茶の巨大な2本の単純な柱状塔を第2修正で除外し、低い埠頭型公共施設に切り替えた。実ソフトウェアGLのEEVEE画像に粗いCyclesノイズがない。
- **重大な不合格理由**：2枚とも広大で変化に乏しいRoad5灰色路面がフレームの大部分を占め、背景は建築の数と輪郭が増えても広い空白と明るすぎる遠方地平線が残る。画面は依然「実在感の薄い人工的な建物と道路の模型」に見え、海面・港の利用者・交通機能・質感の高級感・速度感や読みやすいコース固有の地理がない。右の矩形、左の縦格子が反復的で、UV材質のディテールも実元Cameraで近距離から十分に読めない。道路の横幅・撮影姿勢そのものの制約も重要。**全コースの世界水準美術とは認定できない**。
- **今回も正式ART採用0件、Slope2 DNA認定0m**。技術SOURCE_PASS／NativeBlender_UV_TECH_PASS／ART_REJECT。HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。

### K4BN（次）の制作上の正しいゲート

K4BMは「本物の編集可能UVと物理的質感のある原本を作れる」ことを技術的に証明したにとどまり、世界級の画が出るとは確認できなかった。**単純な屋根・柱・建物の数を増やす方法は今後の主経路に戻さない**。次は「元Cameraでどの程度画面に映るか」を1:1で検証しつつ、ユーザーが納得する実画面を作るため、
1. Road5の主役である**路面の実材質と側道の形、車線意匠、近景オブジェクトの高級感**を一画面で完成させる。道路フレーム占有を見越したデザインを行う。
2. 遠景で見える港/海岸を構図・地形と透視に合わせて設計し、港での用途・作業・交通の物語が**実元カメラ画像**で明確に読み取れるまで工夫。白い空白を大きい物で覆うだけにしない。
3. Blenderネイティブ研究の外観試験と、**実ゲームWebGL2の同タイミングSource Camera画像**を別々に取得して、元ゲームの状況との乖離を監査する。後者に安全な作業経路がある場合でもmain、公式PR、本番を触らない。移植・Collider・他6Roadへの展開はART承認前禁止。
4. リアルなディテールのある局所作者メッシュ・高解像度マテリアルや完成シーンを、可編集BLEND＋2元Camera画像＋SHAで持続保存。顔や人物の本物/車両コリジョンを捏造しない。

依然としてユーザーWindows操作不要、Work開始に事前承認、追加課金なし。見た目が悪いなら良くなったと報告しない。K4BM実作品は研究候補として保存し、公式採用しない。
