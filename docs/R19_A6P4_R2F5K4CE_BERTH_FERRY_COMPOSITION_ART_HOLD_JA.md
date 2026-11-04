# 【2026-11-05 K4CE最終監査：真正Blender再構図 TECH PASS／直接ART REJECT】

**最終結論**：K4CE元カメラ同一CHASE Blender研究作品は**SOURCE・DCC・RENDER・独立PNG/SHA TECH PASS**、画像を直接開いた全画面**ART REJECT**。正式ART採用0件／Slope2 DNA認定0m／WebGL2、HUMAN、SAT、CCD、FPS、RELEASE、MERGEすべてHOLD。下段「実行中」は当時の履歴。

## 初回失敗と設計修正を実験事実に基づいて記録

- 初回[Actions #41934329234](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41934329234)は**completed/FAILURE**。Blender4.0.2による親K4CD再読込、4船体パーツ移動、厚み付き新乗船橋、可編集.blend別名保存、本物の元CHASE 768×480 PNG二枚までは完走。しかし機械独立画像QAは`ACTUAL_FULLY_FRAMED_FERRY_INVISIBLE`（船あり／なし差 **262px**）でSTOP。元の船は画面内へ収まっても港の建物の奥に隠れる。2D投影位置の良さと実可視性を混同したことが明確な失敗原因。親原本・ROAD5・Camera・ゲーム変更なし。初回Artifact #13373745973 のZIPも独立DL、ZIP全CRCとBlender画像各SHA256はPASSだが、**初回TECH PASSにはしない**。
- 続く修正コミット`3377283bffc9bdf070077e2d237c4608ebacbef3`で**実Blender Scene.ray_castを複数の現実世界係留候補へ適用**、建物に隠れず実際に見えるフェリー形状の候補を計測し、元Road5を遮る位置は引き続き除外。形状やCameraを改竄せず、真正3Dの船と橋を選び直す実装へ改修。
- [**最終Actions #41935099728**](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41935099728) **completed/SUCCESS、全11ステップSUCCESS**。親元GameとRoad5・6Camera/CHASE・木11・照明、旧フェリーメッシュ形状、海面を凍結した上で、K4CD研究船4メッシュを`along=-6m, side=13m`だけ世界空間移動。真正接続橋の世界長約28.612m。実レイ判定54候補のうち選択案で船体表面の11/69サンプルが実可視。もとの船全BBox `x=.8074〜1.0293`（画面切れ）→K4CE `x=.7295〜.9383`。これは3Dフレーミング数値でART品質点ではない。
- 真正Blender内で**船なし／船ありPNG 768×480の独立2枚**を生成。船＋新橋の画面内差が**4,528px**（前K4CDは船のみ2,816px、単純な絶対比較には橋の新規寄与と画面位置の違いがあるため注意）。親K4CDとの右港画像差6,933px、左地形差0、Road5指定5画素と既知黒筋6対は不変。全ファイルSHA、元Game Git blob `af076d67492a677d2235e4730aef8cdf4808e106`、Road5全頂点・面SHA `f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2` PASS。元ゲーム・コライダー・本番・物理・カメラに変更0。

## 独立Artifact ZIP再取得と実バイト照合

[**最終真正Artifact #13374375359**](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41935099728/artifacts/13374375359) ZIP123,802,865 bytes／SHA256 `d8e57ca4af3b3de9c6ceb7830ff85d66a7b0dde8a9c24360cf6eb9d7c8cf989a`。別途GitHub実バイトでダウンロードし**全ZIP CRC PASS、監査JSON内.blend/PNG個別bytesとSHA256がすべて一致**。

- 真可編集原本 `K4CE_REAL_COHERENT_FOREGROUND_FERRY_EDITABLE_ART_HOLD.blend`：273,964,752 bytes／SHA256 `3f0bc2f048dec39bc263151e2117b374d40b7422478c7e9b49583865c836d63e`。
- [真CHASE船あり画像](research-evidence/k4ce/K4CE_REAL_FERRY_CONNECTED_TO_QUAY_CHASE_NOT_GAME.png)：SHA256 `0519dfb082d83a46244e182aa6aca7329ec68c0b559203efe1919302a5f13bef`。
- 船なし実Control：SHA256 `52734442bc47f557c1d28abb3bdc25b99cf78b0a0d9c55c58994504c496f2a68`。
- [K4CDとK4CE同一CHASE A/B真正比較](research-evidence/k4ce/K4CE_K4CD_TRUE_SAME_CHASE_FOREGROUND_BERTH_ART_REVIEW_NOT_GAME.png)：SHA256 `b551a1b7e448fcb19094be0ba80b1bad0740ac8833ae45a9aab4fe49546730b2`。原本Blenderの別GUI独立再読込・WebGL2ゲーム実走・人間プレイは**未実施／未認定**。

## 画像を直接開いた独立美術ART判定

比較PNGと船ありPNGを画像として直接開き確認。右港のフェリーはフレーム内に収まり、船殻・屋根のシルエットが前K4CDより読み取れるのは確か。ただし、**港の縮尺に比べて船が小さく、主役が建物の奥で弱い**。右側の建築は低密度の模型感、船着き場と水面の生活感／材質解像度・実在感も不足。道路は画面の大半を占めて平坦、左岩肌は改善が乏しく、遠景に奥行き／速度／ワールドスケールを感じられない。したがって正式ART REJECT。TECH PASS／4,528画素差をART合格と混同しない。

## 次の作者工程を固定（基盤QA増殖をしない）

小型フェリーや箱、屋根、樹木、波の追加量産は繰り返さず、**1枚の真CHASEで全景の美術構図を変える**ことを最優先。港の水際・岸壁・実建築の用途・岩肌・地平線との連続した断面を高品質に再作家設計する。道路／カメラ／ゲームの原本は禁止、サンプル領域・物理は絶対に変えない。偽画像／カメラすり替え／宣伝用ART PASSの先取り不可。正式美術0件／Slope2 DNA0mで保護研究を継続。追加有料API原則0円、Work/Computer Useは個別事前承認、ユーザー操作0。

---

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
