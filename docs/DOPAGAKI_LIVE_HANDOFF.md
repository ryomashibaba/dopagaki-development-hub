# DOPAGAKI SLOPE — LIVE HANDOFF（R18 P3実3D制作・真正CI待機／2026-10-30 JST）

**最初にGitHub PR #46の最新HEADと最新Actionsを確認。巨大チャットを毎回読み直す必要はない。**

## 絶対固定
QUALITY/GAMEPLAY/ART-FIRST・INTEGRATED VERTICAL SLICE。元WebGL2/240Hz CCD、ボールr=.65m、元の7 B48本物理道路/28 B51動体、合法P96/P94/A13、元RAWカメラ/HUDのゲーム挙動を変更しない。保護元blob `af076d67492a677d2235e4730aef8cdf4808e106`。main/Gold/P100/本番URL保護、`p101-velocity-overdrive-native-trial`でPR #46をDraft/open/未マージ維持。開発はPRIVATE非衝突アートのみ。手動QAを偽らず、運転支援・幽霊道路・偽finish・公開禁止。

## 直近で本当に判明したこと
- R18 P1もR18 P2も、元Chromium WebGL2の6真正セッション・36 PNGのhash個別一致・新A/B×2世界元Runner finish4/4・独立10偽認定拒否をクリア。ただし真正同条件54/58/61/64/67sの見た目で**両案ART REJECT**。P1は薄い塔と空中アーチ、P2は約30k三角形の鋸歯状混乱・繰り返すシェルという失敗。最終正式ART採用0件、Slope2認定0m。
- [R18 P2真正画像監査](G4E7DZ_R18P2_ORIGINAL_36_PNG_ART_REVIEW_AND_R18P3_DIRECTION_JA.md)／[R18 P3の新造形と厳格ゲート](G4E7DZ_R18P3_ONE_HERO_TRUE_CITY_IMPLEMENTATION_GATE_JA.md) が出発点。P2の元CIは[ #41078746216 ](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41078746216)、元Artifact #12987684703、期限2026-11-06。

## 現在のR18 P3実制作
- **5か所へ類似巨大建築を作る旧設計を明確に廃止**。メイン`road5,u=.91,横-120m`に唯一の中心巨大建築、54/58秒の低い前景街区、64秒の交通地区、67秒退出時のスカイライン。元R18 P0真正カメラ2世界の5地点を時間制約に使用。
- A `A_CRESCENT_CIVIC_ATRIUM`：外半径142m/内半径79m程度の大きなC字型公共構造＋屋根のない中央アトリウム。
- B `B_CARVED_TRANSIT_CITADEL`：高さの異なる2つの巨大な駅街区外皮と中央の大きな吹抜け。AとBは構造設計・XYZメッシュとも別物。
- 実コード `scripts/p101-r18p3-single-landmark-city-architecture.mjs`、真正オリジナルWebGL2 PRIVATE研究用統合`scripts/p101-r18p3-private-original-webgl2-city-pack.mjs`、元6条件ゲームRunner `scripts/p101-r18p3-six-real-original-webgl2-runs.mjs`、36 PNG SHA検証＆真finish＆10偽証明拒否`scripts/p101-r18p3-independent-real-webgl2-source-gate.py`、2世界の元stage不変テスト`tests/p101-r18p3-single-landmark-source-geometry.test.mjs`、Windows研究用ワンクリック`scripts/R18P3_PRIVATE_SINGLE_LANDMARK_ONE_CLICK.cmd`まで保存。
- 真正[ R18 P3専用Actions #41081325468 ](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41081325468)。このhandoff作成時点では**GitHub ActionsでQUEUED（ランナー割当待ち）**。正規源物理・実画像・実GPUレンダリングのPASSはまだ未認定。結果を必ず再読し、失敗なら根因をPRIVATEだけ修正。成功時は元Artifactを期限内に確保、元36枚を直接比較しA/BのARTを厳密に判定する。

## 次の完了ゲート
R18P3実CI Source/physics保護→実6条件/元finish4/4→個別PNG36/36→2世界×54,58,61,64,67秒の実Canvas目視→ART A/B HOLD/REJECT/PASSを根拠付きに更新。Human・Gameplay・Performance・Release・Mergeは別ゲートHOLD。テスト成功・面積増加・ポリゴン数や画素差は美術点にならない。
