# G4E-7AO — 真の11m B48×移動B51-C「早期認識」研究（非公開HOLD）

作成：2026-10-24 JST。対象：`p101-velocity-overdrive-native-trial`、Draft PR #46。美術を増やす前に、ユーザー指摘の「狭い細道と本当の障害物を高速で楽しく避けられるか」を改善する小さな**実験機能**。人間QAなしで公平性や成功を宣言しない。

## 実装：現実の危険と無関係な飾りではなく、実B48実移動B51に紐付く視覚情報

- `web/p101-w9c2-g4e7ao-b51-approach.mjs`：既存G4E-7AJ reanchor（2/28のみ本物の移動位置を再配置・26基byte同等）で、真の細道1上の01 slider（u=.32）と02 rotor（u=.80）の**物理位置と最も近い実B48路肩**を特定。
- 警告地点は**危険物の手前150m、95m、45m**を `sample(road,u,.5)` の**実3次元中心線長**を320分割して遡って求める。コースの仮の全長や直線距離で距離を水増ししない。スタート以前に警告地点が存在しなければ無理に設置しない。
- マーカーは真のB48路肩から**13.5m外側**に設置する、細長いV字型の3D光フィン。近づくほど1→2→3段のパターンになり、横方向への自動誘導は一切行わない。障害物の未来位置・安全レーン・衝突可能性を予言する表示ではない。常に静的な実危険「存在場所」予告のみ。
- GPUの三角形だけ。**コライダー追加0、道路追加0、動体追加0、速度・ジャンプ・左右操舵・カメラ・接触判定変更0**。既存のB51-C動体全28基の本物の姿勢／色／当たり判定は従来通り。
- 有効化条件は **localhost + `?g4e7al=manual&g4e7ao=on`** だけ。未指定の7ALは従来版のまま。G4E-7AM・7ANとの同時有効化は禁止。原本Stage JSONとリリース用データには一切書かない。

## 技術検証

- `tests/p101-w9c2-g4e7ao-b51-approach.test.mjs`：両真の7AJ reanchor道路で元JSON完全不変、26/28配置保護、実路面中心線長を独立した720分割で再積分して予告距離を±2m以内で照合、元のB48路肩との一致、画角外／スタート前の偽地点なし、0m正式認定HOLD、非対応原本・生産昇格・偽穴拒否。
- `tests/browser/p101-w9c2-g4e7ao-b51-approach.spec.mjs`：デフォルトとAO候補の**実WebGLキャンバス**を、TRUE-PINCHと実A/Dで次へ進むPINCH-SWITCHで比較撮影。実動体28基、私設240Hz MANUAL Runner、コライダー追加なし、旧操作継続と表示属性を検査。撮影は人間QAではない。
- `.github/workflows/p101-w9c2-g4e7al-manual.yml`：既存7AL/AM/AN回帰にAOテストを追加、private/public-safe両ビルドの研究用ステージ非混入を確認し、実ChromiumスクリーンショットをActions artifactで保存。
- [専用CI #40068323822](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40068323822) は**全ステップSUCCESS**。形状とB48の実弧長独立再積分・7AL/AM/AN/7O回帰・実Chromium+人間ではないA/D・private build・public/public-safe未採用ステージ隔離・artifact保存までPASS。**技術成功＝美術・人間QA成功ではない**。
- アート系G4E-7AN R3は既存 [#40050904186](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40050904186) の全PASS・美術HOLDを維持。今回のAOは、巨大建築の評価とは独立した**走行の危険認識**実験。

## 完成と誤認させないこと

- **実人間の初見視認、公平な判断時間、障害物が邪魔／適切か、興奮する回避かは未検証**。光フィンの存在は面白い道路や迫力のある動体の証明にはならない。高速度206m/sなら150m予告も1秒未満で、これだけで危険の先読み問題を解決したとは主張できない。
- 次工程は実Chromium画像と目視審査、可能なら人間のゲームオーバー後JSONと短い感想から、不公平なライン取りや高速時の見逃し箇所を特定する。本当に面白くない、または妨害するならAOは棄却する。
- **人間QA・美術品質・正式Slope2 DNA認定0m・正式採用・Gold/main/両本番・PR Ready/merge/公開：すべてHOLD。**

## CI確定・実ブラウザ表示審査（2026-10-24 JST）

- [専用Actions #40068323822](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40068323822) **全ステップSUCCESS**。PNG証拠は [GitHub Actions artifact #12550317586](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40068323822/artifacts/12550317586) に保存。
- artifact中の実WebGLキャンバス928×540の **旧7AL TRUE-PINCH／AO TRUE-PINCH／AO PINCH-SWITCH** を直接確認。旧版では表示されていないV字型光マーカーが、AO両候補では路肩の左右（障害物01/02の物理位置から決定した側）に現れる。描画が有効になることと既存の実B48走行面・動体・HUDを覆わずに追加されることを確認。
- 既存のHUDにはすでに「先の動体番号・推定位置・距離／秒数」の通知がある。本変更は**最初の警告機能ではない**。道路空間内に、物理的な予告位置を置くことで位置とタイミングを把握しやすくすることが狙い。
- 実画面でのV字マーカーは**比較的小さい**。特にOVERDRIVE/HYPER高速200m/s級では150mの予告でも1秒未満となり、初見人間の反応猶予や「面白い回避」は確認できていない。画像表示は明らかに成功したが、美術完成、先読み公平性、遊びやすさについては**HOLD**。
- 技術採否は `TECHNICAL_PASS / VISUAL_PRESENT / HUMAN_HOLD / ART_HOLD / PROMOTION_HOLD`。AI自動プレイで実人間の初見走行を偽装しない。GameOver後JSON保存と2道路手動セッションの原本は変更していない。
- 次の実用面での焦点：ユーザーが実際に試走するとき、危険が見えるまでの秒数と回避可能性を判別し、この静的警告が「見えるだけ」なのか、ライン取りに役立つのか評価する。役立たなければAOを正式採用せず、物理道路と障害物の本格的な設計見直しに進む。
