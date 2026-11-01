# DOPAGAKI SLOPE — R2F4-D 真正GPU法線照明・元カメラ独立ART評価

**2026-11-01 JST／非本番研究ブランチ `p101-velocity-overdrive-native-trial`、PR #46 OPEN/Draft・未マージ。**
**結論：GPU照明の技術限定PASS、独立ART REJECT。正式美術採用0件、Slope2 DNA正式0/2,912m。**

## 今回実装した内容

[最初の実装コミット`bbacacb`](https://github.com/ryomashibaba/dopagaki-development-hub/commit/bbacacbb0c7d665e6ef989e5a541c8df607920c8)で、本当の元`web/drive3d.mjs` shaderコードを確認した。元rendererの`mesh()`はXYZRGB float32×6＝stride24で、vertex shader は`location0:position`と`location1:color`を`shade=color`としてfog付きfragmentに渡す。元の描画には法線、照明方向、材質PBRを描画する属性はない。

R2F4-Dは以下を本物のPrivate隔離モデルだけに実装した。
- 元BLEND・GLBから独立展開した本物の実GPU **44,512三角形**について、法線×3を新たに生成。元のXYZRGB float32 6要素を完全一致で保持し、専用XYZRGBNormal 9要素、**stride36**へ拡張。各14/28mで400,608法線float32、全三角形非退化、最大単位法線長誤差約3.33×10^-16。
- 既存privateと別の`dist-private/r19a6p4r2f4gpu`のWebGL2 shaderだけを対象に`location=2`法線属性、`uniform r2dLit`、fragmentで実face normalに基づくLambert方向光＋周囲光＋補助光を追加。元のB48道路/B51障害物/プレイヤー球は**r2dLit=0で元頂点色を保持**。オリジナルプログラム、元Blender、元RGBのPrivateコピー、元gameのshader/物理/HUD/カメラ不変。
- **PBRではない**。透明ガラス・金属反射・シャドウマップ・光源の物理的動き・環境反射/法線マップを実装済みとは言わない。元`web/drive3d.mjs`への変更はゼロ。
- 旧通常色のR2F4-BとCPU bakeのR2F4-Cは保護。専用R2F4-Dの`tests/p101-r19a6p4r2f4d-gpu-normal-layout.test.mjs`で元XYZRGBと新9floatの厳密一致、法線長、奇数／壊れたbuffer拒否を検査。

## 初回失敗と修正 — 正確な原因・再発防止

[初回Actions #41282571913](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41282571913)はGPU専用ブラウザ待機でFAIL。新shaderのコンパイルエラーが直接確認されたわけではない。**元のGPU Private実装側statusが`P4R2F4D_GPU_NORMAL_LIGHTING_PRIVATE_ART_HOLD`であるのに対し、GPU Native QAが旧焼き込み由来の`P4R2F4D_NORMAL_BAKED_PRIVATE_ART_HOLD`を待っていた**ためultra/control両方で90秒タイムアウトした。ブラウザエラー欄は空であった。この不一致を[修正コミット`1b5f30d`](https://github.com/ryomashibaba/dopagaki-development-hub/commit/1b5f30d74ae4701c5bd1c8f488939a48d80a9266)で照合修正。加えてstride36の実三角形表示をraw.length/27に訂正、次回障害時のdataset/loadStatus/loadError収集と25秒の早期検出を追加。

[再実行Actions #41283177433](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41283177433)は**全23ステップSUCCESS**。真Blender GLB生成／独立GPUデコード、法線×14/28m、元W9C1 ULTRA/CONTROL真正native 240Hz×6秒位置の通常12枚、R2F4-C静的bake4枚、**R2F4-D新GPU fragment shader真正4枚**、全B51元28×2,881tick×2幅=**161,336離散三角形OBB交差0**、7道路のB48近似サンプルメッシュ接触0。元ソースGit blob`af076d67492a677d2235e4730aef8cdf4808e106`と元24枚基準を検証した。

[真正Artifact #13074203101](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41283177433/artifacts/13074203101)：**7,212,889バイト、ZIP SHA256 `261ef35c26018c28a22ef8e317d8768201a752f061a6d16a7a0db6be799f0a86`**。原本をダウンロードしてSHAを照合、46ファイルのBLEND・GLB・元画像・ノーマル画像・CI証拠を閲覧。GPU真正4枚はrenderer reportの各SHAに一致、エラー0件。

## 元真正カメラ画像の独立比較

旧flat色・旧CPU焼き込み・新GPU照明すべて同一1013×698画像、同じ元時刻/カメラ/物理/道路幅。RGB各画素最大チャンネル差が36を超えた割合。左ROI x=0..369/y=200..479、道路ROI x=355..824/y=290..619。数字は**美術の品質点数でもB51可視性PASSでもない**。

| モード | 元時刻 | 全画面RGB差 >36 | 左建築ROI差 >36 | 道路ROI差 >36 |
|---|---|---:|---:|---:|
| ultra 14m | 8.004秒 | **0.5473%** | 2.1322% | 0.0393% |
| ultra 14m | 11.504秒 | **1.8982%** | 9.5347% | 1.0232% |
| control 28m | 8.004秒 | 0.5238% | 2.0946% | 0.0445% |
| control 28m | 11.504秒 | 1.8329% | 9.1255% | 0.8930% |

実画像：11.5秒の左前景建築の下面・立面に明暗の差が出て、前CPU bake（11.5秒全画面で>36差0）より本当の面法線効果が大きい。一方で**公共施設は依然として不自然な単純曲面屋根と箱状の無人都市**として読め、魅力的な内部市場や地区構造の読みやすさの抜本改善はない。8秒も差は小さい。**ART REJECT／正式採用不可**。

道路ROIで強い色差が一部出ているのは、建築の遠景やその投影が道路ROIに入る可能性があり、**B51の実ラスタ視認性は別途未検証**。元道路・球・B51のRGB/物理コードを変えていないことと、ピクセル上の危険視認性が証明されたことを混同しない。

## 次の方針と動かしてはならない契約

静的RGB bake → isolated real GPU normal light の技術ゲートは成立した。しかし**美術のボトルネックはライティングだけでなく建築の造形・人間規模の使い方・内部活動・材質の多様性**。このままライト係数、ポリゴン数、柱/屋根の個数を変えるだけの連続反復を止める。次は、元8秒／11.5秒の本当のプレイ画面で読める未来都市公共施設の**入口・駅市場の内部／都市と繋がった地面**を、Blenderの本物の建築設計と用途をもとに見直す。実3Dの具体性が向上したものだけ、隔離privateシェーダーの使用を検討する。PBRを自称するのではなく必要なら実マテリアル／GLB拡張・描画費用・危険認知を別途評価する。実ART改善のない候補でフルCI再実行を量産しない。

厳格な元B48描画/エンジン静的三角形全一致検査、tick間B51 swept CCD、地盤接地・人間通路・避難、B51実画素遮蔽、Windows/iPhone FPS、実人間240Hz高速操舵は全てHOLD。現B48は53,760近似道路三角形とのAABB候補0であり、正式な元B48厳密静的安全性の証明ではない。

PR #46 OPEN/Draft/未マージ。main/Gold/P100/W9-X/B5、元240Hz・原B48×7/B51×28・球/操舵/自然ジャンプ/カメラ/HUD/2本番URL変更なし。ART正式0件、Slope2 DNA正式0/2912m、GAMEPLAY/HUMAN/PERFORMANCE/RELEASE/MERGE HOLD。
