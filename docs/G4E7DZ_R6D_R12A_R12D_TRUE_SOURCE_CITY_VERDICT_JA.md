# DOPAGAKI SLOPE / G4E-7DZ R6D-R12A〜R12D — 本物の原カメラ視界・元物理非干渉・美術不採用・接続ギャップ

基準：2026-10-28 JST。**R12A元世界安全空間探索TECH限定PASS／R12B本物の3D内部制作・原CX/B48/B51交差検査TECH限定PASS／R12B ART REJECT／R12C独立真正画像ART REJECT／R12D既存小区画分散案の接続不足STOP**。R11-R1の先行ART REJECT維持。

## 対象と保護

既存`ryomashibaba/dopagaki-development-hub`のDraft PR #46、branch `p101-velocity-overdrive-native-trial`。原CX18、B48の本物の物理面7、B51実動体28、元カメラ5、gap52、原CX保護blob `af076d67492a677d2235e4730aef8cdf4808e106`、240Hz物理とP96原操舵、Gold/P100/main/本番は不変更。ゲーム新コライダー0、WebGL統合ゼロ。すべて原R1の11〜17秒、元カメラ13サンプルとR4の28体×721tick保守的移動AABBを使用。原R1真正PNGはゲームWebGLのキャプチャではなく**原カメラに対応したBlenderレンダー**であることを維持。

## R12A — 立体の空き／実カメラ可視を造形前に同時検査

