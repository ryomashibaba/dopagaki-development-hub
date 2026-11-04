# K4CB A2 — 真正港湾ターミナルの大型作者シルエット研究（結果未判定）

基準：2026-11-05 JST。既存 K4CB A1 の **ART REJECT** から継続する研究。元ゲームに採用しない。

## 今工程で実際に実装したもの

- 研究枝 `research/k4cb-a2-sculpted-ferry-terminal-chase-20261105` を K4CB A1 保存済みHEAD `b929a738899aac14f433c554b6b70cdba0047373` から分岐。main／正式P101／Draft PR #46を更新しない。
- `scripts/p101-k4cb-a2-sculpted-terminal-source-locked.py` を追加。最新K4CB A1 Actions #41859091126 の真正編集可能Blender原本の監査記録SHA256 `ea0cadc1db9dde9b01faac17d1cddc7b81c4d6c011eae2ea3c8bf68e90ec5b5d` を起点に、別名の研究用編集可能.blendとして保存する。**この値をA2 CI自身が実バイトで照合するまで親成功は再認定しない。**
- A1で小さく見えたアーチの量産をせず、既存の公共建築の屋根・柱・港の床高を真正Blender内で参照し、長さ約52mの非平面／二重曲率の屋根シェル、少数の実荷重柱、公共ガラス空間、連続コンコース、2か所の曲げ材を試験的に追加した。研究用 `NOT_GAME_COLLIDER=True`、実ゲームコライダー増設0。写真PBR・公式モデルと偽称しない。
- 真の既存CHASE／同光源・768×480／EEVEEでレンダーする専用Workflow `.github/workflows/p101-k4cb-a2-sculpted-terminal-native-art.yml` を保存。[Actions #41914127494](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41914127494) が初回実行。
- 保存前検証：元Game blob `af076d67492a677d2235e4730aef8cdf4808e106`、Road5指紋 `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、元6 Camera・CHASE、旧9本＋新2本の木、光源、既存全オブジェクト表示、K4BZで非表示にした問題の重複道路、元屋根・元柱に対する保護。
- レンダー後は真の編集可能.blendとPNGの独立SHA256・同カメラ画像差・黒筋既知6組を再確認し、研究枝証拠へ自動保存する。**画面領域変化・投影bbox・ソースSHAは美術の合格指標ではない。**

## 見た目の採否条件

右港湾が単に別の大きな箱・単調な屋根へ置き換わっているだけなら **ART REJECT**。港と建築用途が読み取れ、自然な地形と広大な道路を含めた全画面構図が有料ゲーム水準に至るか、本当の画像を直接開いて判断する。

既存の左地形と道路は今回無断変更しないため、右港が局所改善しても全画面ART PASSと認定しない。**正式ART採用0件、Slope2 DNA認定0m、SAT/CCD/FPS/HUMAN/RELEASE/MERGE HOLD。**

技術失敗はGitHub Actionsジョブログと証拠に従い停止・隔離修正する。結果が未確定の段階でレンダー成功、真Blender保存、目視合格、PR作成・merge・本番公開を主張しない。

Work/Computer Useを無断起動しない。追加の有料APIは使用しない。ユーザーWindows操作は不要。

## 初回CIの親SHA不一致・一次証拠による修正

初回[Actions #41914127494](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41914127494)は元ソースのプリフライト・A1真Artifactの取得・内部全ファイル個別SHA検査を通過し、**参照文書に記載されていたA1.blend SHA `9df956acf164d7a0f4d861585644e15f87faa5d85683f2e8ae79bb438c03333d` だけが保存された実A1 Artifactと異なる**ため安全停止。実A1 Artifactの真正監査JSONに記録された271,929,100 bytes の編集可能.blend SHA256 は **`ea0cadc1db9dde9b01faac17d1cddc7b81c4d6c011eae2ea3c8bf68e90ec5b5d`**、同ZIPから読んだ実バイトSHAと一致。したがって計測された実A1 Artifactを唯一の親として固定し直す。原本SHA比較を削除・緩和せず、実証SHAに変更。旧SHAの原本は本工程で使用しない。技術成功・美術合格を意味しない。
