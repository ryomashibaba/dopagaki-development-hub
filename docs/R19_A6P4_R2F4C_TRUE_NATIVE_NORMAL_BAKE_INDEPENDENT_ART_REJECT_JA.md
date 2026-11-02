# DOPAGAKI SLOPE — R2F4-C 隔離法線焼き込み実装・元WebGL2真正画像QA・ART REJECT

**2026-11-01 JST／研究ブランチ `p101-velocity-overdrive-native-trial`、Draft PR #46 OPEN/未マージ。**
**SOURCE TECH限定PASS／ART REJECT。正式ART採用0件、Slope2 DNA認定0/2,912m。**

## 1. 今回実装したこと（「PBR搭載」とは言わない）

[実装コミット `c3210e8d4233`](https://github.com/ryomashibaba/dopagaki-development-hub/commit/c3210e8d423338117b1b4f52fde8de0921203cda)で、R2F4-B元Blender編集済みGLBの**三角形ごとの実法線**をCPUで計算し、2方向の明暗と微弱な暖色/寒色調整を頂点色XYZRGBのRGB部分だけへ焼き込む、独立モジュール`scripts/p101-r19a6p4r2f4c-normal-bake.mjs`と単体テストを作成。元GLB頂点、元ゲームWebGL2シェーダーと物理・カメラは無変更。

- 元の`dist-private/r19a6p4r2f4/`はflat colorの**研究原本を保全**。研究専用`dist-private/r19a6p4r2f4shade/`を別途出力し、**同じ6-float XYZRGBのすべてのXYZ 3値をビット完全一致**で保存したままRGBを変更。各モード実GPU三角形**44,512**、変化したRGBチャンネル数**400,596**、非退化三角形44,512／退化0。計算した照明係数はultraで**0.71382〜1.06779**、controlで**0.71393〜1.06779**。
- 元CGパイプラインは元からGLB COLOR0→XYZRGBのWebGL2頂点色を描画。R2F4-Cはシェーダー変更なし、**法線/光源・影を常時再計算するものではなく、リアルタイム照明・PBR・環境反射・透明なガラス・法線マッピング・影生成は存在しない**。PBR実装済と誤記しない。
- 新規`tests/p101-r19a6p4r2f4c-normal-bake.test.mjs`の座標バイト不変・頂点形式・不正配列・退化三角形の検査にPASS。元ロード7区間/B51 28基/240Hz/HUD・球/操舵/自然ジャンプ・原SHA `af076d67492a677d2235e4730aef8cdf4808e106`・main/Gold/P100/W9-X/B5・二つの本番サイト不変。
- 既存の1ワークフローを再利用し、元通常色12真正WebGL2画像（6 tick × 14/28m）と元sourceカメラから法線焼き込み4真正画像（**tick1921=8.004秒、tick2761=11.504秒×14/28m**）を同一GitHub Actions内で撮影。ほか原B48全7道路を各7680三角形で近似した静的サンプル検査、原B51全2,881tick×28×2幅＝**161,336離散判定交差0**、真正GLB読み戻し、元カメラ/240Hz等を再確認。

## 2. 追試できる真正原本

[GitHub Actions #41280238609](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41280238609) **22/22ステップSUCCESS**。独立[Artifact #13072014461](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41280238609/artifacts/13072014461) ZIP 6,726,962 bytes、**SHA256 `0d5f525dbb4aaeea7cc0c82625ba74d939c8dd3aa76f4b8e74b0e19a3c03a12b`**をダウンロード後の実バイトで照合。

Artifact内には編集可能なultra/control .blend、実GLB、独立GPU source検査、元12 PNG、R2F4C 4 PNG、R2F4C RGB SHA/法線係数統計マニフェスト、元B48・B51の衝突検査JSONなどが残る。**通常/法線PNGは各撮影レポートのSHA256と独立照合**。source長さ・ジオメトリ・カメラが一致した比較。

## 3. 実画像の独立RGB差分（真正1013×698）

同一モード・元tickについて通常版と焼き込み版のRGB各画素最大チャネル差が**36超**の割合。左ROI x=0..369, y=200..479。中央道路ROI x=355..824, y=290..619。

| モード | 時刻 | 全画面RGB差>36 | 左建築ROI差>36 | 中央道路ROI差>36 | 平均RGB絶対差 |
|---|---|---:|---:|---:|---:|
| 14m ultra | 8.004s | **0.3930%** | **2.6824%** | 0.0000% | 0.5930 |
| 14m ultra | 11.504s | **0.0000%** | **0.0000%** | 0.0000% | 0.7481 |
| 28m control | 8.004s | **0.3563%** | **2.4315%** | 0.0000% | 0.5934 |
| 28m control | 11.504s | **0.0000%** | **0.0000%** | 0.0000% | 0.7683 |

11.504秒の0%は**RGB差36を超えた画素がゼロ**という意味であり、画像全体が完全に同一という意味ではない。実画像のハッシュは異なり、最大画素変化は32。8秒でも最大40〜41。比較色差はHUD/道路を変えたものではなく建築部分に局在。画面上の美術改善は**非常に小さく、入口・広場・人の居る市場・都市の美しさに質的変化がない**。ART REJECT。

## 4. 制作上の結論と次の工程

**R2F4-Cの静的face-normal RGB bakeだけでは美術不足を解消できない**。三角形に明暗を焼くコードだけ増やしても、元描画パイプラインが陰影・法線や材質を描画していなければ実質的な奥行き感は向上しない。また現行のBlender建築自体に店の活動・壁/床/屋根の用途表現、人が入るアクセスの真の証拠もない。

次は**隔離private rendererだけに新しいXYZRGBNormalのような法線対応属性と明暗shaderを設計**し、元WebGL2本番コードへ無断移植しない。最初にオリジナルprivateの`mesh()/draw()`、GLB import展開・頂点レイアウト、実shaderソースをread-onlyで監査し、**専用の4枚真正カメラだけ**で美術・B51可読性と処理負荷をチェック。費用の大きい全12枚・全B51を毎候補でやらず、根拠のある美術改善案だけ後続の完全検証へ通す。画像が改善しなければ無目的なgeometry/gamma/colorパラメータ増殖を停止し、公共建築のコンセプト自体を再設計する。

**未認定の安全ゲート**：元B48全エンジン静的三角形との厳密交差、tick間B51 swept CCD、実地盤支持、人体/避難通行、B51実画素遮蔽、ユーザーによる高速走行、Windows/iPhone FPS。現B48 53,760三角形は**近似サンプル**であり、詳細SAT候補0で数値が0になっている点を「厳密な道路安全」と混同しない。

元ゲーム・公開環境・PR Draft不変。ART0件・Slope2 DNA正式0mを継続。
