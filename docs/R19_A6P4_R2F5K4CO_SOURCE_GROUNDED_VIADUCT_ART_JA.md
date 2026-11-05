## 2026-11-05 CI実測補足：旧コードrunはCANCELLEDであり、K4CO最終成功ではない

- [真正Actions #42008835265](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/42008835265)：GitHub APIの実ジョブ結果で`completed/cancelled`。元Gameチェック、Python構文、K4CN R2親Artifact取得と実SHA認証は成功。Blenderインストールでcancelled、実制作・画像独立QA・研究Artifactはスキップ。**TECH PASS/ART PASSとして数えない**。
- このrunの`workflowSourceCommit=425e5f30465fa96cb39502206b9374f7b8967bc8`。後続で真正Road5の9地点（3×3）標高ray検証、最小実道路クリアランス20m超を厳格化した別コミット`4ce63d5fa03e11d412f6d38cc70b78a4f48318c1`とその独立CI変更`bdf3efb394a2fd67b6c0a35a6cde0497ad76d8ce`が存在する。**旧runのキャンセルJSONを最新実装の検証結果に取り違えない**。
- 最新コードに対して独立Blenderの完走runと真正PNG・別取得ZIP全CRC/SHA・直接ART判定が必要であり、記録がない間はHOLD。

---

## 2026-11-05 K4CO接地実装と実行状態の自動保存（結果は未確認）

- 研究高架橋の橋脚について、当初は元地形の座標から高さのみを引用し、平面上の端点位置が真の地形頂点に一致していなかった。この構造矛盾を修正した。**計4本の支持バットレスをK4CN R2親岩盤・岸壁の真正頂点に下端接続**し、接続の位置と道路外側をコード上で確認する。元研究親の全頂点・行列は不変。修正したのはK4CO専用追加Meshのみ。
- 独立Workflowに `realSourceVertexAnchoredButtressCount==4` を追加。SOURCE保護・道路中央・画像品質閾値の緩和なし。
- 今後実CIの最終判定が得られれば `docs/research-evidence/k4co/K4CO_CI_LATEST.json` をActions内の最後の `if: always()` 段階で作成する。実run ID、実際の `job.status`、親SOURCE commit、独立native画像ゲートの完走証拠を格納し、後続チャットからGitHub上で取得する。GitHub原本ファイルを変更しない。**未生成／読み取り不能なら未確認のまま。成功と推定しない。**
- 本記録の段階では真正Blenderの実出力・GitHub Actionsの実run ID・実ZIP CRC/個別SHA・画像直接ART評価はなお未確認。したがって**TECH PASS / ART PASSのいずれも新規認定しない**。

---

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
