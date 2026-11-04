# K4BX — 真正3D岬・生業のある港・遠景によるCHASE全画面再構成（研究隔離）

2026-11-04 JST。研究枝：`research/k4bx-source-locked-harbor-horizon-composition-20261104`。

## 最上位方針を継承

[K4BW A2最終監査](R19_A6P4_R2F5K4BW_COHERENT_COASTAL_HARBOR_ART_JA.md)・[A2独立技術照合記録](research-evidence/k4bw/K4BW_A2_FINAL_STATUS.md)では真正Blenderの土台を作れたが、同CHASE画像は巨大な灰色道路と空白、極小港湾施設、不自然な線に支配されて **ART REJECT、正式採用0件、Slope2 DNA 0m**。アセット個数やRGB変化を美術品質指標とする失敗を再発させない。高額クラウド・追加有料API・Work/Computer Use使用なし。研究元ゲーム・本番は絶対に変更しない。

## 今回の本物の制作

- 元K4BW A2真正編集可能Native Blender `K4BW_ONE_COHERENT_COASTAL_CIVIC_ROAD_EDITABLE_NATIVE_ART_HOLD.blend` を**固定SHA256 `62c2990e6687ea092a8151339b37fdb0cb8ad156b5dffac1a593218b2c517c02`** で読み、元B48 Road5指紋、Rig 6Camera、研究CHASE Camera、古い苗木8本＋真正海岸樹1本のTransformを数値/完全SHAで検証。全SOURCE Road5頂点・面・元ゲームソース保持。
- `scripts/p101-k4bx-working-seaport-headland-native.py`：**カメラに貼った背景や2D絵ではなく**、元ロードの奥から連続する侵食岬と多層の遠方丘陵の本当の3D曲面を制作し、カメラの水平線付近の空白を地形の遠近で埋める。右側は実航行可能を認定しない研究用水面、切削した海岸護岸と長い岸壁、魚市場＋冷蔵仕分け施設、島間フェリー発着所、港湾VTS監視室、実荷役構造を持つクレーン1基、曲線船体を持つ作業艇1隻、生活用途を持つ街区建物4棟を、一体の実3D港湾景観として作者制作。巨大箱と大量反復の小物に戻らない。
- 元K4BW A2の研究用路面オーバーレイの**材質のみ**は、前回の大きな不自然な斑を減らすため小スケール鉱物粒子のPBRへ置換。元Road5の材質/面/可走性は固定。
- 全て同じ真正CHASEのフレームへ元ジオメトリから投影し、魚市場＋監視室、フェリー施設、クレーン頂点、元Road5先端が**視錐台内**と検証。BBoxや投影アンカーが画面内という事実と美術合格を混同しない。実Blender EEVEE 768×480 **1枚**をレンダリングし、真編集可能.blend＋同CHASEのK4BW A2 PNGとの実A/B＋SHA監査を作成。真の遊べるWebGL2ゲーム画像ではない。
- [初回GitHub Actions #41823102768](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41823102768) は本記述時点で**実行中（成果は未確定）**。失敗したら実ログと安全ゲートから最小修正する。TECH PASSでも画像を本当に見てART不合格なら**ART REJECT**。

## 絶対不変

元Game Git Blob `af076d67492a677d2235e4730aef8cdf4808e106`。元B48 Road5全頂点面 `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`。元B48 7実Road／B51 28Mover／240Hz／球0.65m／元6Camera／元Game安全UIは変更しない。新ゲームCollider **0**、ゲーム統合なし。main、正式`p101-velocity-overdrive-native-trial`、Draft PR #46、本番2サイト変更禁止。SAT/CCD/HUMAN/FPS/RELEASE/MERGE全HOLD。正式ART採用 **0**／Slope2 DNA **0m**。研究BlenderでのDCC TECH PASSと正式実Gameの安全・性能・ART PASSは別契約。

## 次K4BYへの分岐

真正1画面を目視し、遠景岬が道路の水平線に接続するか、港の生業が機能ある輪郭として分かるか、都市建築が模型の箱の集積に見えないか、路面が不自然にならないかを判定。低品質なら既存試作を盲目的に量産しない。必要ならカメラを固定したまま本物の遮蔽関係・自然地形・建築細部を1つずつ根拠に直す。**ART REJECTのままほか6RoadやGameへ展開しない。**

## K4BX A1/A2真正画像評価・A3設計への固定教訓

- A1 [#41823102768](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41823102768) **completed/SUCCESS**。K4BW A2 Native originalがSHA256で一致、Game/Road5/Camera/9本の木を保護。真.blend SHA256 `3fd25a7cf38123f6f034c414a61127b26a1db2aed090f2a8a8e0bba8ac7d1f6f`、768×480画像SHA256 `14c29ac81d3c2df7fab7d5f3625e61ef58e3f503fdd04a8f854459cbc46806d4`。同CHASE画像を目視すると、左の岬は**黒く鋭い三角形になり白い不自然な境界線を生じたためART REJECT**。右の港も小さく薄い。三角の地形は原本に残し描画OFFにすることにした。
- A2 [#41823924403](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41823924403) **completed/SUCCESS**。黒い岬は研究原本に保存・Render OFF。より低い暖色系丘陵を制作、魚市場とフェリーの屋根を視界に寄せる。A2真正編集可能Native 261,294,756 B／SHA256 `56a5db02c7763757b0d2fb55e2533657d87761b627e75ca48d53395bd8acf487`、真正研究CHASE PNG 481,099 B／SHA256 `8db9e787aa5f05ffb306aac4cb7b092ab4c2d3a0424e8f199c6582e118805bd4`。Artifact #13319010201 ZIP 112,828,054 B／SHA256 `2ac95c00a619b80452737896e364437c43f7c895b52dba11dcd02aa0a585334e`、独立CRC全PASS。**目視ART REJECT**：左の黒い不自然な岬は解消したが、遠景は依然ほぼ空白。右の建築が大きい屋根板・浮いた監視室に見え、港に生業・密度・奥行きが足りない。RGB差分1.90757は美術指標ではない。
- A3変更commit `6121a73b8ea5aa7f201ae8dd6d21d4e3d6786b03`：A2で効果が薄かった地形オーバーレイは編集可能原本に残して研究レンダーOFF。**固定元CHASE Cameraの射影位置から世界の側方距離・高さを逆算し、奥行き265～700mの実際の地形メッシュで岬と遠方島を作る**。偽画像・2D平面ではなく距離分離した連続3D。右の建築屋根を縮小し、浮いた港務所展望窓・マストは原本保持Render OFF。正式Game未改変。 [A3 Actions #41824656344](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41824656344) の結果と実画像評価は本記録時点で未確認。事実確認後も美術不合格なら正式採用禁止。
- **全体契約は維持**：source Road5全頂点面、Game、6Camera、研究CHASE、9木Transform、main/公式P101/PR#46/本番不変。正式ART採用0件／Slope2 DNA0m、SAT/CCD/HUMAN/FPS/RELEASE/MERGE全HOLD。BlenderのTECH PASSでゲームのFPSやARTを保証しない。

## 【K4BX A3最終・真正原本/実画像/ART採否】

2026-11-04 JST、K4BXの同CHASE全画面1研究フレーム検証を完了。**Native Blender工程 TECH PASS／正式ART REJECT**。美術の進歩と未解決を分ける。

- **A1** [CI #41823102768](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41823102768) completed/SUCCESS。道路の先の岬、港の実用途建築、魚市場・フェリー施設・作業船・1基の荷役クレーンなど本当の3Dを作ったが、左岸が真っ黒の鋭角三角形・不自然な白い継ぎ目となり、右の建物も小さい。実画像 **ART REJECT**。
- **A2** [CI #41823924403](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41823924403) completed/SUCCESS。A1の不自然な地形を原本に保存したまま Render OFF、低い丘陵と手前に寄せた港湾施設を再制作。A2真正Native SHA256 `56a5db02c7763757b0d2fb55e2533657d87761b627e75ca48d53395bd8acf487`。左の黒三角は消えたが、右に**大きな浮いた屋根板と監視室、遠景空白**が残りART REJECT。
- **A3** [CI #41824656344](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41824656344) **completed/SUCCESS**。カメラを動かさず、視錐台内での実座標を幾何学的に逆算し、**奥行265～700mの複数距離に実メッシュを配置して岬と島の稜線**を作者制作。2D画像の貼り付けではない。過去の不適切な岬メッシュを保持・非描画、さらに浮いた監視室と過大な屋根を縮小・非描画（旧VTS 3オブジェクト）。A3の真モデル投影アンカー x=.285, y=.600（元CHASE内）と右魚市場、フェリー、クレーン、元道中央の視認条件PASS。真の実画像で、**道路の奥に暖色の海岸丘陵と青みのある遠方島影が見えるようになった**。三角形の黒い崖や空中に浮く監視室は解消した。ただし道幅の支配、港の板状の建築・生活感不足、近景の写真感欠如は解決していない。**ART REJECT継続**。
- A3真正Artifact [#13318234253](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41824656344/artifacts/13318234253) ZIP実バイト112,826,931 B、SHA256 `9e43fbaf5a6e7fdf44da6810f7fd890045184c4ddebfabea8c73a25d9678c920`、外部コンテナ `ZipFile.testzip()=None` で**全CRC PASS**。編集可能 Native `K4BX_HEADLAND_WORKING_SEAPORT_CINEMATIC_EDITABLE_NATIVE_ART_HOLD.blend` 実261,313,352B、独立SHA256 `1cdf3233d3b2b91b1e10b6f7b2212ef9ec74331667ca4129a4e96ce43b4c2179`。実同CHASE768×480 PNG `K4BX_SAME_CHASE_HEADLAND_WORKING_SEAPORT_ART_HOLD_NOT_GAME.png` 実479,937B、独立SHA256 `4f6cb003a57fedefaed44ff39662398f44e3e00f30b5395fd4c0c8b8a2dc80ee`。[K4BW A2とA3の実同Camera比較PNG](research-evidence/k4bx/K4BX_VS_K4BW_A2_SAME_CHASE_TRUE_HARBOR_HEADLAND_ART_REVIEW_NOT_GAME.png) SHA256 `241f30b06ee7f23342fd23399a08ae46ca74aa872834b57392583c1bc0ca24fc`。CIと外部独立CRC・実PNG目視を区別。RGB平均差分1.6971は変更確認のみ、ARTスコアではない。
- A3新規研究要素98個、実魚市場・フェリー施設・街区計6棟、作業船1隻、荷役クレーン1基、岬実メッシュ。**個数は品質の証明ではない**。元A2編集可能原本SHA256 `62c2990e6687ea092a8151339b37fdb0cb8ad156b5dffac1a593218b2c517c02`・元実Game Blob `af076d67492a677d2235e4730aef8cdf4808e106`・B48元Road5全頂点面fingerprint `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`・元Rig6 Camera/研究CHASE・元真木9本行列を全不変検証。実Game Collider0、新ゲーム変更0、正式ART採用**0件**、Slope2 DNA**0m**。main、公式P101、Draft PR #46、本番2サイト変更禁止。SAT/CCD/HUMAN/FPS/RELEASE/MERGE全HOLD。

### 次K4BYの最優先：追加オブジェクトを止め、造形の品質で勝負

A1/A2/A3で「モデルを置けば見た目が成立する」という考えが誤りだと実証された。次K4BYは**路面・地表の本物の写真質感・海辺地形の自然な連続性、建築単体の素材と用途に即した構造の完成度**に焦点を移す。1Frameの質が変わらないのに遠景シルエットや箱・細い屋根を増やさない。可能なら真正Blender原本の特定箇所（屋根厚み・階段や出入口・壁・舗装と地表の接続）を美術作者として完成させ、元CHASE実画像での改善を判定。**技術合格と世界水準美術を分け続ける。** Game本体のB48走行安全やFPSは別ゲート、正式採用条件は未達。
