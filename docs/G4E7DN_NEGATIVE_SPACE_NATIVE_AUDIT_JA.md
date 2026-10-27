# G4E-7DN 最終真正WebGL 30枚、陰性アブレーション検証 — **ART REJECT**

2026-10-27 JST。QUALITY-FIRST / INTEGRATED VERTICAL SLICE。

## 実装と証拠

- 実装コミット：4461a31889a3e0e8e0c900f59c9531c18e1781fa。PRIVATEだけの UNROOF / REVEAL 2モデル。**0新建築、0追加三角形**。
- 初回CI #40436070653 はレンダ・単体テストPASSも、workflowの `path` のみ誤りArtifactは**欠落**した。これはユーザーに証拠を提出できない運用上の失敗でありSUCCESSだけを美術根拠にしない。
- 専用証拠保存パス修正：536913370da7c85e6c0362978872db862ffffd86。再実行[CI #40436641309](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40436641309) **SUCCESS**。 [Artifact #12703663917](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40436641309/artifacts/12703663917) には実WebGL PNG30枚 + `G4E7DN_REAL_GAME_20_PAIRS_ART_HOLD.json`。ZIP本体を取得して展開・30PNG＋監査JSON・全20比較・strictCXDJHashSuccess=trueを確認した。
- [独立物理CI #40436070565](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40436070565) B5/A13ともSUCCESS。
- 正規240Hz２道路×5時点：15.0/15.5/16.0/16.5/17.0秒。CX/UNROOF/REVEALの各同一カメラ・時刻・速度を比較。CX元DJ PNG10/10 SHA-256 **完全一致**。前DMのt1600で見られた微小画素揺らぎは今回再発していない。無断の許容値変更なし。

## CX比、実WebGL差分率（RGB画素差和>48）

| 形式 | 15.0 | 15.5 | 16.0 | 16.5 | 17.0 |
|---|---:|---:|---:|---:|---:|
| true-pinch UNROOF | 0% | 0% | 0% | 0% | 0% |
| true-pinch REVEAL | 0.0814% | 0.1115% | 0.2073% | 0.5343% | 2.0718% |
| pinch-switch UNROOF | 0% | 0% | 0% | 0% | 0% |
| pinch-switch REVEAL | 0.0912% | 0.1378% | 0.2593% | 0.7695% | 1.8742% |

**UNROOF**：両道路すべての正規カメラで元画面がバイト単位で一致。CXの「distant-folded-roofline」を取り去っても現時点の表示には影響せず、このソースが15.5〜16.5秒の断絶の主要原因である仮説は否定的。レンダに写らない理由（視錐外/深度遮蔽等）までは確定しない。

**REVEAL**：近景左の公共歩道１ソースを削除すると、とくに16.5〜17秒で道路脇の一部の建築面・公共構造が画面から消えた。しかし人が利用する大きな内部空間や次都市核と旧主役の機能的接続は生成されない。むしろ交通要素の撤去である。ソースを消すことで改善する仮説は成立しない。

## 実画像目視判定 — ART REJECT

両道路の5時点×3条件の真正PNGを横並びに確認。15→16秒の左クレセント退場と前方小都市の断絶は残り、追加大規模街区が無い問題に対して透明化/撤去を繰り返しても逆効果。UNROOFは見た目が同じ。REVEALも都市全景の輪郭や生活/内部、将来感に有意な美術進歩なし。**DNアブレーション2種を美術候補としてREJECT、正式採用0件**。継続改善の出発点は別の巨大塊追加ではなく、都市全景を一本化する設計資産/形状制作フローである。

## 未測定のことと次DO

フレーム静止画像30枚と差分は、GPUの処理時間/FPS、人工的衝突体験、人間反応時間、障害物予兆を認定しない。GPUモデル深度/ピック情報そのものは測定しておらず、被遮蔽の原因特定は未達。技術成功と美術成功は絶対に混同しない。

次DOで行うべきは、完成都市全体の共通モチーフ/交通マスター動線/複数の内部公共空間を実際の3D世界として設計し、真正の15.0〜17.0秒カメラから主役・街区・都市核が読めるアートディレクションの成立を先に検証すること。既存BKの限定GLBパイプライン、Blender等を使う場合も導入だけを成果にしない。共有のレンダラや物理を変更する前に、PRIVATEアセットで正規走行中の景観が美しいと示す。

PR #46 OPEN/Draft未マージ。CXジェネレータ blob `af076d67492a677d2235e4730aef8cdf4808e106`、B48×7/動体28/gap52/240Hz/ボール相対カメラ等不変更。ART/HUMAN/READY/PUBLISH/MERGE HOLD。公式Slope2認定0m。

---

# G4E-7DN PRIVATE negative-space audit / 未採用都市の構図原因を切り分ける

2026-10-27 JST。QUALITY-FIRST / INTEGRATED VERTICAL SLICE。

DA–DMは壁・棒・板・棚・楔・箱・独立輪の繰り返し。DNは建築数を増やさず、元CX景観の可視前後関係を研究する。PRIVATE ONLY。

UNROOFは元CXのdistant-folded-rooflineだけを削除。REVEALはさらにstation2左岸 roadbank-promenade を１個削除。両者とも元の主役クレセント２基は元三角形のバイト列を維持し、元実道路７、動体28、gap52、240Hz物理、元カメラ・操作・通常ビルド・main/Gold/本番非変更。視覚的な公共路を取り去る案は完成都市の提案ではなく、**遮蔽診断**である。

検証は2道路×15/15.5/16/16.5/17秒×3モード(CX,UNROOF,REVEAL)＝30枚真正元ゲームWebGL PNG、20組の比較と元DJ CX SHA-256照合。前DMの2画素RGB±1による厳格SHA失敗を受け、DNはもし基準SHAが異なっても証拠30枚と不一致JSONを収集後CIをFAILにする。**基準を緩めず診断範囲だけを改善**。画素差は品質スコアではない。

ART/HUMAN/READY/PUBLISH/MERGE HOLD、正式採用0件、正式Slope2認定0m、Draft PR #46未マージ。真正画角を目視し、都市連続性/奥行きの改善が認識できなければ即不採用。単なる閑散・撤去・視界の空白は成功ではない。
