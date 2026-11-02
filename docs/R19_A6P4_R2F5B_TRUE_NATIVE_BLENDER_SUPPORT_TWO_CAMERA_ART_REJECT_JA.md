# DOPAGAKI SLOPE — R2F5-B Native Blender単館建築・真正2カメラ・独立ART REJECT

**2026-11-01 JST。非本番研究ブランチ `p101-velocity-overdrive-native-trial`／Draft PR #46 OPEN・未マージ。**
**結論：R2F5-Bに限り編集可能なNative Blenderを結合し実GLB／2枚の元240Hzカメラ画像を得た。技術限定PASS、ART REJECT。正式ART採用0件、Slope2 DNA正式0/2,912m。**

## 1. 何を作り直したか

旧[R2F5-A`f766e66`](https://github.com/ryomashibaba/dopagaki-development-hub/commit/f766e66d0de39ff553e00b962ca059aafcfd85cd)の8.004秒地点の`Road1 u=.100`、左道路端から35mにある市場駅1施設だけを変更した。11.504秒地点の旧R2F5-Aは**未採用の対照として変更せず**。色パラメータや放射状の単純`addloft/slab`積み上げではなく、**Blender標準メッシュオブジェクト、実際に適用するBEVEL modifier、閉じた3D屋根、屋根下面の高さ関数と一致させた12本の柱とフーチング、実梁・基壇・店頭・アクセス階段**を組み立て、地区0に結合して全5メッシュを保った。

- [制作コミット`d232bb4`](https://github.com/ryomashibaba/dopagaki-development-hub/commit/d232bb4da1e288e872582f0a5d3c3ac113b42567)でR2F5-B専用3script／Workflow＋研究方法を保存。
- 建築専用Native Blender部品**63個**、柱**12本**、柱の上端と屋根下面の構成値による最大隙間**0.0m**。これは**その計算上の接続**を証明するにすぎず、基礎が現実の地形に乗ること・人間が歩けること・Blender上の材料強度は証明しない。
- 旧R2F5-Aスクリプト、旧R2F4-D GPU法線版、main/Gold/P100/W9-X/B5、元ゲーム（source Git blob `af076d67492a677d2235e4730aef8cdf4808e106`）と原B48×7/B51×28・240Hz・自然ジャンプ/左右操舵・カメラ/HUD/得点、二つの本番URLは**不変**。物理Colliderは新設0。

## 2. 本物のCIとテッセレーション失敗→修正

- [初回Actions #41286242881](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41286242881)は**新Blender生成そのものは成功**し、GLB五地区を書き出したが、独立読戻しの**50,000三角形上限**に抵触。独立ZIP内GLBのindices accessorを計算した結果**53,860 triangles**。これをSOURCE TECH PASSとは記録しない。
- [修正コミット`22c87db`](https://github.com/ryomashibaba/dopagaki-development-hub/commit/22c87db5f59525c606fb90d27fec3da04b6d83f7)では全Native cubeのBEVELを**3分割から1分割**へ変更してポリゴンを削減し、GLBインポータの上限自体は**変更なし**。
- [修正版Actions #41286633222](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41286633222)：**全25工程SUCCESS**。編集可能BLEND×ultra/control、glTF COLOR_0メッシュ独立デコード、旧基準画像QA、**新8.004秒×14/28m 2真正WebGL2画像**の撮影に成功。新Blender実メッシュ**22,562 faces**、新GLB正規indices **44,788 GPU triangles**（設定上限50,000未満）／5編集地区／Native建築63部品。
- [Artifact #13074894706](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41286633222/artifacts/13074894706)：ZIP **15,426,877 bytes**、SHA256 `f07d6b0f6992966721c569f55edf0abfc5c1b0cd9013d24961afdc8e423a0215`（ローカルダウンロードZIPを独立計算、70ファイル）。
- **注意：** CI内の元B51全0..2880tick×28×2幅、原B48×7道路の近似サンプルSATは**従来R2F4-Dメッシュについての検査**である。新R2F5-B GLBの衝突安全性は一切認定できない。新造形の地盤接地、厳密B48とB51、時刻間CCD、人間通行、真ラスタ障害物遮蔽、Windows/iPhone FPSも別HOLD。

## 3. 旧R2F5-Aと真正同一8.004秒のRGB差

両ZIP内の同じ元240Hz tick1921/ultra・control、1013×698のPNGを使用し、新画像SHAを撮影レポートへ照合。旧→新のRGB最大チャネル差が36を超えた比率。**RGB差は美術品質や危険認知の点数ではない。**

| 指標 | ultra14m | control28m |
|---|---:|---:|
| 全画面RGB差>36 | 2.38363% | 2.32055% |
| 左建築領域 x0..369 y200..479 | 15.68726% | 15.35811% |
| 中央道路領域 x355..824 y290..619 | 0.00000% | 0.00000% |
| 最大RGBチャネル差 | 230 | 230 |

**真正美術審査：ART REJECT。** 旧版の大型の切り離された淡色屋根に比べ、実柱や桁が元カメラに反映され、屋根と地盤の形式的な一体性は少し前進。しかし元8秒カメラ画面では建物が**画面左端で切れている、小さな暗い箱状構造**として見え、公共施設内部・店の営み・未来都市としての空間的個性が弱い。片方の道路幅で良くても採用不可。正式美術認定は0。

## 4. 次の工程：同じ箱/屋根を増殖させない

今回の本質的な成果は**本当のBlender標準部品で1棟を自動構築し、構造部品を元の五地区GLBへ統合し、独立三角形上限と真正元カメラ画面を通す制作経路が実証できたこと**。一方、現画角では内部のクオリティが読めず、同一位置に無闇に高層化・看板/柱を追加しても進歩にならない。

次のR2F5-C候補は、**元カメラの射影に対し建築の全体形が実際にフレーム内へ収まること**と、画面上で入口・柱・屋根の支持関係が50〜150px程度の十分な寸法で読めることを**造形前の配置ゲート**として研究する。元B48全7道路/B51全2881tickの既存安全側候補検索から、撮影画像の左端で切れない同一道路外の候補のみ選ぶ。壁や屋根を近づけるだけで原レース進行方向を遮るのは禁止。最初は軽い幾何射影と2元カメラだけ、Artの前に本物の地形/建築利用関係を設計する。元ゲーム、物理、カメラ/HUDを変更して画角を都合よく見せることを禁止。

R2F5-B制作自体を本番採用しない。PR#46 Draft OPEN/未マージ、ART0、Slope2正式0m、SOURCE TECH限定研究結果として保存。
