# DOPAGAKI SLOPE — R15S3D9 7本の実B48下流再設計・真正完走2世界証明・品質ゲート

**基準日：2026-10-30 JST。正式状態はSOURCE TECH（真正Runner・形状・独立QA）限定PASS、SOURCE NATIVE FINISH 2/2 PASS、GAMEPLAY統合/HUMAN/ART/PERFORMANCE/RELEASE/MERGE HOLD。元ゲームの生産用ファイル・main・Gold・P100・本番URLは変更しない。**

## 0. 「finished」の真正証拠と限界

本研究の最大の進歩は、元の`Runner`、元の240Hz/CCD、P96→P94/A13、元route/routeSegments、元B51全28を**全く変更しない**状態で、PRIVATE実験用の本物のB48道路5・6制御格子だけを協調して再生成し、元エンジンの原型`finished`判定に2つの元世界で到達したこと。

- **true-pinch / A_CONTINUOUS_NARROW_MACRO**：元Runner最終`finished` **69.829167秒**。元`finish`イベント1件。実接地・実最終B48 ID `p93-FINISH_RIDGE-01` における終了。
- **pinch-switch / A_CONTINUOUS_NARROW_MACRO**：元Runner最終`finished` **70.516667秒**。元`finish`イベント1件。実接地・実最終B48 ID `p93-FINISH_RIDGE-01` における終了。
- **B_ELEVATED_REAL_GAP_MACRO**：true-pinch **61.262500秒 failed**、pinch-switch **61.845833秒 failed**。元`finish`イベントいずれも0件、道路6実接地0秒。
- **判定線**：これは**SOURCE-NATIVE 原物理・保存実験3Dに限る真正完走**。ゲーム本体に組み込んだ実WebGL/正規カメラ/HUD、ユーザーの人間操作、障害物視認性、正式都市美術の実機品質は未検証。**GAMEPLAY正式合格や公開用完成と呼んではならない。**

## 1. 真正GitHub証拠・失敗履歴