- 実装：`scripts/p101-w9c2-g4e7dz-r6d-r12a-true-camera-volume-field.py`
- CI：[Actions #40687143619](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40687143619) **SUCCESS**、[Artifact #12815611873](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40687143619/artifacts/12815611873)。
- 元R1の真正Blender世界で **26×30×36m** の仮3D体積を、本物のCX/B48メッシュBVH（実三角面）とB51全28×721tick標本AABBに重ならない範囲から探索。元5+延長8カメラの元11〜17秒真正透視投影で内部の3高度へ複数のレイが通ることも要求。これは歩行アクセスや強度を証明する検査ではない。

| 元ソースの真正3D配置候補 | true-pinch | pinch-switch |
|---|---:|---:|
|前半のEARLY（元11〜13秒）|65|64|
|中盤MIDDLE（元13.5〜15.5秒）|64|57|
|後半LATE（元16〜17秒）|84|83|
|合計|**213**|**204**|

最も長く見える一点は約200m以上離れて小さくなるため、次の研究模型では**オリジナルプレイヤーから約100〜140m**かつ複数時点で見える元物理非干渉候補を優先した。

## R12B — 物理との交差ゼロでも美術の価値は上がらない

- 実装：`scripts/p101-w9c2-g4e7dz-r6d-r12b-native-city-interior-cut.py`
- 正式研究CI：[Actions #40688145741](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40688145741) **SUCCESS**、[Artifact #12815029591](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40688145741/artifacts/12815029591)。最初のCI #40687773969は**メッシュ・14PNG・BLEND生成には成功**したが、後処理用監査JSONの`schema`名だけを古いR11のまま出力していたためFAIL。スキーマ修正後、同じ元Blender実シーンで全工程を再実行・SUCCESS。
- CIVIC、HABITAT、TRANSITの3時期を、原R12Aで実証した安全な空き体積内へ配置。各道路に**123個の新規編集可能なBlenderメッシュ**、原真正11/12/13/14/15/16/17秒の**7画像×両道路14PNG**、編集可能BLEND×2、監査JSON×2。床、3レベルの左右ギャラリー、開放した真正縦吹抜け、深い居室と窓、昇降階段、駅プラットフォームを実体積で制作し、カメラ側には巨大スクリーン壁を置かない。**3区画同士を結ぶ公共通路は未設計・未認証。**
- 正規の独立BVH検査で、元CX実三角面の交差**両道路0組**、元B48物理実三角面**0組**、元B51全28の721tick標本AABB重複**0組**、R1元13時点B51実姿勢の三角交差**0組**。ただし時間連続の動体安全・原プレイヤーが実際に侵入可能かは未検証。
- 画像目視評価：実建築の階層はあるものの、元11〜15秒では遠くに細く小さい建物が点在する見え方。17秒は画面上部の孤立塔に見える。道路の中を通る連続した圧倒的な未来都市ではない。**R12B ART REJECT**。

## R12C — 元R1、R11-R1、R12Bの真正RGB画像と元物理を独立比較

- 実装：`scripts/p101-w9c2-g4e7dz-r6d-r12c-real-image-and-art-verdict.py`
- [独立CI #40688475676](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40688475676) **SUCCESS**、[Artifact #12815353376](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40688475676/artifacts/12815353376)。
- 228視線（19×12）×真正原11〜17秒の7時点の、元CX/B48/B51を含む**実三角形ファーストヒット分布**を再計算し、報告された比率を整合検査。元R1→R11-R1と元R1→R12Bの4代表秒（11/13/15/17）のPNG画素RGB差の閾値45/255も同じ正規Blender画像で独立計算。この画素差は影や材質を含むため、都市画面占有の直接測定ではない。

| 7時点の新都市初ヒット率・算術平均 | R11-R1 | R12B |
|---|---:|---:|
|true-pinch|**10.90%**|**1.63%**|
|pinch-switch|**11.15%**|**1.69%**|

R12Bでは**両道路・11〜17秒の7時点すべてで初ヒット8%未満**。この8%は不十分な画面存在感の検出に使った研究上の停止線であり、美術合格の数値ではない。元CX/B48/B51への干渉0は重要だが、空間・住居・公共・交通が遊び手に読めない時点で正式候補ではない。画像や視認率の「虚偽のまとめ値」を注入しても元228視線と矛盾するため失敗する負試験も真正CIでPASS。**ART REJECT**。

## R12D — 本物の候補空間間で「一つの街区」として接続できない

- 実装：`scripts/p101-w9c2-g4e7dz-r6d-r12d-bridge-the-real-candidate-space.py`
- [独立CI #40688829549](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40688829549) **SUCCESS**、[Artifact #12815319446](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40688829549/artifacts/12815319446)。
- 実際のR12B選定3区画の中心間距離は、true-pinch **CIVIC→HABITAT 204.754m／HABITAT→TRANSIT 184.671m**、pinch-switch **205.283m／188.469m**。**いずれも公的な徒歩経路なし**。
- R12Aの安全立体候補213/204個を全組合せで再探索すると、EARLY→MIDDLEで最も近い3D中心距離は**true68.3024m／pinch68.4202m**、中心間32m以内の既知安全候補ペア**0**。MIDDLE→LATE最短は**true14.9684m／pinch17.8341m**、32m以内の候補ペアは両道路5組。つまり中盤→後半は近接する候補があるが、前半→中盤の本当の安全連結は**まだ調べておらず証明できない**。これらの数値は歩行可否の確定ではない。
- 両道路`STOP_UNCONNECTED_SMALL_MODULE_CYCLE_REBUILD_GLOBAL_SOURCE_SAFE_CANYON`を返し、**小さな安全箱を追加して見栄えを作ったことにする方針を停止**。

## 根本分析とR13への設計切り替え

R11は元プレイヤーの遠近を見せる巨大構造を作れたが、CXと交差し内部が壁の向こうに隠れART REJECT。R12は本当に干渉のない場所へ実内部を作ることに成功したが、空間が小さすぎて都市的な圧倒的視覚価値を失った。**安全と見栄えを二者択一にしない**。次は元CX/B48を侵さない連続した大きな空間を、前半〜後半を通る実3Dから最初に探す。

R13AではR12Aの最短EARLY→MIDDLE約68mの二元候補を最初の検証対象とし、**水平8m程度・垂直とカメラを含む高分解能自由空間探索**で、両地点を結ぶ空間が元CX/B48/B51全28の移動標本を避けて本当に連続するかを調べる。実メッシュBVHの三角検査と人体・ゲーム障害物の安全は分離。単に直線2点が空中に存在することを歩行合格とはしない。

R13Bでは原視点の前景・中景・終盤を同じ都市空間として体験できる、**広い屋外吹抜け・観客席のように層になった都市住居・幅と厚さのある交通断面が一体化した不規則な未来都市**を先に総形態として設計。物理に入らない全体立体→原視点で内部可視→実構造・動線→非反復細部の順で進行。R11の斜め壁、R12の細い単独箱を量産しない。Blender真14画像・元世界比較・独立美術審査なしにART採用しない。

R13Cでは実Blenderの14元カメラ画像、R1/R11/R12との視覚比較、元CX/B48/B51物理交差・28動体721標本＋真正再生時点、機能的広場/居住/交通の三位一体、ゲームの走行視認性を独立監査。人間遊戯・ゲームWebGL/PERFORMANCEは正式ART採用以降の別ゲート。工程数やメッシュ数だけを良しとしない。

**最終：R12A SOURCE研究TECH限定PASS／R12B元物体衝突なしTECH限定PASS／R12B・R12C ART REJECT／R12D小箱断片化STOP。旧R11-R1 ART REJECT。正式ART採用0、Slope2認定0m、GAMEPLAY/HUMAN/PERFORMANCE/INTEGRATION/RELEASE/MERGE HOLD、PR#46 OPEN/Draft未マージ／本番公開禁止。**
