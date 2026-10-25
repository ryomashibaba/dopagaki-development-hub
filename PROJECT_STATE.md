# DOPAGAKI SLOPE — 新チャット継続入口（固定URL）

## G4E-7CG — 第三者テクスチャを省いた原本GLB形状の独立Chromium WebGL検査（2026-10-25 JST）

元Spectra CitiesのCC0形状とTextures.comの条件付きテクスチャを厳格に区別。上流原本GLBはCI一時領域に限定して利用し、**描画前に全元マテリアルを無地に置換**。元ゲームのBG真正240Hz 6カメラ姿勢とCB配置計算で200m/320mの独立Chromium WebGL計12枚と実画素差分を記録する。[詳細・限界](docs/G4E7CG_ISOLATED_GEOMETRY_WEBGL_QA_JA.md)。**本ゲーム自体の画面ではないためART/WEBGL_GAME/HUMAN/RIGHTS/READY/PUBLISH/MERGEはHOLD**、素材再配布なし。CI判定後に実測追記。240Hz/B48×7/B51-C×28/gap52/自然ジャンプ・操舵・速度/カメラ/A13/main/Gold/原作・本番2サイト不変更。正式Slope2=0m、PR#46 Draft未マージ、Work未使用。



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
