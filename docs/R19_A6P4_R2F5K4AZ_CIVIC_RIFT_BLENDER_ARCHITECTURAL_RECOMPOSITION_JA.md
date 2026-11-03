# K4AZ — Road5《Civic Rift》建築・地形のBlender-native根本改修（ART REJECT維持）

**2026-11-03（JST）／研究ブランチ** `research/k4az-road5-civic-rift-dcc-recomposition-20261103`

## なぜこの工程を実施するか

K4AY 7視点の真正Camera数値DCC画像は、道路が広い明色平面になり、左側の巨大単一屋根・右側の孤立塔と中身のない空間しか感じられない。世界水準の高速ゲームとして**依然ART REJECT**。技術統合だけをもって前進扱いしない。まずK4AYのnative-authentic B48/B51に揃えたまま、建築の構成と公共空間を**全体的に再制作**する。

- K4AY真正参照：[Actions #41612254866](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41612254866) SUCCESS、[Artifact #13218659517](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41612254866/artifacts/13218659517)。Blender source SHAと7 camera shotsは前工程正本の通り。
- road source: B48 index5 `p93-PRISM_CREST-01`、4,728 true triangles。Road5の実道路幅約90〜106m（この区間のメッシュから計測）。これは全画面の空白が多い理由の一部であるが、**物理的な道路幅を狭くしない**。
- source B51 28体×6 tickを同時に見せず、正しいnative frameごとに28体を持つ参照groupを表示。physics OBBは元可視障害物のアートではない。

## Blenderで実際に追加した原本

[新しいBlender-native建築ジェネレーター](../scripts/p101-r19a6p4r2f5k4az-road5-civic-rift-blender.py)を追加。K4AY .blendを元に読み込み、古いK4AXの美術コレクション5つは**消去せず表示だけ停止**。

**設計変更：**

1. 元B48の本物の格子91×13を直接参照し、両側の道路端から距離を取った位置へ全新建築を配置。**ダークバサルト＋銅＋温かい公共コンクリート＋深緑ガラス**を軸に、天候・ライティングも独立スタジオ側で制作。
2. 左岸を**3枚に分かれた実立体の有機的公共ヴォールト**とし、屋根の間に空のスリットを残す。実柱、段状公共テラス、開いた店舗入口、公共読書室、温暖な実照明、地層を支える外部回廊を組み込む。従来の巨大白い板屋根・単純箱増築とは構成を変える。
3. 右岸に**複数レベルの居住公共アーケード・入口抜きの回廊・屋外公共デッキ・反射池・段階式庭園**を建設。中央に道路を保ち、左右のスカイラインを異なる高さの建築と外部地形で繋ぐ。
4. 分断された立体を、道路端に沿う地形の層理・多段デッキ・玄関・水景・樹冠・装飾の明瞭な意味で連続化。極端な斜め梁やJS box量産を繰返さない。
5. 元Road5道路メッシュをDCC描画に限って暗色・荒い石質の非衝突美術候補で表示し、物理曲面を直接サンプルしたわずかな路面インレイ・施工ジョイントを分離collectionに作成。**原P100/B5路面案内の安全意味の置換認定ではなく、元ゲーム道路／描画は変更しない**。

## 実装する証拠と境界

- K4AY本物のsource .blendとsource road JSONのSHA監査、元凍結Git blob `af076d67492a677d2235e4730aef8cdf4808e106` の直接検査。
- 6元source numeric Camera×新K4AZ DCC画像、旧K4AY 6画像との同じ原Camera座標のA/B contact sheet、1 independent studio art camera。A/Bは**美術差の画素計測であり合格認定ではない**。
- K4AZ新編集可能 `.blend`、GLB、PNG/SHA JSON、独立source road vertex+triangle topology fingerprint before/after。
- 専用CI [K4AZ workflow](../.github/workflows/p101-r19a6p4r2f5k4az-dcc-civic-rift.yml)は初回実行結果が確認できるまで**PENDING**とする。ACTION SUCCESSになってもART PASSにはしない。

## 次の正当な工程

1. K4AZ Actions実ログとsource artifactを取得し、元Cameraの画像を目視して**美術可否を強く審査**。昔のK4AX/K4AYのような平面・無目的な建築に見えたら当然REJECT。
2. 本物の道路上の建築・光源・面積遮蔽と元B51個体別物理OBBの安全な分離を証拠つきで計測する（DCC参照の大まかな非干渉は**source game CCD/HUMAN PASSではない**）。
3. アートが世界水準の厳しい審査に値する場合だけprivate WebGL2真正camera/240Hz/A/B移植を検討する。元原作の危険・進路案内表示は代替評価なしに消さない。

**固定方針**：正式ART採用0件／Slope2 DNA認定0m／ART REJECT、HUMAN/SAT/CCD/FPS/RELEASE/MERGE HOLD。元球半径0.65m、元240Hz、B48七道路、B51二十八基、元Camera/当たり判定/速度/操作、source blob、main、`p101-velocity-overdrive-native-trial`、本番、Draft PR #46無変更。Workは事前承認制。ユーザーのPC操作ゼロ。
