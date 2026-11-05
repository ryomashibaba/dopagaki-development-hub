# K4CM — 既存SOURCE道路と港の一体化：海岸断層の大地形とフェリー歩行接続

**2026-11-05 JST／ART-FIRST研究のみ。これは新方針の再審議ではない。**

## 固定された上位目的と経緯

DOPAGAKI SLOPE — HYPER RUSHの世界水準の走行空間を完成させること。2026年11月5日のK4CL最新研究HEAD `b1d3834082febb1d5d663ce3550371451139eed7`から、本工程 `research/k4cm-integrated-coastal-road-port-20261105`に隔離分岐。K4CLは本物のBlender4.0.2で原K4BQ研究ロードをベースにA暗色グラファイト舗装/B明色鉱物舗装を非衝突研究として制作・独立検証したが、**両方ART REJECT**。Aは相対的に路面の読みやすさと速度の方向感が高いため、今回の比較基準に固定。次工程で同じ舗装の色微修正や、効果の弱い小物の増殖はしない。

親真正可編集DCC `K4CL_TRUE_EDITABLE_DUAL_PHYSICAL_PAVEMENT_STUDIES_ART_HOLD.blend` **SHA256 `2b5288333b3b633649aefd349fbdc79837775719a6175eba23d72dbdbada7da1`**。成功親GitHub Actions [#41985567281](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41985567281)、元ZIP Artifact [#13396116054](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41985567281/artifacts/13396116054)から厳密実バイト認証して継承する。

## 今回の実作者作業（小規模QA反復ではなく広い可視画面を変更）

`scripts/p101-k4cm-native-integrated-coast-road-port.py` で、K4CL真の暗舗装・元K4CI実港施設・凍結CHASEを保護したうえ、次の3つの**真正Blender編集可能非衝突研究Mesh**を制作する。元のBlender原本とゲームは上書きしない。

- **左の200m級の地質本体**：K4CK Aの実道路切土1メッシュを非破壊コピーし、既存の全頂点を新研究コピーで海底断層の大地形へ再作者変形。道路沿いの元SOURCE13.15m半幅は変えず、近い路肩の緩衝を保持。3つの大きな地質褶曲、4箇所の深い侵食谷、風雨の削り跡を波形の頂点世界座標として実立体化。ポリゴンごとの実露出岩面・陰影・鉱物を再配置し、前の均一で明るい採石場状の平板を脱する。元K4CK Aメッシュは研究描画でのみ非表示、データと行列を保護。
- **右の大きく連続する200m級海岸盛土・波止場基盤**：実SOURCE Road5の各縦断地点の地面高さを再度レイで読み、右道路端から海側約57mへ段階的に下る、岸壁・公道側の本物の幅広い地形を**1つの連続した編集可能な3Dメッシュ**として制作。既存の小さな船や屋根を量産するのでなく、港の施設がどう地面に置かれているかを説明する広い土木構造。
- **既存のフェリー施設へ物理的に接続する歩行通路**：前工程で実際に制作済みの`K4CH | one structurally continuous timber ferry station`の真のBlender座標から接続先を取得。現在の道路右側歩行域のSOURCE標高に固定した起点と、既存フェリー支柱に接する実世界終点の間を、構造的に続く厚みのある歩行デッキ・支柱・欄干として一体制作。平面スクリーン向けの位置ずらしではない。斜度などに問題があればBlender側で停止、都市の通路として実在しない無理な橋を強制しない。

**最上位の安全**：ゲーム元Game git blob `af076d67492a677d2235e4730aef8cdf4808e106`、元B48 Road5頂点・面全SHA256 `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、元6Camera/CHASE、11木、灯光、元研究Blender/K4CL A道路/B舗装/実フェリーサポートのメッシュ形状と全行列を厳密保護。ロード中央の研究暗色舗装ピクセルも今回の新地形制作では維持する。新ゲームColliderは0。元ゲームPhysics/道路/走行の実装を変更しない。Work/Computer Use事前承認、追加有料API原則0円。

## 技術と芸術の別々のゲート

真正専用GitHub Workflow `.github/workflows/p101-k4cm-native-integrated-coast-port-art.yml` は固定K4CL原本全SHA→元ゲームSourceとRoad5・カメラ・木・ライト回帰→真Blender4 EEVEEで編集可能.blend保存→真CHASE768×480 PNG→独立PNG差分（左の地質と右の港湾地形が画面で実際に大きく変わる、中央の元ロードは変わらない）→研究GitHub Evidence・Artifact保存を実行。

[**K4CM初回真正Actions #41989715487**](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41989715487) を起動。本書の作成時点では**まだ実行結果・実画像・ARTの評価は未確定**。失敗なら実ログを読み元ソースを変更せず修正する。成功しても真画像を**直接開いて**自然地形・路面・港の目的、走行の視線、自然なスケール、前作との差を質的にART REJECT/PASS判定する。可視ピクセル数をARTの点数や実ゲームFPSに換算しない。

## 不変の禁止・完成条件

main `d402801f271f43163ad85d9303abe9773d3958bd`、公式P101 `p101-velocity-overdrive-native-trial` HEAD `19d3a32d525c0c2a67082cba646898fab8f2b60f`、Draft PR#46 Open/Draft未merge、原作Slope/凍結Gold、本番2サイト、元Game/Physics/Road/Camera・人間プレイQAに一切触れない。正式ART採用 **0件**、Slope2 DNA認定 **0m**、HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。画像は真Blenderであって正式ゲームの真正スクリーンショットではない。

次の工程は**本当に遊べるゲームの完成を優先**する。ARTが未合格である間、工程数・可視画素数・ツール呼び出し回数を増やすだけの作業は控える。
