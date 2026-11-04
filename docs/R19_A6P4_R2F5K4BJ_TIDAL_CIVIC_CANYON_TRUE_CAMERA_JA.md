# K4BJ — Tidal Civic Canyon：真正Source Cameraによる大構図全面作り直し

更新：2026年11月4日 JST。K4BIの[確定SOURCE/DCC技術PASS・美術REJECT正本](R19_A6P4_R2F5K4BI_ORIGINAL_CAMERA_ROAD_PBR_CIVIC_FACADE_JA.md)を継承。研究継続 `research/k4bj-hand-authored-hero-civic-canyon-20261104`。

## 0. 最優先目的（変更不可）

DOPAGAKI SLOPE — HYPER RUSHを世界水準の高速3Dレーシングゲームとして全コースの美術を完成する。過去K4AT〜K4BIで積み重ねた技術的成功と**ART REJECT**を混同しない。正式ART採用0件、Slope2 DNA正式認定0mを維持。

K4BJは Road5実物メッシュを編集せず、元のcontrol tick11307／ultra tick11341の数値に固定した1 Hero都市構図をBlender DCCで比較し、**画面全体の美術基準を達成できるか判断する隔離試験**。他6Roadの水平展開は不許可。CI成功、メッシュ数、画像生成数、走行カメラの正確性はART合格の証明ではない。

## 1. 変更してはならないもの

- 凍結game source blob `af076d67492a677d2235e4730aef8cdf4808e106`、240 Hz、球半径0.65m、B48元7道路、B51元28移動体、元Camera全6の座標と向き、原速度・CCD・SAT・安全案内。
- main／公式 `p101-velocity-overdrive-native-trial`／Draft PR #46／2本番URLは不変。公開・merge・ゲームへ直接反映しない。
- 元Road5 tessellationのfingerprint `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`。元Source Camera control11307とultra11341の値は絶対保持。
- Work事前承認、ユーザーのWindows／Blender操作要求なし。HUMAN/SAT/CCD/FPS/ART/RELEASE/MERGE全HOLD。

## 2. 前工程の反省とK4BJで実装した美術制作

