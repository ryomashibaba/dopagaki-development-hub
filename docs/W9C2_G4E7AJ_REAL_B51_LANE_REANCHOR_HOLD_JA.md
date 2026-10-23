# G4E-7AJ — 本物の11m細道に既存B51-C障害物2基を再配置

基準日2026-10-23 JST。対象Draft PR #46、開発ブランチのみ。元の7AH物理道路・7AI高速実WebGLを凍結して派生させ、main/Gold/両本番/原作不変更。

## 1. 問題の実測：もともとの第I道路にいた実動体2基が道路から遠い

[原本28基read-only正規240Hz CI #39965311906](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/39965311906) SUCCESS。7AHの true-pinch と pinch-switch に同じstart00速度52m/s、実240Hz、P96早期ソフト/4.8研究用非人間操舵を適用。

| 元の実B51-C | true-pinch道路中心へのオブジェクト静止基準距離 | pinch-switch距離 | P96球との最短距離（true-pinch / pinch-switch） |
|---|---:|---:|---:|
| a13-machine-01 / 大型スライダー（fail） | 64.227m | 71.149m | 59.350m / 64.475m |
| a13-machine-02 / 回転腕（bounce） | 35.454m | 36.756m | 16.472m / 25.012m |

7AHの本物の道路形状が変わった一方、これら2基のオブジェクト座標は旧広い道路に置かれたままだった。元の配置では第I細道を走ってもmoving-contact 0。28基全体の魅力を評価した結果ではなく、第I道路の2基についての診断。

## 2. 変更：増設せず、既存2基だけを本物のB48に追随させる

`scripts/p101-w9c2-g4e7aj-reanchor-moving.mjs` を追加。独立研究候補2道路×3レイアウト：

- original：全28オブジェクト・道路が7AHと同一。対照用。
- reanchor：a13-machine-01のスライダーを第I道路u=.32、a13-machine-02の回転腕を同u=.80に再配置。路面中央、実際の局所曲率に追随する左右法線、球の高さと元の動く箱を使用。
- offset-phase：同じ再配置だが2基のモーション位相だけ更に変更。元と衝突タイミングが本当に変化するかのストレス試験。**採用しない**。

新しい障害物を追加していない：計28基。残り26基は記述子ごと原本と完全一致。移動障害物型・当たり判定モード・サイズ・周期・材質は不変更。実道路7本・B48の真の欠損cell52・踏切/再接地・速度・人間向け入力・カメラも不変更。オート操舵や透明補助物理は導入していない。

## 3. 実240Hzの実測：局所と全編

[6条件局所9秒CI #39965859127](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/39965859127) SUCCESS。実際の元エンジン240Hzで失敗もそのまま記録。

| 物理道路 | original配置（9s） | reanchor（9s） | offset-phase（9s） |
|---|---|---|---|
| true-pinch / 真11.267m幅 | running / 接触0 | running / 接触0 / 最接近2.541m | **FAILED 2.8083s** / a13-machine-01に実接触 |
| pinch-switch / 真11.458m幅 | running / 接触0 | running / 接触0 / 最接近0.718m | **FAILED 2.8583s** / a13-machine-01に実接触 |

reanchorで第I障害物がはじめて実走路に接近することを確認した。位相変更案は実際に致命障害物と衝突したが、**接触＝避けがいがある証拠ではない**。むしろ高速時の予告/左右空間を確認するまでREJECT/HOLD。

[全7道路の実240Hz original vs reanchor CI #39966424992](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/39966424992) SUCCESS。

| 道路 | original全編 | reanchor全編 | 初回ギャップと再接地 | 動体接触 |
|---|---|---|---|---:|
| true-pinch | FINISHED 56.1417s | **FINISHED 56.1417s / 7/7** | 維持 / 85.98m/s | 0 |
| pinch-switch | FINISHED 57.0000s | **FINISHED 57.0000s / 7/7** | 維持 / 82.72m/s | 0 |

元のP96操舵は新たに配置した2基に特別な自動回避を行わず、それでもreanchorは衝突しなかった。これは実路面近くにオブジェクトが戻り、全編走行は不可能にならないという限定した技術的成果。最短距離が0.718mになったことで、人間の初見操作で安全と見なしてはいけない。

## 4. 証拠の限界・次工程

**技術：G4E-7AJ reanchor 2案PASS。人間QA・フェアな回避経路・一目で分かる危険・美術・正式採択・公開：すべてHOLD。** これは研究用スクリプトからの物理成果で、まだ再配置後の実WebGL描画で目視評価していない。

次のG4E-7AKでは、元のプレイヤーカメラから障害物の横移動と接近が読めるか、実際の左右キー入力による早め/遅めの回避候補が成立するかを試す。動体が道路幅を丸ごと塞ぐ不可避時刻がないかも評価。P96の自動完走だけで人間公平性を認定しない。

正式Slope2 DNA 0m、Draft PR #46 OPEN/Draft/未マージ、本番・Gold・原作保護。