# K4CE — 同CHASE右端フェリーの実3D再配置・岸壁動線の再接続（2026-11-05）

**研究のみ。正式ART採用0件、Slope2 DNA認定0m。TECH PASS、ART PASS、人間プレイPASSはそれぞれ独立。**

## 既存の成功から継承した根拠

K4CDには同じK4CC親から分岐した独立2研究枝があり、製作の重複を防ぐため**真正Blender成功済み**`research/k4cd-harbor-water-ferry-true-chase-20261105`のHEAD `ee911286f133c534eabda3fa1c92c332b891631d`を継承。別研究`research/k4cd-real-ferry-waterfront-hero-20261105`の`#41929801390`は確認時点でインストール中／未確定であり、成功扱いにしない。

最終成功 [**Actions #41926752717**](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41926752717) は全ステップSUCCESS。原本[Artifact #13369741975](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41926752717/artifacts/13369741975)、ZIP123,796,338 B／SHA256 `3b7b3c72a2d47fc355f375cf19dc98f40b3f8e1b461a9c6233c61db63e32efce`、全CRC独立照合済。可編集Blender原本`K4CD_TRUE_MARITIME_HARBOR_FERRY_EDITABLE_NATIVE_ART_HOLD.blend` 273,958,272 B／SHA256 `c81111664d4703ec044aeaaeee1e7b659d95343dbf762ebf9892c6636a7d5a0a`。元CHASE 768×480では船だけの実可視画素数2,816を確認。ただし船の画面右端の切断、港の模型感、灰色道路の過大占有から **ART REJECT**。

## 実装した作者工程

新研究ブランチ`research/k4ce-coherent-berth-ferry-foreground-20261105`へ、新規コード`scripts/p101-k4ce-native-source-locked-berth-recomposition.py`と真Blender Workflow `.github/workflows/p101-k4ce-native-berth-foreground-art.yml`を保存した。

- 元船を再モデリングして数を増やすのではなく、K4CD成功原本の真の船体・甲板・船室・曲面屋根の**4編集可能メッシュ形状を保持して、物理的に一体の世界座標剛体移動**。同じCHASEに投影して右端の切断を解消し、画面内に船全体が入る候補だけ許す。道路正面を侵食する位置・遠すぎる岸壁接続は安全停止。
- K4CDの水面と全オリジナル景観は不変更。旧研究用の長い乗船橋は非表示にして編集可能なまま残し、**既存A3の本物の乗船スロープ終端と再配置フェリーのデッキを直接結ぶ1本の実厚み付き接続橋**を可編集3Dで製作。カメラを動かして船が大きく見えるふりをしない。
- 保存前・後で元Game Blob `af076d67492a677d2235e4730aef8cdf4808e106`、元Road5全vertex-face SHA256 `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2`、6 SOURCE CAMERA＋研究CHASE、木11本・照明、K4BZ不正重複Roadの非表示、全親オブジェクトの旧姿勢・可視性を監査。変形許可は既存K4CD研究フェリー4メッシュの姿勢だけ、非表示変更は旧K4CD研究乗船橋だけ。新ゲームCollider 0。
- **K4CD旧原本→K4CE作者DCC→同カメラ真Blender「船なし／船あり」A/B→原K4CDとの真正PNG比較→原道路色・K4BZ黒筋6対・左岩肌の独立ピクセル回帰→署名SHA/監査JSON→研究枝GitHub証拠保存**の一連を単一Actions Workflowに実装。

## 現時点の厳密なステータス

[**K4CE Actions #41934329234**](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41934329234)を実行。**この記録時点では真正Blender導入中／結果未確定**。コードを保存できたことは実レンダリングの成功ではない。失敗すればジョブログで原因・具体的メッシュ・正規化投影を確認し、保護条件を緩めず修正する。成功後も画像を直接開いて初めてART REJECT/ART PASSを分離判定する。未合格の間は正式ART採用0件／Slope2 DNA0m。

## 不変の上位憲章

main、`p101-velocity-overdrive-native-trial`、Draft PR#46、原Slopeと凍結Gold、本番2サイト、ゲームの道路・物理・カメラは完全保護。Work/Computer Useは個別事前承認制。追加有料API原則0円。正式HUMAN/ART/SAT/CCD/FPS/RELEASE/MERGE全HOLD。品質を上げない道具・小物・箱の量産やCI反復を目標化しない。
