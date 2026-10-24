# G4E-7AY — CROWN TANGENT BRIDGE：真B48長半径橋とPRIVATE手動240Hz試走

**2026-10-24 JST**、[Draft PR #46](https://github.com/ryomashibaba/dopagaki-development-hub/pull/46) ／ 開発ブランチ `p101-velocity-overdrive-native-trial`。原本AT/AV/AX・Gold・main・本番は変更禁止。

## なぜ今回の変更が必要だったか

AV lineSoftの第1道路改善でようやく第2道路へ到達できたが、CROWN入口u≈.13で離脱。AX longLeadは高速進入を長く設計した結果u≈.20まで実接地できたものの、14.4〜14.7秒で落下。AWは路面を12〜18m程度横に動かす・上下を緩和する手法が改善につながらなかった。よって今回AYでは道路全体の進行軸・曲率・勾配・狭路への移行を**本物の物理格子ごと**再構成した。

## 実装されたゲーム世界

- `scripts/p101-w9c2-g4e7ay-tangent-bridge.mjs`: AX longLeadから独立した非公開候補2案。第2道路u≈.167〜.50の**実B48 31×5制御点**の中盤9列を、前後の接線を利用した長半径の橋と再配置。本物のコライダー・見える路面・内側厚みを生成。原本の第1道路、セル52ギャップ、CHASM、他5道路を維持。
- 本当の14〜16m級コアをu≈.34〜.43へ保護。後半CHASM u≈.63〜.82の狭路はそのまま。入口の広がりは高速域で見通しを作るための遷移で、中央固定安全帯ではない。
- `tangentDeck`は広い視認導入から緩い線形橋へ移行。`bankedSweep`は穏やかな大半径S字と実バンクを追加。実B51-Cの`p95-hazard-01`と`a13-machine-03`を新しい橋の断面方向に追従。その他26動体、障害物挙動の種別は保持。
- 実験用の速度リセット、自動操作、ジャンプボタン、見えない床や直線安全帯は一切追加しない。

## 実走行結果

[AY native 240Hz #40101623682](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40101623682) SUCCESS。[完全JSON](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40101623682/artifacts/12563585098)。

| 正規240Hz・実際の開始00・固定P96（非人間） | AX longLead | AY tangentDeck | AY bankedSweep |
|---|---:|---:|---:|
| TRUE-PINCH 生存秒 | 14.667 | 16.504 | **16.592** |
| TRUE-PINCH 道路2最終接地u | .2057 | .3314 | **.3540** |
| PINCH-SWITCH 生存秒 | 14.400 | 16.367 | **16.654** |
| PINCH-SWITCH 道路2最終接地u | .1991 | .3454 | **.3744** |

- 両道路ともAYは本当のCROWN細道まで接地できている。ただし第2道路の中盤をまだ完走できず、**全7道路のうち訪問2道路のみ**。実B51衝突は0で、主因は再びコースの支持を失うこと。
- 物理CIのPASSは形状保存と計測が成功した事実に過ぎず、ゲームの完走性・実人間操作・プレイヤー視認性・面白さ・美術の合格には置換できない。

## 操作可能な非公開試走

- `?g4e7al=manual&g4e7ay=banked-bridge`：元のAL 2道路比較パネルで`TRUE-PINCH`→`PINCH-SWITCH`を手動A/D実走行。ゲームオーバーから結果JSONをローカル保存可。AIによる操作／自動アップロードなし。
- Windows `RUN_G4E7AY_MANUAL.cmd` は `scripts/launch-g4e7ay-manual.mjs`に接続し、private生成・localhost起動・ブラウザ表示を1操作で行う意図。**Windows実機でのCMD起動試験は未実施**。
- [統合CI #40102058843](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40102058843) **全SUCCESS：Chromium 28/28 PASS、public build / public-safe buildでAY JSONを排除**。 [ブラウザ画像成果物](https://github.com/ryomashibaba/dopagaki-development-hub/actions/runs/40102058843/artifacts/12563447884)。画像はローカルQAのロード・切替証明であり、CROWN中盤の人間試走スクリーンショットではない。

## 次工程AZへの判断

1. **AY bankedSweepを非公開のベスト比較基準**とし、tangentDeckは差分研究用、AX/AV/ATの保護とGold不変更を厳守する。正式採用・公開とは区別。
2. 道路2 u≈.35〜.5で再度路肩へ外れることの要因を調べ、CHASM入口までの高速自然曲率と障害物回避を一つの実デザインとして組み立てる。数mのパラメータ掃引を繰り返さない。
3. 街が遠景で直方体に見える問題、急な下りの見通し、平地でのカメラ安定、障害物が安っぽい問題を**実WebGLの中盤視点**で評価。単に開始00からの画面を撮るだけで美術合格とはしない。
4. 正式Slope2 DNA距離0m、人間QA/ART/PR Ready/Merge/PublishはHOLDのまま。PR46はDraft。

