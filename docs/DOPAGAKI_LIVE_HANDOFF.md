# DOPAGAKI SLOPE — LIVE HANDOFF (2026-10-30 JST, R18 P0)

**最新HEADは再開ごとにPR #46から再取得すること。** 旧長大チャットを読み込む必要なし。詳細は`PROJECT_STATE.md`および下記最新2資料を正本とする。

## 絶対固定
QUALITY-FIRST / GAMEPLAY-FIRST / ART-FIRST / INTEGRATED VERTICAL SLICE。元WebGL2 240Hz CCD、ボールr=.65m、元B48物理道路7／B51本物の動体28／合法P96-P94-A13／RAWカメラとHUDを保持。保護元ソース`web/p101-w9c2-g4e7ci-integrated-streetscape.mjs` Git blob `af076d67492a677d2235e4730aef8cdf4808e106`、main/Gold/P100/本番を変更せず、PR #46をOPEN/Draft/未マージで継続。透明床・強制吸着・自動操舵・テレポート・速度偽装・証拠捏造なし。source TECH≠美術・手動QA。正式ART採用0、Slope2認定0m。

## 事実上最新の開発状態
1. R17新A/Bの真正CI [#41062687304](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41062687304) SUCCESS。6条件36 PNG原本の個別SHA256一致、新A/B×2世界元Runner finish 4/4、偽認定10件拒否。元Artifact #12981741098（2026-11-06期限）。目視で両案とも**ART REJECT**：54〜58秒は遠景の小塊、64〜67秒は単純な箱・梁・大壁に急接近。B51遮蔽・人間操作性は未確認。全視覚レビューは[R17R1記録](G4E7DZ_R15S3D17R1_GENUINE_WEBGL2_ART_REJECT_AND_CAMERA_PREFLIGHT_JA.md)。
2. R17R1元カメラから真XYZ幾何の投影診断CI [#41067099727](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41067099727) **SUCCESS**。54秒で建築は前方約1.5〜1.6km、61秒約0.4〜0.5km、64秒約50〜80m。元カメラ画像の「遠くでは小さく、急に巨大壁」の印象と整合。三角形重心投影≠真の遮蔽や美術品質。
3. R18 P0本物の元RAWカメラ2世界×5時刻から都市配置候補を算出した[CI #41067613036](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41067613036) **SUCCESS**。66候補、54秒9／58秒8／61秒19／64秒23／67秒7候補。各時間帯の候補地と完全な理由は[R18 P0計画](G4E7DZ_R18P0_TRUE_CAMERA_SPATIAL_CITY_TIME_DESIGN_GATE_JA.md)。**R18の新3D建築はまだ未制作**、見える候補地点が美しい・物理的に安全だという認証ではない。
4. CI原本・元カメラと真正画像は保存済みだがGitHub Actions Artifactは7日後期限。会話で生成した証拠ZIPはローカル会話成果物。GitHub恒久保全は別途必要。

## 次の実制作：R18 P1
単なる新しい5個の箱を道路脇に配置しない。road5前半→後半→road6の**元カメラ時間軸で遠景の大公共都市→機能的接続→内部空洞と交通→抜け→次の景観**を1つの立体都市として本格制作。R17の箱壁/梁、D16の棚、D13の連続峡谷、視線遮蔽を繰り返さない。まず原道路法線とR15S3D15投影側方符号の一致を実確認。新R18はPRIVATEの非衝突3D、真正WebGL2 6セッション・同tick 54/58/61/64/67秒＋原finish・PNG SHA/独立ARTを必須としてユーザーWindows実GPU/HUMAN/HUD/B51回避を別にHOLD。正式採択・本番公開・マージは禁止。

## 再開時
最新HEAD/PR #46→本ファイル→`PROJECT_STATE.md`先頭→R18 P0→R17R1画像批評→必要な3D/CI原本の順で読む。巨大な会話全文や過去のREJECT全画像を毎回再読み込みしない。
