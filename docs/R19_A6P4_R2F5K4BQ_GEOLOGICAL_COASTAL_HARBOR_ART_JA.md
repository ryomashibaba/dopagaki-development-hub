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
