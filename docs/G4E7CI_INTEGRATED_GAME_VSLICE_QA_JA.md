# G4E-7CI — 近景/中景/遠景をゲーム自体の実WebGLへ統合する小区間の美術試験

2026-10-26 JST。過去BX/BY/BZ/CA/CG/CHの失敗を受け、単体GLBと独立three.jsではなく、**本物のゲームB48道路と元240Hzカメラを含むPRIVATE実WebGL**で評価する。

- 近景：路肩から18～48mの店舗・開いたアーケード・公共交通デッキ・灯・看板。黒い全面壁と閉鎖した箱を避ける。
- 中景：路肩約83～130m、非対称の段丘状2翼と実際に開いた公共空間。窓・通路・生活階層を組み合わせる。
- 遠景：路肩185m以遠、空の大きな抜けを持つ高さ182m以上の非対称都市冠部・断続的な都市稜線。
- 確定した城・アーチ禁止ルールを増やさない。価値のある建築形は自由だが旧試作の安直な箱量産に戻らない。

**実装**: web/p101-w9c2-g4e7ci-integrated-streetscape.mjs。既存のg4e7bg 240Hzフレームを採用し、PRIVATEローカルのg4e7al=manual&g4e7be=roll-deck&g4e7bg=inspect&g4e7bgFrame=hold&g4e7ci=streetscapeでだけ有効。

**QA**: tests/p101-w9c2-g4e7ci-integrated-streetscape.test.mjs で実B48×7、B51-C×28、gap52、Stage JSON完全不変、元カメラ6を確認。scripts/p101-w9c2-g4e7ci-real-game-capture.mjs と専用CIでtrue-pinch/pinch-switch×15/17/18.5秒の6点をBASELINE/新案の同一元カメラで合計12枚を取得。初期設計のテストが成功した後は画像を目視し、中心進路の遮蔽と質を評価する。これは**実ゲームCanvas**であり、以前の「元ゲームと別のWebGLシーン」ではない。ただしフレームは脚本入力であり人間試走とは違う。

保護：240Hzの速度/操舵/跳躍/相対カメラ、B48実道路7・B51-C動体28・gap52、A13、main/Gold、原作再現、公開2サイトは一切変更しない。新規の衝突面・道路・障害物0。PR#46 Draft未マージ、ART/HUMAN/READY/PUBLISH/MERGEはHOLD、正式Slope2=0m、Work未使用。CI実測と画像審査完了前には美術PASSを出さない。

## G4E-7CJ 実ゲーム画像QAの精度修正（2026-10-26 JST）

前回のG4E-7CI Actions #40236394164は実行待ち（queued）。保存されていない画像を完成扱いしない。GitHub Actionsの最新確認時点ではリポジトリ全体で34件queued、4件in_progress。新たなWork/ユーザー操作なしでこの状況を確認。

G4E-7CJでは旧景観と統合案を同一**実ゲームWebGL Canvas**で比較する際、各フレームのカメラ原本フレームID、撮影時刻、速度、物理道路名、Canvasピクセルサイズを厳格照合する。全12枚を生成後、ブラウザ標準PNG復号で**同じ実画面の6対の変更ピクセル率と中心進路領域の変更率**を解析し、閾値による視認警告を残す。別three.js独立シーンやAABB角点のみに頼らない。一切の変更割合をART PASSの証拠にしない。エラーがあればCIはFAIL、正式Slope2 0m、ART/HUMAN/READY/PUBLISH/MERGE HOLD。元物理240Hz/B48×7/B51-C×28/gap52、元カメラ/操舵/自然ジャンプ/本番二サイトと原作は不変。


### G4E-7CJ 実ゲームカメラの完全一致（差分チェック）

時刻・カメラフレーム番号・速度が同じでも実際のワールドカメラ座標・視線方向がずれればA/Bの比較結果は信用できないため、描画直前のview.eyeとview.front（小数7桁）を読み取り専用DOMデータ属性に追加。ベースラインと新案で厳格一致しなければCIはFAIL。描画・物理・カメラ設定は一切変更しない。数値と画像だけでART承認しない。

## G4E-7CK — 初回G4E-7CI/CJ実CI停止原因と最小修理（2026-10-26 JST）

