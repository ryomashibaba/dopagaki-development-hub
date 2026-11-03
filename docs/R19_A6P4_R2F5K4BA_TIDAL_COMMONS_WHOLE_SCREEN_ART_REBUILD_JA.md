# DOPAGAKI SLOPE — K4BA《Tidal Commons》真正Road5全画面美術・編集可能Blender原本

**2026-11-03 JST。継承元K4AZ:** `research/k4az-road5-civic-rift-dcc-recomposition-20261103`、HEAD `a09b4b2f0548640e43c948b4ce8695b8c2a39f0a`。

## 制作の理由／K4AZからの継承

[K4AZ全証拠](R19_A6P4_R2F5K4AZ_CIVIC_RIFT_BLENDER_ARCHITECTURAL_RECOMPOSITION_JA.md)、元B48/B51源統合K4AYの成功CI #41612254866と、K4AZ v3 DCC #41616880506 成功、K4AZ v3独立BVH #41617855388 SUCCESSを継承。

**ART REJECT**は絶対継承。元ゲームの本物のRoad5元カメラ6時点に対応するBlender DCC画像を本当に開いて確認すると、K4AZ v3は左右のアーケードが見えるが画面全体が構成されていない。画面の真ん中は広大で単調な灰色道路、正面の空はほぼ空白、立体横断廊は2本の細い宙に浮くアーチにしか見えない。見栄え向上を画素差だけで認定する方法は禁止。源Road5実メッシュ91x13の上面格子は幅約90–106m、元ゲームのRoad5自体の**物理サーフェスが終端u=1で終わる**。真正元Cam control11259/11278/11307 ultra11320/11341/11369は元のeye/front数値を持ち、終端以遠の「真ん中が空白」をBlender-DCC美術で解決する際には**架空のドライブ可能な道路を決して生成してはならない**。

## K4BA工程で実装した抜本的な美術構成

新しい制作器 [`scripts/p101-k4ba-authentic-b48-tidal-commons-cinematic-city.py`](../scripts/p101-k4ba-authentic-b48-tidal-commons-cinematic-city.py) はBlender-native editable 3Dを生成し、旧K4AX/K4AZの不採用アートを削除せず非表示にして研究原本を保持。真正B48/B51のoriginal 3D参照・原カメラ数値は一切移動せず「true physics road draw」と「DCCのみのmaterial」を厳密に分離する。

1. **全画面フレーミング**：Road5両岸の複数階の公共テラス・連続した実入口・離散した読書室／文化交換所、非対称屋根シェルを整合的に造形。中央の灰色道路だけで画面を終わらせず、左右の建築の断面、奥行き、用途、石と銅の材質を構成。
2. **正面の全く新しい主役**：元source Road5終端の先を、演出的な**巨大な海港観測施設・幾重にも折れた公共建築の翼・実際に人が歩く3D環状観望廊・4本の支持パイロン**で埋める。道路端の外に設ける3Dスカイラインは全部**美術専用でありドライブ継続面ではない**。原source道路が存在しない区間を架空のドライブ路面で埋めない。
3. **都市の具体的な奥行き**：左右に高さ・幅・折り構造の異なる8棟の複合施設、建物間に地形の層理と海岸域。既存の反復した単純箱や無意味な斜め梁をアートとして再利用しない。source cameraからの見通しに応じたdepth 190–580mの奥行き。
4. **意味のある横断公共機能**：空中に浮く二本線だったK4AZ v3のアーチを、3Dの厚い床・GLASSの実壁・屋根・支持柱・繋がった道路両岸の公共停留施設を持つ空中温室に再設計。これは**元ゲームの新ゲート、当たり判定、走行レーンではない**。
5. **路面全体の素材表現**：元B48 tessellated Road5物理曲面に密着するDCCのみの金属石材・高解像度Noise bump、横断圧縮目地、ロード端のソフトな黄金色のジョイント。危険表示P100/B5、ロード端、B51の安全な視認を勝手に上書きした**ゲームへの実装ではない**。すべて `K4BA 06 | noncollision ROAD MATERIAL STUDY ONLY` に隔離。
6. **実環境光と実公共用途**：温暖な日照、かすかな青い海、ガラス、内装の温かい光、植栽、水盤、実構造の柱と開いた中庭。走行カメラに映る造形の世界観を画面全体で成立させる。

## 本物のsourceと同一性が必要な証拠

| 不変条件 | 正本 |
|---|---|
| 本物の原ゲーム凍結blob | `af076d67492a677d2235e4730aef8cdf4808e106` |
| source stage | B48 7, B51 28、240Hz、球半径0.65m |
| 真正B48 Road5 | index 5、ID `p93-PRISM_CREST-01`、4,728三角形 |
| source points SHA256 | `5eb731e25bc9eb1a3cf1080e7b239f5e2e8043bfbc80e5d37e0b069a5a08a730` |
| source B51時刻別物理OBB | 28体×元Camera 6tick=168 |
| 画像のカメラ | control11259/11278/11307・ultra11320/11341/11369 の元数値、元時間 `tick/240` |
| 変更しないもの | 元路面・元衝突・元B51・元カメラ・操作／速度／元240Hz・本番／main／PR#46／公式研究枝 |
| 永続ゲート | 正式ART採用0、Slope2 DNA0m、ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE HOLD |