K4BI [Actions #41740606366](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41740606366)はSOURCE DCC PASS、ART REJECT。路面の平らな面積、反復窓、細い中央アーチ、薄い都市奥行き、Cyclesノイズが問題。

新たな`scripts/p101-k4bj-hand-authored-tidal-civic-canyon.py`は、`K4BI_ROAD_MATERIAL_ARCHITECTURAL_DETAIL_EDITABLE_DCC_HOLD.blend`（親SHA256 `93526d4adff8f1061081109123f7619de9bb6a0b835b15af6baf9bf6bb3ba086`）を**独立したBlenderネイティブ原本**として開く。

- 過去K4BH/K4BIの模型的なロング壁と旧薄いリング、同型窓の重なりは削除せずRenderOFFにし、**ゼロから構図の主役を変える**。旧コレクションは編集可能で保持。
- 西側：海食崖内の一体型大規模公立図書館。手で決めた異なる長さの大開口、実奥行きのある暗いロビーと暖色内装、深く庇の張り出した湾曲屋根・斜め柱・屋上広場・屋上採光。
- 東側：同じ建築を鏡写しせず、階段状の海洋研究・公共交流センター。銅色の曲面大屋根、異寸法の大開口、アシンメトリー庇、テラスに実物の室内光。
- 中央：既存の単純な2重リングではなく、**非対称の二つの構造物と、空間を抱く厚みのあるSky Lobby**を1つのランドマークとしてモデル化。立体物の負空間、躍動感、使える室内を優先。
- 遠方：細い針塔ではなく、5棟の異なる大断面の実装容積・水平に居住公共空間が入った都市スカイライン。背景の深度を優先して一棟ずつ断面寸法を作者指定。
- 道路端：真正B48 Road5に直接Raycastし、地表が存在する箇所に限りカメラ側の路側景観をプロポーズ。道路原メッシュや新ゲームcolliderには変更しない。Raycast命中率と生成数を証拠に保存。交差・運転クリアランスは未保証。
- 素材と光：旧の灰色路面の面積比を踏まえ、既存Road5源にのみDCCマテリアルの暗色化を適用。Nishitaの夕景・天然光・室内灯でメタル／陶板／暖色居住内部の実素材差を出す。外見での安全性や本番GPUコストは未検証。
- Blender固有のOpenImageDenoise未実装を踏まえ、Cyclesネイティブ48サンプル、OIDN OFF。本段階は元カメラ生PNGを正本とする。ノイズが残ればQUALITY上の欠点として評価。
- 目視不合格時はART REJECTとし、同じ小物追加型の試行を漫然と継続しない。

## 3. CI検証と判定規則

[専用K4BJ Actions](https://github.com/ryomashibaba/dopagaki-development-hub/actions/workflows/p101-k4bj-native-tidal-civic-canyon-art.yml) は、確定した親Artifact #13281034575を取得し、元Game Blob/Nodeテスト、親DCC SHA256/元Camera/B48元道路/B51物体数・生Blender、元Camera 2生PNG、独立PNG差分、全SHA JSON、GitHub研究ブランチへの証拠保存を行う。真正Artifactが作られてからそれを解凍して**生画像を直接目視判定**し、その判定をここに追記する。

初回執筆時点ではCI success、真Blender結果、ART評価は**未確定**。前工程と同じSOURCE/DCC技術成功をART合格へ読み替えない。旧K4BI ART REJECTと正式採用0件／Slope2 DNA0mを維持。実WebGL2画面は1枚も撮影していない。B51全時刻クリアランス、CCD・SAT、180Hz/240Hz真実走行、安全、FPS、人間プレーは新美術について未検証。


## 【2026-11-04 K4BJ実物レンダリングの確定評価】

### 真の技術実行
- 初回[Actions #41743358774](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41743358774) はRaycast結果を3値で受けようとしてBlender 4の4値契約に違反、失敗後**cancelled**。次の[Actions #41743406627](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41743406627) はBlender造形構築までは走ったが、`out`を外装ループのouter lateral値で上書きし、保存先が整数になり**completed/FAILURE**。これらを成功へ読み替えない。
- 修正commit `e7db92c73a915a2be7e91dbc8a90cf8c68465a74` の真正[Actions #41743823084](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41743823084) は **completed/SUCCESS**。Source Node検査・親K4BI.blend SHA・実元Source Camera二時点・元Road5頂点／面 fingerprint・独立画像/SHA検査・研究ブランチへのPNG/JSON保存・編集可能BlenderのArtifactアップロード成功。これは**SOURCE/DCC技術限定PASS**。
- 真正[Artifact #13282722868](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41743823084/artifacts/13282722868)、ZIP SHA256 `7b85ebe4c3ef60053c9e5dfdc18e55d9c779714afa8b4319ac3370561b4948b3`。ZIP CRCエラーなし。control11307 PNG 1,933,613 bytes、ultra11341 PNG 1,918,310 bytes、真Blender編集可能原本 33,859,968 bytes、同source camera比較PNG 4,123,651 bytes、真provenance JSON。独立再ハッシュ全件一致。新DCCモデル87件、旧K4BI/K4BHコレクション12個を非破壊render-off。**モデル数を美術評価に使用しない。**

### 実画像を直接見た美術判定：ART REJECT
- 元K4BIと構図の差は大きい。巨大な白骨梁と緑のSky Lobby、左右の異なる海岸建築へ置換したことは実画像で確認できる。
- しかし実際にはcontrol/ultraとも**平面路面がフレーム下部の過半を占め**、左右は依然巨大で無地な壁、中央は模型的で小さい接続部・不自然な素材と厚み、大きな空白が広がり、街区に人の生活と道路の速度・緊迫感がない。以前の「二重の細いリング」を捨てたことは新方向の試作として記録するが、世界水準のゲーム画面からは遠い。**K4BJ ART REJECT**。正式ART採用0件／Slope2 DNA正式認定0m。
- 作成した道路脇の候補は**生成0**。原因：Road5本物メッシュに対し、R側とL側の各42サンプルで`s=±157m`の鉛直レイとの交差が**0/42 + 0/42**。これを「道路脇レール成功」と報告するのは誤り。建物の横位置寸法がそもそもRoad5に合わない可能性があるが、**厳密な路幅はこのデータだけでは不明**。
- Source/Native DCC ART候補を元のWebGL2ゲームスクリーンショットだと偽らない。元B48 geometry fingerprint `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`・元control/ultra Camera数値不変。元ゲームソース不変。B51/SAT/CCD/HUMAN/FPS/RELEASE/MERGE安全認証を行っていない。ゲーム統合と他Road展開はHOLD。

### 次の実測の優先順位

現状の道幅・スケールに根ざさないまま新しい壁や塔を追加すると、同じ失敗を繰り返す。`scripts/p101-k4bj-readonly-source-road-camera-survey.py` と[専用Actions #41744748256](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41744748256)を投入し、真正K4BI元BlenderからCamera基準横方向距離とRoad5の三角メッシュ分布、異なる縦方向地点の鉛直レイ交差を**読み取り専用で計測**する。出力が検証できたら、以降の建築幅・位置・安全な道路脇候補を測定根拠で再設計する。これは地物位置測定であって、B51実衝突安全やART合格の証明ではない。


## 【K4BJ実測による重大な設計誤差の確定】2026-11-04

[Road5実測CI #41744748256](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41744748256)は **completed/SUCCESS**。元K4BI真正Blender原本、元GameBlobをSHAで照合し、**BlenderのRoad5実物2366頂点・4728ポリゴン**とカメラ固定数値を使い、世界空間からカメラ前後・左右・高さ軸へ正しく変換、11箇所×34横オフセットの鉛直Raycastを実施した。原本を書き出さず、元Road5頂点・面Fingerprint `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2` を前後検証。真正 [Artifact #13283665361](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41744748256/artifacts/13283665361)、[実測JSON全文](research-evidence/k4bj/K4BJ_REAL_SOURCE_ROAD_CAMERA_SCALE_SURVEY.json)。**この検証は幾何学の計測であって、完成美術、安全な走行幅、動体B51の検査ではない**。

- 実Road5 source-control Cameraから測った**前後方向の頂点配置**：−525.804m〜＋188.774m。**前方200m以遠では、このRoad5上の頂点はこの測定範囲で0件**（他の6Roadまで空白と断言するものではない）。
- カメラから前方0〜25mのRoad5本物の頂点横位置は `s = −39.162m〜＋53.261m`。前方25〜50mでは `−39.465〜＋55.780m`、前方100〜150mでは `−38.821〜＋69.255m`。これは**Road5メッシュの頂点分布**であり、センターライン・道路有効路幅／安全通行幅ではない。
- 検査した左側`s=−30m`と右側`s=+40m`は前方0m/20m/50m/100m/150mでSource Road5と鉛直交差あり。右側`s=+60m`は前方100m・150mで鉛直交差あり、0m/20m/50mでは交差なし。旧試験`s=±157m`は全試験で交差なし。Raycast上の交差が乗車安全を意味することはない。
- K4BJ以前の設計では左右の建築や道路端を物理道路から `s≈±160〜360m` に置き、中央の主構造をカメラ前方 `d≈550m` に置いていた。**これではRoad5近辺に正しく接するはずがない**というスケール／座標設計の不整合を実測で説明できる。よってK4BJの巨大な模型感と画面下の道路の単調さの一因は、意匠だけでなく**カメラの実道路配置に合っていない空間配置**にあると判断する。ただし品質問題の全部がこの誤差で説明できるとは断言しない。
- **次工程K4BK以降の不可逆に固定する制作条件**：まずRoad5メッシュの前後方向の実範囲と左右の実Road5座標を使って、カメラ画面内の実寸マスタープランを手動定義する。B48実Road5に地物を配置したい場合、具体的なd地点で実メッシュのRaycastにより地面高さを調べたうえでクリアランス、B51/SAT/CCD等の安全試験を別途する。高密度の建築・オフロード公共空間はその測量範囲に隣接させつつ、元ゲームコリジョンとは混同しない。素材/外装よりも**実寸構図の正当性**を最初の美術ゲートとする。
- 美術候補K4BJは改めて **ART REJECT**。正式採用ART0、Slope2 DNA認定0m。旧K4BIもART REJECT。新しい街区の横展開、元ゲーム統合、公開、main/公式p101/PR#46変更は禁止。これは研究ブランチにのみ保存した元Source Geometry測定結果。

