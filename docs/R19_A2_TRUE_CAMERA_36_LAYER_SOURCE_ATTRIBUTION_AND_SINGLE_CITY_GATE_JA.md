# R19 A2 真正240Hzカメラの旧未来都市レイヤー別発生源監査（2026-10-31 JST）

**不変目標**：人間が楽しく操作できる7,280m／約52秒級のSlope系高速ゲームに、圧倒的に美しい未来都市を統合する。Slope2 DNA計画2,912m、正式認定0m、正式ART採用0件。

## 原本の保護
元web/p101-w9c2-g4e7ci-integrated-streetscape.mjs Git blob af076d67492a677d2235e4730aef8cdf4808e106、240Hz CCD/半径0.65m、7 B48実道路/28 B51動体、P96/A13真正操舵、元生カメラ/HUDを保持。main/Gold/P100/W9-X/B5/本番に変更なし。実験はPR#46 DraftのPRIVATEのみ、元コライダーやプレイヤー救済なし。

## 何を実際に変更したか
- scripts/p101-r19a2-private-original-source-layer-isolation.mjs は成功済みR19 A1のPRIVATE元WebGL2をコピーし、そのコピーでのみA13機械架台とW9長壁を別メッシュに分割してON/OFFする。
- 元通常描画のscenery (epic)、megaWorld、W9 Hero、A13機械フレーム、G5Bを個別にOFF可能にした。さらに研究用road-hazards-onlyモードでは装飾景観を除くが、実B48道路・元B51実障害物・物理・正規HUD/警告/球は維持。
- 対象は最初の12秒のW9-C1、元ULTRA 14mで7モード×4正規native tick（721/1057/1249/1921）、元CONTROL 28mでall/minimalの2モード×4 tick、計**36枚の本物の元Canvas画像**。局所スポーンや物理速度の変更は行わず、A0原走行とxyz/速度/道路IDを照合。
- scripts/p101-r19a2-independent-source-layers-36png-gate.mjs が画像SHA256、同じ球位置、28 B51、未承認ゲートを検証し、データ改竄を拒否する。
- scripts/p101-r19a2-actual-native-layer-pixel-contributions.mjs は同tickの元画像の画素差（RGB差>20、中央ROI）を定量化する。画素差は障害物の遮蔽・人間の視認・建築美の点数ではない。

## 発生源の静的コード根拠
web/drive3d.mjs の既存処理はscenery/megaWorld/g5bSceneryMesh/a13ArchMeshを描画する。web/p101-a13-w9-architecture.mjsのLAUNCH FOUNDRYは実道路0のu=.045〜.46を24分割し、側壁・屋根を連続生成する（肩外19m、高68m）。a13MachineMegastructuresは元16追加B51周辺に機械架台を生成する。G5B OFFでも壁が見えるというA1現象と整合するが、画素への実際の帰属はA2真正画像比較が必要。

## 正式判定
CI全成功と元画像の実目視・数値を両方確認するまでSOURCE TECH PASSは未確定。すでに合格したA1の0〜12秒Native GAMEPLAY×ART基準に戻して、旧巨大長壁が見えなくなる効果と、14m狭路の障害物読解を同時に検証する。高品質未来都市の新設計は1案だけ、既存問題の原因切り分け後に着手する。

ユーザーの当初方針を維持：ART/GAMEPLAY/HUMAN/PERFORMANCE/RELEASE/MERGE HOLD、正式Slope2認定0m、ART採用0。
