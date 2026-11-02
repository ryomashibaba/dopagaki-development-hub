# G4E-7AU — 第2道路の実走行到達性と手動検証入口（PRIVATE HOLD）
2026-10-24 JST／Draft PR #46／Gold・main・本番原作不変更。

## 実際の連続走行（上流を起点00から計測）
- 正規240HzのG4E-7AU CI [#40078962476](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40078962476) SUCCESS。[Native JSON証拠](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40078962476/artifacts/12554531826)。
- AS/AT双方のTRUE-PINCHは**7.025秒／137.13m/sで第1道路から落下、第2道路未到達**。PINCH-SWITCHは**7.05833秒／137.15m/sで同じく第1道路落下**。1/7道路のみ訪問。ゲームはP96補助操舵を使用せず、本試験のP96固定操舵は非人間。
- 第2道路への最近接でもTRUE-PINCH約287.1m、PINCH-SWITCH約305.1m。断定可能なのはこのスクリプトが第2道路未到達という事実までで、全ての人間ラインが不可能とは言えない。

## 本物の第2道路での独立物理チェックポイント（通常レースと混同厳禁）
| 真B48第2道路 | 105m/s | 165m/s |
|---|---|---|
| CROWN u=.18 | 3.4秒 RUNNING、路肩投影マージン最低−43.23m | 0.333秒で実B51衝突 |
| CHASM u=.70 | 3.4秒 RUNNING、路肩投影マージン最低−8.61m | 3.325秒で落下、最低マージン−15.70m |
- TRUE-PINCH/PINCH-SWITCHで上記孤立結果は同じ。**3.4秒継続は安全走行ではない**（位置が実路面の縁外でも一時的に空中で生存する場合がある）。155m/s超の難しさが残る。
- `generateG4E7AUInspection` はATの全ての実B48/B51-C形状・路線・原本スピード律・既存spawnを1ビットも変更せず、**新しい第2道路検証専用スポーンを2つだけ追加したPRIVATE複製**。通常レースのチェックポイント機能ではない。
- AUプレビューには `?g4e7au=inspect&g4e7auPoint=crown|chasm&g4e7auSpeed=105|165`（localhost限定）を使用する。205m/sでの成功や正式スタート00からの到達を偽装しない。
- 公開／public-safeへの生成JSON混入禁止。ALの通常00開始、既存AS/AT、Gold、PR状態は維持。人間・美術・公開・正式Slope2認定すべてHOLD。

次は第1道路〜実ギャップ／出口での**操舵と路面接続の破綻位置を特定し、AS/AT原本を保護した独立実B48改造案で改善**する。検証だけを永久に追加しない。
