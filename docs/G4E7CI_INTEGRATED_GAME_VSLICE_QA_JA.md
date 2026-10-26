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

## G4E-7CM — 実240Hz 15/17秒カメラ逆算・固定景観候補（2026-10-26 JST、検証待ち）

**実装は存在するが、専用CIと美術審査は未完了。** ブランチ上のコードコミット [1f432c9](https://github.com/ryomashibaba/dopagaki-development-hub/commit/1f432c9bc66714f6cc3869b90f4ff35f72a25922) で、G4E-7CI/CL既存16街区・主役4建築の配置を見直した。主役の高さと奥行を減らし、近景の単調な階数反復と中景箱塔の密度を軽減。主役4基は「15秒撮影用と17秒撮影用に別々の世界を作る」のではなく、**同じ既存物理B48道路0/1上で両方の実BG240Hzカメラの画角を評価してから固定配置**する。render関数・物理・カメラ・A13・入力・障害物は変更していない。テストは正規BG両時刻と位置スコアの記録を追加。3テストと真正WebGL旧新6対12枚の [CI #40285116236](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40285116236) は記録時 **QUEUED（未PASS）**。

**残るリスク：** 位置スコアは投影の工学的近似であり、美術的な巨大都市/用途/奥行きは証明しない。初期の近景セルは主に道路2沿いのままで、主役の選定候補には既存道路1/2も含む。街区連続性と物理道路との自然な関係、投影した主役の上端、15/17秒の視界と18.5秒 off-roadを、実画素の目視で必ず検証。CIで最低1基も見えない・部分欠け・単調な近景が残る場合は **ART HOLD/REJECT継続、配置を修正する**。原作再現/main/Gold/本番未変更、Draft PR #46未マージ、正式Slope2認定0m、ART/HUMAN/PUBLISH/READY/MERGE HOLD。Work未使用。

## G4E-7CN — 造形を持つ街区へ転換、真のPRIVATEゲーム画像12枚で再評価（2026-10-26 JST）

**コード [9d8f59e](https://github.com/ryomashibaba/dopagaki-development-hub/commit/9d8f59e05d56bf7735f63544fa9430ec88e0daf2) / [実ゲーム専用CI #40287595121](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40287595121) SUCCESS、テスト3 PASS・FAIL 0。** 2道路×3時点×BASELINE/CN=12枚の元ゲームCanvas WebGL2画像と6組の同一元BG240Hzカメラ比較を取得。[7日保持の真正画像とJSON artifact #12634718104](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40287595121/artifacts/12634718104)。元のB48道路7・B51-C動体28・gap52、速度・操舵・元カメラ・ジャンプを変更しない。

**実装変更**：CMで4基中2基のスコアが0～0.03／両時点視認0だったため、主役クレセント4基を2基へ絞り、15s/17sの実カメラの少なくとも片方で粗い全体投影が視認可能な候補だけ配置。12街区の近景では旧薄柱・細い浮梁を減らし、開口した店舗と屋根、二翼の段状建築、公共通路、階層のある厚みへ修正。**テストの投影スコアは美術合格基準ではない。** 残る2基はtrue-pinchで実投影score 1.160233（2視点）, 0.5（1視点）；pinch-switchで1.032176（2視点）, 0.5（1視点）。評価はスクリプト走行の固定視点であり人間の走行試験ではない。

**真正Canvas画像の定量情報（ベースラインからのRGB差＞48の画素割合、画質評価ではない）**：

| 視点 | 15s | 17s | 18.5s（原物理 off-road） |
|---|---:|---:|---:|
| true-pinch CN / baseline | 22.936% | 29.788% | 18.500% |
| pinch-switch CN / baseline | 22.975% | 35.606% | 10.670% |
| true-pinch CN / CM | 22.031% | 26.576% | 6.744% |
| pinch-switch CN / CM | 19.853% | 29.692% | 2.906% |

**実画像目視美術評価：ART HOLD / 主役級REJECTを維持。** 薄柱・空中梁の反復は相対的に減り、段状の建築質量が見える。ただし15～17sでは近景に大きく切れた無地の青緑ファサード/斜面壁が増えた。街区の規模・開口・用途の読み取りは十分でなく、遠景まで続く超未来都市の統一景観・数km級の印象は未達。数値の変更率や箱を厚くしただけでは合格ではない。18.5sの physicalRoad=off では従前同様景観が画面上方へ寄り、通常走行画面と分離評価する。**次COはサイズや個数の追加でなく、実カメラの近景巨大遮蔽を弱め、遠景と建物内の都市生活スケール・稜線を明瞭化し、2方向の15/17s実画像を美術採点する。** 旧初案の箱・新案の無地壁・無意味な細部増殖の反復は禁止。CIは成功したがART/HUMAN/PUBLISH/READY/MERGEは全HOLD、正式Slope2 0m、PR #46 Draft未マージ、保護本番・原作・Gold・main不変更、Work未使用。

## G4E-7CO — 旧CN巨大近景壁の遮蔽を修正、PRIVATEゲームWebGL12枚で美術HOLD判定（2026-10-26 JST）

**今回の実装と検証は完了。美術はなお ART HOLD / 最終採用不可。** コード [b9b1c44](https://github.com/ryomashibaba/dopagaki-development-hub/commit/b9b1c4452b6134b67bdea912f2c7d31734cbb6ec)、期待テスト文言修正 [0e560b6](https://github.com/ryomashibaba/dopagaki-development-hub/commit/0e560b660b302224715e53b90b0f34d0005c6530)。専用[CI #40289823039](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40289823039) SUCCESS、正規BC/B48/B51物理不変含む**3/3テストPASS**、PRIVATEビルドPASS、原ゲームWebGL2で2道路×3時点×旧新の**12枚**、6組の原BG240Hz同カメラ照合済み。[実画像/JSON Artifact #12635656344](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40289823039/artifacts/12635656344)（7日間保持）。初回CI #40289569552 の失敗はテスト期待文言の不一致（「CM requires…」対「CO requires…」）のみであり、期待文言修正後PASS。物理・本番コードには未影響。

**造形改善**：CNの手前で極端に大きかった無地青緑色の台形壁を抑制。近/中景の段状建築の高さを下げ、道路から奥へ設置。前面と道路側側面は実際に三角形が存在しない開口を持つ構造に変更し、平面テクスチャ窓だけで遮蔽を隠したのではない。15/17秒の両方の正規カメラに対する画面面積の危険判定で、視界を占有する近景は同じ道路沿いの低層・開放的な公共プロムナードに固定置換（人間プレイ中に切り替わらない）。実測：true-pinch **9街区フル維持/3低層化**、pinch-switch **10フル維持/2低層化**。主役2つは既存の物理路面0/1沿いの固定配置を維持。無意味な追加オブジェクトの大量増殖はしない。

| 変更RGB画素率・各旧ゲーム基準 | t15 | t17 | t18.5（BG physicalRoad=off） |
|---|---:|---:|---:|
| true-pinch CO vs BASELINE | 13.087% | 19.391% | 21.123% |
| pinch-switch CO vs BASELINE | 15.271% | 33.105% | 13.328% |
| true-pinch CO vs CN | 17.230% | 21.066% | 9.061% |
| pinch-switch CO vs CN | 16.749% | 20.921% | 6.436% |

CO/CN比較はArtifact同解像度の元ゲームPNGをRGB絶対差和48超で比較した画素比。**いずれも美術スコアではない。** 実画像を直接確認：CNより前景の巨大無地壁が目立たなくなり、クレセントなど主役建築や開口のある街区を読みやすい視点ができた。とはいえ17秒の道路左側には壁状の長い構造が残り、左街区と先の都市の連続性は弱い。空へ伸びる都市全体の稜線・遠景の層・数kmの規模感は不成立。18.5秒はそもそもBGのphysicalRoad offなので走行時と同一の美術比較をしない。**ART HOLD / CITY HERO REJECT**。人間操舵での視認性・公平性・完成品質は未認定。

次のCPは**見えている都市の建築関係と都市稜線の再構成**を優先。すでに改善した無地壁を再導入せず、過剰な箱/格子量産もしない。新しい素材巡回や無目的なテスト環境の増殖を避け、同じPRIVATE正規WebGL 12フレームで質を審査。元240Hz速度/操舵/カメラ/自然跳躍、B48道路7/B51-C動体28/gap52、A13規定、main/Gold/原作再現/本番サイト保護。正式Slope2=0m、PR#46 OPEN/Draft/未マージ。ART/HUMAN/READY/PUBLISH/MERGE全HOLD。Work未使用。