実行 [CI #40237327203](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40237327203) の「元BC物理・道路・28 B51/52 gap・生成景観」検証は**3テストPASS**。PRIVATEゲーム生成前の `npm ci` が EUSAGE でFAIL：リポジトリには `package-lock.json` / `npm-shrinkwrap.json` がないため `npm ci` は必ず失敗。これは景観モデルの品質・物理バグではない。

修正は専用CIワークフロー内の1コマンドのみ。`npm install --no-save --no-package-lock --no-audit --no-fund` に置換しCIの一時領域だけで依存を導入、ゲーム・テスト・カメラの数式は変更しない。**実WebGL画像・美術品質については修正後CIの完走まで未確認**。CIが緑になっても実画像を見ずART PASSにしない。

従来の大きなActions待機列は新pushで旧CIがcancelledになる要因。原因特定前の余分な細かいpushは避け、ワークフローの次の完全な画像結果を最優先にする。正式Slope2 0m・PR#46 Draft未マージ・ART/HUMAN/PUBLISH/READY/MERGE HOLD、原物理240Hz/B48×7/B51-C×28/gap52・main/Gold/原作/本番サイト不変更。
## G4E-7CL — 真のPRIVATEゲームCanvas初回美術REJECTと第2案

[専用CI #40237934943](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40237934943) はSUCCESS。既存B48×7/B51-C×28/gap52/240Hz物理とカメラを変えずに、実ゲームCanvasで旧新各6枚・計12 PNGを取得。3物理不変/景観テスト成功、PNG6対のpixel-diff成功。画像の原本は[7日保存Artifact #12616105523](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40237934943/artifacts/12616105523)。

| 原道 | 15秒 変化画素率 | 17秒 | 18.5秒 |
|---|---:|---:|---:|
| true-pinch | 24.326% | 29.777% | 17.607% |
| pinch-switch | 22.119% | 27.995% | 9.294% |

画像の目視審査：初案はART HOLD/REJECT。15〜17秒は直方体の塔と薄い柱・四角い商店枠の繰り返しが多く、未来メガシティではない。18.5秒は実BGのphysicalRoadがoff（実スクリプト視点では道路から離れている）であり、道路は画面上部、街区も上方へ抜け、下方に暗い空間が広がる。この飛行/離脱場面を通常路面走行での美術品質と混同しない。中心進路の変化率が小さくても実プレイの障害物視認を証明しない。

第2案は素材を増やさず、近景アーケードの階数の単調反復を崩し、中景の反復した塔を1/3ほど間引き、遠景の細いフレームを減らす。同じ正規road2に、外側へ離した左右各2基、合計4基の厚い湾曲した公共建築クレセントを生成。各建築には貫通する開口、上空へ切り開いたボイド、広い回廊、公共広場、接地支持を含む。これが実画面で主役として読めるかは未確認であり、今後もART/HUMAN/PUBLISH/READY/MERGE HOLD。物理/速度/操舵/ジャンプ/カメラは不変。


### G4E-7CL 第2案の再検証 — 2026-10-26 JST

[CI #40282742498](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40282742498) **SUCCESS**。実ゲームWebGL2、正規BG 240Hzカメラと同一B48/B51物理で、初案と同じ6視点×BASELINE/修正版の12画像を再取得。元物理と3層造形の3テストもPASS。[7日限定Artifact #12632568264](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40282742498/artifacts/12632568264)。

| 道路 | 修正版の15s旧景観との差分 | 17s | 18.5s |
|---|---:|---:|---:|
| true-pinch | 25.532% | 27.196% | 17.977% |
| pinch-switch | 23.263% | 24.879% | 10.411% |

さらに修正版 vs 初回版の真正PNG画素差は true-pinch 15/17/18.5sそれぞれ6.569%、8.315%、3.973%；pinch-switchは5.848%、9.057%、2.884%（RGB絶対差和48超）。**これは表現の変化量であり、美術向上率ではない**。レンダリング三角形は初案9504 → 修正版8512。三角形を増やさず密度の単調さを減らしたが、質の向上を意味しない。

**目視美術審査（修正版）もART HOLD / 中央街並み主役級にはREJECT。** 15/17sに外側の大きな白い曲面/金色の一部が見えるが、公共建築の全体像を認識しづらく、上部が画面端で切れている。近景の薄柱・箱型建物が依然支配的で、道路を走りながら感じる都市の奥行き・用途・スケールの抜本改善は実証できない。18.5sは原物理がphysicalRoad=offで遠景/道路とも視界上方、暗い空間が残る。元のカメラを改変して見映えを作ることは禁止。したがって本モデルを大量複製・本番採用・公開することも禁止する。

**次G4E-7CMで行うべき根本修正（CI増殖の防止）**：まずBG6実カメラの道路・建物中心の投影を逆算して、見せたい主役建築がt15/t17で画角内に**構造全体のシルエットとして収まる**よう原BC道路側の専用ランドマーク位置を再設計する。第三道路など未証明の場所を勝手に足すのではなく、実物理とカメラから視認する道路区間を識別する。静的な大型形状に見えるだけでなく、近景生活スケール、中景変化、遠景の都市規模を一つの視界で成立させる。18.5sのoff-road表示は別カテゴリーとして評価する。真正ゲーム画面で比較するまでART/HUMAN/READY/PUBLISH/MERGE HOLD、正式Slope2 0m。不要な新素材巡回、単純箱の量産、無目的な細部盛り付けはしない。
