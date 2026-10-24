# G4E-7AX — LONG CROWN : 物理的長距離導入区間の再設計、非公開試走限定・HOLD

**基準日：2026-10-24 JST** ／ 開発ブランチ `p101-velocity-overdrive-native-trial` ／ [Draft PR #46](https://github.com/ryomashibaba/dopagaki-development-hub/pull/46)

## なぜこれを作ったか

前工程AWでは、上り坂・CROWN蛇行・中心線の12〜18m移動という6案全てで起点00から第2道路u=.12〜.13付近の接地が失われ、14秒前後に落下した。最初に空中になる位置は遅い「落下時刻」とは違う。単純な数値の調整をやめ、約90m/sで先を読みつつ細道へ入れるように**実B48第2道路の前半約半分を構造から組み直した**。

### 新規実B48路面

- 長い進入区間：u≈.05〜.29で段階的に道を細くし、コアに入る前から連続した緩曲率の中心線を示す。これは衝突する実路面。不可視床や中央固定安全帯ではない。
- CROWNコアu≈.29〜.39は概ね14m級、CHASMの後半u≈.63〜.82は従来の立体細道のまま。全長は再計測前なので**追加の正式Slope2認定距離には算入しない**。
- 自然なS字を持つ`longLead`と、比較用に大きめの弧を持つ`wideArc`を作成し実物理を対照比較。`wideArc`は静的衝突で悪化したため手動候補には出さない。
- AV lineSoftの第1道路、ギャップcell52、CHASM部分、後続5道路、オリジナルspawn、元の実B51-C28基を保護。CROWN部分で位置が変わる実B51-C2基を新路面に再アンカーし、残26基は実定義を不変更。通常ゲームの物理法則とカメラは不変。

### 実走行エビデンス（非人間・正規240Hz・開始00・同じP96操舵）

| 条件 | AV lineSoft | AX longLead | AX wideArc |
|---|---:|---:|---:|
| TRUE-PINCH 生存（秒） | 14.496 | **14.667** | 11.271（静的衝突） |
| TRUE-PINCH 最後に第2道路へ接地したu | 0.1345 | **0.2057** | 0.1318 |
| PINCH-SWITCH 生存（秒） | 14.408 | 14.400 | 11.254（静的衝突） |
| PINCH-SWITCH 最後に第2道路へ接地したu | 0.1347 | **0.2006** | 0.1291 |
| 第2道路以降 | いずれも2/7で失敗 | いずれも2/7で失敗 | いずれも2/7で失敗 |

[専用CI #40085562570：SUCCESS](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40085562570)、[測定JSON artifact #12557271039](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40085562570/artifacts/12557271039)。

**物理形状の検査に合格したこと ≠ ステージが楽しいこと。** longLeadはまだ完走不可、初見プレイヤーの回避可能性、道の見え方、難易度調整、美術、全7道路の継続性は全て未合格。

### 実ブラウザ手動QAと公開隔離

- ブランチ内非公開生成ファイル：`P101_A13_W9C2_G4E7AX_TRUE_PINCH_LONGLEAD_LOCAL_TRIAL.json` と `...PINCH_SWITCH...`。
- localhost限定 `/drive3d/?g4e7al=manual&g4e7ax=long-crown`、Windows用 `RUN_G4E7AX_MANUAL.cmd` も提供。A/D本物の手動操舵／240Hz物理、2パターン比較、ゲームオーバー直後のローカルJSON保存に接続。
- `build:site`、`build:public-safe`への混入を明示検査。統合Chromium CI [#40085980811](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40085980811) が最終SUCCESSになるまでWebGL/公開隔離合格とは報告しない。
- main、Gold、本番ゲーム、本番の原作Slope再現URL、既存AT/AVの原本、PR46のDraft状態は維持。正式DNA認定は0m。Human Fairness / Art / Publish はHOLD。

## 次工程

CROWN第2道路u≈.2以降で起きる実際の路肩逸脱と、S字入口の先読み時間を、**実カメラ視界＋原点からの物理軌道**で検証し、必要なら区間全体を再構成する。箱状の遠景・単調さという根本問題も未解決。WebGL画像・手動試走の根拠なしに「合格」「面白い」と宣言しない。
