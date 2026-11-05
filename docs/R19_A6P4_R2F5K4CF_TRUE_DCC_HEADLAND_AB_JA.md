# K4CF初回の真正Blender/独立SHA監査と直接ART評価（2026-11-05）

**厳密な状態：初回TECH PASS／A案・B案ともART REJECT。正式ART採用0件／Slope2 DNA認定0m。修正版R2は現時点では結果未確定。**

- 真正[GitHub Actions #41939075340](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41939075340) は完了／SUCCESS（Blender4.0.2 EEVEEを実行、2つの編集可能な3D断崖メッシュを同じCHASE768×480でレンダリング、原Game・Road5・6Camera・木・ライト・黒筋・右港・元実形状を保護、画像・監査・ログを研究GitHubにpush）。
- 親K4CE実.blend SHA256 `3f0bc2f048dec39bc263151e2117b374d40b7422478c7e9b49583865c836d63e`のバイト検査PASS。新しい真3Dの編集可能.blendは276,013,952 bytes、SHA256 `91c51a5986f1ab22e4945bbf36224f7870076539873c6a255b9d34cfcf1904b0`。A：5,601頂点最大+11.779m、B：5,608頂点最大+15.761m、左右の原ROAD5とCameraは元のまま。
- 真正 [Artifact #13375059698](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41939075340/artifacts/13375059698) ZIP 124,877,555 bytes／SHA256 `b671618a8cd31b5538b34d7dcd98c17b682977bdcc887ed9686f6339a3f2a4a4`。本会話で**独立ダウンロードしてZIP全CRC=PASS、.blend/PNG各バイト数・SHA256全一致**を実測。研究成果は元Gameの真正WebGL2でも人間プレイでもない。
- [**A3の継承K4CE対K4CF A/Bの本物の同CHASE三者比較**](research-evidence/k4cf/K4CF_TRUE_CHASE_BASELINE_VS_TWO_REAL_HEADLAND_DIRECTIONS_ART_REVIEW.png)を実際に開いて直接美術審査。Aは円錐形状の峰が二つ立ち、Bは過度に巨大な丸い山のような形。両案とも**規則正しい濃淡横縞が目立ち、砂製の層状ケーキ／人工地形に見える**。路肩の足元も途切れたスカート状となり、左の自然地形として成立しない。元道路が広い灰色面として中央を支配し、右港の模型感は一切解消していない。**両案ART REJECT**。A左画像差34,748画素、B38,884画素、A対B33,338画素はすべてTECHの可視性のみで、芸術品質の点数として扱わない。道路/右港の独立画像差0。
- 「表現が高品質になった」という誤認を避けるため、**初回の真画像/検証証拠をそのまま研究GitHubに保存したまま**、円錐形と横縞の根因を修正した。初回実装のピクセル空間Gaussian upliftとWorld-Z SINE高コントラスト岩縞は採用しない。
- **研究R2作者修正**：`scripts/p101-k4cf-native-windward-cliff-art-directions.py`で、左右の孤立した大山を減らし、ワールドで緩やかに連続する海岸斜面／低い断層侵食へ変更。色表現は実3D手続き材質の低コントラスト鉱物ノイズへ切替。旧編集可能ソースは不変、元道路・Camera・Game・物理・木11・港・水面の保護閾値も変更しない。[GitHub Actions #41939899891](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41939899891)で本物のR2検証を実行中。この段階ではR2をTECH/ART PASSと断定しない。

今後は画像を必ず直接開き、三枚比較で本物の地形の連続性、自然な地質、道路画面上の読みやすさ、他の景観との一体感を重視。品質不足なら正式採用は0件のまま。小さなQAや地形モデルの量産を目的化しない。

---

# K4CF — 左海岸地形・真正Blender二方向／安全な現行工程（2026-11-05）

## 固定方針・出発点

この工程は既存DOPAGAKI SLOPE — HYPER RUSHの続行であり、新規企画・正式版取り込み・ロードマップ変更ではない。世界水準のゲームアート品質を最優先し、技術成功とART合格、人間プレイ成功を別々に判定する。元Slope、main、公式P101 `p101-velocity-overdrive-native-trial`、Draft PR#46、物理・Road5・6原作Camera/CHASE、木11本、照明、研究港・船、凍結Gold、本番2サイトは保護。追加有料API原則0円、Work/Computer Useは個別事前承認、ユーザー操作0。

K4CE真正編集可能親 `K4CE_REAL_COHERENT_FOREGROUND_FERRY_EDITABLE_ART_HOLD.blend` SHA256 `3f0bc2f048dec39bc263151e2117b374d40b7422478c7e9b49583865c836d63e`を親とする。前工程 [#41935099728](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41935099728)は真正Blender TECH PASS／直接ART REJECT（船の可視改善、しかし模型感・道路過大占有・左崖単調）。編集可能Blender真正Artifact #13374375359はZIP全CRC／SHA独立照合済。

## 実装・研究対象

新隔離枝 `research/k4cf-windward-cliff-hero-frame-20261105`はK4CE HEAD `7f48017028cde9d932132e239fb7188bd9997abc`から分岐。

- `scripts/p101-k4cf-native-windward-cliff-art-directions.py`：元K4CC研究地質メッシュ約13,426頂点を真正Blender内で**別研究メッシュとして二重複製し、各案ごとに真の立体彫刻**。Aは暖色の地層を持つ風化した広い海岸崖、Bは強い起伏と暗色の岩盤の断崖。単純な箱・小型プロップの追加ではない。地質はWorld-Z縞・本物のMesh表面・岩肌バンプを作者プロシージャルシェーダーで設計。編集可能.blendにA/B両方向を保存してデフォルトはA表示、元研究岩は非破壊のまま研究Renderでだけ非表示。
- 元Camera固定の同CHASE視界を使って地形の変位の許容範囲を制限するが、**撮影用の画像平面・billboardではなくワールド空間で実メッシュ頂点を変形**。道路中央視界へ飛び出す実形状を安全停止する。原Game git blob `af076d67492a677d2235e4730aef8cdf4808e106`、元Road5形状 SHA `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、元6Camera/CHASE、旧樹11・光源・旧建築や船体、旧岩メッシュを変更しない。元ゲームCollider0追加。
- `.github/workflows/p101-k4cf-native-windward-cliff-art.yml`：親K4CE真正Artifactと内部全ファイルSHA固定→実Blender導入→同一CHASE 768×480でA/B双方を真正レンダリング→独立ソース／各.Blend/PNGハッシュ／道路画素・右港画素・K4BZ黒筋6対→GitHub研究証拠保存→Artifactアップロード。各案の画素差は技術的可視変化の指標でありART採用スコアではない。

## 現時点で確認済み／未達

[真正GitHub Actions #41936765348](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41936765348)を実行。**本記録時点で元GameとK4CE原本全SHA・過去回帰の前提チェックまで成功、Blender/依存パッケージのインストール中（in_progress）**。そのため**K4CFの真正3D制作完走／新Blender原本／真正画像比較／独立ART評価／TECH PASSは未確定**。失敗する場合は必ず該当ActionsのBlenderログを見て原因を特定し、道路視認ゲートや元原作・カメラの安全条件を緩めない。結果取得前にARTの成功を宣言しない。

次回は最初に最新Actions run `41936765348`のstatus/conclusion、各Job、Artifactsの有無を照合すること。Blenderが完走した場合は実PNGを**直接開いて**左岩肌の立体造形・遠景・道路中央・右港・元黒筋を評価、実用的でない場合は**ART REJECT**。実.blend/各PNGのSHAとZIP CRCを独立再DL検算する。必要なら実景観の造形を修正し、CI再実行。ただし小さなQAを目的化せず、本当に走行視界が改善する場合に限る。

**正式ART採用0件／Slope2 DNA認定0m。HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLD。** Work/Computer Use事前承認・追加有料API0円・ユーザー操作最小化維持。
