# G4E-7O｜本物のB48超細道 THREAD/PRECIPICE 実機手動2走QA（2026-10-22 JST）

## 作業目的
前G4E-7NでTHREADの従来P96スクリプトがCROWN実路面側面に激突する理由を特定し、**オフライン幅連動P96だけなら7/7を51.896秒で完走**することを確認。しかしそれは人間の操舵ではない。今回、**ユーザーの実Windows走行から実物理の横余裕、速度、ラフな反応余裕、レンダリングFPS、回復と失敗を計測し、自動送信なしで端末へ直接JSON保存する仕組み**を作る。

## 入口・操作の確定
- `npm run build:private` を `DOPAGAKI_G4E7M_VISUAL=1` 環境下で実行した非公開静的サイトのloopbackに限り、`/drive3d/?g4e7m=on&g4e7o=manual&stage=VB-P101-A13-W9C2-G4E7M-THREAD` を開く。
- 正規スポーン00固定、52m/s開始、OVERDRIVE（元A13の速度）固定、原本B48 7衝突道路とB51-C動体28基そのまま。初回THREAD、終了/中断後に記録ボタンでPRECIPICEへ移行、さらに記録ボタンで2走完成。
- 左右矢印・A/Dの**ユーザー入力だけ**。P96スクリプト・補助ジャンプ・ブースト操作の追加なし。再試走はR。通常ランキング・区間ベストの保存をブロック。G4E-7D既存手動4走やGoldを変更しない。
- 0.1秒ごとの軽い計測（最大1000個）、物理道路に沿うu、横位置v、実断面幅、ボール半径を引いた路肩までの符号付き実m数、接地／空中、速度、入力、接触数、致死の`part:edge`/障害物接触イベント。RAF実FPS中央値と下位10%、カメラ遅延角、物理過負荷フレーム数をJSONに保存。
- 見通し2秒の自己申告・楽しさ1〜5/コメント任意。人間のプレイを証明するのは実Windowsでの本人走行だけ。Playwrightの操作自動化は**UI挙動検査であり人間評価ではない**。
- 試走終了のオーバーレイに `G4E-7O 計測JSONを直接保存`、いつでもパネルの保存ボタンからダウンロード可能。未確定の途中データは `uncommittedCurrentRun` として保存し、正式2走に加えない。
- Gold、本番2サイト、main、G4E-7MのステージJSONと真のB48物理は未改造。正式40% Slope2 DNA認定距離0m・美術品質／人間操作品質HOLD。
- CIは実Chromiumでパネルの表示制限／操作／2走の順序／JSON検証、Gold保護と公開ビルドに候補JSONが存在しないことを確認。**ユーザーの本当のFPSや人間プレイはCIで測定できない。**

次G4E-7Pは実機手動JSONが届いた際に優先解析する。それまではステージを大量に装飾するのではなく、狭路先読みの視覚情報を道路曲率と美術構造から研究する。
## Windows 1アクション起動

ローカルで `RUN_G4E7O_MANUAL.cmd` をダブルクリックすると、
1. Node.jsがあることを確認、2. `DOPAGAKI_G4E7M_VISUAL=1` を**そのプロセスだけ**に設定して非公開ビルドを生成、3. 標準のloopbackサーバー `http://127.0.0.1:4373/` を起動、4. OSの既定ブラウザでG4E-7O THREAD手動試走ページを自動で開く。サーバーを止めるときは起動ウィンドウを閉じる。リポジトリ以外のファイルを書き換えたり自動公開する処理はない。

標準コース・公開バージョンは変更せず、非公開の実Windows QAにはユーザー本人の入力が必要。起動スクリプトのWindowsネイティブ操作は実機がないため未検証で、静的コードQAとChromiumとは区別する。

## 完了ゲート｜G4E-7O 専用 Chromium 実WebGL・2026-10-22 JST

[GitHub Actions #39775557189](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/39775557189) **SUCCESS**。

- Node単体 **4/4 PASS**。B48真实路幅・半径差し引き済み負の路肩余裕・不正ステージ/スポーン拒否・手動2走/中断JSON/非自動送信の回帰を確認。
- Chromium実WebGL **2/2 PASS**。通常起動と`g4e7m=on`単独ではG4E-7Oパネルは出現しない。localhost `g4e7m=on&g4e7o=manual` のみでパネル起動、`THREAD→PRECIPICE`へ一画面内で移行、正規スポーン00・52m/s・OVERDRIVE固定・28移動障害物・camera/renderer/demo無変更/操作ロックを確認。
- 生成した通常のゲーム中UI・人間QAパネルの実Chromium PNG **2枚**、JSON **1ファイル**、artifact **`g4e7o-human-qa-ui-not-human-39775557189`** (ID `12425251292`) を保存。JSONでは`realHumanTest=false`と明記されている。
- UI操作テストにおける**途中特記録**：THREAD `INTERRUPTED_NOT_A_CLEAR` 物理ステップ349・RAF中央値59.5fps、PRECIPICE `INTERRUPTED_NOT_A_CLEAR` 357ステップ・59.9fps。これはテストホストのChromium計測であり、ユーザーWindowsの実FPS、ゲーム操作性、人間の完走/公平性の証拠ではない。
- private 99ファイル、public98、public-safe5の3ビルド成功。公開生成フォルダから未承認THREAD/PRECIPICEの実B48 JSONを除外したことを検証。元Gold・A13/B5自動nativeは変更していない。
- JSON`completedBoth=true`は**2回の記録操作が揃ったことだけ**を示し、`status=INTERRUPTED_NOT_A_CLEAR`、`humanInputNotProvenByAutomation=true`、`fairnessCertified=false`、`certifiedSlope2Meters=0` が揃うため、**「人間が2本完走した」などの誤解は禁止**。

追加した `RUN_G4E7O_MANUAL.cmd` は1クリックでNodeから保護されたプライベート生成→127.0.0.1:4373のサーバー→デフォルトブラウザへ遷移するよう実装。**Windows現物での起動/セキュリティダイアログの実動作は未実施**。利用者はリポジトリを手元に置きNode.jsをインストールする必要がある。

### 判定・次工程
**実装・Node・Chromium・公開隔離テスト PASS**。本人の実際のWindows運転2走、ゲームの楽しさ/視認、特にCROWNの狭路での自由操舵は依然**未実施/HOLD**。そのJSONを入手した場合にG4E-7Pで優先分析する。人間評価が届くまではCIの疑似「人間操作」を根拠に正式採択しない。PR #46 Draft未マージ、main・Gold・本番2サイト非変更。正式Slope2 DNA採択0m。