| 工程 | 真正出典 | 判定 |
|---|---|---|
| 7本の実B48・28 B51の下流トポロジー監査 | [Actions #40987951631](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40987951631) ／ [Artifact #12947213686](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40987951631/artifacts/12947213686) | CI SUCCESS、読取・形状監査のみ |
| 2案×2世界の本物の道路5・6の全幅接続、法線・幅・最終座標の静的4条件ゲート | [Actions #40988252405](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40988252405) ／ [Artifact #12948201217](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40988252405/artifacts/12948201217) | CI SUCCESS、幾何4/4静的PASS |
| 元0秒・95秒上限・240Hz真正4実走行と初回独立QA | [Actions #40988524554](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40988524554) | 初回CI FAIL。4真正Runnerの終端自体は記録完遂。既存R15S3D8R1 JSONの`terminalTimeOr45sCap`を新`terminalTimeOr95sCap`と誤参照して比較証拠が欠落。原物理/道路変更なしで参照キーを修正。失敗記録を隠さない |
| 正しく再取得した元4実走行と独立QA12偽認定拒否 | [Actions #40988751126](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40988751126) ／ [Artifact #12947524134](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40988751126/artifacts/12947524134) | **CI SUCCESS・真正FINISH A案2/2** |
| 実元`finish`イベント・最後の接地・最終道路名を追加、偽認定14種の独立QA付き再試験 | [Actions #40989026403](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40989026403) ／ [Artifact #12948217815](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40989026403/artifacts/12948217815) | **CI SUCCESS、元`finish`イベントA各1/B各0、真最終道路・接地、独立QA14/14拒否** |

全て研究ブランチ`p101-velocity-overdrive-native-trial`、[Draft PR #46](https://github.com/ryomashibaba/dopagaki-development-hub/pull/46)のみ。保護元ゲーム`web/p101-w9c2-g4e7ci-integrated-streetscape.mjs`のGit blob SHA `af076d67492a677d2235e4730aef8cdf4808e106` は同一。元ゲーム本体のランナー・衝突・操舵、元B51を一切書き換えず、原B16（17秒/21.5秒の位置・速度・合法操舵・原接地）も4条件全て真正一致。

## 2. なぜ以前の下流道路は走れなかったのか

全7本の元実B48、実メッシュ・両端断面の監査で確定した事実。

- R15S3D8R1の道路4 `p93-VOID_SURGE-01`は最終(100,36,1020)、横幅16mの実道路。
- 元道路5 `p93-PRISM_CREST-01`の最初は(395.814424,30,-277.241151)、**入口幅106m**。中心間**1330.555063m**と横断方向差約106°があり、道路4単体の再接続では危険な裏返りを生じた。
- 元道路5→道路6 `p93-FINISH_RIDGE-01`は中心位置は接続していたが、元幅106m→110m。元の長さ・幾何と、狭幅高速コースの目標を整合していなかった。

そこでR15S3D9は、すでに長距離真正支持を確認したCROWN/SCISSOR/LOWER/VOID_SURGEを**完全保持**し、元道路5・6の**既存実B48制御格子の全31行**を協調改修。既存道路7本のまま、走行する縁と上面を本物の三角形で接続した。道路の行き先を自動生成された球の位置へ追跡させたり、透明なコライダーを加えたりしていない。元最終地点の**中心**座標を保持（元最終道路の横幅・両端形状はPRIVATE候補だけ変更）。

## 3. 2つの本質的に異なる実物理道路案

**A_CONTINUOUS_NARROW_MACRO**：元道路4終端から元道路5最終中心/元道路6入口へ長いHermiteベースの大局線形で連続し、その先の最終道路6まで曲線・法線・実物理断面を一体に構築。物理的に連続した約16m幅の高速度走行路。障害物やRunnerの自動補正は追加しない。

**B_ELEVATED_REAL_GAP_MACRO**：中央線の大局的な曲率・高さを変え、道路5途中に本当に物理面がない2セルの`voidLongitudinalCells`を設置。見えない安全床などによる無理なジャンプ成功はしない。真の飛行からの着地を原CCDで評価し、実際には速度差約167〜169m/sの大きな衝突を記録し下流道路6へ進めずREJECT。

4/4真静的ゲートで、道路4→5/道路5→6の全5頂点実シーム誤差0m、狭幅最小約15.985〜15.997m、サンプル曲面法線隣接角最大0.096〜0.267°、実道路接線の繋がり0.38〜0.72°。旧R2の約171°裏返りを**両案とも静的に排除**。

## 4. 元Runner 240Hz 真正4条件

| 元世界と形状 | 元Runner終端 | 真道路5実接地時間 | 真最終道路6実接地時間 | 元`finish`イベント | 概要 |
|---|---|---:|---:|---:|---|
| true-pinch / A | **69.829167s `finished`** | **10.258333s** | **3.395833s** | **1件** | 実最終道路上で接地して終了 |
| pinch-switch / A | **70.516667s `finished`** | **10.400000s** | **3.433333s** | **1件** | 実最終道路上で接地して終了 |
| true-pinch / B | 61.262500s `failed` | 4.804167s | **0s** | 0件 | 真物理ギャップ後の急変・コース外 |
| pinch-switch / B | 61.845833s `failed` | 4.875000s | **0s** | 0件 | 同様に道路6へ接地できず |

- Aの2条件は、原SCISSOR/LOWER/VOID_SURGE側も元の実走行で維持。CROWN元prefix17秒/21.5秒の位置・速度・合法操舵・元走行面は4/4一致。
- R15S3D8R1の元2条件は終端58.383333/58.895833sで落下。R15S3D9 Aは完全な元Runnerの`finished`に進展した。差を「本番のゲーム完走時間の改善」や「人間操作での成功率」と捏造しない。
- Bの最大240Hz一tick全速度変化は169.435715/167.020198m/s。直接CCD個別インパルスを測定したものではなく、原ステップにおける速度差。自然ギャップを置くだけでは体験の質を保証できないためBは正式棄却。
- 全4条件で**元B51移動物体の接触イベント0**。B51の定義が元のまま28基存在する事実と、その障害物がユーザーの視界に入り挑戦を作る事実は別。現時点では障害物密度・予告・回避・原HUDの公平性の検証が欠落している。

## 5. 正式採否とR15S3D10へ進むための実装要求

- **研究用の次のPRIVATE基準形状**：R15S3D9`A_CONTINUOUS_NARROW_MACRO`。保護CROWN〜道路4と連続した狭幅16m級の真下流道路5/6として、原Runner`finished`と原`finish`イベントを2世界で再現。これを**SOURCE-NATIVE FINISH 2/2 限定PASS**と表現。
- **B**：自然物理ギャップとしては実装されたが、下流走行はFAIL、厳格REJECT。空中を安全床・オートジャンプで埋めて救済しない。
- **正式GAMEPLAY/ART/HUMAN：引き続きHOLD/REJECT**。ソースの「生成・走行に成功」と、実際のゲームとして迫力があり美しく人間が遊べることを混同しない。

**次R15S3D10**では診断コード追加だけでなく、実制作・実プレイに重点を置く。
1. A案の本物の実B48制御格子を、別隔離の**実WebGLネイティブゲームプレビュー**へ接続し、正規カメラ・HUDと一体で描画。元本番・保護元ソースは直接変更せず、許された範囲のPRIVATEデバッグ/比較ハーネスに限定。原描画/physicsデータの一致を検査する。単なる模型や自作SVGは「実WebGL」と偽認定しない。
2. 28 B51の原物理・原時刻姿勢を真正道路沿いで再検査し、実際のプレイヤー走行との相対距離・画面内サイズ・予告秒・可避性を定量化する。障害物を数だけ残すような状態はGAMEPLAY PASSではない。
3. A案の広い長距離路面が単調な高速チューブにならぬよう、10〜16m幅のSlope2 DNA、障害物・自然な分岐/合流/高度変化、元都市四区画の空間・接近/通過/退出リズム、巨大未来都市の**真正3D美術**へ接続。ただし現時点でART認定0件/正式Slope2認定0m、原型8割以上変更等を安易に宣言しない。
4. ユーザー/ヒューマン操舵・初見視認性・回復不能失敗・実WebGLのフレームレート・全7道路の真正完走を別々のQAとして記録。人間が試していないのに人間QAを成功扱いしない。
5. [Draft PR #46](https://github.com/ryomashibaba/dopagaki-development-hub/pull/46)のまま隔離し、本番・main/Gold/P100/元保護blobを守る。正式公開・マージはユーザーの別承認があるまで禁止。

**現在の唯一正式な結論**：R15S3D9 Aにより、全7道路の元240Hz原物理で2元世界とも**本物の`finished`・`finish`イベント・最終路面接地**を確認。これは長期研究の明確な前進だが、実ゲーム統合・美術・人間操作は未達。
