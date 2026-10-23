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
