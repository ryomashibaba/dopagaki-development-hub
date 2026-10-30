# DOPAGAKI SLOPE — LIVE HANDOFF（R19 A0 統合代表区間へ、2026-10-31 JST）

**最新の方針**：R18 P5の「美術だけの形状量産」を停止した。実ゲームのGAMEPLAY×ARTの一体的な10〜15秒代表区間を先に成立させ、約7.28km中2,912mのSlope2 DNA目標へ実証距離だけを加算する。現在の公式Slope2認定0m・正式ART採用0件。ユーザー操作は最小化する。

## 保護するもの
元ゲーム web/p101-w9c2-g4e7ci-integrated-streetscape.mjs Git blob af076d67492a677d2235e4730aef8cdf4808e106、元240Hz/CCD、球半径0.65m、元B48道路7・B51動体28・正規P96/P94/A13・原RAWカメラ/HUD。本番/main/Gold/P100/W9-X/B5に未承認変更なし。作業は p101-velocity-overdrive-native-trial の Draft PR #46、未マージ・公開不可。不可視床/強制接地/減速/自動救済/偽finish禁止。

## 前工程の厳格結果
R18 P4の真正 WebGL2 Actions #41128954286は全工程SOURCE TECH PASS、6/6正規ケース・36/36 Canvas PNG SHA・新A/B×2世界の真正自動Runner finish4/4。ただし両案ART REJECT。R18 P4で初めて改善した本物の道路沿いの市街地の連続性は研究成果として保存するが、巨大無地壁/反復箱/視界の圧迫を正式美術に採用しない。証拠は docs/G4E7DZ_R18P4_GENUINE_36_PNG_ART_REJECT_AND_R18P5_GATE_JA.md。

## 現在の工程R19 A0
- 真の完成モデル約52秒の「0秒〜12秒」ABYSS DIVEを代表区間に確定。以前R18の70秒研究コースにおける54〜67秒とは時間軸が別、同じ12秒だと偽らない。
- ユーザー既定のW9-C0/Slope DNA約40%=2,912mと、既存W9-C1真正B48実狭幅14m/対照28mを再利用。対象は元道路0の310〜360m（狭幅コア50m、正式認定ではない）。本物の0秒スポーンから同じ240Hz nativeで12秒まで、元位置・速度・接地・警告からコアまでの秒・路端・元B51接触を計測する。手動試遊の代替と偽らない。
- 既存の非衝突景観 G5B（web/p101-w9c1-g5b-skyline.mjs）を再利用、デフォルトOFF。新しい巨大都市案を毎回作らない。
- 実装 scripts/p101-r19a0-real-12s-integrated-gameplay-city.mjs、unit tests/p101-r19a0-12s-integrated-source-play-and-art.test.mjs、GitHub Actions [#41131345970](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41131345970)。A0 Native物理・既存G5B同スポーンの真正Chromium画像を1本のCIで検証する。**CIの最新実結果を再確認すること。** ART/人間/実GPU FPSの合格は宣言しない。
- 詳細 docs/R19_A0_FIRST_REAL_12S_GAMEPLAY_ART_VERTICAL_SLICE_JA.md。設計・テストの重複を増やさず、旧W9-C1の証拠・テスト・Windows手動比較を再利用する。


## R19 A0 真正完了（実結果優先）
[修正後Actions #41131784122](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41131784122) 全ジョブSUCCESS。初回 #41131345970 もCI成功だがPlaywrightがNative JSONの出力ディレクトリを消してArtifact欠落→保存先を r19-evidence に変更して再実行。真の原Artifact #13013401969（ZIP SHA256 3249da442b0a824931aa95c27a8754f20af2797e8c90daf4aa68af98102f2258、2026-11-06期限）は完全な12秒Native JSON＋実Chromium WebGL2元320m同スポーンON/OFF画像4枚＋視覚QA JSONを含む。
元0秒スタートで12秒間の正規240Hz/2,880tick連続：幅28m CONTROL/14m ULTRAともrunningで、元の道路0→道路1へ接地進行、移動B51接触0・空中0。最高速度は116.742/115.519m/s、警告1.104秒→本物の狭路コア初到達4.404秒＝3.300秒。ULTRAのコア真補間幅13.159〜14.000m、速度82.423〜87.874m/s、元B48上の概算路端余裕最小1.743m（危険余裕。人間の公平性は未確認）。元G5B景観は本物のWebGL2に表示できるが、320m局所52m/s画像は0〜12秒の加速走行時のカメラではない。
正式ART0件/Slope2 0m。A1は元Native12秒・本物の元WebGL2時刻一致と元B51の前方視認性、A2は道路と都市の**1案だけ**の同時高品質設計、早期人間試走は別ゲート。詳細は docs/R19_A0_FIRST_REAL_12S_GAMEPLAY_ART_VERTICAL_SLICE_JA.md。

## 次工程
A0の真正Native traceとブラウザ同スポーン画像を確認。途中で死んだ・コアに到達しない・2秒警告不足などを正直に記録。A1で初の「本物の0〜12秒走行中のカメラ・元B51視認」とsource physicsを時刻一致で比較。A2で走行と巨大都市の主造形を**1案だけ**同時に制作し、ゲーム本体と実画像で評価。Human/Windows GPU/FPSは別ゲート、承認なしに公開/mergeしない。

**正規SOURCE TECH合格≠ART合格≠GAMEPLAY合格≠人間の楽しさの証明。**
