# W9-C2 G4E-7H — 3D Road Readability / HUD Focus Candidate

Status: PRIVATE VISUAL RESEARCH ONLY / HUMAN HOLD / DNA 0m.

前工程G4E-7Gの8実WebGL画像では、SKYLINEのS字の差が控えめな一方、CROWNではGold 116.07m→glide 78.30mの物理路面幅差が実際に見えた。左下の路肩表示、右下の動体事前警告、中央上の巨大チャプターバナー、右上の開発注記が走行視界を圧迫していた。まず**実道路形状を勝手に改変せず、表示の見やすさだけ**切り出して比較する。

## 今回の実験
- URLに `g4e7g=on&g4e7h=candidate&g4e7gFrame=hold` を同時指定したローカルホストのG4E-7G Golden/Glideの実体ステージのみ有効。通常のGold、G4E-7D手動ギャップQA、公開2サイトには視認性変更を入れない。
- `G4E-7H HUD BASELINE/FOCUS` ボタンを新設。同じWebGLを一時停止したまま切替える。物理、カメラ位置/速度、B48、B51-C、28動体、G5-C1、入力、記録、スコアには触れない。
- BASELINEは既存HTML/CSS完全原本。FOCUSは開発用右上「NOT FINAL」札のみ非表示とし、従来の長文はサイドのステージ状態へ残す。速度は左上に小さく維持、章名は上部の短いリボン、左下の本物の端/バンク表示は左上に移動、右下の危険物距離/予測時間/左右予測は内容を削除せず右上へ移動。左右ボタンを46px以上の物理サイズに維持して少し省スペース化。
- 観察範囲を描画viewportのx=6–94%・y=25–92%に限定し、重複を除いたHUD占有CSS矩形の面積を計測。同一G4E-7GスポーンGold/Glide×SKYLINE/CROWNの4画面でBASELINEとFOCUSを切替、計8枚のWebGL2 PNGとJSONを残す。同一画面内の比較は物理時刻、カメラ追従方式、スポーン、危険予告の本文が完全に等しいことを検証する。
- Goldとglide間は道路の世界位置が違うので**同一世界座標/同一画像だとは主張しない**。現時点で人間の視認時間、反応、Windows実機FPS、Steam品質を試験していない。

## 残る課題
同じ停止画面でHUD占有量が減っても、操作中に必要な情報が一目でわかるとは限らない。視線移動、難易度、端の見えやすさは人間の走行QAで審査する。G4E-7Dも独立して継続HOLD。40%目標に向けた正式距離は0m。PR #46はDraftのまま、main/Gold/公開サイト/以前の研究候補を守る。
