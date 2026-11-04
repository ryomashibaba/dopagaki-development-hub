# K4CB A1 — 真正CHASE港湾アーチ実レンダー、全画面ART REJECT・改善判断

確認：2026-11-05 JST。これは既存K4CA→K4CB計画の実行・視覚評価記録であり、公式採用や物理改変ではない。

## 原本・不具合・実施工
- K4CA A2親Artifact #13334366579を独立取得。ZIPは122,648,582 bytes／SHA256 `201a290b04165b5f70da4f88705f34d9c7fdc27edca6e42c2311674807708788`、ZIP CRC全PASS、真正親.blend 271,620,488 bytes／SHA256 `299f1972e3383a7fc0047409a0f58581da3884988749dff6842a80cdf49a3ffa`。
- K4CB初回[Actions #41857056044](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41857056044)は親Blender取得とK4BZ/K4CA回帰PASS、Blender内の樹木ID検索条件でFAIL。実A2バイナリ直接検索：K4BS 8、K4BV 1、K4CA 2。K4CAのオブジェクト名2件がBlenderの63バイトID制限で短縮されており、長いprefixはヒットしないことを確定。
- [修正コミット `78e72df`](https://github.com/ryomashibaba/dopagaki-development-hub/commit/78e72df6ce08c13448e761ae9335b2be196fe331)ではK4CA名prefixのみ短縮し、8+1+2個別件数／CC0 vendor／COLLECTION instance／非Collider／元姿勢不変をASSERT。樹木や原本を削除・移動していない。
- [K4CB監査JSON](research-evidence/k4cb/K4CB_SOURCE_LOCKED_TRUE_MARITIME_EXCHANGE_AUDIT.json)、[768×480真Blender CHASE](research-evidence/k4cb/K4CB_TRUE_SAME_CHASE_MARITIME_EXCHANGE_NOT_GAME.png)、[同CHASE旧新比較](research-evidence/k4cb/K4CB_VS_K4CA_TRUE_SAME_CHASE_MARITIME_EXCHANGE_ART_REVIEW_NOT_GAME.png)が研究ブランチに実保存されたことを確認。画像は直接開いて目視確認した。独立ZIP再取得・後続Actionsジョブの最終結論は本記録時点で未照合。

## 技術側の保存監査（美術スコアではない）
| 項目 | 実保存監査 |
|---|---|
| 親A2.blend | SHA256 `299f1972e3383a7fc0047409a0f58581da3884988749dff6842a80cdf49a3ffa` |
| K4CB A1新編集可能.blend | 271,929,100 bytes、監査記録SHA256 `9df956acf164d7a0f4d861585644e15f87faa5d85683f2e8ae79bb438c03333d` |
| K4CB真正同CHASE PNG | 476,075 bytes、監査記録SHA256 `0aa667522b327e2ace253c3e5acff56b77ff05139024e7aaab517c8ef70d99b7` |
| A2/K4CB比較画像 | 監査記録SHA256 `ab908c1b15aaee1f397fd1a67253dcee64a5036e39634aa48cd1282fb95089fd` |
| 追加DCCメッシュ | 24、全て研究用。ゲームCollider追加0 |
| アーチ実CHASE投影 | 3件、画像の右側、およそx=0.71598〜0.77040、y=0.52608〜0.52967（UV正規化） |
| 新港湾変更領域 | 2,083実画素（非ART評価値） |
| 既知の黒筋 | 元の6対を比較。監査上、新たな強い黒筋なし |
| 源保護 | 元Game Blob `af076d...`、Road5 `f7c609...`、Source 6 Camera／CHASE、元9樹＋K4CA 2樹、光源、不良重複路面のhide_render継続をASSERT |

本表のK4CB.blend/PNG SHAは**Actionsが出力して保存した独立監査JSONの値**。この会話の容器内でA1.blendの実バイトを別途再ハッシュしたとは主張しない。比較PNGの直接目視とは別の検証段階である。

## 真の同カメラ1画面ART目視判断
**ART REJECT。正式ART採用0件、Slope2 DNA 0m。**

- 右側公共建築の足元に3連の厚いアーチ・奥まったガラスが確かに現れ、局所的な建築機能の理解は進んだ。しかし真CHASEでは**極めて小さい**。建物の上部・屋根・岸壁は依然軽い模型的な造形で、アーチを増やしても港湾全体を現実の巨大建築へ変えたとは言えない。
- 画面大半を灰色の幅広い平坦な道路が占め、主役の都市・港湾空間・左右スケール感・速度感は従来の弱点を残す。左海岸の地質と地形・道路との接続もほぼ変わっていない。
- よって「技術成功、2,083画素変化、実24メッシュ」を美術PASSと扱わない。高速レースの真に高品質な画面、世界水準の建築スケール、楽しい人間プレイは**いずれも未実証**。
- K4BZで修復した暗い三角筋を再発させていない点のみ局所TECH維持として扱い、元道路・元Camera・元物理を無断変更しない。

## 次の未完了K4CB作者工程（方針不変更）
次はA1アーチの本数や色だけを増やさず、**既存Blender実ホールの寸法と元CHASEへの投影を把握した上で、右の港湾建築そのものの支配的なシルエット・厚い屋根と実壁・入口・地面/岸壁との連続空間を作者として再設計**する。画面の実際の画素面積を投影で先に調べ、別カメラや巨大な紙壁で誤魔化さない。左の実地形とRoad5を取り巻く視覚・距離感も同一画面で評価する。

A1新造物は研究DCC内でのみ可逆改修可。元K4CA A2.blendを厳格に保持し、K4BZ bad PBR roadはhide_render=True維持。元Game/Road5/6Camera/CHASE/元樹木/既存ライト/主ゲームコライダーに手を付けない。1画面ARTが合格するまで残6Road・正式P101・main・Draft PR #46・本番へ展開しない。Work/Computer Useは個別承認、追加課金0円。

**状態：K4CB A1 真Blender画像・GitHub研究証拠保存確認／ART REJECT／SAT・CCD・FPS・HUMAN・RELEASE・MERGE HOLD。**
