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
