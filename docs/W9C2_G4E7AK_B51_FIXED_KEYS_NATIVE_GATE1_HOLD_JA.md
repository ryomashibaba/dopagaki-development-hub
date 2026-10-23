# G4E-7AK 第1ゲート — 真のB48 11m細道＋既存B51-C 2基／時間固定A・D操作試験

2026-10-23 JST。対象: 開発ブランチ `p101-velocity-overdrive-native-trial`、Draft PR #46のみ。
正本: `PROJECT_STATE.md` と G4E-7AH／7AI／7AJ 監査。**全て非人間研究、正式採用・人間QA・美術・公開はHOLD。**

## 今回実際に追加したもの

- `scripts/p101-w9c2-g4e7ak-native-key-matrix.mjs`：既存7AJ reanchor 2道路と移動体28基を読み取り専用でロード。52m/s start00、実Runner 240Hz、現行OVERDRIVE／A13前進加速を変更せず9秒試験。P96早期soft操舵を基準とし、2.05–2.80秒の固定左・右、2.62–3.22秒の固定左・右、計5条件×2道路を測る。各入力delta ±0.38は既存P96出力への加算であり**人間操作ではない**。
- 各試験の成功／失敗、実移動接触（致命・bounceを区別）、真球半径0.65mでの球と移動箱の最短離隔、固定時刻の入力・速度、2基による概算横断面占有を保存。
- P96基準の実位置／元カメラから2基の中心を数式投影する。ただし**実Chromium/WebGL画素、路面による遮蔽、実際の人間の視認力は測定していない**。横断面占有も物理OBBの局所近似であり安全経路の証明ではない。
- `tests/research/p101-w9c2-g4e7ak-native-key.test.mjs` と `.github/workflows/p101-w9c2-g4e7ak-native.yml`：技術・保護条件をCIで検証し、結果を期限付きActions artifactへ保存。ビルドやサイトを変更しない。

## 正規240Hz実測

[専用CI #39968223375](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/39968223375)：**SUCCESS**（2件テストPASS、9秒×10条件、JSONアップロード成功）。
Artifact: `g4e7ak-real-240hz-fixed-AD-39968223375`（artifact ID 12507972133）。

| 操作条件 | true-pinch | pinch-switch |
| --- | --- | --- |
| 元P96基準 | running 9.000秒、動体接触0、01との最小離隔2.541m | running 9.000秒、動体接触0、01との最小離隔0.718m |
| 早い左 2.05–2.80秒 | FAILED 2.77917秒、01のfail衝突 | FAILED 2.82083秒、01のfail衝突 |
| 早い右 2.05–2.80秒 | FAILED 6.45833秒、動体接触0 | FAILED 6.57083秒、動体接触0 |
| 遅い左 2.62–3.22秒 | running 9.000秒、接触0、01と最小1.716m | FAILED 2.92083秒、01のfail衝突 |
| 遅い右 2.62–3.22秒 | running 9.000秒、接触0、02と最小1.775m | running 9.000秒、02のbounce接触7.29316秒（最小離隔0.108m） |

`running` は**9秒の範囲で生存しただけ**。7道路完走ではない。
早い右2条件は移動体への接触を記録せず途中でFAILEDになった。**どの地形・破綻が原因かはこの概要ログだけでは未確定**。実際の失敗JSONを参照して分類すること。
回転腕とのbounce接触も、フェアな障害物・楽しい走行の証明とはみなさない。

## 決定／制限／次の入口

- B48実路面の幅、52番欠損セル、既存7道路、28基の動く物体、うち26基の元記述子、速度・操舵・球半径・カメラ・当たり判定は変更なし。過去の7AA比較基準と7AJ原本の候補を保持。offset-phaseの衝突案は**REJECT/HOLD**のまま。
- **物理条件に対する左右キー入力差は実在**。しかしP96補正付き固定波形であり人間の判断や初見プレイは未計測。
- **G4E-7AK次の実作業**：reanchor版真B48と2基の元動体を、7AIと同じ元の実240Hzボール相対カメラで*実Chromium WebGL*表示。描画のみquiet/legacy比較・スクリーンショット・実物体による遮蔽・接近予告時間を計測し、localhost/privateだけで隔離。左・右の早／遅キー波形の視覚的予告可能性は実機/動画と人間入力で別判定。
- 現工程の**WebGLは未実施、画面から避けられるか未検証**。G4E-7AKの第1ゲートは技術成功／人間・美術・全編・正式採択はHOLD。
- Slope2 DNA正式認定 **0m**。Draft PR #46 OPEN/Draft/未マージ。main/Gold/旧候補/原作再現/両本番は変更禁止。マージ・Ready化・公開禁止。

新チャットでは `PROJECT_STATE.md` の固定URLを入口に、GitHub現HEAD・PR #46・本監査・現行CIを取得してから続行。
