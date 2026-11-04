# K4CD — 本物の港湾海面／乗客フェリー作者研究・Blender実A/B・ART REJECT（2026-11-05）

**固定結論：SOURCE／DCC／真正CHASE TECH PASS。全画面ART REJECT。正式ART採用0件、Slope2 DNA認定0m。** 技術的合格は芸術採用、実WebGL2、FPS、人間プレイ、SAT/CCDを保証しない。研究ブランチ限定。

## 出発点と継承した反省

前K4CCの本物の編集可能3D原本SHA256は `4fcd20db998696c270df95f624fed1a229ae2703322c180de1f3bfbc15abd6da`。真正Blenderの岩肌は改善したが、右港の水辺の意味、フェリー乗船の用途、遠景と道路の過大な視覚占有が読めずART REJECT。単なる箱／金属屋根／波形岩肌の増殖をやめ、**本当に見えるひとつの船と連続した海面**で港の機能・地形との関係を画面に与える研究を実装する。研究用スクリプト `scripts/p101-k4cd-source-locked-real-ferry-basin.py`、Workflow `.github/workflows/p101-k4cd-native-ferry-basin-art.yml`を作成。研究枝は `research/k4cd-harbor-water-ferry-true-chase-20261105`。K4CC当時の凍結HEAD `ca42b57a9415a9ba55703f38412c412f1f80acb4`から分岐。

## 本物の3D実装・厳格な保護

親K4CCの真正Artifact [#13367744605](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41922703441/artifacts/13367744605)の.blendを**実バイトSHAで認証**した後、研究専用の新たな**6オブジェクト**を制作：本当の3D起伏付き連続海面、横断フレームと船首絞りのある船体、甲板、曲面ガラスの客室、厚い屋根、船側アクセスブリッジ。人工的な写真偽装や画像上だけの船ではなく、Blender内の編集可能メッシュ・材質で生成。これらに `DCC_RESEARCH_ONLY`／`NOT_GAME_COLLIDER` を明示し、ゲームへの取込・新規Colliderは0。

不変ガード：元Game Git blob `af076d67492a677d2235e4730aef8cdf4808e106`、Road5全頂点・面SHA256 `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、元6 Camera全姿勢＋研究CHASE、元木11本、元照明、K4BZの不正重複道路hide_render、K4CC左岩肌、元全オブジェクト表示を検証。元ゲーム・原本・道路・物理・元のBlender編集可能研究原本は変更しない。

## 実際のGitHub Actionsと原因修正

1. 初回 [#41925637297](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41925637297) **FAILURE／安全停止**。海面の3DがCHASE中央まで入り、可視投影最小X=0.0012で保護範囲X>0.475を破った。レンダリング前に停止。ガードを緩めず、実3Dのフェリーと水辺を正しい右港側へ移動。
2. 次 [#41926040646](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41926040646) **completed/SUCCESS／TECHのみ**。海面と船が描画されたが同CHASE直接画像では船が港の建築物にほぼ隠れた。比較画像の差2,999画素は主として水辺の変化であり、船の見え方の証明にはならなかった。画像直接判定 **ART REJECT**。
3. 船を右港の前景側へ配置し直し、真正Blenderで**海面のみ→船あり**の独立した同カメラ2回レンダーを追加。別画像の視差だけでなく船自体の実可視画素を計測する。中間 [#41926723134](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41926723134) は最終QA修正によりキャンセル扱い。
4. 最終 [#41926752717](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41926752717) **completed/SUCCESS、全ジョブステップSUCCESS**。実Blender 4.0.2 EEVEE 768×480の同一CHASEで編集可能.blend保存、海面のみの対照PNG、船ありPNG、同カメラK4CC比較PNG、独立QA/ゲーム原本保護/黒筋6対回帰/証拠の研究枝GitHub commit/Artifact保存完了。**海面だけとの差で実フェリーは2,816画素可視**（美術スコアではない）。左地形の画素差0、元Road5実画面の既知色サンプル不変。

## 独立ZIP実バイトの根拠

[真正Artifact #13369741975](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41926752717/artifacts/13369741975) ZIP **123,796,338 bytes／SHA256 `3b7b3c72a2d47fc355f375cf19dc98f40b3f8e1b461a9c6233c61db63e32efce`**。この会話内でGitHubから新たに取得し、ZIP全エントリCRC PASS。中の実バイトを再読込して以下の個別SHA256が監査記録に一致：

- K4CD_TRUE_MARITIME_HARBOR_FERRY_EDITABLE_NATIVE_ART_HOLD.blend：**273,958,272 bytes、SHA256 `c81111664d4703ec044aeaaeee1e7b659d95343dbf762ebf9892c6636a7d5a0a`**。
- [K4CD真正船ありCHASE画像](research-evidence/k4cd/K4CD_TRUE_SAME_CHASE_MARITIME_FERRY_NOT_GAME.png)：SHA256 `e74ebe0766fbb7a9169c6561e113549bddb395dca03958849e2ef9e335904069`。
- 水のみA/B対照PNG：SHA256 `65f5a1019039307a7e2888b1d58f70d7750428409cbab917ec4162e564ddb5c7`。
- [K4CCとK4CDの本当の同CHASE比較画像](research-evidence/k4cd/K4CD_K4CC_VS_TRUE_HARBOR_FERRY_SAME_CHASE_ART_REVIEW_NOT_GAME.png)：SHA256 `1534be8c800d8b2d03834774216076c9a5b62e5ad73bfa8924d3866bfd5f12b7`。
- [全監査JSON](research-evidence/k4cd/K4CD_REAL_NATIVE_AUDIT.json)。Blender独立GUI再読込・実WebGL2動作・人間プレイはこの工程で未実施。真正Blender実行の証拠はActionsレンダーログ、編集可能原本、PNG実バイトに限定する。

## 本当の同一CHASE画像を直接開いたART結果

**TECH PASS／ART REJECT。** 正しい港側へ寄せたことでフェリーが右端にはっきり出たことは確認できる。しかし、**船が画面右端で切れてしまい港の主役にならず**、海面は極めて小さな水平帯程度。中央の広大な灰色道路が画面を占め、左の岩肌と遠景は単純で、港湾全体はいまだ箱と金属シェルの模型に見える。船が2,816画素描かれた事実は人が船と認識できる世界水準美術の根拠にならない。正式ART採用0件、Slope2 DNA認定0m、SAT/CCD/FPS/HUMAN/RELEASE/MERGE HOLD。

## 次工程の固定方針

これ以上、背景に小さい船・窓・箱・岩・屋根を増やすのを優先しない。**実CHASE画面で視認できる一つのシルエットと、人が理解できる岸壁／水面／ターミナルの連続断面を、DCC作者品質の目線で根本的に作り直すこと**。先に本画像における遮蔽、遠近、画角、右港とRoad5の接続を実測して設計を一本化する。Source Camera・Road5元物理は変えず、元ゲームに描画フェイクを合成せず、真正同CHASEの編集可能原本＋直接ART目視が合格しない限り正式取り込み禁止。

main、公式`p101-velocity-overdrive-native-trial`、Open/Draft PR #46、原作Slope／凍結Gold／本番2サイトを保護。Work・Computer Use個別事前承認。追加有料API0円。ユーザーWindows操作0。HUMAN/FPS/SAT/CCD/RELEASE/MERGE全HOLD。
