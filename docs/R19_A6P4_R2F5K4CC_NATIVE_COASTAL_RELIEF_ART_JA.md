# K4CC — 元ゲーム保護の真正地形彫刻・右港遮蔽解除・実画像のART判定

記録基準：2026-11-05 JST。**正式ART採用0件／Slope2 DNA認定0m。TECHとART/HUMANを混同禁止。** 元のゲーム・物理・道路・カメラ・原作Slope・main・公式P101・Draft PR #46・本番2サイトを保護。Work/Computer Useは個別事前承認、追加有料API0円、ユーザーWindows操作不要。

## A3から継承した制作判断

研究専用ブランチ `research/k4cc-coastal-relief-fullframe-art-20261105`。K4CB A3 `8fa5a3d01de1972691d3ac46493507679fc4d8d2`から分岐。前A3は真正画像TECH PASSだが右港の大きなベージュ壁が空間を隠し、左斜面・遠景・幅広い道路が未完成で**ART REJECT**。小さな模型を量産するのではなく、同じCHASEカメラの画面全体を作者制作対象とする。

固定親はK4CB A3実編集可能Blender `K4CB_A3_INTEGRATED_QUAY_ARRIVAL_EDITABLE_NATIVE_ART_HOLD.blend` SHA256 `0b581f45de4d4e215515e8dbef9a4038c7f1b9bdb0e1935943c4445529193e6c`。A3真Artifact #13365996340をCIで厳密ハッシュ認証したもののみ使用。原ゲームgit blob `af076d67492a677d2235e4730aef8cdf4808e106`、元Road5全頂点面SHA256 `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、元6 Camera、CHASE、木11本、全光源、K4BZ不良研究道路hide_renderを不変にする。

## 実装と初回真正Blender

- `scripts/p101-k4cc-source-locked-coastal-relief-fullframe.py`：元研究用K4BQ左斜面をCHASEの実ピクセルからレイキャスト同定（10個の対象レイのうち9個で同じ既存斜面）。元実メッシュ1564頂点を保持し、研究用複製を**13,426頂点に真正細分化**、5,587頂点を最大4.452mの非平坦な3D岩層へ変形。写真と偽称しない作者Blenderプロシージャル地質マテリアルを使用。
- A3の作者研究用の不適切な大壁・頭梁・柱脚5個だけを、旧オブジェクトデータを保持したまま研究画像の表示から除く。元道路面の上塗り、ソースゲームのCollider追加、元Camera値の変更なし。
- **初回[真正Blender GitHub Actions #41921803434](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41921803434) completed/SUCCESS**。実Blender 4.0.2 EEVEE 768×480同CHASE、元ソース・先祖Blender SHA・道路指紋・過去6黒筋の再発防止、native画像差の独立QA、研究証拠pushまで確認。[真正Artifact #13366199801](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41921803434/artifacts/13366199801)。
- 初回ZIP 123,306,829 B、SHA256 `7ad3616db225c4dbbeac619dc3951e48d3c8f2fbde2a35fb92a69895d0733645`を**GitHubから別途再ダウンロードして実測検算**、ZIP全CRC PASS。編集可能Blender原本273,477,600 B／SHA256 `19e9169cf4568f973ac4f178e8bbcdf3d05fa88edd3a4c83da07d921c3563a08`、真正画像SHA256 `efed6b1052536e6c596f23ca1c0f8e6692787a71fa53ac195c7e298483f5f861`、原本と画像の実ZIP内ハッシュ再照合PASS。
- [K4CB A3→K4CCの真正Blender同CHASE比較](research-evidence/k4cc/K4CC_A3_VS_TRUE_COASTAL_RELIEF_ART_REVIEW_NOT_GAME.png)を**直接開いて評価**。左斜面で40,482画素、右港で4,437画素が変化。これらは画面変化・TECHの証拠でありART点数ではない。画像中央の道路色の指定5ピクセル、元黒筋6対は不変。

## 初回画像の美術結果と現修正版

**初回ART REJECT。** 左側は3D起伏が出たが地形がやや人工的な砂丘・波紋状で、既存の岩棚の薄茶色が接続部から露出する三角形の継ぎ目が生じた。右港は壁の減少で奥が見えるが、用途・船・水面・深い影・人間の規模がまだ十分には読めず、広大な灰色道路と背景地平線も未解決。**技術全PASSでも有料ゲーム水準のART採用ではない**。

この実画像の欠点を受け、初回の研究Blender原本を不変の証拠として残し、`K4CC`作者スクリプトを局所修正：左斜面の旧実メッシュを削除・隠蔽せず元の場所で描画下地として残し、新研究立体を上方に0.055m離して重ねるよう改めた。これは**原本地形を保持し、相互貫通による下地の露出を防ぐための真正DCC修正**であり、元物理路面の変更や視認性ガードの緩和ではない。対応するWorkflow QAは旧斜面が表示されたまま・非表示変更が研究A3壁5個だけであると確認する仕様へ更新。

この修正の最新Actionsは [#41922703441](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41922703441)。**この文書の作成時点では最終結果と新画像ART評価が未確定**。最新のGitHub Actions／Artifactを実際に照合するまでは、修正版のTECH PASS・継ぎ目修復・ART PASSを断定禁止。前実行 #41922678765 は修正によるCANCELLEDで、成功ではない。以降は追加モデル大量生成をしない。

## 次の制作基準

- 完全同一のCHASE研究カメラでA3、K4CC初回、K4CC修正版の真PNGを直接比べる。道路の元SOURCEと写真風DCC・WebGL2ゲーム画像を混同しない。
- 茶色い露出が残る場合は画像で根拠を確認し無駄な量産や別Cameraすり替えを禁止。ARTが不合格なら同じゲートを保持。
- **最高優先の未解決は画面全体の作者景観**：世界スケール、岩肌と路側地面の一体感、港湾建物の用途と生活感、海面、構図と速度感。研究１区間が合格しないまま他６Roadに展開しない。HUMAN/SAT/CCD/FPS/RELEASE/MERGEはすべてHOLD。
