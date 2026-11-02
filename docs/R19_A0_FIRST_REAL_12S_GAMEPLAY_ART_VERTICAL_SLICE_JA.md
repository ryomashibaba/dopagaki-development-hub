# R19 A0 — 最初の12秒で本物のゲーム性と都市を統合し直す

**2026-10-31 JST。R18までの迷走を止め、Slope DNA 40%と人間が楽しいゲームを開発の主軸に戻す。現段階は真正CIの結果待ち。公式Slope2認定0m、正式ART0件、GAMEPLAY/HUMAN/PERFORMANCE/RELEASE/MERGE HOLD。**

## 何を変え、何を守るか

R18 P1〜P4の8つの都市案は真正元WebGL2の技術証拠を残したが、全てART REJECT。R18 P4の「道路に根付いた連続街区」という改善は保存するが、類似建築を生成して不採用を繰り返す方法は停止。新しいR18 P5の大量造形より、本物の走行ゲーム性と都市を一つの区間へ統合することを優先する。

**選択した代表区間**：本来の約52秒級7.28kmゲームの、元0秒スタートから最初の12秒（研究用R18の70秒世界の54〜67秒とは別の時刻系）。既存W9-C1物理道路0・ABYSS DIVEを再利用する。実道路幅28mのCONTROLと14mのULTRAを一対で比較する。幅のコア310〜360m、物理的な絞り込み200〜440mは従来の確定計画を変更しない。

## 実装したコードと再利用範囲

- scripts/p101-r19a0-real-12s-integrated-gameplay-city.mjs：元Runner、元240Hz CCD、元P96、元A13加速則を使用し、0秒から12秒までの実球位置、B48路面、速度、接地、狭路幅、概算路端、元B51移動接触、視認用の警告フェーズ、2秒警告が成立するかを出力。途中スポーンでの速度リセット、偽コライダー、強制操舵は無し。
- 実正規B48物理7本・B51動体28基・元Gold/W9-X/B5/main/生産用ソースを改変しない。幅14mの実装はW9-C1に既存の真正B48格子を再利用する。
- 都市は既存 web/p101-w9c1-g5b-skyline.mjs を再利用。表示は明示opt-inで、物理衝突を伴わない。**旧G5Bは正式ARTで合格していない**ので、見た目に関する認定は引き続きHOLD。
- tests/p101-r19a0-12s-integrated-source-play-and-art.test.mjs：真正2条件・元Gold比較・正式認定0・元原本SHA・未承認の安全状態を検証。
- [R19 A0専用GitHub Actions](https://github.com/ryomashibaba/dopagaki-development-hub/actions/workflows/p101-r19a0-true-12s-integrated-vertical-slice.yml)：W9-C1の既存単体QA＋両条件の真正native12秒計測＋既存Chromium W9-C1 G5B同スポーン画像を同じワークフローで実行。証拠JSON・PNGをArtifactに保存。**同スポーン画像を12秒の真カメラ同期映像と偽らない**。

## 厳格採用ゲート

1. 14m/28mの本当の物理幅、7B48/28B51、0秒からの240Hz、合法P96、元Blob SHA一致が前提。Nativeで失敗・落下した場合は失敗として保持し、誤った距離認定を行わない。
2. 狭路進入の2秒前までに警告表示が発生したかを正規native traceで検査する。警告データの発生は人間が視認できた証明ではない。未到達・2秒未満はHOLD。
3. ブラウザ同スポーンの既存G5B画像は3Dソースが表示された証拠だが、走行中に美しい・危険物が読めるという保証はない。
4. 今後A1では元12秒カメラ時刻とnative位置を同期して本物の画像比較、A2では一案のみの街区美術を物理と同時に調整、A3では短いWindows人間試走で操作とFPS/危険物を確認。その後に実合格距離だけを40%目標2912mへ加算。
5. R18 P4研究成果は凍結して保存。ART失敗の繰返しを防ぎ、ゲーム性と視覚の統合を優先。PR #46 OPEN/Draft/未マージ、Gold/P100/main/本番は不変更。

この工程でユーザーが必要な操作はなし。人間の判断が必要なQA段階だけ、一度の短い試走を依頼する。


## R19 A0 実測確定（2026-10-31 JST）

**初回[GitHub Actions #41131345970](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41131345970)は全ジョブSUCCESSだが、test-resultsを後続Playwrightが掃除するためnative JSONがArtifactに含まれなかった。この証拠欠落を見逃さず、保存先を独立r19-evidence/へ変更し、[修正再実行 #41131784122](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41131784122)で全ジョブSUCCESSと元JSONの保全を再確認。**

- 修正後の原[Artifact #13013401969](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41131784122/artifacts/13013401969)：ZIP 657,439 bytes、SHA256 3249da442b0a824931aa95c27a8754f20af2797e8c90daf4aa68af98102f2258、失効2026-11-06 21:33:57 UTC。JSON本体1件、CONTROL/ULTRAの各WebGL2元320m・ON/OFF画像4枚と視覚QA原JSONを全て実際に再検証。
- 12秒間の元240Hz真正NativeでCONTROL/ULTRAとも状態running、2,880tick、走行区間0 ABYSS DIVE→1 CROWN REVERSALまで真正実接地。途中スポーン、途中速度リセット、偽走行床、隠し救済を使っていない。
- CONTROL実物理幅28m：最高速度116.742m/s、移動B51実接触0、最長非接地0秒、警告初観測1.104秒、310mコア初到達4.404秒、警告→コア3.300秒。コアで速度82.886〜88.247m/s、元B48真幅27.329〜28.000m、概算路端最小余裕9.093m。
- ULTRA実物理幅14m：最高速度115.519m/s、実接触0、最長非接地0秒、警告1.104秒、コア4.404秒、警告→コア3.300秒。コア速度82.423〜87.874m/s、元Catmull–Rom真補間幅13.159〜14.000m、**概算路端最小余裕1.743m**。この危険な小余裕を正式人間QAで足切りする必要がある。14m目標の一部で真幅が13.159mになることを隠さない。
- Native 50msサンプルはCONTROL/ULTRA各240点の真正球XYZ、速度、road ID、接地、実横幅、推定路端、警告フェーズを含む。原本JSON中の数値は回帰・手動比較の正本。
- 既存G5B同スポーン320mの真正Chromium WebGL2 ON/OFF画像4枚：元source B48幅28m/14m、G5B全4,608本物の表示三角形、路端65m以上の非衝突、デフォルトOFF、同視点の描画差を確認。ただし**320mローカルプレビューは初速52m/sへ戻す別資料であり、本物の0〜12秒加速走行中の元カメラ動画ではない**。G5Bは巨大な柱・単純な外形が多く、美術上の完成度は未達、正式ARTはHOLD（採用0）。
- この12秒の走行成立から、コア50mを正式Slope2 DNA認定済みとすることはまだできない。0mのまま。人間操作の予告認識・操舵・落下リスク/楽しさ・Windows実GPU FPS、原B51を実際に認識・回避できるか、元0〜12秒の同期WebGL2美術は次A1/A2で検証。

**次工程A1優先**：元Native12秒の球XYZ/速度/警告の真正時刻を、同じ初期走行・相同の元WebGL2カメラ画像と同期させる。320m地点に速度52m/sで瞬間移動した美術画像を12秒プレイ画面として再利用してはならない。その後、物理道と都市を1案同時設計し、人間QAを早期に入れる。
