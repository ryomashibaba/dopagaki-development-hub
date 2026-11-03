# K4BB — Road5真正B48実UV-PBR路面・公共建築内部のBlender編集可能再制作

2026-11-03 JST。K4BAから継承したART-FIRST・DCC-FIRST研究。**真正ゲームへの採用禁止／正式ART=0、Slope2 DNA=0m**。

## 現在の確定継承

元研究 `research/k4ba-road5-tidal-city-cinematic-art-rebuild-20261103` HEAD `bb7ea19ec05bc05ddad54a51faeb69f302656f0e` を基点にK4BBを隔離。K4BA v2 [CI #41625837609](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41625837609) 本Blender原本／GLB／6真正source数値camera DCC A/B／航空art DCC **SUCCESS**、[独立BVH #41626249550](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/41626249550) **静的ソースRoad5・B51への交差0件**。それでも道路単調、左右が柱と屋根の模型、内部が機能に見えない、遠景も都市感が弱く、**ART REJECT**。画像のピクセル差やオブジェクト数を美術評価に使わない。

## 設計と実制作

### 道路（K4BB 2K PBR UV atlas）

- 元 source B48 の物理Road5 ID `p93-PRISM_CREST-01`、4,728 三角形、真の91×13上面格子をUVへ対応させる。元の制御点SHA `5eb731e25bc9eb1a3cf1080e7b239f5e2e8043bfbc80e5d37e0b069a5a08a730`。制御点/頂点/三角形のDCC Blender幾何 SHA before/after一致を必須。
- 2,048×1,024 deterministic image texture（seed 20261103）、Albedo／Roughness／Heightの**3独立画像**。石材・砂・骨材・目地のノイズを世界の施工寸法と実Road5縦横UVに一致させる。Bump nodeとRoughness nodeを実配線し、単なる色付きplane/boxの羅列とは違うBlender-native PBR材質候補を作る。
- Road5本物の物理メッシュの**色材質とUV preview**だけを新規追加する。元ソースゲームのP100/B5などの進路・危険表示を変更・置換したとは絶対言わない。本物のWebGL2原作の安全性と操作性は未認定。Road5以外に展開しない。

### Public interiors（ロード両岸、実source Road5から外側へ）

- K4BA v2 .blendの全編集可能コレクションを保持し、K4BB用の別collectionに実空間の側壁・後壁・屋根・床を持つ4種の大規模公共用途をBlender-nativeメッシュとして設計する。
- 公共用途別：**海港食堂**（実カウンター・暖色吊灯）、**閲覧交換所**（複数の棚とテーブル）、**公共交通ラウンジ**（ガラス表示面・サービス設備）、**海岸植物展示室**（実立体プランター・床灯）。Entranceの実開口を抜き、すべて同型のBOXの反復にしない。高速度の元Cameraで内部が認識できる構図・長い温かい光帯を重視。
- 2つの特徴的な大型アトリウム内装天井と、建築の荷重が読める入口柱を追加。素材は石材・ブロンズ・木・深い緑のガラス。室内専用カメラは**元sourceカメラと別**、混同しない。

### 実検査で必要な厳格ゲート

- 6元Camera control11259/11278/11307、ultra11320/11341/11369、B51 28個×6tick original collision OBBを時刻ごと描画（OBBは元ゲームのアートではない）。K4BA v2同Cameraとの6枚1:1比較＋アーティスト航空＋人間目線のインテリア画像。**これらのBlender画像は真正Chromium/WebGL2ゲーム画面ではない。**
- 編集可能原本 `.blend`、GLB、UV+PBR atlas3枚、合計8+3画像、元Road5 fingerprint/source/provenance JSON+全ファイルSHA。
- [Blender制作ソース](../scripts/p101-k4bb-source-road5-pbr-civic-interiors.py)、[専用CI](../.github/workflows/p101-k4bb-source-pbr-civic-rooms.yml)、[新K4BB公共室の独立元B48/B51 BVH検査](../research/k4bb/independent_new_interiors_native_b48_b51_bvh.py)。
- CI成功でもsource/DCC TECH限定、ART=REJECT/HOLD。真正ゲーム240Hz走行は実装も実測もまだ行わない。新PBRの実照明との相互作用・高速でのreadabilityを人間が見て審査し、画面の質が悪い場合は即座に不採用。

## 不変の保護契約

| 項目 | 固定 |
|---|---|
| 凍結元game blob | `af076d67492a677d2235e4730aef8cdf4808e106` |
| 物理・カメラ | 240Hz、球半径0.65m、原本7 B48／28 B51、6元Camera数値、源sourceタイムスタンプ |
| 変更不可 | main、production URL、公式継続branch `p101-velocity-overdrive-native-trial`、Draft PR #46、original WebGL2ソース、元物理 |
| ゲート | 正式採用ART 0件、Slope2 DNA 0m、ART/HUMAN/SAT/CCD/FPS/RELEASE/MERGE 全HOLD |
| 使用環境 | Chat＋GitHub、ユーザーPC操作最小、Workは事前許可が必要 |

**この文書を作成した時点でK4BBのActionsの最終成功・画像品質・独立BVH PASSは未確定。** 後続の検証結果を正本へ追記する前に本物のログとPNGを取得すること。
