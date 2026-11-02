# DOPAGAKI SLOPE K4W — 元真正240Hzカメラから逆算する「読める公共空洞」の条件

**日付：2026-11-02 JST。** 正本：`ryomashibaba/dopagaki-development-hub`、研究ブランチ `p101-velocity-overdrive-native-trial`、Draft PR #46。K4/K4R/K4U独立ART REJECT、K4V「真の20×28m中庭床の近似投影が元14m幅のK4Uで縦6.93/8.87/11.68/15.38px、1.7m定規は1.62/2.22/3.26/4.88px」を継承。

## 目的と不変契約

**新建築・美術量産を再開しない。** 元A5/Blender原5メッシュ、原240Hz、真球／カメラ、B48×7、B51×28、Gold/P100/W9-X/B5、main、公開ゲーム・本番2サイトを固定。K4R/K4Uの34モジュール／668追加面／11,902三角形の不採用市場は**証拠として読むだけ**。人体モデル、屋根増築、新地形、新コライダー、ゲーム内カメラ変更は0。保護契約を変更・緩和しない。

[**K4W 読取専用Python解析**](../scripts/p101-r19a6p4r2f5k4w-original-camera-void-constraint-study.py)／[**K4W専用Actions**](../.github/workflows/p101-r19a6p4r2f5k4w-original-camera-void-study.yml)／[**Actions #41379909949**](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41379909949)。

新コードは4件の証拠Artifactを改変せず再取得：K [#41312758260](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41312758260)、K4R [#41351118263](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41351118263)、K4U [#41359514124](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41359514124)、K4V [#41374785974](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41374785974)。各ZIP CRC、元画像SHA、元球/速度/CameraEye/Front、凍結K4V関数のGit blob、K4Vの各16件実カメラ×中庭投影数値を独立再演算で照合する。

## 逆算する2種類の仮条件

**（A）視野内の1.7mスケール。** K4Vの元カメラEye/Front、元Road0真アンカー、凍結K4R中庭床中心z=.86で、1.7mの垂直な**数学的定規**を投影する。同じ位置・同じカメラで仮に8px／12pxのスクリーン上の長さを得るのに必要な仮の物理高さを数値求解。**実際に人物、柱、看板を描くわけではない。8px/12pxは人間視認の実証済み閾値ではなく、単なる比較用の目盛り。** 実人体をその高さに拡大する提案でもない。

**（B）凍結屋根の下にある実中庭。** 元K4Rモデルの無屋根中心コートはx∈[-11,11]m、y∈[-15,15]m、上面z=.85m。K4Vの解析と同じ内側`x±10,y±14,z=.86`の実床を数学的に等方拡大した場合、縦の投影寸法が24px／32pxとなる必要倍率を数値求解する。元屋根の縁はx=-13およびx=12なので、**屋根形状を変更しない限り**中心コートのx±10mを広げる数学的倍率は最大1.20倍（右境界12/10）に制限される。これを超える数字は「現在の建築のままでは無理」であって、新建築案の完成図ではない。

**重要：両方とも元ゲームの実GPU投影行列ではなく、K4Vで使用したK2方式の1013×698px/係数1.35の近似射影。** 投影値の誤差は実WebGL2スクリーンショットの差分位置と混同しない。K4Wの画像は元ゲーム／K4Uの真正原WebGL2 PNGに**研究用の黄色の数学的な輪郭と説明文をあとから重ねた画像**であり、ゲームが新建築/人を描いたスクリーンショットではない。

## 判定契約

1. GitHubの元Artifact全CRC/SHAと、原コード（元source blob `af076d67492a677d2235e4730aef8cdf4808e106`、K4R市場原Git blob `e653029771982b2c39ee2831ea19199f0704ddaa`、K4V計算Git blob `1c6d2e232e71b225b9f2206c89beffe8f8ca2104`）を照合。原実PNGは8カメラ×original/K4U、K4R原実画像も旧K4Vに一致すること。
2. K4Vの16測定値を再計算し、数値の取り違え・画角の混同・元画像の偽造があればFAIL。14m/28m×4tick×K4R/K4Uの16組で逆算と比較対象の限界値を出力。
3. 新建築モデル0・新collider0・原物理変更0、公式ART採用0・Slope2 DNA0mを証拠JSONに明示。**技術的な計算成功をART/人間可読性の合格と扱わない。**
4. 出力予定は統合JSON1件＋元A5/K4Uの真画像を使用した注釈つき図解（道路幅別2枚）。この段階ではまだ真正な市場3Dの改善案を制作しない。

## この先の設計原則

K4Wで判明した射影制約を満たせるかだけを競わない。**K4Vの主たる失敗は、屋根群は画面に現れても公共空間の用途と奥行きが読み取れないこと**であり、建物の単純な大型化・人間スケールの偽装・屋根/床の増築では解決したと宣言できない。次段階はカメラ位置を変えないまま「負の空間のシルエット」「街路と屋内外の接続」「空間の正面／横方向の見せ方」を視認できる構図研究。採用・施工前には**本物の元走行画面を使う独立美術審査と真B48/B51の候補固有SAT/CCD・歩行・人間テスト**が必須。

**当初ステータス：K4Wコード・GitHub Actions起動。最終TECHは本CIと独立出力確認までHOLD。正式ART0件、Slope2 DNA0m、候補固有SAT/CCD/人間操作・歩行・FPS・RELEASE/MERGE HOLD、PR #46 OPEN Draft未マージ。**
