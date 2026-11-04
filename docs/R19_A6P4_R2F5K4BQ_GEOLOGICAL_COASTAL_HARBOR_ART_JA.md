# K4BQ — 海辺の地形・植生・公共空間を1画面の実Blender原本として全面制作

2026-11-04 JST。研究隔離枝：`research/k4bq-geological-harbor-art-direction-20261104`。

## 最上位方針とK4BPの確定技術実績

目的はDOPAGAKI SLOPE — HYPER RUSHの**全コースの世界水準の3Dゲーム美術を実際に完成**させることであり、CIや作者メッシュ数だけ増やすことではない。過去の失敗を再生産しない。ユーザー指摘の「全画面が雑な配色・何もない・デザインに値しない」を真の3D画像で検証していく。

前研究枝`research/k4bp-camera-and-road-composition-study-20261104`の最終HEAD `e7904f4813f542904f7f79f80f628031e303441b`。 [K4BP完全監査](R19_A6P4_R2F5K4BP_CONTROLLED_CAMERA_ROAD_COMPOSITION_STUDY_JA.md)、本物の最終[CI #41781600578](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41781600578) completed/SUCCESS、[真正editable.blendと4条件の画像 Artifact #13298834318](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41781600578/artifacts/13298834318)。親原本`K4BP_CONTROLLED_CAMERA_AND_ALTERNATE_ROAD_EDITABLE_RESEARCH_HOLD.blend` 42,147,492 bytes、SHA256 `93c3583655eeb48fa06d61239646bb470419c72bf84cd97235be2288240d26aa`。元Control11307のd70→170m投影広がり3.1957%、追従研究Camera 7.4624%、港側斜め研究Camera 12.8206%。狭い研究RoadとCHASE Cameraを組み合わせたK4BP **D案**はコース形状が相対的に最も読めたが、灰色の単純な斜面と模型的な建物のままなので**ART REJECT**。正式採用0件、Slope2 DNA 0m。

## K4BQで真Blender制作した研究専用の改変内容

**今回はK4BP D案と同じ研究用CHASE_NARROW複製カメラの値を一切変更しない。** 別方向からの新しい画像で成功を偽装せず、`K4BP_CHASE_NARROW_RESEARCH_ONLY_NATIVE_DCC_NOT_GAME.png`との**同カメラA/B**を保存。研究用元Camera複製と、ユーザーのゲームを遊ぶ元カメラは混同しない。

- `scripts/p101-k4bq-native-geological-harbor-art.py`：親のBlender `.blend`を完全SHA固定で開き、元B48全7道路／B51全28・元Rig6 Camera数値・元Road5完全メッシュ指紋を出力前後で検査。元公式オブジェクトや過去研究候補の原本は編集・削除せず、新しい`K4BQ`名前空間下に別名の3Dモデルを制作。旧K4BP/K4BO/K4BN/K4BM未承認コレクションは本研究画像でレンダーOFF。
- **路面**：過去の大きすぎる文字・平面色の塗装から切り替え、天然骨材・アスファルトの2段階NoiseとBump・濡れ/摩耗の不均一さを作者マテリアル化。実メッシュ上の中央が盛り上がる26.3m幅の**研究用独立路面**、物理的に細い左右の白いロードエッジ、実ローカルの落石/排水と接続。ゲームへの可走道路置換は0。
- **海岸地形**：無地の4点斜面ではなく、Camera座標系の実Road5中央線標高に添わせて各側1,564点ほどの幾何学的な侵食斜面を制作。西は海側へ低くなる侵食・歩行可能とは未認定の港盤、東は草地と岩肌がある高台。法面・堆積層の世界座標ノイズ、地表の実ポリゴンごとの草地／石材分類、マルチスケールのBumpを使用。数百の異なる石材塊、松類の枝・幹・葉群、草の細いメッシュを独立の編集可能なまとめメッシュで制作。**旧来の巨大な灰色の壁を直接置き換える。**
- **人が利用する空間**：西の小型港湾デッキ・杭・作業船2隻／通信マスト・展望灯台・沿岸堆積地形／東の室内光と手設計の屋根断面を持つ海岸文化案内施設。実港湾の用途を手段として構造的に表現するが、実人物や車両を生成したと主張しない。
- 夕景をテーマに露出・空のNishita・1本の面積を持つ低い太陽・展覧施設内の必要な灯りを調整。**Blender EEVEE**をXvfb/Mesa software GLで実レンダリングし、CyclesのノイズやImageGenの想像だけで品質PASSを主張しない。
- **画像条件**：同じCHASE_NARROW研究カメラのK4BP D旧とK4BQ新を2枚横並び、さらに元Source Control11307の数値だけ複製したNARROW_FIXED_ORIGINAL_POSEで新3Dを確認。比較は常に「Blender研究DCC、元ゲーム画面ではない」と明示。

## 元ゲーム不変更・不正成功の防止

元ゲーム`web/p101-w9c2-g4e7ci-integrated-streetscape.mjs`凍結Git blob `af076d67492a677d2235e4730aef8cdf4808e106`／原Road5頂点・面指紋`f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、B48実7道路・B51実28移動体・240Hz・球半径0.65m・元全6Camera/安全UI/操作/全アセット原本を変更しない。main、公式`p101-velocity-overdrive-native-trial`、Draft PR#46、両本番URLは不変。Work/Computer Use事前承認、ユーザーWindows操作不要、追加API課金なし。

新研究用Roadは**元B48の安全な後継路面ではない**。新Collider0、B51全28動的クリアランス/SAT/CCD/人間の走行テスト/FPS/RELEASE/MERGEはHOLD。ART合否は完成した本人実画像でのみ判断。未達なら**ART REJECT**と正式採用0件／Slope2 DNA0m維持。

## 実実行の証拠リンク

新[GitHub Actions K4BQ #41783578592](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41783578592)を実行中。保存スクリプト`scripts/p101-k4bq-native-geological-harbor-art.py`、証明workflow`.github/workflows/p101-k4bq-geological-harbor-native-art.yml`。文書初稿の段階ではCI最終・Blender画像・ART判定は**未確定**。本物のPNG/BLEND/JSONと各SHA、元ゲーム保護条件の成功証拠が揃うまで「技術PASS」とは報告しない。途中失敗は途中失敗として記録する。

## 【K4BQ最終監査 2026-11-04】本物のnative DCC制作PASS・実画像の美術REJECT

### 実行・成果物の真正性

- [最終CI #41783578592](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41783578592)は**completed/SUCCESS**。元ゲームGit Blob（`af076d67492a677d2235e4730aef8cdf4808e106`）、K4BP親編集可能.blend SHA256（`93c3583655eeb48fa06d61239646bb470419c72bf84cd97235be2288240d26aa`）、Source Node tests、真Road5元頂点面 fingerprint、元6Camera/研究Camera数値不変、Blender 4 headless EEVEE、真CHASE_NARROW／元Control姿勢複製 NARROW_FIXED_ORIGINAL_POSEの2研究PNG、同CHASE研究Cameraでの旧K4BP DとのA/B、結果JSON、GitHub研究枝への実出力画像保存まで実施。**実ゲームWebGL2の画像ではない**。
- [Artifact #13299639828](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41783578592/artifacts/13299639828)、本ZIP実SHA256 `c689da70ce749ad021083e6d6d13e3a4b7f367ef1424cba66a1a69e08f698717`、ZIP CRCエラーなし。真正編集可能原本 `K4BQ_GEOLOGICAL_HARBOR_EDITABLE_RESEARCH_ART_HOLD.blend` 44,989,436B／SHA256 `5fe3ed2569b807af0b04c46cd1672f83a1c93863a19e958c468369985bd60252`。新しいCHASE_NARROW研究Blender画像1,617,555B／SHA256 `058a5b9f433fe01452dea4acd4b0b98448a220663f857a551c1a71081ae098b8`、元Controlと同ポーズの研究用別Camera画像1,608,125B／SHA256 `ad4d1c0bb2d96772ea0292939b2bb0f8c1b0936d48b67112cd58774cdf21a3f3`。同CHASE研究Camera中立A/B比較画像2,375,531B／SHA256 `ba6fbc07158eeab7dc7f8edd61f76a5dc12dc6fb2da98e0f8ae5d74547dad011`。ZIPをダウンロードして全CRCとBLEND/PNG/ABの元バイトをコンテナで独立計算し、全ハッシュ一致。
- K4BQ名前空間の独立研究オブジェクト70件の他、岩の生成形状・幹/枝/樹冠・草のジオメトリをバッチメッシュ内に構築。**70という数は美術の質の根拠ではない**。元B48 Road5や他6路面は実メッシュの変更無し、元6Source CameraとK4BP研究Cameraの位置回転レンズも変化無し。研究独立幅26.3mの道路は元B48の物理安全道路ではなく、新Collision0。元ゲームの挙動、B51/SAT/CCD/FPSなども再検証していない。

### 実際のCHASE_NARROW 2画像を見た美術評価：**ART REJECT**

- **部分的前進**：旧K4BP Dの左右ほぼ単一色の巨大法面を、低めの侵食地層・個別の大小の岩・緑の植生・小ぶりな松、片側の港湾木造デッキ・船/灯台、もう一方の起伏と海辺の案内施設に置き換えた。研究用道路は大型文字がなくなり、細い境界表示と低彩度を持つ。旧K4BPと同じCHASE研究Cameraで景観が変わったことを実画像で確認。
- **しかし本質的な失敗**：松が単純な角のある三角形の重なりにしか見えず、岩も同型の八面体石が繰り返された低品質ゲームアセットに見える。地表面に矩形の草色模様が現れ不自然、道路は暗いほぼ単色で画面大半を占める。旧K4BM/BQ系の曲面建築は離れた造形物のように見え、実在する文化施設・港の働きが読めない。灯台もカメラ近景で唐突な単柱となり自然な海岸線・港湾スケールが十分に成立しない。遠景の空が広く何もなく、超高速カメラに読める商用ゲームらしい空間構成・自然・素材・速度感が未成立。
- **公式美術として不合格**。現状では「手続き的なオブジェクトで空きを埋めたモデル」から十分抜けられない。元Source Camera/元Road5でのART PASSはもちろん、研究CameraのART PASSも認定しない。正式ART採用**0件**／Slope2 DNA **0m**、HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。

### K4BRに進むための実務的な方針転換

これまでK4BK〜K4BQで「Python手続きメッシュ＋単色/Blender Noiseマテリアルを大量生成」しても、3D実レンダリングで世界級の自然・都市の高級感を実現できていない。この方法を**そのまま主経路に戻さず**、1画面の**本当に高品質な作者/写真計測由来の材質とモデル素材**を利用して成立させる。

1. **写真測量を含むライセンス検証済みの高品質PBR素材**を、まず道路・地形・岩壁で1画面テスト。候補：Poly Haven `https://polyhaven.com/a/rock_ground` と CC0アセット、ambientCGのCC0 1K/2Kライブラリ。公式ライセンス、具体的な元ファイルURL、真正ダウンロード・SHAとパックしたBlender出力の実メッシュを確認してから採用。ライセンスが不明、URLが404、実ダウンロード不能なら無理に置換せずHOLD。**追加課金なし**。
2. 岩と樹木について、Blenderの単純な球・円錐を増殖する代わりに**実写真スキャン/自然な3D樹木アセット**が適切に利用できるか検証する。自動取得が出来ない場合も元原本を保護。景観密度・樹種/寸法、同一形状の反復を目視確認する。
3. 「道路上に占める画面の大半」をリアルな路面粗さ・局所舗装・金属安全物・構造的な変化で作者制作。広い暗色ベタ塗りを避ける。高解像度の実材質を使ってもゲーム最適化/LOD/FPSが未評価であることを明示。
4. まず**K4BP Dと同じCHASE複製Camera+研究独立Road、同一姿勢で評価**、実Blender原本と比較PNGで質が上がったかを審査。『路面だけ質感が良いが景観が不自然』もART REJECTとする。品質未確認のまま他6道路・公式ゲームへ導入しない。
5. 実ゲームの元Road5／Camera本番差し替えは絶対にしない。安全・物理・28動体全時間/CCD/SAT/FPS/元ゲーム実WebGL2の独立検証が必要。最高品質のArt/安全/速度が揃ってからのみユーザーの別承認を求める。

Poly HavenのCC0方針は `https://polyhaven.com/` と `https://github.com/Poly-Haven/Public-API` で事前確認可能。これらのウェブ候補は**今回のK4BQ原本には未ダウンロード・未採用**なので、適用成功・実アセット化を主張しない。
