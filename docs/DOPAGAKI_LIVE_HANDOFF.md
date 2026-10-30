# DOPAGAKI SLOPE — LIVE HANDOFF（2026-10-31 JST・R19 A2真監査→A3一案制作中）

**最上位目標**：元7,280m/約52秒級の本物の高速Slope2系ゲームと、驚くほど美しい巨大未来都市を同じ実走行で完成。旧R18での美術案大量反復をやめ、14m物理狭路と都市を一案で共同設計する。正式ART採用0、Slope2 DNA認定0m、GAMEPLAY/HUMAN/PERFORMANCE/RELEASE/MERGE HOLD。

## 絶対守ること
元正規WebGL2 `web/p101-w9c2-g4e7ci-integrated-streetscape.mjs` Git blob `af076d67492a677d2235e4730aef8cdf4808e106`、元7 B48/28 B51、240Hz CCD/r.65m、P96/P94/A13、元生カメラ/HUD、Gold/W9-X/B5/P100/main/本番保護。PR #46はp101-velocity-overdrive-native-trialのDraft/open/未マージ。本番に研究候補を移行禁止。磁石・透明床・偽走行/偽合格禁止。

## 真正SOURCE TECH PASS（前工程）
- A0：本物のW9-C1道路0開始0秒→12秒、ULTRA真幅13.159〜14m、CONTROL28m、双方running、最高速度約115〜117m/s、警告→コア3.300秒、ULTRAの実路肩概算最小1.743m。SCRIPTED P96であり人間QA不可。元Artifact #13013401969。
- A1：元WebGL2×元Native同tick 265,721,1057,1249,1921,2761の原24 PNG/24 SHA、元球XYZ最大差0.0007704m・速度0.0004716m/s、A1 CI #41133092902成功。既存G5B+元レガシーART REJECT。
- **A2：真正[CI #41139471545](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41139471545)全成功**、元14m道路7描画マスク×4時刻28枚、CONTROL28m対照8枚、原36 PNG/36 SHA・同Native座標・28 B51保持、負の改竄4件拒否。原GitHub Artifact #13018741656（SHA256 `4b563546766b86c6198a211c337b89bf1577b38f9923d859a813b9760a9854aa`、2026-11-06失効）。
- A2真画像差：3.004秒W9巨大長壁の寄与29.677%、4.404秒G5B18.416%＋Mega13.749%、5.204秒B51装飾架台13.396%、8.004秒は都市が希薄。Epic今回同カメラ4時刻0%。画素差は遮蔽や美術の点数ではない。長壁と二重装飾をREMOVEしても、road-hazards-onlyでは建築的な都市が消えるためART REJECT。
- A2の詳細・A3ゲート [docs/R19_A2_NATIVE_SOURCE_36_PNG_VERDICT_AND_R19_A3_ONE_CITY_GATE_JA.md](R19_A2_NATIVE_SOURCE_36_PNG_VERDICT_AND_R19_A3_ONE_CITY_GATE_JA.md)。

## 今回R19 A3
- **一つの都市案だけ**：`scripts/p101-r19a3-one-integrated-civic-basilica-source.mjs`、RIFT CIVIC BASILICA。元road0 u=.53実座標の外側に、真に空いた大公共アトリウムを持つ曲線状都市主役1、非衝突の4公共プログラム、32箇所の開放ベイ、側方約54mのソース幾何的クリアランス下限。研究3D初期形状であって正式美術合格ではない。
- `scripts/p101-r19a3-private-original-one-city-pack.mjs` はA1真正元カメラ＋A2元建築除去のPRIVATEのみ新都市を追加する。元B48物理、元B51を減らさず、コライダー0。
- `tests/p101-r19a3-one-civic-city-real-14m.test.mjs`、元14m/28m×新都市OFF/ON各4native ticks=16 PNGの専用CI `scripts/p101-r19a3-four-native-source-city-sessions.mjs`、原個別SHAと座標一致独立検査を実装。[CI #41140541323](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41140541323)の実結果を再確認。初回#41140446842はPRIVATEキャプチャJSの末尾余分な引用符によるSyntaxError（ゲーム元コード破損ではない）。修正済み。
- 真正元画像を直接観察するまではR19 A3 SOURCE TECH PASS / ART PASSと宣言してはいけない。実走行14mのB51可視性・人間操作・Windows GPU性能は継続HOLD。旧R18 P4の美術案を再利用しない。

## 次の完成ゲート
A3真正CI成功なら元16画面で真正都市主役が接近→コア→退出に読めるか・空洞/都市機能が見えるか・前方B51が見えるかを厳格に判断。質が足りなければART REJECT。建築案増殖ではなく、一案の構図・素材・空間接続を改善する。初期からWindows短い実機プレイ（14m vs 28m）・FPS・実障害物視認を別HOLDとして実施。正式認定0mのまま保持。
