# K4CO｜真SOURCE固定の95m港湾連絡高架ランドマーク — 実制作コード・真正検証待ち

作成日：2026-11-05 JST。これは確定済みの方針の継続であり、新たな公式ART認定ではない。

## 継承した確定事実

- 前工程K4CN R2 [Actions #42003004167](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42003004167)は真正Blender TECH PASSだが、真CHASE直接観察で**ART REJECT**。左の鋭角な山塊、右の板と骨組みの港、直線道路が画面を支配する現構図を小調整する方法は打ち切る。
- 親は真正K4CN R2 [Artifact #13403680959](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42003004167/artifacts/13403680959)の編集可能BlenderをSH256 `f66531d8596e67a19f4c6f2debcf2521efbae54d9fc5ac911f94963dd6a45156`で固定。親データ本体は改変・上書き禁止。
- K4CM R3は真正TECH PASS/ART REJECT。K4CN R2はTECH PASS/ART REJECT。**正式ART採用0件・Slope2 DNA認定0m**、HUMAN/SAT/CCD/FPS/RELEASE/MERGE全HOLDを継続。

## 今回実装した単一の大規模3D作者変更

研究枝：`research/k4co-source-locked-freight-viaduct-landmark-20261105`。

- コード：`scripts/p101-k4co-native-freight-viaduct-landmark.py`
- 研究CI：`.github/workflows/p101-k4co-native-freight-viaduct-landmark-art.yml`
- 父の左198m断層岩盤・右港湾土木を原形状で保持し、**約95mの道路横断貨物高架**を新規編集可能な1研究Meshとして造形。左右の橋脚は研究親の実岩・実港の頂点座標から近接アンカーを選択し、既存Road5の真の高さを読み取って道路上に25m以上のモデル上の空間的余裕を設ける。
- 走行方向の遠景に意味ある港湾インフラのランドマークを成立させる狙い。単なる小物、抽象ドーム、スクリーン用絵・偽Game Cameraではない。ただし**真の画像で効果を確認するまではART UNJUDGED/HOLD**。
- 橋の上面・鋼製上部アーチ・ハンガー・地盤支持橋脚はひとつの3D施工研究対象で、港湾の作業連絡という目的を持つ。**ゲームへのCollider追加0**。この研究物体がゲーム内で走行可能・実際に使用可能であるとは宣言しない。

## 独立試験と停止条件

1. GitHubで親Artifact全ファイルbytes/SHAを独立確認し、元Game git blob `af076d67492a677d2235e4730aef8cdf4808e106`、Road5全頂点面SHA `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`を固定。
2. 真正Blender4.0.2で非破壊の1可編集研究Meshを制作し、`K4CO_TRUE_SOURCE_LOCKED_FREIGHT_VIADUCT_EDITABLE_ART_HOLD.blend`と元CHASE 768×480 `K4CO_TRUE_SOURCE_CHASE_FREIGHT_VIADUCT_NOT_GAME.png`を別名保存。
3. 元6Camera/CHASE、元11本の木、全ライト、継承全Meshの頂点と面/Transform、SOURCE ROAD5/元物理/元Gameを完全保持。橋の実高度、左右の実地盤近接アンカーを検証。真正比較は遠景ランドマーク・道路中央それぞれ別領域で確認する。保護試験の閾値を下げてPASSにしない。
4. TECH成功が実証できた場合も元画像と真正K4CO画像を**直接開いてART判断**。編集可能.blendとPNGの実Artifactの独立全CRC/SHA検証はまだ未実施。実WebGL2・240Hz人間プレイ・FPS/HUMAN/CCD/SATは別ゲートでHOLD。
5. もし真正CI FAIL、画像差が不足、またはART REJECTなら正式採用しない。小さな橋材やQAを反復せず、ゲーム体験と全画面構図の根本障害として再評価する。

## 現在の実行状況

新研究ブランチへの作者コード・Actionsワークフローの**GitHub保存は完了**。GitHubの実Actions最終run番号・完了/成功・実.blend・PNG・ART・実ZIP CRCは**未確認**。**TECH PASSとは言わない**。作品完成・正式採用・実プレイの認定を禁止。

main、公式P101、Draft PR#46、原Slope、Gold、元SOURCE、元Road5、240Hz物理・Camera、本番2サイトは変更禁止。Work/Computer Use・追加課金・正式採用・merge・本番公開は事前承認。ユーザー操作最小。
