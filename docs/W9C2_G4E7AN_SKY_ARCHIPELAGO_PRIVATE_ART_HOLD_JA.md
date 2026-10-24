# G4E-7AN — SKY ARCHIPELAGO / 4群の奥行き型巨大都市（実3D研究・美術HOLD）

2026-10-24 JST。**独立したG4E-7AN案**。前工程のG4E-7AM R1/R2はNode・Chromium/WebGL・公開隔離PASSだが、実画像では右に大壁・左に大空白の「道路に沿う連続壁」で美術REJECT/HOLD。ANは同じ壁の高さ・穴を微調整した版ではない。

## ART-FIRSTの新しい造形：1つの壁ではなく4つの異なるシルエット

実B48道路1の異なる前後位置・左右に、距離のレイヤーを重ねない**独立した4大質量造形**を配置。いずれも衝突判定なし、既存真正11m B48細道・セル52欠損・元28基B51-Cはそのまま。

1. **FRACTURED HOLLOW CROWN**（手前・左、u=.155）。直径約430mの傾斜した分厚い中空冠。中心の空間は本当に空で、単なる黒塗り壁ではない。ところどころ冠本体も途切れる。既出の同寸連続門を反復しない。
2. **TORSION CITADEL**（中景・右、u=.295）。一つの基礎的造形から**高さと傾斜の違う二股の巨大ねじれた尖塔**が上昇し、間は上層で離れて負の空間になる。ねじれ多角断面、途中の実開口、独立した斜材。
3. **LEVITATING URBAN SHELVES**（次の中景・左、u=.535）。3高度の大きく湾曲した空中都市テラス。各レベルに異なる幅・外側深さ・開口を持つ。建築的な支持部は全て路面の外側。
4. **SKY HARPOON**（遠景・右、u=.795）。離れた枝先へ3方向に分岐する非対称高空の巨大構造。都市級の巨大輪郭を示すが道を横断する偽の道路床を作らない。

構造の存在を伝えるため、細線ではなく**厚みのある複数面の3Dシェル／梁／張り出し面**を使う。場当たり的な一本道の「橋・アーチの数」増加でもない。研究の具体的美術評価は、**通常の人間走行カメラの実Chromium画像**から行う。

## 実装

- `web/p101-w9c2-g4e7an-sky-archipelago.mjs`: AJ reanchorかつ2機のみ再配置・28基・7道路・正規セル52欠損・publish HOLDを厳格検査し、実B48`sample()`から外側3Dフレームを構成。オリジナルのステージJSONをbyte-equivalentに保護。表示頂部800m級、実寸・見え方は要WebGL確認。研究用保守的最低外側離隔指標190m。**追加コライダー／道路／動体は全て0**。
- `web/drive3d.mjs`: `http://127.0.0.1:4373/drive3d/?g4e7al=manual&g4e7an=archipelago` の**手動QA＋ローカルでの研究オプトイン**だけで AN の背景を旧景観・AM R2から完全置換。通常プレイ・デフォルトAL・Gold・本番は不変更。重ね描きやA/D補助なし。
- `scripts/build.mjs`: JSモジュールの同梱。privateのみ研究用AJステージJSONを生成、public/public-safeには研究用候補データを入れない。
- `tests/p101-w9c2-g4e7an-art.test.mjs`: 両AJ物理コースで4体・シルエット部品・GPU予算、sourceのJSON不変、未承認なら例外・全HOLD保護。
- `tests/browser/p101-w9c2-g4e7an-art.spec.mjs`: デフォルト旧背景とAN TRUE-PINCH/PINCH-SWITCHで**3枚の実WebGLキャンバスだけ**を画像保存。2本目は実A/Dキーで遷移。実動体28基、認証HOLD、AM非重複、GPU形状構造のメタデータを検査。自動ブラウザ操作は人間QAではない。
- `.github/workflows/p101-w9c2-g4e7al-manual.yml`: ANを既存AL/AM回帰と併走させ、3枚の画像・必要なエラー証跡をGitHub Actions artifactとして保存。**ユーザーのZIP操作を不要**にする。

## Gate

