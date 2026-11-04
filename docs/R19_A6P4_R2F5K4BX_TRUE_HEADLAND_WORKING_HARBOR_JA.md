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
