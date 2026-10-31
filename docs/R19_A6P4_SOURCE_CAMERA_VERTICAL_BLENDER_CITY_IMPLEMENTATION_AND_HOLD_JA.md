# R19 A6 P4 — 元カメラ誘導型・実Blender縦型都市の制作実装と判定保留

2026-10-31 JST／研究ブランチのみ。PR #46 Draft。**制作コードは保存済み、Blender・GLB・元WebGL2実画像の専用CIはランナー割り当て待ち。ART認定0件。**

## 基準・入力

元ソースGitBlob af076d67492a677d2235e4730aef8cdf4808e106、真正B48道路7/B51動体28/240Hz球物理/RAW camera/HUD不変。旧R19 A1の本物のWebGL2カメラ14m/28m×6 native ticksと、P2で本物のB48道路0/1各81断面から取得した元道路中心・路肩・方向を使用。P3の真正28OBB計測CIは未完走であり、ここでは危険なB51の画素遮蔽や人間の視認性を確認したと主張しない。

## 実装（単なる座標計画ではなく、Blender制作ソース）

- [実Blender造形コード](../scripts/p101-r19a6p4-blender-vertical-open-atrium-city.py)：元A5の5独立メッシュをBlenderで読み込み、旧P2水平リボンとは異なる**立体的に分離したペタル型の縦型都市**に直接置換する。17の異なる建築コア・実際に穴の開いた中央吹き抜け・段状のテラス・彫塑された基礎・短い地区内デッキ。Road1の西方共同都市核u=.375、東方図書館地区u=.46、遠景共同区画u=.70、Road0の両外側地区u=.40/.73。真Blenderの編集可能BLENDとGLBを14m/28m別に出力する設計。
- [元ゲームへの非衝突PRIVATE接続](../scripts/p101-r19a6p4-private-source-game-real-blender-pack.mjs)：実Blender出力GLBの元SHA・indexed/TRS/COLOR0頂点を独立検査し、元ゲームWebGL2へ投入。既存P2や本番とは別のフォルダに限定。
- [元240Hzカメラ12画面QA](../scripts/p101-r19a6p4-12-original-native-camera-art-qa.mjs)：ULTRA14mとCONTROL28m×6 tick（265/721/1057/1249/1921/2761）の元WebGL2カメラ、A0物理XYZ/速度・道路IDと照合。本物の画面画像12枚。画素SHAが違うことだけでARTを認定しない。
- [専用CI](../.github/workflows/p101-r19a6p4-camera-guided-true-blender-city.yml)：Ubuntu Blender実行→BLEND/GLB出力→独立GLB読込→元WebGL2/12枚→厳格保存。実行が完了するまで未成功扱い。

## P4美術方針と注意事項

過去の巨大門、孤立箱、巨大な横リボンと空中柱、P2の上部を覆う長い高架の反復に**戻らない**。縦型建築同士が都市としてつながって見えるか、中央の空洞が明確か、Road0のB51が認識可能か、Road1の8秒/11.5秒で遠近感・形状の主役を獲得できるかを、実画像で批判的に検査する。実制作スクリプトを追加しただけでは「美しい」と認定しない。

参考カメラ矩形は疎なサンプル頂点の投影のみで、真のシルエットの**保守的上限ではない**。実B51の画素遮蔽、道路との完全3Dクリアランス、地盤接地、内部歩行の連結、個別建築の公共利用、PBR表示、RTX/iPhone性能、人間プレイは**未確認**。

次はCI完走後、真正12画像を視認しP2と同じカメラで厳しく比較。ART REJECTなら本当にBlender形状を直接2回以上改修する。最終的な人間プレイ認定・正式Slope2 DNA認定・本番公開・PRマージはHOLD。

## 正しい現状態

P4ソース実装・専用CI作成済み。P4技術未認定、ART REJECT継続。公式ART採用0件、Slope2 DNA正式認定0/2912m。PR #46はOPEN/Draft未マージ。main/Gold/P100/W9-X/B5/本番無変更。
