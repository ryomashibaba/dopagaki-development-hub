# DOPAGAKI SLOPE — R19 A6 P4 R2F5-E Native Blender・元8秒真正2画面・独立ART REJECT

**2026-11-01 JST / 研究ブランチ `p101-velocity-overdrive-native-trial` / PR #46 OPEN Draft未マージ。**

## 1. 実行事実・厳密判定

**R2F5-E SOURCE / NATIVE BLENDER / GLB / SOURCE WEBGL2 TECH限定PASS、ART REJECT。**
正式ART採用0件、Slope2 DNA認定0/2,912m、HUMAN・GAMEPLAY・PERFORMANCE・INTEGRATION・RELEASE・MERGEは全HOLD。

- [E実装`59615195c`](https://github.com/ryomashibaba/dopagaki-development-hub/commit/59615195c90232f9f02028596871169fba3cf0d6): 旧R2F5-BをGit blob SHA `a6ee111319a81c7e83b1a85664d0b1c4da40bbcb`で保護し、旧D位置に新Native Blender建築だけを差し替え。11.504秒側は旧対照を維持。
- [初回真正CI #41292509962](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41292509962): E固有工程で **FAIL**。原因は新wrapperで `station=Path(...)` というモジュールスコープ変数を追加し、元道路アンカー計算関数 `station()` を影で上書きしたため（`TypeError: 'PosixPath' object is not callable`）。元B/D・物理側の不良ではない。
- [原因修正`7e5693a`](https://github.com/ryomashibaba/dopagaki-development-hub/commit/7e5693a79b63b035b6d8f831ff3892716c39dea3): `hall_script` に改名し、元関数名を変数で上書きしない静的アサーション追加。失敗履歴を消さず記録。
- [修正版真正CI #41292913215](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41292913215): **全Job SUCCESS**。元B/Dリプレイ、実E Blender×ultra/control、実編集可能BLEND/GLB、インデックスglTF独立GPU読み戻し、元240Hz tick1921真正WebGL2 PNG2枚、旧D同条件RGB画素監査を実行。
- [正規原Artifact #13077971560](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41292913215/artifacts/13077971560): ZIP **23,481,339 bytes**、実ダウンロードSHA256 `51a7f1e6bb52c1737eb11869410389d00a84aeab818ea58bd6d323a399641ed6`。**94ファイル、E固有12ファイル**（BLEND×2、GLB×2、GPU buffer×2、Blender reports×2、WebGL2 PNG×2、native report・pixel audit各1）。両PNGのSHAを独立照合。
- original source Git blob `af076d67492a677d2235e4730aef8cdf4808e106`、元球/240Hz、7B48/28B51、原カメラ/HUD/自然ジャンプ/左右操舵、main/Gold/P100/W9-X/B5・本番2サイトは**変更なし**。新物理Collider 0。

## 2. 真Blenderで何が成立したか

R2F5-Dの元Road1 `u=.125`、左道路端から45mという8.004秒の位置を継承。元Bの旧63部品／屋根2枚に代えて、**Native Blender部品51個**の多層交通市場建築を1棟として実生成。

- 地上基壇、幅13.8mの屋外中央コンコース、左右非対称の到着階7.0/8.8m・市場バルコニー階14.6/19.3m
- 屋根4枚の実3D厚み、支持柱／壁面、後方の支持付き乗換デッキ、階段状フロア、案内構造、店舗カウンター
- 元道路を跨ぐ建築の導入なし。ただし、元地盤の真接地、実動線、非常時脱出、荷重構造計算は**未証明**。コード上の`roofPostGapMaxM=0`は設計変数の値であり、建物全体の実構造安全を保証しない。
- Blender edited faces **22,250**、新GLB GPU正規三角形 **44,260**（両幅同数、上限50,000以内）、Native 51部品、新コライダー0。旧Dは22,562 faces／44,788 triangles。

## 3. 正真正銘の元8.004秒2画像

全て元A1カメラ／240Hz tick1921、1013×698、実WebGL2・原B48/B51描画、元球物理照合後のPNG。元球XYZ誤差ultra `0.0003055836m`／control `0.0004554248m`、速度誤差ultra `0.0004633m/s`／control `0.0002750m/s`。renderer report errors=[]。

- ultra PNG SHA256 `786ff844bd9f8aab3ceb30d2111e31a61c2049a071bfd478257fa5b55a0b9f55`
- control PNG SHA256 `3682ee879fd96c874bf3bf1c6fc9b929078006be4d174957906eb9d6198b4792`

原E実頂点の元カメラ投影Bounding Box（真ピクセル遮蔽マスクではない）:

| 値 | ultra 14m | control 28m |
|---|---:|---:|
| x | 105.42–301.71px | 96.42–298.55px |
| y | 213.28–317.52px | 212.16–318.78px |
| 見かけ高さ | 104.23px | 106.62px |
| 旧D見かけ高さ | 59.52px | 61.02px |

同一真正D→E画像の最大RGB差36超画素比率（**美術品質評価ではなく画像変化の記録**）:

| 領域 | ultra14m | control28m |
|---|---:|---:|
| 全画面1013×698 | 1.21670% | 1.28091% |
| 左建築ROI x0..369/y200..479 | 8.30405% | 8.74228% |
| 中央道路ROI x355..824/y290..619 | 0.00000% | 0.00000% |

## 4. 実画面の独立美術評価：ART REJECT

2つの元PNGを直接実見して旧Dと画面同条件で比較した。元Dでは小さい低屋根2枚だった建築が、Eでは縦に大きくなる。しかし**建物は左近景に骨組みとオレンジ色の階層板を積んだ2本の独立塔として映る**。太い一体の交通市場、市街地へ続く人間規模の開放公共地盤、奥行きのある利用空間、群衆のための都市的機能が走行画面から読めない。

- 実頂点bbox高が約104–107pxに増えたことと、**人間が使う駅市場としての説得力向上**は同一ではない。
- 初期の「孤立箱群」「反復塔」「巨大門」のART失敗を、**二つの見張り塔風の積層構造**として繰り返しかけている。
- 新モデルをART PASSにせず、正式採用0件。画面中央道路ROIが変化しないこともB51の実ラスタ視認PASSを意味しない。
- 新E GLB対元B48厳密静的、B51全tick離散3D SAT、tick間CCD、地形接地、人体歩行、B51ピクセル視認、Windows/iPhone FPS、実高速操舵は**全てHOLD**。旧R2F4側のSAT結果は絶対に流用しない。

## 5. 次のR2F5-F（新実装前の設計指令）

**柱・屋根・階層数の微修正、二棟の連結だけの見せかけ、色係数変更を禁止。** R2F5-Eの原BLEND／PNGを維持し、同じ建築ソース内の8秒1施設を**道路から読める一体的な都市交通の建築ボリューム**へ作り直す。

1. 真8秒×2幅のカメラ画像を設計の正本とする。両端の塔を取り払い、前後に深い**一つの人間尺度の地上交通基盤**と、抜けのある大きな本物の屋内外空洞を持つ異形の2〜3建築塊を地盤から一体的に制作。
2. 何をどこで乗り換え、どこで買い物し、どう奥の公共地区に続くのかを**元カメラで観察できる立体マスと空間**で設計。ラベル、疑似照明、同形外装だけでは採用しない。カメラ／元道路／障害物は変えない。
3. まず2枚だけの真正ARTゲート。厚い一体公共地盤、入口の読みやすさ、地域の奥行き、一棟としてのまとまりを独立審査。改善がなければREJECTを維持して同じモデルを直す。無用な多案量産・CI乱立禁止。
4. 正式ART候補が成立して初めて新GLB固有の厳密B48・B51 2,881tick×28×2モード、連続CCD、真ラスタ/性能/人間走行へ。いまの段階で本番・mainマージは禁止。

**結論：TECH限定PASS／ART REJECT。PR #46 OPEN Draft、正式ART0件・Slope2認定0m、RELEASE/MERGE HOLD。**
