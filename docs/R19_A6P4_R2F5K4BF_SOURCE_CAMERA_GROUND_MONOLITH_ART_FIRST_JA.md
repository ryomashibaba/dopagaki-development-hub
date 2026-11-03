# K4BF — source Cameraで見える前景道路・公共建築の実制作（2026-11-04）

## 決定済み条件を継承
親K4BE研究HEAD 8529b78fb04a30714137a5fb6cfd013f746726c9。K4BE SOURCE/DCC限定PASS、ART REJECT、正式美術採用0件、Slope2 DNA 0m。
元ゲーム凍結 Git blob af076d67492a677d2235e4730aef8cdf4808e106、7 B48、28 B51、元source6カメラ、240Hz、球半径0.65m、操作と安全表示を変更しない。
main、本番2サイト、元Slope、公式開発枝 p101-velocity-overdrive-native-trial、Draft PR #46を変更/公開/マージしない。Work事前承認、GitHub+Chat主体、ユーザー操作最小。

## 目視監査の事実
K4BEの実source control11307とultra11341画像を確認した。前景路面の暗い単調な巨大面積、中央の薄い屋根・細棒・透明な宙吊り箱、左右の用途不鮮明な簡易構造が根本問題。305オブジェクト・静的BVH成功は美術品質ではない。

## 実装内容
- scripts/p101-k4bf-source-camera-ground-and-monolith.py：K4BEの検証済み本物の編集可能Blender原本を読み込み。元Road5 source meshの頂点+面 fingerprintを前後照合、元sourceカメラは不変。
- 最も面積を占める前景Road5について、真のsource meshは変更せず、多階層鉱物PBR、微細凹凸と表面粗さの変動を制作。元非衝突路面inlayは保持し、まず一要因比較。
- K4BEの中央の旧ART REJECTコレクションは削除せずレンダー上だけ非表示。新規、非対称に積層する大断面の公共モノリス、2地盤に連続した支持、居室と開口を持つ公共空中回廊、庭園テラス、光の入る内部を作る。新しいゲーム道路・衝突体は0。
- 環境光と実日射を用いたコントラストを見直す。WebGL2ゲーム本体の描画やリリースはしない。
- まず真正sourceカメラ2枚のパイロットだけを実制作。画像評価不合格なら残り4sourceカメラを描画しない。

## CI・成果証拠（この文書時点では未完了）
Actions #41722243986: https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41722243986
Workflow: .github/workflows/p101-k4bf-two-source-camera-civic-monolith.yml
親artifactはCI #41659005101 / #13240733042。親.blendのSHA/元source/元カメラとゲームblobを再照合。Blender Cyclesで編集可能blend・真正2sourceカメラPNG・provenance SHA生成。Pillowで画像比較作成、成功時のみ研究ブランチ docs/research-evidence/k4bf/に画像とSHAを保存。
**PNGの存在、Pillowの正常画像、CI successはART PASSではない。** 真正source Camera画像をレビューし不十分ならART REJECTとする。

## 残された安全・品質ゲート
現在のK4BF結果は未確定。独立のK4BF新規造形対全7 B48と168 B51有限静的BVHも未実行。K4BEの過去の静的0接触をK4BFの合格として流用しない。半径0.65m安全距離、全B51時間、CCD/SAT、FPS、HUMAN、実ゲームWebGL2フレームも未検証。
ART UNJUDGED/HOLD、HUMAN/SAT/CCD/FPS/RELEASE/MERGEすべてHOLD。正式採用0件。ソースの制作成功と美術の完成は区別する。