## 真の評価方法

専用CI [`.github/workflows/p101-k4ba-real-road5-tidal-cinematic-city.yml`](../.github/workflows/p101-k4ba-real-road5-tidal-cinematic-city.yml) がK4AZ v3完全編集可能 `.blend` と K4AY本物のB48/B51参照JSON を**固定過去Actions runからSHA検証つきで取得**し、Blender生成と全6元Camera DCC PNG・1 artist DCC PNG、A/B左右並列シート、編集可能原本・GLB・全ファイルSHAを出力する。元Road5頂点＋三角形ハッシュが不一致なら即FAIL。

**初回CIは実際のActionsの成功・失敗を確認するまでは未確定。** 生成が成功しても「source/DCC TECH PASS」に限定し、6視点・artist scene画像の画像認識で世界水準の品質不足なら **ART REJECT** にする。現時点ではより本物の完全なDCC architecture、原Camera遮蔽と物理関係、実WebGL2コード側のゲーム体験を証明するものではない。

### 次の実作業（途中で止まった場合）

1. GitHub K4BA研究ブランチ最新HEAD、K4BA workflow status/jobs/artifactを確認し、失敗ならその**実ログ**から制作器を修正する。SCENEを作っただけでARTを認定しない。
2. 実6元Camera PNGとartist viewを開き、K4AZ v3と1:1比較。背景がまだ空白・路面が粗悪・過密な同型造形・遠景の偽りがあればART REJECT。
3. K4BA原本の新建築メッシュ vs 元Road5 B48とB51元Camera6tick collision OBBを**K4BA固有の別独立BVH**で検証。過去K4AZのゼロ接触を流用しない。元sourceゲームのCCD/HUMAN/FPSは別。
4. K4BA 6元Cameraを世界的美術として厳しく審査し、品質が不足する部分はBlender原本自体を大幅修正。 ART合格後にのみDCC→元WebGL2への移植の可否を検討する。元コードの見た目を雑な再プロトタイプに戻す禁止。

Workは必ず事前承認。ユーザーのローカル操作最小化を維持。


## K4BA 初版の実画像審査とv2造形再制作（2026-11-03）

### 初版は技術SUCCESSでも美術REJECT

GitHub Actions [#41624877761](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41624877761) は**completed SUCCESS**。Artifact [#13224114706](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41624877761/artifacts/13224114706) 20,752,228 bytes、ZIP SHA-256 `68a7bbbe1ebcbffc8685e427488e153ed4dda207591bc9205c40289db97ac292`。本物のsource camera6つに対応するDCC PNG、K4AZ比較画像、Blender native `.blend`、GLB、元物理不変 SHA検査PASS。新しく編集可能にしたBlenderオブジェクト579個。画像比較のDCC差分は6視点おおむね80–88%だが**美術品質指標として利用禁止**。

**実画像で初版もART REJECT**。K4AZで欠落した正面景観に二重の展望施設と塔が現れ、画面の奥に建築が実際に見え始めた。しかし、アーティスト航空視点では多数の建築が**黒い空隙の上に浮いている**。帆のような細い板が繰り返され、建物・自然地形・公的な広場・荷重構造が一つの都市として繋がっていない。ユーザーが指摘していた「彫刻物だけ」「雑な色塗り」をそのまま再発させないことが重要。空を埋めたりオブジェクト数を増やすことは合格ではない。

### v2では建築の根本問題を再修正

K4BA制作器を既存のK4AZ .blendから再生成する方式のまま改修（v1原本は先行Artifactへ退避）。

- 空中に浮く細い「3D SAIL」6枚を、左右の**具体的な大規模公共文化施設の曲面屋根・入り口・柱・天井照明のある連続公共建築**に置換。実支持柱を地下の地形基盤・基壇へ接続。
- Road5物理の終端u=1の先は、源ゲームの別道路／B51が延びている可能性がある。そこを「偽の安全な走行路・架空の街の土台」で塗りつぶすのを禁止。左右に分離した大きな自然岩盤・港湾プラットフォーム・本物の深さのある海岸・水域を造形し、**中央の既存進路のための空間は空けたまま**建築の荷重支持を作る。
- 観測施設の支持塔4つを側方の岩盤へ寄せ、空中だけで成立する不自然なモニュメントを減らす。建築を支える島を実3Dで構成。
- ここでの海岸景観は**DCC美術のみ、元sourceではない**。他のB48道路・全時間のB51との安全性、FPS、HUD、CCDは未実測。

v2 CI [#41625837609](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41625837609) の結果が実証されるまで**SOURCE/DCC成否未確定、ART正式採用0**を維持する。成功時は6元Camera＋航空の本物画像を再度必ず開き、さらにK4BA固有の独立source B48/B51 BVHを実行する。

初版が美術的に足りないのに小物を追加して合格扱いにするのは禁止。
