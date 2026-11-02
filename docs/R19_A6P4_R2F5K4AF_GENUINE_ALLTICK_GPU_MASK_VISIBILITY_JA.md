# DOPAGAKI SLOPE — K4AF Road5 7時点×2幅×6群の真正GPU遮蔽時間計測

記録日：2026-11-03 JST。

## 固定正本と現状

- GitHub `ryomashibaba/dopagaki-development-hub`。
- 元継続 `p101-velocity-overdrive-native-trial` と Draft PR #46 を変更しない。 `main`・Gold/P100/W9-X/B5・元ゲーム・本番の固定2URLは不変。
- 研究ブランチ `research/k4af-road5-7tick-six-layer-native-gpu-depth-20261103`。分岐元：K4AE研究ブランチ HEAD `7aa8219d38f9254e8db15cbddad8d474f82f6b08`。
- **K4AD TRUE GPU技術源は確定成功**：[CI #41463872981](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41463872981)。元ゲームsource Blob `af076d67492a677d2235e4730aef8cdf4808e106`、82枚元K4Z PNG SHA、Road5の14枚元WebGL2フレームのHUD外3D画素完全一致、実GPU RGBA24深度14/14、46秒の6群×2幅の12マスク、元への深度復元成功。これは技術的な観測能力の限定PASS。ART認定ではない。
- **K4AE時間分布研究は確定成功**：[CI #41466857011](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41466857011) = `completed/success`。真正Artifact [#13153921353](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41466857011/artifacts/13153921353)、ZIP SHA256 `beba0b76ded60d7d7580cf8478dfc3dd452a7b0157edee28e8cc982a02f8a19b`、CRC全2件OK、生JSON SHA256 `da4a5ea9e033e5b1c75b8099d3c728e1884abaf6447eb28a75f5f8a08e6087c1`。7時点×2幅の非線形深度を固定JSONから再解析。28m 47.0秒の24bit正確な下半分は3,556点（それ以外13画面は0）。**単一46秒のマスク観測を7時点へ勝手に拡張していない**。
- K4AF専用：[CI #41472149272](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41472149272) は登録済み、検証完了前の段階。**K4AFの全84マスク PASSを先取りして宣言しない**。

## 今回のK4AF実装（元ゲームでなく研究専用）

1. [真正ブラウザ実走行](../scripts/p101-r19a6p4r2f5k4af-road5-allticks-six-mask-webgl2.mjs)：K4ADで成立した元GPUのRGBA24エンコード手法・元球・元240Hz/Camera/mesh/shaderを一切変更せず、44.5, 45.0, 45.5, 46.0, 46.5, 47.0, 47.5秒の**7時点**で14m `ultra` と28m `control` の元WebGL2元姿勢を真正K4Zに照合。各tick、元depth→本物のSource GPU 6描画群を**1群ずつ**一時非表示にした深度×6→元表示復元深度を取得。研究期間で14元frame + 84 mask + 14復元を計測。元SourceとK4AD描画ループは改造しない。
2. [独立Python監査](../scripts/p101-r19a6p4r2f5k4af-independent-alltick-mask-audit.py)：元K4Z82 PNG SHA検証、Road5元14PNGのHUD外3D全画素差0と独立DOM HTMLの`#chapterHud`微小アンチエイリアス制限継承、**84 mask全件の同一実球/カメラ/240Hz原tick、K4AB元source実draw census、実GPU replay draw数整合、深度差は遠方方向のみ/近距離新生0、元への深度14復元全11,176サンプル一致と3D画素差0**を厳守。欠損・0/1全一様depth・捏造object ID・元3D不一致を拒否。Source実描画数は実値から算出し、未知時点を固定72件と決めつけない。PASS判定は全件真正証拠取得時のみ。
3. [日本語報告生成](../scripts/p101-r19a6p4r2f5k4af-source-mask-temporal-report.py)：84件のCSVと、幅別7時点×6群のGPU深度サンプル差の表をMarkdownとして書き出す。1群ずつの除外なので差分割合の加算・平均による「全景認識率」は禁止。
4. [専用GitHub Actions](../.github/workflows/p101-r19a6p4r2f5k4af-allticks-source-masks.yml)：元K4Z Artifactの82 SHAをダウンロード・固定・本物のChromium + SwiftShaderを使って再現・独立監査。passでもArtifactに `ART HOLD` を記載し本番とは分離。ユーザーPC/ZIP再提出不要。

## 測定の意味の厳格な制限

Source GPU depthは `gl_FragCoord.z` を24bit非線形で記録した**8px格子11,176サンプル**。百分率は「その描画群を一時的に消した時、より奥のGPU depthが現れた割合」。**人間の視認率・物体ID・空洞が建築的に成立する割合・安全走行率・物理距離(m)・画質の良さ・建築の迫力ではない**。原ゲームは特殊角度からの映りに依存するため、2幅を平均して合格とはしない。K4AFで見えた時間はこの7時点の離散観測に限り、秒間の継続可読性は人間による連続動画審査が必要。

## 固定HOLD

- ART-FIRST / K4,K4R,K4U独立ART REJECT維持、正式採用0件、Slope2 DNA認定0m。
- 元球/240Hz/カメラ/B48 7/B51 28、Gold/P100/W9-X/B5、main/本番URL、原始Source Blob、PR #46 OPEN Draft維持。K4AF新モデル0、新Collider0。SAT/CCD/HUMAN/FPS/RELEASE/MERGE HOLD。
- Chat/GitHub主体、Work事前許可、PC/ZIP操作は要求しない。

## 次工程の条件

K4AF Actions #41472149272の最終状態・ジョブログ・Artifact SHA/CRCを実地で確認。もし失敗なら最初の真正な原因を切り分けて最小の修正のみ。全84条件の元source gpu depthが成立し、全14復元の画素が保たれる場合に限り研究用時系列結果を記録し、巨大建築が主役として認識できるかの別ART審査方針を提示。データ不在の視点を合格扱いせず、本番公開しない。
