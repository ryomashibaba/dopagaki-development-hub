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
