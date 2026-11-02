# G4E-7AT — CROWN THREAD / CHASM SWEEP：真B48の2道路連続コース制作・PRIVATE HOLD

2026-10-24 JST。2本目の実B48道路を「約1.5kmの固定視認性のある空中実コース」として再制作した独立候補。ステージ全体ではASの第1道路とATの第2道路を一体化し、旧Goldは維持。

## 物理的な区間
- 第2道路 CROWN_THREAD：路面にS字左右蛇行（最大23m設定）、上り16m、路面横傾斜2.8m、細道コア約244.97m・実幅12.10〜16.17m。
- 第2道路 CHASM_SWEEP：逆方向に蛇行（最大27m設定）、下降23m、路面横傾斜3.2m、細道コア約294.33m・実幅13.80〜15.98m。
- 合計の**独立した新規実B48細道コア約539.30m**。真の路面補間を160点で積算した弧長であり、約1.5kmは第2道路の設計上の公称長。正式なSlope2 DNA認定値は厳格に0m。
- 2道路の終端、最初のAS真のギャップcell52と離陸再接地、ほか5道路、全路面数7は変更しない。
- 第2道路の元から存在するP95/A13実動体4基について、路面の移動と横向きを追従し、元の運動・当たり判定タイプ・反発強度を維持。残り24基は全く同じ。新しい道に透明な支援床、ボタンジャンプ、速度リセット、固定安全帯を追加しない。

## 検証・限界
- [専用240HzゲートCI #40077679372](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40077679372) SUCCESS。実2道路候補×入力3系列、2.4秒まで走行継続。全長走破や初見人間回避を証明する結果ではない。
- GitHubのPRIVATE buildで`P101_A13_W9C2_G4E7AT_TRUE_PINCH_LOCAL_TRIAL.json`／`...PINCH_SWITCH...`を生成する。従来AL操作・ゲームオーバー直後JSON保存を再利用し、`/drive3d/?g4e7al=manual&g4e7at=crown-chasm`だけで読み込む。外部本番URLには導入しない。
- ただし2.4秒は最初の道路だけである可能性があり、第2道路本体の高速度手動実走行は未証明。Human fairness、ゲームの楽しさ・美術の完成度・7/7到達率と難易度は**HOLD**。既存画面にはなお広いスタート路面・直方体建築の弱点が残る。
- 次AUは、AIによる長距離の連続実走行（真240Hz）・実第2道路への到達と路肩マージン・視野に入る予告時間を測定し、人間へのローカル手動試走を簡単にして改善する。問題があれば実コース制作に戻り、HUDだけを足して合格させない。

**合否：AT_NATIVE_SHORT_PASS / 539.30m_PHYSICAL_CORE_CREATED / NO_HUMAN_PLAY_QUALITY / NO_FORMAL_DNA / PRIVATE_ONLY / PR46_DRAFT_HOLD**。

## 2026-10-24 JST — 完了した統合CI（当該コードHEAD）

対象HEAD：`60445744d9055278da6c284c97dca2c813db2071`（G4E-7AT手動試走統合コード）。専用ゲート [#40077679372](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40077679372) **SUCCESS**（別HEADで実形状検証）、統合 [#40077944798](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40077944798) **全ステップSUCCESS**。
- G4E-7AQ/AR/AS/ATの真240Hz Node検証は全部成功、ASの旧候補は無変更。
- PRIVATE buildでATのTRUE-PINCH/PINCH-SWITCH両JSON生成成功。実Chromiumの19件すべて成功（ATの両道路追加テストを含む）。
- `build:site` と `build:public-safe` の両方でATの非公開生成JSONが混入していないことを確認。
- [CI artifact #12554380582](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40077944798/artifacts/12554380582) に実WebGL画像を保存。画像は開始00の画面であり、新区間到達画像や実人間プレイではない。
- 最初の道路がまだ広く見える点、都市景観が直方体に見える点は**未解決**。539.30mは本当に狭く変形したB48物理弧長だが、人間の楽しさや走破可否、正式Slope2 DNA認定を一切意味しない。
- 新しい `RUN_G4E7AT_MANUAL.cmd` はWindowsローカルでprivate build＋localhostブラウザ起動を1操作化する。ポート4373が未使用でNode.jsがある環境で使う。既存AL/AS起動を変えない。記録JSONは端末に保存し自動アップロードしない。

判定：**PRIVATE_PHYSICS_PASS / CHROMIUM_19_PASS / PUBLIC_ISOLATED / HUMAN_HOLD / ART_HOLD / FORMAL_DNA_0m / NO_MERGE**。
