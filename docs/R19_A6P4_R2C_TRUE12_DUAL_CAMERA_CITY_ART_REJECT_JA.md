## R2C全240Hz後追い検査：結果確定

**[全時刻独立Actions #41190038075](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41190038075) 全SUCCESS**。[原Artifact #13037653968](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41190038075/artifacts/13037653968) のJSONを実際にダウンロードして確認した。双方の元14m/28m道路幅について、**2881 tick/幅、B51 28体、実GLB 30,088三角形**。元ステージの全0..2880 native 240Hz点、各**80,668個の動体・時刻組み合わせ**を厳密な回転OBB対三角形SATで判定し、**交差三角形0**、JSON `failures=[]`。全幅合計**161,336動体・時刻組み合わせ**で検出0。これはGPU実画素視認・時刻間の数学的連続掃引安全・身体操作の達成ではない。

R2Cの**技術判定は実Blender/GLB・元WebGL2 12/12・元240Hz全2881点B51空間ゲートPASS**。**美術判定はART REJECTのまま**。実家屋の居住可能性、地盤接地、人間プレイ、安全視認性、性能、リリースのHOLDは変わらない。

---

# R19 A6 P4 R2C — 本物の12画面で「8秒・11.5秒両方に都市」を実証／美術REJECT

**2026-10-31 JST。** [R2C真正Blender・GLB・元WebGL2 CI #41189700048](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41189700048)は全SUCCESS。原[Artifact #13038431720](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41189700048/artifacts/13038431720)のBLEND/GLB・元14m/28m×6 native tick計12画面を取得し、元ソースのP3真正「都市なし」画像と比較した。

## 保護境界と達成範囲

- 元GitBlob `af076d67492a677d2235e4730aef8cdf4808e106`、元7 B48・28 B51・球240Hz・RAW camera/HUD保持。main、Gold/P100/W9-X/B5、本番不変。PR #46 Draft・未マージ。
- Blender各幅5編集可能地区メッシュ／29中低層建築マス、**14,424 Blender面／30,088独立GPU三角形**。編集可能BLEND・実GLB各道路幅1件。真正元WebGL2 Canvas12/12、元A0球物理のソース差約0.0008m以下。元B51回転OBBとの**6時刻×28基×両幅**での三角形衝突0。全2881tickの結果は独立[Actions #41190038075](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41190038075)を確認するまではR2Cの合格としない。

## R2A→R2B→R2C真正画面差分（同一ULTRA元240Hz）

再現に使うのは元P3真正「建築なし」PNG（1013×698 px）と、それぞれの実GLB表示PNG。中央視野矩形：`x=202..809,y=140..319`、RGBの最大チャネル絶対差が36を超える割合。**純粋な建築画素占有率ではなく、同条件画面差分の参考尺度**。

| カメラ時刻 | R2A | R2B | R2C |
|---|---:|---:|---:|
| 4.404s（Road0狭路） | 9.13% | 18.70% | **21.63%** |
| 8.004s（Road1前方） | 5.60% | 29.26% | **35.12%** |
| 11.504s（Road1通過後） | 32.40% | **0.00%** | **23.59%** |

- R2A：11.5sには街区があるが8sに主役なし。
- R2B：8sは大きく改善するが11.5sには都市がほぼ全て左後方へ消失。
- **R2C：真正8sと11.5sで同時に前景・中景に街区の存在を実現**。R2Bの消失問題は解消した。一方、R2Cの4.4秒には遠景に建物が列状に積み重なる。

## 独立のART判定：REJECT

R2Cは**技術的な画面連続性を改善した**ものの、元WebGL2の静止画で見える街は、単調な直方体・段付き箱の反復、大きさが均一な窓バンド、暗い何もない背景、居住・公共施設の根拠がない面構成であり、ユーザーの「圧倒的な美しさ、Slope2 DNA、人間プレイ可能」には達していない。40～100m級の凹凸を付けるだけの工夫では独創的な立体都市にはならない。

この段階で正式ART採用0件、Slope2 DNA正式認定0/2,912m。ART REJECT、GAMEPLAY/HUMAN/PERFORMANCE/RELEASE/MERGE HOLD。画像色差値をART PASSに読み替えない。元B51の**実GPUピクセル遮蔽**も人間の認知も未検証。

## 次の美術工程：R2Dの抜本的な建築言語・低層公共性の作り直し

R2Cで獲得した8sと11.5sの両視野を**絶対に回帰させない**。主役都市核は、もはや29個の同形8断面・48リング押し出しの変種を増やすのではなく、まとまりのある大きな空洞・異なる中高層マス・中庭地盤・視認できる歩廊と公共ボリュームを作る。ブロック塗り絵や門、長大水平リボンを禁止。より細かく密な建築群を増やしても、各機能が3Dとして読めるか、遠景シルエットが一体となるかを実画面3時刻で審査。実GLBを原WebGL2で再描画、厳格なB51空間SAT検証を必須とする。なおこれらは未来計画であり、**R2Dを制作済みとは言わない**。