- AM R2技術PASS・美術REJECTの原監査は `docs/W9C2_G4E7AM_UPTURNED_CITY_PRIVATE_ART_HOLD_JA.md` と [実画像artifact #12537044928](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40037992309/artifacts/12537044928)。
- **ANの最新実CI**: [Actions #40039374208](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40039374208)。この記録の時点では未確定。GreenになるまではANのWebGL・スクリーンショット・公開隔離をPASSと呼ばない。Greenでも「美術成功」ではない。画像をGitHubから直接取得し、前景・遠景・路面・障害物の見やすさと差を評価する。
- **恒久HOLD**：実際の人間の操作性、240Hzレースの公平性、美術の採用、A13 Slope2 DNA 0m以上への認定、PR Ready/merge、本番変更。


## R1実WebGL審査 → R2正面視認性修正（2026-10-24 JST）

- [R1 Actions #40039374208](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40039374208) は**全技術ステップSUCCESS**。Chromiumの `true-pinch`、`pinch-switch`、旧景観3枚と既存AL/AM回帰PASS。GitHub [artifact #12539380888](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40039374208/artifacts/12539380888) を直接取り出して画面を評価した。
- **R1美術はREJECT/HOLD**：真の走行カメラでは中央の暗い空と一部の巨大な斜材しか見えない。中空冠は走行方向に対して**エッジオン（面が横向き）**、さらに冠中心が路肩から390m・高さ340m、二股都市等も非常に大きな側方距離にあり、スタート直後の時点でカメラ視野に収まらなかった。構造の生成成功は表示成功ではない。
- R2は独立4建築の構成を保持しつつ**造形の正面視認性**を根本改善する。冠の環状平面を道路の前方向から見える横幅方向へ変更。冠中心を側方212m・高さ245m付近へ移し、路面側の最近接外殻は保守的に50m以上路肩から離す。厚みは前後54m程度とし、単なる平板2D輪郭にしない。
- 建築群の道路軸上位置を `u=.40/.49/.69/.83` に移動。運転開始直後に後ろへ行く冠（旧 `u=.155`）を避ける。ねじれ都市塔・3層空中都市・高空分岐の低層から構造が見えるよう、各造形の側方オフセットを実質的に下げた。道路コライダーに接触させず、ゲーム上のジャンプボタン・強制視点・マグネット補助は一切追加しない。
- 新しいCIスクリーンショットは旧景観1枚＋AN両コースの**開始直後／約1秒後の実追従カメラ**で計5枚。すべて実240Hz Runner＋WebGL。人間操作ではない。
- [修正版R2 CI #40049868810](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40049868810) の最新結果を取得し、**画像を目視するまでは技術PASSも美術改善も宣言しない**。ビルド・Node・実WebGL・公開除外がPASSでも美術不合格はあり得る。
- **NEXT**：R2画面を旧景観・AM R2・AN R1と実際に比較して、道路と障害物の前方視界、近景／遠景に見える独自造形、景観の連続性を判定。次の独立造形試作を無限に増やすのではなく、十分な実画面品質を確認すること。

## R2実画像技術成功・巨大壁再発 → 建築個別診断（2026-10-24 JST）

- [R2 Actions #40049868810](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40049868810) の**Node／実Chromium／private／public/public-safe隔離は全SUCCESS**。画像artifact [#12542808485](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40049868810/artifacts/12542808485) の旧背景1枚・AN R2実WebGL4枚（2コース×開始／走行後）を直接取得して画面審査済み。
- **R2美術は依然REJECT/HOLD**。R1より前景3Dは入るが、右側を占める巨大で暗い面が実画面では壁に見える。中空冠を回す・建築の外側離隔を減らすだけでは、巨大都市の豊かな多層感や道路前方の先読みが成立しなかった。
- 次の手段は造形を無差別追加したり、カメラを勝手に引き直すことではない。R2本来の各メッシュを **`crown`／`citadel`／`shelves`／`harpoon` 単独で実レンダラに上げる**診断フラグ `&g4e7anFocus=<name>` を追加。これは `g4e7al=manual&g4e7an=archipelago` のlocalhost研究条件でのみ機能し、未指定 `all` は従来の4建築のまま。
- 各単独シーンを実走行カメラで撮影し、**どの建築に原因があるか**を画面比較する。Nodeでは各独立GPU三角形数の総和が通常4体と厳密一致すること、原AJの道路・物理・B51-C 28基・正式0mと公開HOLDが変わらないことを検証。
- [個別切り分けCI #40050280820](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40050280820) で4枚の単独スクリーンショットを新たに保存する。結果未確認の間は美術判定を変えない。
